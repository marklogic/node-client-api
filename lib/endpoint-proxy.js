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

const Operation = require('./operation.js');
const mlutil = require('./mlutil.js');
const requester = require('./requester.js');
const SessionState = require('./session-state.js');

function emptyRequest(client, funcdef, args) {
  const endpoint = funcdef.endpoint();

  const requestHeaders = {};

  const sessionParamName = checkSessionParam(funcdef, args, requestHeaders);

  const argNames = Object.keys(args);
  if (argNames.length > 1 || (argNames.length === 1 && argNames[0] !== sessionParamName)) {
    throw new Error('function does not take arguments: ' + funcdef.name());
  }

  const outputTransform = specifyOutputTransform(funcdef, requestHeaders);

  const connectionParams = client.getConnectionParams();
  const requestOptions = mlutil.copyProperties(connectionParams);
  requestOptions.method = 'POST';
  requestOptions.headers = requestHeaders;
  requestOptions.path = mlutil.databaseParam(connectionParams, endpoint, '?');

  const operation = new Operation(
      'call to ' + endpoint, client, requestOptions, 'empty', funcdef.returnKind()
  );
  addOutputTransform(funcdef, operation, outputTransform);

  return startRequest(funcdef, operation);
}
function multiAtomicRequest(client, funcdef, args) {
  const endpoint = funcdef.endpoint();

  const requestHeaders = {
    'Content-Type': 'application/x-www-form-urlencoded;charset="utf-8"'
  };

  checkArgNames(funcdef, args, requestHeaders);

  const connectionParams = client.getConnectionParams();
  const requestOptions = mlutil.copyProperties(connectionParams);
  requestOptions.method = 'POST';
  requestOptions.headers = requestHeaders;
  requestOptions.path = mlutil.databaseParam(connectionParams, endpoint, '?');

  const operation = new Operation(
      'call to ' + endpoint, client, requestOptions, 'single', funcdef.returnKind()
  );

  const requestPartList = [];
  for (const [paramName, paramdef] of funcdef.paramdefs()) {
    const paramArgs = args[paramName];
    if (isArgNull(paramName, paramdef, paramArgs)) {
      continue;
    }

    if (Array.isArray(paramArgs)) {
      for (const paramArg of paramArgs) {
        requestPartList.push(paramName + '=' + encodeURIComponent(mlutil.marshal(paramArg, operation)));
      }
    } else {
      requestPartList.push(paramName + '=' + encodeURIComponent(mlutil.marshal(paramArgs, operation)));
    }
  }
  operation.requestBody = requestPartList.join('&');

  const outputTransform = specifyOutputTransform(funcdef, requestHeaders);
  addOutputTransform(funcdef, operation, outputTransform);

  return startRequest(funcdef, operation);
}
function multiNodeRequest(client, funcdef, args) {
  const endpoint = funcdef.endpoint();

  const multipartBoundary = mlutil.multipartBoundary;

  const requestHeaders = {
    'Content-Type': 'multipart/form-data; boundary=' + multipartBoundary
  };

  checkArgNames(funcdef, args, requestHeaders);

  const connectionParams = client.getConnectionParams();
  const requestOptions = mlutil.copyProperties(connectionParams);
  requestOptions.method = 'POST';
  requestOptions.headers = requestHeaders;
  requestOptions.path = mlutil.databaseParam(connectionParams, endpoint, '?');

  const operation = new Operation(
      'call to ' + endpoint, client, requestOptions, 'multipart', funcdef.returnKind()
  );
  operation.multipartBoundary = multipartBoundary;

  const requestPartList = [];
  for (const [paramName, paramdef] of funcdef.paramdefs()) {
    const paramArgs = args[paramName];
    if (isArgNull(paramName, paramdef, paramArgs)) {
      continue;
    }

    const headers = {
      'Content-Type': paramdef.mimeType(),
      'Content-Disposition': 'form-data; name="' + paramName + '"'
    };

    if (paramdef.multiple()) {
      for (const paramArg of paramArgs) {
        requestPartList.push({
          headers: headers,
          content: mlutil.marshal(paramArg, operation)
        });
      }
    } else {
      requestPartList.push({
        headers: headers,
        content: mlutil.marshal(paramArgs, operation)
      });
    }
  }
  operation.requestPartList = requestPartList;

  const outputTransform = specifyOutputTransform(funcdef, requestHeaders);
  addOutputTransform(funcdef, operation, outputTransform);

  return startRequest(funcdef, operation);
}
function startRequest(funcdef, operation) {
  switch(funcdef.outputMode()) {
    case 'promise':
      return requester.startRequest(operation).result('promise');
    case 'stream':
      return requester.startRequest(operation).stream('object');
    default:
      throw new Error('unknown output mode: ' + funcdef.outputMode());
  }
}
function addSessionParam(sessionParam, sessionArg, requestHeaders) {
  if (sessionArg === void 0 || sessionArg === null) {
    return;
  } else if (!(sessionArg instanceof SessionState)) {
    throw new Error('unknown value for ' + sessionParam + ' session parameter: ' + sessionArg);
  }

  requestHeaders.Cookie = 'SessionID=' + sessionArg.sessionId();
}

