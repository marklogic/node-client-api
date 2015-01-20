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
var dbEval = marklogic.createDatabaseClient(testconfig.restEvaluatorConnection);
var dbAdmin = marklogic.createDatabaseClient(testconfig.restAdminConnection);

describe('Javascript invoke simple negative test', function(){
  
  var fsPath = './node-client-api/test-complete/data/sourceSimpleNegative.js';
  var invokePath = '/ext/invokeTest/sourceSimpleNegative.sjs';

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

  it('should fail on javascript invoke', function(done){
    dbEval.invoke(invokePath).result(function(values) {
      values.should.equal('SHOULD HAVE FAILED');
      done();
    }, function(error) {
      //console.log(error);
      error.statusCode.should.equal(500);
      error.body.errorResponse.messageCode.should.equal('JS-JAVASCRIPT');
      done();
    });
  });

});
