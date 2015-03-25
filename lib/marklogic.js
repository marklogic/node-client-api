/*
 * Copyright 2014-2015 MarkLogic Corporation
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
var valcheck             = require('core-util-is');

var mlutil               = require('./mlutil.js');
var mllog                = require('./mllog.js');
var mlrest               = require('./mlrest.js');

var documents            = require('./documents.js');
var graphs               = require('./graphs.js');
var values               = require('./values.js');
var extlibs              = require('./extlibs.js');
var restServerProperties = require('./rest-server-properties.js');
var transactions         = require('./transactions.js');
var transforms           = require('./transforms.js');
var resourcesConfig      = require('./resources-config.js');
var resourcesExec        = require('./resources-exec.js');
var serverExec           = require('./server-exec.js');

var queryBuilder         = require('./query-builder.js');
var patchBuilder         = require('./patch-builder.js');
var valuesBuilder        = require('./values-builder.js');

/**
 * Provides functions to connect to a MarkLogic database and to build
 * requests for the database.
 * @module marklogic
 */

/**
 * Provides functions provides functions that maintain patch replacement libraries
 * on the REST server. The client must have been created for a user with the
 * rest-admin role. 
 * @namespace config.patch.replace
 */
/**
 * Reads a patch replacement library installed on the server.
 * @method config.patch.replace#read
 * @param {string} moduleName - the filename without a path for the patch replacement library
 * @returns {ResultProvider} an object whose result() function takes
 * a success callback that receives the source code for the library
 */
/**
 * Installs a patch replacement library on the server.
 * @method config.patch.replace#write
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
 * @param {string} moduleName - the filename without a path for the patch replacement library
 */
/**
 * Lists the patch replacement libraries installed on the server.
 * @method config.patch.replace#list
 * @returns {ResultProvider} an object whose result() function takes
 * a success callback that receives the list of replacement libraries
 */

/**
 * Provides functions provides functions that maintain custom query binding
 * or facet extensions on the REST server. The client must have been created
 * for a user with the rest-admin role. 
 * @namespace config.query.custom
 */
/**
 * Reads a custom query library installed on the server.
 * @method config.query.custom#read
 * @param {string} moduleName - the filename without a path for the custom query library
 * @returns {ResultProvider} an object whose result() function takes
 * a success callback that receives the source code for the library
 */
/**
 * Installs a custom query library on the server.
 * @method config.query.custom#write
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
 * @param {string} moduleName - the filename without a path for the custom query library
 */
/**
 * Lists the custom query libraries installed on the server.
 * @method config.query.custom#list
 * @returns {ResultProvider} an object whose result() function takes
 * a success callback that receives the list of replacement libraries
 */

/**
 * Provides functions provides functions that maintain query snippet extensions
 * on the REST server. The client must have been created for a user with the
 * rest-admin role. 
 * @namespace config.query.snippet
 */
/**
 * Reads a query snippet library installed on the server.
 * @method config.query.snippet#read
 * @param {string} moduleName - the filename without a path for the query snippet library
 * @returns {ResultProvider} an object whose result() function takes
 * a success callback that receives the source code for the library
 */
/**
 * Installs a query snippet library on the server.
 * @method config.query.snippet#write
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
 * @param {string} moduleName - the filename without a path for the query snippet library
 */
/**
 * Lists the custom query libraries installed on the server.
 * @method config.query.snippet#list
 * @returns {ResultProvider} an object whose result() function takes
 * a success callback that receives the list of replacement libraries
 */
