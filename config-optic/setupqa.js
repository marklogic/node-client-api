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

var testLoad = require('./loaddata.js');
var testUser = require('./userconfig.js'); 

var db = marklogic.createDatabaseClient({
  host:     planServerdef.host,
  port:     planServerdef.port,
  user:     'admin',
  password: 'admin',
  authType: planServerdef.authType
});
var dbMod = marklogic.createDatabaseClient({
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
var check = manager.get({
  endpoint: '/v1/rest-apis/'+testName
  }).result();
check.then(function(response) {
  if (response.statusCode !== 404) {
    return check;
  }

  console.log('creating database and REST server for '+testName);
  return manager.post({
    endpoint: '/v1/rest-apis',
    body: {
      'rest-api': {
        name:               testName,
        group:              'Default',
        database:           testName,
        'modules-database': testName+'Modules',
        port:               planServerdef.port
        }
      }
    }).result();
  })
.then(function(response){  
  console.log('setting up rest eval role');
  return testUser.addRestEvalRole(manager).result();
})
.then(function(response){
  console.log('setting up rest eval user');
  return testUser.addRestEvalUser(manager).result();
})
.then(function(response){
  console.log('setting up rest reader user');
  return testUser.addRestReaderUser(manager).result();
})
.then(function(response){
  console.log('setting up tde template on module database');
  return testLoad.writeDocumentsToMod(dbMod).result();
})
.then(function(response){
  console.log('setting up sample documents');
  return testLoad.writeDocuments(db).result();
})
.then(function(response){
  console.log('setting up graphs1');
  return testLoad.writeGraphs1(db).result();
})
.then(function(response){
  console.log('setting up graphs2');
  return testLoad.writeGraphs2(db).result();
})
.then(function(response){
  console.log('setting up database setup file');
  return db.config.extlibs.write({
    path:'/ext/optic/test/databaseconfig.sjs', contentType:'application/javascript', source:fs.createReadStream('./config-optic/databaseconfig.sjs')
  }).result();
})
.then(function(response) {
  console.log('setting up database configuration');
  var dbEval = marklogic.createDatabaseClient({
    host:     planServerdef.host,
    port:     planServerdef.port,
    user:     'rest-evaluator',
    password: 'x',
    authType: planServerdef.authType
  });
  return dbEval.invoke('/ext/optic/test/databaseconfig.sjs').result();
})
.then(function(response){
  console.log('setup done');
  })
.catch(function(error){
  console.log('error');
  console.log(util.inspect(error, {depth:null}));
  });
