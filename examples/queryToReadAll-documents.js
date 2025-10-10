/*
* Copyright (c) 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/

const exutil = require('./example-util.js');
const marklogic = exutil.require('marklogic');
const ctsQb = marklogic.ctsQueryBuilder;
const q = marklogic.queryBuilder;
const Stream = require('stream');
const fs = require('fs');

const dbWriter = marklogic.createDatabaseClient(exutil.restWriterConnection);

let pipelined = false;
const readable = new Stream.PassThrough({objectMode:true});

console.log('This example uses queryToReadAll api to write the uri and content of the document(s) to test.txt. ' +
    'The documents(s) are the ones that fall under the cts query given as input.');

// Directory query to collect documents in the specified directory.
const query = q.where(ctsQb.cts.directoryQuery('/test/dataMovement/requests/readAll/'));

const queryToReadAllStream = dbWriter.documents.queryToReadAll(query,{
    onCompletion:((summary) => {
        console.log(summary.docsReadSuccessfully+' documents were read successfully.');
        console.log(summary.docsFailedToBeRead+' documents failed to be read.');
        console.log('Time taken was '+summary.timeElapsed+' milliseconds.');
    })
});

queryToReadAllStream.on('data', function(chunk){
    readable.push(chunk.uri+'\n');
    readable.push(chunk.content.toString()+'\n');
    if(!pipelined){
        pipelined = true;
        readable.pipe(fs.createWriteStream('test.txt'));
    }
});

queryToReadAllStream.on('end', function(item){
    readable.end();
});
