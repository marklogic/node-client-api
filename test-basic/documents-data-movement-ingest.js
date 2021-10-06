/*
 * Copyright (c) 2021 MarkLogic Corporation
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
'use strict';
const testconfig = require('../etc/test-config.js');
const marklogic = require('../');
const dbWriter = marklogic.createDatabaseClient(testconfig.restWriterConnection);
const restAdminDB = marklogic.createDatabaseClient(testconfig.restAdminConnection);

const Stream = require('stream');
let readable = new Stream.Readable({objectMode: true});
let uris = [];
let should = require('should');
let fs = require('fs');

describe('data-movement-requests test', function(){

    beforeEach(function (done) {
        readable = new Stream.Readable({objectMode: true});
        uris = [];
        for(let i=0; i<1000; i++) {
            const temp = {
                uri: '/test/dataMovement/requests/'+i+'.json',
                contentType: 'application/json',
                content: {['key '+i]:'value '+i}
            };
            readable.push(temp);
            uris.push(temp.uri);
        }
        readable.push(null);
        setTimeout(()=>{done();}, 3000);
    });

    afterEach((function(done){
        dbWriter.documents.remove(uris)
            .result(function(response){
                done();
            })
            .catch(err=> done(err))
            .catch(done);
    }));

    it('should writeAll  documents with empty options',  done => {
        readable.pipe(dbWriter.documents.writeAll());

        setTimeout(()=>{
                readDocs(1000, done);
            },
            4000);
    });

    it('should writeAll  documents with onCompletion option',  function (done){

        readable.pipe(dbWriter.documents.writeAll({

            onCompletion: ((summary) => {
                    summary.docsWrittenSuccessfully.should.be.equal(1000);
                    summary.docsFailedToBeWritten.should.be.equal(0);
                    summary.timeElapsed.should.be.greaterThanOrEqual(0);
                    readDocs(1000, done);
            })
        }));
    });

    it('should writeAll documents with onBatchSuccess', function(done){

        readable.pipe(dbWriter.documents.writeAll({

            onBatchSuccess: ((progressSoFar, documents) => {
                try {
                    progressSoFar.docsWrittenSuccessfully.should.be.greaterThanOrEqual(100);
                    progressSoFar.docsFailedToBeWritten.should.be.equal(0);
                    progressSoFar.timeElapsed.should.be.greaterThanOrEqual(0);
                    documents.length.should.equal(100);
                } catch(err){
                    done(err);
                }
            }),
            onCompletion: ((summary) => {
                readDocs(1000, done);
            })
        }));
    });

    it('should writeAll documents with batchSize', function(done){
        let count = 0;
        readable.pipe(dbWriter.documents.writeAll({
            batchSize:500,
            onBatchSuccess: ((progressSoFar, documents) => {
                count++;
            }),
            onCompletion: ((summary) => {
                count.should.equal(2);
                readDocs(1000, done);
            })
        }));
    });

    it('should writeAll documents with concurrentRequests', function(done){
        readable.pipe(dbWriter.documents.writeAll({
            concurrentRequests : {multipleOf:'hosts', multiplier:4},
            onCompletion: ((summary) => {
                readDocs(1000, done);
            })
        }));
    });

    it('should throw error with invalid concurrentRequests:multipleOf', function(done){
        try {
            readable.pipe(dbWriter.documents.writeAll({
                concurrentRequests: {multipleOf: 'invalid', multiplier: 4}
            }));
        } catch(err){
            err.toString().should.equal('Error: Invalid value for onCompletion.multipleOf. Value must be forests or hosts.');
            done();
        }
    });

    it('should throw error with invalid concurrentRequests:multiplier', function(done){
        try {
            readable.pipe(dbWriter.documents.writeAll({
                concurrentRequests: {multipleOf: 'hosts', multiplier: -4}
            }));
        } catch(err){
            err.toString().should.equal('Error: concurrentRequests.multiplier cannot be less than zero');
            done();
        }
    });

    it('should call onBatchError with invalid content', function(done){

        readable = new Stream.Readable({objectMode: true});
        const temp = {
            uri: '/test/dataMovement/requests/1.json',
            contentType: 'application/json',
            content: 'invalid'
        };
        readable.push(temp);
        readable.push(null);
        readable.pipe(dbWriter.documents.writeAll({

            onBatchError: ((progressSoFar, documents, error) => {
                progressSoFar.docsWrittenSuccessfully.should.be.greaterThanOrEqual(0);
                progressSoFar.docsFailedToBeWritten.should.be.greaterThanOrEqual(1);
                progressSoFar.timeElapsed.should.be.greaterThanOrEqual(0);

                documents[0].uri.should.equal(temp.uri);
                error.toString().length.should.greaterThan(0);
                return null;

            }),
            onCompletion: ((summary) => {
                readDocs(0, done);
            })
        }));
    });

    it('should writeAll with onBatchError sending a retry array', function(done){

        readable = new Stream.Readable({objectMode: true});
        const temp = {
            uri: '/test/dataMovement/requests/1.json',
            contentType: 'application/json',
            content: 'invalid'
        };
        readable.push(temp);
        readable.push(null);
        readable.pipe(dbWriter.documents.writeAll({

            onBatchError: ((progressSoFar, documents, error) => {
                progressSoFar.docsWrittenSuccessfully.should.be.greaterThanOrEqual(0);
                progressSoFar.docsFailedToBeWritten.should.be.greaterThanOrEqual(1);
                progressSoFar.timeElapsed.should.be.greaterThanOrEqual(0);

                documents[0].uri.should.equal(temp.uri);
                error.toString().length.should.greaterThan(0);
                documents[0].content = {'key 2':'value 2'};
                return documents;
            }),
            onCompletion: ((progressSoFar, documents) => {
                readDocs(1, done);
            })
        }));
    });

    it('should stop processing when onBatchError throws an error', function(done){

        readable = new Stream.Readable({objectMode: true});

        const temp = {
            uri: '/test/dataMovement/requests/1.json',
            contentType: 'application/json',
            content: 'invalid'
        };
        readable.push(temp);
        readable.push(null);
        const writable = dbWriter.documents.writeAll({

            onBatchError: ((progressSoFar, documents, error) => {
                progressSoFar.docsWrittenSuccessfully.should.be.greaterThanOrEqual(0);
                progressSoFar.docsFailedToBeWritten.should.be.greaterThanOrEqual(1);
                progressSoFar.timeElapsed.should.be.greaterThanOrEqual(0);

                documents[0].uri.should.equal(temp.uri);
                error.toString().length.should.greaterThan(0);
                throw new Error('Processing stopped');
            }),
            onCompletion: ((summary) => {
                readDocs(0, done);
            })
        });
        writable.on('error', (err) => {
            err.message.should.be.equal('Processing stopped');
        });
        readable.pipe(writable);
    });

    it('should writeAll documents with defaultMetadata', function(done){

        let defaultMetadataUris = [];
        readable = new Stream.Readable({objectMode: true});
        for(let i=0; i<400; i++) {
            const temp = {
                uri: '/test/dataMovement/requests/'+i+'.json',
                contentType: 'application/json',
                content: {['key '+i]:'value '+i}
            };
            readable.push(temp);
            defaultMetadataUris.push(temp.uri);
        }
        readable.push(null);

        readable.pipe(dbWriter.documents.writeAll({
            defaultMetadata: {
                metadataValues: {
                    'metadataKey1': 'metadataValue 1',
                    'metadataKey2': 'metadataValue 2'
                },
                collections: ['collection1'],
                permissions: [
                    {'role-name': 'app-user', capabilities: ['read']},
                    {'role-name': 'app-builder', capabilities: ['read', 'update']}
                ],
                quality: 1
            },
            onCompletion: ((summary) => {
                readDocsWithMetadata(defaultMetadataUris, done);
            })
        }));
    });

    it('should writeAll documents with transform', function(done){
        let xqyTransformName = 'flagParam';
        let xqyTransformPath = './test-basic/data/flagTransform.xqy';
        restAdminDB.config.transforms.write(xqyTransformName, 'xquery', fs.createReadStream(xqyTransformPath))
            .result(function(response){
                readable.pipe(dbWriter.documents.writeAll({
                    transform: [xqyTransformName, {flag:'tested1'}],
                    onCompletion: ((summary) => {
                        readDocsWithTransform(done);
                    })
                }));
            })
            .catch(err=> done(err));
    });
});

function readDocs(val,done){
    dbWriter.documents.read(uris)
        .result(function (documents) {
            documents.length.should.equal(val);
            done();
        })
        .catch(done)
        .catch(err=> done(err));
}

function readDocsWithMetadata(defaultMetadataUris,done){
    dbWriter.documents.read({uris:defaultMetadataUris, categories:['metadata']})
        .result(function (documents) {
            documents.length.should.equal(400);
            for(let i=0; i<documents.length; i++) {
                let document = documents[i];

                document.should.have.property('metadataValues');
                document.metadataValues.metadataKey1.should.equal('metadataValue 1');
                document.metadataValues.metadataKey2.should.equal('metadataValue 2');
                document.should.have.property('collections');
                document.collections[0].should.be.equal('collection1');
                document.permissions.forEach(function (permission) {
                    switch (permission['role-name']) {
                        case 'app-user':
                            permission.capabilities.length.should.equal(1);
                            permission.capabilities[0].should.equal('read');
                            break;
                        case 'app-builder':
                            permission.capabilities.length.should.equal(2);
                            permission.capabilities.should.containEql('read');
                            permission.capabilities.should.containEql('update');
                            break;
                    }
                });
                document.quality.should.equal(1);
            }
            done();
        })
        .catch(done)
        .catch(err=> done(err));
}

function readDocsWithTransform(done){

    dbWriter.documents.read(uris)
        .result(function (documents) {
            documents.length.should.equal(1000);
            for(let i=0; i<documents.length; i++){
                documents[i].content.flagParam.should.equal('tested1');
            }
            done();
        })
        .catch(done)
        .catch(err=> done(err));
}
