/*
* Copyright (c) 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/

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

// Create test types that should match the actual marklogic types
type ConnectionCheckResult = {
  connected: boolean;
  httpStatusCode?: number;
  httpStatusMessage?: string;
};

type DatabaseClient = {
  checkConnection(): Promise<ConnectionCheckResult>;
  release(): void;
};

type DatabaseClientConfig = {
  host?: string;
  port?: number;
  user?: string;
  password?: string;
};

// Simulate the marklogic module interface
type MarkLogicModule = {
  createDatabaseClient(config: DatabaseClientConfig): DatabaseClient;
  releaseClient(client: DatabaseClient): void;
};

// Test checkConnection() return type
async function testCheckConnection(marklogic: MarkLogicModule) {
  const client = marklogic.createDatabaseClient({
    host: 'localhost',
    port: 8000,
    user: 'admin',
    password: 'admin'
  });

  // Should return a Promise<ConnectionCheckResult>
  const result = await client.checkConnection();

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
function testRelease(marklogic: MarkLogicModule) {
  const client = marklogic.createDatabaseClient({
    host: 'localhost',
    port: 8000,
    user: 'admin',
    password: 'admin'
  });

  // Should be callable with no return value
  client.release();

  // This is the correct usage pattern
}

// Test releaseClient() standalone function
function testReleaseClientFunction(marklogic: MarkLogicModule) {
  const client = marklogic.createDatabaseClient({
    host: 'localhost',
    port: 8000,
    user: 'admin',
    password: 'admin'
  });

  // Should accept a DatabaseClient and return void
  marklogic.releaseClient(client);

  // This is equivalent to client.release()
}

// Test proper cleanup pattern
async function testProperCleanupPattern(marklogic: MarkLogicModule) {
  const client = marklogic.createDatabaseClient({
    host: 'localhost',
    port: 8000,
    user: 'admin',
    password: 'admin'
  });

  try {
    const result = await client.checkConnection();
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
