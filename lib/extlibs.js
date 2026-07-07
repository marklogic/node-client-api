/*
* Copyright (c) 2015-2026 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/
'use strict';
const requester = require('./requester.js');
const mlutil    = require('./mlutil.js');
const Operation = require('./operation.js');

/** @ignore */
function pathErrorTransform(message) {
  /*jshint validthis:true */
  const operation = this;

  const path = operation.path;
  return (path == null) ? message :
    (message+' (on '+path+' extension library)');
}

/**
 * Provides functions to maintain extension libraries on the REST server
 * for the client. The client must have been created for a user with the
 * rest-admin role.
 * @namespace config.extlibs
 */

/** @ignore */
function emptyOutputTransform(/*headers, data*/) {
  /*jshint validthis:true */
  const operation = this;

  return {
    path: operation.path
  };
}

/**
 * Safely encodes a caller-supplied extension library path for use in a REST
 * request URL. Each path segment is encoded individually with
 * encodeURIComponent(), preventing path-separator injection (CWE-22) and
 * query-parameter injection (CWE-20). Any leading /v1/, /ext/, or bare /
 * prefix is stripped before splitting so that all three accepted input forms
 * (bare name, /path/name, /ext/path/name) produce the same canonical output.
 *
 * @param {string}  rawPath       - caller-supplied path or directory
 * @param {boolean} trailingSlash - when true, appends a trailing '/' (used by list())
 * @returns {string} the encoded path beginning with /v1/ext/
 * @throws  {Error}  if any segment equals '..' or '.'
 * @ignore
 */
function encodeExtPath(rawPath, trailingSlash) {
  // Require a leading '/' before stripping any prefix so that undocumented
  // bare forms like 'ext/module.xqy' are treated as literal path segments
  // rather than silently having their 'ext/' prefix removed.
  const stripped = rawPath
    .replace(/^\/(?:(?:v1\/)?ext\/)?/, '')
    .replace(/\/$/, '');

  const segments = stripped.length === 0 ? [] : stripped.split('/');

  for (const seg of segments) {
    if (seg === '..' || seg === '.') {
      throw new Error(
        'extension library path must not contain relative path components (".", ".."): ' + rawPath
      );
    }
  }

  // Build the result using a conditional join so that an empty segment list
  // does not produce a double slash (e.g. '/v1/ext//' for list('/ext/')).
  const encodedSegments = segments.map(s => encodeURIComponent(s));
  const base = '/v1/ext' + (encodedSegments.length > 0 ? '/' + encodedSegments.join('/') : '');
  return base + (trailingSlash ? '/' : '');
}

/** @ignore */
function ExtLibs(client) {
  if (!(this instanceof ExtLibs)) {
    return new ExtLibs(client);
  }
  this.client = client;
}

/**
 * Reads a library resource installed on the server.
 * @method config.extlibs#read
 * @since  1.0
 * @param {string} path - the location of an installed library resource
 * @returns {ResultProvider} an object whose result() function takes
 * a success callback that receives the resource
  */
ExtLibs.prototype.read = function readExtensionLibrary(path) {
  if (path == null) {
    throw new Error('must specify path when reading the extension library resource');
  }

  const requestOptions = mlutil.copyProperties(this.client.getConnectionParams());
  requestOptions.method = 'GET';
  requestOptions.path = encodeExtPath(path);

  const operation = new Operation(
      'read extension library', this.client, requestOptions, 'empty', 'single'
      );
  operation.path           = path;
  operation.errorTransform = pathErrorTransform;

  return requester.startRequest(operation);
};

/**
 * Installs a library resource on the server.
 * @method config.extlibs#write
 * @since  1.0
 * @param {string} path - the location for installing the library resource
 * @param {object[]} [permissions] - the permissions controlling which users can read, update, or
 * execute the library resource
 * @param {string} contentType - the mime type for the library resource
 * @param {object|string} source - the library resource
 */
