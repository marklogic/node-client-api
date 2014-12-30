/*
 * Copyright 2014-2015 MarkLogic Corporation
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

var testlib        = require('./test-lib.js');
//var promptForAdmin = require('./test-setup-prompt.js');
var testconfig     = require('./test-config-qa.js');

//promptForAdmin(createManager);
createManager('admin', 'admin');

function createManager(adminUser, adminPassword) {
  testconfig.manageAdminConnection.user     = adminUser;
  testconfig.manageAdminConnection.password = adminPassword;

  var manageClient =
    marklogic.createDatabaseClient(testconfig.manageAdminConnection);
  var manager      = testlib.createManager(manageClient);

  setup(manager);
}
function setup(manager) {
  console.log('checking for '+testconfig.testServerName);
  manager.get({
    endpoint: '/v1/rest-apis/'+testconfig.testServerName
    }).
  result(function(response) {
    if (response.statusCode === 404) {
      console.log(testconfig.testServerName+' not found - nothing to delete');
    } else {
      console.log('removing database and REST server for '+testconfig.testServerName);
      manager.post({
        endpoint: '/manage/v2/databases/' + testconfig.testServerName,
        contentType: 'application/json',
        accept: 'application/json',
        body: {'operation': 'clear-database'}
        }).result().
      then(function(response) { 
        return manager.remove({
          endpoint: '/manage/v2/databases/'+testconfig.testServerName+'/temporal/collections?collection=temporalCollection'
          }).result();
        }).
      then(function(response) {
        return manager.remove({
          endpoint: '/manage/v2/databases/'+testconfig.testServerName+'/temporal/collections?collection=temporalCollectionLsqt'
          }).result();
        }).
      then(function(response) {
        return manager.remove({
          endpoint: '/manage/v2/databases/'+testconfig.testServerName+'/temporal/axes/systemTime'
          }).result();
        }).
      then(function(response) {
        return manager.remove({
          endpoint: '/manage/v2/databases/'+testconfig.testServerName+'/temporal/axes/validTime'
          }).result();
        }).
      then(function(response) {
        return manager.remove({
          endpoint: '/manage/v2/users/rest-evaluator'
          }).result();
        }).
      then(function(response) {
        return manager.remove({
          endpoint: '/manage/v2/users/rest-admin'
          }).result();
        }).
      then(function(response) {
        return manager.remove({
          endpoint: '/manage/v2/users/rest-writer'
          }).result();
        }).
      then(function(response) {
        return manager.remove({
          endpoint: '/manage/v2/users/rest-reader'
          }).result();
        }).
      then(function(response) {
        return manager.remove({
          endpoint: '/manage/v2/roles/rest-evaluator'
          }).result();
        }).
      then(function(response) {
        return       manager.remove({
          endpoint: '/v1/rest-apis/'+testconfig.testServerName,
          params:   {include: ['content', 'modules']}
          }).result();
        }).
      then(function(response) {
        console.log('teardown succeeded - restart the server');
        },
        function(error) {
          console.log('failed to tear down '+testconfig.testServerName+' server:\n'+
              JSON.stringify(error));
        });
    }
  });
}

