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
var through         = require('through');
var multipartStream = require('multipart').createMultipartStream;
var valcheck        = require('core-util-is');
var winston         = require('winston');
var mlrest          = require('./mlrest.js');
var mlutil          = require('./mlutil.js');

var NEWLINE = '\r\n';

function addDocumentUri(documents, document) {
  if (document !== undefined) {
    documents.push(document.uri);
  }
  return documents;
}
function getDocumentUris(documents) {
  if (documents === undefined || documents.length === 0) {
    return [];
  }
  return documents.reduce(addDocumentUri, []);
}

function checkEventMapper(response, dispatcher) {
  var exists = (response.statusCode < 300);
  var document = {
      uri:    dispatcher.requestdef.uri,
      exists: exists
  };
  if (exists) {
    document.format      = response.headers['vnd.marklogic.document-format'];
    document.contentType = response.headers['content-type'].replace(/;.*$/, '');
    // TODO: need version if optimistic locking is enabled
  }
  dispatcher.emit('data', document);
  dispatcher.emit('end');
  // TODO: emit error in failure case
  response.resume();
}
function checkDocument() {
  if (arguments.length != 1) {
    throw new Error('must supply uri for document check()');
  }

  var params = (!valcheck.isString(arguments[0])) ? arguments[0] : null; 

  var uri;

  var path = '/v1/documents?format=json';
  if (params === null) {
    uri = arguments[0];
    path += '&uri='+uri;
  } else {
    uri = params.uri;
    if (uri === undefined) {
      throw new Error('must specify the uri parameter for the document to check');
    }
    var txid = params.txid;
    if (txid !== undefined) {
      path += '&uri='+uri+'&txid='+txid;
    } else {
      path += '&uri='+uri;
    }
  }

  var requestOptions = mlutil.copyProperties(this.client.connectionParams);
  requestOptions.method = 'HEAD';
  requestOptions.path = path ;

  var responseDispatcher = mlrest.createResponseDispatcher(checkEventMapper, true, {
    uri: uri
    }, 500);

  var request = mlrest.createRequest(
    this.client, requestOptions, false, responseDispatcher.responder
    );
  request.on('error', mlutil.requestErrorHandler);
  request.end();

  return mlrest.createResultSelector(responseDispatcher, false);
}

function readDocuments() {
  if (arguments.length === 0) {
    throw new Error('must specify at least one document to read');
  }

  var params = (arguments[0].uris !== undefined) ? arguments[0] : null;

  var uris;
  var categories;
  var txid;
  var transform;

// TODO: set format to JSON only if metadata, set flag to force mapping
  if (params !== null) {
    uris = (params.uris instanceof Array) ? params.uris : [params.uris];
    categories = params.categories;
    txid = params.txid;
    transform = params.transform;
  } else if (arguments[0] instanceof Array) {
    uris = arguments[0];
  } else if (arguments.length === 1) {
    var arg = arguments[0];
    if (valcheck.isString(arg)) {
      uris = [arg];      
    } else {
      throw new Error('must specify the uris parameters with at least one document to read');
    }
  } else {
    uris = Array.prototype.slice.call(arguments);
  }
  if (categories === undefined) {
    categories = 'content';
  }

  var path = '/v1/documents?format=json&uri='+uris.join('&uri=');
  path += '&category=' + (
      (categories instanceof Array) ? categories.join('&category=') : categories
      );
  if (txid !== undefined) {
    path += '&txid='+params.txid;
  }
  if (transform !== undefined) {
    path += '&'+endpointTransform(transform);
  }

  var requestOptions = mlutil.copyProperties(this.client.connectionParams);
  requestOptions.method = 'GET';
  requestOptions.headers = {
      'Accept': 'multipart/mixed; boundary='+mlrest.multipartBoundary
  };
  requestOptions.path = path;

  var responseDispatcher = mlrest.createResponseDispatcher(mlrest.multipartEventMapper, false, {
    uris:       uris,
    categories: categories
    });

  var request = mlrest.createRequest(
    this.client, requestOptions, false, responseDispatcher.responder
    );
  request.on('error', mlutil.requestErrorHandler);
  request.end();

  return mlrest.createResultSelector(responseDispatcher, true);
}

