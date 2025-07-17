/*
* Copyright © 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/

var should = require('should');
var testconfig = require('../etc/test-config.js');
var marklogic = require('../');
var db = marklogic.createDatabaseClient(testconfig.restTemporalConnection);

describe('temporal document', function() {
  var content = {
    systemStartTime: '1111-11-11T11:11:11Z',
    systemEndTime:   '9999-12-31T23:59:59Z',
    validStartTime:  '1111-11-11T11:11:11Z',
    validEndTime:    '9999-12-31T23:59:59Z'
  };
  after(function(done){
    db.documents.protect({
      uri: 'tempDoc1.json',
      temporalCollection: 'temporalCollection',
      duration: 'PT0S'
    }).result(function(response){
      return db.documents.wipe({
        uri: 'tempDoc1.json',
        temporalCollection: 'temporalCollection'
      }).result();
    }).then(function(response){
      return db.documents.protect({
        uri: 'tempDoc2.json',
        temporalCollection: 'temporalCollection',
        duration: 'PT0S'
      }).result();
    }).then(function(response){
      return db.documents.wipe({
        uri: 'tempDoc2.json',
        temporalCollection: 'temporalCollection'
      }).result();
    }).then(function(response){
      return db.documents.protect({
        uri: 'tempDoc3.json',
        temporalCollection: 'temporalCollection',
        duration: 'PT0S'
      }).result();
    }).then(function(response){
      return db.documents.wipe({
        uri: 'tempDoc3.json',
        temporalCollection: 'temporalCollection'
      }).result();
    }).then(function(response){
      done();
    }).catch(done);
  });
  it('should write a temporal document with a temporal URI', function(done) {
    db.documents.write({
      documents:{
        uri: 'tempDoc1-v1.json',
        temporalDocument: 'tempDoc1.json',
        content: content
      },
      temporalCollection: 'temporalCollection'
    }).result(function(response){
      var documents = response.documents;
      documents.should.have.property('length');
      documents.length.should.equal(1);
      response.should.have.property('systemTime');
      return db.documents.read({
        uris: documents[0].uri,
        categories: 'metadata'
      }).result();
    }).then(function(documents){
      documents.should.have.property('length');
      documents.length.should.equal(1);
      documents[0].should.have.property('metadataValues');
      documents[0].metadataValues.should.have.property('temporalDocURI');
      var tempDocURI = documents[0].metadataValues.temporalDocURI;
      tempDocURI.should.equal('tempDoc1.json');
      done();
    }).catch(done);
  });
  it('should write multiple temporal documents with temporal URIs', function(done) {
    db.documents.write({
      documents:[{
        uri: 'tempDoc2-v1.json',
        temporalDocument: 'tempDoc2.json',
        content: content
      },{
        uri: 'tempDoc3-v1.json',
        temporalDocument: 'tempDoc3.json',
        content: content
      }],
      temporalCollection: 'temporalCollection'
    }).result(function(response){
      var documents = response.documents;
      documents.should.have.property('length');
      documents.length.should.equal(2);
      response.should.have.property('systemTime');
      var uris = documents.map(function(document){return document.uri;});
      return db.documents.read({
        uris: uris,
        categories: 'metadata'
      }).result();
    }).then(function(documents){
      documents.should.have.property('length');
      documents.length.should.equal(2);
      documents[0].should.have.property('metadataValues');
      documents[0].metadataValues.should.have.property('temporalDocURI');
      var tempDocURI1 = documents[0].metadataValues.temporalDocURI;
      tempDocURI1.should.equal('tempDoc2.json');
      documents[1].should.have.property('metadataValues');
      documents[1].metadataValues.should.have.property('temporalDocURI');
      var tempDocURI2 = documents[1].metadataValues.temporalDocURI;
      tempDocURI2.should.equal('tempDoc3.json');
      done();
    }).catch(function (error) {
      console.dir(error);
      done();
    });
  });
});
