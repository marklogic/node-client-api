/*
 * Copyright 2014-2015 MarkLogic Corporation
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
var deepcopy = require('deepcopy');
var valcheck = require('core-util-is');
var mlutil   = require('./mlutil.js');

var comparisons = {
    '<'  : 'LT',
    '<=' : 'LE',
    '>'  : 'GT',
    '>=' : 'GE',
    '='  : 'EQ',
    '!=' : 'NE'
};
var datatypes = {
    'xs:anyURI':            'xs:anyURI',
    'xs:date':              'xs:date',
    'xs:dateTime':          'xs:dateTime',
    'xs:dayTimeDuration':   'xs:dayTimeDuration',
    'xs:decimal':           'xs:decimal',
    'xs:double':            'xs:double',
    'xs:float':             'xs:float',
    'xs:gDay':              'xs:gDay',
    'xs:gMonth':            'xs:gMonth',
    'xs:gMonthDay':         'xs:gMonthDay',
    'xs:gYear':             'xs:gYear',
    'xs:gYearMonth':        'xs:gYearMonth',
    'xs:int':               'xs:int',
    'xs:long':              'xs:long',
    'xs:string':            'xs:string',
    'xs:time':              'xs:time',
    'xs:unsignedInt':       'xs:unsignedInt',
    'xs:unsignedLong':      'xs:unsignedLong',
    'xs:yearMonthDuration': 'xs:yearMonthDuration'
};
/** @ignore */
function asIndex(index) {
  return valcheck.isString(index) ? property(index) : index;
}
/** @ignore */
function addIndex(query, index, isContainer) {
  var containerOnly = (isContainer || false);
  if (index instanceof JSONPropertyDef) {
    query['json-property'] = index['json-property'];
  } else if (index instanceof ElementDef) {
    query.element = index.element;
  } else if (index instanceof AttributeDef) {
    query.element   = index.element;
    query.attribute = index.attribute;
  } else if (containerOnly) {
  } else if (index instanceof FieldDef) {
    query.field = index.field;
  } else if (index instanceof PathIndexDef) {
    query['path-index'] = index['path-index'];
  }
}

/**
 * A helper for building the definition of a document query. The helper is
 * created by the {@link module:marklogic.queryBuilder} function.
 * @namespace queryBuilder
 */

/**
 * A composable query.
 * @typedef {object} queryBuilder.Query
 */
/**
 * An indexed name such as a JSON property, XML element or attribute, field,
 * or path index.
 * @typedef {object} queryBuilder.IndexedName
 */
/**
 * An indexed name such as a JSON property, XML element, or path that
 * represents a geospatial location for matched by a geospatial query.
 * @typedef {object} queryBuilder.GeoLocation
 */
/**
 * The specification of a point or an area (such as a box, circle, or polygon)
 * for use as criteria in a geospatial query.
 * @typedef {object} queryBuilder.Region
 */
/**
 * The specification of the latitude and longitude
 * returned by the {@link queryBuilder#latlon} function
 * for a coordinate of a {@link queryBuilder.Region}.
 * @typedef {object} queryBuilder.LatLon
 */

/** @ignore */
function checkQueryArray(queryArray) {
  if (valcheck.isNullOrUndefined(queryArray)) {
    return queryArray;
  }

  var max = queryArray.length;
  if (max === 0) {
    return queryArray;
  }

  var i = 0;
  for (; i < max; i++) {
    checkQuery(queryArray[i]);
  }

  return queryArray;
}
/** @ignore */
function checkQuery(query) {
  if (valcheck.isNullOrUndefined(query)) {
    return query;
  }

  if (!valcheck.isUndefined(query.name)) {
    throw new Error('subquery must supply literal criteria for: '+query.name);
  }

  if (!(query instanceof QueryDef)) {
    throw new Error('subquery is not a query definition: '+mlutil.identify(query, true));
  }

  return query;
}

/** @ignore */
function QueryDef() {
  if (!(this instanceof QueryDef)) {
    return new QueryDef();
  }
}

/**
 * Builds a query for the intersection of the subqueries.
 * @method
 * @memberof queryBuilder#
 * @param {...queryBuilder.Query} subquery - a word, value, range, geospatial,
 * or other query or a composer such as an or query.
 * @param {queryBuilder.OrderParam} [ordering] - the ordering on the subqueries
 * returned from {@link queryBuilder#ordered}
 * @returns {queryBuilder.Query} a composable query
 */
function and() {
  var args = mlutil.asArray.apply(null, arguments);
  var queries = [];
  var ordered = null;
  var arg = null;
  for (var i=0; i < args.length; i++) {
    arg = args[i];
    if (ordered === null) {
      if (arg instanceof OrderedDef) {
        ordered        = arg.ordered;
        continue;
      } else if (valcheck.isBoolean(arg)) {
        ordered        = arg;
        continue;
      }
    }

    if (arg instanceof Array){
      Array.prototype.push.apply(queries, arg);
    } else {
      queries.push(arg);
    }
  }

  return new AndDef(new QueryListDef(queries, ordered, null, null));
}
/** @ignore */
function AndDef(queryList) {
  if (!(this instanceof AndDef)) {
    return new AndDef(queryList);
  }

  if (!valcheck.isNullOrUndefined(queryList)) {
    if (queryList instanceof QueryListDef) {
      this['and-query'] = queryList;
    } else {
      throw new Error('invalid and() query: '+mlutil.identify(queryList, true));
    }
  } else {
    this['and-query'] = new QueryListDef([]);
  }
}
util.inherits(AndDef, QueryDef);
/** @ignore */
function QueryListDef(queries, ordered, weight, distance) {
  if (!(this instanceof QueryListDef)) {
    return new QueryListDef(queries, ordered, weight, distance);
  }

  if (valcheck.isArray(queries)) {
    this.queries = checkQueryArray(queries);
  } else {
    throw new Error('invalid query list: '+mlutil.identify(queries, true));
  }

  if (!valcheck.isNullOrUndefined(ordered)) {
    if (valcheck.isBoolean(ordered)) {
      this.ordered = ordered;
    } else {
      throw new Error('invalid order for query list: '+mlutil.identify(ordered, true));
    }
  }

  if (!valcheck.isNullOrUndefined(weight)) {
    if (valcheck.isNumber(weight)) {
      this.weight = weight;
    } else {
      throw new Error('invalid weight for query list: '+mlutil.identify(weight, true));
    }
  }

  if (!valcheck.isNullOrUndefined(distance)) {
    if (valcheck.isNumber(distance)) {
      this.distance = distance;
    } else {
      throw new Error('invalid distance for query list: '+mlutil.identify(distance, true));
    }
  }
}
/**
 * Builds a query with positive and negative subqueries.
 * @method
 * @memberof queryBuilder#
 * @param {queryBuilder.Query} positiveQuery - a query that must match
 * the result documents
 * @param {queryBuilder.Query} negativeQuery - a query that must not match
 * the result documents
 * @returns {queryBuilder.Query} a composable query
 */
function andNot() {
  var args = mlutil.asArray.apply(null, arguments);
  switch(args.length) {
  case 0:
    throw new Error('missing positive and negative queries');
  case 1:
    throw new Error('has positive but missing negative query: '+mlutil.identify(args[0], true));
  case 2:
    return new AndNotDef(new PositiveNegativeDef(args[0], args[1]));
  default:
    throw new Error('more than two arguments for andNot(): '+args.length);
  }
}
/** @ignore */
function AndNotDef(positiveNegative) {
  if (!(this instanceof AndNotDef)) {
    return new AndNotDef(positiveNegative);
  }

  if (positiveNegative instanceof PositiveNegativeDef) {
    this['and-not-query'] = positiveNegative;
  } else {
    throw new Error('invalid andNot() query: '+mlutil.identify(positiveNegative, true));
  }
}
util.inherits(AndNotDef, QueryDef);
/** @ignore */
function PositiveNegativeDef(positive, negative) {
  if (!(this instanceof PositiveNegativeDef)) {
    return new PositiveNegativeDef(positive, negative);
  }

  if (!valcheck.isNullOrUndefined(positive)) {
    this['positive-query'] = checkQuery(positive);
  } else {
    throw new Error('missing positive query');
  }

  if (!valcheck.isNullOrUndefined(negative)) {
    this['negative-query'] = checkQuery(negative);
  } else {
    throw new Error('missing negative query');
  }
}
/**
 * Specifies an XML attribute for a query.  A name without a namespace can be
 * expressed as a string.  A namespaced name can be expressed as a two-item
 * array with uri and name strings or as an object returned by the
 * {@link queryBuilder#qname} function.
 * @method
 * @memberof queryBuilder#
 * @param {string|string[]|queryBuilder.QName} element - the name of the element
 * @param {string|string[]|queryBuilder.QName} attribute - the name of the attribute
 * @returns {queryBuilder.IndexedName} an indexed name for specifying a query
 */
function attribute() {
  var args = mlutil.asArray.apply(null, arguments);
  switch(args.length) {
  case 0:
    throw new Error('missing element and attribute');
  case 1:
    throw new Error('has element but missing attribute: '+mlutil.identify(args[0], true));
  case 2:
    return new AttributeDef(
      (args[0] instanceof QNameDef) ? args[0] :
        valcheck.isArray(args[0]) ? qname.call(null, args[0]) :
        new QNameDef(null, args[0]),
      (args[1] instanceof QNameDef) ? args[1] :
          valcheck.isArray(args[1]) ? qname.call(null, args[1]) :
          new QNameDef(null, args[1])
      );
  case 3:
    if (args[0] instanceof QNameDef) {
      return new AttributeDef(
        args[0],
        new QNameDef(args[1], args[2])
      );
    } else if (args[2] instanceof QNameDef) {
      return new AttributeDef(
        new QNameDef(args[0], args[1]),
        args[2]
      );
    } else if (valcheck.isArray(args[0])) {
      return new AttributeDef(
        qname.call(null, args[0]),
        new QNameDef(args[1], args[2])
      );
    } else if (valcheck.isArray(args[2])) {
      return new AttributeDef(
        new QNameDef(args[0], args[1]),
        qname.call(null, args[2])
      );
    }
    return new AttributeDef(
      new QNameDef(args[0], args[1]),
      new QNameDef(null,    args[2])
      );
  default:
    return new AttributeDef(
      new QNameDef(args[0], args[1]),
      new QNameDef(args[2], args[3])
      );
 }
}
/** @ignore */
function AttributeDef(elemQName, attrQName) {
  if (!(this instanceof AttributeDef)) {
    return new AttributeDef(elemQName, attrQName);
  }

  if (elemQName instanceof QNameDef) {
    this.element   = elemQName;
  } else {
    throw new Error('invalid element QName for attribute identifier: '+mlutil.identify(elemQName, true));
  }
  if (attrQName instanceof QNameDef) {
    this.attribute = attrQName;
  } else {
    throw new Error('invalid attribute QName for identifier: '+mlutil.identify(attrQName, true));
  }
}
/**
 * Builds a query with matching and boosting subqueries.
 * @method
 * @memberof queryBuilder#
 * @param {queryBuilder.Query} matchingQuery - a query that must match
 * the result documents
 * @param {queryBuilder.Query} boostingQuery - a query that increases
 * the ranking when qualifying result documents
 * @returns {queryBuilder.Query} a composable query
 */
function boost() {
  var args = mlutil.asArray.apply(null, arguments);
  switch(args.length) {
  case 0:
    throw new Error('missing matching and boosting queries');
  case 1:
    throw new Error('has matching but missing boosting query: '+mlutil.identify(args[0], true));
  case 2:
    return new BoostDef(new MatchingBoostingDef(args[0], args[1]));
  default:
    throw new Error('too many arguments for boost(): '+args.length);
  }
}
/** @ignore */
function BoostDef(matchingBoosting) {
  if (!(this instanceof BoostDef)) {
    return new BoostDef(matchingBoosting);
  }

  if (matchingBoosting instanceof MatchingBoostingDef) {
    this['boost-query'] = matchingBoosting;
  } else {
    throw new Error('invalid boost() query: '+mlutil.identify(matchingBoosting, true));
  }
}
util.inherits(BoostDef, QueryDef);
/** @ignore */
function MatchingBoostingDef(matching, boosting) {
  if (!(this instanceof MatchingBoostingDef)) {
    return new MatchingBoostingDef(matching, boosting);
  }

  if (!valcheck.isNullOrUndefined(matching)) {
    this['matching-query'] = checkQuery(matching);
  } else {
    throw new Error('missing matching query');
  }

  if (!valcheck.isNullOrUndefined(boosting)) {
    this['boosting-query'] = checkQuery(boosting);
  } else {
    throw new Error('missing boosting query');
  }
}
/**
 * Specifies a rectangular region with the coordinates of the corners.
 * The coordinates can be specified either by passing the return value
 * from the {@link queryBuilder#southWestNorthEast} function or as a list
 * of {queryBuilder.LatLon} coordinates in South, West, North, and East order.
 * @method
 * @memberof queryBuilder#
 * @param {queryBuilder.LatLon} south - the south coordinate of the box
 * @param {queryBuilder.LatLon} west - the west coordinate for the box
 * @param {queryBuilder.LatLon} north - the north coordinate for the box
 * @param {queryBuilder.LatLon} east - the east coordinate for the box
 * @returns {queryBuilder.Region} the region criteria for a geospatial query
 */
function box() {
  var args = mlutil.asArray.apply(null, arguments);
  switch(args.length) {
  case 0:
    throw new Error('missing four corners for box');
  case 1:
    if (args[0] instanceof BoxDef) {
      return new BoxRegionDef(args[0]);
    }
    throw new Error('invalid box corners: '+mlutil.identify(args[0], true));
  case 2:
    throw new Error('has two corners but missing two corners for box');
  case 3:
    throw new Error('has three corners but missing one corner for box');
  case 4:
    return new BoxRegionDef(new BoxDef(args[0], args[1], args[2], args[3]));
  default:
    throw new Error('too many arguments for box: '+args.length);
  }
}
/** @ignore */
function BoxRegionDef(box) {
  if (!(this instanceof BoxRegionDef)) {
    return new BoxRegionDef(box);
  }

  if (box instanceof BoxDef) {
    this.box = box;
  } else if (valcheck.isNullOrUndefined(box)) {
    throw new Error('missing definition for box region');
  } else {
    throw new Error('invalid definition for box region: '+mlutil.identify(box, true));
  }
}
/**
 * Specifies a circular region based on a radius and the coordinate of the center.
 * The coordinate can either be specified by passing the return value from
 * the {@link queryBuilder#latlon} function or by passing the latitude and longitude
 * numbers in that order (possibly wrapped in an array).
 * @method
 * @memberof queryBuilder#
 * @param {number} radius - the radius for the circle
 * @param {queryBuilder.LatLon} center - the center for the circle
 * @returns {queryBuilder.Region} the region criteria for a geospatial query
 */
function circle() {
  var args = mlutil.asArray.apply(null, arguments);
  var arg = null;
  switch(args.length) {
  case 0:
    throw new Error('missing radius and center for circle');
  case 1:
    throw new Error('has radius but missing center for circle');
  case 2:
    arg = args[1];
    if (arg instanceof PointRegionDef) {
      if (arg.point.length === 1) {
        return new CircleRegionDef(new CircleDef(args[0], arg.point));
      }
    } else if (arg instanceof LatLongDef) {
      return new CircleRegionDef(new CircleDef(args[0], [arg]));
    } else if (valcheck.isArray(arg) && arg.length === 2) {
      return new CircleRegionDef(new CircleDef(
          args[0], [new LatLongDef(arg[0], arg[1])]
          ));
    }
    throw new Error('invalid center for circle: '+mlutil.identify(arg, true));
  case 3:
    return new CircleRegionDef(new CircleDef(
        args[0], [new LatLongDef(args[1], args[2])]
        ));
  default:
    throw new Error('too many arguments for circle: '+args.length);
  }
}
/** @ignore */
function CircleRegionDef(circle) {
  if (!(this instanceof CircleRegionDef)) {
    return new CircleRegionDef(circle);
  }

  if (circle instanceof CircleDef) {
    this.circle = circle;
  } else if (valcheck.isNullOrUndefined(circle)) {
    throw new Error('missing definition for circle region');
  } else {
    throw new Error('invalid definition for circle region: '+mlutil.identify(circle, true));
  }
}
/** @ignore */
function CircleDef(radius, center) {
  if (!(this instanceof CircleDef)) {
    return new CircleDef(radius, center);
  }

  if (valcheck.isNumber(radius)) {
    this.radius = radius;
  } else if (valcheck.isNullOrUndefined(radius)) {
    throw new Error('missing radius for circle');
  } else {
    throw new Error('invalid radius for circle: '+mlutil.identify(radius, true));
  }

  if (valcheck.isArray(center) && center.length === 1 && center[0] instanceof LatLongDef) {
    this.point = center;
  } else if (valcheck.isNullOrUndefined(center)) {
    throw new Error('missing center for circle');
  } else {
    throw new Error('invalid center for circle: '+mlutil.identify(center, true));
  }
}
/**
 * Builds a query matching documents in one or more collections as part
 * of a document query.  The collections can be specified as arguments or
 * parsed from a query string based on a binding. Also, as part of a values
 * query, the collection() function identifies the collection index
 * without supplying criteria. In a values query, the tuples (aka rows)
 * projected from each document have a column whose values are the
 * collections to which the document belongs.
 * @method
 * @memberof queryBuilder#
 * @param {string|string[]|queryBuilder.BindingParam} collections - either
 * one or more collection uris to match or exactly one binding (returned
 * by the {@link queryBuilder#bind} function) for parsing the collection
 * uris from a query string; required except for values queries
 * @param {string} [prefix] - a prefix to prepend to each value provided by
 * the parsed query string; can be provided only when providing a binding
 * @returns {queryBuilder.Query} a composable query
 */
function collection() {
  var args = mlutil.asArray.apply(null, arguments);
  var argLen = args.length;

  if (argLen === 0) {
    return new CollectionConstraintDef(null, null, null);
  }

  var constraintName = null;
  var suggestOptions = null;
  var prefix = null;
  var arg = null;
  var i = 0;
  for (; i < argLen; i++) {
    arg = args[i];
    if (constraintName === null && arg instanceof BindDef) {
      constraintName = arg.constraintName;
      continue;
    }
    if (suggestOptions === null && arg instanceof SuggestOptionsDef) {
      suggestOptions = arg['suggest-option'];
      continue;
    }
    if (argLen < 4 && prefix === null && valcheck.isString(arg)) {
      prefix = arg;
      continue;
    }
    break;
  }

  if (!valcheck.isNullOrUndefined(constraintName)) {
    if (i < argLen) {
      throw new Error('collection has both query and binding: '+mlutil.identify(args, true));
    }

    return new CollectionConstraintDef(
        constraintName, suggestOptions, new CollectionQualifierDef(prefix)
        );
  }

  if (!valcheck.isNullOrUndefined(suggestOptions)) {
    throw new Error('collection has both query and suggest options: '+mlutil.identify(args, true));
  }

  return new CollectionQueryDef(
      new UrisDef(args, null)
      );
}
/** @ignore */
function CollectionConstraintDef(constraintName, suggestOptions, qualifierDef) {
  if (!(this instanceof CollectionConstraintDef)) {
    return new CollectionConstraintDef(qualifierDef);
  }

  if (constraintName === null && suggestOptions === null && qualifierDef === null) {
    this.collection = null;
  } else {
    if (qualifierDef instanceof CollectionQualifierDef) {
      this.collection = qualifierDef;
    } else if (valcheck.isNullOrUndefined(qualifierDef)) {
      throw new Error('missing qualifier definition for collection binding');
    } else {
      throw new Error('invalid qualifier definition for collection binding: '+
          mlutil.identify(qualifierDef, true));
    }

    addConstraint(this, constraintName, suggestOptions);
  }
}
/** @ignore */
function CollectionQualifierDef(prefix) {
  if (!(this instanceof CollectionQualifierDef)) {
    return new CollectionQualifierDef(prefix);
  }

  if (valcheck.isString(prefix)) {
    this.prefix = prefix;
  } else if (!valcheck.isNullOrUndefined(prefix)) {
    throw new Error('invalid prefix for collection binding: '+mlutil.identify(prefix, true));
  }

  this.facet = false;
}
/** @ignore */
function CollectionQueryDef(uriList) {
  if (!(this instanceof CollectionQueryDef)) {
    return new CollectionQueryDef(uriList);
  }

  if (uriList instanceof UrisDef) {
    this['collection-query'] = uriList;
  } else {
    throw new Error('invalid uri list for collection(): '+mlutil.identify(uriList, true));
  }
}
util.inherits(CollectionQueryDef, QueryDef);
/**
 * Builds a query matching temporal documents with a system start time
 * prior to the LSQT (Latest System Query Time). Advancing the LSQT can be
 * done manually or on an automated basis to include more recent
 * temporal documents in the result set.
 * @method
 * @memberof queryBuilder#
 * @param {string} temporalCollection - the name of the temporal collection
 * that retains the temporal documents
 * @param {queryBuilder.WeightParam} [weight] - a weight returned
 * by {@link queryBuilder#weight} to increase or decrease the score
 * of subqueries relative to other queries in the complete search
 * @param {string|Date} [timestamp] - a datetime older than the LSQT
 * to use as the upper boundary for an older view of the database
 * @param {queryBuilder.TemporalOptionsParam} [temporalOptions] - a list
 * of options returned by {@link queryBuilder#temporalOptions} to modify
 * the temporal query
 * @returns {queryBuilder.Query} a composable query
 */
