/*
 * Copyright (c) 2020 MarkLogic Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';
var http                 = require('http');
var https                = require('https');

var mlutil               = require('./mlutil.js');
var mllog                = require('./mllog.js');

var documents            = require('./documents.js');
var Graphs               = require('./graphs.js');
var Rows                 = require('./rows.js');
var Values               = require('./values.js');
var ExtLibs              = require('./extlibs.js');
var RESTServerProperties = require('./rest-server-properties.js');
var Transactions         = require('./transactions.js');
var Transforms           = require('./transforms.js');
var ResourcesConfig      = require('./resources-config.js');
var ResourcesExec        = require('./resources-exec.js');
var serverExec           = require('./server-exec.js');

var queryBuilder         = require('./query-builder.js');
var patchBuilder         = require('./patch-builder.js');
var valuesBuilder        = require('./values-builder.js');
var planBuilder          = require('./plan-builder.js');
var ctsQueryBuilder      = require('./ctsquery-builder');
var Operation            = require('./operation.js');
var requester            = require('./requester.js');

const proxy              = require("./endpoint-proxy.js");
const dns = require('dns');

/**
 * Provides functions to connect to a MarkLogic database and to build
 * requests for the database.
 * @namespace marklogic
 */

/**
 * Provides functions that maintain patch replacement libraries
 * on the REST server. The client must have been created for a user with the
 * rest-admin role.
 * @namespace config.patch.replace
 */
/**
 * Reads a patch replacement library installed on the server.
 * @method config.patch.replace#read
 * @since  1.0
 * @param {string} moduleName - the filename without a path for the patch replacement library
 * @returns {ResultProvider} an object whose result() function takes
 * a success callback that receives the source code for the library
 */
/**
 * Installs a patch replacement library on the server.
 * @method config.patch.replace#write
 * @since  1.0
 * @param {string} moduleName - the filename without a path for the patch replacement library;
 * the filename must end in an extension registered in the server's mime type mapping table
 * for the mime type of the source code format; at present, the extension should be ".xqy"
 * @param {object[]} [permissions] - the permissions controlling which users can read, update, or
 * execute the patch replacement library
 * @param {string} source - the source code for the patch replacement library; at present,
 * the source code must be XQuery
 */
/**
 * Deletes a patch replacement library from the server.
 * @method config.patch.replace#remove
 * @since  1.0
 * @param {string} moduleName - the filename without a path for the patch replacement library
 */
/**
 * Lists the patch replacement libraries installed on the server.
 * @method config.patch.replace#list
 * @since  1.0
 * @returns {ResultProvider} an object whose result() function takes
 * a success callback that receives the list of replacement libraries
 */

/**
 * Provides functions that maintain custom query binding
 * or facet extensions on the REST server. The client must have been created
 * for a user with the rest-admin role.
 * @namespace config.query.custom
 */
/**
 * Reads a custom query library installed on the server.
 * @method config.query.custom#read
 * @since  1.0
 * @param {string} moduleName - the filename without a path for the custom query library
 * @returns {ResultProvider} an object whose result() function takes
 * a success callback that receives the source code for the library
 */
/**
 * Installs a custom query library on the server.
 * @method config.query.custom#write
 * @since  1.0
 * @param {string} moduleName - the filename without a path for the custom query library;
 * the filename must end in an extension registered in the server's mime type mapping table
 * for the mime type of the source code format; at present, the extension should be ".xqy"
 * @param {object[]} [permissions] - the permissions controlling which users can read, update, or
 * execute the custom query library
 * @param {string} source - the source code for the custom query library; at present,
 * the source code must be XQuery
 */
/**
 * Deletes a custom query library from the server.
 * @method config.query.custom#remove
 * @since  1.0
 * @param {string} moduleName - the filename without a path for the custom query library
 */
