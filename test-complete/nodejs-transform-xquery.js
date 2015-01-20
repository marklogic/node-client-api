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

var db = marklogic.createDatabaseClient(testconfig.restReaderConnection);
var dbWriter = marklogic.createDatabaseClient(testconfig.restWriterConnection);
var dbAdmin = marklogic.createDatabaseClient(testconfig.restAdminConnection);

describe('Transform test with xquery', function(){
  before(function(done){
    this.timeout(10000);
    dbWriter.documents.write({
      uri: '/test/transform/xquerytransform.json',
      contentType: 'application/json',
      content: {title: 'transform test with xquery'} 
    }).
    result(function(response){done();}, done);
  });

  var transformName = 'flagParam';
  var transformPath = './node-client-api/test-complete/data/flagTransform.xqy';

  it('should write the transform', function(done){
    this.timeout(10000);
    fs.createReadStream(transformPath).
    pipe(concatStream({encoding: 'string'}, function(source) {
      dbAdmin.config.transforms.write(transformName, 'xquery', source).
      result(function(response){done();}, done);
    }));
  });

  it('should read the transform', function(done){
    dbAdmin.config.transforms.read(transformName).
    result(function(source){
      (!valcheck.isNullOrUndefined(source)).should.equal(true);
      done();
    }, done);
  });
    
  it('should list the transform', function(done){
    dbAdmin.config.transforms.list().
    result(function(response){
      response.should.have.property('transforms');
      done();
    }, done);
  });
  
  var uri = '/test/transform/xquerytransform.json'; 

  it('should modify during read', function(done){
    db.documents.read({
      uris: uri,
      transform: [transformName, {flag: 'hello'}]
    }).
    result(function(response) {
      //console.log(JSON.stringify(response, null, 4));
      response[0].content.flagParam.should.equal('hello');
      done();
    }, done);
  });

  it('should modify during query', function(done){
    db.documents.query(
      q.where(
        q.term('title', 'xquery')
      ).
      slice(1, 10, q.transform(transformName, {flag: 'world'}))
    ).
    result(function(response) {
      //console.log(JSON.stringify(response, null, 4));
      response[0].content.flagParam.should.equal('world');
      done();
    }, done);
  });

  it('should modify during write', function(done){
    dbWriter.documents.write({
      uri: '/test/transform/write/xquerytransform.json',
      contentType: 'application/json',
      content: {readKey: 'after write'},
      transform: [transformName, {flag: 'sunshine'}]
    }).
    result(function(response) {
      db.documents.read('/test/transform/write/xquerytransform.json').
      result(function(documents) {
        //console.log(JSON.stringify(documents, null, 4));
        documents[0].content.flagParam.should.equal('sunshine');
        done();
      }, done);
    }, done);
  });

  it('should remove the documents', function(done){
    dbAdmin.documents.removeAll({
      directory: '/test/transform/'
    }).
    result(function(response) {
      response.should.be.ok;
      done();
    }, done);
  });

});
