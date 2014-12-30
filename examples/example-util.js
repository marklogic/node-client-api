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
var testconfig = require('../etc/test-config.js');

var examplePort     = 8000; // change to 8015 to use the test database
var exampleAuthType = 'DIGEST';

var listeners = {
    mode:  'waiting',
    queue: []  
};
function addListener(listener) {
  if (listeners.mode === 'waiting' && listeners.queue.length === 0) {
    listeners.mode = 'running';
    listener();
  } else {
    listeners.queue.push(listener);
  }
};
function notifyListener() {
  if (listeners.queue.length === 0) {
    if (listeners.mode !== 'waiting') {
      listeners.mode = 'waiting';
    }
    return;
  }
  var listener = listeners.queue.shift();
  listener();
};

function succeeded() {
  console.log('done');

  notifyListener();
};
function failed(error) {
  console.log(JSON.stringify(error));

  notifyListener();
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
  addListener: addListener,
  succeeded:   succeeded,
  failed:      failed
};
