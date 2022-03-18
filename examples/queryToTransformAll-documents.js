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
const dbWriter = marklogic.createDatabaseClient(exutil.restWriterConnection);
const transformName = 'Name_of_transform_in_the_database';

console.log('This example uses queryToTransformAll api to apply a transform to a set of documents that are already in ' +
    'the database. The transform used to configure the documents must be installed on the server beforehand. ' +
    'The documents(s) are the ones that fall under the cts query given as input.');

// Directory query to collect documents in the specified directory.
const query = q.where(ctsQb.cts.directoryQuery('/test/dataMovement/requests/transformAll/'));

dbWriter.documents.queryToTransformAll(query,{
    transform: [transformName, {'field_in_the_document':'Transformation_needed'}],
    onCompletion:((summary) => {
        console.log(summary.docsTransformedSuccessfully+' documents were transformed successfully.');
        console.log(summary.docsFailedToBeTransformed+' documents failed to be transformed.');
        console.log('Time taken was '+summary.timeElapsed+' milliseconds.');
    })
});
