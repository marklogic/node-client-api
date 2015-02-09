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
      })
    .result(function(response){done();})
    .catch(done);
  });
  it('should create objects', function(done){
    db.createCollection(
      '/quickdocs',
      {quickKey: 'quick value 1'},
      {quickKey: 'quick value 2'}
      )
    .result(function(uris){
      valcheck.isUndefined(uris).should.equal(false);
      uris.length.should.equal(2);
      return db.documents.read({uris:uris, categories:['content', 'collections']}).result();
      })
    .then(function(documents) {
      valcheck.isUndefined(documents).should.equal(false);
      documents.length.should.equal(2);
      documents[0].should.have.property('content');
      documents[0].content.should.have.property('quickKey');
      documents[0].should.have.property('collections');
      documents[0].collections[0].should.equal('/quickdocs');
      documents[1].should.have.property('content');
      documents[1].content.should.have.property('quickKey');
      documents[1].should.have.property('collections');
      documents[1].collections[0].should.equal('/quickdocs');
      done();
      })
    .catch(done);
  });
  it('should write a mapping', function(done){
    db.writeCollection(
      '/quickmapped',
      {
        '/quickmapped/doc1.json': {mappedKey: 'quick value 1'},
        '/quickmapped/doc2.xml':  '<quickDoc>quick content 2</quickDoc>'
      }
      )
    .result(function(uris){
      valcheck.isUndefined(uris).should.equal(false);
      uris.length.should.equal(2);
      return db.documents.read({uris:uris, categories:['content', 'collections']}).result();
      })
    .then(function(documents) {
      valcheck.isUndefined(documents).should.equal(false);
      documents.length.should.equal(2);
      documents[0].should.have.property('content');
      documents[0].content.should.have.property('mappedKey');
      documents[0].should.have.property('collections');
      documents[0].collections[0].should.equal('/quickmapped');
      documents[1].should.have.property('content');
      documents[1].content.should.containEql('<quickDoc>quick content 2</quickDoc>');
      documents[1].should.have.property('collections');
      documents[1].collections[0].should.equal('/quickmapped');
      done();
      })
    .catch(done);
  });
  it('should read objects', function(done){
    db.read('/test/quick/object1.json', '/test/quick/object2.json')
    .result(function(objects) {
      valcheck.isUndefined(objects).should.equal(false);
      objects.length.should.equal(2);
      objects[0].should.have.property('quickKey');
      objects[0].quickKey.should.equal('quickMatch');
      objects[1].should.have.property('quickKey');
      objects[1].quickKey.should.equal('quickMatch');
      done();
      })
    .catch(done);
  });
  it('should query objects', function(done){
    db.queryCollection(
        '/quickdocs',
        q.where(q.byExample({
          quickKey: 'quickMatch'
        })))
    .result(function(objects) {
      valcheck.isUndefined(objects).should.equal(false);
      objects.length.should.equal(2);
      objects[0].should.have.property('quickKey');
      objects[0].quickKey.should.equal('quickMatch');
      objects[1].should.have.property('quickKey');
      objects[1].quickKey.should.equal('quickMatch');
      done();
      })
    .catch(done);
  });
  it('should remove a document', function(done) {
    var docUri = '/test/quick/object1.json';
    db.remove(docUri)
    .result(function(uri) {
      docUri.should.eql(uri);
      return db.probe(docUri).result();
      })
    .then(function(exists) {
      exists.should.eql(false);
      done();
      })
    .catch(done);
  });
  it('should probe', function(done){
    db.probe('/test/quick/object2.json')
    .result(function(exists) {
      exists.should.eql(true);
      done();
      })
    .catch(done);
  });
  it('should remove a collection', function(done){
    var collectionUri = '/quickdocs';
    this.timeout(3000);
    db.removeCollection(collectionUri)
    .result(function(collection) {
      collectionUri.should.eql(collection);
      return db.probe('/test/quick/object2.json').result();
      })
    .then(function(exists) {
      exists.should.eql(false);
      done();
      })
    .catch(done);
  });
});
