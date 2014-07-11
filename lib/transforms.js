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

function nameErrorTransform(message) {
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

function emptyOutputTransform(data) {
  var operation = this;

  return {
    name: operation.name
  };
}

function readTransform(name) {
  if (valcheck.isNullOrUndefined(name)) {
    throw new Error('must specify name when reading the transform source');
  }

  var requestOptions = mlutil.copyProperties(this.client.connectionParams);
  requestOptions.method = 'GET';
  requestOptions.path = '/v1/config/transforms/'+name;
  
  var operation = mlrest.createOperation(
      'read transform', this.client, requestOptions, 'empty', 'single'
      );
  operation.name           = name;
  operation.errorTransform = nameErrorTransform;

  return mlrest.startRequest(operation);
}

//TODO: pipe from file system
function writeTransform(name, format, source) {
  if (valcheck.isNullOrUndefined(name) || valcheck.isNullOrUndefined(format) ||
      valcheck.isNullOrUndefined(source)) {
    throw new Error('must specify name, format, and source when writing a transform');
  }

  var contentType = null;
  switch(format) {
  case 'xslt':
    contentType = 'application/xslt+xml';
    break;
  case 'xquery':
    contentType = 'application/xquery';
    break;
  default:
    throw new Error('unsupported transform format '+format);
  }

  var requestOptions = mlutil.copyProperties(this.client.connectionParams);
  requestOptions.method = 'PUT';
  requestOptions.headers = {
      'Content-Type': contentType
  };
  requestOptions.path = '/v1/config/transforms/'+name;

  var operation = mlrest.createOperation(
      'write transform', this.client, requestOptions, 'single', 'empty'
      );
  operation.name            = name;
  operation.requestBody     = source;
  operation.outputTransform = emptyOutputTransform;
  operation.errorTransform  = nameErrorTransform;

  return mlrest.startRequest(operation);
}

function removeTransform(name) {
  if (valcheck.isNullOrUndefined(name)) {
    throw new Error('must specify name when deleting the transform source');
  }

  var requestOptions = mlutil.copyProperties(this.client.connectionParams);
  requestOptions.method = 'DELETE';
  requestOptions.path = '/v1/config/transforms/'+name;
  
  var operation = mlrest.createOperation(
      'remove transform', this.client, requestOptions, 'empty', 'empty'
      );
  operation.name            = name;
  operation.outputTransform = emptyOutputTransform;
  operation.errorTransform  = nameErrorTransform;

  return mlrest.startRequest(operation);
}

function listTransforms() {
  var requestOptions = mlutil.copyProperties(this.client.connectionParams);
  requestOptions.method = 'GET';
  requestOptions.headers = {
      'Accept': 'application/json'
  };
  requestOptions.path = '/v1/config/transforms';
  
  var operation = mlrest.createOperation(
      'list transforms', this.client, requestOptions, 'empty', 'single'
      );

  return mlrest.startRequest(operation);
}

function transforms(client) {
  this.client = client;

  this.read   = readTransform.bind(this);
  this.write  = writeTransform.bind(this);
  this.remove = removeTransform.bind(this);
  this.list   = listTransforms.bind(this);
}

module.exports = transforms;
