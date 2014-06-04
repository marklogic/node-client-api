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
var util            = require("util");
var stream          = require('stream');
var Dicer           = require('dicer');
var multipartStream = require('multipart').createMultipartStream;
var mlrest          = require('./mlrest.js');

var multipartBoundary = 'MLBOUND_' + Date.UTC(2014,12,31);
var NEWLINE = '\r\n';

function isString(o) {
  return (typeof(o) === 'string' || o instanceof String);
}

function initRequestOptions(config) {
  var requestOptions = {};
  for (var key in config) {
      requestOptions[key] = config[key];
  }
  return requestOptions;
}

function parsePartHeaders(headers) {
  var partHeaders = {};

  if (headers['content-disposition']) {
    var contentDisposition = headers['content-disposition'][0];
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
          } else if (key === 'inline' || key === 'attachment') {
            partHeaders.partType = key;
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
  if (headers['content-type']) {
    partHeaders.contentType = headers['content-type'][0];
  }
  if (headers['content-length']) {
    partHeaders.contentLength = headers['content-length'][0];
  }

  return partHeaders;
}  

function requestErrorHandler(e) {
  console.log('problem with request: ' + e.message);
  throw new Error(e.message);
}

function checkEventMapper(response, proxy) {
  proxy.emit('data', (response.statusCode < 300));
  proxy.emit('end');
  response.resume();
}
function checkDocument() {
  if (arguments.length != 1) {
    throw new Error('must supply uri for document check()');
  }

  var params = (!isString(arguments[0])) ? arguments[0] : null; 

  var path = '/v1/documents?format=json';
  if (params === null) {
    path += '&uri='+arguments[0];
  } else {
    path += '&uri='+params.uri;
    if ('transactionId' in params) {
      path += '&txid='+params.transactionId;
    }
  }

  var requestOptions = initRequestOptions(this.client.connectionParams);
  requestOptions.method = 'HEAD';
  requestOptions.path = path ;

  var responseProxy = mlrest.response(checkEventMapper, true);

  // TODO: pass proxy instead of collector
  var request = mlrest.request(
    this.client, requestOptions, false, responseProxy.collector
    );
  request.on('error', requestErrorHandler);
  request.end();

  return mlrest.responder(responseProxy, false);
}

function copyProperties(source, target) {
  for (var key in source.content) {
    target[key] = source.content[key];
  }
}
function emitMetadata(metadata, proxy) {
  copyProperties(metadata, metadata);
  delete metadata.content;
  proxy.emit('data', metadata);
}
function multipartEventMapper(response, proxy) {
  // TODO: bulk read should insert parts for documents that don't exist
  // TODO: empty response should not be multipart/mixed 
  var responseLength = response.headers['content-length'];
  if (responseLength === undefined || responseLength === "0") {
    console.log('empty response');
    response.on('data', requestErrorHandler);
    response.on('error', requestErrorHandler);
    return response;
  }
  var responseType = response.headers['content-type'];
  if (responseType === undefined || !responseType.match(/^multipart.mixed.*$/)) {
    response.on('data', requestErrorHandler);
    response.on('error', requestErrorHandler);
    return response;
  }

  // TODO: extract boundary
  var parser = new Dicer({boundary: multipartBoundary});
  parser.on('error', requestErrorHandler);

  var metadata = null;
  if (proxy.resolve || proxy.reject) {
    parser.on('part', function(part) {
      var partHeaders = null;
      var isInline    = false;
      var format      = null;
      var isMetadata  = false;
      var isUtf8      = false;
      var partContent = null;
      part.on('error', requestErrorHandler);
      part.on('header', function(headers) {
        partHeaders = parsePartHeaders(headers);
        isInline = (partHeaders.partType === 'inline');
        format = partHeaders.format;
        if (format === undefined) {
          format = contentTypeToFormat(partHeaders.contentType);
        }
        isMetadata  = (partHeaders.category && partHeaders.category !== 'content');
        isUtf8 = (
            isInline || isMetadata || format === 'json' || format === 'text' || format === 'xml'
            );
        if (isUtf8) {
          // TODO: confirm that it is not too late to set the encoding
          partContent = [];
          part.setEncoding('utf8');
        }
      });
      part.on('data', function(chunk) {
        if (isUtf8) {
          partContent.push(chunk);
        } else {
          if (metadata !== null) {
            emitMetadata(metadata, proxy);
            metadata = null;
          }
          if (chunk) {
            proxy.emit('data', chunk);
          }
        }
      });
      part.on('end', function() {
        // TODO: remove partType key from partHeaders
        // TODO: option for whether and how to parse the JSON or XML metadata or content
        // TODO: branch to aggregates, binaries, metrics, plan
        if (isUtf8) {
          partHeaders.content = (format === 'json') ?
              JSON.parse(partContent.join('')) : partContent.join('');
          if (metadata !== null && metadata.uri !== partHeaders.uri) {
            emitMetadata(metadata, proxy);
            metadata = null;
          }

          if (isInline) {
            proxy.emit('data', partHeaders.content);
          } else if (isMetadata) {
            metadata = partHeaders;
          } else {
            if (metadata !== null) {
              copyProperties(metadata, partHeaders);
              metadata = null;
            }
            proxy.emit('data', partHeaders);
          }
        }
      });
    });

    parser.on('finish', function() {
      if (metadata !== null) {
        emitMetadata(metadata, proxy);
      }
      proxy.emit('end');
    });
  } else {
    // TODO: branch on search callbacks
    // TODO: flush the last part
    parser.on('part', function(part) {
      var partHeaders = null;
      var isInline    = false;
      var format      = null;
      var isMetadata  = false;
      var isUtf8      = false;
      var partContent    = null;
      part.on('error', requestErrorHandler);
      part.on('header', function(headers) {
        partHeaders = parsePartHeaders(headers);
        isInline    = (partHeaders.partType === 'inline');
        format      = partHeaders.format;
        if (format === undefined) {
          format = contentTypeToFormat(partHeaders.contentType);
        }
        isMetadata  = (partHeaders.category && partHeaders.category !== 'content');
        isUtf8 = (
            isInline || isMetadata || format === 'json' || format === 'text' || format === 'xml'
            );
        if (isUtf8) {
          // TODO: confirm that it is not too late to set the encoding
          partContent = [];
          part.setEncoding('utf8');
        }
      });
      part.on('data', function(chunk) {
        if (isUtf8) {
          partContent.push(chunk);
        } else {
          if (metadata) {
            proxy.emit('result', metadata);
            metadata = null;
          }
          proxy.emit('data', chunk);
        }
      });
      part.on('end', function() {
        // TODO: remove partType key from partHeaders
        // TODO: option for whether and how to parse the JSON or XML metadata or content
        // TODO: branch to aggregates, binaries, metrics, plan
        if (isUtf8) {
          partHeaders.content = (format === 'json') ?
            JSON.parse(partContent.join('')) : partContent.join('');
          if (metadata !== null && metadata.uri !== partHeaders.uri) {
            emitMetadata(metadata, proxy);
            metadata = null;
          }

          if (isInline) {
            proxy.emit('summary', partHeaders.content);
          } else if (isMetadata) {
            metadata = partHeaders;
          } else {
            if (metadata !== null) {
              copyProperties(metadata, partHeaders);
              metadata = null;
            }
            proxy.emit('result', partHeaders);
          }
        } else {
          proxy.emit('resultEnd');
        }
      });
    });

    parser.on('finish', function() {
      if (metadata !== null) {
        emitMetadata(metadata, proxy);
      }
      proxy.emit('end');
    });
  }

  response.pipe(parser);
}
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
function readDocument() {
  if (arguments.length !== 1) {
    throw new Error('incorrect number of arguments for document query()');
  }

  var params = (!isString(arguments[0])) ? arguments[0] : null; 

// TODO: set format to JSON only if metadata, set flag to force mapping
  var path = '/v1/documents?format=json';
  if (params === null) {
    path += '&uri='+arguments[0];
  } else {
    var categories = ('categories' in params) ? params.categories : 'content';
    path += '&uri='+params.uri + '&category=' + (
        (categories instanceof Array) ? categories.join('&category=') : categories
        );
    if ('transactionId' in params) {
      path += '&txid='+params.transactionId;
    }
// TODO: transform, range[from, to]
  }

  var requestOptions = initRequestOptions(this.client.connectionParams);
  requestOptions.method = 'GET';
// TODO: read multipart only if metadata and content
  requestOptions.headers = {
      'Accept': 'multipart/mixed; boundary='+multipartBoundary
  };
  requestOptions.path = path;

// TODO: integrate metadata and content as single object
// lacking a uri where a single read
  var responseProxy = mlrest.response(multipartEventMapper, true);

  var request = mlrest.request(
    this.client, requestOptions, false, responseProxy.collector
    );
  request.on('error', requestErrorHandler);
  request.end();

  return mlrest.responder(responseProxy, true);
}

function createWriteStream(document) {
  var responseProxy = mlrest.response(resultEventMapper, true);

  var request = startWriteRequest(this.client, document, responseProxy);
  request.on('error', requestErrorHandler);

  var writer = mlrest.responder(responseProxy, false);
  writer.client  = this.client;
  writer.request = request;

  writer.write = nextWriteStream.bind(writer);
  writer.end   = endWriteStream.bind(writer);

  writeNextDocumentStart(request, document, true);

  return writer;
}

// TODO: switch to multipart readable stream
function nextWriteStream(data, encoding) {
  this.request.write(data, encoding);
}

//TODO: switch to multipart readable stream
function endWriteStream(data, encoding) {
  if (data) {
    this.write(data, encoding);
  }
  endWriteRequest(this.request);
}

function resultEventMapper(response, proxy) {
  var addErrorListener = true;
  var eventNames = ['data', 'error', 'end'];
  // TODO: data as UTF-8 JSON
  for (var i=0; i < eventNames.length; i++) {
    var event = eventNames[i];
    var listeners = proxy.listeners(event);
    if (listeners.length === 0)
      continue;
    switch(event) {
    case 'error':
      addErrorListener = false;
      break;
    }
    for (var j=0; j < listeners.length; j++) {
      response.on(event, listeners[j]);
    }
  }
  if (addErrorListener) {
    response.on('error', requestErrorHandler);
  }
  response.resume();
}

function writeDocuments() {
  if (arguments.length < 1) {
    throw new Error('must provide uris for document write()');
  }

  // TODO: transactionId, transform
  var params = (arguments.length === 1 && 'documents' in arguments[0]) ?
      arguments[0] : null;

  var documents = null;
  if (params !== null) {
    documents = (params.documents instanceof Array) ? params.documents :
      [params.documents];
  } else if (arguments[0] instanceof Array) {
    documents = arguments[0];
  } else if (arguments.length === 1) {
    documents = [arguments[0]];
  } else {
    documents = Array.prototype.slice.call(arguments);
  }

  var responseProxy = mlrest.response(resultEventMapper, true);

  var request = startWriteRequestProxy(this.client, true, responseProxy);
  request.on('error', requestErrorHandler);

  var multipart = multipartStream({
    prefix: multipartBoundary
  });
  multipart.pipe(request);
  multipart.resume();

  documents.forEach(function(item, index, array) {
    writeNextDocument(multipart, item, (index === 0));
  });

  endWriteRequest(request, multipart);

  return mlrest.responder(responseProxy, false);
}

// TODO: rename
function startWriteRequestProxy(client, isMultipart, responseProxy) {
  var requestOptions = initRequestOptions(client.connectionParams);
  requestOptions.method = 'POST';
  requestOptions.headers = {
      'Content-Type': 'multipart/mixed; boundary='+multipartBoundary+
        (isMultipart ? '1' : ''),
      'Accept': 'application/json'
  };
  requestOptions.path = '/v1/documents';

  return mlrest.request(client, requestOptions, true, responseProxy.collector);
}

// TODO: consolidate with startWriteRequestProxy()
function startWriteRequest(client, document, responseProxy) {
  var requestOptions = initRequestOptions(client.connectionParams);
  requestOptions.method = 'POST';
  requestOptions.headers = {
      'Content-Type': 'multipart/mixed; boundary='+multipartBoundary,
      'Accept': 'application/json'
  };
  requestOptions.path = '/v1/documents';

  return mlrest.request(client, requestOptions, true, responseProxy.collector);
}

function collectMetadata(document) {
  var metadata = null;
  // TODO: create array wrapper for collections, capabilities
  var metadataCategories = ['collections', 'permissions', 'quality', 'properties'];
  for (var i = 0; i < metadataCategories.length; i++) {
    var category = metadataCategories[i];
    if (category in document) {
      if (metadata === null) {
        metadata = {};
      }
      metadata[category] = document[category];
    }
  }
  return metadata;
}

function writeNextDocument(multipart, document, isFirst) {
  if (!multipart || !document) {
    return;
  }

  var uri         = (document.uri) ? document.uri : null;
  var disposition = (uri) ? 'attachment; filename="'+uri+'"' : 'inline' ;

  var metadata = collectMetadata(document);
  if (metadata !== null) {
    multipart.write({
      'Content-Type'       : 'application/json; encoding=utf-8',
      'Content-Disposition': disposition+'; category=metadata'
      },
      JSON.stringify(metadata)
    );
  }

  if ('content' in document) {
// TODO: defaulting contentType, content other than string or JSON
    multipart.write({
      'Content-Type'       : document.contentType+
          (isString(document.content) ? '; encoding=utf-8' : ''),
      'Content-Disposition': disposition+'; category=content'
      },
      isString(document.content) ? document.content :
        JSON.stringify(document.content)
    );    
  }
}

function writeNextDocumentStart(request, document, isFirst) {
  if (!request || !document) {
    return;
  }

  var uri         = (document.uri) ? document.uri : null;
  var disposition = (uri) ? 'attachment; filename="'+uri+'"' : 'inline' ;

  var metadata = collectMetadata(document);
  if (metadata !== null) {
    multipart.write({
      'Content-Type'       : 'application/json; encoding=utf-8',
      'Content-Disposition': disposition+'; category=metadata'
      },
      JSON.stringify(metadata)
    );
  }

  if ('contentType' in document || 'content' in document) {
    // TODO: appending ; encoding=utf-8 if not present in content type
    // TODO: Content-Transfer-Encoding of binary or base64 or quoted-printable
    request.write(
      (isFirst ? '' : NEWLINE) +
      '--' + multipartBoundary + NEWLINE +
      'Content-Type: ' + document.contentType + NEWLINE +
      'Content-Disposition: ' + disposition+'; category=content' + NEWLINE +
      NEWLINE,
      'utf8'
      );
  }
}

function endWriteRequest(request, multipart) {
  if (!request) {
    return;
  }
  if (multipart) {
    multipart.end();
  } else {
    request.write(NEWLINE + '--' + multipartBoundary + '--' + NEWLINE);
  }
  request.end();
}

function deleteEventMapper(response, proxy) {
  var addErrorListener = true;
  var eventNames = ['error', 'end'];
  for (var i=0; i < eventNames.length; i++) {
    var event = eventNames[i];
    var listeners = proxy.listeners(event);
    if (listeners.length === 0)
      continue;
    switch(event) {
    case 'error':
      addErrorListener = false;
      break;
    }
    for (var j=0; j < listeners.length; j++) {
      response.on(event, listeners[j]);
    }
  }
  if (addErrorListener) {
    response.on('error', requestErrorHandler);
  }
  response.resume();
}

function deleteDocument() {
  if (arguments.length !== 1) {
    throw new Error('incorrect number of arguments for document del()');
  }

  var params = (!isString(arguments[0])) ? arguments[0] : null; 

  var path = '/v1/documents?';
  if (params === null) {
    path += 'uri='+arguments[0];
  } else {
    path += 'uri='+params.uri;
    if ('transactionId' in params) {
      path += '&txid='+params.transactionId;
    }
  }

  var requestOptions = initRequestOptions(this.client.connectionParams);
  requestOptions.method = 'DELETE';
  requestOptions.path = path;

  // TODO:
  // convenience to fire HTTP responder events on eventer
  // convenience to aggregate HTTP data for promise
  // lock the proxy after then or starting response (throw error on mod after lock)
  var responseProxy = mlrest.response(deleteEventMapper, true);

  // TODO: pass proxy instead of collector
  var request = mlrest.request(
    this.client, requestOptions, false, responseProxy.collector
    );
  // TODO: register same error handler for request and response
  request.on('error', requestErrorHandler);
  request.end();

  return mlrest.responder(responseProxy, false);
}

function queryDocuments(queryBuilder) {
  if (arguments.length !== 1) {
    throw new Error('incorrect number of arguments for document query()');
  }
  // TODO: validate clauses

  var view = null;

  // TODO: withOptions clauses
  var searchBody = {search:{}};

  var whereClause = queryBuilder.whereClause;
  if (whereClause !== undefined) {
    var query       = whereClause.query;
    var parsedQuery = whereClause.parsedQuery;
    if (query === undefined && parsedQuery === undefined) {
      query = whereClause.$query;
      if (query !== undefined) {
        // TODO: support QBE as query in search payload
        searchBody.$query = query;
        delete searchBody.search;
      }
    } else {
      if (query !== undefined) {
        searchBody.search.query = query;     
      }
      if (parsedQuery !== undefined) {
        searchBody.search.qtext = parsedQuery.qtext;
        var constraintBindings = parsedQuery.constraint;
        if (constraintBindings !== undefined) {
          searchBody.search.options = {
              constraint: constraintBindings
          };
        }
      }
    }
  }

  var calculateClause = queryBuilder.calculateClause;
  if (calculateClause !== undefined) {
    if (searchBody.search.options === undefined) {
      searchBody.search.options = {};
    }
    view = 'facets';
    searchBody.search.options['return-facets']     = true;
    searchBody.search.options['return-results']    = false;
    searchBody.search.options['return-metrics']    = false;
    searchBody.search.options['return-qtext']      = false;
    searchBody.search.options['transform-results'] = {apply: 'empty-snippet'};
    if (searchBody.search.options.constraint === undefined) {
      searchBody.search.options.constraint = calculateClause.constraint;      
    } else {
      Array.prototype.push.apply(searchBody.search.options.constraint, calculateClause.constraint);
    }
    // TODO: values
  }

  var orderByClause = queryBuilder.orderByClause;
  if (orderByClause !== undefined) {
    if (searchBody.search.options === undefined) {
      searchBody.search.options = {};
    }
    // TODO: fixup on score by treating value as option and setting to null
    searchBody.search.options['sort-order'] = orderByClause['sort-order'];
  }

  var pageStart = null;
  var pageLength = null;

  var sliceClause = queryBuilder.sliceClause;
  if (sliceClause !== undefined) {
    var sliceStart = sliceClause['page-start'];
    if (sliceStart !== undefined) {
      pageStart = sliceStart;
    }
    var sliceLength = sliceClause['page-length'];
    if (sliceLength !== undefined) {
      pageLength = sliceLength;
    }
  }

  // TODO: collect options from withOptions clause

  var endpoint =  null;
  if (queryBuilder.queryType === 'qbe') {
    endpoint = '/v1/qbe?format='+queryBuilder.queryFormat;
  } else {
    endpoint = '/v1/search?format='+queryBuilder.queryFormat;
  }

  if (pageStart !== null) {
    endpoint += '&start='+pageStart;
  }
  if (pageLength !== null && pageLength !== 0) {
    endpoint += '&pageLength='+pageLength;
  }

  if (view) {
    endpoint += '&view='+view;
  }

  var requestOptions = initRequestOptions(this.client.connectionParams);
  requestOptions.method = 'POST';

  requestOptions.headers = {
      'Content-Type': 'application/json',
      'Accept': ((pageLength === 0) ?
          'application/json' :
          'multipart/mixed; boundary='+multipartBoundary)
  };
  requestOptions.path = endpoint;

  var responseProxy = (pageLength === 0) ? 
      mlrest.response(resultEventMapper, true) :
      mlrest.response(multipartEventMapper, false);

  var request = mlrest.request(
    this.client, requestOptions, true, responseProxy.collector
    );
  request.on('error', requestErrorHandler);
  request.write(JSON.stringify(searchBody), 'utf8');
  request.end();

  return mlrest.responder(responseProxy, true);
}

function documents(client) {
  this.client = client;

  this.check             = checkDocument.bind(this);
  this.del               = deleteDocument.bind(this);
  this.read              = readDocument.bind(this);
  this.createWriteStream = createWriteStream.bind(this);
  this.write             = writeDocuments.bind(this);
  this.query             = queryDocuments.bind(this);
}

module.exports = documents;