function addOutputTransform(funcdef, operation, outputTransform) {
  if (outputTransform !== null) {
    operation.outputTransform = outputTransform;
    operation.inlineAsDocument = false;
    operation.returndef = funcdef.returndef();
  }
}
function checkArgNames(funcdef, args, requestHeaders) {
  if (typeof args !== 'object' || args === null) {
    throw new Error('argument not an object for: ' + funcdef.name());
  }

  const sessionParamName = checkSessionParam(funcdef, args, requestHeaders);

  const paramdefs = funcdef.paramdefs();
  Object.keys(args).forEach(argName => {
    if (!paramdefs.has(argName)) {
      if (sessionParamName === null || argName !== sessionParamName) {
        throw new Error('argument for unknown parameter: ' + argName);
      }
    }
  });
}
function checkSessionParam(funcdef, args, requestHeaders) {
  const sessionParam = funcdef.sessionParam();
  if (sessionParam === null) {
    return null;
  }
  const sessionParamName = sessionParam.name();
  const sessionArg = args[sessionParamName];
  if (sessionArg !== void 0 && sessionArg !== null) {
    addSessionParam(sessionParamName, sessionArg, requestHeaders);
  } else if (!sessionParam.nullable()) {
    throw new Error('missing required session parameter: ' + sessionParamName);
  }
  return sessionParamName;
}
function isArgNull(paramName, paramdef, paramArgs) {
  if (paramArgs === void 0 || paramArgs === null) {
    if (!paramdef.nullable()) {
      throw new Error('null value not allowed for parameter: ' + paramName);
    }
    return true;
  }

  if (Array.isArray(paramArgs)) {
    if (!paramdef.multiple()) {
      const paramDatatype = paramdef.datatype();
      if (paramDatatype !== 'array' && paramDatatype !== 'jsonDocument') {
        throw new Error('multiples values not allowed for parameter: ' + paramName);
      }
    } else if (paramArgs.length === 0) {
      if (!paramdef.nullable()) {
        throw new Error('empty value list not allowed for parameter: ' + paramName);
      }
      return true;
    }
  }

  return false;
}

