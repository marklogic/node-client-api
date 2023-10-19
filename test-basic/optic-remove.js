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
const testlib = require("../etc/test-lib");
const op = marklogic.planBuilder;
const dbAdmin = marklogic.createDatabaseClient(testconfig.restAdminConnection);
let removeStream = new Stream.PassThrough({objectMode: true});
let uris = [];
let serverConfiguration = {};
describe('optic-update remove tests', function() {
    this.timeout(6000);
    before(function (done) {
        try {
            testlib.findServerConfiguration(serverConfiguration);
            setTimeout(()=>{done();}, 3000);
        } catch(error){
            done(error);
        }
    });

    describe('optic remove function ', function () {

        before(function (done) {
            if(serverConfiguration.serverVersion < 11){
                this.skip();
            }
            let readable = new Stream.Readable({objectMode: true});
            removeStream = new Stream.PassThrough({objectMode: true});
            uris = [];
            for (let i = 1; i < 4; i++) {
                const temp = {
                    uri: '/test/optic/remove/doc' + i + '.xml',
                    contentType: 'application/xml',
                    content: "<doc>1</doc>"
                };
                readable.push(temp);
                removeStream.push(temp.uri);
                uris.push(temp.uri);
            }
            readable.push(null);
            removeStream.push(null);

            db.documents.writeAll(readable, {
                onCompletion: ((summary) => {
                    done();
                })
            });

        });

        it('test remove 1 of three documents', function (done) {
            try {
                db.rows.execute(op.fromDocUris("/test/optic/remove/doc1.xml").remove());
                setTimeout(function () {
                    verifyOneDocDeleted(done);
                }, 3000);
            } catch (e) {
                done(e);
            }
        });

        it('test with uri column specified', function (done) {
            try {
                db.rows.execute(op.fromDocUris("/test/optic/remove/doc1.xml").remove(op.col('uri')));
                setTimeout(function () {
                    verifyOneDocDeleted(done);
                }, 3000);
            } catch (e) {
                done(e);
            }
        });

        it('test with multiple qualified uri columns', function (done) {
            try {
                const plan = op.fromDocUris(op.cts.documentQuery(op.xs.string("/test/optic/remove/doc1.xml")), "view1")
                    .joinLeftOuter(
                        op.fromDocUris(op.cts.documentQuery(op.xs.string("/test/optic/remove/doc1.xml")), "view2"),
                        op.on(
                            op.viewCol("view1", "uri"),
                            op.viewCol("view2", "uri")
                        )
                    )
                    .remove(op.viewCol("view1", "uri"));
                db.rows.execute(plan);
                setTimeout(function () {
                    verifyOneDocDeleted(done);
                }, 3000);
            } catch (e) {
                done(e);
            }
        });

        it('test with custom uri column', function (done) {
            try {
                const rows = [{uriNew: '/test/optic/remove/doc1.xml'}];
                const outputCols = {"column": "uriNew", "type": "string", "nullable": false};

                const planBuilderTemplate = op.fromParam('bindingParam', null, outputCols).remove(op.col("uriNew"));
                const temp = {bindingParam: rows};
                db.rows.query(planBuilderTemplate, null, temp).then(res => {
                    try {
                        verifyOneDocDeleted(done);
                    } catch (e) {
                        done(e);
                    }
                }).catch(e => {
                    done(e);
                });
            } catch (e) {
                done(e);
            }
        });

        it('test with from param with qualified uri column', function (done) {
            try {
                const rows = [{uri: '/test/optic/remove/doc1.xml'}, {uri: '/test/optic/remove/doc2.xml'}];
                const outputCols = {"column": "uri", "type": "string", "nullable": false};

                const planBuilderTemplate = op.fromParam('bindingParam', "myQualifier", outputCols).remove(op.viewCol("myQualifier", "uri"));
                const temp = {bindingParam: rows};
                db.rows.query(planBuilderTemplate, null, temp).then(res => {
                    try {
                        verifyTwoDocsDeleted(done);
                    } catch (e) {
                        done(e);
                    }
                }).catch(e => {
                    done(e);
                });
            } catch (e) {
                done(e);
            }
        });

        it('test remove temporal ', function (done) {
            const uri = "/test/optic/remove/temporalRemove.json";
            const tempCollection = 'temporalCollection';
            try {
                const docsDescriptor = [
                    {
                        uri: uri,
                        doc: {
                            systemStartTime: '2015-01-01T00:00:00',
                            systemEndTime: '2023-04-26T13:27:59.1843362Z',
                            validStartTime: '2015-01-01T00:00:00',
                            validEndTime: '2017-01-01T00:00:00'
                        },
                        temporalCollection: tempCollection
                    },
                ];

                db.rows.query(op.fromDocDescriptors(docsDescriptor).write(op.docCols(null, ["uri", "doc", "temporalCollection", "permissions"]))).then(res => {
                    checkTemporalDoc(uri, tempCollection, true, done);
                });
                setTimeout(() => {
                    const plan = op.fromDocUris(uri).bind(op.as(op.col("tempColl"), op.xs.string(tempCollection))).remove({
                        temporalCollection: op.col("tempColl"),
                        uri: op.col('uri')
                    });
                    dbAdmin.rows.query(plan)
                        .then(res => {
                            checkTemporalDoc(uri, tempCollection, false, done);
                        })
                        .catch(e => done(e));

                }, 3000);
            } catch (e) {
                done(e);
            }
        });

    });
});

function checkTemporalDoc(uri, tempCollection, includesLatestCollection, done) {
    db.documents.read({uris: uri, categories: ['metadata']})
        .result(function (documents) {
            try {
                const checkLatestCollection = documents[0].collections.includes('latest');
                const checkTemporalCollection = documents[0].collections.includes(tempCollection);
                checkLatestCollection.should.equal(includesLatestCollection);
                checkTemporalCollection.should.equal(true);
                if(!includesLatestCollection) {
                    done();
                }
            } catch (e) {
                done(e);
            }
        });
}

function verifyOneDocDeleted(done) {
    try {
        db.documents.read(uris)
            .result(function (documents) {
                try {
                    documents.length.should.equal(2);
                    documents[0].uri.should.equal('/test/optic/remove/doc2.xml');
                    documents[1].uri.should.equal('/test/optic/remove/doc3.xml');
                } catch (e) {
                    done(e);
                }

            })
            .then(() => done());
    } catch (e) {
        done(e);
    }
}

function verifyTwoDocsDeleted(done) {
    try {
        db.documents.read(uris)
            .result(function (documents) {
                try {
                    documents.length.should.equal(1);
                    documents[0].uri.should.equal('/test/optic/remove/doc3.xml');
                } catch (e) {
                    done(e);
                }
            })
            .then(() => done());
    } catch (e) {
        done(e);
    }
}