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
var q = marklogic.queryBuilder;

var db = marklogic.createDatabaseClient(testconfig.restWriterConnection);
var restAdminDB = marklogic.createDatabaseClient(testconfig.restAdminConnection);

describe('document transform', function(){
  var xqyTransformName = 'flagParam';
  var xqyTransformPath = './test-basic/data/flagTransform.xqy';
  describe('when configuring', function() {
    it('should write the transform with positional parameters', function(done){
      this.timeout(3000);
      restAdminDB.config.transforms.write(xqyTransformName, 'xquery', fs.createReadStream(xqyTransformPath))
      .result(function(response){
        done();
        })
      .catch(done);
    });
    it('should write the transform with named parameters', function(done){
      this.timeout(3000);
      restAdminDB.config.transforms.write({
        name:        xqyTransformName,
        title:       'The Flag Transform',
        description: 'Raising the flag.',
        provider:    'Banner Business',
        version:     0.1,
        format:      'xquery',
        source:      fs.createReadStream(xqyTransformPath)
        })
      .result(function(response){
        done();
        })
      .catch(done);
    });
    it('should read the transform', function(done){
      restAdminDB.config.transforms.read(xqyTransformName)
      .result(function(source){
        (!valcheck.isNullOrUndefined(source)).should.equal(true);
        done();
        })
      .catch(done);
    });
    it('should list the transform', function(done){
      db.config.transforms.list()
      .result(function(response){
        response.should.have.property('transforms');
        response.transforms.should.have.property('transform');
        response.transforms.transform.length.should.be.greaterThan(0);
        response.transforms.transform.some(function(item){
          return item.name === xqyTransformName;
          }).should.equal(true);
        done();
        })
      .catch(done);
    });
    it('should delete the transform', function(done){
      restAdminDB.config.transforms.remove(xqyTransformName)
      .result(function(response){
        done();
        })
      .catch(done);
    });
    // TODO: test streaming of source and list
  });
  describe('when using XQuery', function() {
    var uri = '/test/write/transformContent1.json';
    before(function(done){
      this.timeout(3000);
      restAdminDB.config.transforms.write(xqyTransformName, 'xquery', fs.createReadStream(xqyTransformPath))
      .result(function(response){
        done();
        })
      .catch(done);
    });
    it('should modify during write', function(done){
      db.documents.write({
        uri: uri,
        contentType: 'application/json',
        content: {key1: 'value 1'},
        transform: [xqyTransformName, {flag:'tested1'}]
        })
      .result(function(response) {
        return db.documents.read(uri).result();
        })
      .then(function(documents) {
        documents.length.should.equal(1);
        documents[0].content.flagParam.should.equal('tested1');
        done();
        })
      .catch(done);
    });
    it('should modify during read', function(done){
      db.documents.read({
        uris: uri,
        transform: [xqyTransformName, {flag:'tested2'}]
        })
      .result(function(documents) {
        documents.length.should.equal(1);
        documents[0].content.flagParam.should.equal('tested2');
        done();
        })
      .catch(done);
    });
    it('should modify during query', function(done){
      db.documents.query(
          q.where(
            q.document(uri)
            ).
          slice(1, 10,
            q.transform(xqyTransformName, {flag:'tested3'})
            )
          )
        .result(function(documents) {
          documents.length.should.equal(1);
          documents[0].content.flagParam.should.equal('tested3');
          done();
          })
        .catch(done);
    });
  });
  describe('when using JavaScript', function() {
    var jsTransformName = 'timestamp';
    var jsTransformPath = './test-basic/data/timestampTransform.js';
    var readUri  = '/test/write/readTransform.json';
    var writeUri = '/test/write/writeTransform.json';
    before(function(done){
      this.timeout(3000);
      restAdminDB.config.transforms.write(jsTransformName, 'javascript', fs.createReadStream(jsTransformPath))
      .result(function(response){
        return db.documents.write({
          uri: readUri,
          contentType: 'application/json',
          content: {readKey: 'read value'}
          }).result();
        })
      .then(function(response){done();})
      .catch(done);
    });
    it('should modify during write', function(done){
      db.documents.write({
        uri: writeUri,
        contentType: 'application/json',
        content: {writeKey: 'write value'},
        transform: jsTransformName
        })
      .result(function(response) {
        return db.documents.read(writeUri).result();
        })
      .then(function(documents) {
        documents.length.should.equal(1);
        documents[0].content.should.have.property('timestamp');
        documents[0].content.should.have.property('userName');
        documents[0].content.userName.should.eql('rest-writer');
        done();
        })
      .catch(done);
    });
    it('should modify during read', function(done){
      db.documents.read({
        uris: readUri,
        transform: jsTransformName
        })
      .result(function(documents) {
        documents.length.should.equal(1);
        documents[0].content.should.have.property('timestamp');
        documents[0].content.should.have.property('userName');
        documents[0].content.userName.should.eql('rest-writer');
        done();
        })
      .catch(done);
    });
    it('should modify during query', function(done){
      db.documents.query(
          q.where(
            q.document(readUri)
            ).
          slice(1, 10,
            q.transform(jsTransformName)
            )
          )
        .result(function(documents) {
          documents.length.should.equal(1);
          documents[0].content.should.have.property('timestamp');
          documents[0].content.should.have.property('userName');
          documents[0].content.userName.should.eql('rest-writer');
          done();
          })
        .catch(done);
    });
  });
});
