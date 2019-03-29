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
var should = require('should');

var testlib    = require('../etc/test-lib.js');
var testconfig = require('../etc/test-config-qa.js');

var marklogic = require('../');

testconfig.manageAdminConnection.user     = "admin";
testconfig.manageAdminConnection.password = "admin";
var adminClient = marklogic.createDatabaseClient(testconfig.manageAdminConnection);
var adminManager = testlib.createManager(adminClient);
var db = marklogic.createDatabaseClient(testconfig.restTemporalConnection);
var dbReader = marklogic.createDatabaseClient(testconfig.restReaderConnection);
var dbAdmin = marklogic.createDatabaseClient(testconfig.restAdminConnection);
var q = marklogic.queryBuilder;
var temporalCollectionName = 'temporalCollectionLsqt';

describe('LSQT query (lsqtQuery) Test', function() {

  var docuri = 'temporalDoc.json';

  before(function(done) {
   adminManager.put({
      endpoint: '/manage/v2/databases/'+testconfig.testServerName+'/temporal/collections/lsqt/properties?collection=temporalCollectionLsqt',
      body: {
        "lsqt-enabled": true,
        "automation": {
          "enabled": true
        }
      }
    }).result(function(response){done();})
    .catch(done);
  });

  it('should write the document content', function(done) {
    db.documents.write({
      uri: docuri,
      collections: ['coll0', 'coll1'],
      temporalCollection: temporalCollectionName,
      contentType: 'application/json',
      quality: 10,
      permissions: [
        {'role-name':'app-user', capabilities:['read']},
        {'role-name':'app-builder', capabilities:['read', 'update']}
      ],
      properties: {prop1:'foo', prop2:25},
      content: {
        'System': {
          'systemStartTime' : "",
          'systemEndTime' : "",
        },
        'Valid': {
          'validStartTime': "2001-01-01T00:00:00Z",
          'validEndTime': "2011-12-31T23:59:59Z"
        },
        'Address': "999 Skyway Park",
        'uri': "javaSingleDoc1.json",
        id: 12,
        name: 'Jason'
      },
      systemTime: '2005-01-01T00:00:01Z'
    }
    ).result(function(response){done();}, done);
  });

  /*it('should update the document content', function(done) {
    db.documents.write({
      uri: docuri,
      collections: ['coll0', 'coll1'],
      temporalCollection: temporalCollectionName,
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
      },
      systemTime: '2010-01-01T00:00:01'
    }).result(function(response){done();}, done);
  });*/


  it('should wait for lsqt advancement', function(done) {
    setTimeout(function() {
      done();
    }, 3000);
  });

  it('should not be able to do lsqt query: ', function(done) {
    db.documents.query(
      q.where(
        q.lsqtQuery(temporalCollectionName, '2007-01-01T00:00:01Z')
        )
      )
      .result(function(response) {
        response.should.equal('SHOULD HAVE FAILED');
        done();
      }, function(error) {
        //console.log(JSON.stringify(error, null, 2));
        error.body.errorResponse.messageCode.should.equal('TEMPORAL-GTLSQT');
        done();
      });
  });

  it('should be able to do lsqt query: ', function(done) {
    db.documents.query(
      q.where(
        q.lsqtQuery(temporalCollectionName, '2005-01-01T00:00:01Z')
        )
      )
      .result(function(response) {
        //console.log(JSON.stringify(response, null, 2));
        response.length.should.equal(1);
        response[0].content.System.systemStartTime.should.equal('2005-01-01T00:00:01Z');
        response[0].content.System.systemEndTime.should.equal('9999-12-31T11:59:59Z');
        response[0].content.Valid.validStartTime.should.equal('2001-01-01T00:00:00Z');
        response[0].content.Valid.validEndTime.should.equal('2011-12-31T23:59:59Z');
        done();
      }, done);
  });

  it('should update the document content', function(done) {
    db.documents.write({
      uri: docuri,
      collections: ['coll0', 'coll1'],
      temporalCollection: temporalCollectionName,
      contentType: 'application/json',
      quality: 10,
      permissions: [
        {'role-name':'app-user', capabilities:['read']},
        {'role-name':'app-builder', capabilities:['read', 'update']}
      ],
      properties: {prop1:'foo', prop2:25},
      content: {
        'System': {
          'systemStartTime' : "",
          'systemEndTime' : "",
        },
        'Valid': {
          'validStartTime': "2001-01-01T00:00:00Z",
          'validEndTime': "2011-12-31T23:59:59Z"
        },
        'Address': "999 Skyway Park",
        'uri': "javaSingleDoc1.json",
        id: 12,
        name: 'Chris'
      },
      systemTime: '2007-01-01T00:00:01Z'
    }
    ).result(function(response){done();}, done);
  });

  it('should wait for lsqt advancement', function(done) {
    setTimeout(function() {
      done();
    }, 3000);
  });

  it('should be able to do lsqt query on both new and old doc', function(done) {
    db.documents.query(
      q.where(
        q.lsqtQuery(temporalCollectionName, '2007-01-01T00:00:01Z')
        )
      )
      .result(function(response) {
        //console.log(JSON.stringify(response, null, 2));
        response.length.should.equal(2);
        response[0].content.System.systemStartTime.should.equal('2005-01-01T00:00:01Z');
        response[0].content.System.systemEndTime.should.equal('2007-01-01T00:00:01Z');
        response[0].content.name.should.equal('Jason');
        response[1].content.System.systemStartTime.should.equal('2007-01-01T00:00:01Z');
        response[1].content.System.systemEndTime.should.equal('9999-12-31T11:59:59Z');
        response[1].content.name.should.equal('Chris');
        done();
      }, done);
  });

  it('should be able to do lsqt query on old doc', function(done) {
    db.documents.query(
      q.where(
        q.lsqtQuery(temporalCollectionName, '2005-01-01T00:00:01')
        )
      )
      .result(function(response) {
        //console.log(JSON.stringify(response, null, 2));
        response.length.should.equal(1);
        response[0].content.System.systemStartTime.should.equal('2005-01-01T00:00:01Z');
        response[0].content.System.systemEndTime.should.equal('2007-01-01T00:00:01Z');
        response[0].content.name.should.equal('Jason');
        done();
      }, done);
  });

  it('should update the document content', function(done) {
    db.documents.write({
      uri: docuri,
      collections: ['coll0', 'coll1'],
      temporalCollection: temporalCollectionName,
      contentType: 'application/json',
      quality: 10,
      permissions: [
        {'role-name':'app-user', capabilities:['read']},
        {'role-name':'app-builder', capabilities:['read', 'update']}
      ],
      properties: {prop1:'foo', prop2:25},
      content: {
        'System': {
          'systemStartTime' : "",
          'systemEndTime' : "",
        },
        'Valid': {
          'validStartTime': "2001-01-01T00:00:00Z",
          'validEndTime': "2011-12-31T23:59:59Z"
        },
        'Address': "999 Skyway Park",
        'uri': "javaSingleDoc1.json",
        id: 12,
        name: 'Mark'
      },
      systemTime: '2009-01-01T00:00:01Z'
    }
    ).result(function(response){done();}, done);
  });

  it('should advance the LSQT', function(done) {
    dbAdmin.documents.advanceLsqt(temporalCollectionName, 3000)
    .result(function(response) {
      //console.log(JSON.stringify(response, null, 2));
      response.should.have.property('lsqt');
      response.lsqt.should.not.equal('2009-01-01T00:00:01Z')
      done();
      }, done);
  });

  /*it('should wait for lsqt advancement', function(done) {
    setTimeout(function() {
      done();
    }, 3000);
  });*/

  it('should be able to do lsqt query on new and old doc', function(done) {
    db.documents.query(
      q.where(
        q.lsqtQuery(temporalCollectionName, '2008-12-31T06:00:01Z')
        )
      )
      .result(function(response) {
        //console.log(JSON.stringify(response, null, 2));
        response.length.should.equal(2);
        response[1].content.System.systemStartTime.should.equal('2005-01-01T00:00:01Z');
        response[1].content.System.systemEndTime.should.equal('2007-01-01T00:00:01Z');
        response[1].content.name.should.equal('Jason');
        done();
      }, done);
  });

  it('should not be able to do lsqt query on new advanced lsqt', function(done) {
    db.documents.query(
      q.where(
        q.lsqtQuery(temporalCollectionName, '2009-01-01T00:00:01Z')
        )
      )
      .result(function(response) {
        response.should.equal('SHOULD HAVE FAILED');
        done();
      }, function(error) {
        //console.log(JSON.stringify(error, null, 2));
        error.body.errorResponse.messageCode.should.equal('TEMPORAL-GTLSQT');
        done();
      });
  });

  after(function(done) {
    dbAdmin.documents.removeAll({
      all: true
    }).
    result(function(response) {
      done();
    })
    .catch(done);
  });

});
