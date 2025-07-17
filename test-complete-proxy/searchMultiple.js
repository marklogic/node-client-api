/*
* Copyright © 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/
const {Worker, isMainThread, parentPort, workerData} = require('worker_threads');
const TestE2EMultiStringsInStringsOut = require("./TestE2EMultiStringsInStringsOut.js");
var testconfig = require('../etc/test-config-qa.js');
var marklogic = require('../');

var db = marklogic.createDatabaseClient(testconfig.restEvaluatorConnection);
	//console.log("TestE2EMultiStringsInStringsOut (workerData.search value is : %s", workerData.search);
	TestE2EMultiStringsInStringsOut.on(db).TestE2EMultiStringsOut(workerData.search).then(res => {
	
	//console.log("TestE2EMultiStringsInStringsOut Return value is : %s", res);
	parentPort.postMessage(res);
});
