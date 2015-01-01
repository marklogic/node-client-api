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

describe('Xquery eval negaive test', function(){

  it('should fail with non-matching var name', function(done){
    dbEval.xqueryEval(
                'let $a := 2' +
                'return $sum' 
               ).
    result(function(values) {
      values.should.equal('SHOULD HAVE FAILED');
      done();
    }, function(error) {
         error.statusCode.should.equal(500);
         //error.body.should.containEql('XDMP-UNEXPECTED');
         //console.log(error); 
         done();
       });
  });
/*
  it('should fail with non-matching var number', function(done){
    dbEval.eval('var num1;' +
                'var num2;' +
                'num1 + num2;',
                {num1:2, num2:3, num3:10} 
               ).
    result(function(values) {
      var strVal = JSON.stringify(values);
      strVal.should.equal('[{"format":"text","datatype":"integer","value":5}]');
      done();
    }, function(error) {
         console.log(error); 
         done();
       });
  });

  it('should fail with invalid source', function(done){
    dbEval.eval('var num1;' +
                'var num2;' +
                'num1 + num3;',
                {num1:2, num2:3} 
               ).
    result(function(values) {
      values.should.equal('SHOULD HAVE FAILED');
      done();
    }, function(error) {
         error.statusCode.should.equal(500);
         //console.log(error); 
         done();
       });
  });
*/
});
