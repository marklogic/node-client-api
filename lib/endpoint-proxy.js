/*
 * Copyright 2019 MarkLogic Corporation
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

function emptyRequest(client, funcdef, args) {
  const endpoint = funcdef.endpoint();

  const requestHeaders = {};

  const sessionParam = funcdef.sessionParam();

  const argNames = Object.keys(args);
  if (sessionParam !== null && argNames.length === 1 && argNames[0] === sessionParam) {
    addSessionParam(sessionParam, args[sessionParam], requestHeaders);
  } else if (argNames.length > 0) {
    throw new Error('function does not take arguments: ' + funcdef.name());
  }

  const outputTransform = specifyOutputTransform(funcdef, requestHeaders);

  const connectionParams = client.connectionParams;
  const requestOptions = mlutil.copyProperties(connectionParams);
  requestOptions.method = 'POST';
  requestOptions.headers = requestHeaders;
  requestOptions.path = mlutil.databaseParam(connectionParams, endpoint, '?');

  const operation = new Operation(
      'call to ' + endpoint, client, requestOptions, 'empty', funcdef.returnKind()
  );
  addOutputTransform(funcdef, operation, outputTransform);

  return requester.startRequest(operation);
}

function multiAtomicRequest(client, funcdef, args) {
  const endpoint = funcdef.endpoint();

  checkArgNames(funcdef, args);

  const requestHeaders = {
    'Content-Type': 'application/x-www-form-urlencoded;charset="utf-8"'
  };

  const sessionParam = funcdef.sessionParam();

  const requestPartList = [];
  for (const [paramName, paramdef] of funcdef.paramdefs()) {
    const paramArgs = args[paramName];
    if (isParamNull(paramName, paramdef, paramArgs)) {
      continue;
    } else if (sessionParam !== null && paramName === sessionParam) {
      addSessionParam(sessionParam, paramArgs, requestHeaders);
      continue;
    }

    if (Array.isArray(paramArgs)) {
      for (const paramArg of paramArgs) {
        requestPartList.push(paramName + '=' + encodeURIComponent(mlutil.marshal(paramArg)));
      }
    } else {
      requestPartList.push(paramName + '=' + encodeURIComponent(mlutil.marshal(paramArgs)));
    }
  }

  const outputTransform = specifyOutputTransform(funcdef, requestHeaders);

  const connectionParams = client.connectionParams;
  const requestOptions = mlutil.copyProperties(connectionParams);
  requestOptions.method = 'POST';
  requestOptions.headers = requestHeaders;
  requestOptions.path = mlutil.databaseParam(connectionParams, endpoint, '?');

  const operation = new Operation(
      'call to ' + endpoint, client, requestOptions, 'single', funcdef.returnKind()
  );
  operation.requestBody = mlutil.marshal(requestPartList.join('&'));
  addOutputTransform(funcdef, operation, outputTransform);

  return requester.startRequest(operation);
}

function multiNodeRequest(client, funcdef, args) {
  const endpoint = funcdef.endpoint();

  checkArgNames(funcdef, args);

  const multipartBoundary = mlutil.multipartBoundary;

  const requestHeaders = {
    'Content-Type': 'multipart/form-data; boundary=' + multipartBoundary
  };

  const sessionParam = funcdef.sessionParam();

  const requestPartList = [];
  for (const [paramName, paramdef] of funcdef.paramdefs()) {
    const paramArgs = args[paramName];
    if (isParamNull(paramName, paramdef, paramArgs)) {
      continue;
    } else if (sessionParam !== null && paramName === sessionParam) {
      addSessionParam(sessionParam, paramArgs, requestHeaders);
      continue;
    }

    const headers = {
      'Content-Type': paramdef.mimeType(),
      'Content-Disposition': 'form-data; name="' + paramName + '"'
    };

    if (Array.isArray(paramArgs)) {
      for (const paramArg of paramArgs) {
        requestPartList.push({
          headers: headers,
          content: mlutil.marshal(paramArg)
        });
      }
    } else {
      requestPartList.push({
        headers: headers,
        content: mlutil.marshal(paramArgs)
      });
    }
  }

  const outputTransform = specifyOutputTransform(funcdef, requestHeaders);

  const connectionParams = client.connectionParams;
  const requestOptions = mlutil.copyProperties(connectionParams);
  requestOptions.method = 'POST';
  requestOptions.headers = requestHeaders;
  requestOptions.path = mlutil.databaseParam(connectionParams, endpoint, '?');

  const operation = new Operation(
      'call to ' + endpoint, client, requestOptions, 'multipart', funcdef.returnKind()
  );
  operation.multipartBoundary = multipartBoundary;
  operation.requestPartList = requestPartList;
  addOutputTransform(funcdef, operation, outputTransform);

  return requester.startRequest(operation);
}

function addSessionParam(sessionParam, sessionArg, requestHeaders) {
  if (sessionArg === void 0 || sessionArg === null) {
    return;
  } else if (!(sessionArg instanceof SessionsState)) {
    throw new Error('unknown value for ' + sessionParam + ' session parameter: ' + sessionArg);
  }

  requestHeaders.Cookie = 'SessionID=' + sessionArg.sessionId();
}

function addOutputTransform(funcdef, operation, outputTransform) {
  if (outputTransform != null) {
    operation.outputTransform = outputTransform;
    operation.inlineAsDocument = false;
    operation.returndef = funcdef.returndef();
  }
}

function checkArgNames(funcdef, args) {
  if (typeof args !== 'object' || args === null) {
    throw new Error('argument not an object for: ' + funcdef.name());
  }

  const paramdefs = funcdef.paramdefs();
  Object.keys(args).forEach(argName => {
    if (!paramdefs.has(argName)) {
      throw new Error('argument for unknown parameter: ' + argName);
    }
  });
}

function isParamNull(paramName, paramdef, paramArgs) {
  if (paramArgs === void 0 || paramArgs === null) {
    if (!paramdef.nullable()) {
      throw new Error('null value not allowed for parameter: ' + paramName);
    }
    return true;
  }

  if (Array.isArray(paramArgs)) {
    if (!paramdef.multiple()) {
      throw new Error('multiples values not allowed for parameter: ' + paramName);
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
  const value = checkValue(operation, returndef, data);
  return convertAtomicValue(returndef, value);
}

function singleNodeOutputTransform(headers, data) {
  /*jshint validthis:true */
  const operation = this;
  return checkValue(operation, operation.returndef, data);
}