function lsqtQuery() {
  var args = mlutil.asArray.apply(null, arguments);
  var argLen = args.length;
  if (argLen < 1) {
    throw new Error('no temporal collection for lsqt query');
  }

  var temporalCollection = null;
  var weight = null;
  var timestamp = null;
  var temporalOptions = null;
  var arg = null;
  for (var i=0; i < args.length; i++) {
    arg = args[i];
    if (i === 0) {
      if (!valcheck.isString(arg)) {
        throw new Error('first argument for lsqt query must be temporal collection: '+
            mlutil.identify(arg, true));
      }
      temporalCollection = arg;
      continue;
    }
    if (weight === null && arg instanceof WeightDef) {
      weight = arg.weight;
      continue;
    }
    if (timestamp === null) {
      if (valcheck.isString(arg)){
        timestamp = arg;
        continue;
      } else if (valcheck.isDate(arg)){
        timestamp = arg.toISOString();
        continue;
      }
    }
    if (temporalOptions === null && arg instanceof TemporalOptionsDef) {
      temporalOptions = arg['temporal-option'];
      continue;
    }
    throw new Error('unknown argument for lsqt query: '+mlutil.identify(arg, true));
  }

  return new LSQTDef(
      new LSQTQueryDef(temporalCollection, weight, timestamp, temporalOptions)
      );
}
/** @ignore */
function LSQTDef(queryDef) {
  if (!(this instanceof LSQTDef)) {
    return new LSQTDef(queryDef);
  }

  if (queryDef instanceof LSQTQueryDef) {
    this['lsqt-query'] = queryDef;
  } else if (valcheck.isNullOrUndefined(queryDef)) {
    throw new Error('missing LSQT query definition');
  } else {
    throw new Error('invalid LSQT query definition: '+mlutil.identify(queryDef, true));
  }
}
util.inherits(LSQTDef, QueryDef);
/** @ignore */
function LSQTQueryDef(temporalCollection, weight, timestamp, temporalOptions) {
  if (!(this instanceof LSQTQueryDef)) {
    return new LSQTQueryDef(temporalCollection, weight, timestamp, temporalOptions);
  }

  if (valcheck.isString(temporalCollection)) {
    this['temporal-collection'] = temporalCollection;
  } else if (valcheck.isNullOrUndefined(temporalCollection)) {
    throw new Error('missing temporal collection');
  } else {
    throw new Error('invalid temporal collection: '+mlutil.identify(temporalCollection, true));
  }
  if (!valcheck.isNullOrUndefined(weight)) {
    if (valcheck.isNumber(weight)) {
      this.weight = weight;
    } else {
      throw new Error('invalid weight: '+mlutil.identify(weight, true));
    }
  }
  if (!valcheck.isNullOrUndefined(timestamp)) {
    if (valcheck.isString(timestamp)) {
      this.timestamp = timestamp;
    } else {
      throw new Error('invalid timestamp: '+mlutil.identify(timestamp, true));
    }
  }
  if (!valcheck.isNullOrUndefined(temporalOptions)) {
    this['temporal-option'] = temporalOptions;
  }
}
/**
 * Builds a query naming a JSON property or XML element that must contain
 * the matches for a subquery (which may be a composer query such as those
 * returned by the {@link queryBuilder#and} and {@link queryBuilder#or}).
 * @method
 * @memberof queryBuilder#
 * @param {string|queryBuilder.IndexedName} propertyOrElement - the JSON
 * property or XML element that contains the query matches; a string is
 * treated as a JSON property
 * @param {queryBuilder.Query|queryBuilder.BindingParam} query - either the
 * query that must match within the scope of the JSON property or XML element
 * or a binding (returned by the {@link queryBuilder#bind} function) for
 * parsing the subquery from a query string
 * @param {queryBuilder.FragmentScopeParam} [fragmentScope] - whether the query
 * applies to document content (the default) or document metadata properties
 * as returned by the {@link queryBuilder#fragmentScope} function
 * @returns {queryBuilder.Query} a composable query
 */
function scope() {
  var args = mlutil.asArray.apply(null, arguments);
  if (args.length < 1) {
    throw new Error('element or property scope not specified');
  }

  var index = null;
  var constraintName = null;
  var fragmentScope = null;
  var query = null;
  var arg = null;
  for (var i=0; i < args.length; i++) {
    arg = args[i];
    if (i === 0) {
      index = asIndex(arg);
      continue;
    }
    if (fragmentScope === null && arg instanceof FragmentScopeDef) {
      fragmentScope = arg['fragment-scope'];
      continue;
    }
    if (constraintName === null && arg instanceof BindDef) {
      constraintName = arg.constraintName;
      continue;
    }
    // TODO: validate arg is a query
    if (query === null) {
      query = arg;
      continue;
    }
    throw new Error('unknown argument for scope: '+mlutil.identify(arg, true));
  }

  if (!valcheck.isNullOrUndefined(query)) {
    if (!valcheck.isNullOrUndefined(constraintName)) {
      throw new Error('scope has both binding and query: '+mlutil.identify(args, true));
    }

    return new ContainerQueryDef(
        new ContainedDef(index, fragmentScope, query)
        );
  }

  if (valcheck.isNullOrUndefined(constraintName)) {
    constraintName = defaultConstraintName(index);
    if (valcheck.isNullOrUndefined(constraintName)) {
      throw new Error('could not default constraint name from '+
          Object.keys(index).join(', ') + ' index'
          );
    }
  }

  return new ContainerConstraintDef(
      constraintName,
      new ContainedDef(index, fragmentScope, null)
      );
}
/** @ignore */
function ContainerConstraintDef(constraintName, containedDef) {
  if (!(this instanceof ContainerConstraintDef)) {
    return new ContainerConstraintDef(containedDef);
  }

  if (valcheck.isString(constraintName)) {
    this.name = constraintName;
  } else if (valcheck.isNullOrUndefined(constraintName)) {
    throw new Error('missing constraint name for container');
  } else {
    throw new Error('invalid constraint name for container: '+mlutil.identify(constraintName, true));
  }
  if (containedDef instanceof ContainedDef) {
    this.container = containedDef;
  } else if (valcheck.isNullOrUndefined(containedDef)) {
    throw new Error('missing contained definition for container binding');
  } else {
    throw new Error('invalid contained definition for container binding: '+mlutil.identify(containedDef, true));
  }
}
/** @ignore */
function ContainerQueryDef(containedDef) {
  if (!(this instanceof ContainerQueryDef)) {
    return new ContainerQueryDef(containedDef);
  }

  if (containedDef instanceof ContainedDef) {
    this['container-query'] = containedDef;
  } else if (valcheck.isNullOrUndefined(containedDef)) {
    throw new Error('missing contained definition for container query');
  } else {
    throw new Error('invalid contained definition for container query: '+mlutil.identify(containedDef, true));
  }
}
util.inherits(ContainerQueryDef, QueryDef);
/** @ignore */
function ContainedDef(index, fragmentScope, query) {
  if (!(this instanceof ContainedDef)) {
    return new ContainedDef(index, fragmentScope, query);
  }

  if (!valcheck.isNullOrUndefined(index)) {
    addIndex(this, index, true);
  } else {
    throw new Error('missing JSON property or XML element');
  }
  if (!valcheck.isNullOrUndefined(fragmentScope)) {
    this['fragment-scope'] = fragmentScope;
  }
  if (!valcheck.isNullOrUndefined(query)) {
    var queryKeys = Object.keys(query);
    var queryKey = null;
    for (var i=0; i < queryKeys.length; i++) {
      queryKey = queryKeys[i];
      this[queryKey] = query[queryKey];
    }
  }
}
/**
 * The datatype specification returned by the {@link queryBuilder#datatype}
 * function.
 * @typedef {object} queryBuilder.DatatypeParam
 */
/**
 * Identifies the datatype of an index.
 * @method
 * @memberof queryBuilder#
 * @param {string} datatype - a value from the enumeration
 * int|unsignedInt|long|unsignedLong|float|double|decimal|dateTime|time|date|gYearMonth|gYear|gMonth|gDay|yearMonthDuration|dayTimeDuration|string|anyURI|point
 * @param {string} [collation] - a URI identifying the comparison method for a string or anyURI datatype
 * @returns {queryBuilder.DatatypeParam} a datatype specification
 */
function datatype() {
  var args = mlutil.asArray.apply(null, arguments);
  switch(args.length) {
  case 0:
    throw new Error('missing datatype');
  case 1:
    return new DatatypeDef(args[0]);
  case 2:
    return new DatatypeDef(args[0], args[1]);
  default:
    throw new Error('too many arguments for datatype: '+args.length);
  }
}
/** @ignore */
function DatatypeDef(datatype, collation) {
  if (!(this instanceof DatatypeDef)) {
    return new DatatypeDef(datatype, collation);
  }

  if (valcheck.isString(datatype)) {
    this.datatype = (datatype.indexOf(':') !== -1) ? datatype : 'xs:'+datatype;
  } else if (valcheck.isNullOrUndefined(datatype)) {
    throw new Error('missing datatype');
  } else {
    throw new Error('invalid datatype: '+mlutil.identify(datatype, true));
  }

  if (valcheck.isString(collation)) {
    this.collation = collation;
  } else  if (!valcheck.isNullOrUndefined(collation)) {
    throw new Error('invalid collation for datatype: '+mlutil.identify(collation, true));
  }
}
/**
 * Builds a query matching documents in one or more database directories.
 * @method
 * @memberof queryBuilder#
 * @param {string|string[]} uris - one or more directory uris
 * to match
 * @param {boolean} [infinite] - whether to match documents at the top level or
 * at any level of depth within the specified directories
 * @returns {queryBuilder.Query} a composable query
 */
function directory() {
  var args = mlutil.asArray.apply(null, arguments);

  var uris = [];
  var infinite = null;
  var arg = null;
  for (var i=0; i < args.length; i++) {
    arg = args[i];
    if (infinite === null && valcheck.isBoolean(arg)) {
      infinite = arg;
    } else if (arg instanceof Array){
      Array.prototype.push.apply(uris, arg);
    } else {
      uris.push(arg);
    }
  }

  return new DirectoryQueryDef(
      new UrisDef(uris, infinite)
      );
}
/** @ignore */
function DirectoryQueryDef(uriList) {
  if (!(this instanceof DirectoryQueryDef)) {
    return new DirectoryQueryDef(uriList);
  }

  if (uriList instanceof UrisDef) {
    this['directory-query'] = uriList;
  } else {
    throw new Error('invalid uri list for directory(): '+mlutil.identify(uriList, true));
  }
}
util.inherits(DirectoryQueryDef, QueryDef);
/**
 * Builds a query matching documents.
 * @method
 * @memberof queryBuilder#
 * @param {string|string[]} uris - one or more document uris
 * to match
 * @returns {queryBuilder.Query} a composable query
 */
function document() {
  return new DocumentDef(
      new UrisDef(mlutil.asArray.apply(null, arguments), null)
      );
}
/** @ignore */
function DocumentDef(uriList) {
  if (!(this instanceof DocumentDef)) {
    return new DocumentDef(uriList);
  }

  if (uriList instanceof UrisDef) {
    this['document-query'] = uriList;
  } else {
    throw new Error('invalid uri list for document(): '+mlutil.identify(uriList, true));
  }
}
util.inherits(DocumentDef, QueryDef);
/** @ignore */
function UrisDef(uris, infinite) {
  if (!(this instanceof UrisDef)) {
    return new UrisDef(uris, infinite);
  }

  if (!valcheck.isArray(uris)) {
    throw new Error('invalid uri list: '+mlutil.identify(uris, true));
  } else if (uris.length === 0) {
    throw new Error('empty uri list');
  } else {
    this.uri = uris;
  }
  if (!valcheck.isNullOrUndefined(infinite)) {
    if (!valcheck.isBoolean(infinite)) {
      throw new Error('infinite flag must be boolean: '+mlutil.identify(infinite, true));
    } else {
      this.infinite = infinite;
    }
  }
}
/**
 * Builds a query that applies the subquery to document content by contrast
 * with the {@link queryBuilder#properties} function.
 * @method
 * @memberof queryBuilder#
 * @param {queryBuilder.Query} query - the query that must match document content
 * @returns {queryBuilder.Query} a composable query
 */
function documentFragment() {
  return new DocumentFragmentDef(mlutil.first.apply(null, arguments));
}
/** @ignore */
function DocumentFragmentDef(query) {
  if (!(this instanceof DocumentFragmentDef)) {
    return new DocumentFragmentDef(query);
  }

  if (!valcheck.isNullOrUndefined(query)) {
    this['document-fragment-query'] = checkQuery(query);
  } else {
    throw new Error('missing query');
  }
}
util.inherits(DocumentFragmentDef, QueryDef);
/**
 * Specifies an XML element for a query.  A name without a namespace can be
 * expressed as a string.  A namespaced name can be expressed as a two-item
 * array with uri and name strings or as an object returned by the
 * {@link queryBuilder#qname} function.
 * @method
 * @memberof queryBuilder#
 * @param {string|string[]|queryBuilder.QName} name - the name of the element
 * @returns {queryBuilder.IndexedName} an indexed name for specifying a query
 */
function element() {
  var args = mlutil.asArray.apply(null, arguments);
  switch(args.length) {
  case 0:
    throw new Error('missing element name');
  case 1:
    if (args[0] instanceof QNameDef) {
      return new ElementDef(args[0]);
    }
    return new ElementDef(new QNameDef(null, args[0]));
  case 2:
    return new ElementDef(new QNameDef(args[0], args[1]));
  default:
    throw new Error('too many arguments for element identifier: '+args.length);
 }
}
/** @ignore */
function ElementDef(qname) {
  if (!(this instanceof ElementDef)) {
    return new ElementDef(qname);
  }

  if (qname instanceof QNameDef) {
    this.element = qname;
  } else if (valcheck.isNullOrUndefined(qname)) {
    throw new Error('missing QName for element identifier');
  } else {
    throw new Error('invalid QName for element identifier: '+mlutil.identify(qname, true));
  }
}
/**
 * Specifies a field for a query.
 * @method
 * @memberof queryBuilder#
 * @param {string} name - the name of the field
 * @param {string} [collation] - the collation of a field over strings
 * @returns {queryBuilder.IndexedName} an indexed name for specifying a query
 */
function field() {
  var args = mlutil.asArray.apply(null, arguments);
  switch(args.length) {
  case 0:
    throw new Error('missing field name');
  case 1:
    return new FieldDef(new FieldNameDef(args[0]));
  case 2:
    return new FieldDef(new FieldNameDef(args[0], args[1]));
  default:
    throw new Error('too many arguments for field identifier: '+args.length);
 }
}
/** @ignore */
function FieldDef(name) {
  if (!(this instanceof FieldDef)) {
    return new FieldDef(name);
  }

  if (name instanceof FieldNameDef) {
    this.field = name;
  } else if (valcheck.isNullOrUndefined(name)) {
    throw new Error('missing name for field identifier');
  } else {
    throw new Error('invalid name for field identifier: '+mlutil.identify(name, true));
  }
}
/** @ignore */
function FieldNameDef(name, collation) {
  if (!(this instanceof FieldNameDef)) {
    return new FieldNameDef(name, collation);
  }

  if (valcheck.isString(name)) {
    this.name = name;
  } else if (valcheck.isNullOrUndefined(name)) {
    throw new Error('missing name for field');
  } else {
    throw new Error('invalid name for field: '+mlutil.identify(name, true));
  }
  if (valcheck.isString(collation)) {
    this.collation = collation;
  } else  if (!valcheck.isNullOrUndefined(collation)) {
    throw new Error('invalid collation for field: '+mlutil.identify(collation, true));
  }
}
/**
 * A query argument specifying whether queries match documents based on
 * document content or document metadata properties; returned
 * by the {@link queryBuilder#fragmentScope} function.
 * @typedef {object} queryBuilder.FragmentScopeParam
 */
/**
 * Configures a query to match documents based on document content or
 * document metadata properties.
 * @method
 * @memberof queryBuilder#
 * @param {string} scopeType - a value from the documents|properties
 * enumeration where 'documents' queries document content and
 * 'properties' queries document metadata properties
 * @returns {queryBuilder.FragmentScopeParam} a fragment scope specification
 */
function fragmentScope() {
  return new FragmentScopeDef(mlutil.first.apply(null, arguments));
}
/** @ignore */
function FragmentScopeDef(scope) {
  if (!(this instanceof FragmentScopeDef)) {
    return new FragmentScopeDef(scope);
  }

  if (scope === 'documents' || scope === 'properties') {
    this['fragment-scope'] = scope;
  } else if (valcheck.isNullOrUndefined(scope)) {
    throw new Error('missing scope for fragment scope');
  } else {
    throw new Error('invalid scope for fragment scope: '+mlutil.identify(scope, true));
  }
}
/**
 * Specifies the geospatial locations represented by an XML attribute pair
 * for passing to the {@link queryBuilder#geospatial} function.
 * @method
 * @memberof queryBuilder#
 * @param {string|queryBuilder.QName} parent - the name of the element
 * containing the attributes as returned by the {@link queryBuilder#qname} function
 * @param {string|queryBuilder.QName} latitude - the name of the latitude
 * attribute as returned by the {@link queryBuilder#qname} function
 * @param {string|queryBuilder.QName} longitude -  the name of the longitude
 * attribute as returned by the {@link queryBuilder#qname} function
 * @returns {queryBuilder.GeoLocation} the specification for the geospatial locations
 */
function geoAttributePair() {
  var args = mlutil.asArray.apply(null, arguments);
  if (args.length < 2) {
    throw new Error('need at least two parameters for geospatial attribute pair query');
  }

  var location = {};

  var keys = ['parent', 'lat', 'lon'];
  var iArg=0;
  for (var i=0; i < keys.length; i++) {
    var key = keys[i];
    var arg = args[iArg++];
    if (arg instanceof QNameDef) {
      location[key] = arg;
    } else if (valcheck.isString(arg)) {
      location[key] = new QNameDef(null, arg);
    } else if (arg instanceof ElementDef) {
      location.parent = arg.element;
    } else if (arg instanceof AttributeDef) {
      if (key === 'parent' || !location.parent) {
        location.parent = arg.element;
        i++;
      }
      location[keys[i]] = arg.attribute;
    } else {
      throw new Error('no parameter for '+key+': '+JSON.stringify(arg));
    }
  }

  return {'geo-attr-pair': location};
}
/**
 * Specifies the geospatial locations represented by an XML element
 * containing a comma-separated pair of latitude-longitude values
 * for passing to the {@link queryBuilder#geospatial} function.
 * @method
 * @memberof queryBuilder#
 * @param {string|queryBuilder.QName} [parent] - the optional name of the parent
 * of the geospatial element as returned by the {@link queryBuilder#qname} function
 * @param {string|queryBuilder.QName} element - the name of the element
 * as returned by the {@link queryBuilder#qname} function
 * @returns {queryBuilder.GeoLocation} the specification for the geospatial locations
 */
