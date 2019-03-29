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

var testconfig = require('../etc/test-config-qa.js');

var marklogic = require('../');
var p = marklogic.patchBuilder;
var fs = require('fs');
var db = marklogic.createDatabaseClient(testconfig.restWriterConnection);
var dbReader = marklogic.createDatabaseClient(testconfig.restReaderConnection);
var dbAdmin = marklogic.createDatabaseClient(testconfig.restAdminConnection);

describe('Document Metadata values test', function() {

  it('TEST 1 - write document content and metadata', function(done) {
    db.documents.write({
      uri: '/test/metadata/values/doc1.json',
      collections: ['metadataValuesColl'],
      contentType: 'application/json',
      quality: 250,
      properties: {
        prop1:'bar',
        prop2:1981
      },
      metadataValues: {
        meta1: 'super plastic',
        meta2: 45.89,
        meta3: true,
        meta4: null,
        meta5: undefined,
        metaDateTime: '2011-12-31T23:59:59'
      },
      content: {
        id: '0001',
        name:'bowl'
      }
    }).
    result(function(response) {
      //console.log(JSON.stringify(response, null, 2));
      response.documents[0].uri.should.equal('/test/metadata/values/doc1.json');
      done();
    }, done);
  });

  it('TEST 2 - read the content and metadata values', function(done) {
    db.documents.read({
      uris: ['/test/metadata/values/doc1.json'],
      categories:['content', 'metadataValues']
    }).result(function(documents) {
      //console.log(JSON.stringify(documents, null, 4));
      documents[0].metadataValues.meta1.should.equal('super plastic');
      documents[0].metadataValues.meta2.should.equal('45.89');
      documents[0].metadataValues.meta3.should.equal(true);
      documents[0].metadataValues.meta4.should.be.empty;
      documents[0].metadataValues.metaDateTime.should.equal('2011-12-31T23:59:59');
      done();
    }, done);
  });

  it('TEST 3 - insert patch on metadata values', function(done) {
    db.documents.patch({
      uri: '/test/metadata/values/doc1.json',
      categories:['metadataValues'],
      operations: [
        p.insert('metadataValues', 'last-child', {meta6: 'added patch'})
      ]
    }).result(function(documents) {
      //console.log(JSON.stringify(documents, null, 4));
      documents.uri.should.equal('/test/metadata/values/doc1.json');
      done();
    }, done);
  });

  it('TEST 4 - read the patched metadata values', function(done) {
    db.documents.read({
      uris: ['/test/metadata/values/doc1.json'],
      categories:['metadataValues']
    }).result(function(documents) {
      //console.log(JSON.stringify(documents, null, 4));
      documents[0].metadataValues.meta6.should.equal('added patch');
      done();
    }, done);
  });

  it('TEST 5 - remove patch on metadata values', function(done) {
    db.documents.patch({
      uri: '/test/metadata/values/doc1.json',
      categories:['metadataValues'],
      operations: [
        p.remove('meta6')
      ]
    }).result(function(documents) {
      //console.log(JSON.stringify(documents, null, 4));
      documents.uri.should.equal('/test/metadata/values/doc1.json');
      done();
    }, function(error) {console.log(error); done();});
  });

  it('TEST 6 - read the patched metadata values', function(done) {
    db.documents.read({
      uris: ['/test/metadata/values/doc1.json'],
      categories:['metadataValues']
    }).result(function(documents) {
      //console.log(JSON.stringify(documents, null, 4));
      documents[0].metadataValues.should.not.have.property('meta6');
      done();
    }, done);
  });

  it('TEST 7 - insert patch on existing metadata values', function(done) {
    db.documents.patch({
      uri: '/test/metadata/values/doc1.json',
      categories:['metadataValues'],
      operations: [
        p.insert('metadataValues', 'last-child', {meta1: 'this is the date'})
      ]
    }).result(function(documents) {
      //console.log(JSON.stringify(documents, null, 4));
      documents.uri.should.equal('/test/metadata/values/doc1.json');
      done();
    }, done);
  });

  it('TEST 8 - read the patched metadata values', function(done) {
    db.documents.read({
      uris: ['/test/metadata/values/doc1.json'],
      categories:['metadataValues']
    }).result(function(documents) {
      //console.log(JSON.stringify(documents, null, 4));
      documents[0].metadataValues.meta1.should.equal('this is the date');
      done();
    }, done);
  });

  it('TEST 9 - add patch on metadataValues', function(done) {
    db.documents.patch({
      uri: '/test/metadata/values/doc1.json',
      categories:['metadataValues'],
      operations: [
        p.metadataValues.add('metaAddNumber', '123.456'),
        p.metadataValues.add('metaAddBoolean', 'false')
      ]
    }).result(function(documents) {
      //console.log(JSON.stringify(documents, null, 4));
      documents.uri.should.equal('/test/metadata/values/doc1.json');
      done();
    }, done);
  });

  it('TEST 10 - read the added patch metadata values', function(done) {
    db.documents.read({
      uris: ['/test/metadata/values/doc1.json'],
      categories:['metadataValues']
    }).result(function(documents) {
      //console.log(JSON.stringify(documents, null, 4));
      documents[0].metadataValues.metaAddNumber.should.equal('123.456');
      documents[0].metadataValues.metaAddBoolean.should.equal(false);
      done();
    }, done);
  });

  it('TEST 11 - replace patch on metadataValues', function(done) {
    db.documents.patch({
      uri: '/test/metadata/values/doc1.json',
      categories:['metadataValues'],
      operations: [
        p.metadataValues.replace('metaAddNumber', '678.999'),
        p.metadataValues.replace('metaAddBoolean', 'true')
      ]
    }).result(function(documents) {
      //console.log(JSON.stringify(documents, null, 4));
      documents.uri.should.equal('/test/metadata/values/doc1.json');
      done();
    }, done);
  });

  it('TEST 12 - read the replaced patch metadata values', function(done) {
    db.documents.read({
      uris: ['/test/metadata/values/doc1.json'],
      categories:['metadataValues']
    }).result(function(documents) {
      //console.log(JSON.stringify(documents, null, 4));
      documents[0].metadataValues.metaAddNumber.should.equal('678.999');
      documents[0].metadataValues.metaAddBoolean.should.equal(true);
      done();
    }, done);
  });

  it('TEST 13 - negative: non-string on values', function(done) {
    try {
      db.documents.patch({
        uri: '/test/metadata/values/doc1.json',
        categories:['metadataValues'],
        operations: [
          p.metadataValues.add('metaNegNonString', 1001.6789)
        ]
      })
      .should.equal('SHOULD HAVE FAILED');
      done();
    } catch(error) {
      //console.log(error.toString());
      var strErr = error.toString();
      strErr.should.equal('Error: metadataValues.add() takes a string name and string value');
      done();
    }
  });

  it('TEST 14 - negative: non-string on names', function(done) {
    try {
      db.documents.patch({
        uri: '/test/metadata/values/doc1.json',
        categories:['metadataValues'],
        operations: [
          p.metadataValues.add(negativeMeta, 'invValues')
        ]
      })
      .should.equal('SHOULD HAVE FAILED');
      done();
    } catch(error) {
      //console.log(error.toString());
      var strErr = error.toString();
      strErr.should.equal('ReferenceError: negativeMeta is not defined');
      done();
    }
  });

  it('TEST 15 - write document content and metadata as write stream', function(done) {
    this.timeout(3000);
    var ws = db.documents.createWriteStream({
      uri: '/test/metadata/values/doc2.json',
      collections: ['metadataValuesColl'],
      contentType: 'application/json',
      quality: 125,
      properties: {
        prop1:'baz',
        prop2:1998
      },
      metadataValues: {
        meta1: 'metal',
        meta2: 65.98,
        meta3: true,
        meta4: null,
        meta5: undefined,
        metaDateTime: '2012-04-31T23:59:59'
      }
    });

    ws.result(function(response) {
      done();
    }, done);
    ws.write('{"name": "wrench"}', 'utf8');
    ws.end();
  });

  it('TEST 16 - read the content and metadata values', function(done) {
    db.documents.read({
      uris: ['/test/metadata/values/doc2.json'],
      categories:['content', 'metadataValues']
    }).result(function(documents) {
      //console.log(JSON.stringify(documents, null, 4));
      documents[0].metadataValues.meta1.should.equal('metal');
      documents[0].metadataValues.meta2.should.equal('65.98');
      documents[0].metadataValues.meta3.should.equal(true);
      documents[0].metadataValues.meta4.should.be.empty;
      documents[0].metadataValues.metaDateTime.should.equal('2012-04-31T23:59:59');
      done();
    }, done);
  });

  it('should delete all documents', function(done){
    dbAdmin.documents.removeAll({
      collection: 'metadataValuesColl'
    }).
    result(function(response) {
      done();
    }, done);
  });

});
