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
function pathErrorTransform(message) {
  /*jshint validthis:true */
  var operation = this;

  var path = operation.path;
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
  var operation = this;

  return {
    path: operation.path
  };
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

  var requestOptions = mlutil.copyProperties(this.client.getConnectionParams());
  requestOptions.method = 'GET';
  requestOptions.path = encodeURI(
      (path.substr(0,5) === '/ext/') ? ('/v1'+path)     :
      (path.substr(0,1) === '/')     ? ('/v1/ext'+path) :
      ('/v1/ext/'+path)
      );

  var operation = new Operation(
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
  var args = mlutil.asArray.apply(null, arguments);
  var argLen = args.length;
  if (argLen === 0) {
    throw new Error('no arguments for writing an extension library');
  }

  var path = null;
  var permissions = null;
  var contentType = null;
  var source = null;
  var i = 0;
  var arg = null;

  var params = null;
  if (argLen === 1) {
    params = args[0];
    path        = params.path;
    permissions = params.permissions;
    contentType = params.contentType;
    source      = params.source;
  } else {
    var argMax = Math.min(argLen,4);
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

  var endpoint =
      (path.substr(0,5) === '/ext/') ? ('/v1'+path)     :
      (path.substr(0,1) === '/')     ? ('/v1/ext'+path) :
      ('/v1/ext/'+path);

  if (Array.isArray(permissions)) {
    var role = null;
    var capabilities = null;
    var j=null;
    for (i=0; i < permissions.length; i++) {
      arg = permissions[i];
      role = arg['role-name'];
      capabilities = arg.capabilities;
      if ((role === void 0) || !Array.isArray(capabilities) || capabilities.length < 1) {
        throw new Error('cannot set permissions from '+JSON.stringify(arg));
      }
      for (j=0; j < capabilities.length; j++) {
        endpoint += ((i === 0 && j=== 0) ? '?' : '&') + 'perm:'+role+'='+capabilities[j];
      }
    }
  }

  var requestOptions = mlutil.copyProperties(this.client.getConnectionParams());
  requestOptions.method  = 'PUT';
  requestOptions.headers = {
      'Content-Type': contentType
  };
  requestOptions.path = encodeURI(endpoint);

  var operation = new Operation(
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

  var requestOptions = mlutil.copyProperties(this.client.getConnectionParams());
  requestOptions.method = 'DELETE';
  requestOptions.path = encodeURI(
    (path.substr(0,5) === '/ext/') ? ('/v1'+path)     :
    (path.substr(0,1) === '/')     ? ('/v1/ext'+path) :
    ('/v1/ext/'+path)
    );

  var operation = new Operation(
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
  var requestOptions = mlutil.copyProperties(this.client.getConnectionParams());
  requestOptions.method = 'GET';
  requestOptions.headers = {
      'Accept': 'application/json'
  };

  if (typeof directory !== 'string' && !(directory instanceof String)) {
    requestOptions.path = '/v1/ext';
  } else if (directory.substr(0,5) === '/ext/') {
    if (directory.substr(-1,1) === '/') {
      requestOptions.path = encodeURI(directory);
    } else {
      requestOptions.path = encodeURI(directory+'/');
    }
  } else {
    var hasInitialSlash  = (directory.substr(0,1)  === '/');
    var hasTrailingSlash = (directory.substr(-1,1) === '/');
    if (hasInitialSlash && hasTrailingSlash) {
      requestOptions.path = encodeURI('/v1/ext'  + directory);
    } else if (hasTrailingSlash) {
      requestOptions.path = encodeURI('/v1/ext/' + directory);
    } else if (hasInitialSlash) {
      requestOptions.path = encodeURI('/v1/ext'  + directory+'/');
    } else {
      requestOptions.path = encodeURI('/v1/ext/' + directory+'/');
    }
  }

  var operation = new Operation(
      'list extension libraries', this.client, requestOptions, 'empty', 'single'
      );

  return requester.startRequest(operation);
};

module.exports = ExtLibs;
