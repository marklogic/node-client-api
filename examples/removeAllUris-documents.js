/*
* Copyright © 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/


const exutil = require('./example-util.js');
const marklogic = require('../');
const dbWriter = marklogic.createDatabaseClient(exutil.restWriterConnection);

console.log('This example deletes a set of documents from the database.');

const Stream = require('stream');
let removeAllUrisStream = new Stream.PassThrough({objectMode: true});

for(let i=0; i<100; i++) {
    const documentUri = '/test/dataMovement/requests/removeAllUris/'+i+'.json';
    removeAllUrisStream.push(documentUri);
}
removeAllUrisStream.push(null);

dbWriter.documents.removeAllUris(removeAllUrisStream,{
    concurrentRequests : {multipleOf:'hosts', multiplier:4},
    onCompletion: ((summary) => {
        console.log(summary.docsRemovedSuccessfully+' documents were removed successfully.');
        console.log(summary.docsFailedToBeRemoved+' documents failed to be removed.');
        console.log('Time taken was '+summary.timeElapsed+' milliseconds.');
    })
});
