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
var qs        = require('qs');
var requester = require('./requester.js');
var mlutil    = require('./mlutil.js');
var Operation = require('./operation.js');

function execOutputTransform(headers, data) {
  /*jshint validthis:true */
  if ((headers == null) || (data == null)) {
    return [];
  }

  var contentType = headers['content-type'][0];
  if (typeof contentType === 'string' || contentType instanceof String) {
    contentType = contentType.replace(/;.*$/, '');
  }

  switch(contentType) {
  case 'application/x-unknown-content-type':
    return {
      format:   'binary',
      datatype: 'node()',
      value:    data.content
    };
  case 'application/json':
    return {
      format:   'json',
      datatype: 'node()',
      value:    data.content
    };
  case 'application/xml':
    return {
      format:   'xml',
      datatype: 'node()',
      value:    data.content
    };
  }

  var primitive = headers['x-primitive'][0];
  var value     = null;
  switch(primitive) {
  case 'node()':
    return {
    format:   'text',
    datatype: 'node()',
    value:    data.content
  };
  case 'text()':
    return {
      format:   'text',
      datatype: 'node()',
      value:    data.content
    };
  case 'attribute()':
    return {
    format:   'text',
    datatype: 'attribute()',
    value:    data.content
  };
  case 'boolean':
    return {
      format:   'text',
      datatype: primitive,
      value:    Boolean(data.content)
    };
  case 'dateTime':
    return {
      format:   'text',
      datatype: primitive,
      value:    new Date(data.content)
    };
  case 'byte':
  case 'int':
  case 'short':
  case 'unsignedByte':
  case 'unsignedInt':
  case 'unsignedShort':
    return {
      format:   'text',
      datatype: primitive,
      value:    Number(data.content)
    };
  case 'decimal':
  case 'double':
  case 'float':
    value = data.content;
    return {
      format:   'text',
      datatype: primitive,
      value:    isFinite(value) ? Number(value) : value
    };
  case 'integer':
  case 'long':
  case 'negativeInteger':
  case 'nonNegativeInteger':
  case 'nonPositiveInteger':
  case 'positiveInteger':
  case 'unsignedLong':
    value = data.content;
    if (isFinite(value)) {
      var number = Number(value);
      if (Math.abs(number) < 9007199254740992) {
        value = number;
      }
    }
    return {
      format:   'text',
      datatype: primitive,
      value:    value
    };
  case 'base64Binary':
  case 'date':
  case 'duration':
  case 'gDay':
  case 'gMonth':
  case 'gMonthDay':
  case 'gYear':
  case 'gYearMonth':
  case 'hexBinary':
  case 'language':
  case 'Name':
  case 'NCName':
  case 'QName':
  case 'time':
  case 'token':
    return {
      format:   'text',
      datatype: primitive,
      value:    data.content
    };
  case 'anyAtomicType':
  case 'anyURI':
  case 'normalizedString':
  case 'string':
  case 'untypedAtomic':
    return {
      format:   'text',
      datatype: 'string',
      value:    data.content
    };
  }

  // TODO: x-path header?
  return {
    format:   'text',
    datatype: 'other',
    value:    data.content
  };
}

/**
 * Evaluates JavaScript on the server; the user for the database client must have
 * permission to evaluate code on the server and, in addition, permission
 * to execute the actions performed by the source; takes a configuration object
 * with the following named parameters or, as a shortcut, the source
 * with or without variables.
 * @method serverExec#eval
 * @since 1.0
 * @param {string} source - the JavaScript source code
 * @param {object} [variables] - an object in which each property has
 * a variable name as a key and a number, string, or boolean value
 * @param {string|transactions.Transaction}  [txid] - a string
 * transaction id or Transaction object identifying an open
 * multi-statement transaction
 * @returns {ResultProvider} an object whose result() function takes
 * a success callback that receives the response
 */
