/*
* Copyright © 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/

'use strict';


const requester    = require('./requester.js'),
      mlutil       = require('./mlutil.js'),
      Operation    = require('./operation.js'),
      planBuilder  = require('./plan-builder.js');
const stream = require('stream');
const bigInt = require("big-integer");

/** @ignore */
function Rows(client) {
  this.client = client;
}

/**
 * Provides functions for performing SQL-like, relational operations
 * on MarkLogic data. Enables you to retrieve document data as rows
 * by executing a plan constructed by a {@link planBuilder}.
 * @namespace rows
 */

/**
 * Specifies how a {@link planBuilder} plan is executed, the formatting
 * of the results returned, and variable bindings.
 * @typedef {object} rows.RowsOptions
 * @since 2.1.1
 * @property {string} [format] - Format of the returned results. Possible
 * values: 'json'|'xml'|'csv'. Default: 'json'.
 * @property {string} [structure] - Structure of the output. Possible values:
 * 'object'|'array'. Default: 'object'.
 * @property {string} [columnTypes] - Whether to emit column data types on
 * each row or only the column name header. Possible values: 'rows'|'header'.
 * Default: 'rows'.
 * @property {string} [complexValues] - Whether complex array, binary, element,
 * object, and text node columns should be serialized inline or as a reference
 * to a separate response part. Possible values: 'inline'|'reference'. Default:
 * 'inline'. Only relevant when results are delivered as an JSON object stream.
 * @property {object} [bindings] - Values for placeholder variables within the
 * query plan. You define them with an object whose keys are the names of the
 * variables and whose values are either primitives or objects with a type or
 * lang key and a value key. Bindings are handled the same way as with
 * graphs#sparql and graphs#sparqlUpdate.
 * @property {DatabaseClient.Timestamp}  [timestamp] - A Timestamp object for
 * point-in-time operations.
 * @property {string} [queryType] - The type of a string query submitted for
 * execution. Possible values: 'json'|'sparql'|'sql'|'dsl'. Default: 'json'.
 */

/**
 * Executes a plan built by a {@link planBuilder} and returns a promise data
 * structure.
 * @method rows#query
 * @since 2.1.1
 * @param {object} builtPlan  - A {@link planBuilder} object or a built
 * plan defined as a JSON object.
 * @param {RowsOptions} options - Options that control how the plan is
 * executed and the results returned.
 * @param {object} bindingArg - Data object for dynamic parameter
 * binding.
 * @returns {Promise} A Promise.
 */
Rows.prototype.query = function queryRows() {
  let args = mlutil.asArray.apply(null, arguments);

  if (args.length < 1) {
    throw new Error('built plan required');
  }

  let builtPlan = args[0],
      options = (args.length >= 2) ? args[1] : null;

  return queryRowsImpl(this, builtPlan, null, options, args[2]);
};
function queryRowsImpl(self, builtPlan, streamType, options, bindingArg, graphqlQuery) {
  const operation = queryRowsOperationImpl(self, builtPlan, streamType, options, bindingArg, graphqlQuery);
  const responseSelector = requester.startRequest(operation);

  if (streamType !== null) {
    return responseSelector.stream(streamType);
  } else {
    return responseSelector.result();
  }
}

