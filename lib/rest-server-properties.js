/*
* Copyright © 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
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
