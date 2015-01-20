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
var fs = require('fs');

var marklogic = require('../');

var db = marklogic.createDatabaseClient(testconfig.restReaderConnection);
var dbWriter = marklogic.createDatabaseClient(testconfig.restWriterConnection);
var dbAdmin = marklogic.createDatabaseClient(testconfig.restAdminConnection);

describe('Extlib negative test', function(){
  var fsPath = './node-client-api/test-complete/data/sourceParams.js';
  var invokePath = '/ext/invokeTest/sourceParams.sjs';
  var invalidFsPath = './node-client-api/test-complete/data/someInvalidFile.js';

  before(function(done) {
    this.timeout(10000);
    dbAdmin.config.extlibs.write({
      path:invokePath, contentType:'application/javascript', source:fs.createReadStream(fsPath)
    }).
    result(function(response){done();}, done); 
  });

  after(function(done) {
    dbAdmin.config.extlibs.remove(invokePath).
    result(function(response){done();}, done);
  });

  it('should fail to write with reader user', function(done){
    db.config.extlibs.write({
      path:invokePath, contentType:'application/javascript', source:fs.createReadStream(fsPath)
    }).
    result(function(response) {
      response.should.equal('SHOULD HAVE FAILED');
      done();
    }, function(error) {
      //console.log(error.body);
      error.body.errorResponse.messageCode.should.equal('REST-FAILEDAUTH');
      error.statusCode.should.equal(403);
      done();
      });
  });

  it('should fail to write with invalid content type', function(done){
    dbAdmin.config.extlibs.write({
      path:invokePath, contentType:'application/xml', source:fs.createReadStream(fsPath)
    }).
    result(function(response) {
      response.should.equal('SHOULD HAVE FAILED');
      done();
    }, function(error) {
      //console.log(error);
      error.body.errorResponse.messageCode.should.equal('XDMP-DOCROOTTEXT');
      error.statusCode.should.equal(400);
      done();
      });
  });

  /*it('should fail to write with invalid path', function(done){
    try {
      dbAdmin.config.extlibs.write({
        path:invokePath, contentType:'application/javascript', source:fs.createReadStream(invalidFsPath)
      }).should.equal('SHOULD HAVE FAILED');
      done();
    }
    catch(error) {
      console.log(error);
      done();
    }
  });*/

  it('should fail to remove with invalid path', function(done){
    dbAdmin.config.extlibs.remove('/ext/invokeTest/invalid.sjs').
    result(function(response) {
      response.should.be.ok;
      done();
    }, function(error) {
      done();
      });
  });

  it('should fail to read with invalid path', function(done){
    dbAdmin.config.extlibs.read('/some/invalid/path/invalid.js').
    result(function(response) {
      response.should.equal('SHOULD HAVE FAILED');
      done();
    }, function(error) {
      //console.log(error);
      error.statusCode.should.equal(404);
      done();
      });
  });

  it('should fail to list with invalid directory', function(done){
    dbAdmin.config.extlibs.list('/some/invalid/directory/').
    result(function(response) {
      response.assets.should.be.empty;
      done();
    }, function(error) {
      done();
      });
  });
});
