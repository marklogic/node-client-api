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

var fs = require('fs');
var concatStream = require('concat-stream');
var valcheck = require('core-util-is');

var testutil = require('./test-util.js');

var marklogic = require('../');

var db = marklogic.createDatabaseClient(testutil.restWriterConnection);
var dbReader = marklogic.createDatabaseClient(testutil.restReaderConnection);

describe('document content', function(){
  describe('write', function(){
    // write and read formats
    describe('a JSON string', function(){
      before(function(done){
        db.documents.write({
          uri: '/test/write/string1.json',
          contentType: 'application/json',
          content: '{"key1":"value 1"}'
          }).
        result(function(response){done();}, done);
      });
      it('should read back the value', function(done){
        db.read('/test/write/string1.json').
          result(function(documents) {
            valcheck.isUndefined(documents).should.equal(false);
            documents.length.should.equal(1);
            var document = documents[0];
            valcheck.isUndefined(document).should.equal(false);
            valcheck.isUndefined(document.content).should.equal(false);
            valcheck.isUndefined(document.content.key1).should.equal(false);
            document.content.key1.should.equal('value 1');
            done();
            }, done);
      });
    });
    describe('a JSON object', function(){
      before(function(done){
        db.documents.write({
          uri: '/test/write/object1.json',
          contentType: 'application/json',
          content: {key1: "value 1"}
          }).
        result(function(response){done();}, done);
      });
      it('should read back the value', function(done){
        db.read('/test/write/object1.json').
          result(function(documents) {
            valcheck.isUndefined(documents).should.equal(false);
            documents.length.should.equal(1);
            var document = documents[0];
            valcheck.isUndefined(document).should.equal(false);
            valcheck.isUndefined(document.content).should.equal(false);
            valcheck.isUndefined(document.content.key1).should.equal(false);
            document.content.key1.should.equal('value 1');
            done();
            }, done);
      });
    });
    describe('an XML string', function(){
      before(function(done){
        db.documents.write({
          uri: '/test/write/string1.xml',
          contentType: 'application/xml',
          content: '<doc>content 1</doc>'
          }).
        result(function(response){done();}, done);
      });
      it('should read back the content', function(done){
        db.read('/test/write/string1.xml').
          result(function(documents) {
            valcheck.isUndefined(documents).should.equal(false);
            documents.length.should.equal(1);
            var document = documents[0];
            valcheck.isUndefined(document).should.equal(false);
            valcheck.isUndefined(document.content).should.equal(false);
            document.content.should.containEql('<doc>content 1</doc>');
            done();
            }, done);
      });
    });
    describe('a text string', function(){
      before(function(done){
        db.documents.write({
          uri: '/test/write/string1.txt',
          contentType: 'text/plain',
          content: 'text 1'
          }).
        result(function(response){done();}, done);
      });
      it('should read back the content', function(done){
        db.read('/test/write/string1.txt').
          result(function(documents) {
            valcheck.isUndefined(documents).should.equal(false);
            documents.length.should.equal(1);
            var document = documents[0];
            valcheck.isUndefined(document).should.equal(false);
            valcheck.isUndefined(document.content).should.equal(false);
            document.content.should.equal('text 1');
            done();
            }, done);
      });
    });
    describe('a binary', function(){
      var binaryPath = './test/data/mlfavicon.png';
      var uri = '/test/binary/test1.png';
      var binaryValue = null;
      before(function(done){
        fs.createReadStream(binaryPath).
          pipe(concatStream({encoding: 'buffer'}, function(value) {
            binaryValue = value;
            done();
          }));
        });
      it('should write as a piped stream', function(done){
        var ws = db.createWriteStream({
          uri:uri,
          contentType:'image/png'
          });
        ws.result(function(response) {
          valcheck.isUndefined(response).should.equal(false);
          valcheck.isUndefined(response.documents).should.equal(false);
          response.documents.length.should.equal(1);
          var document = response.documents[0];
          valcheck.isUndefined(document.uri).should.equal(false);
          document.uri.should.equal(uri);
          done();
          }, done);
        fs.createReadStream(binaryPath).pipe(ws);
      });
      it('should read as a stream', function(done){
        db.createReadStream(uri).on('error', done).
          pipe(
            concatStream({encoding: 'buffer'}, function(value) {
              valcheck.isUndefined(value).should.equal(false);
              JSON.stringify(binaryValue).should.equal(JSON.stringify(value));
              done();
              }).on('error', done)
            ).on('error', done);
      });
    });

    // write and read arity
    describe('two JSON documents', function(){
      before(function(done){
        db.documents.write([{
          uri: '/test/write/arrayString1.json',
          contentType: 'application/json',
          content: '{"key1":"value 1"}'
          }, {
          uri: '/test/write/arrayObject2.json',
          contentType: 'application/json',
          content: {key1: 'value 1'}
          }]).
        result(function(response){done();}, done);
      });
      it('should read back both values', function(done){
        db.read(
            '/test/write/arrayString1.json',
            '/test/write/arrayObject2.json'
            ).
        result(function(documents) {
          valcheck.isUndefined(documents).should.equal(false);
          documents.length.should.equal(2);
          for (var i=0; i < 2; i++) {
            var document = documents[i];
            valcheck.isUndefined(document).should.equal(false);
            valcheck.isUndefined(document.content).should.equal(false);
            valcheck.isUndefined(document.content.key1).should.equal(false);
            document.content.key1.should.equal('value 1');
          }
          done();
          }, done);
      });
    });
    describe('a JSON document in two chunks', function(){
      before(function(done){
        var writeStream = db.documents.createWriteStream({
            uri: '/test/write/writable1.json',
            contentType: 'application/json'
            });
        writeStream.result(function(response){done();}, done);

        writeStream.write('{"key1"', 'utf8');
        writeStream.write(       ':"value 1"}', 'utf8');
        writeStream.end();
      });
      it('should read back the value', function(done){
        db.createReadStream('/test/write/writable1.json').
          on('data', function(chunk) {
            valcheck.isUndefined(chunk).should.equal(false);
            var content = JSON.parse(chunk.toString());
            valcheck.isUndefined(content).should.equal(false);
            valcheck.isUndefined(content.key1).should.equal(false);
            content.key1.should.equal('value 1');
            done();
            }, done);
      });
    });

    describe('remove', function(){
      describe('a document', function(){
        before(function(done){
          db.documents.write({
            uri: '/test/remove/doc1.json',
            contentType: 'application/json',
            content: {key1: 'value 1'}
            }).
          result(function(response){done();}, done);
        });
        it('should not exist', function(done){
          db.remove('/test/remove/doc1.json').
            result(function(result) {
              return db.check('/test/remove/doc1.json').result();
              }, done).
            then(function(document) {
              valcheck.isUndefined(document).should.equal(false);
              valcheck.isUndefined(document.exists).should.equal(false);
              document.exists.should.eql(false);
              done();
              }, done);
        });
      });
    });

    describe('check', function(){
      describe('a document', function(){
        before(function(done){
          db.documents.write({
            uri: '/test/check/doc1.json',
            contentType: 'application/json',
            content: {key1: 'value 1'}
            }).
            result(function(response){done();}, done);
        });
        it('should exist', function(done){
          db.check('/test/check/doc1.json').
            result(function(document) {
              valcheck.isUndefined(document).should.equal(false);
              valcheck.isUndefined(document.exists).should.equal(false);
              document.exists.should.eql(true);
              done();
              }, done);
        });
      });
    });
  });
});

