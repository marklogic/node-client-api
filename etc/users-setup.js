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