ExtLibs.prototype.write = function writeExtensionLibrary() {
  const args = mlutil.asArray.apply(null, arguments);
  const argLen = args.length;
  if (argLen === 0) {
    throw new Error('no arguments for writing an extension library');
  }

  let path = null;
  let permissions = null;
  let contentType = null;
  let source = null;
  let i = 0;
  let arg = null;

  let params = null;
  if (argLen === 1) {
    params = args[0];
    path        = params.path;
    permissions = params.permissions;
    contentType = params.contentType;
    source      = params.source;
  } else {
    const argMax = Math.min(argLen,4);
    for (;i < argMax; i++) {
      arg = args[i];
      if (typeof arg === 'string' || arg instanceof String) {
        if (path === null) {
          path = arg;
        } else if (contentType === null) {
          contentType = arg;
        }
      } else if (Array.isArray(arg)) {
        permissions = arg;
      } else if (arg['role-name'] !== void 0) {
        permissions = [arg];
      } else {
        source = arg;
      }
    }
  }

  if ((path == null) || (contentType == null) ||
      (source == null)) {
    throw new Error('must specify the path, content type, and source when writing a extension library');
  }

  const encodedPath = encodeExtPath(path);

  let queryString = '';
  if (Array.isArray(permissions)) {
    let role = null;
    let capabilities = null;
    let j = null;
    for (i=0; i < permissions.length; i++) {
      arg = permissions[i];
      role = arg['role-name'];
      capabilities = arg.capabilities;
      if ((role === void 0) || !Array.isArray(capabilities) || capabilities.length < 1) {
        throw new Error('cannot set permissions from '+JSON.stringify(arg));
      }
      for (j=0; j < capabilities.length; j++) {
        queryString += ((queryString.length === 0) ? '?' : '&') +
          'perm:' + encodeURIComponent(role) + '=' + encodeURIComponent(capabilities[j]);
      }
    }
  }

  const requestOptions = mlutil.copyProperties(this.client.getConnectionParams());
  requestOptions.method  = 'PUT';
  requestOptions.headers = {
      'Content-Type': contentType
  };
  requestOptions.path = encodedPath + queryString;

  const operation = new Operation(
      'write extension library', this.client, requestOptions, 'single', 'empty'
      );
  operation.path            = path;
  operation.requestBody     = source;
  operation.outputTransform = emptyOutputTransform;
  operation.errorTransform  = pathErrorTransform;

  return requester.startRequest(operation);
};

/**
 * Deletes a library resource from the server.
 * @method config.extlibs#remove
 * @since  1.0
 * @param {string} path - the location of the library resource
 */
ExtLibs.prototype.remove = function removeExtensionLibrary(path) {
  if (path == null) {
    throw new Error('must specify path when deleting the extension library resource');
  }

  const requestOptions = mlutil.copyProperties(this.client.getConnectionParams());
  requestOptions.method = 'DELETE';
  requestOptions.path = encodeExtPath(path);

  const operation = new Operation(
      'remove extension library', this.client, requestOptions, 'empty', 'empty'
      );
  operation.path            = path;
  operation.outputTransform = emptyOutputTransform;
  operation.errorTransform  = pathErrorTransform;

  return requester.startRequest(operation);
};

/**
 * Lists the library resources installed under the directory on the server.
 * @method config.extlibs#list
 * @since  1.0
 * @param {string} [directory] - a directory containing library resources;
 * by default, all library resources installed on the server are returned
 * @returns {ResultProvider} an object whose result() function takes
 * a success callback that receives the list of library resources installed
 * in the directory
 */
ExtLibs.prototype.list = function listExtensionLibraries(directory) {
  const requestOptions = mlutil.copyProperties(this.client.getConnectionParams());
  requestOptions.method = 'GET';
  requestOptions.headers = {
      'Accept': 'application/json'
  };

  if (typeof directory !== 'string' && !(directory instanceof String)) {
    requestOptions.path = '/v1/ext';
  } else {
    requestOptions.path = encodeExtPath(directory, true);
  }

  const operation = new Operation(
      'list extension libraries', this.client, requestOptions, 'empty', 'single'
      );

  return requester.startRequest(operation);
};

module.exports = ExtLibs;
