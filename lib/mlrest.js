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
var util                  = require('util');
var events                = require('events');
var stream                = require('stream');
var http                  = require('http');
var https                 = require('https');
var concatStream          = require('concat-stream');
var createAuthInitializer = require('www-authenticate');
var Multipart             = require('multipart-stream');
var Dicer                 = require('dicer');
var YAgent                = require('yakaa');
var PromisePlus           = require('./bluebird-plus.js');
var through2              = require('through2');
var valcheck              = require('core-util-is');
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
  var contentType = null;
  if (valcheck.isArray(contentTypeArray) && contentTypeArray.length > 0) {
    contentType             = contentTypeArray[0];
    partHeaders.contentType = contentType;
  }

  if (!valcheck.isNullOrUndefined(contentType) && valcheck.isNullOrUndefined(partHeaders.format)) {
    partHeaders.format = contentTypeToFormat(contentType);
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
      forEach(function certificateKeyCopier(key) {
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

  var headers = options.headers;
  if (valcheck.isNullOrUndefined(headers)) {
    headers = {};
    options.headers = headers;
  }
  headers['X-Error-Accept'] = 'application/json';

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
    started.result = operation.resultPromise;
    operation.requestWriter = started;
    requester = chunkedRequester;
    break;
  case 'chunkedMultipart':
    started = through2();
    started.result = operation.resultPromise;
    operation.requestWriter = started;
    requester = chunkedMultipartRequester;
    break;
  default:
    throw new Error('unknown request type '+operation.requestType);
  }

  var responder = responseDispatcher;

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
      authenticatedRequest(operation, authenticator, requester, responder);
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
  var multipartStream = new Multipart(valcheck.isNullOrUndefined(operationBoundary) ?
        multipartBoundary : operationBoundary);

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
  var operation = this;

  var requestWriter = operation.requestWriter;
  if (valcheck.isNullOrUndefined(requestWriter)) {
    operation.dispatchEndError('no request writer for streaming request');
    request.end();
  }

  requestWriter.pipe(request);
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

    var multipartStream = new Multipart(valcheck.isNullOrUndefined(operationBoundary) ?
        multipartBoundary : operationBoundary);

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
            body:    marshal(content)
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

function responseDispatcher(response) {
  var operation = this;

  if (!isResponseStatusOkay.call(operation, response)) {
    return;
  }

  var outputMode = operation.outputMode;
  if (outputMode === 'none') {
    response.destroy();
    return;
  }

  var responseType     = response.headers['content-type'];
  var responseTypeLen  = valcheck.isNullOrUndefined(responseType) ? 0 : responseType.length;
  var responseBoundary = null;
  if (15 <= responseTypeLen && responseType.substr(0, 15) === 'multipart/mixed') {
    responseBoundary = responseType.replace(
        /^multipart.mixed\s*;\s*boundary\s*=\s*([^\s;]+)([\s;].*)?$/, '$1'
        );
    if (responseBoundary.length === responseTypeLen) {
      operation.dispatchEndError('multipart/mixed response without boundary');
      return;
    }
    if (responseBoundary !== multipartBoundary) {
      operation.logger.debug(
          'expected '+multipartBoundary+
          ' but received '+responseBoundary+' multipart/mixed boundary'
          );
    }
  }
  var isMultipart = (!valcheck.isNullOrUndefined(responseBoundary));

  var inputHeader = isMultipart ? responseBoundary : responseType;

  var responseLength = response.headers['content-length'];
  var isEmpty = (valcheck.isNullOrUndefined(responseLength)|| responseLength === '0');

  var expectedType = operation.responseType;

  var dispatcher = null;
  if (isMultipart) {
    if (expectedType !== 'multipart') {
      operation.logger.debug('expected body but received multipart');
    }

    dispatcher = new MultipartDispatcher(operation);
  } else {
    if (expectedType === 'multipart') {
      operation.logger.debug('expected multipart but received body');
    }

    dispatcher = new BodyDispatcher(operation);
  }

  response.on('error', operation.errorListener);

  if (isEmpty) {
    if (expectedType !== 'empty') {
      operation.logger.debug('expected body or multipart but received empty response');
    }

    response.destroy();

    if (outputMode === 'promise') {
      dispatcher.emptyPromise(response);
    } else {
      dispatcher.emptyStream(response);
    }
  } else {
    if (expectedType === 'empty') {
      operation.logger.debug('expected empty response but received body or multipart');
    }

    switch(outputMode) {
    case 'promise':
      dispatcher.promise(inputHeader, response);
      break;
    case 'chunkedStream':
      dispatcher.chunkedStream(inputHeader, response);
      break;
    case 'objectStream':
      dispatcher.objectStream(inputHeader, response);
      break;
    default:
      operation.dispatchEndError('unknown output mode '+outputMode);
      break;
    }
  }
}

function BodyDispatcher(operation) {
  if (!(this instanceof BodyDispatcher)) {
    return new BodyDispatcher(operation);
  }

  this.operation = operation;
}
BodyDispatcher.prototype.emptyPromise = function dispatchBodyEmptyPromise(response) {
  var operation = this.operation;

  operation.logger.debug('empty body promise');

  operation.data = operation.emptyHeaderData(response);
  resolvedPromise(operation, operation.resolve);
};
BodyDispatcher.prototype.emptyStream = function dispatchBodyEmptyStream(response) {
  var operation = this.operation;

  var data = operation.emptyHeaderData(response);

  operation.logger.debug('empty body stream');

  var outputStream = operation.outputStream;
  if (!valcheck.isNullOrUndefined(data)) {
    if (operation.outputStreamMode === 'chunked') {
      outputStream.write(JSON.stringify(data));
    } else {
      outputStream.write(data);
    }
  }
  outputStream.end();
};
BodyDispatcher.prototype.promise = function dispatchBodyPromise(
    contentType, response
    ) {
  var operation = this.operation;
  
  operation.logger.debug('body promise');
  var collectObject = function collectPromiseBodyObject(data) {
    operation.data = operation.collectBodyObject(data);
    resolvedPromise(operation, operation.resolve);
    collectObject = null;
  };

  var isString = operation.copyResponseHeaders(response);

  response.pipe(concatStream(
      {encoding: (isString ? 'string' : 'buffer')},
      collectObject
      ));
};
BodyDispatcher.prototype.chunkedStream = function dispatchBodyChunkedStream(
    contentType, response
    ) {
  var operation = this.operation;
  
  operation.logger.debug('body chunked stream');

  response.pipe(operation.outputStream);
};
BodyDispatcher.prototype.objectStream = function dispatchBodyObjectStream(
    contentType, response
    ) {
  var operation = this.operation;
  
  operation.logger.debug('body object stream');

  var outputStream = operation.outputStream;

  var collectObject = function collectStreamBodyObject(data) {
    var writableObject = operation.collectBodyObject(data);
    if (!valcheck.isNullOrUndefined(writableObject)) {
      outputStream.write(writableObject);
    }
    outputStream.end();

    collectObject = null;
  };

  var isString = operation.copyResponseHeaders(response);

  response.pipe(concatStream(
      {encoding: (isString ? 'string' : 'buffer')},
      collectObject
      ));
};

function MultipartDispatcher(operation) {
  if (!(this instanceof MultipartDispatcher)) {
    return new MultipartDispatcher(operation);
  }

  this.operation = operation;
}
MultipartDispatcher.prototype.emptyPromise = function dispatchMultipartEmptyPromise(response) {
  var operation = this.operation;

  var data = operation.emptyHeaderData(response);

  operation.logger.debug('empty multipart promise');

  operation.data = valcheck.isNullOrUndefined(data) ? [] : [data];
  resolvedPromise(operation, operation.resolve);
};
MultipartDispatcher.prototype.emptyStream = function dispatchMultipartEmptyStream(response) {
  var operation = this.operation;

  var data = operation.emptyHeaderData(response);

  operation.logger.debug('empty multipart stream');

  var outputStream = operation.outputStream;
  if (!valcheck.isNullOrUndefined(data)) {
    if (operation.outputStreamMode === 'chunked') {
      outputStream.write(JSON.stringify(data));
    } else {
      outputStream.write(data);
    }
  }
  outputStream.end();
};
/* Note: the following events can occur in any order:
 * 'end'    on the readable stream for the last part
 * 'finish' on the Dicer parser
 * 'end'    on the reponse
 */
MultipartDispatcher.prototype.promise = function dispatchMultipartPromise(
    boundary, response
    ) {
  var operation = this.operation;

  var errorListener = operation.errorListener;

  var rawHeaderQueue  = new FifoQueue(2);
  var objectQueue     = new FifoQueue(2);
  var partReaderQueue = new FifoQueue(3);

  var metadataBuffer  = null;

  var parsingParts = 0;
  var parsedParts  = 0;

  var hasParsed = false;
  var hasEnded  = false;

  var responseFinisher = function promiseResponseFinisher() {
    if (metadataBuffer !== null) {
      operation.queueMetadata(metadataBuffer, objectQueue);
    }

    operation.logger.debug('ending multipart promise');
    operation.data = objectQueue.getQueue();
    resolvedPromise(operation, operation.resolve);

    partFinisher        = null;
    partHeadersListener = null;
    partListener        = null;
    parseFinishListener = null;
    responseEndListener = null;
    parser              = null;
    rawHeaderQueue      = null;
    objectQueue         = null;
    partReaderQueue     = null;
    responseFinisher    = null;
  };

  var partFinisher = function promisePartFinisher(data) {
    parsedParts++;
    operation.logger.debug('parsed part %d', parsedParts);

    partReaderQueue.removeFirst();

    metadataBuffer = operation.queueDocument(
        (data.length === 0) ? null : data, rawHeaderQueue, metadataBuffer, objectQueue
        );

    if (partReaderQueue.hasItem()) {
      var partConcatenator = concatStream(partFinisher);
      partConcatenator.on('error', errorListener);

      var partReadStream = partReaderQueue.getFirst();
      partReadStream.pipe(partConcatenator);
    } else if (hasParsed) {
      responseFinisher();
    } else if (!hasEnded) {
      parser.emit('drain');
    }
  };

  var partHeadersListener = function promisePartHeadersListener(headers) {
    operation.logger.debug('queued header %d %j', parsingParts, headers);
    rawHeaderQueue.addLast(headers);
  };

  var partListener = function promisePartListener(partReadStream) {
    parsingParts++;
    operation.logger.debug('parsing part %d', parsingParts);

    partReadStream.on('header', partHeadersListener);
    partReadStream.on('error',  errorListener);
    partReaderQueue.addLast(partReadStream);

    if (partReaderQueue.isLast()) {
      var partConcatenator = concatStream(partFinisher);
      partConcatenator.on('error', errorListener);
      partReadStream.pipe(partConcatenator);
    }
  };

  var parseFinishListener = function promiseParseFinishListener() {
    operation.logger.debug('parse finished at part %d of %d', parsedParts, parsingParts);
    hasParsed = true;
    if (!partReaderQueue.hasItem()) {
      responseFinisher();
    }
  };

  var responseEndListener = function promiseResponseEndListener() {
    hasEnded = true;
  };

  var parser = new Dicer({boundary: boundary});
  parser.on('part',   partListener);
  parser.on('error',  errorListener);
  parser.on('finish', parseFinishListener);

  response.on('end', responseEndListener);

  response.pipe(parser);
};
MultipartDispatcher.prototype.chunkedStream = function dispatchMultipartChunkedStream(
    boundary, response
    ) {
  var operation = this.operation;
  
  var errorListener = operation.errorListener;

  var outputStream = operation.outputStream;

  var partReaderQueue = new FifoQueue(3);

  var hasParsed = false;
  var hasEnded  = false;

  var responseFinisher = function chunkedResponseFinisher() {
    outputStream.end();
    outputStream        = null;
    partEndListener     = null;
    partListener        = null;
    parser              = null;
    parseFinishListener = null;
    responseEndListener = null;
    responseFinisher    = null;
  };

  var partEndListener = function chunkedPartEndListener() {
    partReaderQueue.removeFirst();

    if (partReaderQueue.hasItem()) {
      var partReadStream = partReaderQueue.getFirst();
      partReadStream.pipe(outputStream, {end: false});
    } else if (hasParsed) {
      responseFinisher();
    } else if (!hasEnded) {
      parser.emit('drain');
    }
  };

  var partListener = function chunkedPartListener(partReadStream) {
    partReadStream.on('error', errorListener);
    partReadStream.on('end',   partEndListener);
    partReaderQueue.addLast(partReadStream);

    if (partReaderQueue.isLast()) {
      partReadStream.pipe(outputStream, {end: false});
    }
  };

  var parseFinishListener = function chunkedParseFinishListener() {
    operation.logger.debug('parse finished');
    hasParsed = true;
    if (!partReaderQueue.hasItem()) {
      responseFinisher();
    }
  };

  var responseEndListener = function chunkedResponseEndListener() {
    hasEnded = true;
  };

  var parser = new Dicer({boundary: boundary});
  parser.on('part',   partListener);
  parser.on('error',  errorListener);
  parser.on('finish', parseFinishListener);

  response.on('end', responseEndListener);

  response.pipe(parser);
};
MultipartDispatcher.prototype.objectStream = function dispatchMultipartObjectStream(
    boundary, response
    ) {
  var operation = this.operation;
  
  var errorListener   = operation.errorListener;

  var rawHeaderQueue = new FifoQueue(5);
  var metadataBuffer = null;

  var parsingParts = 0;
  var parsedParts  = 0;

  var hasParsed = false;
  var hasEnded  = false;

  var partTransform = function objectPartQueueTransform(
      isLast, data, objectQueue
      ) {
    parsedParts++;
    metadataBuffer = operation.queueDocument(
        (data.length === 0) ? null : data, rawHeaderQueue, metadataBuffer, objectQueue
        );

    if (isLast) {
      if (metadataBuffer !== null) {
        operation.queueMetadata(metadataBuffer, objectQueue);
        metadataBuffer = null;
      }

      rawHeaderQueue      = null;
      queuedReader        = null;
      parser              = null;
      partHeadersListener = null;
      partListener        = null;
      parseFinishListener = null;
      responseEndListener = null;
      partTransform       = null;
    } else if (!hasEnded && parsedParts === parsingParts) {
      parser.emit('drain');
    }
  };

  var queuedReader = new QueuedReader(
      {objectMode: true}, operation.logger, partTransform
      );
  this.queuedReader = queuedReader;

  var partHeadersListener = function objectPartHeadersListener(headers) {
    operation.logger.debug('queued header');
    rawHeaderQueue.addLast(headers);
  };

  var partListener = function objectPartListener(partReadStream) {
    parsingParts++;
    partReadStream.on('header', partHeadersListener);
    partReadStream.on('error',  errorListener);
    queuedReader.addReader(partReadStream);
  };

  var parseFinishListener = function promiseParseFinishListener() {
    hasParsed = true;
    if (queuedReader !== null) {
      queuedReader.queuedAll();
    }
  };

  var responseEndListener = function promiseResponseEndListener() {
    hasEnded = true;
  };

  var parser = new Dicer({boundary: boundary});
  parser.on('part',   partListener);
  parser.on('error',  errorListener);
  parser.on('finish', parseFinishListener);

  response.on('end', responseEndListener);

  response.pipe(parser);

  queuedReader.pipe(operation.outputStream);
};

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

  if (!valcheck.isNullOrUndefined(errMsg)) {
    var clientError = operation.makeError(errMsg);
    clientError.statusCode = statusCode;
    if (statusCode >= 400) {
      response.pipe(concatStream(
          {encoding: 'string'},
          function errorBodyDispatcher(body) {
            if (body.length > 0) {
              var bodyMsg = valcheck.isString(body) ? body : body.toString();
              var contentType = response.headers['content-type'];
              clientError.body =
                (valcheck.isString(contentType) &&
                    contentType.match(/^application\/json(;.*)?$/)) ?
                mlutil.parseJSON(bodyMsg) : bodyMsg;
            }
            operation.dispatchEndError(clientError);
          }));
    } else {
      operation.dispatchEndError(clientError);
      response.destroy();
    }

    return false;
  }

  operation.startedResponse = true;
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
  this.inlineAsDocument  = true;
  // TODO: confirm use of responseTransform and partTransform
  this.responseTransform = null;
  this.partTransform     = null;
  this.errorTransform    = null;
  // listeners and other callbacks usable out of context
  this.errorListener     = mlutil.callbackOn(this, dispatchEndError);
  this.resultPromise     = mlutil.callbackOn(this, operationResultPromise);
  this.startedResponse   = false;
  this.done              = false;
  this.outputMode        = 'none';
  this.resolve           = null;
  this.reject            = null;
  this.streamDefaultMode = 'object';
// TODO: delete
  this.outputStreamMode  = null;
  this.outputStream      = null;
  this.streamModes       = this.STREAM_MODES_CHUNKED_OBJECT;
}
Operation.prototype.STREAM_MODES_CHUNKED_OBJECT = {chunked: true, object: true};

function createOperation(name, client, options, requestType, responseType) {
  return new Operation(name, client, options, requestType, responseType);
}
function createSelector(operation) {
  return {
    result: operation.resultPromise,
    stream: mlutil.callbackOn(operation, operationResultStream)
  };
}

/* Note:  Dicer appears to read ahead.
+ each type of event (such as header or end) fires in part order; however
+ for typical MarkLogic documents, part streams become available in batches
+ the header event fires when each part stream becomes available
+ if parts are piped as soon as available, the end event for one pipe
  can fire after the next pipe starts reading
+ thus, if parts are piped as soon as available, different types of events
  can interleave, as in:
    part reader 1
    header event 1
    part reader 2
    header event 2
    part data 1
    part data 2
    part end 1
    part end 2
    finish
 */
function QueuedReader(options, logger, itemsTransform) {
  if (!(this instanceof QueuedReader)) {
    return new QueuedReader(options, logger, itemsTransform);
  }
  stream.Readable.call(this, options);

  var self = this;

  this.itemsTransform = itemsTransform;
  this.logger         = logger;

  this.minWriters =  5;
  this.maxItems   = 10;

  this.readerQueue = new FifoQueue(10);
  this.writerQueue = new FifoQueue(this.minWriters);
  this.itemQueue   = new FifoQueue(this.maxItems);

  this.isReading = true;
  this.queueDone = false;

  this.addItems = function queuedReaderAddItems(data) {
    self.writerQueue.removeFirst();

    self.logger.debug('concatenated item');

    var isLast = (self.queueDone && self.readerQueue.length() === 0 &&
        self.writerQueue.length() === 0);

    var itemQueue    = self.itemQueue;
    var beforeLength = itemQueue.length();

    self.itemsTransform(isLast, data, itemQueue);

    if (beforeLength < itemQueue.length()) {
      if (beforeLength === 0) {
        self.emit('readable');
      }
      if (self.isReading || isLast) {
        logger.debug('writing first item');
        self.isReading = self.push(itemQueue.pollFirst());
      }
    }

    self.nextReader();
  };
}
util.inherits(QueuedReader, stream.Readable);
QueuedReader.prototype.addReader = function queuedAddReader(reader) {
  var readerQueue = this.readerQueue;
  if (readerQueue === null) {
    return;
  }

  readerQueue.addLast(reader);
  this.logger.debug('queued item %d', readerQueue.getTotal());
  this.nextReader();
};
QueuedReader.prototype.nextReader = function queuedReaderNextReader() {
  if (!this.isReading) {
    return;
  }

  var readerQueue = this.readerQueue;
  if (readerQueue === null || readerQueue.length() === 0) {
    return;
  }

  if (this.itemQueue.length() >= this.maxItems) {
    return;
  }

  var writerQueue = this.writerQueue;
  var minWriters  = this.minWriters;

  var logger = this.logger;

  var addItems = this.addItems;

  var i = writerQueue.length();
  var j = readerQueue.length();
  var writer = null;
  for (; i <= minWriters && j > 0; i++, j--) {
    writer = concatStream(addItems);
    writerQueue.addLast(writer);
    logger.debug('reading item');
    readerQueue.pollFirst().pipe(writer);
  }
};
QueuedReader.prototype._read = function queuedReaderRead(size) {
  var itemQueue = this.itemQueue;
  if (itemQueue === null) {
    return;
  }

  var logger = this.logger;

  var hasItem = itemQueue.hasItem();
  var canRead = true;
  while (hasItem && canRead) {
    logger.debug('writing item');
    canRead = this.push(itemQueue.pollFirst());
    hasItem = itemQueue.hasItem();
  }

  if (this.queueDone && !hasItem && this.readerQueue.length() === 0 &&
      this.writerQueue.length() === 0) {
    this.logger.debug('wrote %d items', itemQueue.getTotal());
    this.push(null);

    this.readerQueue = null;
    this.writerQueue = null;
    this.itemQueue   = null;
  } else if (!canRead) {
    if (this.isReading) {
      this.isReading = false;
    }
  } else {
    if (!this.isReading) {
      this.isReading = true;
    }
    this.nextReader();
  }
};
QueuedReader.prototype.queuedAll = function queuedReaderAll() {
  if (!this.queueDone) {
    this.logger.debug('queued all items');
    this.queueDone = true;
  }
};

function FifoQueue(min) {
  if (!(this instanceof FifoQueue)) {
    return new FifoQueue(min);
  }
  this.queue = (min > 0) ? new Array(min) : [];
  this.first = -1;
  this.last  = -1;
  this.total = 0;
}
FifoQueue.prototype.addLast = function fifoAddLast(item) {
  this.last++;
  this.total++;
  if (this.first === -1) {
    this.first = this.last;
  }
  if (this.last < this.queue.length) {
    this.queue[this.last] = item;
  } else {
    this.queue.push(item);
  }
};
FifoQueue.prototype.hasItem = function fifoHasItem() {
  return (this.first >= 0);
};
FifoQueue.prototype.isLast = function fifoIsLast() {
  return (this.first >= 0 && this.first === this.last);
};
FifoQueue.prototype.getFirst = function fifoGetFirst() {
  return (this.first >= 0) ? this.queue[this.first] : undefined;
};
FifoQueue.prototype.getLast = function fifoGetLast() {
  return (this.first >= 0) ? this.queue[this.last] : undefined;
};
FifoQueue.prototype.removeFirst = function fifoRemoveFirst() {
  if (this.first >= 0) {
    this.queue[this.first] = undefined;
    if (this.first === this.last) {
      this.first = -1;
      this.last  = -1;
    } else {
      this.first++;
    }
  }
};
FifoQueue.prototype.pollFirst = function fifoPollFirst() {
  var item = this.getFirst();
  if (item !== undefined) {
    this.removeFirst();
  }
  return item;
};
FifoQueue.prototype.getTotal = function fifoGetTotal() {
  return this.total;
};
FifoQueue.prototype.getQueue = function fifoGetQueue() {
  return (this.first === 0 && this.last === this.queue.length) ?
      this.queue : this.queue.slice(this.first, this.last + 1);
};
FifoQueue.prototype.length = function fifoLength() {
  return (this.first >= 0) ? (this.last - this.first) + 1 : 0;
};
/*
FifoQueue.prototype.at = function fifoAt(i) {
  return this.queue[this.first + i];
};
FifoQueue.prototype.replaceLast = function fifoReplaceLast(item) {
  if (this.first >= 0) {
    this.queue[this.last] = item;
  }
};
FifoQueue.prototype.compact = function fifoCompact() {
  if (this.first > 0) {
    var last = (this.last - this.first);
    var next = 0;
    var i = 0;
    for (; i <= last; i++) {
      next = this.first + i;
      this.queue[i] = this.queue[next];
      this.queue[next] = null;
    }
    this.first = 0;
    this.last  = last;
  }
};
 */

Operation.prototype.emptyHeaderData = function emptyHeaderData(
    response
    ) {
  var operation = this;

  var outputTransform = operation.outputTransform;
  if (!valcheck.isNullOrUndefined(outputTransform)) {
    var responseHeaders = operation.responseHeaders;
    if (valcheck.isNullOrUndefined(responseHeaders)) {
      operation.copyResponseHeaders(response);
      responseHeaders = operation.responseHeaders;
    }

    return outputTransform.call(
        operation, responseHeaders, null
        );
  }

  return null;
};

Operation.prototype.collectBodyObject = function collectBodyObject(data) {
  var operation = this;

  var outputTransform    = operation.outputTransform;
  var hasOutputTransform = !valcheck.isNullOrUndefined(outputTransform);

  var headers = operation.responseHeaders;

  var bodyObject = unmarshal(headers.format, data);
  if (bodyObject !== null) {
    var subdata = operation.subdata;
    if (valcheck.isArray(subdata)) {
      bodyObject = projectData(bodyObject, subdata, 0);
    }

    if (hasOutputTransform) {
      bodyObject = outputTransform.call(operation, headers, bodyObject);
    }
  }

  return bodyObject;
};
Operation.prototype.queueDocument = function queueDocument(
    data, rawHeaderQueue, metadataBuffer, objectQueue
    ) {
  var operation = this;

  var outputTransform = operation.outputTransform;

  var partRawHeaders = rawHeaderQueue.pollFirst();

  var partHeaders = parsePartHeaders(partRawHeaders);

  var partUri = partHeaders.uri;

  var isInline = valcheck.isNullOrUndefined(partUri);
  var isMetadata = (
      !isInline &&
      !valcheck.isNullOrUndefined(partHeaders.category) &&
      partHeaders.category !== 'content'
    );

  var partData = unmarshal(partHeaders.format, data);

  var nextMetadataBuffer = null;
  var partObject         = null;
  if (isInline) {
    if (metadataBuffer !== null) {
      operation.queueMetadata(metadataBuffer, objectQueue);
    }
    operation.logger.debug('parsed inline');
    if (operation.inlineAsDocument) {
      partHeaders.content = partData;
      partObject = partHeaders;
    } else {
      partObject = partData;
    }
  } else if (isMetadata) {
    if (metadataBuffer !== null) {
      operation.queueMetadata(metadataBuffer, objectQueue);
    }
    operation.logger.debug('parsed metadata for %s', partUri);
    nextMetadataBuffer = [partHeaders, partData];
  } else {
    operation.logger.debug('parsed content for %s', partUri);
    if (metadataBuffer !== null) {
      if (metadataBuffer[0].uri === partUri) {
        operation.logger.debug('copying metadata for %s', partUri);
        mlutil.copyProperties(metadataBuffer[1], partHeaders);
      } else {
        operation.queueMetadata(metadataBuffer, objectQueue);
      }
    }
    partHeaders.content = partData;
    partObject = partHeaders;
  }

  if (partObject !== null) {
    var subdata = operation.subdata;
    if (valcheck.isArray(subdata)) {
      partObject = projectData(partObject, subdata, 0);
    }

    if (!valcheck.isNullOrUndefined(outputTransform)) {
      partObject = outputTransform.call(operation, partRawHeaders, partObject);
    }

    if (!valcheck.isUndefined(partObject)) {
      objectQueue.addLast(partObject);
    } else {
      operation.logger.debug('skipped undefined output from transform');
    }
  }

  return nextMetadataBuffer;
};
Operation.prototype.queueMetadata = function queueMetadata(
    metadataBuffer, objectQueue
    ) {
  var metadataHeaders = metadataBuffer[0];
  mlutil.copyProperties(metadataBuffer[1], metadataHeaders);
  objectQueue.addLast(metadataHeaders);
};

function projectData(data, subdata, i) {
  if (i === subdata.length || valcheck.isNullOrUndefined(data)) {
    return data;
  }

  var key = subdata[i];
  if (!valcheck.isArray(data)) {
    var nextData = data[key];
    if (valcheck.isNullOrUndefined(nextData)) {
      return data;
    }
    return projectData(nextData, subdata, i + 1);
  }

  var newData = [];
  for (var j=0; j < data.length; j++) {
    var currItem  = data[j];
    var nextValue = currItem[key];
    newData.push(
        valcheck.isNullOrUndefined(nextValue) ? currItem :
          projectData(nextValue, subdata, i + 1)
        );
  }
  return newData;
}

function dispatchEndError(error) {
  var operation = this;

  operation.dispatchError(error);

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

  if (valcheck.isNullOrUndefined(error.body)) {
    operation.logger.error(error.message);
  } else if (operation.logger.isErrorFirst === true) {
    operation.logger.error(error.body, error.message);
  } else {
    operation.logger.error(error.message, error.body);
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

  for (var i=0; i < errorLen; i++) {
    operation.logError(errorArray[i]);
  }

  if (valcheck.isNullOrUndefined(reject)) {
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

  switch (operation.outputMode) {
  case 'none':
    if (operation.startedResponse === true) {
      throw new Error('cannot create result promise after receiving response');    
    }
    break;
  case 'promise':
    throw new Error('already created result promise');    
  default:
    throw new Error('cannot create result promise after creating stream');    
  }
  operation.outputMode = 'promise';

  var promise = new PromisePlus(function promiseDispatcher(resolve, reject) {
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

  return promise.then(fullfilled, rejected);
}
function operationResultStream() {
  var operation = this;

  switch (operation.outputMode) {
  case 'none':
    if (operation.startedResponse === true) {
      throw new Error('cannot create stream after receiving response');
    }
    break;
  case 'promise':
    throw new Error('cannot create stream after creating result promise');
  default:
    throw new Error('already created stream');
  }

  var streamArg  = (arguments.length > 0) ? arguments[0] : null;
  var streamMode = null;
  if (streamArg === null) {
    streamMode = operation.streamDefaultMode;
    operation.outputStreamMode = streamMode;
  } else if (!valcheck.isNullOrUndefined(operation.outputStreamMode)) {
    if (streamArg !== operation.outputStreamMode) {
      throw new Error('cannot change stream mode from: '+operation.outputStreamMode);
    }
  } else if (operation.streamModes[streamArg] === true) {
    streamMode = streamArg;
    operation.outputStreamMode = streamMode;
  } else {
    throw new Error('stream mode not supported for this request: '+streamArg);
  }
  operation.outputMode = streamMode+'Stream';

  var outputStream = null;
  switch(streamMode) {
  case 'chunked':
    outputStream = through2();
    break;
  case 'object':
    outputStream= through2({objectMode: true});
    break;
  default:
    throw new Error('unknown stream mode: '+streamMode);
  }
  operation.outputStream = outputStream;

  var error = operation.error;
  if (!valcheck.isNullOrUndefined(error)) {
    var i = 0;
    for (; i < error.length; i++) {
      outputStream.emit('error', error[i]);      
    }
    operation.error = undefined;
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
  operation.rawHeaders         = responseHeaders;
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
      format    = 'binary';
      hasFormat = true;
      isString  = false;
    } else if (/^(application|text)\/([^+]+\+)?json$/.test(contentType)) {
      format    = 'json';
      hasFormat = true;
      isString  = true;
    } else if (/^(application|text)\/([^+]+\+)?xml$/.test(contentType)) {
      format    = 'xml';
      hasFormat = true;
      isString  = true;
    } else if (/^(text)\//.test(contentType)) {
      format    = 'text';
      hasFormat = true;
      isString  = true;
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

  var location = responseHeaders.location;
  if (!valcheck.isNullOrUndefined(location)) {
    operationHeaders.location = location;
  }

  var systemTime = responseHeaders['x-marklogic-system-time'];
  if (!valcheck.isNullOrUndefined(systemTime)) {
    operationHeaders.systemTime = systemTime;
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
    if (data.length === 0) {
      return data;
    } else if (valcheck.isString(data)) {
      return mlutil.parseJSON(data);
    } else if (valcheck.isBuffer(data)) {
      return mlutil.parseJSON(data.toString());
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
