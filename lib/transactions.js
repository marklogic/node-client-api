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
'use strict';
var valcheck  = require('core-util-is');
var requester = require('./requester.js');
var mlutil    = require('./mlutil.js');
var Operation = require('./operation.js');

/**
 * Provides functions to open, commit, or rollback multi-statement
 * transactions. The client must have been created for a user with
 * the rest-writer role.
 * @namespace transactions
 */

/** @ignore */
function openOutputTransform(headers/*, data*/) {
  /*jshint validthis:true */
  var operation = this;

  var txid = headers.location.substring('/v1/transactions/'.length);

  if (operation.withState === true) {
    return new mlutil.Transaction(txid, operation.rawHeaders['set-cookie']);
  }

  return {txid: txid};
}

/** @ignore */
function Transactions(client) {
  this.client = client;
}

/**
 * An object representing a multi-statement transaction on the server.
 * @typedef {object} transactions.Transaction
 */

/**
 * Creates a multi-statement transaction, providing a transactionId or
 * Transaction object to pass to write, read, and remove functions
 * before calling the {@link transactions#commit} or {@link transactions#rollback}
 * function to finish the transaction.
 * @method transactions#open
 * @param {string}  [transactionName] - a label to assign to the transaction
 * for easier recognition in reports
 * @param {number}  [timeLimit] - the maximum number of seconds that
 * the transaction should run before rolling back automatically
 * @param {boolean}  [withState] - whether to return a Transaction
 * object that can track the properties of the transaction 
 * @returns {string|transactions.Transaction} either a string
 * transactionId (the default) or a Transaction object identifying
 * the multi-statement transaction; in the next major release,
 * the Transaction object will become the default and the string
 * transactionId will be deprecated. 
 */
Transactions.prototype.open = function openTransaction() {
  var args   = mlutil.asArray.apply(null, arguments);
  var argLen = args.length;

  var transactionName = null;
  var timeLimit       = null;
  var withState       = null;

  var arg = (argLen > 0) ? args[0] : null;
  if (argLen > 1 || valcheck.isString(arg) || valcheck.isNumber(arg) ||
      valcheck.isBoolean(arg)) {
    var i=0;
    for (; i < argLen; i++) {
      arg = args[i];
      if (transactionName === null && valcheck.isString(arg)) {
        transactionName = arg;
        continue;
      } else if (timeLimit === null && valcheck.isNumber(arg)) {
        timeLimit = arg;
        continue;
      } else if (withState === null && valcheck.isBoolean(arg)) {
        withState = arg;
        continue;
      }
      throw new Error('unknown parameter for transaction open: '+arg);
    }
  } else if (argLen === 1) {
    transactionName = arg.transactionName;
    timeLimit       = arg.timeLimit;
    withState       = arg.withState;
  }

  var path = '/v1/transactions';
  var sep = '?';
  if (!valcheck.isNullOrUndefined(transactionName)) {
    path += sep+'name='+encodeURIComponent(transactionName);
    sep = '&';
  }
  if (!valcheck.isNullOrUndefined(timeLimit)) {
    path += sep+'timeLimit='+timeLimit;
  }

  var connectionParams = this.client.connectionParams;
  var requestOptions = mlutil.copyProperties(connectionParams);
  requestOptions.method = 'POST';
  requestOptions.path = mlutil.databaseParam(connectionParams, path, sep);

  var operation = new Operation(
      'open transaction', this.client, requestOptions, 'empty', 'empty'
      );
  operation.validStatusCodes = [303];
  operation.outputTransform  = openOutputTransform;
  operation.withState        = withState || false;

  return requester.startRequest(operation);
};

/**
 * Reads the current state of a multi-statement transaction
 * created with the {@link transactions#open} function.
 * @method transactions#read
 * @param {string|transactions.Transaction} txid - a string
 * transaction id or Transaction object identifying an open
 * multi-statement transaction
 * @returns {object} information about the transaction
 */
Transactions.prototype.read = function readTransaction(txid) {
  var path =
    '/v1/transactions/'+mlutil.getTxidParam(txid, 'read')+'?format=json';

  var connectionParams = this.client.connectionParams;
  var requestOptions = mlutil.copyProperties(connectionParams);
  requestOptions.method = 'GET';
  requestOptions.headers = {
      'Accept': 'application/json'
  };
  requestOptions.path = mlutil.databaseParam(connectionParams, path, '&');
  mlutil.addTxidHeaders(requestOptions, txid);

  var operation = new Operation(
      'read transaction', this.client, requestOptions, 'empty', 'single'
      );
  operation.txid = txid;

  return requester.startRequest(operation);
};

/**
 * Finishes a multi-statement transaction by applying the changes.
 * @method transactions#commit
 * @param {string|transactions.Transaction}  txid - a string
 * transaction id or Transaction object identifying an open
 * multi-statement transaction
 */
Transactions.prototype.commit = function commitTransaction(txid) {
  return finishTransaction(this.client, 'commit', txid);
};

/**
 * Finishes a multi-statement transaction by reverting the changes.
 * @method transactions#rollback
 * @param {string|transactions.Transaction}  txid - a string
 * transaction id or Transaction object identifying an open
 * multi-statement transaction
 */
Transactions.prototype.rollback = function rollbackTransaction(txid) {
  return finishTransaction(this.client, 'rollback', txid);
};

/** @ignore */
function finishOutputTransform(/*headers, data*/) {
  /*jshint validthis:true */
  var operation = this;

  return {
    txid:     operation.txid,
    finished: operation.finish
  };
}
/** @ignore */
function finishTransaction(client, result, txid) {
  var path =
    '/v1/transactions/'+mlutil.getTxidParam(txid, result)+'?result='+result;

  var connectionParams = client.connectionParams;
  var requestOptions = mlutil.copyProperties(connectionParams);
  requestOptions.method = 'POST';
  requestOptions.path = mlutil.databaseParam(connectionParams, path, '&');
  mlutil.addTxidHeaders(requestOptions, txid);

  var operation = new Operation(
      result+' transaction', client, requestOptions, 'empty', 'empty'
      );
  operation.txid             = txid;
  operation.finish           = result;
  operation.outputTransform  = finishOutputTransform;

  return requester.startRequest(operation);
}

module.exports = Transactions;
