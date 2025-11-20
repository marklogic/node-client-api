/*
 * Copyright (c) 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
 */

/// <reference path="../marklogic.d.ts" />

/**
 * TypeScript runtime test to validate that checkConnection returns ResultProvider.
 * This test ensures the TypeScript definitions match the actual runtime behavior
 * by making real calls to MarkLogic AND verifying types at compile time.
 */

import should = require('should');
const marklogic = require('..');
const testconfig = require('../etc/test-config-qa.js');

const db = marklogic.createDatabaseClient(testconfig.restReaderConnection);

// Type alias for easier reference
type ResultProvider<T> = import('marklogic').ResultProvider<T>;
type ConnectionCheckResult = import('marklogic').ConnectionCheckResult;
type DatabaseClientConfig = import('marklogic').DatabaseClientConfig;

describe('checkConnection ResultProvider validation', function() {

  it('should return ResultProvider with .result() method', function(done) {
    // This validates that checkConnection returns a ResultProvider
    // TypeScript will verify the type at compile time
    const resultProvider: ResultProvider<ConnectionCheckResult> = db.checkConnection();

    // Verify it has a .result() method (core requirement for ResultProvider)
    should(resultProvider).have.property('result');
    should(resultProvider.result).be.a.Function();

    // Call .result() to get a Promise
    const promise: Promise<ConnectionCheckResult> = resultProvider.result();

    // Verify .result() returns a Promise (thenable)
    should(promise).have.property('then');
    should(promise.then).be.a.Function();

    // Verify the Promise resolves to ConnectionCheckResult
    promise.then((response: ConnectionCheckResult) => {
      should(response).have.property('connected');
      should(response.connected).be.a.Boolean();

      if (response.connected === true) {
        done();
      } else {
        done(new Error('Expected connection to succeed but got: ' + JSON.stringify(response)));
      }
    }).catch(done);
  });

  it('should work with async/await pattern', async function() {
    // TypeScript verifies the return type matches ConnectionCheckResult
    const result: ConnectionCheckResult = await db.checkConnection().result();

    // Verify result shape matches ConnectionCheckResult
    should(result).have.property('connected');
    should(result.connected).be.a.Boolean();
    should(result.connected).equal(true);
  });

  it('should have error properties when connection fails', function(done) {
    // Test with wrong password to get a failed connection
    const config: DatabaseClientConfig = {
      host: testconfig.restReaderConnection.host,
      user: testconfig.restReaderConnection.user,
      password: 'wrongpassword',  // Invalid password
      port: testconfig.restReaderConnection.port,
      authType: testconfig.restReaderConnection.authType
    };
    const db1 = marklogic.createDatabaseClient(config);

    db1.checkConnection().result().then((response: ConnectionCheckResult) => {
      should(response).have.property('connected');
      should(response.connected).be.a.Boolean();

      if (response.connected === false) {
        // When connected is false, optional error properties should exist
        should(response).have.property('httpStatusCode');
        should(response.httpStatusCode).be.a.Number();
        should(response).have.property('httpStatusMessage');
        should(response.httpStatusMessage).be.a.String();
      }

      db1.release();
      done();
    }).catch(done);
  });

  after(function(done) {
    db.release();
    done();
  });
});
