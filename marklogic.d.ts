// Type definitions for marklogic
// Definitions by: GitHub Copilot (Enhanced)
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
  // Configuration interfaces
  /**
   * Configuration object for creating a database client.
   * Used by the {@link createDatabaseClient} function to establish connection parameters.
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
    /** The name of the database to access, defaulting to the database for the AppServer on the port */
    database?: string;
    /** The authentication type (defaults to 'digest') */
    authType?: 'basic' | 'digest' | 'application-level' | 'certificate' | 'kerberos' | 'saml' | 'cloud';
    /** Whether the REST server uses SSL (defaults to false). When true, connection parameters can include supplemental HTTPS options */
    ssl?: boolean;
    /** The trusted certificate(s), if required for SSL */
    ca?: string | string[] | Buffer | Buffer[];
    /** The public x509 certificate to use for SSL */
    cert?: string | Buffer;
    /** The private key to use for SSL */
    key?: string | Buffer;
    /** The public x509 certificate and private key as a single PKCS12 file to use for SSL */
    pfx?: Buffer;
    /** The passphrase for the PKCS12 file */
    passphrase?: string;
    /** Connection pooling agent (defaults to a connection pooling agent) */
    agent?: any;
    /** The SAML token to use for authentication with the REST server */
    token?: string;
    /** Whether to reject unauthorized SSL certificates */
    rejectUnauthorized?: boolean;
    /** API version to use */
    apiVersion?: string;
  }

  // Document interfaces
  /**
   * Provides a description of a document to write to the server, after reading
   * from the server, or for another document operation. The descriptor may have
   * more or fewer properties depending on the operation.
   */
  export interface DocumentDescriptor {
    /** The identifier for the document in the database */
    uri: string;
    /** Categories of information to read or write for documents (content|collections|metadataValues|permissions|properties|quality|metadata|rawContent|none) */
    category?: string[] | string;
    /** The collections to which the document belongs */
    collections?: string[] | string;
    /** The permissions controlling which users can read or write the document */
    permissions?: Permission[];
    /** Additional properties of the document */
    properties?: { [key: string]: any };
    /** A weight to increase or decrease the rank of the document */
    quality?: number;
    /** Metadata values of the document */
    metadata?: { [key: string]: any };
    /** The collection URI for a temporal document; use only when writing a document to a temporal collection */
    temporalCollection?: string;
    /** An identifier for the currently stored version of the document (when enforcing optimistic locking) */
    versionId?: string;
    /** The content of the document; when writing a ReadableStream for the content, first pause the stream */
    content?: MarkLogicTypes.DocumentContent;
    /** The format of the document content */
    format?: MarkLogicTypes.DocumentFormat;
    /** The MIME content type of the document */
    contentType?: string;
  }

  export interface Permission {
    roleName: string;
    capabilities: string[];
  }

  /**
   * Represents a document result returned from document read operations.
   * An envelope object that contains the document URI, metadata, and content.
   */
  export interface DocumentResult {
    /** The identifier for the document in the database */
    uri: string;
    /** The category of information retrieved for the document (content|collections|metadataValues|permissions|properties|quality|metadata|rawContent|none) */
    category: string;
    /** The format of the document content (json|xml|text|binary) */
    format: string;
    /** The actual content of the document */
    content: any;
    /** The collections to which the document belongs */
    collections?: string[];
    /** The permissions controlling which users can read or write the document */
    permissions?: Permission[];
    /** Additional properties of the document */
    properties?: any;
    /** A weight that affects the rank of the document in search results */
    quality?: number;
    /** Metadata values associated with the document */
    metadata?: any;
    /** The temporal collection URI if this is a temporal document */
    temporalCollection?: string;
    /** The version identifier for the document (used in optimistic locking) */
    versionId?: string;
  }

  export interface WriteResult {
    uri: string;
    category: string;
    mime: string;
  }

  // Query interfaces
  /**
   * A helper for building the definition of a document query.
   * The helper is created by the marklogic.queryBuilder function.
   * Provides a fluent interface for constructing complex document queries.
   */
  export interface QueryBuilder {
    /** 
     * Sets the where clause of a built query with one or more composable queries, 
     * a parsed query, or a query by example. Multiple queries are implicitly AND'd together.
     * @param query - One or more composable queries, parsed queries, or query by example
     */
    where(query: any): QueryBuilder;
    
    /** 
     * Sets the orderBy clause of a built query to sort the result set by one or more criteria.
     * @param sortKeys - JSON property, XML element/attribute, field, path with range index, or relevance score
     */
    orderBy(sortKeys: string | string[]): QueryBuilder;
    
    /** 
     * Sets the slice clause to select a slice (page) of documents from the result set.
     * By default uses array slice mode (zero-based positions).
     * @param start - Zero-based position of first document in array slice mode; one-based in legacy mode
     * @param length - Zero-based position after last document in array slice mode; number of documents in legacy mode
     */
    slice(start: number, length?: number): QueryBuilder;
    
    /** 
     * Sets query options to configure the query behavior, including categories of information
     * to retrieve, debugging options, metrics, and performance settings.
     * @param options - Configuration object with categories, debug, metrics, queryPlan, etc.
     */
    withOptions(options: any): QueryBuilder;
    
    /** 
     * Sets the calculate clause to specify facets for value frequency or other aggregate 
     * calculations over JSON properties, XML elements/attributes, fields, or paths with range indexes.
     * @param aggregates - Facets to calculate over documents in the result set
     */
    calculate(aggregates: any): QueryBuilder;
    
    /** 
     * Creates a facet definition for use with the calculate function, specifying an index
     * for value frequency calculation with optional bucketing and custom options.
     * @param facetDef - Facet definition specifying the index and calculation parameters
     */
    facet(facetDef: any): QueryBuilder;
    
    /** 
     * Applies a mapping transformation to query results (implementation-specific).
     * @param mapper - Transformation function or specification
     */
    map(mapper: any): QueryBuilder;
    
    /** 
     * Applies a reduction operation to query results (implementation-specific).
     * @param reducer - Reduction function or specification
     * @param seed - Optional initial value for the reduction
     */
    reduce(reducer: any, seed?: any): QueryBuilder;
    
    /** 
     * Executes the built query and returns a promise that resolves with the query results.
     * @param onFulfilled - Success callback receiving the query results
     * @param onRejected - Error callback receiving any error that occurred
     */
    result(onFulfilled?: (results: any) => void, onRejected?: (error: any) => void): Promise<any>;
  }

  /**
   * A helper for building the definition of a values query, which projects
   * tuples (aka rows) of values out of documents. The helper is created by
   * the marklogic.valuesBuilder function. Provides a fluent interface for
   * constructing values queries from range or geospatial indexes.
   */
  export interface ValuesBuilder {
    /** 
     * Sets the where clause of a values query using structured query functions
     * to filter documents from which values are projected.
     * @param query - One or more composable queries to filter the documents
     */
    where(query: any): ValuesBuilder;
    
    /** 
     * Sets the slice clause to select a slice (page) of tuples from the result set.
     * By default uses array slice mode (zero-based positions).
     * @param start - Zero-based position of first tuple in array slice mode; one-based in legacy mode
     * @param length - Zero-based position after last tuple in array slice mode; number of tuples in legacy mode
     */
    slice(start: number, length?: number): ValuesBuilder;
    
    /** 
     * Sets query options to configure the values query behavior, including forest names
     * and values-specific options that modify the default query behavior.
     * @param options - Configuration object with forestNames, values options, etc.
     */
    withOptions(options: any): ValuesBuilder;
    
    /** 
     * Executes the built values query and returns a promise that resolves with the tuples/rows results.
     * @param onFulfilled - Success callback receiving the query results
     * @param onRejected - Error callback receiving any error that occurred
     */
    result(onFulfilled?: (results: any) => void, onRejected?: (error: any) => void): Promise<any>;
  }

  // Transaction interfaces
  export interface Transaction {
    transactionId: string;
    timeLimit?: number;
    commit(onFulfilled?: () => void, onRejected?: (error: any) => void): Promise<void>;
    rollback(onFulfilled?: () => void, onRejected?: (error: any) => void): Promise<void>;
  }

  // Resource interfaces
  export interface Resource {
    name: string;
    source: string;
    sourceFormat?: 'javascript' | 'xquery';
    params?: { [key: string]: any };
  }

  // Patch Builder Types
  
  /**
   * Cardinality specification for patch operations
   * - '?' = zero-or-one fragment
   * - '.' = exactly one fragment
   * - '*' = any number of fragments (default)
   * - '+' = one-or-more fragments
   */
  export type PatchCardinality = '?' | '.' | '*' | '+';
  
  /**
   * Position for insert operations
   * - 'before' = insert before the context node
   * - 'after' = insert after the context node
   * - 'last-child' = insert as last child of context node
   */
  export type PatchPosition = 'before' | 'after' | 'last-child';
  
  /**
   * Path language for patch operations
   */
  export type PathLanguage = 'xpath' | 'jsonpath';

  /**
   * An operation as part of a document patch request.
   * Patch operations allow you to modify documents in place without retrieving
   * and rewriting the entire document. Supports various operation types for
   * deleting, inserting, replacing content, and modifying document metadata.
   */
  export type PatchOperation = 
    | { delete: DeleteOperation }
    | { insert: InsertOperation }
    | { replace: ReplaceOperation }
    | { 'replace-insert': ReplaceInsertOperation }
    | { 'replace-library': LibraryDefinition }
    | { pathlang: PathLanguage }
    | CollectionOperation
    | PermissionOperation
    | PropertyOperation
    | QualityOperation
    | MetadataValueOperation;

  /**
   * Operation to remove a JSON property or XML element or attribute.
   * The delete operation removes fragments matched by the select path.
   * Use cardinality to control how many fragments must match the path.
   */
  export interface DeleteOperation {
    /** The path to select the fragment to remove */
    select: string;
    /** 
     * Cardinality specification (?|.|*|+) controlling whether the select path 
     * must match zero-or-one (?), exactly one (.), any number (*), or 
     * one-or-more (+) fragments. Default is any number (*).
     */
    cardinality?: PatchCardinality;
  }

  /**
   * Operation to insert content into a document.
   * The insert operation adds new content at a specified position relative
   * to a context container. Content can be inserted before, after, or as
   * the last child of the context element.
   */
  export interface InsertOperation {
    /** The path to the container of the inserted content */
    context: string;
    /** 
     * Position specification (before|after|last-child) controlling where 
     * the content will be inserted relative to the context 
     */
    position: PatchPosition;
    /** The object or value to be inserted */
    content: any;
    /** 
     * Cardinality specification (?|.|*|+) controlling whether the context path 
     * must match zero-or-one (?), exactly one (.), any number (*), or 
     * one-or-more (+) fragments. Default is any number (*).
     */
    cardinality?: PatchCardinality;
  }

  /**
   * Operation to replace a JSON property or XML element or attribute.
   * The replace operation substitutes new content for fragments matched by
   * the select path. Can optionally apply transformation functions to existing
   * content to produce the replacement.
   */
  export interface ReplaceOperation {
    /** The path to select the fragment to replace */
    select: string;
    /** 
     * The object or value replacing the selected fragment, or an ApplyDefinition 
     * specifying a function to apply to the selected fragment to produce the replacement 
     */
    content: any;
    /** 
     * Cardinality specification (?|.|*|+) controlling whether the select path 
     * must match zero-or-one (?), exactly one (.), any number (*), or 
     * one-or-more (+) fragments. Default is any number (*).
     */
    cardinality?: PatchCardinality;
    /** Function name to apply to existing content to produce replacement content */
    apply?: string;
  }

  /**
   * Operation to replace a fragment if it exists or insert new content if it doesn't.
   * This operation attempts to replace content at the select path, but if no fragment
   * matches, it inserts the content at the specified context and position instead.
   * Useful for upsert-style operations where you want to update existing data or
   * create it if it doesn't exist.
   */
  export interface ReplaceInsertOperation {
    /** The path to select the fragment to replace */
    select: string;
    /** The path to the container for inserting content when select path doesn't match */
    context: string;
    /** 
     * Position specification (before|after|last-child) controlling where 
     * content is inserted relative to context when select path doesn't match
     */
    position: PatchPosition;
    /** 
     * The object or value for replacement or insertion, or an ApplyDefinition 
     * specifying a function to generate the replacement/inserted content 
     */
    content: any;
    /** 
     * Cardinality specification (?|.|*|+) controlling whether the select or context 
     * path must match zero-or-one (?), exactly one (.), any number (*), or 
     * one-or-more (+) fragments. Default is any number (*).
     */
    cardinality?: PatchCardinality;
    /** Function name to apply to existing content to produce replacement content */
    apply?: string;
  }

  /**
   * Library definition for patch transformation functions.
   * Specifies a library module that supplies functions to apply to existing content
   * to produce replacement content in replace or replaceInsert operations.
   * Libraries must be installed as /ext/marklogic/patch/apply/MODULE_NAME.xqy or .sjs
   */
  export interface LibraryDefinition {
    /** 
     * Namespace for XQuery modules (http://marklogic.com/patch/apply/MODULE_NAME).
     * Optional for JavaScript modules (.sjs)
     */
    ns?: string;
    /** Path to the library module (/ext/marklogic/patch/apply/MODULE_NAME.xqy or .sjs) */
    at: string;
  }

  /**
   * Apply function definition for transforming values during patch operations
   */
  export interface ApplyDefinition {
    apply: string;
    content?: Array<{ $value: any; $datatype?: string }>;
  }

  /**
   * Operation to modify the collections assigned to a document.
   * Collections are used to group related documents and can affect
   * query scope, security, and indexing behavior. Collections are
   * part of the document's metadata.
   */
  export interface CollectionOperation {
    collection?: {
      /** Collection name(s) to add to the document's metadata */
      add?: string | string[];
      /** Collection name(s) to remove from the document's metadata */
      remove?: string | string[];
    };
  }

  /**
   * Operation to modify the permissions assigned to a document.
   * Permissions control which roles can perform specific capabilities
   * (insert, update, read, execute) on the document. Permissions are
   * part of the document's metadata and are essential for security.
   */
  export interface PermissionOperation {
    permission?: {
      /** 
       * Permission to add to the document, specifying role name and capabilities.
       * Capabilities can include: insert, update, read, execute
       */
      add?: Permission;
      /** 
       * Permission to replace for an existing role, modifying the capabilities.
       * Replaces all capabilities for the specified role
       */
      replace?: Permission;
      /** 
       * Role to remove from the document's permissions entirely.
       * Removes all capabilities for the specified role
       */
      remove?: { roleName: string; capabilities?: string | string[] };
    };
  }

  /**
   * Operation to modify custom metadata properties of a document.
   * Properties are key-value pairs stored in the document's metadata
   * that can be used for custom application logic, categorization,
   * or additional document information beyond collections and permissions.
   */
  export interface PropertyOperation {
    property?: {
      /** 
       * Properties to add to the document's metadata as key-value pairs.
       * Each key becomes a property name with the corresponding value
       */
      add?: { [key: string]: any };
      /** 
       * Properties to replace in the document's metadata.
       * Replaces the value of existing properties with the specified names
       */
      replace?: { [key: string]: any };
      /** 
       * Property name to remove from the document's metadata.
       * Removes the entire property key-value pair
       */
      remove?: string;
    };
  }

  /**
   * Operation to modify the search quality of a document.
   * Search quality is a numeric value that affects the document's relevance
   * ranking in search results. Higher quality values make documents appear
   * more prominently in search rankings. Quality is part of the document's metadata.
   */
  export interface QualityOperation {
    /** 
     * The numeric value of the search quality to set for the document.
     * Higher values increase the document's ranking in search results
     */
    quality?: number;
  }

  /**
   * Operation to modify custom metadata values of a document.
   * Metadata values are string-based key-value pairs stored in the document's
   * metadata that provide additional information beyond properties, collections,
   * and permissions. These values can be used for custom application logic,
   * indexing hints, or specialized document categorization.
   */
  export interface MetadataValueOperation {
    'metadata-value'?: {
      /** 
       * Metadata values to add to the document as string key-value pairs.
       * Each key becomes a metadata value name with the corresponding string value
       */
      add?: { [key: string]: any };
      /** 
       * Metadata values to replace in the document's metadata.
       * Replaces the value of existing metadata values with the specified names
       */
      replace?: { [key: string]: any };
      /** 
       * Metadata value name to remove from the document's metadata.
       * Removes the entire metadata value key-value pair
       */
      remove?: string;
    };
  }

  /**
   * Patch builder factory for creating document patch operations
   */
  export interface PatchBuilderFactory {
    // Path language specification
    /**
     * Specifies whether the language used in context and select paths
     * for the document patch is XPath or JSONPath.
     * @param language - 'xpath' (default, works for JSON and XML) or 'jsonpath' (JSON only)
     * @returns A path language specification operation
     */
    pathLanguage(language: PathLanguage): PatchOperation;
    
    // Library management
    /**
     * Specifies a library supplying functions to apply to existing content.
     * Library must be installed as /ext/marklogic/patch/apply/MODULE_NAME.xqy or .sjs
     * @param moduleName - the name of the module with the functions (must end in .xqy or .sjs)
     * @returns A library specification operation
     */
    library(moduleName: string): PatchOperation;
    
    // Basic operations
    /**
     * Builds an operation to insert content
     * @param context - the path to the container of the inserted content
     * @param position - where to insert relative to context ('before' | 'after' | 'last-child')
     * @param content - the content to insert
     * @param cardinality - optional cardinality constraint
     * @returns An insert operation
     */
    insert(context: string, position: PatchPosition, content: any, cardinality?: PatchCardinality): PatchOperation;
    
    /**
     * Builds an operation to remove a JSON property or XML element or attribute
     * @param select - the path to select the fragment to remove
     * @param cardinality - optional cardinality constraint
     * @returns A delete operation
     */
    remove(select: string, cardinality?: PatchCardinality): PatchOperation;
    
    /**
     * Builds an operation to replace a JSON property or XML element or attribute
     * @param select - the path to select the fragment to replace
     * @param content - the replacement content or an ApplyDefinition
     * @param cardinality - optional cardinality constraint
     * @returns A replace operation
     */
    replace(select: string, content: any, cardinality?: PatchCardinality): PatchOperation;
    replace(select: string, applyDef: ApplyDefinition, cardinality?: PatchCardinality): PatchOperation;
    
    /**
     * Builds an operation to replace a fragment if it exists, or insert if it doesn't
     * @param select - the path to select the fragment to replace
     * @param context - the path to the container for inserting when select doesn't match
     * @param position - where to insert relative to context
     * @param content - the replacement/insertion content or an ApplyDefinition
     * @param cardinality - optional cardinality constraint
     * @returns A replace-insert operation
     */
    replaceInsert(select: string, context: string, position: PatchPosition, content: any, cardinality?: PatchCardinality): PatchOperation;
    replaceInsert(select: string, context: string, position: PatchPosition, applyDef: ApplyDefinition, cardinality?: PatchCardinality): PatchOperation;
    
    // Apply functions for value transformation
    /**
     * Specifies a function to apply to produce replacement content
     * @param functionName - the name of the function to apply
     * @param args - arguments to pass to the function
     * @returns An apply definition
     */
    apply(functionName: string, ...args: any[]): ApplyDefinition;
    
    /**
     * Adds a number to the existing value
     * @param number - the number to add
     * @returns An apply definition that adds the number
     */
    add(number: number): ApplyDefinition;
    
    /**
     * Subtracts a number from the existing value
     * @param number - the number to subtract
     * @returns An apply definition that subtracts the number
     */
    subtract(number: number): ApplyDefinition;
    
    /**
     * Multiplies the existing value by a number
     * @param multiplier - the number to multiply by
     * @returns An apply definition that multiplies
     */
    multiplyBy(multiplier: number): ApplyDefinition;
    
    /**
     * Divides the existing value by a number
     * @param divisor - the number to divide by
     * @returns An apply definition that divides
     */
    divideBy(divisor: number): ApplyDefinition;
    
    /**
     * Prepends a value to the existing value
     * @param prepended - the string to prepend
     * @returns An apply definition that prepends
     */
    concatBefore(prepended: string): ApplyDefinition;
    
    /**
     * Appends a value to the existing value
     * @param appended - the string to append
     * @returns An apply definition that appends
     */
    concatAfter(appended: string): ApplyDefinition;
    
    /**
     * Prepends and appends values to the existing value
     * @param prepended - the string to prepend
     * @param appended - the string to append
     * @returns An apply definition that prepends and appends
     */
    concatBetween(prepended: string, appended: string): ApplyDefinition;
    
    /**
     * Trims a leading substring from the existing value
     * @param start - the leading string to trim
     * @returns An apply definition that trims the start
     */
    substringAfter(start: string): ApplyDefinition;
    
    /**
     * Trims a trailing substring from the existing value
     * @param end - the trailing string to trim
     * @returns An apply definition that trims the end
     */
    substringBefore(end: string): ApplyDefinition;
    
    /**
     * Applies a regular expression to transform the existing value
     * @param match - the regex pattern extracting parts of the existing value
     * @param replace - the expression to assemble extracted parts into replacement
     * @param flags - optional regex flags
     * @returns An apply definition using regex
     */
    replaceRegex(match: string, replace: string, flags?: string): ApplyDefinition;
    
    /**
     * Specifies an atomic datatype for a value (from query-builder)
     * @param type - the datatype (e.g., 'xs:string', 'xs:integer', 'xs:datetime')
     * @returns A datatype specification
     */
    datatype(type: string): any;
    
    // Nested namespaces for metadata operations
    /**
     * Operations on document collections
     */
    collections: {
      /**
       * Adds the document to collections
       * @param collectionName - collection URI(s) to add
       * @returns A collection add operation
       */
      add(collectionName: string | string[]): PatchOperation;
      
      /**
       * Removes the document from collections
       * @param collectionName - collection URI(s) to remove
       * @returns A collection remove operation
       */
      remove(collectionName: string | string[]): PatchOperation;
    };
    
    /**
     * Operations on document permissions
     */
    permissions: {
      /**
       * Adds permissions to the document
       * @param permission - the permission to add
       * @returns A permission add operation
       */
      add(permission: Permission): PatchOperation;
      
      /**
       * Replaces permissions on the document
       * @param permission - the permission to replace with
       * @returns A permission replace operation
       */
      replace(permission: Permission): PatchOperation;
      
      /**
       * Removes permissions from the document
       * @param roleName - the role name to remove permissions for
       * @param capabilities - optional specific capabilities to remove
       * @returns A permission remove operation
       */
      remove(roleName: string, capabilities?: string | string[]): PatchOperation;
    };
    
    /**
     * Operations on document metadata properties
     */
    properties: {
      /**
       * Adds a property to document metadata
       * @param propertyName - the property name
       * @param propertyValue - the property value
       * @returns A property add operation
       */
      add(propertyName: string, propertyValue: any): PatchOperation;
      
      /**
       * Replaces a property in document metadata
       * @param propertyName - the property name
       * @param propertyValue - the new property value
       * @returns A property replace operation
       */
      replace(propertyName: string, propertyValue: any): PatchOperation;
      
      /**
       * Removes a property from document metadata
       * @param propertyName - the property name to remove
       * @returns A property remove operation
       */
      remove(propertyName: string): PatchOperation;
    };
    
    /**
     * Operations on document ranking quality
     */
    quality: {
      /**
       * Sets the quality of the document (affects search ranking)
       * @param qualityValue - the quality value (typically 0-10)
       * @returns A quality set operation
       */
      set(qualityValue: number): PatchOperation;
    };
    
    /**
     * Operations on document metadata values
     */
    metadataValues: {
      /**
       * Adds a metadata value
       * @param name - the metadata value name
       * @param value - the metadata value
       * @returns A metadata value add operation
       */
      add(name: string, value: any): PatchOperation;
      
      /**
       * Replaces a metadata value
       * @param name - the metadata value name
       * @param value - the new metadata value
       * @returns A metadata value replace operation
       */
      replace(name: string, value: any): PatchOperation;
      
      /**
       * Removes a metadata value
       * @param name - the metadata value name to remove
       * @returns A metadata value remove operation
       */
      remove(name: string): PatchOperation;
    };
  }

  // Main client interfaces
  /**
   * Provides functions to write, read, query, or perform other operations
   * on documents in the database. For operations that modify the database,
   * the client must have been created for a user with the rest-writer role.
   * For operations that read or query the database, the user need only have
   * the rest-reader role.
   */
  export interface Documents {
    /** 
     * Executes a query built by a queryBuilder to match one or more documents.
     * Supports complex structured queries with facets, sorting, and slicing.
     * @param query - A query built by queryBuilder or CombinedQueryDefinition
     * @returns QueryBuilder for additional query operations or direct execution
     */
    query(query: any): QueryBuilder;
    
    /** 
     * Reads one or more documents from the database by URI.
     * Supports various categories of information (content, metadata, permissions, etc.)
     * and can apply transforms during read operations.
     * @param uris - URI string(s) or DocumentDescriptor(s) identifying the documents to read
     * @returns Object with result() and stream() methods for accessing document data
     */
    read(uris: string | string[] | DocumentDescriptor | DocumentDescriptor[]): {
      result(onFulfilled?: (documents: DocumentResult[]) => void, onRejected?: (error: any) => void): Promise<DocumentResult[]>;
      stream(mode?: string): NodeJS.ReadableStream;
    };
    
    /** 
     * Writes one or more documents to the database.
     * Supports various document formats, collections, permissions, and temporal operations.
     * Can apply transforms and specify target forests for write operations.
     * @param documents - DocumentDescriptor(s) containing document data and metadata
     * @returns Object with result() and stream() methods for write operations
     */
    write(documents: DocumentDescriptor | DocumentDescriptor[]): {
      result(onFulfilled?: (response: WriteResult[]) => void, onRejected?: (error: any) => void): Promise<WriteResult[]>;
      stream(mode?: string): NodeJS.WritableStream;
    };
    
    /** 
     * Removes one or more documents from the database by URI.
     * Supports temporal collections with system end time recording for temporal documents.
     * @param uris - URI string(s) or DocumentDescriptor(s) identifying documents to remove
     * @returns Object with result() method for operation completion
     */
    remove(uris: string | string[] | DocumentDescriptor | DocumentDescriptor[]): {
      result(onFulfilled?: (response: any) => void, onRejected?: (error: any) => void): Promise<any>;
    };
    
    /** 
     * Applies changes to a document using patch operations.
     * Supports delete, insert, and replace operations produced by patchBuilder.
     * Includes support for temporal documents and optimistic locking.
     * @param uri - The URI of the document to patch
     * @param operations - Delete, insert, or replace operations from patchBuilder
     * @returns Object with result() method for patch operation completion
     */
    patch(uri: string, operations: PatchOperation[]): {
      result(onFulfilled?: (response: any) => void, onRejected?: (error: any) => void): Promise<any>;
    };
    
    /** 
     * Protects a temporal document from temporal operations for a period of time.
     * Provides various protection levels (noWipe, noDelete, noUpdate) with duration or expiration.
     * @param uri - The URI of the temporal document to protect
     * @param options - Protection configuration including temporalCollection, duration, level, etc.
     * @returns Object with result() method for protection operation completion
     */
    protect(uri: string, options: any): {
      result(onFulfilled?: (response: any) => void, onRejected?: (error: any) => void): Promise<any>;
    };
    
    /** 
     * Probes whether a document exists in the database by checking its URI.
     * Returns boolean existence information without retrieving document content.
     * @param uris - URI string(s) to check for document existence
     * @returns Object with result() method for existence check results
     */
    probe(uris: string | string[]): {
      result(onFulfilled?: (response: any) => void, onRejected?: (error: any) => void): Promise<any>;
    };
  }

  /**
   * Provides functions to read, write, merge, remove, list, or query
   * with SPARQL on triple graphs. Supports operations on RDF triples
   * stored in MarkLogic's semantic database capabilities.
   */
  export interface Graphs {
    /** 
     * Lists the graphs stored on the server.
     * @param collections - The format for the list of graphs (contentType parameter)
     * @returns Object with result() method for getting the list of graphs
     */
    list(collections?: string | string[]): {
      result(onFulfilled?: (graphs: any[]) => void, onRejected?: (error: any) => void): Promise<any[]>;
    };
    
    /** 
     * Reads the triples for a graph from the server in the specified format.
     * Supports formats like application/n-quads, application/n-triples, application/rdf+json,
     * application/rdf+xml, text/n3, text/turtle, or application/vnd.marklogic.triples+xml.
     * @param uri - Graph name(s), which can be omitted for the default graph
     * @param options - Configuration including contentType, category (content|metadata|permissions), txid, timestamp
     * @returns Object with result() and stream() methods for accessing graph triples
     */
    read(uri: string | string[], options?: any): {
      result(onFulfilled?: (graphs: any[]) => void, onRejected?: (error: any) => void): Promise<any[]>;
      stream(mode?: string): NodeJS.ReadableStream;
    };
    
    /** 
     * Creates or replaces the triples for the specified graph.
     * Supports various RDF formats and can include repair options and permissions.
     * @param graphs - Graph data including uri, contentType, repair flag, permissions, data, and txid
     * @returns Object with result() and stream() methods for write operations
     */
    write(graphs: any | any[]): {
      result(onFulfilled?: (response: any) => void, onRejected?: (error: any) => void): Promise<any>;
      stream(mode?: string): NodeJS.WritableStream;
    };
    
    /** 
     * Adds the triples for the specified graph (merges with existing triples).
     * Similar to write but appends rather than replaces existing graph content.
     * @param graphs - Graph data including uri, contentType, repair flag, permissions, data, and txid
     * @returns Object with result() method for merge operations
     */
    merge(graphs: any | any[]): {
      result(onFulfilled?: (response: any) => void, onRejected?: (error: any) => void): Promise<any>;
    };
    
    /** 
     * Removes the specified graph from the server.
     * @param uri - Graph name(s) to remove, which can be omitted for the default graph
     * @returns Object with result() method called when triples are removed
     */
    remove(uri: string | string[]): {
      result(onFulfilled?: (response: any) => void, onRejected?: (error: any) => void): Promise<any>;
    };
    
    /** 
     * Executes a SPARQL query against the triples for the graphs.
     * Supports SELECT, CONSTRUCT, ASK, and DESCRIBE queries with various options.
     * @param query - SPARQL query configuration or QueryBuilder for document qualification
     * @returns QueryBuilder for additional query operations or direct execution
     */
    query(query: any): QueryBuilder;
    sparql(query: string, bindings?: any, options?: any): {
      result(onFulfilled?: (response: any) => void, onRejected?: (error: any) => void): Promise<any>;
    };
  }

  /**
   * Provides functions for performing SQL-like, relational operations
   * on MarkLogic data. Enables you to retrieve document data as rows
   * by executing a plan constructed by a planBuilder.
   */
  export interface Rows {
    /** 
     * Executes a plan built by a planBuilder and returns a promise with the results.
     * Supports various output formats (json|xml|csv) and structures (object|array).
     * @param query - A planBuilder object or a built plan defined as a JSON object
     * @param options - Options controlling plan execution, formatting, bindings, etc. including:
     *   - format: 'json'|'xml'|'csv' (default: 'json')
     *   - structure: 'object'|'array' (default: 'object') 
     *   - columnTypes: 'rows'|'header' (default: 'rows')
     *   - complexValues: 'inline'|'reference' (default: 'inline')
     *   - bindings: values for placeholder variables
     *   - timestamp: for point-in-time operations
     *   - queryType: 'json'|'sparql'|'sql'|'dsl' (default: 'json')
     * @returns Promise resolving to query results or QueryBuilder for additional operations
     */
    query(query: any, options?: any): QueryBuilder;
    
    /** 
     * Executes a plan built by a planBuilder and returns a readable stream.
     * Allows streaming large result sets for better performance and memory usage.
     * @param query - A planBuilder object or a built plan defined as a JSON object
     * @param options - Stream type and execution options including:
     *   - streamType: 'chunked'|'object'|'sequence' (default: 'chunked')
     *   - Same options as query() method for formatting and execution control
     * @returns ReadableStream for processing results as they arrive
     */
    queryAsStream(query: any, options?: any): NodeJS.ReadableStream;
  }

  export interface Values {
    read(index: string, key?: string | string[]): ValuesBuilder;
  }

  export interface Resources {
    read(name: string, category?: string): {
      result(onFulfilled?: (resource: any) => void, onRejected?: (error: any) => void): Promise<any>;
    };
    write(resources: Resource | Resource[]): {
      result(onFulfilled?: (response: any) => void, onRejected?: (error: any) => void): Promise<any>;
    };
    remove(name: string | string[], category?: string): {
      result(onFulfilled?: (response: any) => void, onRejected?: (error: any) => void): Promise<any>;
    };
    invoke(name: string, params?: any): {
      result(onFulfilled?: (response: any) => void, onRejected?: (error: any) => void): Promise<any>;
    };
  }

  export interface Transactions {
    open(options?: any): {
      result(onFulfilled?: (transaction: Transaction) => void, onRejected?: (error: any) => void): Promise<Transaction>;
    };
    read(transactionId: string): {
      result(onFulfilled?: (transaction: Transaction) => void, onRejected?: (error: any) => void): Promise<Transaction>;
    };
  }

  /**
   * Provides access to namespaces that configure the REST server for the client.
   * The client must have been created for a user with the rest-admin role.
   * Enables management of extension libraries, transforms, resource services, and server properties.
   */
  export interface Config {
    /** 
     * Provides functions that maintain the extension libraries on the REST server.
     * Allows reading, writing, removing, and listing extension libraries.
     */
    extlibs: any;
    
    /** 
     * Provides nested configuration namespaces for patch and query operations.
     */
    patch: {
      /** 
       * Provides functions that maintain patch replacement libraries on the REST server.
       * Enables management of custom patch operations for document updates.
       */
      replace: any;
    };
    
    /** 
     * Provides nested configuration namespaces for query-related extensions.
     */
    query: {
      /** 
       * Provides functions that maintain custom query binding or facet extensions on the REST server.
       * Enables customization of query processing and facet calculations.
       */
      custom: any;
      
      /** 
       * Provides functions that maintain query snippet extensions on the REST server.
       * Enables reusable query components and snippets.
       */
      snippet: any;
    };
    
    /** 
     * Provides functions to maintain resource service extensions on the REST server.
     * Enables custom REST endpoint creation and management.
     */
    resources: {
      /** 
       * Reads the source for a resource service installed on the server.
       * @param name - The name of the resource service
       * @returns Object with result() method for accessing the source code
       */
      read(name: string): {
        result(onFulfilled?: (source: any) => void, onRejected?: (error: any) => void): Promise<any>;
      };
      
      /** 
       * Installs or updates a resource service on the server.
       * @param config - Resource service configuration and source code
       * @returns Object with result() method for operation completion
       */
      write(config: any): {
        result(onFulfilled?: (response: any) => void, onRejected?: (error: any) => void): Promise<any>;
      };
    };
    
    /** 
     * Provides functions to modify the properties of the REST server.
     * Enables configuration of server-level settings and behaviors.
     */
    serverprops: {
      /** 
       * Reads the configuration properties for the server.
       * @returns Object with result() method for accessing server properties
       */
      read(): {
        result(onFulfilled?: (props: any) => void, onRejected?: (error: any) => void): Promise<any>;
      };
      
      /** 
       * Updates the configuration properties for the server.
       * @param props - Server properties to update
       * @returns Object with result() method for operation completion
       */
      write(props: any): {
        result(onFulfilled?: (response: any) => void, onRejected?: (error: any) => void): Promise<any>;
      };
    };
    
    /** 
     * Provides functions that maintain transform extensions on the REST server.
     * Enables custom document transformation during read/write operations.
     */
    transforms: any;
  }

  /**
   * A client object configured to write, read, query, and perform other
   * operations on a database as a user. The client object is created by
   * the marklogic.createDatabaseClient function and provides access to
   * all MarkLogic database capabilities through specialized namespaces.
   */
  export interface DatabaseClient {
    /** 
     * Provides functions that write, read, query, or perform other operations
     * on documents in the database. As a convenience, the same functions are
     * provided on the database client.
     */
    documents: Documents;
    
    /** 
     * Provides functions that read, write, merge, remove, list, or query
     * with SPARQL on triple graphs. Enables semantic data operations
     * and RDF triple management.
     */
    graphs: Graphs;
    
    /** 
     * Provides functions for performing relational operations on indexed
     * values and documents in the database. Enables SQL-like queries
     * through plan execution.
     */
    rows: Rows;
    
    /** 
     * Provides functions that submit values queries to project tuples (rows)
     * of values from documents. Enables extraction of structured data
     * from range and geospatial indexes.
     */
    values: Values;
    
    /** 
     * Provides functions that submit get, put, post, or remove requests
     * to resource service extensions. Enables interaction with custom
     * REST service extensions.
     */
    resources: Resources;
    
    /** 
     * Provides functions that open, commit, or rollback multi-statement
     * transactions. Enables ACID transaction support for complex operations.
     */
    transactions: Transactions;
    
    /** 
     * Provides access to namespaces that configure the REST server for the client.
     * The client must have been created for a user with the rest-admin role.
     * Includes extension libraries, patch replacement, and query customizations.
     */
    config: Config;
    
    /** 
     * Releases the client and destroys the connection agent.
     * Call this method to clean up resources when done with the client.
     */
    release(): void;
    
    /** 
     * Probes whether a document exists by checking its URI.
     * Returns a simple boolean result for document existence.
     * @param onFulfilled - Success callback receiving a boolean result
     * @param onRejected - Error callback receiving any error that occurred  
     * @returns Promise resolving to boolean indicating document existence
     */
    probe(onFulfilled?: (response: any) => void, onRejected?: (error: any) => void): Promise<any>;
    
    /** 
     * Creates a multi-statement transaction for grouping operations.
     * Transactions ensure ACID properties across multiple operations.
     * @param options - Transaction configuration including timeLimit and other settings
     * @returns Promise resolving to Transaction object for subsequent operations
     */
    createTransaction(options?: any): Promise<Transaction>;
  }

  /**
   * MarkLogic module interface - this is what gets exported
   */
  export interface MarkLogicModule {
    /**
     * Creates a database client for connecting to MarkLogic
     * @param config - configuration for the database connection
     * @returns A database client instance
     */
    createDatabaseClient(config: DatabaseClientConfig): DatabaseClient;
    
    /**
     * A factory for creating a document query builder
     */
    queryBuilder: {
      where(query: any): QueryBuilder;
      parsedFrom(query: string, bindings?: any): any;
      fromQBE(query: any): any;
      anchor(name: string): any;
      and(...queries: any[]): any;
      or(...queries: any[]): any;
      not(query: any): any;
      andNot(query: any): any;
      boost(matchingQuery: any, boostingQuery: any): any;
      near(...queries: any[]): any;
      collection(...uris: string[]): any;
      directory(uri: string, infinite?: boolean): any;
      document(...uris: string[]): any;
      element(element: any, query?: any): any;
      term(...terms: string[]): any;
      value(element: any, value: any, options?: any): any;
      word(element: any, text: string, options?: any): any;
      range(element: any, operator: string, value: any, options?: any): any;
      datatype(type: string): any;
      geospatial: {
        circle(region: any, point: any, radius: number, options?: any): any;
        box(region: any, south: number, west: number, north: number, east: number, options?: any): any;
        point(region: any, point: any, options?: any): any;
        polygon(region: any, points: any[], options?: any): any;
      };
      calculateFunction: {
        sum(column: string, alias?: string): any;
        avg(column: string, alias?: string): any;
        count(column: string, alias?: string): any;
        min(column: string, alias?: string): any;
        max(column: string, alias?: string): any;
        stddev(column: string, alias?: string): any;
        variance(column: string, alias?: string): any;
      };
      orderByDirection: {
        ascending(column: string): any;
        descending(column: string): any;
      };
    };

    /**
     * A factory for creating a document patch builder
     */
    patchBuilder: PatchBuilderFactory;

    /**
     * A factory for creating a values builder
     */
    valuesBuilder: {
      fromIndexes(index: string | string[]): ValuesBuilder;
      where(query: any): ValuesBuilder;
      slice(start: number, length?: number): ValuesBuilder;
      withOptions(options: any): ValuesBuilder;
      orderBy(keys: string | string[]): ValuesBuilder;
      groupBy(keys: string | string[], aggregates?: any): ValuesBuilder;
    };
    
    /**
     * Configures the slice mode (array or legacy)
     * @param mode - 'array' (zero-based) or 'legacy' (one-based, deprecated)
     */
    setSliceMode(mode: 'array' | 'legacy'): void;
    
    /**
     * Releases the client and destroys the agent
     * @param client - the database client to release
     */
    releaseClient(client: DatabaseClient): void;
  }

  // Support both default and named exports for CommonJS compatibility
  const marklogic: MarkLogicModule;
  export default marklogic;
  
  // For CommonJS-style destructuring: const { createDatabaseClient } = require('marklogic');
  export const createDatabaseClient: MarkLogicModule['createDatabaseClient'];
  export const queryBuilder: MarkLogicModule['queryBuilder'];
  export const patchBuilder: MarkLogicModule['patchBuilder'];
  export const valuesBuilder: MarkLogicModule['valuesBuilder'];
  export const setSliceMode: MarkLogicModule['setSliceMode'];
  export const releaseClient: MarkLogicModule['releaseClient'];

  // Additional type namespace for internal types
  export namespace MarkLogicTypes {
    export type DocumentContent = any;
    export type DocumentFormat = 'json' | 'xml' | 'text' | 'binary';
  }
}
