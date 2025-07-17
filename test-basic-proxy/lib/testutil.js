/*
* Copyright © 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/
'use strict';

const marklogic = require('../../');
const testconfig = require('../../etc/test-config.js');

const client = marklogic.createDatabaseClient(testconfig.restReaderConnection);

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