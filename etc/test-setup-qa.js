/*
 * Copyright 2014-2017 MarkLogic Corporation
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

//var promptForAdmin = require('./test-setup-prompt.js');
var setupUsers     = require('./test-setup-users.js');

var testlib    = require('./test-lib.js');
var testconfig = require('./test-config-qa.js');

//promptForAdmin(createManager);
createManager('admin', 'admin');

function createManager(adminUser, adminPassword) {
  testconfig.manageAdminConnection.user     = adminUser;
  testconfig.manageAdminConnection.password = adminPassword;

  var manageClient =
    marklogic.createDatabaseClient(testconfig.manageAdminConnection);
  var manager      = testlib.createManager(manageClient);

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
            var indexName = null;
            var indexType = null;
            var indexdef  = null;
            var i         = null;

            var elementWordLexicon = response.data['element-word-lexicon'];
            var lexiconTest = {
                defaultWordKey: true,
                taggedWordKey:  true,
                otherKey:       true
                };

            var lexers = [];
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

            var rangeElementIndex = response.data['range-element-index'];

            var rangeTest = {
                rangeKey1:       'string',
                rangeKey2:       'string',
                rangeKey3:       'int',
                rangeKey4:       'int',
                systemStartTime: 'dateTime',
                systemEndTime:   'dateTime',
                validStartTime:  'dateTime',
                validEndTime:    'dateTime',
                popularity:      'int',
                amt:             'double',
                score:           'double',
                rate:            'int',
                datetime:            'dateTime'
                };
            var rangers = [];
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
            var body = {
                'collection-lexicon':   true,
                'triple-index':         true,
                'schema-database':      testconfig.testServerName+'-modules',
                'range-path-index': [
                  { 
                    'scalar-type': 'decimal',
                    'path-expression': 'price/amt',
                    collation: '',
                    'range-value-positions': false,
                    'invalid-values': 'reject' 
                  }
                ],
                'geospatial-path-index': [
                  {
                    'path-expression': 'gElemChildParent/gElemChildPoint',
                    'coordinate-system': 'wgs84',
                    'point-format': 'point',
                    'range-value-positions': false,
                    'invalid-values': 'reject'
                  }
                ],
                'geospatial-element-index' : [
                  { 
                    'namespace-uri': '',
                    localname: 'gElemPoint',
                    'coordinate-system': 'wgs84',
                    'point-format': 'point',
                    'range-value-positions': false,
                    'invalid-values': 'reject' 
                  },
                  { 
                    'namespace-uri': '',
                    localname: 'gElemPointWgs84Double',
                    'coordinate-system': 'wgs84/double',
                    'point-format': 'point',
                    'range-value-positions': false,
                    'invalid-values': 'reject' 
                  }
                ],
                'geospatial-element-child-index': [ 
                  {  
                    'parent-namespace-uri': '',
                    'parent-localname': 'gElemChildParent',
                    'namespace-uri': '',
                    localname: 'gElemChildPoint',
                    'coordinate-system': 'wgs84',
                    'point-format': 'point',
                    'range-value-positions': false,
                    'invalid-values': 'reject' 
                  }, 
                  {  
                    'parent-namespace-uri': '',
                    'parent-localname': 'gElemChildParentEtrs89Double',
                    'namespace-uri': '',
                    localname: 'gElemChildPointEtrs89Double',
                    'coordinate-system': 'etrs89/double',
                    'point-format': 'point',
                    'range-value-positions': false,
                    'invalid-values': 'reject' 
                  } 
                ],
                'geospatial-element-pair-index': [ 
                  { 
                    'parent-namespace-uri': '',
                    'parent-localname': 'gElemPair',
                    'latitude-namespace-uri': '',
                    'latitude-localname': 'latitude',
                    'longitude-namespace-uri': '',
                    'longitude-localname': 'longitude',
                    'coordinate-system': 'wgs84',
                    'range-value-positions': false,
                    'invalid-values': 'reject' 
                  }, 
                  { 
                    'parent-namespace-uri': '',
                    'parent-localname': 'gElemPairRawDouble',
                    'latitude-namespace-uri': '',
                    'latitude-localname': 'latitudeRawDouble',
                    'longitude-namespace-uri': '',
                    'longitude-localname': 'longitudeRawDouble',
                    'coordinate-system': 'raw/double',
                    'range-value-positions': false,
                    'invalid-values': 'reject' 
                  } 
                ],
                'geospatial-element-attribute-pair-index': [ 
                  { 
                    'parent-namespace-uri': '',
                    'parent-localname': 'gAttrPair',
                    'latitude-namespace-uri': '',
                    'latitude-localname': 'latitude',
                    'longitude-namespace-uri': '',
                    'longitude-localname': 'longitude',
                    'coordinate-system': 'wgs84',
                    'range-value-positions': false,
                    'invalid-values': 'reject' 
                  } 
                ],
                'geospatial-region-path-index': [
                  {
                    'path-expression': '/root/item/point',
                    'coordinate-system': 'wgs84',
                    'geohash-precision': 1,
                    'invalid-values': 'reject'
                  },
                  {
                    'path-expression': '/root/item/linestring',
                    'coordinate-system': 'wgs84/double',
                    'geohash-precision': 2,
                    'invalid-values': 'ignore'
                  },
                  {
                    'path-expression': '/root/item/circle',
                    'coordinate-system': 'wgs84/double',
                    'geohash-precision': 1,
                    'invalid-values': 'reject'
                  },
                  {
                    'path-expression': '/root/item/circle',
                    'coordinate-system': 'wgs84',
                    'geohash-precision': 1,
                    'invalid-values': 'reject'
                  },
                  {
                    'path-expression': '/root/item/box',
                    'coordinate-system': 'wgs84/double',
                    'geohash-precision': 2,
                    'invalid-values': 'ignore'
                  },
                  {
                    'path-expression': '/root/item/polygon',
                    'coordinate-system': 'wgs84',
                    'geohash-precision': 3,
                    'invalid-values': 'reject'
                  },
                  {
                    'path-expression': '/root/item/complex-polygon',
                    'coordinate-system': 'wgs84',
                    'geohash-precision': 1,
                    'invalid-values': 'ignore'
                  }
                ]
            };
            if (valcheck.isArray(elementWordLexicon) && elementWordLexicon.length > 0) {
              body['element-word-lexicon'] = elementWordLexicon;
            }
            if (valcheck.isArray(rangeElementIndex) && rangeElementIndex.length > 0) {
              body['range-element-index'] = rangeElementIndex;
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
            return manager.get({
              endpoint: '/manage/v2/databases/'+testconfig.testServerName+'/temporal/axes/systemTime'
              }).result();
          }).
          then(function(response) {
            if (response.statusCode < 400) {
              return this;
            }
            return createAxis(manager, 'system');
          }).
          then(function(response) {
            return manager.get({
              endpoint: '/manage/v2/databases/'+testconfig.testServerName+'/temporal/axes/validTime'
              }).result();
          }).
          then(function(response) {
            if (response.statusCode < 400) {
              return this;
            }
            return createAxis(manager, 'valid');
            }).
          then(function(response) {
            return manager.get({
              endpoint: '/manage/v2/databases/'+testconfig.testServerName+
                '/temporal/collections/temporalCollection'
              }).result();
            }).
          then(function(response) {
            if (response.statusCode < 400) {
              return this;
            }
            return manager.post({
              endpoint: '/manage/v2/databases/'+testconfig.testServerName+'/temporal/collections',
              body: {
                'collection-name': 'temporalCollection',
                'system-axis': 'systemTime',
                'valid-axis': 'validTime',
                'option': ['updates-safe']
                }
              }).result();
            }).
          then(function(response) {
            return manager.get({
              endpoint: '/manage/v2/databases/'+testconfig.testServerName+
              '/temporal/collections/temporalCollectionLsqt'
              }).result();
            }).
          then(function(response) {
            if (response.statusCode < 400) {
              return this;
            }
            return manager.post({
              endpoint: '/manage/v2/databases/'+testconfig.testServerName+
                '/temporal/collections',
              body: {
                'collection-name': 'temporalCollectionLsqt',
                'system-axis': 'systemTime',
                'valid-axis': 'validTime',
                'option': ['updates-safe']
                }
              }).result();
            }).
          then(function(response) {
            return manager.put({
              endpoint: '/manage/v2/databases/'+testconfig.testServerName+'/temporal/collections/lsqt/properties?collection=temporalCollectionLsqt',
              body: {
                "lsqt-enabled": true,
                "automation": {
                  "enabled": true
                }
              }
              }).result();
            }).
          then(function(response) {
            console.log(testconfig.testServerName+' setup succeeded');
            });
        } else {
          console.log(testconfig.testServerName+' setup failed with HTTP status: '+response.statusCode);
          console.log(response.data);        
        }
      });
    } else {
      console.log(testconfig.testServerName+' test server is available on port '+
          JSON.parse(response.data).port);
    }
  });
}
