/*
 * Copyright 2014 MarkLogic Corporation
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
var util                  = require("util");
var events                = require("events");
var http                  = require('http');
var https                 = require('https');
var concatStream          = require('concat-stream');
var createAuthInitializer = require('www-authenticate');
var createMultipartStream = require('multipart').createMultipartStream;
var Dicer                 = require('dicer');
var YAgent                = require('yakaa');
var Promise               = require("bluebird");
var through2              = require('through2');
var valcheck              = require('core-util-is');
var winston               = require('winston');
var mlutil                = require('./mlutil.js');

var multipartBoundary = 'MLBOUND_' + Date.UTC(2014,12,31);

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

function parsePartHeaders(headers) {
  var partHeaders = {};

  var contentDispositionArray = headers['content-disposition'];
  if (valcheck.isArray(contentDispositionArray) &&
      contentDispositionArray.length > 0) {
    var contentDisposition = contentDispositionArray[0];
    if (contentDisposition.substring(contentDisposition.length) !== ';') {
      contentDisposition += ';';
    }

    var tokens = contentDisposition.match(/"[^"]*"|;|=|[^";=\s]+/g);
    var key   = null;
    var value = null;
    for (var i=0; i < tokens.length; i++) {
      var token = tokens[i];
      switch(token) {
      case ';':
        if (key) {
          if (value) {
            if (key === 'filename') {
              key = 'uri';
              value = value.substring(1,value.length - 1);
            }

            var currentValue = partHeaders[key];
            if (!currentValue) {
              partHeaders[key] = value;
            } else if (currentValue instanceof Array) {
              currentValue.push(value);
            } else {
              partHeaders[key] = [currentValue, value];
            }

            value = null;
          } else if (key === 'inline' || key === 'attachment') {
            partHeaders.partType = key;
          }

          key = null;
        }
        break;
      case '=':
        break;
      default:
        if (!key) {
          key   = token;
        } else {
          value = token;
        }
        break;
      }
    }
  }

  var contentTypeArray = headers['content-type'];
  if (valcheck.isArray(contentTypeArray) && contentTypeArray.length > 0) {
    partHeaders.contentType = contentTypeArray[0];
  }

  var contentLengthArray = headers['content-length'];
  if (valcheck.isArray(contentLengthArray) && contentLengthArray.length > 0) {
    partHeaders.contentLength = contentLengthArray[0];
  }

  return partHeaders;
}  

function contentTypeToFormat(contentType) {
  if (contentType === undefined || contentType === null) {
    return null;
  }

  var fields = contentType.split(/[\/+]/);
  switch(fields[0]) {
  case 'application':
    switch(fields[fields.length - 1]) {
    case 'json':
      return 'json';
    case 'xml':
      return 'xml';
    }
    break;
  case 'text':
    switch(fields[fields.length - 1]) {
    case 'json':
      return 'json';
    case 'xml':
      return 'xml';
    default:
      return 'text';
    }
    break;
  }

  return null;
}

function initClient(client, inputParams) {
  var connectionParams = {};
  var keys = ['host', 'port', 'database', 'user', 'password', 'authType'];
  for (var i=0; i < keys.length; i++) {
    var key = keys[i];
    var value = inputParams[key];
    if (!valcheck.isNullOrUndefined(value)) {
      connectionParams[key] = value;
    } else if (key === 'host') {
      connectionParams.host = 'localhost'; 
    } else if (key === 'port') {
      connectionParams.port = 8000; 
    } else if (key === 'authType') {
      connectionParams.authType = 'DIGEST'; 
    }
  }

  if (connectionParams.authType.toUpperCase() !== 'NONE' && (
      valcheck.isNullOrUndefined(connectionParams.user) ||
      valcheck.isNullOrUndefined(connectionParams.password)
      )) {
    throw new Error('cannot create client without user or password for '+
      connectionParams.host+' host and '+
      connectionParams.port+' port'
      );
  }

  client.connectionParams = connectionParams;

  if (connectionParams.authType.toUpperCase() !== 'DIGEST') {
    connectionParams.auth =
      connectionParams.user+':'+connectionParams.password;
  }

  var isSSL = valcheck.isNullOrUndefined(inputParams.ssl) ?
    false : inputParams.ssl;

  var noAgent = valcheck.isNullOrUndefined(inputParams.agent);
  var agentOptions = noAgent ? {
    keepAlive: true
  } : null;
  if (isSSL) {
    client.request = https.request;
    if (noAgent) {
      ['ca', 'cert', 'ciphers', 'key', 'passphrase', 'pfx',
       'rejectUnauthorized', 'secureProtocol'].
      forEach(function(key) {
        var value = inputParams[key];
        if (!valcheck.isNullOrUndefined(value)) {
          agentOptions[key] = value;
        }
      });
      connectionParams.agent = new YAgent.SSL(agentOptions);
    }
  } else {
    client.request = http.request;
    if (noAgent) {
      connectionParams.agent = new YAgent(agentOptions);
    }
  }
}  
function releaseClient() {
  var client = this;
  var agent = client.connectionParams.agent;
  if (valcheck.isNullOrUndefined(agent)){
    return;
  }
  agent.destroy();
}

function startRequest(operation) {
  var options = operation.options;

  var started = null;

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
    started = through2();
    started.pause();
    started.result = operation.resultPromise;
    operation.requestWriter = started;
    requester = chunkedRequester;
    break;
  case 'chunkedMultipart':
    started = through2();
    started.pause();
    started.result = operation.resultPromise;
    operation.requestWriter = started;
    requester = chunkedMultipartRequester;
    break;
  default:
    throw new Error('unknown request type '+operation.requestType);
  }

  var responder = null;
  switch(operation.responseType) {
  case 'empty':
    responder = emptyResponder;
    break;
  case 'single':
    responder = singleResponder;
    break;
  case 'multipart':
    responder = multipartResponder;
    break;
  default:
    throw new Error('unknown request type '+operation.responseType);
  }

  var needsAuthenticator = (options.authType.toUpperCase() === 'DIGEST');
  var authenticator = (!needsAuthenticator) ? null :
    getAuthenticator(operation.client, options.user);
  if (needsAuthenticator && valcheck.isNullOrUndefined(authenticator)) {
    challengeRequest(operation, requester, responder);
  } else {
    authenticatedRequest(operation, authenticator, requester, responder);
  }

  if (started === null) {
    started = createSelector(operation);
  }

  return started;
}
function challengeRequest(operation, requester, responder) {
  var isRead        = valcheck.isNullOrUndefined(requester);
  var options       = operation.options;
  var challengeOpts = isRead ? options : {
    method:     'HEAD',
    path:       '/v1/ping'
  };
  if (!isRead) {
    Object.keys(options).forEach(function(key) {
      if (valcheck.isUndefined(challengeOpts[key])) {
        var value = options[key];
        if (!valcheck.isNullOrUndefined(value)) {
          challengeOpts[key] = value;
        }
      }
    });
  }

  operation.logger.debug('challenge request for %s', challengeOpts.path);
  var request1 = operation.client.request(challengeOpts, function(response1) {
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
      response1.on('error', operation.errorListener);
      response1.on('end', function() {
        authenticatedRequest(operation, authenticator, requester, responder);
      });
      response1.resume();
    // should never happen
    } else if (successStatus && isRead) {
      responder.call(operation, response1);
    } else {
      operation.dispatchEndError('challenge request failed for '+options.path);
    }
  });

  request1.on('error', operation.errorListener);
  request1.end();
}
function authenticatedRequest(operation, authenticator, requester, responder) {
  var isRead  = valcheck.isNullOrUndefined(requester);
  var options = operation.options;
  operation.logger.debug('authenticated request for %s', options.path);
  var request = operation.client.request(
      options, mlutil.callbackOn(operation, responder)
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
  var operation = this;

  var requestBodyProvider = operation.requestBodyProvider;
  if (valcheck.isFunction(requestBodyProvider)) {
    requestBodyProvider.call(operation, request);
  } else {
    var requestSource = marshal(operation.requestBody);
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
  var operation = this;

  var operationBoundary = operation.multipartBoundary;
  var multipartStream = createMultipartStream({
    prefix: valcheck.isNullOrUndefined(operationBoundary) ?
        multipartBoundary : operationBoundary
  });

/* TODO: better stream spy
  var debugLevel = winston.levels['debug'];
  var logLevel   = winston.levels[operation.logger.transports.Console.level];
  if (logLevel >= debugLevel) {
  if (false) {
    multipartStream.pipe(through2(function(chunk, encoding, done) {
      operation.logger.debug(chunk.toString());
      this.push(chunk);
      done();
      })).
    pipe(request);
  } else {
    multipartStream.pipe(request);
  }
 */
  multipartStream.pipe(request);
  multipartStream.resume();

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
          // readable stream might not inherit from ReadableStream
          if (valcheck.isFunction(content._read)) {
            content.pause();
          }
          multipartStream.write(headers, content);
          operation.logger.debug('finished part %s', i);
        } else {
          operation.logger.debug('nothing to write for part %d', i);
        }
      }    
    } else {
      operation.logger.debug('no part list to write');
    }    
  }

  multipartStream.end();
}
function chunkedRequester(request) {
  var operation = this;

  var requestWriter = operation.requestWriter;
  if (valcheck.isNullOrUndefined(requestWriter)) {
    operation.dispatchEndError('no request writer for streaming request');
    request.end();
  }

  requestWriter.pipe(request);
  requestWriter.resume();
}
function chunkedMultipartRequester(request) {
  var operation = this;

  var requestWriter = operation.requestWriter;
  var requestDocument = operation.requestDocument;
  if (valcheck.isNullOrUndefined(requestWriter)) {
    operation.dispatchEndError('no request writer for streaming request');
    request.end();
  } else if (valcheck.isNullOrUndefined(requestDocument)) {
    operation.dispatchEndError('no request document for streaming request');
    request.end();
  } else {
    var operationBoundary = operation.multipartBoundary;

    var multipartStream = createMultipartStream({
      prefix: valcheck.isNullOrUndefined(operationBoundary) ?
          multipartBoundary : operationBoundary
    });
    multipartStream.pipe(request);

    var partLast = requestDocument.length - 1;
    for (var i=0; i <= partLast; i++) {
      var part = requestDocument[i];
      var headers = part.headers;
      if (i < partLast) {
        var content = part.content;
        if (!valcheck.isNullOrUndefined(headers) &&
            !valcheck.isNullOrUndefined(content)) {
          multipartStream.write(headers, marshal(content));
        } else {
          operation.logger.debug('could not write metadata part');
        }        
      } else {
        if (!valcheck.isNullOrUndefined(headers)) {
          multipartStream.write(headers, requestWriter);
        } else {
          operation.logger.debug('could not write content part');
        }        
      }
    }

    requestWriter.resume();
    multipartStream.end();
  }
}

