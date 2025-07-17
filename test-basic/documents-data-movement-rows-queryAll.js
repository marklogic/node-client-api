/*
* Copyright © 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/

const should = require('should');
const testconfig = require('../etc/test-config.js');
const marklogic = require('../');
const dbWriter = marklogic.createDatabaseClient(testconfig.restWriterConnection);

const Stream = require('stream');
const streamToArray = require('stream-to-array');
const p = marklogic.planBuilder;
const fs = require('fs');
const testlib = require("../etc/test-lib");
const tdeWriter = marklogic.createDatabaseClient({
    database: 'unittest-nodeapi-modules',
    host: 'localhost',
    port: 8015,
    user: 'tde-user',
    password: 'x',
    authType: 'DIGEST'
});

let uris = new Set();
let result = [];
const planFromBuilderTemplate = p.fromView('soccer', 'matches', '');
let serverConfiguration = {};

describe('data movement rows-queryAll', function() {
    this.timeout(15000);
    before(function(done){
        try {
            testlib.findServerConfiguration(serverConfiguration);
            setTimeout(()=>{
                setUp(done);
                }, 3000);
        } catch(error){
            done(error);
        }
    });

    after(function(done){
            const q = marklogic.queryBuilder;
            const ctsQb = marklogic.ctsQueryBuilder;
            const query = q.where(ctsQb.cts.directoryQuery('/test/dataMovement/requests/exporting-rows/'));
            dbWriter.documents.queryToRemoveAll(query, {
                onCompletion: ((summary) => {
                    tdeWriter.documents.remove('/test/exporting-rows.xml')
                        .result(function(response){})
                        .then(done());
                })
            });
    });

    it('should queryAll documents with onCompletion, batchSize and concurrentRequests options',  function (done){

        streamToArray(
            dbWriter.rows.queryAll(planFromBuilderTemplate, {
                batchSize: 10,
                concurrentRequests : {multipleOf:'hosts', multiplier:4},
                onCompletion: ((summary) => {
                    try {
                        summary.rowsReadSuccessfully.should.be.equal(50);
                        summary.rowsFailedToBeRead.should.be.equal(0);
                        summary.timeElapsed.should.be.greaterThanOrEqual(0);
                    } catch(err) {
                        done(err);
                    }
                })
            }),
            function(err, arr ) {
                if(err){
                    done(err);
                }
                arr.forEach(item=> item.forEach(value=> {
                    if(value.document){
                        result.push(value.document.value);
                    }
                }));
                verifyDocs(done);
            });
    });

    it('should queryAll documents with onCompletion and consistentSnapshot options',  function (done){

        streamToArray(
            dbWriter.rows.queryAll(planFromBuilderTemplate, {
                consistentSnapshot: true,
                onCompletion: ((summary) => {
                    try {
                        summary.rowsReadSuccessfully.should.be.equal(50);
                        summary.rowsFailedToBeRead.should.be.equal(0);
                        summary.timeElapsed.should.be.greaterThanOrEqual(0);
                        summary.consistentSnapshotTimestamp.should.be.greaterThanOrEqual(0);
                    } catch(err) {
                        done(err);
                    }
                })
            }),
            function(err, arr ) {
                if(err){
                    done(err);
                }
                arr.forEach(item=> item.forEach(value=> {
                    if(value.document){
                        result.push(value.document.value);
                    }
                }));
                verifyDocs(done);
            });
    });

    it('should throw error with onInitialTimestamp option and without consistentSnapshot', function(done){
        try{
            dbWriter.rows.queryAll(planFromBuilderTemplate, {
                onInitialTimestamp:((timestamp)=> {})
            });
        } catch(err){
            err.toString().should.equal('Error: consistentSnapshot needs to be true when onInitialTimestamp is provided.');
            done();
        }
    });

    it('should queryAll documents with onCompletion, onInitialTimestamp and consistentSnapshot options',  function (done){
        let onIntitalTimestampValue = null;
        streamToArray(
            dbWriter.rows.queryAll(planFromBuilderTemplate, {
                consistentSnapshot: true,
                onInitialTimestamp:((timestamp)=> {
                    timestamp.value.should.be.greaterThanOrEqual(0);
                    const timestampValue = (timestamp.value.length>13) ?
                        (+timestamp.value.substr(0, 13)):
                        timestamp.value;
                    onIntitalTimestampValue = new Date(timestampValue);
                }),
                onCompletion: ((summary) => {
                    try {
                        summary.rowsReadSuccessfully.should.be.equal(50);
                        summary.rowsFailedToBeRead.should.be.equal(0);
                        summary.timeElapsed.should.be.greaterThanOrEqual(0);
                        summary.consistentSnapshotTimestamp.toString().should.equal(onIntitalTimestampValue.toString());
                    } catch(err) {
                        done(err);
                    }
                })
            }),
            function(err, arr ) {
                if(err){
                    done(err);
                }
                arr.forEach(item=> item.forEach(value=> {
                    if(value.document){
                        result.push(value.document.value);
                    }
                }));
                verifyDocs(done);
            });
    });

    it('should queryAll documents with onCompletion and outputStreamType options',  function (done){

        streamToArray(
            dbWriter.rows.queryAll(planFromBuilderTemplate, {
                outputStreamType: 'chunked',
                onCompletion: ((summary) => {
                    try {
                        summary.rowsReadSuccessfully.should.be.equal(50);
                        summary.rowsFailedToBeRead.should.be.equal(0);
                        summary.timeElapsed.should.be.greaterThanOrEqual(0);
                    } catch(err) {
                        done(err);
                    }
                })
            }),
            function(err, arr ) {
                if(err){
                    done(err);
                }
                arr.forEach(item=> {
                    const rows = JSON.parse(item.toString()).rows;
                    rows.forEach(value=> result.push(value.document.value));
                });
                verifyDocs(done);
            });
    });

    it('should queryAll documents with onCompletion,consistentSnapshot and outputStreamType option as sequence',
        function (done){

        streamToArray(
            dbWriter.rows.queryAll(planFromBuilderTemplate, {
                outputStreamType: 'sequence',
                consistentSnapshot: true,
                onCompletion: ((summary) => {
                    try {
                        summary.rowsReadSuccessfully.should.be.equal(50);
                        summary.rowsFailedToBeRead.should.be.equal(0);
                        summary.timeElapsed.should.be.greaterThanOrEqual(0);
                        summary.consistentSnapshotTimestamp.should.be.greaterThanOrEqual(0);
                    } catch(err) {
                        done(err);
                    }
                })
            }),
            function(err, arr ) {
                if(err){
                    done(err);
                }
                arr.forEach(item=> item.forEach(value=> {
                    if(value.document){
                        result.push(value.document.value);
                    }
                }));
                verifyDocs(done);
            });
    });
});

function verifyDocs(done){
    result.length.should.equal(50);
    for(let i=0; i<result.length; i++){
        uris.has(result[i].toString()).should.equal(true);
    }
    result = [];
    done();
}

function setUp(done) {
    const view = [
        {
            uri:'/test/exporting-rows.xml',
            collections:['http://marklogic.com/xdmp/tde'],
            contentType:'application/xml',
            content:fs.createReadStream('./test-basic/data/exportingRows.tdex'),
            permissions: [
                {'role-name': 'rest-reader', capabilities: ['read']},
                {'role-name': 'rest-writer', capabilities: ['read', 'update','execute']}
            ]
        }];
    tdeWriter.documents.write(view)
        .result(function(response){
            let readable = new Stream.Readable({objectMode: true});
            for(let i=1; i<=50;i++){
                let temp = {
                    uri: '/test/dataMovement/requests/exporting-rows/'+i+'.xml',
                    contentType: 'application/xml',
                    content: '<?xml version="1.0" encoding="UTF-8"?>\n' +
                        '<match>\n' +
                        '<id>'+i+'</id>\n' +
                        '<docUri>/test/dataMovement/requests/exporting-rows/'+i+'.xml</docUri>\n' +
                        '<match-date>2016-10-12</match-date>\n' +
                        '<league>Premier-'+i+'</league>\n' +
                        '<score>\n' +
                        '<home>'+i+'</home>\n' +
                        '</score>\n' +
                        '</match>'
                };
                uris.add(temp.uri);
                readable.push(temp);
            }
            readable.push(null);
            dbWriter.documents.writeAll(readable,{
                defaultMetadata: {
                    collections: ['source1'],
                    permissions: [
                        {'role-name': 'rest-reader', capabilities: ['read']},
                        {'role-name': 'rest-writer', capabilities: ['read', 'update']}
                    ],
                },onCompletion: ((summary) => {
                    done();
                })
            });
        });
}