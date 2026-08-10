/*
 * Copyright (c) 2015-2026 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
 */

/// <reference path="../marklogic.d.ts" />

import assert = require('assert');

const marklogic = require('..');
const mlutil = require('../lib/mlutil');
const requester = require('../lib/requester');

type DatabaseClientConfig = import('marklogic').DatabaseClientConfig;

function verifyTelemetryHeader(config: DatabaseClientConfig, expectedHeader: string | undefined): void {
  const client = marklogic.createDatabaseClient(config);
  const options = mlutil.newRequestOptions(client.connectionParams, '/v1/ping', 'HEAD');
  const operation = {
    options,
    requestType: 'invalid-request-type'
  };

  assert.throws(
    () => requester.startRequest(operation),
    /unknown request type invalid-request-type/
  );
  assert.strictEqual(options.headers['ML-Agent-ID'], expectedHeader);

  client.release();
}

describe('telemetry header runtime validation', function() {
  it('includes ML-Agent-ID by default', function() {
    verifyTelemetryHeader(
      {
        host: 'localhost',
        port: 8000,
        user: 'admin',
        password: 'admin',
        authType: 'digest'
      },
      'nodejs'
    );
  });

  it('omits ML-Agent-ID when disableTelemetryHeader is true', function() {
    verifyTelemetryHeader(
      {
        host: 'localhost',
        port: 8000,
        user: 'admin',
        password: 'admin',
        authType: 'digest',
        disableTelemetryHeader: true
      },
      undefined
    );
  });
});