function emptyResponder(response) {
  var operation = this;

  if (!isResponseStatusOkay.call(operation, response)) {
    return;
  }
  response.on('error', operation.errorListener);

  operation.copyResponseHeaders(response);

  operation.dispatchEmpty();

  response.resume();
}
function singleResponder(response) {
  var operation = this;

  if (!isResponseStatusOkay.call(operation, response)) {
    return;
  }
  response.on('error', operation.errorListener);

  var isString = operation.copyResponseHeaders(response);

  if (operation.outputStreamMode === 'chunked') {
    var outputStream = operation.outputStream;
    if (valcheck.isNullOrUndefined(outputStream)) {
      operation.dispatchEndError('no output stream to consume response');
      response.resume();
    } else {
      response.pipe(outputStream);
    }    
  } else {
    var bodyReader = concatStream(
        {encoding: (isString ? 'string' : 'buffer')},
        mlutil.callbackOn(operation, dispatchBody)
        );
      bodyReader.on('error', operation.errorListener);
      response.pipe(bodyReader);
  }
}
function multipartResponder(response) {
  var operation = this;

  if (!isResponseStatusOkay.call(operation, response)) {
    return;
  }
  response.on('error', operation.errorListener);

  // TODO: bulk read should insert parts for documents that don't exist
  // TODO: empty response should not be multipart/mixed 
  var responseLength = response.headers['content-length'];
  if (valcheck.isNullOrUndefined(responseLength)|| responseLength === "0") {
    // operation.dispatchEndError('empty multipart response');
    operation.logger.debug('empty multipart response');
    operation.dispatchEmpty();
    response.resume();
    return;
  }

  var responseType = response.headers['content-type'];
  var responseBoundary = valcheck.isNullOrUndefined(responseType) ? null :
    responseType.replace(/^multipart.mixed;\s*boundary\s*=\s*([^\s;]+)([\s;].*)?$/, '$1');
  if (valcheck.isNullOrUndefined(responseBoundary)) {
    operation.dispatchEndError('response without multipart/mixed mime type or boundary');
    return;
  }
  if (responseBoundary !== multipartBoundary) {
    operation.logger.debug(
        'expected '+multipartBoundary+
        ' but received '+responseBoundary+' multipart/mixed boundary'
        );
  }

  var parser = new Dicer({boundary: responseBoundary});

  operation.initPartParser(parser);

  response.pipe(parser);
}

