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

describe('Xquery invoke test', function(){
  
  var fsPath = './node-client-api/test-complete/data/sourceParams.xqy';
  var invokePath = '/ext/invokeTest/sourceParams.xqy';

  before(function(done) {
    this.timeout(10000);
    dbAdmin.config.extlibs.write({
      path:invokePath, contentType:'application/xquery', source:fs.createReadStream(fsPath)
    }).
    result(function(response){done();}, done);
  });
 
  after(function(done) {
    dbAdmin.config.extlibs.remove(invokePath).
    result(function(response){done();}, done);
  });

  it('should do xquery invoke with params', function(done){
    dbEval.invoke(invokePath, {num1:2, num2:3}).result(function(values) {
      //console.log(values);
      values[0].value.should.equal(5);
      done();
    }, done);
  });

  it('should do xquery invoke with params on stream', function(done){
    dbEval.invoke(invokePath, {num1:2, num2:3}).
    stream().
    on('data', function(data) {
      //console.log(data);
      data.value.should.equal(5);
    }).
    on('end', function() {
      done();
    }, done);
  });

  it('should do xquery invoke with params and transaction', function(done){
    var tid = 0;

    dbEval.transactions.open({transactionName: 'invokeXqueryTransaction', timeLimit: 60})
    .result(function(response) {
      tid = response.txid;
      return dbEval.invoke({
        path: invokePath,
        variables: {num1:2, num2:3},
        txid: tid
      }).result();
    })
    .then(function(response) {
      //console.log(response);
      response[0].value.should.equal(5);
      return dbEval.transactions.commit(tid).result();
    })
    .then(function(response) {
      //console.log(response);
      done();
    }, done);
  });

  it('should fail to do xquery invoke with wrong params value', function(done){
    dbEval.invoke(invokePath, {num1:'a', num2:3}).result(function(values) {
      //console.log(values);
      values.should.equal('SHOULD HAVE FAILED');
      done();
    }, function(error) {
      //console.log(error);
      error.statusCode.should.equal(500);
      error.body.errorResponse.messageCode.should.equal('XDMP-EXPR');
      done();
    });
  });

  it('should do xquery invoke with wrong number of params', function(done){
    dbEval.invoke(invokePath, {num1:2, num2:3, num3:5}).result(function(values) {
      //console.log(values);
      values[0].value.should.equal(5);
      done();
    }, function(error) {
      console.log(error);
      done();
    });
  });

});
