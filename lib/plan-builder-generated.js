/*
 * Copyright 2017 MarkLogic Corporation
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
    * Returns a query specifying the set difference of the matches specified by two sub-queries. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.andNotQuery|cts.andNotQuery}
    * @method planBuilder.cts#andNotQuery
    * @since 2.1.1
    * @param { CtsQuery } [positiveQuery] - A positive query, specifying the search results filtered in.
    * @param { CtsQuery } [negativeQuery] - A negative query, specifying the search results to filter out.
    * @returns { CtsQuery }
    */
andNotQuery(...args) {
    const namer = bldrbase.getNamer(args, 'positive-query');
    const paramdefs = [['positive-query', types.CtsQuery, true, false], ['negative-query', types.CtsQuery, true, false]];
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
    * @param { XsString } [options] - Options to this query. The default is (). <p> Options include:</p> <blockquote><dl> <dt>"ordered"</dt> <dd>An ordered and-query, which specifies that the sub-query matches must occur in the order of the specified sub-queries. For example, if the sub-queries are "cat" and "dog", an ordered query will only match fragments where both "cat" and "dog" occur, and where "cat" comes before "dog" in the fragment.</dd> <dt>"unordered"</dt> <dd>An unordered and-query, which specifies that the sub-query matches can occur in any order. </dd> </dl></blockquote>
    * @returns { CtsQuery }
    */
andQuery(...args) {
    const namer = bldrbase.getNamer(args, 'queries');
    const paramdefs = [['queries', types.CtsQuery, false, true], ['options', types.XsString, false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.andQuery', 1, new Set(['queries', 'options']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.andQuery', 1, false, paramdefs, args);
    return new types.CtsQuery('cts', 'and-query', checkedArgs);

    }
/**
    * Returns a query specifying that matches to <code>$matching-query</code> should have their search relevance scores boosted if they also match <code>$boosting-query</code>. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.boostQuery|cts.boostQuery}
    * @method planBuilder.cts#boostQuery
    * @since 2.1.1
    * @param { CtsQuery } [matchingQuery] - A sub-query that is used for match and scoring.
    * @param { CtsQuery } [boostingQuery] - A sub-query that is used only for boosting score.
    * @returns { CtsQuery }
    */
boostQuery(...args) {
    const namer = bldrbase.getNamer(args, 'matching-query');
    const paramdefs = [['matching-query', types.CtsQuery, true, false], ['boosting-query', types.CtsQuery, true, false]];
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
    const paramdefs = [['south', types.XsDouble, true, false], ['west', types.XsDouble, true, false], ['north', types.XsDouble, true, false], ['east', types.XsDouble, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.box', 4, new Set(['south', 'west', 'north', 'east']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.box', 4, false, paramdefs, args);
    return new types.CtsBox('cts', 'box', checkedArgs);

    }
/**
    * Returns a geospatial circle value. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.circle|cts.circle}
    * @method planBuilder.cts#circle
    * @since 2.1.1
    * @param { XsDouble } [radius] - The radius of the circle. The units for the radius is determined at runtime by the <code>cts:query</code> options (miles is currently the only option).
    * @param { CtsPoint } [center] - A point representing the center of the circle.
    * @returns { CtsCircle }
    */
circle(...args) {
    const namer = bldrbase.getNamer(args, 'radius');
    const paramdefs = [['radius', types.XsDouble, true, false], ['center', types.CtsPoint, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.circle', 2, new Set(['radius', 'center']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.circle', 2, false, paramdefs, args);
    return new types.CtsCircle('cts', 'circle', checkedArgs);

    }
/**
    * Returns a query matching documents in the collections with the given URIs. It will match both documents and properties documents in the collections with the given URIs. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.collectionQuery|cts.collectionQuery}
    * @method planBuilder.cts#collectionQuery
    * @since 2.1.1
    * @param { XsString } [uris] - One or more collection URIs.
    * @returns { CtsQuery }
    */
collectionQuery(...args) {
    const paramdef = ['uris', types.XsString, false, true];
    const checkedArgs = bldrbase.makeSingleArgs('cts.collectionQuery', 1, paramdef, args);
    return new types.CtsQuery('cts', 'collection-query', checkedArgs);
    }
/**
    * Creates a reference to the collection lexicon, for use as a parameter to cts:value-tuples. Since lexicons are implemented with range indexes, this function will throw an exception if the specified range index does not exist. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.collectionReference|cts.collectionReference}
    * @method planBuilder.cts#collectionReference
    * @since 2.1.1
    * @param { XsString } [options] - Options. The default is (). <p> Options include:</p> <blockquote><dl> <dt>"nullable"</dt> <dd>Allow null values in tuples reported from cts:value-tuples when using this lexicon.</dd> <dt>"unchecked"</dt> <dd>Do not check the definition against the context database.</dd> </dl></blockquote>
    * @returns { CtsReference }
    */
collectionReference(...args) {
    const paramdef = ['options', types.XsString, false, true];
    const checkedArgs = bldrbase.makeSingleArgs('cts.collectionReference', 0, paramdef, args);
    return new types.CtsReference('cts', 'collection-reference', checkedArgs);
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
    const paramdefs = [['uris', types.XsString, false, true], ['depth', types.XsString, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.directoryQuery', 1, new Set(['uris', 'depth']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.directoryQuery', 1, false, paramdefs, args);
    return new types.CtsQuery('cts', 'directory-query', checkedArgs);

    }
/**
    * Returns a query that matches all documents where <code>$query</code> matches any document fragment. When searching documents, document-properties, or document-locks, <code>cts:document-fragment-query</code> provides a convenient way to additionally constrain the search against any document fragment. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.documentFragmentQuery|cts.documentFragmentQuery}
    * @method planBuilder.cts#documentFragmentQuery
    * @since 2.1.1
    * @param { CtsQuery } [query] - A query to be matched against any document fragment.
    * @returns { CtsQuery }
    */
documentFragmentQuery(...args) {
    const paramdef = ['query', types.CtsQuery, true, false];
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
    const paramdef = ['uris', types.XsString, false, true];
    const checkedArgs = bldrbase.makeSingleArgs('cts.documentQuery', 1, paramdef, args);
    return new types.CtsQuery('cts', 'document-query', checkedArgs);
    }
/**
    * Returns a <code>cts:query</code> matching elements by name which has specific attributes representing latitude and longitude values for a point contained within the given geographic box, circle, or polygon, or equal to the given point. Points that lie between the southern boundary and the northern boundary of a box, travelling northwards, and between the western boundary and the eastern boundary of the box, travelling eastwards, will match. Points contained within the given radius of the center point of a circle will match, using the curved distance on the surface of the Earth. Points contained within the given polygon will match, using great circle arcs over a spherical model of the Earth as edges. An error may result if the polygon is malformed in some way. Points equal to the a given point will match, taking into account the fact that longitudes converge at the poles. Using the geospatial query constructors requires a valid geospatial license key; without a valid license key, searches that include geospatial queries will throw an exception. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.elementAttributePairGeospatialQuery|cts.elementAttributePairGeospatialQuery}
    * @method planBuilder.cts#elementAttributePairGeospatialQuery
    * @since 2.1.1
    * @param { XsQName } [elementName] - One or more parent element QNames to match. When multiple QNames are specified, the query matches if any QName matches.
    * @param { XsQName } [latitudeAttributeNames] - One or more latitude attribute QNames to match. When multiple QNames are specified, the query matches if any QName matches; however, only the first matching latitude attribute in any point instance will be checked.
    * @param { XsQName } [longitudeAttributeNames] - One or more longitude attribute QNames to match. When multiple QNames are specified, the query matches if any QName matches; however, only the first matching longitude attribute in any point instance will be checked.
    * @param { CtsRegion } [regions] - One or more geographic boxes, circles, polygons, or points. Where multiple regions are specified, the query matches if any region matches.
    * @param { XsString } [options] - Options to this query. The default is (). <p>Options include:</p> <blockquote> <dl> <dt>"coordinate-system=<var>string</var>"</dt> <dd>Use the given coordinate system. Valid values are: <dl> <dt>wgs84</dt><dd>The WGS84 coordinate system.</dd> <dt>wgs84/double</dt><dd>The WGS84 coordinate system at double precision.</dd> <dt>etrs89</dt><dd>The ETRS89 coordinate system.</dd> <dt>etrs89/double</dt><dd>The ETRS89 coordinate system at double precision.</dd> <dt>raw</dt><dd>The raw (unmapped) coordinate system.</dd> <dt>raw/double</dt><dd>The raw coordinate system at double precision.</dd> </dl> </dd> <dt>"precision=<em>value</em>"</dt> <dd>Use the coordinate system at the given precision. Allowed values: <code>float</code> and <code>double</code>.</dd> <dt>"units=<em>value</em>"</dt> <dd>Measure distance and the radii of circles in the specified units. Allowed values: <code>miles</code> (default), <code>km</code>, <code>feet</code>, <code>meters</code>.</dd> <dt>"boundaries-included"</dt> <dd>Points on boxes', circles', and polygons' boundaries are counted as matching. This is the default.</dd> <dt>"boundaries-excluded"</dt> <dd>Points on boxes', circles', and polygons' boundaries are not counted as matching.</dd> <dt>"boundaries-latitude-excluded"</dt> <dd>Points on boxes' latitude boundaries are not counted as matching.</dd> <dt>"boundaries-longitude-excluded"</dt> <dd>Points on boxes' longitude boundaries are not counted as matching.</dd> <dt>"boundaries-south-excluded"</dt> <dd>Points on the boxes' southern boundaries are not counted as matching.</dd> <dt>"boundaries-west-excluded"</dt> <dd>Points on the boxes' western boundaries are not counted as matching.</dd> <dt>"boundaries-north-excluded"</dt> <dd>Points on the boxes' northern boundaries are not counted as matching.</dd> <dt>"boundaries-east-excluded"</dt> <dd>Points on the boxes' eastern boundaries are not counted as matching.</dd> <dt>"boundaries-circle-excluded"</dt> <dd>Points on circles' boundary are not counted as matching.</dd> <dt>"boundaries-endpoints-excluded"</dt> <dd>Points on linestrings' boundary (the endpoints) are not counted as matching.</dd> <dt>"cached"</dt> <dd>Cache the results of this query in the list cache.</dd> <dt>"uncached"</dt> <dd>Do not cache the results of this query in the list cache.</dd> <dt>"score-function=<em>function</em>"</dt> <dd>Use the selected scoring function. The score function may be: <dl> <dt>linear</dt><dd>Use a linear function of the difference between the specified query value and the matching value in the index to calculate a score for this range query.</dd> <dt>reciprocal</dt><dd>Use a reciprocal function of the difference between the specified query value and the matching value in the index to calculate a score for this range query.</dd> <dt>zero</dt><dd>This range query does not contribute to the score. This is the default.</dd> </dl> </dd> <dt>"slope-factor=<em>number</em>"</dt> <dd>Apply the given number as a scaling factor to the slope of the scoring function. The default is 1.0.</dd> <dt>"synonym"</dt> <dd>Specifies that all of the terms in the $regions parameter are considered synonyms for scoring purposes. The result is that occurances of more than one of the synonyms are scored as if there are more occurance of the same term (as opposed to having a separate term that contributes to score). </dd> </dl></blockquote>
    * @param { XsDouble } [weight] - A weight for this query. The default is 1.0.
    * @returns { CtsQuery }
    */
elementAttributePairGeospatialQuery(...args) {
    const namer = bldrbase.getNamer(args, 'element-name');
    const paramdefs = [['element-name', types.XsQName, false, true], ['latitude-attribute-names', types.XsQName, false, true], ['longitude-attribute-names', types.XsQName, false, true], ['regions', types.CtsRegion, false, true], ['options', types.XsString, false, true], ['weight', types.XsDouble, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.elementAttributePairGeospatialQuery', 4, new Set(['element-name', 'latitude-attribute-names', 'longitude-attribute-names', 'regions', 'options', 'weight']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.elementAttributePairGeospatialQuery', 4, false, paramdefs, args);
    return new types.CtsQuery('cts', 'element-attribute-pair-geospatial-query', checkedArgs);

    }
/**
    * Returns a <code>cts:query</code> matching element-attributes by name with a range-index entry equal to a given value. Searches with the <code>cts:element-attribute-range-query</code> constructor require an attribute range index on the specified QName(s); if there is no range index configured, then an exception is thrown. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.elementAttributeRangeQuery|cts.elementAttributeRangeQuery}
    * @method planBuilder.cts#elementAttributeRangeQuery
    * @since 2.1.1
    * @param { XsQName } [elementName] - One or more element QNames to match. When multiple QNames are specified, the query matches if any QName matches.
    * @param { XsQName } [attributeName] - One or more attribute QNames to match. When multiple QNames are specified, the query matches if any QName matches.
    * @param { XsString } [operator] - A comparison operator. <p> Operators include:</p> <blockquote><dl> <dt>"<"</dt> <dd>Match range index values less than $value.</dd> <dt>"<="</dt> <dd>Match range index values less than or equal to $value.</dd> <dt>">"</dt> <dd>Match range index values greater than $value.</dd> <dt>">="</dt> <dd>Match range index values greater than or equal to $value.</dd> <dt>"="</dt> <dd>Match range index values equal to $value.</dd> <dt>"!="</dt> <dd>Match range index values not equal to $value.</dd> </dl></blockquote>
    * @param { XsAnyAtomicType } [value] - Some values to match. When multiple values are specified, the query matches if any value matches.
    * @param { XsString } [options] - Options to this query. The default is (). <p> Options include:</p> <blockquote><dl> <dt>"collation=<em>URI</em>"</dt> <dd>Use the range index with the collation specified by <em>URI</em>. If not specified, then the default collation from the query is used. If a range index with the specified collation does not exist, an error is thrown.</dd> <dt>"cached"</dt> <dd>Cache the results of this query in the list cache.</dd> <dt>"uncached"</dt> <dd>Do not cache the results of this query in the list cache.</dd> <dt>"min-occurs=<em>number</em>"</dt> <dd>Specifies the minimum number of occurrences required. If fewer that this number of words occur, the fragment does not match. The default is 1.</dd> <dt>"max-occurs=<em>number</em>"</dt> <dd>Specifies the maximum number of occurrences required. If more than this number of words occur, the fragment does not match. The default is unbounded.</dd> <dt>"score-function=<em>function</em>"</dt> <dd>Use the selected scoring function. The score function may be: <dl> <dt>linear</dt><dd>Use a linear function of the difference between the specified query value and the matching value in the index to calculate a score for this range query.</dd> <dt>reciprocal</dt><dd>Use a reciprocal function of the difference between the specified query value and the matching value in the index to calculate a score for this range query.</dd> <dt>zero</dt><dd>This range query does not contribute to the score. This is the default.</dd> </dl> </dd> <dt>"slope-factor=<em>number</em>"</dt> <dd>Apply the given number as a scaling factor to the slope of the scoring function. The default is 1.0.</dd> <dt>"synonym"</dt> <dd>Specifies that all of the terms in the $value parameter are considered synonyms for scoring purposes. The result is that occurrences of more than one of the synonyms are scored as if there are more occurrences of the same term (as opposed to having a separate term that contributes to score). </dd> </dl></blockquote>
    * @param { XsDouble } [weight] - A weight for this query. The default is 1.0.
    * @returns { CtsQuery }
    */
elementAttributeRangeQuery(...args) {
    const namer = bldrbase.getNamer(args, 'element-name');
    const paramdefs = [['element-name', types.XsQName, false, true], ['attribute-name', types.XsQName, false, true], ['operator', types.XsString, true, false], ['value', types.XsAnyAtomicType, false, true], ['options', types.XsString, false, true], ['weight', types.XsDouble, false, false]];
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
    * @param { XsString } [options] - Options. The default is (). <p> Options include:</p> <blockquote><dl> <dt>"type=<em>type</em>"</dt> <dd>Use the lexicon with the type specified by <em>type</em> (int, unsignedInt, long, unsignedLong, float, double, decimal, dateTime, time, date, gYearMonth, gYear, gMonth, gDay, yearMonthDuration, dayTimeDuration, string, anyURI, point, or long-lat-point)</dd> <dt>"collation=<em>URI</em>"</dt> <dd>Use the lexicon with the collation specified by <em>URI</em>.</dd> <dt>"nullable"</dt> <dd>Allow null values in tuples reported from cts:value-tuples when using this lexicon.</dd> <dt>"unchecked"</dt> <dd>Read the scalar type, collation and coordinate-system info only from the input. Do not check the definition against the context database.</dd> <dt>"coordinate-system=<em>name</em>"</dt> <dd>Create a reference to an index or lexicon based on the specified coordinate system. Allowed values: "wgs84", "wgs84/double", "raw", "raw/double". Only applicable if the index/lexicon value type is <code>point</code> or <code>long-lat-point</code>.</dd> <dt>"precision=<em>value</em>"</dt> <dd>Create a reference to an index or lexicon configured with the specified geospatial precision. Allowed values: <code>float</code> and <code>double</code>. Only applicable if the index/lexicon value type is <code>point</code> or <code>long-lat-point</code>. This value takes precedence over the precision implicit in the coordinate system name.</dd> </dl></blockquote>
    * @returns { CtsReference }
    */
elementAttributeReference(...args) {
    const namer = bldrbase.getNamer(args, 'element');
    const paramdefs = [['element', types.XsQName, true, false], ['attribute', types.XsQName, true, false], ['options', types.XsString, false, true]];
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
    * @param { XsString } [options] - Options to this query. The default is (). <p> Options include:</p> <blockquote><dl> <dt>"case-sensitive"</dt> <dd>A case-sensitive query.</dd> <dt>"case-insensitive"</dt> <dd>A case-insensitive query.</dd> <dt>"diacritic-sensitive"</dt> <dd>A diacritic-sensitive query.</dd> <dt>"diacritic-insensitive"</dt> <dd>A diacritic-insensitive query.</dd> <dt>"punctuation-sensitive"</dt> <dd>A punctuation-sensitive query.</dd> <dt>"punctuation-insensitive"</dt> <dd>A punctuation-insensitive query.</dd> <dt>"whitespace-sensitive"</dt> <dd>A whitespace-sensitive query.</dd> <dt>"whitespace-insensitive"</dt> <dd>A whitespace-insensitive query.</dd> <dt>"stemmed"</dt> <dd>A stemmed query.</dd> <dt>"unstemmed"</dt> <dd>An unstemmed query.</dd> <dt>"wildcarded"</dt> <dd>A wildcarded query.</dd> <dt>"unwildcarded"</dt> <dd>An unwildcarded query.</dd> <dt>"exact"</dt> <dd>An exact match query. Shorthand for "case-sensitive", "diacritic-sensitive", "punctuation-sensitive", "whitespace-sensitive", "unstemmed", and "unwildcarded". </dd> <dt>"lang=<em>iso639code</em>"</dt> <dd>Specifies the language of the query. The <em>iso639code</em> code portion is case-insensitive, and uses the languages specified by <a>ISO 639</a>. The default is specified in the database configuration.</dd> <dt>"min-occurs=<em>number</em>"</dt> <dd>Specifies the minimum number of occurrences required. If fewer that this number of words occur, the fragment does not match. The default is 1.</dd> <dt>"max-occurs=<em>number</em>"</dt> <dd>Specifies the maximum number of occurrences required. If more than this number of words occur, the fragment does not match. The default is unbounded.</dd> <dt>"synonym"</dt> <dd>Specifies that all of the terms in the $text parameter are considered synonyms for scoring purposes. The result is that occurrences of more than one of the synonyms are scored as if there are more occurrences of the same term (as opposed to having a separate term that contributes to score). </dd> * <dt>"lexicon-expansion-limit=<em>number</em>"</dt> <dd>Specifies the limit for lexicon expansion. This puts a restriction on the number of lexicon expansions that can be performed. If the limit is exceeded, the server may raise an error depending on whether the "limit-check" option is set. The default value for this option will be 4096. </dd> <dt>"limit-check"</dt> <dd>Specifies that an error will be raised if the lexicon expansion exceeds the specified limit.</dd> <dt>"no-limit-check"</dt> <dd>Specifies that error will not be raised if the lexicon expansion exceeds the specified limit. The server will try to resolve the wildcard. </dd> </dl></blockquote>
    * @param { XsDouble } [weight] - A weight for this query. Higher weights move search results up in the relevance order. The default is 1.0. The weight should be between 64 and -16. Weights greater than 64 will have the same effect as a weight of 64. Weights less than the absolute value of 0.0625 (between -0.0625 and 0.0625) are rounded to 0, which means that they do not contribute to the score.
    * @returns { CtsQuery }
    */
elementAttributeValueQuery(...args) {
    const namer = bldrbase.getNamer(args, 'element-name');
    const paramdefs = [['element-name', types.XsQName, false, true], ['attribute-name', types.XsQName, false, true], ['text', types.XsString, false, true], ['options', types.XsString, false, true], ['weight', types.XsDouble, false, false]];
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
    * @param { XsString } [options] - Options to this query. The default is (). <p> Options include:</p> <blockquote><dl> <dt>"case-sensitive"</dt> <dd>A case-sensitive query.</dd> <dt>"case-insensitive"</dt> <dd>A case-insensitive query.</dd> <dt>"diacritic-sensitive"</dt> <dd>A diacritic-sensitive query.</dd> <dt>"diacritic-insensitive"</dt> <dd>A diacritic-insensitive query.</dd> <dt>"punctuation-sensitive"</dt> <dd>A punctuation-sensitive query.</dd> <dt>"punctuation-insensitive"</dt> <dd>A punctuation-insensitive query.</dd> <dt>"whitespace-sensitive"</dt> <dd>A whitespace-sensitive query.</dd> <dt>"whitespace-insensitive"</dt> <dd>A whitespace-insensitive query.</dd> <dt>"stemmed"</dt> <dd>A stemmed query.</dd> <dt>"unstemmed"</dt> <dd>An unstemmed query.</dd> <dt>"wildcarded"</dt> <dd>A wildcarded query.</dd> <dt>"unwildcarded"</dt> <dd>An unwildcarded query.</dd> <dt>"exact"</dt> <dd>An exact match query. Shorthand for "case-sensitive", "diacritic-sensitive", "punctuation-sensitive", "whitespace-sensitive", "unstemmed", and "unwildcarded". </dd> <dt>"lang=<em>iso639code</em>"</dt> <dd>Specifies the language of the query. The <em>iso639code</em> code portion is case-insensitive, and uses the languages specified by <a>ISO 639</a>. The default is specified in the database configuration.</dd> <dt>"min-occurs=<em>number</em>"</dt> <dd>Specifies the minimum number of occurrences required. If fewer that this number of words occur, the fragment does not match. The default is 1.</dd> <dt>"max-occurs=<em>number</em>"</dt> <dd>Specifies the maximum number of occurrences required. If more than this number of words occur, the fragment does not match. The default is unbounded.</dd> <dt>"synonym"</dt> <dd>Specifies that all of the terms in the $text parameter are considered synonyms for scoring purposes. The result is that occurrences of more than one of the synonyms are scored as if there are more occurrences of the same term (as opposed to having a separate term that contributes to score). </dd> <dt>"lexicon-expand=<em>value</em>"</dt> <dd>The <em>value</em> is one of <code>full</code>, <code>prefix-postfix</code>, <code>off</code>, or <code>heuristic</code> (the default is <code>heuristic</code>). An option with a value of <code>lexicon-expand=full</code> specifies that wildcards are resolved by expanding the pattern to words in a lexicon (if there is one available), and turning into a series of <code>cts:word-queries</code>, even if this takes a long time to evaluate. An option with a value of <code>lexicon-expand=prefix-postfix</code> specifies that wildcards are resolved by expanding the pattern to the pre- and postfixes of the words in the word lexicon (if there is one), and turning the query into a series of character queries, even if it takes a long time to evaluate. An option with a value of <code>lexicon-expand=off</code> specifies that wildcards are only resolved by looking up character patterns in the search pattern index, not in the lexicon. An option with a value of <code>lexicon-expand=heuristic</code>, which is the default, specifies that wildcards are resolved by using a series of internal rules, such as estimating the number of lexicon entries that need to be scanned, seeing if the estimate crosses certain thresholds, and (if appropriate), using another way besides lexicon expansion to resolve the query. </dd> * <dt>"lexicon-expansion-limit=<em>number</em>"</dt> <dd>Specifies the limit for lexicon expansion. This puts a restriction on the number of lexicon expansions that can be performed. If the limit is exceeded, the server may raise an error depending on whether the "limit-check" option is set. The default value for this option will be 4096. </dd> <dt>"limit-check"</dt> <dd>Specifies that an error will be raised if the lexicon expansion exceeds the specified limit.</dd> <dt>"no-limit-check"</dt> <dd>Specifies that error will not be raised if the lexicon expansion exceeds the specified limit. The server will try to resolve the wildcard. </dd> </dl></blockquote>
    * @param { XsDouble } [weight] - A weight for this query. Higher weights move search results up in the relevance order. The default is 1.0. The weight should be between 64 and -16. Weights greater than 64 will have the same effect as a weight of 64. Weights less than the absolute value of 0.0625 (between -0.0625 and 0.0625) are rounded to 0, which means that they do not contribute to the score.
    * @returns { CtsQuery }
    */
elementAttributeWordQuery(...args) {
    const namer = bldrbase.getNamer(args, 'element-name');
    const paramdefs = [['element-name', types.XsQName, false, true], ['attribute-name', types.XsQName, false, true], ['text', types.XsString, false, true], ['options', types.XsString, false, true], ['weight', types.XsDouble, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.elementAttributeWordQuery', 3, new Set(['element-name', 'attribute-name', 'text', 'options', 'weight']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.elementAttributeWordQuery', 3, false, paramdefs, args);
    return new types.CtsQuery('cts', 'element-attribute-word-query', checkedArgs);

    }
/**
    * Returns a <code>cts:query</code> matching elements by name which has specific element children representing latitude and longitude values for a point contained within the given geographic box, circle, or polygon, or equal to the given point. Points that lie between the southern boundary and the northern boundary of a box, travelling northwards, and between the western boundary and the eastern boundary of the box, travelling eastwards, will match. Points contained within the given radius of the center point of a circle will match, using the curved distance on the surface of the Earth. Points contained within the given polygon will match, using great circle arcs over a spherical model of the Earth as edges. An error may result if the polygon is malformed in some way. Points equal to the a given point will match, taking into account the fact that longitudes converge at the poles. Using the geospatial query constructors requires a valid geospatial license key; without a valid license key, searches that include geospatial queries will throw an exception. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.elementChildGeospatialQuery|cts.elementChildGeospatialQuery}
    * @method planBuilder.cts#elementChildGeospatialQuery
    * @since 2.1.1
    * @param { XsQName } [parentElementName] - One or more parent element QNames to match. When multiple QNames are specified, the query matches if any QName matches.
    * @param { XsQName } [childElementNames] - One or more child element QNames to match. When multiple QNames are specified, the query matches if any QName matches; however, only the first matching latitude child in any point instance will be checked. The element must specify both latitude and longitude coordinates.
    * @param { CtsRegion } [regions] - One or more geographic boxes, circles, polygons, or points. Where multiple regions are specified, the query matches if any region matches.
    * @param { XsString } [options] - Options to this query. The default is (). <p>Options include:</p> <blockquote> <dl> <dt>"coordinate-system=<var>string</var>"</dt> <dd>Use the given coordinate system. Valid values are: <dl> <dt>wgs84</dt><dd>The WGS84 coordinate system.</dd> <dt>wgs84/double</dt><dd>The WGS84 coordinate system at double precision.</dd> <dt>etrs89</dt><dd>The ETRS89 coordinate system.</dd> <dt>etrs89/double</dt><dd>The ETRS89 coordinate system at double precision.</dd> <dt>raw</dt><dd>The raw (unmapped) coordinate system.</dd> <dt>raw/double</dt><dd>The raw coordinate system at double precision.</dd> </dl> </dd> <dt>"precision=<em>string</em>"</dt> <dd>Use the coordinate system at the given precision. Allowed values: <code>float</code> (default) and <code>double</code>.</dd> <dt>"units=<em>value</em>"</dt> <dd>Measure distance and the radii of circles in the specified units. Allowed values: <code>miles</code> (default), <code>km</code>, <code>feet</code>, <code>meters</code>.</dd> <dt>"boundaries-included"</dt> <dd>Points on boxes', circles', and polygons' boundaries are counted as matching. This is the default.</dd> <dt>"boundaries-excluded"</dt> <dd>Points on boxes', circles', and polygons' boundaries are not counted as matching.</dd> <dt>"boundaries-latitude-excluded"</dt> <dd>Points on boxes' latitude boundaries are not counted as matching.</dd> <dt>"boundaries-longitude-excluded"</dt> <dd>Points on boxes' longitude boundaries are not counted as matching.</dd> <dt>"boundaries-south-excluded"</dt> <dd>Points on the boxes' southern boundaries are not counted as matching.</dd> <dt>"boundaries-west-excluded"</dt> <dd>Points on the boxes' western boundaries are not counted as matching.</dd> <dt>"boundaries-north-excluded"</dt> <dd>Points on the boxes' northern boundaries are not counted as matching.</dd> <dt>"boundaries-east-excluded"</dt> <dd>Points on the boxes' eastern boundaries are not counted as matching.</dd> <dt>"boundaries-circle-excluded"</dt> <dd>Points on circles' boundary are not counted as matching.</dd> <dt>"boundaries-endpoints-excluded"</dt> <dd>Points on linestrings' boundary (the endpoints) are not counted as matching.</dd> <dt>"cached"</dt> <dd>Cache the results of this query in the list cache.</dd> <dt>"uncached"</dt> <dd>Do not cache the results of this query in the list cache.</dd> <dt>"type=long-lat-point"</dt> <dd>Specifies the format for the point in the data as longitude first, latitude second.</dd> <dt>"type=point"</dt> <dd>Specifies the format for the point in the data as latitude first, longitude second. This is the default format.</dd> <dt>"score-function=<em>function</em>"</dt> <dd>Use the selected scoring function. The score function may be: <dl> <dt>linear</dt><dd>Use a linear function of the difference between the specified query value and the matching value in the index to calculate a score for this range query.</dd> <dt>reciprocal</dt><dd>Use a reciprocal function of the difference between the specified query value and the matching value in the index to calculate a score for this range query.</dd> <dt>zero</dt><dd>This range query does not contribute to the score. This is the default.</dd> </dl> </dd> <dt>"slope-factor=<em>number</em>"</dt> <dd>Apply the given number as a scaling factor to the slope of the scoring function. The default is 1.0.</dd> <dt>"synonym"</dt> <dd>Specifies that all of the terms in the $regions parameter are considered synonyms for scoring purposes. The result is that occurances of more than one of the synonyms are scored as if there are more occurance of the same term (as opposed to having a separate term that contributes to score). </dd> </dl></blockquote>
    * @param { XsDouble } [weight] - A weight for this query. The default is 1.0.
    * @returns { CtsQuery }
    */
elementChildGeospatialQuery(...args) {
    const namer = bldrbase.getNamer(args, 'parent-element-name');
    const paramdefs = [['parent-element-name', types.XsQName, false, true], ['child-element-names', types.XsQName, false, true], ['regions', types.CtsRegion, false, true], ['options', types.XsString, false, true], ['weight', types.XsDouble, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.elementChildGeospatialQuery', 3, new Set(['parent-element-name', 'child-element-names', 'regions', 'options', 'weight']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.elementChildGeospatialQuery', 3, false, paramdefs, args);
    return new types.CtsQuery('cts', 'element-child-geospatial-query', checkedArgs);

    }
/**
    * Returns a <code>cts:query</code> matching elements by name whose content represents a point contained within the given geographic box, circle, or polygon, or equal to the given point. Points that lie between the southern boundary and the northern boundary of a box, travelling northwards, and between the western boundary and the eastern boundary of the box, travelling eastwards, will match. Points contained within the given radius of the center point of a circle will match, using the curved distance on the surface of the Earth. Points contained within the given polygon will match, using great circle arcs over a spherical model of the Earth as edges. An error may result if the polygon is malformed in some way. Points equal to the a given point will match, taking into account the fact that longitudes converge at the poles. Using the geospatial query constructors requires a valid geospatial license key; without a valid license key, searches that include geospatial queries will throw an exception. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.elementGeospatialQuery|cts.elementGeospatialQuery}
    * @method planBuilder.cts#elementGeospatialQuery
    * @since 2.1.1
    * @param { XsQName } [elementName] - One or more element QNames to match. When multiple QNames are specified, the query matches if any QName matches.
    * @param { CtsRegion } [regions] - One or more geographic boxes, circles, polygons, or points. Where multiple regions are specified, the query matches if any region matches.
    * @param { XsString } [options] - Options to this query. The default is (). <p>Options include:</p> <blockquote> <dl> <dt>"coordinate-system=<var>string</var>"</dt> <dd>Use the given coordinate system. Valid values are: <dl> <dt>wgs84</dt><dd>The WGS84 coordinate system.</dd> <dt>wgs84/double</dt><dd>The WGS84 coordinate system at double precision.</dd> <dt>etrs89</dt><dd>The ETRS89 coordinate system.</dd> <dt>etrs89/double</dt><dd>The ETRS89 coordinate system at double precision.</dd> <dt>raw</dt><dd>The raw (unmapped) coordinate system.</dd> <dt>raw/double</dt><dd>The raw coordinate system at double precision.</dd> </dl> </dd> <dt>"precision=<em>value</em>"</dt> <dd>Use the coordinate system at the given precision. Allowed values: <code>float</code> and <code>double</code>.</dd> <dt>"units=<em>value</em>"</dt> <dd>Measure distance and the radii of circles in the specified units. Allowed values: <code>miles</code> (default), <code>km</code>, <code>feet</code>, <code>meters</code>.</dd> <dt>"boundaries-included"</dt> <dd>Points on boxes', circles', and polygons' boundaries are counted as matching. This is the default.</dd> <dt>"boundaries-excluded"</dt> <dd>Points on boxes', circles', and polygons' boundaries are not counted as matching.</dd> <dt>"boundaries-latitude-excluded"</dt> <dd>Points on boxes' latitude boundaries are not counted as matching.</dd> <dt>"boundaries-longitude-excluded"</dt> <dd>Points on boxes' longitude boundaries are not counted as matching.</dd> <dt>"boundaries-south-excluded"</dt> <dd>Points on the boxes' southern boundaries are not counted as matching.</dd> <dt>"boundaries-west-excluded"</dt> <dd>Points on the boxes' western boundaries are not counted as matching.</dd> <dt>"boundaries-north-excluded"</dt> <dd>Points on the boxes' northern boundaries are not counted as matching.</dd> <dt>"boundaries-east-excluded"</dt> <dd>Points on the boxes' eastern boundaries are not counted as matching.</dd> <dt>"boundaries-circle-excluded"</dt> <dd>Points on circles' boundary are not counted as matching.</dd> <dt>"boundaries-endpoints-excluded"</dt> <dd>Points on linestrings' boundary (the endpoints) are not counted as matching.</dd> <dt>"cached"</dt> <dd>Cache the results of this query in the list cache.</dd> <dt>"uncached"</dt> <dd>Do not cache the results of this query in the list cache.</dd> <dt>"type=long-lat-point"</dt> <dd>Specifies the format for the point in the data as longitude first, latitude second.</dd> <dt>"type=point"</dt> <dd>Specifies the format for the point in the data as latitude first, longitude second. This is the default format.</dd> <dt>"score-function=<em>function</em>"</dt> <dd>Use the selected scoring function. The score function may be: <dl> <dt>linear</dt><dd>Use a linear function of the difference between the specified query value and the matching value in the index to calculate a score for this range query.</dd> <dt>reciprocal</dt><dd>Use a reciprocal function of the difference between the specified query value and the matching value in the index to calculate a score for this range query.</dd> <dt>zero</dt><dd>This range query does not contribute to the score. This is the default.</dd> </dl> </dd> <dt>"slope-factor=<em>number</em>"</dt> <dd>Apply the given number as a scaling factor to the slope of the scoring function. The default is 1.0.</dd> <dt>"synonym"</dt> <dd>Specifies that all of the terms in the $regions parameter are considered synonyms for scoring purposes. The result is that occurances of more than one of the synonyms are scored as if there are more occurance of the same term (as opposed to having a separate term that contributes to score). </dd> </dl></blockquote>
    * @param { XsDouble } [weight] - A weight for this query. The default is 1.0.
    * @returns { CtsQuery }
    */
elementGeospatialQuery(...args) {
    const namer = bldrbase.getNamer(args, 'element-name');
    const paramdefs = [['element-name', types.XsQName, false, true], ['regions', types.CtsRegion, false, true], ['options', types.XsString, false, true], ['weight', types.XsDouble, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.elementGeospatialQuery', 2, new Set(['element-name', 'regions', 'options', 'weight']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.elementGeospatialQuery', 2, false, paramdefs, args);
    return new types.CtsQuery('cts', 'element-geospatial-query', checkedArgs);

    }
/**
    * Returns a <code>cts:query</code> matching elements by name which has specific element children representing latitude and longitude values for a point contained within the given geographic box, circle, or polygon, or equal to the given point. Points that lie between the southern boundary and the northern boundary of a box, travelling northwards, and between the western boundary and the eastern boundary of the box, travelling eastwards, will match. Points contained within the given radius of the center point of a circle will match, using the curved distance on the surface of the Earth. Points contained within the given polygon will match, using great circle arcs over a spherical model of the Earth as edges. An error may result if the polygon is malformed in some way. Points equal to the a given point will match, taking into account the fact that longitudes converge at the poles. Using the geospatial query constructors requires a valid geospatial license key; without a valid license key, searches that include geospatial queries will throw an exception. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.elementPairGeospatialQuery|cts.elementPairGeospatialQuery}
    * @method planBuilder.cts#elementPairGeospatialQuery
    * @since 2.1.1
    * @param { XsQName } [elementName] - One or more parent element QNames to match. When multiple QNames are specified, the query matches if any QName matches.
    * @param { XsQName } [latitudeElementNames] - One or more latitude element QNames to match. When multiple QNames are specified, the query matches if any QName matches; however, only the first matching latitude child in any point instance will be checked.
    * @param { XsQName } [longitudeElementNames] - One or more longitude element QNames to match. When multiple QNames are specified, the query matches if any QName matches; however, only the first matching longitude child in any point instance will be checked.
    * @param { CtsRegion } [regions] - One or more geographic boxes, circles, polygons, or points. Where multiple regions are specified, the query matches if any region matches.
    * @param { XsString } [options] - Options to this query. The default is (). <p>Options include:</p> <blockquote> <dl> <dt>"coordinate-system=<var>string</var>"</dt> <dd>Use the given coordinate system. Valid values are: <dl> <dt>wgs84</dt><dd>The WGS84 coordinate system.</dd> <dt>wgs84/double</dt><dd>The WGS84 coordinate system at double precision.</dd> <dt>etrs89</dt><dd>The ETRS89 coordinate system.</dd> <dt>etrs89/double</dt><dd>The ETRS89 coordinate system at double precision.</dd> <dt>raw</dt><dd>The raw (unmapped) coordinate system.</dd> <dt>raw/double</dt><dd>The raw coordinate system at double precision.</dd> </dl> </dd> <dt>"precision=<em>value</em>"</dt> <dd>Use the coordinate system at the given precision. Allowed values: <code>float</code> and <code>double</code>.</dd> <dt>"units=<em>value</em>"</dt> <dd>Measure distance and the radii of circles in the specified units. Allowed values: <code>miles</code> (default), <code>km</code>, <code>feet</code>, <code>meters</code>.</dd> <dt>"boundaries-included"</dt> <dd>Points on boxes', circles', and polygons' boundaries are counted as matching. This is the default.</dd> <dt>"boundaries-excluded"</dt> <dd>Points on boxes', circles', and polygons' boundaries are not counted as matching.</dd> <dt>"boundaries-latitude-excluded"</dt> <dd>Points on boxes' latitude boundaries are not counted as matching.</dd> <dt>"boundaries-longitude-excluded"</dt> <dd>Points on boxes' longitude boundaries are not counted as matching.</dd> <dt>"boundaries-south-excluded"</dt> <dd>Points on the boxes' southern boundaries are not counted as matching.</dd> <dt>"boundaries-west-excluded"</dt> <dd>Points on the boxes' western boundaries are not counted as matching.</dd> <dt>"boundaries-north-excluded"</dt> <dd>Points on the boxes' northern boundaries are not counted as matching.</dd> <dt>"boundaries-east-excluded"</dt> <dd>Points on the boxes' eastern boundaries are not counted as matching.</dd> <dt>"boundaries-circle-excluded"</dt> <dd>Points on circles' boundary are not counted as matching.</dd> <dt>"boundaries-endpoints-excluded"</dt> <dd>Points on linestrings' boundary (the endpoints) are not counted as matching.</dd> <dt>"cached"</dt> <dd>Cache the results of this query in the list cache.</dd> <dt>"uncached"</dt> <dd>Do not cache the results of this query in the list cache.</dd> <dt>"score-function=<em>function</em>"</dt> <dd>Use the selected scoring function. The score function may be: <dl> <dt>linear</dt><dd>Use a linear function of the difference between the specified query value and the matching value in the index to calculate a score for this range query.</dd> <dt>reciprocal</dt><dd>Use a reciprocal function of the difference between the specified query value and the matching value in the index to calculate a score for this range query.</dd> <dt>zero</dt><dd>This range query does not contribute to the score. This is the default.</dd> </dl> </dd> <dt>"slope-factor=<em>number</em>"</dt> <dd>Apply the given number as a scaling factor to the slope of the scoring function. The default is 1.0.</dd> <dt>"synonym"</dt> <dd>Specifies that all of the terms in the $regions parameter are considered synonyms for scoring purposes. The result is that occurances of more than one of the synonyms are scored as if there are more occurance of the same term (as opposed to having a separate term that contributes to score). </dd> </dl></blockquote>
    * @param { XsDouble } [weight] - A weight for this query. The default is 1.0.
    * @returns { CtsQuery }
    */
elementPairGeospatialQuery(...args) {
    const namer = bldrbase.getNamer(args, 'element-name');
    const paramdefs = [['element-name', types.XsQName, false, true], ['latitude-element-names', types.XsQName, false, true], ['longitude-element-names', types.XsQName, false, true], ['regions', types.CtsRegion, false, true], ['options', types.XsString, false, true], ['weight', types.XsDouble, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.elementPairGeospatialQuery', 4, new Set(['element-name', 'latitude-element-names', 'longitude-element-names', 'regions', 'options', 'weight']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.elementPairGeospatialQuery', 4, false, paramdefs, args);
    return new types.CtsQuery('cts', 'element-pair-geospatial-query', checkedArgs);

    }
/**
    * Returns a <code>cts:query</code> matching elements by name with the content constrained by the given <code>cts:query</code> in the second parameter. Searches for matches in the specified element and all of its descendants. If the specified query in the second parameter has any <code>cts:element-attribute-*-query</code> constructors, it will search attributes directly on the specified element and attributes on any descendant elements (see the <a>second example</a> below). Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.elementQuery|cts.elementQuery}
    * @method planBuilder.cts#elementQuery
    * @since 2.1.1
    * @param { XsQName } [elementName] - One or more element QNames to match. When multiple QNames are specified, the query matches if any QName matches.
    * @param { CtsQuery } [query] - A query for the element to match. If a string is entered, the string is treated as a <code>cts:word-query</code> of the specified string.
    * @returns { CtsQuery }
    */
elementQuery(...args) {
    const namer = bldrbase.getNamer(args, 'element-name');
    const paramdefs = [['element-name', types.XsQName, false, true], ['query', types.CtsQuery, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.elementQuery', 2, new Set(['element-name', 'query']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.elementQuery', 2, false, paramdefs, args);
    return new types.CtsQuery('cts', 'element-query', checkedArgs);

    }
/**
    * Returns a <code>cts:query</code> matching elements by name with a range-index entry equal to a given value. Searches with the <code>cts:element-range-query</code> constructor require an element range index on the specified QName(s); if there is no range index configured, then an exception is thrown. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.elementRangeQuery|cts.elementRangeQuery}
    * @method planBuilder.cts#elementRangeQuery
    * @since 2.1.1
    * @param { XsQName } [elementName] - One or more element QNames to match. When multiple QNames are specified, the query matches if any QName matches.
    * @param { XsString } [operator] - A comparison operator. <p> Operators include:</p> <blockquote><dl> <dt>"<"</dt> <dd>Match range index values less than $value.</dd> <dt>"<="</dt> <dd>Match range index values less than or equal to $value.</dd> <dt>">"</dt> <dd>Match range index values greater than $value.</dd> <dt>">="</dt> <dd>Match range index values greater than or equal to $value.</dd> <dt>"="</dt> <dd>Match range index values equal to $value.</dd> <dt>"!="</dt> <dd>Match range index values not equal to $value.</dd> </dl></blockquote>
    * @param { XsAnyAtomicType } [value] - One or more element values to match. When multiple values are specified, the query matches if any value matches.
    * @param { XsString } [options] - Options to this query. The default is (). <p> Options include:</p> <blockquote><dl> <dt>"collation=<em>URI</em>"</dt> <dd>Use the range index with the collation specified by <em>URI</em>. If not specified, then the default collation from the query is used. If a range index with the specified collation does not exist, an error is thrown.</dd> <dt>"cached"</dt> <dd>Cache the results of this query in the list cache.</dd> <dt>"uncached"</dt> <dd>Do not cache the results of this query in the list cache.</dd> <dt>"min-occurs=<em>number</em>"</dt> <dd>Specifies the minimum number of occurrences required. If fewer that this number of words occur, the fragment does not match. The default is 1.</dd> <dt>"max-occurs=<em>number</em>"</dt> <dd>Specifies the maximum number of occurrences required. If more than this number of words occur, the fragment does not match. The default is unbounded.</dd> <dt>"score-function=<em>function</em>"</dt> <dd>Use the selected scoring function. The score function may be: <dl> <dt>linear</dt><dd>Use a linear function of the difference between the specified query value and the matching value in the index to calculate a score for this range query.</dd> <dt>reciprocal</dt><dd>Use a reciprocal function of the difference between the specified query value and the matching value in the index to calculate a score for this range query.</dd> <dt>zero</dt><dd>This range query does not contribute to the score. This is the default.</dd> </dl> </dd> <dt>"slope-factor=<em>number</em>"</dt> <dd>Apply the given number as a scaling factor to the slope of the scoring function. The default is 1.0.</dd> <dt>"synonym"</dt> <dd>Specifies that all of the terms in the $value parameter are considered synonyms for scoring purposes. The result is that occurrences of more than one of the synonyms are scored as if there are more occurrences of the same term (as opposed to having a separate term that contributes to score). </dd> </dl></blockquote>
    * @param { XsDouble } [weight] - A weight for this query. The default is 1.0.
    * @returns { CtsQuery }
    */
elementRangeQuery(...args) {
    const namer = bldrbase.getNamer(args, 'element-name');
    const paramdefs = [['element-name', types.XsQName, false, true], ['operator', types.XsString, true, false], ['value', types.XsAnyAtomicType, false, true], ['options', types.XsString, false, true], ['weight', types.XsDouble, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.elementRangeQuery', 3, new Set(['element-name', 'operator', 'value', 'options', 'weight']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.elementRangeQuery', 3, false, paramdefs, args);
    return new types.CtsQuery('cts', 'element-range-query', checkedArgs);

    }
/**
    * Creates a reference to an element value lexicon, for use as a parameter to <a><code>cts:value-tuples</code></a>, <a><code>temporal:axis-create</code></a>, or any other function that takes an index reference. Since lexicons are implemented with range indexes, this function will throw an exception if the specified range index does not exist. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.elementReference|cts.elementReference}
    * @method planBuilder.cts#elementReference
    * @since 2.1.1
    * @param { XsQName } [element] - An element QName.
    * @param { XsString } [options] - Options. The default is (). <p> Options include:</p> <blockquote><dl> <dt>"type=<em>type</em>"</dt> <dd>Use the lexicon with the type specified by <em>type</em> (int, unsignedInt, long, unsignedLong, float, double, decimal, dateTime, time, date, gYearMonth, gYear, gMonth, gDay, yearMonthDuration, dayTimeDuration, string, anyURI, point, or long-lat-point)</dd> <dt>"collation=<em>URI</em>"</dt> <dd>Use the lexicon with the collation specified by <em>URI</em>.</dd> <dt>"nullable"</dt> <dd>Allow null values in tuples reported from cts:value-tuples when using this lexicon.</dd> <dt>"unchecked"</dt> <dd>Read the scalar type, collation and coordinate-system info only from the input. Do not check the definition against the context database.</dd> <dt>"coordinate-system=<em>name</em>"</dt> <dd>Create a reference to an index or lexicon based on the specified coordinate system. Allowed values: "wgs84", "wgs84/double", "raw", "raw/double". Only applicable if the index/lexicon value type is <code>point</code> or <code>long-lat-point</code>.</dd> <dt>"precision=<em>value</em>"</dt> <dd>Create a reference to an index or lexicon configured with the specified geospatial precision. Allowed values: <code>float</code> and <code>double</code>. Only applicable if the index/lexicon value type is <code>point</code> or <code>long-lat-point</code>. This value takes precedence over the precision implicit in the coordinate system name.</dd> </dl></blockquote>
    * @returns { CtsReference }
    */
elementReference(...args) {
    const namer = bldrbase.getNamer(args, 'element');
    const paramdefs = [['element', types.XsQName, true, false], ['options', types.XsString, false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.elementReference', 1, new Set(['element', 'options']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.elementReference', 1, false, paramdefs, args);
    return new types.CtsReference('cts', 'element-reference', checkedArgs);

    }
/**
    * Returns a query matching elements by name with text content equal a given phrase. <code>cts:element-value-query</code> only matches against simple elements (that is, elements that contain only text and have no element children). Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.elementValueQuery|cts.elementValueQuery}
    * @method planBuilder.cts#elementValueQuery
    * @since 2.1.1
    * @param { XsQName } [elementName] - One or more element QNames to match. When multiple QNames are specified, the query matches if any QName matches.
    * @param { XsString } [text] - One or more element values to match. When multiple strings are specified, the query matches if any string matches.
    * @param { XsString } [options] - Options to this query. The default is (). <p> Options include:</p> <blockquote><dl> <dt>"case-sensitive"</dt> <dd>A case-sensitive query.</dd> <dt>"case-insensitive"</dt> <dd>A case-insensitive query.</dd> <dt>"diacritic-sensitive"</dt> <dd>A diacritic-sensitive query.</dd> <dt>"diacritic-insensitive"</dt> <dd>A diacritic-insensitive query.</dd> <dt>"punctuation-sensitive"</dt> <dd>A punctuation-sensitive query.</dd> <dt>"punctuation-insensitive"</dt> <dd>A punctuation-insensitive query.</dd> <dt>"whitespace-sensitive"</dt> <dd>A whitespace-sensitive query.</dd> <dt>"whitespace-insensitive"</dt> <dd>A whitespace-insensitive query.</dd> <dt>"stemmed"</dt> <dd>A stemmed query.</dd> <dt>"unstemmed"</dt> <dd>An unstemmed query.</dd> <dt>"wildcarded"</dt> <dd>A wildcarded query.</dd> <dt>"unwildcarded"</dt> <dd>An unwildcarded query.</dd> <dt>"exact"</dt> <dd>An exact match query. Shorthand for "case-sensitive", "diacritic-sensitive", "punctuation-sensitive", "whitespace-sensitive", "unstemmed", and "unwildcarded". </dd> <dt>"lang=<em>iso639code</em>"</dt> <dd>Specifies the language of the query. The <em>iso639code</em> code portion is case-insensitive, and uses the languages specified by <a>ISO 639</a>. The default is specified in the database configuration.</dd> <dt>"min-occurs=<em>number</em>"</dt> <dd>Specifies the minimum number of occurrences required. If fewer that this number of words occur, the fragment does not match. The default is 1.</dd> <dt>"max-occurs=<em>number</em>"</dt> <dd>Specifies the maximum number of occurrences required. If more than this number of words occur, the fragment does not match. The default is unbounded.</dd> <dt>"synonym"</dt> <dd>Specifies that all of the terms in the $text parameter are considered synonyms for scoring purposes. The result is that occurrences of more than one of the synonyms are scored as if there are more occurrences of the same term (as opposed to having a separate term that contributes to score). </dd> <dt>"lexicon-expansion-limit=<em>number</em>"</dt> <dd>Specifies the limit for lexicon expansion. This puts a restriction on the number of lexicon expansions that can be performed. If the limit is exceeded, the server may raise an error depending on whether the "limit-check" option is set. The default value for this option will be 4096. </dd> <dt>"limit-check"</dt> <dd>Specifies that an error will be raised if the lexicon expansion exceeds the specified limit.</dd> <dt>"no-limit-check"</dt> <dd>Specifies that error will not be raised if the lexicon expansion exceeds the specified limit. The server will try to resolve the wildcard. </dd> </dl></blockquote>
    * @param { XsDouble } [weight] - A weight for this query. Higher weights move search results up in the relevance order. The default is 1.0. The weight should be between 64 and -16. Weights greater than 64 will have the same effect as a weight of 64. Weights less than the absolute value of 0.0625 (between -0.0625 and 0.0625) are rounded to 0, which means that they do not contribute to the score.
    * @returns { CtsQuery }
    */
elementValueQuery(...args) {
    const namer = bldrbase.getNamer(args, 'element-name');
    const paramdefs = [['element-name', types.XsQName, false, true], ['text', types.XsString, false, true], ['options', types.XsString, false, true], ['weight', types.XsDouble, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.elementValueQuery', 1, new Set(['element-name', 'text', 'options', 'weight']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.elementValueQuery', 1, false, paramdefs, args);
    return new types.CtsQuery('cts', 'element-value-query', checkedArgs);

    }
/**
    * Returns a query matching elements by name with text content containing a given phrase. Searches only through immediate text node children of the specified element as well as any text node children of child elements defined in the Admin Interface as element-word-query-throughs or phrase-throughs; does not search through any other children of the specified element. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.elementWordQuery|cts.elementWordQuery}
    * @method planBuilder.cts#elementWordQuery
    * @since 2.1.1
    * @param { XsQName } [elementName] - One or more element QNames to match. When multiple QNames are specified, the query matches if any QName matches.
    * @param { XsString } [text] - Some words or phrases to match. When multiple strings are specified, the query matches if any string matches.
    * @param { XsString } [options] - Options to this query. The default is (). <p> Options include:</p> <blockquote><dl> <dt>"case-sensitive"</dt> <dd>A case-sensitive query.</dd> <dt>"case-insensitive"</dt> <dd>A case-insensitive query.</dd> <dt>"diacritic-sensitive"</dt> <dd>A diacritic-sensitive query.</dd> <dt>"diacritic-insensitive"</dt> <dd>A diacritic-insensitive query.</dd> <dt>"punctuation-sensitive"</dt> <dd>A punctuation-sensitive query.</dd> <dt>"punctuation-insensitive"</dt> <dd>A punctuation-insensitive query.</dd> <dt>"whitespace-sensitive"</dt> <dd>A whitespace-sensitive query.</dd> <dt>"whitespace-insensitive"</dt> <dd>A whitespace-insensitive query.</dd> <dt>"stemmed"</dt> <dd>A stemmed query.</dd> <dt>"unstemmed"</dt> <dd>An unstemmed query.</dd> <dt>"wildcarded"</dt> <dd>A wildcarded query.</dd> <dt>"unwildcarded"</dt> <dd>An unwildcarded query.</dd> <dt>"exact"</dt> <dd>An exact match query. Shorthand for "case-sensitive", "diacritic-sensitive", "punctuation-sensitive", "whitespace-sensitive", "unstemmed", and "unwildcarded". </dd> <dt>"lang=<em>iso639code</em>"</dt> <dd>Specifies the language of the query. The <em>iso639code</em> code portion is case-insensitive, and uses the languages specified by <a>ISO 639</a>. The default is specified in the database configuration.</dd> <dt>"distance-weight=<em>number</em>"</dt> <dd>A weight applied based on the minimum distance between matches of this query. Higher weights add to the importance of proximity (as opposed to term matches) when the relevance order is calculated. The default value is 0.0 (no impact of proximity). The weight should be between 64 and -16. Weights greater than 64 will have the same effect as a weight of 64. This parameter has no effect if the <code>word positions</code> index is not enabled. This parameter has no effect on searches that use score-simple, score-random, or score-zero (because those scoring algorithms do not consider term frequency, proximity is irrelevant). </dd> <dt>"min-occurs=<em>number</em>"</dt> <dd>Specifies the minimum number of occurrences required. If fewer that this number of words occur, the fragment does not match. The default is 1.</dd> <dt>"max-occurs=<em>number</em>"</dt> <dd>Specifies the maximum number of occurrences required. If more than this number of words occur, the fragment does not match. The default is unbounded.</dd> <dt>"synonym"</dt> <dd>Specifies that all of the terms in the $text parameter are considered synonyms for scoring purposes. The result is that occurrences of more than one of the synonyms are scored as if there are more occurrences of the same term (as opposed to having a separate term that contributes to score). </dd> <dt>"lexicon-expand=<em>value</em>"</dt> <dd>The <em>value</em> is one of <code>full</code>, <code>prefix-postfix</code>, <code>off</code>, or <code>heuristic</code> (the default is <code>heuristic</code>). An option with a value of <code>lexicon-expand=full</code> specifies that wildcards are resolved by expanding the pattern to words in a lexicon (if there is one available), and turning into a series of <code>cts:word-queries</code>, even if this takes a long time to evaluate. An option with a value of <code>lexicon-expand=prefix-postfix</code> specifies that wildcards are resolved by expanding the pattern to the pre- and postfixes of the words in the word lexicon (if there is one), and turning the query into a series of character queries, even if it takes a long time to evaluate. An option with a value of <code>lexicon-expand=off</code> specifies that wildcards are only resolved by looking up character patterns in the search pattern index, not in the lexicon. An option with a value of <code>lexicon-expand=heuristic</code>, which is the default, specifies that wildcards are resolved by using a series of internal rules, such as estimating the number of lexicon entries that need to be scanned, seeing if the estimate crosses certain thresholds, and (if appropriate), using another way besides lexicon expansion to resolve the query. </dd> * <dt>"lexicon-expansion-limit=<em>number</em>"</dt> <dd>Specifies the limit for lexicon expansion. This puts a restriction on the number of lexicon expansions that can be performed. If the limit is exceeded, the server may raise an error depending on whether the "limit-check" option is set. The default value for this option will be 4096. </dd> <dt>"limit-check"</dt> <dd>Specifies that an error will be raised if the lexicon expansion exceeds the specified limit.</dd> <dt>"no-limit-check"</dt> <dd>Specifies that error will not be raised if the lexicon expansion exceeds the specified limit. The server will try to resolve the wildcard. </dd> </dl></blockquote>
    * @param { XsDouble } [weight] - A weight for this query. Higher weights move search results up in the relevance order. The default is 1.0. The weight should be between 64 and -16. Weights greater than 64 will have the same effect as a weight of 64. Weights less than the absolute value of 0.0625 (between -0.0625 and 0.0625) are rounded to 0, which means that they do not contribute to the score.
    * @returns { CtsQuery }
    */
elementWordQuery(...args) {
    const namer = bldrbase.getNamer(args, 'element-name');
    const paramdefs = [['element-name', types.XsQName, false, true], ['text', types.XsString, false, true], ['options', types.XsString, false, true], ['weight', types.XsDouble, false, false]];
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
    * Returns a <code>cts:query</code> matching fields by name with a range-index entry equal to a given value. Searches with the <code>cts:field-range-query</code> constructor require a field range index on the specified field name(s); if there is no range index configured, then an exception is thrown. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.fieldRangeQuery|cts.fieldRangeQuery}
    * @method planBuilder.cts#fieldRangeQuery
    * @since 2.1.1
    * @param { XsString } [fieldName] - One or more field names to match. When multiple field names are specified, the query matches if any field name matches.
    * @param { XsString } [operator] - A comparison operator. <p> Operators include:</p> <blockquote><dl> <dt>"<"</dt> <dd>Match range index values less than $value.</dd> <dt>"<="</dt> <dd>Match range index values less than or equal to $value.</dd> <dt>">"</dt> <dd>Match range index values greater than $value.</dd> <dt>">="</dt> <dd>Match range index values greater than or equal to $value.</dd> <dt>"="</dt> <dd>Match range index values equal to $value.</dd> <dt>"!="</dt> <dd>Match range index values not equal to $value.</dd> </dl></blockquote>
    * @param { XsAnyAtomicType } [value] - One or more field values to match. When multiple values are specified, the query matches if any value matches. The value must be a type for which there is a range index defined.
    * @param { XsString } [options] - Options to this query. The default is (). <p> Options include:</p> <blockquote><dl> <dt>"collation=<em>URI</em>"</dt> <dd>Use the range index with the collation specified by <em>URI</em>. If not specified, then the default collation from the query is used. If a range index with the specified collation does not exist, an error is thrown.</dd> <dt>"cached"</dt> <dd>Cache the results of this query in the list cache.</dd> <dt>"uncached"</dt> <dd>Do not cache the results of this query in the list cache.</dd> <dt>"min-occurs=<em>number</em>"</dt> <dd>Specifies the minimum number of occurrences required. If fewer that this number of words occur, the fragment does not match. The default is 1.</dd> <dt>"max-occurs=<em>number</em>"</dt> <dd>Specifies the maximum number of occurrences required. If more than this number of words occur, the fragment does not match. The default is unbounded.</dd> <dt>"score-function=<em>function</em>"</dt> <dd>Use the selected scoring function. The score function may be: <dl> <dt>linear</dt><dd>Use a linear function of the difference between the specified query value and the matching value in the index to calculate a score for this range query.</dd> <dt>reciprocal</dt><dd>Use a reciprocal function of the difference between the specified query value and the matching value in the index to calculate a score for this range query.</dd> <dt>zero</dt><dd>This range query does not contribute to the score. This is the default.</dd> </dl> </dd> <dt>"slope-factor=<em>number</em>"</dt> <dd>Apply the given number as a scaling factor to the slope of the scoring function. The default is 1.0.</dd> <dt>"synonym"</dt> <dd>Specifies that all of the terms in the $value parameter are considered synonyms for scoring purposes. The result is that occurrences of more than one of the synonyms are scored as if there are more occurrences of the same term (as opposed to having a separate term that contributes to score). </dd> </dl></blockquote>
    * @param { XsDouble } [weight] - A weight for this query. The default is 1.0.
    * @returns { CtsQuery }
    */
fieldRangeQuery(...args) {
    const namer = bldrbase.getNamer(args, 'field-name');
    const paramdefs = [['field-name', types.XsString, false, true], ['operator', types.XsString, true, false], ['value', types.XsAnyAtomicType, false, true], ['options', types.XsString, false, true], ['weight', types.XsDouble, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.fieldRangeQuery', 3, new Set(['field-name', 'operator', 'value', 'options', 'weight']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.fieldRangeQuery', 3, false, paramdefs, args);
    return new types.CtsQuery('cts', 'field-range-query', checkedArgs);

    }
/**
    * Creates a reference to a field value lexicon, for use as a parameter to <a>cts:value-tuples</a>. Since lexicons are implemented with range indexes, this function will throw an exception if the specified range index does not exist. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.fieldReference|cts.fieldReference}
    * @method planBuilder.cts#fieldReference
    * @since 2.1.1
    * @param { XsString } [field] - A field name.
    * @param { XsString } [options] - Options. The default is (). <p> Options include:</p> <blockquote><dl> <dt>"type=<em>type</em>"</dt> <dd>Use the lexicon with the type specified by <em>type</em> (int, unsignedInt, long, unsignedLong, float, double, decimal, dateTime, time, date, gYearMonth, gYear, gMonth, gDay, yearMonthDuration, dayTimeDuration, string, anyURI, point, or long-lat-point)</dd> <dt>"collation=<em>URI</em>"</dt> <dd>Use the lexicon with the collation specified by <em>URI</em>.</dd> <dt>"nullable"</dt> <dd>Allow null values in tuples reported from cts:value-tuples when using this lexicon.</dd> <dt>"unchecked"</dt> <dd>Read the scalar type, collation and coordinate-system info only from the input. Do not check the definition against the context database.</dd> <dt>"coordinate-system=<em>name</em>"</dt> <dd>Create a reference to an index or lexicon based on the specified coordinate system. Allowed values: "wgs84", "wgs84/double", "raw", "raw/double". Only applicable if the index/lexicon value type is <code>point</code> or <code>long-lat-point</code>.</dd> <dt>"precision=<em>value</em>"</dt> <dd>Create a reference to an index or lexicon configured with the specified geospatial precision. Allowed values: <code>float</code> and <code>double</code>. Only applicable if the index/lexicon value type is <code>point</code> or <code>long-lat-point</code>. This value takes precedence over the precision implicit in the coordinate system name.</dd> </dl></blockquote>
    * @returns { CtsReference }
    */
fieldReference(...args) {
    const namer = bldrbase.getNamer(args, 'field');
    const paramdefs = [['field', types.XsString, true, false], ['options', types.XsString, false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.fieldReference', 1, new Set(['field', 'options']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.fieldReference', 1, false, paramdefs, args);
    return new types.CtsReference('cts', 'field-reference', checkedArgs);

    }
/**
    * Returns a query matching text content containing a given value in the specified field. If the specified field does not exist, <code>cts:field-value-query</code> throws an exception. If the specified field does not have the index setting <code>field value searches</code> enabled, either for the database or for the specified field, then a <code>cts:search</code> with a <code>cts:field-value-query</code> throws an exception. A field is a named object that specified elements to include and exclude from a search, and can include score weights for any included elements. You create fields at the database level using the Admin Interface. For details on fields, see the chapter on "Fields Database Settings" in the <em>Administrator's Guide</em>. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.fieldValueQuery|cts.fieldValueQuery}
    * @method planBuilder.cts#fieldValueQuery
    * @since 2.1.1
    * @param { XsString } [fieldName] - One or more field names to search over. If multiple field names are supplied, the match can be in any of the specified fields (or-query semantics).
    * @param { XsAnyAtomicType } [text] - The values to match. If multiple values are specified, the query matches if any of the values match (or-query semantics). For XML documents, the values should be strings. For JSON, the values can be strings, numbers or booleans. To match null, pass in the empty sequence.
    * @param { XsString } [options] - Options to this query. The default is (). <p> Options include:</p> <blockquote><dl> <dt>"case-sensitive"</dt> <dd>A case-sensitive query.</dd> <dt>"case-insensitive"</dt> <dd>A case-insensitive query.</dd> <dt>"diacritic-sensitive"</dt> <dd>A diacritic-sensitive query.</dd> <dt>"diacritic-insensitive"</dt> <dd>A diacritic-insensitive query.</dd> <dt>"punctuation-sensitive"</dt> <dd>A punctuation-sensitive query.</dd> <dt>"punctuation-insensitive"</dt> <dd>A punctuation-insensitive query.</dd> <dt>"whitespace-sensitive"</dt> <dd>A whitespace-sensitive query.</dd> <dt>"whitespace-insensitive"</dt> <dd>A whitespace-insensitive query.</dd> <dt>"stemmed"</dt> <dd>A stemmed query.</dd> <dt>"unstemmed"</dt> <dd>An unstemmed query.</dd> <dt>"wildcarded"</dt> <dd>A wildcarded query.</dd> <dt>"unwildcarded"</dt> <dd>An unwildcarded query.</dd> <dt>"exact"</dt> <dd>An exact match query. Shorthand for "case-sensitive", "diacritic-sensitive", "punctuation-sensitive", "whitespace-sensitive", "unstemmed", and "unwildcarded". </dd> <dt>"lang=<em>iso639code</em>"</dt> <dd>Specifies the language of the query. The <em>iso639code</em> code portion is case-insensitive, and uses the languages specified by <a>ISO 639</a>. The default is specified in the database configuration.</dd> <dt>"distance-weight=<em>number</em>"</dt> <dd>A weight applied based on the minimum distance between matches of this query. Higher weights add to the importance of proximity (as opposed to term matches) when the relevance order is calculated. The default value is 0.0 (no impact of proximity). The weight should be between 64 and -16. Weights greater than 64 will have the same effect as a weight of 64. This parameter has no effect if the <code>word positions</code> index is not enabled. This parameter has no effect on searches that use score-simple or score-random (because those scoring algorithms do not consider term frequency, proximity is irrelevant). </dd> <dt>"min-occurs=<em>number</em>"</dt> <dd>Specifies the minimum number of occurrences required. If fewer that this number of words occur, the fragment does not match. The default is 1.</dd> <dt>"max-occurs=<em>number</em>"</dt> <dd>Specifies the maximum number of occurrences required. If more than this number of words occur, the fragment does not match. The default is unbounded.</dd> <dt>"synonym"</dt> <dd>Specifies that all of the terms in the $text parameter are considered synonyms for scoring purposes. The result is that occurrences of more than one of the synonyms are scored as if there are more occurrences of the same term (as opposed to having a separate term that contributes to score). </dd> <dt>"lexicon-expansion-limit=<em>number</em>"</dt> <dd>Specifies the limit for lexicon expansion. This puts a restriction on the number of lexicon expansions that can be performed. If the limit is exceeded, the server may raise an error depending on whether the "limit-check" option is set. The default value for this option will be 4096. </dd> <dt>"limit-check"</dt> <dd>Specifies that an error will be raised if the lexicon expansion exceeds the specified limit.</dd> <dt>"no-limit-check"</dt> <dd>Specifies that error will not be raised if the lexicon expansion exceeds the specified limit. The server will try to resolve the wildcard. </dd> </dl></blockquote>
    * @param { XsDouble } [weight] - A weight for this query. Higher weights move search results up in the relevance order. The default is 1.0. The weight should be between 64 and -16. Weights greater than 64 will have the same effect as a weight of 64. Weights less than the absolute value of 0.0625 (between -0.0625 and 0.0625) are rounded to 0, which means that they do not contribute to the score.
    * @returns { CtsQuery }
    */
fieldValueQuery(...args) {
    const namer = bldrbase.getNamer(args, 'field-name');
    const paramdefs = [['field-name', types.XsString, false, true], ['text', types.XsAnyAtomicType, false, true], ['options', types.XsString, false, true], ['weight', types.XsDouble, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.fieldValueQuery', 2, new Set(['field-name', 'text', 'options', 'weight']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.fieldValueQuery', 2, false, paramdefs, args);
    return new types.CtsQuery('cts', 'field-value-query', checkedArgs);

    }
/**
    * Returns a query matching fields whose content contains the given phrase. If the specified field does not exist, this function throws an exception. A field is a named object that specified elements to include and exclude from a search, and can include score weights for any included elements. You create fields at the database level using the Admin Interface. For details on fields, see the chapter on "Fields Database Settings" in the <em>Administrator's Guide</em>. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.fieldWordQuery|cts.fieldWordQuery}
    * @method planBuilder.cts#fieldWordQuery
    * @since 2.1.1
    * @param { XsString } [fieldName] - One or more field names to search over. If multiple field names are supplied, the match can be in any of the specified fields (or-query semantics).
    * @param { XsString } [text] - The word or phrase to match. If multiple strings are specified, the query matches if any of the words or phrases match (or-query semantics).
    * @param { XsString } [options] - Options to this query. The default is (). <p> Options include:</p> <blockquote><dl> <dt>"case-sensitive"</dt> <dd>A case-sensitive query.</dd> <dt>"case-insensitive"</dt> <dd>A case-insensitive query.</dd> <dt>"diacritic-sensitive"</dt> <dd>A diacritic-sensitive query.</dd> <dt>"diacritic-insensitive"</dt> <dd>A diacritic-insensitive query.</dd> <dt>"punctuation-sensitive"</dt> <dd>A punctuation-sensitive query.</dd> <dt>"punctuation-insensitive"</dt> <dd>A punctuation-insensitive query.</dd> <dt>"whitespace-sensitive"</dt> <dd>A whitespace-sensitive query.</dd> <dt>"whitespace-insensitive"</dt> <dd>A whitespace-insensitive query.</dd> <dt>"stemmed"</dt> <dd>A stemmed query.</dd> <dt>"unstemmed"</dt> <dd>An unstemmed query.</dd> <dt>"wildcarded"</dt> <dd>A wildcarded query.</dd> <dt>"unwildcarded"</dt> <dd>An unwildcarded query.</dd> <dt>"exact"</dt> <dd>An exact match query. Shorthand for "case-sensitive", "diacritic-sensitive", "punctuation-sensitive", "whitespace-sensitive", "unstemmed", and "unwildcarded". </dd> <dt>"lang=<em>iso639code</em>"</dt> <dd>Specifies the language of the query. The <em>iso639code</em> code portion is case-insensitive, and uses the languages specified by <a>ISO 639</a>. The default is specified in the database configuration.</dd> <dt>"distance-weight=<em>number</em>"</dt> <dd>A weight applied based on the minimum distance between matches of this query. Higher weights add to the importance of proximity (as opposed to term matches) when the relevance order is calculated. The default value is 0.0 (no impact of proximity). The weight should be between 64 and -16. Weights greater than 64 will have the same effect as a weight of 64. This parameter has no effect if the <code>word positions</code> index is not enabled. This parameter has no effect on searches that use score-simple, score-random, or score-zero (because those scoring algorithms do not consider term frequency, proximity is irrelevant). </dd> <dt>"min-occurs=<em>number</em>"</dt> <dd>Specifies the minimum number of occurrences required. If fewer that this number of words occur, the fragment does not match. The default is 1.</dd> <dt>"max-occurs=<em>number</em>"</dt> <dd>Specifies the maximum number of occurrences required. If more than this number of words occur, the fragment does not match. The default is unbounded.</dd> <dt>"synonym"</dt> <dd>Specifies that all of the terms in the $text parameter are considered synonyms for scoring purposes. The result is that occurrences of more than one of the synonyms are scored as if there are more occurrences of the same term (as opposed to having a separate term that contributes to score). </dd> <dt>"lexicon-expand=<em>value</em>"</dt> <dd>The <em>value</em> is one of <code>full</code>, <code>prefix-postfix</code>, <code>off</code>, or <code>heuristic</code> (the default is <code>heuristic</code>). An option with a value of <code>lexicon-expand=full</code> specifies that wildcards are resolved by expanding the pattern to words in a lexicon (if there is one available), and turning into a series of <code>cts:word-queries</code>, even if this takes a long time to evaluate. An option with a value of <code>lexicon-expand=prefix-postfix</code> specifies that wildcards are resolved by expanding the pattern to the pre- and postfixes of the words in the word lexicon (if there is one), and turning the query into a series of character queries, even if it takes a long time to evaluate. An option with a value of <code>lexicon-expand=off</code> specifies that wildcards are only resolved by looking up character patterns in the search pattern index, not in the lexicon. An option with a value of <code>lexicon-expand=heuristic</code>, which is the default, specifies that wildcards are resolved by using a series of internal rules, such as estimating the number of lexicon entries that need to be scanned, seeing if the estimate crosses certain thresholds, and (if appropriate), using another way besides lexicon expansion to resolve the query. </dd> * <dt>"lexicon-expansion-limit=<em>number</em>"</dt> <dd>Specifies the limit for lexicon expansion. This puts a restriction on the number of lexicon expansions that can be performed. If the limit is exceeded, the server may raise an error depending on whether the "limit-check" option is set. The default value for this option will be 4096. </dd> <dt>"limit-check"</dt> <dd>Specifies that an error will be raised if the lexicon expansion exceeds the specified limit.</dd> <dt>"no-limit-check"</dt> <dd>Specifies that error will not be raised if the lexicon expansion exceeds the specified limit. The server will try to resolve the wildcard. </dd> </dl></blockquote>
    * @param { XsDouble } [weight] - A weight for this query. Higher weights move search results up in the relevance order. The default is 1.0. The weight should be between 64 and -16. Weights greater than 64 will have the same effect as a weight of 64. Weights less than the absolute value of 0.0625 (between -0.0625 and 0.0625) are rounded to 0, which means that they do not contribute to the score.
    * @returns { CtsQuery }
    */
fieldWordQuery(...args) {
    const namer = bldrbase.getNamer(args, 'field-name');
    const paramdefs = [['field-name', types.XsString, false, true], ['text', types.XsString, false, true], ['options', types.XsString, false, true], ['weight', types.XsDouble, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.fieldWordQuery', 2, new Set(['field-name', 'text', 'options', 'weight']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.fieldWordQuery', 2, false, paramdefs, args);
    return new types.CtsQuery('cts', 'field-word-query', checkedArgs);

    }
/**
    * Returns a <code>cts:query</code> matching json properties by name which has specific children representing latitude and longitude values for a point contained within the given geographic box, circle, or polygon, or equal to the given point. Points that lie between the southern boundary and the northern boundary of a box, travelling northwards, and between the western boundary and the eastern boundary of the box, travelling eastwards, will match. Points contained within the given radius of the center point of a circle will match, using the curved distance on the surface of the Earth. Points contained within the given polygon will match, using great circle arcs over a spherical model of the Earth as edges. An error may result if the polygon is malformed in some way. Points equal to the a given point will match, taking into account the fact that longitudes converge at the poles. Using the geospatial query constructors requires a valid geospatial license key; without a valid license key, searches that include geospatial queries will throw an exception. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.jsonPropertyChildGeospatialQuery|cts.jsonPropertyChildGeospatialQuery}
    * @method planBuilder.cts#jsonPropertyChildGeospatialQuery
    * @since 2.1.1
    * @param { XsString } [parentPropertyName] - One or more parent property names to match. When multiple names are specified, the query matches if any name matches.
    * @param { XsString } [childPropertyNames] - One or more child property names to match. When multiple names are specified, the query matches if any name matches; however, only the first matching latitude child in any point instance will be checked. The property must specify both latitude and longitude coordinates.
    * @param { CtsRegion } [regions] - One or more geographic boxes, circles, polygons, or points. Where multiple regions are specified, the query matches if any region matches.
    * @param { XsString } [options] - Options to this query. The default is (). <p>Options include:</p> <blockquote> <dl> <dt>"coordinate-system=<var>string</var>"</dt> <dd>Use the given coordinate system. Valid values are: <dl> <dt>wgs84</dt><dd>The WGS84 coordinate system.</dd> <dt>wgs84/double</dt><dd>The WGS84 coordinate system at double precision.</dd> <dt>etrs89</dt><dd>The ETRS89 coordinate system.</dd> <dt>etrs89/double</dt><dd>The ETRS89 coordinate system at double precision.</dd> <dt>raw</dt><dd>The raw (unmapped) coordinate system.</dd> <dt>raw/double</dt><dd>The raw coordinate system at double precision.</dd> </dl> </dd> <dt>"precision=<em>string</em>"</dt> <dd>Use the coordinate system at the given precision. Allowed values: <code>float</code> (default) and <code>double</code>.</dd> <dt>"units=<em>value</em>"</dt> <dd>Measure distance and the radii of circles in the specified units. Allowed values: <code>miles</code> (default), <code>km</code>, <code>feet</code>, <code>meters</code>.</dd> <dt>"boundaries-included"</dt> <dd>Points on boxes', circles', and polygons' boundaries are counted as matching. This is the default.</dd> <dt>"boundaries-excluded"</dt> <dd>Points on boxes', circles', and polygons' boundaries are not counted as matching.</dd> <dt>"boundaries-latitude-excluded"</dt> <dd>Points on boxes' latitude boundaries are not counted as matching.</dd> <dt>"boundaries-longitude-excluded"</dt> <dd>Points on boxes' longitude boundaries are not counted as matching.</dd> <dt>"boundaries-south-excluded"</dt> <dd>Points on the boxes' southern boundaries are not counted as matching.</dd> <dt>"boundaries-west-excluded"</dt> <dd>Points on the boxes' western boundaries are not counted as matching.</dd> <dt>"boundaries-north-excluded"</dt> <dd>Points on the boxes' northern boundaries are not counted as matching.</dd> <dt>"boundaries-east-excluded"</dt> <dd>Points on the boxes' eastern boundaries are not counted as matching.</dd> <dt>"boundaries-circle-excluded"</dt> <dd>Points on circles' boundary are not counted as matching.</dd> <dt>"boundaries-endpoints-excluded"</dt> <dd>Points on linestrings' boundary (the endpoints) are not counted as matching.</dd> <dt>"cached"</dt> <dd>Cache the results of this query in the list cache.</dd> <dt>"uncached"</dt> <dd>Do not cache the results of this query in the list cache.</dd> <dt>"type=long-lat-point"</dt> <dd>Specifies the format for the point in the data as longitude first, latitude second.</dd> <dt>"type=point"</dt> <dd>Specifies the format for the point in the data as latitude first, longitude second. This is the default format.</dd> <dt>"score-function=<em>function</em>"</dt> <dd>Use the selected scoring function. The score function may be: <dl> <dt>linear</dt><dd>Use a linear function of the difference between the specified query value and the matching value in the index to calculate a score for this range query.</dd> <dt>reciprocal</dt><dd>Use a reciprocal function of the difference between the specified query value and the matching value in the index to calculate a score for this range query.</dd> <dt>zero</dt><dd>This range query does not contribute to the score. This is the default.</dd> </dl> </dd> <dt>"slope-factor=<em>number</em>"</dt> <dd>Apply the given number as a scaling factor to the slope of the scoring function. The default is 1.0.</dd> <dt>"synonym"</dt> <dd>Specifies that all of the terms in the $regions parameter are considered synonyms for scoring purposes. The result is that occurances of more than one of the synonyms are scored as if there are more occurance of the same term (as opposed to having a separate term that contributes to score). </dd> </dl></blockquote>
    * @param { XsDouble } [weight] - A weight for this query. The default is 1.0.
    * @returns { CtsQuery }
    */
jsonPropertyChildGeospatialQuery(...args) {
    const namer = bldrbase.getNamer(args, 'parent-property-name');
    const paramdefs = [['parent-property-name', types.XsString, false, true], ['child-property-names', types.XsString, false, true], ['regions', types.CtsRegion, false, true], ['options', types.XsString, false, true], ['weight', types.XsDouble, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.jsonPropertyChildGeospatialQuery', 3, new Set(['parent-property-name', 'child-property-names', 'regions', 'options', 'weight']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.jsonPropertyChildGeospatialQuery', 3, false, paramdefs, args);
    return new types.CtsQuery('cts', 'json-property-child-geospatial-query', checkedArgs);

    }
/**
    * Returns a <code>cts:query</code> matching json properties by name whose content represents a point contained within the given geographic box, circle, or polygon, or equal to the given point. Points that lie between the southern boundary and the northern boundary of a box, travelling northwards, and between the western boundary and the eastern boundary of the box, travelling eastwards, will match. Points contained within the given radius of the center point of a circle will match, using the curved distance on the surface of the Earth. Points contained within the given polygon will match, using great circle arcs over a spherical model of the Earth as edges. An error may result if the polygon is malformed in some way. Points equal to the a given point will match, taking into account the fact that longitudes converge at the poles. Using the geospatial query constructors requires a valid geospatial license key; without a valid license key, searches that include geospatial queries will throw an exception. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.jsonPropertyGeospatialQuery|cts.jsonPropertyGeospatialQuery}
    * @method planBuilder.cts#jsonPropertyGeospatialQuery
    * @since 2.1.1
    * @param { XsString } [propertyName] - One or more json property names to match. When multiple names are specified, the query matches if any name matches.
    * @param { CtsRegion } [regions] - One or more geographic boxes, circles, polygons, or points. Where multiple regions are specified, the query matches if any region matches.
    * @param { XsString } [options] - Options to this query. The default is (). <p>Options include:</p> <blockquote> <dl> <dt>"coordinate-system=<var>string</var>"</dt> <dd>Use the given coordinate system. Valid values are: <dl> <dt>wgs84</dt><dd>The WGS84 coordinate system.</dd> <dt>wgs84/double</dt><dd>The WGS84 coordinate system at double precision.</dd> <dt>etrs89</dt><dd>The ETRS89 coordinate system.</dd> <dt>etrs89/double</dt><dd>The ETRS89 coordinate system at double precision.</dd> <dt>raw</dt><dd>The raw (unmapped) coordinate system.</dd> <dt>raw/double</dt><dd>The raw coordinate system at double precision.</dd> </dl> </dd> <dt>"precision=<em>string</em>"</dt> <dd>Use the coordinate system at the given precision. Allowed values: <code>float</code> (default) and <code>double</code>.</dd> <dt>"units=<em>value</em>"</dt> <dd>Measure distance and the radii of circles in the specified units. Allowed values: <code>miles</code> (default), <code>km</code>, <code>feet</code>, <code>meters</code>.</dd> <dt>"boundaries-included"</dt> <dd>Points on boxes', circles', and polygons' boundaries are counted as matching. This is the default.</dd> <dt>"boundaries-excluded"</dt> <dd>Points on boxes', circles', and polygons' boundaries are not counted as matching.</dd> <dt>"boundaries-latitude-excluded"</dt> <dd>Points on boxes' latitude boundaries are not counted as matching.</dd> <dt>"boundaries-longitude-excluded"</dt> <dd>Points on boxes' longitude boundaries are not counted as matching.</dd> <dt>"boundaries-south-excluded"</dt> <dd>Points on the boxes' southern boundaries are not counted as matching.</dd> <dt>"boundaries-west-excluded"</dt> <dd>Points on the boxes' western boundaries are not counted as matching.</dd> <dt>"boundaries-north-excluded"</dt> <dd>Points on the boxes' northern boundaries are not counted as matching.</dd> <dt>"boundaries-east-excluded"</dt> <dd>Points on the boxes' eastern boundaries are not counted as matching.</dd> <dt>"boundaries-circle-excluded"</dt> <dd>Points on circles' boundary are not counted as matching.</dd> <dt>"boundaries-endpoints-excluded"</dt> <dd>Points on linestrings' boundary (the endpoints) are not counted as matching.</dd> <dt>"cached"</dt> <dd>Cache the results of this query in the list cache.</dd> <dt>"uncached"</dt> <dd>Do not cache the results of this query in the list cache.</dd> <dt>"type=long-lat-point"</dt> <dd>Specifies the format for the point in the data as longitude first, latitude second.</dd> <dt>"type=point"</dt> <dd>Specifies the format for the point in the data as latitude first, longitude second. This is the default format.</dd> <dt>"score-function=<em>function</em>"</dt> <dd>Use the selected scoring function. The score function may be: <dl> <dt>linear</dt><dd>Use a linear function of the difference between the specified query value and the matching value in the index to calculate a score for this range query.</dd> <dt>reciprocal</dt><dd>Use a reciprocal function of the difference between the specified query value and the matching value in the index to calculate a score for this range query.</dd> <dt>zero</dt><dd>This range query does not contribute to the score. This is the default.</dd> </dl> </dd> <dt>"slope-factor=<em>number</em>"</dt> <dd>Apply the given number as a scaling factor to the slope of the scoring function. The default is 1.0.</dd> <dt>"synonym"</dt> <dd>Specifies that all of the terms in the $regions parameter are considered synonyms for scoring purposes. The result is that occurances of more than one of the synonyms are scored as if there are more occurance of the same term (as opposed to having a separate term that contributes to score). </dd> </dl></blockquote>
    * @param { XsDouble } [weight] - A weight for this query. The default is 1.0.
    * @returns { CtsQuery }
    */
jsonPropertyGeospatialQuery(...args) {
    const namer = bldrbase.getNamer(args, 'property-name');
    const paramdefs = [['property-name', types.XsString, false, true], ['regions', types.CtsRegion, false, true], ['options', types.XsString, false, true], ['weight', types.XsDouble, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.jsonPropertyGeospatialQuery', 2, new Set(['property-name', 'regions', 'options', 'weight']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.jsonPropertyGeospatialQuery', 2, false, paramdefs, args);
    return new types.CtsQuery('cts', 'json-property-geospatial-query', checkedArgs);

    }
/**
    * Returns a <code>cts:query</code> matching json properties by name which has specific property children representing latitude and longitude values for a point contained within the given geographic box, circle, or polygon, or equal to the given point. Points that lie between the southern boundary and the northern boundary of a box, travelling northwards, and between the western boundary and the eastern boundary of the box, travelling eastwards, will match. Points contained within the given radius of the center point of a circle will match, using the curved distance on the surface of the Earth. Points contained within the given polygon will match, using great circle arcs over a spherical model of the Earth as edges. An error may result if the polygon is malformed in some way. Points equal to the a given point will match, taking into account the fact that longitudes converge at the poles. Using the geospatial query constructors requires a valid geospatial license key; without a valid license key, searches that include geospatial queries will throw an exception. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.jsonPropertyPairGeospatialQuery|cts.jsonPropertyPairGeospatialQuery}
    * @method planBuilder.cts#jsonPropertyPairGeospatialQuery
    * @since 2.1.1
    * @param { XsString } [propertyName] - One or more parent property names to match. When multiple names are specified, the query matches if any name matches.
    * @param { XsString } [latitudePropertyNames] - One or more latitude property names to match. When multiple names are specified, the query matches if any name matches; however, only the first matching latitude child in any point instance will be checked.
    * @param { XsString } [longitudePropertyNames] - One or more longitude property names to match. When multiple names are specified, the query matches if any name matches; however, only the first matching longitude child in any point instance will be checked.
    * @param { CtsRegion } [regions] - One or more geographic boxes, circles, polygons, or points. Where multiple regions are specified, the query matches if any region matches.
    * @param { XsString } [options] - Options to this query. The default is (). <p>Options include:</p> <blockquote> <dl> <dt>"coordinate-system=<var>string</var>"</dt> <dd>Use the given coordinate system. Valid values are: <dl> <dt>wgs84</dt><dd>The WGS84 coordinate system.</dd> <dt>wgs84/double</dt><dd>The WGS84 coordinate system at double precision.</dd> <dt>etrs89</dt><dd>The ETRS89 coordinate system.</dd> <dt>etrs89/double</dt><dd>The ETRS89 coordinate system at double precision.</dd> <dt>raw</dt><dd>The raw (unmapped) coordinate system.</dd> <dt>raw/double</dt><dd>The raw coordinate system at double precision.</dd> </dl> </dd> <dt>"precision=<em>value</em>"</dt> <dd>Use the coordinate system at the given precision. Allowed values: <code>float</code> and <code>double</code>.</dd> <dt>"units=<em>value</em>"</dt> <dd>Measure distance and the radii of circles in the specified units. Allowed values: <code>miles</code> (default), <code>km</code>, <code>feet</code>, <code>meters</code>.</dd> <dt>"boundaries-included"</dt> <dd>Points on boxes', circles', and polygons' boundaries are counted as matching. This is the default.</dd> <dt>"boundaries-excluded"</dt> <dd>Points on boxes', circles', and polygons' boundaries are not counted as matching.</dd> <dt>"boundaries-latitude-excluded"</dt> <dd>Points on boxes' latitude boundaries are not counted as matching.</dd> <dt>"boundaries-longitude-excluded"</dt> <dd>Points on boxes' longitude boundaries are not counted as matching.</dd> <dt>"boundaries-south-excluded"</dt> <dd>Points on the boxes' southern boundaries are not counted as matching.</dd> <dt>"boundaries-west-excluded"</dt> <dd>Points on the boxes' western boundaries are not counted as matching.</dd> <dt>"boundaries-north-excluded"</dt> <dd>Points on the boxes' northern boundaries are not counted as matching.</dd> <dt>"boundaries-east-excluded"</dt> <dd>Points on the boxes' eastern boundaries are not counted as matching.</dd> <dt>"boundaries-circle-excluded"</dt> <dd>Points on circles' boundary are not counted as matching.</dd> <dt>"boundaries-endpoints-excluded"</dt> <dd>Points on linestrings' boundary (the endpoints) are not counted as matching.</dd> <dt>"cached"</dt> <dd>Cache the results of this query in the list cache.</dd> <dt>"uncached"</dt> <dd>Do not cache the results of this query in the list cache.</dd> <dt>"score-function=<em>function</em>"</dt> <dd>Use the selected scoring function. The score function may be: <dl> <dt>linear</dt><dd>Use a linear function of the difference between the specified query value and the matching value in the index to calculate a score for this range query.</dd> <dt>reciprocal</dt><dd>Use a reciprocal function of the difference between the specified query value and the matching value in the index to calculate a score for this range query.</dd> <dt>zero</dt><dd>This range query does not contribute to the score. This is the default.</dd> </dl> </dd> <dt>"slope-factor=<em>number</em>"</dt> <dd>Apply the given number as a scaling factor to the slope of the scoring function. The default is 1.0.</dd> <dt>"synonym"</dt> <dd>Specifies that all of the terms in the $regions parameter are considered synonyms for scoring purposes. The result is that occurances of more than one of the synonyms are scored as if there are more occurance of the same term (as opposed to having a separate term that contributes to score). </dd> </dl></blockquote>
    * @param { XsDouble } [weight] - A weight for this query. The default is 1.0.
    * @returns { CtsQuery }
    */
jsonPropertyPairGeospatialQuery(...args) {
    const namer = bldrbase.getNamer(args, 'property-name');
    const paramdefs = [['property-name', types.XsString, false, true], ['latitude-property-names', types.XsString, false, true], ['longitude-property-names', types.XsString, false, true], ['regions', types.CtsRegion, false, true], ['options', types.XsString, false, true], ['weight', types.XsDouble, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.jsonPropertyPairGeospatialQuery', 4, new Set(['property-name', 'latitude-property-names', 'longitude-property-names', 'regions', 'options', 'weight']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.jsonPropertyPairGeospatialQuery', 4, false, paramdefs, args);
    return new types.CtsQuery('cts', 'json-property-pair-geospatial-query', checkedArgs);

    }
/**
    * Returns a <code>cts:query</code> matching JSON properties by name with a range-index entry equal to a given value. Searches with the <code>cts:json-property-range-query</code> constructor require a property range index on the specified names; if there is no range index configured, then an exception is thrown. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.jsonPropertyRangeQuery|cts.jsonPropertyRangeQuery}
    * @method planBuilder.cts#jsonPropertyRangeQuery
    * @since 2.1.1
    * @param { XsString } [propertyName] - One or more property name to match. When multiple names are specified, the query matches if any name matches.
    * @param { XsString } [operator] - A comparison operator. <p> Operators include:</p> <blockquote><dl> <dt>"<"</dt> <dd>Match range index values less than $value.</dd> <dt>"<="</dt> <dd>Match range index values less than or equal to $value.</dd> <dt>">"</dt> <dd>Match range index values greater than $value.</dd> <dt>">="</dt> <dd>Match range index values greater than or equal to $value.</dd> <dt>"="</dt> <dd>Match range index values equal to $value.</dd> <dt>"!="</dt> <dd>Match range index values not equal to $value.</dd> </dl></blockquote>
    * @param { XsAnyAtomicType } [value] - One or more property values to match. When multiple values are specified, the query matches if any value matches. The value must be a type for which there is a range index defined.
    * @param { XsString } [options] - Options to this query. The default is (). <p> Options include:</p> <blockquote><dl> <dt>"collation=<em>URI</em>"</dt> <dd>Use the range index with the collation specified by <em>URI</em>. If not specified, then the default collation from the query is used. If a range index with the specified collation does not exist, an error is thrown.</dd> <dt>"cached"</dt> <dd>Cache the results of this query in the list cache.</dd> <dt>"uncached"</dt> <dd>Do not cache the results of this query in the list cache.</dd> <dt>"min-occurs=<em>number</em>"</dt> <dd>Specifies the minimum number of occurrences required. If fewer that this number of words occur, the fragment does not match. The default is 1.</dd> <dt>"max-occurs=<em>number</em>"</dt> <dd>Specifies the maximum number of occurrences required. If more than this number of words occur, the fragment does not match. The default is unbounded.</dd> <dt>"score-function=<em>function</em>"</dt> <dd>Use the selected scoring function. The score function may be: <dl> <dt>linear</dt><dd>Use a linear function of the difference between the specified query value and the matching value in the index to calculate a score for this range query.</dd> <dt>reciprocal</dt><dd>Use a reciprocal function of the difference between the specified query value and the matching value in the index to calculate a score for this range query.</dd> <dt>zero</dt><dd>This range query does not contribute to the score. This is the default.</dd> </dl> </dd> <dt>"slope-factor=<em>number</em>"</dt> <dd>Apply the given number as a scaling factor to the slope of the scoring function. The default is 1.0.</dd> <dt>"synonym"</dt> <dd>Specifies that all of the terms in the $value parameter are considered synonyms for scoring purposes. The result is that occurrences of more than one of the synonyms are scored as if there are more occurrences of the same term (as opposed to having a separate term that contributes to score). </dd> </dl></blockquote>
    * @param { XsDouble } [weight] - A weight for this query. The default is 1.0.
    * @returns { CtsQuery }
    */
jsonPropertyRangeQuery(...args) {
    const namer = bldrbase.getNamer(args, 'property-name');
    const paramdefs = [['property-name', types.XsString, false, true], ['operator', types.XsString, true, false], ['value', types.XsAnyAtomicType, false, true], ['options', types.XsString, false, true], ['weight', types.XsDouble, false, false]];
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
    * @param { XsString } [options] - Options. The default is (). <p> Options include:</p> <blockquote><dl> <dt>"type=<em>type</em>"</dt> <dd>Use the lexicon with the type specified by <em>type</em> (int, unsignedInt, long, unsignedLong, float, double, decimal, dateTime, time, date, gYearMonth, gYear, gMonth, gDay, yearMonthDuration, dayTimeDuration, string, anyURI, point, or long-lat-point)</dd> <dt>"collation=<em>URI</em>"</dt> <dd>Use the lexicon with the collation specified by <em>URI</em>.</dd> <dt>"nullable"</dt> <dd>Allow null values in tuples reported from cts:value-tuples when using this lexicon.</dd> <dt>"unchecked"</dt> <dd>Read the scalar type, collation and coordinate-system info only from the input. Do not check the definition against the context database.</dd> <dt>"coordinate-system=<em>name</em>"</dt> <dd>Create a reference to an index or lexicon based on the specified coordinate system. Allowed values: "wgs84", "wgs84/double", "raw", "raw/double". Only applicable if the index/lexicon value type is <code>point</code> or <code>long-lat-point</code>.</dd> <dt>"precision=<em>value</em>"</dt> <dd>Create a reference to an index or lexicon configured with the specified geospatial precision. Allowed values: <code>float</code> and <code>double</code>. Only applicable if the index/lexicon value type is <code>point</code> or <code>long-lat-point</code>. This value takes precedence over the precision implicit in the coordinate system name.</dd> </dl></blockquote>
    * @returns { CtsReference }
    */
jsonPropertyReference(...args) {
    const namer = bldrbase.getNamer(args, 'property');
    const paramdefs = [['property', types.XsString, true, false], ['options', types.XsString, false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.jsonPropertyReference', 1, new Set(['property', 'options']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.jsonPropertyReference', 1, false, paramdefs, args);
    return new types.CtsReference('cts', 'json-property-reference', checkedArgs);

    }
/**
    * Returns a <code>cts:query</code> matching JSON properties by name with the content constrained by the given <code>cts:query</code> in the second parameter. Searches for matches in the specified property and all of its descendants. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.jsonPropertyScopeQuery|cts.jsonPropertyScopeQuery}
    * @method planBuilder.cts#jsonPropertyScopeQuery
    * @since 2.1.1
    * @param { XsString } [propertyName] - One or more property names to match. When multiple names are specified, the query matches if any name matches.
    * @param { CtsQuery } [query] - A query for the property to match. If a string is entered, the string is treated as a <code>cts:word-query</code> of the specified string.
    * @returns { CtsQuery }
    */
jsonPropertyScopeQuery(...args) {
    const namer = bldrbase.getNamer(args, 'property-name');
    const paramdefs = [['property-name', types.XsString, false, true], ['query', types.CtsQuery, true, false]];
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
    * @param { XsAnyAtomicType } [value] - One or more property values to match. When multiple values are specified, the query matches if any value matches. The values can be strings, numbers or booleans. If the value is the empty sequence, the query matches null.
    * @param { XsString } [options] - Options to this query. The default is (). <p> Options include:</p> <blockquote><dl> <dt>"case-sensitive"</dt> <dd>A case-sensitive query.</dd> <dt>"case-insensitive"</dt> <dd>A case-insensitive query.</dd> <dt>"diacritic-sensitive"</dt> <dd>A diacritic-sensitive query.</dd> <dt>"diacritic-insensitive"</dt> <dd>A diacritic-insensitive query.</dd> <dt>"punctuation-sensitive"</dt> <dd>A punctuation-sensitive query.</dd> <dt>"punctuation-insensitive"</dt> <dd>A punctuation-insensitive query.</dd> <dt>"whitespace-sensitive"</dt> <dd>A whitespace-sensitive query.</dd> <dt>"whitespace-insensitive"</dt> <dd>A whitespace-insensitive query.</dd> <dt>"stemmed"</dt> <dd>A stemmed query.</dd> <dt>"unstemmed"</dt> <dd>An unstemmed query.</dd> <dt>"wildcarded"</dt> <dd>A wildcarded query.</dd> <dt>"unwildcarded"</dt> <dd>An unwildcarded query.</dd> <dt>"exact"</dt> <dd>An exact match query. Shorthand for "case-sensitive", "diacritic-sensitive", "punctuation-sensitive", "whitespace-sensitive", "unstemmed", and "unwildcarded". </dd> <dt>"lang=<em>iso639code</em>"</dt> <dd>Specifies the language of the query. The <em>iso639code</em> code portion is case-insensitive, and uses the languages specified by <a>ISO 639</a>. The default is specified in the database configuration.</dd> <dt>"min-occurs=<em>number</em>"</dt> <dd>Specifies the minimum number of occurrences required. If fewer that this number of words occur, the fragment does not match. The default is 1.</dd> <dt>"max-occurs=<em>number</em>"</dt> <dd>Specifies the maximum number of occurrences required. If more than this number of words occur, the fragment does not match. The default is unbounded.</dd> <dt>"synonym"</dt> <dd>Specifies that all of the terms in the $text parameter are considered synonyms for scoring purposes. The result is that occurrences of more than one of the synonyms are scored as if there are more occurrences of the same term (as opposed to having a separate term that contributes to score). </dd> <dt>"lexicon-expansion-limit=<em>number</em>"</dt> <dd>Specifies the limit for lexicon expansion. This puts a restriction on the number of lexicon expansions that can be performed. If the limit is exceeded, the server may raise an error depending on whether the "limit-check" option is set. The default value for this option will be 4096. </dd> <dt>"limit-check"</dt> <dd>Specifies that an error will be raised if the lexicon expansion exceeds the specified limit.</dd> <dt>"no-limit-check"</dt> <dd>Specifies that error will not be raised if the lexicon expansion exceeds the specified limit. The server will try to resolve the wildcard. </dd> </dl></blockquote>
    * @param { XsDouble } [weight] - A weight for this query. Higher weights move search results up in the relevance order. The default is 1.0. The weight should be between 64 and -16. Weights greater than 64 will have the same effect as a weight of 64. Weights less than the absolute value of 0.0625 (between -0.0625 and 0.0625) are rounded to 0, which means that they do not contribute to the score.
    * @returns { CtsQuery }
    */
jsonPropertyValueQuery(...args) {
    const namer = bldrbase.getNamer(args, 'property-name');
    const paramdefs = [['property-name', types.XsString, false, true], ['value', types.XsAnyAtomicType, false, true], ['options', types.XsString, false, true], ['weight', types.XsDouble, false, false]];
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
    * @param { XsString } [options] - Options to this query. The default is (). <p> Options include:</p> <blockquote><dl> <dt>"case-sensitive"</dt> <dd>A case-sensitive query.</dd> <dt>"case-insensitive"</dt> <dd>A case-insensitive query.</dd> <dt>"diacritic-sensitive"</dt> <dd>A diacritic-sensitive query.</dd> <dt>"diacritic-insensitive"</dt> <dd>A diacritic-insensitive query.</dd> <dt>"punctuation-sensitive"</dt> <dd>A punctuation-sensitive query.</dd> <dt>"punctuation-insensitive"</dt> <dd>A punctuation-insensitive query.</dd> <dt>"whitespace-sensitive"</dt> <dd>A whitespace-sensitive query.</dd> <dt>"whitespace-insensitive"</dt> <dd>A whitespace-insensitive query.</dd> <dt>"stemmed"</dt> <dd>A stemmed query.</dd> <dt>"unstemmed"</dt> <dd>An unstemmed query.</dd> <dt>"wildcarded"</dt> <dd>A wildcarded query.</dd> <dt>"unwildcarded"</dt> <dd>An unwildcarded query.</dd> <dt>"exact"</dt> <dd>An exact match query. Shorthand for "case-sensitive", "diacritic-sensitive", "punctuation-sensitive", "whitespace-sensitive", "unstemmed", and "unwildcarded". </dd> <dt>"lang=<em>iso639code</em>"</dt> <dd>Specifies the language of the query. The <em>iso639code</em> code portion is case-insensitive, and uses the languages specified by <a>ISO 639</a>. The default is specified in the database configuration.</dd> <dt>"distance-weight=<em>number</em>"</dt> <dd>A weight applied based on the minimum distance between matches of this query. Higher weights add to the importance of proximity (as opposed to term matches) when the relevance order is calculated. The default value is 0.0 (no impact of proximity). The weight should be between 64 and -16. Weights greater than 64 will have the same effect as a weight of 64. This parameter has no effect if the <code>word positions</code> index is not enabled. This parameter has no effect on searches that use score-simple, score-random, or score-zero (because those scoring algorithms do not consider term frequency, proximity is irrelevant). </dd> <dt>"min-occurs=<em>number</em>"</dt> <dd>Specifies the minimum number of occurrences required. If fewer that this number of words occur, the fragment does not match. The default is 1.</dd> <dt>"max-occurs=<em>number</em>"</dt> <dd>Specifies the maximum number of occurrences required. If more than this number of words occur, the fragment does not match. The default is unbounded.</dd> <dt>"synonym"</dt> <dd>Specifies that all of the terms in the $text parameter are considered synonyms for scoring purposes. The result is that occurrences of more than one of the synonyms are scored as if there are more occurrences of the same term (as opposed to having a separate term that contributes to score). </dd> <dt>"lexicon-expand=<em>value</em>"</dt> <dd>The <em>value</em> is one of <code>full</code>, <code>prefix-postfix</code>, <code>off</code>, or <code>heuristic</code> (the default is <code>heuristic</code>). An option with a value of <code>lexicon-expand=full</code> specifies that wildcards are resolved by expanding the pattern to words in a lexicon (if there is one available), and turning into a series of <code>cts:word-queries</code>, even if this takes a long time to evaluate. An option with a value of <code>lexicon-expand=prefix-postfix</code> specifies that wildcards are resolved by expanding the pattern to the pre- and postfixes of the words in the word lexicon (if there is one), and turning the query into a series of character queries, even if it takes a long time to evaluate. An option with a value of <code>lexicon-expand=off</code> specifies that wildcards are only resolved by looking up character patterns in the search pattern index, not in the lexicon. An option with a value of <code>lexicon-expand=heuristic</code>, which is the default, specifies that wildcards are resolved by using a series of internal rules, such as estimating the number of lexicon entries that need to be scanned, seeing if the estimate crosses certain thresholds, and (if appropriate), using another way besides lexicon expansion to resolve the query. </dd> * <dt>"lexicon-expansion-limit=<em>number</em>"</dt> <dd>Specifies the limit for lexicon expansion. This puts a restriction on the number of lexicon expansions that can be performed. If the limit is exceeded, the server may raise an error depending on whether the "limit-check" option is set. The default value for this option will be 4096. </dd> <dt>"limit-check"</dt> <dd>Specifies that an error will be raised if the lexicon expansion exceeds the specified limit.</dd> <dt>"no-limit-check"</dt> <dd>Specifies that error will not be raised if the lexicon expansion exceeds the specified limit. The server will try to resolve the wildcard. </dd> </dl></blockquote>
    * @param { XsDouble } [weight] - A weight for this query. Higher weights move search results up in the relevance order. The default is 1.0. The weight should be between 64 and -16. Weights greater than 64 will have the same effect as a weight of 64. Weights less than the absolute value of 0.0625 (between -0.0625 and 0.0625) are rounded to 0, which means that they do not contribute to the score.
    * @returns { CtsQuery }
    */
jsonPropertyWordQuery(...args) {
    const namer = bldrbase.getNamer(args, 'property-name');
    const paramdefs = [['property-name', types.XsString, false, true], ['text', types.XsString, false, true], ['options', types.XsString, false, true], ['weight', types.XsDouble, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.jsonPropertyWordQuery', 2, new Set(['property-name', 'text', 'options', 'weight']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.jsonPropertyWordQuery', 2, false, paramdefs, args);
    return new types.CtsQuery('cts', 'json-property-word-query', checkedArgs);

    }
/**
    * Returns a query that matches all documents where <code>$query</code> matches document-locks. When searching documents or document-properties, <code>cts:locks-fragment-query</code> provides a convenient way to additionally constrain the search against document-locks fragments. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.locksFragmentQuery|cts.locksFragmentQuery}
    * @method planBuilder.cts#locksFragmentQuery
    * @since 2.1.1
    * @param { CtsQuery } [query] - A query to be matched against the locks fragment.
    * @returns { CtsQuery }
    */
locksFragmentQuery(...args) {
    const paramdef = ['query', types.CtsQuery, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('cts.locksFragmentQuery', 1, paramdef, args);
    return new types.CtsQuery('cts', 'locks-fragment-query', checkedArgs);
    }
/**
    * Returns only documents before LSQT or a timestamp before LSQT for stable query results. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.lsqtQuery|cts.lsqtQuery}
    * @method planBuilder.cts#lsqtQuery
    * @since 2.1.1
    * @param { XsString } [temporalCollection] - The name of the temporal collection.
    * @param { XsDateTime } [timestamp] - Return only temporal documents with a system start time less than or equal to this value. Default is <code>temporal:get-lsqt($temporal-collection)</code>. Timestamps larger than LSQT are rejected.
    * @param { XsString } [options] - Options to this query. The default is (). <p> Options include:</p> <blockquote><dl> <dt>"cached"</dt> <dd>Cache the results of this query in the list cache.</dd> <dt>"uncached"</dt> <dd>Do not cache the results of this query in the list cache.</dd> <dt>"cached-incremental"</dt> <dd>Break down the query into sub-queries and then cache each one of them for better performance. This is enabled, by default.</dd> <dt>"score-function=<em>function</em>"</dt> <dd>Use the selected scoring function. The score function may be: <dl> <dt>linear</dt><dd>Use a linear function of the difference between the specified query value and the matching value in the index to calculate a score for this range query.</dd> <dt>reciprocal</dt><dd>Use a reciprocal function of the difference between the specified query value and the matching value in the index to calculate a score for this range query.</dd> <dt>zero</dt><dd>This range query does not contribute to the score. This is the default.</dd> </dl> </dd> <dt>"slope-factor=<em>number</em>"</dt> <dd>Apply the given number as a scaling factor to the slope of the scoring function. The default is 1.0.</dd> </dl></blockquote>
    * @param { XsDouble } [weight] - A weight for this query. Higher weights move search results up in the relevance order. The default is 1.0. The weight should be between 64 and -16. Weights greater than 64 will have the same effect as a weight of 64. Weights less than the absolute value of 0.0625 (between -0.0625 and 0.0625) are rounded to 0, which means that they do not contribute to the score.
    * @returns { CtsQuery }
    */
lsqtQuery(...args) {
    const namer = bldrbase.getNamer(args, 'temporal-collection');
    const paramdefs = [['temporal-collection', types.XsString, true, false], ['timestamp', types.XsDateTime, false, false], ['options', types.XsString, false, true], ['weight', types.XsDouble, false, false]];
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
    * @param { XsString } [options] - Options to this query. The default value is (). <p> Options include:</p> <blockquote><dl> <dt>"ordered"</dt> <dd>Any near-query matches must occur in the order of the specified sub-queries.</dd> <dt>"unordered"</dt> <dd>Any near-query matches will satisfy the query, regardless of the order they were specified. </dd> <dt>"minimum-distance"</dt> <dd>The minimum distance between two matching queries. The results match if the two queries match and the minimum distance between the two matches is greater than or equal to the specified minimum distance. The default value is zero. A negative distance is treated as 0. </dd> </dl></blockquote>
    * @param { XsDouble } [distanceWeight] - A weight attributed to the distance for this query. Higher weights add to the importance of distance (as opposed to term matches) when the relevance order is calculated. The default value is 1.0. The weight should be between 64 and -16. Weights greater than 64 will have the same effect as a weight of 64. Weights less than the absolute value of 0.0625 (between -0.0625 and 0.0625) are rounded to 0, which means that they do not contribute to the score. This parameter has no effect if the <code>word positions</code> index is not enabled.
    * @returns { CtsQuery }
    */
nearQuery(...args) {
    const namer = bldrbase.getNamer(args, 'queries');
    const paramdefs = [['queries', types.CtsQuery, false, true], ['distance', types.XsDouble, false, false], ['options', types.XsString, false, true], ['distance-weight', types.XsDouble, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.nearQuery', 1, new Set(['queries', 'distance', 'options', 'distance-weight']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.nearQuery', 1, false, paramdefs, args);
    return new types.CtsQuery('cts', 'near-query', checkedArgs);

    }
/**
    * Returns a query matching the first subquery, where those matches do not occur within 0 distance of the other query. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.notInQuery|cts.notInQuery}
    * @method planBuilder.cts#notInQuery
    * @since 2.1.1
    * @param { CtsQuery } [positiveQuery] - A positive query, specifying the search results filtered in.
    * @param { CtsQuery } [negativeQuery] - A negative query, specifying the search results to filter out.
    * @returns { CtsQuery }
    */
notInQuery(...args) {
    const namer = bldrbase.getNamer(args, 'positive-query');
    const paramdefs = [['positive-query', types.CtsQuery, true, false], ['negative-query', types.CtsQuery, true, false]];
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
    const paramdef = ['query', types.CtsQuery, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('cts.notQuery', 1, paramdef, args);
    return new types.CtsQuery('cts', 'not-query', checkedArgs);
    }
/**
    * Returns a query specifying the union of the matches specified by the sub-queries. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.orQuery|cts.orQuery}
    * @method planBuilder.cts#orQuery
    * @since 2.1.1
    * @param { CtsQuery } [queries] - A sequence of sub-queries.
    * @param { XsString } [options] - Options to this query. The default is <span>()</span>. <p> Options include: </p> <blockquote><dl> <dt>"synonym"</dt> <dd>Specifies that all of the terms in the $queries parameter are considered synonyms for scoring purposes. The result is that occurrences of more than one of the synonyms are scored as if there are more occurrences of the same term (as opposed to having a separate term that contributes to score). </dd> </dl></blockquote>
    * @returns { CtsQuery }
    */
orQuery(...args) {
    const namer = bldrbase.getNamer(args, 'queries');
    const paramdefs = [['queries', types.CtsQuery, false, true], ['options', types.XsString, false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.orQuery', 1, new Set(['queries', 'options']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.orQuery', 1, false, paramdefs, args);
    return new types.CtsQuery('cts', 'or-query', checkedArgs);

    }
/**
    * Returns a <code>cts:query</code> matching path expressions whose content represents a point contained within the given geographic box, circle, or polygon, or equal to the given point. Points that lie between the southern boundary and the northern boundary of a box, travelling northwards, and between the western boundary and the eastern boundary of the box, travelling eastwards, will match. Points contained within the given radius of the center point of a circle will match, using the curved distance on the surface of the Earth. Points contained within the given polygon will match, using great circle arcs over a spherical model of the Earth as edges. An error may result if the polygon is malformed in some way. Points equal to the a given point will match, taking into account the fact that longitudes converge at the poles. Using the geospatial query constructors requires a valid geospatial license key; without a valid license key, searches that include geospatial queries will throw an exception. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.pathGeospatialQuery|cts.pathGeospatialQuery}
    * @method planBuilder.cts#pathGeospatialQuery
    * @since 2.1.1
    * @param { XsString } [pathExpression] - One or more path expressions to match. When multiple path expressions are specified, the query matches if any path expression matches.
    * @param { CtsRegion } [regions] - One or more geographic boxes, circles, polygons, or points. Where multiple regions are specified, the query matches if any region matches.
    * @param { XsString } [options] - Options to this query. The default is (). <p>Options include:</p> <blockquote> <dl> <dt>"coordinate-system=<var>string</var>"</dt> <dd>Use the given coordinate system. Valid values are: <dl> <dt>wgs84</dt><dd>The WGS84 coordinate system.</dd> <dt>wgs84/double</dt><dd>The WGS84 coordinate system at double precision.</dd> <dt>etrs89</dt><dd>The ETRS89 coordinate system.</dd> <dt>etrs89/double</dt><dd>The ETRS89 coordinate system at double precision.</dd> <dt>raw</dt><dd>The raw (unmapped) coordinate system.</dd> <dt>raw/double</dt><dd>The raw coordinate system at double precision.</dd> </dl> </dd> <dt>"precision=<em>value</em>"</dt> <dd>Use the coordinate system at the given precision. Allowed values: <code>float</code> and <code>double</code>.</dd> <dt>"units=<em>value</em>"</dt> <dd>Measure distance and the radii of circles in the specified units. Allowed values: <code>miles</code> (default), <code>km</code>, <code>feet</code>, <code>meters</code>.</dd> <dt>"boundaries-included"</dt> <dd>Points on boxes', circles', and polygons' boundaries are counted as matching. This is the default.</dd> <dt>"boundaries-excluded"</dt> <dd>Points on boxes', circles', and polygons' boundaries are not counted as matching.</dd> <dt>"boundaries-latitude-excluded"</dt> <dd>Points on boxes' latitude boundaries are not counted as matching.</dd> <dt>"boundaries-longitude-excluded"</dt> <dd>Points on boxes' longitude boundaries are not counted as matching.</dd> <dt>"boundaries-south-excluded"</dt> <dd>Points on the boxes' southern boundaries are not counted as matching.</dd> <dt>"boundaries-west-excluded"</dt> <dd>Points on the boxes' western boundaries are not counted as matching.</dd> <dt>"boundaries-north-excluded"</dt> <dd>Points on the boxes' northern boundaries are not counted as matching.</dd> <dt>"boundaries-east-excluded"</dt> <dd>Points on the boxes' eastern boundaries are not counted as matching.</dd> <dt>"boundaries-circle-excluded"</dt> <dd>Points on circles' boundary are not counted as matching.</dd> <dt>"boundaries-endpoints-excluded"</dt> <dd>Points on linestrings' boundary (the endpoints) are not counted as matching.</dd> <dt>"cached"</dt> <dd>Cache the results of this query in the list cache.</dd> <dt>"uncached"</dt> <dd>Do not cache the results of this query in the list cache.</dd> <dt>"type=long-lat-point"</dt> <dd>Specifies the format for the point in the data as longitude first, latitude second.</dd> <dt>"type=point"</dt> <dd>Specifies the format for the point in the data as latitude first, longitude second. This is the default format.</dd> <dt>"score-function=<em>function</em>"</dt> <dd>Use the selected scoring function. The score function may be: <dl> <dt>linear</dt><dd>Use a linear function of the difference between the specified query value and the matching value in the index to calculate a score for this range query.</dd> <dt>reciprocal</dt><dd>Use a reciprocal function of the difference between the specified query value and the matching value in the index to calculate a score for this range query.</dd> <dt>zero</dt><dd>This range query does not contribute to the score. This is the default.</dd> </dl> </dd> <dt>"slope-factor=<em>number</em>"</dt> <dd>Apply the given number as a scaling factor to the slope of the scoring function. The default is 1.0.</dd> <dt>"synonym"</dt> <dd>Specifies that all of the terms in the $regions parameter are considered synonyms for scoring purposes. The result is that occurances of more than one of the synonyms are scored as if there are more occurance of the same term (as opposed to having a separate term that contributes to score). </dd> </dl></blockquote>
    * @param { XsDouble } [weight] - A weight for this query. The default is 1.0.
    * @returns { CtsQuery }
    */
pathGeospatialQuery(...args) {
    const namer = bldrbase.getNamer(args, 'path-expression');
    const paramdefs = [['path-expression', types.XsString, false, true], ['regions', types.CtsRegion, false, true], ['options', types.XsString, false, true], ['weight', types.XsDouble, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.pathGeospatialQuery', 2, new Set(['path-expression', 'regions', 'options', 'weight']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.pathGeospatialQuery', 2, false, paramdefs, args);
    return new types.CtsQuery('cts', 'path-geospatial-query', checkedArgs);

    }
/**
    * Returns a <code>cts:query</code> matching documents where the content addressed by an XPath expression satisfies the specified relationship (=, <, >, etc.) with respect to the input criteria values. A path range index must exist for each path when you perform a search. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.pathRangeQuery|cts.pathRangeQuery}
    * @method planBuilder.cts#pathRangeQuery
    * @since 2.1.1
    * @param { XsString } [pathExpression] - One or more XPath expressions that identify the content to match. When multiple paths are specified, the query matches if any path matches.
    * @param { XsString } [operator] - A comparison operator. <p> Operators include:</p> <blockquote><dl> <dt>"<"</dt> <dd>Match range index values less than $value.</dd> <dt>"<="</dt> <dd>Match range index values less than or equal to $value.</dd> <dt>">"</dt> <dd>Match range index values greater than $value.</dd> <dt>">="</dt> <dd>Match range index values greater than or equal to $value.</dd> <dt>"="</dt> <dd>Match range index values equal to $value.</dd> <dt>"!="</dt> <dd>Match range index values not equal to $value.</dd> </dl></blockquote>
    * @param { XsAnyAtomicType } [value] - One or more values to match. These values are compared to the value(s) addressed by the <code>path-expression</code> parameter. When multiple When multiple values are specified, the query matches if any value matches. The value must be a type for which there is a range index defined.
    * @param { XsString } [options] - Options to this query. The default is (). <p> Options include:</p> <blockquote><dl> <dt>"collation=<em>URI</em>"</dt> <dd>Use the range index with the collation specified by <em>URI</em>. If not specified, then the default collation from the query is used. If a range index with the specified collation does not exist, an error is thrown.</dd> <dt>"cached"</dt> <dd>Cache the results of this query in the list cache.</dd> <dt>"uncached"</dt> <dd>Do not cache the results of this query in the list cache.</dd> <dt>"min-occurs=<em>number</em>"</dt> <dd>Specifies the minimum number of occurrences required. If fewer that this number of words occur, the fragment does not match. The default is 1.</dd> <dt>"max-occurs=<em>number</em>"</dt> <dd>Specifies the maximum number of occurrences required. If more than this number of words occur, the fragment does not match. The default is unbounded.</dd> <dt>"score-function=<em>function</em>"</dt> <dd>Use the selected scoring function. The score function may be: <dl> <dt>linear</dt><dd>Use a linear function of the difference between the specified query value and the matching value in the index to calculate a score for this range query.</dd> <dt>reciprocal</dt><dd>Use a reciprocal function of the difference between the specified query value and the matching value in the index to calculate a score for this range query.</dd> <dt>zero</dt><dd>This range query does not contribute to the score. This is the default.</dd> </dl> </dd> <dt>"slope-factor=<em>number</em>"</dt> <dd>Apply the given number as a scaling factor to the slope of the scoring function. The default is 1.0.</dd> <dt>"synonym"</dt> <dd>Specifies that all of the terms in the $value parameter are considered synonyms for scoring purposes. The result is that occurrences of more than one of the synonyms are scored as if there are more occurrences of the same term (as opposed to having a separate term that contributes to score). </dd> </dl></blockquote>
    * @param { XsDouble } [weight] - A weight for this query. The default is 1.0.
    * @returns { CtsQuery }
    */
pathRangeQuery(...args) {
    const namer = bldrbase.getNamer(args, 'path-expression');
    const paramdefs = [['path-expression', types.XsString, false, true], ['operator', types.XsString, true, false], ['value', types.XsAnyAtomicType, false, true], ['options', types.XsString, false, true], ['weight', types.XsDouble, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.pathRangeQuery', 3, new Set(['path-expression', 'operator', 'value', 'options', 'weight']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.pathRangeQuery', 3, false, paramdefs, args);
    return new types.CtsQuery('cts', 'path-range-query', checkedArgs);

    }
/**
    * Creates a reference to a path value lexicon, for use as a parameter to cts:value-tuples. Since lexicons are implemented with range indexes, this function will throw an exception if the specified range index does not exist. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.pathReference|cts.pathReference}
    * @method planBuilder.cts#pathReference
    * @since 2.1.1
    * @param { XsString } [pathExpression] - A path range index expression.
    * @param { XsString } [options] - Options. The default is (). <p> Options include:</p> <blockquote><dl> <dt>"type=<em>type</em>"</dt> <dd>Use the lexicon with the type specified by <em>type</em> (int, unsignedInt, long, unsignedLong, float, double, decimal, dateTime, time, date, gYearMonth, gYear, gMonth, gDay, yearMonthDuration, dayTimeDuration, string, anyURI, point, or long-lat-point)</dd> <dt>"collation=<em>URI</em>"</dt> <dd>Use the lexicon with the collation specified by <em>URI</em>.</dd> <dt>"nullable"</dt> <dd>Allow null values in tuples reported from cts:value-tuples when using this lexicon.</dd> <dt>"unchecked"</dt> <dd>Read the scalar type, collation and coordinate-system info only from the input. Do not check the definition against the context database.</dd> <dt>"coordinate-system=<em>name</em>"</dt> <dd>Create a reference to an index or lexicon based on the specified coordinate system. Allowed values: "wgs84", "wgs84/double", "raw", "raw/double". Only applicable if the index/lexicon value type is <code>point</code> or <code>long-lat-point</code>.</dd> <dt>"precision=<em>value</em>"</dt> <dd>Create a reference to an index or lexicon configured with the specified geospatial precision. Allowed values: <code>float</code> and <code>double</code>. Only applicable if the index/lexicon value type is <code>point</code> or <code>long-lat-point</code>. This value takes precedence over the precision implicit in the coordinate system name.</dd> </dl></blockquote>
    * @param { MapMap } [map] - A map of namespace bindings. The keys should be namespace prefixes and the values should be namespace URIs. These namespace bindings will be added to the in-scope namespace bindings in the interpretation of the path.
    * @returns { CtsReference }
    */
pathReference(...args) {
    const namer = bldrbase.getNamer(args, 'path-expression');
    const paramdefs = [['path-expression', types.XsString, true, false], ['options', types.XsString, false, true], ['map', types.MapMap, false, false]];
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
    const paramdefs = [['start', types.XsDateTime, true, false], ['end', types.XsDateTime, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.period', 2, new Set(['start', 'end']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.period', 2, false, paramdefs, args);
    return new types.CtsPeriod('cts', 'period', checkedArgs);

    }
/**
    * Returns a <code>cts:query</code> matching documents that have relevant pair of period values. Searches with the <code>cts:period-compare-query</code> constructor require two valid names of period, if the either of the specified period does not exist, then an exception is thrown. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.periodCompareQuery|cts.periodCompareQuery}
    * @method planBuilder.cts#periodCompareQuery
    * @since 2.1.1
    * @param { XsString } [axis1] - Name of the first axis to compare
    * @param { XsString } [operator] - A comparison operator. Period is the two timestamps contained in the axis. <p> Operators include:</p> <blockquote><dl> <dt>"aln_equals"</dt> <dd>Match documents whose period1 equals period2.</dd> <dt>"aln_contains"</dt> <dd>Match documents whose period1 contains period2. i.e. period1 starts before period2 starts and ends before period2 ends.</dd> <dt>"aln_contained_by"</dt> <dd>Match documents whose period1 is contained by period2.</dd> <dt>"aln_meets"</dt> <dd>Match documents whose period1 meets period2, i.e. period1 ends at period2 start.</dd> <dt>"aln_met_by"</dt> <dd>Match documents whose period1 meets period2, i.e. period1 starts at period2 end.</dd> <dt>"aln_before"</dt> <dd>Match documents whose period1 is before period2, i.e. period1 ends before period2 starts.</dd> <dt>"aln_after"</dt> <dd>Match documents whose period1 is after period2, i.e. period1 starts after period2 ends.</dd> <dt>"aln_starts"</dt> <dd>Match documents whose period1 starts period2, i.e. period1 starts at period2 start and ends before period2 ends.</dd> <dt>"aln_started_by"</dt> <dd>Match documents whose period2 starts period1, i.e. period1 starts at period2 start and ends after period2 ends.</dd> <dt>"aln_finishes"</dt> <dd>Match documents whose period1 finishes period2, i.e. period1 finishes at period2 finish and starts after period2 starts.</dd> <dt>"aln_finished_by"</dt> <dd>Match documents whose period2 finishes period1, i.e. period1 finishes at period2 finish and starts before period2 starts.</dd> <dt>"aln_overlaps"</dt> <dd>Match documents whose period1 overlaps period2, i.e. period1 starts before period2 start and ends before period2 ends but after period2 starts.</dd> <dt>"aln_overlapped_by"</dt> <dd>Match documents whose period2 overlaps period1, i.e. period1 starts after period2 start but before period2 ends and ends after period2 ends.</dd> <dt>"iso_contains"</dt> <dd>Match documents whose period1 contains period2 in sql 2011 standard. i.e. period1 starts before or at period2 starts and ends after or at period2 ends.</dd> <dt>"iso_overlaps"</dt> <dd>Match documents whose period1 overlaps period2 in sql 2011 standard. i.e. period1 and period2 have common time period.</dd> <dt>"iso_succeeds"</dt> <dd>Match documents whose period1 succeeds period2 in sql 2011 standard. i.e. period1 starts at or after period2 ends</dd> <dt>"iso_precedes"</dt> <dd>Match documents whose period1 precedes period2 in sql 2011 standard. i.e. period1 ends at or before period2 ends</dd> <dt>"iso_succeeds"</dt> <dd>Match documents whose period1 succeeds period2 in sql 2011 standard. i.e. period1 starts at or after period2 ends</dd> <dt>"iso_precedes"</dt> <dd>Match documents whose period1 precedes period2 in sql 2011 standard. i.e. period1 ends at or before period2 ends</dd> <dt>"iso_imm_succeeds"</dt> <dd>Match documents whose period1 immediately succeeds period2 in sql 2011 standard. i.e. period1 starts at period2 ends</dd> <dt>"iso_imm_precedes"</dt> <dd>Match documents whose period1 immediately precedes period2 in sql 2011 standard. i.e. period1 ends at period2 ends</dd> </dl></blockquote>
    * @param { XsString } [axis2] - Name of the second period to compare
    * @param { XsString } [options] - Options to this query. The default is (). <p> Options include:</p> <blockquote><dl> <dt>"cached"</dt> <dd>Cache the results of this query in the list cache.</dd> <dt>"uncached"</dt> <dd>Do not cache the results of this query in the list cache.</dd> </dl></blockquote>
    * @returns { CtsQuery }
    */
periodCompareQuery(...args) {
    const namer = bldrbase.getNamer(args, 'axis-1');
    const paramdefs = [['axis-1', types.XsString, true, false], ['operator', types.XsString, true, false], ['axis-2', types.XsString, true, false], ['options', types.XsString, false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.periodCompareQuery', 3, new Set(['axis-1', 'operator', 'axis-2', 'options']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.periodCompareQuery', 3, false, paramdefs, args);
    return new types.CtsQuery('cts', 'period-compare-query', checkedArgs);

    }
/**
    * Returns a <code>cts:query</code> matching axis by name with a period value with an operator. Searches with the <code>cts:period-range-query</code> constructor require a axis definition on the axis name; if there is no axis configured, then an exception is thrown. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.periodRangeQuery|cts.periodRangeQuery}
    * @method planBuilder.cts#periodRangeQuery
    * @since 2.1.1
    * @param { XsString } [axisName] - One or more axis to match on.
    * @param { XsString } [operator] - A comparison operator. <p> Operators include:</p> <blockquote><dl> <dt>"aln_equals"</dt> <dd>Match documents whose period1 equals value.</dd> <dt>"aln_contains"</dt> <dd>Match documents whose period1 contains value. i.e. period1 starts before value starts and ends before value ends.</dd> <dt>"aln_contained_by"</dt> <dd>Match documents whose period1 is contained by value.</dd> <dt>"aln_meets"</dt> <dd>Match documents whose period1 meets value, i.e. period1 ends at value start.</dd> <dt>"aln_met_by"</dt> <dd>Match documents whose period1 meets value, i.e. period1 starts at value end.</dd> <dt>"aln_before"</dt> <dd>Match documents whose period1 is before value, i.e. period1 ends before value starts.</dd> <dt>"aln_after"</dt> <dd>Match documents whose period1 is after value, i.e. period1 starts after value ends.</dd> <dt>"aln_starts"</dt> <dd>Match documents whose period1 starts value, i.e. period1 starts at value start and ends before value ends.</dd> <dt>"aln_started_by"</dt> <dd>Match documents whose value starts period1, i.e. period1 starts at value start and ends after value ends.</dd> <dt>"aln_finishes"</dt> <dd>Match documents whose period1 finishes value, i.e. period1 finishes at value finish and starts after value starts.</dd> <dt>"aln_finished_by"</dt> <dd>Match documents whose value finishes period1, i.e. period1 finishes at value finish and starts before value starts.</dd> <dt>"aln_overlaps"</dt> <dd>Match documents whose period1 overlaps value, i.e. period1 starts before value start and ends before value ends but after value starts.</dd> <dt>"aln_overlapped_by"</dt> <dd>Match documents whose value overlaps period1, i.e. period1 starts after value start but before value ends and ends after value ends.</dd> <dt>"iso_contains"</dt> <dd>Match documents whose period1 contains value in sql 2011 standard. i.e. period1 starts before or at value starts and ends after or at value ends.</dd> <dt>"iso_overlaps"</dt> <dd>Match documents whose period1 overlaps value in sql 2011 standard. i.e. period1 and value have common time period.</dd> <dt>"iso_succeeds"</dt> <dd>Match documents whose period1 succeeds value in sql 2011 standard. i.e. period1 starts at or after value ends</dd> <dt>"iso_precedes"</dt> <dd>Match documents whose period1 precedes value in sql 2011 standard. i.e. period1 ends at or before value ends</dd> <dt>"iso_imm_succeeds"</dt> <dd>Match documents whose period1 immediately succeeds value in sql 2011 standard. i.e. period1 starts at value end</dd> <dt>"iso_imm_precedes"</dt> <dd>Match documents whose period1 immediately precedes value in sql 2011 standard. i.e. period1 ends at value end</dd> </dl></blockquote>
    * @param { CtsPeriod } [period] - the cts:period to perform operations on. When multiple values are specified, the query matches if any value matches.
    * @param { XsString } [options] - Options to this query. The default is (). <p> Options include:</p> <blockquote><dl> <dt>"cached"</dt> <dd>Cache the results of this query in the list cache.</dd> <dt>"uncached"</dt> <dd>Do not cache the results of this query in the list cache.</dd> <dt>"min-occurs=<em>number</em>"</dt> <dd>Specifies the minimum number of occurrences required. If fewer that this number of words occur, the fragment does not match. The default is 1.</dd> <dt>"max-occurs=<em>number</em>"</dt> <dd>Specifies the maximum number of occurrences required. If more than this number of words occur, the fragment does not match. The default is unbounded.</dd> <dt>"score-function=<em>function</em>"</dt> <dd>Use the selected scoring function. The score function may be: <dl> <dt>linear</dt><dd>Use a linear function of the difference between the specified query value and the matching value in the index to calculate a score for this range query.</dd> <dt>reciprocal</dt><dd>Use a reciprocal function of the difference between the specified query value and the matching value in the index to calculate a score for this range query.</dd> </dl> <dt>zero</dt><dd>This range query does not contribute to the score. This is the default.</dd> </dd> <dt>"slope-factor=<em>number</em>"</dt> <dd>Apply the given number as a scaling factor to the slope of the scoring function. The default is 1.0.</dd> </dl></blockquote>
    * @returns { CtsQuery }
    */
periodRangeQuery(...args) {
    const namer = bldrbase.getNamer(args, 'axis-name');
    const paramdefs = [['axis-name', types.XsString, false, true], ['operator', types.XsString, true, false], ['period', types.CtsPeriod, false, true], ['options', types.XsString, false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.periodRangeQuery', 2, new Set(['axis-name', 'operator', 'period', 'options']), paramdefs, args) :
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
    const paramdefs = [['latitude', types.XsDouble, true, false], ['longitude', types.XsDouble, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.point', 2, new Set(['latitude', 'longitude']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.point', 2, false, paramdefs, args);
    return new types.CtsPoint('cts', 'point', checkedArgs);

    }
/**
    * Returns a geospatial polygon value. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.polygon|cts.polygon}
    * @method planBuilder.cts#polygon
    * @since 2.1.1
    * @param { XsAnyAtomicType } [vertices] - The vertices of the polygon, given in order. No edge may cover more than 180 degrees of either latitude or longitude. The polygon as a whole may not encompass both poles. These constraints are necessary to ensure an unambiguous interpretation of the polygon. There must be at least three vertices. The first vertex should be identical to the last vertex to close the polygon. vertexes.
    * @returns { CtsPolygon }
    */
polygon(...args) {
    const paramdef = ['vertices', types.XsAnyAtomicType, false, true];
    const checkedArgs = bldrbase.makeSingleArgs('cts.polygon', 1, paramdef, args);
    return new types.CtsPolygon('cts', 'polygon', checkedArgs);
    }
/**
    * Returns a query that matches all documents where <code>$query</code> matches document-properties. When searching documents or document-locks, this query type provides a convenient way to additionally constrain the search against document-properties fragments. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.propertiesFragmentQuery|cts.propertiesFragmentQuery}
    * @method planBuilder.cts#propertiesFragmentQuery
    * @since 2.1.1
    * @param { CtsQuery } [query] - A query to be matched against the properties fragment.
    * @returns { CtsQuery }
    */
propertiesFragmentQuery(...args) {
    const paramdef = ['query', types.CtsQuery, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('cts.propertiesFragmentQuery', 1, paramdef, args);
    return new types.CtsQuery('cts', 'properties-fragment-query', checkedArgs);
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
    const paramdefs = [['text', types.XsString, true, false], ['language', types.XsString, false, false], ['partOfSpeech', types.XsString, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.stem', 1, new Set(['text', 'language', 'partOfSpeech']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.stem', 1, false, paramdefs, args);
    return new types.XsString('cts', 'stem', checkedArgs);

    }
/**
    * Tokenizes text into words, punctuation, and spaces. Returns output in the type <code>cts:token</code>, which has subtypes <code>cts:word</code>, <code>cts:punctuation</code>, and <code>cts:space</code>, all of which are subtypes of <code>xs:string</code>. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.tokenize|cts.tokenize}
    * @method planBuilder.cts#tokenize
    * @since 2.1.1
    * @param { XsString } [text] - A word or phrase to tokenize.
    * @param { XsString } [language] - A language to use for tokenization. If not supplied, it uses the database default language.
    * @param { XsString } [field] - A field to use for tokenization. If the field has custom tokenization rules, they will be used. If no field is supplied or the field has no custom tokenization rules, the default tokenization rules are used.
    * @returns { XsString }
    */
tokenize(...args) {
    const namer = bldrbase.getNamer(args, 'text');
    const paramdefs = [['text', types.XsString, true, false], ['language', types.XsString, false, false], ['field', types.XsString, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.tokenize', 1, new Set(['text', 'language', 'field']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.tokenize', 1, false, paramdefs, args);
    return new types.XsString('cts', 'tokenize', checkedArgs);

    }
/**
    * Returns a <code>cts:query</code> matching triples with a triple index entry equal to the given values. Searches with the <code>cts:triple-range-query</code> constructor require the triple index; if the triple index is not configured, then an exception is thrown. Provides a client interface to a server function. See {@link http://docs.marklogic.com/cts.tripleRangeQuery|cts.tripleRangeQuery}
    * @method planBuilder.cts#tripleRangeQuery
    * @since 2.1.1
    * @param { XsAnyAtomicType } [subject] - The subjects to look up. When multiple values are specified, the query matches if any value matches. When the empty sequence is specified, then triples with any subject are matched.
    * @param { XsAnyAtomicType } [predicate] - The predicates to look up. When multiple values are specified, the query matches if any value matches. When the empty sequence is specified, then triples with any predicate are matched.
    * @param { XsAnyAtomicType } [object] - The objects to look up. When multiple values are specified, the query matches if any value matches. When the empty sequence is specified, then triples with any object are matched.
    * @param { XsString } [operator] - If a single string is provided it is treated as the operator for the $object values. If a sequence of three strings are provided, they give the operators for $subject, $predicate and $object in turn. The default operator is "=". <p> Operators include:</p> <blockquote><dl> <dt>"sameTerm"</dt> <dd>Match triple index values which are the same RDF term as $value. This compares aspects of values that are ignored in XML Schema comparison semantics, like timezone and derived type of $value.</dd> <dt>"<"</dt> <dd>Match range index values less than $value.</dd> <dt>"<="</dt> <dd>Match range index values less than or equal to $value.</dd> <dt>">"</dt> <dd>Match range index values greater than $value.</dd> <dt>">="</dt> <dd>Match range index values greater than or equal to $value.</dd> <dt>"="</dt> <dd>Match range index values equal to $value.</dd> <dt>"!="</dt> <dd>Match range index values not equal to $value.</dd> </dl></blockquote>
    * @param { XsString } [options] - Options to this query. The default is (). <p> Options include:</p> <blockquote><dl> <dt>"cached"</dt> <dd>Cache the results of this query in the list cache.</dd> <dt>"uncached"</dt> <dd>Do not cache the results of this query in the list cache.</dd> <dt>"score-function=<em>function</em>"</dt> <dd>Use the selected scoring function. The score function may be: <dl> <dt>linear</dt><dd>Use a linear function of the difference between the specified query value and the matching value in the index to calculate a score for this range query.</dd> <dt>reciprocal</dt><dd>Use a reciprocal function of the difference between the specified query value and the matching value in the index to calculate a score for this range query.</dd> <dt>zero</dt><dd>This range query does not contribute to the score. This is the default.</dd> </dl> </dd> <dt>"slope-factor=<em>number</em>"</dt> <dd>Apply the given number as a scaling factor to the slope of the scoring function. The default is 1.0.</dd> </dl></blockquote>
    * @param { XsDouble } [weight] - A weight for this query. The default is 1.0.
    * @returns { CtsQuery }
    */
tripleRangeQuery(...args) {
    const namer = bldrbase.getNamer(args, 'subject');
    const paramdefs = [['subject', types.XsAnyAtomicType, false, true], ['predicate', types.XsAnyAtomicType, false, true], ['object', types.XsAnyAtomicType, false, true], ['operator', types.XsString, false, true], ['options', types.XsString, false, true], ['weight', types.XsDouble, false, false]];
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
    * @param { XsString } [options] - Options to this query. The default is (). <p> Options include:</p> <blockquote><dl> <dt>"case-sensitive"</dt> <dd>A case-sensitive query.</dd> <dt>"case-insensitive"</dt> <dd>A case-insensitive query.</dd> <dt>"diacritic-sensitive"</dt> <dd>A diacritic-sensitive query.</dd> <dt>"diacritic-insensitive"</dt> <dd>A diacritic-insensitive query.</dd> <dt>"punctuation-sensitive"</dt> <dd>A punctuation-sensitive query.</dd> <dt>"punctuation-insensitive"</dt> <dd>A punctuation-insensitive query.</dd> <dt>"whitespace-sensitive"</dt> <dd>A whitespace-sensitive query.</dd> <dt>"whitespace-insensitive"</dt> <dd>A whitespace-insensitive query.</dd> <dt>"stemmed"</dt> <dd>A stemmed query.</dd> <dt>"unstemmed"</dt> <dd>An unstemmed query.</dd> <dt>"wildcarded"</dt> <dd>A wildcarded query.</dd> <dt>"unwildcarded"</dt> <dd>An unwildcarded query.</dd> <dt>"exact"</dt> <dd>An exact match query. Shorthand for "case-sensitive", "diacritic-sensitive", "punctuation-sensitive", "whitespace-sensitive", "unstemmed", and "unwildcarded". </dd> <dt>"lang=<em>iso639code</em>"</dt> <dd>Specifies the language of the query. The <em>iso639code</em> code portion is case-insensitive, and uses the languages specified by <a>ISO 639</a>. The default is specified in the database configuration.</dd> <dt>"distance-weight=<em>number</em>"</dt> <dd>A weight applied based on the minimum distance between matches of this query. Higher weights add to the importance of proximity (as opposed to term matches) when the relevance order is calculated. The default value is 0.0 (no impact of proximity). The weight should be between 64 and -16. Weights greater than 64 will have the same effect as a weight of 64. This parameter has no effect if the <code>word positions</code> index is not enabled. This parameter has no effect on searches that use score-simple, score-random, or score-zero (because those scoring algorithms do not consider term frequency, proximity is irrelevant). </dd> <dt>"min-occurs=<em>number</em>"</dt> <dd>Specifies the minimum number of occurrences required. If fewer that this number of words occur, the fragment does not match. The default is 1.</dd> <dt>"max-occurs=<em>number</em>"</dt> <dd>Specifies the maximum number of occurrences required. If more than this number of words occur, the fragment does not match. The default is unbounded.</dd> <dt>"synonym"</dt> <dd>Specifies that all of the terms in the $text parameter are considered synonyms for scoring purposes. The result is that occurrences of more than one of the synonyms are scored as if there are more occurrences of the same term (as opposed to having a separate term that contributes to score). </dd> <dt>"lexicon-expand=<em>value</em>"</dt> <dd>The <em>value</em> is one of <code>full</code>, <code>prefix-postfix</code>, <code>off</code>, or <code>heuristic</code> (the default is <code>heuristic</code>). An option with a value of <code>lexicon-expand=full</code> specifies that wildcards are resolved by expanding the pattern to words in a lexicon (if there is one available), and turning into a series of <code>cts:word-queries</code>, even if this takes a long time to evaluate. An option with a value of <code>lexicon-expand=prefix-postfix</code> specifies that wildcards are resolved by expanding the pattern to the pre- and postfixes of the words in the word lexicon (if there is one), and turning the query into a series of character queries, even if it takes a long time to evaluate. An option with a value of <code>lexicon-expand=off</code> specifies that wildcards are only resolved by looking up character patterns in the search pattern index, not in the lexicon. An option with a value of <code>lexicon-expand=heuristic</code>, which is the default, specifies that wildcards are resolved by using a series of internal rules, such as estimating the number of lexicon entries that need to be scanned, seeing if the estimate crosses certain thresholds, and (if appropriate), using another way besides lexicon expansion to resolve the query. </dd> <dt>"lexicon-expansion-limit=<em>number</em>"</dt> <dd>Specifies the limit for lexicon expansion. This puts a restriction on the number of lexicon expansions that can be performed. If the limit is exceeded, the server may raise an error depending on whether the "limit-check" option is set. The default value for this option will be 4096. </dd> <dt>"limit-check"</dt> <dd>Specifies that an error will be raised if the lexicon expansion exceeds the specified limit.</dd> <dt>"no-limit-check"</dt> <dd>Specifies that error will not be raised if the lexicon expansion exceeds the specified limit. The server will try to resolve the wildcard. </dd> </dl></blockquote>
    * @param { XsDouble } [weight] - A weight for this query. Higher weights move search results up in the relevance order. The default is 1.0. The weight should be between 64 and -16. Weights greater than 64 will have the same effect as a weight of 64. Weights less than the absolute value of 0.0625 (between -0.0625 and 0.0625) are rounded to 0, which means that they do not contribute to the score.
    * @returns { CtsQuery }
    */
wordQuery(...args) {
    const namer = bldrbase.getNamer(args, 'text');
    const paramdefs = [['text', types.XsString, false, true], ['options', types.XsString, false, true], ['weight', types.XsDouble, false, false]];
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
    *  Returns the absolute value of $arg. If $arg is negative returns -$arg otherwise returns $arg. If type of $arg is one of the four numeric types xs:float, xs:double, xs:decimal or xs:integer the type of the result is the same as the type of $arg. If the type of $arg is a type derived from one of the numeric types, the result is an instance of the base numeric type. <p> For xs:float and xs:double arguments, if the argument is positive zero (+0) or negative zero (-0), then positive zero (+0) is returned. If the argument is positive or negative infinity, positive infinity is returned. <p> For detailed type semantics, see Section 7.2.1 The fn:abs, fn:ceiling, fn:floor, fn:round, and fn:round-half-to-even functions of [XQuery 1.0 and XPath 2.0 Formal Semantics].  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.abs|fn.abs}
    * @method planBuilder.fn#abs
    * @since 2.1.1
    * @param { XsNumeric } [arg] - A numeric value.
    * @returns { XsNumeric }
    */
abs(...args) {
    const paramdef = ['arg', types.XsNumeric, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.abs', 1, paramdef, args);
    return new types.XsNumeric('fn', 'abs', checkedArgs);
    }
/**
    * Adjusts an xs:date value to a specific timezone, or to no timezone at all. If $timezone is the empty sequence, returns an xs:date without a timezone. Otherwise, returns an xs:date with a timezone. For purposes of timezone adjustment, an xs:date is treated as an xs:dateTime with time 00:00:00. <p> If $timezone is not specified, then $timezone is the value of the implicit timezone in the dynamic context. <p> If $arg is the empty sequence, then the result is the empty sequence. <p> A dynamic error is raised [err:FODT0003] if $timezone is less than -PT14H or greater than PT14H or if does not contain an integral number of minutes. <p> If $arg does not have a timezone component and $timezone is the empty sequence, then the result is $arg. <p> If $arg does not have a timezone component and $timezone is not the empty sequence, then the result is $arg with $timezone as the timezone component. <p> If $arg has a timezone component and $timezone is the empty sequence, then the result is the localized value of $arg without its timezone component. <p> If $arg has a timezone component and $timezone is not the empty sequence, then: <p> Let $srcdt be an xs:dateTime value, with 00:00:00 for the time component and date and timezone components that are the same as the date and timezone components of $arg. <p> Let $r be the result of evaluating fn:adjust-dateTime-to-timezone($srcdt, $timezone) <p> The result of this function will be a date value that has date and timezone components that are the same as the date and timezone components of $r.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.adjustDateToTimezone|fn.adjustDateToTimezone}
    * @method planBuilder.fn#adjustDateToTimezone
    * @since 2.1.1
    * @param { XsDate } [arg] - The date to adjust to the new timezone.
    * @param { XsDayTimeDuration } [timezone] - The new timezone for the date.
    * @returns { XsDate }
    */
adjustDateToTimezone(...args) {
    const namer = bldrbase.getNamer(args, 'arg');
    const paramdefs = [['arg', types.XsDate, false, false], ['timezone', types.XsDayTimeDuration, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.adjustDateToTimezone', 1, new Set(['arg', 'timezone']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.adjustDateToTimezone', 1, false, paramdefs, args);
    return new types.XsDate('fn', 'adjust-date-to-timezone', checkedArgs);

    }
/**
    * Adjusts an xs:dateTime value to a specific timezone, or to no timezone at all. If $timezone is the empty sequence, returns an xs:dateTime without a timezone. Otherwise, returns an xs:dateTime with a timezone. <p> If $timezone is not specified, then $timezone is the value of the implicit timezone in the dynamic context. <p> If $arg is the empty sequence, then the result is the empty sequence. <p> A dynamic error is raised [err:FODT0003] if $timezone is less than -PT14H or greater than PT14H or if does not contain an integral number of minutes. <p> If $arg does not have a timezone component and $timezone is the empty sequence, then the result is $arg. <p> If $arg does not have a timezone component and $timezone is not the empty sequence, then the result is $arg with $timezone as the timezone component. <p> If $arg has a timezone component and $timezone is the empty sequence, then the result is the localized value of $arg without its timezone component. <p> If $arg has a timezone component and $timezone is not the empty sequence, then the result is an xs:dateTime value with a timezone component of $timezone that is equal to $arg.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.adjustDateTimeToTimezone|fn.adjustDateTimeToTimezone}
    * @method planBuilder.fn#adjustDateTimeToTimezone
    * @since 2.1.1
    * @param { XsDateTime } [arg] - The dateTime to adjust to the new timezone.
    * @param { XsDayTimeDuration } [timezone] - The new timezone for the dateTime.
    * @returns { XsDateTime }
    */
adjustDateTimeToTimezone(...args) {
    const namer = bldrbase.getNamer(args, 'arg');
    const paramdefs = [['arg', types.XsDateTime, false, false], ['timezone', types.XsDayTimeDuration, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.adjustDateTimeToTimezone', 1, new Set(['arg', 'timezone']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.adjustDateTimeToTimezone', 1, false, paramdefs, args);
    return new types.XsDateTime('fn', 'adjust-dateTime-to-timezone', checkedArgs);

    }
/**
    * Adjusts an xs:time value to a specific timezone, or to no timezone at all. If $timezone is the empty sequence, returns an xs:time without a timezone. Otherwise, returns an xs:time with a timezone. <p> If $timezone is not specified, then $timezone is the value of the implicit timezone in the dynamic context. <p> If $arg is the empty sequence, then the result is the empty sequence. <p> A dynamic error is raised [err:FODT0003] if $timezone is less than -PT14H or greater than PT14H or if does not contain an integral number of minutes. <p> If $arg does not have a timezone component and $timezone is the empty sequence, then the result is $arg. <p> If $arg does not have a timezone component and $timezone is not the empty sequence, then the result is $arg with $timezone as the timezone component. <p> If $arg has a timezone component and $timezone is the empty sequence, then the result is the localized value of $arg without its timezone component. <p> If $arg has a timezone component and $timezone is not the empty sequence, then: <p> Let $srcdt be an xs:dateTime value, with an arbitrary date for the date component and time and timezone components that are the same as the time and timezone components of $arg. <p> Let $r be the result of evaluating fn:adjust-dateTime-to-timezone($srcdt, $timezone) <p> The result of this function will be a time value that has time and timezone components that are the same as the time and timezone components of $r.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.adjustTimeToTimezone|fn.adjustTimeToTimezone}
    * @method planBuilder.fn#adjustTimeToTimezone
    * @since 2.1.1
    * @param { XsTime } [arg] - The time to adjust to the new timezone.
    * @param { XsDayTimeDuration } [timezone] - The new timezone for the date.
    * @returns { XsTime }
    */
adjustTimeToTimezone(...args) {
    const namer = bldrbase.getNamer(args, 'arg');
    const paramdefs = [['arg', types.XsTime, false, false], ['timezone', types.XsDayTimeDuration, false, false]];
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
    * @param { XsString } [flags] - The flag representing how to interpret the regular expression. One of "s", "m", "i", or "x", as defined in <a>http://www.w3.org/TR/xpath-functions/#flags</a>.
    * @returns { ElementNode }
    */
analyzeString(...args) {
    const namer = bldrbase.getNamer(args, 'in');
    const paramdefs = [['in', types.XsString, false, false], ['regex', types.XsString, true, false], ['flags', types.XsString, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.analyzeString', 2, new Set(['in', 'regex', 'flags']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.analyzeString', 2, false, paramdefs, args);
    return new types.ElementNode('fn', 'analyze-string', checkedArgs);

    }
/**
    *  Returns the average of the values in the input sequence $arg, that is, the sum of the values divided by the number of values. <p> If $arg is the empty sequence, the empty sequence is returned. <p> If $arg contains values of type xs:untypedAtomic they are cast to xs:double. <p> Duration values must either all be xs:yearMonthDuration values or must all be xs:dayTimeDuration values. For numeric values, the numeric promotion rules defined in 6.2 Operators on Numeric Values are used to promote all values to a single common type. After these operations, $arg must contain items of a single type, which must be one of the four numeric types,xs:yearMonthDuration or xs:dayTimeDuration or one if its subtypes. <p> If the above conditions are not met, then a type error is raised [err:FORG0006]. <p> Otherwise, returns the average of the values computed as sum($arg) div count($arg). <p> For detailed type semantics, see <a>Section 7.2.10 The fn:min, fn:max, fn:avg, and fn:sum functions[FS]</a>.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.avg|fn.avg}
    * @method planBuilder.fn#avg
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg] - The sequence of values to average.
    * @returns { XsAnyAtomicType }
    */
avg(...args) {
    const paramdef = ['arg', types.XsAnyAtomicType, false, true];
    const checkedArgs = bldrbase.makeSingleArgs('fn.avg', 1, paramdef, args);
    return new types.XsAnyAtomicType('fn', 'avg', checkedArgs);
    }
/**
    * Returns the value of the base-uri property for the specified node. If the node is part of a document and does not have a base-uri attribute explicitly set, <code>fn:base-uri</code> typically returns the URI of the document in which the node resides. Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.baseUri|fn.baseUri}
    * @method planBuilder.fn#baseUri
    * @since 2.1.1
    * @param { Node } [arg] - The node whose base-uri is to be returned.
    * @returns { XsAnyURI }
    */
baseUri(...args) {
    const paramdef = ['arg', types.Node, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.baseUri', 1, paramdef, args);
    return new types.XsAnyURI('fn', 'base-uri', checkedArgs);
    }
/**
    *  Computes the effective boolean value of the sequence $arg. See Section 2.4.3 Effective Boolean Value[XP].  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.boolean|fn.boolean}
    * @method planBuilder.fn#boolean
    * @since 2.1.1
    * @param { Item } [arg] - A sequence of items.
    * @returns { XsBoolean }
    */
boolean(...args) {
    const paramdef = ['arg', types.Item, false, true];
    const checkedArgs = bldrbase.makeSingleArgs('fn.boolean', 1, paramdef, args);
    return new types.XsBoolean('fn', 'boolean', checkedArgs);
    }
/**
    *  Returns the smallest (closest to negative infinity) number with no fractional part that is not less than the value of $arg. If type of $arg is one of the four numeric types xs:float, xs:double, xs:decimal or xs:integer the type of the result is the same as the type of $arg. If the type of $arg is a type derived from one of the numeric types, the result is an instance of the base numeric type. <p> For xs:float and xs:double arguments, if the argument is positive zero, then positive zero is returned. If the argument is negative zero, then negative zero is returned. If the argument is less than zero and greater than -1, negative zero is returned. <p> For detailed type semantics, see Section 7.2.3 The fn:abs, fn:ceiling, fn:floor, fn:round, and fn:round-half-to-even functions[FS].  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.ceiling|fn.ceiling}
    * @method planBuilder.fn#ceiling
    * @since 2.1.1
    * @param { XsNumeric } [arg] - A numeric value.
    * @returns { XsNumeric }
    */
ceiling(...args) {
    const paramdef = ['arg', types.XsNumeric, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.ceiling', 1, paramdef, args);
    return new types.XsNumeric('fn', 'ceiling', checkedArgs);
    }
/**
    *  Returns <code>true</code> if the specified parameters are the same Unicode code point, otherwise returns <code>false</code>. The codepoints are compared according to the Unicode code point collation (<a>http://www.w3.org/2005/xpath-functions/collation/codepoint</a>).  <p> If either argument is the empty sequence, the result is the empty sequence.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.codepointEqual|fn.codepointEqual}
    * @method planBuilder.fn#codepointEqual
    * @since 2.1.1
    * @param { XsString } [comparand1] - A string to be compared.
    * @param { XsString } [comparand2] - A string to be compared.
    * @returns { XsBoolean }
    */
codepointEqual(...args) {
    const namer = bldrbase.getNamer(args, 'comparand1');
    const paramdefs = [['comparand1', types.XsString, false, false], ['comparand2', types.XsString, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.codepointEqual', 2, new Set(['comparand1', 'comparand2']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.codepointEqual', 2, false, paramdefs, args);
    return new types.XsBoolean('fn', 'codepoint-equal', checkedArgs);

    }
/**
    * Creates an <code>xs:string</code> from a sequence of Unicode code points. Returns the zero-length string if $arg is the empty sequence. If any of the code points in $arg is not a legal XML character, an error is raised. Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.codepointsToString|fn.codepointsToString}
    * @method planBuilder.fn#codepointsToString
    * @since 2.1.1
    * @param { XsInteger } [arg] - A sequence of Unicode code points.
    * @returns { XsString }
    */
codepointsToString(...args) {
    const paramdef = ['arg', types.XsInteger, false, true];
    const checkedArgs = bldrbase.makeSingleArgs('fn.codepointsToString', 1, paramdef, args);
    return new types.XsString('fn', 'codepoints-to-string', checkedArgs);
    }
/**
    *  Returns -1, 0, or 1, depending on whether the value of the $comparand1 is respectively less than, equal to, or greater than the value of $comparand2, according to the rules of the collation that is used.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.compare|fn.compare}
    * @method planBuilder.fn#compare
    * @since 2.1.1
    * @param { XsString } [comparand1] - A string to be compared.
    * @param { XsString } [comparand2] - A string to be compared.
    * @param { XsString } [collation] - The optional name of a valid collation URI. For information on the collation URI syntax, see the <em>Search Developer's Guide</em>.
    * @returns { XsInteger }
    */
compare(...args) {
    const namer = bldrbase.getNamer(args, 'comparand1');
    const paramdefs = [['comparand1', types.XsString, false, false], ['comparand2', types.XsString, false, false], ['collation', types.XsString, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.compare', 2, new Set(['comparand1', 'comparand2', 'collation']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.compare', 2, false, paramdefs, args);
    return new types.XsInteger('fn', 'compare', checkedArgs);

    }
/**
    *  Returns the <code>xs:string</code> that is the concatenation of the values of the specified parameters. Accepts two or more <code>xs:anyAtomicType</code> arguments and casts them to <code>xs:string</code>. If any of the parameters is the empty sequence, the parameter is treated as the zero-length string.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.concat|fn.concat}
    * @method planBuilder.fn#concat
    * @since 2.1.1
    * @param { XsAnyAtomicType } [parameter1] - A value.
    * @returns { XsString }
    */
concat(...args) {
    const namer = bldrbase.getNamer(args, 'parameter1');
    const paramdefs = [['parameter1', types.XsAnyAtomicType, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.concat', 1, new Set(['parameter1']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.concat', 1, true, paramdefs, args);
    return new types.XsString('fn', 'concat', checkedArgs);

    }
/**
    * Returns <code>true</code> if the first parameter contains the string from the second parameter, otherwise returns <code>false</code>. Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.contains|fn.contains}
    * @method planBuilder.fn#contains
    * @since 2.1.1
    * @param { XsString } [parameter1] - The string from which to test.
    * @param { XsString } [parameter2] - The string to test for existence in the first parameter.
    * @param { XsString } [collation] - The optional name of a valid collation URI. For information on the collation URI syntax, see the <em>Search Developer's Guide</em>.
    * @returns { XsBoolean }
    */
contains(...args) {
    const namer = bldrbase.getNamer(args, 'parameter1');
    const paramdefs = [['parameter1', types.XsString, false, false], ['parameter2', types.XsString, false, false], ['collation', types.XsString, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.contains', 2, new Set(['parameter1', 'parameter2', 'collation']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.contains', 2, false, paramdefs, args);
    return new types.XsBoolean('fn', 'contains', checkedArgs);

    }
/**
    * Returns the number of items in the value of $arg. <p> Returns 0 if $arg is the empty sequence.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.count|fn.count}
    * @method planBuilder.fn#count
    * @since 2.1.1
    * @param { Item } [arg] - The sequence of items to count.
    * @param { XsDouble } [maximum] - The maximum value of the count to return. MarkLogic Server will stop count when the $maximum value is reached and return the $maximum value. This is an extension to the W3C standard <code>fn:count</code> function.
    * @returns { XsInteger }
    */
count(...args) {
    const namer = bldrbase.getNamer(args, 'arg');
    const paramdefs = [['arg', types.Item, false, true], ['maximum', types.XsDouble, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.count', 1, new Set(['arg', 'maximum']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.count', 1, false, paramdefs, args);
    return new types.XsInteger('fn', 'count', checkedArgs);

    }
/**
    * Returns <code>xs:date(fn:current-dateTime())</code>. This is an <code>xs:date</code> (with timezone) that is current at some time during the evaluation of a query or transformation in which <code>fn:current-date()</code> is executed. This function is *stable*. The precise instant during the query or transformation represented by the value of <code>fn:current-date()</code> is *implementation dependent*. Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.currentDate|fn.currentDate}
    * @method planBuilder.fn#currentDate
    * @since 2.1.1

    * @returns { XsDate }
    */
currentDate(...args) {
    bldrbase.checkMaxArity('fn.currentDate', args.length, 0);
    return new types.XsDate('fn', 'current-date', args);
    }
/**
    * Returns the current dateTime value (with timezone) from the dynamic context. (See <a>Section C.2 Dynamic Context Components[XP]</a>.) This is an <code>xs:dateTime</code> that is current at some time during the evaluation of a query or transformation in which <code>fn:current-dateTime()</code> is executed. This function is *stable*. The precise instant during the query or transformation represented by the value of <code>fn:current-dateTime()</code> is *implementation dependent*. Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.currentDateTime|fn.currentDateTime}
    * @method planBuilder.fn#currentDateTime
    * @since 2.1.1

    * @returns { XsDateTime }
    */
currentDateTime(...args) {
    bldrbase.checkMaxArity('fn.currentDateTime', args.length, 0);
    return new types.XsDateTime('fn', 'current-dateTime', args);
    }
/**
    * Returns <code>xs:time(fn:current-dateTime())</code>. This is an <code>xs:time</code> (with timezone) that is current at some time during the evaluation of a query or transformation in which <code>fn:current-time()</code> is executed. This function is *stable*. The precise instant during the query or transformation represented by the value of <code>fn:current-time()</code> is *implementation dependent*. Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.currentTime|fn.currentTime}
    * @method planBuilder.fn#currentTime
    * @since 2.1.1

    * @returns { XsTime }
    */
currentTime(...args) {
    bldrbase.checkMaxArity('fn.currentTime', args.length, 0);
    return new types.XsTime('fn', 'current-time', args);
    }
/**
    * Returns an xs:integer between 1 and 31, both inclusive, representing the day component in the localized value of $arg. <p> If $arg is the empty sequence, returns the empty sequence.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.dayFromDate|fn.dayFromDate}
    * @method planBuilder.fn#dayFromDate
    * @since 2.1.1
    * @param { XsDate } [arg] - The date whose day component will be returned.
    * @returns { XsInteger }
    */
dayFromDate(...args) {
    const paramdef = ['arg', types.XsDate, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.dayFromDate', 1, paramdef, args);
    return new types.XsInteger('fn', 'day-from-date', checkedArgs);
    }
/**
    *  Returns an xs:integer between 1 and 31, both inclusive, representing the day component in the localized value of $arg. <p> If $arg is the empty sequence, returns the empty sequence.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.dayFromDateTime|fn.dayFromDateTime}
    * @method planBuilder.fn#dayFromDateTime
    * @since 2.1.1
    * @param { XsDateTime } [arg] - The dateTime whose day component will be returned.
    * @returns { XsInteger }
    */
dayFromDateTime(...args) {
    const paramdef = ['arg', types.XsDateTime, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.dayFromDateTime', 1, paramdef, args);
    return new types.XsInteger('fn', 'day-from-dateTime', checkedArgs);
    }
/**
    *  Returns an xs:integer representing the days component in the canonical lexical representation of the value of $arg. The result may be negative. <p> If $arg is the empty sequence, returns the empty sequence.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.daysFromDuration|fn.daysFromDuration}
    * @method planBuilder.fn#daysFromDuration
    * @since 2.1.1
    * @param { XsDuration } [arg] - The duration whose day component will be returned.
    * @returns { XsInteger }
    */
daysFromDuration(...args) {
    const paramdef = ['arg', types.XsDuration, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.daysFromDuration', 1, paramdef, args);
    return new types.XsInteger('fn', 'days-from-duration', checkedArgs);
    }
/**
    * This function assesses whether two sequences are deep-equal to each other. To be deep-equal, they must contain items that are pairwise deep-equal; and for two items to be deep-equal, they must either be atomic values that compare equal, or nodes of the same kind, with the same name, whose children are deep-equal. This is defined in more detail below. The $collation argument identifies a collation which is used at all levels of recursion when strings are compared (but not when names are compared), according to the rules in 7.3.1 Collations.  <p>If the two sequences are both empty, the function returns true. <p> If the two sequences are of different lengths, the function returns false. <p> If the two sequences are of the same length, the function returns true if and only if every item in the sequence $parameter1 is deep-equal to the item at the same position in the sequence $parameter2. The rules for deciding whether two items are deep-equal follow. <p> Call the two items $i1 and $i2 respectively. <p> If $i1 and $i2 are both atomic values, they are deep-equal if and only if ($i1 eq $i2) is true. Or if both values are NaN. If the eq operator is not defined for $i1 and $i2, the function returns false. <p> If one of the pair $i1 or $i2 is an atomic value and the other is a node, the function returns false. <p> If $i1 and $i2 are both nodes, they are compared as described below: <p> If the two nodes are of different kinds, the result is false. <p> If the two nodes are both document nodes then they are deep-equal if and only if the sequence $i1/(*|text()) is deep-equal to the sequence $i2/(*|text()). <p> If the two nodes are both element nodes then they are deep-equal if and only if all of the following conditions are satisfied:  <ol><li>the two nodes have the same name, that is (node-name($i1) eq node-name($i2)).</li><li>the two nodes are both annotated as having simple content or both nodes are annotated as having complex content.</li><li>the two nodes have the same number of attributes, and for every attribute $a1 in $i1/@* there exists an attribute $a2 in $i2/@* such that $a1 and $a2 are deep-equal. </li><li>One of the following conditions holds: <ul><li>Both element nodes have a type annotation that is simple content, and the typed value of $i1 is deep-equal to the typed value of $i2. </li><li>Both element nodes have a type annotation that is complex content with elementOnly content, and each child element of $i1 is deep-equal to the corresponding child element of $i2. </li><li>Both element nodes have a type annotation that is complex content with mixed content, and the sequence $i1/(*|text()) is deep-equal to the sequence $i2/(*|text()). </li><li>Both element nodes have a type annotation that is complex content with empty content. </li></ul> </li></ol> <p> If the two nodes are both attribute nodes then they are deep-equal if and only if both the following conditions are satisfied:  <ol><li>the two nodes have the same name, that is (node-name($i1) eq node-name($i2)).</li><li>the typed value of $i1 is deep-equal to the typed value of $i2.</li></ol> <p> If the two nodes are both processing instruction nodes or namespace bindings, then they are deep-equal if and only if both the following conditions are satisfied:  <ol><li>the two nodes have the same name, that is (node-name($i1) eq node-name($i2)). </li><li>the string value of $i1 is equal to the string value of $i2.</li></ol> <p> If the two nodes are both text nodes and their parent nodes are not object nodes, then they are deep-equal if and only if their string-values are both equal. <p> If the two nodes are both text nodes and their parent nodes are both object nodes, then they are deep-equal if and only if their keys and string-values are both equal. <p> If the two nodes are both comment nodes, then they are deep-equal if and only if their string-values are equal. <p> If the two nodes are both object nodes, then they are deep-equal if and only if all of the following conditions are satisfied:  <ol><li>the two nodes have the same number of children, and the children have the same set of keys.</li><li>two children of the two nodes with the same key are deep-equal.</li><li>the order of children does not matter. </li></ol> <p> If the two nodes are both boolean nodes, then they are deep-equal if and only if their keys and boolean values are equal. <p> If the two nodes are both number nodes, then they are deep-equal if and only if their keys and values are equal. <p> If the two nodes are both null nodes, they are deep-equal. <p> Notes: <p> The two nodes are not required to have the same type annotation, and they are not required to have the same in-scope namespaces. They may also differ in their parent, their base URI, and the values returned by the is-id and is-idrefs accesors (see Section 5.5 is-id Accessor[DM] and Section 5.6 is-idrefs Accessor[DM]). The order of children is significant, but the order of attributes is insignificant. <p> The following note applies to the Jan 2007 XQuery specification, but not to the May 2003 XQuery specification: The contents of comments and processing instructions are significant only if these nodes appear directly as items in the two sequences being compared. The content of a comment or processing instruction that appears as a descendant of an item in one of the sequences being compared does not affect the result. However, the presence of a comment or processing instruction, if it causes a text node to be split into two text nodes, may affect the result. <p> The result of fn:deep-equal(1, current-dateTime()) is false; it does not raise an error.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.deepEqual|fn.deepEqual}
    * @method planBuilder.fn#deepEqual
    * @since 2.1.1
    * @param { Item } [parameter1] - The first sequence of items, each item should be an atomic value or node.
    * @param { Item } [parameter2] - The sequence of items to compare to the first sequence of items, again each item should be an atomic value or node.
    * @param { XsString } [collation] - The optional name of a valid collation URI. For information on the collation URI syntax, see the <em>Search Developer's Guide</em>.
    * @returns { XsBoolean }
    */
deepEqual(...args) {
    const namer = bldrbase.getNamer(args, 'parameter1');
    const paramdefs = [['parameter1', types.Item, false, true], ['parameter2', types.Item, false, true], ['collation', types.XsString, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.deepEqual', 2, new Set(['parameter1', 'parameter2', 'collation']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.deepEqual', 2, false, paramdefs, args);
    return new types.XsBoolean('fn', 'deep-equal', checkedArgs);

    }
/**
    * Returns the value of the default collation property from the static context. Components of the static context are discussed in <a>Section C.1 Static Context Components[XP]</a>.  <p>The default collation property can never be undefined. If it is not explicitly defined, a system defined default codepoint is used. In the <code>1.0</code> XQuery dialect, if this is not provided, the Unicode code point collation (<code>http://www.w3.org/2005/xpath-functions/collation/codepoint</code>) is used. In the <code>1.0-ml</code> and <code>0.9-ml</code> XQuery dialects, the MarkLogic-defined codepoint URI is used (<code>http://marklogic.com/collation/codepoint</code>).  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.defaultCollation|fn.defaultCollation}
    * @method planBuilder.fn#defaultCollation
    * @since 2.1.1

    * @returns { XsString }
    */
defaultCollation(...args) {
    bldrbase.checkMaxArity('fn.defaultCollation', args.length, 0);
    return new types.XsString('fn', 'default-collation', args);
    }
/**
    *  Returns the sequence that results from removing from $arg all but one of a set of values that are eq to one other. Values that cannot be compared, i.e. the eq operator is not defined for their types, are considered to be distinct. Values of type xs:untypedAtomic are compared as if they were of type xs:string. The order in which the sequence of values is returned is implementation dependent. <p> The static type of the result is a sequence of prime types as defined in <a>Section 7.2.7 The fn:distinct-values function[FS]</a>. <p> The collation used by the invocation of this function is determined according to the rules in 7.3.1 Collations. The collation is used when string comparison is required. <p> If $arg is the empty sequence, the empty sequence is returned. <p> For xs:float and xs:double values, positive zero is equal to negative zero and, although NaN does not equal itself, if $arg contains multiple NaN values a single NaN is returned. <p> If xs:dateTime, xs:date or xs:time values do not have a timezone, they are considered to have the implicit timezone provided by the dynamic context for the purpose of comparison. Note that xs:dateTime, xs:date or xs:time values can compare equal even if their timezones are different. <p> Which value of a set of values that compare equal is returned is implementation dependent.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.distinctValues|fn.distinctValues}
    * @method planBuilder.fn#distinctValues
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg] - A sequence of items.
    * @param { XsString } [collation] - The optional name of a valid collation URI. For information on the collation URI syntax, see the <em>Search Developer's Guide</em>.
    * @returns { XsAnyAtomicType }
    */
distinctValues(...args) {
    const namer = bldrbase.getNamer(args, 'arg');
    const paramdefs = [['arg', types.XsAnyAtomicType, false, true], ['collation', types.XsString, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.distinctValues', 1, new Set(['arg', 'collation']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.distinctValues', 1, false, paramdefs, args);
    return new types.XsAnyAtomicType('fn', 'distinct-values', checkedArgs);

    }
/**
    * Returns the value of the document-uri property for the specified node. If the node is a document node, then the value returned is the URI of the document. If the node is not a document node, then <code>fn:document-uri</code> returns the empty sequence. Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.documentUri|fn.documentUri}
    * @method planBuilder.fn#documentUri
    * @since 2.1.1
    * @param { Node } [arg] - The node whose document-uri is to be returned.
    * @returns { XsAnyURI }
    */
documentUri(...args) {
    const paramdef = ['arg', types.Node, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.documentUri', 1, paramdef, args);
    return new types.XsAnyURI('fn', 'document-uri', checkedArgs);
    }
/**
    * If the value of $arg is the empty sequence, the function returns true; otherwise, the function returns false. Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.empty|fn.empty}
    * @method planBuilder.fn#empty
    * @since 2.1.1
    * @param { Item } [arg] - A sequence to test.
    * @returns { XsBoolean }
    */
empty(...args) {
    const paramdef = ['arg', types.Item, false, true];
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
    const paramdef = ['uri-part', types.XsString, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.encodeForUri', 1, paramdef, args);
    return new types.XsString('fn', 'encode-for-uri', checkedArgs);
    }
/**
    * Returns <code>true</code> if the first parameter ends with the string from the second parameter, otherwise returns <code>false</code>. Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.endsWith|fn.endsWith}
    * @method planBuilder.fn#endsWith
    * @since 2.1.1
    * @param { XsString } [parameter1] - The parameter from which to test.
    * @param { XsString } [parameter2] - The string to test whether it is at the end of the first parameter.
    * @param { XsString } [collation] - The optional name of a valid collation URI. For information on the collation URI syntax, see the <em>Search Developer's Guide</em>.
    * @returns { XsBoolean }
    */
endsWith(...args) {
    const namer = bldrbase.getNamer(args, 'parameter1');
    const paramdefs = [['parameter1', types.XsString, false, false], ['parameter2', types.XsString, false, false], ['collation', types.XsString, true, false]];
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
    const paramdef = ['uri-part', types.XsString, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.escapeHtmlUri', 1, paramdef, args);
    return new types.XsString('fn', 'escape-html-uri', checkedArgs);
    }
/**
    * If the value of $arg is not the empty sequence, the function returns true; otherwise, the function returns false. Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.exists|fn.exists}
    * @method planBuilder.fn#exists
    * @since 2.1.1
    * @param { Item } [arg] - A sequence to test.
    * @returns { XsBoolean }
    */
exists(...args) {
    const paramdef = ['arg', types.Item, false, true];
    const checkedArgs = bldrbase.makeSingleArgs('fn.exists', 1, paramdef, args);
    return new types.XsBoolean('fn', 'exists', checkedArgs);
    }
/**
    * Returns the <code>xs:boolean</code> value <code>false</code>. Equivalent to <code>xs:boolean("0")</code>. Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.false|fn.false}
    * @method planBuilder.fn#false
    * @since 2.1.1

    * @returns { XsBoolean }
    */
false(...args) {
    bldrbase.checkMaxArity('fn.false', args.length, 0);
    return new types.XsBoolean('fn', 'false', args);
    }
/**
    *  Returns the largest (closest to positive infinity) number with no fractional part that is not greater than the value of $arg. If type of $arg is one of the four numeric types xs:float, xs:double, xs:decimal or xs:integer the type of the result is the same as the type of $arg. If the type of $arg is a type derived from one of the numeric types, the result is an instance of the base numeric type. <p> For float and double arguments, if the argument is positive zero, then positive zero is returned. If the argument is negative zero, then negative zero is returned. <p> For detailed type semantics, see Section 7.2.3 The fn:abs, fn:ceiling, fn:floor, fn:round, and fn:round-half-to-even functions[FS].  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.floor|fn.floor}
    * @method planBuilder.fn#floor
    * @since 2.1.1
    * @param { XsNumeric } [arg] - A numeric value.
    * @returns { XsNumeric }
    */
floor(...args) {
    const paramdef = ['arg', types.XsNumeric, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.floor', 1, paramdef, args);
    return new types.XsNumeric('fn', 'floor', checkedArgs);
    }
/**
    * Returns a formatted date value based on the picture argument. This is an XSLT function, and it is available in XSLT, XQuery 1.0-ml, and Server-Side JavaScript. Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.formatDate|fn.formatDate}
    * @method planBuilder.fn#formatDate
    * @since 2.1.1
    * @param { XsDate } [value] - The given date <code>$value</code> that needs to be formatted.
    * @param { XsString } [picture] - The desired string representation of the given date <code>$value</code>. The picture string is a sequence of characters, in which the characters represent variables such as, decimal-separator-sign, grouping-sign, zero-digit-sign, digit-sign, pattern-separator, percent sign and per-mille-sign. For details on the picture string, see <a>http://www.w3.org/TR/xslt20/#date-picture-string</a>.
    * @param { XsString } [language] - The desired language for string representation of the date <code>$value</code>.
    * @param { XsString } [calendar] - The only calendar supported at this point is "Gregorian" or "AD".
    * @param { XsString } [country] - $country is used the specification to take into account country specific string representation.
    * @returns { XsString }
    */
formatDate(...args) {
    const namer = bldrbase.getNamer(args, 'value');
    const paramdefs = [['value', types.XsDate, false, false], ['picture', types.XsString, true, false], ['language', types.XsString, false, false], ['calendar', types.XsString, false, false], ['country', types.XsString, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.formatDate', 2, new Set(['value', 'picture', 'language', 'calendar', 'country']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.formatDate', 2, false, paramdefs, args);
    return new types.XsString('fn', 'format-date', checkedArgs);

    }
/**
    * Returns a formatted dateTime value based on the picture argument. This is an XSLT function, and it is available in XSLT, XQuery 1.0-ml, and Server-Side JavaScript. Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.formatDateTime|fn.formatDateTime}
    * @method planBuilder.fn#formatDateTime
    * @since 2.1.1
    * @param { XsDateTime } [value] - The given dateTime <code>$value</code> that needs to be formatted.
    * @param { XsString } [picture] - The desired string representation of the given dateTime <code>$value</code>. The picture string is a sequence of characters, in which the characters represent variables such as, decimal-separator-sign, grouping-sign, zero-digit-sign, digit-sign, pattern-separator, percent sign and per-mille-sign. For details on the picture string, see <a>http://www.w3.org/TR/xslt20/#date-picture-string</a>.
    * @param { XsString } [language] - The desired language for string representation of the dateTime <code>$value</code>.
    * @param { XsString } [calendar] - The only calendar supported at this point is "Gregorian" or "AD".
    * @param { XsString } [country] - $country is used the specification to take into account country specific string representation.
    * @returns { XsString }
    */
formatDateTime(...args) {
    const namer = bldrbase.getNamer(args, 'value');
    const paramdefs = [['value', types.XsDateTime, false, false], ['picture', types.XsString, true, false], ['language', types.XsString, false, false], ['calendar', types.XsString, false, false], ['country', types.XsString, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.formatDateTime', 2, new Set(['value', 'picture', 'language', 'calendar', 'country']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.formatDateTime', 2, false, paramdefs, args);
    return new types.XsString('fn', 'format-dateTime', checkedArgs);

    }
/**
    * Returns a formatted string representation of value argument based on the supplied picture. An optional decimal format name may also be supplied for interpretation of the picture string. This is an XSLT function, and it is available in XSLT, XQuery 1.0-ml, and Server-Side JavaScript. Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.formatNumber|fn.formatNumber}
    * @method planBuilder.fn#formatNumber
    * @since 2.1.1
    * @param { XsNumeric } [value] - The given numeric <code>$value</code> that needs to be formatted.
    * @param { XsString } [picture] - The desired string representation of the given number <code>$value</code>. The picture string is a sequence of characters, in which the characters represent variables such as, decimal-separator-sign, grouping-sign, zero-digit-sign, digit-sign, pattern-separator, percent sign and per-mille-sign. For details on the format-number picture string, see <a>http://www.w3.org/TR/xslt20/#function-format-number</a>.
    * @param { XsString } [decimalFormatName] - Represents a named <code><xsl:decimal-format></code> instruction. It is used to assign values to the variables mentioned above based on the picture string.
    * @returns { XsString }
    */
formatNumber(...args) {
    const namer = bldrbase.getNamer(args, 'value');
    const paramdefs = [['value', types.XsNumeric, false, true], ['picture', types.XsString, true, false], ['decimal-format-name', types.XsString, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.formatNumber', 2, new Set(['value', 'picture', 'decimal-format-name']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.formatNumber', 2, false, paramdefs, args);
    return new types.XsString('fn', 'format-number', checkedArgs);

    }
/**
    * Returns a formatted time value based on the picture argument. This is an XSLT function, and it is available in XSLT, XQuery 1.0-ml, and Server-Side JavaScript. Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.formatTime|fn.formatTime}
    * @method planBuilder.fn#formatTime
    * @since 2.1.1
    * @param { XsTime } [value] - The given time <code>$value</code> that needs to be formatted.
    * @param { XsString } [picture] - The desired string representation of the given time <code>$value</code>. The picture string is a sequence of characters, in which the characters represent variables such as, decimal-separator-sign, grouping-sign, zero-digit-sign, digit-sign, pattern-separator, percent sign and per-mille-sign. For details on the picture string, see <a>http://www.w3.org/TR/xslt20/#date-picture-string</a>.
    * @param { XsString } [language] - The desired language for string representation of the time <code>$value</code>.
    * @param { XsString } [calendar] - The only calendar supported at this point is "Gregorian" or "AD".
    * @param { XsString } [country] - $country is used the specification to take into account country specific string representation.
    * @returns { XsString }
    */
formatTime(...args) {
    const namer = bldrbase.getNamer(args, 'value');
    const paramdefs = [['value', types.XsTime, false, false], ['picture', types.XsString, true, false], ['language', types.XsString, false, false], ['calendar', types.XsString, false, false], ['country', types.XsString, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.formatTime', 2, new Set(['value', 'picture', 'language', 'calendar', 'country']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.formatTime', 2, false, paramdefs, args);
    return new types.XsString('fn', 'format-time', checkedArgs);

    }
/**
    * Returns a string that uniquely identifies a given node.  <p> If $node is the empty sequence, the zero-length string is returned.  <p> If the function is called without an argument, the context item is used as the default argument. The behavior of the function when the argument is omitted is the same as if the context item is passed as an argument. <p>If the context item is undefined an error is raised: [err:XPDY0002]. If the context item is not a node an error is raised: [err:XPTY0004].  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.generateId|fn.generateId}
    * @method planBuilder.fn#generateId
    * @since 2.1.1
    * @param { Node } [node] - The node whose ID will be generated.
    * @returns { XsString }
    */
generateId(...args) {
    const paramdef = ['node', types.Node, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.generateId', 1, paramdef, args);
    return new types.XsString('fn', 'generate-id', checkedArgs);
    }
/**
    * Returns the first item in a sequence. For more details, see <a>XPath 3.0 Functions and Operators</a>. Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.head|fn.head}
    * @method planBuilder.fn#head
    * @since 2.1.1
    * @param { Item } [seq] - A sequence of items.
    * @returns { Item }
    */
head(...args) {
    const paramdef = ['seq', types.Item, false, true];
    const checkedArgs = bldrbase.makeSingleArgs('fn.head', 1, paramdef, args);
    return new types.Item('fn', 'head', checkedArgs);
    }
/**
    *  Returns an xs:integer between 0 and 23, both inclusive, representing the hours component in the localized value of $arg. <p> If $arg is the empty sequence, returns the empty sequence.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.hoursFromDateTime|fn.hoursFromDateTime}
    * @method planBuilder.fn#hoursFromDateTime
    * @since 2.1.1
    * @param { XsDateTime } [arg] - The dateTime whose hours component will be returned.
    * @returns { XsInteger }
    */
hoursFromDateTime(...args) {
    const paramdef = ['arg', types.XsDateTime, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.hoursFromDateTime', 1, paramdef, args);
    return new types.XsInteger('fn', 'hours-from-dateTime', checkedArgs);
    }
/**
    * Returns an xs:integer representing the hours component in the canonical lexical representation of the value of $arg. The result may be negative. <p> If $arg is the empty sequence, returns the empty sequence.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.hoursFromDuration|fn.hoursFromDuration}
    * @method planBuilder.fn#hoursFromDuration
    * @since 2.1.1
    * @param { XsDuration } [arg] - The duration whose hour component will be returned.
    * @returns { XsInteger }
    */
hoursFromDuration(...args) {
    const paramdef = ['arg', types.XsDuration, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.hoursFromDuration', 1, paramdef, args);
    return new types.XsInteger('fn', 'hours-from-duration', checkedArgs);
    }
/**
    *  Returns an xs:integer between 0 and 23, both inclusive, representing the value of the hours component in the localized value of $arg. <p> If $arg is the empty sequence, returns the empty sequence.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.hoursFromTime|fn.hoursFromTime}
    * @method planBuilder.fn#hoursFromTime
    * @since 2.1.1
    * @param { XsTime } [arg] - The time whose hours component will be returned.
    * @returns { XsInteger }
    */
hoursFromTime(...args) {
    const paramdef = ['arg', types.XsTime, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.hoursFromTime', 1, paramdef, args);
    return new types.XsInteger('fn', 'hours-from-time', checkedArgs);
    }
/**
    * Returns the value of the implicit timezone property from the dynamic context. Components of the dynamic context are discussed in <a>Section C.2 Dynamic Context Components[XP]</a>. Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.implicitTimezone|fn.implicitTimezone}
    * @method planBuilder.fn#implicitTimezone
    * @since 2.1.1

    * @returns { XsDayTimeDuration }
    */
implicitTimezone(...args) {
    bldrbase.checkMaxArity('fn.implicitTimezone', args.length, 0);
    return new types.XsDayTimeDuration('fn', 'implicit-timezone', args);
    }
/**
    *  Returns the prefixes of the in-scope namespaces for $element. For namespaces that have a prefix, it returns the prefix as an xs:NCName. For the default namespace, which has no prefix, it returns the zero-length string.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.inScopePrefixes|fn.inScopePrefixes}
    * @method planBuilder.fn#inScopePrefixes
    * @since 2.1.1
    * @param { ElementNode } [element] - The element whose in-scope prefixes will be returned.
    * @returns { XsString }
    */
inScopePrefixes(...args) {
    const paramdef = ['element', types.ElementNode, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.inScopePrefixes', 1, paramdef, args);
    return new types.XsString('fn', 'in-scope-prefixes', checkedArgs);
    }
/**
    *  Returns a sequence of positive integers giving the positions within the sequence $seqParam of items that are equal to $srchParam. <p> The collation used by the invocation of this function is determined according to the rules in 7.3.1 Collations. The collation is used when string comparison is required. <p> The items in the sequence $seqParam are compared with $srchParam under the rules for the eq operator. Values that cannot be compared, i.e. the eq operator is not defined for their types, are considered to be distinct. If an item compares equal, then the position of that item in the sequence $srchParam is included in the result. <p> If the value of $seqParam is the empty sequence, or if no item in $seqParam matches $srchParam, then the empty sequence is returned. <p> The first item in a sequence is at position 1, not position 0. <p> The result sequence is in ascending numeric order.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.indexOf|fn.indexOf}
    * @method planBuilder.fn#indexOf
    * @since 2.1.1
    * @param { XsAnyAtomicType } [seqParam] - A sequence of values.
    * @param { XsAnyAtomicType } [srchParam] - A value to find on the list.
    * @param { XsString } [collationLiteral] - A collation identifier.
    * @returns { XsInteger }
    */
indexOf(...args) {
    const namer = bldrbase.getNamer(args, 'seqParam');
    const paramdefs = [['seqParam', types.XsAnyAtomicType, false, true], ['srchParam', types.XsAnyAtomicType, true, false], ['collationLiteral', types.XsString, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.indexOf', 2, new Set(['seqParam', 'srchParam', 'collationLiteral']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.indexOf', 2, false, paramdefs, args);
    return new types.XsInteger('fn', 'index-of', checkedArgs);

    }
/**
    *  Returns a new sequence constructed from the value of $target with the value of $inserts inserted at the position specified by the value of $position. (The value of $target is not affected by the sequence construction.) <p> If $target is the empty sequence, $inserts is returned. If $inserts is the empty sequence, $target is returned. <p> The value returned by the function consists of all items of $target whose index is less than $position, followed by all items of $inserts, followed by the remaining elements of $target, in that sequence. <p> If $position is less than one (1), the first position, the effective value of $position is one (1). If $position is greater than the number of items in $target, then the effective value of $position is equal to the number of items in $target plus 1. <p> For detailed semantics see, <a>Section 7.2.15 The fn:insert-before function[FS]</a>.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.insertBefore|fn.insertBefore}
    * @method planBuilder.fn#insertBefore
    * @since 2.1.1
    * @param { Item } [target] - The sequence of items into which new items will be inserted.
    * @param { XsInteger } [position] - The position in the target sequence at which the new items will be added.
    * @param { Item } [inserts] - The items to insert into the target sequence.
    * @returns { Item }
    */
insertBefore(...args) {
    const namer = bldrbase.getNamer(args, 'target');
    const paramdefs = [['target', types.Item, false, true], ['position', types.XsInteger, true, false], ['inserts', types.Item, false, true]];
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
    const paramdef = ['uri-part', types.XsString, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.iriToUri', 1, paramdef, args);
    return new types.XsString('fn', 'iri-to-uri', checkedArgs);
    }
/**
    *  This function tests whether the language of $node, or the context node if the second argument is omitted, as specified by xml:lang attributes is the same as, or is a sublanguage of, the language specified by $testlang. The language of the argument node, or the context node if the second argument is omitted, is determined by the value of the xml:lang attribute on the node, or, if the node has no such attribute, by the value of the xml:lang attribute on the nearest ancestor of the node that has an xml:lang attribute. If there is no such ancestor, then the function returns false <p> If the second argument is omitted and the context item is undefined an error is raised: [err:XPDY0002]. If the context item is not a node an error is raised [err:XPTY0004]. <p> If $testlang is the empty sequence it is interpreted as the zero-length string. <p> The relevant xml:lang attribute is determined by the value of the XPath expression: (ancestor-or-self::* /@xml:lang)[last()]  <p>If this expression returns an empty sequence, the function returns false. <p> Otherwise, the function returns true if and only if the string-value of the relevant xml:lang attribute is equal to $testlang based on a caseless default match as specified in section 3.13 of [The Unicode Standard], or if the string-value of the relevant testlang attribute contains a hyphen, "-" (The character "-" is HYPHEN-MINUS, #x002D) such that the part of the string-value preceding that hyphen is equal to $testlang, using caseless matching.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.lang|fn.lang}
    * @method planBuilder.fn#lang
    * @since 2.1.1
    * @param { XsString } [testlang] - The language against which to test the node.
    * @param { Node } [node] - The node to test.
    * @returns { XsBoolean }
    */
lang(...args) {
    const namer = bldrbase.getNamer(args, 'testlang');
    const paramdefs = [['testlang', types.XsString, false, false], ['node', types.Node, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.lang', 2, new Set(['testlang', 'node']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.lang', 2, false, paramdefs, args);
    return new types.XsBoolean('fn', 'lang', checkedArgs);

    }
/**
    * Returns the local part of the name of $arg as an xs:string that will either be the zero-length string or will have the lexical form of an xs:NCName. <p> If the argument is omitted, it defaults to the context node. If the context item is undefined an error is raised: [err:XPDY0002]. If the context item is not a node an error is raised: [err:XPTY0004]. <p> If the argument is supplied and is the empty sequence, the function returns the zero-length string. <p> If the target node has no name (that is, if it is a document node, a comment, a text node, or a namespace node having no name), the function returns the zero-length string. <p> Otherwise, the value returned will be the local part of the expanded-QName of the target node (as determined by the dm:node-name accessor in Section 5.11 node-name Accessor[DM]. This will be an xs:string whose lexical form is an xs:NCName.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.localName|fn.localName}
    * @method planBuilder.fn#localName
    * @since 2.1.1
    * @param { Node } [arg] - The node whose local name is to be returned.
    * @returns { XsString }
    */
localName(...args) {
    const paramdef = ['arg', types.Node, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.localName', 1, paramdef, args);
    return new types.XsString('fn', 'local-name', checkedArgs);
    }
/**
    * Returns an <code>xs:NCName</code> representing the local part of $arg. If $arg is the empty sequence, returns the empty sequence. Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.localNameFromQName|fn.localNameFromQName}
    * @method planBuilder.fn#localNameFromQName
    * @since 2.1.1
    * @param { XsQName } [arg] - A qualified name.
    * @returns { XsNCName }
    */
localNameFromQName(...args) {
    const paramdef = ['arg', types.XsQName, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.localNameFromQName', 1, paramdef, args);
    return new types.XsNCName('fn', 'local-name-from-QName', checkedArgs);
    }
/**
    * Returns the specified string converting all of the characters to lower-case characters. If a character does not have a corresponding lower-case character, then the original character is returned. The lower-case characters are determined using the <a>Unicode Case Mappings</a>. Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.lowerCase|fn.lowerCase}
    * @method planBuilder.fn#lowerCase
    * @since 2.1.1
    * @param { XsString } [string] - The string to convert.
    * @returns { XsString }
    */
lowerCase(...args) {
    const paramdef = ['string', types.XsString, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.lowerCase', 1, paramdef, args);
    return new types.XsString('fn', 'lower-case', checkedArgs);
    }
/**
    * Returns <code>true</code> if the specified $input matches the specified $pattern, otherwise returns <code>false</code>. Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.matches|fn.matches}
    * @method planBuilder.fn#matches
    * @since 2.1.1
    * @param { XsString } [input] - The input from which to match.
    * @param { XsString } [pattern] - The regular expression to match.
    * @param { XsString } [flags] - The flag representing how to interpret the regular expression. One of "s", "m", "i", or "x", as defined in <a>http://www.w3.org/TR/xpath-functions/#flags</a>.
    * @returns { XsBoolean }
    */
matches(...args) {
    const namer = bldrbase.getNamer(args, 'input');
    const paramdefs = [['input', types.XsString, false, false], ['pattern', types.XsString, true, false], ['flags', types.XsString, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.matches', 2, new Set(['input', 'pattern', 'flags']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.matches', 2, false, paramdefs, args);
    return new types.XsBoolean('fn', 'matches', checkedArgs);

    }
/**
    *  Selects an item from the input sequence $arg whose value is greater than or equal to the value of every other item in the input sequence. If there are two or more such items, then the specific item whose value is returned is implementation dependent. <p> The following rules are applied to the input sequence:  <ul><li>Values of type xs:untypedAtomic in $arg are cast to xs:double.</li><li>For numeric values, the numeric promotion rules defined in 6.2 Operators on Numeric Values are used to promote all values to a single common type. </li></ul> <p> The items in the resulting sequence may be reordered in an arbitrary order. The resulting sequence is referred to below as the converted sequence.This function returns an item from the converted sequence rather than the input sequence. <p> If the converted sequence is empty, the empty sequence is returned. <p> All items in $arg must be numeric or derived from a single base type for which the ge operator is defined. In addition, the values in the sequence must have a total order. If date/time values do not have a timezone, they are considered to have the implicit timezone provided by the dynamic context for purposes of comparison. Duration values must either all be xs:yearMonthDuration values or must all be xs:dayTimeDuration values. <p> If any of these conditions is not met, then a type error is raised [err:FORG0006]. <p> If the converted sequence contains the value NaN, the value NaN is returned. <p> If the items in the value of $arg are of type xs:string or types derived by restriction from xs:string, then the determination of the item with the largest value is made according to the collation that is used. If the type of the items in $arg is not xs:string and $collation is specified, the collation is ignored. <p> The collation used by the invocation of this function is determined according to the rules in 7.3.1 Collations. <p> Otherwise, the result of the function is the result of the expression: <pre> if (every $v in $c satisfies $c[1] ge $v) then $c[1] else fn:max(fn:subsequence($c, 2)) </pre> <p> evaluated with $collation as the default collation if specified, and with $c as the converted sequence. <p> For detailed type semantics, see <a>Section 7.2.10 The fn:min, fn:max, fn:avg, and fn:sum functions[FS]</a>. <p> Notes: <p> If the converted sequence contains exactly one value then that value is returned. <p> The default type when the fn:max function is applied to xs:untypedAtomic values is xs:double. This differs from the default type for operators such as gt, and for sorting in XQuery and XSLT, which is xs:string.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.max|fn.max}
    * @method planBuilder.fn#max
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg] - The sequence of values whose maximum will be returned.
    * @param { XsString } [collation] - The optional name of a valid collation URI. For information on the collation URI syntax, see the <em>Search Developer's Guide</em>.
    * @returns { XsAnyAtomicType }
    */
max(...args) {
    const namer = bldrbase.getNamer(args, 'arg');
    const paramdefs = [['arg', types.XsAnyAtomicType, false, true], ['collation', types.XsString, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.max', 1, new Set(['arg', 'collation']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.max', 1, false, paramdefs, args);
    return new types.XsAnyAtomicType('fn', 'max', checkedArgs);

    }
/**
    *  Selects an item from the input sequence $arg whose value is less than or equal to the value of every other item in the input sequence. If there are two or more such items, then the specific item whose value is returned is implementation dependent. <p> The following rules are applied to the input sequence:  <ul><li>Values of type xs:untypedAtomic in $arg are cast to xs:double.</li><li>For numeric values, the numeric promotion rules defined in 6.2 Operators on Numeric Values are used to promote all values to a single common type. </li></ul> <p> The items in the resulting sequence may be reordered in an arbitrary order. The resulting sequence is referred to below as the converted sequence.This function returns an item from the converted sequence rather than the input sequence. <p> If the converted sequence is empty, the empty sequence is returned. <p> All items in $arg must be numeric or derived from a single base type for which the le operator is defined. In addition, the values in the sequence must have a total order. If date/time values do not have a timezone, they are considered to have the implicit timezone provided by the dynamic context for purposes of comparison. Duration values must either all be xs:yearMonthDuration values or must all be xs:dayTimeDuration values. <p> If any of these conditions is not met, then a type error is raised [err:FORG0006]. <p> If the converted sequence contains the value NaN, the value NaN is returned. <p> If the items in the value of $arg are of type xs:string or types derived by restriction from xs:string, then the determination of the item with the largest value is made according to the collation that is used. If the type of the items in $arg is not xs:string and $collation is specified, the collation is ignored. <p> The collation used by the invocation of this function is determined according to the rules in 7.3.1 Collations. <p> Otherwise, the result of the function is the result of the expression: <pre> if (every $v in $c satisfies $c[1] le $v) then $c[1] else fn:min(fn:subsequence($c, 2)) </pre> <p> evaluated with $collation as the default collation if specified, and with $c as the converted sequence. <p> For detailed type semantics, see <a>Section 7.2.10 The fn:min, fn:max, fn:avg, and fn:sum functions[FS]</a>. <p> Notes: <p> If the converted sequence contains exactly one value then that value is returned. <p> The default type when the fn:min function is applied to xs:untypedAtomic values is xs:double. This differs from the default type for operators such as gt, and for sorting in XQuery and XSLT, which is xs:string.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.min|fn.min}
    * @method planBuilder.fn#min
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg] - The sequence of values whose minimum will be returned.
    * @param { XsString } [collation] - The optional name of a valid collation URI. For information on the collation URI syntax, see the <em>Search Developer's Guide</em>.
    * @returns { XsAnyAtomicType }
    */
min(...args) {
    const namer = bldrbase.getNamer(args, 'arg');
    const paramdefs = [['arg', types.XsAnyAtomicType, false, true], ['collation', types.XsString, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.min', 1, new Set(['arg', 'collation']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.min', 1, false, paramdefs, args);
    return new types.XsAnyAtomicType('fn', 'min', checkedArgs);

    }
/**
    * Returns an xs:integer value between 0 and 59, both inclusive, representing the minute component in the localized value of $arg. <p> If $arg is the empty sequence, returns the empty sequence.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.minutesFromDateTime|fn.minutesFromDateTime}
    * @method planBuilder.fn#minutesFromDateTime
    * @since 2.1.1
    * @param { XsDateTime } [arg] - The dateTime whose minutes component will be returned.
    * @returns { XsInteger }
    */
minutesFromDateTime(...args) {
    const paramdef = ['arg', types.XsDateTime, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.minutesFromDateTime', 1, paramdef, args);
    return new types.XsInteger('fn', 'minutes-from-dateTime', checkedArgs);
    }
/**
    * Returns an xs:integer representing the minutes component in the canonical lexical representation of the value of $arg. The result may be negative. <p> If $arg is the empty sequence, returns the empty sequence.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.minutesFromDuration|fn.minutesFromDuration}
    * @method planBuilder.fn#minutesFromDuration
    * @since 2.1.1
    * @param { XsDuration } [arg] - The duration whose minute component will be returned.
    * @returns { XsInteger }
    */
minutesFromDuration(...args) {
    const paramdef = ['arg', types.XsDuration, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.minutesFromDuration', 1, paramdef, args);
    return new types.XsInteger('fn', 'minutes-from-duration', checkedArgs);
    }
/**
    *  Returns an xs:integer value between 0 to 59, both inclusive, representing the value of the minutes component in the localized value of $arg. <p> If $arg is the empty sequence, returns the empty sequence.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.minutesFromTime|fn.minutesFromTime}
    * @method planBuilder.fn#minutesFromTime
    * @since 2.1.1
    * @param { XsTime } [arg] - The time whose minutes component will be returned.
    * @returns { XsInteger }
    */
minutesFromTime(...args) {
    const paramdef = ['arg', types.XsTime, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.minutesFromTime', 1, paramdef, args);
    return new types.XsInteger('fn', 'minutes-from-time', checkedArgs);
    }
/**
    * Returns an xs:integer between 1 and 12, both inclusive, representing the month component in the localized value of $arg. <p> If $arg is the empty sequence, returns the empty sequence.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.monthFromDate|fn.monthFromDate}
    * @method planBuilder.fn#monthFromDate
    * @since 2.1.1
    * @param { XsDate } [arg] - The date whose month component will be returned.
    * @returns { XsInteger }
    */
monthFromDate(...args) {
    const paramdef = ['arg', types.XsDate, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.monthFromDate', 1, paramdef, args);
    return new types.XsInteger('fn', 'month-from-date', checkedArgs);
    }
/**
    *  Returns an xs:integer between 1 and 12, both inclusive, representing the month component in the localized value of $arg. <p> If $arg is the empty sequence, returns the empty sequence.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.monthFromDateTime|fn.monthFromDateTime}
    * @method planBuilder.fn#monthFromDateTime
    * @since 2.1.1
    * @param { XsDateTime } [arg] - The dateTime whose month component will be returned.
    * @returns { XsInteger }
    */
monthFromDateTime(...args) {
    const paramdef = ['arg', types.XsDateTime, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.monthFromDateTime', 1, paramdef, args);
    return new types.XsInteger('fn', 'month-from-dateTime', checkedArgs);
    }
/**
    * Returns an xs:integer representing the months component in the canonical lexical representation of the value of $arg. The result may be negative. <p> If $arg is the empty sequence, returns the empty sequence.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.monthsFromDuration|fn.monthsFromDuration}
    * @method planBuilder.fn#monthsFromDuration
    * @since 2.1.1
    * @param { XsDuration } [arg] - The duration whose month component will be returned.
    * @returns { XsInteger }
    */
monthsFromDuration(...args) {
    const paramdef = ['arg', types.XsDuration, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.monthsFromDuration', 1, paramdef, args);
    return new types.XsInteger('fn', 'months-from-duration', checkedArgs);
    }
/**
    * Returns the name of a node, as an <code>xs:string</code> that is either the zero-length string, or has the lexical form of an <code>xs:QName</code>. <p> If the argument is omitted, it defaults to the context node. If the context item is undefined an error is raised: [err:XPDY002]. If the context item is not a node an error is raised: [err:XPTY0004]. <p> If the argument is supplied and is the empty sequence, the function returns the zero-length string. <p> If the target node has no name (that is, if it is a document node, a comment, a text node, or a namespace node having no name), the function returns the zero-length string.  <p> If the specified node was created with a namespace prefix, that namespace prefix is returned with the element localname (for example, <code>a:hello</code>). Note that the namespace prefix is not always the same prefix that would be returned if you serialized the QName of the node, as the serialized QName will use the namespace from the XQuery context in which it was serialized. Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.name|fn.name}
    * @method planBuilder.fn#name
    * @since 2.1.1
    * @param { Node } [arg] - The node whose name is to be returned.
    * @returns { XsString }
    */
name(...args) {
    const paramdef = ['arg', types.Node, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.name', 1, paramdef, args);
    return new types.XsString('fn', 'name', checkedArgs);
    }
/**
    * Returns the namespace URI of the xs:QName of the node specified by $arg. <p> If the argument is omitted, it defaults to the context node. If the context item is undefined an error is raised: [err:XPDY0002]. If the context item is not a node an error is raised: [err:XPTY0004]. <p> If $arg is the empty sequence, the xs:anyURI corresponding to the zero-length string is returned. <p> If $arg is neither an element nor an attribute node, or if it is an element or attribute node whose expanded-QName (as determined by the dm:node-name accessor in the Section 5.11 node-name Accessor[DM]) is in no namespace, then the function returns the xs:anyURI corresponding to the zero-length string.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.namespaceUri|fn.namespaceUri}
    * @method planBuilder.fn#namespaceUri
    * @since 2.1.1
    * @param { Node } [arg] - The node whose namespace URI is to be returned.
    * @returns { XsAnyURI }
    */
namespaceUri(...args) {
    const paramdef = ['arg', types.Node, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.namespaceUri', 1, paramdef, args);
    return new types.XsAnyURI('fn', 'namespace-uri', checkedArgs);
    }
/**
    *  Returns the namespace URI of one of the in-scope namespaces for $element, identified by its namespace prefix. <p> If $element has an in-scope namespace whose namespace prefix is equal to $prefix, it returns the namespace URI of that namespace. If $prefix is the zero-length string or the empty sequence, it returns the namespace URI of the default (unnamed) namespace. Otherwise, it returns the empty sequence. <p> Prefixes are equal only if their Unicode code points match exactly.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.namespaceUriForPrefix|fn.namespaceUriForPrefix}
    * @method planBuilder.fn#namespaceUriForPrefix
    * @since 2.1.1
    * @param { XsString } [prefix] - A namespace prefix to look up.
    * @param { ElementNode } [element] - An element node providing namespace context.
    * @returns { XsAnyURI }
    */
namespaceUriForPrefix(...args) {
    const namer = bldrbase.getNamer(args, 'prefix');
    const paramdefs = [['prefix', types.XsString, false, false], ['element', types.ElementNode, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.namespaceUriForPrefix', 2, new Set(['prefix', 'element']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.namespaceUriForPrefix', 2, false, paramdefs, args);
    return new types.XsAnyURI('fn', 'namespace-uri-for-prefix', checkedArgs);

    }
/**
    * Returns the namespace URI for $arg as an <code>xs:string</code>. If $arg is the empty sequence, the empty sequence is returned. If $arg is in no namespace, the zero-length string is returned. Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.namespaceUriFromQName|fn.namespaceUriFromQName}
    * @method planBuilder.fn#namespaceUriFromQName
    * @since 2.1.1
    * @param { XsQName } [arg] - A qualified name.
    * @returns { XsAnyURI }
    */
namespaceUriFromQName(...args) {
    const paramdef = ['arg', types.XsQName, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.namespaceUriFromQName', 1, paramdef, args);
    return new types.XsAnyURI('fn', 'namespace-uri-from-QName', checkedArgs);
    }
/**
    *  Summary: Returns an xs:boolean indicating whether the argument node is "nilled". If the argument is not an element node, returns the empty sequence. If the argument is the empty sequence, returns the empty sequence. For element nodes, true() is returned if the element is nilled, otherwise false(). <p> Elements may be defined in a schema as nillable, which allows an empty instance of an element to a appear in a document even though its type requires that it always have some content. Nilled elements should always be empty but an element is not considered nilled just because it's empty. It must also have the type annotation attribute xsi:nil="true".  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.nilled|fn.nilled}
    * @method planBuilder.fn#nilled
    * @since 2.1.1
    * @param { Node } [arg] - The node to test for nilled status.
    * @returns { XsBoolean }
    */
nilled(...args) {
    const paramdef = ['arg', types.Node, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.nilled', 1, paramdef, args);
    return new types.XsBoolean('fn', 'nilled', checkedArgs);
    }
/**
    * Returns an expanded-QName for node kinds that can have names. For other kinds of nodes it returns the empty sequence. If $arg is the empty sequence, the empty sequence is returned. Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.nodeName|fn.nodeName}
    * @method planBuilder.fn#nodeName
    * @since 2.1.1
    * @param { Node } [arg] - The node whose name is to be returned.
    * @returns { XsQName }
    */
nodeName(...args) {
    const paramdef = ['arg', types.Node, false, false];
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
    const paramdef = ['input', types.XsString, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.normalizeSpace', 1, paramdef, args);
    return new types.XsString('fn', 'normalize-space', checkedArgs);
    }
/**
    * Return the argument normalized according to the normalization criteria for a normalization form identified by the value of $normalizationForm. The effective value of the $normalizationForm is computed by removing leading and trailing blanks, if present, and converting to upper case. Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.normalizeUnicode|fn.normalizeUnicode}
    * @method planBuilder.fn#normalizeUnicode
    * @since 2.1.1
    * @param { XsString } [arg] - The string to normalize.
    * @param { XsString } [normalizationForm] - The form under which to normalize the specified string: NFC, NFD, NFKC, or NFKD.
    * @returns { XsString }
    */
normalizeUnicode(...args) {
    const namer = bldrbase.getNamer(args, 'arg');
    const paramdefs = [['arg', types.XsString, false, false], ['normalizationForm', types.XsString, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.normalizeUnicode', 1, new Set(['arg', 'normalizationForm']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.normalizeUnicode', 1, false, paramdefs, args);
    return new types.XsString('fn', 'normalize-unicode', checkedArgs);

    }
/**
    * Returns <code>true</code> if the effective boolean value is <code>false</code>, and <code>false</code> if the effective boolean value is <code>true</code>. The <code>$arg</code> parameter is first reduced to an effective boolean value by applying the <code>fn:boolean</code> function. Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.not|fn.not}
    * @method planBuilder.fn#not
    * @since 2.1.1
    * @param { Item } [arg] - The expression to negate.
    * @returns { XsBoolean }
    */
not(...args) {
    const paramdef = ['arg', types.Item, false, true];
    const checkedArgs = bldrbase.makeSingleArgs('fn.not', 1, paramdef, args);
    return new types.XsBoolean('fn', 'not', checkedArgs);
    }
/**
    *  Returns the value indicated by $arg or, if $arg is not specified, the context item after atomization, converted to an xs:double. If $arg is the empty sequence or if $arg or the context item cannot be converted to an xs:double, the xs:double value NaN is returned. If the context item is undefined an error is raised: [err:XPDY0002]. <p> Calling the zero-argument version of the function is defined to give the same result as calling the single-argument version with an argument of ".". That is, fn:number() is equivalent to fn:number(.). <p> If $arg is the empty sequence, NaN is returned. Otherwise, $arg, or the context item after atomization, is converted to an xs:double following the rules of 17.1.3.2 Casting to xs:double. If the conversion to xs:double fails, the xs:double value NaN is returned.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.number|fn.number}
    * @method planBuilder.fn#number
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg] - The value to be returned as an xs:double value.
    * @returns { XsDouble }
    */
number(...args) {
    const paramdef = ['arg', types.XsAnyAtomicType, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.number', 1, paramdef, args);
    return new types.XsDouble('fn', 'number', checkedArgs);
    }
/**
    * Returns an <code>xs:NCName</code> representing the prefix of $arg. The empty sequence is returned if $arg is the empty sequence or if the value of $arg contains no prefix. Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.prefixFromQName|fn.prefixFromQName}
    * @method planBuilder.fn#prefixFromQName
    * @since 2.1.1
    * @param { XsQName } [arg] - A qualified name.
    * @returns { XsNCName }
    */
prefixFromQName(...args) {
    const paramdef = ['arg', types.XsQName, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.prefixFromQName', 1, paramdef, args);
    return new types.XsNCName('fn', 'prefix-from-QName', checkedArgs);
    }
/**
    *  Returns an <code>xs:QName</code> with the namespace URI given in $paramURI. If $paramURI is the zero-length string or the empty sequence, it represents "no namespace"; in this case, if the value of $paramQName contains a colon (:), an error is raised [err:FOCA0002]. The prefix (or absence of a prefix) in $paramQName is retained in the returned xs:QName value. The local name in the result is taken from the local part of $paramQName.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.QName|fn.QName}
    * @method planBuilder.fn#QName
    * @since 2.1.1
    * @param { XsString } [paramURI] - A namespace URI, as a string.
    * @param { XsString } [paramQName] - A lexical qualified name (xs:QName), a string of the form "prefix:localname" or "localname".
    * @returns { XsQName }
    */
QName(...args) {
    const namer = bldrbase.getNamer(args, 'paramURI');
    const paramdefs = [['paramURI', types.XsString, false, false], ['paramQName', types.XsString, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.QName', 2, new Set(['paramURI', 'paramQName']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.QName', 2, false, paramdefs, args);
    return new types.XsQName('fn', 'QName', checkedArgs);

    }
/**
    *  Returns a new sequence constructed from the value of $target with the item at the position specified by the value of $position removed. <p> If $position is less than 1 or greater than the number of items in $target, $target is returned. Otherwise, the value returned by the function consists of all items of $target whose index is less than $position, followed by all items of $target whose index is greater than $position. If $target is the empty sequence, the empty sequence is returned. <p> For detailed type semantics, see <a>Section 7.2.11 The fn:remove function[FS]</a>.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.remove|fn.remove}
    * @method planBuilder.fn#remove
    * @since 2.1.1
    * @param { Item } [target] - The sequence of items from which items will be removed.
    * @param { XsInteger } [position] - The position in the target sequence from which the items will be removed.
    * @returns { Item }
    */
remove(...args) {
    const namer = bldrbase.getNamer(args, 'target');
    const paramdefs = [['target', types.Item, false, true], ['position', types.XsInteger, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.remove', 2, new Set(['target', 'position']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.remove', 2, false, paramdefs, args);
    return new types.Item('fn', 'remove', checkedArgs);

    }
/**
    * Returns a string constructed by replacing the specified $pattern on the $input string with the specified $replacement string. Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.replace|fn.replace}
    * @method planBuilder.fn#replace
    * @since 2.1.1
    * @param { XsString } [input] - The string to start with.
    * @param { XsString } [pattern] - The regular expression pattern to match. If the pattern does not match the $input string, the function will return the $input string unchanged.
    * @param { XsString } [replacement] - The regular expression pattern to replace the $pattern with. It can also be a capture expression (for more details, see <a>http://www.w3.org/TR/xpath-functions/#func-replace</a>).
    * @param { XsString } [flags] - The flag representing how to interpret the regular expression. One of "s", "m", "i", or "x", as defined in <a>http://www.w3.org/TR/xpath-functions/#flags</a>.
    * @returns { XsString }
    */
replace(...args) {
    const namer = bldrbase.getNamer(args, 'input');
    const paramdefs = [['input', types.XsString, false, false], ['pattern', types.XsString, true, false], ['replacement', types.XsString, true, false], ['flags', types.XsString, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.replace', 3, new Set(['input', 'pattern', 'replacement', 'flags']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.replace', 3, false, paramdefs, args);
    return new types.XsString('fn', 'replace', checkedArgs);

    }
/**
    *  Returns an <code>xs:QName</code> value (that is, an expanded QName) by taking an <code>xs:string</code> that has the lexical form of an <code>xs:QName</code> (a string in the form "prefix:local-name" or "local-name") and resolving it using the in-scope namespaces for a given element.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.resolveQName|fn.resolveQName}
    * @method planBuilder.fn#resolveQName
    * @since 2.1.1
    * @param { XsString } [qname] - A string of the form "prefix:local-name".
    * @param { ElementNode } [element] - An element providing the in-scope namespaces to use to resolve the qualified name.
    * @returns { XsQName }
    */
resolveQName(...args) {
    const namer = bldrbase.getNamer(args, 'qname');
    const paramdefs = [['qname', types.XsString, false, false], ['element', types.ElementNode, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.resolveQName', 2, new Set(['qname', 'element']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.resolveQName', 2, false, paramdefs, args);
    return new types.XsQName('fn', 'resolve-QName', checkedArgs);

    }
/**
    * Resolves a relative URI against an absolute URI. If $base is specified, the URI is resolved relative to that base. If $base is not specified, the base is set to the base-uri property from the static context, if the property exists; if it does not exist, an error is thrown. Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.resolveUri|fn.resolveUri}
    * @method planBuilder.fn#resolveUri
    * @since 2.1.1
    * @param { XsString } [relative] - A URI reference to resolve against the base.
    * @param { XsString } [base] - An absolute URI to use as the base of the resolution.
    * @returns { XsAnyURI }
    */
resolveUri(...args) {
    const namer = bldrbase.getNamer(args, 'relative');
    const paramdefs = [['relative', types.XsString, false, false], ['base', types.XsString, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.resolveUri', 2, new Set(['relative', 'base']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.resolveUri', 2, false, paramdefs, args);
    return new types.XsAnyURI('fn', 'resolve-uri', checkedArgs);

    }
/**
    * Reverses the order of items in a sequence. If $arg is the empty sequence, the empty sequence is returned. <p> For detailed type semantics, see <a>Section 7.2.12 The fn:reverse function[FS]</a>.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.reverse|fn.reverse}
    * @method planBuilder.fn#reverse
    * @since 2.1.1
    * @param { Item } [target] - The sequence of items to be reversed.
    * @returns { Item }
    */
reverse(...args) {
    const paramdef = ['target', types.Item, false, true];
    const checkedArgs = bldrbase.makeSingleArgs('fn.reverse', 1, paramdef, args);
    return new types.Item('fn', 'reverse', checkedArgs);
    }
/**
    * Returns the root of the tree to which $arg belongs. This will usually, but not necessarily, be a document node. <p> If $arg is the empty sequence, the empty sequence is returned. <p> If $arg is a document node, $arg is returned. <p> If the function is called without an argument, the context item is used as the default argument. If the context item is undefined an error is raised: [err:XPDY0002]. If the context item is not a node an error is raised: [err:XPTY0004].  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.root|fn.root}
    * @method planBuilder.fn#root
    * @since 2.1.1
    * @param { Node } [arg] - The node whose root node will be returned.
    * @returns { Node }
    */
root(...args) {
    const paramdef = ['arg', types.Node, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.root', 1, paramdef, args);
    return new types.Node('fn', 'root', checkedArgs);
    }
/**
    *  Returns the number with no fractional part that is closest to the argument. If there are two such numbers, then the one that is closest to positive infinity is returned. If type of $arg is one of the four numeric types xs:float, xs:double, xs:decimal or xs:integer the type of the result is the same as the type of $arg. If the type of $arg is a type derived from one of the numeric types, the result is an instance of the base numeric type. <p> For xs:float and xs:double arguments, if the argument is positive infinity, then positive infinity is returned. If the argument is negative infinity, then negative infinity is returned. If the argument is positive zero, then positive zero is returned. If the argument is negative zero, then negative zero is returned. If the argument is less than zero, but greater than or equal to -0.5, then negative zero is returned. In the cases where positive zero or negative zero is returned, negative zero or positive zero may be returned as [XML Schema Part 2: Datatypes Second Edition] does not distinguish between the values positive zero and negative zero. <p> For the last two cases, note that the result is not the same as fn:floor(x+0.5). <p> For detailed type semantics, see Section 7.2.3 The fn:abs, fn:ceiling, fn:floor, fn:round, and fn:round-half-to-even functions[FS].  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.round|fn.round}
    * @method planBuilder.fn#round
    * @since 2.1.1
    * @param { XsNumeric } [arg] - A numeric value to round.
    * @returns { XsNumeric }
    */
round(...args) {
    const paramdef = ['arg', types.XsNumeric, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.round', 1, paramdef, args);
    return new types.XsNumeric('fn', 'round', checkedArgs);
    }
/**
    *  The value returned is the nearest (that is, numerically closest) numeric to $arg that is a multiple of ten to the power of minus $precision. If two such values are equally near (e.g. if the fractional part in $arg is exactly .500...), returns the one whose least significant digit is even. If type of $arg is one of the four numeric types xs:float, xs:double, xs:decimal or xs:integer the type of the result is the same as the type of $arg. If the type of $arg is a type derived from one of the numeric types, the result is an instance of the base numeric type. <p> If no precision is specified, the result produces is the same as with $precision=0. <p> For arguments of type xs:float and xs:double, if the argument is positive zero, then positive zero is returned. If the argument is negative zero, then negative zero is returned. If the argument is less than zero, but greater than or equal o -0.5, then negative zero is returned. <p> If $arg is of type xs:float or xs:double, rounding occurs on the value of the mantissa computed with exponent = 0. <p> For detailed type semantics, see Section 7.2.3 The fn:abs, fn:ceiling, fn:floor, fn:round, and fn:round-half-to-even functions[FS].  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.roundHalfToEven|fn.roundHalfToEven}
    * @method planBuilder.fn#roundHalfToEven
    * @since 2.1.1
    * @param { XsNumeric } [arg] - A numeric value to round.
    * @param { XsInteger } [precision] - The precision to which to round the value.
    * @returns { XsNumeric }
    */
roundHalfToEven(...args) {
    const namer = bldrbase.getNamer(args, 'arg');
    const paramdefs = [['arg', types.XsNumeric, false, false], ['precision', types.XsInteger, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.roundHalfToEven', 1, new Set(['arg', 'precision']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.roundHalfToEven', 1, false, paramdefs, args);
    return new types.XsNumeric('fn', 'round-half-to-even', checkedArgs);

    }
/**
    *  Returns an xs:decimal value between 0 and 60.999..., both inclusive representing the seconds and fractional seconds in the localized value of $arg. Note that the value can be greater than 60 seconds to accommodate occasional leap seconds used to keep human time synchronized with the rotation of the planet. <p> If $arg is the empty sequence, returns the empty sequence.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.secondsFromDateTime|fn.secondsFromDateTime}
    * @method planBuilder.fn#secondsFromDateTime
    * @since 2.1.1
    * @param { XsDateTime } [arg] - The dateTime whose seconds component will be returned.
    * @returns { XsDecimal }
    */
secondsFromDateTime(...args) {
    const paramdef = ['arg', types.XsDateTime, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.secondsFromDateTime', 1, paramdef, args);
    return new types.XsDecimal('fn', 'seconds-from-dateTime', checkedArgs);
    }
/**
    * Returns an xs:decimal representing the seconds component in the canonical lexical representation of the value of $arg. The result may be negative. <p> If $arg is the empty sequence, returns the empty sequence.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.secondsFromDuration|fn.secondsFromDuration}
    * @method planBuilder.fn#secondsFromDuration
    * @since 2.1.1
    * @param { XsDuration } [arg] - The duration whose minute component will be returned.
    * @returns { XsDecimal }
    */
secondsFromDuration(...args) {
    const paramdef = ['arg', types.XsDuration, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.secondsFromDuration', 1, paramdef, args);
    return new types.XsDecimal('fn', 'seconds-from-duration', checkedArgs);
    }
/**
    *  Returns an xs:decimal value between 0 and 60.999..., both inclusive, representing the seconds and fractional seconds in the localized value of $arg. Note that the value can be greater than 60 seconds to accommodate occasional leap seconds used to keep human time synchronized with the rotation of the planet. <p> If $arg is the empty sequence, returns the empty sequence.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.secondsFromTime|fn.secondsFromTime}
    * @method planBuilder.fn#secondsFromTime
    * @since 2.1.1
    * @param { XsTime } [arg] - The time whose seconds component will be returned.
    * @returns { XsDecimal }
    */
secondsFromTime(...args) {
    const paramdef = ['arg', types.XsTime, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.secondsFromTime', 1, paramdef, args);
    return new types.XsDecimal('fn', 'seconds-from-time', checkedArgs);
    }
/**
    * Returns <code>true</code> if the first parameter starts with the string from the second parameter, otherwise returns <code>false</code>. Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.startsWith|fn.startsWith}
    * @method planBuilder.fn#startsWith
    * @since 2.1.1
    * @param { XsString } [parameter1] - The string from which to test.
    * @param { XsString } [parameter2] - The string to test whether it is at the beginning of the first parameter.
    * @param { XsString } [collation] - The optional name of a valid collation URI. For information on the collation URI syntax, see the <em>Search Developer's Guide</em>.
    * @returns { XsBoolean }
    */
startsWith(...args) {
    const namer = bldrbase.getNamer(args, 'parameter1');
    const paramdefs = [['parameter1', types.XsString, false, false], ['parameter2', types.XsString, false, false], ['collation', types.XsString, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.startsWith', 2, new Set(['parameter1', 'parameter2', 'collation']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.startsWith', 2, false, paramdefs, args);
    return new types.XsBoolean('fn', 'starts-with', checkedArgs);

    }
/**
    * Returns the value of $arg represented as an <code>xs:string</code>. If no argument is supplied, this function returns the string value of the context item (.). Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.string|fn.string}
    * @method planBuilder.fn#string
    * @since 2.1.1
    * @param { Item } [arg] - The item to be rendered as a string.
    * @returns { XsString }
    */
string(...args) {
    const paramdef = ['arg', types.Item, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.string', 1, paramdef, args);
    return new types.XsString('fn', 'string', checkedArgs);
    }
/**
    *  Returns an <code>xs:string</code> created by concatenating the members of the $parameter1 sequence using $parameter2 as a separator. If the value of $arg2 is the zero-length string, then the members of $parameter1 are concatenated without a separator. <p> If the value of $parameter1 is the empty sequence, the zero-length string is returned.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.stringJoin|fn.stringJoin}
    * @method planBuilder.fn#stringJoin
    * @since 2.1.1
    * @param { XsString } [parameter1] - A sequence of strings.
    * @param { XsString } [parameter2] - A separator string to concatenate between the items in $parameter1.
    * @returns { XsString }
    */
stringJoin(...args) {
    const namer = bldrbase.getNamer(args, 'parameter1');
    const paramdefs = [['parameter1', types.XsString, false, true], ['parameter2', types.XsString, true, false]];
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
    const paramdef = ['sourceString', types.XsString, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.stringLength', 1, paramdef, args);
    return new types.XsInteger('fn', 'string-length', checkedArgs);
    }
/**
    *  Returns the sequence of Unicode code points that constitute an xs:string. If $arg is a zero-length string or the empty sequence, the empty sequence is returned.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.stringToCodepoints|fn.stringToCodepoints}
    * @method planBuilder.fn#stringToCodepoints
    * @since 2.1.1
    * @param { XsString } [arg] - A string.
    * @returns { XsInteger }
    */
stringToCodepoints(...args) {
    const paramdef = ['arg', types.XsString, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.stringToCodepoints', 1, paramdef, args);
    return new types.XsInteger('fn', 'string-to-codepoints', checkedArgs);
    }
/**
    *  Returns the contiguous sequence of items in the value of $sourceSeq beginning at the position indicated by the value of $startingLoc and continuing for the number of items indicated by the value of $length. <p> In the two-argument case, returns: <p> $sourceSeq[fn:round($startingLoc) le $p] <p> In the three-argument case, returns: <p> $sourceSeq[fn:round($startingLoc) le $p and $p lt fn:round($startingLoc) + fn:round($length)] <p> Notes: <p> If $sourceSeq is the empty sequence, the empty sequence is returned. <p> If $startingLoc is zero or negative, the subsequence includes items from the beginning of the $sourceSeq. <p> If $length is not specified, the subsequence includes items to the end of $sourceSeq. <p> If $length is greater than the number of items in the value of $sourceSeq following $startingLoc, the subsequence includes items to the end of $sourceSeq. <p> The first item of a sequence is located at position 1, not position 0. <p> For detailed type semantics, see Section 7.2.13 The fn:subsequence functionFS. <p> The reason the function accepts arguments of type xs:double is that many computations on untyped data return an xs:double result; and the reason for the rounding rules is to compensate for any imprecision in these floating-point computations.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.subsequence|fn.subsequence}
    * @method planBuilder.fn#subsequence
    * @since 2.1.1
    * @param { Item } [sourceSeq] - The sequence of items from which a subsequence will be selected.
    * @param { XsNumeric } [startingLoc] - The starting position of the start of the subsequence.
    * @param { XsNumeric } [length] - The length of the subsequence.
    * @returns { Item }
    */
subsequence(...args) {
    const namer = bldrbase.getNamer(args, 'sourceSeq');
    const paramdefs = [['sourceSeq', types.Item, false, true], ['startingLoc', types.XsNumeric, true, false], ['length', types.XsNumeric, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.subsequence', 2, new Set(['sourceSeq', 'startingLoc', 'length']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.subsequence', 2, false, paramdefs, args);
    return new types.Item('fn', 'subsequence', checkedArgs);

    }
/**
    * Returns a substring starting from the $startingLoc and continuing for $length characters. Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.substring|fn.substring}
    * @method planBuilder.fn#substring
    * @since 2.1.1
    * @param { XsString } [sourceString] - The string from which to create a substring.
    * @param { XsNumeric } [startingLoc] - The number of characters from the start of the $sourceString.
    * @param { XsNumeric } [length] - The number of characters beyond the $startingLoc.
    * @returns { XsString }
    */
substring(...args) {
    const namer = bldrbase.getNamer(args, 'sourceString');
    const paramdefs = [['sourceString', types.XsString, false, false], ['startingLoc', types.XsNumeric, true, false], ['length', types.XsNumeric, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.substring', 2, new Set(['sourceString', 'startingLoc', 'length']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.substring', 2, false, paramdefs, args);
    return new types.XsString('fn', 'substring', checkedArgs);

    }
/**
    * Returns the substring created by taking all of the input characters that occur after the specified $after characters. Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.substringAfter|fn.substringAfter}
    * @method planBuilder.fn#substringAfter
    * @since 2.1.1
    * @param { XsString } [input] - The string from which to create the substring.
    * @param { XsString } [after] - The string after which the substring is created.
    * @param { XsString } [collation] - The optional name of a valid collation URI. For information on the collation URI syntax, see the <em>Search Developer's Guide</em>.
    * @returns { XsString }
    */
substringAfter(...args) {
    const namer = bldrbase.getNamer(args, 'input');
    const paramdefs = [['input', types.XsString, false, false], ['after', types.XsString, false, false], ['collation', types.XsString, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.substringAfter', 2, new Set(['input', 'after', 'collation']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.substringAfter', 2, false, paramdefs, args);
    return new types.XsString('fn', 'substring-after', checkedArgs);

    }
/**
    * Returns the substring created by taking all of the input characters that occur before the specified $before characters. Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.substringBefore|fn.substringBefore}
    * @method planBuilder.fn#substringBefore
    * @since 2.1.1
    * @param { XsString } [input] - The string from which to create the substring.
    * @param { XsString } [before] - The string before which the substring is created.
    * @param { XsString } [collation] - The optional name of a valid collation URI. For information on the collation URI syntax, see the <em>Search Developer's Guide</em>.
    * @returns { XsString }
    */
substringBefore(...args) {
    const namer = bldrbase.getNamer(args, 'input');
    const paramdefs = [['input', types.XsString, false, false], ['before', types.XsString, false, false], ['collation', types.XsString, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.substringBefore', 2, new Set(['input', 'before', 'collation']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.substringBefore', 2, false, paramdefs, args);
    return new types.XsString('fn', 'substring-before', checkedArgs);

    }
/**
    *  Returns a value obtained by adding together the values in $arg. If $zero is not specified, then the value returned for an empty sequence is the xs:integer value 0. If $zero is specified, then the value returned for an empty sequence is $zero. <p> Any values of type xs:untypedAtomic in $arg are cast to xs:double. The items in the resulting sequence may be reordered in an arbitrary order. The resulting sequence is referred to below as the converted sequence. <p> If the converted sequence is empty, then the single-argument form of the function returns the xs:integer value 0; the two-argument form returns the value of the argument $zero. <p> If the converted sequence contains the value NaN, NaN is returned. <p> All items in $arg must be numeric or derived from a single base type. In addition, the type must support addition. Duration values must either all be xs:yearMonthDuration values or must all be xs:dayTimeDuration values. For numeric values, the numeric promotion rules defined in 6.2 Operators on Numeric Values are used to promote all values to a single common type. The sum of a sequence of integers will therefore be an integer, while the sum of a numeric sequence that includes at least one xs:double will be an xs:double. <p> If the above conditions are not met, a type error is raised [err:FORG0006]. <p> Otherwise, the result of the function, using the second signature, is the result of the expression: <pre> if (fn:count($c) eq 0) then $zero else if (fn:count($c) eq 1) then $c[1] else $c[1] + fn:sum(subsequence($c, 2)) </pre> <p> where $c is the converted sequence. <p> The result of the function, using the first signature, is the result of the expression:fn:sum($arg, 0). <p> For detailed type semantics, see <a>Section 7.2.10 The fn:min, fn:max, fn:avg, and fn:sum functions[FS]</a>. <p> Notes: <p> The second argument allows an appropriate value to be defined to represent the sum of an empty sequence. For example, when summing a sequence of durations it would be appropriate to return a zero-length duration of the appropriate type. This argument is necessary because a system that does dynamic typing cannot distinguish "an empty sequence of integers", for example, from "an empty sequence of durations". <p> If the converted sequence contains exactly one value then that value is returned.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.sum|fn.sum}
    * @method planBuilder.fn#sum
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg] - The sequence of values to be summed.
    * @param { XsAnyAtomicType } [zero] - The value to return as zero if the input sequence is the empty sequence. This parameter is not available in the 0.9-ml XQuery dialect.
    * @returns { XsAnyAtomicType }
    */
sum(...args) {
    const namer = bldrbase.getNamer(args, 'arg');
    const paramdefs = [['arg', types.XsAnyAtomicType, false, true], ['zero', types.XsAnyAtomicType, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.sum', 1, new Set(['arg', 'zero']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.sum', 1, false, paramdefs, args);
    return new types.XsAnyAtomicType('fn', 'sum', checkedArgs);

    }
/**
    * Returns all but the first item in a sequence. For more details, see <a>XPath 3.0 Functions and Operators</a>. Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.tail|fn.tail}
    * @method planBuilder.fn#tail
    * @since 2.1.1
    * @param { Item } [seq] - The function value.
    * @returns { Item }
    */
tail(...args) {
    const paramdef = ['seq', types.Item, false, true];
    const checkedArgs = bldrbase.makeSingleArgs('fn.tail', 1, paramdef, args);
    return new types.Item('fn', 'tail', checkedArgs);
    }
/**
    *  Returns the timezone component of $arg if any. If $arg has a timezone component, then the result is an xs:dayTimeDuration that indicates deviation from UTC; its value may range from +14:00 to -14:00 hours, both inclusive. Otherwise, the result is the empty sequence. <p> If $arg is the empty sequence, returns the empty sequence.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.timezoneFromDate|fn.timezoneFromDate}
    * @method planBuilder.fn#timezoneFromDate
    * @since 2.1.1
    * @param { XsDate } [arg] - The date whose timezone component will be returned.
    * @returns { XsDayTimeDuration }
    */
timezoneFromDate(...args) {
    const paramdef = ['arg', types.XsDate, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.timezoneFromDate', 1, paramdef, args);
    return new types.XsDayTimeDuration('fn', 'timezone-from-date', checkedArgs);
    }
/**
    *  Returns the timezone component of $arg if any. If $arg has a timezone component, then the result is an xs:dayTimeDuration that indicates deviation from UTC; its value may range from +14:00 to -14:00 hours, both inclusive. Otherwise, the result is the empty sequence. <p> If $arg is the empty sequence, returns the empty sequence.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.timezoneFromDateTime|fn.timezoneFromDateTime}
    * @method planBuilder.fn#timezoneFromDateTime
    * @since 2.1.1
    * @param { XsDateTime } [arg] - The dateTime whose timezone component will be returned.
    * @returns { XsDayTimeDuration }
    */
timezoneFromDateTime(...args) {
    const paramdef = ['arg', types.XsDateTime, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.timezoneFromDateTime', 1, paramdef, args);
    return new types.XsDayTimeDuration('fn', 'timezone-from-dateTime', checkedArgs);
    }
/**
    *  Returns the timezone component of $arg if any. If $arg has a timezone component, then the result is an xs:dayTimeDuration that indicates deviation from UTC; its value may range from +14:00 to -14:00 hours, both inclusive. Otherwise, the result is the empty sequence. <p> If $arg is the empty sequence, returns the empty sequence.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.timezoneFromTime|fn.timezoneFromTime}
    * @method planBuilder.fn#timezoneFromTime
    * @since 2.1.1
    * @param { XsTime } [arg] - The time whose timezone component will be returned.
    * @returns { XsDayTimeDuration }
    */
timezoneFromTime(...args) {
    const paramdef = ['arg', types.XsTime, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.timezoneFromTime', 1, paramdef, args);
    return new types.XsDayTimeDuration('fn', 'timezone-from-time', checkedArgs);
    }
/**
    * Returns a sequence of strings contructed by breaking the specified input into substrings separated by the specified $pattern. The specified $pattern is not returned as part of the returned items. Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.tokenize|fn.tokenize}
    * @method planBuilder.fn#tokenize
    * @since 2.1.1
    * @param { XsString } [input] - The string to tokenize.
    * @param { XsString } [pattern] - The regular expression pattern from which to separate the tokens.
    * @param { XsString } [flags] - The flag representing how to interpret the regular expression. One of "s", "m", "i", or "x", as defined in <a>http://www.w3.org/TR/xpath-functions/#flags</a>.
    * @returns { XsString }
    */
tokenize(...args) {
    const namer = bldrbase.getNamer(args, 'input');
    const paramdefs = [['input', types.XsString, false, false], ['pattern', types.XsString, true, false], ['flags', types.XsString, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.tokenize', 2, new Set(['input', 'pattern', 'flags']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.tokenize', 2, false, paramdefs, args);
    return new types.XsString('fn', 'tokenize', checkedArgs);

    }
/**
    * Returns a string where every character in $src that occurs in some position in the $mapString is translated into the $transString character in the corresponding location of the $mapString character. Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.translate|fn.translate}
    * @method planBuilder.fn#translate
    * @since 2.1.1
    * @param { XsString } [src] - The string to translate characters.
    * @param { XsString } [mapString] - The string representing characters to be translated.
    * @param { XsString } [transString] - The string representing the characters to which the $mapString characters are translated.
    * @returns { XsString }
    */
translate(...args) {
    const namer = bldrbase.getNamer(args, 'src');
    const paramdefs = [['src', types.XsString, false, false], ['mapString', types.XsString, true, false], ['transString', types.XsString, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.translate', 3, new Set(['src', 'mapString', 'transString']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.translate', 3, false, paramdefs, args);
    return new types.XsString('fn', 'translate', checkedArgs);

    }
/**
    * Returns the <code>xs:boolean</code> value <code>true</code>. Equivalent to <code>xs:boolean("1")</code>. Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.true|fn.true}
    * @method planBuilder.fn#true
    * @since 2.1.1

    * @returns { XsBoolean }
    */
true(...args) {
    bldrbase.checkMaxArity('fn.true', args.length, 0);
    return new types.XsBoolean('fn', 'true', args);
    }
/**
    *  Returns the items of $sourceSeq in an implementation dependent order. <p> Note: <p> Query optimizers may be able to do a better job if the order of the output sequence is not specified. For example, when retrieving prices from a purchase order, if an index exists on prices, it may be more efficient to return the prices in index order rather than in document order.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.unordered|fn.unordered}
    * @method planBuilder.fn#unordered
    * @since 2.1.1
    * @param { Item } [sourceSeq] - The sequence of items.
    * @returns { Item }
    */
unordered(...args) {
    const paramdef = ['sourceSeq', types.Item, false, true];
    const checkedArgs = bldrbase.makeSingleArgs('fn.unordered', 1, paramdef, args);
    return new types.Item('fn', 'unordered', checkedArgs);
    }
/**
    * Returns the specified string converting all of the characters to upper-case characters. If a character does not have a corresponding upper-case character, then the original character is returned. The upper-case characters are determined using the <a>Unicode Case Mappings</a>. Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.upperCase|fn.upperCase}
    * @method planBuilder.fn#upperCase
    * @since 2.1.1
    * @param { XsString } [string] - The string to upper-case.
    * @returns { XsString }
    */
upperCase(...args) {
    const paramdef = ['string', types.XsString, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.upperCase', 1, paramdef, args);
    return new types.XsString('fn', 'upper-case', checkedArgs);
    }
/**
    * Returns an xs:integer representing the year component in the localized value of $arg. The result may be negative. <p> If $arg is the empty sequence, returns the empty sequence.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.yearFromDate|fn.yearFromDate}
    * @method planBuilder.fn#yearFromDate
    * @since 2.1.1
    * @param { XsDate } [arg] - The date whose year component will be returned.
    * @returns { XsInteger }
    */
yearFromDate(...args) {
    const paramdef = ['arg', types.XsDate, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.yearFromDate', 1, paramdef, args);
    return new types.XsInteger('fn', 'year-from-date', checkedArgs);
    }
/**
    * Returns an xs:integer representing the year component in the localized value of $arg. The result may be negative. <p> If $arg is the empty sequence, returns the empty sequence.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.yearFromDateTime|fn.yearFromDateTime}
    * @method planBuilder.fn#yearFromDateTime
    * @since 2.1.1
    * @param { XsDateTime } [arg] - The dateTime whose year component will be returned.
    * @returns { XsInteger }
    */
yearFromDateTime(...args) {
    const paramdef = ['arg', types.XsDateTime, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.yearFromDateTime', 1, paramdef, args);
    return new types.XsInteger('fn', 'year-from-dateTime', checkedArgs);
    }
/**
    * Returns an xs:integer representing the years component in the canonical lexical representation of the value of $arg. The result may be negative. <p> If $arg is the empty sequence, returns the empty sequence.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/fn.yearsFromDuration|fn.yearsFromDuration}
    * @method planBuilder.fn#yearsFromDuration
    * @since 2.1.1
    * @param { XsDuration } [arg] - The duration whose year component will be returned.
    * @returns { XsInteger }
    */
yearsFromDuration(...args) {
    const paramdef = ['arg', types.XsDuration, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.yearsFromDuration', 1, paramdef, args);
    return new types.XsInteger('fn', 'years-from-duration', checkedArgs);
    }
}
class JsonExpr {
  constructor() {
  }
  /**
    * Creates a (JSON) array, which is like a sequence of values, but allows for nesting. Provides a client interface to a server function. See {@link http://docs.marklogic.com/json.array|json.array}
    * @method planBuilder.json#array
    * @since 2.1.1
    * @param { ElementNode } [array] - A serialized array element.
    * @returns { JsonArray }
    */
array(...args) {
    const paramdef = ['array', types.ElementNode, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('json.array', 0, paramdef, args);
    return new types.JsonArray('json', 'array', checkedArgs);
    }
/**
    * Returns the size of the array. Provides a client interface to a server function. See {@link http://docs.marklogic.com/json.arraySize|json.arraySize}
    * @method planBuilder.json#arraySize
    * @since 2.1.1
    * @param { JsonArray } [array] - An array.
    * @returns { XsUnsignedLong }
    */
arraySize(...args) {
    const paramdef = ['array', types.JsonArray, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('json.arraySize', 1, paramdef, args);
    return new types.XsUnsignedLong('json', 'array-size', checkedArgs);
    }
/**
    * Returns the array values as an XQuery sequence. Provides a client interface to a server function. See {@link http://docs.marklogic.com/json.arrayValues|json.arrayValues}
    * @method planBuilder.json#arrayValues
    * @since 2.1.1
    * @param { JsonArray } [array] - An array.
    * @param { XsBoolean } [flatten] - Include values from subarrays in the sequence. The default is false, meaning that subarrays are returned as array values.
    * @returns { Item }
    */
arrayValues(...args) {
    const namer = bldrbase.getNamer(args, 'array');
    const paramdefs = [['array', types.JsonArray, true, false], ['flatten', types.XsBoolean, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'json.arrayValues', 1, new Set(['array', 'flatten']), paramdefs, args) :
        bldrbase.makePositionalArgs('json.arrayValues', 1, false, paramdefs, args);
    return new types.Item('json', 'array-values', checkedArgs);

    }
/**
    * Creates a JSON object, which is a kind of map with a fixed and ordered set of keys. Provides a client interface to a server function. See {@link http://docs.marklogic.com/json.object|json.object}
    * @method planBuilder.json#object
    * @since 2.1.1
    * @param { ElementNode } [map] - A serialized JSON object.
    * @returns { JsonObject }
    */
object(...args) {
    const paramdef = ['map', types.ElementNode, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('json.object', 0, paramdef, args);
    return new types.JsonObject('json', 'object', checkedArgs);
    }
/**
    * Creates a JSON object. Provides a client interface to a server function. See {@link http://docs.marklogic.com/json.objectDefine|json.objectDefine}
    * @method planBuilder.json#objectDefine
    * @since 2.1.1
    * @param { XsString } [keys] - The sequence of keys in this object.
    * @returns { JsonObject }
    */
objectDefine(...args) {
    const paramdef = ['keys', types.XsString, false, true];
    const checkedArgs = bldrbase.makeSingleArgs('json.objectDefine', 0, paramdef, args);
    return new types.JsonObject('json', 'object-define', checkedArgs);
    }
/**
    * Extract a subarray from an array, producing a new array. The second and third arguments to this function operate similarly to those of fn:subsequence for XQuery sequences. Provides a client interface to a server function. See {@link http://docs.marklogic.com/json.subarray|json.subarray}
    * @method planBuilder.json#subarray
    * @since 2.1.1
    * @param { JsonArray } [array] - An array.
    * @param { XsNumeric } [startingLoc] - The starting position of the start of the subarray.
    * @param { XsNumeric } [length] - The length of the subarray.
    * @returns { JsonArray }
    */
subarray(...args) {
    const namer = bldrbase.getNamer(args, 'array');
    const paramdefs = [['array', types.JsonArray, true, false], ['startingLoc', types.XsNumeric, true, false], ['length', types.XsNumeric, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'json.subarray', 2, new Set(['array', 'startingLoc', 'length']), paramdefs, args) :
        bldrbase.makePositionalArgs('json.subarray', 2, false, paramdefs, args);
    return new types.JsonArray('json', 'subarray', checkedArgs);

    }
/**
    * Constructs an array from a sequence of items. Provides a client interface to a server function. See {@link http://docs.marklogic.com/json.toArray|json.toArray}
    * @method planBuilder.json#toArray
    * @since 2.1.1
    * @param { Item } [items] - A sequence of items.
    * @param { XsNumeric } [limit] - The size of the array to construct. If the size is less than the length of the item sequence, only as "limit" items are put into the array. If the size is more than the length of the sequence, the array is filled with null values up to the limit.
    * @param { Item } [zero] - The value to use to pad out the array, if necessary. By default the empty sequence is used.
    * @returns { JsonArray }
    */
toArray(...args) {
    const namer = bldrbase.getNamer(args, 'items');
    const paramdefs = [['items', types.Item, false, true], ['limit', types.XsNumeric, false, false], ['zero', types.Item, false, false]];
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
    * Returns true if the key exists in the map. Provides a client interface to a server function. See {@link http://docs.marklogic.com/map.contains|map.contains}
    * @method planBuilder.map#contains
    * @since 2.1.1
    * @param { MapMap } [map] - A map.
    * @param { XsString } [key] - A key.
    * @returns { XsBoolean }
    */
contains(...args) {
    const namer = bldrbase.getNamer(args, 'map');
    const paramdefs = [['map', types.MapMap, true, false], ['key', types.XsString, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'map.contains', 2, new Set(['map', 'key']), paramdefs, args) :
        bldrbase.makePositionalArgs('map.contains', 2, false, paramdefs, args);
    return new types.XsBoolean('map', 'contains', checkedArgs);

    }
/**
    * Returns the number of keys used in the map. Provides a client interface to a server function. See {@link http://docs.marklogic.com/map.count|map.count}
    * @method planBuilder.map#count
    * @since 2.1.1
    * @param { MapMap } [map] - A map.
    * @returns { XsUnsignedInt }
    */
count(...args) {
    const paramdef = ['map', types.MapMap, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('map.count', 1, paramdef, args);
    return new types.XsUnsignedInt('map', 'count', checkedArgs);
    }
/**
    * Constructs a new map with a single entry consisting of the key and value specified as arguments. This is particularly helpful when used as part of an argument to map:new(). Provides a client interface to a server function. See {@link http://docs.marklogic.com/map.entry|map.entry}
    * @method planBuilder.map#entry
    * @since 2.1.1
    * @param { XsString } [key] - The map key.
    * @param { Item } [value] - The map value.
    * @returns { MapMap }
    */
entry(...args) {
    const namer = bldrbase.getNamer(args, 'key');
    const paramdefs = [['key', types.XsString, true, false], ['value', types.Item, false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'map.entry', 2, new Set(['key', 'value']), paramdefs, args) :
        bldrbase.makePositionalArgs('map.entry', 2, false, paramdefs, args);
    return new types.MapMap('map', 'entry', checkedArgs);

    }
/**
    * Get a value from a map. Provides a client interface to a server function. See {@link http://docs.marklogic.com/map.get|map.get}
    * @method planBuilder.map#get
    * @since 2.1.1
    * @param { MapMap } [map] - A map.
    * @param { XsString } [key] - A key.
    * @returns { Item }
    */
get(...args) {
    const namer = bldrbase.getNamer(args, 'map');
    const paramdefs = [['map', types.MapMap, true, false], ['key', types.XsString, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'map.get', 2, new Set(['map', 'key']), paramdefs, args) :
        bldrbase.makePositionalArgs('map.get', 2, false, paramdefs, args);
    return new types.Item('map', 'get', checkedArgs);

    }
/**
    * Get the keys used in the map. Provides a client interface to a server function. See {@link http://docs.marklogic.com/map.keys|map.keys}
    * @method planBuilder.map#keys
    * @since 2.1.1
    * @param { MapMap } [map] - A map.
    * @returns { XsString }
    */
keys(...args) {
    const paramdef = ['map', types.MapMap, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('map.keys', 1, paramdef, args);
    return new types.XsString('map', 'keys', checkedArgs);
    }
/**
    * Creates a map. Provides a client interface to a server function. See {@link http://docs.marklogic.com/map.map|map.map}
    * @method planBuilder.map#map
    * @since 2.1.1
    * @param { ElementNode } [map] - A serialized map element.
    * @returns { MapMap }
    */
map(...args) {
    const paramdef = ['map', types.ElementNode, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('map.map', 0, paramdef, args);
    return new types.MapMap('map', 'map', checkedArgs);
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
    const paramdef = ['x', types.XsDouble, true, false];
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
    const paramdef = ['x', types.XsDouble, true, false];
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
    const paramdef = ['x', types.XsDouble, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('math.atan', 1, paramdef, args);
    return new types.XsDouble('math', 'atan', checkedArgs);
    }
/**
    * Returns the arc tangent of y/x, in radians, in the range from -pi/2 to +pi/2 (inclusive), using the signs of y and x to determine the apropriate quadrant. Provides a client interface to a server function. See {@link http://docs.marklogic.com/math.atan2|math.atan2}
    * @method planBuilder.math#atan2
    * @since 2.1.1
    * @param { XsDouble } [y] - The floating point dividend.
    * @param { XsDouble } [x] - The floating point divisor.
    * @returns { XsDouble }
    */
atan2(...args) {
    const namer = bldrbase.getNamer(args, 'y');
    const paramdefs = [['y', types.XsDouble, true, false], ['x', types.XsDouble, true, false]];
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
    const paramdef = ['x', types.XsDouble, true, false];
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
    const paramdef = ['arg', types.JsonArray, false, true];
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
    const paramdef = ['x', types.XsDouble, true, false];
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
    const paramdef = ['x', types.XsDouble, true, false];
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
    const paramdef = ['x', types.XsDouble, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('math.cot', 1, paramdef, args);
    return new types.XsDouble('math', 'cot', checkedArgs);
    }
/**
    *  Returns the sample covariance of a data set. The size of the input array should be 2. The function eliminates all pairs for which either the first element or the second element is empty. After the elimination, if the length of the input is less than 2, the function returns the empty sequence.  <p>For the version of this that uses range indexes, see <a>cts:covariance</a>.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/math.covariance|math.covariance}
    * @method planBuilder.math#covariance
    * @since 2.1.1
    * @param { JsonArray } [arg] - The input data set. Each array should contain a pair of values.
    * @returns { XsDouble }
    */
covariance(...args) {
    const paramdef = ['arg', types.JsonArray, false, true];
    const checkedArgs = bldrbase.makeSingleArgs('math.covariance', 1, paramdef, args);
    return new types.XsDouble('math', 'covariance', checkedArgs);
    }
/**
    *  Returns the population covariance of a data set. The size of the input array should be 2. The function eliminates all pairs for which either the first element or the second element is empty. After the elimination, if the length of the input is 0, the function returns the empty sequence.  <p>For the version of this that uses range indexes, see <a>cts:covariance-p</a>.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/math.covarianceP|math.covarianceP}
    * @method planBuilder.math#covarianceP
    * @since 2.1.1
    * @param { JsonArray } [arg] - The input data set. Each array should contain a pair of values.
    * @returns { XsDouble }
    */
covarianceP(...args) {
    const paramdef = ['arg', types.JsonArray, false, true];
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
    const paramdef = ['x', types.XsDouble, true, false];
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
    const paramdef = ['x', types.XsDouble, true, false];
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
    const paramdef = ['x', types.XsDouble, true, false];
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
    const paramdef = ['x', types.XsDouble, true, false];
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
    const paramdefs = [['x', types.XsDouble, true, false], ['y', types.XsDouble, true, false]];
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
    const paramdef = ['x', types.XsDouble, true, false];
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
    const paramdefs = [['y', types.XsDouble, true, false], ['i', types.XsInteger, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'math.ldexp', 2, new Set(['y', 'i']), paramdefs, args) :
        bldrbase.makePositionalArgs('math.ldexp', 2, false, paramdefs, args);
    return new types.XsDouble('math', 'ldexp', checkedArgs);

    }
/**
    * Returns a linear model that fits the given data set. The size of the input array should be 2, as currently only simple linear regression model is supported. The first element of the array should be the value of the dependent variable while the other element should be the value of the independent variable. <p>The function eliminates all pairs for which either the first element or the second element is empty. After the elimination, if the length of the input is less than 2, the function returns the empty sequence. After the elimination, if the standard deviation of the independent variable is 0, the function returns a linear model with intercept = the mean of the dependent variable, coefficients = NaN and r-squared = NaN. After the elimination, if the standard deviation of the dependent variable is 0, the function returns a linear model with r-squared = NaN. <p>For the version of this function that uses Range Indexes, see <a>cts:linear-model</a>. Provides a client interface to a server function. See {@link http://docs.marklogic.com/math.linearModel|math.linearModel}
    * @method planBuilder.math#linearModel
    * @since 2.1.1
    * @param { JsonArray } [arg] - The input data set. Each array should contain a pair of values.
    * @returns { MathLinearModel }
    */
linearModel(...args) {
    const paramdef = ['arg', types.JsonArray, false, true];
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
    const paramdef = ['linear-model', types.MathLinearModel, true, false];
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
    const paramdef = ['linear-model', types.MathLinearModel, true, false];
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
    const paramdef = ['linear-model', types.MathLinearModel, true, false];
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
    const paramdef = ['x', types.XsDouble, true, false];
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
    const paramdef = ['x', types.XsDouble, true, false];
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
    const paramdef = ['arg', types.XsDouble, false, true];
    const checkedArgs = bldrbase.makeSingleArgs('math.median', 1, paramdef, args);
    return new types.XsDouble('math', 'median', checkedArgs);
    }
/**
    *  Returns the mode of a sequence. The mode is the value that occurs most frequently in a data set. If no value occurs more than once in the data set, the function returns the empty sequence. If the input is the empty sequence, the function returns the empty sequence. <p> Note that a data set can have multiple “modes”. The order of multiple modes in the returned sequence is undefined. <p> Also note that values from a lexicon lookup are repeated <code>cts:frequency</code> times before calculating the mode. <p> The function can be used on numeric values, <code>xs:yearMonthDuration</code>, <code>xs:dayTimeDuration</code>, <code>xs:string</code>, <code>xs:anyURI</code>, <code>xs:date</code>, <code>xs:dateTime</code>, <code>xs:time</code>, and <code>cts:point</code>.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/math.mode|math.mode}
    * @method planBuilder.math#mode
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg] - The sequence of values.
    * @param { XsString } [options] - Options. The default is (). <p> Options include:</p> <blockquote><dl> <dt>"collation=<em>URI</em>"</dt> <dd>Applies only when $arg is of the xs:string type. If no specified, the default collation is used.</dd> <dt>"coordinate-system=<em>name</em>"</dt> <dd>Applies only when $arg is of the cts:point type. If no specified, the default coordinate system is used.</dd> </dl></blockquote>
    * @returns { XsAnyAtomicType }
    */
mode(...args) {
    const namer = bldrbase.getNamer(args, 'arg');
    const paramdefs = [['arg', types.XsAnyAtomicType, false, true], ['options', types.XsString, false, true]];
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
    const paramdef = ['x', types.XsDouble, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('math.modf', 1, paramdef, args);
    return new types.XsDouble('math', 'modf', checkedArgs);
    }
/**
    * Returns the rank of a value in a data set as a percentage of the data set. If the given value is not equal to any item in the sequence, the function returns the empty sequence. See <code>math:rank</code>. Provides a client interface to a server function. See {@link http://docs.marklogic.com/math.percentRank|math.percentRank}
    * @method planBuilder.math#percentRank
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg] - The sequence of values.
    * @param { XsAnyAtomicType } [value] - The value to be "ranked".
    * @param { XsString } [options] - Options. The default is (). <p> Options include:</p> <blockquote><dl> <dt>"ascending"(default)</dt> <dd>Rank the value as if the sequence was sorted in ascending order. </dd> <dt>"descending"</dt> <dd>Rank the value as if the sequence was sorted in descending order. </dd> <dt>"collation=<em>URI</em>"</dt> <dd>Applies only when $arg is of the xs:string type. If no specified, the default collation is used.</dd> <dt>"coordinate-system=<em>name</em>"</dt> <dd>Applies only when $arg is of the cts:point type. If no specified, the default coordinate system is used.</dd> </dl></blockquote>
    * @returns { XsDouble }
    */
percentRank(...args) {
    const namer = bldrbase.getNamer(args, 'arg');
    const paramdefs = [['arg', types.XsAnyAtomicType, false, true], ['value', types.XsAnyAtomicType, true, false], ['options', types.XsString, false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'math.percentRank', 2, new Set(['arg', 'value', 'options']), paramdefs, args) :
        bldrbase.makePositionalArgs('math.percentRank', 2, false, paramdefs, args);
    return new types.XsDouble('math', 'percent-rank', checkedArgs);

    }
/**
    * Returns a sequence of percentile(s) given a sequence of percentage(s). The function returns the empty sequence if either <code>$arg</code> or <code>$p</code> is the empty sequence. Provides a client interface to a server function. See {@link http://docs.marklogic.com/math.percentile|math.percentile}
    * @method planBuilder.math#percentile
    * @since 2.1.1
    * @param { XsDouble } [arg] - The sequence of values to calculate the percentile(s) on.
    * @param { XsDouble } [p] - The sequence of percentage(s).
    * @returns { XsDouble }
    */
percentile(...args) {
    const namer = bldrbase.getNamer(args, 'arg');
    const paramdefs = [['arg', types.XsDouble, false, true], ['p', types.XsDouble, false, true]];
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
    const paramdefs = [['x', types.XsDouble, true, false], ['y', types.XsDouble, true, false]];
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
    const paramdef = ['x', types.XsDouble, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('math.radians', 1, paramdef, args);
    return new types.XsDouble('math', 'radians', checkedArgs);
    }
/**
    * Returns the rank of a value in a data set. Ranks are skipped in the event of ties. If the given value is not equal to any item in the sequence, the function returns the empty sequence. The function can be used on numeric values, <code>xs:yearMonthDuration</code>, <code>xs:dayTimeDuration</code>, <code>xs:string</code>, <code>xs:anyURI</code>, <code>xs:date</code>, <code>xs:dateTime</code>, <code>xs:time</code>, and <code>cts:point</code>. Provides a client interface to a server function. See {@link http://docs.marklogic.com/math.rank|math.rank}
    * @method planBuilder.math#rank
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg1] - The sequence of values.
    * @param { XsAnyAtomicType } [arg2] - The value to be "ranked".
    * @param { XsString } [options] - Options. The default is (). <p> Options include:</p> <blockquote><dl> <dt>"ascending"(default)</dt> <dd>Rank the value as if the sequence was sorted in ascending order. </dd> <dt>"descending"</dt> <dd>Rank the value as if the sequence was sorted in descending order. </dd> <dt>"collation=<em>URI</em>"</dt> <dd>Applies only when $arg is of the xs:string type. If no specified, the default collation is used.</dd> <dt>"coordinate-system=<em>name</em>"</dt> <dd>Applies only when $arg is of the cts:point type. If no specified, the default coordinate system is used.</dd> </dl></blockquote>
    * @returns { XsInteger }
    */
rank(...args) {
    const namer = bldrbase.getNamer(args, 'arg1');
    const paramdefs = [['arg1', types.XsAnyAtomicType, false, true], ['arg2', types.XsAnyAtomicType, true, false], ['options', types.XsString, false, true]];
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
    const paramdef = ['x', types.XsDouble, true, false];
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
    const paramdef = ['x', types.XsDouble, true, false];
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
    const paramdef = ['x', types.XsDouble, true, false];
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
    const paramdef = ['arg', types.XsDouble, false, true];
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
    const paramdef = ['arg', types.XsDouble, false, true];
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
    const paramdef = ['x', types.XsDouble, true, false];
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
    const paramdef = ['x', types.XsDouble, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('math.tanh', 1, paramdef, args);
    return new types.XsDouble('math', 'tanh', checkedArgs);
    }
/**
    *  Returns the number truncated to a certain number of decimal places. If type of $arg is one of the four numeric types xs:float, xs:double, xs:decimal or xs:integer the type of the result is the same as the type of $arg. If the type of $arg is a type derived from one of the numeric types, the result is an instance of the base numeric type. <p> For xs:float and xs:double arguments, if the argument is positive infinity, then positive infinity is returned. If the argument is negative infinity, then negative infinity is returned. If the argument is positive zero, then positive zero is returned. If the argument is negative zero, then negative zero is returned.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/math.trunc|math.trunc}
    * @method planBuilder.math#trunc
    * @since 2.1.1
    * @param { XsNumeric } [arg] - A numeric value to truncate.
    * @param { XsInteger } [n] - The numbers of decimal places to truncate to. The default is 0. Negative values cause that many digits to the left of the decimal point to be truncated.
    * @returns { XsNumeric }
    */
trunc(...args) {
    const namer = bldrbase.getNamer(args, 'arg');
    const paramdefs = [['arg', types.XsNumeric, false, false], ['n', types.XsInteger, true, false]];
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
    const paramdef = ['arg', types.XsDouble, false, true];
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
    const paramdef = ['arg', types.XsDouble, false, true];
    const checkedArgs = bldrbase.makeSingleArgs('math.varianceP', 1, paramdef, args);
    return new types.XsDouble('math', 'variance-p', checkedArgs);
    }
}
class RdfExpr {
  constructor() {
  }
  /**
    * Returns an <code>rdf:langString</code> value with the given value and language tag. The <code>rdf:langString</code> type extends <code>xs:string</code>, and represents a language tagged string in RDF. <p>This function is a built-in. Provides a client interface to a server function. See {@link http://docs.marklogic.com/rdf.langString|rdf.langString}
    * @method planBuilder.rdf#langString
    * @since 2.1.1
    * @param { XsString } [string] - The lexical value.
    * @param { XsString } [lang] - The language.
    * @returns { RdfLangString }
    */
langString(...args) {
    const namer = bldrbase.getNamer(args, 'string');
    const paramdefs = [['string', types.XsString, true, false], ['lang', types.XsString, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'rdf.langString', 2, new Set(['string', 'lang']), paramdefs, args) :
        bldrbase.makePositionalArgs('rdf.langString', 2, false, paramdefs, args);
    return new types.RdfLangString('rdf', 'langString', checkedArgs);

    }
/**
    * Returns the language of an <code>rdf:langString</code> value. <p>This function is a built-in. Provides a client interface to a server function. See {@link http://docs.marklogic.com/rdf.langStringLanguage|rdf.langStringLanguage}
    * @method planBuilder.rdf#langStringLanguage
    * @since 2.1.1
    * @param { RdfLangString } [val] - The rdf:langString value.
    * @returns { XsString }
    */
langStringLanguage(...args) {
    const paramdef = ['val', types.RdfLangString, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('rdf.langStringLanguage', 1, paramdef, args);
    return new types.XsString('rdf', 'langString-language', checkedArgs);
    }
}
class SemExpr {
  constructor() {
  }
  /**
    * This function returns an identifier for a blank node, allowing the construction of a triple that refers to a blank node. This XQuery function backs up the SPARQL BNODE() function. <p>This function is a built-in. Provides a client interface to a server function. See {@link http://docs.marklogic.com/sem.bnode|sem.bnode}
    * @method planBuilder.sem#bnode
    * @since 2.1.1
    * @param { XsAnyAtomicType } [value] - If provided, the same blank node identifier is returned for the same argument value passed to the function.
    * @returns { SemBlank }
    */
bnode(...args) {
    const paramdef = ['value', types.XsAnyAtomicType, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('sem.bnode', 0, paramdef, args);
    return new types.SemBlank('sem', 'bnode', checkedArgs);
    }
/**
    * Returns the value of the first argument that evaluates without error. This XQuery function backs up the SPARQL COALESCE() functional form. <p>This function is a built-in. Provides a client interface to a server function. See {@link http://docs.marklogic.com/sem.coalesce|sem.coalesce}
    * @method planBuilder.sem#coalesce
    * @since 2.1.1
    * @param { Item } [parameter1] - A value.
    * @returns { Item }
    */
coalesce(...args) {
    const namer = bldrbase.getNamer(args, 'parameter1');
    const paramdefs = [['parameter1', types.Item, false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'sem.coalesce', 1, new Set(['parameter1']), paramdefs, args) :
        bldrbase.makePositionalArgs('sem.coalesce', 1, true, paramdefs, args);
    return new types.Item('sem', 'coalesce', checkedArgs);

    }
/**
    * Returns the name of the simple type of the atomic value argument as a SPARQL style IRI. If the value is derived from <code>sem:unknown</code> or <code>sem:invalid</code>, the datatype IRI part of those values is returned. This XQuery function backs up the SPARQL datatype() function. <p>This function is a built-in. Provides a client interface to a server function. See {@link http://docs.marklogic.com/sem.datatype|sem.datatype}
    * @method planBuilder.sem#datatype
    * @since 2.1.1
    * @param { XsAnyAtomicType } [value] - The value to return the type of.
    * @returns { SemIri }
    */
datatype(...args) {
    const paramdef = ['value', types.XsAnyAtomicType, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('sem.datatype', 1, paramdef, args);
    return new types.SemIri('sem', 'datatype', checkedArgs);
    }
/**
    * The IF function form evaluates the first argument, interprets it as a effective boolean value, then returns the value of expression2 if the EBV is true, otherwise it returns the value of expression3. Only one of expression2 and expression3 is evaluated. If evaluating the first argument raises an error, then an error is raised for the evaluation of the IF expression. This XQuery function backs up the SPARQL IF() functional form. <p>This function is a built-in. Provides a client interface to a server function. See {@link http://docs.marklogic.com/sem.if|sem.if}
    * @method planBuilder.sem#if
    * @since 2.1.1
    * @param { XsBoolean } [condition] - The condition.
    * @param { Item } [then] - The then expression.
    * @param { Item } [else] - The else expression.
    * @returns { Item }
    */
if(...args) {
    const namer = bldrbase.getNamer(args, 'condition');
    const paramdefs = [['condition', types.XsBoolean, true, false], ['then', types.Item, false, true], ['else', types.Item, false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'sem.if', 3, new Set(['condition', 'then', 'else']), paramdefs, args) :
        bldrbase.makePositionalArgs('sem.if', 3, false, paramdefs, args);
    return new types.Item('sem', 'if', checkedArgs);

    }
/**
    * Returns a <code>sem:invalid</code> value with the given literal value and datatype IRI. The <code>sem:invalid</code> type extends <code>xs:untypedAtomic</code>, and represents an RDF value whose literal string is invalid according to the schema for it's datatype. <p>This function is a built-in. Provides a client interface to a server function. See {@link http://docs.marklogic.com/sem.invalid|sem.invalid}
    * @method planBuilder.sem#invalid
    * @since 2.1.1
    * @param { XsString } [string] - The lexical value.
    * @param { SemIri } [datatype] - The datatype IRI.
    * @returns { SemInvalid }
    */
invalid(...args) {
    const namer = bldrbase.getNamer(args, 'string');
    const paramdefs = [['string', types.XsString, true, false], ['datatype', types.SemIri, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'sem.invalid', 2, new Set(['string', 'datatype']), paramdefs, args) :
        bldrbase.makePositionalArgs('sem.invalid', 2, false, paramdefs, args);
    return new types.SemInvalid('sem', 'invalid', checkedArgs);

    }
/**
    * Returns the datatype IRI of a <code>sem:invalid</code> value. <p>This function is a built-in. Provides a client interface to a server function. See {@link http://docs.marklogic.com/sem.invalidDatatype|sem.invalidDatatype}
    * @method planBuilder.sem#invalidDatatype
    * @since 2.1.1
    * @param { SemInvalid } [val] - The sem:invalid value.
    * @returns { SemIri }
    */
invalidDatatype(...args) {
    const paramdef = ['val', types.SemInvalid, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('sem.invalidDatatype', 1, paramdef, args);
    return new types.SemIri('sem', 'invalid-datatype', checkedArgs);
    }
/**
    * This is a constructor function that takes a string and constructs an item of type <code>sem:iri</code> from it. Provides a client interface to a server function. See {@link http://docs.marklogic.com/sem.iri|sem.iri}
    * @method planBuilder.sem#iri
    * @since 2.1.1
    * @param { XsAnyAtomicType } [stringIri] - The string with which to construct the <code>sem:iri</code>.
    * @returns { SemIri }
    */
iri(...args) {
    const paramdef = ['string-iri', types.XsAnyAtomicType, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('sem.iri', 1, paramdef, args);
    return new types.SemIri('sem', 'iri', checkedArgs);
    }
/**
    *  Provides a client interface to a server function. See {@link http://docs.marklogic.com/sem.iriToQName|sem.iriToQName}
    * @method planBuilder.sem#iriToQName
    * @since 2.1.1
    * @param { XsString } [arg1] - 
    * @returns { XsQName }
    */
iriToQName(...args) {
    const paramdef = ['arg1', types.XsString, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('sem.iriToQName', 1, paramdef, args);
    return new types.XsQName('sem', 'iri-to-QName', checkedArgs);
    }
/**
    * Returns true if the argument is an RDF blank node - that is, derived from type <code>sem:blank</code>. This XQuery function backs up the SPARQL isBlank() function. <p>This function is a built-in. Provides a client interface to a server function. See {@link http://docs.marklogic.com/sem.isBlank|sem.isBlank}
    * @method planBuilder.sem#isBlank
    * @since 2.1.1
    * @param { XsAnyAtomicType } [value] - The value to test.
    * @returns { XsBoolean }
    */
isBlank(...args) {
    const paramdef = ['value', types.XsAnyAtomicType, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('sem.isBlank', 1, paramdef, args);
    return new types.XsBoolean('sem', 'isBlank', checkedArgs);
    }
/**
    * Returns true if the argument is an RDF IRI - that is, derived from type <code>sem:iri</code>, but not derived from type <code>sem:blank</code>. This XQuery function backs up the SPARQL isIRI() and isURI() functions. <p>This function is a built-in. Provides a client interface to a server function. See {@link http://docs.marklogic.com/sem.isIRI|sem.isIRI}
    * @method planBuilder.sem#isIRI
    * @since 2.1.1
    * @param { XsAnyAtomicType } [value] - The value to test.
    * @returns { XsBoolean }
    */
isIRI(...args) {
    const paramdef = ['value', types.XsAnyAtomicType, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('sem.isIRI', 1, paramdef, args);
    return new types.XsBoolean('sem', 'isIRI', checkedArgs);
    }
/**
    * Returns true if the argument is an RDF literal - that is, derived from type <code>xs:anyAtomicType</code>, but not derived from type <code>sem:iri</code>. This XQuery function backs up the SPARQL isLiteral() function. <p>This function is a built-in. Provides a client interface to a server function. See {@link http://docs.marklogic.com/sem.isLiteral|sem.isLiteral}
    * @method planBuilder.sem#isLiteral
    * @since 2.1.1
    * @param { XsAnyAtomicType } [value] - The value to test.
    * @returns { XsBoolean }
    */
isLiteral(...args) {
    const paramdef = ['value', types.XsAnyAtomicType, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('sem.isLiteral', 1, paramdef, args);
    return new types.XsBoolean('sem', 'isLiteral', checkedArgs);
    }
/**
    * Returns true if the argument is a valid numeric RDF literal. This XQuery function backs up the SPARQL isNumeric() function. <p>This function is a built-in. Provides a client interface to a server function. See {@link http://docs.marklogic.com/sem.isNumeric|sem.isNumeric}
    * @method planBuilder.sem#isNumeric
    * @since 2.1.1
    * @param { XsAnyAtomicType } [value] - The value to test.
    * @returns { XsBoolean }
    */
isNumeric(...args) {
    const paramdef = ['value', types.XsAnyAtomicType, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('sem.isNumeric', 1, paramdef, args);
    return new types.XsBoolean('sem', 'isNumeric', checkedArgs);
    }
/**
    * Returns the language of the value passed in, or the empty string if the value has no language. Only values derived from <code>rdf:langString</code> have a language. This XQuery function backs up the SPARQL lang() function. <p>This function is a built-in. Provides a client interface to a server function. See {@link http://docs.marklogic.com/sem.lang|sem.lang}
    * @method planBuilder.sem#lang
    * @since 2.1.1
    * @param { XsAnyAtomicType } [value] - The value to return the language of.
    * @returns { XsString }
    */
lang(...args) {
    const paramdef = ['value', types.XsAnyAtomicType, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('sem.lang', 1, paramdef, args);
    return new types.XsString('sem', 'lang', checkedArgs);
    }
/**
    * Returns true if <code>$lang-tag</code> matches <code>$lang-range</code> according to the basic filtering scheme defined in RFC4647. This XQuery function backs up the SPARQL langMatches() function. <p>This function is a built-in. Provides a client interface to a server function. See {@link http://docs.marklogic.com/sem.langMatches|sem.langMatches}
    * @method planBuilder.sem#langMatches
    * @since 2.1.1
    * @param { XsString } [langTag] - The language tag.
    * @param { XsString } [langRange] - The language range.
    * @returns { XsBoolean }
    */
langMatches(...args) {
    const namer = bldrbase.getNamer(args, 'lang-tag');
    const paramdefs = [['lang-tag', types.XsString, true, false], ['lang-range', types.XsString, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'sem.langMatches', 2, new Set(['lang-tag', 'lang-range']), paramdefs, args) :
        bldrbase.makePositionalArgs('sem.langMatches', 2, false, paramdefs, args);
    return new types.XsBoolean('sem', 'langMatches', checkedArgs);

    }
/**
    *  Provides a client interface to a server function. See {@link http://docs.marklogic.com/sem.QNameToIri|sem.QNameToIri}
    * @method planBuilder.sem#QNameToIri
    * @since 2.1.1
    * @param { XsQName } [arg1] - 
    * @returns { SemIri }
    */
QNameToIri(...args) {
    const paramdef = ['arg1', types.XsQName, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('sem.QNameToIri', 1, paramdef, args);
    return new types.SemIri('sem', 'QName-to-iri', checkedArgs);
    }
/**
    * Returns a random double between 0 and 1. This XQuery function backs up the SPARQL RAND() function. <p>This function is a built-in. Provides a client interface to a server function. See {@link http://docs.marklogic.com/sem.random|sem.random}
    * @method planBuilder.sem#random
    * @since 2.1.1

    * @returns { XsDouble }
    */
random(...args) {
    bldrbase.checkMaxArity('sem.random', args.length, 0);
    return new types.XsDouble('sem', 'random', args);
    }
/**
    * Returns true if the arguments are the same RDF term as defined by the RDF concepts specification. This XQuery function backs up the SPARQL sameTerm() function. <p>This function is a built-in. Provides a client interface to a server function. See {@link http://docs.marklogic.com/sem.sameTerm|sem.sameTerm}
    * @method planBuilder.sem#sameTerm
    * @since 2.1.1
    * @param { XsAnyAtomicType } [a] - The first value to test.
    * @param { XsAnyAtomicType } [b] - The second value to test.
    * @returns { XsBoolean }
    */
sameTerm(...args) {
    const namer = bldrbase.getNamer(args, 'a');
    const paramdefs = [['a', types.XsAnyAtomicType, true, false], ['b', types.XsAnyAtomicType, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'sem.sameTerm', 2, new Set(['a', 'b']), paramdefs, args) :
        bldrbase.makePositionalArgs('sem.sameTerm', 2, false, paramdefs, args);
    return new types.XsBoolean('sem', 'sameTerm', checkedArgs);

    }
/**
    * The <code>sem:store</code> function defines a set of criteria, that when evaluated, selects a set of triples to be passed in to <code>sem:sparql()</code>, <code>sem:sparql-update()</code>, or <code>sem:sparql-values()</code> as part of the options argument. The <code>sem:store</code> constructor queries from the current database's triple index, restricted by the options and the <code>cts:query</code> argument (for instance, "triples in documents matching this query"). <p>This function is a built-in. Provides a client interface to a server function. See {@link http://docs.marklogic.com/sem.store|sem.store}
    * @method planBuilder.sem#store
    * @since 2.1.1
    * @param { XsString } [options] - Options as a sequence of string values. Available options are: <dl> <dt>"any"</dt> <dd>Values from any fragment should be included.</dd> <dt>"document"</dt> <dd>Values from document fragments should be included.</dd> <dt>"properties"</dt> <dd>Values from properties fragments should be included.</dd> <dt>"locks"</dt> <dd>Values from locks fragments should be included.</dd> <dt>"checked"</dt> <dd>Word positions should be checked when resolving the query.</dd> <dt>"unchecked"</dt> <dd>Word positions should not be checked when resolving the query.</dd> <dt>"size=<em>number of MB</em>"</dt> <dd>The maximum size of the memory used to cache inferred triples. This defaults to the default inference size set for the app-server. If the value provided is bigger than the maximum inference size set for the App Server, an error is raised [XDMP-INFSIZE].</dd> <dt>"no-default-rulesets"</dt> <dd>Don't apply the database's default rulesets to the sem:store.</dd> <dt>"locking=read-write/write"</dt> <dd><code>read-write</code>: Read-lock documents containing triples being accessed, write-lock documents being updated; <code>write</code>: Only write-lock documents being updated. Default is <code>locking=read-write</code>. Locking is ignored in query transaction. </dd> </dl>
    * @param { CtsQuery } [query] - Only include triples in fragments selected by the <code>cts:query</code>. The triples do not need to match the query, but they must occur in fragments selected by the query. The fragments are not filtered to ensure they match the query, but instead selected in the same manner as <a> "unfiltered" <code>cts:search</code></a> operations. If a string is entered, the string is treated as a <code>cts:word-query</code> of the specified string.
    * @returns { SemStore }
    */
store(...args) {
    const namer = bldrbase.getNamer(args, 'options');
    const paramdefs = [['options', types.XsString, false, true], ['query', types.CtsQuery, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'sem.store', 0, new Set(['options', 'query']), paramdefs, args) :
        bldrbase.makePositionalArgs('sem.store', 0, false, paramdefs, args);
    return new types.SemStore('sem', 'store', checkedArgs);

    }
/**
    * Returns the timezone of an <code>xs:dateTime</code> value as a string. This XQuery function backs up the SPARQL TZ() function. <p>This function is a built-in. Provides a client interface to a server function. See {@link http://docs.marklogic.com/sem.timezoneString|sem.timezoneString}
    * @method planBuilder.sem#timezoneString
    * @since 2.1.1
    * @param { XsDateTime } [value] - The dateTime value
    * @returns { XsString }
    */
timezoneString(...args) {
    const paramdef = ['value', types.XsDateTime, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('sem.timezoneString', 1, paramdef, args);
    return new types.XsString('sem', 'timezone-string', checkedArgs);
    }
/**
    * Returns a value to represent the RDF typed literal with lexical value <code>$value</code> and datatype IRI <code>$datatype</code>. Returns a value of type <code>sem:unknown</code> for datatype IRIs for which there is no schema, and a value of type <code>sem:invalid</code> for lexical values which are invalid according to the schema for the given datatype. This XQuery function backs up the SPARQL STRDT() function. <p>This function is a built-in. Provides a client interface to a server function. See {@link http://docs.marklogic.com/sem.typedLiteral|sem.typedLiteral}
    * @method planBuilder.sem#typedLiteral
    * @since 2.1.1
    * @param { XsString } [value] - The lexical value.
    * @param { SemIri } [datatype] - The datatype IRI.
    * @returns { XsAnyAtomicType }
    */
typedLiteral(...args) {
    const namer = bldrbase.getNamer(args, 'value');
    const paramdefs = [['value', types.XsString, true, false], ['datatype', types.SemIri, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'sem.typedLiteral', 2, new Set(['value', 'datatype']), paramdefs, args) :
        bldrbase.makePositionalArgs('sem.typedLiteral', 2, false, paramdefs, args);
    return new types.XsAnyAtomicType('sem', 'typed-literal', checkedArgs);

    }
/**
    * Returns a <code>sem:unknown</code> value with the given literal value and datatype IRI. The <code>sem:unknown</code> type extends <code>xs:untypedAtomic</code>, and represents an RDF value with a datatype IRI for which no schema is available. <p>This function is a built-in. Provides a client interface to a server function. See {@link http://docs.marklogic.com/sem.unknown|sem.unknown}
    * @method planBuilder.sem#unknown
    * @since 2.1.1
    * @param { XsString } [string] - The lexical value.
    * @param { SemIri } [datatype] - The datatype IRI.
    * @returns { SemUnknown }
    */
unknown(...args) {
    const namer = bldrbase.getNamer(args, 'string');
    const paramdefs = [['string', types.XsString, true, false], ['datatype', types.SemIri, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'sem.unknown', 2, new Set(['string', 'datatype']), paramdefs, args) :
        bldrbase.makePositionalArgs('sem.unknown', 2, false, paramdefs, args);
    return new types.SemUnknown('sem', 'unknown', checkedArgs);

    }
/**
    * Returns the datatype IRI of a <code>sem:unknown</code> value. <p>This function is a built-in. Provides a client interface to a server function. See {@link http://docs.marklogic.com/sem.unknownDatatype|sem.unknownDatatype}
    * @method planBuilder.sem#unknownDatatype
    * @since 2.1.1
    * @param { SemUnknown } [val] - The sem:unknown value.
    * @returns { SemIri }
    */
unknownDatatype(...args) {
    const paramdef = ['val', types.SemUnknown, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('sem.unknownDatatype', 1, paramdef, args);
    return new types.SemIri('sem', 'unknown-datatype', checkedArgs);
    }
/**
    * Return a UUID URN (RFC4122) as a <code>sem:iri</code> value. This XQuery function backs up the SPARQL UUID() function. <p>This function is a built-in. Provides a client interface to a server function. See {@link http://docs.marklogic.com/sem.uuid|sem.uuid}
    * @method planBuilder.sem#uuid
    * @since 2.1.1

    * @returns { SemIri }
    */
uuid(...args) {
    bldrbase.checkMaxArity('sem.uuid', args.length, 0);
    return new types.SemIri('sem', 'uuid', args);
    }
/**
    * Return a string that is the scheme specific part of random UUID URN (RFC4122). This XQuery function backs up the SPARQL STRUUID() function. <p>This function is a built-in. Provides a client interface to a server function. See {@link http://docs.marklogic.com/sem.uuidString|sem.uuidString}
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
    const paramdef = ['word', types.XsString, true, false];
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
    const paramdefs = [['str1', types.XsString, true, false], ['str2', types.XsString, true, false]];
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
    const paramdef = ['string', types.XsString, true, false];
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
    const paramdef = ['str', types.XsString, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('sql.bitLength', 1, paramdef, args);
    return new types.XsInteger('sql', 'bit-length', checkedArgs);
    }
/**
    * Returns an <code>rdf:collatedString</code> value with the given value and collation tag. The <code>rdf:collatedString</code> type extends <code>xs:string</code> , and represents a collation tagged string in RDF. <p>This function is a built-in. Provides a client interface to a server function. See {@link http://docs.marklogic.com/sql.collatedString|sql.collatedString}
    * @method planBuilder.sql#collatedString
    * @since 2.1.1
    * @param { XsString } [string] - The lexical value.
    * @param { XsString } [collationURI] - The collation URI.
    * @returns { XsString }
    */
collatedString(...args) {
    const namer = bldrbase.getNamer(args, 'string');
    const paramdefs = [['string', types.XsString, true, false], ['collationURI', types.XsString, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'sql.collatedString', 2, new Set(['string', 'collationURI']), paramdefs, args) :
        bldrbase.makePositionalArgs('sql.collatedString', 2, false, paramdefs, args);
    return new types.XsString('sql', 'collated-string', checkedArgs);

    }
/**
    * Returns a specified date with the specified number interval (signed integer) added to a specified datepart of that date  Provides a client interface to a server function. See {@link http://docs.marklogic.com/sql.dateadd|sql.dateadd}
    * @method planBuilder.sql#dateadd
    * @since 2.1.1
    * @param { XsString } [datepart] - Is the part of date where the number will be added. The following table lists all valid datepart arguments. User-defined variable equivalents are not valid. The return data type is the data type of the date argument. <p>Options:</p><p> <code>datepart</code> parameter abbreviation includes:</p> <blockquote><dl> <dt>"year","yyyy","yy"</dt> <dd>The year part of the <code>date</code></dd> <dt>"quarter","qq","q"</dt> <dd>The quarter part of the <code>date</code></dd> <dt>"month","mm","m"</dt> <dd>The month part of the <code>date</code></dd> <dt>"dayofyear","dy","y"</dt> <dd>The day of the year from the <code>date</code></dd> <dt>"day","dd","d"</dt> <dd>The day of the month from the <code>date</code></dd> <dt>"week","wk","ww"</dt> <dd>The week of the year from the <code>date</code></dd> <dt>"weekday","dw"</dt> <dd>The day of the week from the <code>date</code></dd> <dt>"hour","hh"</dt> <dd>The hour of the day from the <code>date</code></dd> <dt>"minute","mi","n"</dt> <dd>The minute of the hour from the <code>date</code></dd> <dt>"second","ss","s"</dt> <dd>The second of the minute from the <code>date</code></dd> <dt>"millisecond","ms"</dt> <dd>The millisecond of the minute from the <code>date</code></dd> <dt>"microsecond","msc"</dt> <dd>The microsecond of the minute from the <code>date</code></dd> <dt>"nanosecond","ns"</dt> <dd>The nanosecond of the minute from the <code>date</code></dd> </dl></blockquote>
    * @param { XsInt } [number] - This number will be added to the datepart of the given date.
    * @param { Item } [date] - Is an expression that can be resolved to a time, date or datetime, value. date can be an expression, column expression, user-defined variable or string literal. startdate is subtracted from enddate.
    * @returns { Item }
    */
dateadd(...args) {
    const namer = bldrbase.getNamer(args, 'datepart');
    const paramdefs = [['datepart', types.XsString, true, false], ['number', types.XsInt, true, false], ['date', types.Item, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'sql.dateadd', 3, new Set(['datepart', 'number', 'date']), paramdefs, args) :
        bldrbase.makePositionalArgs('sql.dateadd', 3, false, paramdefs, args);
    return new types.Item('sql', 'dateadd', checkedArgs);

    }
/**
    * Returns the count (signed integer) of the specified datepart boundaries crossed between the specified startdate and enddate.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/sql.datediff|sql.datediff}
    * @method planBuilder.sql#datediff
    * @since 2.1.1
    * @param { XsString } [datepart] - Is the part of startdate and enddate that specifies the type of boundary crossed. The following table lists all valid datepart arguments. User-defined variable equivalents are not valid. <p>Options:</p><p> <code>datepart</code> parameter abbreviation includes:</p> <blockquote><dl> <dt>"year","yyyy","yy"</dt> <dd>The year part of the <code>date</code></dd> <dt>"quarter","qq","q"</dt> <dd>The quarter part of the <code>date</code></dd> <dt>"month","mm","m"</dt> <dd>The month part of the <code>date</code></dd> <dt>"dayofyear","dy","y"</dt> <dd>The day of the year from the <code>date</code></dd> <dt>"day","dd","d"</dt> <dd>The day of the month from the <code>date</code></dd> <dt>"week","wk","ww"</dt> <dd>The week of the year from the <code>date</code></dd> <dt>"weekday","dw"</dt> <dd>The day of the week from the <code>date</code></dd> <dt>"hour","hh"</dt> <dd>The hour of the day from the <code>date</code></dd> <dt>"minute","mi","n"</dt> <dd>The minute of the hour from the <code>date</code></dd> <dt>"second","ss","s"</dt> <dd>The second of the minute from the <code>date</code></dd> <dt>"millisecond","ms"</dt> <dd>The millisecond of the minute from the <code>date</code></dd> <dt>"microsecond","msc"</dt> <dd>The microsecond of the minute from the <code>date</code></dd> <dt>"nanosecond","ns"</dt> <dd>The nanosecond of the minute from the <code>date</code></dd> </dl></blockquote>
    * @param { Item } [startdate] - Is an expression that can be resolved to a time, date, datetime or value. date can be an expression, column expression, user-defined variable or string literal. <code>startdate</code> is subtracted from <code>enddate</code>.
    * @param { Item } [enddate] - Same as <code>startdate</code>.
    * @returns { XsInteger }
    */
datediff(...args) {
    const namer = bldrbase.getNamer(args, 'datepart');
    const paramdefs = [['datepart', types.XsString, true, false], ['startdate', types.Item, true, false], ['enddate', types.Item, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'sql.datediff', 3, new Set(['datepart', 'startdate', 'enddate']), paramdefs, args) :
        bldrbase.makePositionalArgs('sql.datediff', 3, false, paramdefs, args);
    return new types.XsInteger('sql', 'datediff', checkedArgs);

    }
/**
    * Returns an integer that represents the specified <code>datepart</code> of the specified <code>date</code>. <p> If <code>datepart</code> or <code>date</code> is the empty sequence, the function returns the empty sequence.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/sql.datepart|sql.datepart}
    * @method planBuilder.sql#datepart
    * @since 2.1.1
    * @param { XsString } [datepart] - The part of date that to be returned. <p>Options:</p><p> <code>datepart</code> parameter abbreviation includes:</p> <blockquote><dl> <dt>"year","yyyy","yy"</dt> <dd>The year part of the <code>date</code></dd> <dt>"quarter","qq","q"</dt> <dd>The quarter part of the <code>date</code></dd> <dt>"month","mm","m"</dt> <dd>The month part of the <code>date</code></dd> <dt>"dayofyear","dy","y"</dt> <dd>The day of the year from the <code>date</code></dd> <dt>"day","dd","d"</dt> <dd>The day of the month from the <code>date</code></dd> <dt>"week","wk","ww"</dt> <dd>The week of the year from the <code>date</code></dd> <dt>"weekday","dw"</dt> <dd>The day of the week from the <code>date</code></dd> <dt>"hour","hh"</dt> <dd>The hour of the day from the <code>date</code></dd> <dt>"minute","mi","n"</dt> <dd>The minute of the hour from the <code>date</code></dd> <dt>"second","ss","s"</dt> <dd>The second of the minute from the <code>date</code></dd> <dt>"millisecond","ms"</dt> <dd>The millisecond of the minute from the <code>date</code></dd> <dt>"microsecond","msc"</dt> <dd>The microsecond of the minute from the <code>date</code></dd> <dt>"nanosecond","ns"</dt> <dd>The nanosecond of the minute from the <code>date</code></dd> <dt>"TZoffset","tz"</dt> <dd>The timezone offset from the <code>date</code></dd> </dl></blockquote>
    * @param { Item } [date] - Is an expression that can be resolved to a xs:date, xs:time, xs:dateTime. <code>date</code> can be an expression, column expression,user-defined variable, or string literal.
    * @returns { XsInteger }
    */
datepart(...args) {
    const namer = bldrbase.getNamer(args, 'datepart');
    const paramdefs = [['datepart', types.XsString, true, false], ['date', types.Item, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'sql.datepart', 2, new Set(['datepart', 'date']), paramdefs, args) :
        bldrbase.makePositionalArgs('sql.datepart', 2, false, paramdefs, args);
    return new types.XsInteger('sql', 'datepart', checkedArgs);

    }
/**
    *  Returns an xs:integer between 1 and 31, both inclusive, representing the day component in the localized value of $arg. <p> If $arg is the empty sequence, returns the empty sequence.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/sql.day|sql.day}
    * @method planBuilder.sql#day
    * @since 2.1.1
    * @param { Item } [arg] - The xs:genericDateTimeArg whose day component will be returned.
    * @returns { XsInteger }
    */
day(...args) {
    const paramdef = ['arg', types.Item, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('sql.day', 1, paramdef, args);
    return new types.XsInteger('sql', 'day', checkedArgs);
    }
/**
    * Returns an xs:string representing the dayname value in the localized value of $arg. <p> If $arg is the empty sequence, returns the empty sequence.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/sql.dayname|sql.dayname}
    * @method planBuilder.sql#dayname
    * @since 2.1.1
    * @param { Item } [arg] - The date whose dayname value will be returned.
    * @returns { XsString }
    */
dayname(...args) {
    const paramdef = ['arg', types.Item, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('sql.dayname', 1, paramdef, args);
    return new types.XsString('sql', 'dayname', checkedArgs);
    }
/**
    *  Returns an xs:integer between 0 and 23, both inclusive, representing the value of the hours component in the localized value of $arg. <p> If $arg is the empty sequence, returns the empty sequence.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/sql.hours|sql.hours}
    * @method planBuilder.sql#hours
    * @since 2.1.1
    * @param { Item } [arg] - The genericDateTime whose hours component will be returned.
    * @returns { XsInteger }
    */
hours(...args) {
    const paramdef = ['arg', types.Item, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('sql.hours', 1, paramdef, args);
    return new types.XsInteger('sql', 'hours', checkedArgs);
    }
/**
    * Returns a string that that is the first argument with <var>length</var> characters removed starting at <var>start</var> and the second string has been inserted beginning at <var>start</var>. Provides a client interface to a server function. See {@link http://docs.marklogic.com/sql.insert|sql.insert}
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
    const paramdefs = [['str', types.XsString, true, false], ['start', types.XsNumeric, true, false], ['length', types.XsNumeric, true, false], ['str2', types.XsString, true, false]];
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
    const paramdefs = [['str', types.XsString, true, false], ['n', types.XsString, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'sql.instr', 2, new Set(['str', 'n']), paramdefs, args) :
        bldrbase.makePositionalArgs('sql.instr', 2, false, paramdefs, args);
    return new types.XsUnsignedInt('sql', 'instr', checkedArgs);

    }
/**
    * Returns a string that is the leftmost characters of the target string. The number of characters to return is specified by the second argument. Provides a client interface to a server function. See {@link http://docs.marklogic.com/sql.left|sql.left}
    * @method planBuilder.sql#left
    * @since 2.1.1
    * @param { Item } [str] - The base string. If the value is not a string, its string value will be used.
    * @param { XsNumeric } [n] - The number of leftmost characters of the string to return.
    * @returns { XsString }
    */
left(...args) {
    const namer = bldrbase.getNamer(args, 'str');
    const paramdefs = [['str', types.Item, false, true], ['n', types.XsNumeric, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'sql.left', 2, new Set(['str', 'n']), paramdefs, args) :
        bldrbase.makePositionalArgs('sql.left', 2, false, paramdefs, args);
    return new types.XsString('sql', 'left', checkedArgs);

    }
/**
    * Return a string that removes leading empty spaces in the input string. Provides a client interface to a server function. See {@link http://docs.marklogic.com/sql.ltrim|sql.ltrim}
    * @method planBuilder.sql#ltrim
    * @since 2.1.1
    * @param { XsString } [str] - The string to be evaluated.
    * @returns { XsString }
    */
ltrim(...args) {
    const paramdef = ['str', types.XsString, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('sql.ltrim', 1, paramdef, args);
    return new types.XsString('sql', 'ltrim', checkedArgs);
    }
/**
    *  Returns an xs:integer value between 0 to 59, both inclusive, representing the value of the minutes component in the localized value of $arg. <p> If $arg is the empty sequence, returns the empty sequence.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/sql.minutes|sql.minutes}
    * @method planBuilder.sql#minutes
    * @since 2.1.1
    * @param { Item } [arg] - The genericDateTime whose minutes component will be returned.
    * @returns { XsInteger }
    */
minutes(...args) {
    const paramdef = ['arg', types.Item, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('sql.minutes', 1, paramdef, args);
    return new types.XsInteger('sql', 'minutes', checkedArgs);
    }
/**
    *  Returns an xs:integer between 1 and 12, both inclusive, representing the month component in the localized value of $arg. <p> If $arg is the empty sequence, returns the empty sequence.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/sql.month|sql.month}
    * @method planBuilder.sql#month
    * @since 2.1.1
    * @param { Item } [arg] - The genericDateTime whose month component will be returned.
    * @returns { XsInteger }
    */
month(...args) {
    const paramdef = ['arg', types.Item, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('sql.month', 1, paramdef, args);
    return new types.XsInteger('sql', 'month', checkedArgs);
    }
/**
    *  Returns month name, calculated from the localized value of $arg. <p> If $arg is the empty sequence, returns the empty sequence.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/sql.monthname|sql.monthname}
    * @method planBuilder.sql#monthname
    * @since 2.1.1
    * @param { Item } [arg] - The date whose month-name will be returned.
    * @returns { XsString }
    */
monthname(...args) {
    const paramdef = ['arg', types.Item, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('sql.monthname', 1, paramdef, args);
    return new types.XsString('sql', 'monthname', checkedArgs);
    }
/**
    * Returns the length of the string "str" in bits. Provides a client interface to a server function. See {@link http://docs.marklogic.com/sql.octetLength|sql.octetLength}
    * @method planBuilder.sql#octetLength
    * @since 2.1.1
    * @param { XsString } [x] - The string to be evaluated.
    * @returns { XsInteger }
    */
octetLength(...args) {
    const paramdef = ['x', types.XsString, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('sql.octetLength', 1, paramdef, args);
    return new types.XsInteger('sql', 'octet-length', checkedArgs);
    }
/**
    *  Returns an xs:integer between 1 and 4, both inclusive, calculating the quarter component in the localized value of $arg. <p> If $arg is the empty sequence, returns the empty sequence.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/sql.quarter|sql.quarter}
    * @method planBuilder.sql#quarter
    * @since 2.1.1
    * @param { Item } [arg] - The genericDateTime whose quarter component will be returned.
    * @returns { XsInteger }
    */
quarter(...args) {
    const paramdef = ['arg', types.Item, false, false];
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
    const paramdef = ['n', types.XsUnsignedLong, true, false];
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
    const paramdefs = [['str', types.Item, false, true], ['n', types.XsNumeric, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'sql.repeat', 2, new Set(['str', 'n']), paramdefs, args) :
        bldrbase.makePositionalArgs('sql.repeat', 2, false, paramdefs, args);
    return new types.XsString('sql', 'repeat', checkedArgs);

    }
/**
    * Returns a string that is the rightmost characters of the target string. The number of characters to return is specified by the second argument. Provides a client interface to a server function. See {@link http://docs.marklogic.com/sql.right|sql.right}
    * @method planBuilder.sql#right
    * @since 2.1.1
    * @param { Item } [str] - The base string. If the value is not a string, its string value will be used.
    * @param { XsNumeric } [n] - The number of rightmost characters of the string to return.
    * @returns { XsString }
    */
right(...args) {
    const namer = bldrbase.getNamer(args, 'str');
    const paramdefs = [['str', types.Item, false, true], ['n', types.XsNumeric, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'sql.right', 2, new Set(['str', 'n']), paramdefs, args) :
        bldrbase.makePositionalArgs('sql.right', 2, false, paramdefs, args);
    return new types.XsString('sql', 'right', checkedArgs);

    }
/**
    * Return a string that removes trailing empty spaces in the input string. Provides a client interface to a server function. See {@link http://docs.marklogic.com/sql.rtrim|sql.rtrim}
    * @method planBuilder.sql#rtrim
    * @since 2.1.1
    * @param { XsString } [str] - The string to be evaluated.
    * @returns { XsString }
    */
rtrim(...args) {
    const paramdef = ['str', types.XsString, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('sql.rtrim', 1, paramdef, args);
    return new types.XsString('sql', 'rtrim', checkedArgs);
    }
/**
    *  Returns an xs:decimal value between 0 and 60.999..., both inclusive, representing the seconds and fractional seconds in the localized value of $arg. Note that the value can be greater than 60 seconds to accommodate occasional leap seconds used to keep human time synchronized with the rotation of the planet. <p> If $arg is the empty sequence, returns the empty sequence.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/sql.seconds|sql.seconds}
    * @method planBuilder.sql#seconds
    * @since 2.1.1
    * @param { Item } [arg] - The time whose seconds component will be returned.
    * @returns { XsDecimal }
    */
seconds(...args) {
    const paramdef = ['arg', types.Item, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('sql.seconds', 1, paramdef, args);
    return new types.XsDecimal('sql', 'seconds', checkedArgs);
    }
/**
    * Returns the sign of number x. Provides a client interface to a server function. See {@link http://docs.marklogic.com/sql.sign|sql.sign}
    * @method planBuilder.sql#sign
    * @since 2.1.1
    * @param { XsNumeric } [x] - The number to be evaluated.
    * @returns { Item }
    */
sign(...args) {
    const paramdef = ['x', types.XsNumeric, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('sql.sign', 1, paramdef, args);
    return new types.Item('sql', 'sign', checkedArgs);
    }
/**
    * Returns a string that is the given number of spaces. Provides a client interface to a server function. See {@link http://docs.marklogic.com/sql.space|sql.space}
    * @method planBuilder.sql#space
    * @since 2.1.1
    * @param { XsNumeric } [n] - The number of spaces to return as a string.
    * @returns { XsString }
    */
space(...args) {
    const paramdef = ['n', types.XsNumeric, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('sql.space', 1, paramdef, args);
    return new types.XsString('sql', 'space', checkedArgs);
    }
/**
    * Returns a xs:string? timestamp created by adding a number to the given dateTimeType field of a given timestamp. Provides a client interface to a server function. See {@link http://docs.marklogic.com/sql.timestampadd|sql.timestampadd}
    * @method planBuilder.sql#timestampadd
    * @since 2.1.1
    * @param { XsString } [dateTimeType] - The dateTimeType of the timestamp where addition should take place. Available types are: <dl> <dt><p>SQL_TSI_FRAC_SECOND</p></dt> <dd>nano seconds</dd> <dt><p>SQL_TSI_SECOND</p></dt> <dd>seconds</dd> <dt><p>SQL_TSI_MINUTE</p></dt> <dd>minute</dd> <dt><p>SQL_TSI_HOUR</p></dt> <dd>hour</dd> <dt><p>SQL_TSI_DAY</p></dt> <dd>day</dd> <dt><p>SQL_TSI_WEEK</p></dt> <dd>week</dd> <dt><p>SQL_TSI_MONTH</p></dt> <dd>month</dd> <dt><p>SQL_TSI_QUARTER</p></dt> <dd>quarter</dd> <dt><p>SQL_TSI_YEAR</p></dt> <dd>year</dd> </dl>
    * @param { XsInt } [value] - The integer to add to the given dateTimeType field of the third parameter.
    * @param { Item } [timestamp] - The xs:dateTime timestamp to which addition has to take place.
    * @returns { Item }
    */
timestampadd(...args) {
    const namer = bldrbase.getNamer(args, 'dateTimeType');
    const paramdefs = [['dateTimeType', types.XsString, true, false], ['value', types.XsInt, true, false], ['timestamp', types.Item, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'sql.timestampadd', 3, new Set(['dateTimeType', 'value', 'timestamp']), paramdefs, args) :
        bldrbase.makePositionalArgs('sql.timestampadd', 3, false, paramdefs, args);
    return new types.Item('sql', 'timestampadd', checkedArgs);

    }
/**
    * Returns the difference in dateTimeType field of two given timestamps. Provides a client interface to a server function. See {@link http://docs.marklogic.com/sql.timestampdiff|sql.timestampdiff}
    * @method planBuilder.sql#timestampdiff
    * @since 2.1.1
    * @param { XsString } [dateTimeType] - The dateTimeType of the timestamp where addition should take place. Available types are: <dl> <dt><p>SQL_TSI_FRAC_SECOND</p></dt> <dd>nano seconds</dd> <dt><p>SQL_TSI_SECOND</p></dt> <dd>seconds</dd> <dt><p>SQL_TSI_MINUTE</p></dt> <dd>minute</dd> <dt><p>SQL_TSI_HOUR</p></dt> <dd>hour</dd> <dt><p>SQL_TSI_DAY</p></dt> <dd>day</dd> <dt><p>SQL_TSI_WEEK</p></dt> <dd>week</dd> <dt><p>SQL_TSI_MONTH</p></dt> <dd>month</dd> <dt><p>SQL_TSI_QUARTER</p></dt> <dd>quarter</dd> <dt><p>SQL_TSI_YEAR</p></dt> <dd>year</dd> </dl>
    * @param { Item } [timestamp1] - The integer to add to the given dateTimeType field of the third parameter.
    * @param { Item } [timestamp2] - The xs:dateTime timestamp to which addition has to take place.
    * @returns { XsInteger }
    */
timestampdiff(...args) {
    const namer = bldrbase.getNamer(args, 'dateTimeType');
    const paramdefs = [['dateTimeType', types.XsString, true, false], ['timestamp1', types.Item, true, false], ['timestamp2', types.Item, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'sql.timestampdiff', 3, new Set(['dateTimeType', 'timestamp1', 'timestamp2']), paramdefs, args) :
        bldrbase.makePositionalArgs('sql.timestampdiff', 3, false, paramdefs, args);
    return new types.XsInteger('sql', 'timestampdiff', checkedArgs);

    }
/**
    * Return a string that removes leading empty spaces in the input string. Provides a client interface to a server function. See {@link http://docs.marklogic.com/sql.trim|sql.trim}
    * @method planBuilder.sql#trim
    * @since 2.1.1
    * @param { XsString } [str] - The string to be evaluated.
    * @returns { XsString }
    */
trim(...args) {
    const paramdef = ['str', types.XsString, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('sql.trim', 1, paramdef, args);
    return new types.XsString('sql', 'trim', checkedArgs);
    }
/**
    *  Returns an xs:integer between 1 and 53, both inclusive, representing the week value in the localized value of $arg. <p> If $arg is the empty sequence, returns the empty sequence.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/sql.week|sql.week}
    * @method planBuilder.sql#week
    * @since 2.1.1
    * @param { Item } [arg] - The dateTime/date/string whose day component will be returned.
    * @returns { XsInteger }
    */
week(...args) {
    const paramdef = ['arg', types.Item, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('sql.week', 1, paramdef, args);
    return new types.XsInteger('sql', 'week', checkedArgs);
    }
/**
    *  Provides a client interface to a server function. See {@link http://docs.marklogic.com/sql.weekday|sql.weekday}
    * @method planBuilder.sql#weekday
    * @since 2.1.1
    * @param { Item } [arg1] - 
    * @returns { XsInteger }
    */
weekday(...args) {
    const paramdef = ['arg1', types.Item, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('sql.weekday', 1, paramdef, args);
    return new types.XsInteger('sql', 'weekday', checkedArgs);
    }
/**
    *  Returns an xs:integer representing the year component in the localized value of $arg. The result may be negative. <p> If $arg is the empty sequence, returns the empty sequence.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/sql.year|sql.year}
    * @method planBuilder.sql#year
    * @since 2.1.1
    * @param { Item } [arg] - The dateTime/date/string whose day component will be returned.
    * @returns { XsInteger }
    */
year(...args) {
    const paramdef = ['arg', types.Item, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('sql.year', 1, paramdef, args);
    return new types.XsInteger('sql', 'year', checkedArgs);
    }
/**
    * Returns an xs:integer between 1 and 366, both inclusive, representing the yearday value in the localized value of $arg. <p> If $arg is the empty sequence, returns the empty sequence.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/sql.yearday|sql.yearday}
    * @method planBuilder.sql#yearday
    * @since 2.1.1
    * @param { Item } [arg] - The xs:genericDateTimeArg whose days of the year will be returned.
    * @returns { XsInteger }
    */
yearday(...args) {
    const paramdef = ['arg', types.Item, false, false];
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
    const paramdefs = [['x', types.XsUnsignedLong, true, false], ['y', types.XsUnsignedLong, true, false]];
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
    const paramdefs = [['x', types.XsUnsignedLong, true, false], ['y', types.XsUnsignedLong, true, false]];
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
    const paramdef = ['encoded', types.XsString, true, false];
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
    const paramdef = ['plaintext', types.XsString, true, false];
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
    const paramdefs = [['namespace-uri', types.XsString, true, false], ['local-name', types.XsString, true, false], ['item', types.Item, false, false]];
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
    const paramdefs = [['password', types.XsString, true, false], ['salt', types.XsString, true, false]];
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
    const paramdef = ['password', types.XsString, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('xdmp.crypt2', 1, paramdef, args);
    return new types.XsString('xdmp', 'crypt2', checkedArgs);
    }
/**
    * Returns an xs:string representing the dayname value in the localized value of $arg. <p> If $arg is the empty sequence, returns the empty sequence.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/xdmp.daynameFromDate|xdmp.daynameFromDate}
    * @method planBuilder.xdmp#daynameFromDate
    * @since 2.1.1
    * @param { XsDate } [arg] - The date whose dayname value will be returned.
    * @returns { XsString }
    */
daynameFromDate(...args) {
    const paramdef = ['arg', types.XsDate, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xdmp.daynameFromDate', 1, paramdef, args);
    return new types.XsString('xdmp', 'dayname-from-date', checkedArgs);
    }
/**
    * Invertible function that decodes characters an NCName produced by <a><code>xdmp:encode-for-NCName</code></a>. Given the NCName produced by <code>xdmp:encode-for-NCName</code> this function returns the original string. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xdmp.decodeFromNCName|xdmp.decodeFromNCName}
    * @method planBuilder.xdmp#decodeFromNCName
    * @since 2.1.1
    * @param { XsString } [name] - A string representing an NCName. This string must have been the result of a previous call to <code>xdmp:decode-from-NCName</code> or undefined results will occur.
    * @returns { XsString }
    */
decodeFromNCName(...args) {
    const paramdef = ['name', types.XsString, true, false];
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
    const paramdefs = [['item', types.Item, false, true], ['max-sequence-length', types.XsUnsignedInt, false, false], ['max-item-length', types.XsUnsignedInt, false, false]];
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
    const paramdef = ['string', types.XsString, true, false];
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
    const paramdef = ['element', types.ElementNode, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('xdmp.elementContentType', 1, paramdef, args);
    return new types.XsString('xdmp', 'element-content-type', checkedArgs);
    }
/**
    * Invertible function that escapes characters required to be part of an NCName. This is useful when translating names from other representations such as JSON to XML. Given any string, the result is always a valid NCName. Providing all names are passed through this function the result is distinct NCNames so the results can be used for searching as well as name generation. The inverse function is <a><code>xdmp:decode-for-NCName</code></a>. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xdmp.encodeForNCName|xdmp.encodeForNCName}
    * @method planBuilder.xdmp#encodeForNCName
    * @since 2.1.1
    * @param { XsString } [name] - A string which is used as an NCName (such as the localname for an element or attribute).
    * @returns { XsString }
    */
encodeForNCName(...args) {
    const paramdef = ['name', types.XsString, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('xdmp.encodeForNCName', 1, paramdef, args);
    return new types.XsString('xdmp', 'encode-for-NCName', checkedArgs);
    }
/**
    * Returns a formatted number value based on the picture argument. The difference between this function and the W3C standards <code>fn:format-number</code> function is that this function imitates the XSLT <code>xsl:number</code> instruction, which has richer formatting options than the <code>fn:format-number</code> function. This function can be used for spelled-out and ordinal numbering in many languages. This function is available in XSLT as well as in all dialects of XQuery and Server-Side JavaScript. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xdmp.formatNumber|xdmp.formatNumber}
    * @method planBuilder.xdmp#formatNumber
    * @since 2.1.1
    * @param { XsNumeric } [value] - The given numeric <code>$value</code> that needs to be formatted.
    * @param { XsString } [picture] - The desired string representation of the given numeric <code>$value</code>. The picture string is a sequence of characters, in which the characters represent variables such as, decimal-separator-sign, grouping-sign, zero-digit-sign, digit-sign, pattern-separator, percent sign and per-mille-sign. For details on the picture string, see <a>http://www.w3.org/TR/xslt20/#date-picture-string</a>. Unlike fn:format-number(), here the picture string allows spelled-out (uppercase, lowercase and Capitalcase) formatting.
    * @param { XsString } [language] - The desired language for string representation of the numeric <code>$value</code>. An empty sequence must be passed in even if a user doesn't want to specifiy this argument.
    * @param { XsString } [letterValue] - Same as letter-value attribute in xsl:number. This argument is ignored during formatting as of now. It may be used in future. An empty sequence must be passed in even if a user doesn't want to specifiy this argument.
    * @param { XsString } [ordchar] - If $ordchar is "yes" then ordinal numbering is attempted. If this is any other string, including an empty string, then then cardinal numbering is generated. An empty sequence must be passed in even if a user doesn't want to specifiy this argument.
    * @param { XsString } [zeroPadding] - Value of $zero-padding is used to pad integer part of a number on the left and fractional part on the right, if needed. An empty sequence must be passed in even if a user doesn't want to specifiy this argument.
    * @param { XsString } [groupingSeparator] - Value of $grouping-separator is a character, used to groups of digits, especially useful in making long sequence of digits more readable. For example, 10,000,000- here "," is used as a separator after each group of three digits. An empty sequence must be passed in even if a user doesn't want to specify this argument.
    * @param { XsInteger } [groupingSize] - Represents size of the group, i.e. the number of digits before after which grouping separator is inserted. An empty sequence must be passed in even if a user doesn't want to specifiy this argument.
    * @returns { XsString }
    */
formatNumber(...args) {
    const namer = bldrbase.getNamer(args, 'value');
    const paramdefs = [['value', types.XsNumeric, false, true], ['picture', types.XsString, false, false], ['language', types.XsString, false, false], ['letter-value', types.XsString, false, false], ['ordchar', types.XsString, false, false], ['zero-padding', types.XsString, false, false], ['grouping-separator', types.XsString, false, false], ['grouping-size', types.XsInteger, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'xdmp.formatNumber', 1, new Set(['value', 'picture', 'language', 'letter-value', 'ordchar', 'zero-padding', 'grouping-separator', 'grouping-size']), paramdefs, args) :
        bldrbase.makePositionalArgs('xdmp.formatNumber', 1, false, paramdefs, args);
    return new types.XsString('xdmp', 'format-number', checkedArgs);

    }
/**
    * Atomizes a JSON node, returning a JSON value. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xdmp.fromJson|xdmp.fromJson}
    * @method planBuilder.xdmp#fromJson
    * @since 2.1.1
    * @param { Node } [arg] - A node of kind <code>object-node()</code>, <code>array-node()</code>, <code>text()</code>, <code>number-node()</code>, <code>boolean-node()</code>, <code>null-node()</code>, or <code>document-node()</code>.
    * @returns { Item }
    */
fromJson(...args) {
    const paramdef = ['arg', types.Node, true, false];
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
    const paramdef = ['string', types.XsString, true, false];
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
    const paramdef = ['string', types.XsString, true, false];
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
    const paramdef = ['hex', types.XsString, true, false];
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
    const paramdefs = [['secretkey', types.Item, true, false], ['message', types.Item, true, false], ['encoding', types.XsString, true, false]];
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
    const paramdefs = [['secretkey', types.Item, true, false], ['message', types.Item, true, false], ['encoding', types.XsString, true, false]];
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
    const paramdefs = [['secretkey', types.Item, true, false], ['message', types.Item, true, false], ['encoding', types.XsString, true, false]];
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
    const paramdefs = [['secretkey', types.Item, true, false], ['message', types.Item, true, false], ['encoding', types.XsString, true, false]];
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
    const paramdef = ['string', types.XsString, false, false];
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
    const paramdef = ['val', types.XsInteger, true, false];
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
    const paramdef = ['val', types.XsInteger, true, false];
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
    const paramdef = ['name', types.XsQName, true, false];
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
    const paramdefs = [['x', types.XsUnsignedLong, true, false], ['y', types.XsLong, true, false]];
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
    const paramdefs = [['data', types.Item, true, false], ['encoding', types.XsString, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'xdmp.md5', 1, new Set(['data', 'encoding']), paramdefs, args) :
        bldrbase.makePositionalArgs('xdmp.md5', 1, false, paramdefs, args);
    return new types.XsString('xdmp', 'md5', checkedArgs);

    }
/**
    * Returns month name, calculated from the localized value of $arg. <p> If $arg is the empty sequence, returns the empty sequence.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/xdmp.monthNameFromDate|xdmp.monthNameFromDate}
    * @method planBuilder.xdmp#monthNameFromDate
    * @since 2.1.1
    * @param { XsDate } [arg] - The date whose month-name will be returned.
    * @returns { XsString }
    */
monthNameFromDate(...args) {
    const paramdef = ['arg', types.XsDate, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xdmp.monthNameFromDate', 1, paramdef, args);
    return new types.XsString('xdmp', 'month-name-from-date', checkedArgs);
    }
/**
    * Muliply two 64-bit integer values, discarding overflow. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xdmp.mul64|xdmp.mul64}
    * @method planBuilder.xdmp#mul64
    * @since 2.1.1
    * @param { XsUnsignedLong } [x] - The first value.
    * @param { XsUnsignedLong } [y] - The second value.
    * @returns { XsUnsignedLong }
    */
mul64(...args) {
    const namer = bldrbase.getNamer(args, 'x');
    const paramdefs = [['x', types.XsUnsignedLong, true, false], ['y', types.XsUnsignedLong, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'xdmp.mul64', 2, new Set(['x', 'y']), paramdefs, args) :
        bldrbase.makePositionalArgs('xdmp.mul64', 2, false, paramdefs, args);
    return new types.XsUnsignedLong('xdmp', 'mul64', checkedArgs);

    }
/**
    * Returns any collections for the node's document in the database. If the specified node does not come from a document in a database, then <code>xdmp:node-collections</code> returns an empty sequence. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xdmp.nodeCollections|xdmp.nodeCollections}
    * @method planBuilder.xdmp#nodeCollections
    * @since 2.1.1
    * @param { Node } [node] - The node whose collections are to be returned.
    * @returns { XsString }
    */
nodeCollections(...args) {
    const paramdef = ['node', types.Node, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('xdmp.nodeCollections', 1, paramdef, args);
    return new types.XsString('xdmp', 'node-collections', checkedArgs);
    }
/**
    *  Returns an <code>xs:string</code> representing the node's kind: either "document", "element", "attribute", "text", "namespace", "processing-instruction", "binary", or "comment".  <p> The <code>fn:node-kind</code> builtin was dropped from the final XQuery 1.0 spec. This is the equivalent function in the <code>xdmp:</code> namespace carried over for MarkLogic 1.0 dialects.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/xdmp.nodeKind|xdmp.nodeKind}
    * @method planBuilder.xdmp#nodeKind
    * @since 2.1.1
    * @param { Node } [node] - The node whose kind is to be returned.
    * @returns { XsString }
    */
nodeKind(...args) {
    const paramdef = ['node', types.Node, true, false];
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
    const paramdef = ['node', types.Node, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('xdmp.nodeMetadata', 1, paramdef, args);
    return new types.MapMap('xdmp', 'node-metadata', checkedArgs);
    }
/**
    * Returns the metadata value of a node for a particular key. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xdmp.nodeMetadataValue|xdmp.nodeMetadataValue}
    * @method planBuilder.xdmp#nodeMetadataValue
    * @since 2.1.1
    * @param { Node } [uri] - The node whose metadata are to be returned.
    * @param { XsString } [keyName] - Name of the key for the metadata.
    * @returns { XsString }
    */
nodeMetadataValue(...args) {
    const namer = bldrbase.getNamer(args, 'uri');
    const paramdefs = [['uri', types.Node, true, false], ['keyName', types.XsString, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'xdmp.nodeMetadataValue', 2, new Set(['uri', 'keyName']), paramdefs, args) :
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
    const paramdefs = [['node', types.Node, true, false], ['output-kind', types.XsString, true, false]];
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
    const paramdef = ['node', types.Node, true, false];
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
    const paramdef = ['x', types.XsUnsignedLong, true, false];
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
    const paramdef = ['octal', types.XsString, true, false];
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
    const paramdefs = [['x', types.XsUnsignedLong, true, false], ['y', types.XsUnsignedLong, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'xdmp.or64', 2, new Set(['x', 'y']), paramdefs, args) :
        bldrbase.makePositionalArgs('xdmp.or64', 2, false, paramdefs, args);
    return new types.XsUnsignedLong('xdmp', 'or64', checkedArgs);

    }
/**
    * Parses a string containing date, time or dateTime using the supplied picture argument and returns a dateTime value. While this function is closely related to other XSLT functions, it is available in XSLT as well as in all XQuery dialects and in Server-Side JavaScript. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xdmp.parseDateTime|xdmp.parseDateTime}
    * @method planBuilder.xdmp#parseDateTime
    * @since 2.1.1
    * @param { XsString } [picture] - The desired string representation of the given <code>$value</code>. The picture string is a sequence of characters, in which the characters represent variables such as, decimal-separator-sign, grouping-sign, zero-digit-sign, digit-sign, pattern-separator, percent sign and per-mille-sign. For details on the picture string, see <a>http://www.w3.org/TR/xslt20/#date-picture-string</a>. This follows the specification of <a>picture string</a> in the W3C XSLT 2.0 specification for the <code>fn:format-dateTime</code> function. <pre> Symbol Description ----------------------------------- 'Y' year(absolute value) 'M' month in year 'D' day in month 'd' day in year 'F' day of week 'W' week in year 'w' week in month 'H' hour in day 'h' hour in half-day 'P' am/pm marker 'm' minute in hour 's' second in minute 'f' fractional seconds 'Z' timezone as a time offset from UTC for example PST 'z' timezone as an offset using GMT, for example GMT+1 </pre>
    * @param { XsString } [value] - The given string <code>$value</code> representing the dateTime value that needs to be formatted.
    * @param { XsString } [language] - The language used in string representation of the date, time or dateTime value.
    * @param { XsString } [calendar] - This argument is reserved for future use. The only calendar supported at this point is "Gregorian" or "AD".
    * @param { XsString } [country] - $country is used to take into account if there any country specific interpretation of the string while converting it into dateTime value.
    * @returns { XsDateTime }
    */
parseDateTime(...args) {
    const namer = bldrbase.getNamer(args, 'picture');
    const paramdefs = [['picture', types.XsString, true, false], ['value', types.XsString, true, false], ['language', types.XsString, false, false], ['calendar', types.XsString, false, false], ['country', types.XsString, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'xdmp.parseDateTime', 2, new Set(['picture', 'value', 'language', 'calendar', 'country']), paramdefs, args) :
        bldrbase.makePositionalArgs('xdmp.parseDateTime', 2, false, paramdefs, args);
    return new types.XsDateTime('xdmp', 'parse-dateTime', checkedArgs);

    }
/**
    * Parses a string containing date, time or dateTime using the supplied picture argument and returns a dateTime value. While this function is closely related to other XSLT functions, it is available in XSLT as well as in all XQuery dialects and in Server-Side JavaScript. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xdmp.parseYymmdd|xdmp.parseYymmdd}
    * @method planBuilder.xdmp#parseYymmdd
    * @since 2.1.1
    * @param { XsString } [picture] - The desired string representation of the given <code>$value</code>. This follows the specification of picture string which is compatible to the format specification in icu. See <a>http://icu-project.org/apiref/icu4j/com/ibm/icu/text/SimpleDateFormat.html</a> for more details. <p>The following is the summary of the formatting symbols: <pre> Symbol Description ---------------------------- "y" year(absolute value) "M" month in year "d" day in month "D" day in year "E" day of week "w" week in year "W" week in month "H" hour in day "K" hour in half-day "a" am/pm marker "s" second in minute "S" fractional seconds "Z" timezone as a time offset from UTC for example PST "ZZZZ" timezone as an offset using GMT, for example GMT+1 </pre> </p>
    * @param { XsString } [value] - The given string <code>$value</code> that needs to be formatted.
    * @param { XsString } [language] - The language used in string representation of the date, time or dateTime value.
    * @param { XsString } [calendar] - This argument is reserved for future use. The only calendar supported at this point is "Gregorian" or "AD".
    * @param { XsString } [country] - $country is used to take into account if there any country specific interpretation of the string while converting it into dateTime value.
    * @returns { XsDateTime }
    */
parseYymmdd(...args) {
    const namer = bldrbase.getNamer(args, 'picture');
    const paramdefs = [['picture', types.XsString, true, false], ['value', types.XsString, true, false], ['language', types.XsString, false, false], ['calendar', types.XsString, false, false], ['country', types.XsString, false, false]];
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
    * @param { XsBoolean } [includeDocument] - If true, then the path is presented with a leading <code>doc(..)/..</code>, otherwise the path is presented as <code>/..</code>.
    * @returns { XsString }
    */
path(...args) {
    const namer = bldrbase.getNamer(args, 'node');
    const paramdefs = [['node', types.Node, true, false], ['include-document', types.XsBoolean, false, false]];
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
    * @param { XsString } [collation] - The optional name of a valid collation URI. For information on the collation URI syntax, see the <em>Search Developer's Guide</em>.
    * @returns { XsInteger }
    */
position(...args) {
    const namer = bldrbase.getNamer(args, 'test');
    const paramdefs = [['test', types.XsString, false, false], ['target', types.XsString, false, false], ['collation', types.XsString, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'xdmp.position', 2, new Set(['test', 'target', 'collation']), paramdefs, args) :
        bldrbase.makePositionalArgs('xdmp.position', 2, false, paramdefs, args);
    return new types.XsInteger('xdmp', 'position', checkedArgs);

    }
/**
    * Construct a QName from a string of the form "{namespaceURI}localname". This function is useful for constructing Clark notation parameters for the <a>xdmp:xslt-eval</a> and <a>xdmp:xslt-invoke</a> functions. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xdmp.QNameFromKey|xdmp.QNameFromKey}
    * @method planBuilder.xdmp#QNameFromKey
    * @since 2.1.1
    * @param { XsString } [key] - The string from which to construct a QName.
    * @returns { XsQName }
    */
QNameFromKey(...args) {
    const paramdef = ['key', types.XsString, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('xdmp.QNameFromKey', 1, paramdef, args);
    return new types.XsQName('xdmp', 'QName-from-key', checkedArgs);
    }
/**
    * Returns an xs:integer between 1 and 4, both inclusive, calculating the quarter component in the localized value of $arg. <p> If $arg is the empty sequence, returns the empty sequence.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/xdmp.quarterFromDate|xdmp.quarterFromDate}
    * @method planBuilder.xdmp#quarterFromDate
    * @since 2.1.1
    * @param { XsDate } [arg] - The date whose quarter component will be returned.
    * @returns { XsInteger }
    */
quarterFromDate(...args) {
    const paramdef = ['arg', types.XsDate, false, false];
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
    const paramdef = ['max', types.XsUnsignedLong, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('xdmp.random', 0, paramdef, args);
    return new types.XsUnsignedLong('xdmp', 'random', checkedArgs);
    }
/**
    * Resolves a relative URI against an absolute URI. If $base is specified, the URI is resolved relative to that base. If $base is not specified, the base is set to the base-uri property from the static context, if the property exists; if it does not exist, an error is thrown. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xdmp.resolveUri|xdmp.resolveUri}
    * @method planBuilder.xdmp#resolveUri
    * @since 2.1.1
    * @param { XsString } [relative] - A URI reference to resolve against the base.
    * @param { XsString } [base] - An absolute URI to use as the base of the resolution.
    * @returns { XsAnyURI }
    */
resolveUri(...args) {
    const namer = bldrbase.getNamer(args, 'relative');
    const paramdefs = [['relative', types.XsString, false, false], ['base', types.XsString, true, false]];
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
    const paramdefs = [['x', types.XsUnsignedLong, true, false], ['y', types.XsLong, true, false]];
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
    const paramdefs = [['data', types.Item, true, false], ['encoding', types.XsString, true, false]];
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
    const paramdefs = [['data', types.Item, true, false], ['encoding', types.XsString, true, false]];
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
    const paramdefs = [['data', types.Item, true, false], ['encoding', types.XsString, true, false]];
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
    const paramdefs = [['data', types.Item, true, false], ['encoding', types.XsString, true, false]];
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
    const paramdefs = [['initial', types.XsUnsignedLong, true, false], ['step', types.XsUnsignedLong, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'xdmp.step64', 2, new Set(['initial', 'step']), paramdefs, args) :
        bldrbase.makePositionalArgs('xdmp.step64', 2, false, paramdefs, args);
    return new types.XsUnsignedLong('xdmp', 'step64', checkedArgs);

    }
/**
    * Formats a dateTime value using POSIX strftime. This function uses the POSIX strftime system call in the way it is implemented on each platform. For other XQuery functions that have more functionality (for example, for things like timezones), use one or more if the various XQuery or XSLT standard functions such as <a><code>fn:format-dateTime</code></a>. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xdmp.strftime|xdmp.strftime}
    * @method planBuilder.xdmp#strftime
    * @since 2.1.1
    * @param { XsString } [format] - The strftime format string.
    * @param { XsDateTime } [value] - The dateTime value.
    * @returns { XsString }
    */
strftime(...args) {
    const namer = bldrbase.getNamer(args, 'format');
    const paramdefs = [['format', types.XsString, true, false], ['value', types.XsDateTime, true, false]];
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
    const paramdef = ['timestamp', types.XsUnsignedLong, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('xdmp.timestampToWallclock', 1, paramdef, args);
    return new types.XsDateTime('xdmp', 'timestamp-to-wallclock', checkedArgs);
    }
/**
    * Constructs a JSON document. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xdmp.toJson|xdmp.toJson}
    * @method planBuilder.xdmp#toJson
    * @since 2.1.1
    * @param { Item } [item] - A sequence of items from which the JSON document is to be constructed. <span>The item sequence from which the JSON document is constructed.</span>
    * @returns { Node }
    */
toJson(...args) {
    const paramdef = ['item', types.Item, false, true];
    const checkedArgs = bldrbase.makeSingleArgs('xdmp.toJson', 1, paramdef, args);
    return new types.Node('xdmp', 'to-json', checkedArgs);
    }
/**
    * Returns the name of the simple type of the atomic value argument as an <code>xs:QName</code>. <p>This function is a built-in. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xdmp.type|xdmp.type}
    * @method planBuilder.xdmp#type
    * @since 2.1.1
    * @param { XsAnyAtomicType } [value] - The value to return the type of.
    * @returns { XsQName }
    */
type(...args) {
    const paramdef = ['value', types.XsAnyAtomicType, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('xdmp.type', 1, paramdef, args);
    return new types.XsQName('xdmp', 'type', checkedArgs);
    }
/**
    * Converts URL-encoded string to plaintext. This decodes the string created with <a>xdmp:url-encode</a>. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xdmp.urlDecode|xdmp.urlDecode}
    * @method planBuilder.xdmp#urlDecode
    * @since 2.1.1
    * @param { XsString } [encoded] - Encoded text to be decoded.
    * @returns { XsString }
    */
urlDecode(...args) {
    const paramdef = ['encoded', types.XsString, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('xdmp.urlDecode', 1, paramdef, args);
    return new types.XsString('xdmp', 'url-decode', checkedArgs);
    }
/**
    * Converts plaintext into URL-encoded string. To decode the string, use <a>xdmp:url-decode</a>. <p>There is also a W3C function that does a slightly different url encoding: <a>fn:encode-for-uri</a>. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xdmp.urlEncode|xdmp.urlEncode}
    * @method planBuilder.xdmp#urlEncode
    * @since 2.1.1
    * @param { XsString } [plaintext] - Plaintext to be encoded.
    * @param { XsBoolean } [noSpacePlus] - True to encode space as "%20" instead of "+".
    * @returns { XsString }
    */
urlEncode(...args) {
    const namer = bldrbase.getNamer(args, 'plaintext');
    const paramdefs = [['plaintext', types.XsString, true, false], ['noSpacePlus', types.XsBoolean, false, false]];
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
    const paramdef = ['timestamp', types.XsDateTime, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('xdmp.wallclockToTimestamp', 1, paramdef, args);
    return new types.XsUnsignedLong('xdmp', 'wallclock-to-timestamp', checkedArgs);
    }
/**
    * Returns an xs:integer between 1 and 53, both inclusive, representing the week value in the localized value of $arg. <p> If $arg is the empty sequence, returns the empty sequence.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/xdmp.weekFromDate|xdmp.weekFromDate}
    * @method planBuilder.xdmp#weekFromDate
    * @since 2.1.1
    * @param { XsDate } [arg] - The date whose weeks of the year will be returned.
    * @returns { XsInteger }
    */
weekFromDate(...args) {
    const paramdef = ['arg', types.XsDate, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xdmp.weekFromDate', 1, paramdef, args);
    return new types.XsInteger('xdmp', 'week-from-date', checkedArgs);
    }
/**
    * Returns an xs:integer in the range 1 to 7, inclusive, representing the weekday value in the localized value of $arg. Monday is the first weekday value (value of 1), and Sunday is the last (value of 7). <p> If $arg is the empty sequence, returns the empty sequence.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/xdmp.weekdayFromDate|xdmp.weekdayFromDate}
    * @method planBuilder.xdmp#weekdayFromDate
    * @since 2.1.1
    * @param { XsDate } [arg] - The date whose weekday value will be returned.
    * @returns { XsInteger }
    */
weekdayFromDate(...args) {
    const paramdef = ['arg', types.XsDate, false, false];
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
    const paramdefs = [['x', types.XsUnsignedLong, true, false], ['y', types.XsUnsignedLong, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'xdmp.xor64', 2, new Set(['x', 'y']), paramdefs, args) :
        bldrbase.makePositionalArgs('xdmp.xor64', 2, false, paramdefs, args);
    return new types.XsUnsignedLong('xdmp', 'xor64', checkedArgs);

    }
/**
    * Returns an xs:integer between 1 and 366, both inclusive, representing the yearday value in the localized value of $arg. <p> If $arg is the empty sequence, returns the empty sequence.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/xdmp.yeardayFromDate|xdmp.yeardayFromDate}
    * @method planBuilder.xdmp#yeardayFromDate
    * @since 2.1.1
    * @param { XsDate } [arg] - The date whose days of the year will be returned.
    * @returns { XsInteger }
    */
yeardayFromDate(...args) {
    const paramdef = ['arg', types.XsDate, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xdmp.yeardayFromDate', 1, paramdef, args);
    return new types.XsInteger('xdmp', 'yearday-from-date', checkedArgs);
    }
}
class XsExpr {
  constructor() {
  }
  /**
    * Constructs or casts an expression to the xs:anyURI server data type. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xs.anyURI|xs.anyURI}
    * @method planBuilder.xs#anyURI
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg1] - the expression to construct or cast
    * @returns { XsAnyURI }
    */
anyURI(...args) {
    const paramdef = ['arg1', types.XsAnyAtomicType, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.anyURI', 1, paramdef, args);
    return new types.XsAnyURI('xs', 'anyURI', checkedArgs);
    }
/**
    * Constructs or casts an expression to the xs:base64Binary server data type. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xs.base64Binary|xs.base64Binary}
    * @method planBuilder.xs#base64Binary
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg1] - the expression to construct or cast
    * @returns { XsBase64Binary }
    */
base64Binary(...args) {
    const paramdef = ['arg1', types.XsAnyAtomicType, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.base64Binary', 1, paramdef, args);
    return new types.XsBase64Binary('xs', 'base64Binary', checkedArgs);
    }
/**
    * Constructs or casts an expression to the xs:boolean server data type. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xs.boolean|xs.boolean}
    * @method planBuilder.xs#boolean
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg1] - the expression to construct or cast
    * @returns { XsBoolean }
    */
boolean(...args) {
    const paramdef = ['arg1', types.XsAnyAtomicType, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.boolean', 1, paramdef, args);
    return new types.XsBoolean('xs', 'boolean', checkedArgs);
    }
/**
    * Constructs or casts an expression to the xs:byte server data type. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xs.byte|xs.byte}
    * @method planBuilder.xs#byte
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg1] - the expression to construct or cast
    * @returns { XsByte }
    */
byte(...args) {
    const paramdef = ['arg1', types.XsAnyAtomicType, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.byte', 1, paramdef, args);
    return new types.XsByte('xs', 'byte', checkedArgs);
    }
/**
    * Constructs or casts an expression to the xs:date server data type. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xs.date|xs.date}
    * @method planBuilder.xs#date
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg1] - the expression to construct or cast
    * @returns { XsDate }
    */
date(...args) {
    const paramdef = ['arg1', types.XsAnyAtomicType, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.date', 1, paramdef, args);
    return new types.XsDate('xs', 'date', checkedArgs);
    }
/**
    * Constructs or casts an expression to the xs:dateTime server data type. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xs.dateTime|xs.dateTime}
    * @method planBuilder.xs#dateTime
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg1] - the expression to construct or cast
    * @returns { XsDateTime }
    */
dateTime(...args) {
    const paramdef = ['arg1', types.XsAnyAtomicType, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.dateTime', 1, paramdef, args);
    return new types.XsDateTime('xs', 'dateTime', checkedArgs);
    }
/**
    * Constructs or casts an expression to the xs:dayTimeDuration server data type. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xs.dayTimeDuration|xs.dayTimeDuration}
    * @method planBuilder.xs#dayTimeDuration
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg1] - the expression to construct or cast
    * @returns { XsDayTimeDuration }
    */
dayTimeDuration(...args) {
    const paramdef = ['arg1', types.XsAnyAtomicType, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.dayTimeDuration', 1, paramdef, args);
    return new types.XsDayTimeDuration('xs', 'dayTimeDuration', checkedArgs);
    }
/**
    * Constructs or casts an expression to the xs:decimal server data type. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xs.decimal|xs.decimal}
    * @method planBuilder.xs#decimal
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg1] - the expression to construct or cast
    * @returns { XsDecimal }
    */
decimal(...args) {
    const paramdef = ['arg1', types.XsAnyAtomicType, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.decimal', 1, paramdef, args);
    return new types.XsDecimal('xs', 'decimal', checkedArgs);
    }
/**
    * Constructs or casts an expression to the xs:double server data type. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xs.double|xs.double}
    * @method planBuilder.xs#double
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg1] - the expression to construct or cast
    * @returns { XsDouble }
    */
double(...args) {
    const paramdef = ['arg1', types.XsAnyAtomicType, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.double', 1, paramdef, args);
    return new types.XsDouble('xs', 'double', checkedArgs);
    }
/**
    * Constructs or casts an expression to the xs:float server data type. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xs.float|xs.float}
    * @method planBuilder.xs#float
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg1] - the expression to construct or cast
    * @returns { XsFloat }
    */
float(...args) {
    const paramdef = ['arg1', types.XsAnyAtomicType, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.float', 1, paramdef, args);
    return new types.XsFloat('xs', 'float', checkedArgs);
    }
/**
    * Constructs or casts an expression to the xs:gDay server data type. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xs.gDay|xs.gDay}
    * @method planBuilder.xs#gDay
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg1] - the expression to construct or cast
    * @returns { XsGDay }
    */
gDay(...args) {
    const paramdef = ['arg1', types.XsAnyAtomicType, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.gDay', 1, paramdef, args);
    return new types.XsGDay('xs', 'gDay', checkedArgs);
    }
/**
    * Constructs or casts an expression to the xs:gMonth server data type. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xs.gMonth|xs.gMonth}
    * @method planBuilder.xs#gMonth
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg1] - the expression to construct or cast
    * @returns { XsGMonth }
    */
gMonth(...args) {
    const paramdef = ['arg1', types.XsAnyAtomicType, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.gMonth', 1, paramdef, args);
    return new types.XsGMonth('xs', 'gMonth', checkedArgs);
    }
/**
    * Constructs or casts an expression to the xs:gMonthDay server data type. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xs.gMonthDay|xs.gMonthDay}
    * @method planBuilder.xs#gMonthDay
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg1] - the expression to construct or cast
    * @returns { XsGMonthDay }
    */
gMonthDay(...args) {
    const paramdef = ['arg1', types.XsAnyAtomicType, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.gMonthDay', 1, paramdef, args);
    return new types.XsGMonthDay('xs', 'gMonthDay', checkedArgs);
    }
/**
    * Constructs or casts an expression to the xs:gYear server data type. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xs.gYear|xs.gYear}
    * @method planBuilder.xs#gYear
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg1] - the expression to construct or cast
    * @returns { XsGYear }
    */
gYear(...args) {
    const paramdef = ['arg1', types.XsAnyAtomicType, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.gYear', 1, paramdef, args);
    return new types.XsGYear('xs', 'gYear', checkedArgs);
    }
/**
    * Constructs or casts an expression to the xs:gYearMonth server data type. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xs.gYearMonth|xs.gYearMonth}
    * @method planBuilder.xs#gYearMonth
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg1] - the expression to construct or cast
    * @returns { XsGYearMonth }
    */
gYearMonth(...args) {
    const paramdef = ['arg1', types.XsAnyAtomicType, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.gYearMonth', 1, paramdef, args);
    return new types.XsGYearMonth('xs', 'gYearMonth', checkedArgs);
    }
/**
    * Constructs or casts an expression to the xs:hexBinary server data type. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xs.hexBinary|xs.hexBinary}
    * @method planBuilder.xs#hexBinary
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg1] - the expression to construct or cast
    * @returns { XsHexBinary }
    */
hexBinary(...args) {
    const paramdef = ['arg1', types.XsAnyAtomicType, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.hexBinary', 1, paramdef, args);
    return new types.XsHexBinary('xs', 'hexBinary', checkedArgs);
    }
/**
    * Constructs or casts an expression to the xs:int server data type. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xs.int|xs.int}
    * @method planBuilder.xs#int
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg1] - the expression to construct or cast
    * @returns { XsInt }
    */
int(...args) {
    const paramdef = ['arg1', types.XsAnyAtomicType, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.int', 1, paramdef, args);
    return new types.XsInt('xs', 'int', checkedArgs);
    }
/**
    * Constructs or casts an expression to the xs:integer server data type. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xs.integer|xs.integer}
    * @method planBuilder.xs#integer
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg1] - the expression to construct or cast
    * @returns { XsInteger }
    */
integer(...args) {
    const paramdef = ['arg1', types.XsAnyAtomicType, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.integer', 1, paramdef, args);
    return new types.XsInteger('xs', 'integer', checkedArgs);
    }
/**
    * Constructs or casts an expression to the xs:language server data type. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xs.language|xs.language}
    * @method planBuilder.xs#language
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg1] - the expression to construct or cast
    * @returns { XsLanguage }
    */
language(...args) {
    const paramdef = ['arg1', types.XsAnyAtomicType, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.language', 1, paramdef, args);
    return new types.XsLanguage('xs', 'language', checkedArgs);
    }
/**
    * Constructs or casts an expression to the xs:long server data type. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xs.long|xs.long}
    * @method planBuilder.xs#long
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg1] - the expression to construct or cast
    * @returns { XsLong }
    */
long(...args) {
    const paramdef = ['arg1', types.XsAnyAtomicType, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.long', 1, paramdef, args);
    return new types.XsLong('xs', 'long', checkedArgs);
    }
/**
    * Constructs or casts an expression to the xs:Name server data type. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xs.Name|xs.Name}
    * @method planBuilder.xs#Name
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg1] - the expression to construct or cast
    * @returns { XsName }
    */
Name(...args) {
    const paramdef = ['arg1', types.XsAnyAtomicType, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.Name', 1, paramdef, args);
    return new types.XsName('xs', 'Name', checkedArgs);
    }
/**
    * Constructs or casts an expression to the xs:NCName server data type. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xs.NCName|xs.NCName}
    * @method planBuilder.xs#NCName
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg1] - the expression to construct or cast
    * @returns { XsNCName }
    */
NCName(...args) {
    const paramdef = ['arg1', types.XsAnyAtomicType, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.NCName', 1, paramdef, args);
    return new types.XsNCName('xs', 'NCName', checkedArgs);
    }
/**
    * Constructs or casts an expression to the xs:negativeInteger server data type. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xs.negativeInteger|xs.negativeInteger}
    * @method planBuilder.xs#negativeInteger
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg1] - the expression to construct or cast
    * @returns { XsNegativeInteger }
    */
negativeInteger(...args) {
    const paramdef = ['arg1', types.XsAnyAtomicType, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.negativeInteger', 1, paramdef, args);
    return new types.XsNegativeInteger('xs', 'negativeInteger', checkedArgs);
    }
/**
    * Constructs or casts an expression to the xs:NMTOKEN server data type. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xs.NMTOKEN|xs.NMTOKEN}
    * @method planBuilder.xs#NMTOKEN
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg1] - the expression to construct or cast
    * @returns { XsNMTOKEN }
    */
NMTOKEN(...args) {
    const paramdef = ['arg1', types.XsAnyAtomicType, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.NMTOKEN', 1, paramdef, args);
    return new types.XsNMTOKEN('xs', 'NMTOKEN', checkedArgs);
    }
/**
    * Constructs or casts an expression to the xs:nonNegativeInteger server data type. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xs.nonNegativeInteger|xs.nonNegativeInteger}
    * @method planBuilder.xs#nonNegativeInteger
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg1] - the expression to construct or cast
    * @returns { XsNonNegativeInteger }
    */
nonNegativeInteger(...args) {
    const paramdef = ['arg1', types.XsAnyAtomicType, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.nonNegativeInteger', 1, paramdef, args);
    return new types.XsNonNegativeInteger('xs', 'nonNegativeInteger', checkedArgs);
    }
/**
    * Constructs or casts an expression to the xs:nonPositiveInteger server data type. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xs.nonPositiveInteger|xs.nonPositiveInteger}
    * @method planBuilder.xs#nonPositiveInteger
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg1] - the expression to construct or cast
    * @returns { XsNonPositiveInteger }
    */
nonPositiveInteger(...args) {
    const paramdef = ['arg1', types.XsAnyAtomicType, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.nonPositiveInteger', 1, paramdef, args);
    return new types.XsNonPositiveInteger('xs', 'nonPositiveInteger', checkedArgs);
    }
/**
    * Constructs or casts an expression to the xs:normalizedString server data type. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xs.normalizedString|xs.normalizedString}
    * @method planBuilder.xs#normalizedString
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg1] - the expression to construct or cast
    * @returns { XsNormalizedString }
    */
normalizedString(...args) {
    const paramdef = ['arg1', types.XsAnyAtomicType, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.normalizedString', 1, paramdef, args);
    return new types.XsNormalizedString('xs', 'normalizedString', checkedArgs);
    }
/**
    * Constructs or casts an expression to the xs:numeric server data type. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xs.numeric|xs.numeric}
    * @method planBuilder.xs#numeric
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg1] - the expression to construct or cast
    * @returns { XsNumeric }
    */
numeric(...args) {
    const paramdef = ['arg1', types.XsAnyAtomicType, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.numeric', 1, paramdef, args);
    return new types.XsNumeric('xs', 'numeric', checkedArgs);
    }
/**
    * Constructs or casts an expression to the xs:positiveInteger server data type. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xs.positiveInteger|xs.positiveInteger}
    * @method planBuilder.xs#positiveInteger
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg1] - the expression to construct or cast
    * @returns { XsPositiveInteger }
    */
positiveInteger(...args) {
    const paramdef = ['arg1', types.XsAnyAtomicType, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.positiveInteger', 1, paramdef, args);
    return new types.XsPositiveInteger('xs', 'positiveInteger', checkedArgs);
    }
/**
    * Constructs or casts an expression to the xs:QName server data type. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xs.QName|xs.QName}
    * @method planBuilder.xs#QName
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg1] - the expression to construct or cast
    * @returns { XsQName }
    */
QName(...args) {
    const paramdef = ['arg1', types.XsAnyAtomicType, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.QName', 1, paramdef, args);
    return new types.XsQName('xs', 'QName', checkedArgs);
    }
/**
    * Constructs or casts an expression to the xs:short server data type. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xs.short|xs.short}
    * @method planBuilder.xs#short
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg1] - the expression to construct or cast
    * @returns { XsShort }
    */
short(...args) {
    const paramdef = ['arg1', types.XsAnyAtomicType, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.short', 1, paramdef, args);
    return new types.XsShort('xs', 'short', checkedArgs);
    }
/**
    * Constructs or casts an expression to the xs:string server data type. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xs.string|xs.string}
    * @method planBuilder.xs#string
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg1] - the expression to construct or cast
    * @returns { XsString }
    */
string(...args) {
    const paramdef = ['arg1', types.XsAnyAtomicType, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.string', 1, paramdef, args);
    return new types.XsString('xs', 'string', checkedArgs);
    }
/**
    * Constructs or casts an expression to the xs:time server data type. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xs.time|xs.time}
    * @method planBuilder.xs#time
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg1] - the expression to construct or cast
    * @returns { XsTime }
    */
time(...args) {
    const paramdef = ['arg1', types.XsAnyAtomicType, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.time', 1, paramdef, args);
    return new types.XsTime('xs', 'time', checkedArgs);
    }
/**
    * Constructs or casts an expression to the xs:token server data type. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xs.token|xs.token}
    * @method planBuilder.xs#token
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg1] - the expression to construct or cast
    * @returns { XsToken }
    */
token(...args) {
    const paramdef = ['arg1', types.XsAnyAtomicType, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.token', 1, paramdef, args);
    return new types.XsToken('xs', 'token', checkedArgs);
    }
/**
    * Constructs or casts an expression to the xs:unsignedByte server data type. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xs.unsignedByte|xs.unsignedByte}
    * @method planBuilder.xs#unsignedByte
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg1] - the expression to construct or cast
    * @returns { XsUnsignedByte }
    */
unsignedByte(...args) {
    const paramdef = ['arg1', types.XsAnyAtomicType, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.unsignedByte', 1, paramdef, args);
    return new types.XsUnsignedByte('xs', 'unsignedByte', checkedArgs);
    }
/**
    * Constructs or casts an expression to the xs:unsignedInt server data type. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xs.unsignedInt|xs.unsignedInt}
    * @method planBuilder.xs#unsignedInt
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg1] - the expression to construct or cast
    * @returns { XsUnsignedInt }
    */
unsignedInt(...args) {
    const paramdef = ['arg1', types.XsAnyAtomicType, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.unsignedInt', 1, paramdef, args);
    return new types.XsUnsignedInt('xs', 'unsignedInt', checkedArgs);
    }
/**
    * Constructs or casts an expression to the xs:unsignedLong server data type. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xs.unsignedLong|xs.unsignedLong}
    * @method planBuilder.xs#unsignedLong
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg1] - the expression to construct or cast
    * @returns { XsUnsignedLong }
    */
unsignedLong(...args) {
    const paramdef = ['arg1', types.XsAnyAtomicType, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.unsignedLong', 1, paramdef, args);
    return new types.XsUnsignedLong('xs', 'unsignedLong', checkedArgs);
    }
/**
    * Constructs or casts an expression to the xs:unsignedShort server data type. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xs.unsignedShort|xs.unsignedShort}
    * @method planBuilder.xs#unsignedShort
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg1] - the expression to construct or cast
    * @returns { XsUnsignedShort }
    */
unsignedShort(...args) {
    const paramdef = ['arg1', types.XsAnyAtomicType, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.unsignedShort', 1, paramdef, args);
    return new types.XsUnsignedShort('xs', 'unsignedShort', checkedArgs);
    }
/**
    * Constructs or casts an expression to the xs:untypedAtomic server data type. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xs.untypedAtomic|xs.untypedAtomic}
    * @method planBuilder.xs#untypedAtomic
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg1] - the expression to construct or cast
    * @returns { XsUntypedAtomic }
    */
untypedAtomic(...args) {
    const paramdef = ['arg1', types.XsAnyAtomicType, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.untypedAtomic', 1, paramdef, args);
    return new types.XsUntypedAtomic('xs', 'untypedAtomic', checkedArgs);
    }
/**
    * Constructs or casts an expression to the xs:yearMonthDuration server data type. Provides a client interface to a server function. See {@link http://docs.marklogic.com/xs.yearMonthDuration|xs.yearMonthDuration}
    * @method planBuilder.xs#yearMonthDuration
    * @since 2.1.1
    * @param { XsAnyAtomicType } [arg1] - the expression to construct or cast
    * @returns { XsYearMonthDuration }
    */
yearMonthDuration(...args) {
    const paramdef = ['arg1', types.XsAnyAtomicType, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.yearMonthDuration', 1, paramdef, args);
    return new types.XsYearMonthDuration('xs', 'yearMonthDuration', checkedArgs);
    }
}
class PlanTripleOption extends types.ServerType {

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

class PlanRowFilter extends types.ServerType {

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

class PlanLongParam extends types.ServerType {

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

class PlanTriplePosition extends types.ServerType {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}

class PlanCondition extends types.ServerType {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}

class PlanPlan extends types.ServerType {

  constructor(prior, ns, fn, args) {
    super(ns, fn, args);
    this._operators = (prior === null) ? [this] : prior._operators.concat(this);
  }
  export() {
    return bldrbase.doExport(this);
  }
/**
    *  Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.bindParam|op.bindParam}
    * @method planBuilder.PlanPlan#bindParam
    * @since 2.1.1
    * @param { PlanParam } [param] - 
    * @param { PlanParamBinding } [literal] - 
    * @returns { PlanPlan }
    */
bindParam(...args) {
    const namer = bldrbase.getNamer(args, 'param');
    const paramdefs = [['param', PlanParam, true, false], ['literal', PlanParamBinding, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanPlan.bindParam', 2, new Set(['param', 'literal']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanPlan.bindParam', 2, false, paramdefs, args);
    return new PlanPlan(this, 'op', 'bind-param', checkedArgs);

    }
}

class PlanPrefixer extends types.ServerType {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }
/**
    *  Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.iri|op.iri}
    * @method planBuilder.PlanPrefixer#iri
    * @since 2.1.1
    * @param { XsString } [name] - 
    * @returns { SemIri }
    */
iri(...args) {
    const paramdef = ['name', types.XsString, true, false];
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

class PlanPreparePlan extends PlanExportablePlan {

  constructor(prior, ns, fn, args) {
    super(prior, ns, fn, args);
  }
/**
    * This method applies the specified function to each row returned by the plan to produce a different result row. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.map|op.map}
    * @method planBuilder.PlanPreparePlan#map
    * @since 2.1.1
    * @param { PlanFunction } [func] - The Optic Plan. You can either use the XQuery => chaining operator or specify the variable that captures the return value from the previous operation.
    * @returns { PlanExportablePlan }
    */
map(...args) {
    const paramdef = ['func', PlanFunction, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('PlanPreparePlan.map', 1, paramdef, args);
    return new PlanExportablePlan(this, 'op', 'map', checkedArgs);
    }
/**
    * This method applies a function or the builtin reducer to each row returned by the plan to produce a single result as with the <code>reduce()</code> method of JavaScript Array. <p> The signature of the reducer must be <code>function(previous, row)</code>, where <code>previous</code> is the seed on the first request and the return from the previous call on subsequent request and <code>row</code> is the current row.  <p> The implementation of a <code>op:reduce</code> function can call <a>op:map</a> functions to chain map calls with reduce calls.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.reduce|op.reduce}
    * @method planBuilder.PlanPreparePlan#reduce
    * @since 2.1.1
    * @param { PlanFunction } [func] - The Optic Plan. You can either use the XQuery => chaining operator or specify the variable that captures the return value from the previous operation.
    * @param { XsAnyAtomicType } [seed] - The function to be appied.
    * @returns { PlanExportablePlan }
    */
reduce(...args) {
    const namer = bldrbase.getNamer(args, 'func');
    const paramdefs = [['func', PlanFunction, true, false], ['seed', types.XsAnyAtomicType, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanPreparePlan.reduce', 1, new Set(['func', 'seed']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanPreparePlan.reduce', 1, false, paramdefs, args);
    return new PlanExportablePlan(this, 'op', 'reduce', checkedArgs);

    }
}

class PlanModifyPlan extends PlanPreparePlan {

  constructor(prior, ns, fn, args) {
    super(prior, ns, fn, args);
  }
/**
    * This method restricts the left row set to rows where a row with the same columns and values doesn't exist in the right row set. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.except|op.except}
    * @method planBuilder.PlanModifyPlan#except
    * @since 2.1.1
    * @param { PlanModifyPlan } [right] - The row set from the left view.
    * @returns { PlanModifyPlan }
    */
except(...args) {
    const paramdef = ['right', PlanModifyPlan, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('PlanModifyPlan.except', 1, paramdef, args);
    return new PlanModifyPlan(this, 'op', 'except', checkedArgs);
    }
/**
    * This method collapses a group of rows into a single row. <p> If you want the results to include a column, specify the column either as a grouping key or as one of the aggregates. A group-by operation without a grouping key outputs a single group reflecting the entire row set. <p> The aggregates for a group by operation are specified as the second parameter instead of in a <a>op:select</a> operation (unlike SQL).  Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.groupBy|op.groupBy}
    * @method planBuilder.PlanModifyPlan#groupBy
    * @since 2.1.1
    * @param { PlanExprCol } [keys] - The Optic Plan. You can either use the XQuery => chaining operator or specify the variable that captures the return value from the previous operation.
    * @param { PlanAggregateCol } [aggregates] - This parameter specifies the columns used to determine the groups. Rows with the same values in these columns are consolidated into a single group. The columns can be existing columns or new columns created by an expression specified with <a>op:as</a>. The rows produced by the group by operation include the key columns. Specify an empty sequence to create a single group for all of the rows in the row set.
    * @returns { PlanModifyPlan }
    */
groupBy(...args) {
    const namer = bldrbase.getNamer(args, 'keys');
    const paramdefs = [['keys', PlanExprCol, false, true], ['aggregates', PlanAggregateCol, false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanModifyPlan.groupBy', 1, new Set(['keys', 'aggregates']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanModifyPlan.groupBy', 1, false, paramdefs, args);
    return new PlanModifyPlan(this, 'op', 'group-by', checkedArgs);

    }
/**
    * This method restricts the left row set to rows where a row with the same columns and values exists in the right row set. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.intersect|op.intersect}
    * @method planBuilder.PlanModifyPlan#intersect
    * @since 2.1.1
    * @param { PlanModifyPlan } [right] - The row set from the left view.
    * @returns { PlanModifyPlan }
    */
intersect(...args) {
    const paramdef = ['right', PlanModifyPlan, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('PlanModifyPlan.intersect', 1, paramdef, args);
    return new PlanModifyPlan(this, 'op', 'intersect', checkedArgs);
    }
/**
    * This method yields one output row set that concatenates every left row with every right row. Matches other than equality matches (for instance, greater-than comparisons between keys) can be implemented with a condition on the cross product. <p> The join performs natural joins between columns with the same identifiers. To prevent inadvertent natural joins, specify a different qualifier for the left or right columns or use different column names for the left and right columns.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.joinCrossProduct|op.joinCrossProduct}
    * @method planBuilder.PlanModifyPlan#joinCrossProduct
    * @since 2.1.1
    * @param { PlanModifyPlan } [right] - The row set from the left view.
    * @param { XsBoolean } [condition] - The row set from the right view.
    * @returns { PlanModifyPlan }
    */
joinCrossProduct(...args) {
    const namer = bldrbase.getNamer(args, 'right');
    const paramdefs = [['right', PlanModifyPlan, true, false], ['condition', types.XsBoolean, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanModifyPlan.joinCrossProduct', 1, new Set(['right', 'condition']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanModifyPlan.joinCrossProduct', 1, false, paramdefs, args);
    return new PlanModifyPlan(this, 'op', 'join-cross-product', checkedArgs);

    }
/**
    * This function specifies a document column to add to the rows by reading the documents for an existing source column having a value of a document uri (which can be used to read other documents) or a fragment id (which can be used to read the source documents for rows). <p> As long as the values of the column are the same as document uris, the document join will work. If the document doesn't exist or the uri or fragment id is null in the row, the row is dropped from the rowset.  <p> You should minimize the number of documents retrieved by filtering or limiting rows before joining documents.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.joinDoc|op.joinDoc}
    * @method planBuilder.PlanModifyPlan#joinDoc
    * @since 2.1.1
    * @param { PlanColumn } [docCol] - The Optic Plan. You can either use the XQuery => chaining operator or specify the variable that captures the return value from the previous operation.
    * @param { PlanColumn } [sourceCol] - The document column to add to the rows. This can be a string or column specifying the name of the new column that should have the document as its value.
    * @returns { PlanModifyPlan }
    */
joinDoc(...args) {
    const namer = bldrbase.getNamer(args, 'docCol');
    const paramdefs = [['docCol', PlanColumn, true, false], ['sourceCol', PlanColumn, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanModifyPlan.joinDoc', 2, new Set(['docCol', 'sourceCol']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanModifyPlan.joinDoc', 2, false, paramdefs, args);
    return new PlanModifyPlan(this, 'op', 'join-doc', checkedArgs);

    }
/**
    * This method adds a uri column to rows based on an existing fragment id column to identify the source document for each row. The fragmentIdCol must be an <a>op:fragment-id-col</a> specifying a fragment id column. If the fragment id column is null in the row, the row is dropped from the rowset. <p> You should minimize the number of documents retrieved by filtering or limiting rows before joining documents.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.joinDocUri|op.joinDocUri}
    * @method planBuilder.PlanModifyPlan#joinDocUri
    * @since 2.1.1
    * @param { PlanColumn } [uriCol] - The Optic Plan. You can either use the XQuery => chaining operator or specify the variable that captures the return value from the previous operation.
    * @param { PlanColumn } [fragmentIdCol] - The document uri. This is the output from <a>op:col('uri')</a> that specifies a document uri column.
    * @returns { PlanModifyPlan }
    */
joinDocUri(...args) {
    const namer = bldrbase.getNamer(args, 'uriCol');
    const paramdefs = [['uriCol', PlanColumn, true, false], ['fragmentIdCol', PlanColumn, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanModifyPlan.joinDocUri', 2, new Set(['uriCol', 'fragmentIdCol']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanModifyPlan.joinDocUri', 2, false, paramdefs, args);
    return new PlanModifyPlan(this, 'op', 'join-doc-uri', checkedArgs);

    }
/**
    * This method returns all rows from multiple tables where the join condition is met. In the output row set, each row concatenates one left row and one right row for each match between the keys in the left and right row sets. <p> The join performs natural joins between columns with the same identifiers. To prevent inadvertent natural joins, specify a different qualifier for the left or right columns or use different column names for the left and right columns.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.joinInner|op.joinInner}
    * @method planBuilder.PlanModifyPlan#joinInner
    * @since 2.1.1
    * @param { PlanModifyPlan } [right] - The row set from the left view.
    * @param { PlanJoinKey } [keys] - The row set from the right view.
    * @param { XsBoolean } [condition] - The equijoin from one or more calls to the <a>op:on</a> function.
    * @returns { PlanModifyPlan }
    */
joinInner(...args) {
    const namer = bldrbase.getNamer(args, 'right');
    const paramdefs = [['right', PlanModifyPlan, true, false], ['keys', PlanJoinKey, false, true], ['condition', types.XsBoolean, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanModifyPlan.joinInner', 1, new Set(['right', 'keys', 'condition']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanModifyPlan.joinInner', 1, false, paramdefs, args);
    return new PlanModifyPlan(this, 'op', 'join-inner', checkedArgs);

    }
/**
    * This method yields one output row set with the rows from an inner join as well as rows from the left row set. <p> The join performs natural joins between columns with the same identifiers. To prevent inadvertent natural joins, specify a different qualifier for the left or right columns or use different column names for the left and right columns.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.joinLeftOuter|op.joinLeftOuter}
    * @method planBuilder.PlanModifyPlan#joinLeftOuter
    * @since 2.1.1
    * @param { PlanModifyPlan } [right] - The row set from the left view.
    * @param { PlanJoinKey } [keys] - The row set from the right view.
    * @param { XsBoolean } [condition] - The equijoin from one or more calls to the <a>op:on</a> function.
    * @returns { PlanModifyPlan }
    */
joinLeftOuter(...args) {
    const namer = bldrbase.getNamer(args, 'right');
    const paramdefs = [['right', PlanModifyPlan, true, false], ['keys', PlanJoinKey, false, true], ['condition', types.XsBoolean, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanModifyPlan.joinLeftOuter', 1, new Set(['right', 'keys', 'condition']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanModifyPlan.joinLeftOuter', 1, false, paramdefs, args);
    return new PlanModifyPlan(this, 'op', 'join-left-outer', checkedArgs);

    }
/**
    * This method specifies the maximum number of rows to be returned by this Plan. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.limit|op.limit}
    * @method planBuilder.PlanModifyPlan#limit
    * @since 2.1.1
    * @param { PlanLongParam } [length] - The Optic Plan. You can either use the XQuery => chaining operator or specify the variable that captures the return value from the previous operation.
    * @returns { PlanModifyPlan }
    */
limit(...args) {
    const paramdef = ['length', PlanLongParam, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('PlanModifyPlan.limit', 1, paramdef, args);
    return new PlanModifyPlan(this, 'op', 'limit', checkedArgs);
    }
/**
    * This method returns a subset of the rows in the result set by skipping the number of rows specified by <code>start</code> and returning the remaining rows up to the number specified by the <a>op:limit</a> method. <p> A common pattern is to page over a result set by using a <a>op:param</a> placeholder parameter for the start and specifying the starting value in bindings for <a>op:result</a>. This approach reuses the cached query instead of recalculating the query on each request.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.offset|op.offset}
    * @method planBuilder.PlanModifyPlan#offset
    * @since 2.1.1
    * @param { PlanLongParam } [start] - The Optic Plan. You can either use the XQuery => chaining operator or specify the variable that captures the return value from the previous operation.
    * @returns { PlanModifyPlan }
    */
offset(...args) {
    const paramdef = ['start', PlanLongParam, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('PlanModifyPlan.offset', 1, paramdef, args);
    return new PlanModifyPlan(this, 'op', 'offset', checkedArgs);
    }
/**
    * This method returns a subset of the rows in the result set by skipping the number of rows specified by <code>start</code> and returning the remaining rows up to the <code>length</code> limit. <p> A common pattern is to page over a result set by using a <a>op:param</a> placeholder parameter for the start and specifying the starting value in bindings for <a>op:result</a>. This approach reuses the cached query instead of recalculating the query on each request.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.offsetLimit|op.offsetLimit}
    * @method planBuilder.PlanModifyPlan#offsetLimit
    * @since 2.1.1
    * @param { PlanLongParam } [start] - The Optic Plan. You can either use the XQuery => chaining operator or specify the variable that captures the return value from the previous operation.
    * @param { PlanLongParam } [length] - The number of rows to skip. Default is 1.
    * @returns { PlanModifyPlan }
    */
offsetLimit(...args) {
    const namer = bldrbase.getNamer(args, 'start');
    const paramdefs = [['start', PlanLongParam, false, false], ['length', PlanLongParam, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanModifyPlan.offsetLimit', 2, new Set(['start', 'length']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanModifyPlan.offsetLimit', 2, false, paramdefs, args);
    return new PlanModifyPlan(this, 'op', 'offset-limit', checkedArgs);

    }
/**
    * This method sorts the row set by the specified order definition. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.orderBy|op.orderBy}
    * @method planBuilder.PlanModifyPlan#orderBy
    * @since 2.1.1
    * @param { PlanSortKey } [keys] - The Optic Plan. You can either use the XQuery => chaining operator or specify the variable that captures the return value from the previous operation.
    * @returns { PlanModifyPlan }
    */
orderBy(...args) {
    const paramdef = ['keys', PlanSortKey, true, true];
    const checkedArgs = bldrbase.makeSingleArgs('PlanModifyPlan.orderBy', 1, paramdef, args);
    return new PlanModifyPlan(this, 'op', 'order-by', checkedArgs);
    }
/**
    * This method prepares the specified plan for execution as an optional final step before execution. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.prepare|op.prepare}
    * @method planBuilder.PlanModifyPlan#prepare
    * @since 2.1.1
    * @param { XsInt } [optimize] - The Optic Plan. You can either use the XQuery => chaining operator or specify the variable that captures the return value from the previous operation.
    * @returns { PlanPreparePlan }
    */
prepare(...args) {
    const paramdef = ['optimize', types.XsInt, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('PlanModifyPlan.prepare', 1, paramdef, args);
    return new PlanPreparePlan(this, 'op', 'prepare', checkedArgs);
    }
/**
    * This call projects the specified columns from the current row set and / or applies a qualifier to the columns in the row set. Unlike SQL, a select call is not required in an Optic query. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.select|op.select}
    * @method planBuilder.PlanModifyPlan#select
    * @since 2.1.1
    * @param { PlanExprCol } [columns] - The Optic Plan. You can either use the XQuery => chaining operator or specify the variable that captures the return value from the previous operation.
    * @param { XsString } [qualifierName] - The columns to select.
    * @returns { PlanModifyPlan }
    */
select(...args) {
    const namer = bldrbase.getNamer(args, 'columns');
    const paramdefs = [['columns', PlanExprCol, false, true], ['qualifierName', types.XsString, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanModifyPlan.select', 1, new Set(['columns', 'qualifierName']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanModifyPlan.select', 1, false, paramdefs, args);
    return new PlanModifyPlan(this, 'op', 'select', checkedArgs);

    }
/**
    * This method yields all of the rows from the input row sets. Columns that are present only in some input row sets effectively have a null value in the rows from the other row sets. <p> This method is often followed by the <a>op:where-distinct</a> modifier.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.union|op.union}
    * @method planBuilder.PlanModifyPlan#union
    * @since 2.1.1
    * @param { PlanModifyPlan } [right] - The row set from the left view.
    * @returns { PlanModifyPlan }
    */
union(...args) {
    const paramdef = ['right', PlanModifyPlan, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('PlanModifyPlan.union', 1, paramdef, args);
    return new PlanModifyPlan(this, 'op', 'union', checkedArgs);
    }
/**
    * This method restricts the row set to rows matched by the boolean expression. Use boolean composers such as <a>op:and</a> and <a>op:or</a> to combine multiple expressions. <p> A constraining document query returns only the rows from the matched source documents. If the constraining document query is a node instead of a <a>cts:query</a> object, the implementation calls the <a>cts:query</a> parser on the node. The constraining document query applies to all upstream accessors. A constraining <a>sem:store</a> returns only the triples from the specified store (potentially expanded by inference using a ruleset). A constraining <a>sem:store</a> applies to all upstream triples accessors.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.where|op.where}
    * @method planBuilder.PlanModifyPlan#where
    * @since 2.1.1
    * @param { PlanRowFilter } [condition] - The Optic Plan. You can either use the XQuery => chaining operator or specify the variable that captures the return value from the previous operation.
    * @returns { PlanModifyPlan }
    */
where(...args) {
    const paramdef = ['condition', PlanRowFilter, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('PlanModifyPlan.where', 1, paramdef, args);
    return new PlanModifyPlan(this, 'op', 'where', checkedArgs);
    }
/**
    * This method removes duplicate rows from the row set. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.whereDistinct|op.whereDistinct}
    * @method planBuilder.PlanModifyPlan#whereDistinct
    * @since 2.1.1

    * @returns { PlanModifyPlan }
    */
whereDistinct(...args) {
    bldrbase.checkMaxArity('PlanModifyPlan.whereDistinct', args.length, 0);
    return new PlanModifyPlan(this, 'op', 'where-distinct', args);
    }
}

class PlanAccessPlan extends PlanModifyPlan {

  constructor(prior, ns, fn, args) {
    super(prior, ns, fn, args);
  }
/**
    * This method identifies a column, where the column name is unique. A qualifier on the column name isn't necessary (and might not exist). In positions where only a column name can appear, the unqualified column name can also be provided as a string. Qualified column names cannot be provided as a string. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.col|op.col}
    * @method planBuilder.PlanAccessPlan#col
    * @since 2.1.1
    * @param { XsString } [column] - The Optic AccessorPlan created by <a>op:from-view</a>, <a>op:from-triples</a>, or <a>op:from-lexicons</a>.
    * @returns { PlanColumn }
    */
col(...args) {
    const paramdef = ['column', types.XsString, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('PlanAccessPlan.col', 1, paramdef, args);
    return new PlanColumn('op', 'col', checkedArgs);
    }
}
types.XsGMonthDay._ancestors = new Set([... types.XsGMonthDay._ancestors, PlanTriplePosition]);
types.XsYearMonthDuration._ancestors = new Set([... types.XsYearMonthDuration._ancestors, PlanTriplePosition]);
types.XsString._ancestors = new Set([... types.XsString._ancestors, PlanGroupConcatOption, PlanTriplePosition]);
types.XsFloat._ancestors = new Set([... types.XsFloat._ancestors, PlanTriplePosition]);
types.XsPositiveInteger._ancestors = new Set([... types.XsPositiveInteger._ancestors, PlanTriplePosition]);
types.XsInteger._ancestors = new Set([... types.XsInteger._ancestors, PlanTriplePosition]);
types.XsQName._ancestors = new Set([... types.XsQName._ancestors, PlanTriplePosition]);
types.XsUnsignedInt._ancestors = new Set([... types.XsUnsignedInt._ancestors, PlanTriplePosition]);
types.XsDuration._ancestors = new Set([... types.XsDuration._ancestors, PlanTriplePosition]);
types.SemUnknown._ancestors = new Set([... types.SemUnknown._ancestors, PlanTriplePosition]);
types.XsNCName._ancestors = new Set([... types.XsNCName._ancestors, PlanGroupConcatOption, PlanTriplePosition]);
types.XsUnsignedLong._ancestors = new Set([... types.XsUnsignedLong._ancestors, PlanTriplePosition]);
types.XsNMTOKEN._ancestors = new Set([... types.XsNMTOKEN._ancestors, PlanGroupConcatOption, PlanTriplePosition]);
types.XsName._ancestors = new Set([... types.XsName._ancestors, PlanGroupConcatOption, PlanTriplePosition]);
types.XsDouble._ancestors = new Set([... types.XsDouble._ancestors, PlanTriplePosition]);
types.XsGYearMonth._ancestors = new Set([... types.XsGYearMonth._ancestors, PlanTriplePosition]);
types.XsGDay._ancestors = new Set([... types.XsGDay._ancestors, PlanTriplePosition]);
types.XsUnsignedShort._ancestors = new Set([... types.XsUnsignedShort._ancestors, PlanTriplePosition]);
types.XsInt._ancestors = new Set([... types.XsInt._ancestors, PlanTriplePosition]);
types.XsNumeric._ancestors = new Set([... types.XsNumeric._ancestors, PlanTriplePosition]);
types.SemBnode._ancestors = new Set([... types.SemBnode._ancestors, PlanTriplePosition]);
types.XsUntypedAtomic._ancestors = new Set([... types.XsUntypedAtomic._ancestors, PlanTriplePosition]);
types.XsNonNegativeInteger._ancestors = new Set([... types.XsNonNegativeInteger._ancestors, PlanTriplePosition]);
types.XsGMonth._ancestors = new Set([... types.XsGMonth._ancestors, PlanTriplePosition]);
types.XsDate._ancestors = new Set([... types.XsDate._ancestors, PlanTriplePosition]);
types.XsNonPositiveInteger._ancestors = new Set([... types.XsNonPositiveInteger._ancestors, PlanTriplePosition]);
types.XsLanguage._ancestors = new Set([... types.XsLanguage._ancestors, PlanGroupConcatOption, PlanTriplePosition]);
types.XsHexBinary._ancestors = new Set([... types.XsHexBinary._ancestors, PlanTriplePosition]);
types.XsUnsignedByte._ancestors = new Set([... types.XsUnsignedByte._ancestors, PlanTriplePosition]);
types.XsTime._ancestors = new Set([... types.XsTime._ancestors, PlanTriplePosition]);
types.XsByte._ancestors = new Set([... types.XsByte._ancestors, PlanTriplePosition]);
types.RdfLangString._ancestors = new Set([... types.RdfLangString._ancestors, PlanGroupConcatOption, PlanTriplePosition]);
types.XsDecimal._ancestors = new Set([... types.XsDecimal._ancestors, PlanTriplePosition]);
types.XsDayTimeDuration._ancestors = new Set([... types.XsDayTimeDuration._ancestors, PlanTriplePosition]);
types.XsBoolean._ancestors = new Set([... types.XsBoolean._ancestors, PlanTriplePosition]);
types.XsNegativeInteger._ancestors = new Set([... types.XsNegativeInteger._ancestors, PlanTriplePosition]);
types.XsLong._ancestors = new Set([... types.XsLong._ancestors, PlanTriplePosition]);
types.SemInvalid._ancestors = new Set([... types.SemInvalid._ancestors, PlanTriplePosition]);
types.XsShort._ancestors = new Set([... types.XsShort._ancestors, PlanTriplePosition]);
types.SemIri._ancestors = new Set([... types.SemIri._ancestors, PlanTriplePosition]);
types.XsNormalizedString._ancestors = new Set([... types.XsNormalizedString._ancestors, PlanGroupConcatOption, PlanTriplePosition]);
types.XsAnyAtomicType._ancestors = new Set([... types.XsAnyAtomicType._ancestors, PlanTriplePosition]);
types.XsBase64Binary._ancestors = new Set([... types.XsBase64Binary._ancestors, PlanTriplePosition]);
types.XsToken._ancestors = new Set([... types.XsToken._ancestors, PlanGroupConcatOption, PlanTriplePosition]);
types.XsDateTime._ancestors = new Set([... types.XsDateTime._ancestors, PlanTriplePosition]);
types.XsAnyURI._ancestors = new Set([... types.XsAnyURI._ancestors, PlanTriplePosition]);
types.XsGYear._ancestors = new Set([... types.XsGYear._ancestors, PlanTriplePosition]);
PlanAccessPlan._ancestors = new Set([PlanAccessPlan, PlanModifyPlan, PlanPreparePlan, PlanExportablePlan, PlanPlan]);
PlanAggregateCol._ancestors = new Set([PlanAggregateCol]);
PlanCase._ancestors = new Set([PlanCase]);
PlanColumn._ancestors = new Set([PlanColumn, types.JsonArray, types.Item, types.JsonObject, types.MapMap, types.MathLinearModel, PlanExprCol, PlanAggregateCol, PlanSortKey, PlanTriplePosition, types.RdfLangString, types.XsString, PlanGroupConcatOption, types.XsAnyAtomicType, types.XsAnySimpleType, types.SemInvalid, types.SemIri, types.XsAnyURI, types.SemUnknown, types.XsBase64Binary, types.XsBoolean, types.XsByte, types.XsShort, types.XsInt, types.XsLong, types.XsInteger, types.XsDecimal, types.XsNumeric, types.XsDate, types.XsDateTime, types.XsDayTimeDuration, types.XsDuration, types.XsDouble, types.XsFloat, types.XsGDay, types.XsGMonth, types.XsGMonthDay, types.XsGYear, types.XsGYearMonth, types.XsHexBinary, types.XsLanguage, types.XsToken, types.XsNormalizedString, types.XsName, types.XsNCName, types.XsNegativeInteger, types.XsNonPositiveInteger, types.XsNMTOKEN, types.XsNonNegativeInteger, types.XsPositiveInteger, types.XsQName, types.XsTime, types.XsUnsignedByte, types.XsUnsignedShort, types.XsUnsignedInt, types.XsUnsignedLong, types.XsUntypedAtomic, types.XsYearMonthDuration]);
PlanCondition._ancestors = new Set([PlanCondition]);
PlanCtsReferenceMap._ancestors = new Set([PlanCtsReferenceMap]);
PlanExportablePlan._ancestors = new Set([PlanExportablePlan, PlanPlan]);
PlanExprCol._ancestors = new Set([PlanExprCol, PlanAggregateCol, PlanSortKey]);
PlanFunction._ancestors = new Set([PlanFunction]);
PlanGroupConcatOption._ancestors = new Set([PlanGroupConcatOption]);
PlanJoinKey._ancestors = new Set([PlanJoinKey]);
PlanJsonProperty._ancestors = new Set([PlanJsonProperty]);
PlanLongParam._ancestors = new Set([PlanLongParam]);
PlanModifyPlan._ancestors = new Set([PlanModifyPlan, PlanPreparePlan, PlanExportablePlan, PlanPlan]);
PlanParam._ancestors = new Set([PlanParam]);
PlanParamBinding._ancestors = new Set([PlanParamBinding]);
PlanPlan._ancestors = new Set([PlanPlan]);
PlanPrefixer._ancestors = new Set([PlanPrefixer]);
PlanPreparePlan._ancestors = new Set([PlanPreparePlan, PlanExportablePlan, PlanPlan]);
PlanRowFilter._ancestors = new Set([PlanRowFilter]);
PlanSortKey._ancestors = new Set([PlanSortKey]);
PlanSystemColumn._ancestors = new Set([PlanSystemColumn, PlanColumn, types.JsonArray, types.Item, types.JsonObject, types.MapMap, types.MathLinearModel, PlanExprCol, PlanAggregateCol, PlanSortKey, PlanTriplePosition, types.RdfLangString, types.XsString, PlanGroupConcatOption, types.XsAnyAtomicType, types.XsAnySimpleType, types.SemInvalid, types.SemIri, types.XsAnyURI, types.SemUnknown, types.XsBase64Binary, types.XsBoolean, types.XsByte, types.XsShort, types.XsInt, types.XsLong, types.XsInteger, types.XsDecimal, types.XsNumeric, types.XsDate, types.XsDateTime, types.XsDayTimeDuration, types.XsDuration, types.XsDouble, types.XsFloat, types.XsGDay, types.XsGMonth, types.XsGMonthDay, types.XsGYear, types.XsGYearMonth, types.XsHexBinary, types.XsLanguage, types.XsToken, types.XsNormalizedString, types.XsName, types.XsNCName, types.XsNegativeInteger, types.XsNonPositiveInteger, types.XsNMTOKEN, types.XsNonNegativeInteger, types.XsPositiveInteger, types.XsQName, types.XsTime, types.XsUnsignedByte, types.XsUnsignedShort, types.XsUnsignedInt, types.XsUnsignedLong, types.XsUntypedAtomic, types.XsYearMonthDuration]);
PlanTripleOption._ancestors = new Set([PlanTripleOption]);
PlanTriplePattern._ancestors = new Set([PlanTriplePattern]);
PlanTriplePosition._ancestors = new Set([PlanTriplePosition]);
PlanValueOption._ancestors = new Set([PlanValueOption, PlanGroupConcatOption]);
PlanXsValueMap._ancestors = new Set([PlanXsValueMap]);

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
    * This function returns the sum of the specified numeric expressions. In expressions, the call should pass the result from an <a>op:col</a> function to identify a column. <p> The <a>op:add</a> function differs from the <a>op:sum</a> function in that it operates on operates on multiple column values in a row, rather than a group of rows. <p> As a convenience, you can pass a sequence of any number of expressions as the first argument: <code>op:add((expr1, expr2, ..., exprN))</code>  Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.add|op.add}
    * @method planBuilder#add
    * @since 2.1.1
    * @param { XsNumeric } [left] - The left value expression.
    * @param { XsNumeric } [right] - The right value expression.
    * @returns { XsNumeric }
    */
add(...args) {
        const namer = bldrbase.getNamer(args, 'left');
        const paramdefs = [['left', types.XsNumeric, true, false], ['right', types.XsNumeric, true, false]];
        if (namer !== null) {
            const paramNames = new Set(['left', 'right']);
            args = bldrbase.makeNamedArgs(namer, 'planBuilder.add', 2, paramNames, paramdefs, args);
        } else {
            args = bldrbase.makePositionalArgs('planBuilder.add', 2, true, paramdefs, args);
        }
        return new types.XsNumeric('op', 'add', args);
    }
/**
    * This function returns <code>true</code> if the specified expressions all return <code>true</code>. Otherwise, it returns <code>false</code>. You can either compair <p> As a convenience, you can pass a sequence of any number of expressions as the first argument: <code>op:and((expr1, expr2, ..., exprN))</code>  Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.and|op.and}
    * @method planBuilder#and
    * @since 2.1.1
    * @param { XsAnyAtomicType } [left] - The left value expression.
    * @param { XsAnyAtomicType } [right] - The right value expression.
    * @returns { XsBoolean }
    */
and(...args) {
        const namer = bldrbase.getNamer(args, 'left');
        const paramdefs = [['left', types.XsAnyAtomicType, true, false], ['right', types.XsAnyAtomicType, true, false]];
        if (namer !== null) {
            const paramNames = new Set(['left', 'right']);
            args = bldrbase.makeNamedArgs(namer, 'planBuilder.and', 2, paramNames, paramdefs, args);
        } else {
            args = bldrbase.makePositionalArgs('planBuilder.and', 2, true, paramdefs, args);
        }
        return new types.XsBoolean('op', 'and', args);
    }
/**
    * This function divides the left <code>numericExpression</code> by the right <code>numericExpression</code> and returns the value. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.divide|op.divide}
    * @method planBuilder#divide
    * @since 2.1.1
    * @param { XsNumeric } [left] - The left numeric expression.
    * @param { XsNumeric } [right] - The right numeric expression.
    * @returns { XsNumeric }
    */
divide(...args) {
        const namer = bldrbase.getNamer(args, 'left');
        const paramdefs = [['left', types.XsNumeric, true, false], ['right', types.XsNumeric, true, false]];
        if (namer !== null) {
            const paramNames = new Set(['left', 'right']);
            args = bldrbase.makeNamedArgs(namer, 'planBuilder.divide', 2, paramNames, paramdefs, args);
        } else {
            args = bldrbase.makePositionalArgs('planBuilder.divide', 2, false, paramdefs, args);
        }
        return new types.XsNumeric('op', 'divide', args);
    }
/**
    * This function returns <code>true</code> if the left and right expressions return the same value. Otherwise, it returns <code>false</code>. In expressions, the call should pass the result from an <a>op:col</a> function to identify a column. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.eq|op.eq}
    * @method planBuilder#eq
    * @since 2.1.1
    * @param { XsAnyAtomicType } [left] - The left value expression.
    * @param { XsAnyAtomicType } [right] - The right value expression.
    * @returns { XsBoolean }
    */
eq(...args) {
        const namer = bldrbase.getNamer(args, 'left');
        const paramdefs = [['left', types.XsAnyAtomicType, true, false], ['right', types.XsAnyAtomicType, true, false]];
        if (namer !== null) {
            const paramNames = new Set(['left', 'right']);
            args = bldrbase.makeNamedArgs(namer, 'planBuilder.eq', 2, paramNames, paramdefs, args);
        } else {
            args = bldrbase.makePositionalArgs('planBuilder.eq', 2, false, paramdefs, args);
        }
        return new types.XsBoolean('op', 'eq', args);
    }
/**
    * This function returns <code>true</code> if the value of the left expression is greater than or equal to the value of the right expression. Otherwise, it returns <code>false</code>. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.ge|op.ge}
    * @method planBuilder#ge
    * @since 2.1.1
    * @param { XsAnyAtomicType } [left] - The left value expression.
    * @param { XsAnyAtomicType } [right] - The right value expression.
    * @returns { XsBoolean }
    */
ge(...args) {
        const namer = bldrbase.getNamer(args, 'left');
        const paramdefs = [['left', types.XsAnyAtomicType, true, false], ['right', types.XsAnyAtomicType, true, false]];
        if (namer !== null) {
            const paramNames = new Set(['left', 'right']);
            args = bldrbase.makeNamedArgs(namer, 'planBuilder.ge', 2, paramNames, paramdefs, args);
        } else {
            args = bldrbase.makePositionalArgs('planBuilder.ge', 2, false, paramdefs, args);
        }
        return new types.XsBoolean('op', 'ge', args);
    }
/**
    * This function returns <code>true</code> if the value of the left expression is greater than the value of the right expression. Otherwise, it returns <code>false</code>. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.gt|op.gt}
    * @method planBuilder#gt
    * @since 2.1.1
    * @param { XsAnyAtomicType } [left] - The left value expression.
    * @param { XsAnyAtomicType } [right] - The right value expression.
    * @returns { XsBoolean }
    */
gt(...args) {
        const namer = bldrbase.getNamer(args, 'left');
        const paramdefs = [['left', types.XsAnyAtomicType, true, false], ['right', types.XsAnyAtomicType, true, false]];
        if (namer !== null) {
            const paramNames = new Set(['left', 'right']);
            args = bldrbase.makeNamedArgs(namer, 'planBuilder.gt', 2, paramNames, paramdefs, args);
        } else {
            args = bldrbase.makePositionalArgs('planBuilder.gt', 2, false, paramdefs, args);
        }
        return new types.XsBoolean('op', 'gt', args);
    }
/**
    * This function tests whether the value of an expression is null in the row where the expression might be as simple as a column identified by <a>op:col</a>. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.isDefined|op.isDefined}
    * @method planBuilder#isDefined
    * @since 2.1.1
    * @param { Item } [operand] - A boolean expression, such as <a>op:eq</a> or <a>op:not</a>, that might be null.
    * @returns { XsBoolean }
    */
isDefined(...args) {
        const paramdef = ['operand', types.Item, true, false];
        args = bldrbase.makeSingleArgs('planBuilder.isDefined', 1, paramdef, args);
        return new types.XsBoolean('op', 'is-defined', args);
    }
/**
    * This function returns <code>true</code> if the value of the left expression is less than or equal to the value of the right expression. Otherwise, it returns <code>false</code>. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.le|op.le}
    * @method planBuilder#le
    * @since 2.1.1
    * @param { XsAnyAtomicType } [left] - The left value expression.
    * @param { XsAnyAtomicType } [right] - The right value expression.
    * @returns { XsBoolean }
    */
le(...args) {
        const namer = bldrbase.getNamer(args, 'left');
        const paramdefs = [['left', types.XsAnyAtomicType, true, false], ['right', types.XsAnyAtomicType, true, false]];
        if (namer !== null) {
            const paramNames = new Set(['left', 'right']);
            args = bldrbase.makeNamedArgs(namer, 'planBuilder.le', 2, paramNames, paramdefs, args);
        } else {
            args = bldrbase.makePositionalArgs('planBuilder.le', 2, false, paramdefs, args);
        }
        return new types.XsBoolean('op', 'le', args);
    }
/**
    * This function returns <code>true</code> if the value of the left expression is less than the value of the right expression. Otherwise, it returns <code>false</code>. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.lt|op.lt}
    * @method planBuilder#lt
    * @since 2.1.1
    * @param { XsAnyAtomicType } [left] - The left value expression.
    * @param { XsAnyAtomicType } [right] - The right value expression.
    * @returns { XsBoolean }
    */
lt(...args) {
        const namer = bldrbase.getNamer(args, 'left');
        const paramdefs = [['left', types.XsAnyAtomicType, true, false], ['right', types.XsAnyAtomicType, true, false]];
        if (namer !== null) {
            const paramNames = new Set(['left', 'right']);
            args = bldrbase.makeNamedArgs(namer, 'planBuilder.lt', 2, paramNames, paramdefs, args);
        } else {
            args = bldrbase.makePositionalArgs('planBuilder.lt', 2, false, paramdefs, args);
        }
        return new types.XsBoolean('op', 'lt', args);
    }
/**
    * This function multipies the left <code>numericExpression</code> by the right <code>numericExpression</code> and returns the value. <p> As a convenience, you can pass a sequence of any number of expressions as the first argument: <code>op:multiply((expr1, expr2, ..., exprN))</code>  Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.multiply|op.multiply}
    * @method planBuilder#multiply
    * @since 2.1.1
    * @param { XsNumeric } [left] - The left numeric expression.
    * @param { XsNumeric } [right] - The right numeric expression.
    * @returns { XsNumeric }
    */
multiply(...args) {
        const namer = bldrbase.getNamer(args, 'left');
        const paramdefs = [['left', types.XsNumeric, true, false], ['right', types.XsNumeric, true, false]];
        if (namer !== null) {
            const paramNames = new Set(['left', 'right']);
            args = bldrbase.makeNamedArgs(namer, 'planBuilder.multiply', 2, paramNames, paramdefs, args);
        } else {
            args = bldrbase.makePositionalArgs('planBuilder.multiply', 2, true, paramdefs, args);
        }
        return new types.XsNumeric('op', 'multiply', args);
    }
/**
    * This function returns <code>true</code> if the value of the left expression is not equal to the value of the right expression. Otherwise, it returns <code>false</code>. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.ne|op.ne}
    * @method planBuilder#ne
    * @since 2.1.1
    * @param { XsAnyAtomicType } [left] - The left value expression.
    * @param { XsAnyAtomicType } [right] - The right value expression.
    * @returns { XsBoolean }
    */
ne(...args) {
        const namer = bldrbase.getNamer(args, 'left');
        const paramdefs = [['left', types.XsAnyAtomicType, true, false], ['right', types.XsAnyAtomicType, true, false]];
        if (namer !== null) {
            const paramNames = new Set(['left', 'right']);
            args = bldrbase.makeNamedArgs(namer, 'planBuilder.ne', 2, paramNames, paramdefs, args);
        } else {
            args = bldrbase.makePositionalArgs('planBuilder.ne', 2, false, paramdefs, args);
        }
        return new types.XsBoolean('op', 'ne', args);
    }
/**
    * This function returns <code>true</code> if neither of the specified boolean expressions return <code>true</code>. Otherwise, it returns <code>false</code>. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.not|op.not}
    * @method planBuilder#not
    * @since 2.1.1
    * @param { XsAnyAtomicType } [operand] - Exactly one boolean expression, such as <a>op:and</a> or <a>op:or</a>, or <a>op:is-defined</a>.
    * @returns { XsBoolean }
    */
not(...args) {
        const paramdef = ['operand', types.XsAnyAtomicType, true, false];
        args = bldrbase.makeSingleArgs('planBuilder.not', 1, paramdef, args);
        return new types.XsBoolean('op', 'not', args);
    }
/**
    * This function returns <code>true</code> if the specified expressions all return <code>true</code>. Otherwise, it returns <code>false</code>. <p> As a convenience, you can pass a sequence of any number of expressions as the first argument: <code>op:or((expr1, expr2, ..., exprN))</code>  Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.or|op.or}
    * @method planBuilder#or
    * @since 2.1.1
    * @param { XsAnyAtomicType } [left] - The left value expression.
    * @param { XsAnyAtomicType } [right] - The right value expression.
    * @returns { XsBoolean }
    */
or(...args) {
        const namer = bldrbase.getNamer(args, 'left');
        const paramdefs = [['left', types.XsAnyAtomicType, true, false], ['right', types.XsAnyAtomicType, true, false]];
        if (namer !== null) {
            const paramNames = new Set(['left', 'right']);
            args = bldrbase.makeNamedArgs(namer, 'planBuilder.or', 2, paramNames, paramdefs, args);
        } else {
            args = bldrbase.makePositionalArgs('planBuilder.or', 2, true, paramdefs, args);
        }
        return new types.XsBoolean('op', 'or', args);
    }
/**
    * This function subtracts the right <code>numericExpression</code> from the left <code>numericExpression</code> and returns the value. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.subtract|op.subtract}
    * @method planBuilder#subtract
    * @since 2.1.1
    * @param { XsNumeric } [left] - The left numeric expression.
    * @param { XsNumeric } [right] - The right numeric expression.
    * @returns { XsNumeric }
    */
subtract(...args) {
        const namer = bldrbase.getNamer(args, 'left');
        const paramdefs = [['left', types.XsNumeric, true, false], ['right', types.XsNumeric, true, false]];
        if (namer !== null) {
            const paramNames = new Set(['left', 'right']);
            args = bldrbase.makeNamedArgs(namer, 'planBuilder.subtract', 2, paramNames, paramdefs, args);
        } else {
            args = bldrbase.makePositionalArgs('planBuilder.subtract', 2, false, paramdefs, args);
        }
        return new types.XsNumeric('op', 'subtract', args);
    }/**
    * This function creates a placeholder for a literal value in an expression or as the offset or max for a limit. The <a>op:result</a> function throws in an error if the binding parameter does not specify a literal value for the parameter. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.param|op.param}
    * @method planBuilder#param
    * @since 2.1.1
    * @param { XsString } [name] - The name of the parameter.
    * @returns { PlanParam }
    */
param(...args) {
    const paramdef = ['name', types.XsString, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('PlanBuilder.param', 1, paramdef, args);
    return new PlanParam('op', 'param', checkedArgs);
    }
/**
    * This method identifies a column, where the column name is unique. A qualifier on the column name isn't necessary (and might not exist). In positions where only a column name can appear, the unqualified column name can also be provided as a string. Qualified column names cannot be provided as a string. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.col|op.col}
    * @method planBuilder#col
    * @since 2.1.1
    * @param { XsString } [column] - The Optic AccessorPlan created by <a>op:from-view</a>, <a>op:from-triples</a>, or <a>op:from-lexicons</a>.
    * @returns { PlanColumn }
    */
col(...args) {
    const paramdef = ['column', types.XsString, true, false];
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
    * @returns { PlanColumn }
    */
schemaCol(...args) {
    const namer = bldrbase.getNamer(args, 'schema');
    const paramdefs = [['schema', types.XsString, true, false], ['view', types.XsString, true, false], ['column', types.XsString, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.schemaCol', 3, new Set(['schema', 'view', 'column']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.schemaCol', 3, false, paramdefs, args);
    return new PlanColumn('op', 'schema-col', checkedArgs);

    }
/**
    * Identifies a column where the combination of view and column name is unique. Identifying the schema isn't necessary (and it might not exist). <p> If the combination of view and column name is not unique, an ambiguous column error is thrown.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.viewCol|op.viewCol}
    * @method planBuilder#viewCol
    * @since 2.1.1
    * @param { XsString } [view] - The name of the view.
    * @param { XsString } [column] - The name of the column.
    * @returns { PlanColumn }
    */
viewCol(...args) {
    const namer = bldrbase.getNamer(args, 'view');
    const paramdefs = [['view', types.XsString, true, false], ['column', types.XsString, true, false]];
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
    * @returns { PlanSystemColumn }
    */
fragmentIdCol(...args) {
    const paramdef = ['column', types.XsString, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('PlanBuilder.fragmentIdCol', 1, paramdef, args);
    return new PlanSystemColumn('op', 'fragment-id-col', checkedArgs);
    }
/**
    * Identifies the graph for a triple providing one or more columns for a row. You pass the graph column as a system column parameter to the <a>op:pattern</a> function. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.graphCol|op.graphCol}
    * @method planBuilder#graphCol
    * @since 2.1.1
    * @param { XsString } [column] - The name to use for the graph column.
    * @returns { PlanSystemColumn }
    */
graphCol(...args) {
    const paramdef = ['column', types.XsString, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('PlanBuilder.graphCol', 1, paramdef, args);
    return new PlanSystemColumn('op', 'graph-col', checkedArgs);
    }
/**
    * This function defines a column by assigning the value of an expression over the rows in the row set. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.as|op.as}
    * @method planBuilder#as
    * @since 2.1.1
    * @param { PlanColumn } [column] - The name of the column to be defined. This can be either a string or the return value from <a>op:col</a>, <a>op:view-col</a>, or <a>op:schema-col</a>.
    * @param { Item } [expression] - The expression used to define the value the column.
    * @returns { PlanExprCol }
    */
as(...args) {
    const namer = bldrbase.getNamer(args, 'column');
    const paramdefs = [['column', PlanColumn, true, false], ['expression', types.Item, false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.as', 2, new Set(['column', 'expression']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.as', 2, false, paramdefs, args);
    return new PlanExprCol('op', 'as', checkedArgs);

    }
/**
    *  This function reads a row set from a configured view over TDE-indexed rows or a predefined view over range indexes. <p> This function creates a row set without a limit. Use <a>op:limit</a> or <a>op:offset-limit</a> to set a limit.   Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.fromView|op.fromView}
    * @method planBuilder#fromView
    * @since 2.1.1
    * @param { XsString } [schema] - The name identifying the schema containing the view. If the schema name is null, the engine searches for a view with the specified name.
    * @param { XsString } [view] - The name identifying a configured template or range view for rows projected from documents.
    * @param { XsString } [qualifierName] - Specifies a name for qualifying the column names in place of the combination of the schema and view names. Use cases for the qualifier include self joins. Using an empty string removes all qualification from the column names.
    * @param { PlanSystemColumn } [sysCols] - An optional named fragment id column returned by <a>op:fragment-id-col</a>. One use case for fragment ids is in joins with lexicons or document content.
    * @returns { PlanAccessPlan }
    */
fromView(...args) {
    const namer = bldrbase.getNamer(args, 'schema');
    const paramdefs = [['schema', types.XsString, false, false], ['view', types.XsString, true, false], ['qualifierName', types.XsString, false, false], ['sysCols', PlanSystemColumn, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.fromView', 2, new Set(['schema', 'view', 'qualifierName', 'sysCols']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.fromView', 2, false, paramdefs, args);
    return new PlanAccessPlan(null, 'op', 'from-view', checkedArgs);

    }
/**
    * This function factory returns a new function that takes a name parameter and returns a <a>sem:iri</a>, prepending the specified base URI onto the name. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.prefixer|op.prefixer}
    * @method planBuilder#prefixer
    * @since 2.1.1
    * @param { XsString } [base] - The base URI to be prepended to the name.
    * @returns { PlanPrefixer }
    */
prefixer(...args) {
    const paramdef = ['base', types.XsString, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('PlanBuilder.prefixer', 1, paramdef, args);
    return new PlanPrefixer('op', 'prefixer', checkedArgs);
    }
/**
    * Reads rows by matching patterns in the triple index. <p> The rows have a column for each column name in the patterns. While each column will have a consistent datatype for all rows from a view, the columns of rows from a graph may have varying data types, which could affect joins.  <p> This function creates a row set without a limit. Use <a>op:limit</a> or <a>op:offset-limit</a> to set a limit.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.fromTriples|op.fromTriples}
    * @method planBuilder#fromTriples
    * @since 2.1.1
    * @param { PlanTriplePattern } [patterns] - One or more pattern definitions returned by the <a>op:pattern</a> function.
    * @param { XsString } [qualifierName] - Specifies a name for qualifying the column names. By default, triple rows have no qualification. Use cases for the qualifier include self joins. Using an empty string removes all qualification from the column names.
    * @param { XsString } [graphIris] - A list of graph IRIs to restrict the results to triples in the specified graphs. The <a>sem:default-graph-iri</a> function returns the iri that identifies the default graph.
    * @param { PlanTripleOption } [option] - Options consisting of key-value pairs that set options. At present, the options consist of dedup which can take an on|off value to enable or disable deduplication. Deduplication is off by default.
    * @returns { PlanAccessPlan }
    */
fromTriples(...args) {
    const namer = bldrbase.getNamer(args, 'patterns');
    const paramdefs = [['patterns', PlanTriplePattern, true, true], ['qualifierName', types.XsString, false, false], ['graphIris', types.XsString, false, true], ['option', PlanTripleOption, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.fromTriples', 1, new Set(['patterns', 'qualifierName', 'graphIris', 'option']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.fromTriples', 1, false, paramdefs, args);
    return new PlanAccessPlan(null, 'op', 'from-triples', checkedArgs);

    }
/**
    * This function builds the parameters for the <a>op:from-triples</a> function. The result is passed to <a>op:from-triples</a> to project rows from the graph of triples. The columns in a pattern become the columns of the row. The literals in a pattern are used to match triples. You should specify at least one literal in each pattern, usually the predicate. Where a column appears in more than one pattern, the matched triples are joined to form the row. You can specify optional triples with a <a>op:join-left-outer</a> with a separate <a>op:from-triples</a>. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.pattern|op.pattern}
    * @method planBuilder#pattern
    * @since 2.1.1
    * @param { PlanTriplePosition } [subjects] - One column or one or more literal values, such as the literal returned by a <a>sem:iri</a> call.
    * @param { PlanTriplePosition } [predicates] - One column or one or more literal values, such as the literal returned by a <a>sem.iri</a> call.
    * @param { PlanTriplePosition } [objects] - One column or one or more literal values, such as the literal returned by a <a>sem:iri</a> call.
    * @param { PlanSystemColumn } [sysCols] - Specifies the result of an <a>op:fragment-id-col</a> or <a>op:graph-col</a> function to add columns for the fragment id or graph iri.
    * @returns { PlanTriplePattern }
    */
pattern(...args) {
    const namer = bldrbase.getNamer(args, 'subjects');
    const paramdefs = [['subjects', PlanTriplePosition, false, true], ['predicates', PlanTriplePosition, false, true], ['objects', PlanTriplePosition, false, true], ['sysCols', PlanSystemColumn, false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.pattern', 3, new Set(['subjects', 'predicates', 'objects', 'sysCols']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.pattern', 3, false, paramdefs, args);
    return new PlanTriplePattern('op', 'pattern', checkedArgs);

    }
/**
    * This function dynamically constructs a view from range indexes or the uri or collection lexicons. This function will only return rows for documents where the first column has a value. The keys in the map specify the names of the columns and the values in the map provide <a>cts:reference</a> objects to specify the lexicon providing the values of the columns. Optic emits rows based on co-occurrence of lexicon values within the same document similar to <a>cts:value-tuples</a> If the <a>cts:reference</a> sets the nullable option to <code>true</code>, the column is optional in the row. <p> This function creates a row set without a limit. Use <a>op:limit</a> or <a>op:offset-limit</a> to set a limit.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.fromLexicons|op.fromLexicons}
    * @method planBuilder#fromLexicons
    * @since 2.1.1
    * @param { PlanCtsReferenceMap } [indexes] - An object in which each key is a column name and each value specifies a <code>cts:reference</code> for a range index or other lexicon (especially the <a>cts:uri-reference</a> lexicon) with the column values.
    * @param { XsString } [qualifierName] - Specifies a name for qualifying the column names. By default, lexicon rows have no qualification. Use cases for the qualifier include self joins. Using an empty string removes all qualification from the column names.
    * @param { PlanSystemColumn } [sysCols] - An optional named fragment id column returned by the <a>op:fragment-id-col</a> function. The fragment id column can be used for joins.
    * @returns { PlanAccessPlan }
    */
fromLexicons(...args) {
    const namer = bldrbase.getNamer(args, 'indexes');
    const paramdefs = [['indexes', PlanCtsReferenceMap, true, false], ['qualifierName', types.XsString, false, false], ['sysCols', PlanSystemColumn, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.fromLexicons', 1, new Set(['indexes', 'qualifierName', 'sysCols']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.fromLexicons', 1, false, paramdefs, args);
    return new PlanAccessPlan(null, 'op', 'from-lexicons', checkedArgs);

    }
/**
    * Constructs a literal row set as in the SQL VALUES or SPARQL VALUES statements. When specifying rows with arrays, values are mapped to column names by position. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.fromLiterals|op.fromLiterals}
    * @method planBuilder#fromLiterals
    * @since 2.1.1
    * @param { PlanXsValueMap } [rows] - This parameter is either an array of object literals or <a>sem:binding</a> objects in which the key is a column name string identifying the column and the value is a literal with the value of the column, or this parameter is an object with a columnNames key having a value of an array of column names and a rowValues key having a value of an array of arrays with literal values.
    * @param { XsString } [qualifierName] - Specifies a name for qualifying the column names in place of the combination of the schema and view names. Use cases for the qualifier include self joins. Using an empty string removes all qualification from the column names.
    * @returns { PlanAccessPlan }
    */
fromLiterals(...args) {
    const namer = bldrbase.getNamer(args, 'rows');
    const paramdefs = [['rows', PlanXsValueMap, false, true], ['qualifierName', types.XsString, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.fromLiterals', 1, new Set(['rows', 'qualifierName']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.fromLiterals', 1, false, paramdefs, args);
    return new PlanAccessPlan(null, 'op', 'from-literals', checkedArgs);

    }
/**
    *  Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.fromSPARQL|op.fromSPARQL}
    * @method planBuilder#fromSPARQL
    * @since 2.1.1
    * @param { XsString } [select] - 
    * @param { XsString } [qualifierName] - 
    * @returns { PlanModifyPlan }
    */
fromSPARQL(...args) {
    const namer = bldrbase.getNamer(args, 'select');
    const paramdefs = [['select', types.XsString, true, false], ['qualifierName', types.XsString, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.fromSPARQL', 1, new Set(['select', 'qualifierName']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.fromSPARQL', 1, false, paramdefs, args);
    return new PlanModifyPlan(null, 'op', 'from-sparql', checkedArgs);

    }
/**
    *  Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.fromSQL|op.fromSQL}
    * @method planBuilder#fromSQL
    * @since 2.1.1
    * @param { XsString } [select] - 
    * @param { XsString } [qualifierName] - 
    * @returns { PlanModifyPlan }
    */
fromSQL(...args) {
    const namer = bldrbase.getNamer(args, 'select');
    const paramdefs = [['select', types.XsString, true, false], ['qualifierName', types.XsString, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.fromSQL', 1, new Set(['select', 'qualifierName']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.fromSQL', 1, false, paramdefs, args);
    return new PlanModifyPlan(null, 'op', 'from-sql', checkedArgs);

    }
/**
    *  Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.sqlCondition|op.sqlCondition}
    * @method planBuilder#sqlCondition
    * @since 2.1.1
    * @param { XsString } [expression] - 
    * @returns { PlanCondition }
    */
sqlCondition(...args) {
    const paramdef = ['expression', types.XsString, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('PlanBuilder.sqlCondition', 1, paramdef, args);
    return new PlanCondition('op', 'sql-condition', checkedArgs);
    }
/**
    * Specifies an equijoin using one columndef each from the left and right rows. The result is used by the <a>op:join-inner</a> and <a>op:join-left-outer</a> functions. <p> Use <a>op:view-col</a> or <a>op:col</a> if you need to identify columns in the two views that have the same column name.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.on|op.on}
    * @method planBuilder#on
    * @since 2.1.1
    * @param { PlanExprCol } [left] - The rows from the left view.
    * @param { PlanExprCol } [right] - The row set from the right view.
    * @returns { PlanJoinKey }
    */
on(...args) {
    const namer = bldrbase.getNamer(args, 'left');
    const paramdefs = [['left', PlanExprCol, true, false], ['right', PlanExprCol, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.on', 2, new Set(['left', 'right']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.on', 2, false, paramdefs, args);
    return new PlanJoinKey('op', 'on', checkedArgs);

    }
/**
    * This function averages the non-null values of the column for the rows in the group or row set. The result is used for building the parameters used by the <a>op:group-by</a> function. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.avg|op.avg}
    * @method planBuilder#avg
    * @since 2.1.1
    * @param { PlanColumn } [name] - The name to be used for the aggregated column.
    * @param { PlanExprCol } [column] - The column to be aggregated.
    * @param { PlanValueOption } [option] - The options can take a values key with a distinct value to average the distinct values of the column.
    * @returns { PlanAggregateCol }
    */
avg(...args) {
    const namer = bldrbase.getNamer(args, 'name');
    const paramdefs = [['name', PlanColumn, true, false], ['column', PlanExprCol, true, false], ['option', PlanValueOption, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.avg', 2, new Set(['name', 'column', 'option']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.avg', 2, false, paramdefs, args);
    return new PlanAggregateCol('op', 'avg', checkedArgs);

    }
/**
    * This function constructs an array whose items are the result of evaluating the column for each row in the group or row set. The result is used for building the parameters used by the <a>op:group-by</a> function. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.arrayAggregate|op.arrayAggregate}
    * @method planBuilder#arrayAggregate
    * @since 2.1.1
    * @param { PlanColumn } [name] - The name to be used for the aggregated column.
    * @param { PlanExprCol } [column] - The columns to be aggregated.
    * @param { PlanValueOption } [option] - The options can take a values key with a distinct value to average the distinct values of the column.
    * @returns { PlanAggregateCol }
    */
arrayAggregate(...args) {
    const namer = bldrbase.getNamer(args, 'name');
    const paramdefs = [['name', PlanColumn, true, false], ['column', PlanExprCol, true, false], ['option', PlanValueOption, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.arrayAggregate', 2, new Set(['name', 'column', 'option']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.arrayAggregate', 2, false, paramdefs, args);
    return new PlanAggregateCol('op', 'array-aggregate', checkedArgs);

    }
/**
    * This function counts the rows where the specified input column has a value. If the input column is omitted, all rows in the group or row set are counted. The result is used for building the parameters used by the <a>op:group-by</a> function. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.count|op.count}
    * @method planBuilder#count
    * @since 2.1.1
    * @param { PlanColumn } [name] - The name to be used for the column values.
    * @param { PlanExprCol } [column] - The columns to be counted.
    * @param { PlanValueOption } [option] - The options can take a values key with a distinct value to average the distinct values of the column.
    * @returns { PlanAggregateCol }
    */
count(...args) {
    const namer = bldrbase.getNamer(args, 'name');
    const paramdefs = [['name', PlanColumn, true, false], ['column', PlanExprCol, false, false], ['option', PlanValueOption, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.count', 1, new Set(['name', 'column', 'option']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.count', 1, false, paramdefs, args);
    return new PlanAggregateCol('op', 'count', checkedArgs);

    }
/**
    * This function concatenates the non-null values of the column for the rows in the group or row set. The result is used for building the parameters used by the <a>op:group-by</a> function. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.groupConcat|op.groupConcat}
    * @method planBuilder#groupConcat
    * @since 2.1.1
    * @param { PlanColumn } [name] - The name to be used for column with the concatenated values.
    * @param { PlanExprCol } [column] - The name of the column with the values to be concatenated for the group.
    * @param { PlanGroupConcatOption } [options] - The options can take a values key with a distinct value to average the distinct values of the column. In addition to the <code>values</code> key, the options can take a <code>separator</code> key specifying a separator character. The value can be a string or placeholder parameter.
    * @returns { PlanAggregateCol }
    */
groupConcat(...args) {
    const namer = bldrbase.getNamer(args, 'name');
    const paramdefs = [['name', PlanColumn, true, false], ['column', PlanExprCol, true, false], ['options', PlanGroupConcatOption, false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.groupConcat', 2, new Set(['name', 'column', 'options']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.groupConcat', 2, false, paramdefs, args);
    return new PlanAggregateCol('op', 'group-concat', checkedArgs);

    }
/**
    * This function gets the largest non-null value of the column for the rows in the group or row set. The result is used for building the parameters used by the <a>op:group-by</a> function. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.max|op.max}
    * @method planBuilder#max
    * @since 2.1.1
    * @param { PlanColumn } [name] - The name to be used for the largest value.
    * @param { PlanExprCol } [column] - The group or row set.
    * @param { PlanValueOption } [option] - The options can take a values key with a distinct value to average the distinct values of the column.
    * @returns { PlanAggregateCol }
    */
max(...args) {
    const namer = bldrbase.getNamer(args, 'name');
    const paramdefs = [['name', PlanColumn, true, false], ['column', PlanExprCol, true, false], ['option', PlanValueOption, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.max', 2, new Set(['name', 'column', 'option']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.max', 2, false, paramdefs, args);
    return new PlanAggregateCol('op', 'max', checkedArgs);

    }
/**
    * This function gets the smallest non-null value of the column for the rows in the group or row set. The result is used for building the parameters used by the <a>op:group-by</a> function. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.min|op.min}
    * @method planBuilder#min
    * @since 2.1.1
    * @param { PlanColumn } [name] - The name to be used for the smallest value.
    * @param { PlanExprCol } [column] - The group or row set.
    * @param { PlanValueOption } [option] - The options can take a values key with a distinct value to average the distinct values of the column.
    * @returns { PlanAggregateCol }
    */
min(...args) {
    const namer = bldrbase.getNamer(args, 'name');
    const paramdefs = [['name', PlanColumn, true, false], ['column', PlanExprCol, true, false], ['option', PlanValueOption, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.min', 2, new Set(['name', 'column', 'option']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.min', 2, false, paramdefs, args);
    return new PlanAggregateCol('op', 'min', checkedArgs);

    }
/**
    * This function randomly selects one non-null value of the column from the rows in the group or row set. The result is used for building the parameters used by the <a>op:group-by</a> function. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.sample|op.sample}
    * @method planBuilder#sample
    * @since 2.1.1
    * @param { PlanColumn } [name] - The name to be used for the value.
    * @param { PlanExprCol } [column] - The group or row set.
    * @returns { PlanAggregateCol }
    */
sample(...args) {
    const namer = bldrbase.getNamer(args, 'name');
    const paramdefs = [['name', PlanColumn, true, false], ['column', PlanExprCol, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.sample', 2, new Set(['name', 'column']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.sample', 2, false, paramdefs, args);
    return new PlanAggregateCol('op', 'sample', checkedArgs);

    }
/**
    * This call constructs a sequence whose items are the values of a column for each row in the group or row set. The result is used for building the parameters used by the <a>op:group-by</a> function. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.sequenceAggregate|op.sequenceAggregate}
    * @method planBuilder#sequenceAggregate
    * @since 2.1.1
    * @param { PlanColumn } [name] - The name to be used for the aggregated column.
    * @param { PlanExprCol } [column] - The column with the values to aggregate.
    * @param { PlanValueOption } [option] - The options can take a values key with a distinct value to average the distinct values of the column.
    * @returns { PlanAggregateCol }
    */
sequenceAggregate(...args) {
    const namer = bldrbase.getNamer(args, 'name');
    const paramdefs = [['name', PlanColumn, true, false], ['column', PlanExprCol, true, false], ['option', PlanValueOption, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.sequenceAggregate', 2, new Set(['name', 'column', 'option']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.sequenceAggregate', 2, false, paramdefs, args);
    return new PlanAggregateCol('op', 'sequence-aggregate', checkedArgs);

    }
/**
    * This function adds the non-null values of the column for the rows in the group or row set. The result is used for building the parameters used by the <a>op:group-by</a> function. <p> The <a>op:sum</a> function differs from the <a>op:add</a> function in that it operates on operates on a group of rows, rather than multiple column values in a row.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.sum|op.sum}
    * @method planBuilder#sum
    * @since 2.1.1
    * @param { PlanColumn } [name] - The name to be used for the aggregated column.
    * @param { PlanExprCol } [column] - The column with the values to add.
    * @param { PlanValueOption } [option] - The options can take a values key with a distinct value to average the distinct values of the column.
    * @returns { PlanAggregateCol }
    */
sum(...args) {
    const namer = bldrbase.getNamer(args, 'name');
    const paramdefs = [['name', PlanColumn, true, false], ['column', PlanExprCol, true, false], ['option', PlanValueOption, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.sum', 2, new Set(['name', 'column', 'option']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.sum', 2, false, paramdefs, args);
    return new PlanAggregateCol('op', 'sum', checkedArgs);

    }
/**
    * This function processes the values of column for each row in the group or row set with the specified user-defined aggregate as implemented by an aggregate user-defined function (UDF) plugin. The UDF plugin must be installed on each host. The result is used for building the parameters used by the <a>op:group-by</a> function. <p> For more information on UDF functions, see <a>Aggregate User-Defined Functions</a> in the <em>Application Developer's Guide</em>.  Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.uda|op.uda}
    * @method planBuilder#uda
    * @since 2.1.1
    * @param { PlanColumn } [name] - The name to be used for the aggregated column.
    * @param { PlanExprCol } [column] - The column with the values to aggregate.
    * @param { XsString } [module] - The path to the installed plugin module.
    * @param { XsString } [function] - The name of the UDF function.
    * @param { XsAnyAtomicType } [arg] - The options can take a <code>values</code> key with a distinct value to average the distinct values of the column and an <code>arg</code> key specifying an argument for the user-defined aggregate. The value can be a string or placeholder parameter.
    * @returns { PlanAggregateCol }
    */
uda(...args) {
    const namer = bldrbase.getNamer(args, 'name');
    const paramdefs = [['name', PlanColumn, true, false], ['column', PlanExprCol, true, false], ['module', types.XsString, true, false], ['function', types.XsString, true, false], ['arg', types.XsAnyAtomicType, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.uda', 4, new Set(['name', 'column', 'module', 'function', 'arg']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.uda', 4, false, paramdefs, args);
    return new PlanAggregateCol('op', 'uda', checkedArgs);

    }
/**
    * This function sorts the specified <code>columndef</code> in ascending order. The results are used by the <a>op:order-by</a> function. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.asc|op.asc}
    * @method planBuilder#asc
    * @since 2.1.1
    * @param { PlanExprCol } [column] - The column by which order the output.
    * @returns { PlanSortKey }
    */
asc(...args) {
    const paramdef = ['column', PlanExprCol, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('PlanBuilder.asc', 1, paramdef, args);
    return new PlanSortKey('op', 'asc', checkedArgs);
    }
/**
    * This function sorts the specified <code>columndef</code> in descending order. The results are used by the <a>op:order-by</a> function. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.desc|op.desc}
    * @method planBuilder#desc
    * @since 2.1.1
    * @param { PlanExprCol } [column] - The column by which order the output.
    * @returns { PlanSortKey }
    */
desc(...args) {
    const paramdef = ['column', PlanExprCol, true, false];
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
    const paramdefs = [['left', types.XsNumeric, true, false], ['right', types.XsNumeric, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.modulo', 2, new Set(['left', 'right']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.modulo', 2, false, paramdefs, args);
    return new types.XsNumeric('op', 'modulo', checkedArgs);

    }
/**
    * This function returns the specified <code>valueExpression</code> if the specified <code>valueExpression</code> is <code>true</code>. Otherwise, it returns null. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.case|op.case}
    * @method planBuilder#case
    * @since 2.1.1
    * @param { PlanCase } [cases] - One or more <a>op:when</a> expressions.
    * @returns { Item }
    */
case(...args) {
    const namer = bldrbase.getNamer(args, 'cases');
    const paramdefs = [['cases', PlanCase, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.case', 1, new Set(['cases']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.case', 1, true, paramdefs, args);
    return new types.Item('op', 'case', checkedArgs);

    }
/**
    * This function executes the specified expression if the specified condition is <code>true</code> for the row. Otherwise, the expression is not executed and the next 'when' test is checked or, if there is no next 'when' text, the otherwise expression for the <a>op:case</a> expression is executed. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.when|op.when}
    * @method planBuilder#when
    * @since 2.1.1
    * @param { XsBoolean } [condition] - A boolean expression.
    * @param { Item } [value] - The value expression to return if the boolean expression is <code>true</code>.
    * @returns { PlanCase }
    */
when(...args) {
    const namer = bldrbase.getNamer(args, 'condition');
    const paramdefs = [['condition', types.XsBoolean, true, false], ['value', types.Item, false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.when', 2, new Set(['condition', 'value']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.when', 2, false, paramdefs, args);
    return new PlanCase('op', 'when', checkedArgs);

    }
/**
    *  Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.else|op.else}
    * @method planBuilder#else
    * @since 2.1.1
    * @param { Item } [value] - 
    * @returns { PlanCase }
    */
else(...args) {
    const paramdef = ['value', types.Item, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('PlanBuilder.else', 1, paramdef, args);
    return new PlanCase('op', 'else', checkedArgs);
    }
/**
    * This function extracts a sequence of child nodes from a column with node values -- especially, the document nodes from a document join. The path is an XPath (specified as a string) to apply to each node to generate a sequence of nodes as an expression value. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.xpath|op.xpath}
    * @method planBuilder#xpath
    * @since 2.1.1
    * @param { PlanColumn } [column] - The name of the column from which to extract the child nodes.
    * @param { XsString } [path] - An XPath (specified as a string) to apply to each node.
    * @returns { Node }
    */
xpath(...args) {
    const namer = bldrbase.getNamer(args, 'column');
    const paramdefs = [['column', PlanColumn, true, false], ['path', types.XsString, true, false]];
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
    const paramdef = ['root', types.JsonRootNode, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('PlanBuilder.jsonDocument', 1, paramdef, args);
    return new types.DocumentNode('op', 'json-document', checkedArgs);
    }
/**
    * This function constructs a JSON object with the specified properties. The object can be used as the value of a column in a row or passed to a builtin function. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.jsonObject|op.jsonObject}
    * @method planBuilder#jsonObject
    * @since 2.1.1
    * @param { PlanJsonProperty } [property] - The properties to be used to contruct the object. This is constructed by the <a>op:prop</a> function.
    * @returns { ObjectNode }
    */
jsonObject(...args) {
    const namer = bldrbase.getNamer(args, 'property');
    const paramdefs = [['property', PlanJsonProperty, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.jsonObject', 1, new Set(['property']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.jsonObject', 1, true, paramdefs, args);
    return new types.ObjectNode('op', 'json-object', checkedArgs);

    }
/**
    * This function specifies the key expression and value content for a JSON property of a JSON object contructed by the <a>op:json-object</a> function. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.prop|op.prop}
    * @method planBuilder#prop
    * @since 2.1.1
    * @param { XsString } [key] - The key expression. This must evaluate to a string.
    * @param { JsonContentNode } [value] - The value content. This must be exactly one JSON node expression.
    * @returns { PlanJsonProperty }
    */
prop(...args) {
    const namer = bldrbase.getNamer(args, 'key');
    const paramdefs = [['key', types.XsString, true, false], ['value', types.JsonContentNode, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.prop', 2, new Set(['key', 'value']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.prop', 2, false, paramdefs, args);
    return new PlanJsonProperty('op', 'prop', checkedArgs);

    }
/**
    * This function constructs a JSON array during row processing. The array can be used as the value of a column in a row or passed to a builtin expression function. The node is constructed during processing of the plan, rather than when building the plan. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.jsonArray|op.jsonArray}
    * @method planBuilder#jsonArray
    * @since 2.1.1
    * @param { JsonContentNode } [property] - The JSON nodes for the array.
    * @returns { ArrayNode }
    */
jsonArray(...args) {
    const namer = bldrbase.getNamer(args, 'property');
    const paramdefs = [['property', types.JsonContentNode, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.jsonArray', 1, new Set(['property']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.jsonArray', 1, true, paramdefs, args);
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
    const paramdef = ['value', types.XsAnyAtomicType, true, false];
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
    const paramdef = ['value', types.XsNumeric, true, false];
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
    const paramdef = ['value', types.XsBoolean, true, false];
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
    const paramdef = ['root', types.XmlRootNode, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('PlanBuilder.xmlDocument', 1, paramdef, args);
    return new types.DocumentNode('op', 'xml-document', checkedArgs);
    }
/**
    * This function constructs an XML element with the name (which can be a string or QName), zero or more attributes, and child content. The child content can include a sequence or array of atomic values or an element, comment, or processing instruction nodes. Atomic values are converted to text nodes. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.xmlElement|op.xmlElement}
    * @method planBuilder#xmlElement
    * @since 2.1.1
    * @param { XsQName } [name] - The string or QName for the constructed element.
    * @param { AttributeNode } [attributes] - Any element attributes returned from <a>op:xml-attribute</a>, or <code>null</code> if no attributes.
    * @param { XmlContentNode } [content] - A sequence or array of atomic values or an element, a comment from <a>op:xml-comment</a>, or processing instruction nodes from <a>op:xml-pi</a>.
    * @returns { ElementNode }
    */
xmlElement(...args) {
    const namer = bldrbase.getNamer(args, 'name');
    const paramdefs = [['name', types.XsQName, true, false], ['attributes', types.AttributeNode, false, true], ['content', types.XmlContentNode, false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.xmlElement', 1, new Set(['name', 'attributes', 'content']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.xmlElement', 1, false, paramdefs, args);
    return new types.ElementNode('op', 'xml-element', checkedArgs);

    }
/**
    * This function constructs an XML attribute with the name (which can be a string or QName) and atomic value. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.xmlAttribute|op.xmlAttribute}
    * @method planBuilder#xmlAttribute
    * @since 2.1.1
    * @param { XsQName } [name] - The attribute name.
    * @param { XsAnyAtomicType } [value] - The attribute value.
    * @returns { AttributeNode }
    */
xmlAttribute(...args) {
    const namer = bldrbase.getNamer(args, 'name');
    const paramdefs = [['name', types.XsQName, true, false], ['value', types.XsAnyAtomicType, true, false]];
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
    const paramdef = ['value', types.XsAnyAtomicType, true, false];
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
    const paramdef = ['content', types.XsAnyAtomicType, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('PlanBuilder.xmlComment', 1, paramdef, args);
    return new types.CommentNode('op', 'xml-comment', checkedArgs);
    }
/**
    * This function constructs an XML processing instruction with the atomic value. Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.xmlPi|op.xmlPi}
    * @method planBuilder#xmlPi
    * @since 2.1.1
    * @param { XsString } [name] - The name of the processing instruction.
    * @param { XsAnyAtomicType } [value] - The value of the processing instruction.
    * @returns { ProcessingInstructionNode }
    */
xmlPi(...args) {
    const namer = bldrbase.getNamer(args, 'name');
    const paramdefs = [['name', types.XsString, true, false], ['value', types.XsAnyAtomicType, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.xmlPi', 2, new Set(['name', 'value']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.xmlPi', 2, false, paramdefs, args);
    return new types.ProcessingInstructionNode('op', 'xml-pi', checkedArgs);

    }
/**
    *  Provides a client interface to a server function. See {@link http://docs.marklogic.com/op.resolveFunction|op.resolveFunction}
    * @method planBuilder#resolveFunction
    * @since 2.1.1
    * @param { XsQName } [functionName] - 
    * @param { XsString } [modulePath] - 
    * @returns { PlanFunction }
    */
resolveFunction(...args) {
    const namer = bldrbase.getNamer(args, 'functionName');
    const paramdefs = [['functionName', types.XsQName, true, false], ['modulePath', types.XsString, true, false]];
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
JsonExpr: JsonExpr,
MapExpr: MapExpr,
MathExpr: MathExpr,
RdfExpr: RdfExpr,
SemExpr: SemExpr,
SpellExpr: SpellExpr,
SqlExpr: SqlExpr,
XdmpExpr: XdmpExpr,
XsExpr: XsExpr,
  Plan:        PlanPlan
};