function specifyOutputTransform(funcdef, requestHeaders) {
  switch (funcdef.returnKind()) {
    case 'empty':
      return null;
    case 'single':
      const returndef = funcdef.returndef();
      requestHeaders.Accept = returndef.mimeType();
      switch (returndef.dataKind()) {
        case 'atomic':
          return singleAtomicOutputTransform;
        case 'node':
          return singleNodeOutputTransform;
        default:
          throw new Error('unknown kind of data for single return value: ' + returndef.dataKind());
      }
      break;
    case 'multipart':
      requestHeaders.Accept = 'multipart/mixed; boundary=' + mlutil.multipartBoundary;
      return multiOutputTransform;
    default:
      throw new Error('unknown kind of return: ' + funcdef.returnKind());
  }
}
function singleAtomicOutputTransform(headers, data) {
  /*jshint validthis:true */
  const operation = this;
  const returndef = operation.returndef;
  if (isNullValue(operation, returndef, data)) {
    return null;
  } else if (isMultipleValue(operation, returndef, data)) {
    operation.errorListener('multiple values returned for single atomic response');
    return null;
  }
  return convertAtomicValue(operation, returndef, data);
}
function singleNodeOutputTransform(headers, data) {
  /*jshint validthis:true */
  const operation = this;
  const returndef = operation.returndef;
  if (isNullValue(operation, returndef, data)) {
    return null;
  } else if (isMultipleValue(operation, returndef, data)) {
    operation.errorListener('multiple values returned for single node response');
    return null;
  }
  return data;
}
function multiOutputTransform(headers, data) {
  /*jshint validthis:true */
  const operation = this;
  const returndef = operation.returndef;
  if (isNullValue(operation, returndef, data)) {
    return null;
  }
  return Array.isArray(data) ?
      data.map(value => convertValue(operation, returndef, value)) :
      convertValue(operation, returndef, data);
}

function isNullValue(operation, returndef, value) {
  if (value === void 0 || value === null) {
    if (returndef !== null && !returndef.nullable()) {
      operation.errorListener('invalid null response');
    }
    return true;
  } else if (returndef === null) {
    operation.errorListener('invalid value response');
    return true;
  }
  return false;
}
function isMultipleValue(operation, returndef, value) {
  if (Array.isArray(value)) {
    if (returndef.datatype() === 'array') {
      return false;
    } else if (!returndef.multiple()) {
      operation.errorListener('invalid multiple response');
    }
    return true;
  }
  return false;
}
function convertValue(operation, returndef, value) {
  if (value === null) {
    return value;
  }
  const returnKind = returndef.dataKind();
  switch (returnKind) {
    case 'atomic':
      return convertAtomicValue(operation, returndef, value);
    case 'node':
      return value;
    default:
      throw new Error(`unknown return kind ${returnKind}`);
  }
}
function convertAtomicValue(operation, returndef, value) {
  if (value === null) {
    return value;
  }
  switch (returndef.getJsType()) {
    case 'boolean':
      return 'true' === value;
    case 'number':
      const converted = Number(value);
      if (Number.isNaN(converted)) {
        operation.errorListener('response not numeric: '+value);
        return null;
      }
      return converted;
    case 'string':
      return value;
    case 'Date':
      return new Date(value);
    default:
      throw new Error(
          `unknown JavaScript type ${returndef.getJsType()} for atomic datatype ${returndef.datatype()}`
      );
  }
}

function paramMapEntry(paramDeclaration) {
  const paramdef = new Paramdef(paramDeclaration);
  return [paramdef.name(), paramdef];
}

