/*
 * Copyright 2014-2020 MarkLogic Corporation
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
 
const {Worker, isMainThread, parentPort, workerData} = require('worker_threads');

const TestE2EMultiStringsInStringsOut = require("./TestE2EMultiStringsInStringsOut.js");
var testconfig = require('../etc/test-config-qa.js');
var marklogic = require('../');

var db = marklogic.createDatabaseClient(testconfig.restEvaluatorConnection);

TestE2EMultiStringsInStringsOut.on(db).TestE2EMultiStringsIn(workerData.files, workerData.uris).then(res => {
	//console.log("TestE2EMultiStringsInStringsOut insert Return value is : %s", res);
	parentPort.postMessage("done");

	});