
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

/** @ignore */
function queryOutputTransform(headers, data) {
  /*jshint validthis:true */
  return data.content;
}

/**
 * Executes an execution plan built by a {@link planBuilder}. A plan
 * enables you to query data using where, groupBy, orderBy, union, join,
 * and other relationships familiar to users of SQL. You can specify that
 * results be returned in different formats.
 * @method rows#query
 * @since 2.1.1
 * @param {object} builtPlan A {@link planBuilder} object or a built
 * plan defined as a JSON object.
 * @param {object} options Options that control how the plan is executed
 * and the results returned.
 * @param {string} [options.format] The format of the returned results:
 * 'json'|'xml'. The default is 'json'.
 * @param {string} [options.columnTypes] Whether to emit column
 * data types on each row (default) or only the column name header:
 * 'rows'|'header'. The default is 'rows'.
 * @param {object} [options.bindings] The values for placeholder variables
 * within the query plan. You define them with an object whose keys are
 * the names of the variables and whose values are either primitives or
 * objects with a type or lang key and a value key.
 * @returns {ResultProvider} an object whose result() function takes
 * a {@link rows#resultList} success callback.
 */
Rows.prototype.query = function queryRows(builtPlan, options) {
  let sep = '?',
      validFormats = ['json','xml'],
      validColumnTypes = ['rows','header'],
      // set defaults
      format = 'json',
      columnTypes = 'rows';

  if (options.format !== null && options.format !== void 0) {
    if (validFormats.indexOf(options.format) >= 0) {
      format = options.format;
    } else {
      throw new Error('invalid rows format "' + options.format + '"');
    }
  }

  if (options.columnTypes !== null && options.columnTypes !== void 0) {
    if (validColumnTypes.indexOf(options.columnTypes) >= 0) {
      columnTypes = options.columnTypes;
    } else {
      throw new Error('invalid column types "' + options.columnTypes + '"');
    }
  }

  let endpoint = '/v1/rows';

  if (options.bindings) {
    endpoint += mlutil.makeBindingsParams(options.bindings, sep);
  }

  const connectionParams = this.client.connectionParams;
  const requestOptions = mlutil.copyProperties(connectionParams);
  requestOptions.method = 'POST';
  requestOptions.headers = {
      'Content-Type': 'application/json',
      //'Accept': 'multipart/mixed; boundary=' + mlutil.multipartBoundary
      'Accept': 'application/json-seq'
  };

  switch (format) {
    case 'xml':
      endpoint += sep + 'row-format=xml';
      if (sep === '?') { sep = '&'; }
      break;
    default:
      endpoint += sep + 'output=object&column-types=' + columnTypes;
      if (sep === '?') { sep = '&'; }
      break;
  }

  requestOptions.path = endpoint;

  const operation = new Operation(
    'query rows', this.client, requestOptions, 'single', 'multipart'
  );
  operation.validStatusCodes  = [200, 404];
  // Built plan can be PlanBuilder object or JSON string
  if (builtPlan instanceof planBuilder.Plan) {
    operation.requestBody = JSON.stringify(builtPlan.export());
  } else {
    operation.requestBody = builtPlan;
  }

  operation.outputTransform = queryOutputTransform;

  return requester.startRequest(operation);
}

/**
 * Returns a representation of the execution plan.
 * @method rows#explain
 * @since 2.1.1
 * @param {object} builtPlan A {@link planBuilder} object or a built
 * plan as a JSON object.
 * @param {object} options Options that control how the plan is executed
 * and the results returned.
 * @param {string} [options.format] The format of the returned
 * representation: 'json'|'xml'. The default is 'json'.
 * @returns {ResultProvider} an object whose result() function takes
 * a {@link rows#resultList} success callback.
 */
Rows.prototype.explain = function explainRows(builtPlan, options) {

  const connectionParams = this.client.connectionParams;
  const requestOptions = mlutil.copyProperties(connectionParams);
  requestOptions.method = 'POST';
  const validFormats = ['json','xml'];
  let acceptHeader = 'application/json'; // default
  if (options.format !== null && options.format !== void 0) {
    if (validFormats.indexOf(options.format) >= 0) {
      acceptHeader = 'application/' + options.format;
    } else {
      throw new Error('invalid explain format "' + options.format + '"');
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
  // TODO handle builtPlan as object
  operation.requestBody = builtPlan.toString();

  return requester.startRequest(operation);
}

module.exports = Rows;
