/*
* Copyright (c) 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
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

  setupUsers(manager);
}
