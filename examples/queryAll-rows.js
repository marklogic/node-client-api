/*
* Copyright © 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
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
