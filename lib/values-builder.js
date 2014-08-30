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
var deepcopy = require('deepcopy');
var valcheck = require('core-util-is');

var mlutil = require('./mlutil.js');
var qb     = require('./query-builder.js');

function ValueBuilder() {
}
ValueBuilder.prototype.fromIndexes = valuesFromIndexes;
ValueBuilder.prototype.where       = valuesWhere;
ValueBuilder.prototype.aggregates  = valuesAggregates;
ValueBuilder.prototype.slice       = valuesSlice;
ValueBuilder.prototype.withOptions = valuesWithOptions;

function valuesFromIndexes() {
  var self = (this instanceof ValueBuilder) ? this : new ValueBuilder();

  var args = mlutil.asArray.apply(null, arguments);
  var argLen = args.length;

/*
  var indexes = {};
  for (var i=0; i < argLen; i++) {
    var arg = args[i];
    if (valcheck.isString(arg)) {
      mlutil.appendItem(indexes, 'range', qb.property(arg));
    } else if (!valcheck.isUndefined(arg['json-property']) ||
        !valcheck.isUndefined(arg.element)) {
      mlutil.appendItem(indexes, 'range', arg);
    } else if (!valcheck.isUndefined(arg.range)) {
      mlutil.appendItem(indexes, 'range', arg.range);
    } else if (!valcheck.isUndefined(arg.field)) {
      mlutil.appendItem(indexes, 'field', arg.field);
    } else if (!valcheck.isUndefined(arg['geo-elem']) ||
        !valcheck.isUndefined(arg['geo-elem-pair']) ||
        !valcheck.isUndefined(arg['geo-attr-pair'])) {
      mlutil.appendItem(indexes, 'geospatial', arg);
    } else if (!valcheck.isUndefined(arg.uri)) {
      indexes.uri = null;
    } else if (!valcheck.isUndefined(arg.collection)) {
      indexes.collection = null;
    }
  }
  self.fromIndexesClause = indexes;
 */
  var isRangeIndex = {
    'element':       true,
    'json-property': true
  };
  var arg   = null;
  var range = null;
  for (var i=0; i < argLen; i++) {
    arg = args[i];
    if (valcheck.isString(arg)) {
      args[i] = {range: qb.property(arg)};
      continue;
    }
    if (isRangeIndex[Object.keys(arg)[0]]) {
      args[i] = {range: arg};
      continue;
    }
    range = arg.range;
    if (!valcheck.isNullOrUndefined(range)) {
      args[i] = {range: range};
    }
  }
  self.fromIndexesClause = args;

  return self;
}
function valuesWhere() {  
  var self = this;

  // QUESTION:
  // only structured query or also string query and QBE?
  // if the latter, reuse qb.where() with different self

  var args = mlutil.asArray.apply(null, arguments);
  var argLen = args.length;
  // TODO: if empty, clear the clause

  var fragmentScope;
  var queries = null;

  switch(argLen) {
  case 0:
    self.whereClause = {query: {queries: [and()]}};
    break;
  default:
    for (var i=0; i < argLen; i++) {
      var arg = args[i];
      if (fragmentScope === undefined) {
        fragmentScope = arg['fragment-scope'];
        if (fragmentScope !== undefined) {
          continue;
        }
      }
      if (queries === null) {
        queries = [arg];
      } else {
        queries.push(arg);        
      }
    }

    var whereClause = {};
    if (queries !== null) {
      whereClause.query = {queries: queries};
    }
    if (fragmentScope !== undefined) {
      whereClause['fragment-scope'] = fragmentScope;
    }
    self.whereClause = whereClause;

    break;
  }

  return self;
}
function valuesAggregates() {  
  var self = this;

  // avg, correlation, count, covariance, covariance-population, max, median, min,
  // stddev, stddev-population, sum, variance, variance-population
  self.aggregatesClause = qb.aggregates.apply(null, arguments);

  return self;
}
function valuesSlice() {  
  var self = this;

  // TODO: reuse QueryBuilder.slice with different self?

  var args = mlutil.asArray.apply(null, arguments);
  var argLen = args.length;
  // TODO: if empty, clear the clause

  var pageStart  = (argLen > 1 || (argLen === 1 && valcheck.isNumber(args[0]))) ?
      args[0] : null;
  var pageLength = (argLen > 2 || (argLen === 2 && valcheck.isNumber(args[1]))) ?
      args[1] : null;

  var sliceClause = {};

  if (pageStart !== null && pageLength !== 0) {
    if (pageStart === 0 && pageLength === null) {
      sliceClause['page-length'] = 0;
    } else {
      sliceClause['page-start'] = pageStart ;
    }
  }
  if (pageLength !== null) {
    sliceClause['page-length'] = pageLength;
  } 

// TODO: iterator

  self.sliceClause = sliceClause;

  return self;
}
function valuesWithOptions() {  
  var self = this;

  // TODO: share with values.js
  var optionKeyMapping = {
      values:      'values-option',
      forestNames: 'forest-names'
  };

  // TODO: reuse key copy logic with query-build withOptions
  var withOptionsClause = {};
  if (0 < arguments.length) {
    var arg = arguments[0];
    var argKeys = Object.keys(arg);
    for (var i=0; i < argKeys.length; i++) {
      var key = argKeys[i];
      if (optionKeyMapping[key] !== undefined) {
        var value = arg[key];
        if (value !== undefined) {
          withOptionsClause[key] = value;
        }
      }
    }
  }
  self.withOptionsClause = withOptionsClause;

  return self;
}

