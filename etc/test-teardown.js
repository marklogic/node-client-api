/*
* Copyright (c) 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/
var marklogic = require('../lib/marklogic.js');

var testlib        = require('./test-lib.js');
var promptForAdmin = require('./test-setup-prompt.js');
var testconfig     = require('./test-config.js');

promptForAdmin(createManager);

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
        return manager.post({
          endpoint: '/manage/v2/databases/' + testconfig.testServerName+'-modules',
          contentType: 'application/json',
          accept: 'application/json',
          body: {'operation': 'clear-database'}
          }).result();
        }).
      then(function(response) {
        return manager.put({
          endpoint: '/manage/v2/databases/'+testconfig.testServerName+'/properties',
          params:   {
            format: 'json'
            },
          body:        {'schema-database': 'Schemas'},
          hasResponse: true
          }).result();
        }).
      then(function(response) {
        return       manager.remove({
          endpoint: '/v1/rest-apis/'+testconfig.testServerName,
          accept:   'application/json',
          params:   {include: ['content', 'modules']}
          }).result();
        }).
      then(function(response) {
          console.log('teardown succeeded - restart the server');
        },
        function(error) {
          console.log('failed to tear down '+testconfig.testServerName+' server:\n'+
              JSON.stringify(error, null, 2));
        });
    }
  });
}

