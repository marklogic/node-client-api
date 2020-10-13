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

var testconfig = require('../etc/test-config-qa.js');

var marklogic = require('../');
var q = marklogic.queryBuilder;

var db = marklogic.createDatabaseClient(testconfig.restEvaluatorConnection);

describe('Error-Map-Test', function(){  
  it('Error mapping', function(done){
    TestRequiredParam.on(db).TestParamErrorMapping().then(res => {
   })
   .catch(err => {
          //console.log(JSON.stringify(err));
		  const errMapResp = err.body.errorResponse;
		  expect(errMapResp.statusCode).to.eql(482);
		  expect(errMapResp.status).to.eql("QA LEXVAL Message For 482");
          expect(errMapResp.messageCode).to.eql('XDMP-LEXVAL');
		  expect(errMapResp.message).to.contain('Test for BT Issue 53992');
          expect(errMapResp.message).to.contain('Invalid lexical value Test for BT Issue 53992');       
        });	
		done();
	});
	
	it('Multiple Error mappings', function(done){
	// Verify both errors.
    TestRequiredParam.on(db).TestE2EItemPriceWithErrorMap(10).then(res => {
   })
   .catch(err => {
		  const errMapResp = err.body.errorResponse;
		  expect(errMapResp.statusCode).to.eql(482);
		  expect(errMapResp.status).to.eql("QA Message For 482");
          expect(errMapResp.messageCode).to.eql('MLQA-ERROR-1');
		  expect(errMapResp.message).to.contain('Test for message status code 482');
          expect(errMapResp.messageDetail.messageTitle).to.contain('MLQA-ERROR-1');
        });	
		
	TestRequiredParam.on(db).TestE2EItemPriceWithErrorMap(1000).then(res => {
   })
   .catch(err => {
		  const errMapResp = err.body.errorResponse;
		  expect(errMapResp.statusCode).to.eql(539);
		  expect(errMapResp.status).to.eql("QA Message For 539");
          expect(errMapResp.messageCode).to.eql('MLQA-ERROR-2');
		  expect(errMapResp.message).to.contain('Test for message status code 539');
          expect(errMapResp.messageDetail.messageTitle).to.contain('MLQA-ERROR-2');
        });
		done();
	});
	
	it('Valid return and Error mapping 1', function(done){
	// Verify one valid return and second error mapping.
    TestRequiredParam.on(db).TestE2EItemPriceWithErrorMap(12).then(res => {
		var tmp = unescape(res);
	   //console.debug("Return value for 12, null is : %d", tmp);
	   expect(tmp).to.eql('13')
   })
   .catch(err => {
		  expect.fail(err.toString());
        });	
		
	TestRequiredParam.on(db).TestE2EItemPriceWithErrorMap(1000).then(res => {
   })
   .catch(err => {
		  const errMapResp = err.body.errorResponse;
		  expect(errMapResp.statusCode).to.eql(539);
		  expect(errMapResp.status).to.eql("QA Message For 539");
          expect(errMapResp.messageCode).to.eql('MLQA-ERROR-2');
		  expect(errMapResp.message).to.contain('Test for message status code 539');
          expect(errMapResp.messageDetail.messageTitle).to.contain('MLQA-ERROR-2');
          done();
        });
	done();
	});
	
	it('Valid return and Error mapping 2', function(done){
	// Verify first error mapping and one valid return.
	TestRequiredParam.on(db).TestParamErrorMapping().then(res => {
   })
   .catch(err => {
          //console.log(JSON.stringify(err));
		  const errMapResp = err.body.errorResponse;
		  expect(errMapResp.statusCode).to.eql(482);
		  expect(errMapResp.status).to.eql("QA LEXVAL Message For 482");
          expect(errMapResp.messageCode).to.eql('XDMP-LEXVAL');
		  expect(errMapResp.message).to.contain('Test for BT Issue 53992');
          expect(errMapResp.message).to.contain('Invalid lexical value Test for BT Issue 53992');       
        });	
    TestRequiredParam.on(db).TestE2EItemPriceWithErrorMap(199).then(res => {
		var tmp = unescape(res);
	   //console.debug("Return value for 199, null is : %d", tmp);
	   expect(tmp).to.eql('200')
   })
   .catch(err => {
		  expect.fail(err.toString());
        });
		done();
	});
	
	it('Valid return and Error mapping 3', function(done){
	// Verify App server and then error mapping.
	TestRequiredParam.on(db).TestE2EItemPriceWithErrorMap(10).then(res => {
		// Nothing to do here.
   })
   .catch(err => {
          //console.log(JSON.stringify(err));
		  const errMapResp = err.body.errorResponse;
		  expect(errMapResp.statusCode).to.eql(482);
		  expect(errMapResp.status).to.eql("QA Message For 482");
          expect(errMapResp.messageCode).to.eql('MLQA-ERROR-1');
		  expect(errMapResp.message).to.contain('Test for message status code 482');
          expect(errMapResp.messageDetail.messageTitle).to.contain('MLQA-ERROR-1');     
        });	
    TestRequiredParam.on(db).TestE2EItemPriceWithErrorMap(true).then(res => {
		// Nothing to do here.
   })
   .catch(err => {
		//console.log(JSON.stringify(err));
		const errMapResp = err.body.errorResponse;
		expect(errMapResp.statusCode).to.eql(400);
		expect(errMapResp.status).to.eql('Bad Request');
		expect(errMapResp.messageCode).to.eql('XDMP-LEXVAL');
		expect(errMapResp.message).to.contain('Invalid lexical value'); 
        });
		done();
	});

});
