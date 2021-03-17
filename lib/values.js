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

/**
 * Provides functions to project tuples (aka rows) of values out of documents.
 * The values for the tuples come from JSON properties, XML elements or attributes,
 * fields, or paths in the documents that have range or geospatial indexes.
 * Values can also come from the collection or uri index. Each co-occurrence
 * of the specified indexes in a document produces a tuple.  For instance,
 * if one JSON property occurs twice in a document but another occurs only
 * once, the result will include two tuples:  that is, one co-occurrence
 * for each value of the first property with the value of the second property.
 * @namespace values
 */

function Values(client) {
  if (!(this instanceof Values)) {
    return new Values(client);
  }
  this.client = client;
}

/**
 * Executes a values query built by a {@link valuesBuilder} to read tuples
 * from the specified indexes for the documents qualified by the query.
 * @method values#read
 * @since 1.0
 * @param {object} valuesQuery - a query built by a {@link valuesBuilder}
 * @param {DatabaseClient.Timestamp}  [timestamp] - a Timestamp object for point-in-time
 * operations
 * @returns {ResultProvider} an object whose result() function takes
 * a success callback that receives the tuples.
 */
Values.prototype.read = function readValues() {
  if (arguments.length === 0 || arguments.length > 2) {
    throw new Error('incorrect number of arguments to read values');
  }
  var arg = arguments[0];

  var timestamp = null;
  if (arguments.length === 2) {
    if (arguments[1] instanceof mlutil.Timestamp) {
      timestamp = arguments[1];
    } else {
      throw new Error('invalid timestamp argument');
    }
  }

  var structuredef = {
    name:  'structuredef',
    style: 'consistent'
  };

  var indexesClause = arg.fromIndexesClause;
  var indexesLength = Array.isArray(indexesClause) ? indexesClause.length : 0;
  if (indexesLength < 1) {
    throw new Error('must specify indexes to read values');
  }

  var isValues      = (indexesLength === 1);
  var structureName = isValues ? 'values' : 'tuples';

  if (isValues) {
    var indexObject        = indexesClause[0];
    var indexKey           = Object.keys(indexObject)[0];
    structuredef[indexKey] = indexObject[indexKey];
  } else {
    structuredef.indexes = indexesClause;
  }

  var aggregatesClause = arg.aggregatesClause;
  if (aggregatesClause !== void 0) {
    structuredef.aggregate = aggregatesClause.aggregates;
  }

  var structureOptions = {};
  structureOptions[structureName] = [structuredef];

  var withOptionsClause = arg.withOptionsClause;
  if (withOptionsClause !== void 0) {
    // TODO: share with value-builder.js
    var optionKeyMapping = {
        values:      'values-option',
        forestNames: 'forest-names'
    };

    var optionsKeys = Object.keys(withOptionsClause);
    var key = null;
    var mapping = null;
    var value = null;
    for (var i=0; i < optionsKeys.length; i++) {
      key = optionsKeys[i];
      mapping = optionKeyMapping[key];
      if (mapping !== void 0) {
        value = withOptionsClause[key];
        if (value !== void 0) {
          if (mapping === 'values-option') {
            structuredef[mapping ] = value;
          } else {
            structureOptions[mapping] = value;
          }
        }
      }
    }
  }

  var searchBody = {
      options: structureOptions
  };

  var whereClause = arg.whereClause;
  if (whereClause != null) {
    var query         = whereClause.query;
    var parsedQuery   = whereClause.parsedQuery;
    var fragmentScope = whereClause['fragment-scope'];
    if (query != null) {
      searchBody.query = query;
    }
    if (parsedQuery != null) {
      searchBody.qtext = parsedQuery.qtext;

      var constraintBindings = parsedQuery.constraint;
      var termBinding        = parsedQuery.term;
      if (constraintBindings != null) {
        structureOptions.constraint = constraintBindings;
      }
      if (termBinding != null) {
        structureOptions.term = termBinding;
      }
    }
    if (fragmentScope != null) {
      structureOptions['fragment-scope'] = fragmentScope;
    }
  }

  var pageStart  = null;
  var pageLength = null;
  var transform  = null;

  var sliceClause = arg.sliceClause;
  if (sliceClause !== void 0) {
    var sliceStart = sliceClause['page-start'];
    if (sliceStart !== void 0) {
      pageStart = sliceStart;
    }
    var sliceLength = sliceClause['page-length'];
    if (sliceLength !== void 0) {
      pageLength = sliceLength;
    }

    transform = sliceClause['document-transform'];
  }

  var endpoint = '/v1/values/structuredef?format=json';

  if (pageStart !== null) {
    endpoint += '&start='+pageStart;
  }
  if (pageLength !== null) {
    endpoint += '&pageLength='+pageLength;
  }
  if (transform != null) {
    endpoint += '&'+mlutil.endpointTransform(transform);
  }

  if (timestamp !== null && timestamp !== void 0) {
    if (timestamp.value !== null) {
      endpoint += '&timestamp='+timestamp.value;
    }
  }

  var connectionParams = this.client.getConnectionParams();
  var requestOptions = mlutil.copyProperties(connectionParams);
  requestOptions.method = 'POST';
  requestOptions.headers = {
      'Content-Type': 'application/json',
      'Accept':       'application/json'
  };
  requestOptions.path = mlutil.databaseParam(connectionParams, endpoint, '&');

  var operation = new Operation(
      'query values', this.client, requestOptions, 'single', 'single'
      );
  operation.validStatusCodes = [200, 204];
  operation.requestBody      = {search: searchBody};
  operation.timestamp = (timestamp !== null) ? timestamp : null;

  return requester.startRequest(operation);
};

module.exports = Values;
