/*
* Copyright (c) 2015-2026 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/

/// <reference path="../marklogic.d.ts" />

/**
 * TypeScript type checking tests for connection-related methods.
 *
 * This file validates:
 * - checkConnection() return type
 * - release() method
 * - releaseClient() standalone function
 *
 * These tests are compiled but NOT executed - they verify type correctness only.
 * Run with: npm run test:types
 */

import type { DatabaseClient, ConnectionCheckResult } from 'marklogic';
import * as marklogic from 'marklogic';

// Test checkConnection() return type
async function testCheckConnection(client: DatabaseClient) {
  // Should return a ResultProvider
  const resultProvider = client.checkConnection();
  const result = await resultProvider.result();

  // result.connected should be boolean
  const isConnected: boolean = result.connected;

  // When not connected, should have optional error properties
  if (!result.connected) {
    const statusCode: number | undefined = result.httpStatusCode;
    const statusMessage: string | undefined = result.httpStatusMessage;

    console.log(`Connection failed: ${statusCode} - ${statusMessage}`);
  }

  return isConnected;
}

// Test release() method on client
function testRelease(client: DatabaseClient) {
  // Should be callable with no return value
  client.release();

  // This is the correct usage pattern
}

// Test releaseClient() standalone function
function testReleaseClientFunction(client: DatabaseClient) {
  // Should accept a DatabaseClient and return void
  marklogic.releaseClient(client);

  // This is equivalent to client.release()
}

// Test proper cleanup pattern
async function testProperCleanupPattern(client: DatabaseClient) {
  try {
    const result = await client.checkConnection().result();
    if (result.connected) {
      console.log('Connected successfully!');
      // Do database operations...
    } else {
      console.error(`Connection failed: ${result.httpStatusCode}`);
    }
  } finally {
    // Always clean up resources
    client.release();
  }
}

// Test ConnectionCheckResult structure
const successResult: ConnectionCheckResult = {
  connected: true
};

const failureResult: ConnectionCheckResult = {
  connected: false,
  httpStatusCode: 401,
  httpStatusMessage: 'Unauthorized'
};

// These should cause errors if uncommented:
// const invalidResult1: ConnectionCheckResult = {
//   connected: 'yes' // Error: should be boolean
// };

// const invalidResult2: ConnectionCheckResult = {
//   connected: true,
//   httpStatusCode: 'error' // Error: should be number
// };

console.log('✅ Connection method types validated!');

// Export to prevent "unused" errors
export {
  testCheckConnection,
  testRelease,
  testReleaseClientFunction,
  testProperCleanupPattern,
  successResult,
  failureResult
};
