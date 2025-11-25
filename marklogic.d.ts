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
   * A timestamp object representing a point in time on the server.
   * Used for point-in-time queries and operations.
   * @since 2.1.1
   */
  export interface Timestamp {
    /** The timestamp value as a string */
    value: string | null;
  }

  /**
   * Result value from eval, xqueryEval, or invoke operations.
   * Each returned value includes format, datatype, and the actual value.
   */
  export interface EvalResult {
    /** Format of the value: 'json', 'xml', 'text', or 'binary' */
    format: 'json' | 'xml' | 'text' | 'binary';
    /** Datatype of the value (e.g., 'node()', 'string', 'boolean', 'integer') */
    datatype: string;
    /** The actual value (type depends on format and datatype) */
    value: any;
  }

  /**
   * Result from a removeAll operation.
   */
  export interface RemoveAllResult {
    /** Always false (indicates removal operation completed) */
    exists: boolean;
    /** Collection that was removed (if specified) */
    collection?: string;
    /** Directory that was removed (if specified) */
    directory?: string;
    /** Whether all documents were removed */
    allDocuments?: boolean;
  }

  /**
   * Result from a protect operation on a temporal document.
   */
  export interface ProtectResult {
    /** The URI of the protected document */
    uri: string;
    /** The temporal collection name */
    temporalCollection: string;
    /** The protection level (noWipe, noDelete, or noUpdate) */
    level: string;
  }

  /**
   * Result from a wipe operation on a temporal document.
   */
  export interface WipeResult {
    /** The URI of the wiped document */
    uri: string;
    /** The temporal collection name */
    temporalCollection: string;
    /** Whether the document was wiped */
    wiped: boolean;
  }

  /**
   * Result from advancing LSQT on a temporal collection.
   */
  export interface AdvanceLsqtResult {
    /** The new Last Stable Query Time */
    lsqt: string;
  }

  /**
   * Result from a patch operation.
   */
  export interface PatchResult {
    /** The URI of the patched document */
    uri: string;
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
     * Writes one or more documents with additional parameters.
     * @param params - Configuration object with documents and optional parameters
     * @returns A result provider that resolves to a write result with document URIs
     */
    write(params: {
      /** The document(s) to write */
      documents: DocumentDescriptor | DocumentDescriptor[];
      /** Categories of information to write */
      categories?: string | string[];
      /** Transaction id or Transaction object */
      txid?: string | object;
      /** Transform to apply on the server */
      transform?: string | object;
      /** Forest name to write to */
      forestName?: string;
      /** Temporal collection for temporal documents */
      temporalCollection?: string;
      /** System time for temporal documents (ISO 8601 string or Date object) */
      systemTime?: string | Date;
    }): ResultProvider<WriteResult>;

    /**
     * Removes one or more documents.
     * @param uris - A URI string or array of URI strings
     * @returns A result provider that resolves to a remove result
     */
    remove(uris: string | string[]): ResultProvider<RemoveResult>;

    /**
     * Removes all documents in a collection, directory, or database.
     * Requires rest-admin role to delete all documents, rest-writer role otherwise.
     * @param params - Configuration object with collection, directory, all, or txid properties
     * @returns A result provider that resolves to a remove all result
     */
    removeAll(params: {
      /** The collection whose documents should be deleted */
      collection?: string;
      /** A directory whose documents should be deleted */
      directory?: string;
      /** Delete all documents (requires rest-admin role) */
      all?: boolean;
      /** Transaction id or Transaction object */
      txid?: string | object;
    }): ResultProvider<RemoveAllResult>;

    /**
     * Protects a temporal document from certain operations.
     * Must specify either duration or expireTime.
     * @param params - Configuration object with either duration or expireTime
     * @returns A result provider that resolves to protect result
     */
    protect(params: {
      /** The URI of the temporal document */
      uri: string;
      /** The temporal collection name */
      temporalCollection: string;
      /** Protection level: 'noWipe' | 'noDelete' | 'noUpdate' (default: 'noDelete') */
      level?: string;
      /** Archive path for the document */
      archivePath?: string;
    } & (
      { /** Duration as XSD duration string (e.g., 'P30D') */ duration: string; expireTime?: never; } |
      { /** Expire time (alternative to duration) */ expireTime: string; duration?: never; }
    )): ResultProvider<ProtectResult>;

    /**
     * Deletes all versions of a temporal document.
     * @param params - Configuration object with uri and temporalCollection
     * @returns A result provider that resolves to wipe result
     */
    wipe(params: {
      /** The URI of the temporal document to wipe */
      uri: string;
      /** The temporal collection name */
      temporalCollection: string;
    }): ResultProvider<WipeResult>;

    /**
     * Advances the LSQT (Last Stable Query Time) of a temporal collection.
     * @param params - Configuration object or temporal collection name
     * @returns A result provider that resolves to the new LSQT
     */
    advanceLsqt(params: string | {
      /** The temporal collection name */
      temporalCollection: string;
      /** Lag in seconds to subtract from maximum system start time */
      lag?: number;
    }): ResultProvider<AdvanceLsqtResult>;

    /**
     * Creates a writable stream for writing large documents (typically binary) in incremental chunks.
     * The document descriptor should NOT include a content property - content is written via the stream.
     * @param document - Document descriptor without content property
     * @returns A WritableStream with a result() method for tracking completion
     */
    createWriteStream(document: {
      /** The URI for the document to write to the database */
      uri: string;
      /** Collections to which the document should belong */
      collections?: string[];
      /** Permissions controlling document access */
      permissions?: Array<{ roleName: string; capabilities: string[] }>;
      /** Additional properties of the document */
      properties?: object;
      /** Weight to increase or decrease document rank */
      quality?: number;
      /** Metadata values of the document */
      metadataValues?: object;
      /** Version identifier for optimistic locking */
      versionId?: number;
      /** Transaction id or Transaction object */
      txid?: string | object;
      /** Transform extension name or [name, params] array */
      transform?: string | [string, object];
      /** Content type of the document */
      contentType?: string;
    }): NodeJS.WritableStream & ResultProvider<WriteResult>;

    /**
     * Applies changes to a document using patch operations.
     * @param params - Configuration object with uri and operations
     * @returns A result provider that resolves to patch result
     */
    patch(params: {
      /** The URI of the document to patch */
      uri: string;
      /** Patch operations (from patchBuilder) or raw patch string/Buffer */
      operations: any[] | string | Buffer;
      /** Categories of information to modify (typically 'content') */
      categories?: string | string[];
      /** Temporal collection name (for temporal documents) */
      temporalCollection?: string;
      /** Temporal document URI */
      temporalDocument?: string;
      /** Source document URI */
      sourceDocument?: string;
      /** Transaction id or Transaction object */
      txid?: string | object;
      /** Version identifier for optimistic locking */
      versionId?: string;
      /** Format: 'json' or 'xml' */
      format?: string;
    }): ResultProvider<PatchResult>;

    /**
     * Applies changes to a document using patch operations.
     * @param uri - The URI of the document to patch
     * @param operations - One or more patch operations from patchBuilder
     * @returns A result provider that resolves to patch result
     */
    patch(uri: string, ...operations: any[]): ResultProvider<PatchResult>;
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
     * Creates one or more JSON documents for a collection.
     * The server assigns URI identifiers to the documents.
     * This is a simplified convenience method - use documents.write() for more control.
     * @since 1.0
     * @param collection - The collection name for the documents
     * @param content - The JSON content object(s) for the documents
     * @returns A result provider that resolves to an array of assigned URIs
     */
    createCollection(collection: string, ...content: any[]): ResultProvider<string[]>;

    /**
     * Probes whether a document exists.
     * This is a simplified convenience method - use documents.probe() for more information.
     * @since 1.0
     * @param uri - The URI of the document to check
     * @returns A result provider that resolves to a boolean
     */
    probe(uri: string): ResultProvider<boolean>;

    /**
     * Queries documents in a collection.
     * This is a simplified convenience method - use documents.query() for more control.
     * @since 1.0
     * @param collection - The collection name
     * @param query - Optional query built by queryBuilder
     * @returns A result provider that resolves to an array of document content
     */
    queryCollection(collection: string, query?: any): ResultProvider<DocumentContent[]>;

    /**
     * Reads one or more documents, returning just the content.
     * This is a simplified convenience method - use documents.read() for metadata too.
     * @since 1.0
     * @param uris - One or more document URIs
     * @returns A result provider that resolves to an array of document content
     */
    read(...uris: string[]): ResultProvider<DocumentContent[]>;

    /**
     * Removes one or more documents.
     * This is a simplified convenience method - use documents.remove() for more control.
     * @since 1.0
     * @param uris - One or more document URIs to remove
     * @returns A result provider that resolves to an array of removed URIs
     */
    remove(...uris: string[]): ResultProvider<string[]>;

    /**
     * Removes all documents in a collection.
     * This is a simplified convenience method - use documents.removeAll() for more options.
     * @since 1.0
     * @param collection - The collection whose documents should be deleted
     * @returns A result provider that resolves to the collection name
     */
    removeCollection(collection: string): ResultProvider<string>;

    /**
     * Writes documents to a collection using a URI-to-content mapping.
     * This is a simplified convenience method - use documents.write() for more control.
     * @since 1.0
     * @param collection - The collection name for the documents
     * @param documents - An object mapping URIs to document content
     * @returns A result provider that resolves to an array of written URIs
     */
    writeCollection(collection: string, documents: Record<string, DocumentContent>): ResultProvider<string[]>;

    /**
     * Creates a timestamp object for point-in-time operations.
     * @since 2.1.1
     * @param value - Optional timestamp value as a string
     * @returns A Timestamp object
     */
    createTimestamp(value?: string): Timestamp;

    /**
     * Evaluates JavaScript code on the server.
     * The user must have permission to evaluate code and execute the actions performed.
     * @since 1.0
     * @param source - The JavaScript source code to evaluate
     * @param variables - Optional object with variable name-value pairs
     * @param txid - Optional transaction ID or Transaction object
     * @returns A result provider that resolves to an array of EvalResult objects
     */
    eval(source: string, variables?: Record<string, any>, txid?: string | object): ResultProvider<EvalResult[]>;

    /**
     * Evaluates XQuery code on the server.
     * The user must have permission to evaluate code and execute the actions performed.
     * @since 1.0
     * @param source - The XQuery source code to evaluate
     * @param variables - Optional object with variable name-value pairs (keys may use Clark notation)
     * @param txid - Optional transaction ID or Transaction object
     * @returns A result provider that resolves to an array of EvalResult objects
     */
    xqueryEval(source: string, variables?: Record<string, any>, txid?: string | object): ResultProvider<EvalResult[]>;

    /**
     * Invokes a JavaScript or XQuery module on the server.
     * The module must have been installed previously (typically with config.extlibs.write()).
     * @since 1.0
     * @param path - The path of the module in the modules database
     * @param variables - Optional object with variable name-value pairs
     * @param txid - Optional transaction ID or Transaction object
     * @returns A result provider that resolves to an array of EvalResult objects
     */
    invoke(path: string, variables?: Record<string, any>, txid?: string | object): ResultProvider<EvalResult[]>;

    /**
     * Configures logging for database interactions with a logger object.
     * @since 1.0
     * @param logger - A logger object with debug(), info(), warn(), and error() methods (e.g., Bunyan or Winston)
     * @param isErrorFirst - Whether to log errors as the first parameter (true for Bunyan, false for Winston). Defaults to false.
     */
    setLogger(logger: any, isErrorFirst?: boolean): void;
    /**
     * Sets the logging level for an existing ConsoleLogger.
     * @since 1.0
     * @param level - The logging level to set
     */
    setLogger(level: 'debug' | 'info' | 'warn' | 'error' | 'silent'): void;

    /**
     * Updates the SAML authentication token for subsequent requests.
     * Only supported for clients created with authType: 'saml'.
     * @since 2.2.0
     * @param token - The new SAML authentication token
     * @throws Error if the client is not using SAML authentication
     */
    setAuthToken(token: string): void;

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
