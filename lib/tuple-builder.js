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

function TupleBuilder() {
}
TupleBuilder.prototype.fromIndexes = tuplesFromIndexes;
TupleBuilder.prototype.where       = tuplesWhere;
TupleBuilder.prototype.aggregates  = tuplesAggregates;
TupleBuilder.prototype.slice       = tuplesSlice;
TupleBuilder.prototype.withOptions = tuplesWithOptions;

function tuplesFromIndexes() {
  var self = (this instanceof TupleBuilder) ? this : new TupleBuilder();

  var args = mlutil.asArray.apply(null, arguments);
  var argLen = args.length;

  var indexes = [];
  for (var i=0; i < argLen; i++) {
    var arg = args[i];
    // collection, uri, range, field, geo-elem, geo-elem-pair, geo-attr-pair
    if (valcheck.isString(arg) ||
        !valcheck.isUndefined(arg['json-property']) ||
        !valcheck.isUndefined(arg.element)) {
      indexes.push(qb.range(arg));
    } else {
      indexes.push(arg);
    }
  }
  self.fromIndexesClause = indexes;

  return self;
}
function tuplesWhere() {  
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
function tuplesAggregates() {  
  var self = this;

  var args = mlutil.asArray.apply(null, arguments);
  var argLen = args.length;

  if (args.length < 1) {
    throw new Error('must specify at least one aggregate');
  }

  // TODO: QueryBuilder.aggregates?

  var aggregates = [];
  for (var i=0; i < argLen; i++) {
    var arg = args[i];
    // avg, correlation, count, covariance, covariance-population, max, median, min,
    // stddev, stddev-population, sum, variance, variance-population
    aggregates.push(arg);
  }
  self.aggregatesClause = aggregates;

  return self;
}
function tuplesSlice() {  
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
function tuplesWithOptions() {  
  var self = this;

  var optionKeyMapping = {
      tuple:'tuple-option',
      forestNames:'forest-names'
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

function tuplesUri() {
  return {uri: null};
}

function copyFromTupleBuilder(otherTupleBuilder) {
  var tb = new TupleBuilder();

  // TODO: share with QueryBuilder
  if (!valcheck.isNullOrUndefined(otherTupleBuilder)) {
    var clauseKeys = [
      'fromIndexesClause', 'whereClause',      'aggregatesClause',
      'sliceClause',       'withOptionsClause'
    ];
    var isString = valcheck.isString(otherTupleBuilder);
    var other = isString ?
        JSON.parse(otherTupleBuilder) : otherTupleBuilder;
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

/* TODO: tuples including tuples.read()

facets as values
    * zero or more aggregates
    * paging on items (not limit of aggregates)
      sample / limit
    * bucket as a page?  aggregates other than sum of frequency for a bucket?

values: collection, uri, range, field, Geospatial
facets: collection, range, field, Geospatial

cts:uris()

submit tuples as a combined query

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
module.exports = {
    and:                qb.and,
    andNot:             qb.andNot,
    attribute:          qb.attribute,
    boost:              qb.boost,
    box:                qb.box,
    circle:             qb.circle,
    collection:         qb.collection,
    copyFrom:           copyFromTupleBuilder,
    datatype:           qb.datatype,
    directory:          qb.directory,
    document:           qb.document,
    documentFragment:   qb.documentFragment,
    element:            qb.element,
    field:              qb.field,
    fragmentScope:      qb.fragmentScope,
    fromIndexes:        tuplesFromIndexes,
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
    uri:                tuplesUri,
    value:              qb.value,
    weight:             qb.weight,
    word:               qb.word
};