function queryRowsOperationImpl(self, builtPlan, streamType, options, bindingArg, graphqlQuery) {
  let sep = '?',
      validFormats = ['json','xml','csv'],
      validStructures = ['object','array'],
      validColumnTypes = ['rows','header'],
      validComplexValues = ['inline','reference'],
      validStreamTypes = ['chunked','object','sequence'],
      // set defaults
      format = 'json',
      structure = 'object',
      columnTypes = 'rows',
      complexValues = null,
      timestamp = null;

  options = options || {};
  if (streamType !== null && validStreamTypes.indexOf(streamType) < 0) {
    throw new Error('invalid stream type "' + options.streamType + '"');
  }

  if (options.format !== null && options.format !== void 0) {
    if (validFormats.indexOf(options.format) >= 0) {
      format = options.format;
    } else {
      throw new Error('invalid row format "' + options.format + '"');
    }
  }

  if (options.structure !== null && options.structure !== void 0) {
    if (validStructures.indexOf(options.structure) >= 0) {
      structure = options.structure;
    } else {
      throw new Error('invalid row structure "' + options.structure + '"');
    }
  }

  if (options.columnTypes !== null && options.columnTypes !== void 0) {
    if (validColumnTypes.indexOf(options.columnTypes) >= 0) {
      columnTypes = options.columnTypes;
    } else {
      throw new Error('invalid column types "' + options.columnTypes + '"');
    }
  }

  if (options.complexValues !== null && options.complexValues !== void 0) {
    if (validComplexValues.indexOf(options.complexValues) >= 0) {
      complexValues = options.complexValues;
    } else {
      throw new Error('invalid node columns "' + options.complexValues + '"');
    }
    if(complexValues === 'reference' && streamType === 'chunked') {
      throw new Error('complexValue cannot be reference when streamType is chunked');
    }
  }

  if (options.timestamp !== null && options.timestamp !== void 0) {
    if (!(timestamp instanceof mlutil.Timestamp)) {
      timestamp = options.timestamp;
    } else {
      throw new Error('invalid timestamp');
    }
  }

  const contentTypeHeader = graphqlQuery ? 'application/graphql' : queryContentType(builtPlan, options.queryType);
  let endpoint = createRowsEndpoint(options, graphqlQuery, structure);
  if (options.bindings) {
    endpoint += mlutil.makeBindingsParams(options.bindings, sep);
    if (sep === '?') { sep = '&'; }
  }

  const connectionParams = self.client.getConnectionParams();

  if (bindingArg) {
    const keys = Object.keys(bindingArg);
    const bindingKey = keys[0];
    const attachments = keys[1];
    const metadata = keys[2];
    const query = JSON.stringify(builtPlan.export());
    const multipartBoundary = mlutil.multipartBoundary;
    const endpoint = createRowsEndpoint(options,graphqlQuery, structure);
    const requestOptions = mlutil.newRequestOptions(connectionParams, endpoint, 'POST');

    requestOptions.headers = {
      'Content-Type': 'multipart/form-data; boundary=' + multipartBoundary,
      Accept: 'application/json'
    };

    const operation = new Operation(
        'binding arguments ' + endpoint, self.client, requestOptions, 'multipart', 'single'
    );

    operation.headers = {
      'Content-Type': 'multipart/form-data; boundary=' + multipartBoundary,
    };

    operation.bindingParam = {
      [bindingKey]: (typeof bindingArg[bindingKey] === 'string')?JSON.parse(bindingArg[bindingKey]):bindingArg[bindingKey],
      query: query,
      key: bindingKey,
      attachments: bindingArg[attachments],
      metadata: bindingArg[metadata]
    };

    return operation;
  }

  let acceptHeader = null;
  let responseType = null;
  switch (format) {
    case 'xml':
      acceptHeader = 'application/xml';
      responseType = 'single';
      endpoint += addOutputAndColumnTypes(options, structure,'column-types=' + columnTypes, sep, endpoint.includes('output='));
      break;
    case 'csv':
      acceptHeader = 'text/csv';
      responseType = 'single';

      endpoint += addOutputAndColumnTypes(options, structure,'column-types=header', sep, endpoint.includes('output='));
      if (sep === '?') { sep = '&'; }
      break;
    default:
      if (streamType !== null && streamType === 'sequence'){
        acceptHeader = 'application/json-seq';
        responseType = 'single';
      } else if (streamType !== null && streamType === 'object'){
        if (complexValues === 'reference') {
          acceptHeader = 'multipart/mixed; boundary=' + mlutil.multipartBoundary;
          responseType = 'multipart';
        } else {
          acceptHeader = 'application/json-seq';
          responseType = 'single';
        }
      }
      // Chunked stream, promise
      else {
        acceptHeader = 'application/json';
        responseType = 'single';
      }
      endpoint += addOutputAndColumnTypes(options, structure,'column-types=' + columnTypes, sep, endpoint.includes('output='));
      if (sep === '?') { sep = '&'; }
      endpoint += (complexValues === 'reference') ? sep + 'node-columns=reference' : '';
      break;
  }

  if (timestamp !== null) {
    if (timestamp.value !== null) {
      endpoint += sep + 'timestamp='+timestamp.value;
      if (sep === '?') { sep = '&'; }
    }
  }

  let requestOptions = mlutil.newRequestOptions(connectionParams, endpoint, 'POST');
  requestOptions.headers = {
    'Content-Type': contentTypeHeader,
    'Accept': acceptHeader
  };

  const operation = new Operation(
    'query rows', self.client, requestOptions, 'single', responseType
  );
  operation.validStatusCodes  = [200, 404];
  operation.complexValues  = complexValues;
  if (graphqlQuery) {
    operation.requestBody = graphqlQuery;
  }
  // Built plan can be PlanBuilder object or JSON string
  else if (builtPlan instanceof planBuilder.Plan) {
    operation.requestBody = JSON.stringify(builtPlan.export());
  } else {
    operation.requestBody = builtPlan;
  }
  operation.timestamp = (timestamp !== null) ? timestamp : null;

return operation;
}

