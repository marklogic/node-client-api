/*
 * Copyright (c) 2022 MarkLogic Corporation
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

const should = require('should');
const testconfig = require('../etc/test-config-qa.js');
const marklogic = require('../');
const dbWriter = marklogic.createDatabaseClient(testconfig.dmsdkrestWriterConnection);
const restAdminDB = marklogic.createDatabaseClient(testconfig.dmsdkrestAdminConnection);
const Stream = require('stream');
const fs = require('fs');

let transformStream = new Stream.PassThrough({objectMode: true});
let uris = [];
let transformName = 'WriteBatcherTest_transform';
let transformPath = './test-basic/data/transformAll_transform.js';
const ctsQb = marklogic.ctsQueryBuilder;
const q = marklogic.queryBuilder;
const query = q.where(ctsQb.cts.directoryQuery('/test/dataMovement/requests/transformAll/'));

describe('data movement transformAll', function () {
    this.timeout(20000);
    before(function (done) {

        restAdminDB.config.transforms.write(transformName, 'javascript', fs.createReadStream(transformPath))
            .result(() => {
                for (let i = 0; i < 100; i++) {
                    uris.push('/test/dataMovement/requests/transformAll/' + i + '.json');
                }
            })
            .then(() => done())
            .catch(error => done(error));
    });

    beforeEach(function (done) {
        let readable = new Stream.Readable({objectMode: true});
        transformStream = new Stream.PassThrough({objectMode: true});
        for (let i = 0; i < 100; i++) {
            const temp = {
                uri: '/test/dataMovement/requests/transformAll/' + i + '.json',
                contentType: 'application/json',
                content: {['key']: 'initialValue'}
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
        dbWriter.documents.remove(uris)
            .result(function (response) {
                done();
            })
            .catch(err => done(err))
            .catch(done);
    }));

    it('should queryToTransformAll documents with onCompletion, transform, concurrentRequests and transformStrategy as ignore',
        function (done) {

            dbWriter.documents.queryToTransformAll(query, {
                transform: [transformName, {newValue: 'transformedValue'}],
                concurrentRequests: {multipleOf: 'hosts', multiplier: 4},
                transformStrategy: 'ignore',
                onCompletion: ((summary) => {
                    try {
                        summary.docsTransformedSuccessfully.should.be.equal(100);
                        summary.docsFailedToBeTransformed.should.be.equal(0);
                        summary.timeElapsed.should.be.greaterThanOrEqual(0);
                        verifyDocs('initialValue', done);
                    } catch (err) {
                        done(err);
                    }
                })
            });
        });

    it('should transformAll documents with transformStrategy as ignore', function (done) {

        dbWriter.documents.queryToTransformAll(query, {
            transform: [transformName, {newValue: 'transformedValue'}],
            concurrentRequests: {multipleOf: 'hosts', multiplier: 4},
            transformStrategy: 'ignore',
            onCompletion: ((summary) => {
                try {
                    summary.docsTransformedSuccessfully.should.be.equal(100);
                    summary.docsFailedToBeTransformed.should.be.equal(0);
                    summary.timeElapsed.should.be.greaterThanOrEqual(0);
                    verifyDocs('initialValue', done);
                } catch (err) {
                    done(err);
                }
            })
        });
    });

    it('should work with query and onCompletion function', function (done) {
        dbWriter.documents.queryToTransformAll(query, {
            transform: [transformName, {newValue: 'transformedValue'}],
            onCompletion: ((summary) => {
                try {
                    summary.docsTransformedSuccessfully.should.be.equal(100);
                    summary.docsFailedToBeTransformed.should.be.equal(0);
                    summary.timeElapsed.should.be.greaterThanOrEqual(0);
                    verifyDocs('transformedValue', done);
                } catch (err) {
                    done(err);
                }
            })
        });
    });

    it('should work with query and onCompletion function and batchSize', function (done) {
        dbWriter.documents.queryToTransformAll(query, {
            transform: [transformName, {newValue: 'transformedValue'}],
            batchSize: 10,
            onBatchSuccess: (function (progress, documents) {
                try {
                    progress.docsTransformedSuccessfully.should.be.greaterThanOrEqual(10);
                    progress.docsFailedToBeTransformed.should.be.equal(0);
                    progress.timeElapsed.should.be.greaterThanOrEqual(0);
                } catch (err) {
                    done(err);
                }

            }),
            onCompletion: ((summary) => {
                try {
                    summary.docsTransformedSuccessfully.should.be.equal(100);
                    summary.docsFailedToBeTransformed.should.be.equal(0);
                    summary.timeElapsed.should.be.greaterThanOrEqual(0);
                    verifyDocs('transformedValue', done);
                } catch (err) {
                    done(err);
                }
            })
        });
    });

    it('should transformAll documents with onCompletion, concurrentRequests and transform options', function (done) {

        dbWriter.documents.queryToTransformAll(query, {
            transform: [transformName, {newValue: 'transformedValue'}],
            concurrentRequests: {multipleOf: 'hosts', multiplier: 4},
            onCompletion: ((summary) => {
                try {
                    summary.docsTransformedSuccessfully.should.be.equal(100);
                    summary.docsFailedToBeTransformed.should.be.equal(0);
                    summary.timeElapsed.should.be.greaterThanOrEqual(0);
                    verifyDocs('transformedValue', done);
                } catch (err) {
                    done(err);
                }
            })
        });
    });

    it('should transformAll documents with inputKind as array', function (done) {

        transformStream = new Stream.Readable({objectMode: true});
        for (let i = 0; i + 10 <= uris.length; i = i + 10) {
            transformStream.push(uris.slice(i, i + 10));
        }
        transformStream.push(null);

        dbWriter.documents.queryToTransformAll(query, {
            transform: [transformName, {newValue: 'transformedValue'}],
            inputKind: 'aRRaY',
            onCompletion: ((summary) => {
                try {
                    summary.docsTransformedSuccessfully.should.be.equal(100);
                    summary.docsFailedToBeTransformed.should.be.equal(0);
                    summary.timeElapsed.should.be.greaterThanOrEqual(0);
                    verifyDocs('transformedValue', done);
                } catch (error) {
                    done(error);
                }
            })
        });
    });

    it('should queryToTransformAll documents with onCompletion option', function (done) {

        dbWriter.documents.queryToTransformAll(query, {
            transform: [transformName, {newValue: 'transformedValue'}],
            onCompletion: ((summary) => {
                summary.docsTransformedSuccessfully.should.be.equal(100);
                summary.docsFailedToBeTransformed.should.be.equal(0);
                summary.timeElapsed.should.be.greaterThanOrEqual(0);
                verifyDocs('transformedValue', done);
            })
        });
    });

    it('should work with batchSize less than 1', function (done) {
        dbWriter.documents.queryToTransformAll(query, {
            transform: [transformName, {newValue: 'transformedValue'}],
            batchSize: 0,
            onCompletion: ((summary) => {
                try {
                    summary.docsTransformedSuccessfully.should.be.equal(100);
                    summary.docsFailedToBeTransformed.should.be.equal(0);
                    summary.timeElapsed.should.be.greaterThanOrEqual(0);
                    verifyDocs('transformedValue', done);
                } catch (err) {
                    done(err);
                }
            })
        });
    })

    it('should throw error with no query', function (done) {
        try {
            dbWriter.documents.queryToTransformAll('invalid query', {})
        } catch (err) {
            err.toString().should.equal('Error: Query needs to be a cts query.');
            done();
        }
    });

    it('should throw error with null query', function (done) {
        try {
            dbWriter.documents.queryToTransformAll(null, {
                transform: [transformName, {newValue: 'transformedValue'}],
            })
        } catch (err) {
            err.toString().should.equal('Error: Query cannot be null or undefined.');
            done();
        }
    });

    it('should throw error with onInitialTimestamp and wrong consistentSnapshot', function (done) {
        try {
            dbWriter.documents.queryToTransformAll(query, {
                transform: [transformName, {newValue: 'transformedValue'}],
                onInitialTimestamp: '1667222674',
                consistentSnapshot: false,
            });
        } catch (err) {
            err.toString().should.equal('Error: consistentSnapshot needs to be true when onInitialTimestamp is provided.');
            done();
        }
    });

    it('should throw error with consistentSnapshot another type', function (done) {
        try {
            dbWriter.documents.queryToTransformAll(query, {
                transform: [transformName, {newValue: 'transformedValue'}],
                consistentSnapshot: 'true',
            });
        } catch (err) {
            err.toString().should.equal('Error: consistentSnapshot needs to be a boolean or DatabaseClient.Timestamp object.');
            done();
        }
    });

    it('should throw error with batchSize greater than 100000', function (done) {
        try {
            dbWriter.documents.queryToTransformAll(query, {
                transform: [transformName, {newValue: 'transformedValue'}],
                batchSize: 1000000,
            });
        } catch (err) {
            err.toString().should.equal('Error: batchSize cannot be greater than 100000');
            done();
        }
    });

});

function verifyDocs(value, done) {
    dbWriter.documents.read(uris)
        .result(function (documents) {
            documents.length.should.equal(100);
            for (let i = 0; i < documents.length; i++) {
                documents[0].content.key.should.equal(value);
            }
        })
        .then(() => done())
        .catch(err => done(err));
}