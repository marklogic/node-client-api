/*
* Copyright © 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/
var should = require('should');

var testconfig = require('../etc/test-config.js');

var marklogic = require('../');

var mlutil    = require('../lib/mlutil.js');

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
      var txn = null;
      db.transactions.open(true)
      .result(function(response) {
        txn = response;
        return db.documents.write({
          txid: txn,
          uri: uri,
          contentType: 'application/json',
          content: {txKey: txn.txid}
          }).result();
        })
      .then(function(response) {
        return db.documents.read({uris:uri, txid:txn}).result();
        })
      .then(function(documents) {
        documents.length.should.equal(1);
        var document = documents[0];
        document.should.be.ok;
        document.should.have.property('content');
        document.content.should.have.property('txKey');
        document.content.txKey.should.equal(txn.txid);
        return db.documents.probe(uri).result();
        })
      .then(function(response) {
        response.should.be.ok;
        response.exists.should.eql(false);
        return db.transactions.commit(txn).result();
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
        document.content.txKey.should.equal(txn.txid);
        return db.documents.remove(uri).result();
        })
      .then(function(response) {done();})
      .catch(function(primaryError){
        db.transactions.rollback(txn).result(function(data){
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
      var txn = null;
      db.transactions.open(true)
      .result(function(response) {
        txn = response;
        return db.documents.write({
          txid: txn,
          uri: uri,
          contentType: 'application/json',
          content: {txKey: txn.txid}
          }).result();
        })
      .then(function(response) {
        return db.documents.read({uris:uri, txid:txn}).result();
        })
      .then(function(documents) {
        documents.length.should.equal(1);
        var document = documents[0];
        document.should.be.ok;
        document.should.have.property('content');
        document.content.should.have.property('txKey');
        document.content.txKey.should.equal(txn.txid);
        return db.transactions.rollback(txn).result();
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
      var txn = null;
      db.transactions.open('firstTxn',true)
      .result(function(response) {
        txn = response;
        return db.documents.write({
          txid: txn,
          uri: uri,
          contentType: 'application/json',
          content: {txKey: txn.txid}
          }).result();
        })
      .then(function(response) {
        return db.transactions.rollback(txn).result();
        })
      .then(function(response) {
        response.should.be.ok;
        done();
        })
      .catch(done);
    });
    it('should rollback a named transaction name', function(done){
      var txn = null;
      db.transactions.open({transactionName:'firstTxn',withState:true})
      .result(function(response) {
        txn = response;
        return db.documents.write({
          txid: txn,
          uri: uri,
          contentType: 'application/json',
          content: {txKey: txn.txid}
          }).result();
        })
      .then(function(response) {
        return db.transactions.rollback(txn).result();
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
      var txn = null;
      db.transactions.open(true)
      .result(function(response) {
        txn = response;
        return db.documents.write({
          txid: txn,
          uri: uri,
          contentType: 'application/json',
          content: {txKey: txn.txid}
          }).result();
        })
      .then(function(response) {
        return db.transactions.read(txn).result();
        })
      .then(function(response) {
        var status = response['transaction-status'];
        var transactionId = status['transaction-id'];
        txn.txid.should.equal(transactionId);
        return db.transactions.rollback(txn).result();
        })
      .then(function(response) {
        response.should.be.ok;
        done();
        })
      .catch(done);
    });

    it('should read the same file as written when using mlutil.convertTransaction', function(done){
      var txn = null;
      var tid = null;
      db.transactions.open(true)
      .result(function(response) {
        txn = response;
        return db.documents.write({
          txid: txn,
          uri: uri,
          contentType: 'application/json',
          content: {txKey: txn.txid}
          }).result();
        })
      .then(function(response) {
        tid = txn.txid;
        var  txnRaw = {txid: txn.txid, cookies: txn.cookies};
        var convertedTransaction = mlutil.convertTransaction(txnRaw);
        
        return db.transactions.read(convertedTransaction).result() ;
        })
      .then(function(document) {
        var status = document['transaction-status'];
        var transactionId = status['transaction-id'];
        var host = status['host'];
        var hostId = 'HostId='+host['host-id'];

        tid.should.equal(transactionId);
        return db.transactions.rollback(txn).result();
        })
      .then(function(response) {
        response.should.be.ok;
        done();
        })
      .catch(done);
    });
  });
});