function multiOutputTransform(headers, data) {
  /*jshint validthis:true */
  const operation = this;
  const returndef = operation.returndef;
  const value = checkValue(operation, returndef, data);
  return convertValue(returndef, value);
}

function checkValue(operation, returndef, value) {
  if (value === void 0 || value === null) {
    if (returndef !== null && !returndef.nullable()) {
      operation.errorListener('invalid null response');
      return null;
    }
    return value;
  } else if (returndef === null) {
    operation.errorListener('invalid value response');
    return null;
  }
  return value;
}

function convertValue(returndef, value) {
  if (value === null) {
    return value;
  }
  return (returndef.dataKind() === "node") ? value :
      convertAtomicValue(returndef, value);
}

function convertAtomicValue(returndef, value) {
  if (value === null) {
    return value;
  }
  const datatype = returndef.datatype();
  switch (datatype) {
    case 'boolean':
      return Boolean(value);
    case 'date':
      return Date.parse(value);
    case 'dateTime':
      return Date.parse(value);
    case 'float':
      return Number(value);
    case 'int':
    case 'unsignedInt':
      return Number(value);
    default:
      return value;
  }
}

function validName(name) {
  if (typeof name !== "string" || name.length === 0) {
    throw new Error('invalid name configuration: ' + name);
  }
  return name;
}

function getParamDeclarations(functiondef, functionDeclaration) {
  const paramDeclarations = functionDeclaration.params;
  if (paramDeclarations === void 0 || paramDeclarations === null) {
    functiondef._sessionParam = null;
    return null;
  } else if (!Array.isArray(paramDeclarations)) {
    throw new Error('invalid params configuration: ' + paramDeclarations);
  }
  return paramDeclarations.filter(paramDeclaration => {
    if (paramDeclaration === void 0 || paramDeclaration === null) {
      return false;
    } else if (paramDeclaration.datatype === 'session') {
      functiondef._sessionParam = paramDeclaration.name;
      return false;
    }
    return true;
  });
}

class Datadef {
  constructor(dataDeclaration) {
    const datatype = dataDeclaration.datatype;
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
        this._dataKind = 'atomic';
        this._datatype = datatype;
        this._mimeType = 'text/plain';
        break;
      case 'binaryDocument':
        this._dataKind = 'node';
        this._mimeType = 'application/x-unknown-content-type';
        this._datatype = datatype;
        break;
      case 'array':
      case 'jsonDocument':
      case 'object':
        this._dataKind = 'node';
        this._mimeType = 'application/json';
        this._datatype = datatype;
        break;
      case 'textDocument':
        this._dataKind = 'node';
        this._mimeType = 'text/plain';
        this._datatype = datatype;
        break;
      case 'xmlDocument':
        this._dataKind = 'node';
        this._mimeType = 'application/xml';
        this._datatype = datatype;
        break;
      default:
        throw new Error('invalid datatype configuration: ' + datatype);
    }

