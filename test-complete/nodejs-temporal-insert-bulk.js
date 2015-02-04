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

var testlib    = require('../etc/test-lib.js');
var testconfig = require('../etc/test-config-qa.js');

var marklogic = require('../');


testconfig.manageAdminConnection.user     = "admin";
testconfig.manageAdminConnection.password = "admin";
var adminClient = marklogic.createDatabaseClient(testconfig.manageAdminConnection);
var adminManager = testlib.createManager(adminClient);
var db = marklogic.createDatabaseClient(testconfig.restWriterConnection);
var dbAdmin = marklogic.createDatabaseClient(testconfig.restAdminConnection);
var dbReader = marklogic.createDatabaseClient(testconfig.restReaderConnection);

describe('Temporal insert bulk test', function() {
  
  var docuri = 'temporalDoc.json'; 
  var docuri2 = 'nonTemporalDoc.json';
 
  before(function(done) {
    db.documents.write(
    {
      documents: [
      {
        uri: docuri,
        collections: ['coll0', 'coll1'],
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
      },
      {
        uri: docuri2,
        collections: ['coll0', 'coll1'],
        contentType: 'application/json',
        quality: 10,
        permissions: [
          {'role-name':'app-user', capabilities:['read']},
          {'role-name':'app-builder', capabilities:['read', 'update']}
        ],
        properties: {prop1:'foo', prop2:50},
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
          'uri': "javaSingleDoc2.json",
          id: 12, 
          name: 'Bourne'
        }
      }
    ], temporalCollection: 'temporalCollection'}).result(function(response){done();}, done);
  });

  it('should read the document content name', function(done) {
    db.documents.read({uris: docuri}).result(function(documents) {
      var document = documents[0];
      document.content.Address.should.equal('999 Skyway Park');
      done();
    }, done);
  });

  it('should read the document content id', function(done) {
    db.documents.read({uris: docuri, categories:['content']}).result(function(documents) {
      var document = documents[0];
      document.content.Valid.validStartTime.should.equal("2001-01-01T00:00:00");
      done();
    }, done);
  });

  it('should read the document quality (metadata) and content', function(done) {
    db.documents.read({uris: docuri, categories:['metadata', 'content']})
    .result(function(documents) {
      var document = documents[0];
      document.quality.should.equal(10);
      document.properties.prop1.should.equal('foo');
      done();
    }, done);
  });

  it('should read the document collections', function(done) {
    db.documents.read({uris: docuri, categories:['metadata']}).result(function(documents) {
      var document = documents[0];
      var collCount = document.collections.length;
      collCount.should.equal(5);  // Should be coll0, coll1, temporalCollection, docUri and latest
      for (var i=0; i < collCount; i++) {
        var coll = document.collections[i];

        if (document.collections[i] !== 'temporalCollection' && document.collections[i] !== 'coll0' &&
            document.collections[i] !== 'coll1' && document.collections[i] !== 'latest' &&
            document.collections[i] !== docuri) {
          //console.log("Invalid Collection: " + coll);
          should.equal(false, true);
        }
      }           
      done();
    }, done);
  });

  it('should read the document permissions', function(done) {
    db.documents.read({uris: docuri, categories:['metadata']}).result(function(documents) {
      var document = documents[0];
      var permissionsCount = 0;
      document.permissions.forEach(function(permission) {
        switch(permission['role-name']) {
          case 'app-user':
            permissionsCount++;
            permission.capabilities.length.should.equal(1);
            permission.capabilities[0].should.equal('read');
            break;
          case 'app-builder':
            permissionsCount++;
            permission.capabilities.length.should.equal(2);
            permission.capabilities.should.containEql('read');
            permission.capabilities.should.containEql('update');
            break;
        }
      });
      permissionsCount.should.equal(2);
      done();
    }, done);
  });

  it('should read multiple documents', function(done) {
    db.documents.read({uris: [docuri], categories:['content']}).result(function(documents) {
      ////console.log(JSON.stringify(documents, null, 4));
      documents[0].content.id.should.equal(12);
      done();
    }, done);
  });

  it('should read multiple documents with an invalid one', function(done) {
    db.documents.read({uris: [docuri, '/not/here/blah.json'], categories:['content']}).result(function(documents) {
      ////console.log(JSON.stringify(documents, null, 4));
      documents[0].content.id.should.equal(12);
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
