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
var q = marklogic.queryBuilder;

var db = marklogic.createDatabaseClient(testconfig.restReaderConnection);
var dbWriter = marklogic.createDatabaseClient(testconfig.restWriterConnection);
var dbEval = marklogic.createDatabaseClient(testconfig.restEvaluatorConnection);
var dbAdmin = marklogic.createDatabaseClient(testconfig.restAdminConnection);

describe('Server eval test', function(){

  it('should do javascript eval on json', function(done){
    dbEval.eval('xdmp.toJSON({k:"v"});').result(function(values) {
      console.log(values);
      done();
    }, done);
  });

  it('should do javascript eval on text', function(done){
    dbEval.eval('fn.lowerCase("MarkLogic");').result(function(values) {
      console.log(values);
      done();
    }, done);
  });

  it('should do javascript eval on string manipulation', function(done){
    dbEval.eval('fn.contains("this is a string", "s a s");').result(function(values) {
      console.log(values);
      done();
    }, done);
  });

  it('should do javascript eval to call on array', function(done){
    var src = 'var mycars = ["volvo", "nissan", "honda", "volvo", "HONDA"];' +
              'fn.distinctValues(mycars);' 
    dbEval.eval(src).
    result(function(values) {
      console.log(values);
      done();
    }, done);
  });

  it('should do more javascript eval to xml', function(done){
    dbEval.eval('xdmp.fromJsonString(\'["a", null, false]\');').result(function(values) {
      console.log(values);
      done();
    }, done);
  });


});