function geoElement() {
  var args = mlutil.asArray.apply(null, arguments);
  var argLen = args.length;
  if (argLen < 1) {
    throw new Error('need at least one parameter for geospatial element query');
  }

  var location = {};

// TODO: elementName
  var maxIndex = Math.min(argLen, 2);
  var elemName = null;
  var arg = null;
  var i=0;
  while (i < maxIndex) {
    arg = args[i];
    if (arg instanceof QNameDef) {
    } else if (valcheck.isString(arg)) {
      arg = new QNameDef(null, arg);
    } else if (arg instanceof ElementDef) {
      arg = arg.element;
    } else {
      break;
    }
    if (elemName !== null) {
      location.parent = elemName;
    }
    elemName = arg;
    i++;
  }
  if (elemName === null) {
    throw new Error('element name required for geospatial location: '+mlutil.identify(args, true));
  }
  location.element = elemName;
  elemName = null;

  return {'geo-elem': location};
}
/**
 * Specifies the geospatial locations represented by an XML element pair
 * for passing to the {@link queryBuilder#geospatial} function.
 * @method
 * @memberof queryBuilder#
 * @param {string|queryBuilder.QName} parent - the name of the containing
 * parent element as returned by the {@link queryBuilder#qname} function
 * @param {string|queryBuilder.QName} latitude - the name of the latitude
 * element as returned by the {@link queryBuilder#qname} function
 * @param {string|queryBuilder.QName} longitude -  the name of the longitude
 * element as returned by the {@link queryBuilder#qname} function
 * @returns {queryBuilder.GeoLocation} the specification for the geospatial locations
 */
function geoElementPair() {
  var args = mlutil.asArray.apply(null, arguments);
  if (args.length < 2) {
    throw new Error('need at least two parameters for geospatial element pair query');
  }

  var location = {};

  var keys = ['parent', 'lat', 'lon'];
  var key = null;
  var arg = null;
  for (var i=0; i < keys.length; i++) {
    key = keys[i];
    arg = args[i];
    if (arg instanceof QNameDef) {
      location[key] = arg;
    } else if (valcheck.isString(arg)) {
      location[key] = new QNameDef(null, arg);
    } else if (arg instanceof ElementDef) {
      location[key] = arg.element;
    } else {
      throw new Error('no parameter for '+key+': '+JSON.stringify(arg));
    }
  }

  return {'geo-elem-pair': location};
}
/**
 * Specifies the geospatial locations represented by a JSON property
 * containing a pair of latitude-longitude values for passing to
 * the {@link queryBuilder#geospatial} function.
 * @method
 * @memberof queryBuilder#
 * @param {string} [parent] - the optional name of the parent
 * of the geospatial property
 * @param {string} element - the name of the geospatial property
 * @returns {queryBuilder.GeoLocation} the specification for the geospatial locations
 */
function geoProperty() {
  var args = mlutil.asArray.apply(null, arguments);
  var argLen = args.length;
  if (argLen < 1) {
    throw new Error('need at least one parameters for geospatial property query');
  }

  var location = {};

  var maxIndex = Math.min(argLen, 2);
  var propName = null;
  var arg = null;
  var i=0;
  while (i < maxIndex) {
    arg = args[i];
    if (arg instanceof JSONPropertyDef) {
      arg = arg['json-property'];
    } else if (!valcheck.isString(arg)) {
      break;
    }
    if (propName !== null) {
      location['parent-property'] = propName;
    }
    propName = arg;
    i++;
  }
  if (propName === null) {
    throw new Error('property name required for geospatial location: '+mlutil.identify(args, true));
  }
  location['json-property'] = propName;
  propName = null;

  return {'geo-json-property': location};
}
/**
 * Specifies the geospatial locations represented by a JSON property pair
 * for passing to the {@link queryBuilder#geospatial} function.
 * @method
 * @memberof queryBuilder#
 * @param {string} parent - the name of the containing parent property
 * @param {string} latitude - the name of the latitude property
 * @param {string} longitude -  the name of the longitude property
 * @returns {queryBuilder.GeoLocation} the specification for the geospatial locations
 */
function geoPropertyPair() {
  var args = mlutil.asArray.apply(null, arguments);
  if (args.length < 2) {
    throw new Error('need at least two parameters for geospatial property pair query');
  }

  var location = {};

  var keys = ['parent-property', 'lat-property', 'lon-property'];
  var key = null;
  var arg = null;
  for (var i=0; i < keys.length; i++) {
    key = keys[i];
    arg = args[i];
    if (valcheck.isString(arg)) {
      location[key] = arg;
    } else if (arg instanceof JSONPropertyDef) {
      location[key] = arg['json-property'];
    } else {
      throw new Error('no parameter for '+key+': '+JSON.stringify(arg));
    }
  }

  return {'geo-json-property-pair': location};
}
/**
 * Specifies the geospatial locations represented by a path index on
 * JSON properties or XML elements containing a pair of latitude-longitude values
 * for passing to the {@link queryBuilder#geospatial} function.
 * @method
 * @memberof queryBuilder#
 * @param {string|object} path - the XPath for the path index as a string or
 * as the return value of the {@link queryBuilder#pathIndex} function
 * @returns {queryBuilder.GeoLocation} the specification for the geospatial locations
 */
function geoPath() {
  var args = mlutil.asArray.apply(null, arguments);
  if (args.length < 1) {
    throw new Error('need at least one parameter for geospatial path query');
  }

  var location = {};

  var arg = args[0];
  if (arg instanceof PathIndexDef) {
    location['path-index'] = arg['path-index'];
  } else if (args.length === 2 && valcheck.isString(args[0])) {
    location['path-index'] = new PathDef(args[0], args[1]);
  } else if (valcheck.isString(arg)) {
    location['path-index'] = new PathDef(arg);
  }

  return {'geo-path': location};
}
/**
 * Builds a geospatial query or facet. For a query, you must supply
 * either the {queryBuilder.Region} criteria or a binding to parse
 * the region criteria from a query string but not both.
 * @method
 * @memberof queryBuilder#
 * @param {queryBuilder.GeoLocation} location - the JSON property or XML element
 * representing the geospatial locations
 * @param {queryBuilder.FragmentScopeParam} [fragmentScope] - whether the query
 * applies to document content (the default) or document metadata properties
 * as returned by the {@link queryBuilder#fragmentScope} function
 * @param {queryBuilder.GeoOptionsParam} [geoOptions] - a list
 * of options returned by {@link queryBuilder#geoOptions} to modify
 * the geospatial query
 * @param {queryBuilder.Region|queryBuilder.BindingParam} [criteria] - either
 * a point matching or region containing geospatial locations in the documents
 * or a binding (returned by the {@link queryBuilder#bind} function) for parsing
 * the point or region from a query string
 * @returns {queryBuilder.Query} a composable query
 */
function geospatial() {
  var args = mlutil.asArray.apply(null, arguments);
  if (args.length < 1) {
    throw new Error('need at least one parameter for geospatial query');
  }

  var isGeoLocationIndex = {
    'geo-attr-pair':          true,
    'geo-elem':               true,
    'geo-elem-pair':          true,
    'geo-json-property':      true,
    'geo-json-property-pair': true,
    'geo-path':               true
  };

  var query = null;
  var variant = null;
  var constraintName = null;
  var suggestOptions = null;
  var seekingFragmentScope = true;
  var seekingGeoOption = true;
  var seekingRegion = true;
  var firstKey = null;
  var arg = null;
  var i=0;
  for (; i < args.length; i++) {
    arg = args[i];
    if (i === 0) {
      firstKey = Object.keys(arg)[0];
      if (isGeoLocationIndex[firstKey]) {
        variant = firstKey;
        query = arg[firstKey];
        continue;
      }
      throw new Error('unknown geospatial location: '+mlutil.identify(firstKey, true));
    }
    if (seekingGeoOption && arg instanceof GeoOptionsDef) {
      query['geo-option'] = arg['geo-option'];
      seekingGeoOption = false;
      continue;
    }
    if (seekingFragmentScope && arg instanceof FragmentScopeDef) {
      query['fragment-scope'] = arg['fragment-scope'];
      seekingFragmentScope = false;
      continue;
    }
    if (constraintName === null && arg instanceof BindDef) {
      constraintName = arg.constraintName;
      continue;
    }
    if (suggestOptions === null && arg instanceof SuggestOptionsDef) {
      suggestOptions = arg['suggest-option'];
      continue;
    }
    if (seekingRegion) {
      if (arg instanceof BoxRegionDef) {
        query.box = arg.box;
        seekingRegion = false;
        continue;
      } else if (arg instanceof CircleRegionDef) {
        query.circle = arg.circle;
        seekingRegion = false;
        continue;
      } else if (arg instanceof PointRegionDef) {
        query.point = arg.point;
        seekingRegion = false;
        continue;
      } else if (arg instanceof LatLongDef) {
        query.point = [arg];
        seekingRegion = false;
        continue;
      } else if (arg instanceof PolygonRegionDef) {
        query.polygon = arg.polygon;
        seekingRegion = false;
        continue;
      } else if (arg instanceof Array && arg.length === 2) {
        query.point = [new LatLongDef(arg[0], arg[1])];
        seekingRegion = false;
        continue;
      }
    }
    throw new Error('unknown geospatial argument: '+mlutil.identify(arg, true));
  }

  if (seekingRegion === false) {
    if (!valcheck.isNullOrUndefined(constraintName)) {
      throw new Error(variant+' has both query and binding: '+mlutil.identify(args, true));
    }
    if (!valcheck.isNullOrUndefined(suggestOptions)) {
      throw new Error(variant+' has both query and suggest options: '+mlutil.identify(args, true));
    }

    return new GeospatialQueryDef(variant, query);
  }

  return new GeospatialConstraintDef(variant, query, constraintName, suggestOptions);
}
function GeospatialQueryDef(variant, query) {
  if (!(this instanceof GeospatialQueryDef)) {
    return new GeospatialQueryDef(variant, query);
  }

  if (!valcheck.isNullOrUndefined(query)) {
    this[variant+'-query'] = query;
  } else {
    throw new Error(variant+' missing query');
  }
}
util.inherits(GeospatialQueryDef, QueryDef);
function GeospatialConstraintDef(variant, query, constraintName, suggestOptions) {
  if (!(this instanceof GeospatialConstraintDef)) {
    return new GeospatialConstraintDef(variant, query, constraintName, suggestOptions);
  }

  this[variant] = query;

  if (!valcheck.isNullOrUndefined(constraintName)) {
    this.name = constraintName;
  }

  if (!valcheck.isNullOrUndefined(suggestOptions)) {
    this['suggest-option'] = suggestOptions;
  }
}

/**
 * Specifies the buckets for a geospatial facet.
 * @typedef {object} queryBuilder.HeatMapParam
 */
/**
 * Divides a geospatial box into a two-dimensional grid for calculating facets
 * based on document counts for each cell within the grid.
 * The coordinates of the box can be specified either by passing the return value
 * from the {@link queryBuilder#southWestNorthEast} function or as a list
 * of {queryBuilder.LatLon} coordinates in South, West, North, and East order.
 * @method
 * @memberof queryBuilder#
 * @param {number} latdivs - the number of latitude divisions in the grid
 * @param {number} londivs - the number of longitude divisions in the grid
 * @param {queryBuilder.LatLon} south - the south coordinate of the box
 * @param {queryBuilder.LatLon} west - the west coordinate for the box
 * @param {queryBuilder.LatLon} north - the north coordinate for the box
 * @param {queryBuilder.LatLon} east - the east coordinate for the box
 * @returns {queryBuilder.HeatMapParam} the buckets for a geospatial facet
 */
function heatmap() {
  var args = mlutil.asArray.apply(null, arguments);
  var argLen = args.length;
  if (argLen < 1) {
    throw new Error('no region or divisions for heat map');
  }

  var hmap = {};
  switch(argLen) {
  case 3:
    var first  = args[0];
    var second = args[1];
    var third  = args[2];
    var region = null;
    if (valcheck.isObject(first)) {
      region = first;
      hmap.latdivs = second;
      hmap.londivs = third;
    } else if (valcheck.isObject(third)) {
      region = third;
      hmap.latdivs = first;
      hmap.londivs = second;
    } else {
      throw new Error('no first or last region for heat map');
    }

    var keys = ['s', 'w', 'n', 'e'];
    for (var i=0; i < keys.length; i++) {
      var key   = keys[i];
      var value = region[key];
      if (!valcheck.isNullOrUndefined(value)) {
        hmap[key] = value;
        continue;
      } else {
        var altKey = null;
        switch(key) {
        case 's':
          altKey = 'south';
          break;
        case 'w':
          altKey = 'west';
          break;
        case 'n':
          altKey = 'north';
          break;
        case 'e':
          altKey = 'east';
          break;
        }
        value = (altKey !== null) ? region[altKey] : null;
        if (!valcheck.isNullOrUndefined(value)) {
          hmap[key] = value;
          continue;
        }
      }
      throw new Error('heat map does not have '+key+' key');
    }
    break;
  case 6:
    hmap.latdivs = args[0];
    hmap.londivs = args[1];
    hmap.s = args[2];
    hmap.w = args[3];
    hmap.n = args[4];
    hmap.e = args[5];
    break;
  default:
    throw new Error('could not assign parameters to heat map');
  }

  return {'heatmap': hmap};
}
/**
 * Options for a geospatial query returned by
 * the {@link queryBuilder#geoOptions} function.
 * @typedef {object} queryBuilder.GeoOptionsParam
 */
/**
 * Provides options modifying the default behavior of a
 * {@link queryBuilder#geospatial} query.
 * @method
 * @memberof queryBuilder#
 * @param {...string} options - options supported for geospatial queries
 * @returns {queryBuilder.GeoOptionsParam} options for the geospatial query
 */
function geoOptions() {
  return new GeoOptionsDef(mlutil.asArray.apply(null, arguments));
}
/** @ignore */
function GeoOptionsDef(options) {
  if (!(this instanceof GeoOptionsDef)) {
    return new GeoOptionsDef(options);
  }

  if (!valcheck.isArray(options)) {
    throw new Error('invalid options list: '+options);
  } else if (options.length === 0) {
    throw new Error('empty options list');
  } else {
    this['geo-option'] = options;
  }
}
/**
 * Specifies the latitude and longitude for a coordinate of the region
 * criteria for a geospatial query. The latitude and longitude can be
 * passed as individual numeric parameters or wrapped in an array
 * @method
 * @memberof queryBuilder#
 * @param {number} latitude - the north-south location
 * @param {number} longitude - the east-west location
 * @returns {queryBuilder.LatLon} a coordinate for a {queryBuilder.Region}
 */
function latlon() {
  var args = mlutil.asArray.apply(null, arguments);
  switch(args.length) {
  case 0:
    throw new Error('missing latitude and longitude for latlon coordinate');
  case 1:
    throw new Error('missing longitude for latlon coordinate');
  case 2:
    return new LatLongDef(args[0], args[1]);
  default:
    throw new Error('too many arguments for latlon coordinate: '+args.length);
  }
}
/** @ignore */
function LatLongDef(latitude, longitude) {
  if (!(this instanceof LatLongDef)) {
    return new LatLongDef(latitude, longitude);
  }

  if (valcheck.isNumber(latitude)) {
    this.latitude = latitude;
  } else if (valcheck.isNullOrUndefined(latitude)) {
    throw new Error('missing latitude for latitude-longitude coordinate');
  } else {
    throw new Error('invalid latitude for latitude-longitude coordinate: '+
        mlutil.identify(latitude, true));
  }

  if (valcheck.isNumber(longitude)) {
    this.longitude = longitude;
  } else if (valcheck.isNullOrUndefined(longitude)) {
    throw new Error('missing longitude for latitude-longitude coordinate');
  } else {
    throw new Error('invalid longitude for latitude-longitude coordinate: '+
        mlutil.identify(longitude, true));
  }
}
/**
 * Builds a query that applies the subquery to document lock fragments by contrast
 * with the {@link queryBuilder#documentFragment} function.
 * @method
 * @memberof queryBuilder#
 * @param {queryBuilder.Query} query - the query that must match document lock fragments
 * @returns {queryBuilder.Query} a composable query
 */
function locksFragment() {
  return new LocksFragmentDef(mlutil.first.apply(null, arguments));
}
/** @ignore */
function LocksFragmentDef(query) {
  if (!(this instanceof LocksFragmentDef)) {
    return new LocksFragmentDef(query);
  }

  if (!valcheck.isNullOrUndefined(query)) {
    this['locks-fragment-query'] = checkQuery(query);
  } else {
    throw new Error('missing query');
  }
}
util.inherits(LocksFragmentDef, QueryDef);
/**
 * Builds a query that matches the subqueries within a specified proximity.
 * @method
 * @memberof queryBuilder#
 * @param {...queryBuilder.Query} subquery - a word, value, range, geospatial,
 * or other query or a composer such as an or query.
 * @param {queryBuilder.number} [distance] - the maximum number of words
 * between any two matching subqueries
 * @param {queryBuilder.WeightParam} [weight] - a weight returned
 * by {@link queryBuilder#weight} to increase or decrease the score
 * of subqueries relative to other queries in the complete search
 * @param {queryBuilder.OrderParam} [ordering] - the ordering on the subqueries
 * returned from {@link queryBuilder#ordered}
 * @returns {queryBuilder.Query} a composable query
 */
function near() {
  var args = mlutil.asArray.apply(null, arguments);
  var queries  = [];
  var distance = null;
  var ordered  = null;
  var weight   = null;
  var arg = null;
  for (var i=0; i < args.length; i++) {
    arg = args[i];
    if (ordered === null) {
      if (arg instanceof OrderedDef) {
        ordered        = arg.ordered;
        continue;
      } else if (valcheck.isBoolean(arg)) {
        ordered        = arg;
        continue;
      }
    }
    if (weight === null && arg instanceof WeightDef) {
      weight = arg.weight;
      continue;
    }
    if (distance === null && valcheck.isNumber(arg)) {
      distance = arg;
      continue;
    }
    if (arg instanceof Array){
      Array.prototype.push.apply(queries, arg);
    } else {
      queries.push(arg);
    }
  }

  return new NearDef(new QueryListDef(queries, ordered, weight, distance));
}
/** @ignore */
function NearDef(queryList) {
  if (!(this instanceof NearDef)) {
    return new NearDef(queryList);
  }

  if (queryList instanceof QueryListDef) {
    this['near-query'] = queryList;
  } else {
    throw new Error('invalid near() query: '+mlutil.identify(queryList, true));
  }
}
util.inherits(NearDef, QueryDef);
/**
 * Builds a query that removes any documents matched by the subquery.
 * @method
 * @memberof queryBuilder#
 * @param {queryBuilder.Query} subquery - a word, value, range, geospatial,
 * or other query or a composer such as an or query.
 * @returns {queryBuilder.Query} a composable query
 */
function not() {
  return new NotDef(mlutil.first.apply(null, arguments));
}
/** @ignore */
function NotDef(query) {
  if (!(this instanceof NotDef)) {
    return new NotDef(query);
  }

  if (!valcheck.isNullOrUndefined(query)) {
    this['not-query'] = checkQuery(query);
  } else {
    throw new Error('missing query');
  }
}
util.inherits(NotDef, QueryDef);
/**
 * Builds a query where the matching content qualifies for the positive query
 * and does not qualify for the negative query. Positions must be enabled for indexes.
 * @method
 * @memberof queryBuilder#
 * @param {queryBuilder.Query} positiveQuery - a query that must match
 * the content
 * @param {queryBuilder.Query} negativeQuery - a query that must not match
 * the same content
 * @returns {queryBuilder.Query} a composable query
 */
