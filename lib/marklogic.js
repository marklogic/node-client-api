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
var extlibs              = require('./extlibs.js');
var restServerProperties = require('./rest-server-properties.js');
var transactions         = require('./transactions.js');
var transforms           = require('./transforms.js');
var queryBuilder         = require('./query-builder.js');
var patchBuilder         = require('./patch-builder.js');

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

    if (hasConsole) {
      transports.push(createConsoleTransport());
    }

    if (hasFilename) {
      transports.push(
        new (winston.transports.File)({filename: filename})
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
function getClientLogger() {
  var logger = this.logger;

  if (valcheck.isNullOrUndefined(logger)) {
    logger = configClientLogger(this, [createConsoleTransport()]);
    this.logger = logger;
  }

  return logger;
}
function createConsoleTransport() {
  return new winston.transports.Console();
}
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

function MarkLogicClient(connectionParams) {
  mlrest.initClient(this, connectionParams);

  this.release = mlrest.releaseClient.bind(this);

  // operations grouped by entity
  this.documents    = new documents(this);
  this.transactions = new transactions(this);

  this.config = {
      properties: new restServerProperties(this),
      extlibs:    new extlibs(this),
      transforms: new transforms(this)
  };

  // operation shortcuts
  this.check             = this.documents.check;
  this.createReadStream  = this.documents.createReadStream;
  this.createWriteStream = this.documents.createWriteStream;
  this.patch             = this.documents.patch;
  this.query             = this.documents.query;
  this.read              = this.documents.read;
  this.remove            = this.documents.remove;
  this.removeAll         = this.documents.removeAll;
  this.write             = this.documents.write;
}
MarkLogicClient.prototype.setLogger = setClientLogger;
MarkLogicClient.prototype.getLogger = getClientLogger;

/**
 * Creates a client
 * @param {object} connectionParams - the host, port, user, password, and authentication type (digest or basic)
 */
function MarkLogicClientFactory(connectionParams) {
  if (arguments.length === 0)
    throw new Error('no connection parameters');

  return new MarkLogicClient(connectionParams);
}

module.exports = {
    createDatabaseClient: MarkLogicClientFactory,
    queryBuilder:         queryBuilder,
    patchBuilder:         patchBuilder
};