function isResponseStatusOkay(response) {
  var operation = this;

  var statusCode = response.statusCode;

  var errMsg = null;

  var statusCodeValidator = operation.statusCodeValidator;
  if (valcheck.isFunction(statusCodeValidator)) {
    errMsg = statusCodeValidator.call(operation, statusCode);
  } else {
    var validStatusCodes = operation.validStatusCodes;
    if (valcheck.isArray(validStatusCodes)) {
      var isError = true;
      for (var i=0; i < validStatusCodes.length; i++) {
        if (validStatusCodes[i] === statusCode) {
          isError = false;
          break;
        }
      }
      if (isError) {
        errMsg = 'response with invalid '+statusCode+' status';
      }
    } else if (statusCode >= 300) {
      errMsg = 'cannot process response with '+statusCode+' status';
    }
  }

  if (errMsg !== null) {
    var clientError = operation.makeError(errMsg);
    clientError.statusCode = statusCode;
    if (statusCode >= 400) {
      response.pipe(concatStream(
          {encoding: 'string'},
          function(body) {
            if (valcheck.isString(body) && body.length > 0) {
              var contentType = response.headers['content-type'];
              clientError.body =
                (valcheck.isString(contentType) &&
                    contentType.match(/^application\/json(;.*)?$/)) ?
                JSON.parse(body) : body;
            }
            operation.dispatchEndError(clientError);
          }));
    } else {
      operation.dispatchEndError(clientError);
      response.resume();
    }

    return false;
  }

  return true;
}

