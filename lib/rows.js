
/*
 * Copyright 2014-2017 MarkLogic Corporation
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
 * on indexed values and documents in the database. You define an
 * operation by constructing a plan with a {@link planBuilder}; data
 * is returned as row sets.
 * @namespace rows
 */

/**
 * Specifies how an Optic plan is executed, the formatting of the results
 * returned, and variable bindings.
 * @typedef {object} rows.RowsOptions
 * @since 2.1.1
 * @property {string} [format] - format of the returned results. Possible
 * values: 'json'|'xml'|'csv'. Default: 'json'.
 * @property {string} [structure] - structure of the output. Possible values:
 * 'object'|'array'. Default: 'object'.
 * @property {string} [columnTypes] - whether to emit column data types on
 * each row or only the column name header. Possible values: 'rows'|'header'.
 * Default: 'rows'.
 * @property {string} [complexValues] - whether array, binary, element, object,
 * and text node columns should be serialized inline or as a reference to a
 * separate response part. Possible values: 'inline'|'reference'. Default:
 * 'inline'. Only relevant when results are delivered as an JSON object stream.
 * @property {object} [bindings] - values for placeholder variables within the
 * query plan. You define them with an object whose keys are the names of the
 * variables and whose values are either primitives or objects with a type or
 * lang key and a value key. Bindings are handled the same way as with
 * graphs#sparql and graphs#sparqlUpdate.
 */

/**
 * Executes a plan built by a {@link planBuilder} and returns a promise. A
 * plan enables you to query data using where, groupBy, orderBy, union, join,
 * and other relationships. You can specify that results be returned in
 * different formats.
 * @method rows#query
 * @since 2.1.1
 * @param {object} builtPlan  - {@link planBuilder} object or a built
 * plan defined as a JSON object.
 * @param {RowsOptions} options - options that control how the plan is
 * executed and the results returned.
 * @returns {Promise} A promise.
 */
Rows.prototype.query = function queryRows() {
  let args = mlutil.asArray.apply(null, arguments);

  if (args.length < 1) {
    throw new Error('built plan required');
  }

  let builtPlan = args[0],
      options = (args.length === 2) ? args[1] : null;

  return queryRowsImpl.call(this, builtPlan, null, options);
};
function queryRowsImpl(builtPlan, streamType, options) {
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
      complexValues = null;

  options = options || {};

  if (streamType !== null && !(validStreamTypes.indexOf(streamType) >= 0)) {
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
  }

  let endpoint = '/v1/rows';

  if (options.bindings) {
    endpoint += mlutil.makeBindingsParams(options.bindings, sep);
  }

  const connectionParams = this.client.connectionParams;
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
    'Content-Type': 'application/json',
    'Accept': acceptHeader
  };

  requestOptions.path = endpoint;

  const operation = new Operation(
    'query rows', this.client, requestOptions, 'single', responseType
  );
  operation.validStatusCodes  = [200, 404];
  operation.complexValues  = complexValues;
  // Built plan can be PlanBuilder object or JSON string
  if (builtPlan instanceof planBuilder.Plan) {
    operation.requestBody = JSON.stringify(builtPlan.export());
  } else {
    operation.requestBody = builtPlan;
  }

  const responseSelector = requester.startRequest(operation);

  if (streamType !== null) {
    return responseSelector.stream(streamType);
  } else {
    return responseSelector.result();
  }

}

/**
 * Executes a plan built by a {@link planBuilder} and returns a stream. A
 * plan enables you to query data using where, groupBy, orderBy, union, join,
 * and other relationships. You can specify that results be returned in
 * different formats.
 * @method rows#queryAsStream
 * @since 2.1.1
 * @param {object} builtPlan A {@link planBuilder} object or a built
 * plan defined as a JSON object.
 * @param {string} streamType - type of stream. Possible values: 'chunked'|
 * 'object'|'sequence'. Default: 'chunked'.
 * @param {RowsOptions} options - options that control how the plan is
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

  return queryRowsImpl.call(this, builtPlan, streamType, options);
};

/**
 * Returns a representation of the execution plan.
 * @method rows#explain
 * @since 2.1.1
 * @param {object} builtPlan A {@link planBuilder} object or a built
 * plan as a JSON object.
 * @param {string} [format] The format of the returned representation:
 * 'json'|'xml'. The default is 'json'.
 * @returns {Promise} A promise whose success callback receives the
 * representation as JSON or XML.
 */
Rows.prototype.explain = function explainRows(builtPlan, format) {

  const connectionParams = this.client.connectionParams;
  const requestOptions = mlutil.copyProperties(connectionParams);
  requestOptions.method = 'POST';
  const validFormats = ['json','xml','csv'];
  let acceptHeader = 'application/json'; // default
  if (format !== null && format !== void 0) {
    if (validFormats.indexOf(format) >= 0) {
      acceptHeader = 'application/' + format;
    } else {
      throw new Error('invalid explain format "' + format + '"');
    }
  }
  requestOptions.headers = {
      'Content-Type': 'application/json',
      'Accept': acceptHeader
  };

  requestOptions.path = '/v1/rows?output=explain';

  const operation = new Operation(
        'explain rows', this.client, requestOptions, 'single', 'single');
  operation.validStatusCodes  = [200, 404];
  // Built plan can be PlanBuilder object or JSON string
  if (builtPlan instanceof planBuilder.Plan) {
    operation.requestBody = JSON.stringify(builtPlan.export());
  } else {
    operation.requestBody = builtPlan;
  }

  const responseSelector = requester.startRequest(operation);
  return responseSelector.result();
}

module.exports = Rows;
