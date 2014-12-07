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

var testlib    = require('../etc/test-lib.js');
var testconfig = require('../etc/test-config-qa.js');

var manageClient = marklogic.createDatabaseClient(testconfig.manageAdminConnection);
var manager      = testlib.createManager(manageClient);

testconfig.manageAdminConnection.user     = "admin";
testconfig.manageAdminConnection.password = "admin";
var adminClient = marklogic.createDatabaseClient(testconfig.manageAdminConnection);
var adminManager = testlib.createManager(adminClient);


function deleteAxis(manager, name) {
  return manager.remove({
    endpoint: '/manage/v2/databases/'+ testconfig.testServerName + '/temporal/axes/' + name
    }).result();
}

function deleteCollection(manager, name) {
  return manager.remove({
    endpoint: '/manage/v2/databases/' + testconfig.testServerName + '/temporal/collections',
    params:   {collection: name}
    }).result();
}

function removeServer(manager) {
    return manager.remove({
      endpoint: '/v1/rest-apis/' + testconfig.testServerName,
      params:   {include: ['content', 'modules']}
    }).result();
}

function clearDB(manager) {
    return manager.post({
      endpoint: '/manage/v2/databases/' + testconfig.testServerName,
      contentType: 'application/json',
      accept: 'application/json',
      body:   {'operation': 'clear-database'}
    }).result();
}

console.log('Removing database and REST server for ' + testconfig.testServerName);
console.log('Removing axis and collections for ' + testconfig.testServerName);

clearDB(adminManager).
then(
function(response) {
  console.log('Remove collection (non lsqt)');
  return deleteCollection(adminManager, 'temporalCollection');
  }, function(err) {
    console.log('Clearing DB failed ... removing collection');
    return deleteCollection(adminManager, 'temporalCollection');
  }).
then(function(response) {
  console.log('Remove collection (lsqt)');
  return deleteCollection(adminManager, 'temporalCollectionLsqt');
  }, function(err) {
    console.log('Clearing DB failed ... removing collection');
    return deleteCollection(adminManager, 'temporalCollectionLsqt');
  }).
then(function(response) {
  console.log('Remove system axis');
  return deleteAxis(adminManager, 'systemTime');
  }, function(err) {
    console.log('Remove collection failed ... removing system axis');
    return deleteAxis(adminManager, 'systemTime');
  }).
then(function(response) {
  console.log('Remove valid axis');
  return deleteAxis(adminManager, 'validTime');
  }, function(err) {
    console.log('Remove system axis failed ... removing valid axis');
    return deleteAxis(adminManager, 'validTime');
  }).
then(function(response) {
  console.log('removing database and REST server for '+testconfig.testServerName);

  return removeServer(adminManager);
  }, function(err) {
    console.log('Remove valid axis failed');
    return removeServer(adminManager);
  }).
then(function(response) {
  console.log("Final step " + response.statusCode);
  if (response.statusCode < 400) {
    console.log('teardown succeeded - restart the server');
  } else {
    console.log('failed to tear down '+testconfig.testServerName+' server:\n'+
        JSON.parse(response));
  }
}, function(err) {
  console.log('Remove REST API failed');
});

