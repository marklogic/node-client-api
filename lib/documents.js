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
var util     = require("util");
var valcheck = require('core-util-is');
var mlrest   = require('./mlrest.js');
var mlutil   = require('./mlutil.js');

/** @ignore */
function addDocumentUri(documents, document) {
  if (document !== undefined) {
    documents.push(document.uri);
  }
  return documents;
}
/** @ignore */
function getDocumentUris(documents) {
  if (documents === undefined || documents.length === 0) {
    return [];
  }
  return documents.reduce(addDocumentUri, []);
}

/** @ignore */
function uriErrorTransform(message) {
  var operation = this;

  var uri = operation.uri;
  return valcheck.isNullOrUndefined(uri) ? message :
    (message+' (on '+uri+')');
}
/** @ignore */
function uriListErrorTransform(message) {
  var operation = this;

  var uris = operation.uris;
  return ((!valcheck.isArray(uris)) || uris.length === 0) ?
    message : (message+' (on '+uris.join(', ')+')');
}

/**
 * Provides functions to write, read, query, or perform other operations
 * on documents in the database. For operations that modify the database,
 * the client must have been created for a user with the rest-writer role.
 * For operations that read or query the database, the user need only have
 * the rest-reader role.
 * @namespace documents
 */

/** @ignore */
function probeOutputTransform(data) {
  var operation = this;

  var statusCode = operation.responseStatusCode;
  var exists     = (statusCode === 200) ? true : false;
  if (operation.contentOnly) {
    return exists;
  }

  var output = exists ? operation.responseHeaders : {};
  output.uri    = operation.uri;
  output.exists = exists;

  return output;
}

/**
 * An object offering the alternative of a {@link ResultProvider#result} function
 * or a {@link ResultProvider#stream} function for receiving the results
 * @namespace ResultProvider
 */
/**
 * Accepts success and/or failure callbacks and returns a
 * {@link https://www.promisejs.org/|Promises} object for chaining
 * actions with then() functions.
 * @name ResultProvider#result
 * @function
 * @param {function}  [success] - a callback invoked when the request succeeds
 * @param {function}  [failure] - a callback invoked when the request fails
 * @returns {object} a Promises object
 */
/**
 * Returns a ReadableStream object in object mode for receiving results as
 * complete objects.
 * @name ResultProvider#stream
 * @function
 * @returns {object} a {@link http://nodejs.org/api/stream.html#stream_class_stream_readable|ReadableStream}
 * object
 */

/**
 * Provides a description of a document to write to the server, after reading
 * from the server, or for another document operation.  The descriptor may have
 * more or fewer properties depending on the operation.
 * @typedef {object} documents.DocumentDescriptor
 * @property {string} uri - the identifier for the document in the database
 * @property {object|string|Buffer|ReadableStream} [content] - the content
 * of the document; when writing a ReadableStream for the content, first pause
 * the stream
 * @property {string[]} [collections] - the collections to which the document belongs
 * @property {object[]} [permissions] - the permissions controlling which users can read or
 * write the document
 * @property {object[]} [properties] - additional properties of the document
 * @property {number} [quality] - a weight to increase or decrease the rank of the document
 * @property {number} [versionId] - an identifier for the currently stored version of the
 * document
 */

/**
 * Categories of information to read or write for documents.
 * The possible values of the enumeration are
 * content|collections|permissions|properties|quality|metadata where
 * metadata is an alias for all of the categories other than content.
 * @typedef {enum} documents.categories
 */

/**
 * A success callback for {@link ResultProvider} that receives the result from
 * the {@link documents#probe}.
 * @callback documents#probeResult
 * @param {documents.DocumentDescriptor} document - a sparse document descriptor with an exists
 * property that identifies whether the document exists 
 */
/**
 * Probes whether a document exists; takes a configuration
 * object with the following named parameters or, as a shortcut,
 * a uri string.
 * @method documents#probe
 * @param {string}  uri - the uri for the database document
 * @param {string}  [txid] - the transaction id for an open transaction
 * @returns {ResultProvider} an object whose result() function takes
 * a {@link documents#probeResult} success callback.
 */
function probeDocument() {
  return probeDocumentsImpl.call(this, false, mlutil.asArray.apply(null, arguments));
}
function probeDocumentsImpl(contentOnly, args) {
  if (args.length !== 1) {
    throw new Error('must supply uri for document check()');
  }

  var params = (!valcheck.isString(args[0])) ? args[0] : null; 

  var uri;

  var path = '/v1/documents?format=json';
  if (params === null) {
    uri = args[0];
    path += '&uri='+encodeURIComponent(uri);
  } else {
    uri = params.uri;
    if (uri === undefined) {
      throw new Error('must specify the uri parameter for the document to check');
    }
    var txid = params.txid;
    if (txid !== undefined) {
      path += '&uri='+encodeURIComponent(uri)+'&txid='+txid;
    } else {
      path += '&uri='+encodeURIComponent(uri);
    }
  }

  var requestOptions = mlutil.copyProperties(this.client.connectionParams);
  requestOptions.method = 'HEAD';
  requestOptions.path = path ;

  var operation = mlrest.createOperation(
      'check document', this.client, requestOptions, 'empty', 'empty'
      );
  operation.uri              = uri;
  operation.validStatusCodes = [200, 404];
  operation.outputTransform  = probeOutputTransform;
  operation.errorTransform   = uriErrorTransform;
  operation.contentOnly = (contentOnly === true);

  return mlrest.startRequest(operation);
}

