/*
* Copyright (c) 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/

/**
 * Compile-time type checking tests for setLogger and setAuthToken.
 * These tests verify TypeScript type definitions but don't execute.
 */

/// <reference path="../marklogic.d.ts" />

import type { DatabaseClient } from 'marklogic';

const marklogic = require('../lib/marklogic.js');

const db: DatabaseClient = marklogic.createDatabaseClient({
  host: 'localhost',
  port: 8000,
  user: 'admin',
  password: 'admin'
});

// Test setLogger with logger object
const bunyanLogger = {
  debug: (msg: string) => console.log(msg),
  info: (msg: string) => console.log(msg),
  warn: (msg: string) => console.log(msg),
  error: (msg: string) => console.log(msg)
};
db.setLogger(bunyanLogger);
db.setLogger(bunyanLogger, true); // error-first (Bunyan style)
db.setLogger(bunyanLogger, false); // error-last (Winston style)

// Test setLogger with level string
db.setLogger('debug');
db.setLogger('info');
db.setLogger('warn');
db.setLogger('error');
db.setLogger('silent');

// Test setAuthToken
db.setAuthToken('new-saml-token-string');

console.log('Compile-time tests pass for setLogger and setAuthToken');
