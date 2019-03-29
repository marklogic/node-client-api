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

var concatStream = require('concat-stream');
var fs = require('fs');

testconfig.manageAdminConnection.user     = "admin";
testconfig.manageAdminConnection.password = "admin";
var adminClient = marklogic.createDatabaseClient(testconfig.manageAdminConnection);
var adminManager = testlib.createManager(adminClient);
var db = marklogic.createDatabaseClient(testconfig.restTemporalConnection);
var dbReader = marklogic.createDatabaseClient(testconfig.restReaderConnection);
var dbAdmin = marklogic.createDatabaseClient(testconfig.restAdminConnection);

describe('Temporal protect delete test', function() {

  var docuri = 'temporalDeleteDoc1.json';

  before(function(done) {
    this.timeout(10000);
    db.documents.write({
      uri: docuri,
      collections: ['coll0', 'coll1'],
      temporalCollection: 'temporalCollection',
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
          'validStartTime': "2001-01-01T00:00:00",
          'validEndTime': "2011-12-31T23:59:59"
        },
        'Address': "999 Skyway Park",
        'uri': "javaSingleDoc1.json",
        id: 12,
        name: 'Jason'
      }
    }
    ).result(function(response){done();}, done);
  });

  it('should read the document content name', function(done) {
    db.documents.read({uris: docuri}).result(function(response) {
      response[0].content.Address.should.equal('999 Skyway Park');
      done();
    }, done);
  });

  it('should protect the document from delete', function(done) {
    db.documents.protect({
      uri: docuri,
      temporalCollection: 'temporalCollection',
      level: 'noDelete',
      duration: 'P2Y2M'
    }).result(function(response) {
      //console.log(response);
      response.level.should.equal('noDelete');
      done();
    }, done);
  });

  it('should be able to update the document', function(done) {
    db.documents.write({
      uri: docuri,
      collections: ['coll0', 'coll1'],
      temporalCollection: 'temporalCollection',
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
          'validStartTime': "2001-01-01T00:00:00",
          'validEndTime': "2011-12-31T23:59:59"
        },
        'Address': "888 Skyway Park",
        'uri': "javaSingleDoc1.json",
        id: 12,
        name: 'Jason'
      }
    }).result(function(response) {
      //console.log(JSON.stringify(response, null, 2));
      response.documents[0].uri.should.equal(docuri);
      done();
    }, done);
  });

  it('should verify the document', function(done) {
    db.documents.read({
      uris: docuri,
      categories: ['metadata', 'content']
    }).result(function(response) {
      //console.log(response);
      response[0].content.Address.should.equal('888 Skyway Park');
      //response[0].metadataValues.temporalArchiveRecords.should.not.be.empty;
      //response[0].metadataValues.temporalArchiveRecords.should.containEql('undefined');
      response[0].metadataValues.temporalProtectExTime.should.not.be.empty;
      response[0].metadataValues.temporalProtectLevel.should.equal('noDelete');
      response[0].metadataValues.temporalDocURI.should.equal(docuri);
      done();
    }, done);
  });

  it('should be not able to wipe document', function(done) {
    db.documents.wipe({
      uri: docuri,
      temporalCollection: 'temporalCollection'
    }).result(function(response) {
      //console.log(response);
      response.should.equal('SHOULD HAVE FAILED');
      done();
    }, function(error) {
      //console.log(error);
      error.body.errorResponse.message.should.containEql('The document temporalDeleteDoc1.json is protected noDelete');
      done();
    });
  });

  it('should verify the document', function(done) {
    db.documents.read({
      uris: docuri,
      categories: ['metadata', 'content']
    }).result(function(response) {
      //console.log(response);
      response[0].content.Address.should.equal('888 Skyway Park');
      //response[0].metadataValues.temporalArchiveRecords.should.not.be.empty;
      //response[0].metadataValues.temporalArchiveRecords.should.containEql('undefined');
      response[0].metadataValues.temporalProtectExTime.should.not.be.empty;
      response[0].metadataValues.temporalProtectLevel.should.equal('noDelete');
      response[0].metadataValues.temporalDocURI.should.equal(docuri);
      done();
    }, done);
  });

  it('should not be able to delete document', function(done) {
    db.documents.remove({
      uris: [docuri],
      temporalCollection: 'temporalCollection'
    }).result(function(response) {
      //console.log(response);
      response.should.equal('SHOULD HAVE FAILED');
      done();
    }, function(error) {
      //console.log(error);
      error.body.errorResponse.message.should.containEql('The document temporalDeleteDoc1.json is protected noDelete');
      done();
    });
  });

  it('should not be able to delete document without specifying temporal collection', function(done) {
    db.documents.remove({
      uris: [docuri]
    }).result(function(response) {
      //console.log(response);
      response.should.equal('SHOULD HAVE FAILED');
      done();
    }, function(error) {
      //console.log(error);
      error.body.errorResponse.message.should.containEql('Cannot perform non-temporal operation on document in temporal collection');
      done();
    });
  });

  it('should protect the document with default value on level and change the duration', function(done) {
    db.documents.protect({
      uri: docuri,
      temporalCollection: 'temporalCollection',
      duration: 'P5Y5M'
    }).result(function(response) {
      //console.log(response);
      response.level.should.equal('noDelete');
      done();
    }, done);
  });

  it('should verify the document', function(done) {
    db.documents.read({
      uris: docuri,
      categories: ['metadata', 'content']
    }).result(function(response) {
      //console.log(response);
      response[0].content.Address.should.equal('888 Skyway Park');
      //response[0].metadataValues.temporalArchiveRecords.should.not.be.empty;
      //response[0].metadataValues.temporalArchiveRecords.should.containEql('undefined');
      response[0].metadataValues.temporalProtectExTime.should.not.be.empty;
      response[0].metadataValues.temporalProtectLevel.should.equal('noDelete');
      response[0].metadataValues.temporalDocURI.should.equal(docuri);
      done();
    }, done);
  });

  it('negative - invalid collection', function(done) {
    db.documents.protect({
      uri: docuri,
      temporalCollection: 'invalidTemporalCollection',
      level: 'noDelete',
      duration: 'P12Y'
    }).result(function(response) {
      //console.log(response);
      response.should.equal('SHOULD HAVE FAILED');
      done();
    }, function(error) {
      //console.log(JSON.stringify(error, null, 2));
      error.body.errorResponse.messageCode.should.equal('TEMPORAL-COLLECTIONNOTFOUND');
      error.body.errorResponse.message.should.containEql('Temporal collection invalidTemporalCollection is not found');
      done();
    });
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