function createReadStream() {
  if (arguments.length === 0) {
    throw new Error('must specify one document for streaming read');
  }

  var params = (arguments[0].uri !== undefined) ? arguments[0] : null;

  var uri;
  var txid;
  var transform;
  if (params !== null) {
    uri = params.uri;
    categories = params.categories;
    txid = params.txid;
    transform = params.transform;
  } else {
    uri = arguments[0];
    if (!valcheck.isString(uri)) {
      throw new Error('must specify the uri parameter for the document to read');
    }
  }

  var path = '/v1/documents?uri='+uri;
  if (txid !== undefined) {
    path += '&txid='+params.txid;
  }
  if (transform !== undefined) {
    path += '&'+endpointTransform(transform);
  }

  var requestOptions = mlutil.copyProperties(this.client.connectionParams);
  requestOptions.method = 'GET';
  requestOptions.path = path;

  var proxyReader = through();
  proxyReader.pause();

  var request = mlrest.createRequest(
    this.client, requestOptions, false, proxyResponder.bind(proxyReader)
    );
  request.on('error', mlutil.requestErrorHandler);
  request.end();

  return proxyReader;
}

// TODO: make method and move to mlrest
function proxyResponder(response) {
  response.pipe(this);
  this.resume();
}

function createWriteStream(document) {
  if (document === undefined || document.uri === undefined) {
    throw new Error('must specify document for write stream');
  }

  var responseDispatcher = mlrest.createResponseDispatcher(
      mlrest.resultEventMapper, true, document);

  var request = startWriteRequest(
      this.client,
      document,
      false,
      responseDispatcher
      );
  request.on('error', mlutil.requestErrorHandler);

  mlrest.createResultSelector(responseDispatcher, false, request);
  request.client = this.client;

  request.end = endWriteStream.bind(request, request.end);

  writeStreamDocumentStart(request, document);

  return request;
}
function writeStreamDocumentStart(request, document) {
  if (!request || !document) {
    return;
  }

  var uri         = (document.uri) ? document.uri : undefined;
  var disposition = (uri !== undefined) ? 'attachment; filename="'+uri+'"' : 'inline' ;

  var metadata = collectMetadata(document);
  if (metadata !== null) {
    request.write(
      '--' + mlrest.multipartBoundary + NEWLINE +
      'Content-Type: '        + 'application/json; encoding=utf-8' + NEWLINE +
      'Content-Disposition: ' + disposition+'; category=metadata' + NEWLINE +
      NEWLINE +
      JSON.stringify(metadata) + NEWLINE,
      'utf8'
    );
  }

  if ('contentType' in document) {
    // TODO: appending ; encoding=utf-8 if not present in content type
    // TODO: Content-Transfer-Encoding of binary or base64 or quoted-printable
    request.write(
      '--' + mlrest.multipartBoundary + NEWLINE +
      'Content-Type: '        + document.contentType + NEWLINE +
      'Content-Disposition: ' + disposition+'; category=content' + NEWLINE +
      NEWLINE,
      'utf8'
      );
  }
}
function endWriteStream(overwrittenEnd, data, encoding) {
  if (data) {
    this.write(data, encoding);
  }
  this.write(NEWLINE + '--' + mlrest.multipartBoundary + '--' + NEWLINE);
  overwrittenEnd.call(this);
}

function writeDocuments() {
  if (arguments.length < 1) {
    throw new Error('must provide uris for document write()');
  }

  var params = (arguments[0].documents !== undefined) ? arguments[0] : null;
  
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

  var responseDispatcher = mlrest.createResponseDispatcher(mlrest.resultEventMapper, true, {
    uris: getDocumentUris(documents)
    });

  var request = startWriteRequest(
      this.client,
      (params !== null) ? params : (documents.length === 1) ? documents[0] : null,
      true,
      responseDispatcher
      );
  request.on('error', mlutil.requestErrorHandler);

  var multipart = multipartStream({
    prefix: mlrest.multipartBoundary
  });
  multipart.pipe(request);
  multipart.resume();

  documents.forEach(function(item, index, array) {
    writeNextDocument(multipart, item, (index === 0));
  });

  multipart.end();
  request.end();

  return mlrest.createResultSelector(responseDispatcher, false);
}

function startWriteRequest(client, requestParams, isMultipart, responseDispatcher) {
  var endpoint = '/v1/documents';
  if (requestParams !== null) {
    var sep = '?';
    var category  = requestParams.category;
    if (category !== undefined) {
      endpoint += sep+'category='+(
          (category instanceof Array) ? category.join('&category=') : category
          );
      sep = '&';
    }
    var txid = requestParams.txid;
    if (txid !== undefined) {
      endpoint += sep+'txid='+txid;
      sep = '&';
    }
    var transform = endpointTransform(requestParams.transform);
    if (transform !== undefined) {
      endpoint += sep+transform;
      sep = '&';
    }
  }

  var requestOptions = mlutil.copyProperties(client.connectionParams);
  requestOptions.method = 'POST';
  requestOptions.headers = {
      'Content-Type': 'multipart/mixed; boundary='+mlrest.multipartBoundary+
        (isMultipart ? '1' : ''),
      'Accept': 'application/json'
  };
  requestOptions.path = endpoint;

  return mlrest.createRequest(
      client, requestOptions, true, responseDispatcher.responder
      );
}

