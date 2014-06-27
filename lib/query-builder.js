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
function asIndex(index) {
  return valcheck.isString(index) ? property(index) : index;
}
function addIndex(query, index, isContainer) {
  var containerOnly = isContainer || false;
  if (index['json-property'] !== undefined) {
    query['json-property'] = index['json-property'];
  } else if (index.element !== undefined) {
    query.element = index.element;
    if (index.attribute !== undefined) {
      query.attribute = attribute;
    }
  } else if (containerOnly) {
  } else if (index.field !== undefined) {
    query.field = index.field;
  } else if (index['path-index'] !== undefined) {
    query['path-index'] = index['path-index'];
  }
}

function and() {
  var args = mlutil.asArray(arguments);
  var query = {
    queries: []
  };
  var seekingOrdered = true;
  for (var i=0; i < args.length; i++) {
    var arg = args[i];
    if (seekingOrdered && arg.ordered !== null && arg.ordered !== undefined) {
      query.ordered = arg.ordered;
      seekingOrdered = false;
    } else if (arg instanceof Array){
      Array.prototype.push.apply(query.queries, arg);
    } else if (seekingOrdered && valcheck.isBoolean(arg)) {
      query.ordered = arg;
      seekingOrdered = false;
    } else {
      query.queries.push(arg);
    }
  }
  return {'and-query': query};
}
function andNot() {
  var args = mlutil.arrayCount(arguments, 2);
  switch(args.length) {
  case 0:
    throw new Error('missing positive and negative queries: '+args);
  case 1:
    throw new Error('missing negative query: '+args);
  default:
    return {'and-not-query':{
      'positive-query': args[0],
      'negative-query': args[1]
    }};
  }
}
function attribute() {
  var args = mlutil.asArray(arguments);
  switch(args.length) {
  case 0:
    throw new Error('missing element and attribute: '+args);
  case 1:
    throw new Error('missing attribute: '+args);
  case 2:
    return {
      element:   (args[0].qname) ? args[0].qname : nsName.call(this, args[0]),
      attribute: (args[1].qname) ? args[1].qname : nsName.call(this, args[1])
      };
  case 3:
    if (args[0].qname)
      return {
        element: args[0].qname,
        attribute:{ns: args[1], name: args[2]}
      };
    if (args[2].qname)
      return {
        element:{ns: args[0], name: args[1]},
        attribute: args[2].qname
      };
    if (args[0] instanceof Array)
      return {
        element: nsName.call(this, args[0]),
        attribute:{ns: args[1], name: args[2]}
      };
    return {
      element:{ns: args[0], name: args[1]},
      attribute: nsName.call(this, args[2])
      };
  default:
    return {
      element:{ns: args[0], name: args[1]},
      attribute:{ns: args[2], name: args[3]}
      };
 }
}
function boost() {
  var args = mlutil.arrayCount(arguments, 2);
  switch(args.length) {
  case 0:
    throw new Error('missing matching and boosting queries: '+args);
  case 1:
    throw new Error('missing boosting query: '+args);
  default:
    return {'boost-query':{
      'matching-query': args[0],
      'boosting-query': args[1]
    }};
  }
}
function box() {
  var args = mlutil.asArray(arguments);
  var region = null;
  for (var i=0; i < args.length; i++) {
    var arg = args[i];
    switch(i) {
    case 0:
      if (arg.south && arg.west && arg.north && arg.east) {
        region = arg;
      } else {
        region = {south: arg};
      }
      break;
    case 1:
      region.west = arg;
      break;
    case 2:
      region.north = arg;
      break;
    case 3:
      region.east = arg;
      break;
    default:
      throw new Error('unsupported parameter: '+arg);
    }
  }
  return {box: region};
}
function circle() {
  var args = mlutil.asArray(arguments);
  var query = {};
  var seekingRadius    = true;
  var seekingLatitude  = true;
  var seekingLongitude = true;
  var point = null;
  for (var i=0; i < args.length; i++) {
    var arg = args[i];
    if (seekingRadius && valcheck.isNumber(arg)) {
      query.radius = arg;
      seekingRadius = false;
    } else if (seekingLatitude && arg.point) {
      query.point = arg.point;
      seekingLatitude  = false;
      seekingLongitude = false;
    } else if (seekingLatitude && arg.latitude && arg.longitude) {
      query.point = [arg];
      seekingLatitude  = false;
      seekingLongitude = false;
    } else if (seekingLatitude && arg instanceof Array && arg.length === 2) {
      query.point = [{latitude: arg[0], longitude: arg[1]}];
      seekingLatitude  = false;
      seekingLongitude = false;
    } else if (seekingLatitude && valcheck.isNumber(arg)) {
      point = {latitude: arg};
      seekingLatitude = false;
    } else if (seekingLongitude && valcheck.isNumber(arg)) {
      point.longitude = arg;
      seekingLongitude = false;
    } else {
      throw new Error('unsupported parameter: '+arg);
    }
  }
  if (point !== null && point.latitude && point.longitude) {
    query.point = [point];
  } else if (seekingLatitude || seekingLongitude) {
    throw new Error('failed to discover latitude and longitude: '+args);
  }
  return {circle: query};
}
function collection() {
  var args = mlutil.asArray(arguments);
  var argLen = args.length;
  if (argLen === 0) {
    return {collection: null};
  }
  if (argLen <= 2) {
    for (var i=0; i < argLen; i++) {
      var arg = args[i];
      var constraintName = arg.constraintName;
      if (constraintName !== undefined) {
        var qualifier = {};
        if (argLen === 2) {
          var prefix = args[(i + 1) % 2];
          if (prefix !== undefined) {
            qualifier.prefix = prefix;
          }
        }
        return {
          name: constraintName,
          collection: qualifier
        };
      }
    }
  }
  return {'collection-query': {
    uri: args
  }};
}
function scope() {
  var args = mlutil.asArray(arguments);
  if (args.length < 1) {
    throw new Error('element or property scope not specified: '+args);
  }
  var constraintIndex = null;
  var constraint = {};
  var constraintName;
  var hasQuery = false;
  for (var i=0; i < args.length; i++) {
    var arg = args[i];
    if (i === 0) {
      constraintIndex = asIndex(arg);
      addIndex(constraint, constraintIndex, true);
      continue;
    }
    if (fragmentScope === undefined) {
      var fragmentScope = arg['fragment-scope'];
      if (fragmentScope !== undefined) {
        constraint['fragment-scope'] = fragmentScope;
        continue;
      }
    }
    if (constraintName === undefined) {
      constraintName = arg.constraintName;
      if (constraintName !== undefined) {
        continue;
      }
    }
    if (hasQuery) {
      continue;
    }
    hasQuery = true;
    var queryKeys = Object.keys(arg);
    for (var j=0; j < queryKeys.length; j++) {
      var queryKey = queryKeys[j];
      constraint[queryKey] = arg[queryKey];
    }
  }

  var wrapper = {};
  if (hasQuery) {
    if (constraintName === undefined) {
      wrapper['container-query'] = constraint;
    } else {
      throw new Error('scope has both binding and query: '+args);
    }
  } else {
    if (constraintName === undefined) {
      constraintName = defaultConstraintName(constraintIndex);
      if (constraintName === null) {
        throw new Error('could not default constraint name from '+
            Object.keys(constraintIndex).join(', ') + ' index'
            );
      }
    }
    wrapper.name = constraintName;
    wrapper.container = constraint;
  }

  return wrapper;
}
function datatype() {
  var args = mlutil.asArray(arguments);
  switch(args.length) {
  case 0:
    throw new Error('missing datatype: '+args);
  case 1:
    return {datatype: args[0].match(/^xs:/) ? args[0] : 'xs:'+args[0]};
  default:
    return {datatype: args[0].match(/^xs:/) ? args[0] : 'xs:'+args[0],
        'collation': args[1]};
  }
}
function directory() {
  var args = mlutil.asArray(arguments);
  var query = {
      uri: []
  };
  var seekingInfinite = true;
  for (var i=0; i < args.length; i++) {
    var arg = args[i];
    if (seekingInfinite && valcheck.isBoolean(arg)) {
      query.infinite = arg;
      seekingInfinite = false;
    } else if (arg instanceof Array){
      Array.prototype.push.apply(query.uri, arg);
    } else {
      query.uri.push(arg);
    }
  }
  return {'directory-query': query};
}
function document() {
  return {'document-query':{
    uri: mlutil.asArray(arguments)
  }};
}
function documentFragment() {  
  return {'document-fragment-query': mlutil.first(arguments)};
}
function element() {
  var args = mlutil.asArray(arguments);
  switch(args.length) {
  case 0:
    throw new Error('missing element: '+args);
  case 1:
    return {
      element: (args[0].qname) ? args[0].qname : {name: args[0]}
    };
  default:
    return {element:{ns: args[0], name: args[1]}};
 }
}
function field() {
  return {field: mlutil.first(arguments)};
}
function fragmentScope() {
  var scope = mlutil.first(arguments);
  if (scope === 'documents' || scope === 'properties') {
    return {'fragment-scope': scope};
  }
  throw new Error('unknown argument: '+scope);
}
function geoAttributePair() {
  var args = mlutil.asArray(arguments);
  if (args.length < 3)
    throw new Error('not enough parameters: '+args);
  var query = {};
  var keys = ['parent', 'lat', 'lon'];
  var iArg=0;
  for (var i=0; i < keys.length; i++) {
    var key = keys[i];
    var arg = args[iArg++];
    if (arg.qname) {
      query[key] = arg.qname;
    } else if (valcheck.isString(arg)) {
      query[key] = nsName.call(this, arg);
    } else if (arg.element) {
      if (key === 'parent' || !query.parent) {
        query.parent = arg.element;
      }
      if (arg.attribute) {
        if (key === 'parent') {
          i++;
        }
        query[keys[i]] = arg.attribute;
      }
    } else {
      throw new Error('no parameter for '+key+': '+JSON.stringify(arg));
    }
  }
  return geoQuery('geo-attr-pair', args, query, iArg);
}
function geoElement() {
  var args = mlutil.asArray(arguments);
  if (args.length < 2)
    throw new Error('not enough parameters: '+args);
  var query = {};
  var keys = ['parent', 'element'];
  for (var i=0; i < keys.length; i++) {
    var key = keys[i];
    var arg = args[i];
    if (arg.qname) {
      query[key] = arg.qname;
    } else if (valcheck.isString(arg)) {
      query[key] = nsName.call(this, arg);
    } else if (arg.element) {
      query[key] = arg.element;
    } else {
      throw new Error('no parameter for '+key+': '+JSON.stringify(arg));
    }
  }
  return geoQuery('geo-elem', args, query, 2);
}
function geoElementPair() {
  var args = mlutil.asArray(arguments);
  if (args.length < 3)
    throw new Error('not enough parameters: '+args);
  var query = {};
  var keys = ['parent', 'lat', 'lon'];
  for (var i=0; i < keys.length; i++) {
    var key = keys[i];
    var arg = args[i];
    if (arg.qname) {
      query[key] = arg.qname;
    } else if (valcheck.isString(arg)) {
      query[key] = nsName.call(this, arg);
    } else if (arg.element) {
      query[key] = arg.element;
    } else {
      throw new Error('no parameter for '+key+': '+JSON.stringify(arg));
    }
  }
  return geoQuery('geo-elem-pair', args, query, 3);
}
function geoPath() {
  var args = mlutil.asArray(arguments);
  if (args.length < 1)
    throw new Error('not enough parameters: '+args);
  var query = {};
  var arg = args[0];
  if (arg['path-index']) {
    query['path-index'] = arg['path-index'];
  } else if (arg instanceof Array && arg.length === 2 && valcheck.isString(arg[0])) {
    query['path-index'] = {text: arg[0], namespaces: arg[1]};
  } else if (valcheck.isString(arg)) {
    query['path-index'] = {text: arg};
  }
  return geoQuery('geo-path', args, query, 1);
}
function geoQuery(variant, args, query, next) {
  var seekingFragmentScope = true;
  var seekingGeoOption = true;
  var seekingRegion = true;
  var seekingHeatmap = true;
  var constraintName;
  for (var i=next; i < args.length; i++) {
    var arg = args[i];
    if (seekingGeoOption && arg['geo-option']) {
      query['geo-option'] = arg['geo-option'];
      seekingGeoOption = false;
    } else if (seekingFragmentScope && arg['fragment-scope']) {
      query['fragment-scope'] = arg['fragment-scope'];
      seekingFragmentScope = false;
    } else if (seekingHeatmap && arg.heatmap) {
      query.heatmap = arg.heatmap;
      seekingHeatmap = false;
    } else if (constraintName !== undefined) {
      continue;
    } else if (seekingRegion && arg.box) {
      query.box = arg.box;
      seekingRegion = false;
    } else if (seekingRegion && arg.circle) {
      query.circle = arg.circle;
      seekingRegion = false;
    } else if (seekingRegion && arg.point) {
      query.point = arg.point;
      seekingRegion = false;
    } else if (seekingRegion && arg.latitude && arg.longitude) {
      query.point = [arg];
      seekingRegion = false;
    } else if (seekingRegion && arg.polygon) {
      query.polygon = arg.polygon;
      seekingRegion = false;
    } else if (seekingRegion && arg instanceof Array && arg.length === 2) {
      query.point = [latlon.call(this, arg)];
    } else {
      if (constraintName === undefined) {
        constraintName = arg.constraintName;
        if (constraintName !== undefined) {
          continue;
        }
      }
      throw new Error('unknown parameter: '+arg);
    }
  }

  var wrapper = {};
  if (constraintName === undefined) {
    wrapper[variant+'-query'] = query;
  } else {
    wrapper.name = constraintName;
    wrapper[variant] = query;
  }
  return wrapper;
}
function heatmap() {
  var args = mlutil.asArray(arguments);
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
function geoOption() {
  return {'geo-option': mlutil.asArray(arguments)};
}
function latlon() {
  var args = mlutil.asArray(arguments);
  if (args.length != 2)
    throw new Error('incorrect parameters: '+args);
  return {latitude: args[0], longitude: args[1]};
}
function locks() {  
  return {'locks-query': mlutil.first(arguments)};
}
function near() {
  var args = mlutil.asArray(arguments);
  var query = {
    queries: []
  };
  var seekingDistance = true;
  var seekingOrdered = true;
  var seekingWeight = true;
  for (var i=0; i < args.length; i++) {
    var arg = args[i];
    if (seekingOrdered && arg.ordered !== null && arg.ordered !== undefined) {
      query.ordered = arg.ordered;
      seekingOrdered = false;
    } else if (seekingWeight && arg.weight) {
      query.weight = arg.weight;
      seekingWeight = false;
    } else if (seekingDistance && valcheck.isNumber(arg)) {
      query.distance = arg;
      seekingDistance = false;
    } else if (arg instanceof Array){
      Array.prototype.push.apply(query.queries, arg);
    } else {
      query.queries.push(arg);
    }
  }
  return {'near-query': query};
}
function not() {  
  return {'not-query': mlutil.first(arguments)};
}
function or() {
  return {'or-query':{
      queries: mlutil.asArray(arguments)
    }};
}
function ordered() {
  return {ordered: mlutil.first(arguments)};
}
function pathIndex() {
  var args = mlutil.asArray(arguments);
  var query = null;
  switch(args.length) {
  case 0:
    throw new Error('missing index: '+args);
  case 1:
    query = {
      text: args[0]
    };
    break;
  default:
    query = {
      text: args[0],
      namespaces: args[1]
    };
    break;
  }
  return {'path-index': query};
}
function point() {
  var args = mlutil.asArray(arguments);
  var region = null;
  for (var i=0; i < args.length; i++) {
    var arg = args[i];
    switch(i) {
    case 0:
      if (arg.latitude && arg.longitude) {
        region = arg;
      } else {
        region = {latitude: arg};
      }
      break;
    case 1:
      region.longitude = arg;
      break;
    default:
      throw new Error('unsupported parameter: '+arg);
    }
  }
  return {point: [region]};
}
function polygon() {
  var args = mlutil.asArray(arguments);
  var points = [];
  for (var i=0; i < args.length; i++) {
    var arg = args[i];
    if (arg.point) {
      points.push(arg.point[0]);
    } else if (arg.latitude && arg.longitude) {
      points.push(arg);
    } else if (arg instanceof Array && arg.length === 2){
      points.push({latitude: arg[0], longitude: arg[1]});
    } else {
      throw new Error('unsupported parameter: '+arg);
    }
  }
  return {polygon:{point: points}};
}
function properties() {  
  return {'properties-query': mlutil.first(arguments)};
}
function property() {
  return {'json-property': mlutil.first(arguments)};
}
function qname() {
  return {qname: nsName(arguments)};
}
function nsName(callerArgs) {
  var args = mlutil.asArray(callerArgs);
  switch(args.length) {
  case 0:
    throw new Error('no name');
  case 1:
    return {name: args[0]};
  case 2:
    return {ns: args[0], name: args[1]};
  default:
    throw new Error('too many arguments: '+args.length);
  }
}
function range() {
  var args = mlutil.asArray(arguments);
  var constraint = {};
  var constraintIndex = null;
  var values = null;
  var operator = null;
  var seekingDatatype = true;
  var seekingFragmentScope = true;
  var seekingRangeOption = true;
  var constraintName;
  var defaultConstraint;
  for (var i=0; i < args.length; i++) {
    var arg = args[i];
    if (i === 0) {
      constraintIndex = asIndex(arg);
      addIndex(constraint, constraintIndex, true);
    } else if (seekingDatatype && arg.datatype !== undefined) {
      constraint.type = arg.datatype;
      if (arg.collation) {
        constraint.collation = arg.collation;
      }
      seekingDatatype = false;
    } else if (seekingFragmentScope && arg['fragment-scope'] !== undefined) {
      constraint['fragment-scope'] = arg['fragment-scope'];
      seekingFragmentScope = false;
    } else if (seekingRangeOption && arg['range-option'] !== undefined) {
      constraint['range-option'] = arg['range-option'];
      seekingRangeOption = false;
    } else if (arg instanceof Array){
      if (values === null) {
        values = arg;
      } else {
        Array.prototype.push.apply(values, arg);        
      }
    } else if ((seekingDatatype || operator === null) && valcheck.isString(arg)) {
      var testType = (seekingDatatype) ? datatypes[arg.trim()] : null;
      if (testType) {
        constraint.type = testType;
        seekingDatatype = false;
      } else {
        var testComp = (operator === null) ? comparisons[arg.trim()] : null;
        if (testComp !== null && testComp !== undefined) {
          operator = testComp;
        } else if (values === null) {
          values = [arg];
        } else {
          values.push(arg);
        }
      }
    } else {
      if (constraintName === undefined) {
        constraintName = arg.constraintName;
        if (constraintName !== undefined) {
          continue;
        }
      }
      if (defaultConstraint === undefined) {
        defaultConstraint = arg.defaultConstraint;
        if (defaultConstraint !== undefined) {
          continue;
        }
      }
      if (values === null) {
        values = [arg];
      } else {
        values.push(arg);
      }
    }
  }

  var wrapper = {};
  if (values !== null) {
    if (constraintName === undefined) {
      constraint['range-operator'] = (operator !== null) ? operator : 'EQ';
      constraint.value = values;
      wrapper['range-query'] = constraint;
    } else {
      throw new Error('range has both binding and query: '+args);
    }
  } else if (defaultConstraint !== undefined) {
    wrapper['default'] = {range: constraint};
  } else {
    if (constraintName === undefined) {
      constraintName = defaultConstraintName(constraintIndex);
      if (constraintName === null) {
        throw new Error('could not default constraint name from '+
            Object.keys(constraintIndex).join(', ') + ' index'
            );
      }
    }
    wrapper.name = constraintName;
    wrapper.range = constraint;
  }

  return wrapper;
}
function rangeOption() {
  return {'range-option': mlutil.asArray(arguments)};
}
function southWestNorthEast() {
  var args = mlutil.asArray(arguments);
  if (args.length != 4)
    throw new Error('incorrect parameters: '+args);
  return {south: args[0], west: args[1], north: args[2], east: args[3]};
}
function term() {
  var args = mlutil.asArray(arguments);
  var query = {
      text: []
  };
  var seekingWeight = true;
  for (var i=0; i < args.length; i++) {
    var arg = args[i];
    if (seekingWeight && arg.weight) {
      query.weight = arg.weight;
      seekingWeight = false;
    } else if (arg instanceof Array){
      Array.prototype.push.apply(query.text, arg);
    } else if (seekingWeight && valcheck.isNumber(arg)) {
      query.weight = arg;
      seekingWeight = false;
    } else {
      query.text.push(arg);
    }
  }
  return {'term-query': query};
}
function termOption() {
  return {'term-option': mlutil.asArray(arguments)};
}
function textQuery(variant, callerArgs) {
  var args = mlutil.asArray(callerArgs);
  var constraint = {};
  var constraintIndex = null;
  var text = null;
  var seekingFragmentScope = true;
  var seekingTermOption = true;
  var seekingWeight = true;
  var constraintName;
  var defaultConstraint;
  for (var i=0; i < args.length; i++) {
    var arg = args[i];
    if (i === 0) {
      constraintIndex = asIndex(arg);
      addIndex(constraint, constraintIndex, true);
    } else if (seekingFragmentScope && arg['fragment-scope']) {
      constraint['fragment-scope'] = arg['fragment-scope'];
      seekingFragmentScope = false;
    } else if (seekingTermOption && arg['term-option']) {
      constraint['term-option'] = arg['term-option'];
      seekingTermOption = false;
    } else if (seekingWeight && arg.weight) {
      constraint.weight = arg.weight;
      seekingWeight = false;
    } else if (arg instanceof Array) {
      if (text === null) {
        text = arg;
      } else {
        Array.prototype.push.apply(text, arg);        
      }
    } else {
      if (constraintName === undefined) {
        constraintName = arg.constraintName;
        if (constraintName !== undefined) {
          continue;
        }
      }
      if (defaultConstraint === undefined) {
        defaultConstraint = arg.defaultConstraint;
        if (defaultConstraint !== undefined) {
          continue;
        }
      }
      if (text === null) {
        text = [arg];
      } else {
        text.push(arg);
      }
    }
  }

  var wrapper = {};
  if (text !== null) {
    if (constraintName === undefined) {
      constraint.text = text;
      wrapper[variant+'-query'] = constraint;
    } else {
      throw new Error(variant+' has both binding and query: '+args);      
    }
  } else if (defaultConstraint !== undefined) {
    var nested = {};
    nested[variant] = constraint;
    wrapper['default'] = nested;
  } else {
    if (constraintName === undefined) {
      constraintName = defaultConstraintName(constraintIndex);
      if (constraintName === null) {
        throw new Error('could not default constraint name from '+
            Object.keys(constraintIndex).join(', ') + ' index'
            );
      }
    }
    wrapper.name = constraintName;
    wrapper[variant] = constraint;
  }
  
  return wrapper;
}
function value() {
  return textQuery('value', arguments);
}
function weight() {
  return {weight: mlutil.first(arguments)};
}
function word() {
  return textQuery('word', arguments);
}

function QueryBuilder() {
}
QueryBuilder.prototype.where       = where;
QueryBuilder.prototype.calculate   = calculate;
QueryBuilder.prototype.orderBy     = orderBy;
QueryBuilder.prototype.slice       = slice;
QueryBuilder.prototype.withOptions = withOptions;

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

function where() {
  var self = (this instanceof QueryBuilder) ? this : new QueryBuilder();

  var args = mlutil.asArray(arguments);
  var argLen = args.length;
  // TODO: if empty, clear the clause

  var parsedQuery;
  var fragmentScope;
  var queries = null;

  var isQBE = false;
  switch(argLen) {
  case 0:
    self.whereClause = {query: {queries: [and()]}};
    break;
  case 1:
    var firstQuery = args[0];
    if (firstQuery.$query !== undefined) {
      isQBE = true;
      self.whereClause = firstQuery;
    } else {
      var firstWhereClause = {};
      parsedQuery = firstQuery.parsedQuery;
      if (parsedQuery === undefined) {
        firstWhereClause.query = {queries: args};
      } else {
        firstWhereClause.parsedQuery = parsedQuery;
      }
      self.whereClause = firstWhereClause;
    }
    break;
  default:
    for (var i=0; i < argLen; i++) {
      var arg = args[i];
      if (parsedQuery === undefined) {
        parsedQuery = arg.parsedQuery;
        if (parsedQuery !== undefined) {
          continue;
        }
      }
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
    if (parsedQuery !== undefined) {
      whereClause.parsedQuery = parsedQuery;
    }
    if (fragmentScope !== undefined) {
      whereClause['fragment-scope'] = fragmentScope;
    }
    self.whereClause = whereClause;

    break;
  }

  self.queryType   = (isQBE) ? 'qbe' : 'structured';
  self.queryFormat = 'json';

  return self;
}

function byExample(query) {
  switch(arguments.length) {
  case 0:
    return {$query: []};
  case 1:
    if ('$query' in query) {
      return query;
    }
    return {$query: query};
  default:
    return {$query: Array.prototype.slice.call(arguments)};
  }
}

function orderBy() {
  var self = (this instanceof QueryBuilder) ? this : new QueryBuilder();

  var args = mlutil.asArray(arguments);
  // TODO: if empty, clear the clause

  var sortOrder = [];
  for (var i=0; i < args.length; i++) {
    var arg = args[i];
    sortOrder.push(valcheck.isString(arg) ? sort(arg) : arg);
  }

  self.orderByClause = {
    'sort-order': sortOrder      
  };

  return self;
}

function score() {
  return {
    score: (arguments.length === 0) ? null : arguments[0]
  };
}

function sort() {
  var args = mlutil.asArray(arguments);
  if (args.length === 0) {
    throw new Error('missing sorted index: '+args);
  }

  var firstIndex = asIndex(args[0]);
  var isScore = ('score' in firstIndex);

  var sorter = {};
  if (isScore) {
    sorter.score = firstIndex.score;
  } else {
    addIndex(sorter, firstIndex, false);
  }

  for (var i=1; i < args.length; i++) {
    var arg = args[i];
    if (valcheck.isString(arg)) {
      switch (arg) {
      case 'ascending':
      case 'descending':
        sorter.direction = arg;
        break;
      default:
        if (!isScore && arg.match(/^xs:/)) {
          sorter.type = arg;
        }
        break;
      }
    } else if (isScore) {
    } else if ('datatype' in arg) {
      sorter.type = arg.datatype;
      if ('collation' in arg) {
        sorter.collation = arg.collation;
      }
    } else if ('collation' in arg) {
      sorter.type = 'xs:string';
      sorter.collation = arg.collation;
    }
  }

  return sorter;
}

function slice() {
  var self = (this instanceof QueryBuilder) ? this : new QueryBuilder();

  var args = mlutil.asArray(arguments);
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

function calculate() {
  var self = (this instanceof QueryBuilder) ? this : new QueryBuilder();

  var args = mlutil.asArray(arguments);

  // TODO: distinguish facets and values
  var calculateClause = {
      constraint: args
  };
  
  self.calculateClause = calculateClause;

  return self;
}

function facet() {
  var args = mlutil.asArray(arguments);
  var argLen = args.length;
  if (argLen < 1) {
    throw new Error('facet must at a minimum identify the index');
  }

  var constraintName = null;
  var constraintIndex = null;
  var datatype;
  var facetOptions;
  var calculateFunction;
  var buckets = null;
  var computedBuckets = null;
  
  for (var i=0; i < argLen; i++) {
    var arg = args[i];
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
        } else if (arg['json-property'] || arg.element || arg.field || arg['path-index'] ||
            arg.collection !== undefined) {
          constraintIndex = arg;
          continue;
        }
      }
    }
    if (datatype === undefined) {
      datatype = arg.datatype;
      if (datatype !== undefined) {
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
    // TODO: 
    var bucket = arg.bucket;
    if (bucket !== undefined) {
      if (buckets === null) {
        buckets = [bucket];
      } else {
        buckets.push(bucket);
      }
      continue;
    }
    bucket = arg.computedBucket;
    if (bucket !== undefined) {
      if (computedBuckets === null) {
        computedBuckets = [bucket];
      } else {
        computedBuckets.push(bucket);
      }
      continue;
    }
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
  } else {
    facetWrapper.range = constraint;
    // TODO: datatype optional instead of defaulted
    constraint.type = ((datatype !== undefined) ? datatype : 'xs:string');
    for (var key in constraintIndex) {
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

function calculateFunction() {
  var args = mlutil.asArray(arguments);
  if (args.length < 1) {
    throw new Error('calculate function without module name');
  }

  var moduleName = args[0];

  return {
      'start-facet': {
        apply: 'start-facet',
        ns:    'http://marklogic.com/query/custom/'+moduleName,
        at:    '/ext/marklogic/query/custom/'+moduleName+'.xqy'
      },
      'finish-facet': {
        apply: 'finish-facet',
        ns:    'http://marklogic.com/query/custom/'+moduleName,
        at:    '/ext/marklogic/query/custom/'+moduleName+'.xqy'
      }
  };

}

function facetOptions() {
  var args = mlutil.asArray(arguments);
  if (args.length < 1) {
    throw new Error('no facet options');
  }
  return {'facet-option': args};
}
function bucket() {
  var bucketWrapper = {name: arguments[0], label: arguments[0]};
  switch(arguments.length) {
  case 0:
  case 1:
    break;
  case 2:
    var anchor = arguments[1].anchor;
    var value  = arguments[1].value;
    if (anchor && value instanceof Array) {
      bucketWrapper.anchor = anchor;
      var isBucket = (value.length === 2) ?
          twoValueBucket(bucketWrapper, value[0], value[1]) :
          threeValueBucket(bucketWrapper, null, value[0], value[1], null, value[2]);
      if (isBucket) {
        return {computedBucket: bucketWrapper};
      }
    }
    break;
  case 3:
    if (twoValueBucket(bucketWrapper, arguments[1], arguments[2])) {
      return {bucket: bucketWrapper};
    }
    break;
  case 4:
    var anchor1    = arguments[1].anchor;
    var value1     = (anchor1) ? arguments[1].value[0] : arguments[1];
    var comparator = arguments[2];
    var anchor2    = arguments[3].anchor;
    var value2     = (anchor2) ? arguments[3].value[0] : arguments[3];
    if (threeValueBucket(bucketWrapper, anchor1, value1, comparator, anchor2, value2)) {
      if (anchor1 || anchor2) {
        return {computedBucket: bucketWrapper};
      }
      return {bucket: bucketWrapper};
    }
    break;
  }
  throw new Error('a bucket must have a name, a comparison, and bounds (with or without anchors)');
}
function anchor() {
  switch(arguments.length) {
  case 0:
  case 1:
    break;
  case 2:
  case 3:
  case 4:
    return {
      anchor: arguments[0],
      value: Array.prototype.slice.call(arguments, 1)
    };
  default:
    break;
  }
  throw new Error('must specify anchor and at least one value');
}
function twoValueBucket(bucket, value1, value2) {
  if (     value1 === '<') bucket.lt = value2;
  else if (value2 === '>') bucket.lt = value1;
  else if (value1 === '>') bucket.ge = value2;
  else if (value2 === '<') bucket.ge = value1;
  else return false;
  return true;
}
function threeValueBucket(bucket, anchor1, value1, comparator, anchor2, value2) {
  if (comparator === '<') {
    bucket.ge = value1;
    if (anchor1) {
      bucket['ge-anchor'] = anchor1;
    }
    bucket.lt = value2;
    if (anchor2) {
      bucket['lt-anchor'] = anchor2;
    }
  } else if (comparator === '>') {
    bucket.lt = value1;
    if (anchor1) {
      bucket['lt-anchor'] = anchor1;
    }
    bucket.ge = value2;
    if (anchor2) {
      bucket['ge-anchor'] = anchor2;
    }
  } else {
    return false;
  }
  return true;
}
function defaultConstraintName(index) {
  var name = index['json-property'];
  if (name !== undefined) {
    return name;
  }
  name = index.field;
  if (name !== undefined) {
    return name;
  }
  name = index.element;
  if (name !== undefined && index.attribute === undefined) {
    return name;
  }
  return null;
}

function parsedFrom() {
  var args = mlutil.asArray(arguments);
  var argLen = args.length;
  if (arguments.length < 1) {
    throw new Error('no query text');
  }

  var parsedQuery = {qtext: args[0]};
  var constraints;
  var term;
  for (var i=1; i < argLen; i++) {
    var arg = args[i];
    if (constraints === undefined) {
      constraints = arg.constraint;
      if (constraints !== undefined) {
        parsedQuery.constraint = constraints;
      }
    }
    if (term === undefined) {
      term = arg.term;
      if (term !== undefined) {
        parsedQuery.term = term;
      }
    }
  }

  return {parsedQuery: parsedQuery};
}

function parseBindings() {
  var args = mlutil.asArray(arguments);
  var argLen = args.length;
  if (argLen < 1) {
    throw new Error('no bindings for the query text');
  }

  var bindings = {};

  var constraints;
  var defaultConstraints;
  var empty;
  var term;
  for (var i=0; i < argLen; i++) {
    var arg = args[i];
    if (arg.name !== undefined) {
      if (constraints === undefined) {
        constraints = [arg];
      } else {
        constraints.push(arg);
      }
      bindings.constraint = constraints;
      continue;
    }
    if (defaultConstraints === undefined) {
      defaultConstraints = arg['default'];
      if (defaultConstraints !== undefined) {
        if (term === undefined) {
          term = {};
          bindings.term = term;
        }
        term['default'] = defaultConstraints;
        continue;
      }
    }
    if (empty === undefined) {
      empty = arg.empty;
      if (empty !== undefined) {
        if (term === undefined) {
          term = {};
          bindings.term = term;
        }
        term.empty = empty;
        continue;
      }
    }    
    // TODO: special handling for custom
  }

  return bindings;
}
function bind() {
  if (arguments.length === 0) {
    throw new Error('no name to bind as a constraint');
  }
  return {constraintName: arguments[0]};
}
function bindDefault() {
  return {defaultConstraint: true};
}
function bindEmptyAs() {
  return {'empty':{'apply': 'all-results'}};
}
function parseFunction() {
  var args = mlutil.asArray(arguments);
  var argLen = args.length;
  if (argLen < 2) {
    throw new Error('query parse function without module name or binding');
  }

  var moduleName = args[0];

  var constraint = {
      parse: {
        apply: 'parse',
        ns:    'http://marklogic.com/query/custom/'+moduleName,
        at:    '/ext/marklogic/query/custom/'+moduleName+'.xqy'
      },
      facet: false
  };

  var seekingTermOption = true;
  var constraintName;
  for (var i=1; i < args.length; i++) {
    var arg = args[i];
    if (seekingTermOption && arg['term-option']) {
      constraint['term-option'] = arg['term-option'];
      seekingTermOption = false;
    } else {
      if (constraintName === undefined) {
        constraintName = arg.constraintName;
      }
    }
  }

  if (!valcheck.isString(constraintName)) {
    throw new Error('query parse function without a binding to a constraint name');
  }

  return {
    name:   constraintName,
    custom: constraint
    };
}

function withOptions() {
  var self = (this instanceof QueryBuilder) ? this : new QueryBuilder();

  // TODO: share with documents.js
  var optionKeyMapping = {
    search:'search-option',     weight:'quality-weight',
    forestNames:'forest-names', similarDocs:'return-similar',
    metrics:'return-metrics',   relevance:'return-relevance',
    queryPlan:'return-plan',    debug:'debug',
    concurrencyLevel:'concurrency-level',
    category:true,              txid:true
  };

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

module.exports = {
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
    calculate:          calculate,
    calculateFunction:  calculateFunction,
    circle:             circle,
    collection:         collection,
    copyFrom:           copyFromQueryBuilder,
    datatype:           datatype,
    directory:          directory,
    document:           document,
    documentFragment:   documentFragment,
    element:            element,
    facet:              facet,
    facetOptions:       facetOptions,
    field:              field,
    fragmentScope:      fragmentScope,
    geoAttributePair:   geoAttributePair,
    geoElement:         geoElement,
    geoElementPair:     geoElementPair,
    geoPath:            geoPath,
    geoOption:          geoOption,
    heatmap:            heatmap,
    latlon:             latlon,
    locks:              locks,
    near:               near,
    not:                not,
    pathIndex:          pathIndex,
    point:              point,
    polygon:            polygon,
    properties:         properties,
    property:           property,
    byExample:          byExample,
    qname:              qname,
    or:                 or,
    orderBy:            orderBy,
    ordered:            ordered,
    parseBindings:      parseBindings,
    parsedFrom:         parsedFrom,
    parseFunction:      parseFunction,
    range:              range,
    rangeOption:        rangeOption,
    score:              score,
    scope:              scope,
    slice:              slice,
    sort:               sort,
    southWestNorthEast: southWestNorthEast,
    term:               term,
    termOption:         termOption,
    value:              value,
    weight:             weight,
    where:              where,
    withOptions:        withOptions,
    word:               word
};