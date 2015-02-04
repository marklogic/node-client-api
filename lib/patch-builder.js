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
var valcheck = require('core-util-is');

var mlutil   = require('./mlutil.js');

var qb = require('./query-builder.js');

/**
 * A helper for building the definition of a document patch. The helper is
 * created by the {@link module:marklogic.patchBuilder} function. 
 * @namespace patchBuilder
 */

/**
 * An operation as part of a document patch request.
 * @typedef {object} patchBuilder.PatchOperation
 */

/**
 * Builds an operation to remove a JSON property or XML element or attribute.
 * @method
 * @memberof patchBuilder#
 * @param {string}  select - the path to select the fragment to remove
 * @param {string}  [cardinality] - a specification from the ?|.|*|+
 * enumeration controlling whether the select path must match zero-or-one
 * fragment, exactly one fragment, any number of fragments (the default), or
 * one-or-more fragments.
 * @returns {patchBuilder.PatchOperation} a patch operation
 */
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
    if (cardinality === null && /^[?.*+]$/.test(arg)) {
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

/**
 * Builds an operation to insert content.
 * @method
 * @memberof patchBuilder#
 * @param {string}  context - the path to the container of the inserted content
 * @param {string}  position - a specification from the before|after|last-child
 * enumeration controlling where the content will be inserted relative to the context
 * @param           content - the inserted object or value
 * @param {string}  [cardinality] - a specification from the ?|.|*|+
 * enumeration controlling whether the context path must match zero-or-one
 * fragment, exactly one fragment, any number of fragments (the default), or
 * one-or-more fragments.
 * @returns {patchBuilder.PatchOperation} a patch operation
 */
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
      if (position === null && /^(before|after|last-child)$/.test(arg)) {
        position = arg;
        continue;
      }
      if (cardinality === null && /^[?.*+]$/.test(arg)) {
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

/**
 * The specification for a library of replacement functions as returned by
 * the {@link patchBuilder#library} function.
 * @typedef {object} patchBuilder.LibraryParam
 */
/**
 * Specifies a library supplying functions to apply to existing content
 * to produce the replacement content as part of
 * {@link patchBuilder#replace} or {@link patchBuilder#replaceInsert} operations.
 * The library must be installed as /ext/marklogic/patch/apply/MODULE_NAME.xqy
 * and must have the http://marklogic.com/patch/apply/MODULE_NAME namespace.
 * @method
 * @memberof patchBuilder#
 * @param {string} moduleName - the name of the module with the functions
 * @returns {patchBuilder.LibraryParam} the specification for applying a function
 */
function library(module) {
  if (valcheck.isNullOrUndefined(module)) {
    throw new Error(
        'library must name the module that defines the apply functions'
        );
  }

  var rootname = mlutil.rootname(module);
  if (rootname === null) {
    throw new Error('library must have an extension of .xqy');
  }

  return {'replace-library':{
    ns:  'http://marklogic.com/patch/apply/'+rootname,
    at: '/ext/marklogic/patch/apply/'+module
  }};
}

/**
 * The specification for applying a function to produce the content for a
 * {@link patchBuilder#replace} or {@link patchBuilder#replaceInsert}
 * operation.
 * @typedef {object} patchBuilder.ApplyDefinition
 */
/**
 * Specifies a function to apply to produce the replacement or insertion
 * content for a {@link patchBuilder#replace} or {@link patchBuilder#replaceInsert}
 * operation.
 * @method
 * @memberof patchBuilder#
 * @param {string} functionName - the name of the function to apply
 * @param ...args - arguments to pass to the applied function; you can use the
 * datatype() function to specify an atomic type in the list prior to a value
 * @returns {patchBuilder.ApplyDefinition} the specification for applying a function
 */
function apply() {
  var args = mlutil.asArray.apply(null, arguments);

  var argLen = args.length;
  switch(argLen) {
  case 0:
    throw new Error('no name for function to apply');
  case 1:
    return {apply: args[0]};
  default:
    var DatatypeDef = qb.lib.DatatypeDef;

    var functionName = args[0];
    var content      = [];
  
    var datatype = null;
  
    var arg = null;
    var i=1;
    for (; i < argLen; i++) {
      arg = args[i];
      if (arg instanceof DatatypeDef) {
        if (datatype !== null) {
          throw new Error(datatype+' datatype without following value for '+functionName);
        }
        datatype = arg.datatype;
        continue;
      }
  
      if (datatype !== null) {
        content.push({$value: arg, $datatype: datatype});
        datatype = null;
      } else if (valcheck.isDate(arg)) {
        content.push({$value: arg.toISOString(), $datatype: 'xs:datetime'});
      } else {
        content.push({$value: arg});
      }
    }

    if (datatype !== null) {
      throw new Error(datatype+' datatype without last value for '+functionName);
    }

    return {apply: functionName, content: content};
  }
}

/**
 * Adds a number to the existing value to produce the replace content
 * for a {@link patchBuilder#replace} operation.
 * @method
 * @memberof patchBuilder#
 * @param {number} number - the number to add
 * @returns {patchBuilder.ApplyDefinition} the specification for applying a function
 */
function add(number) {
  if (arguments.length < 1) {
    throw new Error('no number to add');
  }
  return apply('ml.add', number);
}
/**
 * Subtracts a number from the existing value to produce the replace content
 * for a {@link patchBuilder#replace} operation.
 * @method
 * @memberof patchBuilder#
 * @param {number} number - the number to subtract
 * @returns {patchBuilder.ApplyDefinition} the specification for applying a function
 */
function subtract(number) {
  if (arguments.length < 1) {
    throw new Error('no number to subtract');
  }
  return apply('ml.subtract', number);
}
/**
 * Multiplies the existing value by a number to produce the replace content
 * for a {@link patchBuilder#replace} operation.
 * @method
 * @memberof patchBuilder#
 * @param {number} multiplier - the number to multiply by
 * @returns {patchBuilder.ApplyDefinition} the specification for applying a function
 */
function multiplyBy(multiplier) {
  if (arguments.length < 1) {
    throw new Error('no number to multiply by');
  }
  return apply('ml.multiply', multiplier);
}
/**
 * Divides the existing by a number to produce the replace content
 * for a {@link patchBuilder#replace} operation.
 * @method
 * @memberof patchBuilder#
 * @param {number} divisor - the number to divide by
 * @returns {patchBuilder.ApplyDefinition} the specification for applying a function
 */
function divideBy(divisor) {
  if (arguments.length < 1) {
    throw new Error('no number to divide by');
  }
  return apply('ml.divide', divisor);
}
/**
 * Prepends a value to the existing value for a {@link patchBuilder#replace} operation.
 * @method
 * @memberof patchBuilder#
 * @param {string} prepended - the string to prepend
 * @returns {patchBuilder.ApplyDefinition} the specification for applying a function
 */
function concatBefore(prepended) {
  if (arguments.length < 1) {
    throw new Error('no string to concat before');
  }
  return apply('ml.concat-before', prepended);
}
/**
 * Appends a value to the existing value for a {@link patchBuilder#replace} operation.
 * @method
 * @memberof patchBuilder#
 * @param {string} appended - the string to append
 * @returns {patchBuilder.ApplyDefinition} the specification for applying a function
 */
function concatAfter(appended) {
  if (arguments.length < 1) {
    throw new Error('no string to concat after');
  }
  return apply('ml.concat-after', appended);
}
/**
 * Prepends and appends values to the existing value for
 * a {@link patchBuilder#replace} operation.
 * @method
 * @memberof patchBuilder#
 * @param {string} prepended - the string to prepend
 * @param {string} appended - the string to append
 * @returns {patchBuilder.ApplyDefinition} the specification for applying a function
 */
function concatBetween(prepended, appended) {
  if (arguments.length < 2) {
    throw new Error('no strings to concat before and after');
  }
  return apply('ml.concat-between', before, after);
}
/**
 * Trims a leading substring from the existing value for
 * a {@link patchBuilder#replace} operation.
 * @method
 * @memberof patchBuilder#
 * @param {string} start - the leading string to trim
 * @returns {patchBuilder.ApplyDefinition} the specification for applying a function
 */
function substringAfter(start) {
  if (arguments.length < 1) {
    throw new Error('no substring for after');
  }
  return apply('ml.substring-after', start);
}
/**
 * Trims a trailing substring from the existing value for
 * a {@link patchBuilder#replace} operation.
 * @method
 * @memberof patchBuilder#
 * @param {string} end - the trailing string to trim
 * @returns {patchBuilder.ApplyDefinition} the specification for applying a function
 */
function substringBefore(end) {
  if (arguments.length < 1) {
    throw new Error('no substring for before');
  }
  return apply('ml.substring-before', end);
}
/**
 * Applies a regular expression to the existing value to produce a new value for
 * a {@link patchBuilder#replace} operation.
 * @method
 * @memberof patchBuilder#
 * @param {string} match - the expression extracting parts of the existing value
 * @param {string} end - the expression to assembling the extracted parts into
 * a replacement value
 * @param {string} [flags] - the flags changing the regex operation
 * @returns {patchBuilder.ApplyDefinition} the specification for applying a function
 */
function replaceRegex(match, replace, flags) {
  if (arguments.length < 2) {
    throw new Error('no match and replace for replace regex');
  }
  return valcheck.isUndefined(flag) ?
      apply('ml.replace-regex', match, replace) :
      apply('ml.replace-regex', match, replace, flags);
}

/**
 * Builds an operation to replace a JSON property or XML element or attribute.
 * @method
 * @memberof patchBuilder#
 * @param {string}  select - the path to select the fragment to replace
 * @param           [content] - the object or value replacing the selected fragment or
 * an {@link patchBuilder.ApplyDefinition} specifying a function to apply to the selected
 * fragment to produce the replacement 
 * @param {string}  [cardinality] - a specification from the ?|.|*|+
 * enumeration controlling whether the select path must match zero-or-one
 * fragment, exactly one fragment, any number of fragments (the default), or
 * one-or-more fragments.
 * @returns {patchBuilder.PatchOperation} a patch operation
 */
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
    if (isString && cardinality === null && /^[?.*+]$/.test(arg)) {
      cardinality = arg;
      continue;
    }
    if (valcheck.isNullOrUndefined(apply)) {
      apply = arg.apply;
      if (!valcheck.isNullOrUndefined(apply)) {
        content = arg.content;
        continue;
      }
    }
    if (content === null) {
      content = arg;
      continue;
    }
    break;
  }

  if (select === null) {
    throw new Error(
        'replace takes a select path, content or an apply function, and optional cardinality'
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

/**
 * Builds an operation to replace a fragment if the fragment exists and insert
 * the new content if the fragment doesn't exist.
 * The content argument is optional if an apply argument is provided and
 * required otherwise.
 * @method
 * @memberof patchBuilder#
 * @param {string}  select - the path to select the fragment to replace
 * @param {string}  context - the path to the container for inserting the content
 * when the select path doesn't match
 * @param {string}  position - a specification from the before|after|last-child
 * enumeration controlling where the content will be inserted relative to the context
 * @param           [content] - the object or value replacing the selected fragment or,
 * alternatively, inserting within the context  or
 * an {@link patchBuilder.ApplyDefinition} specifying a function to generate the 
 * replacement for the selected fragment or the inserted content
 * @param {string}  [cardinality] - a specification from the ?|.|*|+
 * enumeration controlling whether the select or context path must match zero-or-one
 * fragment, exactly one fragment, any number of fragments (the default), or
 * one-or-more fragments.
 * @returns {patchBuilder.PatchOperation} a patch operation
 */
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
      if (position === null && /^(before|after|last-child)$/.test(arg)) {
        position = arg;
        continue;
      }
      if (cardinality === null && /^[?.*+]$/.test(arg)) {
        cardinality = arg;
        continue;
      }
    }
    if (valcheck.isNullOrUndefined(apply)) {
      apply = arg.apply;
      if (!valcheck.isNullOrUndefined(apply)) {
        content = arg.content;
        continue;
      }
    }
    if (content === null) {
      content = arg;
      continue;
    }
    break;
  }

  if (select=== null || context === null || position === null) {
    throw new Error(
        'replaceInsert takes select, context, position, content or an apply function, '+
        'and optional cardinality'
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

/**
 * The specification for whether select and context paths use
 * XPath or JSONPath as returned by
 * the {@link patchBuilder#pathLanguage} function.
 * @typedef {object} patchBuilder.PathLanguageParam
 */
/**
 * Specifies whether the language used in context and select paths
 * for the document patch is XPath or JSONPath. XPath may be used
 * for either JSON or XML documents and is the default path language.
 * JSONPath may only be used for JSON documents. A document patch
 * cannot contain a mix of XPath and JSONPath.
 * @method
 * @memberof patchBuilder#
 * @param {string} language - one of the enumeration xpath|jsonpath
 * @returns {patchBuilder.PathLanguageParam} the specification for the path language
 */
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
    add:             add,
    apply:           apply,
    concatAfter:     concatAfter,
    concatBefore:    concatBefore,
    concatBetween:   concatBetween,
    datatype:        qb.builder.datatype,
    divideBy:        divideBy,
    insert:          insert,
    library:         library,
    multiplyBy:      multiplyBy,
    pathLanguage:    pathLanguage,
    remove:          remove,
    replace:         replace,
    replaceInsert:   replaceInsert,
    replaceRegex:    replaceRegex,
    substringAfter:  substringAfter,
    substringBefore: substringBefore,
    subtract:        subtract
};
