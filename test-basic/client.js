/*
 * Copyright 2014-2019 MarkLogic Corporation
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
var assert = require('assert');
var should = require('should');

var testconfig = require('../etc/test-config.js');

var marklogic = require('../');
var q = marklogic.queryBuilder;

var YAgent = require('yakaa');

// 'rest-evaluator' user can evaluate against an alternate db:
// http://docs.marklogic.com/guide/rest-dev/intro#id_72318
var connection = {
    user:     testconfig.restEvaluatorConnection.user,
    password: testconfig.restEvaluatorConnection.password
    };
Object.keys(testconfig.restWriterConnection).forEach(function(key){
  if (connection[key] === undefined) {
    connection[key] = testconfig.restWriterConnection[key];
  }
  });
var db = marklogic.createDatabaseClient(connection);

var otherConnection = {
  database: 'unittest-nodeapi',
  port:     '8000'
  };
Object.keys(connection).forEach(function(key){
  if (otherConnection[key] === undefined) {
    otherConnection[key] = connection[key];
  }
});
var otherDb = marklogic.createDatabaseClient(otherConnection);

var agentConnection = {
  agent: new YAgent({keepAlive: true, keepAliveTimeoutMsecs: 1000})
}
Object.keys(otherConnection).forEach(function(key){
  if (agentConnection[key] === undefined) {
    agentConnection[key] = otherConnection[key];
  }
});
var agentDb = marklogic.createDatabaseClient(agentConnection);

describe('database clients', function() {
  it('should write in a default db and read in a specified db', function(done) {
    db.documents.write({
      uri: '/test/database/doc1.json',
      contentType: 'application/json',
      content: {
        id:    'database1',
        value: 'Database One'
        }
      })
    .result(function(document) {
        return otherDb.documents.probe('/test/database/doc1.json').result();
      })
    .then(function(document) {
      document.exists.should.equal(true);
      done();
      })
    .catch(done);
  });
  it('should write in a specified db and read in a default db', function(done) {
    otherDb.documents.write({
      uri: '/test/database/doc2.json',
      contentType: 'application/json',
      content: {
        id:    'database2',
        value: 'Database Two'
        }
      })
    .result(function(document) {
        return db.documents.probe('/test/database/doc2.json').result();
      })
    .then(function(document) {
      document.exists.should.equal(true);
      done();
      })
    .catch(done);
  });
  it('should use a default agent', function(done) {
    otherDb.connectionParams.agent.options.keepAlive.should.equal(true);
    done();
  });
  it('should use a custom agent', function(done) {
    agentDb.connectionParams.agent.options.keepAliveTimeoutMsecs.should.equal(1000);
    done();
  });
  it('should create a timestamp', function(done) {
    let timestamp = db.createTimestamp('123');
    timestamp.value.should.equal('123');
    done();
  });
});
