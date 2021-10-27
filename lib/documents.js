/*
 * Copyright (c) 2020 MarkLogic Corporation
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

var requester  = require('./requester.js');
var mlutil     = require('./mlutil.js');
var Operation  = require('./operation.js');
var qb         = require('./query-builder.js').lib;
var pathModule = require('path');
var fs         = require('fs');
const stream = require('stream');

/** @ignore */
function addDocumentUri(documents, document) {
  if (document != null) {
    var uri = document.uri;
    if ((typeof uri === 'string' || uri instanceof String) && uri.length > 0) {
      documents.push(uri);
    }
  }
  return documents;
}
/** @ignore */
function getDocumentUris(documents) {
  if (!Array.isArray(documents) || documents.length === 0) {
    return [];
  }
  return documents.reduce(addDocumentUri, []);
}

/** @ignore */
function compareDocuments(firstDoc, secondDoc) {
  const hasFirstDoc  = (firstDoc  !== null);
  const hasSecondDoc = (secondDoc !== null);
  if (!hasFirstDoc && !hasSecondDoc) return  0;
  if (!hasFirstDoc && hasSecondDoc)  return -1;
  if (hasFirstDoc  && !hasSecondDoc) return  1;
  const firstUri  = firstDoc.uri;
  const secondUri = secondDoc.uri;
  const hasFirstUri  = ((typeof firstUri  === 'string' || firstUri  instanceof String) && firstUri.length  > 0);
  const hasSecondUri = ((typeof secondUri === 'string' || secondUri instanceof String) && secondUri.length > 0);
  if (!hasFirstUri && !hasSecondUri) return  0;
  if (!hasFirstUri && hasSecondUri)  return -1;
  if (hasFirstUri  && !hasSecondUri) return  1;
  if (firstUri < secondUri) return -1;
  if (firstUri > secondUri) return  1;
  return 0;
}

/** @ignore */
function uriErrorTransform(message) {
  /*jshint validthis:true */
  var operation = this;

  var uri = operation.uri;
  return (uri == null) ? message :
    (message+' (on '+uri+')');
}
/** @ignore */
function uriListErrorTransform(message) {
  /*jshint validthis:true */
  var operation = this;

  var uris = operation.uris;
  return ((!Array.isArray(uris)) || uris.length === 0) ?
    message : (message+' (on '+uris.join(', ')+')');
}

