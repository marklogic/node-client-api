/*
* Copyright © 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
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