function notIn() {
  var args = mlutil.asArray.apply(null, arguments);
  switch(args.length) {
  case 0:
    throw new Error('missing positive and negative queries');
  case 1:
    throw new Error('has positive query but missing negative query: '+mlutil.identify(args[0], true));
  case 2:
    return new NotInDef(new PositiveNegativeDef(args[0], args[1]));
  default:
    throw new Error('too many arguments for notIn() query: '+args.length);
  }
}
/** @ignore */
function NotInDef(positiveNegative) {
  if (!(this instanceof NotInDef)) {
    return new NotInDef(positiveNegative);
  }

  if (positiveNegative instanceof PositiveNegativeDef) {
    this['not-in-query'] = positiveNegative;
  } else {
    throw new Error('invalid notIn() query: '+mlutil.identify(positiveNegative, true));
  }
}
util.inherits(NotInDef, QueryDef);
/**
 * Builds a query for the union intersection of subqueries.
 * @method
 * @memberof queryBuilder#
 * @param {...queryBuilder.Query} subquery - a word, value, range, geospatial,
 * or other query or a composer such as an and query.
 * @returns {queryBuilder.Query} a composable query
 */
function or() {
  return new OrDef(new QueryListDef(mlutil.asArray.apply(null, arguments)));
}
/** @ignore */
function OrDef(queryList) {
  if (!(this instanceof OrDef)) {
    return new OrDef(queryList);
  }

  if (!valcheck.isNullOrUndefined(queryList)) {
    if (queryList instanceof QueryListDef) {
      this['or-query'] = queryList;
    } else {
      throw new Error('invalid or query: '+mlutil.identify(queryList, true));
    }
  } else {
    this['or-query'] = new QueryListDef([]);
  }
}
util.inherits(OrDef, QueryDef);
/**
 * The ordering returned by the {@link queryBuilder#ordered} function.
 * @typedef {object} queryBuilder.OrderParam
 */
/**
 * Specifies ordering for an {@link queryBuilder#and} or
 * {@link queryBuilder#near} query.
 * @method
 * @memberof queryBuilder#
 * @param {boolean} isOrdered - whether subqueries are ordered
 * @returns {queryBuilder.OrderParam} a query flag for ordering
 */
function ordered() {
  return new OrderedDef(mlutil.first.apply(null, arguments));
}
/** @ignore */
function OrderedDef(on) {
  if (!(this instanceof OrderedDef)) {
    return new OrderedDef(on);
  }

  if (valcheck.isBoolean(on)) {
    this.ordered = on;
  } else {
    throw new Error('invalid order parameter: '+mlutil.identify(on, true));
  }
}
/**
 * Specifies a path configured as an index over JSON or XML documents on the server.
 * @method
 * @memberof queryBuilder#
 * @param {string} pathExpression - the indexed path
 * @param {object} namespaces - bindings between the prefixes in the path and
 * namespace URIs
 * @returns {queryBuilder.IndexedName} an indexed name for specifying a query
 */
function pathIndex() {
  var args = mlutil.asArray.apply(null, arguments);
  switch(args.length) {
  case 0:
    throw new Error('missing path for path index identifier');
  case 1:
    return new PathIndexDef(new PathDef(args[0]));
  case 2:
    return new PathIndexDef(new PathDef(args[0], args[1]));
  default:
    throw new Error('too many arguments for path index identifier: '+args.length);
  }
}
/** @ignore */
function PathIndexDef(namespacedPath) {
  if (!(this instanceof PathIndexDef)) {
    return new PathIndexDef(namespacedPath);
  }

  if (namespacedPath instanceof PathDef) {
    this['path-index'] = namespacedPath;
  } else if (valcheck.isNullOrUndefined(namespacedPath)) {
    throw new Error('missing path for path identifier');
  } else {
    throw new Error('invalid path for path identifier: '+mlutil.identify(namespacedPath, true));
  }
}
/** @ignore */
function PathDef(pathExpression, namespaces) {
  if (!(this instanceof PathDef)) {
    return new PathDef(pathExpression, namespaces);
  }

  if (valcheck.isString(pathExpression)) {
    this.text = pathExpression;
  } else if (valcheck.isNullOrUndefined(pathExpression)) {
    throw new Error('missing name for path identifier');
  } else {
    throw new Error('invalid name for path identifier: '+mlutil.identify(pathExpression, true));
  }

  this.namespaces = valcheck.isNullOrUndefined(namespaces) ? '' : namespaces;
}
/**
 * Specifies a point region either by passing the return value from
 * the {@link queryBuilder#latlon} function or by passing the latitude and longitude
 * numbers in that order (possibly wrapped in an array).
 * @method
 * @memberof queryBuilder#
 * @param {queryBuilder.LatLon} coordinate - the point location
 * @returns {queryBuilder.Region} the region criteria for a geospatial query
 */
function point() {
  var args = mlutil.asArray.apply(null, arguments);
  switch(args.length) {
  case 0:
    throw new Error('missing latitude and longitude for point');
  case 1:
    return new PointRegionDef([args[0]]);
  case 2:
    return new PointRegionDef([new LatLongDef(args[0], args[1])]);
  default:
    throw new Error('too many arguments for point: '+args.length);
  }
}
/** @ignore */
function PointRegionDef(point) {
  if (!(this instanceof PointRegionDef)) {
    return new PointRegionDef(point);
  }

  if (valcheck.isArray(point) && point.length > 0 && point[0] instanceof LatLongDef) {
    this.point = point;
  } else if (valcheck.isNullOrUndefined(latlon)) {
    throw new Error('missing latitude-longitude definition for point');
  } else {
    throw new Error('invalid latitude-longitude definition for point: '+mlutil.identify(point, true));
  }
}
/**
 * Specifies a polygon region as a list of coordinate parameters or as a coordinate array
 * where each coordinate is specified either by the return value from
 * the {@link queryBuilder#latlon} function or by wrapping the latitude and
 * longitude numbers in an array.
 * @method
 * @memberof queryBuilder#
 * @param {...queryBuilder.LatLon} coordinate - the polygon coordinates
 * @returns {queryBuilder.Region} the region criteria for a geospatial query
 */
function polygon() {
  var args = mlutil.asArray.apply(null, arguments);

  var points = [];
  var arg = null;
  var i=0;
  for (; i < args.length; i++) {
    arg = args[i];
    if (arg instanceof PointRegionDef) {
      points.push(arg.point[0]);
    } else if (arg instanceof LatLongDef) {
      points.push(arg);
    } else if (arg instanceof Array && arg.length === 2){
      points.push(new LatLongDef(arg[0], arg[1]));
    } else {
      throw new Error('unsupported parameter for polygon: '+mlutil.identify(arg, true));
    }
  }

  return new PolygonRegionDef(new PointRegionDef(points));
}
/** @ignore */
function PolygonRegionDef(points) {
  if (!(this instanceof PolygonRegionDef)) {
    return new PolygonRegionDef(points);
  }

  if (points instanceof PointRegionDef) {
    this.polygon = points;
  } else if (valcheck.isNullOrUndefined(points)) {
    throw new Error('missing latitude-longitude points for polygon');
  } else {
    throw new Error('invalid latitude-longitude points for polygon: '+mlutil.identify(points, true));
  }
}
/**
 * Builds a query that applies the subquery to document metadata by contrast
 * with the {@link queryBuilder#documentFragment} function.
 * @method
 * @memberof queryBuilder#
 * @param {queryBuilder.Query} query - the query that must match document metadata
 * properties
 * @returns {queryBuilder.Query} a composable query
 */
function propertiesFragment() {
  return new PropertiesFragmentDef(mlutil.first.apply(null, arguments));
}
/** @ignore */
function PropertiesFragmentDef(query) {
  if (!(this instanceof PropertiesFragmentDef)) {
    return new PropertiesFragmentDef(query);
  }

  if (!valcheck.isNullOrUndefined(query)) {
    this['properties-fragment-query'] = checkQuery(query);
  } else {
    throw new Error('missing query');
  }
}
util.inherits(PropertiesFragmentDef, QueryDef);
/**
 * Specifies a JSON property for a query.  As a shortcut, a JSON property
 * can also be specified with a string instead of calling this function.
 * @method
 * @memberof queryBuilder#
 * @param {string} name - the name of the property
 * @returns {queryBuilder.IndexedName} an indexed name for specifying a query
 */
function property() {
  var args = mlutil.asArray.apply(null, arguments);
  switch(args.length) {
  case 0:
    throw new Error('missing JSON property name');
  case 1:
    return new JSONPropertyDef(args[0]);
  default:
    throw new Error('too many arguments for JSON property identifier: '+args.length);
 }
}
/** @ignore */
function JSONPropertyDef(name) {
  if (!(this instanceof JSONPropertyDef)) {
    return new JSONPropertyDef(name);
  }

  if (valcheck.isString(name)) {
    this['json-property'] = name;
  } else if (valcheck.isNullOrUndefined(name)) {
    throw new Error('missing name for JSON property identifier');
  } else {
    throw new Error('invalid name for JSON property identifier: '+mlutil.identify(name, true));
  }
}
/**
 * A namespaced name for an element or attribute returned
 * by the {@link queryBuilder#qname} function.
 * @typedef {object} queryBuilder.QName
 */
/**
 * Specifies an XML qualified name.
 * @method
 * @memberof queryBuilder#
 * @param {string|string[]} parts - the namespace URI and name
 * for the QName supplied either as two strings or as an array with
 * two strings.
 * @returns {queryBuilder.QName} a QName for identifying
 * an element or attribute
 */
function qname() {
  var args = mlutil.asArray.apply(null, arguments);
  switch(args.length) {
  case 0:
    throw new Error('missing name for QName identifier');
  case 1:
    return new QNameDef(null, args[0]);
  case 2:
    return new QNameDef(args[0], args[1]);
  default:
    throw new Error('too many arguments for QName identifier: '+args.length);
  }
}
/** @ignore */
function QNameDef(ns, name) {
  if (!(this instanceof QNameDef)) {
    return new QNameDef(ns, name);
  }

  if (valcheck.isString(ns)) {
    this.ns = ns;
  } else if (!valcheck.isNullOrUndefined(ns)) {
    throw new Error('invalid namespace for QName identifier: '+mlutil.identify(ns, true));
  }

  if (valcheck.isString(name)) {
    this.name = name;
  } else {
    throw new Error('invalid localname for QName identifier: '+mlutil.identify(name, true));
  }
}
/**
 * The specification for a timespan or timestamp for an query
 * returned by the {@link queryBuilder#period} function.
 * @typedef {object} queryBuilder.PeriodParam
 */
/**
 * Specifies a timespan or timestamp for comparison with
 * a valid or system timespan in temporal documents in
 * a {@link queryBuilder#periodRange} temporal query.
 * @method
 * @memberof queryBuilder#
 * @param {string|Date} startTimestamp - the starting datetime for a timespan
 * or the datetime for a timestamp
 * @param {string|Date} [endTimestamp] - the starting datetime for a timespan
 * or the datetime for a timestamp
 * @returns {queryBuilder.PeriodParam} the specification of a period
 * for a {@link queryBuilder#periodRange} temporal query
 */
function period() {
  var startDate = null;
  var endDate   = null;

  switch(arguments.length) {
  case 0:
    throw new Error('period must have at least the start datetime');
  case 1:
    startDate = arguments[0];
    break;
  case 2:
    startDate = arguments[0];
    endDate   = arguments[1];
    break;
  default:
    throw new Error('period with too many arguments: '+args.join(', '));
  }

  return new PeriodDef(startDate, endDate);
}
/** @ignore */
function PeriodDef(startDate, endDate) {
  if (!(this instanceof PeriodDef)) {
    return new PeriodDef(startDate, endDate);
  }

  if (valcheck.isString(startDate)) {
    this['period-start'] = startDate;
  } else if (valcheck.isDate(startDate)) {
    this['period-start'] = startDate.toISOString();
  } else if (valcheck.isNullOrUndefined(startDate)) {
    throw new Error('missing start date for period');
  } else {
    throw new Error('invalid start date for period: '+mlutil.identify(startDate, true));
  }
  if (valcheck.isString(endDate)) {
    this['period-end'] = endDate;
  } else if (valcheck.isDate(endDate)) {
    this['period-end'] = endDate.toISOString();
  } else if (!valcheck.isNullOrUndefined(endDate)) {
    throw new Error('invalid end date for period: '+mlutil.identify(endDate, true));
  }
}
/**
 * Builds a query matching temporal documents based on the relationship
 * between the valid period and the system period.  For instance, this
 * query can find cases where what was believed to be true (the valid time)
 * was recorded (the system time) only afterward (the valid axis is before
 * the system axis).
 * @method
 * @memberof queryBuilder#
 * @param {string} axis1 - the configured name of the valid or system axis
 * @param {string} operator - the name of an Allen interval operator or
 * ISO SQL 2011 period operator
 * @param {string} axis2 - the configured name of the valid or system axis, which
 * must be different from axis1
 * @param {queryBuilder.TemporalOptionsParam} [temporalOptions] - a list
 * of options returned by {@link queryBuilder#temporalOptions} to modify
 * the temporal query
 * @returns {queryBuilder.Query} a composable query
 */
function periodCompare() {
  var args = mlutil.asArray.apply(null, arguments);
  var argLen = args.length;

  var compareAxis1    = null;
  var compareOperator = null;
  var compareAxis2    = null;
  var temporalOptions = null;
  var arg = null;
  for (var i=0; i < argLen; i++) {
    arg = args[i];
    if (valcheck.isString(arg)) {
      if (compareAxis1 === null) {
        compareAxis1 = arg;
        continue;
      }
      if (compareOperator === null) {
        compareOperator = arg;
        continue;
      }
      if (compareAxis2 === null) {
        compareAxis2 = arg;
        continue;
      }
    }
    if (temporalOptions === null && arg instanceof TemporalOptionsDef) {
      temporalOptions = arg['temporal-option'];
      continue;
    }
    throw new Error('unknown period compare argument: '+mlutil.identify(arg, true));
  }

  return new PeriodCompareDef(new PeriodCompareQueryDef(
      compareAxis1, compareOperator, compareAxis2, temporalOptions
  ));
}
/** @ignore */
function PeriodCompareDef(queryDef) {
  if (!(this instanceof PeriodCompareDef)) {
    return new PeriodCompareDef(queryDef);
  }

  if (queryDef instanceof PeriodCompareQueryDef) {
    this['period-compare-query'] = queryDef;
  } else if (valcheck.isNullOrUndefined(queryDef)) {
    throw new Error('missing period compare query');
  } else {
    throw new Error('invalid period compare query: '+mlutil.identify(queryDef, true));
  }
}
util.inherits(PeriodCompareDef, QueryDef);
/** @ignore */
function PeriodCompareQueryDef(
    compareAxis1, compareOperator, compareAxis2, temporalOptions
    ) {
  if (!(this instanceof PeriodCompareQueryDef)) {
    return new PeriodCompareQueryDef(
        compareAxis1, compareOperator, compareAxis2, temporalOptions
        );
  }

  if (!valcheck.isNullOrUndefined(compareAxis1)) {
    this.axis1 = compareAxis1;
  } else {
    throw new Error('period compare query must have axis1');
  }
  if (!valcheck.isNullOrUndefined(compareOperator)) {
    this['temporal-operator'] = compareOperator;
  } else {
    throw new Error('period compare query must have temporal operator');
  }
  if (!valcheck.isNullOrUndefined(compareAxis2)) {
    this.axis2 = compareAxis2;
  } else {
    throw new Error('period compare query must have axis2');
  }
  if (!valcheck.isNullOrUndefined(temporalOptions)) {
    this['temporal-option'] = temporalOptions;
  }
}
/**
 * Builds a query matching temporal documents based on the relationship
 * between the valid or system period and the specified period.
 * This query can find what was believed to be true (the valid time)
 * or was recorded (the system time) during a timespan or before or
 * after a time.
 * @method
 * @memberof queryBuilder#
 * @param {string} axis - the configured name of the valid or system axis
 * @param {string} operator - the name of an Allen interval operator or
 * ISO SQL 2011 period operator
 * @param {queryBuilder.PeriodParam} [period] - a timespan or timestamp
 * returned by {@link queryBuilder#period} to compare with the valid or
 * system time of temporal documents
 * @param {queryBuilder.TemporalOptionsParam} [temporalOptions] - a list
 * of options returned by {@link queryBuilder#temporalOptions} to modify
 * the temporal query
 * @returns {queryBuilder.Query} a composable query
 */
function periodRange() {
  var args = mlutil.asArray.apply(null, arguments);
  var argLen = args.length;

  var rangeAxis       = null;
  var rangeOperator   = null;
  var rangePeriod     = null;
  var temporalOptions = null;
  var arg = null;
  for (var i=0; i < argLen; i++) {
    arg = args[i];
    if (valcheck.isArray(arg) && arg.length > 0) {
      if (rangeAxis === null && valcheck.isString(arg[0])) {
        rangeAxis = arg;
        continue;
      }
      if (rangePeriod === null && arg[0] instanceof PeriodDef) {
        rangePeriod = arg;
        continue;
      }
    }
    if (valcheck.isString(arg)) {
      if (rangeAxis === null) {
        rangeAxis = [arg];
        continue;
      }
      if (rangeOperator === null) {
        rangeOperator = arg;
        continue;
      }
    }
    if (rangePeriod === null && arg instanceof PeriodDef) {
      rangePeriod = [arg];
      continue;
    }
    if (temporalOptions === null && arg instanceof TemporalOptionsDef) {
      temporalOptions = arg['temporal-option'];
      continue;
    }
    throw new Error('unknown period range argument: '+mlutil.identify(arg, true));
  }

  return new PeriodRangeDef(new PeriodRangeQueryDef(
      rangeAxis, rangeOperator, rangePeriod, temporalOptions
  ));
}
/** @ignore */
function PeriodRangeDef(queryDef) {
  if (!(this instanceof PeriodRangeDef)) {
    return new PeriodRangeDef(queryDef);
  }

  if (queryDef instanceof PeriodRangeQueryDef) {
    this['period-range-query'] = queryDef;
  } else if (valcheck.isNullOrUndefined(queryDef)) {
    throw new Error('missing period range query');
  } else {
    throw new Error('invalid period range query: '+mlutil.identify(queryDef, true));
  }
}
util.inherits(PeriodRangeDef, QueryDef);
/** @ignore */
function PeriodRangeQueryDef(
    rangeAxis, rangeOperator, rangePeriod, temporalOptions
    ) {
  if (!(this instanceof PeriodRangeQueryDef)) {
    return new PeriodRangeQueryDef(
        rangeAxis, rangeOperator, rangePeriod, temporalOptions
        );
  }

  if (!valcheck.isNullOrUndefined(rangeAxis)) {
    this.axis = rangeAxis;
  } else {
    throw new Error('period range query must have axis');
  }
  if (!valcheck.isNullOrUndefined(rangeOperator)) {
    this['temporal-operator'] = rangeOperator;
  } else {
    throw new Error('period range query must have temporal operator');
  }
  if (!valcheck.isNullOrUndefined(rangePeriod)) {
    this.period = rangePeriod;
  } else {
    throw new Error('period missing for period range query');
  }
  if (!valcheck.isNullOrUndefined(temporalOptions)) {
    this['temporal-option'] = temporalOptions;
  }
}

/**
 * Mappings of constraint names to indexes as returned
 * by the {@link queryBuilder#suggestBindings} function
 * to pass to a {@link documents#suggest} function
 * to retreive suggestions for completing criteria
 * for the constraints.
 * @typedef {object} queryBuilder.SuggestBindings
 */
/**
 * Maps constraint names to indexes for passing to
 * the {@link documents#suggest} function
 * to retreive suggestions for completing criteria
 * for the constraints.
 * @method
 * @memberof queryBuilder#
 * @param {queryBuilder.Query} ...query - queries that contain a binding
 * to a constraint name as returned by the {@link queryBuilder#bind}
 * @returns {queryBuilder.SuggestBindings} a list of constraint bindings for
 * the {@link documents#suggest} function
 */
