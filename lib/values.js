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

  var structuredef = {
    name:  'structuredef',
    style: 'consistent'
  };

  var indexesClause = arg.fromIndexesClause;
  var indexesLength = valcheck.isArray(indexesClause) ? indexesClause.length : 0;
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
  if (!valcheck.isUndefined(aggregatesClause)) {
    structuredef.aggregate = aggregatesClause.aggregates;
  }

  var structureOptions = {};
  structureOptions[structureName] = [structuredef];

  var withOptionsClause = arg.withOptionsClause;
  if (!valcheck.isUndefined(withOptionsClause)) {
    // TODO: share with value-builder.js
    var optionKeyMapping = {
        values:      'values-option',
        forestNames: 'forest-names'
    };

    var optionsKeys = Object.keys(withOptionsClause);
    for (var i=0; i < optionsKeys.length; i++) {
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

  var pageStart  = null;
  var pageLength = null;
  var transform  = null;

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

    transform = sliceClause['document-transform'];
  }

  var endpoint = '/v1/values/structuredef?format=json';

  if (pageStart !== null) {
    endpoint += '&start='+pageStart;
  }
  if (pageLength !== null) {
    endpoint += '&pageLength='+pageLength;
  }
  if (!valcheck.isNullOrUndefined(transform)) {
    endpoint += '&'+mlutil.endpointTransform(transform);
  }

  var connectionParams = this.client.connectionParams;
  var requestOptions = mlutil.copyProperties(connectionParams);
  requestOptions.method = 'POST';
  requestOptions.headers = {
      'Content-Type': 'application/json',
      'Accept':       'application/json'
  };
  requestOptions.path = mlutil.databaseParam(connectionParams, endpoint, '&');

  var operation = mlrest.createOperation(
      'query values', this.client, requestOptions, 'single', 'single'
      );
  operation.validStatusCodes = [200, 204];
  operation.requestBody      = {search: searchBody};

  return mlrest.startRequest(operation);
}

function values(client) {
  this.client = client;
}
values.prototype.read = readValues;

module.exports = values;
