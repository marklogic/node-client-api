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
  if (!valcheck.isNullOrUndefined(document)) {
    var uri = document.uri;
    if (valcheck.isString(uri) && uri.length > 0) {
      documents.push(uri);
    }
  }
  return documents;
}
/** @ignore */
function getDocumentUris(documents) {
  if (!valcheck.isArray(documents) || documents.length === 0) {
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
function probeOutputTransform(headers) {
  var operation = this;

  var statusCode = operation.responseStatusCode;
  var exists     = (statusCode === 200) ? true : false;
  if (operation.contentOnly === true) {
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
    if (valcheck.isNullOrUndefined(uri)) {
      throw new Error('must specify the uri parameter for the document to check');
    }
    path += '&uri='+encodeURIComponent(uri);

    var txid = params.txid;
    if (!valcheck.isNullOrUndefined(txid)) {
      path += '&txid='+txid;
    }
  }

  var connectionParams = this.client.connectionParams;
  var requestOptions = mlutil.copyProperties(connectionParams);
  requestOptions.method = 'HEAD';
  requestOptions.path = mlutil.databaseParam(connectionParams, path, '&');

  var operation = mlrest.createOperation(
      'probe document', this.client, requestOptions, 'empty', 'empty'
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

  var arg = args[0];
  var uris = arg.uris;
  var params = valcheck.isNullOrUndefined(uris) ? null : arg;

  var categories = null;
  var txid = null;
  var transform = null;

  if (params !== null) {
    if (!valcheck.isArray(uris)) {
      uris = [uris];
    }
    categories = params.categories;
    txid = params.txid;
    transform = params.transform;
  } else if (valcheck.isArray(arg)) {
    uris = arg;
  } else if (args.length === 1) {
    if (valcheck.isString(arg)) {
      uris = [arg];      
    } else {
      throw new Error('must specify the uris parameters with at least one document to read');
    }
  } else {
    uris = args;
  }
  if (valcheck.isNullOrUndefined(categories)) {
    categories = 'content';
  }

  var path = '/v1/documents?format=json&uri='+
    uris.map(encodeURIComponent).join('&uri=');
  path += '&category=' + (
      valcheck.isArray(categories) ? categories.join('&category=') : categories
      );
  if (!valcheck.isNullOrUndefined(txid)) {
    path += '&txid='+params.txid;
  }
  if (!valcheck.isNullOrUndefined(transform)) {
    path += '&'+mlutil.endpointTransform(transform);
  }

  var connectionParams = this.client.connectionParams;
  var requestOptions = mlutil.copyProperties(connectionParams);
  requestOptions.method = 'GET';
  requestOptions.headers = {
      'Accept': 'multipart/mixed; boundary='+mlrest.multipartBoundary
  };
  requestOptions.path = mlutil.databaseParam(connectionParams, path, '&');

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
        valcheck.isArray(categories) ? categories.join('&category=') : categories
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

  var connectionParams = this.client.connectionParams;
  var requestOptions = mlutil.copyProperties(connectionParams);
  requestOptions.method = 'POST';
  requestOptions.headers = {
      'Content-Type': 'multipart/mixed; boundary='+multipartBoundary+'1',
      'Accept': 'application/json'
  };
  requestOptions.path = mlutil.databaseParam(connectionParams, endpoint, sep);

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
 * @param {string} [temporalCollection] - the name of the temporal collection;
 * use only when writing temporal documents that have the JSON properties or XML elements
 * specifying the valid and system start and end times as defined by the valid and
 * system axis for the temporal collection
 * @param {string|Date} [systemTime] - a datetime to use as the system start time
 * instead of the current time of the database server; can only be supplied
 * if the temporalCollection parameter is also supplied
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

  var arg = args[0];
  var documents = arg.documents;
  var params = valcheck.isNullOrUndefined(documents) ? null : arg;
  if (params !== null) {
    if (!valcheck.isArray(documents)) {
      documents = [documents];
    }
  } else if (valcheck.isArray(arg)) {
    documents = arg;
  } else {
    documents = args;
  }

  var requestParams  =
    (params !== null)        ? params :
    (documents.length === 1) ? documents[0] :
    null;

  var endpoint = '/v1/documents';
  var sep = '?';
  if (requestParams !== null) {
    var category = requestParams.category;
    if (!valcheck.isNullOrUndefined(category)) {
      endpoint += sep+'category='+(
          valcheck.isArray(category) ? category.join('&category=') : category
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
    var temporalCollection = requestParams.temporalCollection;
    if (!valcheck.isNullOrUndefined(temporalCollection)) {
      endpoint += sep+'temporal-collection='+temporalCollection;
      if (sep !== '&') { sep = '&'; }
      var systemTime = requestParams.systemTime;
      if (valcheck.isString(systemTime)) {
        path += '&system-time='+systemTime;
      } else if (valcheck.isDate(systemTime)) {
        path += '&system-time='+systemTime.toISOString();
      }
    }
  }

  var multipartBoundary = mlrest.multipartBoundary;

  var connectionParams = this.client.connectionParams;
  var requestOptions = mlutil.copyProperties(connectionParams);
  requestOptions.method = 'POST';
  requestOptions.headers = {
      'Content-Type': 'multipart/mixed; boundary='+multipartBoundary+'1',
      'Accept':       'application/json'
  };
  requestOptions.path = mlutil.databaseParam(connectionParams, endpoint, sep);

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
          hasFormat = /^(text)\//.test(contentType);
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

function removeOutputTransform(headers, data) {
  var operation = this;

  if (operation.contentOnly === true) {
    return operation.uri;
  }

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
 * @param {string} [temporalCollection] - the name of the temporal collection;
 * use only when deleting a document created as a temporal document; sets the
 * system end time to record when the document was no longer active
 * @param {string|Date} [systemTime] - a datetime to use as the system end time
 * instead of the current time of the database server; can only be supplied
 * if the temporalCollection parameter is also supplied
 * @returns {ResultProvider} an object whose result() function takes
 * a {@link documents#removeResult} success callback.
 */
function removeDocument() {
  return removeDocumentImpl.call(this, false, mlutil.asArray.apply(null, arguments));
}
function removeDocumentImpl(contentOnly, args) {
  if (args.length !== 1) {
    throw new Error('incorrect number of arguments for document remove()');
  }

  var arg = args[0];
  var params = valcheck.isString(arg) ? null : arg;

  var uri = null;
  var txid = null;
  var temporalCollection = null;
  var systemTime = null;
  var versionId = null;

  if (params === null) {
    uri = arg;
  } else {
    uri = params.uri;
    if (valcheck.isNullOrUndefined(uri)) {
      throw new Error('must specify the uri parameter for the document to remove');
    }
    txid = params.txid;
    temporalCollection = params.temporalCollection;
    systemTime = params.systemTime;
    versionId = params.versionId;
  }

  var path = '/v1/documents?uri='+encodeURIComponent(uri);
  if (!valcheck.isNullOrUndefined(txid)) {
    path += '&txid='+params.txid;
  }
  if (!valcheck.isNullOrUndefined(temporalCollection)) {
    path += '&temporal-collection='+temporalCollection;
    if (valcheck.isString(systemTime)) {
      path += '&system-time='+systemTime;
    } else if (valcheck.isDate(systemTime)) {
      path += '&system-time='+systemTime.toISOString();
    }
  }

  var connectionParams = this.client.connectionParams;
  var requestOptions = mlutil.copyProperties(connectionParams);
  if (!valcheck.isNullOrUndefined(versionId)) {
    requestOptions.headers = {
        'If-Match': versionId
    };
  }
  requestOptions.method = 'DELETE';
  requestOptions.path = mlutil.databaseParam(connectionParams, path, '&');

  var operation = mlrest.createOperation(
      'remove document', this.client, requestOptions, 'empty', 'empty'
      );
  operation.uri              = uri;
  operation.validStatusCodes = [204];
  operation.outputTransform  = removeOutputTransform;
  operation.errorTransform   = uriErrorTransform;
  operation.contentOnly      = (contentOnly === true);

  return mlrest.startRequest(operation);
}

function removeAllOutputTransform(headers, data) {
  var operation = this;

  if (operation.contentOnly === true) {
    return operation.collection;
  }

  var output = {
    exists: false
  };

  var collection = operation.collection;
  if (!valcheck.isNullOrUndefined(collection)) {
    output.collection = collection;
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
 * Removes all documents in a collection, directory, or database; 
 * takes a configuration object with the following named 
 * parameters or no parameters to delete all documents. The user must
 * have the rest-admin role to to delete all documents and the rest-writer
 * role otherwise.
 * @method documents#removeAll
 * @param {string}  [collection] - the collection whose documents should be
 * deleted
 * @param {string}  [directory] - a directory whose documents should be
 * deleted
 * @returns {ResultProvider} an object with a result() function taking
 * success and failure callbacks.
 */
function removeAllDocuments(params) {
  return removeAllDocumentsImpl.call(this, false, params);
}
function removeAllDocumentsImpl(contentOnly, params) {
  if (valcheck.isNullOrUndefined(params)) {
    throw new Error('No parameters specifying directory or collection to delete');
  }

  var deleteAll     = (params.all === true);

  var collection    = params.collection;
  var hasCollection = !valcheck.isNullOrUndefined(collection);

  var directory     = params.directory;
  var hasDirectory  = !valcheck.isNullOrUndefined(directory);

  var txid = params.txid;

  var endpoint = '/v1/search';
  var sep = '?';

  if (hasCollection || hasDirectory) {
    if (deleteAll) {
      throw new Error('delete all conflicts with delete collection and directory');
    }
    if (hasCollection) {
      endpoint += sep+'collection='+encodeURIComponent(collection);
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
    throw new Error('No directory or collection to delete');
  }

  if (!valcheck.isNullOrUndefined(txid)) {
    endpoint += sep+'txid='+txid;
    if (sep === '?') {
      sep = '&';
    }
  }

  var connectionParams = this.client.connectionParams;
  var requestOptions = mlutil.copyProperties(connectionParams);
  requestOptions.method = 'DELETE';
  requestOptions.path = mlutil.databaseParam(connectionParams, endpoint, sep);

  var operation = mlrest.createOperation(
      'remove all documents', this.client, requestOptions, 'empty', 'empty'
      );
  if (hasCollection) {
    operation.collection = collection;
  }
  if (hasDirectory) {
    operation.directory = directory;
  }
  if (deleteAll) {
    operation.all = true;
  }
  operation.outputTransform  = removeAllOutputTransform;
  operation.contentOnly      = (contentOnly === true);

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
    var search = {};
    searchBody.search = search;

    var searchOptions = null;

    // TODO: validate clauses

    var whereClause = builtQuery.whereClause;
    if (!valcheck.isNullOrUndefined(whereClause)) {
      var query          = whereClause.query;
      var hasQuery       = !valcheck.isNullOrUndefined(query);
      var parsedQuery    = whereClause.parsedQuery;
      var hasParsedQuery = !valcheck.isNullOrUndefined(parsedQuery);
      var fragmentScope  = whereClause['fragment-scope'];
      if (!hasQuery && !hasParsedQuery) {
        query = whereClause.$query;
        if (!valcheck.isNullOrUndefined(query)) {
          search.$query = query;
        }
      } else {
        if (hasQuery) {
          search.query = query;     
        }
        if (hasParsedQuery) {
          makeParsedQuery(searchBody, parsedQuery);
        }
      }

      if (!valcheck.isNullOrUndefined(fragmentScope)) {
        searchOptions = search.options;
        if (valcheck.isNullOrUndefined(searchOptions)) {
          searchOptions = {};
          search.options = searchOptions;
        }
        searchOptions['fragment-scope'] = fragmentScope;
      }
    }

    var calculateClause = builtQuery.calculateClause;
    if (!valcheck.isNullOrUndefined(calculateClause)) {
      searchOptions = search.options;
      if (valcheck.isNullOrUndefined(searchOptions)) {
        searchOptions = {};
        search.options = searchOptions;
      }
      view = 'results';
      searchOptions['return-facets']     = true;
      searchOptions['return-results']    = false;
      searchOptions['return-metrics']    = false;
      searchOptions['return-qtext']      = false;
      searchOptions['transform-results'] = {apply: 'empty-snippet'};
      var searchConstraintList = searchOptions.constraint;
      if (valcheck.isNullOrUndefined(searchConstraintList)) {
        searchOptions.constraint = calculateClause.constraint;      
      } else {
        // TODO: convert into a generic deep merge utility
        var constraintLookup = {};
        for (var li=0; li < searchConstraintList.length; li++) {
          var lookupConstraint = searchConstraintList[li];
          constraintLookup[lookupConstraint.name] = lookupConstraint;
        }

        var calculateConstraints = calculateClause.constraint;
        for (var mi=0; mi < calculateConstraints.length; mi++) {
          var calculateConstraint = calculateConstraints[mi];
          var searchConstraint = constraintLookup[calculateConstraint.name];
          if (valcheck.isNullOrUndefined(searchConstraint)) {
            searchConstraintList.push(calculateConstraint);
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
    if (!valcheck.isNullOrUndefined(orderByClause)) {
      if (valcheck.isNullOrUndefined(searchOptions)) {
        searchOptions = {};
        search.options = searchOptions;
      }
      // TODO: fixup on score by treating value as option and setting to null
      searchOptions['sort-order'] = orderByClause['sort-order'];
    }

    var sliceClause = builtQuery.sliceClause;
    if (!valcheck.isNullOrUndefined(sliceClause)) {
      var sliceStart = sliceClause['page-start'];
      if (!valcheck.isNullOrUndefined(sliceStart)) {
        pageStart = sliceStart;
      }
      var sliceLength = sliceClause['page-length'];
      if (!valcheck.isNullOrUndefined(sliceLength)) {
        pageLength = sliceLength;
      }

      var transformResults = sliceClause['transform-results'];
      if (view === null && !valcheck.isNullOrUndefined(transformResults)) {
        if (valcheck.isNullOrUndefined(searchOptions)) {
          searchOptions = {};
          search.options = searchOptions;
        }
        searchOptions['transform-results'] = transformResults;
        searchOptions['return-results']    = true;
        view = 'results';
      }

      var extractResults = sliceClause['extract-document-data'];
      if (view === null && !valcheck.isNullOrUndefined(extractResults)) {
        if (valcheck.isNullOrUndefined(searchOptions)) {
          searchOptions = {};
          search.options = searchOptions;
        }
        searchOptions['extract-document-data'] = extractResults;
      }

      transform = sliceClause['document-transform'];
    }

    categories = (pageLength > 0) ? ['content', 'collections'] : null;

    var withOptionsClause = builtQuery.withOptionsClause;
    if (!valcheck.isNullOrUndefined(withOptionsClause)) {
      if (valcheck.isNullOrUndefined(searchOptions)) {
        searchOptions = {};
        search.options = searchOptions;
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
        if (!valcheck.isNullOrUndefined(mapping)) {
          var value = withOptionsClause[key];
          if (!valcheck.isNullOrUndefined(value)) {
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
              searchOptions[mapping] = value;
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

  var connectionParams = this.client.connectionParams;
  var requestOptions = mlutil.copyProperties(connectionParams);
  requestOptions.method = 'POST';
  requestOptions.headers = {
      'Content-Type': 'application/json',
      'Accept': ((pageLength === 0) ?
          'application/json' :
          'multipart/mixed; boundary='+mlrest.multipartBoundary)
  };
  requestOptions.path = mlutil.databaseParam(connectionParams, endpoint, '&');

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
  var hasConstraints     = !valcheck.isNullOrUndefined(constraintBindings);
  var termBinding        = parsedQuery.term;
  var hasTerm            = !valcheck.isNullOrUndefined(termBinding);
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

function patchOutputTransform(headers, data) {
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

  var arg = arguments[0];

  var params = (argLen === 1) ? arg : null;

  // TODO: allow for raw JSON or XML patch

  var uri                = null;
  var documentOperations = null;
  var categories         = null;
  var txid               = null;
  var versionId          = null;
  var pathlang           = null;
  var format             = null;
  var isRawPatch         = false;
  if (params !== null) {
    uri        = params.uri;
    arg        = params.operations;
    if (!valcheck.isNullOrUndefined(arg)) {
      if (valcheck.isString(arg) || valcheck.isBuffer(arg) ||
          !valcheck.isNullOrUndefined(arg.patch)) {
        documentOperations = arg;
        isRawPatch = true;
      } else if (valcheck.isArray(arg)) {
        documentOperations = arg;
      } else {
        documentOperations = [arg];
      }
    }
    categories = params.categories;
    txid       = params.txid;
    versionId  = params.versionId;
    format     = params.format;
  } else if (argLen > 1) {
    uri = arg;
    arg = arguments[1];
    if (valcheck.isString(arg) || valcheck.isBuffer(arg) ||
        !valcheck.isNullOrUndefined(arg.patch)) {
      documentOperations = arg;
      isRawPatch = true;
    } else if (valcheck.isArray(arg)) {
      documentOperations = arg;
    } else {
      documentOperations = new Array(argLen - 1);
      documentOperations[0] = arg;
      for(var i=2; i < argLen; ++i) {
        documentOperations[i - 1] = arguments[i];
      }
    }
  }

  if (valcheck.isNullOrUndefined(uri) || valcheck.isNullOrUndefined(documentOperations)) {
    throw new Error('patch must specify a uri and operations');
  }

  if (valcheck.isNullOrUndefined(format)) {
    format = /\.xml$/.test(uri) ? 'xml' : 'json';
  }

  if (!isRawPatch) {
    documentOperations = documentOperations.filter(function(operation){
      if (valcheck.isNullOrUndefined(pathlang)) {
        pathlang = operation.pathlang;
        if (!valcheck.isNullOrUndefined(pathlang)) {
          return false;
        }
      }
      return true;
    });
    if (documentOperations.length === 0) {
      throw new Error('patch must specify operations');
    }
  }

  var endpoint = '/v1/documents?uri='+encodeURIComponent(uri);
  if (!valcheck.isNullOrUndefined(categories)) {
    if (!valcheck.isArray(categories)) {
      endpoint += '&category=' + categories;
    } else if (categories.length > 0) {
      endpoint += '&category=' + categories.join('&category=');
    }
  }
  if (!valcheck.isNullOrUndefined(txid)) {
    endpoint += '&txid=' + txid;
  }

  var patchBody = isRawPatch ? documentOperations : {patch: documentOperations};
  if (!isRawPatch && !valcheck.isNullOrUndefined(pathlang)) {
    patchBody.pathlang = pathlang;
  }

  var connectionParams = this.client.connectionParams;
  var requestOptions = mlutil.copyProperties(connectionParams);
  requestOptions.method = 'POST';
  requestOptions.headers = {
      'Content-Type':
        ((format === 'xml') ? 'application/xml' : 'application/json'),
      'Accept':                 'application/json',
      'X-HTTP-Method-Override': 'PATCH'
  };
  if (!valcheck.isNullOrUndefined(versionId)) {
    requestOptions.headers['If-Match'] = versionId;
  }
  requestOptions.path = mlutil.databaseParam(connectionParams, endpoint, '&');

  var operation = mlrest.createOperation(
      'patch document', this.client, requestOptions, 'single', 'single'
      );
  operation.uri             = uri;
  operation.outputTransform = patchOutputTransform;
  operation.requestBody     = patchBody;
  operation.errorTransform  = uriErrorTransform;

  return mlrest.startRequest(operation);
}

/**
 * For a partial textual value in a string search, looks up completions
 * that match documents in the database. The textual value may be
 * prefixed with the tag for a binding or an unqualified word or phrase.
 * You may pass a configuration object with
 * the following named parameters or, as a shortcut, the input string and
 * optionally the bindings.
 * @method documents#suggest
 * @param {string} input - the partial search string
 * @param {queryBuilder.ParseBindings} [bindings] - the bindings for
 * the string search as returned by the {@link queryBuilder#parseBindings}
 * function
 * @param {number} [limit] - the number of completion candidates to return
 * @returns {ResultProvider} an object whose result() function takes
 * a success callback that receives an array with the candidate completion
 * strings.
 */
function suggestDocuments() {
  var argLen = arguments.length;
  if (argLen < 1) {
    throw new Error('must supply input and bindings for document suggestion');
  }

  var input    = null;
  var bindings = null;
  var limit    = null;
  var queries  = null;
  var facets   = null;
  if (argLen === 1) {
    var params = arguments[0];
    input    = params.input;
    bindings = params.bindings;
    limit    = params.limit;
    queries  = params.queries;
    facets   = params.facets;
  } else {
    input    = arguments[0];
    bindings = arguments[1];
  }
  if (valcheck.isNullOrUndefined(input)) {
    throw new Error('no input for document suggestion');
  }
  if (valcheck.isNullOrUndefined(bindings)) {
    throw new Error('no bindings for document suggestion');
  }

  var suggestionSource = null;
  var defaultSuggestionSource = null;

  var bindingKeys = Object.keys(bindings);
  var key = null;
  var i = null;
  for (i=0; i < bindingKeys.length; i++) {
    key = bindingKeys[i];
    switch (key) {
    case 'term':
      defaultSuggestionSource = bindings.term['default'];
      break;
    case 'constraint':
      suggestionSource = copyConstraint(suggestionSource, bindings.constraint);
      break;
    }
  }

  if (!valcheck.isNullOrUndefined(facets)) {
    suggestionSource = copyConstraint(suggestionSource, facets.constraint);
  }

  var suggestOptions = {};
  if (!valcheck.isNull(defaultSuggestionSource)) {
    suggestOptions['default-suggestion-source'] = defaultSuggestionSource;
  }
  if (!valcheck.isNull(suggestionSource)) {
    suggestOptions['suggestion-source'] = suggestionSource;
  }

  var searchBody = {
    options: suggestOptions
  };
  if (valcheck.isString(queries)) {
    searchBody.qtext = [queries];
  } else if (valcheck.isArray(queries)) {
    searchBody.qtext = queries;
  }

  var endpoint = '/v1/suggest?partial-q='+input;
  if (!valcheck.isNullOrUndefined(limit)) {
    endpoint += '&limit=' + limit;
  }
  
/* TODO:
suggestion options
persisted query options
 */

  var connectionParams = this.client.connectionParams;
  var requestOptions = mlutil.copyProperties(connectionParams);
  requestOptions.method = 'POST';
  requestOptions.headers = {
      'Content-Type':           'application/json',
      'Accept':                 'application/json',
  };
  requestOptions.path = mlutil.databaseParam(connectionParams, endpoint, '&');

  var operation = mlrest.createOperation(
      'search suggest', this.client, requestOptions, 'single', 'single'
      );
  operation.input       = input;
  operation.requestBody = {search: searchBody};
  operation.subdata     = ['suggestions'];

  return mlrest.startRequest(operation);
}

/** @ignore */
function copyConstraint(destination, constraints) {
  if (valcheck.isArray(constraints)) {
    var isCopyKey = {
      collection:     true,
      range:          true,
      word:           true,
      'word-lexicon': true,
      value:          true
    };
    var source = null;
    var copy   = null;
    var keys   = null;
    var key    = null;
    var i      = null;
    var j      = null;
    for (i=0; i < constraints.length; i++) {
      source = constraints[i];
      keys = Object.keys(source);
      for (j=0; j < keys.length; j++) {
        key = keys[j];
        if (isCopyKey[key] === true) {
          if (valcheck.isNull(copy)) {
            copy = {};
          }
          copy[key] = source[key];
        } else if (key === 'name') {
          if (valcheck.isNull(copy)) {
            copy = {};
          }
          copy.ref = source.name;
        }
      }
    }
    if (!valcheck.isNull(copy)) {
      if (valcheck.isNullOrUndefined(destination)) {
        destination = [];
      }
      destination.push(copy);
      copy = null;
    }
  }

  return destination;
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
documents.prototype.suggest            = suggestDocuments;
documents.prototype.write              = writeDocuments;

function createDocuments(client) {
  return new documents(client);
}

module.exports = {
    create:               createDocuments,
    probeImpl:            probeDocumentsImpl,
    queryImpl:            queryDocumentsImpl,
    readImpl:             readDocumentsImpl,
    removeImpl:           removeDocumentImpl,
    removeCollectionImpl: removeAllDocumentsImpl,
    writeImpl:            writeDocumentsImpl
};
