/*
* Copyright (c) 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/
var should = require('should');
var testconfig = require('../etc/test-config.js');
var marklogic = require('../');
var db = marklogic.createDatabaseClient(testconfig.restTemporalConnection);

describe('temporal wipe', function() {
  var content = {
    property1:       'original',
    systemStartTime: '1111-11-11T11:11:11Z',
    systemEndTime:   '9999-12-31T23:59:59Z',
    validStartTime:  '1111-11-11T11:11:11Z',
    validEndTime:    '9999-12-31T23:59:59Z'
  };
  before(function(done){
    db.documents.write({
      documents: {
        uri: 'tempDoc1.json',
        content: content
      },
      temporalCollection: 'temporalCollection'
    }).result(function(response){
      return db.documents.protect({
        uri: 'tempDoc1.json',
        temporalCollection: 'temporalCollection',
        duration: 'PT0S'
      }).result();
    }).then(function(response){
      done();
    }).catch(done);
  });
  it('should wipe an expired temporal document', function(done) {
    db.documents.wipe({
        uri: 'tempDoc1.json',
        temporalCollection: 'temporalCollection'
    }).result(function(response){
      response.uri.should.equal('tempDoc1.json');
      response.temporalCollection.should.equal('temporalCollection');
      response.wiped.should.equal(true);
      response.uri.should.equal('tempDoc1.json');
      done();
    }).catch(done);
  });
  it('should not wipe a non-existent document', function(done) {
    db.documents.wipe({
      uri: 'noExist.json',
      temporalCollection: 'temporalCollection'
    }).result(function(response){
      // idempotent means still success
      response.uri.should.equal('noExist.json');
      response.temporalCollection.should.equal('temporalCollection');
      response.wiped.should.be.true;
      done();
    }).catch(done);
  });
});
