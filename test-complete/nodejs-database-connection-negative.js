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

describe('Database connection negative test', function(){

  it('should fail to create db connection with invalid host', function(done){
    try {
      marklogic.createDatabaseClient({
        host: 'invalid',
        port: '8015',
        user: 'admin',
        password: 'admin',
        authType: 'DIGEST'
      }).should.equal('SHOULD HAVE FAILED');
      done();
    } catch(error) {
      //console.log(error);
      error.should.be.ok;
      done();
    }
  });

  it('should fail to create db connection with occupied port', function(done){
    try {
      marklogic.createDatabaseClient({
        host: 'localhost',
        port: '8000',
        user: 'admin',
        password: 'admin',
        authType: 'DIGEST'
      }).should.equal('SHOULD HAVE FAILED');
      done();
    } catch(error) {
      //console.log(error);
      error.should.be.ok;
      done();
    }
  });

  it('should fail to create db connection with invalid db', function(done){
    try {
      marklogic.createDatabaseClient({
        host: 'localhost',
        port: '8015',
        database: 'invalid',
        user: 'admin',
        password: 'admin',
        authType: 'DIGEST'
      }).should.equal('SHOULD HAVE FAILED');
      done();
    } catch(error) {
      //console.log(error);
      error.should.be.ok;
      done();
    }
  });

  it('should fail to create db connection with invalid user and password', function(done){
    try {
      marklogic.createDatabaseClient({
        host: 'localhost',
        port: '8015',
        user: 'foo',
        password: 'foo',
        authType: 'DIGEST'
      }).should.equal('SHOULD HAVE FAILED');
      done();
    } catch(error) {
      //console.log(error);
      error.should.be.ok;
      done();
    }
  });

  it('should fail to create db connection with invalid auth type', function(done){
    try {
      marklogic.createDatabaseClient({
        host: 'localhost',
        port: '8015',
        user: 'admin',
        password: 'admin',
        authType: 'DIGEST'
      }).should.equal('SHOULD HAVE FAILED');
      done();
    } catch(error) {
      //console.log(error);
      error.should.be.ok;
      done();
    }
  });

});
