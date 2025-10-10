/*
* Copyright (c) 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/

let exutil = require('./example-util.js');
const marklogic = exutil.require('marklogic');
const dbWriter = marklogic.createDatabaseClient(exutil.restWriterConnection);
const ctsQb = marklogic.ctsQueryBuilder;
const q = marklogic.queryBuilder;

console.log('This example uses queryAll api to return uris of the documents falling under the cts query given as input.');

// Directory query to collect uris of documents in the specified directory.
const query = q.where(ctsQb.cts.directoryQuery('/test/dataMovement/requests/queryAll/'));

dbWriter.documents.queryAll(query, {
    onCompletion: ((summary) => {
        console.log(summary.urisReadSoFar+' uris were retrieved successfully.');
        console.log(summary.urisFailedToBeRead+' uris failed to be retrieved.');
        console.log('Time taken was '+summary.timeElapsed+' milliseconds.');
    })
});
