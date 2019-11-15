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
var concatStream = require('concat-stream');
var jsonParser   = require('json-text-sequence').parser;
var Dicer        = require('dicer');
var through2     = require('through2');
var PromisePlus  = require('./bluebird-plus.js');
var mlutil       = require('./mlutil.js');

/**
 * Handle response from the REST API based on response and operation
 * @param {http.IncomingMessage} response - An HTTP response
 *
 * The following dispatch methods are available:
 *
 *   BodyDispatcher.emptyPromise()
 *   BodyDispatcher.emptyStream()
 *   BodyDispatcher.promise()
 *   BodyDispatcher.chunkedStream()
 *   BodyDispatcher.objectStream()
 *   MultipartDispatcher.emptyPromise()
 *   MultipartDispatcher.emptyStream()
 *   MultipartDispatcher.promise()
 *   MultipartDispatcher.chunkedStream()
 *   MultipartDispatcher.objectStream()
 *
 * @ignore
 */
function responseDispatcher(response) {
  /*jshint validthis:true */
  var operation = this;

  if (!isResponseStatusOkay.call(operation, response)) {
    return;
  }

  var outputMode = operation.outputMode;
  if (outputMode === 'none') {
    return;
  }

  var responseType     = response.headers['content-type'];
  var responseTypeLen  = (responseType === undefined) ? 0 : responseType.length;
  var responseBoundary = null;
  if (15 <= responseTypeLen && responseType.substr(0, 15) === 'multipart/mixed') {
    responseBoundary = responseType.replace(
        /^multipart.mixed\s*;\s*boundary\s*=\s*([^\s;]+)([\s;].*)?$/, '$1'
        );
    if (responseBoundary.length === responseTypeLen) {
      operation.errorListener('multipart/mixed response without boundary');
      return;
    }
    if (responseBoundary !== mlutil.multipartBoundary) {
      operation.logger.debug(
          'expected '+mlutil.multipartBoundary+
          ' but received '+responseBoundary+' multipart/mixed boundary'
          );
    }
  }
  var isMultipart = (responseBoundary != null);

  // inputHeader may be boundary (for multipart) or content type (for body)
  // Allows dispatch function signatures to remain consistent
  var inputHeader = isMultipart ? responseBoundary : responseType;

  var responseLength = response.headers['content-length'];
  var isEmpty = ((responseLength != null) && responseLength === '0');

  var expectedType = operation.responseType;

  // point-in-time operations: if timestamp unset, set with header value
  if (operation.timestamp !== undefined && operation.timestamp !== null) {
    if (operation.timestamp.value === null &&
        response.headers['ml-effective-timestamp']) {
      operation.timestamp.value = response.headers['ml-effective-timestamp'];
    }
  }

  var dispatcher = null;
  if (isMultipart) {
    if (expectedType !== 'multipart') {
      operation.logger.debug('expected body but received multipart');
    }

    dispatcher = new MultipartDispatcher(operation);
  } else if (20 <= responseTypeLen && responseType.substr(0, 20) === 'application/json-seq') {
    dispatcher = new JSONSeqDispatcher(operation);
  } else if (8 <= responseTypeLen && responseType.substr(0, 8) === 'text/csv') {
    dispatcher = new CSVDispatcher(operation);
  } else {
    if (expectedType === 'multipart') {
      operation.logger.debug('expected multipart but received body');
    }

    dispatcher = new BodyDispatcher(operation);
  }

  response.on('error', operation.errorListener);

  if (isEmpty) {
    if (expectedType !== 'empty') {
      operation.logger.debug('expected body or multipart but received empty response');
    }

    if (outputMode === 'promise') {
      dispatcher.emptyPromise(response);
    } else {
      dispatcher.emptyStream(response);
    }
  } else {
    if (expectedType === 'empty') {
      operation.logger.debug('expected empty response but received body or multipart');
    }

    switch(outputMode) {
    case 'promise':
      dispatcher.promise(inputHeader, response);
      break;
    case 'chunkedStream':
      dispatcher.chunkedStream(inputHeader, response);
      break;
    case 'objectStream':
      dispatcher.objectStream(inputHeader, response);
      break;
    case 'sequenceStream':
      dispatcher.sequenceStream(inputHeader, response);
      break;
    default:
      operation.errorListener('unknown output mode '+outputMode);
      break;
    }
  }
}