    let multiple = dataDeclaration.multiple;
    if (multiple === void 0 || multiple === null) {
      multiple = false;
    } else if (multiple instanceof Boolean) {
      multiple = multiple.valueOf();
    } else if (typeof multiple !== 'boolean') {
      throw new Error('invalid multiple configuration: ' + multiple);
    }
    this._multiple = multiple;

    let nullable = dataDeclaration.nullable;
    if (nullable === void 0 || nullable === null) {
      nullable = false;
    } else if (nullable instanceof Boolean) {
      nullable = nullable.valueOf();
    } else if (typeof nullable !== 'boolean') {
      throw new Error('invalid nullable configuration: ' + nullable);
    }
    this._nullable = nullable;
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
    this._name = validName(paramDeclaration.name);
  }

  name() {
    return this._name;
  }
}

class Returndef extends Datadef {
  constructor(returnDeclaration) {
    super(returnDeclaration);
  }
}

class Functiondef {
  constructor(functionDeclaration, moduleDirectory, moduleExtension) {
    const funcName = functionDeclaration.functionName;
    this._name = validName(funcName);
    if (typeof moduleExtension !== "string" || moduleExtension.length === 0) {
      throw new Error('invalid module extension configuration: ' + moduleExtension);
    }

    this._endpoint =
        moduleDirectory + funcName + (moduleExtension.startsWith('.') ? moduleExtension : '.' + moduleExtension);

    let paramsKind = 'empty';

    const paramDeclarations = getParamDeclarations(this, functionDeclaration);
    if (paramDeclarations === null || paramDeclarations.length === 0) {
      this._paramdefs = new Map();
    } else {
      this._paramdefs = new Map(paramDeclarations
          .map(paramDeclaration => {
            const paramdef = new Paramdef(paramDeclaration);
            switch (paramsKind) {
              case 'empty':
                const dataKind = paramdef.dataKind();
                switch (dataKind) {
                  case 'atomic':
                    paramsKind = 'multiAtomic';
                    break;
                  case 'node':
                    paramsKind = 'multiNode';
                    break;
                  default:
                    throw new Error('invalid kind of param data: ' + dataKind);
                }
                break;
              case 'multiAtomic':
                if (paramdef.dataKind() === 'node') {
                  paramsKind = 'multiNode';
                }
                break;
              case 'multiNode':
                break;
              default:
                throw new Error('invalid kind of param list: ' + paramsKind);
            }
            return [paramdef.name(), paramdef];
          }));
    }

    this._paramsKind = paramsKind;

    const returnDeclaration = functionDeclaration.return;
    if (returnDeclaration === void 0 || returnDeclaration === null) {
      this._returndef = null;
      this._returnKind = 'empty';
    } else {
      const returndef = new Returndef(returnDeclaration);
      this._returndef = returndef;
      this._returnKind = (!returndef.multiple()) ? 'single' : 'multipart';
    }
  }

  name() {
    return this._name;
  }

  endpoint() {
    return this._endpoint;
  }

  paramdefs() {
    return this._paramdefs;
  }

  paramsKind() {
    return this._paramsKind;
  }

  returndef() {
    return this._returndef;
  }

  returnKind() {
    return this._returnKind;
  }

  sessionParam() {
    return this._sessionParam;
  }
}

class SessionsState {
  constructor() {
    this._sessionId = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
  }

  sessionId() {
    return this._sessionId;
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
    const db = client.connectionParams.database;
    if (db !== void 0 && db !== null) {
      throw new Error('connection for client cannot specify database');
    }
    this._client = client;

    const endpointDirectory = serviceDeclaration.endpointDirectory;
    if (!(typeof endpointDirectory === 'string' || (endpointDirectory instanceof String))) {
      throw new Error('service declaration must specify endpoint directory');
    }
    this._endpointDirectory = endpointDirectory.endsWith('/') ? endpointDirectory : endpointDirectory + '/';

    const moduleExtension = serviceDeclaration.moduleExtension;
    if (typeof moduleExtension === 'string' || (moduleExtension instanceof String)) {
      this._moduleExtension =
          (endpointDirectory.length === 0) ? null :
              moduleExtension.startsWith('.') ? moduleExtension :
                  '.' + moduleExtension;
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
    return new SessionsState();
  }

  execute(functionName, args) {
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

function makeEndpointProxy(dbClient, serviceDeclaration) {
  return new EndpointProxy(dbClient, serviceDeclaration);
}

module.exports = {
  init: makeEndpointProxy
};
