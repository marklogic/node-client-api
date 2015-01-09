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
var fs = require('fs');

var marklogic = require('../lib/marklogic.js');

var testlib        = require('../etc/test-lib.js');
var promptForAdmin = require('../etc/test-setup-prompt.js');
var setupUsers     = require('../etc/test-setup-users.js');
var testconfig     = require('../etc/test-config.js');

promptForAdmin(createManager);

function createManager(adminUser, adminPassword) {
  testconfig.manageAdminConnection.user     = adminUser;
  testconfig.manageAdminConnection.password = adminPassword;

  var manageClient =
    marklogic.createDatabaseClient(testconfig.manageAdminConnection);
  var manager      = testlib.createManager(manageClient);

  setupUsers(manager, setup);
}
var scriptCount = 0;
function setup(manager) {
  var destination = '../../';

  console.log('copying example connection configuration to "example-config.js"');
  copyFile('./etc/test-config.js', destination+'example-config.js');

  fs.readdir('./examples', function(err, filenames) {
    if (err) {
      throw err;
    }

    var exclude = {
        'all.js':         true,
        'before-load.js': true,
        'setup.js':       true
    };

    console.log('copying example scripts');
    filenames = filenames.filter(function(filename) {
      return (filename.match(/\.js$/) && exclude[filename] !== true);
    });
    scriptCount = filenames.length;
    filenames.forEach(function(filename) {
      copyFile('./examples/'+filename, destination+filename, checkFinished);
    });
  });
}
function reportError(err) {
  throw err;
}
function checkFinished() {
  scriptCount--;
  if (scriptCount === 0) {
    console.log('finished copying example scripts\n');
    require('./before-load.js');
  }
}
function copyFile(inputFilename, outputFilename, onFinished) {
  var reader = fs.createReadStream(inputFilename);
  reader.on('error', reportError);

  var writer = fs.createWriteStream(outputFilename);
  writer.on('error', reportError);
  if (onFinished !== undefined) {
    writer.on('finish', onFinished);
  }

  reader.pipe(writer);
}