function CSVDispatcher(operation) {
  if (!(this instanceof CSVDispatcher)) {
    return new CSVDispatcher(operation);
  }

  this.operation = operation;
}
CSVDispatcher.prototype.promise = function dispatchCSVPromise(
    contentType, response
    ) {
  var operation = this.operation;

  operation.logger.debug('csv promise');
  var collectObject = function collectPromiseBodyObject(data) {
    operation.data = data;
    resolvedPromise(operation, operation.resolve);
  };

  var isString = operation.copyResponseHeaders(response);

  response.pipe(concatStream(
      {encoding: (isString ? 'string' : 'buffer')},
      collectObject
      ));
};
CSVDispatcher.prototype.chunkedStream = function dispatchCSVChunkedStream(
    contentType, response
    ) {
  var operation = this.operation;

  operation.logger.debug('csv chunked stream');

  // HTTP response gives a chunked stream to begin with
  // .stream('chunked') creates through2 stream (writable and readable)
  // Simply pipe HTTP response to the through2 stream
  response.pipe(operation.outputStream);
};
function JSONSeqDispatcher(operation) {
  if (!(this instanceof JSONSeqDispatcher)) {
    return new JSONSeqDispatcher(operation);
  }

  this.operation = operation;
}
JSONSeqDispatcher.prototype.promise = function dispatchJSONSeqPromise(
  contentType, response
  ) {
  var operation     = this.operation;
  var errorListener = operation.errorListener;
  var objectQueue   = new FifoQueue(2);
  var parsedObjects = 0;

  operation.logger.debug('json sequence promise');

  var dataListener = function JSONSeqDataListener(object) {
    parsedObjects++;
    operation.logger.debug('json-seq parsing object %d', parsedObjects);
    objectQueue.addLast(object);
  };

  var finishListener = function JSONSeqFinishListener() {
    operation.logger.debug('json-seq finished parsing %d objects', parsedObjects);
    operation.data = objectQueue.getQueue();
    resolvedPromise(operation, operation.resolve);

    dataListener      = null;
    finishListener    = null;
    parser            = null;
    objectQueue       = null;

  };

  var parser = new jsonParser()
  .on('data', dataListener)
  .on('truncated', function(buf) {
    throw new Error('json-seq truncated data encountered: ' + buf);
  })
  .on('invalid', errorListener)
  .on('finish', finishListener);

  response.pipe(parser);

};
JSONSeqDispatcher.prototype.sequenceStream = function dispatchJSONSeqSequenceStream(
  contentType, response
  ) {
  this.stream('sequence', response);
};
JSONSeqDispatcher.prototype.objectStream = function dispatchJSONSeqObjectStream(
  contentType, response
  ) {
  this.stream('object', response);
};
JSONSeqDispatcher.prototype.stream = function dispatchJSONSeqStream(
  streamMode, response
  ) {
  var operation     = this.operation;
  var errorListener = operation.errorListener;
  var outputStream = operation.outputStream;
  var parsedObjects = 0;
  var hasParsed = false;
  var hasEnded = false;

  operation.logger.debug('json sequence stream ' + streamMode);

  var dataListener = function JSONSeqDataListener(object) {
    parsedObjects++;
    operation.logger.debug('parsing object %d', parsedObjects);
    operation.logger.debug(object);

    var writeResult = null;
    if (object !== null && object !== undefined) {
      if (streamMode === 'object') {
        writeResult = outputStream.write(object);
      } else if (streamMode === 'sequence') {
        writeResult = outputStream.write('\x1e' + JSON.stringify(object) + '\n');
      } else {
        writeResult = outputStream.write(JSON.stringify(object));
      }
    }

    // Manage backpressure
    if (writeResult === false) {
      // Only pause resp stream if resp hasn't ended
      if (!hasEnded) {
        response.pause();
      }
      return;
    }

  };

  var responseFinisher = function JSONSeqFinishListener() {

    if (hasParsed && hasEnded) {
      operation.logger.debug('finished parsing %d objects', parsedObjects);

      dataListener        = null;
      responseFinisher    = null;
      parseFinishListener = null;
      responseEndListener = null;
      drainListener       = null;
      parser              = null;

      outputStream.end();
    }

  };

  var parseFinishListener = function objectParseFinishListener() {
    hasParsed = true;
    responseFinisher();
  };

  var responseEndListener = function objectResponseEndListener() {
    hasEnded = true;
    responseFinisher();
  };

  var drainListener = function objectDrainListener() {
    if (!hasEnded) {
      response.resume();
    }
  };

  var parser = new jsonParser()
  .on('data', dataListener)
  .on('truncated', function(buf) {
    throw new Error('truncated data encountered: ' + buf);
  })
  .on('invalid', errorListener)
  .on('finish', parseFinishListener);

  response.on('end', responseEndListener);

  outputStream.on('drain', drainListener);

  response.pipe(parser);

};

