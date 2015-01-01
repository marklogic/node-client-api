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

describe('Server props test', function(){

  it('should read server props', function(done){
    dbAdmin.config.serverprops.read().result(function(values) {
      //console.log(values);
      values.debug.should.equal(false); 
      done();
    }, done);
  });

  it('should write server props', function(done){
    dbAdmin.config.serverprops.write({debug:true}).
    result(function(values) {done();}, done);
  });

  it('should read server props after changing it', function(done){
    dbAdmin.config.serverprops.read().result(function(values) {
      //console.log(values);
      values.debug.should.equal(true); 
      done();
    }, done);
  });

  it('should change back the server props', function(done){
    dbAdmin.config.serverprops.write({debug:false}).
    result(function(values) {done();}, done);
  });

});
