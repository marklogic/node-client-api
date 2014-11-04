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

var testconfig = require('../etc/test-config.js');

var marklogic = require('../');
var q = marklogic.queryBuilder;

var db = marklogic.createDatabaseClient(testconfig.restReaderConnection);
var dbWriter = marklogic.createDatabaseClient(testconfig.restWriterConnection);
var dbAdmin = marklogic.createDatabaseClient(testconfig.restAdminConnection);

describe('Document suggest test', function(){
  before(function(done){
    this.timeout(3000);
    dbWriter.documents.write({
      uri: '/test/query/suggest/doc1.json',
      collections: ['suggestCollection'],
      contentType: 'application/json',
      content: {
        defaultKey: 'memory',
        taggedKey: 'apple',
        otherKey: 'aruba'
        }
      }, { 
      uri: '/test/query/suggest/doc2.json',
      collections: ['suggestCollection'],
      contentType: 'application/json',
      content: {
        defaultKey: 'memento',
        taggedKey: 'application'
        }
      }, { 
      uri: '/test/query/suggest/doc3.json',
      collections: ['suggestCollection'],
      contentType: 'application/json',
      content: {
        defaultKey: 'mendoza',
        taggedKey: 'approximate'
        }
      }, { 
      uri: '/test/query/suggest/doc4.json',
      collections: ['suggestCollection'],
      contentType: 'application/json',
      content: {
        defaultKey: 'memoir',
        taggedKey: 'ape'
        }
      }, { 
        uri: '/test/query/suggest/doc5.json',
        collections: ['suggestCollection'],
        contentType: 'application/json',
        content: {
          defaultKey: 'member',
          taggedKey: 'akron'
          }
        }).
    result(function(response){done();}, done);
  });

  it('should do suggest with default binding', function(done){
    db.documents.suggest('mem', q.parseBindings(q.word('defaultKey', q.bindDefault()))).
    result(function(response) {
      //console.log(response);
      response.length.should.equal(4);
      response[0].should.equal('member');
      response[1].should.equal('memento');
      response[2].should.equal('memoir');
      response[3].should.equal('memory');
      done();
    }, done);
  });

  it('should do suggest with default binding and limit', function(done){
    db.documents.suggest({
      input: 'mem', 
      limit: 2, 
      bindings: q.parseBindings(q.word('defaultKey', q.bindDefault()))
    }).
    result(function(response) {
      //console.log(response);
      response.length.should.equal(2);
      response[0].should.equal('member');
      response[1].should.equal('memento');
      done();
    }, done);
  });

  it('should do suggest with default binding and exceeding limit', function(done){
    db.documents.suggest({
      input: 'mem', 
      limit: 10,
      bindings: q.parseBindings(q.word('defaultKey', q.bindDefault()))
    }).
    result(function(response) {
      //console.log(response);
      response.length.should.equal(4);
      response[0].should.equal('member');
      response[1].should.equal('memento');
      response[2].should.equal('memoir');
      response[3].should.equal('memory');
      done();
    }, done);
  });

  /*it('should do suggest with multiple bindings, additional queries, and limit', function(done){
    db.documents.suggest({
      input: 'mem', 
      limit: 3, 
      queries: ['add1:akron'],
      bindings: q.parseBindings(q.word('defaultKey', q.bindDefault()),
                                q.value('taggedKey', q.bind('add1')))
    }).
    result(function(response) {
      console.log(response);
      //response.length.should.equal(2);
      //response[0].should.equal('member');
      //response[1].should.equal('memento');
      done();
    }, done);
  });*/

  it('should do suggest with binding', function(done){
    db.documents.suggest({
      input: 'tag1:app', 
      limit: 4,
      bindings: q.parseBindings(q.word('taggedKey', q.bind('tag1')))
    }).
    result(function(response) {
      //console.log(response);
      response.length.should.equal(3);
      response[0].should.equal('tag1:apple');
      response[1].should.equal('tag1:application');
      response[2].should.equal('tag1:approximate');
      done();
    }, done);
  });

  it('should do suggest with binding and limit', function(done){
    db.documents.suggest({
      input: 'tag1:app', 
      limit: 2,
      bindings: q.parseBindings(q.word('taggedKey', q.bind('tag1')))
    }).
    result(function(response) {
      //console.log(response);
      response.length.should.equal(2);
      response[0].should.equal('tag1:apple');
      response[1].should.equal('tag1:application');
      done();
    }, done);
  });

  it('should do suggest with multiple bindings', function(done){
    db.documents.suggest({
      input: 'tag1:app', 
      limit: 2,
      bindings: q.parseBindings(q.word('taggedKey', q.bind('tag1')),
                                q.word('otherKey', q.bind('other1')))
    }).
    result(function(response) {
      console.log(response);
      //response.length.should.equal(2);
      //response[0].should.equal('tag1:apple');
      //response[1].should.equal('tag1:application');
      done();
    }, done);
  });

  it('should remove the documents', function(done){
    dbAdmin.documents.removeAll({
      directory: '/test/query/suggest/'
    }).
    result(function(response) {
      response.should.be.ok;
      done();
    }, done);
  });
});
