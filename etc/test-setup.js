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

var marklogic = require('../lib/marklogic.js');

var promptForAdmin = require('./test-setup-prompt.js');
var setupUsers     = require('./test-setup-users.js');

var testlib    = require('./test-lib.js');
var testconfig = require('./test-config.js');

promptForAdmin(createManager);

function createManager(adminUser, adminPassword) {
  testconfig.manageAdminConnection.user     = adminUser;
  testconfig.manageAdminConnection.password = adminPassword;

  var manageClient =
    marklogic.createDatabaseClient(testconfig.manageAdminConnection);
  var manager      = testlib.createManager(manageClient);

  setupUsers(manager, setup);
}
function setup(manager) {
  console.log('checking for '+testconfig.testServerName);
  manager.get({
    endpoint: '/v1/rest-apis/'+testconfig.testServerName
    }).
  result(function(response) {
    if (response.statusCode === 404) {
      console.log('creating database and REST server for '+testconfig.testServerName);
      manager.post({
        endpoint: '/v1/rest-apis',
        body: {
          'rest-api': {
            name:               testconfig.testServerName,
            group:              'Default',
            database:           testconfig.testServerName,
            'modules-database': testconfig.testServerName+'-modules',
            port:               testconfig.restPort
            }
          }
        }).
      result(function(response) {
        if (response.statusCode === 201) {
          console.log('getting default indexes for '+testconfig.testServerName);
          manager.get({
            endpoint: '/manage/v2/databases/'+testconfig.testServerName+'/properties'
            }).result().
          then(function(response) {
            var rangeElementIndex = response.data['range-element-index'];

            var rangeTest = {
                rangeKey1: true,
                rangeKey2: true
                };
            var rangers = [];
            if (valcheck.isNullOrUndefined(rangeElementIndex)) {
              rangeElementIndex = [];
              rangers           = Object.keys(rangeTest);
            } else {
              rangeElementIndex.forEach(function(index){
                var indexName = index.localname;
                if (rangeTest[indexName]) {
                  rangeTest[indexName] = false;
                }
              });
              rangers = Object.keys(rangeTest).filter(function(indexName){
                return rangeTest[indexName];
              });
            }

            for (var i=0; i < rangers.length; i++) {
              rangeElementIndex.push({
                  'scalar-type':           'string',
                  collation:               'http://marklogic.com/collation/',
                  'namespace-uri':         '',
                  localname:               rangers[i],
                  'range-value-positions': false,
                  'invalid-values':        'ignore'
                });
            }

            console.log('adding custom indexes for '+testconfig.testServerName);
            return manager.put({
              endpoint: '/manage/v2/databases/'+testconfig.testServerName+'/properties',
              params:   {
                format: 'json'
                },
              body:     {
                'range-element-index': rangeElementIndex 
                },
              hasResponse: true
              }).result();
            }).
          then(function(response) {
            console.log(testconfig.testServerName+' setup succeeded');
            });
        } else {
          console.log(testconfig.testServerName+' setup failed with HTTP status: '+response.statusCode);
          console.log(response.data);        
        }
      });
    } else {
      console.log(testconfig.testServerName+' test server is available on port '+
          JSON.parse(response.data).port);
    }
  });
}
