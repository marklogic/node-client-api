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
var bunyan = require('bunyan');

var testconfig = require('../etc/test-config-qa.js');
var fs = require('fs');

var marklogic = require('../');

var db = marklogic.createDatabaseClient(testconfig.restReaderConnection);
var dbWriter = marklogic.createDatabaseClient(testconfig.restWriterConnection);
var dbEval = marklogic.createDatabaseClient(testconfig.restEvaluatorConnection);
var dbAdmin = marklogic.createDatabaseClient(testconfig.restAdminConnection);

describe('Bunyan logger test', function(){

  var logger = bunyan.createLogger({name: 'testlog', level: 'debug'});
  dbAdmin.setLogger(logger, true);

  it('should read the bunyan logger', function(done){
    dbAdmin.config.serverprops.read().result(function(response) {
      //var log = JSON.stringify(response);
      //console.log(log);
      //log.should.containEql('testlog'); 
      done();
    }, done);
  });

});
