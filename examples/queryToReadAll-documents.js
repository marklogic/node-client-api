/*
 * Copyright (c) 2022 MarkLogic Corporation
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
