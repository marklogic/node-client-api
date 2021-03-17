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
 * Provides functions to modify the properties of the REST server for
 * the client. The client must have been created for a user with the
 * rest-admin role.
 * @namespace config.serverprops
 */

/** @ignore */
function RESTServerProperties(client) {
  if (!(this instanceof RESTServerProperties)) {
    return new RESTServerProperties(client);
  }
  this.client = client;
}

/**
 * Reads the configuration properties for the server.
 * @method config.serverprops#read
 * @since 1.0
 * @returns {object} the properties
 */
RESTServerProperties.prototype.read = function readRESTServerProperties() {
  var requestOptions = mlutil.copyProperties(this.client.getConnectionParams());
  requestOptions.method = 'GET';
  requestOptions.headers = {
      'Accept': 'application/json'
  };
  requestOptions.path = '/v1/config/properties';

  var operation = new Operation(
      'read REST server properties', this.client, requestOptions, 'empty', 'single'
      );

  return requester.startRequest(operation);
};

/** @ignore */
function RESTServerPropertiesOutputTransform(/*headers, data*/) {
  /*jshint validthis:true */
  var operation = this;

  var statusCode = operation.responseStatusCode;
  return (statusCode === 204 || statusCode === 200);
}

/**
 * Modifies the configuration properties for the server.
 * @method config.serverprops#write
 * @since 1.0
 * @param {object} properties - the modified properties
 */
RESTServerProperties.prototype.write = function writeRESTServerProperties(properties) {
  if (typeof properties !== 'object' || properties === null) {
    throw new Error('cannot write with missing properties object');
  }

  var requestOptions = mlutil.copyProperties(this.client.getConnectionParams());
  requestOptions.method = 'PUT';
  requestOptions.headers = {
      'Content-Type': 'application/json'
  };
  requestOptions.path = '/v1/config/properties';

  var operation = new Operation(
      'write REST server properties', this.client, requestOptions, 'single', 'empty'
      );
  operation.outputTransform = RESTServerPropertiesOutputTransform;
  operation.requestBody     = properties;

  return requester.startRequest(operation);
};

module.exports = RESTServerProperties;