/**
 * Lists the custom query libraries installed on the server.
 * @method config.query.custom#list
 * @since  1.0
 * @returns {ResultProvider} an object whose result() function takes
 * a success callback that receives the list of replacement libraries
 */

/**
 * Provides functions that maintain query snippet extensions
 * on the REST server. The client must have been created for a user with the
 * rest-admin role.
 * @namespace config.query.snippet
 */
/**
 * Reads a query snippet library installed on the server.
 * @method config.query.snippet#read
 * @since  1.0
 * @param {string} moduleName - the filename without a path for the query snippet library
 * @returns {ResultProvider} an object whose result() function takes
 * a success callback that receives the source code for the library
 */
/**
 * Installs a query snippet library on the server.
 * @method config.query.snippet#write
 * @since  1.0
 * @param {string} moduleName - the filename without a path for the query snippet library;
 * the filename must end in an extension registered in the server's mime type mapping table
 * for the mime type of the source code format; at present, the extension should be ".xqy"
 * @param {object[]} [permissions] - the permissions controlling which users can read, update, or
 * execute the query snippet library
 * @param {string} source - the source code for the query snippet library; at present,
 * the source code must be XQuery
 */
/**
 * Deletes a query snippet library from the server.
 * @method config.query.snippet#remove
 * @since  1.0
 * @param {string} moduleName - the filename without a path for the query snippet library
 */
/**
 * Lists the custom query libraries installed on the server.
 * @method config.query.snippet#list
 * @since  1.0
 * @returns {ResultProvider} an object whose result() function takes
 * a success callback that receives the list of replacement libraries
 */
function ExtlibsWrapper(extlibs, name, dir) {
  if (!(this instanceof ExtlibsWrapper)) {
    return new ExtlibsWrapper(extlibs, name, dir);
  }
  this.extlibs = extlibs;
  this.name    = name;
  this.dir     = dir;
}
ExtlibsWrapper.prototype.list = function listExtlibsWrapper() {
  return this.extlibs.list.call(this.extlibs, this.dir);
};
ExtlibsWrapper.prototype.read = function readExtlibsWrapper() {
  return this.extlibs.read.apply(
      this.extlibs,
      expandExtlibsWrapper.call(this, 'reading', mlutil.asArray.apply(null, arguments))
      );
};
ExtlibsWrapper.prototype.remove = function removeExtlibsWrapper() {
  return this.extlibs.remove.apply(
      this.extlibs,
      expandExtlibsWrapper.call(this, 'removing', mlutil.asArray.apply(null, arguments))
      );
};
ExtlibsWrapper.prototype.write = function writeExtlibsWrapper() {
  var args = expandExtlibsWrapper.call(this, 'writing', mlutil.asArray.apply(null, arguments));
  var module = args[0];
  var ext = mlutil.extension(module);
  if (ext === null) {
    throw new Error(module+' module for '+this.name+' library must have an extension of .mjs, .sjs, or .xqy');
  }
  switch(ext) {
  case 'sjs':
    args[0] = 'application/javascript';
    break;
  case 'mjs':
    args[0] = 'application/vnd.marklogic-js-module';
    break;
  case 'xqy':
    args[0] = 'application/xquery';
    break;
  default:
    throw new Error(module+' module for '+this.name+' library does not have an .mjs, .sjs, or .xqy extension');
  }
  args.unshift(module);
  return this.extlibs.write.apply(this.extlibs, args);
};
function expandExtlibsWrapper(action, args) {
  /*jshint validthis:true */
  var module = (args.length > 0) ? args[0] : null;
  if (typeof module !== 'string' && !(module instanceof String)) {
    throw new Error('no module name for '+action+' '+this.name+' library');
  }
  args[0] = this.dir + module;
  return args;
}

/**
 * A client object configured to write, read, query, and perform other
 * operations on a database as a user. The client object is
 * created by the {@link marklogic.createDatabaseClient} function.
 * @namespace DatabaseClient
 * @borrows serverExec#eval       as DatabaseClient#eval
 * @borrows serverExec#xqueryEval as DatabaseClient#xqueryEval
 * @borrows serverExec#invoke     as DatabaseClient#invoke
 */