function createRowsEndpoint(options, graphqlQuery, structure) {
  let endpoint = graphqlQuery?'/v1/rows/graphql':'/v1/rows';
  if(options && options.update){
    // opticExecute is an internal flag to ensure output doesn't default to anything.
    endpoint = (options.opticExecute)?'/v1/rows/update':'/v1/rows/update?output='+structure;
  } else if(structure && structure!=='object'){ // adding this to create endpoints /v1/rows?output=array
    endpoint += '?output='+structure;
  }
  return endpoint;
}

function addOutputAndColumnTypes(options, structure, columnValue, sep, hasOutputStructure) {
  if(options && options.update){
    const tempSep = (options.opticExecute)? '?':'&';
    return tempSep+columnValue;
  } else {
    return (hasOutputStructure?('&'+columnValue):(sep + 'output=' + structure + '&'+columnValue));
  }
}

function queryContentType(builtPlan, queryType) {
  const defaultContentType = 'application/json';
  if (queryType === void 0 || queryType === null) {
    return defaultContentType;
  }

  const validQueryTypes = ['json', 'sparql', 'sql', 'dsl'];
  if (validQueryTypes.indexOf(queryType) < 0) {
    throw new Error('invalid queryType "' + queryType + '"');
  } else if (queryType != 'json' && typeof builtPlan != 'string' && !(builtPlan instanceof String)) {
    throw new Error('queryType "' + queryType + '" must be provided as string');
  }

  switch(queryType) {
    case 'json':   return defaultContentType;
    case 'sql':    return 'application/sql';
    case 'sparql': return 'application/sparql-query';
    case 'dsl':    return 'application/vnd.marklogic.querydsl+javascript';
    default:       throw new Error('unknown queryType "' + queryType + '"');
  }
}

/**
 * Executes a plan built by a {@link planBuilder} and returns a readable
 * stream data structure.
 * @method rows#queryAsStream
 * @since 2.1.1
 * @param {object} builtPlan  - A {@link planBuilder} object or a built
 * plan defined as a JSON object.
 * @param {string} streamType - Type of stream. Possible values: 'chunked'|
 * 'object'|'sequence'. Default: 'chunked'.
 * @param {RowsOptions} options - Options that control how the plan is
 * executed and the results returned.
 * @returns {ReadableStream} A readable stream.
 */