function BodyDispatcher(operation) {
  if (!(this instanceof BodyDispatcher)) {
    return new BodyDispatcher(operation);
  }

  this.operation = operation;
}
BodyDispatcher.prototype.emptyPromise = function dispatchBodyEmptyPromise(response) {
  var operation = this.operation;

  operation.logger.debug('empty body promise');

  operation.data = operation.emptyHeaderData(response);
  resolvedPromise(operation, operation.resolve);
};
BodyDispatcher.prototype.emptyStream = function dispatchBodyEmptyStream(response) {
  var operation = this.operation;

  var data = operation.emptyHeaderData(response);

  operation.logger.debug('empty body stream');

  var outputStream = operation.outputStream;
  if (data != null) {
    if (operation.outputStreamMode === 'chunked') {
      outputStream.write(JSON.stringify(data));
    } else {
      outputStream.write(data);
    }
  }
  outputStream.end();
};
BodyDispatcher.prototype.promise = function dispatchBodyPromise(
    contentType, response
    ) {
  var operation = this.operation;

  operation.logger.debug('body promise');
  var collectObject = function collectPromiseBodyObject(data) {
    // turn collected data into something usable
    // e.g., if JSON, parse as JS object
    operation.data = operation.collectBodyObject(data);
    resolvedPromise(operation, operation.resolve);
  };

  var isString = operation.copyResponseHeaders(response);

  // concatStream accumulates response with callback
  response.pipe(concatStream(
      {encoding: (isString ? 'string' : 'buffer')},
      collectObject
      ));
};
BodyDispatcher.prototype.chunkedStream = function dispatchBodyChunkedStream(
    contentType, response
    ) {
  var operation = this.operation;

  operation.logger.debug('body chunked stream');

  // HTTP response gives a chunked stream to begin with
  // .stream('chunked') creates through2 stream (writable and readable)
  // Simply pipe HTTP response to the through2 stream
  response.pipe(operation.outputStream);
};
BodyDispatcher.prototype.objectStream = function dispatchBodyObjectStream(
    contentType, response
    ) {
  var operation = this.operation;

  operation.logger.debug('body object stream');

  // outputStream is a through2 stream in object mode
  var outputStream = operation.outputStream;

  var collectObject = function collectStreamBodyObject(data) {
    // similar to promise body case, but write to through2
    var writableObject = operation.collectBodyObject(data);
    if (writableObject != null) {
      outputStream.write(writableObject);
    }
    outputStream.end();
  };

  var isString = operation.copyResponseHeaders(response);

  response.pipe(concatStream(
      {encoding: (isString ? 'string' : 'buffer')},
      collectObject
      ));
};

