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
var valcheck = require('core-util-is');
var mlrest = require('./mlrest.js');
var mlutil = require('./mlutil.js');

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
  if (valcheck.isUndefined(args.name)) {
    throw new Error('no name for executing resource service');
  }

  return args;
}
/** @ignore */
function makeRequestOptions(client, args) {
  var path = '/v1/resources/'+args.name;

  var sep ='?';

  var params = args.params;
  var keys = valcheck.isUndefined(params) ? null : Object.keys(params);
  var keyLen = valcheck.isNull(keys) ? 0 : keys.length;
  var key = null;
  var prefix = null;
  var i=0;
  var value = null;
  var j=0;
  for (; i < keyLen; i++) {
    key = keys[i];
    value = params[key];
    if (valcheck.isArray(value)) {
      prefix = sep+'rs:'+key+'=';
      for (j=0; j < value.length; j++) {
        path += prefix+encodeURIComponent(value[j]);
        if (i === 0 && j === 0) {
          sep ='&';
          prefix = sep+'rs:'+key+'=';
        }
      }
    } else {
      path += sep+'rs:'+key+'='+encodeURIComponent(value);
      if (i === 0) {
        sep ='&';
      }
    }
  }

  var txid = args.txid;
  if (txid !== undefined) {
    path += sep+'txid='+params.txid;
    if (sep === '?') {
      sep ='&';
    }
  }

  var connectionParams = client.connectionParams;
  var requestOptions = mlutil.copyProperties(connectionParams);
  requestOptions.path = mlutil.databaseParam(connectionParams, path, sep);

  return requestOptions;
}
function validateStatusCode(statusCode) {
  return (statusCode < 400) ? null : "response with invalid "+statusCode+" status";
}

//TODO: stream parameter should control whether object or chunked
/**
 * Invokes the get() function in the resource service.
 * @method resources#get
 * @param {string} name - the name of the service
 * @param {object} [params] - an object in which each property has
 * a variable name as a key and a number, string, or boolean value
 * @param {string}  [txid] - the transaction id for an open transaction
 * @returns {ResultProvider} an object whose stream() function returns
 * a stream that receives the response
 */
function getResourceExec() {
  return readResourceExec(
      this, 'multipart', 'multipart/mixed; boundary='+mlrest.multipartBoundary,
      checkArgs.apply(null, arguments)
      );
}
/** @ignore */
function getResourceExecStream() {
  var args = checkArgs.apply(null, arguments);

  var contentType = args.contentType;
  if (valcheck.isNullOrUndefined(contentType)) {
    throw new Error('no content type for reading stream from resource service');
  }

  return readResourceExec(this, 'chunked', contentType, args);
}
function readResourceExec(self, responseType, contentType, args) {
  var requestOptions = makeRequestOptions(self.client, args);
  requestOptions.method = 'GET';
  requestOptions.headers = {
      'Accept': contentType
  };

  var operation = mlrest.createOperation(
      'execute remove service', self.client, requestOptions, 'empty', responseType
      );
  operation.name = args.name;
  operation.statusCodeValidator = validateStatusCode;

  return mlrest.startRequest(operation);
}

/**
 * Invokes the post() function in the resource service.
 * @method resources#post
 * @param {string} name - the name of the service
 * @param {object} [params] - an object in which each property has
 * a variable name as a key and a number, string, or boolean value
 * @param {string|object|Buffer|ReadableStream}  [documents] - any document
 * content to send to the server
 * @param {string}  [txid] - the transaction id for an open transaction
 * @returns {ResultProvider} an object whose stream() function returns
 * a stream that receives the response
 */
function postResourceExec() {
  return writeResources(this, 'POST', 'multipart', checkArgs.apply(null, arguments));
}
/**
 * Invokes the put() function in the resource service.
 * @method resources#put
 * @param {string} name - the name of the service
 * @param {object} [params] - an object in which each property has
 * a variable name as a key and a number, string, or boolean value
 * @param {string|object|Buffer|ReadableStream}  [documents] - any document
 * content to send to the server
 * @param {string}  [txid] - the transaction id for an open transaction
 */
