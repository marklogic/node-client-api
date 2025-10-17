/*
* Copyright (c) 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/
'use strict';

const requester  = require('./requester.js');
const mlutil     = require('./mlutil.js');
const Operation  = require('./operation.js');
const qb         = require('./query-builder.js').lib;
const pathModule = require('path');
const fs         = require('fs');
const stream = require('stream');
const bldrbase = require('./plan-builder-base.js');
const duplexify = require('duplexify');

/** @ignore */
function addDocumentUri(documents, document) {
  if (document != null) {
    const uri = document.uri;
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
  if (!hasFirstDoc && !hasSecondDoc) {return  0;}
  if (!hasFirstDoc && hasSecondDoc)  {return -1;}
  if (hasFirstDoc  && !hasSecondDoc) {return  1;}
  const firstUri  = firstDoc.uri;
  const secondUri = secondDoc.uri;
  const hasFirstUri  = ((typeof firstUri  === 'string' || firstUri  instanceof String) && firstUri.length  > 0);
  const hasSecondUri = ((typeof secondUri === 'string' || secondUri instanceof String) && secondUri.length > 0);
  if (!hasFirstUri && !hasSecondUri) {return  0;}
  if (!hasFirstUri && hasSecondUri)  {return -1;}
  if (hasFirstUri  && !hasSecondUri) {return  1;}
  if (firstUri < secondUri) {return -1;}
  if (firstUri > secondUri) {return  1;}
  return 0;
}

/** @ignore */
function uriErrorTransform(message) {
  /*jshint validthis:true */
  const operation = this;

  const uri = operation.uri;
  return (uri == null) ? message :
    (message+' (on '+uri+')');
}
/** @ignore */
function uriListErrorTransform(message) {
  /*jshint validthis:true */
  const operation = this;

  const uris = operation.uris;
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
  const operation = this;

  const statusCode = operation.responseStatusCode;
  const exists     = (statusCode === 200) ? true : false;
  if (operation.contentOnly === true) {
    return exists;
  }

  const output = exists ? operation.responseHeaders : {};
  output.uri    = operation.uri;
  output.exists = exists;

  return output;
}

function protectOutputTransform(/*headers, data*/) {
  /*jshint validthis:true */
  const operation = this;

  const output = {
    uri:                operation.uri,
    temporalCollection: operation.temporalCollection,
    level:              operation.level
  };

  return output;
}

function wipeOutputTransform(/*headers, data*/) {
  /*jshint validthis:true */
  const operation = this;

  const output = {
    uri:                operation.uri,
    temporalCollection: operation.temporalCollection,
    wiped:              true
  };

  return output;
}

function advanceLsqtOutputTransform(headers) {
  /*jshint validthis:true */

  const output = {
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
 * content|collections|metadataValues|permissions|properties|quality|metadata|rawContent|none where
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

  const params = (args.length === 1 && typeof args[0] !== 'string' && !(args[0] instanceof String)) ? args[0] : null;

  let uri = null;
  let txid = null;
  let path = '/v1/documents?format=json';
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

  const requestOptions = mlutil.newRequestOptions(this.client.getConnectionParams(), path, 'HEAD');
  mlutil.addTxidHeaders(requestOptions, txid);

  const operation = new Operation(
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
  const args = mlutil.asArray.apply(null, arguments);
  const argLen = args.length;

  let uri           = null;
  let tempColl      = null;
  let duration      = null;
  let expireTime    = null;
  let level         = 'noDelete';
  let archivePath   = null;

  // Params as single object
  if (argLen === 1) {
    const obj = args[0];
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
    const levels = ['noWipe', 'noDelete', 'noUpdate'];
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

  let path = '/v1/documents/protection?uri=' + encodeURIComponent(uri);
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

  const requestOptions = mlutil.newRequestOptions(this.client.getConnectionParams(), path, 'POST');

  const operation = new Operation(
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
  const args = mlutil.asArray.apply(null, arguments);
  const argLen = args.length;

  let uri           = null;
  let tempColl      = null;

  // Params as single object
  if (argLen === 1) {
    const obj = args[0];
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

  let path = '/v1/documents?uri=' + encodeURIComponent(uri);
  path += '&temporal-collection=' + encodeURIComponent(tempColl);
  path += '&result=wiped';

  const requestOptions = mlutil.newRequestOptions(this.client.getConnectionParams(), path, 'DELETE');

  const operation = new Operation(
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
  const args = mlutil.asArray.apply(null, arguments);

  let tempColl = null;
  let lag      = null;

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
    const obj = args[0];
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

  let path = '/v1/temporal/collections/' + encodeURIComponent(tempColl);
  path += '?result=advance-lsqt';
  if (lag !== null) {
    path += '&lag=' + encodeURIComponent(lag);
  }

  const requestOptions = mlutil.newRequestOptions(this.client.getConnectionParams(), path, 'POST');

  const operation = new Operation(
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
      null : 'response with invalid '+statusCode+' status';
}
/** @ignore */
function singleReadOutputTransform(headers, data) {
  /*jshint validthis:true */
  const operation = this;

  const hasData = (data != null);
  if (hasData &&
      (data.errorResponse != null) &&
      data.errorResponse.statusCode === 404
      ) {
    return [];
  }

  const content = hasData ? data : null;

  if (operation.contentOnly === true) {
    return [content];
  }

  const categories = operation.categories;

  const document = (categories.length === 1 && categories[0] === 'content') ?
      {content: content} : collectMetadata(content);

  if(operation.uris){
    document.uri      = operation.uris[0];
  }
  document.category = categories;

  const format = headers.format;
  if (typeof format === 'string' || format instanceof String) {
    document.format = format;
    if (format !== 'json') {
      const contentLength = headers.contentLength;
      if (contentLength != null) {
        document.contentLength = contentLength;
      }
    }
  }

  const headerList  = ['contentType', 'versionId'];
  let headerKey   = null;
  let headerValue = null;
  let i = 0;
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

  let uris = null;
  let categories = null;
  let txid = null;
  let transform = null;
  let contentType = null;
  let range = null;
  let timestamp = null;

  const arg = args[0];
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
    let i = 0;
    for (i = 0; i < categories.length; i++) {
      if(categories[i] === 'rawContent'){
        if(categories.length>1) {
          throw new Error('Categories should not have other option(s) if rawContent is needed.');
        } else {
          categories = ['content'];
          contentOnly = true;
        }
      }
      categories[i] = categories[i] === 'metadataValues' ? 'metadata-values' : categories[i];
    }
  }

  let path = '/v1/documents?format=json&uri='+
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

  const isSinglePayload = (
      uris.length === 1 && (
          (categories.length === 1 && categories[0] === 'content') ||
          categories.indexOf('content') === -1
      ));

  const requestOptions = mlutil.newRequestOptions(this.client.getConnectionParams(), path, 'GET');
  if (!isSinglePayload) {
    requestOptions.headers = {
        Accept: 'multipart/mixed; boundary='+mlutil.multipartBoundary
    };
  } else {
    let hasContentType = false;
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
      let bytes = null;
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

  const operation = new Operation(
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

  let categories = document.categories;
  const hasCategories = Array.isArray(categories) && categories.length > 0;
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
  let endpoint = '/v1/documents';

  const txid = getTxid(document);

  const writeParams = addWriteParams(document, categories, txid);
  if (writeParams.length > 0) {
    endpoint += writeParams;
  }

  const multipartBoundary = mlutil.multipartBoundary;
  const requestOptions = mlutil.newRequestOptions(this.client.getConnectionParams(), endpoint, 'POST');
  requestOptions.headers = {
      'Content-Type': 'multipart/mixed; boundary='+multipartBoundary,
      'Accept': 'application/json'
  };
  mlutil.addTxidHeaders(requestOptions, txid);

  const operation = new Operation(
      'write document stream', this.client, requestOptions, 'chunkedMultipart', 'single'
      );
  operation.isReplayable = false;
  operation.uri = document.uri;

  // TODO: treat as chunked single document if no properties
  const requestPartList = [];
  addDocumentParts(operation, requestPartList, document, true);
  operation.requestDocument = requestPartList;

  operation.multipartBoundary = mlutil.multipartBoundary;
  operation.errorTransform    = uriErrorTransform;

  return requester.startRequest(operation);
}

/** @ignore */
function singleWriteOutputTransform(headers, data) {
  /*jshint validthis:true */
  const operation = this;

  let uri = operation.uri;

  if (uri == null) {
    const location = headers.location;
    if (location != null) {
      const startsWith = '/v1/documents?uri=';
      if (location.length > startsWith.length &&
          location.substr(0, startsWith.length) === startsWith) {
        uri = location.substr(startsWith.length);
      }
    }
  }

  if (operation.contentOnly === true) {
    return [uri];
  }

  const document = {uri: uri};

  const categories = operation.categories;
  if (categories == null) {
    document.categories = categories;
  }

  const contentType = (data == null) ? null : data['mime-type'];
  if (contentType == null) {
    document.contentType = contentType;
  }

  const wrapper = {documents: [document]};

  const systemTime = headers.systemTime;
  if (systemTime != null) {
    wrapper.systemTime = systemTime;
  }

  return wrapper;
}
/** @ignore */
function writeListOutputTransform(headers, data) {
//  var operation = this;

  const systemTime = headers.systemTime;
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

  const arg = args[0];

  let documents = arg.documents;
  const params = (documents == null) ? null : arg;
  if (params !== null) {
    if (!Array.isArray(documents)) {
      documents = [documents];
    }
  } else if (Array.isArray(arg)) {
    documents = arg;
  } else {
    documents = args;
  }

  const isSingleDoc = (documents.length === 1);

  const document      = isSingleDoc ? documents[0] : null;
  const hasDocument   = (document != null);
  const hasContent    = hasDocument && (document.content != null);

  const requestParams  =
    (params !== null) ? params   :
    (hasDocument)     ? document :
    null;

  let categories = (requestParams == null) ? null : requestParams.categories;
  if (typeof categories === 'string' || categories instanceof String) {
    categories = [categories];
  }

  if (categories != null) {
    for (let i = 0; i < categories.length; i++) {
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
  const uri = document.uri;

  let endpoint = '/v1/documents?uri='+encodeURIComponent(uri);

  if (!Array.isArray(categories)) {
    categories = [];
  }

  let hasCategories = (categories.length > 0);
  if (!hasCategories) {
    const categoryCheck = ['collections', 'permissions', 'quality', 'properties', 'metadataValues'];
    let category = null;
    let i = 0;
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

  const txid = mlutil.convertTransaction(document.txid);
  if (txid != null) {
    endpoint += '&txid='+mlutil.getTxidParam(txid);
  }

  const requestHeaders = {
      'Accept':       'application/json',
      'Content-Type': 'application/json'
  };

  const requestOptions     = mlutil.newRequestOptions(this.client.getConnectionParams(), endpoint, 'PUT');
  requestOptions.headers = requestHeaders;
  mlutil.addTxidHeaders(requestOptions, txid);

  const operation = new Operation(
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
  const content     = document.content;
  const hasContent  = (content != null);

  let endpoint = '/v1/documents';

  let sep = '?';

  const txid = getTxid(requestParams);

  const writeParams = addWriteParams(requestParams, categories, txid);
  if (writeParams.length > 0) {
    endpoint += writeParams;
    sep = '&';
  }

  const uri    = document.uri;
  const hasUri = (uri != null);

  if (hasUri) {
    endpoint += sep+'uri='+encodeURIComponent(uri);
    if (sep === '?') { sep = '&'; }
  }

  let i = 0;

  const collections = document.collections;
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

  const permissions = document.permissions;
  if (permissions != null) {
    let permission   = null;
    let roleName     = null;
    let capabilities = null;
    let j = 0;
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

  const quality = document.quality;
  if (quality != null) {
    endpoint += sep+'quality='+quality;
    if (sep === '?') { sep = '&'; }
  }

  const metadataValues = document.metadataValues;
  for (const key in metadataValues) {
    endpoint += sep+'value:'+key+'='+encodeURIComponent(metadataValues[key]);
  }

  const temporalDocument = document.temporalDocument;
  if (temporalDocument != null) {
    endpoint += sep+'temporal-document='+temporalDocument;
    if (sep === '?') { sep = '&'; }
  }

  const requestHeaders = {
    'Accept': 'application/json'
  };

  const writeConfig = addWriteConfig(document, hasUri, content, requestHeaders, sep);
  if (writeConfig.length > 0) {
    endpoint += writeConfig;
    if (sep === '?') { sep = '&'; }
  }

  const requestOptions     = mlutil.newRequestOptions(this.client.getConnectionParams(), endpoint, hasUri ? 'PUT' : 'POST');
  requestOptions.headers = requestHeaders;
  mlutil.addTxidHeaders(requestOptions, txid);
  const operation = new Operation(
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

  let endpoint = '/v1/documents';

  const txid = getTxid(requestParams);

  const writeParams = addWriteParams(requestParams, categories, txid);
  if (writeParams.length > 0) {
    endpoint += writeParams;
  }

  const multipartBoundary = mlutil.multipartBoundary;

  const requestHeaders = {
      'Accept':       'application/json',
      'Content-Type': 'multipart/mixed; boundary='+multipartBoundary
  };

  const requestOptions     = mlutil.newRequestOptions(this.client.getConnectionParams(), endpoint, 'POST');
  requestOptions.headers = requestHeaders;
  mlutil.addTxidHeaders(requestOptions, txid);

  const operation = new Operation(
      'write document list', this.client, requestOptions, 'multipart', 'single'
      );
  operation.uris = getDocumentUris(documents);
  if (Array.isArray(categories) && categories.length > 0) {
    operation.categories = categories;
  }

  operation.multipartBoundary = multipartBoundary;

  const requestPartList = [];
  for (let i=0; i < documents.length; i++) {
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
  let writeParams = '';
  const txid = mlutil.convertTransaction(txidRaw);
  let sep = '?';
  if (requestParams != null) {
    if (Array.isArray(categories) && categories.length > 0) {
      writeParams += sep+'category='+categories.join('&category=');
      if (sep !== '&') { sep = '&'; }
    }
    if (txid != null) {
      writeParams += sep+'txid='+mlutil.getTxidParam(txid);
      if (sep !== '&') { sep = '&'; }
    }
    const transform = mlutil.endpointTransform(requestParams.transform);
    if (transform != null) {
      writeParams += sep+transform;
      if (sep !== '&') { sep = '&'; }
    }
    const forestName = requestParams.forestName;
    if (forestName != null) {
      writeParams += sep+'forest-name='+encodeURIComponent(forestName);
      if (sep !== '&') { sep = '&'; }
    }
    const temporalCollection = requestParams.temporalCollection;
    if (temporalCollection != null) {
      writeParams += sep+'temporal-collection='+encodeURIComponent(temporalCollection);
      if (sep !== '&') { sep = '&'; }
      const systemTime = requestParams.systemTime;
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
  let writeConfig = '';

  const isBody = (sep !== '; ');

  if (!hasUri) {
    const extension = document.extension;
    if (extension != null) {
      writeConfig += sep+'extension='+extension;
      if (isBody && sep === '?') { sep = '&'; }
      const directory = document.directory;
      if (directory != null) {
        writeConfig += sep+'directory='+
            (isBody ? encodeURIComponent(directory) : directory);
      }
    }
  }

  const versionId = document.versionId;
  if (versionId != null) {
    if (isBody) {
      headers['If-Match'] = versionId;
    } else {
      writeConfig += sep+'versionId='+versionId;
    }
  }

  let contentType    = document.contentType;
  let hasContentType = (contentType != null);
  let format         = document.format;
  let hasFormat      = (format != null);

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
  const uri    = document.uri;
  const hasUri = (uri != null);

  let disposition = '';
  if (hasUri) {
    disposition = 'attachment; filename="'+uri+'"';
    if (document.temporalDocument != null) {
      disposition += '; temporal-document="'+document.temporalDocument+'"';
    }
  } else {
    disposition = 'inline';
  }

  const metadata = collectMetadata(document);
  if (metadata != null) {
    partList.push({
      headers:{
      'Content-Type'       : 'application/json',
      'Content-Disposition': disposition+'; category=metadata'
      },
      content: JSON.stringify(metadata)
    });
  }

  const content    = document.content;
  const hasContent = (content != null);
  if (hasContent || isContentOptional) {
    const headers = {};
    const part    = {headers: headers};

    const writeConfig = addWriteConfig(document, hasUri, content, headers, '; ');
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
  let metadata = null;
  // TODO: create array wrapper for collections, capabilities
  const metadataCategories = ['collections', 'permissions', 'quality', 'properties', 'metadataValues'];
  for (let i = 0; i < metadataCategories.length; i++) {
    const category = metadataCategories[i];
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
  const operation = this;

  if (operation.contentOnly === true) {
    return operation.uris;
  }

  const wrapper = {
    uris:    operation.uris,
    removed: true
  };

  const systemTime = headers.systemTime;
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

  let uris = null;
  let txid = null;
  let temporalCollection = null;
  let systemTime = null;
  let versionId = null;

  const arg = args[0];
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

  let path = '/v1/documents?uri='+
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

  const requestOptions = mlutil.newRequestOptions(this.client.getConnectionParams(), path, 'DELETE');
  if (versionId != null) {
    requestOptions.headers = {
        'If-Match': versionId
    };
  }
  mlutil.addTxidHeaders(requestOptions, txid);

  const operation = new Operation(
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
  const operation = this;

  if (operation.contentOnly === true) {
    return operation.collection;
  }

  const output = {
    exists: false
  };

  const collection = operation.collection;
  if (collection != null) {
    output.collection = collection;
  }

  const directory = operation.directory;
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

  const deleteAll     = (params.all === true);

  const collection    = params.collection;
  const hasCollection = (collection != null);

  const directory     = params.directory;
  const hasDirectory  = (directory != null);

  const txid = mlutil.convertTransaction(params.txid);

  let endpoint = '/v1/search';
  let sep = '?';

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

  const requestOptions = mlutil.newRequestOptions(this.client.getConnectionParams(), endpoint, 'DELETE');
  mlutil.addTxidHeaders(requestOptions, txid);

  const operation = new Operation(
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

/** @ignore */
function multipartTransform(headers) {
  this.resultEstimateCallback(headers['vnd.marklogic.result-estimate']);
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
 * @param {function(resultEstimate)} [resultEstimateCallback] - Retrieve the value of "vnd.marklogic.result-estimate"
 * from the headers.
 * @returns {ResultProvider} an object whose result() function takes
 * a {@link documents#resultList} success callback.
 */
Documents.prototype.query = function queryDocuments(builtQuery, timestamp, resultEstimateCallback) {
  return queryDocumentsImpl.call(this, null, false, builtQuery, timestamp, resultEstimateCallback);
};
function queryDocumentsImpl(collectionParam, contentOnly, builtQuery, timestamp, resultEstimateCallback) {
  /*jshint validthis:true */
  const wrapper = qb.makeSearchBody(builtQuery);

  const categories  = wrapper.categories;
  const optionsName = wrapper.optionsName;
  const pageStart   = wrapper.pageStart;
  const pageLength  = wrapper.pageLength;
  const txid        = mlutil.convertTransaction(wrapper.txid);
  const transform   = wrapper.transform;
  const view        = wrapper.view;
  const searchBody  = wrapper.searchBody;

  let returnDocuments = (pageLength !== 0);
  if (!returnDocuments && builtQuery.queryType !== 'qbe') {
    const searchOptions = searchBody.search.options;
    if (searchOptions !== void 0) {
      const transformResults = searchOptions['transform-results'];
      if (transformResults !== null && transformResults !== void 0 &&
          transformResults.apply !== 'empty-snippet') {
        throw new Error('cannot snippet with page length of zero');
      }

      const extractResults = searchOptions['extract-document-data'];
      if (extractResults !== null && extractResults !== void 0) {
        throw new Error('cannot extract document data with page length of zero');
      }
    }
  }

  let requestPartList = null;

  let isMultipart = false;

  let endpoint = null;
  if (builtQuery.queryFormat === void 0) {
    endpoint = '/v1/search?format=json';
  } else if (builtQuery.queryType === 'qbe') {
    const qbeQuery = searchBody.search.$query;

    if (typeof qbeQuery === 'string' || qbeQuery instanceof String) {
      const options = searchBody.search.options;
      const part    = {
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

  const multipartBoundary =
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

  const requestOptions = mlutil.newRequestOptions(this.client.getConnectionParams(), endpoint, 'POST');
  requestOptions.headers = {
      'Content-Type': (isMultipart ?
          'multipart/mixed; boundary='+multipartBoundary :
          'application/json'),
      'Accept': (returnDocuments ?
          'multipart/mixed; boundary='+multipartBoundary :
          'application/json')
  };
  mlutil.addTxidHeaders(requestOptions, txid);

  const operation = new Operation(
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
  } else if (resultEstimateCallback) {
    operation.resultEstimateCallback = resultEstimateCallback;
    operation.onMultipart = multipartTransform;
  }
  operation.timestamp = (timestamp !== undefined) ? timestamp : null;

  return requester.startRequest(operation);
}

/** @ignore */
function patchOutputTransform(/*headers, data*/) {
  /*jshint validthis:true */
  const operation = this;

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
  const argLen = arguments.length;

  let arg = arguments[0];

  const params = (argLen === 1) ? arg : null;

  // TODO: allow for raw JSON or XML patch

  let uri                = null;
  let documentOperations = null;
  let categories         = null;
  let temporalCollection = null;
  let temporalDocument   = null;
  let sourceDocument     = null;
  let txid               = null;
  let versionId          = null;
  let pathlang           = null;
  let format             = null;
  let isRawPatch         = false;
  let i                  = 0;
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

  let endpoint = '/v1/documents?uri='+encodeURIComponent(uri);
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

  const patchBody = isRawPatch ? documentOperations : {patch: documentOperations};
  if (!isRawPatch && (pathlang != null)) {
    patchBody.pathlang = pathlang;
  }

  const requestOptions = mlutil.newRequestOptions(this.client.getConnectionParams(), endpoint, 'POST');
  requestOptions.headers = {
      'Content-Type':
        ((format === 'xml') ? 'application/xml' : 'application/json'),
      'Accept':                 'application/json',
      'X-HTTP-Method-Override': 'PATCH'
  };
  if (versionId != null) {
    requestOptions.headers['If-Match'] = versionId;
  }
  mlutil.addTxidHeaders(requestOptions, txid);

  const operation = new Operation(
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
  const argLen = arguments.length;
  if (argLen < 1) {
    throw new Error('no partial query text or query with bindings');
  }

  let params   = null;
  let partial  = null;
  let query    = null;
  let bindings = null;
  let limit    = null;
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

  const wrapper = qb.makeSearchBody(query);

  const searchBody = wrapper.searchBody;
  const search = searchBody.search;
  if (search == null) {
    throw new Error('cannot get  document suggestions for empty search');
  }
  if (search.$query != null) {
    throw new Error('cannot get  document suggestions for Query By Example (QBE)');
  }

  let searchOptions = search.options;
  if (searchOptions == null) {
    searchOptions = {};
    search.options = searchOptions;
  }
  const searchConstraints = searchOptions.constraint;

  const hasBindings = (bindings != null);

  const suggestConstraints = hasBindings ? bindings.constraint : null;
  const sources = copyConstraints(suggestConstraints, searchConstraints);
  if (sources.length > 0) {
    searchOptions['suggestion-source'] = sources;
  }

  let term = hasBindings ? bindings.term : null;
  if (term == null) {
    term = searchOptions.term;
  }

  let termDefault = null;
  if (term != null) {
    termDefault = term.default;
    if (termDefault != null) {
      searchOptions['default-suggestion-source'] = termDefault;
    }
  }

  let endpoint = '/v1/suggest?partial-q='+encodeURIComponent(partial);
  if (limit != null) {
    endpoint += '&limit=' + limit;
  }

  const requestOptions = mlutil.newRequestOptions(this.client.getConnectionParams(), endpoint, 'POST');
  requestOptions.headers = {
      'Content-Type': 'application/json',
      'Accept':       'application/json',
  };
  mlutil.addTxidHeaders(requestOptions, wrapper.txid);

  const operation = new Operation(
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
 * @param {stream} stream - stream containing the input.
 * @param {object} [options] - Configures the write operation.
 * @param {function(progress, documents)} [onBatchSuccess] - A callback that can notify other systems about batches
 *  written successfully.
 * @param {function(progress, documents, error)} [onBatchError] - A callback that can notify other systems about batches
 *  failed to be written.
 * @param {function(summary)} [onCompletion] - A callback that receives a summary of the results.
 * @param {Integer} [batchSize] - The number of documents in each batch.
 * @param {object} [concurrentRequests] - JavaScript object literal that controls the maximum number of concurrent
 *  requests that can be pending at the same time. Valid keys are "multipleOf" and "multiplier".
 * @param {object} [defaultMetadata] - the metadata values applied to each document including collections,
 *  permissions, properties, quality, and metadataValues.
 * @param {string|mixed[]} [transform] - transformSpecification applied to each document.
 * @returns {stream.Writable} - a stream.Writable in object mode that receives document descriptor input from the
 *  application for writing to the database.
 */
Documents.prototype.writeAll = function writeAllDocuments(stream,options) {
  return writeAllDocumentsImpl.call(
      this, stream,options
  );
};
function writeAllDocumentsImpl(inputStream,jobOptions) {

  const path = '/v1/internal/forestinfo';
  const connectionParams = this.client.getConnectionParams();
  const requestOptions = mlutil.newRequestOptions(connectionParams, path, 'GET');

  requestOptions.headers = {
    'Accept':       'application/json',
  };

  const operation = new Operation(
      'read forestInfo', this.client, requestOptions, 'empty', 'single'
  );

  const jobState = {
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
         throw new Error('Invalid value for multipleOf. Value must be forests or hosts.');
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
      .catch((err) => jobState.stream.emit('error', err));

  return jobState.stream;
}

function finishWriter(jobState) {
  jobState.requesterCount--;
  if(jobState.requesterCount <= 0) {
    if(jobState.jobOptions.onCompletion){
      const summary = {
        docsWrittenSuccessfully: jobState.docsWrittenSuccessfully,
        docsFailedToBeWritten: jobState.docsFailedToBeWritten,
        timeElapsed: Date.now() - jobState.startTime
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
      const err =  new Error('Invalid value for multipleOf. Value must be forests or hosts.');
      jobState.error = err;
      jobState.stream.emit('error', err);
    }
  }
  jobState.startTime = Date.now();
  jobState.requesterCount =0;
  for (let i = 0; i < maxRequesters; i++) {
    jobState.requesterCount++;
    onWriteAllDocs(jobState,i);
  }
}

function onWriteAllDocs(jobState, writerId) {

  if(jobState.error){
    finishWriter(jobState);
    return;
  }
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
        if(jobState.error){
          finishWriter(jobState);
          return;
        }
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
            finishWriter(jobState);
          }
        }
      });
}

/**
 * The queryAll function reads one or more document uris from database using a passThrough stream and optional options.
 * The optional options include onCompletion, batchSize, queryBatchMultiple and consistentSnapshot.
 * @method documents#queryAll
 * @since 2.9.0
 * @param {ctsQuery} query - A query built by the ctsQueryBuilder.
 * @param {object} [options] - Configures the query operation.
 * @param {function(summary)} [onCompletion] - A callback that receives a summary of the results.
 * @param {Integer} [batchSize] - The number of documents in each batch.
 * @param {Integer} [queryBatchMultiple] - The number of batches each batch of document uris get divided into when
 *  writing back to the return stream.
 * @param {boolean|DatabaseClient.timestamp} [consistentSnapshot] - Controls whether to get an immutable view of the result set.
 *  Each request gets the latest data at the time of the request if not set/ false.
 *  Uses the timestamp of the first request for all subsequent requests if true.
 *  Uses the supplied timestamp for all requests if set to DatabaseClient.timestamp object.
 * @param {function(timestamp)} [onInitialTimestamp] - Receives the timestamp from the first request.
 *  Takes parameters of - Timestamp object for the server timestamp for the result set.
 *  Throws error if consistentSnapshot is not true.
 * @returns {stream.Readable} - a stream.Readable in object mode that sends document URI output read from the database
 *  to the application in string mode or (for arrays of strings) object mode.
 */
Documents.prototype.queryAll = function queryAllDocuments(query, options) {
  return queryAllDocumentsImpl.call(
      this, query, options
  );
};

function queryAllDocumentsImpl(query, jobOptions) {
   if(!query){
     throw new Error('Query cannot be null or undefined.');
   }
   if(query.queryType !== 'cts'){
     throw new Error('Query needs to be a cts query.');
   }

  const path = '/v1/internal/forestinfo';
  const requestOptions = mlutil.newRequestOptions(this.client.getConnectionParams(), path, 'POST');
  const wrapper = {ctsast: bldrbase.exportArg(query.whereClause)};

  requestOptions.headers = {
    'Accept':       'application/json',
    'Content-Type': 'application/json'
  };

  const operation = new Operation(
      'read forestInfo', this.client, requestOptions, 'single', 'single'
  );
  operation.requestBody = mlutil.marshal(wrapper, operation);
  const jobState = {
    docInstance : this,
    jobOptions: (jobOptions)? mlutil.copyProperties(jobOptions):{},
    urisReadSoFar: 0,
    urisFailedToBeRead: 0,
    forestDict: {},
    serverTimestamp: null
  };

  if(jobState.jobOptions.consistentSnapshot){
    if(typeof jobState.jobOptions.consistentSnapshot !== 'boolean' &&
        !(jobState.jobOptions.consistentSnapshot instanceof Boolean) &&
        !(jobState.jobOptions.consistentSnapshot instanceof mlutil.Timestamp)) {
      throw new Error('consistentSnapshot needs to be a boolean or DatabaseClient.Timestamp object.');
    }
  }
  if(jobState.jobOptions.onInitialTimestamp && jobState.jobOptions.consistentSnapshot !== true){
    throw new Error('consistentSnapshot needs to be true when onInitialTimestamp is provided.');
  }

  if(!jobState.jobOptions.batchSize || jobState.jobOptions.batchSize <= 0){
    jobState.jobOptions.batchSize = 1;
  }
  else if (jobState.jobOptions.batchSize > 100000){
    throw new Error('batchSize cannot be greater than 100000');
  }

  if(!jobState.jobOptions.queryBatchMultiple || jobState.jobOptions.queryBatchMultiple<=0){
    jobState.jobOptions.queryBatchMultiple = jobState.jobOptions.batchSize>1000? 1:
        (1000/jobState.jobOptions.batchSize);
  }
  else if((jobState.jobOptions.queryBatchMultiple *  jobState.jobOptions.batchSize) > 100000) {
    throw new Error('batchSize times queryBatchMultiple cannot be greater than 100000');
  }

  jobState.stream = (jobState.jobOptions.batchSize === 1)? new stream.PassThrough():
      new stream.PassThrough({objectMode: true});

  requester.startRequest(operation).result(mlutil.callbackOn(jobState, onQueryUrisRequest))
      .catch((err) => {
        jobState.stream.emit('error', err);
        jobState.requesterCount = 0;
        jobState.error = err;
        finishOnQueryAllDocs(jobState);
      });

  return jobState.stream;
}

function onQueryUrisRequest(output) {
  const jobState = this;
  const pageLength = (jobState.jobOptions.batchSize * jobState.jobOptions.queryBatchMultiple);
  const endpoint = '/v1/internal/uris?filtered=false&start=1&pageLength='+pageLength;
  jobState.query = output.query;
  jobState.forests = output.forests;
  jobState.requesterCount = output.forests.length;
  jobState.startTime = Date.now();
  jobState.endpoint = endpoint;
  if(jobState.jobOptions.queryToOptions){
    jobState.jobOptions.queryToOptions.output = output;
  }

  if(jobState.jobOptions.consistentSnapshot && (jobState.jobOptions.consistentSnapshot instanceof mlutil.Timestamp)){
    jobState.serverTimestamp = jobState.jobOptions.consistentSnapshot;
    spinForestRequests(jobState, 0);
  }
  else if(jobState.jobOptions.consistentSnapshot){

    jobState.forestDict[jobState.forests[0].name] = {};
    collectDocUris(jobState.forests[0].name, jobState);
  }
  else{
    spinForestRequests(jobState, 0);
  }
}

function spinForestRequests(jobState, initialization){
  for (let i=initialization; i < jobState.forests.length; i++) {
    jobState.forestDict[jobState.forests[i].name] = {};
    collectDocUris(jobState.forests[i].name, jobState);
  }
}

function onDocUrisCollected(output) {
  const jobValues= this;
  const jobState = jobValues.jobState;

  if(output) {
    const uriArr = output.uriArr;
    const afterUri = uriArr[uriArr.length-1];
    jobState.urisReadSoFar+=uriArr.length;

    if(jobState.jobOptions.batchSize > 1){
      const writeSize = jobState.jobOptions.batchSize;
      let i=0;
      while(i<uriArr.length){
        const writeBatchSize = (i+writeSize)<=uriArr.length? (i+writeSize):uriArr.length;
        jobState.stream.write(uriArr.slice(i, writeBatchSize));
        i = writeBatchSize;
      }
    }
    else {
      uriArr.forEach(item => jobState.stream.write(item));
    }
    jobState.forestDict[jobValues.forestName].AfterUri =  afterUri;

    collectDocUris(jobValues.forestName, jobState);
  }
  else {
    finishOnQueryAllDocs(jobValues.jobState);
  }
}

function collectDocUris(forestName, jobState){
  if(jobState.error){
    finishOnQueryAllDocs(jobState);
    return;
  }
  const connectionParams = jobState.docInstance.client.getConnectionParams();
  const requestOptions = mlutil.copyProperties(connectionParams);
  let forestEndpoint = jobState.endpoint+'&forest-name='+encodeURIComponent(forestName);
  requestOptions.method = 'POST';
  requestOptions.headers = {
    'Accept':       'text/uri-list',
    'Content-Type': 'application/json'
  };

  if(jobState.forestDict[forestName].AfterUri){
    forestEndpoint = forestEndpoint+'&after='+encodeURIComponent(jobState.forestDict[forestName].AfterUri);
  }

  const operation = new Operation(
      'read uris', jobState.docInstance.client, requestOptions, 'single', 'single'
  );

  operation.requestBody =  mlutil.marshal(jobState.query, operation);
  operation.validStatusCodes  = [200, 204, 404];
  operation.outputTransform = urisOutputTransform;

  if(jobState.serverTimestamp){
    forestEndpoint = forestEndpoint+'&timestamp='+encodeURIComponent(jobState.serverTimestamp.value);
    if(jobState.jobOptions.queryToOptions){
      jobState.jobOptions.queryToOptions.consistentSnapshot = jobState.serverTimestamp;
    }
  }
  else if(jobState.jobOptions.consistentSnapshot){
    operation.timestamp = new mlutil.Timestamp(null);
    operation.jobState = jobState;
  }
  requestOptions.path = mlutil.newRequestOptions(connectionParams, forestEndpoint).path;

  requester.startRequest(operation)
      .result(mlutil.callbackOn({jobState:jobState, forestName :forestName}, onDocUrisCollected))
      .catch((err) => {
        if(!jobState.error) {
          jobState.urisFailedToBeRead += jobState.jobOptions.batchSize;
          jobState.error = err;
          jobState.stream.emit('error', err);
        }
        finishOnQueryAllDocs(jobState);
      });
}


function finishOnQueryAllDocs(jobState){
  jobState.requesterCount--;
  if(jobState.requesterCount <= 0) {
    jobState.stream.end();

    if(jobState.jobOptions.onCompletion){
      const summary = {
        urisReadSoFar: jobState.urisReadSoFar,
        urisFailedToBeRead: jobState.urisFailedToBeRead,
        timeElapsed: Date.now() - jobState.startTime
      };

      if (jobState.error) {
        summary.error = jobState.error.toString();
      }
      if(jobState.serverTimestamp){
        const timestamp = (jobState.serverTimestamp.value.length>13) ?
            (+jobState.serverTimestamp.value.substr(0, 13)):
            jobState.serverTimestamp.value;
        summary.consistentSnapshotTimestamp = new Date(timestamp);
      }
      jobState.jobOptions.onCompletion(summary);
    }
  }
}

function urisOutputTransform(headers, data) {
 const operation = this;
  if (!data || (data.errorResponse != null)) {
    return data;
  }
  if(operation.jobState && operation.jobState.jobOptions.consistentSnapshot && !operation.jobState.serverTimestamp){
    operation.jobState.serverTimestamp = operation.timestamp;
    if(operation.jobState.jobOptions.onInitialTimestamp){
      operation.jobState.jobOptions.onInitialTimestamp(operation.jobState.serverTimestamp);
    }
    spinForestRequests(operation.jobState,1);
  }
  const uriArr = data.split('\r\n');
  const uris = {uriArr: uriArr.slice(0, uriArr.length-1)};
  return uris;
}

/**
 * The readAll function reads one or more document(s) from database using a duplex stream and optional options.
 * The optional options include onCompletion, batchSize, onBatchError, inputKind,
 *  concurrentRequests, categories, transform, onInitialTimestamp, outputStreamType and consistentSnapshot.
 * @method documents#readAll
 * @since 2.9.0
 * @param {stream} stream - stream containing the input uris.
 * @param {object} [options] - Configures the readAll operation.
 * @param {function(summary)} [onCompletion] - A callback that receives a summary of the results.
 * @param {function(progress, uris, error)} [onBatchError] - A callback that responds  to any error while reading a
 *  batch of documents. Takes progressSoFar, the uris of the batch failed and the error as parameters and controls the
 *  resolution by returning a replacement array, null/empty array or an error.
 * @param {string|array} [inputKind] - Indicates whether the input stream should accept individual strings or array of strings.
 * @param {Integer} [batchSize] - The number of documents in each request where the inputKind is 'string'
 * @param {object} [concurrentRequests] - JavaScript object literal that controls the maximum number of concurrent
 *  requests that can be pending at the same time. Valid keys are "multipleOf" and "multiplier".
 * @param {documents.categories|documents.categories[]}  [categories] - the categories of information
 *  to retrieve for the documents.
 * @param {string|mixed[]}  [transform] - the name of a transform extension to apply to each document
 *  or an array with the name of the transform extension and an object of parameter values; the
 *  transform must have been installed using the {@link transforms#write} function.
 * @param {boolean|DatabaseClient.timestamp} [consistentSnapshot] - Controls whether to get an immutable view of the result set.
 *  Each request gets the latest data at the time of the request if not set/ false.
 *  Uses the timestamp of the first request for all subsequent requests if true.
 *  Uses the supplied timestamp for all requests if set to DatabaseClient.timestamp object.
 * @param {function(timestamp)} [onInitialTimestamp] - Receives the timestamp from the first request.
 *  Takes parameters of - Timestamp object for the server timestamp for the result set.
 *  Throws error if consistentSnapshot is not true.
 * @param {chunked|object} [outputStreamType] - Controls whether data is written to the output stream as chunks or object.
 * @returns {stream.Duplex} - a stream.Duplex that receives document URI input from the application in string mode or
 *  object mode (for arrays of strings) and returns document descriptors with the content and/or document uri as output to
 *  the application in object mode.
 */
Documents.prototype.readAll = function readAllDocuments(stream, options) {

  return readAllDocumentsImpl.call(
      this, stream, options
  );
};

function readAllDocumentsImpl(inputStream, jobOptions) {

  const path = '/v1/internal/forestinfo';
  const requestOptions = mlutil.newRequestOptions(this.client.getConnectionParams(), path, 'GET');

  requestOptions.headers = {
    'Accept':       'application/json',
  };

  const operation = new Operation(
      'read forestInfo', this.client, requestOptions, 'empty', 'single'
  );

  const jobState = {
    docInstance : this,
    requesterCount: 0,
    docsReadSuccessfully:0,
    docsFailedToBeRead: 0,
    jobOptions: (jobOptions)? mlutil.copyProperties(jobOptions):{}
  };

  let readableObjectMode = null;
  let writableObjectMode = null;
  if(jobState.jobOptions.inputKind){
    writableObjectMode = jobState.jobOptions.inputKind.toString().toLowerCase();
    if (!new Set(['string', 'array']).has(writableObjectMode)) {
      throw new Error('Invalid value for inputKind. Value must be array or string.');
    }
  }
  jobState.inputStream = inputStream?inputStream:new stream.PassThrough({objectMode: true});

  if(jobState.jobOptions.outputStreamType){
    readableObjectMode = jobState.jobOptions.outputStreamType.toString().toLowerCase();
    if (!new Set(['chunked', 'object']).has(readableObjectMode)) {
      throw new Error('Invalid value for outputStreamType. Value must be chunked or object.');
    }
    jobState.outputStream = (readableObjectMode === 'chunked') ? new stream.PassThrough():
        new stream.PassThrough({objectMode: true});
  }
  else{
    jobState.outputStream = new stream.PassThrough({objectMode: true});
  }

  jobState.readableObjectMode = readableObjectMode;
  jobState.writableObjectMode = writableObjectMode;

  jobState.duplexStream = duplexify(jobState.inputStream, jobState.outputStream,
      {readableObjectMode:(readableObjectMode !== 'chunked'),
        writableObjectMode:(writableObjectMode !== 'string')});

  if(jobState.jobOptions.concurrentRequests) {
    const concurrentRequests = jobState.jobOptions.concurrentRequests;
    if (concurrentRequests.multipleOf) {
      if (!new Set(['forests', 'hosts']).has(String(concurrentRequests.multipleOf))) {
        throw new Error('Invalid value for multipleOf. Value must be forests or hosts.');
      }
    } else {
      concurrentRequests.multipleOf = 'forests';
    }

    if (concurrentRequests.multiplier && concurrentRequests.multiplier <= 0) {
      throw new Error('concurrentRequests.multiplier cannot be less than one');
    } else {
      concurrentRequests.multiplier = 8;
    }
    jobState.jobOptions.concurrentRequests = concurrentRequests;
  }
  else {
    jobState.jobOptions.concurrentRequests = {multipleOf:'forests', multiplier:8};
  }
  if(jobState.jobOptions.batchSize){
    if(writableObjectMode === 'array'){
      throw new Error('batchSize not expected when inputKind is array.');
    }
    if(jobState.jobOptions.batchSize <=0){
      throw new Error('Invalid batchSize. batchSize cannot be less than or equal to 0.');
    }
    else if(jobState.jobOptions.batchSize > 100000){
      throw new Error('Invalid batchSize. batchSize cannot be greater than 100000.');
    }
  } else {
    jobState.jobOptions.batchSize = 250;
  }

  if(jobState.jobOptions.outputStreamType){
    if(jobState.jobOptions.outputStreamType === 'chunked' && jobState.jobOptions.categories){
      throw new Error('categories not expected when outputStreamType is chunked.');
    }
  }
  if(jobState.jobOptions.consistentSnapshot){
    if(typeof jobState.jobOptions.consistentSnapshot !== 'boolean' &&
        !(jobState.jobOptions.consistentSnapshot instanceof Boolean) &&
        !(jobState.jobOptions.consistentSnapshot instanceof mlutil.Timestamp)){
      throw new Error('consistentSnapshot needs to be a boolean or DatabaseClient.Timestamp object');
    }
  }
  if(jobState.jobOptions.onInitialTimestamp && jobState.jobOptions.consistentSnapshot !== true){
    throw new Error('consistentSnapshot needs to be true when onInitialTimestamp is provided.');
  }
  if(jobState.jobOptions.output){
    setTimeout(()=>{
      onReadAllInit.call(jobState, jobState.jobOptions.output.forests);
    }, 1);
  }
  else {
    requester.startRequest(operation).result(mlutil.callbackOn(jobState, onReadAllInit))
        .catch((err) => {
          jobState.duplexStream.emit('error', err);
          jobState.requesterCount = 0;
          jobState.error = err;
          finishReader(jobState);
        });
  }
  return  jobState.duplexStream;
}

function onReadAllInit(output) {
  let maxRequesters = 0;
  const jobState = this;
  switch (jobState.jobOptions.concurrentRequests.multipleOf) {
    case 'hosts':
      maxRequesters = jobState.jobOptions.concurrentRequests.multiplier *
          new Set(output.map((forest) => forest.host)).size;
      break;
    default:
      maxRequesters = jobState.jobOptions.concurrentRequests.multiplier * output.length;
      break;
  }
  jobState.startTime = Date.now();
  jobState.maxRequesters = maxRequesters;
  jobState.requesterCount = 0;
  if(jobState.jobOptions.consistentSnapshot && !jobState.consistentSnapshotTimestamp){
    jobState.requesterCount++;
    onReadAllDocs(jobState,0);
  }
  else {
    spinReaderThreads(jobState,0);
  }
}

function spinReaderThreads(jobState, readerId){

  for(let i=readerId;i<jobState.maxRequesters; i++){
    jobState.requesterCount++;
    onReadAllDocs(jobState,i);
  }
}

function onReadAllDocs(jobState, readerId) {

  if(jobState.error){
    finishReader(jobState);
    return;
  }
  let readBatchArray = [];
  const batchSize = jobState.jobOptions.batchSize;
  jobState.lastBatch = false;
  jobState.retryCount = 100;

  if(jobState.writableObjectMode === 'array'){
    readBatchArray = jobState.inputStream.read();
    if(!readBatchArray){
      finishReader(jobState);
      return;
    }
  }
  else {
    a:
        for (let i = 0; i < batchSize; i++) {
          const uri = jobState.inputStream.read();
          if (uri === null) {
            switch (readBatchArray.length) {
              case 0: {
                finishReader(jobState);
                break a;
              }
              default: {
                jobState.lastBatch = true;
                break a;
              }
            }
          }
          readBatchArray.push(uri);
        }
  }
  if (readBatchArray && readBatchArray.length !== 0) {
    const batchdef = {uris: readBatchArray};
    if(jobState.jobOptions.transform){
      batchdef.transform = jobState.jobOptions.transform;
    }
    if(jobState.jobOptions.consistentSnapshot){
      if(typeof jobState.jobOptions.consistentSnapshot === 'boolean' || (jobState.jobOptions.consistentSnapshot instanceof Boolean)){
        batchdef.timestamp = jobState.consistentSnapshotTimestamp? jobState.consistentSnapshotTimestamp:new mlutil.Timestamp();
      }
      else {
        batchdef.timestamp = jobState.jobOptions.consistentSnapshot;
      }
    }
    if(jobState.jobOptions.categories){
      batchdef.categories = jobState.jobOptions.categories;
    }
    readDocs(jobState, false, batchdef,readBatchArray, readerId);
  }
}

function readDocs(jobState, val, batchdef, readBatchArray, readerId){
  if(jobState.error){
    finishReader(jobState);
    return;
  }
  const readDocumentsImplRequest = readDocumentsImpl.call(jobState.docInstance, val, [batchdef]);
  if(jobState.readableObjectMode === 'chunked'){
    readDocumentsImplRequest.stream('chunked')
        .on('error', function(err){
          readAllDocumentsErrorHandle(jobState, batchdef, readBatchArray, readerId, val, err);
        })
        .on('data', function(item){
          if(jobState.jobOptions.consistentSnapshot && !jobState.consistentSnapshotTimestamp){
            jobState.consistentSnapshotTimestamp = batchdef.timestamp;
            if(jobState.jobOptions.onInitialTimestamp){
              jobState.jobOptions.onInitialTimestamp(jobState.consistentSnapshotTimestamp);
            }
            spinReaderThreads(jobState,1);
          }
          jobState.outputStream.write(item);
        })
        .on('end', function(){
          if(jobState.jobOptions.consistentSnapshot && !jobState.consistentSnapshotTimestamp){
            jobState.consistentSnapshotTimestamp = batchdef.timestamp;
            if(jobState.jobOptions.onInitialTimestamp){
              jobState.jobOptions.onInitialTimestamp(jobState.consistentSnapshotTimestamp);
            }
            spinReaderThreads(jobState,1);
          }
          onReadAllDocs(jobState, readerId);
        });
  }
  else {
    readDocumentsImplRequest.result((output) => {
      if(jobState.jobOptions.consistentSnapshot && !jobState.consistentSnapshotTimestamp){
        jobState.consistentSnapshotTimestamp = batchdef.timestamp;
        if(jobState.jobOptions.onInitialTimestamp){
          jobState.jobOptions.onInitialTimestamp(jobState.consistentSnapshotTimestamp);
        }
        spinReaderThreads(jobState,1);
      }
      jobState.docsReadSuccessfully+= readBatchArray.length;
      output.forEach(item => {
        jobState.outputStream.write(item);
      });
      if(jobState.lastBatch){
        finishReader(jobState);
      }
      else {
        onReadAllDocs(jobState, readerId);
      }
    })
      .catch((err) => {
        readAllDocumentsErrorHandle(jobState, batchdef, readBatchArray, readerId, val, err);
      });
  }
}

function readAllDocumentsErrorHandle(jobState, batchdef, readBatchArray, readerId, val, err){
  if(jobState.error){
    finishReader(jobState);
    return;
  }
  let errorDisposition = err;
  if (jobState.jobOptions.onBatchError) {
    const progressSoFar = {
      docsReadSuccessfully: jobState.docsReadSuccessfully,
      docsFailedToBeRead: readBatchArray.length,
      timeElapsed: (Date.now()-jobState.startTime)
    };
    const documents = readBatchArray;
    try {
      errorDisposition = jobState.jobOptions.onBatchError(progressSoFar, documents, err);
    } catch(err){
      errorDisposition = err;
    }
    if(errorDisposition instanceof Error){
      jobState.docsFailedToBeRead += readBatchArray.length;
      jobState.error = errorDisposition;
      jobState.outputStream.emit('error', errorDisposition);
      finishReader(jobState);
    } else if(errorDisposition === null ||
        (Array.isArray(errorDisposition) && errorDisposition.length === 0)) {
      jobState.docsFailedToBeRead += readBatchArray.length;
      onReadAllDocs(jobState, readerId);
    } else if(Array.isArray(errorDisposition)){
      batchdef = {uris: errorDisposition};
      readDocs(jobState, val, batchdef, errorDisposition, readerId);
      return;
    } else {
      const onBatchErrorFailure = new Error('onBatchError should return null, empty array or a replacement array.');
      jobState.error = onBatchErrorFailure;
      jobState.outputStream.emit('error', onBatchErrorFailure);
      finishReader(jobState);
    }
  }

  switch(jobState.retryCount){
    case 0: {
      jobState.docsFailedToBeRead += readBatchArray.length;
      jobState.error = new Error('RetryCount exceeded.');
      jobState.outputStream.emit('error', jobState.error);
      finishReader(jobState);
      break;
    }
    default: {
      jobState.retryCount--;
      readDocs(jobState, val, batchdef,readBatchArray, readerId);
      break;
    }
  }
}

function finishReader(jobState) {
  jobState.requesterCount--;
  if(jobState.requesterCount === 0) {
    jobState.outputStream.end();
    if(jobState.jobOptions.onCompletion){
      const summary = {
        docsReadSuccessfully: jobState.docsReadSuccessfully,
        docsFailedToBeRead: jobState.docsFailedToBeRead,
        timeElapsed: Date.now() - jobState.startTime
      };
      if (jobState.error) {
        summary.error = jobState.error.toString();
      }
      if(jobState.consistentSnapshotTimestamp){
        const timestamp = (jobState.consistentSnapshotTimestamp.value.length>13) ?
            (+jobState.consistentSnapshotTimestamp.value.substr(0, 13)):
            jobState.consistentSnapshotTimestamp.value;
        summary.consistentSnapshotTimestamp = new Date(timestamp);
      }
      jobState.jobOptions.onCompletion(summary);
    }
  }
}

/**
 * The queryToReadAll function is a convenience function that combines the queryAll and readAll operations.
 * @method documents#queryToReadAll
 * @since 2.9.0
 * @param {ctsQuery} query - A query built by the ctsQueryBuilder.
 * @param {object} [options] - Configures the queryToReadAll operation.
 * @param {function(summary)} [onCompletion] - A callback that receives a summary of the results.
 * @param {function(progress, uris, error)} [onBatchError] - A callback that responds  to any error while reading a
 *  batch of documents. Takes progressSoFar, the uris of the batch failed and the error as parameters and controls the
 *  resolution by returning a replacement array, null/empty array or an error.
 * @param {string|array} [inputKind] - Indicates whether the input stream of readAll should accept individual strings or array of strings.
 * @param {Integer} [batchSize] - The number of documents in each batch.
 * @param {Integer} [queryBatchMultiple] - The number of batches each batch of document uris get divided into when
 *  writing back to the return stream in queryAll.
 * @param {object} [concurrentRequests] - JavaScript object literal that controls the maximum number of concurrent
 *  requests that can be pending at the same time. Valid keys are "multipleOf" and "multiplier".
 * @param {documents.categories|documents.categories[]}  [categories] - the categories of information
 *  to retrieve for the documents.
 * @param {string|mixed[]}  [transform] - the name of a transform extension to apply to each document
 *  or an array with the name of the transform extension and an object of parameter values; the
 *  transform must have been installed using the {@link transforms#write} function.
 * @param {boolean|DatabaseClient.timestamp} [consistentSnapshot] - Controls whether to get an immutable view of the result set.
 *  Each request gets the latest data at the time of the request if not set/ false.
 *  Uses the timestamp of the first request for all subsequent requests if true.
 *  Uses the supplied timestamp for all requests if set to DatabaseClient.timestamp object.
 * @param {function(timestamp)} [onInitialTimestamp] - Receives the timestamp from the first request.
 *  Takes parameters of - Timestamp object for the server timestamp for the result set.
 *  Throws error if consistentSnapshot is not true.
 * @param {chunked|object} [outputStreamType] - Controls whether data is written to the output stream as chunks or object.
 * @returns {stream.Readable} - a stream.Readable in object mode that returns document descriptors with the content
 *  and/or document uri as output to the application in object mode.
 */
Documents.prototype.queryToReadAll = function queryToReadAllDocuments(query, options) {
  return queryToReadAllDocumentsImpl.call(
      this, query, options
  );
};

function queryToReadAllDocumentsImpl(query,jobOptions){
  const queryAllJobOptions = {};
  const readAllJobOptions = {};

  if(!jobOptions){
    jobOptions = {};
  }

  queryAllJobOptions.batchSize = (jobOptions.batchSize) ? jobOptions.batchSize : 250;

  if(queryAllJobOptions.batchSize > 1){
    readAllJobOptions.inputKind = 'array';
  } else {
    readAllJobOptions.batchSize = queryAllJobOptions.batchSize;
  }

  if(jobOptions.queryBatchMultiple) {
    queryAllJobOptions.queryBatchMultiple = jobOptions.queryBatchMultiple;
  }

  if (jobOptions.consistentSnapshot) {
    queryAllJobOptions.consistentSnapshot = jobOptions.consistentSnapshot;
  }

  if(jobOptions.onInitialTimestamp){
    queryAllJobOptions.onInitialTimestamp = jobOptions.onInitialTimestamp;
  }

  if (jobOptions.onCompletion) {
    readAllJobOptions.onCompletion = jobOptions.onCompletion;
  }
  if (jobOptions.onBatchError) {
    readAllJobOptions.onBatchError = jobOptions.onBatchError;
  }
  if (jobOptions.concurrentRequests) {
    readAllJobOptions.concurrentRequests = jobOptions.concurrentRequests;
  }
  if(jobOptions.categories){
    readAllJobOptions.categories = jobOptions.categories;
  }
  if(jobOptions.transform){
    readAllJobOptions.transform = jobOptions.transform;
  }
  if(jobOptions.outputStreamType){
    readAllJobOptions.outputStreamType = jobOptions.outputStreamType;
  }
  queryAllJobOptions.queryToOptions = readAllJobOptions;

  const docInstance = this;
  const queryAllStream = queryAllDocumentsImpl.call(docInstance, query, queryAllJobOptions);
  const queryToReadAllResultStream = new stream.PassThrough({objectMode: true});
  let pipelined = false;

  queryAllStream.on('error', function(err){
    queryToReadAllResultStream.emit(err);
  });

  queryAllStream.on('data', function(item){
    if(!pipelined) {
      pipelined = true;

      const readAllStream = readAllDocumentsImpl.call(docInstance,null, readAllJobOptions);
      readAllStream.on('error', function(err){
        queryToReadAllResultStream.emit(err);
      });

      readAllStream.write(item);
      queryAllStream.pipe(readAllStream).pipe(queryToReadAllResultStream);
    }
  });

  queryAllStream.on('end', function(item){
    if(!pipelined){
      queryToReadAllResultStream.end();
    }
  });

  return queryToReadAllResultStream;
}


/** @ignore */
function copyConstraints(suggestConstraints, searchConstraints) {
  const destination = [];

  const bindLen = Array.isArray(suggestConstraints) ? suggestConstraints.length : 0;

  let constraint = null;

  let i    = 0;
  let copy = null;
  let keys = null;
  let key  = null;
  let j    = 0;

  let overrides = null;
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

  let isCopyKey = null;
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

/**
 * The transformAll function applies a transform to a set of documents that are already in the database.
 * The transform used to configure the documents must be installed on the server beforehand.
 * The options include onCompletion, batchSize, onBatchError, inputKind, concurrentRequests,  transform, onBatchSuccess
 *   and transformStrategy.
 * @method documents#transformAll
 * @since 3.0.0
 * @param {stream} stream - stream containing the input.
 * @param {object} [options] - Configures the transformAll operation.
 * @param {function(summary)} [onCompletion] - A callback that receives a summary of the results.
 * @param {function(progress, uris, error)} [onBatchError] - A callback that responds  to any error while transforming a
 *  batch/array of documents. Takes progressSoFar, the uris of the batch failed and the error as parameters and controls
 *  the resolution by returning a replacement array, null/empty array or an error.
 * @param {string|array} [inputKind] - Indicates whether the input stream should accept individual strings or array of
 *  strings.
 * @param {Integer} [batchSize] - The number of documents in each request where the inputKind is 'string'.
 * @param {object} [concurrentRequests] - JavaScript object literal that controls the maximum number of concurrent
 *  requests that can be pending at the same time. Valid keys are "multipleOf" and "multiplier".
 * @param {string|mixed[]}  [transform] - the name of a transform extension to apply to each document or an array
 *   with the name of the transform extension and an object of parameter values; the transform must have been
 *   installed using the {@link transforms#write} function.
 * @param {replace|ignore} [transformStrategy] - Controls whether the output from the transform replaces the content at
 *  the document URI. The ignore strategy allows the transform to persist output in the database without changing
 *  the original document.
 * @param {function(progress, documents)} [onBatchSuccess] - A callback that can notify other systems about batches
 *  transformed successfully.
 * @returns {stream.Writable} - returns a writable stream that takes the document uris of the database documents to be
 *  transformed.
 */
Documents.prototype.transformAll = function transformAllDocuments(stream, options) {
  return transformAllDocumentsImpl.call(
      this, stream, options
  );
};

function transformAllDocumentsImpl(inputStream, jobOptions){
  const path = '/v1/internal/forestinfo';
  const requestOptions = mlutil.newRequestOptions(this.client.getConnectionParams(), path, 'GET');

  requestOptions.headers = {
    'Accept':       'application/json',
  };

  const operation = new Operation(
      'read forestInfo', this.client, requestOptions, 'empty', 'single'
  );

  const jobState = {
    docInstance : this,
    requesterCount: 0,
    docsTransformedSuccessfully:0,
    docsFailedToBeTransformed: 0,
    jobOptions: (jobOptions)? mlutil.copyProperties(jobOptions):{}
  };
  jobState.stream = inputStream?inputStream:new stream.PassThrough({objectMode: true});
  if(!jobState.jobOptions.transform){
    throw new Error('transform name needed while using transformAll api');
  }

  if(jobState.jobOptions.inputKind){
    const inputKindValue = jobState.jobOptions.inputKind.toString().toLowerCase();
    if (!new Set(['string', 'array']).has(inputKindValue)) {
      throw new Error('Invalid value for inputKind. Value must be array or string.');
    }
    if(inputKindValue === 'array' && jobState.jobOptions.batchSize){
      throw new Error('batchSize not expected when inputKind is array.');
    }
    jobState.inputKindValue = inputKindValue;
  }
  else {
    jobState.inputKindValue = 'string';
  }

  if(jobState.jobOptions.concurrentRequests) {
    const concurrentRequests = jobState.jobOptions.concurrentRequests;
    if (concurrentRequests.multipleOf) {
      if (!new Set(['forests', 'hosts']).has(String(concurrentRequests.multipleOf))) {
        throw new Error('Invalid value for multipleOf. Value must be forests or hosts.');
      }
    } else {
      concurrentRequests.multipleOf = 'forests';
    }

    if (concurrentRequests.multiplier && concurrentRequests.multiplier <= 0) {
      throw new Error('concurrentRequests.multiplier cannot be less than one');
    } else {
      concurrentRequests.multiplier = 8;
    }
    jobState.jobOptions.concurrentRequests = concurrentRequests;
  }
  else {
    jobState.jobOptions.concurrentRequests = {multipleOf:'forests', multiplier:8};
  }

  if(jobState.jobOptions.batchSize){

    if(jobState.jobOptions.batchSize <=0){
      throw new Error('Invalid batchSize. batchSize cannot be less than or equal to 0.');
    }
    else if(jobState.jobOptions.batchSize > 100000){
      throw new Error('Invalid batchSize. batchSize cannot be greater than 100000.');
    }
  } else {
    jobState.jobOptions.batchSize = 100;
  }

  if(jobState.jobOptions.transformStrategy){
    jobState.jobOptions.transformStrategy = String(jobState.jobOptions.transformStrategy).toLowerCase();
    if (!new Set(['replace', 'ignore']).has(jobState.jobOptions.transformStrategy)) {
      throw new Error('Invalid value for transformStrategy. Value must be replace or ignore.');
    }
  } else {
    jobState.jobOptions.transformStrategy = 'replace';
  }

  requester.startRequest(operation).result(mlutil.callbackOn(jobState, onTransformAllInit))
      .catch((err) => {
        jobState.stream.emit('error', err);
        jobState.requesterCount = 0;
        jobState.error = err;
        finishTransformAll(jobState);
      });

  return jobState.stream;
}

function onTransformAllInit(output) {
  const jobState = this;

  let endpoint = '/v1/internal/apply-transform?result='+encodeURIComponent(jobState.jobOptions.transformStrategy)+
      '&transform='+jobState.jobOptions.transform[0];
  if(jobState.jobOptions.transform.length >1){
    const transformParams = jobState.jobOptions.transform[1];
    for(const paramName of Object.keys(transformParams)){
      const paramValue = transformParams[paramName];
      endpoint+= '&'+encodeURIComponent('trans:'+paramName)+'='+encodeURIComponent(paramValue);
    }
  }

  jobState.endpoint = endpoint;

  const requestOptions = mlutil.newRequestOptions(jobState.docInstance.client.getConnectionParams(), jobState.endpoint, 'POST');
  requestOptions.headers = {
    'Accept':       'text/uri-list',
    'Content-Type': 'text/uri-list'
  };

  jobState.requestOptions = requestOptions;

  let maxRequesters = 0;

  if(jobState.jobOptions.concurrentRequests.multipleOf === 'forests') {
    maxRequesters = jobState.jobOptions.concurrentRequests.multiplier * output.length;
  } else {
    maxRequesters = jobState.jobOptions.concurrentRequests.multiplier *
        new Set(output.map((forest) => forest.host)).size;
  }

  jobState.requesterCount = 0;
  jobState.startTime = Date.now();

  for (let i = 0; i < maxRequesters; i++) {
    jobState.requesterCount++;
    onTransformAllDocs(jobState,i);
  }
}

function onTransformAllDocs(jobState, writerId) {

  if(jobState.error){
    finishTransformAll(jobState);
    return;
  }
  let transformBatchArray = [];
  const batchSize = jobState.jobOptions.batchSize;
  jobState.lastBatch = false;
  jobState.retryCount = 2;

  if(jobState.inputKindValue === 'array'){
    transformBatchArray = jobState.stream.read();
    if(!transformBatchArray){
      finishTransformAll(jobState);
      return;
    }
  }
  else {
    a:
        for (let i = 0; i < batchSize; i++) {
          const uri = jobState.stream.read();
          if (uri === null) {
            switch (transformBatchArray.length) {
              case 0: {
                finishTransformAll(jobState);
                return;
              }
              default: {
                jobState.lastBatch = true;
                break a;
              }
            }
          }
          transformBatchArray.push(uri);
        }
  }
  if (transformBatchArray.length !== 0) {
    transformDocs(jobState, transformBatchArray, writerId);
  }
}

function transformDocs(jobState, transformBatchArray, writerId){

  const operation = new Operation(
      'transform docs', jobState.docInstance.client, jobState.requestOptions, 'single', 'single'
  );
  operation.validStatusCodes  = [200, 201];
  operation.requestBody = transformBatchArray.join('\n');

  requester.startRequest(operation)
      .result((output) => {
        if(!output || output instanceof Error){
          throw new Error('Invalid Request');
        }
        jobState.docsTransformedSuccessfully+= transformBatchArray.length;
        if (jobState.jobOptions.onBatchSuccess) {
          const progressSoFar = {
            docsTransformedSuccessfully: jobState.docsTransformedSuccessfully,
            docsFailedToBeTransformed: jobState.docsFailedToBeTransformed,
            timeElapsed: (Date.now()-jobState.startTime)
          };
          const documents = transformBatchArray;
          jobState.jobOptions.onBatchSuccess(progressSoFar, documents);
        }
        if(jobState.lastBatch){
          jobState.timeElapsed = Date.now() - jobState.startTime;
          finishTransformAll(jobState);
        }
        else {
          onTransformAllDocs(jobState, writerId);
        }
      })
      .catch((err) => {
        if(jobState.error){
          finishTransformAll(jobState);
          return;
        }
        let errorDisposition = err;
        if (jobState.jobOptions.onBatchError) {
          const progressSoFar = {
            docsTransformedSuccessfully: jobState.docsTransformedSuccessfully,
            docsFailedToBeTransformed: transformBatchArray.length,
            timeElapsed: (Date.now()-jobState.startTime)
          };
          try {
            errorDisposition = jobState.jobOptions.onBatchError(progressSoFar, transformBatchArray, err);
          } catch(err){
            errorDisposition = err;
          }
        }

        if(errorDisposition instanceof Error){
          jobState.docsFailedToBeTransformed += transformBatchArray.length;
          jobState.error = errorDisposition;
          jobState.stream.emit('error', errorDisposition);
          finishTransformAll(jobState);
          return;
        } else if(errorDisposition === null ||
            (Array.isArray(errorDisposition) && errorDisposition.length === 0)) {
          jobState.docsFailedToBeTransformed+= transformBatchArray.length;
          onTransformAllDocs(jobState, writerId);
          return;
        } else if(Array.isArray(errorDisposition)){
          transformDocs(jobState, errorDisposition, writerId);
          return;
        } else {
          const onBatchErrorFailure = new Error('onBatchError should return null, empty array or a replacement array.');
          jobState.error = onBatchErrorFailure;
          jobState.stream.emit('error', onBatchErrorFailure);
          finishTransformAll(jobState);
        }
        switch(jobState.retryCount){
          case 2:
          case 1: {
            jobState.retryCount--;
            transformBatchArray = errorDisposition;
            transformDocs(jobState, transformBatchArray, writerId);
            break;
          }
          default: {
            jobState.docsFailedToBeTransformed += transformBatchArray.length;
            jobState.error = err;
            jobState.stream.emit('error', err);
            jobState.requesterCount = 0;
            finishTransformAll(jobState);
          }
        }
      });
}

function finishTransformAll(jobState) {
  jobState.requesterCount--;
  if(jobState.requesterCount <= 0) {
    if(jobState.jobOptions.onCompletion){
      const summary = {
        docsTransformedSuccessfully: jobState.docsTransformedSuccessfully,
        docsFailedToBeTransformed: jobState.docsFailedToBeTransformed,
        timeElapsed: Date.now() - jobState.startTime
      };
      if (jobState.error) {
        summary.error = jobState.error.toString();
      }
      jobState.jobOptions.onCompletion(summary);
    }
  }
}

/**
 * The queryToTransformAll is a convenience function that combines the queryAll and transformAll operations.
 * The transform used to configure the documents must be installed on the server beforehand.
 * @method documents#queryToTransformAll
 * @since 3.0.0
 * @param {ctsQuery} query - A query built by the ctsQueryBuilder.
 * @param {object} [options] - Configures the queryToTransformAll operation.
 * @param {boolean|DatabaseClient.timestamp} [consistentSnapshot] - Controls whether to get an immutable view of the result set.
 *  Each request gets the latest data at the time of the request if not set/ false.
 *  Uses the timestamp of the first request for all subsequent requests if true.
 *  Uses the supplied timestamp for all requests if set to DatabaseClient.timestamp object.
 * @param {function(timestamp)} [onInitialTimestamp] - Receives the timestamp from the first request.
 *  Takes parameters of - Timestamp object for the server timestamp for the result set.
 *  Throws error if consistentSnapshot is not true.
 * @param {Integer} [queryBatchMultiple] - The number of batches each batch of document uris get divided into when
 *  writing back to the return stream in queryAll.
 * @param {function(summary)} [onCompletion] - A callback that receives a summary of the results.
 * @param {function(progress, uris, error)} [onBatchError] - A callback that responds to any error while transforming a
 *  batch/array of documents. Takes progressSoFar, the uris of the batch failed and the error as parameters and controls
 *  the resolution by returning a replacement array, null/empty array or an error.
 * @param {string|array} [inputKind] - Indicates whether the input stream should accept individual strings or array of
 *  strings.
 * @param {Integer} [batchSize] - The number of documents in each request where the inputKind is 'string'.
 * @param {object} [concurrentRequests] - JavaScript object literal that controls the maximum number of concurrent
 *  requests that can be pending at the same time. Valid keys are "multipleOf" and "multiplier".
 * @param {string|mixed[]}  [transform] - The name of a transform extension to apply to each document or an array
 *   with the name of the transform extension and an object of parameter values; the transform must have been
 *   installed using the {@link transforms#write} function.
 * @param {replace|ignore} [transformStrategy] - Controls whether the output from the transform replaces the content at
 *  the document URI. The ignore strategy allows the transform to persist output in the database without changing
 *  the original document.
 * @param {function(progress, documents)} [onBatchSuccess] - A callback that can notify other systems about batches
 *  transformed successfully.
 */
Documents.prototype.queryToTransformAll = function queryToTransformAllDocuments(query, options) {
  return queryToTransformAllDocumentsImpl.call(
      this, query, options
  );
};

function queryToTransformAllDocumentsImpl(query, jobOptions){
  const queryAllJobOptions = {};
  const transformAllJobOptions = {};

  if(!jobOptions){
    jobOptions = {};
  }
  queryAllJobOptions.batchSize = (jobOptions.batchSize) ? jobOptions.batchSize : 250;

  if(queryAllJobOptions.batchSize > 1){
    transformAllJobOptions.inputKind = 'array';
  } else {
    transformAllJobOptions.batchSize = queryAllJobOptions.batchSize;
  }

  if(jobOptions.queryBatchMultiple) {
    queryAllJobOptions.queryBatchMultiple = jobOptions.queryBatchMultiple;
  }

  if (jobOptions.consistentSnapshot) {
    queryAllJobOptions.consistentSnapshot = jobOptions.consistentSnapshot;
  }

  if(jobOptions.onInitialTimestamp){
    queryAllJobOptions.onInitialTimestamp = jobOptions.onInitialTimestamp;
  }

  if (jobOptions.onCompletion) {
    transformAllJobOptions.onCompletion = jobOptions.onCompletion;
  }
  if (jobOptions.onBatchError) {
    transformAllJobOptions.onBatchError = jobOptions.onBatchError;
  }
  if (jobOptions.concurrentRequests) {
    transformAllJobOptions.concurrentRequests = jobOptions.concurrentRequests;
  }
  if(jobOptions.transform){
    transformAllJobOptions.transform = jobOptions.transform;
  }
  if(jobOptions.transformStrategy){
    transformAllJobOptions.transformStrategy = jobOptions.transformStrategy;
  }
  if(jobOptions.onBatchSuccess){
    transformAllJobOptions.onBatchSuccess = jobOptions.onBatchSuccess;
  }

  queryAllJobOptions.queryToOptions = transformAllJobOptions;

  const docInstance = this;
  const queryAllStream = queryAllDocumentsImpl.call(docInstance, query, queryAllJobOptions);
  let pipelined = false;

  queryAllStream.on('data', function(item){
    if(!pipelined) {
      pipelined = true;
      const transformAllStream = transformAllDocumentsImpl.call(docInstance,null, transformAllJobOptions);

      queryAllStream.on('error', function(err){
        transformAllStream.emit(err);
      });
      transformAllStream.write(item);
      queryAllStream.pipe(transformAllStream);
    }
  });
}

/**
 * The removeAllUris function deletes a set of documents from the database.
 * @method documents#removeAllUris
 * @since 3.0.0
 * @param {stream} stream - stream containing the input uris.
 * @param {object} [options] - Configures the removeAllUris operation.
 * @param {function(summary)} [onCompletion] - A callback that receives a summary of the results.
 * @param {function(progress, uris, error)} [onBatchError] - A callback that responds  to any error while transforming a
 *  batch/array of documents. Takes progressSoFar, the uris of the batch failed and the error as parameters and controls
 *  the resolution by returning a replacement array, null/empty array or an error.
 * @param {string|array} [inputKind] - Indicates whether the input stream should accept individual strings or array of
 *  strings.
 * @param {Integer} [batchSize] - The number of documents in each request where the inputKind is 'string'.
 * @param {object} [concurrentRequests] - JavaScript object literal that controls the maximum number of concurrent
 *  requests that can be pending at the same time. Valid keys are "multipleOf" and "multiplier".
 * @param {function(progress, documents)} [onBatchSuccess] - A callback that can notify other systems about batches
 *  transformed successfully.
 * @returns {stream.Writable} - a stream.Writable that receives document URI input from the application in string mode
 *  or (for arrays of strings) object mode.
 */
Documents.prototype.removeAllUris = function removeAllUrisDocuments(stream, options) {
  return removeAllUrisDocumentsImpl.call(
      this, stream, options
  );
};

function removeAllUrisDocumentsImpl(inputStream, jobOptions){
  const path = '/v1/internal/forestinfo';
  const requestOptions = mlutil.newRequestOptions(this.client.getConnectionParams(), path, 'GET');

  requestOptions.headers = {
    'Accept':       'application/json',
  };

  const operation = new Operation(
      'read forestInfo', this.client, requestOptions, 'empty', 'single'
  );

  const jobState = {
    docInstance : this,
    requesterCount: 0,
    docsRemovedSuccessfully:0,
    docsFailedToBeRemoved: 0,
    jobOptions: (jobOptions)? mlutil.copyProperties(jobOptions):{}
  };
  jobState.stream = inputStream?inputStream:new stream.PassThrough({objectMode: true});
  if(jobState.jobOptions.inputKind){
    const inputKindValue = jobState.jobOptions.inputKind.toString().toLowerCase();
    if (!new Set(['string', 'array']).has(inputKindValue)) {
      throw new Error('Invalid value for inputKind. Value must be array or string.');
    }
    if(inputKindValue === 'array' && jobState.jobOptions.batchSize){
      throw new Error('batchSize not expected when inputKind is array.');
    }
    jobState.inputKindValue = inputKindValue;
  }
  else {
    jobState.inputKindValue = 'string';
  }

  if(jobState.jobOptions.concurrentRequests) {
    const concurrentRequests = jobState.jobOptions.concurrentRequests;
    if (concurrentRequests.multipleOf) {
      if (!new Set(['forests', 'hosts']).has(String(concurrentRequests.multipleOf))) {
        throw new Error('Invalid value for multipleOf. Value must be forests or hosts.');
      }
    } else {
      concurrentRequests.multipleOf = 'forests';
    }

    if (concurrentRequests.multiplier && concurrentRequests.multiplier <= 0) {
      throw new Error('concurrentRequests.multiplier cannot be less than one');
    } else {
      concurrentRequests.multiplier = 8;
    }
    jobState.jobOptions.concurrentRequests = concurrentRequests;
  }
  else {
    jobState.jobOptions.concurrentRequests = {multipleOf:'forests', multiplier:8};
  }

  if(jobState.jobOptions.batchSize){

    if(jobState.jobOptions.batchSize <=0){
      throw new Error('Invalid batchSize. batchSize cannot be less than or equal to 0.');
    }
    else if(jobState.jobOptions.batchSize > 100000){
      throw new Error('Invalid batchSize. batchSize cannot be greater than 100000.');
    }
  } else {
    jobState.jobOptions.batchSize = 250;
  }

  requester.startRequest(operation).result(mlutil.callbackOn(jobState, onRemoveAllUrisInit))
      .catch((err) => {
        jobState.stream.emit('error', err);
        jobState.requesterCount = 0;
        jobState.error = err;
        finishRemoveAllUris(jobState);
      });


  return jobState.stream;
}

function onRemoveAllUrisInit(output) {
  const jobState = this;
  let maxRequesters = 0;

  if(jobState.jobOptions.concurrentRequests.multipleOf === 'forests') {
    maxRequesters = jobState.jobOptions.concurrentRequests.multiplier * output.length;
  } else {
    maxRequesters = jobState.jobOptions.concurrentRequests.multiplier *
        new Set(output.map((forest) => forest.host)).size;
  }

  jobState.requesterCount = 0;
  jobState.startTime = Date.now();

  for (let i = 0; i < maxRequesters; i++) {
    jobState.requesterCount++;
    onRemoveAllUrisDocs(jobState,i);
  }
}

function onRemoveAllUrisDocs(jobState, writerId) {

  if(jobState.error){
    finishRemoveAllUris(jobState);
    return;
  }
  let removeBatchArray = [];
  const batchSize = jobState.jobOptions.batchSize;
  jobState.lastBatch = false;
  jobState.retryCount = 2;

  if(jobState.inputKindValue === 'array'){
    removeBatchArray = jobState.stream.read();
    if(!removeBatchArray){
      finishRemoveAllUris(jobState);
      return;
    }
  }
  else {
    a:
        for (let i = 0; i < batchSize; i++) {
          const uri = jobState.stream.read();
          if (uri === null) {
            switch (removeBatchArray.length) {
              case 0: {
                finishRemoveAllUris(jobState);
                return;
              }
              default: {
                jobState.lastBatch = true;
                break a;
              }
            }
          }
          removeBatchArray.push(uri);
        }
  }
  if (removeBatchArray.length !== 0) {
    removeDocs(jobState, removeBatchArray, writerId);
  }
}

function finishRemoveAllUris(jobState) {
  jobState.requesterCount--;
  if(jobState.requesterCount <= 0) {
    if(jobState.jobOptions.onCompletion){
      const summary = {
        docsRemovedSuccessfully: jobState.docsRemovedSuccessfully,
        docsFailedToBeRemoved: jobState.docsFailedToBeRemoved,
        timeElapsed: Date.now() - jobState.startTime
      };
      if (jobState.error) {
        summary.error = jobState.error.toString();
      }
      jobState.jobOptions.onCompletion(summary);
    }
  }
}

function removeDocs(jobState, removeBatchArray, writerId){
  const batchdef = {uris:removeBatchArray};
  removeDocumentImpl.call(jobState.docInstance, false, [batchdef])
      .result((output) => {
        jobState.docsRemovedSuccessfully+= removeBatchArray.length;
        if (jobState.jobOptions.onBatchSuccess) {
          const progressSoFar = {
            docsRemovedSuccessfully: jobState.docsRemovedSuccessfully,
            docsFailedToBeRemoved: jobState.docsFailedToBeRemoved,
            timeElapsed: (Date.now()-jobState.startTime)
          };
          const documents = removeBatchArray;
          jobState.jobOptions.onBatchSuccess(progressSoFar, documents);
        }
        if(jobState.lastBatch){
          jobState.timeElapsed = Date.now() - jobState.startTime;
          finishRemoveAllUris(jobState);
        }
        else {
          onRemoveAllUrisDocs(jobState, writerId);
        }
      })
      .catch((err) => {
        if(jobState.error){
          finishRemoveAllUris(jobState);
          return;
        }
        let errorDisposition = err;
        if (jobState.jobOptions.onBatchError) {
          const progressSoFar = {
            docsRemovedSuccessfully: jobState.docsRemovedSuccessfully,
            docsFailedToBeRemoved: removeBatchArray.length,
            timeElapsed: (Date.now()-jobState.startTime)
          };
          const documents = removeBatchArray;
          try {
            errorDisposition = jobState.jobOptions.onBatchError(progressSoFar, documents, err);
          } catch(err){
            errorDisposition = err;
          }
        }

        if(errorDisposition instanceof Error){
          jobState.docsFailedToBeRemoved += removeBatchArray.length;
          jobState.error = errorDisposition;
          jobState.stream.emit('error', errorDisposition);
          finishRemoveAllUris(jobState);
          return;
        } else if(errorDisposition === null ||
            (Array.isArray(errorDisposition) && errorDisposition.length === 0)) {
          jobState.docsFailedToBeRemoved += removeBatchArray.length;
          onRemoveAllUrisDocs(jobState, writerId);
        } else if(Array.isArray(errorDisposition)){
          removeDocs(jobState, errorDisposition, writerId);
          return;
        } else {
          const onBatchErrorFailure = new Error('onBatchError should return null, empty array or a replacement array.');
          jobState.docsFailedToBeRemoved += removeBatchArray.length;
          jobState.error = onBatchErrorFailure;
          jobState.stream.emit('error', onBatchErrorFailure);
          finishRemoveAllUris(jobState);
        }

        switch(jobState.retryCount){
          case 2:
          case 1: {
            jobState.retryCount--;
            removeDocs(jobState, removeBatchArray, writerId);
            break;
          }
          default: {
            jobState.docsFailedToBeRemoved += removeBatchArray.length;
            jobState.error = err;
            jobState.stream.emit('error', err);
            jobState.requesterCount = 0;
            finishRemoveAllUris(jobState);
          }
        }
      });
}

/**
 * The queryToRemoveAll is a convenience function that combines the queryAll and removeAllUris operations.
 * @method documents#queryToRemoveAll
 * @since 3.0.0
 * @param {ctsQuery} query - A query built by the ctsQueryBuilder.
 * @param {object} [options] - Configures the queryToRemoveAll operation.
 * @param {boolean|DatabaseClient.timestamp} [consistentSnapshot] - Controls whether to get an immutable view of the result set.
 *  Each request gets the latest data at the time of the request if not set/ false.
 *  Uses the timestamp of the first request for all subsequent requests if true.
 *  Uses the supplied timestamp for all requests if set to DatabaseClient.timestamp object.
 * @param {function(timestamp)} [onInitialTimestamp] - Receives the timestamp from the first request.
 *  Takes parameters of - Timestamp object for the server timestamp for the result set.
 *  Throws error if consistentSnapshot is not true.
 * @param {Integer} [queryBatchMultiple] - The number of batches each batch of document uris get divided into when
 *  writing back to the return stream in queryAll.
 * @param {function(summary)} [onCompletion] - A callback that receives a summary of the results.
 * @param {function(progress, uris, error)} [onBatchError] - A callback that responds to any error while removing a
 *  batch/array of documents. Takes progressSoFar, the uris of the batch failed and the error as parameters and controls
 *  the resolution by returning a replacement array, null/empty array or an error.
 * @param {string|array} [inputKind] - Indicates whether the input stream should accept individual strings or array of
 *  strings.
 * @param {Integer} [batchSize] - The number of documents in each request where the inputKind is 'string'.
 * @param {object} [concurrentRequests] - JavaScript object literal that controls the maximum number of concurrent
 *  requests that can be pending at the same time. Valid keys are "multipleOf" and "multiplier".
 * @param {function(progress, documents)} [onBatchSuccess] - A callback that can notify other systems about batches
 *  removed successfully.
 */
Documents.prototype.queryToRemoveAll = function queryToRemoveAllDocuments(query, options) {
  return queryToRemoveAllDocumentsImpl.call(
      this, query, options
  );
};

function queryToRemoveAllDocumentsImpl(query, jobOptions){
  const queryAllJobOptions = {};
  const removeAllJobOptions = {};

  if(!jobOptions){
    jobOptions = {};
  }
  queryAllJobOptions.batchSize = (jobOptions.batchSize) ? jobOptions.batchSize : 250;

  if(queryAllJobOptions.batchSize > 1){
    removeAllJobOptions.inputKind = 'array';
  } else {
    removeAllJobOptions.batchSize = queryAllJobOptions.batchSize;
  }

  if(jobOptions.queryBatchMultiple) {
    queryAllJobOptions.queryBatchMultiple = jobOptions.queryBatchMultiple;
  }

  if (jobOptions.consistentSnapshot) {
    queryAllJobOptions.consistentSnapshot = jobOptions.consistentSnapshot;
  }

  if(jobOptions.onInitialTimestamp){
    queryAllJobOptions.onInitialTimestamp = jobOptions.onInitialTimestamp;
  }

  if (jobOptions.onCompletion) {
    removeAllJobOptions.onCompletion = jobOptions.onCompletion;
  }
  if (jobOptions.onBatchError) {
    removeAllJobOptions.onBatchError = jobOptions.onBatchError;
  }
  if (jobOptions.concurrentRequests) {
    removeAllJobOptions.concurrentRequests = jobOptions.concurrentRequests;
  }

  if(jobOptions.onBatchSuccess){
    removeAllJobOptions.onBatchSuccess = jobOptions.onBatchSuccess;
  }

  queryAllJobOptions.queryToOptions = removeAllJobOptions;

  const docInstance = this;
  const queryAllStream = queryAllDocumentsImpl.call(docInstance, query, queryAllJobOptions);
  let pipelined = false;

  queryAllStream.on('data', function(item){
    if(!pipelined) {
      pipelined = true;
      const removeAllStream = removeAllUrisDocumentsImpl.call(docInstance, null,removeAllJobOptions);

      queryAllStream.on('error', function(err){
        removeAllStream.emit(err);
      });
      removeAllStream.write(item);
      queryAllStream.pipe(removeAllStream);
    }
  });
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
    writeAll:             writeAllDocumentsImpl,
    queryAll:             queryAllDocumentsImpl,
    readAll:              readAllDocumentsImpl,
    queryToReadAll:       queryToReadAllDocumentsImpl,
    transformAll:         transformAllDocumentsImpl,
    queryToTransformAll:  queryToTransformAllDocumentsImpl,
    removeAllUris:        removeAllUrisDocumentsImpl,
    queryToRemoveAll:     queryToRemoveAllDocumentsImpl
};
