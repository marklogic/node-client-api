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
var valcheck = require('core-util-is');

var marklogic = require('../');
var q = marklogic.queryBuilder;

var db = marklogic.createDatabaseClient(testconfig.restReaderConnection);
var dbWriter = marklogic.createDatabaseClient(testconfig.restWriterConnection);

describe('Document CRUD negative test', function(){

  it('should fail to create invalid json document', function(done){
    dbWriter.documents.write({
      uri: '/test/negative/invalidDoc.json',
      contentType: 'application/json',
      content: '{"invalid"}'
      }).
    result(function(response) {
      response.should.equal('SHOULD HAVE FAILED');
      done();
    }, function(error) {
      error.body.errorResponse.messageCode.should.equal('XDMP-JSONCHAR');
      error.statusCode.should.equal(400);
      done();
      });
  });

  it('should fail to create invalid xml document', function(done){
    dbWriter.documents.write({
      uri: '/test/negative/invalidXmlDoc.xml',
      contentType: 'application/xml',
      content: '<a><b>foo</a>'
      }).
    result(function(response) {
	 (valcheck.isNullOrUndefined(response.documents[0].contentType)).should.equal(true);
      done();
    }, function(error) {
      console.log(error);
      error.body.errorResponse.messageCode.should.equal('XDMP-DOCNOENDTAG');
      error.statusCode.should.equal(400);
      done();
      });
  });

  it('should fail to create json document with invalid content type', function(done){
    dbWriter.documents.write({
      uri: '/test/negative/invalidType.xml',
      contentType: 'application/json',
      content: { title: 'invalid type' }
      }).
    result(function(response) {
	(valcheck.isNullOrUndefined(response.documents[0].contentType)).should.equal(true);
      done();
    }, function(error) {
      //console.log(error.body);
      error.body.errorResponse.messageCode.should.equal('XDMP-DOCROOTTEXT');
      error.statusCode.should.equal(400);
      done();
      });
  });

  it('should fail to create document with invalid user role', function(done){
    db.documents.write({
      uri: '/test/negative/invalidRole.json',
      contentType: 'application/json',
      content: {title: 'invalid role'}
      }).
    result(function(response) {
      response.should.equal('SHOULD HAVE FAILED');
      done();
    }, function(error) {
      //console.log(error.body);
      error.body.errorResponse.messageCode.should.equal('SEC-PRIV');
      error.statusCode.should.equal(403);
      done();
      });
  });

  it('should fail to remove all document with invalid user role', function(done){
    db.documents.removeAll({all:true}).
    result(function(response) {
      response.should.equal('SHOULD HAVE FAILED');
      done();
    }, function(error) {
      //console.log(error.body);
      error.body.errorResponse.messageCode.should.equal('REST-FAILEDAUTH');
      error.statusCode.should.equal(403);
      done();
      });
  });

  it('should fail to write document without uri', function(done){
    dbWriter.documents.write({
      contentType: 'application/json',
      content: {title: 'no uri'}
      }).
    result(function(response) {
      response.should.equal('SHOULD HAVE FAILED');
      done();
    }, function(error) {
      //console.log(error);
      error.body.errorResponse.messageCode.should.equal('REST-REQUIREDPARAM');
      error.statusCode.should.equal(400);
      done();
      });
  });

  it('should fail to read metadata from non-existent document', function(done){
    db.documents.read({
      uris: '/doc/nonExistent.json',
      categories: ['metadata']
      }).
    result(function(response) {
      response.length.should.equal(0);
      done();
    }, function(error) {
      //console.log(error);
      done();
      });
  });


  /*it('should fail to write with invalid content type', function(done){
    dbWriter.documents.write({
      uri: '/test/negative/invalidDoc',
      contentType: 'foo',
      content: { title: 'invalid' }
      }).
    result(function(response) {
      response.should.equal('SHOULD HAVE FAILED');
      done();
    }, function(error) {
      console.log(error.body);
      console.log(error.body.errorResponse.messageCode);
      error.statusCode.should.equal(400);
      done();
      });
  });*/

});
