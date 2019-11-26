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

const {Writable} = require('stream');

const Vinyl = require('../lib/optional.js').library('vinyl');

const testconfig = require('../etc/test-config.js');
const marklogic = require('../');

const modulesClient = marklogic.createDatabaseClient({
  host:     testconfig.restEvaluatorConnection.host,
  port:     testconfig.restEvaluatorConnection.port,
  user:     testconfig.restEvaluatorConnection.user,
  password: testconfig.restEvaluatorConnection.password,
  authType: testconfig.restEvaluatorConnection.authType,
  database: 'unittest-nodeapi-modules'
});
const metadata = {
  collections: ['dbf/test/cases'],
  permissions: [
    {'role-name':'rest-reader', capabilities:['read', 'execute']},
    {'role-name':'rest-writer', capabilities:['update']}
  ]
};

function loadFilesToDatabase() {
  const testdir    = path.resolve('test-basic-proxy');
  const modulesdir = path.resolve(testdir, 'ml-modules');
  fs.readFile(path.resolve(modulesdir, 'testInspector.sjs'), 'utf8', (err, data) => {
    if (err) throw err;
    modulesClient.documents.write({
        uri:         '/dbf/test/testInspector.sjs',
        contentType: 'application/vnd.marklogic-javascript',
        permissions: metadata.permissions,
        content:     data
        })
      .result(null, err => {throw err;});
  });
  fs.readFile(path.resolve(testdir, 'testdef.json'), 'utf8', (err, data) => {
    if (err) throw err;
    marklogic.createDatabaseClient(testconfig.restWriterConnection).documents.write({
        uri:         '/dbf/test.json',
        contentType: 'application/json',
        content:     data
        })
      .result(null, err => {throw err;});
  });
  const bufferMax = 100;
  const batchSeed = [metadata];
  const fileBuffer = new Array(bufferMax);
  let bufferNext = 0;
  return new Writable({
    objectMode: true,
    write(file, encoding, callback) {
      if (!Vinyl.isVinyl(file) || file.isDirectory() || file.path === void 0 || !(file.path.length > 0)) {
        console.trace('not Vinyl file: '+file);
        callback();
        return;
      }
      fileBuffer[bufferNext++] = {
        uri:     '/dbf/test/'+path.basename(file.dirname)+'/'+file.basename,
        content: file.contents
      };
      if (bufferNext < bufferMax) {
        callback();
        return;
      }
      modulesClient.documents.write(batchSeed.concat(fileBuffer))
        .result(output => callback(), err => callback(err));
      bufferNext = 0;
    },
    final(callback) {
      if (bufferNext > 0) {
        modulesClient.documents.write(batchSeed.concat(fileBuffer.slice(0, bufferNext)))
            .result(output => callback(), err => callback(err));
        bufferNext = 0;
      } else {
        callback();
      }
    }
  });
}

module.exports = {
  load: loadFilesToDatabase
};