// Multipart cases similar to the above, but with multiple objects
// Promise case: Accumulate an array of objects
// Chunked case: Send chunks (but filter out multipart bits -- e.g., headers)
// Object stream case: Write multiple objects instead of single object
function MultipartDispatcher(operation) {
  if (!(this instanceof MultipartDispatcher)) {
    return new MultipartDispatcher(operation);
  }

  this.operation = operation;
}
MultipartDispatcher.prototype.emptyPromise = function dispatchMultipartEmptyPromise(response) {
  var operation = this.operation;

  var data = operation.emptyHeaderData(response);

  operation.logger.debug('empty multipart promise');

  operation.data = (data == null) ? [] : [data];
  resolvedPromise(operation, operation.resolve);
};
MultipartDispatcher.prototype.emptyStream = function dispatchMultipartEmptyStream(response) {
  var operation = this.operation;

  var data = operation.emptyHeaderData(response);

  operation.logger.debug('empty multipart stream');

  var outputStream = operation.outputStream;
  if (data != null) {
    if (operation.outputStreamMode === 'chunked') {
      outputStream.write(JSON.stringify(data));
    } else {
      outputStream.write(data);
    }
  }
  outputStream.end();
};
/* Note: the following events can occur in any order:
 * 'end'    on the readable stream for the last part
 * 'finish' on the Dicer parser
 * 'end'    on the reponse
 */
