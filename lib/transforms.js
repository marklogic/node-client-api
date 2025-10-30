/*
* Copyright (c) 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/
'use strict';
const requester = require('./requester.js');
const mlutil    = require('./mlutil.js');
const Operation = require('./operation.js');

/** @ignore */
function nameErrorTransform(message) {
  /*jshint validthis:true */
  const operation = this;

  const name = operation.name;
  return (name == null) ? message :
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
  const operation = this;

  return {
    name: operation.name
  };
}

/** @ignore */
function readOutputTransform(headers, data) {
  return data.toString('utf8');
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
 * @since 1.0
 * @param {string} name - the name of an installed transform
 * @returns {ResultProvider} an object whose result() function takes
 * a success callback that receives the source code
 */
Transforms.prototype.read = function readTransform(name) {
  if (name == null) {
    throw new Error('must specify name when reading the transform source');
  }

  const requestOptions = mlutil.copyProperties(this.client.getConnectionParams());
  requestOptions.method = 'GET';
  requestOptions.path = '/v1/config/transforms/'+encodeURIComponent(name);

  const operation = new Operation(
      'read transform', this.client, requestOptions, 'empty', 'single'
      );
  operation.name           = name;
  operation.errorTransform = nameErrorTransform;
  operation.outputTransform = readOutputTransform;

  return requester.startRequest(operation);
};

/**
 * Installs a transform on the server.
 * @method config.transforms#write
 * @since 1.0
 * @param {string} name - the name of the transform
 * @param {string} format - a value from the javascript|xquery|xslt enumeration
 * @param {object|string} source - the source for the transform
 */
Transforms.prototype.write = function writeTransform() {
  const args = mlutil.asArray.apply(null, arguments);
  const argLen = args.length;
  if (argLen === 0) {
    throw new Error('no arguments for writing an extension library');
  }

  let name        = null;
  let title       = null;
  let description = null;
  let provider    = null;
  let version     = null;
  let format      = null;
  let source      = null;

  let params      = null;
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
    throw new Error('must specify name, format, and source when writing a transform');
  }

  let contentType = null;
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

  let endpoint = '/v1/config/transforms/'+encodeURIComponent(name);

  let sep = '?';
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

  const requestOptions = mlutil.copyProperties(this.client.getConnectionParams());
  requestOptions.method = 'PUT';
  requestOptions.headers = {
      'Content-Type': contentType
  };
  requestOptions.path = endpoint;

  const operation = new Operation(
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
 * @since 1.0
 * @param {string} name - the name of the transform
 */
Transforms.prototype.remove = function removeTransform(name) {
  if (name == null) {
    throw new Error('must specify name when deleting the transform source');
  }

  const requestOptions = mlutil.copyProperties(this.client.getConnectionParams());
  requestOptions.method = 'DELETE';
  requestOptions.path = '/v1/config/transforms/'+encodeURIComponent(name);

  const operation = new Operation(
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
 * @since 1.0
 * @returns {ResultProvider} an object whose result() function takes
 * a success callback that receives the list of transforms installed
 * on the server
 */
Transforms.prototype.list = function listTransforms() {
  const requestOptions = mlutil.copyProperties(this.client.getConnectionParams());
  requestOptions.method = 'GET';
  requestOptions.headers = {
      'Accept': 'application/json'
  };
  requestOptions.path = '/v1/config/transforms';

  const operation = new Operation(
      'list transforms', this.client, requestOptions, 'empty', 'single'
      );

  return requester.startRequest(operation);
};

module.exports = Transforms;
