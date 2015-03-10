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

describe('Transform test with null output -- issue #147', function(){
  before(function(done){
    this.timeout(10000);
    dbWriter.documents.write({
      uri: '/test/transform/emptyTransform1.json',
      contentType: 'application/json',
      quality: 10,
      content: {title: 'hello world'} 
    },
    {
      uri: '/test/transform/emptyTransform2.json',
      contentType: 'application/json',
      quality: 15,
      content: {title: 'here you go'}
    }).
    result(function(response){done();}, done);
  });

  var transformName = 'emptyTransform';
  var transformPath = './node-client-api/test-complete/data/emptyTransform.js';

  it('should write the transform', function(done){
    this.timeout(10000);
    fs.createReadStream(transformPath).
    pipe(concatStream({encoding: 'string'}, function(source) {
      dbAdmin.config.transforms.write(transformName, 'javascript', source).
      result(function(response){done();}, done);
    }));
  });

  var uri1 = '/test/transform/emptyTransform1.json'; 
  var uri2 = '/test/transform/emptyTransform2.json'; 

  it('should return null transform and metadata during read', function(done){
    db.documents.read({
      uris: [uri1, uri2],
      categories: ['content', 'metadata'],
      transform: transformName
    }).
    result(function(response) {
      //console.log(JSON.stringify(response, null, 2));
      response[0].uri.should.equal(uri1);
      response[0].contentLength.should.equal('0');
      response[0].quality.should.equal(10);
      (response[0].content === null).should.be.true;
      response[1].uri.should.equal(uri2);
      response[1].contentLength.should.equal('0');
      response[1].quality.should.equal(15);
      (response[1].content === null).should.be.true;
      done();
    }, done);
  });

  it('should write content with null transform and metadata', function(done){
    dbWriter.documents.write({
      uri: '/test/transform/emptyTransform3.json',
      contentType: 'application/json',
      quality: 20,
      content: {title: 'hi there'},
      transform: transformName  
    },
    { 
      uri: '/test/transform/emptyTransform4.json',
      contentType: 'application/json',
      quality: 25,
      content: {title: 'this is example'}  ,
      transform: transformName
    }).
    result(function(response) {
      //console.log(JSON.stringify(response, null, 2));
      done();
    }, done);
  });

  var uri3 = '/test/transform/emptyTransform3.json'; 
  var uri4 = '/test/transform/emptyTransform4.json'; 

  it('should return null content and metadata on read', function(done){
    db.documents.read({
      uris: [uri3, uri4],
      categories: ['content', 'metadata'],
      transform: transformName
    }).
    result(function(response) {
      //console.log(JSON.stringify(response, null, 2));
      response[0].uri.should.equal(uri3);
      response[0].contentLength.should.equal('0');
      response[0].quality.should.equal(20);
      (response[0].content === null).should.be.true;
      response[1].uri.should.equal(uri4);
      response[1].contentLength.should.equal('0');
      response[1].quality.should.equal(25);
      (response[1].content === null).should.be.true;
      done();
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

  it('should remove the transform', function(done){
    dbAdmin.config.transforms.remove(transformName).
    result(function(response){
      response.should.be.ok;
      done();
    }, done);
  });

});