/**
 * Creates a database client to make database requests such as writes, reads,
 * and queries. The constructor takes a configuration object with the following
 * named parameters.
 * @function marklogic.createDatabaseClient
 * @since 1.0
 * @param {string} [host=localhost] - the host with the REST server for the database
 * @param {number} [port=8000] - the port with the REST server for the database
 * @param {string} [database] - the name of the database to access, defaulting
 * to the database for the AppServer on the port
 * @param {string} user - the user with permission to access the database
 * @param {string} password - the password for the user with permission to access
 * the database
 * @param {enum} [authType=digest] - the authentication type of digest|basic|certificate|kerberos|saml
 * @param {boolean} [ssl=false] - whether the REST server uses SSL; when true,
 * the connection parameters can include the
 * {@link http://nodejs.org/api/https.html#https_https_request_options_callback|supplemental
 * HTTPS options} specifiable for the node.js tls.connect() function.
 * @param {object} [agent] - defaults to a connection pooling agent
 * @param {string|string[]|Buffer|Buffer[]} [ca] - the trusted certificate(s), if
 * required for SSL
 * @param {string|Buffer} [key] - the private key to use for SSL
 * @param {string|Buffer} [cert] - the public x509 certificate to use for SSL
 * @param {Buffer} [pfx] - the public x509 certificate and private key as a single PKCS12 file
 * to use for SSL
 * @param {string} [passphrase] - the passphrase for the PKCS12 file
 * @param {string} [token] - the SAML token to use for authentication with the REST server
 * @returns {DatabaseClient} a client for accessing the database
 * as the user
 */
function MarkLogicClient(connectionParams) {
  if (!(this instanceof MarkLogicClient)) {
    return new MarkLogicClient(connectionParams);
  }

  if (connectionParams == null) {
    throw new Error('no connection parameters');
  }

  initClient(this, connectionParams);

  /**
   * Provides functions that write, read, query, or perform other operations
   * on documents in the database. As a convenience, the same functions are
   * provided on the database client.
   * @name documents
   * @since 1.0
   * @memberof! DatabaseClient#
   * @type {documents}
   */
  this.documents    = documents.create(this);
  /**
   * Provides functions for performing relational operations
   * on indexed values and documents in the database.
   * @name rows
   * @since 2.1.1
   * @memberof! DatabaseClient#
   * @type {rows}
   */
  this.rows    = new Rows(this);
  /**
   * Provides functions that open, commit, or rollback multi-statement
   * transactions.
   * @name transactions
   * @since 1.0
   * @memberof! DatabaseClient#
   * @type {transactions}
   */
  this.transactions = new Transactions(this);

  /**
   * Provides functions that read, write, merge, remove, list, or query
   * with SPARQL on triple graphs.
   * @name graphs
   * @since 1.0
   * @memberof! DatabaseClient#
   * @type {graphs}
   */
  this.graphs = new Graphs(this);
  /**
   * Provides functions that submit get, put, post, or remove requests
   * to resource service extensions.
   * @name resources
   * @since 1.0
   * @memberof! DatabaseClient#
   * @type {resources}
   */
  this.resources = new ResourcesExec(this);
  /**
   * Provides functions that submit values queries to project
   * tuples (rows) of values from documents.
   * @name values
   * @since 1.0
   * @memberof! DatabaseClient#
   * @type {values}
   */
  this.values    = new Values(this);

  var configExtlibs = new ExtLibs(this);

  /**
   * Provides access to namespaces that configure the REST server for the client.
   * The client must have been created for a user with the rest-admin role.
   * @name config
   * @since 1.0
   * @memberof! DatabaseClient#
   * @property {config.extlibs} extlibs - provides functions that
   * maintain the extension libraries on the REST server
   * @property {config.patch.replace} patch.replace - provides functions that
   * maintain patch replacement libraries on the REST server
   * @property {config.query.custom} query.custom - provides functions that
   * maintain custom query binding or facet extensions on the REST server
   * @property {config.query.snippet} query.snippet - provides functions that
   * maintain query snippet extensions on the REST server
   * @property {config.resources} resources - provides functions that
   * maintain resource service extensions on the REST server
   * @property {config.serverprops} serverprops - provides functions that
   * modify the properties of the REST server
   * @property {config.transforms} transforms - provides functions that
   * maintain transform extensions on the REST server
   */
  this.config = {
      extlibs:     configExtlibs,

      patch: {
          replace: new ExtlibsWrapper(configExtlibs, 'patch replace', '/marklogic/patch/apply/')
      },
      query: {
          custom:  new ExtlibsWrapper(configExtlibs, 'custom query',  '/marklogic/query/custom/'),
          snippet: new ExtlibsWrapper(configExtlibs, 'query snippet', '/marklogic/snippet/custom/')
      },

      resources:   new ResourcesConfig(this),

      serverprops: new RESTServerProperties(this),
      transforms:  new Transforms(this)
  };

  this.logger = null;
}

