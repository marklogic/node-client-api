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

var testconfig = require('../etc/test-config-qa.js');

var marklogic = require('../');
var q = marklogic.queryBuilder;

var db = marklogic.createDatabaseClient(testconfig.restReaderConnection);
var dbWriter = marklogic.createDatabaseClient(testconfig.restWriterConnection);
var dbAdmin = marklogic.createDatabaseClient(testconfig.restAdminConnection);

describe('Document suggest test', function(){
  before(function(done){
    this.timeout(10000);
    dbWriter.documents.write({
      uri: '/test/query/suggest/doc1.json',
      collections: ['suggestCollection'],
      contentType: 'application/json',
      content: {
        defaultWordKey: 'memory',
        taggedWordKey: 'apple',
        otherKey: 'aruba'
        }
      }, { 
      uri: '/test/query/suggest/doc2.json',
      collections: ['suggestCollection'],
      contentType: 'application/json',
      content: {
        defaultWordKey: 'memento',
        taggedWordKey: 'application'
        }
      }, { 
      uri: '/test/query/suggest/doc3.json',
      collections: ['suggestCollection'],
      contentType: 'application/json',
      content: {
        defaultWordKey: 'mendoza',
        taggedWordKey: 'approximate'
        }
      }, { 
      uri: '/test/query/suggest/doc4.json',
      collections: ['suggestCollection'],
      contentType: 'application/json',
      content: {
        defaultWordKey: 'memoir',
        taggedWordKey: 'ape'
        }
      }, { 
        uri: '/test/query/suggest/doc5.json',
        collections: ['suggestCollection'],
        contentType: 'application/json',
        content: {
          defaultWordKey: 'member',
          taggedWordKey: 'akron'
          }
        }).
    result(function(response){done();}, done);
  });

  it('should do suggest with default binding', function(done){
    db.documents.suggest({
      partial: 'mem', 
      query: q.where(
        q.parsedFrom('',
          q.parseBindings(
            q.word('defaultWordKey', q.bindDefault())
          )
        )
      )
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

  it('should do suggest with default binding without parsedFrom', function(done){
    db.documents.suggest(
      'mem', 
      q.where(
        q.directory('/test/query/suggest/', true)
      ),
      q.suggestBindings(
        q.word('defaultWordKey', q.bindDefault())
      )
    ).
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
      partial: 'mem', 
      query: q.where(
        q.parsedFrom('',
          q.parseBindings(
            q.word('defaultWordKey', q.bindDefault())
          )
        )
      ),
      limit: 2 
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
      partial: 'mem', 
      query: q.where(
        q.parsedFrom('',
          q.suggestBindings(
            q.word('defaultWordKey', q.bindDefault())
          )
        )
      ),
      limit: 10
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

  it('should do suggest with binding', function(done){
    db.documents.suggest({
      partial: 'tag1:app', 
      query: q.where(
        q.parsedFrom('',
          q.parseBindings(
            q.word('taggedWordKey', q.bind('tag1'))
          )
        )
      ),
      limit: 4
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

  it('should do suggest with overriden default binding', function(done){
    db.documents.suggest({
      partial: 'a', 
      query: q.where(
        q.parsedFrom('',
          q.parseBindings(
            q.word('taggedWordKey', q.bindDefault())
          )
        )
      ),
      bindings: q.suggestBindings(
        q.word('otherKey', q.bindDefault())
      ),
      limit: 4
    }).
    result(function(response) {
      //console.log(response);
      //response.length.should.equal(1);
      response[0].should.equal('aruba');
      done();
    }, done);
  });

  it('should do suggest with overriden binding', function(done){
    db.documents.suggest({
      partial: 'tag1:a', 
      query: q.where(
        q.parsedFrom('',
          q.parseBindings(
            q.word('taggedWordKey', q.bind('tag1'))
          )
        )
      ),
      bindings: q.suggestBindings(
        q.word('otherKey', q.bind('tag1'))
      ),
      limit: 4
    }).
    result(function(response) {
      //console.log(response);
      //response.length.should.equal(1);
      response[0].should.equal('tag1:aruba');
      done();
    }, done);
  });

  it('should do suggest with binding and limit', function(done){
    db.documents.suggest({
      partial: 'tag1:app', 
      query: q.where(
        q.parsedFrom('',
          q.suggestBindings(
            q.word('taggedWordKey', q.bind('tag1'))
          )
        )
      ),
      limit: 2
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
      partial: 'tag1:a', 
      query: q.where(
        q.parsedFrom('',
          q.parseBindings(
            q.word('taggedWordKey', q.bind('tag1')),
            q.word('otherKey', q.bind('other1'))
          )
        )
      ),
      limit: 2
    }).
    result(function(response) {
      //console.log(response);
      //response.length.should.equal(2);
      //response[0].should.equal('tag1:apple');
      //response[1].should.equal('tag1:application');
      done();
    }, done);
  });

  it('should fail with invalid binding', function(done){
    db.documents.suggest({
      partial: 'a', 
      query: q.where(
        q.parsedFrom('',
          q.parseBindings(
            q.word('taggedWordKey', q.bindDefault())
          )
        )
      ),
      bindings: q.suggestBindings(
        q.word('invalidKey', q.bindDefault())
      ),
      limit: 4
    }).
    result(function(response) {
      //console.log(response);
      response.should.equal('SHOULD HAVE FAILED');
      done();
    }, function(error) {
      //console.log(error);
      error.body.errorResponse.messageCode.should.equal('XDMP-ELEMLXCNNOTFOUND');
      done();
    });
  });

  it('should fail with negative limit', function(done){
    db.documents.suggest({
      partial: 'a', 
      query: q.where(
        q.parsedFrom('',
          q.parseBindings(
            q.word('taggedWordKey', q.bindDefault())
          )
        )
      ),
      bindings: q.suggestBindings(
        q.word('otherKey', q.bindDefault())
      ),
      limit: -4
    }).
    result(function(response) {
      //console.log(response);
      response.should.equal('SHOULD HAVE FAILED');
      done();
    }, function(error) {
      //console.log(JSON.stringify(error, null, 2));
      error.body.errorResponse.messageCode.should.equal('INTERNAL ERROR');
      done();
    });
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
