/*
 * Copyright 2015 MarkLogic Corporation
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

var util = require('../node_modules/core-util-is/lib/util.js');

var fs = require('fs');
var valcheck = require('core-util-is');

var marklogic = require('../lib/marklogic.js');
var testlib   = require('./testlib.js');

var clientConnectdef = require('./connectdef.js');
var testName         = clientConnectdef.name;
var planServerdef    = clientConnectdef.plan;

var modDb = marklogic.createDatabaseClient({
  database: testName+'Modules',
  host:     planServerdef.host,
  port:     planServerdef.port,
  user:     'admin',
  password: 'admin',
  authType: planServerdef.authType
});
var manager = testlib.createManager(marklogic.createDatabaseClient({
  host:     planServerdef.host,
  port:     8002,
  user:     'admin',
  password: 'admin',
  authType: planServerdef.authType
  }));

console.log('checking for '+testName);
manager.get({
  endpoint: '/v1/rest-apis/'+testName
  })
.result(function(response) {
  if (response.statusCode === 404) {
    console.log(testName+' not found - nothing to delete');
  } else {
    console.log('removing database and REST server for '+testName);
    manager.put({
      endpoint: '/manage/v2/databases/'+testName+'/properties',
      params: {
        format: 'json'
      },
      body: {
        'schema-database': 'Schemas'
      },
      hasResponse: true
    }).result()
    .then(function(response) {
      return manager.post({
        endpoint:    '/manage/v2/databases/'+testName,
        contentType: 'application/json',
        accept:      'application/json',
        body:        {'operation': 'clear-database'}
        }).result();
      })
    .then(function(response) {
      return manager.post({
        endpoint:    '/manage/v2/databases/'+testName+'Modules',
        contentType: 'application/json',
        accept:      'application/json',
        body:        {'operation': 'clear-database'}
        }).result();
      })
    .then(function(response) {
      return manager.remove({
        endpoint: '/manage/v2/users/rest-evaluator'
      }).result();
    })
    .then(function(response) {
      return manager.remove({
        endpoint: '/manage/v2/users/rest-reader-optic'
      }).result();
    })
    .then(function(response) {
      return manager.remove({
        endpoint: '/manage/v2/roles/rest-evaluator'
      }).result();
    })
    .then(function(response) {
      return       manager.remove({
        endpoint: '/v1/rest-apis/'+testName,
        accept:   'application/json',
        params:   {include: ['content', 'modules']}
        }).result();
      })
    .then(function(response) {
        console.log('teardown succeeded - restart the server');
      })
    .catch(function(error) {
        console.log('failed to tear down '+testName+' server:\n'+
            JSON.stringify(error, null, 2));
      });
    }
});

