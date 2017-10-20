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
  andNotQuery(...args) {
    const namer = bldrbase.getNamer(args, 'positive-query');
    const paramdefs = [['positive-query', types.CtsQuery, true, false], ['negative-query', types.CtsQuery, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.andNotQuery', 2, new Set(['positive-query', 'negative-query']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.andNotQuery', 2, false, paramdefs, args);
    return new types.CtsQuery('cts', 'and-not-query', checkedArgs);

    }
andQuery(...args) {
    const namer = bldrbase.getNamer(args, 'queries');
    const paramdefs = [['queries', types.CtsQuery, false, true], ['options', types.XsString, false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.andQuery', 1, new Set(['queries', 'options']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.andQuery', 1, false, paramdefs, args);
    return new types.CtsQuery('cts', 'and-query', checkedArgs);

    }
boostQuery(...args) {
    const namer = bldrbase.getNamer(args, 'matching-query');
    const paramdefs = [['matching-query', types.CtsQuery, true, false], ['boosting-query', types.CtsQuery, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.boostQuery', 2, new Set(['matching-query', 'boosting-query']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.boostQuery', 2, false, paramdefs, args);
    return new types.CtsQuery('cts', 'boost-query', checkedArgs);

    }
box(...args) {
    const namer = bldrbase.getNamer(args, 'south');
    const paramdefs = [['south', types.XsDouble, true, false], ['west', types.XsDouble, true, false], ['north', types.XsDouble, true, false], ['east', types.XsDouble, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.box', 4, new Set(['south', 'west', 'north', 'east']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.box', 4, false, paramdefs, args);
    return new types.CtsBox('cts', 'box', checkedArgs);

    }
circle(...args) {
    const namer = bldrbase.getNamer(args, 'radius');
    const paramdefs = [['radius', types.XsDouble, true, false], ['center', types.CtsPoint, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.circle', 2, new Set(['radius', 'center']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.circle', 2, false, paramdefs, args);
    return new types.CtsCircle('cts', 'circle', checkedArgs);

    }
collectionQuery(...args) {
    const paramdef = ['uris', types.XsString, false, true];
    const checkedArgs = bldrbase.makeSingleArgs('cts.collectionQuery', 1, paramdef, args);
    return new types.CtsQuery('cts', 'collection-query', checkedArgs);
    }
collectionReference(...args) {
    const paramdef = ['options', types.XsString, false, true];
    const checkedArgs = bldrbase.makeSingleArgs('cts.collectionReference', 0, paramdef, args);
    return new types.CtsReference('cts', 'collection-reference', checkedArgs);
    }
directoryQuery(...args) {
    const namer = bldrbase.getNamer(args, 'uris');
    const paramdefs = [['uris', types.XsString, false, true], ['depth', types.XsString, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.directoryQuery', 1, new Set(['uris', 'depth']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.directoryQuery', 1, false, paramdefs, args);
    return new types.CtsQuery('cts', 'directory-query', checkedArgs);

    }
documentFragmentQuery(...args) {
    const paramdef = ['query', types.CtsQuery, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('cts.documentFragmentQuery', 1, paramdef, args);
    return new types.CtsQuery('cts', 'document-fragment-query', checkedArgs);
    }
documentQuery(...args) {
    const paramdef = ['uris', types.XsString, false, true];
    const checkedArgs = bldrbase.makeSingleArgs('cts.documentQuery', 1, paramdef, args);
    return new types.CtsQuery('cts', 'document-query', checkedArgs);
    }
elementAttributePairGeospatialQuery(...args) {
    const namer = bldrbase.getNamer(args, 'element-name');
    const paramdefs = [['element-name', types.XsQName, false, true], ['latitude-attribute-names', types.XsQName, false, true], ['longitude-attribute-names', types.XsQName, false, true], ['regions', types.CtsRegion, false, true], ['options', types.XsString, false, true], ['weight', types.XsDouble, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.elementAttributePairGeospatialQuery', 4, new Set(['element-name', 'latitude-attribute-names', 'longitude-attribute-names', 'regions', 'options', 'weight']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.elementAttributePairGeospatialQuery', 4, false, paramdefs, args);
    return new types.CtsQuery('cts', 'element-attribute-pair-geospatial-query', checkedArgs);

    }
elementAttributeRangeQuery(...args) {
    const namer = bldrbase.getNamer(args, 'element-name');
    const paramdefs = [['element-name', types.XsQName, false, true], ['attribute-name', types.XsQName, false, true], ['operator', types.XsString, true, false], ['value', types.XsAnyAtomicType, false, true], ['options', types.XsString, false, true], ['weight', types.XsDouble, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.elementAttributeRangeQuery', 4, new Set(['element-name', 'attribute-name', 'operator', 'value', 'options', 'weight']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.elementAttributeRangeQuery', 4, false, paramdefs, args);
    return new types.CtsQuery('cts', 'element-attribute-range-query', checkedArgs);

    }
elementAttributeReference(...args) {
    const namer = bldrbase.getNamer(args, 'element');
    const paramdefs = [['element', types.XsQName, true, false], ['attribute', types.XsQName, true, false], ['options', types.XsString, false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.elementAttributeReference', 2, new Set(['element', 'attribute', 'options']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.elementAttributeReference', 2, false, paramdefs, args);
    return new types.CtsReference('cts', 'element-attribute-reference', checkedArgs);

    }
elementAttributeValueQuery(...args) {
    const namer = bldrbase.getNamer(args, 'element-name');
    const paramdefs = [['element-name', types.XsQName, false, true], ['attribute-name', types.XsQName, false, true], ['text', types.XsString, false, true], ['options', types.XsString, false, true], ['weight', types.XsDouble, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.elementAttributeValueQuery', 3, new Set(['element-name', 'attribute-name', 'text', 'options', 'weight']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.elementAttributeValueQuery', 3, false, paramdefs, args);
    return new types.CtsQuery('cts', 'element-attribute-value-query', checkedArgs);

    }
elementAttributeWordQuery(...args) {
    const namer = bldrbase.getNamer(args, 'element-name');
    const paramdefs = [['element-name', types.XsQName, false, true], ['attribute-name', types.XsQName, false, true], ['text', types.XsString, false, true], ['options', types.XsString, false, true], ['weight', types.XsDouble, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.elementAttributeWordQuery', 3, new Set(['element-name', 'attribute-name', 'text', 'options', 'weight']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.elementAttributeWordQuery', 3, false, paramdefs, args);
    return new types.CtsQuery('cts', 'element-attribute-word-query', checkedArgs);

    }
elementChildGeospatialQuery(...args) {
    const namer = bldrbase.getNamer(args, 'parent-element-name');
    const paramdefs = [['parent-element-name', types.XsQName, false, true], ['child-element-names', types.XsQName, false, true], ['regions', types.CtsRegion, false, true], ['options', types.XsString, false, true], ['weight', types.XsDouble, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.elementChildGeospatialQuery', 3, new Set(['parent-element-name', 'child-element-names', 'regions', 'options', 'weight']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.elementChildGeospatialQuery', 3, false, paramdefs, args);
    return new types.CtsQuery('cts', 'element-child-geospatial-query', checkedArgs);

    }
elementGeospatialQuery(...args) {
    const namer = bldrbase.getNamer(args, 'element-name');
    const paramdefs = [['element-name', types.XsQName, false, true], ['regions', types.CtsRegion, false, true], ['options', types.XsString, false, true], ['weight', types.XsDouble, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.elementGeospatialQuery', 2, new Set(['element-name', 'regions', 'options', 'weight']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.elementGeospatialQuery', 2, false, paramdefs, args);
    return new types.CtsQuery('cts', 'element-geospatial-query', checkedArgs);

    }
elementPairGeospatialQuery(...args) {
    const namer = bldrbase.getNamer(args, 'element-name');
    const paramdefs = [['element-name', types.XsQName, false, true], ['latitude-element-names', types.XsQName, false, true], ['longitude-element-names', types.XsQName, false, true], ['regions', types.CtsRegion, false, true], ['options', types.XsString, false, true], ['weight', types.XsDouble, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.elementPairGeospatialQuery', 4, new Set(['element-name', 'latitude-element-names', 'longitude-element-names', 'regions', 'options', 'weight']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.elementPairGeospatialQuery', 4, false, paramdefs, args);
    return new types.CtsQuery('cts', 'element-pair-geospatial-query', checkedArgs);

    }
elementQuery(...args) {
    const namer = bldrbase.getNamer(args, 'element-name');
    const paramdefs = [['element-name', types.XsQName, false, true], ['query', types.CtsQuery, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.elementQuery', 2, new Set(['element-name', 'query']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.elementQuery', 2, false, paramdefs, args);
    return new types.CtsQuery('cts', 'element-query', checkedArgs);

    }
elementRangeQuery(...args) {
    const namer = bldrbase.getNamer(args, 'element-name');
    const paramdefs = [['element-name', types.XsQName, false, true], ['operator', types.XsString, true, false], ['value', types.XsAnyAtomicType, false, true], ['options', types.XsString, false, true], ['weight', types.XsDouble, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.elementRangeQuery', 3, new Set(['element-name', 'operator', 'value', 'options', 'weight']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.elementRangeQuery', 3, false, paramdefs, args);
    return new types.CtsQuery('cts', 'element-range-query', checkedArgs);

    }
elementReference(...args) {
    const namer = bldrbase.getNamer(args, 'element');
    const paramdefs = [['element', types.XsQName, true, false], ['options', types.XsString, false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.elementReference', 1, new Set(['element', 'options']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.elementReference', 1, false, paramdefs, args);
    return new types.CtsReference('cts', 'element-reference', checkedArgs);

    }
elementValueQuery(...args) {
    const namer = bldrbase.getNamer(args, 'element-name');
    const paramdefs = [['element-name', types.XsQName, false, true], ['text', types.XsString, false, true], ['options', types.XsString, false, true], ['weight', types.XsDouble, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.elementValueQuery', 1, new Set(['element-name', 'text', 'options', 'weight']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.elementValueQuery', 1, false, paramdefs, args);
    return new types.CtsQuery('cts', 'element-value-query', checkedArgs);

    }
elementWordQuery(...args) {
    const namer = bldrbase.getNamer(args, 'element-name');
    const paramdefs = [['element-name', types.XsQName, false, true], ['text', types.XsString, false, true], ['options', types.XsString, false, true], ['weight', types.XsDouble, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.elementWordQuery', 2, new Set(['element-name', 'text', 'options', 'weight']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.elementWordQuery', 2, false, paramdefs, args);
    return new types.CtsQuery('cts', 'element-word-query', checkedArgs);

    }
falseQuery(...args) {
    bldrbase.checkMaxArity('cts.falseQuery', args.length, 0);
    return new types.CtsQuery('cts', 'false-query', args);
    }
fieldRangeQuery(...args) {
    const namer = bldrbase.getNamer(args, 'field-name');
    const paramdefs = [['field-name', types.XsString, false, true], ['operator', types.XsString, true, false], ['value', types.XsAnyAtomicType, false, true], ['options', types.XsString, false, true], ['weight', types.XsDouble, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.fieldRangeQuery', 3, new Set(['field-name', 'operator', 'value', 'options', 'weight']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.fieldRangeQuery', 3, false, paramdefs, args);
    return new types.CtsQuery('cts', 'field-range-query', checkedArgs);

    }
fieldReference(...args) {
    const namer = bldrbase.getNamer(args, 'field');
    const paramdefs = [['field', types.XsString, true, false], ['options', types.XsString, false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.fieldReference', 1, new Set(['field', 'options']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.fieldReference', 1, false, paramdefs, args);
    return new types.CtsReference('cts', 'field-reference', checkedArgs);

    }
fieldValueQuery(...args) {
    const namer = bldrbase.getNamer(args, 'field-name');
    const paramdefs = [['field-name', types.XsString, false, true], ['text', types.XsAnyAtomicType, false, true], ['options', types.XsString, false, true], ['weight', types.XsDouble, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.fieldValueQuery', 2, new Set(['field-name', 'text', 'options', 'weight']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.fieldValueQuery', 2, false, paramdefs, args);
    return new types.CtsQuery('cts', 'field-value-query', checkedArgs);

    }
fieldWordQuery(...args) {
    const namer = bldrbase.getNamer(args, 'field-name');
    const paramdefs = [['field-name', types.XsString, false, true], ['text', types.XsString, false, true], ['options', types.XsString, false, true], ['weight', types.XsDouble, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.fieldWordQuery', 2, new Set(['field-name', 'text', 'options', 'weight']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.fieldWordQuery', 2, false, paramdefs, args);
    return new types.CtsQuery('cts', 'field-word-query', checkedArgs);

    }
jsonPropertyChildGeospatialQuery(...args) {
    const namer = bldrbase.getNamer(args, 'parent-property-name');
    const paramdefs = [['parent-property-name', types.XsString, false, true], ['child-property-names', types.XsString, false, true], ['regions', types.CtsRegion, false, true], ['options', types.XsString, false, true], ['weight', types.XsDouble, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.jsonPropertyChildGeospatialQuery', 3, new Set(['parent-property-name', 'child-property-names', 'regions', 'options', 'weight']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.jsonPropertyChildGeospatialQuery', 3, false, paramdefs, args);
    return new types.CtsQuery('cts', 'json-property-child-geospatial-query', checkedArgs);

    }
jsonPropertyGeospatialQuery(...args) {
    const namer = bldrbase.getNamer(args, 'property-name');
    const paramdefs = [['property-name', types.XsString, false, true], ['regions', types.CtsRegion, false, true], ['options', types.XsString, false, true], ['weight', types.XsDouble, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.jsonPropertyGeospatialQuery', 2, new Set(['property-name', 'regions', 'options', 'weight']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.jsonPropertyGeospatialQuery', 2, false, paramdefs, args);
    return new types.CtsQuery('cts', 'json-property-geospatial-query', checkedArgs);

    }
jsonPropertyPairGeospatialQuery(...args) {
    const namer = bldrbase.getNamer(args, 'property-name');
    const paramdefs = [['property-name', types.XsString, false, true], ['latitude-property-names', types.XsString, false, true], ['longitude-property-names', types.XsString, false, true], ['regions', types.CtsRegion, false, true], ['options', types.XsString, false, true], ['weight', types.XsDouble, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.jsonPropertyPairGeospatialQuery', 4, new Set(['property-name', 'latitude-property-names', 'longitude-property-names', 'regions', 'options', 'weight']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.jsonPropertyPairGeospatialQuery', 4, false, paramdefs, args);
    return new types.CtsQuery('cts', 'json-property-pair-geospatial-query', checkedArgs);

    }
jsonPropertyRangeQuery(...args) {
    const namer = bldrbase.getNamer(args, 'property-name');
    const paramdefs = [['property-name', types.XsString, false, true], ['operator', types.XsString, true, false], ['value', types.XsAnyAtomicType, false, true], ['options', types.XsString, false, true], ['weight', types.XsDouble, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.jsonPropertyRangeQuery', 3, new Set(['property-name', 'operator', 'value', 'options', 'weight']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.jsonPropertyRangeQuery', 3, false, paramdefs, args);
    return new types.CtsQuery('cts', 'json-property-range-query', checkedArgs);

    }
jsonPropertyReference(...args) {
    const namer = bldrbase.getNamer(args, 'property');
    const paramdefs = [['property', types.XsString, true, false], ['options', types.XsString, false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.jsonPropertyReference', 1, new Set(['property', 'options']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.jsonPropertyReference', 1, false, paramdefs, args);
    return new types.CtsReference('cts', 'json-property-reference', checkedArgs);

    }
jsonPropertyScopeQuery(...args) {
    const namer = bldrbase.getNamer(args, 'property-name');
    const paramdefs = [['property-name', types.XsString, false, true], ['query', types.CtsQuery, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.jsonPropertyScopeQuery', 2, new Set(['property-name', 'query']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.jsonPropertyScopeQuery', 2, false, paramdefs, args);
    return new types.CtsQuery('cts', 'json-property-scope-query', checkedArgs);

    }
jsonPropertyValueQuery(...args) {
    const namer = bldrbase.getNamer(args, 'property-name');
    const paramdefs = [['property-name', types.XsString, false, true], ['value', types.XsAnyAtomicType, false, true], ['options', types.XsString, false, true], ['weight', types.XsDouble, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.jsonPropertyValueQuery', 2, new Set(['property-name', 'value', 'options', 'weight']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.jsonPropertyValueQuery', 2, false, paramdefs, args);
    return new types.CtsQuery('cts', 'json-property-value-query', checkedArgs);

    }
jsonPropertyWordQuery(...args) {
    const namer = bldrbase.getNamer(args, 'property-name');
    const paramdefs = [['property-name', types.XsString, false, true], ['text', types.XsString, false, true], ['options', types.XsString, false, true], ['weight', types.XsDouble, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.jsonPropertyWordQuery', 2, new Set(['property-name', 'text', 'options', 'weight']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.jsonPropertyWordQuery', 2, false, paramdefs, args);
    return new types.CtsQuery('cts', 'json-property-word-query', checkedArgs);

    }
locksFragmentQuery(...args) {
    const paramdef = ['query', types.CtsQuery, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('cts.locksFragmentQuery', 1, paramdef, args);
    return new types.CtsQuery('cts', 'locks-fragment-query', checkedArgs);
    }
lsqtQuery(...args) {
    const namer = bldrbase.getNamer(args, 'temporal-collection');
    const paramdefs = [['temporal-collection', types.XsString, true, false], ['timestamp', types.XsDateTime, false, false], ['options', types.XsString, false, true], ['weight', types.XsDouble, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.lsqtQuery', 1, new Set(['temporal-collection', 'timestamp', 'options', 'weight']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.lsqtQuery', 1, false, paramdefs, args);
    return new types.CtsQuery('cts', 'lsqt-query', checkedArgs);

    }
nearQuery(...args) {
    const namer = bldrbase.getNamer(args, 'queries');
    const paramdefs = [['queries', types.CtsQuery, false, true], ['distance', types.XsDouble, false, false], ['options', types.XsString, false, true], ['distance-weight', types.XsDouble, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.nearQuery', 1, new Set(['queries', 'distance', 'options', 'distance-weight']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.nearQuery', 1, false, paramdefs, args);
    return new types.CtsQuery('cts', 'near-query', checkedArgs);

    }
notInQuery(...args) {
    const namer = bldrbase.getNamer(args, 'positive-query');
    const paramdefs = [['positive-query', types.CtsQuery, true, false], ['negative-query', types.CtsQuery, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.notInQuery', 2, new Set(['positive-query', 'negative-query']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.notInQuery', 2, false, paramdefs, args);
    return new types.CtsQuery('cts', 'not-in-query', checkedArgs);

    }
notQuery(...args) {
    const paramdef = ['query', types.CtsQuery, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('cts.notQuery', 1, paramdef, args);
    return new types.CtsQuery('cts', 'not-query', checkedArgs);
    }
orQuery(...args) {
    const namer = bldrbase.getNamer(args, 'queries');
    const paramdefs = [['queries', types.CtsQuery, false, true], ['options', types.XsString, false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.orQuery', 1, new Set(['queries', 'options']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.orQuery', 1, false, paramdefs, args);
    return new types.CtsQuery('cts', 'or-query', checkedArgs);

    }
pathGeospatialQuery(...args) {
    const namer = bldrbase.getNamer(args, 'path-expression');
    const paramdefs = [['path-expression', types.XsString, false, true], ['regions', types.CtsRegion, false, true], ['options', types.XsString, false, true], ['weight', types.XsDouble, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.pathGeospatialQuery', 2, new Set(['path-expression', 'regions', 'options', 'weight']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.pathGeospatialQuery', 2, false, paramdefs, args);
    return new types.CtsQuery('cts', 'path-geospatial-query', checkedArgs);

    }
pathRangeQuery(...args) {
    const namer = bldrbase.getNamer(args, 'path-expression');
    const paramdefs = [['path-expression', types.XsString, false, true], ['operator', types.XsString, true, false], ['value', types.XsAnyAtomicType, false, true], ['options', types.XsString, false, true], ['weight', types.XsDouble, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.pathRangeQuery', 3, new Set(['path-expression', 'operator', 'value', 'options', 'weight']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.pathRangeQuery', 3, false, paramdefs, args);
    return new types.CtsQuery('cts', 'path-range-query', checkedArgs);

    }
pathReference(...args) {
    const namer = bldrbase.getNamer(args, 'path-expression');
    const paramdefs = [['path-expression', types.XsString, true, false], ['options', types.XsString, false, true], ['map', types.MapMap, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.pathReference', 1, new Set(['path-expression', 'options', 'map']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.pathReference', 1, false, paramdefs, args);
    return new types.CtsReference('cts', 'path-reference', checkedArgs);

    }
period(...args) {
    const namer = bldrbase.getNamer(args, 'start');
    const paramdefs = [['start', types.XsDateTime, true, false], ['end', types.XsDateTime, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.period', 2, new Set(['start', 'end']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.period', 2, false, paramdefs, args);
    return new types.CtsPeriod('cts', 'period', checkedArgs);

    }
periodCompareQuery(...args) {
    const namer = bldrbase.getNamer(args, 'axis-1');
    const paramdefs = [['axis-1', types.XsString, true, false], ['operator', types.XsString, true, false], ['axis-2', types.XsString, true, false], ['options', types.XsString, false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.periodCompareQuery', 3, new Set(['axis-1', 'operator', 'axis-2', 'options']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.periodCompareQuery', 3, false, paramdefs, args);
    return new types.CtsQuery('cts', 'period-compare-query', checkedArgs);

    }
periodRangeQuery(...args) {
    const namer = bldrbase.getNamer(args, 'axis-name');
    const paramdefs = [['axis-name', types.XsString, false, true], ['operator', types.XsString, true, false], ['period', types.CtsPeriod, false, true], ['options', types.XsString, false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.periodRangeQuery', 2, new Set(['axis-name', 'operator', 'period', 'options']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.periodRangeQuery', 2, false, paramdefs, args);
    return new types.CtsQuery('cts', 'period-range-query', checkedArgs);

    }
point(...args) {
    const namer = bldrbase.getNamer(args, 'latitude');
    const paramdefs = [['latitude', types.XsDouble, true, false], ['longitude', types.XsDouble, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.point', 2, new Set(['latitude', 'longitude']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.point', 2, false, paramdefs, args);
    return new types.CtsPoint('cts', 'point', checkedArgs);

    }
polygon(...args) {
    const paramdef = ['vertices', types.XsAnyAtomicType, false, true];
    const checkedArgs = bldrbase.makeSingleArgs('cts.polygon', 1, paramdef, args);
    return new types.CtsPolygon('cts', 'polygon', checkedArgs);
    }
propertiesFragmentQuery(...args) {
    const paramdef = ['query', types.CtsQuery, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('cts.propertiesFragmentQuery', 1, paramdef, args);
    return new types.CtsQuery('cts', 'properties-fragment-query', checkedArgs);
    }
stem(...args) {
    const namer = bldrbase.getNamer(args, 'text');
    const paramdefs = [['text', types.XsString, true, false], ['language', types.XsString, false, false], ['partOfSpeech', types.XsString, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.stem', 1, new Set(['text', 'language', 'partOfSpeech']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.stem', 1, false, paramdefs, args);
    return new types.XsString('cts', 'stem', checkedArgs);

    }
tokenize(...args) {
    const namer = bldrbase.getNamer(args, 'text');
    const paramdefs = [['text', types.XsString, true, false], ['language', types.XsString, false, false], ['field', types.XsString, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.tokenize', 1, new Set(['text', 'language', 'field']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.tokenize', 1, false, paramdefs, args);
    return new types.XsString('cts', 'tokenize', checkedArgs);

    }
tripleRangeQuery(...args) {
    const namer = bldrbase.getNamer(args, 'subject');
    const paramdefs = [['subject', types.XsAnyAtomicType, false, true], ['predicate', types.XsAnyAtomicType, false, true], ['object', types.XsAnyAtomicType, false, true], ['operator', types.XsString, false, true], ['options', types.XsString, false, true], ['weight', types.XsDouble, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'cts.tripleRangeQuery', 3, new Set(['subject', 'predicate', 'object', 'operator', 'options', 'weight']), paramdefs, args) :
        bldrbase.makePositionalArgs('cts.tripleRangeQuery', 3, false, paramdefs, args);
    return new types.CtsQuery('cts', 'triple-range-query', checkedArgs);

    }
trueQuery(...args) {
    bldrbase.checkMaxArity('cts.trueQuery', args.length, 0);
    return new types.CtsQuery('cts', 'true-query', args);
    }
uriReference(...args) {
    bldrbase.checkMaxArity('cts.uriReference', args.length, 0);
    return new types.CtsReference('cts', 'uri-reference', args);
    }
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
  abs(...args) {
    const paramdef = ['arg', types.XsNumeric, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.abs', 1, paramdef, args);
    return new types.XsNumeric('fn', 'abs', checkedArgs);
    }
adjustDateToTimezone(...args) {
    const namer = bldrbase.getNamer(args, 'arg');
    const paramdefs = [['arg', types.XsDate, false, false], ['timezone', types.XsDayTimeDuration, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.adjustDateToTimezone', 1, new Set(['arg', 'timezone']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.adjustDateToTimezone', 1, false, paramdefs, args);
    return new types.XsDate('fn', 'adjust-date-to-timezone', checkedArgs);

    }
adjustDateTimeToTimezone(...args) {
    const namer = bldrbase.getNamer(args, 'arg');
    const paramdefs = [['arg', types.XsDateTime, false, false], ['timezone', types.XsDayTimeDuration, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.adjustDateTimeToTimezone', 1, new Set(['arg', 'timezone']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.adjustDateTimeToTimezone', 1, false, paramdefs, args);
    return new types.XsDateTime('fn', 'adjust-dateTime-to-timezone', checkedArgs);

    }
adjustTimeToTimezone(...args) {
    const namer = bldrbase.getNamer(args, 'arg');
    const paramdefs = [['arg', types.XsTime, false, false], ['timezone', types.XsDayTimeDuration, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.adjustTimeToTimezone', 1, new Set(['arg', 'timezone']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.adjustTimeToTimezone', 1, false, paramdefs, args);
    return new types.XsTime('fn', 'adjust-time-to-timezone', checkedArgs);

    }
analyzeString(...args) {
    const namer = bldrbase.getNamer(args, 'in');
    const paramdefs = [['in', types.XsString, false, false], ['regex', types.XsString, true, false], ['flags', types.XsString, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.analyzeString', 2, new Set(['in', 'regex', 'flags']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.analyzeString', 2, false, paramdefs, args);
    return new types.ElementNode('fn', 'analyze-string', checkedArgs);

    }
avg(...args) {
    const paramdef = ['arg', types.XsAnyAtomicType, false, true];
    const checkedArgs = bldrbase.makeSingleArgs('fn.avg', 1, paramdef, args);
    return new types.XsAnyAtomicType('fn', 'avg', checkedArgs);
    }
baseUri(...args) {
    const paramdef = ['arg', types.Node, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.baseUri', 1, paramdef, args);
    return new types.XsAnyURI('fn', 'base-uri', checkedArgs);
    }
boolean(...args) {
    const paramdef = ['arg', types.Item, false, true];
    const checkedArgs = bldrbase.makeSingleArgs('fn.boolean', 1, paramdef, args);
    return new types.XsBoolean('fn', 'boolean', checkedArgs);
    }
ceiling(...args) {
    const paramdef = ['arg', types.XsNumeric, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.ceiling', 1, paramdef, args);
    return new types.XsNumeric('fn', 'ceiling', checkedArgs);
    }
codepointEqual(...args) {
    const namer = bldrbase.getNamer(args, 'comparand1');
    const paramdefs = [['comparand1', types.XsString, false, false], ['comparand2', types.XsString, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.codepointEqual', 2, new Set(['comparand1', 'comparand2']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.codepointEqual', 2, false, paramdefs, args);
    return new types.XsBoolean('fn', 'codepoint-equal', checkedArgs);

    }
codepointsToString(...args) {
    const paramdef = ['arg', types.XsInteger, false, true];
    const checkedArgs = bldrbase.makeSingleArgs('fn.codepointsToString', 1, paramdef, args);
    return new types.XsString('fn', 'codepoints-to-string', checkedArgs);
    }
compare(...args) {
    const namer = bldrbase.getNamer(args, 'comparand1');
    const paramdefs = [['comparand1', types.XsString, false, false], ['comparand2', types.XsString, false, false], ['collation', types.XsString, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.compare', 2, new Set(['comparand1', 'comparand2', 'collation']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.compare', 2, false, paramdefs, args);
    return new types.XsInteger('fn', 'compare', checkedArgs);

    }
concat(...args) {
    const namer = bldrbase.getNamer(args, 'parameter1');
    const paramdefs = [['parameter1', types.XsAnyAtomicType, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.concat', 1, new Set(['parameter1']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.concat', 1, true, paramdefs, args);
    return new types.XsString('fn', 'concat', checkedArgs);

    }
contains(...args) {
    const namer = bldrbase.getNamer(args, 'parameter1');
    const paramdefs = [['parameter1', types.XsString, false, false], ['parameter2', types.XsString, false, false], ['collation', types.XsString, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.contains', 2, new Set(['parameter1', 'parameter2', 'collation']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.contains', 2, false, paramdefs, args);
    return new types.XsBoolean('fn', 'contains', checkedArgs);

    }
count(...args) {
    const namer = bldrbase.getNamer(args, 'arg');
    const paramdefs = [['arg', types.Item, false, true], ['maximum', types.XsDouble, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.count', 1, new Set(['arg', 'maximum']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.count', 1, false, paramdefs, args);
    return new types.XsInteger('fn', 'count', checkedArgs);

    }
currentDate(...args) {
    bldrbase.checkMaxArity('fn.currentDate', args.length, 0);
    return new types.XsDate('fn', 'current-date', args);
    }
currentDateTime(...args) {
    bldrbase.checkMaxArity('fn.currentDateTime', args.length, 0);
    return new types.XsDateTime('fn', 'current-dateTime', args);
    }
currentTime(...args) {
    bldrbase.checkMaxArity('fn.currentTime', args.length, 0);
    return new types.XsTime('fn', 'current-time', args);
    }
dayFromDate(...args) {
    const paramdef = ['arg', types.XsDate, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.dayFromDate', 1, paramdef, args);
    return new types.XsInteger('fn', 'day-from-date', checkedArgs);
    }
dayFromDateTime(...args) {
    const paramdef = ['arg', types.XsDateTime, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.dayFromDateTime', 1, paramdef, args);
    return new types.XsInteger('fn', 'day-from-dateTime', checkedArgs);
    }
daysFromDuration(...args) {
    const paramdef = ['arg', types.XsDuration, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.daysFromDuration', 1, paramdef, args);
    return new types.XsInteger('fn', 'days-from-duration', checkedArgs);
    }
deepEqual(...args) {
    const namer = bldrbase.getNamer(args, 'parameter1');
    const paramdefs = [['parameter1', types.Item, false, true], ['parameter2', types.Item, false, true], ['collation', types.XsString, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.deepEqual', 2, new Set(['parameter1', 'parameter2', 'collation']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.deepEqual', 2, false, paramdefs, args);
    return new types.XsBoolean('fn', 'deep-equal', checkedArgs);

    }
defaultCollation(...args) {
    bldrbase.checkMaxArity('fn.defaultCollation', args.length, 0);
    return new types.XsString('fn', 'default-collation', args);
    }
distinctValues(...args) {
    const namer = bldrbase.getNamer(args, 'arg');
    const paramdefs = [['arg', types.XsAnyAtomicType, false, true], ['collation', types.XsString, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.distinctValues', 1, new Set(['arg', 'collation']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.distinctValues', 1, false, paramdefs, args);
    return new types.XsAnyAtomicType('fn', 'distinct-values', checkedArgs);

    }
documentUri(...args) {
    const paramdef = ['arg', types.Node, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.documentUri', 1, paramdef, args);
    return new types.XsAnyURI('fn', 'document-uri', checkedArgs);
    }
empty(...args) {
    const paramdef = ['arg', types.Item, false, true];
    const checkedArgs = bldrbase.makeSingleArgs('fn.empty', 1, paramdef, args);
    return new types.XsBoolean('fn', 'empty', checkedArgs);
    }
encodeForUri(...args) {
    const paramdef = ['uri-part', types.XsString, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.encodeForUri', 1, paramdef, args);
    return new types.XsString('fn', 'encode-for-uri', checkedArgs);
    }
endsWith(...args) {
    const namer = bldrbase.getNamer(args, 'parameter1');
    const paramdefs = [['parameter1', types.XsString, false, false], ['parameter2', types.XsString, false, false], ['collation', types.XsString, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.endsWith', 2, new Set(['parameter1', 'parameter2', 'collation']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.endsWith', 2, false, paramdefs, args);
    return new types.XsBoolean('fn', 'ends-with', checkedArgs);

    }
escapeHtmlUri(...args) {
    const paramdef = ['uri-part', types.XsString, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.escapeHtmlUri', 1, paramdef, args);
    return new types.XsString('fn', 'escape-html-uri', checkedArgs);
    }
exists(...args) {
    const paramdef = ['arg', types.Item, false, true];
    const checkedArgs = bldrbase.makeSingleArgs('fn.exists', 1, paramdef, args);
    return new types.XsBoolean('fn', 'exists', checkedArgs);
    }
false(...args) {
    bldrbase.checkMaxArity('fn.false', args.length, 0);
    return new types.XsBoolean('fn', 'false', args);
    }
floor(...args) {
    const paramdef = ['arg', types.XsNumeric, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.floor', 1, paramdef, args);
    return new types.XsNumeric('fn', 'floor', checkedArgs);
    }
formatDate(...args) {
    const namer = bldrbase.getNamer(args, 'value');
    const paramdefs = [['value', types.XsDate, false, false], ['picture', types.XsString, true, false], ['language', types.XsString, false, false], ['calendar', types.XsString, false, false], ['country', types.XsString, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.formatDate', 2, new Set(['value', 'picture', 'language', 'calendar', 'country']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.formatDate', 2, false, paramdefs, args);
    return new types.XsString('fn', 'format-date', checkedArgs);

    }
formatDateTime(...args) {
    const namer = bldrbase.getNamer(args, 'value');
    const paramdefs = [['value', types.XsDateTime, false, false], ['picture', types.XsString, true, false], ['language', types.XsString, false, false], ['calendar', types.XsString, false, false], ['country', types.XsString, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.formatDateTime', 2, new Set(['value', 'picture', 'language', 'calendar', 'country']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.formatDateTime', 2, false, paramdefs, args);
    return new types.XsString('fn', 'format-dateTime', checkedArgs);

    }
formatNumber(...args) {
    const namer = bldrbase.getNamer(args, 'value');
    const paramdefs = [['value', types.XsNumeric, false, true], ['picture', types.XsString, true, false], ['decimal-format-name', types.XsString, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.formatNumber', 2, new Set(['value', 'picture', 'decimal-format-name']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.formatNumber', 2, false, paramdefs, args);
    return new types.XsString('fn', 'format-number', checkedArgs);

    }
formatTime(...args) {
    const namer = bldrbase.getNamer(args, 'value');
    const paramdefs = [['value', types.XsTime, false, false], ['picture', types.XsString, true, false], ['language', types.XsString, false, false], ['calendar', types.XsString, false, false], ['country', types.XsString, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.formatTime', 2, new Set(['value', 'picture', 'language', 'calendar', 'country']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.formatTime', 2, false, paramdefs, args);
    return new types.XsString('fn', 'format-time', checkedArgs);

    }
generateId(...args) {
    const paramdef = ['node', types.Node, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.generateId', 1, paramdef, args);
    return new types.XsString('fn', 'generate-id', checkedArgs);
    }
head(...args) {
    const paramdef = ['seq', types.Item, false, true];
    const checkedArgs = bldrbase.makeSingleArgs('fn.head', 1, paramdef, args);
    return new types.Item('fn', 'head', checkedArgs);
    }
hoursFromDateTime(...args) {
    const paramdef = ['arg', types.XsDateTime, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.hoursFromDateTime', 1, paramdef, args);
    return new types.XsInteger('fn', 'hours-from-dateTime', checkedArgs);
    }
hoursFromDuration(...args) {
    const paramdef = ['arg', types.XsDuration, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.hoursFromDuration', 1, paramdef, args);
    return new types.XsInteger('fn', 'hours-from-duration', checkedArgs);
    }
hoursFromTime(...args) {
    const paramdef = ['arg', types.XsTime, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.hoursFromTime', 1, paramdef, args);
    return new types.XsInteger('fn', 'hours-from-time', checkedArgs);
    }
implicitTimezone(...args) {
    bldrbase.checkMaxArity('fn.implicitTimezone', args.length, 0);
    return new types.XsDayTimeDuration('fn', 'implicit-timezone', args);
    }
inScopePrefixes(...args) {
    const paramdef = ['element', types.ElementNode, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.inScopePrefixes', 1, paramdef, args);
    return new types.XsString('fn', 'in-scope-prefixes', checkedArgs);
    }
indexOf(...args) {
    const namer = bldrbase.getNamer(args, 'seqParam');
    const paramdefs = [['seqParam', types.XsAnyAtomicType, false, true], ['srchParam', types.XsAnyAtomicType, true, false], ['collationLiteral', types.XsString, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.indexOf', 2, new Set(['seqParam', 'srchParam', 'collationLiteral']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.indexOf', 2, false, paramdefs, args);
    return new types.XsInteger('fn', 'index-of', checkedArgs);

    }
insertBefore(...args) {
    const namer = bldrbase.getNamer(args, 'target');
    const paramdefs = [['target', types.Item, false, true], ['position', types.XsInteger, true, false], ['inserts', types.Item, false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.insertBefore', 3, new Set(['target', 'position', 'inserts']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.insertBefore', 3, false, paramdefs, args);
    return new types.Item('fn', 'insert-before', checkedArgs);

    }
iriToUri(...args) {
    const paramdef = ['uri-part', types.XsString, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.iriToUri', 1, paramdef, args);
    return new types.XsString('fn', 'iri-to-uri', checkedArgs);
    }
lang(...args) {
    const namer = bldrbase.getNamer(args, 'testlang');
    const paramdefs = [['testlang', types.XsString, false, false], ['node', types.Node, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.lang', 2, new Set(['testlang', 'node']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.lang', 2, false, paramdefs, args);
    return new types.XsBoolean('fn', 'lang', checkedArgs);

    }
localName(...args) {
    const paramdef = ['arg', types.Node, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.localName', 1, paramdef, args);
    return new types.XsString('fn', 'local-name', checkedArgs);
    }
localNameFromQName(...args) {
    const paramdef = ['arg', types.XsQName, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.localNameFromQName', 1, paramdef, args);
    return new types.XsNCName('fn', 'local-name-from-QName', checkedArgs);
    }
lowerCase(...args) {
    const paramdef = ['string', types.XsString, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.lowerCase', 1, paramdef, args);
    return new types.XsString('fn', 'lower-case', checkedArgs);
    }
matches(...args) {
    const namer = bldrbase.getNamer(args, 'input');
    const paramdefs = [['input', types.XsString, false, false], ['pattern', types.XsString, true, false], ['flags', types.XsString, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.matches', 2, new Set(['input', 'pattern', 'flags']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.matches', 2, false, paramdefs, args);
    return new types.XsBoolean('fn', 'matches', checkedArgs);

    }
max(...args) {
    const namer = bldrbase.getNamer(args, 'arg');
    const paramdefs = [['arg', types.XsAnyAtomicType, false, true], ['collation', types.XsString, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.max', 1, new Set(['arg', 'collation']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.max', 1, false, paramdefs, args);
    return new types.XsAnyAtomicType('fn', 'max', checkedArgs);

    }
min(...args) {
    const namer = bldrbase.getNamer(args, 'arg');
    const paramdefs = [['arg', types.XsAnyAtomicType, false, true], ['collation', types.XsString, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.min', 1, new Set(['arg', 'collation']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.min', 1, false, paramdefs, args);
    return new types.XsAnyAtomicType('fn', 'min', checkedArgs);

    }
minutesFromDateTime(...args) {
    const paramdef = ['arg', types.XsDateTime, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.minutesFromDateTime', 1, paramdef, args);
    return new types.XsInteger('fn', 'minutes-from-dateTime', checkedArgs);
    }
minutesFromDuration(...args) {
    const paramdef = ['arg', types.XsDuration, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.minutesFromDuration', 1, paramdef, args);
    return new types.XsInteger('fn', 'minutes-from-duration', checkedArgs);
    }
minutesFromTime(...args) {
    const paramdef = ['arg', types.XsTime, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.minutesFromTime', 1, paramdef, args);
    return new types.XsInteger('fn', 'minutes-from-time', checkedArgs);
    }
monthFromDate(...args) {
    const paramdef = ['arg', types.XsDate, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.monthFromDate', 1, paramdef, args);
    return new types.XsInteger('fn', 'month-from-date', checkedArgs);
    }
monthFromDateTime(...args) {
    const paramdef = ['arg', types.XsDateTime, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.monthFromDateTime', 1, paramdef, args);
    return new types.XsInteger('fn', 'month-from-dateTime', checkedArgs);
    }
monthsFromDuration(...args) {
    const paramdef = ['arg', types.XsDuration, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.monthsFromDuration', 1, paramdef, args);
    return new types.XsInteger('fn', 'months-from-duration', checkedArgs);
    }
name(...args) {
    const paramdef = ['arg', types.Node, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.name', 1, paramdef, args);
    return new types.XsString('fn', 'name', checkedArgs);
    }
namespaceUri(...args) {
    const paramdef = ['arg', types.Node, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.namespaceUri', 1, paramdef, args);
    return new types.XsAnyURI('fn', 'namespace-uri', checkedArgs);
    }
namespaceUriForPrefix(...args) {
    const namer = bldrbase.getNamer(args, 'prefix');
    const paramdefs = [['prefix', types.XsString, false, false], ['element', types.ElementNode, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.namespaceUriForPrefix', 2, new Set(['prefix', 'element']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.namespaceUriForPrefix', 2, false, paramdefs, args);
    return new types.XsAnyURI('fn', 'namespace-uri-for-prefix', checkedArgs);

    }
namespaceUriFromQName(...args) {
    const paramdef = ['arg', types.XsQName, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.namespaceUriFromQName', 1, paramdef, args);
    return new types.XsAnyURI('fn', 'namespace-uri-from-QName', checkedArgs);
    }
nilled(...args) {
    const paramdef = ['arg', types.Node, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.nilled', 1, paramdef, args);
    return new types.XsBoolean('fn', 'nilled', checkedArgs);
    }
nodeName(...args) {
    const paramdef = ['arg', types.Node, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.nodeName', 1, paramdef, args);
    return new types.XsQName('fn', 'node-name', checkedArgs);
    }
normalizeSpace(...args) {
    const paramdef = ['input', types.XsString, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.normalizeSpace', 1, paramdef, args);
    return new types.XsString('fn', 'normalize-space', checkedArgs);
    }
normalizeUnicode(...args) {
    const namer = bldrbase.getNamer(args, 'arg');
    const paramdefs = [['arg', types.XsString, false, false], ['normalizationForm', types.XsString, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.normalizeUnicode', 1, new Set(['arg', 'normalizationForm']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.normalizeUnicode', 1, false, paramdefs, args);
    return new types.XsString('fn', 'normalize-unicode', checkedArgs);

    }
not(...args) {
    const paramdef = ['arg', types.Item, false, true];
    const checkedArgs = bldrbase.makeSingleArgs('fn.not', 1, paramdef, args);
    return new types.XsBoolean('fn', 'not', checkedArgs);
    }
number(...args) {
    const paramdef = ['arg', types.XsAnyAtomicType, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.number', 1, paramdef, args);
    return new types.XsDouble('fn', 'number', checkedArgs);
    }
prefixFromQName(...args) {
    const paramdef = ['arg', types.XsQName, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.prefixFromQName', 1, paramdef, args);
    return new types.XsNCName('fn', 'prefix-from-QName', checkedArgs);
    }
QName(...args) {
    const namer = bldrbase.getNamer(args, 'paramURI');
    const paramdefs = [['paramURI', types.XsString, false, false], ['paramQName', types.XsString, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.QName', 2, new Set(['paramURI', 'paramQName']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.QName', 2, false, paramdefs, args);
    return new types.XsQName('fn', 'QName', checkedArgs);

    }
remove(...args) {
    const namer = bldrbase.getNamer(args, 'target');
    const paramdefs = [['target', types.Item, false, true], ['position', types.XsInteger, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.remove', 2, new Set(['target', 'position']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.remove', 2, false, paramdefs, args);
    return new types.Item('fn', 'remove', checkedArgs);

    }
replace(...args) {
    const namer = bldrbase.getNamer(args, 'input');
    const paramdefs = [['input', types.XsString, false, false], ['pattern', types.XsString, true, false], ['replacement', types.XsString, true, false], ['flags', types.XsString, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.replace', 3, new Set(['input', 'pattern', 'replacement', 'flags']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.replace', 3, false, paramdefs, args);
    return new types.XsString('fn', 'replace', checkedArgs);

    }
resolveQName(...args) {
    const namer = bldrbase.getNamer(args, 'qname');
    const paramdefs = [['qname', types.XsString, false, false], ['element', types.ElementNode, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.resolveQName', 2, new Set(['qname', 'element']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.resolveQName', 2, false, paramdefs, args);
    return new types.XsQName('fn', 'resolve-QName', checkedArgs);

    }
resolveUri(...args) {
    const namer = bldrbase.getNamer(args, 'relative');
    const paramdefs = [['relative', types.XsString, false, false], ['base', types.XsString, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.resolveUri', 2, new Set(['relative', 'base']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.resolveUri', 2, false, paramdefs, args);
    return new types.XsAnyURI('fn', 'resolve-uri', checkedArgs);

    }
reverse(...args) {
    const paramdef = ['target', types.Item, false, true];
    const checkedArgs = bldrbase.makeSingleArgs('fn.reverse', 1, paramdef, args);
    return new types.Item('fn', 'reverse', checkedArgs);
    }
root(...args) {
    const paramdef = ['arg', types.Node, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.root', 1, paramdef, args);
    return new types.Node('fn', 'root', checkedArgs);
    }
round(...args) {
    const paramdef = ['arg', types.XsNumeric, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.round', 1, paramdef, args);
    return new types.XsNumeric('fn', 'round', checkedArgs);
    }
roundHalfToEven(...args) {
    const namer = bldrbase.getNamer(args, 'arg');
    const paramdefs = [['arg', types.XsNumeric, false, false], ['precision', types.XsInteger, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.roundHalfToEven', 1, new Set(['arg', 'precision']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.roundHalfToEven', 1, false, paramdefs, args);
    return new types.XsNumeric('fn', 'round-half-to-even', checkedArgs);

    }
secondsFromDateTime(...args) {
    const paramdef = ['arg', types.XsDateTime, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.secondsFromDateTime', 1, paramdef, args);
    return new types.XsDecimal('fn', 'seconds-from-dateTime', checkedArgs);
    }
secondsFromDuration(...args) {
    const paramdef = ['arg', types.XsDuration, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.secondsFromDuration', 1, paramdef, args);
    return new types.XsDecimal('fn', 'seconds-from-duration', checkedArgs);
    }
secondsFromTime(...args) {
    const paramdef = ['arg', types.XsTime, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.secondsFromTime', 1, paramdef, args);
    return new types.XsDecimal('fn', 'seconds-from-time', checkedArgs);
    }
startsWith(...args) {
    const namer = bldrbase.getNamer(args, 'parameter1');
    const paramdefs = [['parameter1', types.XsString, false, false], ['parameter2', types.XsString, false, false], ['collation', types.XsString, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.startsWith', 2, new Set(['parameter1', 'parameter2', 'collation']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.startsWith', 2, false, paramdefs, args);
    return new types.XsBoolean('fn', 'starts-with', checkedArgs);

    }
string(...args) {
    const paramdef = ['arg', types.Item, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.string', 1, paramdef, args);
    return new types.XsString('fn', 'string', checkedArgs);
    }
stringJoin(...args) {
    const namer = bldrbase.getNamer(args, 'parameter1');
    const paramdefs = [['parameter1', types.XsString, false, true], ['parameter2', types.XsString, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.stringJoin', 2, new Set(['parameter1', 'parameter2']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.stringJoin', 2, false, paramdefs, args);
    return new types.XsString('fn', 'string-join', checkedArgs);

    }
stringLength(...args) {
    const paramdef = ['sourceString', types.XsString, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.stringLength', 1, paramdef, args);
    return new types.XsInteger('fn', 'string-length', checkedArgs);
    }
stringToCodepoints(...args) {
    const paramdef = ['arg', types.XsString, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.stringToCodepoints', 1, paramdef, args);
    return new types.XsInteger('fn', 'string-to-codepoints', checkedArgs);
    }
subsequence(...args) {
    const namer = bldrbase.getNamer(args, 'sourceSeq');
    const paramdefs = [['sourceSeq', types.Item, false, true], ['startingLoc', types.XsNumeric, true, false], ['length', types.XsNumeric, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.subsequence', 2, new Set(['sourceSeq', 'startingLoc', 'length']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.subsequence', 2, false, paramdefs, args);
    return new types.Item('fn', 'subsequence', checkedArgs);

    }
substring(...args) {
    const namer = bldrbase.getNamer(args, 'sourceString');
    const paramdefs = [['sourceString', types.XsString, false, false], ['startingLoc', types.XsNumeric, true, false], ['length', types.XsNumeric, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.substring', 2, new Set(['sourceString', 'startingLoc', 'length']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.substring', 2, false, paramdefs, args);
    return new types.XsString('fn', 'substring', checkedArgs);

    }
substringAfter(...args) {
    const namer = bldrbase.getNamer(args, 'input');
    const paramdefs = [['input', types.XsString, false, false], ['after', types.XsString, false, false], ['collation', types.XsString, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.substringAfter', 2, new Set(['input', 'after', 'collation']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.substringAfter', 2, false, paramdefs, args);
    return new types.XsString('fn', 'substring-after', checkedArgs);

    }
substringBefore(...args) {
    const namer = bldrbase.getNamer(args, 'input');
    const paramdefs = [['input', types.XsString, false, false], ['before', types.XsString, false, false], ['collation', types.XsString, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.substringBefore', 2, new Set(['input', 'before', 'collation']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.substringBefore', 2, false, paramdefs, args);
    return new types.XsString('fn', 'substring-before', checkedArgs);

    }
sum(...args) {
    const namer = bldrbase.getNamer(args, 'arg');
    const paramdefs = [['arg', types.XsAnyAtomicType, false, true], ['zero', types.XsAnyAtomicType, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.sum', 1, new Set(['arg', 'zero']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.sum', 1, false, paramdefs, args);
    return new types.XsAnyAtomicType('fn', 'sum', checkedArgs);

    }
tail(...args) {
    const paramdef = ['seq', types.Item, false, true];
    const checkedArgs = bldrbase.makeSingleArgs('fn.tail', 1, paramdef, args);
    return new types.Item('fn', 'tail', checkedArgs);
    }
timezoneFromDate(...args) {
    const paramdef = ['arg', types.XsDate, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.timezoneFromDate', 1, paramdef, args);
    return new types.XsDayTimeDuration('fn', 'timezone-from-date', checkedArgs);
    }
timezoneFromDateTime(...args) {
    const paramdef = ['arg', types.XsDateTime, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.timezoneFromDateTime', 1, paramdef, args);
    return new types.XsDayTimeDuration('fn', 'timezone-from-dateTime', checkedArgs);
    }
timezoneFromTime(...args) {
    const paramdef = ['arg', types.XsTime, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.timezoneFromTime', 1, paramdef, args);
    return new types.XsDayTimeDuration('fn', 'timezone-from-time', checkedArgs);
    }
tokenize(...args) {
    const namer = bldrbase.getNamer(args, 'input');
    const paramdefs = [['input', types.XsString, false, false], ['pattern', types.XsString, true, false], ['flags', types.XsString, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.tokenize', 2, new Set(['input', 'pattern', 'flags']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.tokenize', 2, false, paramdefs, args);
    return new types.XsString('fn', 'tokenize', checkedArgs);

    }
translate(...args) {
    const namer = bldrbase.getNamer(args, 'src');
    const paramdefs = [['src', types.XsString, false, false], ['mapString', types.XsString, true, false], ['transString', types.XsString, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'fn.translate', 3, new Set(['src', 'mapString', 'transString']), paramdefs, args) :
        bldrbase.makePositionalArgs('fn.translate', 3, false, paramdefs, args);
    return new types.XsString('fn', 'translate', checkedArgs);

    }
true(...args) {
    bldrbase.checkMaxArity('fn.true', args.length, 0);
    return new types.XsBoolean('fn', 'true', args);
    }
unordered(...args) {
    const paramdef = ['sourceSeq', types.Item, false, true];
    const checkedArgs = bldrbase.makeSingleArgs('fn.unordered', 1, paramdef, args);
    return new types.Item('fn', 'unordered', checkedArgs);
    }
upperCase(...args) {
    const paramdef = ['string', types.XsString, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.upperCase', 1, paramdef, args);
    return new types.XsString('fn', 'upper-case', checkedArgs);
    }
yearFromDate(...args) {
    const paramdef = ['arg', types.XsDate, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.yearFromDate', 1, paramdef, args);
    return new types.XsInteger('fn', 'year-from-date', checkedArgs);
    }
yearFromDateTime(...args) {
    const paramdef = ['arg', types.XsDateTime, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.yearFromDateTime', 1, paramdef, args);
    return new types.XsInteger('fn', 'year-from-dateTime', checkedArgs);
    }
yearsFromDuration(...args) {
    const paramdef = ['arg', types.XsDuration, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('fn.yearsFromDuration', 1, paramdef, args);
    return new types.XsInteger('fn', 'years-from-duration', checkedArgs);
    }
}
class JsonExpr {
  constructor() {
  }
  array(...args) {
    const paramdef = ['array', types.ElementNode, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('json.array', 0, paramdef, args);
    return new types.JsonArray('json', 'array', checkedArgs);
    }
arraySize(...args) {
    const paramdef = ['array', types.JsonArray, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('json.arraySize', 1, paramdef, args);
    return new types.XsUnsignedLong('json', 'array-size', checkedArgs);
    }
arrayValues(...args) {
    const namer = bldrbase.getNamer(args, 'array');
    const paramdefs = [['array', types.JsonArray, true, false], ['flatten', types.XsBoolean, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'json.arrayValues', 1, new Set(['array', 'flatten']), paramdefs, args) :
        bldrbase.makePositionalArgs('json.arrayValues', 1, false, paramdefs, args);
    return new types.Item('json', 'array-values', checkedArgs);

    }
object(...args) {
    const paramdef = ['map', types.ElementNode, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('json.object', 0, paramdef, args);
    return new types.JsonObject('json', 'object', checkedArgs);
    }
objectDefine(...args) {
    const paramdef = ['keys', types.XsString, false, true];
    const checkedArgs = bldrbase.makeSingleArgs('json.objectDefine', 0, paramdef, args);
    return new types.JsonObject('json', 'object-define', checkedArgs);
    }
subarray(...args) {
    const namer = bldrbase.getNamer(args, 'array');
    const paramdefs = [['array', types.JsonArray, true, false], ['startingLoc', types.XsNumeric, true, false], ['length', types.XsNumeric, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'json.subarray', 2, new Set(['array', 'startingLoc', 'length']), paramdefs, args) :
        bldrbase.makePositionalArgs('json.subarray', 2, false, paramdefs, args);
    return new types.JsonArray('json', 'subarray', checkedArgs);

    }
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
  contains(...args) {
    const namer = bldrbase.getNamer(args, 'map');
    const paramdefs = [['map', types.MapMap, true, false], ['key', types.XsString, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'map.contains', 2, new Set(['map', 'key']), paramdefs, args) :
        bldrbase.makePositionalArgs('map.contains', 2, false, paramdefs, args);
    return new types.XsBoolean('map', 'contains', checkedArgs);

    }
count(...args) {
    const paramdef = ['map', types.MapMap, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('map.count', 1, paramdef, args);
    return new types.XsUnsignedInt('map', 'count', checkedArgs);
    }
entry(...args) {
    const namer = bldrbase.getNamer(args, 'key');
    const paramdefs = [['key', types.XsString, true, false], ['value', types.Item, false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'map.entry', 2, new Set(['key', 'value']), paramdefs, args) :
        bldrbase.makePositionalArgs('map.entry', 2, false, paramdefs, args);
    return new types.MapMap('map', 'entry', checkedArgs);

    }
get(...args) {
    const namer = bldrbase.getNamer(args, 'map');
    const paramdefs = [['map', types.MapMap, true, false], ['key', types.XsString, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'map.get', 2, new Set(['map', 'key']), paramdefs, args) :
        bldrbase.makePositionalArgs('map.get', 2, false, paramdefs, args);
    return new types.Item('map', 'get', checkedArgs);

    }
keys(...args) {
    const paramdef = ['map', types.MapMap, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('map.keys', 1, paramdef, args);
    return new types.XsString('map', 'keys', checkedArgs);
    }
map(...args) {
    const paramdef = ['map', types.ElementNode, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('map.map', 0, paramdef, args);
    return new types.MapMap('map', 'map', checkedArgs);
    }
}
class MathExpr {
  constructor() {
  }
  acos(...args) {
    const paramdef = ['x', types.XsDouble, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('math.acos', 1, paramdef, args);
    return new types.XsDouble('math', 'acos', checkedArgs);
    }
asin(...args) {
    const paramdef = ['x', types.XsDouble, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('math.asin', 1, paramdef, args);
    return new types.XsDouble('math', 'asin', checkedArgs);
    }
atan(...args) {
    const paramdef = ['x', types.XsDouble, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('math.atan', 1, paramdef, args);
    return new types.XsDouble('math', 'atan', checkedArgs);
    }
atan2(...args) {
    const namer = bldrbase.getNamer(args, 'y');
    const paramdefs = [['y', types.XsDouble, true, false], ['x', types.XsDouble, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'math.atan2', 2, new Set(['y', 'x']), paramdefs, args) :
        bldrbase.makePositionalArgs('math.atan2', 2, false, paramdefs, args);
    return new types.XsDouble('math', 'atan2', checkedArgs);

    }
ceil(...args) {
    const paramdef = ['x', types.XsDouble, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('math.ceil', 1, paramdef, args);
    return new types.XsDouble('math', 'ceil', checkedArgs);
    }
correlation(...args) {
    const paramdef = ['arg', types.JsonArray, false, true];
    const checkedArgs = bldrbase.makeSingleArgs('math.correlation', 1, paramdef, args);
    return new types.XsDouble('math', 'correlation', checkedArgs);
    }
cos(...args) {
    const paramdef = ['x', types.XsDouble, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('math.cos', 1, paramdef, args);
    return new types.XsDouble('math', 'cos', checkedArgs);
    }
cosh(...args) {
    const paramdef = ['x', types.XsDouble, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('math.cosh', 1, paramdef, args);
    return new types.XsDouble('math', 'cosh', checkedArgs);
    }
cot(...args) {
    const paramdef = ['x', types.XsDouble, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('math.cot', 1, paramdef, args);
    return new types.XsDouble('math', 'cot', checkedArgs);
    }
covariance(...args) {
    const paramdef = ['arg', types.JsonArray, false, true];
    const checkedArgs = bldrbase.makeSingleArgs('math.covariance', 1, paramdef, args);
    return new types.XsDouble('math', 'covariance', checkedArgs);
    }
covarianceP(...args) {
    const paramdef = ['arg', types.JsonArray, false, true];
    const checkedArgs = bldrbase.makeSingleArgs('math.covarianceP', 1, paramdef, args);
    return new types.XsDouble('math', 'covariance-p', checkedArgs);
    }
degrees(...args) {
    const paramdef = ['x', types.XsDouble, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('math.degrees', 1, paramdef, args);
    return new types.XsDouble('math', 'degrees', checkedArgs);
    }
exp(...args) {
    const paramdef = ['x', types.XsDouble, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('math.exp', 1, paramdef, args);
    return new types.XsDouble('math', 'exp', checkedArgs);
    }
fabs(...args) {
    const paramdef = ['x', types.XsDouble, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('math.fabs', 1, paramdef, args);
    return new types.XsDouble('math', 'fabs', checkedArgs);
    }
floor(...args) {
    const paramdef = ['x', types.XsDouble, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('math.floor', 1, paramdef, args);
    return new types.XsDouble('math', 'floor', checkedArgs);
    }
fmod(...args) {
    const namer = bldrbase.getNamer(args, 'x');
    const paramdefs = [['x', types.XsDouble, true, false], ['y', types.XsDouble, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'math.fmod', 2, new Set(['x', 'y']), paramdefs, args) :
        bldrbase.makePositionalArgs('math.fmod', 2, false, paramdefs, args);
    return new types.XsDouble('math', 'fmod', checkedArgs);

    }
frexp(...args) {
    const paramdef = ['x', types.XsDouble, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('math.frexp', 1, paramdef, args);
    return new types.Item('math', 'frexp', checkedArgs);
    }
ldexp(...args) {
    const namer = bldrbase.getNamer(args, 'y');
    const paramdefs = [['y', types.XsDouble, true, false], ['i', types.XsInteger, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'math.ldexp', 2, new Set(['y', 'i']), paramdefs, args) :
        bldrbase.makePositionalArgs('math.ldexp', 2, false, paramdefs, args);
    return new types.XsDouble('math', 'ldexp', checkedArgs);

    }
linearModel(...args) {
    const paramdef = ['arg', types.JsonArray, false, true];
    const checkedArgs = bldrbase.makeSingleArgs('math.linearModel', 1, paramdef, args);
    return new types.MathLinearModel('math', 'linear-model', checkedArgs);
    }
linearModelCoeff(...args) {
    const paramdef = ['linear-model', types.MathLinearModel, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('math.linearModelCoeff', 1, paramdef, args);
    return new types.XsDouble('math', 'linear-model-coeff', checkedArgs);
    }
linearModelIntercept(...args) {
    const paramdef = ['linear-model', types.MathLinearModel, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('math.linearModelIntercept', 1, paramdef, args);
    return new types.XsDouble('math', 'linear-model-intercept', checkedArgs);
    }
linearModelRsquared(...args) {
    const paramdef = ['linear-model', types.MathLinearModel, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('math.linearModelRsquared', 1, paramdef, args);
    return new types.XsDouble('math', 'linear-model-rsquared', checkedArgs);
    }
log(...args) {
    const paramdef = ['x', types.XsDouble, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('math.log', 1, paramdef, args);
    return new types.XsDouble('math', 'log', checkedArgs);
    }
log10(...args) {
    const paramdef = ['x', types.XsDouble, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('math.log10', 1, paramdef, args);
    return new types.XsDouble('math', 'log10', checkedArgs);
    }
median(...args) {
    const paramdef = ['arg', types.XsDouble, false, true];
    const checkedArgs = bldrbase.makeSingleArgs('math.median', 1, paramdef, args);
    return new types.XsDouble('math', 'median', checkedArgs);
    }
mode(...args) {
    const namer = bldrbase.getNamer(args, 'arg');
    const paramdefs = [['arg', types.XsAnyAtomicType, false, true], ['options', types.XsString, false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'math.mode', 1, new Set(['arg', 'options']), paramdefs, args) :
        bldrbase.makePositionalArgs('math.mode', 1, false, paramdefs, args);
    return new types.XsAnyAtomicType('math', 'mode', checkedArgs);

    }
modf(...args) {
    const paramdef = ['x', types.XsDouble, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('math.modf', 1, paramdef, args);
    return new types.XsDouble('math', 'modf', checkedArgs);
    }
percentRank(...args) {
    const namer = bldrbase.getNamer(args, 'arg');
    const paramdefs = [['arg', types.XsAnyAtomicType, false, true], ['value', types.XsAnyAtomicType, true, false], ['options', types.XsString, false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'math.percentRank', 2, new Set(['arg', 'value', 'options']), paramdefs, args) :
        bldrbase.makePositionalArgs('math.percentRank', 2, false, paramdefs, args);
    return new types.XsDouble('math', 'percent-rank', checkedArgs);

    }
percentile(...args) {
    const namer = bldrbase.getNamer(args, 'arg');
    const paramdefs = [['arg', types.XsDouble, false, true], ['p', types.XsDouble, false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'math.percentile', 2, new Set(['arg', 'p']), paramdefs, args) :
        bldrbase.makePositionalArgs('math.percentile', 2, false, paramdefs, args);
    return new types.XsDouble('math', 'percentile', checkedArgs);

    }
pi(...args) {
    bldrbase.checkMaxArity('math.pi', args.length, 0);
    return new types.XsDouble('math', 'pi', args);
    }
pow(...args) {
    const namer = bldrbase.getNamer(args, 'x');
    const paramdefs = [['x', types.XsDouble, true, false], ['y', types.XsDouble, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'math.pow', 2, new Set(['x', 'y']), paramdefs, args) :
        bldrbase.makePositionalArgs('math.pow', 2, false, paramdefs, args);
    return new types.XsDouble('math', 'pow', checkedArgs);

    }
radians(...args) {
    const paramdef = ['x', types.XsDouble, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('math.radians', 1, paramdef, args);
    return new types.XsDouble('math', 'radians', checkedArgs);
    }
rank(...args) {
    const namer = bldrbase.getNamer(args, 'arg1');
    const paramdefs = [['arg1', types.XsAnyAtomicType, false, true], ['arg2', types.XsAnyAtomicType, true, false], ['options', types.XsString, false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'math.rank', 2, new Set(['arg1', 'arg2', 'options']), paramdefs, args) :
        bldrbase.makePositionalArgs('math.rank', 2, false, paramdefs, args);
    return new types.XsInteger('math', 'rank', checkedArgs);

    }
sin(...args) {
    const paramdef = ['x', types.XsDouble, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('math.sin', 1, paramdef, args);
    return new types.XsDouble('math', 'sin', checkedArgs);
    }
sinh(...args) {
    const paramdef = ['x', types.XsDouble, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('math.sinh', 1, paramdef, args);
    return new types.XsDouble('math', 'sinh', checkedArgs);
    }
sqrt(...args) {
    const paramdef = ['x', types.XsDouble, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('math.sqrt', 1, paramdef, args);
    return new types.XsDouble('math', 'sqrt', checkedArgs);
    }
stddev(...args) {
    const paramdef = ['arg', types.XsDouble, false, true];
    const checkedArgs = bldrbase.makeSingleArgs('math.stddev', 1, paramdef, args);
    return new types.XsDouble('math', 'stddev', checkedArgs);
    }
stddevP(...args) {
    const paramdef = ['arg', types.XsDouble, false, true];
    const checkedArgs = bldrbase.makeSingleArgs('math.stddevP', 1, paramdef, args);
    return new types.XsDouble('math', 'stddev-p', checkedArgs);
    }
tan(...args) {
    const paramdef = ['x', types.XsDouble, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('math.tan', 1, paramdef, args);
    return new types.XsDouble('math', 'tan', checkedArgs);
    }
tanh(...args) {
    const paramdef = ['x', types.XsDouble, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('math.tanh', 1, paramdef, args);
    return new types.XsDouble('math', 'tanh', checkedArgs);
    }
trunc(...args) {
    const namer = bldrbase.getNamer(args, 'arg');
    const paramdefs = [['arg', types.XsNumeric, false, false], ['n', types.XsInteger, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'math.trunc', 1, new Set(['arg', 'n']), paramdefs, args) :
        bldrbase.makePositionalArgs('math.trunc', 1, false, paramdefs, args);
    return new types.XsNumeric('math', 'trunc', checkedArgs);

    }
variance(...args) {
    const paramdef = ['arg', types.XsDouble, false, true];
    const checkedArgs = bldrbase.makeSingleArgs('math.variance', 1, paramdef, args);
    return new types.XsDouble('math', 'variance', checkedArgs);
    }
varianceP(...args) {
    const paramdef = ['arg', types.XsDouble, false, true];
    const checkedArgs = bldrbase.makeSingleArgs('math.varianceP', 1, paramdef, args);
    return new types.XsDouble('math', 'variance-p', checkedArgs);
    }
}
class RdfExpr {
  constructor() {
  }
  langString(...args) {
    const namer = bldrbase.getNamer(args, 'string');
    const paramdefs = [['string', types.XsString, true, false], ['lang', types.XsString, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'rdf.langString', 2, new Set(['string', 'lang']), paramdefs, args) :
        bldrbase.makePositionalArgs('rdf.langString', 2, false, paramdefs, args);
    return new types.RdfLangString('rdf', 'langString', checkedArgs);

    }
langStringLanguage(...args) {
    const paramdef = ['val', types.RdfLangString, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('rdf.langStringLanguage', 1, paramdef, args);
    return new types.XsString('rdf', 'langString-language', checkedArgs);
    }
}
class SemExpr {
  constructor() {
  }
  bnode(...args) {
    const paramdef = ['value', types.XsAnyAtomicType, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('sem.bnode', 0, paramdef, args);
    return new types.SemBlank('sem', 'bnode', checkedArgs);
    }
coalesce(...args) {
    const namer = bldrbase.getNamer(args, 'parameter1');
    const paramdefs = [['parameter1', types.Item, false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'sem.coalesce', 1, new Set(['parameter1']), paramdefs, args) :
        bldrbase.makePositionalArgs('sem.coalesce', 1, true, paramdefs, args);
    return new types.Item('sem', 'coalesce', checkedArgs);

    }
datatype(...args) {
    const paramdef = ['value', types.XsAnyAtomicType, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('sem.datatype', 1, paramdef, args);
    return new types.SemIri('sem', 'datatype', checkedArgs);
    }
if(...args) {
    const namer = bldrbase.getNamer(args, 'condition');
    const paramdefs = [['condition', types.XsBoolean, true, false], ['then', types.Item, false, true], ['else', types.Item, false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'sem.if', 3, new Set(['condition', 'then', 'else']), paramdefs, args) :
        bldrbase.makePositionalArgs('sem.if', 3, false, paramdefs, args);
    return new types.Item('sem', 'if', checkedArgs);

    }
invalid(...args) {
    const namer = bldrbase.getNamer(args, 'string');
    const paramdefs = [['string', types.XsString, true, false], ['datatype', types.SemIri, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'sem.invalid', 2, new Set(['string', 'datatype']), paramdefs, args) :
        bldrbase.makePositionalArgs('sem.invalid', 2, false, paramdefs, args);
    return new types.SemInvalid('sem', 'invalid', checkedArgs);

    }
invalidDatatype(...args) {
    const paramdef = ['val', types.SemInvalid, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('sem.invalidDatatype', 1, paramdef, args);
    return new types.SemIri('sem', 'invalid-datatype', checkedArgs);
    }
iri(...args) {
    const paramdef = ['string-iri', types.XsAnyAtomicType, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('sem.iri', 1, paramdef, args);
    return new types.SemIri('sem', 'iri', checkedArgs);
    }
iriToQName(...args) {
    const paramdef = ['arg1', types.XsString, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('sem.iriToQName', 1, paramdef, args);
    return new types.XsQName('sem', 'iri-to-QName', checkedArgs);
    }
isBlank(...args) {
    const paramdef = ['value', types.XsAnyAtomicType, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('sem.isBlank', 1, paramdef, args);
    return new types.XsBoolean('sem', 'isBlank', checkedArgs);
    }
isIRI(...args) {
    const paramdef = ['value', types.XsAnyAtomicType, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('sem.isIRI', 1, paramdef, args);
    return new types.XsBoolean('sem', 'isIRI', checkedArgs);
    }
isLiteral(...args) {
    const paramdef = ['value', types.XsAnyAtomicType, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('sem.isLiteral', 1, paramdef, args);
    return new types.XsBoolean('sem', 'isLiteral', checkedArgs);
    }
isNumeric(...args) {
    const paramdef = ['value', types.XsAnyAtomicType, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('sem.isNumeric', 1, paramdef, args);
    return new types.XsBoolean('sem', 'isNumeric', checkedArgs);
    }
lang(...args) {
    const paramdef = ['value', types.XsAnyAtomicType, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('sem.lang', 1, paramdef, args);
    return new types.XsString('sem', 'lang', checkedArgs);
    }
langMatches(...args) {
    const namer = bldrbase.getNamer(args, 'lang-tag');
    const paramdefs = [['lang-tag', types.XsString, true, false], ['lang-range', types.XsString, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'sem.langMatches', 2, new Set(['lang-tag', 'lang-range']), paramdefs, args) :
        bldrbase.makePositionalArgs('sem.langMatches', 2, false, paramdefs, args);
    return new types.XsBoolean('sem', 'langMatches', checkedArgs);

    }
QNameToIri(...args) {
    const paramdef = ['arg1', types.XsQName, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('sem.QNameToIri', 1, paramdef, args);
    return new types.SemIri('sem', 'QName-to-iri', checkedArgs);
    }
random(...args) {
    bldrbase.checkMaxArity('sem.random', args.length, 0);
    return new types.XsDouble('sem', 'random', args);
    }
sameTerm(...args) {
    const namer = bldrbase.getNamer(args, 'a');
    const paramdefs = [['a', types.XsAnyAtomicType, true, false], ['b', types.XsAnyAtomicType, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'sem.sameTerm', 2, new Set(['a', 'b']), paramdefs, args) :
        bldrbase.makePositionalArgs('sem.sameTerm', 2, false, paramdefs, args);
    return new types.XsBoolean('sem', 'sameTerm', checkedArgs);

    }
timezoneString(...args) {
    const paramdef = ['value', types.XsDateTime, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('sem.timezoneString', 1, paramdef, args);
    return new types.XsString('sem', 'timezone-string', checkedArgs);
    }
typedLiteral(...args) {
    const namer = bldrbase.getNamer(args, 'value');
    const paramdefs = [['value', types.XsString, true, false], ['datatype', types.SemIri, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'sem.typedLiteral', 2, new Set(['value', 'datatype']), paramdefs, args) :
        bldrbase.makePositionalArgs('sem.typedLiteral', 2, false, paramdefs, args);
    return new types.XsAnyAtomicType('sem', 'typed-literal', checkedArgs);

    }
unknown(...args) {
    const namer = bldrbase.getNamer(args, 'string');
    const paramdefs = [['string', types.XsString, true, false], ['datatype', types.SemIri, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'sem.unknown', 2, new Set(['string', 'datatype']), paramdefs, args) :
        bldrbase.makePositionalArgs('sem.unknown', 2, false, paramdefs, args);
    return new types.SemUnknown('sem', 'unknown', checkedArgs);

    }
unknownDatatype(...args) {
    const paramdef = ['val', types.SemUnknown, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('sem.unknownDatatype', 1, paramdef, args);
    return new types.SemIri('sem', 'unknown-datatype', checkedArgs);
    }
uuid(...args) {
    bldrbase.checkMaxArity('sem.uuid', args.length, 0);
    return new types.SemIri('sem', 'uuid', args);
    }
uuidString(...args) {
    bldrbase.checkMaxArity('sem.uuidString', args.length, 0);
    return new types.XsString('sem', 'uuid-string', args);
    }
}
class SpellExpr {
  constructor() {
  }
  doubleMetaphone(...args) {
    const paramdef = ['word', types.XsString, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('spell.doubleMetaphone', 1, paramdef, args);
    return new types.XsString('spell', 'double-metaphone', checkedArgs);
    }
levenshteinDistance(...args) {
    const namer = bldrbase.getNamer(args, 'str1');
    const paramdefs = [['str1', types.XsString, true, false], ['str2', types.XsString, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'spell.levenshteinDistance', 2, new Set(['str1', 'str2']), paramdefs, args) :
        bldrbase.makePositionalArgs('spell.levenshteinDistance', 2, false, paramdefs, args);
    return new types.XsInteger('spell', 'levenshtein-distance', checkedArgs);

    }
romanize(...args) {
    const paramdef = ['string', types.XsString, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('spell.romanize', 1, paramdef, args);
    return new types.XsString('spell', 'romanize', checkedArgs);
    }
}
class SqlExpr {
  constructor() {
  }
  bitLength(...args) {
    const paramdef = ['str', types.XsString, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('sql.bitLength', 1, paramdef, args);
    return new types.XsInteger('sql', 'bit-length', checkedArgs);
    }
collatedString(...args) {
    const namer = bldrbase.getNamer(args, 'string');
    const paramdefs = [['string', types.XsString, true, false], ['collationURI', types.XsString, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'sql.collatedString', 2, new Set(['string', 'collationURI']), paramdefs, args) :
        bldrbase.makePositionalArgs('sql.collatedString', 2, false, paramdefs, args);
    return new types.XsString('sql', 'collated-string', checkedArgs);

    }
dateadd(...args) {
    const namer = bldrbase.getNamer(args, 'datepart');
    const paramdefs = [['datepart', types.XsString, true, false], ['number', types.XsInt, true, false], ['date', types.Item, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'sql.dateadd', 3, new Set(['datepart', 'number', 'date']), paramdefs, args) :
        bldrbase.makePositionalArgs('sql.dateadd', 3, false, paramdefs, args);
    return new types.Item('sql', 'dateadd', checkedArgs);

    }
datediff(...args) {
    const namer = bldrbase.getNamer(args, 'datepart');
    const paramdefs = [['datepart', types.XsString, true, false], ['startdate', types.Item, true, false], ['enddate', types.Item, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'sql.datediff', 3, new Set(['datepart', 'startdate', 'enddate']), paramdefs, args) :
        bldrbase.makePositionalArgs('sql.datediff', 3, false, paramdefs, args);
    return new types.XsInteger('sql', 'datediff', checkedArgs);

    }
datepart(...args) {
    const namer = bldrbase.getNamer(args, 'datepart');
    const paramdefs = [['datepart', types.XsString, true, false], ['date', types.Item, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'sql.datepart', 2, new Set(['datepart', 'date']), paramdefs, args) :
        bldrbase.makePositionalArgs('sql.datepart', 2, false, paramdefs, args);
    return new types.XsInteger('sql', 'datepart', checkedArgs);

    }
day(...args) {
    const paramdef = ['arg', types.Item, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('sql.day', 1, paramdef, args);
    return new types.XsInteger('sql', 'day', checkedArgs);
    }
dayname(...args) {
    const paramdef = ['arg', types.Item, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('sql.dayname', 1, paramdef, args);
    return new types.XsString('sql', 'dayname', checkedArgs);
    }
hours(...args) {
    const paramdef = ['arg', types.Item, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('sql.hours', 1, paramdef, args);
    return new types.XsInteger('sql', 'hours', checkedArgs);
    }
insert(...args) {
    const namer = bldrbase.getNamer(args, 'str');
    const paramdefs = [['str', types.XsString, true, false], ['start', types.XsNumeric, true, false], ['length', types.XsNumeric, true, false], ['str2', types.XsString, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'sql.insert', 4, new Set(['str', 'start', 'length', 'str2']), paramdefs, args) :
        bldrbase.makePositionalArgs('sql.insert', 4, false, paramdefs, args);
    return new types.XsString('sql', 'insert', checkedArgs);

    }
instr(...args) {
    const namer = bldrbase.getNamer(args, 'str');
    const paramdefs = [['str', types.XsString, true, false], ['n', types.XsString, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'sql.instr', 2, new Set(['str', 'n']), paramdefs, args) :
        bldrbase.makePositionalArgs('sql.instr', 2, false, paramdefs, args);
    return new types.XsUnsignedInt('sql', 'instr', checkedArgs);

    }
left(...args) {
    const namer = bldrbase.getNamer(args, 'str');
    const paramdefs = [['str', types.Item, false, true], ['n', types.XsNumeric, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'sql.left', 2, new Set(['str', 'n']), paramdefs, args) :
        bldrbase.makePositionalArgs('sql.left', 2, false, paramdefs, args);
    return new types.XsString('sql', 'left', checkedArgs);

    }
ltrim(...args) {
    const paramdef = ['str', types.XsString, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('sql.ltrim', 1, paramdef, args);
    return new types.XsString('sql', 'ltrim', checkedArgs);
    }
minutes(...args) {
    const paramdef = ['arg', types.Item, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('sql.minutes', 1, paramdef, args);
    return new types.XsInteger('sql', 'minutes', checkedArgs);
    }
month(...args) {
    const paramdef = ['arg', types.Item, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('sql.month', 1, paramdef, args);
    return new types.XsInteger('sql', 'month', checkedArgs);
    }
monthname(...args) {
    const paramdef = ['arg', types.Item, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('sql.monthname', 1, paramdef, args);
    return new types.XsString('sql', 'monthname', checkedArgs);
    }
octetLength(...args) {
    const paramdef = ['x', types.XsString, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('sql.octetLength', 1, paramdef, args);
    return new types.XsInteger('sql', 'octet-length', checkedArgs);
    }
quarter(...args) {
    const paramdef = ['arg', types.Item, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('sql.quarter', 1, paramdef, args);
    return new types.XsInteger('sql', 'quarter', checkedArgs);
    }
rand(...args) {
    const paramdef = ['n', types.XsUnsignedLong, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('sql.rand', 1, paramdef, args);
    return new types.XsUnsignedLong('sql', 'rand', checkedArgs);
    }
repeat(...args) {
    const namer = bldrbase.getNamer(args, 'str');
    const paramdefs = [['str', types.Item, false, true], ['n', types.XsNumeric, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'sql.repeat', 2, new Set(['str', 'n']), paramdefs, args) :
        bldrbase.makePositionalArgs('sql.repeat', 2, false, paramdefs, args);
    return new types.XsString('sql', 'repeat', checkedArgs);

    }
right(...args) {
    const namer = bldrbase.getNamer(args, 'str');
    const paramdefs = [['str', types.Item, false, true], ['n', types.XsNumeric, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'sql.right', 2, new Set(['str', 'n']), paramdefs, args) :
        bldrbase.makePositionalArgs('sql.right', 2, false, paramdefs, args);
    return new types.XsString('sql', 'right', checkedArgs);

    }
rtrim(...args) {
    const paramdef = ['str', types.XsString, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('sql.rtrim', 1, paramdef, args);
    return new types.XsString('sql', 'rtrim', checkedArgs);
    }
seconds(...args) {
    const paramdef = ['arg', types.Item, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('sql.seconds', 1, paramdef, args);
    return new types.XsDecimal('sql', 'seconds', checkedArgs);
    }
sign(...args) {
    const paramdef = ['x', types.XsNumeric, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('sql.sign', 1, paramdef, args);
    return new types.Item('sql', 'sign', checkedArgs);
    }
space(...args) {
    const paramdef = ['n', types.XsNumeric, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('sql.space', 1, paramdef, args);
    return new types.XsString('sql', 'space', checkedArgs);
    }
timestampadd(...args) {
    const namer = bldrbase.getNamer(args, 'dateTimeType');
    const paramdefs = [['dateTimeType', types.XsString, true, false], ['value', types.XsInt, true, false], ['timestamp', types.Item, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'sql.timestampadd', 3, new Set(['dateTimeType', 'value', 'timestamp']), paramdefs, args) :
        bldrbase.makePositionalArgs('sql.timestampadd', 3, false, paramdefs, args);
    return new types.Item('sql', 'timestampadd', checkedArgs);

    }
timestampdiff(...args) {
    const namer = bldrbase.getNamer(args, 'dateTimeType');
    const paramdefs = [['dateTimeType', types.XsString, true, false], ['timestamp1', types.Item, true, false], ['timestamp2', types.Item, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'sql.timestampdiff', 3, new Set(['dateTimeType', 'timestamp1', 'timestamp2']), paramdefs, args) :
        bldrbase.makePositionalArgs('sql.timestampdiff', 3, false, paramdefs, args);
    return new types.XsInteger('sql', 'timestampdiff', checkedArgs);

    }
trim(...args) {
    const paramdef = ['str', types.XsString, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('sql.trim', 1, paramdef, args);
    return new types.XsString('sql', 'trim', checkedArgs);
    }
week(...args) {
    const paramdef = ['arg', types.Item, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('sql.week', 1, paramdef, args);
    return new types.XsInteger('sql', 'week', checkedArgs);
    }
weekday(...args) {
    const paramdef = ['arg1', types.Item, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('sql.weekday', 1, paramdef, args);
    return new types.XsInteger('sql', 'weekday', checkedArgs);
    }
year(...args) {
    const paramdef = ['arg', types.Item, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('sql.year', 1, paramdef, args);
    return new types.XsInteger('sql', 'year', checkedArgs);
    }
yearday(...args) {
    const paramdef = ['arg', types.Item, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('sql.yearday', 1, paramdef, args);
    return new types.XsInteger('sql', 'yearday', checkedArgs);
    }
}
class XdmpExpr {
  constructor() {
  }
  add64(...args) {
    const namer = bldrbase.getNamer(args, 'x');
    const paramdefs = [['x', types.XsUnsignedLong, true, false], ['y', types.XsUnsignedLong, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'xdmp.add64', 2, new Set(['x', 'y']), paramdefs, args) :
        bldrbase.makePositionalArgs('xdmp.add64', 2, false, paramdefs, args);
    return new types.XsUnsignedLong('xdmp', 'add64', checkedArgs);

    }
and64(...args) {
    const namer = bldrbase.getNamer(args, 'x');
    const paramdefs = [['x', types.XsUnsignedLong, true, false], ['y', types.XsUnsignedLong, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'xdmp.and64', 2, new Set(['x', 'y']), paramdefs, args) :
        bldrbase.makePositionalArgs('xdmp.and64', 2, false, paramdefs, args);
    return new types.XsUnsignedLong('xdmp', 'and64', checkedArgs);

    }
base64Decode(...args) {
    const paramdef = ['encoded', types.XsString, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('xdmp.base64Decode', 1, paramdef, args);
    return new types.XsString('xdmp', 'base64-decode', checkedArgs);
    }
base64Encode(...args) {
    const paramdef = ['plaintext', types.XsString, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('xdmp.base64Encode', 1, paramdef, args);
    return new types.XsString('xdmp', 'base64-encode', checkedArgs);
    }
castableAs(...args) {
    const namer = bldrbase.getNamer(args, 'namespace-uri');
    const paramdefs = [['namespace-uri', types.XsString, true, false], ['local-name', types.XsString, true, false], ['item', types.Item, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'xdmp.castableAs', 3, new Set(['namespace-uri', 'local-name', 'item']), paramdefs, args) :
        bldrbase.makePositionalArgs('xdmp.castableAs', 3, false, paramdefs, args);
    return new types.XsBoolean('xdmp', 'castable-as', checkedArgs);

    }
crypt(...args) {
    const namer = bldrbase.getNamer(args, 'password');
    const paramdefs = [['password', types.XsString, true, false], ['salt', types.XsString, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'xdmp.crypt', 2, new Set(['password', 'salt']), paramdefs, args) :
        bldrbase.makePositionalArgs('xdmp.crypt', 2, false, paramdefs, args);
    return new types.XsString('xdmp', 'crypt', checkedArgs);

    }
crypt2(...args) {
    const paramdef = ['password', types.XsString, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('xdmp.crypt2', 1, paramdef, args);
    return new types.XsString('xdmp', 'crypt2', checkedArgs);
    }
daynameFromDate(...args) {
    const paramdef = ['arg', types.XsDate, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xdmp.daynameFromDate', 1, paramdef, args);
    return new types.XsString('xdmp', 'dayname-from-date', checkedArgs);
    }
decodeFromNCName(...args) {
    const paramdef = ['name', types.XsString, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('xdmp.decodeFromNCName', 1, paramdef, args);
    return new types.XsString('xdmp', 'decode-from-NCName', checkedArgs);
    }
describe(...args) {
    const namer = bldrbase.getNamer(args, 'item');
    const paramdefs = [['item', types.Item, false, true], ['max-sequence-length', types.XsUnsignedInt, false, false], ['max-item-length', types.XsUnsignedInt, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'xdmp.describe', 1, new Set(['item', 'max-sequence-length', 'max-item-length']), paramdefs, args) :
        bldrbase.makePositionalArgs('xdmp.describe', 1, false, paramdefs, args);
    return new types.XsString('xdmp', 'describe', checkedArgs);

    }
diacriticLess(...args) {
    const paramdef = ['string', types.XsString, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('xdmp.diacriticLess', 1, paramdef, args);
    return new types.XsString('xdmp', 'diacritic-less', checkedArgs);
    }
elementContentType(...args) {
    const paramdef = ['element', types.ElementNode, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('xdmp.elementContentType', 1, paramdef, args);
    return new types.XsString('xdmp', 'element-content-type', checkedArgs);
    }
encodeForNCName(...args) {
    const paramdef = ['name', types.XsString, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('xdmp.encodeForNCName', 1, paramdef, args);
    return new types.XsString('xdmp', 'encode-for-NCName', checkedArgs);
    }
formatNumber(...args) {
    const namer = bldrbase.getNamer(args, 'value');
    const paramdefs = [['value', types.XsNumeric, false, true], ['picture', types.XsString, false, false], ['language', types.XsString, false, false], ['letter-value', types.XsString, false, false], ['ordchar', types.XsString, false, false], ['zero-padding', types.XsString, false, false], ['grouping-separator', types.XsString, false, false], ['grouping-size', types.XsInteger, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'xdmp.formatNumber', 1, new Set(['value', 'picture', 'language', 'letter-value', 'ordchar', 'zero-padding', 'grouping-separator', 'grouping-size']), paramdefs, args) :
        bldrbase.makePositionalArgs('xdmp.formatNumber', 1, false, paramdefs, args);
    return new types.XsString('xdmp', 'format-number', checkedArgs);

    }
fromJson(...args) {
    const paramdef = ['arg', types.Node, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('xdmp.fromJson', 1, paramdef, args);
    return new types.Item('xdmp', 'from-json', checkedArgs);
    }
getCurrentUser(...args) {
    bldrbase.checkMaxArity('xdmp.getCurrentUser', args.length, 0);
    return new types.XsString('xdmp', 'get-current-user', args);
    }
hash32(...args) {
    const paramdef = ['string', types.XsString, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('xdmp.hash32', 1, paramdef, args);
    return new types.XsUnsignedInt('xdmp', 'hash32', checkedArgs);
    }
hash64(...args) {
    const paramdef = ['string', types.XsString, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('xdmp.hash64', 1, paramdef, args);
    return new types.XsUnsignedLong('xdmp', 'hash64', checkedArgs);
    }
hexToInteger(...args) {
    const paramdef = ['hex', types.XsString, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('xdmp.hexToInteger', 1, paramdef, args);
    return new types.XsInteger('xdmp', 'hex-to-integer', checkedArgs);
    }
hmacMd5(...args) {
    const namer = bldrbase.getNamer(args, 'secretkey');
    const paramdefs = [['secretkey', types.Item, true, false], ['message', types.Item, true, false], ['encoding', types.XsString, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'xdmp.hmacMd5', 2, new Set(['secretkey', 'message', 'encoding']), paramdefs, args) :
        bldrbase.makePositionalArgs('xdmp.hmacMd5', 2, false, paramdefs, args);
    return new types.XsString('xdmp', 'hmac-md5', checkedArgs);

    }
hmacSha1(...args) {
    const namer = bldrbase.getNamer(args, 'secretkey');
    const paramdefs = [['secretkey', types.Item, true, false], ['message', types.Item, true, false], ['encoding', types.XsString, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'xdmp.hmacSha1', 2, new Set(['secretkey', 'message', 'encoding']), paramdefs, args) :
        bldrbase.makePositionalArgs('xdmp.hmacSha1', 2, false, paramdefs, args);
    return new types.XsString('xdmp', 'hmac-sha1', checkedArgs);

    }
hmacSha256(...args) {
    const namer = bldrbase.getNamer(args, 'secretkey');
    const paramdefs = [['secretkey', types.Item, true, false], ['message', types.Item, true, false], ['encoding', types.XsString, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'xdmp.hmacSha256', 2, new Set(['secretkey', 'message', 'encoding']), paramdefs, args) :
        bldrbase.makePositionalArgs('xdmp.hmacSha256', 2, false, paramdefs, args);
    return new types.XsString('xdmp', 'hmac-sha256', checkedArgs);

    }
hmacSha512(...args) {
    const namer = bldrbase.getNamer(args, 'secretkey');
    const paramdefs = [['secretkey', types.Item, true, false], ['message', types.Item, true, false], ['encoding', types.XsString, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'xdmp.hmacSha512', 2, new Set(['secretkey', 'message', 'encoding']), paramdefs, args) :
        bldrbase.makePositionalArgs('xdmp.hmacSha512', 2, false, paramdefs, args);
    return new types.XsString('xdmp', 'hmac-sha512', checkedArgs);

    }
initcap(...args) {
    const paramdef = ['string', types.XsString, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xdmp.initcap', 1, paramdef, args);
    return new types.XsString('xdmp', 'initcap', checkedArgs);
    }
integerToHex(...args) {
    const paramdef = ['val', types.XsInteger, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('xdmp.integerToHex', 1, paramdef, args);
    return new types.XsString('xdmp', 'integer-to-hex', checkedArgs);
    }
integerToOctal(...args) {
    const paramdef = ['val', types.XsInteger, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('xdmp.integerToOctal', 1, paramdef, args);
    return new types.XsString('xdmp', 'integer-to-octal', checkedArgs);
    }
keyFromQName(...args) {
    const paramdef = ['name', types.XsQName, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('xdmp.keyFromQName', 1, paramdef, args);
    return new types.XsString('xdmp', 'key-from-QName', checkedArgs);
    }
lshift64(...args) {
    const namer = bldrbase.getNamer(args, 'x');
    const paramdefs = [['x', types.XsUnsignedLong, true, false], ['y', types.XsLong, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'xdmp.lshift64', 2, new Set(['x', 'y']), paramdefs, args) :
        bldrbase.makePositionalArgs('xdmp.lshift64', 2, false, paramdefs, args);
    return new types.XsUnsignedLong('xdmp', 'lshift64', checkedArgs);

    }
md5(...args) {
    const namer = bldrbase.getNamer(args, 'data');
    const paramdefs = [['data', types.Item, true, false], ['encoding', types.XsString, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'xdmp.md5', 1, new Set(['data', 'encoding']), paramdefs, args) :
        bldrbase.makePositionalArgs('xdmp.md5', 1, false, paramdefs, args);
    return new types.XsString('xdmp', 'md5', checkedArgs);

    }
monthNameFromDate(...args) {
    const paramdef = ['arg', types.XsDate, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xdmp.monthNameFromDate', 1, paramdef, args);
    return new types.XsString('xdmp', 'month-name-from-date', checkedArgs);
    }
mul64(...args) {
    const namer = bldrbase.getNamer(args, 'x');
    const paramdefs = [['x', types.XsUnsignedLong, true, false], ['y', types.XsUnsignedLong, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'xdmp.mul64', 2, new Set(['x', 'y']), paramdefs, args) :
        bldrbase.makePositionalArgs('xdmp.mul64', 2, false, paramdefs, args);
    return new types.XsUnsignedLong('xdmp', 'mul64', checkedArgs);

    }
nodeCollections(...args) {
    const paramdef = ['node', types.Node, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('xdmp.nodeCollections', 1, paramdef, args);
    return new types.XsString('xdmp', 'node-collections', checkedArgs);
    }
nodeKind(...args) {
    const paramdef = ['node', types.Node, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('xdmp.nodeKind', 1, paramdef, args);
    return new types.XsString('xdmp', 'node-kind', checkedArgs);
    }
nodeMetadata(...args) {
    const paramdef = ['node', types.Node, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('xdmp.nodeMetadata', 1, paramdef, args);
    return new types.MapMap('xdmp', 'node-metadata', checkedArgs);
    }
nodeMetadataValue(...args) {
    const namer = bldrbase.getNamer(args, 'uri');
    const paramdefs = [['uri', types.Node, true, false], ['keyName', types.XsString, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'xdmp.nodeMetadataValue', 2, new Set(['uri', 'keyName']), paramdefs, args) :
        bldrbase.makePositionalArgs('xdmp.nodeMetadataValue', 2, false, paramdefs, args);
    return new types.XsString('xdmp', 'node-metadata-value', checkedArgs);

    }
nodePermissions(...args) {
    const namer = bldrbase.getNamer(args, 'node');
    const paramdefs = [['node', types.Node, true, false], ['output-kind', types.XsString, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'xdmp.nodePermissions', 1, new Set(['node', 'output-kind']), paramdefs, args) :
        bldrbase.makePositionalArgs('xdmp.nodePermissions', 1, false, paramdefs, args);
    return new types.Item('xdmp', 'node-permissions', checkedArgs);

    }
nodeUri(...args) {
    const paramdef = ['node', types.Node, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('xdmp.nodeUri', 1, paramdef, args);
    return new types.XsString('xdmp', 'node-uri', checkedArgs);
    }
not64(...args) {
    const paramdef = ['x', types.XsUnsignedLong, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('xdmp.not64', 1, paramdef, args);
    return new types.XsUnsignedLong('xdmp', 'not64', checkedArgs);
    }
octalToInteger(...args) {
    const paramdef = ['octal', types.XsString, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('xdmp.octalToInteger', 1, paramdef, args);
    return new types.XsInteger('xdmp', 'octal-to-integer', checkedArgs);
    }
or64(...args) {
    const namer = bldrbase.getNamer(args, 'x');
    const paramdefs = [['x', types.XsUnsignedLong, true, false], ['y', types.XsUnsignedLong, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'xdmp.or64', 2, new Set(['x', 'y']), paramdefs, args) :
        bldrbase.makePositionalArgs('xdmp.or64', 2, false, paramdefs, args);
    return new types.XsUnsignedLong('xdmp', 'or64', checkedArgs);

    }
parseDateTime(...args) {
    const namer = bldrbase.getNamer(args, 'picture');
    const paramdefs = [['picture', types.XsString, true, false], ['value', types.XsString, true, false], ['language', types.XsString, false, false], ['calendar', types.XsString, false, false], ['country', types.XsString, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'xdmp.parseDateTime', 2, new Set(['picture', 'value', 'language', 'calendar', 'country']), paramdefs, args) :
        bldrbase.makePositionalArgs('xdmp.parseDateTime', 2, false, paramdefs, args);
    return new types.XsDateTime('xdmp', 'parse-dateTime', checkedArgs);

    }
parseYymmdd(...args) {
    const namer = bldrbase.getNamer(args, 'picture');
    const paramdefs = [['picture', types.XsString, true, false], ['value', types.XsString, true, false], ['language', types.XsString, false, false], ['calendar', types.XsString, false, false], ['country', types.XsString, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'xdmp.parseYymmdd', 2, new Set(['picture', 'value', 'language', 'calendar', 'country']), paramdefs, args) :
        bldrbase.makePositionalArgs('xdmp.parseYymmdd', 2, false, paramdefs, args);
    return new types.XsDateTime('xdmp', 'parse-yymmdd', checkedArgs);

    }
path(...args) {
    const namer = bldrbase.getNamer(args, 'node');
    const paramdefs = [['node', types.Node, true, false], ['include-document', types.XsBoolean, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'xdmp.path', 1, new Set(['node', 'include-document']), paramdefs, args) :
        bldrbase.makePositionalArgs('xdmp.path', 1, false, paramdefs, args);
    return new types.XsString('xdmp', 'path', checkedArgs);

    }
position(...args) {
    const namer = bldrbase.getNamer(args, 'test');
    const paramdefs = [['test', types.XsString, false, false], ['target', types.XsString, false, false], ['collation', types.XsString, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'xdmp.position', 2, new Set(['test', 'target', 'collation']), paramdefs, args) :
        bldrbase.makePositionalArgs('xdmp.position', 2, false, paramdefs, args);
    return new types.XsInteger('xdmp', 'position', checkedArgs);

    }
QNameFromKey(...args) {
    const paramdef = ['key', types.XsString, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('xdmp.QNameFromKey', 1, paramdef, args);
    return new types.XsQName('xdmp', 'QName-from-key', checkedArgs);
    }
quarterFromDate(...args) {
    const paramdef = ['arg', types.XsDate, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xdmp.quarterFromDate', 1, paramdef, args);
    return new types.XsInteger('xdmp', 'quarter-from-date', checkedArgs);
    }
random(...args) {
    const paramdef = ['max', types.XsUnsignedLong, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('xdmp.random', 0, paramdef, args);
    return new types.XsUnsignedLong('xdmp', 'random', checkedArgs);
    }
resolveUri(...args) {
    const namer = bldrbase.getNamer(args, 'relative');
    const paramdefs = [['relative', types.XsString, false, false], ['base', types.XsString, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'xdmp.resolveUri', 2, new Set(['relative', 'base']), paramdefs, args) :
        bldrbase.makePositionalArgs('xdmp.resolveUri', 2, false, paramdefs, args);
    return new types.XsAnyURI('xdmp', 'resolve-uri', checkedArgs);

    }
rshift64(...args) {
    const namer = bldrbase.getNamer(args, 'x');
    const paramdefs = [['x', types.XsUnsignedLong, true, false], ['y', types.XsLong, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'xdmp.rshift64', 2, new Set(['x', 'y']), paramdefs, args) :
        bldrbase.makePositionalArgs('xdmp.rshift64', 2, false, paramdefs, args);
    return new types.XsUnsignedLong('xdmp', 'rshift64', checkedArgs);

    }
sha1(...args) {
    const namer = bldrbase.getNamer(args, 'data');
    const paramdefs = [['data', types.Item, true, false], ['encoding', types.XsString, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'xdmp.sha1', 1, new Set(['data', 'encoding']), paramdefs, args) :
        bldrbase.makePositionalArgs('xdmp.sha1', 1, false, paramdefs, args);
    return new types.XsString('xdmp', 'sha1', checkedArgs);

    }
sha256(...args) {
    const namer = bldrbase.getNamer(args, 'data');
    const paramdefs = [['data', types.Item, true, false], ['encoding', types.XsString, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'xdmp.sha256', 1, new Set(['data', 'encoding']), paramdefs, args) :
        bldrbase.makePositionalArgs('xdmp.sha256', 1, false, paramdefs, args);
    return new types.XsString('xdmp', 'sha256', checkedArgs);

    }
sha384(...args) {
    const namer = bldrbase.getNamer(args, 'data');
    const paramdefs = [['data', types.Item, true, false], ['encoding', types.XsString, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'xdmp.sha384', 1, new Set(['data', 'encoding']), paramdefs, args) :
        bldrbase.makePositionalArgs('xdmp.sha384', 1, false, paramdefs, args);
    return new types.XsString('xdmp', 'sha384', checkedArgs);

    }
sha512(...args) {
    const namer = bldrbase.getNamer(args, 'data');
    const paramdefs = [['data', types.Item, true, false], ['encoding', types.XsString, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'xdmp.sha512', 1, new Set(['data', 'encoding']), paramdefs, args) :
        bldrbase.makePositionalArgs('xdmp.sha512', 1, false, paramdefs, args);
    return new types.XsString('xdmp', 'sha512', checkedArgs);

    }
step64(...args) {
    const namer = bldrbase.getNamer(args, 'initial');
    const paramdefs = [['initial', types.XsUnsignedLong, true, false], ['step', types.XsUnsignedLong, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'xdmp.step64', 2, new Set(['initial', 'step']), paramdefs, args) :
        bldrbase.makePositionalArgs('xdmp.step64', 2, false, paramdefs, args);
    return new types.XsUnsignedLong('xdmp', 'step64', checkedArgs);

    }
strftime(...args) {
    const namer = bldrbase.getNamer(args, 'format');
    const paramdefs = [['format', types.XsString, true, false], ['value', types.XsDateTime, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'xdmp.strftime', 2, new Set(['format', 'value']), paramdefs, args) :
        bldrbase.makePositionalArgs('xdmp.strftime', 2, false, paramdefs, args);
    return new types.XsString('xdmp', 'strftime', checkedArgs);

    }
timestampToWallclock(...args) {
    const paramdef = ['timestamp', types.XsUnsignedLong, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('xdmp.timestampToWallclock', 1, paramdef, args);
    return new types.XsDateTime('xdmp', 'timestamp-to-wallclock', checkedArgs);
    }
toJson(...args) {
    const paramdef = ['item', types.Item, false, true];
    const checkedArgs = bldrbase.makeSingleArgs('xdmp.toJson', 1, paramdef, args);
    return new types.Node('xdmp', 'to-json', checkedArgs);
    }
type(...args) {
    const paramdef = ['value', types.XsAnyAtomicType, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('xdmp.type', 1, paramdef, args);
    return new types.XsQName('xdmp', 'type', checkedArgs);
    }
urlDecode(...args) {
    const paramdef = ['encoded', types.XsString, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('xdmp.urlDecode', 1, paramdef, args);
    return new types.XsString('xdmp', 'url-decode', checkedArgs);
    }
urlEncode(...args) {
    const namer = bldrbase.getNamer(args, 'plaintext');
    const paramdefs = [['plaintext', types.XsString, true, false], ['noSpacePlus', types.XsBoolean, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'xdmp.urlEncode', 1, new Set(['plaintext', 'noSpacePlus']), paramdefs, args) :
        bldrbase.makePositionalArgs('xdmp.urlEncode', 1, false, paramdefs, args);
    return new types.XsString('xdmp', 'url-encode', checkedArgs);

    }
wallclockToTimestamp(...args) {
    const paramdef = ['timestamp', types.XsDateTime, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('xdmp.wallclockToTimestamp', 1, paramdef, args);
    return new types.XsUnsignedLong('xdmp', 'wallclock-to-timestamp', checkedArgs);
    }
weekFromDate(...args) {
    const paramdef = ['arg', types.XsDate, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xdmp.weekFromDate', 1, paramdef, args);
    return new types.XsInteger('xdmp', 'week-from-date', checkedArgs);
    }
weekdayFromDate(...args) {
    const paramdef = ['arg', types.XsDate, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xdmp.weekdayFromDate', 1, paramdef, args);
    return new types.XsInteger('xdmp', 'weekday-from-date', checkedArgs);
    }
xor64(...args) {
    const namer = bldrbase.getNamer(args, 'x');
    const paramdefs = [['x', types.XsUnsignedLong, true, false], ['y', types.XsUnsignedLong, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'xdmp.xor64', 2, new Set(['x', 'y']), paramdefs, args) :
        bldrbase.makePositionalArgs('xdmp.xor64', 2, false, paramdefs, args);
    return new types.XsUnsignedLong('xdmp', 'xor64', checkedArgs);

    }
yeardayFromDate(...args) {
    const paramdef = ['arg', types.XsDate, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xdmp.yeardayFromDate', 1, paramdef, args);
    return new types.XsInteger('xdmp', 'yearday-from-date', checkedArgs);
    }
}
class XsExpr {
  constructor() {
  }
  anyURI(...args) {
    const paramdef = ['arg1', types.XsAnyAtomicType, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.anyURI', 1, paramdef, args);
    return new types.XsAnyURI('xs', 'anyURI', checkedArgs);
    }
base64Binary(...args) {
    const paramdef = ['arg1', types.XsAnyAtomicType, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.base64Binary', 1, paramdef, args);
    return new types.XsBase64Binary('xs', 'base64Binary', checkedArgs);
    }
boolean(...args) {
    const paramdef = ['arg1', types.XsAnyAtomicType, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.boolean', 1, paramdef, args);
    return new types.XsBoolean('xs', 'boolean', checkedArgs);
    }
byte(...args) {
    const paramdef = ['arg1', types.XsAnyAtomicType, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.byte', 1, paramdef, args);
    return new types.XsByte('xs', 'byte', checkedArgs);
    }
date(...args) {
    const paramdef = ['arg1', types.XsAnyAtomicType, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.date', 1, paramdef, args);
    return new types.XsDate('xs', 'date', checkedArgs);
    }
dateTime(...args) {
    const paramdef = ['arg1', types.XsAnyAtomicType, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.dateTime', 1, paramdef, args);
    return new types.XsDateTime('xs', 'dateTime', checkedArgs);
    }
dayTimeDuration(...args) {
    const paramdef = ['arg1', types.XsAnyAtomicType, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.dayTimeDuration', 1, paramdef, args);
    return new types.XsDayTimeDuration('xs', 'dayTimeDuration', checkedArgs);
    }
decimal(...args) {
    const paramdef = ['arg1', types.XsAnyAtomicType, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.decimal', 1, paramdef, args);
    return new types.XsDecimal('xs', 'decimal', checkedArgs);
    }
double(...args) {
    const paramdef = ['arg1', types.XsAnyAtomicType, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.double', 1, paramdef, args);
    return new types.XsDouble('xs', 'double', checkedArgs);
    }
float(...args) {
    const paramdef = ['arg1', types.XsAnyAtomicType, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.float', 1, paramdef, args);
    return new types.XsFloat('xs', 'float', checkedArgs);
    }
gDay(...args) {
    const paramdef = ['arg1', types.XsAnyAtomicType, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.gDay', 1, paramdef, args);
    return new types.XsGDay('xs', 'gDay', checkedArgs);
    }
gMonth(...args) {
    const paramdef = ['arg1', types.XsAnyAtomicType, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.gMonth', 1, paramdef, args);
    return new types.XsGMonth('xs', 'gMonth', checkedArgs);
    }
gMonthDay(...args) {
    const paramdef = ['arg1', types.XsAnyAtomicType, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.gMonthDay', 1, paramdef, args);
    return new types.XsGMonthDay('xs', 'gMonthDay', checkedArgs);
    }
gYear(...args) {
    const paramdef = ['arg1', types.XsAnyAtomicType, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.gYear', 1, paramdef, args);
    return new types.XsGYear('xs', 'gYear', checkedArgs);
    }
gYearMonth(...args) {
    const paramdef = ['arg1', types.XsAnyAtomicType, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.gYearMonth', 1, paramdef, args);
    return new types.XsGYearMonth('xs', 'gYearMonth', checkedArgs);
    }
hexBinary(...args) {
    const paramdef = ['arg1', types.XsAnyAtomicType, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.hexBinary', 1, paramdef, args);
    return new types.XsHexBinary('xs', 'hexBinary', checkedArgs);
    }
int(...args) {
    const paramdef = ['arg1', types.XsAnyAtomicType, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.int', 1, paramdef, args);
    return new types.XsInt('xs', 'int', checkedArgs);
    }
integer(...args) {
    const paramdef = ['arg1', types.XsAnyAtomicType, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.integer', 1, paramdef, args);
    return new types.XsInteger('xs', 'integer', checkedArgs);
    }
language(...args) {
    const paramdef = ['arg1', types.XsAnyAtomicType, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.language', 1, paramdef, args);
    return new types.XsLanguage('xs', 'language', checkedArgs);
    }
long(...args) {
    const paramdef = ['arg1', types.XsAnyAtomicType, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.long', 1, paramdef, args);
    return new types.XsLong('xs', 'long', checkedArgs);
    }
Name(...args) {
    const paramdef = ['arg1', types.XsAnyAtomicType, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.Name', 1, paramdef, args);
    return new types.XsName('xs', 'Name', checkedArgs);
    }
NCName(...args) {
    const paramdef = ['arg1', types.XsAnyAtomicType, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.NCName', 1, paramdef, args);
    return new types.XsNCName('xs', 'NCName', checkedArgs);
    }
negativeInteger(...args) {
    const paramdef = ['arg1', types.XsAnyAtomicType, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.negativeInteger', 1, paramdef, args);
    return new types.XsNegativeInteger('xs', 'negativeInteger', checkedArgs);
    }
NMTOKEN(...args) {
    const paramdef = ['arg1', types.XsAnyAtomicType, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.NMTOKEN', 1, paramdef, args);
    return new types.XsNMTOKEN('xs', 'NMTOKEN', checkedArgs);
    }
nonNegativeInteger(...args) {
    const paramdef = ['arg1', types.XsAnyAtomicType, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.nonNegativeInteger', 1, paramdef, args);
    return new types.XsNonNegativeInteger('xs', 'nonNegativeInteger', checkedArgs);
    }
nonPositiveInteger(...args) {
    const paramdef = ['arg1', types.XsAnyAtomicType, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.nonPositiveInteger', 1, paramdef, args);
    return new types.XsNonPositiveInteger('xs', 'nonPositiveInteger', checkedArgs);
    }
normalizedString(...args) {
    const paramdef = ['arg1', types.XsAnyAtomicType, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.normalizedString', 1, paramdef, args);
    return new types.XsNormalizedString('xs', 'normalizedString', checkedArgs);
    }
numeric(...args) {
    const paramdef = ['arg1', types.XsAnyAtomicType, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.numeric', 1, paramdef, args);
    return new types.XsNumeric('xs', 'numeric', checkedArgs);
    }
positiveInteger(...args) {
    const paramdef = ['arg1', types.XsAnyAtomicType, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.positiveInteger', 1, paramdef, args);
    return new types.XsPositiveInteger('xs', 'positiveInteger', checkedArgs);
    }
QName(...args) {
    const paramdef = ['arg1', types.XsAnyAtomicType, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.QName', 1, paramdef, args);
    return new types.XsQName('xs', 'QName', checkedArgs);
    }
short(...args) {
    const paramdef = ['arg1', types.XsAnyAtomicType, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.short', 1, paramdef, args);
    return new types.XsShort('xs', 'short', checkedArgs);
    }
string(...args) {
    const paramdef = ['arg1', types.XsAnyAtomicType, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.string', 1, paramdef, args);
    return new types.XsString('xs', 'string', checkedArgs);
    }
time(...args) {
    const paramdef = ['arg1', types.XsAnyAtomicType, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.time', 1, paramdef, args);
    return new types.XsTime('xs', 'time', checkedArgs);
    }
token(...args) {
    const paramdef = ['arg1', types.XsAnyAtomicType, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.token', 1, paramdef, args);
    return new types.XsToken('xs', 'token', checkedArgs);
    }
unsignedByte(...args) {
    const paramdef = ['arg1', types.XsAnyAtomicType, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.unsignedByte', 1, paramdef, args);
    return new types.XsUnsignedByte('xs', 'unsignedByte', checkedArgs);
    }
unsignedInt(...args) {
    const paramdef = ['arg1', types.XsAnyAtomicType, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.unsignedInt', 1, paramdef, args);
    return new types.XsUnsignedInt('xs', 'unsignedInt', checkedArgs);
    }
unsignedLong(...args) {
    const paramdef = ['arg1', types.XsAnyAtomicType, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.unsignedLong', 1, paramdef, args);
    return new types.XsUnsignedLong('xs', 'unsignedLong', checkedArgs);
    }
unsignedShort(...args) {
    const paramdef = ['arg1', types.XsAnyAtomicType, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.unsignedShort', 1, paramdef, args);
    return new types.XsUnsignedShort('xs', 'unsignedShort', checkedArgs);
    }
untypedAtomic(...args) {
    const paramdef = ['arg1', types.XsAnyAtomicType, false, false];
    const checkedArgs = bldrbase.makeSingleArgs('xs.untypedAtomic', 1, paramdef, args);
    return new types.XsUntypedAtomic('xs', 'untypedAtomic', checkedArgs);
    }
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
map(...args) {
    const paramdef = ['func', PlanFunction, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('PlanPreparePlan.map', 1, paramdef, args);
    return new PlanExportablePlan(this, 'op', 'map', checkedArgs);
    }
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
except(...args) {
    const paramdef = ['right', PlanModifyPlan, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('PlanModifyPlan.except', 1, paramdef, args);
    return new PlanModifyPlan(this, 'op', 'except', checkedArgs);
    }
groupBy(...args) {
    const namer = bldrbase.getNamer(args, 'keys');
    const paramdefs = [['keys', PlanExprCol, false, true], ['aggregates', PlanAggregateCol, false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanModifyPlan.groupBy', 1, new Set(['keys', 'aggregates']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanModifyPlan.groupBy', 1, false, paramdefs, args);
    return new PlanModifyPlan(this, 'op', 'group-by', checkedArgs);

    }
intersect(...args) {
    const paramdef = ['right', PlanModifyPlan, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('PlanModifyPlan.intersect', 1, paramdef, args);
    return new PlanModifyPlan(this, 'op', 'intersect', checkedArgs);
    }
joinCrossProduct(...args) {
    const namer = bldrbase.getNamer(args, 'right');
    const paramdefs = [['right', PlanModifyPlan, true, false], ['condition', types.XsBoolean, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanModifyPlan.joinCrossProduct', 1, new Set(['right', 'condition']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanModifyPlan.joinCrossProduct', 1, false, paramdefs, args);
    return new PlanModifyPlan(this, 'op', 'join-cross-product', checkedArgs);

    }
joinDoc(...args) {
    const namer = bldrbase.getNamer(args, 'docCol');
    const paramdefs = [['docCol', PlanColumn, true, false], ['sourceCol', PlanColumn, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanModifyPlan.joinDoc', 2, new Set(['docCol', 'sourceCol']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanModifyPlan.joinDoc', 2, false, paramdefs, args);
    return new PlanModifyPlan(this, 'op', 'join-doc', checkedArgs);

    }
joinDocUri(...args) {
    const namer = bldrbase.getNamer(args, 'uriCol');
    const paramdefs = [['uriCol', PlanColumn, true, false], ['fragmentIdCol', PlanColumn, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanModifyPlan.joinDocUri', 2, new Set(['uriCol', 'fragmentIdCol']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanModifyPlan.joinDocUri', 2, false, paramdefs, args);
    return new PlanModifyPlan(this, 'op', 'join-doc-uri', checkedArgs);

    }
joinInner(...args) {
    const namer = bldrbase.getNamer(args, 'right');
    const paramdefs = [['right', PlanModifyPlan, true, false], ['keys', PlanJoinKey, false, true], ['condition', types.XsBoolean, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanModifyPlan.joinInner', 1, new Set(['right', 'keys', 'condition']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanModifyPlan.joinInner', 1, false, paramdefs, args);
    return new PlanModifyPlan(this, 'op', 'join-inner', checkedArgs);

    }
joinLeftOuter(...args) {
    const namer = bldrbase.getNamer(args, 'right');
    const paramdefs = [['right', PlanModifyPlan, true, false], ['keys', PlanJoinKey, false, true], ['condition', types.XsBoolean, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanModifyPlan.joinLeftOuter', 1, new Set(['right', 'keys', 'condition']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanModifyPlan.joinLeftOuter', 1, false, paramdefs, args);
    return new PlanModifyPlan(this, 'op', 'join-left-outer', checkedArgs);

    }
limit(...args) {
    const paramdef = ['length', PlanLongParam, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('PlanModifyPlan.limit', 1, paramdef, args);
    return new PlanModifyPlan(this, 'op', 'limit', checkedArgs);
    }
offset(...args) {
    const paramdef = ['start', PlanLongParam, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('PlanModifyPlan.offset', 1, paramdef, args);
    return new PlanModifyPlan(this, 'op', 'offset', checkedArgs);
    }
offsetLimit(...args) {
    const namer = bldrbase.getNamer(args, 'start');
    const paramdefs = [['start', PlanLongParam, false, false], ['length', PlanLongParam, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanModifyPlan.offsetLimit', 2, new Set(['start', 'length']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanModifyPlan.offsetLimit', 2, false, paramdefs, args);
    return new PlanModifyPlan(this, 'op', 'offset-limit', checkedArgs);

    }
orderBy(...args) {
    const paramdef = ['keys', PlanSortKey, true, true];
    const checkedArgs = bldrbase.makeSingleArgs('PlanModifyPlan.orderBy', 1, paramdef, args);
    return new PlanModifyPlan(this, 'op', 'order-by', checkedArgs);
    }
prepare(...args) {
    const paramdef = ['optimize', types.XsInt, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('PlanModifyPlan.prepare', 1, paramdef, args);
    return new PlanPreparePlan(this, 'op', 'prepare', checkedArgs);
    }
select(...args) {
    const namer = bldrbase.getNamer(args, 'columns');
    const paramdefs = [['columns', PlanExprCol, false, true], ['qualifierName', types.XsString, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanModifyPlan.select', 1, new Set(['columns', 'qualifierName']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanModifyPlan.select', 1, false, paramdefs, args);
    return new PlanModifyPlan(this, 'op', 'select', checkedArgs);

    }
union(...args) {
    const paramdef = ['right', PlanModifyPlan, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('PlanModifyPlan.union', 1, paramdef, args);
    return new PlanModifyPlan(this, 'op', 'union', checkedArgs);
    }
where(...args) {
    const paramdef = ['condition', PlanRowFilter, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('PlanModifyPlan.where', 1, paramdef, args);
    return new PlanModifyPlan(this, 'op', 'where', checkedArgs);
    }
whereDistinct(...args) {
    bldrbase.checkMaxArity('PlanModifyPlan.whereDistinct', args.length, 0);
    return new PlanModifyPlan(this, 'op', 'where-distinct', args);
    }
}

class PlanAccessPlan extends PlanModifyPlan {

  constructor(prior, ns, fn, args) {
    super(prior, ns, fn, args);
  }
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

class PlanBuilder {
  constructor() {
    this.cts = new CtsExpr();
this.fn = new FnExpr();
this.json = new JsonExpr();
this.map = new MapExpr();
this.math = new MathExpr();
this.rdf = new RdfExpr();
this.sem = new SemExpr();
this.spell = new SpellExpr();
this.sql = new SqlExpr();
this.xdmp = new XdmpExpr();
this.xs = new XsExpr();
  }
  add(...args) {
        const namer = bldrbase.getNamer(args, 'left');
        const paramdefs = [['left', types.XsNumeric, true, false], ['right', types.XsNumeric, true, false]];
        if (namer !== null) {
            const paramNames = new Set(['left', 'right']);
            args = bldrbase.makeNamedArgs(namer, 'PlanBuilder.add', 2, paramNames, paramdefs, args);
        } else {
            args = bldrbase.makePositionalArgs('PlanBuilder.add', 2, true, paramdefs, args);
        }
        return new types.XsNumeric('op', 'add', args);
    }
and(...args) {
        const namer = bldrbase.getNamer(args, 'left');
        const paramdefs = [['left', types.XsAnyAtomicType, true, false], ['right', types.XsAnyAtomicType, true, false]];
        if (namer !== null) {
            const paramNames = new Set(['left', 'right']);
            args = bldrbase.makeNamedArgs(namer, 'PlanBuilder.and', 2, paramNames, paramdefs, args);
        } else {
            args = bldrbase.makePositionalArgs('PlanBuilder.and', 2, true, paramdefs, args);
        }
        return new types.XsBoolean('op', 'and', args);
    }
divide(...args) {
        const namer = bldrbase.getNamer(args, 'left');
        const paramdefs = [['left', types.XsNumeric, true, false], ['right', types.XsNumeric, true, false]];
        if (namer !== null) {
            const paramNames = new Set(['left', 'right']);
            args = bldrbase.makeNamedArgs(namer, 'PlanBuilder.divide', 2, paramNames, paramdefs, args);
        } else {
            args = bldrbase.makePositionalArgs('PlanBuilder.divide', 2, false, paramdefs, args);
        }
        return new types.XsNumeric('op', 'divide', args);
    }
eq(...args) {
        const namer = bldrbase.getNamer(args, 'left');
        const paramdefs = [['left', types.XsAnyAtomicType, true, false], ['right', types.XsAnyAtomicType, true, false]];
        if (namer !== null) {
            const paramNames = new Set(['left', 'right']);
            args = bldrbase.makeNamedArgs(namer, 'PlanBuilder.eq', 2, paramNames, paramdefs, args);
        } else {
            args = bldrbase.makePositionalArgs('PlanBuilder.eq', 2, false, paramdefs, args);
        }
        return new types.XsBoolean('op', 'eq', args);
    }
ge(...args) {
        const namer = bldrbase.getNamer(args, 'left');
        const paramdefs = [['left', types.XsAnyAtomicType, true, false], ['right', types.XsAnyAtomicType, true, false]];
        if (namer !== null) {
            const paramNames = new Set(['left', 'right']);
            args = bldrbase.makeNamedArgs(namer, 'PlanBuilder.ge', 2, paramNames, paramdefs, args);
        } else {
            args = bldrbase.makePositionalArgs('PlanBuilder.ge', 2, false, paramdefs, args);
        }
        return new types.XsBoolean('op', 'ge', args);
    }
gt(...args) {
        const namer = bldrbase.getNamer(args, 'left');
        const paramdefs = [['left', types.XsAnyAtomicType, true, false], ['right', types.XsAnyAtomicType, true, false]];
        if (namer !== null) {
            const paramNames = new Set(['left', 'right']);
            args = bldrbase.makeNamedArgs(namer, 'PlanBuilder.gt', 2, paramNames, paramdefs, args);
        } else {
            args = bldrbase.makePositionalArgs('PlanBuilder.gt', 2, false, paramdefs, args);
        }
        return new types.XsBoolean('op', 'gt', args);
    }
isDefined(...args) {
        const paramdef = ['operand', types.Item, true, false];
        args = bldrbase.makeSingleArgs('PlanBuilder.isDefined', 1, paramdef, args);
        return new types.XsBoolean('op', 'is-defined', args);
    }
le(...args) {
        const namer = bldrbase.getNamer(args, 'left');
        const paramdefs = [['left', types.XsAnyAtomicType, true, false], ['right', types.XsAnyAtomicType, true, false]];
        if (namer !== null) {
            const paramNames = new Set(['left', 'right']);
            args = bldrbase.makeNamedArgs(namer, 'PlanBuilder.le', 2, paramNames, paramdefs, args);
        } else {
            args = bldrbase.makePositionalArgs('PlanBuilder.le', 2, false, paramdefs, args);
        }
        return new types.XsBoolean('op', 'le', args);
    }
lt(...args) {
        const namer = bldrbase.getNamer(args, 'left');
        const paramdefs = [['left', types.XsAnyAtomicType, true, false], ['right', types.XsAnyAtomicType, true, false]];
        if (namer !== null) {
            const paramNames = new Set(['left', 'right']);
            args = bldrbase.makeNamedArgs(namer, 'PlanBuilder.lt', 2, paramNames, paramdefs, args);
        } else {
            args = bldrbase.makePositionalArgs('PlanBuilder.lt', 2, false, paramdefs, args);
        }
        return new types.XsBoolean('op', 'lt', args);
    }
multiply(...args) {
        const namer = bldrbase.getNamer(args, 'left');
        const paramdefs = [['left', types.XsNumeric, true, false], ['right', types.XsNumeric, true, false]];
        if (namer !== null) {
            const paramNames = new Set(['left', 'right']);
            args = bldrbase.makeNamedArgs(namer, 'PlanBuilder.multiply', 2, paramNames, paramdefs, args);
        } else {
            args = bldrbase.makePositionalArgs('PlanBuilder.multiply', 2, true, paramdefs, args);
        }
        return new types.XsNumeric('op', 'multiply', args);
    }
ne(...args) {
        const namer = bldrbase.getNamer(args, 'left');
        const paramdefs = [['left', types.XsAnyAtomicType, true, false], ['right', types.XsAnyAtomicType, true, false]];
        if (namer !== null) {
            const paramNames = new Set(['left', 'right']);
            args = bldrbase.makeNamedArgs(namer, 'PlanBuilder.ne', 2, paramNames, paramdefs, args);
        } else {
            args = bldrbase.makePositionalArgs('PlanBuilder.ne', 2, false, paramdefs, args);
        }
        return new types.XsBoolean('op', 'ne', args);
    }
not(...args) {
        const paramdef = ['operand', types.XsAnyAtomicType, true, false];
        args = bldrbase.makeSingleArgs('PlanBuilder.not', 1, paramdef, args);
        return new types.XsBoolean('op', 'not', args);
    }
or(...args) {
        const namer = bldrbase.getNamer(args, 'left');
        const paramdefs = [['left', types.XsAnyAtomicType, true, false], ['right', types.XsAnyAtomicType, true, false]];
        if (namer !== null) {
            const paramNames = new Set(['left', 'right']);
            args = bldrbase.makeNamedArgs(namer, 'PlanBuilder.or', 2, paramNames, paramdefs, args);
        } else {
            args = bldrbase.makePositionalArgs('PlanBuilder.or', 2, true, paramdefs, args);
        }
        return new types.XsBoolean('op', 'or', args);
    }
subtract(...args) {
        const namer = bldrbase.getNamer(args, 'left');
        const paramdefs = [['left', types.XsNumeric, true, false], ['right', types.XsNumeric, true, false]];
        if (namer !== null) {
            const paramNames = new Set(['left', 'right']);
            args = bldrbase.makeNamedArgs(namer, 'PlanBuilder.subtract', 2, paramNames, paramdefs, args);
        } else {
            args = bldrbase.makePositionalArgs('PlanBuilder.subtract', 2, false, paramdefs, args);
        }
        return new types.XsNumeric('op', 'subtract', args);
    }param(...args) {
    const paramdef = ['name', types.XsString, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('PlanBuilder.param', 1, paramdef, args);
    return new PlanParam('op', 'param', checkedArgs);
    }
col(...args) {
    const paramdef = ['column', types.XsString, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('PlanBuilder.col', 1, paramdef, args);
    return new PlanColumn('op', 'col', checkedArgs);
    }
schemaCol(...args) {
    const namer = bldrbase.getNamer(args, 'schema');
    const paramdefs = [['schema', types.XsString, true, false], ['view', types.XsString, true, false], ['column', types.XsString, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.schemaCol', 3, new Set(['schema', 'view', 'column']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.schemaCol', 3, false, paramdefs, args);
    return new PlanColumn('op', 'schema-col', checkedArgs);

    }
viewCol(...args) {
    const namer = bldrbase.getNamer(args, 'view');
    const paramdefs = [['view', types.XsString, true, false], ['column', types.XsString, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.viewCol', 2, new Set(['view', 'column']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.viewCol', 2, false, paramdefs, args);
    return new PlanColumn('op', 'view-col', checkedArgs);

    }
fragmentIdCol(...args) {
    const paramdef = ['column', types.XsString, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('PlanBuilder.fragmentIdCol', 1, paramdef, args);
    return new PlanSystemColumn('op', 'fragment-id-col', checkedArgs);
    }
graphCol(...args) {
    const paramdef = ['column', types.XsString, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('PlanBuilder.graphCol', 1, paramdef, args);
    return new PlanSystemColumn('op', 'graph-col', checkedArgs);
    }
as(...args) {
    const namer = bldrbase.getNamer(args, 'column');
    const paramdefs = [['column', PlanColumn, true, false], ['expression', types.Item, false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.as', 2, new Set(['column', 'expression']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.as', 2, false, paramdefs, args);
    return new PlanExprCol('op', 'as', checkedArgs);

    }
colSeq(...args) {
    const namer = bldrbase.getNamer(args, 'col');
    const paramdefs = [['col', PlanExprCol, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.colSeq', 1, new Set(['col']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.colSeq', 1, true, paramdefs, args);
    return new PlanExprCol('op', 'col-seq', checkedArgs);

    }
fromView(...args) {
    const namer = bldrbase.getNamer(args, 'schema');
    const paramdefs = [['schema', types.XsString, false, false], ['view', types.XsString, true, false], ['qualifierName', types.XsString, false, false], ['sysCols', PlanSystemColumn, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.fromView', 2, new Set(['schema', 'view', 'qualifierName', 'sysCols']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.fromView', 2, false, paramdefs, args);
    return new PlanAccessPlan(null, 'op', 'from-view', checkedArgs);

    }
prefixer(...args) {
    const paramdef = ['base', types.XsString, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('PlanBuilder.prefixer', 1, paramdef, args);
    return new PlanPrefixer('op', 'prefixer', checkedArgs);
    }
fromTriples(...args) {
    const namer = bldrbase.getNamer(args, 'patterns');
    const paramdefs = [['patterns', PlanTriplePattern, true, true], ['qualifierName', types.XsString, false, false], ['graphIris', types.XsString, false, true], ['option', PlanTripleOption, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.fromTriples', 1, new Set(['patterns', 'qualifierName', 'graphIris', 'option']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.fromTriples', 1, false, paramdefs, args);
    return new PlanAccessPlan(null, 'op', 'from-triples', checkedArgs);

    }
pattern(...args) {
    const namer = bldrbase.getNamer(args, 'subjects');
    const paramdefs = [['subjects', PlanTriplePosition, false, true], ['predicates', PlanTriplePosition, false, true], ['objects', PlanTriplePosition, false, true], ['sysCols', PlanSystemColumn, false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.pattern', 3, new Set(['subjects', 'predicates', 'objects', 'sysCols']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.pattern', 3, false, paramdefs, args);
    return new PlanTriplePattern('op', 'pattern', checkedArgs);

    }
patternSeq(...args) {
    const namer = bldrbase.getNamer(args, 'pattern');
    const paramdefs = [['pattern', PlanTriplePattern, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.patternSeq', 1, new Set(['pattern']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.patternSeq', 1, true, paramdefs, args);
    return new PlanTriplePattern('op', 'pattern-seq', checkedArgs);

    }
subjectSeq(...args) {
    const namer = bldrbase.getNamer(args, 'subject');
    const paramdefs = [['subject', PlanTriplePosition, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.subjectSeq', 1, new Set(['subject']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.subjectSeq', 1, true, paramdefs, args);
    return new PlanTriplePosition('op', 'subject-seq', checkedArgs);

    }
predicateSeq(...args) {
    const namer = bldrbase.getNamer(args, 'predicate');
    const paramdefs = [['predicate', PlanTriplePosition, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.predicateSeq', 1, new Set(['predicate']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.predicateSeq', 1, true, paramdefs, args);
    return new PlanTriplePosition('op', 'predicate-seq', checkedArgs);

    }
objectSeq(...args) {
    const namer = bldrbase.getNamer(args, 'object');
    const paramdefs = [['object', PlanTriplePosition, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.objectSeq', 1, new Set(['object']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.objectSeq', 1, true, paramdefs, args);
    return new PlanTriplePosition('op', 'object-seq', checkedArgs);

    }
fromLexicons(...args) {
    const namer = bldrbase.getNamer(args, 'indexes');
    const paramdefs = [['indexes', PlanCtsReferenceMap, true, false], ['qualifierName', types.XsString, false, false], ['sysCols', PlanSystemColumn, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.fromLexicons', 1, new Set(['indexes', 'qualifierName', 'sysCols']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.fromLexicons', 1, false, paramdefs, args);
    return new PlanAccessPlan(null, 'op', 'from-lexicons', checkedArgs);

    }
fromLiterals(...args) {
    const namer = bldrbase.getNamer(args, 'rows');
    const paramdefs = [['rows', PlanXsValueMap, false, true], ['qualifierName', types.XsString, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.fromLiterals', 1, new Set(['rows', 'qualifierName']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.fromLiterals', 1, false, paramdefs, args);
    return new PlanAccessPlan(null, 'op', 'from-literals', checkedArgs);

    }
fromSPARQL(...args) {
    const namer = bldrbase.getNamer(args, 'select');
    const paramdefs = [['select', types.XsString, true, false], ['qualifierName', types.XsString, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.fromSPARQL', 1, new Set(['select', 'qualifierName']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.fromSPARQL', 1, false, paramdefs, args);
    return new PlanModifyPlan(null, 'op', 'from-sparql', checkedArgs);

    }
fromSQL(...args) {
    const namer = bldrbase.getNamer(args, 'select');
    const paramdefs = [['select', types.XsString, true, false], ['qualifierName', types.XsString, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.fromSQL', 1, new Set(['select', 'qualifierName']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.fromSQL', 1, false, paramdefs, args);
    return new PlanModifyPlan(null, 'op', 'from-sql', checkedArgs);

    }
sqlCondition(...args) {
    const paramdef = ['expression', types.XsString, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('PlanBuilder.sqlCondition', 1, paramdef, args);
    return new PlanCondition('op', 'sql-condition', checkedArgs);
    }
on(...args) {
    const namer = bldrbase.getNamer(args, 'left');
    const paramdefs = [['left', PlanExprCol, true, false], ['right', PlanExprCol, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.on', 2, new Set(['left', 'right']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.on', 2, false, paramdefs, args);
    return new PlanJoinKey('op', 'on', checkedArgs);

    }
joinKeySeq(...args) {
    const namer = bldrbase.getNamer(args, 'key');
    const paramdefs = [['key', PlanJoinKey, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.joinKeySeq', 1, new Set(['key']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.joinKeySeq', 1, true, paramdefs, args);
    return new PlanJoinKey('op', 'join-key-seq', checkedArgs);

    }
avg(...args) {
    const namer = bldrbase.getNamer(args, 'name');
    const paramdefs = [['name', PlanColumn, true, false], ['column', PlanExprCol, true, false], ['option', PlanValueOption, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.avg', 2, new Set(['name', 'column', 'option']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.avg', 2, false, paramdefs, args);
    return new PlanAggregateCol('op', 'avg', checkedArgs);

    }
arrayAggregate(...args) {
    const namer = bldrbase.getNamer(args, 'name');
    const paramdefs = [['name', PlanColumn, true, false], ['column', PlanExprCol, true, false], ['option', PlanValueOption, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.arrayAggregate', 2, new Set(['name', 'column', 'option']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.arrayAggregate', 2, false, paramdefs, args);
    return new PlanAggregateCol('op', 'array-aggregate', checkedArgs);

    }
count(...args) {
    const namer = bldrbase.getNamer(args, 'name');
    const paramdefs = [['name', PlanColumn, true, false], ['column', PlanExprCol, false, false], ['option', PlanValueOption, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.count', 1, new Set(['name', 'column', 'option']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.count', 1, false, paramdefs, args);
    return new PlanAggregateCol('op', 'count', checkedArgs);

    }
groupConcat(...args) {
    const namer = bldrbase.getNamer(args, 'name');
    const paramdefs = [['name', PlanColumn, true, false], ['column', PlanExprCol, true, false], ['options', PlanGroupConcatOption, false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.groupConcat', 2, new Set(['name', 'column', 'options']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.groupConcat', 2, false, paramdefs, args);
    return new PlanAggregateCol('op', 'group-concat', checkedArgs);

    }
max(...args) {
    const namer = bldrbase.getNamer(args, 'name');
    const paramdefs = [['name', PlanColumn, true, false], ['column', PlanExprCol, true, false], ['option', PlanValueOption, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.max', 2, new Set(['name', 'column', 'option']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.max', 2, false, paramdefs, args);
    return new PlanAggregateCol('op', 'max', checkedArgs);

    }
min(...args) {
    const namer = bldrbase.getNamer(args, 'name');
    const paramdefs = [['name', PlanColumn, true, false], ['column', PlanExprCol, true, false], ['option', PlanValueOption, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.min', 2, new Set(['name', 'column', 'option']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.min', 2, false, paramdefs, args);
    return new PlanAggregateCol('op', 'min', checkedArgs);

    }
sample(...args) {
    const namer = bldrbase.getNamer(args, 'name');
    const paramdefs = [['name', PlanColumn, true, false], ['column', PlanExprCol, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.sample', 2, new Set(['name', 'column']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.sample', 2, false, paramdefs, args);
    return new PlanAggregateCol('op', 'sample', checkedArgs);

    }
sequenceAggregate(...args) {
    const namer = bldrbase.getNamer(args, 'name');
    const paramdefs = [['name', PlanColumn, true, false], ['column', PlanExprCol, true, false], ['option', PlanValueOption, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.sequenceAggregate', 2, new Set(['name', 'column', 'option']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.sequenceAggregate', 2, false, paramdefs, args);
    return new PlanAggregateCol('op', 'sequence-aggregate', checkedArgs);

    }
sum(...args) {
    const namer = bldrbase.getNamer(args, 'name');
    const paramdefs = [['name', PlanColumn, true, false], ['column', PlanExprCol, true, false], ['option', PlanValueOption, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.sum', 2, new Set(['name', 'column', 'option']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.sum', 2, false, paramdefs, args);
    return new PlanAggregateCol('op', 'sum', checkedArgs);

    }
uda(...args) {
    const namer = bldrbase.getNamer(args, 'name');
    const paramdefs = [['name', PlanColumn, true, false], ['column', PlanExprCol, true, false], ['module', types.XsString, true, false], ['function', types.XsString, true, false], ['arg', types.XsAnyAtomicType, false, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.uda', 4, new Set(['name', 'column', 'module', 'function', 'arg']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.uda', 4, false, paramdefs, args);
    return new PlanAggregateCol('op', 'uda', checkedArgs);

    }
aggregateSeq(...args) {
    const namer = bldrbase.getNamer(args, 'aggregate');
    const paramdefs = [['aggregate', PlanAggregateCol, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.aggregateSeq', 1, new Set(['aggregate']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.aggregateSeq', 1, true, paramdefs, args);
    return new PlanAggregateCol('op', 'aggregate-seq', checkedArgs);

    }
asc(...args) {
    const paramdef = ['column', PlanExprCol, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('PlanBuilder.asc', 1, paramdef, args);
    return new PlanSortKey('op', 'asc', checkedArgs);
    }
desc(...args) {
    const paramdef = ['column', PlanExprCol, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('PlanBuilder.desc', 1, paramdef, args);
    return new PlanSortKey('op', 'desc', checkedArgs);
    }
sortKeySeq(...args) {
    const namer = bldrbase.getNamer(args, 'key');
    const paramdefs = [['key', PlanSortKey, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.sortKeySeq', 1, new Set(['key']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.sortKeySeq', 1, true, paramdefs, args);
    return new PlanSortKey('op', 'sort-key-seq', checkedArgs);

    }
modulo(...args) {
    const namer = bldrbase.getNamer(args, 'left');
    const paramdefs = [['left', types.XsNumeric, true, false], ['right', types.XsNumeric, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.modulo', 2, new Set(['left', 'right']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.modulo', 2, false, paramdefs, args);
    return new types.XsNumeric('op', 'modulo', checkedArgs);

    }
case(...args) {
    const namer = bldrbase.getNamer(args, 'cases');
    const paramdefs = [['cases', PlanCase, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.case', 1, new Set(['cases']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.case', 1, true, paramdefs, args);
    return new types.Item('op', 'case', checkedArgs);

    }
when(...args) {
    const namer = bldrbase.getNamer(args, 'condition');
    const paramdefs = [['condition', types.XsBoolean, true, false], ['value', types.Item, false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.when', 2, new Set(['condition', 'value']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.when', 2, false, paramdefs, args);
    return new PlanCase('op', 'when', checkedArgs);

    }
else(...args) {
    const paramdef = ['value', types.Item, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('PlanBuilder.else', 1, paramdef, args);
    return new PlanCase('op', 'else', checkedArgs);
    }
xpath(...args) {
    const namer = bldrbase.getNamer(args, 'column');
    const paramdefs = [['column', PlanColumn, true, false], ['path', types.XsString, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.xpath', 2, new Set(['column', 'path']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.xpath', 2, false, paramdefs, args);
    return new types.Node('op', 'xpath', checkedArgs);

    }
jsonDocument(...args) {
    const paramdef = ['root', types.JsonRootNode, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('PlanBuilder.jsonDocument', 1, paramdef, args);
    return new types.DocumentNode('op', 'json-document', checkedArgs);
    }
jsonObject(...args) {
    const namer = bldrbase.getNamer(args, 'property');
    const paramdefs = [['property', PlanJsonProperty, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.jsonObject', 1, new Set(['property']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.jsonObject', 1, true, paramdefs, args);
    return new types.ObjectNode('op', 'json-object', checkedArgs);

    }
prop(...args) {
    const namer = bldrbase.getNamer(args, 'key');
    const paramdefs = [['key', types.XsString, true, false], ['value', types.JsonContentNode, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.prop', 2, new Set(['key', 'value']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.prop', 2, false, paramdefs, args);
    return new PlanJsonProperty('op', 'prop', checkedArgs);

    }
jsonArray(...args) {
    const namer = bldrbase.getNamer(args, 'property');
    const paramdefs = [['property', types.JsonContentNode, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.jsonArray', 1, new Set(['property']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.jsonArray', 1, true, paramdefs, args);
    return new types.ArrayNode('op', 'json-array', checkedArgs);

    }
jsonString(...args) {
    const paramdef = ['value', types.XsAnyAtomicType, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('PlanBuilder.jsonString', 1, paramdef, args);
    return new types.TextNode('op', 'json-string', checkedArgs);
    }
jsonNumber(...args) {
    const paramdef = ['value', types.XsNumeric, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('PlanBuilder.jsonNumber', 1, paramdef, args);
    return new types.NumberNode('op', 'json-number', checkedArgs);
    }
jsonBoolean(...args) {
    const paramdef = ['value', types.XsBoolean, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('PlanBuilder.jsonBoolean', 1, paramdef, args);
    return new types.BooleanNode('op', 'json-boolean', checkedArgs);
    }
jsonNull(...args) {
    bldrbase.checkMaxArity('PlanBuilder.jsonNull', args.length, 0);
    return new types.NullNode('op', 'json-null', args);
    }
xmlDocument(...args) {
    const paramdef = ['root', types.XmlRootNode, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('PlanBuilder.xmlDocument', 1, paramdef, args);
    return new types.DocumentNode('op', 'xml-document', checkedArgs);
    }
xmlElement(...args) {
    const namer = bldrbase.getNamer(args, 'name');
    const paramdefs = [['name', types.XsQName, true, false], ['attributes', types.AttributeNode, false, true], ['content', types.XmlContentNode, false, true]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.xmlElement', 1, new Set(['name', 'attributes', 'content']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.xmlElement', 1, false, paramdefs, args);
    return new types.ElementNode('op', 'xml-element', checkedArgs);

    }
xmlAttribute(...args) {
    const namer = bldrbase.getNamer(args, 'name');
    const paramdefs = [['name', types.XsQName, true, false], ['value', types.XsAnyAtomicType, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.xmlAttribute', 2, new Set(['name', 'value']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.xmlAttribute', 2, false, paramdefs, args);
    return new types.AttributeNode('op', 'xml-attribute', checkedArgs);

    }
xmlText(...args) {
    const paramdef = ['value', types.XsAnyAtomicType, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('PlanBuilder.xmlText', 1, paramdef, args);
    return new types.TextNode('op', 'xml-text', checkedArgs);
    }
xmlComment(...args) {
    const paramdef = ['content', types.XsAnyAtomicType, true, false];
    const checkedArgs = bldrbase.makeSingleArgs('PlanBuilder.xmlComment', 1, paramdef, args);
    return new types.CommentNode('op', 'xml-comment', checkedArgs);
    }
xmlPi(...args) {
    const namer = bldrbase.getNamer(args, 'name');
    const paramdefs = [['name', types.XsString, true, false], ['value', types.XsAnyAtomicType, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.xmlPi', 2, new Set(['name', 'value']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.xmlPi', 2, false, paramdefs, args);
    return new types.ProcessingInstructionNode('op', 'xml-pi', checkedArgs);

    }
xmlAttributeSeq(...args) {
    const namer = bldrbase.getNamer(args, 'attribute');
    const paramdefs = [['attribute', types.AttributeNode, true, false]];
    const checkedArgs = (namer !== null) ?
        bldrbase.makeNamedArgs(namer, 'PlanBuilder.xmlAttributeSeq', 1, new Set(['attribute']), paramdefs, args) :
        bldrbase.makePositionalArgs('PlanBuilder.xmlAttributeSeq', 1, true, paramdefs, args);
    return new types.AttributeNode('op', 'xml-attribute-seq', checkedArgs);

    }
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
  Plan:        PlanPlan
};
