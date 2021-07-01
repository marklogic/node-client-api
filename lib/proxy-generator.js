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

const fs = require('fs');
const path = require('path');
const {Transform} = require('stream');

const astTypes = require('ast-types');
const b = astTypes.builders;
const {generate} = require('astring');

const Vinyl = require('./optional.js').library('vinyl');

const endpointDeclarationValidator = require('./endpointDeclarationValidator');
const endpointProxy = require('./endpoint-proxy.js');


function buildArrayLiteral(value) {
  return b.arrayExpression(value.map(buildValueLiteral));
}
function buildValueLiteral(value) {
  if (Array.isArray(value)) {
    return buildArrayLiteral(value);
  } else if (value === null || value === undefined) {
    // astring.generate() doesn't seem to work well with Esprima NullLiteral
    // return b.nullLiteral();
    return b.literal(null);
  } else if (typeof value !== 'object' || value instanceof String  || value instanceof Number || value instanceof Boolean) {
    return b.literal(value);
  }
  return buildObjectLiteral(value);
}
function buildPropertyLiteral(key, value) {
//  const prop = b.property('init', b.literal(key), buildValueLiteral(value));
  return b.property('init', b.literal(key), buildValueLiteral(value));
}
function buildObjectLiteral(obj) {
  return b.objectExpression(
      Object.entries(obj)
          .map(entry => buildPropertyLiteral(entry[0], entry[1]))
  );
}
function buildParam(param) {
  return b.identifier(param.name);
}
function buildMethod(endpointdef) {
  const functiondef = endpointdef.declaration;
  const request = b.callExpression(
      b.memberExpression(b.memberExpression(b.thisExpression(), b.identifier('$mlProxy')), b.identifier('execute')),
      [
        b.literal(functiondef.functionName),
        b.objectExpression(
            Array.isArray(functiondef.params) ?
                functiondef.params.map(param =>
                    b.property('init', b.literal(param.name), b.identifier(param.name))
                    ) :
                []
        ),
        b.memberExpression(b.identifier('arguments'), b.identifier('length'))
      ]);
  const method = b.methodDefinition('method', b.identifier(functiondef.functionName), b.functionExpression(null,
      Array.isArray(functiondef.params) ?
          functiondef.params.map(buildParam) :
          [],
      b.blockStatement([
        b.returnStatement(request)
      ])
  ));
  method.comments = [generateMethodDoc(functiondef)];
  return method;
}
function chainFunctionDeclaration(prior, endpointdef) {
  return b.callExpression(b.memberExpression(
      prior,
      b.identifier('withFunction')),
      [buildValueLiteral(endpointdef.declaration), b.literal(endpointdef.moduleExtension)]);
}
function paramHasSession(foundSession, param) {
  if (foundSession) {
    return foundSession;
  }
  return (param.datatype === 'session');
}
function endpointHasSession(foundSession, endpointdef) {
  if (foundSession) {
    return foundSession;
  }
  return Array.isArray(endpointdef.declaration.params) ?
      endpointdef.declaration.params.reduce(paramHasSession, foundSession) :
      foundSession;
}
function buildModule(moduleName, servicedef, endpointdefs) {
  const hasSession = endpointdefs.reduce(endpointHasSession, false);
  const endpointMethods = endpointdefs.map(buildMethod);
  const className = moduleName.substring(0, 1).toUpperCase() + moduleName.substring(1);
  const strictStmt = b.expressionStatement(b.literal('use strict'));
  const initializer = b.callExpression(b.memberExpression(b.identifier('client'), b.identifier('createProxy')), [
    b.identifier('serviceDeclaration')
  ]);
  strictStmt.comments = [b.line('GENERATED - DO NOT EDIT!')];
  const instanceFactory = b.methodDefinition('method', b.identifier('on'), b.functionExpression(null,
      [b.identifier('client'), b.identifier('serviceDeclaration')],
      b.blockStatement([
        b.returnStatement(b.newExpression(b.identifier(className),
            [b.identifier('client'), b.identifier('serviceDeclaration')]))
      ])), true);
  instanceFactory.comments = [generateInstanceFactoryDoc(className)];
  // modifies the endpoint declarations so must appear after other uses of the endpoint declarations
  endpointdefs.forEach(endpointProxy.expandEndpointDeclaration);
  const endpointSerializations = endpointdefs.reduce(chainFunctionDeclaration, initializer);
  const constructor =
    b.methodDefinition('constructor', b.identifier('constructor'), b.functionExpression(null,
        [b.identifier('client'), b.identifier('serviceDeclaration')],
        b.blockStatement([
          b.ifStatement(b.logicalExpression("||",
              b.binaryExpression('===', b.identifier('client'), b.identifier('undefined')),
              b.binaryExpression('===', b.identifier('client'), b.literal(null))
              ),
              b.blockStatement([b.throwStatement(b.newExpression(b.identifier('Error'), [
                  b.literal('missing required client')
              ]))])),
          b.ifStatement(b.logicalExpression("||",
              b.binaryExpression('===', b.identifier('serviceDeclaration'), b.identifier('undefined')),
              b.binaryExpression('===', b.identifier('serviceDeclaration'), b.literal(null))
              ),
              b.blockStatement([b.expressionStatement(
                  b.assignmentExpression('=', b.identifier('serviceDeclaration'), buildValueLiteral(servicedef))
              )])),
          b.expressionStatement(b.assignmentExpression('=',
              b.memberExpression(b.thisExpression(), b.identifier('$mlProxy')),
              endpointSerializations
          ))
        ]))
    );
  constructor.comments = [generateConstructorDoc(className)];
  let sessionFactory = null;
  if (hasSession) {
    const sessionFactoryName = 'createSession';
    sessionFactory = b.methodDefinition('method', b.identifier(sessionFactoryName),
        b.functionExpression(null, [], b.blockStatement([
          b.returnStatement(b.callExpression(
              b.memberExpression(b.memberExpression(b.thisExpression(), b.identifier('$mlProxy')), b.identifier('createSession')),
              []))
        ]))
      );
    sessionFactory.comments = [generateSessionFactoryDoc(className, sessionFactoryName)];
  }
  const classMethods = hasSession ? [instanceFactory, constructor, sessionFactory] : [instanceFactory, constructor];
  const classStmt = b.classDeclaration(
      b.identifier(className),
      b.classBody(classMethods.concat(endpointMethods))
      );
  classStmt.comments = [generateClassDoc(servicedef)];
  return b.program([
    strictStmt,
    classStmt,
    b.expressionStatement(b.assignmentExpression('=',
        b.memberExpression(b.identifier('module'), b.identifier('exports')),
        b.identifier(className)
    ))
  ]);
}
function generateClassDoc(servicedef) {
  const serviceDesc = servicedef.desc;
  const serviceDoc = (serviceDesc !== void 0 && serviceDesc !== null) ? serviceDesc :
      'Provides a set of operations on the database server';
  return b.commentBlock(`*
 * ${serviceDoc}
`);
}
function generateInstanceFactoryDoc(className) {
  const paramDoc = generateConstructorParamDoc();
  return b.commentBlock(`*
 * A convenience factory that calls the constructor to create the ${className} object for executing operations
 * on the database server.
 * ${paramDoc}
 * @returns {${className}} the object for the database operations
`);
}
function generateConstructorDoc(className) {
  const paramDoc = generateConstructorParamDoc();
  return b.commentBlock(`*
 * The constructor for creating a ${className} object for executing operations on the database server.
 * ${paramDoc}
`);
}
function generateConstructorParamDoc() {
  return `@param {DatabaseClient} client - the client for accessing the database server as the user
 * @param {object} [serviceDeclaration] - an optional declaration for a custom implementation of the service`;
}
function generateMethodDoc(functiondef) {
  const functionDesc = functiondef.desc;
  const functionDoc = (functionDesc !== void 0 && functionDesc !== null) ? functionDesc :
      `Invokes the ${functiondef.functionName} operation on the database server.`;
  const paramsDoc = Array.isArray(functiondef.params) ?
      functiondef.params.map(generateParamDoc) : '';
  const returnDoc = generateReturnDoc(functiondef);
  return b.commentBlock(`*
 * ${functionDoc}${paramsDoc}${returnDoc}
`);
}
function generateParamDoc(paramdef) {
  const paramName = paramdef.name;
  const paramDesc = paramdef.desc;
  const datatype  = paramdef.datatype;
  const multiple  = paramdef.multiple === true;
  const nullable  = paramdef.nullable === true;
  const docname = nullable ? `[${paramName}]` : paramName;
  let doctype = null;
  switch (datatype) {
    case 'boolean':
      doctype = '{boolean|string}';
      break;
    case 'dateTime':
      doctype = '{Date|string}';
      break;
    case 'decimal':
    case 'double':
    case 'float':
    case 'int':
    case 'long':
    case 'unsignedInt':
    case 'unsignedLong':
      doctype = '{number|string}';
      break;
    case 'date':
    case 'dayTimeDuration':
    case 'string':
    case 'time':
      doctype = '{string}';
      break;
    case 'binaryDocument':
      doctype = '{Buffer|stream.Readable}';
      break;
    case 'array':
      doctype = '{array|Buffer|Set|stream.Readable|string}';
      break;
    case 'jsonDocument':
      doctype = '{array|Buffer|Map|Set|stream.Readable|string}';
      break;
    case 'object':
      doctype = '{Buffer|Map|stream.Readable|string}';
      break;
    case 'textDocument':
    case 'xmlDocument':
      doctype = '{Buffer|stream.Readable|string}';
      break;
    case 'session':
      doctype = '{SessionState}';
      break;
    default:
      throw new Error('invalid datatype configuration: ' + datatype);
  }
  const paramDoc = (paramDesc !== void 0 && paramDesc !== null) ? paramDesc :
      multiple ? `provides multiple input values of the ${datatype} datatype` :
      `provides an input value of the ${datatype} datatype`;
  return `
 * @param ${doctype} ${docname} - ${paramDoc}`;
}
function generateReturnDoc(functiondef) {
  let returnClass = 'Promise';
  const outputMode = functiondef.$jsOutputMode;
  if (outputMode !== void 0 && outputMode !== null) {
    switch(outputMode.toLowerCase()) {
      case 'promise':
        break;
      case 'stream':
        returnClass = 'stream.Readable';
        break;
      default:
        throw new Error('$jsOutputMode not "promise" or "stream": '+outputMode);
    }
  }
  const returndef = functiondef.return;
  let returnDoc = null;
  if (returndef === void 0 || returndef === null) {
    returnDoc = 'for success or failure';
  } else {
    const returnDesc = returndef.desc;
    if (returnDesc !== void 0 && returnDesc !== null) {
      returnDoc = returnDesc;
    } else {
      const datatype = returndef.datatype;
      const multiple = returndef.multiple === true;
      let jsType = functiondef.$jsType;
      if (jsType === void 0 || jsType === null) {
        switch (datatype) {
          case 'boolean':
            jsType = 'boolean';
            break;
          case 'date':
          case 'dayTimeDuration':
          case 'dateTime':
          case 'decimal':
          case 'double':
          case 'long':
          case 'string':
          case 'textDocument':
          case 'time':
          case 'unsignedLong':
          case 'xmlDocument':
            jsType = 'string';
            break;
          case 'float':
          case 'int':
          case 'unsignedInt':
            jsType = 'number';
            break;
          case 'array':
            jsType = 'array';
            break;
          case 'binaryDocument':
            jsType = 'Buffer';
            break;
          case 'jsonDocument':
          case 'object':
            jsType = 'object';
            break;
          default:
            throw new Error(`unknown datatype ${datatype} for documenting return value`);
        }
      }
      returnDoc = multiple ? `multiple ${jsType} values of the ${datatype} data type` :
          `${jsType} value of the ${datatype} data type`;
    }
  }
  return `
 * @returns {${returnClass}} ${returnDoc}`;
}
function generateSessionFactoryDoc(className, sessionFactoryName) {
  return b.commentBlock(`*
 * A factory for creating a SessionsState object for maintaining a 
 * server session across multiple calls to the methods of the ${className} 
 * class that take a SessionsState parameter. 
 * @method ${className}#${sessionFactoryName}
 * @returns {SessionsState} the session state for the database operations
`);
}