MultipartDispatcher.prototype.promise = function dispatchMultipartPromise(
    boundary, response
    ) {
  var operation = this.operation;
  operation.logger.debug('multipart promise');

  var errorListener = operation.errorListener;

  var rawHeaderQueue  = new FifoQueue(2);
  var objectQueue     = new FifoQueue(2);
  var partReaderQueue = new FifoQueue(3);

  var parsingParts = 0;
  var parsedParts  = 0;

  var hasParsed = false;
  var hasEnded  = false;

  var responseFinisher = function promiseResponseFinisher() {
    // If there is metadata left in the buffer, add it to queue
    if (operation.nextMetadataBuffer !== null) {
      var metadataHeaders = operation.nextMetadataBuffer[0];
      mlutil.copyProperties(operation.nextMetadataBuffer[1], metadataHeaders);
      objectQueue.addLast(metadataHeaders);
    }

    operation.logger.debug('ending multipart promise');
    operation.data = objectQueue.getQueue();
    resolvedPromise(operation, operation.resolve);

    partFinisher        = null;
    partHeadersListener = null;
    partListener        = null;
    parseFinishListener = null;
    responseEndListener = null;
    parser              = null;
    rawHeaderQueue      = null;
    objectQueue         = null;
    partReaderQueue     = null;
    responseFinisher    = null;
  };

  var partFinisher = function promisePartFinisher(data) {
    parsedParts++;
    operation.logger.debug('parsed part %d', parsedParts);

    partReaderQueue.removeFirst();

    var madeObject = operation.makeObject(
        (data.length === 0) ? null : data, rawHeaderQueue
        );

    if (madeObject !== null && madeObject !== undefined) {
      objectQueue.addLast(madeObject);
    }

    if (partReaderQueue.hasItem()) {
      var partConcatenator = concatStream(partFinisher);
      partConcatenator.on('error', errorListener);

      var partReadStream = partReaderQueue.getFirst();
      partReadStream.pipe(partConcatenator);
    } else if (hasParsed) {
      responseFinisher();
    }

  };

  var partHeadersListener = function promisePartHeadersListener(headers) {
    operation.logger.debug('queued header %d %j', parsingParts, headers);
    rawHeaderQueue.addLast(headers);
  };

  var partListener = function promisePartListener(partReadStream) {
    parsingParts++;
    operation.logger.debug('parsing part %d', parsingParts);

    partReadStream.on('header', partHeadersListener);
    partReadStream.on('error',  errorListener);
    partReaderQueue.addLast(partReadStream);

    if (partReaderQueue.isLast()) {
      var partConcatenator = concatStream(partFinisher);
      partConcatenator.on('error', errorListener);
      partReadStream.pipe(partConcatenator);
    }
  };

  var parseFinishListener = function promiseParseFinishListener() {
    operation.logger.debug('parse finished at part %d of %d', parsedParts, parsingParts);
    hasParsed = true;
    if (!partReaderQueue.hasItem()) {
      responseFinisher();
    }
  };

  var responseEndListener = function promiseResponseEndListener() {
    hasEnded = true;
  };

  var parser = new Dicer({boundary: boundary});
  parser.on('part',   partListener);
  parser.on('error',  errorListener);
  parser.on('finish', parseFinishListener);

  response.on('end', responseEndListener);

  response.pipe(parser);
};
MultipartDispatcher.prototype.chunkedStream = function dispatchMultipartChunkedStream(
    boundary, response
    ) {
  var operation = this.operation;
  operation.logger.debug('multipart chunked stream');

  var errorListener = operation.errorListener;

  var outputStream = operation.outputStream;

  var partReaderQueue = new FifoQueue(3);

  var hasParsed = false;
  var hasEnded  = false;

  var responseFinisher = function chunkedResponseFinisher() {
    outputStream.end();
    outputStream        = null;
    partEndListener     = null;
    partListener        = null;
    parser              = null;
    parseFinishListener = null;
    responseEndListener = null;
    responseFinisher    = null;
  };

  var partEndListener = function chunkedPartEndListener() {
    partReaderQueue.removeFirst();

    if (partReaderQueue.hasItem()) {
      var partReadStream = partReaderQueue.getFirst();
      partReadStream.pipe(outputStream, {end: false});
    } else if (hasParsed) {
      responseFinisher();
    }
  };

  var partListener = function chunkedPartListener(partReadStream) {
    partReadStream.on('error', errorListener);
    partReadStream.on('end',   partEndListener);
    partReaderQueue.addLast(partReadStream);

    if (partReaderQueue.isLast()) {
      partReadStream.pipe(outputStream, {end: false});
    }
  };

  var parseFinishListener = function chunkedParseFinishListener() {
    operation.logger.debug('parse finished');
    hasParsed = true;
    if (!partReaderQueue.hasItem()) {
      responseFinisher();
    }
  };

  var responseEndListener = function chunkedResponseEndListener() {
    hasEnded = true;
  };

  var parser = new Dicer({boundary: boundary});
  parser.on('part',   partListener);
  parser.on('error',  errorListener);
  parser.on('finish', parseFinishListener);

  response.on('end', responseEndListener);

  response.pipe(parser);
};
MultipartDispatcher.prototype.objectStream = function dispatchMultipartObjectStream(
    boundary, response
    ) {
  var operation = this.operation;
  operation.logger.debug('multipart object stream');

  var errorListener   = operation.errorListener;

  var rawHeaderQueue = new FifoQueue(5);
  var partReaderQueue = new FifoQueue(3);

  // For referenced attachments case
  var partBuffer = null;

  var parsingParts = 0;
  var parsedParts  = 0;

  var hasParsed = false;
  var hasEnded  = false;

  var isConcatenating = false;

  var responseFinisher = function objectResponseFinisher() {

    if (!partReaderQueue.hasItem() && hasParsed && hasEnded) {

      // Handle multipart with reference attachments (rows)
      if (operation.complexValues === 'reference') {
        // If there is a part left in the buffer, write it
        if (partBuffer !== null) {
          operation.outputStream.write(partBuffer);
          partBuffer = null;
        }
      }
      // All other cases
      else {
        // If there is metadata left in the buffer, write it
        if (operation.nextMetadataBuffer !== null) {
          var metadataHeaders = operation.nextMetadataBuffer[0];
          mlutil.copyProperties(operation.nextMetadataBuffer[1], metadataHeaders);
          operation.outputStream.write(metadataHeaders);
          operation.nextMetadataBuffer = null;
        }
      }

      rawHeaderQueue      = null;
      parser              = null;
      partHeadersListener = null;
      partListener        = null;
      parseFinishListener = null;
      responseEndListener = null;

      operation.outputStream.end();
    }

  };

  var partFinisher = function objectPartFinisher(data) {
    parsedParts++;
    operation.logger.debug('parsed part %d', parsedParts);

    var madeObject = operation.makeObject(
      (data.length === 0) ? null : data, rawHeaderQueue
    );

    // Handle multipart with reference attachments (rows)
    var writeResult = null;
    if (operation.complexValues === 'reference') {
      if (madeObject !== null && madeObject !== undefined) {
        // Columns object
        if (madeObject.kind === 'columns') {
          writeResult = operation.outputStream.write(madeObject);
        }
        // Row object
        else if (madeObject.kind === 'row') {
          // First
          if (partBuffer === null) {
            partBuffer = madeObject;
          }
          // Subsequent
          else {
            writeResult = operation.outputStream.write(partBuffer);
            partBuffer = madeObject;
          }
        }
        // Attachment object
        else {
          // Remove '[n]' to get column name
          var columnName = madeObject.contentId
            .slice(0, madeObject.contentId.lastIndexOf('['));
          // Put attachment into currently cached part
          partBuffer.content[columnName] = {
            contentType: madeObject.contentType,
            format: madeObject.format,
            content: madeObject.content
          };
        }
      }
    }
    // All other cases
    else {
      if (madeObject !== null && madeObject !== undefined) {
        writeResult = operation.outputStream.write(madeObject);
      }
    }

    // Manage backpressure
    if (writeResult === false) {
      // Only pause resp stream if not all parsed and resp hasn't ended
      if (hasParsed && !partReaderQueue.hasItem()) {
        responseFinisher();
      } else if (!hasEnded) {
        response.pause();
      }
      return;
    }

    partReaderQueue.removeFirst();
    isConcatenating = false;

    // If item avail, concat-stream it with callback to finisher
    if (partReaderQueue.hasItem()) {
      isConcatenating = true;
      var partRead = concatStream(partFinisher);
      partRead.on('error', errorListener);
      var partReadStream = partReaderQueue.getFirst();
      partReadStream.pipe(partRead);

    } else if (hasParsed) {
      responseFinisher();
    }

  };

  var partHeadersListener = function objectPartHeadersListener(headers) {
    operation.logger.debug('queued header');
    rawHeaderQueue.addLast(headers);
  };

  var partListener = function objectPartListener(partReadStream) {
    parsingParts++;
    operation.logger.debug('parsing part %d', parsingParts);

    partReadStream.on('header', partHeadersListener);
    partReadStream.on('error',  errorListener);
    partReaderQueue.addLast(partReadStream);

    if (partReaderQueue.isLast()) {
      isConcatenating = true;
      var partRead = concatStream(partFinisher);
      partRead.on('error', errorListener);
      partReadStream.pipe(partRead);
    }
  };

  var parseFinishListener = function objectParseFinishListener() {
    hasParsed = true;
    responseFinisher();
  };

  var responseEndListener = function objectResponseEndListener() {
    hasEnded = true;
    responseFinisher();
  };

  var drainListener = function objectDrainListener() {
    if (!hasEnded) {
      response.resume();
      // Don't read if concat in progress to avoid double processing
      if (partReaderQueue.hasItem() && !isConcatenating) {
        isConcatenating = true;
        var partRead = concatStream(partFinisher);
        partRead.on('error', errorListener);
        var partReadStream = partReaderQueue.getFirst();
        partReadStream.pipe(partRead);
      }
    }
  };

  var parser = new Dicer({boundary: boundary});
  parser.on('part',   partListener);
  parser.on('error',  errorListener);
  parser.on('finish', parseFinishListener);

  response.on('end', responseEndListener);

  operation.outputStream.on('drain', drainListener);

  response.pipe(parser);

};

