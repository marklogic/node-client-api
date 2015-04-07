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

var fs = require('fs');

var valcheck = require('core-util-is');

var testconfig = require('../etc/test-config.js');

var marklogic = require('../');

var db = marklogic.createDatabaseClient(testconfig.restWriterConnection);
var dbAdmin = marklogic.createDatabaseClient(testconfig.restAdminConnection);

describe('document versions', function() {
  before(function(done) {
    dbAdmin.config.serverprops.write({'update-policy':'version-required'})
    .result(function(response) {done();})
    .catch(done);
  });
  after(function(done) {
    dbAdmin.config.serverprops.write({'update-policy':'merge-metadata'})
    .result(function(response) {done();})
    .catch(done);
  });
  describe('probe', function() {
    var uri = '/test/version/probe1.json';
    before(function(done){
      db.documents.probe(uri)
      .result(function(response) {
        if (response.exists === false) {
          db.documents.write({
            uri: uri,
            contentType: 'application/json',
            content: {key1: 'value 1'}
            })
          .result(function(response){done();})
          .catch(done);
        } else {
          done();
        }
        })
      .catch(done);
    });
    it('should return the versionId', function(done) {
      db.documents.probe(uri)
      .result(function(response) {
        valcheck.isUndefined(response).should.equal(false);
        response.should.have.property('versionId');
        done();
        })
      .catch(done);
    });
  });
  describe('delete', function() {
    var uri       = '/test/version/del1.json';
    var versionId = null;
    before(function(done){
      db.documents.probe(uri).result(function(response){
        if (response.exists === true) {
          versionId = response.versionId;
          done();
        } else {
          db.documents.write({
            uri: uri,
            contentType: 'application/json',
            content: {key1: 'value 1'}
            })
          .result(function(response){
              return db.documents.probe(uri).result();
            })
          .then(function(response){
            versionId = response.versionId;
            done();
            })
          .catch(done);
        }
        })
      .catch(done);
    });
    it('should fail without a versionId', function(done) {
      db.documents.remove(uri)
      .result(function(response){
        response.should.equal('SHOULD HAVE FAILED');
        done();
      }, function(error) {
        error.body.errorResponse.messageCode.should.equal('RESTAPI-CONTENTNOVERSION');
        done();
      });
    });
    it('should fail with the wrong versionId', function(done) {
      db.documents.remove({uri: uri, versionId: 1234567890})
      .result(function(response){
        response.should.equal('SHOULD HAVE FAILED');
        done();
      }, function(error) {
        error.body.errorResponse.messageCode.should.equal('RESTAPI-CONTENTWRONGVERSION');
        done();
      });
    });
    it('should succeed with the rightversionId', function(done) {
      db.documents.remove({uri: uri, versionId: versionId})
      .result(function(response){
        valcheck.isUndefined(response).should.equal(false);
        done();
        })
      .catch(done);
    });
  });
  describe('overwrite', function() {
    var overwriteUri = '/test/version/write1.json';
    var versionId    = null;
    before(function(done){
      db.documents.probe(overwriteUri).result(function(response){
        if (response.exists === true) {
          versionId = response.versionId;
          done();
        } else {
          db.documents.write({
            uri: overwriteUri,
            contentType: 'application/json',
            content: {key1: 'value 1'}
            })
          .result(function(response){
              return db.documents.probe(overwriteUri).result();
            })
          .then(function(response){
            versionId = response.versionId;
            done();
            })
          .catch(done);
        }
        })
      .catch(done);
    });
    it('should fail without a versionId', function(done) {
      db.documents.write({
        uri: overwriteUri,
        contentType: 'application/json',
        content: {key1: 'no version'}
        })
      .result(function(response){
        response.should.equal('SHOULD HAVE FAILED');
        done();
      }, function(error) {
        error.body.errorResponse.messageCode.should.equal('RESTAPI-CONTENTNOVERSION');
        done();
      });
    });
    it('should fail with the wrong versionId', function(done) {
      db.documents.write({
        uri: overwriteUri,
        versionId: 1234567890,
        contentType: 'application/json',
        content: {key1: 'wrong version'}
        })
      .result(function(response){
        response.should.equal('SHOULD HAVE FAILED');
        done();
      }, function(error) {
        error.body.errorResponse.messageCode.should.equal('RESTAPI-CONTENTWRONGVERSION');
        done();
      });
    });
    it('should succeed with the right versionId', function(done) {
      db.documents.write({
        uri: overwriteUri,
        versionId: versionId,
        contentType: 'application/json',
        content: {key1: 'version '+versionId}
        })
      .result(function(response){
        valcheck.isUndefined(response).should.equal(false);
        done();
        })
      .catch(done);
    });
  });
  describe('create', function() {
    var createUri = '/test/version/create1.json';
    before(function(done){
      db.documents.probe(createUri).result(function(response){
        if (response.exists === true) {
          db.documents.remove({uri: createUri, versionId: response.versionId})
          .result(function(response) {done();})
          .catch(done);
        } else {
          done();
        }
        })
      .catch(done);
    });
    after(function(done) {
      db.documents.probe(createUri).result(function(response){
        return db.documents.remove({
          uri: createUri, versionId: response.versionId
          }).result();
        })
      .then(function(response) {done();})
      .catch(done);
    });
    it('should succeed with no version', function(done) {
      db.documents.write({
        uri: createUri,
        contentType: 'application/json',
        content: {key1: 'create with no version'}
        })
      .result(function(response){
        valcheck.isUndefined(response).should.equal(false);
        done();
        })
      .catch(done);
    });
  });
  describe('read', function() {
    var uri = '/test/version/read1.json';
    before(function(done){
      db.documents.probe(uri)
      .result(function(response) {
        if (response.exists === false) {
          db.documents.write({
            uri: uri,
            contentType: 'application/json',
            content: {key1: 'value 1'}
            })
          .result(function(response){done();})
          .catch(done);
        } else {
          done();
        }
        })
      .catch(done);
    });
    it('should return the versionId', function(done) {
      db.documents.read(uri)
      .result(function(documents) {
        valcheck.isArray(documents).should.equal(true);
        documents.length.should.equal(1);
        var document = documents[0];
        document.should.have.property('versionId');
        done();
        })
      .catch(done);
    });
  });
/* TODO:
    read with right versionId should return no content
 */
});
