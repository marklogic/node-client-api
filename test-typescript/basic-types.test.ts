/*
* Copyright (c) 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/

// This file tests that TypeScript types work correctly
// Run with: npm run test:types
import marklogic from 'marklogic';

// Test 1: Valid configuration should compile without errors
const validConfig: marklogic.DatabaseClientConfig = {
  host: 'localhost',
  port: 8000,
  user: 'admin',
  password: 'admin',
  authType: 'digest'
};

const db = marklogic.createDatabaseClient(validConfig);

// Test 2: Another valid configuration with SSL
const sslConfig: marklogic.DatabaseClientConfig = {
  host: 'secure.marklogic.com',
  port: 8443,
  user: 'admin',
  password: 'admin',
  authType: 'basic',
  ssl: true,
  rejectUnauthorized: true
};

const secureDb = marklogic.createDatabaseClient(sslConfig);

// Test 3: This should cause a type error if uncommented (invalid authType)
// const invalidConfig: marklogic.DatabaseClientConfig = {
//   host: 'localhost',
//   authType: 'invalid-auth-type' // ERROR: not a valid authType
// };

// Test 4: Type inference should work (no explicit type annotation needed)
const inferredConfig = {
  host: 'localhost',
  port: 8000,
  user: 'admin',
  password: 'admin'
};
const db2 = marklogic.createDatabaseClient(inferredConfig);

// Test 5: Testing optional fields - this should compile fine
const minimalConfig: marklogic.DatabaseClientConfig = {
  user: 'admin',
  password: 'admin'
};

// Test 6: Testing all auth types (all should be valid)
const authTypes: Array<marklogic.DatabaseClientConfig['authType']> = [
  'basic',
  'digest',
  'application-level',
  'certificate',
  'kerberos',
  'saml',
  'cloud'
];

// Test 7: Testing SSL certificate options
const certConfig: marklogic.DatabaseClientConfig = {
  host: 'localhost',
  ssl: true,
  ca: Buffer.from('certificate'),
  cert: 'string-cert',
  key: Buffer.from('key')
};

console.log('✅ TypeScript types validated successfully!');