// START SHARED WITH Modules/MarkLogic/rest-api/lib/openapi-transform.sjs IN THE SERVER
function expandDataDeclaration(id, dataDeclaration) {
  const datatype = dataDeclaration.datatype;
  if (datatype === void 0 || datatype === null) {
    throw new Error(`missing datatype for ${id}`);
  }

  switch (datatype) {
    case 'boolean':
    case 'date':
    case 'dateTime':
    case 'dayTimeDuration':
    case 'decimal':
    case 'double':
    case 'float':
    case 'int':
    case 'long':
    case 'string':
    case 'time':
    case 'unsignedInt':
    case 'unsignedLong':
      dataDeclaration.dataKind = 'atomic';
      dataDeclaration.mimeType = 'text/plain';
      break;
    case 'binaryDocument':
      dataDeclaration.dataKind = 'node';
      dataDeclaration.mimeType = 'application/x-unknown-content-type';
      break;
    case 'array':
    case 'jsonDocument':
    case 'object':
      dataDeclaration.dataKind = 'node';
      dataDeclaration.mimeType = 'application/json';
      break;
    case 'textDocument':
      dataDeclaration.dataKind = 'node';
      dataDeclaration.mimeType = 'text/plain';
      break;
    case 'xmlDocument':
      dataDeclaration.dataKind = 'node';
      dataDeclaration.mimeType = 'application/xml';
      break;
    default:
      throw new Error(`invalid datatype configuration ${datatype} for ${id}`);
  }

  const multiple = dataDeclaration.multiple;
  if (multiple === void 0 || multiple === null) {
    dataDeclaration.multiple = false;
  } else if (typeof multiple !== 'boolean' && !(multiple instanceof Boolean)) {
    throw new Error(`invalid multiple configuration ${multiple} for ${id}`);
  } else if (multiple === true && datatype === 'session') {
    throw new Error(`session cannot be multiple for ${id}`);
  }

  const nullable = dataDeclaration.nullable;
  if (nullable === void 0 || nullable === null) {
    dataDeclaration.nullable = false;
  } else if (typeof nullable !== 'boolean' && !(nullable instanceof Boolean)) {
    throw new Error(`invalid nullable configuration ${nullable} for ${id}`);
  }
}
function expandParamDeclaration(paramDeclaration) {
  const paramName = paramDeclaration.name;
  if (paramName === void 0 || paramName === null) {
    throw new Error(`missing parameter name`);
  }

  expandDataDeclaration('${paramName} parameter', paramDeclaration);
}
function expandReturnDeclaration(returnDeclaration) {
  expandDataDeclaration('return value', returnDeclaration);

  let jstype = returnDeclaration.$jsType;
  if (jstype === void 0) {
    jstype = null;
  }

  const datatype = returnDeclaration.datatype;
  switch (datatype) {
    case 'boolean':
      if (jstype === null) {
        returnDeclaration.$jsType = 'boolean';
      } else if (jstype !== 'boolean' && jstype !== 'string') {
        throw new Error(
            `optional $jsType ${jstype} can only be "boolean" or "string" for datatype ${datatype} return value`
        );
      }
      break;
    case 'date':
    case 'dayTimeDuration':
    case 'decimal':
    case 'double':
    case 'long':
    case 'string':
    case 'time':
    case 'unsignedLong':
      if (jstype === null) {
        returnDeclaration.$jsType = 'string';
      } else if (jstype !== 'string') {
        throw new Error(
            `optional $jsType ${jstype} can only be "string" for datatype ${datatype} return value`
        );
      }
      break;
    case 'dateTime':
      if (jstype === null) {
        returnDeclaration.$jsType = 'string';
      } else if (jstype !== 'Date' && jstype !== 'string') {
        throw new Error(
            `optional $jsType ${jstype} can only be "Date" or "string" for datatype ${datatype} return value`
        );
      }
      break;
    case 'float':
    case 'int':
    case 'unsignedInt':
      if (jstype === null) {
        returnDeclaration.$jsType = 'number';
      } else if (jstype !== 'number' && jstype !== 'string') {
        throw new Error(
            `optional $jsType ${jstype} can only be "number" or "string" for datatype ${datatype} return value`
        );
      }
      break;
    case 'array':
    case 'binaryDocument':
    case 'jsonDocument':
    case 'object':
    case 'textDocument':
    case 'xmlDocument':
      if (jstype !== null) {
        throw new Error(`cannot specify a $jsType for datatype ${datatype} for return value`);
      }
      break;
    default:
      throw new Error(`unknown datatype ${datatype} for return value`);
  }
}
function expandFunctionDeclaration(functionDeclaration) {
  const functionName = functionDeclaration.functionName;
  if (functionName === void 0 || functionName === null) {
    throw new Error(`missing function name`);
  }

  let paramsKind   = 'empty';
  let sessionParam = null;

  const paramDeclarations = functionDeclaration.params;
  if (paramDeclarations === void 0 || paramDeclarations === null) {
    functionDeclaration.params = [];
    functionDeclaration.maxArgs = 0;
  } else if (paramDeclarations.length > 0) {
    const filteredDeclarations = paramDeclarations.filter(paramDeclaration => {
      if (paramDeclaration === void 0 || paramDeclaration === null) {
        return false;
      } else if (paramDeclaration.datatype === 'session') {
        if (sessionParam !== null) {
          throw new Error(
              `${functionName} function with multiple session parameters: ${sessionParam.name} and ${paramDeclaration.name}`
          );
        }
        sessionParam = paramDeclaration;
        return false;
      }

      expandParamDeclaration(paramDeclaration);

      switch (paramsKind) {
        case 'empty':
          const dataKind = paramDeclaration.dataKind;
          switch (dataKind) {
            case 'atomic':
              paramsKind = 'multiAtomic';
              break;
            case 'node':
              paramsKind = 'multiNode';
              break;
            default:
              throw new Error(
                  `invalid kind of param data ${dataKind} for ${paramDeclaration.name} parameter`
              );
          }
          break;
        case 'multiAtomic':
          if (paramDeclaration.dataKind === 'node') {
            paramsKind = 'multiNode';
          }
          break;
        case 'multiNode':
          break;
        default:
          throw new Error(
              `invalid kind of parameter list ${paramsKind} for ${paramDeclaration.name} parameter`
          );
      }

      return true;
    });

    if (filteredDeclarations.length < paramDeclarations.length) {
      functionDeclaration.params  = filteredDeclarations;
      functionDeclaration.maxArgs = (sessionParam !== null) ?
          (filteredDeclarations.length + 1) : filteredDeclarations.length;
    } else {
      functionDeclaration.maxArgs = paramDeclarations.length;
    }
  }

  functionDeclaration.paramsKind = paramsKind;

  if (sessionParam !== null) {
    sessionParam.dataKind = 'session';
    sessionParam.mimeType = null;
  }
  functionDeclaration.sessionParam = sessionParam;

  const returnDeclaration = functionDeclaration.return;
  if (returnDeclaration === void 0) {
    functionDeclaration.return = null;
    functionDeclaration.returnKind = 'empty';
  } else if (returnDeclaration === null) {
    functionDeclaration.returnKind = 'empty';
  } else {
    expandReturnDeclaration(returnDeclaration);
    functionDeclaration.returnKind = returnDeclaration.multiple ? 'multipart' : 'single';
  }

  const outputMode = functionDeclaration.$jsOutputMode;
  if (outputMode === void 0 || outputMode === null) {
    functionDeclaration.$jsOutputMode = 'promise';
  } else if (outputMode !== 'promise' && outputMode !== 'stream') {
    throw new Error(`${functionName} must have $jsOutputMode of "promise" or "stream" instead of ${outputMode}`);
  }
}
function expandEndpointDeclaration(endpointDeclaration) {
  const moduleExtension = endpointDeclaration.moduleExtension;
  if (typeof moduleExtension !== "string" || moduleExtension.length === 0) {
    throw new Error('invalid module extension configuration: ' + moduleExtension);
  } else if (!moduleExtension.startsWith('.')) {
    endpointDeclaration.moduleExtension = '.' + moduleExtension;
  }

  expandFunctionDeclaration(endpointDeclaration.declaration);
}
// END SHARED WITH Modules/MarkLogic/rest-api/lib/openapi-transform.sjs IN THE SERVER