Rows.prototype.queryAsStream = function queryAsStreamRows() {
  let args = mlutil.asArray.apply(null, arguments),
      streamType = 'chunked', // default
      options = null;

  if (args.length < 1) {
    throw new Error('built plan required');
  }

  let builtPlan = args[0];

  if (args.length === 2) {
    if (typeof args[1] === 'string' || args[1] instanceof String) {
      streamType = args[1];
    } else {
      options = args[1];
    }
  } else if (args.length > 2) {
      streamType = args[1];
      options = args[2];
  }

  return queryRowsImpl(this, builtPlan, streamType, options);
};

/**
 * Returns an explanation of an execution plan as a promise.
 * @method rows#explain
 * @since 2.1.1
 * @param {object} builtPlan - A {@link planBuilder} object or a built
 * plan as a JSON object.
 * @param {string} [format] - The format of the returned representation:
 * 'json'|'xml'. The default is 'json'.
 * @param {string} [queryType] - The type of a string query submitted for
 * explanation. Possible values: 'json'|'sparql'|'sql'|'dsl'. Default: 'json'.
 * @returns {Promise} A promise whose success callback receives the
 * explanation as JSON or XML.
 */
Rows.prototype.explain = function explainRows(builtPlan, format, queryType) {
  const connectionParams = this.client.getConnectionParams();
  const requestOptions = mlutil.copyProperties(connectionParams);
  requestOptions.method = 'POST';

  const validFormats = ['json','xml'];

  let acceptHeader = 'application/json'; // default
  if (format !== null && format !== void 0) {
    if (validFormats.indexOf(format) >= 0) {
      acceptHeader = 'application/' + format;
    } else {
      throw new Error('invalid explain format "' + format + '"');
    }
  }

  const contentTypeHeader = queryContentType(builtPlan, queryType);

  requestOptions.headers = {
    'Content-Type': contentTypeHeader,
    'Accept': acceptHeader
  };

  requestOptions.path = '/v1/rows?output=explain';

  const operation = new Operation(
        'explain rows', this.client, requestOptions, 'single', 'single');
  operation.validStatusCodes  = [200];
  // Built plan can be PlanBuilder object or JSON string
  if (builtPlan instanceof planBuilder.Plan) {
    operation.requestBody = JSON.stringify(builtPlan.export());
  } else {
    operation.requestBody = builtPlan;
  }

  const responseSelector = requester.startRequest(operation);
  return responseSelector.result();
};

/**
 * Generates the view of an execution plan as a promise.
 * @method rows#generateView
 * @since 2.7.0
 * @param {object} builtPlan - A {@link planBuilder} object or a built
 * plan as an XML object.
 * @param {string} [schema] - The schema of the query.
 * @param {string} [view] - View of the query.
 * @param {string} [queryType] - The type of a string query submitted for execution.
 * @returns {Promise} A promise whose success callback receives the explanation as an XML.
 */
Rows.prototype.generateView = function generateViewRows(builtPlan, schema, view, queryType) {

  if(schema == null || schema.length ===0) {
    throw new Error('schema cannot be null or empty');
  }
  if(view == null || view.length ===0) {
    throw new Error('view cannot be null or empty');
  }

  let acceptHeader = 'application/xml';

  const contentTypeHeader = queryContentType(builtPlan, queryType);
  const endpoint = '/v1/rows?output=generateView&schemaName='+schema+'&viewName='+view;
  const requestOptions    = mlutil.newRequestOptions(this.client.getConnectionParams(), endpoint, 'POST');

  requestOptions.headers = {
    'Content-Type': contentTypeHeader,
    'Accept': acceptHeader
  };

  const operation = new Operation(
      'generate view', this.client, requestOptions, 'single', 'single');
  operation.validStatusCodes  = [200];
  // Built plan can be PlanBuilder object or JSON string
  if (builtPlan instanceof planBuilder.Plan) {
    operation.requestBody = JSON.stringify(builtPlan.export());
  } else {
    operation.requestBody = builtPlan;
  }

  const responseSelector = requester.startRequest(operation);
  return responseSelector.result();
};

