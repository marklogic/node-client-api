/*
 * Copyright (c) 2020 MarkLogic Corporation
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
var requester = require('./requester.js');
var mlutil    = require('./mlutil.js');
var Operation = require('./operation.js');

/**
 * Provides functions to execute resource services on the REST server
 * for the client. The resource service extensions must have been
 * installed previously on the REST server using the
 * {@link config.resources#write} function.
 * @namespace resources
 */

/** @ignore */
function checkArgs() {
  if (arguments.length === 0) {
    throw new Error('no argument for executing resource service');
  }

  var args = arguments[0];
  if (args.name === void 0) {
    throw new Error('no name for executing resource service');
  }

  return args;
}
/** @ignore */
function makeRequestOptions(client, args) {
  var path = '/v1/resources/'+args.name;

  var sep ='?';

  var params = args.params;
  var keys = (params === void 0) ? null : Object.keys(params);
  var keyLen = (keys === null) ? 0 : keys.length;
  var key = null;
  var prefix = null;
  var i=0;
  var value = null;
  var j=0;
  for (; i < keyLen; i++) {
    key = keys[i];
    value = params[key];
    if (Array.isArray(value)) {
      prefix = sep+encodeURIComponent('rs:'+key)+'=';
      for (j=0; j < value.length; j++) {
        path += prefix+encodeURIComponent(value[j]);
        if (i === 0 && j === 0) {
          sep ='&';
          prefix = sep+encodeURIComponent('rs:'+key)+'=';
        }
      }
    } else {
      path += sep+'rs:'+key+'='+encodeURIComponent(value);
      if (i === 0) {
        sep ='&';
      }
    }
  }

  var txid = mlutil.convertTransaction(args.txid);
  if (txid !== undefined && txid != null) {
    path += sep+'txid='+mlutil.getTxidParam(txid);
    if (sep === '?') {
      sep ='&';
    }
  }

  var connectionParams = client.getConnectionParams();
  var requestOptions = mlutil.copyProperties(connectionParams);
  requestOptions.path = mlutil.databaseParam(connectionParams, path, sep);
  mlutil.addTxidHeaders(requestOptions, txid);

  return requestOptions;
}
function validateStatusCode(statusCode) {
  return (statusCode < 400) ? null : "response with invalid "+statusCode+" status";
}

function Resources(client) {
  if (!(this instanceof Resources)) {
    return new Resources(client);
  }
  this.client = client;
}

//TODO: stream parameter should control whether object or chunked
/**
 * Invokes the get() function in the resource service.  The arguments
 * must be passed as a single object with a property for each parameter.
 * @method resources#get
 * @since 1.0
 * @param {string} name - the name of the service
 * @param {object} [params] - an object in which each property has
 * a variable name as a key and a number, string, or boolean value
 * @param {string|transactions.Transaction}  [txid] - a string
 * transaction id or Transaction object identifying an open
 * multi-statement transaction
 * @returns {ResultProvider} an object whose stream() function returns
 * a stream that receives the response
 */
Resources.prototype.get = function getResourceExec() {
  return readResourceExec(
      this, 'multipart', 'multipart/mixed; boundary='+mlutil.multipartBoundary,
      checkArgs.apply(null, arguments)
      );
};
Resources.prototype.getReadStream = function getResourceExecStream() {
  var args = checkArgs.apply(null, arguments);

  var contentType = args.contentType;
  if (contentType == null) {
    throw new Error('no content type for reading stream from resource service');
  }

  return readResourceExec(this, 'chunked', contentType, args);
};
/** @ignore */
function readResourceExec(self, responseType, contentType, args) {
  var requestOptions = makeRequestOptions(self.client, args);
  requestOptions.method = 'GET';
  requestOptions.headers = {
      'Accept': contentType
  };

  var operation = new Operation(
      'execute remove service', self.client, requestOptions, 'empty', responseType
      );
  operation.name = args.name;
  operation.statusCodeValidator = validateStatusCode;

  return requester.startRequest(operation);
}

/**
 * Invokes the post() function in the resource service.  The arguments
 * must be passed as a single object with a property for each parameter.
 * @method resources#post
 * @since 1.0
 * @param {string} name - the name of the service
 * @param {object} [params] - an object in which each property has
 * a variable name as a key and a number, string, or boolean value
 * @param {string|object|Buffer|ReadableStream}  [documents] - any document
 * content to send to the server
 * @param {string|transactions.Transaction}  [txid] - a string
 * transaction id or Transaction object identifying an open
 * multi-statement transaction
 * @returns {ResultProvider} an object whose stream() function returns
 * a stream that receives the response
 */
