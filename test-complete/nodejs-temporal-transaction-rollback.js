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
var q = marklogic.queryBuilder;

var docuri = '/test/transaction/doc1.json';
var tid = null;
var docCount = 0;

describe('Temporal transaction rollback test', function() {

  it('should get original count of documents', function(done) {
    db.documents.query(
      q.where(
        q.collection(docuri)
        )
      ).result(function(response) {
        //console.log("Document count: " + response.length);
        docCount = response.length;
        done();
      }, done);
  });
  
  it('should commit the write document', function(done) {
    db.transactions.open().result().
    then(function(response) {
      tid = response.txid;
      return db.documents.write(
       {
        uri: docuri,
        txid: tid,
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
      ).result(function(response) {done();}, done);
    }) 
  });

 it('should read the document before commit if txid matches', function(done) {
    db.documents.read({uris: docuri, txid: tid, categories:['metadata']}).result(function(documents) {
      //console.log("Document count: " + documents.length);
      done();
    }, done);
  });

  it('should do collection query based on docuri', function(done) {
    db.documents.query(
      q.where(
        q.collection(docuri)
        )
      ).result(function(response) {
        //console.log("Document count: " + response.length);
        response.length.should.equal(docCount);
        done();
      }, done);
  });

  it('should do collection query based on docuri usig txid', function(done) {
    db.documents.query(
      q.where(
        q.collection(docuri)
        ).withOptions({txid: tid})
      ).result(function(response) {
        //console.log("Document count: " + response.length);
        response.length.should.equal(docCount + 1);
        done();
      }, done);
  });

  it('should commit the document', function(done) {
    db.transactions.rollback(tid).
    result(
      function(response) {
        //console.log("response: " + JSON.stringify(response));
        done();
      }, 
      function(err) {
        //console.log("Error: " + err);
        done();
      });
  });  

  it('should do collection query based on docuri after commit', function(done) {
    db.documents.query(
      q.where(
        q.collection(docuri)
        )
      ).result(function(response) {
        //console.log("Document count: " + response.length);
        response.length.should.equal(docCount);
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
