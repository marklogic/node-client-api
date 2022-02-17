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
const ctsQb = marklogic.ctsQueryBuilder;
const q = marklogic.queryBuilder;

console.log('This example uses queryAll api to return uris of the documents falling under the cts query given as input.');

// Directory query to collect uris of documents in the specified directory.
const query = q.where(ctsQb.cts.directoryQuery('/test/dataMovement/requests/queryAll/'));

dbWriter.documents.queryAll(query, {
    onCompletion: ((summary) => {
        console.log(summary.urisReadSoFar+' uris were retrieved successfully.');
        console.log(summary.urisFailedToBeRead+' uris failed to be retrieved.');
        console.log('Time taken was '+summary.timeElapsed+' milliseconds.');
    })
});
