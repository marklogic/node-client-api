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

describe('patch datatypes test', function(){

  var replaceModule = 'objectify.xqy';
  var replacePath = './node-client-api/test-complete/data/objectify.xqy';

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
      uri: '/test/patch/datatypes/patchDatatypes1.json', 
      collections: ['patchDatatypesCollection'], 
      contentType: 'application/json',
      content: {
        title: 'hello',
        number: 5,
        day: 'Sunday',
        amount: 8.4
      }
    }).
    result(function(response) {
      //console.log(response);
      done();
    }, done);
  });

  it('should apply long datatype', function(done){
    dbWriter.documents.patch('/test/patch/datatypes/patchDatatypes1.json',
      p.replace('/number', p.apply('ml.add', p.datatype('long'), '829394845')
    )).
    result(function(response) {
      //console.log(response);
      response.uri.should.equal('/test/patch/datatypes/patchDatatypes1.json');
      done();
    }, done);
  });

  it('should apply date datatype', function(done){
    dbWriter.documents.patch('/test/patch/datatypes/patchDatatypes1.json',
      p.replace('/day', p.apply('ml.concat-after', p.datatype('date'), '2015-01-13')
    )).
    result(function(response) {
      //console.log(response);
      response.uri.should.equal('/test/patch/datatypes/patchDatatypes1.json');
      done();
    }, done);
  });

  it('should apply double datatype', function(done){
    dbWriter.documents.patch('/test/patch/datatypes/patchDatatypes1.json',
      p.replace('/amount', p.apply('ml.multiply', p.datatype('double'), '0.5')
    )).
    result(function(response) {
      //console.log(response);
      response.uri.should.equal('/test/patch/datatypes/patchDatatypes1.json');
      done();
    }, done);
  });

  it('should read the document for test', function(done){
    db.documents.read('/test/patch/datatypes/patchDatatypes1.json').
    result(function(response) {
      //console.log(JSON.stringify(response, null, 2));
      response[0].content.number.should.equal(829394850);
      response[0].content.day.should.equal('Sunday2015-01-13');
      response[0].content.amount.should.equal(4.2);
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
    dbAdmin.documents.removeAll({collection: 'patchDatatypesCollection'}).
    result(function(response){
      done();
    }, done);
  });

});
