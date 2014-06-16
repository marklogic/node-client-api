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
var concatStream          = require('concat-stream');
var createAuthInitializer = require('www-authenticate');
var Dicer                 = require('dicer');
var Promise               = require("bluebird");
var through               = require('through');
var valcheck              = require('core-util-is');
var winston               = require('winston');
var mlutil                = require('./mlutil.js');

var multipartBoundary = 'MLBOUND_' + Date.UTC(2014,12,31);

// TODO: per connection or request logger

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

function prepareDispatch(response) {
  winston.debug('responded with %d status', response.statusCode);
  if (response.statusCode < this.minErrorStatus) {
    // TODO: mapper should use contentType for conversion
    this.mapper(response, this);
  } else {
    emptyEventMapper(response, this);
    // TODO: log error with respect to request definition
    this.error = 'failed with '+response.statusCode;
    response.resume();
  }
}
function dispatchOnData(chunk) {
  if (chunk === undefined)
    return;

  if (this.data === null)
    this.data = [ chunk ];
  else
    this.data.push(chunk);
}
function dispatchOnEnd() {
  if (this.error !== null && this.reject !== null) {
    this.reject(this.error);
  } else if (this.resolve !== null) {
    winston.debug('resolving with '+(
        (this.data === null) ? 'null' : this.data.length+' chunks of'
        )+' data');
    if (!(this.hasSingleResult)) {
      this.resolve(this.data);
    } else if (this.data === null) {
      this.resolve();          
    } else if (this.data.length === 1) {
// TODO: set the format in the mapper to signal whether to parse
      var datum = this.data[0];
      if (this.format !== 'json') {
        this.resolve(datum);          
      } else if (valcheck.isString(datum)) {
        this.resolve(JSON.parse(datum));          
      } else if (valcheck.isBuffer(datum)) {
        this.resolve(JSON.parse(datum.toString()));
      } else {
        this.resolve(datum);
      }
    } else {
      this.resolve(this.data);
    }
  }
}
function dispatchOnError(error) {
  if (error === undefined)
    return;

  if (this.error === null)
    this.error = [ error ];
  else
    this.error.push(error);
}
function dispatchResult(fullfilled, rejected) {
  var self = this;
  var promise = new Promise(function(resolve, reject) {
    if (self.done) {
      if (self.error) {
        if (reject)
          reject(self.error);
      } else if (self.resolve) {
        if (!(self.hasSingleResult)) {
          self.resolve(self.data);
        } else if (self.data === null) {
          self.resolve();          
        } else if (self.data.length === 1) {
          self.resolve(self.data[0]);          
        } else {
          self.resolve(self.data);
        }
      }
    } else {
      if (resolve)
        self.resolve = resolve;
      if (reject)
        self.reject  = reject;
    }
  });
  self.on('data',  dispatchOnData.bind(self));
  self.on('end',   dispatchOnEnd.bind(self));
  self.on('error', dispatchOnError.bind(self));
  return promise.then(fullfilled, rejected);
}
function dispatchStream() {
  return this;
}

// TODO: support error listener for request as well
function ResponseDispatcher(mapper, hasSingleResult, requestdef, minErrorStatus) {
  events.EventEmitter.call(this);
  this.data            = null;
  this.error           = null;
  this.resolve         = null;
  this.reject          = null;
  this.mapper          = mapper;
  this.hasSingleResult = (hasSingleResult === true);
  this.responder       = prepareDispatch.bind(this);
  this.format          = null;
  if (requestdef != undefined) {
    this.requestdef = requestdef;
  }
  this.minErrorStatus  = (minErrorStatus != undefined) ? minErrorStatus : 300;
}
util.inherits(ResponseDispatcher, events.EventEmitter);