function serverJavaScriptEval() {
  /*jshint validthis:true */
  return serverExec.call(this, 'JavaScript', mlutil.asArray.apply(null, arguments));
}
/**
 * Evaluates XQuery on the server; the user for the database client must have
 * permission to evaluate code on the server and, in addition, permission
 * to execute the actions performed by the source; takes a configuration object
 * with the following named parameters or, as a shortcut, the source
 * with or without variables.
 * @method serverExec#xqueryEval
 * @since 1.0
 * @param {string} source - the XQuery source code
 * @param {object} [variables] - an object in which each property has
 * a variable name as a key and a number, string, or boolean value; the key
 * may be a namespaced name in Clark notation
 * @param {string|transactions.Transaction}  [txid] - a string
 * transaction id or Transaction object identifying an open
 * multi-statement transaction
 * @returns {ResultProvider} an object whose result() function takes
 * a success callback that receives the response
 */
function serverXQueryEval() {
  /*jshint validthis:true */
  return serverExec.call(this, 'XQuery', mlutil.asArray.apply(null, arguments));
}
/**
 * Invokes a JavaScript or XQuery module on the server; the user for the database client
 * must have permission to invoke modules on the server and, in addition, permission
 * to execute the actions performed by the module; takes a configuration object
 * with the following named parameters or, as a shortcut, the path
 * with or without variables.
 * @method serverExec#invoke
 * @since 1.0
 * @param {string} path - the path of the module in the modules database
 * for the REST server; the module must have been installed previously
 * (typically with the {@link config.extlibs#write} function) using
 * a filename extension  (mjs, sjs, or xqy by default) registered for server
 * JavaScript or XQuery in the server mime types table
 * @param {object} [variables] - an object in which each property has
 * a variable name as a key and a number, string, or boolean value; the key
 * may be in Clark notation for namespaced XQuery variables
 * @param {string|transactions.Transaction}  [txid] - a string
 * transaction id or Transaction object identifying an open
 * multi-statement transaction
 * @returns {ResultProvider} an object whose result() function takes
 * a success callback that receives the response
 */
function serverInvoke() {
  /*jshint validthis:true */
  return serverExec.call(this, 'invoke', mlutil.asArray.apply(null, arguments));
}
/** @ignore */
function serverExec(execName, args) {
  /*jshint validthis:true */
  var client = this;

  var operationDesc = null;
  var execType = null;
  if (execName === 'invoke') {
    operationDesc = 'invoke code on server';
    execType = execName;
  } else {
    operationDesc = 'eval '+execName+' on server';
    execType = execName.toLowerCase();
  }

  if (args.length === 0) {
    throw new Error('must specify the source to '+operationDesc);
  }

  var isInvoke = (execType === 'invoke');

  var arg = args[0];

  var source    = isInvoke ? arg.path : arg.source;
  var variables = null;
  var txid      = null;
  if (source !== void 0) {
    variables = arg.variables;
    txid      = mlutil.convertTransaction(arg.txid);
  } else {
    source = arg;
    if (args.length > 1) {
      variables = args[1];
    }
  }

  var body = {};
  if (isInvoke) {
    body.module = source;
  } else {
    body[execType] = source;
  }
  if (variables != null) {
    body.vars = JSON.stringify(variables);
  }

  var endpoint = isInvoke? '/v1/invoke' : '/v1/eval';
  var sep = '?';
  if (txid != null) {
    endpoint += sep+'txid='+mlutil.getTxidParam(txid);
    sep = '&';
  }

  var requestOptions = mlutil.copyProperties(client.getConnectionParams());
  requestOptions.method  = 'POST';
  requestOptions.headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept':       'multipart/mixed; boundary='+mlutil.multipartBoundary
  };
  requestOptions.path = mlutil.databaseParam(client.getConnectionParams(), endpoint, sep);
  mlutil.addTxidHeaders(requestOptions, txid);

  var operation = new Operation(
      operationDesc, client, requestOptions, 'single', 'multipart'
      );
  operation.requestBody     = qs.stringify(body);
  operation.outputTransform = execOutputTransform;

  return requester.startRequest(operation);
}

module.exports = {
    serverJavaScriptEval: serverJavaScriptEval,
    serverXQueryEval:     serverXQueryEval,
    serverInvoke:         serverInvoke
};
