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
var mlrest   = require('../lib/mlrest.js');

var host     = 'localhost';
var port     = '8015';
var authType = 'DIGEST';
var restAdminConnection = {
    host:     host,
    port:     port,
    user:     'rest-admin',
    password: 'x',
    authType: authType
};
var restReaderConnection = {
    host:     host,
    port:     port,
    user:     'rest-reader',
    password: 'x',
    authType: authType
};
var restWriterConnection = {
    host:     host,
    port:     port,
    user:     'rest-writer',
    password: 'x',
    authType: authType
};

// CAUTION: the functions in this module are not part of the supported API and
// may change or may be removed at any time.

function responseOutputTransform(data) {
  var operation = this;

  var response = {
      statusCode: operation.responseStatusCode,
      headers:    operation.responseHeaders
  };
  if (!valcheck.isUndefined(data)) {
    response.data = data;
  }

  return response;
}
/* TODO: 
boolean for whether get, post, or delete response is single or empty
*/
function startGet(endpoint, params, headers) {
  var path = makePath(endpoint, params);

  var requestOptions = mlutil.copyProperties(this.client.connectionParams);
  requestOptions.method = 'GET';
  requestOptions.headers = valcheck.isUndefined(headers) ? {
    'Accept': 'application/json'
    } : headers;
  requestOptions.path = path;
  
  var operation = mlrest.createOperation(
      'GET '+path, this.client, requestOptions, 'empty', 'single'
      );
  operation.outputTransform  = responseOutputTransform;

  return mlrest.startRequest(operation);
}
function startPost(endpoint, params, headers, body) {
  var path = makePath(endpoint, params);

  var requestOptions = mlutil.copyProperties(this.client.connectionParams);
  requestOptions.method = 'POST';
  requestOptions.headers = valcheck.isUndefined(headers) ? {
    'Content-Type': 'application/json',
    'Accept':       'application/json'
    } : headers;
  requestOptions.path = path;
  
  var operation = mlrest.createOperation(
      'POST '+path,
      this.client,
      requestOptions,
      valcheck.isUndefined(body) ? 'empty' : 'single',
      'single'
      );
  operation.outputTransform  = responseOutputTransform;

  return mlrest.startRequest(operation);  
}
function startPut(endpoint, params, headers, body) {
  var path = makePath(endpoint, params);

  var requestOptions = mlutil.copyProperties(this.client.connectionParams);
  requestOptions.method = 'PUT';
  requestOptions.headers = valcheck.isUndefined(headers) ? {
    'Content-Type': 'application/json'
    } : headers;
  requestOptions.path = path;
  
  var operation = mlrest.createOperation(
      'PUT '+path,
      this.client,
      requestOptions,
      valcheck.isUndefined(body) ? 'empty' : 'single',
      'empty'
      );
  operation.outputTransform  = responseOutputTransform;

  return mlrest.startRequest(operation);  
}
function startRemove(endpoint, params, headers) {
  var path = makePath(endpoint, params);

  var requestOptions = mlutil.copyProperties(this.client.connectionParams);
  requestOptions.method = 'DELETE';
  requestOptions.headers = valcheck.isUndefined(headers) ? {
    'Accept': 'application/json'
    } : headers;
  requestOptions.path = path;
  
  var operation = mlrest.createOperation(
      'DELETE '+path,
      this.client,
      requestOptions,
      'empty',
      'empty'
      );
  operation.outputTransform  = responseOutputTransform;

  return mlrest.startRequest(operation);  
}
function makePath(endpoint, params) {
  var path = endpoint;
  if (!valcheck.isUndefined(params)) {
    var paramKeys = Object.keys(params);
    var sep = '?';
    for (var i=0; i < paramKeys.length; i++) {
      var paramKey = paramKeys[i];
      path += sep+paramKey+'='+params[paramKey];
      if (i === 0) {
        sep = '&';
      }
    }
  }

  return path;
}
function createRequester(adminClient) {
  var requester = {
      client: adminClient
  };
  requester.get    = startGet.bind(requester);
  requester.post   = startPost.bind(requester);
  requester.put    = startPut.bind(requester);
  requester.remove = startRemove.bind(requester);

  return requester;
};

module.exports = {
    restAdminConnection:  restAdminConnection,
    restReaderConnection: restReaderConnection,
    restWriterConnection: restWriterConnection,
    createRequester:      createRequester
};
