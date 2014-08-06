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

var db = marklogic.createDatabaseClient(testconfig.restWriterConnection);
var dbReader = marklogic.createDatabaseClient(testconfig.restReaderConnection);

describe('Write Document Test', function() {
  
  var docuri = '/foo/bar/test1.json'; 
 
  before(function(done) {
    db.documents.write({
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
    }).result(function(response){done();}, done);
  });

  it('should read the document content name', function(done) {
    db.documents.read({uris: docuri}).result(function(documents) {
      var document = documents[0];
      document.content.name.should.equal('Jason');
      done();
    }, done);
  });

  it('should read the document content id', function(done) {
    db.documents.read({uris: docuri, categories:['content']}).result(function(documents) {
      var document = documents[0];
      document.content.id.should.equal(12);
      done();
    }, done);
  });

  it('should read the document quality (metadata) and content', function(done) {
    db.documents.read({uris: docuri, categories:['metadata', 'content']})
    .result(function(documents) {
      var document = documents[0];
      document.content.id.should.equal(12);
      document.quality.should.equal(10);
      document.properties.prop1.should.equal('foo');
      done();
    }, done);
  });

  it('should read the document collections', function(done) {
    db.documents.read({uris: docuri, categories:['metadata']}).result(function(documents) {
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
    db.documents.read({uris: docuri, categories:['metadata']}).result(function(documents) {
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

  it('should delete the document', function(done) {
    db.documents.remove(docuri).result(function(document) {
      document.exists.should.eql(false);
      done();
    }, done);
  });
});
