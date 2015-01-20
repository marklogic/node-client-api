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

describe('Transform test with combination', function(){
  /*before(function(done){
    this.timeout(10000);
    dbWriter.documents.write({
      uri: '/test/transform/comboTransform.json',
      contentType: 'application/json',
      content: {title: 'combo'} 
    }).
    result(function(response){done();}, done);
  });*/

  var transformName1 = 'flagParam';
  var transformPath1 = './node-client-api/test-complete/data/flagTransform.xqy';
  var transformName2 = 'timestamp';
  var transformPath2 = './node-client-api/test-complete/data/timestampTransform.js';

  it('should write the transform', function(done){
    this.timeout(10000);
    fs.createReadStream(transformPath1).
    pipe(concatStream({encoding: 'string'}, function(source) {
      dbAdmin.config.transforms.write(transformName1, 'xquery', source).
      result(function(response){done();}, done);
    }));
  });

  it('should write the transform', function(done){
    this.timeout(10000);
    fs.createReadStream(transformPath2).
    pipe(concatStream({encoding: 'string'}, function(source) {
      dbAdmin.config.transforms.write(transformName2, 'javascript', source).
      result(function(response){done();}, done);
    }));
  });
  
  var uri = '/test/transform/comboTransform.json'; 

  it('should modify during write and read', function(done){
  this.timeout(10000);
    dbWriter.documents.write({
      uri: '/test/transform/comboTransform.json',
      contentType: 'application/json',
      content: {title: 'combo transform'},
      transform: [transformName1, {flag: 'mountain'}]
    }).
    result(function(response) {
      db.documents.read({uris: '/test/transform/comboTransform.json', transform: transformName2}).
      result(function(documents) {
        //console.log(JSON.stringify(documents, null, 4));
        documents[0].content.flagParam.should.equal('mountain');
        documents[0].content.should.have.property('timestamp');
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
