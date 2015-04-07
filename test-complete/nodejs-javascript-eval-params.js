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
var dbEval = marklogic.createDatabaseClient(testconfig.restEvaluatorConnection);
var dbAdmin = marklogic.createDatabaseClient(testconfig.restAdminConnection);

describe('Javascript eval params test', function(){

  it('should do javascript eval with params', function(done){
    dbEval.eval('var num1;' +
                'var num2;' +
                'num1 + num2;',
                {num1:2, num2:3} 
               ).result(function(values) {
      //console.log(values);
      values[0].value.should.equal(5);
      done();
    }, done);
  });

  it('should do javascript eval with params on stream', function(done){
    dbEval.eval('var num1;' +
                'var num2;' +
                'num1 + num2;',
                {num1:2, num2:3} 
    ).
    stream().
    on('data', function(data) {
      //console.log(data);
      data.value.should.equal(5);
    }).
    on('end', function() {
      done();
    }, done);
  });

  it('should do javascript eval with params and transaction', function(done){
    var tid = 0;

    dbEval.transactions.open({transactionName: 'evalTransaction', timeLimit: 60})
    .result(function(response) {
      tid = response.txid;
      return dbEval.eval({
        source: 'var num1; var num2; num1 + num2;',
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

});
