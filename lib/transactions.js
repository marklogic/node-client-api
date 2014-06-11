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
var mlrest = require('./mlrest.js');
var mlutil = require('./mlutil.js');

function openTxnEventMapper(response, proxy) {
  if (response.statusCode === 303) {
    proxy.emit('data',
      response.headers.location.substring('/v1/transactions/'.length)
      );
  }
  // TODO: emit error in failure case
  proxy.emit('end');
  response.resume();
}
function openTransaction() {
  var path = '/v1/transactions';

  var requestdef = {};

  var argLen = arguments.length;
  var isFirst = true;
  for (var i=0; i < argLen; i++) {
    var sep = (isFirst) ? '?' : '&';
    var arg = arguments[i];
    if (mlutil.isString(arg)) {
      requestdef.transactionName = arg;
      path += sep+'name='+arg;
      if (isFirst) {
        isFirst = false;
      } else {
        break;
      }
    } else if (mlutil.isNumber(arg)) {
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

  var responseProxy = mlrest.response(openTxnEventMapper, true, requestdef, 400);
  responseProxy.format = 'text';

  // TODO: pass proxy instead of collector
  var request = mlrest.request(
    this.client, requestOptions, false, responseProxy.collector
    );
  request.on('error', mlutil.requestErrorHandler);
  request.end();

  return mlrest.responder(responseProxy, false);
}
function commitTransaction(txid) {
  return finishTransaction(this.client, 'commit', txid);
}
function rollbackTransaction(txid) {
  return finishTransaction(this.client, 'rollback', txid);
}
function finishTransaction(client, result, txid) {
  if (txid === undefined) {
    throw new Error('cannot '+result+' without transaction id');
  }
  var path = '/v1/transactions/'+txid+'?result='+result;
  
  var requestOptions = mlutil.copyProperties(client.connectionParams);
  requestOptions.method = 'POST';
  requestOptions.path = path;

  var responseProxy = mlrest.response(mlrest.emptyEventMapper, true);

  // TODO: pass proxy instead of collector
  var request = mlrest.request(
    client, requestOptions, false, responseProxy.collector
    );
  // TODO: register same error handler for request and response
  request.on('error', mlutil.requestErrorHandler);
  request.end();

  return mlrest.responder(responseProxy, false);
}

function transactions(client) {
  this.client = client;

  this.open     = openTransaction.bind(this);
  this.commit   = commitTransaction.bind(this);
  this.rollback = rollbackTransaction.bind(this);
}

module.exports = transactions;
