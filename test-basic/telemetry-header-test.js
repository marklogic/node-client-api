/*
* Copyright (c) 2015-2026 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/

'use strict';

const assert = require('assert');
const marklogic = require('../');
const mlutil = require('../lib/mlutil');
const requester = require('../lib/requester');

function buildRequestOptions(connectionParams) {
  return mlutil.newRequestOptions(connectionParams, '/v1/ping', 'HEAD');
}

describe('ML-Agent-ID telemetry header', function() {
  it('should include ML-Agent-ID header by default', function() {
    const client = marklogic.createDatabaseClient({
      host: 'localhost',
      port: 8000,
      user: 'admin',
      password: 'admin',
      authType: 'digest'
    });

    const options = buildRequestOptions(client.connectionParams);
    const operation = {
      options: options,
      requestType: 'invalid-request-type'
    };

    assert.throws(
      () => requester.startRequest(operation),
      /unknown request type invalid-request-type/
    );
    assert.strictEqual(options.headers['ML-Agent-ID'], 'nodejs');

    client.release();
  });

  it('should omit ML-Agent-ID header when disableTelemetryHeader is true', function() {
    const client = marklogic.createDatabaseClient({
      host: 'localhost',
      port: 8000,
      user: 'admin',
      password: 'admin',
      authType: 'digest',
      disableTelemetryHeader: true
    });

    const options = buildRequestOptions(client.connectionParams);
    const operation = {
      options: options,
      requestType: 'invalid-request-type'
    };

    assert.throws(
      () => requester.startRequest(operation),
      /unknown request type invalid-request-type/
    );
    assert.strictEqual(client.connectionParams.disableTelemetryHeader, true);
    assert.strictEqual(options.headers['ML-Agent-ID'], undefined);

    client.release();
  });
});