/** @ignore */
function Documents(client) {
  if (!(this instanceof Documents)) {
    return new Documents(client);
  }
  this.client = client;
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
function probeOutputTransform(/*headers, data*/) {
  /*jshint validthis:true */
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

function protectOutputTransform(/*headers, data*/) {
  /*jshint validthis:true */
  var operation = this;

  var output = {
    uri:                operation.uri,
    temporalCollection: operation.temporalCollection,
    level:              operation.level
  };

  return output;
}

function wipeOutputTransform(/*headers, data*/) {
  /*jshint validthis:true */
  var operation = this;

  var output = {
    uri:                operation.uri,
    temporalCollection: operation.temporalCollection,
    wiped:              true
  };

  return output;
}

function advanceLsqtOutputTransform(headers) {
  /*jshint validthis:true */

  var output = {
    lsqt: headers.lsqt
  };

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
 * @since 1.0
 * @function
 * @param {function}  [success] - a callback invoked when the request succeeds
 * @param {function}  [failure] - a callback invoked when the request fails
 * @returns {object} a Promises object
 */
/**
 * Returns a ReadableStream object in object mode for receiving results as
 * complete objects.
 * @name ResultProvider#stream
 * @since 1.0
 * @function
 * @returns {object} a {@link http://nodejs.org/api/stream.html#stream_class_stream_readable|ReadableStream}
 * object
 */

/**
 * Provides a description of a document to write to the server, after reading
 * from the server, or for another document operation.  The descriptor may have
 * more or fewer properties depending on the operation.
 * @typedef {object} documents.DocumentDescriptor
 * @since 1.0
 * @property {string} uri - the identifier for the document in the database
 * @property {object|string|Buffer|ReadableStream} [content] - the content
 * of the document; when writing a ReadableStream for the content, first pause
 * the stream
 * @property {string[]} [collections] - the collections to which the document belongs
 * @property {object[]} [permissions] - the permissions controlling which users can read or
 * write the document
 * @property {object[]} [properties] - additional properties of the document
 * @property {number} [quality] - a weight to increase or decrease the rank of the document
 * @property {object[]} [metadataValues] - the metadata values of the document
 * @property {number} [versionId] - an identifier for the currently stored version of the
 * document
 * @property {string} [temporalDocument] - the collection URI for a temporal document;
 * use only when writing a document to a temporal collection
 */

/**
 * Categories of information to read or write for documents.
 * The possible values of the enumeration are
 * content|collections|metadataValues|permissions|properties|quality|metadata|none where
 * metadata is an alias for all of the categories other than content.
 * @typedef {enum} documents.categories
 * @since 1.0
 */

/**
 * A success callback for {@link ResultProvider} that receives the result from
 * the {@link documents#probe}.
 * @callback documents#probeResult
 * @since 1.0
 * @param {documents.DocumentDescriptor} document - a sparse document descriptor with an exists
 * property that identifies whether the document exists
 */
/**
 * Probes whether a document exists; takes a configuration
 * object with the following named parameters or, as a shortcut,
 * a uri string.
 * @method documents#probe
 * @since 1.0
 * @param {string}  uri - the uri for the database document
 * @param {string|transactions.Transaction}  [txid] - a string
 * transaction id or Transaction object identifying an open
 * multi-statement transaction
 * @returns {ResultProvider} an object whose result() function takes
 * a {@link documents#probeResult} success callback.
 */
Documents.prototype.probe = function probeDocument() {
  return probeDocumentsImpl.call(this, false, mlutil.asArray.apply(null, arguments));
};
function probeDocumentsImpl(contentOnly, args) {
  /*jshint validthis:true */
  if (args.length !== 1 && args.length !== 2) {
    throw new Error('must supply uri for document check()');
  }

  var params = (args.length === 1 && typeof args[0] !== 'string' && !(args[0] instanceof String)) ? args[0] : null;

  var uri = null;
  var txid = null;
  var path = '/v1/documents?format=json';
  // params as list
  if (params === null) {
    uri = args[0];
    path += '&uri='+encodeURIComponent(uri);
    txid = mlutil.convertTransaction(args[1]);
    if (txid != null) {
      path += '&txid='+mlutil.getTxidParam(txid);
    }
  }
  // params as object
  else {
    uri = params.uri;
    if (uri == null) {
      throw new Error('must specify the uri parameter for the document to check');
    }
    path += '&uri='+encodeURIComponent(uri);
    txid = mlutil.convertTransaction(params.txid);
    if (txid != null) {
      path += '&txid='+mlutil.getTxidParam(txid);
    }
  }

  var connectionParams = this.client.getConnectionParams();
  var requestOptions = mlutil.copyProperties(connectionParams);
  requestOptions.method = 'HEAD';
  requestOptions.path = mlutil.databaseParam(connectionParams, path, '&');
  mlutil.addTxidHeaders(requestOptions, txid);

  var operation = new Operation(
      'probe document', this.client, requestOptions, 'empty', 'empty'
      );
  operation.uri              = uri;
  operation.validStatusCodes = [200, 404];
  operation.outputTransform  = probeOutputTransform;
  operation.errorTransform   = uriErrorTransform;
  operation.contentOnly      = (contentOnly === true);

  return requester.startRequest(operation);
}

/**
 * A success callback for {@link ResultProvider} that receives the result from
 * the {@link documents#protect}.
 * @callback documents#protectResult
 * @since 2.0.1
 * @param {documents.DocumentDescriptor} document - a sparse document descriptor
 * for the protected document
 */
/**
 * Protects a temporal document from temporal operations for a
 * period of time.
 * @method documents#protect
 * @since 2.0.1
 * @param {string} uri - the uri for the temporal document to protect
 * @param {string} temporalCollection - the temporal collection for the document
 * @param {string} [duration] - a protection duration; either a duration or an
 * expire time must be provided
 * @param {string} [expireTime] - an expiration time; either an expiration time
 * or a duration must be provided
 * @param {string} [level] - a protection level of 'noWipe'|'noDelete'|'noUpdate'
 * (default is 'noDelete')
 * @param {string} [archivePath] - an archive path
 * @returns {ResultProvider} an object whose result() function takes
 * a {@link documents#protectResult} success callback.
 */
Documents.prototype.protect = function protectDocument() {
  /*jshint validthis:true */
  var args = mlutil.asArray.apply(null, arguments);
  var argLen = args.length;

  var uri           = null;
  var tempColl      = null;
  var duration      = null;
  var expireTime    = null;
  var level         = 'noDelete';
  var archivePath   = null;

  // Params as single object
  if (argLen === 1) {
    var obj = args[0];
    if (obj.uri === void 0) {
      throw new Error('must specify uri');
    } else {
      uri = obj.uri;
    }
    if (obj.temporalCollection === void 0) {
      throw new Error('must specify temporalCollection');
    } else {
      tempColl = obj.temporalCollection;
    }
    if (obj.expireTime !== void 0) {
      expireTime = obj.expireTime;
    } else if (obj.duration !== void 0) {
      duration = obj.duration;
    } else {
      throw new Error('must specify duration or expireTime');
    }
    if (obj.level !== void 0) {
      level = obj.level;
    }
    if (obj.archivePath !== void 0) {
      archivePath = obj.archivePath;
    }
  }
  // Multiple params
  else {
    if (argLen < 3) {
      throw new Error('must specify uri, temporalCollection, and duration or expireTime');
    }
    uri = args[0];
    tempColl = args[1];
    // see: https://www.w3.org/TR/xmlschema-2/#duration
    if (args[2].charAt(0) === 'P' || args[2].substring(0, 2) === '-P') {
      duration = args[2];
    } else {
      expireTime = args[2];
    }
    var levels = ['noWipe', 'noDelete', 'noUpdate'];
    if (levels.indexOf(args[3]) !== -1) {
      level = args[3];
    } else {
      archivePath = args[3] || null;
    }
    if (args[4] && archivePath === null) {
      archivePath = args[4];
    }
  }

  if (archivePath !== null) {
    try {
      fs.accessSync(pathModule.dirname(archivePath));
    } catch (e) {
      throw new Error('archive directory does not exist: ' + archivePath);
    }
  }

  var path = '/v1/documents/protection?uri=' + encodeURIComponent(uri);
  path += '&temporal-collection=' + encodeURIComponent(tempColl);
  if (duration !== null) {
    path += '&duration=' + encodeURIComponent(duration);
  } else {
    path += '&expireTime=' + encodeURIComponent(expireTime);
  }
  path += '&level=' + encodeURIComponent(level);
  if (archivePath !== null) {
    path += '&archivePath=' + encodeURIComponent(archivePath);
  }

  var connectionParams = this.client.getConnectionParams();
  var requestOptions = mlutil.copyProperties(connectionParams);
  requestOptions.method = 'POST';
  requestOptions.path = mlutil.databaseParam(connectionParams, path, '&');

  var operation = new Operation(
      'protect document', this.client, requestOptions, 'empty', 'empty'
      );
  operation.uri                = uri;
  operation.temporalCollection = tempColl;
  operation.level              = level;
  operation.validStatusCodes   = [204];
  operation.outputTransform    = protectOutputTransform;
  operation.errorTransform     = uriErrorTransform;

  return requester.startRequest(operation);
};

/**
 * A success callback for {@link ResultProvider} that receives the result from
 * the {@link documents#wipe}.
 * @callback documents#wipeResult
 * @since 2.0.1
 * @param {documents.DocumentDescriptor} document - a sparse document descriptor
 * for the wipe command
 */
/**
 * Deletes all versions of a temporal document.
 * @method documents#wipe
 * @since 2.0.1
 * @param {string} uri - the uri for the temporal document to wipe
 * @param {string} temporalCollection - the name of the temporal collection
 * @returns {ResultProvider} an object whose result() function takes
 * a {@link documents#wipeResult} success callback.
 */
Documents.prototype.wipe = function wipeDocument() {
  /*jshint validthis:true */
  var args = mlutil.asArray.apply(null, arguments);
  var argLen = args.length;

  var uri           = null;
  var tempColl      = null;

  // Params as single object
  if (argLen === 1) {
    var obj = args[0];
    if (obj.uri === void 0) {
      throw new Error('must specify uri');
    } else {
      uri = obj.uri;
    }
    if (obj.temporalCollection === void 0) {
      throw new Error('must specify temporalCollection');
    } else {
      tempColl = obj.temporalCollection;
    }
  }
  // Multiple params
  else {
    if (argLen < 2) {
      throw new Error('must specify uri and temporalCollection');
    }
    uri = args[0];
    tempColl = args[1];
  }

  var path = '/v1/documents?uri=' + encodeURIComponent(uri);
  path += '&temporal-collection=' + encodeURIComponent(tempColl);
  path += '&result=wiped';

  var connectionParams = this.client.getConnectionParams();
  var requestOptions = mlutil.copyProperties(connectionParams);
  requestOptions.method = 'DELETE';
  requestOptions.path = mlutil.databaseParam(connectionParams, path, '&');

  var operation = new Operation(
      'wipe document', this.client, requestOptions, 'empty', 'empty'
      );
  operation.uri                = uri;
  operation.temporalCollection = tempColl;
  operation.validStatusCodes   = [204];
  operation.outputTransform    = wipeOutputTransform;
  operation.errorTransform     = uriErrorTransform;

  return requester.startRequest(operation);
};

/**
 * Advances the LSQT (Last Stable Query Time) of a temporal collection.
 * @method documents#advanceLsqt
 * @since 2.1.1
 * @param {string} temporalCollection - The name of the temporal collection
 * for which to advance the LSQT.
 * @param {string} [lag] - The lag (in seconds (???)) to subtract from the
 * maximum system start time in the temporal collection to determine the LSQT.
 * @returns {ResultProvider} an object whose result() function takes
 * an object with the new LSQT as an 'lsqt' property.
 */
Documents.prototype.advanceLsqt = function temporalAdvanceLsqt() {
  /*jshint validthis:true */
  var args = mlutil.asArray.apply(null, arguments);

  var tempColl = null;
  var lag      = null;

  // Positional case
  if (typeof args[0] === 'string' || args[0] instanceof String) {
    tempColl = args[0];
    if (args[1] !== void 0) {
      if (typeof args[1] === 'number' || args[0] instanceof Number) {
        lag = args[1];
      } else {
        throw new Error('lag parameter takes a number in seconds');
      }
    }
  }
  // Object case
  else {
    var obj = args[0];
    if (obj.temporalCollection === void 0) {
      throw new Error('must specify temporalCollection');
    } else {
      tempColl = obj.temporalCollection;
    }
    if (obj.lag !== void 0) {
      if (typeof obj.lag === 'number' || obj.lag instanceof Number) {
        lag = obj.lag;
      } else {
        throw new Error('lag parameter takes a number in seconds');
      }
    }
  }

  var path = '/v1/temporal/collections/' + encodeURIComponent(tempColl);
  path += '?result=advance-lsqt';
  if (lag !== null) {
    path += '&lag=' + encodeURIComponent(lag);
  }

  var connectionParams = this.client.getConnectionParams();
  var requestOptions = mlutil.copyProperties(connectionParams);
  requestOptions.method = 'POST';
  requestOptions.path = mlutil.databaseParam(connectionParams, path, '&');

  var operation = new Operation(
      'advance LSQT', this.client, requestOptions, 'empty', 'empty'
      );
  // operation.temporalCollection = tempColl;
  operation.validStatusCodes   = [204];
  operation.outputTransform    = advanceLsqtOutputTransform;
  operation.errorTransform     = uriErrorTransform;

  return requester.startRequest(operation);
};

/** @ignore */
function readStatusValidator(statusCode) {
  return (statusCode < 400 || statusCode === 404) ?
      null : "response with invalid "+statusCode+" status";
}
/** @ignore */
function singleReadOutputTransform(headers, data) {
  /*jshint validthis:true */
  var operation = this;

  var hasData = (data != null);
  if (hasData &&
      (data.errorResponse != null) &&
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
  if (typeof format === 'string' || format instanceof String) {
    document.format = format;
    if (format !== 'json') {
      var contentLength = headers.contentLength;
      if (contentLength != null) {
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
    if (headerValue != null) {
      document[headerKey] = headerValue;
    }
  }

  return [document];
}

/**
 * A success callback for {@link ResultProvider} that receives the result from
 * the {@link documents#read}.
 * @callback documents#resultList
 * @since 1.0
 * @param {documents.DocumentDescriptor[]} documents - an array of
 * {@link documents.DocumentDescriptor} objects with the requested
 * metadata and/or content for the documents
 */
/**
 * Reads one or more documents; takes a configuration object with
 * the following named parameters or, as a shortcut, one or more
 * uri strings or an array of uri strings.
 * @method documents#read
 * @since 1.0
 * @param {string|string[]}  uris - the uri string or an array of uri strings
 * for the database documents
 * @param {documents.categories|documents.categories[]}  [categories] - the categories of information
 * to retrieve for the documents
 * @param {string|transactions.Transaction}  [txid] - a string
 * transaction id or Transaction object identifying an open
 * multi-statement transaction
 * @param {string|mixed[]}  [transform] - the name of a transform extension to apply to each document
 * or an array with the name of the transform extension and an object of parameter values; the
 * transform must have been installed using the {@link transforms#write} function.
 * @param {number[]}  [range] - the range of bytes to extract
 * from a binary document; the range is specified with a zero-based
 * start byte and the position after the end byte as in Array.slice()
 * @param {DatabaseClient.Timestamp}  [timestamp] - a Timestamp object for point-in-time
 * operations.
 * @returns {ResultProvider} an object whose result() function takes
 * a {@link documents#resultList} success callback.
 */
Documents.prototype.read = function readDocuments() {
  return readDocumentsImpl.call(this, false, mlutil.asArray.apply(null, arguments));
};
function readDocumentsImpl(contentOnly, args) {
  /*jshint validthis:true */
  if (args.length === 0) {
    throw new Error('must specify at least one document to read');
  }

  var uris = null;
  var categories = null;
  var txid = null;
  var transform = null;
  var contentType = null;
  var range = null;
  var timestamp = null;

  var arg = args[0];
  if (Array.isArray(arg)) {
    uris = arg;
  } else if (typeof arg === 'string' || arg instanceof String) {
    uris = args;
  } else {
    uris = arg.uris;
    if (uris == null) {
      throw new Error('must specify the uris parameters with at least one document to read');
    }
    if (!Array.isArray(uris)) {
      uris = [uris];
    }
    categories = arg.categories;
    txid = mlutil.convertTransaction(arg.txid);
    transform = arg.transform;
    contentType = arg.contentType;
    range = arg.range;
    timestamp = arg.timestamp;
  }

  if (categories == null) {
    categories = ['content'];
  } else if (typeof categories === 'string' || categories instanceof String) {
    categories = [categories];
  }

  if (categories != null) {
    var i = 0;
    for (i = 0; i < categories.length; i++) {
      categories[i] = categories[i] === 'metadataValues' ? 'metadata-values' : categories[i];
    }
  }

  var path = '/v1/documents?format=json&uri='+
    uris.map(encodeURIComponent).join('&uri=');
  path += '&category=' + categories.join('&category=');
  if (txid != null) {
    path += '&txid='+mlutil.getTxidParam(txid);
  }
  if (transform != null) {
    path += '&'+mlutil.endpointTransform(transform);
  }

  if (timestamp !== null && timestamp !== void 0) {
    if (timestamp.value !== null) {
      path += '&timestamp='+timestamp.value;
    }
  }

  var isSinglePayload = (
      uris.length === 1 && (
          (categories.length === 1 && categories[0] === 'content') ||
          categories.indexOf('content') === -1
      ));

  var connectionParams = this.client.getConnectionParams();
  var requestOptions = mlutil.copyProperties(connectionParams);
  requestOptions.method = 'GET';
  requestOptions.path = mlutil.databaseParam(connectionParams, path, '&');
  if (!isSinglePayload) {
    requestOptions.headers = {
        Accept: 'multipart/mixed; boundary='+mlutil.multipartBoundary
    };
  } else {
    var hasContentType = false;
    if (contentType != null) {
      if (typeof contentType === 'string' || contentType instanceof String) {
        hasContentType = true;
      } else {
        throw new Error('contentType is not string: '+contentType);
      }
    }

    if (range != null) {
      if (!Array.isArray(range)) {
        throw new Error('byte range parameter for reading binary document is not an array: '+range);
      }
      var bytes = null;
      switch (range.length) {
      case 0:
        throw new Error('no start length for byte range parameter for reading binary document');
      case 1:
        if (typeof range[0] !== 'number' && !(range[0] instanceof Number)) {
          throw new Error('start length for byte range parameter is not integer: '+range[0]);
        }
        bytes = 'bytes=' + range[0] + '-';
        break;
      case 2:
        if (typeof range[0] !== 'number' && !(range[0] instanceof Number)) {
          throw new Error('start length for byte range parameter is not integer: '+range[0]);
        }
        if (typeof range[1] !== 'number' && !(range[1] instanceof Number)) {
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
  mlutil.addTxidHeaders(requestOptions, txid);

  var operation = new Operation(
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
  operation.timestamp = (timestamp !== null) ? timestamp : null;

  return requester.startRequest(operation);
}

/**
 * Writes a large document (typically a binary) in incremental chunks with
 * a stream; takes a {@link documents.DocumentDescriptor} object with the
 * following properties (but not a content property).
 * @method documents#createWriteStream
 * @since 1.0
 * @param {string} uri - the identifier for the document to write to the database
 * @param {string[]} [collections] - the collections to which the document should belong
 * @param {object[]} [permissions] - the permissions controlling which users can read or
 * write the document
 * @param {object[]} [properties] - additional properties of the document
 * @param {number} [quality] - a weight to increase or decrease the rank of the document
 * @param {object[]} [metadataValues] - the metadata values of the document
 * @param {number} [versionId] - an identifier for the currently stored version of the
 * document (when enforcing optimistic locking)
 * @param {string|transactions.Transaction}  [txid] - a string
 * transaction id or Transaction object identifying an open
 * multi-statement transaction
 * @param {string|mixed[]}  [transform] - the name of a transform extension to apply to each document
 * or an array with the name of the transform extension and an object of parameter values; the
 * transform must have been installed using the {@link transforms#write} function.
 * @returns {WritableStream} a stream for writing the database document; the
 * stream object also has a result() function that takes
 * a {@link documents#writeResult} success callback.
 */
Documents.prototype.createWriteStream = function createWriteStream(document) {
  if ((document == null) ||
      (document.uri == null)) {
    throw new Error('must specify document for write stream');
  }
  if (document.content != null) {
    throw new Error('must write to stream to supply document content');
  }

  var categories = document.categories;
  var hasCategories = Array.isArray(categories) && categories.length > 0;
  if (!hasCategories && (typeof categories === 'string' || categories instanceof String)) {
    categories = [categories];
  }

  if (document.properties == null) {
    return writeContent.call(this, false, document, document, categories, 'chunked');
  }

  return writeStreamImpl.call(this, document, categories);
};
/** @ignore */
function writeStreamImpl(document, categories) {
  /*jshint validthis:true */
  var endpoint = '/v1/documents';

  var sep = '?';

  var txid = getTxid(document);

  var writeParams = addWriteParams(document, categories, txid);
  if (writeParams.length > 0) {
    endpoint += writeParams;
    sep = '&';
  }

  var multipartBoundary = mlutil.multipartBoundary;

  var connectionParams = this.client.getConnectionParams();
  var requestOptions = mlutil.copyProperties(connectionParams);
  requestOptions.method = 'POST';
  requestOptions.headers = {
      'Content-Type': 'multipart/mixed; boundary='+multipartBoundary,
      'Accept': 'application/json'
  };
  requestOptions.path = mlutil.databaseParam(connectionParams, endpoint, sep);
  mlutil.addTxidHeaders(requestOptions, txid);

  var operation = new Operation(
      'write document stream', this.client, requestOptions, 'chunkedMultipart', 'single'
      );
  operation.isReplayable = false;
  operation.uri = document.uri;

  // TODO: treat as chunked single document if no properties
  var requestPartList = [];
  addDocumentParts(operation, requestPartList, document, true);
  operation.requestDocument = requestPartList;

  operation.multipartBoundary = mlutil.multipartBoundary;
  operation.errorTransform    = uriErrorTransform;

  return requester.startRequest(operation);
}

/** @ignore */
function singleWriteOutputTransform(headers, data) {
  /*jshint validthis:true */
  var operation = this;

  var uri = operation.uri;

  if (uri == null) {
    var location = headers.location;
    if (location != null) {
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
  if (categories == null) {
    document.categories = categories;
  }

  var contentType = (data == null) ? null : data['mime-type'];
  if (contentType == null) {
    document.contentType = contentType;
  }

  var wrapper = {documents: [document]};

  var systemTime = headers.systemTime;
  if (systemTime != null) {
    wrapper.systemTime = systemTime;
  }

  return wrapper;
}
/** @ignore */
function writeListOutputTransform(headers, data) {
//  var operation = this;

  var systemTime = headers.systemTime;
  if (systemTime == null) {
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
 * @since 1.0
 * @param {object} response - a response with a documents property providing
 * a sparse array of array of {@link documents.DocumentDescriptor} objects
 * providing the uris of the written documents.
 */
/**
 * Writes one or more documents; takes a configuration object with
 * the following named parameters or, as a shortcut, a document descriptor.
 * @method documents#write
 * @since 1.0
 * @param {DocumentDescriptor|DocumentDescriptor[]} documents - one descriptor
 * or an array of document descriptors to write
 * @param {documents.categories|documents.categories[]}  [categories] - the categories of information
 * to write for the documents
 * @param {string|transactions.Transaction}  [txid] - a string
 * transaction id or Transaction object identifying an open
 * multi-statement transaction
 * @param {string|mixed[]}  [transform] - the name of a transform extension to apply to each document
 * or an array with the name of the transform extension and an object of parameter values; the
 * transform must have been installed using the {@link transforms#write} function.
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
Documents.prototype.write = function writeDocuments() {
  return writeDocumentsImpl.call(this, false, mlutil.asArray.apply(null, arguments));
};
function writeDocumentsImpl(contentOnly, args) {
  /*jshint validthis:true */
  if (args.length < 1) {
    throw new Error('must provide uris for document write()');
  }

  var arg = args[0];

  var documents = arg.documents;
  var params = (documents == null) ? null : arg;
  if (params !== null) {
    if (!Array.isArray(documents)) {
      documents = [documents];
    }
  } else if (Array.isArray(arg)) {
    documents = arg;
  } else {
    documents = args;
  }

  var isSingleDoc = (documents.length === 1);

  var document      = isSingleDoc ? documents[0] : null;
  var hasDocument   = (document != null);
  var hasContent    = hasDocument && (document.content != null);

  var requestParams  =
    (params !== null) ? params   :
    (hasDocument)     ? document :
    null;

  var categories = (requestParams == null) ? null : requestParams.categories;
  if (typeof categories === 'string' || categories instanceof String) {
    categories = [categories];
  }

  if (categories != null) {
    for (var i = 0; i < categories.length; i++) {
      categories[i] = categories[i] === 'metadataValues' ? 'metadata-values' : categories[i];
    }
  }

  if (hasDocument) {
    if (hasContent && (document.properties == null)) {
      return writeContent.call(this, contentOnly, document, requestParams, categories, 'single');
    } else if (!hasContent && (document.uri != null)) {
      return writeMetadata.call(this, document, categories);
    }
  }

  return writeDocumentList.call(this, contentOnly, documents, requestParams, categories);
}
/** @ignore */
function writeMetadata(document, categories) {
  /*jshint validthis:true */
  var uri = document.uri;

  var endpoint = '/v1/documents?uri='+encodeURIComponent(uri);

  if (!Array.isArray(categories)) {
    categories = [];
  }

  var hasCategories = (categories.length > 0);
  if (!hasCategories) {
    var categoryCheck = ['collections', 'permissions', 'quality', 'properties', 'metadataValues'];
    var category = null;
    var i = 0;
    for (i = 0; i < categoryCheck.length; i++) {
      category = categoryCheck[i];
      if (document[category] != null) {
        category = category === 'metadataValues' ? 'metadata-values' : category;
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

  var txid = mlutil.convertTransaction(document.txid);
  if (txid != null) {
    endpoint += '&txid='+mlutil.getTxidParam(txid);
  }

  var requestHeaders = {
      'Accept':       'application/json',
      'Content-Type': 'application/json'
  };

  var connectionParams   = this.client.getConnectionParams();
  var requestOptions     = mlutil.copyProperties(connectionParams);
  requestOptions.method  = 'PUT';
  requestOptions.headers = requestHeaders;
  requestOptions.path    = mlutil.databaseParam(connectionParams, endpoint, '&');
  mlutil.addTxidHeaders(requestOptions, txid);

  var operation = new Operation(
      'write single metadata', this.client, requestOptions, 'single', 'empty'
      );
  operation.uri = uri;
  if (hasCategories) {
    operation.categories = categories;
  }
  operation.requestBody     = JSON.stringify(collectMetadata(document));
  operation.outputTransform = singleWriteOutputTransform;

  return requester.startRequest(operation);
}
/** @ignore */
function writeContent(contentOnly, document, requestParams, categories, requestType) {
  /*jshint validthis:true */
  var content     = document.content;
  var hasContent  = (content != null);

  var endpoint = '/v1/documents';

  var sep = '?';

  var txid = getTxid(requestParams);

  var writeParams = addWriteParams(requestParams, categories, txid);
  if (writeParams.length > 0) {
    endpoint += writeParams;
    sep = '&';
  }

  var uri    = document.uri;
  var hasUri = (uri != null);

  if (hasUri) {
    endpoint += sep+'uri='+encodeURIComponent(uri);
    if (sep === '?') { sep = '&'; }
  }

  var i = 0;

  var collections = document.collections;
  if (collections != null) {
    if (Array.isArray(collections)) {
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
  if (permissions != null) {
    var permission   = null;
    var roleName     = null;
    var capabilities = null;
    var j = 0;
    if (Array.isArray(permissions)) {
      for (i=0; i < permissions.length; i++) {
        permission   = permissions[i];
        roleName     = permission['role-name'];
        capabilities = permission.capabilities;
        if (Array.isArray(capabilities)) {
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
      if (Array.isArray(capabilities)) {
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
  if (quality != null) {
    endpoint += sep+'quality='+quality;
    if (sep === '?') { sep = '&'; }
  }

  var metadataValues = document.metadataValues;
  for (var key in metadataValues) {
    endpoint += sep+'value:'+key+'='+encodeURIComponent(metadataValues[key]);
  }

  var temporalDocument = document.temporalDocument;
  if (temporalDocument != null) {
    endpoint += sep+'temporal-document='+temporalDocument;
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

  var connectionParams   = this.client.getConnectionParams();
  var requestOptions     = mlutil.copyProperties(connectionParams);
  requestOptions.method  = hasUri ? 'PUT' : 'POST';
  requestOptions.headers = requestHeaders;
  requestOptions.path    = mlutil.databaseParam(connectionParams, endpoint, sep);
  mlutil.addTxidHeaders(requestOptions, txid);
  var operation = new Operation(
      'write single document', this.client, requestOptions, requestType, 'empty'
      );
  if (hasUri) {
    operation.uri = uri;
  }
  if (Array.isArray(categories) && categories.length > 0) {
    operation.categories = categories;
  }
  if (hasContent) {
    operation.requestBody = mlutil.marshal(content, operation);
  } else {
    operation.isReplayable = false;
  }
  operation.outputTransform = singleWriteOutputTransform;
  operation.contentOnly     = (contentOnly === true);

  return requester.startRequest(operation);
}
/** @ignore */
function writeDocumentList(contentOnly, documents, requestParams, categories) {
  /*jshint validthis:true */
  if (documents.length > 1) {
    documents = documents.sort(compareDocuments);
  }

  var endpoint = '/v1/documents';

  var txid = getTxid(requestParams);

  var writeParams = addWriteParams(requestParams, categories, txid);
  var sep = '?';
  if (writeParams.length > 0) {
    endpoint += writeParams;
    sep = '&';
  }

  var multipartBoundary = mlutil.multipartBoundary;

  var requestHeaders = {
      'Accept':       'application/json',
      'Content-Type': 'multipart/mixed; boundary='+multipartBoundary
  };

  var connectionParams   = this.client.getConnectionParams();
  var requestOptions     = mlutil.copyProperties(connectionParams);
  requestOptions.method  = 'POST';
  requestOptions.headers = requestHeaders;
  requestOptions.path    = mlutil.databaseParam(connectionParams, endpoint, sep);
  mlutil.addTxidHeaders(requestOptions, txid);

  var operation = new Operation(
      'write document list', this.client, requestOptions, 'multipart', 'single'
      );
  operation.uris = getDocumentUris(documents);
  if (Array.isArray(categories) && categories.length > 0) {
    operation.categories = categories;
  }

  operation.multipartBoundary = multipartBoundary;

  var requestPartList = [];
  for (var i=0; i < documents.length; i++) {
    addDocumentParts(operation, requestPartList, documents[i], false);
  }
  operation.requestPartList = requestPartList;

  operation.errorTransform    = uriListErrorTransform;
  if (contentOnly === true) {
    operation.subdata = ['documents', 'uri'];
  } else if ((requestParams != null) &&
      (requestParams.temporalCollection != null)) {
    operation.outputTransform = writeListOutputTransform;
  }

  return requester.startRequest(operation);
}
function getTxid(requestParams) {
  return (requestParams == null) ? null : requestParams.txid;
}
/** @ignore */
function addWriteParams(requestParams, categories, txidRaw) {
  var writeParams = '';
  var txid = mlutil.convertTransaction(txidRaw);
  var sep = '?';
  if (requestParams != null) {
    if (Array.isArray(categories) && categories.length > 0) {
      writeParams += sep+'category='+categories.join('&category=');
      if (sep !== '&') { sep = '&'; }
    }
    if (txid != null) {
      writeParams += sep+'txid='+mlutil.getTxidParam(txid);
      if (sep !== '&') { sep = '&'; }
    }
    var transform = mlutil.endpointTransform(requestParams.transform);
    if (transform != null) {
      writeParams += sep+transform;
      if (sep !== '&') { sep = '&'; }
    }
    var forestName = requestParams.forestName;
    if (forestName != null) {
      writeParams += sep+'forest-name='+encodeURIComponent(forestName);
      if (sep !== '&') { sep = '&'; }
    }
    var temporalCollection = requestParams.temporalCollection;
    if (temporalCollection != null) {
      writeParams += sep+'temporal-collection='+encodeURIComponent(temporalCollection);
      if (sep !== '&') { sep = '&'; }
      var systemTime = requestParams.systemTime;
      if (typeof systemTime === 'string' || systemTime instanceof String) {
        writeParams += '&system-time='+encodeURIComponent(systemTime);
      } else if (Object.prototype.toString.call(systemTime) === '[object Date]') {
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
    if (extension != null) {
      writeConfig += sep+'extension='+extension;
      if (isBody && sep === '?') { sep = '&'; }
      var directory = document.directory;
      if (directory != null) {
        writeConfig += sep+'directory='+
            (isBody ? encodeURIComponent(directory) : directory);
      }
    }
  }

  var versionId = document.versionId;
  if (versionId != null) {
    if (isBody) {
      headers['If-Match'] = versionId;
    } else {
      writeConfig += sep+'versionId='+versionId;
    }
  }

  var contentType    = document.contentType;
  var hasContentType = (contentType != null);
  var format         = document.format;
  var hasFormat      = (format != null);

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
      Array.isArray(content) ||
      ((typeof content === 'object' && content !== null) &&
        (typeof content !== 'string' && !(content instanceof String)) &&
        !Buffer.isBuffer(content) &&
        (typeof content !== 'function')))) {
    contentType    = 'application/json';
    hasContentType = true;
    format         = 'json';
    hasFormat      = true;
  }

  if (hasFormat) {
    switch(format) {
    case 'binary':
      var extract = document.extract;
      if (extract != null) {
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
      var repair = document.repair;
      if (repair != null) {
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
function addDocumentParts(operation, partList, document, isContentOptional) {
  var uri    = document.uri;
  var hasUri = (uri != null);

  var disposition = '';
  if (hasUri) {
    disposition = 'attachment; filename="'+uri+'"';
    if (document.temporalDocument != null) {
      disposition += '; temporal-document="'+document.temporalDocument+'"';
    }
  } else {
    disposition = 'inline';
  }

  var metadata = collectMetadata(document);
  if (metadata != null) {
    partList.push({
      headers:{
      'Content-Type'       : 'application/json',
      'Content-Disposition': disposition+'; category=metadata'
      },
      content: JSON.stringify(metadata)
    });
  }

  var content    = document.content;
  var hasContent = (content != null);
  if (hasContent || isContentOptional) {
    var headers = {};
    var part    = {headers: headers};

    var writeConfig = addWriteConfig(document, hasUri, content, headers, '; ');
    if (writeConfig.length > 0) {
      disposition += writeConfig;
    }

    headers['Content-Disposition'] = disposition+'; category=content';

    if (hasContent) {
      part.content = mlutil.marshal(content, operation);
    }

    partList.push(part);
  }
}

/** @ignore */
function collectMetadata(document) {
  var metadata = null;
  // TODO: create array wrapper for collections, capabilities
  var metadataCategories = ['collections', 'permissions', 'quality', 'properties', 'metadataValues'];
  for (var i = 0; i < metadataCategories.length; i++) {
    var category = metadataCategories[i];
    if (document !== null) {
      if (document[category] != null) {
        if (metadata === null) {
          metadata = {};
        }
        metadata[category] = document[category];
      }
    }
  }
  return metadata;
}

/** @ignore */
function removeOutputTransform(headers/*, data*/) {
  /*jshint validthis:true */
  var operation = this;

  if (operation.contentOnly === true) {
    return operation.uris;
  }

  var wrapper = {
    uris:    operation.uris,
    removed: true
  };

  var systemTime = headers.systemTime;
  if (systemTime != null) {
    wrapper.systemTime = systemTime;
  }

  return wrapper;
}

/**
 * A success callback for {@link ResultProvider} that receives the result from
 * the {@link documents#remove}.
 * @callback documents#removeResult
 * @since 1.0
 * @param {documents.DocumentDescriptor} document - a sparse document descriptor
 * for the removed document
 */
/**
 * Removes one or more database documents; takes a configuration
 * object with the following named parameters or, as a shortcut, one or more
 * uri strings or an array of uri strings.
 * @method documents#remove
 * @since 1.0
 * @param {string|string[]}  uris - the uri string or an array of uri strings
 * identifying the database documents
 * @param {string|transactions.Transaction}  [txid] - a string
 * transaction id or Transaction object identifying an open
 * multi-statement transaction
 * @param {string} [temporalCollection] - the name of the temporal collection;
 * use only when deleting a document created as a temporal document; sets the
 * system end time to record when the document was no longer active
 * @param {string|Date} [systemTime] - a datetime to use as the system end time
 * instead of the current time of the database server; can only be supplied
 * if the temporalCollection parameter is also supplied
 * @returns {ResultProvider} an object whose result() function takes
 * a {@link documents#removeResult} success callback.
 */
Documents.prototype.remove = function removeDocument() {
  return removeDocumentImpl.call(
      this, false, mlutil.asArray.apply(null, arguments)
      );
};
function removeDocumentImpl(contentOnly, args) {
  /*jshint validthis:true */
  if (args.length < 1) {
    throw new Error('must provide uris for document remove()');
  }

  var uris = null;
  var txid = null;
  var temporalCollection = null;
  var systemTime = null;
  var versionId = null;

  var arg = args[0];
  if (Array.isArray(arg)) {
    uris = arg;
  } else if (typeof arg === 'string' || arg instanceof String) {
    uris = args;
  } else {
    uris = arg.uris;
    if (uris == null) {
      throw new Error('must specify the uris parameters with at least one document to remove');
    }
    if (!Array.isArray(uris)) {
      uris = [uris];
    }

    txid = mlutil.convertTransaction(arg.txid);
    temporalCollection = arg.temporalCollection;
    systemTime = arg.systemTime;
    versionId = arg.versionId;
  }

  var path = '/v1/documents?uri='+
    uris.map(encodeURIComponent).join('&uri=');
  if (txid != null) {
    path += '&txid='+mlutil.getTxidParam(txid);
  }
  if (temporalCollection != null) {
    path += '&temporal-collection='+temporalCollection;
    if (typeof systemTime === 'string' || systemTime instanceof String) {
      path += '&system-time='+systemTime;
    } else if (Object.prototype.toString.call(systemTime) === '[object Date]') {
      path += '&system-time='+systemTime.toISOString();
    }
  }

  var connectionParams = this.client.getConnectionParams();
  var requestOptions = mlutil.copyProperties(connectionParams);
  if (versionId != null) {
    requestOptions.headers = {
        'If-Match': versionId
    };
  }
  requestOptions.method = 'DELETE';
  requestOptions.path = mlutil.databaseParam(connectionParams, path, '&');
  mlutil.addTxidHeaders(requestOptions, txid);

  var operation = new Operation(
      'remove document', this.client, requestOptions, 'empty', 'empty'
      );
  operation.uris             = uris;
  operation.validStatusCodes = [204];
  operation.outputTransform  = removeOutputTransform;
  operation.errorTransform   = uriErrorTransform;
  operation.contentOnly      = (contentOnly === true);

  return requester.startRequest(operation);
}

function removeAllOutputTransform(/*headers, data*/) {
  /*jshint validthis:true */
  var operation = this;

  if (operation.contentOnly === true) {
    return operation.collection;
  }

  var output = {
    exists: false
  };

  var collection = operation.collection;
  if (collection != null) {
    output.collection = collection;
  }

  var directory = operation.directory;
  if (directory != null) {
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
 * @since 1.0
 * @param {string}  [collection] - the collection whose documents should be
 * deleted
 * @param {string}  [directory] - a directory whose documents should be
 * deleted
 * @returns {ResultProvider} an object with a result() function taking
 * success and failure callbacks.
 */
Documents.prototype.removeAll = function removeAllDocuments(params) {
  return removeAllDocumentsImpl.call(this, false, params);
};
function removeAllDocumentsImpl(contentOnly, params) {
  /*jshint validthis:true */
  if (params == null) {
    throw new Error('No parameters specifying directory or collection to delete');
  }

  var deleteAll     = (params.all === true);

  var collection    = params.collection;
  var hasCollection = (collection != null);

  var directory     = params.directory;
  var hasDirectory  = (directory != null);

  var txid = mlutil.convertTransaction(params.txid);

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

  if (txid != null) {
    endpoint += sep+'txid='+mlutil.getTxidParam(txid);
    if (sep === '?') {
      sep = '&';
    }
  }

  var connectionParams = this.client.getConnectionParams();
  var requestOptions = mlutil.copyProperties(connectionParams);
  requestOptions.method = 'DELETE';
  requestOptions.path = mlutil.databaseParam(connectionParams, endpoint, sep);
  mlutil.addTxidHeaders(requestOptions, txid);

  var operation = new Operation(
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

  return requester.startRequest(operation);
}

/** @ignore */
function listOutputTransform(headers, data) {
  return [data];
}

/**
 * Defines a query in the structure accepted by the REST API.
 * @typedef {object} documents.CombinedQueryDefinition
 * @since 1.0
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
 * @param {string|transactions.Transaction}  [txid] - a string
 * transaction id or Transaction object identifying an open
 * multi-statement transaction to include modified documents
 * in the results if the documents match the criteria
 * @property {string} [view] - a value from the enumeration
 * all|facets|metadata|none|results|uris controlling whether to generate some or all
 * of a search response summarizing the search response in addition to the result
 * documents; the default is 'none' to return only the result documents
 */

/**
 * Executes a query built by a {@link queryBuilder} to match one or more
 * documents.
 * @method documents#query
 * @since 1.0
 * @param {object}  query - a query built by a {@link queryBuilder} or
 * a {@link documents.CombinedQueryDefinition}
 * @param {DatabaseClient.Timestamp}  [timestamp] - a Timestamp object for point-in-time
 * operations.
 * @returns {ResultProvider} an object whose result() function takes
 * a {@link documents#resultList} success callback.
 */
Documents.prototype.query = function queryDocuments(builtQuery, timestamp) {
  return queryDocumentsImpl.call(this, null, false, builtQuery, timestamp);
};
function queryDocumentsImpl(collectionParam, contentOnly, builtQuery, timestamp) {
  /*jshint validthis:true */
  var wrapper = qb.makeSearchBody(builtQuery);

  var categories  = wrapper.categories;
  var optionsName = wrapper.optionsName;
  var pageStart   = wrapper.pageStart;
  var pageLength  = wrapper.pageLength;
  var txid        = mlutil.convertTransaction(wrapper.txid);
  var transform   = wrapper.transform;
  var view        = wrapper.view;
  var searchBody  = wrapper.searchBody;

  var returnDocuments = (pageLength !== 0);
  if (!returnDocuments && builtQuery.queryType !== 'qbe') {
    var searchOptions = searchBody.search.options;
    if (searchOptions !== void 0) {
      var transformResults = searchOptions['transform-results'];
      if (transformResults !== null && transformResults !== void 0 &&
          transformResults.apply !== 'empty-snippet') {
        throw new Error('cannot snippet with page length of zero');
      }

      var extractResults = searchOptions['extract-document-data'];
      if (extractResults !== null && extractResults !== void 0) {
        throw new Error('cannot extract document data with page length of zero');
      }
    }
  }

  var requestPartList = null;

  var isMultipart = false;

  var endpoint = null;
  if (builtQuery.queryFormat === void 0) {
    endpoint = '/v1/search?format=json';
  } else if (builtQuery.queryType === 'qbe') {
    var qbeQuery = searchBody.search.$query;

    if (typeof qbeQuery === 'string' || qbeQuery instanceof String) {
      var options = searchBody.search.options;
      var part    = {
          headers: {'Content-Type': 'application/xml'},
          content: qbeQuery
          };
      isMultipart     = true;
      requestPartList = (options == null) ? [part] : [
        part,
        {
          headers: {'Content-Type': 'application/json'},
          content: JSON.stringify({options: options})
          }
        ];
    }

    endpoint = '/v1/qbe?format='+builtQuery.queryFormat;
  } else {
    endpoint = '/v1/search?format='+builtQuery.queryFormat;
  }

  var multipartBoundary =
    (isMultipart || returnDocuments) ? mlutil.multipartBoundary : null;

  if (categories != null) {
    if (categories === 'none' ||
        (Array.isArray(categories) && categories.length === 1 && categories[0] === 'none')
        ) {
      returnDocuments = false;
    } else {
      endpoint += '&category=' + (
        (typeof categories === 'string' || categories instanceof String) ?
        categories :
        categories.join('&category=')
        );
    }
  }
  if (optionsName != null) {
    endpoint += '&options='+optionsName;
  }
  if (pageStart != null) {
    endpoint += '&start='+pageStart;
  }
  if (pageLength != null) {
    endpoint += '&pageLength='+pageLength;
  }
  if (txid != null) {
    endpoint += '&txid='+mlutil.getTxidParam(txid);
  }
  if (transform != null) {
    endpoint += '&'+mlutil.endpointTransform(transform);
  }
  if (view != null) {
    endpoint += '&view='+view;
  }

  if (collectionParam != null) {
    endpoint += '&collection='+encodeURIComponent(collectionParam);
  }

  if (timestamp !== undefined && timestamp instanceof mlutil.Timestamp) {
    if (timestamp.value !== null) {
      endpoint += '&timestamp='+timestamp.value;
    }
  }

  var connectionParams = this.client.getConnectionParams();
  var requestOptions = mlutil.copyProperties(connectionParams);
  requestOptions.method = 'POST';
  requestOptions.headers = {
      'Content-Type': (isMultipart ?
          'multipart/mixed; boundary='+multipartBoundary :
          'application/json'),
      'Accept': (returnDocuments ?
          'multipart/mixed; boundary='+multipartBoundary :
          'application/json')
  };
  requestOptions.path = mlutil.databaseParam(connectionParams, endpoint, '&');
  mlutil.addTxidHeaders(requestOptions, txid);

  var operation = new Operation(
      'query documents', this.client, requestOptions,
      (isMultipart     ? 'multipart' : 'single'),
      (returnDocuments ? 'multipart' : 'single')
      );
  operation.validStatusCodes  = [200, 204, 404];
  operation.inlineAsDocument  = false;
  if (isMultipart) {
    operation.multipartBoundary = multipartBoundary;
    operation.requestPartList   = requestPartList;
  } else {
    operation.requestBody = searchBody;
  }
  if (contentOnly === true) {
    operation.subdata = ['content'];
  }
  if (!returnDocuments) {
    operation.outputTransform = listOutputTransform;
  }
  operation.timestamp = (timestamp !== undefined) ? timestamp : null;

  return requester.startRequest(operation);
}

/** @ignore */
function patchOutputTransform(/*headers, data*/) {
  /*jshint validthis:true */
  var operation = this;

  return {
    uri: operation.uri
  };
}

/**
 * A success callback for {@link ResultProvider} that receives the result from
 * the {@link documents#patch} function.
 * @callback documents#patchResult
 * @since 1.0
 * @param {object} document - a sparse {@link documents.DocumentDescriptor} object
 * providing the uri of the patched document.
 */
/**
 * Applies changes to a document; takes a configuration object with
 * the following named parameters or, as a shortcut, a uri string and
 * one or more patch operations produced by a {@link patchBuilder}.
 * @method documents#patch
 * @since 1.0
 * @param {string}  uri - the uri
 * @param {patchOperation|patchOperation[]} operations - delete, insert,
 * or replace operations produced by a {@link patchBuilder} to apply
 * to the document.
 * @param {documents.categories|documents.categories[]}  [categories] - the
 * categories of information modified by the patch (typically 'content')
 * @param {string} [temporalCollection] - the name of the temporal collection;
 * use only when patching temporal documents
 * @param {string} [temporalDocument] - the collection URI for the temporal document
 * to be patched; use only when patching temporal documents
 * @param {string} [sourceDocument] - the source collection URI for patching the
 * temporal document; use only when writing temporal documents
 * @param {string|transactions.Transaction}  [txid] - a string
 * transaction id or Transaction object identifying an open
 * multi-statement transaction to patch the document as part
 * of a larger multi-statement transaction
 * @param {number} [versionId] - an identifier for the currently stored version
 * of the document (when enforcing optimistic locking)
 * @returns {ResultProvider} an object whose result() function takes
 * a {@link documents#patchResult} success callback.
 */
Documents.prototype.patch = function patchDocuments() {
  var argLen = arguments.length;

  var arg = arguments[0];

  var params = (argLen === 1) ? arg : null;

  // TODO: allow for raw JSON or XML patch

  var uri                = null;
  var documentOperations = null;
  var categories         = null;
  var temporalCollection = null;
  var temporalDocument   = null;
  var sourceDocument     = null;
  var txid               = null;
  var versionId          = null;
  var pathlang           = null;
  var format             = null;
  var isRawPatch         = false;
  var i                  = 0;
  if (params !== null) {
    uri        = params.uri;
    arg        = params.operations;
    if (arg != null) {
      if ((typeof arg === 'string' || arg instanceof String) || Buffer.isBuffer(arg) ||
          (arg.patch != null)) {
        documentOperations = arg;
        isRawPatch = true;
      } else if (Array.isArray(arg)) {
        documentOperations = arg;
      } else {
        documentOperations = [arg];
      }
    }
    categories         = params.categories;
    temporalCollection = params.temporalCollection;
    temporalDocument   = params.temporalDocument;
    sourceDocument     = params.sourceDocument;
    txid               = mlutil.convertTransaction(params.txid);
    versionId          = params.versionId;
    format             = params.format;
  } else if (argLen > 1) {
    uri = arg;
    arg = arguments[1];
    if ((typeof arg === 'string' || arg instanceof String) || Buffer.isBuffer(arg) ||
        (arg.patch != null)) {
      documentOperations = arg;
      isRawPatch = true;
    } else if (Array.isArray(arg)) {
      documentOperations = arg;
    } else {
      documentOperations = new Array(argLen - 1);
      documentOperations[0] = arg;
      for(i=2; i < argLen; ++i) {
        documentOperations[i - 1] = arguments[i];
      }
    }
  }

  if ((uri == null) || (documentOperations == null)) {
    throw new Error('patch must specify a uri and operations');
  }

  if (format == null) {
    format = /\.xml$/.test(uri) ? 'xml' : 'json';
  }

  if (!isRawPatch) {
    documentOperations = documentOperations.filter(function patchOperationsFilter(operation){
      if (pathlang == null) {
        pathlang = operation.pathlang;
        if (pathlang != null) {
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
  if (categories != null) {
    if (!Array.isArray(categories)) {
      categories = [categories];
    }
    i = 0;
    for (i = 0; i < categories.length; i++) {
      categories[i] = categories[i] === 'metadataValues' ? 'metadata-values' : categories[i];
    }
    if (categories.length > 0) {
      endpoint += '&category=' + categories.join('&category=');
    }
  }
  if (temporalCollection != null) {
    endpoint += '&temporal-collection='+encodeURIComponent(temporalCollection);
  }
  if (temporalDocument != null) {
    endpoint += '&temporal-document='+encodeURIComponent(temporalDocument);
  }
  if (sourceDocument != null) {
    endpoint += '&source-document='+encodeURIComponent(sourceDocument);
  }
  if (txid != null) {
    endpoint += '&txid=' + mlutil.getTxidParam(txid);
  }

  var patchBody = isRawPatch ? documentOperations : {patch: documentOperations};
  if (!isRawPatch && (pathlang != null)) {
    patchBody.pathlang = pathlang;
  }

  var connectionParams = this.client.getConnectionParams();
  var requestOptions = mlutil.copyProperties(connectionParams);
  requestOptions.method = 'POST';
  requestOptions.headers = {
      'Content-Type':
        ((format === 'xml') ? 'application/xml' : 'application/json'),
      'Accept':                 'application/json',
      'X-HTTP-Method-Override': 'PATCH'
  };
  if (versionId != null) {
    requestOptions.headers['If-Match'] = versionId;
  }
  requestOptions.path = mlutil.databaseParam(connectionParams, endpoint, '&');
  mlutil.addTxidHeaders(requestOptions, txid);

  var operation = new Operation(
      'patch document', this.client, requestOptions, 'single', 'single'
      );
  operation.uri             = uri;
  operation.outputTransform = patchOutputTransform;
  operation.requestBody     = patchBody;
  operation.errorTransform  = uriErrorTransform;

  return requester.startRequest(operation);
};

/**
 * For a partial textual value intended for a string search, looks up completions
 * that match documents in the database. The textual value may be prefixed
 * with the constraint name for a string search binding or facet. The textual value
 * may also be an unqualified word or phrase for the default binding.
 * You may pass a configuration object with the following named parameters or,
 * as a shortcut, the partial textual search, the query, and optionally bindings.
 * @method documents#suggest
 * @since 1.0
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
Documents.prototype.suggest = function suggestDocuments() {
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

  if (partial == null) {
    throw new Error('no partial query text for document suggestion');
  }
  if (query == null) {
    throw new Error('no query with bindings for document suggestion');
  }

  var wrapper = qb.makeSearchBody(query);

  var searchBody = wrapper.searchBody;
  var search = searchBody.search;
  if (search == null) {
    throw new Error('cannot get  document suggestions for empty search');
  }
  if (search.$query != null) {
    throw new Error('cannot get  document suggestions for Query By Example (QBE)');
  }

  var searchOptions = search.options;
  if (searchOptions == null) {
    searchOptions = {};
    search.options = searchOptions;
  }
  var searchConstraints = searchOptions.constraint;

  var hasBindings = (bindings != null);

  var suggestConstraints = hasBindings ? bindings.constraint : null;
  var sources = copyConstraints(suggestConstraints, searchConstraints);
  if (sources.length > 0) {
    searchOptions['suggestion-source'] = sources;
  }

  var term = hasBindings ? bindings.term : null;
  if (term == null) {
    term = searchOptions.term;
  }

  var termDefault = null;
  if (term != null) {
    termDefault = term['default'];
    if (termDefault != null) {
      searchOptions['default-suggestion-source'] = termDefault;
    }
  }

  var endpoint = '/v1/suggest?partial-q='+encodeURIComponent(partial);
  if (limit != null) {
    endpoint += '&limit=' + limit;
  }

  var connectionParams = this.client.getConnectionParams();
  var requestOptions = mlutil.copyProperties(connectionParams);
  requestOptions.method = 'POST';
  requestOptions.headers = {
      'Content-Type': 'application/json',
      'Accept':       'application/json',
  };
  requestOptions.path = mlutil.databaseParam(connectionParams, endpoint, '&');
  mlutil.addTxidHeaders(requestOptions, wrapper.txid);

  var operation = new Operation(
      'search suggest', this.client, requestOptions, 'single', 'single'
      );
  operation.input       = partial;
  operation.requestBody = searchBody;
  operation.subdata     = ['suggestions'];

  return requester.startRequest(operation);
};

/**
 * The writeAll function writes one or more documents to database using a passThrough stream and optional options.
 * The optional options include onBatchSuccess, onBatchError, onCompletion, batchSize, concurrentRequests,
 *  defaultMetadata and transform.
 * @method documents#writeAll
 * @since 2.8.0
 * @param {function(progress, documents)} [onBatchSuccess] - Notifies other systems about batches written successfully.
 * @param {function(progress, documents, error)} [onBatchError] - Responds to any error while writing a batch of documents.
 * @param {function(summary)} [onCompletion] - Provides a summary of the results.
 * @param {Integer} [batchSize] - The number of documents in each batch.
 * @param {object} [concurrentRequests] - JavaScript object literal that controls the maximum number of concurrent
 *  requests that can be pending at the same time. Valid keys are "multipleOf" and "multiplier".
 * @param {object} [defaultMetadata] - the metadata values applied to each document including collections,
 *  permissions, properties, quality, and metadataValues.
 * @param {string|mixed[]} [transform] - transformSpecification applied to each document.
 * @returns {stream.Writable} - a stream.Writable in object mode that receives document descriptor input from the
 *  application for writing to the database.
 */
Documents.prototype.writeAll = function writeAllDocuments(options) {
  return writeAllDocumentsImpl.call(
      this, options
  );
};
function writeAllDocumentsImpl(jobOptions) {

  let path = '/v1/internal/forestinfo';
  let connectionParams = this.client.getConnectionParams();
  let requestOptions = mlutil.copyProperties(connectionParams);

  let inputStream = new stream.PassThrough({objectMode: true});
  requestOptions.method = 'GET';
  requestOptions.headers = {
    'Accept':       'application/json',
  };

  requestOptions.path = mlutil.databaseParam(connectionParams, path);
  let operation = new Operation(
      'read forestInfo', this.client, requestOptions, 'empty', 'single'
  );

  let jobState = {
    docInstance : this,
    stream: inputStream,
    requesterCount: 0,
    docsWrittenSuccessfully:0,
    docsFailedToBeWritten: 0,
    jobOptions: (jobOptions)? mlutil.copyProperties(jobOptions):{}
  };

   // Check for jobOptions.concurrentRequests
   if(jobState.jobOptions.concurrentRequests) {
     const concurrentRequests = jobState.jobOptions.concurrentRequests;
     if (concurrentRequests.multipleOf) {
       if (!new Set(['forests', 'hosts']).has(String(concurrentRequests.multipleOf))) {
         throw new Error('Invalid value for onCompletion.multipleOf. Value must be forests or hosts.');
       }
     } else {
       concurrentRequests.multipleOf = 'forests';
     }

     if (concurrentRequests.multiplier && concurrentRequests.multiplier < 0) {
       throw new Error('concurrentRequests.multiplier cannot be less than zero');
     } else {
       concurrentRequests.multiplier = 4;
     }
     jobState.jobOptions.concurrentRequests = concurrentRequests;
   }
   else {
     jobState.jobOptions.concurrentRequests = {multipleOf:'forests', multiplier:4};
   }

   // Check for jobOptions.batchSize
   jobState.jobOptions.batchSize = (jobState.jobOptions.batchSize && jobState.jobOptions.batchSize >0) ? jobState.jobOptions.batchSize:100;

   //Check for defaultMetadata
   jobState.jobOptions.defaultMetadata = (jobState.jobOptions.defaultMetadata)? jobState.jobOptions.defaultMetadata:null;

   //Check for transform
   jobState.jobOptions.transform = (jobState.jobOptions.transform)? jobState.jobOptions.transform:null;

  requester.startRequest(operation).result(mlutil.callbackOn(jobState, onWriteAllInit))
      .catch((err) => operation.stream.emit('error', err));

  return inputStream;
}

function finishWriter(jobState) {
  jobState.requesterCount--;
  if(jobState.requesterCount === 0) {
    if(jobState.jobOptions.onCompletion){
      const summary = {
        docsWrittenSuccessfully: jobState.docsWrittenSuccessfully,
        docsFailedToBeWritten: jobState.docsFailedToBeWritten,
        timeElapsed: jobState.timeElapsed
      };
      if (jobState.error) {
        summary.error = jobState.error.toString();
      }
      jobState.jobOptions.onCompletion(summary);
    }
  }
}

function onWriteAllInit(output) {

  let maxRequesters = 0;
  const jobState = this;

  switch (jobState.jobOptions.concurrentRequests.multipleOf) {
    case 'forests':
      maxRequesters = jobState.jobOptions.concurrentRequests.multiplier * output.length;
      break;
    case 'hosts':
      maxRequesters = jobState.jobOptions.concurrentRequests.multiplier *
          new Set(output.map((forest) => forest.host)).size;
      break;
    default: {
      const err =  new Error('Invalid value for onCompletion.multipleOf. Value must be forests or hosts.');
      jobState.error = err;
      jobState.stream.emit('error', err);
    }
  }
  jobState.startTime = Date.now();
  for (let i = 0; i < maxRequesters; i++) {
    jobState.requesterCount++;
    onWriteAllDocs(jobState,i);
  }
}

function onWriteAllDocs(jobState, writerId) {

  const writeBatchArray = [];
  const batchSize = jobState.jobOptions.batchSize;
  jobState.lastBatch = false;
  jobState.retryCount = 2;

  a:
      for (let i = 0; i < batchSize; i++) {
        const record = jobState.stream.read();

        if(record !== null) {
          if (jobState.jobOptions.defaultMetadata && i === 0) {
            writeBatchArray.push(jobState.jobOptions.defaultMetadata);
          }
        }
        else {
          switch (writeBatchArray.length) {
            case 0: {
              jobState.timeElapsed = Date.now() - jobState.startTime;
              finishWriter(jobState);
              break a;
            }
            default: {
              jobState.lastBatch = true;
              break a;
            }
          }
        }
        writeBatchArray.push(record);
      }

  if (writeBatchArray.length !== 0) {
    const batchdef = {documents: writeBatchArray};
    if(jobState.jobOptions.transform){
      batchdef.transform = jobState.jobOptions.transform;
    }
    writeDocs(jobState, false, batchdef,writeBatchArray, writerId);
  }
}

function writeDocs(jobState, val, batchdef, writeBatchArray, writerId){
  writeDocumentsImpl.call(jobState.docInstance, val, [batchdef])
      .result((output) => {
        jobState.docsWrittenSuccessfully+= writeBatchArray.length;
        if (jobState.jobOptions.onBatchSuccess) {
          const progressSoFar = {
            docsWrittenSuccessfully: jobState.docsWrittenSuccessfully,
            docsFailedToBeWritten: jobState.docsFailedToBeWritten,
            timeElapsed: (Date.now()-jobState.startTime)
          };
          const documents = writeBatchArray;
          jobState.jobOptions.onBatchSuccess(progressSoFar, documents);
        }
        if(jobState.lastBatch){
          jobState.timeElapsed = Date.now() - jobState.startTime;
          finishWriter(jobState);
        }
        else {
          onWriteAllDocs(jobState, writerId);
        }
      })
      .catch((err) => {
        let errorDisposition = err;
        if (jobState.jobOptions.onBatchError) {
          const progressSoFar = {
            docsWrittenSuccessfully: jobState.docsWrittenSuccessfully,
            docsFailedToBeWritten: writeBatchArray.length,
            timeElapsed: (Date.now()-jobState.startTime)
          };
          const documents = writeBatchArray;
          try {
            errorDisposition = jobState.jobOptions.onBatchError(progressSoFar, documents, err);
          } catch(err){
            errorDisposition = err;
          }
        }

        if(errorDisposition instanceof Error){
          jobState.docsFailedToBeWritten += writeBatchArray.length;
          jobState.error = errorDisposition;
          jobState.stream.emit('error', errorDisposition);
          jobState.timeElapsed = Date.now() - jobState.startTime;
          finishWriter(jobState);
          return;
        } else if(!Array.isArray(errorDisposition)) {
          onWriteAllDocs(jobState, writerId);
          return;
        }

        switch(jobState.retryCount){
          case 2:
          case 1: {
            jobState.retryCount--;
            batchdef.documents = errorDisposition;
            writeDocs(jobState, val, batchdef,batchdef.documents, writerId);
            break;
          }
          default: {
            jobState.docsFailedToBeWritten += writeBatchArray.length;
            jobState.error = err;
            jobState.stream.emit('error', err);
            jobState.timeElapsed = Date.now() - jobState.startTime;
            finishWriter(jobState);
          }
        }
      });
}

/** @ignore */
function copyConstraints(suggestConstraints, searchConstraints) {
  var destination = [];

  var bindLen = Array.isArray(suggestConstraints) ? suggestConstraints.length : 0;

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
  if (Array.isArray(searchConstraints)) {
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
          if (copy === null) {
            copy = {};
          }
          copy[key] = constraint[key];
        } else if (key === 'name') {
          if (copy === null) {
            copy = {};
          }
          copy.ref = constraint.name;
        }
      }

      if (copy !== null) {
        destination.push(copy);
        copy = null;
      }
    }
  }

  return destination;
}

function createDocuments(client) {
  return new Documents(client);
}

module.exports = {
    create:               createDocuments,
    probeImpl:            probeDocumentsImpl,
    queryImpl:            queryDocumentsImpl,
    readImpl:             readDocumentsImpl,
    removeImpl:           removeDocumentImpl,
    removeCollectionImpl: removeAllDocumentsImpl,
    writeImpl:            writeDocumentsImpl,
    writeAll:             writeAllDocumentsImpl
};
