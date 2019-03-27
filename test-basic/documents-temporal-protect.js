/*
 * Copyright 2014-2019 MarkLogic Corporation
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
var fs = require('fs');
var testconfig = require('../etc/test-config.js');
var marklogic = require('../');
var db = marklogic.createDatabaseClient(testconfig.restTemporalConnection);

describe('temporal protect', function() {
  var DEFAULT_LEVEL = 'noDelete';
  var archiveFile = __dirname + '/temp.txt';
  var content = {
    property1:       'original',
    systemStartTime: '1111-11-11T11:11:11Z',
    systemEndTime:   '9999-12-31T23:59:59Z',
    validStartTime:  '1111-11-11T11:11:11Z',
    validEndTime:    '9999-12-31T23:59:59Z'
  };
  it('should protect a temporal document with duration and default level', function(done) {
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
    }).then(function(response) {
      response.uri.should.equal('tempDoc1.json');
      response.temporalCollection.should.equal('temporalCollection');
      response.level.should.equal(DEFAULT_LEVEL);
      return db.documents.read({
        uris: 'tempDoc1.json',
        categories: 'metadataValues'
      }).result();
    }).then(function(response){
      var m = response[0];
      m.should.have.property('metadataValues');
      m.metadataValues.should.have.property('temporalDocURI');
      m.metadataValues.temporalDocURI.should.equal('tempDoc1.json');
      m.metadataValues.should.have.property('temporalProtectLevel');
      m.metadataValues.temporalProtectLevel.should.equal(DEFAULT_LEVEL);
      m.metadataValues.should.have.property('temporalProtectExTime');
      return db.documents.wipe({
        uri: 'tempDoc1.json',
        temporalCollection: 'temporalCollection'
      }).result();
    }).then(function(response){
      done();
    }).catch(done);
  });
  it('should protect a temporal document with an expireTime and level', function(done) {
    db.documents.write({
      documents: {
        uri: 'tempDoc2.json',
        content: content
      },
      temporalCollection: 'temporalCollection'
    }).result(function(response){
      return db.documents.protect({
        uri: 'tempDoc2.json',
        temporalCollection: 'temporalCollection',
        expireTime: '2016-06-03T19:56:17.681154-07:00',
        level: 'noWipe'
      }).result();
    }).then(function(response) {
      response.uri.should.equal('tempDoc2.json');
      response.temporalCollection.should.equal('temporalCollection');
      response.level.should.equal('noWipe');
      return db.documents.read({
        uris: 'tempDoc2.json',
        categories: 'metadataValues'
      }).result();
    }).then(function(response){
      var m = response[0];
      m.should.have.property('metadataValues');
      m.metadataValues.should.have.property('temporalDocURI');
      m.metadataValues.temporalDocURI.should.equal('tempDoc2.json');
      m.metadataValues.should.have.property('temporalProtectLevel');
      m.metadataValues.temporalProtectLevel.should.equal('noWipe');
      m.metadataValues.should.have.property('temporalProtectExTime');
      m.metadataValues.temporalProtectExTime.should.equal(
        '2016-06-03T19:56:17.681154-07:00'
      );
      return db.documents.wipe({
        uri: 'tempDoc2.json',
        temporalCollection: 'temporalCollection'
      }).result();
    }).then(function(response){
      done();
    }).catch(done);
  });
  // Jenkins skips archivePath test: https://bugtrack.marklogic.com/45783
  it('should protect a temporal document with a duration and archivePath', function(done) {
    db.documents.write({
      documents: {
        uri: 'tempDoc3.json',
        content: content
      },
      temporalCollection: 'temporalCollection'
    }).result(function(response){
      return db.documents.protect({
        uri: 'tempDoc3.json',
        temporalCollection: 'temporalCollection',
        duration: 'PT0S',
        archivePath: archiveFile
      }).result();
    }).then(function(response){
      response.uri.should.equal('tempDoc3.json');
      response.temporalCollection.should.equal('temporalCollection');
      response.level.should.equal(DEFAULT_LEVEL);
      return db.documents.read({
        uris: 'tempDoc3.json',
        categories: 'metadataValues'
      }).result();
    }).then(function(response){
      var m = response[0];
      m.should.have.property('metadataValues');
      m.metadataValues.should.have.property('temporalDocURI');
      m.metadataValues.temporalDocURI.should.equal('tempDoc3.json');
      m.metadataValues.should.have.property('temporalArchivePaths');
      m.metadataValues.temporalArchivePaths.should.equal(archiveFile);
      m.metadataValues.should.have.property('temporalArchiveStatus');
      m.metadataValues.temporalArchiveStatus.should.equal('succeeded');
      m.metadataValues.should.have.property('temporalArchiveTime');
      return db.documents.wipe({
        uri: 'tempDoc3.json',
        temporalCollection: 'temporalCollection'
      }).result();
    }).then(function(response){
      fs.unlinkSync(archiveFile);
      done();
    }).catch(done);
  });
  it('should protect a temporal document twice', function(done) {
    db.documents.write({
      documents: {
        uri: 'tempDoc4.json',
        content: content
      },
      temporalCollection: 'temporalCollection'
    }).result(function(response){
      return db.documents.protect({
        uri: 'tempDoc4.json',
        temporalCollection: 'temporalCollection',
        expireTime: '2016-01-01T12:34:56.7890-07:00',
        level: 'noUpdate'
      }).result();
    }).then(function(response){
      response.uri.should.equal('tempDoc4.json');
      response.temporalCollection.should.equal('temporalCollection');
      response.level.should.equal('noUpdate');
      return db.documents.protect({
        uri: 'tempDoc4.json',
        temporalCollection: 'temporalCollection',
        expireTime: '2016-01-01T12:34:56.7890-07:00',
        level: 'noUpdate'
      }).result();
    }).then(function(response){
      response.uri.should.equal('tempDoc4.json');
      response.temporalCollection.should.equal('temporalCollection');
      response.level.should.equal('noUpdate');
      return db.documents.wipe({
        uri: 'tempDoc4.json',
        temporalCollection: 'temporalCollection'
      }).result();
    }).then(function(response){
      done();
    }).catch(done);
  });
});
