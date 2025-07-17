/*
* Copyright © 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
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
