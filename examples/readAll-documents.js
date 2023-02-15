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
