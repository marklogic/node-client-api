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

var marklogic = require('../');

var db = marklogic.createDatabaseClient(testconfig.restWriterConnection);
var dbReader = marklogic.createDatabaseClient(testconfig.restReaderConnection);
var dbAdmin = marklogic.createDatabaseClient(testconfig.restAdminConnection);
var tid = null;

describe('Document transaction test', function() {
  
  // Set transaction time limit to be 1 second
  it('should commit the write document', function(done) {
    db.transactions.open({transactionName: "nodeTransaction", timeLimit: 1}).result().
    then(function(response) {
      tid = response.txid;
      return db.documents.write({
        txid: tid,
        uri: '/test/transaction/doc1.json',
        contentType: 'application/json',
        content: {firstname: "John", lastname: "Doe", txKey: tid}
      }).result(function(response) {done();}, done);
    }) 
  });

  // Read about transaction status
  it('should read transaction status', function(done) {
    db.transactions.read(tid).result(function(response) {
      //console.log(JSON.stringify(response, null, 2));
      response['transaction-status']['transaction-name'].should.equal('nodeTransaction');
      response['transaction-status']['time-limit'].should.equal('1');
      done();
    }, done);
  });

 // Wait for 3 seconds so that transaction can time out
 it('should wait for 3 seconds', function(done) {
    setTimeout(function() {
      done();

    }, 3000);
  });

  it('should read the commited document and fail with 400/XDMP-NOTXN error (transaction timed out)', function(done) {
      db.documents.read({uris:'/test/transaction/doc1.json', txid: tid,}).result(function(response) {
        console.log("Response: " + JSON.stringify(response));
        done(new Error("Response did not time out"));
    }, 
    function(err) {
      err.statusCode.should.equal(400);
      err.body.errorResponse.messageCode.should.equal("XDMP-NOTXN");
      done();
    },
    done);
  });

  it('should commit the document', function(done) {
    db.transactions.commit(tid).
    result(
      function(response) {
        console.log("Response: " + JSON.stringify(response));
        done(new Error("Response did not time out"));
      }, 
      function(err) {
        err.statusCode.should.equal(400);
        err.body.errorResponse.messageCode.should.equal("XDMP-NOTXN");
        done();
      });
  });  

  it('should remove all documents', function(done) {
      dbAdmin.documents.removeAll({all: true}).
      result(function(response) {
        done();
      }, done);
  }); 
});