function Operation(name, client, options, requestType, responseType) {
  this.name              = name;
  this.client            = client;
  this.logger            = client.getLogger();
  this.options           = options;
  this.requestType       = requestType;
  this.responseType      = responseType;
  this.validStatusCodes  = null;
  // TODO: confirm use of responseTransform and partTransform
  this.responseTransform = null;
  this.partTransform     = null;
  this.errorTransform    = null;
  // listeners and other callbacks usable out of context
  this.errorListener     = mlutil.callbackOn(this, dispatchEndError);
  this.resultPromise     = mlutil.callbackOn(this, operationResultPromise);
  this.resultStream      = null;
  this.outputStream      = null;
  this.streamDefaultMode = 'object';
  this.streamModes       = this.STREAM_MODES_CHUNKED_OBJECT;
}
Operation.prototype.STREAM_MODES_CHUNKED_OBJECT = {chunked: true, object: true};

function createOperation(name, client, options, requestType, responseType) {
  return new Operation(name, client, options, requestType, responseType);
}
function createSelector(operation) {
  var resultStream       = mlutil.callbackOn(operation, operationResultStream);
  operation.resultStream = resultStream;
  return {
    result: operation.resultPromise,
    stream: resultStream
  };
}

function initPartParser(parser) {
  var operation = this;

  /* Note on multipart parsing:
   * determinate:   header1, parseStart1, header2, parseStart2, ..., finish
   * indeterminate: header1, header2, parseEnd1, parseEnd2
   * The sequence is important because it could reflect ranking,
   * so the current implementation uses a small FIFO queue.
   */
  operation.partQueue   = [];
  operation.nextPart    = 0;
  operation.hasFinished = false;

  parser.on('part',   mlutil.callbackOn(operation, partListener));
  parser.on('finish', mlutil.callbackOn(operation, partFinishListener));
  parser.on('error',  operation.errorListener);
}
Operation.prototype.initPartParser = initPartParser;
function partListener(part) {
  var operation = this;

  var partResponder = new PartResponder(operation, part);
  operation.partQueue.push(partResponder);

  part.on('error', operation.errorListener);
  part.on('header', partResponder.headersListener);

  var partReader = null;
  if (operation.outputStreamMode === 'chunked') {
    var outputStream = operation.outputStream;
    if (valcheck.isNullOrUndefined(outputStream)) {
      operation.dispatchEndError('no output stream to consume part');
      part.resume();
    } else {
      operation.logger.debug('writing part to chunked stream');
      partReader = outputStream;
    }    
  } else {
    // TODO: better to know part type before create part reader
    //      {encoding: (isUtf8 ? 'string' : 'buffer')},
    partReader = concatStream(partResponder.contentListener);
  }
  partReader.on('error', operation.errorListener);

  part.pipe(partReader);  
}
function partFinishListener() {
  var operation = this;

  operation.hasFinished = true;
  if (!valcheck.isNullOrUndefined(operation.partQueue)) {
    operation.dispatchParts();
  }
}