function endpointTransform(transform) {
  if (transform !== undefined) {
    if (transform instanceof Array) {
      switch(transform.length) {
      case 0:
        break;
      case 1:
        return 'transform='+transform[0];
      default:
        var endpointParam = 'transform='+transform[0];
        var transformParams = transform[1];
        var transformKeys = Object.keys(transformParams);
        for (var i=0; i < transformKeys.length; i++) {
          var transformKey = transformKeys[i];
          endpointParam += '&trans:'+transformKey+'='+transformParams[transformKey];
        }
        return endpointParam;
      }
    } else {
      return 'transform='+transform;
    }
  }
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
          (valcheck.isString(document.content) ? '; encoding=utf-8' : ''),
      'Content-Disposition': disposition+'; category=content'
      },
      valcheck.isString(document.content) ? document.content :
        JSON.stringify(document.content)
    );    
  }
}

function removeDocument() {
  if (arguments.length !== 1) {
    throw new Error('incorrect number of arguments for document del()');
  }

  var params = (!valcheck.isString(arguments[0])) ? arguments[0] : null;

  var uri;
  var txid;

  if (params === null) {
    uri = arguments[0];
  } else {
    uri = params.uri;
    if (uri === undefined) {
      throw new Error('must specify the uri parameter for the document to remove');
    }
    txid = params.txid;
  }

  var path = '/v1/documents?uri='+uri;
  if (txid !== undefined) {
    path += '&txid='+params.txid;
  }

  var requestOptions = mlutil.copyProperties(this.client.connectionParams);
  requestOptions.method = 'DELETE';
  requestOptions.path = path;

  // TODO:
  // convenience to fire HTTP responder events on eventer
  // convenience to aggregate HTTP data for promise
  // lock the dispatcher after then or starting response (throw error on mod after lock)
  var responseDispatcher = mlrest.createResponseDispatcher(mlrest.emptyEventMapper, true, {
    uri: uri
    });

  var request = mlrest.createRequest(
    this.client, requestOptions, false, responseDispatcher.responder
    );
  // TODO: register same error handler for request and response
  request.on('error', mlutil.requestErrorHandler);
  request.end();

  return mlrest.createResultSelector(responseDispatcher, false);
}

function removeAllDocuments(params) {
  if (valcheck.isNullOrUndefined(params)) {
    throw new Error('No directory or collections to delete');
  }

  var deleteAll      = (params.all === true);

  var collections    = params.collections;
  var hasCollections = !valcheck.isNullOrUndefined(collections);

  var directory      = params.directory;
  var hasDirectory   = !valcheck.isNullOrUndefined(directory);

  var txid = params.txid;

  var endpoint = '/v1/search';
  var sep = '?';

  if (hasCollections || hasDirectory) {
    if (deleteAll) {
      throw new Error('delete all conflicts with delete collections and directory');
    }
    if (hasCollections) {
      endpoint += sep+'collection='+((collections instanceof Array) ?
          collections.join('&collection=') : collections);
      sep = '&';
    }
    if (hasDirectory) {
      endpoint += sep+'directory='+((directory.substr(-1) === '/') ?
          directory : directory+'/');
      if (sep === '?') {
        sep = '&';
      }
    }
  } else if (!deleteAll) {
    throw new Error('No directory or collections to delete');
  }

  if (txid !== undefined) {
    endpoint += sep+'txid='+txid;
  }

  var requestOptions = mlutil.copyProperties(this.client.connectionParams);
  requestOptions.method = 'DELETE';
  requestOptions.path = endpoint;

  var responseDispatcher = mlrest.createResponseDispatcher(
      mlrest.emptyEventMapper, true, params);

  var request = mlrest.createRequest(
    this.client, requestOptions, false, responseDispatcher.responder
    );
  // TODO: register same error handler for request and response
  request.on('error', mlutil.requestErrorHandler);
  request.end();

  return mlrest.createResultSelector(responseDispatcher, false);
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

  var category      = (pageLength > 0) ? ['content', 'collections'] : null;
  var txid = null;

  var withOptionsClause = queryBuilder.withOptionsClause;
  if (withOptionsClause !== undefined) {
    if (searchBody.search.options === undefined) {
      searchBody.search.options = {};
    }

    // TODO: share with queryBuilder.js
    var optionKeyMapping = {
        search:'search-option',     weight:'quality-weight',
        forestNames:'forest-names', similarDocs:'return-similar',
        metrics:'return-metrics',   relevance:'return-relevance',
        queryPlan:'return-plan',    debug:'debug',
        category:true,              txid:true
      };

    var optionsKeys = Object.keys(withOptionsClause);
    for (var i=0; i < optionsKeys.length; i++) {
      var key     = optionsKeys[i];
      var mapping = optionKeyMapping[key];
      if (mapping !== undefined) {
        var value = withOptionsClause[key];
        if (value !== undefined) {
          if (mapping === true) {
            switch(key) {
            case 'category':
              if (pageLength !== 0) {
                category = value;
              }
              break;
            case 'txid':
              txid = value;
              break;
            }
          } else {
            if (view === null) {
              view = 'metadata';
            }
            searchBody.search.options[mapping] = value;
          }
        }
      }
    }
  }

  var endpoint =  null;
  if (queryBuilder.queryType === 'qbe') {
    endpoint = '/v1/qbe?format='+queryBuilder.queryFormat;
  } else {
    endpoint = '/v1/search?format='+queryBuilder.queryFormat;
  }
  if (category !== null) {
    endpoint += '&category=' +
    (valcheck.isString(category) ? category : category.join('&category='));
  }
  if (pageStart !== null) {
    endpoint += '&start='+pageStart;
  }
  if (pageLength !== null && pageLength !== 0) {
    endpoint += '&pageLength='+pageLength;
  }
  if (txid !== null) {
    endpoint += '&txid='+txid;
  }
  if (view) {
    endpoint += '&view='+view;
  }

  var requestOptions = mlutil.copyProperties(this.client.connectionParams);
  requestOptions.method = 'POST';

  requestOptions.headers = {
      'Content-Type': 'application/json',
      'Accept': ((pageLength === 0) ?
          'application/json' :
          'multipart/mixed; boundary='+mlrest.multipartBoundary)
  };
  requestOptions.path = endpoint;

  var responseDispatcher = (pageLength === 0) ? 
      mlrest.createResponseDispatcher(mlrest.resultEventMapper, true) :
      mlrest.createResponseDispatcher(mlrest.multipartEventMapper, false);

  var request = mlrest.createRequest(
    this.client, requestOptions, true, responseDispatcher.responder
    );
  request.on('error', mlutil.requestErrorHandler);
  request.write(JSON.stringify(searchBody), 'utf8');
  request.end();

  return mlrest.createResultSelector(responseDispatcher, true);
}

