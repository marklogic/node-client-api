/*
* Copyright (c) 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/

const should = require('should');
const testconfig = require('../etc/test-config.js');
const marklogic = require('../');
const ctsQb = marklogic.ctsQueryBuilder;
const dbWriter = marklogic.createDatabaseClient(testconfig.restWriterConnection);
const q = marklogic.queryBuilder;
const Stream = require('stream');
const streamToArray = require('stream-to-array');
const expect = require('chai').expect;

let readable = new Stream.Readable({objectMode: true});
let uris = [];
let result = new Set();
const query = q.where(ctsQb.cts.directoryQuery('/test/dataMovement/requests/queryAll/'));

describe('data movement queryAll', function() {
    before(function (done) {
        // This "before" and the "after" frequently fail to finish before the timeout triggers
        // TODO:
        //      short-term -> add "this.timeout(120000)" to both methods
        //      long-term -> Do we need 10000 records for these tests? If 120 seconds is not enough, we change the test.
        this.timeout(120000);
        readable = new Stream.Readable({objectMode: true});
        uris = [];
        for(let i=0; i<10000; i++) {
            const temp = {
                uri: '/test/dataMovement/requests/queryAll/'+i+'.json',
                contentType: 'application/json',
                content: {['key '+i]:'value '+i}
            };
            readable.push(temp);
            uris.push(temp.uri);
        }
        readable.push(null);
        dbWriter.documents.writeAll(readable, {
            onCompletion: ((summary) => {
                done();
            })
        });
    });

    after((function(done){
        this.timeout(120000);
        dbWriter.documents.remove(uris)
            .result(function(response){
                done();
            })
            .catch(done);
    }));

    it('queryAll should throw error if queryType is not cts', function(done){
        try{
            const query = q.directory('/test/dataMovement/requests/queryAll/');
            dbWriter.documents.queryAll(query);
            done(new Error('Expected an error to be thrown because query is not a cts query.'));
        } catch(err){
            err.toString().should.equal('Error: Query needs to be a cts query.');
            done();
        }
    });

    it('should queryAll documents with empty options', function(done){

        streamToArray(dbWriter.documents.queryAll(query),
            function(err, arr ) {
                if(err){
                    done(err);
                }
                arr.forEach(item=> result.add(item.toString()));
                checkResult(done);
        });
    });

    it('should queryAll documents with onCompletion option',  function (done){

        streamToArray(dbWriter.documents.queryAll(query, {
                onCompletion: ((summary) => {
                    summary.urisReadSoFar.should.be.equal(10000);
                    summary.urisFailedToBeRead.should.be.equal(0);
                    summary.timeElapsed.should.be.greaterThanOrEqual(0);
                })
            }),
            function(err, arr ) {
                if(err){
                    done(err);
                }
                arr.forEach(item=> result.add(item.toString()));
                checkResult(done);
            });
    });

    it('queryAll should throw error if no query is provided',  function (done){
        try{
            dbWriter.documents.queryAll();
            return done(new Error('Expected an error to be thrown because no query was provided'));
        } catch(err){
            err.toString().should.equal('Error: Query cannot be null or undefined.');
            return done();
        }
    });

    it('should queryAll documents with batchSize=1 and output as string stream',  function (done){

        streamToArray(dbWriter.documents.queryAll(query, {
                batchSize:1
            }),
            function(err, arr ) {
                if(err){
                    done(err);
                }
                arr.forEach(item=> result.add(item.toString()));
                checkResult(done);
            });
    });

    it('queryAll should throw error with batchSize=100001',  function (done){
        try{
            dbWriter.documents.queryAll(query, {
                batchSize:100001
            });
            return done(new Error('Expected an error to be thrown because batchSize greater than 100000'));
        } catch(err){
            err.toString().should.equal('Error: batchSize cannot be greater than 100000');
            return done();
        }
    });

    it('should queryAll documents with queryBatchMultiple option',  function (done){

        streamToArray(dbWriter.documents.queryAll(query, {
                queryBatchMultiple:10
            }),
            function(err, arr ) {
                if(err){
                    done(err);
                }
                arr.forEach(item=> result.add(item.toString()));
                checkResult(done);
            });
    });

    it('should queryAll documents with queryBatchMultiple less than batchSize',  function (done){

        streamToArray(dbWriter.documents.queryAll(query, {
                queryBatchMultiple:-1,
                batchSize: 100
            }),
            function(err, arr ) {
                if(err){
                    done(err);
                }
                arr.forEach(item=> item.forEach(uri=>result.add(uri)));
                checkResult(done);
            });
    });

    it('should queryAll documents with queryBatchMultiple greater than batchSize',  function (done){

        streamToArray(dbWriter.documents.queryAll(query, {
                queryBatchMultiple:10000,
                batchSize: -1
            }),
            function(err, arr ) {
                if(err){
                    done(err);
                }
                arr.forEach(item=> result.add(item.toString()));
                checkResult(done);
            });
    });

    it('should queryAll documents with consistentSnapshot option as true',  function (done){

        streamToArray(dbWriter.documents.queryAll(query, {
                consistentSnapshot: true,
                onCompletion: ((summary) => {
                    summary.urisReadSoFar.should.be.equal(10000);
                    summary.urisFailedToBeRead.should.be.equal(0);
                    summary.timeElapsed.should.be.greaterThanOrEqual(0);
                    summary.consistentSnapshotTimestamp.should.be.greaterThanOrEqual(0);
                })
            }),
            function(err, arr ) {
            if(err){
                done(err);
            }
            arr.forEach(item=> result.add(item.toString()));
            checkResult(done);
            });
    });

    it('should queryAll documents with consistentSnapshot option as false',  function (done){

        streamToArray(dbWriter.documents.queryAll(query, {
                consistentSnapshot: false,
                onCompletion: ((summary) => {
                    summary.urisReadSoFar.should.be.equal(10000);
                    summary.urisFailedToBeRead.should.be.equal(0);
                    summary.timeElapsed.should.be.greaterThanOrEqual(0);
                    expect(summary.consistentSnapshotTimestamp).to.be.undefined;
                })
            }),
            function(err, arr ) {
                if(err){
                    done(err);
                }
                arr.forEach(item=> result.add(item.toString()));
                checkResult(done);
            });
    });

    it('should queryAll documents with consistentSnapshot option as DatabaseClient.Timestamp object',  function (done){
        this.timeout(120000);
        streamToArray(dbWriter.documents.queryAll(query, {
                consistentSnapshot: dbWriter.createTimestamp(Date.now().toString()+'0000'),
                onCompletion: ((summary) => {
                    summary.urisReadSoFar.should.be.equal(10000);
                    summary.urisFailedToBeRead.should.be.equal(0);
                    summary.timeElapsed.should.be.greaterThanOrEqual(0);
                    summary.consistentSnapshotTimestamp.should.be.greaterThanOrEqual(0);
                })
            }),
            function(err, arr ) {
                if(err){
                    done(err);
                }
                arr.forEach(item=> result.add(item.toString()));
                checkResult(done);
            });
    });

    it('should queryAll documents with onInitialTimestamp option',  function (done){
        let onIntitalTimestampValue = null;
        streamToArray(dbWriter.documents.queryAll(query, {
                consistentSnapshot: true,
                onInitialTimestamp: ((timestamp) => {
                    timestamp.value.should.be.greaterThanOrEqual(0);

                    const timestampValue = (timestamp.value.length>13) ?
                        (+timestamp.value.substr(0, 13)):
                        timestamp.value;
                    onIntitalTimestampValue = new Date(timestampValue);
                }),
                onCompletion: ((summary) => {
                    summary.consistentSnapshotTimestamp.toString().should.equal(onIntitalTimestampValue.toString());
                })
            }),
            function(err, arr ) {
                if(err){
                    done(err);
                }
                arr.forEach(item=> result.add(item.toString()));
                checkResult(done);
            });
    });

    it('queryAll should throw error with consistentSnapshot as Integer',  function (done){
        try{
            dbWriter.documents.queryAll(query, {
                consistentSnapshot: 1
            });
            return done(new Error('Expected an error to be thrown because consistentSnapshot is invalid'));
        } catch(err){
            err.toString().should.equal('Error: consistentSnapshot needs to be a boolean or DatabaseClient.Timestamp object.');
            return done();
        }
    });
});

function checkResult(done){
    result.size.should.equal(10000);
    for(let i=0; i<uris.length; i++){
        result.has(uris[i]).should.equal(true);
    }
    result.clear();
    done();
}
