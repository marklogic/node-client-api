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
var marklogic = require('../lib/marklogic.js');

var testlib    = require('./test-lib.js');
var testconfig = require('./test-config.js');

var manageClient =
  marklogic.createDatabaseClient(testconfig.manageAdminConnection);
var manager      = testlib.createManager(manageClient);

console.log('checking for '+testconfig.testServerName);
manager.get({
  endpoint: '/v1/rest-apis/'+testconfig.testServerName
  }).
result(function(response) {
  if (response.statusCode === 404) {
    console.log(testconfig.testServerName+' not found - nothing to delete');
  } else {
    console.log('removing database and REST server for '+testconfig.testServerName);
    manager.remove({
      endpoint: '/v1/rest-apis/'+testconfig.testServerName,
      params:   {include: ['content', 'modules']}
      }).
    result(function(response) {
      if (response.statusCode < 400) {
        console.log('teardown succeeded - restart the server');
      } else {
        console.log('failed to tear down '+testconfig.testServerName+' server:\n'+
            JSON.parse(response.data));
      }
    });
  }
});

