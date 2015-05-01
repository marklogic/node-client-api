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
'use strict';
var valcheck  = require('core-util-is');
var requester = require('./requester.js');
var mlutil    = require('./mlutil.js');
var Operation = require('./operation.js');

/** @ignore */
function nameErrorTransform(message) {
  /*jshint validthis:true */
  var operation = this;

  var name = operation.name;
  return valcheck.isNullOrUndefined(name) ? message :
    (message+' (on '+name+' transform)');
}

/**
 * Provides functions to maintain transform extension on the REST server
 * for the client. The client must have been created for a user with the
 * rest-admin role. 
 * @namespace config.transforms
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
function Transforms(client) {
  if (!(this instanceof Transforms)) {
    return new Transforms(client);
  }
  this.client = client;
}

/**
 * Reads the source for a transform installed on the server.
 * @method config.transforms#read
 * @param {string} name - the name of an installed transform
 * @returns {ResultProvider} an object whose result() function takes
 * a success callback that receives the source code
 */
Transforms.prototype.read = function readTransform(name) {
  if (valcheck.isNullOrUndefined(name)) {
    throw new Error('must specify name when reading the transform source');
  }

  var requestOptions = mlutil.copyProperties(this.client.connectionParams);
  requestOptions.method = 'GET';
  requestOptions.path = encodeURI('/v1/config/transforms/'+name);
  
  var operation = new Operation(
      'read transform', this.client, requestOptions, 'empty', 'single'
      );
  operation.name           = name;
  operation.errorTransform = nameErrorTransform;

  return requester.startRequest(operation);
};

/**
 * Installs a transform on the server.
 * @method config.transforms#write
 * @param {string} name - the name of the transform
 * @param {string} format - a value from the xquery|xslt enumeration
 * @param {object|string} source - the source for the transform
 */
Transforms.prototype.write = function writeTransform() {
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

  var params      = null;
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

  if (valcheck.isNullOrUndefined(name) || valcheck.isNullOrUndefined(format) ||
      valcheck.isNullOrUndefined(source)) {
    throw new Error('must specify name, format, and source when writing a transform');
  }

  var contentType = null;
  switch(format) {
  case 'javascript':
    contentType = 'application/javascript';
    break;
  case 'xquery':
    contentType = 'application/xquery';
    break;
  case 'xslt':
    contentType = 'application/xslt+xml';
    break;
  default:
    throw new Error('unsupported transform format '+format);
  }

  var endpoint = '/v1/config/transforms/'+name;

  var sep = '?';
  if (!valcheck.isNullOrUndefined(title)) {
    endpoint += sep+'title='+title;
    if (sep === '?') {sep = '&';}
  }
  if (!valcheck.isNullOrUndefined(description)) {
    endpoint += sep+'description='+description;
    if (sep === '?') {sep = '&';}
  }
  if (!valcheck.isNullOrUndefined(provider)) {
    endpoint += sep+'provider='+provider;
    if (sep === '?') {sep = '&';}
  }
  if (!valcheck.isNullOrUndefined(version)) {
    endpoint += sep+'version='+version;
    if (sep === '?') {sep = '&';}
  }

  var requestOptions = mlutil.copyProperties(this.client.connectionParams);
  requestOptions.method = 'PUT';
  requestOptions.headers = {
      'Content-Type': contentType
  };
  requestOptions.path = encodeURI(endpoint);

  var operation = new Operation(
      'write transform', this.client, requestOptions, 'single', 'empty'
      );
  operation.name            = name;
  operation.requestBody     = source;
  operation.outputTransform = emptyOutputTransform;
  operation.errorTransform  = nameErrorTransform;

  return requester.startRequest(operation);
};

/**
 * Deletes a transform from the server.
 * @method config.transforms#remove
 * @param {string} name - the name of the transform
 */
Transforms.prototype.remove = function removeTransform(name) {
  if (valcheck.isNullOrUndefined(name)) {
    throw new Error('must specify name when deleting the transform source');
  }

  var requestOptions = mlutil.copyProperties(this.client.connectionParams);
  requestOptions.method = 'DELETE';
  requestOptions.path = encodeURI('/v1/config/transforms/'+name);
  
  var operation = new Operation(
      'remove transform', this.client, requestOptions, 'empty', 'empty'
      );
  operation.name            = name;
  operation.outputTransform = emptyOutputTransform;
  operation.errorTransform  = nameErrorTransform;

  return requester.startRequest(operation);
};

/**
 * Lists the transforms installed on the server.
 * @method config.transforms#list
 * @returns {ResultProvider} an object whose result() function takes
 * a success callback that receives the list of transforms installed
 * on the server
 */
Transforms.prototype.list = function listTransforms() {
  var requestOptions = mlutil.copyProperties(this.client.connectionParams);
  requestOptions.method = 'GET';
  requestOptions.headers = {
      'Accept': 'application/json'
  };
  requestOptions.path = '/v1/config/transforms';
  
  var operation = new Operation(
      'list transforms', this.client, requestOptions, 'empty', 'single'
      );

  return requester.startRequest(operation);
};

module.exports = Transforms;