/** @ignore */
MarkLogicClient.prototype.getConnectionParams = function getConnectionParams() {
  if(this.connectionParams === null) {
    throw new Error('Connection has been closed.');
  }
  return this.connectionParams;
};

/**
 * Tests if a connection is successful.
 * @method DatabaseClient#checkConnection
 * @since 2.1
 * @returns an object with a connected property of true or false. In the false case
 *  it contains httpStatusCode and httpStatusMessage properties identifying the failure.
 */
MarkLogicClient.prototype.checkConnection = function checkConnection() {
  var connectionParams = this.connectionParams;
  var requestOptions = mlutil.copyProperties(connectionParams);
  requestOptions.method = 'HEAD';
  requestOptions.path = mlutil.databaseParam(connectionParams, '/v1/ping', '?');
  var operation = new Operation(
      'test operation', this, requestOptions, 'empty', 'empty'
      );
  operation.statusCodeValidator = function testStatusCodes(statusCode, response){
    if (statusCode >= 300) {
        this.responseStatusMessage = response.statusMessage;
    }
    return null;
   };
  operation.outputTransform = function addOutputTransform() {
    var content = null;
    if(this.responseStatusCode <300) {
       content = {connected: true};
    } else {
       content = {connected: false,
       httpStatusCode:  this.responseStatusCode,
       httpStatusMessage: this.responseStatusMessage
       };
    }
   return content;
  };
  return requester.startRequest(operation);
};

// placate lint
MarkLogicClient.prototype['Eval'.toLowerCase()] = serverExec.serverJavaScriptEval;
MarkLogicClient.prototype.xqueryEval            = serverExec.serverXQueryEval;
MarkLogicClient.prototype.invoke                = serverExec.serverInvoke;

/**
 * Creates one or more JSON documents for a collection; takes a collection name string and
 * the content for one or more JSON documents (or an array of content). The
 * server assigns uri identifiers to the documents created with the content.
 * The {@link documents#write} function is less simple but more complete,
 * accepting a uri identifier and metadata (such as multiple collections)
 * and optionally transforming each document on the server.
 * @method DatabaseClient#createCollection
 * @since 1.0
 * @param {string}  collection - the name of the collection for the documents
 * @param {object|object[]} content - the objects with the content for the
 * documents
 * @returns {ResultProvider} an object whose result() function takes
 * a success callback receiving an array of uri strings for the created documents.
 */
