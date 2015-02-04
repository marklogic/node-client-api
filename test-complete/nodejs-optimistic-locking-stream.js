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

var p = marklogic.patchBuilder;

var dbWriter = marklogic.createDatabaseClient(testconfig.restWriterConnection);
var dbReader = marklogic.createDatabaseClient(testconfig.restReaderConnection);
var dbAdmin = marklogic.createDatabaseClient(testconfig.restAdminConnection);

describe('Optimistic locking stream test', function() {

  it('should read the original update policy', function(done) {
    dbAdmin.config.serverprops.read().
    result(function(response) {
      //console.log(JSON.stringify(response, null, 2));
      (JSON.stringify(response)).should.containEql('merge-metadata');
      done();
    }, done);
  });

  it('should change the update policy', function(done) {
    dbAdmin.config.serverprops.write({'update-policy': 'version-required'}).
    result(function(response) {
      response.should.be.ok;
      done();
    }, done);
  });

  it('should write document for test', function(done) {
    var ws = dbWriter.documents.createWriteStream({
      uri: '/test/optlock/stream/streamLock1.json',
      contentType: 'application/json'
      });
    ws.result(function(response) {
      done(); },
    done);
    ws.write('{"title": "write stream with opt lock"}');
    ws.end();
  });

  it('should write with version id in stream', function(done){
    dbWriter.documents.probe('/test/optlock/stream/streamLock1.json').result().
    then(function(response) {
      var ws = dbWriter.documents.createWriteStream({
        uri: '/test/optlock/stream/streamLock1.json',
        contentType: 'application/json',
        versionId: response.versionId  
      });
      ws.result(function(response) { done(); }, done); 
      ws.write('{"hello": "world"}');
      ws.end();
    });
  });

  it('should read with version id in chunk stream', function(done){
    this.timeout(10000);
    var uri = '/test/optlock/stream/streamLock1.json';
    dbReader.documents.read(uri).stream('chunked').
    on('data', function(data) {
      var strData = data.toString();
      strData.should.containEql('world');
      //console.log(strData);
      }).
    on('end', function() {
      done();
    }, done);   
  });

  /*it('should fail to write without version id', function(done){
    dbWriter.documents.probe('/test/optlock/stream/streamLock1.json').result().
    then(function(response) {
      var ws = dbWriter.documents.createWriteStream({
        uri: '/test/optlock/stream/streamLock1.json',
        contentType: 'application/json'  
      });
      ws.result(function(response) { 
        ws.write('{"hello": "world"}');
        ws.end();
        //response.should.equal('SHOULD HAVE FAILED');
        done(); 
      }, function(error) {
        error.statusCode.should.equal(403);
        done();
      });
    });
  });*/

  /*it('should fail to remove doc without the version id', function(done) {
    dbWriter.documents.remove('/test/optlock/doc6.json').
    result(function(response) {
      //console.log(JSON.stringify(response, null, 2));
      response.should.equal('SHOULD HAVE FAILED');
      done();
    }, function(error) {
      error.statusCode.should.equal(403)
      done();
    });
  });

  it('should remove the document with the version id', function(done){
    dbWriter.documents.probe('/test/optlock/doc6.json').result().
    then(function(response) {
      dbWriter.documents.remove({
        uri: '/test/optlock/doc6.json',
        versionId: response.versionId
      }).
      result(function(response) {
        //console.log(JSON.stringify(response, null, 4));
        response.exists.should.equal(false);
        done();
      }, done);
    });
  });
  
  it('should fail to apply the patch without version id', function(done){
    dbWriter.documents.patch('/test/optlock/doc5.json',
      p.pathLanguage('jsonpath'),
      p.insert('$.title', 'after', {newKey:'newChild'}),
      p.insert('$.price.amt', 'before', {numberKey:1234.456}),
      p.replace('$.popularity', 1),
      p.remove('$.p')
    ).
    result(function(response) {
      response.should.be('SHOULD BE FAILED');
      done();
    }, function(error) { 
      //console.log(error);
      error.statusCode.should.equal(403);
      done();
    });
  });

  
  it('should apply the patch with the version id', function(done){
    dbWriter.documents.probe('/test/optlock/doc5.json').result().
    then(function(response) {
      dbWriter.documents.patch({
        uri: '/test/optlock/doc5.json',
        operations: [p.pathLanguage('jsonpath'),
                     p.insert('$.title', 'after', {newKey:'newChild'}),
                     p.insert('$.price.amt', 'before', {numberKey:1234.456}),
                     p.replace('$.popularity', 1),
                     p.remove('$.p')],
        versionId: response.versionId
      }).
      result(function(response) {
        //console.log(JSON.stringify(response, null, 4));
        response.uri.should.equal('/test/optlock/doc5.json');
        done();
      }, done);
    });
  });
  
  it('should read the patch', function(done){
    dbReader.documents.read('/test/optlock/doc5.json').
    result(function(response) {
      var document = response[0];
      //console.log(JSON.stringify(response, null, 2));
      document.content.newKey.should.equal('newChild');
      document.content.popularity.should.equal(1);
      document.should.not.have.property('p');
      done();
    }, done);
  })

  it('should change the update policy to merge-metadata', function(done) {
    dbAdmin.config.serverprops.write({'update-policy': 'merge-metadata'}).
    result(function(response) {
      response.should.be.ok;
      done();
    }, done);
  });

  it('should apply the patch with the version id, update policy = merge-metadata', function(done){
    dbWriter.documents.probe('/test/optlock/doc5.json').result().
    then(function(response) {
      dbWriter.documents.patch({
        uri: '/test/optlock/doc5.json',
        operations: [p.pathLanguage('jsonpath'),
                     p.replace('$.popularity', 17)],
        versionId: response.versionId
      }).
      result(function(response) {
        //console.log(JSON.stringify(response, null, 4));
        response.uri.should.equal('/test/optlock/doc5.json');
        done();
      }, done);
    });
  });

  it('should read the patch', function(done){
    dbReader.documents.read('/test/optlock/doc5.json').
    result(function(response) {
      var document = response[0];
      //console.log(JSON.stringify(response, null, 2));
      document.content.popularity.should.equal(17);
      done();
    }, done);
  })

  it('should change the update policy', function(done) {
    dbAdmin.config.serverprops.write({'update-policy': 'version-required'}).
    result(function(response) {
      response.should.be.ok;
      done();
    }, done);
  });

  it('should write document for test', function(done) {
    dbWriter.documents.write({
      uri: '/test/optlock/doc7.json',
      contentType: 'application/json',
      content: {
        title: 'overwrite the version id'
      }
    }).
    result(function(response) {
      done();
    }, done);
  });

  it('should fail to overwrite the document with no version id', function(done){
    dbWriter.documents.probe('/test/optlock/doc7.json').result().
    then(function(response) {
      dbWriter.documents.write({
        uri: '/test/optlock/doc7.json',
        contentType: 'application/json',
        content: {
          title: 'this doc is overwritten'
        }
      }).
      result(function(response) {
        //console.log(JSON.stringify(response, null, 4));
        response.should.equal('SHOULD HAVE FAILED');
        done();
      }, function(error) {
        //console.log(error);
        error.statusCode.should.equal(403);
        done();
      });
    });
  });

  it('should fail to overwrite the document with incorrect version id', function(done){
    dbWriter.documents.probe('/test/optlock/doc7.json').result().
    then(function(response) {
      dbWriter.documents.write({
        uri: '/test/optlock/doc7.json',
        contentType: 'application/json',
        versionId: 1234567,
        content: {
          title: 'this doc is overwritten'
        }
      }).
      result(function(response) {
        //console.log(JSON.stringify(response, null, 4));
        response.should.equal('SHOULD HAVE FAILED');
        done();
      }, function(error) {
        //console.log(error);
        error.statusCode.should.equal(412);
        done();
      });
    });
  });

  it('should overwrite the document with the correct version id', function(done){
    dbWriter.documents.probe('/test/optlock/doc7.json').result().
    then(function(response) {
      dbWriter.documents.write({
        uri: '/test/optlock/doc7.json',
        contentType: 'application/json',
        versionId: response.versionId,
        content: {
          title: 'this doc is overwritten'
        }
      }).
      result(function(response) {
        //console.log(JSON.stringify(response, null, 4));
        done();
      }, done); 
    });
  });*/

  /*it('should fail to read the overwritten the document without the version id', function(done){
    dbWriter.documents.probe('/test/optlock/doc7.json').result().
    then(function(response) {
      dbWriter.documents.read({
        uris: '/test/optlock/doc7.json'
      }).
      result(function(response) {
        //console.log(JSON.stringify(response, null, 4));
        response[0].content.should.equal('this doc is overwritten');
        done();
      }, done); 
    });
  });*/

  /*it('should read the overwritten the document with the version id', function(done){
    dbWriter.documents.probe('/test/optlock/doc7.json').result().
    then(function(response) {
      dbWriter.documents.read({
        uris: '/test/optlock/doc7.json',
        versionId: response.versionId
      }).
      result(function(response) {
        //console.log(JSON.stringify(response, null, 4));
        response[0].content.title.should.equal('this doc is overwritten');
        done();
      }, done); 
    });
  });*/

  it('should change back the update policy', function(done) {
    dbAdmin.config.serverprops.write({'update-policy': 'merge-metadata'}).
    result(function(response) {
      response.should.be.ok;
      done();
    }, done);
  });

  it('should remove the documents', function(done) {
    dbAdmin.documents.removeAll({directory: '/test/optlock/stream/'}).
    result(function(response) {
      response.should.be.ok;
      done();
    }, done);
  });

});
