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

const {Transform} = require('stream');

const ProxyGenerator = require('../lib/proxy-generator.js');

const Vinyl = require('../lib/optional.js').library('vinyl');

let testData = null;
try {
  const testDataFile = path.resolve(path.resolve('test-basic-proxy'), 'testdef.json');
  testData = JSON.parse(fs.readFileSync(testDataFile, 'utf8'));
} catch (err) {
  console.error(`could not open ${testDataFile}`);
  throw err;
}

function transformDirectoryToTestSource() {
  return new Transform({
    allowHalfOpen:      false,
    writableObjectMode: true,
    readableObjectMode: true,
    transform(directory, encoding, callback) {
      const self = this;
      if (!Vinyl.isVinyl(directory) || !directory.isDirectory() || directory.path === void 0 || !(directory.path.length > 0)) {
        console.trace('not Vinyl directory: '+directory);
        callback();
        return;
      }
      ProxyGenerator.readDeclarations(directory.path)
          .then(result => {
            if (result === void 0 || result === null ||
                !Array.isArray(result.functionDeclarations) || result.functionDeclarations.length === 0
            ) {
              console.trace('no declarations: ' +directory.path);
              callback();
              return;
            }
            const serviceDeclaration = result.serviceDeclaration;
            const functionDeclarations = result.functionDeclarations;
            const proxySrc = ProxyGenerator.generateSource(serviceDeclaration, functionDeclarations);
            const cwd = directory.cwd;
            const outputBase = path.resolve(cwd, 'lib');
            const outputFile = {
              cwd:      cwd,
              base:     outputBase,
              path:     path.resolve(outputBase, directory.basename + '.js'),
              contents: Buffer.from(proxySrc, 'utf-8')
            };
            const testSrc  = generateTest(directory.basename, serviceDeclaration, functionDeclarations);
            const testFile = {
              cwd:      cwd,
              base:     outputBase,
              path:     path.resolve(outputBase, directory.basename + 'Test.js'),
              contents: Buffer.from(testSrc, 'utf-8')
            };
            self.push(new Vinyl(outputFile));
            self.push(new Vinyl(testFile));
            callback();
            })
          .catch(err => callback(err));
    }
  });
}

function generateTest(serviceName, servicedef, endpoints) {
  const endpointCalls = endpoints.map(endpointdef => {
    const functiondef = endpointdef.declaration;
    const functionName = functiondef.functionName;
    const params = (!Array.isArray(functiondef.params)) ? null :
        functiondef.params.filter(param => param.datatype !== 'session');
    const args = (!Array.isArray(params) || params.length === 0) ? '' :
        params.map(param => {
          const datatype = param.datatype;
          const multiple = (param.multiple === true);
          return getValue('input', datatype, multiple);
        }).join(', ');
    const returndef = functiondef.return;
    const expectation = (returndef === void 0 || returndef === null || functionName.endsWith('ReturnNull')) ?
        'expect(output).to.be.undefined;' :
        `expect(output).to.eql(${getValue('output', returndef.datatype, (returndef.multiple=== true))})`;
    return `
  it('${functionName} endpoint', function(done) {
    service.${functionName}(${args})
       .then(output => {
          ${expectation}
          done();
          })
        .catch(err => {
          expect.fail(err.toString());
          done();
        });
  });`;
  }).join('');

  return `'use strict';
const expect = require('chai').expect;

const testutil = require('../testutil');

const serviceFactory = require("./${serviceName}.js");

describe('${serviceName} service', function() {
  const service = serviceFactory(testutil.makeClient());
${endpointCalls}
});
`;
}
function getValue(mode, datatype, multiple) {
  const values = testData[datatype];
  switch(datatype) {
    case 'binaryDocument':
      if (multiple)
        return `[Buffer.from('${values[0]}', 'base64'), Buffer.from('${values[1]}', 'base64')]`;
      return `Buffer.from('${values[0]}', 'base64')`;
    case 'dateTime':
      switch(mode) {
        case 'input':
          if (multiple)
            return `[new Date('${values[0]}'), new Date('${values[1]}')]`;
          return `new Date('${values[0]}')`;
        case 'output':
          if (multiple)
            return `['${values[0]}', '${values[1]}']`;
          return `'${values[0]}'`;
        default:
          throw new Error(`unsupported mode: ${mode}`);
      }
    case 'array':
    case 'boolean':
    case 'float':
    case 'int':
    case 'jsonDocument':
    case 'object':
    case 'unsignedInt':
      if (multiple)
        return `[${values[0]}, ${values[1]}]`;
      return values[0];
    case 'date':
    case 'dayTimeDuration':
    case 'decimal':
    case 'double':
    case 'long':
    case 'string':
    case 'textDocument':
    case 'time':
    case 'unsignedLong':
      if (multiple)
        return `['${values[0]}', '${values[1]}']`;
      return `'${values[0]}'`;
    case 'xmlDocument':
      if (multiple)
        return `['${values[0]}', '${values[1]}']`;
      return `'${values[0]}\\n'`;
    default:
      throw new Error(`unsupported datatype: ${datatype}`);
  }
}

module.exports = {
  generate: transformDirectoryToTestSource
};