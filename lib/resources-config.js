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

/** @ignore */
function nameErrorTransform(message) {
  /*jshint validthis:true */
  var operation = this;

  var name = operation.name;
  return (name == null) ? message :
    (message+' (on '+name+' resource service)');
}

/**
 * Provides functions to maintain resource service extensions on the REST server
 * for the client. The client must have been created for a user with the
 * rest-admin role.
 * @namespace config.resources
 */

/** @ignore */
function emptyOutputTransform(/*headers, data*/) {
  /*jshint validthis:true */
  var operation = this;

  return {
    name: operation.name
  };
}

/** @ignore */
function readOutputTransform(headers, data) {
  return data.toString('utf8');
}

/** @ignore */
function Resources(client) {
  if (!(this instanceof Resources)) {
    return new Resources(client);
  }
  this.client = client;
}

/**
 * Reads the source for a resource service installed on the server.
 * @method config.resources#read
 * @since  1.0
 * @param {string} name - the name of an installed resource service
 * @returns {ResultProvider} an object whose result() function takes
 * a success callback that receives the source code
 */
Resources.prototype.read = function readResourceConfig(name) {
  if (name == null) {
    throw new Error('must specify name when reading the resource service source');
  }

  var requestOptions = mlutil.copyProperties(this.client.getConnectionParams());
  requestOptions.method = 'GET';
  requestOptions.path = '/v1/config/resources/'+encodeURIComponent(name);

  var operation = new Operation(
      'read resource service', this.client, requestOptions, 'empty', 'single'
      );
  operation.name            = name;
  operation.errorTransform  = nameErrorTransform;
  operation.outputTransform = readOutputTransform;

  return requester.startRequest(operation);
};

/**
 * Installs a resource service on the server.
 * @method config.resources#write
 * @since  1.0
 * @param {string} name - the name of the resource service
 * @param {string} format - a value from the javascript|xquery enumeration
 * @param {object|string} source - the source for the resource service
 */
Resources.prototype.write = function writeResourceConfig() {
  var args = mlutil.asArray.apply(null, arguments);
  var argLen = args.length;
  if (argLen === 0) {
    throw new Error('no arguments for writing an extension library');
  }

  var name        = null;
  var title       = null;
  var description = null;
  var provider    = null;
  var version     = null;
  var format      = null;
  var source      = null;

  var params = null;
  if (argLen === 1) {
    params = args[0];
    name        = params.name;
    title       = params.title;
    description = params.description;
    provider    = params.provider;
    version     = params.version;
    format      = params.format;
    source      = params.source;
  } else if (argLen > 2){
    name   = args[0];
    format = args[1];
    source = args[2];
  }

  if ((name == null) || (format == null) ||
      (source == null)) {
    throw new Error('must specify name, format, and source when writing a resource service');
  }

  var contentType = null;
  switch(format) {
  case 'javascript':
    contentType = 'application/javascript';
    break;
  case 'xquery':
    contentType = 'application/xquery';
    break;
  default:
    throw new Error('unsupported resource service format '+format);
  }

  var endpoint = '/v1/config/resources/'+encodeURIComponent(name);

  var sep = '?';
  if (title != null) {
    endpoint += sep+'title='+encodeURIComponent(title);
    if (sep === '?') {sep = '&';}
  }
  if (description != null) {
    endpoint += sep+'description='+encodeURIComponent(description);
    if (sep === '?') {sep = '&';}
  }
  if (provider != null) {
    endpoint += sep+'provider='+encodeURIComponent(provider);
    if (sep === '?') {sep = '&';}
  }
  if (version != null) {
    endpoint += sep+'version='+encodeURIComponent(version);
    if (sep === '?') {sep = '&';}
  }

  var requestOptions = mlutil.copyProperties(this.client.getConnectionParams());
  requestOptions.method = 'PUT';
  requestOptions.headers = {
      'Content-Type': contentType
  };
  requestOptions.path = endpoint;

  var operation = new Operation(
      'write resource service', this.client, requestOptions, 'single', 'empty'
      );
  operation.name            = name;
  operation.requestBody     = source;
  operation.outputTransform = emptyOutputTransform;
  operation.errorTransform  = nameErrorTransform;

  return requester.startRequest(operation);
};

/**
 * Deletes a resource service from the server.
 * @method config.resources#remove
 * @since  1.0
 * @param {string} name - the name of the resource service
 */
Resources.prototype.remove = function removeResourceConfig(name) {
  if (name == null) {
    throw new Error('must specify name when deleting the resource service source');
  }

  var requestOptions = mlutil.copyProperties(this.client.getConnectionParams());
  requestOptions.method = 'DELETE';
  requestOptions.path = '/v1/config/resources/'+encodeURIComponent(name);

  var operation = new Operation(
      'remove resource service', this.client, requestOptions, 'empty', 'empty'
      );
  operation.name            = name;
  operation.outputTransform = emptyOutputTransform;
  operation.errorTransform  = nameErrorTransform;

  return requester.startRequest(operation);
};

/**
 * Lists the resource services installed on the server.
 * @method config.resources#list
 * @since  1.0
 * @returns {ResultProvider} an object whose result() function takes
 * a success callback that receives the list of resource services installed
 * on the server
 */
Resources.prototype.list = function listResourceConfig() {
  var requestOptions = mlutil.copyProperties(this.client.getConnectionParams());
  requestOptions.method = 'GET';
  requestOptions.headers = {
      'Accept': 'application/json'
  };
  requestOptions.path = '/v1/config/resources';

  var operation = new Operation(
      'list resource services', this.client, requestOptions, 'empty', 'single'
      );

  return requester.startRequest(operation);
};

module.exports = Resources;
