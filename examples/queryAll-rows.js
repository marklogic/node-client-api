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

console.log('This example reads rows from the database based on - exportingRows.tdex found in test-basic/data folder.' +
    ' The view must be written to the modules database beforehand.');

const p = marklogic.planBuilder;
const planFromBuilderTemplate = p.fromView('soccer', 'matches', '');
dbWriter.rows.queryAll(planFromBuilderTemplate, {
    consistentSnapshot: true,
    onCompletion: ((summary) => {
        console.log(summary.rowsReadSuccessfully+' rows were transformed successfully.');
        console.log(summary.rowsFailedToBeRead+' rows failed to be transformed.');
        console.log('Time taken was '+summary.timeElapsed+' milliseconds.');
        console.log('consistentSnapshotTimestamp was '+summary.consistentSnapshotTimestamp);
    })
});
