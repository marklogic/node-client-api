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
const restAdminDB = marklogic.createDatabaseClient(testconfig.restAdminConnection);
const Stream = require('stream');
const fs = require('fs');

let readable = new Stream.Readable({objectMode: true});
let transformStream = new Stream.PassThrough({objectMode: true});
let uris = [];
let transformName = 'WriteBatcherTest_transform';
let transformPath = './test-basic/data/transformAll_transform.js';

describe('data movement transformAll', function() {

    before(function(done) {

        restAdminDB.config.transforms.write(transformName, 'javascript', fs.createReadStream(transformPath))
            .result(()=>{
                for(let i=0; i<100; i++){
                    uris.push('/test/dataMovement/requests/transformAll/'+i+'.json');
                }
            })
            .then(()=> done());
    });

    beforeEach(function (done) {
        readable = new Stream.Readable({objectMode: true});
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

        readable.pipe(dbWriter.documents.writeAll({
            onCompletion: ((summary) => {
                done();
            })
        }));

    });

    afterEach((function (done) {
        dbWriter.documents.remove(uris)
            .result(function (response) {
                done();
            })
            .catch(err => done(err))
            .catch(done);
    }));

    it('should transformAll documents with onCompletion, concurrentRequests and transform options', done => {

        transformStream.pipe(dbWriter.documents.transformAll({
            transform: [transformName, {newValue:'transformedValue'}],
            concurrentRequests : {multipleOf:'hosts', multiplier:4},
            onCompletion: ((summary) => {
                try {
                    summary.docsTransformedSuccessfully.should.be.equal(100);
                    summary.docsFailedToBeTransformed.should.be.equal(0);
                    summary.timeElapsed.should.be.greaterThanOrEqual(0);
                    verifyDocs('transformedValue', done);
                } catch(err) {
                    done(err);
                }
            })
        }));
    });

    it('should transformAll documents with transform, onBatchSuccess and batchSize options', done => {

        transformStream.pipe(dbWriter.documents.transformAll({
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
        }));
    });

    it('should transformAll documents with onBatchError returning null', done => {

        transformStream.pipe(dbWriter.documents.transformAll({
            transform: ['invalid', {newValue:'transformedValue'}],
            onBatchError: ((progress, uris, error)=>{
                try {
                    progress.docsTransformedSuccessfully.should.be.equal(0);
                    progress.docsFailedToBeTransformed.should.be.equal(100);
                    progress.timeElapsed.should.be.greaterThanOrEqual(0);
                    uris.length.should.equal(100);
                    return null;
                } catch(err){
                    done(err);
                }
            }),
            onCompletion: ((summary) => {
                try {
                    summary.docsTransformedSuccessfully.should.be.equal(0);
                    summary.docsFailedToBeTransformed.should.be.equal(100);
                    summary.timeElapsed.should.be.greaterThanOrEqual(0);
                    done();
                } catch(err){
                    done(err);
                }
            })
        }));
    });

    it('should transformAll documents with onBatchError returning replacement batch', done => {
        let onBatchErrorStream = new Stream.PassThrough({objectMode: true});
        onBatchErrorStream.push('invalid');
        onBatchErrorStream.push(null);
        onBatchErrorStream.pipe(dbWriter.documents.transformAll({
            transform: [transformName, {newValue:'transformedValue'}],
            onBatchError: ((progress, urisList, error)=>{
                urisList[0].should.equal('invalid');
                error.toString().should.equal('Error: Invalid Request');
                onBatchErrorStream = new Stream.PassThrough({objectMode: true});
                onBatchErrorStream.push(null);
                return uris;
            }),
            onCompletion: ((summary) => {
                summary.docsTransformedSuccessfully.should.be.equal(100);
                summary.docsFailedToBeTransformed.should.be.equal(0);
                summary.timeElapsed.should.be.greaterThanOrEqual(0);
                verifyDocs('transformedValue', done);
            })
        }));
    });

    it('should throw error with invalid batchSize and inputKind as array option', function(done){
        try{
            transformStream.pipe(dbWriter.documents.transformAll({
                transform: [transformName, {newValue:'transformedValue'}],
                batchSize:10,
                inputKind:'array'
            }));
        } catch(err){
            err.toString().should.equal('Error: batchSize not expected when inputKind is array.');
            done();
        }
    });

    it('should transformAll documents with inputKind as array', done => {

        transformStream = new Stream.Readable({objectMode: true});
        for(let i=0; i+10<=uris.length; i=i+10){
            transformStream.push(uris.slice(i,i+10));
        }
        transformStream.push(null);

        transformStream.pipe(dbWriter.documents.transformAll({
            transform: [transformName, {newValue:'transformedValue'}],
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
                    summary.docsTransformedSuccessfully.should.be.equal(100);
                    summary.docsFailedToBeTransformed.should.be.equal(0);
                    summary.timeElapsed.should.be.greaterThanOrEqual(0);
                    verifyDocs('transformedValue', done);
                } catch(error){
                    done(error);
                }
            })
        }));
    });

    it('should transformAll documents with transformStrategy as ignore', done => {

        transformStream.pipe(dbWriter.documents.transformAll({
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
        }));
    });

    it('should throw error with invalid concurrentRequests option', function(done){
        try{
            transformStream.pipe(dbWriter.documents.transformAll({
                transform: [transformName, {newValue:'transformedValue'}],
                concurrentRequests: {multipleOf: 'invalid', multiplier: 4}
            }));
        } catch(err){
            err.toString().should.equal('Error: Invalid value for multipleOf. Value must be forests or hosts.');
            done();
        }
    });

    it('should throw error with invalid onBatchError option', function(done){
        let onBatchErrorStream = new Stream.PassThrough({objectMode: true});
        onBatchErrorStream.push('invalid');
        onBatchErrorStream.push(null);
        onBatchErrorStream.pipe(dbWriter.documents.transformAll({
                batchSize:100,
                transform: [transformName, {newValue:'transformedValue'}],
                onBatchError: ((progressSoFar, documents, error) => {
                    return 10;
                })
            })).on('error', function(err){
                err.toString().should.equal('Error: onBatchError should return null, empty array or a replacement array.');
                done();
            });
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
