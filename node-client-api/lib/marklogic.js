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
var queryBuilder = require('../lib/query-builder.js');

function MarkLogicClient(connectionParams) {
  this.connectionParams = connectionParams;

  // operations grouped by entity
  this.documents = new documents(this);

  // operation shortcuts
  this.check             = this.documents.check;
  this.del               = this.documents.del;
  this.read              = this.documents.read;
  this.createWriteStream = this.documents.createWriteStream;
  this.write             = this.documents.write;
  this.query             = this.documents.query;
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
    queryBuilder:         queryBuilder
};
