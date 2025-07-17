/*
* Copyright © 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/

 
const {Worker, isMainThread, parentPort, workerData} = require('worker_threads');

const TestE2EMultiStringsInStringsOut = require("./TestE2EMultiStringsInStringsOut.js");
var testconfig = require('../etc/test-config-qa.js');
var marklogic = require('../');

var db = marklogic.createDatabaseClient(testconfig.restEvaluatorConnection);

TestE2EMultiStringsInStringsOut.on(db).TestE2EMultiStringsIn(workerData.files, workerData.uris).then(res => {
	//console.log("TestE2EMultiStringsInStringsOut insert Return value is : %s", res);
	parentPort.postMessage("done");

	});
