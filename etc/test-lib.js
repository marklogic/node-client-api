/*
 * Copyright 2014-2017 MarkLogic Corporation
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
var valcheck = require('core-util-is');

var mlutil    = require('../lib/mlutil.js');
var Operation = require('../lib/operation.js');
var requester = require('../lib/requester.js');

//CAUTION: the functions in this module are not part of the supported API and
//may change or may be removed at any time.

function responseOutputTransform(headers, data) {
  /*jshint validthis:true */
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

function Manager(adminClient) {
  if (!(this instanceof Manager)) {
    return new Manager(adminClient);
  }
  this.client = adminClient;
}

// TODO: configure acceptable errors
Manager.prototype.get = function manageGet(paramsObj) {
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
  
  var operation = new Operation(
      'GET '+path, this.client, requestOptions, 'empty',
      ((hasResponse === 'false') ? 'empty' : 'single')
      );
  operation.validStatusCodes = [200, 201, 204, 404];
  operation.outputTransform  = responseOutputTransform;

  return requester.startRequest(operation);
};
Manager.prototype.post = function managePost(paramsObj) {
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

  var operation = new Operation(
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

  return requester.startRequest(operation);  
};
Manager.prototype.put = function managePut(paramsObj) {
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

  var operation = new Operation(
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

  return requester.startRequest(operation);  
};
Manager.prototype.remove = function manageRemove(paramsObj) {
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
  
  var operation = new Operation(
      'DELETE '+path,
      this.client,
      requestOptions,
      'empty',
      ((hasResponse === 'true') ? 'single' : 'empty')
      );
  operation.outputTransform  = responseOutputTransform;

  return requester.startRequest(operation);  
};

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

function createManager(adminClient) {
  return new Manager(adminClient);
};

module.exports = {
    createManager: createManager
};