function suggestBindings() {
  return makeBindings('suggest', mlutil.asArray.apply(null, arguments));
}
/**
 * Options for suggestions to retrieve from a word, value, collection, range, or geospatial
 * index as returned by
 * the {@link queryBuilder#suggestOptions} function.
 * @typedef {object} queryBuilder.SuggestOptionsParam
 */
/**
 * Provides options modifying the default behavior of an
 * {@link documents#suggest} query.
 * @method
 * @memberof queryBuilder#
 * @param {...string} options - one or more options supported by {@link documents#suggest}
 * for the type of index
 * @returns {queryBuilder.SuggestOptionsParam} options for the suggest query
 */
function suggestOptions() {
  return new SuggestOptionsDef(mlutil.asArray.apply(null, arguments));
}
/** @ignore */
function SuggestOptionsDef(options) {
  if (!(this instanceof SuggestOptionsDef)) {
    return new SuggestOptionsDef(options);
  }

  if (!valcheck.isArray(options)) {
    throw new Error('invalid options list: '+mlutil.identify(options, true));
  } else if (options.length === 0) {
    throw new Error('empty options list');
  } else {
    this['suggest-option'] = options;
  }
}

/**
 * Options for a temporal query returned by
 * the {@link queryBuilder#temporalOptions} function.
 * @typedef {object} queryBuilder.TemporalOptionsParam
 */
/**
 * Provides options modifying the default behavior of an
 * {@link queryBuilder#lsqtQuery},
 * {@link queryBuilder#periodCompare}, or
 * {@link queryBuilder#periodRange} query.
 * @method
 * @memberof queryBuilder#
 * @param {...string} options - options supported for temporal queries
 * @returns {queryBuilder.TemporalOptionsParam} options for the temporal query
 */
function temporalOptions() {
  return new TemporalOptionsDef(mlutil.asArray.apply(null, arguments));
}
/** @ignore */
function TemporalOptionsDef(options) {
  if (!(this instanceof TemporalOptionsDef)) {
    return new TemporalOptionsDef(options);
  }

  if (!valcheck.isArray(options)) {
    throw new Error('invalid options list: '+mlutil.identify(options, true));
  } else if (options.length === 0) {
    throw new Error('empty options list');
  } else {
    this['temporal-option'] = options;
  }
}
/**
 * Builds a query over a range index. You must supply
 * either a comparison operator with one or more values or a binding
 * to parse the comparison and value from a query string but not both.
 * You can provide both named and default bindings for the same query.
 * @method
 * @memberof queryBuilder#
 * @param {string|queryBuilder.IndexedName} indexedName - the JSON
 * property, XML element or attribute, field, or path providing the values
 * to the range index
 * @param {queryBuilder.DatatypeParam} [datatype] - a datatype returned
 * by the {@link queryBuilder#datatype} to identify the index
 * @param {string} [comparison] - an operator from the enumeration
 * =|!=|<|<=|>|>= defaulting to the = (equivalence) operator
 * @param [...value] - one or more values for comparison with the indexed values
 * @param {queryBuilder.BindingParam} [binding] - a binding
 * (returned by the {@link queryBuilder#bind} function) for parsing the
 * comparison operator and value from tagged values in a query string
 * @param {queryBuilder.DefaultBindingParam} [defaultBinding] - a binding
 * (returned by the {@link queryBuilder#bindDefault} function) for parsing
 * the comparison operator and value from untagged values in a query string
 * @param {queryBuilder.FragmentScopeParam} [fragmentScope] - whether the query
 * applies to document content (the default) or document metadata properties
 * as returned by the {@link queryBuilder#fragmentScope} function
 * @param {queryBuilder.RangeOptionsParam} [options] - options
 * from {@link queryBuilder#rangeOptions} modifying the default behavior
 * @returns {queryBuilder.Query} a composable query
 */
function range() {
  var args = mlutil.asArray.apply(null, arguments);

  var index = null;
  var datatype = null;
  var collation = null;
  var fragmentScope = null;
  var rangeOptions = null;
  var values = null;
  var operator = null;
  var suggestOptions = null;
  var constraintName = null;
  var defaultConstraint = null;
  var arg = null;
  for (var i=0; i < args.length; i++) {
    arg = args[i];
    if (i === 0) {
      index = asIndex(arg);
      continue;
    }
    if (datatype === null && arg instanceof DatatypeDef) {
      datatype  = arg.datatype;
      collation = arg.collation;
      continue;
    }
    if (fragmentScope === null && arg instanceof FragmentScopeDef) {
      fragmentScope = arg['fragment-scope'];
      continue;
    }
    if (rangeOptions === null && arg instanceof RangeOptionsDef) {
      rangeOptions = arg['range-option'];
      continue;
    }
    if (suggestOptions === null && arg instanceof SuggestOptionsDef) {
      suggestOptions = arg['suggest-option'];
      continue;
    }
    if (constraintName === null && arg instanceof BindDef) {
      constraintName = arg.constraintName;
      continue;
    }
    if (defaultConstraint === null && arg instanceof BindDefaultDef) {
      defaultConstraint = arg.defaultConstraint;
      continue;
    }
    if (arg instanceof Array){
      if (values === null) {
        values = arg;
      } else {
        Array.prototype.push.apply(values, arg);
      }
      continue;
    }
    if ((datatype === null || operator === null) && valcheck.isString(arg)) {
      var testType = (datatype === null) ? datatypes[arg.trim()] : null;
      if (!valcheck.isNullOrUndefined(testType)) {
        datatype = testType;
      } else {
        var testComp = (operator === null) ? comparisons[arg.trim()] : null;
        if (!valcheck.isNullOrUndefined(testComp)) {
          operator = testComp;
        } else if (values === null) {
          values = [arg];
        } else {
          values.push(arg);
        }
      }
      continue;
    }
    if (values === null) {
      values = [arg];
    } else {
      values.push(arg);
    }
  }

  var rangeDef = new RangeDef(
      index, datatype, collation, operator, values, rangeOptions, fragmentScope
  );

  if (values !== null) {
    if (!valcheck.isNullOrUndefined(constraintName) || defaultConstraint === true) {
      throw new Error('range has both query and binding: '+mlutil.identify(args, true));
    }
    if (!valcheck.isNullOrUndefined(suggestOptions)) {
      throw new Error('range has both query and suggest options: '+mlutil.identify(args, true));
    }

    return new RangeQueryDef(rangeDef);
  }

  if (valcheck.isNullOrUndefined(constraintName) && defaultConstraint !== true) {
    constraintName = defaultConstraintName(index);
    if (valcheck.isNullOrUndefined(constraintName)) {
      throw new Error('could not default constraint name from '+
          Object.keys(index).join(', ') + ' index'
          );
    }
  }

  var constraint = new RangeConstraintDef(constraintName, rangeDef, suggestOptions);

  return (defaultConstraint !== true) ?
      constraint : new DefaultConstraintDef(constraint);
}
/** @ignore */
function RangeConstraintDef(constraintName, rangeDef, suggestOptions) {
  if (!(this instanceof RangeConstraintDef)) {
    return new RangeConstraintDef(constraintName, rangeDef, suggestOptions);
  }

  if (rangeDef instanceof RangeDef) {
    this.range = rangeDef;
  } else {
    throw new Error('no range definition for range constraint');
  }

  addConstraint(this, constraintName, suggestOptions);
}
/** @ignore */
function RangeQueryDef(rangeDef) {
  if (!(this instanceof RangeQueryDef)) {
    return new RangeQueryDef(rangeDef);
  }

  if (rangeDef instanceof RangeDef) {
    this['range-query'] = rangeDef;
  } else {
    throw new Error('no range definition for range query');
  }
}
util.inherits(RangeQueryDef, QueryDef);
/** @ignore */
function RangeDef(
    index, datatype, collation, operator, values, rangeOptions, fragmentScope
    ) {
  if (!(this instanceof RangeDef)) {
    return new RangeDef(
        index, datatype, collation, operator, values, rangeOptions, fragmentScope
        );
  }

  var hasOperator = !valcheck.isNullOrUndefined(operator);

  if (!valcheck.isNullOrUndefined(index)) {
    addIndex(this, index, false);
  } else {
    throw new Error('missing JSON property, XML element or attrbibute, field, or path index');
  }
  if (!valcheck.isNullOrUndefined(datatype)) {
    this.type = datatype;
    if (!valcheck.isNullOrUndefined(collation)) {
      this.collation = collation;
    }
  }
  if (!valcheck.isNullOrUndefined(values)) {
    this.value = values;
    if (!hasOperator) {
      this['range-operator'] = 'EQ';
    }
  } else {
    this.facet = false;
  }
  if (hasOperator) {
    this['range-operator'] = operator;
  }
  if (!valcheck.isNullOrUndefined(rangeOptions)) {
    this['range-option'] = rangeOptions;
  }
  if (!valcheck.isNullOrUndefined(fragmentScope)) {
    this['fragment-scope'] = fragmentScope;
  }
}
/**
 * Options for a range query returned by the {@link queryBuilder#rangeOptions}
 * function.
 * @typedef {object} queryBuilder.RangeOptionsParam
 */
/**
 * Provides options modifying the default behavior
 * of a {@link queryBuilder#range} query.
 * @method
 * @memberof queryBuilder#
 * @param {...string} options - options supported for range queries
 * @returns {queryBuilder.RangeOptionsParam} options for a {@link queryBuilder#range} query
 */
function rangeOptions() {
  return new RangeOptionsDef(mlutil.asArray.apply(null, arguments));
}
/** @ignore */
function RangeOptionsDef(options) {
  if (!(this instanceof RangeOptionsDef)) {
    return new RangeOptionsDef(options);
  }

  if (!valcheck.isArray(options)) {
    throw new Error('invalid options list: '+mlutil.identify(options, true));
  } else if (options.length === 0) {
    throw new Error('empty options list');
  } else {
    this['range-option'] = options;
  }
}
/**
 * Specifies the coordinates of a box as a list of parameters
 * for passing to the {@link queryBuilder#box} function
 * or to the {@link queryBuilder#heatmap} function
 * @method
 * @memberof queryBuilder#
 * @param {queryBuilder.LatLon} south - the south coordinate
 * @param {queryBuilder.LatLon} west - the west coordinate
 * @param {queryBuilder.LatLon} north - the north coordinate
 * @param {queryBuilder.LatLon} east - the east coordinate
 * @returns {object} the coordinates for the box
 */
function southWestNorthEast() {
  var args = mlutil.asArray.apply(null, arguments);
  var argLen = args.length;
  if (argLen !== 4) {
    throw new Error('box must have four parameters: '+argLen);
  }
  return new BoxDef(args[0], args[1], args[2], args[3]);
}
/** @ignore */
function BoxDef(south, west, north, east) {
  if (!(this instanceof BoxDef)) {
    return new BoxDef(south, west, north, east);
  }

  if (valcheck.isNumber(south)) {
    this.south = south;
  } else if (valcheck.isNullOrUndefined(south)) {
    throw new Error('missing south corner for box');
  } else {
    throw new Error('invalid south corner for box: '+mlutil.identify(south, true));
  }

  if (valcheck.isNumber(west)) {
    this.west = west;
  } else if (valcheck.isNullOrUndefined(west)) {
    throw new Error('missing west corner for box');
  } else {
    throw new Error('invalid west corner for box: '+mlutil.identify(west, true));
  }

  if (valcheck.isNumber(north)) {
    this.north = north;
  } else if (valcheck.isNullOrUndefined(north)) {
    throw new Error('missing north corner for box');
  } else {
    throw new Error('invalid north corner for box: '+mlutil.identify(north, true));
  }

  if (valcheck.isNumber(east)) {
    this.east = east;
  } else if (valcheck.isNullOrUndefined(east)) {
    throw new Error('missing east corner for box');
  } else {
    throw new Error('invalid east corner for box: '+mlutil.identify(east, true));
  }
}
/**
 * Builds a query for matching words in a JSON, text, or XML document.
 * @method
 * @memberof queryBuilder#
 * @param {string} [...text] - one or more words to match
 * @param {queryBuilder.WeightParam} [weight] - a weight returned
 * by {@link queryBuilder#weight} to increase or decrease the score
 * of the query relative to other queries in the complete search
 * @returns {queryBuilder.Query} a composable query
 */
function term() {
  var args = mlutil.asArray.apply(null, arguments);
  var text = [];
  var weight = null;
  var arg = null;
  for (var i=0; i < args.length; i++) {
    arg = args[i];
    if (weight === null && arg instanceof WeightDef) {
      weight = arg.weight;
      continue;
    }
    if (arg instanceof Array){
      Array.prototype.push.apply(text, arg);
    } else {
      text.push(arg);
    }
  }

  return new TermDef(new TextDef(null, null, text, weight, null, null));
}
/** @ignore */
function TermDef(textQuery) {
  if (!(this instanceof TermDef)) {
    return new TermDef(textQuery);
  }

  if (textQuery instanceof TextDef) {
    this['term-query'] = textQuery;
  } else {
    throw new Error('missing query');
  }
}
util.inherits(TermDef, QueryDef);
/**
 * Options for a range query returned by the {@link queryBuilder#termOptions}
 * function.
 * @typedef {object} queryBuilder.TermOptionsParam
 */
/**
 * Provides options modifying the default behavior
 * of a {@link queryBuilder#value} or {@link queryBuilder#word} query.
 * @method
 * @memberof queryBuilder#
 * @param {...string} options - options supported for value or word queries
 * @returns {queryBuilder.TermOptionsParam} options for a value or word query
 */
function termOptions() {
  return new TermOptionsDef(mlutil.asArray.apply(null, arguments));
}
/** @ignore */
function TermOptionsDef(options) {
  if (!(this instanceof TermOptionsDef)) {
    return new TermOptionsDef(options);
  }

  if (!valcheck.isArray(options)) {
    throw new Error('invalid options list: '+mlutil.identify(options, true));
  } else if (options.length === 0) {
    throw new Error('empty options list');
  } else {
    this['term-option'] = options;
  }
}
/** @ignore */
function textQuery(variant, args) {
  var isValue = (variant === 'value');

  var index = null;
  var text = null;
  var weight = null;
  var fragmentScope = null;
  var termOptions = null;
  var suggestOptions = null;
  var constraintName = null;
  var defaultConstraint = null;
  var jsontype = null;
  var arg = null;
  for (var i=0; i < args.length; i++) {
    arg = args[i];
    if (i === 0) {
      index = asIndex(arg);
      continue;
    }
    if (fragmentScope === null && arg instanceof FragmentScopeDef) {
      fragmentScope = arg['fragment-scope'];
      continue;
    }
    if (termOptions === null && arg instanceof TermOptionsDef) {
      termOptions = arg['term-option'];
      continue;
    }
    if (suggestOptions === null && arg instanceof SuggestOptionsDef) {
      suggestOptions = arg['suggest-option'];
      continue;
    }
    if (weight === null && arg instanceof WeightDef) {
      weight = arg.weight;
      continue;
    }
    if (constraintName === null && arg instanceof BindDef) {
      constraintName = arg.constraintName;
      continue;
    }
    if (defaultConstraint === null && arg instanceof BindDefaultDef) {
      defaultConstraint = arg.defaultConstraint;
      continue;
    }
    if (isValue && jsontype === null && arg instanceof JSONTypeDef) {
      jsontype = arg['json-type'];
      continue;
    }
    if (valcheck.isArray(arg)) {
      if (text === null) {
        text = arg;
      } else {
        Array.prototype.push.apply(text, arg);
      }
      continue;
    }
    if (text === null) {
      text = [arg];
    } else {
      text.push(arg);
    }
  }

  if (isValue && jsontype === null && text !== null) {
    arg = text[0];
    jsontype =
      valcheck.isNumber(arg)  ? 'number'  :
      valcheck.isBoolean(arg) ? 'boolean' :
      valcheck.isNull(arg)    ? 'null'    :
      null;
  }

  var textDef = new TextDef(
      index, jsontype, text, weight, termOptions, fragmentScope
  );

  if (text !== null) {
    if (!valcheck.isNullOrUndefined(constraintName) || defaultConstraint === true) {
      throw new Error(variant+' has both query and binding: '+mlutil.identify(args, true));
    }
    if (!valcheck.isNullOrUndefined(suggestOptions)) {
      throw new Error(variant+' has both query and suggest options: '+mlutil.identify(args, true));
    }

    return isValue ? new ValueQueryDef(textDef) : new WordQueryDef(textDef);
  }

  if (valcheck.isNullOrUndefined(constraintName) && defaultConstraint !== true) {
    constraintName = defaultConstraintName(index);
    if (valcheck.isNullOrUndefined(constraintName)) {
      throw new Error('could not default constraint name from '+
          Object.keys(index).join(', ') + ' index'
          );
    }
  }

  var constraint = isValue ?
      new ValueConstraintDef(constraintName, textDef, suggestOptions) :
      new WordConstraintDef(constraintName,  textDef, suggestOptions);

  return (defaultConstraint !== true) ?
      constraint : new DefaultConstraintDef(constraint);
}
/** @ignore */
function DefaultConstraintDef(constraintDef) {
  if (!(this instanceof DefaultConstraintDef)) {
    return new DefaultConstraintDef(constraintDef);
  }

  this['default'] = constraintDef;
}
/** @ignore */
function ValueConstraintDef(constraintName, textDef, suggestOptions) {
  if (!(this instanceof ValueConstraintDef)) {
    return new ValueConstraintDef(constraintName, textDef, suggestOptions);
  }

  if (textDef instanceof TextDef) {
    this.value = textDef;
  } else {
    throw new Error('no range definition for range constraint');
  }

  addConstraint(this, constraintName, suggestOptions);
}
/** @ignore */
function WordConstraintDef(constraintName, textDef, suggestOptions) {
  if (!(this instanceof WordConstraintDef)) {
    return new WordConstraintDef(constraintName, textDef, suggestOptions);
  }

  if (textDef instanceof TextDef) {
    this.word = textDef;
  } else {
    throw new Error('no range definition for range constraint');
  }

  addConstraint(this, constraintName, suggestOptions);
}
/** @ignore */
function addConstraint(container, constraintName, suggestOptions) {
  if (valcheck.isString(constraintName)) {
    container.name = constraintName;
  }

  if (!valcheck.isNullOrUndefined(suggestOptions)) {
    container['suggest-option'] = suggestOptions;
  }
}
/** @ignore */
function ValueQueryDef(textDef) {
  if (!(this instanceof ValueQueryDef)) {
    return new ValueQueryDef(textDef);
  }

  if (textDef instanceof TextDef) {
    this['value-query'] = textDef;
  } else {
    throw new Error('no text definition for value query');
  }
}
util.inherits(ValueQueryDef, QueryDef);
/** @ignore */
function WordQueryDef(textDef) {
  if (!(this instanceof WordQueryDef)) {
    return new WordQueryDef(textDef);
  }

  if (textDef instanceof TextDef) {
    this['word-query'] = textDef;
  } else {
    throw new Error('no text definition for word query');
  }
}
util.inherits(WordQueryDef, QueryDef);
/** @ignore */
function TextDef(index, jsontype, text, weight, termOptions, fragmentScope) {
  if (!(this instanceof TextDef)) {
    return new TextDef(index, jsontype, text, weight, termOptions, fragmentScope);
  }

  if (!valcheck.isNullOrUndefined(index)) {
    addIndex(this, index, false);
  }
  if (!valcheck.isNullOrUndefined(jsontype)) {
    this.type = jsontype;
  }
  if (valcheck.isArray(text)) {
    this.text = text;
  }
  if (!valcheck.isNullOrUndefined(weight)) {
    if (valcheck.isNumber(weight)) {
      this.weight = weight;
    } else {
      throw new Error('invalid weight: '+mlutil.identify(weight, true));
    }
  }
  if (!valcheck.isNullOrUndefined(termOptions)) {
    this['term-option'] = termOptions;
  }
  if (!valcheck.isNullOrUndefined(fragmentScope)) {
    this['fragment-scope'] = fragmentScope;
  }
}

