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

function readTransform(name) {
  if (valcheck.isNullOrUndefined(name)) {
    throw new Error('must specify name when reading the transform source');
  }

  var responseDispatcher = mlrest.createResponseDispatcher(
      mlrest.resultEventMapper, true, {transform: name}
      );

  var requestOptions = mlutil.copyProperties(this.client.connectionParams);
  requestOptions.method = 'GET';
  requestOptions.path = '/v1/config/transforms/'+name;
  
  var request = mlrest.createRequest(
      this.client, requestOptions, false, responseDispatcher.responder
      );
  request.on('error', mlutil.requestErrorHandler);
  request.end();

  return mlrest.createResultSelector(responseDispatcher, true);
}
// TODO: pipe from file system
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

  var responseDispatcher = mlrest.createResponseDispatcher(
      mlrest.emptyEventMapper, true, {transform: name, format: format}
      );

  var requestOptions = mlutil.copyProperties(this.client.connectionParams);
  requestOptions.method = 'PUT';
  requestOptions.headers = {
      'Content-Type': contentType
  };
  requestOptions.path = '/v1/config/transforms/'+name;

  var request = mlrest.createRequest(
      this.client, requestOptions, true, responseDispatcher.responder
      );
  request.on('error', mlutil.requestErrorHandler);
  request.write(source, 'utf8');
  request.end();

  return mlrest.createResultSelector(responseDispatcher, false);
}
function removeTransform(name) {
  if (valcheck.isNullOrUndefined(name)) {
    throw new Error('must specify name when deleting the transform source');
  }

  var responseDispatcher = mlrest.createResponseDispatcher(
      mlrest.emptyEventMapper, true, {transform: name}
      );

  var requestOptions = mlutil.copyProperties(this.client.connectionParams);
  requestOptions.method = 'DELETE';
  requestOptions.path = '/v1/config/transforms/'+name;
  
  var request = mlrest.createRequest(
      this.client, requestOptions, false, responseDispatcher.responder
      );
  request.on('error', mlutil.requestErrorHandler);
  request.end();

  return mlrest.createResultSelector(responseDispatcher, false);  
}
function listTransforms() {
  var responseDispatcher = mlrest.createResponseDispatcher(
      mlrest.resultEventMapper, true, {}
      );

  var requestOptions = mlutil.copyProperties(this.client.connectionParams);
  requestOptions.method = 'GET';
  requestOptions.headers = {
      'Accept': 'application/json'
  };
  requestOptions.path = '/v1/config/transforms';
  
  var request = mlrest.createRequest(
      this.client, requestOptions, false, responseDispatcher.responder
      );
  request.on('error', mlutil.requestErrorHandler);
  request.end();

  return mlrest.createResultSelector(responseDispatcher, true);
}

function transforms(client) {
  this.client = client;

  this.read   = readTransform.bind(this);
  this.write  = writeTransform.bind(this);
  this.remove = removeTransform.bind(this);
  this.list   = listTransforms.bind(this);
}

module.exports = transforms;
