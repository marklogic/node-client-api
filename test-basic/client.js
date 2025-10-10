/*
* Copyright (c) 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/
var assert = require('assert');
var should = require('should');

var http = require('http');

var testconfig = require('../etc/test-config.js');

var marklogic = require('../');
var q = marklogic.queryBuilder;

// 'rest-evaluator' user can evaluate against an alternate db:
// http://docs.marklogic.com/guide/rest-dev/intro#id_72318
var connection = {
  user: testconfig.restEvaluatorConnection.user,
  password: testconfig.restEvaluatorConnection.password
};
Object.keys(testconfig.restWriterConnection).forEach(function (key) {
  if (connection[key] === undefined) {
    connection[key] = testconfig.restWriterConnection[key];
  }
});
var db = marklogic.createDatabaseClient(connection);

var otherConnection = {
  database: 'unittest-nodeapi',
  port: '8000'
};
Object.keys(connection).forEach(function (key) {
  if (otherConnection[key] === undefined) {
    otherConnection[key] = connection[key];
  }
});
var otherDb = marklogic.createDatabaseClient(otherConnection);

var agentConnection = {
  agent: new http.Agent({ keepAlive: true, keepAliveTimeoutMsecs: 1000 })
};
Object.keys(otherConnection).forEach(function (key) {
  if (agentConnection[key] === undefined) {
    agentConnection[key] = otherConnection[key];
  }
});
var agentDb = marklogic.createDatabaseClient(agentConnection);

describe('database clients', function () {
  it('should write in a default db and read in a specified db', function (done) {
    db.documents.write({
      uri: '/test/database/doc1.json',
      contentType: 'application/json',
      content: {
        id: 'database1',
        value: 'Database One'
      }
    })
      .result(function (document) {
        return otherDb.documents.probe('/test/database/doc1.json').result();
      })
      .then(function (document) {
        document.exists.should.equal(true);
        done();
      })
      .catch(done);
  });
  it('should write in a specified db and read in a default db', function (done) {
    otherDb.documents.write({
      uri: '/test/database/doc2.json',
      contentType: 'application/json',
      content: {
        id: 'database2',
        value: 'Database Two'
      }
    })
      .result(function (document) {
        return db.documents.probe('/test/database/doc2.json').result();
      })
      .then(function (document) {
        document.exists.should.equal(true);
        done();
      })
      .catch(done);
  });
  it('should use a default agent', function (done) {
    otherDb.connectionParams.agent.options.keepAlive.should.equal(true);
    done();
  });
  it('should use a custom agent', function (done) {
    agentDb.connectionParams.agent.options.keepAliveTimeoutMsecs.should.equal(1000);
    done();
  });
  it('should create a timestamp', function (done) {
    let timestamp = db.createTimestamp('123');
    timestamp.value.should.equal('123');
    done();
  });
  it('should throw Error when server expects DIGEST and authType is CERTIFICATE', function (done) {
    const db = marklogic.createDatabaseClient({
      host: "localhost",
      port: 8015,
      authType: 'certificate'
    });
    const query = marklogic.queryBuilder
      .where(marklogic.ctsQueryBuilder.cts.directoryQuery('/optic/test/'));

    db.documents.query(query)
      .result(function (documents) {
        documents.forEach(function (document) {
        });
      })
      .catch(error => {
        assert(error.toString().includes('response with invalid 401 status with path: /v1/search'));
        marklogic.releaseClient(db);
        done();
      });
  });

  it('rejectUnauthorized param should be populated correctly', function (done) {

    const connectionOptions = {
      host: testconfig.restWriterConnection.host,
      port: testconfig.restWriterConnection.port,
      user: testconfig.restWriterConnection.user,
      password: testconfig.restWriterConnection.password,
      rejectUnauthorized: false,
      ssl: true
    };
    let databaseClient = marklogic.createDatabaseClient(connectionOptions);
    try {
      assert(databaseClient);
      assert(databaseClient.connectionParams.rejectUnauthorized === false);
      done();
    } catch (error) {
      done(error);
    }
  });

  it('should throw Error when SSL is used and server does not use SSL', function(done) {
    const db = marklogic.createDatabaseClient(testconfig.restWriterConnectionWithSsl);
    db.documents.write({
      uri: '/test/write/string1.json',
      contentType: 'application/json',
      content: '{"key1":"value 1"}'
    })
        .result()
        .catch(error => {
          try{
            assert(error.message.toString().includes('You have attempted to access an HTTP server using HTTPS. Please check your configuration.') ||
                   error.message.toString().includes('write EPROTO'));
            done();
          } catch(err){
            done(err);
          }
        });
  });

  it('should throw error when authType is OAuth and oauthToken is missing', function(done){
    try {
       marklogic.createDatabaseClient(testconfig.restConnectionForOauth);
    } catch(error){
      assert(error.message.toString().includes('oauthToken required for OAuth authentication. '));
      done();
    }
  });
});
