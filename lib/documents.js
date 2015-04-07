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
var util     = require("util");
var deepcopy = require('deepcopy');
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
  operation.contentOnly      = (contentOnly === true);

  return mlrest.startRequest(operation);
}

/** @ignore */
function readStatusValidator(statusCode) {
  return (statusCode < 400 || statusCode === 404) ?
      null : "response with invalid "+statusCode+" status";
}
/** @ignore */
function singleReadOutputTransform(headers, data) {
  var operation = this;

  var hasData = !valcheck.isNullOrUndefined(data);
  if (hasData &&
      !valcheck.isNullOrUndefined(data.errorResponse) &&
      data.errorResponse.statusCode === 404
      ) {
    return [];
  }

  var content = hasData ? data : null;

  if (operation.contentOnly === true) {
    return [content];
  }

  var categories = operation.categories;

  var document = (categories.length === 1 && categories[0] === 'content') ?
      {content: content} : collectMetadata(content);

  document.uri      = operation.uris[0];
  document.category = categories;

  var format = headers.format;
  if (valcheck.isString(format)) {
    document.format = format;
    if (format !== 'json') {
      var contentLength = headers.contentLength;
      if (!valcheck.isNullOrUndefined(contentLength)) {
        document.contentLength = contentLength;
      }
    }
  }

  var headerList  = ['contentType', 'versionId'];
  var headerKey   = null; 
  var headerValue = null; 
  var i = 0;
  for (i = 0; i < headerList.length; i++) {
    headerKey = headerList[i];
    headerValue = headers[headerKey];
    if (!valcheck.isNullOrUndefined(headerValue)) {
      document[headerKey] = headerValue;
    }
  }

  return [document];
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
  var contentType = null;
  var range = null;

  if (params !== null) {
    if (!valcheck.isArray(uris)) {
      uris = [uris];
    }
    categories = params.categories;
    txid = params.txid;
    transform = params.transform;
    contentType = params.contentType;
    range = params.range;
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
    categories = ['content'];
  } else if (valcheck.isString(categories)) {
    categories = [categories];
  }

  var path = '/v1/documents?format=json&uri='+
    uris.map(encodeURIComponent).join('&uri=');
  path += '&category=' + categories.join('&category=');
  if (!valcheck.isNullOrUndefined(txid)) {
    path += '&txid='+params.txid;
  }
  if (!valcheck.isNullOrUndefined(transform)) {
    path += '&'+mlutil.endpointTransform(transform);
  }

  var isSinglePayload = (
      uris.length === 1 && (
          (categories.length === 1 && categories[0] === 'content') ||
          categories.indexOf('content') === -1
      ));

  var connectionParams = this.client.connectionParams;
  var requestOptions = mlutil.copyProperties(connectionParams);
  requestOptions.method = 'GET';
  requestOptions.path = mlutil.databaseParam(connectionParams, path, '&');
  if (!isSinglePayload) {
    requestOptions.headers = {
        Accept: 'multipart/mixed; boundary='+mlrest.multipartBoundary
    };
  } else {
    var hasContentType = false;
    if (!valcheck.isNullOrUndefined(contentType)) {
      if (valcheck.isString(contentType)) {
        hasContentType = true;
      } else {
        throw new Error('contentType is not string: '+contentType);
      }
    }
      
    if (!valcheck.isNullOrUndefined(range)) {
      if (!valcheck.isArray(range)) {
        throw new Error('byte range parameter for reading binary document is not an array: '+range);
      }
      var bytes = null;
      switch (range.length) {
      case 0:
        throw new Error('no start length for byte range parameter for reading binary document');
      case 1:
        if (!valcheck.isNumber(range[0])) {
          throw new Error('start length for byte range parameter is not integer: '+range[0]);
        }
        bytes = 'bytes=' + range[0] + '-';
        break;
      case 2:
        if (!valcheck.isNumber(range[0])) {
          throw new Error('start length for byte range parameter is not integer: '+range[0]);
        }
        if (!valcheck.isNumber(range[1])) {
          throw new Error('end length for byte range parameter is not integer: '+range[1]);
        }
        if (range[0] >= range[1]) {
          throw new Error('start length greater than or equal to end length for byte range: '+range);
        }
        bytes = 'bytes=' + range[0] + '-' + (range[1] - 1);
        break;
      default:
        throw new Error('byte range parameter has more than start and end length: '+range);
      }

      if (!hasContentType) {
        requestOptions.headers = {
            Range: bytes
        };
      } else if (contentType.search(/^(application\/([^+]+\+)?(json|xml)|text\/.*)$/) > -1) {
        throw new Error('cannot request byte range for JSON, text, or XML document: '+contentType);
      } else {
        requestOptions.headers = {
            Range:          bytes,
            'Content-Type': contentType
        };
      }
    } else if (hasContentType) {
      requestOptions.headers = {
          'Content-Type': contentType
      };
    }
  }

  var operation = mlrest.createOperation(
      'read documents', this.client, requestOptions, 'empty', 
        (isSinglePayload ? 'single' : 'multipart')
      );
  operation.uris           = uris;
  operation.categories     = categories;
  operation.errorTransform = uriListErrorTransform;
  if (isSinglePayload) {
    operation.contentOnly         = (contentOnly === true);
    operation.outputTransform     = singleReadOutputTransform;
    operation.statusCodeValidator = readStatusValidator;
  } else if (contentOnly === true) {
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

  var categories = document.categories;
  var hasCategories = valcheck.isArray(categories) && categories.length > 0;
  if (!hasCategories && valcheck.isString(categories)) {
    categories = [categories];
  }

  if (valcheck.isNullOrUndefined(document.properties)) {
    return writeContent.call(this, false, document, document, categories, 'chunked');
  }

  return writeStreamImpl.call(this, document, categories);
}
/** @ignore */
function writeStreamImpl(document, categories) {
  var endpoint = '/v1/documents';

  var sep = '?';

  var writeParams = addWriteParams(document, categories);
  if (writeParams.length > 0) {
    endpoint += writeParams;
    sep = '&';
  }

  var multipartBoundary = mlrest.multipartBoundary;

  var connectionParams = this.client.connectionParams;
  var requestOptions = mlutil.copyProperties(connectionParams);
  requestOptions.method = 'POST';
  requestOptions.headers = {
      'Content-Type': 'multipart/mixed; boundary='+multipartBoundary,
      'Accept': 'application/json'
  };
  requestOptions.path = mlutil.databaseParam(connectionParams, endpoint, sep);

  // TODO: treat as chunked single document if no properties
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

/** @ignore */
function singleWriteOutputTransform(headers, data) {
  var operation = this;

  var uri = operation.uri;

  if (valcheck.isNullOrUndefined(uri)) {
    var location = headers.location;
    if (!valcheck.isNullOrUndefined(location)) {
      var startsWith = '/v1/documents?uri=';
      if (location.length > startsWith.length &&
          location.substr(0, startsWith.length) === startsWith) {
        uri = location.substr(startsWith.length);
      }
    }
  }

  if (operation.contentOnly === true) {
    return [uri];
  }

  var document = {uri: uri};

  var categories = operation.categories;
  if (valcheck.isNullOrUndefined(categories)) {
    document.categories = categories;
  }

  var contentType = valcheck.isNullOrUndefined(data) ? null : data['mime-type'];
  if (valcheck.isNullOrUndefined(contentType)) {
    document.contentType = contentType;
  }

  var wrapper = {documents: [document]};

  var systemTime = headers.systemTime;
  if (!valcheck.isNullOrUndefined(systemTime)) {
    wrapper.systemTime = systemTime;
  }
  
  return wrapper;
}
/** @ignore */
function writeListOutputTransform(headers, data) {
  var operation = this;

  var systemTime = headers.systemTime;
  if (valcheck.isNullOrUndefined(systemTime)) {
    return data;
  }

  return {
    documents:  data.documents,
    systemTime: systemTime
  };
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

  var isSingleDoc = (documents.length === 1);

  var document      = isSingleDoc ? documents[0] : null;
  var hasDocument   = !valcheck.isNullOrUndefined(document);
  var hasContent    = hasDocument && !valcheck.isNullOrUndefined(document.content);

  var requestParams  =
    (params !== null) ? params   :
    (hasDocument)     ? document :
    null;

  var categories = valcheck.isNullOrUndefined(requestParams) ? null : requestParams.categories;
  if (valcheck.isString(categories)) {
    categories = [categories];
  }

  if (hasDocument) {
    if (hasContent && valcheck.isNullOrUndefined(document.properties)) {
      return writeContent.call(this, contentOnly, document, requestParams, categories, 'single');
    } else if (!hasContent && !valcheck.isNullOrUndefined(document.uri)) {
      return writeMetadata.call(this, document, categories);
    } 
  }

  return writeDocumentList.call(this, contentOnly, documents, requestParams, categories);
}
/** @ignore */
function writeMetadata(document, categories) {
  var uri = document.uri;

  var endpoint = '/v1/documents?uri='+encodeURIComponent(uri);

  if (!valcheck.isArray(categories)) {
    categories = [];
  }

  var hasCategories = (categories.length > 0);
  if (!hasCategories) {
    var categoryCheck = ['collections', 'permissions', 'quality', 'properties'];
    var category = null;
    var i = 0;
    for (i = 0; i < categoryCheck.length; i++) {
      category = categoryCheck[i];
      if (!valcheck.isNullOrUndefined(document[category])) {
        categories.push(category);
        if (!hasCategories) {
          hasCategories = true;
        }
      }
    }
  }

  if (hasCategories) {
    endpoint += '&category='+categories.join('&category=');
  }

  var txid = document.txid;
  if (!valcheck.isNullOrUndefined(txid)) {
    endpoint += '&txid='+txid;
  }

  var requestHeaders = {
      'Accept':       'application/json',
      'Content-Type': 'application/json'
  };

  var connectionParams   = this.client.connectionParams;
  var requestOptions     = mlutil.copyProperties(connectionParams);
  requestOptions.method  = 'PUT';
  requestOptions.headers = requestHeaders;
  requestOptions.path    = mlutil.databaseParam(connectionParams, endpoint, '&');

  var operation = mlrest.createOperation(
      'write single metadata', this.client, requestOptions, 'single', 'empty'
      );
  operation.uri = uri;
  if (hasCategories) {
    operation.categories = categories;
  }
  operation.requestBody     = JSON.stringify(collectMetadata(document));
  operation.outputTransform = singleWriteOutputTransform;

  return mlrest.startRequest(operation);
}
/** @ignore */
function writeContent(contentOnly, document, requestParams, categories, requestType) {
  var content    = document.content;
  var hasContent = !valcheck.isNullOrUndefined(content);

  var endpoint = '/v1/documents';

  var sep = '?';

  var writeParams = addWriteParams(requestParams, categories);
  if (writeParams.length > 0) {
    endpoint += writeParams;
    sep = '&';
  }

  var uri    = document.uri;
  var hasUri = !valcheck.isNullOrUndefined(uri);

  if (hasUri) {
    endpoint += sep+'uri='+encodeURIComponent(uri);
    if (sep === '?') { sep = '&'; }
  }

  var i = 0;

  var collections = document.collections;
  if (!valcheck.isNullOrUndefined(collections)) {
    if (valcheck.isArray(collections)) {
      for (i=0; i < collections.length; i++) {
        endpoint += sep+'collection='+encodeURIComponent(collections[i]);
        if (i === 0 && sep === '?') { sep = '&'; }
      }
    } else {
      endpoint += sep+'collection='+encodeURIComponent(collections);
      if (sep === '?') { sep = '&'; }
    }
  }

  var permissions = document.permissions;
  if (!valcheck.isNullOrUndefined(permissions)) {
    var permission   = null;
    var roleName     = null;
    var capabilities = null;
    var j = 0;
    if (valcheck.isArray(permissions)) {
      for (i=0; i < permissions.length; i++) {
        permission   = permissions[i];
        roleName     = permission['role-name'];
        capabilities = permission.capabilities;
        if (valcheck.isArray(capabilities)) {
          for (j=0; j < capabilities.length; j++) {
            endpoint += sep+'perm:'+roleName+'='+capabilities[j];
            if (i === 0 && j === 0 && sep === '?') { sep = '&'; }
          }
        } else {
          endpoint += sep+'perm:'+roleName+'='+capabilities;
          if (i === 0 && sep === '?') { sep = '&'; }
        }
      }
    } else {
      roleName     = permissions['role-name'];
      capabilities = permissions.capabilities;
      if (valcheck.isArray(capabilities)) {
        for (j=0; j < capabilities.length; j++) {
          endpoint += sep+'perm:'+roleName+'='+capabilities[j];
          if (j === 0 && sep === '?') { sep = '&'; }
        }
      } else {
        endpoint += sep+'perm:'+roleName+'='+capabilities;
        if (sep === '?') { sep = '&'; }
      }
    }
  }

  var quality = document.quality;
  if (!valcheck.isNullOrUndefined(quality)) {
    endpoint += sep+'quality='+quality;
    if (sep === '?') { sep = '&'; }
  }

  var requestHeaders = {
    'Accept': 'application/json'
  };

  var writeConfig = addWriteConfig(document, hasUri, content, requestHeaders, sep);
  if (writeConfig.length > 0) {
    endpoint += writeConfig;
    if (sep === '?') { sep = '&'; }
  }

  var connectionParams   = this.client.connectionParams;
  var requestOptions     = mlutil.copyProperties(connectionParams);
  requestOptions.method  = hasUri ? 'PUT' : 'POST';
  requestOptions.headers = requestHeaders;
  requestOptions.path    = mlutil.databaseParam(connectionParams, endpoint, sep);

  var operation = mlrest.createOperation(
      'write single document', this.client, requestOptions, requestType, 'empty'
      );
  if (hasUri) {
    operation.uri = uri;
  }
  if (valcheck.isArray(categories) && categories.length > 0) {
    operation.categories = categories;
  }
  if (hasContent) {
    operation.requestBody = mlrest.marshal(content);
  }
  operation.outputTransform = singleWriteOutputTransform;
  operation.contentOnly     = (contentOnly === true);

  return mlrest.startRequest(operation);
}
/** @ignore */
function writeDocumentList(contentOnly, documents, requestParams, categories) {
  var requestPartList = [];
  for (var i=0; i < documents.length; i++) {
    addDocumentParts(requestPartList, documents[i], false);
  }

  var endpoint = '/v1/documents';

  var writeParams = addWriteParams(requestParams, categories);
  var sep = '?';
  if (writeParams.length > 0) {
    endpoint += writeParams;
    sep = '&';
  }

  var multipartBoundary = mlrest.multipartBoundary;

  var requestHeaders = {
      'Accept':       'application/json',
      'Content-Type': 'multipart/mixed; boundary='+multipartBoundary
  };

  var connectionParams   = this.client.connectionParams;
  var requestOptions     = mlutil.copyProperties(connectionParams);
  requestOptions.method  = 'POST';
  requestOptions.headers = requestHeaders;
  requestOptions.path    = mlutil.databaseParam(connectionParams, endpoint, sep);

  var operation = mlrest.createOperation(
      'write document list', this.client, requestOptions, 'multipart', 'single'
      );
  operation.uris = getDocumentUris(documents);
  if (valcheck.isArray(categories) && categories.length > 0) {
    operation.categories = categories;
  }
  operation.multipartBoundary = multipartBoundary;
  operation.requestPartList   = requestPartList;
  operation.errorTransform    = uriListErrorTransform;
  if (contentOnly === true) {
    operation.subdata = ['documents', 'uri'];
  } else if (!valcheck.isNullOrUndefined(requestParams) &&
      !valcheck.isNullOrUndefined(requestParams.temporalCollection)) {
    operation.outputTransform = writeListOutputTransform;
  }

  return mlrest.startRequest(operation);
}
/** @ignore */
function addWriteParams(requestParams, categories) {
  var writeParams = '';

  var sep = '?';
  if (!valcheck.isNullOrUndefined(requestParams)) {
    if (valcheck.isArray(categories) && categories.length > 0) {
      writeParams += sep+'category='+categories.join('&category=');
      if (sep !== '&') { sep = '&'; }
    }
    var txid = requestParams.txid;
    if (!valcheck.isNullOrUndefined(txid)) {
      writeParams += sep+'txid='+txid;
      if (sep !== '&') { sep = '&'; }
    }
    var transform = mlutil.endpointTransform(requestParams.transform);
    if (!valcheck.isNullOrUndefined(transform)) {
      writeParams += sep+transform;
      if (sep !== '&') { sep = '&'; }
    }
    var forestName = requestParams.forestName;
    if (!valcheck.isNullOrUndefined(forestName)) {
      writeParams += sep+'forest-name='+encodeURIComponent(forestName);
      if (sep !== '&') { sep = '&'; }
    }
    var temporalCollection = requestParams.temporalCollection;
    if (!valcheck.isNullOrUndefined(temporalCollection)) {
      writeParams += sep+'temporal-collection='+encodeURIComponent(temporalCollection);
      if (sep !== '&') { sep = '&'; }
      var systemTime = requestParams.systemTime;
      if (valcheck.isString(systemTime)) {
        writeParams += '&system-time='+encodeURIComponent(systemTime);
      } else if (valcheck.isDate(systemTime)) {
        writeParams += '&system-time='+encodeURIComponent(systemTime.toISOString());
      }
    }
  }

  return writeParams;
}
/** @ignore */
function addWriteConfig(document, hasUri, content, headers, sep) {
  var writeConfig = '';

  var isBody = (sep !== '; ');

  if (!hasUri) {
    var extension = document.extension;
    if (!valcheck.isNullOrUndefined(extension)) {
      writeConfig += sep+'extension='+extension;
      if (isBody && sep === '?') { sep = '&'; }
      var directory = document.directory;
      if (!valcheck.isNullOrUndefined(directory)) {
        writeConfig += sep+'directory='+
            (isBody ? encodeURIComponent(directory) : directory);
      }
    }
  }

  var versionId = document.versionId;
  if (!valcheck.isNullOrUndefined(versionId)) {
    if (isBody) {
      headers['If-Match'] = versionId;
    } else {
      writeConfig += sep+'versionId='+versionId;
    }
  }

  var contentType    = document.contentType;
  var hasContentType = !valcheck.isNullOrUndefined(contentType);
  var format         = document.format;
  var hasFormat      = !valcheck.isNullOrUndefined(format);

  if (hasContentType) {
    if (!hasFormat) {
      if (/^(application|text)\/([^+]+\+)?json$/.test(contentType)) {
        format    = 'json';
        hasFormat = true;
      } else if (/^(application|text)\/([^+]+\+)?xml$/.test(contentType)) {
        format    = 'xml';
        hasFormat = true;
      } else if (/^(text)\//.test(contentType)) {
        format    = 'text';
        hasFormat = true;
      }
    }
  } else if (!hasFormat && (
      valcheck.isArray(content) ||
      (valcheck.isObject(content) &&
        !valcheck.isString(content) &&
        !valcheck.isBuffer(content) &&
        !valcheck.isFunction(content)))) {
    contentType    = 'application/json';
    hasContentType = true;
    format         = 'json';
    hasFormat      = true;
  }

  if (hasFormat) {
    var lang = null;
    switch(format) {
    case 'binary':
      var extract = document.extract;
      if (!valcheck.isNullOrUndefined(extract)) {
        if (extract === 'document' || extract === 'properties') {
          writeConfig += sep+'extract='+extract;
          if (isBody && sep === '?') { sep = '&'; }
        } else {
          throw new Error('extract must be "document" or "properties": '+extract.toString());
        }
      }
      break;
    case 'json':
      if (!hasContentType) {
        contentType = 'application/json';
      }
      break;
    case 'text':
      if (!hasContentType) {
        contentType = 'text/plain';
      }
      break;
    case 'xml':
      lang = document.lang;
      if (valcheck.isString(lang)) {
        writeConfig += sep+'lang='+lang;
        if (isBody && sep === '?') { sep = '&'; }
      }
      var repair = document.repair;
      if (!valcheck.isNullOrUndefined(repair)) {
        if (repair === 'full' || repair === 'none') {
          writeConfig += sep+'repair='+repair;
          if (isBody && sep === '?') { sep = '&'; }
        } else {
          throw new Error('repair must be "full" or "none": '+repair.toString());
        }
      }
      if (!hasContentType) {
        contentType = 'application/xml';
      }
      break;
    }
  }

  if (hasContentType) {
    headers['Content-Type'] = contentType;
  }

  return writeConfig;
}
/** @ignore */
function addDocumentParts(partList, document, isContentOptional) {
  var uri    = document.uri;
  var hasUri = !valcheck.isNullOrUndefined(uri);
  
  var disposition = hasUri ? 'attachment; filename="'+uri+'"' : 'inline';

  var metadata = collectMetadata(document);
  if (!valcheck.isNullOrUndefined(metadata)) {
    partList.push({
      headers:{
      'Content-Type'       : 'application/json',
      'Content-Disposition': disposition+'; category=metadata'
      },
      content: JSON.stringify(metadata)
    });
  }

  var content    = document.content;
  var hasContent = !valcheck.isNullOrUndefined(content);
  if (hasContent || isContentOptional) {
    var headers = {};
    var part    = {headers: headers};

    var writeConfig = addWriteConfig(document, hasUri, content, headers, '; ');
    if (writeConfig.length > 0) {
      disposition += writeConfig;
    }

    headers['Content-Disposition'] = disposition+'; category=content';

    if (hasContent) {
      part.content = mlrest.marshal(content);
    }

    partList.push(part);
  }
}

/** @ignore */
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

/** @ignore */
function removeOutputTransform(headers, data) {
  var operation = this;

  if (operation.contentOnly === true) {
    return operation.uri;
  }

  var wrapper = {
    uri:     operation.uri,
    removed: true
  };

  var systemTime = headers.systemTime;
  if (!valcheck.isNullOrUndefined(systemTime)) {
    wrapper.systemTime = systemTime;
  }
  
  return wrapper;
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

/** @ignore */
function listOutputTransform(headers, data) {
  return [data];
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
  var wrapper = makeSearchBody(builtQuery);

  var categories  = wrapper.categories;
  var optionsName = wrapper.optionsName;
  var pageStart   = wrapper.pageStart;
  var pageLength  = wrapper.pageLength;
  var txid        = wrapper.txid;
  var transform   = wrapper.transform;
  var view        = wrapper.view;
  var searchBody  = wrapper.searchBody;

  var returnDocuments = (pageLength !== 0);

  var endpoint =  null;
  if (valcheck.isUndefined(builtQuery.queryFormat)) {
    endpoint = '/v1/search?format=json';
  } else if (builtQuery.queryType === 'qbe') {
    endpoint = '/v1/qbe?format='+builtQuery.queryFormat;
  } else {
    endpoint = '/v1/search?format='+builtQuery.queryFormat;
  }

  if (!valcheck.isNullOrUndefined(categories)) {
    if (categories === 'none' ||
        (valcheck.isArray(categories) && categories.length === 1 && categories[0] === 'none')
        ) {
      returnDocuments = false;
    } else {
      endpoint += '&category=' + (
        valcheck.isString(categories) ?
        categories :
        categories.join('&category=')
        );
    }
  }
  if (!valcheck.isNullOrUndefined(optionsName)) {
    endpoint += '&options='+optionsName;
  }
  if (!valcheck.isNullOrUndefined(pageStart)) {
    endpoint += '&start='+pageStart;
  }
  if (!valcheck.isNullOrUndefined(pageLength)) {
    endpoint += '&pageLength='+pageLength;
  }
  if (!valcheck.isNullOrUndefined(txid)) {
    endpoint += '&txid='+txid;
  }
  if (!valcheck.isNullOrUndefined(transform)) {
    endpoint += '&'+mlutil.endpointTransform(transform);
  }
  if (!valcheck.isNullOrUndefined(view)) {
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
      'Accept': (returnDocuments ?
          'multipart/mixed; boundary='+mlrest.multipartBoundary :
          'application/json')
  };
  requestOptions.path = mlutil.databaseParam(connectionParams, endpoint, '&');

  var operation = mlrest.createOperation(
      'query documents', this.client, requestOptions, 'single',
      (returnDocuments ? 'multipart' : 'single')
      );
  operation.validStatusCodes = [200, 204, 404];
  operation.inlineAsDocument = false;
  operation.requestBody      = searchBody;
  if (contentOnly === true) {
    operation.subdata = ['content'];
  }
  if (!returnDocuments) {
    operation.outputTransform = listOutputTransform;
  }

  return mlrest.startRequest(operation);
}
function makeSearchBody(builtQuery) {
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
        builtQuery.categories : ['content'];
  } else {
    var search = {};
    searchBody.search = search;

    var searchOptions = search.options;
    if (valcheck.isNullOrUndefined(searchOptions)) {
      searchOptions = {};
      search.options = searchOptions;
    }

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
        searchOptions['fragment-scope'] = fragmentScope;
      }
    }

    var calculateClause = builtQuery.calculateClause;
    if (!valcheck.isNullOrUndefined(calculateClause)) {
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
              // replace if undefined, null, string, number, or boolean
              if (valcheck.isPrimitive(searchChild)) {
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
      if (!valcheck.isNullOrUndefined(transformResults)) {
        searchOptions['transform-results'] = transformResults;
        searchOptions['return-results']    = true;
        view = 'results';
      }

      var extractResults = sliceClause['extract-document-data'];
      if (!valcheck.isNullOrUndefined(extractResults)) {
        searchOptions['extract-document-data'] = extractResults;
      }

      transform = sliceClause['document-transform'];
    }

    categories = (pageLength > 0) ? ['content'] : null;

    var withOptionsClause = builtQuery.withOptionsClause;
    if (!valcheck.isNullOrUndefined(withOptionsClause)) {
      // TODO: share with queryBuilder.js
      var optionKeyMapping = {
          search:'search-option',     weight:'quality-weight',
          forestNames:'forest-names', similarDocs:'return-similar',
          metrics:'return-metrics',   queryPlan:'return-plan',
          debug:'debug',              concurrencyLevel:'concurrency-level',
          categories:true,            txid:true
        };
      var optionKeyInResponse = {
          similarDocs:true, metrics:true,
          queryPlan:true,   debug:true
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
              if (view === null && optionKeyInResponse[key] === true) {
                view = 'results';
              }
              searchOptions[mapping] = value;
            }
          }
        }
      }
    }

    var searchFlags = searchOptions['search-option'];
    if (valcheck.isNullOrUndefined(searchFlags)) {
      searchOptions['search-option'] = ['unfiltered'];
    } else if (searchFlags.indexOf('filtered') === -1 && searchFlags.indexOf('unfiltered') === -1) {
      searchFlags.push('unfiltered');
    }
  }

  return {
    categories  : categories,
    optionsName : optionsName,
    pageStart   : pageStart,
    pageLength  : pageLength,
    txid        : txid,
    transform   : transform,
    view        : view,
    searchBody  : searchBody
  };
}
function makeParsedQuery(searchBody, parsedQuery) {
  var search   = searchBody.search;
  search.qtext = parsedQuery.qtext;

  var constraintBindings = parsedQuery.constraint;
  var hasConstraints     = !valcheck.isNullOrUndefined(constraintBindings);
  var termBinding        = parsedQuery.term;
  var hasTerm            = !valcheck.isNullOrUndefined(termBinding);
  if (hasConstraints || hasTerm) {
    var searchOptions = search.options;
    if (valcheck.isNullOrUndefined(searchOptions)) {
      searchOptions = {};
      search.options = searchOptions;
    }

    if (hasConstraints) {
      searchOptions.constraint = constraintBindings;
    }
    if (hasTerm) {
      searchOptions.term = termBinding;
    }
  }
}

