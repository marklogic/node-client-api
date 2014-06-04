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
function asArray(args, length) {
  if (!(args instanceof Array || args.callee))
    return [args];
  var sliceLength = (length) ? length : args.length;
  switch (sliceLength) {
  case 0:
    return [];
  case 1:
    var first = args[0];
    return (first instanceof Array) ? first : [first];
  default:
    return Array.prototype.slice.call(args, 0, sliceLength);
  }
}
function isString(value) {
  return (value instanceof String || (typeof value) === 'string');
}
function isNumber(value) {
  return (value instanceof Number || (typeof value) === 'number');
}
function isBoolean(value) {
  return (value instanceof Boolean || (typeof value) === 'boolean');
}
function arrayCount(args, count) {
  switch(args.length) {
  case 0:
    return args;
  case 1:
    var first = args[0];
    if (first instanceof Array) {
      if (first.length <= count) {
        return first;
      }
      return Array.prototype.slice.call(first, 0, count);
    }
    return [first];
  default:
    if (args.length <= count) {
      return args;
    }
    return Array.prototype.slice.call(args, 0, count);
  }
}
function first(args) {
  switch(args.length) {
  case 0:
    return {};
  case 1:
    var firstArg = args[0];
    if (firstArg instanceof Array) {
      return firstArg[0];
    }
    return firstArg;
  default:
    return args[0];
  }
}
function addIndex(query, index, isContainer) {
  var containerOnly = isContainer || false;
  if (index.property) {
    query['json-key'] = index.property;
  } else if (index.element) {
    query.element = index.element;
    if (index.attribute) {
      query.attribute = attribute;
    }
  } else if (isString(index)) {
    query['json-key'] = index;
  } else if (containerOnly) {
  } else if (index.field) {
    query.field = index.field;
  } else if (index['path-index']) {
    query['path-index'] = index['path-index'];
  }
}

