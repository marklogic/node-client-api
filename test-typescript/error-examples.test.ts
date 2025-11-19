/*
* Copyright (c) 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/

// This file demonstrates TypeScript catching type errors
// To see the errors, uncomment sections below and run: npm run test:types

type ConfigType = {
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

// ✅ This works - valid authType
const validConfig: ConfigType = {
  authType: 'digest'
};

// ❌ UNCOMMENT THIS to see TypeScript catch an invalid authType:
// const invalidAuthType: ConfigType = {
//   authType: 'invalid-type'  // Error: Type '"invalid-type"' is not assignable to type 'basic' | 'digest' | ...
// };

// ❌ UNCOMMENT THIS to see TypeScript catch wrong type for port:
// const invalidPort: ConfigType = {
//   port: 'not-a-number'  // Error: Type 'string' is not assignable to type 'number'
// };

// ❌ UNCOMMENT THIS to see TypeScript catch wrong type for ssl:
// const invalidSsl: ConfigType = {
//   ssl: 'yes'  // Error: Type 'string' is not assignable to type 'boolean'
// };

// ❌ UNCOMMENT THIS to see TypeScript catch invalid certificate type:
// const invalidCert: ConfigType = {
//   cert: 123  // Error: Type 'number' is not assignable to type 'string | Buffer'
// };

console.log('✅ All valid configurations passed type checking!');
console.log('💡 Uncomment the error examples above to see TypeScript catch type errors');