function notNameFilter(key) {
  switch(key) {
  case 'name': return false;
  default:     return true;
  }
}

/** @ignore */
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
    documentOperations = documentOperations.filter(function patchOperationsFilter(operation){
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
 * For a partial textual value intended for a string search, looks up completions
 * that match documents in the database. The textual value may be prefixed
 * with the constraint name for a string search binding or facet. The textual value
 * may also be an unqualified word or phrase for the default binding.
 * You may pass a configuration object with the following named parameters or,
 * as a shortcut, the partial textual search, the query, and optionally bindings.
 * @method documents#suggest
 * @param {string} partial - the partial search string to complete
 * @param {object} query - a query built by a {@link queryBuilder} or
 * a {@link documents.CombinedQueryDefinition} that defines bindings in
 * the where and calculate clause and that qualifies the documents supplying
 * the completions for the partial search string
 * @param {queryBuilder.SuggestBindings} [bindings] - bindings
 * returned by the {@link queryBuilder#suggestBindings} function that
 * override the query bindings to retrieve completions from a different index
 * @param {number} [limit] - the number of completions to return
 * @returns {ResultProvider} an object whose result() function takes
 * a success callback that receives an array with the candidate completion
 * strings.
 */
function suggestDocuments() {
  var argLen = arguments.length;
  if (argLen < 1) {
    throw new Error('no partial query text or query with bindings');
  }

  var params   = null;
  var partial  = null;
  var query    = null;
  var bindings = null;
  var limit    = null;
  switch (argLen) {
  case 1:
    params   = arguments[0];
    partial  = params.partial;
    query    = params.query;
    bindings = params.bindings;
    limit    = params.limit;
    break;
  case 2:
    partial = arguments[0];
    query   = arguments[1];
    break;
  default:
    partial  = arguments[0];
    query    = arguments[1];
    bindings = arguments[2];
    break;
  }

  if (valcheck.isNullOrUndefined(partial)) {
    throw new Error('no partial query text for document suggestion');
  }
  if (valcheck.isNullOrUndefined(query)) {
    throw new Error('no query with bindings for document suggestion');
  }

  var searchBody = makeSearchBody(query).searchBody;
  var search = searchBody.search;
  if (valcheck.isNullOrUndefined(search)) {
    throw new Error('cannot get  document suggestions for empty search');
  }
  if (!valcheck.isNullOrUndefined(search.$query)) {
    throw new Error('cannot get  document suggestions for Query By Example (QBE)');
  }

  var searchOptions = search.options;
  if (valcheck.isNullOrUndefined(searchOptions)) {
    searchOptions = {};
    search.options = searchOptions;
  }
  var searchConstraints = searchOptions.constraint;

  var hasBindings = !valcheck.isNullOrUndefined(bindings);

  var suggestConstraints = hasBindings ? bindings.constraint : null;
  var sources = copyConstraints(suggestConstraints, searchConstraints);
  if (sources.length > 0) {
    searchOptions['suggestion-source'] = sources;
  }

  var term = hasBindings ? bindings.term : null;
  if (valcheck.isNullOrUndefined(term)) {
    term = searchOptions.term;
  }

  var termDefault = null;
  if (!valcheck.isNullOrUndefined(term)) {
    termDefault = term['default'];
    if (!valcheck.isNullOrUndefined(termDefault)) {
      searchOptions['default-suggestion-source'] = termDefault;
    }
  }

  var endpoint = '/v1/suggest?partial-q='+encodeURIComponent(partial);
  if (!valcheck.isNullOrUndefined(limit)) {
    endpoint += '&limit=' + limit;
  }
  
  var connectionParams = this.client.connectionParams;
  var requestOptions = mlutil.copyProperties(connectionParams);
  requestOptions.method = 'POST';
  requestOptions.headers = {
      'Content-Type': 'application/json',
      'Accept':       'application/json',
  };
  requestOptions.path = mlutil.databaseParam(connectionParams, endpoint, '&');

  var operation = mlrest.createOperation(
      'search suggest', this.client, requestOptions, 'single', 'single'
      );
  operation.input       = partial;
  operation.requestBody = searchBody;
  operation.subdata     = ['suggestions'];

  return mlrest.startRequest(operation);
}

/** @ignore */
function copyConstraints(suggestConstraints, searchConstraints) {
  var destination = [];

  var bindLen = valcheck.isArray(suggestConstraints) ? suggestConstraints.length : 0;

  var constraint = null;

  var i    = 0;
  var copy = null;
  var keys = null;
  var key  = null;
  var j    = 0;

  var overrides = null;
  if (bindLen > 0) {
    overrides = {};
    for (i=0; i < bindLen; i++) {
      constraint = suggestConstraints[i];
      overrides[constraint.name] = true;

      copy = {};

      keys = Object.keys(constraint);
      for (j=0; j < keys.length; j++) {
        key = keys[j];
        if (key === 'name') {
          copy.ref = constraint.name;
        } else {
          copy[key] = constraint[key];
        }
      }

      destination.push(copy);
    }

    copy = null;
  }

  var isCopyKey = null;
  if (valcheck.isArray(searchConstraints)) {
    isCopyKey = {
      collection:               true,
      'geo-attr-pair':          true,
      'geo-elem':               true,
      'geo-elem-pair':          true,
      'geo-json-property-pair': true,
      'geo-path':               true,
      range:                    true,
      value:                    true,
      word:                     true,
      'word-lexicon':           true
    };
    for (i=0; i < searchConstraints.length; i++) {
      constraint = searchConstraints[i];
      if (overrides !== null && overrides[constraint.name] === true) {
        continue;
      }

      keys = Object.keys(constraint);
      for (j=0; j < keys.length; j++) {
        key = keys[j];
        if (isCopyKey[key] === true) {
          if (valcheck.isNull(copy)) {
            copy = {};
          }
          copy[key] = constraint[key];
        } else if (key === 'name') {
          if (valcheck.isNull(copy)) {
            copy = {};
          }
          copy.ref = constraint.name;
        }
      }

      if (!valcheck.isNull(copy)) {
        destination.push(copy);
        copy = null;
      }
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
