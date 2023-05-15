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

describe('data movement transformAll', function() {
    this.timeout(20000);
    before(function(done) {

        restAdminDB.config.transforms.write(transformName, 'javascript', fs.createReadStream(transformPath))
            .result(()=>{
                for(let i=0; i<100; i++){
                    uris.push('/test/dataMovement/requests/transformAll/'+i+'.json');
                }
            })
            .then(()=> done())
            .catch(error => done(error));
    });

    beforeEach(function (done) {
        let readable = new Stream.Readable({objectMode: true});
        transformStream = new Stream.PassThrough({objectMode: true});
        for(let i=0; i<100; i++) {
            const temp = {
                uri: '/test/dataMovement/requests/transformAll/'+i+'.json',
                contentType: 'application/json',
                content: {['key']:'initialValue'}
            };
            readable.push(temp);
            transformStream.push(temp.uri);
        }
        readable.push(null);
        transformStream.push(null);

        dbWriter.documents.writeAll(readable,{
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

    it('should transformAll documents with transform, onBatchSuccess and batchSize options', done => {

        dbWriter.documents.transformAll(transformStream,{
            transform: [transformName, {newValue:'transformedValue'}],
            onBatchSuccess: (function(progress, documents) {
                progress.docsTransformedSuccessfully.should.be.greaterThanOrEqual(20);
                progress.docsFailedToBeTransformed.should.be.equal(0);
                progress.timeElapsed.should.be.greaterThanOrEqual(0);
                documents.length.should.equal(20);
            }),
            batchSize:20,
            onCompletion: ((summary) => {
                summary.docsTransformedSuccessfully.should.be.equal(100);
                summary.docsFailedToBeTransformed.should.be.equal(0);
                summary.timeElapsed.should.be.greaterThanOrEqual(0);
                verifyDocs('transformedValue', done);
            })
        });
    });

    it('should throw error with missing transform name', function(done){
        try{
            dbWriter.documents.transformAll(transformStream,{
                concurrentRequests: {multipleOf: 'hosts', multiplier: 4}
            });
        } catch(err){
            err.toString().should.equal('Error: transform name needed while using transformAll api');
            done();
        }
    });

    it('should throw error with invalid batchSize less than 0', function(done){
        try{
            dbWriter.documents.transformAll(transformStream,{
                transform: [transformName, {newValue:'transformedValue'}],
                batchSize:-10,
            });
        } catch(err){
            err.toString().should.equal('Error: Invalid batchSize. batchSize cannot be less than or equal to 0.');
            done();
        }
    });

    it('should throw error with invalid batchSize greater than 100000', function(done){
        try{
            dbWriter.documents.transformAll(transformStream,{
                transform: [transformName, {newValue:'transformedValue'}],
                batchSize: 110000,
            });
        } catch(err){
            err.toString().should.equal('Error: Invalid batchSize. batchSize cannot be greater than 100000.');
            done();
        }
    });

    it('should transformAll documents with transformStrategy as ignore', done => {

        dbWriter.documents.transformAll(transformStream,{
            transform: [transformName, {newValue:'transformedValue'}],
            concurrentRequests : {multipleOf:'hosts', multiplier:4},
            transformStrategy: 'ignore',
            onCompletion: ((summary) => {
                try {
                    summary.docsTransformedSuccessfully.should.be.equal(100);
                    summary.docsFailedToBeTransformed.should.be.equal(0);
                    summary.timeElapsed.should.be.greaterThanOrEqual(0);
                    verifyDocs('initialValue', done);
                } catch(err) {
                    done(err);
                }
            })
        });
    });

    it('should throw error with invalid transformStrategy', done => {
        try {
            dbWriter.documents.transformAll(transformStream,{
                transform: [transformName, {newValue:'transformedValue'}],
                concurrentRequests : {multipleOf:'hosts', multiplier:4},
                transformStrategy: 'invalid',
            });
        } catch (e) {
            e.toString().should.equal('Error: Invalid value for transformStrategy. Value must be replace or ignore.');
            done();
        }
    });

    it('should throw error with invalid concurrentRequests option', function(done){
        try{
            dbWriter.documents.transformAll(transformStream,{
                transform: [transformName, {newValue:'transformedValue'}],
                concurrentRequests: {multipleOf: 'invalid', multiplier: 4}
            });
        } catch(err){
            err.toString().should.equal('Error: Invalid value for multipleOf. Value must be forests or hosts.');
            done();
        }
    });

    it('should throw error with invalid concurrentRequests.multiplier option', function(done){
        try{
            dbWriter.documents.transformAll(transformStream,{
                transform: [transformName, {newValue:'transformedValue'}],
                concurrentRequests: {multipleOf: 'hosts', multiplier: -2}
            });
        } catch(err){
            err.toString().should.equal('Error: concurrentRequests.multiplier cannot be less than one');
            done();
        }
    });

    it('should throw error with invalid inputKind option', function(done){
        try{
            dbWriter.documents.transformAll(transformStream,{
                transform: [transformName, {newValue:'transformedValue'}],
                inputKind: 'invalid'
            });
        } catch(err){
            err.toString().should.equal('Error: Invalid value for inputKind. Value must be array or string.');
            done();
        }
    });
});
function verifyDocs(value, done){
    dbWriter.documents.read(uris)
        .result(function (documents) {
            documents.length.should.equal(100);
            for(let i=0; i<documents.length; i++){
                documents[0].content.key.should.equal(value);
            }
        })
        .then(()=> done())
        .catch(err=> done(err));
}