function and() {
  var args = asArray(arguments);
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
    } else if (seekingOrdered && isBoolean(arg)) {
      query.ordered = arg;
      seekingOrdered = false;
    } else {
      query.queries.push(arg);
    }
  }
  return {'and-query': query};
}
function andNot() {
  var args = arrayCount(arguments, 2);
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
  var args = asArray(arguments);
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
  var args = arrayCount(arguments, 2);
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
  var args = asArray(arguments);
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
  var args = asArray(arguments);
  var query = {};
  var seekingRadius    = true;
  var seekingLatitude  = true;
  var seekingLongitude = true;
  var point = null;
  for (var i=0; i < args.length; i++) {
    var arg = args[i];
    if (seekingRadius && isNumber(arg)) {
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
    } else if (seekingLatitude && isNumber(arg)) {
      point = {latitude: arg};
      seekingLatitude = false;
    } else if (seekingLongitude && isNumber(arg)) {
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
  switch(arguments.length) {
  case 0:
    return {collection: null};
  default:
    return {'collection-query': {
      uri: asArray(arguments)
    }};
  }
}
function scope() {
  var args = asArray(arguments);
  var query = null;
  switch(args.length) {
  case 0:
    query = {};
    break;
  case 1:
    query = {};
    addIndex(query, args[0], true);
    break;
  case 2:
    // TODO: maybe better to copy than mutate
    query = args[1];
    addIndex(query, args[0], true);
    break;
  default:
    // TODO: maybe better to copy than mutate
    query = args[2];
    addIndex(query, args[0], true);
    var second = args[1];
    if (second['fragment-scope']) {
      query['fragment-scope'] = second['fragment-scope'];
    }
    break;
  }
  return {'container-query': query};
}
function datatype() {
  var args = asArray(arguments);
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
  var args = asArray(arguments);
  var query = {
      uri: []
  };
  var seekingInfinite = true;
  for (var i=0; i < args.length; i++) {
    var arg = args[i];
    if (seekingInfinite && isBoolean(arg)) {
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
    uri: asArray(arguments)
  }};
}
function documentFragment() {  
  return {'document-fragment-query': first(arguments)};
}
function element() {
  var args = asArray(arguments);
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
  return {field: first(arguments)};
}
function fragmentScope() {
  var scope = first(arguments);
  if (scope === 'documents' || scope === 'properties') {
    return {'fragment-scope': scope};
  }
  throw new Error('unknown argument: '+scope);
}
function geoAttributePair() {
  var args = asArray(arguments);
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
    } else if (isString(arg)) {
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
  return {'geo-attr-pair-query': geoQuery(args, query, iArg)};
}
function geoElement() {
  var args = asArray(arguments);
  if (args.length < 2)
    throw new Error('not enough parameters: '+args);
  var query = {};
  var keys = ['parent', 'element'];
  for (var i=0; i < keys.length; i++) {
    var key = keys[i];
    var arg = args[i];
    if (arg.qname) {
      query[key] = arg.qname;
    } else if (isString(arg)) {
      query[key] = nsName.call(this, arg);
    } else if (arg.element) {
      query[key] = arg.element;
    } else {
      throw new Error('no parameter for '+key+': '+JSON.stringify(arg));
    }
  }
  return {'geo-elem-query': geoQuery(args, query, 2)};
}
function geoElementPair() {
  var args = asArray(arguments);
  if (args.length < 3)
    throw new Error('not enough parameters: '+args);
  var query = {};
  var keys = ['parent', 'lat', 'lon'];
  for (var i=0; i < keys.length; i++) {
    var key = keys[i];
    var arg = args[i];
    if (arg.qname) {
      query[key] = arg.qname;
    } else if (isString(arg)) {
      query[key] = nsName.call(this, arg);
    } else if (arg.element) {
      query[key] = arg.element;
    } else {
      throw new Error('no parameter for '+key+': '+JSON.stringify(arg));
    }
  }
  return {'geo-elem-pair-query': geoQuery(args, query, 3)};
}
function geoPath() {
  var args = asArray(arguments);
  if (args.length < 1)
    throw new Error('not enough parameters: '+args);
  var query = {};
  var arg = args[0];
  if (arg['path-index']) {
    query['path-index'] = arg['path-index'];
  } else if (arg instanceof Array && arg.length === 2 && isString(arg[0])) {
    query['path-index'] = {text: arg[0], namespaces: arg[1]};
  } else if (isString(arg)) {
    query['path-index'] = {text: arg};
  }
  return {'geo-path-query': geoQuery(args, query, 1)};
}
function geoQuery(args, query, next) {
  var seekingFragmentScope = true;
  var seekingGeoOption = true;
  var seekingRegion = true;
  for (var i=next; i < args.length; i++) {
    var arg = args[i];
    if (seekingGeoOption && arg['geo-option']) {
      query['geo-option'] = arg['geo-option'];
      seekingGeoOption = false;
    } else if (seekingFragmentScope && arg['fragment-scope']) {
      query['fragment-scope'] = arg['fragment-scope'];
      seekingFragmentScope = false;
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
      throw new Error('unknown parameter: '+arg);
    }
  }
  return query;
}
/*
TODO: heatmap - latdivs, londivs, n, s, e, w
 */
function geoOption() {
  return {'geo-option': asArray(arguments)};
}
function latlon() {
  var args = asArray(arguments);
  if (args.length != 2)
    throw new Error('incorrect parameters: '+args);
  return {latitude: args[0], longitude: args[1]};
}
function locks() {  
  return {'locks-query': first(arguments)};
}
function near() {
  var args = asArray(arguments);
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
    } else if (seekingDistance && isNumber(arg)) {
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
  return {'not-query': first(arguments)};
}
function or() {
  return {'or-query':{
      queries: asArray(arguments)
    }};
}
function ordered() {
  return {ordered: first(arguments)};
}
function pathIndex() {
  var args = asArray(arguments);
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
  var args = asArray(arguments);
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
  var args = asArray(arguments);
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
  return {'properties-query': first(arguments)};
}
function property() {
  return {'json-key': first(arguments)};
}
function qname() {
  return {qname: nsName(arguments)};
}
function nsName(callerArgs) {
  var args = asArray(callerArgs);
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
  var args = asArray(arguments);
  var query = {};
  var values = null;
  var operator = null;
  var seekingDatatype = true;
  var seekingFragmentScope = true;
  var seekingRangeOption = true;
  var constraintName;
  for (var i=0; i < args.length; i++) {
    var arg = args[i];
    if (i === 0) {
      addIndex(query, arg, true);
    } else if (seekingDatatype && arg.datatype) {
      query.type = arg.datatype;
      if (arg.collation)
        query.collation = arg.collation;
      seekingDatatype = false;
    } else if (seekingFragmentScope && arg['fragment-scope']) {
      query['fragment-scope'] = arg['fragment-scope'];
      seekingFragmentScope = false;
    } else if (seekingRangeOption && arg['range-option']) {
      query['range-option'] = arg['range-option'];
      seekingRangeOption = false;
    } else if (constraintName !== undefined) {
      continue;
    } else if (arg instanceof Array){
      if (values === null) {
        values = arg;
      } else {
        Array.prototype.push.apply(values, arg);        
      }
    } else if ((seekingDatatype || operator === null) && isString(arg)) {
      var testType = (seekingDatatype) ? datatypes[arg.trim()] : null;
      if (testType) {
        query.type = testType;
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
      constraintName = arg.constraintName;
      if (constraintName !== undefined) {
      } else if (values === null) {
        values = [arg];
      } else {
        values.push(arg);
      }
    }
  }
  if (constraintName === undefined) {
    query['range-operator'] = (operator !== null) ? operator : 'EQ';
    query.value = values;
    return {'range-query': query};
  }

  return {name: constraintName, range: query};
}
function rangeOption() {
  return {'range-option': asArray(arguments)};
}
function southWestNorthEast() {
  var args = asArray(arguments);
  if (args.length != 4)
    throw new Error('incorrect parameters: '+args);
  return {south: args[0], west: args[1], north: args[2], east: args[3]};
}
function term() {
  var args = asArray(arguments);
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
    } else if (seekingWeight && isNumber(arg)) {
      query.weight = arg;
      seekingWeight = false;
    } else {
      query.text.push(arg);
    }
  }
  return {'term-query': query};
}
function termOption() {
  return {'term-option': asArray(arguments)};
}
function textQuery(variant, callerArgs) {
  var args = asArray(callerArgs);
  var query = {};
  var text = null;
  var seekingFragmentScope = true;
  var seekingTermOption = true;
  var seekingWeight = true;
  var constraintName;
  for (var i=0; i < args.length; i++) {
    var arg = args[i];
    if (i === 0) {
      addIndex(query, arg, true);
    } else if (seekingFragmentScope && arg['fragment-scope']) {
      query['fragment-scope'] = arg['fragment-scope'];
      seekingFragmentScope = false;
    } else if (seekingTermOption && arg['term-option']) {
      query['term-option'] = arg['term-option'];
      seekingTermOption = false;
    } else if (seekingWeight && arg.weight) {
      query.weight = arg.weight;
      seekingWeight = false;
    } else if (constraintName !== undefined) {
      continue;
    } else if (arg instanceof Array) {
      if (text === null) {
        text = arg;
      } else {
        Array.prototype.push.apply(text, arg);        
      }
    } else {
      constraintName = arg.constraintName;
      if (constraintName !== undefined) {
      } else if (text === null) {
        text = [arg];
      } else {
        text.push(arg);
      }
    }
  }

  var wrapper = {};
  if (constraintName === undefined) {
    query.text = text;
    wrapper[variant+'-query'] = query;
  } else {
    wrapper.name = constraintName;
    wrapper[variant] = query;
  }
  return wrapper;
}
function value() {
  return textQuery('value', arguments);
}
function weight() {
  return {weight: first(arguments)};
}
function word() {
  return textQuery('word', arguments);
}

function QueryBuilder() {
  // TODO: initialize clauses
}
QueryBuilder.prototype.where     = where;
QueryBuilder.prototype.calculate = calculate;
QueryBuilder.prototype.orderBy   = orderBy;
QueryBuilder.prototype.slice     = slice;

function where() {
  var self = (this instanceof QueryBuilder) ? this : new QueryBuilder();

  var args = asArray(arguments);
  var argLen = args.length;
  // TODO: if empty, clear the clause

  var parsedQuery;
  var queries = null;

  var isQBE = false;
  switch(argLen) {
  case 0:
    self.whereClause = {query: {queries: [and()]}};
    break;
  case 1:
    var first = args[0];
    if ('$query' in first) {
      isQBE = true;
      self.whereClause = first;
    } else {
      var firstWhereClause = {};
      parsedQuery = first.parsedQuery;
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
      if (queries !== null) {
        queries.push(arg);
      } else {
        parsedQuery = arg.parsedQuery;
        if (parsedQuery !== undefined) {
          queries = args.slice(0, i);
        }
      }
    }
    if (queries === null && parsedQuery === undefined) {
      queries = args;
    }
    var whereClause = {};
    if (queries !== null) {
      whereClause.query = {queries: queries};
    }
    if (parsedQuery !== undefined) {
      whereClause.parsedQuery = parsedQuery;
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

  var args = asArray(arguments);
  // TODO: if empty, clear the clause

  var sortOrder = [];
  for (var i=0; i < args.length; i++) {
    var arg = args[i];
    sortOrder.push(isString(arg) ? sort(arg) : arg);
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
  var args = asArray(arguments);
  if (args.length === 0) {
    throw new Error('missing sorted index: '+args);
  }

  var first = args[0];
  var isScore = (!isString(first) && 'score' in first);

  var sorter = {};
  if (isScore) {
    sorter.score = first.score;
  } else {
    addIndex(sorter, first, false);
  }

  for (var i=1; i < args.length; i++) {
    var arg = args[i];
    if (isString(arg)) {
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

  var args = asArray(arguments);
  var argLen = args.length;
  // TODO: if empty, clear the clause

  var pageStart  = (argLen > 1 || (argLen === 1 && isNumber(args[0]))) ?
      args[0] : null;
  var pageLength = (argLen > 2 || (argLen === 2 && isNumber(args[1]))) ?
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

  var args = asArray(arguments);

  // TODO: distinguish facets and values
  var calculateClause = {
      constraint: args
  };
  
  self.calculateClause = calculateClause;

  return self;
}

function facet() {
  var args = asArray(arguments);
  var argLen = args.length;
  if (argLen < 1) {
    throw new Error('facet must at a minimum identify the index');
  }

  var constraintName = null;
  var constraintIndex = null;
  var datatype;
  var facetOptions;
  var buckets = null;
  var computedBuckets = null;
  
  for (var i=0; i < argLen; i++) {
    var arg = args[i];
    switch(i) {
    case 0:
      if (isString(arg)) {
        constraintName = arg;
      } else {
        constraintIndex = arg;
      }
      continue;
    case 1:
      if (constraintIndex === null) {
        if (isString(arg)) {
          constraintIndex = property(arg);
          continue;
        } else if (arg['json-key'] || arg.element || arg.field || arg['path-index'] ||
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
    // TODO: calculateFunction
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

  // TODO: custom constraint with merge from parse
  var facetWrapper = {name: constraintName};
  var constraint = {facet: true};
  if (constraintIndex.collection !== undefined) {
    facetWrapper.collection = constraint;
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

function facetOptions() {
  var args = asArray(arguments);
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
  var name = index.property;
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

function parsedFrom(qtext) {
  if (arguments.length < 1) {
    throw new Error('no query text');
  }

  return {parsedQuery: (arguments.length > 1) ?
    {qtext: qtext, constraint: arguments[1].constraint} :
    {qtext: qtext}
    };
}

function parseBindings() {
  var args = asArray(arguments);
  var argLen = args.length;
  if (argLen < 1) {
    throw new Error('no bindings for the query text');
  }

  var constraints = [];
  for (var i=0; i < argLen; i++) {
    var arg = args[i];
    if (arg.name !== undefined) {
      constraints.push(arg);
    }
    // TODO: special handling for default, custom, and empty
  }

  return {constraint: constraints};
}

function bind() {
// TODO: allow binding in queries including collection (with prefix), scope, geospatial, custom
//       and properties selector
// DONE:  range, word, value
  return {constraintName: (arguments.length > 0) ? arguments[0] : null};
}

// TODO: withOptions()
module.exports = {
    anchor:             anchor,
    and:                and,
    andNot:             andNot,
    attribute:          attribute,
    bind:               bind,
    boost:              boost,
    box:                box,
    bucket:             bucket,
    calculate:          calculate,
    circle:             circle,
    collection:         collection,
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
    word:               word
};