describe('document metadata', function(){
  describe('write', function(){
    describe('with content', function(){
      before(function(done){
        db.documents.write({
          uri: '/test/write/metaContent1.json',
          contentType: 'application/json',
          collections: ['collection1/0', 'collection1/1'],
          permissions: [
            {'role-name':'app-user',    capabilities:['read']},
            {'role-name':'app-builder', capabilities:['read', 'update']}
            ],
          quality: 1,
          content: {key1: 'value 1'}
          }).
        result(function(response){done();}, done);
      });
      it('should read back the metadata and content', function(done){
        db.read({uris:'/test/write/metaContent1.json', categories:['metadata', 'content']}).
          result(function(documents) {
            valcheck.isUndefined(documents).should.equal(false);
            documents.length.should.equal(1);
            var document = documents[0];
            document.collections.length.should.equal(2);
            for (var i=0; i < 2; i++) {
              document.collections[i].should.equal('collection1/'+i);
            }
            var permissionsFound = 0;
            document.permissions.forEach(function(permission){
              switch (permission['role-name']) {
              case 'app-user':
                permissionsFound++;
                permission.capabilities.length.should.equal(1);
                permission.capabilities[0].should.equal('read');
                break;
              case 'app-builder':
                permissionsFound++;
                permission.capabilities.length.should.equal(2);
                permission.capabilities.should.containEql('read');
                permission.capabilities.should.containEql('update');
                break;
              }
            });
            permissionsFound.should.equal(2);
            document.quality.should.equal(1);
            document.content.key1.should.equal('value 1');
            done();
            }, done);
      });
    });
    describe('without content', function(){
      before(function(done){
        db.documents.write({
          uri: '/test/write/metaContent1.json',
          collections: ['collection2/0', 'collection2/1'],
          permissions: [
            {'role-name':'app-user',    capabilities:['read', 'update']},
            {'role-name':'app-builder', capabilities:['execute']}
            ],
          quality: 2
          }).
        result(function(response){done();}, done);
      });
      it('should read back the metadata', function(done){
        db.read({uris:'/test/write/metaContent1.json', categories:'metadata'}).
          result(function(documents) {
            valcheck.isUndefined(documents).should.equal(false);
            documents.length.should.equal(1);
            var document = documents[0];
            valcheck.isUndefined(document).should.equal(false);
            valcheck.isUndefined(document.collections).should.equal(false);
            document.collections.length.should.equal(2);
            for (var i=0; i < 2; i++) {
              document.collections[i].should.equal('collection2/'+i);
            }
            valcheck.isUndefined(document.permissions).should.equal(false);
            var permissionsFound = 0;
            document.permissions.forEach(function(permission){
              switch (permission['role-name']) {
              case 'app-user':
                permissionsFound++;
                permission.capabilities.length.should.equal(2);
                permission.capabilities.should.containEql('read');
                permission.capabilities.should.containEql('update');
                break;
              case 'app-builder':
                permissionsFound++;
                permission.capabilities.length.should.equal(1);
                permission.capabilities[0].should.equal('execute');
                break;
              }
            });
            permissionsFound.should.equal(2);
            valcheck.isUndefined(document.quality).should.equal(false);
            document.quality.should.equal(2);
            ('content' in document).should.equal(false);
            done();
            }, done);
      });
    });
  });
});

