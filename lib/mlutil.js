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
var util = require("util");
var valcheck = require('core-util-is');

var multipartBoundary = 'MLBOUND_' + Date.UTC(2014,12,31);

function asArray() {
  var argLen = arguments.length;
  switch(argLen) {
  case 0:
    return [];
  case 1:
    var arg = arguments[0];
    if (valcheck.isArray(arg)) {
      return arg;
    }
    return [arg];
  default:
    var args = new Array(argLen);
    for(var i=0; i < argLen; ++i) {
      args[i] = arguments[i];
    }
    return args;
  }
}
function copyProperties(source, target) {
  var dest = (arguments.length > 1) ? target : {};

  // for...in not currently optimized by v8
  var keys = Object.keys(source);
  var keyLen = keys.length;
  for (var i=0; i < keyLen; i++) {
    var key = keys[i];
    dest[key] = source[key];
  }

  return dest;
}
function first() {
  switch(arguments.length) {
  case 0:
    return {};
  default:
    var firstArg = arguments[0];
    if (firstArg instanceof Array) {
      return firstArg[0];
    }
    return firstArg;
  }
}
function appendItem(object, key, value) {
  if (valcheck.isUndefined(value)) {
    return;
  }

  var array = object[key];
  if (valcheck.isUndefined(array)) {
    object[key] = [value];
  } else {
    array.push(value);
  }
}

// isolated in function because v8 deoptimizes try/catch
function parseJSON(raw) {
  try {
    return JSON.parse(raw);
  } catch(e) {
    // TODO: debug logging
    return raw;
  }
}
function MarkLogicError(firstArg, secondArg) {
  if (!(this instanceof MarkLogicError)) {
    return new MarkLogicError(firstArg, secondArg);
  }

  var name    = null;
  var message = null;
  if (valcheck.isNullOrUndefined(firstArg)) {
    message = 'unknown error';
  } else if (valcheck.isNullOrUndefined(secondArg)) {
    message = firstArg;
  } else {
    name    = firstArg;
    message = secondArg;
  }

  Error.call(this);
  if (name !== null) {
    this.name = name;
  }
  this.message = message;
}
util.inherits(MarkLogicError, Error);

function callbackOn(object, method) {
  var self = object;
  var func = method;
  return function callBackMethod() {
    return func.apply(self, arguments);
  };
}

function endpointTransform(transform) {
  if (!valcheck.isNullOrUndefined(transform)) {
    if (valcheck.isArray(transform)) {
      switch(transform.length) {
      case 0:
        break;
      case 1:
        return 'transform='+encodeURIComponent(transform[0]);
      default:
        var endpointParam = 'transform='+encodeURIComponent(transform[0]);
        var transformParams = transform[1];
        var transformKeys = Object.keys(transformParams);
        for (var i=0; i < transformKeys.length; i++) {
          var transformKey = transformKeys[i];
          endpointParam += '&trans:'+encodeURIComponent(transformKey)+'='+
            encodeURIComponent(transformParams[transformKey]);
        }
        return endpointParam;
      }
    } else {
      return 'transform='+encodeURIComponent(transform);
    }
  }
}

function databaseParam(connectionParams, endpoint, separator) {
  var database = connectionParams.database;
  if (valcheck.isNullOrUndefined(database)) {
    return endpoint;
  }
  return endpoint + separator + 'database=' + encodeURIComponent(database);
}

function extension(filename) {
  var extStart = filename.lastIndexOf('.') + 1;
  if (extStart === 0 || extStart === filename.length) {
    return null;
  }
  return filename.substring(extStart);
}
function rootname(filename) {
  var extStart = filename.lastIndexOf('.');
  if (extStart === 0 || extStart === filename.length) {
    return null;
  }
  return filename.substring(0,extStart);
}

