/*
* Copyright (c) 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/
'use strict';
const concatStream = require('concat-stream');
const jsonParser   = require('json-text-sequence').Parser;
const Dicer        = require('@fastify/busboy/deps/dicer/lib/Dicer');
const through2     = require('through2');
const mlutil       = require('./mlutil.js');
const requester = require('./requester');
const {createGunzip} = require('zlib');

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
  const operation = this;

  if (!isResponseStatusOkay.call(operation, response)) {
    return;
  }

  const outputMode = operation.outputMode;
  if (outputMode === 'none') {
    return;
  }

  const responseType     = response.headers['content-type'];
  const responseTypeLen  = (!responseType) ? 0 : responseType.length;
  let responseBoundary = null;
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
  const isMultipart = (responseBoundary != null);

  // inputHeader may be boundary (for multipart) or content type (for body)
  // Allows dispatch function signatures to remain consistent
  const inputHeader = isMultipart ? responseBoundary : responseType;

  const responseLength = response.headers['content-length'];
  const isEmpty = ((responseLength != null) && responseLength === '0');

  const expectedType = operation.responseType;

  // point-in-time operations: if timestamp unset, set with header value
  if (operation.timestamp !== undefined && operation.timestamp !== null) {
    if (operation.timestamp.value === null &&
        response.headers['ml-effective-timestamp']) {
      operation.timestamp.value = response.headers['ml-effective-timestamp'];
    }
  }

  let dispatcher = null;
  if (isMultipart) {
    if (expectedType !== 'multipart') {
      operation.logger.debug('expected body but received multipart');
    }

    if (operation.onMultipart){
      operation.onMultipart(response.headers);
    }

    dispatcher = new MultipartDispatcher(operation);
  } else if (20 <= responseTypeLen && responseType && responseType.substr(0, 20) === 'application/json-seq') {
    dispatcher = new JSONSeqDispatcher(operation);
  } else if (8 <= responseTypeLen && responseType && responseType.substr(0, 8) === 'text/csv') {
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
  const operation = this.operation;

  operation.logger.debug('csv promise');
  const collectObject = function collectPromiseBodyObject(data) {
    operation.data = data;
    resolvedPromise(operation, operation.resolve);
  };

  const isString = operation.copyResponseHeaders(response);
  if(isResponseGzipped(response.headers)) {
    response.pipe(createGunzip()).pipe(concatStream(
        {encoding: (isString ? 'string' : 'buffer')},
        collectObject
    ));
  } else {
    response.pipe(concatStream(
        {encoding: (isString ? 'string' : 'buffer')},
        collectObject
    ));
  }
};
CSVDispatcher.prototype.chunkedStream = function dispatchCSVChunkedStream(
    contentType, response
    ) {
  const operation = this.operation;

  operation.logger.debug('csv chunked stream');

  // HTTP response gives a chunked stream to begin with
  // .stream('chunked') creates through2 stream (writable and readable)
  // Simply pipe HTTP response to the through2 stream
  if(isResponseGzipped(response.headers)) {
    response.pipe(createGunzip()).pipe(operation.outputStream);
  } else {
    response.pipe(operation.outputStream);
  }
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
  const operation     = this.operation;
  const errorListener = operation.errorListener;
  let objectQueue   = new FifoQueue(2);
  let parsedObjects = 0;

  operation.logger.debug('json sequence promise');

  let dataListener = function JSONSeqDataListener(object) {
    parsedObjects++;
    operation.logger.debug('json-seq parsing object %d', parsedObjects);
    objectQueue.addLast(object);
  };

  let finishListener = function JSONSeqFinishListener() {
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
  if(isResponseGzipped(response.headers)) {
    response.pipe(createGunzip()).pipe(parser);
  } else {
    response.pipe(parser);
  }

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
  const operation     = this.operation;
  const errorListener = operation.errorListener;
  const outputStream = operation.outputStream;
  let parsedObjects = 0;
  let hasParsed = false;
  let hasEnded = false;

  operation.logger.debug('json sequence stream ' + streamMode);

  let dataListener = function JSONSeqDataListener(object) {
    parsedObjects++;
    operation.logger.debug('parsing object %d', parsedObjects);
    operation.logger.debug(object);

    let writeResult = null;
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

  let responseFinisher = function JSONSeqFinishListener() {

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
  if(isResponseGzipped(response.headers)) {
    response.pipe(createGunzip()).pipe(parser);
  } else {
    response.pipe(parser);
  }
};

function BodyDispatcher(operation) {
  if (!(this instanceof BodyDispatcher)) {
    return new BodyDispatcher(operation);
  }

  this.operation = operation;
}
BodyDispatcher.prototype.emptyPromise = function dispatchBodyEmptyPromise(response) {
  const operation = this.operation;

  operation.logger.debug('empty body promise');

  operation.data = operation.emptyHeaderData(response);
  resolvedPromise(operation, operation.resolve);
};
BodyDispatcher.prototype.emptyStream = function dispatchBodyEmptyStream(response) {
  const operation = this.operation;

  const data = operation.emptyHeaderData(response);

  operation.logger.debug('empty body stream');

  const outputStream = operation.outputStream;
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
  const operation = this.operation;

  operation.logger.debug('body promise');
  const collectObject = function collectPromiseBodyObject(data) {
    // turn collected data into something usable
    // e.g., if JSON, parse as JS object
    operation.data = operation.collectBodyObject(data);
    resolvedPromise(operation, operation.resolve);
  };

  const isString = operation.copyResponseHeaders(response);

  if(isResponseGzipped(response.headers)) {
    const gunzip = createGunzip();
    response.pipe(gunzip).pipe(concatStream(
        {encoding: (isString ? 'string' : 'buffer')},
        collectObject
    ));

  } else {
    // concatStream accumulates response with callback
    response.pipe(concatStream(
        {encoding: (isString ? 'string' : 'buffer')},
        collectObject
    ));
  }
};
BodyDispatcher.prototype.chunkedStream = function dispatchBodyChunkedStream(
    contentType, response
    ) {
  const operation = this.operation;

  operation.logger.debug('body chunked stream');

  // HTTP response gives a chunked stream to begin with
  // .stream('chunked') creates through2 stream (writable and readable)
  // Simply pipe HTTP response to the through2 stream
  if(isResponseGzipped(response.headers)) {
    response.pipe(createGunzip()).pipe(operation.outputStream);
  } else {
    response.pipe(operation.outputStream);
  }
};
BodyDispatcher.prototype.objectStream = function dispatchBodyObjectStream(
    contentType, response
    ) {
  const operation = this.operation;

  operation.logger.debug('body object stream');

  // outputStream is a through2 stream in object mode
  const outputStream = operation.outputStream;

  const collectObject = function collectStreamBodyObject(data) {
    // similar to promise body case, but write to through2
    const writableObject = operation.collectBodyObject(data);
    if (writableObject != null) {
      outputStream.write(writableObject);
    }
    outputStream.end();
  };

  const isString = operation.copyResponseHeaders(response);
  if(isResponseGzipped(response.headers)) {
    response.pipe(createGunzip()).pipe(concatStream(
        {encoding: (isString ? 'string' : 'buffer')},
        collectObject
    ));
  } else {
    response.pipe(concatStream(
        {encoding: (isString ? 'string' : 'buffer')},
        collectObject
    ));
  }
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
  const operation = this.operation;

  const data = operation.emptyHeaderData(response);

  operation.logger.debug('empty multipart promise');

  operation.data = (data == null) ? [] : [data];
  resolvedPromise(operation, operation.resolve);
};
MultipartDispatcher.prototype.emptyStream = function dispatchMultipartEmptyStream(response) {
  const operation = this.operation;

  const data = operation.emptyHeaderData(response);

  operation.logger.debug('empty multipart stream');

  const outputStream = operation.outputStream;
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
  const operation = this.operation;
  operation.logger.debug('multipart promise');

  const errorListenerCheck = (operation.options.headers.Accept === 'application/json' && (operation.name.includes('rows') || operation.name.includes('query') || operation.name.includes('/v1/rows')));

  if(errorListenerCheck) {
    if(response.headers['content-encoding']!=='gzip'){
      response.setEncoding('utf8');
    }

    const multipartResponse = (isResponseGzipped(response.headers))?response.pipe(createGunzip()):response;
    let chunks = '';

    multipartResponse.on('data', function(data) {
      chunks += data;
    });
    multipartResponse.on('end', function() {
      response.pipe(concatStream(
          {encoding: 'json'},
          () => {
            const data = JSON.parse(chunks);
            operation.data = data;
            resolvedPromise(operation, operation.resolve);
          }
      ));
    });
    return;
  }

  const errorListener = operation.errorListener;

  let rawHeaderQueue  = new FifoQueue(2);
  let objectQueue     = new FifoQueue(2);
  let partReaderQueue = new FifoQueue(3);

  let parsingParts = 0;
  let parsedParts  = 0;

  let hasParsed = false;
  let hasEnded  = false;

  let responseFinisher = function promiseResponseFinisher() {
    // If there is metadata left in the buffer, add it to queue
    if (operation.nextMetadataBuffer !== null) {
      const metadataHeaders = operation.nextMetadataBuffer[0];
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

    const madeObject = operation.makeObject(
        (data.length === 0) ? null : data, rawHeaderQueue
        );

    if (madeObject !== null && madeObject !== undefined) {
      objectQueue.addLast(madeObject);
    }

    if (partReaderQueue.hasItem()) {
      const partConcatenator = concatStream(partFinisher);
      partConcatenator.on('error', errorListener);

      const partReadStream = partReaderQueue.getFirst();
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
      const partConcatenator = concatStream(partFinisher);
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
  if(isResponseGzipped(response.headers)) {
    response.pipe(createGunzip()).pipe(parser);
  } else {
    response.pipe(parser);
  }
};
MultipartDispatcher.prototype.chunkedStream = function dispatchMultipartChunkedStream(
    boundary, response
    ) {
  const operation = this.operation;
  operation.logger.debug('multipart chunked stream');

  const errorListener = operation.errorListener;

  let outputStream = operation.outputStream;

  const partReaderQueue = new FifoQueue(3);

  let hasParsed = false;
  let hasEnded  = false;

  let responseFinisher = function chunkedResponseFinisher() {
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
      const partReadStream = partReaderQueue.getFirst();
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
  if(isResponseGzipped(response.headers)) {
    response.pipe(createGunzip()).pipe(parser);
  } else {
    response.pipe(parser);
  }
};
MultipartDispatcher.prototype.objectStream = function dispatchMultipartObjectStream(
    boundary, response
    ) {
  const operation = this.operation;
  operation.logger.debug('multipart object stream');

  const errorListener   = operation.errorListener;

  let rawHeaderQueue = new FifoQueue(5);
  const partReaderQueue = new FifoQueue(3);

  // For referenced attachments case
  let partBuffer = null;

  let parsingParts = 0;
  let parsedParts  = 0;

  let hasParsed = false;
  let hasEnded  = false;

  let isConcatenating = false;

  const responseFinisher = function objectResponseFinisher() {

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
          const metadataHeaders = operation.nextMetadataBuffer[0];
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

  const partFinisher = function objectPartFinisher(data) {
    parsedParts++;
    operation.logger.debug('parsed part %d', parsedParts);

    const madeObject = operation.makeObject(
      (data.length === 0) ? null : data, rawHeaderQueue
    );

    // Handle multipart with reference attachments (rows)
    let writeResult = null;
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
          const columnName = madeObject.contentId
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
      const partRead = concatStream(partFinisher);
      partRead.on('error', errorListener);
      const partReadStream = partReaderQueue.getFirst();
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
      const partRead = concatStream(partFinisher);
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

  const drainListener = function objectDrainListener() {
    if (!hasEnded) {
      response.resume();
      // Don't read if concat in progress to avoid double processing
      if (partReaderQueue.hasItem() && !isConcatenating) {
        isConcatenating = true;
        const partRead = concatStream(partFinisher);
        partRead.on('error', errorListener);
        const partReadStream = partReaderQueue.getFirst();
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
  if(isResponseGzipped(response.headers)) {
    response.pipe(createGunzip()).pipe(parser);
  } else {
    response.pipe(parser);
  }
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
  const item = this.getFirst();
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
  const operation = this;

  const statusCode = response.statusCode;

  let errMsg = null;

  const statusCodeValidator = operation.statusCodeValidator;
  if (typeof statusCodeValidator === 'function') {
    errMsg = statusCodeValidator.call(operation, statusCode, response);
  } else {
    const validStatusCodes = operation.validStatusCodes;
    if (Array.isArray(validStatusCodes)) {
      let isError = true;
      for (let i=0; i < validStatusCodes.length; i++) {
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
    const clientError = operation.makeError(errMsg);
    clientError.statusCode = statusCode;
    if (statusCode >= 400) {
      const errorResponse = (isResponseGzipped(response.headers))?response.pipe(createGunzip()):response;
      errorResponse.pipe(concatStream(
          {encoding: 'string'},
          function errorBodyDispatcher(body) {
            if (body.length > 0) {
              const bodyMsg = (typeof body === 'string' || body instanceof String) ? body : body.toString();
              const contentType = response.headers['content-type'];
              clientError.body =
                ((typeof contentType === 'string' || contentType instanceof String) &&
                    /^application\/([^+]+\+)?json(\s*;.*)?$/.test(contentType)) ?
                mlutil.parseJSON(bodyMsg) : bodyMsg;

              // Enhance error message with response body details for better debugging
              clientError.message = `${clientError.message}; server response: ${bodyMsg}`;
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
  const operation = this;

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

  const promise = new Promise(function promiseDispatcher(resolve, reject) {
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

  const data    = operation.data;
  const hasData = (data != null);
  const dataLen = hasData ? data.length : null;
  if(hasData && dataLen) {
    for(let i=0; i<data.length; i++){
      if(data[i] && data[i].value &&
          data[i].format === 'text' && Buffer.isBuffer(data[i].value)){
        data[i].value = data[i].value.toString();
      }
    }
  }

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
  const errorArray = operation.error;
  if (!Array.isArray(errorArray)) {
    return false;
  }

  const errorLen = errorArray.length;
  if (errorLen === 0) {
    return false;
  }

  for (let i=0; i < errorLen; i++) {
    operation.logError(errorArray[i]);
  }

  if (reject == null) {
    return true;
  }

  operation.logger.debug('deferred promise rejecting with '+errorLen+' error messages');

  const firstError = errorArray[0];
  if (errorLen > 1) {
    firstError.otherErrors = errorArray.slice(1);
  }

  reject.call(operation, firstError);

  return true;
}
function operationResultStream() {
  /*jshint validthis:true */
  const operation = this;

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

  const streamArg  = (arguments.length > 0) ? arguments[0] : null;
  let streamMode = null;
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

  let outputStream = null;
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

  const error = operation.error;
  if (error != null) {
    let i = 0;
    for (; i < error.length; i++) {
      outputStream.emit('error', error[i]);
    }
    operation.error = undefined;
  }

  return outputStream;
}
function operationErrorListener(error) {
  /*jshint validthis:true */
  const operation = this;
  if(operation.client.connectionParams.apiKey){
    if(error.statusCode === 401 && operation.expiration <= (new Date())){
      if(!operation.lockAccessToken){
        operation.lockAccessToken = true;
        requester.getAccessToken(operation);
      } else {
        requester.startRequest(operation);
      }
      return;
    }
  }
  const errorMessage = error.message ? error.message.toString(): null;
  if(errorMessage && errorMessage.includes('EPROTO') && errorMessage.includes('SSL routines') &&
      (errorMessage.includes('wrong version number') || errorMessage.includes('WRONG_VERSION_NUMBER'))) {
    error = new Error('You have attempted to access an HTTP server using HTTPS. Please check your configuration.\n' +
        errorMessage);
  }
  operation.dispatchError(error);

  operation.done = true;

  const outputStream = operation.outputStream;
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

function isResponseGzipped(headers){
  return (headers['content-encoding'] === 'gzip' || headers['Content-Encoding'] === 'gzip');
}

module.exports = {
    operationErrorListener: operationErrorListener,
    operationResultPromise: operationResultPromise,
    responseDispatcher:     responseDispatcher,
    ResponseSelector:       ResponseSelector
};
