/*
 * Copyright 2014-2019 MarkLogic Corporation
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
var deepcopy = require('deepcopy');


var mlutil = require('./mlutil.js');
var qb     = require('./query-builder.js').builder;

/**
 * A source of datatyped values from a JSON property,
 * XML element or attribute, field, or path range or
 * geospatial index or from the collection or uri index.
 * @typedef {object} valuesBuilder.DatatypedValuesIndex
 * @since 1.0
 */

/**
 * An object representing the result of building a query using
 * the helper functions of a {@link valuesBuilder}.  You must call
 * the {@link valuesBuilder#fromIndexes} function to create the initial
 * BuiltQuery for the values query before calling the functions
 * to specify the other clauses of the built query.
 * @namespace valuesBuilder.BuiltQuery
 */

/**
 * A helper for building the definition of a values query, which projects
 * tuples (aka rows) of values out of documents. The helper is created by
 * the {@link marklogic.valuesBuilder} function. You must call
 * the {@link valuesBuilder#fromIndexes} function to supply the required
 * clause of the values query before calling the
 * {@link valuesBuilder.BuiltQuery#where},
 * {@link valuesBuilder.BuiltQuery#aggregates},
 * {@link valuesBuilder.BuiltQuery#slice}, or
 * {@link valuesBuilder.BuiltQuery#withOptions}
 * functions to specify the optional clauses of the built query.
 * @namespace valuesBuilder
 * @borrows queryBuilder#and                as valuesBuilder#and
 * @borrows queryBuilder#andNot             as valuesBuilder#andNot
 * @borrows queryBuilder#attribute          as valuesBuilder#attribute
 * @borrows queryBuilder#boost              as valuesBuilder#boost
 * @borrows queryBuilder#box                as valuesBuilder#box
 * @borrows queryBuilder#circle             as valuesBuilder#circle
 * @borrows queryBuilder#collection         as valuesBuilder#collection
 * @borrows queryBuilder#datatype           as valuesBuilder#datatype
 * @borrows queryBuilder#directory          as valuesBuilder#directory
 * @borrows queryBuilder#document           as valuesBuilder#document
 * @borrows queryBuilder#documentFragment   as valuesBuilder#documentFragment
 * @borrows queryBuilder#element            as valuesBuilder#element
 * @borrows queryBuilder#falseQuery         as valuesBuilder#falseQuery
 * @borrows queryBuilder#field              as valuesBuilder#field
 * @borrows queryBuilder#fragmentScope      as valuesBuilder#fragmentScope
 * @borrows queryBuilder#geoAttributePair   as valuesBuilder#geoAttributePair
 * @borrows queryBuilder#geoElement         as valuesBuilder#geoElement
 * @borrows queryBuilder#geoElementPair     as valuesBuilder#geoElementPair
 * @borrows queryBuilder#geoPath            as valuesBuilder#geoPath
 * @borrows queryBuilder#geoProperty        as valuesBuilder#geoProperty
 * @borrows queryBuilder#geoPropertyPair    as valuesBuilder#geoPropertyPair
 * @borrows queryBuilder#geoOptions         as valuesBuilder#geoOptions
 * @borrows queryBuilder#geospatial         as valuesBuilder#geospatial
 * @borrows queryBuilder#heatmap            as valuesBuilder#heatmap
 * @borrows queryBuilder#latlon             as valuesBuilder#latlon
 * @borrows queryBuilder#locksFragment      as valuesBuilder#locksFragment
 * @borrows queryBuilder#lsqtQuery          as valuesBuilder#lsqtQuery
 * @borrows queryBuilder#near               as valuesBuilder#near
 * @borrows queryBuilder#not                as valuesBuilder#not
 * @borrows queryBuilder#notIn              as valuesBuilder#notIn
 * @borrows queryBuilder#pathIndex          as valuesBuilder#pathIndex
 * @borrows queryBuilder#period             as valuesBuilder#period
 * @borrows queryBuilder#periodCompare      as valuesBuilder#periodCompare
 * @borrows queryBuilder#periodRange        as valuesBuilder#periodRange
 * @borrows queryBuilder#point              as valuesBuilder#point
 * @borrows queryBuilder#polygon            as valuesBuilder#polygon
 * @borrows queryBuilder#properties         as valuesBuilder#properties
 * @borrows queryBuilder#property           as valuesBuilder#property
 * @borrows queryBuilder#qname              as valuesBuilder#qname
 * @borrows queryBuilder#or                 as valuesBuilder#or
 * @borrows queryBuilder#ordered            as valuesBuilder#ordered
 * @borrows queryBuilder#range              as valuesBuilder#range
 * @borrows queryBuilder#rangeOptions       as valuesBuilder#rangeOptions
 * @borrows queryBuilder#scope              as valuesBuilder#scope
 * @borrows queryBuilder#southWestNorthEast as valuesBuilder#southWestNorthEast
 * @borrows queryBuilder#temporalOptions    as valuesBuilder#temporalOptions
 * @borrows queryBuilder#term               as valuesBuilder#term
 * @borrows queryBuilder#termOptions        as valuesBuilder#termOptions
 * @borrows queryBuilder#transform          as valuesBuilder#transform
 * @borrows queryBuilder#trueQuery          as valuesBuilder#trueQuery
 * @borrows queryBuilder#value              as valuesBuilder#value
 * @borrows queryBuilder#weight             as valuesBuilder#weight
 * @borrows queryBuilder#word               as valuesBuilder#word
 */

