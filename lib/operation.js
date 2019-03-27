/*
 * Copyright 2015-2019 MarkLogic Corporation
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

function Operation(name, client, options, requestType, responseType) {
  if (!(this instanceof Operation)) {
    return new Operation(name, client, options, requestType, responseType);
  }
  this.name               = name;
  this.client             = client;
  this.logger             = client.getLogger();
  this.options            = options;
  this.requestType        = requestType;
  this.responseType       = responseType;
  this.validStatusCodes   = null;
  this.inlineAsDocument   = true;
  this.errorTransform     = null;
  this.error              = null;
  this.outputTransform    = null;
  this.subdata            = null;
  this.startedResponse    = false;
  this.done               = false;
  this.outputMode         = 'none';
  this.resolve            = null;
  this.reject             = null;
  this.streamDefaultMode  = 'object';
  this.rawHeaders         = null;
  this.responseStatusCode = null;
  this.responseHeaders    = null;
  this.outputStreamMode   = null;
  this.outputStream       = null;
  this.streamModes        = this.STREAM_MODES_CHUNKED_OBJECT_SEQUENCE;
  this.nextMetadataBuffer = null;
  this.timestamp          = null;
  this.complexValues      = null;
}
Operation.prototype.STREAM_MODES_CHUNKED_OBJECT_SEQUENCE =
  {chunked: true, object: true, sequence: true};

Operation.prototype.emptyHeaderData = function emptyHeaderData(
    response
    ) {
  var operation = this;

  var outputTransform = operation.outputTransform;
  if (outputTransform != null) {
    var responseHeaders = operation.responseHeaders;
    if (responseHeaders == null) {
      operation.copyResponseHeaders(response);
      responseHeaders = operation.responseHeaders;
    }

    return outputTransform.call(
        operation, responseHeaders, null
        );
  }

  return null;
};
Operation.prototype.collectBodyObject = function collectBodyObject(data) {
  var operation = this;

  var outputTransform    = operation.outputTransform;
  var hasOutputTransform = (outputTransform != null);

  var headers = operation.responseHeaders;

  var bodyObject = mlutil.unmarshal(headers.format, data);
  if (bodyObject !== null) {
    var subdata = operation.subdata;
    if (Array.isArray(subdata)) {
      bodyObject = projectData(bodyObject, subdata, 0);
    }

    if (hasOutputTransform) {
      bodyObject = outputTransform.call(operation, headers, bodyObject);
    }
  }

  return bodyObject;
};
/**
 * Make an object out of multipart part data
 * @param {Buffer} data - Multipart part data
 * @param {FifoQueue} rawHeaderQueue - Queue of headers for part data
 * @return {Object} - The object
 *
 * @ignore
 */
