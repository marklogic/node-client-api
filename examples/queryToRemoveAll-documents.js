/*
* Copyright © 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/


const exutil = require('./example-util.js');
const marklogic = exutil.require('marklogic');
const ctsQb = marklogic.ctsQueryBuilder;
const q = marklogic.queryBuilder;
const dbWriter = marklogic.createDatabaseClient(exutil.restWriterConnection);

console.log('This example uses queryToRemoveAll api to delete a set of documents from the database.' +
    'The documents(s) are the ones that fall under the cts query given as input.');

// Directory query to collect documents in the specified directory.
const query = q.where(ctsQb.cts.directoryQuery('/test/dataMovement/requests/removeAllUris/'));

dbWriter.documents.queryToRemoveAll(query,{
    onCompletion:((summary) => {
        console.log(summary.docsRemovedSuccessfully+' documents were removed successfully.');
        console.log(summary.docsFailedToBeRemoved+' documents failed to be removed.');
        console.log('Time taken was '+summary.timeElapsed+' milliseconds.');
    })
});
