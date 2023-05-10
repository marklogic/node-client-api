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
const testconfig = require('../etc/test-config.js');
const marklogic = require('../');
const dbWriter = marklogic.createDatabaseClient(testconfig.restWriterConnection);
const Stream = require('stream');
const ctsQb = marklogic.ctsQueryBuilder;
const q = marklogic.queryBuilder;
const query = q.where(ctsQb.cts.directoryQuery('/test/dataMovement/requests/removeAllUris/'));

let removeStream = new Stream.PassThrough({objectMode: true});
let uris = [];

describe('data movement removeAllUris', function() {
    this.timeout(15000);
    beforeEach(function (done) {
        let readable = new Stream.Readable({objectMode: true});
        removeStream = new Stream.PassThrough({objectMode: true});
        uris = [];
        for(let i=0; i<100; i++) {
            const temp = {
                uri: '/test/dataMovement/requests/removeAllUris/'+i+'.json',
                contentType: 'application/json',
                content: {['key']:'initialValue'}
            };
            readable.push(temp);
            removeStream.push(temp.uri);
            uris.push(temp.uri);
        }
        readable.push(null);
        removeStream.push(null);

        dbWriter.documents.writeAll(readable,{
            onCompletion: ((summary) => {
                done();
            })
        });
    });

    it('should removeAllUris documents with onCompletion, concurrentRequests options', done => {
        dbWriter.documents.removeAllUris(removeStream,{
            concurrentRequests : {multipleOf:'hosts', multiplier:4},
            onCompletion: ((summary) => {
                try {
                    summary.docsRemovedSuccessfully.should.be.equal(100);
                    summary.docsFailedToBeRemoved.should.be.equal(0);
                    summary.timeElapsed.should.be.greaterThanOrEqual(0);
                    verifyDocs(done);
                } catch(err) {
                    done(err);
                }
            })
        });
    });

    it('should removeAllUris documents with onBatchSuccess and batchSize options', done => {

        dbWriter.documents.removeAllUris(removeStream, {
            onBatchSuccess: (function(progress, documents) {
                progress.docsRemovedSuccessfully.should.be.greaterThanOrEqual(10);
                progress.docsFailedToBeRemoved.should.be.equal(0);
                progress.timeElapsed.should.be.greaterThanOrEqual(0);
                documents.length.should.equal(10);
            }),
            batchSize:10,
            onCompletion: ((summary) => {
                summary.docsRemovedSuccessfully.should.be.equal(100);
                summary.docsFailedToBeRemoved.should.be.equal(0);
                summary.timeElapsed.should.be.greaterThanOrEqual(0);
                verifyDocs(done);
            })
        });
    });

    it('should throw error with invalid batchSize and inputKind as array option', function(done){
        try{
            dbWriter.documents.removeAllUris(removeStream,{
                batchSize:10,
                inputKind:'array'
            });
        } catch(err){
            err.toString().should.equal('Error: batchSize not expected when inputKind is array.');
            dbWriter.documents.remove(uris)
                .result(function(response) {done();})
                .catch(error => done(error));
        }
    });

    it('should removeAllUris documents with inputKind as array', done => {

        removeStream = new Stream.Readable({objectMode: true});
        for(let i=0; i+10<=uris.length; i=i+10){
            removeStream.push(uris.slice(i,i+10));
        }
        removeStream.push(null);

        dbWriter.documents.removeAllUris(removeStream,{
            inputKind:'aRRaY',
            onBatchSuccess: (function(progress, documents) {
                try{
                    documents.length.should.equal(10);
                } catch(error){
                    done(error);
                }
            }),
            onCompletion: ((summary) => {
                try{
                    summary.docsRemovedSuccessfully.should.be.equal(100);
                    summary.docsFailedToBeRemoved.should.be.equal(0);
                    summary.timeElapsed.should.be.greaterThanOrEqual(0);
                    verifyDocs(done);
                } catch(error){
                    done(error);
                }
            })
        });
    });

    it('should throw error with invalid concurrentRequests option', function(done){
        try{
            dbWriter.documents.removeAllUris(removeStream,{
                concurrentRequests: {multipleOf: 'invalid', multiplier: 4}
            });
        } catch(err){
            err.toString().should.equal('Error: Invalid value for multipleOf. Value must be forests or hosts.');
            dbWriter.documents.remove(uris)
                .result(function(response) {done();})
                .catch(error => done(error));
        }
    });

    it('should queryToRemoveAll documents with onCompletion option', function(done){

        dbWriter.documents.queryToRemoveAll(query,{
            onCompletion:((summary) => {
                summary.docsRemovedSuccessfully.should.be.equal(100);
                summary.docsFailedToBeRemoved.should.be.equal(0);
                summary.timeElapsed.should.be.greaterThanOrEqual(0);
                verifyDocs(done);
            })
        });
    });

    it('should queryToRemoveAll documents with onCompletion, concurrentRequestsas',
        done => {

            dbWriter.documents.queryToRemoveAll(query, {
                concurrentRequests : {multipleOf:'hosts', multiplier:4},
                onCompletion: ((summary) => {
                    try {
                        summary.docsRemovedSuccessfully.should.be.equal(100);
                        summary.docsFailedToBeRemoved.should.be.equal(0);
                        summary.timeElapsed.should.be.greaterThanOrEqual(0);
                        verifyDocs(done);
                    } catch(err) {
                        done(err);
                    }
                })
            });
        });

});

function verifyDocs(done){
    dbWriter.documents.read(uris)
        .result(function (documents) {
            documents.length.should.equal(0);
        })
        .then(()=> done())
        .catch(err=> done(err));
}
