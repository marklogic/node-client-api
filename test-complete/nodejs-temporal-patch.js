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
var should = require('should');

var testconfig = require('../etc/test-config-qa.js');
var testlib    = require('../etc/test-lib.js');

var marklogic = require('../');

testconfig.manageAdminConnection.user     = "admin";
testconfig.manageAdminConnection.password = "admin";
var adminClient = marklogic.createDatabaseClient(testconfig.manageAdminConnection);
var adminManager = testlib.createManager(adminClient);

var db = marklogic.createDatabaseClient(testconfig.restWriterConnection);
var dbReader = marklogic.createDatabaseClient(testconfig.restReaderConnection);
var dbAdmin = marklogic.createDatabaseClient(testconfig.restAdminConnection);
var dbWriter = marklogic.createDatabaseClient(testconfig.restWriterConnection);
var q = marklogic.queryBuilder;
var p = marklogic.patchBuilder;

describe('Temporal patch test', function() {
  
  var docuri = 'temporalDoc.json'; 
 
  before(function(done) {
    this.timeout(10000);
    dbWriter.documents.write({
      uri: docuri,
      collections: ['coll0', 'coll1'],
      temporalCollection: 'temporalCollection',
      contentType: 'application/json',
      quality: 10,
      permissions: [
        {'role-name':'app-user', capabilities:['read']},
        {'role-name':'app-builder', capabilities:['read', 'update', 'execute']}
      ],
      properties: {prop1:'foo updated', prop2:50},
      content: {
        'System': {
          'systemStartTime' : "",
          'systemEndTime' : "",
        },
        'Valid': {
          'validStartTime': "2003-01-01T00:00:00",
          'validEndTime': "2008-12-31T23:59:59"
        },
        'Address': "888 Skyway Park",
        'uri': "javaSingleDoc1.json",
        id: 12, 
        name: 'Jason'
      }
    }).result(function(response){done();}, done);
  });

  // Cannot set collections on a temporal document
  it('should not apply the patch with collections', function(done){
    dbWriter.documents.patch({
      uri: docuri,
      categories: ['metadata'],
      operations: [
        p.insert('array-node("collections")', 'last-child', 'addedCollection')
        // p.replace('quality', 24)
      ]
    }).result(function(response) {
        ////console.log(JSON.stringify(response, null, 4));
        response.uri.should.equal(docuri);
        done();
    }, function(err) {
        err.statusCode.should.equal(400);  // Bad request
        done();
    },
    done);
  });

  // Cannot set quality on a temporal document
  it('should not apply the patch with quality', function(done){
    dbWriter.documents.patch({
      uri: docuri,
      categories: ['metadata'],
      operations: [
        p.replace('quality', 24)
      ]
    }).result(function(response) {
        response.uri.should.equal(docuri);
        done();
    }, function(err) {
        err.statusCode.should.equal(400);  // Bad request
        done();
    },
    done);
  });

  // Cannot patch content on a temporal document
  it('should not apply the patch with content', function(done){
    dbWriter.documents.patch(docuri,
      p.pathLanguage('jsonpath'),
      p.replace('$.name', 'Bourne')
    ).result(function(response) {
        ////console.log(JSON.stringify(response, null, 4));
        response.uri.should.equal(docuri);
        done();
    }, function(err) {
        err.statusCode.should.equal(400);  // Bad request
        done();
    },
    done);
  });

  // Properties of a temporal document can be set
  it('should apply the patch with properties', function(done){
    dbWriter.documents.patch({
      uri: docuri,
      categories: ['metadata'],
      operations: [
        p.insert('properties', 'last-child', {'newPropKey': 'Newly Inserted Property'})
        // p.replace('quality', 24)
      ]
    }).result(function(response) {
        ////console.log(JSON.stringify(response, null, 4));
        response.uri.should.equal(docuri);
        done();
    }, done);
  });

  /*after(function(done) {
   return adminManager.post({
      endpoint: '/manage/v2/databases/' + testconfig.testServerName,
      contentType: 'application/json',
      accept: 'application/json',
      body:   {'operation': 'clear-database'}
    }).result().then(function(response) {
      if (response >= 400) {
        console.log(response);
      } 
      done();
    }, function(err) {
      console.log(err); done();
    },
    done);
  });*/

  after(function(done) {
    dbAdmin.documents.removeAll({
      all: true
    }).
    result(function(response) {
      done();
    }, done);
  });

});
