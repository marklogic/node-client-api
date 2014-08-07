/*
 * Copyright 2014 MarkLogic Corporation
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
var winston              = require('winston');
var mlrest               = require('./mlrest.js');
var documents            = require('./documents.js');
var values               = require('./values.js');
var extlibs              = require('./extlibs.js');
var restServerProperties = require('./rest-server-properties.js');
var transactions         = require('./transactions.js');
var transforms           = require('./transforms.js');
var queryBuilder         = require('./query-builder.js');
var patchBuilder         = require('./patch-builder.js');
var valuesBuilder        = require('./values-builder.js');

/**
 * Provides functions to connect to a MarkLogic database and to build
 * requests for the database.
 * @module marklogic
 */

/**
 * A client object configured to write, read, query, and perform other
 * operations on a database as a user. The client object is
 * created by the {@link module:marklogic.createDatabaseClient} function. 
 * @namespace DatabaseClient
 * @borrows documents#check             as DatabaseClient#check
 * @borrows documents#createReadStream  as DatabaseClient#createReadStream
 * @borrows documents#createWriteStream as DatabaseClient#createWriteStream
 * @borrows documents#patch             as DatabaseClient#patch
 * @borrows documents#query             as DatabaseClient#query
 * @borrows documents#read              as DatabaseClient#read
 * @borrows documents#remove            as DatabaseClient#remove
 * @borrows documents#removeAll         as DatabaseClient#removeAll
 * @borrows documents#write             as DatabaseClient#write
 */

/**
 * Creates a database client to make database requests such as writes, reads,
 * and queries. The constructor takes a configuration object with the following
 * named parameters.
 * @function module:marklogic.createDatabaseClient
 * @param {string} [host=localhost] - the host with the REST server for the database
 * @param {number} [port=8000] - the port with the REST server for the database
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
  mlrest.initClient(this, connectionParams);

  /**
   * Provides functions that write, read, query, or perform other operations
   * on documents in the database. As a convenience, the same functions are
   * provided on the database client.
   * @name documents
   * @memberof! DatabaseClient#
   * @type {documents} 
   */
  this.documents    = new documents(this);
  /**
   * Provides functions that open, commit, or rollback multi-statement
   * transactions.
   * @name transactions
   * @memberof! DatabaseClient#
   * @type {transactions} 
   */
  this.transactions = new transactions(this);

  this.values = new values(this);

  /**
   * Provides access to namespaces that configure the REST server for the client.
   * The client must have been created for a user with the rest-admin role. 
   * @name config
   * @memberof! DatabaseClient#
   * @property {config.extlibs} extlibs - provides functions that
   * maintain the extension libraries on the REST server
   * @property {config.serverprops} serverprops - provides functions that
   * modify the properties of the REST server
   * @property {config.transforms} transforms - provides functions that
   * maintain the transform extensions on the REST server
   */
  this.config = {
      extlibs:     new extlibs(this),
      serverprops: new restServerProperties(this),
      transforms:  new transforms(this)
  };

  // to inspect
  // setClientLogger.call(this, {level:'debug'});
}

// operation shortcuts
function createReadStreamClient() {
  return this.documents.createReadStream.apply(this.documents, arguments);
}
MarkLogicClient.prototype.createReadStream = createReadStreamClient;
function createWriteStreamClient() {
  return this.documents.createWriteStream.apply(this.documents, arguments);
}
MarkLogicClient.prototype.createWriteStream = createWriteStreamClient;
function patchClient() {
  return this.documents.patch.apply(this.documents, arguments);
}
MarkLogicClient.prototype.patch = patchClient;
function probeClient() {
  return this.documents.probe.apply(this.documents, arguments);
}
MarkLogicClient.prototype.probe = probeClient;
function queryClient() {
  return this.documents.query.apply(this.documents, arguments);
}
MarkLogicClient.prototype.query = queryClient;
function readClient() {
  return this.documents.read.apply(this.documents, arguments);
}
MarkLogicClient.prototype.read = readClient;
function removeClient() {
  return this.documents.remove.apply(this.documents, arguments);
}
MarkLogicClient.prototype.remove = removeClient;
function removeAllClient() {
  return this.documents.removeAll.apply(this.documents, arguments);
}
MarkLogicClient.prototype.removeAll = removeAllClient;
function writeClient() {
  return this.documents.write.apply(this.documents, arguments);
}
MarkLogicClient.prototype.write = writeClient;