/**
 * The queryAll function, equivalent to the DMSDK RowBatcher, reads one or more row(s).
 * The optional options include onCompletion, batchSize, onBatchError, queryType,
 *  concurrentRequests, columnTypes, rowStructure, rowFormat, onInitialTimestamp, outputStreamType and consistentSnapshot.
 * @method rows#queryAll
 * @since 3.0.0
 * @param {planBuilder.ModifyPlan|object|string} batchView - A query that exports a modified subset of rows from a view
 *  expressed as a modify plan without parameters built by the PlanBuilder, a JavaScript literal object equivalent to a
 *  JSON AST representation of the modify plan or a string literal with the JSON AST or Query DSL representation of the
 *  modify plan.
 * @param {object} [options] - Configures the queryAll operation.
 * @param {function(summary)} [onCompletion] - A callback that receives a summary of the results.
 * @param {function(progress, error)} [onBatchError] - A callback that responds  to any error while reading a
 *  batch of documents. Takes progressSoFar and the error as parameters and controls the resolution by returning true,
 *  false or an error.
 * @param {string} [queryType] - The type of a string query submitted for execution.
 *  Possible values: 'json'|'sparql'|'sql'|'dsl'. Default: 'json'.
 * @param {Integer} [batchSize] - Controls the number of rows retrieved in each request
 * @param {object} [concurrentRequests] - JavaScript object literal that controls the maximum number of concurrent
 *  requests that can be pending at the same time. Valid keys are "multipleOf" and "multiplier".
 * @param {string} [columnTypes] - Whether to emit column data types on each row or only the column name header.
 * Possible values: 'rows'|'header'. Default: 'rows'.
 * @param {string} [rowStructure] - Structure of the output.
 * Possible values:'object'|'array'. Default: 'object'.
 * @param {boolean|DatabaseClient.timestamp} [consistentSnapshot] - Controls whether to get an immutable view of the result set.
 *  Each request gets the latest data at the time of the request if not set/ false.
 *  Uses the timestamp of the first request for all subsequent requests if true.
 *  Uses the supplied timestamp for all requests if set to DatabaseClient.timestamp object.
 * @param {function(timestamp)} [onInitialTimestamp] - Receives the timestamp from the first request.
 *  Takes parameters of - Timestamp object for the server timestamp for the result set.
 *  Throws error if consistentSnapshot is not true.
 * @param {chunked|object|sequence} [outputStreamType] - Controls whether data is written to the output stream as chunks or object.
 * @returns {stream.Readable} - a stream.Readable that sends rows read from the database to the application in the configured mode.
 */
 Rows.prototype.queryAll = function queryAllDocumentsImpl(batchView, jobOptions){

   let path = '/v1/internal/viewinfo';
   const requestOptions = mlutil.newRequestOptions(this.client.getConnectionParams(), path, 'POST');

   requestOptions.headers = {
     'Accept':       'application/json',
     'Content-Type': 'application/json'
   };

   let operation = new Operation(
       'read viewInfo', this.client, requestOptions, 'single', 'single'
   );
   if (batchView instanceof planBuilder.Plan) {
     operation.requestBody = JSON.stringify(batchView.export());
   } else {
     operation.requestBody = batchView;
   }

   let jobState = {
     docInstance : this,
     requesterCount: 0,
     rowsReadSuccessfully:0,
     rowsFailedToBeRead: 0,
     jobOptions: (jobOptions)? mlutil.copyProperties(jobOptions):{}
   };
   jobState.stream = new stream.PassThrough({objectMode: true});
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

   if(!jobState.jobOptions.batchSize ){
     jobState.jobOptions.batchSize = 100;
   }
   else if (jobState.jobOptions.batchSize > 100000 || jobState.jobOptions.batchSize < 1){
     throw new Error('batchSize cannot be greater than 100000 or less than 1');
   }

   if(jobState.jobOptions.concurrentRequests) {
     const concurrentRequests = jobState.jobOptions.concurrentRequests;
     if (concurrentRequests.multipleOf) {
       if (!new Set(['forests', 'hosts']).has(String(concurrentRequests.multipleOf.toString().toLowerCase()))) {
         throw new Error('Invalid value for multipleOf. Value must be forests or hosts.');
       }
     } else {
       concurrentRequests.multipleOf = 'forests';
     }

     if (concurrentRequests.multiplier && concurrentRequests.multiplier <= 0) {
       throw new Error('concurrentRequests.multiplier cannot be less than one');
     } else {
       concurrentRequests.multiplier = 4;
     }
     jobState.jobOptions.concurrentRequests = concurrentRequests;
   }
   else {
     jobState.jobOptions.concurrentRequests = {multipleOf:'forests', multiplier:4};
   }

   if(jobState.jobOptions.outputStreamType){
     const outputStreamType = jobState.jobOptions.outputStreamType.toString().toLowerCase();
     if (!new Set(['chunked','object','sequence']).has(String(outputStreamType))) {
       throw new Error('Invalid value for outputStreamType. Value must be chunked, object or sequence.');
     }
     jobState.jobOptions.outputStreamType = outputStreamType;
   }
   else {
     jobState.jobOptions.outputStreamType = 'object';
   }

   if(jobState.jobOptions.columnTypes){
     const columnTypes = jobState.jobOptions.columnTypes.toString().toLowerCase();
     if (!new Set(['rows','header']).has(String(columnTypes))) {
       throw new Error('Invalid value for columnTypes. Value must be rows or header.');
     }
     jobState.jobOptions.columnTypes = columnTypes;
   }
   else {
     jobState.jobOptions.columnTypes = 'rows';
   }

   if(jobState.jobOptions.rowStructure){
     const rowStructure = jobState.jobOptions.rowStructure.toString().toLowerCase();
     if (!new Set(['object','array']).has(String(rowStructure))) {
       throw new Error('Invalid value for rowStructure. Value must be object or array.');
     }
     jobState.jobOptions.rowStructure = rowStructure;
   }
   else {
     jobState.jobOptions.rowStructure = 'object';
   }

   if(jobState.jobOptions.rowFormat){
     const rowFormat = jobState.jobOptions.rowFormat.toString().toLowerCase();
     if (!new Set(['json','xml','csv']).has(String(rowFormat))) {
       throw new Error('Invalid value for rowFormat. Value must be json, xml or csv.');
     }
     jobState.jobOptions.rowFormat = rowFormat;
   }
   else {
     jobState.jobOptions.rowFormat = 'json';
   }

   if(jobState.jobOptions.queryType){
     if(!(batchView instanceof String)){
       throw new Error('queryType should be set only when batchView is String.');
     }
     const queryType = jobState.jobOptions.queryType.toString().toLowerCase();
     if (!new Set(['json','dsl']).has(String(queryType))) {
       throw new Error('Invalid value for rowFormat. Value must be json, xml or csv.');
     }
     jobState.jobOptions.queryType = queryType;
   }
   else if(batchView instanceof String){
     jobState.jobOptions.queryType = 'dsl';
   }

   requester.startRequest(operation).result(mlutil.callbackOn(jobState, onQueryAllInit))
       .catch((err) => {
         jobState.stream.emit('error', err);
         jobState.requesterCount = 0;
         jobState.error = err;
         finishOnQueryAllRows(jobState);
       });

   return jobState.stream;
 };