/**
 * A success callback for {@link ResultProvider} that receives the result from
 * the {@link documents#read}.
 * @callback documents#resultList
 * @param {documents.DocumentDescriptor[]} documents - an array of
 * {@link documents.DocumentDescriptor} objects with the requested
 * metadata and/or content for the documents 
 */
/**
 * Reads one or more documents; takes a configuration object with
 * the following named parameters or, as a shortcut, one or more
 * uri strings or an array of uri strings.
 * @method documents#read
 * @param {string|string[]}  uris - the uri string or an array of uri strings
 * for the database documents
 * @param {documents.categories|documents.categories[]}  [categories] - the categories of information
 * to retrieve for the documents
 * @param {string}  [txid] - the transaction id for an open transaction
 * @param {string}  [transform] - the name of a transform extension to apply
 * to each document; the transform must have been installed using
 * the {@link transforms#write} function.
 * @returns {ResultProvider} an object whose result() function takes
 * a {@link documents#resultList} success callback.
 */
function readDocuments() {
  return readDocumentsImpl.call(this, false, mlutil.asArray.apply(null, arguments));
}
function readDocumentsImpl(contentOnly, args) {
  if (args.length === 0) {
    throw new Error('must specify at least one document to read');
  }

  var params = (args[0].uris !== undefined) ? args[0] : null;

  var uris;
  var categories;
  var txid;
  var transform;

  if (params !== null) {
    uris = (params.uris instanceof Array) ? params.uris : [params.uris];
    categories = params.categories;
    txid = params.txid;
    transform = params.transform;
  } else if (args[0] instanceof Array) {
    uris = args[0];
  } else if (args.length === 1) {
    var arg = args[0];
    if (valcheck.isString(arg)) {
      uris = [arg];      
    } else {
      throw new Error('must specify the uris parameters with at least one document to read');
    }
  } else {
    uris = args;
  }
  if (categories === undefined) {
    categories = 'content';
  }

  var path = '/v1/documents?format=json&uri='+
    uris.map(encodeURIComponent).join('&uri=');
  path += '&category=' + (
      (categories instanceof Array) ? categories.join('&category=') : categories
      );
  if (txid !== undefined) {
    path += '&txid='+params.txid;
  }
  if (transform !== undefined) {
    path += '&'+mlutil.endpointTransform(transform);
  }

  var requestOptions = mlutil.copyProperties(this.client.connectionParams);
  requestOptions.method = 'GET';
  requestOptions.headers = {
      'Accept': 'multipart/mixed; boundary='+mlrest.multipartBoundary
  };
  requestOptions.path = path;

  var operation = mlrest.createOperation(
      'read documents', this.client, requestOptions, 'empty', 'multipart'
      );
  operation.uris              = uris;
  operation.categories        = categories;
  operation.errorTransform    = uriListErrorTransform;
  if (contentOnly === true) {
    operation.subdata = ['content'];
  }

  return mlrest.startRequest(operation);
}

/**
 * Writes a large document (typically a binary) in incremental chunks with
 * a stream; takes a {@link documents.DocumentDescriptor} object with the
 * following properties (but not a content property).
 * @method documents#createWriteStream
 * @param {string} uri - the identifier for the document to write to the database
 * @param {string[]} [collections] - the collections to which the document should belong
 * @param {object[]} [permissions] - the permissions controlling which users can read or
 * write the document
 * @param {object[]} [properties] - additional properties of the document
 * @param {number} [quality] - a weight to increase or decrease the rank of the document
 * @param {number} [versionId] - an identifier for the currently stored version of the
 * document (when enforcing optimistic locking)
 * @param {string}  [txid] - the transaction id for an open transaction
 * @param {string}  [transform] - the name of a transform extension to apply
 * to the document; the transform must have been installed using
 * the {@link transforms#write} function.
 * @returns {WritableStream} a stream for writing the database document; the
 * stream object also has a result() function that takes
 * a {@link documents#writeResult} success callback.
 */