function valuesUri() {
  return {uri: null};
}

function copyFromValueBuilder(otherValueBuilder) {
  var tb = new ValueBuilder();

  // TODO: share with QueryBuilder
  if (!valcheck.isNullOrUndefined(otherValueBuilder)) {
    var clauseKeys = [
      'fromIndexesClause', 'whereClause',      'aggregatesClause',
      'sliceClause',       'withOptionsClause'
    ];
    var isString = valcheck.isString(otherValueBuilder);
    var other = isString ?
        JSON.parse(otherValueBuilder) : otherValueBuilder;
    for (var i=0; i < clauseKeys.length; i++){
      var key = clauseKeys[i];
      var value = other[key];
      if (!valcheck.isNullOrUndefined(value)) {
        // deepcopy instead of clone to avoid preserving prototype
        tb[key] = isString ? value : deepcopy(value);
      }
    }
  }

  return tb;
}

module.exports = {
    and:                qb.and,
    andNot:             qb.andNot,
    attribute:          qb.attribute,
    boost:              qb.boost,
    box:                qb.box,
    circle:             qb.circle,
    collection:         qb.collection,
    copyFrom:           copyFromValueBuilder,
    datatype:           qb.datatype,
    directory:          qb.directory,
    document:           qb.document,
    documentFragment:   qb.documentFragment,
    element:            qb.element,
    field:              qb.field,
    fragmentScope:      qb.fragmentScope,
    fromIndexes:        valuesFromIndexes,
    geoAttributePair:   qb.geoAttributePair,
    geoElement:         qb.geoElement,
    geoElementPair:     qb.geoElementPair,
    geoPath:            qb.geoPath,
    geoOption:          qb.geoOption,
    heatmap:            qb.heatmap,
    latlon:             qb.latlon,
    locks:              qb.locks,
    near:               qb.near,
    not:                qb.not,
    notIn:              qb.notIn,
    pathIndex:          qb.pathIndex,
    point:              qb.point,
    polygon:            qb.polygon,
    properties:         qb.properties,
    property:           qb.property,
    qname:              qb.qname,
    or:                 qb.or,
    ordered:            qb.ordered,
    range:              qb.range,
    rangeOptions:       qb.rangeOptions,
    scope:              qb.scope,
    southWestNorthEast: qb.southWestNorthEast,
    term:               qb.term,
    termOptions:        qb.termOptions,
    udf:                qb.udf,
    uri:                valuesUri,
    value:              qb.value,
    weight:             qb.weight,
    word:               qb.word
};
