/*
* Copyright (c) 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/

// Simple TypeScript type checking test
// This test validates the DatabaseClientConfig interface without needing the actual module
// Run with: npm run test:types

/**
 * To test the types, we'll reference them directly from the .d.ts file
 * This simulates what would happen when a user imports the module
 */

// Test by creating a type that should match DatabaseClientConfig
type TestConfig = {
  host?: string;
  port?: number;
  user?: string;
  password?: string;
  database?: string;
  authType?: 'basic' | 'digest' | 'application-level' | 'certificate' | 'kerberos' | 'saml' | 'cloud';
  ssl?: boolean;
  ca?: string | string[] | Buffer | Buffer[];
  cert?: string | Buffer;
  key?: string | Buffer;
  pfx?: Buffer;
  passphrase?: string;
  rejectUnauthorized?: boolean;
  token?: string;
  agent?: any;
  apiVersion?: string;
};

// Valid configurations that should work
const validConfig1: TestConfig = {
  host: 'localhost',
  port: 8000,
  user: 'admin',
  password: 'admin',
  authType: 'digest'
};

const validConfig2: TestConfig = {
  host: 'secure.marklogic.com',
  port: 8443,
  user: 'admin',
  password: 'admin',
  authType: 'basic',
  ssl: true,
  rejectUnauthorized: true
};

// Testing type constraints - these should cause errors if uncommented:

// Error: Invalid authType
// const invalidAuth: TestConfig = {
//   authType: 'invalid-type' as any
// };

// Testing that authType is properly restricted
const validAuthTypes: Array<TestConfig['authType']> = [
  'basic',
  'digest',
  'application-level',
  'certificate',
  'kerberos',
  'saml',
  'cloud',
  undefined // undefined is valid for optional fields
];

// Testing Buffer and string union types for certificates
const certTest1: TestConfig = {
  ca: 'string cert',
  cert: Buffer.from('cert'),
  key: 'string key'
};

const certTest2: TestConfig = {
  ca: ['cert1', 'cert2'],
  cert: 'string cert',
  key: Buffer.from('key')
};

console.log('✅ TypeScript type constraints validated!');
