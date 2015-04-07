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

describe('Transform with params', function(){
  before(function(done){
    this.timeout(10000);
    dbWriter.documents.write({
      uri: '/test/transform/paramTransform1.json',
      contentType: 'application/json',
      quality: 10,
      content: {title: 'hello world'} 
    },
    {
      uri: '/test/transform/paramTransform2.json',
      contentType: 'application/json',
      quality: 15,
      content: {title: 'here you go'}
    }).
    result(function(response){done();}, done);
  });

  var transformName = 'paramTransform';
  var transformPath = './node-client-api/test-complete/data/paramTransform.js';

  it('should write the transform', function(done){
    this.timeout(10000);
    fs.createReadStream(transformPath).
    pipe(concatStream({encoding: 'string'}, function(source) {
      dbAdmin.config.transforms.write(transformName, 'javascript', source).
      result(function(response){done();}, done);
    }));
  });

  var uri1 = '/test/transform/paramTransform1.json'; 
  var uri2 = '/test/transform/paramTransform2.json'; 

  it('should return transformed content and metadata during read', function(done){
    db.documents.read({
      uris: [uri1, uri2],
      categories: ['content', 'metadata'],
      transform: [transformName, 
        {title: 'new title', myInt: 2, myBool: true}
      ]
    }).
    result(function(response) {
      //console.log(JSON.stringify(response, null, 2));
      response[0].content.title.should.equal('new title');
      response[0].content.intKey.should.equal(2);
      response[0].content.boolKey.should.equal(true);
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
