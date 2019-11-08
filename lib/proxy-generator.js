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

const fs = require('fs');
const path = require('path');

const astTypes = require('ast-types');
const b = astTypes.builders;
const {generate} = require('astring');

function buildArrayLiteral(value) {
  return b.arrayExpression(value.map(item => buildValueLiteral(item)));
}
function buildValueLiteral(value) {
  if (Array.isArray(value)) {
    return buildArrayLiteral(value);
  } else if (value === null || value === undefined) {
    return b.nullLiteral();
  } else if (typeof value === 'object') {
    return buildObjectLiteral(value);
  }
  return b.literal(value);
}
function buildPropertyLiteral(key, value) {
  return b.property('init', b.literal(key), buildValueLiteral(value));
}
function buildObjectLiteral(obj) {
  return b.objectExpression(
      Object.entries(obj)
          .map(entry => buildPropertyLiteral(entry[0], entry[1]))
  );
}
function buildParam(name) {
  return b.identifier(name);
}
function buildMethod(className, endpointdef) {
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
        )
      ]);
  const method = b.methodDefinition('method', b.identifier(functiondef.functionName), b.functionExpression(null,
      Array.isArray(functiondef.params) ?
          functiondef.params.map(param => buildParam(param.name)) :
          [],
      b.blockStatement([
        b.returnStatement(request)
      ])
  ));
  method.comments = [generateMethodDoc(className, functiondef)];
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
function buildModule(servicedef, endpointdefs) {
  const lastStep = servicedef.endpointDirectory.split('/').reduceRight((prior, current) => (prior.length > 0) ? prior : current);
  const className = lastStep.substr(0, 1).toUpperCase() + lastStep.substr(1);
  const factoryName = 'make'+className;
  const strictStmt = b.expressionStatement(b.literal('use strict'));
  const initializer = b.callExpression(b.memberExpression(b.identifier('client'), b.identifier('createProxy')), [
    b.identifier('serviceDeclaration')
  ]);
  strictStmt.comments = [b.line('GENERATED - DO NOT EDIT!')];
  const constructor =
    b.methodDefinition('constructor', b.identifier('constructor'), b.functionExpression(null,
        [b.identifier('client'), b.identifier('serviceDeclaration')],
        b.blockStatement([
// TODO: throw new error if client is null
          b.ifStatement(b.logicalExpression("||",
              b.binaryExpression('===', b.identifier('serviceDeclaration'), b.identifier('undefined')),
              b.binaryExpression('===', b.identifier('serviceDeclaration'), b.literal(null))
              ),
              b.blockStatement([b.expressionStatement(
                  b.assignmentExpression('=', b.identifier('serviceDeclaration'), buildValueLiteral(servicedef))
              )])),
          b.expressionStatement(b.assignmentExpression('=',
              b.memberExpression(b.thisExpression(), b.identifier('$mlProxy')),
              endpointdefs.reduce(chainFunctionDeclaration, initializer)
          ))
        ]))
    );
  const hasSession = endpointdefs.reduce(endpointHasSession, false);
  const sessionFactory = (!hasSession) ? null :
      b.methodDefinition('method', b.identifier('createSession'), b.functionExpression(null,
          [],
          b.blockStatement([
            b.returnStatement(b.callExpression(
                b.memberExpression(b.memberExpression(b.thisExpression(), b.identifier('$mlProxy')), b.identifier('createSession')),
                []))
          ]))
      );
  const classMethods = (!hasSession) ? [constructor] : [constructor, sessionFactory];
  const classStmt = b.classDeclaration(
      b.identifier(className),
      b.classBody(classMethods.concat(endpointdefs.map(endpointdef => buildMethod(className, endpointdef))))
      );
  classStmt.comments = [generateClassDoc(servicedef, className)];
  const factoryDecl = b.functionDeclaration(b.identifier(factoryName),
      [b.identifier('client'), b.identifier('serviceDeclaration')],
      b.blockStatement([
        b.returnStatement(b.newExpression(b.identifier(className),
            [b.identifier('client'), b.identifier('serviceDeclaration')]))
      ]));
  factoryDecl.comments = [generateFactoryDoc(className, factoryName)];
  return b.program([
    strictStmt,
    classStmt,
    factoryDecl,
    b.expressionStatement(b.assignmentExpression('=',
        b.memberExpression(b.identifier('module'), b.identifier('exports')),
        b.identifier(factoryName)
    ))
  ]);
}
function generateClassDoc(servicedef, className) {
  const serviceDesc = servicedef.desc;
  const serviceDoc = (serviceDesc !== void 0 && serviceDesc !== null) ? serviceDesc :
      'Provides a set of operations on the database server';
  return b.commentBlock(`*
 * ${serviceDoc}
 * @namespace ${className}
`);
}
function generateFactoryDoc(className, factoryName) {
  return b.commentBlock(`
 * A factory for creating the ${className} object for executing operations on the database server.
 * @function ${factoryName}
 * @param {DatabaseClient} client - the client for accessing the database server as the user
 * @param {object} [serviceDeclaration] - an optional declaration for a custom implementation of the service
 * @returns {${className}} the object for the database operations
`);
}
function generateMethodDoc(className, functiondef) {
  const functionName = functiondef.functionName;
  const functionDesc = functiondef.desc;
  const functionDoc = (functionDesc !== void 0 && functionDesc !== null) ? functionDesc :
      `Invokes the ${functionName} operation on the database server.`;
  const paramsDoc = Array.isArray(functiondef.params) ?
      functiondef.params.map(paramdef => generateParamDoc(paramdef)) : '';
  const returnDoc = generateReturnDoc(functiondef);
  return b.commentBlock(`
 * ${functionDoc}
 * @method ${className}#${functionName}${paramsDoc}${returnDoc}
`);
}
function generateParamDoc(paramdef) {
  const paramName = paramdef.name;
  const paramDesc = paramdef.desc;
  const datatype  = paramdef.datatype;
  const multiple  = paramdef.multiple === true;
  const nullable  = paramdef.nullable === true;
  const name = nullable ? `[${paramName}]` : paramName;
  const paramDoc = (paramDesc !== void 0 && paramDesc !== null) ? paramDesc :
      multiple ? `provides multiple values for input` : `provides a value for input`;
// TODO: client-side data type
  return `
 * @param ${datatype} ${name} - ${paramDoc}`;
}
function generateReturnDoc(functiondef) {
  let returnClass = 'Promise';
  const outputMode = functiondef.$jsOutputMode;
  switch(outputMode) {
    case 'promise':
      break;
    case 'stream':
      returnClass = 'Stream';
      break;
    default:
      if (outputMode !== void 0 && outputMode !== null) {
        throw new Error('$jsOutputMode not "promise" or "stream": '+outputMode);
      }
      break;
  }
  const returndef = functiondef.return;
  const returnDesc = (returndef === void 0 || returndef === null) ? null : returndef.desc;
  const returnDoc =
      (returndef  === void 0 || returndef  === null) ? 'for success or failure' :
// TODO: client-side data type
      (returnDesc === void 0 || returnDesc === null) ? `for ${returndef.datatype} output` :
      returnDesc;
  return `
 * @returns {${returnClass}} ${returnDoc}`;
}
// TODO: generateSessionFactoryDoc()

function generateModuleSource(servicedef, endpointdefs) {
  const proxyAST = buildModule(servicedef, endpointdefs);
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
function readSourceFromDirectory(directory) {
  return readDeclarationsFromDirectory(directory).then(result => {
    if (result === null) {
      return null;
    }
    return generateModuleSource(result.serviceDeclaration, result.functionDeclarations);
  });
}

module.exports = {
  generateSource:   generateModuleSource,
  readDeclarations: readDeclarationsFromDirectory,
  readSource:       readSourceFromDirectory
};