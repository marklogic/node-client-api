/*
* Copyright (c) 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/

const should = require('should');
const testconfig = require('../etc/test-config-qa.js');
const marklogic = require('../');
const dbWriter = marklogic.createDatabaseClient(testconfig.dmsdkrestWriterConnection);
const restAdminDB = marklogic.createDatabaseClient(testconfig.dmsdkrestAdminConnection);
const Stream = require('stream');
const fs = require('fs');

let transformStream = new Stream.PassThrough({ objectMode: true });
let uris = [];
let transformName = 'WriteBatcherTest_transform';
let transformPath = './test-basic/data/transformAll_transform.js';
const ctsQb = marklogic.ctsQueryBuilder;
const q = marklogic.queryBuilder;
const query = q.where(ctsQb.cts.directoryQuery('/test/dataMovement/requests/transformAll/'));

describe('data movement transformAll - nodejs-dmsdk-queryToTransformAll', function () {

    before(async function () {
        await restAdminDB.config.transforms.write(transformName, 'javascript',
            fs.createReadStream(transformPath)).result();
        for (let i = 0; i < 100; i++) {
            uris.push('/test/dataMovement/requests/transformAll/' + i + '.json');
        }
    });

    beforeEach(async function () {
        let readable = new Stream.Readable({ objectMode: true });
        transformStream = new Stream.PassThrough({ objectMode: true });
        for (let i = 0; i < 100; i++) {
            const temp = {
                uri: '/test/dataMovement/requests/transformAll/' + i + '.json',
                contentType: 'application/json',
                content: { key: 'initialValue' }
            };
            readable.push(temp);
            transformStream.push(temp.uri);
        }
        readable.push(null);
        transformStream.push(null);

        return new Promise((resolve, reject) => {
            dbWriter.documents.writeAll(readable, {
                onCompletion: ((summary) => {
                    resolve(summary);
                }),
                onError: (error) => {
                    reject(error);
                }
            });
        });
    });

    afterEach( async function () {
        await dbWriter.documents.remove(uris).result();
    });

    it('should queryToTransformAll documents with onCompletion, transform, concurrentRequests and transformStrategy as ignore', async function () {
        const summary = await new Promise((resolve, reject) => {
            dbWriter.documents.queryToTransformAll(query, {
                transform: [transformName, { newValue: 'transformedValue' }],
                concurrentRequests: { multipleOf: 'hosts', multiplier: 4 },
                transformStrategy: 'ignore',
                onCompletion: ((summary) => {
                    resolve(summary);
                }),
                onError: (error) => {
                    reject(error);
                }
            });
        });

        summary.docsTransformedSuccessfully.should.be.equal(100);
        summary.docsFailedToBeTransformed.should.be.equal(0);
        summary.timeElapsed.should.be.greaterThanOrEqual(0);

        await verifyDocs('initialValue');
    });

    it('should transformAll documents with transformStrategy as ignore', async function () {
        const summary = await new Promise((resolve, reject) => {
            dbWriter.documents.queryToTransformAll(query, {
                transform: [transformName, { newValue: 'transformedValue' }],
                transformStrategy: 'ignore',
                onCompletion: ((summary) => {
                    resolve(summary);
                }),
                onError: (error) => {
                    reject(error);
                }
            });
        });

        summary.docsTransformedSuccessfully.should.be.equal(100);
        summary.docsFailedToBeTransformed.should.be.equal(0);
        summary.timeElapsed.should.be.greaterThanOrEqual(0);

        await verifyDocs('initialValue');
    });

    it('should work with query and onCompletion function', async function () {
        const summary = await new Promise((resolve, reject) => {
            dbWriter.documents.queryToTransformAll(query, {
                transform: [transformName, { newValue: 'transformedValue' }],
                onCompletion: ((summary) => {
                    resolve(summary);
                }),
                onError: (error) => {
                    reject(error);
                }
            });
        });

        summary.docsTransformedSuccessfully.should.be.equal(100);
        summary.docsFailedToBeTransformed.should.be.equal(0);
        summary.timeElapsed.should.be.greaterThanOrEqual(0);

        await verifyDocs('transformedValue');
    });

    it('should work with query and onCompletion function and batchSize', async function () {
        const summary = await new Promise((resolve, reject) => {
            dbWriter.documents.queryToTransformAll(query, {
                transform: [transformName, { newValue: 'transformedValue' }],
                batchSize: 10,
                onBatchSuccess: ((progress) => {
                    try {
                        progress.docsFailedToBeTransformed.should.be.equal(0);
                        progress.timeElapsed.should.be.greaterThanOrEqual(0);
                    } catch (err) {
                        reject(err);
                    }
                }),
                onCompletion: ((summary) => {
                    resolve(summary);
                }),
                onError: (error) => {
                    reject(error);
                }
            })
        });

        summary.docsTransformedSuccessfully.should.be.equal(100);
        summary.docsFailedToBeTransformed.should.be.equal(0);
        summary.timeElapsed.should.be.greaterThanOrEqual(0);

        await verifyDocs('transformedValue');
    });

    it('should transformAll documents with onCompletion, concurrentRequests and transform options', async function () {
        const summary = await new Promise((resolve, reject) => {
            dbWriter.documents.queryToTransformAll(query, {
                transform: [transformName, { newValue: 'transformedValue' }],
                concurrentRequests: { multipleOf: 'hosts', multiplier: 4 },
                onCompletion: ((summary) => {
                    resolve(summary);
                }),
                onError: (error) => {
                    reject(error);
                }
            });
        });

        summary.docsTransformedSuccessfully.should.be.equal(100);
        summary.docsFailedToBeTransformed.should.be.equal(0);
        summary.timeElapsed.should.be.greaterThanOrEqual(0);

        await verifyDocs('transformedValue');
    });

    it('should transformAll documents with inputKind as array', async function () {
        transformStream = new Stream.Readable({ objectMode: true });
        for (let i = 0; i + 10 <= uris.length; i = i + 10) {
            transformStream.push(uris.slice(i, i + 10));
        }
        transformStream.push(null);

        const summary = await new Promise((resolve, reject) => {
            dbWriter.documents.queryToTransformAll(query, {
                transform: [transformName, { newValue: 'transformedValue' }],
                inputKind: 'aRRaY',
                onCompletion: ((summary) => {
                    resolve(summary);
                }),
                onError: (error) => {
                    reject(error);
                }
            });
        });

        summary.docsTransformedSuccessfully.should.be.equal(100);
        summary.docsFailedToBeTransformed.should.be.equal(0);
        summary.timeElapsed.should.be.greaterThanOrEqual(0);

        await verifyDocs('transformedValue');
    });

    it('should queryToTransformAll documents with onCompletion option', async function () {
        const summary = await new Promise((resolve, reject) => {
            dbWriter.documents.queryToTransformAll(query, {
                transform: [transformName, { newValue: 'transformedValue' }],
                onCompletion: ((summary) => {
                    resolve(summary);
                }),
                onError: (error) => {
                    reject(error);
                }
            });
        });

        summary.docsTransformedSuccessfully.should.be.equal(100);
        summary.docsFailedToBeTransformed.should.be.equal(0);
        summary.timeElapsed.should.be.greaterThanOrEqual(0);

        await verifyDocs('transformedValue');
    });

    it('should work with batchSize less than 1', async function () {
        const summary = await new Promise((resolve, reject) => {
            dbWriter.documents.queryToTransformAll(query, {
                transform: [transformName, { newValue: 'transformedValue' }],
                batchSize: 0,
                onCompletion: ((summary) => {
                    resolve(summary);
                }),
                onError: (error) => {
                    reject(error);
                }
            });
        });

        summary.docsTransformedSuccessfully.should.be.equal(100);
        summary.docsFailedToBeTransformed.should.be.equal(0);
        summary.timeElapsed.should.be.greaterThanOrEqual(0);

        await verifyDocs('transformedValue');
    });

    it('should throw error with no query', async function () {
        try {
            await dbWriter.documents.queryToTransformAll('invalid query', {});
        } catch (err) {
            err.toString().should.equal('Error: Query needs to be a cts query.');
        }
    });

    it('should throw error with null query', async function () {
        try {
            dbWriter.documents.queryToTransformAll(null, {
                transform: [transformName, { newValue: 'transformedValue' }],
            });
        } catch (err) {
            err.toString().should.equal('Error: Query cannot be null or undefined.');
        }
    });

    it('should throw error with onInitialTimestamp and wrong consistentSnapshot', async function () {
        try {
            await dbWriter.documents.queryToTransformAll(query, {
                transform: [transformName, { newValue: 'transformedValue' }],
                onInitialTimestamp: '1667222674',
                consistentSnapshot: false,
            });
        } catch (err) {
            err.toString().should.equal('Error: consistentSnapshot needs to be true when onInitialTimestamp is provided.');
        }
    });

    it('should throw error with consistentSnapshot another type', async function () {
        try {
            await dbWriter.documents.queryToTransformAll(query, {
                transform: [transformName, { newValue: 'transformedValue' }],
                consistentSnapshot: 'true',
            });
        } catch (err) {
            err.toString().should.equal('Error: consistentSnapshot needs to be a boolean or DatabaseClient.Timestamp object.');
        }
    });

    it('should throw error with batchSize greater than 100000', async function () {
        try {
            await dbWriter.documents.queryToTransformAll(query, {
                transform: [transformName, { newValue: 'transformedValue' }],
                batchSize: 1000000,
            });
        } catch (err) {
            err.toString().should.equal('Error: batchSize cannot be greater than 100000');
        }
    });

});

async function verifyDocs(value) {
    const documents = await dbWriter.documents.read(uris).result();
    should.exist(documents);
    documents.should.be.an.Array();
    documents.length.should.equal(100);
    for (let i = 0; i < documents.length; i++) {
        documents[i].content.key.should.equal(value);
    }
}
