
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


const requester    = require('./requester.js'),
      mlutil       = require('./mlutil.js'),
      Operation    = require('./operation.js'),
      planBuilder  = require('./plan-builder.js');

/** @ignore */
function Rows(client) {
  this.client = client;
}

/**
 * Provides functions for performing SQL-like, relational operations
 * on MarkLogic data. Enables you to retrieve document data as rows
 * by executing a plan constructed by a {@link planBuilder}.
 * @namespace rows
 */

/**
 * Specifies how a {@link planBuilder} plan is executed, the formatting
 * of the results returned, and variable bindings.
 * @typedef {object} rows.RowsOptions
 * @since 2.1.1
 * @property {string} [format] - Format of the returned results. Possible
 * values: 'json'|'xml'|'csv'. Default: 'json'.
 * @property {string} [structure] - Structure of the output. Possible values:
 * 'object'|'array'. Default: 'object'.
 * @property {string} [columnTypes] - Whether to emit column data types on
 * each row or only the column name header. Possible values: 'rows'|'header'.
 * Default: 'rows'.
 * @property {string} [complexValues] - Whether complex array, binary, element,
 * object, and text node columns should be serialized inline or as a reference
 * to a separate response part. Possible values: 'inline'|'reference'. Default:
 * 'inline'. Only relevant when results are delivered as an JSON object stream.
 * @property {object} [bindings] - Values for placeholder variables within the
 * query plan. You define them with an object whose keys are the names of the
 * variables and whose values are either primitives or objects with a type or
 * lang key and a value key. Bindings are handled the same way as with
 * graphs#sparql and graphs#sparqlUpdate.
 * @property {DatabaseClient.Timestamp}  [timestamp] - A Timestamp object for
 * point-in-time operations.
 * @property {string} [queryType] - The type of a string query submitted for
 * execution. Possible values: 'json'|'sparql'|'sql'|'dsl'. Default: 'json'.
 */

/**
 * Executes a plan built by a {@link planBuilder} and returns a promise data
 * structure.
 * @method rows#query
 * @since 2.1.1
 * @param {object} builtPlan  - A {@link planBuilder} object or a built
 * plan defined as a JSON object.
 * @param {RowsOptions} options - Options that control how the plan is
 * executed and the results returned.
 * @returns {Promise} A Promise.
 */
