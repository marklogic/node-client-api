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
var qs       = require('qs');
var mlrest   = require('./mlrest.js');
var mlutil   = require('./mlutil.js');

function execOutputTransform(headers, data) {
  if (valcheck.isNullOrUndefined(headers) || valcheck.isNullOrUndefined(data)) {
    return;
  }

// console.log(JSON.stringify(headers, null, 4));
// console.log(JSON.stringify(data, null, 4));
  switch(headers['content-type'][0]) {
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
  case 'text/xml':
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
  case 'anySimpleType':
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

function serverJavaScriptEval() {
  return serverExec.call(this, 'javascript', mlutil.asArray.apply(null, arguments));
}
function serverXQueryEval() {
  return serverExec.call(this, 'xquery',     mlutil.asArray.apply(null, arguments));
}
function serverInvoke() {
  return serverExec.call(this, 'invoke',     mlutil.asArray.apply(null, arguments));
}
function serverExec(execType, args) {
  var client = this;

  if (args.length === 0) {
    throw new Error('must specify the source to evaluate on the server');
  }

  var isInvoke = (execType === 'invoke');

  var arg = args[0];

  var source    = isInvoke ? arg.path : arg.source;
  var variables = null;
  var txid      = null;
  if (!valcheck.isUndefined(source)) {
    variables = arg.variables;
    txid      = arg.txid;
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
  if (!valcheck.isNullOrUndefined(variables)) {
    body.vars = JSON.stringify(variables);
  }

  var endpoint = isInvoke? '/v1/invoke' : '/v1/eval';
  if (!valcheck.isNullOrUndefined(txid)) {
    endpoint += '?txid='+txid;
  }

  var requestOptions = mlutil.copyProperties(client.connectionParams);
  requestOptions.method  = 'POST';
  requestOptions.headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept':       'multipart/mixed; boundary='+mlrest.multipartBoundary
  };
  requestOptions.path = endpoint;

  var operation = mlrest.createOperation(
      'eval JavaScript on server', client, requestOptions, 'single', 'multipart'
      );
  operation.requestBody     = qs.stringify(body);
  operation.outputTransform = execOutputTransform;

  return mlrest.startRequest(operation);
}

module.exports = {
    serverJavaScriptEval: serverJavaScriptEval,
    serverXQueryEval:     serverXQueryEval,
    serverInvoke:         serverInvoke
};
