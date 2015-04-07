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

var valcheck = require('core-util-is');

var testconfig = require('../etc/test-config.js');

var marklogic = require('../');

var db = marklogic.createDatabaseClient(testconfig.restWriterConnection);

var dbReader = marklogic.createDatabaseClient(testconfig.restReaderConnection);

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
      error.statusCode.should.equal(403);
      done();
      });
  });
  it('should fail to write a collection on a non-existent document', function(done){
    db.documents.write({
      uri: '/test/negative/writeOrphanedCollection1.txt',
      contentType: 'text/plain',
      collections: 'no document'
      }).
    result(function(response){
      response.should.equal('SHOULD HAVE FAILED');
      done();
    }, function(error){
      error.statusCode.should.equal(404);
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
      error.statusCode.should.equal(400);
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
      error.statusCode.should.equal(400);
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
      error.statusCode.should.equal(400);
      done();
      });
  });
  it('should fail to write a document with a non-existent transaction', function(done){
    db.documents.write({
      uri: '/test/negative/writeInvalidTransaction1.txt',
      contentType: 'text/plain',
      content: 'the text',
      txid: encodeURIComponent('not a real transaction')
      }).
    result(function(response){
      response.should.equal('SHOULD HAVE FAILED');
      done();
    }, function(error){
// TODO: REMOVE TEMPORARY WORKAROUND BELOW
//      error.statusCode.should.equal(400);
      error.should.have.property('body');
      error.body.should.have.property('errorResponse');
      error.body.errorResponse.should.have.property('message');
      error.body.errorResponse.message.should.containEql('XDMP-RWINVAL');
      error.body.errorResponse.message.should.containEql('set-transaction');
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
      error.statusCode.should.equal(403);
      done();
      });
  });
  it('should fail to delete a document with a non-existent transaction', function(done){
    db.documents.remove({
      uri: '/test/negative/deleteInvalidTransaction1.txt',
      txid: encodeURIComponent('not a real transaction')
      }).
    result(function(response){
      response.should.equal('SHOULD HAVE FAILED');
      done();
    }, function(error){
// TODO: REMOVE TEMPORARY WORKAROUND BELOW
//    error.statusCode.should.equal(400);
      error.should.have.property('body');
      error.body.should.have.property('errorResponse');
      error.body.errorResponse.should.have.property('message');
      error.body.errorResponse.message.should.containEql('XDMP-RWINVAL');
      error.body.errorResponse.message.should.containEql('set-transaction');
      done();
      });
  });
  it('should fail to write a document with a mismapped extension', function(done){
    db.documents.write({
        uri: '/test/negative/writeInvalidFormat1.xml',
        contentType: 'application/json',
        content: {"key": "value"}
      },{
        uri: '/test/negative/writeInvalidFormat2.json',
        contentType: 'application/xml',
        content: '<root/>'
      }).
    result(function(response){
      response.should.equal('SHOULD HAVE FAILED');
      done();
    }, function(error){
      error.statusCode.should.equal(400);
      done();
      });
  });

/* TODO:
repair for json
extract for text
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
        error.statusCode.should.equal(400);
        done();
      });
  });

  it('should fail to read a non-existent document', function(done){
    db.documents.read('/not/a/real/document.txt').
    result(function(documents) {
      valcheck.isUndefined(documents).should.equal(false);
      documents.length.should.equal(1);
      var document = documents[0];
      console.log(document);
    })
  .catch(done);
  });

      invalidDb.documents.probe('/test/remove/doc1.json').result(function(response) {
        response.should.equal('SHOULD HAVE FAILED');
        done();
      }, function(error){
        error.should.equal('SHOULD HAVE FAILED BEFORE REQUEST');
        done();
      });

db.query empty
bad authentication in test on marklogic
 */
});

describe('database client negative', function(){
  it('should fail to create a client without a user', function(done){
    try {
      marklogic.createDatabaseClient({
        host:     testconfig.testHost,
        port:     testconfig.restPort,
        password: testconfig.restWriterPassword,
        authType: testconfig.restAuthType
      }).should.equal('SHOULD HAVE FAILED');
      done();
    } catch(error) {
      error.should.be.ok;
      done();
    }
  });
  it('should fail to create a client without a password', function(done){
    try {
      marklogic.createDatabaseClient({
        host:     testconfig.testHost,
        port:     testconfig.restPort,
        user:     testconfig.restWriterUser,
        authType: testconfig.restAuthType
      }).should.equal('SHOULD HAVE FAILED');
      done();
    } catch(error) {
      error.should.be.ok;
      done();
    }
  });
});
