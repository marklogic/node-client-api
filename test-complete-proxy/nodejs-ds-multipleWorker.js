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

const expect = require('chai').expect;
const should = require('should');

const {Worker, isMainThread, parentPort, workerData} = require('worker_threads');

var testconfig = require('../etc/test-config-qa.js');

var marklogic = require('../');
var q = marklogic.queryBuilder;

var db = marklogic.createDatabaseClient(testconfig.restEvaluatorConnection);
  // Run tests from test-complete-proxy folder. Else adjust paths of worker's js files.
  describe('Multiple-Worker-Test', function(){
	before(function(done) {
    // runs once before the first test in this block
	var s11 = 'Vannevar Bush wrote an article for The Atlantic Monthly 1';
	var s12 = 'Lisa wrote an article for The Strait Times 1';
		
	var s21 = 'Vannevar Bush wrote an article for The Atlantic Monthly 2';
	var s22 = 'Lisa wrote an article for The Strait Times 2';
		
	var inputFiles1 = [s11, s12];
	var uris1 = ['Test1stream11', 'Test1stream12'];
		
	var inputFiles2 = [s21, s22];
	var uris2 = ['Test1stream21', 'Test1stream22'];
			
	if (isMainThread) {
		const workerOneInsert = new Worker('./insertFromMultipleStreams.js', {workerData: {files: inputFiles1, uris:uris1}});
		workerOneInsert.on('done', (result) => {
			//console.log('workerOneInsert message is ' + result );			
	});
	
	workerOneInsert.on('exit', (code) => {
        if (code !== 0)
          reject(new Error('Worker workerOneInsert stopped with exit code ${code}'));
		//else console.debug('workerOneInsert exits normally');
      });
		
	const workerTwoInsert = new Worker('./insertFromMultipleStreams.js', {workerData: {files: inputFiles2, uris:uris2}});
	workerTwoInsert.on('message', (result) => {
		//console.log('workerTwoInsert message is ' + result );
	});
	
	workerTwoInsert.on('exit', (code) => {
        if (code !== 0)
          reject(new Error('Worker workerTwoInsert stopped with exit code ${code}'));
	   //else console.debug('workerTwoInsert exits normally');
    });
	
	}
	
	done();
  });
  
  it('Verify inserts using client API query', function(done){
	  
	  var res1;
	  db.documents.query(q.where(q.parsedFrom('Bush'))).result( function(results) {
		res1 = JSON.stringify(results);
		//console.log(res1);
		expect(res1).to.include('Monthly 1');
		expect(res1).to.include('Monthly 2');
	  });
		
	  var res2;
	  db.documents.query(q.where(q.parsedFrom('Lisa'))).result( function(results) {
		res2 = JSON.stringify(results);
		//console.log(res2);
		expect(res2).to.include('Times 1');
		expect(res2).to.include('Times 2');

	  done();
	  
	});
  });
	
	it('One worker', function(done){
		try {
			// Get results from all workers
			var searchResults1 = [];
			var searchResults2 = [];
			
			if (isMainThread) {
				const workerOneSearch = new Worker('./searchMultiple.js', {workerData: {search:'Bush'}});
				workerOneSearch.on('done', (result) => {
				searchResults1.push(result);
				//console.log('Results 1 from search is :', searchResults1);
				expect(searchResults1[0]).to.have.members(["/Test1stream11.json", "/Test1stream21.json"]);
				});
				workerOneSearch.on('exit', (code) => {
				if (code !== 0)
					reject(new Error('Worker workerOneSearch stopped with exit code ${code}'));
				//else console.debug('workerOneSearch exits normally');
				});
			done();
		} 
		}
	catch(err) {
	   //console.debug(err);
	   done();
	}
	});	
	
	it('Multiple workers', function(done){
		try {
			// Get results from all workers
			var searchResults1 = [];
			var searchResults2 = [];
			
			if (isMainThread) {
				const workerOneSearch = new Worker('./searchMultiple.js', {workerData: {search:'Bush'}});
				workerOneSearch.on('done', (result) => {
				searchResults1.push(result);
				//console.log('Results 1 from search is :', searchResults1);
				expect(searchResults1[0]).to.have.members(["/Test1stream11.json", "/Test1stream21.json"]);
				});
				
				const workerTwoSearch = new Worker('./searchMultiple.js', {workerData: {search:'Lisa'}});
				workerTwoSearch.on('done', (result) => {
				searchResults2.push(result);
				//console.log('Results 2 from search is :', searchResults2);
				expect(searchResults2[0]).to.have.members(["/Test1stream12.json", "/Test1stream22.json"]);
			});
			done();
		} 
		}
	catch(err) {
	   //console.debug(err);
	   done();
	}
	});	
	
	it('Multiple workers-One result back', function(done){
		try {
			// Get results from all workers
			var searchResults1 = [];
			var searchResults2 = [];
			
			if (isMainThread) {
				const workerOneSearch = new Worker('./searchMultiple.js', {workerData: {search:'Bush'}});
				workerOneSearch.on('done', (result) => {
				searchResults1.push(result);
				//console.log('Results 1 from search is :', searchResults1);
				expect(searchResults1[0]).to.have.members(["/Test1stream11.json", "/Test1stream21.json"]);
				});
				
				const workerTwoSearch = new Worker('./searchMultiple.js', {workerData: {search:'100'}});
				workerTwoSearch.on('done', (result) => {
				searchResults2.push(result);
				//console.log('Results 2 from search is :', searchResults2);
				expect(searchResults2[0]).to.eql([]);
			});
			done();
		} 
		}
	catch(err) {
	   //console.debug(err);
	   done();
	}
	});	
	
	it('Multiple workers- incorrect data', function(done){
		try {
			// Get results from all workers
			var searchResults1 = [];
			var searchResults2 = [];
			
			if (isMainThread) {
				const workerOneSearch = new Worker('./searchMultiple.js', {workerData: {search:'Bush'}});
				workerOneSearch.on('done', (result) => {
				searchResults1.push(result);
				//console.log('Results 1 from search is :', searchResults1);
				expect(searchResults1[0]).to.have.members(["/Test1stream11.json", "/Test1stream21.json"]);
				});
				
				expect(
				() => new Worker('./searchMultiple.js', {workerData: {find:100}}).to.throw('null value not allowed for parameter'));
			done();
		} 
		}
	catch(err) {
	   //console.debug(err);
	   done();
	}
	});
});