/* Note:  Dicer appears to read ahead.
+ each type of event (such as header or end) fires in part order; however
+ for typical MarkLogic documents, part streams become available in batches
+ the header event fires when each part stream becomes available
+ if parts are piped as soon as available, the end event for one pipe
  can fire after the next pipe starts reading
+ thus, if parts are piped as soon as available, different types of events
  can interleave, as in:
    part reader 1
    header event 1
    part reader 2
    header event 2
    part data 1
    part data 2
    part end 1
    part end 2
    finish
 */

function FifoQueue(min) {
  if (!(this instanceof FifoQueue)) {
    return new FifoQueue(min);
  }
  this.queue = (min > 0) ? new Array(min) : [];
  this.first = -1;
  this.last  = -1;
  this.total = 0;
}
FifoQueue.prototype.addLast = function fifoAddLast(item) {
  this.last++;
  this.total++;
  if (this.first === -1) {
    this.first = this.last;
  }
  if (this.last < this.queue.length) {
    this.queue[this.last] = item;
  } else {
    this.queue.push(item);
  }
};
FifoQueue.prototype.hasItem = function fifoHasItem() {
  return (this.first >= 0);
};
FifoQueue.prototype.isLast = function fifoIsLast() {
  return (this.first >= 0 && this.first === this.last);
};
FifoQueue.prototype.getFirst = function fifoGetFirst() {
  return (this.first >= 0) ? this.queue[this.first] : undefined;
};
FifoQueue.prototype.removeFirst = function fifoRemoveFirst() {
  if (this.first >= 0) {
    this.queue[this.first] = undefined;
    if (this.first === this.last) {
      this.first = -1;
      this.last  = -1;
    } else {
      this.first++;
    }
  }
};
FifoQueue.prototype.pollFirst = function fifoPollFirst() {
  var item = this.getFirst();
  if (item !== undefined) {
    this.removeFirst();
  }
  return item;
};
FifoQueue.prototype.getQueue = function fifoGetQueue() {
  return (this.first === 0 && this.last === this.queue.length) ?
      this.queue : this.queue.slice(this.first, this.last + 1);
};
/*
FifoQueue.prototype.getLast = function fifoGetLast() {
  return (this.first >= 0) ? this.queue[this.last] : undefined;
};
FifoQueue.prototype.getTotal = function fifoGetTotal() {
  return this.total;
};
FifoQueue.prototype.length = function fifoLength() {
  return (this.first >= 0) ? (this.last - this.first) + 1 : 0;
};
FifoQueue.prototype.at = function fifoAt(i) {
  return this.queue[this.first + i];
};
FifoQueue.prototype.replaceLast = function fifoReplaceLast(item) {
  if (this.first >= 0) {
    this.queue[this.last] = item;
  }
};
FifoQueue.prototype.compact = function fifoCompact() {
  if (this.first > 0) {
    var last = (this.last - this.first);
    var next = 0;
    var i = 0;
    for (; i <= last; i++) {
      next = this.first + i;
      this.queue[i] = this.queue[next];
      this.queue[next] = null;
    }
    this.first = 0;
    this.last  = last;
  }
};
 */

