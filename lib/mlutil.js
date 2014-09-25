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
var util = require("util");
var valcheck = require('core-util-is');

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

// TODO: retire in favour of core utils START
function isBoolean(value) {
  return (value instanceof Boolean || (typeof value) === 'boolean');
}
function isNumber(value) {
  return (value instanceof Number || (typeof value) === 'number');
}
function isSet(value) {
  return (value !== null && value !== undefined);
}
function isString(value) {
  return (value instanceof String || (typeof value) === 'string');
}
//TODO: retire in favour of core utils END

function equalThis(other) {
  return this === other;
}

function MarkLogicError() {
  var name    = null;
  var message = null;
  switch(arguments.length) {
  case 0:
    message = 'unknown error';
    break;
  case 1:
    message = arguments[0];
    break;
  case 2:
    name    = arguments[0];
    message = arguments[1];
    break;
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
  return function() {
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
        return 'transform='+transform[0];
      default:
        var endpointParam = 'transform='+transform[0];
        var transformParams = transform[1];
        var transformKeys = Object.keys(transformParams);
        for (var i=0; i < transformKeys.length; i++) {
          var transformKey = transformKeys[i];
          endpointParam += '&trans:'+transformKey+'='+transformParams[transformKey];
        }
        return endpointParam;
      }
    } else {
      return 'transform='+transform;
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

module.exports = {
    appendItem:          appendItem,
    asArray:             asArray,
    callbackOn:          callbackOn,
    copyProperties:      copyProperties,
    databaseParam:       databaseParam,
    endpointTransform:   endpointTransform,
    first:               first,
    isBoolean:           isBoolean,
    isNumber:            isNumber,
    isSet:               isSet,
    isString:            isString,
    Error:               MarkLogicError
};
