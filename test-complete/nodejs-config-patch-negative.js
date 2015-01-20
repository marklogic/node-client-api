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
var concatStream = require('concat-stream');
var valcheck = require('core-util-is');

var testconfig = require('../etc/test-config-qa.js');

var marklogic = require('../');
var q = marklogic.queryBuilder;
var p = marklogic.patchBuilder;

var db = marklogic.createDatabaseClient(testconfig.restReaderConnection);
var dbWriter = marklogic.createDatabaseClient(testconfig.restWriterConnection);
var dbAdmin = marklogic.createDatabaseClient(testconfig.restAdminConnection);

describe('Config patch negative test', function(){

  var replaceModule = 'objectify.xqy';
  var replacePath = './node-client-api/test-complete/data/objectify.xqy';
  var replaceModuleInvalid = 'objectifyInvalid.xqy';
  var replacePathInvalid = './node-client-api/test-complete/data/objectifyInvalid.xqy';

  it('should fail to write replacement library with reader user', function(done){
    this.timeout(10000);
    db.config.patch.replace.write(
      replaceModule, 
      [{'role-name':'app-user', capabilities:['execute']}], 
      fs.createReadStream(replacePath)).
    result(function(response) {
      response.should.equal('SHOULD HAVE FAILED');
      done();
    }, function(error) {
      //console.log(error);
      error.statusCode.should.equal(403);
      done();
    });
  });

  it('should fail to read the invalid replacement library', function(done){
    dbAdmin.config.patch.replace.read(replaceModuleInvalid).
    result(function(source) {
      response.should.equal('SHOULD HAVE FAILED');
      done();
    }, function(error) {
      //console.log(error);
      error.statusCode.should.equal(404);
      done();
    });
  });

  /*it('should fail to remove the invalid custom query', function(done){
    dbAdmin.config.patch.replace.remove(replacehModuleInvalid).
    result(function(response) {
      //response.should.equal('SHOULD HAVE FAILED');
      done();
    }, function(error) {
      console.log(error);
      done();
    });
  });*/

  it('should write document for test', function(done){
    dbWriter.documents.write({
      uri: '/test/config/patch/replace/negative/patchReplaceNegative1.json', 
      collections: ['patchReplaceCollection'], 
      contentType: 'application/json',
      content: {
        title: 'this is patch replace'
      }
    }).
    result(function(response) {
      //console.log(response);
      done();
    }, done);
  });

  it('should fail to apply the invalid replacement patch', function(done){
    dbWriter.documents.patch('/test/config/patch/replace/negative/patchReplaceNegative1.json',
      p.library(replaceModuleInvalid),
      p.replace('/title', p.apply('value', {patchKey: 'patch is modified'}))
    ).
    result(function(response) {
      //console.log(response);
      response.should.equal('SHOULD HAVE FAILED');
      done();
    }, function(error) {
      //console.log(error);
      error.statusCode.should.equal(400);
      done();
    });
  });

  it('should remove the document', function(done){
    dbAdmin.documents.removeAll({collection: 'patchReplaceCollection'}).
    result(function(response){
      done();
    }, done);
  });

});