MarkLogicClient.prototype.createCollection = function createCollection() {
  var argLen = arguments.length;
  if (argLen < 2) {
    throw new Error('must specify both a collection and content objects for document create');
  }

  var collection = arguments[0];
  if (typeof collection !== 'string' && !(collection instanceof String)) {
    throw new Error('must specify at least one collection for document create');
  }

  var contentArray = arguments[1];
  var i = 0;
  if (!Array.isArray(contentArray)) {
    i = 1;
    contentArray = arguments;
  }

  var documentList = [];
  for (; i < contentArray.length; i++) {
    documentList.push({
      collections: collection,
      contentType: 'application/json',
      directory:   '/',
      extension:   '.json',
      content:     contentArray[i]
    });
  }

  return documents.writeImpl.call(this.documents, true, documentList);
};
/**
 * Probes whether a document exists; takes a uri string identifying the document.
 * The {@link documents#probe} function is less simple but more complete,
 * returning an object with additional information.
 * @method DatabaseClient#probe
 * @since 1.0
 * @param {string}  uri - the uri for the database document
 * @returns {ResultProvider} an object whose result() function takes
 * a success callback that receives a boolean.
 */
MarkLogicClient.prototype.probe = function probeClient() {
  return documents.probeImpl.call(this.documents, true, mlutil.asArray.apply(null, arguments));
};
/**
 * Executes a query to retrieve the content of documents in a collection,
 * optionally adding a query built by a {@link queryBuilder} to retrieve
 * a subset of the collection documents.
 * The {@link documents#query} function is less simple but more complete,
 * potentially transforming documents on the server and returning
 * an envelope object for each document with the uri and metadata
 * as well as the content.
 * an object for each document with additional information.
 * @method DatabaseClient#queryCollection
 * @since 1.0
 * @param {string}  collection - the name of the document collection
 * @param {object}  [query] - a query built by a {@link queryBuilder}
 * @returns {ResultProvider} an object whose result() function takes
 * a success callback that receives an array with the content of the
 * documents.
 */
MarkLogicClient.prototype.queryCollection = function queryClient(collection, builtQuery) {
  if (typeof collection !== 'string' && !(collection instanceof String)) {
    throw new Error('must specify at least one collection for quick document queries');
  }

  if (builtQuery == null) {
    builtQuery = queryBuilder.builder.where();
  }

  return documents.queryImpl.call(this.documents, collection, true, builtQuery);
};
/**
 * Reads one or more documents; takes one or more uri strings or
 * an array of uri strings. The {@link documents#read} function
 * is less simple but more complete, potentially transforming
 * documents on the server and returning an envelope object for
 * each document with the uri and metadata as well as the content.
 * @method DatabaseClient#read
 * @since 1.0
 * @param {string|string[]}  uris - the uri string or an array of uri strings
 * for the database documents
 * @returns {ResultProvider} an object whose result() function takes
 * a success callback that receives an array with the content of the documents.
 */
MarkLogicClient.prototype.read = function readClient() {
  return documents.readImpl.call(this.documents, true, mlutil.asArray.apply(null, arguments));
};
/**
 * Removes one or more database documents; takes one or more uri strings
 * identifying the document.
 * The {@link documents#remove} function is less simple but more complete.
 * @method DatabaseClient#remove
 * @since 1.0
 * @param {string|string[]}  uris - the uri string or an array of uri strings
 * identifying the database documents
 * @returns {ResultProvider} an object whose result() function takes
 * a success callback that receives an array of the uris identifying
 * the removed documents.
 */
MarkLogicClient.prototype.remove = function removeClient() {
  return documents.removeImpl.call(
      this.documents,
      true,
      mlutil.asArray.apply(null, arguments)
      );
};
/**
 * Removes all documents in a collection; takes the uri string identifying
 * the collection.
 * The {@link documents#removeAll} function is less simple but more complete,
 * supporting deleting a directory or all documents in the database.
 * @method DatabaseClient#removeCollection
 * @since 1.0
 * @param {string}  collection - the collection whose documents should be
 * deleted
 * @returns {ResultProvider} an object with a result() function takes
 * a success callback that receives the uri string identifying the removed
 * collection.
 */