Operation.prototype.makeObject = function makeObject(
    data, rawHeaderQueue
    ) {
  var operation = this;

  var outputTransform = operation.outputTransform;
  var partObject = null;

  // Get corresponding multipart header for part
  var partRawHeaders = rawHeaderQueue.pollFirst();
  var partHeaders = parsePartHeaders(partRawHeaders);
  var partUri = partHeaders.uri;

  var isInline = (partUri == null && !partHeaders.kind);
  var isMetadata = (
      !isInline &&
      (partHeaders.category != null) &&
      partHeaders.category !== 'content'
    );

  // Convert buffer data to object
  var partData = mlutil.unmarshal(partHeaders.format, data);

  // Inline case
  if (isInline) {
    operation.logger.debug('parsed inline');
    // Resource execs and server-side evals
    if (operation.inlineAsDocument) {
      partHeaders.content = partData;
      partObject = partHeaders;
    }
    // Search summaries
    else {
      partObject = partData;
    }
  }
  // Metadata case
  else if (isMetadata) {
    operation.logger.debug('parsed metadata for %s', partUri);
    if (this.nextMetadataBuffer !== null) {
      var metadataHeaders = this.nextMetadataBuffer[0];
      mlutil.copyProperties(this.nextMetadataBuffer[1], metadataHeaders);
      partObject = metadataHeaders;
    }
    this.nextMetadataBuffer = [partHeaders, partData];
  }
  // Content case
  else {
    operation.logger.debug('parsed content for %s', partUri);
    // If metadata exists, copy to object
    if (this.nextMetadataBuffer !== null) {
      operation.logger.debug('copying metadata for %s', partUri);
      mlutil.copyProperties(this.nextMetadataBuffer[1], partHeaders);
      this.nextMetadataBuffer = null;
    }
    partHeaders.content = partData;
    partObject = partHeaders;
  }

  if (partObject !== null) {
    // Subdata processing (poor man's XPath)
    var subdata = operation.subdata;
    if (Array.isArray(subdata)) {
      partObject = projectData(partObject, subdata, 0);
    }
    // Transform
    if (outputTransform != null) {
      partObject = outputTransform.call(operation, partRawHeaders, partObject);
    }
    if (partObject === void 0) {
      operation.logger.debug('skipped undefined output from transform');
    }
  }
  return partObject;
};
Operation.prototype.dispatchError = function dispatchError(error) {
  var operation = this;

  var input =
    (error == null) ? operation.makeError('unknown error') :
    (typeof error === 'string' || error instanceof String)          ? operation.makeError(error) :
    error;

  var outputStream = operation.outputStream;
  if (outputStream != null) {
    var errorListeners = outputStream.listeners('error');
    if (Array.isArray(errorListeners) && errorListeners.length > 0) {
      outputStream.emit('error', input);
    } else {
      operation.logError(input);
    }
  } else if (operation.error == null) {
    operation.error = [ input ];
  } else {
    operation.error.push(input);
  }
};
Operation.prototype.logError = function logError(error) {
  var operation = this;

  if (error.body == null) {
    operation.logger.error(error.message);
  } else if (operation.logger.isErrorFirst === true) {
    operation.logger.error(error.body, error.message);
  } else {
    operation.logger.error(error.message, error.body);
  }
};
Operation.prototype.makeError = function makeError(message) {
  var operation = this;

  var operationName = operation.name;
  var operationMsg  = (operationName === void 0) ? message :
    (operationName+': '+message);

  var errorTransform = operation.errorTransform;
  return new mlutil.Error(
    (errorTransform == null) ? operationMsg :
        errorTransform.call(operation, operationMsg)
    );
};
Operation.prototype.copyResponseHeaders = function copyResponseHeaders(response) {
  var operation = this;

  var responseHeaders = response.headers;

  var contentType = trimContentType(responseHeaders['content-type']);

  var format = responseHeaders['vnd.marklogic.document-format'];
  if ((format == null) && contentType !== null) {
    format = contentTypeToFormat(contentType);
  }

  operation.rawHeaders         = responseHeaders;
  operation.responseStatusCode = response.statusCode;
  operation.responseHeaders    = new OperationHeaders(
      contentType,
      format,
      responseHeaders['content-length'],
      responseHeaders.etag,
      responseHeaders.location,
      responseHeaders['x-marklogic-system-time'],
      responseHeaders['ml-lsqt']
      );

  switch(format) {
  case 'json':
  case 'text':
  case 'xml':
    return true;
  default:
    return false;
  }
};
function OperationHeaders(
    contentType, format, contentLength, versionId, location, systemTime, lsqt
    ) {
  this.contentType = contentType;
  this.format      = format;

  this.contentLength =
    ((contentLength == null) || contentLength === 0) ?
    null : contentLength;

  if (versionId == null) {
    this.versionId = null;
  } else {
    var firstChar = versionId.charAt(0);
    var lastChar  = versionId.charAt(versionId.length - 1);
    this.versionId = (
        (firstChar === '"' && lastChar === '"') ||
        (firstChar === "'" && lastChar === "'")
      ) ? versionId.substring(1, versionId.length - 1) : versionId;
  }

  this.location   = (location == null)   ? null : location;
  this.systemTime = (systemTime == null) ? null : systemTime;
  this.lsqt = (lsqt == null) ? null : lsqt;
}
function trimContentType(contentType) {
  if (contentType == null) {
    return null;
  }
  var semicolonPos = contentType.indexOf(';');
  return (semicolonPos > 0) ?
    contentType.substring(0, semicolonPos) : contentType;
}
function contentTypeToFormat(contentType) {
  if (contentType === null) {
    return null;
  }

  var fields = contentType.split(/[\/+]/);
  switch(fields[0]) {
  case 'application':
    switch(fields[fields.length - 1]) {
    case 'json':
      return 'json';
    case 'xml':
      return 'xml';
    case 'n-triples':
        return 'text';
    case 'n-quads':
        return 'text';
    case 'trig':
        return 'text';
    }
    break;
  case 'text':
    switch(fields[fields.length - 1]) {
    case 'json':
      return 'json';
    case 'xml':
      return 'xml';
    default:
      return 'text';
    }
    break;
  case 'multipart':
    return 'binary';
  }

  return null;
}

