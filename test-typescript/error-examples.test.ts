/*
* Copyright (c) 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/

/// <reference path="../marklogic.d.ts" />

// This file demonstrates TypeScript catching type errors
// To see the errors, uncomment sections below and run: npm run test:types

import type { DatabaseClientConfig } from 'marklogic';

// ✅ This works - valid authType
const validConfig: DatabaseClientConfig = {
  authType: 'digest'
};

// ❌ UNCOMMENT THIS to see TypeScript catch an invalid authType:
// const invalidAuthType: DatabaseClientConfig = {
//   authType: 'invalid-type'  // Error: Type '"invalid-type"' is not assignable to type 'basic' | 'digest' | ...
// };

// ❌ UNCOMMENT THIS to see TypeScript catch wrong type for port:
// const invalidPort: DatabaseClientConfig = {
//   port: 'not-a-number'  // Error: Type 'string' is not assignable to type 'number'
// };

// ❌ UNCOMMENT THIS to see TypeScript catch wrong type for ssl:
// const invalidSsl: DatabaseClientConfig = {
//   ssl: 'yes'  // Error: Type 'string' is not assignable to type 'boolean'
// };

// ❌ UNCOMMENT THIS to see TypeScript catch invalid certificate type:
// const invalidCert: DatabaseClientConfig = {
//   cert: 123  // Error: Type 'number' is not assignable to type 'string | Buffer'
// };

console.log('✅ All valid configurations passed type checking!');
console.log('💡 Uncomment the error examples above to see TypeScript catch type errors');