function ExtlibsWrapper(extlibs, name, dir) {
  this.extlibs = extlibs;
  this.name    = name;
  this.dir     = dir;
}
function listExtlibsWrapper() {
  return this.extlibs.list.call(this.extlibs, this.dir);
}
ExtlibsWrapper.prototype.list = listExtlibsWrapper;
function readExtlibsWrapper() {
  return this.extlibs.read.apply(
      this.extlibs,
      expandExtlibsWrapper.call(this, 'reading', mlutil.asArray.apply(null, arguments))
      );
}
ExtlibsWrapper.prototype.read = readExtlibsWrapper;
function removeExtlibsWrapper() {
  return this.extlibs.remove.apply(
      this.extlibs,
      expandExtlibsWrapper.call(this, 'removing', mlutil.asArray.apply(null, arguments))
      );
}
ExtlibsWrapper.prototype.remove = removeExtlibsWrapper;
function writeExtlibsWrapper() {
  var args = expandExtlibsWrapper.call(this, 'writing', mlutil.asArray.apply(null, arguments));
  var module = args[0];
  var ext = mlutil.extension(module);
  if (ext === null) {
    throw new Error(module+' module for '+this.name+' library must have an extension of .sjs or .xqy');
  }
  switch(ext) {
  case 'sjs':
    args[0] = 'application/javascript';
    break;
  case 'xqy':
    args[0] = 'application/xquery';
    break;
  default:
    throw new Error(module+' module for '+this.name+' library does not have .sjs or .xqy extension');
  }
  args.unshift(module);
  return this.extlibs.write.apply(this.extlibs, args);
}
ExtlibsWrapper.prototype.write = writeExtlibsWrapper;
function expandExtlibsWrapper(action, args) {
  var module = (args.length > 0) ? args[0] : null;
  if (!valcheck.isString(module)) {
    throw new Error('no module name for '+action+' '+this.name+' library');
  }
  args[0] = this.dir + module;
  return args;
}

/**
 * A client object configured to write, read, query, and perform other
 * operations on a database as a user. The client object is
 * created by the {@link module:marklogic.createDatabaseClient} function. 
 * @namespace DatabaseClient
 * @borrows serverExec#eval       as DatabaseClient#eval
 * @borrows serverExec#xqueryEval as DatabaseClient#xqueryEval
 * @borrows serverExec#invoke     as DatabaseClient#invoke
 */

/**
 * Creates a database client to make database requests such as writes, reads,
 * and queries. The constructor takes a configuration object with the following
 * named parameters.
 * @function module:marklogic.createDatabaseClient
 * @param {string} [host=localhost] - the host with the REST server for the database
 * @param {number} [port=8000] - the port with the REST server for the database
 * @param {string} [database] - the name of the database to access, defaulting
 * to the database for the AppServer on the port
 * @param {string} user - the user with permission to access the database
 * @param {string} password - the password for the user with permission to access
 * the database
 * @param {enum} [authType=digest] - the authentication type of digest or basic
 * @param {boolean} [ssl=false] - whether the REST server uses SSL; when true,
 * the connection parameters can include the
 * {@link http://nodejs.org/api/https.html#https_https_request_options_callback|supplemental
 * HTTPS options} specifiable for the node.js tls.connect() function.
 * @param {object} [agent] - defaults to a connection pooling agent
 * @returns {DatabaseClient} a client for accessing the database
 * as the user
 */
