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

function pathErrorTransform(message) {
  var operation = this;

  var path = operation.path;
  return valcheck.isNullOrUndefined(path) ? message :
    (message+' (on '+path+' extension library)');
}

/**
 * Provides functions to maintain extension libraries on the REST server
 * for the client. The client must have been created for a user with the
 * rest-admin role. 
 * @namespace config.extlibs
 */

function emptyOutputTransform(data) {
  var operation = this;

  return {
    path: operation.path
  };
}

function readExtensionLibrary(path) {
  if (valcheck.isNullOrUndefined(path)) {
    throw new Error('must specify path when reading the extension library resource');
  }

  var requestOptions = mlutil.copyProperties(this.client.connectionParams);
  requestOptions.method = 'GET';
  requestOptions.path = '/v1/ext' +
    ((path.substring(0,1) === '/') ? path : ('/'+path));
  
  var operation = mlrest.createOperation(
      'read extension library', this.client, requestOptions, 'empty', 'single'
      );
  operation.path           = path;
  operation.errorTransform = pathErrorTransform;

  return mlrest.startRequest(operation, true);
}

// TODO: pipe from file system
function writeExtensionLibrary(path, contentType, resource) {
  if (valcheck.isNullOrUndefined(path) || valcheck.isNullOrUndefined(contentType) ||
      valcheck.isNullOrUndefined(resource)) {
    throw new Error('must specify path, content type, and resource when writing a extension library');
  }

  var requestOptions = mlutil.copyProperties(this.client.connectionParams);
  requestOptions.method  = 'PUT';
  requestOptions.headers = {
      'Content-Type': contentType
  };
  requestOptions.path = '/v1/ext' +
    ((path.substring(0,1) === '/') ? path : ('/'+path));

  var operation = mlrest.createOperation(
      'write extension library', this.client, requestOptions, 'single', 'empty'
      );
  operation.path            = path;
  operation.requestBody     = resource;
  operation.outputTransform = emptyOutputTransform;
  operation.errorTransform  = pathErrorTransform;

  return mlrest.startRequest(operation, false);
}

function removeExtensionLibrary(path) {
  if (valcheck.isNullOrUndefined(path)) {
    throw new Error('must specify path when deleting the extension library resource');
  }

  var requestOptions = mlutil.copyProperties(this.client.connectionParams);
  requestOptions.method = 'DELETE';
  requestOptions.path = '/v1/ext' +
    ((path.substring(0,1) === '/') ? path : ('/'+path));

  var operation = mlrest.createOperation(
      'remove extension library', this.client, requestOptions, 'empty', 'empty'
      );
  operation.path            = path;
  operation.outputTransform = emptyOutputTransform;
  operation.errorTransform  = pathErrorTransform;

  return mlrest.startRequest(operation, false);
}

function listExtensionLibraries(directory) {
  var requestOptions = mlutil.copyProperties(this.client.connectionParams);
  requestOptions.method = 'GET';
  requestOptions.headers = {
      'Accept': 'application/json'
  };
  requestOptions.path = '/v1/ext/';

  if (valcheck.isString(directory)) {
    requestOptions.path += (directory.substring(0,1) === '/') ?
        directory.substring(1) : directory;
  }
  
  var operation = mlrest.createOperation(
      'list extension libraries', this.client, requestOptions, 'empty', 'single'
      );

  return mlrest.startRequest(operation, true);
}

function extlibs(client) {
  this.client = client;

  this.read   = readExtensionLibrary.bind(this);
  this.write  = writeExtensionLibrary.bind(this);
  this.remove = removeExtensionLibrary.bind(this);
  this.list   = listExtensionLibraries.bind(this);
}

module.exports = extlibs;