/**
 * Executes a plan built by a {@link planBuilder} and returns a promise data
 * structure.
 * @method rows#execute
 * @since 3.1.0
 * @param {object} builtPlan  - A {@link planBuilder} object or a built
 * plan defined as a JSON object.
 * @param {RowsOptions} options - Options that control how the plan is
 * executed and the results isn't returned.
 * @param {object} bindingArg - Data object for dynamic parameter
 * binding.
 */

Rows.prototype.execute = function executeRows() {
  let args = mlutil.asArray.apply(null, arguments);

  if (args.length < 1) {
    throw new Error('built plan required');
  }

  let builtPlan = args[0], options = (args.length >= 2 && args[1])?args[1] : {};
  // opticExecute is an internal flag to ensure output doesn't default to anything.
  options.opticExecute = true;
  queryRowsImpl(this, builtPlan, null, options, args[2]);
};

Rows.prototype.graphQL = function graphqlRows() {
  let args = mlutil.asArray.apply(null, arguments);

  if (args.length < 1) {
    throw new Error('graphql query required');
  }

  let options = (args.length >= 2) ? args[1] : null;

  return queryRowsImpl(this, null, null, options,null, args[0]);
};

function onQueryAllInit(output) {
  let maxRequesters = 0;
  const jobState = this;
  jobState.viewInfo = output;
  if(!jobState.viewInfo.rowCount || jobState.viewInfo.rowCount === 0){
    finishOnQueryAllRows(jobState);
  }
  if(output.forests){
    switch (jobState.jobOptions.concurrentRequests.multipleOf) {
      case 'hosts':
        maxRequesters = jobState.jobOptions.concurrentRequests.multiplier *
            new Set(output.map((forest) => forest.host)).size;
        break;
      default:
        maxRequesters = jobState.jobOptions.concurrentRequests.multiplier * output.length;
        break;
    }
  } else {
    maxRequesters = 1;
  }

  jobState.startTime = Date.now();
  jobState.requesterCount = 0;
  jobState.batchNum = 0;

  jobState.numberOfBatches =
      (jobState.viewInfo.rowCount/jobState.jobOptions.batchSize)> 1? (jobState.viewInfo.rowCount/jobState.jobOptions.batchSize)+1:1;
  jobState.requestBatchSize = (bigInt(18446744073709551615/jobState.numberOfBatches));

  jobState.maxRequesters =  (maxRequesters && jobState.numberOfBatches>maxRequesters)? maxRequesters: jobState.numberOfBatches;

  if(jobState.jobOptions.consistentSnapshot && !jobState.consistentSnapshotTimestamp){
    jobState.requesterCount++;
    onQueryAllRows(jobState,0, null);
  }
  else {
    spinReaderThreads(jobState,0, null);
  }
}