MarkLogicClient.prototype.removeCollection = function removeCollectionClient(collection) {
  if (typeof collection !== 'string' && !(collection instanceof String)) {
    throw new Error('must specify at least one collection for quick document remove');
  }

  return documents.removeCollectionImpl.call(this.documents, true, {collection: collection});
};
/**
 * Inserts or updates one or more documents for a collection; takes a collection name
 * string and an object that maps document uris to document content.
 * The {@link documents#write} function is less simple but more complete,
 * accepting a uri identifier and metadata (such as multiple collections)
 * and optionally transforming each document on the server.
 * @method DatabaseClient#writeCollection
 * @since 1.0
 * @param {string}  collection - the name of the collection for the documents
 * @param {object} documents - an object in which every key is the uri string
 * for a document and every value is the content for the document
 * @returns {ResultProvider} an object whose result() function takes
 * a success callback receiving an array of uri strings for the written documents.
 */
MarkLogicClient.prototype.writeCollection = function writeClient() {
  var argLen = arguments.length;
  if (argLen < 2) {
    throw new Error('must specify both a collection and mapping object for quick document write');
  }

  var collection = arguments[0];
  if (typeof collection !== 'string' && !(collection instanceof String)) {
    throw new Error('must specify at least one collection for quick document write');
  }

  var map  = arguments[1];
  var uris = Object.keys(map);
  if (uris.length === 0) {
    throw new Error('must map at least one document uri to content for quick document write');
  }

  var documentList = [];
  var uri = null;
  var i = 0;
  for (; i < uris.length; i++) {
    uri = uris[i];
    documentList.push({
      uri:         uri,
      collections: collection,
      content:     map[uri]
    });
  }

  return documents.writeImpl.call(this.documents, true, documentList);
};

MarkLogicClient.prototype.release = function releaseMarkLogicClient() {
  releaseClient(this);
};

/**
 * Supplies a logger to use for database interactions or, instead, takes
 * a logging level from the debug|info|warn|error|silent enumeration (where silent
 * is the initial setting) for the default console logger.
 * @method DatabaseClient#setLogger
 * @since 1.0
 * @param {object}  logger - an object providing debug(), info(), warn(), and error()
 * logging methods such as a logger provided by the
 * {@link https://github.com/trentm/node-bunyan|Bunyan} or
 * {@link https://github.com/flatiron/winston|Winston} logging libraries.
 * @param {boolean}  [isErrorFirst] - whether an error should be logged as the first parameter;
 * must be provided as true for Bunyan (but not for Winston); defaults to false
 */
MarkLogicClient.prototype.setLogger = function setClientLogger() {
  var argLen = arguments.length;
  if (argLen < 1) {
    throw new Error('must provide a logger as the first argument');
  }

  var arg = arguments[0];
  if (typeof arg === 'string' || arg instanceof String) {
    var logger = (argLen === 1) ? this.getLogger() : null;
    if (logger instanceof mllog.ConsoleLogger) {
      logger.setLevel(arg);
    } else {
      throw new Error('first argument is not a logger');
    }
  } else {
    this.logger = new mllog.DelegatingLogger(arg);
    if (argLen > 1 && (typeof arguments[1] === 'boolean')) {
      this.logger.isErrorFirst = arguments[1];
    }
  }
};

/** @ignore */
MarkLogicClient.prototype.getLogger = function getClientLogger() {
  var logger = this.logger;

  if (logger == null) {
    logger = new mllog.ConsoleLogger();
    this.logger = logger;
  }

  return logger;
};

/**
 * An object representing a timestamp on the server.
 * @typedef {object} DatabaseClient.Timestamp
 * @since 2.1.1
 */

/**
 * Creates a timestamp object.
 * @method DatabaseClient#createTimestamp
 * @since 2.1.1
 * @param {string}  [value] - a timestamp value as a string.
 * @returns {Timestamp} - a Timestamp object.
 */
