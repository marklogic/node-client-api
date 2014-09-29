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

var fs     = require('fs');
var stream = require('stream');
var util   = require('util');

var concatStream = require('concat-stream');
var valcheck     = require('core-util-is');

var testconfig = require('../etc/test-config.js');
var testutil   = require('./test-util.js');

var marklogic = require('../');
var q = marklogic.queryBuilder;

var db = marklogic.createDatabaseClient(testconfig.restWriterConnection);

describe('quick path', function(){
  before(function(done){
    db.documents.write({
        uri: '/test/quick/object1.json',
        collections: '/quickdocs',
        contentType: 'application/json',
        content: {quickKey: 'quickMatch'}
      },{
        uri: '/test/quick/object2.json',
        collections: '/quickdocs',
        contentType: 'application/json',
        content: {quickKey: 'quickMatch'}
      }).
    result(function(response){done();}, done);
  });
  it('should write objects', function(done){
    db.writeCollection(
      '/quickdocs',
      {quickKey: 'quick value 1'},
      {quickKey: 'quick value 2'}
      ).result().
    then(function(uris){
      valcheck.isUndefined(uris).should.equal(false);
      uris.length.should.equal(2);
      return db.documents.read(uris).result();
      }, done).
    then(function(documents) {
        valcheck.isUndefined(documents).should.equal(false);
        documents.length.should.equal(2);
        documents[0].should.have.property('content');
        documents[0].content.should.have.property('quickKey');
        documents[1].should.have.property('content');
        documents[1].content.should.have.property('quickKey');
        done();
        }, done);
  });
  it('should read objects', function(done){
    db.read('/test/quick/object1.json', '/test/quick/object2.json').
    result(function(objects) {
      valcheck.isUndefined(objects).should.equal(false);
      objects.length.should.equal(2);
      objects[0].should.have.property('quickKey');
      objects[0].quickKey.should.equal('quickMatch');
      objects[1].should.have.property('quickKey');
      objects[1].quickKey.should.equal('quickMatch');
      done();
      }, done);
  });
  it('should query objects', function(done){
    db.queryCollection(
        '/quickdocs',
        q.where(q.byExample({
          quickKey: 'quickMatch'
        }))).
    result(function(objects) {
      valcheck.isUndefined(objects).should.equal(false);
      objects.length.should.equal(2);
      objects[0].should.have.property('quickKey');
      objects[0].quickKey.should.equal('quickMatch');
      objects[1].should.have.property('quickKey');
      objects[1].quickKey.should.equal('quickMatch');
      done();
      }, done);
  });
  it('should remove', function(done){
    db.remove('/test/quick/object1.json').
    result(function(result) {
      return db.probe('/test/quick/object1.json').result();
      }, done).
    then(function(exists) {
      exists.should.eql(false);
      done();
      }, done);
  });
  it('should probe', function(done){
    db.probe('/test/quick/object2.json').
    result(function(exists) {
      exists.should.eql(true);
      done();
      }, done);
  });
  it('should remove collections', function(done){
    this.timeout(3000);
    db.removeCollection('/quickdocs').
    result(function(result) {
      return db.probe('/test/quick/object2.json').result();
      }, done).
    then(function(exists) {
      exists.should.eql(false);
      done();
      }, done);
  });
  // TODO: patch?
});