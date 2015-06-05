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
var q = marklogic.queryBuilder;
var db = marklogic.createDatabaseClient(testconfig.restWriterConnection);

describe('Transaction remove multiple documents test', function() {
  
  var tid = 0;
  var tid2 = 0;

  it('should do transaction remove multiple', function(done) {
    db.transactions.open({transactionName: 'removeTransaction', timeLimit: 30})
    .result(function(response) {
      //console.log(JSON.stringify(response, null, 2));
      tid = response.txid;
      return db.documents.write({
        txid: tid,
        uri: '/test/remove/transaction/doc1.json',
        contentType: 'application/json',
        content: {firstname: 'John', lastname: 'Doe', txKey: tid}
      }, {
        txid: tid,
        uri: '/test/remove/transaction/doc2.json',
        contentType: 'application/json',
        content: {firstname: 'Harry', lastname: 'Kane', txKey: tid}
      }).result();
    })
    .then(function(response) {
      //console.log(JSON.stringify(response, null, 2));
      return db.documents.read({
        txid: tid,
        uris: [
          '/test/remove/transaction/doc1.json',
          '/test/remove/transaction/doc2.json'
        ]
      }).result();
    })
    .then(function(response) {
      //console.log(JSON.stringify(response, null, 2));
      response[0].uri.should.equal('/test/remove/transaction/doc1.json');
      response[1].uri.should.equal('/test/remove/transaction/doc2.json');
      return db.transactions.read(tid).result();
    })
    .then(function(response) {
      //console.log(JSON.stringify(response, null, 2));
      response['transaction-status']['transaction-id'].should.equal(tid);
      response['transaction-status']['time-limit'].should.equal('30');
      return db.documents.read({uris: '/test/remove/transaction/doc1.json'}).result();
    })
    .then(function(response) {
      //console.log(JSON.stringify(response, null, 2));
      response[0].uri.should.equal('/test/remove/transaction/doc1.json');
      return db.transactions.commit(tid).result(); 
    })
    .then(function(response) {
      //console.log(JSON.stringify(response, null, 2));
      return db.documents.read({uris: '/test/remove/transaction/doc1.json'}).result();
    })
    .then(function(response) {
      //console.log(JSON.stringify(response, null, 2));
      response[0].uri.should.equal('/test/remove/transaction/doc1.json');
      return db.documents.read({uris: '/test/remove/transaction/doc2.json'}).result();
    })
    .then(function(response) {
      //console.log(JSON.stringify(response, null, 2));
      response[0].uri.should.equal('/test/remove/transaction/doc2.json');
      return db.transactions.open({transactionName: 'removeTransaction2', timeLimit: 60}).result();
    })
    .then(function(response) {
      //console.log(JSON.stringify(response, null, 2));
      tid2 = response.txid;
      return db.documents.remove({
        txid: tid2,
        uris: [
          '/test/remove/transaction/doc1.json', 
          '/test/remove/transaction/doc2.json'
        ]
      }).result();
    })
    .then(function(response) {
      //console.log(JSON.stringify(response, null, 2));
      response.removed.should.equal(true);
      return db.documents.read({
        txid: tid2,
        uris: [
          '/test/remove/transaction/doc1.json',
          '/test/remove/transaction/doc2.json'
        ]
      }).result();
    })
    .then(function(response) {
      //console.log(JSON.stringify(response, null, 2));
      response.length.should.equal(0);
      return db.transactions.commit(tid2).result();
    })
    .then(function(response) {
      //console.log(JSON.stringify(response, null, 2));
      return db.documents.read({
        uris: [
          '/test/remove/transaction/doc1.json',
          '/test/remove/transaction/doc2.json'
        ]
      }).result();
    })
    .then(function(response) {
      //console.log(JSON.stringify(response, null, 2));
      response.length.should.equal(0);
      done();
    }, done);
    /*.catch(function(error) {
      console.log(error);
      done();
    }, done);*/
  });
});

