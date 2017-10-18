
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
 * Executes an execution plan built by a {@link planBuilder}. A plan
 * enables you to query data using where, groupBy, orderBy, union, join,
 * and other relationships familiar to users of SQL. You can specify that
 * results be returned in different formats. See [link to plan-builder]
 * for details.
 * @method rows#query
 * @since 2.1.1
 * @param {object} builtPlan A {@link planBuilder} object or a built
 * plan defined as a JSON object.
 * @param {object} options Options that control how the plan is executed
 * and the results returned.
 * @param {string} [options.format] The format of the returned results:
 * 'json'|'xml'. The default is 'json'.
 * @param {string} [options.structure] The structure of the output.
 * Possible values: 'object'|'array'. Default: 'object'.
 * @param {string} [options.columnTypes] Whether to emit column
 * data types on each row (default) or only the column name header:
 * 'rows'|'header'. The default is 'rows'.
 * @param {string} [options.complexValues] TODO Node columns setting.
 * @param {object} [options.bindings] The values for placeholder variables
 * within the query plan. You define them with an object whose keys are
 * the names of the variables and whose values are either primitives or
 * objects with a type or lang key and a value key.
 * @returns {Promise} A promise.
 */
Rows.prototype.query = function queryRows(builtPlan, options) {
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
 * Executes an execution plan built by a {@link planBuilder}. A plan
 * enables you to query data using where, groupBy, orderBy, union, join,
 * and other relationships familiar to users of SQL. You can specify that
 * results be returned in different formats. See [link to plan-builder]
 * for details.
 * @method rows#queryAsStream
 * @since 2.1.1
 * @param {object} builtPlan A {@link planBuilder} object or a built
 * plan defined as a JSON object.
 * @param {string} streamType TODO Stream type.
 * @param {object} options Options that control how the plan is executed
 * and the results returned.
 * @param {string} [options.format] The format of the returned results:
 * 'json'|'xml'. The default is 'json'.
 * @param {string} [options.structure] The structure of the output.
 * Possible values: 'object'|'array'. Default: 'object'.
 * @param {string} [options.columnTypes] Whether to emit column
 * data types on each row (default) or only the column name header:
 * 'rows'|'header'. The default is 'rows'.
 * @param {string} [options.nodeColumns] TODO Node columns setting.
 * @param {object} [options.bindings] The values for placeholder variables
 * within the query plan. You define them with an object whose keys are
 * the names of the variables and whose values are either primitives or
 * objects with a type or lang key and a value key.
 * @returns {ReadableStream} A readable stream.
 */
Rows.prototype.queryAsStream = function queryAsStreamRows(builtPlan, streamType, options) {
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
