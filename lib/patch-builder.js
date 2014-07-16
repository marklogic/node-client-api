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
 * @method patchBuilder#
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

/**
 * Builds an operation to insert content.
 * @method patchBuilder#
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
        'library takes the name of a module defining the apply functions'
        );
  }

  return {'replace-library':{
    ns: '/ext/marklogic/patch/apply/'+module,
    at: '/ext/marklogic/patch/apply/'+module+'.xqy'
  }};
}

/**
 * The specification for applying a function as returned by
 * the {@link patchBuilder#apply} function.
 * @typedef {object} patchBuilder.ApplyParam
 */
/**
 * Specifies a function to apply to the existing content
 * to produce the replacement content as part of
 * a {@link patchBuilder#replace} or {@link patchBuilder#replaceInsert} operation.
 * @method
 * @memberof patchBuilder#
 * @param {string} functionName - the name of the function to apply
 * @returns {patchBuilder.ApplyParam} the specification for applying a function
 */
function apply(functionName) {
  if (valcheck.isNullOrUndefined(functionName)) {
    throw new Error('no name for function to apply');
  }

  return {apply: functionName};
}

/**
 * Builds an operation to replace a JSON property or XML element or attribute.
 * The content argument is optional if an apply argument is provided and
 * required otherwise.
 * @method patchBuilder#
 * @param {string}  select - the path to select the fragment to replace
 * @param           [content] - the object or value replacing the selected fragment 
 * @param {patchBuilder.ApplyParam} [apply] - a function to apply to the selected content
 * to produce the replacement 
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
    if (isString && cardinality === null && arg.match(/^[?.*+]$/)) {
      cardinality = arg;
      continue;
    }
    if (valcheck.isNullOrUndefined(apply)) {
      apply = arg.apply;
      if (!valcheck.isNullOrUndefined(apply)) {
        continue;
      }
    }
    if (content === null) {
      content = arg;
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

/**
 * Builds an operation to replace a fragment if the fragment exists and insert
 * the new content if the fragment doesn't exist.
 * The content argument is optional if an apply argument is provided and
 * required otherwise.
 * @method patchBuilder#
 * @param {string}  select - the path to select the fragment to replace
 * @param {string}  context - the path to the container for inserting the content
 * when the select path doesn't match
 * @param {string}  position - a specification from the before|after|last-child
 * enumeration controlling where the content will be inserted relative to the context
 * @param           [content] - the object or value replacing the selected fragment or,
 * alternatively, inserting within the context
 * @param {patchBuilder.ApplyParam} [apply] - a function to apply to the selected content
 * to produce the replacement or insertion
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
console.log(JSON.stringify(operation));
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
    apply:          apply,
    insert:         insert,
    library:        library,
    pathLanguage:   pathLanguage,
    remove:         remove,
    replace:        replace,
    replaceInsert:  replaceInsert
};
