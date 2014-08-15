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
var valcheck = require('core-util-is');
var mlrest = require('./mlrest.js');
var mlutil = require('./mlutil.js');

function checkArgs() {
  if (arguments.length === 0) {
    throw new Error('no argument for executing resource service');
  }

  var args = arguments[0];
  if (valcheck.isUndefined(args.name)) {
    throw new Error('no name for executing resource service');
  }
  if (valcheck.isUndefined(args.format)) {
    throw new Error('no format for executing resource service');
  }

  return args;
}
function makeRequestPath(args) {
  var path = '/v1/resources/'+args.name;

  var sep ='?';

  var params = args.params;
  var keys = valcheck.isUndefined(params) ? null : Object.keys(params);
  var keyLen = valcheck.isNull(keys) ? 0 : keys.length;
  var key = null;
  for (var i=0; i < keyLen; i++) {
    key = keys[i];
    path += sep+'rs:'+key+'='+encodeURIComponent(params[key]);
    if (i === 0) {
      sep ='&';
    }
  }

  var txid = args.txid;
  if (txid !== undefined) {
    path += sep+'txid='+params.txid;
  }

  return path;
}
function makeRequestOptions(client, path) {
  var requestOptions = mlutil.copyProperties(client.connectionParams);
  requestOptions.path = path;

  return requestOptions;
}

function getResourceExec() {
  return readResourceExec(
      this, 'multipart', 'multipart/mixed; boundary='+mlrest.multipartBoundary,
      checkArgs.apply(null, arguments)
      );
}
function getResourceExecStream() {
  var args = checkArgs.apply(null, arguments);

  var contentType = args.contentType;
  if (valcheck.isNullOrUndefined(contentType)) {
    throw new Error('no content type for reading stream from resource service');
  }

  return readResourceExec(this, 'chunked', contentType, args);
}
function readResourceExec(self, responseType, contentType, args) {
  var path = makeRequestPath(args);

  var requestOptions = makeRequestOptions(self.client, path);
  requestOptions.method = 'GET';
  requestOptions.headers = {
      'Accept': contentType
  };

  var operation = mlrest.createOperation(
      'execute remove service', self.client, requestOptions, 'empty', responseType
      );
  operation.name = args.name;
  operation.validStatusCodes = [200, 204];

  return mlrest.startRequest(operation);
}

function postResourceExec() {
  return writeResources(this, 'POST', 'multipart', checkArgs.apply(null, arguments));
}
function putResourceExec() {
  return writeResources(this, 'PUT', 'single', checkArgs.apply(null, arguments));
}
function postResourceExecStream() {
  return writeResourceStream(this, 'POST', 'single', checkArgs.apply(null, arguments));
}
function putResourceExecStream() {
  return writeResourceStream(this, 'PUT', 'single', checkArgs.apply(null, arguments));
}
function writeResourceStream(self, method, responseType, args) {
  var contentType = args.contentType;
  if (valcheck.isNullOrUndefined(contentType)) {
    throw new Error('no content type for writing stream to resource service');
  }

  var path = makeRequestPath(args);

  var requestOptions = makeRequestOptions(self.client, path);
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
  operation.validStatusCodes = [200, 204];

  return mlrest.startRequest(operation);
}
function writeResources(self, method, responseType, args) {
  var documents = args.documents;

  var isEmpty = valcheck.isNullOrUndefined(documents);
  if (!isEmpty && !valcheck.isArray(documents)) {
    documents = [documents];
  }

  var multipartBoundary = mlrest.multipartBoundary;

  var path = makeRequestPath(args);

  var requestOptions = makeRequestOptions(self.client, path);
  requestOptions.method = method;
  requestOptions.headers = (!isEmpty) ?
    {
        'Content-Type': 'multipart/mixed; boundary='+multipartBoundary+'1',
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
  operation.validStatusCodes = [200, 204];

  return mlrest.startRequest(operation);
}
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
    headers['Content-Type'] = contentType +
      (valcheck.isString(marshaledData) ? '; encoding=utf-8' : '');
    part.content = marshaledData;
  } else {
    if (valcheck.isString(document)) {
      part.content = document;
      headers['Content-Type'] = 'text/plain; encoding=utf-8';
    } else if (valcheck.isBuffer(document)) {
      part.content = document;
      headers['Content-Type'] = 'application/x-unknown-content-type';      
    } else {
      part.content = JSON.stringify(document);
      headers['Content-Type'] = 'application/json; encoding=utf-8';
    }
  }

  partList.push(part);
}

function removeResourceExec() {
  var args = checkArgs.apply(null, arguments);

  var path = makeRequestPath(args);

  var requestOptions = makeRequestOptions(this.client, path);
  requestOptions.headers = {
      'Accept': 'application/json'
  };
  requestOptions.method  = 'DELETE';

  var operation = mlrest.createOperation(
      'execute remove service', this.client, requestOptions, 'empty', 'single'
      );
  operation.name = args.name;
  operation.validStatusCodes = [200, 204];

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
