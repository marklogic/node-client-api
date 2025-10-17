/*
* Copyright (c) 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/
'use strict';
const requester = require('./requester.js');
const mlutil    = require('./mlutil.js');
const Operation = require('./operation.js');

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
  const arg = arguments[0];

  let timestamp = null;
  if (arguments.length === 2) {
    if (arguments[1] instanceof mlutil.Timestamp) {
      timestamp = arguments[1];
    } else {
      throw new Error('invalid timestamp argument');
    }
  }

  const structuredef = {
    name:  'structuredef',
    style: 'consistent'
  };

  const indexesClause = arg.fromIndexesClause;
  const indexesLength = Array.isArray(indexesClause) ? indexesClause.length : 0;
  if (indexesLength < 1) {
    throw new Error('must specify indexes to read values');
  }

  const isValues      = (indexesLength === 1);
  const structureName = isValues ? 'values' : 'tuples';

  if (isValues) {
    const indexObject        = indexesClause[0];
    const indexKey           = Object.keys(indexObject)[0];
    structuredef[indexKey] = indexObject[indexKey];
  } else {
    structuredef.indexes = indexesClause;
  }

  const aggregatesClause = arg.aggregatesClause;
  if (aggregatesClause !== void 0) {
    structuredef.aggregate = aggregatesClause.aggregates;
  }

  const structureOptions = {};
  structureOptions[structureName] = [structuredef];

  const withOptionsClause = arg.withOptionsClause;
  if (withOptionsClause !== void 0) {
    // TODO: share with value-builder.js
    const optionKeyMapping = {
        values:      'values-option',
        forestNames: 'forest-names'
    };

    const optionsKeys = Object.keys(withOptionsClause);
    let key = null;
    let mapping = null;
    let value = null;
    for (let i=0; i < optionsKeys.length; i++) {
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

  const searchBody = {
      options: structureOptions
  };

  const whereClause = arg.whereClause;
  if (whereClause != null) {
    const query         = whereClause.query;
    const parsedQuery   = whereClause.parsedQuery;
    const fragmentScope = whereClause['fragment-scope'];
    if (query != null) {
      searchBody.query = query;
    }
    if (parsedQuery != null) {
      searchBody.qtext = parsedQuery.qtext;

      const constraintBindings = parsedQuery.constraint;
      const termBinding        = parsedQuery.term;
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

  let pageStart  = null;
  let pageLength = null;
  let transform  = null;

  const sliceClause = arg.sliceClause;
  if (sliceClause !== void 0) {
    const sliceStart = sliceClause['page-start'];
    if (sliceStart !== void 0) {
      pageStart = sliceStart;
    }
    const sliceLength = sliceClause['page-length'];
    if (sliceLength !== void 0) {
      pageLength = sliceLength;
    }

    transform = sliceClause['document-transform'];
  }

  let endpoint = '/v1/values/structuredef?format=json';

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

  const requestOptions = mlutil.newRequestOptions(this.client.getConnectionParams(), endpoint, 'POST');
  requestOptions.headers = {
      'Content-Type': 'application/json',
      'Accept':       'application/json'
  };

  const operation = new Operation(
      'query values', this.client, requestOptions, 'single', 'single'
      );
  operation.validStatusCodes = [200, 204];
  operation.requestBody      = {search: searchBody};
  operation.timestamp = (timestamp !== null) ? timestamp : null;

  return requester.startRequest(operation);
};

module.exports = Values;
