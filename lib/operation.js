/*
 * Copyright 2015 MarkLogic Corporation
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
var valcheck = require('core-util-is');
var mlutil   = require('./mlutil.js');

function Operation(name, client, options, requestType, responseType) {
  if (!(this instanceof Operation)) {
    return new Operation(name, client, options, requestType, responseType);
  }
  this.name              = name;
  this.client            = client;
  this.logger            = client.getLogger();
  this.options           = options;
  this.requestType       = requestType;
  this.responseType      = responseType;
  this.validStatusCodes  = null;
  this.inlineAsDocument  = true;
  // TODO: confirm use of responseTransform and partTransform
  this.responseTransform = null;
  this.partTransform     = null;
  this.errorTransform    = null;
  this.startedResponse   = false;
  this.done              = false;
  this.outputMode        = 'none';
  this.resolve           = null;
  this.reject            = null;
  this.streamDefaultMode = 'object';
// TODO: delete
  this.outputStreamMode  = null;
  this.outputStream      = null;
  this.streamModes       = this.STREAM_MODES_CHUNKED_OBJECT;
}
Operation.prototype.STREAM_MODES_CHUNKED_OBJECT = {chunked: true, object: true};

Operation.prototype.emptyHeaderData = function emptyHeaderData(
    response
    ) {
  var operation = this;

  var outputTransform = operation.outputTransform;
  if (!valcheck.isNullOrUndefined(outputTransform)) {
    var responseHeaders = operation.responseHeaders;
    if (valcheck.isNullOrUndefined(responseHeaders)) {
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
  var hasOutputTransform = !valcheck.isNullOrUndefined(outputTransform);

  var headers = operation.responseHeaders;

  var bodyObject = mlutil.unmarshal(headers.format, data);
  if (bodyObject !== null) {
    var subdata = operation.subdata;
    if (valcheck.isArray(subdata)) {
      bodyObject = projectData(bodyObject, subdata, 0);
    }

    if (hasOutputTransform) {
      bodyObject = outputTransform.call(operation, headers, bodyObject);
    }
  }

  return bodyObject;
};
Operation.prototype.queueDocument = function queueDocument(
    data, rawHeaderQueue, metadataBuffer, objectQueue
    ) {
  var operation = this;

  var outputTransform = operation.outputTransform;

  var partRawHeaders = rawHeaderQueue.pollFirst();

  var partHeaders = parsePartHeaders(partRawHeaders);

  var partUri = partHeaders.uri;

  var isInline = valcheck.isNullOrUndefined(partUri);
  var isMetadata = (
      !isInline &&
      !valcheck.isNullOrUndefined(partHeaders.category) &&
      partHeaders.category !== 'content'
    );

  var partData = mlutil.unmarshal(partHeaders.format, data);

  var nextMetadataBuffer = null;
  var partObject         = null;
  if (isInline) {
    if (metadataBuffer !== null) {
      operation.queueMetadata(metadataBuffer, objectQueue);
    }
    operation.logger.debug('parsed inline');
    if (operation.inlineAsDocument) {
      partHeaders.content = partData;
      partObject = partHeaders;
    } else {
      partObject = partData;
    }
  } else if (isMetadata) {
    if (metadataBuffer !== null) {
      operation.queueMetadata(metadataBuffer, objectQueue);
    }
    operation.logger.debug('parsed metadata for %s', partUri);
    nextMetadataBuffer = [partHeaders, partData];
  } else {
    operation.logger.debug('parsed content for %s', partUri);
    if (metadataBuffer !== null) {
      if (metadataBuffer[0].uri === partUri) {
        operation.logger.debug('copying metadata for %s', partUri);
        mlutil.copyProperties(metadataBuffer[1], partHeaders);
      } else {
        operation.queueMetadata(metadataBuffer, objectQueue);
      }
    }
    partHeaders.content = partData;
    partObject = partHeaders;
  }

  if (partObject !== null) {
    var subdata = operation.subdata;
    if (valcheck.isArray(subdata)) {
      partObject = projectData(partObject, subdata, 0);
    }

    if (!valcheck.isNullOrUndefined(outputTransform)) {
      partObject = outputTransform.call(operation, partRawHeaders, partObject);
    }

    if (!valcheck.isUndefined(partObject)) {
      objectQueue.addLast(partObject);
    } else {
      operation.logger.debug('skipped undefined output from transform');
    }
  }

  return nextMetadataBuffer;
};
Operation.prototype.queueMetadata = function queueMetadata(
    metadataBuffer, objectQueue
    ) {
  var metadataHeaders = metadataBuffer[0];
  mlutil.copyProperties(metadataBuffer[1], metadataHeaders);
  objectQueue.addLast(metadataHeaders);
};
Operation.prototype.dispatchError = function dispatchError(error) {
  var operation = this;

  var input =
    valcheck.isNullOrUndefined(error) ? operation.makeError('unknown error') :
    valcheck.isString(error)          ? operation.makeError(error) :
    error;

  var outputStream = operation.outputStream;
  if (!valcheck.isNullOrUndefined(outputStream)) {
    var errorListeners = outputStream.listeners('error');
    if (valcheck.isArray(errorListeners) && errorListeners.length > 0) {
      outputStream.emit('error', input);
    } else {
      operation.logError(input);
    }
  } else if (valcheck.isNullOrUndefined(operation.error)) {
    operation.error = [ input ];
  } else {
    operation.error.push(input);
  }
};
Operation.prototype.logError = function logError(error) {
  var operation = this;

  if (valcheck.isNullOrUndefined(error.body)) {
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
  var operationMsg  = valcheck.isUndefined(operationName) ? message :
    (operationName+': '+message);

  var errorTransform = operation.errorTransform;
  return new mlutil.Error(
    valcheck.isNullOrUndefined(errorTransform) ? operationMsg :
        errorTransform.call(operation, operationMsg)
    );
};
Operation.prototype.copyResponseHeaders = function copyResponseHeaders(response) {
  var operation = this;

  var responseHeaders    = response.headers;
  var responseStatusCode = response.statusCode;

  operation.logger.debug('response headers', responseHeaders);

  var operationHeaders = {};

  operation.responseStatusCode = responseStatusCode;
  operation.rawHeaders         = responseHeaders;
  operation.responseHeaders    = operationHeaders;

  var isString = false;

  var contentType = responseHeaders['content-type'];
  var hasContentType = !valcheck.isNullOrUndefined(contentType);
  if (hasContentType) {
    var semicolonPos = contentType.indexOf(';');
    if (semicolonPos !== -1) {
      contentType = contentType.substring(0, semicolonPos);
    }
    operationHeaders.contentType = contentType;
  }

  var contentLength = responseHeaders['content-length'];
  if (!valcheck.isNullOrUndefined(contentLength) && contentLength > 0) {
    operationHeaders.contentLength = contentLength;
  }

  var versionId = responseHeaders.etag;
  if (!valcheck.isNullOrUndefined(versionId)) {
    var firstChar = versionId.charAt(0);
    var lastChar  = versionId.charAt(versionId.length - 1);
    operationHeaders.versionId = (
        (firstChar === '"' && lastChar === '"') ||
        (firstChar === "'" && lastChar === "'")
      ) ? versionId.substring(1, versionId.length - 1) : versionId;
  }

  var format = responseHeaders['vnd.marklogic.document-format'];
  var hasFormat = !valcheck.isNullOrUndefined(format);
  if (!hasFormat && hasContentType) {
    if (/^multipart\/mixed(;.*)?$/.test(contentType)) {
      format    = 'binary';
      hasFormat = true;
      isString  = false;
    } else if (/^(application|text)\/([^+]+\+)?json$/.test(contentType)) {
      format    = 'json';
      hasFormat = true;
      isString  = true;
    } else if (/^(application|text)\/([^+]+\+)?xml$/.test(contentType)) {
      format    = 'xml';
      hasFormat = true;
      isString  = true;
    } else if (/^(text)\//.test(contentType)) {
      format    = 'text';
      hasFormat = true;
      isString  = true;
    }
  }

  if (hasFormat) {
    operationHeaders.format = format;
    if (!isString) {
      switch(format) {
      case 'json':
      case 'text':
      case 'xml':
        isString = true;
        break;
      }
    }
  }

  var location = responseHeaders.location;
  if (!valcheck.isNullOrUndefined(location)) {
    operationHeaders.location = location;
  }

  var systemTime = responseHeaders['x-marklogic-system-time'];
  if (!valcheck.isNullOrUndefined(systemTime)) {
    operationHeaders.systemTime = systemTime;
  }

  return isString;
};

function contentTypeToFormat(contentType) {
  if (contentType === undefined || contentType === null) {
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
  }

  return null;
}

function parsePartHeaders(headers) {
  var partHeaders = {};

  var contentDispositionArray = headers['content-disposition'];
  if (valcheck.isArray(contentDispositionArray) &&
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
  if (valcheck.isArray(contentTypeArray) && contentTypeArray.length > 0) {
    contentType             = contentTypeArray[0];
    partHeaders.contentType = contentType;
  }

  if (!valcheck.isNullOrUndefined(contentType) && valcheck.isNullOrUndefined(partHeaders.format)) {
    partHeaders.format = contentTypeToFormat(contentType);
  }

  var contentLengthArray = headers['content-length'];
  if (valcheck.isArray(contentLengthArray) && contentLengthArray.length > 0) {
    partHeaders.contentLength = contentLengthArray[0];
  }

  return partHeaders;
}  

function projectData(data, subdata, i) {
  if (i === subdata.length || valcheck.isNullOrUndefined(data)) {
    return data;
  }

  var key = subdata[i];
  if (!valcheck.isArray(data)) {
    var nextData = data[key];
    if (valcheck.isNullOrUndefined(nextData)) {
      return data;
    }
    return projectData(nextData, subdata, i + 1);
  }

  var newData = [];
  for (var j=0; j < data.length; j++) {
    var currItem  = data[j];
    var nextValue = currItem[key];
    newData.push(
        valcheck.isNullOrUndefined(nextValue) ? currItem :
          projectData(nextValue, subdata, i + 1)
        );
  }
  return newData;
}

module.exports = Operation;
