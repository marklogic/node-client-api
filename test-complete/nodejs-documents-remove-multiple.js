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

describe('Multiple document remove test', function() {

  before(function(done) {
    this.timeout(10000);
    dbWriter.documents.write({
      uri: '/test/remove/mult/doc1.json',
      contentType: 'application/json',
      content: {
        title: 'document 1'
      }
    }, {
      uri: '/test/remove/mult/doc2.json',
      contentType: 'application/json',
      content: {
        title: 'document 2'
      }
    }, {
      uri: '/test/remove/mult/doc3.json',
      contentType: 'application/json',
      content: {
        title: 'document 3'
      }
    }, {
      uri: '/test/remove/mult/doc4.json',
      contentType: 'application/json',
      content: {
        title: 'document 4'
      }
    }, {
      uri: '/test/remove/mult/doc5.json',
      contentType: 'application/json',
      content: {
        title: 'document 5'
      }
    }, {
      uri: '/test/remove/mult/doc6.json',
      contentType: 'application/json',
      content: {
        title: 'document 6'
      }
    }, {
      uri: '/test/remove/mult/doc7.json',
      contentType: 'application/json',
      content: {
        title: 'document 7'
      }
    }, {
      uri: '/test/remove/mult/doc8.json',
      contentType: 'application/json',
      content: {
        title: 'document 8'
      }
    }, {
      uri: '/test/remove/mult/doc9.json',
      contentType: 'application/json',
      content: {
        title: 'document 9'
      }
    }, {
      uri: '/test/remove/mult/doc10.json',
      contentType: 'application/json',
      content: {
        title: 'document 10'
      }
    }, {
      uri: 'test/remove/mult/doc11.xml',
      contentType: 'application/xml',
      content: '<title>document 11</title>'
    }).
    result(function(response){done();}, done);
  });

  it('should remove multiple documents', function(done){
    dbWriter.documents.remove(
      '/test/remove/mult/doc1.json',
      '/test/remove/mult/doc2.json'
    ).
    result(function(response) {
      //console.log(response);
      return db.documents.probe('/test/remove/mult/doc1.json').result();
    }).
    then(function(response) {
      response.exists.should.eql(false);
      //console.log(response);
      return db.documents.probe('/test/remove/mult/doc2.json').result();
    }).
    then(function(response) {
      response.exists.should.eql(false);
      //console.log(response);
      done();
    }, done);
  });

  it('should remove multiple documents with array', function(done){
    dbWriter.documents.remove([
      '/test/remove/mult/doc3.json',
      '/test/remove/mult/doc4.json'
    ]).
    result(function(response) {
      //console.log(response);
      return db.documents.probe('/test/remove/mult/doc3.json').result();
    }).
    then(function(response) {
      response.exists.should.eql(false);
      //console.log(response);
      return db.documents.probe('/test/remove/mult/doc4.json').result();
    }).
    then(function(response) {
      response.exists.should.eql(false);
      //console.log(response);
      done();
    }, done);
  });

  it('should remove one document with uris', function(done){
    dbWriter.documents.remove({
      uris: '/test/remove/mult/doc5.json'
    }).
    result(function(response) {
      //console.log(response);
      return db.documents.probe('/test/remove/mult/doc5.json').result();
    }).
    then(function(response) {
      response.exists.should.eql(false);
      //console.log(response);
      done();
    }, done);
  });

  it('should remove multiple documents with uris array', function(done){
    dbWriter.documents.remove({
      uris: [
        '/test/remove/mult/doc6.json',
        '/test/remove/mult/doc7.json'
      ]
    }).
    result(function(response) {
      //console.log(response);
      return db.documents.probe('/test/remove/mult/doc6.json').result();
    }).
    then(function(response) {
      response.exists.should.eql(false);
      //console.log(response);
      return db.documents.probe('/test/remove/mult/doc7.json').result();
    }).
    then(function(response) {
      response.exists.should.eql(false);
      //console.log(response);
      done();
    }, done);
  });

  it('should remove multiple documents with one invalid uri', function(done){
    dbWriter.documents.remove({
      uris: [
        '/test/remove/mult/doc8.json',
        '/test/remove/mult/invalidDoc.json',
        '/test/remove/mult/doc9.json'
      ]
    }).
    result(function(response) {
      //console.log(response);
      return db.documents.probe('/test/remove/mult/doc8.json').result();
    }).
    then(function(response) {
      response.exists.should.eql(false);
      //console.log(response);
      return db.documents.probe('/test/remove/mult/doc9.json').result();
    }).
    then(function(response) {
      response.exists.should.eql(false);
      //console.log(response);
      done();
    }, done);
  });

  it('should remove multiple invalid documents', function(done){
    dbWriter.documents.remove({
      uris: [
        '/test/remove/mult/invalid1.json',
        '/test/remove/mult/invalid2.json'
      ]
    }).
    result(function(response) {
      //console.log(response);
      return db.documents.probe('/test/remove/mult/invalid1.json').result();
    }).
    then(function(response) {
      response.exists.should.eql(false);
      //console.log(response);
      return db.documents.probe('/test/remove/mult/invalid2.json').result();
    }).
    then(function(response) {
      response.exists.should.eql(false);
      //console.log(response);
      done();
    }, done);
  });

  it('should remove multiple documents with one invalid uri', function(done){
    dbWriter.documents.remove({
      uris: [
        '/test/remove/mult/doc8.json',
        '/test/remove/mult/invalidDoc.json',
        '/test/remove/mult/doc9.json'
      ]
    }).
    result(function(response) {
      //console.log(response);
      return db.documents.probe('/test/remove/mult/doc8.json').result();
    }).
    then(function(response) {
      response.exists.should.eql(false);
      //console.log(response);
      return db.documents.probe('/test/remove/mult/doc9.json').result();
    }).
    then(function(response) {
      response.exists.should.eql(false);
      //console.log(response);
      done();
    }, done);
  });

  it('should remove multiple documents with different content type', function(done){
    dbWriter.documents.remove({
      uris: [
        '/test/remove/mult/doc10.json',
        '/test/remove/mult/doc11.xml'
      ]
    }).
    result(function(response) {
      //console.log(response);
      return db.documents.probe('/test/remove/mult/doc10.json').result();
    }).
    then(function(response) {
      response.exists.should.eql(false);
      //console.log(response);
      return db.documents.probe('/test/remove/mult/doc11.xml').result();
    }).
    then(function(response) {
      response.exists.should.eql(false);
      //console.log(response);
      done();
    }, done);
  });

  it('should remove the directory', function(done){
    this.timeout(10000);
    dbWriter.documents.removeAll({directory:'/test/remove/mult'}).
    result(function(result) {
      return db.documents.probe('/test/remove/mult/doc4.json').result();
    }, done).
    then(function(document) {
      document.exists.should.eql(false);
      done();
    }, done);
  });

});
