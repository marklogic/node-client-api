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

var testconfig = require('../etc/test-config-qa-ssl.js');

var marklogic = require('../');

var db = marklogic.createDatabaseClient(testconfig.restWriterConnection);
var dbReader = marklogic.createDatabaseClient(testconfig.restReaderConnection);
var dbSsl = marklogic.createDatabaseClient(testconfig.restSslConnection);

describe('SSL Test', function() {
  
  var docuri = '/foo/bar/test1.json'; 
  var docuri2 = '/foo/bar/test2.json'; 
 
  before(function(done) {
    this.timeout(10000);
    dbSsl.documents.write({
      uri: docuri,
      collections: ['coll0', 'coll1'],
      contentType: 'application/json',
      quality: 10,
      permissions: [
        {'role-name':'app-user', capabilities:['read']},
        {'role-name':'app-builder', capabilities:['read', 'update']}
      ],
      properties: {prop1:'foo', prop2:25},
      content: {id:12, name:'Jason'}
    }, {
      uri: docuri2,
      collections: ['coll0', 'coll1'],
      contentType: 'application/json',
      quality: 10,
      permissions: [
        {'role-name':'app-user', capabilities:['read']},
        {'role-name':'app-builder', capabilities:['read', 'update']}
      ],
      properties: {prop1:'bar', prop2:33},
      content: {id:245, name:'Paul'}
    }).result(function(response){done();}, done);
  });

  it('should read the document content name', function(done) {
    dbSsl.documents.read({uris: docuri}).result(function(documents) {
      var document = documents[0];
      document.content.name.should.equal('Jason');
      done();
    }, done);
  });

  it('should read the document content id', function(done) {
    dbSsl.documents.read({uris: docuri, categories:['content']}).result(function(documents) {
      var document = documents[0];
      document.content.id.should.equal(12);
      done();
    }, done);
  });

  it('should read the document quality (metadata) and content', function(done) {
    dbSsl.documents.read({uris: docuri, categories:['metadata', 'content']})
    .result(function(documents) {
      var document = documents[0];
      document.content.id.should.equal(12);
      document.quality.should.equal(10);
      document.properties.prop1.should.equal('foo');
      done();
    }, done);
  });

  it('should read the document collections', function(done) {
    dbSsl.documents.read({uris: docuri, categories:['metadata']}).result(function(documents) {
      var document = documents[0];
      var collCount = document.collections.length;
      collCount.should.equal(2);
      for(var i=0; i < collCount; i++) {
        document.collections[i].should.equal('coll' + i);
      }      
      done();
    }, done);
  });

  it('should read the document permissions', function(done) {
    dbSsl.documents.read({uris: docuri, categories:['metadata']}).result(function(documents) {
      var document = documents[0];
      var permissionsCount = 0;
      document.permissions.forEach(function(permission) {
        switch(permission['role-name']) {
          case 'app-user':
            permissionsCount++;
            permission.capabilities.length.should.equal(1);
            permission.capabilities[0].should.equal('read');
            break;
          case 'app-builder':
            permissionsCount++;
            permission.capabilities.length.should.equal(2);
            permission.capabilities.should.containEql('read');
            permission.capabilities.should.containEql('update');
            break;
        }
      });
      permissionsCount.should.equal(2);
      done();
    }, done);
  });

  it('should read multiple documents', function(done) {
    dbSsl.documents.read({uris: [docuri, docuri2], categories:['content']}).result(function(documents) {
      //console.log(JSON.stringify(documents, null, 4));
      documents[0].content.id.should.equal(12);
      documents[1].content.id.should.equal(245);
      done();
    }, done);
  });

  it('should read multiple documents with an invalid one', function(done) {
    dbSsl.documents.read({uris: [docuri, '/not/here/blah.json', docuri2], categories:['content']}).result(function(documents) {
      //console.log(JSON.stringify(documents, null, 4));
      documents[0].content.id.should.equal(12);
      documents[1].content.id.should.equal(245);
      done();
    }, done);
  });

  it('should write existing document with new content and metadata', function(done) {
    dbSsl.documents.write({
      uri: docuri,
      collections: ['coll5', 'coll6'],
      contentType: 'application/json',
      quality: 250,
      properties: {prop1:'bar', prop2:1981},
      content: {id:88, name:'David'}
      }).
    result(function(response){done();}, done);
  });

  it('should read the content of modified document', function(done) {
    dbSsl.documents.read({uris: [docuri], categories:['content']}).result(function(documents) {
      //console.log(JSON.stringify(documents, null, 4));
      documents[0].content.id.should.equal(88);
      done();
    }, done);
  });

  it('should read the metadata of modified document', function(done) {
    dbSsl.documents.read({uris: [docuri], categories:['metadata']}).result(function(documents) {
      //console.log(JSON.stringify(documents, null, 4));
      documents[0].properties.prop2.should.equal(1981);
      done();
    }, done);
  });

  it('should write document without contentType', function(done) {
    dbSsl.documents.write({
      uri: '/test/crud/withoutContentType1.json',
      content: {name:'no content type'}
      }).
    result(function(response) {
      //console.log(JSON.stringify(response, null, 2));
      response.documents[0].uri.should.equal('/test/crud/withoutContentType1.json');
      done();
    }, done);
  });

  it('should read document without contentType', function(done) {
    dbSsl.documents.read({
      uris: '/test/crud/withoutContentType1.json',
      }).
    result(function(response) {
      //console.log(JSON.stringify(response, null, 2));
      response[0].content.name.should.equal('no content type');
      done();
    }, done);
  });

  it('should delete the document', function(done) {
    dbSsl.documents.remove(docuri).result(function(document) {
      document.removed.should.eql(true);
      //console.log(document);
      done();
    }, done);
  });

  it('should delete the document', function(done) {
    dbSsl.documents.remove(docuri2).result(function(document) {
      document.removed.should.eql(true);
      done();
    }, done);
  });

  it('should delete the document', function(done) {
    dbSsl.documents.remove('/test/crud/withoutContentType1.json').result(function(document) {
      document.removed.should.eql(true);
      done();
    }, done);
  });
});
