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
var valcheck = require('core-util-is');
var mlrest = require('./mlrest.js');
var mlutil = require('./mlutil.js');

/** @ignore */
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

/** @ignore */
function emptyOutputTransform(headers, data) {
  var operation = this;

  return {
    path: operation.path
  };
}

/**
 * Reads a library resource installed on the server.
 * @method config.extlibs#read
 * @param {string} path - the location of an installed library resource
 * @returns {ResultProvider} an object whose result() function takes
 * a success callback that receives the resource
  */
function readExtensionLibrary(path) {
  if (valcheck.isNullOrUndefined(path)) {
    throw new Error('must specify path when reading the extension library resource');
  }

  var requestOptions = mlutil.copyProperties(this.client.connectionParams);
  requestOptions.method = 'GET';
  requestOptions.path = encodeURI(
      (path.substr(0,5) === '/ext/') ? ('/v1'+path)     :
      (path.substr(0,1) === '/')     ? ('/v1/ext'+path) :
      ('/v1/ext/'+path)
      );

  var operation = mlrest.createOperation(
      'read extension library', this.client, requestOptions, 'empty', 'single'
      );
  operation.path           = path;
  operation.errorTransform = pathErrorTransform;

  return mlrest.startRequest(operation);
}

/**
 * Installs a library resource on the server.
 * @method config.extlibs#write
 * @param {string} path - the location for installing the library resource
 * @param {object[]} [permissions] - the permissions controlling which users can read, update, or
 * execute the library resource
 * @param {string} contentType - the mime type for the library resource
 * @param {object|string} source - the library resource
 */
function writeExtensionLibrary() {
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
      if (valcheck.isString(arg)) {
        if (path === null) {
          path = arg; 
        } else if (contentType === null) {
          contentType = arg; 
        }
      } else if (valcheck.isArray(arg)) {
        permissions = arg;
      } else if (!valcheck.isUndefined(arg['role-name'])) {
        permissions = [arg];
      } else {
        source = arg;
      }
    }
  }

  if (valcheck.isNullOrUndefined(path) || valcheck.isNullOrUndefined(contentType) ||
      valcheck.isNullOrUndefined(source)) {
    throw new Error('must specify the path, content type, and source when writing a extension library');
  }

  var endpoint = 
      (path.substr(0,5) === '/ext/') ? ('/v1'+path)     :
      (path.substr(0,1) === '/')     ? ('/v1/ext'+path) :
      ('/v1/ext/'+path);

  if (valcheck.isArray(permissions)) {
    var role = null;
    var capabilities = null;
    var j=null;
    for (i=0; i < permissions.length; i++) {
      arg = permissions[i];
      role = arg['role-name'];
      capabilities = arg.capabilities;
      if (valcheck.isUndefined(role) || !valcheck.isArray(capabilities) || capabilities.length < 1) {
        throw new Error('cannot set permissions from '+JSON.stringify(arg));        
      }
      for (j=0; j < capabilities.length; j++) {
        endpoint += ((i === 0 && j=== 0) ? '?' : '&') + 'perm:'+role+'='+capabilities[j];
      }
    }
  }

  var requestOptions = mlutil.copyProperties(this.client.connectionParams);
  requestOptions.method  = 'PUT';
  requestOptions.headers = {
      'Content-Type': contentType
  };
  requestOptions.path = encodeURI(endpoint);

  var operation = mlrest.createOperation(
      'write extension library', this.client, requestOptions, 'single', 'empty'
      );
  operation.path            = path;
  operation.requestBody     = source;
  operation.outputTransform = emptyOutputTransform;
  operation.errorTransform  = pathErrorTransform;

  return mlrest.startRequest(operation);
}

/**
 * Deletes a library resource from the server.
 * @method config.extlibs#remove
 * @param {string} path - the location of the library resource
 */
function removeExtensionLibrary(path) {
  if (valcheck.isNullOrUndefined(path)) {
    throw new Error('must specify path when deleting the extension library resource');
  }

  var requestOptions = mlutil.copyProperties(this.client.connectionParams);
  requestOptions.method = 'DELETE';
  requestOptions.path = encodeURI(
    (path.substr(0,5) === '/ext/') ? ('/v1'+path)     :
    (path.substr(0,1) === '/')     ? ('/v1/ext'+path) :
    ('/v1/ext/'+path)
    );

  var operation = mlrest.createOperation(
      'remove extension library', this.client, requestOptions, 'empty', 'empty'
      );
  operation.path            = path;
  operation.outputTransform = emptyOutputTransform;
  operation.errorTransform  = pathErrorTransform;

  return mlrest.startRequest(operation);
}

/**
 * Lists the library resources installed under the directory on the server.
 * @method config.extlibs#list
 * @param {string} [directory] - a directory containing library resources;
 * by default, all library resources installed on the server are returned
 * @returns {ResultProvider} an object whose result() function takes
 * a success callback that receives the list of library resources installed
 * in the directory
 */
function listExtensionLibraries(directory) {
  var requestOptions = mlutil.copyProperties(this.client.connectionParams);
  requestOptions.method = 'GET';
  requestOptions.headers = {
      'Accept': 'application/json'
  };

  if (!valcheck.isString(directory)) {
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

  var operation = mlrest.createOperation(
      'list extension libraries', this.client, requestOptions, 'empty', 'single'
      );

  return mlrest.startRequest(operation);
}

/** @ignore */
function extlibs(client) {
  this.client = client;
}
extlibs.prototype.list   = listExtensionLibraries;
extlibs.prototype.read   = readExtensionLibrary;
extlibs.prototype.remove = removeExtensionLibrary;
extlibs.prototype.write  = writeExtensionLibrary;

module.exports = extlibs;