function spinReaderThreads(jobState, readerId){

  for(let i=readerId;i<jobState.maxRequesters; i++){
    jobState.requesterCount++;
    onQueryAllRows(jobState,jobState.requesterCount, null);
  }
}

function onQueryAllRows(jobState, readerId, batchNum) {

  const currentBatchNum = batchNum? batchNum: ++jobState.batchNum;
  if (jobState.error || jobState.batchNum>jobState.numberOfBatches) {
    finishOnQueryAllRows(jobState);
    return;
  }
  let lowerBound = bigInt((currentBatchNum - 1) * jobState.requestBatchSize);
  let upperBound = (currentBatchNum === jobState.numberOfBatches) ? '-1' :
      bigInt(lowerBound + jobState.requestBatchSize -1);
  let options = {
    bindings: {ML_LOWER_BOUND:lowerBound, ML_UPPER_BOUND:upperBound},
    format: jobState.jobOptions.rowFormat,
    structure: jobState.jobOptions.rowStructure,
    columnTypes: jobState.jobOptions.columnTypes,
    queryType: jobState.jobOptions.queryType,
    queryAll: true
  };

  if(jobState.jobOptions.consistentSnapshot){
    options.timestamp = jobState.consistentSnapshotTimestamp ? jobState.consistentSnapshotTimestamp:
        new mlutil.Timestamp(null);
  }
  const operation = queryRowsOperationImpl(jobState.docInstance, jobState.viewInfo.modifiedPlan,
      jobState.jobOptions.outputStreamType, options);
  const responseSelector = requester.startRequest(operation);

  if(jobState.jobOptions.outputStreamType === 'chunked'){
    responseSelector.stream('chunked')
        .on('error', function(err){
          readAllDocumentsErrorHandle(jobState,  readerId, err, currentBatchNum);
        })
        .on('data', function(item){
          if(item) {
            jobState.stream.write(item.toString());
            jobState.rowsReadSuccessfully += (JSON.parse(item.toString()).rows.length);
            if (jobState.jobOptions.consistentSnapshot && !jobState.consistentSnapshotTimestamp) {
              jobState.consistentSnapshotTimestamp = operation.timestamp;
              if (jobState.jobOptions.onInitialTimestamp) {
                jobState.jobOptions.onInitialTimestamp(jobState.consistentSnapshotTimestamp);
              }
              if (readerId + 1 < jobState.maxRequesters) {
                spinReaderThreads(jobState, readerId + 1);
              } else {
                onQueryAllRows(jobState, readerId, null);
              }
            } else {
              onQueryAllRows(jobState, readerId, null);
            }
          }
        });
  } else {
    responseSelector
        .result((output) => {
          if(output instanceof Error){
            throw new Error(output);
          }
          jobState.stream.write(output);
          jobState.rowsReadSuccessfully+= output.length-1;
          if(jobState.jobOptions.consistentSnapshot && !jobState.consistentSnapshotTimestamp){
            jobState.consistentSnapshotTimestamp = operation.timestamp;
            if(jobState.jobOptions.onInitialTimestamp){
              jobState.jobOptions.onInitialTimestamp(jobState.consistentSnapshotTimestamp);
            }
            if(jobState.maxRequesters>1){
              spinReaderThreads(jobState,1);
            } else {
              onQueryAllRows(jobState, readerId, null);
            }

          } else {
            onQueryAllRows(jobState, readerId, null);
          }
        })
        .catch((err) => {
          readAllDocumentsErrorHandle(jobState,  readerId, err, currentBatchNum);
        });
  }
}

