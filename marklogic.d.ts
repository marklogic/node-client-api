/*
* Copyright (c) 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/

// Type definitions for marklogic
// Project: https://github.com/marklogic/node-client-api
// Documentation: https://docs.marklogic.com/guide/node-dev

/**
 * MarkLogic Node.js Client API
 *
 * IMPORTANT: This library uses CommonJS exports. Import patterns:
 *
 * For TypeScript/ES Modules:
 *   import marklogic from 'marklogic';  // Preferred
 *   const db = marklogic.createDatabaseClient({...});
 *
 * For CommonJS:
 *   const marklogic = require('marklogic');
 *   const db = marklogic.createDatabaseClient({...});
 */

declare module 'marklogic' {
  /**
   * Configuration object for creating a database client.
   * Used by the createDatabaseClient function to establish connection parameters.
   */
  export interface DatabaseClientConfig {
    /** The host with the REST server for the database (defaults to 'localhost') */
    host?: string;
    /** The port with the REST server for the database (defaults to 8000) */
    port?: number;
    /** The user with permission to access the database */
    user?: string;
    /** The password for the user with permission to access the database */
    password?: string;
    /** The name of the database to access (defaults to the database for the REST server) */
    database?: string;
    /** The authentication type (defaults to 'digest') */
    authType?: 'basic' | 'digest' | 'application-level' | 'certificate' | 'kerberos' | 'saml' | 'cloud';
    /** Whether the REST server uses SSL (defaults to false) */
    ssl?: boolean;
    /** The trusted certificate(s), if required for SSL */
    ca?: string | string[] | Buffer | Buffer[];
    /** The public x509 certificate to use for SSL */
    cert?: string | Buffer;
    /** The private key to use for SSL */
    key?: string | Buffer;
    /** The public x509 certificate and private key as a single PKCS12 file to use for SSL */
    pfx?: Buffer;
    /** The passphrase for the PKCS12 file or private key */
    passphrase?: string;
    /** Whether to reject unauthorized SSL certificates (defaults to true) */
    rejectUnauthorized?: boolean;
    /** The SAML token to use for authentication with the REST server */
    token?: string;
    /** Connection pooling agent */
    agent?: any;
    /** API version to use */
    apiVersion?: string;
  }

  /**
   * A database client object returned by createDatabaseClient.
   * Provides access to document, graph, and query operations.
   */
  export interface DatabaseClient {
    // Methods will be added as we expand the type definitions
    // For now, this is a placeholder to enable basic typing
  }

  /**
   * Creates a DatabaseClient object for accessing a database.
   * @param config - Configuration for connecting to the database
   * @returns A DatabaseClient object for performing database operations
   */
  export function createDatabaseClient(config: DatabaseClientConfig): DatabaseClient;

  const marklogic: {
    createDatabaseClient: typeof createDatabaseClient;
  };

  export default marklogic;
}
