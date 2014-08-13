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
  var path = '/v1/resources?name='+encodeURIComponent(args.name)+'&format='+args.format;

  var params = args.params;
  var keys = valcheck.isUndefined(params) ? null : Object.keys(params);
  var keyLen = valcheck.isNull(keys) ? 0 : keys.length;
  var key = null;
  for (var i=0; i < keyLen; i++) {
    key = keys[i];
    path += '&rs:'+key+'='+encodeURIComponent(params[key]);
  }

  var txid = args.txid;
  if (txid !== undefined) {
    path += '&txid='+params.txid;
  }

  return path;
}
function makeRequestOptions(client, path) {
  var requestOptions = mlutil.copyProperties(client.connectionParams);
  requestOptions.path = path;

  return requestOptions;
}

function getResourceExec() {
  var args = checkArgs.apply(null, arguments);

  var path = makeRequestPath(args);

  var requestOptions = makeRequestOptions(this.client, path);
  requestOptions.method = 'GET';
  requestOptions.headers = {
      'Accept': 'multipart/mixed; boundary='+mlrest.multipartBoundary
  };

  var operation = mlrest.createOperation(
      'execute remove service', this.client, requestOptions, 'empty', 'multipart'
      );
  operation.name = args.name;
  operation.validStatusCodes = [200, 204];

  return mlrest.startRequest(operation);
}
function postResourceExec() {
  // TODO: multipart read and multipart write?
}
function postResourceExecStream() {
  // TODO:
}
function putResourceExecStream() {
  // TODO:
}
function putResourceExec() {
  var args = checkArgs.apply(null, arguments);

  var documents = args.documents;

  var isEmpty = valcheck.isNullOrUndefined(documents);
  if (!isEmpty && !valcheck.isArray(documents)) {
    documents = [documents];
  }

  var multipartBoundary = mlrest.multipartBoundary;

  var path = makeRequestPath(args);

  var requestOptions = makeRequestOptions(this.client, path);
  requestOptions.method = 'PUT';
  if (!isEmpty) {
    requestOptions.headers = {
        'Content-Type': 'multipart/mixed; boundary='+multipartBoundary+'1'
    };    
  }

  var operation = mlrest.createOperation(
      'execute put service', this.client, requestOptions,
      (isEmpty ? 'empty' : 'multipart'), 'single'
      );
  operation.name = args.name;
  if (!isEmpty) {
    operation.multipartBoundary = multipartBoundary;
  }
// TODO: make part list - looking only for mime type
//  operation.requestPartList   = requestPartList;
  operation.validStatusCodes = [200, 204];

  return mlrest.startRequest(operation);
}
function removeResourceExec() {
  var args = checkArgs.apply(null, arguments);

  var path = makeRequestPath(args);

  var requestOptions = makeRequestOptions(this.client, path);
  requestOptions.method = 'DELETE';

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
resources.prototype.post            = postResourceExec;
resources.prototype.postWriteStream = postResourceExecStream;
resources.prototype.put             = putResourceExec;
resources.prototype.putWriteStream  = putResourceExecStream;
resources.prototype.remove          = removeResourceExec;

module.exports = resources;