function readAllDocumentsErrorHandle(jobState,readerId,err,currentBatchNum){
  if(jobState.error){
    finishOnQueryAllRows(jobState);
    return;
  }
  let errorDisposition = err;
  if (jobState.jobOptions.onBatchError) {
    const progressSoFar = {
      rowsReadSuccessfully: jobState.rowsReadSuccessfully,
      timeElapsed: (Date.now()-jobState.startTime)
    };
    try {
      errorDisposition = jobState.jobOptions.onBatchError(progressSoFar, err);
    } catch(err){
      errorDisposition = err;
    }
    if(errorDisposition instanceof Error){
      jobState.error = errorDisposition;
      jobState.stream.emit('error', errorDisposition);
      finishOnQueryAllRows(jobState);
    } else if(errorDisposition) {
      onQueryAllRows(jobState, readerId, currentBatchNum);
    } else if(!(errorDisposition)){
      onQueryAllRows(jobState, readerId, null);
    } else {
      const onBatchErrorFailure = new Error('onBatchError should return true or false or an error');
      jobState.error = onBatchErrorFailure;
      jobState.stream.emit('error', onBatchErrorFailure);
      finishOnQueryAllRows(jobState);
    }
  }

  switch(jobState.retryCount){
    case 0: {
      jobState.error = new Error(err);
      jobState.stream.emit('error', jobState.error);
      finishOnQueryAllRows(jobState);
      break;
    }
    default: {
      jobState.retryCount--;
      onQueryAllRows(jobState, readerId, currentBatchNum);
      break;
    }
  }
}

function finishOnQueryAllRows(jobState) {
  jobState.requesterCount--;
  if(jobState.requesterCount <= 0) {
    jobState.stream.end();
    if(jobState.jobOptions.onCompletion){
      const summary = {
        rowsReadSuccessfully: jobState.rowsReadSuccessfully,
        rowsFailedToBeRead: (jobState.viewInfo.rowCount - jobState.rowsReadSuccessfully),
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

module.exports = Rows;
