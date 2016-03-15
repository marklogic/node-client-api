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

describe('Config query test', function(){

  var dbDir = '/marklogic/query/custom/';
  var dbModule = 'directoryConstraint.xqy';
  var dbPath = dbDir + dbModule;
  var fsPath = './node-client-api/test-complete/data/directoryConstraint.xqy';

  it('should write the custom query', function(done){
    this.timeout(10000);
    dbAdmin.config.query.custom.write(
      dbModule, 
      [{'role-name':'app-user', capabilities:['execute']}], 
      fs.createReadStream(fsPath)).
    result(function(response){
      //console.log(response);
      response.path.should.equal('/marklogic/query/custom/directoryConstraint.xqy');
      done();
    }, done);
  });

  it('should read the custom query', function(done){
    dbAdmin.config.query.custom.read(dbModule).
    result(function(source){
      //(!valcheck.isNullOrUndefined(source)).should.equal(true);
      //console.log(source);
      source.should.containEql('declare function directoryConstraint');
      done();
    }, done);
  });
    
  it('should list the custom query', function(done){
    dbAdmin.config.query.custom.list().
    result(function(response){
      //console.log(response);
      response.should.have.property('assets');
      response.assets.length.should.be.greaterThan(0);
      response.assets[0].asset.should.equal('/ext/marklogic/query/custom/directoryConstraint.xqy');
      done();
    }, done);
  });

  it('should remove the custom query', function(done){
    dbAdmin.config.query.custom.remove(dbModule).
    result(function(response){
      //console.log(response);
      response.path.should.equal('/marklogic/query/custom/directoryConstraint.xqy');
      done();
    }, done);
  });

  it('should list 0 custom query', function(done){
    dbAdmin.config.query.custom.list().
    result(function(response){
      //console.log(response);
      response.assets.length.should.equal(0);
      done();
    }, done);
  });

  it('should write the custom query for test', function(done){
    this.timeout(10000);
    dbAdmin.config.query.custom.write(
      dbModule, 
      [{'role-name':'app-user', capabilities:['execute']}], 
      fs.createReadStream(fsPath)).
    result(function(response){
      done();
    }, done);
  });

  it('should write document for test', function(done){
    dbWriter.documents.write({
      uri: '/test/custom/query/customQuery1.json', 
      collections: ['customCollection'], 
      contentType: 'application/json',
      content: {
        title: 'this is custom query'
      }
    }).
    result(function(response) {
      //console.log(response);
      done();
    }, done);
  });

  it('should use custom query in a query', function(done){
    dbWriter.documents.query(
      q.where(
        q.parsedFrom('dirs:/test/custom/query/',
          q.parseBindings(
            q.parseFunction('directoryConstraint.xqy', q.bind('dirs'))
          )
        )
      )
    ).
    result(function(response) {
      //console.log(response);
      response[0].uri.should.equal('/test/custom/query/customQuery1.json');
      done();
    }, done);
  });

  it('should remove the custom query after the query test', function(done){
    dbAdmin.config.query.custom.remove(dbModule).
    result(function(response){
      done();
    }, done);
  });

  it('should remove the document', function(done){
    dbAdmin.documents.removeAll({directory: '/test/custom/query/'}).
    result(function(response){
      done();
    }, done);
  });

});
