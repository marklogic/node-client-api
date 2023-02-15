/*
 * Copyright (c) 2021 MarkLogic Corporation
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

let exutil = require('./example-util.js');
const marklogic = exutil.require('marklogic');
const dbWriter = marklogic.createDatabaseClient(exutil.restWriterConnection);
const Stream = require('stream');
const readable = new Stream.Readable({objectMode: true});

console.log('Write 1000 documents using writeAll with onCompletion option');

for(let i=0; i<1000; i++) {
    const temp = {
        uri: '/test/dataMovement/requests/'+i+'.json',
        contentType: 'application/json',
        content: {['key '+i]:'value '+i}
    };
    readable.push(temp);
}
readable.push(null);

dbWriter.documents.writeAll(readable,{

    onCompletion: ((summary) => {
        console.log(summary.docsWrittenSuccessfully+' documents were written successfully.');
        console.log(summary.docsFailedToBeWritten+' documents were not written.');
        console.log('Time taken was '+summary.timeElapsed+' milliseconds.');
    }),
    onBatchError: ((progressSoFar, documents, error) => {
        console.log(progressSoFar.docsWrittenSuccessfully+' documents were written successfully.');
        console.log('Document(s) failed to be written is/are '+progressSoFar.docsFailedToBeWritten+
            ' due to error - '+ error.toString());
        console.log('Time taken was '+progressSoFar.timeElapsed+' milliseconds.');
        return null;
    })
});
