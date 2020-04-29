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

const TestRequiredParam = require("./TestRequiredParam.js");
const TestE2EMultiStringsInStringsOut = require("./TestE2EMultiStringsInStringsOut.js");
const TestE2ESession = require("./TestE2ESession.js");

var testconfig = require('../etc/test-config-qa.js');

var marklogic = require('../');
var q = marklogic.queryBuilder;

var db = marklogic.createDatabaseClient(testconfig.restEvaluatorConnection);
var dbManageAdmin = marklogic.createDatabaseClient(testconfig.manageAdminConnection);
var sess = null;

describe('Required-Params-Test', function(){

   it('10 to API call', function(done){
   TestRequiredParam.on(db).TestE2EItemPrice(10).then(res => {
	   //console.debug("Return value is : %s", res);
	   expect(res).to.eql('String10')
          done();
   })
   .catch(err => {
          expect.fail(err.toString());
          done();
        });	
	});
	
	it('0 to API call', function(done){
    TestRequiredParam.on(db).TestE2EItemPrice(0).then(res => {
	   //console.debug("Return value is : %s", res);
	   expect(res).to.eql('1')
          done();
   })
   .catch(err => {
          expect.fail(err.toString());
          done();
        });	
	});
	
	it('-2 to API call', function(done){
    TestRequiredParam.on(db).TestE2EItemPrice(-2).then(res => {
	   //console.debug("Return value is : %s", res);
	   expect(res).to.eql('-1')
          done();
   })
   .catch(err => {
          expect.fail(err.toString());
          done();
        });	
	});
	
	it('12 to API call', function(done){
    TestRequiredParam.on(db).TestE2EItemPrice(12).then(res => {
	   //console.debug("Return value is : %s", res);
	   expect(res).to.eql('13')
          done();
   })
   .catch(err => {
          expect.fail(err.toString());
          done();
        });	
	});
	// Send in float.
	it('float to API call', function(done){
    TestRequiredParam.on(db).TestE2EIntegerParamReturnDoubleErrorCond(10, 10.06).then(res => {
		var tmp = unescape(res);
	   //console.debug("Return value fo 10, 10 is : %d", tmp);
	   expect(tmp).to.eql('10110.3')
          done();
   })
   .catch(err => {
          expect.fail(err.toString());
          done();
        });	
	});
	
	it('Sessions test Create', function(done){
		// Should have run Setup docs for services calls in nodejs-ds-setup-docs.js file.
		var uri = "session1.json";	
		var updatedStr;	
		var session;
		
		session = TestE2ESession.on(db).createSession();
			
		TestE2ESession.on(db).StoreInSession(session, uri, "Updated from original").then( res => {
				TestE2ESession.on(db).RetrieveFromSession(session, uri).then( resOut => {
			});
		}); 
		// Read outside of session
		db.documents.read(uri).result( function(documents) {
			documents.forEach(function(document) {
				updatedStr = JSON.stringify(document);
				//console.log(updatedStr);
				expect(updatedStr).to.include('Updated from original');
			});
		}, function(error) {
		console.log(JSON.stringify(error, null, 2));
		});
		 done();		
	});
			
	it('Verify with wrong Session', function(done){
		var sess;
		var docCont;
		var seconds = 5;
		var kVal = "content";
		try {
			sess1 = TestE2ESession.on(db).createSession();
			sess2 = TestE2ESession.on(db).createSession();
			
			TestE2ESession.on(db).EnableSession(sess1, "/session1.txt", "Checking first sessions");
		
			TestE2ESession.on(db).CheckOnSession(sess2).then( res => {
			// Nothing to do here.
			done();
			})
			.catch(
				err => {
				//console.debug("Return value for second session:", tmp2);
				expect(err.message).to.contain('call to /qa/test/TestE2ESession/CheckOnSession.sjs: cannot process response with 400 status'); 
				
				const errMapResp = err.body.errorResponse;
				expect(errMapResp.statusCode).to.eql(400);
				expect(errMapResp.status).to.eql("Bad Request");
				expect(errMapResp.messageCode).to.eql('XDMP-ARGTYPE');
				expect(errMapResp.message).to.contain('XDMP-ARGTYPE: cts.doc(null) -- arg1 is not of type String');        
				done();
			});
		}
	catch(err) {
	   console.debug(err);
	   done();
	}
	});
  
  // Error condtions verifications. 
  it('Error condtion 1 to API call', function(done){
    TestRequiredParam.on(db).TestE2EIntegerParamReturnDoubleErrorCond(null, 12).then(res => {
		var tmp = unescape(res);
	   //console.debug("Return value for null, 12 is : %d", tmp);
	   expect(tmp).to.eql('10000')
          done();
   })
   .catch(err => {
          expect.fail(err.toString());
          done();
        });	
	});
  
  it('Error condtion 2 to API call', function(done){
    TestRequiredParam.on(db).TestE2EIntegerParamReturnDoubleErrorCond(12, null).then(res => {
		var tmp = unescape(res);
	   //console.debug("Return value for 12, null is : %d", tmp);
	   expect(tmp).to.eql('20000')
          done();
   })
   .catch(err => {
          expect.fail(err.toString());
          done();
        });	
	});
	
	it('Required param not sent to API call', function(done){
    expect(() => TestRequiredParam.on(db).TestRequiredParam()).to.throw('null value not allowed for parameter');
          done();
   });
   
    it('Unauthorized user to API call', function(done){
   TestRequiredParam.on(dbManageAdmin).TestE2EIntegerParamReturnDoubleErrorCond(12, null).then(res => {
		var tmp = unescape(res);
	   //console.debug("Return value for 12, null is : %d", tmp);
          done();
   })
   .catch(err => {
	   var msg = err.toString();
	   expect(msg).to.include("cannot process response with 404 status");
       expect(msg).to.include(" call to /qa/test/TestRequiredParam/TestE2EIntegerParamReturnDoubleErrorCond.sjs");
       done();
        });	
	});
});
