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

const TestE2ESession = require("./TestE2ESession.js");

var testconfig = require('../etc/test-config-qa.js');

var marklogic = require('../');

var db1 = marklogic.createDatabaseClient(testconfig.restEvaluatorConnection);
var db2 = marklogic.createDatabaseClient(testconfig.restEvaluatorConnection);

describe('Transactions-Tests', function(){
	
	it('same transaction', function(done) {
		// Insert and read back on same database client.
    this.timeout(10000);
    var tid = null;
	var sess;
    db1.transactions.open().result().
    then(function(response) {
      tid = response.txid;
	  // Make  data services calls to create session and write a document.
			sess = TestE2ESession.on(db1).createSession();
			TestE2ESession.on(db1).EnableSession(sess, "/ds-trans-1.txt", "Checking in transaction - one");
      return db1.documents.write({
        txid: tid,
        uri: '/test/transaction/doc1.json',
        contentType: 'application/json',
        content: {firstname: "John", lastname: "Doe", txKey: tid}
      }).result();
    }
	)
	.then(function(response) {
      return db1.transactions.commit(tid).
      result(function(response) {done();}, done);
    }
	)
	.then(function(response) {
		// should commit the write document and read it back on same client
		TestE2ESession.on(db1).CheckOnSession(sess).then( res => {
			docCont = util.inspect(res);
			console.log(/* docCont */);
			expect(docCont).to.include('Checking in transaction - one');
			//done();
			});
	}
	);
  });
  
  it('different transaction', function(done) {
    this.timeout(10000);
    var tid = null;
	var sess;
    db1.transactions.open().result().
    then(function(response) {
      tid = response.txid;
	  // Make  data services calls to create session and write a document.
			sess = TestE2ESession.on(db1).createSession();
			TestE2ESession.on(db1).EnableSession(sess, "/ds-trans-2.txt", "Checking in transaction - two");
      return db1.documents.write({
        txid: tid,
        uri: '/test/transaction/doc2.json',
        contentType: 'application/json',
        content: {firstname: "Jane", lastname: "Doe", txKey: tid}
      }).result();
    }
	).then(function(response) {
      return db1.transactions.commit(tid).
      result(function(response) {done();}, done);
    }
	).then(function(response) {
		TestE2ESession.on(db2).CheckOnSession(sess).then( res => {
			docCont = util.inspect(res);
			console.log(/* docCont */);
			// should commit the write document and read it back on different client
			expect(docCont).to.include('Checking in transaction - two');
			//done();
			});
	}
	);
  });
  
  });
  
 