function releaseMarkLogicClient() {
  mlrest.releaseClient.apply(this, arguments);
}
MarkLogicClient.prototype.release = releaseMarkLogicClient;

/**
 * Specifies logging for database interactions; takes a configuration
 * object with the following named parameters.
 * @method DatabaseClient#setLogger
 * @param {boolean} [console=true] - whether to log output to the console 
 * @param {string}  [filename] - the name of a file for logging
 * @param {string}  [level=warn] - the amount of detail from the ordered
 * enumeration silly|debug|verbose|info|warn|error as in the
 * {@link https://github.com/flatiron/winston|Winston logging library}.
 */
function setClientLogger(params) {
  if (valcheck.isNullOrUndefined(params)) {
    throw new Error('no params for console or filename logger or log level');
  }

  var useConsole  = params.console;
  var filename    = params.filename;
  var level       = params.level;

  var hasConsole  = !valcheck.isNullOrUndefined(useConsole);
  var hasFilename = !valcheck.isNullOrUndefined(filename);
  var hasLevel    = !valcheck.isNullOrUndefined(level);

  if (!hasConsole && !hasFilename && !hasLevel) {
    throw new Error('params without console or filename logger or log level');
  }

  var logger = null;
  if (hasConsole || hasFilename) {
    var transports = [];

    if (hasConsole && (useConsole || !hasFilename)) {
      transports.push(createConsoleTransport(useConsole));
    }

    if (hasFilename) {
      transports.push(
        new (winston.transports.File)({timestamp: true, filename: filename})
        );
    }

    logger = configClientLogger(this, transports);
  }

  if (hasLevel) {
    if (logger === null) {
      logger = this.getLogger();
    }
    mlrest.setLoggerLevel(logger, level);
  }
}
MarkLogicClient.prototype.setLogger = setClientLogger;

/** @ignore */
function getClientLogger() {
  var logger = this.logger;

  if (valcheck.isNullOrUndefined(logger)) {
    logger = configClientLogger(this, [createConsoleTransport(true)]);
    this.logger = logger;
  }

  return logger;
}
MarkLogicClient.prototype.getLogger = getClientLogger;

/** @ignore */
function createConsoleTransport(use) {
  var console = new winston.transports.Console({timestamp: true});
  if (use === false) {
    console.silent = true;
  }
  return console;
}
/** @ignore */
function configClientLogger(client, transports) {
// TODO: cause emitter warnings in Mocha
//  exceptionHandlers: [createConsoleTransport()],
  var logger = new (winston.Logger)({
    transports:        transports,
    exitOnError:       false
    });
  logger.emitErrs = false;
  client.logger = logger;
  return logger;
}

/** @ignore */
function MarkLogicClientFactory(connectionParams) {
  if (arguments.length === 0)
    throw new Error('no connection parameters');

  return new MarkLogicClient(connectionParams);
}

module.exports = {
    createDatabaseClient: MarkLogicClientFactory,
    /**
     * A factory for creating a document query builder.
     * @function
     * @returns {queryBuilder} a helper for defining a document query
     */
    queryBuilder:  queryBuilder,
    /**
     * A factory for creating a document patch builder
     * @function
     * @returns {patchBuilder} a helper for defining a document patch
     */
    patchBuilder:  patchBuilder,

    valuesBuilder: valuesBuilder
};
