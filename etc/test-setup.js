/*
 * Copyright 2014-2019 MarkLogic Corporation
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
const fs        = require('fs');
const valcheck  = require('core-util-is');
const marklogic = require('../lib/marklogic.js');

const promptForAdmin = require('./test-setup-prompt.js');
const setupUsers     = require('./test-setup-users.js');

const testlib    = require('./test-lib.js');
const testconfig = require('./test-config.js');

const moduleFiles = [
  {
    uri:'/optic/test/masterDetail.tdex',
    collections:['http://marklogic.com/xdmp/tde'],
    contentType:'application/vnd.marklogic-tde+xml',
    permissions: [
      {'role-name':'app-user',                           capabilities:['read']},
      {'role-name':'app-builder',                        capabilities:['read']},
      {'role-name':testconfig.restReaderConnection.user, capabilities:['read']},
      {'role-name':testconfig.restAdminConnection.user,  capabilities:['read', 'update']}
    ],
    content:fs.createReadStream('./etc/data/masterDetail.tdex')
  },{
    uri:'/optic/test/musician.tdex',
    collections:['http://marklogic.com/xdmp/tde'],
    contentType:'application/vnd.marklogic-tde+xml',
    permissions: [
      {'role-name':'app-user',                           capabilities:['read']},
      {'role-name':'app-builder',                        capabilities:['read']},
      {'role-name':testconfig.restReaderConnection.user, capabilities:['read']},
      {'role-name':testconfig.restAdminConnection.user,  capabilities:['read', 'update']}
    ],
    content:fs.createReadStream('./etc/data/musician.tdex')
  },{
    uri:'/etc/optic/rowPostProcessors.sjs',
    contentType:'application/vnd.marklogic-javascript',
    permissions: [
      {'role-name':'app-user',                           capabilities:['read', 'execute']},
      {'role-name':'app-builder',                        capabilities:['read', 'execute']},
      {'role-name':testconfig.restReaderConnection.user, capabilities:['read', 'execute']},
      {'role-name':testconfig.restAdminConnection.user,  capabilities:['read', 'execute', 'update']}
    ],
    content:fs.createReadStream('./etc/data/rowPostProcessors.sjs')
  },{
    uri:'/etc/optic/employees.tdej',
    contentType:'application/json',
    collections:['http://marklogic.com/xdmp/tde'],
    permissions: [
      {'role-name':'app-user',                           capabilities:['read', 'execute']},
      {'role-name':'app-builder',                        capabilities:['read', 'execute']},
      {'role-name':testconfig.restReaderConnection.user, capabilities:['read', 'execute']},
      {'role-name':testconfig.restAdminConnection.user,  capabilities:['read', 'execute', 'update']}
    ],
    content:fs.createReadStream('./etc/data/employees.tdej')
  }];

const dataFiles = [
  {
    uri:'/optic/test/masterDetail.xml',
    collections:['/optic/test', '/schemas/inventory'],
    permissions: [
      {'role-name':'app-user',    capabilities:['read']},
      {'role-name':'app-builder', capabilities:['read', 'update']}
    ],
    content:fs.createReadStream('./etc/data/masterDetail.xml')
  },{
    uri:'/optic/test/tripleSets.xml',
    collections:['/optic/test', '/graphs/inventory'],
    permissions: [
      {'role-name':'app-user',    capabilities:['read']},
      {'role-name':'app-builder', capabilities:['read', 'update']}
    ],
    content:fs.createReadStream('./etc/data/tripleSets.xml')
  },{
    uri:'/optic/test/queryDoc1.json',
    collections:['/optic/test', '/optic/test1'],
    permissions: [
      {'role-name':'app-user',    capabilities:['read']},
      {'role-name':'app-builder', capabilities:['read', 'update']}
    ],
    content:{srchFood:'apples', srchNumber:2, srchLevel:20, srchCity:'Cairo',
      srchPoint: '15.25, 15.25',
      srchContainer:{srchColA:'common', srchColB:'outlier', srchColC:'common'}}
  },{
    uri:'/optic/test/queryDoc2.json',
    collections:['/optic/test', '/optic/test2'],
    permissions: [
      {'role-name':'app-user',    capabilities:['read']},
      {'role-name':'app-builder', capabilities:['read', 'update']}
    ],
    content:{srchFood:'banannas', srchNumber:3, srchLevel:30, srchCity:'Antioch',
      srchPoint: '25.25, 25.25',
      srchContainer:{srchColA:'common', srchColB:'common', srchColC:'outlier'}}
  },{
    uri:'/optic/test/queryDoc3.json',
    collections:['/optic/test', '/optic/test3'],
    permissions: [
      {'role-name':'app-user',    capabilities:['read']},
      {'role-name':'app-builder', capabilities:['read', 'update']}
    ],
    content:{srchFood:'citron', srchNumber:1, srchLevel:10, srchCity:'Bonn',
      srchPoint: '35.25, 35.25',
      srchContainer:{srchColA:'outlier', srchColB:'common', srchColC:'common'}}
  },{
    uri:'/optic/test/musician1.json',
    collections:['/optic/test', '/optic/music'],
    permissions: [
      {'role-name':'app-user',    capabilities:['read']},
      {'role-name':'app-builder', capabilities:['read', 'update']}
    ],
    content:{musician:{lastName:'Armstrong', firstName:'Louis', dob:'1901-08-04', instrument:['trumpet', 'vocal']}}
  },{
    uri:'/optic/test/albums1.json',
    collections:['/optic/test', '/optic/music'],
    permissions: [
      {'role-name':'app-user',    capabilities:['read']},
      {'role-name':'app-builder', capabilities:['read', 'update']}
    ],
    content:{style:['dixieland'], albums:[
      {triple:{subject:'/optic/test/albums1_1', predicate:'/optic/test/albumName',   object:'Hot Fives'}},
      {triple:{subject:'/optic/test/albums1_1', predicate:'/optic/test/musicianUri', object:'/optic/test/musician1.json'}},
      {triple:{subject:'/optic/test/albums1_2', predicate:'/optic/test/albumName',   object:'Porgy and Bess'}},
      {triple:{subject:'/optic/test/albums1_2', predicate:'/optic/test/musicianUri', object:'/optic/test/musician1.json'}}
    ]}
  },{
    uri:'/optic/test/musician2.json',
    collections:['/optic/test', '/optic/music'],
    permissions: [
      {'role-name':'app-user',    capabilities:['read']},
      {'role-name':'app-builder', capabilities:['read', 'update']}
    ],
    content:{musician:{lastName:'Byron', firstName:'Don', dob:'1958-11-08', instrument:['clarinet', 'saxophone']}}
  },{
    uri:'/optic/test/albums2.json',
    collections:['/optic/test', '/optic/music'],
    permissions: [
      {'role-name':'app-user',    capabilities:['read']},
      {'role-name':'app-builder', capabilities:['read', 'update']}
    ],
    content:{style:['avantgarde'], albums:[
      {triple:{subject:'/optic/test/albums2_1', predicate:'/optic/test/albumName',   object:'Four Thoughts on Marvin Gaye'}},
      {triple:{subject:'/optic/test/albums2_1', predicate:'/optic/test/musicianUri', object:'/optic/test/musician2.json'}},
      {triple:{subject:'/optic/test/albums2_2', predicate:'/optic/test/albumName',   object:'A Ballad For Many'}},
      {triple:{subject:'/optic/test/albums2_2', predicate:'/optic/test/musicianUri', object:'/optic/test/musician2.json'}}
    ]}
  },{
    uri:'/optic/test/musician3.json',
    collections:['/optic/test', '/optic/music'],
    permissions: [
      {'role-name':'app-user',    capabilities:['read']},
      {'role-name':'app-builder', capabilities:['read', 'update']}
    ],
    content:{musician:{lastName:'Coltrane', firstName:'John', dob:'1926-09-23', instrument:['saxophone']}}
  },{
    uri:'/optic/test/albums3.json',
    collections:['/optic/test', '/optic/music'],
    permissions: [
      {'role-name':'app-user',    capabilities:['read']},
      {'role-name':'app-builder', capabilities:['read', 'update']}
    ],
    content:{style:['avantgarde'], albums:[
      {triple:{subject:'/optic/test/albums3_1', predicate:'/optic/test/albumName',   object:'Impressions'}},
      {triple:{subject:'/optic/test/albums3_1', predicate:'/optic/test/musicianUri', object:'/optic/test/musician3.json'}},
      {triple:{subject:'/optic/test/albums3_2', predicate:'/optic/test/albumName',   object:'Crescent'}},
      {triple:{subject:'/optic/test/albums3_2', predicate:'/optic/test/musicianUri', object:'/optic/test/musician3.json'}}
    ]}
  },{
    uri:'/optic/test/musician4.json',
    collections:['/optic/test', '/optic/music'],
    permissions: [
      {'role-name':'app-user',    capabilities:['read']},
      {'role-name':'app-builder', capabilities:['read', 'update']}
    ],
    content:{musician:{lastName:'Davis', firstName:'Miles', dob:'1926-05-26', instrument:['trumpet']}}
  },{
    uri:'/optic/test/albums4.json',
    collections:['/optic/test', '/optic/music'],
    permissions: [
      {'role-name':'app-user',    capabilities:['read']},
      {'role-name':'app-builder', capabilities:['read', 'update']}
    ],
    content:{style:['modal'], albums:[
      {triple:{subject:'/optic/test/albums4_1', predicate:'/optic/test/albumName',   object:'Kind of Blue'}},
      {triple:{subject:'/optic/test/albums4_1', predicate:'/optic/test/musicianUri', object:'/optic/test/musician4.json'}},
      {triple:{subject:'/optic/test/albums4_2', predicate:'/optic/test/albumName',   object:'In a Silent Way'}},
      {triple:{subject:'/optic/test/albums4_2', predicate:'/optic/test/musicianUri', object:'/optic/test/musician4.json'}}
    ]}
  }];

promptForAdmin(createManager);

function createManager(adminUser, adminPassword) {
  testconfig.manageAdminConnection.user     = adminUser;
  testconfig.manageAdminConnection.password = adminPassword;

  const manageClient =
    marklogic.createDatabaseClient(testconfig.manageAdminConnection);
  const manager      = testlib.createManager(manageClient);

  setupUsers(manager, setup);
}
function createAxis(manager, name) {
  return manager.post({
    endpoint: '/manage/v2/databases/'+testconfig.testServerName+'/temporal/axes',
    body: {
      'axis-name': name+'Time',
      'axis-start': {
        'element-reference': {
          'namespace-uri': '',
          'localname': name+'StartTime',
          'scalar-type': 'dateTime'
          }
        },
      'axis-end': {
        'element-reference': {
          'namespace-uri': '',
          'localname': name+'EndTime',
          'scalar-type': 'dateTime'
          }
        }
      }
    }).result();
}
function setup(manager) {
  console.log('checking for '+testconfig.testServerName);
  manager.get({
    endpoint: '/v1/rest-apis/'+testconfig.testServerName
    }).
  result(function(response) {
    if (response.statusCode === 404) {
      console.log('creating database and REST server for '+testconfig.testServerName);
      manager.post({
        endpoint: '/v1/rest-apis',
        body: {
          'rest-api': {
            name:               testconfig.testServerName,
            group:              'Default',
            database:           testconfig.testServerName,
            'modules-database': testconfig.testServerName+'-modules',
            port:               testconfig.restPort
            }
          }
        }).
      result(function(response) {
        if (response.statusCode === 201) {
          console.log('getting default indexes for '+testconfig.testServerName);
          manager.get({
            endpoint: '/manage/v2/databases/'+testconfig.testServerName+'/properties'
            }).result().
          then(function(response) {
            let indexName = null;
            let indexType = null;
            let indexdef  = null;
            let i         = null;

            const lexiconTest = {
                defaultWordKey: true,
                taggedWordKey:  true
                };
            let elementWordLexicon = response.data['element-word-lexicon'];
            let lexers = [];
            if (valcheck.isNullOrUndefined(elementWordLexicon)) {
              elementWordLexicon = [];
              lexers             = Object.keys(lexiconTest);
            } else {
              elementWordLexicon.forEach(function(index){
                indexName = index.localname;
                if (!valcheck.isUndefined(lexiconTest[indexName])) {
                  lexiconTest[indexName] = false;
                }
              });
              lexers = Object.keys(lexiconTest).filter(function(indexName){
                return (lexiconTest[indexName] !== false);
              });
            }

            for (i=0; i < lexers.length; i++) {
              indexName = lexers[i];
              indexdef  = {
                  collation:       'http://marklogic.com/collation/',
                  'namespace-uri': '',
                  localname:       indexName,
                };
              elementWordLexicon.push(indexdef);
            }

            const rangeTest = {
                rangeKey1:       'string',
                rangeKey2:       'string',
                rangeKey3:       'int',
                rangeKey4:       'int',
                rangeKey5:       'int',
                srchCity:        'string',
                srchLevel:       'int',
                srchNumber:      'int',
                systemStartTime: 'dateTime',
                systemEndTime:   'dateTime',
                validStartTime:  'dateTime',
                validEndTime:    'dateTime'
                };
            let rangeElementIndex = response.data['range-element-index'];
            let rangers = [];
            if (valcheck.isNullOrUndefined(rangeElementIndex)) {
              rangeElementIndex = [];
              rangers           = Object.keys(rangeTest);
            } else {
              rangeElementIndex.forEach(function(index){
                indexName = index.localname;
                if (!valcheck.isUndefined(rangeTest[indexName])) {
                  rangeTest[indexName] = false;
                }
              });
              rangers = Object.keys(rangeTest).filter(function(indexName){
                return (rangeTest[indexName] !== false);
              });
            }

            for (i=0; i < rangers.length; i++) {
              indexName = rangers[i];
              indexType = rangeTest[indexName];
              indexdef = {
                  'scalar-type':           indexType,
                  collation:               (indexType === 'string') ?
                      'http://marklogic.com/collation/' : '',
                  'namespace-uri':         '',
                  localname:               indexName,
                  'range-value-positions': false,
                  'invalid-values':        'ignore'
                };
              rangeElementIndex.push(indexdef);
            }

            const pointGeospatialIndex = {
                'namespace-uri':         '',
                localname:               'point',
                'coordinate-system':     'wgs84',
                'range-value-positions': false,
                'point-format':          'point',
                'invalid-values':        'ignore'
              };
            let geospatialElementIndex = response.data['geospatial-element-index'];

            if (valcheck.isNullOrUndefined(geospatialElementIndex)) {
              geospatialElementIndex = [pointGeospatialIndex];
            } else if (geospatialElementIndex.some(
                makeIndexTester(pointGeospatialIndex.localname)
                )) {
              geospatialElementIndex = null;
            } else {
              geospatialElementIndex.push(pointGeospatialIndex);
            }

            const body = {
                'collection-lexicon': true,
                'uri-lexicon':        true,
                'triple-index':       true,
                'schema-database':    testconfig.testServerName+'-modules',
                };

            if (valcheck.isArray(elementWordLexicon) && elementWordLexicon.length > 0) {
              body['element-word-lexicon'] = elementWordLexicon;
            }
            if (valcheck.isArray(rangeElementIndex) && rangeElementIndex.length > 0) {
              body['range-element-index'] = rangeElementIndex;
            }
            if (valcheck.isArray(geospatialElementIndex) &&
                geospatialElementIndex.length > 0) {
              body['geospatial-element-index'] = geospatialElementIndex;
            }

            console.log('adding custom indexes for '+testconfig.testServerName);
            return manager.put({
              endpoint: '/manage/v2/databases/'+testconfig.testServerName+'/properties',
              params:   {
                format: 'json'
                },
              body:        body,
              hasResponse: true
              }).result();
            }).
          then(function(response) {
            console.log('checking system temporal axis');
            return manager.get({
              endpoint: '/manage/v2/databases/'+testconfig.testServerName+'/temporal/axes/systemTime'
              }).result();
          }).
          then(function(response) {
            if (response.statusCode < 400) {
              return this;
            }
            console.log('creating system temporal axis');
            return createAxis(manager, 'system');
          }).
          then(function(response) {
            console.log('checking valid temporal axis');
            return manager.get({
              endpoint: '/manage/v2/databases/'+testconfig.testServerName+'/temporal/axes/validTime'
              }).result();
          }).
          then(function(response) {
            if (response.statusCode < 400) {
              return this;
            }
            console.log('creating valid temporal axis');
            return createAxis(manager, 'valid');
            }).
          then(function(response) {
            console.log('checking temporal collection');
            return manager.get({
              endpoint: '/manage/v2/databases/'+testconfig.testServerName+
                '/temporal/collections/temporalCollection'
              }).result();
            }).
          then(function(response) {
            if (response.statusCode < 400) {
              return this;
            }
            console.log('creating temporal collection');
            return manager.post({
              endpoint: '/manage/v2/databases/'+testconfig.testServerName+'/temporal/collections',
              body: {
                'collection-name': 'temporalCollection',
                'system-axis': 'systemTime',
                'valid-axis': 'validTime',
                option: ['updates-admin-override']
                }
              }).result();
            }).
          then(function(response) {
            return manager.get({
              endpoint: '/manage/v2/databases/'+testconfig.testServerName+
              '/temporal/collections/lsqt/properties?collection=temporalCollection'
              }).result();
            }).
          then(function(response) {
            // 2017-10-24: Commenting out, LSQT enablement required for LSQT testing
            // if (response.statusCode < 400) {
            //   return this;
            // }
            console.log('configuring LSQT');
            return manager.put({
              endpoint: '/manage/v2/databases/'+testconfig.testServerName+
                '/temporal/collections/lsqt/properties?collection=temporalCollection',
              body: {
                'lsqt-enabled': true,
                automation: {
                  enabled: false
                  }
                }
              }).result();
            }).
          then(function(response){
            console.log('setting up modules database resources');
            const modDb = marklogic.createDatabaseClient({
              database: testconfig.testServerName+'-modules',
              host:     testconfig.manageAdminConnection.host,
              port:     testconfig.manageAdminConnection.port,
              user:     testconfig.manageAdminConnection.user,
              password: testconfig.manageAdminConnection.password,
              authType: testconfig.manageAdminConnection.authType
              });
            return modDb.documents.write(moduleFiles).result();
            }).
/* TODO: advance LSQT after creating documents
          then(function(response) {
            const evalConnection = {
                host:     testconfig.testHost,
                port:     testconfig.restPort,
                user:     testconfig.manageAdminConnection.user,
                password: testconfig.manageAdminConnection.password,
                authType: testconfig.restAuthType
            };
            const evalClient = marklogic.createDatabaseClient(evalConnection);
            return evalClient.xqueryEval(
                'xquery version "1.0-ml"; '+
                'import module namespace temporal = "http://marklogic.com/xdmp/temporal" '+
                '    at "/MarkLogic/temporal.xqy"; '+
                'temporal:advance-lsqt("temporalCollection")'
                ).result();
            }).
 */
          then(function(response){
              console.log('setting up sample documents');
              const db = marklogic.createDatabaseClient({
                host:     testconfig.restWriterConnection.host,
                port:     testconfig.restWriterConnection.port,
                user:     testconfig.restWriterConnection.user,
                password: testconfig.restWriterConnection.password,
                authType: testconfig.restWriterConnection.authType
              });
              return db.documents.write(dataFiles).result();
            }).
          then(function(response) {
              console.log(testconfig.testServerName+' setup succeeded');
            }).
          catch(function(err) {
              console.log('failed to set up '+testconfig.testServerName+' server:\n'+
                  JSON.stringify(err, null, 2));
              process.exit(1);
            });
        } else {
          console.log(testconfig.testServerName+' setup failed with HTTP status: '+response.statusCode);
          console.log(response.data);
          process.exit(1);
        }
      });
    } else {
      console.log(testconfig.testServerName+' test server is available on port '+
          JSON.parse(response.data).port);
    }
  });
}

function makeIndexTester(testLocalname) {
  return function indexTester(index) {
    return (index.localname === testLocalname);
  };
}