function parsePartHeaders(headers) {
  var partHeaders = {};

  var contentDispositionArray = headers['content-disposition'];
  if (Array.isArray(contentDispositionArray) &&
      contentDispositionArray.length > 0) {
    var contentDisposition = contentDispositionArray[0];
    if (contentDisposition.substring(contentDisposition.length) !== ';') {
      contentDisposition += ';';
    }

    var tokens = contentDisposition.match(/"[^"]*"|;|=|[^";=\s]+/g);
    var key   = null;
    var value = null;
    for (var i=0; i < tokens.length; i++) {
      var token = tokens[i];
      switch(token) {
      case ';':
        if (key) {
          if (value) {
            if (key === 'filename') {
              key = 'uri';
              value = value.substring(1,value.length - 1);
            }

            var currentValue = partHeaders[key];
            if (!currentValue) {
              partHeaders[key] = value;
            } else if (currentValue instanceof Array) {
              currentValue.push(value);
            } else {
              partHeaders[key] = [currentValue, value];
            }

            value = null;
          }

          key = null;
        }
        break;
      case '=':
        break;
      default:
        if (!key) {
          key   = token;
        } else {
          value = token;
        }
        break;
      }
    }
  }

  var contentTypeArray = headers['content-type'];
  var contentType = null;
  if (Array.isArray(contentTypeArray) && contentTypeArray.length > 0) {
    contentType             = trimContentType(contentTypeArray[0]);
    partHeaders.contentType = contentType;
  }

  if ((contentType != null) && (partHeaders.format == null)) {
    partHeaders.format = contentTypeToFormat(contentType);
  }

  var contentLengthArray = headers['content-length'];
  if (Array.isArray(contentLengthArray) && contentLengthArray.length > 0) {
    partHeaders.contentLength = contentLengthArray[0];
  }

  var contentIdArray = headers['content-id'];
  if (Array.isArray(contentIdArray) && contentIdArray.length > 0) {
    partHeaders.contentId = contentIdArray[0].slice(1, -1);
  }

  return partHeaders;
}

function projectData(data, subdata, i) {
  if (i === subdata.length || (data == null)) {
    return data;
  }

  var key = subdata[i];
  if (!Array.isArray(data)) {
    var nextData = data[key];
    if (nextData == null) {
      return data;
    }
    return projectData(nextData, subdata, i + 1);
  }

  var newData = [];
  for (var j=0; j < data.length; j++) {
    var currItem  = data[j];
    var nextValue = currItem[key];
    newData.push(
        (nextValue == null) ? currItem :
          projectData(nextValue, subdata, i + 1)
        );
  }
  return newData;
}

module.exports = Operation;
