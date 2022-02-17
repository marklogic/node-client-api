/*
 * Copyright (c) 2022 MarkLogic Corporation
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

/* IMPORTANT: Do not edit. This file is generated. */

const types    = require('./server-types-generated.js');
const bldrbase = require('./plan-builder-base.js');

class CtsExpr {
  constructor() {
  }
  /**
    * Returns a query matching fragments committed after a specified timestamp. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.afterQuery|cts.afterQuery}
    * @method planBuilder.cts#afterQuery
    * @since 2.1.1
    * @param { XsUnsignedLong } [timestamp] - A commit timestamp. Database fragments committed after this timestamp are matched.
    * @returns { CtsQuery }
    */
afterQuery(...args) {
    const paramdef = ['timestamp', [types.XsUnsignedLong], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('cts.afterQuery', 1, paramdef, args);
    return new types.CtsQuery('cts', 'after-query', checkedArgs);
    }
/**
    * Returns a query specifying the set difference of the matches specified by two sub-queries. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.andNotQuery|cts.andNotQuery}
    * @method planBuilder.cts#andNotQuery
    * @since 2.1.1
    * @param { CtsQuery } [positiveQuery] - A positive query, specifying the search results filtered in.
    * @param { CtsQuery } [negativeQuery] - A negative query, specifying the search results to filter out.
    * @returns { CtsQuery }
    */
andNotQuery(...args) {
    const namer = bldrbase.getNamer(args, 'positive-query');
    const paramdefs = [['positive-query', [types.CtsQuery], true, false], ['negative-query', [types.CtsQuery], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.andNotQuery', 2, new Set(['positive-query', 'negative-query']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.andNotQuery', 2, false, paramdefs, args);
    return new types.CtsQuery('cts', 'and-not-query', checkedArgs);

    }
/**
    * Returns a query specifying the intersection of the matches specified by the sub-queries. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.andQuery|cts.andQuery}
    * @method planBuilder.cts#andQuery
    * @since 2.1.1
    * @param { CtsQuery } [queries] - A sequence of sub-queries.
    * @param { XsString } [options] - Options to this query. The default is ().  Options include:  "ordered" An ordered and-query, which specifies that the sub-query matches must occur in the order of the specified sub-queries. For example, if the sub-queries are "cat" and "dog", an ordered query will only match fragments where both "cat" and "dog" occur, and where "cat" comes before "dog" in the fragment. "unordered" An unordered and-query, which specifies that the sub-query matches can occur in any order.  
    * @returns { CtsQuery }
    */
andQuery(...args) {
    const namer = bldrbase.getNamer(args, 'queries');
    const paramdefs = [['queries', [types.CtsQuery], false, true], ['options', [types.XsString], false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.andQuery', 1, new Set(['queries', 'options']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.andQuery', 1, false, paramdefs, args);
    return new types.CtsQuery('cts', 'and-query', checkedArgs);

    }
/**
    * Returns a query matching fragments committed before or at a specified timestamp. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.beforeQuery|cts.beforeQuery}
    * @method planBuilder.cts#beforeQuery
    * @since 2.1.1
    * @param { XsUnsignedLong } [timestamp] - A commit timestamp. Database fragments committed before this timestamp are matched.
    * @returns { CtsQuery }
    */
beforeQuery(...args) {
    const paramdef = ['timestamp', [types.XsUnsignedLong], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('cts.beforeQuery', 1, paramdef, args);
    return new types.CtsQuery('cts', 'before-query', checkedArgs);
    }
/**
    * Returns a query specifying that matches to matching-query should have their search relevance scores boosted if they also match boosting-query. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.boostQuery|cts.boostQuery}
    * @method planBuilder.cts#boostQuery
    * @since 2.1.1
    * @param { CtsQuery } [matchingQuery] - A sub-query that is used for match and scoring.
    * @param { CtsQuery } [boostingQuery] - A sub-query that is used only for boosting score.
    * @returns { CtsQuery }
    */
boostQuery(...args) {
    const namer = bldrbase.getNamer(args, 'matching-query');
    const paramdefs = [['matching-query', [types.CtsQuery], true, false], ['boosting-query', [types.CtsQuery], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.boostQuery', 2, new Set(['matching-query', 'boosting-query']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.boostQuery', 2, false, paramdefs, args);
    return new types.CtsQuery('cts', 'boost-query', checkedArgs);

    }
/**
    * Returns a geospatial box value. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.box|cts.box}
    * @method planBuilder.cts#box
    * @since 2.1.1
    * @param { XsDouble } [south] - The southern boundary of the box.
    * @param { XsDouble } [west] - The western boundary of the box.
    * @param { XsDouble } [north] - The northern boundary of the box.
    * @param { XsDouble } [east] - The eastern boundary of the box.
    * @returns { CtsBox }
    */
box(...args) {
    const namer = bldrbase.getNamer(args, 'south');
    const paramdefs = [['south', [types.XsDouble, PlanColumn, PlanParam], true, false], ['west', [types.XsDouble, PlanColumn, PlanParam], true, false], ['north', [types.XsDouble, PlanColumn, PlanParam], true, false], ['east', [types.XsDouble, PlanColumn, PlanParam], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.box', 4, new Set(['south', 'west', 'north', 'east']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.box', 4, false, paramdefs, args);
    return new types.CtsBox('cts', 'box', checkedArgs);

    }
/**
    * Returns a box's eastern boundary. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.boxEast|cts.boxEast}
    * @method planBuilder.cts#boxEast
    * @since 2.1.1
    * @param { CtsBox } [box] - The box.
    * @returns { XsNumeric }
    */
boxEast(...args) {
    const paramdef = ['box', [types.CtsBox, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('cts.boxEast', 1, paramdef, args);
    return new types.XsNumeric('cts', 'box-east', checkedArgs);
    }
/**
    * Returns a box's northern boundary. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.boxNorth|cts.boxNorth}
    * @method planBuilder.cts#boxNorth
    * @since 2.1.1
    * @param { CtsBox } [box] - The box.
    * @returns { XsNumeric }
    */
boxNorth(...args) {
    const paramdef = ['box', [types.CtsBox, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('cts.boxNorth', 1, paramdef, args);
    return new types.XsNumeric('cts', 'box-north', checkedArgs);
    }
/**
    * Returns a box's southern boundary. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.boxSouth|cts.boxSouth}
    * @method planBuilder.cts#boxSouth
    * @since 2.1.1
    * @param { CtsBox } [box] - The box.
    * @returns { XsNumeric }
    */
boxSouth(...args) {
    const paramdef = ['box', [types.CtsBox, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('cts.boxSouth', 1, paramdef, args);
    return new types.XsNumeric('cts', 'box-south', checkedArgs);
    }
/**
    * Returns a box's western boundary. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.boxWest|cts.boxWest}
    * @method planBuilder.cts#boxWest
    * @since 2.1.1
    * @param { CtsBox } [box] - The box.
    * @returns { XsNumeric }
    */
boxWest(...args) {
    const paramdef = ['box', [types.CtsBox, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('cts.boxWest', 1, paramdef, args);
    return new types.XsNumeric('cts', 'box-west', checkedArgs);
    }
/**
    * Returns a geospatial circle value. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.circle|cts.circle}
    * @method planBuilder.cts#circle
    * @since 2.1.1
    * @param { XsDouble } [radius] - The radius of the circle. The units for the radius is determined at runtime by the query options (miles is currently the only option).
    * @param { CtsPoint } [center] - A point representing the center of the circle.
    * @returns { CtsCircle }
    */
circle(...args) {
    const namer = bldrbase.getNamer(args, 'radius');
    const paramdefs = [['radius', [types.XsDouble, PlanColumn, PlanParam], true, false], ['center', [types.CtsPoint, PlanColumn, PlanParam], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.circle', 2, new Set(['radius', 'center']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.circle', 2, false, paramdefs, args);
    return new types.CtsCircle('cts', 'circle', checkedArgs);

    }
/**
    * Returns a circle's center point. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.circleCenter|cts.circleCenter}
    * @method planBuilder.cts#circleCenter
    * @since 2.1.1
    * @param { CtsCircle } [circle] - The circle.
    * @returns { CtsPoint }
    */
circleCenter(...args) {
    const paramdef = ['circle', [types.CtsCircle, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('cts.circleCenter', 1, paramdef, args);
    return new types.CtsPoint('cts', 'circle-center', checkedArgs);
    }
/**
    * Returns a circle's radius. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.circleRadius|cts.circleRadius}
    * @method planBuilder.cts#circleRadius
    * @since 2.1.1
    * @param { CtsCircle } [circle] - The circle.
    * @returns { XsNumeric }
    */
circleRadius(...args) {
    const paramdef = ['circle', [types.CtsCircle, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('cts.circleRadius', 1, paramdef, args);
    return new types.XsNumeric('cts', 'circle-radius', checkedArgs);
    }
/**
    * Match documents in at least one of the specified collections. It will match both documents and properties documents in the collections with the given URIs. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.collectionQuery|cts.collectionQuery}
    * @method planBuilder.cts#collectionQuery
    * @since 2.1.1
    * @param { XsString } [uris] - One or more collection URIs. A document matches the query if it is in at least one of these collections.
    * @returns { CtsQuery }
    */
collectionQuery(...args) {
    const paramdef = ['uris', [types.XsString], false, true];
    const checkedArgs = bldrbase.makeSingleArgs('cts.collectionQuery', 1, paramdef, args);
    return new types.CtsQuery('cts', 'collection-query', checkedArgs);
    }
/**
    * Creates a reference to the collection lexicon, for use as a parameter to cts:value-tuples. Since lexicons are implemented with range indexes, this function will throw an exception if the specified range index does not exist. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.collectionReference|cts.collectionReference}
    * @method planBuilder.cts#collectionReference
    * @since 2.1.1
    * @param { XsString } [options] - Options. The default is ().  Options include:  "nullable" Allow null values in tuples reported from cts:value-tuples when using this lexicon. "unchecked" Do not check the definition against the context database. 
    * @returns { CtsReference }
    */
collectionReference(...args) {
    const paramdef = ['options', [types.XsString], false, true];
    const checkedArgs = bldrbase.makeSingleArgs('cts.collectionReference', 0, paramdef, args);
    return new types.CtsReference('cts', 'collection-reference', checkedArgs);
    }
/**
    * Returns a cts:query matching documents matching a TDE-view column equals to an value. Searches with the cts:column-range-query constructor require the triple index; if the triple index is not configured, then an exception is thrown. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.columnRangeQuery|cts.columnRangeQuery}
    * @method planBuilder.cts#columnRangeQuery
    * @since 2.1.1
    * @param { XsString } [schema] - The TDE schema name.
    * @param { XsString } [view] - The TDE view name.
    * @param { XsString } [column] - The TDE column name.
    * @param { XsAnyAtomicType } [value] - One or more values used for querying.
    * @param { XsString } [operator] - Operator for the $value values. The default operator is "=".  Operators include:  "&lt;" Match range index values less than $value. "&lt;=" Match range index values less than or equal to $value. "&gt;" Match range index values greater than $value. "&gt;=" Match range index values greater than or equal to $value. "=" Match range index values equal to $value. "!=" Match range index values not equal to $value. 
    * @param { XsString } [options] - Options to this query. The default is ().  Options include:  "cached" Cache the results of this query in the list cache. "uncached" Do not cache the results of this query in the list cache. "score-function=function" Use the selected scoring function. The score function may be:  linearUse a linear function of the difference between the specified query value and the matching value in the index to calculate a score for this range query. reciprocalUse a reciprocal function of the difference between the specified query value and the matching value in the index to calculate a score for this range query. zeroThis range query does not contribute to the score. This is the default.   "slope-factor=number" Apply the given number as a scaling factor to the slope of the scoring function. The default is 1.0. 
    * @param { XsDouble } [weight] - A weight for this query. The default is 1.0.
    * @returns { CtsQuery }
    */
columnRangeQuery(...args) {
    const namer = bldrbase.getNamer(args, 'schema');
    const paramdefs = [['schema', [types.XsString], true, false], ['view', [types.XsString], true, false], ['column', [types.XsString], true, false], ['value', [types.XsAnyAtomicType], false, true], ['operator', [types.XsString], false, false], ['options', [types.XsString], false, true], ['weight', [types.XsDouble], false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.columnRangeQuery', 4, new Set(['schema', 'view', 'column', 'value', 'operator', 'options', 'weight']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.columnRangeQuery', 4, false, paramdefs, args);
    return new types.CtsQuery('cts', 'column-range-query', checkedArgs);

    }
/**
    * Returns a geospatial complex polygon value. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.complexPolygon|cts.complexPolygon}
    * @method planBuilder.cts#complexPolygon
    * @since 2.1.1
    * @param { CtsPolygon } [outer] - The outer polygon.
    * @param { CtsPolygon } [inner] - The inner (hole) polygons.
    * @returns { CtsComplexPolygon }
    */
complexPolygon(...args) {
    const namer = bldrbase.getNamer(args, 'outer');
    const paramdefs = [['outer', [types.CtsPolygon, PlanColumn, PlanParam], true, false], ['inner', [types.CtsPolygon, PlanColumn, PlanParam], false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.complexPolygon', 2, new Set(['outer', 'inner']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.complexPolygon', 2, false, paramdefs, args);
    return new types.CtsComplexPolygon('cts', 'complex-polygon', checkedArgs);

    }
/**
    * Returns a query matching documents in the directories with the given URIs. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.directoryQuery|cts.directoryQuery}
    * @method planBuilder.cts#directoryQuery
    * @since 2.1.1
    * @param { XsString } [uris] - One or more directory URIs.
    * @param { XsString } [depth] - "1" for immediate children, "infinity" for all. If not supplied, depth is "1".
    * @returns { CtsQuery }
    */
directoryQuery(...args) {
    const namer = bldrbase.getNamer(args, 'uris');
    const paramdefs = [['uris', [types.XsString], false, true], ['depth', [types.XsString], false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.directoryQuery', 1, new Set(['uris', 'depth']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.directoryQuery', 1, false, paramdefs, args);
    return new types.CtsQuery('cts', 'directory-query', checkedArgs);

    }
/**
    * Returns a query that matches all documents where query matches any document fragment. When searching documents, document-properties, or document-locks, this function provides a convenient way to additionally constrain the search against any document fragment. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.documentFragmentQuery|cts.documentFragmentQuery}
    * @method planBuilder.cts#documentFragmentQuery
    * @since 2.1.1
    * @param { CtsQuery } [query] - A query to be matched against any document fragment.
    * @returns { CtsQuery }
    */
documentFragmentQuery(...args) {
    const paramdef = ['query', [types.CtsQuery], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('cts.documentFragmentQuery', 1, paramdef, args);
    return new types.CtsQuery('cts', 'document-fragment-query', checkedArgs);
    }
/**
    * Returns a query matching documents with the given URIs. It will match both documents and properties documents with the given URIs. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.documentQuery|cts.documentQuery}
    * @method planBuilder.cts#documentQuery
    * @since 2.1.1
    * @param { XsString } [uris] - One or more document URIs.
    * @returns { CtsQuery }
    */
documentQuery(...args) {
    const paramdef = ['uris', [types.XsString], false, true];
    const checkedArgs = bldrbase.makeSingleArgs('cts.documentQuery', 1, paramdef, args);
    return new types.CtsQuery('cts', 'document-query', checkedArgs);
    }
/**
    * Returns a query matching elements by name which has specific attributes representing latitude and longitude values for a point contained within the given geographic box, circle, or polygon, or equal to the given point. Points that lie between the southern boundary and the northern boundary of a box, travelling northwards, and between the western boundary and the eastern boundary of the box, travelling eastwards, will match. Points contained within the given radius of the center point of a circle will match, using the curved distance on the surface of the Earth. Points contained within the given polygon will match, using great circle arcs over a spherical model of the Earth as edges. An error may result if the polygon is malformed in some way. Points equal to the a given point will match, taking into account the fact that longitudes converge at the poles. Using the geospatial query constructors requires a valid geospatial license key; without a valid license key, searches that include geospatial queries will throw an exception. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.elementAttributePairGeospatialQuery|cts.elementAttributePairGeospatialQuery}
    * @method planBuilder.cts#elementAttributePairGeospatialQuery
    * @since 2.1.1
    * @param { XsQName } [elementName] - One or more parent element QNames to match. When multiple QNames are specified, the query matches if any QName matches.
    * @param { XsQName } [latitudeName] - One or more latitude attribute QNames to match. When multiple QNames are specified, the query matches if any QName matches; however, only the first matching latitude attribute in any point instance will be checked.
    * @param { XsQName } [longitudeName] - One or more longitude attribute QNames to match. When multiple QNames are specified, the query matches if any QName matches; however, only the first matching longitude attribute in any point instance will be checked.
    * @param { CtsRegion } [region] - One or more geographic boxes, circles, polygons, or points. Where multiple regions are specified, the query matches if any region matches.
    * @param { XsString } [options] - Options to this query. The default is (). Options include:   "coordinate-system=string" Use the given coordinate system. Valid values are:  wgs84The WGS84 coordinate system. wgs84/doubleThe WGS84 coordinate system at double precision. etrs89The ETRS89 coordinate system. etrs89/doubleThe ETRS89 coordinate system at double precision. rawThe raw (unmapped) coordinate system. raw/doubleThe raw coordinate system at double precision.   "precision=value" Use the coordinate system at the given precision. Allowed values: float and double. "units=value" Measure distance and the radii of circles in the specified units. Allowed values: miles (default), km, feet, meters. "boundaries-included" Points on boxes', circles', and polygons' boundaries are counted as matching. This is the default. "boundaries-excluded" Points on boxes', circles', and polygons' boundaries are not counted as matching. "boundaries-latitude-excluded" Points on boxes' latitude boundaries are not counted as matching. "boundaries-longitude-excluded" Points on boxes' longitude boundaries are not counted as matching. "boundaries-south-excluded" Points on the boxes' southern boundaries are not counted as matching. "boundaries-west-excluded" Points on the boxes' western boundaries are not counted as matching. "boundaries-north-excluded" Points on the boxes' northern boundaries are not counted as matching. "boundaries-east-excluded" Points on the boxes' eastern boundaries are not counted as matching. "boundaries-circle-excluded" Points on circles' boundary are not counted as matching. "boundaries-endpoints-excluded" Points on linestrings' boundary (the endpoints) are not counted as matching. "cached" Cache the results of this query in the list cache. "uncached" Do not cache the results of this query in the list cache. "score-function=function" Use the selected scoring function. The score function may be:  linearUse a linear function of the difference between the specified query value and the matching value in the index to calculate a score for this range query. reciprocalUse a reciprocal function of the difference between the specified query value and the matching value in the index to calculate a score for this range query. zeroThis range query does not contribute to the score. This is the default.   "slope-factor=number" Apply the given number as a scaling factor to the slope of the scoring function. The default is 1.0. "synonym" Specifies that all of the terms in the $regions parameter are considered synonyms for scoring purposes. The result is that occurrences of more than one of the synonyms are scored as if there are more occurrence of the same term (as opposed to having a separate term that contributes to score).  
    * @param { XsDouble } [weight] - A weight for this query. The default is 1.0.
    * @returns { CtsQuery }
    */
elementAttributePairGeospatialQuery(...args) {
    const namer = bldrbase.getNamer(args, 'element-name');
    const paramdefs = [['element-name', [types.XsQName], false, true], ['latitude-name', [types.XsQName], false, true], ['longitude-name', [types.XsQName], false, true], ['region', [types.CtsRegion], false, true], ['options', [types.XsString], false, true], ['weight', [types.XsDouble], false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.elementAttributePairGeospatialQuery', 4, new Set(['element-name', 'latitude-name', 'longitude-name', 'region', 'options', 'weight']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.elementAttributePairGeospatialQuery', 4, false, paramdefs, args);
    return new types.CtsQuery('cts', 'element-attribute-pair-geospatial-query', checkedArgs);

    }
/**
    * Constructs a query that matches element-attributes by name with a range-index entry equal to a given value. An element attribute range index on the specified QName(s) must exist when you use this query in a search; if no such range index exists, the search throws an exception. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.elementAttributeRangeQuery|cts.elementAttributeRangeQuery}
    * @method planBuilder.cts#elementAttributeRangeQuery
    * @since 2.1.1
    * @param { XsQName } [elementName] - One or more element QNames to match. When multiple QNames are specified, the query matches if any QName matches.
    * @param { XsQName } [attributeName] - One or more attribute QNames to match. When multiple QNames are specified, the query matches if any QName matches.
    * @param { XsString } [operator] - A comparison operator.  Operators include:  "&lt;" Match range index values less than $value. "&lt;=" Match range index values less than or equal to $value. "&gt;" Match range index values greater than $value. "&gt;=" Match range index values greater than or equal to $value. "=" Match range index values equal to $value. "!=" Match range index values not equal to $value. 
    * @param { XsAnyAtomicType } [value] - Some values to match. When multiple values are specified, the query matches if any value matches.
    * @param { XsString } [options] - Options to this query. The default is ().  Options include:  "collation=URI" Use the range index with the collation specified by URI. If not specified, then the default collation from the query is used. If a range index with the specified collation does not exist, an error is thrown. "cached" Cache the results of this query in the list cache. "uncached" Do not cache the results of this query in the list cache. "cached-incremental" When querying on a short date or dateTime range, break the query into sub-queries on smaller ranges, and then cache the results of each. See the Usage Notes for details. "min-occurs=number" Specifies the minimum number of occurrences required. If fewer that this number of words occur, the fragment does not match. The default is 1. "max-occurs=number" Specifies the maximum number of occurrences required. If more than this number of words occur, the fragment does not match. The default is unbounded. "score-function=function" Use the selected scoring function. The score function may be:  linearUse a linear function of the difference between the specified query value and the matching value in the index to calculate a score for this range query. reciprocalUse a reciprocal function of the difference between the specified query value and the matching value in the index to calculate a score for this range query. zeroThis range query does not contribute to the score. This is the default.   "slope-factor=number" Apply the given number as a scaling factor to the slope of the scoring function. The default is 1.0. "synonym" Specifies that all of the terms in the $value parameter are considered synonyms for scoring purposes. The result is that occurrences of more than one of the synonyms are scored as if there are more occurrences of the same term (as opposed to having a separate term that contributes to score).  
    * @param { XsDouble } [weight] - A weight for this query. The default is 1.0.
    * @returns { CtsQuery }
    */
elementAttributeRangeQuery(...args) {
    const namer = bldrbase.getNamer(args, 'element-name');
    const paramdefs = [['element-name', [types.XsQName], false, true], ['attribute-name', [types.XsQName], false, true], ['operator', [types.XsString], true, false], ['value', [types.XsAnyAtomicType], false, true], ['options', [types.XsString], false, true], ['weight', [types.XsDouble], false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.elementAttributeRangeQuery', 4, new Set(['element-name', 'attribute-name', 'operator', 'value', 'options', 'weight']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.elementAttributeRangeQuery', 4, false, paramdefs, args);
    return new types.CtsQuery('cts', 'element-attribute-range-query', checkedArgs);

    }
/**
    * Creates a reference to an element attribute value lexicon, for use as a parameter to cts:value-tuples. Since lexicons are implemented with range indexes, this function will throw an exception if the specified range index does not exist. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.elementAttributeReference|cts.elementAttributeReference}
    * @method planBuilder.cts#elementAttributeReference
    * @since 2.1.1
    * @param { XsQName } [element] - An element QName.
    * @param { XsQName } [attribute] - An attribute QName.
    * @param { XsString } [options] - Options. The default is ().  Options include:  "type=type" Use the lexicon with the type specified by type (int, unsignedInt, long, unsignedLong, float, double, decimal, dateTime, time, date, gYearMonth, gYear, gMonth, gDay, yearMonthDuration, dayTimeDuration, string, anyURI, point, or long-lat-point) "collation=URI" Use the lexicon with the collation specified by URI. "nullable" Allow null values in tuples reported from cts:value-tuples when using this lexicon. "unchecked" Read the scalar type, collation and coordinate-system info only from the input. Do not check the definition against the context database. "coordinate-system=name" Create a reference to an index or lexicon based on the specified coordinate system. Allowed values: "wgs84", "wgs84/double", "raw", "raw/double". Only applicable if the index/lexicon value type is point or long-lat-point. "precision=value" Create a reference to an index or lexicon configured with the specified geospatial precision. Allowed values: float and double. Only applicable if the index/lexicon value type is point or long-lat-point. This value takes precedence over the precision implicit in the coordinate system name. 
    * @returns { CtsReference }
    */
elementAttributeReference(...args) {
    const namer = bldrbase.getNamer(args, 'element');
    const paramdefs = [['element', [types.XsQName], true, false], ['attribute', [types.XsQName], true, false], ['options', [types.XsString], false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.elementAttributeReference', 2, new Set(['element', 'attribute', 'options']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.elementAttributeReference', 2, false, paramdefs, args);
    return new types.CtsReference('cts', 'element-attribute-reference', checkedArgs);

    }
/**
    * Returns a query matching elements by name with attributes by name with text content equal a given phrase. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.elementAttributeValueQuery|cts.elementAttributeValueQuery}
    * @method planBuilder.cts#elementAttributeValueQuery
    * @since 2.1.1
    * @param { XsQName } [elementName] - One or more element QNames to match. When multiple QNames are specified, the query matches if any QName matches.
    * @param { XsQName } [attributeName] - One or more attribute QNames to match. When multiple QNames are specified, the query matches if any QName matches.
    * @param { XsString } [text] - One or more attribute values to match. When multiple strings are specified, the query matches if any string matches.
    * @param { XsString } [options] - Options to this query. The default is ().  Options include:  "case-sensitive" A case-sensitive query. "case-insensitive" A case-insensitive query. "diacritic-sensitive" A diacritic-sensitive query. "diacritic-insensitive" A diacritic-insensitive query. "punctuation-sensitive" A punctuation-sensitive query. "punctuation-insensitive" A punctuation-insensitive query. "whitespace-sensitive" A whitespace-sensitive query. "whitespace-insensitive" A whitespace-insensitive query. "stemmed" A stemmed query. "unstemmed" An unstemmed query. "wildcarded" A wildcarded query. "unwildcarded" An unwildcarded query. "exact" An exact match query. Shorthand for "case-sensitive", "diacritic-sensitive", "punctuation-sensitive", "whitespace-sensitive", "unstemmed", and "unwildcarded".  "lang=iso639code" Specifies the language of the query. The iso639code code portion is case-insensitive, and uses the languages specified by ISO 639. The default is specified in the database configuration. "min-occurs=number" Specifies the minimum number of occurrences required. If fewer that this number of words occur, the fragment does not match. The default is 1. "max-occurs=number" Specifies the maximum number of occurrences required. If more than this number of words occur, the fragment does not match. The default is unbounded. "synonym" Specifies that all of the terms in the $text parameter are considered synonyms for scoring purposes. The result is that occurrences of more than one of the synonyms are scored as if there are more occurrences of the same term (as opposed to having a separate term that contributes to score).  * "lexicon-expansion-limit=number" Specifies the limit for lexicon expansion. This puts a restriction on the number of lexicon expansions that can be performed. If the limit is exceeded, the server may raise an error depending on whether the "limit-check" option is set. The default value for this option will be 4096.  "limit-check" Specifies that an error will be raised if the lexicon expansion exceeds the specified limit. "no-limit-check" Specifies that error will not be raised if the lexicon expansion exceeds the specified limit. The server will try to resolve the wildcard.  
    * @param { XsDouble } [weight] - A weight for this query. Higher weights move search results up in the relevance order. The default is 1.0. The weight should be between 64 and -16. Weights greater than 64 will have the same effect as a weight of 64. Weights less than the absolute value of 0.0625 (between -0.0625 and 0.0625) are rounded to 0, which means that they do not contribute to the score.
    * @returns { CtsQuery }
    */
elementAttributeValueQuery(...args) {
    const namer = bldrbase.getNamer(args, 'element-name');
    const paramdefs = [['element-name', [types.XsQName], false, true], ['attribute-name', [types.XsQName], false, true], ['text', [types.XsString], false, true], ['options', [types.XsString], false, true], ['weight', [types.XsDouble], false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.elementAttributeValueQuery', 3, new Set(['element-name', 'attribute-name', 'text', 'options', 'weight']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.elementAttributeValueQuery', 3, false, paramdefs, args);
    return new types.CtsQuery('cts', 'element-attribute-value-query', checkedArgs);

    }
/**
    * Returns a query matching elements by name with attributes by name with text content containing a given phrase. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.elementAttributeWordQuery|cts.elementAttributeWordQuery}
    * @method planBuilder.cts#elementAttributeWordQuery
    * @since 2.1.1
    * @param { XsQName } [elementName] - One or more element QNames to match. When multiple QNames are specified, the query matches if any QName matches.
    * @param { XsQName } [attributeName] - One or more attribute QNames to match. When multiple QNames are specified, the query matches if any QName matches.
    * @param { XsString } [text] - Some words or phrases to match. When multiple strings are specified, the query matches if any string matches.
    * @param { XsString } [options] - Options to this query. The default is ().  Options include:  "case-sensitive" A case-sensitive query. "case-insensitive" A case-insensitive query. "diacritic-sensitive" A diacritic-sensitive query. "diacritic-insensitive" A diacritic-insensitive query. "punctuation-sensitive" A punctuation-sensitive query. "punctuation-insensitive" A punctuation-insensitive query. "whitespace-sensitive" A whitespace-sensitive query. "whitespace-insensitive" A whitespace-insensitive query. "stemmed" A stemmed query. "unstemmed" An unstemmed query. "wildcarded" A wildcarded query. "unwildcarded" An unwildcarded query. "exact" An exact match query. Shorthand for "case-sensitive", "diacritic-sensitive", "punctuation-sensitive", "whitespace-sensitive", "unstemmed", and "unwildcarded".  "lang=iso639code" Specifies the language of the query. The iso639code code portion is case-insensitive, and uses the languages specified by ISO 639. The default is specified in the database configuration. "min-occurs=number" Specifies the minimum number of occurrences required. If fewer that this number of words occur, the fragment does not match. The default is 1. "max-occurs=number" Specifies the maximum number of occurrences required. If more than this number of words occur, the fragment does not match. The default is unbounded. "synonym" Specifies that all of the terms in the $text parameter are considered synonyms for scoring purposes. The result is that occurrences of more than one of the synonyms are scored as if there are more occurrences of the same term (as opposed to having a separate term that contributes to score).  "lexicon-expand=value" The value is one of full, prefix-postfix, off, or heuristic (the default is heuristic). An option with a value of lexicon-expand=full specifies that wildcards are resolved by expanding the pattern to words in a lexicon (if there is one available), and turning into a series of cts:word-queries, even if this takes a long time to evaluate. An option with a value of lexicon-expand=prefix-postfix specifies that wildcards are resolved by expanding the pattern to the pre- and postfixes of the words in the word lexicon (if there is one), and turning the query into a series of character queries, even if it takes a long time to evaluate. An option with a value of lexicon-expand=off specifies that wildcards are only resolved by looking up character patterns in the search pattern index, not in the lexicon. An option with a value of lexicon-expand=heuristic, which is the default, specifies that wildcards are resolved by using a series of internal rules, such as estimating the number of lexicon entries that need to be scanned, seeing if the estimate crosses certain thresholds, and (if appropriate), using another way besides lexicon expansion to resolve the query.  * "lexicon-expansion-limit=number" Specifies the limit for lexicon expansion. This puts a restriction on the number of lexicon expansions that can be performed. If the limit is exceeded, the server may raise an error depending on whether the "limit-check" option is set. The default value for this option will be 4096.  "limit-check" Specifies that an error will be raised if the lexicon expansion exceeds the specified limit. "no-limit-check" Specifies that error will not be raised if the lexicon expansion exceeds the specified limit. The server will try to resolve the wildcard.  
    * @param { XsDouble } [weight] - A weight for this query. Higher weights move search results up in the relevance order. The default is 1.0. The weight should be between 64 and -16. Weights greater than 64 will have the same effect as a weight of 64. Weights less than the absolute value of 0.0625 (between -0.0625 and 0.0625) are rounded to 0, which means that they do not contribute to the score.
    * @returns { CtsQuery }
    */
elementAttributeWordQuery(...args) {
    const namer = bldrbase.getNamer(args, 'element-name');
    const paramdefs = [['element-name', [types.XsQName], false, true], ['attribute-name', [types.XsQName], false, true], ['text', [types.XsString], false, true], ['options', [types.XsString], false, true], ['weight', [types.XsDouble], false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.elementAttributeWordQuery', 3, new Set(['element-name', 'attribute-name', 'text', 'options', 'weight']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.elementAttributeWordQuery', 3, false, paramdefs, args);
    return new types.CtsQuery('cts', 'element-attribute-word-query', checkedArgs);

    }
/**
    * Returns a query matching elements by name which has specific element children representing latitude and longitude values for a point contained within the given geographic box, circle, or polygon, or equal to the given point. Points that lie between the southern boundary and the northern boundary of a box, travelling northwards, and between the western boundary and the eastern boundary of the box, travelling eastwards, will match. Points contained within the given radius of the center point of a circle will match, using the curved distance on the surface of the Earth. Points contained within the given polygon will match, using great circle arcs over a spherical model of the Earth as edges. An error may result if the polygon is malformed in some way. Points equal to the a given point will match, taking into account the fact that longitudes converge at the poles. Using the geospatial query constructors requires a valid geospatial license key; without a valid license key, searches that include geospatial queries will throw an exception. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.elementChildGeospatialQuery|cts.elementChildGeospatialQuery}
    * @method planBuilder.cts#elementChildGeospatialQuery
    * @since 2.1.1
    * @param { XsQName } [elementName] - One or more parent element QNames to match. When multiple QNames are specified, the query matches if any QName matches.
    * @param { XsQName } [childName] - One or more child element QNames to match. When multiple QNames are specified, the query matches if any QName matches; however, only the first matching latitude child in any point instance will be checked. The element must specify both latitude and longitude coordinates.
    * @param { CtsRegion } [region] - One or more geographic boxes, circles, polygons, or points. Where multiple regions are specified, the query matches if any region matches.
    * @param { XsString } [options] - Options to this query. The default is (). Options include:   "coordinate-system=string" Use the given coordinate system. Valid values are:  wgs84The WGS84 coordinate system. wgs84/doubleThe WGS84 coordinate system at double precision. etrs89The ETRS89 coordinate system. etrs89/doubleThe ETRS89 coordinate system at double precision. rawThe raw (unmapped) coordinate system. raw/doubleThe raw coordinate system at double precision.   "precision=string" Use the coordinate system at the given precision. Allowed values: float (default) and double. "units=value" Measure distance and the radii of circles in the specified units. Allowed values: miles (default), km, feet, meters. "boundaries-included" Points on boxes', circles', and polygons' boundaries are counted as matching. This is the default. "boundaries-excluded" Points on boxes', circles', and polygons' boundaries are not counted as matching. "boundaries-latitude-excluded" Points on boxes' latitude boundaries are not counted as matching. "boundaries-longitude-excluded" Points on boxes' longitude boundaries are not counted as matching. "boundaries-south-excluded" Points on the boxes' southern boundaries are not counted as matching. "boundaries-west-excluded" Points on the boxes' western boundaries are not counted as matching. "boundaries-north-excluded" Points on the boxes' northern boundaries are not counted as matching. "boundaries-east-excluded" Points on the boxes' eastern boundaries are not counted as matching. "boundaries-circle-excluded" Points on circles' boundary are not counted as matching. "boundaries-endpoints-excluded" Points on linestrings' boundary (the endpoints) are not counted as matching. "cached" Cache the results of this query in the list cache. "uncached" Do not cache the results of this query in the list cache. "type=long-lat-point" Specifies the format for the point in the data as longitude first, latitude second. "type=point" Specifies the format for the point in the data as latitude first, longitude second. This is the default format. "score-function=function" Use the selected scoring function. The score function may be:  linearUse a linear function of the difference between the specified query value and the matching value in the index to calculate a score for this range query. reciprocalUse a reciprocal function of the difference between the specified query value and the matching value in the index to calculate a score for this range query. zeroThis range query does not contribute to the score. This is the default.   "slope-factor=number" Apply the given number as a scaling factor to the slope of the scoring function. The default is 1.0. "synonym" Specifies that all of the terms in the $regions parameter are considered synonyms for scoring purposes. The result is that occurrences of more than one of the synonyms are scored as if there are more occurrence of the same term (as opposed to having a separate term that contributes to score).  
    * @param { XsDouble } [weight] - A weight for this query. The default is 1.0.
    * @returns { CtsQuery }
    */
elementChildGeospatialQuery(...args) {
    const namer = bldrbase.getNamer(args, 'element-name');
    const paramdefs = [['element-name', [types.XsQName], false, true], ['child-name', [types.XsQName], false, true], ['region', [types.CtsRegion], false, true], ['options', [types.XsString], false, true], ['weight', [types.XsDouble], false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.elementChildGeospatialQuery', 3, new Set(['element-name', 'child-name', 'region', 'options', 'weight']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.elementChildGeospatialQuery', 3, false, paramdefs, args);
    return new types.CtsQuery('cts', 'element-child-geospatial-query', checkedArgs);

    }
/**
    * Returns a query matching elements by name whose content represents a point contained within the given geographic box, circle, or polygon, or equal to the given point. Points that lie between the southern boundary and the northern boundary of a box, travelling northwards, and between the western boundary and the eastern boundary of the box, travelling eastwards, will match. Points contained within the given radius of the center point of a circle will match, using the curved distance on the surface of the Earth. Points contained within the given polygon will match, using great circle arcs over a spherical model of the Earth as edges. An error may result if the polygon is malformed in some way. Points equal to the a given point will match, taking into account the fact that longitudes converge at the poles. Using the geospatial query constructors requires a valid geospatial license key; without a valid license key, searches that include geospatial queries will throw an exception. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.elementGeospatialQuery|cts.elementGeospatialQuery}
    * @method planBuilder.cts#elementGeospatialQuery
    * @since 2.1.1
    * @param { XsQName } [elementName] - One or more element QNames to match. When multiple QNames are specified, the query matches if any QName matches.
    * @param { CtsRegion } [region] - One or more geographic boxes, circles, polygons, or points. Where multiple regions are specified, the query matches if any region matches.
    * @param { XsString } [options] - Options to this query. The default is (). Options include:   "coordinate-system=string" Use the given coordinate system. Valid values are:  wgs84The WGS84 coordinate system. wgs84/doubleThe WGS84 coordinate system at double precision. etrs89The ETRS89 coordinate system. etrs89/doubleThe ETRS89 coordinate system at double precision. rawThe raw (unmapped) coordinate system. raw/doubleThe raw coordinate system at double precision.   "precision=value" Use the coordinate system at the given precision. Allowed values: float and double. "units=value" Measure distance and the radii of circles in the specified units. Allowed values: miles (default), km, feet, meters. "boundaries-included" Points on boxes', circles', and polygons' boundaries are counted as matching. This is the default. "boundaries-excluded" Points on boxes', circles', and polygons' boundaries are not counted as matching. "boundaries-latitude-excluded" Points on boxes' latitude boundaries are not counted as matching. "boundaries-longitude-excluded" Points on boxes' longitude boundaries are not counted as matching. "boundaries-south-excluded" Points on the boxes' southern boundaries are not counted as matching. "boundaries-west-excluded" Points on the boxes' western boundaries are not counted as matching. "boundaries-north-excluded" Points on the boxes' northern boundaries are not counted as matching. "boundaries-east-excluded" Points on the boxes' eastern boundaries are not counted as matching. "boundaries-circle-excluded" Points on circles' boundary are not counted as matching. "boundaries-endpoints-excluded" Points on linestrings' boundary (the endpoints) are not counted as matching. "cached" Cache the results of this query in the list cache. "uncached" Do not cache the results of this query in the list cache. "type=long-lat-point" Specifies the format for the point in the data as longitude first, latitude second. "type=point" Specifies the format for the point in the data as latitude first, longitude second. This is the default format. "score-function=function" Use the selected scoring function. The score function may be:  linearUse a linear function of the difference between the specified query value and the matching value in the index to calculate a score for this range query. reciprocalUse a reciprocal function of the difference between the specified query value and the matching value in the index to calculate a score for this range query. zeroThis range query does not contribute to the score. This is the default.   "slope-factor=number" Apply the given number as a scaling factor to the slope of the scoring function. The default is 1.0. "synonym" Specifies that all of the terms in the $regions parameter are considered synonyms for scoring purposes. The result is that occurrences of more than one of the synonyms are scored as if there are more occurrence of the same term (as opposed to having a separate term that contributes to score).  
    * @param { XsDouble } [weight] - A weight for this query. The default is 1.0.
    * @returns { CtsQuery }
    */
elementGeospatialQuery(...args) {
    const namer = bldrbase.getNamer(args, 'element-name');
    const paramdefs = [['element-name', [types.XsQName], false, true], ['region', [types.CtsRegion], false, true], ['options', [types.XsString], false, true], ['weight', [types.XsDouble], false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.elementGeospatialQuery', 2, new Set(['element-name', 'region', 'options', 'weight']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.elementGeospatialQuery', 2, false, paramdefs, args);
    return new types.CtsQuery('cts', 'element-geospatial-query', checkedArgs);

    }
/**
    * Returns a query matching elements by name which has specific element children representing latitude and longitude values for a point contained within the given geographic box, circle, or polygon, or equal to the given point. Points that lie between the southern boundary and the northern boundary of a box, travelling northwards, and between the western boundary and the eastern boundary of the box, travelling eastwards, will match. Points contained within the given radius of the center point of a circle will match, using the curved distance on the surface of the Earth. Points contained within the given polygon will match, using great circle arcs over a spherical model of the Earth as edges. An error may result if the polygon is malformed in some way. Points equal to the a given point will match, taking into account the fact that longitudes converge at the poles. Using the geospatial query constructors requires a valid geospatial license key; without a valid license key, searches that include geospatial queries will throw an exception. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.elementPairGeospatialQuery|cts.elementPairGeospatialQuery}
    * @method planBuilder.cts#elementPairGeospatialQuery
    * @since 2.1.1
    * @param { XsQName } [elementName] - One or more parent element QNames to match. When multiple QNames are specified, the query matches if any QName matches.
    * @param { XsQName } [latitudeName] - One or more latitude element QNames to match. When multiple QNames are specified, the query matches if any QName matches; however, only the first matching latitude child in any point instance will be checked.
    * @param { XsQName } [longitudeName] - One or more longitude element QNames to match. When multiple QNames are specified, the query matches if any QName matches; however, only the first matching longitude child in any point instance will be checked.
    * @param { CtsRegion } [region] - One or more geographic boxes, circles, polygons, or points. Where multiple regions are specified, the query matches if any region matches.
    * @param { XsString } [options] - Options to this query. The default is (). Options include:   "coordinate-system=string" Use the given coordinate system. Valid values are:  wgs84The WGS84 coordinate system. wgs84/doubleThe WGS84 coordinate system at double precision. etrs89The ETRS89 coordinate system. etrs89/doubleThe ETRS89 coordinate system at double precision. rawThe raw (unmapped) coordinate system. raw/doubleThe raw coordinate system at double precision.   "precision=value" Use the coordinate system at the given precision. Allowed values: float and double. "units=value" Measure distance and the radii of circles in the specified units. Allowed values: miles (default), km, feet, meters. "boundaries-included" Points on boxes', circles', and polygons' boundaries are counted as matching. This is the default. "boundaries-excluded" Points on boxes', circles', and polygons' boundaries are not counted as matching. "boundaries-latitude-excluded" Points on boxes' latitude boundaries are not counted as matching. "boundaries-longitude-excluded" Points on boxes' longitude boundaries are not counted as matching. "boundaries-south-excluded" Points on the boxes' southern boundaries are not counted as matching. "boundaries-west-excluded" Points on the boxes' western boundaries are not counted as matching. "boundaries-north-excluded" Points on the boxes' northern boundaries are not counted as matching. "boundaries-east-excluded" Points on the boxes' eastern boundaries are not counted as matching. "boundaries-circle-excluded" Points on circles' boundary are not counted as matching. "boundaries-endpoints-excluded" Points on linestrings' boundary (the endpoints) are not counted as matching. "cached" Cache the results of this query in the list cache. "uncached" Do not cache the results of this query in the list cache. "score-function=function" Use the selected scoring function. The score function may be:  linearUse a linear function of the difference between the specified query value and the matching value in the index to calculate a score for this range query. reciprocalUse a reciprocal function of the difference between the specified query value and the matching value in the index to calculate a score for this range query. zeroThis range query does not contribute to the score. This is the default.   "slope-factor=number" Apply the given number as a scaling factor to the slope of the scoring function. The default is 1.0. "synonym" Specifies that all of the terms in the $regions parameter are considered synonyms for scoring purposes. The result is that occurrences of more than one of the synonyms are scored as if there are more occurrence of the same term (as opposed to having a separate term that contributes to score).  
    * @param { XsDouble } [weight] - A weight for this query. The default is 1.0.
    * @returns { CtsQuery }
    */
elementPairGeospatialQuery(...args) {
    const namer = bldrbase.getNamer(args, 'element-name');
    const paramdefs = [['element-name', [types.XsQName], false, true], ['latitude-name', [types.XsQName], false, true], ['longitude-name', [types.XsQName], false, true], ['region', [types.CtsRegion], false, true], ['options', [types.XsString], false, true], ['weight', [types.XsDouble], false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.elementPairGeospatialQuery', 4, new Set(['element-name', 'latitude-name', 'longitude-name', 'region', 'options', 'weight']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.elementPairGeospatialQuery', 4, false, paramdefs, args);
    return new types.CtsQuery('cts', 'element-pair-geospatial-query', checkedArgs);

    }
/**
    * Constructs a query that matches elements by name with the content constrained by the query given in the second parameter. Searches for matches in the specified element and all of its descendants. If the query specified in the second parameter includes any element attribute sub-queries, it will search attributes on the specified element and attributes on any descendant elements. See the second example below). Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.elementQuery|cts.elementQuery}
    * @method planBuilder.cts#elementQuery
    * @since 2.1.1
    * @param { XsQName } [elementName] - One or more element QNames to match. When multiple QNames are specified, the query matches if any QName matches.
    * @param { CtsQuery } [query] - A query for the element to match. If a string is entered, the string is treated as a cts:word-query of the specified string.
    * @returns { CtsQuery }
    */
elementQuery(...args) {
    const namer = bldrbase.getNamer(args, 'element-name');
    const paramdefs = [['element-name', [types.XsQName], false, true], ['query', [types.CtsQuery], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.elementQuery', 2, new Set(['element-name', 'query']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.elementQuery', 2, false, paramdefs, args);
    return new types.CtsQuery('cts', 'element-query', checkedArgs);

    }
/**
    * Constructs a query that matches elements by name with range index entry equal to a given value. Searches that use an element range query require an element range index on the specified QName(s); if no such range index exists, then an exception is thrown. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.elementRangeQuery|cts.elementRangeQuery}
    * @method planBuilder.cts#elementRangeQuery
    * @since 2.1.1
    * @param { XsQName } [elementName] - One or more element QNames to match. When multiple QNames are specified, the query matches if any QName matches.
    * @param { XsString } [operator] - A comparison operator.  Operators include:  "&lt;" Match range index values less than $value. "&lt;=" Match range index values less than or equal to $value. "&gt;" Match range index values greater than $value. "&gt;=" Match range index values greater than or equal to $value. "=" Match range index values equal to $value. "!=" Match range index values not equal to $value. 
    * @param { XsAnyAtomicType } [value] - One or more element values to match. When multiple values are specified, the query matches if any value matches.
    * @param { XsString } [options] - Options to this query. The default is ().  Options include:  "collation=URI" Use the range index with the collation specified by URI. If not specified, then the default collation from the query is used. If a range index with the specified collation does not exist, an error is thrown. "cached" Cache the results of this query in the list cache. "uncached" Do not cache the results of this query in the list cache. "cached-incremental" When querying on a short date or dateTime range, break the query into sub-queries on smaller ranges, and then cache the results of each. See the Usage Notes for details. "min-occurs=number" Specifies the minimum number of occurrences required. If fewer that this number of words occur, the fragment does not match. The default is 1. "max-occurs=number" Specifies the maximum number of occurrences required. If more than this number of words occur, the fragment does not match. The default is unbounded. "score-function=function" Use the selected scoring function. The score function may be:  linearUse a linear function of the difference between the specified query value and the matching value in the index to calculate a score for this range query. reciprocalUse a reciprocal function of the difference between the specified query value and the matching value in the index to calculate a score for this range query. zeroThis range query does not contribute to the score. This is the default.   "slope-factor=number" Apply the given number as a scaling factor to the slope of the scoring function. The default is 1.0. "synonym" Specifies that all of the terms in the $value parameter are considered synonyms for scoring purposes. The result is that occurrences of more than one of the synonyms are scored as if there are more occurrences of the same term (as opposed to having a separate term that contributes to score).  
    * @param { XsDouble } [weight] - A weight for this query. The default is 1.0.
    * @returns { CtsQuery }
    */
elementRangeQuery(...args) {
    const namer = bldrbase.getNamer(args, 'element-name');
    const paramdefs = [['element-name', [types.XsQName], false, true], ['operator', [types.XsString], true, false], ['value', [types.XsAnyAtomicType], false, true], ['options', [types.XsString], false, true], ['weight', [types.XsDouble], false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.elementRangeQuery', 3, new Set(['element-name', 'operator', 'value', 'options', 'weight']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.elementRangeQuery', 3, false, paramdefs, args);
    return new types.CtsQuery('cts', 'element-range-query', checkedArgs);

    }
/**
    * Creates a reference to an element value lexicon, for use as a parameter to cts:value-tuples, temporal:axis-create, or any other function that takes an index reference. Since lexicons are implemented with range indexes, this function will throw an exception if the specified range index does not exist. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.elementReference|cts.elementReference}
    * @method planBuilder.cts#elementReference
    * @since 2.1.1
    * @param { XsQName } [element] - An element QName.
    * @param { XsString } [options] - Options. The default is ().  Options include:  "type=type" Use the lexicon with the type specified by type (int, unsignedInt, long, unsignedLong, float, double, decimal, dateTime, time, date, gYearMonth, gYear, gMonth, gDay, yearMonthDuration, dayTimeDuration, string, anyURI, point, or long-lat-point) "collation=URI" Use the lexicon with the collation specified by URI. "nullable" Allow null values in tuples reported from cts:value-tuples when using this lexicon. "unchecked" Read the scalar type, collation and coordinate-system info only from the input. Do not check the definition against the context database. "coordinate-system=name" Create a reference to an index or lexicon based on the specified coordinate system. Allowed values: "wgs84", "wgs84/double", "raw", "raw/double". Only applicable if the index/lexicon value type is point or long-lat-point. "precision=value" Create a reference to an index or lexicon configured with the specified geospatial precision. Allowed values: float and double. Only applicable if the index/lexicon value type is point or long-lat-point. This value takes precedence over the precision implicit in the coordinate system name. 
    * @returns { CtsReference }
    */
elementReference(...args) {
    const namer = bldrbase.getNamer(args, 'element');
    const paramdefs = [['element', [types.XsQName], true, false], ['options', [types.XsString], false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.elementReference', 1, new Set(['element', 'options']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.elementReference', 1, false, paramdefs, args);
    return new types.CtsReference('cts', 'element-reference', checkedArgs);

    }
/**
    * Returns a query matching elements by name with text content equal a given phrase. cts:element-value-query only matches against simple elements (that is, elements that contain only text and have no element children). Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.elementValueQuery|cts.elementValueQuery}
    * @method planBuilder.cts#elementValueQuery
    * @since 2.1.1
    * @param { XsQName } [elementName] - One or more element QNames to match. When multiple QNames are specified, the query matches if any QName matches.
    * @param { XsString } [text] - One or more element values to match. When multiple strings are specified, the query matches if any string matches.
    * @param { XsString } [options] - Options to this query. The default is ().  Options include:  "case-sensitive" A case-sensitive query. "case-insensitive" A case-insensitive query. "diacritic-sensitive" A diacritic-sensitive query. "diacritic-insensitive" A diacritic-insensitive query. "punctuation-sensitive" A punctuation-sensitive query. "punctuation-insensitive" A punctuation-insensitive query. "whitespace-sensitive" A whitespace-sensitive query. "whitespace-insensitive" A whitespace-insensitive query. "stemmed" A stemmed query. "unstemmed" An unstemmed query. "wildcarded" A wildcarded query. "unwildcarded" An unwildcarded query. "exact" An exact match query. Shorthand for "case-sensitive", "diacritic-sensitive", "punctuation-sensitive", "whitespace-sensitive", "unstemmed", and "unwildcarded".  "lang=iso639code" Specifies the language of the query. The iso639code code portion is case-insensitive, and uses the languages specified by ISO 639. The default is specified in the database configuration. "min-occurs=number" Specifies the minimum number of occurrences required. If fewer that this number of words occur, the fragment does not match. The default is 1. "max-occurs=number" Specifies the maximum number of occurrences required. If more than this number of words occur, the fragment does not match. The default is unbounded. "synonym" Specifies that all of the terms in the $text parameter are considered synonyms for scoring purposes. The result is that occurrences of more than one of the synonyms are scored as if there are more occurrences of the same term (as opposed to having a separate term that contributes to score).  "lexicon-expansion-limit=number" Specifies the limit for lexicon expansion. This puts a restriction on the number of lexicon expansions that can be performed. If the limit is exceeded, the server may raise an error depending on whether the "limit-check" option is set. The default value for this option will be 4096.  "limit-check" Specifies that an error will be raised if the lexicon expansion exceeds the specified limit. "no-limit-check" Specifies that error will not be raised if the lexicon expansion exceeds the specified limit. The server will try to resolve the wildcard.  
    * @param { XsDouble } [weight] - A weight for this query. Higher weights move search results up in the relevance order. The default is 1.0. The weight should be between 64 and -16. Weights greater than 64 will have the same effect as a weight of 64. Weights less than the absolute value of 0.0625 (between -0.0625 and 0.0625) are rounded to 0, which means that they do not contribute to the score.
    * @returns { CtsQuery }
    */
elementValueQuery(...args) {
    const namer = bldrbase.getNamer(args, 'element-name');
    const paramdefs = [['element-name', [types.XsQName], false, true], ['text', [types.XsString], false, true], ['options', [types.XsString], false, true], ['weight', [types.XsDouble], false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.elementValueQuery', 1, new Set(['element-name', 'text', 'options', 'weight']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.elementValueQuery', 1, false, paramdefs, args);
    return new types.CtsQuery('cts', 'element-value-query', checkedArgs);

    }
/**
    * Returns a query matching elements by name with text content containing a given phrase. Searches only through immediate text node children of the specified element as well as any text node children of child elements defined in the Admin Interface as element-word-query-throughs or phrase-throughs; does not search through any other children of the specified element. If neither word searches nor stemmed word searches is enabled for the target database, an XDMP-SEARCH error is thrown. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.elementWordQuery|cts.elementWordQuery}
    * @method planBuilder.cts#elementWordQuery
    * @since 2.1.1
    * @param { XsQName } [elementName] - One or more element QNames to match. When multiple QNames are specified, the query matches if any QName matches.
    * @param { XsString } [text] - Some words or phrases to match. When multiple strings are specified, the query matches if any string matches.
    * @param { XsString } [options] - Options to this query. The default is ().  Options include:  "case-sensitive" A case-sensitive query. "case-insensitive" A case-insensitive query. "diacritic-sensitive" A diacritic-sensitive query. "diacritic-insensitive" A diacritic-insensitive query. "punctuation-sensitive" A punctuation-sensitive query. "punctuation-insensitive" A punctuation-insensitive query. "whitespace-sensitive" A whitespace-sensitive query. "whitespace-insensitive" A whitespace-insensitive query. "stemmed" A stemmed query. "unstemmed" An unstemmed query. "wildcarded" A wildcarded query. "unwildcarded" An unwildcarded query. "exact" An exact match query. Shorthand for "case-sensitive", "diacritic-sensitive", "punctuation-sensitive", "whitespace-sensitive", "unstemmed", and "unwildcarded".  "lang=iso639code" Specifies the language of the query. The iso639code code portion is case-insensitive, and uses the languages specified by ISO 639. The default is specified in the database configuration. "distance-weight=number" A weight applied based on the minimum distance between matches of this query. Higher weights add to the importance of proximity (as opposed to term matches) when the relevance order is calculated. The default value is 0.0 (no impact of proximity). The weight should be between 64 and -16. Weights greater than 64 will have the same effect as a weight of 64. This parameter has no effect if the word positions index is not enabled. This parameter has no effect on searches that use score-simple, score-random, or score-zero (because those scoring algorithms do not consider term frequency, proximity is irrelevant).  "min-occurs=number" Specifies the minimum number of occurrences required. If fewer that this number of words occur, the fragment does not match. The default is 1. "max-occurs=number" Specifies the maximum number of occurrences required. If more than this number of words occur, the fragment does not match. The default is unbounded. "synonym" Specifies that all of the terms in the $text parameter are considered synonyms for scoring purposes. The result is that occurrences of more than one of the synonyms are scored as if there are more occurrences of the same term (as opposed to having a separate term that contributes to score).  "lexicon-expand=value" The value is one of full, prefix-postfix, off, or heuristic (the default is heuristic). An option with a value of lexicon-expand=full specifies that wildcards are resolved by expanding the pattern to words in a lexicon (if there is one available), and turning into a series of cts:word-queries, even if this takes a long time to evaluate. An option with a value of lexicon-expand=prefix-postfix specifies that wildcards are resolved by expanding the pattern to the pre- and postfixes of the words in the word lexicon (if there is one), and turning the query into a series of character queries, even if it takes a long time to evaluate. An option with a value of lexicon-expand=off specifies that wildcards are only resolved by looking up character patterns in the search pattern index, not in the lexicon. An option with a value of lexicon-expand=heuristic, which is the default, specifies that wildcards are resolved by using a series of internal rules, such as estimating the number of lexicon entries that need to be scanned, seeing if the estimate crosses certain thresholds, and (if appropriate), using another way besides lexicon expansion to resolve the query.  * "lexicon-expansion-limit=number" Specifies the limit for lexicon expansion. This puts a restriction on the number of lexicon expansions that can be performed. If the limit is exceeded, the server may raise an error depending on whether the "limit-check" option is set. The default value for this option will be 4096.  "limit-check" Specifies that an error will be raised if the lexicon expansion exceeds the specified limit. "no-limit-check" Specifies that error will not be raised if the lexicon expansion exceeds the specified limit. The server will try to resolve the wildcard.  
    * @param { XsDouble } [weight] - A weight for this query. Higher weights move search results up in the relevance order. The default is 1.0. The weight should be between 64 and -16. Weights greater than 64 will have the same effect as a weight of 64. Weights less than the absolute value of 0.0625 (between -0.0625 and 0.0625) are rounded to 0, which means that they do not contribute to the score.
    * @returns { CtsQuery }
    */
elementWordQuery(...args) {
    const namer = bldrbase.getNamer(args, 'element-name');
    const paramdefs = [['element-name', [types.XsQName], false, true], ['text', [types.XsString], false, true], ['options', [types.XsString], false, true], ['weight', [types.XsDouble], false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.elementWordQuery', 2, new Set(['element-name', 'text', 'options', 'weight']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.elementWordQuery', 2, false, paramdefs, args);
    return new types.CtsQuery('cts', 'element-word-query', checkedArgs);

    }
/**
    * Returns a query that matches no fragments. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.falseQuery|cts.falseQuery}
    * @method planBuilder.cts#falseQuery
    * @since 2.1.1

    * @returns { CtsQuery }
    */
falseQuery(...args) {
    bldrbase.checkMaxArity('cts.falseQuery', args.length, 0);
    return new types.CtsQuery('cts', 'false-query', args);
    }
/**
    * Returns a cts:query matching fields by name with a range-index entry equal to a given value. Searches with the cts:field-range-query constructor require a field range index on the specified field name(s); if there is no range index configured, then an exception is thrown. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.fieldRangeQuery|cts.fieldRangeQuery}
    * @method planBuilder.cts#fieldRangeQuery
    * @since 2.1.1
    * @param { XsString } [fieldName] - One or more field names to match. When multiple field names are specified, the query matches if any field name matches.
    * @param { XsString } [operator] - A comparison operator.  Operators include:  "&lt;" Match range index values less than $value. "&lt;=" Match range index values less than or equal to $value. "&gt;" Match range index values greater than $value. "&gt;=" Match range index values greater than or equal to $value. "=" Match range index values equal to $value. "!=" Match range index values not equal to $value. 
    * @param { XsAnyAtomicType } [value] - One or more field values to match. When multiple values are specified, the query matches if any value matches. The value must be a type for which there is a range index defined.
    * @param { XsString } [options] - Options to this query. The default is ().  Options include:  "collation=URI" Use the range index with the collation specified by URI. If not specified, then the default collation from the query is used. If a range index with the specified collation does not exist, an error is thrown. "cached" Cache the results of this query in the list cache. "uncached" Do not cache the results of this query in the list cache. "cached-incremental" When querying on a short date or dateTime range, break the query into sub-queries on smaller ranges, and then cache the results of each. See the Usage Notes for details. "min-occurs=number" Specifies the minimum number of occurrences required. If fewer that this number of words occur, the fragment does not match. The default is 1. "max-occurs=number" Specifies the maximum number of occurrences required. If more than this number of words occur, the fragment does not match. The default is unbounded. "score-function=function" Use the selected scoring function. The score function may be:  linearUse a linear function of the difference between the specified query value and the matching value in the index to calculate a score for this range query. reciprocalUse a reciprocal function of the difference between the specified query value and the matching value in the index to calculate a score for this range query. zeroThis range query does not contribute to the score. This is the default.   "slope-factor=number" Apply the given number as a scaling factor to the slope of the scoring function. The default is 1.0. "synonym" Specifies that all of the terms in the $value parameter are considered synonyms for scoring purposes. The result is that occurrences of more than one of the synonyms are scored as if there are more occurrences of the same term (as opposed to having a separate term that contributes to score).  
    * @param { XsDouble } [weight] - A weight for this query. The default is 1.0.
    * @returns { CtsQuery }
    */
fieldRangeQuery(...args) {
    const namer = bldrbase.getNamer(args, 'field-name');
    const paramdefs = [['field-name', [types.XsString], false, true], ['operator', [types.XsString], true, false], ['value', [types.XsAnyAtomicType], false, true], ['options', [types.XsString], false, true], ['weight', [types.XsDouble], false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.fieldRangeQuery', 3, new Set(['field-name', 'operator', 'value', 'options', 'weight']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.fieldRangeQuery', 3, false, paramdefs, args);
    return new types.CtsQuery('cts', 'field-range-query', checkedArgs);

    }
/**
    * Creates a reference to a field value lexicon, for use as a parameter to cts:value-tuples. Since lexicons are implemented with range indexes, this function will throw an exception if the specified range index does not exist. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.fieldReference|cts.fieldReference}
    * @method planBuilder.cts#fieldReference
    * @since 2.1.1
    * @param { XsString } [field] - A field name.
    * @param { XsString } [options] - Options. The default is ().  Options include:  "type=type" Use the lexicon with the type specified by type (int, unsignedInt, long, unsignedLong, float, double, decimal, dateTime, time, date, gYearMonth, gYear, gMonth, gDay, yearMonthDuration, dayTimeDuration, string, anyURI, point, or long-lat-point) "collation=URI" Use the lexicon with the collation specified by URI. "nullable" Allow null values in tuples reported from cts:value-tuples when using this lexicon. "unchecked" Read the scalar type, collation and coordinate-system info only from the input. Do not check the definition against the context database. "coordinate-system=name" Create a reference to an index or lexicon based on the specified coordinate system. Allowed values: "wgs84", "wgs84/double", "raw", "raw/double". Only applicable if the index/lexicon value type is point or long-lat-point. "precision=value" Create a reference to an index or lexicon configured with the specified geospatial precision. Allowed values: float and double. Only applicable if the index/lexicon value type is point or long-lat-point. This value takes precedence over the precision implicit in the coordinate system name. 
    * @returns { CtsReference }
    */
fieldReference(...args) {
    const namer = bldrbase.getNamer(args, 'field');
    const paramdefs = [['field', [types.XsString], true, false], ['options', [types.XsString], false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.fieldReference', 1, new Set(['field', 'options']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.fieldReference', 1, false, paramdefs, args);
    return new types.CtsReference('cts', 'field-reference', checkedArgs);

    }
/**
    * Returns a query matching text content containing a given value in the specified field. If the specified field does not exist, cts:field-value-query throws an exception. If the specified field does not have the index setting field value searches enabled, either for the database or for the specified field, then a cts:search with a cts:field-value-query throws an exception. A field is a named object that specified elements to include and exclude from a search, and can include score weights for any included elements. You create fields at the database level using the Admin Interface. For details on fields, see the chapter on "Fields Database Settings" in the Administrator's Guide. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.fieldValueQuery|cts.fieldValueQuery}
    * @method planBuilder.cts#fieldValueQuery
    * @since 2.1.1
    * @param { XsString } [fieldName] - One or more field names to search over. If multiple field names are supplied, the match can be in any of the specified fields (or-query semantics).
    * @param { XsAnyAtomicType } [text] - The values to match. If multiple values are specified, the query matches if any of the values match (or-query semantics). For XML and metadata, the values should be strings. For JSON, the values can be strings, numbers or booleans to match correspondingly typed nodes. To match null, pass in the empty sequence.
    * @param { XsString } [options] - Options to this query. The default is ().  Options include:  "case-sensitive" A case-sensitive query. "case-insensitive" A case-insensitive query. "diacritic-sensitive" A diacritic-sensitive query. "diacritic-insensitive" A diacritic-insensitive query. "punctuation-sensitive" A punctuation-sensitive query. "punctuation-insensitive" A punctuation-insensitive query. "whitespace-sensitive" A whitespace-sensitive query. "whitespace-insensitive" A whitespace-insensitive query. "stemmed" A stemmed query. "unstemmed" An unstemmed query. "wildcarded" A wildcarded query. "unwildcarded" An unwildcarded query. "exact" An exact match query. Shorthand for "case-sensitive", "diacritic-sensitive", "punctuation-sensitive", "whitespace-sensitive", "unstemmed", and "unwildcarded".  "lang=iso639code" Specifies the language of the query. The iso639code code portion is case-insensitive, and uses the languages specified by ISO 639. The default is specified in the database configuration. "distance-weight=number" A weight applied based on the minimum distance between matches of this query. Higher weights add to the importance of proximity (as opposed to term matches) when the relevance order is calculated. The default value is 0.0 (no impact of proximity). The weight should be between 64 and -16. Weights greater than 64 will have the same effect as a weight of 64. This parameter has no effect if the word positions index is not enabled. This parameter has no effect on searches that use score-simple or score-random (because those scoring algorithms do not consider term frequency, proximity is irrelevant).  "min-occurs=number" Specifies the minimum number of occurrences required. If fewer that this number of words occur, the fragment does not match. The default is 1. "max-occurs=number" Specifies the maximum number of occurrences required. If more than this number of words occur, the fragment does not match. The default is unbounded. "synonym" Specifies that all of the terms in the $text parameter are considered synonyms for scoring purposes. The result is that occurrences of more than one of the synonyms are scored as if there are more occurrences of the same term (as opposed to having a separate term that contributes to score).  "lexicon-expansion-limit=number" Specifies the limit for lexicon expansion. This puts a restriction on the number of lexicon expansions that can be performed. If the limit is exceeded, the server may raise an error depending on whether the "limit-check" option is set. The default value for this option will be 4096.  "limit-check" Specifies that an error will be raised if the lexicon expansion exceeds the specified limit. "no-limit-check" Specifies that error will not be raised if the lexicon expansion exceeds the specified limit. The server will try to resolve the wildcard.  
    * @param { XsDouble } [weight] - A weight for this query. Higher weights move search results up in the relevance order. The default is 1.0. The weight should be between 64 and -16. Weights greater than 64 will have the same effect as a weight of 64. Weights less than the absolute value of 0.0625 (between -0.0625 and 0.0625) are rounded to 0, which means that they do not contribute to the score.
    * @returns { CtsQuery }
    */
fieldValueQuery(...args) {
    const namer = bldrbase.getNamer(args, 'field-name');
    const paramdefs = [['field-name', [types.XsString], false, true], ['text', [types.XsAnyAtomicType], false, true], ['options', [types.XsString], false, true], ['weight', [types.XsDouble], false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.fieldValueQuery', 2, new Set(['field-name', 'text', 'options', 'weight']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.fieldValueQuery', 2, false, paramdefs, args);
    return new types.CtsQuery('cts', 'field-value-query', checkedArgs);

    }
/**
    * Returns a query matching fields with text content containing a given phrase. If the specified field does not exist, this function throws an exception. A field is a named object that specified elements to include and exclude from a search, and can include score weights for any included elements. You create fields at the database level using the Admin Interface. For details on fields, see the chapter on "Fields Database Settings" in the Administrator's Guide. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.fieldWordQuery|cts.fieldWordQuery}
    * @method planBuilder.cts#fieldWordQuery
    * @since 2.1.1
    * @param { XsString } [fieldName] - One or more field names to search over. If multiple field names are supplied, the match can be in any of the specified fields (or-query semantics).
    * @param { XsString } [text] - The word or phrase to match. If multiple strings are specified, the query matches if any of the words or phrases match (or-query semantics).
    * @param { XsString } [options] - Options to this query. The default is ().  Options include:  "case-sensitive" A case-sensitive query. "case-insensitive" A case-insensitive query. "diacritic-sensitive" A diacritic-sensitive query. "diacritic-insensitive" A diacritic-insensitive query. "punctuation-sensitive" A punctuation-sensitive query. "punctuation-insensitive" A punctuation-insensitive query. "whitespace-sensitive" A whitespace-sensitive query. "whitespace-insensitive" A whitespace-insensitive query. "stemmed" A stemmed query. "unstemmed" An unstemmed query. "wildcarded" A wildcarded query. "unwildcarded" An unwildcarded query. "exact" An exact match query. Shorthand for "case-sensitive", "diacritic-sensitive", "punctuation-sensitive", "whitespace-sensitive", "unstemmed", and "unwildcarded".  "lang=iso639code" Specifies the language of the query. The iso639code code portion is case-insensitive, and uses the languages specified by ISO 639. The default is specified in the database configuration. "distance-weight=number" A weight applied based on the minimum distance between matches of this query. Higher weights add to the importance of proximity (as opposed to term matches) when the relevance order is calculated. The default value is 0.0 (no impact of proximity). The weight should be between 64 and -16. Weights greater than 64 will have the same effect as a weight of 64. This parameter has no effect if the word positions index is not enabled. This parameter has no effect on searches that use score-simple, score-random, or score-zero (because those scoring algorithms do not consider term frequency, proximity is irrelevant).  "min-occurs=number" Specifies the minimum number of occurrences required. If fewer that this number of words occur, the fragment does not match. The default is 1. "max-occurs=number" Specifies the maximum number of occurrences required. If more than this number of words occur, the fragment does not match. The default is unbounded. "synonym" Specifies that all of the terms in the $text parameter are considered synonyms for scoring purposes. The result is that occurrences of more than one of the synonyms are scored as if there are more occurrences of the same term (as opposed to having a separate term that contributes to score).  "lexicon-expand=value" The value is one of full, prefix-postfix, off, or heuristic (the default is heuristic). An option with a value of lexicon-expand=full specifies that wildcards are resolved by expanding the pattern to words in a lexicon (if there is one available), and turning into a series of cts:word-queries, even if this takes a long time to evaluate. An option with a value of lexicon-expand=prefix-postfix specifies that wildcards are resolved by expanding the pattern to the pre- and postfixes of the words in the word lexicon (if there is one), and turning the query into a series of character queries, even if it takes a long time to evaluate. An option with a value of lexicon-expand=off specifies that wildcards are only resolved by looking up character patterns in the search pattern index, not in the lexicon. An option with a value of lexicon-expand=heuristic, which is the default, specifies that wildcards are resolved by using a series of internal rules, such as estimating the number of lexicon entries that need to be scanned, seeing if the estimate crosses certain thresholds, and (if appropriate), using another way besides lexicon expansion to resolve the query.  "lexicon-expansion-limit=number" Specifies the limit for lexicon expansion. This puts a restriction on the number of lexicon expansions that can be performed. If the limit is exceeded, the server may raise an error depending on whether the "limit-check" option is set. The default value for this option will be 4096.  "limit-check" Specifies that an error will be raised if the lexicon expansion exceeds the specified limit. "no-limit-check" Specifies that error will not be raised if the lexicon expansion exceeds the specified limit. The server will try to resolve the wildcard.  
    * @param { XsDouble } [weight] - A weight for this query. Higher weights move search results up in the relevance order. The default is 1.0. The weight should be between 64 and -16. Weights greater than 64 will have the same effect as a weight of 64. Weights less than the absolute value of 0.0625 (between -0.0625 and 0.0625) are rounded to 0, which means that they do not contribute to the score.
    * @returns { CtsQuery }
    */
fieldWordQuery(...args) {
    const namer = bldrbase.getNamer(args, 'field-name');
    const paramdefs = [['field-name', [types.XsString], false, true], ['text', [types.XsString], false, true], ['options', [types.XsString], false, true], ['weight', [types.XsDouble], false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.fieldWordQuery', 2, new Set(['field-name', 'text', 'options', 'weight']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.fieldWordQuery', 2, false, paramdefs, args);
    return new types.CtsQuery('cts', 'field-word-query', checkedArgs);

    }
/**
    * Creates a reference to a geospatial path range index, for use as a parameter to cts:value-tuples. This function will throw an exception if the specified range index does not exist. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.geospatialPathReference|cts.geospatialPathReference}
    * @method planBuilder.cts#geospatialPathReference
    * @since 2.1.1
    * @param { XsString } [pathExpression] - A path expression.
    * @param { XsString } [options] - Options. The default is ().  Options include:  "type=type" Use the lexicon with the type specified by type (point or long-lat-point) "coordinate-system=string" Use the given coordinate system. Valid values are:  wgs84The WGS84 coordinate system. wgs84/doubleThe WGS84 coordinate system at double precision. etrs89The ETRS89 coordinate system. etrs89/doubleThe ETRS89 coordinate system at double precision. rawThe raw (unmapped) coordinate system. raw/doubleThe raw coordinate system at double precision.   "precision=value" Use the coordinate system at the given precision. Allowed values: float and double. "nullable" Allow null values in tuples reported from cts:value-tuples when using this lexicon. "unchecked" Read the scalar type and coordinate-system info only from the input. Do not check the definition against the context database. 
    * @param { MapMap } [map] - A map of namespace bindings. The keys should be namespace prefixes and the values should be namespace URIs. These namespace bindings will be added to the in-scope namespace bindings in the interpretation of the path.
    * @returns { CtsReference }
    */
geospatialPathReference(...args) {
    const namer = bldrbase.getNamer(args, 'path-expression');
    const paramdefs = [['path-expression', [types.XsString], true, false], ['options', [types.XsString], false, true], ['map', [types.MapMap], false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.geospatialPathReference', 1, new Set(['path-expression', 'options', 'map']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.geospatialPathReference', 1, false, paramdefs, args);
    return new types.CtsReference('cts', 'geospatial-path-reference', checkedArgs);

    }
/**
    * Create a reference to a geospatial region path index, for use as a parameter to cts:geospatial-region-query and other query operations on geospatial region indexes. This function throws an exception if the specified region path index does not exist. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.geospatialRegionPathReference|cts.geospatialRegionPathReference}
    * @method planBuilder.cts#geospatialRegionPathReference
    * @since 2.1.1
    * @param { XsString } [pathExpression] - The XPath expression specified in the index configuration.
    * @param { XsString } [options] - Index configuration options. The default is (). These options should match the configuration used when creating the index. Available options:  "coordinate-system=string" Use the given coordinate system. Valid values are:  wgs84The WGS84 coordinate system. wgs84/doubleThe WGS84 coordinate system at double precision. etrs89The ETRS89 coordinate system. etrs89/doubleThe ETRS89 coordinate system at double precision. rawThe raw (unmapped) coordinate system. raw/doubleThe raw coordinate system at double precision.   "precision=value" Use the coordinate system at the given precision. Allowed values: float (default) and double. "unchecked" Read the coordinate-system info only from the input. Do not check the definition against the context database. 
    * @param { MapMap } [namespaces] - A map of namespace bindings. The keys should be namespace prefixes and the values should be namespace URIs. These namespace bindings will be added to the in-scope namespace bindings in the interpretation of the path.
    * @param { XsInteger } [geohashPrecision] - The geohash precision specified in the index configuration. Values between 1 and 12 inclusive are possible.
    * @param { XsString } [units] - The units specified in the index configuration. 'miles', 'km', 'feet', and 'meters' are valid.
    * @param { XsString } [invalidValues] - The invalid values setting specified in the index configuration. 'reject' and 'ignore' are valid.
    * @returns { CtsReference }
    */
geospatialRegionPathReference(...args) {
    const namer = bldrbase.getNamer(args, 'path-expression');
    const paramdefs = [['path-expression', [types.XsString], true, false], ['options', [types.XsString], false, true], ['namespaces', [types.MapMap], false, false], ['geohash-precision', [types.XsInteger], false, false], ['units', [types.XsString], false, true], ['invalid-values', [types.XsString], false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.geospatialRegionPathReference', 1, new Set(['path-expression', 'options', 'namespaces', 'geohash-precision', 'units', 'invalid-values']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.geospatialRegionPathReference', 1, false, paramdefs, args);
    return new types.CtsReference('cts', 'geospatial-region-path-reference', checkedArgs);

    }
/**
    * Construct a query to match regions in documents that satisfy a specified relationship relative to other regions. For example, regions in documents that intersect with regions specified in the search criteria. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.geospatialRegionQuery|cts.geospatialRegionQuery}
    * @method planBuilder.cts#geospatialRegionQuery
    * @since 2.1.1
    * @param { CtsReference } [reference] - Zero or more geospatial path region index references that identify regions in your content. To create a reference, see cts:geospatial-region-path-reference.
    * @param { XsString } [operation] - The match operation to apply between the regions specified in the $geospatial-region-reference parameter and the regions in the $regions parameter. Allowed values: contains, covered-by, covers, disjoint, intersects, overlaps, within, equals, touches, crosses. See the Usage Notes for details.
    * @param { CtsRegion } [region] - Criteria regions to match against the regions specified in the $geospatial-region-reference parameter. These regions function as the right operand of $operation.
    * @param { XsString } [options] - Options to this query. The default is (). Available options:   "units=value" Measure distances and the radii of circles using the given units. Allowed values: miles (default), km, feet, and meters. This option only affects regions provided in the $regions parameter, not regions stored in documents. "score-function=function" Use the selected scoring function. The score function may be:  linearUse a linear function of the difference between the specified query value and the matching value in the index to calculate a score for this range query. reciprocalUse a reciprocal function of the difference between the specified query value and the matching value in the index to calculate a score for this range query. zeroThis range query does not contribute to the score. This is the default.   "slope-factor=number" Apply the given number as a scaling factor to the slope of the scoring function. The default is 1.0. "synonym" Specifies that all of the terms in the $regions parameter are considered synonyms for scoring purposes. The result is that occurrences of more than one of the synonyms are scored as if there are more occurrence of the same term (as opposed to having a separate term that contributes to score).  "tolerance=distance" Tolerance is the largest allowable variation in geometry calculations. If the distance between two points is less than tolerance, then the two points are considered equal. For the raw coordinate system, use the units of the coordinates. For geographic coordinate systems, use the units specified by the units option. 
    * @param { XsDouble } [weight] - A weight for this query. The default is 1.0.
    * @returns { CtsQuery }
    */
geospatialRegionQuery(...args) {
    const namer = bldrbase.getNamer(args, 'reference');
    const paramdefs = [['reference', [types.CtsReference], false, true], ['operation', [types.XsString], true, false], ['region', [types.CtsRegion], false, true], ['options', [types.XsString], false, true], ['weight', [types.XsDouble], false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.geospatialRegionQuery', 3, new Set(['reference', 'operation', 'region', 'options', 'weight']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.geospatialRegionQuery', 3, false, paramdefs, args);
    return new types.CtsQuery('cts', 'geospatial-region-query', checkedArgs);

    }
/**
    * Returns a query matching json properties by name which has specific children representing latitude and longitude values for a point contained within the given geographic box, circle, or polygon, or equal to the given point. Points that lie between the southern boundary and the northern boundary of a box, travelling northwards, and between the western boundary and the eastern boundary of the box, travelling eastwards, will match. Points contained within the given radius of the center point of a circle will match, using the curved distance on the surface of the Earth. Points contained within the given polygon will match, using great circle arcs over a spherical model of the Earth as edges. An error may result if the polygon is malformed in some way. Points equal to the a given point will match, taking into account the fact that longitudes converge at the poles. Using the geospatial query constructors requires a valid geospatial license key; without a valid license key, searches that include geospatial queries will throw an exception. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.jsonPropertyChildGeospatialQuery|cts.jsonPropertyChildGeospatialQuery}
    * @method planBuilder.cts#jsonPropertyChildGeospatialQuery
    * @since 2.1.1
    * @param { XsString } [propertyName] - One or more parent property names to match. When multiple names are specified, the query matches if any name matches.
    * @param { XsString } [childName] - One or more child property names to match. When multiple names are specified, the query matches if any name matches; however, only the first matching latitude child in any point instance will be checked. The property must specify both latitude and longitude coordinates.
    * @param { CtsRegion } [region] - One or more geographic boxes, circles, polygons, or points. Where multiple regions are specified, the query matches if any region matches.
    * @param { XsString } [options] - Options to this query. The default is (). Options include:   "coordinate-system=string" Use the given coordinate system. Valid values are:  wgs84The WGS84 coordinate system. wgs84/doubleThe WGS84 coordinate system at double precision. etrs89The ETRS89 coordinate system. etrs89/doubleThe ETRS89 coordinate system at double precision. rawThe raw (unmapped) coordinate system. raw/doubleThe raw coordinate system at double precision.   "precision=string" Use the coordinate system at the given precision. Allowed values: float (default) and double. "units=value" Measure distance and the radii of circles in the specified units. Allowed values: miles (default), km, feet, meters. "boundaries-included" Points on boxes', circles', and polygons' boundaries are counted as matching. This is the default. "boundaries-excluded" Points on boxes', circles', and polygons' boundaries are not counted as matching. "boundaries-latitude-excluded" Points on boxes' latitude boundaries are not counted as matching. "boundaries-longitude-excluded" Points on boxes' longitude boundaries are not counted as matching. "boundaries-south-excluded" Points on the boxes' southern boundaries are not counted as matching. "boundaries-west-excluded" Points on the boxes' western boundaries are not counted as matching. "boundaries-north-excluded" Points on the boxes' northern boundaries are not counted as matching. "boundaries-east-excluded" Points on the boxes' eastern boundaries are not counted as matching. "boundaries-circle-excluded" Points on circles' boundary are not counted as matching. "boundaries-endpoints-excluded" Points on linestrings' boundary (the endpoints) are not counted as matching. "cached" Cache the results of this query in the list cache. "uncached" Do not cache the results of this query in the list cache. "type=long-lat-point" Specifies the format for the point in the data as longitude first, latitude second. "type=point" Specifies the format for the point in the data as latitude first, longitude second. This is the default format. "score-function=function" Use the selected scoring function. The score function may be:  linearUse a linear function of the difference between the specified query value and the matching value in the index to calculate a score for this range query. reciprocalUse a reciprocal function of the difference between the specified query value and the matching value in the index to calculate a score for this range query. zeroThis range query does not contribute to the score. This is the default.   "slope-factor=number" Apply the given number as a scaling factor to the slope of the scoring function. The default is 1.0. "synonym" Specifies that all of the terms in the $regions parameter are considered synonyms for scoring purposes. The result is that occurrences of more than one of the synonyms are scored as if there are more occurrence of the same term (as opposed to having a separate term that contributes to score).  
    * @param { XsDouble } [weight] - A weight for this query. The default is 1.0.
    * @returns { CtsQuery }
    */
jsonPropertyChildGeospatialQuery(...args) {
    const namer = bldrbase.getNamer(args, 'property-name');
    const paramdefs = [['property-name', [types.XsString], false, true], ['child-name', [types.XsString], false, true], ['region', [types.CtsRegion], false, true], ['options', [types.XsString], false, true], ['weight', [types.XsDouble], false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.jsonPropertyChildGeospatialQuery', 3, new Set(['property-name', 'child-name', 'region', 'options', 'weight']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.jsonPropertyChildGeospatialQuery', 3, false, paramdefs, args);
    return new types.CtsQuery('cts', 'json-property-child-geospatial-query', checkedArgs);

    }
/**
    * Returns a query matching json properties by name whose content represents a point contained within the given geographic box, circle, or polygon, or equal to the given point. Points that lie between the southern boundary and the northern boundary of a box, travelling northwards, and between the western boundary and the eastern boundary of the box, travelling eastwards, will match. Points contained within the given radius of the center point of a circle will match, using the curved distance on the surface of the Earth. Points contained within the given polygon will match, using great circle arcs over a spherical model of the Earth as edges. An error may result if the polygon is malformed in some way. Points equal to the a given point will match, taking into account the fact that longitudes converge at the poles. Using the geospatial query constructors requires a valid geospatial license key; without a valid license key, searches that include geospatial queries will throw an exception. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.jsonPropertyGeospatialQuery|cts.jsonPropertyGeospatialQuery}
    * @method planBuilder.cts#jsonPropertyGeospatialQuery
    * @since 2.1.1
    * @param { XsString } [propertyName] - One or more json property names to match. When multiple names are specified, the query matches if any name matches.
    * @param { CtsRegion } [region] - One or more geographic boxes, circles, polygons, or points. Where multiple regions are specified, the query matches if any region matches.
    * @param { XsString } [options] - Options to this query. The default is (). Options include:   "coordinate-system=string" Use the given coordinate system. Valid values are:  wgs84The WGS84 coordinate system. wgs84/doubleThe WGS84 coordinate system at double precision. etrs89The ETRS89 coordinate system. etrs89/doubleThe ETRS89 coordinate system at double precision. rawThe raw (unmapped) coordinate system. raw/doubleThe raw coordinate system at double precision.   "precision=string" Use the coordinate system at the given precision. Allowed values: float (default) and double. "units=value" Measure distance and the radii of circles in the specified units. Allowed values: miles (default), km, feet, meters. "boundaries-included" Points on boxes', circles', and polygons' boundaries are counted as matching. This is the default. "boundaries-excluded" Points on boxes', circles', and polygons' boundaries are not counted as matching. "boundaries-latitude-excluded" Points on boxes' latitude boundaries are not counted as matching. "boundaries-longitude-excluded" Points on boxes' longitude boundaries are not counted as matching. "boundaries-south-excluded" Points on the boxes' southern boundaries are not counted as matching. "boundaries-west-excluded" Points on the boxes' western boundaries are not counted as matching. "boundaries-north-excluded" Points on the boxes' northern boundaries are not counted as matching. "boundaries-east-excluded" Points on the boxes' eastern boundaries are not counted as matching. "boundaries-circle-excluded" Points on circles' boundary are not counted as matching. "boundaries-endpoints-excluded" Points on linestrings' boundary (the endpoints) are not counted as matching. "cached" Cache the results of this query in the list cache. "uncached" Do not cache the results of this query in the list cache. "type=long-lat-point" Specifies the format for the point in the data as longitude first, latitude second. "type=point" Specifies the format for the point in the data as latitude first, longitude second. This is the default format. "score-function=function" Use the selected scoring function. The score function may be:  linearUse a linear function of the difference between the specified query value and the matching value in the index to calculate a score for this range query. reciprocalUse a reciprocal function of the difference between the specified query value and the matching value in the index to calculate a score for this range query. zeroThis range query does not contribute to the score. This is the default.   "slope-factor=number" Apply the given number as a scaling factor to the slope of the scoring function. The default is 1.0. "synonym" Specifies that all of the terms in the $regions parameter are considered synonyms for scoring purposes. The result is that occurrences of more than one of the synonyms are scored as if there are more occurrence of the same term (as opposed to having a separate term that contributes to score).  
    * @param { XsDouble } [weight] - A weight for this query. The default is 1.0.
    * @returns { CtsQuery }
    */
jsonPropertyGeospatialQuery(...args) {
    const namer = bldrbase.getNamer(args, 'property-name');
    const paramdefs = [['property-name', [types.XsString], false, true], ['region', [types.CtsRegion], false, true], ['options', [types.XsString], false, true], ['weight', [types.XsDouble], false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.jsonPropertyGeospatialQuery', 2, new Set(['property-name', 'region', 'options', 'weight']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.jsonPropertyGeospatialQuery', 2, false, paramdefs, args);
    return new types.CtsQuery('cts', 'json-property-geospatial-query', checkedArgs);

    }
/**
    * Returns a query matching json properties by name which has specific property children representing latitude and longitude values for a point contained within the given geographic box, circle, or polygon, or equal to the given point. Points that lie between the southern boundary and the northern boundary of a box, travelling northwards, and between the western boundary and the eastern boundary of the box, travelling eastwards, will match. Points contained within the given radius of the center point of a circle will match, using the curved distance on the surface of the Earth. Points contained within the given polygon will match, using great circle arcs over a spherical model of the Earth as edges. An error may result if the polygon is malformed in some way. Points equal to the a given point will match, taking into account the fact that longitudes converge at the poles. Using the geospatial query constructors requires a valid geospatial license key; without a valid license key, searches that include geospatial queries will throw an exception. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.jsonPropertyPairGeospatialQuery|cts.jsonPropertyPairGeospatialQuery}
    * @method planBuilder.cts#jsonPropertyPairGeospatialQuery
    * @since 2.1.1
    * @param { XsString } [propertyName] - One or more parent property names to match. When multiple names are specified, the query matches if any name matches.
    * @param { XsString } [latitudeName] - One or more latitude property names to match. When multiple names are specified, the query matches if any name matches; however, only the first matching latitude child in any point instance will be checked.
    * @param { XsString } [longitudeName] - One or more longitude property names to match. When multiple names are specified, the query matches if any name matches; however, only the first matching longitude child in any point instance will be checked.
    * @param { CtsRegion } [region] - One or more geographic boxes, circles, polygons, or points. Where multiple regions are specified, the query matches if any region matches.
    * @param { XsString } [options] - Options to this query. The default is (). Options include:   "coordinate-system=string" Use the given coordinate system. Valid values are:  wgs84The WGS84 coordinate system. wgs84/doubleThe WGS84 coordinate system at double precision. etrs89The ETRS89 coordinate system. etrs89/doubleThe ETRS89 coordinate system at double precision. rawThe raw (unmapped) coordinate system. raw/doubleThe raw coordinate system at double precision.   "precision=value" Use the coordinate system at the given precision. Allowed values: float and double. "units=value" Measure distance and the radii of circles in the specified units. Allowed values: miles (default), km, feet, meters. "boundaries-included" Points on boxes', circles', and polygons' boundaries are counted as matching. This is the default. "boundaries-excluded" Points on boxes', circles', and polygons' boundaries are not counted as matching. "boundaries-latitude-excluded" Points on boxes' latitude boundaries are not counted as matching. "boundaries-longitude-excluded" Points on boxes' longitude boundaries are not counted as matching. "boundaries-south-excluded" Points on the boxes' southern boundaries are not counted as matching. "boundaries-west-excluded" Points on the boxes' western boundaries are not counted as matching. "boundaries-north-excluded" Points on the boxes' northern boundaries are not counted as matching. "boundaries-east-excluded" Points on the boxes' eastern boundaries are not counted as matching. "boundaries-circle-excluded" Points on circles' boundary are not counted as matching. "boundaries-endpoints-excluded" Points on linestrings' boundary (the endpoints) are not counted as matching. "cached" Cache the results of this query in the list cache. "uncached" Do not cache the results of this query in the list cache. "score-function=function" Use the selected scoring function. The score function may be:  linearUse a linear function of the difference between the specified query value and the matching value in the index to calculate a score for this range query. reciprocalUse a reciprocal function of the difference between the specified query value and the matching value in the index to calculate a score for this range query. zeroThis range query does not contribute to the score. This is the default.   "slope-factor=number" Apply the given number as a scaling factor to the slope of the scoring function. The default is 1.0. "synonym" Specifies that all of the terms in the $regions parameter are considered synonyms for scoring purposes. The result is that occurrences of more than one of the synonyms are scored as if there are more occurrence of the same term (as opposed to having a separate term that contributes to score).  
    * @param { XsDouble } [weight] - A weight for this query. The default is 1.0.
    * @returns { CtsQuery }
    */
jsonPropertyPairGeospatialQuery(...args) {
    const namer = bldrbase.getNamer(args, 'property-name');
    const paramdefs = [['property-name', [types.XsString], false, true], ['latitude-name', [types.XsString], false, true], ['longitude-name', [types.XsString], false, true], ['region', [types.CtsRegion], false, true], ['options', [types.XsString], false, true], ['weight', [types.XsDouble], false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.jsonPropertyPairGeospatialQuery', 4, new Set(['property-name', 'latitude-name', 'longitude-name', 'region', 'options', 'weight']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.jsonPropertyPairGeospatialQuery', 4, false, paramdefs, args);
    return new types.CtsQuery('cts', 'json-property-pair-geospatial-query', checkedArgs);

    }
/**
    * Returns a cts:query matching JSON properties by name with a range-index entry equal to a given value. Searches with the cts:json-property-range-query constructor require a property range index on the specified names; if there is no range index configured, then an exception is thrown. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.jsonPropertyRangeQuery|cts.jsonPropertyRangeQuery}
    * @method planBuilder.cts#jsonPropertyRangeQuery
    * @since 2.1.1
    * @param { XsString } [propertyName] - One or more property name to match. When multiple names are specified, the query matches if any name matches.
    * @param { XsString } [operator] - A comparison operator.  Operators include:  "&lt;" Match range index values less than $value. "&lt;=" Match range index values less than or equal to $value. "&gt;" Match range index values greater than $value. "&gt;=" Match range index values greater than or equal to $value. "=" Match range index values equal to $value. "!=" Match range index values not equal to $value. 
    * @param { XsAnyAtomicType } [value] - One or more property values to match. When multiple values are specified, the query matches if any value matches. The value must be a type for which there is a range index defined.
    * @param { XsString } [options] - Options to this query. The default is ().  Options include:  "collation=URI" Use the range index with the collation specified by URI. If not specified, then the default collation from the query is used. If a range index with the specified collation does not exist, an error is thrown. "cached" Cache the results of this query in the list cache. "uncached" Do not cache the results of this query in the list cache. "cached-incremental" When querying on a short date or dateTime range, break the query into sub-queries on smaller ranges, and then cache the results of each. See the Usage Notes for details. "min-occurs=number" Specifies the minimum number of occurrences required. If fewer that this number of words occur, the fragment does not match. The default is 1. "max-occurs=number" Specifies the maximum number of occurrences required. If more than this number of words occur, the fragment does not match. The default is unbounded. "score-function=function" Use the selected scoring function. The score function may be:  linearUse a linear function of the difference between the specified query value and the matching value in the index to calculate a score for this range query. reciprocalUse a reciprocal function of the difference between the specified query value and the matching value in the index to calculate a score for this range query. zeroThis range query does not contribute to the score. This is the default.   "slope-factor=number" Apply the given number as a scaling factor to the slope of the scoring function. The default is 1.0. "synonym" Specifies that all of the terms in the $value parameter are considered synonyms for scoring purposes. The result is that occurrences of more than one of the synonyms are scored as if there are more occurrences of the same term (as opposed to having a separate term that contributes to score).  
    * @param { XsDouble } [weight] - A weight for this query. The default is 1.0.
    * @returns { CtsQuery }
    */
jsonPropertyRangeQuery(...args) {
    const namer = bldrbase.getNamer(args, 'property-name');
    const paramdefs = [['property-name', [types.XsString], false, true], ['operator', [types.XsString], true, false], ['value', [types.XsAnyAtomicType], false, true], ['options', [types.XsString], false, true], ['weight', [types.XsDouble], false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.jsonPropertyRangeQuery', 3, new Set(['property-name', 'operator', 'value', 'options', 'weight']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.jsonPropertyRangeQuery', 3, false, paramdefs, args);
    return new types.CtsQuery('cts', 'json-property-range-query', checkedArgs);

    }
/**
    * Creates a reference to a JSON property value lexicon, for use as a parameter to cts:value-tuples. Since lexicons are implemented with range indexes, this function will throw an exception if the specified range index does not exist. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.jsonPropertyReference|cts.jsonPropertyReference}
    * @method planBuilder.cts#jsonPropertyReference
    * @since 2.1.1
    * @param { XsString } [property] - A property name.
    * @param { XsString } [options] - Options. The default is ().  Options include:  "type=type" Use the lexicon with the type specified by type (int, unsignedInt, long, unsignedLong, float, double, decimal, dateTime, time, date, gYearMonth, gYear, gMonth, gDay, yearMonthDuration, dayTimeDuration, string, anyURI, point, or long-lat-point) "collation=URI" Use the lexicon with the collation specified by URI. "nullable" Allow null values in tuples reported from cts:value-tuples when using this lexicon. "unchecked" Read the scalar type, collation and coordinate-system info only from the input. Do not check the definition against the context database. "coordinate-system=name" Create a reference to an index or lexicon based on the specified coordinate system. Allowed values: "wgs84", "wgs84/double", "raw", "raw/double". Only applicable if the index/lexicon value type is point or long-lat-point. "precision=value" Create a reference to an index or lexicon configured with the specified geospatial precision. Allowed values: float and double. Only applicable if the index/lexicon value type is point or long-lat-point. This value takes precedence over the precision implicit in the coordinate system name. 
    * @returns { CtsReference }
    */
jsonPropertyReference(...args) {
    const namer = bldrbase.getNamer(args, 'property');
    const paramdefs = [['property', [types.XsString], true, false], ['options', [types.XsString], false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.jsonPropertyReference', 1, new Set(['property', 'options']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.jsonPropertyReference', 1, false, paramdefs, args);
    return new types.CtsReference('cts', 'json-property-reference', checkedArgs);

    }
/**
    * Returns a cts:query matching JSON properties by name with the content constrained by the given cts:query in the second parameter. Searches for matches in the specified property and all of its descendants. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.jsonPropertyScopeQuery|cts.jsonPropertyScopeQuery}
    * @method planBuilder.cts#jsonPropertyScopeQuery
    * @since 2.1.1
    * @param { XsString } [propertyName] - One or more property names to match. When multiple names are specified, the query matches if any name matches.
    * @param { CtsQuery } [query] - A query for the property to match. If a string is entered, the string is treated as a cts:word-query of the specified string.
    * @returns { CtsQuery }
    */
jsonPropertyScopeQuery(...args) {
    const namer = bldrbase.getNamer(args, 'property-name');
    const paramdefs = [['property-name', [types.XsString], false, true], ['query', [types.CtsQuery], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.jsonPropertyScopeQuery', 2, new Set(['property-name', 'query']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.jsonPropertyScopeQuery', 2, false, paramdefs, args);
    return new types.CtsQuery('cts', 'json-property-scope-query', checkedArgs);

    }
/**
    * Returns a query matching JSON properties by name with value equal the given value. For arrays, the query matches if the value of any elements in the array matches the given value. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.jsonPropertyValueQuery|cts.jsonPropertyValueQuery}
    * @method planBuilder.cts#jsonPropertyValueQuery
    * @since 2.1.1
    * @param { XsString } [propertyName] - One or more property names to match. When multiple names are specified, the query matches if any name matches.
    * @param { XsAnyAtomicType } [value] - One or more property values to match. When multiple values are specified, the query matches if any value matches. The values can be strings, numbers or booleans to match correspondingly typed nodes. If the value is the empty sequence, the query matches null.
    * @param { XsString } [options] - Options to this query. The default is ().  Options include:  "case-sensitive" A case-sensitive query. "case-insensitive" A case-insensitive query. "diacritic-sensitive" A diacritic-sensitive query. "diacritic-insensitive" A diacritic-insensitive query. "punctuation-sensitive" A punctuation-sensitive query. "punctuation-insensitive" A punctuation-insensitive query. "whitespace-sensitive" A whitespace-sensitive query. "whitespace-insensitive" A whitespace-insensitive query. "stemmed" A stemmed query. "unstemmed" An unstemmed query. "wildcarded" A wildcarded query. "unwildcarded" An unwildcarded query. "exact" An exact match query. Shorthand for "case-sensitive", "diacritic-sensitive", "punctuation-sensitive", "whitespace-sensitive", "unstemmed", and "unwildcarded".  "lang=iso639code" Specifies the language of the query. The iso639code code portion is case-insensitive, and uses the languages specified by ISO 639. The default is specified in the database configuration. "min-occurs=number" Specifies the minimum number of occurrences required. If fewer that this number of words occur, the fragment does not match. The default is 1. "max-occurs=number" Specifies the maximum number of occurrences required. If more than this number of words occur, the fragment does not match. The default is unbounded. "synonym" Specifies that all of the terms in the $text parameter are considered synonyms for scoring purposes. The result is that occurrences of more than one of the synonyms are scored as if there are more occurrences of the same term (as opposed to having a separate term that contributes to score).  "lexicon-expansion-limit=number" Specifies the limit for lexicon expansion. This puts a restriction on the number of lexicon expansions that can be performed. If the limit is exceeded, the server may raise an error depending on whether the "limit-check" option is set. The default value for this option will be 4096.  "limit-check" Specifies that an error will be raised if the lexicon expansion exceeds the specified limit. "no-limit-check" Specifies that error will not be raised if the lexicon expansion exceeds the specified limit. The server will try to resolve the wildcard.  
    * @param { XsDouble } [weight] - A weight for this query. Higher weights move search results up in the relevance order. The default is 1.0. The weight should be between 64 and -16. Weights greater than 64 will have the same effect as a weight of 64. Weights less than the absolute value of 0.0625 (between -0.0625 and 0.0625) are rounded to 0, which means that they do not contribute to the score.
    * @returns { CtsQuery }
    */
jsonPropertyValueQuery(...args) {
    const namer = bldrbase.getNamer(args, 'property-name');
    const paramdefs = [['property-name', [types.XsString], false, true], ['value', [types.XsAnyAtomicType], false, true], ['options', [types.XsString], false, true], ['weight', [types.XsDouble], false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.jsonPropertyValueQuery', 2, new Set(['property-name', 'value', 'options', 'weight']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.jsonPropertyValueQuery', 2, false, paramdefs, args);
    return new types.CtsQuery('cts', 'json-property-value-query', checkedArgs);

    }
/**
    * Returns a query matching JSON properties by name with text content containing a given phrase. Searches only through immediate text node children of the specified property. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.jsonPropertyWordQuery|cts.jsonPropertyWordQuery}
    * @method planBuilder.cts#jsonPropertyWordQuery
    * @since 2.1.1
    * @param { XsString } [propertyName] - One or more JSON property names to match. When multiple names are specified, the query matches if any name matches.
    * @param { XsString } [text] - Some words or phrases to match. When multiple strings are specified, the query matches if any string matches.
    * @param { XsString } [options] - Options to this query. The default is ().  Options include:  "case-sensitive" A case-sensitive query. "case-insensitive" A case-insensitive query. "diacritic-sensitive" A diacritic-sensitive query. "diacritic-insensitive" A diacritic-insensitive query. "punctuation-sensitive" A punctuation-sensitive query. "punctuation-insensitive" A punctuation-insensitive query. "whitespace-sensitive" A whitespace-sensitive query. "whitespace-insensitive" A whitespace-insensitive query. "stemmed" A stemmed query. "unstemmed" An unstemmed query. "wildcarded" A wildcarded query. "unwildcarded" An unwildcarded query. "exact" An exact match query. Shorthand for "case-sensitive", "diacritic-sensitive", "punctuation-sensitive", "whitespace-sensitive", "unstemmed", and "unwildcarded".  "lang=iso639code" Specifies the language of the query. The iso639code code portion is case-insensitive, and uses the languages specified by ISO 639. The default is specified in the database configuration. "distance-weight=number" A weight applied based on the minimum distance between matches of this query. Higher weights add to the importance of proximity (as opposed to term matches) when the relevance order is calculated. The default value is 0.0 (no impact of proximity). The weight should be between 64 and -16. Weights greater than 64 will have the same effect as a weight of 64. This parameter has no effect if the word positions index is not enabled. This parameter has no effect on searches that use score-simple, score-random, or score-zero (because those scoring algorithms do not consider term frequency, proximity is irrelevant).  "min-occurs=number" Specifies the minimum number of occurrences required. If fewer that this number of words occur, the fragment does not match. The default is 1. "max-occurs=number" Specifies the maximum number of occurrences required. If more than this number of words occur, the fragment does not match. The default is unbounded. "synonym" Specifies that all of the terms in the $text parameter are considered synonyms for scoring purposes. The result is that occurrences of more than one of the synonyms are scored as if there are more occurrences of the same term (as opposed to having a separate term that contributes to score).  "lexicon-expand=value" The value is one of full, prefix-postfix, off, or heuristic (the default is heuristic). An option with a value of lexicon-expand=full specifies that wildcards are resolved by expanding the pattern to words in a lexicon (if there is one available), and turning into a series of cts:word-queries, even if this takes a long time to evaluate. An option with a value of lexicon-expand=prefix-postfix specifies that wildcards are resolved by expanding the pattern to the pre- and postfixes of the words in the word lexicon (if there is one), and turning the query into a series of character queries, even if it takes a long time to evaluate. An option with a value of lexicon-expand=off specifies that wildcards are only resolved by looking up character patterns in the search pattern index, not in the lexicon. An option with a value of lexicon-expand=heuristic, which is the default, specifies that wildcards are resolved by using a series of internal rules, such as estimating the number of lexicon entries that need to be scanned, seeing if the estimate crosses certain thresholds, and (if appropriate), using another way besides lexicon expansion to resolve the query.  * "lexicon-expansion-limit=number" Specifies the limit for lexicon expansion. This puts a restriction on the number of lexicon expansions that can be performed. If the limit is exceeded, the server may raise an error depending on whether the "limit-check" option is set. The default value for this option will be 4096.  "limit-check" Specifies that an error will be raised if the lexicon expansion exceeds the specified limit. "no-limit-check" Specifies that error will not be raised if the lexicon expansion exceeds the specified limit. The server will try to resolve the wildcard.  
    * @param { XsDouble } [weight] - A weight for this query. Higher weights move search results up in the relevance order. The default is 1.0. The weight should be between 64 and -16. Weights greater than 64 will have the same effect as a weight of 64. Weights less than the absolute value of 0.0625 (between -0.0625 and 0.0625) are rounded to 0, which means that they do not contribute to the score.
    * @returns { CtsQuery }
    */
jsonPropertyWordQuery(...args) {
    const namer = bldrbase.getNamer(args, 'property-name');
    const paramdefs = [['property-name', [types.XsString], false, true], ['text', [types.XsString], false, true], ['options', [types.XsString], false, true], ['weight', [types.XsDouble], false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.jsonPropertyWordQuery', 2, new Set(['property-name', 'text', 'options', 'weight']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.jsonPropertyWordQuery', 2, false, paramdefs, args);
    return new types.CtsQuery('cts', 'json-property-word-query', checkedArgs);

    }
/**
    * Returns a geospatial linestring value. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.linestring|cts.linestring}
    * @method planBuilder.cts#linestring
    * @since 2.1.1
    * @param { XsAnyAtomicType } [vertices] - The waypoints of the linestring, given in order. vertexes.
    * @returns { CtsLinestring }
    */
linestring(...args) {
    const paramdef = ['vertices', [types.XsAnyAtomicType, PlanColumn, PlanParam], false, true];
    const checkedArgs = bldrbase.makeSingleArgs('cts.linestring', 1, paramdef, args);
    return new types.CtsLinestring('cts', 'linestring', checkedArgs);
    }
/**
    * Returns a query that matches all documents where query matches document-locks. When searching documents or document-properties, cts:locks-fragment-query provides a convenient way to additionally constrain the search against document-locks fragments. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.locksFragmentQuery|cts.locksFragmentQuery}
    * @method planBuilder.cts#locksFragmentQuery
    * @since 2.1.1
    * @param { CtsQuery } [query] - A query to be matched against the locks fragment.
    * @returns { CtsQuery }
    */
locksFragmentQuery(...args) {
    const paramdef = ['query', [types.CtsQuery], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('cts.locksFragmentQuery', 1, paramdef, args);
    return new types.CtsQuery('cts', 'locks-fragment-query', checkedArgs);
    }
/**
    * Returns only documents before LSQT or a timestamp before LSQT for stable query results. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.lsqtQuery|cts.lsqtQuery}
    * @method planBuilder.cts#lsqtQuery
    * @since 2.1.1
    * @param { XsString } [temporalCollection] - The name of the temporal collection.
    * @param { XsDateTime } [timestamp] - Return only temporal documents with a system start time less than or equal to this value. Default is temporal:get-lsqt($temporal-collection). Timestamps larger than LSQT are rejected.
    * @param { XsString } [options] - Options to this query. The default is ().  Options include:  "cached" Cache the results of this query in the list cache. "uncached" Do not cache the results of this query in the list cache. "cached-incremental" Break down the query into sub-queries and then cache each one of them for better performance. This is enabled, by default. "score-function=function" Use the selected scoring function. The score function may be:  linearUse a linear function of the difference between the specified query value and the matching value in the index to calculate a score for this range query. reciprocalUse a reciprocal function of the difference between the specified query value and the matching value in the index to calculate a score for this range query. zeroThis range query does not contribute to the score. This is the default.   "slope-factor=number" Apply the given number as a scaling factor to the slope of the scoring function. The default is 1.0. 
    * @param { XsDouble } [weight] - A weight for this query. Higher weights move search results up in the relevance order. The default is 1.0. The weight should be between 64 and -16. Weights greater than 64 will have the same effect as a weight of 64. Weights less than the absolute value of 0.0625 (between -0.0625 and 0.0625) are rounded to 0, which means that they do not contribute to the score.
    * @returns { CtsQuery }
    */
lsqtQuery(...args) {
    const namer = bldrbase.getNamer(args, 'temporal-collection');
    const paramdefs = [['temporal-collection', [types.XsString], true, false], ['timestamp', [types.XsDateTime], false, false], ['options', [types.XsString], false, true], ['weight', [types.XsDouble], false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.lsqtQuery', 1, new Set(['temporal-collection', 'timestamp', 'options', 'weight']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.lsqtQuery', 1, false, paramdefs, args);
    return new types.CtsQuery('cts', 'lsqt-query', checkedArgs);

    }
/**
    * Returns a query matching all of the specified queries, where the matches occur within the specified distance from each other. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.nearQuery|cts.nearQuery}
    * @method planBuilder.cts#nearQuery
    * @since 2.1.1
    * @param { CtsQuery } [queries] - A sequence of queries to match.
    * @param { XsDouble } [distance] - A distance, in number of words, between any two matching queries. The results match if two queries match and the distance between the two matches is equal to or less than the specified distance. A distance of 0 matches when the text is the exact same text or when there is overlapping text (see the third example below). A negative distance is treated as 0. The default value is 10.
    * @param { XsString } [options] - Options to this query. The default value is ().  Options include:  "ordered" Any near-query matches must occur in the order of the specified sub-queries. "unordered" Any near-query matches will satisfy the query, regardless of the order they were specified.  "minimum-distance" The minimum distance between two matching queries. The results match if the two queries match and the minimum distance between the two matches is greater than or equal to the specified minimum distance. The default value is zero. A negative distance is treated as 0.  
    * @param { XsDouble } [weight] - A weight attributed to the distance for this query. Higher weights add to the importance of distance (as opposed to term matches) when the relevance order is calculated. The default value is 1.0. The weight should be between 64 and -16. Weights greater than 64 will have the same effect as a weight of 64. Weights less than the absolute value of 0.0625 (between -0.0625 and 0.0625) are rounded to 0, which means that they do not contribute to the score. This parameter has no effect if the word positions index is not enabled.
    * @returns { CtsQuery }
    */
nearQuery(...args) {
    const namer = bldrbase.getNamer(args, 'queries');
    const paramdefs = [['queries', [types.CtsQuery], false, true], ['distance', [types.XsDouble], false, false], ['options', [types.XsString], false, true], ['weight', [types.XsDouble], false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.nearQuery', 1, new Set(['queries', 'distance', 'options', 'weight']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.nearQuery', 1, false, paramdefs, args);
    return new types.CtsQuery('cts', 'near-query', checkedArgs);

    }
/**
    * Returns a query matching the first sub-query, where those matches do not occur within 0 distance of the other query. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.notInQuery|cts.notInQuery}
    * @method planBuilder.cts#notInQuery
    * @since 2.1.1
    * @param { CtsQuery } [positiveQuery] - A positive query, specifying the search results filtered in.
    * @param { CtsQuery } [negativeQuery] - A negative query, specifying the search results to filter out.
    * @returns { CtsQuery }
    */
notInQuery(...args) {
    const namer = bldrbase.getNamer(args, 'positive-query');
    const paramdefs = [['positive-query', [types.CtsQuery], true, false], ['negative-query', [types.CtsQuery], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.notInQuery', 2, new Set(['positive-query', 'negative-query']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.notInQuery', 2, false, paramdefs, args);
    return new types.CtsQuery('cts', 'not-in-query', checkedArgs);

    }
/**
    * Returns a query specifying the matches not specified by its sub-query. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.notQuery|cts.notQuery}
    * @method planBuilder.cts#notQuery
    * @since 2.1.1
    * @param { CtsQuery } [query] - A negative query, specifying the search results to filter out.
    * @returns { CtsQuery }
    */
notQuery(...args) {
    const paramdef = ['query', [types.CtsQuery], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('cts.notQuery', 1, paramdef, args);
    return new types.CtsQuery('cts', 'not-query', checkedArgs);
    }
/**
    * Returns a query specifying the union of the matches specified by the sub-queries. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.orQuery|cts.orQuery}
    * @method planBuilder.cts#orQuery
    * @since 2.1.1
    * @param { CtsQuery } [queries] - A sequence of sub-queries.
    * @param { XsString } [options] - Options to this query. The default is ().  Options include:   "synonym" Specifies that all of the terms in the $queries parameter are considered synonyms for scoring purposes. The result is that occurrences of more than one of the synonyms are scored as if there are more occurrences of the same term (as opposed to having a separate term that contributes to score).  
    * @returns { CtsQuery }
    */
orQuery(...args) {
    const namer = bldrbase.getNamer(args, 'queries');
    const paramdefs = [['queries', [types.CtsQuery], false, true], ['options', [types.XsString], false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.orQuery', 1, new Set(['queries', 'options']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.orQuery', 1, false, paramdefs, args);
    return new types.CtsQuery('cts', 'or-query', checkedArgs);

    }
/**
    * Returns the part of speech for a cts:token, if any. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.partOfSpeech|cts.partOfSpeech}
    * @method planBuilder.cts#partOfSpeech
    * @since 2.1.1
    * @param { XsString } [token] - A token, as returned from cts:tokenize.
    * @returns { XsString }
    */
partOfSpeech(...args) {
    const paramdef = ['token', [types.XsString, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('cts.partOfSpeech', 1, paramdef, args);
    return new types.XsString('cts', 'part-of-speech', checkedArgs);
    }
/**
    * Returns a query matching path expressions whose content represents a point contained within the given geographic box, circle, or polygon, or equal to the given point. Points that lie between the southern boundary and the northern boundary of a box, travelling northwards, and between the western boundary and the eastern boundary of the box, travelling eastwards, will match. Points contained within the given radius of the center point of a circle will match, using the curved distance on the surface of the Earth. Points contained within the given polygon will match, using great circle arcs over a spherical model of the Earth as edges. An error may result if the polygon is malformed in some way. Points equal to the a given point will match, taking into account the fact that longitudes converge at the poles. Using the geospatial query constructors requires a valid geospatial license key; without a valid license key, searches that include geospatial queries will throw an exception. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.pathGeospatialQuery|cts.pathGeospatialQuery}
    * @method planBuilder.cts#pathGeospatialQuery
    * @since 2.1.1
    * @param { XsString } [pathExpression] - One or more path expressions to match. When multiple path expressions are specified, the query matches if any path expression matches.
    * @param { CtsRegion } [region] - One or more geographic boxes, circles, polygons, or points. Where multiple regions are specified, the query matches if any region matches.
    * @param { XsString } [options] - Options to this query. The default is (). Options include:   "coordinate-system=string" Use the given coordinate system. Valid values are:  wgs84The WGS84 coordinate system. wgs84/doubleThe WGS84 coordinate system at double precision. etrs89The ETRS89 coordinate system. etrs89/doubleThe ETRS89 coordinate system at double precision. rawThe raw (unmapped) coordinate system. raw/doubleThe raw coordinate system at double precision.   "precision=value" Use the coordinate system at the given precision. Allowed values: float and double. "units=value" Measure distance and the radii of circles in the specified units. Allowed values: miles (default), km, feet, meters. "boundaries-included" Points on boxes', circles', and polygons' boundaries are counted as matching. This is the default. "boundaries-excluded" Points on boxes', circles', and polygons' boundaries are not counted as matching. "boundaries-latitude-excluded" Points on boxes' latitude boundaries are not counted as matching. "boundaries-longitude-excluded" Points on boxes' longitude boundaries are not counted as matching. "boundaries-south-excluded" Points on the boxes' southern boundaries are not counted as matching. "boundaries-west-excluded" Points on the boxes' western boundaries are not counted as matching. "boundaries-north-excluded" Points on the boxes' northern boundaries are not counted as matching. "boundaries-east-excluded" Points on the boxes' eastern boundaries are not counted as matching. "boundaries-circle-excluded" Points on circles' boundary are not counted as matching. "boundaries-endpoints-excluded" Points on linestrings' boundary (the endpoints) are not counted as matching. "cached" Cache the results of this query in the list cache. "uncached" Do not cache the results of this query in the list cache. "type=long-lat-point" Specifies the format for the point in the data as longitude first, latitude second. "type=point" Specifies the format for the point in the data as latitude first, longitude second. This is the default format. "score-function=function" Use the selected scoring function. The score function may be:  linearUse a linear function of the difference between the specified query value and the matching value in the index to calculate a score for this range query. reciprocalUse a reciprocal function of the difference between the specified query value and the matching value in the index to calculate a score for this range query. zeroThis range query does not contribute to the score. This is the default.   "slope-factor=number" Apply the given number as a scaling factor to the slope of the scoring function. The default is 1.0. "synonym" Specifies that all of the terms in the $regions parameter are considered synonyms for scoring purposes. The result is that occurrences of more than one of the synonyms are scored as if there are more occurrence of the same term (as opposed to having a separate term that contributes to score).  
    * @param { XsDouble } [weight] - A weight for this query. The default is 1.0.
    * @returns { CtsQuery }
    */
pathGeospatialQuery(...args) {
    const namer = bldrbase.getNamer(args, 'path-expression');
    const paramdefs = [['path-expression', [types.XsString], false, true], ['region', [types.CtsRegion], false, true], ['options', [types.XsString], false, true], ['weight', [types.XsDouble], false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.pathGeospatialQuery', 2, new Set(['path-expression', 'region', 'options', 'weight']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.pathGeospatialQuery', 2, false, paramdefs, args);
    return new types.CtsQuery('cts', 'path-geospatial-query', checkedArgs);

    }
/**
    * Returns a cts:query matching documents where the content addressed by an XPath expression satisfies the specified relationship (=, &lt;, &gt;, etc.) with respect to the input criteria values. A path range index must exist for each path when you perform a search. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.pathRangeQuery|cts.pathRangeQuery}
    * @method planBuilder.cts#pathRangeQuery
    * @since 2.1.1
    * @param { XsString } [pathName] - One or more XPath expressions that identify the content to match. When multiple paths are specified, the query matches if any path matches.
    * @param { XsString } [operator] - A comparison operator.  Operators include:  "&lt;" Match range index values less than $value. "&lt;=" Match range index values less than or equal to $value. "&gt;" Match range index values greater than $value. "&gt;=" Match range index values greater than or equal to $value. "=" Match range index values equal to $value. "!=" Match range index values not equal to $value. 
    * @param { XsAnyAtomicType } [value] - One or more values to match. These values are compared to the value(s) addressed by the path-expression parameter. When multiple When multiple values are specified, the query matches if any value matches. The value must be a type for which there is a range index defined.
    * @param { XsString } [options] - Options to this query. The default is ().  Options include:  "collation=URI" Use the range index with the collation specified by URI. If not specified, then the default collation from the query is used. If a range index with the specified collation does not exist, an error is thrown. "cached" Cache the results of this query in the list cache. "uncached" Do not cache the results of this query in the list cache. "cached-incremental" When querying on a short date or dateTime range, break the query into sub-queries on smaller ranges, and then cache the results of each. See the Usage Notes for details. "min-occurs=number" Specifies the minimum number of occurrences required. If fewer that this number of words occur, the fragment does not match. The default is 1. "max-occurs=number" Specifies the maximum number of occurrences required. If more than this number of words occur, the fragment does not match. The default is unbounded. "score-function=function" Use the selected scoring function. The score function may be:  linearUse a linear function of the difference between the specified query value and the matching value in the index to calculate a score for this range query. reciprocalUse a reciprocal function of the difference between the specified query value and the matching value in the index to calculate a score for this range query. zeroThis range query does not contribute to the score. This is the default.   "slope-factor=number" Apply the given number as a scaling factor to the slope of the scoring function. The default is 1.0. "synonym" Specifies that all of the terms in the $value parameter are considered synonyms for scoring purposes. The result is that occurrences of more than one of the synonyms are scored as if there are more occurrences of the same term (as opposed to having a separate term that contributes to score).  
    * @param { XsDouble } [weight] - A weight for this query. The default is 1.0.
    * @returns { CtsQuery }
    */
pathRangeQuery(...args) {
    const namer = bldrbase.getNamer(args, 'path-name');
    const paramdefs = [['path-name', [types.XsString], false, true], ['operator', [types.XsString], true, false], ['value', [types.XsAnyAtomicType], false, true], ['options', [types.XsString], false, true], ['weight', [types.XsDouble], false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.pathRangeQuery', 3, new Set(['path-name', 'operator', 'value', 'options', 'weight']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.pathRangeQuery', 3, false, paramdefs, args);
    return new types.CtsQuery('cts', 'path-range-query', checkedArgs);

    }
/**
    * Creates a reference to a path value lexicon, for use as a parameter to cts:value-tuples. Since lexicons are implemented with range indexes, this function will throw an exception if the specified range index does not exist. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.pathReference|cts.pathReference}
    * @method planBuilder.cts#pathReference
    * @since 2.1.1
    * @param { XsString } [pathExpression] - A path range index expression.
    * @param { XsString } [options] - Options. The default is ().  Options include:  "type=type" Use the lexicon with the type specified by type (int, unsignedInt, long, unsignedLong, float, double, decimal, dateTime, time, date, gYearMonth, gYear, gMonth, gDay, yearMonthDuration, dayTimeDuration, string, anyURI, point, or long-lat-point) "collation=URI" Use the lexicon with the collation specified by URI. "nullable" Allow null values in tuples reported from cts:value-tuples when using this lexicon. "unchecked" Read the scalar type, collation and coordinate-system info only from the input. Do not check the definition against the context database. "coordinate-system=name" Create a reference to an index or lexicon based on the specified coordinate system. Allowed values: "wgs84", "wgs84/double", "raw", "raw/double". Only applicable if the index/lexicon value type is point or long-lat-point. "precision=value" Create a reference to an index or lexicon configured with the specified geospatial precision. Allowed values: float and double. Only applicable if the index/lexicon value type is point or long-lat-point. This value takes precedence over the precision implicit in the coordinate system name. 
    * @param { MapMap } [map] - A map of namespace bindings. The keys should be namespace prefixes and the values should be namespace URIs. These namespace bindings will be added to the in-scope namespace bindings in the interpretation of the path.
    * @returns { CtsReference }
    */
pathReference(...args) {
    const namer = bldrbase.getNamer(args, 'path-expression');
    const paramdefs = [['path-expression', [types.XsString], true, false], ['options', [types.XsString], false, true], ['map', [types.MapMap], false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.pathReference', 1, new Set(['path-expression', 'options', 'map']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.pathReference', 1, false, paramdefs, args);
    return new types.CtsReference('cts', 'path-reference', checkedArgs);

    }
/**
    * Creates a period value, for use as a parameter to cts:period-range-query or cts:period-compare-query. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.period|cts.period}
    * @method planBuilder.cts#period
    * @since 2.1.1
    * @param { XsDateTime } [start] - The dateTime value indicating start of the period.
    * @param { XsDateTime } [end] - The dateTime value indicating end of the period.
    * @returns { CtsPeriod }
    */
period(...args) {
    const namer = bldrbase.getNamer(args, 'start');
    const paramdefs = [['start', [types.XsDateTime, PlanColumn, PlanParam], true, false], ['end', [types.XsDateTime, PlanColumn, PlanParam], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.period', 2, new Set(['start', 'end']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.period', 2, false, paramdefs, args);
    return new types.CtsPeriod('cts', 'period', checkedArgs);

    }
/**
    * Returns a cts:query matching documents that have relevant pair of period values. Searches with the cts:period-compare-query constructor require two valid names of period, if the either of the specified period does not exist, then an exception is thrown. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.periodCompareQuery|cts.periodCompareQuery}
    * @method planBuilder.cts#periodCompareQuery
    * @since 2.1.1
    * @param { XsString } [axis1] - Name of the first axis to compare
    * @param { XsString } [operator] - A comparison operator. Period is the two timestamps contained in the axis.  Operators include:  "aln_equals" Match documents whose period1 equals period2. "aln_contains" Match documents whose period1 contains period2. i.e. period1 starts before period2 starts and ends before period2 ends. "aln_contained_by" Match documents whose period1 is contained by period2. "aln_meets" Match documents whose period1 meets period2, i.e. period1 ends at period2 start. "aln_met_by" Match documents whose period1 meets period2, i.e. period1 starts at period2 end. "aln_before" Match documents whose period1 is before period2, i.e. period1 ends before period2 starts. "aln_after" Match documents whose period1 is after period2, i.e. period1 starts after period2 ends. "aln_starts" Match documents whose period1 starts period2, i.e. period1 starts at period2 start and ends before period2 ends. "aln_started_by" Match documents whose period2 starts period1, i.e. period1 starts at period2 start and ends after period2 ends. "aln_finishes" Match documents whose period1 finishes period2, i.e. period1 finishes at period2 finish and starts after period2 starts. "aln_finished_by" Match documents whose period2 finishes period1, i.e. period1 finishes at period2 finish and starts before period2 starts. "aln_overlaps" Match documents whose period1 overlaps period2, i.e. period1 starts before period2 start and ends before period2 ends but after period2 starts. "aln_overlapped_by" Match documents whose period2 overlaps period1, i.e. period1 starts after period2 start but before period2 ends and ends after period2 ends. "iso_contains" Match documents whose period1 contains period2 in sql 2011 standard. i.e. period1 starts before or at period2 starts and ends after or at period2 ends. "iso_overlaps" Match documents whose period1 overlaps period2 in sql 2011 standard. i.e. period1 and period2 have common time period. "iso_succeeds" Match documents whose period1 succeeds period2 in sql 2011 standard. i.e. period1 starts at or after period2 ends "iso_precedes" Match documents whose period1 precedes period2 in sql 2011 standard. i.e. period1 ends at or before period2 ends "iso_succeeds" Match documents whose period1 succeeds period2 in sql 2011 standard. i.e. period1 starts at or after period2 ends "iso_precedes" Match documents whose period1 precedes period2 in sql 2011 standard. i.e. period1 ends at or before period2 ends "iso_imm_succeeds" Match documents whose period1 immediately succeeds period2 in sql 2011 standard. i.e. period1 starts at period2 ends "iso_imm_precedes" Match documents whose period1 immediately precedes period2 in sql 2011 standard. i.e. period1 ends at period2 ends 
    * @param { XsString } [axis2] - Name of the second period to compare
    * @param { XsString } [options] - Options to this query. The default is ().  Options include:  "cached" Cache the results of this query in the list cache. "uncached" Do not cache the results of this query in the list cache. 
    * @returns { CtsQuery }
    */
periodCompareQuery(...args) {
    const namer = bldrbase.getNamer(args, 'axis-1');
    const paramdefs = [['axis-1', [types.XsString], true, false], ['operator', [types.XsString], true, false], ['axis-2', [types.XsString], true, false], ['options', [types.XsString], false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.periodCompareQuery', 3, new Set(['axis-1', 'operator', 'axis-2', 'options']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.periodCompareQuery', 3, false, paramdefs, args);
    return new types.CtsQuery('cts', 'period-compare-query', checkedArgs);

    }
/**
    * Returns a cts:query matching axis by name with a period value with an operator. Searches with the cts:period-range-query constructor require a axis definition on the axis name; if there is no axis configured, then an exception is thrown. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.periodRangeQuery|cts.periodRangeQuery}
    * @method planBuilder.cts#periodRangeQuery
    * @since 2.1.1
    * @param { XsString } [axis] - One or more axis to match on.
    * @param { XsString } [operator] - A comparison operator.  Operators include:  "aln_equals" Match documents whose period1 equals value. "aln_contains" Match documents whose period1 contains value. i.e. period1 starts before value starts and ends before value ends. "aln_contained_by" Match documents whose period1 is contained by value. "aln_meets" Match documents whose period1 meets value, i.e. period1 ends at value start. "aln_met_by" Match documents whose period1 meets value, i.e. period1 starts at value end. "aln_before" Match documents whose period1 is before value, i.e. period1 ends before value starts. "aln_after" Match documents whose period1 is after value, i.e. period1 starts after value ends. "aln_starts" Match documents whose period1 starts value, i.e. period1 starts at value start and ends before value ends. "aln_started_by" Match documents whose value starts period1, i.e. period1 starts at value start and ends after value ends. "aln_finishes" Match documents whose period1 finishes value, i.e. period1 finishes at value finish and starts after value starts. "aln_finished_by" Match documents whose value finishes period1, i.e. period1 finishes at value finish and starts before value starts. "aln_overlaps" Match documents whose period1 overlaps value, i.e. period1 starts before value start and ends before value ends but after value starts. "aln_overlapped_by" Match documents whose value overlaps period1, i.e. period1 starts after value start but before value ends and ends after value ends. "iso_contains" Match documents whose period1 contains value in sql 2011 standard. i.e. period1 starts before or at value starts and ends after or at value ends. "iso_overlaps" Match documents whose period1 overlaps value in sql 2011 standard. i.e. period1 and value have common time period. "iso_succeeds" Match documents whose period1 succeeds value in sql 2011 standard. i.e. period1 starts at or after value ends "iso_precedes" Match documents whose period1 precedes value in sql 2011 standard. i.e. period1 ends at or before value ends "iso_imm_succeeds" Match documents whose period1 immediately succeeds value in sql 2011 standard. i.e. period1 starts at value end "iso_imm_precedes" Match documents whose period1 immediately precedes value in sql 2011 standard. i.e. period1 ends at value end 
    * @param { CtsPeriod } [period] - the cts:period to perform operations on. When multiple values are specified, the query matches if any value matches.
    * @param { XsString } [options] - Options to this query. The default is ().  Options include:  "cached" Cache the results of this query in the list cache. "uncached" Do not cache the results of this query in the list cache. "min-occurs=number" Specifies the minimum number of occurrences required. If fewer that this number of words occur, the fragment does not match. The default is 1. "max-occurs=number" Specifies the maximum number of occurrences required. If more than this number of words occur, the fragment does not match. The default is unbounded. "score-function=function" Use the selected scoring function. The score function may be:  linearUse a linear function of the difference between the specified query value and the matching value in the index to calculate a score for this range query. reciprocalUse a reciprocal function of the difference between the specified query value and the matching value in the index to calculate a score for this range query.  zeroThis range query does not contribute to the score. This is the default.  "slope-factor=number" Apply the given number as a scaling factor to the slope of the scoring function. The default is 1.0. 
    * @returns { CtsQuery }
    */
periodRangeQuery(...args) {
    const namer = bldrbase.getNamer(args, 'axis');
    const paramdefs = [['axis', [types.XsString], false, true], ['operator', [types.XsString], true, false], ['period', [types.CtsPeriod], false, true], ['options', [types.XsString], false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.periodRangeQuery', 2, new Set(['axis', 'operator', 'period', 'options']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.periodRangeQuery', 2, false, paramdefs, args);
    return new types.CtsQuery('cts', 'period-range-query', checkedArgs);

    }
/**
    * Returns a point value. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.point|cts.point}
    * @method planBuilder.cts#point
    * @since 2.1.1
    * @param { XsDouble } [latitude] - The latitude of the point.
    * @param { XsDouble } [longitude] - The longitude of the point.
    * @returns { CtsPoint }
    */
point(...args) {
    const namer = bldrbase.getNamer(args, 'latitude');
    const paramdefs = [['latitude', [types.XsDouble, PlanColumn, PlanParam], true, false], ['longitude', [types.XsDouble, PlanColumn, PlanParam], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.point', 2, new Set(['latitude', 'longitude']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.point', 2, false, paramdefs, args);
    return new types.CtsPoint('cts', 'point', checkedArgs);

    }
/**
    * Returns a point's latitude value. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.pointLatitude|cts.pointLatitude}
    * @method planBuilder.cts#pointLatitude
    * @since 2.1.1
    * @param { CtsPoint } [point] - The point.
    * @returns { XsNumeric }
    */
pointLatitude(...args) {
    const paramdef = ['point', [types.CtsPoint, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('cts.pointLatitude', 1, paramdef, args);
    return new types.XsNumeric('cts', 'point-latitude', checkedArgs);
    }
/**
    * Returns a point's longitude value. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.pointLongitude|cts.pointLongitude}
    * @method planBuilder.cts#pointLongitude
    * @since 2.1.1
    * @param { CtsPoint } [point] - The point.
    * @returns { XsNumeric }
    */
pointLongitude(...args) {
    const paramdef = ['point', [types.CtsPoint, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('cts.pointLongitude', 1, paramdef, args);
    return new types.XsNumeric('cts', 'point-longitude', checkedArgs);
    }
/**
    * Returns a geospatial polygon value. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.polygon|cts.polygon}
    * @method planBuilder.cts#polygon
    * @since 2.1.1
    * @param { CtsPoint } [vertices] - The vertices of the polygon, given in order. No edge may cover more than 180 degrees of either latitude or longitude. The polygon as a whole may not encompass both poles. These constraints are necessary to ensure an unambiguous interpretation of the polygon. There must be at least three vertices. The first vertex should be identical to the last vertex to close the polygon. vertexes.
    * @returns { CtsPolygon }
    */
polygon(...args) {
    const paramdef = ['vertices', [types.CtsPoint, PlanColumn, PlanParam], false, true];
    const checkedArgs = bldrbase.makeSingleArgs('cts.polygon', 1, paramdef, args);
    return new types.CtsPolygon('cts', 'polygon', checkedArgs);
    }
/**
    * Returns a query that matches all documents where query matches document-properties. When searching documents or document-locks, this query type provides a convenient way to additionally constrain the search against document-properties fragments. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.propertiesFragmentQuery|cts.propertiesFragmentQuery}
    * @method planBuilder.cts#propertiesFragmentQuery
    * @since 2.1.1
    * @param { CtsQuery } [query] - A query to be matched against the properties fragment.
    * @returns { CtsQuery }
    */
propertiesFragmentQuery(...args) {
    const paramdef = ['query', [types.CtsQuery], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('cts.propertiesFragmentQuery', 1, paramdef, args);
    return new types.CtsQuery('cts', 'properties-fragment-query', checkedArgs);
    }
/**
    * Returns a cts:query matching specified nodes with a range-index entry compared to a given value. Searches with the cts:range-query constructor require a range index; if there is no range index configured, then an exception is thrown. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.rangeQuery|cts.rangeQuery}
    * @method planBuilder.cts#rangeQuery
    * @since 2.1.1
    * @param { CtsReference } [index] - One or more range index references. When multiple indexes are specified, the query matches if any index matches.
    * @param { XsString } [operator] - A comparison operator.  Operators include:  "&lt;" Match range index values less than $value. "&lt;=" Match range index values less than or equal to $value. "&gt;" Match range index values greater than $value. "&gt;=" Match range index values greater than or equal to $value. "=" Match range index values equal to $value. "!=" Match range index values not equal to $value. 
    * @param { XsAnyAtomicType } [value] - One or more values to match. When multiple values are specified, the query matches if any value matches.
    * @param { XsString } [options] - Options to this query. The default is ().  Options include:  "cached" Cache the results of this query in the list cache. "uncached" Do not cache the results of this query in the list cache. "min-occurs=number" Specifies the minimum number of occurrences required. If fewer that this number of words occur, the fragment does not match. The default is 1. "max-occurs=number" Specifies the maximum number of occurrences required. If more than this number of words occur, the fragment does not match. The default is unbounded. "score-function=function" Use the selected scoring function. The score function may be:  linearUse a linear function of the difference between the specified query value and the matching value in the index to calculate a score for this range query. reciprocalUse a reciprocal function of the difference between the specified query value and the matching value in the index to calculate a score for this range query. zeroThis range query does not contribute to the score. This is the default.   "slope-factor=number" Apply the given number as a scaling factor to the slope of the scoring function. The default is 1.0. "synonym" Specifies that all of the terms in the $value parameter are considered synonyms for scoring purposes. The result is that occurrences of more than one of the synonyms are scored as if there are more occurrences of the same term (as opposed to having a separate term that contributes to score).  
    * @param { XsDouble } [weight] - A weight for this query. The default is 1.0.
    * @returns { CtsQuery }
    */
rangeQuery(...args) {
    const namer = bldrbase.getNamer(args, 'index');
    const paramdefs = [['index', [types.CtsReference], false, true], ['operator', [types.XsString], true, false], ['value', [types.XsAnyAtomicType], false, true], ['options', [types.XsString], false, true], ['weight', [types.XsDouble], false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.rangeQuery', 3, new Set(['index', 'operator', 'value', 'options', 'weight']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.rangeQuery', 3, false, paramdefs, args);
    return new types.CtsQuery('cts', 'range-query', checkedArgs);

    }
/**
    * Returns the stem(s) for a word. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.stem|cts.stem}
    * @method planBuilder.cts#stem
    * @since 2.1.1
    * @param { XsString } [text] - A word or phrase to stem.
    * @param { XsString } [language] - A language to use for stemming. If not supplied, it uses the database default language.
    * @param { XsString } [partOfSpeech] - A part of speech to use for stemming. The default is the unspecified part of speech. This parameter is for testing custom stemmers.
    * @returns { XsString }
    */
stem(...args) {
    const namer = bldrbase.getNamer(args, 'text');
    const paramdefs = [['text', [types.XsString, PlanColumn, PlanParam], true, false], ['language', [types.XsString, PlanColumn, PlanParam], false, false], ['partOfSpeech', [types.XsString, PlanColumn, PlanParam], false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.stem', 1, new Set(['text', 'language', 'partOfSpeech']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.stem', 1, false, paramdefs, args);
    return new types.XsString('cts', 'stem', checkedArgs);

    }
/**
    * Tokenizes text into words, punctuation, and spaces. Returns output in the type cts:token, which has subtypes cts:word, cts:punctuation, and cts:space, all of which are subtypes of xs:string. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.tokenize|cts.tokenize}
    * @method planBuilder.cts#tokenize
    * @since 2.1.1
    * @param { XsString } [text] - A word or phrase to tokenize.
    * @param { XsString } [language] - A language to use for tokenization. If not supplied, it uses the database default language.
    * @param { XsString } [field] - A field to use for tokenization. If the field has custom tokenization rules, they will be used. If no field is supplied or the field has no custom tokenization rules, the default tokenization rules are used.
    * @returns { XsString }
    */
tokenize(...args) {
    const namer = bldrbase.getNamer(args, 'text');
    const paramdefs = [['text', [types.XsString, PlanColumn, PlanParam], true, false], ['language', [types.XsString, PlanColumn, PlanParam], false, false], ['field', [types.XsString, PlanColumn, PlanParam], false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.tokenize', 1, new Set(['text', 'language', 'field']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.tokenize', 1, false, paramdefs, args);
    return new types.XsString('cts', 'tokenize', checkedArgs);

    }
/**
    * Returns a cts:query matching triples with a triple index entry equal to the given values. Searches with the cts:triple-range-query constructor require the triple index; if the triple index is not configured, then an exception is thrown. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.tripleRangeQuery|cts.tripleRangeQuery}
    * @method planBuilder.cts#tripleRangeQuery
    * @since 2.1.1
    * @param { XsAnyAtomicType } [subject] - The subjects to look up. When multiple values are specified, the query matches if any value matches. When the empty sequence is specified, then triples with any subject are matched.
    * @param { XsAnyAtomicType } [predicate] - The predicates to look up. When multiple values are specified, the query matches if any value matches. When the empty sequence is specified, then triples with any predicate are matched.
    * @param { XsAnyAtomicType } [object] - The objects to look up. When multiple values are specified, the query matches if any value matches. When the empty sequence is specified, then triples with any object are matched.
    * @param { XsString } [operator] - If a single string is provided it is treated as the operator for the $object values. If a sequence of three strings are provided, they give the operators for $subject, $predicate and $object in turn. The default operator is "=".  Operators include:  "sameTerm" Match triple index values which are the same RDF term as $value. This compares aspects of values that are ignored in XML Schema comparison semantics, like timezone and derived type of $value. "&lt;" Match range index values less than $value. "&lt;=" Match range index values less than or equal to $value. "&gt;" Match range index values greater than $value. "&gt;=" Match range index values greater than or equal to $value. "=" Match range index values equal to $value. "!=" Match range index values not equal to $value. 
    * @param { XsString } [options] - Options to this query. The default is ().  Options include:  "cached" Cache the results of this query in the list cache. "uncached" Do not cache the results of this query in the list cache. "score-function=function" Use the selected scoring function. The score function may be:  linearUse a linear function of the difference between the specified query value and the matching value in the index to calculate a score for this range query. reciprocalUse a reciprocal function of the difference between the specified query value and the matching value in the index to calculate a score for this range query. zeroThis range query does not contribute to the score. This is the default.   "slope-factor=number" Apply the given number as a scaling factor to the slope of the scoring function. The default is 1.0. 
    * @param { XsDouble } [weight] - A weight for this query. The default is 1.0.
    * @returns { CtsQuery }
    */
tripleRangeQuery(...args) {
    const namer = bldrbase.getNamer(args, 'subject');
    const paramdefs = [['subject', [types.XsAnyAtomicType], false, true], ['predicate', [types.XsAnyAtomicType], false, true], ['object', [types.XsAnyAtomicType], false, true], ['operator', [types.XsString], false, true], ['options', [types.XsString], false, true], ['weight', [types.XsDouble], false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.tripleRangeQuery', 3, new Set(['subject', 'predicate', 'object', 'operator', 'options', 'weight']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.tripleRangeQuery', 3, false, paramdefs, args);
    return new types.CtsQuery('cts', 'triple-range-query', checkedArgs);

    }
/**
    * Returns a query that matches all fragments. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.trueQuery|cts.trueQuery}
    * @method planBuilder.cts#trueQuery
    * @since 2.1.1

    * @returns { CtsQuery }
    */
trueQuery(...args) {
    bldrbase.checkMaxArity('cts.trueQuery', args.length, 0);
    return new types.CtsQuery('cts', 'true-query', args);
    }
/**
    * Creates a reference to the URI lexicon, for use as a parameter to cts:value-tuples. This function requires the URI lexicon to be enabled, otherwise it throws an exception. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.uriReference|cts.uriReference}
    * @method planBuilder.cts#uriReference
    * @since 2.1.1

    * @returns { CtsReference }
    */
uriReference(...args) {
    bldrbase.checkMaxArity('cts.uriReference', args.length, 0);
    return new types.CtsReference('cts', 'uri-reference', args);
    }
/**
    * Returns a query matching text content containing a given phrase. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.wordQuery|cts.wordQuery}
    * @method planBuilder.cts#wordQuery
    * @since 2.1.1
    * @param { XsString } [text] - Some words or phrases to match. When multiple strings are specified, the query matches if any string matches.
    * @param { XsString } [options] - Options to this query. The default is ().  Options include:  "case-sensitive" A case-sensitive query. "case-insensitive" A case-insensitive query. "diacritic-sensitive" A diacritic-sensitive query. "diacritic-insensitive" A diacritic-insensitive query. "punctuation-sensitive" A punctuation-sensitive query. "punctuation-insensitive" A punctuation-insensitive query. "whitespace-sensitive" A whitespace-sensitive query. "whitespace-insensitive" A whitespace-insensitive query. "stemmed" A stemmed query. "unstemmed" An unstemmed query. "wildcarded" A wildcarded query. "unwildcarded" An unwildcarded query. "exact" An exact match query. Shorthand for "case-sensitive", "diacritic-sensitive", "punctuation-sensitive", "whitespace-sensitive", "unstemmed", and "unwildcarded".  "lang=iso639code" Specifies the language of the query. The iso639code code portion is case-insensitive, and uses the languages specified by ISO 639. The default is specified in the database configuration. "distance-weight=number" A weight applied based on the minimum distance between matches of this query. Higher weights add to the importance of proximity (as opposed to term matches) when the relevance order is calculated. The default value is 0.0 (no impact of proximity). The weight should be between 64 and -16. Weights greater than 64 will have the same effect as a weight of 64. This parameter has no effect if the word positions index is not enabled. This parameter has no effect on searches that use score-simple, score-random, or score-zero (because those scoring algorithms do not consider term frequency, proximity is irrelevant).  "min-occurs=number" Specifies the minimum number of occurrences required. If fewer that this number of words occur, the fragment does not match. The default is 1. "max-occurs=number" Specifies the maximum number of occurrences required. If more than this number of words occur, the fragment does not match. The default is unbounded. "synonym" Specifies that all of the terms in the $text parameter are considered synonyms for scoring purposes. The result is that occurrences of more than one of the synonyms are scored as if there are more occurrences of the same term (as opposed to having a separate term that contributes to score).  "lexicon-expand=value" The value is one of full, prefix-postfix, off, or heuristic (the default is heuristic). An option with a value of lexicon-expand=full specifies that wildcards are resolved by expanding the pattern to words in a lexicon (if there is one available), and turning into a series of cts:word-queries, even if this takes a long time to evaluate. An option with a value of lexicon-expand=prefix-postfix specifies that wildcards are resolved by expanding the pattern to the pre- and postfixes of the words in the word lexicon (if there is one), and turning the query into a series of character queries, even if it takes a long time to evaluate. An option with a value of lexicon-expand=off specifies that wildcards are only resolved by looking up character patterns in the search pattern index, not in the lexicon. An option with a value of lexicon-expand=heuristic, which is the default, specifies that wildcards are resolved by using a series of internal rules, such as estimating the number of lexicon entries that need to be scanned, seeing if the estimate crosses certain thresholds, and (if appropriate), using another way besides lexicon expansion to resolve the query.  "lexicon-expansion-limit=number" Specifies the limit for lexicon expansion. This puts a restriction on the number of lexicon expansions that can be performed. If the limit is exceeded, the server may raise an error depending on whether the "limit-check" option is set. The default value for this option will be 4096.  "limit-check" Specifies that an error will be raised if the lexicon expansion exceeds the specified limit. "no-limit-check" Specifies that error will not be raised if the lexicon expansion exceeds the specified limit. The server will try to resolve the wildcard.  
    * @param { XsDouble } [weight] - A weight for this query. Higher weights move search results up in the relevance order. The default is 1.0. The weight should be between 64 and -16. Weights greater than 64 will have the same effect as a weight of 64. Weights less than the absolute value of 0.0625 (between -0.0625 and 0.0625) are rounded to 0, which means that they do not contribute to the score.
    * @returns { CtsQuery }
    */
wordQuery(...args) {
    const namer = bldrbase.getNamer(args, 'text');
    const paramdefs = [['text', [types.XsString], false, true], ['options', [types.XsString], false, true], ['weight', [types.XsDouble], false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.wordQuery', 1, new Set(['text', 'options', 'weight']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.wordQuery', 1, false, paramdefs, args);
    return new types.CtsQuery('cts', 'word-query', checkedArgs);

    }
}
class FnExpr {
  constructor() {
  }
  /**
    * Returns the absolute value of arg. If arg is negative returns -arg otherwise returns arg. If type of arg is one of the four numeric types xs:float, xs:double, xs:decimal or xs:integer the type of the result is the same as the type of arg. If the type of arg is a type derived from one of the numeric types, the result is an instance of the base numeric type.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.abs|fn.abs}
    * @method planBuilder.fn#abs
    * @since 2.1.1
    * @param { XsNumeric } [arg] - A numeric value.
    * @returns { XsNumeric }
    */
abs(...args) {
    const paramdef = ['arg', [types.XsNumeric, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.abs', 1, paramdef, args);
    return new types.XsNumeric('fn', 'abs', checkedArgs);
    }
/**
    * Adjusts an xs:date value to a specific timezone, or to no timezone at all. If timezone is the empty sequence, returns an xs:date without a timezone. Otherwise, returns an xs:date with a timezone. For purposes of timezone adjustment, an xs:date is treated as an xs:dateTime with time 00:00:00.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.adjustDateToTimezone|fn.adjustDateToTimezone}
    * @method planBuilder.fn#adjustDateToTimezone
    * @since 2.1.1
    * @param { XsDate } [arg] - The date to adjust to the new timezone.
    * @param { XsDayTimeDuration } [timezone] - The new timezone for the date.
    * @returns { XsDate }
    */
adjustDateToTimezone(...args) {
    const namer = bldrbase.getNamer(args, 'arg');
    const paramdefs = [['arg', [types.XsDate, PlanColumn, PlanParam], false, false], ['timezone', [types.XsDayTimeDuration, PlanColumn, PlanParam], false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.adjustDateToTimezone', 1, new Set(['arg', 'timezone']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.adjustDateToTimezone', 1, false, paramdefs, args);
    return new types.XsDate('fn', 'adjust-date-to-timezone', checkedArgs);

    }
/**
    * Adjusts an xs:dateTime value to a specific timezone, or to no timezone at all. If timezone is the empty sequence, returns an xs:dateTime without a timezone. Otherwise, returns an xs:dateTime with a timezone.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.adjustDateTimeToTimezone|fn.adjustDateTimeToTimezone}
    * @method planBuilder.fn#adjustDateTimeToTimezone
    * @since 2.1.1
    * @param { XsDateTime } [arg] - The dateTime to adjust to the new timezone.
    * @param { XsDayTimeDuration } [timezone] - The new timezone for the dateTime.
    * @returns { XsDateTime }
    */
adjustDateTimeToTimezone(...args) {
    const namer = bldrbase.getNamer(args, 'arg');
    const paramdefs = [['arg', [types.XsDateTime, PlanColumn, PlanParam], false, false], ['timezone', [types.XsDayTimeDuration, PlanColumn, PlanParam], false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.adjustDateTimeToTimezone', 1, new Set(['arg', 'timezone']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.adjustDateTimeToTimezone', 1, false, paramdefs, args);
    return new types.XsDateTime('fn', 'adjust-dateTime-to-timezone', checkedArgs);

    }
/**
    * Adjusts an xs:time value to a specific timezone, or to no timezone at all. If timezone is the empty sequence, returns an xs:time without a timezone. Otherwise, returns an xs:time with a timezone.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.adjustTimeToTimezone|fn.adjustTimeToTimezone}
    * @method planBuilder.fn#adjustTimeToTimezone
    * @since 2.1.1
    * @param { XsTime } [arg] - The time to adjust to the new timezone.
    * @param { XsDayTimeDuration } [timezone] - The new timezone for the date.
    * @returns { XsTime }
    */
adjustTimeToTimezone(...args) {
    const namer = bldrbase.getNamer(args, 'arg');
    const paramdefs = [['arg', [types.XsTime, PlanColumn, PlanParam], false, false], ['timezone', [types.XsDayTimeDuration, PlanColumn, PlanParam], false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.adjustTimeToTimezone', 1, new Set(['arg', 'timezone']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.adjustTimeToTimezone', 1, false, paramdefs, args);
    return new types.XsTime('fn', 'adjust-time-to-timezone', checkedArgs);

    }
/**
    * The result of the function is a new element node whose string value is the original string, but which contains markup to show which parts of the input match the regular expression. Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.analyzeString|fn.analyzeString}
    * @method planBuilder.fn#analyzeString
    * @since 2.1.1
    * @param { XsString } [in] - The string to start with.
    * @param { XsString } [regex] - The regular expression pattern to match.
    * @param { XsString } [flags] - The flag representing how to interpret the regular expression. One of "s", "m", "i", or "x", as defined in http://www.w3.org/TR/xpath-functions/#flags.
    * @returns { ElementNode }
    */
analyzeString(...args) {
    const namer = bldrbase.getNamer(args, 'in');
    const paramdefs = [['in', [types.XsString, PlanColumn, PlanParam], false, false], ['regex', [types.XsString, PlanColumn, PlanParam], true, false], ['flags', [types.XsString, PlanColumn, PlanParam], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.analyzeString', 2, new Set(['in', 'regex', 'flags']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.analyzeString', 2, false, paramdefs, args);
    return new types.ElementNode('fn', 'analyze-string', checkedArgs);

    }
/**
    * Returns the average of the values in the input sequence arg, that is, the sum of the values divided by the number of values.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.avg|fn.avg}
    * @method planBuilder.fn#avg
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg] - The sequence of values to average.
    * @returns { XsAnyAtomicType }
    */
avg(...args) {
    const paramdef = ['arg', [types.XsAnyAtomicType, PlanColumn, PlanParam], false, true];
    const checkedArgs = bldrbase.makeSingleArgs('fn.avg', 1, paramdef, args);
    return new types.XsAnyAtomicType('fn', 'avg', checkedArgs);
    }
/**
    * Returns the value of the base-uri property for the specified node. If the node is part of a document and does not have a base-uri attribute explicitly set, fn:base-uri typically returns the URI of the document in which the node resides. Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.baseUri|fn.baseUri}
    * @method planBuilder.fn#baseUri
    * @since 2.1.1
    * @param { Node } [arg] - The node whose base-uri is to be returned.
    * @returns { XsAnyURI }
    */
baseUri(...args) {
    const paramdef = ['arg', [types.Node, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.baseUri', 1, paramdef, args);
    return new types.XsAnyURI('fn', 'base-uri', checkedArgs);
    }
/**
    * Computes the effective boolean value of the sequence arg. See Section 2.4.3 Effective Boolean Value[XP].  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.boolean|fn.boolean}
    * @method planBuilder.fn#boolean
    * @since 2.1.1
    * @param { Item } [arg] - A sequence of items.
    * @returns { XsBoolean }
    */
boolean(...args) {
    const paramdef = ['arg', [types.Item, PlanColumn, PlanParam], false, true];
    const checkedArgs = bldrbase.makeSingleArgs('fn.boolean', 1, paramdef, args);
    return new types.XsBoolean('fn', 'boolean', checkedArgs);
    }
/**
    * Returns the smallest (closest to negative infinity) number with no fractional part that is not less than the value of arg. If type of arg is one of the four numeric types xs:float, xs:double, xs:decimal or xs:integer the type of the result is the same as the type of arg. If the type of arg is a type derived from one of the numeric types, the result is an instance of the base numeric type.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.ceiling|fn.ceiling}
    * @method planBuilder.fn#ceiling
    * @since 2.1.1
    * @param { XsNumeric } [arg] - A numeric value.
    * @returns { XsNumeric }
    */
ceiling(...args) {
    const paramdef = ['arg', [types.XsNumeric, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.ceiling', 1, paramdef, args);
    return new types.XsNumeric('fn', 'ceiling', checkedArgs);
    }
/**
    * Returns true if the specified parameters are the same Unicode code point, otherwise returns false. The codepoints are compared according to the Unicode code point collation (http://www.w3.org/2005/xpath-functions/collation/codepoint).   Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.codepointEqual|fn.codepointEqual}
    * @method planBuilder.fn#codepointEqual
    * @since 2.1.1
    * @param { XsString } [comparand1] - A string to be compared.
    * @param { XsString } [comparand2] - A string to be compared.
    * @returns { XsBoolean }
    */
codepointEqual(...args) {
    const namer = bldrbase.getNamer(args, 'comparand1');
    const paramdefs = [['comparand1', [types.XsString, PlanColumn, PlanParam], false, false], ['comparand2', [types.XsString, PlanColumn, PlanParam], false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.codepointEqual', 2, new Set(['comparand1', 'comparand2']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.codepointEqual', 2, false, paramdefs, args);
    return new types.XsBoolean('fn', 'codepoint-equal', checkedArgs);

    }
/**
    * Creates an xs:string from a sequence of Unicode code points. Returns the zero-length string if arg is the empty sequence. If any of the code points in arg is not a legal XML character, an error is raised. Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.codepointsToString|fn.codepointsToString}
    * @method planBuilder.fn#codepointsToString
    * @since 2.1.1
    * @param { XsInteger } [arg] - A sequence of Unicode code points.
    * @returns { XsString }
    */
codepointsToString(...args) {
    const paramdef = ['arg', [types.XsInteger, PlanColumn, PlanParam], false, true];
    const checkedArgs = bldrbase.makeSingleArgs('fn.codepointsToString', 1, paramdef, args);
    return new types.XsString('fn', 'codepoints-to-string', checkedArgs);
    }
/**
    * Returns -1, 0, or 1, depending on whether the value of the comparand1 is respectively less than, equal to, or greater than the value of comparand2, according to the rules of the collation that is used.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.compare|fn.compare}
    * @method planBuilder.fn#compare
    * @since 2.1.1
    * @param { XsString } [comparand1] - A string to be compared.
    * @param { XsString } [comparand2] - A string to be compared.
    * @param { XsString } [collation] - The optional name of a valid collation URI. For information on the collation URI syntax, see the Search Developer's Guide.
    * @returns { XsInteger }
    */
compare(...args) {
    const namer = bldrbase.getNamer(args, 'comparand1');
    const paramdefs = [['comparand1', [types.XsString, PlanColumn, PlanParam], false, false], ['comparand2', [types.XsString, PlanColumn, PlanParam], false, false], ['collation', [types.XsString, PlanColumn, PlanParam], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.compare', 2, new Set(['comparand1', 'comparand2', 'collation']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.compare', 2, false, paramdefs, args);
    return new types.XsInteger('fn', 'compare', checkedArgs);

    }
/**
    * Returns the xs:string that is the concatenation of the values of the specified parameters. Accepts two or more xs:anyAtomicType arguments and casts them to xs:string. If any of the parameters is the empty sequence, the parameter is treated as the zero-length string.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.concat|fn.concat}
    * @method planBuilder.fn#concat
    * @since 2.1.1
    * @param { XsAnyAtomicType } [parameter1] - A value.
    * @returns { XsString }
    */
concat(...args) {
    const namer = bldrbase.getNamer(args, 'parameter1');
    const paramdefs = [['parameter1', [types.XsAnyAtomicType, PlanColumn, PlanParam], false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.concat', 1, new Set(['parameter1']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.concat', 1, true, paramdefs, args);
    return new types.XsString('fn', 'concat', checkedArgs);

    }
/**
    * Returns true if the first parameter contains the string from the second parameter, otherwise returns false. Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.contains|fn.contains}
    * @method planBuilder.fn#contains
    * @since 2.1.1
    * @param { XsString } [parameter1] - The string from which to test.
    * @param { XsString } [parameter2] - The string to test for existence in the first parameter.
    * @param { XsString } [collation] - The optional name of a valid collation URI. For information on the collation URI syntax, see the Search Developer's Guide.
    * @returns { XsBoolean }
    */
contains(...args) {
    const namer = bldrbase.getNamer(args, 'parameter1');
    const paramdefs = [['parameter1', [types.XsString, PlanColumn, PlanParam], false, false], ['parameter2', [types.XsString, PlanColumn, PlanParam], false, false], ['collation', [types.XsString, PlanColumn, PlanParam], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.contains', 2, new Set(['parameter1', 'parameter2', 'collation']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.contains', 2, false, paramdefs, args);
    return new types.XsBoolean('fn', 'contains', checkedArgs);

    }
/**
    * Returns the number of items in the value of arg.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.count|fn.count}
    * @method planBuilder.fn#count
    * @since 2.1.1
    * @param { Item } [arg] - The sequence of items to count.
    * @param { XsDouble } [maximum] - The maximum value of the count to return. MarkLogic Server will stop count when the $maximum value is reached and return the $maximum value. This is an extension to the W3C standard fn:count function.
    * @returns { XsInteger }
    */
count(...args) {
    const namer = bldrbase.getNamer(args, 'arg');
    const paramdefs = [['arg', [types.Item, PlanColumn, PlanParam], false, true], ['maximum', [types.XsDouble, PlanColumn, PlanParam], false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.count', 1, new Set(['arg', 'maximum']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.count', 1, false, paramdefs, args);
    return new types.XsInteger('fn', 'count', checkedArgs);

    }
/**
    * Returns xs:date(fn:current-dateTime()). This is an xs:date (with timezone) that is current at some time during the evaluation of a query or transformation in which fn:current-date() is executed. This function is *stable*. The precise instant during the query or transformation represented by the value of fn:current-date() is *implementation dependent*. Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.currentDate|fn.currentDate}
    * @method planBuilder.fn#currentDate
    * @since 2.1.1

    * @returns { XsDate }
    */
currentDate(...args) {
    bldrbase.checkMaxArity('fn.currentDate', args.length, 0);
    return new types.XsDate('fn', 'current-date', args);
    }
/**
    * Returns the current dateTime value (with timezone) from the dynamic context. (See Section C.2 Dynamic Context Components[XP].) This is an xs:dateTime that is current at some time during the evaluation of a query or transformation in which fn:current-dateTime() is executed. This function is *stable*. The precise instant during the query or transformation represented by the value of fn:current-dateTime() is *implementation dependent*. Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.currentDateTime|fn.currentDateTime}
    * @method planBuilder.fn#currentDateTime
    * @since 2.1.1

    * @returns { XsDateTime }
    */
currentDateTime(...args) {
    bldrbase.checkMaxArity('fn.currentDateTime', args.length, 0);
    return new types.XsDateTime('fn', 'current-dateTime', args);
    }
/**
    * Returns xs:time(fn:current-dateTime()). This is an xs:time (with timezone) that is current at some time during the evaluation of a query or transformation in which fn:current-time() is executed. This function is *stable*. The precise instant during the query or transformation represented by the value of fn:current-time() is *implementation dependent*. Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.currentTime|fn.currentTime}
    * @method planBuilder.fn#currentTime
    * @since 2.1.1

    * @returns { XsTime }
    */
currentTime(...args) {
    bldrbase.checkMaxArity('fn.currentTime', args.length, 0);
    return new types.XsTime('fn', 'current-time', args);
    }
/**
    * Returns an xs:dateTime value created by combining an xs:date and an xs:time.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.dateTime|fn.dateTime}
    * @method planBuilder.fn#dateTime
    * @since 2.1.1
    * @param { XsDate } [arg1] - The date to be combined with the time argument.
    * @param { XsTime } [arg2] - The time to be combined with the date argument.
    * @returns { XsDateTime }
    */
dateTime(...args) {
    const namer = bldrbase.getNamer(args, 'arg1');
    const paramdefs = [['arg1', [types.XsDate, PlanColumn, PlanParam], false, false], ['arg2', [types.XsTime, PlanColumn, PlanParam], false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.dateTime', 2, new Set(['arg1', 'arg2']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.dateTime', 2, false, paramdefs, args);
    return new types.XsDateTime('fn', 'dateTime', checkedArgs);

    }
/**
    * Returns an xs:integer between 1 and 31, both inclusive, representing the day component in the localized value of arg.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.dayFromDate|fn.dayFromDate}
    * @method planBuilder.fn#dayFromDate
    * @since 2.1.1
    * @param { XsDate } [arg] - The date whose day component will be returned.
    * @returns { XsInteger }
    */
dayFromDate(...args) {
    const paramdef = ['arg', [types.XsDate, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.dayFromDate', 1, paramdef, args);
    return new types.XsInteger('fn', 'day-from-date', checkedArgs);
    }
/**
    * Returns an xs:integer between 1 and 31, both inclusive, representing the day component in the localized value of arg.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.dayFromDateTime|fn.dayFromDateTime}
    * @method planBuilder.fn#dayFromDateTime
    * @since 2.1.1
    * @param { XsDateTime } [arg] - The dateTime whose day component will be returned.
    * @returns { XsInteger }
    */
dayFromDateTime(...args) {
    const paramdef = ['arg', [types.XsDateTime, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.dayFromDateTime', 1, paramdef, args);
    return new types.XsInteger('fn', 'day-from-dateTime', checkedArgs);
    }
/**
    * Returns an xs:integer representing the days component in the canonical lexical representation of the value of arg. The result may be negative.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.daysFromDuration|fn.daysFromDuration}
    * @method planBuilder.fn#daysFromDuration
    * @since 2.1.1
    * @param { XsDuration } [arg] - The duration whose day component will be returned.
    * @returns { XsInteger }
    */
daysFromDuration(...args) {
    const paramdef = ['arg', [types.XsDuration, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.daysFromDuration', 1, paramdef, args);
    return new types.XsInteger('fn', 'days-from-duration', checkedArgs);
    }
/**
    * This function assesses whether two sequences are deep-equal to each other. To be deep-equal, they must contain items that are pairwise deep-equal; and for two items to be deep-equal, they must either be atomic values that compare equal, or nodes of the same kind, with the same name, whose children are deep-equal. This is defined in more detail below. The collation argument identifies a collation which is used at all levels of recursion when strings are compared (but not when names are compared), according to the rules in 7.3.1 Collations.   Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.deepEqual|fn.deepEqual}
    * @method planBuilder.fn#deepEqual
    * @since 2.1.1
    * @param { Item } [parameter1] - The first sequence of items, each item should be an atomic value or node.
    * @param { Item } [parameter2] - The sequence of items to compare to the first sequence of items, again each item should be an atomic value or node.
    * @param { XsString } [collation] - The optional name of a valid collation URI. For information on the collation URI syntax, see the Search Developer's Guide.
    * @returns { XsBoolean }
    */
deepEqual(...args) {
    const namer = bldrbase.getNamer(args, 'parameter1');
    const paramdefs = [['parameter1', [types.Item, PlanColumn, PlanParam], false, true], ['parameter2', [types.Item, PlanColumn, PlanParam], false, true], ['collation', [types.XsString, PlanColumn, PlanParam], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.deepEqual', 2, new Set(['parameter1', 'parameter2', 'collation']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.deepEqual', 2, false, paramdefs, args);
    return new types.XsBoolean('fn', 'deep-equal', checkedArgs);

    }
/**
    * Returns the value of the default collation property from the static context. Components of the static context are discussed in Section C.1 Static Context Components[XP].   Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.defaultCollation|fn.defaultCollation}
    * @method planBuilder.fn#defaultCollation
    * @since 2.1.1

    * @returns { XsString }
    */
defaultCollation(...args) {
    bldrbase.checkMaxArity('fn.defaultCollation', args.length, 0);
    return new types.XsString('fn', 'default-collation', args);
    }
/**
    * Returns the sequence that results from removing from arg all but one of a set of values that are eq to one other. Values that cannot be compared, i.e. the eq operator is not defined for their types, are considered to be distinct. Values of type xs:untypedAtomic are compared as if they were of type xs:string. The order in which the sequence of values is returned is implementation dependent.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.distinctValues|fn.distinctValues}
    * @method planBuilder.fn#distinctValues
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg] - A sequence of items.
    * @param { XsString } [collation] - The optional name of a valid collation URI. For information on the collation URI syntax, see the Search Developer's Guide.
    * @returns { XsAnyAtomicType }
    */
distinctValues(...args) {
    const namer = bldrbase.getNamer(args, 'arg');
    const paramdefs = [['arg', [types.XsAnyAtomicType, PlanColumn, PlanParam], false, true], ['collation', [types.XsString, PlanColumn, PlanParam], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.distinctValues', 1, new Set(['arg', 'collation']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.distinctValues', 1, false, paramdefs, args);
    return new types.XsAnyAtomicType('fn', 'distinct-values', checkedArgs);

    }
/**
    * Returns the value of the document-uri property for the specified node. If the node is a document node, then the value returned is the URI of the document. If the node is not a document node, then fn:document-uri returns the empty sequence. Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.documentUri|fn.documentUri}
    * @method planBuilder.fn#documentUri
    * @since 2.1.1
    * @param { Node } [arg] - The node whose document-uri is to be returned.
    * @returns { XsAnyURI }
    */
documentUri(...args) {
    const paramdef = ['arg', [types.Node, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.documentUri', 1, paramdef, args);
    return new types.XsAnyURI('fn', 'document-uri', checkedArgs);
    }
/**
    * If the value of arg is the empty sequence, the function returns true; otherwise, the function returns false. Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.empty|fn.empty}
    * @method planBuilder.fn#empty
    * @since 2.1.1
    * @param { Item } [arg] - A sequence to test.
    * @returns { XsBoolean }
    */
empty(...args) {
    const paramdef = ['arg', [types.Item, PlanColumn, PlanParam], false, true];
    const checkedArgs = bldrbase.makeSingleArgs('fn.empty', 1, paramdef, args);
    return new types.XsBoolean('fn', 'empty', checkedArgs);
    }
/**
    * Invertible function that escapes characters required to be escaped inside path segments of URIs. Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.encodeForUri|fn.encodeForUri}
    * @method planBuilder.fn#encodeForUri
    * @since 2.1.1
    * @param { XsString } [uriPart] - A string representing an unescaped URI.
    * @returns { XsString }
    */
encodeForUri(...args) {
    const paramdef = ['uri-part', [types.XsString, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.encodeForUri', 1, paramdef, args);
    return new types.XsString('fn', 'encode-for-uri', checkedArgs);
    }
/**
    * Returns true if the first parameter ends with the string from the second parameter, otherwise returns false. Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.endsWith|fn.endsWith}
    * @method planBuilder.fn#endsWith
    * @since 2.1.1
    * @param { XsString } [parameter1] - The parameter from which to test.
    * @param { XsString } [parameter2] - The string to test whether it is at the end of the first parameter.
    * @param { XsString } [collation] - The optional name of a valid collation URI. For information on the collation URI syntax, see the Search Developer's Guide.
    * @returns { XsBoolean }
    */
endsWith(...args) {
    const namer = bldrbase.getNamer(args, 'parameter1');
    const paramdefs = [['parameter1', [types.XsString, PlanColumn, PlanParam], false, false], ['parameter2', [types.XsString, PlanColumn, PlanParam], false, false], ['collation', [types.XsString, PlanColumn, PlanParam], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.endsWith', 2, new Set(['parameter1', 'parameter2', 'collation']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.endsWith', 2, false, paramdefs, args);
    return new types.XsBoolean('fn', 'ends-with', checkedArgs);

    }
/**
    * %-escapes everything except printable ASCII characters. Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.escapeHtmlUri|fn.escapeHtmlUri}
    * @method planBuilder.fn#escapeHtmlUri
    * @since 2.1.1
    * @param { XsString } [uriPart] - A string representing an unescaped URI.
    * @returns { XsString }
    */
escapeHtmlUri(...args) {
    const paramdef = ['uri-part', [types.XsString, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.escapeHtmlUri', 1, paramdef, args);
    return new types.XsString('fn', 'escape-html-uri', checkedArgs);
    }
/**
    * If the value of arg is not the empty sequence, the function returns true; otherwise, the function returns false. Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.exists|fn.exists}
    * @method planBuilder.fn#exists
    * @since 2.1.1
    * @param { Item } [arg] - A sequence to test.
    * @returns { XsBoolean }
    */
exists(...args) {
    const paramdef = ['arg', [types.Item, PlanColumn, PlanParam], false, true];
    const checkedArgs = bldrbase.makeSingleArgs('fn.exists', 1, paramdef, args);
    return new types.XsBoolean('fn', 'exists', checkedArgs);
    }
/**
    * Returns the xs:boolean value false. Equivalent to xs:boolean("0"). Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.false|fn.false}
    * @method planBuilder.fn#false
    * @since 2.1.1

    * @returns { XsBoolean }
    */
false(...args) {
    bldrbase.checkMaxArity('fn.false', args.length, 0);
    return new types.XsBoolean('fn', 'false', args);
    }
/**
    * Returns the largest (closest to positive infinity) number with no fractional part that is not greater than the value of arg. If type of arg is one of the four numeric types xs:float, xs:double, xs:decimal or xs:integer the type of the result is the same as the type of arg. If the type of arg is a type derived from one of the numeric types, the result is an instance of the base numeric type.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.floor|fn.floor}
    * @method planBuilder.fn#floor
    * @since 2.1.1
    * @param { XsNumeric } [arg] - A numeric value.
    * @returns { XsNumeric }
    */
floor(...args) {
    const paramdef = ['arg', [types.XsNumeric, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.floor', 1, paramdef, args);
    return new types.XsNumeric('fn', 'floor', checkedArgs);
    }
/**
    * Returns a formatted date value based on the picture argument. This is an XSLT function, and it is available in XSLT, XQuery 1.0-ml, and Server-Side JavaScript. Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.formatDate|fn.formatDate}
    * @method planBuilder.fn#formatDate
    * @since 2.1.1
    * @param { XsDate } [value] - The given date $value that needs to be formatted.
    * @param { XsString } [picture] - The desired string representation of the given date $value. The picture string is a sequence of characters, in which the characters represent variables such as, decimal-separator-sign, grouping-sign, zero-digit-sign, digit-sign, pattern-separator, percent sign and per-mille-sign. For details on the picture string, see http://www.w3.org/TR/xslt20/#date-picture-string.
    * @param { XsString } [language] - The desired language for string representation of the date $value.
    * @param { XsString } [calendar] - The only calendar supported at this point is "Gregorian" or "AD".
    * @param { XsString } [country] - $country is used the specification to take into account country specific string representation.
    * @returns { XsString }
    */
formatDate(...args) {
    const namer = bldrbase.getNamer(args, 'value');
    const paramdefs = [['value', [types.XsDate, PlanColumn, PlanParam], false, false], ['picture', [types.XsString, PlanColumn, PlanParam], true, false], ['language', [types.XsString, PlanColumn, PlanParam], false, false], ['calendar', [types.XsString, PlanColumn, PlanParam], false, false], ['country', [types.XsString, PlanColumn, PlanParam], false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.formatDate', 2, new Set(['value', 'picture', 'language', 'calendar', 'country']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.formatDate', 2, false, paramdefs, args);
    return new types.XsString('fn', 'format-date', checkedArgs);

    }
/**
    * Returns a formatted dateTime value based on the picture argument. This is an XSLT function, and it is available in XSLT, XQuery 1.0-ml, and Server-Side JavaScript. Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.formatDateTime|fn.formatDateTime}
    * @method planBuilder.fn#formatDateTime
    * @since 2.1.1
    * @param { XsDateTime } [value] - The given dateTime $value that needs to be formatted.
    * @param { XsString } [picture] - The desired string representation of the given dateTime $value. The picture string is a sequence of characters, in which the characters represent variables such as, decimal-separator-sign, grouping-sign, zero-digit-sign, digit-sign, pattern-separator, percent sign and per-mille-sign. For details on the picture string, see http://www.w3.org/TR/xslt20/#date-picture-string.
    * @param { XsString } [language] - The desired language for string representation of the dateTime $value.
    * @param { XsString } [calendar] - The only calendar supported at this point is "Gregorian" or "AD".
    * @param { XsString } [country] - $country is used the specification to take into account country specific string representation.
    * @returns { XsString }
    */
formatDateTime(...args) {
    const namer = bldrbase.getNamer(args, 'value');
    const paramdefs = [['value', [types.XsDateTime, PlanColumn, PlanParam], false, false], ['picture', [types.XsString, PlanColumn, PlanParam], true, false], ['language', [types.XsString, PlanColumn, PlanParam], false, false], ['calendar', [types.XsString, PlanColumn, PlanParam], false, false], ['country', [types.XsString, PlanColumn, PlanParam], false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.formatDateTime', 2, new Set(['value', 'picture', 'language', 'calendar', 'country']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.formatDateTime', 2, false, paramdefs, args);
    return new types.XsString('fn', 'format-dateTime', checkedArgs);

    }
/**
    * Returns a formatted string representation of value argument based on the supplied picture. An optional decimal format name may also be supplied for interpretation of the picture string. This is an XSLT function, and it is available in XSLT, XQuery 1.0-ml, and Server-Side JavaScript. Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.formatNumber|fn.formatNumber}
    * @method planBuilder.fn#formatNumber
    * @since 2.1.1
    * @param { XsNumeric } [value] - The given numeric $value that needs to be formatted.
    * @param { XsString } [picture] - The desired string representation of the given number $value. The picture string is a sequence of characters, in which the characters represent variables such as, decimal-separator-sign, grouping-sign, zero-digit-sign, digit-sign, pattern-separator, percent sign and per-mille-sign. For details on the format-number picture string, see http://www.w3.org/TR/xslt20/#function-format-number.
    * @param { XsString } [decimalFormatName] - Represents a named  instruction. It is used to assign values to the variables mentioned above based on the picture string.
    * @returns { XsString }
    */
formatNumber(...args) {
    const namer = bldrbase.getNamer(args, 'value');
    const paramdefs = [['value', [types.XsNumeric, PlanColumn, PlanParam], false, true], ['picture', [types.XsString, PlanColumn, PlanParam], true, false], ['decimal-format-name', [types.XsString, PlanColumn, PlanParam], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.formatNumber', 2, new Set(['value', 'picture', 'decimal-format-name']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.formatNumber', 2, false, paramdefs, args);
    return new types.XsString('fn', 'format-number', checkedArgs);

    }
/**
    * Returns a formatted time value based on the picture argument. This is an XSLT function, and it is available in XSLT, XQuery 1.0-ml, and Server-Side JavaScript. Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.formatTime|fn.formatTime}
    * @method planBuilder.fn#formatTime
    * @since 2.1.1
    * @param { XsTime } [value] - The given time $value that needs to be formatted.
    * @param { XsString } [picture] - The desired string representation of the given time $value. The picture string is a sequence of characters, in which the characters represent variables such as, decimal-separator-sign, grouping-sign, zero-digit-sign, digit-sign, pattern-separator, percent sign and per-mille-sign. For details on the picture string, see http://www.w3.org/TR/xslt20/#date-picture-string.
    * @param { XsString } [language] - The desired language for string representation of the time $value.
    * @param { XsString } [calendar] - The only calendar supported at this point is "Gregorian" or "AD".
    * @param { XsString } [country] - $country is used the specification to take into account country specific string representation.
    * @returns { XsString }
    */
formatTime(...args) {
    const namer = bldrbase.getNamer(args, 'value');
    const paramdefs = [['value', [types.XsTime, PlanColumn, PlanParam], false, false], ['picture', [types.XsString, PlanColumn, PlanParam], true, false], ['language', [types.XsString, PlanColumn, PlanParam], false, false], ['calendar', [types.XsString, PlanColumn, PlanParam], false, false], ['country', [types.XsString, PlanColumn, PlanParam], false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.formatTime', 2, new Set(['value', 'picture', 'language', 'calendar', 'country']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.formatTime', 2, false, paramdefs, args);
    return new types.XsString('fn', 'format-time', checkedArgs);

    }
/**
    * Returns a string that uniquely identifies a given node.   Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.generateId|fn.generateId}
    * @method planBuilder.fn#generateId
    * @since 2.1.1
    * @param { Node } [node] - The node whose ID will be generated.
    * @returns { XsString }
    */
generateId(...args) {
    const paramdef = ['node', [types.Node, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.generateId', 1, paramdef, args);
    return new types.XsString('fn', 'generate-id', checkedArgs);
    }
/**
    * Returns the first item in a sequence. For more details, see XPath 3.0 Functions and Operators. Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.head|fn.head}
    * @method planBuilder.fn#head
    * @since 2.1.1
    * @param { Item } [seq] - A sequence of items.
    * @returns { Item }
    */
head(...args) {
    const paramdef = ['seq', [types.Item, PlanColumn, PlanParam], false, true];
    const checkedArgs = bldrbase.makeSingleArgs('fn.head', 1, paramdef, args);
    return new types.Item('fn', 'head', checkedArgs);
    }
/**
    * Returns an xs:integer between 0 and 23, both inclusive, representing the hours component in the localized value of arg.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.hoursFromDateTime|fn.hoursFromDateTime}
    * @method planBuilder.fn#hoursFromDateTime
    * @since 2.1.1
    * @param { XsDateTime } [arg] - The dateTime whose hours component will be returned.
    * @returns { XsInteger }
    */
hoursFromDateTime(...args) {
    const paramdef = ['arg', [types.XsDateTime, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.hoursFromDateTime', 1, paramdef, args);
    return new types.XsInteger('fn', 'hours-from-dateTime', checkedArgs);
    }
/**
    * Returns an xs:integer representing the hours component in the canonical lexical representation of the value of arg. The result may be negative.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.hoursFromDuration|fn.hoursFromDuration}
    * @method planBuilder.fn#hoursFromDuration
    * @since 2.1.1
    * @param { XsDuration } [arg] - The duration whose hour component will be returned.
    * @returns { XsInteger }
    */
hoursFromDuration(...args) {
    const paramdef = ['arg', [types.XsDuration, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.hoursFromDuration', 1, paramdef, args);
    return new types.XsInteger('fn', 'hours-from-duration', checkedArgs);
    }
/**
    * Returns an xs:integer between 0 and 23, both inclusive, representing the value of the hours component in the localized value of arg.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.hoursFromTime|fn.hoursFromTime}
    * @method planBuilder.fn#hoursFromTime
    * @since 2.1.1
    * @param { XsTime } [arg] - The time whose hours component will be returned.
    * @returns { XsInteger }
    */
hoursFromTime(...args) {
    const paramdef = ['arg', [types.XsTime, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.hoursFromTime', 1, paramdef, args);
    return new types.XsInteger('fn', 'hours-from-time', checkedArgs);
    }
/**
    * Returns the value of the implicit timezone property from the dynamic context. Components of the dynamic context are discussed in Section C.2 Dynamic Context Components[XP]. Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.implicitTimezone|fn.implicitTimezone}
    * @method planBuilder.fn#implicitTimezone
    * @since 2.1.1

    * @returns { XsDayTimeDuration }
    */
implicitTimezone(...args) {
    bldrbase.checkMaxArity('fn.implicitTimezone', args.length, 0);
    return new types.XsDayTimeDuration('fn', 'implicit-timezone', args);
    }
/**
    * Returns the prefixes of the in-scope namespaces for element. For namespaces that have a prefix, it returns the prefix as an xs:NCName. For the default namespace, which has no prefix, it returns the zero-length string.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.inScopePrefixes|fn.inScopePrefixes}
    * @method planBuilder.fn#inScopePrefixes
    * @since 2.1.1
    * @param { ElementNode } [element] - The element whose in-scope prefixes will be returned.
    * @returns { XsString }
    */
inScopePrefixes(...args) {
    const paramdef = ['element', [types.ElementNode, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.inScopePrefixes', 1, paramdef, args);
    return new types.XsString('fn', 'in-scope-prefixes', checkedArgs);
    }
/**
    * Returns a sequence of positive integers giving the positions within the sequence seqParam of items that are equal to srchParam.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.indexOf|fn.indexOf}
    * @method planBuilder.fn#indexOf
    * @since 2.1.1
    * @param { XsAnyAtomicType } [seqParam] - A sequence of values.
    * @param { XsAnyAtomicType } [srchParam] - A value to find on the list.
    * @param { XsString } [collationLiteral] - A collation identifier.
    * @returns { XsInteger }
    */
indexOf(...args) {
    const namer = bldrbase.getNamer(args, 'seqParam');
    const paramdefs = [['seqParam', [types.XsAnyAtomicType, PlanColumn, PlanParam], false, true], ['srchParam', [types.XsAnyAtomicType, PlanColumn, PlanParam], true, false], ['collationLiteral', [types.XsString, PlanColumn, PlanParam], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.indexOf', 2, new Set(['seqParam', 'srchParam', 'collationLiteral']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.indexOf', 2, false, paramdefs, args);
    return new types.XsInteger('fn', 'index-of', checkedArgs);

    }
/**
    * Returns a new sequence constructed from the value of target with the value of inserts inserted at the position specified by the value of position. (The value of target is not affected by the sequence construction.)  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.insertBefore|fn.insertBefore}
    * @method planBuilder.fn#insertBefore
    * @since 2.1.1
    * @param { Item } [target] - The sequence of items into which new items will be inserted.
    * @param { XsInteger } [position] - The position in the target sequence at which the new items will be added.
    * @param { Item } [inserts] - The items to insert into the target sequence.
    * @returns { Item }
    */
insertBefore(...args) {
    const namer = bldrbase.getNamer(args, 'target');
    const paramdefs = [['target', [types.Item, PlanColumn, PlanParam], false, true], ['position', [types.XsInteger, PlanColumn, PlanParam], true, false], ['inserts', [types.Item, PlanColumn, PlanParam], false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.insertBefore', 3, new Set(['target', 'position', 'inserts']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.insertBefore', 3, false, paramdefs, args);
    return new types.Item('fn', 'insert-before', checkedArgs);

    }
/**
    * Idempotent function that escapes non-URI characters. Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.iriToUri|fn.iriToUri}
    * @method planBuilder.fn#iriToUri
    * @since 2.1.1
    * @param { XsString } [uriPart] - A string representing an unescaped URI.
    * @returns { XsString }
    */
iriToUri(...args) {
    const paramdef = ['uri-part', [types.XsString, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.iriToUri', 1, paramdef, args);
    return new types.XsString('fn', 'iri-to-uri', checkedArgs);
    }
/**
    * This function tests whether the language of node, or the context node if the second argument is omitted, as specified by xml:lang attributes is the same as, or is a sublanguage of, the language specified by testlang. The language of the argument node, or the context node if the second argument is omitted, is determined by the value of the xml:lang attribute on the node, or, if the node has no such attribute, by the value of the xml:lang attribute on the nearest ancestor of the node that has an xml:lang attribute. If there is no such ancestor, then the function returns false  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.lang|fn.lang}
    * @method planBuilder.fn#lang
    * @since 2.1.1
    * @param { XsString } [testlang] - The language against which to test the node.
    * @param { Node } [node] - The node to test.
    * @returns { XsBoolean }
    */
lang(...args) {
    const namer = bldrbase.getNamer(args, 'testlang');
    const paramdefs = [['testlang', [types.XsString, PlanColumn, PlanParam], false, false], ['node', [types.Node, PlanColumn, PlanParam], false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.lang', 2, new Set(['testlang', 'node']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.lang', 2, false, paramdefs, args);
    return new types.XsBoolean('fn', 'lang', checkedArgs);

    }
/**
    * Returns the local part of the name of arg as an xs:string that will either be the zero-length string or will have the lexical form of an xs:NCName.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.localName|fn.localName}
    * @method planBuilder.fn#localName
    * @since 2.1.1
    * @param { Node } [arg] - The node whose local name is to be returned.
    * @returns { XsString }
    */
localName(...args) {
    const paramdef = ['arg', [types.Node, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.localName', 1, paramdef, args);
    return new types.XsString('fn', 'local-name', checkedArgs);
    }
/**
    * Returns an xs:NCName representing the local part of arg. If arg is the empty sequence, returns the empty sequence. Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.localNameFromQName|fn.localNameFromQName}
    * @method planBuilder.fn#localNameFromQName
    * @since 2.1.1
    * @param { XsQName } [arg] - A qualified name.
    * @returns { XsNCName }
    */
localNameFromQName(...args) {
    const paramdef = ['arg', [types.XsQName, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.localNameFromQName', 1, paramdef, args);
    return new types.XsNCName('fn', 'local-name-from-QName', checkedArgs);
    }
/**
    * Returns the specified string converting all of the characters to lower-case characters. If a character does not have a corresponding lower-case character, then the original character is returned. The lower-case characters are determined using the Unicode Case Mappings. Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.lowerCase|fn.lowerCase}
    * @method planBuilder.fn#lowerCase
    * @since 2.1.1
    * @param { XsString } [string] - The string to convert.
    * @returns { XsString }
    */
lowerCase(...args) {
    const paramdef = ['string', [types.XsString, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.lowerCase', 1, paramdef, args);
    return new types.XsString('fn', 'lower-case', checkedArgs);
    }
/**
    * Returns true if the specified input matches the specified pattern, otherwise returns false. Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.matches|fn.matches}
    * @method planBuilder.fn#matches
    * @since 2.1.1
    * @param { XsString } [input] - The input from which to match.
    * @param { XsString } [pattern] - The regular expression to match.
    * @param { XsString } [flags] - The flag representing how to interpret the regular expression. One of "s", "m", "i", or "x", as defined in http://www.w3.org/TR/xpath-functions/#flags.
    * @returns { XsBoolean }
    */
matches(...args) {
    const namer = bldrbase.getNamer(args, 'input');
    const paramdefs = [['input', [types.XsString, PlanColumn, PlanParam], false, false], ['pattern', [types.XsString, PlanColumn, PlanParam], true, false], ['flags', [types.XsString, PlanColumn, PlanParam], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.matches', 2, new Set(['input', 'pattern', 'flags']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.matches', 2, false, paramdefs, args);
    return new types.XsBoolean('fn', 'matches', checkedArgs);

    }
/**
    * Selects an item from the input sequence arg whose value is greater than or equal to the value of every other item in the input sequence. If there are two or more such items, then the specific item whose value is returned is implementation dependent.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.max|fn.max}
    * @method planBuilder.fn#max
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg] - The sequence of values whose maximum will be returned.
    * @param { XsString } [collation] - The optional name of a valid collation URI. For information on the collation URI syntax, see the Search Developer's Guide.
    * @returns { XsAnyAtomicType }
    */
max(...args) {
    const namer = bldrbase.getNamer(args, 'arg');
    const paramdefs = [['arg', [types.XsAnyAtomicType, PlanColumn, PlanParam], false, true], ['collation', [types.XsString, PlanColumn, PlanParam], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.max', 1, new Set(['arg', 'collation']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.max', 1, false, paramdefs, args);
    return new types.XsAnyAtomicType('fn', 'max', checkedArgs);

    }
/**
    * Selects an item from the input sequence arg whose value is less than or equal to the value of every other item in the input sequence. If there are two or more such items, then the specific item whose value is returned is implementation dependent.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.min|fn.min}
    * @method planBuilder.fn#min
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg] - The sequence of values whose minimum will be returned.
    * @param { XsString } [collation] - The optional name of a valid collation URI. For information on the collation URI syntax, see the Search Developer's Guide.
    * @returns { XsAnyAtomicType }
    */
min(...args) {
    const namer = bldrbase.getNamer(args, 'arg');
    const paramdefs = [['arg', [types.XsAnyAtomicType, PlanColumn, PlanParam], false, true], ['collation', [types.XsString, PlanColumn, PlanParam], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.min', 1, new Set(['arg', 'collation']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.min', 1, false, paramdefs, args);
    return new types.XsAnyAtomicType('fn', 'min', checkedArgs);

    }
/**
    * Returns an xs:integer value between 0 and 59, both inclusive, representing the minute component in the localized value of arg.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.minutesFromDateTime|fn.minutesFromDateTime}
    * @method planBuilder.fn#minutesFromDateTime
    * @since 2.1.1
    * @param { XsDateTime } [arg] - The dateTime whose minutes component will be returned.
    * @returns { XsInteger }
    */
minutesFromDateTime(...args) {
    const paramdef = ['arg', [types.XsDateTime, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.minutesFromDateTime', 1, paramdef, args);
    return new types.XsInteger('fn', 'minutes-from-dateTime', checkedArgs);
    }
/**
    * Returns an xs:integer representing the minutes component in the canonical lexical representation of the value of arg. The result may be negative.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.minutesFromDuration|fn.minutesFromDuration}
    * @method planBuilder.fn#minutesFromDuration
    * @since 2.1.1
    * @param { XsDuration } [arg] - The duration whose minute component will be returned.
    * @returns { XsInteger }
    */
minutesFromDuration(...args) {
    const paramdef = ['arg', [types.XsDuration, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.minutesFromDuration', 1, paramdef, args);
    return new types.XsInteger('fn', 'minutes-from-duration', checkedArgs);
    }
/**
    * Returns an xs:integer value between 0 to 59, both inclusive, representing the value of the minutes component in the localized value of arg.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.minutesFromTime|fn.minutesFromTime}
    * @method planBuilder.fn#minutesFromTime
    * @since 2.1.1
    * @param { XsTime } [arg] - The time whose minutes component will be returned.
    * @returns { XsInteger }
    */
minutesFromTime(...args) {
    const paramdef = ['arg', [types.XsTime, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.minutesFromTime', 1, paramdef, args);
    return new types.XsInteger('fn', 'minutes-from-time', checkedArgs);
    }
/**
    * Returns an xs:integer between 1 and 12, both inclusive, representing the month component in the localized value of arg.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.monthFromDate|fn.monthFromDate}
    * @method planBuilder.fn#monthFromDate
    * @since 2.1.1
    * @param { XsDate } [arg] - The date whose month component will be returned.
    * @returns { XsInteger }
    */
monthFromDate(...args) {
    const paramdef = ['arg', [types.XsDate, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.monthFromDate', 1, paramdef, args);
    return new types.XsInteger('fn', 'month-from-date', checkedArgs);
    }
/**
    * Returns an xs:integer between 1 and 12, both inclusive, representing the month component in the localized value of arg.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.monthFromDateTime|fn.monthFromDateTime}
    * @method planBuilder.fn#monthFromDateTime
    * @since 2.1.1
    * @param { XsDateTime } [arg] - The dateTime whose month component will be returned.
    * @returns { XsInteger }
    */
monthFromDateTime(...args) {
    const paramdef = ['arg', [types.XsDateTime, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.monthFromDateTime', 1, paramdef, args);
    return new types.XsInteger('fn', 'month-from-dateTime', checkedArgs);
    }
/**
    * Returns an xs:integer representing the months component in the canonical lexical representation of the value of arg. The result may be negative.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.monthsFromDuration|fn.monthsFromDuration}
    * @method planBuilder.fn#monthsFromDuration
    * @since 2.1.1
    * @param { XsDuration } [arg] - The duration whose month component will be returned.
    * @returns { XsInteger }
    */
monthsFromDuration(...args) {
    const paramdef = ['arg', [types.XsDuration, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.monthsFromDuration', 1, paramdef, args);
    return new types.XsInteger('fn', 'months-from-duration', checkedArgs);
    }
/**
    * Returns the name of a node, as an xs:string that is either the zero-length string, or has the lexical form of an xs:QName.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.name|fn.name}
    * @method planBuilder.fn#name
    * @since 2.1.1
    * @param { Node } [arg] - The node whose name is to be returned.
    * @returns { XsString }
    */
name(...args) {
    const paramdef = ['arg', [types.Node, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.name', 1, paramdef, args);
    return new types.XsString('fn', 'name', checkedArgs);
    }
/**
    * Returns the namespace URI of the xs:QName of the node specified by arg.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.namespaceUri|fn.namespaceUri}
    * @method planBuilder.fn#namespaceUri
    * @since 2.1.1
    * @param { Node } [arg] - The node whose namespace URI is to be returned.
    * @returns { XsAnyURI }
    */
namespaceUri(...args) {
    const paramdef = ['arg', [types.Node, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.namespaceUri', 1, paramdef, args);
    return new types.XsAnyURI('fn', 'namespace-uri', checkedArgs);
    }
/**
    * Returns the namespace URI of one of the in-scope namespaces for element, identified by its namespace prefix.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.namespaceUriForPrefix|fn.namespaceUriForPrefix}
    * @method planBuilder.fn#namespaceUriForPrefix
    * @since 2.1.1
    * @param { XsString } [prefix] - A namespace prefix to look up.
    * @param { ElementNode } [element] - An element node providing namespace context.
    * @returns { XsAnyURI }
    */
namespaceUriForPrefix(...args) {
    const namer = bldrbase.getNamer(args, 'prefix');
    const paramdefs = [['prefix', [types.XsString, PlanColumn, PlanParam], false, false], ['element', [types.ElementNode, PlanColumn, PlanParam], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.namespaceUriForPrefix', 2, new Set(['prefix', 'element']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.namespaceUriForPrefix', 2, false, paramdefs, args);
    return new types.XsAnyURI('fn', 'namespace-uri-for-prefix', checkedArgs);

    }
/**
    * Returns the namespace URI for arg as an xs:string. If arg is the empty sequence, the empty sequence is returned. If arg is in no namespace, the zero-length string is returned. Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.namespaceUriFromQName|fn.namespaceUriFromQName}
    * @method planBuilder.fn#namespaceUriFromQName
    * @since 2.1.1
    * @param { XsQName } [arg] - A qualified name.
    * @returns { XsAnyURI }
    */
namespaceUriFromQName(...args) {
    const paramdef = ['arg', [types.XsQName, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.namespaceUriFromQName', 1, paramdef, args);
    return new types.XsAnyURI('fn', 'namespace-uri-from-QName', checkedArgs);
    }
/**
    * Summary: Returns an xs:boolean indicating whether the argument node is "nilled". If the argument is not an element node, returns the empty sequence. If the argument is the empty sequence, returns the empty sequence. For element nodes, true() is returned if the element is nilled, otherwise false().  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.nilled|fn.nilled}
    * @method planBuilder.fn#nilled
    * @since 2.1.1
    * @param { Node } [arg] - The node to test for nilled status.
    * @returns { XsBoolean }
    */
nilled(...args) {
    const paramdef = ['arg', [types.Node, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.nilled', 1, paramdef, args);
    return new types.XsBoolean('fn', 'nilled', checkedArgs);
    }
/**
    * Returns an expanded-QName for node kinds that can have names. For other kinds of nodes it returns the empty sequence. If arg is the empty sequence, the empty sequence is returned. Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.nodeName|fn.nodeName}
    * @method planBuilder.fn#nodeName
    * @since 2.1.1
    * @param { Node } [arg] - The node whose name is to be returned.
    * @returns { XsQName }
    */
nodeName(...args) {
    const paramdef = ['arg', [types.Node, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.nodeName', 1, paramdef, args);
    return new types.XsQName('fn', 'node-name', checkedArgs);
    }
/**
    * Returns the specified string with normalized whitespace, which strips off any leading or trailing whitespace and replaces any other sequences of more than one whitespace characters with a single space character (#x20). Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.normalizeSpace|fn.normalizeSpace}
    * @method planBuilder.fn#normalizeSpace
    * @since 2.1.1
    * @param { XsString } [input] - The string from which to normalize whitespace.
    * @returns { XsString }
    */
normalizeSpace(...args) {
    const paramdef = ['input', [types.XsString, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.normalizeSpace', 1, paramdef, args);
    return new types.XsString('fn', 'normalize-space', checkedArgs);
    }
/**
    * Return the argument normalized according to the normalization criteria for a normalization form identified by the value of normalizationForm. The effective value of the normalizationForm is computed by removing leading and trailing blanks, if present, and converting to upper case. Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.normalizeUnicode|fn.normalizeUnicode}
    * @method planBuilder.fn#normalizeUnicode
    * @since 2.1.1
    * @param { XsString } [arg] - The string to normalize.
    * @param { XsString } [normalizationForm] - The form under which to normalize the specified string: NFC, NFD, NFKC, or NFKD.
    * @returns { XsString }
    */
normalizeUnicode(...args) {
    const namer = bldrbase.getNamer(args, 'arg');
    const paramdefs = [['arg', [types.XsString, PlanColumn, PlanParam], false, false], ['normalizationForm', [types.XsString, PlanColumn, PlanParam], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.normalizeUnicode', 1, new Set(['arg', 'normalizationForm']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.normalizeUnicode', 1, false, paramdefs, args);
    return new types.XsString('fn', 'normalize-unicode', checkedArgs);

    }
/**
    * Returns true if the effective boolean value is false, and false if the effective boolean value is true. The arg parameter is first reduced to an effective boolean value by applying the fn:boolean function. Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.not|fn.not}
    * @method planBuilder.fn#not
    * @since 2.1.1
    * @param { Item } [arg] - The expression to negate.
    * @returns { XsBoolean }
    */
not(...args) {
    const paramdef = ['arg', [types.Item, PlanColumn, PlanParam], false, true];
    const checkedArgs = bldrbase.makeSingleArgs('fn.not', 1, paramdef, args);
    return new types.XsBoolean('fn', 'not', checkedArgs);
    }
/**
    * Returns the value indicated by arg or, if arg is not specified, the context item after atomization, converted to an xs:double. If arg is the empty sequence or if arg or the context item cannot be converted to an xs:double, the xs:double value NaN is returned. If the context item is undefined an error is raised: [err:XPDY0002].  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.number|fn.number}
    * @method planBuilder.fn#number
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg] - The value to be returned as an xs:double value.
    * @returns { XsDouble }
    */
number(...args) {
    const paramdef = ['arg', [types.XsAnyAtomicType, types.Node, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.number', 1, paramdef, args);
    return new types.XsDouble('fn', 'number', checkedArgs);
    }
/**
    * Returns an xs:NCName representing the prefix of arg. The empty sequence is returned if arg is the empty sequence or if the value of arg contains no prefix. Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.prefixFromQName|fn.prefixFromQName}
    * @method planBuilder.fn#prefixFromQName
    * @since 2.1.1
    * @param { XsQName } [arg] - A qualified name.
    * @returns { XsNCName }
    */
prefixFromQName(...args) {
    const paramdef = ['arg', [types.XsQName, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.prefixFromQName', 1, paramdef, args);
    return new types.XsNCName('fn', 'prefix-from-QName', checkedArgs);
    }
/**
    * Returns an xs:QName with the namespace URI given in paramURI. If paramURI is the zero-length string or the empty sequence, it represents "no namespace"; in this case, if the value of paramQName contains a colon (:), an error is raised [err:FOCA0002]. The prefix (or absence of a prefix) in paramQName is retained in the returned xs:QName value. The local name in the result is taken from the local part of paramQName.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.QName|fn.QName}
    * @method planBuilder.fn#QName
    * @since 2.1.1
    * @param { XsString } [paramURI] - A namespace URI, as a string.
    * @param { XsString } [paramQName] - A lexical qualified name (xs:QName), a string of the form "prefix:localname" or "localname".
    * @returns { XsQName }
    */
QName(...args) {
    const namer = bldrbase.getNamer(args, 'paramURI');
    const paramdefs = [['paramURI', [types.XsString, PlanColumn, PlanParam], false, false], ['paramQName', [types.XsString, PlanColumn, PlanParam], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.QName', 2, new Set(['paramURI', 'paramQName']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.QName', 2, false, paramdefs, args);
    return new types.XsQName('fn', 'QName', checkedArgs);

    }
/**
    * Returns a new sequence constructed from the value of target with the item at the position specified by the value of position removed.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.remove|fn.remove}
    * @method planBuilder.fn#remove
    * @since 2.1.1
    * @param { Item } [target] - The sequence of items from which items will be removed.
    * @param { XsInteger } [position] - The position in the target sequence from which the items will be removed.
    * @returns { Item }
    */
remove(...args) {
    const namer = bldrbase.getNamer(args, 'target');
    const paramdefs = [['target', [types.Item, PlanColumn, PlanParam], false, true], ['position', [types.XsInteger, PlanColumn, PlanParam], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.remove', 2, new Set(['target', 'position']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.remove', 2, false, paramdefs, args);
    return new types.Item('fn', 'remove', checkedArgs);

    }
/**
    * Returns a string constructed by replacing the specified pattern on the input string with the specified replacement string. Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.replace|fn.replace}
    * @method planBuilder.fn#replace
    * @since 2.1.1
    * @param { XsString } [input] - The string to start with.
    * @param { XsString } [pattern] - The regular expression pattern to match. If the pattern does not match the $input string, the function will return the $input string unchanged.
    * @param { XsString } [replacement] - The regular expression pattern to replace the $pattern with. It can also be a capture expression (for more details, see http://www.w3.org/TR/xpath-functions/#func-replace).
    * @param { XsString } [flags] - The flag representing how to interpret the regular expression. One of "s", "m", "i", or "x", as defined in http://www.w3.org/TR/xpath-functions/#flags.
    * @returns { XsString }
    */
replace(...args) {
    const namer = bldrbase.getNamer(args, 'input');
    const paramdefs = [['input', [types.XsString, PlanColumn, PlanParam], false, false], ['pattern', [types.XsString, PlanColumn, PlanParam], true, false], ['replacement', [types.XsString, PlanColumn, PlanParam], true, false], ['flags', [types.XsString, PlanColumn, PlanParam], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.replace', 3, new Set(['input', 'pattern', 'replacement', 'flags']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.replace', 3, false, paramdefs, args);
    return new types.XsString('fn', 'replace', checkedArgs);

    }
/**
    * Returns an xs:QName value (that is, an expanded QName) by taking an xs:string that has the lexical form of an xs:QName (a string in the form "prefix:local-name" or "local-name") and resolving it using the in-scope namespaces for a given element.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.resolveQName|fn.resolveQName}
    * @method planBuilder.fn#resolveQName
    * @since 2.1.1
    * @param { XsString } [qname] - A string of the form "prefix:local-name".
    * @param { ElementNode } [element] - An element providing the in-scope namespaces to use to resolve the qualified name.
    * @returns { XsQName }
    */
resolveQName(...args) {
    const namer = bldrbase.getNamer(args, 'qname');
    const paramdefs = [['qname', [types.XsString, PlanColumn, PlanParam], false, false], ['element', [types.ElementNode, PlanColumn, PlanParam], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.resolveQName', 2, new Set(['qname', 'element']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.resolveQName', 2, false, paramdefs, args);
    return new types.XsQName('fn', 'resolve-QName', checkedArgs);

    }
/**
    * Resolves a relative URI against an absolute URI. If base is specified, the URI is resolved relative to that base. If base is not specified, the base is set to the base-uri property from the static context, if the property exists; if it does not exist, an error is thrown. Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.resolveUri|fn.resolveUri}
    * @method planBuilder.fn#resolveUri
    * @since 2.1.1
    * @param { XsString } [relative] - A URI reference to resolve against the base.
    * @param { XsString } [base] - An absolute URI to use as the base of the resolution.
    * @returns { XsAnyURI }
    */
resolveUri(...args) {
    const namer = bldrbase.getNamer(args, 'relative');
    const paramdefs = [['relative', [types.XsString, PlanColumn, PlanParam], false, false], ['base', [types.XsString, PlanColumn, PlanParam], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.resolveUri', 2, new Set(['relative', 'base']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.resolveUri', 2, false, paramdefs, args);
    return new types.XsAnyURI('fn', 'resolve-uri', checkedArgs);

    }
/**
    * Reverses the order of items in a sequence. If arg is the empty sequence, the empty sequence is returned.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.reverse|fn.reverse}
    * @method planBuilder.fn#reverse
    * @since 2.1.1
    * @param { Item } [target] - The sequence of items to be reversed.
    * @returns { Item }
    */
reverse(...args) {
    const paramdef = ['target', [types.Item, PlanColumn, PlanParam], false, true];
    const checkedArgs = bldrbase.makeSingleArgs('fn.reverse', 1, paramdef, args);
    return new types.Item('fn', 'reverse', checkedArgs);
    }
/**
    * Returns the root of the tree to which arg belongs. This will usually, but not necessarily, be a document node.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.root|fn.root}
    * @method planBuilder.fn#root
    * @since 2.1.1
    * @param { Node } [arg] - The node whose root node will be returned.
    * @returns { Node }
    */
root(...args) {
    const paramdef = ['arg', [types.Node, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.root', 1, paramdef, args);
    return new types.Node('fn', 'root', checkedArgs);
    }
/**
    * Returns the number with no fractional part that is closest to the argument. If there are two such numbers, then the one that is closest to positive infinity is returned. If type of arg is one of the four numeric types xs:float, xs:double, xs:decimal or xs:integer the type of the result is the same as the type of arg. If the type of arg is a type derived from one of the numeric types, the result is an instance of the base numeric type.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.round|fn.round}
    * @method planBuilder.fn#round
    * @since 2.1.1
    * @param { XsNumeric } [arg] - A numeric value to round.
    * @returns { XsNumeric }
    */
round(...args) {
    const paramdef = ['arg', [types.XsNumeric, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.round', 1, paramdef, args);
    return new types.XsNumeric('fn', 'round', checkedArgs);
    }
/**
    * The value returned is the nearest (that is, numerically closest) numeric to arg that is a multiple of ten to the power of minus precision. If two such values are equally near (e.g. if the fractional part in arg is exactly .500...), returns the one whose least significant digit is even. If type of arg is one of the four numeric types xs:float, xs:double, xs:decimal or xs:integer the type of the result is the same as the type of arg. If the type of arg is a type derived from one of the numeric types, the result is an instance of the base numeric type.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.roundHalfToEven|fn.roundHalfToEven}
    * @method planBuilder.fn#roundHalfToEven
    * @since 2.1.1
    * @param { XsNumeric } [arg] - A numeric value to round.
    * @param { XsInteger } [precision] - The precision to which to round the value.
    * @returns { XsNumeric }
    */
roundHalfToEven(...args) {
    const namer = bldrbase.getNamer(args, 'arg');
    const paramdefs = [['arg', [types.XsNumeric, PlanColumn, PlanParam], false, false], ['precision', [types.XsInteger, PlanColumn, PlanParam], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.roundHalfToEven', 1, new Set(['arg', 'precision']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.roundHalfToEven', 1, false, paramdefs, args);
    return new types.XsNumeric('fn', 'round-half-to-even', checkedArgs);

    }
/**
    * Returns an xs:decimal value between 0 and 60.999..., both inclusive representing the seconds and fractional seconds in the localized value of arg. Note that the value can be greater than 60 seconds to accommodate occasional leap seconds used to keep human time synchronized with the rotation of the planet.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.secondsFromDateTime|fn.secondsFromDateTime}
    * @method planBuilder.fn#secondsFromDateTime
    * @since 2.1.1
    * @param { XsDateTime } [arg] - The dateTime whose seconds component will be returned.
    * @returns { XsDecimal }
    */
secondsFromDateTime(...args) {
    const paramdef = ['arg', [types.XsDateTime, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.secondsFromDateTime', 1, paramdef, args);
    return new types.XsDecimal('fn', 'seconds-from-dateTime', checkedArgs);
    }
/**
    * Returns an xs:decimal representing the seconds component in the canonical lexical representation of the value of arg. The result may be negative.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.secondsFromDuration|fn.secondsFromDuration}
    * @method planBuilder.fn#secondsFromDuration
    * @since 2.1.1
    * @param { XsDuration } [arg] - The duration whose minute component will be returned.
    * @returns { XsDecimal }
    */
secondsFromDuration(...args) {
    const paramdef = ['arg', [types.XsDuration, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.secondsFromDuration', 1, paramdef, args);
    return new types.XsDecimal('fn', 'seconds-from-duration', checkedArgs);
    }
/**
    * Returns an xs:decimal value between 0 and 60.999..., both inclusive, representing the seconds and fractional seconds in the localized value of arg. Note that the value can be greater than 60 seconds to accommodate occasional leap seconds used to keep human time synchronized with the rotation of the planet.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.secondsFromTime|fn.secondsFromTime}
    * @method planBuilder.fn#secondsFromTime
    * @since 2.1.1
    * @param { XsTime } [arg] - The time whose seconds component will be returned.
    * @returns { XsDecimal }
    */
secondsFromTime(...args) {
    const paramdef = ['arg', [types.XsTime, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.secondsFromTime', 1, paramdef, args);
    return new types.XsDecimal('fn', 'seconds-from-time', checkedArgs);
    }
/**
    * Returns true if the first parameter starts with the string from the second parameter, otherwise returns false. Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.startsWith|fn.startsWith}
    * @method planBuilder.fn#startsWith
    * @since 2.1.1
    * @param { XsString } [parameter1] - The string from which to test.
    * @param { XsString } [parameter2] - The string to test whether it is at the beginning of the first parameter.
    * @param { XsString } [collation] - The optional name of a valid collation URI. For information on the collation URI syntax, see the Search Developer's Guide.
    * @returns { XsBoolean }
    */
startsWith(...args) {
    const namer = bldrbase.getNamer(args, 'parameter1');
    const paramdefs = [['parameter1', [types.XsString, PlanColumn, PlanParam], false, false], ['parameter2', [types.XsString, PlanColumn, PlanParam], false, false], ['collation', [types.XsString, PlanColumn, PlanParam], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.startsWith', 2, new Set(['parameter1', 'parameter2', 'collation']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.startsWith', 2, false, paramdefs, args);
    return new types.XsBoolean('fn', 'starts-with', checkedArgs);

    }
/**
    * Returns the value of arg represented as an xs:string. If no argument is supplied, this function returns the string value of the context item (.). Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.string|fn.string}
    * @method planBuilder.fn#string
    * @since 2.1.1
    * @param { Item } [arg] - The item to be rendered as a string.
    * @returns { XsString }
    */
string(...args) {
    const paramdef = ['arg', [types.Item, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.string', 1, paramdef, args);
    return new types.XsString('fn', 'string', checkedArgs);
    }
/**
    * Returns an xs:string created by concatenating the members of the parameter1 sequence using parameter2 as a separator. If the value of arg2 is the zero-length string, then the members of parameter1 are concatenated without a separator.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.stringJoin|fn.stringJoin}
    * @method planBuilder.fn#stringJoin
    * @since 2.1.1
    * @param { XsString } [parameter1] - A sequence of strings.
    * @param { XsString } [parameter2] - A separator string to concatenate between the items in $parameter1.
    * @returns { XsString }
    */
stringJoin(...args) {
    const namer = bldrbase.getNamer(args, 'parameter1');
    const paramdefs = [['parameter1', [types.XsString, PlanColumn, PlanParam], false, true], ['parameter2', [types.XsString, PlanColumn, PlanParam], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.stringJoin', 2, new Set(['parameter1', 'parameter2']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.stringJoin', 2, false, paramdefs, args);
    return new types.XsString('fn', 'string-join', checkedArgs);

    }
/**
    * Returns an integer representing the length of the specified string. The length is 1-based, so a string that is one character long returns a value of 1. Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.stringLength|fn.stringLength}
    * @method planBuilder.fn#stringLength
    * @since 2.1.1
    * @param { XsString } [sourceString] - The string to calculate the length.
    * @returns { XsInteger }
    */
stringLength(...args) {
    const paramdef = ['sourceString', [types.XsString, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.stringLength', 1, paramdef, args);
    return new types.XsInteger('fn', 'string-length', checkedArgs);
    }
/**
    * Returns the sequence of Unicode code points that constitute an xs:string. If arg is a zero-length string or the empty sequence, the empty sequence is returned.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.stringToCodepoints|fn.stringToCodepoints}
    * @method planBuilder.fn#stringToCodepoints
    * @since 2.1.1
    * @param { XsString } [arg] - A string.
    * @returns { XsInteger }
    */
stringToCodepoints(...args) {
    const paramdef = ['arg', [types.XsString, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.stringToCodepoints', 1, paramdef, args);
    return new types.XsInteger('fn', 'string-to-codepoints', checkedArgs);
    }
/**
    * Returns the contiguous sequence of items in the value of sourceSeq beginning at the position indicated by the value of startingLoc and continuing for the number of items indicated by the value of length.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.subsequence|fn.subsequence}
    * @method planBuilder.fn#subsequence
    * @since 2.1.1
    * @param { Item } [sourceSeq] - The sequence of items from which a subsequence will be selected.
    * @param { XsNumeric } [startingLoc] - The starting position of the start of the subsequence.
    * @param { XsNumeric } [length] - The length of the subsequence.
    * @returns { Item }
    */
subsequence(...args) {
    const namer = bldrbase.getNamer(args, 'sourceSeq');
    const paramdefs = [['sourceSeq', [types.Item, PlanColumn, PlanParam], false, true], ['startingLoc', [types.XsNumeric, PlanColumn, PlanParam], true, false], ['length', [types.XsNumeric, PlanColumn, PlanParam], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.subsequence', 2, new Set(['sourceSeq', 'startingLoc', 'length']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.subsequence', 2, false, paramdefs, args);
    return new types.Item('fn', 'subsequence', checkedArgs);

    }
/**
    * Returns a substring starting from the startingLoc and continuing for length characters. Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.substring|fn.substring}
    * @method planBuilder.fn#substring
    * @since 2.1.1
    * @param { XsString } [sourceString] - The string from which to create a substring.
    * @param { XsNumeric } [startingLoc] - The number of characters from the start of the $sourceString.
    * @param { XsNumeric } [length] - The number of characters beyond the $startingLoc.
    * @returns { XsString }
    */
substring(...args) {
    const namer = bldrbase.getNamer(args, 'sourceString');
    const paramdefs = [['sourceString', [types.XsString, PlanColumn, PlanParam], false, false], ['startingLoc', [types.XsNumeric, PlanColumn, PlanParam], true, false], ['length', [types.XsNumeric, PlanColumn, PlanParam], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.substring', 2, new Set(['sourceString', 'startingLoc', 'length']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.substring', 2, false, paramdefs, args);
    return new types.XsString('fn', 'substring', checkedArgs);

    }
/**
    * Returns the substring created by taking all of the input characters that occur after the specified after characters. Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.substringAfter|fn.substringAfter}
    * @method planBuilder.fn#substringAfter
    * @since 2.1.1
    * @param { XsString } [input] - The string from which to create the substring.
    * @param { XsString } [after] - The string after which the substring is created.
    * @param { XsString } [collation] - The optional name of a valid collation URI. For information on the collation URI syntax, see the Search Developer's Guide.
    * @returns { XsString }
    */
substringAfter(...args) {
    const namer = bldrbase.getNamer(args, 'input');
    const paramdefs = [['input', [types.XsString, PlanColumn, PlanParam], false, false], ['after', [types.XsString, PlanColumn, PlanParam], false, false], ['collation', [types.XsString, PlanColumn, PlanParam], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.substringAfter', 2, new Set(['input', 'after', 'collation']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.substringAfter', 2, false, paramdefs, args);
    return new types.XsString('fn', 'substring-after', checkedArgs);

    }
/**
    * Returns the substring created by taking all of the input characters that occur before the specified before characters. Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.substringBefore|fn.substringBefore}
    * @method planBuilder.fn#substringBefore
    * @since 2.1.1
    * @param { XsString } [input] - The string from which to create the substring.
    * @param { XsString } [before] - The string before which the substring is created.
    * @param { XsString } [collation] - The optional name of a valid collation URI. For information on the collation URI syntax, see the Search Developer's Guide.
    * @returns { XsString }
    */
substringBefore(...args) {
    const namer = bldrbase.getNamer(args, 'input');
    const paramdefs = [['input', [types.XsString, PlanColumn, PlanParam], false, false], ['before', [types.XsString, PlanColumn, PlanParam], false, false], ['collation', [types.XsString, PlanColumn, PlanParam], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.substringBefore', 2, new Set(['input', 'before', 'collation']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.substringBefore', 2, false, paramdefs, args);
    return new types.XsString('fn', 'substring-before', checkedArgs);

    }
/**
    * Returns a value obtained by adding together the values in arg. If zero is not specified, then the value returned for an empty sequence is the xs:integer value 0. If zero is specified, then the value returned for an empty sequence is zero.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.sum|fn.sum}
    * @method planBuilder.fn#sum
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg] - The sequence of values to be summed.
    * @param { XsAnyAtomicType } [zero] - The value to return as zero if the input sequence is the empty sequence. This parameter is not available in the 0.9-ml XQuery dialect.
    * @returns { XsAnyAtomicType }
    */
sum(...args) {
    const namer = bldrbase.getNamer(args, 'arg');
    const paramdefs = [['arg', [types.XsAnyAtomicType, PlanColumn, PlanParam], false, true], ['zero', [types.XsAnyAtomicType, PlanColumn, PlanParam], false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.sum', 1, new Set(['arg', 'zero']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.sum', 1, false, paramdefs, args);
    return new types.XsAnyAtomicType('fn', 'sum', checkedArgs);

    }
/**
    * Returns all but the first item in a sequence. For more details, see XPath 3.0 Functions and Operators. Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.tail|fn.tail}
    * @method planBuilder.fn#tail
    * @since 2.1.1
    * @param { Item } [seq] - The function value.
    * @returns { Item }
    */
tail(...args) {
    const paramdef = ['seq', [types.Item, PlanColumn, PlanParam], false, true];
    const checkedArgs = bldrbase.makeSingleArgs('fn.tail', 1, paramdef, args);
    return new types.Item('fn', 'tail', checkedArgs);
    }
/**
    * Returns the timezone component of arg if any. If arg has a timezone component, then the result is an xs:dayTimeDuration that indicates deviation from UTC; its value may range from +14:00 to -14:00 hours, both inclusive. Otherwise, the result is the empty sequence.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.timezoneFromDate|fn.timezoneFromDate}
    * @method planBuilder.fn#timezoneFromDate
    * @since 2.1.1
    * @param { XsDate } [arg] - The date whose timezone component will be returned.
    * @returns { XsDayTimeDuration }
    */
timezoneFromDate(...args) {
    const paramdef = ['arg', [types.XsDate, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.timezoneFromDate', 1, paramdef, args);
    return new types.XsDayTimeDuration('fn', 'timezone-from-date', checkedArgs);
    }
/**
    * Returns the timezone component of arg if any. If arg has a timezone component, then the result is an xs:dayTimeDuration that indicates deviation from UTC; its value may range from +14:00 to -14:00 hours, both inclusive. Otherwise, the result is the empty sequence.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.timezoneFromDateTime|fn.timezoneFromDateTime}
    * @method planBuilder.fn#timezoneFromDateTime
    * @since 2.1.1
    * @param { XsDateTime } [arg] - The dateTime whose timezone component will be returned.
    * @returns { XsDayTimeDuration }
    */
timezoneFromDateTime(...args) {
    const paramdef = ['arg', [types.XsDateTime, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.timezoneFromDateTime', 1, paramdef, args);
    return new types.XsDayTimeDuration('fn', 'timezone-from-dateTime', checkedArgs);
    }
/**
    * Returns the timezone component of arg if any. If arg has a timezone component, then the result is an xs:dayTimeDuration that indicates deviation from UTC; its value may range from +14:00 to -14:00 hours, both inclusive. Otherwise, the result is the empty sequence.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.timezoneFromTime|fn.timezoneFromTime}
    * @method planBuilder.fn#timezoneFromTime
    * @since 2.1.1
    * @param { XsTime } [arg] - The time whose timezone component will be returned.
    * @returns { XsDayTimeDuration }
    */
timezoneFromTime(...args) {
    const paramdef = ['arg', [types.XsTime, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.timezoneFromTime', 1, paramdef, args);
    return new types.XsDayTimeDuration('fn', 'timezone-from-time', checkedArgs);
    }
/**
    * Returns a sequence of strings constructed by breaking the specified input into substrings separated by the specified pattern. The specified pattern is not returned as part of the returned items. Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.tokenize|fn.tokenize}
    * @method planBuilder.fn#tokenize
    * @since 2.1.1
    * @param { XsString } [input] - The string to tokenize.
    * @param { XsString } [pattern] - The regular expression pattern from which to separate the tokens.
    * @param { XsString } [flags] - The flag representing how to interpret the regular expression. One of "s", "m", "i", or "x", as defined in http://www.w3.org/TR/xpath-functions/#flags.
    * @returns { XsString }
    */
tokenize(...args) {
    const namer = bldrbase.getNamer(args, 'input');
    const paramdefs = [['input', [types.XsString, PlanColumn, PlanParam], false, false], ['pattern', [types.XsString, PlanColumn, PlanParam], true, false], ['flags', [types.XsString, PlanColumn, PlanParam], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.tokenize', 2, new Set(['input', 'pattern', 'flags']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.tokenize', 2, false, paramdefs, args);
    return new types.XsString('fn', 'tokenize', checkedArgs);

    }
/**
    * Returns a string where every character in src that occurs in some position in the mapString is translated into the transString character in the corresponding location of the mapString character. Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.translate|fn.translate}
    * @method planBuilder.fn#translate
    * @since 2.1.1
    * @param { XsString } [src] - The string to translate characters.
    * @param { XsString } [mapString] - The string representing characters to be translated.
    * @param { XsString } [transString] - The string representing the characters to which the $mapString characters are translated.
    * @returns { XsString }
    */
translate(...args) {
    const namer = bldrbase.getNamer(args, 'src');
    const paramdefs = [['src', [types.XsString, PlanColumn, PlanParam], false, false], ['mapString', [types.XsString, PlanColumn, PlanParam], true, false], ['transString', [types.XsString, PlanColumn, PlanParam], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.translate', 3, new Set(['src', 'mapString', 'transString']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.translate', 3, false, paramdefs, args);
    return new types.XsString('fn', 'translate', checkedArgs);

    }
/**
    * Returns the xs:boolean value true. Equivalent to xs:boolean("1"). Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.true|fn.true}
    * @method planBuilder.fn#true
    * @since 2.1.1

    * @returns { XsBoolean }
    */
true(...args) {
    bldrbase.checkMaxArity('fn.true', args.length, 0);
    return new types.XsBoolean('fn', 'true', args);
    }
/**
    * Returns the items of sourceSeq in an implementation dependent order.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.unordered|fn.unordered}
    * @method planBuilder.fn#unordered
    * @since 2.1.1
    * @param { Item } [sourceSeq] - The sequence of items.
    * @returns { Item }
    */
unordered(...args) {
    const paramdef = ['sourceSeq', [types.Item, PlanColumn, PlanParam], false, true];
    const checkedArgs = bldrbase.makeSingleArgs('fn.unordered', 1, paramdef, args);
    return new types.Item('fn', 'unordered', checkedArgs);
    }
/**
    * Returns the specified string converting all of the characters to upper-case characters. If a character does not have a corresponding upper-case character, then the original character is returned. The upper-case characters are determined using the Unicode Case Mappings. Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.upperCase|fn.upperCase}
    * @method planBuilder.fn#upperCase
    * @since 2.1.1
    * @param { XsString } [string] - The string to upper-case.
    * @returns { XsString }
    */
upperCase(...args) {
    const paramdef = ['string', [types.XsString, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.upperCase', 1, paramdef, args);
    return new types.XsString('fn', 'upper-case', checkedArgs);
    }
/**
    * Returns an xs:integer representing the year component in the localized value of arg. The result may be negative.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.yearFromDate|fn.yearFromDate}
    * @method planBuilder.fn#yearFromDate
    * @since 2.1.1
    * @param { XsDate } [arg] - The date whose year component will be returned.
    * @returns { XsInteger }
    */
yearFromDate(...args) {
    const paramdef = ['arg', [types.XsDate, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.yearFromDate', 1, paramdef, args);
    return new types.XsInteger('fn', 'year-from-date', checkedArgs);
    }
/**
    * Returns an xs:integer representing the year component in the localized value of arg. The result may be negative.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.yearFromDateTime|fn.yearFromDateTime}
    * @method planBuilder.fn#yearFromDateTime
    * @since 2.1.1
    * @param { XsDateTime } [arg] - The dateTime whose year component will be returned.
    * @returns { XsInteger }
    */
yearFromDateTime(...args) {
    const paramdef = ['arg', [types.XsDateTime, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.yearFromDateTime', 1, paramdef, args);
    return new types.XsInteger('fn', 'year-from-dateTime', checkedArgs);
    }
/**
    * Returns an xs:integer representing the years component in the canonical lexical representation of the value of arg. The result may be negative.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.yearsFromDuration|fn.yearsFromDuration}
    * @method planBuilder.fn#yearsFromDuration
    * @since 2.1.1
    * @param { XsDuration } [arg] - The duration whose year component will be returned.
    * @returns { XsInteger }
    */
yearsFromDuration(...args) {
    const paramdef = ['arg', [types.XsDuration, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.yearsFromDuration', 1, paramdef, args);
    return new types.XsInteger('fn', 'years-from-duration', checkedArgs);
    }
}
class GeoExpr {
  constructor() {
  }
  /**
    * Return a point approximating the center of the given region. For a point, this is the point itself. For a circle, it is the center point. For a box, it is the point whose latitude is half-way between the northern and southern limits and whose longitude is half-way between the western and eastern limits. For polygons, complex polygons, and linestrings, an approximate centroid is returned. This approximation is rough, and useful for quick comparisons. Provides a client interface to a server function. See {@link http://docs.marklogic.com/geo.approxCenter|geo.approxCenter}
    * @method planBuilder.geo#approxCenter
    * @since 2.1.1
    * @param { CtsRegion } [region] - A geospatial region.
    * @param { XsString } [options] - Options. The default is ().  Options include:  "box-percent=n" An integer between 0 and 100 (default is 100) that indicates what percentage of a polygon's bounding box slivers should be used in constructing the approximate centroid. Lower numbers use fewer slivers, giving faster but less accurate results; larger numbers use more slivers, giving slower but more accurate results.  "coordinate-system=string" Use the given coordinate system. Valid values are:  wgs84The WGS84 coordinate system. wgs84/doubleThe WGS84 coordinate system at double precision. etrs89The ETRS89 coordinate system. etrs89/doubleThe ETRS89 coordinate system at double precision. rawThe raw (unmapped) coordinate system. raw/doubleThe raw coordinate system at double precision.   "precision=value" The precision use for this operation, including the interpretation of input values. Allowed values: float, double. Default: The precision of the governing coordinate system.  
    * @returns { CtsPoint }
    */
approxCenter(...args) {
    const namer = bldrbase.getNamer(args, 'region');
    const paramdefs = [['region', [types.CtsRegion, PlanColumn, PlanParam], true, false], ['options', [types.XsString, PlanColumn, PlanParam], false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'geo.approxCenter', 1, new Set(['region', 'options']), paramdefs, args) :
        bldrbase.makePositionalArgs('geo.approxCenter', 1, false, paramdefs, args);
    return new types.CtsPoint('geo', 'approx-center', checkedArgs);

    }
/**
    * Returns the point at the intersection of two arcs. If the arcs do not intersect, or lie on the same great circle, or if either arc covers more than 180 degrees, an error is raised. Provides a client interface to a server function. See {@link http://docs.marklogic.com/geo.arcIntersection|geo.arcIntersection}
    * @method planBuilder.geo#arcIntersection
    * @since 2.1.1
    * @param { CtsPoint } [p1] - The starting point of the first arc.
    * @param { CtsPoint } [p2] - The ending point of the first arc.
    * @param { CtsPoint } [q1] - The starting point of the second arc.
    * @param { CtsPoint } [q2] - The ending point of the second arc.
    * @param { XsString } [options] - Options for the operation. The default is (). Options include:   "coordinate-system=string" Use the given coordinate system. Valid values are:  wgs84The WGS84 coordinate system. wgs84/doubleThe WGS84 coordinate system at double precision. etrs89The ETRS89 coordinate system. etrs89/doubleThe ETRS89 coordinate system at double precision. rawThe raw (unmapped) coordinate system. raw/doubleThe raw coordinate system at double precision.   "precision=value" Use the coordinate system at the given precision. Allowed values: float and double. "units=value" Measure distance and the radii of circles in the specified units. Allowed values: miles (default), km, feet, meters. "tolerance=distance" Tolerance is the largest allowable variation in geometry calculations. If the distance between two points is less than tolerance, then the two points are considered equal. For the raw coordinate system, use the units of the coordinates. For geographic coordinate systems, use the units specified by the units option.  
    * @returns { CtsPoint }
    */
arcIntersection(...args) {
    const namer = bldrbase.getNamer(args, 'p1');
    const paramdefs = [['p1', [types.CtsPoint, PlanColumn, PlanParam], true, false], ['p2', [types.CtsPoint, PlanColumn, PlanParam], true, false], ['q1', [types.CtsPoint, PlanColumn, PlanParam], true, false], ['q2', [types.CtsPoint, PlanColumn, PlanParam], true, false], ['options', [types.XsString, PlanColumn, PlanParam], false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'geo.arcIntersection', 4, new Set(['p1', 'p2', 'q1', 'q2', 'options']), paramdefs, args) :
        bldrbase.makePositionalArgs('geo.arcIntersection', 4, false, paramdefs, args);
    return new types.CtsPoint('geo', 'arc-intersection', checkedArgs);

    }
/**
    * Returns the true bearing in radians of the path from the first point to the second. An error is raised if the two points are the same. Provides a client interface to a server function. See {@link http://docs.marklogic.com/geo.bearing|geo.bearing}
    * @method planBuilder.geo#bearing
    * @since 2.1.1
    * @param { CtsPoint } [p1] - The first point.
    * @param { CtsPoint } [p2] - The second point.
    * @param { XsString } [options] - Options for the operation. The default is (). Options include:   "coordinate-system=string" Use the given coordinate system. Valid values are:  wgs84The WGS84 coordinate system. wgs84/doubleThe WGS84 coordinate system at double precision. etrs89The ETRS89 coordinate system. etrs89/doubleThe ETRS89 coordinate system at double precision. rawThe raw (unmapped) coordinate system. raw/doubleThe raw coordinate system at double precision.   "precision=value" Use the coordinate system at the given precision. Allowed values: float and double.  "units=value" Unit of measure of the tolerance value. Valid values are miles (default), km, feet, meters. "tolerance=distance" Tolerance is the largest allowable variation in geometry calculations. If the distance between two points is less than tolerance, then the two points are considered equal. For the raw coordinate system, use the units of the coordinates. For geographic coordinate systems, use the units specified by the units option.  
    * @returns { XsDouble }
    */
bearing(...args) {
    const namer = bldrbase.getNamer(args, 'p1');
    const paramdefs = [['p1', [types.CtsPoint, PlanColumn, PlanParam], true, false], ['p2', [types.CtsPoint, PlanColumn, PlanParam], true, false], ['options', [types.XsString, PlanColumn, PlanParam], false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'geo.bearing', 2, new Set(['p1', 'p2', 'options']), paramdefs, args) :
        bldrbase.makePositionalArgs('geo.bearing', 2, false, paramdefs, args);
    return new types.XsDouble('geo', 'bearing', checkedArgs);

    }
/**
    * Returns a sequence of boxes that bound the given region. Provides a client interface to a server function. See {@link http://docs.marklogic.com/geo.boundingBoxes|geo.boundingBoxes}
    * @method planBuilder.geo#boundingBoxes
    * @since 2.1.1
    * @param { CtsRegion } [region] - A geographic region (box, circle, polygon, or point).
    * @param { XsString } [options] - Options for the operation. The default is (). Options include: Options include:   "coordinate-system=string" Use the given coordinate system. Valid values are:  wgs84The WGS84 coordinate system. wgs84/doubleThe WGS84 coordinate system at double precision. etrs89The ETRS89 coordinate system. etrs89/doubleThe ETRS89 coordinate system at double precision. rawThe raw (unmapped) coordinate system. raw/doubleThe raw coordinate system at double precision.   "precision=value" Use the coordinate system at the given precision. Allowed values: float and double. "units=value" Measure distance, radii of circles, and tolerance in the specified units. Allowed values: miles (default), km, feet, meters. "box-percent=n" An integer between 0 and 100 (default is 100) that indicates what percentage of a polygon's bounding box slivers should be returned. Lower numbers give fewer, less accurate boxes; larger numbers give more, more accurate boxes. "tolerance=distance" Tolerance is the largest allowable variation in geometry calculations. The bounding boxes will be padded to cover any points within tolerance of the region. For the raw coordinate system, use the units of the coordinates. For geographic coordinate systems, use the units specified by the units option. The default value is 0 (no padding). "boundaries-included" Points on boxes', circles', and polygons' boundaries are counted as matching. This is the default. "boundaries-excluded" Points on boxes', circles', and polygons' boundaries are not counted as matching. "boundaries-latitude-excluded" Points on boxes' latitude boundaries are not counted as matching. "boundaries-longitude-excluded" Points on boxes' longitude boundaries are not counted as matching. "boundaries-south-excluded" Points on the boxes' southern boundaries are not counted as matching. "boundaries-west-excluded" Points on the boxes' western boundaries are not counted as matching. "boundaries-north-excluded" Points on the boxes' northern boundaries are not counted as matching. "boundaries-east-excluded" Points on the boxes' eastern boundaries are not counted as matching. "boundaries-circle-excluded" Points on circles' boundary are not counted as matching. "boundaries-endpoints-excluded" Points on linestrings' boundary (the endpoints) are not counted as matching. 
    * @returns { CtsBox }
    */
boundingBoxes(...args) {
    const namer = bldrbase.getNamer(args, 'region');
    const paramdefs = [['region', [types.CtsRegion, PlanColumn, PlanParam], true, false], ['options', [types.XsString, PlanColumn, PlanParam], false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'geo.boundingBoxes', 1, new Set(['region', 'options']), paramdefs, args) :
        bldrbase.makePositionalArgs('geo.boundingBoxes', 1, false, paramdefs, args);
    return new types.CtsBox('geo', 'bounding-boxes', checkedArgs);

    }
/**
    * Returns true if the box intersects with a region. Provides a client interface to a server function. See {@link http://docs.marklogic.com/geo.boxIntersects|geo.boxIntersects}
    * @method planBuilder.geo#boxIntersects
    * @since 2.1.1
    * @param { CtsBox } [box] - A geographic box.
    * @param { CtsRegion } [region] - One or more geographic regions (boxes, circles, polygons, or points). Where multiple regions are specified, return true if any region intersects the box.
    * @param { XsString } [options] - Options for the operation. The default is (). Options include: Options include:   "coordinate-system=string" Use the given coordinate system. Valid values are:  wgs84The WGS84 coordinate system. wgs84/doubleThe WGS84 coordinate system at double precision. etrs89The ETRS89 coordinate system. etrs89/doubleThe ETRS89 coordinate system at double precision. rawThe raw (unmapped) coordinate system. raw/doubleThe raw coordinate system at double precision.   "precision=value" Use the coordinate system at the given precision. Allowed values: float and double. "units=value" Measure distance, radii of circles, and tolerance in the specified units. Allowed values: miles (default), km, feet, meters. "tolerance=distance" Tolerance is the largest allowable variation in geometry calculations. If the distance between two points is less than tolerance, then the two points are considered equal. For the raw coordinate system, use the units of the coordinates. For geographic coordinate systems, use the units specified by the units option. "boundaries-included" Points on boxes', circles', and polygons' boundaries are counted as matching. This is the default. "boundaries-excluded" Points on boxes', circles', and polygons' boundaries are not counted as matching. "boundaries-latitude-excluded" Points on boxes' latitude boundaries are not counted as matching. "boundaries-longitude-excluded" Points on boxes' longitude boundaries are not counted as matching. "boundaries-south-excluded" Points on the boxes' southern boundaries are not counted as matching. "boundaries-west-excluded" Points on the boxes' western boundaries are not counted as matching. "boundaries-north-excluded" Points on the boxes' northern boundaries are not counted as matching. "boundaries-east-excluded" Points on the boxes' eastern boundaries are not counted as matching. "boundaries-circle-excluded" Points on circles' boundary are not counted as matching. "boundaries-endpoints-excluded" Points on linestrings' boundary (the endpoints) are not counted as matching. 
    * @returns { XsBoolean }
    */
boxIntersects(...args) {
    const namer = bldrbase.getNamer(args, 'box');
    const paramdefs = [['box', [types.CtsBox, PlanColumn, PlanParam], true, false], ['region', [types.CtsRegion, PlanColumn, PlanParam], false, true], ['options', [types.XsString, PlanColumn, PlanParam], false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'geo.boxIntersects', 2, new Set(['box', 'region', 'options']), paramdefs, args) :
        bldrbase.makePositionalArgs('geo.boxIntersects', 2, false, paramdefs, args);
    return new types.XsBoolean('geo', 'box-intersects', checkedArgs);

    }
/**
    * Returns true if the circle intersects with a region. Provides a client interface to a server function. See {@link http://docs.marklogic.com/geo.circleIntersects|geo.circleIntersects}
    * @method planBuilder.geo#circleIntersects
    * @since 2.1.1
    * @param { CtsCircle } [circle] - A geographic circle.
    * @param { CtsRegion } [region] - One or more geographic regions (boxes, circles, polygons, or points). Where multiple regions are specified, return true if any region intersects the target circle.
    * @param { XsString } [options] - Options for the operation. The default is (). Options include:   "coordinate-system=string" Use the given coordinate system. Valid values are:  wgs84The WGS84 coordinate system. wgs84/doubleThe WGS84 coordinate system at double precision. etrs89The ETRS89 coordinate system. etrs89/doubleThe ETRS89 coordinate system at double precision. rawThe raw (unmapped) coordinate system. raw/doubleThe raw coordinate system at double precision.   "precision=value" Use the coordinate system at the given precision. Allowed values: float and double. "units=value" Measure distance, radii of circles, and tolerance in the specified units. Allowed values: miles (default), km, feet, meters. "tolerance=distance" Tolerance is the largest allowable variation in geometry calculations. If the distance between two points is less than tolerance, then the two points are considered equal. For the raw coordinate system, use the units of the coordinates. For geographic coordinate systems, use the units specified by the units option. "boundaries-included" Points on boxes', circles', and polygons' boundaries are counted as matching. This is the default. "boundaries-excluded" Points on boxes', circles', and polygons' boundaries are not counted as matching. "boundaries-latitude-excluded" Points on boxes' latitude boundaries are not counted as matching. "boundaries-longitude-excluded" Points on boxes' longitude boundaries are not counted as matching. "boundaries-south-excluded" Points on the boxes' southern boundaries are not counted as matching. "boundaries-west-excluded" Points on the boxes' western boundaries are not counted as matching. "boundaries-north-excluded" Points on the boxes' northern boundaries are not counted as matching. "boundaries-east-excluded" Points on the boxes' eastern boundaries are not counted as matching. "boundaries-circle-excluded" Points on circles' boundary are not counted as matching. "boundaries-endpoints-excluded" Points on linestrings' boundary (the endpoints) are not counted as matching. 
    * @returns { XsBoolean }
    */
circleIntersects(...args) {
    const namer = bldrbase.getNamer(args, 'circle');
    const paramdefs = [['circle', [types.CtsCircle, PlanColumn, PlanParam], true, false], ['region', [types.CtsRegion, PlanColumn, PlanParam], false, true], ['options', [types.XsString, PlanColumn, PlanParam], false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'geo.circleIntersects', 2, new Set(['circle', 'region', 'options']), paramdefs, args) :
        bldrbase.makePositionalArgs('geo.circleIntersects', 2, false, paramdefs, args);
    return new types.XsBoolean('geo', 'circle-intersects', checkedArgs);

    }
/**
    * Construct a polygon approximating a circle. Provides a client interface to a server function. See {@link http://docs.marklogic.com/geo.circlePolygon|geo.circlePolygon}
    * @method planBuilder.geo#circlePolygon
    * @since 2.1.1
    * @param { CtsCircle } [circle] - A cts circle that defines the circle to be approximated.
    * @param { XsDouble } [arcTolerance] - How far the approximation can be from the actual circle, specified in the same units as the units option. Arc-tolerance should be greater than the value of the tolerance option.
    * @param { XsString } [options] - Options with which you can customize this operation. The following options are available:   "coordinate-system=value" Use the given coordinate system. Valid values are wgs84, wgs84/double, etrs89, etrs89/double, raw and raw/double. Defaults to the governing coordinating system. "precision=value" Use the coordinate system at the given precision. Allowed values: float and double. Defaults to the precision of the governing coordinate system. "units=value" Measure distance, radii of circles, and tolerance in the specified units. Allowed values: miles (default), km, feet, meters. "tolerance=distance" Tolerance is the largest allowable variation in geometry calculations. If the distance between two points is less than tolerance, then the two points are considered equal. For the raw coordinate system, use the units of the coordinates. For geographic coordinate systems, use the units specified by the units option. Tolerance should be smaller than the value of the arc-tolerance parameter.  
    * @returns { CtsPolygon }
    */
circlePolygon(...args) {
    const namer = bldrbase.getNamer(args, 'circle');
    const paramdefs = [['circle', [types.CtsCircle, PlanColumn, PlanParam], true, false], ['arc-tolerance', [types.XsDouble, PlanColumn, PlanParam], true, false], ['options', [types.XsString, PlanColumn, PlanParam], false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'geo.circlePolygon', 2, new Set(['circle', 'arc-tolerance', 'options']), paramdefs, args) :
        bldrbase.makePositionalArgs('geo.circlePolygon', 2, false, paramdefs, args);
    return new types.CtsPolygon('geo', 'circle-polygon', checkedArgs);

    }
/**
    * Return a count of the distinct number of vertices in a region, taking tolerance into account. Provides a client interface to a server function. See {@link http://docs.marklogic.com/geo.countDistinctVertices|geo.countDistinctVertices}
    * @method planBuilder.geo#countDistinctVertices
    * @since 2.1.1
    * @param { CtsRegion } [region] - A cts region.
    * @param { XsString } [options] - Options include:   "coordinate-system=value" Use the given coordinate system. Valid values are wgs84, wgs84/double, etrs89, etrs89/double, raw and raw/double. Defaults to the governing coordinating system. "precision=value" Use the coordinate system at the given precision. Allowed values: float and double. Defaults to the precision of the governing coordinate system. "units=value" Measure distance, radii of circles, and tolerance in the specified units. Allowed values: miles (default), km, feet, meters. "tolerance=distance" Tolerance is the largest allowable variation in geometry calculations. If the distance between two points is less than tolerance, then the two points are considered equal. For the raw coordinate system, use the units of the coordinates. For geographic coordinate systems, use the units specified by the units option.  
    * @returns { XsInteger }
    */
countDistinctVertices(...args) {
    const namer = bldrbase.getNamer(args, 'region');
    const paramdefs = [['region', [types.CtsRegion, PlanColumn, PlanParam], true, false], ['options', [types.XsString, PlanColumn, PlanParam], false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'geo.countDistinctVertices', 1, new Set(['region', 'options']), paramdefs, args) :
        bldrbase.makePositionalArgs('geo.countDistinctVertices', 1, false, paramdefs, args);
    return new types.XsInteger('geo', 'count-distinct-vertices', checkedArgs);

    }
/**
    * This function returns a count of the number of vertices in a region. Provides a client interface to a server function. See {@link http://docs.marklogic.com/geo.countVertices|geo.countVertices}
    * @method planBuilder.geo#countVertices
    * @since 2.1.1
    * @param { CtsRegion } [region] - A cts region.
    * @returns { XsInteger }
    */
countVertices(...args) {
    const paramdef = ['region', [types.CtsRegion, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('geo.countVertices', 1, paramdef, args);
    return new types.XsInteger('geo', 'count-vertices', checkedArgs);
    }
/**
    * Returns the point at the given distance (in units) along the given bearing (in radians) from the starting point. Provides a client interface to a server function. See {@link http://docs.marklogic.com/geo.destination|geo.destination}
    * @method planBuilder.geo#destination
    * @since 2.1.1
    * @param { CtsPoint } [p] - The starting point.
    * @param { XsDouble } [bearing] - The bearing, in radians.
    * @param { XsDouble } [distance] - The distance, in units. See the units option, below.
    * @param { XsString } [options] - Options for the operation. The default is (). Options include:   "coordinate-system=string" Use the given coordinate system. Valid values are:  wgs84The WGS84 coordinate system. wgs84/doubleThe WGS84 coordinate system at double precision. etrs89The ETRS89 coordinate system. etrs89/doubleThe ETRS89 coordinate system at double precision. rawThe raw (unmapped) coordinate system. raw/doubleThe raw coordinate system at double precision.   "precision=value" Use the coordinate system at the given precision. Allowed values: float and double. "units=value" Measure distance and the radii of circles in the specified units. Allowed values: miles (default), km, feet, meters.  
    * @returns { CtsPoint }
    */
destination(...args) {
    const namer = bldrbase.getNamer(args, 'p');
    const paramdefs = [['p', [types.CtsPoint, PlanColumn, PlanParam], true, false], ['bearing', [types.XsDouble, PlanColumn, PlanParam], true, false], ['distance', [types.XsDouble, PlanColumn, PlanParam], true, false], ['options', [types.XsString, PlanColumn, PlanParam], false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'geo.destination', 3, new Set(['p', 'bearing', 'distance', 'options']), paramdefs, args) :
        bldrbase.makePositionalArgs('geo.destination', 3, false, paramdefs, args);
    return new types.CtsPoint('geo', 'destination', checkedArgs);

    }
/**
    * Returns the distance (in units) between two points. Provides a client interface to a server function. See {@link http://docs.marklogic.com/geo.distance|geo.distance}
    * @method planBuilder.geo#distance
    * @since 2.1.1
    * @param { CtsPoint } [p1] - The first point.
    * @param { CtsPoint } [p2] - The second point.
    * @param { XsString } [options] - Options for the operation. The default is (). Options include:   "coordinate-system=string" Use the given coordinate system. Valid values are:  wgs84The WGS84 coordinate system. wgs84/doubleThe WGS84 coordinate system at double precision. etrs89The ETRS89 coordinate system. etrs89/doubleThe ETRS89 coordinate system at double precision. rawThe raw (unmapped) coordinate system. raw/doubleThe raw coordinate system at double precision.   "precision=value" Use the coordinate system at the given precision. Allowed values: float and double. "units=value" Measure distance and the radii of circles in the specified units. Allowed values: miles (default), km, feet, meters.  
    * @returns { XsDouble }
    */
distance(...args) {
    const namer = bldrbase.getNamer(args, 'p1');
    const paramdefs = [['p1', [types.CtsPoint, PlanColumn, PlanParam], true, false], ['p2', [types.CtsPoint, PlanColumn, PlanParam], true, false], ['options', [types.XsString, PlanColumn, PlanParam], false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'geo.distance', 2, new Set(['p1', 'p2', 'options']), paramdefs, args) :
        bldrbase.makePositionalArgs('geo.distance', 2, false, paramdefs, args);
    return new types.XsDouble('geo', 'distance', checkedArgs);

    }
/**
    * This function converts a distance from one unit of measure to another. The supported units are "miles", "feet", "km", and "meters". This is a proper superset of the units supported as options to various geospatial functions ("miles","km"). Provides a client interface to a server function. See {@link http://docs.marklogic.com/geo.distanceConvert|geo.distanceConvert}
    * @method planBuilder.geo#distanceConvert
    * @since 2.1.1
    * @param { XsDouble } [distance] - The distance.
    * @param { XsString } [unit1] - The unit of the input distance parameter.
    * @param { XsString } [unit2] - The unit to which the distance should be converted.
    * @returns { XsDouble }
    */
distanceConvert(...args) {
    const namer = bldrbase.getNamer(args, 'distance');
    const paramdefs = [['distance', [types.XsDouble, PlanColumn, PlanParam], true, false], ['unit1', [types.XsString, PlanColumn, PlanParam], false, true], ['unit2', [types.XsString, PlanColumn, PlanParam], false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'geo.distanceConvert', 3, new Set(['distance', 'unit1', 'unit2']), paramdefs, args) :
        bldrbase.makePositionalArgs('geo.distanceConvert', 3, false, paramdefs, args);
    return new types.XsDouble('geo', 'distance-convert', checkedArgs);

    }
/**
    * Construct a polygon approximating an ellipse. Provides a client interface to a server function. See {@link http://docs.marklogic.com/geo.ellipsePolygon|geo.ellipsePolygon}
    * @method planBuilder.geo#ellipsePolygon
    * @since 2.1.1
    * @param { CtsPoint } [center] - Center of the ellipse.
    * @param { XsDouble } [semiMajorAxis] - The semi major axis of the ellipse. The units are governed by the units option.
    * @param { XsDouble } [semiMinorAxis] - The semi minor axis of the ellipse. The units are governed by the units option.
    * @param { XsDouble } [azimuth] - The azimuth.
    * @param { XsDouble } [arcTolerance] - How far the approximation can be from the actual ellipse, specified in the same units as the units option. Arc-tolerance should be greater than the value of the tolerance option, which defaults to 0.05km (0.3106856 miles).
    * @param { XsString } [options] - Options with which to configure the behavior. Options include:   "coordinate-system=value" Use the given coordinate system. Valid values are wgs84, wgs84/double, etrs89, etrs89/double, raw and raw/double. Defaults to the governing coordinating system. "precision=value" Use the coordinate system at the given precision. Allowed values: float and double. Defaults to the precision of the governing coordinate system. "units=value" Measure distance, the axes of the ellipse, and tolerance in the specified units. Allowed values: miles (default), km, feet, meters. "tolerance=distance" Tolerance is the largest allowable variation in geometry calculations. If the distance between two points is less than tolerance, then the two points are considered equal. For the raw coordinate system, use the units of the coordinates. For geographic coordinate systems, use the units specified by the units option.  
    * @returns { CtsPolygon }
    */
ellipsePolygon(...args) {
    const namer = bldrbase.getNamer(args, 'center');
    const paramdefs = [['center', [types.CtsPoint, PlanColumn, PlanParam], false, true], ['semi-major-axis', [types.XsDouble, PlanColumn, PlanParam], true, false], ['semi-minor-axis', [types.XsDouble, PlanColumn, PlanParam], true, false], ['azimuth', [types.XsDouble, PlanColumn, PlanParam], true, false], ['arc-tolerance', [types.XsDouble, PlanColumn, PlanParam], true, false], ['options', [types.XsString, PlanColumn, PlanParam], false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'geo.ellipsePolygon', 5, new Set(['center', 'semi-major-axis', 'semi-minor-axis', 'azimuth', 'arc-tolerance', 'options']), paramdefs, args) :
        bldrbase.makePositionalArgs('geo.ellipsePolygon', 5, false, paramdefs, args);
    return new types.CtsPolygon('geo', 'ellipse-polygon', checkedArgs);

    }
/**
    * Given a geohash string, return the bounding box for that hash. Provides a client interface to a server function. See {@link http://docs.marklogic.com/geo.geohashDecode|geo.geohashDecode}
    * @method planBuilder.geo#geohashDecode
    * @since 2.1.1
    * @param { XsString } [hash] - The geohash value, as produced by geo:geohash-encode.
    * @returns { CtsBox }
    */
geohashDecode(...args) {
    const paramdef = ['hash', [types.XsString, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('geo.geohashDecode', 1, paramdef, args);
    return new types.CtsBox('geo', 'geohash-decode', checkedArgs);
    }
/**
    * Given a geohash string, return the point for that hash. Provides a client interface to a server function. See {@link http://docs.marklogic.com/geo.geohashDecodePoint|geo.geohashDecodePoint}
    * @method planBuilder.geo#geohashDecodePoint
    * @since 2.1.1
    * @param { XsString } [hash] - The geohash string, as produced from the function geo:geohash-encode.
    * @returns { CtsPoint }
    */
geohashDecodePoint(...args) {
    const paramdef = ['hash', [types.XsString, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('geo.geohashDecodePoint', 1, paramdef, args);
    return new types.CtsPoint('geo', 'geohash-decode-point', checkedArgs);
    }
/**
    * Compute a set of covering geohashes for the given region, to the given level of precision. Provides a client interface to a server function. See {@link http://docs.marklogic.com/geo.geohashEncode|geo.geohashEncode}
    * @method planBuilder.geo#geohashEncode
    * @since 2.1.1
    * @param { CtsRegion } [region] - The region to encode.
    * @param { XsInteger } [geohashPrecision] - The desired precision (length of the geohash). The precision should be between 1 and 12. If the precision is less than 1, or unspecified, the default geohash-precision of 6 is used. A geohash-precision greater than 12 is treated as the same as 12. In the worst case (at the equator) a precision of 12 gives resolution of less than a centimeter.
    * @param { XsString } [options] - Options for the operation. The default is (). Options include:   "coordinate-system=string" Use the given coordinate system. Valid values are:  wgs84The WGS84 coordinate system. wgs84/doubleThe WGS84 coordinate system at double precision. etrs89The ETRS89 coordinate system. etrs89/doubleThe ETRS89 coordinate system at double precision.  Geohashing is not allowed for non-geodetic coordinate systems. Attempting to use this function with the raw or raw/double coordinate system will result in an XDMP-GEOHASH-COORD error.  "precision=string" Use the coordinate system at the given precision. Allowed values: float (default) and double. "units=value" Measure distance, radii of circles, and tolerance in the specified units. Allowed values: miles (default), km, feet, meters. "tolerance=distance" Tolerance is the largest allowable variation in geometry calculations. If the distance between two points is less than tolerance, then the two points are considered equal. For the raw coordinate system, use the units of the coordinates. For geographic coordinate systems, use the units specified by the units option. geohashes=value Specify which geohashes to return. Allowed values:  all Return a complete set of covering hashes for the region (boundary + interior). This is the default behavior. boundary Return only geohashes that intersect with the boundary of the region. interior Return only geohashes completely contained in the interior of the region. exterior Return all geohashes disjoint from the region. That is, all geohashes completely contained in the exterior of the region.   
    * @returns { XsString }
    */
geohashEncode(...args) {
    const namer = bldrbase.getNamer(args, 'region');
    const paramdefs = [['region', [types.CtsRegion, PlanColumn, PlanParam], true, false], ['geohash-precision', [types.XsInteger, PlanColumn, PlanParam], false, false], ['options', [types.XsString, PlanColumn, PlanParam], false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'geo.geohashEncode', 1, new Set(['region', 'geohash-precision', 'options']), paramdefs, args) :
        bldrbase.makePositionalArgs('geo.geohashEncode', 1, false, paramdefs, args);
    return new types.XsString('geo', 'geohash-encode', checkedArgs);

    }
/**
    * Given a geohash string, return hashes for the neighbors. The result is a map with the keys "N", "NE", "E", "SE", "S", "SW", "W", "NW" for the neighbors in those directions. Provides a client interface to a server function. See {@link http://docs.marklogic.com/geo.geohashNeighbors|geo.geohashNeighbors}
    * @method planBuilder.geo#geohashNeighbors
    * @since 2.1.1
    * @param { XsString } [hash] - The geohash string, as produced by geo:geohash-encode.
    * @returns { MapMap }
    */
geohashNeighbors(...args) {
    const paramdef = ['hash', [types.XsString, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('geo.geohashNeighbors', 1, paramdef, args);
    return new types.MapMap('geo', 'geohash-neighbors', checkedArgs);
    }
/**
    * Given a geohash string, return the height and width for the given precision. The result is a pair of double: the height (latitude span) followed by the width (longitude span). Provides a client interface to a server function. See {@link http://docs.marklogic.com/geo.geohashPrecisionDimensions|geo.geohashPrecisionDimensions}
    * @method planBuilder.geo#geohashPrecisionDimensions
    * @since 2.1.1
    * @param { XsInteger } [precision] - The precision. This should be a number between 0 and 12, as with geo:geohash-encode.
    * @returns { XsDouble }
    */
geohashPrecisionDimensions(...args) {
    const paramdef = ['precision', [types.XsInteger, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('geo.geohashPrecisionDimensions', 1, paramdef, args);
    return new types.XsDouble('geo', 'geohash-precision-dimensions', checkedArgs);
    }
/**
    * Given a geohash string, return the 32 subhashes. Provides a client interface to a server function. See {@link http://docs.marklogic.com/geo.geohashSubhashes|geo.geohashSubhashes}
    * @method planBuilder.geo#geohashSubhashes
    * @since 2.1.1
    * @param { XsString } [hash] - The geohash string, as produced from the function geo:geohash-encode.
    * @param { XsString } [which] - Which subhashes to return, one of "S","W","N","E","SW","SE","NW","NE" or "ALL". The default is "ALL".
    * @returns { XsString }
    */
geohashSubhashes(...args) {
    const namer = bldrbase.getNamer(args, 'hash');
    const paramdefs = [['hash', [types.XsString, PlanColumn, PlanParam], true, false], ['which', [types.XsString, PlanColumn, PlanParam], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'geo.geohashSubhashes', 2, new Set(['hash', 'which']), paramdefs, args) :
        bldrbase.makePositionalArgs('geo.geohashSubhashes', 2, false, paramdefs, args);
    return new types.XsString('geo', 'geohash-subhashes', checkedArgs);

    }
/**
    * This function returns a point that is guaranteed to be inside the bounds of the given region. For a given region and set of options, the point returned should be stable from one call to the next. Provides a client interface to a server function. See {@link http://docs.marklogic.com/geo.interiorPoint|geo.interiorPoint}
    * @method planBuilder.geo#interiorPoint
    * @since 2.1.1
    * @param { CtsRegion } [region] - A cts region.
    * @param { XsString } [options] - Options include:   "coordinate-system=value" Use the given coordinate system. Valid values are wgs84, wgs84/double, etrs89, etrs89/double, raw and raw/double. Defaults to the governing coordinating system. "precision=value" Use the coordinate system at the given precision. Allowed values: float and double. Defaults to the precision of the governing coordinate system. "units=value" Measure distance, radii of circles, and tolerance in the specified units. Allowed values: miles (default), km, feet, meters. "tolerance=distance" Tolerance is the largest allowable variation in geometry calculations. If the distance between two points is less than tolerance, then the two points are considered equal. For the raw coordinate system, use the units of the coordinates. For geographic coordinate systems, use the units specified by the units option.  
    * @returns { CtsPoint }
    */
interiorPoint(...args) {
    const namer = bldrbase.getNamer(args, 'region');
    const paramdefs = [['region', [types.CtsRegion, PlanColumn, PlanParam], true, false], ['options', [types.XsString, PlanColumn, PlanParam], false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'geo.interiorPoint', 1, new Set(['region', 'options']), paramdefs, args) :
        bldrbase.makePositionalArgs('geo.interiorPoint', 1, false, paramdefs, args);
    return new types.CtsPoint('geo', 'interior-point', checkedArgs);

    }
/**
    * Returns a sequence of geospatial regions parsed from Well-Known Text format. Provides a client interface to a server function. See {@link http://docs.marklogic.com/geo.parseWkt|geo.parseWkt}
    * @method planBuilder.geo#parseWkt
    * @since 2.1.1
    * @param { XsString } [wkt] - A sequence of strings in Well-Known Text format.
    * @returns { CtsRegion }
    */
parseWkt(...args) {
    const paramdef = ['wkt', [types.XsString, PlanColumn, PlanParam], false, true];
    const checkedArgs = bldrbase.makeSingleArgs('geo.parseWkt', 1, paramdef, args);
    return new types.CtsRegion('geo', 'parse-wkt', checkedArgs);
    }
/**
    * Perform an affine transformation on a geospatial region. The transformation is always applied in the raw coordinate system (Cartesian). Provides a client interface to a server function. See {@link http://docs.marklogic.com/geo.regionAffineTransform|geo.regionAffineTransform}
    * @method planBuilder.geo#regionAffineTransform
    * @since 2.1.1
    * @param { CtsRegion } [region] - 
    * @param { MapMap } [transform] - A sequence of maps that specify the transformation to apply. Each map should contain at least one of the following transform specifications:  translation Translate the points of the region by the given amount in the x and y coordinates. The value is a map with the following keys:  txAmount to shift the points in the x direction. (Required.) tyAmount to shift the points in the y direction. (Required.)   scaling Scale the points of the region by the given amount of the x and y coordinates. The value is a map with the following keys:  sxAmount to scale the points in the x direction. (Required.) syAmount to scale the points in the y direction. (Required.) pscPoint to scale relative to. (Optional. Default is the origin.)   rotation Rotate the points of the region by the given angle. The value is a map with the following keys:  angleAmount to rotate the points (radians). (Required.) protPoint to rotate relative to. (Optional. Default is the origin.)   shearing Shear the points of the region by the given amounts. The value is a map with the following keys:  shxyAmount of shearing due to x in y direction. (Required.) shyxAmount of shearing due to y in x direction. (Required.)   reflection Reflect the points of the region around a line or a point. The value is a map with the following keys:  lineRLine of reflection. prefPoint to reflect points around. The value is a map with the following keys:  startThe starting point of the line. endThe ending point of the line.    Exactly of lineR or pref must be specified.   If no transform specifications are provided, the points are transformed by the identity transform. That is, they remain unchanged.
    * @param { XsString } [options] - Geospatial options that affect the transformation. Currently there are no relevant options.
    * @returns { CtsRegion }
    */
regionAffineTransform(...args) {
    const namer = bldrbase.getNamer(args, 'region');
    const paramdefs = [['region', [types.CtsRegion, PlanColumn, PlanParam], true, false], ['transform', [types.MapMap, PlanColumn, PlanParam], false, true], ['options', [types.XsString, PlanColumn, PlanParam], false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'geo.regionAffineTransform', 2, new Set(['region', 'transform', 'options']), paramdefs, args) :
        bldrbase.makePositionalArgs('geo.regionAffineTransform', 2, false, paramdefs, args);
    return new types.CtsRegion('geo', 'region-affine-transform', checkedArgs);

    }
/**
    * This function returns a simplified approximation of the region, using the Douglas-Peucker algorithm. Provides a client interface to a server function. See {@link http://docs.marklogic.com/geo.regionApproximate|geo.regionApproximate}
    * @method planBuilder.geo#regionApproximate
    * @since 2.1.1
    * @param { CtsRegion } [region] - A cts region.
    * @param { XsDouble } [threshold] - How close the approximation should be, in the units specified by the units option.
    * @param { XsString } [options] - Options include:   "coordinate-system=value" Use the given coordinate system. Valid values are wgs84, wgs84/double, etrs89, etrs89/double, raw and raw/double. Defaults to the governing coordinating system. "precision=value" Use the coordinate system at the given precision. Allowed values: float and double. Defaults to the precision of the governing coordinate system. "units=value" Measure distance, radii of circles, and tolerance in the specified units. Allowed values: miles (default), km, feet, meters. "tolerance=distance" Tolerance is the largest allowable variation in geometry calculations. If the distance between two points is less than tolerance, then the two points are considered equal. For the raw coordinate system, use the units of the coordinates. For geographic coordinate systems, use the units specified by the units option. Tolerance must be smaller than the value of the threshold parameter.  
    * @returns { CtsRegion }
    */
regionApproximate(...args) {
    const namer = bldrbase.getNamer(args, 'region');
    const paramdefs = [['region', [types.CtsRegion, PlanColumn, PlanParam], true, false], ['threshold', [types.XsDouble, PlanColumn, PlanParam], true, false], ['options', [types.XsString, PlanColumn, PlanParam], false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'geo.regionApproximate', 2, new Set(['region', 'threshold', 'options']), paramdefs, args) :
        bldrbase.makePositionalArgs('geo.regionApproximate', 2, false, paramdefs, args);
    return new types.CtsRegion('geo', 'region-approximate', checkedArgs);

    }
/**
    * This function fixes various problems with the region or raises an error if it is not repairable. The only relevant fix for MarkLogic is to remove duplicate adjacent vertices in polygons (including inner and outer polygons of complex polygons). The only relevant options are options controlling the coordinate system and the tolerance option. Provides a client interface to a server function. See {@link http://docs.marklogic.com/geo.regionClean|geo.regionClean}
    * @method planBuilder.geo#regionClean
    * @since 2.1.1
    * @param { CtsRegion } [region] - A cts region.
    * @param { XsString } [options] - The tolerance, units, coordinate system. Options include:   "coordinate-system=value" Use the given coordinate system. Valid values are wgs84, wgs84/double, etrs89, etrs89/double, raw and raw/double. Defaults to the governing coordinating system. "precision=value" Use the coordinate system at the given precision. Allowed values: float and double. Defaults to the precision of the governing coordinate system. "units=value" Measure distance, radii of circles, and tolerance in the specified units. Allowed values: miles (default), km, feet, meters. "tolerance=distance" Tolerance is the largest allowable variation in geometry calculations. If the distance between two points is less than tolerance, then the two points are considered equal. For the raw coordinate system, use the units of the coordinates. For geographic coordinate systems, use the units specified by the units option.  
    * @returns { CtsRegion }
    */
regionClean(...args) {
    const namer = bldrbase.getNamer(args, 'region');
    const paramdefs = [['region', [types.CtsRegion, PlanColumn, PlanParam], true, false], ['options', [types.XsString, PlanColumn, PlanParam], false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'geo.regionClean', 1, new Set(['region', 'options']), paramdefs, args) :
        bldrbase.makePositionalArgs('geo.regionClean', 1, false, paramdefs, args);
    return new types.CtsRegion('geo', 'region-clean', checkedArgs);

    }
/**
    * Returns true if one region contains the other region. Provides a client interface to a server function. See {@link http://docs.marklogic.com/geo.regionContains|geo.regionContains}
    * @method planBuilder.geo#regionContains
    * @since 2.1.1
    * @param { CtsRegion } [target] - A geographic region.
    * @param { CtsRegion } [region] - One or more geographic regions (boxes, circles, polygons, or points). Where multiple regions are specified, return true if target contains any of the regions.
    * @param { XsString } [options] - Options for the operation. The default is (). Options include: Options include:   "coordinate-system=string" Use the given coordinate system. Valid values are:  wgs84The WGS84 coordinate system. wgs84/doubleThe WGS84 coordinate system at double precision. etrs89The ETRS89 coordinate system. etrs89/doubleThe ETRS89 coordinate system at double precision. rawThe raw (unmapped) coordinate system. raw/doubleThe raw coordinate system at double precision.   "precision=value" Use the coordinate system at the given precision. Allowed values: float and double. "units=value" Measure distance, radii of circles, and tolerance in the specified units. Allowed values: miles (default), km, feet, meters. "tolerance=distance" Tolerance is the largest allowable variation in geometry calculations. If the distance between two points is less than tolerance, then the two points are considered equal. For the raw coordinate system, use the units of the coordinates. For geographic coordinate systems, use the units specified by the units option. "boundaries-included" Points on boxes', circles', and regions' boundaries are counted as matching. This is the default. "boundaries-excluded" Points on boxes', circles', and regions' boundaries are not counted as matching. "boundaries-latitude-excluded" Points on boxes' latitude boundaries are not counted as matching. "boundaries-longitude-excluded" Points on boxes' longitude boundaries are not counted as matching. "boundaries-south-excluded" Points on the boxes' southern boundaries are not counted as matching. "boundaries-west-excluded" Points on the boxes' western boundaries are not counted as matching. "boundaries-north-excluded" Points on the boxes' northern boundaries are not counted as matching. "boundaries-east-excluded" Points on the boxes' eastern boundaries are not counted as matching. "boundaries-circle-excluded" Points on circles' boundary are not counted as matching. "boundaries-endpoints-excluded" Points on linestrings' boundary (the endpoints) are not counted as matching. 
    * @returns { XsBoolean }
    */
regionContains(...args) {
    const namer = bldrbase.getNamer(args, 'target');
    const paramdefs = [['target', [types.CtsRegion, PlanColumn, PlanParam], true, false], ['region', [types.CtsRegion, PlanColumn, PlanParam], false, true], ['options', [types.XsString, PlanColumn, PlanParam], false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'geo.regionContains', 2, new Set(['target', 'region', 'options']), paramdefs, args) :
        bldrbase.makePositionalArgs('geo.regionContains', 2, false, paramdefs, args);
    return new types.XsBoolean('geo', 'region-contains', checkedArgs);

    }
/**
    * Calculates the Dimensionally Extended nine-Intersection Matrix (DE-9IM) of two geospatial regions. Provides a client interface to a server function. See {@link http://docs.marklogic.com/geo.regionDe9im|geo.regionDe9im}
    * @method planBuilder.geo#regionDe9im
    * @since 2.1.1
    * @param { CtsRegion } [region1] - The first geospatial region to compare.
    * @param { CtsRegion } [region2] - The second geospatial region to compare.
    * @param { XsString } [options] - Options to this operation. The default is (). Available options:   "coordinate-system=string" Use the given coordinate system. Valid values are:  wgs84The WGS84 coordinate system. wgs84/doubleThe WGS84 coordinate system at double precision. etrs89The ETRS89 coordinate system. etrs89/doubleThe ETRS89 coordinate system at double precision. rawThe raw (unmapped) coordinate system. raw/doubleThe raw coordinate system at double precision.   "precision=value" Use the coordinate system at the given precision. Allowed values: float and double. "units=value" Measure distance, radii of circles, and tolerance in the specified units. Allowed values: miles (default), km, feet, meters. "tolerance=distance" Tolerance is the largest allowable variation in geometry calculations. If the distance between two points is less than tolerance, then the two points are considered equal. For the raw coordinate system, use the units of the coordinates. For geographic coordinate systems, use the units specified by the units option. 
    * @returns { XsString }
    */
regionDe9im(...args) {
    const namer = bldrbase.getNamer(args, 'region-1');
    const paramdefs = [['region-1', [types.CtsRegion, PlanColumn, PlanParam], true, false], ['region-2', [types.CtsRegion, PlanColumn, PlanParam], true, false], ['options', [types.XsString, PlanColumn, PlanParam], false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'geo.regionDe9im', 2, new Set(['region-1', 'region-2', 'options']), paramdefs, args) :
        bldrbase.makePositionalArgs('geo.regionDe9im', 2, false, paramdefs, args);
    return new types.XsString('geo', 'region-de9im', checkedArgs);

    }
/**
    * Returns true if the target region intersects with a region. Provides a client interface to a server function. See {@link http://docs.marklogic.com/geo.regionIntersects|geo.regionIntersects}
    * @method planBuilder.geo#regionIntersects
    * @since 2.1.1
    * @param { CtsRegion } [target] - A geographic region (box, circle, polygon, or point).
    * @param { CtsRegion } [region] - One or more geographic regions. Where multiple regions are specified, return true if any region intersects the target region.
    * @param { XsString } [options] - Options for the operation. The default is (). Options include: Options include:   "coordinate-system=string" Use the given coordinate system. Valid values are:  wgs84The WGS84 coordinate system. wgs84/doubleThe WGS84 coordinate system at double precision. etrs89The ETRS89 coordinate system. etrs89/doubleThe ETRS89 coordinate system at double precision. rawThe raw (unmapped) coordinate system. raw/doubleThe raw coordinate system at double precision.   "precision=value" Use the coordinate system at the given precision. Allowed values: float and double. "units=value" Measure distance, radii of circles, and tolerance in the specified units. Allowed values: miles (default), km, feet, meters. "tolerance=distance" Tolerance is the largest allowable variation in geometry calculations. If the distance between two points is less than tolerance, then the two points are considered equal. For the raw coordinate system, use the units of the coordinates. For geographic coordinate systems, use the units specified by the units option. "boundaries-included" Points on regions' boundaries are counted as matching. This is the default. "boundaries-excluded" Points on regions' boundaries are not counted as matching. "boundaries-latitude-excluded" Points on boxes' latitude boundaries are not counted as matching. "boundaries-longitude-excluded" Points on boxes' longitude boundaries are not counted as matching. "boundaries-south-excluded" Points on the boxes' southern boundaries are not counted as matching. "boundaries-west-excluded" Points on the boxes' western boundaries are not counted as matching. "boundaries-north-excluded" Points on the boxes' northern boundaries are not counted as matching. "boundaries-east-excluded" Points on the boxes' eastern boundaries are not counted as matching. "boundaries-circle-excluded" Points on circles' boundary are not counted as matching. "boundaries-endpoints-excluded" Points on linestrings' boundary (the endpoints) are not counted as matching. 
    * @returns { XsBoolean }
    */
regionIntersects(...args) {
    const namer = bldrbase.getNamer(args, 'target');
    const paramdefs = [['target', [types.CtsRegion, PlanColumn, PlanParam], true, false], ['region', [types.CtsRegion, PlanColumn, PlanParam], false, true], ['options', [types.XsString, PlanColumn, PlanParam], false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'geo.regionIntersects', 2, new Set(['target', 'region', 'options']), paramdefs, args) :
        bldrbase.makePositionalArgs('geo.regionIntersects', 2, false, paramdefs, args);
    return new types.XsBoolean('geo', 'region-intersects', checkedArgs);

    }
/**
    * Compares geospatial regions based on a specified relationship. For example, determine if two regions overlap. Provides a client interface to a server function. See {@link http://docs.marklogic.com/geo.regionRelate|geo.regionRelate}
    * @method planBuilder.geo#regionRelate
    * @since 2.1.1
    * @param { CtsRegion } [region1] - The first geospatial region to compare. This region is the left operand of $operation.
    * @param { XsString } [operation] - The operation to apply between the region specified in the $region-1 and $region-2 parameters. Allowed values: contains, covered-by, covers, crosses, disjoint, equals, intersects, overlaps, touches, within. See the Usage Notes for details.
    * @param { CtsRegion } [region2] - The second geospatial region to compare. This region is the right operand of $operation.
    * @param { XsString } [options] - Options to this operation. The default is (). Available options:   "coordinate-system=string" Use the given coordinate system. Valid values are:  wgs84The WGS84 coordinate system. wgs84/doubleThe WGS84 coordinate system at double precision. etrs89The ETRS89 coordinate system. etrs89/doubleThe ETRS89 coordinate system at double precision. rawThe raw (unmapped) coordinate system. raw/doubleThe raw coordinate system at double precision.   "precision=value" Use the coordinate system at the given precision. Allowed values: float and double. "units=value" Measure distance, radii of circles, and tolerance in the specified units. Allowed values: miles (default), km, feet, meters. "tolerance=distance" Tolerance is the largest allowable variation in geometry calculations. If the distance between two points is less than tolerance, then the two points are considered equal. For the raw coordinate system, use the units of the coordinates. For geographic coordinate systems, use the units specified by the units option. 
    * @returns { XsBoolean }
    */
regionRelate(...args) {
    const namer = bldrbase.getNamer(args, 'region-1');
    const paramdefs = [['region-1', [types.CtsRegion, PlanColumn, PlanParam], true, false], ['operation', [types.XsString, PlanColumn, PlanParam], true, false], ['region-2', [types.CtsRegion, PlanColumn, PlanParam], true, false], ['options', [types.XsString, PlanColumn, PlanParam], false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'geo.regionRelate', 3, new Set(['region-1', 'operation', 'region-2', 'options']), paramdefs, args) :
        bldrbase.makePositionalArgs('geo.regionRelate', 3, false, paramdefs, args);
    return new types.XsBoolean('geo', 'region-relate', checkedArgs);

    }
/**
    * Remove duplicate (adjacent) vertices. Provides a client interface to a server function. See {@link http://docs.marklogic.com/geo.removeDuplicateVertices|geo.removeDuplicateVertices}
    * @method planBuilder.geo#removeDuplicateVertices
    * @since 2.1.1
    * @param { CtsRegion } [region] - A cts region.
    * @param { XsString } [options] - The tolerance, units, coordinate system. Options include:   "coordinate-system=value" Use the given coordinate system. Valid values are wgs84, wgs84/double, etrs89, etrs89/double, raw and raw/double. Defaults to the governing coordinating system. "precision=value" Use the coordinate system at the given precision. Allowed values: float and double. Defaults to the precision of the governing coordinate system. "units=value" Measure distance, radii of circles, and tolerance in the specified units. Allowed values: miles (default), km, feet, meters. "tolerance=distance" Tolerance is the largest allowable variation in geometry calculations. If the distance between two points is less than tolerance, then the two points are considered equal. For the raw coordinate system, use the units of the coordinates. For geographic coordinate systems, use the units specified by the units option.  
    * @returns { CtsRegion }
    */
removeDuplicateVertices(...args) {
    const namer = bldrbase.getNamer(args, 'region');
    const paramdefs = [['region', [types.CtsRegion, PlanColumn, PlanParam], true, false], ['options', [types.XsString, PlanColumn, PlanParam], false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'geo.removeDuplicateVertices', 1, new Set(['region', 'options']), paramdefs, args) :
        bldrbase.makePositionalArgs('geo.removeDuplicateVertices', 1, false, paramdefs, args);
    return new types.CtsRegion('geo', 'remove-duplicate-vertices', checkedArgs);

    }
/**
    * Returns the great circle distance (in units) between a point and a region. The region is defined by a cts:region. Provides a client interface to a server function. See {@link http://docs.marklogic.com/geo.shortestDistance|geo.shortestDistance}
    * @method planBuilder.geo#shortestDistance
    * @since 2.1.1
    * @param { CtsPoint } [p1] - The first point.
    * @param { CtsRegion } [region] - A region such as a circle, box, polygon, linestring, or complex-polygon. For compatibility with previous versions, a sequence of points is interpreted as a sequence of arcs (defined pairwise) and the distance returned is the shortest distance to one of those points. If the first parameter is a point within the region specified in this parameter, then this function returns 0. If the point specified in the first parameter in not in the region specified in this parameter, then this function returns the shortest distance to the boundary of the region.
    * @param { XsString } [options] - Options for the operation. The default is (). Options include:   "coordinate-system=string" Use the given coordinate system. Valid values are:  wgs84The WGS84 coordinate system. wgs84/doubleThe WGS84 coordinate system at double precision. etrs89The ETRS89 coordinate system. etrs89/doubleThe ETRS89 coordinate system at double precision. rawThe raw (unmapped) coordinate system. raw/doubleThe raw coordinate system at double precision.   "units=value" Measure distance and the radii of circles in the specified units. Allowed values: miles (default), km, feet, meters. "precision=value" Use the coordinate system at the given precision. Allowed values: float and double.  
    * @returns { XsDouble }
    */
shortestDistance(...args) {
    const namer = bldrbase.getNamer(args, 'p1');
    const paramdefs = [['p1', [types.CtsPoint, PlanColumn, PlanParam], true, false], ['region', [types.CtsRegion, PlanColumn, PlanParam], false, true], ['options', [types.XsString, PlanColumn, PlanParam], false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'geo.shortestDistance', 2, new Set(['p1', 'region', 'options']), paramdefs, args) :
        bldrbase.makePositionalArgs('geo.shortestDistance', 2, false, paramdefs, args);
    return new types.XsDouble('geo', 'shortest-distance', checkedArgs);

    }
/**
    * Returns a sequence of strings in Well-Known Text format. Provides a client interface to a server function. See {@link http://docs.marklogic.com/geo.toWkt|geo.toWkt}
    * @method planBuilder.geo#toWkt
    * @since 2.1.1
    * @param { CtsRegion } [wkt] - A sequence of geospatial regions.
    * @returns { XsString }
    */
toWkt(...args) {
    const paramdef = ['wkt', [types.CtsRegion, PlanColumn, PlanParam], false, true];
    const checkedArgs = bldrbase.makeSingleArgs('geo.toWkt', 1, paramdef, args);
    return new types.XsString('geo', 'to-wkt', checkedArgs);
    }
/**
    * Returns true if the string is valid Well-Known Text for a supported region type. Provides a client interface to a server function. See {@link http://docs.marklogic.com/geo.validateWkt|geo.validateWkt}
    * @method planBuilder.geo#validateWkt
    * @since 2.1.1
    * @param { XsString } [wkt] - A string to validate.
    * @returns { XsBoolean }
    */
validateWkt(...args) {
    const paramdef = ['wkt', [types.XsString, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('geo.validateWkt', 1, paramdef, args);
    return new types.XsBoolean('geo', 'validate-wkt', checkedArgs);
    }
}
class JsonExpr {
  constructor() {
  }
  /**
    * Creates a (JSON) array, which is like a sequence of values, but allows for nesting. Provides a client interface to a server function. See {@link http://docs.marklogic.com/json:array|json:array}
    * @method planBuilder.json#array
    * @since 2.1.1
    * @param { ElementNode } [array] - A serialized array element.
    * @returns { JsonArray }
    */
array(...args) {
    const paramdef = ['array', [types.ElementNode, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('json.array', 0, paramdef, args);
    return new types.JsonArray('json', 'array', checkedArgs);
    }
/**
    * Returns the size of the array. Provides a client interface to a server function. See {@link http://docs.marklogic.com/json:array-size|json:array-size}
    * @method planBuilder.json#arraySize
    * @since 2.1.1
    * @param { JsonArray } [array] - An array.
    * @returns { XsUnsignedLong }
    */
arraySize(...args) {
    const paramdef = ['array', [types.JsonArray, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('json.arraySize', 1, paramdef, args);
    return new types.XsUnsignedLong('json', 'array-size', checkedArgs);
    }
/**
    * Returns the array values as an XQuery sequence. Provides a client interface to a server function. See {@link http://docs.marklogic.com/json:array-values|json:array-values}
    * @method planBuilder.json#arrayValues
    * @since 2.1.1
    * @param { JsonArray } [array] - An array.
    * @param { XsBoolean } [flatten] - Include values from subarrays in the sequence. The default is false, meaning that subarrays are returned as array values.
    * @returns { Item }
    */
arrayValues(...args) {
    const namer = bldrbase.getNamer(args, 'array');
    const paramdefs = [['array', [types.JsonArray, PlanColumn, PlanParam], true, false], ['flatten', [types.XsBoolean, PlanColumn, PlanParam], false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'json.arrayValues', 1, new Set(['array', 'flatten']), paramdefs, args) :
        bldrbase.makePositionalArgs('json.arrayValues', 1, false, paramdefs, args);
    return new types.Item('json', 'array-values', checkedArgs);

    }
/**
    * Creates a JSON object, which is a kind of map with a fixed and ordered set of keys. Provides a client interface to a server function. See {@link http://docs.marklogic.com/json:object|json:object}
    * @method planBuilder.json#object
    * @since 2.1.1
    * @param { ElementNode } [map] - A serialized JSON object.
    * @returns { JsonObject }
    */
object(...args) {
    const paramdef = ['map', [types.ElementNode, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('json.object', 0, paramdef, args);
    return new types.JsonObject('json', 'object', checkedArgs);
    }
/**
    * Creates a JSON object. Provides a client interface to a server function. See {@link http://docs.marklogic.com/json:object-define|json:object-define}
    * @method planBuilder.json#objectDefine
    * @since 2.1.1
    * @param { XsString } [keys] - The sequence of keys in this object.
    * @returns { JsonObject }
    */
objectDefine(...args) {
    const paramdef = ['keys', [types.XsString, PlanColumn, PlanParam], false, true];
    const checkedArgs = bldrbase.makeSingleArgs('json.objectDefine', 0, paramdef, args);
    return new types.JsonObject('json', 'object-define', checkedArgs);
    }
/**
    * Extract a subarray from an array, producing a new array. The second and third arguments to this function operate similarly to those of fn:subsequence for XQuery sequences. Provides a client interface to a server function. See {@link http://docs.marklogic.com/json:subarray|json:subarray}
    * @method planBuilder.json#subarray
    * @since 2.1.1
    * @param { JsonArray } [array] - An array.
    * @param { XsNumeric } [startingLoc] - The starting position of the start of the subarray.
    * @param { XsNumeric } [length] - The length of the subarray.
    * @returns { JsonArray }
    */
subarray(...args) {
    const namer = bldrbase.getNamer(args, 'array');
    const paramdefs = [['array', [types.JsonArray, PlanColumn, PlanParam], true, false], ['startingLoc', [types.XsNumeric, PlanColumn, PlanParam], true, false], ['length', [types.XsNumeric, PlanColumn, PlanParam], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'json.subarray', 2, new Set(['array', 'startingLoc', 'length']), paramdefs, args) :
        bldrbase.makePositionalArgs('json.subarray', 2, false, paramdefs, args);
    return new types.JsonArray('json', 'subarray', checkedArgs);

    }
/**
    * Constructs a json:array from a sequence of items. Provides a client interface to a server function. See {@link http://docs.marklogic.com/json:to-array|json:to-array}
    * @method planBuilder.json#toArray
    * @since 2.1.1
    * @param { Item } [items] - The items to be used as elements in the constructed array.
    * @param { XsNumeric } [limit] - The size of the array to construct. If the size is less than the length of the item sequence, only as "limit" items are put into the array. If the size is more than the length of the sequence, the array is filled with null values up to the limit.
    * @param { Item } [zero] - The value to use to pad out the array, if necessary. By default the empty sequence is used.
    * @returns { JsonArray }
    */
toArray(...args) {
    const namer = bldrbase.getNamer(args, 'items');
    const paramdefs = [['items', [types.Item, PlanColumn, PlanParam], false, true], ['limit', [types.XsNumeric, PlanColumn, PlanParam], false, false], ['zero', [types.Item, PlanColumn, PlanParam], false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'json.toArray', 0, new Set(['items', 'limit', 'zero']), paramdefs, args) :
        bldrbase.makePositionalArgs('json.toArray', 0, false, paramdefs, args);
    return new types.JsonArray('json', 'to-array', checkedArgs);

    }
}
class MapExpr {
  constructor() {
  }
  /**
    * Returns true if the key exists in the map. Provides a client interface to a server function. See {@link http://docs.marklogic.com/map:contains|map:contains}
    * @method planBuilder.map#contains
    * @since 2.1.1
    * @param { MapMap } [map] - A map.
    * @param { XsString } [key] - A key.
    * @returns { XsBoolean }
    */
contains(...args) {
    const namer = bldrbase.getNamer(args, 'map');
    const paramdefs = [['map', [types.MapMap, PlanColumn, PlanParam], true, false], ['key', [types.XsString, PlanColumn, PlanParam], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'map.contains', 2, new Set(['map', 'key']), paramdefs, args) :
        bldrbase.makePositionalArgs('map.contains', 2, false, paramdefs, args);
    return new types.XsBoolean('map', 'contains', checkedArgs);

    }
/**
    * Returns the number of keys used in the map. Provides a client interface to a server function. See {@link http://docs.marklogic.com/map:count|map:count}
    * @method planBuilder.map#count
    * @since 2.1.1
    * @param { MapMap } [map] - A map.
    * @returns { XsUnsignedInt }
    */
count(...args) {
    const paramdef = ['map', [types.MapMap, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('map.count', 1, paramdef, args);
    return new types.XsUnsignedInt('map', 'count', checkedArgs);
    }
/**
    * Constructs a new map with a single entry consisting of the key and value specified as arguments. This is particularly helpful when used as part of an argument to map:new(). Provides a client interface to a server function. See {@link http://docs.marklogic.com/map:entry|map:entry}
    * @method planBuilder.map#entry
    * @since 2.1.1
    * @param { XsString } [key] - The map key.
    * @param { Item } [value] - The map value.
    * @returns { MapMap }
    */
entry(...args) {
    const namer = bldrbase.getNamer(args, 'key');
    const paramdefs = [['key', [types.XsString, PlanColumn, PlanParam], true, false], ['value', [types.Item, PlanColumn, PlanParam], false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'map.entry', 2, new Set(['key', 'value']), paramdefs, args) :
        bldrbase.makePositionalArgs('map.entry', 2, false, paramdefs, args);
    return new types.MapMap('map', 'entry', checkedArgs);

    }
/**
    * Get a value from a map. Provides a client interface to a server function. See {@link http://docs.marklogic.com/map:get|map:get}
    * @method planBuilder.map#get
    * @since 2.1.1
    * @param { MapMap } [map] - A map.
    * @param { XsString } [key] - A key.
    * @returns { Item }
    */
get(...args) {
    const namer = bldrbase.getNamer(args, 'map');
    const paramdefs = [['map', [types.MapMap, PlanColumn, PlanParam], true, false], ['key', [types.XsString, PlanColumn, PlanParam], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'map.get', 2, new Set(['map', 'key']), paramdefs, args) :
        bldrbase.makePositionalArgs('map.get', 2, false, paramdefs, args);
    return new types.Item('map', 'get', checkedArgs);

    }
/**
    * Get the keys used in the map. Provides a client interface to a server function. See {@link http://docs.marklogic.com/map:keys|map:keys}
    * @method planBuilder.map#keys
    * @since 2.1.1
    * @param { MapMap } [map] - A map.
    * @returns { XsString }
    */
keys(...args) {
    const paramdef = ['map', [types.MapMap, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('map.keys', 1, paramdef, args);
    return new types.XsString('map', 'keys', checkedArgs);
    }
/**
    * Creates a map. Provides a client interface to a server function. See {@link http://docs.marklogic.com/map:map|map:map}
    * @method planBuilder.map#map
    * @since 2.1.1
    * @param { ElementNode } [map] - A serialized map element.
    * @returns { MapMap }
    */
map(...args) {
    const paramdef = ['map', [types.ElementNode, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('map.map', 0, paramdef, args);
    return new types.MapMap('map', 'map', checkedArgs);
    }
/**
    * Constructs a new map by combining the keys from the maps given as an argument. If a given key exists in more than one argument map, the value from the last such map is used. Provides a client interface to a server function. See {@link http://docs.marklogic.com/map:new|map:new}
    * @method planBuilder.map#new
    * @since 2.1.1
    * @param { MapMap } [maps] - The argument maps.
    * @returns { MapMap }
    */
new(...args) {
    const paramdef = ['maps', [types.MapMap, PlanColumn, PlanParam], false, true];
    const checkedArgs = bldrbase.makeSingleArgs('map.new', 0, paramdef, args);
    return new types.MapMap('map', 'new', checkedArgs);
    }
}
class MathExpr {
  constructor() {
  }
  /**
    * Returns the arc cosine of x, in radians, in the range from 0 to pi (inclusive). Provides a client interface to a server function. See {@link http://docs.marklogic.com/math.acos|math.acos}
    * @method planBuilder.math#acos
    * @since 2.1.1
    * @param { XsDouble } [x] - The fraction to be evaluated. Must be in the range of -1 to +1 (inclusive).
    * @returns { XsDouble }
    */
acos(...args) {
    const paramdef = ['x', [types.XsDouble, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('math.acos', 1, paramdef, args);
    return new types.XsDouble('math', 'acos', checkedArgs);
    }
/**
    * Returns the arc sine of x, in radians, in the range from -pi/2 to +pi/2 (inclusive). Provides a client interface to a server function. See {@link http://docs.marklogic.com/math.asin|math.asin}
    * @method planBuilder.math#asin
    * @since 2.1.1
    * @param { XsDouble } [x] - The fraction to be evaluated. Must be in the range of -1 to +1 (inclusive).
    * @returns { XsDouble }
    */
asin(...args) {
    const paramdef = ['x', [types.XsDouble, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('math.asin', 1, paramdef, args);
    return new types.XsDouble('math', 'asin', checkedArgs);
    }
/**
    * Returns the arc tangent of x, in radians. in the range from -pi/2 to +pi/2 (inclusive). Provides a client interface to a server function. See {@link http://docs.marklogic.com/math.atan|math.atan}
    * @method planBuilder.math#atan
    * @since 2.1.1
    * @param { XsDouble } [x] - The floating point number to be evaluated.
    * @returns { XsDouble }
    */
atan(...args) {
    const paramdef = ['x', [types.XsDouble, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('math.atan', 1, paramdef, args);
    return new types.XsDouble('math', 'atan', checkedArgs);
    }
/**
    * Returns the arc tangent of y/x, in radians, in the range from -pi/2 to +pi/2 (inclusive), using the signs of y and x to determine the appropriate quadrant. Provides a client interface to a server function. See {@link http://docs.marklogic.com/math.atan2|math.atan2}
    * @method planBuilder.math#atan2
    * @since 2.1.1
    * @param { XsDouble } [y] - The floating point dividend.
    * @param { XsDouble } [x] - The floating point divisor.
    * @returns { XsDouble }
    */
atan2(...args) {
    const namer = bldrbase.getNamer(args, 'y');
    const paramdefs = [['y', [types.XsDouble, PlanColumn, PlanParam], true, false], ['x', [types.XsDouble, PlanColumn, PlanParam], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'math.atan2', 2, new Set(['y', 'x']), paramdefs, args) :
        bldrbase.makePositionalArgs('math.atan2', 2, false, paramdefs, args);
    return new types.XsDouble('math', 'atan2', checkedArgs);

    }
/**
    * Returns the smallest integer greater than or equal to x. Provides a client interface to a server function. See {@link http://docs.marklogic.com/math.ceil|math.ceil}
    * @method planBuilder.math#ceil
    * @since 2.1.1
    * @param { XsDouble } [x] - The floating point number to be evaluated.
    * @returns { XsDouble }
    */
ceil(...args) {
    const paramdef = ['x', [types.XsDouble, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('math.ceil', 1, paramdef, args);
    return new types.XsDouble('math', 'ceil', checkedArgs);
    }
/**
    * Returns the Pearson correlation coefficient of a data set. The size of the input array should be 2. The function eliminates all pairs for which either the first element or the second element is empty. After the elimination, if the length of the input is less than 2, the function returns the empty sequence. After the elimination, if the standard deviation of the first column or the standard deviation of the second column is 0, the function returns the empty sequence. Provides a client interface to a server function. See {@link http://docs.marklogic.com/math.correlation|math.correlation}
    * @method planBuilder.math#correlation
    * @since 2.1.1
    * @param { JsonArray } [arg] - The input data set. Each array should contain a pair of values.
    * @returns { XsDouble }
    */
correlation(...args) {
    const paramdef = ['arg', [types.JsonArray, PlanColumn, PlanParam], false, true];
    const checkedArgs = bldrbase.makeSingleArgs('math.correlation', 1, paramdef, args);
    return new types.XsDouble('math', 'correlation', checkedArgs);
    }
/**
    * Returns the cosine of x, in the range from -1 to +1 (inclusive). Provides a client interface to a server function. See {@link http://docs.marklogic.com/math.cos|math.cos}
    * @method planBuilder.math#cos
    * @since 2.1.1
    * @param { XsDouble } [x] - The floating point number to be evaluated.
    * @returns { XsDouble }
    */
cos(...args) {
    const paramdef = ['x', [types.XsDouble, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('math.cos', 1, paramdef, args);
    return new types.XsDouble('math', 'cos', checkedArgs);
    }
/**
    * Returns the hyperbolic cosine of x. Provides a client interface to a server function. See {@link http://docs.marklogic.com/math.cosh|math.cosh}
    * @method planBuilder.math#cosh
    * @since 2.1.1
    * @param { XsDouble } [x] - The floating point number to be evaluated.
    * @returns { XsDouble }
    */
cosh(...args) {
    const paramdef = ['x', [types.XsDouble, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('math.cosh', 1, paramdef, args);
    return new types.XsDouble('math', 'cosh', checkedArgs);
    }
/**
    * Returns the cotangent of x. Provides a client interface to a server function. See {@link http://docs.marklogic.com/math.cot|math.cot}
    * @method planBuilder.math#cot
    * @since 2.1.1
    * @param { XsDouble } [x] - The floating point number to be evaluated.
    * @returns { XsDouble }
    */
cot(...args) {
    const paramdef = ['x', [types.XsDouble, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('math.cot', 1, paramdef, args);
    return new types.XsDouble('math', 'cot', checkedArgs);
    }
/**
    * Returns the sample covariance of a data set. The size of the input array should be 2. The function eliminates all pairs for which either the first element or the second element is empty. After the elimination, if the length of the input is less than 2, the function returns the empty sequence.   Provides a client interface to a server function. See {@link http://docs.marklogic.com/math.covariance|math.covariance}
    * @method planBuilder.math#covariance
    * @since 2.1.1
    * @param { JsonArray } [arg] - The input data set. Each array should contain a pair of values.
    * @returns { XsDouble }
    */
covariance(...args) {
    const paramdef = ['arg', [types.JsonArray, PlanColumn, PlanParam], false, true];
    const checkedArgs = bldrbase.makeSingleArgs('math.covariance', 1, paramdef, args);
    return new types.XsDouble('math', 'covariance', checkedArgs);
    }
/**
    * Returns the population covariance of a data set. The size of the input array should be 2. The function eliminates all pairs for which either the first element or the second element is empty. After the elimination, if the length of the input is 0, the function returns the empty sequence.   Provides a client interface to a server function. See {@link http://docs.marklogic.com/math.covarianceP|math.covarianceP}
    * @method planBuilder.math#covarianceP
    * @since 2.1.1
    * @param { JsonArray } [arg] - The input data set. Each array should contain a pair of values.
    * @returns { XsDouble }
    */
covarianceP(...args) {
    const paramdef = ['arg', [types.JsonArray, PlanColumn, PlanParam], false, true];
    const checkedArgs = bldrbase.makeSingleArgs('math.covarianceP', 1, paramdef, args);
    return new types.XsDouble('math', 'covariance-p', checkedArgs);
    }
/**
    * Returns numeric expression converted from radians to degrees. Provides a client interface to a server function. See {@link http://docs.marklogic.com/math.degrees|math.degrees}
    * @method planBuilder.math#degrees
    * @since 2.1.1
    * @param { XsDouble } [x] - An angle expressed in radians.
    * @returns { XsDouble }
    */
degrees(...args) {
    const paramdef = ['x', [types.XsDouble, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('math.degrees', 1, paramdef, args);
    return new types.XsDouble('math', 'degrees', checkedArgs);
    }
/**
    * Returns e (approximately 2.71828182845905) to the xth power. Provides a client interface to a server function. See {@link http://docs.marklogic.com/math.exp|math.exp}
    * @method planBuilder.math#exp
    * @since 2.1.1
    * @param { XsDouble } [x] - The exponent to be evaluated.
    * @returns { XsDouble }
    */
exp(...args) {
    const paramdef = ['x', [types.XsDouble, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('math.exp', 1, paramdef, args);
    return new types.XsDouble('math', 'exp', checkedArgs);
    }
/**
    * Returns the absolute value of x. Provides a client interface to a server function. See {@link http://docs.marklogic.com/math.fabs|math.fabs}
    * @method planBuilder.math#fabs
    * @since 2.1.1
    * @param { XsDouble } [x] - The floating point number to be evaluated.
    * @returns { XsDouble }
    */
fabs(...args) {
    const paramdef = ['x', [types.XsDouble, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('math.fabs', 1, paramdef, args);
    return new types.XsDouble('math', 'fabs', checkedArgs);
    }
/**
    * Returns the largest integer less than or equal to x. Provides a client interface to a server function. See {@link http://docs.marklogic.com/math.floor|math.floor}
    * @method planBuilder.math#floor
    * @since 2.1.1
    * @param { XsDouble } [x] - The floating point number to be evaluated.
    * @returns { XsDouble }
    */
floor(...args) {
    const paramdef = ['x', [types.XsDouble, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('math.floor', 1, paramdef, args);
    return new types.XsDouble('math', 'floor', checkedArgs);
    }
/**
    * Returns the remainder of x/y. Provides a client interface to a server function. See {@link http://docs.marklogic.com/math.fmod|math.fmod}
    * @method planBuilder.math#fmod
    * @since 2.1.1
    * @param { XsDouble } [x] - The floating point dividend.
    * @param { XsDouble } [y] - The floating point divisor.
    * @returns { XsDouble }
    */
fmod(...args) {
    const namer = bldrbase.getNamer(args, 'x');
    const paramdefs = [['x', [types.XsDouble, PlanColumn, PlanParam], true, false], ['y', [types.XsDouble, PlanColumn, PlanParam], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'math.fmod', 2, new Set(['x', 'y']), paramdefs, args) :
        bldrbase.makePositionalArgs('math.fmod', 2, false, paramdefs, args);
    return new types.XsDouble('math', 'fmod', checkedArgs);

    }
/**
    * Returns x broken up into mantissa and exponent, where x = mantissa*2^exponent. Provides a client interface to a server function. See {@link http://docs.marklogic.com/math.frexp|math.frexp}
    * @method planBuilder.math#frexp
    * @since 2.1.1
    * @param { XsDouble } [x] - The exponent to be evaluated.
    * @returns { Item }
    */
frexp(...args) {
    const paramdef = ['x', [types.XsDouble, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('math.frexp', 1, paramdef, args);
    return new types.Item('math', 'frexp', checkedArgs);
    }
/**
    * Returns x*2^i. Provides a client interface to a server function. See {@link http://docs.marklogic.com/math.ldexp|math.ldexp}
    * @method planBuilder.math#ldexp
    * @since 2.1.1
    * @param { XsDouble } [y] - The floating-point number to be multiplied.
    * @param { XsInteger } [i] - The exponent integer.
    * @returns { XsDouble }
    */
ldexp(...args) {
    const namer = bldrbase.getNamer(args, 'y');
    const paramdefs = [['y', [types.XsDouble, PlanColumn, PlanParam], true, false], ['i', [types.XsInteger, PlanColumn, PlanParam], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'math.ldexp', 2, new Set(['y', 'i']), paramdefs, args) :
        bldrbase.makePositionalArgs('math.ldexp', 2, false, paramdefs, args);
    return new types.XsDouble('math', 'ldexp', checkedArgs);

    }
/**
    * Returns a linear model that fits the given data set. The size of the input array should be 2, as currently only simple linear regression model is supported. The first element of the array should be the value of the dependent variable while the other element should be the value of the independent variable.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/math.linearModel|math.linearModel}
    * @method planBuilder.math#linearModel
    * @since 2.1.1
    * @param { JsonArray } [arg] - The input data set. Each array should contain a pair of values.
    * @returns { MathLinearModel }
    */
linearModel(...args) {
    const paramdef = ['arg', [types.JsonArray, PlanColumn, PlanParam], false, true];
    const checkedArgs = bldrbase.makeSingleArgs('math.linearModel', 1, paramdef, args);
    return new types.MathLinearModel('math', 'linear-model', checkedArgs);
    }
/**
    * Returns the coefficients of the linear model. Currently only simple linear regression model is supported so the return should contain only one coefficient (also called "slope"). Provides a client interface to a server function. See {@link http://docs.marklogic.com/math.linearModelCoeff|math.linearModelCoeff}
    * @method planBuilder.math#linearModelCoeff
    * @since 2.1.1
    * @param { MathLinearModel } [linearModel] - A linear model.
    * @returns { XsDouble }
    */
linearModelCoeff(...args) {
    const paramdef = ['linear-model', [types.MathLinearModel, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('math.linearModelCoeff', 1, paramdef, args);
    return new types.XsDouble('math', 'linear-model-coeff', checkedArgs);
    }
/**
    * Returns the intercept of the linear model. Provides a client interface to a server function. See {@link http://docs.marklogic.com/math.linearModelIntercept|math.linearModelIntercept}
    * @method planBuilder.math#linearModelIntercept
    * @since 2.1.1
    * @param { MathLinearModel } [linearModel] - A linear model.
    * @returns { XsDouble }
    */
linearModelIntercept(...args) {
    const paramdef = ['linear-model', [types.MathLinearModel, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('math.linearModelIntercept', 1, paramdef, args);
    return new types.XsDouble('math', 'linear-model-intercept', checkedArgs);
    }
/**
    * Returns the R^2 value of the linear model. Provides a client interface to a server function. See {@link http://docs.marklogic.com/math.linearModelRsquared|math.linearModelRsquared}
    * @method planBuilder.math#linearModelRsquared
    * @since 2.1.1
    * @param { MathLinearModel } [linearModel] - A linear model.
    * @returns { XsDouble }
    */
linearModelRsquared(...args) {
    const paramdef = ['linear-model', [types.MathLinearModel, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('math.linearModelRsquared', 1, paramdef, args);
    return new types.XsDouble('math', 'linear-model-rsquared', checkedArgs);
    }
/**
    * Returns the base-e logarithm of x. Provides a client interface to a server function. See {@link http://docs.marklogic.com/math.log|math.log}
    * @method planBuilder.math#log
    * @since 2.1.1
    * @param { XsDouble } [x] - The floating point number to be evaluated.
    * @returns { XsDouble }
    */
log(...args) {
    const paramdef = ['x', [types.XsDouble, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('math.log', 1, paramdef, args);
    return new types.XsDouble('math', 'log', checkedArgs);
    }
/**
    * Returns the base-10 logarithm of x. Provides a client interface to a server function. See {@link http://docs.marklogic.com/math.log10|math.log10}
    * @method planBuilder.math#log10
    * @since 2.1.1
    * @param { XsDouble } [x] - The floating point number to be evaluated.
    * @returns { XsDouble }
    */
log10(...args) {
    const paramdef = ['x', [types.XsDouble, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('math.log10', 1, paramdef, args);
    return new types.XsDouble('math', 'log10', checkedArgs);
    }
/**
    * Returns the median of a sequence of values. The function returns the empty sequence if the input is the empty sequence. Provides a client interface to a server function. See {@link http://docs.marklogic.com/math.median|math.median}
    * @method planBuilder.math#median
    * @since 2.1.1
    * @param { XsDouble } [arg] - The sequence of values.
    * @returns { XsDouble }
    */
median(...args) {
    const paramdef = ['arg', [types.XsDouble, PlanColumn, PlanParam], false, true];
    const checkedArgs = bldrbase.makeSingleArgs('math.median', 1, paramdef, args);
    return new types.XsDouble('math', 'median', checkedArgs);
    }
/**
    * Returns the mode of a sequence. The mode is the value that occurs most frequently in a data set. If no value occurs more than once in the data set, the function returns the empty sequence. If the input is the empty sequence, the function returns the empty sequence.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/math.mode|math.mode}
    * @method planBuilder.math#mode
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg] - The sequence of values.
    * @param { XsString } [options] - Options. The default is ().  Options include:  "collation=URI" Applies only when $arg is of the xs:string type. If no specified, the default collation is used. "coordinate-system=name" Applies only when $arg is of the cts:point type. If no specified, the default coordinate system is used. 
    * @returns { XsAnyAtomicType }
    */
mode(...args) {
    const namer = bldrbase.getNamer(args, 'arg');
    const paramdefs = [['arg', [types.XsAnyAtomicType, PlanColumn, PlanParam], false, true], ['options', [types.XsString, PlanColumn, PlanParam], false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'math.mode', 1, new Set(['arg', 'options']), paramdefs, args) :
        bldrbase.makePositionalArgs('math.mode', 1, false, paramdefs, args);
    return new types.XsAnyAtomicType('math', 'mode', checkedArgs);

    }
/**
    * Returns x broken up into fraction and integer. x = fraction+integer. Provides a client interface to a server function. See {@link http://docs.marklogic.com/math.modf|math.modf}
    * @method planBuilder.math#modf
    * @since 2.1.1
    * @param { XsDouble } [x] - The floating point number to be evaluated.
    * @returns { XsDouble }
    */
modf(...args) {
    const paramdef = ['x', [types.XsDouble, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('math.modf', 1, paramdef, args);
    return new types.XsDouble('math', 'modf', checkedArgs);
    }
/**
    * Returns the rank of a value in a data set as a percentage of the data set. If the given value is not equal to any item in the sequence, the function returns the empty sequence. See math:rank. Provides a client interface to a server function. See {@link http://docs.marklogic.com/math.percentRank|math.percentRank}
    * @method planBuilder.math#percentRank
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg] - The sequence of values.
    * @param { XsAnyAtomicType } [value] - The value to be "ranked".
    * @param { XsString } [options] - Options. The default is ().  Options include:  "ascending"(default) Rank the value as if the sequence was sorted in ascending order.  "descending" Rank the value as if the sequence was sorted in descending order.  "collation=URI" Applies only when $arg is of the xs:string type. If no specified, the default collation is used. "coordinate-system=name" Applies only when $arg is of the cts:point type. If no specified, the default coordinate system is used. 
    * @returns { XsDouble }
    */
percentRank(...args) {
    const namer = bldrbase.getNamer(args, 'arg');
    const paramdefs = [['arg', [types.XsAnyAtomicType, PlanColumn, PlanParam], false, true], ['value', [types.XsAnyAtomicType, PlanColumn, PlanParam], true, false], ['options', [types.XsString, PlanColumn, PlanParam], false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'math.percentRank', 2, new Set(['arg', 'value', 'options']), paramdefs, args) :
        bldrbase.makePositionalArgs('math.percentRank', 2, false, paramdefs, args);
    return new types.XsDouble('math', 'percent-rank', checkedArgs);

    }
/**
    * Returns a sequence of percentile(s) given a sequence of percentage(s). The function returns the empty sequence if either arg or p is the empty sequence. Provides a client interface to a server function. See {@link http://docs.marklogic.com/math.percentile|math.percentile}
    * @method planBuilder.math#percentile
    * @since 2.1.1
    * @param { XsDouble } [arg] - The sequence of values to calculate the percentile(s) on.
    * @param { XsDouble } [p] - The sequence of percentage(s).
    * @returns { XsDouble }
    */
percentile(...args) {
    const namer = bldrbase.getNamer(args, 'arg');
    const paramdefs = [['arg', [types.XsDouble, PlanColumn, PlanParam], false, true], ['p', [types.XsDouble, PlanColumn, PlanParam], false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'math.percentile', 2, new Set(['arg', 'p']), paramdefs, args) :
        bldrbase.makePositionalArgs('math.percentile', 2, false, paramdefs, args);
    return new types.XsDouble('math', 'percentile', checkedArgs);

    }
/**
    * Returns the value of pi. Provides a client interface to a server function. See {@link http://docs.marklogic.com/math.pi|math.pi}
    * @method planBuilder.math#pi
    * @since 2.1.1

    * @returns { XsDouble }
    */
pi(...args) {
    bldrbase.checkMaxArity('math.pi', args.length, 0);
    return new types.XsDouble('math', 'pi', args);
    }
/**
    * Returns x^y. Provides a client interface to a server function. See {@link http://docs.marklogic.com/math.pow|math.pow}
    * @method planBuilder.math#pow
    * @since 2.1.1
    * @param { XsDouble } [x] - The floating-point base number.
    * @param { XsDouble } [y] - The exponent to be applied to x.
    * @returns { XsDouble }
    */
pow(...args) {
    const namer = bldrbase.getNamer(args, 'x');
    const paramdefs = [['x', [types.XsDouble, PlanColumn, PlanParam], true, false], ['y', [types.XsDouble, PlanColumn, PlanParam], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'math.pow', 2, new Set(['x', 'y']), paramdefs, args) :
        bldrbase.makePositionalArgs('math.pow', 2, false, paramdefs, args);
    return new types.XsDouble('math', 'pow', checkedArgs);

    }
/**
    * Returns numeric expression converted from degrees to radians. Provides a client interface to a server function. See {@link http://docs.marklogic.com/math.radians|math.radians}
    * @method planBuilder.math#radians
    * @since 2.1.1
    * @param { XsDouble } [x] - An angle expressed in degrees.
    * @returns { XsDouble }
    */
radians(...args) {
    const paramdef = ['x', [types.XsDouble, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('math.radians', 1, paramdef, args);
    return new types.XsDouble('math', 'radians', checkedArgs);
    }
/**
    * Returns the rank of a value in a data set. Ranks are skipped in the event of ties. If the given value is not equal to any item in the sequence, the function returns the empty sequence. The function can be used on numeric values, xs:yearMonthDuration, xs:dayTimeDuration, xs:string, xs:anyURI, xs:date, xs:dateTime, xs:time, and cts:point. Provides a client interface to a server function. See {@link http://docs.marklogic.com/math.rank|math.rank}
    * @method planBuilder.math#rank
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg1] - The sequence of values.
    * @param { XsAnyAtomicType } [arg2] - The value to be "ranked".
    * @param { XsString } [options] - Options. The default is ().  Options include:  "ascending"(default) Rank the value as if the sequence was sorted in ascending order.  "descending" Rank the value as if the sequence was sorted in descending order.  "collation=URI" Applies only when $arg is of the xs:string type. If no specified, the default collation is used. "coordinate-system=name" Applies only when $arg is of the cts:point type. If no specified, the default coordinate system is used. 
    * @returns { XsInteger }
    */
rank(...args) {
    const namer = bldrbase.getNamer(args, 'arg1');
    const paramdefs = [['arg1', [types.XsAnyAtomicType, PlanColumn, PlanParam], false, true], ['arg2', [types.XsAnyAtomicType, PlanColumn, PlanParam], true, false], ['options', [types.XsString, PlanColumn, PlanParam], false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'math.rank', 2, new Set(['arg1', 'arg2', 'options']), paramdefs, args) :
        bldrbase.makePositionalArgs('math.rank', 2, false, paramdefs, args);
    return new types.XsInteger('math', 'rank', checkedArgs);

    }
/**
    * Returns the sine of x, in the range from -1 to +1 (inclusive). Provides a client interface to a server function. See {@link http://docs.marklogic.com/math.sin|math.sin}
    * @method planBuilder.math#sin
    * @since 2.1.1
    * @param { XsDouble } [x] - The floating point number to be evaluated.
    * @returns { XsDouble }
    */
sin(...args) {
    const paramdef = ['x', [types.XsDouble, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('math.sin', 1, paramdef, args);
    return new types.XsDouble('math', 'sin', checkedArgs);
    }
/**
    * Returns the hyperbolic sine of x. Provides a client interface to a server function. See {@link http://docs.marklogic.com/math.sinh|math.sinh}
    * @method planBuilder.math#sinh
    * @since 2.1.1
    * @param { XsDouble } [x] - The floating point number to be evaluated.
    * @returns { XsDouble }
    */
sinh(...args) {
    const paramdef = ['x', [types.XsDouble, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('math.sinh', 1, paramdef, args);
    return new types.XsDouble('math', 'sinh', checkedArgs);
    }
/**
    * Returns the square root of x. Provides a client interface to a server function. See {@link http://docs.marklogic.com/math.sqrt|math.sqrt}
    * @method planBuilder.math#sqrt
    * @since 2.1.1
    * @param { XsDouble } [x] - The floating point number to be evaluated.
    * @returns { XsDouble }
    */
sqrt(...args) {
    const paramdef = ['x', [types.XsDouble, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('math.sqrt', 1, paramdef, args);
    return new types.XsDouble('math', 'sqrt', checkedArgs);
    }
/**
    * Returns the sample standard deviation of a sequence of values. The function returns the empty sequence if the length of the input sequence is less than 2. Provides a client interface to a server function. See {@link http://docs.marklogic.com/math.stddev|math.stddev}
    * @method planBuilder.math#stddev
    * @since 2.1.1
    * @param { XsDouble } [arg] - The sequence of values.
    * @returns { XsDouble }
    */
stddev(...args) {
    const paramdef = ['arg', [types.XsDouble, PlanColumn, PlanParam], false, true];
    const checkedArgs = bldrbase.makeSingleArgs('math.stddev', 1, paramdef, args);
    return new types.XsDouble('math', 'stddev', checkedArgs);
    }
/**
    * Returns the standard deviation of a population. The function returns the empty sequence if the input is the empty sequence. Provides a client interface to a server function. See {@link http://docs.marklogic.com/math.stddevP|math.stddevP}
    * @method planBuilder.math#stddevP
    * @since 2.1.1
    * @param { XsDouble } [arg] - The sequence of values.
    * @returns { XsDouble }
    */
stddevP(...args) {
    const paramdef = ['arg', [types.XsDouble, PlanColumn, PlanParam], false, true];
    const checkedArgs = bldrbase.makeSingleArgs('math.stddevP', 1, paramdef, args);
    return new types.XsDouble('math', 'stddev-p', checkedArgs);
    }
/**
    * Returns the tangent of x. Provides a client interface to a server function. See {@link http://docs.marklogic.com/math.tan|math.tan}
    * @method planBuilder.math#tan
    * @since 2.1.1
    * @param { XsDouble } [x] - The floating point number to be evaluated.
    * @returns { XsDouble }
    */
tan(...args) {
    const paramdef = ['x', [types.XsDouble, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('math.tan', 1, paramdef, args);
    return new types.XsDouble('math', 'tan', checkedArgs);
    }
/**
    * Returns the hyperbolic tangent of x, in the range from -1 to +1 (inclusive). Provides a client interface to a server function. See {@link http://docs.marklogic.com/math.tanh|math.tanh}
    * @method planBuilder.math#tanh
    * @since 2.1.1
    * @param { XsDouble } [x] - The floating point number to be evaluated.
    * @returns { XsDouble }
    */
tanh(...args) {
    const paramdef = ['x', [types.XsDouble, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('math.tanh', 1, paramdef, args);
    return new types.XsDouble('math', 'tanh', checkedArgs);
    }
/**
    * Returns the number truncated to a certain number of decimal places. If type of arg is one of the four numeric types xs:float, xs:double, xs:decimal or xs:integer the type of the result is the same as the type of arg. If the type of arg is a type derived from one of the numeric types, the result is an instance of the base numeric type.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/math.trunc|math.trunc}
    * @method planBuilder.math#trunc
    * @since 2.1.1
    * @param { XsNumeric } [arg] - A numeric value to truncate.
    * @param { XsInteger } [n] - The numbers of decimal places to truncate to. The default is 0. Negative values cause that many digits to the left of the decimal point to be truncated.
    * @returns { XsNumeric }
    */
trunc(...args) {
    const namer = bldrbase.getNamer(args, 'arg');
    const paramdefs = [['arg', [types.XsNumeric, PlanColumn, PlanParam], false, false], ['n', [types.XsInteger, PlanColumn, PlanParam], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'math.trunc', 1, new Set(['arg', 'n']), paramdefs, args) :
        bldrbase.makePositionalArgs('math.trunc', 1, false, paramdefs, args);
    return new types.XsNumeric('math', 'trunc', checkedArgs);

    }
/**
    * Returns the sample variance of a sequence of values. The function returns the empty sequence if the length of the input sequence is less than 2. Provides a client interface to a server function. See {@link http://docs.marklogic.com/math.variance|math.variance}
    * @method planBuilder.math#variance
    * @since 2.1.1
    * @param { XsDouble } [arg] - The sequence of values.
    * @returns { XsDouble }
    */
variance(...args) {
    const paramdef = ['arg', [types.XsDouble, PlanColumn, PlanParam], false, true];
    const checkedArgs = bldrbase.makeSingleArgs('math.variance', 1, paramdef, args);
    return new types.XsDouble('math', 'variance', checkedArgs);
    }
/**
    * Returns the population variance of a sequence of values. The function returns the empty sequence if the input is the empty sequence. Provides a client interface to a server function. See {@link http://docs.marklogic.com/math.varianceP|math.varianceP}
    * @method planBuilder.math#varianceP
    * @since 2.1.1
    * @param { XsDouble } [arg] - The sequence of values.
    * @returns { XsDouble }
    */
varianceP(...args) {
    const paramdef = ['arg', [types.XsDouble, PlanColumn, PlanParam], false, true];
    const checkedArgs = bldrbase.makeSingleArgs('math.varianceP', 1, paramdef, args);
    return new types.XsDouble('math', 'variance-p', checkedArgs);
    }
}
class RdfExpr {
  constructor() {
  }
  /**
    * Returns an rdf:langString value with the given value and language tag. The rdf:langString type extends xs:string, and represents a language tagged string in RDF.  This function is a built-in. Provides a client interface to a server function. See {@link http://docs.marklogic.com/rdf.langString|rdf.langString}
    * @method planBuilder.rdf#langString
    * @since 2.1.1
    * @param { XsString } [string] - The lexical value.
    * @param { XsString } [lang] - The language.
    * @returns { RdfLangString }
    */
langString(...args) {
    const namer = bldrbase.getNamer(args, 'string');
    const paramdefs = [['string', [types.XsString, PlanColumn, PlanParam], true, false], ['lang', [types.XsString, PlanColumn, PlanParam], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'rdf.langString', 2, new Set(['string', 'lang']), paramdefs, args) :
        bldrbase.makePositionalArgs('rdf.langString', 2, false, paramdefs, args);
    return new types.RdfLangString('rdf', 'langString', checkedArgs);

    }
/**
    * Returns the language of an rdf:langString value. This function is a built-in. Provides a client interface to a server function. See {@link http://docs.marklogic.com/rdf.langStringLanguage|rdf.langStringLanguage}
    * @method planBuilder.rdf#langStringLanguage
    * @since 2.1.1
    * @param { RdfLangString } [val] - The rdf:langString value.
    * @returns { XsString }
    */
langStringLanguage(...args) {
    const paramdef = ['val', [types.RdfLangString, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('rdf.langStringLanguage', 1, paramdef, args);
    return new types.XsString('rdf', 'langString-language', checkedArgs);
    }
}
class SemExpr {
  constructor() {
  }
  /**
    * This function returns an identifier for a blank node, allowing the construction of a triple that refers to a blank node. This XQuery function backs up the SPARQL BNODE() function.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/sem.bnode|sem.bnode}
    * @method planBuilder.sem#bnode
    * @since 2.1.1
    * @param { XsAnyAtomicType } [value] - If provided, the same blank node identifier is returned for the same argument value passed to the function.
    * @returns { SemBlank }
    */
bnode(...args) {
    const paramdef = ['value', [types.XsAnyAtomicType, types.Node, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('sem.bnode', 0, paramdef, args);
    return new types.SemBlank('sem', 'bnode', checkedArgs);
    }
/**
    * Returns the value of the first argument that evaluates without error. This XQuery function backs up the SPARQL COALESCE() functional form.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/sem.coalesce|sem.coalesce}
    * @method planBuilder.sem#coalesce
    * @since 2.1.1
    * @param { Item } [parameter1] - A value.
    * @returns { Item }
    */
coalesce(...args) {
    const namer = bldrbase.getNamer(args, 'parameter1');
    const paramdefs = [['parameter1', [types.Item, PlanColumn, PlanParam], false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'sem.coalesce', 1, new Set(['parameter1']), paramdefs, args) :
        bldrbase.makePositionalArgs('sem.coalesce', 1, true, paramdefs, args);
    return new types.Item('sem', 'coalesce', checkedArgs);

    }
/**
    * Returns the name of the simple type of the atomic value argument as a SPARQL style IRI. If the value is derived from sem:unknown or sem:invalid, the datatype IRI part of those values is returned. This XQuery function backs up the SPARQL datatype() function.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/sem.datatype|sem.datatype}
    * @method planBuilder.sem#datatype
    * @since 2.1.1
    * @param { XsAnyAtomicType } [value] - The value to return the type of.
    * @returns { SemIri }
    */
datatype(...args) {
    const paramdef = ['value', [types.XsAnyAtomicType, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('sem.datatype', 1, paramdef, args);
    return new types.SemIri('sem', 'datatype', checkedArgs);
    }
/**
    * Returns the iri of the default graph.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/sem.defaultGraphIri|sem.defaultGraphIri}
    * @method planBuilder.sem#defaultGraphIri
    * @since 2.1.1

    * @returns { SemIri }
    */
defaultGraphIri(...args) {
    bldrbase.checkMaxArity('sem.defaultGraphIri', args.length, 0);
    return new types.SemIri('sem', 'default-graph-iri', args);
    }
/**
    * The IF function form evaluates the first argument, interprets it as a effective boolean value, then returns the value of expression2 if the EBV is true, otherwise it returns the value of expression3. Only one of expression2 and expression3 is evaluated. If evaluating the first argument raises an error, then an error is raised for the evaluation of the IF expression. This XQuery function backs up the SPARQL IF() functional form.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/sem.if|sem.if}
    * @method planBuilder.sem#if
    * @since 2.1.1
    * @param { XsBoolean } [condition] - The condition.
    * @param { Item } [then] - The then expression.
    * @param { Item } [else] - The else expression.
    * @returns { Item }
    */
if(...args) {
    const namer = bldrbase.getNamer(args, 'condition');
    const paramdefs = [['condition', [types.XsBoolean, PlanColumn, PlanParam], true, false], ['then', [types.Item, PlanColumn, PlanParam], false, true], ['else', [types.Item, PlanColumn, PlanParam], false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'sem.if', 3, new Set(['condition', 'then', 'else']), paramdefs, args) :
        bldrbase.makePositionalArgs('sem.if', 3, false, paramdefs, args);
    return new types.Item('sem', 'if', checkedArgs);

    }
/**
    * Returns a sem:invalid value with the given literal value and datatype IRI. The sem:invalid type extends xs:untypedAtomic, and represents an RDF value whose literal string is invalid according to the schema for it's datatype.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/sem.invalid|sem.invalid}
    * @method planBuilder.sem#invalid
    * @since 2.1.1
    * @param { XsString } [string] - The lexical value.
    * @param { SemIri } [datatype] - The datatype IRI.
    * @returns { SemInvalid }
    */
invalid(...args) {
    const namer = bldrbase.getNamer(args, 'string');
    const paramdefs = [['string', [types.XsString, PlanColumn, PlanParam], true, false], ['datatype', [types.SemIri, PlanColumn, PlanParam], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'sem.invalid', 2, new Set(['string', 'datatype']), paramdefs, args) :
        bldrbase.makePositionalArgs('sem.invalid', 2, false, paramdefs, args);
    return new types.SemInvalid('sem', 'invalid', checkedArgs);

    }
/**
    * Returns the datatype IRI of a sem:invalid value.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/sem.invalidDatatype|sem.invalidDatatype}
    * @method planBuilder.sem#invalidDatatype
    * @since 2.1.1
    * @param { SemInvalid } [val] - The sem:invalid value.
    * @returns { SemIri }
    */
invalidDatatype(...args) {
    const paramdef = ['val', [types.SemInvalid, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('sem.invalidDatatype', 1, paramdef, args);
    return new types.SemIri('sem', 'invalid-datatype', checkedArgs);
    }
/**
    * This is a constructor function that takes a string and constructs an item of type sem:iri from it. Provides a client interface to a server function. See {@link http://docs.marklogic.com/sem.iri|sem.iri}
    * @method planBuilder.sem#iri
    * @since 2.1.1
    * @param { XsAnyAtomicType } [stringIri] - The string with which to construct the sem:iri.
    * @returns { SemIri }
    */
iri(...args) {
    const paramdef = ['string-iri', [types.XsAnyAtomicType, types.Node, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('sem.iri', 1, paramdef, args);
    return new types.SemIri('sem', 'iri', checkedArgs);
    }
/**
    * Converts an IRI value to a QName value. Provides a client interface to a server function.
    * @method planBuilder.sem#iriToQName
    * @since 2.1.1
    * @param { XsString } [arg1] - 
    * @returns { XsQName }
    */
iriToQName(...args) {
    const paramdef = ['arg1', [types.XsString, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('sem.iriToQName', 1, paramdef, args);
    return new types.XsQName('sem', 'iri-to-QName', checkedArgs);
    }
/**
    * Returns true if the argument is an RDF blank node - that is, derived from type sem:blank. This XQuery function backs up the SPARQL isBlank() function.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/sem.isBlank|sem.isBlank}
    * @method planBuilder.sem#isBlank
    * @since 2.1.1
    * @param { XsAnyAtomicType } [value] - The value to test.
    * @returns { XsBoolean }
    */
isBlank(...args) {
    const paramdef = ['value', [types.XsAnyAtomicType, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('sem.isBlank', 1, paramdef, args);
    return new types.XsBoolean('sem', 'isBlank', checkedArgs);
    }
/**
    * Returns true if the argument is an RDF IRI - that is, derived from type sem:iri, but not derived from type sem:blank. This XQuery function backs up the SPARQL isIRI() and isURI() functions.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/sem.isIRI|sem.isIRI}
    * @method planBuilder.sem#isIRI
    * @since 2.1.1
    * @param { XsAnyAtomicType } [value] - The value to test.
    * @returns { XsBoolean }
    */
isIRI(...args) {
    const paramdef = ['value', [types.XsAnyAtomicType, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('sem.isIRI', 1, paramdef, args);
    return new types.XsBoolean('sem', 'isIRI', checkedArgs);
    }
/**
    * Returns true if the argument is an RDF literal - that is, derived from type xs:anyAtomicType, but not derived from type sem:iri. This XQuery function backs up the SPARQL isLiteral() function.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/sem.isLiteral|sem.isLiteral}
    * @method planBuilder.sem#isLiteral
    * @since 2.1.1
    * @param { XsAnyAtomicType } [value] - The value to test.
    * @returns { XsBoolean }
    */
isLiteral(...args) {
    const paramdef = ['value', [types.XsAnyAtomicType, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('sem.isLiteral', 1, paramdef, args);
    return new types.XsBoolean('sem', 'isLiteral', checkedArgs);
    }
/**
    * Returns true if the argument is a valid numeric RDF literal. This XQuery function backs up the SPARQL isNumeric() function.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/sem.isNumeric|sem.isNumeric}
    * @method planBuilder.sem#isNumeric
    * @since 2.1.1
    * @param { XsAnyAtomicType } [value] - The value to test.
    * @returns { XsBoolean }
    */
isNumeric(...args) {
    const paramdef = ['value', [types.XsAnyAtomicType, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('sem.isNumeric', 1, paramdef, args);
    return new types.XsBoolean('sem', 'isNumeric', checkedArgs);
    }
/**
    * Returns the language of the value passed in, or the empty string if the value has no language. Only values derived from rdf:langString have a language. This XQuery function backs up the SPARQL lang() function.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/sem.lang|sem.lang}
    * @method planBuilder.sem#lang
    * @since 2.1.1
    * @param { XsAnyAtomicType } [value] - The value to return the language of.
    * @returns { XsString }
    */
lang(...args) {
    const paramdef = ['value', [types.XsAnyAtomicType, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('sem.lang', 1, paramdef, args);
    return new types.XsString('sem', 'lang', checkedArgs);
    }
/**
    * Returns true if lang-tag matches lang-range according to the basic filtering scheme defined in RFC4647. This XQuery function backs up the SPARQL langMatches() function.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/sem.langMatches|sem.langMatches}
    * @method planBuilder.sem#langMatches
    * @since 2.1.1
    * @param { XsString } [langTag] - The language tag.
    * @param { XsString } [langRange] - The language range.
    * @returns { XsBoolean }
    */
langMatches(...args) {
    const namer = bldrbase.getNamer(args, 'lang-tag');
    const paramdefs = [['lang-tag', [types.XsString, PlanColumn, PlanParam], true, false], ['lang-range', [types.XsString, PlanColumn, PlanParam], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'sem.langMatches', 2, new Set(['lang-tag', 'lang-range']), paramdefs, args) :
        bldrbase.makePositionalArgs('sem.langMatches', 2, false, paramdefs, args);
    return new types.XsBoolean('sem', 'langMatches', checkedArgs);

    }
/**
    * Converts a QName value to an IRI value. Provides a client interface to a server function.
    * @method planBuilder.sem#QNameToIri
    * @since 2.1.1
    * @param { XsQName } [arg1] - 
    * @returns { SemIri }
    */
QNameToIri(...args) {
    const paramdef = ['arg1', [types.XsQName, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('sem.QNameToIri', 1, paramdef, args);
    return new types.SemIri('sem', 'QName-to-iri', checkedArgs);
    }
/**
    * Returns a random double between 0 and 1. This XQuery function backs up the SPARQL RAND() function.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/sem.random|sem.random}
    * @method planBuilder.sem#random
    * @since 2.1.1

    * @returns { XsDouble }
    */
random(...args) {
    bldrbase.checkMaxArity('sem.random', args.length, 0);
    return new types.XsDouble('sem', 'random', args);
    }
/**
    * The sem:ruleset-store function returns a set of triples derived by applying the ruleset to the triples in the sem:store constructor provided in store ("the triples that can be inferred from these rules").  Provides a client interface to a server function. See {@link http://docs.marklogic.com/sem.rulesetStore|sem.rulesetStore}
    * @method planBuilder.sem#rulesetStore
    * @since 2.1.1
    * @param { XsString } [locations] - The locations of the rulesets.
    * @param { SemStore } [store] - The base store(s) over which to apply the ruleset to get inferred triples. The default for sem:store is an empty sequence, which means accessing the current database's triple index using the default rulesets configured for that database.
    * @param { XsString } [options] - Options as a sequence of string values. Available options are:  "size=number of MB" The maximum size of the memory used to cache inferred triples. This defaults to the default inference size set for the app-server. If the value provided is bigger than the maximum inference size set for the App Server, an error is raised [XDMP-INFSIZE]. 
    * @returns { SemStore }
    */
rulesetStore(...args) {
    const namer = bldrbase.getNamer(args, 'locations');
    const paramdefs = [['locations', [types.XsString], false, true], ['store', [types.SemStore], false, true], ['options', [types.XsString], false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'sem.rulesetStore', 1, new Set(['locations', 'store', 'options']), paramdefs, args) :
        bldrbase.makePositionalArgs('sem.rulesetStore', 1, false, paramdefs, args);
    return new types.SemStore('sem', 'ruleset-store', checkedArgs);

    }
/**
    * Returns true if the arguments are the same RDF term as defined by the RDF concepts specification. This XQuery function backs up the SPARQL sameTerm() function.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/sem.sameTerm|sem.sameTerm}
    * @method planBuilder.sem#sameTerm
    * @since 2.1.1
    * @param { XsAnyAtomicType } [a] - The first value to test.
    * @param { XsAnyAtomicType } [b] - The second value to test.
    * @returns { XsBoolean }
    */
sameTerm(...args) {
    const namer = bldrbase.getNamer(args, 'a');
    const paramdefs = [['a', [types.XsAnyAtomicType, PlanColumn, PlanParam], false, true], ['b', [types.XsAnyAtomicType, PlanColumn, PlanParam], false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'sem.sameTerm', 2, new Set(['a', 'b']), paramdefs, args) :
        bldrbase.makePositionalArgs('sem.sameTerm', 2, false, paramdefs, args);
    return new types.XsBoolean('sem', 'sameTerm', checkedArgs);

    }
/**
    * The sem:store function defines a set of criteria, that when evaluated, selects a set of triples to be passed in to sem:sparql(), sem:sparql-update(), or sem:sparql-values() as part of the options argument. The sem:store constructor queries from the current database's triple index, restricted by the options and the cts:query argument (for instance, "triples in documents matching this query").  Provides a client interface to a server function. See {@link http://docs.marklogic.com/sem.store|sem.store}
    * @method planBuilder.sem#store
    * @since 2.1.1
    * @param { XsString } [options] - Options as a sequence of string values. Available options are:  "any" Values from any fragment should be included. "document" Values from document fragments should be included. "properties" Values from properties fragments should be included. "locks" Values from locks fragments should be included. "checked" Word positions should be checked when resolving the query. "unchecked" Word positions should not be checked when resolving the query. "size=number of MB" The maximum size of the memory used to cache inferred triples. This defaults to the default inference size set for the app-server. If the value provided is bigger than the maximum inference size set for the App Server, an error is raised [XDMP-INFSIZE]. "no-default-rulesets" Don't apply the database's default rulesets to the sem:store. "locking=read-write/write" read-write: Read-lock documents containing triples being accessed, write-lock documents being updated; write: Only write-lock documents being updated. Default is locking=read-write. Locking is ignored in query transaction.  
    * @param { CtsQuery } [query] - Only include triples in fragments selected by the cts:query. The triples do not need to match the query, but they must occur in fragments selected by the query. The fragments are not filtered to ensure they match the query, but instead selected in the same manner as  "unfiltered" cts:search operations. If a string is entered, the string is treated as a cts:word-query of the specified string.
    * @returns { SemStore }
    */
store(...args) {
    const namer = bldrbase.getNamer(args, 'options');
    const paramdefs = [['options', [types.XsString], false, true], ['query', [types.CtsQuery], false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'sem.store', 0, new Set(['options', 'query']), paramdefs, args) :
        bldrbase.makePositionalArgs('sem.store', 0, false, paramdefs, args);
    return new types.SemStore('sem', 'store', checkedArgs);

    }
/**
    * Returns the timezone of an xs:dateTime value as a string. This XQuery function backs up the SPARQL TZ() function.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/sem.timezoneString|sem.timezoneString}
    * @method planBuilder.sem#timezoneString
    * @since 2.1.1
    * @param { XsDateTime } [value] - The dateTime value
    * @returns { XsString }
    */
timezoneString(...args) {
    const paramdef = ['value', [types.XsDateTime, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('sem.timezoneString', 1, paramdef, args);
    return new types.XsString('sem', 'timezone-string', checkedArgs);
    }
/**
    * Returns a value to represent the RDF typed literal with lexical value value and datatype IRI datatype. Returns a value of type sem:unknown for datatype IRIs for which there is no schema, and a value of type sem:invalid for lexical values which are invalid according to the schema for the given datatype. This XQuery function backs up the SPARQL STRDT() function.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/sem.typedLiteral|sem.typedLiteral}
    * @method planBuilder.sem#typedLiteral
    * @since 2.1.1
    * @param { XsString } [value] - The lexical value.
    * @param { SemIri } [datatype] - The datatype IRI.
    * @returns { XsAnyAtomicType }
    */
typedLiteral(...args) {
    const namer = bldrbase.getNamer(args, 'value');
    const paramdefs = [['value', [types.XsString, PlanColumn, PlanParam], true, false], ['datatype', [types.SemIri, PlanColumn, PlanParam], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'sem.typedLiteral', 2, new Set(['value', 'datatype']), paramdefs, args) :
        bldrbase.makePositionalArgs('sem.typedLiteral', 2, false, paramdefs, args);
    return new types.XsAnyAtomicType('sem', 'typed-literal', checkedArgs);

    }
/**
    * Returns a sem:unknown value with the given literal value and datatype IRI. The sem:unknown type extends xs:untypedAtomic, and represents an RDF value with a datatype IRI for which no schema is available.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/sem.unknown|sem.unknown}
    * @method planBuilder.sem#unknown
    * @since 2.1.1
    * @param { XsString } [string] - The lexical value.
    * @param { SemIri } [datatype] - The datatype IRI.
    * @returns { SemUnknown }
    */
unknown(...args) {
    const namer = bldrbase.getNamer(args, 'string');
    const paramdefs = [['string', [types.XsString, PlanColumn, PlanParam], true, false], ['datatype', [types.SemIri, PlanColumn, PlanParam], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'sem.unknown', 2, new Set(['string', 'datatype']), paramdefs, args) :
        bldrbase.makePositionalArgs('sem.unknown', 2, false, paramdefs, args);
    return new types.SemUnknown('sem', 'unknown', checkedArgs);

    }
/**
    * Returns the datatype IRI of a sem:unknown value.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/sem.unknownDatatype|sem.unknownDatatype}
    * @method planBuilder.sem#unknownDatatype
    * @since 2.1.1
    * @param { SemUnknown } [val] - The sem:unknown value.
    * @returns { SemIri }
    */
unknownDatatype(...args) {
    const paramdef = ['val', [types.SemUnknown, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('sem.unknownDatatype', 1, paramdef, args);
    return new types.SemIri('sem', 'unknown-datatype', checkedArgs);
    }
/**
    * Return a UUID URN (RFC4122) as a sem:iri value. This XQuery function backs up the SPARQL UUID() function.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/sem.uuid|sem.uuid}
    * @method planBuilder.sem#uuid
    * @since 2.1.1

    * @returns { SemIri }
    */
uuid(...args) {
    bldrbase.checkMaxArity('sem.uuid', args.length, 0);
    return new types.SemIri('sem', 'uuid', args);
    }
/**
    * Return a string that is the scheme specific part of random UUID URN (RFC4122). This XQuery function backs up the SPARQL STRUUID() function.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/sem.uuidString|sem.uuidString}
    * @method planBuilder.sem#uuidString
    * @since 2.1.1

    * @returns { XsString }
    */
uuidString(...args) {
    bldrbase.checkMaxArity('sem.uuidString', args.length, 0);
    return new types.XsString('sem', 'uuid-string', args);
    }
}
class SpellExpr {
  constructor() {
  }
  /**
    * Given a word returns the two metaphone keys. The primary and secondary metaphone keys which represent the phonetic encoding of two words are returned as a sequence of two strings. Double metaphone is an algorithm based on phonetic sounds useful in providing data to spelling correction suggestions. Provides a client interface to a server function. See {@link http://docs.marklogic.com/spell.doubleMetaphone|spell.doubleMetaphone}
    * @method planBuilder.spell#doubleMetaphone
    * @since 2.1.1
    * @param { XsString } [word] - The word for phonetic matching.
    * @returns { XsString }
    */
doubleMetaphone(...args) {
    const paramdef = ['word', [types.XsString, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('spell.doubleMetaphone', 1, paramdef, args);
    return new types.XsString('spell', 'double-metaphone', checkedArgs);
    }
/**
    * Given two strings, returns the Levenshtein distance between those strings. The Levenshtein distance is a measure of how many operations it takes to transform a string into another string, and it is useful in determining if a word is spelled correctly, or in simply comparing how "different" two words are. Provides a client interface to a server function. See {@link http://docs.marklogic.com/spell.levenshteinDistance|spell.levenshteinDistance}
    * @method planBuilder.spell#levenshteinDistance
    * @since 2.1.1
    * @param { XsString } [str1] - The first input string.
    * @param { XsString } [str2] - The second input string.
    * @returns { XsInteger }
    */
levenshteinDistance(...args) {
    const namer = bldrbase.getNamer(args, 'str1');
    const paramdefs = [['str1', [types.XsString, PlanColumn, PlanParam], true, false], ['str2', [types.XsString, PlanColumn, PlanParam], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'spell.levenshteinDistance', 2, new Set(['str1', 'str2']), paramdefs, args) :
        bldrbase.makePositionalArgs('spell.levenshteinDistance', 2, false, paramdefs, args);
    return new types.XsInteger('spell', 'levenshtein-distance', checkedArgs);

    }
/**
    * Returns the romanization of the string, substituting basic Latin letters for the letters in the string, according to their sound. Unsupported characters will be mapped to '?' for compatibility with the double metaphone algorithm. We support romanization of the scripts of the languages with advanced support in MarkLogic except for Chinese characters and Hangul. Provides a client interface to a server function. See {@link http://docs.marklogic.com/spell.romanize|spell.romanize}
    * @method planBuilder.spell#romanize
    * @since 2.1.1
    * @param { XsString } [string] - The input string.
    * @returns { XsString }
    */
romanize(...args) {
    const paramdef = ['string', [types.XsString, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('spell.romanize', 1, paramdef, args);
    return new types.XsString('spell', 'romanize', checkedArgs);
    }
}
class SqlExpr {
  constructor() {
  }
  /**
    * Returns the length of the string "str" in bits. Provides a client interface to a server function. See {@link http://docs.marklogic.com/sql.bitLength|sql.bitLength}
    * @method planBuilder.sql#bitLength
    * @since 2.1.1
    * @param { XsString } [str] - The string to be evaluated.
    * @returns { XsInteger }
    */
bitLength(...args) {
    const paramdef = ['str', [types.XsString, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('sql.bitLength', 1, paramdef, args);
    return new types.XsInteger('sql', 'bit-length', checkedArgs);
    }
/**
    * Returns an unsignedLong specifying the index of the bucket the second parameter belongs to in buckets formed by the first parameter. Values that lie on the edge of a bucket fall to the greater index. Provides a client interface to a server function. See {@link http://docs.marklogic.com/sql.bucket|sql.bucket}
    * @method planBuilder.sql#bucket
    * @since 2.1.1
    * @param { XsAnyAtomicType } [bucketEdgesParam] - A sequence of ordered values indicating the edges of a collection of buckets. If the sequence is out of order or has duplicates, SQL-UNORDERED is thrown.
    * @param { XsAnyAtomicType } [srchParam] - A value to find an index for in the bucket edge list.
    * @param { XsString } [collationLiteral] - A collation identifier. All bucketEdgesParam and srcParam are converted to a string of this collation if supplied.
    * @returns { XsUnsignedLong }
    */
bucket(...args) {
    const namer = bldrbase.getNamer(args, 'bucketEdgesParam');
    const paramdefs = [['bucketEdgesParam', [types.XsAnyAtomicType, PlanColumn, PlanParam], false, true], ['srchParam', [types.XsAnyAtomicType, PlanColumn, PlanParam], true, false], ['collationLiteral', [types.XsString, PlanColumn, PlanParam], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'sql.bucket', 2, new Set(['bucketEdgesParam', 'srchParam', 'collationLiteral']), paramdefs, args) :
        bldrbase.makePositionalArgs('sql.bucket', 2, false, paramdefs, args);
    return new types.XsUnsignedLong('sql', 'bucket', checkedArgs);

    }
/**
    * Returns an rdf:collatedString value with the given value and collation tag. The rdf:collatedString type extends xs:string , and represents a collation tagged string in RDF.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/sql.collatedString|sql.collatedString}
    * @method planBuilder.sql#collatedString
    * @since 2.1.1
    * @param { XsString } [string] - The lexical value.
    * @param { XsString } [collationURI] - The collation URI.
    * @returns { XsString }
    */
collatedString(...args) {
    const namer = bldrbase.getNamer(args, 'string');
    const paramdefs = [['string', [types.XsString, PlanColumn, PlanParam], true, false], ['collationURI', [types.XsString, PlanColumn, PlanParam], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'sql.collatedString', 2, new Set(['string', 'collationURI']), paramdefs, args) :
        bldrbase.makePositionalArgs('sql.collatedString', 2, false, paramdefs, args);
    return new types.XsString('sql', 'collated-string', checkedArgs);

    }
/**
    * Returns a specified date with the specified number interval (signed integer) added to a specified datepart of that date  Provides a client interface to a server function. See {@link http://docs.marklogic.com/sql:dateadd|sql:dateadd}
    * @method planBuilder.sql#dateadd
    * @since 2.1.1
    * @param { XsString } [datepart] - Is the part of date where the number will be added. The following table lists all valid datepart arguments. User-defined variable equivalents are not valid. The return data type is the data type of the date argument. Options: datepart parameter abbreviation includes:  "year","yyyy","yy" The year part of the date "quarter","qq","q" The quarter part of the date "month","mm","m" The month part of the date "dayofyear","dy","y" The day of the year from the date "day","dd","d" The day of the month from the date "week","wk","ww" The week of the year from the date "weekday","dw" The day of the week from the date "hour","hh" The hour of the day from the date "minute","mi","n" The minute of the hour from the date "second","ss","s" The second of the minute from the date "millisecond","ms" The millisecond of the minute from the date "microsecond","msc" The microsecond of the minute from the date "nanosecond","ns" The nanosecond of the minute from the date 
    * @param { XsInt } [number] - This number will be added to the datepart of the given date.
    * @param { Item } [date] - Is an expression that can be resolved to a time, date or datetime, value. date can be an expression, column expression, user-defined variable or string literal. startdate is subtracted from enddate.
    * @returns { Item }
    */
dateadd(...args) {
    const namer = bldrbase.getNamer(args, 'datepart');
    const paramdefs = [['datepart', [types.XsString, PlanColumn, PlanParam], false, false], ['number', [types.XsInt, PlanColumn, PlanParam], false, false], ['date', [types.Item, PlanColumn, PlanParam], false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'sql.dateadd', 3, new Set(['datepart', 'number', 'date']), paramdefs, args) :
        bldrbase.makePositionalArgs('sql.dateadd', 3, false, paramdefs, args);
    return new types.Item('sql', 'dateadd', checkedArgs);

    }
/**
    * Returns the count (signed integer) of the specified datepart boundaries crossed between the specified startdate and enddate.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/sql:datediff|sql:datediff}
    * @method planBuilder.sql#datediff
    * @since 2.1.1
    * @param { XsString } [datepart] - Is the part of startdate and enddate that specifies the type of boundary crossed. The following table lists all valid datepart arguments. User-defined variable equivalents are not valid. Options: datepart parameter abbreviation includes:  "year","yyyy","yy" The year part of the date "quarter","qq","q" The quarter part of the date "month","mm","m" The month part of the date "dayofyear","dy","y" The day of the year from the date "day","dd","d" The day of the month from the date "week","wk","ww" The week of the year from the date "weekday","dw" The day of the week from the date "hour","hh" The hour of the day from the date "minute","mi","n" The minute of the hour from the date "second","ss","s" The second of the minute from the date "millisecond","ms" The millisecond of the minute from the date "microsecond","msc" The microsecond of the minute from the date "nanosecond","ns" The nanosecond of the minute from the date 
    * @param { Item } [startdate] - Is an expression that can be resolved to a time, date, datetime or value. date can be an expression, column expression, user-defined variable or string literal. startdate is subtracted from enddate.
    * @param { Item } [enddate] - Same as startdate.
    * @returns { XsInteger }
    */
datediff(...args) {
    const namer = bldrbase.getNamer(args, 'datepart');
    const paramdefs = [['datepart', [types.XsString, PlanColumn, PlanParam], false, false], ['startdate', [types.Item, PlanColumn, PlanParam], false, false], ['enddate', [types.Item, PlanColumn, PlanParam], false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'sql.datediff', 3, new Set(['datepart', 'startdate', 'enddate']), paramdefs, args) :
        bldrbase.makePositionalArgs('sql.datediff', 3, false, paramdefs, args);
    return new types.XsInteger('sql', 'datediff', checkedArgs);

    }
/**
    * Returns an integer that represents the specified datepart of the specified date.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/sql:datepart|sql:datepart}
    * @method planBuilder.sql#datepart
    * @since 2.1.1
    * @param { XsString } [datepart] - The part of date that to be returned. Options: datepart parameter abbreviation includes:  "year","yyyy","yy" The year part of the date "quarter","qq","q" The quarter part of the date "month","mm","m" The month part of the date "dayofyear","dy","y" The day of the year from the date "day","dd","d" The day of the month from the date "week","wk","ww" The week of the year from the date "weekday","dw" The day of the week from the date "hour","hh" The hour of the day from the date "minute","mi","n" The minute of the hour from the date "second","ss","s" The second of the minute from the date "millisecond","ms" The millisecond of the minute from the date "microsecond","msc" The microsecond of the minute from the date "nanosecond","ns" The nanosecond of the minute from the date "TZoffset","tz" The timezone offset from the date 
    * @param { Item } [date] - Is an expression that can be resolved to a xs:date, xs:time, xs:dateTime. date can be an expression, column expression,user-defined variable, or string literal.
    * @returns { XsInteger }
    */
datepart(...args) {
    const namer = bldrbase.getNamer(args, 'datepart');
    const paramdefs = [['datepart', [types.XsString, PlanColumn, PlanParam], true, false], ['date', [types.Item, PlanColumn, PlanParam], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'sql.datepart', 2, new Set(['datepart', 'date']), paramdefs, args) :
        bldrbase.makePositionalArgs('sql.datepart', 2, false, paramdefs, args);
    return new types.XsInteger('sql', 'datepart', checkedArgs);

    }
/**
    * Returns an xs:integer between 1 and 31, both inclusive, representing the day component in the localized value of arg.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/sql.day|sql.day}
    * @method planBuilder.sql#day
    * @since 2.1.1
    * @param { Item } [arg] - The xs:genericDateTimeArg whose day component will be returned.
    * @returns { XsInteger }
    */
day(...args) {
    const paramdef = ['arg', [types.Item, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('sql.day', 1, paramdef, args);
    return new types.XsInteger('sql', 'day', checkedArgs);
    }
/**
    * Returns an xs:string representing the dayname value in the localized value of arg.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/sql.dayname|sql.dayname}
    * @method planBuilder.sql#dayname
    * @since 2.1.1
    * @param { Item } [arg] - The date whose dayname value will be returned.
    * @returns { XsString }
    */
dayname(...args) {
    const paramdef = ['arg', [types.Item, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('sql.dayname', 1, paramdef, args);
    return new types.XsString('sql', 'dayname', checkedArgs);
    }
/**
    * Returns true if the specified input glob the specified pattern, otherwise returns false. Provides a client interface to a server function. See {@link http://docs.marklogic.com/sql.glob|sql.glob}
    * @method planBuilder.sql#glob
    * @since 2.1.1
    * @param { XsString } [input] - The input from which to match.
    * @param { XsString } [pattern] - The expression to match. '?' matches one character and '*' matches any number of characters.
    * @returns { XsBoolean }
    */
glob(...args) {
    const namer = bldrbase.getNamer(args, 'input');
    const paramdefs = [['input', [types.XsString, PlanColumn, PlanParam], false, false], ['pattern', [types.XsString, PlanColumn, PlanParam], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'sql.glob', 2, new Set(['input', 'pattern']), paramdefs, args) :
        bldrbase.makePositionalArgs('sql.glob', 2, false, paramdefs, args);
    return new types.XsBoolean('sql', 'glob', checkedArgs);

    }
/**
    * Returns an xs:integer between 0 and 23, both inclusive, representing the value of the hours component in the localized value of arg.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/sql.hours|sql.hours}
    * @method planBuilder.sql#hours
    * @since 2.1.1
    * @param { Item } [arg] - The genericDateTime whose hours component will be returned.
    * @returns { XsInteger }
    */
hours(...args) {
    const paramdef = ['arg', [types.Item, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('sql.hours', 1, paramdef, args);
    return new types.XsInteger('sql', 'hours', checkedArgs);
    }
/**
    * If the first expression is NULL, then the value of the second expression is returned. If not null, the first expression is returned. Provides a client interface to a server function. See {@link http://docs.marklogic.com/sql.ifnull|sql.ifnull}
    * @method planBuilder.sql#ifnull
    * @since 2.1.1
    * @param { Item } [expr1] - First expression to be evaluated.
    * @param { Item } [expr2] - Second expression to be evaluated.
    * @returns { XsAnyAtomicType }
    */
ifnull(...args) {
    const namer = bldrbase.getNamer(args, 'expr1');
    const paramdefs = [['expr1', [types.Item, PlanColumn, PlanParam], false, true], ['expr2', [types.Item, PlanColumn, PlanParam], false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'sql.ifnull', 2, new Set(['expr1', 'expr2']), paramdefs, args) :
        bldrbase.makePositionalArgs('sql.ifnull', 2, false, paramdefs, args);
    return new types.XsAnyAtomicType('sql', 'ifnull', checkedArgs);

    }
/**
    * Returns a string that that is the first argument with length characters removed starting at start and the second string has been inserted beginning at start. Provides a client interface to a server function. See {@link http://docs.marklogic.com/sql.insert|sql.insert}
    * @method planBuilder.sql#insert
    * @since 2.1.1
    * @param { XsString } [str] - The string to manipulate.
    * @param { XsNumeric } [start] - The starting position where characters will be inserted.
    * @param { XsNumeric } [length] - The number of characters to be removed.
    * @param { XsString } [str2] - The string to insert.
    * @returns { XsString }
    */
insert(...args) {
    const namer = bldrbase.getNamer(args, 'str');
    const paramdefs = [['str', [types.XsString, PlanColumn, PlanParam], true, false], ['start', [types.XsNumeric, PlanColumn, PlanParam], true, false], ['length', [types.XsNumeric, PlanColumn, PlanParam], true, false], ['str2', [types.XsString, PlanColumn, PlanParam], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'sql.insert', 4, new Set(['str', 'start', 'length', 'str2']), paramdefs, args) :
        bldrbase.makePositionalArgs('sql.insert', 4, false, paramdefs, args);
    return new types.XsString('sql', 'insert', checkedArgs);

    }
/**
    * Find the starting location of a pattern in a string. Provides a client interface to a server function. See {@link http://docs.marklogic.com/sql.instr|sql.instr}
    * @method planBuilder.sql#instr
    * @since 2.1.1
    * @param { XsString } [str] - The string to be evaluated.
    * @param { XsString } [n] - The pattern to be evaluated.
    * @returns { XsUnsignedInt }
    */
instr(...args) {
    const namer = bldrbase.getNamer(args, 'str');
    const paramdefs = [['str', [types.XsString, PlanColumn, PlanParam], true, false], ['n', [types.XsString, PlanColumn, PlanParam], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'sql.instr', 2, new Set(['str', 'n']), paramdefs, args) :
        bldrbase.makePositionalArgs('sql.instr', 2, false, paramdefs, args);
    return new types.XsUnsignedInt('sql', 'instr', checkedArgs);

    }
/**
    * Returns a string that is the leftmost characters of the target string. The number of characters to return is specified by the second argument. Provides a client interface to a server function. See {@link http://docs.marklogic.com/sql.left|sql.left}
    * @method planBuilder.sql#left
    * @since 2.1.1
    * @param { XsAnyAtomicType } [str] - The base string. If the value is not a string, its string value will be used.
    * @param { XsNumeric } [n] - The number of leftmost characters of the string to return.
    * @returns { XsString }
    */
left(...args) {
    const namer = bldrbase.getNamer(args, 'str');
    const paramdefs = [['str', [types.XsAnyAtomicType, PlanColumn, PlanParam], false, false], ['n', [types.XsNumeric, PlanColumn, PlanParam], false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'sql.left', 2, new Set(['str', 'n']), paramdefs, args) :
        bldrbase.makePositionalArgs('sql.left', 2, false, paramdefs, args);
    return new types.XsString('sql', 'left', checkedArgs);

    }
/**
    * Returns true if the specified input like the specified pattern, otherwise returns false. Provides a client interface to a server function. See {@link http://docs.marklogic.com/sql.like|sql.like}
    * @method planBuilder.sql#like
    * @since 2.1.1
    * @param { XsString } [input] - The input from which to match.
    * @param { XsString } [pattern] - The expression to match. '_' matches one character and '%' matches any number of characters.
    * @param { XsString } [escape] - If a '_' or '%' are preceeded by an escape character then it will be match as the char '_'/'%' themselves.
    * @returns { XsBoolean }
    */
like(...args) {
    const namer = bldrbase.getNamer(args, 'input');
    const paramdefs = [['input', [types.XsString, PlanColumn, PlanParam], false, false], ['pattern', [types.XsString, PlanColumn, PlanParam], true, false], ['escape', [types.XsString, PlanColumn, PlanParam], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'sql.like', 2, new Set(['input', 'pattern', 'escape']), paramdefs, args) :
        bldrbase.makePositionalArgs('sql.like', 2, false, paramdefs, args);
    return new types.XsBoolean('sql', 'like', checkedArgs);

    }
/**
    * Return a string that removes leading empty spaces in the input string. Provides a client interface to a server function. See {@link http://docs.marklogic.com/sql.ltrim|sql.ltrim}
    * @method planBuilder.sql#ltrim
    * @since 2.1.1
    * @param { XsString } [str] - The string to be evaluated.
    * @returns { XsString }
    */
ltrim(...args) {
    const paramdef = ['str', [types.XsString, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('sql.ltrim', 1, paramdef, args);
    return new types.XsString('sql', 'ltrim', checkedArgs);
    }
/**
    * Returns an xs:integer value between 0 to 59, both inclusive, representing the value of the minutes component in the localized value of arg.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/sql.minutes|sql.minutes}
    * @method planBuilder.sql#minutes
    * @since 2.1.1
    * @param { Item } [arg] - The genericDateTime whose minutes component will be returned.
    * @returns { XsInteger }
    */
minutes(...args) {
    const paramdef = ['arg', [types.Item, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('sql.minutes', 1, paramdef, args);
    return new types.XsInteger('sql', 'minutes', checkedArgs);
    }
/**
    * Returns an xs:integer between 1 and 12, both inclusive, representing the month component in the localized value of arg.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/sql.month|sql.month}
    * @method planBuilder.sql#month
    * @since 2.1.1
    * @param { Item } [arg] - The genericDateTime whose month component will be returned.
    * @returns { XsInteger }
    */
month(...args) {
    const paramdef = ['arg', [types.Item, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('sql.month', 1, paramdef, args);
    return new types.XsInteger('sql', 'month', checkedArgs);
    }
/**
    * Returns month name, calculated from the localized value of arg.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/sql.monthname|sql.monthname}
    * @method planBuilder.sql#monthname
    * @since 2.1.1
    * @param { Item } [arg] - The date whose month-name will be returned.
    * @returns { XsString }
    */
monthname(...args) {
    const paramdef = ['arg', [types.Item, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('sql.monthname', 1, paramdef, args);
    return new types.XsString('sql', 'monthname', checkedArgs);
    }
/**
    * Returns a NULL value if the two specified values are equal. Returns the first value if they are not equal Provides a client interface to a server function. See {@link http://docs.marklogic.com/sql.nullif|sql.nullif}
    * @method planBuilder.sql#nullif
    * @since 2.1.1
    * @param { Item } [expr1] - First expression to be evaluated.
    * @param { Item } [expr2] - Second expression to be evaluated.
    * @returns { XsAnyAtomicType }
    */
nullif(...args) {
    const namer = bldrbase.getNamer(args, 'expr1');
    const paramdefs = [['expr1', [types.Item, PlanColumn, PlanParam], false, true], ['expr2', [types.Item, PlanColumn, PlanParam], false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'sql.nullif', 2, new Set(['expr1', 'expr2']), paramdefs, args) :
        bldrbase.makePositionalArgs('sql.nullif', 2, false, paramdefs, args);
    return new types.XsAnyAtomicType('sql', 'nullif', checkedArgs);

    }
/**
    * Returns the length of the string "str" in bits. Provides a client interface to a server function. See {@link http://docs.marklogic.com/sql.octetLength|sql.octetLength}
    * @method planBuilder.sql#octetLength
    * @since 2.1.1
    * @param { XsString } [x] - The string to be evaluated.
    * @returns { XsInteger }
    */
octetLength(...args) {
    const paramdef = ['x', [types.XsString, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('sql.octetLength', 1, paramdef, args);
    return new types.XsInteger('sql', 'octet-length', checkedArgs);
    }
/**
    * Returns an xs:integer between 1 and 4, both inclusive, calculating the quarter component in the localized value of arg.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/sql.quarter|sql.quarter}
    * @method planBuilder.sql#quarter
    * @since 2.1.1
    * @param { Item } [arg] - The genericDateTime whose quarter component will be returned.
    * @returns { XsInteger }
    */
quarter(...args) {
    const paramdef = ['arg', [types.Item, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('sql.quarter', 1, paramdef, args);
    return new types.XsInteger('sql', 'quarter', checkedArgs);
    }
/**
    * Return a random number. This differs from xdmp:random in that the argument is a seed. Provides a client interface to a server function. See {@link http://docs.marklogic.com/sql.rand|sql.rand}
    * @method planBuilder.sql#rand
    * @since 2.1.1
    * @param { XsUnsignedLong } [n] - The random seed. Currently this parameter is ignored.
    * @returns { XsUnsignedLong }
    */
rand(...args) {
    const paramdef = ['n', [types.XsUnsignedLong, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('sql.rand', 1, paramdef, args);
    return new types.XsUnsignedLong('sql', 'rand', checkedArgs);
    }
/**
    * Returns a string that concatenates the first argument as many times as specified by the second argument. Provides a client interface to a server function. See {@link http://docs.marklogic.com/sql.repeat|sql.repeat}
    * @method planBuilder.sql#repeat
    * @since 2.1.1
    * @param { Item } [str] - The string to duplicate. If the value is not a string, its string value will be used.
    * @param { XsNumeric } [n] - The number of times to repeat the string.
    * @returns { XsString }
    */
repeat(...args) {
    const namer = bldrbase.getNamer(args, 'str');
    const paramdefs = [['str', [types.Item, PlanColumn, PlanParam], false, true], ['n', [types.XsNumeric, PlanColumn, PlanParam], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'sql.repeat', 2, new Set(['str', 'n']), paramdefs, args) :
        bldrbase.makePositionalArgs('sql.repeat', 2, false, paramdefs, args);
    return new types.XsString('sql', 'repeat', checkedArgs);

    }
/**
    * Returns a string that is the rightmost characters of the target string. The number of characters to return is specified by the second argument. Provides a client interface to a server function. See {@link http://docs.marklogic.com/sql.right|sql.right}
    * @method planBuilder.sql#right
    * @since 2.1.1
    * @param { XsAnyAtomicType } [str] - The base string. If the value is not a string, its string value will be used.
    * @param { XsNumeric } [n] - The number of rightmost characters of the string to return.
    * @returns { XsString }
    */
right(...args) {
    const namer = bldrbase.getNamer(args, 'str');
    const paramdefs = [['str', [types.XsAnyAtomicType, PlanColumn, PlanParam], false, false], ['n', [types.XsNumeric, PlanColumn, PlanParam], false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'sql.right', 2, new Set(['str', 'n']), paramdefs, args) :
        bldrbase.makePositionalArgs('sql.right', 2, false, paramdefs, args);
    return new types.XsString('sql', 'right', checkedArgs);

    }
/**
    * Constructs a row identifier from the string form of the temporary identifier assigned to a row during processing. Provides a client interface to a server function.
    * @method planBuilder.sql#rowID
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg1] - 
    * @returns { SqlRowID }
    */
rowID(...args) {
    const paramdef = ['arg1', [types.XsAnyAtomicType, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('sql.rowID', 1, paramdef, args);
    return new types.SqlRowID('sql', 'rowID', checkedArgs);
    }
/**
    * Return a string that removes trailing empty spaces in the input string. Provides a client interface to a server function. See {@link http://docs.marklogic.com/sql.rtrim|sql.rtrim}
    * @method planBuilder.sql#rtrim
    * @since 2.1.1
    * @param { XsString } [str] - The string to be evaluated.
    * @returns { XsString }
    */
rtrim(...args) {
    const paramdef = ['str', [types.XsString, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('sql.rtrim', 1, paramdef, args);
    return new types.XsString('sql', 'rtrim', checkedArgs);
    }
/**
    * Returns an xs:decimal value between 0 and 60.999..., both inclusive, representing the seconds and fractional seconds in the localized value of arg. Note that the value can be greater than 60 seconds to accommodate occasional leap seconds used to keep human time synchronized with the rotation of the planet.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/sql.seconds|sql.seconds}
    * @method planBuilder.sql#seconds
    * @since 2.1.1
    * @param { Item } [arg] - The time whose seconds component will be returned.
    * @returns { XsDecimal }
    */
seconds(...args) {
    const paramdef = ['arg', [types.Item, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('sql.seconds', 1, paramdef, args);
    return new types.XsDecimal('sql', 'seconds', checkedArgs);
    }
/**
    * Returns the sign of number x. Provides a client interface to a server function. See {@link http://docs.marklogic.com/sql.sign|sql.sign}
    * @method planBuilder.sql#sign
    * @since 2.1.1
    * @param { XsNumeric } [x] - The number to be evaluated.
    * @returns { XsNumeric }
    */
sign(...args) {
    const paramdef = ['x', [types.XsNumeric, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('sql.sign', 1, paramdef, args);
    return new types.XsNumeric('sql', 'sign', checkedArgs);
    }
/**
    * Returns a four-character (SOUNDEX) code to evaluate the similarity of two strings.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/sql.soundex|sql.soundex}
    * @method planBuilder.sql#soundex
    * @since 2.1.1
    * @param { XsString } [arg] - The string whose soundex will be returned.
    * @returns { XsString }
    */
soundex(...args) {
    const paramdef = ['arg', [types.XsString, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('sql.soundex', 1, paramdef, args);
    return new types.XsString('sql', 'soundex', checkedArgs);
    }
/**
    * Returns a string that is the given number of spaces. Provides a client interface to a server function. See {@link http://docs.marklogic.com/sql.space|sql.space}
    * @method planBuilder.sql#space
    * @since 2.1.1
    * @param { XsNumeric } [n] - The number of spaces to return as a string.
    * @returns { XsString }
    */
space(...args) {
    const paramdef = ['n', [types.XsNumeric, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('sql.space', 1, paramdef, args);
    return new types.XsString('sql', 'space', checkedArgs);
    }
/**
    * Returns an integer value representing the starting position of a string within the search string. Note, the string starting position is 1. If the first parameter is empty, the result is the empty sequence. Provides a client interface to a server function. See {@link http://docs.marklogic.com/sql.strpos|sql.strpos}
    * @method planBuilder.sql#strpos
    * @since 2.1.1
    * @param { XsString } [target] - The string from which to test.
    * @param { XsString } [test] - The string to test for existence in the second parameter.
    * @param { XsString } [collation] - The optional name of a valid collation URI. For information on the collation URI syntax, see the Search Developer's Guide.
    * @returns { XsInteger }
    */
strpos(...args) {
    const namer = bldrbase.getNamer(args, 'target');
    const paramdefs = [['target', [types.XsString, PlanColumn, PlanParam], false, false], ['test', [types.XsString, PlanColumn, PlanParam], false, false], ['collation', [types.XsString, PlanColumn, PlanParam], false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'sql.strpos', 2, new Set(['target', 'test', 'collation']), paramdefs, args) :
        bldrbase.makePositionalArgs('sql.strpos', 2, false, paramdefs, args);
    return new types.XsInteger('sql', 'strpos', checkedArgs);

    }
/**
    * Returns a xs:string? timestamp created by adding a number to the given dateTimeType field of a given timestamp. Provides a client interface to a server function. See {@link http://docs.marklogic.com/sql.timestampadd|sql.timestampadd}
    * @method planBuilder.sql#timestampadd
    * @since 2.1.1
    * @param { XsString } [dateTimeType] - The dateTimeType of the timestamp where addition should take place. Available types are:  SQL_TSI_FRAC_SECOND nano seconds SQL_TSI_SECOND seconds SQL_TSI_MINUTE minute SQL_TSI_HOUR hour SQL_TSI_DAY day SQL_TSI_WEEK week SQL_TSI_MONTH month SQL_TSI_QUARTER quarter SQL_TSI_YEAR year 
    * @param { XsInt } [value] - The integer to add to the given dateTimeType field of the third parameter.
    * @param { Item } [timestamp] - The xs:dateTime timestamp to which addition has to take place.
    * @returns { Item }
    */
timestampadd(...args) {
    const namer = bldrbase.getNamer(args, 'dateTimeType');
    const paramdefs = [['dateTimeType', [types.XsString, PlanColumn, PlanParam], false, false], ['value', [types.XsInt, PlanColumn, PlanParam], false, false], ['timestamp', [types.Item, PlanColumn, PlanParam], false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'sql.timestampadd', 3, new Set(['dateTimeType', 'value', 'timestamp']), paramdefs, args) :
        bldrbase.makePositionalArgs('sql.timestampadd', 3, false, paramdefs, args);
    return new types.Item('sql', 'timestampadd', checkedArgs);

    }
/**
    * Returns the difference in dateTimeType field of two given timestamps. Provides a client interface to a server function. See {@link http://docs.marklogic.com/sql.timestampdiff|sql.timestampdiff}
    * @method planBuilder.sql#timestampdiff
    * @since 2.1.1
    * @param { XsString } [dateTimeType] - The dateTimeType of the timestamp where addition should take place. Available types are:  SQL_TSI_FRAC_SECOND nano seconds SQL_TSI_SECOND seconds SQL_TSI_MINUTE minute SQL_TSI_HOUR hour SQL_TSI_DAY day SQL_TSI_WEEK week SQL_TSI_MONTH month SQL_TSI_QUARTER quarter SQL_TSI_YEAR year 
    * @param { Item } [timestamp1] - The integer to add to the given dateTimeType field of the third parameter.
    * @param { Item } [timestamp2] - The xs:dateTime timestamp to which addition has to take place.
    * @returns { XsInteger }
    */
timestampdiff(...args) {
    const namer = bldrbase.getNamer(args, 'dateTimeType');
    const paramdefs = [['dateTimeType', [types.XsString, PlanColumn, PlanParam], false, false], ['timestamp1', [types.Item, PlanColumn, PlanParam], false, false], ['timestamp2', [types.Item, PlanColumn, PlanParam], false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'sql.timestampdiff', 3, new Set(['dateTimeType', 'timestamp1', 'timestamp2']), paramdefs, args) :
        bldrbase.makePositionalArgs('sql.timestampdiff', 3, false, paramdefs, args);
    return new types.XsInteger('sql', 'timestampdiff', checkedArgs);

    }
/**
    * Return a string that removes leading and trailing empty spaces in the input string. Provides a client interface to a server function. See {@link http://docs.marklogic.com/sql.trim|sql.trim}
    * @method planBuilder.sql#trim
    * @since 2.1.1
    * @param { XsString } [str] - The string to be evaluated.
    * @returns { XsString }
    */
trim(...args) {
    const paramdef = ['str', [types.XsString, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('sql.trim', 1, paramdef, args);
    return new types.XsString('sql', 'trim', checkedArgs);
    }
/**
    * Returns an xs:integer between 1 and 53, both inclusive, representing the week value in the localized value of arg.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/sql.week|sql.week}
    * @method planBuilder.sql#week
    * @since 2.1.1
    * @param { Item } [arg] - The dateTime/date/string whose day component will be returned.
    * @returns { XsInteger }
    */
week(...args) {
    const paramdef = ['arg', [types.Item, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('sql.week', 1, paramdef, args);
    return new types.XsInteger('sql', 'week', checkedArgs);
    }
/**
    * Returns the day of the week. Provides a client interface to a server function.
    * @method planBuilder.sql#weekday
    * @since 2.1.1
    * @param { Item } [arg1] - 
    * @returns { XsInteger }
    */
weekday(...args) {
    const paramdef = ['arg1', [types.Item, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('sql.weekday', 1, paramdef, args);
    return new types.XsInteger('sql', 'weekday', checkedArgs);
    }
/**
    * Returns an xs:integer representing the year component in the localized value of arg. The result may be negative.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/sql.year|sql.year}
    * @method planBuilder.sql#year
    * @since 2.1.1
    * @param { Item } [arg] - The dateTime/date/string whose day component will be returned.
    * @returns { XsInteger }
    */
year(...args) {
    const paramdef = ['arg', [types.Item, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('sql.year', 1, paramdef, args);
    return new types.XsInteger('sql', 'year', checkedArgs);
    }
/**
    * Returns an xs:integer between 1 and 366, both inclusive, representing the yearday value in the localized value of arg.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/sql.yearday|sql.yearday}
    * @method planBuilder.sql#yearday
    * @since 2.1.1
    * @param { Item } [arg] - The xs:genericDateTimeArg whose days of the year will be returned.
    * @returns { XsInteger }
    */
yearday(...args) {
    const paramdef = ['arg', [types.Item, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('sql.yearday', 1, paramdef, args);
    return new types.XsInteger('sql', 'yearday', checkedArgs);
    }
}
class XdmpExpr {
  constructor() {
  }
  /**
    * Add two 64-bit integer values, discarding overflow. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xdmp.add64|xdmp.add64}
    * @method planBuilder.xdmp#add64
    * @since 2.1.1
    * @param { XsUnsignedLong } [x] - The first value.
    * @param { XsUnsignedLong } [y] - The second value.
    * @returns { XsUnsignedLong }
    */
add64(...args) {
    const namer = bldrbase.getNamer(args, 'x');
    const paramdefs = [['x', [types.XsUnsignedLong, PlanColumn, PlanParam], true, false], ['y', [types.XsUnsignedLong, PlanColumn, PlanParam], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'xdmp.add64', 2, new Set(['x', 'y']), paramdefs, args) :
        bldrbase.makePositionalArgs('xdmp.add64', 2, false, paramdefs, args);
    return new types.XsUnsignedLong('xdmp', 'add64', checkedArgs);

    }
/**
    * AND two 64-bit integer values. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xdmp.and64|xdmp.and64}
    * @method planBuilder.xdmp#and64
    * @since 2.1.1
    * @param { XsUnsignedLong } [x] - The first value.
    * @param { XsUnsignedLong } [y] - The second value.
    * @returns { XsUnsignedLong }
    */
and64(...args) {
    const namer = bldrbase.getNamer(args, 'x');
    const paramdefs = [['x', [types.XsUnsignedLong, PlanColumn, PlanParam], true, false], ['y', [types.XsUnsignedLong, PlanColumn, PlanParam], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'xdmp.and64', 2, new Set(['x', 'y']), paramdefs, args) :
        bldrbase.makePositionalArgs('xdmp.and64', 2, false, paramdefs, args);
    return new types.XsUnsignedLong('xdmp', 'and64', checkedArgs);

    }
/**
    * Converts base64-encoded string to plaintext. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xdmp.base64Decode|xdmp.base64Decode}
    * @method planBuilder.xdmp#base64Decode
    * @since 2.1.1
    * @param { XsString } [encoded] - Encoded text to be decoded.
    * @returns { XsString }
    */
base64Decode(...args) {
    const paramdef = ['encoded', [types.XsString, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('xdmp.base64Decode', 1, paramdef, args);
    return new types.XsString('xdmp', 'base64-decode', checkedArgs);
    }
/**
    * Converts plaintext into base64-encoded string. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xdmp.base64Encode|xdmp.base64Encode}
    * @method planBuilder.xdmp#base64Encode
    * @since 2.1.1
    * @param { XsString } [plaintext] - Plaintext to be encoded.
    * @returns { XsString }
    */
base64Encode(...args) {
    const paramdef = ['plaintext', [types.XsString, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('xdmp.base64Encode', 1, paramdef, args);
    return new types.XsString('xdmp', 'base64-encode', checkedArgs);
    }
/**
    * Returns true if a value is castable. This is similar to the "castable as" XQuery predicate, except that the type is determined at runtime. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xdmp.castableAs|xdmp.castableAs}
    * @method planBuilder.xdmp#castableAs
    * @since 2.1.1
    * @param { XsString } [namespaceUri] - The namespace URI of the type.
    * @param { XsString } [localName] - The local-name of the type.
    * @param { Item } [item] - The item to be cast.
    * @returns { XsBoolean }
    */
castableAs(...args) {
    const namer = bldrbase.getNamer(args, 'namespace-uri');
    const paramdefs = [['namespace-uri', [types.XsString, PlanColumn, PlanParam], true, false], ['local-name', [types.XsString, PlanColumn, PlanParam], true, false], ['item', [types.Item, PlanColumn, PlanParam], false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'xdmp.castableAs', 3, new Set(['namespace-uri', 'local-name', 'item']), paramdefs, args) :
        bldrbase.makePositionalArgs('xdmp.castableAs', 3, false, paramdefs, args);
    return new types.XsBoolean('xdmp', 'castable-as', checkedArgs);

    }
/**
    * Calculates the password hash for the given password and salt. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xdmp.crypt|xdmp.crypt}
    * @method planBuilder.xdmp#crypt
    * @since 2.1.1
    * @param { XsString } [password] - String to be hashed.
    * @param { XsString } [salt] - Salt to avoid 1:1 mapping from passwords to hashes. Only the first 8 characters of the salt are significant; any characters beyond the eighth are ignored.
    * @returns { XsString }
    */
crypt(...args) {
    const namer = bldrbase.getNamer(args, 'password');
    const paramdefs = [['password', [types.XsString, PlanColumn, PlanParam], true, false], ['salt', [types.XsString, PlanColumn, PlanParam], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'xdmp.crypt', 2, new Set(['password', 'salt']), paramdefs, args) :
        bldrbase.makePositionalArgs('xdmp.crypt', 2, false, paramdefs, args);
    return new types.XsString('xdmp', 'crypt', checkedArgs);

    }
/**
    * Calculates the password hash for the given plain-text password. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xdmp.crypt2|xdmp.crypt2}
    * @method planBuilder.xdmp#crypt2
    * @since 2.1.1
    * @param { XsString } [password] - String to be hashed.
    * @returns { XsString }
    */
crypt2(...args) {
    const paramdef = ['password', [types.XsString, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('xdmp.crypt2', 1, paramdef, args);
    return new types.XsString('xdmp', 'crypt2', checkedArgs);
    }
/**
    * Returns string representing the dayname value in the localized value of arg.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/xdmp.daynameFromDate|xdmp.daynameFromDate}
    * @method planBuilder.xdmp#daynameFromDate
    * @since 2.1.1
    * @param { XsDate } [arg] - The date whose dayname value will be returned.
    * @returns { XsString }
    */
daynameFromDate(...args) {
    const paramdef = ['arg', [types.XsDate, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xdmp.daynameFromDate', 1, paramdef, args);
    return new types.XsString('xdmp', 'dayname-from-date', checkedArgs);
    }
/**
    * Invertible function that decodes characters an NCName produced by xdmp:encode-for-NCName. Given the NCName produced by xdmp:encode-for-NCName this function returns the original string. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xdmp.decodeFromNCName|xdmp.decodeFromNCName}
    * @method planBuilder.xdmp#decodeFromNCName
    * @since 2.1.1
    * @param { XsString } [name] - A string representing an NCName. This string must have been the result of a previous call to xdmp:decode-from-NCName or undefined results will occur.
    * @returns { XsString }
    */
decodeFromNCName(...args) {
    const paramdef = ['name', [types.XsString, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('xdmp.decodeFromNCName', 1, paramdef, args);
    return new types.XsString('xdmp', 'decode-from-NCName', checkedArgs);
    }
/**
    * Returns a string representing the description of a given item sequence. If you take the output of this function and evaluate it as an XQuery program, it returns the item(s) input to the function. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xdmp.describe|xdmp.describe}
    * @method planBuilder.xdmp#describe
    * @since 2.1.1
    * @param { Item } [item] - The item sequence whose description is returned.
    * @param { XsUnsignedInt } [maxSequenceLength] - Represents the maximum number of items per sequence to print. The default is 3. () means no maximum.
    * @param { XsUnsignedInt } [maxItemLength] - Represents the maximum number of characters per item to print. The default is 64. The minimum is 8. () means no limit.
    * @returns { XsString }
    */
describe(...args) {
    const namer = bldrbase.getNamer(args, 'item');
    const paramdefs = [['item', [types.Item, PlanColumn, PlanParam], false, true], ['max-sequence-length', [types.XsUnsignedInt, PlanColumn, PlanParam], false, false], ['max-item-length', [types.XsUnsignedInt, PlanColumn, PlanParam], false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'xdmp.describe', 1, new Set(['item', 'max-sequence-length', 'max-item-length']), paramdefs, args) :
        bldrbase.makePositionalArgs('xdmp.describe', 1, false, paramdefs, args);
    return new types.XsString('xdmp', 'describe', checkedArgs);

    }
/**
    * Returns the specified string, converting all of the characters with diacritics to characters without diacritics. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xdmp.diacriticLess|xdmp.diacriticLess}
    * @method planBuilder.xdmp#diacriticLess
    * @since 2.1.1
    * @param { XsString } [string] - The string to convert.
    * @returns { XsString }
    */
diacriticLess(...args) {
    const paramdef = ['string', [types.XsString, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('xdmp.diacriticLess', 1, paramdef, args);
    return new types.XsString('xdmp', 'diacritic-less', checkedArgs);
    }
/**
    * Returns the schema-defined content-type of an element ("empty", "simple", "element-only", or "mixed"). Provides a client interface to a server function. See {@link http://docs.marklogic.com/xdmp.elementContentType|xdmp.elementContentType}
    * @method planBuilder.xdmp#elementContentType
    * @since 2.1.1
    * @param { ElementNode } [element] - An element node.
    * @returns { XsString }
    */
elementContentType(...args) {
    const paramdef = ['element', [types.ElementNode, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('xdmp.elementContentType', 1, paramdef, args);
    return new types.XsString('xdmp', 'element-content-type', checkedArgs);
    }
/**
    * Invertible function that escapes characters required to be part of an NCName. This is useful when translating names from other representations such as JSON to XML. Given any string, the result is always a valid NCName. Providing all names are passed through this function the result is distinct NCNames so the results can be used for searching as well as name generation. The inverse function is xdmp:decode-from-NCName. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xdmp.encodeForNCName|xdmp.encodeForNCName}
    * @method planBuilder.xdmp#encodeForNCName
    * @since 2.1.1
    * @param { XsString } [name] - A string which is used as an NCName (such as the localname for an element or attribute).
    * @returns { XsString }
    */
encodeForNCName(...args) {
    const paramdef = ['name', [types.XsString, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('xdmp.encodeForNCName', 1, paramdef, args);
    return new types.XsString('xdmp', 'encode-for-NCName', checkedArgs);
    }
/**
    * Returns a formatted number value based on the picture argument. The difference between this function and the W3C standards fn:format-number function is that this function imitates the XSLT xsl:number instruction, which has richer formatting options than the fn:format-number fn:format-number function. This function can be used for spelled-out and ordinal numbering in many languages. This function is available in XSLT as well as in all dialects of XQuery and Server-Side JavaScript. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xdmp.formatNumber|xdmp.formatNumber}
    * @method planBuilder.xdmp#formatNumber
    * @since 2.1.1
    * @param { XsNumeric } [value] - The given numeric $value that needs to be formatted.
    * @param { XsString } [picture] - The desired string representation of the given numeric $value. The picture string is a sequence of characters, in which the characters represent variables such as, decimal-separator-sign, grouping-sign, zero-digit-sign, digit-sign, pattern-separator, percent sign and per-mille-sign. For details on the picture string, see http://www.w3.org/TR/xslt20/#date-picture-string. Unlike fn:format-number(), here the picture string allows spelled-out (uppercase, lowercase and Capitalcase) formatting.
    * @param { XsString } [language] - The desired language for string representation of the numeric $value. An empty sequence must be passed in even if a user doesn't want to specifiy this argument.
    * @param { XsString } [letterValue] - Same as letter-value attribute in xsl:number. This argument is ignored during formatting as of now. It may be used in future. An empty sequence must be passed in even if a user doesn't want to specifiy this argument.
    * @param { XsString } [ordchar] - If $ordchar is "yes" then ordinal numbering is attempted. If this is any other string, including an empty string, then cardinal numbering is generated. An empty sequence must be passed in even if a user doesn't want to specifiy this argument.
    * @param { XsString } [zeroPadding] - Value of $zero-padding is used to pad integer part of a number on the left and fractional part on the right, if needed. An empty sequence must be passed in even if a user doesn't want to specifiy this argument.
    * @param { XsString } [groupingSeparator] - Value of $grouping-separator is a character, used to groups of digits, especially useful in making long sequence of digits more readable. For example, 10,000,000- here "," is used as a separator after each group of three digits. An empty sequence must be passed in even if a user doesn't want to specify this argument.
    * @param { XsInteger } [groupingSize] - Represents size of the group, i.e. the number of digits before after which grouping separator is inserted. An empty sequence must be passed in even if a user doesn't want to specifiy this argument.
    * @returns { XsString }
    */
formatNumber(...args) {
    const namer = bldrbase.getNamer(args, 'value');
    const paramdefs = [['value', [types.XsNumeric, PlanColumn, PlanParam], false, true], ['picture', [types.XsString, PlanColumn, PlanParam], false, false], ['language', [types.XsString, PlanColumn, PlanParam], false, false], ['letter-value', [types.XsString, PlanColumn, PlanParam], false, false], ['ordchar', [types.XsString, PlanColumn, PlanParam], false, false], ['zero-padding', [types.XsString, PlanColumn, PlanParam], false, false], ['grouping-separator', [types.XsString, PlanColumn, PlanParam], false, false], ['grouping-size', [types.XsInteger, PlanColumn, PlanParam], false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'xdmp.formatNumber', 1, new Set(['value', 'picture', 'language', 'letter-value', 'ordchar', 'zero-padding', 'grouping-separator', 'grouping-size']), paramdefs, args) :
        bldrbase.makePositionalArgs('xdmp.formatNumber', 1, false, paramdefs, args);
    return new types.XsString('xdmp', 'format-number', checkedArgs);

    }
/**
    * Atomizes a JSON node, returning a JSON value. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xdmp.fromJson|xdmp.fromJson}
    * @method planBuilder.xdmp#fromJson
    * @since 2.1.1
    * @param { Node } [arg] - A node of kind object-node(), array-node(), text(), number-node(), boolean-node(), null-node(), or document-node().
    * @returns { Item }
    */
fromJson(...args) {
    const paramdef = ['arg', [types.Node, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('xdmp.fromJson', 1, paramdef, args);
    return new types.Item('xdmp', 'from-json', checkedArgs);
    }
/**
    * Returns the name of the current user. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xdmp.getCurrentUser|xdmp.getCurrentUser}
    * @method planBuilder.xdmp#getCurrentUser
    * @since 2.1.1

    * @returns { XsString }
    */
getCurrentUser(...args) {
    bldrbase.checkMaxArity('xdmp.getCurrentUser', args.length, 0);
    return new types.XsString('xdmp', 'get-current-user', args);
    }
/**
    * Returns the 32-bit hash of a string. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xdmp.hash32|xdmp.hash32}
    * @method planBuilder.xdmp#hash32
    * @since 2.1.1
    * @param { XsString } [string] - The string to be hashed.
    * @returns { XsUnsignedInt }
    */
hash32(...args) {
    const paramdef = ['string', [types.XsString, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('xdmp.hash32', 1, paramdef, args);
    return new types.XsUnsignedInt('xdmp', 'hash32', checkedArgs);
    }
/**
    * Returns the 64-bit hash of a string. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xdmp.hash64|xdmp.hash64}
    * @method planBuilder.xdmp#hash64
    * @since 2.1.1
    * @param { XsString } [string] - The string to be hashed.
    * @returns { XsUnsignedLong }
    */
hash64(...args) {
    const paramdef = ['string', [types.XsString, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('xdmp.hash64', 1, paramdef, args);
    return new types.XsUnsignedLong('xdmp', 'hash64', checkedArgs);
    }
/**
    * Parses a hexadecimal string, returning an integer. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xdmp.hexToInteger|xdmp.hexToInteger}
    * @method planBuilder.xdmp#hexToInteger
    * @since 2.1.1
    * @param { XsString } [hex] - The hexadecimal string.
    * @returns { XsInteger }
    */
hexToInteger(...args) {
    const paramdef = ['hex', [types.XsString, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('xdmp.hexToInteger', 1, paramdef, args);
    return new types.XsInteger('xdmp', 'hex-to-integer', checkedArgs);
    }
/**
    * Calculates the Hash-based Message Authentication Code (HMAC) using the md5 hash function of the given secret key and message arguments. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xdmp.hmacMd5|xdmp.hmacMd5}
    * @method planBuilder.xdmp#hmacMd5
    * @since 2.1.1
    * @param { Item } [secretkey] - The secret key. Must be xs:string or a binary node.
    * @param { Item } [message] - Message to be authenticated. Must be xs:string or a binary node.
    * @param { XsString } [encoding] - Encoding format for the output string, must be "hex" for hexadecimal or "base64". Default is "hex".
    * @returns { XsString }
    */
hmacMd5(...args) {
    const namer = bldrbase.getNamer(args, 'secretkey');
    const paramdefs = [['secretkey', [types.Item, PlanColumn, PlanParam], true, false], ['message', [types.Item, PlanColumn, PlanParam], true, false], ['encoding', [types.XsString, PlanColumn, PlanParam], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'xdmp.hmacMd5', 2, new Set(['secretkey', 'message', 'encoding']), paramdefs, args) :
        bldrbase.makePositionalArgs('xdmp.hmacMd5', 2, false, paramdefs, args);
    return new types.XsString('xdmp', 'hmac-md5', checkedArgs);

    }
/**
    * Calculates the Hash-based Message Authentication Code (HMAC) using the SHA1 hash function of the given secret key and message arguments. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xdmp.hmacSha1|xdmp.hmacSha1}
    * @method planBuilder.xdmp#hmacSha1
    * @since 2.1.1
    * @param { Item } [secretkey] - The secret key. Must be xs:string or a binary node.
    * @param { Item } [message] - Message to be authenticated. Must be xs:string or a binary node.
    * @param { XsString } [encoding] - Encoding format for the output string, must be "hex" for hexadecimal or "base64". Default is "hex".
    * @returns { XsString }
    */
hmacSha1(...args) {
    const namer = bldrbase.getNamer(args, 'secretkey');
    const paramdefs = [['secretkey', [types.Item, PlanColumn, PlanParam], true, false], ['message', [types.Item, PlanColumn, PlanParam], true, false], ['encoding', [types.XsString, PlanColumn, PlanParam], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'xdmp.hmacSha1', 2, new Set(['secretkey', 'message', 'encoding']), paramdefs, args) :
        bldrbase.makePositionalArgs('xdmp.hmacSha1', 2, false, paramdefs, args);
    return new types.XsString('xdmp', 'hmac-sha1', checkedArgs);

    }
/**
    * Calculates the Hash-based Message Authentication Code (HMAC) using the SHA256 hash function of the given secret key and message arguments. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xdmp.hmacSha256|xdmp.hmacSha256}
    * @method planBuilder.xdmp#hmacSha256
    * @since 2.1.1
    * @param { Item } [secretkey] - The secret key. Must be xs:string or a binary node.
    * @param { Item } [message] - Message to be authenticated. Must be xs:string or a binary node.
    * @param { XsString } [encoding] - Encoding format for the output string, must be "hex" for hexadecimal or "base64". Default is "hex".
    * @returns { XsString }
    */
hmacSha256(...args) {
    const namer = bldrbase.getNamer(args, 'secretkey');
    const paramdefs = [['secretkey', [types.Item, PlanColumn, PlanParam], true, false], ['message', [types.Item, PlanColumn, PlanParam], true, false], ['encoding', [types.XsString, PlanColumn, PlanParam], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'xdmp.hmacSha256', 2, new Set(['secretkey', 'message', 'encoding']), paramdefs, args) :
        bldrbase.makePositionalArgs('xdmp.hmacSha256', 2, false, paramdefs, args);
    return new types.XsString('xdmp', 'hmac-sha256', checkedArgs);

    }
/**
    * Calculates the Hash-based Message Authentication Code (HMAC) using the SHA512 hash function of the given secret key and message arguments. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xdmp.hmacSha512|xdmp.hmacSha512}
    * @method planBuilder.xdmp#hmacSha512
    * @since 2.1.1
    * @param { Item } [secretkey] - The secret key. Must be xs:string or a binary node.
    * @param { Item } [message] - Message to be authenticated. Must be xs:string or a binary node.
    * @param { XsString } [encoding] - Encoding format for the output string, must be "hex" for hexadecimal or "base64". Default is "hex".
    * @returns { XsString }
    */
hmacSha512(...args) {
    const namer = bldrbase.getNamer(args, 'secretkey');
    const paramdefs = [['secretkey', [types.Item, PlanColumn, PlanParam], true, false], ['message', [types.Item, PlanColumn, PlanParam], true, false], ['encoding', [types.XsString, PlanColumn, PlanParam], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'xdmp.hmacSha512', 2, new Set(['secretkey', 'message', 'encoding']), paramdefs, args) :
        bldrbase.makePositionalArgs('xdmp.hmacSha512', 2, false, paramdefs, args);
    return new types.XsString('xdmp', 'hmac-sha512', checkedArgs);

    }
/**
    * Returns the string where the first letter of each token has been uppercased. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xdmp.initcap|xdmp.initcap}
    * @method planBuilder.xdmp#initcap
    * @since 2.1.1
    * @param { XsString } [string] - The string to modify.
    * @returns { XsString }
    */
initcap(...args) {
    const paramdef = ['string', [types.XsString, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xdmp.initcap', 1, paramdef, args);
    return new types.XsString('xdmp', 'initcap', checkedArgs);
    }
/**
    * Returns a hexadecimal representation of an integer. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xdmp.integerToHex|xdmp.integerToHex}
    * @method planBuilder.xdmp#integerToHex
    * @since 2.1.1
    * @param { XsInteger } [val] - The integer value.
    * @returns { XsString }
    */
integerToHex(...args) {
    const paramdef = ['val', [types.XsInteger, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('xdmp.integerToHex', 1, paramdef, args);
    return new types.XsString('xdmp', 'integer-to-hex', checkedArgs);
    }
/**
    * Returns an octal representation of an integer. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xdmp.integerToOctal|xdmp.integerToOctal}
    * @method planBuilder.xdmp#integerToOctal
    * @since 2.1.1
    * @param { XsInteger } [val] - The integer value.
    * @returns { XsString }
    */
integerToOctal(...args) {
    const paramdef = ['val', [types.XsInteger, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('xdmp.integerToOctal', 1, paramdef, args);
    return new types.XsString('xdmp', 'integer-to-octal', checkedArgs);
    }
/**
    * Construct a context-independent string from a QName. This string is of the form "{namespaceURI}localname" and is suitable for use as a map key. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xdmp.keyFromQName|xdmp.keyFromQName}
    * @method planBuilder.xdmp#keyFromQName
    * @since 2.1.1
    * @param { XsQName } [name] - The QName to compute a key for.
    * @returns { XsString }
    */
keyFromQName(...args) {
    const paramdef = ['name', [types.XsQName, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('xdmp.keyFromQName', 1, paramdef, args);
    return new types.XsString('xdmp', 'key-from-QName', checkedArgs);
    }
/**
    * Left-shift a 64-bit integer value. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xdmp.lshift64|xdmp.lshift64}
    * @method planBuilder.xdmp#lshift64
    * @since 2.1.1
    * @param { XsUnsignedLong } [x] - The value to shift.
    * @param { XsLong } [y] - The left shift to perform. This value may be negative.
    * @returns { XsUnsignedLong }
    */
lshift64(...args) {
    const namer = bldrbase.getNamer(args, 'x');
    const paramdefs = [['x', [types.XsUnsignedLong, PlanColumn, PlanParam], true, false], ['y', [types.XsLong, PlanColumn, PlanParam], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'xdmp.lshift64', 2, new Set(['x', 'y']), paramdefs, args) :
        bldrbase.makePositionalArgs('xdmp.lshift64', 2, false, paramdefs, args);
    return new types.XsUnsignedLong('xdmp', 'lshift64', checkedArgs);

    }
/**
    * Calculates the md5 hash of the given argument. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xdmp.md5|xdmp.md5}
    * @method planBuilder.xdmp#md5
    * @since 2.1.1
    * @param { Item } [data] - Data to be hashed. Must be xs:string or a binary node.
    * @param { XsString } [encoding] - Encoding format for the output string, must be "hex" for hexadecimal or "base64". Default is "hex".
    * @returns { XsString }
    */
md5(...args) {
    const namer = bldrbase.getNamer(args, 'data');
    const paramdefs = [['data', [types.Item, PlanColumn, PlanParam], true, false], ['encoding', [types.XsString, PlanColumn, PlanParam], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'xdmp.md5', 1, new Set(['data', 'encoding']), paramdefs, args) :
        bldrbase.makePositionalArgs('xdmp.md5', 1, false, paramdefs, args);
    return new types.XsString('xdmp', 'md5', checkedArgs);

    }
/**
    * Returns month name, calculated from the localized value of arg.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/xdmp.monthNameFromDate|xdmp.monthNameFromDate}
    * @method planBuilder.xdmp#monthNameFromDate
    * @since 2.1.1
    * @param { XsDate } [arg] - The date whose month-name will be returned.
    * @returns { XsString }
    */
monthNameFromDate(...args) {
    const paramdef = ['arg', [types.XsDate, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xdmp.monthNameFromDate', 1, paramdef, args);
    return new types.XsString('xdmp', 'month-name-from-date', checkedArgs);
    }
/**
    * Multiply two 64-bit integer values, discarding overflow. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xdmp.mul64|xdmp.mul64}
    * @method planBuilder.xdmp#mul64
    * @since 2.1.1
    * @param { XsUnsignedLong } [x] - The first value.
    * @param { XsUnsignedLong } [y] - The second value.
    * @returns { XsUnsignedLong }
    */
mul64(...args) {
    const namer = bldrbase.getNamer(args, 'x');
    const paramdefs = [['x', [types.XsUnsignedLong, PlanColumn, PlanParam], true, false], ['y', [types.XsUnsignedLong, PlanColumn, PlanParam], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'xdmp.mul64', 2, new Set(['x', 'y']), paramdefs, args) :
        bldrbase.makePositionalArgs('xdmp.mul64', 2, false, paramdefs, args);
    return new types.XsUnsignedLong('xdmp', 'mul64', checkedArgs);

    }
/**
    * Returns any collections for the node's document in the database. If the specified node does not come from a document in a database, then xdmp:node-collections returns an empty sequence. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xdmp.nodeCollections|xdmp.nodeCollections}
    * @method planBuilder.xdmp#nodeCollections
    * @since 2.1.1
    * @param { Node } [node] - The node whose collections are to be returned.
    * @returns { XsString }
    */
nodeCollections(...args) {
    const paramdef = ['node', [types.Node, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('xdmp.nodeCollections', 1, paramdef, args);
    return new types.XsString('xdmp', 'node-collections', checkedArgs);
    }
/**
    * Returns an xs:string representing the node's kind: either "document", "element", "attribute", "text", "namespace", "processing-instruction", "binary", or "comment".   Provides a client interface to a server function. See {@link http://docs.marklogic.com/xdmp.nodeKind|xdmp.nodeKind}
    * @method planBuilder.xdmp#nodeKind
    * @since 2.1.1
    * @param { Node } [node] - The node whose kind is to be returned.
    * @returns { XsString }
    */
nodeKind(...args) {
    const paramdef = ['node', [types.Node, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('xdmp.nodeKind', 1, paramdef, args);
    return new types.XsString('xdmp', 'node-kind', checkedArgs);
    }
/**
    * Returns the metadata value of a given node. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xdmp.nodeMetadata|xdmp.nodeMetadata}
    * @method planBuilder.xdmp#nodeMetadata
    * @since 2.1.1
    * @param { Node } [node] - The node whose metadata are to be returned.
    * @returns { MapMap }
    */
nodeMetadata(...args) {
    const paramdef = ['node', [types.Node, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('xdmp.nodeMetadata', 1, paramdef, args);
    return new types.MapMap('xdmp', 'node-metadata', checkedArgs);
    }
/**
    * Returns the metadata value of a node for a particular key. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xdmp.nodeMetadataValue|xdmp.nodeMetadataValue}
    * @method planBuilder.xdmp#nodeMetadataValue
    * @since 2.1.1
    * @param { Node } [node] - The node whose metadata are to be returned.
    * @param { XsString } [keyName] - Name of the key for the metadata.
    * @returns { XsString }
    */
nodeMetadataValue(...args) {
    const namer = bldrbase.getNamer(args, 'node');
    const paramdefs = [['node', [types.Node, PlanColumn, PlanParam], true, false], ['keyName', [types.XsString, PlanColumn, PlanParam], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'xdmp.nodeMetadataValue', 2, new Set(['node', 'keyName']), paramdefs, args) :
        bldrbase.makePositionalArgs('xdmp.nodeMetadataValue', 2, false, paramdefs, args);
    return new types.XsString('xdmp', 'node-metadata-value', checkedArgs);

    }
/**
    * Returns the permissions to a node's document. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xdmp.nodePermissions|xdmp.nodePermissions}
    * @method planBuilder.xdmp#nodePermissions
    * @since 2.1.1
    * @param { Node } [node] - The node.
    * @param { XsString } [outputKind] - The output kind. It can be either "elements" or "objects". With "elements", the built-in returns a sequence of XML elements. With "objects", the built-in returns a sequence of map:map. The default is "elements".
    * @returns { Item }
    */
nodePermissions(...args) {
    const namer = bldrbase.getNamer(args, 'node');
    const paramdefs = [['node', [types.Node, PlanColumn, PlanParam], true, false], ['output-kind', [types.XsString, PlanColumn, PlanParam], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'xdmp.nodePermissions', 1, new Set(['node', 'output-kind']), paramdefs, args) :
        bldrbase.makePositionalArgs('xdmp.nodePermissions', 1, false, paramdefs, args);
    return new types.Item('xdmp', 'node-permissions', checkedArgs);

    }
/**
    * Returns the document-uri property of the parameter or its ancestor. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xdmp.nodeUri|xdmp.nodeUri}
    * @method planBuilder.xdmp#nodeUri
    * @since 2.1.1
    * @param { Node } [node] - The node whose URI is returned.
    * @returns { XsString }
    */
nodeUri(...args) {
    const paramdef = ['node', [types.Node, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('xdmp.nodeUri', 1, paramdef, args);
    return new types.XsString('xdmp', 'node-uri', checkedArgs);
    }
/**
    * NOT a 64-bit integer value. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xdmp.not64|xdmp.not64}
    * @method planBuilder.xdmp#not64
    * @since 2.1.1
    * @param { XsUnsignedLong } [x] - The input value.
    * @returns { XsUnsignedLong }
    */
not64(...args) {
    const paramdef = ['x', [types.XsUnsignedLong, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('xdmp.not64', 1, paramdef, args);
    return new types.XsUnsignedLong('xdmp', 'not64', checkedArgs);
    }
/**
    * Parses an octal string, returning an integer. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xdmp.octalToInteger|xdmp.octalToInteger}
    * @method planBuilder.xdmp#octalToInteger
    * @since 2.1.1
    * @param { XsString } [octal] - The octal string.
    * @returns { XsInteger }
    */
octalToInteger(...args) {
    const paramdef = ['octal', [types.XsString, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('xdmp.octalToInteger', 1, paramdef, args);
    return new types.XsInteger('xdmp', 'octal-to-integer', checkedArgs);
    }
/**
    * OR two 64-bit integer values. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xdmp.or64|xdmp.or64}
    * @method planBuilder.xdmp#or64
    * @since 2.1.1
    * @param { XsUnsignedLong } [x] - The first value.
    * @param { XsUnsignedLong } [y] - The second value.
    * @returns { XsUnsignedLong }
    */
or64(...args) {
    const namer = bldrbase.getNamer(args, 'x');
    const paramdefs = [['x', [types.XsUnsignedLong, PlanColumn, PlanParam], true, false], ['y', [types.XsUnsignedLong, PlanColumn, PlanParam], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'xdmp.or64', 2, new Set(['x', 'y']), paramdefs, args) :
        bldrbase.makePositionalArgs('xdmp.or64', 2, false, paramdefs, args);
    return new types.XsUnsignedLong('xdmp', 'or64', checkedArgs);

    }
/**
    * Parses a string containing date, time or dateTime using the supplied picture argument and returns a dateTime value. While this function is closely related to other XSLT functions, it is available in XSLT as well as in all XQuery dialects and in Server-Side JavaScript. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xdmp.parseDateTime|xdmp.parseDateTime}
    * @method planBuilder.xdmp#parseDateTime
    * @since 2.1.1
    * @param { XsString } [picture] - The desired string representation of the given $value. The picture string is a sequence of characters, in which the characters represent variables such as, decimal-separator-sign, grouping-sign, zero-digit-sign, digit-sign, pattern-separator, percent sign and per-mille-sign. For details on the picture string, see http://www.w3.org/TR/xslt20/#date-picture-string. This follows the specification of picture string in the W3C XSLT 2.0 specification for the fn:format-dateTime function.  Symbol Description ----------------------------------- 'Y' year(absolute value) 'M' month in year 'D' day in month 'd' day in year 'F' day of week 'W' week in year 'w' week in month 'H' hour in day 'h' hour in half-day 'P' am/pm marker 'm' minute in hour 's' second in minute 'f' fractional seconds 'Z' timezone as a time offset from UTC for example PST 'z' timezone as an offset using GMT, for example GMT+1 
    * @param { XsString } [value] - The given string $value representing the dateTime value that needs to be formatted.
    * @param { XsString } [language] - The language used in string representation of the date, time or dateTime value.
    * @param { XsString } [calendar] - This argument is reserved for future use. The only calendar supported at this point is "Gregorian" or "AD".
    * @param { XsString } [country] - $country is used to take into account if there any country specific interpretation of the string while converting it into dateTime value.
    * @returns { XsDateTime }
    */
parseDateTime(...args) {
    const namer = bldrbase.getNamer(args, 'picture');
    const paramdefs = [['picture', [types.XsString, PlanColumn, PlanParam], true, false], ['value', [types.XsString, PlanColumn, PlanParam], true, false], ['language', [types.XsString, PlanColumn, PlanParam], false, false], ['calendar', [types.XsString, PlanColumn, PlanParam], false, false], ['country', [types.XsString, PlanColumn, PlanParam], false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'xdmp.parseDateTime', 2, new Set(['picture', 'value', 'language', 'calendar', 'country']), paramdefs, args) :
        bldrbase.makePositionalArgs('xdmp.parseDateTime', 2, false, paramdefs, args);
    return new types.XsDateTime('xdmp', 'parse-dateTime', checkedArgs);

    }
/**
    * Parses a string containing date, time or dateTime using the supplied picture argument and returns a dateTime value. While this function is closely related to other XSLT functions, it is available in XSLT as well as in all XQuery dialects and in Server-Side JavaScript. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xdmp.parseYymmdd|xdmp.parseYymmdd}
    * @method planBuilder.xdmp#parseYymmdd
    * @since 2.1.1
    * @param { XsString } [picture] - The desired string representation of the given $value. This follows the specification of picture string which is compatible to the format specification in icu. See http://icu-project.org/apiref/icu4j/com/ibm/icu/text/SimpleDateFormat.html for more details. The following is the summary of the formatting symbols:  Symbol Description ---------------------------- "y" year(absolute value) "M" month in year "d" day in month "D" day in year "E" day of week "w" week in year "W" week in month "H" hour in day "K" hour in half-day "a" am/pm marker "s" second in minute "S" fractional seconds "Z" timezone as a time offset from UTC for example PST "ZZZZ" timezone as an offset using GMT, for example GMT+1  
    * @param { XsString } [value] - The given string $value that needs to be formatted.
    * @param { XsString } [language] - The language used in string representation of the date, time or dateTime value.
    * @param { XsString } [calendar] - This argument is reserved for future use. The only calendar supported at this point is "Gregorian" or "AD".
    * @param { XsString } [country] - $country is used to take into account if there any country specific interpretation of the string while converting it into dateTime value.
    * @returns { XsDateTime }
    */
parseYymmdd(...args) {
    const namer = bldrbase.getNamer(args, 'picture');
    const paramdefs = [['picture', [types.XsString, PlanColumn, PlanParam], true, false], ['value', [types.XsString, PlanColumn, PlanParam], true, false], ['language', [types.XsString, PlanColumn, PlanParam], false, false], ['calendar', [types.XsString, PlanColumn, PlanParam], false, false], ['country', [types.XsString, PlanColumn, PlanParam], false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'xdmp.parseYymmdd', 2, new Set(['picture', 'value', 'language', 'calendar', 'country']), paramdefs, args) :
        bldrbase.makePositionalArgs('xdmp.parseYymmdd', 2, false, paramdefs, args);
    return new types.XsDateTime('xdmp', 'parse-yymmdd', checkedArgs);

    }
/**
    * Returns a string whose value corresponds to the path of the node. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xdmp.path|xdmp.path}
    * @method planBuilder.xdmp#path
    * @since 2.1.1
    * @param { Node } [node] - The node whose path is returned.
    * @param { XsBoolean } [includeDocument] - If true, then the path is presented with a leading doc(..)/.., otherwise the path is presented as /...
    * @returns { XsString }
    */
path(...args) {
    const namer = bldrbase.getNamer(args, 'node');
    const paramdefs = [['node', [types.Node, PlanColumn, PlanParam], true, false], ['include-document', [types.XsBoolean, PlanColumn, PlanParam], false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'xdmp.path', 1, new Set(['node', 'include-document']), paramdefs, args) :
        bldrbase.makePositionalArgs('xdmp.path', 1, false, paramdefs, args);
    return new types.XsString('xdmp', 'path', checkedArgs);

    }
/**
    * Returns an integer value representing the starting position of a string within the search string. Note, the string starting position is 1. If the first parameter is empty, the result is the empty sequence. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xdmp.position|xdmp.position}
    * @method planBuilder.xdmp#position
    * @since 2.1.1
    * @param { XsString } [test] - The string to test for existence in the second parameter.
    * @param { XsString } [target] - The string from which to test.
    * @param { XsString } [collation] - The optional name of a valid collation URI. For information on the collation URI syntax, see the Search Developer's Guide.
    * @returns { XsInteger }
    */
position(...args) {
    const namer = bldrbase.getNamer(args, 'test');
    const paramdefs = [['test', [types.XsString, PlanColumn, PlanParam], false, false], ['target', [types.XsString, PlanColumn, PlanParam], false, false], ['collation', [types.XsString, PlanColumn, PlanParam], false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'xdmp.position', 2, new Set(['test', 'target', 'collation']), paramdefs, args) :
        bldrbase.makePositionalArgs('xdmp.position', 2, false, paramdefs, args);
    return new types.XsInteger('xdmp', 'position', checkedArgs);

    }
/**
    * Construct a QName from a string of the form "{namespaceURI}localname". This function is useful for constructing Clark notation parameters for the xdmp:xslt-eval and xdmp:xslt-invoke functions. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xdmp.QNameFromKey|xdmp.QNameFromKey}
    * @method planBuilder.xdmp#QNameFromKey
    * @since 2.1.1
    * @param { XsString } [key] - The string from which to construct a QName.
    * @returns { XsQName }
    */
QNameFromKey(...args) {
    const paramdef = ['key', [types.XsString, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('xdmp.QNameFromKey', 1, paramdef, args);
    return new types.XsQName('xdmp', 'QName-from-key', checkedArgs);
    }
/**
    * Returns an integer between 1 and 4, both inclusive, calculating the quarter component in the localized value of arg.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/xdmp.quarterFromDate|xdmp.quarterFromDate}
    * @method planBuilder.xdmp#quarterFromDate
    * @since 2.1.1
    * @param { XsDate } [arg] - The date whose quarter component will be returned.
    * @returns { XsInteger }
    */
quarterFromDate(...args) {
    const paramdef = ['arg', [types.XsDate, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xdmp.quarterFromDate', 1, paramdef, args);
    return new types.XsInteger('xdmp', 'quarter-from-date', checkedArgs);
    }
/**
    * Returns a random unsigned integer between 0 and a number up to 64 bits long. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xdmp.random|xdmp.random}
    * @method planBuilder.xdmp#random
    * @since 2.1.1
    * @param { XsUnsignedLong } [max] - The optional maximum value (inclusive).
    * @returns { XsUnsignedLong }
    */
random(...args) {
    const paramdef = ['max', [types.XsUnsignedLong, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('xdmp.random', 0, paramdef, args);
    return new types.XsUnsignedLong('xdmp', 'random', checkedArgs);
    }
/**
    * Resolves a relative URI against an absolute URI. If base is specified, the URI is resolved relative to that base. If base is not specified, the base is set to the base-uri property from the static context, if the property exists; if it does not exist, an error is thrown. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xdmp.resolveUri|xdmp.resolveUri}
    * @method planBuilder.xdmp#resolveUri
    * @since 2.1.1
    * @param { XsString } [relative] - A URI reference to resolve against the base.
    * @param { XsString } [base] - An absolute URI to use as the base of the resolution.
    * @returns { XsAnyURI }
    */
resolveUri(...args) {
    const namer = bldrbase.getNamer(args, 'relative');
    const paramdefs = [['relative', [types.XsString, PlanColumn, PlanParam], false, false], ['base', [types.XsString, PlanColumn, PlanParam], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'xdmp.resolveUri', 2, new Set(['relative', 'base']), paramdefs, args) :
        bldrbase.makePositionalArgs('xdmp.resolveUri', 2, false, paramdefs, args);
    return new types.XsAnyURI('xdmp', 'resolve-uri', checkedArgs);

    }
/**
    * Right-shift a 64-bit integer value. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xdmp.rshift64|xdmp.rshift64}
    * @method planBuilder.xdmp#rshift64
    * @since 2.1.1
    * @param { XsUnsignedLong } [x] - The value to shift.
    * @param { XsLong } [y] - The right shift to perform. This value may be negative.
    * @returns { XsUnsignedLong }
    */
rshift64(...args) {
    const namer = bldrbase.getNamer(args, 'x');
    const paramdefs = [['x', [types.XsUnsignedLong, PlanColumn, PlanParam], true, false], ['y', [types.XsLong, PlanColumn, PlanParam], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'xdmp.rshift64', 2, new Set(['x', 'y']), paramdefs, args) :
        bldrbase.makePositionalArgs('xdmp.rshift64', 2, false, paramdefs, args);
    return new types.XsUnsignedLong('xdmp', 'rshift64', checkedArgs);

    }
/**
    * Calculates the SHA1 hash of the given argument. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xdmp.sha1|xdmp.sha1}
    * @method planBuilder.xdmp#sha1
    * @since 2.1.1
    * @param { Item } [data] - Data to be hashed. Must be xs:string or a binary node.
    * @param { XsString } [encoding] - Encoding format for the output string, must be "hex" for hexadecimal or "base64". Default is "hex".
    * @returns { XsString }
    */
sha1(...args) {
    const namer = bldrbase.getNamer(args, 'data');
    const paramdefs = [['data', [types.Item, PlanColumn, PlanParam], true, false], ['encoding', [types.XsString, PlanColumn, PlanParam], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'xdmp.sha1', 1, new Set(['data', 'encoding']), paramdefs, args) :
        bldrbase.makePositionalArgs('xdmp.sha1', 1, false, paramdefs, args);
    return new types.XsString('xdmp', 'sha1', checkedArgs);

    }
/**
    * Calculates the SHA256 hash of the given argument. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xdmp.sha256|xdmp.sha256}
    * @method planBuilder.xdmp#sha256
    * @since 2.1.1
    * @param { Item } [data] - Data to be hashed. Must be xs:string or a binary node.
    * @param { XsString } [encoding] - Encoding format for the output string, must be "hex" for hexadecimal or "base64". Default is "hex".
    * @returns { XsString }
    */
sha256(...args) {
    const namer = bldrbase.getNamer(args, 'data');
    const paramdefs = [['data', [types.Item, PlanColumn, PlanParam], true, false], ['encoding', [types.XsString, PlanColumn, PlanParam], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'xdmp.sha256', 1, new Set(['data', 'encoding']), paramdefs, args) :
        bldrbase.makePositionalArgs('xdmp.sha256', 1, false, paramdefs, args);
    return new types.XsString('xdmp', 'sha256', checkedArgs);

    }
/**
    * Calculates the SHA384 hash of the given argument. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xdmp.sha384|xdmp.sha384}
    * @method planBuilder.xdmp#sha384
    * @since 2.1.1
    * @param { Item } [data] - Data to be hashed. Must be xs:string or a binary node.
    * @param { XsString } [encoding] - Encoding format for the output string, must be "hex" for hexadecimal or "base64". Default is "hex".
    * @returns { XsString }
    */
sha384(...args) {
    const namer = bldrbase.getNamer(args, 'data');
    const paramdefs = [['data', [types.Item, PlanColumn, PlanParam], true, false], ['encoding', [types.XsString, PlanColumn, PlanParam], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'xdmp.sha384', 1, new Set(['data', 'encoding']), paramdefs, args) :
        bldrbase.makePositionalArgs('xdmp.sha384', 1, false, paramdefs, args);
    return new types.XsString('xdmp', 'sha384', checkedArgs);

    }
/**
    * Calculates the SHA512 hash of the given argument. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xdmp.sha512|xdmp.sha512}
    * @method planBuilder.xdmp#sha512
    * @since 2.1.1
    * @param { Item } [data] - Data to be hashed. Must be xs:string or a binary node.
    * @param { XsString } [encoding] - Encoding format for the output string, must be "hex" for hexadecimal or "base64". Default is "hex".
    * @returns { XsString }
    */
sha512(...args) {
    const namer = bldrbase.getNamer(args, 'data');
    const paramdefs = [['data', [types.Item, PlanColumn, PlanParam], true, false], ['encoding', [types.XsString, PlanColumn, PlanParam], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'xdmp.sha512', 1, new Set(['data', 'encoding']), paramdefs, args) :
        bldrbase.makePositionalArgs('xdmp.sha512', 1, false, paramdefs, args);
    return new types.XsString('xdmp', 'sha512', checkedArgs);

    }
/**
    * Combines an initial hash with a subsequent hash. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xdmp.step64|xdmp.step64}
    * @method planBuilder.xdmp#step64
    * @since 2.1.1
    * @param { XsUnsignedLong } [initial] - An initial hash.
    * @param { XsUnsignedLong } [step] - A step hash to be combined with the initial hash.
    * @returns { XsUnsignedLong }
    */
step64(...args) {
    const namer = bldrbase.getNamer(args, 'initial');
    const paramdefs = [['initial', [types.XsUnsignedLong, PlanColumn, PlanParam], true, false], ['step', [types.XsUnsignedLong, PlanColumn, PlanParam], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'xdmp.step64', 2, new Set(['initial', 'step']), paramdefs, args) :
        bldrbase.makePositionalArgs('xdmp.step64', 2, false, paramdefs, args);
    return new types.XsUnsignedLong('xdmp', 'step64', checkedArgs);

    }
/**
    * Formats a dateTime value using POSIX strftime. This function uses the POSIX strftime system call in the way it is implemented on each platform. For other XQuery functions that have more functionality (for example, for things like timezones), use one or more if the various XQuery or XSLT standard functions such as fn:format-dateTime . Provides a client interface to a server function. See {@link http://docs.marklogic.com/xdmp.strftime|xdmp.strftime}
    * @method planBuilder.xdmp#strftime
    * @since 2.1.1
    * @param { XsString } [format] - The strftime format string.
    * @param { XsDateTime } [value] - The dateTime value.
    * @returns { XsString }
    */
strftime(...args) {
    const namer = bldrbase.getNamer(args, 'format');
    const paramdefs = [['format', [types.XsString, PlanColumn, PlanParam], true, false], ['value', [types.XsDateTime, PlanColumn, PlanParam], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'xdmp.strftime', 2, new Set(['format', 'value']), paramdefs, args) :
        bldrbase.makePositionalArgs('xdmp.strftime', 2, false, paramdefs, args);
    return new types.XsString('xdmp', 'strftime', checkedArgs);

    }
/**
    * Converts a 64 bit timestamp value to an xs:dateTime. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xdmp.timestampToWallclock|xdmp.timestampToWallclock}
    * @method planBuilder.xdmp#timestampToWallclock
    * @since 2.1.1
    * @param { XsUnsignedLong } [timestamp] - The timestamp.
    * @returns { XsDateTime }
    */
timestampToWallclock(...args) {
    const paramdef = ['timestamp', [types.XsUnsignedLong, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('xdmp.timestampToWallclock', 1, paramdef, args);
    return new types.XsDateTime('xdmp', 'timestamp-to-wallclock', checkedArgs);
    }
/**
    * Constructs a JSON document. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xdmp.toJson|xdmp.toJson}
    * @method planBuilder.xdmp#toJson
    * @since 2.1.1
    * @param { Item } [item] - A sequence of items from which the JSON document is to be constructed. The item sequence from which the JSON document is constructed.
    * @returns { Node }
    */
toJson(...args) {
    const paramdef = ['item', [types.Item, PlanColumn, PlanParam], false, true];
    const checkedArgs = bldrbase.makeSingleArgs('xdmp.toJson', 1, paramdef, args);
    return new types.Node('xdmp', 'to-json', checkedArgs);
    }
/**
    * Returns the name of the simple type of the atomic value argument as an xs:QName.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/xdmp.type|xdmp.type}
    * @method planBuilder.xdmp#type
    * @since 2.1.1
    * @param { XsAnyAtomicType } [value] - The value to return the type of.
    * @returns { XsQName }
    */
type(...args) {
    const paramdef = ['value', [types.XsAnyAtomicType, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('xdmp.type', 1, paramdef, args);
    return new types.XsQName('xdmp', 'type', checkedArgs);
    }
/**
    * Returns the content type of the given URI as matched in the mimetypes configuration. xdmp:content-type continues to work too. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xdmp.uriContentType|xdmp.uriContentType}
    * @method planBuilder.xdmp#uriContentType
    * @since 2.1.1
    * @param { XsString } [uri] - The document URI.
    * @returns { XsString }
    */
uriContentType(...args) {
    const paramdef = ['uri', [types.XsString, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('xdmp.uriContentType', 1, paramdef, args);
    return new types.XsString('xdmp', 'uri-content-type', checkedArgs);
    }
/**
    * Returns the format of the given URI as matched in the mimetypes configuration. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xdmp.uriFormat|xdmp.uriFormat}
    * @method planBuilder.xdmp#uriFormat
    * @since 2.1.1
    * @param { XsString } [uri] - The document URI.
    * @returns { XsString }
    */
uriFormat(...args) {
    const paramdef = ['uri', [types.XsString, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('xdmp.uriFormat', 1, paramdef, args);
    return new types.XsString('xdmp', 'uri-format', checkedArgs);
    }
/**
    * Converts URL-encoded string to plaintext. This decodes the string created with xdmp:url-encode. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xdmp.urlDecode|xdmp.urlDecode}
    * @method planBuilder.xdmp#urlDecode
    * @since 2.1.1
    * @param { XsString } [encoded] - Encoded text to be decoded.
    * @returns { XsString }
    */
urlDecode(...args) {
    const paramdef = ['encoded', [types.XsString, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('xdmp.urlDecode', 1, paramdef, args);
    return new types.XsString('xdmp', 'url-decode', checkedArgs);
    }
/**
    * Converts plaintext into URL-encoded string. To decode the string, use xdmp:url-decode.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/xdmp.urlEncode|xdmp.urlEncode}
    * @method planBuilder.xdmp#urlEncode
    * @since 2.1.1
    * @param { XsString } [plaintext] - Plaintext to be encoded.
    * @param { XsBoolean } [noSpacePlus] - True to encode space as "%20" instead of "+".
    * @returns { XsString }
    */
urlEncode(...args) {
    const namer = bldrbase.getNamer(args, 'plaintext');
    const paramdefs = [['plaintext', [types.XsString, PlanColumn, PlanParam], true, false], ['noSpacePlus', [types.XsBoolean, PlanColumn, PlanParam], false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'xdmp.urlEncode', 1, new Set(['plaintext', 'noSpacePlus']), paramdefs, args) :
        bldrbase.makePositionalArgs('xdmp.urlEncode', 1, false, paramdefs, args);
    return new types.XsString('xdmp', 'url-encode', checkedArgs);

    }
/**
    * Converts an xs:dateTime to a 64 bit timestamp value. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xdmp.wallclockToTimestamp|xdmp.wallclockToTimestamp}
    * @method planBuilder.xdmp#wallclockToTimestamp
    * @since 2.1.1
    * @param { XsDateTime } [timestamp] - The xs:datetime value.
    * @returns { XsUnsignedLong }
    */
wallclockToTimestamp(...args) {
    const paramdef = ['timestamp', [types.XsDateTime, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('xdmp.wallclockToTimestamp', 1, paramdef, args);
    return new types.XsUnsignedLong('xdmp', 'wallclock-to-timestamp', checkedArgs);
    }
/**
    * Returns an integer between 1 and 53, both inclusive, representing the week value in the localized value of arg.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/xdmp.weekFromDate|xdmp.weekFromDate}
    * @method planBuilder.xdmp#weekFromDate
    * @since 2.1.1
    * @param { XsDate } [arg] - The date whose weeks of the year will be returned.
    * @returns { XsInteger }
    */
weekFromDate(...args) {
    const paramdef = ['arg', [types.XsDate, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xdmp.weekFromDate', 1, paramdef, args);
    return new types.XsInteger('xdmp', 'week-from-date', checkedArgs);
    }
/**
    * Returns an integer in the range 1 to 7, inclusive, representing the weekday value in the localized value of arg. Monday is the first weekday value (value of 1), and Sunday is the last (value of 7).  Provides a client interface to a server function. See {@link http://docs.marklogic.com/xdmp.weekdayFromDate|xdmp.weekdayFromDate}
    * @method planBuilder.xdmp#weekdayFromDate
    * @since 2.1.1
    * @param { XsDate } [arg] - The date whose weekday value will be returned.
    * @returns { XsInteger }
    */
weekdayFromDate(...args) {
    const paramdef = ['arg', [types.XsDate, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xdmp.weekdayFromDate', 1, paramdef, args);
    return new types.XsInteger('xdmp', 'weekday-from-date', checkedArgs);
    }
/**
    * XOR two 64-bit integer values. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xdmp.xor64|xdmp.xor64}
    * @method planBuilder.xdmp#xor64
    * @since 2.1.1
    * @param { XsUnsignedLong } [x] - The first value.
    * @param { XsUnsignedLong } [y] - The second value.
    * @returns { XsUnsignedLong }
    */
xor64(...args) {
    const namer = bldrbase.getNamer(args, 'x');
    const paramdefs = [['x', [types.XsUnsignedLong, PlanColumn, PlanParam], true, false], ['y', [types.XsUnsignedLong, PlanColumn, PlanParam], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'xdmp.xor64', 2, new Set(['x', 'y']), paramdefs, args) :
        bldrbase.makePositionalArgs('xdmp.xor64', 2, false, paramdefs, args);
    return new types.XsUnsignedLong('xdmp', 'xor64', checkedArgs);

    }
/**
    * Returns an integer between 1 and 366, both inclusive, representing the yearday value in the localized value of arg.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/xdmp.yeardayFromDate|xdmp.yeardayFromDate}
    * @method planBuilder.xdmp#yeardayFromDate
    * @since 2.1.1
    * @param { XsDate } [arg] - The date whose days of the year will be returned.
    * @returns { XsInteger }
    */
yeardayFromDate(...args) {
    const paramdef = ['arg', [types.XsDate, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xdmp.yeardayFromDate', 1, paramdef, args);
    return new types.XsInteger('xdmp', 'yearday-from-date', checkedArgs);
    }
}
class XsExpr {
  constructor() {
  }
  /**
    * Constructs or casts an expression to a XsAnyURI object. Provides a client interface to a server function.
    * @method planBuilder.xs#anyURI
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg1] - the expression to construct or cast
    * @returns { XsAnyURI }
    */
anyURI(...args) {
    const paramdef = ['arg1', [types.XsAnyAtomicType, types.Node, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.anyURI', 1, paramdef, args);
    return new types.XsAnyURI('xs', 'anyURI', checkedArgs);
    }
/**
    * Constructs or casts an expression to a XsBase64Binary object. Provides a client interface to a server function.
    * @method planBuilder.xs#base64Binary
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg1] - the expression to construct or cast
    * @returns { XsBase64Binary }
    */
base64Binary(...args) {
    const paramdef = ['arg1', [types.XsAnyAtomicType, types.Node, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.base64Binary', 1, paramdef, args);
    return new types.XsBase64Binary('xs', 'base64Binary', checkedArgs);
    }
/**
    * Constructs or casts an expression to a XsBoolean object. Provides a client interface to a server function.
    * @method planBuilder.xs#boolean
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg1] - the expression to construct or cast
    * @returns { XsBoolean }
    */
boolean(...args) {
    const paramdef = ['arg1', [types.XsAnyAtomicType, types.Node, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.boolean', 1, paramdef, args);
    return new types.XsBoolean('xs', 'boolean', checkedArgs);
    }
/**
    * Constructs or casts an expression to a XsByte object. Provides a client interface to a server function.
    * @method planBuilder.xs#byte
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg1] - the expression to construct or cast
    * @returns { XsByte }
    */
byte(...args) {
    const paramdef = ['arg1', [types.XsAnyAtomicType, types.Node, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.byte', 1, paramdef, args);
    return new types.XsByte('xs', 'byte', checkedArgs);
    }
/**
    * Constructs or casts an expression to a XsDate object. Provides a client interface to a server function.
    * @method planBuilder.xs#date
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg1] - the expression to construct or cast
    * @returns { XsDate }
    */
date(...args) {
    const paramdef = ['arg1', [types.XsAnyAtomicType, types.Node, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.date', 1, paramdef, args);
    return new types.XsDate('xs', 'date', checkedArgs);
    }
/**
    * Constructs or casts an expression to a XsDateTime object. Provides a client interface to a server function.
    * @method planBuilder.xs#dateTime
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg1] - the expression to construct or cast
    * @returns { XsDateTime }
    */
dateTime(...args) {
    const paramdef = ['arg1', [types.XsAnyAtomicType, types.Node, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.dateTime', 1, paramdef, args);
    return new types.XsDateTime('xs', 'dateTime', checkedArgs);
    }
/**
    * Constructs or casts an expression to a XsDayTimeDuration object. Provides a client interface to a server function.
    * @method planBuilder.xs#dayTimeDuration
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg1] - the expression to construct or cast
    * @returns { XsDayTimeDuration }
    */
dayTimeDuration(...args) {
    const paramdef = ['arg1', [types.XsAnyAtomicType, types.Node, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.dayTimeDuration', 1, paramdef, args);
    return new types.XsDayTimeDuration('xs', 'dayTimeDuration', checkedArgs);
    }
/**
    * Constructs or casts an expression to a XsDecimal object. Provides a client interface to a server function.
    * @method planBuilder.xs#decimal
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg1] - the expression to construct or cast
    * @returns { XsDecimal }
    */
decimal(...args) {
    const paramdef = ['arg1', [types.XsAnyAtomicType, types.Node, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.decimal', 1, paramdef, args);
    return new types.XsDecimal('xs', 'decimal', checkedArgs);
    }
/**
    * Constructs or casts an expression to a XsDouble object. Provides a client interface to a server function.
    * @method planBuilder.xs#double
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg1] - the expression to construct or cast
    * @returns { XsDouble }
    */
double(...args) {
    const paramdef = ['arg1', [types.XsAnyAtomicType, types.Node, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.double', 1, paramdef, args);
    return new types.XsDouble('xs', 'double', checkedArgs);
    }
/**
    * Constructs or casts an expression to a XsFloat object. Provides a client interface to a server function.
    * @method planBuilder.xs#float
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg1] - the expression to construct or cast
    * @returns { XsFloat }
    */
float(...args) {
    const paramdef = ['arg1', [types.XsAnyAtomicType, types.Node, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.float', 1, paramdef, args);
    return new types.XsFloat('xs', 'float', checkedArgs);
    }
/**
    * Constructs or casts an expression to a XsGDay object. Provides a client interface to a server function.
    * @method planBuilder.xs#gDay
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg1] - the expression to construct or cast
    * @returns { XsGDay }
    */
gDay(...args) {
    const paramdef = ['arg1', [types.XsAnyAtomicType, types.Node, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.gDay', 1, paramdef, args);
    return new types.XsGDay('xs', 'gDay', checkedArgs);
    }
/**
    * Constructs or casts an expression to a XsGMonth object. Provides a client interface to a server function.
    * @method planBuilder.xs#gMonth
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg1] - the expression to construct or cast
    * @returns { XsGMonth }
    */
gMonth(...args) {
    const paramdef = ['arg1', [types.XsAnyAtomicType, types.Node, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.gMonth', 1, paramdef, args);
    return new types.XsGMonth('xs', 'gMonth', checkedArgs);
    }
/**
    * Constructs or casts an expression to a XsGMonthDay object. Provides a client interface to a server function.
    * @method planBuilder.xs#gMonthDay
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg1] - the expression to construct or cast
    * @returns { XsGMonthDay }
    */
gMonthDay(...args) {
    const paramdef = ['arg1', [types.XsAnyAtomicType, types.Node, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.gMonthDay', 1, paramdef, args);
    return new types.XsGMonthDay('xs', 'gMonthDay', checkedArgs);
    }
/**
    * Constructs or casts an expression to a XsGYear object. Provides a client interface to a server function.
    * @method planBuilder.xs#gYear
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg1] - the expression to construct or cast
    * @returns { XsGYear }
    */
gYear(...args) {
    const paramdef = ['arg1', [types.XsAnyAtomicType, types.Node, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.gYear', 1, paramdef, args);
    return new types.XsGYear('xs', 'gYear', checkedArgs);
    }
/**
    * Constructs or casts an expression to a XsGYearMonth object. Provides a client interface to a server function.
    * @method planBuilder.xs#gYearMonth
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg1] - the expression to construct or cast
    * @returns { XsGYearMonth }
    */
gYearMonth(...args) {
    const paramdef = ['arg1', [types.XsAnyAtomicType, types.Node, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.gYearMonth', 1, paramdef, args);
    return new types.XsGYearMonth('xs', 'gYearMonth', checkedArgs);
    }
/**
    * Constructs or casts an expression to a XsHexBinary object. Provides a client interface to a server function.
    * @method planBuilder.xs#hexBinary
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg1] - the expression to construct or cast
    * @returns { XsHexBinary }
    */
hexBinary(...args) {
    const paramdef = ['arg1', [types.XsAnyAtomicType, types.Node, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.hexBinary', 1, paramdef, args);
    return new types.XsHexBinary('xs', 'hexBinary', checkedArgs);
    }
/**
    * Constructs or casts an expression to a XsInt object. Provides a client interface to a server function.
    * @method planBuilder.xs#int
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg1] - the expression to construct or cast
    * @returns { XsInt }
    */
int(...args) {
    const paramdef = ['arg1', [types.XsAnyAtomicType, types.Node, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.int', 1, paramdef, args);
    return new types.XsInt('xs', 'int', checkedArgs);
    }
/**
    * Constructs or casts an expression to a XsInteger object. Provides a client interface to a server function.
    * @method planBuilder.xs#integer
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg1] - the expression to construct or cast
    * @returns { XsInteger }
    */
integer(...args) {
    const paramdef = ['arg1', [types.XsAnyAtomicType, types.Node, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.integer', 1, paramdef, args);
    return new types.XsInteger('xs', 'integer', checkedArgs);
    }
/**
    * Constructs or casts an expression to a XsLanguage object. Provides a client interface to a server function.
    * @method planBuilder.xs#language
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg1] - the expression to construct or cast
    * @returns { XsLanguage }
    */
language(...args) {
    const paramdef = ['arg1', [types.XsAnyAtomicType, types.Node, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.language', 1, paramdef, args);
    return new types.XsLanguage('xs', 'language', checkedArgs);
    }
/**
    * Constructs or casts an expression to a XsLong object. Provides a client interface to a server function.
    * @method planBuilder.xs#long
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg1] - the expression to construct or cast
    * @returns { XsLong }
    */
long(...args) {
    const paramdef = ['arg1', [types.XsAnyAtomicType, types.Node, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.long', 1, paramdef, args);
    return new types.XsLong('xs', 'long', checkedArgs);
    }
/**
    * Constructs or casts an expression to a XsName object. Provides a client interface to a server function.
    * @method planBuilder.xs#Name
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg1] - the expression to construct or cast
    * @returns { XsName }
    */
Name(...args) {
    const paramdef = ['arg1', [types.XsAnyAtomicType, types.Node, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.Name', 1, paramdef, args);
    return new types.XsName('xs', 'Name', checkedArgs);
    }
/**
    * Constructs or casts an expression to a XsNCName object. Provides a client interface to a server function.
    * @method planBuilder.xs#NCName
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg1] - the expression to construct or cast
    * @returns { XsNCName }
    */
NCName(...args) {
    const paramdef = ['arg1', [types.XsAnyAtomicType, types.Node, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.NCName', 1, paramdef, args);
    return new types.XsNCName('xs', 'NCName', checkedArgs);
    }
/**
    * Constructs or casts an expression to a XsNegativeInteger object. Provides a client interface to a server function.
    * @method planBuilder.xs#negativeInteger
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg1] - the expression to construct or cast
    * @returns { XsNegativeInteger }
    */
negativeInteger(...args) {
    const paramdef = ['arg1', [types.XsAnyAtomicType, types.Node, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.negativeInteger', 1, paramdef, args);
    return new types.XsNegativeInteger('xs', 'negativeInteger', checkedArgs);
    }
/**
    * Constructs or casts an expression to a XsNMTOKEN object. Provides a client interface to a server function.
    * @method planBuilder.xs#NMTOKEN
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg1] - the expression to construct or cast
    * @returns { XsNMTOKEN }
    */
NMTOKEN(...args) {
    const paramdef = ['arg1', [types.XsAnyAtomicType, types.Node, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.NMTOKEN', 1, paramdef, args);
    return new types.XsNMTOKEN('xs', 'NMTOKEN', checkedArgs);
    }
/**
    * Constructs or casts an expression to a XsNonNegativeInteger object. Provides a client interface to a server function.
    * @method planBuilder.xs#nonNegativeInteger
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg1] - the expression to construct or cast
    * @returns { XsNonNegativeInteger }
    */
nonNegativeInteger(...args) {
    const paramdef = ['arg1', [types.XsAnyAtomicType, types.Node, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.nonNegativeInteger', 1, paramdef, args);
    return new types.XsNonNegativeInteger('xs', 'nonNegativeInteger', checkedArgs);
    }
/**
    * Constructs or casts an expression to a XsNonPositiveInteger object. Provides a client interface to a server function.
    * @method planBuilder.xs#nonPositiveInteger
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg1] - the expression to construct or cast
    * @returns { XsNonPositiveInteger }
    */
nonPositiveInteger(...args) {
    const paramdef = ['arg1', [types.XsAnyAtomicType, types.Node, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.nonPositiveInteger', 1, paramdef, args);
    return new types.XsNonPositiveInteger('xs', 'nonPositiveInteger', checkedArgs);
    }
/**
    * Constructs or casts an expression to a XsNormalizedString object. Provides a client interface to a server function.
    * @method planBuilder.xs#normalizedString
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg1] - the expression to construct or cast
    * @returns { XsNormalizedString }
    */
normalizedString(...args) {
    const paramdef = ['arg1', [types.XsAnyAtomicType, types.Node, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.normalizedString', 1, paramdef, args);
    return new types.XsNormalizedString('xs', 'normalizedString', checkedArgs);
    }
/**
    * Constructs or casts an expression to a XsNumeric object. Provides a client interface to a server function.
    * @method planBuilder.xs#numeric
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg1] - the expression to construct or cast
    * @returns { XsNumeric }
    */
numeric(...args) {
    const paramdef = ['arg1', [types.XsAnyAtomicType, types.Node, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.numeric', 1, paramdef, args);
    return new types.XsNumeric('xs', 'numeric', checkedArgs);
    }
/**
    * Constructs or casts an expression to a XsPositiveInteger object. Provides a client interface to a server function.
    * @method planBuilder.xs#positiveInteger
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg1] - the expression to construct or cast
    * @returns { XsPositiveInteger }
    */
positiveInteger(...args) {
    const paramdef = ['arg1', [types.XsAnyAtomicType, types.Node, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.positiveInteger', 1, paramdef, args);
    return new types.XsPositiveInteger('xs', 'positiveInteger', checkedArgs);
    }
/**
    * Constructs or casts an expression to a XsQName object. Provides a client interface to a server function.
    * @method planBuilder.xs#QName
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg1] - the expression to construct or cast
    * @returns { XsQName }
    */
QName(...args) {
    const paramdef = ['arg1', [types.XsAnyAtomicType, types.Node, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.QName', 1, paramdef, args);
    return new types.XsQName('xs', 'QName', checkedArgs);
    }
/**
    * Constructs or casts an expression to a XsShort object. Provides a client interface to a server function.
    * @method planBuilder.xs#short
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg1] - the expression to construct or cast
    * @returns { XsShort }
    */
short(...args) {
    const paramdef = ['arg1', [types.XsAnyAtomicType, types.Node, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.short', 1, paramdef, args);
    return new types.XsShort('xs', 'short', checkedArgs);
    }
/**
    * Constructs or casts an expression to a XsString object. Provides a client interface to a server function.
    * @method planBuilder.xs#string
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg1] - the expression to construct or cast
    * @returns { XsString }
    */
string(...args) {
    const paramdef = ['arg1', [types.XsAnyAtomicType, types.Node, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.string', 1, paramdef, args);
    return new types.XsString('xs', 'string', checkedArgs);
    }
/**
    * Constructs or casts an expression to a XsTime object. Provides a client interface to a server function.
    * @method planBuilder.xs#time
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg1] - the expression to construct or cast
    * @returns { XsTime }
    */
time(...args) {
    const paramdef = ['arg1', [types.XsAnyAtomicType, types.Node, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.time', 1, paramdef, args);
    return new types.XsTime('xs', 'time', checkedArgs);
    }
/**
    * Constructs or casts an expression to a XsToken object. Provides a client interface to a server function.
    * @method planBuilder.xs#token
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg1] - the expression to construct or cast
    * @returns { XsToken }
    */
token(...args) {
    const paramdef = ['arg1', [types.XsAnyAtomicType, types.Node, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.token', 1, paramdef, args);
    return new types.XsToken('xs', 'token', checkedArgs);
    }
/**
    * Constructs or casts an expression to a XsUnsignedByte object. Provides a client interface to a server function.
    * @method planBuilder.xs#unsignedByte
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg1] - the expression to construct or cast
    * @returns { XsUnsignedByte }
    */
unsignedByte(...args) {
    const paramdef = ['arg1', [types.XsAnyAtomicType, types.Node, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.unsignedByte', 1, paramdef, args);
    return new types.XsUnsignedByte('xs', 'unsignedByte', checkedArgs);
    }
/**
    * Constructs or casts an expression to a XsUnsignedInt object. Provides a client interface to a server function.
    * @method planBuilder.xs#unsignedInt
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg1] - the expression to construct or cast
    * @returns { XsUnsignedInt }
    */
unsignedInt(...args) {
    const paramdef = ['arg1', [types.XsAnyAtomicType, types.Node, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.unsignedInt', 1, paramdef, args);
    return new types.XsUnsignedInt('xs', 'unsignedInt', checkedArgs);
    }
/**
    * Constructs or casts an expression to a XsUnsignedLong object. Provides a client interface to a server function.
    * @method planBuilder.xs#unsignedLong
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg1] - the expression to construct or cast
    * @returns { XsUnsignedLong }
    */
unsignedLong(...args) {
    const paramdef = ['arg1', [types.XsAnyAtomicType, types.Node, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.unsignedLong', 1, paramdef, args);
    return new types.XsUnsignedLong('xs', 'unsignedLong', checkedArgs);
    }
/**
    * Constructs or casts an expression to a XsUnsignedShort object. Provides a client interface to a server function.
    * @method planBuilder.xs#unsignedShort
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg1] - the expression to construct or cast
    * @returns { XsUnsignedShort }
    */
unsignedShort(...args) {
    const paramdef = ['arg1', [types.XsAnyAtomicType, types.Node, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.unsignedShort', 1, paramdef, args);
    return new types.XsUnsignedShort('xs', 'unsignedShort', checkedArgs);
    }
/**
    * Constructs or casts an expression to a XsUntypedAtomic object. Provides a client interface to a server function.
    * @method planBuilder.xs#untypedAtomic
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg1] - the expression to construct or cast
    * @returns { XsUntypedAtomic }
    */
untypedAtomic(...args) {
    const paramdef = ['arg1', [types.XsAnyAtomicType, types.Node, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.untypedAtomic', 1, paramdef, args);
    return new types.XsUntypedAtomic('xs', 'untypedAtomic', checkedArgs);
    }
/**
    * Constructs or casts an expression to a XsYearMonthDuration object. Provides a client interface to a server function.
    * @method planBuilder.xs#yearMonthDuration
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg1] - the expression to construct or cast
    * @returns { XsYearMonthDuration }
    */
yearMonthDuration(...args) {
    const paramdef = ['arg1', [types.XsAnyAtomicType, types.Node, PlanColumn, PlanParam], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.yearMonthDuration', 1, paramdef, args);
    return new types.XsYearMonthDuration('xs', 'yearMonthDuration', checkedArgs);
    }
}class PlanTripleOption extends types.ServerType {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class PlanValueOption extends types.ServerType {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class PlanExprCol extends types.ServerType {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class PlanJoinKey extends types.ServerType {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class PlanTriplePattern extends types.ServerType {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class PlanGroup extends types.ServerType {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class PlanParamBinding extends types.ServerType {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class PlanCase extends types.ServerType {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class PlanFunction extends types.ServerType {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class PlanJsonProperty extends types.ServerType {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class PlanCtsReferenceMap extends types.ServerType {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class PlanSearchOption extends types.ServerType {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class PlanParam extends types.ServerType {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class PlanSortKey extends types.ServerType {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class PlanAggregateCol extends types.ServerType {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class PlanXsValueMap extends types.ServerType {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class PlanSparqlOption extends types.ServerType {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class PlanCondition extends types.ServerType {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class PlanSampleByOption extends types.ServerType {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class PlanNamedGroup extends types.ServerType {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
/**
  * Plan objects have methods.
  * @namespace planBuilder.Plan
  * @since 2.1.1
  */
class PlanPlan extends types.ServerType {

  constructor(prior, ns, fn, args) {
    super(ns, fn, args);
    this._operators = (prior === null) ? [this] : prior._operators.concat(this);
  }
  export() {
    return bldrbase.doExport(this);
  }
/**
    *  Provides a client interface to a server function.
    * @method planBuilder.Plan#bindParam
    * @since 2.1.1
    * @param { PlanParamName } [param] - 
    * @param { PlanParamBinding } [literal] - 
    * @returns { planBuilder.Plan }
    */
bindParam(...args) {
    const namer = bldrbase.getNamer(args, 'param');
    const paramdefs = [['param', [PlanParam, types.XsString], true, false], ['literal', [PlanParamBinding], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanPlan.bindParam', 2, new Set(['param', 'literal']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanPlan.bindParam', 2, false, paramdefs, args);
    return new PlanPlan(this, 'op', 'bind-param', checkedArgs);

    }
}
/**
  * Prefixer objects have methods.
  * @namespace planBuilder.Prefixer
  * @since 2.1.1
  */
class PlanPrefixer extends types.ServerType {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }
/**
    *  Provides a client interface to a server function.
    * @method planBuilder.Prefixer#iri
    * @since 2.1.1
    * @param { XsString } [name] - 
    * @returns { SemIri }
    */
iri(...args) {
    const paramdef = ['name', [types.XsString], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('PlanPrefixer.iri', 1, paramdef, args);
    return new types.SemIri('op', 'iri', checkedArgs);
    }
}
class PlanColumn extends types.ServerType {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class PlanGroupConcatOption extends types.ServerType {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class PlanExportablePlan extends PlanPlan {

  constructor(prior, ns, fn, args) {
    super(prior, ns, fn, args);
  }

}
class PlanSystemColumn extends PlanColumn {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
/**
  * PreparePlan objects have methods.
  * @namespace planBuilder.PreparePlan
  * @since 2.1.1
  */
class PlanPreparePlan extends PlanExportablePlan {

  constructor(prior, ns, fn, args) {
    super(prior, ns, fn, args);
  }
/**
    * This method applies the specified function to each row returned by the plan to produce a different result row. Provides a client interface to a server function. See {@link http://docs.marklogic.com/PreparePlan.prototype.map|PreparePlan.prototype.map}
    * @method planBuilder.PreparePlan#map
    * @since 2.1.1
    * @param { PlanFunction } [func] - The function to be applied.
    * @returns { planBuilder.PlanExportablePlan }
    */
map(...args) {
    const paramdef = ['func', [PlanFunction], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('PlanPreparePlan.map', 1, paramdef, args);
    return new PlanExportablePlan(this, 'op', 'map', checkedArgs);
    }
/**
    * This method applies a function or the builtin reducer to each row returned by the plan to produce a single result as with the reduce() method of JavaScript Array.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/PreparePlan.prototype.reduce|PreparePlan.prototype.reduce}
    * @method planBuilder.PreparePlan#reduce
    * @since 2.1.1
    * @param { PlanFunction } [func] - The function to be applied.
    * @param { XsAnyAtomicType } [seed] - The value returned by the previous request.
    * @returns { planBuilder.PlanExportablePlan }
    */
reduce(...args) {
    const namer = bldrbase.getNamer(args, 'func');
    const paramdefs = [['func', [PlanFunction], true, false], ['seed', [types.XsAnyAtomicType], false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanPreparePlan.reduce', 1, new Set(['func', 'seed']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanPreparePlan.reduce', 1, false, paramdefs, args);
    return new PlanExportablePlan(this, 'op', 'reduce', checkedArgs);

    }
}
/**
  * ModifyPlan objects have methods and inherit {@link planBuilder.PreparePlan} methods.
  * @namespace planBuilder.ModifyPlan
  * @since 2.1.1
  */
class PlanModifyPlan extends PlanPreparePlan {

  constructor(prior, ns, fn, args) {
    super(prior, ns, fn, args);
  }
/**
    * This function adds new columns or modifies existing columns based on expressions while preserving existing unmodified columns in the row set. Provides a client interface to a server function. See {@link http://docs.marklogic.com/ModifyPlan.prototype.bind|ModifyPlan.prototype.bind}
    * @method planBuilder.ModifyPlan#bind
    * @since 2.1.1
    * @param { PlanExprCol } [columns] - The op:as calls that specify the column name and the expression that constructs the column values.
    * @returns { planBuilder.ModifyPlan }
    */
bind(...args) {
    const paramdef = ['columns', [PlanExprCol], true, true];
    const checkedArgs = bldrbase.makeSingleArgs('PlanModifyPlan.bind', 1, paramdef, args);
    return new PlanModifyPlan(this, 'op', 'bind', checkedArgs);
    }
/**
    * This function is deprecated in favor of the bind() function and will not be supported in MarkLogic 11. This function adds a column based on an expression without altering the existing columns in the row set. Provides a client interface to a server function. See {@link http://docs.marklogic.com/ModifyPlan.prototype.bindAs|ModifyPlan.prototype.bindAs}
    * @method planBuilder.ModifyPlan#bindAs
    * @since 2.1.1
    * @param { PlanColumnName } [column] - The name of the column to be defined.
    * @param { Item } [expression] - The expression that specifies the value the column in the row.
    * @returns { planBuilder.ModifyPlan }
    */
bindAs(...args) {
    const namer = bldrbase.getNamer(args, 'column');
    const paramdefs = [['column', [PlanColumn, types.XsString], true, false], ['expression', [types.Item, PlanColumn, PlanParam], false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanModifyPlan.bindAs', 2, new Set(['column', 'expression']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanModifyPlan.bindAs', 2, false, paramdefs, args);
    return new PlanModifyPlan(this, 'op', 'bind-as', checkedArgs);

    }
/**
    * This method restricts the left row set to rows where a row with the same columns and values doesn't exist in the right row set. Provides a client interface to a server function. See {@link http://docs.marklogic.com/ModifyPlan.prototype.except|ModifyPlan.prototype.except}
    * @method planBuilder.ModifyPlan#except
    * @since 2.1.1
    * @param { PlanModifyPlan } [right] - The row set from the right view.
    * @returns { planBuilder.ModifyPlan }
    */
except(...args) {
    const paramdef = ['right', [PlanModifyPlan], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('PlanModifyPlan.except', 1, paramdef, args);
    return new PlanModifyPlan(this, 'op', 'except', checkedArgs);
    }
/**
    * This method is a filtering join that filters based on whether the join exists or not but doesn't add any columns.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/ModifyPlan.prototype.existsJoin|ModifyPlan.prototype.existsJoin}
    * @method planBuilder.ModifyPlan#existsJoin
    * @since 2.1.1
    * @param { PlanModifyPlan } [right] - The row set from the right view.
    * @param { PlanJoinKey } [keys] - The equijoin from one or more calls to the op:on function.
    * @param { XsBoolean } [condition] - A boolean expression that filters the join output rows.
    * @returns { planBuilder.ModifyPlan }
    */
existsJoin(...args) {
    const namer = bldrbase.getNamer(args, 'right');
    const paramdefs = [['right', [PlanModifyPlan], true, false], ['keys', [PlanJoinKey], false, true], ['condition', [types.XsBoolean, PlanColumn, PlanParam], false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanModifyPlan.existsJoin', 1, new Set(['right', 'keys', 'condition']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanModifyPlan.existsJoin', 1, false, paramdefs, args);
    return new PlanModifyPlan(this, 'op', 'exists-join', checkedArgs);

    }
/**
    * This method counts values for multiple grouping key columns.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/ModifyPlan.prototype.facetBy|ModifyPlan.prototype.facetBy}
    * @method planBuilder.ModifyPlan#facetBy
    * @since 2.1.1
    * @param { PlanNamedGroupingKey } [keys] - This parameter specifies the list of column keys for performing counts. For each column, the operation determines the unique values of that column and produces a separate count for the rows with that value.  A column can be named with a string or a column parameter function such as op:col or constructed from an expression with the op:as function. The facet can be named by providing a op:named-group that takes exactly one column. 
    * @param { PlanExprColName } [countCol] - Specifies what to count over the rows for each unique value of each key column.  By default, the operation counts the rows. To count the values of a column instead, specify the column to count with this parameter. To count documents, specify a fragment id column with op:fragment-id-col. 
    * @returns { planBuilder.ModifyPlan }
    */
facetBy(...args) {
    const namer = bldrbase.getNamer(args, 'keys');
    const paramdefs = [['keys', [PlanNamedGroup, PlanGroup, PlanExprCol, PlanColumn, types.XsString], true, true], ['count-col', [PlanExprCol, PlanColumn, types.XsString], false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanModifyPlan.facetBy', 1, new Set(['keys', 'count-col']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanModifyPlan.facetBy', 1, false, paramdefs, args);
    return new PlanModifyPlan(this, 'op', 'facet-by', checkedArgs);

    }
/**
    * This method collapses a group of rows into a single row.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/ModifyPlan.prototype.groupBy|ModifyPlan.prototype.groupBy}
    * @method planBuilder.ModifyPlan#groupBy
    * @since 2.1.1
    * @param { PlanExprColName } [keys] - This parameter specifies the columns used to determine the groups. Rows with the same values in these columns are consolidated into a single group. The columns can be existing columns or new columns created by an expression specified with op:as. The rows produced by the group by operation include the key columns. Specify an empty sequence to create a single group for all of the rows in the row set.
    * @param { PlanAggregateColName } [aggregates] - This parameter specifies either new columns for aggregate functions over the rows in the group or columndefs that are constant for the group. The aggregate library functions are listed below.
    * @returns { planBuilder.ModifyPlan }
    */
groupBy(...args) {
    const namer = bldrbase.getNamer(args, 'keys');
    const paramdefs = [['keys', [PlanExprCol, PlanColumn, types.XsString], false, true], ['aggregates', [PlanAggregateCol, PlanColumn, PlanExprCol, types.XsString], false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanModifyPlan.groupBy', 1, new Set(['keys', 'aggregates']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanModifyPlan.groupBy', 1, false, paramdefs, args);
    return new PlanModifyPlan(this, 'op', 'group-by', checkedArgs);

    }
/**
    * This method performs the union of multiple group-by operations on a row set.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/ModifyPlan.prototype.groupByUnion|ModifyPlan.prototype.groupByUnion}
    * @method planBuilder.ModifyPlan#groupByUnion
    * @since 2.1.1
    * @param { PlanGroupingKey } [keys] - The sets of grouping keys. The keys for each group are specified with the op:group, op:rollup, or op:cube functions. Each group must have a unique set of keys but multiple groups can have the same key.  As a convenience, a group with a single key can specify the name of the key column with a string or a column parameter function such as op:col or constructed from an expression with op:as.  The rows produced by the group-by-union operation include the key columns from each group. A group can be empty to group over all of the rows in the row set. 
    * @param { PlanAggregateColName } [aggregates] - This parameter specifies either columns to sample or aggregate functions to apply to a column for all of the rows in the group. Sampled columns can be existing columns or new columns created by an expression specified with op:as. Often a sampled column might have a constant value within the group such as a title or label closely associated with a numeric identifier used as the grouping key.
    * @returns { planBuilder.ModifyPlan }
    */
groupByUnion(...args) {
    const namer = bldrbase.getNamer(args, 'keys');
    const paramdefs = [['keys', [PlanGroup, PlanExprCol, PlanColumn, types.XsString], true, true], ['aggregates', [PlanAggregateCol, PlanColumn, PlanExprCol, types.XsString], false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanModifyPlan.groupByUnion', 1, new Set(['keys', 'aggregates']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanModifyPlan.groupByUnion', 1, false, paramdefs, args);
    return new PlanModifyPlan(this, 'op', 'group-by-union', checkedArgs);

    }
/**
    * This method performs multiple group-by operations on a row set and produces a single row with a column for each group having an array value whose items are the rows for the group. Each item is an object with properties for the group keys and aggregates.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/ModifyPlan.prototype.groupToArrays|ModifyPlan.prototype.groupToArrays}
    * @method planBuilder.ModifyPlan#groupToArrays
    * @since 2.1.1
    * @param { PlanNamedGroupingKey } [keys] - The sets of grouping keys. Each group is specified with the op:named-group function. Each group must have a unique set of keys but multiple groups can have the same key.  As a convenience, the parameter also accepts unnamed groups with the op:group, op:rollup, or op:cube functions or (for a group with a single key) a column named with a string or a column parameter function such as op:col or constructed from an expression with the op:as function.  The row objects produced by the group-to-arrays operation include the key columns from each group. A group can be empty to group over all of the rows in the row set. 
    * @param { PlanAggregateColName } [aggregates] - This parameter specifies either columns to sample or aggregate functions to apply to a column for all of the rows in the group. Sampled columns can be existing columns or new columns created by an expression specified with op:as. Often a sampled column might have a constant value within the group such as a title or label closely associated with a numeric identifier used as the grouping key.
    * @returns { planBuilder.ModifyPlan }
    */
groupToArrays(...args) {
    const namer = bldrbase.getNamer(args, 'keys');
    const paramdefs = [['keys', [PlanNamedGroup, PlanGroup, PlanExprCol, PlanColumn, types.XsString], true, true], ['aggregates', [PlanAggregateCol, PlanColumn, PlanExprCol, types.XsString], false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanModifyPlan.groupToArrays', 1, new Set(['keys', 'aggregates']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanModifyPlan.groupToArrays', 1, false, paramdefs, args);
    return new PlanModifyPlan(this, 'op', 'group-to-arrays', checkedArgs);

    }
/**
    * This method restricts the left row set to rows where a row with the same columns and values exists in the right row set. Provides a client interface to a server function. See {@link http://docs.marklogic.com/ModifyPlan.prototype.intersect|ModifyPlan.prototype.intersect}
    * @method planBuilder.ModifyPlan#intersect
    * @since 2.1.1
    * @param { PlanModifyPlan } [right] - The row set from the right view.
    * @returns { planBuilder.ModifyPlan }
    */
intersect(...args) {
    const paramdef = ['right', [PlanModifyPlan], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('PlanModifyPlan.intersect', 1, paramdef, args);
    return new PlanModifyPlan(this, 'op', 'intersect', checkedArgs);
    }
/**
    * This method yields one output row set that concatenates every left row with every right row. Matches other than equality matches (for instance, greater-than comparisons between keys) can be implemented with a condition on the cross product.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/ModifyPlan.prototype.joinCrossProduct|ModifyPlan.prototype.joinCrossProduct}
    * @method planBuilder.ModifyPlan#joinCrossProduct
    * @since 2.1.1
    * @param { PlanModifyPlan } [right] - The row set from the right view.
    * @param { XsBoolean } [condition] - A boolean expression that filters the join output rows.
    * @returns { planBuilder.ModifyPlan }
    */
joinCrossProduct(...args) {
    const namer = bldrbase.getNamer(args, 'right');
    const paramdefs = [['right', [PlanModifyPlan], true, false], ['condition', [types.XsBoolean, PlanColumn, PlanParam], false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanModifyPlan.joinCrossProduct', 1, new Set(['right', 'condition']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanModifyPlan.joinCrossProduct', 1, false, paramdefs, args);
    return new PlanModifyPlan(this, 'op', 'join-cross-product', checkedArgs);

    }
/**
    * This function specifies a document column to add to the rows by reading the documents for an existing source column having a value of a document uri (which can be used to read other documents) or a fragment id (which can be used to read the source documents for rows).  Provides a client interface to a server function. See {@link http://docs.marklogic.com/ModifyPlan.prototype.joinDoc|ModifyPlan.prototype.joinDoc}
    * @method planBuilder.ModifyPlan#joinDoc
    * @since 2.1.1
    * @param { PlanColumnName } [docCol] - The document column to add to the rows. This can be a string or column specifying the name of the new column that should have the document as its value.
    * @param { PlanColumn } [sourceCol] - The document uri or fragment id value. This is either the output from op:fragment-id-col specifying a fragment id column or a document uri column. Joining on a fragment id is more efficient than joining on a uri column.
    * @returns { planBuilder.ModifyPlan }
    */
joinDoc(...args) {
    const namer = bldrbase.getNamer(args, 'docCol');
    const paramdefs = [['docCol', [PlanColumn, types.XsString], true, false], ['sourceCol', [PlanColumn], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanModifyPlan.joinDoc', 2, new Set(['docCol', 'sourceCol']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanModifyPlan.joinDoc', 2, false, paramdefs, args);
    return new PlanModifyPlan(this, 'op', 'join-doc', checkedArgs);

    }
/**
    * This method adds a uri column to rows based on an existing fragment id column to identify the source document for each row. The fragmentIdCol must be an op:fragment-id-col specifying a fragment id column. If the fragment id column is null in the row, the row is dropped from the rowset.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/ModifyPlan.prototype.joinDocUri|ModifyPlan.prototype.joinDocUri}
    * @method planBuilder.ModifyPlan#joinDocUri
    * @since 2.1.1
    * @param { PlanColumnName } [uriCol] - The document uri. This is the output from op:col('uri') that specifies a document uri column.
    * @param { PlanColumn } [fragmentIdCol] - The document fragment id value. This is the output from op:fragment-id-col specifying a fragment id column.
    * @returns { planBuilder.ModifyPlan }
    */
joinDocUri(...args) {
    const namer = bldrbase.getNamer(args, 'uriCol');
    const paramdefs = [['uriCol', [PlanColumn, types.XsString], true, false], ['fragmentIdCol', [PlanColumn], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanModifyPlan.joinDocUri', 2, new Set(['uriCol', 'fragmentIdCol']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanModifyPlan.joinDocUri', 2, false, paramdefs, args);
    return new PlanModifyPlan(this, 'op', 'join-doc-uri', checkedArgs);

    }
/**
    * This method returns all rows from multiple tables where the join condition is met. In the output row set, each row concatenates one left row and one right row for each match between the keys in the left and right row sets.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/ModifyPlan.prototype.joinInner|ModifyPlan.prototype.joinInner}
    * @method planBuilder.ModifyPlan#joinInner
    * @since 2.1.1
    * @param { PlanModifyPlan } [right] - The row set from the right view.
    * @param { PlanJoinKey } [keys] - The equijoin from one or more calls to the op:on function.
    * @param { XsBoolean } [condition] - A boolean expression that filters the join output rows.
    * @returns { planBuilder.ModifyPlan }
    */
joinInner(...args) {
    const namer = bldrbase.getNamer(args, 'right');
    const paramdefs = [['right', [PlanModifyPlan], true, false], ['keys', [PlanJoinKey], false, true], ['condition', [types.XsBoolean, PlanColumn, PlanParam], false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanModifyPlan.joinInner', 1, new Set(['right', 'keys', 'condition']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanModifyPlan.joinInner', 1, false, paramdefs, args);
    return new PlanModifyPlan(this, 'op', 'join-inner', checkedArgs);

    }
/**
    * This method yields one output row set with the rows from an inner join as well as the other rows from the left row set.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/ModifyPlan.prototype.joinLeftOuter|ModifyPlan.prototype.joinLeftOuter}
    * @method planBuilder.ModifyPlan#joinLeftOuter
    * @since 2.1.1
    * @param { PlanModifyPlan } [right] - The row set from the right view.
    * @param { PlanJoinKey } [keys] - The equijoin from one or more calls to the op:on function.
    * @param { XsBoolean } [condition] - A boolean expression that filters the join output rows.
    * @returns { planBuilder.ModifyPlan }
    */
joinLeftOuter(...args) {
    const namer = bldrbase.getNamer(args, 'right');
    const paramdefs = [['right', [PlanModifyPlan], true, false], ['keys', [PlanJoinKey], false, true], ['condition', [types.XsBoolean, PlanColumn, PlanParam], false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanModifyPlan.joinLeftOuter', 1, new Set(['right', 'keys', 'condition']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanModifyPlan.joinLeftOuter', 1, false, paramdefs, args);
    return new PlanModifyPlan(this, 'op', 'join-left-outer', checkedArgs);

    }
/**
    * This method yields one output row set with the rows from an inner join as well as the other rows from both the left and right row sets.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/ModifyPlan.prototype.joinFullOuter|ModifyPlan.prototype.joinFullOuter}
    * @method planBuilder.ModifyPlan#joinFullOuter
    * @since 2.1.1
    * @param { PlanModifyPlan } [right] - The row set from the right view.
    * @param { PlanJoinKey } [keys] - The equijoin from one or more calls to the op:on function.
    * @param { XsBoolean } [condition] - A boolean expression that filters the join output rows.
    * @returns { planBuilder.ModifyPlan }
    */
joinFullOuter(...args) {
    const namer = bldrbase.getNamer(args, 'right');
    const paramdefs = [['right', [PlanModifyPlan], true, false], ['keys', [PlanJoinKey], false, true], ['condition', [types.XsBoolean, PlanColumn, PlanParam], false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanModifyPlan.joinFullOuter', 1, new Set(['right', 'keys', 'condition']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanModifyPlan.joinFullOuter', 1, false, paramdefs, args);
    return new PlanModifyPlan(this, 'op', 'join-full-outer', checkedArgs);

    }
/**
    * This method specifies the maximum number of rows to be returned by this Plan. Provides a client interface to a server function. See {@link http://docs.marklogic.com/ModifyPlan.prototype.limit|ModifyPlan.prototype.limit}
    * @method planBuilder.ModifyPlan#limit
    * @since 2.1.1
    * @param { PlanLongParam } [length] - The number of rows to return.
    * @returns { planBuilder.ModifyPlan }
    */
limit(...args) {
    const paramdef = ['length', [types.XsLong, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('PlanModifyPlan.limit', 1, paramdef, args);
    return new PlanModifyPlan(this, 'op', 'limit', checkedArgs);
    }
/**
    * This method returns a subset of the rows in the result set. The start parameter specifies the index in the result set to use as the starting point for the return, followed by the remaining rows up to the number specified by the op:limit method.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/ModifyPlan.prototype.offset|ModifyPlan.prototype.offset}
    * @method planBuilder.ModifyPlan#offset
    * @since 2.1.1
    * @param { PlanLongParam } [start] - The index in the result set to use as the starting point.
    * @returns { planBuilder.ModifyPlan }
    */
offset(...args) {
    const paramdef = ['start', [types.XsLong, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('PlanModifyPlan.offset', 1, paramdef, args);
    return new PlanModifyPlan(this, 'op', 'offset', checkedArgs);
    }
/**
    * This method returns a subset of the rows in the result set by skipping the number of rows specified by start and returning the remaining rows up to the length limit.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/ModifyPlan.prototype.offsetLimit|ModifyPlan.prototype.offsetLimit}
    * @method planBuilder.ModifyPlan#offsetLimit
    * @since 2.1.1
    * @param { PlanLongParam } [start] - The number of rows to skip. Default is 1.
    * @param { PlanLongParam } [length] - The maximum number of rows to return.
    * @returns { planBuilder.ModifyPlan }
    */
offsetLimit(...args) {
    const namer = bldrbase.getNamer(args, 'start');
    const paramdefs = [['start', [types.XsLong, PlanParam], false, false], ['length', [types.XsLong, PlanParam], false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanModifyPlan.offsetLimit', 2, new Set(['start', 'length']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanModifyPlan.offsetLimit', 2, false, paramdefs, args);
    return new PlanModifyPlan(this, 'op', 'offset-limit', checkedArgs);

    }
/**
    * This method is a filtering join that filters based on whether the join exists or not but doesn't add any columns.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/ModifyPlan.prototype.notExistsJoin|ModifyPlan.prototype.notExistsJoin}
    * @method planBuilder.ModifyPlan#notExistsJoin
    * @since 2.1.1
    * @param { PlanModifyPlan } [right] - The row set from the right view.
    * @param { PlanJoinKey } [keys] - The equijoin from one or more calls to the op:on function.
    * @param { XsBoolean } [condition] - A boolean expression that filters the join output rows.
    * @returns { planBuilder.ModifyPlan }
    */
notExistsJoin(...args) {
    const namer = bldrbase.getNamer(args, 'right');
    const paramdefs = [['right', [PlanModifyPlan], true, false], ['keys', [PlanJoinKey], false, true], ['condition', [types.XsBoolean, PlanColumn, PlanParam], false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanModifyPlan.notExistsJoin', 1, new Set(['right', 'keys', 'condition']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanModifyPlan.notExistsJoin', 1, false, paramdefs, args);
    return new PlanModifyPlan(this, 'op', 'not-exists-join', checkedArgs);

    }
/**
    * This method sorts the row set by the specified order definition. Provides a client interface to a server function. See {@link http://docs.marklogic.com/ModifyPlan.prototype.orderBy|ModifyPlan.prototype.orderBy}
    * @method planBuilder.ModifyPlan#orderBy
    * @since 2.1.1
    * @param { PlanSortKeyName } [keys] - The specified column or sortdef output from the op:asc or op:desc function.
    * @returns { planBuilder.ModifyPlan }
    */
orderBy(...args) {
    const paramdef = ['keys', [PlanSortKey, PlanColumn, PlanExprCol, types.XsString], true, true];
    const checkedArgs = bldrbase.makeSingleArgs('PlanModifyPlan.orderBy', 1, paramdef, args);
    return new PlanModifyPlan(this, 'op', 'order-by', checkedArgs);
    }
/**
    * This method prepares the specified plan for execution as an optional final step before execution. Provides a client interface to a server function. See {@link http://docs.marklogic.com/ModifyPlan.prototype.prepare|ModifyPlan.prototype.prepare}
    * @method planBuilder.ModifyPlan#prepare
    * @since 2.1.1
    * @param { XsInt } [optimize] - The optimization level, which can be 0, 1, or 2 (with 1 as the default).
    * @returns { planBuilder.PreparePlan }
    */
prepare(...args) {
    const paramdef = ['optimize', [types.XsInt], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('PlanModifyPlan.prepare', 1, paramdef, args);
    return new PlanPreparePlan(this, 'op', 'prepare', checkedArgs);
    }
/**
    * This call projects the specified columns from the current row set and / or applies a qualifier to the columns in the row set. Unlike SQL, a select call is not required in an Optic query. Provides a client interface to a server function. See {@link http://docs.marklogic.com/ModifyPlan.prototype.select|ModifyPlan.prototype.select}
    * @method planBuilder.ModifyPlan#select
    * @since 2.1.1
    * @param { PlanExprColName } [columns] - The columns to project from the input rows. The columns can be named with a string or a column parameter function such as op:col or constructed from an expression with op:as.
    * @param { XsString } [qualifierName] - Specifies a name for qualifying the column names in place of the combination of the schema and view names. Use cases for the qualifier include self joins. Using an empty string removes all qualification from the column names.
    * @returns { planBuilder.ModifyPlan }
    */
select(...args) {
    const namer = bldrbase.getNamer(args, 'columns');
    const paramdefs = [['columns', [PlanExprCol, PlanColumn, types.XsString], false, true], ['qualifierName', [types.XsString], false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanModifyPlan.select', 1, new Set(['columns', 'qualifierName']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanModifyPlan.select', 1, false, paramdefs, args);
    return new PlanModifyPlan(this, 'op', 'select', checkedArgs);

    }
/**
    * This method yields all of the rows from the input row sets. Columns that are present only in some input row sets effectively have a null value in the rows from the other row sets.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/ModifyPlan.prototype.union|ModifyPlan.prototype.union}
    * @method planBuilder.ModifyPlan#union
    * @since 2.1.1
    * @param { PlanModifyPlan } [right] - The row set from the right view.
    * @returns { planBuilder.ModifyPlan }
    */
union(...args) {
    const paramdef = ['right', [PlanModifyPlan], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('PlanModifyPlan.union', 1, paramdef, args);
    return new PlanModifyPlan(this, 'op', 'union', checkedArgs);
    }
/**
    * This method restricts the row set to rows matched by the boolean expression. Use boolean composers such as op:and and op:or to combine multiple expressions.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/ModifyPlan.prototype.where|ModifyPlan.prototype.where}
    * @method planBuilder.ModifyPlan#where
    * @since 2.1.1
    * @param { PlanRowFilter } [condition] - This can be a boolean expression, a cts:query to qualify the source documents that produced the rows set, or (where part of the row set was produced by the op:from-triples accessor) a sem:store to restrict or expand the triples that produce the row set.
    * @returns { planBuilder.ModifyPlan }
    */
where(...args) {
    const paramdef = ['condition', [types.XsBoolean, PlanColumn, types.CtsQuery, types.SemStore, PlanCondition], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('PlanModifyPlan.where', 1, paramdef, args);
    return new PlanModifyPlan(this, 'op', 'where', checkedArgs);
    }
/**
    * This method removes duplicate rows from the row set. Provides a client interface to a server function. See {@link http://docs.marklogic.com/ModifyPlan.prototype.whereDistinct|ModifyPlan.prototype.whereDistinct}
    * @method planBuilder.ModifyPlan#whereDistinct
    * @since 2.1.1

    * @returns { planBuilder.ModifyPlan }
    */
whereDistinct(...args) {
    bldrbase.checkMaxArity('PlanModifyPlan.whereDistinct', args.length, 0);
    return new PlanModifyPlan(this, 'op', 'where-distinct', args);
    }
}
/**
  * AccessPlan objects have methods and inherit {@link planBuilder.ModifyPlan} methods.
  * @namespace planBuilder.AccessPlan
  * @since 2.1.1
  */
class PlanAccessPlan extends PlanModifyPlan {

  constructor(prior, ns, fn, args) {
    super(prior, ns, fn, args);
  }
/**
    * This method identifies a column, where the column name is unique. A qualifier on the column name isn't necessary (and might not exist). In positions where only a column name can appear, the unqualified column name can also be provided as a string. Qualified column names cannot be provided as a string. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.col|op.col}
    * @method planBuilder.AccessPlan#col
    * @since 2.1.1
    * @param { XsString } [column] - The Optic AccessorPlan created by op:from-view, op:from-triples, or op:from-lexicons.
    * @returns { planBuilder.PlanColumn }
    */
col(...args) {
    const paramdef = ['column', [types.XsString], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('PlanAccessPlan.col', 1, paramdef, args);
    return new PlanColumn('op', 'col', checkedArgs);
    }
/**
    * This function samples rows from a view or from a pattern match on the triple index. Provides a client interface to a server function. See {@link http://docs.marklogic.com/AccessPlan.prototype.sampleBy|AccessPlan.prototype.sampleBy}
    * @method planBuilder.AccessPlan#sampleBy
    * @since 2.1.1
    * @param { PlanSampleByOption } [option] - 
    * @returns { planBuilder.ModifyPlan }
    */
sampleBy(...args) {
    const paramdef = ['option', [PlanSampleByOption], false, false];
    const checkedArgs = bldrbase.makeSingleArgs('PlanAccessPlan.sampleBy', 1, paramdef, args);
    return new PlanModifyPlan(this, 'op', 'sample-by', checkedArgs);
    }
}

/**
 * A helper for building the definition of a rows query. The helper is
 * created by the {@link marklogic.planBuilder} function.
 * @namespace planBuilder
 */
/**
    * Builds expressions to call functions in the cts server library
    * for a row pipeline.
    * @namespace planBuilder.cts
    * @since 2.1.1
    */
/**
    * Builds expressions to call functions in the fn server library
    * for a row pipeline.
    * @namespace planBuilder.fn
    * @since 2.1.1
    */
/**
    * Builds expressions to call functions in the geo server library
    * for a row pipeline.
    * @namespace planBuilder.geo
    * @since 2.1.1
    */
/**
    * Builds expressions to call functions in the json server library
    * for a row pipeline.
    * @namespace planBuilder.json
    * @since 2.1.1
    */
/**
    * Builds expressions to call functions in the map server library
    * for a row pipeline.
    * @namespace planBuilder.map
    * @since 2.1.1
    */
/**
    * Builds expressions to call functions in the math server library
    * for a row pipeline.
    * @namespace planBuilder.math
    * @since 2.1.1
    */
/**
    * Builds expressions to call functions in the rdf server library
    * for a row pipeline.
    * @namespace planBuilder.rdf
    * @since 2.1.1
    */
/**
    * Builds expressions to call functions in the sem server library
    * for a row pipeline.
    * @namespace planBuilder.sem
    * @since 2.1.1
    */
/**
    * Builds expressions to call functions in the spell server library
    * for a row pipeline.
    * @namespace planBuilder.spell
    * @since 2.1.1
    */
/**
    * Builds expressions to call functions in the sql server library
    * for a row pipeline.
    * @namespace planBuilder.sql
    * @since 2.1.1
    */
/**
    * Builds expressions to call functions in the xdmp server library
    * for a row pipeline.
    * @namespace planBuilder.xdmp
    * @since 2.1.1
    */
/**
    * Builds expressions to call functions in the xs server library
    * for a row pipeline.
    * @namespace planBuilder.xs
    * @since 2.1.1
    */

class PlanBuilder {
  constructor(fieldOverrides) {
    this.cts = (fieldOverrides.cts !== void 0) ? fieldOverrides.cts : new CtsExpr();
this.fn = (fieldOverrides.fn !== void 0) ? fieldOverrides.fn : new FnExpr();
this.geo = (fieldOverrides.geo !== void 0) ? fieldOverrides.geo : new GeoExpr();
this.json = (fieldOverrides.json !== void 0) ? fieldOverrides.json : new JsonExpr();
this.map = (fieldOverrides.map !== void 0) ? fieldOverrides.map : new MapExpr();
this.math = (fieldOverrides.math !== void 0) ? fieldOverrides.math : new MathExpr();
this.rdf = (fieldOverrides.rdf !== void 0) ? fieldOverrides.rdf : new RdfExpr();
this.sem = (fieldOverrides.sem !== void 0) ? fieldOverrides.sem : new SemExpr();
this.spell = (fieldOverrides.spell !== void 0) ? fieldOverrides.spell : new SpellExpr();
this.sql = (fieldOverrides.sql !== void 0) ? fieldOverrides.sql : new SqlExpr();
this.xdmp = (fieldOverrides.xdmp !== void 0) ? fieldOverrides.xdmp : new XdmpExpr();
this.xs = (fieldOverrides.xs !== void 0) ? fieldOverrides.xs : new XsExpr();
  }

  /**
    * This function returns the sum of the specified numeric expressions. In expressions, the call should pass the result from an op:col function to identify a column.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.add|op.add}
    * @method planBuilder#add
    * @since 2.1.1
    * @param { XsAnyAtomicType } [left] - The left value expression.
    * @param { XsAnyAtomicType } [right] - The right value expression.
    * @returns { XsNumeric }
    */
add(...args) {
        const namer = bldrbase.getNamer(args, 'left');
        const paramdefs = [['left', [types.XsAnyAtomicType, PlanColumn, PlanParam], true, false], ['right', [types.XsAnyAtomicType, PlanColumn, PlanParam], true, false]];
        if (namer !== null) {
            const paramNames = new Set(['left', 'right']);
            args = bldrbase.makeNamedArgs(namer, 'planBuilder.add', 2, paramNames, paramdefs, args);
        } else {
            args = bldrbase.makePositionalArgs('planBuilder.add', 2, true, paramdefs, args);
        }
        return new types.XsNumeric('op', 'add', args);
    }
/**
    * This function returns true if the specified expressions all return true. Otherwise, it returns false.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.and|op.and}
    * @method planBuilder#and
    * @since 2.1.1
    * @param { XsAnyAtomicType } [left] - The left value expression.
    * @param { XsAnyAtomicType } [right] - The right value expression.
    * @returns { XsBoolean }
    */
and(...args) {
        const namer = bldrbase.getNamer(args, 'left');
        const paramdefs = [['left', [types.XsAnyAtomicType, PlanColumn, PlanParam], true, false], ['right', [types.XsAnyAtomicType, PlanColumn, PlanParam], true, false]];
        if (namer !== null) {
            const paramNames = new Set(['left', 'right']);
            args = bldrbase.makeNamedArgs(namer, 'planBuilder.and', 2, paramNames, paramdefs, args);
        } else {
            args = bldrbase.makePositionalArgs('planBuilder.and', 2, true, paramdefs, args);
        }
        return new types.XsBoolean('op', 'and', args);
    }
/**
    * This function divides the left numericExpression by the right numericExpression and returns the value. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.divide|op.divide}
    * @method planBuilder#divide
    * @since 2.1.1
    * @param { XsAnyAtomicType } [left] - The left numeric expression.
    * @param { XsAnyAtomicType } [right] - The right numeric expression.
    * @returns { XsNumeric }
    */
divide(...args) {
        const namer = bldrbase.getNamer(args, 'left');
        const paramdefs = [['left', [types.XsAnyAtomicType, PlanColumn, PlanParam], true, false], ['right', [types.XsAnyAtomicType, PlanColumn, PlanParam], true, false]];
        if (namer !== null) {
            const paramNames = new Set(['left', 'right']);
            args = bldrbase.makeNamedArgs(namer, 'planBuilder.divide', 2, paramNames, paramdefs, args);
        } else {
            args = bldrbase.makePositionalArgs('planBuilder.divide', 2, false, paramdefs, args);
        }
        return new types.XsNumeric('op', 'divide', args);
    }
/**
    * This function takes two or more expressions and returns true if all of the expressions return the same value. Otherwise, it returns false. The expressions can include calls to the op:col function to get the value of a column.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.eq|op.eq}
    * @method planBuilder#eq
    * @since 2.1.1
    * @param { XsAnyAtomicType } [left] - The left value expression.
    * @param { XsAnyAtomicType } [right] - The right value expression.
    * @returns { XsBoolean }
    */
eq(...args) {
        const namer = bldrbase.getNamer(args, 'left');
        const paramdefs = [['left', [types.XsAnyAtomicType, PlanColumn, PlanParam], true, false], ['right', [types.XsAnyAtomicType, PlanColumn, PlanParam], true, false]];
        if (namer !== null) {
            const paramNames = new Set(['left', 'right']);
            args = bldrbase.makeNamedArgs(namer, 'planBuilder.eq', 2, paramNames, paramdefs, args);
        } else {
            args = bldrbase.makePositionalArgs('planBuilder.eq', 2, true, paramdefs, args);
        }
        return new types.XsBoolean('op', 'eq', args);
    }
/**
    * This function returns true if the value of the left expression is greater than or equal to the value of the right expression. Otherwise, it returns false. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.ge|op.ge}
    * @method planBuilder#ge
    * @since 2.1.1
    * @param { XsAnyAtomicType } [left] - The left value expression.
    * @param { XsAnyAtomicType } [right] - The right value expression.
    * @returns { XsBoolean }
    */
ge(...args) {
        const namer = bldrbase.getNamer(args, 'left');
        const paramdefs = [['left', [types.XsAnyAtomicType, PlanColumn, PlanParam], true, false], ['right', [types.XsAnyAtomicType, PlanColumn, PlanParam], true, false]];
        if (namer !== null) {
            const paramNames = new Set(['left', 'right']);
            args = bldrbase.makeNamedArgs(namer, 'planBuilder.ge', 2, paramNames, paramdefs, args);
        } else {
            args = bldrbase.makePositionalArgs('planBuilder.ge', 2, false, paramdefs, args);
        }
        return new types.XsBoolean('op', 'ge', args);
    }
/**
    * This function returns true if the value of the left expression is greater than the value of the right expression. Otherwise, it returns false. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.gt|op.gt}
    * @method planBuilder#gt
    * @since 2.1.1
    * @param { XsAnyAtomicType } [left] - The left value expression.
    * @param { XsAnyAtomicType } [right] - The right value expression.
    * @returns { XsBoolean }
    */
gt(...args) {
        const namer = bldrbase.getNamer(args, 'left');
        const paramdefs = [['left', [types.XsAnyAtomicType, PlanColumn, PlanParam], true, false], ['right', [types.XsAnyAtomicType, PlanColumn, PlanParam], true, false]];
        if (namer !== null) {
            const paramNames = new Set(['left', 'right']);
            args = bldrbase.makeNamedArgs(namer, 'planBuilder.gt', 2, paramNames, paramdefs, args);
        } else {
            args = bldrbase.makePositionalArgs('planBuilder.gt', 2, false, paramdefs, args);
        }
        return new types.XsBoolean('op', 'gt', args);
    }
/**
    * This function returns true if a test expression evaluates to the same value as any of a list of candidate expressions. Otherwise, it returns false. The expressions can include calls to the op:col function to get the value of a column. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.in|op.in}
    * @method planBuilder#in
    * @since 2.1.1
    * @param { XsAnyAtomicType } [value] - The expression providing the value to test.
    * @param { XsAnyAtomicType } [anyOf] - One or more expressions providing the candidate values.
    * @returns { XsBoolean }
    */
in(...args) {
        const namer = bldrbase.getNamer(args, 'value');
        const paramdefs = [['value', [types.XsAnyAtomicType, PlanColumn, PlanParam], true, false], ['anyOf', [types.XsAnyAtomicType, PlanColumn, PlanParam], true, true]];
        if (namer !== null) {
            const paramNames = new Set(['value', 'anyOf']);
            args = bldrbase.makeNamedArgs(namer, 'planBuilder.in', 2, paramNames, paramdefs, args);
        } else {
            args = bldrbase.makePositionalArgs('planBuilder.in', 2, false, paramdefs, args);
        }
        return new types.XsBoolean('op', 'in', args);
    }
/**
    * This function tests whether the value of an expression is null in the row where the expression might be as simple as a column identified by op:col. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.isDefined|op.isDefined}
    * @method planBuilder#isDefined
    * @since 2.1.1
    * @param { Item } [operand] - A boolean expression, such as op:eq or op:not, that might be null.
    * @returns { XsBoolean }
    */
isDefined(...args) {
        const paramdef = ['operand', [types.Item, PlanColumn, PlanParam], true, false];
        args = bldrbase.makeSingleArgs('planBuilder.isDefined', 1, paramdef, args);
        return new types.XsBoolean('op', 'is-defined', args);
    }
/**
    * This function returns true if the value of the left expression is less than or equal to the value of the right expression. Otherwise, it returns false. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.le|op.le}
    * @method planBuilder#le
    * @since 2.1.1
    * @param { XsAnyAtomicType } [left] - The left value expression.
    * @param { XsAnyAtomicType } [right] - The right value expression.
    * @returns { XsBoolean }
    */
le(...args) {
        const namer = bldrbase.getNamer(args, 'left');
        const paramdefs = [['left', [types.XsAnyAtomicType, PlanColumn, PlanParam], true, false], ['right', [types.XsAnyAtomicType, PlanColumn, PlanParam], true, false]];
        if (namer !== null) {
            const paramNames = new Set(['left', 'right']);
            args = bldrbase.makeNamedArgs(namer, 'planBuilder.le', 2, paramNames, paramdefs, args);
        } else {
            args = bldrbase.makePositionalArgs('planBuilder.le', 2, false, paramdefs, args);
        }
        return new types.XsBoolean('op', 'le', args);
    }
/**
    * This function returns true if the value of the left expression is less than the value of the right expression. Otherwise, it returns false. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.lt|op.lt}
    * @method planBuilder#lt
    * @since 2.1.1
    * @param { XsAnyAtomicType } [left] - The left value expression.
    * @param { XsAnyAtomicType } [right] - The right value expression.
    * @returns { XsBoolean }
    */
lt(...args) {
        const namer = bldrbase.getNamer(args, 'left');
        const paramdefs = [['left', [types.XsAnyAtomicType, PlanColumn, PlanParam], true, false], ['right', [types.XsAnyAtomicType, PlanColumn, PlanParam], true, false]];
        if (namer !== null) {
            const paramNames = new Set(['left', 'right']);
            args = bldrbase.makeNamedArgs(namer, 'planBuilder.lt', 2, paramNames, paramdefs, args);
        } else {
            args = bldrbase.makePositionalArgs('planBuilder.lt', 2, false, paramdefs, args);
        }
        return new types.XsBoolean('op', 'lt', args);
    }
/**
    * This function multiplies the left numericExpression by the right numericExpression and returns the value.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.multiply|op.multiply}
    * @method planBuilder#multiply
    * @since 2.1.1
    * @param { XsAnyAtomicType } [left] - The left numeric expression.
    * @param { XsAnyAtomicType } [right] - The right numeric expression.
    * @returns { XsNumeric }
    */
multiply(...args) {
        const namer = bldrbase.getNamer(args, 'left');
        const paramdefs = [['left', [types.XsAnyAtomicType, PlanColumn, PlanParam], true, false], ['right', [types.XsAnyAtomicType, PlanColumn, PlanParam], true, false]];
        if (namer !== null) {
            const paramNames = new Set(['left', 'right']);
            args = bldrbase.makeNamedArgs(namer, 'planBuilder.multiply', 2, paramNames, paramdefs, args);
        } else {
            args = bldrbase.makePositionalArgs('planBuilder.multiply', 2, true, paramdefs, args);
        }
        return new types.XsNumeric('op', 'multiply', args);
    }
/**
    * This function returns true if the value of the left expression is not equal to the value of the right expression. Otherwise, it returns false. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.ne|op.ne}
    * @method planBuilder#ne
    * @since 2.1.1
    * @param { XsAnyAtomicType } [left] - The left value expression.
    * @param { XsAnyAtomicType } [right] - The right value expression.
    * @returns { XsBoolean }
    */
ne(...args) {
        const namer = bldrbase.getNamer(args, 'left');
        const paramdefs = [['left', [types.XsAnyAtomicType, PlanColumn, PlanParam], true, false], ['right', [types.XsAnyAtomicType, PlanColumn, PlanParam], true, false]];
        if (namer !== null) {
            const paramNames = new Set(['left', 'right']);
            args = bldrbase.makeNamedArgs(namer, 'planBuilder.ne', 2, paramNames, paramdefs, args);
        } else {
            args = bldrbase.makePositionalArgs('planBuilder.ne', 2, false, paramdefs, args);
        }
        return new types.XsBoolean('op', 'ne', args);
    }
/**
    * This function returns true if neither of the specified boolean expressions return true. Otherwise, it returns false. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.not|op.not}
    * @method planBuilder#not
    * @since 2.1.1
    * @param { XsAnyAtomicType } [operand] - Exactly one boolean expression, such as op:and or op:or, or op:is-defined.
    * @returns { XsBoolean }
    */
not(...args) {
        const paramdef = ['operand', [types.XsAnyAtomicType, PlanColumn, PlanParam], true, false];
        args = bldrbase.makeSingleArgs('planBuilder.not', 1, paramdef, args);
        return new types.XsBoolean('op', 'not', args);
    }
/**
    * This function returns true if the specified expressions all return true. Otherwise, it returns false.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.or|op.or}
    * @method planBuilder#or
    * @since 2.1.1
    * @param { XsAnyAtomicType } [left] - The left value expression.
    * @param { XsAnyAtomicType } [right] - The right value expression.
    * @returns { XsBoolean }
    */
or(...args) {
        const namer = bldrbase.getNamer(args, 'left');
        const paramdefs = [['left', [types.XsAnyAtomicType, PlanColumn, PlanParam], true, false], ['right', [types.XsAnyAtomicType, PlanColumn, PlanParam], true, false]];
        if (namer !== null) {
            const paramNames = new Set(['left', 'right']);
            args = bldrbase.makeNamedArgs(namer, 'planBuilder.or', 2, paramNames, paramdefs, args);
        } else {
            args = bldrbase.makePositionalArgs('planBuilder.or', 2, true, paramdefs, args);
        }
        return new types.XsBoolean('op', 'or', args);
    }
/**
    * This function subtracts the right numericExpression from the left numericExpression and returns the value. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.subtract|op.subtract}
    * @method planBuilder#subtract
    * @since 2.1.1
    * @param { XsAnyAtomicType } [left] - The left numeric expression.
    * @param { XsAnyAtomicType } [right] - The right numeric expression.
    * @returns { XsNumeric }
    */
subtract(...args) {
        const namer = bldrbase.getNamer(args, 'left');
        const paramdefs = [['left', [types.XsAnyAtomicType, PlanColumn, PlanParam], true, false], ['right', [types.XsAnyAtomicType, PlanColumn, PlanParam], true, false]];
        if (namer !== null) {
            const paramNames = new Set(['left', 'right']);
            args = bldrbase.makeNamedArgs(namer, 'planBuilder.subtract', 2, paramNames, paramdefs, args);
        } else {
            args = bldrbase.makePositionalArgs('planBuilder.subtract', 2, false, paramdefs, args);
        }
        return new types.XsNumeric('op', 'subtract', args);
    }/**
    * This function creates a placeholder for a literal value in an expression or as the offset or max for a limit. The op:result function throws in an error if the binding parameter does not specify a literal value for the parameter. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.param|op.param}
    * @method planBuilder#param
    * @since 2.1.1
    * @param { XsString } [name] - The name of the parameter.
    * @returns { planBuilder.PlanParam }
    */
param(...args) {
    const paramdef = ['name', [types.XsString], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('PlanBuilder.param', 1, paramdef, args);
    return new PlanParam('op', 'param', checkedArgs);
    }
/**
    * This method identifies a column, where the column name is unique. A qualifier on the column name isn't necessary (and might not exist). In positions where only a column name can appear, the unqualified column name can also be provided as a string. Qualified column names cannot be provided as a string. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.col|op.col}
    * @method planBuilder#col
    * @since 2.1.1
    * @param { XsString } [column] - The Optic AccessorPlan created by op:from-view, op:from-triples, or op:from-lexicons.
    * @returns { planBuilder.PlanColumn }
    */
col(...args) {
    const paramdef = ['column', [types.XsString], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('PlanBuilder.col', 1, paramdef, args);
    return new PlanColumn('op', 'col', checkedArgs);
    }
/**
    * Unambiguously identifies a column with the schema name, view name, and column name. Useful only for columns provided by a view. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.schemaCol|op.schemaCol}
    * @method planBuilder#schemaCol
    * @since 2.1.1
    * @param { XsString } [schema] - The name of the schema.
    * @param { XsString } [view] - The name of the view.
    * @param { XsString } [column] - The name of the column.
    * @returns { planBuilder.PlanColumn }
    */
schemaCol(...args) {
    const namer = bldrbase.getNamer(args, 'schema');
    const paramdefs = [['schema', [types.XsString], true, false], ['view', [types.XsString], true, false], ['column', [types.XsString], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.schemaCol', 3, new Set(['schema', 'view', 'column']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.schemaCol', 3, false, paramdefs, args);
    return new PlanColumn('op', 'schema-col', checkedArgs);

    }
/**
    * Identifies a column where the combination of view and column name is unique. Identifying the schema isn't necessary (and it might not exist).  Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.viewCol|op.viewCol}
    * @method planBuilder#viewCol
    * @since 2.1.1
    * @param { XsString } [view] - The name of the view.
    * @param { XsString } [column] - The name of the column.
    * @returns { planBuilder.PlanColumn }
    */
viewCol(...args) {
    const namer = bldrbase.getNamer(args, 'view');
    const paramdefs = [['view', [types.XsString], true, false], ['column', [types.XsString], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.viewCol', 2, new Set(['view', 'column']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.viewCol', 2, false, paramdefs, args);
    return new PlanColumn('op', 'view-col', checkedArgs);

    }
/**
    * Specifies a name for adding a fragment id column to the row set identifying the source documents for the rows from a view, lexicons or triples. The only use for the fragment id is joining other rows from the same document, the document uri, or the document content. The fragment id is only useful during execution of the query and not after. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.fragmentIdCol|op.fragmentIdCol}
    * @method planBuilder#fragmentIdCol
    * @since 2.1.1
    * @param { XsString } [column] - 
    * @returns { planBuilder.PlanSystemColumn }
    */
fragmentIdCol(...args) {
    const paramdef = ['column', [types.XsString], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('PlanBuilder.fragmentIdCol', 1, paramdef, args);
    return new PlanSystemColumn('op', 'fragment-id-col', checkedArgs);
    }
/**
    * Identifies the graph for a triple providing one or more columns for a row. You pass the graph column as a system column parameter to the op:pattern function. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.graphCol|op.graphCol}
    * @method planBuilder#graphCol
    * @since 2.1.1
    * @param { XsString } [column] - The name to use for the graph column.
    * @returns { planBuilder.PlanSystemColumn }
    */
graphCol(...args) {
    const paramdef = ['column', [types.XsString], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('PlanBuilder.graphCol', 1, paramdef, args);
    return new PlanSystemColumn('op', 'graph-col', checkedArgs);
    }
/**
    * This function defines a column by assigning the value of an expression over the rows in the row set. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.as|op.as}
    * @method planBuilder#as
    * @since 2.1.1
    * @param { PlanColumnName } [column] - The name of the column to be defined. This can be either a string or the return value from op:col, op:view-col, or op:schema-col.
    * @param { Item } [expression] - The expression used to define the value the column.
    * @returns { planBuilder.PlanExprCol }
    */
as(...args) {
    const namer = bldrbase.getNamer(args, 'column');
    const paramdefs = [['column', [PlanColumn, types.XsString], true, false], ['expression', [types.Item, PlanColumn, PlanParam], false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.as', 2, new Set(['column', 'expression']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.as', 2, false, paramdefs, args);
    return new PlanExprCol('op', 'as', checkedArgs);

    }
/**
    * This function reads a row set from a configured view over TDE-indexed rows or a predefined view over range indexes.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.fromView|op.fromView}
    * @method planBuilder#fromView
    * @since 2.1.1
    * @param { XsString } [schema] - The name identifying the schema containing the view. If the schema name is null, the engine searches for a view with the specified name.
    * @param { XsString } [view] - The name identifying a configured template or range view for rows projected from documents.
    * @param { XsString } [qualifierName] - Specifies a name for qualifying the column names in place of the combination of the schema and view names. Use cases for the qualifier include self joins. Using an empty string removes all qualification from the column names.
    * @param { PlanSystemColumn } [sysCols] - An optional named fragment id column returned by op:fragment-id-col. One use case for fragment ids is in joins with lexicons or document content.
    * @returns { planBuilder.AccessPlan }
    */
fromView(...args) {
    const namer = bldrbase.getNamer(args, 'schema');
    const paramdefs = [['schema', [types.XsString], false, false], ['view', [types.XsString], true, false], ['qualifierName', [types.XsString], false, false], ['sysCols', [PlanSystemColumn], false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.fromView', 2, new Set(['schema', 'view', 'qualifierName', 'sysCols']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.fromView', 2, false, paramdefs, args);
    return new PlanAccessPlan(null, 'op', 'from-view', checkedArgs);

    }
/**
    * This function factory returns a new function that takes a name parameter and returns a sem:iri, prepending the specified base URI onto the name. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.prefixer|op.prefixer}
    * @method planBuilder#prefixer
    * @since 2.1.1
    * @param { XsString } [base] - The base URI to be prepended to the name.
    * @returns { planBuilder.Prefixer }
    */
prefixer(...args) {
    const paramdef = ['base', [types.XsString], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('PlanBuilder.prefixer', 1, paramdef, args);
    return new PlanPrefixer('op', 'prefixer', checkedArgs);
    }
/**
    * Reads rows by matching patterns in the triple index.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.fromTriples|op.fromTriples}
    * @method planBuilder#fromTriples
    * @since 2.1.1
    * @param { PlanTriplePattern } [patterns] - One or more pattern definitions returned by the op:pattern function.
    * @param { XsString } [qualifierName] - Specifies a name for qualifying the column names. By default, triple rows have no qualification. Use cases for the qualifier include self joins. Using an empty string removes all qualification from the column names.
    * @param { XsString } [graphIris] - A list of graph IRIs to restrict the results to triples in the specified graphs. The sem:default-graph-iri function returns the iri that identifies the default graph.
    * @param { PlanTripleOption } [option] - Options consisting of key-value pairs that set options. At present, the options consist of dedup which can take an on|off value to enable or disable deduplication. Deduplication is off by default.
    * @returns { planBuilder.AccessPlan }
    */
fromTriples(...args) {
    const namer = bldrbase.getNamer(args, 'patterns');
    const paramdefs = [['patterns', [PlanTriplePattern], true, true], ['qualifierName', [types.XsString], false, false], ['graphIris', [types.XsString], false, true], ['option', [PlanTripleOption], false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.fromTriples', 1, new Set(['patterns', 'qualifierName', 'graphIris', 'option']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.fromTriples', 1, false, paramdefs, args);
    return new PlanAccessPlan(null, 'op', 'from-triples', checkedArgs);

    }
/**
    * This function builds the parameters for the op:from-triples function. The result is passed to op:from-triples to project rows from the graph of triples. The columns in a pattern become the columns of the row. The literals in a pattern are used to match triples. You should specify at least one literal in each pattern, usually the predicate. Where a column appears in more than one pattern, the matched triples are joined to form the row. You can specify optional triples with a op:join-left-outer with a separate op:from-triples. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.pattern|op.pattern}
    * @method planBuilder#pattern
    * @since 2.1.1
    * @param { PlanTriplePosition } [subjects] - One column or one or more literal values, such as the literal returned by a sem:iri call.
    * @param { PlanTriplePosition } [predicates] - One column or one or more literal values, such as the literal returned by a sem.iri call.
    * @param { PlanTriplePosition } [objects] - One column or one or more literal values, such as the literal returned by a sem:iri call.
    * @param { PlanSystemColumn } [sysCols] - Specifies the result of an op:fragment-id-col or op:graph-col function to add columns for the fragment id or graph iri.
    * @returns { planBuilder.PlanTriplePattern }
    */
pattern(...args) {
    const namer = bldrbase.getNamer(args, 'subjects');
    const paramdefs = [['subjects', [PlanColumn, types.XsAnyAtomicType, PlanParam], false, true], ['predicates', [PlanColumn, types.XsAnyAtomicType, PlanParam], false, true], ['objects', [PlanColumn, types.XsAnyAtomicType, PlanParam], false, true], ['sysCols', [PlanSystemColumn], false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.pattern', 3, new Set(['subjects', 'predicates', 'objects', 'sysCols']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.pattern', 3, false, paramdefs, args);
    return new PlanTriplePattern('op', 'pattern', checkedArgs);

    }
/**
    * This function dynamically constructs a view from range indexes or the uri or collection lexicons. This function will only return rows for documents where the first column has a value. The keys in the map specify the names of the columns and the values in the map provide cts:reference objects to specify the lexicon providing the values of the columns. Optic emits rows based on co-occurrence of lexicon values within the same document similar to cts:value-tuples If the cts:reference sets the nullable option to true, the column is optional in the row.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.fromLexicons|op.fromLexicons}
    * @method planBuilder#fromLexicons
    * @since 2.1.1
    * @param { PlanCtsReferenceMap } [indexes] - An object in which each key is a column name and each value specifies a cts:reference for a range index or other lexicon (especially the cts:uri-reference lexicon) with the column values.
    * @param { XsString } [qualifierName] - Specifies a name for qualifying the column names. By default, lexicon rows have no qualification. Use cases for the qualifier include self joins. Using an empty string removes all qualification from the column names.
    * @param { PlanSystemColumn } [sysCols] - An optional named fragment id column returned by the op:fragment-id-col function. The fragment id column can be used for joins.
    * @returns { planBuilder.AccessPlan }
    */
fromLexicons(...args) {
    const namer = bldrbase.getNamer(args, 'indexes');
    const paramdefs = [['indexes', [PlanCtsReferenceMap], true, false], ['qualifierName', [types.XsString], false, false], ['sysCols', [PlanSystemColumn], false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.fromLexicons', 1, new Set(['indexes', 'qualifierName', 'sysCols']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.fromLexicons', 1, false, paramdefs, args);
    return new PlanAccessPlan(null, 'op', 'from-lexicons', checkedArgs);

    }
/**
    * Constructs a literal row set as in the SQL VALUES or SPARQL VALUES statements. When specifying rows with arrays, values are mapped to column names by position. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.fromLiterals|op.fromLiterals}
    * @method planBuilder#fromLiterals
    * @since 2.1.1
    * @param { PlanXsValueMap } [rows] - This parameter is either an array of object literals or sem:binding objects in which the key is a column name string identifying the column and the value is a literal with the value of the column, or this parameter is an object with a columnNames key having a value of an array of column names and a rowValues key having a value of an array of arrays with literal values.
    * @param { XsString } [qualifierName] - Specifies a name for qualifying the column names in place of the combination of the schema and view names. Use cases for the qualifier include self joins. Using an empty string removes all qualification from the column names.
    * @returns { planBuilder.AccessPlan }
    */
fromLiterals(...args) {
    const namer = bldrbase.getNamer(args, 'rows');
    const paramdefs = [['rows', [PlanXsValueMap], true, true], ['qualifierName', [types.XsString], false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.fromLiterals', 1, new Set(['rows', 'qualifierName']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.fromLiterals', 1, false, paramdefs, args);
    return new PlanAccessPlan(null, 'op', 'from-literals', checkedArgs);

    }
/**
    * This function dynamically constructs a row set based on a SPARQL SELECT query from triples. Provides a client interface to a server function. See {@link http://docs.marklogic.com/Builder.prototype.fromSPARQL|Builder.prototype.fromSPARQL}
    * @method planBuilder#fromSPARQL
    * @since 2.1.1
    * @param { XsString } [select] - A SPARQL SELECT query expressed as a string.
    * @param { XsString } [qualifierName] - Specifies a name for qualifying the column names. An "@" in front of the name specifies a parameter placeholder. A parameter placeholder in the SPARQL string must be bound to a parameter value in the result() call.
    * @param { PlanSparqlOption } [option] - Options consisting of key-value pairs that set options. At present, the options consist of dedup and base. Option dedup can take an on|off value to enable or disable deduplication. Deduplication is on by default but will become off by default in a future release. Option base takes a string as the initial base IRI for the query.
    * @returns { planBuilder.ModifyPlan }
    */
fromSPARQL(...args) {
    const namer = bldrbase.getNamer(args, 'select');
    const paramdefs = [['select', [types.XsString], true, false], ['qualifierName', [types.XsString], false, false], ['option', [PlanSparqlOption], false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.fromSPARQL', 1, new Set(['select', 'qualifierName', 'option']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.fromSPARQL', 1, false, paramdefs, args);
    return new PlanModifyPlan(null, 'op', 'from-sparql', checkedArgs);

    }
/**
    * This function dynamically constructs a row set based on a SQL SELECT query from views. Provides a client interface to a server function. See {@link http://docs.marklogic.com/Builder.prototype.fromSQL|Builder.prototype.fromSQL}
    * @method planBuilder#fromSQL
    * @since 2.1.1
    * @param { XsString } [select] - A SQL SELECT query expressed as a string.
    * @param { XsString } [qualifierName] - Specifies a name for qualifying the column names. Placeholder parameters in the SQL string may be bound in the result() call
    * @returns { planBuilder.ModifyPlan }
    */
fromSQL(...args) {
    const namer = bldrbase.getNamer(args, 'select');
    const paramdefs = [['select', [types.XsString], true, false], ['qualifierName', [types.XsString], false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.fromSQL', 1, new Set(['select', 'qualifierName']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.fromSQL', 1, false, paramdefs, args);
    return new PlanModifyPlan(null, 'op', 'from-sql', checkedArgs);

    }
/**
    * This function matches and returns the uri, content, and score for documents. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.fromSearchDocs|op.fromSearchDocs}
    * @method planBuilder#fromSearchDocs
    * @since 2.1.1
    * @param { PlanSearchQuery } [query] - Qualifies and establishes the scores for a set of documents. The query can be a cts:query or a string as a shortcut for a cts:word-query.
    * @param { XsString } [qualifierName] - Specifies a name for qualifying the column names.
    * @returns { planBuilder.AccessPlan }
    */
fromSearchDocs(...args) {
    const namer = bldrbase.getNamer(args, 'query');
    const paramdefs = [['query', [types.XsString, types.CtsQuery], true, false], ['qualifierName', [types.XsString], false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.fromSearchDocs', 1, new Set(['query', 'qualifierName']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.fromSearchDocs', 1, false, paramdefs, args);
    return new PlanAccessPlan(null, 'op', 'from-search-docs', checkedArgs);

    }
/**
    * This function dynamically constructs a row set based on a cts.query where the columns for the document fragment id and score reflecting the degree of match of the document with the query criteria.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.fromSearch|op.fromSearch}
    * @method planBuilder#fromSearch
    * @since 2.1.1
    * @param { PlanSearchQuery } [query] - Qualifies and establishes the scores for a set of documents. The query can be a cts:query or a string as a shortcut for a cts:word-query.
    * @param { PlanExprColName } [columns] - Specifies which of the available columns to include in the rows. The available columns include the metrics for relevance ('confidence', 'fitness', 'quality', and 'score') and fragmentId for the document identifier. By default, the rows have the fragmentId and score columns. To rename a column, use op:as specifying the new name for an op:col with the old name.
    * @param { XsString } [qualifierName] - Specifies a name for qualifying the column names.
    * @param { PlanSearchOption } [option] - Similar to the options of cts:search, supplies the 'scoreMethod' key with a value of 'logtfidf', 'logtf', or 'simple' to specify the method for assigning a score to matched documents or supplies the 'qualityWeight' key with a numeric value to specify a multiplier for the quality contribution to the score.
    * @returns { planBuilder.AccessPlan }
    */
fromSearch(...args) {
    const namer = bldrbase.getNamer(args, 'query');
    const paramdefs = [['query', [types.XsString, types.CtsQuery], true, false], ['columns', [PlanExprCol, PlanColumn, types.XsString], false, true], ['qualifierName', [types.XsString], false, false], ['option', [PlanSearchOption], false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.fromSearch', 1, new Set(['query', 'columns', 'qualifierName', 'option']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.fromSearch', 1, false, paramdefs, args);
    return new PlanAccessPlan(null, 'op', 'from-search', checkedArgs);

    }
/**
    * This function returns a filter definition as input for a WHERE operation. As with a cts:query or sem:store, the filter definition cannot be used in an Optic Boolean expression but, instead, must be the only argument to the WHERE call. Add a separate WHERE call to filter based on an Optic Boolean expression. The condition must be a valid simple SQL Boolean expression expressed as a string.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.sqlCondition|op.sqlCondition}
    * @method planBuilder#sqlCondition
    * @since 2.1.1
    * @param { XsString } [expression] - A boolean expression, such as op:eq or op:not, that might be null.
    * @returns { planBuilder.PlanCondition }
    */
sqlCondition(...args) {
    const paramdef = ['expression', [types.XsString], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('PlanBuilder.sqlCondition', 1, paramdef, args);
    return new PlanCondition('op', 'sql-condition', checkedArgs);
    }
/**
    * Specifies an equijoin using one columndef each from the left and right rows. The result is used by the op:join-inner, op:join-left-outer, and op:join-full-outer, and functions.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.on|op.on}
    * @method planBuilder#on
    * @since 2.1.1
    * @param { PlanExprColName } [left] - The rows from the left view.
    * @param { PlanExprColName } [right] - The row set from the right view.
    * @returns { planBuilder.PlanJoinKey }
    */
on(...args) {
    const namer = bldrbase.getNamer(args, 'left');
    const paramdefs = [['left', [PlanExprCol, PlanColumn, types.XsString], true, false], ['right', [PlanExprCol, PlanColumn, types.XsString], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.on', 2, new Set(['left', 'right']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.on', 2, false, paramdefs, args);
    return new PlanJoinKey('op', 'on', checkedArgs);

    }
/**
    * This function specifies the grouping keys for a group as a list of zero or more columns. The result is used for building the first parameter for the op:group-by-union function. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.group|op.group}
    * @method planBuilder#group
    * @since 2.1.1
    * @param { PlanExprColName } [keys] - The columns (if any) to use as grouping keys. The columns can be named with a string or a column parameter function such as op:col or constructed from an expression with op:as.
    * @returns { planBuilder.PlanGroup }
    */
group(...args) {
    const paramdef = ['keys', [PlanExprCol, PlanColumn, types.XsString], false, true];
    const checkedArgs = bldrbase.makeSingleArgs('PlanBuilder.group', 0, paramdef, args);
    return new PlanGroup('op', 'group', checkedArgs);
    }
/**
    * This function specifies a list of grouping keys for a group and returns that group and larger groups (including all rows) formed by dropping columns from right to left. The result is used for building the first parameter for the op:group-by-union or op:group-to-arrays functions. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.rollup|op.rollup}
    * @method planBuilder#rollup
    * @since 2.1.1
    * @param { PlanExprColName } [keys] - The columns to use as grouping keys. The columns can be named with a string or a column parameter function such as op:col or constructed from an expression with op:as.
    * @returns { planBuilder.PlanGroup }
    */
rollup(...args) {
    const paramdef = ['keys', [PlanExprCol, PlanColumn, types.XsString], true, true];
    const checkedArgs = bldrbase.makeSingleArgs('PlanBuilder.rollup', 1, paramdef, args);
    return new PlanGroup('op', 'rollup', checkedArgs);
    }
/**
    * This function specifies a list of grouping keys for a group and returns that group and every possible larger group (including all rows) formed from any subset of keys. The result is used for building the first parameter for the op:group-by-union or op:group-to-arrays functions. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.cube|op.cube}
    * @method planBuilder#cube
    * @since 2.1.1
    * @param { PlanExprColName } [keys] - The columns to use as grouping keys. The columns can be named with a string or a column parameter function such as op:col or constructed from an expression with op:as.
    * @returns { planBuilder.PlanGroup }
    */
cube(...args) {
    const paramdef = ['keys', [PlanExprCol, PlanColumn, types.XsString], true, true];
    const checkedArgs = bldrbase.makeSingleArgs('PlanBuilder.cube', 1, paramdef, args);
    return new PlanGroup('op', 'cube', checkedArgs);
    }
/**
    * This function specifies the grouping keys for a group as a named list of zero or more columns. The result is used for building the first parameter for the op:group-to-arrays function. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.namedGroup|op.namedGroup}
    * @method planBuilder#namedGroup
    * @since 2.1.1
    * @param { XsString } [name] - The name for the list of grouping keys.
    * @param { PlanExprColName } [keys] - The columns (if any) to use as grouping keys. The columns can be named with a string or a column parameter function such as op:col or constructed from an expression with op:as.
    * @returns { planBuilder.PlanNamedGroup }
    */
namedGroup(...args) {
    const namer = bldrbase.getNamer(args, 'name');
    const paramdefs = [['name', [types.XsString], true, false], ['keys', [PlanExprCol, PlanColumn, types.XsString], false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.namedGroup', 1, new Set(['name', 'keys']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.namedGroup', 1, false, paramdefs, args);
    return new PlanNamedGroup('op', 'named-group', checkedArgs);

    }
/**
    * This function can be used as a named group in functions op:group-to-arrays or op:facet-by. After grouping, the plan can also join a literal table with descriptive metadata based for each bucket number. Developers can handle special cases by taking the same approach as the convenience function and binding a new column on the return value of an sql:bucket expression on a numeric or datetime column to use as a grouping key. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.bucketGroup|op.bucketGroup}
    * @method planBuilder#bucketGroup
    * @since 2.1.1
    * @param { XsString } [name] - The name of both the group and the new grouping key column with numbered buckets.
    * @param { PlanExprColName } [key] - The identifier for the existing column with the values (typically numeric or datetime) to put into buckets. The columns can be named with a string or a column parameter function such as op:col or constructed from an expression with op:as.
    * @param { XsAnyAtomicType } [boundaries] - An ordered XQuery sequence of values that specify the boundaries between buckets. The values must have the same type as the existing column.
    * @param { XsString } [collation] - The collation to use when comparing strings as described in 'Collation URI Syntax' in the  Application Developer's Guide
    * @returns { planBuilder.PlanNamedGroup }
    */
bucketGroup(...args) {
    const namer = bldrbase.getNamer(args, 'name');
    const paramdefs = [['name', [types.XsString], true, false], ['key', [PlanExprCol, PlanColumn, types.XsString], true, false], ['boundaries', [types.XsAnyAtomicType], true, true], ['collation', [types.XsString], false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.bucketGroup', 3, new Set(['name', 'key', 'boundaries', 'collation']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.bucketGroup', 3, false, paramdefs, args);
    return new PlanNamedGroup('op', 'bucket-group', checkedArgs);

    }
/**
    * This function averages the non-null values of the column for the rows in the group or row set. The result is used for building the parameters used by the op:group-by function. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.avg|op.avg}
    * @method planBuilder#avg
    * @since 2.1.1
    * @param { PlanColumnName } [name] - The name to be used for the aggregated column.
    * @param { PlanExprColName } [column] - The column to be aggregated.
    * @param { PlanValueOption } [option] - The options can take a values key with a distinct value to average the distinct values of the column.
    * @returns { planBuilder.PlanAggregateCol }
    */
avg(...args) {
    const namer = bldrbase.getNamer(args, 'name');
    const paramdefs = [['name', [PlanColumn, types.XsString], true, false], ['column', [PlanExprCol, PlanColumn, types.XsString], true, false], ['option', [PlanValueOption], false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.avg', 2, new Set(['name', 'column', 'option']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.avg', 2, false, paramdefs, args);
    return new PlanAggregateCol('op', 'avg', checkedArgs);

    }
/**
    * This function constructs an array whose items are the result of evaluating the column for each row in the group or row set. The result is used for building the parameters used by the op:group-by function. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.arrayAggregate|op.arrayAggregate}
    * @method planBuilder#arrayAggregate
    * @since 2.1.1
    * @param { PlanColumnName } [name] - The name to be used for the aggregated column.
    * @param { PlanExprColName } [column] - The columns to be aggregated.
    * @param { PlanValueOption } [option] - The options can take a values key with a distinct value to average the distinct values of the column.
    * @returns { planBuilder.PlanAggregateCol }
    */
arrayAggregate(...args) {
    const namer = bldrbase.getNamer(args, 'name');
    const paramdefs = [['name', [PlanColumn, types.XsString], true, false], ['column', [PlanExprCol, PlanColumn, types.XsString], true, false], ['option', [PlanValueOption], false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.arrayAggregate', 2, new Set(['name', 'column', 'option']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.arrayAggregate', 2, false, paramdefs, args);
    return new PlanAggregateCol('op', 'array-aggregate', checkedArgs);

    }
/**
    * This function counts the rows where the specified input column has a value. If the input column is omitted, all rows in the group or row set are counted. The result is used for building the parameters used by the op:group-by function. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.count|op.count}
    * @method planBuilder#count
    * @since 2.1.1
    * @param { PlanColumnName } [name] - The name to be used for the column values.
    * @param { PlanExprColName } [column] - The columns to be counted.
    * @param { PlanValueOption } [option] - The options can take a values key with a 'distinct' value to count the distinct values of the column.
    * @returns { planBuilder.PlanAggregateCol }
    */
count(...args) {
    const namer = bldrbase.getNamer(args, 'name');
    const paramdefs = [['name', [PlanColumn, types.XsString], true, false], ['column', [PlanExprCol, PlanColumn, types.XsString], false, false], ['option', [PlanValueOption], false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.count', 1, new Set(['name', 'column', 'option']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.count', 1, false, paramdefs, args);
    return new PlanAggregateCol('op', 'count', checkedArgs);

    }
/**
    * This function concatenates the non-null values of the column for the rows in the group or row set. The result is used for building the parameters used by the op:group-by function. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.groupConcat|op.groupConcat}
    * @method planBuilder#groupConcat
    * @since 2.1.1
    * @param { PlanColumnName } [name] - The name to be used for column with the concatenated values.
    * @param { PlanExprColName } [column] - The name of the column with the values to be concatenated for the group.
    * @param { PlanGroupConcatString } [options] - The options can take a values key with a distinct value to average the distinct values of the column. In addition to the values key, the options can take a separator key specifying a separator character. The value can be a string or placeholder parameter.
    * @returns { planBuilder.PlanAggregateCol }
    */
groupConcat(...args) {
    const namer = bldrbase.getNamer(args, 'name');
    const paramdefs = [['name', [PlanColumn, types.XsString], true, false], ['column', [PlanExprCol, PlanColumn, types.XsString], true, false], ['options', [types.XsString, PlanGroupConcatOption], false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.groupConcat', 2, new Set(['name', 'column', 'options']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.groupConcat', 2, false, paramdefs, args);
    return new PlanAggregateCol('op', 'group-concat', checkedArgs);

    }
/**
    *  Provides a client interface to a server function.
    * @method planBuilder#groupKey
    * @since 2.1.1
    * @param { PlanColumnName } [name] - 
    * @param { PlanExprColName } [column] - 
    * @returns { planBuilder.PlanAggregateCol }
    */
groupKey(...args) {
    const namer = bldrbase.getNamer(args, 'name');
    const paramdefs = [['name', [PlanColumn, types.XsString], true, false], ['column', [PlanExprCol, PlanColumn, types.XsString], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.groupKey', 2, new Set(['name', 'column']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.groupKey', 2, false, paramdefs, args);
    return new PlanAggregateCol('op', 'group-key', checkedArgs);

    }
/**
    * This aggregate function adds a flag to a grouped row specifying whether a column acted as a grouping key for the row.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.hasGroupKey|op.hasGroupKey}
    * @method planBuilder#hasGroupKey
    * @since 2.1.1
    * @param { PlanColumnName } [name] - The name to be used for the aggregated flag column.
    * @param { PlanExprColName } [column] - The column to flag as a grouping key. The column can be named with a string or a column parameter function such as op:col or constructed from an expression with op:as.
    * @returns { planBuilder.PlanAggregateCol }
    */
hasGroupKey(...args) {
    const namer = bldrbase.getNamer(args, 'name');
    const paramdefs = [['name', [PlanColumn, types.XsString], true, false], ['column', [PlanExprCol, PlanColumn, types.XsString], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.hasGroupKey', 2, new Set(['name', 'column']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.hasGroupKey', 2, false, paramdefs, args);
    return new PlanAggregateCol('op', 'has-group-key', checkedArgs);

    }
/**
    * This function gets the largest non-null value of the column for the rows in the group or row set. The result is used for building the parameters used by the op:group-by function. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.max|op.max}
    * @method planBuilder#max
    * @since 2.1.1
    * @param { PlanColumnName } [name] - The name to be used for the largest value.
    * @param { PlanExprColName } [column] - The group or row set.
    * @param { PlanValueOption } [option] - The options can take a values key with a distinct value to average the distinct values of the column.
    * @returns { planBuilder.PlanAggregateCol }
    */
max(...args) {
    const namer = bldrbase.getNamer(args, 'name');
    const paramdefs = [['name', [PlanColumn, types.XsString], true, false], ['column', [PlanExprCol, PlanColumn, types.XsString], true, false], ['option', [PlanValueOption], false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.max', 2, new Set(['name', 'column', 'option']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.max', 2, false, paramdefs, args);
    return new PlanAggregateCol('op', 'max', checkedArgs);

    }
/**
    * This function gets the smallest non-null value of the column for the rows in the group or row set. The result is used for building the parameters used by the op:group-by function. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.min|op.min}
    * @method planBuilder#min
    * @since 2.1.1
    * @param { PlanColumnName } [name] - The name to be used for the smallest value.
    * @param { PlanExprColName } [column] - The group or row set.
    * @param { PlanValueOption } [option] - The options can take a values key with a distinct value to average the distinct values of the column.
    * @returns { planBuilder.PlanAggregateCol }
    */
min(...args) {
    const namer = bldrbase.getNamer(args, 'name');
    const paramdefs = [['name', [PlanColumn, types.XsString], true, false], ['column', [PlanExprCol, PlanColumn, types.XsString], true, false], ['option', [PlanValueOption], false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.min', 2, new Set(['name', 'column', 'option']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.min', 2, false, paramdefs, args);
    return new PlanAggregateCol('op', 'min', checkedArgs);

    }
/**
    * This function randomly selects one non-null value of the column from the rows in the group or row set. The result is used for building the parameters used by the op:group-by function. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.sample|op.sample}
    * @method planBuilder#sample
    * @since 2.1.1
    * @param { PlanColumnName } [name] - The name to be used for the value.
    * @param { PlanExprColName } [column] - The group or row set.
    * @returns { planBuilder.PlanAggregateCol }
    */
sample(...args) {
    const namer = bldrbase.getNamer(args, 'name');
    const paramdefs = [['name', [PlanColumn, types.XsString], true, false], ['column', [PlanExprCol, PlanColumn, types.XsString], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.sample', 2, new Set(['name', 'column']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.sample', 2, false, paramdefs, args);
    return new PlanAggregateCol('op', 'sample', checkedArgs);

    }
/**
    * This call constructs a sequence whose items are the values of a column for each row in the group or row set. The result is used for building the parameters used by the op:group-by function. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.sequenceAggregate|op.sequenceAggregate}
    * @method planBuilder#sequenceAggregate
    * @since 2.1.1
    * @param { PlanColumnName } [name] - The name to be used for the aggregated column.
    * @param { PlanExprColName } [column] - The column with the values to aggregate.
    * @param { PlanValueOption } [option] - The options can take a values key with a distinct value to average the distinct values of the column.
    * @returns { planBuilder.PlanAggregateCol }
    */
sequenceAggregate(...args) {
    const namer = bldrbase.getNamer(args, 'name');
    const paramdefs = [['name', [PlanColumn, types.XsString], true, false], ['column', [PlanExprCol, PlanColumn, types.XsString], true, false], ['option', [PlanValueOption], false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.sequenceAggregate', 2, new Set(['name', 'column', 'option']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.sequenceAggregate', 2, false, paramdefs, args);
    return new PlanAggregateCol('op', 'sequence-aggregate', checkedArgs);

    }
/**
    * This function adds the non-null values of the column for the rows in the group or row set. The result is used for building the parameters used by the op:group-by function.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.sum|op.sum}
    * @method planBuilder#sum
    * @since 2.1.1
    * @param { PlanColumnName } [name] - The name to be used for the aggregated column.
    * @param { PlanExprColName } [column] - The column with the values to add.
    * @param { PlanValueOption } [option] - The options can take a values key with a distinct value to average the distinct values of the column.
    * @returns { planBuilder.PlanAggregateCol }
    */
sum(...args) {
    const namer = bldrbase.getNamer(args, 'name');
    const paramdefs = [['name', [PlanColumn, types.XsString], true, false], ['column', [PlanExprCol, PlanColumn, types.XsString], true, false], ['option', [PlanValueOption], false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.sum', 2, new Set(['name', 'column', 'option']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.sum', 2, false, paramdefs, args);
    return new PlanAggregateCol('op', 'sum', checkedArgs);

    }
/**
    * This function processes the values of column for each row in the group or row set with the specified user-defined aggregate as implemented by an aggregate user-defined function (UDF) plugin. The UDF plugin must be installed on each host. The result is used for building the parameters used by the op:group-by function.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.uda|op.uda}
    * @method planBuilder#uda
    * @since 2.1.1
    * @param { PlanColumnName } [name] - The name to be used for the aggregated column.
    * @param { PlanExprColName } [column] - The column with the values to aggregate.
    * @param { XsString } [module] - The path to the installed plugin module.
    * @param { XsString } [function] - The name of the UDF function.
    * @param { XsAnyAtomicType } [arg] - The options can take a values key with a distinct value to average the distinct values of the column and an arg key specifying an argument for the user-defined aggregate. The value can be a string or placeholder parameter.
    * @returns { planBuilder.PlanAggregateCol }
    */
uda(...args) {
    const namer = bldrbase.getNamer(args, 'name');
    const paramdefs = [['name', [PlanColumn, types.XsString], true, false], ['column', [PlanExprCol, PlanColumn, types.XsString], true, false], ['module', [types.XsString], true, false], ['function', [types.XsString], true, false], ['arg', [types.XsAnyAtomicType], false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.uda', 4, new Set(['name', 'column', 'module', 'function', 'arg']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.uda', 4, false, paramdefs, args);
    return new PlanAggregateCol('op', 'uda', checkedArgs);

    }
/**
    * This function sorts the specified columndef in ascending order. The results are used by the op:order-by function. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.asc|op.asc}
    * @method planBuilder#asc
    * @since 2.1.1
    * @param { PlanExprColName } [column] - The column by which order the output.
    * @returns { planBuilder.PlanSortKey }
    */
asc(...args) {
    const paramdef = ['column', [PlanExprCol, PlanColumn, types.XsString], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('PlanBuilder.asc', 1, paramdef, args);
    return new PlanSortKey('op', 'asc', checkedArgs);
    }
/**
    * This function sorts the specified columndef in descending order. The results are used by the op:order-by function. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.desc|op.desc}
    * @method planBuilder#desc
    * @since 2.1.1
    * @param { PlanExprColName } [column] - The column by which order the output.
    * @returns { planBuilder.PlanSortKey }
    */
desc(...args) {
    const paramdef = ['column', [PlanExprCol, PlanColumn, types.XsString], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('PlanBuilder.desc', 1, paramdef, args);
    return new PlanSortKey('op', 'desc', checkedArgs);
    }
/**
    * This function returns the remainder afer the division of the dividend and divisor expressions. For example, op:modulo(5, 2) returns 1. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.modulo|op.modulo}
    * @method planBuilder#modulo
    * @since 2.1.1
    * @param { XsNumeric } [left] - The dividend numeric expression.
    * @param { XsNumeric } [right] - The divisor numeric expression.
    * @returns { XsNumeric }
    */
modulo(...args) {
    const namer = bldrbase.getNamer(args, 'left');
    const paramdefs = [['left', [types.XsNumeric, PlanColumn, PlanParam], true, false], ['right', [types.XsNumeric, PlanColumn, PlanParam], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.modulo', 2, new Set(['left', 'right']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.modulo', 2, false, paramdefs, args);
    return new types.XsNumeric('op', 'modulo', checkedArgs);

    }
/**
    * This function returns the specified valueExpression if the specified valueExpression is true. Otherwise, it returns null. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.case|op.case}
    * @method planBuilder#case
    * @since 2.1.1
    * @param { PlanCase } [when] - One or more op:when expressions.
    * @param { Item } [otherwise] - The value expression to return if none of the op:when expressions is true.
    * @returns { Item }
    */
case(...args) {
    const namer = bldrbase.getNamer(args, 'when');
    const paramdefs = [['when', [PlanCase], true, true], ['otherwise', [types.Item, PlanColumn, PlanParam], false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.case', 2, new Set(['when', 'otherwise']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.case', 2, false, paramdefs, args);
    return new types.Item('op', 'case', checkedArgs);

    }
/**
    * This function executes the specified expression if the specified condition is true for the row. Otherwise, the expression is not executed and the next 'when' test is checked or, if there is no next 'when' text, the otherwise expression for the op:case expression is executed. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.when|op.when}
    * @method planBuilder#when
    * @since 2.1.1
    * @param { XsBoolean } [condition] - A boolean expression.
    * @param { Item } [value] - The value expression to return if the boolean expression is true.
    * @returns { planBuilder.PlanCase }
    */
when(...args) {
    const namer = bldrbase.getNamer(args, 'condition');
    const paramdefs = [['condition', [types.XsBoolean, PlanColumn, PlanParam], true, false], ['value', [types.Item, PlanColumn, PlanParam], false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.when', 2, new Set(['condition', 'value']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.when', 2, false, paramdefs, args);
    return new PlanCase('op', 'when', checkedArgs);

    }
/**
    * This function extracts a sequence of child nodes from a column with node values -- especially, the document nodes from a document join. The path is an XPath (specified as a string) to apply to each node to generate a sequence of nodes as an expression value. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.xpath|op.xpath}
    * @method planBuilder#xpath
    * @since 2.1.1
    * @param { PlanColumnName } [column] - The name of the column from which to extract the child nodes.
    * @param { XsString } [path] - An XPath (specified as a string) to apply to each node.
    * @returns { Node }
    */
xpath(...args) {
    const namer = bldrbase.getNamer(args, 'column');
    const paramdefs = [['column', [PlanColumn, types.XsString], true, false], ['path', [types.XsString, PlanColumn, PlanParam], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.xpath', 2, new Set(['column', 'path']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.xpath', 2, false, paramdefs, args);
    return new types.Node('op', 'xpath', checkedArgs);

    }
/**
    * This function constructs a JSON document with the root content, which must be exactly one JSON object or array node. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.jsonDocument|op.jsonDocument}
    * @method planBuilder#jsonDocument
    * @since 2.1.1
    * @param { JsonRootNode } [root] - The JSON object or array node used to construct the JSON document.
    * @returns { DocumentNode }
    */
jsonDocument(...args) {
    const paramdef = ['root', [types.JsonRootNode, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('PlanBuilder.jsonDocument', 1, paramdef, args);
    return new types.DocumentNode('op', 'json-document', checkedArgs);
    }
/**
    * This function constructs a JSON object with the specified properties. The object can be used as the value of a column in a row or passed to a builtin function. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.jsonObject|op.jsonObject}
    * @method planBuilder#jsonObject
    * @since 2.1.1
    * @param { PlanJsonProperty } [property] - The properties to be used to contruct the object. This is constructed by the op:prop function.
    * @returns { ObjectNode }
    */
jsonObject(...args) {
    const paramdef = ['property', [PlanJsonProperty], false, true];
    const checkedArgs = bldrbase.makeSingleArgs('PlanBuilder.jsonObject', 0, paramdef, args);
    return new types.ObjectNode('op', 'json-object', checkedArgs);
    }
/**
    * This function specifies the key expression and value content for a JSON property of a JSON object constructed by the op:json-object function. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.prop|op.prop}
    * @method planBuilder#prop
    * @since 2.1.1
    * @param { XsString } [key] - The key expression. This must evaluate to a string.
    * @param { PlanJsonContentVal } [value] - The value content. This must be exactly one JSON node expression.
    * @returns { planBuilder.PlanJsonProperty }
    */
prop(...args) {
    const namer = bldrbase.getNamer(args, 'key');
    const paramdefs = [['key', [types.XsString, PlanColumn, PlanParam], true, false], ['value', [types.JsonContentNode, types.XsAnyAtomicType, PlanColumn, PlanParam], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.prop', 2, new Set(['key', 'value']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.prop', 2, false, paramdefs, args);
    return new PlanJsonProperty('op', 'prop', checkedArgs);

    }
/**
    * This function constructs a JSON array during row processing. The array can be used as the value of a column in a row or passed to a builtin expression function. The node is constructed during processing of the plan, rather than when building the plan. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.jsonArray|op.jsonArray}
    * @method planBuilder#jsonArray
    * @since 2.1.1
    * @param { PlanJsonContentVal } [property] - The JSON nodes for the array.
    * @returns { ArrayNode }
    */
jsonArray(...args) {
    const paramdef = ['property', [types.JsonContentNode, types.XsAnyAtomicType, PlanColumn, PlanParam], false, true];
    const checkedArgs = bldrbase.makeSingleArgs('PlanBuilder.jsonArray', 0, paramdef, args);
    return new types.ArrayNode('op', 'json-array', checkedArgs);
    }
/**
    * This function constructs a JSON text node with the specified value. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.jsonString|op.jsonString}
    * @method planBuilder#jsonString
    * @since 2.1.1
    * @param { XsAnyAtomicType } [value] - The value of the JSON text node.
    * @returns { TextNode }
    */
jsonString(...args) {
    const paramdef = ['value', [types.XsAnyAtomicType, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('PlanBuilder.jsonString', 1, paramdef, args);
    return new types.TextNode('op', 'json-string', checkedArgs);
    }
/**
    * This function constructs a JSON number node with the specified value. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.jsonNumber|op.jsonNumber}
    * @method planBuilder#jsonNumber
    * @since 2.1.1
    * @param { XsNumeric } [value] - The value of the JSON number node.
    * @returns { NumberNode }
    */
jsonNumber(...args) {
    const paramdef = ['value', [types.XsNumeric, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('PlanBuilder.jsonNumber', 1, paramdef, args);
    return new types.NumberNode('op', 'json-number', checkedArgs);
    }
/**
    * This function constructs a JSON boolean node with the specified value. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.jsonBoolean|op.jsonBoolean}
    * @method planBuilder#jsonBoolean
    * @since 2.1.1
    * @param { XsBoolean } [value] - The value of the JSON boolean node.
    * @returns { BooleanNode }
    */
jsonBoolean(...args) {
    const paramdef = ['value', [types.XsBoolean, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('PlanBuilder.jsonBoolean', 1, paramdef, args);
    return new types.BooleanNode('op', 'json-boolean', checkedArgs);
    }
/**
    * This function constructs a JSON null node. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.jsonNull|op.jsonNull}
    * @method planBuilder#jsonNull
    * @since 2.1.1

    * @returns { NullNode }
    */
jsonNull(...args) {
    bldrbase.checkMaxArity('PlanBuilder.jsonNull', args.length, 0);
    return new types.NullNode('op', 'json-null', args);
    }
/**
    * This function constructs an XML document with the root content, which must be exactly one node. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.xmlDocument|op.xmlDocument}
    * @method planBuilder#xmlDocument
    * @since 2.1.1
    * @param { XmlRootNode } [root] - The XML node used to construct the XML document.
    * @returns { DocumentNode }
    */
xmlDocument(...args) {
    const paramdef = ['root', [types.XmlRootNode, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('PlanBuilder.xmlDocument', 1, paramdef, args);
    return new types.DocumentNode('op', 'xml-document', checkedArgs);
    }
/**
    * This function constructs an XML element with the name (which can be a string or QName), zero or more attributes, and child content. The child content can include a sequence or array of atomic values or an element, comment, or processing instruction nodes. Atomic values are converted to text nodes. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.xmlElement|op.xmlElement}
    * @method planBuilder#xmlElement
    * @since 2.1.1
    * @param { PlanQualifiableName } [name] - The string or QName for the constructed element.
    * @param { AttributeNode } [attributes] - Any element attributes returned from op:xml-attribute, or null if no attributes.
    * @param { PlanXmlContentVal } [content] - A sequence or array of atomic values or an element, a comment from op:xml-comment, or processing instruction nodes from op:xml-pi.
    * @returns { ElementNode }
    */
xmlElement(...args) {
    const namer = bldrbase.getNamer(args, 'name');
    const paramdefs = [['name', [types.XsQName, types.XsString, PlanColumn, PlanParam], true, false], ['attributes', [types.AttributeNode, PlanColumn, PlanParam], false, true], ['content', [types.XmlContentNode, types.XsAnyAtomicType, PlanColumn, PlanParam], false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.xmlElement', 1, new Set(['name', 'attributes', 'content']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.xmlElement', 1, false, paramdefs, args);
    return new types.ElementNode('op', 'xml-element', checkedArgs);

    }
/**
    * This function constructs an XML attribute with the name (which can be a string or QName) and atomic value. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.xmlAttribute|op.xmlAttribute}
    * @method planBuilder#xmlAttribute
    * @since 2.1.1
    * @param { PlanQualifiableName } [name] - The attribute name.
    * @param { XsAnyAtomicType } [value] - The attribute value.
    * @returns { AttributeNode }
    */
xmlAttribute(...args) {
    const namer = bldrbase.getNamer(args, 'name');
    const paramdefs = [['name', [types.XsQName, types.XsString, PlanColumn, PlanParam], true, false], ['value', [types.XsAnyAtomicType, PlanColumn, PlanParam], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.xmlAttribute', 2, new Set(['name', 'value']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.xmlAttribute', 2, false, paramdefs, args);
    return new types.AttributeNode('op', 'xml-attribute', checkedArgs);

    }
/**
    * This function constructs an XML text node with the specified value. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.xmlText|op.xmlText}
    * @method planBuilder#xmlText
    * @since 2.1.1
    * @param { XsAnyAtomicType } [value] - The value of the XML text node.
    * @returns { TextNode }
    */
xmlText(...args) {
    const paramdef = ['value', [types.XsAnyAtomicType, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('PlanBuilder.xmlText', 1, paramdef, args);
    return new types.TextNode('op', 'xml-text', checkedArgs);
    }
/**
    * This function constructs an XML comment with the atomic value. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.xmlComment|op.xmlComment}
    * @method planBuilder#xmlComment
    * @since 2.1.1
    * @param { XsAnyAtomicType } [content] - The comment text.
    * @returns { CommentNode }
    */
xmlComment(...args) {
    const paramdef = ['content', [types.XsAnyAtomicType, PlanColumn, PlanParam], true, false];
    const checkedArgs = bldrbase.makeSingleArgs('PlanBuilder.xmlComment', 1, paramdef, args);
    return new types.CommentNode('op', 'xml-comment', checkedArgs);
    }
/**
    * This function constructs an XML processing instruction with the atomic value. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xmlPI|xmlPI}
    * @method planBuilder#xmlPi
    * @since 2.1.1
    * @param { XsString } [name] - The name of the processing instruction.
    * @param { XsAnyAtomicType } [value] - The value of the processing instruction.
    * @returns { ProcessingInstructionNode }
    */
xmlPi(...args) {
    const namer = bldrbase.getNamer(args, 'name');
    const paramdefs = [['name', [types.XsString, PlanColumn, PlanParam], true, false], ['value', [types.XsAnyAtomicType, PlanColumn, PlanParam], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.xmlPi', 2, new Set(['name', 'value']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.xmlPi', 2, false, paramdefs, args);
    return new types.ProcessingInstructionNode('op', 'xml-pi', checkedArgs);

    }
/**
    *  Provides a client interface to a server function.
    * @method planBuilder#resolveFunction
    * @since 2.1.1
    * @param { PlanQualifiableName } [functionName] - 
    * @param { XsString } [modulePath] - 
    * @returns { planBuilder.PlanFunction }
    */
resolveFunction(...args) {
    const namer = bldrbase.getNamer(args, 'functionName');
    const paramdefs = [['functionName', [types.XsQName, types.XsString], true, false], ['modulePath', [types.XsString], true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.resolveFunction', 2, new Set(['functionName', 'modulePath']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.resolveFunction', 2, false, paramdefs, args);
    return new PlanFunction('op', 'resolve-function', checkedArgs);

    }
}

module.exports = {
  PlanBuilder: PlanBuilder,
CtsExpr: CtsExpr,
FnExpr: FnExpr,
GeoExpr: GeoExpr,
JsonExpr: JsonExpr,
MapExpr: MapExpr,
MathExpr: MathExpr,
RdfExpr: RdfExpr,
SemExpr: SemExpr,
SpellExpr: SpellExpr,
SqlExpr: SqlExpr,
XdmpExpr: XdmpExpr,
XsExpr: XsExpr,
  Plan:        PlanPlan,
  AccessPlan:  PlanAccessPlan,
  PlanColumn:  PlanColumn,
  PlanExprCol: PlanExprCol
};