function generateModuleSource(moduleName, servicedef, endpointdefs) {
  if (moduleName === void 0 || moduleName === null) {
    throw new Error(`missing module name`);
  } else if (servicedef === void 0 || servicedef === null) {
    throw new Error(`missing service.json declaration`);
  } else if (servicedef.endpointDirectory === void 0 || servicedef.endpointDirectory === null) {
    throw new Error(`service.json declaration without endpointDirectory property`);
  } else if (!Array.isArray(endpointdefs) || endpointdefs.length === 0) {
    throw new Error(`no endpoint pairs of *.api declaration and main module`);
  } else {
    endpointdefs.forEach(endpoint => {
      if (endpoint.moduleExtension === void 0 || endpoint.moduleExtension === null) {
        throw new Error(`endpoint without moduleExtension property`);
      } else if (endpoint.declaration === void 0 || endpoint.declaration === null) {
        throw new Error(`endpoint without declaration`);
      } else if (endpoint.declaration.functionName === void 0 || endpoint.declaration.functionName === null) {
        throw new Error(`endpoint declaration without functionName property`);
      }
      const validationResult = endpointDeclarationValidator.validate(endpoint.declaration);
      if (!(validationResult.isValid)) {
        throw new Error(`invalid endpoint declaration ${validationResult.errors}`);
      }
    });
  }
  const proxyAST = buildModule(moduleName, servicedef, endpointdefs);
  return generate(proxyAST, {comments: true});
}