/**
 * Builds a query for matching the entire text value contained by a JSON property
 * or XML element.
 * You must supply either one or more text values or a binding to parse the text
 * value from a query string but not both. You can provide both named and
 * default bindings for the same query.
 * @method
 * @memberof queryBuilder#
 * @param {string|queryBuilder.IndexedName} indexedName - the JSON
 * property, XML element, field, or path containing the value
 * @param {string} [...text] - one or more values to match
 * @param {queryBuilder.BindingParam} [binding] - a binding
 * (returned by the {@link queryBuilder#bind} function) for parsing the text value
 * from tagged values in a query string
 * @param {queryBuilder.DefaultBindingParam} [defaultBinding] - a binding
 * (returned by the {@link queryBuilder#bindDefault} function) for parsing
 * the text value from untagged values in a query string
 * @param {queryBuilder.WeightParam} [weight] - a weight returned
 * by {@link queryBuilder#weight} to increase or decrease the score
 * of the query relative to other queries in the complete search
 * @param {queryBuilder.FragmentScopeParam} [fragmentScope] - whether the query
 * applies to document content (the default) or document metadata properties
 * as returned by the {@link queryBuilder#fragmentScope} function
 * @param {queryBuilder.TermOptionsParam} [options] - options
 * from {@link queryBuilder#termOptions} modifying the default behavior
 * @returns {queryBuilder.Query} a composable query
 */
function value() {
  return textQuery('value', mlutil.asArray.apply(null, arguments));
}
/**
 * The specification returned by the {@link queryBuilder#jsontype}
 * function.
 * @typedef {object} queryBuilder.JSONTypeParam
 */
/**
 * Identifies whether a JSON property has boolean, null, numeric, or string values in the database.
 * @method
 * @memberof queryBuilder#
 * @param {string} jsontype - a value from the enumeration
 * boolean|null|number|string
 * @returns {queryBuilder.JSONTypeParam} a JSON value type specification
 */
function jsontype(type) {
  return new JSONTypeDef(type);
}
/** @ignore */
function JSONTypeDef(type) {
  if (!(this instanceof JSONTypeDef)) {
    return new JSONTypeDef(type);
  }

  var isJSONType = {
      'boolean': true,
      'null':    true,
      'number':  true,
      'string':  true
  };
  if (!valcheck.isString(type) || !isJSONType[type]) {
    throw new Error('JSON type must be boolean, null, number, or string: '+mlutil.identify(type, true));
  }

  this['json-type'] = type;
}
/**
 * The weight modification returned by the {@link queryBuilder#weight} function.
 * @typedef {object} queryBuilder.WeightParam
 */
/**
 * Increases or decreases the contribution of the query relative
 * to other queries in the result documents ranking.
 * @method
 * @memberof queryBuilder#
 * @param {number} modifier - a number between -16 and 64 modifying
 * the contribution of the query to the score
 * @returns {queryBuilder.WeightParam} a query flag for weight
 */
function weight() {
  return new WeightDef(mlutil.first.apply(null, arguments));
}
/** @ignore */
function WeightDef(number) {
  if (!(this instanceof WeightDef)) {
    return new WeightDef(number);
  }

  if (valcheck.isNumber(number) && -16 <= number && number <= 64) {
    this.weight = number;
  } else {
    throw new Error('invalid weight: '+mlutil.identify(number, true));
  }
}
/**
 * Builds a query for matching the word contained by a JSON property
 * or XML element.
 * You must supply either one or more words or a binding to parse the words
 * from a query string but not both. You can provide both named and
 * default bindings for the same query.
 * @method
 * @memberof queryBuilder#
 * @param {string|queryBuilder.IndexedName} indexedName - the JSON
 * property, XML element, field, or path containing the word
 * @param {string} [...text] - one or more words to match
 * @param {queryBuilder.BindingParam} [binding] - a binding
 * (returned by the {@link queryBuilder#bind} function) for parsing the word
 * from tagged word s in a query string
 * @param {queryBuilder.DefaultBindingParam} [defaultBinding] - a binding
 * (returned by the {@link queryBuilder#bindDefault} function) for parsing
 * the word from untagged words in a query string
 * @param {queryBuilder.WeightParam} [weight] - a weight returned
 * by {@link queryBuilder#weight} to increase or decrease the score
 * of the query relative to other queries in the complete search
 * @param {queryBuilder.FragmentScopeParam} [fragmentScope] - whether the query
 * applies to document content (the default) or document metadata properties
 * as returned by the {@link queryBuilder#fragmentScope} function
 * @param {queryBuilder.TermOptionsParam} [options] - options
 * from {@link queryBuilder#termOptions} modifying the default behavior
 * @returns {queryBuilder.Query} a composable query
 */
function word() {
  return textQuery('word', mlutil.asArray.apply(null, arguments));
}

function QueryBuilder() {
}
QueryBuilder.prototype.where       = where;
QueryBuilder.prototype.calculate   = calculate;
QueryBuilder.prototype.orderBy     = orderBy;
QueryBuilder.prototype.slice       = slice;
QueryBuilder.prototype.withOptions = withOptions;

/**
 * An object representing the result of building a query using
 * the helper functions of a {@link queryBuilder}.
 * @namespace queryBuilder.BuiltQuery
 */

/**
 * Initializes a new query builder by copying any where, calculate,
 * orderBy, slice, or withOptions clause defined in the built query.
 * @method
 * @memberof queryBuilder#
 * @param {queryBuilder.BuiltQuery} query - an existing query with
 * clauses to copy
 * @returns {queryBuilder.BuiltQuery} a built query
 */
function copyFromQueryBuilder(otherQueryBuilder) {
  var qb = new QueryBuilder();
  if (!valcheck.isNullOrUndefined(otherQueryBuilder)) {
    var clauseKeys = [
      'whereClause', 'calculateClause', 'orderByClause',
      'sliceClause', 'withOptionsClause'
    ];
    var isString = valcheck.isString(otherQueryBuilder);
    var other = isString ?
        JSON.parse(otherQueryBuilder) : otherQueryBuilder;
    for (var i=0; i < clauseKeys.length; i++){
      var key = clauseKeys[i];
      var value = other[key];
      if (!valcheck.isNullOrUndefined(value)) {
        // deepcopy instead of clone to avoid preserving prototype
        qb[key] = isString ? value : deepcopy(value);
      }
    }
  }
  return qb;
}

/**
 * Sets the where clause of a built query, using the helper functions
 * of a {@link queryBuilder} to specify either a single query by example,
 * a structured query, a string query, or both structured and string queries.
 * When you include a string and structured query, they are AND'd together.
 * You can use an empty where clause to qualify all documents in the database
 * (though for large databases, you would not want to retrieve all documents
 * in a single request).
 * This function may be called on a query builder or on the result of building a query.
 * @method
 * @memberof queryBuilder#
 * @param {queryBuilder.Query|queryBuilder.ParsedQuery|queryBuilder.QueryByExample} [query] - one
 * or more composable queries returned by query builder functions; or 
 * a parsed query returned by the {@link queryBuilder#parsedFrom} function; or
 * or a parsed query plus one or more composable queries, which are implicitly
 * AND'd together; or a query by example returned by the 
 * {@link queryBuilder#byExample} function.
 * @returns {queryBuilder.BuiltQuery} a built query
 */
function where() {
  var self = (this instanceof QueryBuilder) ? this : new QueryBuilder();

  var args = mlutil.asArray.apply(null, arguments);
  var argLen = args.length;
  // TODO: if empty, clear the clause

  var parsedQuery = null;
  var fragmentScope = null;
  var queries = null;

  var i=0;

  var isQBE = false;

  var arg = (argLen > 0) ? args[0] : null;
  if (valcheck.isNullOrUndefined(arg)) {
    self.whereClause = {query: {queries: [and()]}};
  } else if (!valcheck.isNullOrUndefined(arg.$query)) {
    if (argLen === 1) {
      isQBE = true;
      self.whereClause = arg;
    } else {
      throw new Error('A Query by Example (QBE) must be the only query');
    }
  } else {
    for (i=0; i < argLen; i++) {
      if (i > 0) {
        arg = args[i];
      }
      if (valcheck.isNullOrUndefined(parsedQuery) && arg instanceof ParsedDef) {
        parsedQuery = arg.parsedQuery;
        continue;
      }
      if (valcheck.isNullOrUndefined(fragmentScope) && arg instanceof FragmentScopeDef) {
        fragmentScope = arg['fragment-scope'];
        continue;
      }
      if (queries === null) {
        queries = [checkQuery(arg)];
      } else {
        queries.push(checkQuery(arg));
      }
    }
    var whereClause = {};
    if (queries !== null) {
      whereClause.query = {queries: queries};
    }
    if (!valcheck.isNullOrUndefined(parsedQuery)) {
      whereClause.parsedQuery = parsedQuery;
    }
    if (!valcheck.isNullOrUndefined(fragmentScope)) {
      whereClause['fragment-scope'] = fragmentScope;
    }
    self.whereClause = whereClause;
  }

  self.queryType   = (isQBE) ? 'qbe' : 'structured';
  self.queryFormat = 'json';

  return self;
}

/**
 * A query definition returned by the {@link queryBuilder#byExample} function
 * to pass to a {@link queryBuilder#where} function.
 * @typedef {object} queryBuilder.QueryByExample
 */
/**
 * Builds a query by example from one or more objects that annotate instances
 * of properties to match.
 * @method
 * @memberof queryBuilder#
 * @param {object} ...query - one or more objects with example properties
 * @returns {queryBuilder.QueryByExample} a query
 * for the {@link queryBuilder#where} function
 */
function byExample() {
  var args = mlutil.asArray.apply(null, arguments);
  switch(args.length) {
  case 0:
    return {$query: []};
  case 1:
    var query = args[0];
    if (valcheck.isNullOrUndefined(query.$query)) {
      return {$query: query};
    }
    return query;
  default:
    return {$query: args};
  }
}

/**
 * Sets the orderBy clause of a built query, using the helper functions
 * of a {@link queryBuilder} to specify the sequence and direction
 * of sorting. This function may be called on the result of building a query.
 * @method
 * @memberof queryBuilder#
 * @param {queryBuilder.IndexedName|queryBuilder.Score|queryBuilder.Sort} ...sortItem - a
 * JSON property, XML element or attribute, field, or path with a range index
 * or the relevance ranking of the document returned
 * by the {@link queryBuilder#score} function, where either may be returned
 * from the {@link queryBuilder#sort} function to indicate the sort direction.
 * @returns {queryBuilder.BuiltQuery} a built query
 */
function orderBy() {
  var self = (this instanceof QueryBuilder) ? this : new QueryBuilder();

  var args = mlutil.asArray.apply(null, arguments);
  // TODO: if empty, clear the clause

  var sortOrder = [];
  var arg = null;
  for (var i=0; i < args.length; i++) {
    arg = args[i];
    sortOrder.push(valcheck.isString(arg) ? sort(arg) : arg);
  }

  self.orderByClause = {
    'sort-order': sortOrder
  };

  return self;
}

/**
 * A sort definition returned by the {@link queryBuilder#score} function
 * to pass to a {@link queryBuilder#orderBy} function.
 * @typedef {object} queryBuilder.Score
 */
/**
 * Specifies the relevance ranking for ordering documents
 * in the query results, optionally specifying the score method.
 * @method
 * @memberof queryBuilder#
 * @param {string} [method] - a scoring strategy from the enumeration
 * logtfidf|logtf|simple|random|zero, defaulting to logtfidf.
 * @returns {queryBuilder.Score} a sort definition
 * for the {@link queryBuilder#orderBy} function
 */
function score() {
  return {
    score: (arguments.length === 0) ? null : arguments[0]
  };
}

/**
 * A sort definition returned by the {@link queryBuilder#sort} function
 * to pass to a {@link queryBuilder#orderBy} function.
 * @typedef {object} queryBuilder.Sort
 */
/**
 * Specifies the direction for sorting documents for a range index or
 * relevance score.
 * @method
 * @memberof queryBuilder#
 * @param {queryBuilder.IndexedName|queryBuilder.Score} sortItem - a
 * JSON property, XML element or attribute, field, or path with a range index
 * or the relevance ranking of the document returned
 * by the {@link queryBuilder#score} function.
 * @param {string} direction - a specification from the
 * ascending|descending enumeration.
 * @returns {queryBuilder.Sort} a sort definition
 * for the {@link queryBuilder#orderBy} function
 */
function sort() {
  var args = mlutil.asArray.apply(null, arguments);
  if (args.length === 0) {
    throw new Error('missing sorted index');
  }

  var firstIndex = asIndex(args[0]);
  // null is a legitimate value of score
  var isScore    = (!valcheck.isUndefined(firstIndex.score));

  var sorter = {};
  if (isScore) {
    sorter.score = firstIndex.score;
  } else {
    addIndex(sorter, firstIndex, false);
  }

  var arg = null;
  for (var i=1; i < args.length; i++) {
    arg = args[i];
    if (valcheck.isString(arg)) {
      switch (arg) {
      case 'ascending':
      case 'descending':
        sorter.direction = arg;
        break;
      default:
        if (!isScore && /^xs:/.test(arg)) {
          sorter.type = arg;
        }
        break;
      }
    } else if (isScore) {
    } else if (!valcheck.isNullOrUndefined(arg.datatype)) {
      sorter.type = arg.datatype;
      if (!valcheck.isNullOrUndefined(arg.collation)) {
        sorter.collation = arg.collation;
      }
    } else if (!valcheck.isNullOrUndefined(arg.collation)) {
      sorter.type = 'xs:string';
      sorter.collation = arg.collation;
    }
  }

  return sorter;
}

/**
 * Specifies a transform for the documents or summary returned by a query
 * or the tuples list returned by a values query.
 * The transform must have been installed previously by
 * the {@link config.transforms#write} function
 * @method
 * @memberof queryBuilder#
 * @param {string} name - the name of the transform
 * @param {object} [params] - the parameters of the transform
 * as key-value pairs
 * @returns {object} a transform definition
 * for the {@link queryBuilder#slice} function
 */
function transform(name, params) {
  if (valcheck.isNullOrUndefined(name)) {
    throw new Error('transform without name');
  }

  var transformList = [name];
  if (!valcheck.isNullOrUndefined(params)) {
    transformList.push(params);
  }

  return {'document-transform': transformList};
}

/**
 * Sets the slice clause of a built query to select a slice of documents
 * from the result set based on the start document within the result set
 * and the number of documents in the slice.  (A slice is also sometimes
 * called a page of search results.)
 * @method
 * @memberof queryBuilder#
 * @param {number} start - the one-based position within the result set
 * of the first document or 0 to suppress the documents and return only
 * the summary.
 * @param {number} [length] - the number of documents in the slice.
 * @param {transform} [transform] - a transform to apply to each document
 * in the slice on the server as specified by the {@link queryBuilder#transform}
 * function.
 * @returns {queryBuilder.BuiltQuery} a built query
 */
function slice() {
  var self = (this instanceof QueryBuilder) ? this : new QueryBuilder();

  var args = mlutil.asArray.apply(null, arguments);
  var argLen = args.length;
  // TODO: if empty, clear the clause

  var sliceClause = {};

  var pageStart  = null;
  var pageLength = null;

  var arg = null;
  for (var i=0; i < argLen; i++) {
    arg = args[i];
    if (valcheck.isNumber(arg)) {
      switch(i) {
      case 0:
        pageStart = arg;
        break;
      case 1:
        pageLength = arg;
        break;
      }
    } else if (!valcheck.isUndefined(arg['transform-results'])) {
      sliceClause['transform-results'] = arg['transform-results'];
    } else if (!valcheck.isUndefined(arg['extract-document-data'])) {
      sliceClause['extract-document-data'] = arg['extract-document-data'];
    } else if (!valcheck.isUndefined(arg['document-transform'])) {
      sliceClause['document-transform'] = arg['document-transform'];
    } else {
      throw new Error('unknown slice argument: '+mlutil.identify(arg, true));
    }
  }

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

  self.sliceClause = sliceClause;

  return self;
}

/**
 * Sets the calculate clause of a built query, specifying JSON properties,
 * XML elements or attributes, fields, or paths with a range index for
 * value frequency or other aggregate calculation.
 * @method
 * @memberof queryBuilder#
 * @param {queryBuilder.Facet} ...facets - the facets to calculate
 * over the documents in the result set as returned by
 * the {@link queryBuilder#facet} function.
 * @returns {queryBuilder.BuiltQuery} a built query
 */
function calculate() {
  var self = (this instanceof QueryBuilder) ? this : new QueryBuilder();

  var args = mlutil.asArray.apply(null, arguments);

  // TODO: distinguish facets and values
  var calculateClause = {
      constraint: args
  };

  self.calculateClause = calculateClause;

  return self;
}

/**
 * A facet definition returned by the {@link queryBuilder#facet} function
 * to pass to a {@link queryBuilder#calculate} function.
 * @typedef {object} queryBuilder.Facet
 */
/**
 * Calculates frequency of the values in a collection, range index, or geospatial index
 * for the qualified documents.
 * You can enumerate the indexed values, group numeric or datetime values in buckets, or
 * group geospatial values in a heatmap grid.
 * The name of the facet can also be used as a constraint to tag values in a parsed string query
 * (if supplied in the {@link queryBuilder#where} clause) and bind the values
 * to a query.
 * @method
 * @memberof queryBuilder#
 * @param {string} name - a name for the facet to identify the calculated
 * result and use as a constraint to tag values in a parsed query string
 * @param {queryBuilder.IndexedName|queryBuilder.GeoLocation} indexedName - a JSON property,
 * XML element or attribute, field, or path with a range index or the specification
 * of a geospatial index.
 * @param {queryBuilder.BucketParam} [...bucket] - for a numeric or datetime facet,
 * two or more ranges returned by the {@link queryBuilder#bucket} function
 * @param {queryBuilder.HeatMapParam} [buckets] - for a geospatial facet,
 * a grid of geospatial locations returned by the {@link queryBuilder#heatmap} function
 * @param {queryBuilder.CalculateFunction} [custom] - for a custom facet, the specification
 * of a module returned by the {@link queryBuilder#calculateFunction} function
 * @param {queryBuilder.FacetOptionsParam} [options] - options
 * from {@link queryBuilder#facetOptions} modifying the default behavior
 * @returns {queryBuilder.Facet} a facet definition
 * for the {@link queryBuilder#calculate} function
 */
