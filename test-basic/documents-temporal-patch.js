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
var testconfig = require('../etc/test-config.js');
var marklogic = require('../');
var db = marklogic.createDatabaseClient(testconfig.restTemporalConnection);
var p = marklogic.patchBuilder;

describe('temporal patch', function() {
  var content = {
    property1:       'original',
    systemStartTime: '1111-11-11T11:11:11Z',
    systemEndTime:   '9999-12-31T23:59:59Z',
    validStartTime:  '1111-11-11T11:11:11Z',
    validEndTime:    '9999-12-31T23:59:59Z'
  };
  before(function(done){
    db.documents.write({
      documents: {
        uri: 'tempDoc1.json',
        content: content
      },
      temporalCollection: 'temporalCollection'
    }).result(function(response){
      return db.documents.write({
        documents:{
          uri: 'tempDoc2-v1.json',
          content: content,
          temporalDocument: 'tempDoc2.json'
        },
        temporalCollection: 'temporalCollection'
      }).result()
    }).then(function(response){
        done();
    }).catch(done);
  });
  after(function(done){
    db.documents.protect({
      uri: 'tempDoc1.json',
      temporalCollection: 'temporalCollection',
      duration: 'PT0S'
    }).result(function(response){
      return db.documents.wipe({
        uri: 'tempDoc1.json',
        temporalCollection: 'temporalCollection'
      }).result();
    }).then(function(response){
      return db.documents.protect({
        uri: 'tempDoc2.json',
        temporalCollection: 'temporalCollection',
        duration: 'PT0S'
      }).result();
    }).then(function(response){
      return db.documents.wipe({
        uri: 'tempDoc2.json',
        temporalCollection: 'temporalCollection'
      }).result();
    }).then(function(response){
      done();
    }).catch(done);
  });
  it('should patch a temporal document', function(done) {
    db.documents.patch({
      uri: 'tempDoc1.json',
      operations: p.replace('property1', 'replacement'),
      categories: ['content'],
      temporalCollection: 'temporalCollection'
    }).result(function(response) {
      response.should.have.property('uri');
      response.uri.should.equal('tempDoc1.json');
      return db.documents.read(response.uri).result();
    })
    .then(function(response){
      response.should.have.property('length');
      response.length.should.equal(1);
      var content = response[0].content;
      content.should.have.property('property1');
      content.property1.should.equal('replacement');
      done();
    })
    .catch(done);
  });
  it('should patch a temporal document with temporal URI and source URI', function(done) {
    db.documents.patch({
      uri: 'tempDoc2-v2.json',
      operations: p.replace('property1', 'replacement'),
      categories: ['content'],
      sourceDocument: 'tempDoc2-v1.json',
      temporalDocument: 'tempDoc2.json',
      temporalCollection: 'temporalCollection'
    }).result(function(response) {
      response.should.have.property('uri');
      response.uri.should.equal('tempDoc2-v2.json');
      return db.documents.read(response.uri).result();
    }).then(function(response){
      response.should.have.property('length');
      response.length.should.equal(1);
      var content = response[0].content;
      content.should.have.property('property1');
      content.property1.should.equal('replacement');
      done();
    }).catch(done);
  });

});
