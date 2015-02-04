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

describe('Config patch test', function(){

  var replaceModule = 'objectify.xqy';
  var replacePath = './node-client-api/test-complete/data/objectify.xqy';

  it('should write the replacement library', function(done){
    this.timeout(10000);
    dbAdmin.config.patch.replace.write(
      replaceModule, 
      [{'role-name':'app-user', capabilities:['execute']}], 
      fs.createReadStream(replacePath)).
    result(function(response){
      //console.log(response);
      response.path.should.equal('/marklogic/patch/apply/objectify.xqy');
      done();
    }, done);
  });

  it('should read the replacement library', function(done){
    dbAdmin.config.patch.replace.read(replaceModule).
    result(function(source){
      //(!valcheck.isNullOrUndefined(source)).should.equal(true);
      //console.log(source);
      source.should.containEql('declare function objectify');
      done();
    }, done);
  });
    
  it('should list the replacement library', function(done){
    dbAdmin.config.patch.replace.list().
    result(function(response){
      //console.log(response);
      response.should.have.property('assets');
      response.assets[0].asset.should.equal('/ext/marklogic/patch/apply/objectify.xqy');
      done();
    }, done);
  });

  it('should remove the replacement library', function(done){
    dbAdmin.config.patch.replace.remove(replaceModule).
    result(function(response){
      //console.log(response);
      //response.path.should.equal('/marklogic/query/custom/directoryConstraint.xqy');
      done();
    }, done);
  });

  it('should list 0 replacement library', function(done){
    dbAdmin.config.patch.replace.list().
    result(function(response){
      //console.log(response);
      response.assets.length.should.equal(0);
      done();
    }, done);
  });

  it('should write the replacement library for the test', function(done){
    this.timeout(10000);
    dbAdmin.config.patch.replace.write(
      replaceModule, 
      [{'role-name':'app-user', capabilities:['execute']}], 
      fs.createReadStream(replacePath)).
    result(function(response){
      done();
    }, done);
  });

  it('should write document for test', function(done){
    dbWriter.documents.write({
      uri: '/test/config/patch/replace/patchReplace1.json', 
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

  it('should apply the replacement patch', function(done){
    dbWriter.documents.patch('/test/config/patch/replace/patchReplace1.json',
      p.library(replaceModule),
      p.replace('/title', p.apply('value', {patchKey: 'patch is modified'}))
    ).
    result(function(response) {
      //console.log(response);
      response.uri.should.equal('/test/config/patch/replace/patchReplace1.json');
      done();
    }, done);
  });

  it('should read the document for test', function(done){
    db.documents.read('/test/config/patch/replace/patchReplace1.json').
    result(function(response) {
      //console.log(JSON.stringify(response, null, 2));
      response[0].content.title.patchKey.should.equal('patch is modified');
      done();
    }, done);
  });

  it('should remove the replacement library from the test', function(done){
    dbAdmin.config.patch.replace.remove(replaceModule).
    result(function(response){
      done();
    }, done);
  });

  it('should remove the document', function(done){
    dbAdmin.documents.removeAll({collection: 'patchReplaceCollection'}).
    result(function(response){
      done();
    }, done);
  });

});
