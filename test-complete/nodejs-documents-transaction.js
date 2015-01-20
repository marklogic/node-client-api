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

describe('Document transaction test', function() {
  
  it('should commit the write document', function(done) {
    this.timeout(10000);
    var tid = null;
    db.transactions.open().result().
    then(function(response) {
      tid = response.txid;
      return db.documents.write({
        txid: tid,
        uri: '/test/transaction/doc1.json',
        contentType: 'application/json',
        content: {firstname: "John", lastname: "Doe", txKey: tid}
      }).result();
    }).
    then(function(response) {
      return db.transactions.commit(tid).
      result(function(response) {done();}, done);
    });  
  });

  it('should read the commited document', function(done) {
      this.timeout(10000);
      db.documents.read({uris:'/test/transaction/doc1.json'}).result().
      then(function(documents) {
        var document = documents[0];
        //console.log(document.content.txKey);
        var tid = document.content.txKey;
        return db.documents.read({uris:'/test/transaction/doc1.json'}).result();
      }).
      then(function(documents) {
        var document = documents[0];
        document.uri.should.equal('/test/transaction/doc1.json');
        //console.log(document.content.txKey);
        done();
      }, done);
  });

  /*it('should rollback the write document', function(done) {
    this.timeout(10000);
    var tid = null;
    db.transactions.open().result().
    then(function(response) {
      tid = response.txid;
      console.log(tid);
      return db.documents.write({
        txid: tid,
        uri: '/test/transaction/doc2.json',
        contentType: 'application/json',
        content: {firstname: "Peter", lastname: "Pan", txKey: tid}
      }).result();
    }).
    then(function(response) {
      return db.documents.remove({uri: '/test/transaction/doc2.json', txid: tid}).result();
    }).
    then(function(response) {
      return db.transactions.rollback(tid).
      result(function(response) {done();}, done);
    });  
  });*/

  it('should rollback the write document', function(done) {
    this.timeout(10000);
    var tid = null;
    db.transactions.open().result().
    then(function(response) {
      tid = response.txid;
      return db.documents.write({
        txid: tid,
        uri: '/test/transaction/doc2.json',
        contentType: 'application/json',
        content: {firstname: "Peter", lastname: "Pan", txKey: tid}
      }).result();
    }).
   
    then(function(response) {
      //console.log(response);
	  return db.transactions.rollback(tid)
   .result(function(response) {  
   //console.log(response);
   done();}, done);
    });  
  });
  /*it('should be able to read the rolled back document', function(done) {
      this.timeout(10000);
      console.log(tid);
      db.documents.read({uris:'/test/transaction/doc2.json'}).
      result(function(response) {
        console.log(response);
        var document = response[0];
        //document.uri.should.equal('/test/transaction/doc2.json');
        done();
      }, done);
  });*/

  it('should rollback the overwritten document', function(done) {
    this.timeout(10000);
    var tid = null;
    db.transactions.open().result().
    then(function(response) {
      tid = response.txid;
      return db.documents.write({
        txid: tid,
        uri: '/test/transaction/doc3.json',
        contentType: 'application/json',
        content: {firstname: "Bob", lastname: "Sang", txKey: tid}
      }).result();
    }).
    then(function(response) {
      return db.documents.write({
        txid: tid,
        uri: '/test/transaction/doc3.json', 
        contentType: 'application/json',
        content: {firstname: "Chuck", lastname: "Sang", txKey: tid}
      }).result();
    }).
    then(function(response) {
      return db.transactions.rollback(tid).
      result(function(response) {  
	  //console.log(response);
	  done();}, done);
    });  
  });

   it('should be able to read the original document', function(done) {
      this.timeout(10000);
      db.documents.read({uris:'/test/transaction/doc3.json'}).
      result(function(response) {
        //console.log(response);
        var document = response[0];
        //document.content.firstname.should.equal('Bob');
        done();}
     , function(error) {
         //console.log(error);
         //error.should.have.property('errorResponse');
		 done();
       });
  });
  
 
  it('should remove all documents', function(done) {
      this.timeout(10000);
      dbAdmin.documents.removeAll({all: true}).
      result(function(response) {
        done();
      }, done);
  });  

});
