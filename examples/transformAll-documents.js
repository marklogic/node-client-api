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
const transformName = 'Name_of_transform_in_the_database';

console.log('This example applies a transform to a set of documents that are already in the database.' +
    ' The transform used to configure the documents must be installed on the server beforehand.');

const Stream = require('stream');
let transformStream = new Stream.PassThrough({objectMode: true});

for(let i=0; i<100; i++) {
    const documentUri = '/test/dataMovement/requests/transformAll/'+i+'.json';
    transformStream.push(documentUri);
}
transformStream.push(null);

dbWriter.documents.transformAll(transformStream,{
    transform: [transformName, {'field_in_the_document':'Transformation_needed'}],
    onCompletion: ((summary) => {
        console.log(summary.docsTransformedSuccessfully+' documents were transformed successfully.');
        console.log(summary.docsFailedToBeTransformed+' documents failed to be transformed.');
        console.log('Time taken was '+summary.timeElapsed+' milliseconds.');
    })
});
