/*
* Copyright (c) 2015-2026 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/

/// <reference path="../marklogic.d.ts" />

// Simple TypeScript type checking test
// This test validates the DatabaseClientConfig interface without needing the actual module
// Run with: npm run test:types

import type { DatabaseClientConfig } from 'marklogic';

// Valid configurations that should work
const validConfig1: DatabaseClientConfig = {
  host: 'localhost',
  port: 8000,
  user: 'admin',
  password: 'admin',
  authType: 'digest'
};

const validConfig2: DatabaseClientConfig = {
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
// const invalidAuth: DatabaseClientConfig = {
//   authType: 'invalid-type' as any
// };

// Testing that authType is properly restricted
const validAuthTypes: Array<DatabaseClientConfig['authType']> = [
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
const certTest1: DatabaseClientConfig = {
  ca: 'string cert',
  cert: Buffer.from('cert'),
  key: 'string key'
};

const certTest2: DatabaseClientConfig = {
  ca: ['cert1', 'cert2'],
  cert: 'string cert',
  key: Buffer.from('key')
};

console.log('✅ TypeScript type constraints validated!');
