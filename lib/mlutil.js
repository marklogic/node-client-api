/*
 * Copyright 2014-2019 MarkLogic Corporation
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


var multipartBoundary = 'MLBOUND_' + Date.UTC(2014,12,31);

// Normalize arguments by returning them as an array.
function asArray() {
  var argLen = arguments.length;
  switch(argLen) {
  // No arguments returns an empty array
  case 0:
    return [];
  // Single array argument returns that array
  case 1:
    var arg = arguments[0];
    if (Array.isArray(arg)) {
      return arg;
    }
    // Single object argument returns an array with object as only element
    return [arg];
  // List of arguments returns an array with arguments as elements
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
  if (value === void 0) {
    return;
  }

  var array = object[key];
  if (array === void 0) {
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
  if (firstArg == null) {
    message = 'unknown error';
  } else if (secondArg == null) {
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
  // Add stack trace to this.stack
  Error.captureStackTrace(this, MarkLogicError);
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
  if (transform != null) {
    if (Array.isArray(transform)) {
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
  if (database == null) {
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
    if ((objectType != null) && objectType !== prototypeName) {
      return withValues ? objectType+' '+JSON.stringify(arg) : objectType;
    }

    return withValues ? typed+' '+JSON.stringify(arg) : typed;
  case 'string'   : return withValues ? typed+' '+arg : typed;
  case 'symbol'   : return withValues ? typed+' '+arg : typed;
  default         : return withValues ? typed+' '+arg : typed;
  }
}

function marshal(data) {
  if (data == null) {
    return null;
  } else if (typeof data === 'string' || data instanceof String) {
    return data;
  } else if (Buffer.isBuffer(data)) {
    return data;
  // readable stream might not inherit from ReadableStream
  } else if (typeof data._read === 'function') {
    return data;
  } else if (typeof data === 'object' && data !== null) {
    if (Array.isArray(data)) {
      return JSON.stringify(data);
    } else if (data instanceof Date) {
      return data.toISOString();
    } else if (data instanceof Set) {
      return JSON.stringify(Array.from(data));
    } else if (data instanceof Map) {
      const obj = {};
      data.forEach((value, key) => {obj[key] = value;});
      return JSON.stringify(obj);
    }
    return JSON.stringify(data);
  }
  return String(data);
}
function unmarshal(format, data) {
  if (data == null) {
    return null;
  }

  // TODO: readable stream
  switch(format) {
  case 'binary':
    return data;
  case 'json':
    if (data.length === 0) {
      return data;
    } else if (typeof data === 'string' || data instanceof String) {
      return parseJSON(data);
    } else if (Buffer.isBuffer(data)) {
      return parseJSON(data.toString());
    }
    return data;
  case 'text':
  case 'xml':
    if (Buffer.isBuffer(data)) {
      return data.toString();
    }
    return data;
  default:
    return data;
  }
}

function convertTransaction(transaction) {
  if (transaction === null || transaction === void 0) {
    return null;
  } else if (typeof transaction === 'string' || transaction instanceof String || transaction instanceof Transaction) {
    return transaction;
  } else if (transaction.txid !=null && transaction.cookies!=null) {
    return Transaction(transaction.txid, transaction.cookies);
  } else {
    throw new Error(
          'cannot process transaction without string or Transaction or Transaction properties'
          );
  }
}

function Transaction(id, cookies) {
  if (!(this instanceof Transaction)) {
    return new Transaction(id, cookies);
  }

  this.txid = id;
  if (Array.isArray(cookies) && cookies.length > 0) {
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
  if (txid == null) {
    if (action != null) {
      throw new Error(
          'cannot '+action+' transaction without string or Transaction object identifier'
          );
    }
    return;
  }

  if (typeof txid === 'string' || txid instanceof String) {
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
    if (cookies != null) {
      var headers = requestOptions.headers;
      if (headers != null) {
        headers.cookie = cookies;
      } else {
        requestOptions.headers = {
            cookie: cookies
        };
      }
    }
  }
}

function Timestamp(value) {
  if (!(this instanceof Timestamp)) {
    return new Timestamp();
  }
  this.value = null;
  if (value !== undefined && value !== null) {
    if (typeof value === 'string' || value instanceof String) {
      this.value = value;
    } else {
      throw new Error('timestamp value must be specified as a string');
    }
  }
}

// Slice mode can be 'array' or 'legacy'
var sliceMode = 'array';
function setSliceMode(mode) {
  sliceMode = mode;
}

function makeSliceClause(variant, args) {
  var argLen = args.length;

  var sliceClause = {};

  var firstArg  = null;
  var secondArg = null;

  var argMax = Math.min(argLen, ((variant === 'query') ? 5 : 3));
  var arg    = null;
  for (var i=0; i < argMax; i++) {
    arg = args[i];
    if (typeof arg === 'number' || arg instanceof Number) {
      switch(i) {
      case 0:
        firstArg = arg;
        break;
      case 1:
        secondArg = arg;
        break;
      }
    } else {
      switch(variant) {
      case 'query':
        if (arg['transform-results'] !== void 0) {
          sliceClause['transform-results'] = arg['transform-results'];
          continue;
        } else if (arg['extract-document-data'] !== void 0) {
          sliceClause['extract-document-data'] = arg['extract-document-data'];
          continue;
        } else if (arg['document-transform'] !== void 0) {
          sliceClause['document-transform'] = arg['document-transform'];
          continue;
        }
        break;
      case 'values':
        if (arg['document-transform'] !== void 0) {
          sliceClause['document-transform'] = arg['document-transform'];
          continue;
        }
        break;
      }
      throw new Error('unknown slice argument: '+identify(arg, true));
    }
  }

  if (firstArg !== null && secondArg !== 0) {
    var pageStart = (sliceMode === 'legacy') ? firstArg : firstArg + 1;
    if (pageStart === 0 && secondArg === null) {
      sliceClause['page-length'] = 0;
    } else {
      sliceClause['page-start'] = pageStart ;
    }
  }
  if (secondArg !== null) {
    if (sliceMode === 'legacy') {
      sliceClause['page-length'] = secondArg;
    } else {
      sliceClause['page-length'] = secondArg - firstArg;
    }
  }

  return sliceClause;
}

function makeBindingsParams(bindings, sep) {
  const keys = Object.keys(bindings);
  const max = keys.length;

  let paramStr = '';
  for (let i = 0; i < max; i++) {
    const key = keys[i];

    let objs = bindings[key];
    if (!Array.isArray(objs)) {
      objs = [objs];
    }

    const nextParams = objs.map(obj => {
      let value = obj.value;
      let name = null;
      if (value === void 0) {
        name  = key;
        value = obj;
      } else {
        const type = obj.type;
        const lang = obj.lang;

        const hasType = (type !== null && type !== void 0);
        if (hasType) {
          if (typeof type !== 'string' && !(type instanceof String)) {
            throw new Error('type must be string');
          }
          if (type.indexOf(':') > -1) {
            throw new Error('type cannot contain colon - '+type);
          }
        }

        const hasLang = (lang !== null && lang !== void 0);
        if (hasLang) {
          if (typeof lang !== 'string' && !(lang instanceof String)) {
            throw new Error('lang must be string');
          }
        }

        if (hasType && hasLang && type !== 'string') {
          throw new Error('cannot combine type with lang - '+type+' '+lang);
        } else if (hasLang) {
          name = key + '@' + lang;
        } else if (hasType) {
          name = key + ':' + type;
        } else {
          name = key;
        }
      }

      return encodeURIComponent('bind:'+name)+'='+encodeURIComponent(value);
    }).join('&');

    if (nextParams.length !== 0) {
      paramStr += sep+nextParams;
      if (sep === '?') {
        sep = '&';
      }
    }
  }

  return paramStr;
}

module.exports = {
    addTxidHeaders:      addTxidHeaders,
    appendItem:          appendItem,
    asArray:             asArray,
    callbackOn:          callbackOn,
    convertTransaction:  convertTransaction,
    copyProperties:      copyProperties,
    databaseParam:       databaseParam,
    endpointTransform:   endpointTransform,
    identify:            identify,
    Error:               MarkLogicError,
    extension:           extension,
    first:               first,
    getTxidParam:        getTxidParam,
    makeSliceClause:     makeSliceClause,
    makeBindingsParams:  makeBindingsParams,
    marshal:             marshal,
    multipartBoundary:   multipartBoundary,
    parseJSON:           parseJSON,
    rootname:            rootname,
    setSliceMode:        setSliceMode,
    Timestamp:           Timestamp,
    Transaction:         Transaction,
    unmarshal:           unmarshal
};
