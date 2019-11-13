/*
 * Copyright 2019 MarkLogic Corporation
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
'use strict';

const marklogic = require('../../');
const testconfig = require('../../etc/test-config.js');

const client = marklogic.createDatabaseClient(testconfig.restReaderConnection);
/* TODO: DELETE
const client = marklogic.createDatabaseClient({
  host:'localhost', port:8016, authType:'DIGEST', user:'rest-reader', password:'x'
});
 */

const adminClient = marklogic.createDatabaseClient({
  host:     testconfig.restReaderConnection.host,
  port:     testconfig.restReaderConnection.port,
  authType: testconfig.restReaderConnection.authType,
  user:     'admin',
  password: 'admin'
});

function makeClient() {
  return client;
}

function makeAdminClient() {
  return adminClient;
}

module.exports = {
  makeClient:      makeClient,
  makeAdminClient: makeAdminClient
};