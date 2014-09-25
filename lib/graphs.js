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

function uriErrorTransform(message) {
  var operation = this;

  var isDefault = (operation.isDefault === true);
  if (isDefault) {
    return message+' (on default graph)';
  } 

  var uri = operation.uri;
  if (valcheck.isString(uri)) {
    return message+' (on graph '+uri+')';
  } 

  return message;
}
function checkOutputTransform(data) {
  var operation = this;

  var statusCode = operation.responseStatusCode;
  var exists     = (statusCode === 200) ? true : false;

  var output = exists ? operation.responseHeaders : {};
  output.exists = exists;

  return identifyOutput.call(operation, data, output);
}
function emptyOutputTransform(data) {
  return identifyOutput.call(this, data, {});
}
function identifyOutput(data, output) {
  var operation = this;

  var isDefault = (operation.isDefault === true);

  output.defaultGraph = isDefault;
  output.graph        = (isDefault ? null : operation.uri);

  return output;
}
function listOutputTransform(data) {
  var operation = this;

  if (valcheck.isNullOrUndefined(data)) {
    return data;
  }

  if (valcheck.isNullOrUndefined(operation.contentType)) {
    return data.split(/\s+/).filter(function(collection) {
      return collection !== '';
    });
  }

  return data;
}

function readGraph() {
  var args = mlutil.asArray.apply(null, arguments);
  var argLen = args.length;
  if (argLen === 0) {
    throw new Error('must specify the content type when reading a graph');
  }

  var contentType = null;
  var uri         = null;

  var testArg = args[0];
  if (valcheck.isString(testArg)) {
    if (argLen > 1) {
      uri = testArg;
      contentType = args[1]; 
    } else {
      contentType = testArg;
    }
  } else {
    var params = testArg;
    contentType = params.contentType;
    uri = params.uri;
    if (valcheck.isNullOrUndefined(contentType)) {
      throw new Error('named parameters must specify the content type when reading a graph');
    }
  }

  var endpoint = valcheck.isNullOrUndefined(uri) ?
      '/v1/graphs?default' : encodeURI('/v1/graphs?graph='+uri);

  var connectionParams = this.client.connectionParams;
  var requestOptions = mlutil.copyProperties(connectionParams);
  requestOptions.method = 'GET';
  requestOptions.headers = {
      'Accept': contentType
  }; 
  requestOptions.path = mlutil.databaseParam(connectionParams, endpoint, '&');

  var operation = mlrest.createOperation(
      'read graph', this.client, requestOptions, 'empty', 'single'
      );
  if (valcheck.isNull(uri)) {
    operation.isDefault = true;
  } else {
    operation.uri = uri;
  }
  operation.errorTransform = uriErrorTransform;

  return mlrest.startRequest(operation);
}

function writeGraph() {
  return changeGraph.call(this, 'write', false, mlutil.asArray.apply(null, arguments));
}
function mergeGraph() {
  return changeGraph.call(this, 'merge', false, mlutil.asArray.apply(null, arguments));
}
function createGraphWriteStream() {
  return changeGraph.call(this, 'write', true, mlutil.asArray.apply(null, arguments));
}
function createGraphMergeStream() {
  return changeGraph.call(this, 'merge', true, mlutil.asArray.apply(null, arguments));
}
function changeGraph(action, isStreaming, args) {
  var argLen = args.length;
  if (argLen === 0) {
    throw new Error(
        isStreaming ?
        ('must specify content type for '+action) :
        ('must specify content type and data for '+action)
        );
  }

  var uri         = null;
  var contentType = null;
  var repair      = false;
  var data        = false;

  var testArg = args[0];
  if (argLen === 1 && !valcheck.isString(testArg)) {
    var params = testArg;
    contentType = params.contentType;
    uri         = params.uri;
    repair      = params.repair || false;
    data        = params.data;
    var noContentType = valcheck.isNullOrUndefined(contentType);
    if (isStreaming) {
      if (noContentType) {
        throw new Error('named parameters must specify the content type for '+action);
      }
    } else {
      if (noContentType || valcheck.isNullOrUndefined(data)) {
        throw new Error('named parameters must specify the content type and data for '+action);
      }
    }
  } else {
    var arg = null;
    for (var i = 1;i < argLen; i++) {
      arg = args[i];
      if (valcheck.isBoolean(arg)) {
        repair = arg;
        continue;
      } else if (valcheck.isString(arg) && valcheck.isNull(uri)) {
        uri = testArg;
        testArg = arg;
        continue;
      }
      if (!isStreaming) {
        data = arg;
      }
      break;        
    }
    contentType = testArg;
  }

  var endpoint = valcheck.isNullOrUndefined(uri) ? 
      '/v1/graphs?default' : encodeURI('/v1/graphs?graph='+uri);
  if (repair === true) {
    endpoint += '&repair=true';
  }

  var connectionParams = this.client.connectionParams;
  var requestOptions = mlutil.copyProperties(connectionParams);
  requestOptions.method = (action === 'write') ? 'PUT' : 'POST';
  requestOptions.headers = {
      'Content-Type': contentType
  };
  requestOptions.path = mlutil.databaseParam(connectionParams, endpoint, '&');

  var operation = mlrest.createOperation(
      action+' graph', this.client, requestOptions, (isStreaming ? 'chunked' : 'single'), 'empty'
      );
  if (valcheck.isNull(uri)) {
    operation.isDefault = true;
  } else {
    operation.uri = uri;
  }
  if (!isStreaming) {
    operation.requestBody = data;
  }
  operation.outputTransform = emptyOutputTransform;
  operation.errorTransform  = uriErrorTransform;

  return mlrest.startRequest(operation);
}