function patchDocuments() {
  var argLen = arguments.length;

  var params = (argLen === 1 && arguments[0].uri !== undefined) ?
      arguments[0] : null;

  var uri = (params !== null) ? params.uri : (argLen > 1) ? arguments[0] : null;

  var operations = null;
  if (params !== null) {
    operations = (params.operations instanceof Array) ? params.operations :
      [params.operations];
  } else if (argLen > 1) {
    if (arguments[1] instanceof Array) {
      operations = arguments[1];
    } else if (arguments.length === 2) {
      operations = [arguments[1]];
    } else {
      operations = Array.prototype.slice.call(arguments, 1);
    }
  }

  if (uri === null || operations === null || operations.length === 0) {
    throw new Error('patch requires a uri and operations');
  }

  var categories = (params !== null) ? params.categories : null;
  var txid       = (params !== null) ? params.txid       : null;

  var endpoint = '/v1/documents?uri='+uri+'&format=json';
  if (!valcheck.isNullOrUndefined(categories)) {
    if (!(categories instanceof Array)) {
      endpoint += '&category=' + categories;
    } else if (categories.length > 0) {
      endpoint += '&category=' + categories.join('&category=');
    }
  }
  if (!valcheck.isNullOrUndefined(txid)) {
    endpoint += '&txid=' + txid;
  }

  var patchBody = {patch: operations};

  var responseDispatcher = mlrest.createResponseDispatcher(mlrest.emptyEventMapper, true, {
    uri: uri
  });

  var requestOptions = mlutil.copyProperties(this.client.connectionParams);
  requestOptions.method = 'POST';
  requestOptions.headers = {
      'Content-Type':           'application/json',
      'Accept':                 'application/json',
      'X-HTTP-Method-Override': 'PATCH'
  };
  requestOptions.path = endpoint;

  var request = mlrest.createRequest(
    this.client, requestOptions, true, responseDispatcher.responder
    );
  request.on('error', mlutil.requestErrorHandler);
  request.write(JSON.stringify(patchBody), 'utf8');
  request.end();

  return mlrest.createResultSelector(responseDispatcher, true);
}

function documents(client) {
  this.client = client;

  this.check             = checkDocument.bind(this);
  this.remove            = removeDocument.bind(this);
  this.removeAll         = removeAllDocuments.bind(this);
  this.read              = readDocuments.bind(this);
  this.createReadStream  = createReadStream.bind(this);
  this.write             = writeDocuments.bind(this);
  this.createWriteStream = createWriteStream.bind(this);
  this.query             = queryDocuments.bind(this);
  this.patch             = patchDocuments.bind(this);
}

module.exports = documents;