MarkLogicClient.prototype.createTimestamp = function databaseCreateTimestamp(value) {
  let ts = new mlutil.Timestamp(value ? value : null);
  return ts;
};

/**
 * Supplies a new authentication token to be used in subsequent requests
 * instead of the current authentication token.
 *
 * Note: the token must be a SAML authentication token.
 * @method DatabaseClient#setAuthToken
 * @param {string}  token - an authentication token
 * @since 2.2.0
 */
MarkLogicClient.prototype.setAuthToken = function setAuthToken() {
  const argLen = arguments.length;
  if (argLen < 1) {
    throw new Error('must provide a token as the first argument');
  }
  const arg = arguments[0];

  const connectionParams = this.connectionParams;

  const authType = connectionParams.authType.toUpperCase();
  if (authType !== 'SAML') {
    throw new Error('assigning new token only supported for SAML client');
  }

  if (typeof arg !== 'string' && !(arg instanceof String)) {
    throw new Error('token assigned to SAML client must be string');
  }

  connectionParams.auth = 'SAML token='+arg;
};

/** @ignore */
MarkLogicClient.prototype.createProxy = function createProxy(serviceDeclaration) {
  return proxy.init(this, serviceDeclaration);
};

MarkLogicClient.prototype.serviceCaller = function serviceCaller(serviceDeclaration, endpointDeclarations) {
  return proxy.initService(this, serviceDeclaration, endpointDeclarations);
};

MarkLogicClient.prototype.endpointCaller =function endpointCaller(endpointDeclaration) {
  return proxy.initEndpoint(this, endpointDeclaration);
};

function initClient(client, inputParams) {
  var connectionParams = {};
  var isSSL = (inputParams.ssl == null) ? false : inputParams.ssl;
  var keys = ['host', 'port', 'database', 'user', 'password', 'authType', 'token'];
  if(isSSL) {
    keys.push('ca', 'cert', 'ciphers', 'clientCertEngine', 'crl', 'dhparam', 'ecdhCurve', 'honorCipherOrder', 'key', 'passphrase',
        'pfx', 'rejectUnauthorized', 'secureOptions', 'secureProtocol', 'servername', 'sessionIdContext', 'highWaterMark');
  }
  for (var i=0; i < keys.length; i++) {
    var key = keys[i];
    var value = inputParams[key];
    if (value != null) {
      connectionParams[key] = value;
    } else if (key === 'host') {
      connectionParams.host = 'localhost';
    } else if (key === 'port') {
      connectionParams.port = 8000;
    } else if (key === 'authType') {
      connectionParams.authType = 'DIGEST';
    }
  }
  connectionParams.lookup = prefLookup;

  const authType = connectionParams.authType.toUpperCase();
  if (authType !== 'NONE' &&
      authType !== 'KERBEROS' &&
      authType !== 'CERTIFICATE' &&
      authType !== 'SAML' && (
      (connectionParams.user == null) ||
      (connectionParams.password == null)
      )) {
    throw new Error('cannot create client without user or password for '+
      connectionParams.host+' host and '+
      connectionParams.port+' port'
      );
  }

  client.connectionParams = connectionParams;

  if (authType === 'SAML') {
    const token = connectionParams.token;
    if (typeof token !== 'string' && !(token instanceof String)) {
      throw new Error('cannot create SAML client without valid token string for '+
          connectionParams.host+' host and '+
          connectionParams.port+' port'
      );
    }
    connectionParams.auth = 'SAML token='+token;
  } else if (authType !== 'DIGEST' &&
      authType !== 'CERTIFICATE') {
    connectionParams.auth =
      connectionParams.user+':'+connectionParams.password;
  }

  var noAgent = (inputParams.agent == null);
  var agentOptions = noAgent ? {
    keepAlive: true
  } : null;
  if (isSSL) {
    client.request = https.request;
    if (noAgent) {
      mlutil.copyProperties(inputParams, agentOptions, [
        'keepAliveMsecs', 'maxCachedSessions', 'maxFreeSockets', 'maxSockets', 'maxTotalSockets', 'scheduling', 'timeout'
      ]);
      connectionParams.agent = new https.Agent(agentOptions);
    } else {
      connectionParams.agent = inputParams.agent;
    }
  } else {
    client.request = http.request;
    if (noAgent) {
      mlutil.copyProperties(inputParams, agentOptions, [
        'keepAliveMsecs', 'maxFreeSockets', 'maxSockets', 'maxTotalSockets', 'scheduling', 'timeout'
      ]);
      connectionParams.agent = new http.Agent(agentOptions);
    } else {
      connectionParams.agent = inputParams.agent;
    }
  }
}
function releaseClient(client) {
  var agent = client.connectionParams.agent;
  if (agent == null){
    return;
  }
  agent.destroy();
  client.connectionParams = null;
}

