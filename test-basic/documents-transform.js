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

var testconfig = require('../etc/test-config.js');

var marklogic = require('../');

var db = marklogic.createDatabaseClient(testconfig.restWriterConnection);
var restAdminDB = marklogic.createDatabaseClient(testconfig.restAdminConnection);

describe('document transform', function(){
  var transformName = 'flagParam';
  var transformPath = './test-basic/data/flagTransform.xqy';
  describe('when configuring', function() {
    it('should write the transform', function(done){
      this.timeout(3000);
      fs.createReadStream(transformPath).
      pipe(concatStream({encoding: 'string'}, function(source) {
        restAdminDB.config.transforms.write(transformName, 'xquery', source).
        result(function(response){
          done();
        }, done);
      }));
    });
    it('should read the transform', function(done){
      restAdminDB.config.transforms.read(transformName).
      result(function(source){
        (!valcheck.isNullOrUndefined(source)).should.equal(true);
        done();
      }, done);
    });
    it('should list the transform', function(done){
      db.config.transforms.list().
      result(function(response){
        response.should.have.property('transforms');
        response.transforms.should.have.property('transform');
        response.transforms.transform.length.should.equal(1);
        response.transforms.transform[0].name.should.equal(transformName);
        done();
      }, done);
    });
    it('should delete the transform', function(done){
      restAdminDB.config.transforms.remove(transformName).
      result(function(response){
        done();
      }, done);
    });
    // TODO: test streaming of source and list
  });
  describe('when using', function() {
    var uri = '/test/write/transformContent1.json';
    before(function(done){
      this.timeout(3000);
      fs.createReadStream(transformPath).
      pipe(concatStream({encoding: 'string'}, function(source) {
        restAdminDB.config.transforms.write(transformName, 'xquery', source).
        result(function(response){
          done();
        }, done);
      }));
    });
    it('should modify during write', function(done){
      db.write({
        uri: uri,
        contentType: 'application/json',
        content: {key1: 'value 1'},
        transform: [transformName, {flag:'tested1'}]
        }).
        result(function(response) {
          db.read(uri).
          result(function(documents) {
            documents.length.should.equal(1);
            documents[0].content.flagParam.should.equal('tested1');
          done();
          }, done);
        }, done);
    });
    it('should modify during read', function(done){
      db.read({
        uris: uri,
        transform: [transformName, {flag:'tested2'}]
        }).
        result(function(documents) {
          documents.length.should.equal(1);
          documents[0].content.flagParam.should.equal('tested2');
          done();
          }, done);
    });
  });
});
