/*
* Copyright © 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
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
let transformName = 'WriteBatcherTest_transformXml';
let transformPath = './test-basic/data/transformAll_transformXml.js';
const ctsQb = marklogic.ctsQueryBuilder;
const q = marklogic.queryBuilder;
const query = q.where(ctsQb.cts.directoryQuery('/test/dataMovement/requests/transformAll/'));

describe('data movement transformAll', function () {

    before(function (done) {
        this.timeout(20000);
        restAdminDB.config.transforms.write(transformName, 'javascript', fs.createReadStream(transformPath))
            .result(() => {
                for (let i = 0; i < 100; i++) {
                    uris.push('/test/dataMovement/requests/transformAll/' + i + '.xml');
                }
            })
            .then(() => done())
            .catch(error => done(error));
    });

    beforeEach(function (done) {
        this.timeout(20000);
        let readable = new Stream.Readable({ objectMode: true });
        transformStream = new Stream.PassThrough({ objectMode: true });
        for (let i = 0; i < 100; i++) {
            const temp = {
                uri: '/test/dataMovement/requests/transformAll/' + i + '.xml',
                contentType: 'application/xml',
                content: '<key>someValue</key>'
            };
            readable.push(temp);
            transformStream.push(temp.uri);
        }
        readable.push(null);
        transformStream.push(null);

        dbWriter.documents.writeAll(readable, {
            onCompletion: ((summary) => {
                done();
            })
        });

    });

    afterEach((function (done) {
        this.timeout(20000);
        dbWriter.documents.remove(uris)
            .result(function (response) {
                done();
            })
            .catch(err => done(err))
            .catch(done);
    }));

    it('should throw error with missing transform name', function (done) {
        this.timeout(20000);
        try {
            dbWriter.documents.transformAll(transformStream, {
                concurrentRequests: { multipleOf: 'hosts', multiplier: 4 }
            });
        } catch (err) {
            err.toString().should.equal('Error: transform name needed while using transformAll api');
            done();
        }
    });

    it('should transformAll documents with onCompletion, concurrentRequests and transform options', done => {
        this.timeout(20000);
        dbWriter.documents.transformAll(transformStream, {
            transform: [transformName, { newValue: 'transformedValue' }],
            concurrentRequests: { multipleOf: 'hosts', multiplier: 4 },
            onCompletion: ((summary) => {
                try {
                    summary.docsTransformedSuccessfully.should.be.equal(100);
                    summary.docsFailedToBeTransformed.should.be.equal(0);
                    summary.timeElapsed.should.be.greaterThanOrEqual(0);
                    verifyDocs('<key>transformedValue</key>', done);
                } catch (err) {
                    done(err);
                }
            }),
            onBatchError: ((progressSoFar, documents, error) => {
                done(error);
            })
        });
    });

    it('should transformAll documents with transform, onBatchSuccess and batchSize options', done => {

        dbWriter.documents.transformAll(transformStream, {
            transform: [transformName, { newValue: 'transformedValue' }],
            onBatchSuccess: (function (progress, documents) {
                progress.docsTransformedSuccessfully.should.be.greaterThanOrEqual(20);
                progress.docsFailedToBeTransformed.should.be.equal(0);
                progress.timeElapsed.should.be.greaterThanOrEqual(0);
                documents.length.should.equal(20);
            }),
            batchSize: 20,
            onCompletion: ((summary) => {
                summary.docsTransformedSuccessfully.should.be.equal(100);
                summary.docsFailedToBeTransformed.should.be.equal(0);
                summary.timeElapsed.should.be.greaterThanOrEqual(0);
                verifyDocs('<key>transformedValue</key>', done);
            })
        });
    });

    it('should transformAll documents with onBatchError returning null', done => {

        dbWriter.documents.transformAll(transformStream, {
            transform: ['invalid', { newValue: 'transformedValue' }],
            onBatchError: ((progress, uris, error) => {
                try {
                    progress.docsTransformedSuccessfully.should.be.equal(0);
                    progress.docsFailedToBeTransformed.should.be.equal(100);
                    progress.timeElapsed.should.be.greaterThanOrEqual(0);
                    uris.length.should.equal(100);
                    return null;
                } catch (err) {
                    done(err);
                }
            }),
            onCompletion: ((summary) => {
                try {
                    summary.docsTransformedSuccessfully.should.be.equal(0);
                    summary.docsFailedToBeTransformed.should.be.equal(100);
                    summary.timeElapsed.should.be.greaterThanOrEqual(0);
                    done();
                } catch (err) {
                    done(err);
                }
            })
        });
    });

    it('should transformAll documents with onBatchError returning replacement batch', done => {
        let onBatchErrorStream = new Stream.PassThrough({ objectMode: true });
        onBatchErrorStream.push('invalid');
        onBatchErrorStream.push(null);
        dbWriter.documents.transformAll(onBatchErrorStream, {
            transform: [transformName, { newValue: 'transformedValue' }],
            onBatchError: ((progress, urisList, error) => {
                urisList[0].should.equal('invalid');
                error.toString().should.equal('Error: Invalid Request');
                return uris;
            }),
            onCompletion: ((summary) => {
                summary.docsTransformedSuccessfully.should.be.equal(100);
                summary.docsFailedToBeTransformed.should.be.equal(0);
                summary.timeElapsed.should.be.greaterThanOrEqual(0);
                verifyDocs('<key>transformedValue</key>', done);
            })
        });
    });

    it('should throw error with invalid batchSize and inputKind as array option', function (done) {
        try {
            dbWriter.documents.transformAll(transformStream, {
                transform: [transformName, { newValue: 'transformedValue' }],
                batchSize: 10,
                inputKind: 'array'
            });
        } catch (err) {
            err.toString().should.equal('Error: batchSize not expected when inputKind is array.');
            done();
        }
    });

    it('should throw error with invalid batchSize less than 0', function (done) {
        try {
            dbWriter.documents.transformAll(transformStream, {
                transform: [transformName, { newValue: 'transformedValue' }],
                batchSize: -10,
            });
        } catch (err) {
            err.toString().should.equal('Error: Invalid batchSize. batchSize cannot be less than or equal to 0.');
            done();
        }
    });

    it('should throw error with invalid batchSize greater than 100000', function (done) {
        try {
            dbWriter.documents.transformAll(transformStream, {
                transform: [transformName, { newValue: 'transformedValue' }],
                batchSize: 110000,
            });
        } catch (err) {
            err.toString().should.equal('Error: Invalid batchSize. batchSize cannot be greater than 100000.');
            done();
        }
    });

    it('should transformAll documents with inputKind as array', done => {

        transformStream = new Stream.Readable({ objectMode: true });
        for (let i = 0; i + 10 <= uris.length; i = i + 10) {
            transformStream.push(uris.slice(i, i + 10));
        }
        transformStream.push(null);

        dbWriter.documents.transformAll(transformStream, {
            transform: [transformName, { newValue: 'transformedValue' }],
            inputKind: 'aRRaY',
            onBatchSuccess: (function (progress, documents) {
                try {
                    documents.length.should.equal(10);
                } catch (error) {
                    done(error);
                }
            }),
            onCompletion: ((summary) => {
                try {
                    summary.docsTransformedSuccessfully.should.be.equal(100);
                    summary.docsFailedToBeTransformed.should.be.equal(0);
                    summary.timeElapsed.should.be.greaterThanOrEqual(0);
                    verifyDocs('<key>transformedValue</key>', done);
                } catch (error) {
                    done(error);
                }
            })
        });
    });

    it('should transformAll documents with transformStrategy as ignore', done => {

        dbWriter.documents.transformAll(transformStream, {
            transform: [transformName, { newValue: 'transformedValue' }],
            concurrentRequests: { multipleOf: 'hosts', multiplier: 4 },
            transformStrategy: 'ignore',
            onCompletion: ((summary) => {
                try {
                    summary.docsTransformedSuccessfully.should.be.equal(100);
                    summary.docsFailedToBeTransformed.should.be.equal(0);
                    summary.timeElapsed.should.be.greaterThanOrEqual(0);
                    verifyDocs('<key>someValue</key>', done);
                } catch (err) {
                    done(err);
                }
            })
        });
    });

    it('should throw error with invalid transformStrategy', done => {
        try {
            dbWriter.documents.transformAll(transformStream, {
                transform: [transformName, { newValue: 'transformedValue' }],
                concurrentRequests: { multipleOf: 'hosts', multiplier: 4 },
                transformStrategy: 'invalid',
            });
        } catch (e) {
            e.toString().should.equal('Error: Invalid value for transformStrategy. Value must be replace or ignore.');
            done();
        }
    });

    it('should throw error with invalid concurrentRequests option', function (done) {
        try {
            dbWriter.documents.transformAll(transformStream, {
                transform: [transformName, { newValue: 'transformedValue' }],
                concurrentRequests: { multipleOf: 'invalid', multiplier: 4 }
            });
        } catch (err) {
            err.toString().should.equal('Error: Invalid value for multipleOf. Value must be forests or hosts.');
            done();
        }
    });

    it('should throw error with invalid concurrentRequests.multiplier option', function (done) {
        try {
            dbWriter.documents.transformAll(transformStream, {
                transform: [transformName, { newValue: 'transformedValue' }],
                concurrentRequests: { multipleOf: 'hosts', multiplier: -2 }
            });
        } catch (err) {
            err.toString().should.equal('Error: concurrentRequests.multiplier cannot be less than one');
            done();
        }
    });

    it('should throw error with invalid inputKind option', function (done) {
        try {
            dbWriter.documents.transformAll(transformStream, {
                transform: [transformName, { newValue: 'transformedValue' }],
                inputKind: 'invalid'
            });
        } catch (err) {
            err.toString().should.equal('Error: Invalid value for inputKind. Value must be array or string.');
            done();
        }
    });

    it('should throw error with invalid onBatchError option', function (done) {
        let onBatchErrorStream = new Stream.PassThrough({ objectMode: true });
        onBatchErrorStream.push('invalid');
        onBatchErrorStream.push(null);
        onBatchErrorStream.on('error', function (err) {
            err.toString().should.equal('Error: onBatchError should return null, empty array or a replacement array.');
            done();
        });
        dbWriter.documents.transformAll(onBatchErrorStream, {
            batchSize: 100,
            transform: [transformName, { newValue: 'transformedValue' }],
            onBatchError: ((progressSoFar, documents, error) => {
                return 10;
            })
        });

    });

    it('should queryToTransformAll documents with onCompletion option', function (done) {
        this.timeout(20000);
        dbWriter.documents.queryToTransformAll(query, {
            transform: [transformName, { newValue: 'transformedValue' }],
            onCompletion: ((summary) => {
                summary.docsTransformedSuccessfully.should.be.equal(100);
                summary.docsFailedToBeTransformed.should.be.equal(0);
                summary.timeElapsed.should.be.greaterThanOrEqual(0);
                verifyDocs('<key>transformedValue</key>', done);
            })
        });
    });

    it('should queryToTransformAll documents with onCompletion, transform, concurrentRequests and transformStrategy as ignore',
        done => {
            this.timeout(20000);
            dbWriter.documents.queryToTransformAll(query, {
                transform: [transformName, { newValue: 'transformedValue' }],
                concurrentRequests: { multipleOf: 'hosts', multiplier: 4 },
                transformStrategy: 'ignore',
                onCompletion: ((summary) => {
                    try {
                        summary.docsTransformedSuccessfully.should.be.equal(100);
                        summary.docsFailedToBeTransformed.should.be.equal(0);
                        summary.timeElapsed.should.be.greaterThanOrEqual(0);
                        verifyDocs('<key>someValue</key>', done);
                    } catch (err) {
                        done(err);
                    }
                })
            });
        });
});

function verifyDocs(value, done) {
    dbWriter.documents.read(uris)
        .result(function (documents) {
            documents.length.should.equal(100);
            for (let i = 0; i < documents.length; i++) {
                const containsValue = documents[0].content.includes(value);
                containsValue.should.equal(true);
            }
        })
        .then(() => done())
        .catch(err => done(err));
}
