/*
 * Copyright 2014-2019 MarkLogic Corporation
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


var mlutil   = require('./mlutil.js');

var qb = require('./query-builder.js');

/**
 * A helper for building the definition of a document patch. The helper is
 * created by the {@link marklogic.patchBuilder} function.
 * @namespace patchBuilder
 */

/**
 * An operation as part of a document patch request.
 * @typedef {object} patchBuilder.PatchOperation
 * @since 1.0
 */

/**
 * Builds an operation to remove a JSON property or XML element or attribute.
 * @method
 * @since 1.0
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
 * @since 1.0
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
  var content     = void 0;
  var cardinality = null;

  var argLen = arguments.length;
  for (var i=0; i < argLen; i++) {
    var arg = arguments[i];
    if (i === 0) {
      context = arg;
      continue;
    }
    if (arg === null && content === void 0) {
      content = arg;
      continue;
    }
    var isString = (typeof arg === 'string' || arg instanceof String);
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
    if (content === void 0) {
      content = arg;
      continue;
    }
    break;
  }

  if (context === null || position === null || content === void 0) {
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
 * @since 1.0
 */
/**
 * Specifies a library supplying functions to apply to existing content
 * to produce the replacement content as part of
 * {@link patchBuilder#replace} or {@link patchBuilder#replaceInsert} operations.
 * The library must be installed as /ext/marklogic/patch/apply/MODULE_NAME.xqy 
 * or /ext/marklogic/patch/apply/MODULE_NAME.sjs and must have the
 * http://marklogic.com/patch/apply/MODULE_NAME namespace if the library has .xqy extension.
 * @method
 * @since 1.0
 * @memberof patchBuilder#
 * @param {string} moduleName - the name of the module with the functions
 * @returns {patchBuilder.LibraryParam} the specification for applying a function
 */