class Datadef {
  constructor(dataDeclaration) {
    this._dataKind = dataDeclaration.dataKind;
    this._datatype = dataDeclaration.datatype;
    this._mimeType = dataDeclaration.mimeType;
    this._multiple = dataDeclaration.multiple;
    this._nullable = dataDeclaration.nullable;
  }
  dataKind() {
    return this._dataKind;
  }
  mimeType() {
    return this._mimeType;
  }
  datatype() {
    return this._datatype;
  }
  multiple() {
    return this._multiple;
  }
  nullable() {
    return this._nullable;
  }
}

class Paramdef extends Datadef {
  constructor(paramDeclaration) {
    super(paramDeclaration);
    this._name = paramDeclaration.name;
  }
  name() {
    return this._name;
  }
}
class Returndef extends Datadef {
  constructor(returnDeclaration) {
    super(returnDeclaration);

    this._jstype = returnDeclaration.$jsType;
  }
  getJsType() {
    return this._jstype;
  }
}
class Functiondef {
  constructor(functionDeclaration, moduleDirectory, moduleExtension) {
    const funcName = functionDeclaration.functionName;
    this._name     = funcName;
    this._endpoint = moduleDirectory + funcName + moduleExtension;

    const params = functionDeclaration.params;
    this._maxArgs    = functionDeclaration.maxArgs;
    this._paramdefs  = (params !== null) ? new Map(params.map(paramMapEntry)) : new Map();
    this._paramsKind = functionDeclaration.paramsKind;

    const sessionParam = functionDeclaration.sessionParam;
    this._sessionParam = (sessionParam !== null) ? new Paramdef(sessionParam) : null;

    const returndef = functionDeclaration.return;
    this._returndef  = (returndef !== null) ? new Returndef(returndef) : null;
    this._returnKind = functionDeclaration.returnKind;

    this._outputMode = functionDeclaration.$jsOutputMode;
  }
  name() {
    return this._name;
  }
  endpoint() {
    return this._endpoint;
  }
  maxArgs() {
    return this._maxArgs;
  }
  paramdefs() {
    return this._paramdefs;
  }
  paramsKind() {
    return this._paramsKind;
  }
  sessionParam() {
    return this._sessionParam;
  }
  returndef() {
    return this._returndef;
  }
  returnKind() {
    return this._returnKind;
  }
  outputMode() {
    return this._outputMode;
  }
}
class EndpointProxy {
  constructor(client, serviceDeclaration) {
    if (client === void 0 || client === null) {
      throw new Error('no database client provided');
    }
    if (serviceDeclaration === void 0 || serviceDeclaration === null) {
      throw new Error('no service declaration provided');
    }
    const db = client.getConnectionParams().database;
    if (db !== void 0 && db !== null) {
      throw new Error('connection for client cannot specify database');
    }
    this._client = client;

    const endpointDirectory = serviceDeclaration.endpointDirectory;
    if (!(typeof endpointDirectory === 'string' || (endpointDirectory instanceof String))) {
      throw new Error('service declaration must specify endpoint directory');
    }
    this._endpointDirectory = endpointDirectory.endsWith('/') ? endpointDirectory : endpointDirectory + '/';

    const endpointExtension = serviceDeclaration.endpointExtension;
    if (typeof endpointExtension === 'string' || (endpointExtension instanceof String)) {
      this._moduleExtension =
          (endpointDirectory.length === 0)  ? null :
          endpointExtension.startsWith('.') ? endpointExtension :
                                              '.' + endpointExtension;
    } else {
      this._moduleExtension = null;
    }

    this._functiondefs = new Map();
  }
  withFunction(functionDeclaration, moduleExtension) {
    const overrideExtension = this._moduleExtension;
    const funcdef = new Functiondef(
        functionDeclaration,
        this._endpointDirectory,
        (overrideExtension !== null) ? overrideExtension : moduleExtension
    );

    this._functiondefs.set(funcdef.name(), funcdef);
    return this;
  }
  createSession() {
    return new SessionState();
  }
  execute(functionName, args, arglen) {
    if (!(typeof functionName === 'string' || (functionName instanceof String))) {
      throw new Error('call without function name');
    }

    const funcdef = this._functiondefs.get(functionName);
    if (funcdef === void 0) {
      throw new Error('no function definition for function: ' + functionName);
    }

    if (args === void 0 || args === null) {
      args = {};
    } else if (typeof args !== 'object') {
      throw new Error('call without arguments object: ' + args);
    }

    if (arglen > funcdef.maxArgs()) {
      throw new Error('call with more arguments than parameters: ' + arglen);
    }

    switch (funcdef.paramsKind()) {
      case 'empty':
        return emptyRequest(this._client, funcdef, args);
      case 'multiAtomic':
        return multiAtomicRequest(this._client, funcdef, args);
      case 'multiNode':
        return multiNodeRequest(this._client, funcdef, args);
      default:
        throw new Error('unknown kind of parameter list for function: ' + functionName);
    }
  }
}
class ServiceCaller {
  constructor(client, serviceDeclaration, endpointDeclarations) {
    if (client === void 0 || client === null) {
      throw new Error('no database client provided');
    }
    if (serviceDeclaration === void 0 || serviceDeclaration === null) {
      throw new Error('no service declaration provided');
    } else if (!(typeof serviceDeclaration.endpointExtension === 'string' || (serviceDeclaration.endpointExtension instanceof String))) {
      throw new Error('serviceDeclaration.endpointExtension must be a String');
    }

    if(endpointDeclarations === null || !(Array.isArray(endpointDeclarations)) || endpointDeclarations.length === 0) {
      throw new Error('endpointDeclarations needs to be a non-empty array.');
    }

    this.$mlProxy = endpointDeclarations.reduce((proxy,  endpointDeclarations) =>
    {
      expandFunctionDeclaration(endpointDeclarations);
      return proxy.withFunction(endpointDeclarations, serviceDeclaration.endpointExtension);
    }, client.createProxy(serviceDeclaration)
  );
  }