function PartResponder(operation, part) {
  this.operation = operation;
  this.part      = part;

  this.parsing     = true;
  this.rawHeaders  = null;
  this.partHeaders = null;
  this.isInline    = false;
  this.format      = null;
  this.isMetadata  = false;
  this.isUtf8      = false;
  this.headersListener = mlutil.callbackOn(this, partHeadersListener);
  this.contentListener = mlutil.callbackOn(this, partContentListener);
}
function partHeadersListener(headers) {
  var operation = this.operation;
  var part = this.part;
  var partResponder = this;

  partResponder.rawHeaders = headers;

  var partHeaders = parsePartHeaders(headers);
  partResponder.partHeaders = partHeaders;

  var isInline = (partHeaders.partType === 'inline');
  partResponder.isInline = isInline;

  var isMetadata = (partHeaders.category && partHeaders.category !== 'content');
  partResponder.isMetadata = isMetadata;

  if (isInline) {
    operation.logger.debug('starting parse of inline part');
  } else if (isMetadata) {
    operation.logger.debug('starting parse of %s metadata', partHeaders.uri);
  } else {
    operation.logger.debug('starting parse of %s document', partHeaders.uri);
  }

  var format = partHeaders.format;
  if (format === undefined) {
    if (isInline || isMetadata) {
      format = 'json';
    } else {
      // TODO: confirm already unmarshalled and delete
      format = contentTypeToFormat(partHeaders.contentType);
    }
  }
  partResponder.format = format;

  var isUtf8 = (
      isInline || isMetadata || format === 'json' || format === 'text' || format === 'xml'
      );
  partResponder.isUtf8 = isUtf8 ;
  if (isUtf8) {
    // TODO: confirm that it is not too late to set the encoding
    part.setEncoding('utf8');
  }
}
function partContentListener(data) {
  var operation = this.operation;
  var partResponder = this;

  // TODO: remove partType key from partHeaders
  // TODO: option for whether and how to parse the JSON or XML metadata or content
  // TODO: branch to aggregates, binaries, metrics, plan
  var partHeaders = partResponder.partHeaders;

  var isJSON   = (partResponder.format === 'json');
  var isBuffer = valcheck.isBuffer(data);

  if (isJSON && isBuffer) {
    partHeaders.content = JSON.parse(data.toString());
  } else if (isJSON) {
    partHeaders.content = JSON.parse(data);
  } else if (partResponder.isUtf8 && isBuffer) {
    partHeaders.content = data.toString();
  } else {
    partHeaders.content = data;
  }

  if (partResponder.isInline) {
    operation.logger.debug('finished parse of inline part');
  } else if (partResponder.isMetadata) {
    operation.logger.debug('finished parse of %s metadata', partHeaders.uri);
  } else {
    operation.logger.debug('finished parse of %s content', partHeaders.uri);
  }

  partResponder.parsing = false;

  operation.dispatchParts();
}