Rows.prototype.query = function queryRows() {
  let args = mlutil.asArray.apply(null, arguments);

  if (args.length < 1) {
    throw new Error('built plan required');
  }

  let builtPlan = args[0],
      options = (args.length === 2) ? args[1] : null;

  return queryRowsImpl(this, builtPlan, null, options);
};
function queryRowsImpl(self, builtPlan, streamType, options) {
  let sep = '?',
      validFormats = ['json','xml','csv'],
      validStructures = ['object','array'],
      validColumnTypes = ['rows','header'],
      validComplexValues = ['inline','reference'],
      validStreamTypes = ['chunked','object','sequence'],
      // set defaults
      format = 'json',
      structure = 'object',
      columnTypes = 'rows',
      complexValues = null,
      timestamp = null;

  options = options || {};

  if (streamType !== null && validStreamTypes.indexOf(streamType) < 0) {
    throw new Error('invalid stream type "' + options.streamType + '"');
  }

  if (options.format !== null && options.format !== void 0) {
    if (validFormats.indexOf(options.format) >= 0) {
      format = options.format;
    } else {
      throw new Error('invalid row format "' + options.format + '"');
    }
  }

  if (options.structure !== null && options.structure !== void 0) {
    if (validStructures.indexOf(options.structure) >= 0) {
      structure = options.structure;
    } else {
      throw new Error('invalid row structure "' + options.structure + '"');
    }
  }

  if (options.columnTypes !== null && options.columnTypes !== void 0) {
    if (validColumnTypes.indexOf(options.columnTypes) >= 0) {
      columnTypes = options.columnTypes;
    } else {
      throw new Error('invalid column types "' + options.columnTypes + '"');
    }
  }

  if (options.complexValues !== null && options.complexValues !== void 0) {
    if (validComplexValues.indexOf(options.complexValues) >= 0) {
      complexValues = options.complexValues;
    } else {
      throw new Error('invalid node columns "' + options.complexValues + '"');
    }
    if(complexValues === 'reference' && streamType === 'chunked') {
      throw new Error('complexValue cannot be reference when streamType is chunked');
    }
  }

  if (options.timestamp !== null && options.timestamp !== void 0) {
    if (!(timestamp instanceof mlutil.Timestamp)) {
      timestamp = options.timestamp;
    } else {
      throw new Error('invalid timestamp');
    }
  }

  const contentTypeHeader = queryContentType(builtPlan, options.queryType);

  let endpoint = '/v1/rows';

  if (options.bindings) {
    endpoint += mlutil.makeBindingsParams(options.bindings, sep);
    if (sep === '?') { sep = '&'; }
  }

  const connectionParams = self.client.getConnectionParams();
  const requestOptions = mlutil.copyProperties(connectionParams);
  requestOptions.method = 'POST';

  let acceptHeader = null;
  let responseType = null;
  switch (format) {
    case 'xml':
      acceptHeader = 'application/xml';
      responseType = 'single';
      endpoint += sep + 'output=' + structure + '&column-types=' + columnTypes;
      break;
    case 'csv':
      acceptHeader = 'text/csv';
      responseType = 'single';
      endpoint += sep + 'output=' + structure + '&column-types=header';
      if (sep === '?') { sep = '&'; }
      break;
    default:
      if (streamType !== null && streamType === 'sequence'){
        acceptHeader = 'application/json-seq';
        responseType = 'single';
      } else if (streamType !== null && streamType === 'object'){
        if (complexValues === 'reference') {
          acceptHeader = 'multipart/mixed; boundary=' + mlutil.multipartBoundary;
          responseType = 'multipart';
        } else {
          acceptHeader = 'application/json-seq';
          responseType = 'single';
        }
      }
      // Chunked stream, promise
      else {
        acceptHeader = 'application/json';
        responseType = 'single';
      }
      endpoint += sep + 'output=' + structure + '&column-types=' + columnTypes;
      if (sep === '?') { sep = '&'; }
      endpoint += (complexValues === 'reference') ? sep + 'node-columns=reference' : '';
      break;
  }
  requestOptions.headers = {
    'Content-Type': contentTypeHeader,
    'Accept': acceptHeader
  };

  if (timestamp !== null) {
    if (timestamp.value !== null) {
      endpoint += sep + 'timestamp='+timestamp.value;
      if (sep === '?') { sep = '&'; }
    }
  }

  // Specify database if defined in client connection
  requestOptions.path = mlutil.databaseParam(connectionParams, endpoint, '&');

  const operation = new Operation(
    'query rows', self.client, requestOptions, 'single', responseType
  );
  operation.validStatusCodes  = [200, 404];
  operation.complexValues  = complexValues;
  // Built plan can be PlanBuilder object or JSON string
  if (builtPlan instanceof planBuilder.Plan) {
    operation.requestBody = JSON.stringify(builtPlan.export());
  } else {
    operation.requestBody = builtPlan;
  }
  operation.timestamp = (timestamp !== null) ? timestamp : null;

  const responseSelector = requester.startRequest(operation);

  if (streamType !== null) {
    return responseSelector.stream(streamType);
  } else {
    return responseSelector.result();
  }
}

function queryContentType(builtPlan, queryType) {
  const defaultContentType = 'application/json';
  if (queryType === void 0 || queryType === null) {
    return defaultContentType;
  }

  const validQueryTypes = ['json', 'sparql', 'sql', 'dsl'];
  if (validQueryTypes.indexOf(queryType) < 0) {
    throw new Error('invalid queryType "' + queryType + '"');
  } else if (queryType != 'json' && typeof builtPlan != 'string' && !(builtPlan instanceof String)) {
    throw new Error('queryType "' + queryType + '" must be provided as string');
  }

  switch(queryType) {
    case 'json':   return defaultContentType;
    case 'sql':    return 'application/sql';
    case 'sparql': return 'application/sparql-query';
    case 'dsl':    return 'application/vnd.marklogic.querydsl+javascript';
    default:       throw new Error('unknown queryType "' + queryType + '"');
  }
}

/**
 * Executes a plan built by a {@link planBuilder} and returns a readable
 * stream data structure.
 * @method rows#queryAsStream
 * @since 2.1.1
 * @param {object} builtPlan  - A {@link planBuilder} object or a built
 * plan defined as a JSON object.
 * @param {string} streamType - Type of stream. Possible values: 'chunked'|
 * 'object'|'sequence'. Default: 'chunked'.
 * @param {RowsOptions} options - Options that control how the plan is
 * executed and the results returned.
 * @returns {ReadableStream} A readable stream.
 */
