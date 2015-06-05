/*
 * Copyright 2014-2015 MarkLogic Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';
var createAuthInitializer = require('www-authenticate');
var Multipart             = require('multipart-stream');
var through2              = require('through2');
var valcheck              = require('core-util-is');
var mlutil                = require('./mlutil.js');
var responder             = require('./responder.js');

function createAuthenticator(client, user, password, challenge) {
  var authenticator = createAuthInitializer.call(null, user, password)(challenge);
  if (!client.authenticator) {
    client.authenticator = {};
  }
  client.authenticator[user] = authenticator;
  return authenticator;
}

function getAuthenticator(client, user) {
  if (!client.authenticator) {
    return null;
  }
  return client.authenticator[user];
}

function startRequest(operation) {
  var options = operation.options;
  var operationErrorListener = responder.operationErrorListener;
  operation.errorListener = mlutil.callbackOn(operation, operationErrorListener);

  var headers = options.headers;
  if (valcheck.isNullOrUndefined(headers)) {
    headers = {};
    options.headers = headers;
  }
  headers['X-Error-Accept'] = 'application/json';

  var started                = null;
  var operationResultPromise = null;

  var requester = null;
  switch(operation.requestType) {
  case 'empty':
    break;
  case 'single':
    requester = singleRequester;
    break;
  case 'multipart':
    requester = multipartRequester;
    break;
  case 'chunked':
    operationResultPromise = responder.operationResultPromise;
    started = through2();
    started.result = mlutil.callbackOn(operation, operationResultPromise);
    operation.requestWriter = started;
    requester = chunkedRequester;
    break;
  case 'chunkedMultipart':
    operationResultPromise = responder.operationResultPromise;
    started = through2();
    started.result = mlutil.callbackOn(operation, operationResultPromise);
    operation.requestWriter = started;
    requester = chunkedMultipartRequester;
    break;
  default:
    throw new Error('unknown request type '+operation.requestType);
  }

  var needsAuthenticator = (options.authType.toUpperCase() === 'DIGEST');
  var authenticator = (!needsAuthenticator) ? null :
    getAuthenticator(operation.client, options.user);
  if (needsAuthenticator && valcheck.isNullOrUndefined(authenticator)) {
    challengeRequest(operation, requester);
  } else {
    authenticatedRequest(operation, authenticator, requester);
  }

  if (started === null) {
    var ResponseSelector = responder.ResponseSelector;
    started = new ResponseSelector(operation);
  }

  return started;
}
function challengeRequest(operation, requester) {
  var isRead        = valcheck.isNullOrUndefined(requester);
  var options       = operation.options;
  var challengeOpts = isRead ? options : {
    method:     'HEAD',
    path:       '/v1/ping'
  };
  if (!isRead) {
    Object.keys(options).forEach(function optionKeyCopier(key) {
      if (valcheck.isUndefined(challengeOpts[key])) {
        var value = options[key];
        if (!valcheck.isNullOrUndefined(value)) {
          challengeOpts[key] = value;
        }
      }
    });
  }

  operation.logger.debug('challenge request for %s', challengeOpts.path);
  var request1 = operation.client.request(challengeOpts, function challengeResponder(response1) {
    var statusCode1   = response1.statusCode;
    var successStatus = (statusCode1 < 400);
    var challenge     = response1.headers['www-authenticate'];
    var hasChallenge  = !valcheck.isNullOrUndefined(challenge);

    operation.logger.debug('response with status %d and %s challenge for %s',
        statusCode1, hasChallenge, challengeOpts.path);
    if ((statusCode1 === 401 && hasChallenge) || (successStatus && !isRead)) {
      var authenticator = (hasChallenge) ? createAuthenticator(
          operation.client, options.user, options.password, challenge
          ) : null;
      response1.destroy();
      authenticatedRequest(operation, authenticator, requester);
    // should never happen
    } else if (successStatus && isRead) {
      var responseDispatcher = responder.responseDispatcher;
      responseDispatcher.call(operation, response1);
    } else {
      operation.errorListener('challenge request failed for '+options.path);
    }
  });

  request1.on('error', operation.errorListener);
  request1.end();
}
function authenticatedRequest(operation, authenticator, requester) {
  var isRead  = valcheck.isNullOrUndefined(requester);
  var options = operation.options;
  operation.logger.debug('authenticated request for %s', options.path);
  var responseDispatcher = responder.responseDispatcher;
  var request = operation.client.request(
      options, mlutil.callbackOn(operation, responseDispatcher)
      );
  if (!valcheck.isNullOrUndefined(authenticator)) {
    request.setHeader('authorization',
        authenticator.authorize(options.method, options.path)
        );
  }
  request.on('error', operation.errorListener);
  if (isRead) {
    request.end();
  } else {
    requester.call(operation, request);
  }
  return request;
}

function singleRequester(request) {
  /*jshint validthis:true */
  var operation = this;

  var requestBodyProvider = operation.requestBodyProvider;
  if (valcheck.isFunction(requestBodyProvider)) {
    requestBodyProvider.call(operation, request);
  } else {
    var requestSource = mlutil.marshal(operation.requestBody);
    if (valcheck.isNullOrUndefined(requestSource)) {
      request.end();
    } else if (valcheck.isString(requestSource)) {
      request.write(requestSource, 'utf8');
      request.end();
    // readable stream might not inherit from ReadableStream
    } else if (valcheck.isFunction(requestSource._read)) {
      requestSource.pipe(request);
    } else {
      request.write(requestSource);
      request.end();
    }
  }
}
function multipartRequester(request) {
  /*jshint validthis:true */
  var operation = this;

  var operationBoundary = operation.multipartBoundary;
  var multipartStream = new Multipart(valcheck.isNullOrUndefined(operationBoundary) ?
        mlutil.multipartBoundary : operationBoundary);

  var requestPartsProvider = operation.requestPartsProvider;
  if (valcheck.isFunction(requestPartsProvider)) {
    requestPartsProvider.call(operation, multipartStream);
  } else {
    var parts = operation.requestPartList;
    if (valcheck.isArray(parts)) {
      var partsLen = parts.length;
      operation.logger.debug('writing %s parts', partsLen);
      for (var i=0; i < partsLen; i++) {
        var part = parts[i];
        var headers = part.headers;
        var content = part.content;
        if (!valcheck.isNullOrUndefined(headers) &&
            !valcheck.isNullOrUndefined(content)) {
          operation.logger.debug('starting part %s', i);
          multipartStream.addPart({
            headers: headers,
            body:    content
            });
          operation.logger.debug('finished part %s', i);
        } else {
          operation.logger.debug('nothing to write for part %d', i);
        }
      }    
    } else {
      operation.logger.debug('no part list to write');
    }    
  }

  multipartStream.pipe(request);
}
function chunkedRequester(request) {
  /*jshint validthis:true */
  var operation = this;

  var requestWriter = operation.requestWriter;
  if (valcheck.isNullOrUndefined(requestWriter)) {
    operation.errorListener('no request writer for streaming request');
    request.end();
  }

  requestWriter.pipe(request);
}
function chunkedMultipartRequester(request) {
  /*jshint validthis:true */
  var operation = this;

  var requestWriter = operation.requestWriter;
  var requestDocument = operation.requestDocument;
  if (valcheck.isNullOrUndefined(requestWriter)) {
    operation.errorListener('no request writer for streaming request');
    request.end();
  } else if (valcheck.isNullOrUndefined(requestDocument)) {
    operation.errorListener('no request document for streaming request');
    request.end();
  } else {
    var operationBoundary = operation.multipartBoundary;

    var multipartStream = new Multipart(valcheck.isNullOrUndefined(operationBoundary) ?
        mlutil.multipartBoundary : operationBoundary);

    var partLast = requestDocument.length - 1;
    for (var i=0; i <= partLast; i++) {
      var part = requestDocument[i];
      var headers = part.headers;
      if (i < partLast) {
        var content = part.content;
        if (!valcheck.isNullOrUndefined(headers) &&
            !valcheck.isNullOrUndefined(content)) {
          multipartStream.addPart({
            headers: headers,
            body:    mlutil.marshal(content)
            });
        } else {
          operation.logger.debug('could not write metadata part');
        }        
      } else {
        if (!valcheck.isNullOrUndefined(headers)) {
          multipartStream.addPart({
            headers: headers,
            body:    requestWriter
            });
        } else {
          operation.logger.debug('could not write content part');
        }        
      }
    }

    multipartStream.pipe(request);
  }
}

module.exports = {
    startRequest: startRequest
};
