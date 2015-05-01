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
'use strict';
var stream       = require('stream');
var util         = require('util');
var concatStream = require('concat-stream');
var Dicer        = require('dicer');
var through2     = require('through2');
var valcheck     = require('core-util-is');
var PromisePlus  = require('./bluebird-plus.js');
var mlutil       = require('./mlutil.js');

function responseDispatcher(response) {
  /*jshint validthis:true */
  var operation = this;

  if (!isResponseStatusOkay.call(operation, response)) {
    return;
  }

  var outputMode = operation.outputMode;
  if (outputMode === 'none') {
    response.destroy();
    return;
  }

  var responseType     = response.headers['content-type'];
  var responseTypeLen  = valcheck.isNullOrUndefined(responseType) ? 0 : responseType.length;
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
  var isMultipart = (!valcheck.isNullOrUndefined(responseBoundary));

  var inputHeader = isMultipart ? responseBoundary : responseType;

  var responseLength = response.headers['content-length'];
  var isEmpty = (!valcheck.isNullOrUndefined(responseLength) && responseLength === '0');

  var expectedType = operation.responseType;

  var dispatcher = null;
  if (isMultipart) {
    if (expectedType !== 'multipart') {
      operation.logger.debug('expected body but received multipart');
    }

    dispatcher = new MultipartDispatcher(operation);
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

    response.destroy();

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
    default:
      operation.errorListener('unknown output mode '+outputMode);
      break;
    }
  }
}

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
  if (!valcheck.isNullOrUndefined(data)) {
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
    operation.data = operation.collectBodyObject(data);
    resolvedPromise(operation, operation.resolve);
    collectObject = null;
  };

  var isString = operation.copyResponseHeaders(response);

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

  response.pipe(operation.outputStream);
};
BodyDispatcher.prototype.objectStream = function dispatchBodyObjectStream(
    contentType, response
    ) {
  var operation = this.operation;
  
  operation.logger.debug('body object stream');

  var outputStream = operation.outputStream;

  var collectObject = function collectStreamBodyObject(data) {
    var writableObject = operation.collectBodyObject(data);
    if (!valcheck.isNullOrUndefined(writableObject)) {
      outputStream.write(writableObject);
    }
    outputStream.end();

    collectObject = null;
  };

  var isString = operation.copyResponseHeaders(response);

  response.pipe(concatStream(
      {encoding: (isString ? 'string' : 'buffer')},
      collectObject
      ));
};

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

  operation.data = valcheck.isNullOrUndefined(data) ? [] : [data];
  resolvedPromise(operation, operation.resolve);
};
MultipartDispatcher.prototype.emptyStream = function dispatchMultipartEmptyStream(response) {
  var operation = this.operation;

  var data = operation.emptyHeaderData(response);

  operation.logger.debug('empty multipart stream');

  var outputStream = operation.outputStream;
  if (!valcheck.isNullOrUndefined(data)) {
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

  var errorListener = operation.errorListener;

  var rawHeaderQueue  = new FifoQueue(2);
  var objectQueue     = new FifoQueue(2);
  var partReaderQueue = new FifoQueue(3);

  var metadataBuffer  = null;

  var parsingParts = 0;
  var parsedParts  = 0;

  var hasParsed = false;
  var hasEnded  = false;

  var responseFinisher = function promiseResponseFinisher() {
    if (metadataBuffer !== null) {
      operation.queueMetadata(metadataBuffer, objectQueue);
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

    metadataBuffer = operation.queueDocument(
        (data.length === 0) ? null : data, rawHeaderQueue, metadataBuffer, objectQueue
        );

    if (partReaderQueue.hasItem()) {
      var partConcatenator = concatStream(partFinisher);
      partConcatenator.on('error', errorListener);

      var partReadStream = partReaderQueue.getFirst();
      partReadStream.pipe(partConcatenator);
    } else if (hasParsed) {
      responseFinisher();
    } else if (!hasEnded) {
      parser.emit('drain');
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
    } else if (!hasEnded) {
      parser.emit('drain');
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
  
  var errorListener   = operation.errorListener;

  var rawHeaderQueue = new FifoQueue(5);
  var metadataBuffer = null;

  var parsingParts = 0;
  var parsedParts  = 0;

  var hasParsed = false;
  var hasEnded  = false;

  var partTransform = function objectPartQueueTransform(
      isLast, data, objectQueue
      ) {
    parsedParts++;
    metadataBuffer = operation.queueDocument(
        (data.length === 0) ? null : data, rawHeaderQueue, metadataBuffer, objectQueue
        );

    if (isLast) {
      if (metadataBuffer !== null) {
        operation.queueMetadata(metadataBuffer, objectQueue);
        metadataBuffer = null;
      }

      rawHeaderQueue      = null;
      queuedReader        = null;
      parser              = null;
      partHeadersListener = null;
      partListener        = null;
      parseFinishListener = null;
      responseEndListener = null;
      partTransform       = null;
    } else if (!hasEnded && parsedParts === parsingParts) {
      parser.emit('drain');
    }
  };

  var queuedReader = new QueuedReader(
      {objectMode: true}, operation.logger, partTransform
      );
  this.queuedReader = queuedReader;

  var partHeadersListener = function objectPartHeadersListener(headers) {
    operation.logger.debug('queued header');
    rawHeaderQueue.addLast(headers);
  };

  var partListener = function objectPartListener(partReadStream) {
    parsingParts++;
    partReadStream.on('header', partHeadersListener);
    partReadStream.on('error',  errorListener);
    queuedReader.addReader(partReadStream);
  };

  var parseFinishListener = function promiseParseFinishListener() {
    hasParsed = true;
    if (queuedReader !== null) {
      queuedReader.queuedAll();
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

  queuedReader.pipe(operation.outputStream);
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
function QueuedReader(options, logger, itemsTransform) {
  if (!(this instanceof QueuedReader)) {
    return new QueuedReader(options, logger, itemsTransform);
  }
  stream.Readable.call(this, options);

  var self = this;

  this.itemsTransform = itemsTransform;
  this.logger         = logger;

  this.minWriters =  5;
  this.maxItems   = 10;

  this.readerQueue = new FifoQueue(10);
  this.writerQueue = new FifoQueue(this.minWriters);
  this.itemQueue   = new FifoQueue(this.maxItems);

  this.isReading = true;
  this.queueDone = false;

  this.addItems = function queuedReaderAddItems(data) {
    self.writerQueue.removeFirst();

    self.logger.debug('concatenated item');

    var isLast = (self.queueDone && self.readerQueue.length() === 0 &&
        self.writerQueue.length() === 0);

    var itemQueue    = self.itemQueue;
    var beforeLength = itemQueue.length();

    self.itemsTransform(isLast, data, itemQueue);

    if (beforeLength < itemQueue.length()) {
      if (beforeLength === 0) {
        self.emit('readable');
      }
      if (self.isReading || isLast) {
        logger.debug('writing first item');
        self.isReading = self.push(itemQueue.pollFirst());
      }
    }

    self.nextReader();
  };
}
util.inherits(QueuedReader, stream.Readable);
QueuedReader.prototype.addReader = function queuedAddReader(reader) {
  var readerQueue = this.readerQueue;
  if (readerQueue === null) {
    return;
  }

  readerQueue.addLast(reader);
  this.logger.debug('queued item %d', readerQueue.getTotal());
  this.nextReader();
};
QueuedReader.prototype.nextReader = function queuedReaderNextReader() {
  if (!this.isReading) {
    return;
  }

  var readerQueue = this.readerQueue;
  if (readerQueue === null || readerQueue.length() === 0) {
    return;
  }

  if (this.itemQueue.length() >= this.maxItems) {
    return;
  }

  var writerQueue = this.writerQueue;
  var minWriters  = this.minWriters;

  var logger = this.logger;

  var addItems = this.addItems;

  var i = writerQueue.length();
  var j = readerQueue.length();
  var writer = null;
  for (; i <= minWriters && j > 0; i++, j--) {
    writer = concatStream(addItems);
    writerQueue.addLast(writer);
    logger.debug('reading item');
    readerQueue.pollFirst().pipe(writer);
  }
};
QueuedReader.prototype._read = function queuedReaderRead(/*size*/) {
  var itemQueue = this.itemQueue;
  if (itemQueue === null) {
    return;
  }

  var logger = this.logger;

  var hasItem = itemQueue.hasItem();
  var canRead = true;
  while (hasItem && canRead) {
    logger.debug('writing item');
    canRead = this.push(itemQueue.pollFirst());
    hasItem = itemQueue.hasItem();
  }

  if (this.queueDone && !hasItem && this.readerQueue.length() === 0 &&
      this.writerQueue.length() === 0) {
    this.logger.debug('wrote %d items', itemQueue.getTotal());
    this.push(null);

    this.readerQueue = null;
    this.writerQueue = null;
    this.itemQueue   = null;
  } else if (!canRead) {
    if (this.isReading) {
      this.isReading = false;
    }
  } else {
    if (!this.isReading) {
      this.isReading = true;
    }
    this.nextReader();
  }
};
QueuedReader.prototype.queuedAll = function queuedReaderAll() {
  if (!this.queueDone) {
    this.logger.debug('queued all items');
    this.queueDone = true;
  }
};

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
FifoQueue.prototype.getLast = function fifoGetLast() {
  return (this.first >= 0) ? this.queue[this.last] : undefined;
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
FifoQueue.prototype.getTotal = function fifoGetTotal() {
  return this.total;
};
FifoQueue.prototype.getQueue = function fifoGetQueue() {
  return (this.first === 0 && this.last === this.queue.length) ?
      this.queue : this.queue.slice(this.first, this.last + 1);
};
FifoQueue.prototype.length = function fifoLength() {
  return (this.first >= 0) ? (this.last - this.first) + 1 : 0;
};
/*
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
  if (valcheck.isFunction(statusCodeValidator)) {
    errMsg = statusCodeValidator.call(operation, statusCode);
  } else {
    var validStatusCodes = operation.validStatusCodes;
    if (valcheck.isArray(validStatusCodes)) {
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

  if (!valcheck.isNullOrUndefined(errMsg)) {
    var clientError = operation.makeError(errMsg);
    clientError.statusCode = statusCode;
    if (statusCode >= 400) {
      response.pipe(concatStream(
          {encoding: 'string'},
          function errorBodyDispatcher(body) {
            if (body.length > 0) {
              var bodyMsg = valcheck.isString(body) ? body : body.toString();
              var contentType = response.headers['content-type'];
              clientError.body =
                (valcheck.isString(contentType) &&
                    contentType.match(/^application\/json(;.*)?$/)) ?
                mlutil.parseJSON(bodyMsg) : bodyMsg;
            }
            operation.errorListener(clientError);
          }));
    } else {
      operation.errorListener(clientError);
      response.destroy();
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
  if (valcheck.isNullOrUndefined(resolve)) {
    return;
  }

  var data    = operation.data;
  var hasData = !valcheck.isNullOrUndefined(data);
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
  if (!valcheck.isArray(errorArray)) {
    return false;
  }

  var errorLen = errorArray.length;
  if (errorLen === 0) {
    return false;
  }

  for (var i=0; i < errorLen; i++) {
    operation.logError(errorArray[i]);
  }

  if (valcheck.isNullOrUndefined(reject)) {
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
  } else if (!valcheck.isNullOrUndefined(operation.outputStreamMode)) {
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
  default:
    throw new Error('unknown stream mode: '+streamMode);
  }
  operation.outputStream = outputStream;

  var error = operation.error;
  if (!valcheck.isNullOrUndefined(error)) {
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
  if (!valcheck.isNullOrUndefined(outputStream)) {
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
