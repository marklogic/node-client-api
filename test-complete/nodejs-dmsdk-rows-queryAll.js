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

const Stream = require('stream');
const streamToArray = require('stream-to-array');
const p = marklogic.planBuilder;
const fs = require('fs');
const tdeWriter = marklogic.createDatabaseClient({
    database: 'unittest-nodeapi-modules',
    host: 'localhost',
    port: 8025,
    user: 'tde-user',
    password: 'x',
    authType: 'DIGEST'
});

let uris = new Set();
let result = [];
const planFromBuilderTemplate = p.fromView('soccer', 'matches', '');

describe('data movement rows-queryAll', function () {
    this.timeout(15000);
    before(function (done) {
        const view = [
            {
                uri: '/test/exporting-rows.xml',
                collections: ['http://marklogic.com/xdmp/tde'],
                contentType: 'application/xml',
                content: fs.createReadStream('./test-basic/data/exportingRows.tdex'),
                permissions: [
                    {'role-name': 'rest-reader', capabilities: ['read']},
                    {'role-name': 'rest-writer', capabilities: ['read', 'update', 'execute']}
                ]
            }];
        tdeWriter.documents.write(view)
            .result(function (response) {
                let readable = new Stream.Readable({objectMode: true});
                for (let i = 1; i <= 200; i++) {
                    let temp = {
                        uri: '/test/dataMovement/requests/exporting-rows/' + i + '.xml',
                        contentType: 'application/xml',
                        content: '<?xml version="1.0" encoding="UTF-8"?>\n' +
                            '<match>\n' +
                            '<id>' + i + '</id>\n' +
                            '<docUri>/test/dataMovement/requests/exporting-rows/' + i + '.xml</docUri>\n' +
                            '<match-date>2016-10-12</match-date>\n' +
                            '<league>Premier-' + i + '</league>\n' +
                            '<score>\n' +
                            '<home>' + i + '</home>\n' +
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
                    }, onCompletion: ((summary) => {
                        done();
                    })
                });
            })
            .catch(error => done(error));
    });

    after(function (done) {
        const q = marklogic.queryBuilder;
        const ctsQb = marklogic.ctsQueryBuilder;
        const query = q.where(ctsQb.cts.directoryQuery('/test/dataMovement/requests/exporting-rows/'));
        dbWriter.documents.queryToRemoveAll(query, {
            onCompletion: ((summary) => {
                tdeWriter.documents.remove('/test/exporting-rows.xml')
                    .result(function (response) {
                    })
                    .then(done())
                    .catch(error => done(error));
            })
        });
    });

    it('should throw error with invalid query ', function (done) {
        const planFromBuilderTemplateInvalid = p.fromView('invalid', 'matches', '');

        streamToArray(
            dbWriter.rows.queryAll(planFromBuilderTemplateInvalid, {
                batchSize: 10,
                concurrentRequests: {multipleOf: 'hosts', multiplier: 4},
                onCompletion: ((summary) => {
                    try {
                        summary.rowsReadSuccessfully.should.be.equal(200);
                        summary.rowsFailedToBeRead.should.be.equal(0);
                        summary.timeElapsed.should.be.greaterThanOrEqual(0);
                    } catch (err) {
                        done(err);
                    }
                })
            }),
            function (err, arr) {
                if (err) {
                    try{
                        err.toString().includes('MarkLogicError: read viewInfo: cannot process response with 500 status');
                        done();
                    } catch(err){
                        done(err);
                    }
                }
            });
    });

    it('should throw error with no query ', function (done) {
        const planFromBuilderTemplateInvalid = p.fromView('invalid', 'matches', '');

        streamToArray(
            dbWriter.rows.queryAll(),
            function (err, arr) {
                if (err) {
                    try{
                        err.toString().includes('Error: read viewInfo: cannot process response with 400 status');
                        done();
                    } catch(err){
                        done(err);
                    }
                }
            });
    });

    it('should queryAll documents with rowStructure = array', function (done) {

        streamToArray(
            dbWriter.rows.queryAll(planFromBuilderTemplate, {
                onCompletion: ((summary) => {
                    try {
                        summary.rowsReadSuccessfully.should.be.equal(200);
                        summary.rowsFailedToBeRead.should.be.equal(0);
                        summary.timeElapsed.should.be.greaterThanOrEqual(0);
                    } catch (err) {
                        done(err);
                    }
                })
            }),
            function (err, arr) {
                if (err) {
                    done(err);
                }
                arr.forEach(item => item.forEach(value => {
                    if (value.document) {
                        result.push(value.document.value);
                    }
                }));
                verifyDocs(done);
            });
    });

    it('should queryAll documents with onCompletion, batchSize and concurrentRequests = forests options ', function (done) {

        streamToArray(
            dbWriter.rows.queryAll(planFromBuilderTemplate, {
                batchSize: 10,
                concurrentRequests: {multipleOf: 'forests', multiplier: 4},
                onCompletion: ((summary) => {
                    try {
                        summary.rowsReadSuccessfully.should.be.equal(200);
                        summary.rowsFailedToBeRead.should.be.equal(0);
                        summary.timeElapsed.should.be.greaterThanOrEqual(0);
                    } catch (err) {
                        done(err);
                    }
                })
            }),
            function (err, arr) {
                if (err) {
                    done(err);
                }
                arr.forEach(item => item.forEach(value => {
                    if (value.document) {
                        result.push(value.document.value);
                    }
                }));
                verifyDocs(done);
            });
    });

    it('queryAll should throw error batchSize greater than 100000', function (done) {
        try {
            dbWriter.rows.queryAll(planFromBuilderTemplate, {
                batchSize: 1000000
            });
        } catch (err) {
            err.toString().should.equal('Error: batchSize cannot be greater than 100000 or less than 1');
            done();
        }
    });

    it('queryAll should throw error invalid value for multipleOf', function (done) {
        try {
            dbWriter.rows.queryAll(planFromBuilderTemplate, {
                concurrentRequests: {
                    multipleOf: 'invalid'
                }
            });
        } catch (err) {
            err.toString().should.equal('Error: Invalid value for multipleOf. Value must be forests or hosts.');
            done();
        }
    });

    it('queryAll should throw error invalid value for multiplier', function (done) {
        try {
            dbWriter.rows.queryAll(planFromBuilderTemplate, {
                concurrentRequests: {
                    multiplier: -3
                }
            });
        } catch (err) {
            err.toString().should.equal('Error: concurrentRequests.multiplier cannot be less than one');
            done();
        }
    });

    it('queryAll should throw error invalid value for outputStreamType', function (done) {
        try {
            dbWriter.rows.queryAll(planFromBuilderTemplate, {
                outputStreamType: 'invalid'
            });
        } catch (err) {
            err.toString().should.equal('Error: Invalid value for outputStreamType. Value must be chunked, object or sequence.');
            done();
        }
    });

    it('queryAll should throw error invalid value for columnTypes', function (done) {
        try {
            dbWriter.rows.queryAll(planFromBuilderTemplate, {
                columnTypes: 'invalid'
            });
        } catch (err) {
            err.toString().should.equal('Error: Invalid value for columnTypes. Value must be rows or header.');
            done();
        }
    });

    it('queryAll should throw error invalid value for rowStructure', function (done) {
        try {
            dbWriter.rows.queryAll(planFromBuilderTemplate, {
                rowStructure: 'invalid'
            });
        } catch (err) {
            err.toString().should.equal('Error: Invalid value for rowStructure. Value must be object or array.');
            done();
        }
    });

    it('queryAll should throw error invalid value for rowFormat', function (done) {
        try {
            dbWriter.rows.queryAll(planFromBuilderTemplate, {
                rowFormat: 'invalid'
            });
        } catch (err) {
            err.toString().should.equal('Error: Invalid value for rowFormat. Value must be json, xml or csv.');
            done();
        }
    });

    it('queryAll should throw error invalid type for queryType', function (done) {
        try {
            dbWriter.rows.queryAll(planFromBuilderTemplate, {
                queryType: 34
            });
        } catch (err) {
            err.toString().should.equal('Error: queryType should be set only when batchView is String.');
            done();
        }
    });

    it('queryAll should throw error invalid value for queryType', function (done) {
        try {
            dbWriter.rows.queryAll(planFromBuilderTemplate, {
                queryType: 'invalid'
            });
        } catch (err) {
            err.toString().should.equal('Error: queryType should be set only when batchView is String.');
            done();
        }
    });
});

function verifyDocs(done) {
    result.length.should.equal(200);
    for (let i = 0; i < result.length; i++) {
        uris.has(result[i].toString()).should.equal(true);
    }
    result = [];
    done();
}