function ValueBuilder() {
  if (!(this instanceof ValueBuilder)) {
    return new ValueBuilder();
  }
}

/**
 * Specifies the range or geospatial indexes or collection or uri lexicons
 * from which to project columns in the response for the values query.
 * The response has a tuple (aka row) for each co-occurrence of these indexes
 * in the documents selected by the where clause.
 * This function must be called on the values builder.
 * @method valuesBuilder#fromIndexes
 * @since 1.0
 * @param {string|valuesBuilder.DatatypedValuesIndex} indexes - a list
 * of parameters or array specifying the JSON properties, XML elements or attributes,
 * fields, or paths providing the range or geospatial indexes or the return value
 * from the collection() or uri() helper functions to specify those lexicons.
 * @returns {valuesBuilder.BuiltQuery} a built query
 */
function valuesFromIndexes() {
  /*jshint validthis:true */
  var self = (this instanceof ValueBuilder) ? this : new ValueBuilder();

  var args = mlutil.asArray.apply(null, arguments);
  var argLen = args.length;

  var isRangeIndex = {
    'element':       true,
    'field':         true,
    'json-property': true,
    'path-index':    true
  };
  var isGeoLocationIndex = {
    'geo-attr-pair':          true,
    'geo-elem':               true,
    'geo-elem-pair':          true,
    'geo-json-property':      true,
    'geo-json-property-pair': true,
    'geo-path':               true
  };

  var arg      = null;
  var firstKey = null;
  var range    = null;
  for (var i=0; i < argLen; i++) {
    arg = args[i];
    if (typeof arg === 'string' || arg instanceof String) {
      args[i] = {range: qb.property(arg)};
      continue;
    }
    firstKey = Object.keys(arg)[0];
    if (isRangeIndex[firstKey]) {
      args[i] = {range: arg};
      continue;
    }
    range = arg.range;
    if (range != null) {
      args[i] = {range: range};
    }
    if (isGeoLocationIndex[firstKey]) {
      args[i] = arg;
      continue;
    }
  }
  self.fromIndexesClause = args;

  return self;
}
ValueBuilder.prototype.fromIndexes = valuesFromIndexes;
/**
 * Sets the where clause of a values query, using the helper functions
 * of a {@link valuesBuilder} to specify a structured query.
 * This function must be called on the builtQuery returned
 * by the {@link valuesBuilder#valuesFromIndexes} function
 * or another function specifying a values query clause.
 * @method valuesBuilder.BuiltQuery#where
 * @since 1.0
 * @param {queryBuilder.Query} query - one or more composable queries
 * returned by the values query builder functions.
 * @returns {valuesBuilder.BuiltQuery} a built query
 */
