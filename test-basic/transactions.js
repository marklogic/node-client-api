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

var testconfig = require('../etc/test-config.js');

var marklogic = require('../');

var db = marklogic.createDatabaseClient(testconfig.restWriterConnection);

describe('transaction', function(){
  describe('with commit', function(){
    this.timeout(5000);
    var uri = '/test/txn/commit1.json';
    before(function(done){
      db.documents.probe(uri).result(function(document){
        if (document.exists) {
          db.documents.remove(uri)
            .result(function(response) {done();})
            .catch(done);          
        } else {
          done();
        }
        })
      .catch(done);
    });
    it('should read from a write in the same transaction', function(done){
      var tid = null;
      db.transactions.open()
      .result(function(response) {
        tid = response.txid;
        return db.documents.write({
          txid: tid,
          uri: uri,
          contentType: 'application/json',
          content: {txKey: tid}
          }).result();
        })
      .then(function(response) {
        return db.documents.read({uris:uri, txid:tid}).result();
        })
      .then(function(documents) {
        documents.length.should.equal(1);
        var document = documents[0];
        document.should.be.ok;
        document.should.have.property('content');
        document.content.should.have.property('txKey');
        document.content.txKey.should.equal(tid);
        return db.documents.probe(uri).result();
        })
      .then(function(response) {
        response.should.be.ok;
        response.exists.should.eql(false);
        return db.transactions.commit(tid).result();
        })
      .then(function(response) {
        return db.documents.read(uri).result();
        })
      .then(function(documents) {
        documents.length.should.equal(1);
        var document = documents[0];
        document.should.be.ok;
        document.should.have.property('content');
        document.content.should.have.property('txKey');
        document.content.txKey.should.equal(tid);
        return db.documents.remove(uri).result();
        })
      .then(function(response) {done();})
      .catch(function(primaryError){
        db.transactions.rollback(tid).result(function(data){
          done(primaryError);
        }, function(secondaryError){
          done(primaryError);
        });
      });
    });
  });
  describe('with rollback', function(){
    this.timeout(5000);
    var uri = '/test/txn/rollback1.json';
    before(function(done){
      db.documents.probe(uri).result(function(document){
        if (document.exists) {
          db.documents.remove(uri)
            .result(function(response) {done();})
            .catch(done);          
        } else {
          done();
        }
        })
      .catch(done);
    });
    it('should rollback a write', function(done){
      var tid = null;
      db.transactions.open()
      .result(function(response) {
        tid = response.txid;
        return db.documents.write({
          txid: tid,
          uri: uri,
          contentType: 'application/json',
          content: {txKey: tid}
          }).result();
        })
      .then(function(response) {
        return db.documents.read({uris:uri, txid:tid}).result();
        })
      .then(function(documents) {
        documents.length.should.equal(1);
        var document = documents[0];
        document.should.be.ok;
        document.should.have.property('content');
        document.content.should.have.property('txKey');
        document.content.txKey.should.equal(tid);
        return db.transactions.rollback(tid).result();
        })
      .then(function(response) {
        return db.documents.probe(uri).result();
        })
      .then(function(response) {
        response.should.be.ok;
        response.exists.should.eql(false);
        done();
        })
      .catch(done);
    });
  });
  describe('with named transactions', function(){
    this.timeout(5000);
    var uri = '/test/txn/rollback2.json';
    before(function(done){
      db.documents.probe(uri).result(function(document){
        if (document.exists) {
          db.documents.remove(uri)
            .result(function(response) {done();})
            .catch(done);          
        } else {
          done();
        }
        })
      .catch(done);
    });
    it('should rollback a positional transaction name', function(done){
      var tid = null;
      db.transactions.open('firstTxn')
      .result(function(response) {
        tid = response.txid;
        return db.documents.write({
          txid: tid,
          uri: uri,
          contentType: 'application/json',
          content: {txKey: tid}
          }).result();
        })
      .then(function(response) {
        return db.transactions.rollback(tid).result();
        })
      .then(function(response) {
        response.should.be.ok;
        done();
        })
      .catch(done);
    });
    it('should rollback a named transaction name', function(done){
      var tid = null;
      db.transactions.open({transactionName:'firstTxn'})
      .result(function(response) {
        tid = response.txid;
        return db.documents.write({
          txid: tid,
          uri: uri,
          contentType: 'application/json',
          content: {txKey: tid}
          }).result();
        })
      .then(function(response) {
        return db.transactions.rollback(tid).result();
        })
      .then(function(response) {
        response.should.be.ok;
        done();
        })
      .catch(done);
    });
  });
  describe('transaction status', function(){
    this.timeout(5000);
    var uri = '/test/txn/read1.json';
    it('should read an open transaction', function(done){
      var tid = null;
      db.transactions.open()
      .result(function(response) {
        tid = response.txid;
        return db.documents.write({
          txid: tid,
          uri: uri,
          contentType: 'application/json',
          content: {txKey: tid}
          }).result();
        })
      .then(function(response) {
        return db.transactions.read(tid).result();
        })
      .then(function(response) {
        var status = response['transaction-status'];
        var transactionId = status['transaction-id'];
        tid.should.equal(transactionId);
        return db.transactions.rollback(tid).result();
        })
      .then(function(response) {
        response.should.be.ok;
        done();
        })
      .catch(done);
    });
  });
});
