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
var documents    = require('./documents.js');
var transactions = require('./transactions.js');
var queryBuilder = require('./query-builder.js');
var patchBuilder = require('./patch-builder.js');

function MarkLogicClient(connectionParams) {
  this.connectionParams = connectionParams;

  // operations grouped by entity
  this.documents    = new documents(this);
  this.transactions = new transactions(this);

  // operation shortcuts
  this.check             = this.documents.check;
  this.createWriteStream = this.documents.createWriteStream;
  this.remove            = this.documents.remove;
  this.removeAll         = this.documents.removeAll;
  this.patch             = this.documents.patch;
  this.query             = this.documents.query;
  this.read              = this.documents.read;
  this.write             = this.documents.write;
}

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
