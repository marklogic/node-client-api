/*
* Copyright (c) 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
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

describe('Functional tests - data movement - nodejs-dmsdk-removeAllUris', function () {
    this.timeout(15000);
    beforeEach(async function () {
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

        await new Promise((resolve) => {
            dbWriter.documents.writeAll(readable, {
                onCompletion: (() => {
                    resolve();
                })
            });
        });
    });

    it('delete Non Existent docs', async function () {
        removeStream = new Stream.PassThrough({ objectMode: true });
        removeStream.push('nonExistent.json');
        removeStream.push('nonExistent2.json');
        removeStream.push(null);
        const summary = await new Promise((resolve) => {
            dbWriter.documents.removeAllUris(removeStream, {
                concurrentRequests: { multipleOf: 'hosts', multiplier: 4 },
                onCompletion: ((summary) => {
                    resolve(summary);
                })
            });
        });
        summary.docsRemovedSuccessfully.should.be.equal(2);
        summary.docsFailedToBeRemoved.should.be.equal(0);
        summary.timeElapsed.should.be.greaterThanOrEqual(0);
    });

    it('should not removeAllUris with onBatchError returning null', async function () {
        const testUser = marklogic.createDatabaseClient(testconfig.restReaderConnection);
        const summary = await new Promise((resolve) => {
            testUser.documents.removeAllUris(removeStream, {
                onBatchError: ((progressSoFar, documents, error) => {
                    error.body.errorResponse.status.should.be.equal('Forbidden');
                    progressSoFar.docsRemovedSuccessfully.should.be.equal(0);
                    progressSoFar.timeElapsed.should.be.greaterThanOrEqual(0);
                    return null;
                }),
                onCompletion: ((summary) => {
                    resolve(summary);
                })
            });
        });
        summary.docsRemovedSuccessfully.should.be.equal(0);
        summary.docsFailedToBeRemoved.should.be.equal(100);
        summary.timeElapsed.should.be.greaterThanOrEqual(0);
        await dbWriter.documents.remove(uris).result();
    });

    it('should throw error with invalid batchSize', function () {
        try {
            dbWriter.documents.removeAllUris(removeStream, {
                batchSize: -1
            });
        } catch (err) {
            err.toString().should.equal('Error: Invalid batchSize. batchSize cannot be less than or equal to 0.');
        }
    });

    it('should not removeAllUris with onBatchError returning error', async function () {
        const testUser = marklogic.createDatabaseClient(testconfig.restReaderConnection);

        const summary = await new Promise((resolve, reject) => {
            const remove = testUser.documents.removeAllUris(removeStream, {
                onBatchError: ((progressSoFar, documents, error) => {
                    try {
                        error.body.errorResponse.status.should.be.equal('Forbidden');
                        progressSoFar.docsRemovedSuccessfully.should.be.equal(0);
                        progressSoFar.docsFailedToBeRemoved.should.be.equal(100);
                        progressSoFar.timeElapsed.should.be.greaterThanOrEqual(0);
                        throw new Error('Stop Processing');
                    } catch (e) {
                        return e;
                    }
                }),
                onCompletion: ((summary) => {
                    resolve(summary);
                })
            });
            remove.on('error', (err) => {
                err.message.should.be.equal('Stop Processing');
                reject(err);
            });
        }).catch(err => err);

        if (summary.message !== 'Stop Processing') {
            summary.docsRemovedSuccessfully.should.be.equal(0);
            summary.docsFailedToBeRemoved.should.be.equal(100);
            summary.timeElapsed.should.be.greaterThanOrEqual(0);
            summary.error.should.be.equal('Error: Stop Processing');
        }
        await dbWriter.documents.remove(uris).result();
    });

    it('should throw error with invalid onBatchError option', async function () {
        const testUser = marklogic.createDatabaseClient(testconfig.restReaderConnection);
        const err = await new Promise((resolve) => {
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
                resolve(err);
            });
        });

        err.message.should.be.equal('onBatchError should return null, empty array or a replacement array.');
        await dbWriter.documents.remove(uris).result();
    });

    it('should queryToRemoveAll documents with onBatchError returning empty array', async () => {
        const testUser = marklogic.createDatabaseClient(testconfig.dmsdkrestReaderConnection);
        const summary = await new Promise((resolve) => {
            testUser.documents.queryToRemoveAll(query, {
                onBatchError: ((progressSoFar, documents, error) => {
                    error.body.errorResponse.status.should.be.equal('Forbidden');
                    progressSoFar.docsRemovedSuccessfully.should.be.equal(0);
                    progressSoFar.timeElapsed.should.be.greaterThanOrEqual(0);
                    return [];
                }),
                onCompletion: ((summary) => {
                    resolve(summary);
                })
            });
        });
        summary.docsRemovedSuccessfully.should.be.equal(0);
        summary.docsFailedToBeRemoved.should.be.equal(100);
        summary.timeElapsed.should.be.greaterThanOrEqual(0);
        await dbWriter.documents.remove(uris).result();
    });
});
