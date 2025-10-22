/*
* Copyright (c) 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
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
    beforeEach(async function() {
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

        await new Promise((resolve) => {
            dbWriter.documents.writeAll(readable, {
                onCompletion: resolve
            });
        });
    });

    it('should removeAllUris documents with onCompletion, concurrentRequests options', async () => {
        const summary = await new Promise((resolve) => {
            dbWriter.documents.removeAllUris(removeStream, {
                concurrentRequests: {multipleOf: 'hosts', multiplier: 4},
                onCompletion: resolve
            });
        });
        summary.docsRemovedSuccessfully.should.be.equal(100);
        summary.docsFailedToBeRemoved.should.be.equal(0);
        summary.timeElapsed.should.be.greaterThanOrEqual(0);
        await verifyDocs();
    });

    it('should removeAllUris documents with onBatchSuccess and batchSize options', async () => {
        const summary = await new Promise((resolve, reject) => {
            dbWriter.documents.removeAllUris(removeStream, {
                onBatchSuccess: (function (progress, documents) {
                    try {
                        progress.docsRemovedSuccessfully.should.be.greaterThanOrEqual(10);
                        progress.docsFailedToBeRemoved.should.be.equal(0);
                        progress.timeElapsed.should.be.greaterThanOrEqual(0);
                        documents.length.should.equal(10);
                    } catch (err) {
                        reject(err);
                    }
                }),
                batchSize: 10,
                onCompletion: resolve
            });
        });
        summary.docsRemovedSuccessfully.should.be.equal(100);
        summary.docsFailedToBeRemoved.should.be.equal(0);
        summary.timeElapsed.should.be.greaterThanOrEqual(0);
        await verifyDocs();
    });

    it('should throw error with invalid batchSize and inputKind as array option', async function(){
        try{
            await dbWriter.documents.removeAllUris(removeStream,{
                batchSize:10,
                inputKind:'array'
            });
        } catch(err){
            err.toString().should.equal('Error: batchSize not expected when inputKind is array.');
            await dbWriter.documents.remove(uris).result();
        }
    });

    it('should removeAllUris documents with inputKind as array', async () => {
        removeStream = new Stream.Readable({objectMode: true});
        for (let i = 0; i + 10 <= uris.length; i = i + 10) {
            removeStream.push(uris.slice(i, i + 10));
        }
        removeStream.push(null);

        await new Promise((resolve, reject) => {
            dbWriter.documents.removeAllUris(removeStream, {
                inputKind: 'aRRaY',
                onBatchSuccess: (function (progress, documents) {
                    try {
                        documents.length.should.equal(10);
                    } catch (error) {
                        reject(error);
                    }
                }),
                onCompletion: ((summary) => {
                    try {
                        summary.docsRemovedSuccessfully.should.be.equal(100);
                        summary.docsFailedToBeRemoved.should.be.equal(0);
                        summary.timeElapsed.should.be.greaterThanOrEqual(0);
                        resolve(summary);
                    } catch (error) {
                        reject(error);
                    }
                })
            });
        });
        await verifyDocs();
    });

    it('should throw error with invalid concurrentRequests option', async function(){
        try{
            await dbWriter.documents.removeAllUris(removeStream,{
                concurrentRequests: {multipleOf: 'invalid', multiplier: 4}
            });
        } catch(err){
            err.toString().should.equal('Error: Invalid value for multipleOf. Value must be forests or hosts.');
            await dbWriter.documents.remove(uris).result();
        }
    });

    it('should queryToRemoveAll documents with onCompletion option', async function(){
        const summary = await new Promise((resolve) => {
            dbWriter.documents.queryToRemoveAll(query, {
                onCompletion: resolve
            });
        });
        summary.docsRemovedSuccessfully.should.be.equal(100);
        summary.docsFailedToBeRemoved.should.be.equal(0);
        summary.timeElapsed.should.be.greaterThanOrEqual(0);
        await verifyDocs();
    });

    it('should queryToRemoveAll documents with onCompletion, concurrentRequestsas', async () => {
        const summary = await new Promise((resolve) => {
            dbWriter.documents.queryToRemoveAll(query, {
                concurrentRequests: {multipleOf: 'hosts', multiplier: 4},
                onCompletion: resolve
            });
        });
        summary.docsRemovedSuccessfully.should.be.equal(100);
        summary.docsFailedToBeRemoved.should.be.equal(0);
        summary.timeElapsed.should.be.greaterThanOrEqual(0);
        await verifyDocs();
    });

});

async function verifyDocs(){
    const documents = await dbWriter.documents.read(uris).result();
    documents.length.should.equal(0);
}
