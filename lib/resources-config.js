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

/** @ignore */
function nameErrorTransform(message) {
  var operation = this;

  var name = operation.name;
  return valcheck.isNullOrUndefined(name) ? message :
    (message+' (on '+name+' resource service)');
}

/**
 * Provides functions to maintain resource service extensions on the REST server
 * for the client. The client must have been created for a user with the
 * rest-admin role. 
 * @namespace config.resources
 */

/** @ignore */
function emptyOutputTransform(data) {
  var operation = this;

  return {
    name: operation.name
  };
}

/**
 * Reads the source for a resource service installed on the server.
 * @method config.resources#read
 * @param {string} name - the name of an installed resource service
 * @returns {object|string} the source code
 */
function readResourceService(name) {
  if (valcheck.isNullOrUndefined(name)) {
    throw new Error('must specify name when reading the resource service source');
  }

  var requestOptions = mlutil.copyProperties(this.client.connectionParams);
  requestOptions.method = 'GET';
  requestOptions.path = encodeURI('/v1/config/resources/'+name);
  
  var operation = mlrest.createOperation(
      'read resource service', this.client, requestOptions, 'empty', 'single'
      );
  operation.name           = name;
  operation.errorTransform = nameErrorTransform;

  return mlrest.startRequest(operation);
}

/**
 * Installs a resource service on the server.
 * @method config.resources#write
 * @param {string} name - the name of the resource service
 * @param {string} format - a value from the xquery|xslt enumeration
 * @param {object|string} source - the source for the resource service
 */
function writeResourceService(name, format, source) {
  // TODO: pipe from file system
  if (valcheck.isNullOrUndefined(name) || valcheck.isNullOrUndefined(format) ||
      valcheck.isNullOrUndefined(source)) {
    throw new Error('must specify name, format, and source when writing a resource service');
  }

  var contentType = null;
  switch(format) {
  case 'javascript':
    // TODO: confirm mime type
    contentType = 'application/javascript';
    break;
  case 'xquery':
    contentType = 'application/xquery';
    break;
  default:
    throw new Error('unsupported resource service format '+format);
  }

  var requestOptions = mlutil.copyProperties(this.client.connectionParams);
  requestOptions.method = 'PUT';
  requestOptions.headers = {
      'Content-Type': contentType
  };
  requestOptions.path = encodeURI('/v1/config/resources/'+name);

  var operation = mlrest.createOperation(
      'write resource service', this.client, requestOptions, 'single', 'empty'
      );
  operation.name            = name;
  operation.requestBody     = source;
  operation.outputTransform = emptyOutputTransform;
  operation.errorTransform  = nameErrorTransform;

  return mlrest.startRequest(operation);
}

/**
 * Deletes a resource service from the server.
 * @method config.resources#remove
 * @param {string} name - the name of the resource service
 */
function removeResourceService(name) {
  if (valcheck.isNullOrUndefined(name)) {
    throw new Error('must specify name when deleting the resource service source');
  }

  var requestOptions = mlutil.copyProperties(this.client.connectionParams);
  requestOptions.method = 'DELETE';
  requestOptions.path = encodeURI('/v1/config/resources/'+name);
  
  var operation = mlrest.createOperation(
      'remove resource service', this.client, requestOptions, 'empty', 'empty'
      );
  operation.name            = name;
  operation.outputTransform = emptyOutputTransform;
  operation.errorTransform  = nameErrorTransform;

  return mlrest.startRequest(operation);
}

/**
 * Lists the resource services installed on the server.
 * @method config.resources#list
 * @returns {object} the list of resource services installed on the server
 */
function listResourceServices() {
  var requestOptions = mlutil.copyProperties(this.client.connectionParams);
  requestOptions.method = 'GET';
  requestOptions.headers = {
      'Accept': 'application/json'
  };
  requestOptions.path = '/v1/config/resources';
  
  var operation = mlrest.createOperation(
      'list resource services', this.client, requestOptions, 'empty', 'single'
      );

  return mlrest.startRequest(operation);
}

/** @ignore */
function resources(client) {
  this.client = client;
}
resources.prototype.list   = listResourceServices;
resources.prototype.read   = readResourceService;
resources.prototype.remove = removeResourceService;
resources.prototype.write  = writeResourceService;

module.exports = resources;
