/*
 * Copyright 2014 MarkLogic Corporation
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

var testutil = require('./test-util.js');

var marklogic = require('../');

var db = marklogic.createDatabaseClient(testutil.restWriterConnection);

describe('transaction', function(){
  describe('with commit', function(){
    var uri = '/test/txn/commit1.json';
    before(function(done){
      db.check(uri).result(function(document){
        if (document.exists) {
          db.remove(uri).
            result(function(response) {done();}, done);          
        } else {
          done();
        }
      }, done);
    });
    it('should read from a write in the same transaction', function(done){
      var tid = null;
      db.transactions.open().result().
      then(function(txid) {
        tid = txid;
        return db.documents.write({
          txid: tid,
          uri: uri,
          contentType: 'application/json',
          content: {txKey: tid}
          }).result();
        }).
      then(function(response) {
        return db.read({uri:uri, txid:tid}).result();
        }).
      then(function(document) {
        document.should.be.ok;
        document.content.should.be.ok;
        document.content.txKey.should.be.ok;
        document.content.txKey.should.equal(tid);
        return db.check(uri).result();
        }).
      then(function(document) {
        document.should.be.ok;
        document.exists.should.eql(false);
        return db.transactions.commit(tid).result();
        }).
      then(function(response) {
        return db.read(uri).result();
        }).
      then(function(document) {
        document.should.be.ok;
        document.content.should.be.ok;
        document.content.txKey.should.be.ok;
        document.content.txKey.should.equal(tid);
        db.remove(uri).
          result(function(response) {done();}, done);
        },
        function(primaryError){
          db.transactions.rollback(tid).result(function(data){
            done(primaryError);
          }, function(secondaryError){
            done(primaryError);
          });
        });
    });
  });
  describe('with rollback', function(){
    var uri = '/test/txn/rollback1.json';
    it('should read from a write', function(done){
      var tid = null;
      db.transactions.open().result().
      then(function(txid) {
        tid = txid;
        return db.documents.write({
          txid: tid,
          uri: uri,
          contentType: 'application/json',
          content: {txKey: tid}
          }).result();
        }).
      then(function(response) {
        return db.read({uri:uri, txid:tid}).result();
        }).
      then(function(document) {
        document.should.be.ok;
        document.content.should.be.ok;
        document.content.txKey.should.be.ok;
        document.content.txKey.should.equal(tid);
        return db.transactions.rollback(tid).result();
        }).
      then(function(response) {
        return db.check(uri).result();
        }).
      then(function(document) {
        document.should.be.ok;
        document.exists.should.eql(false);
        done();
        }, done);
    });
  });
});