function dispatchParts() {
  var operation = this;

  var nextPart  = operation.nextPart;
  var partQueue = operation.partQueue;
  var queueLen  = partQueue.length;

  for(;nextPart < queueLen; nextPart++) {
    var partResponder = partQueue[nextPart];

    if (partResponder.parsing) {
      break;
    }

    if (partResponder.isInline) {
      partQueue[nextPart] = null;
      operation.logger.debug('dispatching inline part');
      // TODO: identify the kind of inline part
      operation.dispatchData(partResponder.rawHeaders, partResponder.partHeaders.content);
      continue;
    }

    var partHeaders = partResponder.partHeaders;

    var uri         = partHeaders.uri;

    if (!partResponder.isMetadata) {
      partQueue[nextPart] = null;
      operation.logger.debug('dispatching content part for %s', uri);
      operation.dispatchData(partResponder.rawHeaders, partHeaders);
      continue;
    }

    var followingPart = nextPart + 1;
    if (followingPart === queueLen) {
      if (operation.hasFinished) {
        partQueue[nextPart] = null;
        operation.logger.debug('dispatching standalone metadata part for %s', uri);
        mlutil.copyProperties(partHeaders.content, partHeaders);
        delete partHeaders.content;
        operation.dispatchData(partResponder.rawHeaders, partHeaders);
        continue;
      }
      break;
    }

    var followingResponder = partQueue[followingPart];
    var followingHeaders   = followingResponder.partHeaders;
    if (uri !== followingHeaders.uri) {
      partQueue[nextPart] = null;
      operation.logger.debug('dispatching standalone metadata part for %s', uri);
      mlutil.copyProperties(partHeaders.content, partHeaders);
      delete partHeaders.content;
      operation.dispatchData(partResponder.rawHeaders, partHeaders);
      continue;
    }

    partQueue[nextPart] = null;
    operation.logger.debug('copying metadata for %s', uri);
    mlutil.copyProperties(partHeaders.content, followingHeaders);
  }

  if (!operation.hasFinished || nextPart !== queueLen) {
    operation.nextPart = nextPart;
  } else {
    operation.logger.debug('processed %d parts', queueLen);
    operation.partQueue = undefined;
    operation.dispatchEnd();
  }
}
Operation.prototype.dispatchParts = dispatchParts;

function dispatchEmpty() {
  var operation = this;

  operation.dispatchData(operation.rawHeaders, null);
  operation.dispatchEnd();
}
Operation.prototype.dispatchEmpty = dispatchEmpty;
function dispatchBody(data) {
  var operation = this;

  var format = operation.responseHeaders.format;
  var value  = valcheck.isNullOrUndefined(format) ?
      data : unmarshal(format, data);

  operation.dispatchData(operation.rawHeaders, value);
  operation.dispatchEnd();
}
Operation.prototype.dispatchBody = dispatchBody;
/* TODO: delete
function dispatchMetadata(metadata) {
  var operation = this;

  mlutil.copyProperties(metadata.content, metadata);
  metadata.content = undefined;
  operation.dispatchData(metadata);
}
Operation.prototype.dispatchMetadata = dispatchMetadata;
 */
function dispatchData(headers, data) {
  var operation = this;

  if (valcheck.isArray(operation.subdata)) {
    data = projectData(data, operation.subdata, 0);
  }

  var outputTransform = operation.outputTransform;
  var output = valcheck.isNullOrUndefined(outputTransform) ? data :
    outputTransform.call(operation, headers, data);

  if (!valcheck.isUndefined(output)) {
    var isNullOutput = valcheck.isNull(output);

    var outputStream = operation.outputStream;
    if (!valcheck.isNullOrUndefined(outputStream)) {
      outputStream.emit('data', output);
    } else if (valcheck.isNullOrUndefined(operation.data)) {
      operation.data = (!isNullOutput) ? [output] : [];
    } else {
      operation.data.push(output);
    }
  } else {
    operation.logger.debug('dispatch skipped undefined output');
  }
}
function projectData(data, subdata, i) {
  if (i === subdata.length || valcheck.isNullOrUndefined(data)) {
    return data;
  }

  var key = subdata[i];
  if (!valcheck.isArray(data)) {
    return projectData(data[key], subdata, i + 1);
  }

  var newData = [];
  for (var j=0; j < data.length; j++) {
    newData.push(projectData(data[j][key], subdata, i + 1));
  }
  return newData;
}
Operation.prototype.dispatchData = dispatchData;

