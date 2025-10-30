/*
* Copyright (c) 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
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
		let workersCompleted = 0;
		const totalWorkers = 2;
		let hasError = false;

		const handleWorkerComplete = (err) => {
			if (hasError) return;

			if (err) {
				hasError = true;
				done(err);
				return;
			}

			workersCompleted++;
			if (workersCompleted === totalWorkers) {
				done();
			}
		};

		const workerOneInsert = new Worker('./insertFromMultipleStreams.js', {workerData: {files: inputFiles1, uris:uris1}});
		workerOneInsert.on('done', (result) => {
			//console.log('workerOneInsert message is ' + result );
		});

		workerOneInsert.on('exit', (code) => {
			if (code !== 0) {
				handleWorkerComplete(new Error(`Worker workerOneInsert stopped with exit code ${code}`));
			} else {
				//console.debug('workerOneInsert exits normally');
				handleWorkerComplete();
			}
		});

		const workerTwoInsert = new Worker('./insertFromMultipleStreams.js', {workerData: {files: inputFiles2, uris:uris2}});
		workerTwoInsert.on('message', (result) => {
			//console.log('workerTwoInsert message is ' + result );
		});

		workerTwoInsert.on('exit', (code) => {
			if (code !== 0) {
				handleWorkerComplete(new Error(`Worker workerTwoInsert stopped with exit code ${code}`));
			} else {
				//console.debug('workerTwoInsert exits normally');
				handleWorkerComplete();
			}
		});
	} else {
		done();
	}
  });

  it('Verify inserts using client API query', function(done){
    Promise.all([
      db.documents.query(q.where(q.parsedFrom('Bush'))).result(),
      db.documents.query(q.where(q.parsedFrom('Lisa'))).result()
    ])
    .then(([bushResults, lisaResults]) => {
      const res1 = JSON.stringify(bushResults);
      console.log(res1);
      expect(res1).to.include('Monthly 1');
      expect(res1).to.include('Monthly 2');

      const res2 = JSON.stringify(lisaResults);
      console.log(res2);
      expect(res2).to.include('Times 1');
      expect(res2).to.include('Times 2');

      done();
    })
    .catch(err => {
      done(err);
    });
  });

	it('One worker', function(done){
		// Get results from all workers
		var searchResults1 = [];

		if (isMainThread) {
			const workerOneSearch = new Worker('./searchMultiple.js', {workerData: {search:'Bush'}});
			workerOneSearch.on('done', (result) => {
				searchResults1.push(result);
				//console.log('Results 1 from search is :', searchResults1);
				expect(searchResults1[0]).to.have.members(["/Test1stream11.json", "/Test1stream21.json"]);
			});
			workerOneSearch.on('exit', (code) => {
				if (code !== 0) {
					done(new Error(`Worker workerOneSearch stopped with exit code ${code}`));
				} else {
					//console.debug('workerOneSearch exits normally');
					done();
				}
			});
		} else {
			done();
		}
	});

	it('Multiple workers', function(done){
		// Get results from all workers
		var searchResults1 = [];
		var searchResults2 = [];

		if (isMainThread) {
			let workersCompleted = 0;
			const totalWorkers = 2;
			let hasError = false;

			const handleWorkerComplete = (err) => {
				if (hasError) return;

				if (err) {
					hasError = true;
					done(err);
					return;
				}

				workersCompleted++;
				if (workersCompleted === totalWorkers) {
					done();
				}
			};

			const workerOneSearch = new Worker('./searchMultiple.js', {workerData: {search:'Bush'}});
			workerOneSearch.on('done', (result) => {
				searchResults1.push(result);
				//console.log('Results 1 from search is :', searchResults1);
				expect(searchResults1[0]).to.have.members(["/Test1stream11.json", "/Test1stream21.json"]);
			});
			workerOneSearch.on('exit', (code) => {
				if (code !== 0) {
					handleWorkerComplete(new Error(`Worker workerOneSearch stopped with exit code ${code}`));
				} else {
					handleWorkerComplete();
				}
			});

			const workerTwoSearch = new Worker('./searchMultiple.js', {workerData: {search:'Lisa'}});
			workerTwoSearch.on('done', (result) => {
				searchResults2.push(result);
				//console.log('Results 2 from search is :', searchResults2);
				expect(searchResults2[0]).to.have.members(["/Test1stream12.json", "/Test1stream22.json"]);
			});
			workerTwoSearch.on('exit', (code) => {
				if (code !== 0) {
					handleWorkerComplete(new Error(`Worker workerTwoSearch stopped with exit code ${code}`));
				} else {
					handleWorkerComplete();
				}
			});
		} else {
			done();
		}
	});

	it('Multiple workers-One result back', function(done){
		// Get results from all workers
		var searchResults1 = [];
		var searchResults2 = [];

		if (isMainThread) {
			let workersCompleted = 0;
			const totalWorkers = 2;
			let hasError = false;

			const handleWorkerComplete = (err) => {
				if (hasError) return;

				if (err) {
					hasError = true;
					done(err);
					return;
				}

				workersCompleted++;
				if (workersCompleted === totalWorkers) {
					done();
				}
			};

			const workerOneSearch = new Worker('./searchMultiple.js', {workerData: {search:'Bush'}});
			workerOneSearch.on('done', (result) => {
				searchResults1.push(result);
				//console.log('Results 1 from search is :', searchResults1);
				expect(searchResults1[0]).to.have.members(["/Test1stream11.json", "/Test1stream21.json"]);
			});
			workerOneSearch.on('exit', (code) => {
				if (code !== 0) {
					handleWorkerComplete(new Error(`Worker workerOneSearch stopped with exit code ${code}`));
				} else {
					handleWorkerComplete();
				}
			});

			const workerTwoSearch = new Worker('./searchMultiple.js', {workerData: {search:'100'}});
			workerTwoSearch.on('done', (result) => {
				searchResults2.push(result);
				//console.log('Results 2 from search is :', searchResults2);
				expect(searchResults2[0]).to.eql([]);
			});
			workerTwoSearch.on('exit', (code) => {
				if (code !== 0) {
					handleWorkerComplete(new Error(`Worker workerTwoSearch stopped with exit code ${code}`));
				} else {
					handleWorkerComplete();
				}
			});
		} else {
			done();
		}
	});

	it('Multiple workers- incorrect data', function(done){
		// Get results from all workers
		var searchResults1 = [];

		if (isMainThread) {
			let workersCompleted = 0;
			const totalWorkers = 2;
			let hasError = false;

			const handleWorkerComplete = (err) => {
				if (hasError) return;

				if (err) {
					hasError = true;
					done(err);
					return;
				}

				workersCompleted++;
				if (workersCompleted === totalWorkers) {
					done();
				}
			};

			const workerOneSearch = new Worker('./searchMultiple.js', {workerData: {search:'Bush'}});
			workerOneSearch.on('done', (result) => {
				searchResults1.push(result);
				//console.log('Results 1 from search is :', searchResults1);
				expect(searchResults1[0]).to.have.members(["/Test1stream11.json", "/Test1stream21.json"]);
			});
			workerOneSearch.on('exit', (code) => {
				if (code !== 0) {
					handleWorkerComplete(new Error(`Worker workerOneSearch stopped with exit code ${code}`));
				} else {
					handleWorkerComplete();
				}
			});

			// Test worker with incorrect data - should fail/exit with error
			const workerBadData = new Worker('./searchMultiple.js', {workerData: {find:100}});
			workerBadData.on('error', (err) => {
				// Expected error path - worker received bad data
				//console.log('Expected error from workerBadData:', err.message);
				handleWorkerComplete();
			});
			workerBadData.on('exit', (code) => {
				if (code !== 0) {
					// This is also acceptable - worker exited with error code
					handleWorkerComplete();
				} else {
					// Worker shouldn't succeed with bad data
					handleWorkerComplete(new Error('Worker with incorrect data should have failed'));
				}
			});
		} else {
			done();
		}
	});
});