function removeGraph() {
  return applyGraph.call(this, 'remove', (arguments.length > 0) ? arguments[0] : null);
}
function probeGraph() {
  return applyGraph.call(this, 'probe', (arguments.length > 0) ? arguments[0] : null);
}
function applyGraph(action, uri) {
  var endpoint = valcheck.isNull(uri) ? '/v1/graphs?default' : encodeURI('/v1/graphs?graph='+uri);

  var connectionParams = this.client.connectionParams;
  var requestOptions = mlutil.copyProperties(connectionParams);
  requestOptions.method = (action === 'remove') ? 'DELETE' : 'HEAD';
  requestOptions.path = mlutil.databaseParam(connectionParams, endpoint, '&');
  
  var operation = mlrest.createOperation(
      action+' graph', this.client, requestOptions, 'empty', 'empty'
      );
  if (valcheck.isNull(uri)) {
    operation.isDefault = true;
  } else {
    operation.uri = uri;
  }
  if (action === 'remove') {
    operation.outputTransform = emptyOutputTransform;
  } else {
    operation.validStatusCodes = [200, 404];
    operation.outputTransform  = checkOutputTransform;    
  }
  operation.errorTransform  = uriErrorTransform;

  return mlrest.startRequest(operation);
}

function listGraphs() {
  var contentType   = (arguments.length > 0) ? arguments[0] : null;
  var noContentType = valcheck.isNull(contentType);

  var connectionParams = this.client.connectionParams;
  var requestOptions = mlutil.copyProperties(connectionParams);
  requestOptions.method = 'GET';
  if (!noContentType) {
    requestOptions.headers = {
        'Accept': contentType
    };
  }
  requestOptions.path = mlutil.databaseParam(connectionParams, '/v1/graphs', '?');
  
  var operation = mlrest.createOperation(
      'list graphs', this.client, requestOptions, 'empty', 'single'
      );
  if (!noContentType) {
    operation.contentType = contentType;
  }
  operation.outputTransform = listOutputTransform;

  return mlrest.startRequest(operation);
}

function queryGraphSPARQL() {
  var args = mlutil.asArray.apply(null, arguments);
  var argLen = args.length;

  if (argLen === 0) {
    throw new Error('must specify content type and query for SPARQL query on graphs');
  }

  var defaultGraphs = null;
  var namedGraphs   = null;
  var contentType   = null;
  var query         = null;

  if (argLen === 1) {
    var params = args[0];
    contentType   = params.contentType;
    defaultGraphs = params.defaultGraphs;
    namedGraphs   = params.namedGraphs;
    query         = params.query;
    if (valcheck.isNullOrUndefined(contentType) || valcheck.isNullOrUndefined(query)) {
      throw new Error('named parameters must specify content type and query for SPARQL query on graphs');
    }
  } else {
    contentType = args[0];
    if (argLen > 3) {
      defaultGraphs = Array.prototype.slice.call(arguments, 1, argLen - 1);
    }
    query = args[argLen - 1];
  }

  var endpoint = '/v1/graphs/sparql';
  var sep = '?';

  var hasDefaultGraphs = (!valcheck.isNullOrUndefined(defaultGraphs));
  if (hasDefaultGraphs) {
    defaultGraphs = mlutil.asArray(defaultGraphs);
    if (defaultGraphs.length > 0) {
      endpoint += sep+'default-graph-uri='+defaultGraphs.join('&default-graph-uri=');
      sep = '&';
    } else {
      hasDefaultGraphs = false;
    }
  }

  var hasNamedGraphs = !valcheck.isNullOrUndefined(namedGraphs);
  if (hasNamedGraphs) {
    namedGraphs = mlutil.asArray(namedGraphs);
    if (namedGraphs.length > 0) {
      endpoint += sep+'named-graph-uri='+namedGraphs.join('&named-graph-uri=');
      sep = '&';
    } else {
      hasNamedGraphs = false;
    }
  }

  var connectionParams = this.client.connectionParams;
  var requestOptions = mlutil.copyProperties(connectionParams);
  requestOptions.method = 'POST';
  requestOptions.headers = {
      'Content-Type': 'application/sparql-query',
      'Accept':       contentType
  }; 
  requestOptions.path = mlutil.databaseParam(connectionParams, endpoint, sep);

  var operation = mlrest.createOperation(
      'SPARQL graph query', this.client, requestOptions, 'single', 'single'
      );
  if (hasDefaultGraphs) {
    operation.defaultGraphs = defaultGraphs;
  }
  if (hasNamedGraphs) {
    operation.namedGraphs = namedGraphs;
  }
  operation.requestBody = query;
  operation.errorTransform = uriErrorTransform;

  return mlrest.startRequest(operation);
}

function graphs(client) {
  this.client = client;
}
graphs.prototype.createMergeStream = createGraphMergeStream;
graphs.prototype.createWriteStream = createGraphWriteStream;
graphs.prototype.list              = listGraphs;
graphs.prototype.merge             = mergeGraph;
graphs.prototype.probe             = probeGraph;
graphs.prototype.read              = readGraph;
graphs.prototype.remove            = removeGraph;
graphs.prototype.sparql            = queryGraphSPARQL;
graphs.prototype.write             = writeGraph;

module.exports = graphs;
