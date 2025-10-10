/*
* Copyright (c) 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/

const should = require('should');
const testconfig = require('../etc/test-config.js');
const marklogic = require('../');
const dbWriter = marklogic.createDatabaseClient(testconfig.restWriterConnection);
const restAdminDB = marklogic.createDatabaseClient(testconfig.restAdminConnection);
const Stream = require('stream');
const streamToArray = require('stream-to-array');
const fs = require('fs');
const expect = require('chai').expect;

let uriStream = new Stream.PassThrough({objectMode: true});
let urisList = [];
let result = new Set();
let summaryValue = null;
let categoriesUrisList = [];
let xqyTransformName = 'flagParam';
let xqyTransformPath = './test-basic/data/flagTransform.xqy';

describe('data movement readAll', function() {
    // This "before" frequently fails to finish before the timeout triggers
    // TODO:
    //      short-term -> run with "timeout 0" and/or change/add "this.timeout(0)" to both methods
    //      long-term -> Do we need 10000 records for these tests?
    this.timeout(120000);
    before(function (done) {
        let readable = new Stream.Readable({objectMode: true});
        for(let i=0; i<10000; i++) {
            const temp = {
                uri: '/test/dataMovement/requests/readAll/'+i+'.json',
                contentType: 'application/json',
                content: {['key '+i]:'value '+i}
            };
            readable.push(temp);
            urisList.push(temp.uri);
        }
        readable.push(null);
        dbWriter.documents.writeAll(readable,{
            onCompletion: ((summary) => {
                readable = new Stream.Readable({objectMode: true});

                for (let i = 0; i < 400; i++) {
                    const temp = {
                        uri: '/test/dataMovement/requests/categories/' + i + '.json',
                        contentType: 'application/json',
                        content: {['key ' + i]: 'value ' + i}
                    };
                    readable.push(temp);
                    categoriesUrisList.push(temp.uri);
                }
                readable.push(null);

                dbWriter.documents.writeAll(readable,{
                    defaultMetadata: {
                        metadataValues: {
                            'metadataKey1': 'metadataValue 1',
                            'metadataKey2': 'metadataValue 2'
                        },
                        collections: 'collection1',
                        permissions: [
                            {'role-name': 'app-user', capabilities: ['read']},
                            {'role-name': 'app-builder', capabilities: ['read', 'update']}
                        ],
                        quality: 1
                    },
                    onCompletion: ((summary) => {
                        done();
                    })
                });
            })
        });
    });

    beforeEach(function(done){
        uriStream = new Stream.PassThrough({objectMode: true});
        urisList.forEach(uri => uriStream.push(uri));
        uriStream.push(null);
        done();
    });

    after((function(done){
        categoriesUrisList.forEach(uri=>urisList.push(uri));
        dbWriter.documents.remove(urisList)
        .result(function(){
            restAdminDB.config.transforms.remove(xqyTransformName);
            done();
        })
        .catch(err=> done(err))
        .catch(done);
    }));

    it('should readAll documents with empty options', function(done){

        streamToArray(dbWriter.documents.readAll(uriStream),
            function(err, arr ) {
                if(err){
                    done(err);
                }
                arr.forEach(item=> result.add(item.uri));
                checkResult(done);
            });
    });

    it('should readAll documents with onCompletion option', function(done){

        streamToArray(dbWriter.documents.readAll(uriStream,{
                onCompletion: ((summary) => summaryValue = summary)
        }),
            function(err, arr ) {
                if(err){
                    done(err);
                }
                arr.forEach(item=> result.add(item.uri));
                checkSummary(summaryValue, done);
            });
    });

    it('should throw error with invalid inputKind option', function(done){
        try{
            dbWriter.documents.readAll(uriStream,{inputKind:10});
        } catch(err){
            err.toString().should.equal('Error: Invalid value for inputKind. Value must be array or string.');
            done();
        }
    });

    it('should readAll documents with inputKind option as string', function(done){
        streamToArray(dbWriter.documents.readAll(uriStream,{
                inputKind: 'String'
            }),
            function(err, arr ) {
                if(err){
                    done(err);
                }
                arr.forEach(item=> result.add(item.uri));
                checkResult(done);
            });
    });

    it('should readAll documents with inputKind option as array', function(done){
        uriStream = new Stream.PassThrough({objectMode: true});
        for(let i=0; i+1000<=urisList.length; i=i+1000){
            uriStream.push(urisList.slice(i,i+1000));
        }
        uriStream.push(null);

        streamToArray(dbWriter.documents.readAll(uriStream,{
                inputKind: 'Array'
            }),
            function(err, arr ) {
                if(err){
                    done(err);
                }
                arr.forEach(item=> result.add(item.uri));
                checkResult(done);
            });
    });

    it('should throw error with invalid outputStreamType option', function(done){
        try{
            dbWriter.documents.readAll(uriStream,{outputStreamType:10});
        } catch(err){
            err.toString().should.equal('Error: Invalid value for outputStreamType. Value must be chunked or object.');
            done();
        }
    });

    it('should throw error with categories and outputStreamType as chunked', function(done){
        try{
            dbWriter.documents.readAll(uriStream,{
                outputStreamType: 'chunked',
                categories: []
            });
        } catch(err){
            err.toString().should.equal('Error: categories not expected when outputStreamType is chunked.');
            done();
        }
    });

    it('should readAll documents with outputStreamType option as object', function(done){
        streamToArray(dbWriter.documents.readAll(uriStream,{
                outputStreamType: 'Object'
            }),
            function(err, arr ) {
                if(err){
                    done(err);
                }
                arr.forEach(item=> result.add(item.uri));
                checkResult(done);
            });
    });

    it('should readAll documents with outputStreamType option as chunked', function(done){
        streamToArray(dbWriter.documents.readAll(uriStream, {
                outputStreamType: 'chunked'
            }),
            function(err, arr ) {
                if(err){
                    done(err);
                }
                arr.forEach(item=> result.add(item.toString()));

                result.size.should.equal(10000);
                result.clear();
                done();
            });
    });

    it('should throw error with invalid batchSize option', function(done){
        try{
            dbWriter.documents.readAll(uriStream,{batchSize:-1});
        } catch(err){
            err.toString().should.equal('Error: Invalid batchSize. batchSize cannot be less than or equal to 0.');
            done();
        }
    });

    it('should readAll documents with batchSize option', function(done){
        streamToArray(dbWriter.documents.readAll(uriStream,{
                batchSize: 100
            }),
            function(err, arr ) {
                if(err){
                    done(err);
                }
                arr.forEach(item=> result.add(item.uri));
                checkResult(done);
            });
    });

    it('should throw error with invalid batchSize and inputKind as array option', function(done){
        try{
            dbWriter.documents.readAll(uriStream,{batchSize:10, inputKind:'array'});
        } catch(err){
            err.toString().should.equal('Error: batchSize not expected when inputKind is array.');
            done();
        }
    });

    it('should throw error with invalid concurrentRequests option', function(done){
        try{
            dbWriter.documents.readAll(uriStream,{concurrentRequests: {multipleOf: 'invalid', multiplier: 4}});
        } catch(err){
            err.toString().should.equal('Error: Invalid value for multipleOf. Value must be forests or hosts.');
            done();
        }
    });

    it('should readAll documents with concurrentRequests option', function(done){
        streamToArray(dbWriter.documents.readAll(uriStream,{
                concurrentRequests: {multipleOf: 'hosts', multiplier: 4}
            }),
            function(err, arr ) {
                if(err){
                    done(err);
                }
                arr.forEach(item=> result.add(item.uri));
                checkResult(done);
            });
    });

    it('should readAll documents with categories option', function(done){
        uriStream = new Stream.PassThrough({objectMode: true});
        categoriesUrisList.forEach(uri => uriStream.push(uri));
        uriStream.push(null);

         streamToArray(dbWriter.documents.readAll(uriStream,{
                categories: ['permissions', 'metadataValues', 'collections', 'quality']
            }),
            function (err, arr) {
                if (err) {
                    done(err);
                }
                arr.forEach(item => result.add(item));
                checkCategoriesResult(result, done);
            });
    });

    it('should readAll documents with transform option', function(done){
        this.timeout(15000);
        restAdminDB.config.transforms.write(xqyTransformName, 'xquery', fs.createReadStream(xqyTransformPath))
            .result(function(response){

                streamToArray(dbWriter.documents.readAll(uriStream,{
                        transform: [xqyTransformName, {flag:'tested1'}]
                    }),
                    function(err, arr ) {
                        if(err){
                            done(err);
                        }
                        arr.forEach(item=> result.add(item));
                        checkTransformResult(done);
                    });
            })
            .catch(err=> done(err));
    });

    it('should throw error with invalid onBatchError option', function(done){
        restAdminDB.config.transforms.write(xqyTransformName, 'xquery', fs.createReadStream(xqyTransformPath))
            .result(function(response){
                dbWriter.documents.readAll(uriStream,{
                    batchSize:1000,
                    transform: ['tested1'],
                    onBatchError: ((progressSoFar, documents, error) => {
                        progressSoFar.docsReadSuccessfully.should.be.equal(0);
                        progressSoFar.docsFailedToBeRead.should.be.equal(1000);
                        error.body.errorResponse.messageCode.should.be.equal('RESTAPI-INVALIDREQ');
                        documents.length.should.equal(1000);
                        return 10;
                    })
                }).on('error', function(err){
                    err.toString().should.equal('Error: onBatchError should return null, empty array or a replacement array.');
                    done();
                });
            })
            .catch(err=> done(err));
    });

    it('should readAll documents with onBatchError option returning null', function(done){
        restAdminDB.config.transforms.write(xqyTransformName, 'xquery', fs.createReadStream(xqyTransformPath))
            .result(function(response){
                dbWriter.documents.readAll(uriStream,{
                    batchSize:1000,
                    transform: ['tested1'],
                    onBatchError: ((progressSoFar, documents, error) => {
                        progressSoFar.docsReadSuccessfully.should.be.equal(0);
                        progressSoFar.docsFailedToBeRead.should.be.equal(1000);
                        error.body.errorResponse.messageCode.should.be.equal('RESTAPI-INVALIDREQ');
                        documents.length.should.equal(1000);
                        return null;
                    }),
                    onCompletion: ((summary) => {
                        summary.docsReadSuccessfully.should.be.equal(0);
                        summary.docsFailedToBeRead.should.be.equal(10000);
                        summary.timeElapsed.should.be.greaterThanOrEqual(0);
                        done();
                    })
                });
            })
            .catch(err=> done(err));
    });

    it('should readAll documents with onBatchError option returning replacement batch', function(done){
        let onBatchErrorStream = new Stream.PassThrough({objectMode: true});
        onBatchErrorStream.push('');
        onBatchErrorStream.push(null);
        dbWriter.documents.readAll(onBatchErrorStream,{
            batchSize:10,
            onBatchError: ((progressSoFar, documents, error) => {
                let replacementBatch = [];
                for (let i = 0; i < 10; i++) {
                    replacementBatch.push('/test/dataMovement/requests/readAll/' + i + '.json');
                }

                onBatchErrorStream = new Stream.PassThrough({objectMode: true});
                onBatchErrorStream.push(null);
                return replacementBatch;
            }),
            onCompletion: ((summary) => {
                summary.docsReadSuccessfully.should.be.equal(10);
                summary.docsFailedToBeRead.should.be.equal(0);
                summary.timeElapsed.should.be.greaterThanOrEqual(0);
                done();
            })
        });
    });

    it('should readAll documents with consistentSnapshot option as true', function(done){
        this.timeout(15000);
        dbWriter.documents.readAll(uriStream,{
            consistentSnapshot:true,
            onCompletion: ((summary) => {
                summary.docsReadSuccessfully.should.be.equal(10000);
                summary.docsFailedToBeRead.should.be.equal(0);
                summary.timeElapsed.should.be.greaterThanOrEqual(0);
                summary.consistentSnapshotTimestamp.should.be.greaterThanOrEqual(0);
                done();
            })
        });
    });

    it('should readAll documents with consistentSnapshot option as DatabaseClient.Timestamp object', function(done){
        this.timeout(120000);
        dbWriter.documents.readAll(uriStream,{
            consistentSnapshot:dbWriter.createTimestamp((Date.now()*10000).toString()),
            onCompletion: ((summary) => {
                summary.docsReadSuccessfully.should.be.equal(10000);
                summary.docsFailedToBeRead.should.be.equal(0);
                summary.timeElapsed.should.be.greaterThanOrEqual(0);
                summary.consistentSnapshotTimestamp.should.be.greaterThanOrEqual(0);
                done();
            })
        });
    });

    it('should readAll documents with consistentSnapshot option as false', function(done){

        dbWriter.documents.readAll(uriStream,{
            consistentSnapshot:false,
            onCompletion: ((summary) => {
                summary.docsReadSuccessfully.should.be.equal(10000);
                summary.docsFailedToBeRead.should.be.equal(0);
                summary.timeElapsed.should.be.greaterThanOrEqual(0);
                expect(summary.consistentSnapshotTimestamp).to.be.undefined;
                done();
            })
        });
    });

    it('should readAll documents with onInitialTimestamp option',  function (done){
        let onInitialTimestampValue = null;
        streamToArray(dbWriter.documents.readAll(uriStream,{
                consistentSnapshot: true,
                onInitialTimestamp: ((timestamp) => {
                    timestamp.value.should.be.greaterThanOrEqual(0);

                    const timestampValue = (timestamp.value.length>13) ?
                        (+timestamp.value.substr(0, 13)):
                        timestamp.value;
                    onInitialTimestampValue = new Date(timestampValue);
                }),
                onCompletion: ((summary) => {
                    summary.consistentSnapshotTimestamp.toString().should.equal(onInitialTimestampValue.toString());
                })
            }),
            function(err, arr ) {
                if(err){
                    done(err);
                }
                arr.forEach(item=> result.add(item.uri));
                checkResult(done);
            });
    });

    it('should queryToReadAll documents with onCompletion option', function(done){
        const ctsQb = marklogic.ctsQueryBuilder;
        const q = marklogic.queryBuilder;
        const query = q.where(ctsQb.cts.directoryQuery('/test/dataMovement/requests/readAll/'));
        streamToArray(dbWriter.documents.queryToReadAll(query,{
            onCompletion:((summary) => {
                summary.docsReadSuccessfully.should.be.equal(10000);
                summary.docsFailedToBeRead.should.be.equal(0);
                summary.timeElapsed.should.be.greaterThanOrEqual(0);
            })
            }),
            function(err, arr ) {
                if(err){
                    done(err);
                }
                arr.forEach(item=> result.add(item.uri));
                checkResult(done);
            });
    });

    it('should queryToReadAll documents with onCompletion, consistentSnapshot and onInitialTimestamp options', function(done){
        const ctsQb = marklogic.ctsQueryBuilder;
        const q = marklogic.queryBuilder;
        const query = q.where(ctsQb.cts.directoryQuery('/test/dataMovement/requests/readAll/'));
        let onInitialTimestampValue = null;
        streamToArray(dbWriter.documents.queryToReadAll(query,{
                consistentSnapshot: true,
                onInitialTimestamp:((timestamp)=> {
                    timestamp.value.should.be.greaterThanOrEqual(0);
                    const timestampValue = (timestamp.value.length>13) ?
                        (+timestamp.value.substr(0, 13)):
                        timestamp.value;
                   onInitialTimestampValue = new Date(timestampValue);
                }),
                onCompletion:((summary) => {
                    summary.docsReadSuccessfully.should.be.equal(10000);
                    summary.docsFailedToBeRead.should.be.equal(0);
                    summary.timeElapsed.should.be.greaterThanOrEqual(0);
                    summary.consistentSnapshotTimestamp.toString().should.equal(onInitialTimestampValue.toString());
                })
            }),
            function(err, arr ) {
                if(err){
                    done(err);
                }
                arr.forEach(item=> result.add(item.uri));
                checkResult(done);
            });
    });

    it('should throw error with categories options rawContent and permissions', function(done){
        uriStream = new Stream.PassThrough({objectMode: true});
        categoriesUrisList.forEach(uri => uriStream.push(uri));
        uriStream.push(null);
        const readAllStream = dbWriter.documents.readAll(uriStream,{categories: ['rawContent','permissions']});
        readAllStream.on('error', function(err){
            err.toString().should.equal('Error: Categories should not have other option(s) if rawContent is needed.');
            done();
        });
    });

    it('should readAll documents with categories options rawContent', function(done){
        uriStream = new Stream.PassThrough({objectMode: true});
        categoriesUrisList.forEach(uri => uriStream.push(uri));
        uriStream.push(null);
        let docCount = 0;
        streamToArray(dbWriter.documents.readAll(uriStream,{
                categories: ['rawContent']
            }),
            function (err, arr) {
                if (err) {
                    done(err);
                }
                arr.forEach(item => {
                    let keyCount = 0;
                    docCount++;
                    for(let key in item){
                        key.should.containEql('key');
                        keyCount++;
                    }
                    keyCount.should.be.equal(1);
                });
                docCount.should.be.equal(categoriesUrisList.length);
                done();
            });
    });

    it('should return empty with cts wordQuery when no documents are found', function(done) {
        const ctsqb = marklogic.ctsQueryBuilder;
        const q = marklogic.queryBuilder;
        const query = q.where(ctsqb.cts.wordQuery('zero'));
        var res = '';
        var chk = '';
        const queryToReadAllStream = dbWriter.documents.queryToReadAll(query,{
            onCompletion:((summary) => {
                res = summary;
            })
        });
        queryToReadAllStream.on('error', function (err) { throw new Error(err);});
        queryToReadAllStream.on('data', function(chunk){
            chk = chunk;
        });
        queryToReadAllStream.on('end', function(end){
            expect(res).to.be.empty;
            expect(chk).to.be.empty;
            done();
        });
    });
});

function checkResult(done){
    result.size.should.equal(10000);
    for(let i=0; i<urisList.length; i++){
        result.has(urisList[i]).should.equal(true);
    }
    result.clear();
    done();
}

function checkSummary(summary, done) {
    summary.docsReadSuccessfully.should.be.equal(10000);
    summary.docsFailedToBeRead.should.be.equal(0);
    summary.timeElapsed.should.be.greaterThanOrEqual(0);
    checkResult(done);
}

function checkCategoriesResult(result, done){
    result.size.should.equal(400);
    result.forEach(item => {
        item.collections[0].should.be.equal('collection1');
        item.quality.should.be.equal(1);
        item.metadataValues.metadataKey1.should.be.equal('metadataValue 1');
        item.metadataValues.metadataKey2.should.be.equal('metadataValue 2');
        item.permissions.forEach(function (permission) {
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
    });
    result.clear();
    done();
}

function checkTransformResult(done){
    result.size.should.be.equal(10000);
    result.forEach(item => {
        item.content.flagParam.should.be.equal('tested1');
    });
    result.clear();
    done();
}