function dispatchEndError(error) {
  var operation = this;

  operation.dispatchError(error);
  operation.dispatchEnd();
}
Operation.prototype.dispatchEndError = dispatchEndError;
function dispatchError(error) {
  var operation = this;

  var input =
    valcheck.isNullOrUndefined(error) ? operation.makeError('unknown error') :
    valcheck.isString(error)          ? operation.makeError(error) :
    error;

  var outputStream = operation.outputStream;
  if (!valcheck.isNullOrUndefined(outputStream)) {
    var errorListeners = outputStream.listeners('error');
    if (valcheck.isArray(errorListeners) && errorListeners.length > 0) {
      outputStream.emit('error', input);
    } else {
      operation.logError(input);
    }
  } else if (valcheck.isNullOrUndefined(operation.error)) {
    operation.error = [ input ];
  } else {
    operation.error.push(input);
  }
}
Operation.prototype.dispatchError = dispatchError;
function logError(error) {
  var operation = this;

  if (!valcheck.isNullOrUndefined(error.body)) {
    operation.logger.error(error.message, error.body);
  } else {
    operation.logger.error(error.message);
  }
}
Operation.prototype.logError = logError;
function makeError(message) {
  var operation = this;

  var operationName = operation.name;
  var operationMsg  = valcheck.isUndefined(operationName) ? message :
    (operationName+': '+message);

  var errorTransform = operation.errorTransform;
  return new mlutil.Error(
    valcheck.isNullOrUndefined(errorTransform) ? operationMsg :
        errorTransform.call(operation, operationMsg)
    );
}
Operation.prototype.makeError = makeError;
function dispatchEnd() {
  var operation = this;

  operation.done = true;

  var outputStream = operation.outputStream;
  if (!valcheck.isNullOrUndefined(outputStream)) {
    outputStream.end();

    operation.outputStream = undefined;

    return;
  }

  if (rejectedPromise(operation, operation.reject)) {
    return;
  }

  resolvedPromise(operation, operation.resolve);
}
Operation.prototype.dispatchEnd = dispatchEnd;
function resolvedPromise(operation, resolve) {
  if (valcheck.isNullOrUndefined(resolve)) {
    return;
  }

  var data    = operation.data;
  var hasData = !valcheck.isNullOrUndefined(data);
  var dataLen = hasData ? data.length : null;

  operation.logger.debug('promise resolving with '+(
      hasData ? (dataLen+' chunks of') : 'null'
      )+' data');

  if (!hasData) {
    resolve.call(operation);          
  } else if (operation.responseType !== 'empty' &&
      operation.responseType !== 'single') {
    resolve.call(operation, data);
  } else if (dataLen === 1) {
    resolve.call(operation, data[0]);
  } else {
    resolve.call(operation, data);
  }
}
function rejectedPromise(operation, reject) {
  var errorArray = operation.error;
  if (!valcheck.isArray(errorArray)) {
    return false;
  }

  var errorLen = errorArray.length;
  if (errorLen === 0) {
    return false;
  }

  if (valcheck.isNullOrUndefined(reject)) {
    for (var i=0; i < errorLen; i++) {
      operation.logError(errorArray[i]);
    }
    return true;
  }

  operation.logger.debug('deferred promise rejecting with '+errorLen+' error messages');

  var firstError = errorArray[0];
  if (errorLen > 1) {
    firstError.otherErrors = errorArray.slice(1);
  }

  reject.call(operation, firstError);

  return true;
}
function operationResultPromise(fullfilled, rejected) {
  var operation = this;

  if (!valcheck.isNullOrUndefined(operation.outputStream)) {
    throw new Error('cannot create result promise after creating stream');    
  }

  var promise = new Promise(function(resolve, reject) {
    if (operation.done !== true) {
      if (resolve) {
        operation.resolve = resolve;
      }
      if (reject) {
        operation.reject = reject;
      }
      return;
    }

    if (rejectedPromise(operation, reject)) {
      return;
    }

    resolvedPromise(operation, resolve);
  });
  operation.hasPromise = true;

  return promise.then(fullfilled, rejected);
}
function operationResultStream() {
  var operation = this;

  if (operation.hasPromise === true) {
    throw new Error('cannot create stream after creating result promise');
  }

  var streamArg  = (arguments.length > 0) ? arguments[0] : null;
  var streamMode = null;
  if (streamArg === null) {
    streamMode = operation.streamDefaultMode;
  } else if (operation.streamModes[streamArg] === true) {
    streamMode = streamArg;
  } else {
    throw new Error('stream mode not supported for this request');
  }
  operation.outputStreamMode = streamMode;

  var outputStream = through2({objectMode: (streamMode === 'object') ? true : false});
  operation.outputStream = outputStream;

  var i = null;

  var error = operation.error;
  if (!valcheck.isNullOrUndefined(error)) {
    for (i=0; i < error.length; i++) {
      outputStream.emit('error', error[i]);      
    }
    operation.error = undefined;
  }

  var data = operation.data;
  if (!valcheck.isNullOrUndefined(data)) {
    for (i=0; i < data.length; i++) {
      outputStream.emit('data', data[i]);      
    }
    operation.data = undefined;
  }

  return outputStream;
}