describe('document negative', function(){
  it('should fail to write a document as reader', function(done){
    dbReader.documents.write({
      uri: '/test/negative/writeAsReader1.txt',
      contentType: 'text/plain',
      content: 'the text'
      }).
    result(function(response){
      response.should.equal('SHOULD HAVE FAILED');
      done();
    }, function(error){
      (error.indexOf('403') > -1).should.equal(true);
      done();
      });
  });
  it('should fail to write a collection on a non-existent document', function(done){
    db.documents.write({
      uri: '/test/negative/writeOrphanedCollection1.txt',
      contentType: 'text/plain',
      collection: 'no document'
      }).
    result(function(response){
      response.should.equal('SHOULD HAVE FAILED');
      done();
    }, function(error){
      (error.indexOf('400') > -1).should.equal(true);
      done();
      });
  });
  it('should fail to write an invalid JSON document', function(done){
    db.documents.write({
      uri: '/test/negative/writeInvalid1.json',
      contentType: 'application/json',
      content: '{"invalid"}'
      }).
    result(function(response){
      response.should.equal('SHOULD HAVE FAILED');
      done();
    }, function(error){
      (error.indexOf('400') > -1).should.equal(true);
      done();
      });
  });
  it('should fail to write an invalid XML document', function(done){
    db.documents.write({
      uri: '/test/negative/writeInvalid2.xml',
      contentType: 'application/xml',
      content: '<invalid><document>'
      }).
    result(function(response){
      response.should.equal('SHOULD HAVE FAILED');
      done();
    }, function(error){
      (error.indexOf('400') > -1).should.equal(true);
      done();
      });
  });
  it('should fail to write a document with invalid permissions', function(done){
    db.documents.write({
      uri: '/test/negative/writeInvalidPermissions1.txt',
      contentType: 'text/plain',
      permissions: [
          {'role-name':'unreal', capabilities:['unknown']}
          ],
      content: 'the text'
      }).
    result(function(response){
      response.should.equal('SHOULD HAVE FAILED');
      done();
    }, function(error){
      (error.indexOf('400') > -1).should.equal(true);
      done();
      });
  });
  it('should fail to write a document with a non-existent transaction', function(done){
    db.documents.write({
      uri: '/test/negative/writeInvalidTransaction1.txt',
      contentType: 'text/plain',
      content: 'the text',
      txid: 'not a real transaction'
      }).
    result(function(response){
      response.should.equal('SHOULD HAVE FAILED');
      done();
    }, function(error){
      (error.indexOf('400') > -1).should.equal(true);
      done();
      });
  });
  it('should fail to delete a document as reader', function(done){
    dbReader.documents.remove({
      uri: '/test/negative/deleteAsReader1.txt'
      }).
    result(function(response){
      response.should.equal('SHOULD HAVE FAILED');
      done();
    }, function(error){
      (error.indexOf('403') > -1).should.equal(true);
      done();
      });
  });
  it('should fail to delete a document with a non-existent transaction', function(done){
    db.documents.remove({
      uri: '/test/negative/deleteInvalidTransaction1.txt',
      txid: 'not a real transaction'
      }).
    result(function(response){
      response.should.equal('SHOULD HAVE FAILED');
      done();
    }, function(error){
      (error.indexOf('400') > -1).should.equal(true);
      done();
      });
  });

/* TODO:
multipart write should report a bad uri
multipart read should report a non-existent uri or up-to-date versionId
  it('should fail to write a new document with an invalid uri', function(done){
    db.documents.write({
      uri: '/test/negative/not valid.txt',
      contentType: 'text/plain',
      content: 'the text'
      }).
    result(function(response){
        response.should.equal('SHOULD HAVE FAILED');
        done();
      }, function(error){
        (error.indexOf('400') > -1).should.equal(true);
        done();
      });
  });

  it('should fail to read a non-existent document', function(done){
    db.read('/not/a/real/document.txt').
    result(function(documents) {
      valcheck.isUndefined(documents).should.equal(false);
      documents.length.should.equal(1);
      var document = documents[0];
      console.log(document);
    }, done);
  });

db.query empty
bad authentication in test on marklogic
 */
});
