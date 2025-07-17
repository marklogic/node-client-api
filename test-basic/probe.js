/*
* Copyright © 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/

var should = require('should'),
    testconfig = require('../etc/test-config.js'),
    marklogic = require('../');

var db = marklogic.createDatabaseClient(testconfig.restWriterConnection);

describe('probe', function() {
  var uri1 = '/doc.json';
  var uri2 = '/noExist.json';
  before(function(done){
    db.documents.write({
      uri: uri1,
      contentType: 'application/json',
      content: {foo: 'bar'}
    }).result(function(response){
      done();
    })
    .catch(done);
  });
  after(function(done){
    db.documents.remove({
      uris: uri1
    }).result(function(response){
      done();
    })
    .catch(done);
  });
  describe('using param string', function() {
    it('should find a document', function(done) {
      db.documents.probe(uri1)
      .result(function(response) {
        response.exists.should.equal(true);
        response.uri.should.equal(uri1);
        done();
        })
      .catch(function(error){
        done(error);
      });
    });
    it('should not find an non-existent document', function(done) {
      db.documents.probe(uri2)
      .result(function(response) {
        response.exists.should.equal(false);
        response.uri.should.equal(uri2);
        done();
        })
      .catch(function(error){
        done(error);
      });
    });
  });
  describe('using param object', function() {
    it('should find a document', function(done) {
      db.documents.probe({uri: uri1})
      .result(function(response) {
        response.exists.should.equal(true);
        response.uri.should.equal(uri1);
        done();
        })
      .catch(function(error){
        done(error);
      });
    });
  });
});

describe('probe in transaction', function(){
  var uri = '/txdoc.json';
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
  describe('using param list', function(){
    it('should find written doc in same transaction', function(done){
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
        return db.documents.probe(uri, txn).result();
        })
      .then(function(response) {
        response.should.be.ok;
        response.exists.should.eql(true);
        return db.transactions.commit(txn).result();
        })
      .then(function(response) {
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
  describe('using param object', function(){
    it('should find written doc in same transaction', function(done){
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
        return db.documents.probe({uri: uri, txid: txn}).result();
        })
      .then(function(response) {
        response.should.be.ok;
        response.exists.should.eql(true);
        return db.transactions.commit(txn).result();
        })
      .then(function(response) {
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
});