function library(module) {
  if (module == null) {
    throw new Error(
        'library must name the module that defines the apply functions'
        );
  }

  var rootname = mlutil.rootname(module);
  if (rootname === null) {
    throw new Error('library must have an extension of .sjs or .xqy');
  }
  var extension = module.substring((module.lastIndexOf('.')+1), module.length);

  if(extension === "sjs") {
    return {'replace-library':{
     at: '/ext/marklogic/patch/apply/'+module
    }};
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
 * @since 1.0
 */
/**
 * Specifies a function to apply to produce the replacement or insertion
 * content for a {@link patchBuilder#replace} or {@link patchBuilder#replaceInsert}
 * operation.
 * @method
 * @since 1.0
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
      } else if (Object.prototype.toString.call(arg) === '[object Date]') {
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
 * @since 1.0
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
 * @since 1.0
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
 * @since 1.0
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
 * @since 1.0
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
 * @since 1.0
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
 * @since 1.0
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
 * @since 1.0
 * @memberof patchBuilder#
 * @param {string} prepended - the string to prepend
 * @param {string} appended - the string to append
 * @returns {patchBuilder.ApplyDefinition} the specification for applying a function
 */
function concatBetween(prepended, appended) {
  if (arguments.length < 2) {
    throw new Error('no strings to concat before and after');
  }
  return apply('ml.concat-between', prepended, appended);
}
/**
 * Trims a leading substring from the existing value for
 * a {@link patchBuilder#replace} operation.
 * @method
 * @since 1.0
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
 * @since 1.0
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
 * @since 1.0
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
  return (flags === void 0) ?
      apply('ml.replace-regex', match, replace) :
      apply('ml.replace-regex', match, replace, flags);
}

/**
 * Builds an operation to replace a JSON property or XML element or attribute.
 * @method
 * @since 1.0
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
  var content     = void 0;
  var cardinality = null;
  var apply       = null;

  var argLen = arguments.length;
  for (var i=0; i < argLen; i++) {
    var arg = arguments[i];
    if (i === 0) {
      select = arg;
      continue;
    }
    if (arg === null && content === void 0) {
      content = arg;
      continue;
    }
    var isString = (typeof arg === 'string' || arg instanceof String);
    if (isString && cardinality === null && /^[?.*+]$/.test(arg)) {
      cardinality = arg;
      continue;
    }
    if (apply === null || apply === undefined) {
      apply = arg.apply;
      if (apply != null) {
        content = arg.content;
        continue;
      }
    }
    if (content === void 0) {
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
  if (cardinality != null) {
    operation.cardinality = cardinality;
  }
  if (apply != null) {
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
 * @since 1.0
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
  var content     = void 0;
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
    if (arg === null && content === void 0) {
      content = arg;
      continue;
    }
    var isString = (typeof arg === 'string' || arg instanceof String);
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
    if (apply === null || apply === undefined) {
      apply = arg.apply;
      if (apply != null) {
        content = arg.content;
        continue;
      }
    }
    if (content === void 0) {
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
  if (cardinality != null) {
    operation.cardinality = cardinality;
  }
  if (apply != null) {
    operation.apply = apply;
  }

  return {'replace-insert': operation};
}

/**
 * The specification for whether select and context paths use
 * XPath or JSONPath as returned by
 * the {@link patchBuilder#pathLanguage} function.
 * @typedef {object} patchBuilder.PathLanguageParam
 * @since 1.0
 */
/**
 * Specifies whether the language used in context and select paths
 * for the document patch is XPath or JSONPath. XPath may be used
 * for either JSON or XML documents and is the default path language.
 * JSONPath may only be used for JSON documents. A document patch
 * cannot contain a mix of XPath and JSONPath.
 * @method
 * @since 1.0
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

/**
 * Specifies operations to patch the collections of a document.
 * @namespace patchBuilderCollections
 */

/**
 * Specifies a collection to add to a document's metadata.
 * @method patchBuilderCollections#add
 * @since 1.0
 * @param {string} collection - the name of the collection
 * @returns {patchBuilder.PatchOperation} a patch operation
 */
function addCollection(collection) {
  if (typeof collection !== 'string') {
    throw new Error('collections.add() takes a string name');
  }
  return insert('/array-node("collections")', 'last-child', collection);
}
/**
 * Specifies a collection to remove from a document's metadata.
 * @method patchBuilderCollections#remove
 * @since 1.0
 * @param {string} collection - the name of the collection
 * @returns {patchBuilder.PatchOperation} a patch operation
 */
function removeCollection(collection) {
  if (typeof collection !== 'string') {
    throw new Error('collections.remove() takes a string name');
  }
  return remove('/collections[. eq "'+collection+'"]');
}

/**
 * Specifies operations to patch the permissions of a document.
 * @namespace patchBuilderPermissions
 */

/**
 * Specifies a role to add to a document's permissions; takes a configuration
 * object with the following named parameters or, as a shortcut,
 * a role string and capabilities string or array.
 * @method patchBuilderPermissions#add
 * @since 1.0
 * @param {string} role - the name of a role defined in the server configuration
 * @param {string|string[]} capabilities - the capability or an array of
 * capabilities from the insert|update|read|execute enumeration
 * @returns {patchBuilder.PatchOperation} a patch operation
 */
function addPermission() {
  var permission = getPermission(
      mlutil.asArray.apply(null, arguments)
      );
  if (permission === null) {
    throw new Error('permissions.add() takes the role name and one or more insert|update|read|execute capabilities');
  }
  return insert('/array-node("permissions")', 'last-child', permission);
}
/**
 * Specifies different capabilities for a role with permissions on a document;
 * takes a configuration object with the following named parameters or,
 * as a shortcut, a role string and capabilities string or array.
 * @method patchBuilderPermissions#replace
 * @since 1.0
 * @param {string} role - the name of an existing role with permissions
 * on the document
 * @param {string|string[]} capabilities - the role's modified capability or
 * capabilities from the insert|update|read|execute enumeration
 */
function replacePermission() {
  var permission = getPermission(
      mlutil.asArray.apply(null, arguments)
      );
  if (permission === null) {
    throw new Error('permissions.replace() takes the role name and one or more insert|update|read|execute capabilities');
  }
  return replace(
      '/permissions[node("role-name") eq "'+permission['role-name']+'"]',
      permission
      );
}
/**
 * Specifies a role to remove from a document's permissions.
 * @method patchBuilderPermissions#remove
 * @since 1.0
 * @param {string} role - the role to remove from access to the document
 * @returns {patchBuilder.PatchOperation} a patch operation
 */
function removePermission(roleName) {
  if (typeof roleName !== 'string') {
    throw new Error('permissions.remove() takes a string role name');
  }
  return remove('/permissions[node("role-name") eq "'+roleName+'"]');
}
/** @ignore */
function getPermission(args) {
  var argLen = args.length;

  var roleName     = null;
  var capabilities = null;
  var isObject     = false;

  var first = (argLen === 0) ? null : args[0];
  if (first !== null) {
    if (args.length > 1 && typeof first === 'string') {
      roleName = first;
      capabilities = args[1];
    } else {
      roleName = first['role-name'];
      if (typeof roleName !== 'string') {
        return null;
      }

      capabilities = first.capabilities;
      isObject     = true;
    }
  }
  if (capabilities == null) {
    return null;
  }

  var check = {execute:true, insert:true, read:true, update:true};
  if (Array.isArray(capabilities)) {
    var max = capabilities.length;
    for (var i=0; i < max; i++) {
      if (!check[capabilities[i]]) {
        return null;
      }
    }
  } else {
    if (!check[capabilities]) {
      return null;
    }
    capabilities = [capabilities];
    if (isObject) {
      isObject = false;
    }
  }

  return isObject ? first : {
    'role-name':  roleName,
    capabilities: capabilities
    };
}

/**
 * Specifies operations to patch the metadata properties of a document.
 * @namespace patchBuilderProperties
 */

/**
 * Specifies a new property to add to a document's metadata.
 * @method patchBuilderProperties#add
 * @since 1.0
 * @param {string} name - the name of the new metadata property
 * @param value - the value of the new metadata property
 * @returns {patchBuilder.PatchOperation} a patch operation
 */
function addProperty(name, value) {
  if (typeof name !== 'string' || value == null) {
    throw new Error('properties.add() takes a string name and a value');
  }
  var prop = {};
  prop[name] = value;
  return insert('/object-node("properties")', 'last-child', prop);
}
/**
 * Specifies a different value for a property in a document's metadata.
 * @method patchBuilderProperties#replace
 * @since 1.0
 * @param {string} name - the name of the existing metadata property
 * @param value - the modified value of the metadata property
 * @returns {patchBuilder.PatchOperation} a patch operation
 */
function replaceProperty(name, value) {
  if (typeof name !== 'string' || value == null) {
    throw new Error('properties.replace() takes a string name and a value');
  }
  return replace('/properties/node("'+name+'")',  value);
}
/**
 * Specifies a metadata property to remove from the document's metadata.
 * @method patchBuilderProperties#remove
 * @since 1.0
 * @param {string} name - the name of the metadata property to remove
 * @returns {patchBuilder.PatchOperation} a patch operation
 */
function removeProperty(name) {
  if (typeof name !== 'string') {
    throw new Error('properties.remove() takes a string property name');
  }
  return remove('/properties/node("'+name+'")');
}

/**
 * Specifies operations to patch the search quality of a document.
 * @namespace patchBuilderQuality
 */

/**
 * Sets the search quality of a document.
 * @method patchBuilderQuality#set
 * @since 1.0
 * @param {number} quality - the numeric value of the quality
 */
function setQuality(quality) {
  if (typeof quality !== 'number') {
    throw new Error('quality.set() takes a number');
  }
  return replace('/quality', quality);
}

/**
 * Specifies operations to patch the metadata values of a document.
 * @namespace patchBuilderMetadataValues
 * @since 2.0.1
 */

/**
 * Specifies a new metadata value to add to a document.
 * @method patchBuilderMetadataValues#add
 * @since 2.0.1
 * @param {string} name - the name of the new metadata value
 * @param value - the value of the new metadata value
 * @returns {patchBuilder.PatchOperation} a patch operation
 */
function addMetadataValue(name, value) {
  if (typeof name !== 'string' || typeof value !== 'string' ) {
    throw new Error('metadataValues.add() takes a string name and string value');
  }
  var metaVal = {};
  metaVal[name] = value;
  return insert('/object-node("metadataValues")', 'last-child', metaVal);
}
/**
 * Specifies a metadata value to replace for a document.
 * @method patchBuilderMetadataValues#replace
 * @since 2.0.1
 * @param {string} name - the name of the existing metadata value
 * @param value - the modified value
 * @returns {patchBuilder.PatchOperation} a patch operation
 */
function replaceMetadataValue(name, value) {
  if (typeof name !== 'string' || typeof value !== 'string') {
    throw new Error('metadataValues.replace() takes a string name and a string value');
  }
  return replace('/metadataValues/node("'+name+'")',  value);
}
/**
 * Specifies a metadata value to remove from the document.
 * @method patchBuilderMetadataValues#remove
 * @since 2.0.1
 * @param {string} name - the name of the metadata value to remove
 * @returns {patchBuilder.PatchOperation} a patch operation
 */
function removeMetadataValue(name) {
  if (typeof name !== 'string') {
    throw new Error('metadataValues.remove() takes a string name');
  }
  return remove('/metadataValues/node("'+name+'")');
}

module.exports = {
   /**
     * Provides functions that specify patch operations on the collections
     * to which a document belongs.
     * @name collections
     * @since 1.0
     * @memberof! patchBuilder#
     * @type {patchBuilderCollections}
     */
    collections:   {
      add:     addCollection,
      remove:  removeCollection
      },
    /**
      * Provides functions that specify patch operations on the permissions
      * of a document.
      * @name permissions
      * @since 1.0
      * @memberof! patchBuilder#
      * @type {patchBuilderPermissions}
      */
    permissions:   {
      add:     addPermission,
      replace: replacePermission,
      remove:  removePermission
      },
    /**
      * Provides functions that specify patch operations on the metadata properties
      * of a document.
      * @name properties
      * @since 1.0
      * @memberof! patchBuilder#
      * @type {patchBuilderProperties}
      */
    properties:    {
      add:     addProperty,
      replace: replaceProperty,
      remove:  removeProperty
      },
    /**
      * Provides functions that specify patch operations on the ranking quality
      * of a document.
      * @name quality
      * @since 1.0
      * @memberof! patchBuilder#
      * @type {patchBuilderQuality}
      */
    quality:       {
      set:     setQuality
      },
   /**
     * Provides functions that specify patch operations on the metadata values
     * for a document.
     * @name metadataValues
     * @since 2.0.1
     * @memberof! patchBuilder#
     * @type {patchBuilderMetadataValues}
     */
    metadataValues:   {
      add:     addMetadataValue,
      replace: replaceMetadataValue,
      remove:  removeMetadataValue
      },
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
