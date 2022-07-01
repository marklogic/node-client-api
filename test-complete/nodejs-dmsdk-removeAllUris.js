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

// deleteEmptyIterator
//

const should = require('should');
const testconfig = require('../etc/test-config.js');
const marklogic = require('../');
const dbWriter = marklogic.createDatabaseClient(testconfig.restWriterConnection);
const Stream = require('stream');
const ctsQb = marklogic.ctsQueryBuilder;
const q = marklogic.queryBuilder;
const query = q.where(ctsQb.cts.directoryQuery('/test/dataMovement/requests/removeAllUris/'));

let removeStream = new Stream.PassThrough({objectMode: true});
let uris = [];

describe('Functional tests - data movement removeAllUris', function() {
    this.timeout(15000);
    beforeEach(function (done) {
        let readable = new Stream.Readable({objectMode: true});
        removeStream = new Stream.PassThrough({objectMode: true});
        uris = [];
        for (let i = 0; i < 100; i++) {
            const temp = {
                uri: '/test/dataMovement/requests/removeAllUris/' + i + '.json',
                contentType: 'application/json',
                content: {['key']: 'initialValue'}
            };
            readable.push(temp);
            removeStream.push(temp.uri);
            uris.push(temp.uri);
        }
        readable.push(null);
        removeStream.push(null);

        readable.pipe(dbWriter.documents.writeAll({
            onCompletion: ((summary) => {
                done();
            })
        }));

    });

    it('delete Non Existent docs', function(done){

        removeStream = new Stream.PassThrough({objectMode: true});
        removeStream.push('nonExistent.json');
        removeStream.push('nonExistent2.json');
        removeStream.push(null);
        removeStream.pipe(dbWriter.documents.removeAllUris({
            concurrentRequests : {multipleOf:'hosts', multiplier:4},
            onCompletion: ((summary) => {
                summary.docsRemovedSuccessfully.should.be.equal(2);
                summary.docsFailedToBeRemoved.should.be.equal(0);
                summary.timeElapsed.should.be.greaterThanOrEqual(0);
                done();
            })
        }));
    });

    it('should not removeAllUris with onBatchError returning null', function(done){

        const testUser = marklogic.createDatabaseClient(testconfig.restReaderConnection);
        removeStream.pipe(testUser.documents.removeAllUris({

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
                    .result(function(response){
                        done();
                    })
                    .catch(done)
                    .catch(err=> done(err));
            })
        }));
    });

    it('should throw error with invalid batchSize', function(done){
        try{
            removeStream.pipe(dbWriter.documents.removeAllUris({
                batchSize:-1
            }));
        } catch(err){
            err.toString().should.equal('Error: Invalid batchSize. batchSize cannot be less than or equal to 0.');
            done();
        }
    });

    it('should not removeAllUris with onBatchError returning error', function(done){

        const testUser = marklogic.createDatabaseClient(testconfig.restReaderConnection);

        const remove = testUser.documents.removeAllUris({

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
                    .result(function(response){
                        done();
                    })
                    .catch(err=> done(err));
            })
        });
        remove.on('error', (err) => {
            err.message.should.be.equal('Stop Processing');
        });
        removeStream.pipe(remove);
    });

    it('should throw error with invalid onBatchError option', function(done){

        const testUser = marklogic.createDatabaseClient(testconfig.restReaderConnection);
        const remove = (testUser.documents.removeAllUris({

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
                .result(function(response){
                    done();
                })
                .catch(err=> done(err));
        });
        removeStream.pipe(remove);
    });

    it('should queryToRemoveAll documents with onBatchError returning empty array',
        done => {
            const testUser = marklogic.createDatabaseClient(testconfig.restReaderConnection);
            testUser.documents.queryToRemoveAll(query,{

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
                        .result(function(response){
                            done();
                        })
                        .catch(done)
                        .catch(err=> done(err));
                })
            });
        });
});