function createWriteStream(document) {
  if (valcheck.isNullOrUndefined(document) ||
      valcheck.isNullOrUndefined(document.uri)) {
    throw new Error('must specify document for write stream');
  }
  if (!valcheck.isNullOrUndefined(document.content)) {
    throw new Error('must write to stream to supply document content');
  }

  var endpoint = '/v1/documents';
  var sep = '?';
  var categories  = document.categories;
  if (!valcheck.isNullOrUndefined(categories)) {
    endpoint += sep+'category='+(
        (categories instanceof Array) ? categories.join('&category=') : categories
        );
    if (sep !== '&') { sep = '&'; }
  }
  var txid = document.txid;
  if (!valcheck.isNullOrUndefined(txid)) {
    endpoint += sep+'txid='+txid;
    if (sep !== '&') { sep = '&'; }
  }
  var transform = mlutil.endpointTransform(document.transform);
  if (!valcheck.isNullOrUndefined(transform)) {
    endpoint += sep+transform;
    if (sep !== '&') { sep = '&'; }
  }
  var forestName = document.forestName;
  if (!valcheck.isNullOrUndefined(forestName)) {
    endpoint += sep+'forest-name='+forestName;
    if (sep !== '&') { sep = '&'; }
  }

  var multipartBoundary = mlrest.multipartBoundary;

  var requestOptions = mlutil.copyProperties(this.client.connectionParams);
  requestOptions.method = 'POST';
  requestOptions.headers = {
      'Content-Type': 'multipart/mixed; boundary='+multipartBoundary+'1',
      'Accept': 'application/json'
  };
  requestOptions.path = endpoint;

  var requestPartList = [];
  addDocumentParts(requestPartList, document, true);

  var operation = mlrest.createOperation(
      'write document stream', this.client, requestOptions, 'chunkedMultipart', 'single'
      );
  operation.uri               = document.uri;
  operation.requestDocument   = requestPartList;
  operation.multipartBoundary = mlrest.multipartBoundary;
  operation.errorTransform    = uriErrorTransform;

  return mlrest.startRequest(operation);
}

/**
 * A success callback for {@link ResultProvider} that receives the result from
 * the {@link documents#write} or the {@link documents#createWriteStream}
 * functions.
 * @callback documents#writeResult
 * @param {object} response - a response with a documents property providing
 * a sparse array of array of {@link documents.DocumentDescriptor} objects
 * providing the uris of the written documents.
 */
/**
 * Writes one or more documents; takes a configuration object with
 * the following named parameters or, as a shortcut, a document descriptor.
 * @method documents#write
 * @param {DocumentDescriptor|DocumentDescriptor[]} documents - one descriptor
 * or an array of document descriptors to write
 * @param {documents.categories|documents.categories[]}  [categories] - the categories of information
 * to write for the documents
 * @param {string}  [txid] - the transaction id for an open transaction
 * @param {string}  [transform] - the name of a transform extension to apply
 * to each document; the transform must have been installed using
 * the {@link transforms#write} function.
 * @param {string}  [forestName] - the name of a forest in which to write
 * the documents.
 * @returns {ResultProvider} an object whose result() function takes
 * a {@link documents#writeResult} success callback.
 */
