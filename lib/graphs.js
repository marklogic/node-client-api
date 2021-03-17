/*
 * Copyright (c) 2020 MarkLogic Corporation
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

var requester = require('./requester.js');
var mlutil    = require('./mlutil.js');
var Operation = require('./operation.js');
var qb        = require('./query-builder.js');
var mlutil    = require('./mlutil.js');

function uriErrorTransform(message) {
  /*jshint validthis:true */
  var operation = this;

  switch(operation.graphType) {
  case 'default': return message+' (on default graph)';
  case 'inline':  return message+' (on inline graphs)';
  case 'managed': return message+' (on managed graphs)';
  }

  var uri = operation.uri;
  if (typeof uri === 'string' || uri instanceof String) {
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

  var graphType = operation.graphType;
  switch(graphType) {
  case 'named':
    output.defaultGraph = false;
    output.graph        = operation.uri;
    break;
  case 'default':
    output.defaultGraph = true;
    output.graph        = null;
    break;
  case 'inline':
    output.defaultGraph = false;
    output.graph        = null;
    break;
  case 'managed':
    output.defaultGraph = false;
    output.graph        = null;
    break;
  }
  output.graphType = graphType;

  return output;
}
function listOutputTransform(headers, data) {
  /*jshint validthis:true */
  var operation = this;

  if (data == null) {
    return data;
  }

  if (operation.contentType == null) {
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

/**
 * Reads the triples for a graph from the server in the specified format.
 * @method graphs#read
 * @since 1.0
 * @param {string} [uri] - a graph name, which can be ommitted for the default graph
 * @param {string} contentType - the format for the graph such as application/n-quads,
 * application/n-triples, application/rdf+json, application/rdf+xml, text/n3, text/turtle,
 * or application/vnd.marklogic.triples+xml
 * @param {string} [category] - a value from the enumeration "content|metadata|permissions"
 * that specifies whether to retrieve the triple content of the graph (the default)
 * or the metadata permissions for the graph documents
 * @param {string|transactions.Transaction}  [txid] - a string
 * transaction id or Transaction object identifying an open
 * multi-statement transaction that has uncommitted triples
 * @param {DatabaseClient.Timestamp}  [timestamp] - a Timestamp object for point-in-time
 * operations.
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
  var category    = null;
  var txid        = null;
  var timestamp   = null;

  var testArg = args[0];
  if (typeof testArg === 'string' || testArg instanceof String) {
    if (argLen > 1) {
      uri = testArg;
      contentType = args[1];
    } else {
      contentType = testArg;
    }
  } else {
    var params = testArg;
    contentType = params.contentType;
    uri         = params.uri;
    category    = params.category;
    txid        = mlutil.convertTransaction(params.txid);
    timestamp   = params.timestamp;
    if (contentType == null) {
      throw new Error('named parameters must specify the content type when reading a graph');
    }
  }

  var endpoint = (uri == null) ?
      '/v1/graphs?default' : ('/v1/graphs?graph='+encodeURIComponent(uri));
  if (category !== null && category !== void 0) {
    if (typeof category === 'string' || category instanceof String) {
      endpoint += '&category='+category;
    } else {
      throw new Error('the category parameter can only be a string when reading a graph');
    }
  }
  if (txid !== null && txid !== void 0) {
    endpoint += '&txid='+mlutil.getTxidParam(txid);
  }
  if (timestamp !== null && timestamp !== void 0) {
    if (timestamp.value !== null) {
      endpoint += '&timestamp='+timestamp.value;
    }
  }

  var connectionParams = this.client.getConnectionParams();
  var requestOptions = mlutil.copyProperties(connectionParams);
  requestOptions.method = 'GET';
  requestOptions.headers = {
      'Accept': contentType
  };
  requestOptions.path = mlutil.databaseParam(connectionParams, endpoint, '&');

  var operation = new Operation(
      'read graph', this.client, requestOptions, 'empty', 'single'
      );
  if (uri === null) {
    operation.graphType = 'default';
  } else {
    operation.graphType = 'named';
    operation.uri       = uri;
  }
  operation.errorTransform = uriErrorTransform;
  operation.timestamp = (timestamp !== null) ? timestamp : null;

  return requester.startRequest(operation);
};

/**
 * Creates or replaces the triples for the specified graph.
 * @method graphs#write
 * @since 1.0
 * @param {string} [uri] - a graph name, which can be ommitted for the default graph
 * @param {string} contentType - the format for the graph such as application/n-quads,
 * application/n-triples, application/rdf+json, application/rdf+xml, text/n3, text/turtle,
 * or application/vnd.marklogic.triples+xml
 * @param {boolean} [repair] - whether to attempt to repair errors in the graph data
 * @param {object[]} [permissions] - the permissions controlling which users can read or
 * write the documents with the triples
 * @param {object|string|Buffer|ReadableStream} [data] - the graph data in the specified format
 * @param {string|transactions.Transaction}  [txid] - a string
 * transaction id or Transaction object identifying an open
 * multi-statement transaction in which to write the triples
 */
Graphs.prototype.write = function writeGraph() {
  return changeGraph.call(this, 'write', false, mlutil.asArray.apply(null, arguments));
};
/**
 * Adds the triples for the specified graph.
 * @method graphs#merge
 * @since 1.0
 * @param {string} [uri] - a graph name, which can be ommitted for the default graph
 * @param {string} contentType - the format for the graph such as application/n-quads,
 * application/n-triples, application/rdf+json, application/rdf+xml, text/n3, text/turtle,
 * or application/vnd.marklogic.triples+xml
 * @param {boolean} [repair] - whether to attempt to repair errors in the graph data
 * @param {object[]} [permissions] - the permissions controlling which users can read or
 * write the documents with the triples
 * @param {object|string|Buffer|ReadableStream} [data] - the graph data in the specified format
 * @param {string|transactions.Transaction}  [txid] - a string
 * transaction id or Transaction object identifying an open
 * multi-statement transaction in which to merge the triples
 */
Graphs.prototype.merge = function mergeGraph() {
  return changeGraph.call(this, 'merge', false, mlutil.asArray.apply(null, arguments));
};
/**
 * Creates or replaces the triples for the specified graph in incremental chunks with
 * a stream; takes the following parameters (but not a data parameter).
 * @method graphs#createWriteStream
 * @since 1.0
 * @param {string} [uri] - a graph name, which can be ommitted for the default graph
 * @param {string} contentType - the format for the graph such as application/n-quads,
 * application/n-triples, application/rdf+json, application/rdf+xml, text/n3, text/turtle,
 * or application/vnd.marklogic.triples+xml
 * @param {boolean} [repair] - whether to attempt to repair errors in the graph data
 * @param {string|transactions.Transaction}  [txid] - a string
 * transaction id or Transaction object identifying an open
 * multi-statement transaction in which to write the triples
 * @returns {WritableStream} a stream for writing the triples
 */
Graphs.prototype.createWriteStream = function createGraphWriteStream() {
  return changeGraph.call(this, 'write', true, mlutil.asArray.apply(null, arguments));
};
/**
 * Adds the triples for the specified graph in incremental chunks with
 * a stream; takes the following parameters (but not a data parameter).
 * @method graphs#createMergeStream
 * @since 1.0
 * @param {string} [uri] - a graph name, which can be omitted for the default graph
 * @param {string} contentType - the format for the graph such as application/n-quads,
 * application/n-triples, application/rdf+json, application/rdf+xml, text/n3, text/turtle,
 * or application/vnd.marklogic.triples+xml
 * @param {boolean} [repair] - whether to attempt to repair errors in the graph data
 * @param {string|transactions.Transaction}  [txid] - a string
 * transaction id or Transaction object identifying an open
 * multi-statement transaction in which to merge the triples
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
  var permissions = null;
  var data        = null;
  var txid        = null;

  if (argLen > 1 || (typeof args[0] === 'string' || args[0] instanceof String)) {
    var arg = null;
    var i = argLen - 1;
    for (; i >= 0; i--) {
      arg = args[i];
      if (typeof arg === 'boolean') {
        repair = arg;
        continue;
      }
      if (!isStreaming && (data === null)) {
        data = arg;
        continue;
      }
      if (typeof arg === 'string' || arg instanceof String) {
        if (contentType === null) {
          contentType = arg;
          continue;
        }
        if (uri === null) {
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
    permissions = params.permissions;
    data        = params.data;
    txid        = mlutil.convertTransaction(params.txid);
    var noContentType = (contentType == null);
    if (isStreaming) {
      if (noContentType) {
        throw new Error('named parameters must specify the content type for '+action);
      }
    } else {
      if (noContentType || (data == null)) {
        throw new Error('named parameters must specify the content type and data for '+action);
      }
    }
  }

  var graphType = null;
  if (uri === null || uri === void 0) {
    graphType = 'default';
  } else if (uri instanceof InlineGraphUrisDef) {
    graphType = 'inline';
  } else {
    graphType = 'named';
  }

  var sep = '?';

  var endpoint = null;
  switch(graphType) {
  case 'named':   endpoint = '/v1/graphs?graph='+encodeURIComponent(uri); sep = '&'; break;
  case 'default': endpoint = '/v1/graphs?default';                        sep = '&'; break;
  case 'inline':  endpoint = '/v1/graphs';                                           break;
  }

  if (repair === true) {
    endpoint += sep+'repair=true';
    if (sep === '?') { sep = '&'; }
  }

  if (txid !== null && txid !== void 0) {
    endpoint += sep+'txid='+mlutil.getTxidParam(txid);
    if (sep === '?') { sep = '&'; }
  }

  var permissionsParams = makePermissionsParams(permissions, sep);
  if (permissionsParams !== null) {
    endpoint += permissionsParams;
    if (sep === '?') { sep = '&'; }
  }

  var connectionParams = this.client.getConnectionParams();
  var requestOptions = mlutil.copyProperties(connectionParams);
  requestOptions.method = (action === 'write') ? 'PUT' : 'POST';
  requestOptions.headers = {
      'Content-Type': contentType
  };
  requestOptions.path = mlutil.databaseParam(connectionParams, endpoint, sep);

  var operation = new Operation(
      action+' graph', this.client, requestOptions, (isStreaming ? 'chunked' : 'single'), 'empty'
      );
  operation.graphType = graphType;
  if (graphType === 'named') {
    operation.uri = uri;
  }
  if (isStreaming) {
    operation.isReplayable = false;
  } else {
    operation.requestBody = data;
  }
  operation.outputTransform = emptyOutputTransform;
  operation.errorTransform  = uriErrorTransform;

  return requester.startRequest(operation);
}

/**
 * Removes the specified graph.
 * @method graphs#remove
 * @since 1.0
 * @param {string} [uri] - a graph name, which can be omitted for the default graph
 * @param {string|transactions.Transaction}  [txid] - a string
 * transaction id or Transaction object identifying an open
 * multi-statement transaction in which to remove the triples
 * @returns {ResultProvider} an object whose result() function takes a success callback
 * called when the triples are removed
 */
Graphs.prototype.remove = function removeGraph() {
  var args = mlutil.asArray.apply(null, arguments);

  return applyGraph.call(this, 'remove', args);
};
/**
 * Check whether the specified graph exists.
 * @method graphs#probe
 * @since 1.0
 * @param {string} [uri] - a graph name, which can be omitted for the default graph
 * @param {string|transactions.Transaction}  [txid] - a string
 * transaction id or Transaction object identifying an open
 * multi-statement transaction that has uncommitted triples
 * @returns {ResultProvider} an object whose result() function takes a success callback
 * that receives an object with an exists boolean for the graph
 */
Graphs.prototype.probe = function probeGraph() {
  var args = mlutil.asArray.apply(null, arguments);

  return applyGraph.call(this, 'probe', args);
};
/** @ignore */
function applyGraph(action, args) {
  /*jshint validthis:true */
  var uri  = null;
  var txid = null;
  switch(args.length) {
  case 0:
    break;
  case 1:
    if (typeof args[0] === 'string' || args[0] instanceof String) {
      uri  = args[0];
    } else if (args[0] instanceof mlutil.Transaction) {
      txid = mlutil.convertTransaction(args[0]);
    } else {
      uri  = args[0].uri;
      txid = mlutil.convertTransaction(args[0].txid);
    }
    break;
  default:
    uri  = args[0];
    txid = mlutil.convertTransaction(args[1]);
    break;
  }

  var endpoint  = null;
  var graphType = null;
  var sep       = null;
  if (uri === null || uri === void 0) {
    endpoint  = '/v1/graphs?default';
    graphType = 'default';
    sep       = '&';
  } else if (uri instanceof AllManagedTriplesDef) {
    if (action !== 'remove') {
      throw new Error('can only specify all managed triples for remove(), not '+action);
    }
    endpoint  = '/v1/graphs';
    graphType = 'managed';
    sep       = '?';
  } else {
    graphType = 'named';
    endpoint  = '/v1/graphs?graph='+encodeURIComponent(uri);
    sep       = '&';
  }

  if (txid !== null && txid !== void 0) {
    endpoint += sep+'txid='+mlutil.getTxidParam(txid);
    if (sep === '?') { sep = '&'; }
  }

  var connectionParams = this.client.getConnectionParams();
  var requestOptions = mlutil.copyProperties(connectionParams);
  requestOptions.method = (action === 'remove') ? 'DELETE' : 'HEAD';
  requestOptions.path = mlutil.databaseParam(connectionParams, endpoint, sep);

  var operation = new Operation(
      action+' graph', this.client, requestOptions, 'empty', 'empty'
      );
  operation.graphType = graphType;
  if (graphType === 'named') {
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
 * @since 1.0
 * @param {string} contentType - the format for the list of graphs
 * @param {string|transactions.Transaction}  [txid] - a string
 * transaction id or Transaction object identifying an open
 * multi-statement transaction that has uncommitted triples for new graphs
 * @param {DatabaseClient.Timestamp}  [timestamp] - a Timestamp object for point-in-time
 * operations.
 * @returns {ResultProvider} an object whose result() function takes
 * a success callback that receives the list of graphs stored
 * on the server
 */
Graphs.prototype.list = function listGraphs() {
  var argLen = arguments.length;

  var contentType = null;
  var txid        = null;
  var timestamp   = null;
  if (argLen > 0) {
    var arg = null;
    var i = argLen - 1;
    for (; i >= 0; i--) {
      arg = arguments[i];
      if (typeof arg === 'string' || arg instanceof String) {
        contentType = arg;
        continue;
      }
      if (arg instanceof mlutil.Transaction) {
        txid = mlutil.convertTransaction(arg);
        continue;
      }
      if (arg instanceof mlutil.Timestamp) {
        timestamp = arg;
        continue;
      }
      if (arg !== null && typeof arg === 'object') {
        contentType = arg.contentType;
        txid        = mlutil.convertTransaction(arg.txid);
        timestamp   = arg.timestamp;
        continue;
      }
      throw new Error('unknown parameter: '+arg);
    }
  }

  var noContentType = (contentType === null || contentType === void 0);

  var endpoint = '/v1/graphs';
  var sep      = '?';

  if (txid !== null && txid !== void 0) {
    endpoint += sep+'txid='+mlutil.getTxidParam(txid);
    if (sep === '?') { sep = '&'; }
  }

  if (timestamp !== null && timestamp !== void 0) {
    if (timestamp.value !== null) {
      endpoint += sep+'timestamp='+timestamp.value;
      if (sep === '?') { sep = '&'; }
    }
  }

  var connectionParams = this.client.getConnectionParams();
  var requestOptions = mlutil.copyProperties(connectionParams);
  requestOptions.method = 'GET';
  if (!noContentType) {
    requestOptions.headers = {
        'Accept': contentType
    };
  }

  requestOptions.path = mlutil.databaseParam(connectionParams, endpoint, sep);

  var operation = new Operation(
      'list graphs', this.client, requestOptions, 'empty', 'single'
      );
  if (!noContentType) {
    operation.contentType = contentType;
  }
  operation.outputTransform = listOutputTransform;
  operation.timestamp = (timestamp !== null) ? timestamp : null;

  return requester.startRequest(operation);
};

/**
 * Executes a SPARQL query against the triples for the graphs; takes a
 * configuration object with the following named parameters or, as a shortcut,
 * a contentType string, any number of default graph URIs, and a SPARQL query.
 * @method graphs#sparql
 * @since 1.0
 * @param {string} contentType - the format for the query response
 * @param {string|string[]} [defaultGraphs] - the default graphs for the SPARQL query
 * @param {string|string[]} [namedGraphs] - the named graphs for the SPARQL query
 * @param {string|ReadableStream} query - the SPARQL query
 * @param {object} [docQuery] - a {@link queryBuilder.Query} returned
 * by the query builder functions that qualifies the documents
 * supplying the triples
 * @param {number} [start] - the zero-based position
 * within the results of the first triple, which is determinate only
 * for a SELECT SPARQL query that orders the results and defaults to the first
 * @param {number} [length] - the zero-based position of the triple
 * after the last triple, which is determinate only
 * for a SELECT SPARQL query that orders the results and defaults to all triples
 * @param {string} [base] - the base URI to prepend to relative resource identifiers
 * @param {string|transactions.Transaction}  [txid] - a string
 * transaction id or Transaction object identifying an open
 * multi-statement transaction that has uncommitted triples
 * @param {string|string[]} [rulesets] - the inference rulesets applied
 * to infer additional triples for the query
 * @param {string} [defaultRulesets] - a value from the enumeration "include|exclude"
 * to specify whether to apply the default rulesets (if any) to infer additional triples
 * for the query (defaulting to "include")
 * @param {number} [optimizeLevel] - the level of effort applied by the SPARQL query
 * analyzer for optimizing the query
 * @param {object} [bindings] - the values for placeholder variables within the query
 * specified with an object whose keys are the names of the variables and whose values
 * are either primitives or objects with a type or lang key and a value key
 * @param {DatabaseClient.Timestamp}  [timestamp] - a Timestamp object for point-in-time
 * operations
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
  var acceptType    = null;
  var query         = null;

  var docQuery        = null;
  var begin           = null;
  var end             = null;
  var base            = null;
  var txid            = null;
  var rulesets        = null;
  var defaultRulesets = null;
  var optimizeLevel   = null;
  var bindings        = null;
  var timestamp       = null;

  // TODO: collection, directory?

  // Single configuration object
  if (argLen === 1) {
    var params = args[0];
    acceptType    = params.contentType;
    defaultGraphs = params.defaultGraphs;
    namedGraphs   = params.namedGraphs;
    query         = params.query;
    docQuery      = params.docQuery;
    begin         = params.begin;
    end           = params.end;

    txid            = params.txid;
    base            = params.base;
    rulesets        = params.rulesets;
    defaultRulesets = params.defaultRulesets;
    optimizeLevel   = params.optimizeLevel;
    bindings        = params.bindings;
    timestamp       = params.timestamp;
    if ((acceptType == null) || (query == null)) {
      throw new Error('named parameters must specify content type and query for SPARQL query on graphs');
    }
  }
  // Multiple params
  else {
    acceptType = args[0];
    if (argLen >= 3) {
      defaultGraphs = Array.prototype.slice.call(arguments, 1, argLen - 1);
    }
    query = args[argLen - 1];
  }

  var endpoint = '/v1/graphs/sparql';
  var sep = '?';

  var hasDefaultGraphs = (defaultGraphs !== null && defaultGraphs !== void 0);
  if (hasDefaultGraphs) {
    defaultGraphs = mlutil.asArray(defaultGraphs);
    if (defaultGraphs.length > 0) {
      endpoint += sep+encodeParamValues('default-graph-uri', defaultGraphs);
      sep = '&';
    } else {
      hasDefaultGraphs = false;
    }
  }

  var hasNamedGraphs = (namedGraphs !== null && namedGraphs !== void 0);
  if (hasNamedGraphs) {
    namedGraphs = mlutil.asArray(namedGraphs);
    if (namedGraphs.length > 0) {
      endpoint += sep+encodeParamValues('named-graph-uri', namedGraphs);
      if (sep === '?') { sep = '&'; }
    } else {
      hasNamedGraphs = false;
    }
  }

  var hasBegin = (begin !== null && begin !== void 0);
  if (hasBegin) {
    if (begin >= 0) {
      endpoint += sep+'start='+(begin + 1);
      if (sep === '?') { sep = '&'; }
    } else {
      throw new Error('begin parameter must be >= 0: ' + begin);
    }
  }
  if (end !== null && end !== void 0) {
    if (end >= 1) {
      endpoint += sep+'pageLength='+(hasBegin ? (end - begin) : end);
      if (sep === '?') { sep = '&'; }
    } else {
      throw new Error('end parameter must be >= 1: ' + end);
    }
  }

  if (timestamp !== null && timestamp !== void 0) {
    if (timestamp.value !== null) {
      endpoint += sep+'timestamp='+timestamp.value;
      if (sep === '?') { sep = '&'; }
    }
  }

  var commonParams = makeCommonSPARQLParams(
      base, txid, rulesets, defaultRulesets, optimizeLevel, bindings, sep
  );
  if (commonParams !== null) {
    endpoint += commonParams;
    if (sep === '?') { sep = '&'; }
  }

  var contentType = null;
  var queryBody   = null;
  if (docQuery === null || docQuery === void 0) {
    contentType = 'application/sparql-query';
    queryBody   = query;
  } else {
    contentType = 'application/json';
    var builtQuery =
      (docQuery instanceof qb.lib.QueryBuilder || docQuery.search !== void 0) ? docQuery :
      qb.builder.where(docQuery);
    if (builtQuery.queryType === 'qbe') {
      throw new Error('cannot qualify a SPARQL query with a Query By Example');
    }

    // Handle builtQuery as a QueryBuilder object or a combined query
    queryBody = qb.lib.makeSearchBody(builtQuery).searchBody;
    queryBody.search.sparql = query;
  }

  var connectionParams = this.client.getConnectionParams();
  var requestOptions = mlutil.copyProperties(connectionParams);
  requestOptions.method = 'POST';
  requestOptions.headers = {
      'Content-Type': contentType,
      'Accept':       acceptType
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

  operation.requestBody    = queryBody;
  operation.errorTransform = uriErrorTransform;
  operation.timestamp = (timestamp !== null) ? timestamp : null;

  return requester.startRequest(operation);
};

/**
 * Executes a SPARQL update against the graphs; takes a configuration object with
 * the following named parameters or, as a shortcut, the SPARQL update data.
 * @method graphs#sparqlUpdate
 * @since 1.0
 * @param {string|ReadableStream} data - the SPARQL update
 * @param {object[]} [permissions] - the permissions controlling which users can read or
 * write the documents with the updated triples
 * @param {string|string[]} [usingDefaultGraphs] - the default graphs for the update
 * @param {string|string[]} [usingNamedGraphs] - the named graphs for the update
 * @param {string} [base] - the base URI to prepend to relative resource identifiers
 * @param {string|transactions.Transaction}  [txid] - a string
 * transaction id or Transaction object identifying an open
 * multi-statement transaction in which to update the triples
 * @param {string|string[]} [rulesets] - the inference rulesets applied
 * to infer additional triples as part of the update
 * @param {string} [defaultRulesets] - a value from the enumeration "include|exclude"
 * to specify whether to apply the default rulesets (if any) to infer additional triples
 * for the update (defaulting to "include")
 * @param {number} [optimizeLevel] - the level of effort applied by the SPARQL query
 * analyzer for optimizing the update
 * @param {object} [bindings] - the values for placeholder variables within the update
 * specified with an object whose keys are the names of the variables and whose values
 * are either primitives or objects with a type or lang key and a value key
 * @returns {ResultProvider} an object whose result() function takes a success callback
 * called when the triples are updated
 */
Graphs.prototype.sparqlUpdate = function updateGraphSPARQL() {
  var args = mlutil.asArray.apply(null, arguments);
  var argLen = args.length;

  if (argLen === 0) {
    throw new Error('must specify data for SPARQL update on graphs');
  }

  var permissions        = null;
  var usingDefaultGraphs = null;
  var usingNamedGraphs   = null;
  var base               = null;
  var txid               = null;
  var rulesets           = null;
  var defaultRulesets    = null;
  var optimizeLevel      = null;
  var bindings           = null;

  var arg  = args[0];
  var data = (argLen === 1) ? arg.data : null;
  if (data !== null && data !== void 0) {
    permissions        = arg.permissions;
    usingDefaultGraphs = arg.usingDefaultGraphs;
    usingNamedGraphs   = arg.usingNamedGraphs;

    base               = arg.base;
    txid               = arg.txid;
    rulesets           = arg.rulesets;
    defaultRulesets    = arg.defaultRulesets;
    optimizeLevel      = arg.optimizeLevel;
    bindings           = arg.bindings;
  }
  // SPARQL request is single string argument
  else {
    data = args[0];
  }

  var endpoint = '/v1/graphs/sparql';
  var sep = '?';

  var hasUsingDefaultGraphs = (usingDefaultGraphs !== null && usingDefaultGraphs !== void 0);
  if (hasUsingDefaultGraphs) {
    usingDefaultGraphs = mlutil.asArray(usingDefaultGraphs);
    if (usingDefaultGraphs.length > 0) {
      endpoint += sep+encodeParamValues('using-graph-uri', usingDefaultGraphs);
      sep = '&';
    } else {
      hasUsingDefaultGraphs = false;
    }
  }

  var hasUsingNamedGraphs = (usingNamedGraphs !== null && usingNamedGraphs !== void 0);
  if (hasUsingNamedGraphs) {
    usingNamedGraphs = mlutil.asArray(usingNamedGraphs);
    if (usingNamedGraphs.length > 0) {
      endpoint += sep+encodeParamValues('using-named-graph-uri', usingNamedGraphs);
      if (sep === '?') { sep = '&'; }
    } else {
      hasUsingNamedGraphs = false;
    }
  }

  var permissionsParams = makePermissionsParams(permissions, sep);
  if (permissionsParams !== null) {
    endpoint += permissionsParams;
    if (sep === '?') { sep = '&'; }
  }

  var commonParams = makeCommonSPARQLParams(
      base, txid, rulesets, defaultRulesets, optimizeLevel, bindings, sep
  );
  if (commonParams !== null) {
    endpoint += commonParams;
    if (sep === '?') { sep = '&'; }
  }

  var connectionParams = this.client.getConnectionParams();
  var requestOptions = mlutil.copyProperties(connectionParams);
  requestOptions.method = 'POST';
  requestOptions.headers = {
      'Content-Type': 'application/sparql-update'
  };
  requestOptions.path = mlutil.databaseParam(connectionParams, endpoint, sep);

  var operation = new Operation(
      'SPARQL graph update', this.client, requestOptions, 'single', 'empty'
      );

  operation.requestBody     = data;
  operation.outputTransform = emptyOutputTransform;
  operation.graphType       =
	  (usingDefaultGraphs === true) ? 'default' :
	  (usingNamedGraphs === true)   ? 'named'   :
                                      'inline';
  operation.errorTransform  = uriErrorTransform;

  return requester.startRequest(operation);
};

function makePermissionsParams(permissions, sep) {
  if (permissions === null || permissions === void 0) {
    return null;
  }

  var endpoint = '';

  var permLen      = permissions.length;
  var permdef      = null;
  var roleName     = null;
  var capabilities = null;
  var capLen       = 0;
  var j            = 0;
  for (var i = 0; i < permLen; i++) {
    permdef      = permissions[i];
    roleName     = permdef['role-name'];
    capabilities = permdef.capabilities;
    capLen       = capabilities.length;
    for (j = 0; j < capLen; j++) {
      endpoint += sep+'perm:'+roleName+'='+capabilities[j];
      if (sep === '?') { sep = '&'; }
    }
  }

  return (endpoint === '') ? null : endpoint;
}
function makeCommonSPARQLParams(
    base, txidRaw, rulesets, defaultRulesets, optimizeLevel, bindings, sep
    ) {
  var endpoint = '';
  var txid = mlutil.convertTransaction(txidRaw);
  if (base !== null && base !== void 0) {
    endpoint += sep+'base='+encodeURIComponent(base);
    if (sep === '?') { sep = '&'; }
  }
  if (txid !== null && txid !== void 0) {
    endpoint += sep+'txid='+mlutil.getTxidParam(txid);
    if (sep === '?') { sep = '&'; }
  }
  if (rulesets !== null && rulesets !== void 0) {
    endpoint += sep+encodeParamValues('ruleset', rulesets);
    if (sep === '?') { sep = '&'; }
  }
  if (defaultRulesets !== null && defaultRulesets !== void 0) {
    endpoint += sep+'default-rulesets='+defaultRulesets;
    if (sep === '?') { sep = '&'; }
  }
  if (optimizeLevel !== null && optimizeLevel !== void 0) {
    endpoint += sep+'optimize='+optimizeLevel;
    if (sep === '?') { sep = '&'; }
  }
  if (bindings !== null && bindings !== void 0) {
    endpoint += mlutil.makeBindingsParams(bindings, sep);
  }

  return (endpoint === '') ? null : endpoint;
}
function encodeParamValues(name, values) {
  if (Array.isArray(values)) {
    var result = null;
    var max = values.length;
	for (var i=0; i < max; i++) {
	  if (i === 0) {
        result = encodeURIComponent(name)+'='+encodeURIComponent(values[i]);
	  } else {
        result += '&'+encodeURIComponent(name)+'='+encodeURIComponent(values[i]);
	  }
	}
	return result;
  } else {
    return encodeURIComponent(name)+'='+encodeURIComponent(values);
  }
}

/**
 * Declares that the graph uris are specified inline within quads
 * (instead of as triples for the default graph).
 */
Graphs.prototype.inlineGraphUris = function inlineGraphUris() {
  return new InlineGraphUrisDef();
};
function InlineGraphUrisDef() {
  if (!(this instanceof InlineGraphUrisDef)) {
    return new InlineGraphUrisDef();
  }
}

/**
 * Specifies that the remove operation should delete all managed triples
 * (instead of all triples for the default graph).
 */
Graphs.prototype.allManagedTriples = function allManagedTriples() {
  return new AllManagedTriplesDef();
};
function AllManagedTriplesDef() {
  if (!(this instanceof AllManagedTriplesDef)) {
    return new AllManagedTriplesDef();
  }
}

module.exports = Graphs;
