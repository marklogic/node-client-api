/*
* Copyright © 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/

let exutil = require('./example-util.js');
const marklogic = require('../');
const dbWriter = marklogic.createDatabaseClient(exutil.restWriterConnection);

console.log('This example returns the permission, metadataValues, collections and quality of the documents using readAll ' +
    'api.');

const Stream = require('stream');
let uriStream = new Stream.PassThrough({objectMode: true});

// The user provides the input(uriStream) containing the uris of the documents.
// The permission, metadataValues, collections and quality of these documents are returned using the readAll api.

for(let i=0; i<100; i++) {
    const documentUri = '/test/dataMovement/requests/readAll/'+i+'.json';
    uriStream.push(documentUri);
}
uriStream.push(null);

dbWriter.documents.readAll(uriStream,{
    categories: ['permissions', 'metadataValues', 'collections', 'quality'],
    onCompletion: ((summary) => {
        console.log(summary.docsReadSuccessfully+' documents were read successfully.');
        console.log(summary.docsFailedToBeRead+' documents failed to be read.');
        console.log('Time taken was '+summary.timeElapsed+' milliseconds.');
    })
});
