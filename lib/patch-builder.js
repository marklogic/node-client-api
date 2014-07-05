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
var valcheck = require('core-util-is');

function remove() {
  var select      = null;
  var cardinality = null;

  var argLen = arguments.length;
  for (var i=0; i < argLen; i++) {
    var arg = arguments[i];
    if (i === 0) {
      select = arg;
      continue;
    }
    if (cardinality === null && arg.match(/^[?.*+]$/)) {
      cardinality = arg;
      continue;
    }
    break;
  }

  if (select === null) {
    throw new Error('remove takes select and optional cardinality');
  }

  var operation = {
    select: select
  };
  if (cardinality !== null) {
    operation.cardinality = cardinality;
  }

  return {'delete': operation};
}

function insert() {
  var context     = null;
  var position    = null;
  var content     = null;
  var cardinality = null;

  var argLen = arguments.length;
  for (var i=0; i < argLen; i++) {
    var arg = arguments[i];
    if (i === 0) {
      context = arg;
      continue;
    }
    var isString = valcheck.isString(arg);
    if (isString) {
      if (position === null && arg.match(/^(before|after|last-child)$/)) {
        position = arg;
        continue;
      }
      if (cardinality === null && arg.match(/^[?.*+]$/)) {
        cardinality = arg;
        continue;
      }
    }
    if (content === null) {
      content = arg;
      continue;
    }
    break;
  }

  if (context === null || position === null || content === null) {
    throw new Error(
        'insert takes context, position, content, and optional cardinality'
        );
  }

  var operation = {
    context:  context,
    position: position,
    content:  content
  };
  if (cardinality !== null) {
    operation.cardinality = cardinality;
  }

  return {insert: operation};
}

function library(module) {
  if (valcheck.isNullOrUndefined(module)) {
    throw new Error(
        'library takes the name of a module defining the apply functions'
        );
  }

  return {'replace-library':{
    ns: '/ext/marklogic/patch/apply/'+module,
    at: '/ext/marklogic/patch/apply/'+module+'.xqy'
  }};
}

function apply(functionName) {
  if (valcheck.isNullOrUndefined(functionName)) {
    throw new Error('no name for function to apply');
  }

  return {apply: functionName};
}

function replace() {
  var select      = null;
  var content     = null;
  var cardinality = null;
  var apply       = null;

  var argLen = arguments.length;
  for (var i=0; i < argLen; i++) {
    var arg = arguments[i];
    if (i === 0) {
      select = arg;
      continue;
    }
    var isString = valcheck.isString(arg);
    if (isString && cardinality === null && arg.match(/^[?.*+]$/)) {
      cardinality = arg;
      continue;
    }
    if (content === null) {
      content = arg;
      continue;
    }
    if (valcheck.isNullOrUndefined(apply)) {
      apply = arg.apply;
      continue;
    }
    break;
  }

  if (select === null || content === null) {
    throw new Error(
        'replace takes select, content, optional cardinality, and optional apply function'
        );
  }

  var operation = {
    select:  select,
    content: content
  };
  if (!valcheck.isNullOrUndefined(cardinality)) {
    operation.cardinality = cardinality;
  }
  if (!valcheck.isNullOrUndefined(apply)) {
    operation.apply = apply;
  }

  return {replace: operation};
}

function replaceInsert() {
  var select      = null;
  var context     = null;
  var position    = null;
  var content     = null;
  var cardinality = null;
  var apply       = null;

  var argLen = arguments.length;
  for (var i=0; i < argLen; i++) {
    var arg = arguments[i];
    if (i === 0) {
      select = arg;
      continue;
    }
    if (i === 1) {
      context = arg;
      continue;
    }
    var isString = valcheck.isString(arg);
    if (isString) {
      if (position === null && arg.match(/^(before|after|last-child)$/)) {
        position = arg;
        continue;
      }
      if (cardinality === null && arg.match(/^[?.*+]$/)) {
        cardinality = arg;
        continue;
      }
    }
    if (content === null) {
      content = arg;
      continue;
    }
    if (valcheck.isNullOrUndefined(apply)) {
      apply = arg.apply;
      continue;
    }
    break;
  }

  if (select=== null || context === null || position === null || content === null) {
    throw new Error(
        'replaceInsert takes select, context, position, content, '+
        'optional cardinality, and optional apply function'
        );
  }

  var operation = {
    select:   select,
    context:  context,
    position: position,
    content:  content
  };
  if (!valcheck.isNullOrUndefined(cardinality)) {
    operation.cardinality = cardinality;
  }
  if (!valcheck.isNullOrUndefined(apply)) {
    operation.apply = apply;
  }

  return {'replace-insert': operation};
}

function pathLanguage() {
  var pathlang = (arguments.length < 1) ? null : arguments[0];
  if (pathlang !== 'jsonpath' && pathlang !== 'xpath') {
    throw new Error(
        'pathLanguage takes a path language of xpath or jsonpath'
        );
  }

  return {"pathlang": pathlang};
}

module.exports = {
    apply:          apply,
    insert:         insert,
    library:        library,
    pathLanguage:   pathLanguage,
    remove:         remove,
    replace:        replace,
    replaceInsert:  replaceInsert
};