function setSliceMode(mode) {
  if (mode !== 'array' && mode !== 'legacy') {
    throw new Error('can only set slice mode to "array" or "legacy", not'+mode);
  }

  mlutil.setSliceMode(mode);
}

function prefLookup(hostname, options, callback) {
  let isMultipleLookup = false;
  if (options instanceof Function) {
    callback = options;
  } else if (options instanceof Object && options.all === true) {
    isMultipleLookup = true;
  }
  // pass the preferred addresses or address to the callback
  const prefCallback = isMultipleLookup ? callback : (err, addresses) => {
    if (err) {
      callback.call(null, err);
    } else {
      let addressdef = null;
      // look for an ipv4 address
      for (let i=0; i < addresses.length; i++) {
        const candidate = addresses[i];
        if (candidate.family === 4) {
          addressdef = candidate;
          break;
        }
      }
      // fallback to first ipv6 address
      if (addressdef === null) {
        addressdef = addresses[0];
      }
      callback.call(null, null, addressdef.address, addressdef.family);
    }
  };
  dns.lookup(hostname, {all:true, verbatim:false}, prefCallback);
}

module.exports = {
    createDatabaseClient: MarkLogicClient,
    /**
     * A factory for creating a document query builder.
     * @function marklogic.queryBuilder
     * @since 1.0
     * @returns {queryBuilder} a helper for defining a document query
     */
    queryBuilder:  queryBuilder.builder,

    /**
     * A factory for creating a cts query builder.
     * @function marklogic.ctsQueryBuilder
     * @since 2.7.0
     * @returns {ctsQueryBuilder} a helper for defining a cts query
     */
    ctsQueryBuilder: ctsQueryBuilder.builder,
    /**
     * A factory for creating a document patch builder
     * @function marklogic.patchBuilder
     * @since 1.0
     * @returns {patchBuilder} a helper for defining a document patch
     */
    patchBuilder:  patchBuilder,
    /**
     * A factory for creating a values builder
     * @function marklogic.valuesBuilder
     * @since 1.0
     * @returns {valuesBuilder} a helper for defining a query
     * to project tuples (rows) of values from documents
     */
    valuesBuilder: valuesBuilder.builder,
    /**
     * A factory for creating a rows plan builder.
     * @function marklogic.planBuilder
     * @since 2.4
     * @returns {planBuilder} a helper for defining a rows query
     */
    planBuilder:  planBuilder.builder,

    /**
     * Configures the slice mode of the query builder and values builder
     * to conform to Array.prototype.slice(begin, end) where begin is
     * zero-based or legacy slice(pageStart, pageLength) where pageStart
     * is one-based. The default is array slice mode. Legacy slice mode
     * is deprecated and will be removed in the next major release.
     * @function marklogic.setSliceMode
     * @since 1.0
     * @param {string} mode - "array" or "legacy"
     */
    setSliceMode:  setSliceMode
};