function writeDocuments() {
  return writeDocumentsImpl.call(this, false, mlutil.asArray.apply(null, arguments));
}
function writeDocumentsImpl(contentOnly, args) {
  if (args.length < 1) {
    throw new Error('must provide uris for document write()');
  }

  var params = (args[0].documents !== undefined) ? args[0] : null;
  
  var documents = null;
  if (params !== null) {
    documents = (params.documents instanceof Array) ? params.documents :
      [params.documents];
  } else if (args[0] instanceof Array) {
    documents = args[0];
  } else if (args.length === 1) {
    documents = [args[0]];
  } else {
    documents = args;
  }

  var requestParams  =
    (params !== null)        ? params :
    (documents.length === 1) ? documents[0] :
    null;

  var endpoint = '/v1/documents';
  if (requestParams !== null) {
    var sep = '?';
    var category = requestParams.category;
    if (!valcheck.isNullOrUndefined(category)) {
      endpoint += sep+'category='+(
          (category instanceof Array) ? category.join('&category=') : category
          );
      if (sep !== '&') { sep = '&'; }
    }
    var txid = requestParams.txid;
    if (!valcheck.isNullOrUndefined(txid)) {
      endpoint += sep+'txid='+txid;
      if (sep !== '&') { sep = '&'; }
    }
    var transform = mlutil.endpointTransform(requestParams.transform);
    if (!valcheck.isNullOrUndefined(transform)) {
      endpoint += sep+transform;
      if (sep !== '&') { sep = '&'; }
    }
    var forestName = requestParams.forestName;
    if (!valcheck.isNullOrUndefined(forestName)) {
      endpoint += sep+'forest-name='+forestName;
      if (sep !== '&') { sep = '&'; }
    }
  }

  var multipartBoundary = mlrest.multipartBoundary;

  var requestOptions = mlutil.copyProperties(this.client.connectionParams);
  requestOptions.method = 'POST';
  requestOptions.headers = {
      'Content-Type': 'multipart/mixed; boundary='+multipartBoundary+'1',
      'Accept':       'application/json'
  };
  requestOptions.path = endpoint;

  var requestPartList = [];
  for (var i=0; i < documents.length; i++) {
    addDocumentParts(requestPartList, documents[i], false);
  }

  var operation = mlrest.createOperation(
      'write documents', this.client, requestOptions, 'multipart', 'single'
      );
  operation.multipartBoundary = multipartBoundary;
  operation.uris              = getDocumentUris(documents);
  operation.requestPartList   = requestPartList;
  operation.errorTransform    = uriListErrorTransform;
  if (contentOnly === true) {
    operation.subdata = ['documents', 'uri'];
  }

  return mlrest.startRequest(operation);
}
function addDocumentParts(partList, document, isContentOptional) {
  var uri    = document.uri;
  var hasUri = !valcheck.isNullOrUndefined(uri);
  
  var disposition = hasUri ?
      'attachment; filename="'+uri+'"' : 'inline';

  if (!hasUri) {
    var extension = document.extension;
    if (!valcheck.isNullOrUndefined(extension)) {
      disposition += '; extension='+extension;
      var directory = document.directory;
      if (!valcheck.isNullOrUndefined(directory)) {
        disposition += '; directory='+directory;
      }
    }
  }

  var metadata = collectMetadata(document);
  if (!valcheck.isNullOrUndefined(metadata)) {
    partList.push({
      headers:{
      'Content-Type'       : 'application/json; encoding=utf-8',
      'Content-Disposition': disposition+'; category=metadata'
      },
      content: JSON.stringify(metadata)
    });
  }

  var content    = document.content;
  var hasContent = !valcheck.isNullOrUndefined(content);
  if (hasContent || isContentOptional) {
    var marshaledData = hasContent ? mlrest.marshal(content) : null;

    var versionId = document.versionId;
    if (!valcheck.isNullOrUndefined(versionId)) {
      disposition += '; versionId='+versionId;
    }

    var headers = {};
    var part    = {
        headers: headers
        };

    var contentType    = document.contentType;
    var hasContentType = !valcheck.isNullOrUndefined(contentType);
    var format         = document.format;
    var hasFormat      = !valcheck.isNullOrUndefined(format);

    if (hasContentType) {
      headers['Content-Type'] = contentType +
        (valcheck.isString(marshaledData) ? '; encoding=utf-8' : '');
      if (!hasFormat) {
        format = contentType.replace(/^(application|text)\/([^+]+\+)?(json|xml)/, '$3');
        hasFormat = !valcheck.isNullOrUndefined(format);
        if (!hasFormat) {
          hasFormat = contentType.match(/^(text)\//);
          if (hasFormat) {
            format = 'text';
            isString = true;
          }
        }
      }
    }

    if (hasFormat) {
      var lang = null;
      switch(format) {
      case 'binary':
        var extract = document.extract;
        if (!valcheck.isNullOrUndefined(extract)) {
          if (extract === 'document' || extract === 'properties') {
            disposition += '; extract='+extract;
          } else {
            throw new Error('extract must be "document" or "properties": '+extract.toString());
          }
        }
        break;
      case 'json':
        lang = document.lang;
        if (valcheck.isString(lang)) {
          disposition += '; lang='+lang;
        }
        if (!hasContentType) {
          headers['Content-Type'] = 'application/json' +
          (valcheck.isString(marshaledData) ? '; encoding=utf-8' : '');
        }
        break;
      case 'text':
        if (!hasContentType) {
          headers['Content-Type'] = 'text/plain' +
          (valcheck.isString(marshaledData) ? '; encoding=utf-8' : '');
        }
        break;
      case 'xml':
        lang = document.lang;
        if (valcheck.isString(lang)) {
          disposition += '; lang='+lang;
        }
        var repair = document.repair;
        if (!valcheck.isNullOrUndefined(repair)) {
          if (repair === 'full' || repair === 'none') {
            disposition += '; repair='+repair;
          } else {
            throw new Error('repair must be "full" or "none": '+repair.toString());
          }
        }
        if (!hasContentType) {
          headers['Content-Type'] = 'application/xml' +
          (valcheck.isString(marshaledData) ? '; encoding=utf-8' : '');
        }
        break;
      }
    }

    headers['Content-Disposition'] = disposition+'; category=content';

    if (hasContent) {
      part.content = marshaledData;
    }

    partList.push(part);
  }
}

function collectMetadata(document) {
  var metadata = null;
  // TODO: create array wrapper for collections, capabilities
  var metadataCategories = ['collections', 'permissions', 'quality', 'properties'];
  for (var i = 0; i < metadataCategories.length; i++) {
    var category = metadataCategories[i];
    if (!valcheck.isNullOrUndefined(document[category])) {
      if (metadata === null) {
        metadata = {};
      }
      metadata[category] = document[category];
    }
  }
  return metadata;
}

function removeOutputTransform(data) {
  var operation = this;

  return {
    uri:    operation.uri,
    exists: false
  };
}

/**
 * A success callback for {@link ResultProvider} that receives the result from
 * the {@link documents#remove}.
 * @callback documents#removeResult
 * @param {documents.DocumentDescriptor} document - a sparse document descriptor
 * for the removed document 
 */
/**
 * Removes a database document; takes a configuration
 * object with the following named parameters or, as a shortcut,
 * a uri string.
 * @method documents#remove
 * @param {string}  uri - the uri for the database document
 * @param {string}  [txid] - the transaction id for an open transaction
 * @returns {ResultProvider} an object whose result() function takes
 * a {@link documents#removeResult} success callback.
 */
function removeDocument() {
  if (arguments.length !== 1) {
    throw new Error('incorrect number of arguments for document remove()');
  }

  var params = (!valcheck.isString(arguments[0])) ? arguments[0] : null;

  var uri;
  var txid;
  var versionId;

  if (params === null) {
    uri = arguments[0];
  } else {
    uri = params.uri;
    if (uri === undefined) {
      throw new Error('must specify the uri parameter for the document to remove');
    }
    txid = params.txid;
    versionId = params.versionId;
  }

  var path = '/v1/documents?uri='+encodeURIComponent(uri);
  if (txid !== undefined) {
    path += '&txid='+params.txid;
  }

  var requestOptions = mlutil.copyProperties(this.client.connectionParams);
  if (versionId !== undefined) {
    requestOptions.headers = {
        'If-Match': versionId
    };
  }
  requestOptions.method = 'DELETE';
  requestOptions.path = path;

  var operation = mlrest.createOperation(
      'remove document', this.client, requestOptions, 'empty', 'empty'
      );
  operation.uri              = uri;
  operation.validStatusCodes = [204];
  operation.outputTransform  = removeOutputTransform;
  operation.errorTransform   = uriErrorTransform;

  return mlrest.startRequest(operation);
}

function removeAllOutputTransform(data) {
  var operation = this;

  var output = {
    exists: false
  };

  var collections = operation.collections;
  if (!valcheck.isNullOrUndefined(collections)) {
    output.collections = collections;
  }

  var directory = operation.directory;
  if (!valcheck.isNullOrUndefined(directory)) {
    output.directory = directory;
  }

  if (operation.all === true) {
    output.allDocuments = true;
  }

  return output;
}

/**
 * Removes all documents in a list of collections, directory, or
 * database; takes a configuration object with the following named 
 * parameters or no parameters to delete all documents. The user must
 * have the rest-admin role to to delete all documents and the rest-writer
 * role otherwise.
 * @method documents#removeAll
 * @param {string[]}  [collections] - the collections whose documents should be
 * deleted
 * @param {string}  [directory] - a directory whose documents should be
 * deleted
 * @returns {ResultProvider} an object with a result() function taking
 * success and failure callbacks.
 */
function removeAllDocuments(params) {
  if (valcheck.isNullOrUndefined(params)) {
    throw new Error('No directory or collections to delete');
  }

  var deleteAll      = (params.all === true);

  var collections    = params.collections;
  var hasCollections = !valcheck.isNullOrUndefined(collections);

  var directory      = params.directory;
  var hasDirectory   = !valcheck.isNullOrUndefined(directory);

  var txid = params.txid;

  var endpoint = '/v1/search';
  var sep = '?';

  if (hasCollections || hasDirectory) {
    if (deleteAll) {
      throw new Error('delete all conflicts with delete collections and directory');
    }
    if (hasCollections) {
      endpoint += sep+'collection='+(
          (collections instanceof Array) ?
          collections.map(encodeURIComponent).join('&collection=') :
          encodeURIComponent(collections)
          );
      sep = '&';
    }
    if (hasDirectory) {
      endpoint += sep+'directory='+encodeURIComponent(
          (directory.substr(-1) === '/') ? directory : (directory+'/')
          );
      if (sep === '?') {
        sep = '&';
      }
    }
  } else if (!deleteAll) {
    throw new Error('No directory or collections to delete');
  }

  if (!valcheck.isNullOrUndefined(txid)) {
    endpoint += sep+'txid='+txid;
  }

  var requestOptions = mlutil.copyProperties(this.client.connectionParams);
  requestOptions.method = 'DELETE';
  requestOptions.path = endpoint;

  var operation = mlrest.createOperation(
      'remove all documents', this.client, requestOptions, 'empty', 'empty'
      );
  if (hasCollections) {
    operation.collections = collections;
  }
  if (hasDirectory) {
    operation.directory = directory;
  }
  if (deleteAll) {
    operation.all = true;
  }
  operation.outputTransform  = removeAllOutputTransform;

  return mlrest.startRequest(operation);
}

/**
 * Defines a query in the structure accepted by the REST API.
 * @typedef {object} documents.CombinedQueryDefinition
 * @property {object} search - a combined query, which can have properties
 * for a structured query, a string query, and query options
 * @property {documents.categories|documents.categories[]}  [categories] - the categories
 * of information to retrieve for the result documents
 * @property {string} [optionsName] - query options installed on the REST server
 * to merge with any query options provided in the combined query; provided options
 * take precedence over installed options
 * @property {number} [pageStart] - the position of the first document in the returned
 * page of result documents (also known as the result slice) 
 * @property {number} [pageLength] - the number of documents in the returned page
 * of result documents 
 * @property {string}  [txid] - the transaction id for an open transaction to include
 * modified documents in the results if the documents match the criteria
 * @property {string} [view] - a value from the enumeration
 * all|facets|metadata|none|results|uris controlling whether to generate some or all
 * of a search response summarizing the search response in addition to the result
 * documents; the default is 'none' to return only the result documents
 */

/**
 * Executes a query built by a {@link queryBuilder} to match one or more
 * documents.
 * @method documents#query
 * @param {object}  query - a query built by a {@link queryBuilder} or
 * a {@link documents.CombinedQueryDefinition}
 * @returns {ResultProvider} an object whose result() function takes
 * a {@link documents#resultList} success callback.
 */
function queryDocuments(builtQuery) {
  return queryDocumentsImpl.call(this, null, false, builtQuery);
}
function queryDocumentsImpl(collectionParam, contentOnly, builtQuery) {
  if (valcheck.isNullOrUndefined(builtQuery)) {
    throw new Error('no query for documents');
  }

  var categories  = null;
  var optionsName = null;
  var pageStart   = null;
  var pageLength  = null;
  var txid        = null;
  var transform   = null;
  var view        = null;

  var searchBody = {};
  if (!valcheck.isUndefined(builtQuery.search)) {
    searchBody.search = builtQuery.search;

    if (!valcheck.isUndefined(builtQuery.optionsName)) {
      optionsName = builtQuery.optionsName;
    }
    if (!valcheck.isUndefined(builtQuery.pageStart)) {
      pageStart = builtQuery.pageStart;
    }
    if (!valcheck.isUndefined(builtQuery.pageLength)) {
      pageLength = builtQuery.pageLength;
    }
    if (!valcheck.isUndefined(builtQuery.txid)) {
      txid = builtQuery.txid;
    }
    if (!valcheck.isUndefined(builtQuery.transform)) {
      transform = builtQuery.transform;
    }
    if (!valcheck.isUndefined(builtQuery.view)) {
      view = builtQuery.view;
    } else if (!valcheck.isUndefined(builtQuery.search) &&
        !valcheck.isUndefined(builtQuery.search.options) &&
        builtQuery.search.options['return-facets'] === true) {
      view = 'facets';
    }
    categories = (!valcheck.isUndefined(builtQuery.categories)) ?
        builtQuery.categories : ['content', 'collections'];
  } else {
    searchBody.search = {};

    // TODO: validate clauses

    var whereClause = builtQuery.whereClause;
    if (whereClause !== undefined) {
      var query         = whereClause.query;
      var parsedQuery   = whereClause.parsedQuery;
      var fragmentScope = whereClause['fragment-scope'];
      if (query === undefined && parsedQuery === undefined) {
        query = whereClause.$query;
        if (query !== undefined) {
          searchBody.search.$query = query;
        }
      } else {
        if (query !== undefined) {
          searchBody.search.query = query;     
        }
        if (parsedQuery !== undefined) {
          makeParsedQuery(searchBody, parsedQuery);
        }
      }

      if (fragmentScope !== undefined) {
        if (searchBody.search.options === undefined) {
          searchBody.search.options = {
              'fragment-scope': fragmentScope
          };
        } else {
          searchBody.search.options['fragment-scope'] = fragmentScope;
        }
      }
    }

    var calculateClause = builtQuery.calculateClause;
    if (calculateClause !== undefined) {
      if (searchBody.search.options === undefined) {
        searchBody.search.options = {};
      }
      view = 'results';
      searchBody.search.options['return-facets']     = true;
      searchBody.search.options['return-results']    = false;
      searchBody.search.options['return-metrics']    = false;
      searchBody.search.options['return-qtext']      = false;
      searchBody.search.options['transform-results'] = {apply: 'empty-snippet'};
      if (searchBody.search.options.constraint === undefined) {
        searchBody.search.options.constraint = calculateClause.constraint;      
      } else {
        // TODO: convert into a generic deep merge utility
        var constraintLookup = {};
        var searchConstraints = searchBody.search.options.constraint;
        for (var li=0; li < searchConstraints.length; li++) {
          var lookupConstraint = searchConstraints[li];
          constraintLookup[lookupConstraint.name] = lookupConstraint;
        }

        var calculateConstraints = calculateClause.constraint;
        for (var mi=0; mi < calculateConstraints.length; mi++) {
          var calculateConstraint = calculateConstraints[mi];
          var searchConstraint = constraintLookup[calculateConstraint.name];
          if (searchConstraint === undefined) {
            searchConstraints.push(calculateConstraint);
          } else {
            var constraintChildKeys =
              Object.keys(calculateConstraint).filter(notNameFilter);
            for (var ki=0; ki < constraintChildKeys.length; ki++) {
              var constraintChildKey = constraintChildKeys[ki];
              var searchChild = searchConstraint[constraintChildKey];
              if (searchChild === undefined) {
                searchConstraint[constraintChildKey] =
                  calculateConstraint[constraintChildKey];
              } else {
                mlutil.copyProperties(
                    calculateConstraint[constraintChildKey], searchChild
                    );
              }
            }
          }
        }
      }
    }

    var orderByClause = builtQuery.orderByClause;
    if (orderByClause !== undefined) {
      if (searchBody.search.options === undefined) {
        searchBody.search.options = {};
      }
      // TODO: fixup on score by treating value as option and setting to null
      searchBody.search.options['sort-order'] = orderByClause['sort-order'];
    }

    var sliceClause = builtQuery.sliceClause;
    if (sliceClause !== undefined) {
      var sliceStart = sliceClause['page-start'];
      if (sliceStart !== undefined) {
        pageStart = sliceStart;
      }
      var sliceLength = sliceClause['page-length'];
      if (sliceLength !== undefined) {
        pageLength = sliceLength;
      }

      var transformResults = sliceClause['transform-results'];
      if (view === null && !valcheck.isNullOrUndefined(transformResults)) {
        if (searchBody.search.options === undefined) {
          searchBody.search.options = {};
        }
        searchBody.search.options['transform-results'] = transformResults;
        searchBody.search.options['return-results']    = true;
        view = 'results';
      }

      var extractResults = sliceClause['extract-document-data'];
      if (view === null && !valcheck.isNullOrUndefined(extractResults)) {
        if (searchBody.search.options === undefined) {
          searchBody.search.options = {};
        }
        searchBody.search.options['extract-document-data'] = extractResults;
      }

      transform = sliceClause['document-transform'];
    }

    categories = (pageLength > 0) ? ['content', 'collections'] : null;

    var withOptionsClause = builtQuery.withOptionsClause;
    if (withOptionsClause !== undefined) {
      if (searchBody.search.options === undefined) {
        searchBody.search.options = {};
      }

      // TODO: share with queryBuilder.js
      var optionKeyMapping = {
          search:'search-option',     weight:'quality-weight',
          forestNames:'forest-names', similarDocs:'return-similar',
          metrics:'return-metrics',   queryPlan:'return-plan',
          debug:'debug',              concurrencyLevel:'concurrency-level',
          categories:true,            txid:true
        };

      var optionsKeys = Object.keys(withOptionsClause);
      for (var i=0; i < optionsKeys.length; i++) {
        var key     = optionsKeys[i];
        var mapping = optionKeyMapping[key];
        if (mapping !== undefined) {
          var value = withOptionsClause[key];
          if (value !== undefined) {
            if (mapping === true) {
              switch(key) {
              case 'categories':
                if (pageLength !== 0) {
                  categories = value;
                }
                break;
              case 'txid':
                txid = value;
                break;
              }
            } else {
              if (view === null) {
                view = 'results';
              }
              searchBody.search.options[mapping] = value;
            }
          }
        }
      }
    }
  }

  var endpoint =  null;
  if (valcheck.isUndefined(builtQuery.queryFormat)) {
    endpoint = '/v1/search?format=json';
  } else if (builtQuery.queryType === 'qbe') {
    endpoint = '/v1/qbe?format='+builtQuery.queryFormat;
  } else {
    endpoint = '/v1/search?format='+builtQuery.queryFormat;
  }

  if (categories !== null) {
    endpoint += '&category=' +
    (valcheck.isString(categories) ? categories : categories.join('&category='));
  }
  if (optionsName !== null) {
    endpoint += '&options='+optionsName;
  }
  if (pageStart !== null) {
    endpoint += '&start='+pageStart;
  }
  if (pageLength !== null && pageLength !== 0) {
    endpoint += '&pageLength='+pageLength;
  }
  if (txid !== null) {
    endpoint += '&txid='+txid;
  }
  if (!valcheck.isNullOrUndefined(transform)) {
    endpoint += '&'+mlutil.endpointTransform(transform);
  }
  if (view) {
    endpoint += '&view='+view;
  }
  if (!valcheck.isNullOrUndefined(collectionParam)) {
    endpoint += '&collection='+encodeURIComponent(collectionParam);
  }

  var requestOptions = mlutil.copyProperties(this.client.connectionParams);
  requestOptions.method = 'POST';
  requestOptions.headers = {
      'Content-Type': 'application/json',
      'Accept': ((pageLength === 0) ?
          'application/json' :
          'multipart/mixed; boundary='+mlrest.multipartBoundary)
  };
  requestOptions.path = endpoint;

  var operation = mlrest.createOperation(
      'query documents', this.client, requestOptions, 'single',
      ((pageLength === 0) ? 'single' : 'multipart')
      );
  operation.validStatusCodes = [200, 204, 404];
  operation.requestBody      = searchBody;
  if (contentOnly === true) {
    operation.subdata = ['content'];
  }

  return mlrest.startRequest(operation);
}

function makeParsedQuery(searchBody, parsedQuery) {
  searchBody.search.qtext = parsedQuery.qtext;
  var constraintBindings = parsedQuery.constraint;
  var hasConstraints     = (constraintBindings !== undefined);
  var termBinding        = parsedQuery.term;
  var hasTerm            = (termBinding !== undefined);
  if (hasConstraints || hasTerm) {
    var parsedOptions = {};
    if (hasConstraints) {
      parsedOptions.constraint = constraintBindings;
    }
    if (hasTerm) {
      parsedOptions.term = termBinding;
    }
    searchBody.search.options = parsedOptions;
  }
}

function notNameFilter(key) {
  switch(key) {
  case 'name': return false;
  default:     return true;
  }
}

function patchOutputTransform(data) {
  var operation = this;

  return {
    uri: operation.uri
  };
}

/**
 * A success callback for {@link ResultProvider} that receives the result from
 * the {@link documents#patch} function.
 * @callback documents#patchResult
 * @param {object} document - a sparse {@link documents.DocumentDescriptor} object
 * providing the uri of the patched document.
 */
/**
 * Applies changes to a document; takes a configuration object with
 * the following named parameters or, as a shortcut, a uri string and
 * one or more patch operations produced by a {@link patchBuilder}.
 * @method documents#patch
 * @param {string}  uri - the uri
 * @param {patchOperation|patchOperation[]} operations - delete, insert,
 * or replace operations produced by a {@link patchBuilder} to apply
 * to the document.
 * @param {documents.categories|documents.categories[]}  [categories] - the
 * categories of information modified by the patch (typically 'content')
 * @param {string}  [txid] - the transaction id to patch the document
 * as part of a larger multi-statement transaction
 * @param {number} [versionId] - an identifier for the currently stored version
 * of the document (when enforcing optimistic locking)
 * @returns {ResultProvider} an object whose result() function takes
 * a {@link documents#patchResult} success callback.
 */
function patchDocuments() {
  var argLen = arguments.length;

  var params = (argLen === 1 && arguments[0].uri !== undefined) ?
      arguments[0] : null;

  var uri = (params !== null) ? params.uri  : (argLen > 1) ? arguments[0] : null;

  var documentOperations = null;
  if (params !== null) {
    documentOperations = valcheck.isArray(params.operations) ?
      params.operations : [params.operations];
  } else if (argLen > 1) {
    if (valcheck.isArray(arguments[1])) {
      documentOperations = arguments[1];
    } else {
      documentOperations = new Array(argLen - 1);
      for(var i=1; i < argLen; ++i) {
        documentOperations[i - 1] = arguments[i];
      }
    }
  }

  if (uri === null || documentOperations === null || documentOperations.length === 0) {
    throw new Error('patch requires a uri and operations');
  }

  var pathlang = null;
  documentOperations = documentOperations.filter(function(arg){
    if (valcheck.isNullOrUndefined(pathlang)) {
      pathlang = arg.pathlang;
      if (!valcheck.isNullOrUndefined(pathlang)) {
        return false;
      }
    }
    return true;
  });

  var categories = (params !== null) ? params.categories : null;
  var txid       = (params !== null) ? params.txid       : null;
  var versionId  = (params !== null) ? params.versionId  : null;

  var endpoint = '/v1/documents?format=json&uri='+encodeURIComponent(uri);
  if (!valcheck.isNullOrUndefined(categories)) {
    if (!(categories instanceof Array)) {
      endpoint += '&category=' + categories;
    } else if (categories.length > 0) {
      endpoint += '&category=' + categories.join('&category=');
    }
  }
  if (!valcheck.isNullOrUndefined(txid)) {
    endpoint += '&txid=' + txid;
  }

  var patchBody = {patch: documentOperations};
  if (!valcheck.isNullOrUndefined(pathlang)) {
    patchBody.pathlang = pathlang;
  }

  var requestOptions = mlutil.copyProperties(this.client.connectionParams);
  requestOptions.method = 'POST';
  requestOptions.headers = {
      'Content-Type':           'application/json',
      'Accept':                 'application/json',
      'X-HTTP-Method-Override': 'PATCH'
  };
  if (!valcheck.isNullOrUndefined(versionId)) {
    requestOptions.headers['If-Match'] = versionId;
  }
  requestOptions.path = endpoint;

  var operation = mlrest.createOperation(
      'patch document', this.client, requestOptions, 'single', 'single'
      );
  operation.uri             = uri;
  operation.outputTransform = patchOutputTransform;
  operation.requestBody     = patchBody;
  operation.errorTransform  = uriErrorTransform;

  return mlrest.startRequest(operation);
}

function documents(client) {
  this.client = client;
}
documents.prototype.createWriteStream  = createWriteStream;
documents.prototype.patch              = patchDocuments;
documents.prototype.probe              = probeDocument;
documents.prototype.query              = queryDocuments;
documents.prototype.read               = readDocuments;
documents.prototype.remove             = removeDocument;
documents.prototype.removeAll          = removeAllDocuments;
documents.prototype.write              = writeDocuments;

function createDocuments(client) {
  return new documents(client);
}

module.exports = {
    create:    createDocuments,
    probeImpl: probeDocumentsImpl,
    queryImpl: queryDocumentsImpl,
    readImpl:  readDocumentsImpl,
    writeImpl: writeDocumentsImpl
};