function identify(arg, withValues) {
  if (arg === void 0) {
    return 'undefined';
  }
  if (arg === null) {
    return 'null';
  }
  var typed = typeof arg;
  switch(typed) {
  case 'boolean'  : return withValues ? typed+' '+arg : typed;
  case 'function' : return typed;
  case 'number'   : return withValues ? typed+' '+arg : typed;
  case 'object'   :
    if (Array.isArray(arg)) {
      return withValues ? 'Array '+JSON.stringify(arg) : 'Array';
    }
    if (Buffer.isBuffer(arg)) {
      return 'Buffer';
    }
    if (arg instanceof Error) {
      return withValues ? 'Error '+JSON.stringify(arg) : 'Error';
    }

    var prototypeName = Object.prototype.toString.call(arg);

    var objectType = prototypeName.replace(/^\[object ([^\]])$/, '$1');
    if (!valcheck.isNullOrUndefined(objectType) && objectType !== prototypeName) {
      return withValues ? objectType+' '+JSON.stringify(arg) : objectType;
    }

    return withValues ? typed+' '+JSON.stringify(arg) : typed;
  case 'string'   : return withValues ? typed+' '+arg : typed;
  case 'symbol'   : return withValues ? typed+' '+arg : typed;
  default         : return withValues ? typed+' '+arg : typed;
  }
}

function marshal(data) {
  if (valcheck.isNullOrUndefined(data)) {
    return null;
  } else if (valcheck.isString(data)) {
    return data;
  } else if (valcheck.isBuffer(data)) {
    return data;
  // readable stream might not inherit from ReadableStream
  } else if (valcheck.isFunction(data._read)) {
    return data;
  } else if (valcheck.isObject(data) || valcheck.isArray(data)) {
    return JSON.stringify(data);
  }
  return data;
}
function unmarshal(format, data) {
  if (valcheck.isNullOrUndefined(data)) {
    return null;
  }

  // TODO: readable stream
  switch(format) {
  case 'binary':
    return data;
  case 'json':
    if (data.length === 0) {
      return data;
    } else if (valcheck.isString(data)) {
      return parseJSON(data);
    } else if (valcheck.isBuffer(data)) {
      return parseJSON(data.toString());
    }
    return data;
  case 'text':
  case 'xml':
    if (valcheck.isBuffer(data)) {
      return data.toString();
    }
    return data;
  default:
    return data;
  }
}

function Transaction(id, cookies) {
  if (!(this instanceof Transaction)) {
    return new Transaction(id, cookies);
  }

  this.txid = id;
  if (valcheck.isArray(cookies) && cookies.length > 0) {
    for (var i=0; i < cookies.length; i++) {
      cookies[i] = cookies[i].replace(/;\s*expires\s*=[^;]+(;|$)/i, '$1');
    }
    this.cookies = cookies;
  }
}
Transaction.prototype.toString = function transactionToString() {
  return this.txid;
};

function getTxidParam(txid, action) {
  if (valcheck.isNullOrUndefined(txid)) {
    if (!valcheck.isNullOrUndefined(action)) {
      throw new Error(
          'cannot '+action+' transaction without string or Transaction object identifier'
          );
    }
    return;
  }

  if (valcheck.isString(txid)) {
    return txid;
  } else if (txid instanceof Transaction) {
    return txid.txid;
  }

  throw new Error(
      'can only '+action+' transaction with string or Transaction object identifier: '+
      (typeof txid)
  );
}
function addTxidHeaders(requestOptions, txid) {
  if (txid instanceof Transaction) {
    var cookies = txid.cookies;
    if (!valcheck.isNullOrUndefined(cookies)) {
      var headers = requestOptions.headers;
      if (!valcheck.isNullOrUndefined(headers)) {
        headers.cookie = cookies;
      } else {
        requestOptions.headers = {
            cookie: cookies
        };
      }
    }
  }
}

module.exports = {
    addTxidHeaders:      addTxidHeaders,
    appendItem:          appendItem,
    asArray:             asArray,
    callbackOn:          callbackOn,
    copyProperties:      copyProperties,
    databaseParam:       databaseParam,
    endpointTransform:   endpointTransform,
    identify:            identify,
    Error:               MarkLogicError,
    extension:           extension,
    first:               first,
    getTxidParam:        getTxidParam,
    marshal:             marshal,
    multipartBoundary:   multipartBoundary,
    parseJSON:           parseJSON,
    rootname:            rootname,
    Transaction:         Transaction,
    unmarshal:           unmarshal
};
