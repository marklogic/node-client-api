/*
 * Copyright (c) 2023 MarkLogic Corporation
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
const should = require('should');
const testconfig = require('../etc/test-config.js');
const marklogic = require('../');
const db = marklogic.createDatabaseClient(testconfig.restWriterConnection);
const Stream = require('stream');
const {first} = require("../lib/mlutil");
const testlib = require("../etc/test-lib");
const op = marklogic.planBuilder;
let removeStream = new Stream.PassThrough({objectMode: true});
let serverVersionGreaterThanEqual11 = false;
describe('optic-update joinDocCols tests', function() {
    before(function (done) {
        testlib.findServerConfiguration().result(function (response) {
            serverVersionGreaterThanEqual11 = (parseInt(response.data['local-cluster-default'].version) >= 11);
            done();
        }).catch(error => done(error));
    });

    describe('optic joinDocCols test ', function () {
        this.timeout(4000);
        before(function (done) {
            if(!serverVersionGreaterThanEqual11){
                this.skip();
            }
            let readable = new Stream.Readable({objectMode: true});
            removeStream = new Stream.PassThrough({objectMode: true});
            const musician = {
                uri: '/test/optic/joinDocCols/musician1.json',
                contentType: 'application/xml',
                content: {musician: {firstName: "Luis", lastName: "Armstrong", "dob": "1901-08-04"}}
            };
            readable.push(musician);
            removeStream.push(musician.uri);

            readable.push(null);
            removeStream.push(null);

            db.documents.writeAll(readable, {
                onCompletion: ((summary) => {
                    done();
                })
            });
        });

        after(function (done) {
            db.documents.remove("/test/optic/joinDocCols/musician1.json")
                .result(function (response) {
                    done();
                })
                .catch(err => done(err))
                .catch(done);
        });

        it('test default columns with no qualifier', function (done) {
            try {
                const plan = op.fromDocUris(op.cts.directoryQuery("/test/optic/joinDocCols/"))
                    .joinDocCols(null, op.col("uri"))
                    .orderBy(op.col("uri"));
                db.rows.query(plan).then(res => {
                    try {
                        const firstRow = res.rows[0];
                        firstRow.quality.value.should.equal(0);
                        firstRow.uri.value.should.equal("/test/optic/joinDocCols/musician1.json");
                        firstRow.hasOwnProperty('metadata').should.equal(true);
                        firstRow.hasOwnProperty('permissions').should.equal(true);
                        firstRow.hasOwnProperty('collections').should.equal(true);
                        firstRow.hasOwnProperty('doc').should.equal(true);
                        firstRow.doc.value.should.deepEqual({
                            "musician": {
                                "firstName": "Luis",
                                "lastName": "Armstrong",
                                "dob": "1901-08-04"
                            }
                        });
                        done();
                    } catch (e) {
                        done(e);
                    }
                }).catch(e => done(e));
            } catch (e) {
                done(e);
            }
        });

        it('test default columns with target qualifier', function (done) {
            try {
                const plan = op.fromDocUris(op.cts.directoryQuery("/test/optic/joinDocCols/"))
                    .joinDocCols(op.docCols("target"), op.col("uri"))
                    .orderBy(op.viewCol("target", "uri"));
                db.rows.query(plan).then(res => {
                    try {
                        const firstRow = res.rows[0];
                        firstRow['target.quality'].value.should.equal(0);
                        firstRow['target.uri'].value.should.equal('/test/optic/joinDocCols/musician1.json');
                        firstRow.uri.value.should.equal("/test/optic/joinDocCols/musician1.json");
                        firstRow.hasOwnProperty('target.metadata').should.equal(true);
                        firstRow.hasOwnProperty('target.permissions').should.equal(true);
                        firstRow.hasOwnProperty('target.collections').should.equal(true);
                        firstRow.hasOwnProperty('target.doc').should.equal(true);
                        firstRow['target.doc'].value.should.deepEqual({
                            "musician": {
                                "firstName": "Luis",
                                "lastName": "Armstrong",
                                "dob": "1901-08-04"
                            }
                        });
                        done();
                    } catch (e) {
                        done(e);
                    }
                }).catch(e => done(e));
            } catch (e) {
                done(e);
            }
        });

        it('test default columns with source and target qualifier', function (done) {
            try {
                const plan = op.fromDocUris(op.cts.directoryQuery("/test/optic/joinDocCols/"), "source")
                    .joinDocCols(op.docCols("target"), op.viewCol("source", "uri"))
                    .orderBy(op.viewCol("source", "uri"));
                db.rows.query(plan).then(res => {
                    try {
                        const firstRow = res.rows[0];
                        firstRow['target.quality'].value.should.equal(0);
                        firstRow['target.uri'].value.should.equal('/test/optic/joinDocCols/musician1.json');
                        firstRow['source.uri'].value.should.equal("/test/optic/joinDocCols/musician1.json");
                        firstRow.hasOwnProperty('target.metadata').should.equal(true);
                        firstRow.hasOwnProperty('target.permissions').should.equal(true);
                        firstRow.hasOwnProperty('target.collections').should.equal(true);
                        firstRow.hasOwnProperty('target.doc').should.equal(true);
                        firstRow['target.doc'].value.should.deepEqual({
                            "musician": {
                                "firstName": "Luis",
                                "lastName": "Armstrong",
                                "dob": "1901-08-04"
                            }
                        });
                        done();
                    } catch (e) {
                        done(e);
                    }
                }).catch(e => done(e));
            } catch (e) {
                done(e);
            }
        });

        it('test column subset with no qualifier', function (done) {
            try {
                const plan = op.fromDocUris(op.cts.directoryQuery("/test/optic/joinDocCols/"))
                    .joinDocCols(op.docCols(null, op.xs.string("doc")), op.col("uri"))
                    .orderBy(op.col("uri"));
                db.rows.query(plan).then(res => {
                    try {
                        const firstRow = res.rows[0];
                        firstRow.uri.value.should.equal("/test/optic/joinDocCols/musician1.json");
                        firstRow.hasOwnProperty('doc').should.equal(true);
                        firstRow.doc.value.should.deepEqual({
                            "musician": {
                                "firstName": "Luis",
                                "lastName": "Armstrong",
                                "dob": "1901-08-04"
                            }
                        });
                        done();
                    } catch (e) {
                        done(e);
                    }
                }).catch(e => done(e));
            } catch (e) {
                done(e);
            }
        });

        it('test column subset with target qualifier', function (done) {
            try {
                const plan = op.fromDocUris(op.cts.directoryQuery("/test/optic/joinDocCols/"))
                    .joinDocCols(op.docCols(op.xs.string("target"), op.xs.string("uri")), op.col("uri"))
                    .orderBy(op.viewCol("target", "uri"));
                db.rows.query(plan).then(res => {
                    try {
                        const firstRow = res.rows[0];
                        firstRow.uri.value.should.equal("/test/optic/joinDocCols/musician1.json");
                        firstRow['target.uri'].value.should.equal("/test/optic/joinDocCols/musician1.json");
                        done();
                    } catch (e) {
                        done(e);
                    }
                }).catch(e => done(e));
            } catch (e) {
                done(e);
            }
        });

        it('test column subset with source and target qualifier', function (done) {
            try {
                const plan = op.fromDocUris(op.cts.directoryQuery("/test/optic/joinDocCols/"), "source")
                    .joinDocCols(op.docCols(op.xs.string("target"), op.xs.string("uri")), op.viewCol("source", "uri"))
                    .orderBy(op.viewCol("target", "uri"));
                db.rows.query(plan).then(res => {
                    try {
                        const firstRow = res.rows[0];
                        firstRow['source.uri'].value.should.equal("/test/optic/joinDocCols/musician1.json");
                        firstRow['target.uri'].value.should.equal("/test/optic/joinDocCols/musician1.json");
                        done();
                    } catch (e) {
                        done(e);
                    }
                }).catch(e => done(e));
            } catch (e) {
                done(e);
            }
        });

        it('test custom columns', function (done) {
            const plan = op.fromDocUris(op.cts.directoryQuery("/test/optic/joinDocCols/"))
                .joinDocCols({doc: 'doc2', quality: 'myQuality'}, op.col('uri'))
                .orderBy(op.col("uri"));
            db.rows.query(plan).then(res => {
                try {
                    const firstRow = res.rows[0];
                    firstRow.myQuality.value.should.equal(0);
                    firstRow.uri.value.should.equal("/test/optic/joinDocCols/musician1.json");
                    firstRow.hasOwnProperty('doc2').should.equal(true);
                    firstRow.doc2.value.should.deepEqual({
                        "musician": {
                            "firstName": "Luis",
                            "lastName": "Armstrong",
                            "dob": "1901-08-04"
                        }
                    });
                    done();
                } catch (e) {
                    done(e);
                }
            }).catch(e => done(e));
        });
    });
});