ValueBuilder.prototype.where = function valuesWhere() {
  var self = this;

  var args = mlutil.asArray.apply(null, arguments);
  var argLen = args.length;
  // TODO: if empty, clear the clause

  var parsedQuery = null;
  var fragmentScope = null;
  var queries = null;

  switch(argLen) {
  case 0:
    // TODO: better to skip the clause
    self.whereClause = {query: {queries: [qb.and()]}};
    break;
  default:
    for (var i=0; i < argLen; i++) {
      var arg = args[i];
      if (parsedQuery == null) {
        parsedQuery = arg.parsedQuery;
        if (parsedQuery != null) {
          continue;
        }
      }
      if (fragmentScope == null) {
        fragmentScope = arg['fragment-scope'];
        if (fragmentScope != null) {
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
    if (parsedQuery != null) {
      whereClause.parsedQuery = parsedQuery;
    }
    if (fragmentScope != null) {
      whereClause['fragment-scope'] = fragmentScope;
    }
    self.whereClause = whereClause;

    break;
  }

  return self;
};
/**
 * Specifies aggregates to calculate over the tuples (aka rows) projected
 * from the indexes for the documents selected by the where clause.
 * This function must be called on the builtQuery returned
 * by the {@link valuesBuilder#valuesFromIndexes} function
 * or another function specifying a values query clause.
 * @method valuesBuilder.BuiltQuery#aggregates
 * @since 1.0
 * @param {string[]} functions - one or more built-in functions such
 * avg, correlation, count, covariance, covariance-population, max, median, min,
 * stddev, stddev-population, sum, variance, or variance-population or the
 * return values from the {@link valuesBuilder#udf} function specifying
 * a user-defined aggregate function.
 * @returns {valuesBuilder.BuiltQuery} a built query
 */
ValueBuilder.prototype.aggregates = function valuesAggregates() {
  var self = this;

  var args = mlutil.asArray.apply(null, arguments);
  var argLen = args.length;
  if (argLen < 1) {
    throw new Error('aggregates must specify at least one built-in function or UDF');
  }

  var aggregateFunctions = [];
  for (var i=0; i < argLen; i++) {
    var arg = args[i];
    if (typeof arg === 'string' || arg instanceof String) {
      aggregateFunctions.push({apply:arg});
    } else if (arg.udf !== void 0) {
      aggregateFunctions.push(arg);
    } else if (Array.isArray(arg) && arg.length > 1) {
      aggregateFunctions.push({udf:arg[0], apply:arg[1]});
    }
  }

  self.aggregatesClause = {aggregates: aggregateFunctions};

  return self;
};

/**
 * Identifies a UDF (User Defined Function) that calculates
 * a custom aggregate different from a range index.
 * The plugin implementing the aggregate must have been
 * installed in the database server distribution on all hosts
 * where the database has forests.
 * @method valuesBuilder#udf
 * @since 1.0
 * @param {string} pluginName - the name of the plugin library
 * that implements the UDF
 * @param {string} functionName - the name of the function
 * that is the entry point within the library
 * @returns {object} the definition of the UDF for passing
 * to the {@link valuesBuilder#aggregates} function
 */
function udf() {
  if (arguments.length < 1) {
    throw new Error('UDF calls must specify the plugin and function');
  }

  return ({udf:arguments[0], apply:arguments[1]});
}

/**
 * Sets the slice clause of a built query to select the slice
 * of the result set based on the start tuple within the result set
 * and the number of tuples (aka rows) in the slice.
 * This function must be called on the builtQuery returned
 * by the {@link valuesBuilder#valuesFromIndexes} function
 * or another function specifying a values query clause.
 * By default, the slice uses array slice mode, but you can switch
 * to legacy slice mode with {@link marklogic.setSliceMode}. Legacy
 * slice mode is deprecated and will be removed in the next major release.
 * @method valuesBuilder.BuiltQuery#slice
 * @since 1.0
 * @param {number} start - in array slice mode, the zero-based position
 * within the result set of the first tuple; in legacy slice mode, the
 * one-based position within the result set of the first tuple or 0 to
 * suppress the tuples and return only the summary
 * @param {number} length - in array slice mode, the zero-based position
 * of the tuple after the last document in the slice or 0 to suppress
 * the documents and return only the summary; in legacy slice mode, the
 * number of tuples in the slice
 * @param {transform} [transform] - a transform to apply to the
 * slice on the server as specified by the {@link valuesBuilder#transform}
 * function
 * @returns {valuesBuilder.BuiltQuery} a built query
 */
ValueBuilder.prototype.slice = function valuesSlice() {
  var self = this;

  var args = mlutil.asArray.apply(null, arguments);

  // TODO: if empty, clear the clause

  self.sliceClause = mlutil.makeSliceClause('values', args);

  return self;
};
/**
 * Sets the withOptions clause of a built query to configure the query;
 * takes a configuration object with the following named parameters.
 * This function must be called on the builtQuery returned
 * by the {@link valuesBuilder#valuesFromIndexes} function
 * or another function specifying a values query clause.
 * @method valuesBuilder.BuiltQuery#withOptions
 * @since 1.0
 * @param {...string} [forestNames] - the names of forests providing documents
 * for the result set
 * @param {...string} [values] - options modifying the default behaviour of the query
 * @returns {valuesBuilder.BuiltQuery} a built query
 */
ValueBuilder.prototype.withOptions = function valuesWithOptions() {
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
};

/**
 * Identifies the uri index as the source for a column of values.
 * Each tuple (aka row) projected from a document includes the
 * uri of the document as one of the columns.
 * @method valuesBuilder#uri
 * @since 1.0
 * @returns {valuesBuilder.DatatypedValuesIndex} an identifier for the uri index
 */
function valuesUri() {
  return {uri: null};
}

/**
 * Initializes a new values builder by copying the from indexes clause
 * and any where, aggregates, slice, or withOptions clause defined in
 * the built query.
 * @method valuesBuilder#copyFrom
 * @since 1.0
 * @param {valuesBuilder.BuiltQuery} query - an existing values query
 * with clauses to copy
 * @returns {valuesBuilder.BuiltQuery} a built query
 */
function copyFromValueBuilder(otherValueBuilder) {
  var tb = new ValueBuilder();

  // TODO: share with QueryBuilder
  if (otherValueBuilder != null) {
    var clauseKeys = [
      'fromIndexesClause', 'whereClause',      'aggregatesClause',
      'sliceClause',       'withOptionsClause'
    ];
    var isString = (typeof otherValueBuilder === 'string' || otherValueBuilder instanceof String);
    var other = isString ?
        JSON.parse(otherValueBuilder) : otherValueBuilder;
    for (var i=0; i < clauseKeys.length; i++){
      var key = clauseKeys[i];
      var value = other[key];
      if (value != null) {
        // deepcopy instead of clone to avoid preserving prototype
        tb[key] = isString ? value : deepcopy(value);
      }
    }
  }

  return tb;
}

module.exports = {
  builder:  {
    and:                qb.and,
    andNot:             qb.andNot,
    attribute:          qb.attribute,
    bind:               qb.bind,
    bindDefault:        qb.bindDefault,
    bindEmptyAs:        qb.bindEmptyAs,
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
    falseQuery:         qb.falseQuery,
    field:              qb.field,
    fragmentScope:      qb.fragmentScope,
    fromIndexes:        valuesFromIndexes,
    geoAttributePair:   qb.geoAttributePair,
    geoElement:         qb.geoElement,
    geoElementPair:     qb.geoElementPair,
    geoPath:            qb.geoPath,
    geoProperty:        qb.geoProperty,
    geoPropertyPair:    qb.geoPropertyPair,
    geoOptions:         qb.geoOptions,
    geospatial:         qb.geospatial,
    heatmap:            qb.heatmap,
    jsontype:           qb.jsontype,
    latlon:             qb.latlon,
    locksFragment:      qb.locksFragment,
    lsqtQuery:          qb.lsqtQuery,
    near:               qb.near,
    not:                qb.not,
    notIn:              qb.notIn,
    parseBindings:      qb.parseBindings,
    parsedFrom:         qb.parsedFrom,
    parseFunction:      qb.parseFunction,
    pathIndex:          qb.pathIndex,
    period:             qb.period,
    periodCompare:      qb.periodCompare,
    periodRange:        qb.periodRange,
    point:              qb.point,
    polygon:            qb.polygon,
    propertiesFragment: qb.propertiesFragment,
    property:           qb.property,
    qname:              qb.qname,
    or:                 qb.or,
    ordered:            qb.ordered,
    range:              qb.range,
    rangeOptions:       qb.rangeOptions,
    scope:              qb.scope,
    southWestNorthEast: qb.southWestNorthEast,
    temporalOptions:    qb.temporalOptions,
    term:               qb.term,
    termOptions:        qb.termOptions,
    transform:          qb.transform,
    trueQuery:          qb.trueQuery,
    udf:                udf,
    uri:                valuesUri,
    value:              qb.value,
    weight:             qb.weight,
    word:               qb.word
  }
};