Rows.prototype.queryAsStream = function queryAsStreamRows() {
  let args = mlutil.asArray.apply(null, arguments),
      streamType = 'chunked', // default
      options = null;

  if (args.length < 1) {
    throw new Error('built plan required');
  }

  let builtPlan = args[0];

  if (args.length === 2) {
    if (typeof args[1] === 'string' || args[1] instanceof String) {
      streamType = args[1];
    } else {
      options = args[1];
    }
  } else if (args.length > 2) {
      streamType = args[1];
      options = args[2];
  }

  return queryRowsImpl(this, builtPlan, streamType, options);
};

/**
 * Returns an explanation of an execution plan as a promise.
 * @method rows#explain
 * @since 2.1.1
 * @param {object} builtPlan - A {@link planBuilder} object or a built
 * plan as a JSON object.
 * @param {string} [format] - The format of the returned representation:
 * 'json'|'xml'. The default is 'json'.
 * @param {string} [queryType] - The type of a string query submitted for
 * explanation. Possible values: 'json'|'sparql'|'sql'|'dsl'. Default: 'json'.
 * @returns {Promise} A promise whose success callback receives the
 * explanation as JSON or XML.
 */
Rows.prototype.explain = function explainRows(builtPlan, format, queryType) {
  const connectionParams = this.client.getConnectionParams();
  const requestOptions = mlutil.copyProperties(connectionParams);
  requestOptions.method = 'POST';

  const validFormats = ['json','xml'];

  let acceptHeader = 'application/json'; // default
  if (format !== null && format !== void 0) {
    if (validFormats.indexOf(format) >= 0) {
      acceptHeader = 'application/' + format;
    } else {
      throw new Error('invalid explain format "' + format + '"');
    }
  }

  const contentTypeHeader = queryContentType(builtPlan, queryType);

  requestOptions.headers = {
      'Content-Type': contentTypeHeader,
      'Accept': acceptHeader
  };

  requestOptions.path = '/v1/rows?output=explain';

  const operation = new Operation(
        'explain rows', this.client, requestOptions, 'single', 'single');
  operation.validStatusCodes  = [200];
  // Built plan can be PlanBuilder object or JSON string
  if (builtPlan instanceof planBuilder.Plan) {
    operation.requestBody = JSON.stringify(builtPlan.export());
  } else {
    operation.requestBody = builtPlan;
  }

  const responseSelector = requester.startRequest(operation);
  return responseSelector.result();
};

/**
 * Generates the view of an execution plan as a promise.
 * @method rows#generateView
 * @since 2.7.0
 * @param {object} builtPlan - A {@link planBuilder} object or a built
 * plan as an XML object.
 * @param {string} [schema] - The schema of the query.
 * @param {string} [view] - View of the query.
 * @param {string} [queryType] - The type of a string query submitted for execution.
 * @returns {Promise} A promise whose success callback receives the explanation as an XML.
 */
Rows.prototype.generateView = function generateViewRows(builtPlan, schema, view, queryType) {
  const connectionParams = this.client.getConnectionParams();
  const requestOptions = mlutil.copyProperties(connectionParams);
  requestOptions.method = 'POST';

  if(schema == null || schema.length ===0) {
    throw new Error('schema cannot be null or empty');
  }
  if(view == null || view.length ===0) {
    throw new Error('view cannot be null or empty');
  }

  let acceptHeader = 'application/xml';

  const contentTypeHeader = queryContentType(builtPlan, queryType);

  requestOptions.headers = {
    'Content-Type': contentTypeHeader,
    'Accept': acceptHeader
  };

  const endpoint = '/v1/rows?output=generateView&schemaName='+schema+'&viewName='+view;
  requestOptions.path    = mlutil.databaseParam(connectionParams, endpoint, '&');


  const operation = new Operation(
      'generate view', this.client, requestOptions, 'single', 'single');
  operation.validStatusCodes  = [200];
  // Built plan can be PlanBuilder object or JSON string
  if (builtPlan instanceof planBuilder.Plan) {
    operation.requestBody = JSON.stringify(builtPlan.export());
  } else {
    operation.requestBody = builtPlan;
  }

  const responseSelector = requester.startRequest(operation);
  return responseSelector.result();
};

module.exports = Rows;
