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
const db = marklogic.createDatabaseClient(testconfig.restAdminConnection);
const op = marklogic.planBuilder;
const dbWriter = marklogic.createDatabaseClient(testconfig.restWriterConnection);

describe('optic write function', function () {
    this.timeout(20000);

    beforeEach(function (done) {
        let usedUris = ['/test/fromDocDescriptors/data1.json', '/test/fromDocDescriptors/data2.json', '/test/fromDocDescriptors/data3.json'];
        dbWriter.documents.remove(usedUris)
            .result(function () {
                done();
            })
            .catch(err => done(err))
            .catch(done);
    });

    it('test with multiple objects without parameters', function (done) {
        const docsDescriptor = [
            {uri: '/test/fromDocDescriptors/data1.json', doc: {"desc": "doc1"}},
            {uri: '/test/fromDocDescriptors/data2.json', doc: {"desc": "doc2"}, collections: ['write']},
            {
                uri: '/test/fromDocDescriptors/data3.json',
                doc: {"desc": "doc3"},
                collections: ['write', 'doc3'],
                metadata: {'operation': 'doc3'}
            }
        ];

        try {
            db.rows.execute(op.fromDocDescriptors(docsDescriptor).write());
            setTimeout(() => {
                readDocs(['/test/fromDocDescriptors/data1.json', '/test/fromDocDescriptors/data2.json', '/test/fromDocDescriptors/data3.json'], done).then(res => {
                    try {
                        const firstDoc = res[0];
                        firstDoc.collections.length.should.equal(0);
                        firstDoc.uri.should.equal("/test/fromDocDescriptors/data1.json");
                        firstDoc.content.desc.should.equal("doc1");
                        const secondDoc = res[1];
                        secondDoc.collections.length.should.equal(1);
                        secondDoc.collections[0].should.equal("write");
                        secondDoc.uri.should.equal("/test/fromDocDescriptors/data2.json");
                        secondDoc.content.desc.should.equal("doc2");
                        const thirdDoc = res[2];
                        thirdDoc.collections.length.should.equal(2);
                        thirdDoc.collections[0].should.equal("write");
                        thirdDoc.collections[1].should.equal("doc3");
                        thirdDoc.uri.should.equal("/test/fromDocDescriptors/data3.json");
                        thirdDoc.content.desc.should.equal("doc3");
                        thirdDoc.metadataValues.operation.should.equal("doc3");
                        done();
                    } catch (e) {
                        done(e);
                    }
                });
            }, 2000);
        } catch (e) {
            done(e);
        }
    });

    it('test with multiple objects with one wrong parameter', function (done) {
        const docsDescriptor = [
            {uri: '/test/fromDocDescriptors/data1.json', doc: {"desc": "doc1"}},
            {uri: '/test/fromDocDescriptors/data2.json', doc: {"desc": "doc2"}, collections: ['write']},
            {
                uri: '/test/fromDocDescriptors/data3.json',
                doc: {"desc": "doc3"},
                collections: ['write', 'doc3'],
                metadata: {'operation': 'doc3'}
            }
        ];

        try {
            db.rows.execute(op.fromDocDescriptors(docsDescriptor).write(1));
        } catch (e) {
            e.toString().includes('Error: doc-cols argument at 0 of PlanModifyPlan.write() must be a PlanDocColsIdentifier value');
            done();
        }
    });

    it('test with multiple objects with two parameters', function (done) {
        const docsDescriptor = [
            {uri: '/test/fromDocDescriptors/data1.json', doc: {"desc": "doc1"}},
            {uri: '/test/fromDocDescriptors/data2.json', doc: {"desc": "doc2"}, collections: ['write']},
            {
                uri: '/test/fromDocDescriptors/data3.json',
                doc: {"desc": "doc3"},
                collections: ['write', 'doc3'],
                metadata: {'operation': 'doc3'}
            }
        ];

        try {
            db.rows.execute(op.fromDocDescriptors(docsDescriptor).write(1, null));
        } catch (e) {
            e.toString().includes('Error: PlanModifyPlan.write takes a maximum of 1 arguments but received: 2');
            done();
        }
    });

    it('test with single object without parameters', function (done) {
        const docsDescriptor = {uri: '/test/fromDocDescriptors/data1.json', doc: {"desc": "doc1"}};
        try {
            db.rows.execute(op.fromDocDescriptors(docsDescriptor).write());
            setTimeout(() => {
                readDocs(['/test/fromDocDescriptors/data1.json', '/test/fromDocDescriptors/data2.json', '/test/fromDocDescriptors/data3.json'], done).then(res => {
                    try {
                        const doc = res[0];
                        doc.collections.length.should.equal(0);
                        doc.uri.should.equal("/test/fromDocDescriptors/data1.json");
                        doc.content.desc.should.equal("doc1");
                        done();
                    } catch (e) {
                        done(e);
                    }
                });
            }, 2000);
        } catch (e) {
            done(e);
        }
    });

    it('test with multiple objects and non-existing columns to write, ignored', function (done) {
        const docsDescriptor = [
            {uri: '/test/fromDocDescriptors/data1.json', doc: {"desc": "doc1"}},
            {uri: '/test/fromDocDescriptors/data2.json', doc: {"desc": "doc2"}, collections: ['write']},
            {
                uri: '/test/fromDocDescriptors/data3.json',
                doc: {"desc": "doc3"},
                collections: ['write', 'doc3'],
                metadata: {'operation': 'doc3'}
            }
        ];

        try {
            db.rows.execute(op.fromDocDescriptors(docsDescriptor).write(
                {uri:'uri', doc:'doc', collections:'collections1', metadata:'metadata1', permissions:'permissions1', quality:'quality1'}
            ));
            setTimeout(() => {
                readDocs(['/test/fromDocDescriptors/data1.json', '/test/fromDocDescriptors/data2.json', '/test/fromDocDescriptors/data3.json'], done).then(res => {
                    try {
                        const firstDoc = res[0];
                        firstDoc.collections.length.should.equal(0);
                        firstDoc.uri.should.equal("/test/fromDocDescriptors/data1.json");
                        firstDoc.content.desc.should.equal("doc1");
                        const secondDoc = res[1];
                        secondDoc.collections.length.should.equal(0);
                        secondDoc.uri.should.equal("/test/fromDocDescriptors/data2.json");
                        secondDoc.content.desc.should.equal("doc2");
                        const thirdDoc = res[2];
                        thirdDoc.collections.length.should.equal(0);
                        thirdDoc.uri.should.equal("/test/fromDocDescriptors/data3.json");
                        thirdDoc.content.desc.should.equal("doc3");
                        done();
                    } catch (e) {
                        done(e);
                    }
                });
            }, 2000);
        } catch (e) {
            done(e);
        }
    });

    it('test with multiple objects and doc column as uri column, docs are not written', function (done) {
        const docsDescriptor = [
            {uri: '/test/fromDocDescriptors/data1.json', doc: {"desc": "doc1"}},
            {uri: '/test/fromDocDescriptors/data2.json', doc: {"desc": "doc2"}, collections: ['write']},
            {
                uri: '/test/fromDocDescriptors/data3.json',
                doc: {"desc": "doc3"},
                collections: ['write', 'doc3'],
                metadata: {'operation': 'doc3'}
            }
        ];

        try {
            db.rows.execute(op.fromDocDescriptors(docsDescriptor).write({uri:'doc', doc:'doc', collections:'collections1', metadata:'metadata1', permissions:'permissions1', quality:'quality1'}));
            setTimeout(() => {
                readDocs(['/test/fromDocDescriptors/data1.json', '/test/fromDocDescriptors/data2.json', '/test/fromDocDescriptors/data3.json'], done).then(res => {
                    try {
                        res.length.should.equal(0);
                        done();
                    } catch (e) {
                        done(e);
                    }
                });
            }, 2000);
        } catch (e) {
            done(e);
        }
    });

    it('test with multiple objects and unknown document descriptor to write, expecting an exception, docs are not written', function (done) {
        const docsDescriptor = [
            {uri: '/test/fromDocDescriptors/data1.json', doc: {"desc": "doc1"}},
            {uri: '/test/fromDocDescriptors/data2.json', doc: {"desc": "doc2"}, collections: ['write']},
            {
                uri: '/test/fromDocDescriptors/data3.json',
                doc: {"desc": "doc3"},
                collections: ['write', 'doc3'],
                metadata: {'operation': 'doc3'}
            }
        ];
        try {
            db.rows.execute(op.fromDocDescriptors(docsDescriptor).write({uri:'uri', doc:'doc', collections:'collections', metadata:'metadata1', permissions:'permissions1', quality:'quality1', describe: "this is a test"}));

        } catch (e) {
            e.toString().includes('Error: doc-cols argument at 0 of PlanModifyPlan.write() - unknown document descriptor found: describe');
            done();
        }
    });

    it('test with multiple objects and docCols as parameter', function (done) {
        const docsDescriptor = [
            {uri: '/test/fromDocDescriptors/data1.json', doc: {"desc": "doc1"}},
            {uri: '/test/fromDocDescriptors/data2.json', doc: {"desc": "doc2"}, collections: ['write']},
            {
                uri: '/test/fromDocDescriptors/data3.json',
                doc: {"desc": "doc3"},
                collections: ['write', 'doc3'],
                metadata: {'operation': 'doc3'}
            }
        ];

        try {
            db.rows.execute(op.fromDocDescriptors(docsDescriptor).write(op.docCols()));
            setTimeout(() => {
                readDocs(['/test/fromDocDescriptors/data1.json', '/test/fromDocDescriptors/data2.json', '/test/fromDocDescriptors/data3.json'], done).then(res => {
                    try {
                        const firstDoc = res[0];
                        firstDoc.collections.length.should.equal(0);
                        firstDoc.uri.should.equal("/test/fromDocDescriptors/data1.json");
                        firstDoc.content.desc.should.equal("doc1");
                        const secondDoc = res[1];
                        secondDoc.collections.length.should.equal(1);
                        secondDoc.collections[0].should.equal("write");
                        secondDoc.uri.should.equal("/test/fromDocDescriptors/data2.json");
                        secondDoc.content.desc.should.equal("doc2");
                        const thirdDoc = res[2];
                        thirdDoc.collections.length.should.equal(2);
                        thirdDoc.collections[0].should.equal("write");
                        thirdDoc.collections[1].should.equal("doc3");
                        thirdDoc.uri.should.equal("/test/fromDocDescriptors/data3.json");
                        thirdDoc.content.desc.should.equal("doc3");
                        thirdDoc.metadataValues.operation.should.equal("doc3");
                        done();
                    } catch (e) {
                        done(e);
                    }
                });
            }, 2000);
        } catch (e) {
            done(e);
        }
    });

    it('test with multiple objects and object as parameter', function (done) {
        const docsDescriptor = [
            {uri: '/test/fromDocDescriptors/data1.json', doc: {"desc": "doc1"}},
            {uri: '/test/fromDocDescriptors/data2.json', doc: {"desc": "doc2"}, collections: ['write']},
            {
                uri: '/test/fromDocDescriptors/data3.json',
                doc: {"desc": "doc3"},
                collections: ['write', 'doc3'],
                metadata: {'operation': 'doc3'}
            }
        ];

        try {
            db.rows.execute(op.fromDocDescriptors(docsDescriptor).write({uri:'uri', doc:'doc', collections:'collections', metadata:'metadata', permissions:'permissions', quality:'quality'}));
            setTimeout(() => {
                readDocs(['/test/fromDocDescriptors/data1.json', '/test/fromDocDescriptors/data2.json', '/test/fromDocDescriptors/data3.json'], done).then(res => {
                    try {
                        const firstDoc = res[0];
                        firstDoc.collections.length.should.equal(0);
                        firstDoc.uri.should.equal("/test/fromDocDescriptors/data1.json");
                        firstDoc.content.desc.should.equal("doc1");
                        const secondDoc = res[1];
                        secondDoc.collections.length.should.equal(1);
                        secondDoc.collections[0].should.equal("write");
                        secondDoc.uri.should.equal("/test/fromDocDescriptors/data2.json");
                        secondDoc.content.desc.should.equal("doc2");
                        const thirdDoc = res[2];
                        thirdDoc.collections.length.should.equal(2);
                        thirdDoc.collections[0].should.equal("write");
                        thirdDoc.collections[1].should.equal("doc3");
                        thirdDoc.uri.should.equal("/test/fromDocDescriptors/data3.json");
                        thirdDoc.content.desc.should.equal("doc3");
                        thirdDoc.metadataValues.operation.should.equal("doc3");
                        done();
                    } catch (e) {
                        done(e);
                    }
                });
            }, 2000);
        } catch (e) {
            done(e);
        }
    });

    it('test with multiple objects and updating op.docCols', function (done) {
        const docsDescriptor = [
            {uri: '/test/fromDocDescriptors/data1.json', doc: {"desc": "doc1"}},
            {uri: '/test/fromDocDescriptors/data2.json', doc: {"desc": "doc2"}, collections: ['write']},
            {
                uri: '/test/fromDocDescriptors/data3.json',
                doc: {"desc": "doc3"},
                collections: ['write', 'doc3'],
                metadata: {'operation': 'doc3'}
            }
        ];

        try {
            db.rows.execute(op.fromDocDescriptors(docsDescriptor, 'view').write(op.docCols('view')));
            setTimeout(() => {
                readDocs(['/test/fromDocDescriptors/data1.json', '/test/fromDocDescriptors/data2.json', '/test/fromDocDescriptors/data3.json'], done).then(res => {
                    console.log(JSON.stringify(res));
                    try {
                        const firstDoc = res[0];
                        firstDoc.collections.length.should.equal(0);
                        firstDoc.uri.should.equal("/test/fromDocDescriptors/data1.json");
                        firstDoc.content.desc.should.equal("doc1");
                        const secondDoc = res[1];
                        secondDoc.collections.length.should.equal(1);
                        secondDoc.collections[0].should.equal("write");
                        secondDoc.uri.should.equal("/test/fromDocDescriptors/data2.json");
                        secondDoc.content.desc.should.equal("doc2");
                        const thirdDoc = res[2];
                        thirdDoc.collections.length.should.equal(2);
                        thirdDoc.collections[0].should.equal("write");
                        thirdDoc.collections[1].should.equal("doc3");
                        thirdDoc.uri.should.equal("/test/fromDocDescriptors/data3.json");
                        thirdDoc.content.desc.should.equal("doc3");
                        thirdDoc.metadataValues.operation.should.equal("doc3");
                        done();
                    } catch (e) {
                        done(e);
                    }
                });
            }, 2000);
        } catch (e) {
            done(e);
        }
    });

    it('test with all identifiers', function (done) {
        const docsDescriptor = {
            uri: '/test/fromDocDescriptors/data1.json',
            doc: {"desc": "doc2"},
            collections: ['fromDocDescriptors'],
            permissions: [{"role-name": 'rest-reader', capabilities: ['read', 'update']}, {"role-name": 'rest-writer', capabilities: ['read', 'update']}],
            metadata: {'meta': 'value1'},
            quality: 1,
        };
        db.rows.query(op.fromDocDescriptors(docsDescriptor).write(op.docCols())).then(res => {
            try {
                const rows = res.rows;
                rows[0].collections.value.should.equal("fromDocDescriptors");
                rows[0].doc.value.desc.should.equal("doc2");
                rows[0].metadata.value.meta.should.equal("value1");
                rows[0].permissions.value["role-name"].should.equal("app-user");
                rows[0].permissions.value.capabilities.should.equal("read");
                rows[0].quality.value.should.equal(1);
                rows[0].uri.value.should.equal("/test/fromDocDescriptors/data1.json");
                done();
            } catch (e) {
                done(e);
            }
        }).catch(e => done(e));

    });

    it('test with xml files', function (done) {
        const docsDescriptor = [
            {uri: '/test/fromDocDescriptors/data1.xml', doc: "<desc>doc1</desc>"},
            {uri: '/test/fromDocDescriptors/data2.xml', doc: "<desc>doc2</desc>", collections: ['write']},
            {
                uri: '/test/fromDocDescriptors/data3.xml',
                doc: "<desc>doc3</desc>",
                collections: ['write', 'doc3'],
                metadata: {'operation': 'doc3'}
            }
        ];

        try {
            db.rows.execute(op.fromDocDescriptors(docsDescriptor, 'view').write(op.docCols('view')));
            setTimeout(() => {
                readDocs(['/test/fromDocDescriptors/data1.xml', '/test/fromDocDescriptors/data2.xml', '/test/fromDocDescriptors/data3.xml'], done).then(res => {
                    try {
                        const firstDoc = res[0];
                        firstDoc.collections.length.should.equal(0);
                        firstDoc.uri.should.equal("/test/fromDocDescriptors/data1.xml");
                        firstDoc.content.should.equal("<desc>doc1</desc>");
                        const secondDoc = res[1];
                        secondDoc.collections.length.should.equal(2);
                        secondDoc.collections[0].should.equal("write");
                        secondDoc.collections[1].should.equal("doc3");
                        secondDoc.uri.should.equal("/test/fromDocDescriptors/data3.xml");
                        secondDoc.content.should.equal("<desc>doc3</desc>");
                        secondDoc.metadataValues.operation.should.equal("doc3");
                        const thirdDoc = res[2];
                        thirdDoc.collections.length.should.equal(1);
                        thirdDoc.collections[0].should.equal("write");
                        thirdDoc.uri.should.equal("/test/fromDocDescriptors/data2.xml");
                        thirdDoc.content.should.equal("<desc>doc2</desc>");


                        done();
                    } catch (e) {
                        done(e);
                    }
                });
            }, 2000);
        } catch (e) {
            done(e);
        }
    });

    it('test with bindFromParam with docCols identifier', function (done) {
        const rows = [
            {id:1, quality: 6,  o_uri:'/test/fromDocUris/1.json', uri:'/optic/update/write1.json', collections:['/optic/write', 'newcol'], meta:'dog'},
            {id:2, quality: 7,  o_uri:'/test/fromDocUris/2.json', uri:'/optic/update/write2.json', collections:'/optic/write', meta:'cow'},
            {id:3, quality: 8,  o_uri:'/test/fromDocUris/3.json', uri:'/optic/update/write3.json', collections:'/optic/write', meta:'tiger'}
        ];

        const outputCols = [
            {"column":"id",    "type":"integer", "nullable":false},
            {"column":"quality",   "type":"integer", "nullable":true},
            {"column":"o_uri", "type":"string",  "nullable":false},
            {"column":"uri",   "type":"string",  "nullable":false},
            {"column":"collections",  "type":"none",    "nullable":true},
            {"column":"meta",  "type":"string",  "nullable":true},
        ];
        try {
            const planBuilderTemplate =  op.fromParam('bindingParam',null, outputCols)
                .joinDoc(op.col('doc'), op.col('o_uri'))
                .orderBy('id')
                .bind(op.as('metadata',op.jsonObject([op.prop('meta', op.jsonString(op.col('meta')))])))
                .write(op.docCols());
            const temp = {bindingParam: rows};
            dbWriter.rows.query(planBuilderTemplate, null, temp).catch(e => done(e));
            setTimeout(() => {
                readDocs(['/optic/update/write1.json', '/optic/update/write2.json', '/optic/update/write3.json'], done)
                    .then(res => {
                        try {
                            console.log(res);
                            done();
                        } catch (e) {
                            done(e);
                        }
                    });
            }, 2000);
        } catch (e) {
            done(e);
        }
    });

    it('test with bindFromParam with docCols identifier-2', function (done) {
        const rows = [
            {id:1, quality: 6,  o_uri:'/test/fromDocUris/1.json', uri:'/optic/update/write1.json', collections:['/optic/write', 'newcol'], meta:'dog'},
            {id:2, quality: 7,  o_uri:'/test/fromDocUris/2.json', uri:'/optic/update/write2.json', collections:'/optic/write', meta:'cow'},
            {id:3, quality: 8,  o_uri:'/test/fromDocUris/3.json', uri:'/optic/update/write3.json', collections:'/optic/write', meta:'tiger'}
        ];

        const outputCols = [
            {"column":"id",    "type":"integer", "nullable":false},
            {"column":"quality",   "type":"integer", "nullable":true},
            {"column":"o_uri", "type":"string",  "nullable":false},
            {"column":"uri",   "type":"string",  "nullable":false},
            {"column":"collections",  "type":"none",    "nullable":true},
            {"column":"meta",  "type":"string",  "nullable":true},
        ];
        try {
            const planBuilderTemplate =  op.fromParam('bindingParam',null, outputCols)
                .joinDoc(op.col('doc'), op.col('o_uri'))
                .orderBy('id')
                .bind(op.as('metadata',op.jsonObject([op.prop('meta', op.jsonString(op.col('meta')))])))
                .write(op.docCols());
            const temp = {bindingParam: rows};
            db.rows.query(planBuilderTemplate, null, temp).catch(e => done(e));
            setTimeout(() => {
                readDocs(['/optic/update/write1.json', '/optic/update/write2.json', '/optic/update/write3.json'], done)
                    .then(res => {
                        try {
                            console.log(res);
                            done();
                        } catch (e) {
                            done(e);
                        }
                    });
            }, 2000);
        } catch (e) {
            done(e);
        }
    });
});

function readDocs(uris, done) {
    return dbWriter.documents.read({uris, categories: ['metadata', 'content']})
        .result(function (documents) {
            return documents;
        })
        .catch(done)
        .catch(err => done(err));
}
