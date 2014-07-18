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
var valcheck = require('core-util-is');
var mlrest = require('./mlrest.js');
var mlutil = require('./mlutil.js');

/**
 * Provides functions to open, commit, or rollback multi-statement
 * transactions. The client must have been created for a user with
 * the rest-writer role.
 * @namespace transactions
 */

/** @ignore */
function openTxnEventMapper(response, dispatcher) {
  if (response.statusCode === 303) {
    dispatcher.emit('data',
      response.headers.location.substring('/v1/transactions/'.length)
      );
  }
  // TODO: emit error in failure case
  dispatcher.emit('end');
  response.resume();
}

/** @ignore */
function openOutputTransform(data) {
  var operation = this;

  return {
    txid:
      operation.responseHeaders.location.substring('/v1/transactions/'.length)
  };
}
/**
 * Creates a multi-statement transaction, providing a transactionId
 * to pass to write, read, and remove functions before calling
 * the {@link transactions#commit} or {@link transactions#rollback}
 * function to finish the transaction.
 * @method transactions#open
 * @returns {string} a transactionId identifying the multi-statement
 * transaction
 */
function openTransaction() {
  var path = '/v1/transactions';

  var requestdef = {};

  var argLen = arguments.length;
  var isFirst = true;
  for (var i=0; i < argLen; i++) {
    var sep = (isFirst) ? '?' : '&';
    var arg = arguments[i];
    if (valcheck.isString(arg)) {
      requestdef.transactionName = arg;
      path += sep+'name='+encodeURIComponent(arg);
      if (isFirst) {
        isFirst = false;
      } else {
        break;
      }
    } else if (valcheck.isNumber(arg)) {
      path += sep+'timeLimit='+arg;
      if (isFirst) {
        isFirst = false;
      } else {
        break;
      }
    }
  }

  var requestOptions = mlutil.copyProperties(this.client.connectionParams);
  requestOptions.method = 'POST';
  requestOptions.path = path ;

  var operation = mlrest.createOperation(
      'open transaction', this.client, requestOptions, 'empty', 'empty'
      );
  operation.validStatusCodes = [303];
  operation.outputTransform  = openOutputTransform;

  return mlrest.startRequest(operation);
}

/**
 * Reads the current state of a multi-statement transaction
 * created with the {@link transactions#open} function.
 * @method transactions#read
 * @param {string}  txid - the transaction id for an open transaction
 * @returns {object} information about the transaction
 */
function readTransaction(txid) {
  if (txid === undefined) {
    throw new Error('cannot read transaction without id');
  }
  var path = '/v1/transactions/'+txid+'?format=json';

  var requestOptions = mlutil.copyProperties(this.client.connectionParams);
  requestOptions.method = 'GET';
  requestOptions.headers = {
      'Accept': 'application/json'
  };
  requestOptions.path = path;

  var operation = mlrest.createOperation(
      'read transaction', this.client, requestOptions, 'empty', 'single'
      );
  operation.txid = txid;

  return mlrest.startRequest(operation);
}

/**
 * Finishes a multi-statement transaction by applying the changes.
 * @method transactions#commit
 * @param {string}  txid - the transaction id for an open transaction
 */
function commitTransaction(txid) {
  return finishTransaction(this.client, 'commit', txid);
}
/**
 * Finishes a multi-statement transaction by reverting the changes.
 * @method transactions#rollback
 * @param {string}  txid - the transaction id for an open transaction
 */
function rollbackTransaction(txid) {
  return finishTransaction(this.client, 'rollback', txid);
}
/** @ignore */
function finishOutputTransform(data) {
  var operation = this;

  return {
    txid:     operation.txid,
    finished: operation.finish
  };
}
/** @ignore */
function finishTransaction(client, result, txid) {
  if (txid === undefined) {
    throw new Error('cannot '+result+' without transaction id');
  }
  var path = '/v1/transactions/'+txid+'?result='+result;

  var requestOptions = mlutil.copyProperties(client.connectionParams);
  requestOptions.method = 'POST';
  requestOptions.path = path;

  var operation = mlrest.createOperation(
      result+' transaction', client, requestOptions, 'empty', 'empty'
      );
  operation.txid             = txid;
  operation.finish           = result;
  operation.outputTransform  = finishOutputTransform;

  return mlrest.startRequest(operation);
}

/** @ignore */
function transactions(client) {
  this.client = client;

  this.open     = openTransaction.bind(this);
  this.read     = readTransaction.bind(this);
  this.commit   = commitTransaction.bind(this);
  this.rollback = rollbackTransaction.bind(this);
}

module.exports = transactions;
