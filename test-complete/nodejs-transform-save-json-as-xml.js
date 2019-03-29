/*
 * Copyright 2014-2019 MarkLogic Corporation
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

describe('Transform save json as xml', function(){
  before(function(done){
    this.timeout(10000);
    dbWriter.documents.write({
      uri: '/test/transform/savejsonasxmltransform.xml',
      contentType: 'application/json',
      content: {name: 'bob'}
    }).
    result(function(response){done();}, done);
  });

  var transformName = 'to-xml';
  var transformPath = __dirname + '/data/to-xml.xqy';

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

  var uri = '/test/transform/savejsonasxmltransform.xml';

  it('should modify during read', function(done){
    db.documents.read({
      uris: uri,
      transform: [transformName]
    }).
    result(function(response) {
      //console.log(JSON.stringify(response, null, 4));
      response[0].content.should.containEql('<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<name>bob</name>\n');
      response[0].format.should.equal('xml');
      done();
    }, done);
  });

  it('should modify during query', function(done){
    this.timeout(10000);
    db.documents.query(
      q.where(
        q.and(
          q.directory('/test/transform/'),
          q.term('name', 'bob')
        )
      ).
      slice(1, 10, q.transform(transformName))
    ).
    result(function(response) {
      //console.log(JSON.stringify(response, null, 4));
      response[0].content.should.containEql('<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<name>bob</name>');
      response[0].format.should.equal('xml');
      done();
    }, done);
  });

  it('should modify during write', function(done){
    dbWriter.documents.write({
      uri: '/test/transform/write/savejsonasxmltransform.xml',
      contentType: 'application/json',
      content: {name: 'bob'},
      transform: [transformName]
    }).
    result(function(response) {
      db.documents.read('/test/transform/write/savejsonasxmltransform.xml').
      result(function(response) {
        //console.log(JSON.stringify(documents, null, 4));
        response[0].content.should.containEql('<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<name>bob</name>\n');
        response[0].format.should.equal('xml');
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
