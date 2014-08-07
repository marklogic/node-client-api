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
var util     = require("util");
var valcheck = require('core-util-is');

var mlrest   = require('./mlrest.js');
var mlutil   = require('./mlutil.js');

function readValues() {
  if (arguments.length !== 1) {
    throw new Error('incorrect number of arguments to read values');
  }
  var arg = arguments[0];

  var indexTypes = {
    collection:      true,
    field:           true,
    geospatial:      true,
    range:           true,
    uri:             true
  };

  var structuredef = {
    name: 'structuredef'
  };

  var indexesClause = arg.fromIndexesClause;
  if (valcheck.isUndefined(indexesClause)) {
    throw new Error('must specify indexes to read values');
  }

  var indexCount = 0;
  var indexKeys = Object.keys(indexesClause);
  var i     = null;
  var key   = null;
  var value = null;
  for (i=0; i < indexKeys.length; i++) {
    key = indexKeys[i];
    if (indexTypes[key] === true) {
      value = indexesClause[key];
      structuredef[key] = value;
      indexCount += (valcheck.isArray(value) ? value.length : 1);
    }
  }

  if (indexCount === 0) {
    throw new Error('no indexes specified');
  }
  var isValues = (indexCount === 1);

  var structureName = isValues ? 'values' : 'tuples';

  var aggregatesClause = arg.aggregatesClause;
  if (!valcheck.isUndefined(aggregatesClause)) {
    structuredef.aggregate = aggregatesClause.aggregates;
  }

  // TODO: preserving sequence over range, collections, uri, field?
  var structureOptions = {};
  structureOptions[structureName] = structuredef;

  var withOptionsClause = arg.withOptionsClause;
  if (!valcheck.isUndefined(withOptionsClause)) {
    // TODO: share with value-builder.js
    var optionKeyMapping = {
        values:      'values-option',
        forestNames: 'forest-names'
    };

    var optionsKeys = Object.keys(withOptionsClause);
    for (i=0; i < optionsKeys.length; i++) {
      key = optionsKeys[i];
      var mapping = optionKeyMapping[key];
      if (!valcheck.isUndefined(mapping)) {
        value = withOptionsClause[key];
        if (!valcheck.isUndefined(value)) {
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
  
  var query = arg.whereClause;
  if (!valcheck.isUndefined(query)) {
    searchBody.query = query;
  }

  var pageStart   = null;
  var pageLength  = null;

  var sliceClause = arg.sliceClause;
  if (!valcheck.isUndefined(sliceClause)) {
    var sliceStart = sliceClause['page-start'];
    if (!valcheck.isUndefined(sliceStart)) {
      pageStart = sliceStart;
    }
    var sliceLength = sliceClause['page-length'];
    if (!valcheck.isUndefined(sliceLength)) {
      pageLength = sliceLength;
    }
  }

  var endpoint = '/v1/values/structuredef?format=json';

  if (pageStart !== null) {
    endpoint += '&start='+pageStart;
  }
  if (pageLength !== null) {
    endpoint += '&pageLength='+pageLength;
  }

  var requestOptions = mlutil.copyProperties(this.client.connectionParams);
  requestOptions.method = 'POST';
  requestOptions.headers = {
      'Content-Type': 'application/json',
      'Accept':       'application/json'
  };
  requestOptions.path = endpoint;

  var operation = mlrest.createOperation(
      'query values', this.client, requestOptions, 'single', 'single'
      );
  operation.validStatusCodes = [200, 204];
  operation.requestBody      = {search: searchBody};

  return mlrest.startRequest(operation);
}

/* TODO:

unify tuples and values

facets as values
    * zero or more aggregates
    * paging on items (not limit of aggregates)
      sample / limit
    * bucket as a page?  aggregates other than sum of frequency for a bucket?

values: collection, uri, range, field, Geospatial
facets: collection, range, field, Geospatial

cts:uris()

lexicon match with wildcards -- suggest?

options
    ascending
    descending
    frequency-order
    item-order

turn slice into
    limit=N
    sample=N not affect frequencies

aggregate
    fragment-frequency
    item-frequency

udf(pluginPath, name)

document

timezone=TZ
weight
score-logtfidf
score-logtf
score-simple
score-random
score-zero
checked
unchecked
concurrent
proximity=N
ordered

suggest - lexicon match - takes a string and parse bindings; assumes combined query
 */

function values(client) {
  this.client = client;
}
values.prototype.read = readValues;

module.exports = values;
