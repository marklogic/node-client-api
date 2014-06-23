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

var fs = require('fs');
var concatStream = require('concat-stream');
var valcheck = require('core-util-is');

var testutil = require('./test-util.js');

var marklogic = require('../');

var db = marklogic.createDatabaseClient(testutil.restWriterConnection);
var dbAdmin = marklogic.createDatabaseClient(testutil.restAdminConnection);

describe('document versions', function() {
  var originalUpdatePolicy = null;
  before(function(done) {
    dbAdmin.config.properties.read().result(function(properties) {
      originalUpdatePolicy = properties['update-policy'];
      dbAdmin.config.properties.write({'update-policy':'version-required'}).
      result(function(response) {
        done();
      }, done);
    }, done);
  });
  after(function(done) {
    dbAdmin.config.properties.write({'update-policy':originalUpdatePolicy}).
    result(function(response) {
      done();
    }, done);
  });
  describe('check', function() {
    var uri = '/test/version/check1.json';
    before(function(done){
      db.documents.write({
        uri: uri,
        contentType: 'application/json',
        content: {key1: 'value 1'}
        }).
        result(function(response){done();}, done);
    });
    it('should return the versionId', function(done) {
      db.check(uri).
      result(function(response) {
        valcheck.isUndefined(response).should.equal(false);
        valcheck.isUndefined(response.versionId).should.equal(false);
        done();
        }, done);
    });
  });
  describe('delete', function() {
    var uri       = '/test/version/del1.json';
    var versionId = null;
    before(function(done){
      db.documents.write({
        uri: uri,
        contentType: 'application/json',
        content: {key1: 'value 1'}
        }).result().
      then(function(response){
          return db.check(uri).result();
        }).
      then(function(response){
        versionId = response.versionId;
        done();
        }, done);
    });
    it('should fail to delete without a versionId', function(done) {
      db.documents.remove(uri).
      result(function(response){
        response.should.equal('SHOULD HAVE FAILED');
        done();
      }, function(error) {
        (error.indexOf('RESTAPI-CONTENTNOVERSION') > -1).should.equal(true);
        done();
      });
    });
    it('should fail to delete with the wrong versionId', function(done) {
      db.documents.remove({uri: uri, versionId: 1234567890}).
      result(function(response){
        response.should.equal('SHOULD HAVE FAILED');
        done();
      }, function(error) {
        (error.indexOf('RESTAPI-CONTENTWRONGVERSION') > -1).should.equal(true);
        done();
      });
    });
    it('should delete with the rightversionId', function(done) {
      db.documents.remove({uri: uri, versionId: versionId}).
      result(function(response){
        valcheck.isUndefined(response).should.equal(false);
        done();
      }, done);
    });
  });
  describe('read', function() {
  });
  describe('write', function() {
  });
/* TODO:
    read without versionId should return versionId with content
    read with wrong versionId should return versionId with content 
    read with right versionId should return no content
    write of new without versionId should succeed
    write of existing without versionId should fail
    write of existing with wrong versionId should fail
 */
});