function isResponseStatusOkay(response) {
  /*jshint validthis:true */
  var operation = this;

  var statusCode = response.statusCode;

  var errMsg = null;

  var statusCodeValidator = operation.statusCodeValidator;
  if (typeof statusCodeValidator === 'function') {
   errMsg = statusCodeValidator.call(operation, statusCode, response);
  } else {
    var validStatusCodes = operation.validStatusCodes;
    if (Array.isArray(validStatusCodes)) {
      var isError = true;
      for (var i=0; i < validStatusCodes.length; i++) {
        if (validStatusCodes[i] === statusCode) {
          isError = false;
          break;
        }
      }
      if (isError) {
        errMsg = 'response with invalid '+statusCode+' status';
      }
    } else if (statusCode >= 300) {
      errMsg = 'cannot process response with '+statusCode+' status';
    }
  }

  if (errMsg != null) {
    var clientError = operation.makeError(errMsg);
    clientError.statusCode = statusCode;
    if (statusCode >= 400) {
      response.pipe(concatStream(
          {encoding: 'string'},
          function errorBodyDispatcher(body) {
            if (body.length > 0) {
              var bodyMsg = (typeof body === 'string' || body instanceof String) ? body : body.toString();
              var contentType = response.headers['content-type'];
              clientError.body =
                ((typeof contentType === 'string' || contentType instanceof String) &&
                    /^application\/([^+]+\+)?json(\s*;.*)?$/.test(contentType)) ?
                mlutil.parseJSON(bodyMsg) : bodyMsg;
            }
            operation.errorListener(clientError);
          }));
    } else {
      operation.errorListener(clientError);
    }

    return false;
  }

  operation.startedResponse = true;
  return true;
}

