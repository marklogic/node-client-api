/*
* Copyright © 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/
var should = require('should');

var testconfig = require('../etc/test-config-qa.js');

var marklogic = require('../');

var db = marklogic.createDatabaseClient(testconfig.restWriterConnection);
var dbAdmin = marklogic.createDatabaseClient(testconfig.restAdminConnection);

function delay(t, val) {
    return new Promise(resolve => setTimeout(resolve, t, val));
}

describe('Document transaction timelimit test', function () {

    after('should remove all documents', function (done) {
        dbAdmin.documents.removeAll({ all: true })
            .result(function (response) {
                done();
            });
    });

    var tid = 0;
    it('Uncommitted transactions should timeout', function (done) {
        this.timeout(20000);
        // Start a transaction
        db.transactions.open({ transactionName: 'nodeTransaction', timeLimit: 3 })
            .result(function (response) {
                tid = response.txid;
                // Write a document as part of the transaction
                return db.documents.write({
                    txid: tid,
                    uri: '/test/transaction/doc1.json',
                    contentType: 'application/json',
                    content: { firstname: 'John', lastname: 'Doe', txKey: tid }
                })
                    .result(
                        function (response) {
                            return response;
                        },
                        function (err) {
                            console.error('Failed to write document in transaction');
                            done(err);
                        }
                    );
            })
            .then(function (response) {
                response.documents[0].uri.should.equal('/test/transaction/doc1.json');
                // Get the status of the transaction
                return db.transactions.read(tid)
                    .result(
                        function (response) {
                            return response;
                        },
                        function (err) {
                            console.error('Failed to read transaction state');
                        }
                    );
            })
            .then(function (response) {
                response['transaction-status']['transaction-name'].should.equal('nodeTransaction');
                parseInt(response['transaction-status']['time-limit']).should.be.above(0);
            })
            .then(() => {
                // Attempt to read document using the transaction ID (it should succeed)
                return db.documents.read({ uris: '/test/transaction/doc1.json', txid: tid, })
                    .result(
                        function (response) {
                            response[0].uri.should.equal('/test/transaction/doc1.json');
                        },
                        function (err) {
                            done(err);
                        }
                    );
            })
            .then(() => {
                // Wait for the transaction to timeout
                return delay(4000);
            })
            .then(() => {
                // Attempt to read document using the transaction ID (it should fail)
                return db.documents.read({ uris: '/test/transaction/doc1.json', txid: tid, })
                    .result(
                        function (response) {
                            done(new Error('The read should fail since the transaction should have timed out.'));
                        },
                        function (err) {
                            err.statusCode.should.equal(400);
                            err.body.errorResponse.messageCode.should.equal('XDMP-NOTXN');
                        }
                    );
            })
            .then(() => {
                // Attempt to check the transaction status again (it should fail)
                return db.transactions.commit(tid)
                    .result(
                        function (response) {
                            done(new Error('The transaction status check should fail since the transaction should have timed out.'));
                        },
                        function (err) {
                            err.statusCode.should.equal(400);
                            err.body.errorResponse.messageCode.should.equal('XDMP-NOTXN');
                            done();
                        });
            });
    });
});
