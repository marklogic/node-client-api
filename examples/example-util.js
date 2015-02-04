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

var examplePort     = 8000; // change to 8015 to use the test database
var exampleAuthType = 'DIGEST';

var unknownLocation = 0;
var modulesLocation = 1;
var packageLocation = 2;

var locationType = unknownLocation;
if (fs.existsSync('node_modules/marklogic')) {
  locationType = modulesLocation;
} else if (fs.existsSync('lib/marklogic.js')) {
  locationType = packageLocation;
}

var testconfig = null;
switch(locationType) {
case packageLocation:
  testconfig = require('../etc/test-config.js');  
  break;
default:
  testconfig = require('./example-config.js');  
  break;
}

// dispatch the require from the project or within the distribution
var marklogic = null;
function locateRequire() {
  if (marklogic === null) {
    switch(locationType) {
    case packageLocation:
      marklogic = require('../');  
      break;
    default:
      marklogic = require('marklogic');  
      break;
    }
  }

  return marklogic;
}

var dataDir = null;
function pathToData() {
  if (dataDir !== null) {
    return dataDir;
  }

  dataDir = 'node_modules/marklogic/examples/data';
  if (fs.existsSync(dataDir)) {
    dataDir += '/';
    return dataDir;
  }

  dataDir = 'examples/data';
  if (fs.existsSync(dataDir)) {
    dataDir += '/';
    return dataDir;
  }

  throw new Error('cannot find data directory for example');
}

var queueRunner = {
    mode:  'waiting',
    queue: []  
};
function addScript(script) {
  if (queueRunner.mode === 'waiting' && queueRunner.queue.length === 0) {
    queueRunner.mode = 'running';
    script.run();
  } else {
    queueRunner.queue.push(script);
  }
};
function notifyQueue() {
  if (queueRunner.queue.length === 0) {
    if (queueRunner.mode !== 'waiting') {
      queueRunner.mode = 'waiting';
    }
    return;
  }
  var script = queueRunner.queue.shift();
  script.run();
};

function succeeded() {
  notifyQueue();
};
function failed(error) {
  notifyQueue();
};

module.exports = {
  restAdminConnection: {
    host:     testconfig.restAdminConnection.host,
    port:     examplePort,
    user:     testconfig.restAdminConnection.user,
    password: testconfig.restAdminConnection.password,
    authType: exampleAuthType
  },
  restReaderConnection: {
    host:     testconfig.restReaderConnection.host,
    port:     examplePort,
    user:     testconfig.restReaderConnection.user,
    password: testconfig.restReaderConnection.password,
    authType: exampleAuthType
  },
  restWriterConnection: {
    host:     testconfig.restWriterConnection.host,
    port:     examplePort,
    user:     testconfig.restWriterConnection.user,
    password: testconfig.restWriterConnection.password,
    authType: exampleAuthType
  },
  require:     locateRequire,
  pathToData:  pathToData,
  addScript:   addScript,
  succeeded:   succeeded,
  failed:      failed
};