function MarkLogicClient(connectionParams) {
  if (!(this instanceof MarkLogicClient)) {
    return new MarkLogicClient(connectionParams);
  }

  if (valcheck.isNullOrUndefined(connectionParams)) {
    throw new Error('no connection parameters');
  }

  mlrest.initClient(this, connectionParams);

  /**
   * Provides functions that write, read, query, or perform other operations
   * on documents in the database. As a convenience, the same functions are
   * provided on the database client.
   * @name documents
   * @memberof! DatabaseClient#
   * @type {documents} 
   */
  this.documents    = documents.create(this);
  /**
   * Provides functions that open, commit, or rollback multi-statement
   * transactions.
   * @name transactions
   * @memberof! DatabaseClient#
   * @type {transactions} 
   */
  this.transactions = new transactions(this);

  /**
   * Provides functions that read, write, merge, remove, list, or query
   * with SPARQL on triple graphs.
   * @name graphs
   * @memberof! DatabaseClient#
   * @type {graphs} 
   */
  this.graphs    = new graphs(this);
  /**
   * Provides functions that submit get, put, post, or remove requests
   * to resource service extensions.
   * @name resources
   * @memberof! DatabaseClient#
   * @type {resources} 
   */
  this.resources = new resourcesExec(this);
  /**
   * Provides functions that submit values queries to project
   * tuples (rows) of values from documents.
   * @name values
   * @memberof! DatabaseClient#
   * @type {values} 
   */
  this.values    = new values(this);

  var configExtlibs = new extlibs(this);

  /**
   * Provides access to namespaces that configure the REST server for the client.
   * The client must have been created for a user with the rest-admin role. 
   * @name config
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

      resources:   new resourcesConfig(this),

      serverprops: new restServerProperties(this),
      transforms:  new transforms(this)
  };

  this.logger = null;
}
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
 * @param {string}  collection - the name of the collection for the documents
 * @param {object|object[]} content - the objects with the content for the
 * documents
 * @returns {ResultProvider} an object whose result() function takes
 * a success callback receiving an array of uri strings for the created documents.
 */
function createClient() {
  var argLen = arguments.length;
  if (argLen < 2) {
    throw new Error('must specify both a collection and content objects for document create');
  }

  var collection = arguments[0];
  if (!valcheck.isString(collection)) {
    throw new Error('must specify at least one collection for document create');
  }

  var contentArray = arguments[1];
  var i = 0;
  if (!valcheck.isArray(contentArray)) {
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
}
MarkLogicClient.prototype.createCollection = createClient;
/**
 * Probes whether a document exists; takes a uri string identifying the document.
 * The {@link documents#probe} function is less simple but more complete,
 * returning an object with additional information.
 * @method DatabaseClient#probe
 * @param {string}  uri - the uri for the database document
 * @returns {ResultProvider} an object whose result() function takes
 * a success callback that receives a boolean.
 */
function probeClient() {
  return documents.probeImpl.call(this.documents, true, mlutil.asArray.apply(null, arguments));
}
MarkLogicClient.prototype.probe = probeClient;
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
 * @param {string}  collection - the name of the document collection
 * @param {object}  [query] - a query built by a {@link queryBuilder}
 * @returns {ResultProvider} an object whose result() function takes
 * a success callback that receives an array with the content of the
 * documents.
 */
function queryClient(collection, builtQuery) {
  if (!valcheck.isString(collection)) {
    throw new Error('must specify at least one collection for quick document queries');
  }

  if (valcheck.isNullOrUndefined(builtQuery)) {
    builtQuery = queryBuilder.builder.where();
  }

  return documents.queryImpl.call(this.documents, collection, true, builtQuery);
}
MarkLogicClient.prototype.queryCollection = queryClient;
/**
 * Reads one or more documents; takes one or more uri strings or
 * an array of uri strings. The {@link documents#read} function
 * is less simple but more complete, potentially transforming
 * documents on the server and returning an envelope object for
 * each document with the uri and metadata as well as the content.
 * @method DatabaseClient#read
 * @param {string|string[]}  uris - the uri string or an array of uri strings
 * for the database documents
 * @returns {ResultProvider} an object whose result() function takes
 * a success callback that receives an array with the content of the documents.
 */
function readClient() {
  return documents.readImpl.call(this.documents, true, mlutil.asArray.apply(null, arguments));
}
MarkLogicClient.prototype.read = readClient;
/**
 * Removes a database document; takes a uri string identifying the document.
 * The {@link documents#remove} function is less simple but more complete.
 * @method DatabaseClient#remove
 * @param {string}  uri - the uri for the database document
 * @returns {ResultProvider} an object whose result() function takes
 * a success callback that receives the uri string identifying the removed
 * document.
 */
function removeClient() {
  return documents.removeImpl.call(this.documents, true, mlutil.asArray.apply(null, arguments));
}
MarkLogicClient.prototype.remove = removeClient;
/**
 * Removes all documents in a collection; takes the uri string identifying
 * the collection.
 * The {@link documents#removeAll} function is less simple but more complete,
 * supporting deleting a directory or all documents in the database.
 * @method DatabaseClient#removeCollection
 * @param {string}  collection - the collection whose documents should be
 * deleted
 * @returns {ResultProvider} an object with a result() function takes
 * a success callback that receives the uri string identifying the removed
 * collection.
 */
function removeCollectionClient(collection) {
  if (!valcheck.isString(collection)) {
    throw new Error('must specify at least one collection for quick document remove');
  }

  return documents.removeCollectionImpl.call(this.documents, true, {collection: collection});
}
MarkLogicClient.prototype.removeCollection = removeCollectionClient;
/**
 * Inserts or updates one or more documents for a collection; takes a collection name
 * string and an object that maps document uris to document content. 
 * The {@link documents#write} function is less simple but more complete,
 * accepting a uri identifier and metadata (such as multiple collections)
 * and optionally transforming each document on the server.
 * @method DatabaseClient#writeCollection
 * @param {string}  collection - the name of the collection for the documents
 * @param {object} documents - an object in which every key is the uri string
 * for a document and every value is the content for the document
 * @returns {ResultProvider} an object whose result() function takes
 * a success callback receiving an array of uri strings for the written documents.
 */
function writeClient() {
  var argLen = arguments.length;
  if (argLen < 2) {
    throw new Error('must specify both a collection and mapping object for quick document write');
  }

  var collection = arguments[0];
  if (!valcheck.isString(collection)) {
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
}
MarkLogicClient.prototype.writeCollection = writeClient;

function releaseMarkLogicClient() {
  mlrest.releaseClient.apply(this, arguments);
}
MarkLogicClient.prototype.release = releaseMarkLogicClient;

/**
 * Supplies a logger to use for database interactions or, instead, takes
 * a logging level from the debug|info|warn|error|silent enumeration (where silent
 * is the initial setting) for the default console logger. 
 * @method DatabaseClient#setLogger
 * @param {object}  logger - an object providing debug(), info(), warn(), and error()
 * logging methods such as a logger provided by the
 * {@link https://github.com/trentm/node-bunyan|Bunyan} or
 * {@link https://github.com/flatiron/winston|Winston} logging libraries.
 * @param {boolean}  [isErrorFirst] - whether an error should be logged as the first parameter;
 * must be provided as true for Bunyan (but not for Winston); defaults to false
 */
function setClientLogger() {
  var argLen = arguments.length;
  if (argLen < 1) {
    throw new Error('must provide a logger as the first argument');
  }

  var arg = arguments[0];
  if (valcheck.isString(arg)) {
    var logger = (argLen === 1) ? this.getLogger() : null;
    if (logger instanceof mllog.ConsoleLogger) {
      logger.setLevel(arg);
    } else {
      throw new Error('first argument is not a logger');
    }
  } else {
    this.logger = new mllog.DelegatingLogger(arg);
    if (argLen > 1 && valcheck.isBoolean(arguments[1])) {
      this.logger.isErrorFirst = arguments[1];
    }
  }
}
MarkLogicClient.prototype.setLogger = setClientLogger;

/** @ignore */
function getClientLogger() {
  var logger = this.logger;

  if (valcheck.isNullOrUndefined(logger)) {
    logger = new mllog.ConsoleLogger();
    this.logger = logger;
  }

  return logger;
}
MarkLogicClient.prototype.getLogger = getClientLogger;

module.exports = {
    createDatabaseClient: MarkLogicClient,
    /**
     * A factory for creating a document query builder.
     * @function
     * @returns {queryBuilder} a helper for defining a document query
     */
    queryBuilder:  queryBuilder.builder,
    /**
     * A factory for creating a document patch builder
     * @function
     * @returns {patchBuilder} a helper for defining a document patch
     */
    patchBuilder:  patchBuilder,
    /**
     * A factory for creating a values builder
     * @function
     * @returns {valuesBuilder} a helper for defining a query
     * to project tuples (rows) of values from documents
     */
    valuesBuilder: valuesBuilder
};
