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
 
const fs = require('fs');
const util = require('util')

const expect = require('chai').expect;
const should = require('should');
var testconfig = require('../etc/test-config-qa.js');

var marklogic = require('../');
var q = marklogic.queryBuilder;

var db = marklogic.createDatabaseClient(testconfig.restEvaluatorConnection);


describe('Setup-Docs', function(){
	it('Sessions test Create', function(done){
		
			var db1 = marklogic.createDatabaseClient(testconfig.restEvaluatorConnection);
			db.documents.write(
				{ uri: 'session1.json',
				contentType: 'application/json',
				content: { root: 'original' }
			})
			.result(null, function(reponse) {
				//console.log(JSON.stringify(response));
			});
			done();
	});	
});