Resources.prototype.post = function postResourceExec() {
  return writeResources(this, 'POST', 'multipart', checkArgs.apply(null, arguments));
};
/**
 * Invokes the put() function in the resource service.  The arguments
 * must be passed as a single object with a property for each parameter.
 * @method resources#put
 * @since 1.0
 * @param {string} name - the name of the service
 * @param {object} [params] - an object in which each property has
 * a variable name as a key and a number, string, or boolean value
 * @param {string|object|Buffer|ReadableStream}  [documents] - any document
 * content to send to the server
 * @param {string|transactions.Transaction}  [txid] - a string
 * transaction id or Transaction object identifying an open
 * multi-statement transaction
 */
Resources.prototype.put = function putResourceExec() {
  return writeResources(this, 'PUT', 'single', checkArgs.apply(null, arguments));
};
Resources.prototype.postWriteStream = function postResourceExecStream() {
  return writeResourceStream(this, 'POST', 'multipart', checkArgs.apply(null, arguments));
};
Resources.prototype.putWriteStream  = function putResourceExecStream() {
  return writeResourceStream(this, 'PUT', 'single', checkArgs.apply(null, arguments));
};
/** @ignore */
function writeResourceStream(self, method, responseType, args) {
  var contentType = args.contentType;
  if (contentType == null) {
    throw new Error('no content type for writing stream to resource service');
  }

  var requestOptions = makeRequestOptions(self.client, args);
  requestOptions.headers = {
      'Content-Type': contentType,
      'Accept': 'application/json'
  };
  requestOptions.method = method;

  var operation = new Operation(
      'execute '+method+' service stream', self.client, requestOptions,
      'chunked', responseType
      );
  operation.name = args.name;
  operation.isReplayable = false;
  operation.statusCodeValidator = validateStatusCode;

  return requester.startRequest(operation);
}
/** @ignore */
function writeResources(self, method, responseType, args) {
  var documents = args.documents;

  var isEmpty = (documents == null);
  if (!isEmpty && !Array.isArray(documents)) {
    documents = [documents];
  }

  var multipartBoundary = mlutil.multipartBoundary;

  var requestOptions = makeRequestOptions(self.client, args);
  requestOptions.method = method;
  requestOptions.headers = (!isEmpty) ?
    {
        'Content-Type': 'multipart/mixed; boundary='+multipartBoundary,
        'Accept': 'application/json'
    } :
    {
        'Accept': 'application/json'
    };

  var operation = new Operation(
      'execute '+method+' service', self.client, requestOptions,
      (isEmpty ? 'empty' : 'multipart'), responseType
      );
  operation.name = args.name;
  if (!isEmpty) {
    operation.multipartBoundary = multipartBoundary;
  }

  operation.requestPartList = [];
  if (typeof documents !== 'undefined') {
    for (var i=0; i < documents.length; i++) {
      addPart(operation, documents[i]);
    }
  }

  operation.statusCodeValidator = validateStatusCode;

  return requester.startRequest(operation);
}
/** @ignore */
function addPart(operation, document) {
  var headers = {};
  var part    = {
      headers: headers
      };

  var content       = document.content;
  var hasContent    = (content != null);
  var contentType   = hasContent ? document.contentType : null;

  if (hasContent && (contentType != null)) {
    var marshaledData = mlutil.marshal(content, operation);
/* TODO: allow encoding in multipart parse
    headers['Content-Type'] = contentType +
      ((typeof marshaledData === 'string' || marshaledData instanceof String) ? '; charset=utf-8' : '');
 */
    headers['Content-Type'] = contentType;
    part.content = marshaledData;
  } else if (typeof document === 'string' || document instanceof String) {
    part.content = document;
//    headers['Content-Type'] = 'text/plain; charset=utf-8';
    headers['Content-Type'] = 'text/plain';
  } else if (Buffer.isBuffer(document)) {
    part.content = document;
    headers['Content-Type'] = 'application/x-unknown-content-type';
  } else {
    part.content = JSON.stringify(document);
//    headers['Content-Type'] = 'application/json; charset=utf-8';
    headers['Content-Type'] = 'application/json';
  }

  operation.requestPartList.push(part);
}

/**
 * Invokes the delete() function in the resource service.  The arguments
 * must be passed as a single object with a property for each parameter.
 * @method resources#remove
 * @since 1.0
 * @param {string} name - the name of the service
 * @param {object} [params] - an object in which each property has
 * a variable name as a key and a number, string, or boolean value
 * @param {string|transactions.Transaction}  [txid] - a string
 * transaction id or Transaction object identifying an open
 * multi-statement transaction
 */
Resources.prototype.remove = function removeResourceExec() {
  var args = checkArgs.apply(null, arguments);

  var requestOptions = makeRequestOptions(this.client, args);
  requestOptions.headers = {
      'Accept': 'application/json'
  };
  requestOptions.method  = 'DELETE';

  var operation = new Operation(
      'execute remove service', this.client, requestOptions, 'empty', 'single'
      );
  operation.name = args.name;
  operation.statusCodeValidator = validateStatusCode;

  return requester.startRequest(operation);
};

module.exports = Resources;