function facet() {
  var args = mlutil.asArray.apply(null, arguments);
  var argLen = args.length;
  if (argLen < 1) {
    throw new Error('facet must at a minimum identify the index');
  }

  var isConstraintIndex = {
    collection:               true,
    element:                  true,
    field:                    true,
    'geo-attr-pair':          true,
    'geo-elem':               true,
    'geo-elem-pair':          true,
    'geo-json-property':      true,
    'geo-json-property-pair': true,
    'geo-path':               true,
    'json-property':          true,
    'path-index':             true
  };
  var isGeoLocationIndex = {
    'geo-attr-pair':          true,
    'geo-elem':               true,
    'geo-elem-pair':          true,
    'geo-json-property':      true,
    'geo-json-property-pair': true,
    'geo-path':               true
  };

  var constraintName = null;
  var constraintIndex = null;
  var firstKey = null;
  var datatype;
  var collation;
  var facetOptions;
  var calculateFunction;
  var buckets = null;
  var computedBuckets = null;
  var heatmap = null;

  var arg = null;
  for (var i=0; i < argLen; i++) {
    arg = args[i];
    switch(i) {
    case 0:
      if (valcheck.isString(arg)) {
        constraintName = arg;
      } else {
        constraintIndex = arg;
      }
      continue;
    case 1:
      if (!valcheck.isNullOrUndefined(arg['start-facet']) &&
          !valcheck.isNullOrUndefined(arg['finish-facet'])) {
        calculateFunction = arg;
        continue;
      }
      if (constraintIndex === null) {
        if (valcheck.isString(arg)) {
          constraintIndex = property(arg);
          continue;
        }
        firstKey = Object.keys(arg)[0];
        if (isConstraintIndex[firstKey]) {
          constraintIndex = arg;
          continue;
        }
      }
    }
    if (datatype === undefined) {
      datatype = arg.datatype;
      if (datatype !== undefined) {
        collation = arg.collation;
        continue;
      }
    }
    if (facetOptions === undefined) {
      facetOptions = arg['facet-option'];
      if (facetOptions !== undefined) {
        continue;
      }
    }
    if (calculateFunction === undefined &&
        !valcheck.isNullOrUndefined(arg['start-facet']) &&
        !valcheck.isNullOrUndefined(arg['finish-facet'])) {
      calculateFunction = arg;
      continue;
    }
    if (heatmap === null) {
      heatmap = arg.heatmap;
      if (!valcheck.isNullOrUndefined(heatmap)) {
        continue;
      }
    }
    if (arg instanceof BucketDef) {
      if (buckets === null) {
        buckets = [arg];
      } else {
        buckets.push(arg);
      }
      continue;
    }
    if (arg instanceof ComputedBucketDef) {
      if (computedBuckets === null) {
        computedBuckets = [arg];
      } else {
        computedBuckets.push(arg);
      }
      continue;
    }
    if (valcheck.isArray(arg) && arg.length > 0) {
      if (arg[0] instanceof BucketDef) {
        if (buckets === null) {
          buckets = arg;
        } else {
          Array.prototype.push.apply(buckets, arg);
        }
        continue;
      }
      if (arg[0] instanceof ComputedBucketDef) {
        if (computedBuckets === null) {
          computedBuckets = arg;
        } else {
          Array.prototype.push.apply(computedBuckets, arg);
        }
        continue;
      }
    }
    throw new Error('unknown facet argument: '+mlutil.identify(arg, true));
  }
  if (constraintIndex === null) {
    constraintIndex = property(constraintName);
  } else if (constraintName === null) {
    constraintName = defaultConstraintName(constraintIndex);
    if (constraintName === null) {
      throw new Error('could not default constraint name from '+
          Object.keys(constraintIndex).join(', ') + ' index'
          );
    }
  }

  var facetWrapper = {name: constraintName};
  var constraint = {facet: true};
  if (constraintIndex.collection !== undefined) {
    facetWrapper.collection = constraint;
  } else if (calculateFunction !== undefined) {
    constraint['start-facet']  = calculateFunction['start-facet'];
    constraint['finish-facet'] = calculateFunction['finish-facet'];
    facetWrapper.custom = constraint;
  } else if (isGeoLocationIndex[firstKey]) {
    facetWrapper[firstKey] = constraintIndex[firstKey];
    if (heatmap !== null) {
      facetWrapper[firstKey].heatmap = heatmap;
    }
  } else {
    facetWrapper.range = constraint;
    if (!valcheck.isNullOrUndefined(datatype)) {
      constraint.type = datatype;
      if (!valcheck.isNullOrUndefined(collation)) {
        constraint.collation = collation;
      }
    }
    var constraintKeys = Object.keys(constraintIndex);
    var constraintKeyLen = constraintKeys.length;
    for (var j=0; j < constraintKeyLen; j++) {
      var key = constraintKeys[j];
      constraint[key] = constraintIndex[key];
    }
    if (buckets !== null) {
      constraint.bucket = buckets;
    }
    if (computedBuckets !== null) {
      constraint['computed-bucket'] = computedBuckets;
    }
  }
  if (facetOptions !== undefined) {
    constraint['facet-option'] = facetOptions;
  }

  return facetWrapper;
}

/**
 * The specification for a custom constraint facet generation module
 * as returned by {@link queryBuilder#calculateFunction} to pass
 * to the {@link queryBuilder#facet} function.
 * @typedef {object} queryBuilder.CalculateFunction
 */
/**
 * Specifies a module that generates a custom facet as an argument to the
 * {@link queryBuilder#facet} function.
 * The library must be installed as /ext/marklogic/query/custom/MODULE_NAME.xqy,
 * must have the http://marklogic.com/query/custom/MODULE_NAME namespace, and
 * must define the start-facet() and finish-facet() functions. The same module
 * can implement a parse() function for a custom parser specified with the
 * {@link queryBuilder#parseFunction} helper.
 * @method
 * @memberof queryBuilder#
 * @param {string} moduleName - the name of the module with the functions
 * @returns {queryBuilder.CalculateFunction} the specification for a custom facet
 * module for the {@link queryBuilder#facet} function.
 */
function calculateFunction() {
  var args = mlutil.asArray.apply(null, arguments);
  if (args.length < 1) {
    throw new Error('calculate function without module name');
  }

  var moduleName = args[0];

  var rootname = mlutil.rootname(moduleName);
  if (rootname === null) {
    throw new Error('library must have an extension of .xqy');
  }

  return {
      'start-facet': {
        apply: 'start-facet',
        ns:    'http://marklogic.com/query/custom/'+rootname,
        at:    '/ext/marklogic/query/custom/'+moduleName
      },
      'finish-facet': {
        apply: 'finish-facet',
        ns:    'http://marklogic.com/query/custom/'+rootname,
        at:    '/ext/marklogic/query/custom/'+moduleName
      }
  };
}

/**
 * Options for a facet calculation returned by the {@link queryBuilder#facetOptions}
 * function.
 * @typedef {object} queryBuilder.FacetOptionsParam
 */
/**
 * Provides options modifying the default behavior
 * of a {@link queryBuilder#facet} calculation.
 * @method
 * @memberof queryBuilder#
 * @param {...string} options - options supported for facet calculations
 * @returns {queryBuilder.FacetOptionsParam} options for a {@link queryBuilder#facet} calculation
 */
function facetOptions() {
  return new FacetOptionsDef(mlutil.asArray.apply(null, arguments));
}
/** @ignore */
function FacetOptionsDef(options) {
  if (!(this instanceof FacetOptionsDef)) {
    return new FacetOptionsDef(options);
  }

  if (!valcheck.isArray(options)) {
    throw new Error('invalid options list: '+mlutil.identify(options, true));
  } else if (options.length === 0) {
    throw new Error('empty options list');
  } else {
    this['facet-option'] = options;
  }
}

/**
 * The definition of a numeric or datetime range returned by the {@link queryBuilder#bucket} function
 * for aggregating value frequencies with a {@link queryBuilder#facet} function.
 * @typedef {object} queryBuilder.BucketParam
 */
/**
 * Defines a numeric or datetime range of for aggregating value frequencies
 * as part of a {@link queryBuilder#facet} calculation. To compute both lower and upper bounds
 * relative to the same anchor, you can as a convenience return both bounds and the relation
 * from a single call to an {@link queryBuilder#anchor} function.
 * @method
 * @memberof queryBuilder#
 * @param {string} name - the name of the bucket
 * @param [lower] - the lower numeric or datetime boundary, which is less than or equal to the values
 * in the bucket; omit the lower bound to specify a bucket for the smallest values;
 * return the lower bound from an {@link queryBuilder#anchor} function to compute a datetime boundary
 * relative to a temporal milestone
 * @param {string} comparison - the constant '<' separating and comparing the lower and upper bounds
 * @param [upper] - the upper numeric or datetime boundary, which is greater than the values
 * in the bucket; omit the upper bound to specify a bucket for the largest values;
 * return the upper bound from an {@link queryBuilder#anchor} function to compute a datetime boundary
 * relative to a temporal milestone
 * @returns {queryBuilder.BucketParam} specification for a {@link queryBuilder#facet} calculation
 */
function bucket() {
  var args = mlutil.asArray.apply(null, arguments);
  switch(args.length) {
  case 0:
    throw new Error('must specify name, comparison, and bound for bucket');
  case 1:
    throw new Error('must specify comparison and bound for bucket');
  case 2:
    if (args[1] instanceof AnchorDef) {
      return new ComputedBucketDef(args[0], args[1], null);
    }
    throw new Error('must specify one anchor with upper and lower bounds or separate lower and upper bounds for bucket');
  case 3:
    if (args[1] === '<') {
      if (args[2] instanceof AnchorDef) {
        return new ComputedBucketDef(args[0], null, args[2]);
      }
      return new BucketDef(args[0], null, args[2]);
    } else if (args[1] === '>') {
      if (args[2] instanceof AnchorDef) {
        return new ComputedBucketDef(args[0], args[2], null);
      }
      return new BucketDef(args[0], args[2], null);
    } else if (args[2] === '<') {
      if (args[1] instanceof AnchorDef) {
        return new ComputedBucketDef(args[0], args[1], null);
      }
      return new BucketDef(args[0], args[1], null);
    } else if (args[2] === '>') {
      if (args[1] instanceof AnchorDef) {
        return new ComputedBucketDef(args[0], null, args[1]);
      }
      return new BucketDef(args[0], null, args[1]);
    }
    throw new Error('missing comparison between lower and upper bounds of bucket');
  case 4:
    if (args[2] === '<') {
      if (args[1] instanceof AnchorDef) {
        return new ComputedBucketDef(args[0], args[1], args[3]);
      }
      return new BucketDef(args[0], args[1], args[3]);
    } else if (args[2] === '>') {
      if (args[1] instanceof AnchorDef) {
        return new ComputedBucketDef(args[0], args[3], args[1]);
      }
      return new BucketDef(args[0], args[3], args[1]);
    }
    throw new Error('invalid comparison between lower and upper bounds of bucket: '+mlutil.identify(args[2], true));
  default:
    throw new Error('too many parameters for bucket: '+args.length);
  }
}
/** @ignore */
function BucketDef(name, lower, upper) {
  if (!(this instanceof BucketDef)) {
    return new BucketDef(name, lower, upper);
  }

  if (valcheck.isNullOrUndefined(name)) {
    throw new Error('missing name for bucket');
  } else if (!valcheck.isString(name)) {
    throw new Error('invalid name for bucket: '+mlutil.identify(name, true));
  }
  this.name  = name;
  this.label = name;

  var lowerType = -1;
  if (valcheck.isNullOrUndefined(lower)) {
    lowerType = 0;
  } else if (valcheck.isNumber(lower)) {
    lowerType = 1;
  } else if (valcheck.isString(lower) || lower instanceof Date) {
    lowerType = 2;
  } else {
    throw new Error('invalid lower bound for bucket: '+mlutil.identify(lower, true));
  }

  var upperType = -1;
  if (valcheck.isNullOrUndefined(upper)) {
    upperType = 0;
  } else if (valcheck.isNumber(upper)) {
    upperType = 1;
  } else if (valcheck.isString(upper) || upper instanceof Date) {
    upperType = 2;
  } else {
    throw new Error('invalid upper bound for bucket: '+mlutil.identify(upper, true));
  }

  if (lowerType === 0 && upperType === 0) {
    throw new Error('must specify at least one bound for a bucket');
  } else if (upperType === 0) {
    this.ge = lower;
  } else if (lowerType === 0) {
    this.lt = upper;
  } else if (lowerType === upperType ) {
    this.ge = lower;
    this.lt = upper;
  } else {
    throw new Error('cannot mix lower and upper bound values of different types');
  }
}
/** @ignore */
function ComputedBucketDef(name, lower, upper) {
  if (!(this instanceof ComputedBucketDef)) {
    return new ComputedBucketDef(name, lower, upper);
  }

  if (valcheck.isNullOrUndefined(name)) {
    throw new Error('missing name for computed bucket');
  } else if (!valcheck.isString(name)) {
    throw new Error('invalid name for computed bucket: '+mlutil.identify(name, true));
  }
  this.name  = name;
  this.label = name;

  var lowerType = -1;
  if (valcheck.isNullOrUndefined(lower)) {
    lowerType = 0;
  } else if (lower instanceof AnchorDef) {
    lowerType = valcheck.isNullOrUndefined(lower.value) ? 1 : 2;
  } else {
    throw new Error('invalid lower bound for computed bucket: '+mlutil.identify(lower, true));
  }

  var upperType = -1;
  if (valcheck.isNullOrUndefined(upper)) {
    upperType = 0;
  } else if (upper instanceof AnchorDef) {
    upperType = valcheck.isNullOrUndefined(upper.value) ? 1 : 2;
  } else {
    throw new Error('invalid upper bound for computed bucket: '+mlutil.identify(upper, true));
  }

  if (lowerType === 0 && upperType === 0) {
    throw new Error('missing lower and upper bounds for computed bucket');
  } else if (lowerType === 1 && upperType === 0) {
    this.anchor = lower.anchor;
    this.ge     = lower.ge;
    this.lt     = lower.lt;
  } else if (lowerType === 0 && upperType === 1) {
    this.anchor = upper.anchor;
    this.ge     = upper.ge;
    this.lt     = upper.lt;
  } else if (lowerType === 2 && upperType === 2) {
    this['ge-anchor'] = lower.anchor;
    this.ge           = lower.value;
    this['lt-anchor'] = upper.anchor;
    this.lt           = upper.value;
  } else if (lowerType === 2 && upperType === 0) {
    this.anchor = lower.anchor;
    this.ge     = lower.value;
  } else if (lowerType === 0 && upperType === 2) {
    this.anchor = upper.anchor;
    this.lt     = upper.value;
  } else if (lowerType === 1 && upperType === 1) {
    throw new Error('two anchors cannot specify both lower and upper bounds for computed bucket');
  }
}
/**
 * The specification for computing a datetime boundary or range as returned by
 * the {@link queryBuilder#anchor} function to pass to the {@link queryBuilder#bucket} function.
 * @typedef {object} queryBuilder.AnchorParam
 */
/**
 * Defines a numeric or datetime range of for aggregating value frequencies
 * as part of a {@link queryBuilder#facet} calculation. To compute both lower and upper bounds
 * relative to the same anchor, you can as a convenience return both bounds and the comparison
 * from a single call to an {@link queryBuilder#anchor} function.
 * @method
 * @memberof queryBuilder#
 * @param {string} milestone - the temporal milestone from the enumeration
 * now|start-of-day|start-of-month|start-of-year
 * @param {string} lower - a boundary as a duration offset relative to the temporal milestone
 * such as -P1Y for one year in the past, -P2D for two days in the past, and so on; formally,
 * an xs:duration, xs:yearMonthDuration, or xs:dayTimeDuration value
 * @param {string} [comparison] - the constant '<' separating the lower and upper bounds; if the
 * comparison is provided, the preceding offset must establish the lower bound and the following offset
 * must establish the upper bound
 * @param {string} [upper] - the upper boundary as a duration offset relative to the temporal milestone
 * @returns {queryBuilder.AnchorParam} specification for a {@link queryBuilder#bucket}
 * as part of a facet calculation
 */
function anchor() {
  var args = mlutil.asArray.apply(null, arguments);
  switch(args.length) {
  case 0:
    throw new Error('no milestone or lower bound for anchor');
  case 1:
    throw new Error('no lower bound for anchor');
  case 2:
    return new AnchorDef(args[0], args[1], null, null);
  case 3:
    throw new Error('must specify comparison with both lower and upper bounds for anchor');
  case 4:
    return new AnchorDef(args[0], args[1], args[2], args[3]);
  default:
    throw new Error('too many parameters for anchor: '+args.length);
  }
}
/** @ignore */
function AnchorDef(milestone, first, comparison, second) {
  if (!(this instanceof AnchorDef)) {
    return new AnchorDef(milestone, first, comparison, second);
  }

  if (valcheck.isString(milestone)) {
    this.anchor = milestone;
  } else if (valcheck.isNullOrUndefined(milestone)) {
    throw new Error('missing milestone for anchor');
  } else {
    throw new Error('invalid milestone for anchor: '+mlutil.identify(milestone, true));
  }

  var comparisonType = -1;
  if (valcheck.isNullOrUndefined(comparison)) {
    comparisonType = 0;
  } else if (comparison === '<') {
    comparisonType = 1;
  } else if (comparison === '>') {
    comparisonType = 2;
  } else {
    throw new Error('invalid comparison for anchor: '+mlutil.identify(comparison, true));
  }

  if (valcheck.isString(first)) {
    switch (comparisonType) {
    case 0:
      this.value = first; break;
    case 1:
      this.ge    = first; break;
    case 2:
      this.lt    = first; break;
    }
  } else if (valcheck.isNullOrUndefined(first)) {
    throw new Error((comparisonType === 0) ?
        'missing value for anchor' :
        'missing first bound for anchor');
  } else {
    throw new Error((comparisonType === 0) ?
        ('invalid value for anchor: '+mlutil.identify(first, true)) :
        ('invalid first bound for anchor: '+mlutil.identify(first, true)));
  }

  if (valcheck.isString(second)) {
    switch (comparisonType) {
    case 0:
      throw new Error('must specify comparison with second bound for anchor');
    case 1:
      this.lt = second; break;
    case 2:
      this.ge = second; break;
    }
  } else if (valcheck.isNullOrUndefined(second)) {
    if (comparisonType !== 0) {
      throw new Error('missing second bound for anchor');
    }
  } else {
    throw new Error('invalid second bound for anchor: '+mlutil.identify(second, true));
  }
}
/** @ignore */
function defaultConstraintName(index) {
  if (index instanceof JSONPropertyDef) {
    return index['json-property'];
  }
  if (index instanceof ElementDef) {
    return index.element.name;
  } else if (index instanceof FieldDef) {
    return index.field.name;
  }
  return null;
}

/**
 * A query definition returned by the {@link queryBuilder#parsedFrom} function
 * to pass to a {@link queryBuilder#where} function.
 * @typedef {object} queryBuilder.ParsedQuery
 */
/**
 * Builds a parsed query from a string and bindings of constraint tags
 * to queries. The query parsing occurs on the server.
 * @method
 * @memberof queryBuilder#
 * @param {string} query - the string to parse
 * @param {queryBuilder.ParseBindings} bindings - the mappings of constraint names to queries
 * as returned by the {@link queryBuilder#parseBindings} function
 * @returns {queryBuilder.ParsedQuery} a query for
 * the {@link queryBuilder#where} function
 */
function parsedFrom() {
  var qtext = null;
  var bindings = null;
  var constraints = null;
  var term = null;

  switch(arguments.length) {
  case 0:
    throw new Error('no query text');
  case 1:
    qtext = arguments[0];
    break;
  case 2:
    qtext = arguments[0];
    bindings = arguments[1];
    constraints = bindings.constraint;
    term = bindings.term;
    break;
  default:
    throw new Error('parse from specifies only query text and bindings: '+mlutil.identify(args, true));
  }

  return new ParsedDef(new ParsedQueryDef(qtext, constraints, term));
}
/** @ignore */
function ParsedDef(queryDef) {
  if (!(this instanceof ParsedDef)) {
    return new ParsedDef(queryDef);
  }

  if (queryDef instanceof ParsedQueryDef) {
    this.parsedQuery = queryDef;
  } else if (valcheck.isNullOrUndefined(queryDef)) {
    throw new Error('missing query definition to parse from');
  } else {
    throw new Error('invalid query definition to parse from: '+mlutil.identify(queryDef, true));
  }
}
/** @ignore */
function ParsedQueryDef(qtext, constraints, term) {
  if (!(this instanceof ParsedQueryDef)) {
    return new ParsedQueryDef(qtext, constraints, term);
  }

  if (valcheck.isString(qtext)) {
    this.qtext = qtext;
  } else if (valcheck.isNullOrUndefined(qtext)) {
    throw new Error('missing query text to parse from');
  } else {
    throw new Error('invalid query text to parse from: '+mlutil.identify(qtext, true));
  }
  if (valcheck.isArray(constraints)) {
    if (constraints.length > 0) {
      this.constraint = constraints;
    }
  } else if (!valcheck.isNullOrUndefined(constraints)) {
    throw new Error('invalid constraints to parse from: '+mlutil.identify(constraints, true));
  }
  if (!valcheck.isNullOrUndefined(term)) {
    this.term = term;
  }
}

