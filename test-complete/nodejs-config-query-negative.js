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
var fs = require('fs');
var concatStream = require('concat-stream');
var valcheck = require('core-util-is');

var testconfig = require('../etc/test-config-qa.js');

var marklogic = require('../');
var q = marklogic.queryBuilder;

var db = marklogic.createDatabaseClient(testconfig.restReaderConnection);
var dbWriter = marklogic.createDatabaseClient(testconfig.restWriterConnection);
var dbAdmin = marklogic.createDatabaseClient(testconfig.restAdminConnection);

describe('Config query negative test', function(){

  var dbDir = '/marklogic/query/invalid/custom/';
  var dbModule = 'directoryConstraintInvalid.xqy';
  var dbPath = dbDir + dbModule;
  var fsPath = './node-client-api/test-complete/data/directoryConstraintInvalid.xqy';

  it('should fail to write the custom query with reader user', function(done){
    this.timeout(10000);
    db.config.query.custom.write(
      'directoryConstraint.xqy', 
      [{'role-name':'app-user', capabilities:['execute']}], 
      fs.createReadStream('./node-client-api/test-complete/data/directoryConstraint.xqy')).
    result(function(response) {
      response.should.equal('SHOULD HAVE FAILED');
      done();
    }, function(error) {
      //console.log(error);
      error.statusCode.should.equal(403);
      done();
    });
  });

  it('should fail to read the invalid custom query', function(done){
    dbAdmin.config.query.custom.read(dbModule).
    result(function(source) {
      response.should.equal('SHOULD HAVE FAILED');
      done();
    }, function(error) {
      //console.log(error);
      error.statusCode.should.equal(404);
      done();
    });
  });

  it('should fail to remove the invalid custom query', function(done){
    dbAdmin.config.query.custom.remove(dbModule).
    result(function(response) {
      //response.should.equal('SHOULD HAVE FAILED');
      done();
    }, function(error) {
      console.log(error);
      done();
    });
  });

  it('should fail to use invalid custom query in a query', function(done){
    dbWriter.documents.query(
      q.where(
        q.parsedFrom('dirs:/test/custom/query/',
          q.parseBindings(
            q.parseFunction('directoryConstraintInvalid.xqy', q.bind('dirs'))
          )
        )
      )
    ).
    result(function(response) {
      response.should.equal('SHOULD HAVE FAILED');
      done();
    }, function(error) {
      //console.log(error);
      error.statusCode.should.equal(400);
      done();
    });
  });

  it('should remove the custom query', function(done){
    dbAdmin.config.query.custom.remove('directoryConstraint.xqy').
    result(function(response) {
      done();
    }, function(error) {
      console.log(error);
      done();
    });
  });

});
