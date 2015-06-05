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

function uriErrorTransform(message) {
  /*jshint validthis:true */
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
function checkOutputTransform(headers, data) {
  /*jshint validthis:true */
  var operation = this;

  var statusCode = operation.responseStatusCode;
  var exists     = (statusCode === 200) ? true : false;

  var output = exists ? operation.responseHeaders : {};
  output.exists = exists;

  return identifyOutput.call(operation, data, output);
}
function emptyOutputTransform(headers, data) {
  /*jshint validthis:true */
  return identifyOutput.call(this, data, {});
}
function identifyOutput(data, output) {
  /*jshint validthis:true */
  var operation = this;

  var isDefault = (operation.isDefault === true);

  output.defaultGraph = isDefault;
  output.graph        = (isDefault ? null : operation.uri);

  return output;
}
function listOutputTransform(headers, data) {
  /*jshint validthis:true */
  var operation = this;

  if (valcheck.isNullOrUndefined(data)) {
    return data;
  }

  if (valcheck.isNullOrUndefined(operation.contentType)) {
    return data.split(/\s+/).filter(function collectionListFilter(collection) {
      return collection !== '';
    });
  }

  return data;
}

function Graphs(client) {
  if (!(this instanceof Graphs)) {
    return new Graphs(client);
  }
  this.client = client;
}

/**
 * Provides functions read, write, merge, remove, list, or query
 * with SPARQL on triple graphs. 
 * @namespace graphs
 */

// TODO: flip the order of the uri and contentType parameters
/**
 * Reads the triples for a graph from the server in the specified format.
 * @method graphs#read
 * @param {string} [uri] - a graph name, which can be ommitted for the default graph
 * @param {string} contentType - the format for the graph such as application/n-quads,
 * application/n-triples, application/rdf+json, application/rdf+xml, text/n3, text/turtle,
 * or application/vnd.marklogic.triples+xml
 * @returns {ResultProvider} an object whose stream() function returns a read stream
 * that receives the triples for the graph in the requested format
 */
Graphs.prototype.read = function readGraph() {
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

  var operation = new Operation(
      'read graph', this.client, requestOptions, 'empty', 'single'
      );
  if (valcheck.isNull(uri)) {
    operation.isDefault = true;
  } else {
    operation.uri = uri;
  }
  operation.errorTransform = uriErrorTransform;

  return requester.startRequest(operation);
};

//TODO: flip the order of the uri and contentType parameters
/**
 * Creates or replaces the triples for the specified graph.
 * @method graphs#write
 * @param {string} [uri] - a graph name, which can be ommitted for the default graph
 * @param {string} contentType - the format for the graph such as application/n-quads,
 * application/n-triples, application/rdf+json, application/rdf+xml, text/n3, text/turtle,
 * or application/vnd.marklogic.triples+xml
 * @param {boolean} [repair] - whether to attempt to repair errors in the graph data
 * @param {object|string|Buffer|ReadableStream} [data] - the graph data in the specified format
 */
Graphs.prototype.write = function writeGraph() {
  return changeGraph.call(this, 'write', false, mlutil.asArray.apply(null, arguments));
};
/**
 * Adds the triples for the specified graph.
 * @method graphs#write
 * @param {string} [uri] - a graph name, which can be ommitted for the default graph
 * @param {string} contentType - the format for the graph such as application/n-quads,
 * application/n-triples, application/rdf+json, application/rdf+xml, text/n3, text/turtle,
 * or application/vnd.marklogic.triples+xml
 * @param {boolean} [repair] - whether to attempt to repair errors in the graph data
 * @param {object|string|Buffer|ReadableStream} [data] - the graph data in the specified format
 */
Graphs.prototype.merge = function mergeGraph() {
  return changeGraph.call(this, 'merge', false, mlutil.asArray.apply(null, arguments));
};
/**
 * Creates or replaces the triples for the specified graph in incremental chunks with
 * a stream; takes the following parameters (but not a data parameter).
 * @method graphs#createWriteStream
 * @param {string} [uri] - a graph name, which can be ommitted for the default graph
 * @param {string} contentType - the format for the graph such as application/n-quads,
 * application/n-triples, application/rdf+json, application/rdf+xml, text/n3, text/turtle,
 * or application/vnd.marklogic.triples+xml
 * @param {boolean} [repair] - whether to attempt to repair errors in the graph data
 * @returns {WritableStream} a stream for writing the triples
 */
Graphs.prototype.createWriteStream = function createGraphWriteStream() {
  return changeGraph.call(this, 'write', true, mlutil.asArray.apply(null, arguments));
};
/**
 * Adds the triples for the specified graph in incremental chunks with
 * a stream; takes the following parameters (but not a data parameter).
 * @method graphs#createMergeStream
 * @param {string} [uri] - a graph name, which can be omitted for the default graph
 * @param {string} contentType - the format for the graph such as application/n-quads,
 * application/n-triples, application/rdf+json, application/rdf+xml, text/n3, text/turtle,
 * or application/vnd.marklogic.triples+xml
 * @param {boolean} [repair] - whether to attempt to repair errors in the graph data
 * @returns {WritableStream} a stream for writing the triples
 */
Graphs.prototype.createMergeStream = function createGraphMergeStream() {
  return changeGraph.call(this, 'merge', true, mlutil.asArray.apply(null, arguments));
};
/** @ignore */
function changeGraph(action, isStreaming, args) {
  /*jshint validthis:true */
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
  var data        = null;

  if (argLen > 1 || valcheck.isString(args[0])) {
    var arg = null;
    var i = argLen - 1;
    for (; i >= 0; i--) {
      arg = args[i];
      if (valcheck.isBoolean(arg)) {
        repair = arg;
        continue;
      }
      if (!isStreaming && valcheck.isNull(data)) {
        data = arg;
        continue;
      }
      if (valcheck.isString(arg)) {
        if (valcheck.isNull(contentType)) {
          contentType = arg;
          continue;
        }
        if (valcheck.isNull(uri)) {
          uri = arg;
          continue;
        }
      }
      throw new Error('unknown positional parameter for graphs write: '+arg);
    }
  } else {
    var params = args[0];
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
  }

  var isDefault = valcheck.isNullOrUndefined(uri);

  var endpoint = isDefault ? 
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

  var operation = new Operation(
      action+' graph', this.client, requestOptions, (isStreaming ? 'chunked' : 'single'), 'empty'
      );
  if (isDefault) {
    operation.isDefault = true;
  } else {
    operation.uri = uri;
  }
  if (!isStreaming) {
    operation.requestBody = data;
  }
  operation.outputTransform = emptyOutputTransform;
  operation.errorTransform  = uriErrorTransform;

  return requester.startRequest(operation);
}

/**
 * Removes the specified graph.
 * @method graphs#remove
 * @param {string} [uri] - a graph name, which can be omitted for the default graph
 */
Graphs.prototype.remove = function removeGraph() {
  return applyGraph.call(this, 'remove', (arguments.length > 0) ? arguments[0] : null);
};
/**
 * Check whether the specified graph exists.
 * @method graphs#probe
 * @param {string} [uri] - a graph name, which can be omitted for the default graph
 * @returns {ResultProvider} an object whose result() function takes a success callback
 * that receives an object with an exists boolean for the graph.
 */
Graphs.prototype.probe = function probeGraph() {
  return applyGraph.call(this, 'probe', (arguments.length > 0) ? arguments[0] : null);
};
/** @ignore */
function applyGraph(action, uri) {
  /*jshint validthis:true */
  var endpoint = valcheck.isNull(uri) ? '/v1/graphs?default' : encodeURI('/v1/graphs?graph='+uri);

  var connectionParams = this.client.connectionParams;
  var requestOptions = mlutil.copyProperties(connectionParams);
  requestOptions.method = (action === 'remove') ? 'DELETE' : 'HEAD';
  requestOptions.path = mlutil.databaseParam(connectionParams, endpoint, '&');
  
  var operation = new Operation(
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

  return requester.startRequest(operation);
}

/**
 * Lists the graphs stored on the server.
 * @method graphs#list
 * @param {string} contentType - the format for the list of graphs
 * @returns {ResultProvider} an object whose result() function takes
 * a success callback that receives the list of graphs stored
 * on the server
 */
Graphs.prototype.list = function listGraphs() {
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
  
  var operation = new Operation(
      'list graphs', this.client, requestOptions, 'empty', 'single'
      );
  if (!noContentType) {
    operation.contentType = contentType;
  }
  operation.outputTransform = listOutputTransform;

  return requester.startRequest(operation);
};

/**
 * Executes a SPARQL query against the triples for the graphs; takes a 
 * configuration object with the following named parameters or, as a shortcut,
 * a contentType string, any number of default graph URIs, and a SPARQL query.
 * @method graphs#sparql
 * @param {string} contentType - the format for the query response
 * @param {string|string[]} [defaultGraphs] - the default graphs for the SPARQL query
 * @param {string|string[]} [namedGraphs] - the named graphs for the SPARQL query
 * @param {string|ReadableStream} query - the SPARQL query
 * @returns {ResultProvider} an object whose stream() function returns a read stream
 * that receives the query response
 */
Graphs.prototype.sparql = function queryGraphSPARQL() {
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

  var operation = new Operation(
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

  return requester.startRequest(operation);
};

module.exports = Graphs;