function chunkedEventMapper(response, dispatcher) {
  var addErrorListener = true;
  var eventNames = ['data', 'error', 'end'];
  for (var i=0; i < eventNames.length; i++) {
    var event = eventNames[i];
    var listeners = dispatcher.listeners(event);
    if (listeners.length === 0)
      continue;
    switch(event) {
    case 'error':
      addErrorListener = false;
      break;
    }
    for (var j=0; j < listeners.length; j++) {
      response.on(event, listeners[j]);
    }
  }
  if (addErrorListener) {
    response.on('error', mlutil.requestErrorHandler);
  }
  response.resume();
}
function emptyEventMapper(response, dispatcher) {
  var addErrorListener = true;
  var eventNames = ['error', 'end'];
  for (var i=0; i < eventNames.length; i++) {
    var event = eventNames[i];
    var listeners = dispatcher.listeners(event);
    if (listeners.length === 0)
      continue;
    switch(event) {
    case 'error':
      addErrorListener = false;
      break;
    }
    for (var j=0; j < listeners.length; j++) {
      response.on(event, listeners[j]);
    }
  }
  if (addErrorListener) {
    response.on('error', mlutil.requestErrorHandler);
  }
  response.resume();
}
function multipartEventMapper(response, dispatcher) {
  // TODO: bulk read should insert parts for documents that don't exist
  // TODO: empty response should not be multipart/mixed 
  var responseLength = response.headers['content-length'];
  if (valcheck.isNullOrUndefined(responseLength)|| responseLength === "0") {
    winston.debug('empty multipart response');
    response.on('data', mlutil.requestErrorHandler);
    response.on('error', mlutil.requestErrorHandler);
    return response;
  }
  var responseType = response.headers['content-type'];
  var responseBoundary = valcheck.isNullOrUndefined(responseType) ? null :
    responseType.replace(/^multipart.mixed;\s*boundary\s*=\s*([^\s;]+)([\s;].*)?$/, '$1');
  if (valcheck.isNullOrUndefined(responseBoundary)) {
    winston.debug('response without multipart/mixed mime type or boundary');
    response.on('data', mlutil.requestErrorHandler);
    response.on('error', mlutil.requestErrorHandler);
    return response;
  }
  if (responseBoundary !== multipartBoundary) {
    winston.debug(
        'expected '+multipartBoundary+
        ' but received '+responseBoundary+' multipart/mixed boundary'
        );
  }

  var parser = new Dicer({boundary: responseBoundary});
  parser.on('error', mlutil.requestErrorHandler);

  var isPromise = (
      !valcheck.isNullOrUndefined(dispatcher.resolve) ||
      !valcheck.isNullOrUndefined(dispatcher.reject));

  // TODO: pass in event mappings
  var inlineEvent   = isPromise ? 'data' : 'summary';
  var documentEvent = isPromise ? 'data' : 'result';

  var metadata = null;
  var hasFinished = false;
  var parserCount = 0;
  parser.on('part', function(part) {
    parserCount++;
    var partHeaders = null;
    var isInline    = false;
    var format      = null;
    var isMetadata  = false;
    var isUtf8      = false;
    part.on('error', mlutil.requestErrorHandler);
    part.on('header', function(headers) {
      partHeaders = parsePartHeaders(headers);
      isInline = (partHeaders.partType === 'inline');
      format = partHeaders.format;
      if (format === undefined) {
        format = contentTypeToFormat(partHeaders.contentType);
      }
      isMetadata  = (partHeaders.category && partHeaders.category !== 'content');
      isUtf8 = (
          isInline || isMetadata || format === 'json' || format === 'text' || format === 'xml'
          );
      if (isUtf8) {
        // TODO: confirm that it is not too late to set the encoding
        part.setEncoding('utf8');
      }
    });
    var partReader = concatStream(
        // TODO: better to know part type before create part reader
        //      {encoding: (isUtf8 ? 'string' : 'buffer')},
        function(data) {
          parserCount--;
          // TODO: remove partType key from partHeaders
          // TODO: option for whether and how to parse the JSON or XML metadata or content
          // TODO: branch to aggregates, binaries, metrics, plan
          partHeaders.content =
            (format === 'json')  ? JSON.parse(data) :
            (isUtf8 && valcheck.isBuffer(data)) ? data.toString()  : data;
          if (metadata !== null && metadata.uri !== partHeaders.uri) {
            winston.debug('emitting standalone metadata as '+documentEvent+' for '+metadata.uri);
            emitMetadata(metadata, documentEvent, dispatcher);
            metadata = null;
          }
          if (isInline) {
            winston.debug('emitting inline content as '+inlineEvent);
            dispatcher.emit(inlineEvent, partHeaders.content);
          } else if (isMetadata) {
            winston.debug('received metadata for '+partHeaders.uri);
            metadata = partHeaders;
          } else {
            if (metadata !== null) {
              winston.debug('copying metadata for '+metadata.uri);
              mlutil.copyProperties(metadata.content, partHeaders);
              metadata = null;
            }
            winston.debug('emitting content as '+documentEvent+' for '+partHeaders.uri);            
            dispatcher.emit(documentEvent, partHeaders);
          }
          if (hasFinished === true && parserCount === 0) {
            if (metadata !== null) {
              winston.debug('finishing metadata as '+documentEvent+' in part for '+metadata.uri);
              emitMetadata(metadata, documentEvent, dispatcher);
            }
            dispatcher.emit('end');        
          }
        });
    partReader.on('error', mlutil.requestErrorHandler);
    part.pipe(partReader);
  });

  parser.on('finish', function() {
    hasFinished = true;
    if (parserCount === 0) {
      if (metadata !== null) {
        winston.debug('finishing metadata as '+documentEvent+' for '+metadata.uri);
        emitMetadata(metadata, documentEvent, dispatcher);
      }
      dispatcher.emit('end');        
    }
  });

  response.pipe(parser);
}
function resultEventMapper(response, dispatcher) {
  var listeners = dispatcher.listeners('error');
  if (!valcheck.isNullOrUndefined(listeners)) {
    for (var j=0; j < listeners.length; j++) {
      response.on('error', listeners[j]);
    }
  } else {
    response.on('error', mlutil.requestErrorHandler);
  }

  var format   = response.headers['vnd.marklogic.document-format'];
  var isString = false;
  if (valcheck.isNullOrUndefined(format)) {
    var contentType = response.headers['content-type'];
    if (!valcheck.isNullOrUndefined(contentType)) {
      format = contentType.replace(/^application.(json|xml)(;.*)?$/, '$1');
      if (!valcheck.isNullOrUndefined(format)) {
        isString = true;
      } else if (contentType.match(/;\s*charset=utf-8/)) {
        format = 'text';
        isString = true;
      }
    }
  } else if (format !== 'binary') {
    isString = true;
  }
  response.pipe(
    concatStream(
      {encoding: (isString ? 'string' : 'buffer')},
      function(data) {
        dispatcher.emit('data',
          (format === 'json')  ? JSON.parse(data) :
          (isString && valcheck.isBuffer(data)) ? data.toString()  : data
          );
        dispatcher.emit('end');
      })
    );
}
function parsePartHeaders(headers) {
  var partHeaders = {};

  if (headers['content-disposition']) {
    var contentDisposition = headers['content-disposition'][0];
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
  if (headers['content-type']) {
    partHeaders.contentType = headers['content-type'][0];
  }
  if (headers['content-length']) {
    partHeaders.contentLength = headers['content-length'][0];
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
function emitMetadata(metadata, eventName, dispatcher) {
  mlutil.copyProperties(metadata.content, metadata);
  delete metadata.content;
  dispatcher.emit(eventName, metadata);
}

function createRequest(client, options, writable, responder) {
  var request = null;
  options.Connection = 'keep-alive';
  var authenticator = getAuthenticator(client, options.user);
  if (options.authType !== 'DIGEST' || authenticator) {
    winston.debug('direct request for %s', options.path);
    request = http.request(options, responder);
    if (authenticator) {
      request.setHeader('authorization',
          authenticator.authorize(options.method, options.path)
          );
    }
  } else {
    winston.debug('pre-challenge request for %s', options.path);
    // buffer writes until there is an authenticated request
    var proxyRequest = null;
    if (writable) {
      proxyRequest = through();
      proxyRequest.pause();
    }

    var request1 = http.request(options, function(response) {
      winston.debug('response with status %d', response.statusCode);
      var challenge = response.headers['www-authenticate'];
      var hasChallenge = !valcheck.isNullOrUndefined(challenge);
      if ((response.statusCode === 401 && hasChallenge) ||
          (response.statusCode < 400 && writable)) {
        var authenticator = hasChallenge ? createAuthenticator(
            this, options.user, options.password, challenge
            ) : null;
        response.on('end', function() {
          winston.debug('post-challenge request for %s', options.path);
          var request2 = http.request(options, responder);
          if (hasChallenge) {
            request2.setHeader('authorization',
                authenticator.authorize(options.method, options.path)
                );
          }
          if (writable) {
            proxyRequest.pipe(request2);
            proxyRequest.resume();
          } else {
            request2.end();
          }
        }.bind(this));
        response.resume();
      } else if (response.statusCode < 400) {
        responder(response);
      } else {
        winston.debug('challenge request failed for %s', options.path);
        // TODO: log / throw error
      }
    }.bind(client));
    if (writable) {
      request = proxyRequest;
      request1.end();
    } else {
      request = request1;
    }
  }
  return request;
}

function createResponseDispatcher(mapper, hasSingleResult, requestdef, minErrorStatus) {
  return new ResponseDispatcher(mapper, hasSingleResult, requestdef, minErrorStatus);
}

function createResultSelector(responseDispatcher, withStream, resultSelector) {
  if (resultSelector === undefined) {
    resultSelector = {};
  }
  resultSelector.result = dispatchResult.bind(responseDispatcher);
  if (withStream) {
    resultSelector.stream = dispatchStream.bind(responseDispatcher);
  }
  return resultSelector;
}

// winston.level = 'debug';

module.exports = {
    chunkedEventMapper:       chunkedEventMapper,
    createRequest:            createRequest,
    createResponseDispatcher: createResponseDispatcher,
    createResultSelector:     createResultSelector,
    emptyEventMapper:         emptyEventMapper,
    multipartBoundary:        multipartBoundary,
    multipartEventMapper:     multipartEventMapper,
    resultEventMapper:        resultEventMapper
};