class DirectoryDeclarationReader {
  constructor(directory, success, failure) {
    this._directory          = directory;
    this._success            = success;
    this._failure            = failure;
    this._serviceDeclaration = null;
    this._endpoints          = null;
    this._fileQueue          = null;
    this._fileNext           = -1;
    this.readDirectory();
  }
  success(result) {
    this._success(result);
  }
  failure(err) {
    this._failure(err);
  }
  readDirectory() {
    const directory = this._directory;
    fs.readdir(directory, (err, filenames) => {
      if (err) {
        this.failure(err);
      } else if (filenames.length === 0) {
        this.success(null);
      } else {
        const endpoints = new Map();
        this._fileQueue =  filenames
            .filter(filename => {
              const extension = path.extname(filename);
              const basename = path.basename(filename, extension);
              switch (extension) {
                case '.api':
                  if (!endpoints.has(basename)) {
                    endpoints.set(basename, {declaration: null, moduleExtension: null});
                  }
                  return true;
                case '.json':
                  return (basename === 'service');
                case '.mjs':
                case '.sjs':
                case '.xqy':
                  if (!endpoints.has(basename)) {
                    endpoints.set(basename, {declaration: null, moduleExtension: extension});
                  } else {
                    const endpoint = endpoints.get(basename);
                    if (endpoint.moduleExtension !== null) {
                      console.warn(`skipping redundant main module ${filename} in ${directory}`);
                    } else {
                      endpoint.moduleExtension = extension;
                    }
                  }
                  return false;
                default:
                  return false;
              }})
            .map(filename => path.resolve(directory, filename));
        this._endpoints = endpoints;
        this._fileNext  = 0;
        this.readFile();
      }
    });
  }
  readFile() {
    const fileQueue = this._fileQueue;
    const endpoints = this._endpoints;
    if (this._fileNext < fileQueue.length) {
      const filename = fileQueue[this._fileNext++];
      fs.readFile(filename, 'utf8', (err, data) => {
        if (err) {
          this.failure(err);
          return;
        }
        const extension = path.extname(filename);
        const basename  = path.basename(filename, extension);
        switch(extension) {
          case '.json':
            if (basename === 'service') {
              this._serviceDeclaration = JSON.parse(data);
            } else {
              console.warn(`unknown JSON file: ${filename}`);
            }
            break;
          case '.api':
            endpoints.get(basename).declaration = JSON.parse(data);
            break;
          default:
            console.warn(`unknown file: ${filename}`);
            break;
        }
        this.readFile();
      });
    } else {
      this.generateResult();
    }
  }
  generateResult() {
    const directory          = this._directory;
    const serviceDeclaration = this._serviceDeclaration;
    const endpoints          = this._endpoints;
    if (serviceDeclaration === null) {
      console.warn(`skipping directory without service.json: ${directory}`);
      this.success(null);
    } else if (endpoints.size === 0) {
      console.warn(`skipping directory without endpoints: ${directory}`);
      this.success(null);
    } else {
      const functionDeclarations = Array
          .from(endpoints)
          .filter(endpoint => {
            if (endpoint[1].declaration === null || endpoint[1].moduleExtension === null) {
              console.warn(`skipping incomplete endpoint ${endpoint[0]} in directory: ${directory}`);
              return false;
            }
            return true;
          })
          .map(endpoint => endpoint[1]);
      if (functionDeclarations.length === 0) {
        console.warn(`skipping directory without complete endpoints: ${directory}`);
        this.success(null);
      } else {
        const result = {serviceDeclaration:serviceDeclaration, functionDeclarations:functionDeclarations};
        this.success(result);
      }
    }
  }
}

