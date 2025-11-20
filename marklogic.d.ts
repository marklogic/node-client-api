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
   * Result object returned by checkConnection method.
   */
  export interface ConnectionCheckResult {
    /** Whether the connection was successful */
    connected: boolean;
    /** HTTP status code if connection failed */
    httpStatusCode?: number;
    /** HTTP status message if connection failed */
    httpStatusMessage?: string;
  }

  /**
   * Generic document content type - can be JSON, XML, text, or binary
   */
  export type DocumentContent = any;

  /**
   * A document descriptor for reading or writing documents.
   */
  export interface DocumentDescriptor {
    /** The URI identifier for the document */
    uri: string;
    /** The content of the document (JSON, XML, text, or Buffer for binary) */
    content?: DocumentContent;
    /** The MIME type of the document */
    contentType?: string;
    /** Collections to which the document belongs */
    collections?: string | string[];
    /** Permissions controlling document access */
    permissions?: Array<{
      'role-name': string;
      capabilities: string[];
    }>;
    /** Properties (metadata) for the document */
    properties?: Record<string, any>;
    /** Quality ranking for the document */
    quality?: number;
    /** Metadata values for the document */
    metadataValues?: Record<string, any>;
  }

  /**
   * Result from a probe operation indicating if a document exists.
   */
  export interface ProbeResult {
    /** The URI of the document */
    uri: string;
    /** Whether the document exists */
    exists: boolean;
    /** Content type if document exists */
    contentType?: string;
    /** Content length if document exists */
    contentLength?: number;
  }

  /**
   * Result from a remove operation.
   */
  export interface RemoveResult {
    /** Array of removed document URIs */
    uris: string[];
    /** Whether documents were removed */
    removed: boolean;
    /** System time of the operation */
    systemTime?: string;
  }

  /**
   * Result from a write operation.
   */
  export interface WriteResult {
    /** Array of document descriptors with URIs of written documents */
    documents: DocumentDescriptor[];
    /** System time of the operation */
    systemTime?: string;
  }

  /**
   * Documents interface for reading and writing documents.
   */
  export interface Documents {
    /**
     * Checks whether a document exists.
     * @param uri - The URI of the document to check
     * @returns A result provider that resolves to probe result
     */
    probe(uri: string): ResultProvider<ProbeResult>;

    /**
     * Reads one or more documents.
     * @param uris - A URI string or array of URI strings
     * @returns A result provider that resolves to an array of document descriptors
     */
    read(uris: string | string[]): ResultProvider<DocumentDescriptor[]>;

    /**
     * Writes one or more documents.
     * @param documents - A document descriptor or array of document descriptors
     * @returns A result provider that resolves to a write result with document URIs
     */
    write(documents: DocumentDescriptor | DocumentDescriptor[]): ResultProvider<WriteResult>;

    /**
     * Removes one or more documents.
     * @param uris - A URI string or array of URI strings
     * @returns A result provider that resolves to a remove result
     */
    remove(uris: string | string[]): ResultProvider<RemoveResult>;
  }

  /**
   * A database client object returned by createDatabaseClient.
   * Provides access to document, graph, and query operations.
   */
  export interface DatabaseClient {
    /**
     * Documents interface for reading and writing documents.
     * @since 1.0
     */
    documents: Documents;

    /**
     * Tests if a connection is successful.
     * Call .result() to get a promise.
     * @since 2.1
     * @returns A result provider with a result() method
     */
    checkConnection(): ResultProvider<ConnectionCheckResult>;

    /**
     * Releases the client and destroys the agent.
     * Call this method when you're done with the client to free up resources.
     * @since 3.0.0
     */
    release(): void;
  }

  /**
   * A result provider that wraps asynchronous operations.
   * Call .result() to get a Promise for the result.
   */
  export interface ResultProvider<T> {
    /**
     * Gets a promise for the operation result.
     * @param onFulfilled - Optional callback for success
     * @param onRejected - Optional callback for errors
     * @returns A promise that resolves to the result
     */
    result(onFulfilled?: (value: T) => void, onRejected?: (reason: any) => void): Promise<T>;
  }

  /**
   * Creates a DatabaseClient object for accessing a database.
   * @param config - Configuration for connecting to the database
   * @returns A DatabaseClient object for performing database operations
   */
  export function createDatabaseClient(config: DatabaseClientConfig): DatabaseClient;

  /**
   * Releases a client and destroys its agent.
   * This is a standalone function equivalent to calling client.release().
   * @since 3.0.0
   * @param client - The DatabaseClient to release
   */
  export function releaseClient(client: DatabaseClient): void;

  const marklogic: {
    createDatabaseClient: typeof createDatabaseClient;
    releaseClient: typeof releaseClient;
  };

  export default marklogic;
}
