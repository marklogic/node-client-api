/*
 * Copyright 2014-2021 MarkLogic Corporation
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
const path = require("path");

const expect = require('chai').expect;
const should = require('should');

var testconfig = require('../etc/test-config-qa.js');

var marklogic = require('../');
var q = marklogic.queryBuilder;
var db = marklogic.createDatabaseClient(testconfig.restEvaluatorConnection);
var dbManageAdmin = marklogic.createDatabaseClient(testconfig.manageAdminConnection);
var sess = null;
// Run tests from test-complete-proxy folder. 
describe('Dynamic data services tests', function(){
  it('TestE2EItemPrice-param-posNum', function(done) {
	const serviceDeclaration = JSON.parse(fs.readFileSync('./ml-modules/TestRequiredParam/service.json', {encoding: 'utf8'})); 
    serviceDeclaration.endpointExtension = '.sjs';
    const endpointDeclaration = JSON.parse(fs.readFileSync('./ml-modules/TestRequiredParam/TestE2EItemPrice.api', {encoding: 'utf8'}));
    const serviceCaller = db.serviceCaller(serviceDeclaration, [endpointDeclaration]);
    const params = {itemId:10};

    serviceCaller.call(endpointDeclaration.functionName, params)
      .then(output => {
		//console.debug("Return value is : %s", output);
        expect(output).to.eql('String10')
        done();
      })
      .catch(err => {
		console.log('Error from TestE2EItemPrice-param-posNum ' + err);
        done(err);
      });
    });
	
	it('TestE2EItemPrice-param-zero', function(done) {
	const serviceDeclaration = JSON.parse(fs.readFileSync('./ml-modules/TestRequiredParam/service.json', {encoding: 'utf8'})); 
    serviceDeclaration.endpointExtension = '.sjs';
    const endpointDeclaration = JSON.parse(fs.readFileSync('./ml-modules/TestRequiredParam/TestE2EItemPrice.api', {encoding: 'utf8'}));
    const serviceCaller = db.serviceCaller(serviceDeclaration, [endpointDeclaration]);
    const params = {itemId:0};

    serviceCaller.call(endpointDeclaration.functionName, params)
      .then(output => {
		//console.debug("Return value is : %s", output);
        expect(output).to.eql('1')
        done();
      })
      .catch(err => {
		console.log('Error from TestE2EItemPrice-param-zero ' + err);
        done(err);
      });
    });
	
	it('TestE2EItemPrice-param-negNum', function(done) {
	const serviceDeclaration = JSON.parse(fs.readFileSync('./ml-modules/TestRequiredParam/service.json', {encoding: 'utf8'})); 
    serviceDeclaration.endpointExtension = '.sjs';
    const endpointDeclaration = JSON.parse(fs.readFileSync('./ml-modules/TestRequiredParam/TestE2EItemPrice.api', {encoding: 'utf8'}));
    const serviceCaller = db.serviceCaller(serviceDeclaration, [endpointDeclaration]);
    const params = {itemId:-2};

    serviceCaller.call(endpointDeclaration.functionName, params)
      .then(output => {
		//console.debug("Return value is : %s", output);
        expect(output).to.eql('-1')
        done();
      })
      .catch(err => {
		console.log('Error from TestE2EItemPrice-param-negNum ' + err);
        done(err);
      });
    });
	
	it('TestE2EIntegerParamReturnDoubleErrorCond-param-floats', function(done) {
	const serviceDeclaration = JSON.parse(
	      fs.readFileSync('./ml-modules/TestRequiredParam/service.json', 
	      {encoding: 'utf8'})
    ); 
    serviceDeclaration.endpointExtension = '.sjs';
    const endpointDeclaration = JSON.parse(
	      fs.readFileSync('./ml-modules/TestRequiredParam/TestE2EIntegerParamReturnDoubleErrorCond.api', 
		  {encoding: 'utf8'})
    );
    const serviceCaller = db.serviceCaller(serviceDeclaration, [endpointDeclaration]);
    const params = {items:10,
	                price:10.06
				   };

    serviceCaller.call(endpointDeclaration.functionName, params)
      .then(output => {
		//console.debug("Return value is : %s", output);
		var tmp = unescape(output);
        expect(tmp).to.eql('10110.3')
        done();
      })
      .catch(err => {
		console.log('Error from TestE2EIntegerParamReturnDoubleErrorCond-param-floats ' + err);
        done(err);
      });
    });
	
	it('TestE2EIntegerParamReturnDoubleErrorCond-param-null', function(done) {
	const serviceDeclaration = JSON.parse(
	      fs.readFileSync('./ml-modules/TestRequiredParam/service.json', 
	      {encoding: 'utf8'})
    ); 
    serviceDeclaration.endpointExtension = '.sjs';
    const endpointDeclaration = JSON.parse(
	      fs.readFileSync('./ml-modules/TestRequiredParam/TestE2EIntegerParamReturnDoubleErrorCond.api', 
		  {encoding: 'utf8'})
    );
    const serviceCaller = db.serviceCaller(serviceDeclaration, [endpointDeclaration]);
    const params = {items:null,
	                price:10.06
				   };

    serviceCaller.call(endpointDeclaration.functionName, params)
      .then(output => {
		//console.debug("Return value is : %s", output);
		var tmp = unescape(output);
        expect(tmp).to.eql('10000')
        done();
      })
      .catch(err => {
		console.log('Error from TestE2EIntegerParamReturnDoubleErrorCond-param-floats ' + err);
        done(err);
      });
    });
	
	it('TestE2EItemPriceWithErrorMap-errorMap', function(done) {
	const serviceDeclaration = JSON.parse(
	      fs.readFileSync('./ml-modules/TestRequiredParam/service.json', 
	      {encoding: 'utf8'})
    ); 
    serviceDeclaration.endpointExtension = '.sjs';
    const endpointDeclaration = JSON.parse(
	      fs.readFileSync('./ml-modules/TestRequiredParam/TestE2EItemPriceWithErrorMap.api', 
		  {encoding: 'utf8'})
    );
    const serviceCaller = db.serviceCaller(serviceDeclaration, [endpointDeclaration]);
    const params = {itemId:1000};

    serviceCaller.call(endpointDeclaration.functionName, params)
      .then(res => {
		 //console.log('Error from TestE2EItemPriceWithErrorMap-errorMap ' + JSON.stringify(res)); 
   })
   .catch(err => {
		  const errMapResp = err.body.errorResponse;
		  //console.log(JSON.stringify(err));
		  expect(errMapResp.message).to.contain('Test for message status code 539');
          expect(errMapResp.messageDetail.messageTitle).to.contain('MLQA-ERROR-2');
		  expect(errMapResp.statusCode).to.eql(539);
		  expect(errMapResp.status).to.eql("QA Message For 539");
          expect(errMapResp.messageCode).to.eql('MLQA-ERROR-2');
		  
        });
		done();
	});
	
	it('TestE2EItemPrice-endpoint-caller', function(done) {
	const serviceDeclaration = JSON.parse(fs.readFileSync('./ml-modules/TestRequiredParam/service.json', {encoding: 'utf8'})); 
    const endpointDeclaration = JSON.parse(fs.readFileSync('./ml-modules/TestRequiredParam/TestE2EItemPrice.api', {encoding: 'utf8'}));
    endpointDeclaration.endpoint = serviceDeclaration.endpointDirectory+endpointDeclaration.functionName+'.sjs';
	const endptCaller = db.endpointCaller(endpointDeclaration);
    const params = {itemId:10};

    endptCaller.call(params)
      .then(output => {
		//console.debug("Return value is : %s", output);
        expect(output).to.eql('String10')
        done();
      })
      .catch(err => {
		console.log('Error from TestE2EItemPrice-endpoint-caller ' + err);
        done(err);
      });
    });
    
});
