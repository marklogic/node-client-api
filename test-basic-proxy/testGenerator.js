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

const ProxyGenerator = require('../lib/proxy-generator.js');

const rootBase     = path.resolve('test-basic-proxy');
const inputBase    = path.resolve(rootBase, 'dbfunctiondef');
const outputBase   = path.resolve(rootBase, 'lib');
const testgenBase  = path.resolve(inputBase, 'generated')
const testDataFile = path.resolve(rootBase, 'testdef.json')

let testData = null;

let dirQueue = [inputBase];
let dirNext  = 0;

let service = 0;
let functionCount = 0;

function makeVinylSourceFromDirectory(directory) {
  return ProxyGenerator.readDeclarations(directory.path).then(result => {
    if (result === null) return null;
    const proxySrc = ProxyGenerator.generateSource(result.serviceDeclaration, result.functionDeclarations);;
//         path: ???,
    const outFile = new srcFile.constructor({
        cwd: directory.cwd,
        base: directory.base,
        stat: null,
        history: directory.history.slice(),
        contents: buffer.from(proxySrc, 'utf-8')
        });
    return outFile;
  });
}
/* TODO:
    set outFile.path to outputBase + srcFile.relative + filename
    move to proxy-generator.js
    an exported function that returns a Promise can be used as a task in gulp
    outFile.relative
    outFile.path
    outFile.dirname
    outFile.basename
    outFile.stem
    outFile.extname
    trailing separators removed
    $jsModule
    https://www.npmjs.com/package/vinyl
 */
function directoryToSourceFile(srcFile) {
  // TODO: other checking for required properties
  if (!(typeof srcFile.isDirectory === 'function') || !(typeof srcFile.clone === 'function')) {
    throw new Error('input does not appear to be Vinyl directory file: '+srcFile);
  } else if (!srcFile.isDirectory()) {
    throw new Error('input must be Vinyl directory file: '+srcFile);
  }

  const outFile = srcFile.clone({deep:false, contents:false});
  // populate outFile.contents

  return new Promise((success, failure) => new DirectoryDeclarationReader(srcFile, success, failure));
}

function nextDirectory() {
  if (dirNext < dirQueue.length) {
    const directory = dirQueue[dirNext++];
    fs.stat(path.resolve(directory, 'service.json'), (err, stat) => {
      if (err === null) {
        ProxyGenerator.readDeclarations(directory)
            .then(result => {
              if (result === null) {
                nextDirectory();
              } else {
                const serviceDeclaration   = result.serviceDeclaration;
                const functionDeclarations = result.functionDeclarations;
                service++;
                functionCount += functionDeclarations.length;
                const parentDir   = path.dirname(directory);
                const relativeDir = path.relative(inputBase, parentDir);
                const outputDir   = path.resolve(outputBase, relativeDir);
                const serviceName = path.basename(directory);
                console.log(`generating client class ${relativeDir}/${serviceName}.js`);
                const proxyFile = path.resolve(outputDir, serviceName+'.js');
                const proxySrc  = ProxyGenerator.generateSource(serviceDeclaration, functionDeclarations, '../../..');
                fs.writeFile(proxyFile, proxySrc, null, err => {
                  if (err) throw err;
                  if (parentDir === testgenBase) {
                    console.log(`generating test ${relativeDir}/${serviceName}Test.js`);
                    const testFile = path.resolve(outputDir, serviceName+'Test.js');
                    const testSrc  = generateTest(serviceName, serviceDeclaration, functionDeclarations);
                    fs.writeFile(testFile, testSrc, null, err => {
                      if (err) throw err;
                      nextDirectory();
                    });
                  } else {
                    nextDirectory();
                  }
                });
              }
            })
            .catch(err => {
              throw err;
            });
      } else if (err.code === 'ENOENT') {
        fs.readdir(directory, (err, filenames) => {
          if (err) throw err;
          if (filenames.length > 0) {
            dirQueue = dirQueue.concat(filenames.map(filename => path.resolve(directory, filename)));
          }
          nextDirectory();
        });
      } else {
        throw err;
      }
    });
  } else {
    console.log(`processed ${service} service directories having ${functionCount} functions`);
  }
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

fs.readFile(testDataFile, 'utf8', (err, data) => {
  if (err) throw err;
  testData = JSON.parse(data);
  nextDirectory();
});
