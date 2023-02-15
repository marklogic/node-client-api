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