function ResponseSelector(operation) {
  if (!(this instanceof ResponseSelector)) {
    return new ResponseSelector(operation);
  }
  this.result = mlutil.callbackOn(operation, operationResultPromise);
  this.stream = mlutil.callbackOn(operation, operationResultStream);
}
function operationResultPromise(fullfilled, rejected) {
  /*jshint validthis:true */
  var operation = this;

  switch (operation.outputMode) {
  case 'none':
    if (operation.startedResponse === true) {
      throw new Error('cannot create result promise after receiving response');
    }
    break;
  case 'promise':
    throw new Error('already created result promise');
  default:
    throw new Error('cannot create result promise after creating stream');
  }
  operation.outputMode = 'promise';

  var promise = new PromisePlus(function promiseDispatcher(resolve, reject) {
    if (operation.done !== true) {
      if (resolve) {
        operation.resolve = resolve;
      }
      if (reject) {
        operation.reject = reject;
      }
      return;
    }

    if (rejectedPromise(operation, reject)) {
      return;
    }

    resolvedPromise(operation, resolve);
  });

  switch(arguments.length) {
  case 0:  return promise.then();
  case 1:  return promise.then(fullfilled);
  default: return promise.then(fullfilled, rejected);
  }
}
function resolvedPromise(operation, resolve) {
  if (resolve == null) {
    return;
  }

  var data    = operation.data;
  var hasData = (data != null);
  var dataLen = hasData ? data.length : null;

  operation.logger.debug('promise resolving with '+(
      hasData ? (dataLen+' chunks of') : 'null'
      )+' data');

  if (!hasData) {
    resolve.call(operation);
  } else {
    resolve.call(operation, data);
  }
}
function rejectedPromise(operation, reject) {
  var errorArray = operation.error;
  if (!Array.isArray(errorArray)) {
    return false;
  }

  var errorLen = errorArray.length;
  if (errorLen === 0) {
    return false;
  }

  for (var i=0; i < errorLen; i++) {
    operation.logError(errorArray[i]);
  }

  if (reject == null) {
    return true;
  }

  operation.logger.debug('deferred promise rejecting with '+errorLen+' error messages');

  var firstError = errorArray[0];
  if (errorLen > 1) {
    firstError.otherErrors = errorArray.slice(1);
  }

  reject.call(operation, firstError);

  return true;
}
function operationResultStream() {
  /*jshint validthis:true */
  var operation = this;

  switch (operation.outputMode) {
  case 'none':
    if (operation.startedResponse === true) {
      throw new Error('cannot create stream after receiving response');
    }
    break;
  case 'promise':
    throw new Error('cannot create stream after creating result promise');
  default:
    throw new Error('already created stream');
  }

  var streamArg  = (arguments.length > 0) ? arguments[0] : null;
  var streamMode = null;
  if (streamArg === null) {
    streamMode = operation.streamDefaultMode;
    operation.outputStreamMode = streamMode;
  } else if (operation.outputStreamMode != null) {
    if (streamArg !== operation.outputStreamMode) {
      throw new Error('cannot change stream mode from: '+operation.outputStreamMode);
    }
  } else if (operation.streamModes[streamArg] === true) {
    streamMode = streamArg;
    operation.outputStreamMode = streamMode;
  } else {
    throw new Error('stream mode not supported for this request: '+streamArg);
  }
  operation.outputMode = streamMode+'Stream';

  var outputStream = null;
  switch(streamMode) {
  case 'chunked':
    outputStream = through2();
    break;
  case 'object':
    outputStream= through2({objectMode: true});
    break;
  case 'sequence':
    outputStream= through2();
    break;
  default:
    throw new Error('unknown stream mode: '+streamMode);
  }
  operation.outputStream = outputStream;

  var error = operation.error;
  if (error != null) {
    var i = 0;
    for (; i < error.length; i++) {
      outputStream.emit('error', error[i]);
    }
    operation.error = undefined;
  }

  return outputStream;
}
function operationErrorListener(error) {
  /*jshint validthis:true */
  var operation = this;

  operation.dispatchError(error);

  operation.done = true;

  var outputStream = operation.outputStream;
  if (outputStream != null) {
    outputStream.end();

    operation.outputStream = undefined;

    return;
  }

  if (rejectedPromise(operation, operation.reject)) {
    return;
  }

  resolvedPromise(operation, operation.resolve);
}

module.exports = {
    operationErrorListener: operationErrorListener,
    operationResultPromise: operationResultPromise,
    responseDispatcher:     responseDispatcher,
    ResponseSelector:       ResponseSelector
};