  call(functionName, args) {
    return this.$mlProxy.execute(functionName, args, 0);
  }
}

class EndpointCaller {
  constructor(client, endpointDeclaration) {
    if (client === void 0 || client === null) {
      throw new Error('no database client provided');
    }
    if (endpointDeclaration === void 0 || endpointDeclaration === null) {
      throw new Error('endpointDeclaration cannot be null.');
    }
    const endpoint = endpointDeclaration.endpoint;

    if (!(typeof endpoint === 'string' || (endpoint instanceof String)) || endpoint.length === 0)  {
      throw new Error('endpointDeclaration endpoint needs to be a non empty string.');
    }
    const regex = /^(.*[/])([^/]+)(\.[^/.]+)$/;
    const arrayValues = endpoint.match(regex);

    if(!(Array.isArray(arrayValues)) || (arrayValues.length !== 4)) {
      throw new Error('endpointDeclaration endpoint must contain endpointDirectory, functionName and extension.');
    }

    const endpointDirectory = arrayValues[1];
    const endpointFunctionName = arrayValues[2];
    const endpointExtension = arrayValues[3];

    if (!(typeof endpointDirectory === 'string' || (endpointDirectory instanceof String)) || endpointDirectory.length === 0){
      throw new Error('endpointDirectory needs to be a non empty string');
    }
    if (!(typeof endpointFunctionName === 'string' || (endpointFunctionName instanceof String)) || endpointFunctionName.length === 0){
      throw new Error('endpointFunctionName needs to be a non empty string');
    }
    if (!(typeof endpointExtension === 'string' || (endpointExtension instanceof String)) || endpointExtension.length === 0){
      throw new Error('endpointExtension needs to be a non empty string');
    }
    this.functionName = endpointFunctionName;

    const serviceDeclaration = {endpointDirectory: endpointDirectory, endpointExtension: endpointExtension};
    const copyEndpointDeclaration = mlutil.copyProperties(endpointDeclaration);

    copyEndpointDeclaration.functionName = endpointFunctionName;
    expandFunctionDeclaration(copyEndpointDeclaration);

    this.$mlProxy = client.createProxy(serviceDeclaration).withFunction(copyEndpointDeclaration, endpointExtension);

  }
  call(args) {
    return this.$mlProxy.execute(this.functionName, args, 0);
  }
}

function makeEndpointProxy(dbClient, serviceDeclaration) {
  return new EndpointProxy(dbClient, serviceDeclaration);
}

function initService(dbClient, serviceDeclaration, endpointDeclarations) {
  return new ServiceCaller(dbClient, serviceDeclaration, endpointDeclarations);
}

function initEndpoint(dbClient, endpointDeclaration) {
  return new EndpointCaller(dbClient, endpointDeclaration);
}


module.exports = {
  init: makeEndpointProxy,
  expandEndpointDeclaration: expandEndpointDeclaration,
  initService: initService,
  initEndpoint: initEndpoint
};
