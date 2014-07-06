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

function initClient(client, connectionParams) {
  client.connectionParams = connectionParams;

  if (connectionParams.authType !== 'DIGEST') {
    connectionParams.auth =
      connectionParams.user+':'+connectionParams.password;
  }

  var isSSL = false;
  if (!valcheck.isNullOrUndefined(connectionParams.ssl)) {
    isSSL = connectionParams.ssl;
    delete connectionParams.ssl;
  }

  var noAgent = valcheck.isNullOrUndefined(connectionParams.agent);
  var agentOptions = noAgent ? {
    keepAlive: true
  } : null;
  if (isSSL) {
    client.request = https.request;
    if (noAgent) {
      ['ca', 'cert', 'ciphers', 'key', 'passphrase', 'pfx',
       'rejectUnauthorized', 'secureProtocol'].
      forEach(function(key) {
        var value = connectionParams[key];
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
/*
  var i=null;
  var activeSockets = agent.sockets;
  if (!valcheck.isNullOrUndefined(activeSockets)){
    var socketKeys = Object.keys(activeSockets);
    if (!valcheck.isNullOrUndefined(socketKeys)){
      for (i=0; i < socketKeys.length; i++) {
        var destinationSockets = activeSockets[socketKeys[i]];
        if (!valcheck.isArray(destinationSockets)) {
          continue;
        }
        for (var j=0; j < destinationSockets.length; j++) {
          destinationSockets[j].end();
        }
      }
    }
  }
  var idleSockets = agent.idleSockets;
  if (!valcheck.isNullOrUndefined(idleSockets)){
    for (i=0; i < idleSockets.length; i++) {
      idleSockets[i].end();
    }
  }
  var freeSockets = agent.freeSockets;
  if (!valcheck.isNullOrUndefined(freeSockets)){
    for (i=0; i < freeSockets.length; i++) {
      freeSockets[i].end();
    }
  }
 */
}

function startRequest(operation, withStream) {
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
  case 'chunked':
    if (started !== null) {
      throw new Error('chunked transform not supported');
    }
    started = through2();
    started.pause();
    operation.responseReader = started;
    responder = chunkedResponder;
    break;
  default:
    throw new Error('unknown request type '+operation.responseType);
  }

  var needsAuthenticator = (options.authType === 'DIGEST');
  var authenticator = (!needsAuthenticator) ? null :
    getAuthenticator(operation.client, options.user);
  if (needsAuthenticator && valcheck.isNullOrUndefined(authenticator)) {
    challengeRequest(operation, requester, responder);
  } else {
    authenticatedRequest(operation, authenticator, requester, responder);
  }

  if (started === null) {
    started = createSelector(operation, withStream);
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

  winston.debug('challenge request for %s', challengeOpts.path);
  var request1 = operation.client.request(challengeOpts, function(response1) {
    var statusCode1   = response1.statusCode;
    var successStatus = (statusCode1 < 400);
    var challenge     = response1.headers['www-authenticate'];
    var hasChallenge  = !valcheck.isNullOrUndefined(challenge);

    winston.debug('response with status %d and %s challenge for %s',
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
  winston.debug('authenticated request for %s', options.path);
  var request = operation.client.request(options, responder.bind(operation));
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
    requestBodyProvider.call(operation, multipartStream);
  } else {
    var requestBody = marshal(operation.requestBody);
    if (valcheck.isString(requestBody)) {
      request.write(requestBody, 'utf8');
    } else if (!valcheck.isNullOrUndefined(requestBody)) {
      request.write(requestBody);
    }
  }

  request.end();
}
function multipartRequester(request) {
  var operation = this;

  var operationBoundary = operation.multipartBoundary;

  var multipartStream = createMultipartStream({
    prefix: valcheck.isNullOrUndefined(operationBoundary) ?
        multipartBoundary : operationBoundary
  });
  multipartStream.pipe(request);
  multipartStream.resume();

  var requestPartsProvider = operation.requestPartsProvider;
  if (valcheck.isFunction(requestPartsProvider)) {
    requestPartsProvider.call(operation, multipartStream);
  } else {
    var parts = operation.requestPartList;
    if (valcheck.isArray(parts)) {
      var partsLen = parts.length;
      winston.debug('writing %s parts', partsLen);
      for (var i=0; i < partsLen; i++) {
        var part = parts[i];
        var headers = part.headers;
        var content = part.content;
        if (!valcheck.isNullOrUndefined(headers) &&
            !valcheck.isNullOrUndefined(content)) {
          multipartStream.write(headers, marshal(content));
        } else {
          winston.debug('nothing to write for part %d', i);
        }
      }    
    } else {
      winston.debug('no part list to write');
    }    
  }

  multipartStream.end();
  request.end();
}
function chunkedRequester(request) {
  var operation = this;

  var requestWriter = operation.requestWriter;
  var requestDocument = operation.requestDocument;
  if (valcheck.isNullOrUndefined(requestWriter)) {
    operation.dispatchEndError('no request writer for streaming request');
    request.end();
  } else if (valcheck.isNullOrUndefined(requestDocument)) {
    operation.dispatchEndError('no request writer for streaming request');
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
          winston.debug('could not write metadata part');
        }        
      } else {
        if (!valcheck.isNullOrUndefined(headers)) {
          multipartStream.write(headers, requestWriter);
        } else {
          winston.debug('could not write content part');
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

  var bodyReader = concatStream(
    {encoding: (isString ? 'string' : 'buffer')},
    operation.dispatchBody
    );
  bodyReader.on('error', operation.errorListener);
  response.pipe(bodyReader);
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
    operation.dispatchEndError('empty multipart response');
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
    winston.debug(
        'expected '+multipartBoundary+
        ' but received '+responseBoundary+' multipart/mixed boundary'
        );
  }

  var parser = new Dicer({boundary: responseBoundary});

  operation.initPartParser(parser);

  response.pipe(parser);
}
function chunkedResponder(response) {
  var operation = this;

  if (!isResponseStatusOkay.call(operation, response)) {
    return;
  }

  response.on('error', operation.errorListener);

  operation.copyResponseHeaders(response);

  var responseReader = operation.responseReader;
  if (valcheck.isNullOrUndefined(responseReader)) {
    operation.dispatchEndError('no response reader to consume response');
    response.resume();
  } else {
    responseReader.resume();
    response.pipe(responseReader);
  }
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
    if (statusCode >= 400) {
      response.pipe(concatStream(
          {encoding: 'string'},
          function(body) {
// TODO: assemble structure with body
            operation.dispatchEndError(errMsg+'\n'+body);
          }));
    } else {
      operation.dispatchEndError(errMsg);
      response.resume();
    }

    return false;
  }

  return true;
}

function Operation(client, options, requestType, responseType) {
  this.client            = client;
  this.options           = options;
  this.requestType       = requestType;
  this.responseType      = responseType;
  this.validStatusCodes  = null;
  // TODO: confirm
  this.responseTransform = null;
  this.partTransform     = null;
  this.errorTransform    = defaultErrorTransform;
  // listeners and other callbacks usable out of context
  this.errorListener     = operationErrorListener.bind(this);
  this.resultPromise     = operationResultPromise.bind(this);
  this.resultStream      = null;
  this.outputStream      = null;
  this.dispatchBody      = dispatchBody.bind(this);
}
function createOperation(client, options, requestType, responseType) {
  return new Operation(client, options, requestType, responseType);
}
function createSelector(operation, withStream) {
  var wrapper = {
    result: operation.resultPromise
  };
  if (withStream === true) {
    var resultStream       = operationResultStream.bind(operation);
    operation.resultStream = resultStream;
    wrapper.stream         = resultStream;
  }
  return wrapper;
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

  parser.on('part',   partListener.bind(operation));
  parser.on('finish', partFinishListener.bind(operation));
  parser.on('error',  operation.errorListener);
}
Operation.prototype.initPartParser = initPartParser;
function partListener(part) {
  var operation = this;

  var partResponder = new PartResponder(operation, part);
  operation.partQueue.push(partResponder);

  part.on('error', operation.errorListener);
  part.on('header', partResponder.headersListener);

  // TODO: better to know part type before create part reader
  //      {encoding: (isUtf8 ? 'string' : 'buffer')},
  var partReader = concatStream(partResponder.contentListener);
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
  this.partHeaders = null;
  this.isInline    = false;
  this.format      = null;
  this.isMetadata  = false;
  this.isUtf8      = false;
  this.headersListener = partHeadersListener.bind(this);
  this.contentListener = partContentListener.bind(this);
}
function partHeadersListener(headers) {
  var operation = this.operation;
  var part = this.part;
  var partResponder = this;

  partHeaders = parsePartHeaders(headers);
  partResponder.partHeaders = partHeaders;

  isInline = (partHeaders.partType === 'inline');
  partResponder.isInline = isInline;

  isMetadata = (partHeaders.category && partHeaders.category !== 'content');
  partResponder.isMetadata = isMetadata;

  if (isInline) {
    winston.debug('starting parse of inline part');
  } else if (isMetadata) {
    winston.debug('starting parse of %s metadata', partHeaders.uri);
  } else {
    winston.debug('starting parse of %s document', partHeaders.uri);
  }

  format = partHeaders.format;
  if (format === undefined) {
    if (isInline || isMetadata) {
      format = 'json';
    } else {
      // TODO: confirm already unmarshalled and delete
      format = contentTypeToFormat(partHeaders.contentType);
    }
  }
  partResponder.format = format;

  isUtf8 = (
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
    winston.debug('finished parse of inline part');
  } else if (partResponder.isMetadata) {
    winston.debug('finished parse of %s metadata', partHeaders.uri);
  } else {
    winston.debug('finished parse of %s content', partHeaders.uri);
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
      winston.debug('dispatching inline part');
      // TODO: identify the kind of inline part
      operation.dispatchData(partResponder.partHeaders.content);
      continue;
    }

    var partHeaders = partResponder.partHeaders;

    var uri         = partHeaders.uri;

    if (!partResponder.isMetadata) {
      partQueue[nextPart] = null;
      winston.debug('dispatching content part for %s', uri);
      operation.dispatchData(partHeaders);
      continue;
    }

    var followingPart = nextPart + 1;
    if (followingPart === queueLen) {
      if (operation.hasFinished) {
        partQueue[nextPart] = null;
        winston.debug('dispatching standalone metadata part for %s', uri);
        mlutil.copyProperties(partHeaders.content, partHeaders);
        delete partHeaders.content;
        operation.dispatchData(partHeaders);
        continue;
      }
      break;
    }

    var followingResponder = partQueue[followingPart];
    var followingHeaders   = followingResponder.partHeaders;
    if (uri !== followingHeaders.uri) {
      partQueue[nextPart] = null;
      winston.debug('dispatching standalone metadata part for %s', uri);
      mlutil.copyProperties(partHeaders.content, partHeaders);
      delete partHeaders.content;
      operation.dispatchData(partHeaders);
      continue;
    }

    partQueue[nextPart] = null;
    winston.debug('copying metadata for %s', uri);
    mlutil.copyProperties(partHeaders.content, followingHeaders);
  }

  if (!operation.hasFinished || nextPart !== queueLen) {
    operation.nextPart = nextPart;
  } else {
    winston.debug('processed %d parts', queueLen);
    delete operation.partQueue;
    operation.dispatchEnd();
  }
}
Operation.prototype.dispatchParts = dispatchParts;

function dispatchEmpty() {
  var operation = this;

  operation.dispatchData(null);
  operation.dispatchEnd();
}
Operation.prototype.dispatchEmpty = dispatchEmpty;
function dispatchBody(data) {
  var operation = this;

  var format = operation.responseHeaders.format;
  var value  = valcheck.isNullOrUndefined(format) ?
      data : unmarshal(format, data);

  operation.dispatchData(value);
  operation.dispatchEnd();
}
function dispatchMetadata(metadata) {
  var operation = this;

  mlutil.copyProperties(metadata.content, metadata);
  delete metadata.content;
  operation.dispatchData(metadata);
}
Operation.prototype.dispatchMetadata = dispatchMetadata;
function dispatchData(data) {
  var operation = this;

  var outputTransform = operation.outputTransform;
  var output = valcheck.isNullOrUndefined(outputTransform) ? data :
    outputTransform.call(operation, data);

  if (output !== null) {
    if (!valcheck.isNullOrUndefined(output.partType)) {
      delete output.partType;
    }

    var outputStream = operation.outputStream;
    if (!valcheck.isNullOrUndefined(outputStream)) {
      outputStream.emit('data', output);
    } else if (valcheck.isNullOrUndefined(operation.data)) {
      operation.data = [output];
    } else {
      operation.data.push(output);
    }
  } else {
    winston.debug('dispatch skipped null output');
  }
}
Operation.prototype.dispatchData = dispatchData;

// TODO - prepend request-specific identification to error
function defaultErrorTransform(status, headers, message) {
  var report = 'problem with request' +
  ((status !== undefined)  ? ' - '+status : '') +
  ((message !== undefined) ? ' - '+message : '');
  console.log(report);
  throw new Error(report);
}

function operationErrorListener(error) {
  var operation = this;

  operation.dispatchEndError(error);
}
function dispatchEndError(error) {
  var operation = this;

  operation.dispatchError(error);
  operation.dispatchEnd();
}
Operation.prototype.dispatchEndError = dispatchEndError;
function dispatchError(error) {
  var operation = this;

  var input = valcheck.isNullOrUndefined(error) ? 'unknown error' : error;
  winston.debug(error);

  // TODO: does error have error.message structure sometimes?

  var outputStream = operation.outputStream;
  if (!valcheck.isNullOrUndefined(outputStream)) {
    outputStream.emit('error', error);
  } else if (valcheck.isNullOrUndefined(operation.error)) {
    operation.error = [ error ];
  } else {
    operation.error.push(error);
  }
}
Operation.prototype.dispatchError = dispatchError;
function dispatchEnd() {
  var operation = this;

  operation.done = true;

  // TODO: cleanup

  var outputStream = operation.outputStream;
  if (!valcheck.isNullOrUndefined(outputStream)) {
    outputStream.end();

    delete operation.outputStream;

    return;
  }

  var reject = operation.reject;
  var errorArray = operation.error;
  var errorLen = valcheck.isArray(errorArray) ? errorArray.length : 0;
  if (errorLen > 0 && !valcheck.isNullOrUndefined(reject)) {
    winston.debug('deferred promise rejecting with '+(
        valcheck.isNullOrUndefined(operation.error) ? 'no' : errorLen
        )+' error messages');
    var errorText = (errorLen === 1) ? errorArray[0] : errorArray.join('\n');
    reject.call(operation, errorText);
    return;
  }

  var resolve = operation.resolve;
  if (!valcheck.isNullOrUndefined(resolve)) {
    winston.debug('deferred promise resolving with '+(
        valcheck.isNullOrUndefined(operation.data) ?
        'null' : operation.data.length+' chunks of'
        )+' data');
    var data = operation.data;
    if (valcheck.isNullOrUndefined(data)) {
      resolve.call(operation);          
    } else if (operation.responseType !== 'empty' &&
        operation.responseType !== 'single') {
      resolve.call(operation, data);
    } else if (data.length === 1) {
      resolve.call(operation, data[0]);
    } else {
      resolve.call(operation, data);
    }
  }    
}
Operation.prototype.dispatchEnd = dispatchEnd;
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
        operation.reject  = reject;
      }
      return;
    }

    var errorArray = operation.error;
    var errorLen = valcheck.isArray(errorArray) ? errorArray.length : 0;
    if (errorLen > 0 && !valcheck.isNullOrUndefined(reject)) {
      winston.debug('immediate promise rejecting with '+(
          valcheck.isNullOrUndefined(operation.error) ? 'no' : errorLen
          )+' error messages');
      var errorText = (errorLen === 1) ? errorArray[0] : errorArray.join('\n');
      reject.call(operation, errorText);
      return;
    }

    if (!valcheck.isNullOrUndefined(resolve)) {
      winston.debug('immediate promise resolving with '+(
          valcheck.isNullOrUndefined(operation.data) ?
          'null' : operation.data.length+' chunks of'
          )+' data');
      if (operation.responseType !== 'single') {
        resolve.call(operation, operation.data);
      } else if (valcheck.isNullOrUndefined(operation.data)) {
        resolve.call(operation);          
      } else if (operation.data.length === 1) {
        resolve.call(operation, operation.data[0]);          
      } else {
        resolve.call(operation, operation.data);
      }
    }
  });
  operation.hasPromise = true;

  return promise.then(fullfilled, rejected);
}
function operationResultStream() {
  var operation = this;

  if (operation.hasPromise === true) {
    throw new Error('cannot create stream after creating result promise');
  }

  // 'chunked' responseReader supports binary streams
  var outputStream = through2({objectMode:true});
  operation.outputStream = outputStream;

  var i = null;

  var error = operation.error;
  if (!valcheck.isNullOrUndefined(error)) {
    for (i=0; i < error.length; i++) {
      outputStream.emit('error', error[i]);      
    }
    delete operation.error;
  }

  var data = operation.data;
  if (!valcheck.isNullOrUndefined(data)) {
    for (i=0; i < data.length; i++) {
      outputStream.emit('data', data[i]);      
    }
    delete operation.data;
  }

  return outputStream;
}

function copyResponseHeaders(response) {
  var operation = this;

  var responseHeaders    = response.headers;
  var responseStatusCode = response.statusCode;

  var operationHeaders = {};

  operation.responseStatusCode = responseStatusCode;
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
  if (!hasFormat) {
    if (hasContentType) {
      if (contentType.match(/^multipart\/mixed(;.*)?$/)) {
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
          hasFormat = contentType.match(/^(text)\//);
          if (hasFormat) {
            format = 'text';
            isString = true;
          }
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

// winston.level = 'debug';

module.exports = {
    initClient:        initClient,
    releaseClient:     releaseClient,
    multipartBoundary: multipartBoundary,
    createOperation:   createOperation,
    startRequest:      startRequest,
    marshal:           marshal
};
