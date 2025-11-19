/*
* Copyright (c) 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/

/**
 * Realistic TypeScript usage example for MarkLogic Node.js Client
 *
 * This file demonstrates how users will consume the library with TypeScript.
 *
 * Setup:
 *   npm run setup    # First time only
 *   npm test         # Check types
 *
 * Try this:
 * - Start typing to see autocomplete
 * - Hover over methods to see documentation
 * - Uncomment error examples to see TypeScript catch mistakes
 */

import * as marklogic from 'marklogic';

// Example: Create a client with autocomplete support
const client = marklogic.createDatabaseClient({
  host: 'localhost',
  port: 8000,
  user: 'admin',
  password: 'admin',
  authType: 'digest' // Try typing here - autocomplete suggests all valid auth types!
});

// Example: Test connection with proper typing
async function testConnection() {
  const result = await client.checkConnection();

  // TypeScript knows the shape of ConnectionCheckResult
  if (result.connected) {
    console.log('✅ Connected successfully!');
  } else {
    // These optional properties only exist when connected = false
    console.error(`❌ Connection failed: ${result.httpStatusCode} - ${result.httpStatusMessage}`);
  }

  return result;
}

// Example: Proper cleanup pattern
async function properUsagePattern() {
  const db = marklogic.createDatabaseClient({
    host: 'localhost',
    port: 8000,
    user: 'admin',
    password: 'admin'
  });

  try {
    const status = await db.checkConnection();
    if (status.connected) {
      console.log('Ready to work with database');
      // Do your database operations here...
    }
  } finally {
    // Always clean up - TypeScript knows this method exists
    db.release();

    // Alternative: use the standalone function
    // marklogic.releaseClient(db);
  }
}

// =============================================================================
// ERROR EXAMPLES - Uncomment these to see TypeScript catch mistakes!
// =============================================================================

// ❌ Error: Invalid authType value
// const badAuthType = marklogic.createDatabaseClient({
//   authType: 'invalid-type'
// });

// ❌ Error: port should be number, not string
// const badPort = marklogic.createDatabaseClient({
//   port: '8000'
// });

// ❌ Error: ConnectionCheckResult.connected must be boolean
// const badResult: marklogic.ConnectionCheckResult = {
//   connected: 'yes' // Error: string is not assignable to boolean
// };

// ❌ Error: httpStatusCode must be number
// const badStatusCode: marklogic.ConnectionCheckResult = {
//   connected: false,
//   httpStatusCode: 'error' // Error: string is not assignable to number
// };

console.log('✅ TypeScript validation complete!');

// Export functions to prevent unused warnings
export { testConnection, properUsagePattern };
