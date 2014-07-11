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

/**
 * Provides functions to modify the properties of the REST server for
 * the client. The client must have been created for a user with the
 * rest-admin role. 
 * @namespace config.serverprops
 */

function readRESTServerProperties() {
  var requestOptions = mlutil.copyProperties(this.client.connectionParams);
  requestOptions.method = 'GET';
  requestOptions.headers = {
      'Accept': 'application/json'
  };
  requestOptions.path = '/v1/config/properties';
  
  var operation = mlrest.createOperation(
      'read REST server properties', this.client, requestOptions, 'empty', 'single'
      );

  return mlrest.startRequest(operation);
}

function writeRESTServerProperties(properties) {
  if (!valcheck.isObject(properties)) {
    throw new Error('cannot write with missing properties object');
  }

  var requestOptions = mlutil.copyProperties(this.client.connectionParams);
  requestOptions.method = 'PUT';
  requestOptions.headers = {
      'Content-Type': 'application/json'
  };
  requestOptions.path = '/v1/config/properties';

  var operation = mlrest.createOperation(
      'write REST server properties', this.client, requestOptions, 'single', 'empty'
      );
  operation.requestBody = properties;

  return mlrest.startRequest(operation);  
}

function RESTServerProperties(client) {
  this.client = client;

  this.read  = readRESTServerProperties.bind(this);
  this.write = writeRESTServerProperties.bind(this);
}
module.exports = RESTServerProperties;