/**
 * Mappings of constraint names to queries as returned
 * by the {@link queryBuilder#parseBindings} function
 * to pass to a {@link queryBuilder#parsedFrom} function
 * for tagging values within the query string.
 * @typedef {object} queryBuilder.ParseBindings
 */
/**
 * Maps constraint names to queries and passed to
 * a {@link queryBuilder#parsedFrom} function
 * for tagging values within the query string.
 * The query parsing occurs on the server.
 * @method
 * @memberof queryBuilder#
 * @param {queryBuilder.Query|queryBuilder.ParseFunction} ...query - queries that contain a binding
 * to a constraint name as returned by the {@link queryBuilder#bind} (instead of
 * specifying the criteria directly in the query) or that supply a custom constraint parsing
 * function to generate the query as returned by the {@link queryBuilder#parseFunction}
 * @param {queryBuilder.EmptyBindingParam} [emptyBinding] - specifies whether an
 * empty string matches no documents or all documents as returned
 * by the {@link queryBuilder#bindEmptyAs} function
 * @returns {queryBuilder.ParseBindings} a list of constraint bindings for
 * the {@link queryBuilder#parsedFrom} function
 */
function parseBindings() {
  return makeBindings('parse', mlutil.asArray.apply(null, arguments));
}
/** @ignore */
function makeBindings(variant, args) {
  var isParse = (variant === 'parse');
  var desc = isParse ? 'parsing query text' : 'defining suggestion sources';

  var argLen = args.length;
  if (argLen < 1) {
    throw new Error('no bindings for '+desc);
  }

  var constraints = null;
  var defaultConstraints = null;
  var suggestOptions = null;
  var empty = null;
  var arg = null;
  for (var i=0; i < argLen; i++) {
    arg = args[i];
    if (!valcheck.isUndefined(arg.name)) {
      if (isParse && !valcheck.isUndefined(arg['suggest-option'])) {
        throw new Error('cannot specify suggest options for named parse query bindings');
      }
      if (constraints === null) {
        constraints = [arg];
      } else {
        constraints.push(arg);
      }
      continue;
    }
    if (valcheck.isNullOrUndefined(defaultConstraints)) {
      defaultConstraints = arg['default'];
      if (!valcheck.isUndefined(defaultConstraints)) {
        suggestOptions = arg['suggest-option'];
        if (isParse && !valcheck.isUndefined(suggestOptions)) {
          throw new Error('cannot specify suggest options for default parse query binding');
        }
        continue;
      }
    }
    if (valcheck.isNullOrUndefined(empty)) {
      empty = arg.empty;
      if (!valcheck.isUndefined(empty)) {
        continue;
      }
    }
    throw new Error('unknown argument for parse query binding: '+mlutil.identify(arg, true));
  }

  var termDef = (
      valcheck.isNullOrUndefined(defaultConstraints) &&
      valcheck.isNullOrUndefined(empty) &&
      valcheck.isNullOrUndefined(suggestOptions)
      ) ? null :
        new TermBindingDef(defaultConstraints, empty, suggestOptions);

  return new BindingsDef(constraints, termDef);
}
/** @ignore */
function BindingsDef(constraints, termDef) {
  if (!(this instanceof BindingsDef)) {
    return new BindingsDef(constraints, termDef);
  }

  if (valcheck.isArray(constraints) && constraints.length > 0) {
    this.constraint = constraints;
  } else if (!valcheck.isNullOrUndefined(constraints)) {
    throw new Error('invalid constraints list for parse query binding: '+mlutil.identify(constraints, true));
  }
  if (termDef instanceof TermBindingDef) {
    this.term = termDef;
  } else if (!valcheck.isNullOrUndefined(termDef)) {
    throw new Error('invalid term bindings for parse query binding: '+mlutil.identify(termDef, true));
  }
}
/** @ignore */
function TermBindingDef(defaultConstraints, empty, suggestOptions) {
  if (!(this instanceof TermBindingDef)) {
    return new TermBindingDef(defaultConstraints, empty, suggestOptions);
  }

  if (!valcheck.isNullOrUndefined(defaultConstraints)) {
      this['default'] = defaultConstraints;
  }
  if (!valcheck.isNullOrUndefined(empty)) {
    this.empty = empty;
  }
  if (!valcheck.isNullOrUndefined(suggestOptions)) {
    this['suggest-option'] = suggestOptions;
  }
}

/**
 * A binding returned by the {@link queryBuilder#bind} function
 * for parsing a query string. The binding declares a constraint name
 * that tags the values in the query string and occupies the position
 * of the values in a query.
 * @typedef {object} queryBuilder.BindingParam
 */
/**
 * Specifies a constraint name that binds values provided by a parsed
 * query string to a query. The values are tagged with the constraint
 * name in the query string. The binding occupies the position of the
 * values in the query specification.
 * @method
 * @memberof queryBuilder#
 * @param {string} parts - the constraint name
 * @returns {queryBuilder.BindingParam} the binding for the constraint name
 */
function bind(name) {
  return new BindDef(name);
}
/** @ignore */
function BindDef(name) {
  if (!(this instanceof BindDef)) {
    return new BindDef(name);
  }

  if (valcheck.isString(name)) {
    this.constraintName = name;
  } else if (valcheck.isNullOrUndefined(name)) {
    throw new Error('cannot bind empty name to constraint');
  } else {
    throw new Error('cannot bind invalid name to constraint: '+mlutil.identify(name, true));
  }
}
/**
 * A binding returned by the {@link queryBuilder#bindDefault} function
 * for parsing a query string. The binding associates untagged values
 * in the query string with a query, occupying the position of the
 * values in a query. A search can have only one default binding.
 * @typedef {object} queryBuilder.DefaultBindingParam
 */
/**
 * Binds untagged values provided by a parsed query string to a query. The
 * binding occupies the position of the values in the query specification.
 * A search can have only one default binding.
 * @method
 * @memberof queryBuilder#
 * @returns {queryBuilder.DefaultBindingParam} the binding for the constraint name
 */
function bindDefault() {
  return new BindDefaultDef();
}
/** @ignore */
function BindDefaultDef() {
  if (!(this instanceof BindDefaultDef)) {
    return new BindDefaultDef();
  }

  this.defaultConstraint = true;
}
/**
 * A specification whether an empty query string should be bound
 * to a query for no documents or all documents as returned
 * by the {@link queryBuilder#bindEmptyAs} function.
 * @typedef {object} queryBuilder.EmptyBindingParam
 */
/**
 * Binds an empty query string to no documents or all documents.
 * @method
 * @memberof queryBuilder#
 * @param {string} apply - a function from the all-results|no-results
 * enumeration to control whether empty criteria matches all or no results
 * @returns {queryBuilder.EmptyBindingParam} the binding for an empty string
 * to pass to the {@link queryBuilder#parseBindings} function
 */
function bindEmptyAs(binding) {
  return new BindEmptyDef(new EmptyApplyDef(binding));
}
/** @ignore */
function BindEmptyDef(applyDef) {
  if (!(this instanceof BindEmptyDef)) {
    return new BindEmptyDef(applyDef);
  }

  if (applyDef instanceof EmptyApplyDef) {
    this.empty = applyDef;
  } else if (valcheck.isNullOrUndefined(applyDef)) {
    throw new Error('cannot bind empty name to constraint');
  } else {
    throw new Error('cannot bind invalid name to constraint: '+mlutil.identify(applyDef, true));
  }
}
/** @ignore */
function EmptyApplyDef(binding) {
  if (!(this instanceof EmptyApplyDef)) {
    return new EmptyApplyDef(binding);
  }

  var valid = {'all-results': true, 'no-results': true};

  if (valcheck.isString(binding) && valid[binding] === true) {
    this.apply = binding;
  } else if (valcheck.isNullOrUndefined(binding)) {
    throw new Error('no binding specified for empty input');
  } else {
    throw new Error('unknown binding specified for empty input: '+mlutil.identify(binding, true));
  }
}
/**
 * The specification for a custom constraint parsing module as returned by
 * {@link queryBuilder#parseFunction} to pass
 * to the {@link queryBuilder#parseBindings} function.
 * @typedef {object} queryBuilder.ParseFunction
 */
/**
 * Specifies a custom constraint module that parses a tagged value as an argument
 * to the {@link queryBuilder#parseBindings} function.
 * The library must be installed as /ext/marklogic/query/custom/MODULE_NAME.xqy,
 * must have the http://marklogic.com/query/custom/MODULE_NAME namespace, and
 * must define the parse() function. The same module can implement start-facet()
 * and finish-facet() functions for a custom facet specified with the
 * {@link queryBuilder#calculateFunction} helper.
 * @method
 * @memberof queryBuilder#
 * @param {string} moduleName - the name of the module with the function
 * @returns {queryBuilder.ParseFunction} the specification for a custom parsing
 * module for the {@link queryBuilder#parseBindings} function.
 */
function parseFunction() {
  var args = mlutil.asArray.apply(null, arguments);
  var argLen = args.length;
  if (argLen < 2) {
    throw new Error('query parse function without module name or binding');
  }

  var moduleName = args[0];

  var constraintName = null;
  var termOptions = null;
  var arg = null;
  for (var i=1; i < args.length; i++) {
    arg = args[i];
    if (termOptions === null && arg instanceof TermOptionsDef) {
      termOptions = arg['term-option'];
      continue;
    }
    if (constraintName === null && arg instanceof BindDef) {
      constraintName = arg.constraintName;
      continue;
    }
    throw new Error('unknown argument for parse function: '+mlutil.identify(arg, true));
  }

  return new CustomConstraintDef(
      constraintName,
      new CustomOptionsDef(new CustomParserDef(moduleName), termOptions)
      );
}
/** @ignore */
function CustomConstraintDef(constraintName, constraintDef) {
  if (!(this instanceof CustomConstraintDef)) {
    return new CustomConstraintDef(constraintName, constraintDef);
  }

  if (valcheck.isString(constraintName)) {
    this.name = constraintName;
  } else {
    throw new Error('query parse function without a binding to a constraint name');
  }
  if (constraintDef instanceof CustomOptionsDef) {
    this.custom = constraintDef;
  } else if (valcheck.isNullOrUndefined(constraintDef)) {
    throw new Error('empty constraint definition for query parse function');
  } else {
    throw new Error('invalid constraint definition for query parse function: '+
        mlutil.identify(constraintDef, true));
  }
}
/** @ignore */
function CustomOptionsDef(parserDef, termOptions) {
  if (!(this instanceof CustomOptionsDef)) {
    return new CustomOptionsDef(parserDef, termOptions);
  }

  if (parserDef instanceof CustomParserDef) {
    this.parse = parserDef;
  } else if (valcheck.isNullOrUndefined(parserDef)) {
    throw new Error('empty parser definition for query parse function');
  } else {
    throw new Error('invalid parser definition for query parse function: '+
        mlutil.identify(parserDef, true));
  }
  if (!valcheck.isNullOrUndefined(termOptions)) {
    this['term-option'] = termOptions;
  }
  this.facet = false;
}
/** @ignore */
function CustomParserDef(moduleName) {
  if (!(this instanceof CustomParserDef)) {
    return new CustomParserDef(moduleName);
  }

  var rootname = mlutil.rootname(moduleName);
  if (rootname === null) {
    throw new Error('library must have an extension of .xqy');
  }

  this.apply = 'parse';
  this.ns    = 'http://marklogic.com/query/custom/'+rootname;
  this.at    = '/ext/marklogic/query/custom/'+moduleName;
}

/**
 * Specifies JSON properties or XML elements to project from the
 * documents returned by a query.
 * @method
 * @memberof queryBuilder#
 * @param {string|string[]} paths - restricted XPaths (valid for
 * the cts:valid-index-path() function) to match in documents
 * @param {object} [namespaces] - for XPaths using namespaces,
 * an object whose properties specify the prefix as the key and
 * the uri as the value
 * @param {string} [selected] - specifies how to process
 * the selected JSON properties or XML elements where
 * include (the default) lists the selections,
 * include-ancestors projects a sparse document with
 * the selections and their ancesors, and
 * exclude suppresses the selections to projects a sparse document
 * with the sibilings and ancestors of the selections.
 * @returns {object} a extract definition
 * for the {@link queryBuilder#slice} function
 */
function extract() {
  var args = mlutil.asArray.apply(null, arguments);
  var argLen = args.length;
  if (argLen < 1) {
    throw new Error('must specify paths to extract');
  }

  var extractdef = {};

  var arg = args[0];
  if (valcheck.isString(arg)) {
    extractdef['extract-path'] = args;
  } else {
    var paths = arg.paths;
    if (valcheck.isString(paths)) {
      extractdef['extract-path'] = [paths];
    } else if (valcheck.isArray(paths)) {
      extractdef['extract-path'] = paths;
    } else if (valcheck.isUndefined(paths)) {
      throw new Error('first argument does not have key for paths to extract');
    }

    var namespaces = arg.namespaces;
    if (!valcheck.isUndefined(namespaces)) {
      extractdef.namespaces = namespaces;
    }

    var selected = arg.selected;
    if (!valcheck.isUndefined(selected)) {
      extractdef.selected = selected;
    }
  }

  return {'extract-document-data': extractdef};
}

/**
 * Specifies a function for getting snippets with highlighted
 * matching text and contextual preceding and following text
 * from the documents returned by a query. You can specify
 * a built-in snippeting function or custom snippeting library.
 * The custom snippeting library must have been installed previously
 * by the {@link config.query.snippet#write} function
 * @method
 * @memberof queryBuilder#
 * @param {string} name - either the name of a builtin snippeting
 * function from the empty|metadata|snippet enumeration (where
 * snippet is the default) or the filename without path
 * for a custom snippeting library
 * @param {object} [options] - the configuration options
 * for a built-in snippeting function including
 * 'per-match-tokens', 'max-matches', 'max-snippet-chars',
 * and 'preferred-matches'; you cannot specify options or
 * parameters for a custom snippeting library
 * @returns {object} a snippet definition
 * for the {@link queryBuilder#slice} function
 */
function snippet() {
  var args = mlutil.asArray.apply(null, arguments);
  var argLen = args.length;

  var builtins = {
      empty:              'empty-snippet',
      'empty-snippet':    'empty-snippet',
      metadata:           'metadata-snippet',
      'metadata-snippet': 'metadata-snippet',
      snippet:            'snippet'
  };

  var snippeter = {
      apply: 'snippet'
  };

  var arg = null;
  var builtin = null;
  for (var i=0; i < argLen; i++) {
    arg = args[i];
    if (valcheck.isString(arg)) {
      builtin = builtins[arg];
      if (!valcheck.isUndefined(builtin)) {
        snippeter.apply = builtin;
        continue;
      } else {
        var rootname = mlutil.rootname(arg);
        snippeter.ns    = 'http://marklogic.com/snippet/custom/'+rootname;
        snippeter.at    = '/ext/marklogic/snippet/custom/'+arg;
        snippeter.apply = 'snippet';
        continue;
      }
    } else {
      mlutil.copyProperties(arg, snippeter);
      continue;
    }
    throw new Error('unknown argument for snippet: '+mlutil.identify(arg, true));
  }

  return {'transform-results': snippeter};
}

/**
 * Sets the withOptions clause of a built query to configure the query;
 * takes a configuration object with the following named parameters.
 * This function may be called on the result of building a query.
 * @method
 * @memberof queryBuilder#
 * @param {documents.categories}  [categories] - the categories of information
 * to retrieve for the result documents
 * @param {number} [concurrencyLevel] - the maximum number of threads to use to calculate facets
 * @param {...string} [forestNames] - the names of forests providing documents
 * for the result set
 * @param {...string} [search] - options modifying the default behaviour of the query
 * @param {string}  [txid] - the transaction id for an open transaction
 * @param {number} [weight] - a weighting factor between -16 and 64
 * @param {boolean} [debug] - whether to return query debugging
 * @param {boolean} [metrics] - whether to return metrics for the query performance
 * @param {boolean} [queryPlan] - whether to return a plan for the execution of the query
 * @param {boolean} [similarDocs] - whether to return a list of URIs for documents
 * similar to each result
 * @returns {queryBuilder.BuiltQuery} a built query
 */
function withOptions() {
  var self = (this instanceof QueryBuilder) ? this : new QueryBuilder();

  // TODO: share with documents.js
  var optionKeyMapping = {
    search:'search-option',     weight:'quality-weight',
    forestNames:'forest-names', similarDocs:'return-similar',
    metrics:'return-metrics',   queryPlan:'return-plan',
    debug:'debug',              concurrencyLevel:'concurrency-level',
    categories:true,            txid:true
  };

  var withOptionsClause = {};
  if (0 < arguments.length) {
    var arg = arguments[0];
    var argKeys = Object.keys(arg);
    for (var i=0; i < argKeys.length; i++) {
      var key = argKeys[i];
      if (!valcheck.isUndefined(optionKeyMapping[key])) {
        var value = arg[key];
        if (!valcheck.isUndefined(value)) {
          withOptionsClause[key] = value;
        } else {
          throw new Error('empty options value for '+key);
        }
      } else {
        throw new Error('unknown option '+key);
      }
    }
  }
  self.withOptionsClause = withOptionsClause;

  return self;
}

module.exports = {
  lib: {
    AnchorDef:                AnchorDef,
    AttributeDef:             AttributeDef,
    calculate:                calculate,
    BoxRegionDef:             BoxRegionDef,
    BucketDef:                BucketDef,
    CircleRegionDef:          CircleRegionDef,
    ComputedBucketDef:        ComputedBucketDef,
    DatatypeDef:              DatatypeDef,
    ElementDef:               ElementDef,
    FieldDef:                 FieldDef,
    FragmentScopeDef:         FragmentScopeDef,
    JSONPropertyDef:          JSONPropertyDef,
    orderBy:                  orderBy,
    PathIndexDef:             PathIndexDef,
    PointRegionDef:           PointRegionDef,
    PolygonRegionDef:         PolygonRegionDef,
    QNameDef:                 QNameDef,
    slice:                    slice,
    withOptions:              withOptions
  },
  builder:  {
    anchor:             anchor,
    and:                and,
    andNot:             andNot,
    attribute:          attribute,
    bind:               bind,
    bindDefault:        bindDefault,
    bindEmptyAs:        bindEmptyAs,
    boost:              boost,
    box:                box,
    bucket:             bucket,
    calculateFunction:  calculateFunction,
    circle:             circle,
    collection:         collection,
    copyFrom:           copyFromQueryBuilder,
    lsqtQuery:          lsqtQuery,
    datatype:           datatype,
    directory:          directory,
    document:           document,
    documentFragment:   documentFragment,
    element:            element,
    extract:            extract,
    facet:              facet,
    facetOptions:       facetOptions,
    field:              field,
    fragmentScope:      fragmentScope,
    geoAttributePair:   geoAttributePair,
    geoElement:         geoElement,
    geoElementPair:     geoElementPair,
    geoOptions:         geoOptions,
    geoPath:            geoPath,
    geoProperty:        geoProperty,
    geoPropertyPair:    geoPropertyPair,
    geospatial:         geospatial,
    heatmap:            heatmap,
    jsontype:           jsontype,
    latlon:             latlon,
    locksFragment:      locksFragment,
    near:               near,
    not:                not,
    notIn:              notIn,
    pathIndex:          pathIndex,
    point:              point,
    polygon:            polygon,
    propertiesFragment: propertiesFragment,
    property:           property,
    byExample:          byExample,
    qname:              qname,
    or:                 or,
    ordered:            ordered,
    parseBindings:      parseBindings,
    parsedFrom:         parsedFrom,
    parseFunction:      parseFunction,
    period:             period,
    periodCompare:      periodCompare,
    periodRange:        periodRange,
    range:              range,
    rangeOptions:       rangeOptions,
    score:              score,
    scope:              scope,
    snippet:            snippet,
    sort:               sort,
    southWestNorthEast: southWestNorthEast,
    suggestBindings:    suggestBindings,
    suggestOptions:     suggestOptions,
    temporalOptions:    temporalOptions,
    term:               term,
    termOptions:        termOptions,
    transform:          transform,
    value:              value,
    weight:             weight,
    where:              where,
    word:               word
  }
};