function readDeclarationsFromDirectory(directory) {
  return new Promise((success, failure) => new DirectoryDeclarationReader(directory, success, failure));
}

function transformDirectoryToSource() {
  return new Transform({
    allowHalfOpen:      false,
    writableObjectMode: true,
    readableObjectMode: true,
    transform(directory, encoding, callback) {
      if (!Vinyl.isVinyl(directory) || !directory.isDirectory()) {
        console.trace('not Vinyl directory: ' +
            (Vinyl.isVinyl(directory) ? directory.path : directory.toString())
        );
        callback();
        return;
      }
      readDeclarationsFromDirectory(directory.path)
          .then(result => {
            if (result === void 0 || result === null ||
                !Array.isArray(result.functionDeclarations) || result.functionDeclarations.length === 0
            ) {
              console.trace('no declarations: ' +directory.path);
              callback();
              return;
            }
            const serviceDeclaration = result.serviceDeclaration;
            const cwd = directory.cwd;
            const outputBase = path.resolve(cwd, 'lib');
            const moduleRelative = serviceDeclaration.$jsModule;
            let outputRelative = null;
            let outputModule   = null;
            if (moduleRelative === void 0 || moduleRelative === null || moduleRelative.length === 0) {
              outputModule = directory.basename;
              outputRelative = outputModule+'.js';
            } else {
              const moduleBasename = path.basename(moduleRelative);
              const extensionLen   = path.extname(moduleBasename).length;
              outputModule = (extensionLen === 0) ? moduleBasename :
                  moduleBasename.substring(0, moduleBasename.length - extensionLen);
              outputRelative = moduleRelative;
            }
            const proxySrc = generateModuleSource(outputModule, serviceDeclaration, result.functionDeclarations);
            const outputPath = path.resolve(outputBase, outputRelative);
            const outputFile = {
              cwd:      cwd,
              base:     outputBase,
              path:     outputPath,
              contents: Buffer.from(proxySrc, 'utf-8')
            };
            callback(null, new Vinyl(outputFile));
          })
          .catch(callback);
    }
  });
}

module.exports = {
  generateSource:    generateModuleSource,
  readDeclarations:  readDeclarationsFromDirectory,
  generate:          transformDirectoryToSource,
  validate:          endpointDeclarationValidator.validate
};