function copyResponseHeaders(response) {
  var operation = this;

  var responseHeaders    = response.headers;
  var responseStatusCode = response.statusCode;

  operation.logger.debug('response headers', responseHeaders);

  var operationHeaders = {};

  operation.responseStatusCode = responseStatusCode;
  operation.rawHeaders         = response.headers;
  operation.responseHeaders    = operationHeaders;

  var isString = false;

  var contentType = responseHeaders['content-type'];
  var hasContentType = !valcheck.isNullOrUndefined(contentType);
  if (hasContentType) {
    var semicolonPos = contentType.indexOf(';');
    if (semicolonPos !== -1) {
      contentType = contentType.substring(0, semicolonPos);
    }
    operationHeaders.contentType = contentType;
  }

  var contentLength = responseHeaders['content-length'];
  if (!valcheck.isNullOrUndefined(contentLength) && contentLength > 0) {
    operationHeaders.contentLength = contentLength;
  }

  var versionId = responseHeaders.etag;
  if (!valcheck.isNullOrUndefined(versionId)) {
    var firstChar = versionId.charAt(0);
    var lastChar  = versionId.charAt(versionId.length - 1);
    operationHeaders.versionId = (
        (firstChar === '"' && lastChar === '"') ||
        (firstChar === "'" && lastChar === "'")
      ) ? versionId.substring(1, versionId.length - 1) : versionId;
  }

  var format = responseHeaders['vnd.marklogic.document-format'];
  var hasFormat = !valcheck.isNullOrUndefined(format);
  if (!hasFormat && hasContentType) {
    if (/^multipart\/mixed(;.*)?$/.test(contentType)) {
      format = 'binary';
      hasFormat = true;
      isString  = false;
    } else {
      format = contentType.replace(
          /^(application|text)\/([^+]+\+)?(json|xml)$/, '$3'
          );
      hasFormat = !valcheck.isNullOrUndefined(format);
      if (hasFormat) {
        hasFormat = true;
        isString = true;
      } else {
        hasFormat = /^(text)\//.test(contentType);
        if (hasFormat) {
          format = 'text';
          isString = true;
        }
      }
    }
  }

  if (hasFormat) {
    operationHeaders.format = format;
    if (!isString) {
      switch(format) {
      case 'json':
      case 'text':
      case 'xml':
        isString = true;
        break;
      }
    }
  }

  var location = (responseStatusCode === 303) ?
      responseHeaders.location : null;
  if (!valcheck.isNullOrUndefined(location)) {
    operationHeaders.location = location;
  }

  return isString;
}
Operation.prototype.copyResponseHeaders = copyResponseHeaders;

function marshal(data) {
  if (valcheck.isNullOrUndefined(data)) {
    return null;
  } else if (valcheck.isString(data)) {
    return data;
  } else if (valcheck.isBuffer(data)) {
    return data;
  // readable stream might not inherit from ReadableStream
  } else if (valcheck.isFunction(data._read)) {
    return data;
  } else if (valcheck.isObject(data) || valcheck.isArray(data)) {
    return JSON.stringify(data);
  }
  return data;
}
function unmarshal(format, data) {
  if (valcheck.isNullOrUndefined(data)) {
    return null;
  }
  // TODO: readable stream
  switch(format) {
  case 'binary':
    return data;
  case 'json':
    if (valcheck.isString(data)) {
      return JSON.parse(data);
    } else if (valcheck.isBuffer(data)) {
      return JSON.parse(data.toString());
    }
    return data;
  case 'text':
  case 'xml':
    if (valcheck.isBuffer(data)) {
      return data.toString();
    }
    return data;
  default:
    return data;
  }
}

function setLoggerLevel(logger, level) {
  var transports = logger.transports;

  var transportKeys = Object.keys(transports);
  for (var i=0; i < transportKeys.length; i++) {
    var transport = transports[transportKeys[i]];
    if (!valcheck.isNullOrUndefined(transport.level)) {
      transport.level = level;
    }
  }
}

module.exports = {
    initClient:        initClient,
    releaseClient:     releaseClient,
    setLoggerLevel:    setLoggerLevel,
    multipartBoundary: multipartBoundary,
    createOperation:   createOperation,
    startRequest:      startRequest,
    marshal:           marshal
};
