/*
* Copyright © 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
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
    console.log('checking for '+testconfig.dmsdktestServerName);
    manager.get({
        endpoint: '/v1/rest-apis/'+testconfig.dmsdktestServerName
    }).
    result(function(response) {
        if (response.statusCode === 404) {
            console.log(testconfig.dmsdktestServerName+' not found - nothing to delete');
        } else {
            console.log('removing database and REST server for '+testconfig.dmsdktestServerName);
            manager.put({
                endpoint: '/manage/v2/databases/'+testconfig.dmsdktestServerName+'/properties',
                params: {
                    format: 'json'
                },
                body: {
                    'schema-database': 'Schemas'
                },
                hasResponse: true
            }).result().
            then(function(response) {
                return manager.post({
                    endpoint: '/manage/v2/databases/' + testconfig.dmsdktestServerName,
                    contentType: 'application/json',
                    accept: 'application/json',
                    body: {'operation': 'clear-database'}
                }).result();
            }).
            then(function(response) {
                return manager.post({
                    endpoint: '/manage/v2/databases/' + testconfig.dmsdktestServerName+'-modules',
                    contentType: 'application/json',
                    accept: 'application/json',
                    body: {'operation': 'clear-database'}
                }).result();
            }).
            then(setTimeout(function(response) {
                return       manager.remove({
                    endpoint: '/v1/rest-apis/'+testconfig.dmsdktestServerName,
                    accept:   'application/json',
                    params:   {include: ['content', 'modules']}
                }).result();
            }, 10000)).
            then(setTimeout(function(response) {
                    console.log('teardown succeeded - restart the server');
                },
                function(error) {
                    console.log('failed to tear down '+testconfig.dmsdktestServerName+' server:\n'+
                        JSON.stringify(error));
                }, 10000));
        }
    });
}

