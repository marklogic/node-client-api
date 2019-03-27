/*
 * Copyright 2014-2019 MarkLogic Corporation
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
var Kerberos              = require('./optional.js')
                            .libraryProperty('kerberos', 'Kerberos');
var Multipart             = require('multipart-stream');
var through2              = require('through2');
var mlutil                = require('./mlutil.js');
var responder             = require('./responder.js');

var kerberos = null;

function createAuthenticator(client, user, password, challenge) {
  var authenticator = createAuthInitializer.call(null, user, password)(challenge);
  if (!client.authenticator) {
    client.authenticator = {};
  }
  client.authenticator[user] = authenticator;
  return authenticator;
}

function createAuthenticatorKerberos(client, credentials) {
  var authenticatorKerberos = {
    "credentials": credentials
  };
  client.authenticatorKerberos = authenticatorKerberos;
  return authenticatorKerberos;
}

function getAuthenticator(client, user) {
  if (!client.authenticator) {
    return null;
  }
  return client.authenticator[user];
}

function getAuthenticatorKerberos(client) {
  if (!client.authenticatorKerberos) {
    return null;
  }
  return client.authenticatorKerberos;
}

function startRequest(operation) {
  var options = operation.options;
  var operationErrorListener = responder.operationErrorListener;
  operation.errorListener = mlutil.callbackOn(operation, operationErrorListener);

  var headers = options.headers;
  if (headers == null) {
    headers = {};
    options.headers = headers;
  }
  headers['X-Error-Accept'] = 'application/json';
  headers['ML-Agent-ID'] = 'nodejs'; // Telemetry header

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

  const authType = options.authType.toUpperCase();
  var needsAuthenticator = (
      authType === 'DIGEST' ||
      authType === 'KERBEROS'
  );
  var authenticator = null;
  if (needsAuthenticator) {
    switch(authType) {
      case 'DIGEST':
        authenticator = getAuthenticator(operation.client, options.user);
        break;
      case 'KERBEROS':
        authenticator = getAuthenticatorKerberos(operation.client);
        break;
    }
  }
  if (needsAuthenticator && (authenticator == null)) {
    switch(authType) {
      case 'DIGEST':
        challengeRequest(operation, requester);
        break;
      case 'KERBEROS':
        credentialsRequest(operation, requester);
        break;
    }
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
  var isRead        = (requester == null);
  var options       = operation.options;
  var challengeOpts = isRead ? options : {
    method:     'HEAD',
    path:       '/v1/ping'
  };
  if (!isRead) {
    Object.keys(options).forEach(function optionKeyCopier(key) {
      if (challengeOpts[key] === void 0) {
        var value = options[key];
        if (value != null) {
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
    var hasChallenge  = (challenge != null);

    operation.logger.debug('response with status %d and %s challenge for %s',
        statusCode1, hasChallenge, challengeOpts.path);
    if ((statusCode1 === 401 && hasChallenge) || (successStatus && !isRead)) {
      var authenticator = (hasChallenge) ? createAuthenticator(
          operation.client, options.user, options.password, challenge
          ) : null;
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
function credentialsRequest(operation, requester) {
  kerberos = new Kerberos();
  var uri = "HTTP@"+operation.options.host;
  kerberos.authGSSClientInit(uri, 0, function(err, ctx) {
    if (err) {
      operation.errorListener('kerberos initialization failed at '+uri);
    }
    operation.logger.debug('kerberos initialized at '+uri);
    kerberos.authGSSClientStep(ctx, "", function (err) {
      if (err) {
        operation.errorListener('kerberos credentials failed');
      }
      operation.logger.debug('kerberos credentials retrieved');
      var authenticator = createAuthenticatorKerberos(
        operation.client,
        ctx.response
      );
      authenticatedRequest(operation, authenticator, requester);
      kerberos.authGSSClientClean(ctx, function(err) {
        if (err) {
          operation.errorListener('kerberos client clean failed');
        }
      });
    });
  });
}
function authenticatedRequest(operation, authenticator, requester) {
  var isRead  = (requester == null);
  var options = operation.options;
  operation.logger.debug('authenticated request for %s', options.path);
  var responseDispatcher = responder.responseDispatcher;
  var request = operation.client.request(
      options, mlutil.callbackOn(operation, responseDispatcher)
      );
  const authType = options.authType.toUpperCase();
  if (authenticator != null) {
    switch(authType) {
      case 'DIGEST':
        operation.logger.debug('digest authentication');
        request.setHeader(
            'authorization',
            authenticator.authorize(options.method, options.path)
        );
        break;
      case 'KERBEROS':
        operation.logger.debug('kerberos authentication');
        request.setHeader(
            'authorization',
            "Negotiate "+authenticator.credentials
        );
        break;
    }
  } else {
    switch(authType) {
      case 'SAML':
        operation.logger.debug('saml authentication');
        request.setHeader(
            'authorization',
            options.auth
        );
        break;
    }
  }
  request.on('error', operation.errorListener);
  if (isRead) {
    request.end();
  } else {
    requester.call(operation, request);
  }
}

function singleRequester(request) {
  /*jshint validthis:true */
  var operation = this;

  var requestSource = mlutil.marshal(operation.requestBody);
  if (requestSource == null) {
    request.end();
  } else if (typeof requestSource === 'string' || requestSource instanceof String) {
    request.write(requestSource, 'utf8');
    request.end();
  // readable stream might not inherit from ReadableStream
  } else if (typeof requestSource._read === 'function') {
    requestSource.pipe(request);
  } else {
    request.write(requestSource);
    request.end();
  }
}
function multipartRequester(request) {
  /*jshint validthis:true */
  var operation = this;

  var operationBoundary = operation.multipartBoundary;
  var multipartStream = new Multipart((operationBoundary == null) ?
        mlutil.multipartBoundary : operationBoundary);

  var requestPartsProvider = operation.requestPartsProvider;
  if (typeof requestPartsProvider === 'function') {
    requestPartsProvider.call(operation, multipartStream);
  } else {
    var parts = operation.requestPartList;
    if (Array.isArray(parts)) {
      var partsLen = parts.length;
      operation.logger.debug('writing %s parts', partsLen);
      for (var i=0; i < partsLen; i++) {
        var part = parts[i];
        var headers = part.headers;
        var content = part.content;
        if ((headers != null) &&
            (content != null)) {
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
  if (requestWriter === null || requestWriter === undefined) {
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
  if (requestWriter == null) {
    operation.errorListener('no request writer for streaming request');
    request.end();
  } else if (requestDocument == null) {
    operation.errorListener('no request document for streaming request');
    request.end();
  } else {
    var operationBoundary = operation.multipartBoundary;

    var multipartStream = new Multipart((operationBoundary == null) ?
        mlutil.multipartBoundary : operationBoundary);

    var partLast = requestDocument.length - 1;
    for (var i=0; i <= partLast; i++) {
      var part = requestDocument[i];
      var headers = part.headers;
      if (i < partLast) {
        var content = part.content;
        if ((headers != null) &&
            (content != null)) {
          multipartStream.addPart({
            headers: headers,
            body:    mlutil.marshal(content)
            });
        } else {
          operation.logger.debug('could not write metadata part');
        }
      } else {
        if (headers != null) {
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
