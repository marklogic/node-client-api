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

var mlrest    = require('../lib/mlrest.js');
var mlutil    = require('../lib/mlutil.js');

//CAUTION: the functions in this module are not part of the supported API and
//may change or may be removed at any time.

function responseOutputTransform(headers, data) {
  var operation = this;

  var response = {
      statusCode: operation.responseStatusCode,
      headers:    headers
  };
  if (!valcheck.isNullOrUndefined(data)) {
    response.data = data;
  }

  return response;
}
// TODO: configure acceptable errors
function manageGet(paramsObj) {
  var endpoint    = paramsObj.endpoint;
  var params      = paramsObj.params;
  var headers     = paramsObj.headers;
  var hasResponse = paramsObj.hasResponse;

  var path = makePath(endpoint, params);

  var requestOptions = mlutil.copyProperties(this.client.connectionParams);
  requestOptions.method = 'GET';
  requestOptions.headers = valcheck.isNullOrUndefined(headers) ? {
    'Accept': 'application/json'
    } : headers;
  requestOptions.path = path;
  
  var operation = mlrest.createOperation(
      'GET '+path, this.client, requestOptions, 'empty',
      ((hasResponse === 'false') ? 'empty' : 'single')
      );
  operation.validStatusCodes = [200, 201, 204, 404];
  operation.outputTransform  = responseOutputTransform;

  return mlrest.startRequest(operation);
}
function managePost(paramsObj) {
  var endpoint    = paramsObj.endpoint;
  var params      = paramsObj.params;
  var headers     = paramsObj.headers;
  var body        = paramsObj.body;
  var hasResponse = paramsObj.hasResponse;

  var path = makePath(endpoint, params);

  var requestOptions = mlutil.copyProperties(this.client.connectionParams);
  requestOptions.method = 'POST';
  requestOptions.headers = valcheck.isNullOrUndefined(headers) ? {
    'Content-Type': 'application/json',
    'Accept':       'application/json'
    } : headers;
  requestOptions.path = path;
  
  var hasBody = !valcheck.isNullOrUndefined(body);

  var operation = mlrest.createOperation(
      'POST '+path,
      this.client,
      requestOptions,
      hasBody ? 'single' : 'empty',
      ((hasResponse === 'false') ? 'empty' : 'single')
      );
  operation.outputTransform  = responseOutputTransform;
  if (hasBody) {
    operation.requestBody = body;
  }

  return mlrest.startRequest(operation);  
}
function managePut(paramsObj) {
  var endpoint    = paramsObj.endpoint;
  var params      = paramsObj.params;
  var headers     = paramsObj.headers;
  var body        = paramsObj.body;
  var hasResponse = paramsObj.hasResponse;

  var path = makePath(endpoint, params);

  var requestOptions = mlutil.copyProperties(this.client.connectionParams);
  requestOptions.method = 'PUT';
  requestOptions.headers = valcheck.isNullOrUndefined(headers) ? {
    'Content-Type': 'application/json'
    } : headers;
  requestOptions.path = path;

  var hasBody = !valcheck.isNullOrUndefined(body);

  var operation = mlrest.createOperation(
      'PUT '+path,
      this.client,
      requestOptions,
      hasBody ? 'single' : 'empty',
      ((hasResponse === 'true') ? 'single' : 'empty')
      );
  operation.outputTransform  = responseOutputTransform;
  if (hasBody) {
    operation.requestBody = body;
  }

  return mlrest.startRequest(operation);  
}
function manageRemove(paramsObj) {
  var endpoint    = paramsObj.endpoint;
  var params      = paramsObj.params;
  var headers     = paramsObj.headers;
  var hasResponse = paramsObj.hasResponse;

  var path = makePath(endpoint, params);

  var requestOptions = mlutil.copyProperties(this.client.connectionParams);
  requestOptions.method = 'DELETE';
  requestOptions.headers = valcheck.isNullOrUndefined(headers) ? {
    'Accept': 'application/json'
    } : headers;
  requestOptions.path = path;
  
  var operation = mlrest.createOperation(
      'DELETE '+path,
      this.client,
      requestOptions,
      'empty',
      ((hasResponse === 'true') ? 'single' : 'empty')
      );
  operation.outputTransform  = responseOutputTransform;

  return mlrest.startRequest(operation);  
}
function makePath(endpoint, params) {
  var path = encodeURI(endpoint);
  if (!valcheck.isNullOrUndefined(params)) {
    var paramKeys = Object.keys(params);
    var sep = '?';
    for (var i=0; i < paramKeys.length; i++) {
      var paramKey = paramKeys[i];
      var value = params[paramKey];
      if (valcheck.isArray(value)) {
        for (var j=0; j < value.length; j++) {
          path += sep+paramKey+'='+encodeURIComponent(value[j]);
          if (i === 0 && j === 0) {
            sep = '&';
          }
        }
      } else {
        path += sep+paramKey+'='+encodeURIComponent(value);
        if (i === 0) {
          sep = '&';
        }
      }
    }
  }

  return path;
}

function Manager(adminClient) {
  this.client = adminClient;
}
Manager.prototype.get    = manageGet;
Manager.prototype.post   = managePost;
Manager.prototype.put    = managePut;
Manager.prototype.remove = manageRemove;

function createManager(adminClient) {
  return new Manager(adminClient);
};

module.exports = {
    createManager: createManager
};