function putResourceExec() {
  return writeResources(this, 'PUT', 'single', checkArgs.apply(null, arguments));
}
function postResourceExecStream() {
  return writeResourceStream(this, 'POST', 'multipart', checkArgs.apply(null, arguments));
}
function putResourceExecStream() {
  return writeResourceStream(this, 'PUT', 'single', checkArgs.apply(null, arguments));
}
/** @ignore */
function writeResourceStream(self, method, responseType, args) {
  var contentType = args.contentType;
  if (valcheck.isNullOrUndefined(contentType)) {
    throw new Error('no content type for writing stream to resource service');
  }

  var requestOptions = makeRequestOptions(self.client, args);
  requestOptions.headers = {
      'Content-Type': contentType,
      'Accept': 'application/json'
  };
  requestOptions.method = method;

  var operation = mlrest.createOperation(
      'execute '+method+' service stream', self.client, requestOptions,
      'chunked', responseType
      );
  operation.name = args.name;
  operation.statusCodeValidator = validateStatusCode;

  return mlrest.startRequest(operation);
}
/** @ignore */
function writeResources(self, method, responseType, args) {
  var documents = args.documents;

  var isEmpty = valcheck.isNullOrUndefined(documents);
  if (!isEmpty && !valcheck.isArray(documents)) {
    documents = [documents];
  }

  var multipartBoundary = mlrest.multipartBoundary;

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

  var partList = [];
  for (var i=0; i < documents.length; i++) {
    addPart(partList, documents[i]);
  }

  var operation = mlrest.createOperation(
      'execute '+method+' service', self.client, requestOptions,
      (isEmpty ? 'empty' : 'multipart'), responseType
      );
  operation.name = args.name;
  if (!isEmpty) {
    operation.multipartBoundary = multipartBoundary;
  }
  operation.requestPartList   = partList;
  operation.statusCodeValidator = validateStatusCode;

  return mlrest.startRequest(operation);
}
/** @ignore */
function addPart(partList, document) {
  var headers = {};
  var part    = {
      headers: headers
      };

  var content       = document.content;
  var hasContent    = !valcheck.isNullOrUndefined(content);
  var contentType   = hasContent ? document.contentType : null;

  if (hasContent && !valcheck.isNullOrUndefined(contentType)) {
    var marshaledData = mlrest.marshal(content);
/* TODO: allow encoding in multipart parse
    headers['Content-Type'] = contentType +
      (valcheck.isString(marshaledData) ? '; charset=utf-8' : '');
 */
    headers['Content-Type'] = contentType;
    part.content = marshaledData;
  } else if (valcheck.isString(document)) {
    part.content = document;
//    headers['Content-Type'] = 'text/plain; charset=utf-8';
    headers['Content-Type'] = 'text/plain';
  } else if (valcheck.isBuffer(document)) {
    part.content = document;
    headers['Content-Type'] = 'application/x-unknown-content-type';      
  } else {
    part.content = JSON.stringify(document);
//    headers['Content-Type'] = 'application/json; charset=utf-8';
    headers['Content-Type'] = 'application/json';
  }

  partList.push(part);
}

/**
 * Invokes the delete() function in the resource service.
 * @method resources#remove
 * @param {string} name - the name of the service
 * @param {object} [params] - an object in which each property has
 * a variable name as a key and a number, string, or boolean value
 * @param {string}  [txid] - the transaction id for an open transaction
 */
function removeResourceExec() {
  var args = checkArgs.apply(null, arguments);

  var requestOptions = makeRequestOptions(this.client, args);
  requestOptions.headers = {
      'Accept': 'application/json'
  };
  requestOptions.method  = 'DELETE';

  var operation = mlrest.createOperation(
      'execute remove service', this.client, requestOptions, 'empty', 'single'
      );
  operation.name = args.name;
  operation.statusCodeValidator = validateStatusCode;

  return mlrest.startRequest(operation);
}

function resources(client) {
  this.client = client;
}
resources.prototype.get             = getResourceExec;
resources.prototype.getReadStream   = getResourceExecStream;
resources.prototype.post            = postResourceExec;
resources.prototype.postWriteStream = postResourceExecStream;
resources.prototype.put             = putResourceExec;
resources.prototype.putWriteStream  = putResourceExecStream;
resources.prototype.remove          = removeResourceExec;

module.exports = resources;
