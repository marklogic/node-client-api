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

function del() {
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
    throw new Error('del takes select and optional cardinality');
  }

  var operation = {
    select: select
  };
  if (cardinality != null) {
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
      content = isString ? arg : JSON.stringify(arg);
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
  if (cardinality != null) {
    operation.cardinality = cardinality;
  }

  return {insert: operation};
}

function library(module) {
  // TODO: extension modules
}

// TODO: documents.patch() -> {patch: ... }
function patchFunction() {
  // TODO: instead of apply string?
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
      content = isString ? arg : JSON.stringify(arg);
      continue;
    }
    if (isString && apply === null) {
      apply = arg;
      continue;
    }
    break;
  }

  if (select === null || content === null) {
    throw new Error(
        'replace takes select, content, optional cardinality, and optional apply'
        );
  }

  var operation = {
    select:  select,
    content: content
  };
  if (cardinality != null) {
    operation.cardinality = cardinality;
  }
  if (apply != null) {
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
      content = isString ? arg : JSON.stringify(arg);
      continue;
    }
    if (isString && apply === null) {
      apply = arg;
      continue;
    }
    break;
  }

  if (select=== null || context === null || position === null || content === null) {
    throw new Error(
        'replaceInsert takes select, context, position, content, '+
        'optional cardinality, and optional apply'
        );
  }

  var operation = {
    select:   select,
    context:  context,
    position: position,
    content:  content
  };
  if (cardinality != null) {
    operation.cardinality = cardinality;
  }
  if (apply != null) {
    operation.apply = apply;
  }

  return {'replace-insert': operation};
}

module.exports = {
    del:            del,
    insert:         insert,
    library:        library,
    patchFunction:  patchFunction,
    replace:        replace,
    replaceInsert:  replaceInsert
};
