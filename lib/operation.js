/*
* Copyright (c) 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/
'use strict';

const mlutil   = require('./mlutil.js');

function Operation(name, client, options, requestType, responseType) {
  if (!(this instanceof Operation)) {
    return new Operation(name, client, options, requestType, responseType);
  }
  this.name               = name;
  this.client             = client;
  this.logger             = client.getLogger();
  this.options            = options;
  this.requestType        = requestType;
  this.isReplayable       = true;
  this.responseType       = responseType;
  this.validStatusCodes   = null;
  this.inlineAsDocument   = true;
  this.errorTransform     = null;
  this.error              = null;
  this.outputTransform    = null;
  this.subdata            = null;
  this.authenticator      = null;
  this.inputSender        = null;
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
  this.retryAttempt       = 0;
  this.retryDuration      = 0;
}
Operation.prototype.STREAM_MODES_CHUNKED_OBJECT_SEQUENCE =
  {chunked: true, object: true, sequence: true};

Operation.prototype.emptyHeaderData = function emptyHeaderData(
    response
    ) {
  const operation = this;

  const outputTransform = operation.outputTransform;
  if (outputTransform != null) {
    let responseHeaders = operation.responseHeaders;
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
  const operation = this;

  const outputTransform    = operation.outputTransform;
  const hasOutputTransform = (outputTransform != null);

  const headers = operation.responseHeaders;

  let bodyObject = mlutil.unmarshal(headers.format, data);
  if (bodyObject !== null) {
    const subdata = operation.subdata;
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
  const operation = this;

  const outputTransform = operation.outputTransform;
  let partObject = null;

  // Get corresponding multipart header for part
  const partRawHeaders = rawHeaderQueue.pollFirst();
  const partHeaders = parsePartHeaders(partRawHeaders);
  const partUri = partHeaders.uri;

  const isInline = (partUri == null && !partHeaders.kind);
  const isMetadata = (
      !isInline &&
      (partHeaders.category != null) &&
      partHeaders.category !== 'content'
    );

  // Convert buffer data to object
  const partData = mlutil.unmarshal(partHeaders.format, data);

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
      const metadataHeaders = this.nextMetadataBuffer[0];
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
    const subdata = operation.subdata;
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
  const operation = this;

  const input =
    (error == null) ? operation.makeError('unknown error') :
    (typeof error === 'string' || error instanceof String)          ? operation.makeError(error) :
    error;

  const outputStream = operation.outputStream;
  if (outputStream != null) {
    const errorListeners = outputStream.listeners('error');
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
  const operation = this;

  if (error.body == null) {
    operation.logger.error(error.message);
  } else if (operation.logger.isErrorFirst === true) {
    operation.logger.error(error.body, error.message);
  } else {
    operation.logger.error(error.message, error.body);
  }
};
Operation.prototype.makeError = function makeError(message) {
  const operation = this;

  const operationName = operation.name;
  let operationMsg  = (operationName === void 0) ? message :
    (operationName+': '+message);

  const errorTransform = operation.errorTransform;
  const responsePath = operation.options.path;
  const subMsg = (responsePath && responsePath.toString().includes('?'))?
      responsePath.toString().substring(0,responsePath.toString().indexOf('?') ):
      responsePath.toString();
  operationMsg = operationMsg+' with path: '+subMsg;
  return new mlutil.Error(
    (errorTransform == null) ? operationMsg :
        errorTransform.call(operation, operationMsg)
    );
};
Operation.prototype.copyResponseHeaders = function copyResponseHeaders(response) {
  const operation = this;

  const responseHeaders = response.headers;

  const contentType = trimContentType(responseHeaders['content-type']);

  let format = responseHeaders['vnd.marklogic.document-format'];
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
    const firstChar = versionId.charAt(0);
    const lastChar  = versionId.charAt(versionId.length - 1);
    this.versionId = (
        (firstChar === '"' && lastChar === '"') ||
        (firstChar === '\'' && lastChar === '\'')
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
  const semicolonPos = contentType.indexOf(';');
  return (semicolonPos > 0) ?
    contentType.substring(0, semicolonPos) : contentType;
}
function contentTypeToFormat(contentType) {
  if (contentType === null) {
    return null;
  }

  const fields = contentType.split(/[\/+]/);
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
  const partHeaders = {};

  const contentDispositionArray = headers['content-disposition'];
  if (Array.isArray(contentDispositionArray) &&
      contentDispositionArray.length > 0) {
    let contentDisposition = contentDispositionArray[0];
    if (contentDisposition.substring(contentDisposition.length) !== ';') {
      contentDisposition += ';';
    }

    const tokens = contentDisposition.match(/"[^"]*"|;|=|[^";=\s]+/g);
    let key   = null;
    let value = null;
    for (let i=0; i < tokens.length; i++) {
      const token = tokens[i];
      switch(token) {
      case ';':
        if (key) {
          if (value) {
            if (key === 'filename') {
              key = 'uri';
              value = value.substring(1,value.length - 1);
            }

            const currentValue = partHeaders[key];
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

  const contentTypeArray = headers['content-type'];
  let contentType = null;
  if (Array.isArray(contentTypeArray) && contentTypeArray.length > 0) {
    contentType             = trimContentType(contentTypeArray[0]);
    partHeaders.contentType = contentType;
  }

  if ((contentType != null) && (partHeaders.format == null)) {
    partHeaders.format = contentTypeToFormat(contentType);
  }

  const contentLengthArray = headers['content-length'];
  if (Array.isArray(contentLengthArray) && contentLengthArray.length > 0) {
    partHeaders.contentLength = contentLengthArray[0];
  }

  const contentIdArray = headers['content-id'];
  if (Array.isArray(contentIdArray) && contentIdArray.length > 0) {
    partHeaders.contentId = contentIdArray[0].slice(1, -1);
  }

  return partHeaders;
}

function projectData(data, subdata, i) {
  if (i === subdata.length || (data == null)) {
    return data;
  }

  const key = subdata[i];
  if (!Array.isArray(data)) {
    const nextData = data[key];
    if (nextData == null) {
      return data;
    }
    return projectData(nextData, subdata, i + 1);
  }

  const newData = [];
  for (let j=0; j < data.length; j++) {
    const currItem  = data[j];
    const nextValue = currItem[key];
    newData.push(
        (nextValue == null) ? currItem :
          projectData(nextValue, subdata, i + 1)
        );
  }
  return newData;
}

module.exports = Operation;
