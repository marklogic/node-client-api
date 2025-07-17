/*
* Copyright © 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/


// deleteEmptyIterator
//

const should = require('should');
const testconfig = require('../etc/test-config-qa.js');
const marklogic = require('../');
const dbWriter = marklogic.createDatabaseClient(testconfig.dmsdkrestWriterConnection);
const Stream = require('stream');
const ctsQb = marklogic.ctsQueryBuilder;
const q = marklogic.queryBuilder;
const query = q.where(ctsQb.cts.directoryQuery('/test/dataMovement/requests/removeAllUris/'));

let removeStream = new Stream.PassThrough({ objectMode: true });
let uris = [];

describe('Functional tests - data movement removeAllUris', function () {
    this.timeout(15000);
    beforeEach(function (done) {
        let readable = new Stream.Readable({ objectMode: true });
        removeStream = new Stream.PassThrough({ objectMode: true });
        uris = [];
        for (let i = 0; i < 100; i++) {
            const temp = {
                uri: '/test/dataMovement/requests/removeAllUris/' + i + '.json',
                contentType: 'application/json',
                content: { ['key']: 'initialValue' }
            };
            readable.push(temp);
            removeStream.push(temp.uri);
            uris.push(temp.uri);
        }
        readable.push(null);
        removeStream.push(null);

        dbWriter.documents.writeAll(readable, {
            onCompletion: ((summary) => {
                done();
            })
        });

    });

    it('delete Non Existent docs', function (done) {

        removeStream = new Stream.PassThrough({ objectMode: true });
        removeStream.push('nonExistent.json');
        removeStream.push('nonExistent2.json');
        removeStream.push(null);
        dbWriter.documents.removeAllUris(removeStream, {
            concurrentRequests: { multipleOf: 'hosts', multiplier: 4 },
            onCompletion: ((summary) => {
                summary.docsRemovedSuccessfully.should.be.equal(2);
                summary.docsFailedToBeRemoved.should.be.equal(0);
                summary.timeElapsed.should.be.greaterThanOrEqual(0);
                done();
            })
        });
    });

    it('should not removeAllUris with onBatchError returning null', function (done) {

        const testUser = marklogic.createDatabaseClient(testconfig.restReaderConnection);
        testUser.documents.removeAllUris(removeStream, {

            onBatchError: ((progressSoFar, documents, error) => {
                error.body.errorResponse.status.should.be.equal('Forbidden');
                progressSoFar.docsRemovedSuccessfully.should.be.equal(0);
                progressSoFar.timeElapsed.should.be.greaterThanOrEqual(0);
                return null;
            }),
            onCompletion: ((summary) => {
                summary.docsRemovedSuccessfully.should.be.equal(0);
                summary.docsFailedToBeRemoved.should.be.equal(100);
                summary.timeElapsed.should.be.greaterThanOrEqual(0);
                dbWriter.documents.remove(uris)
                    .result(function (response) {
                        done();
                    })
                    .catch(done)
                    .catch(err => done(err));
            })
        });
    });

    it('should throw error with invalid batchSize', function (done) {
        try {
            dbWriter.documents.removeAllUris(removeStream, {
                batchSize: -1
            });
        } catch (err) {
            err.toString().should.equal('Error: Invalid batchSize. batchSize cannot be less than or equal to 0.');
            done();
        }
    });

    it('should not removeAllUris with onBatchError returning error', function (done) {

        const testUser = marklogic.createDatabaseClient(testconfig.restReaderConnection);

        const remove = testUser.documents.removeAllUris(removeStream, {

            onBatchError: ((progressSoFar, documents, error) => {
                error.body.errorResponse.status.should.be.equal('Forbidden');
                progressSoFar.docsRemovedSuccessfully.should.be.equal(0);
                progressSoFar.docsFailedToBeRemoved.should.be.equal(100);
                progressSoFar.timeElapsed.should.be.greaterThanOrEqual(0);
                throw new Error('Stop Processing');
            }),
            onCompletion: ((summary) => {
                summary.docsRemovedSuccessfully.should.be.equal(0);
                summary.docsFailedToBeRemoved.should.be.equal(100);
                summary.timeElapsed.should.be.greaterThanOrEqual(0);
                summary.error.should.be.equal('Error: Stop Processing');
                dbWriter.documents.remove(uris)
                    .result(function (response) {
                        done();
                    })
                    .catch(err => done(err));
            })
        });
        remove.on('error', (err) => {
            err.message.should.be.equal('Stop Processing');
        });
    });

    it('should throw error with invalid onBatchError option', function (done) {

        const testUser = marklogic.createDatabaseClient(testconfig.restReaderConnection);
        const remove = (testUser.documents.removeAllUris(removeStream, {

            onBatchError: ((progressSoFar, documents, error) => {
                error.body.errorResponse.status.should.be.equal('Forbidden');
                progressSoFar.docsRemovedSuccessfully.should.be.equal(0);
                progressSoFar.timeElapsed.should.be.greaterThanOrEqual(0);
                return 10;
            }),
            onCompletion: ((summary) => {
                summary.docsRemovedSuccessfully.should.be.equal(0);
                summary.docsFailedToBeRemoved.should.be.equal(100);
                summary.timeElapsed.should.be.greaterThanOrEqual(0);
                summary.error.should.be.equal('Error: onBatchError should return null, empty array or a replacement array.');

            })
        }));

        remove.on('error', (err) => {
            err.message.should.be.equal('onBatchError should return null, empty array or a replacement array.');
            dbWriter.documents.remove(uris)
                .result(function (response) {
                    done();
                })
                .catch(err => done(err));
        });
    });

    it('should queryToRemoveAll documents with onBatchError returning empty array',
        done => {
            const testUser = marklogic.createDatabaseClient(testconfig.dmsdkrestReaderConnection);
            testUser.documents.queryToRemoveAll(query, {

                onBatchError: ((progressSoFar, documents, error) => {
                    error.body.errorResponse.status.should.be.equal('Forbidden');
                    progressSoFar.docsRemovedSuccessfully.should.be.equal(0);
                    progressSoFar.timeElapsed.should.be.greaterThanOrEqual(0);
                    return [];
                }),
                onCompletion: ((summary) => {
                    summary.docsRemovedSuccessfully.should.be.equal(0);
                    summary.docsFailedToBeRemoved.should.be.equal(100);
                    summary.timeElapsed.should.be.greaterThanOrEqual(0);
                    dbWriter.documents.remove(uris)
                        .result(function (response) {
                            done();
                        })
                        .catch(done)
                        .catch(err => done(err));
                })
            });
        });
});
