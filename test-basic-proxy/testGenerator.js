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

const generateProxy = require('../lib/proxy-generator.js').generateProxy;

const rootBase     = path.resolve('test-basic-proxy');
const inputBase    = path.resolve(rootBase, 'dbfunctiondef');
const outputBase   = path.resolve(rootBase, 'lib');
const testgenBase  = path.resolve(inputBase, 'generated')
const testDataFile = path.resolve(rootBase, 'testdef.json')

let testData = null;

let dirQueue = [inputBase];
let dirNext  = 0;
let dirCount = 0;

let fileQueue = [];
let fileNext  = 0;
let fileCount = 0;

let service = null;

function nextDirectory() {
  if (service !== null) {
    const serviceDir = dirQueue[dirNext - 1];
    if (service.serviceDeclaration === null) {
      console.warn(`skipping directory without service.json: ${serviceDir}`);
    } else if (service.endpoints.size === 0) {
      console.warn(`skipping directory without endpoints: ${serviceDir}`);
    } else {
      const endpoints = Array
          .from(service.endpoints)
          .filter(endpoint => {
            if (endpoint[1].declaration === null || endpoint[1].moduleExtension === null) {
              console.warn(`skipping incomplete endpoint ${endpoint[0]} in directory: ${serviceDir}`);
              return false;
            }
            return true;
            })
          .map(endpoint => endpoint[1]);
      if (endpoints.length === 0) {
        console.warn(`skipping directory without complete endpoints: ${serviceDir}`);
      } else {
        const parentDir   = path.dirname(serviceDir);
        const relativeDir = path.relative(inputBase, parentDir);
        const outputDir   = path.resolve(outputBase, relativeDir);
        const serviceName = path.basename(serviceDir);
        const outputFile  = path.resolve(outputDir, serviceName+'.js');
        console.log(`generating client class ${relativeDir}/${serviceName}.js`);
        const proxySrc = generateProxy(service.serviceDeclaration, endpoints, '../../..');
        let testFile = null;
        let testSrc = null;
        if (parentDir === testgenBase) {
          testFile = path.resolve(outputDir, serviceName+'Test.js');
          console.log(`generating test ${relativeDir}/${serviceName}Test.js`);
          testSrc = generateTest(serviceName, service.serviceDeclaration, endpoints);
        }
        service = null;
        fs.writeFile(outputFile, proxySrc, null, err => {
          if (err) throw err;
          if (testSrc !== null) {
            fs.writeFile(testFile, testSrc, null, err => {
              if (err) throw err;
              nextDirectory();
            });
          } else {
            nextDirectory();
          }
        });
        return;
      }
    }
    service = null;
  }
  if (dirNext < dirQueue.length) {
    const directory = dirQueue[dirNext++];
    fs.readdir(directory, (err, filenames) => {
      if (err) throw err;
      dirCount++;
      if (filenames.length > 0) {
        checkDirectory(directory, filenames);
      } else {
        nextDirectory();
      }
    });
  } else {
    console.log(`processed ${dirCount} directories having ${fileCount} files`);
  }
}
function checkDirectory(directory, filenames) {
  // assume no mix of files and subdirectories as children
  fs.stat(path.resolve(directory, filenames[0]), (err, firstStat) => {
    if (err) throw err;
    if (firstStat.isDirectory()) {
      const outputDir = path.resolve(outputBase, path.relative(inputBase, directory));
      console.log(`making ${outputDir}`);
      fs.mkdir(outputDir, null, err => {
        if (err !== null && err.code !== 'EEXIST') throw err;
        dirQueue = dirQueue.concat(filenames.map(filename => path.resolve(directory, filename)));
        nextDirectory();
      });
    } else {
      readDirectory(directory, filenames);
    }
  });
}
function readDirectory(directory, filenames) {
  service = {
    serviceDeclaration: null,
    endpoints: new Map()
  };
  fileQueue = fileQueue.concat(
      filenames
          .filter(filename => {
            const extension = path.extname(filename);
            const basename = path.basename(filename,extension);
            switch (extension) {
              case '.api':
                if (!service.endpoints.has(basename)) {
                  service.endpoints.set(basename, {declaration: null, moduleExtension: null});
                }
                return true;
              case '.json':
                return (basename === 'service');
              case '.mjs':
              case '.sjs':
              case '.xqy':
                if (!service.endpoints.has(basename)) {
                  service.endpoints.set(basename, {declaration: null, moduleExtension: extension});
                } else {
                  const endpoint = service.endpoints.get(basename);
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
          .map(filename => path.resolve(directory, filename))
  );
  nextFile();
}
function nextFile() {
  if (fileNext < fileQueue.length) {
    const filename = fileQueue[fileNext++];
    fs.readFile(filename, 'utf8', (err, data) => {
      if (err) throw err;
      const extension = path.extname(filename);
      const basename  = path.basename(filename, extension);
      switch(extension) {
        case '.json':
          if (basename === 'service') {
            service.serviceDeclaration = JSON.parse(data);
          } else {
            console.warn(`unknown JSON file: ${filename}`);
          }
          break;
        case '.api':
          service.endpoints.get(basename).declaration = JSON.parse(data);
          break;
        default:
          console.warn(`unknown file: ${filename}`);
          break;
      }
      fileCount++;
      nextFile();
    });
  } else if (fileNext > 0) {
    fileQueue = [];
    fileNext = 0;
    nextDirectory();
  } else {
    nextDirectory();
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
