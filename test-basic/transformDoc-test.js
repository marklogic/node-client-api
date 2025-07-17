/*
* Copyright © 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/
'use strict';
const should = require('should');
const testconfig = require('../etc/test-config.js');
const marklogic = require('../');
const db = marklogic.createDatabaseClient(testconfig.restWriterConnection);
const Stream = require('stream');
const testlib = require("../etc/test-lib");
const op = marklogic.planBuilder;
let removeStream = new Stream.PassThrough({objectMode: true});
let serverConfiguration = {};
let transformDoc;
let transformDocWithTwoParams;

describe('optic-update transformDoc tests', function() {
    this.timeout(6000);
    before(function (done) {
        try {
            testlib.findServerConfiguration(serverConfiguration);
            setTimeout(()=>{done();}, 3000);
        } catch(error){
            done(error);
        }
    });

    describe('transformDoc test', function () {
        before(function (done) {
            if(serverConfiguration.serverVersion < 11){
                this.skip();
            }
            transformDoc = serverConfiguration.serverVersion < 12?'/optic/test/transformDoc-test.mjs':
                '/optic/test/transformDoc-test-forServerVersion12.mjs';
            transformDocWithTwoParams = serverConfiguration.serverVersion < 12?'/optic/test/transformDoc-test-two-params.mjs':
                '/optic/test/transformDoc-test-two-params-forServerVersion12.mjs';
            let readable = new Stream.Readable({objectMode: true});
            removeStream = new Stream.PassThrough({objectMode: true});
            const musician = {
                uri: '/test/optic/transformDoc/data1.json',
                contentType: 'application/json',
                content: {"animal": "duck"}
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
            if(serverConfiguration.serverVersion < 11){
                done();
            } else {
                db.documents.remove("/test/optic/transformDoc/data1.json")
                    .result(function (response) {
                        done();
                    })
                    .catch(err => done(err))
                    .catch(done);
            }
        });

        it('test mjs transform basic', function (done) {
            try {
                const plan = op.fromDocUris('/test/optic/transformDoc/data1.json')
                    .joinDoc(op.col("doc"), op.col("uri"))
                    .transformDoc('doc', {"path": transformDoc})
                    .orderBy(op.col('uri'));

                db.rows.query(plan).then(res => {
                    const row = res.rows[0];
                    row.uri.value.should.containEql("/test/optic/transformDoc/data1.json");
                    row.doc.value.should.deepEqual({hello: 'world', theDoc: {animal: 'duck'}});
                    done();
                }).catch(e => done(e));
            } catch (e) {
                done(e);
            }
        });

        it('test mjs transform without param', function (done) {
            try {
                const plan = op.fromDocUris('/test/optic/transformDoc/data1.json')
                    .joinDoc(op.col("doc"), op.col("uri"))
                    .transformDoc('doc', {"path": transformDoc, kind: "mjs"})
                    .orderBy(op.col('uri'));

                db.rows.query(plan).then(res => {
                    const row = res.rows[0];
                    row.uri.value.should.containEql("/test/optic/transformDoc/data1.json");
                    row.doc.value.should.deepEqual({hello: 'world', theDoc: {animal: 'duck'}});
                    done();
                }).catch(e => done(e));
            } catch (e) {
                done(e);
            }
        });

        it('test mjs transform with param', function (done) {
            try {
                const plan = op.fromDocUris('/test/optic/transformDoc/data1.json')
                    .joinDoc(op.col("doc"), op.col("uri"))
                    .transformDoc('doc', {
                        "path": transformDoc,
                        kind: "mjs",
                        params: {myParam: 'my new content'}
                    })
                    .orderBy(op.col('uri'));

                db.rows.query(plan).then(res => {
                    const row = res.rows[0];
                    row.uri.value.should.containEql("/test/optic/transformDoc/data1.json");
                    row.doc.value.should.deepEqual({
                        hello: 'world',
                        yourParam: 'my new content',
                        theDoc: {animal: 'duck'}
                    });
                    done();
                }).catch(e => done(e));
            } catch (e) {
                done(e);
            }
        });

        it('test mjs transform with wrong param name', function (done) {
            try {
                const plan = op.fromDocUris('/test/optic/transformDoc/data1.json')
                    .joinDoc(op.col("doc"), op.col("uri"))
                    .transformDoc('doc', {
                        "path": transformDoc,
                        kind: "mjs",
                        params: {wrongParamName: 'my new content'}
                    })
                    .orderBy(op.col('uri'));

                db.rows.query(plan).then(res => {
                    const row = res.rows[0];
                    row.uri.value.should.containEql("/test/optic/transformDoc/data1.json");
                    row.doc.value.should.deepEqual({
                        hello: 'world',
                        theDoc: {animal: 'duck'}
                    });
                    done();
                }).catch(e => done(e));
            } catch (e) {
                done(e);
            }
        });

        it('test transform with fromDocDescriptors a null value should return null', function (done) {
            try {
                const docsDescriptor = [
                    {
                        uri: '/optic/update/write7.json',
                        collections: ['write', 'write7'],
                        metadata: {operation: 'write7'},
                        permissions: [{'role-name': 'rest-reader', capabilities: ['read']}, {
                            'role-name': 'rest-writer',
                            capabilities: ['update']
                        }],
                        quality: 7
                    },
                    {
                        uri: '/optic/update/write8.json',
                        doc: {"desc": "write8"},
                        collections: ['write', 'write8'],
                        metadata: [{'operation': 'write8'}],
                        permissions: [{'role-name': 'rest-reader', capabilities: ['read']}, {
                            'role-name': 'rest-writer',
                            capabilities: ['update']
                        }],
                        quality: 8
                    },
                ];
                const plan = op.fromDocDescriptors(docsDescriptor)
                    .transformDoc('doc', {
                        "path": transformDoc,
                        kind: "mjs",
                        params: {myParam: 'my new content'}
                    })
                    .orderBy(op.col('uri'));

                db.rows.query(plan).then(res => {
                    const firstDoc = res.rows[0];
                    firstDoc.uri.value.should.containEql("/optic/update/write7.json");
                    firstDoc.doc.value.should.deepEqual({hello: 'world', yourParam: 'my new content', theDoc: null});
                    const secondDoc = res.rows[1];
                    secondDoc.uri.value.should.containEql("/optic/update/write8.json");
                    secondDoc.doc.value.should.deepEqual({
                        hello: 'world',
                        yourParam: 'my new content',
                        theDoc: {desc: 'write8'}
                    });
                    done();
                }).catch(e => done(e));
            } catch (e) {
                done(e);
            }
        });

        it('test xslt transform without param', function (done) {
            try {
                const docsDescriptor = [
                    {
                        uri: '/optic/update/write8.xml',
                        doc: "<doc>write8</doc>",
                        collections: ['write', 'write8'],
                        metadata: [{'operation': 'write8'}],
                        permissions: [{'role-name': 'rest-reader', capabilities: ['read']}, {
                            'role-name': 'rest-writer',
                            capabilities: ['update']
                        }]
                    },
                ];
                const plan = op.fromDocDescriptors(docsDescriptor)
                    .orderBy('uri')
                    .write({
                        uri: 'uri',
                        doc: 'doc',
                        collections: 'collections',
                        metadata: 'metadata',
                        permissions: 'permissions',
                        quality: 'quality'
                    });
                const options = serverConfiguration.serverVersion <= 11.1? null :
                    {'update' : true};
                db.rows.query(plan,options).then(res => {
                    const transformPlan = op.fromDocUris(op.cts.documentQuery("/optic/update/write8.xml"))
                        .joinDoc(op.col("doc"), op.col('uri'))
                        .transformDoc(op.col("doc"), {"path": "/optic/test/transformDoc-test.xslt", "kind": "xslt"});
                    db.rows.query(transformPlan).then(res => {
                        const row = res.rows[0];
                        row.uri.value.should.containEql("/optic/update/write8.xml");
                        row.doc.value.should.deepEqual("<result>&lt;doc&gt;write8&lt;/doc&gt;<hello>world</hello><yourParam/></result>");
                        done();
                    }).catch(e => done(e));
                }).catch(e => done(e));
            } catch (e) {
                done(e);
            }
        });

        it('test xslt transform with param', function (done) {
            try {
                const transformPlan = op.fromDocUris(op.cts.documentQuery("/optic/update/write8.xml"))
                    .joinDoc(op.col("doc"), op.col('uri'))
                    .transformDoc(op.col("doc"), {
                        "path": "/optic/test/transformDoc-test.xslt",
                        "kind": "xslt",
                        params: {myParam: 'content'}
                    });
                db.rows.query(transformPlan).then(res => {
                    const row = res.rows[0];
                    row.uri.value.should.containEql("/optic/update/write8.xml");
                    row.doc.value.should.deepEqual("<result>&lt;doc&gt;write8&lt;/doc&gt;<hello>world</hello><yourParam>content</yourParam></result>");
                    done();
                }).catch(e => done(e));
            } catch (e) {
                done(e);
            }
        });

        it('test transform mjs with op.col as parameter', function (done) {
            try {
                const rows = [
                    {id: 1, doc: {"doc": 1}, uri: '/optic/update/write11.json'},
                    {id: 2, doc: {"doc": 2}, uri: '/optic/update/write12.json'},
                    {id: 3, doc: {"doc": 3}, uri: '/optic/update/write13.json'}
                ];
                const colTypes = [
                    {"column": "id", "type": "integer", "nullable": false},
                    {"column": "doc", "type": "none", "nullable": false},
                    {"column": "uri", "type": "string", "nullable": false},
                ];

                const fromParam = op.fromParam('bindings', null, colTypes);
                const fromLiteral = op.fromLiterals([
                    {id: 1, val: 'patch1'},
                    {id: 2, val: 'patch2'}
                ]);
                const plan = fromParam
                    .joinInner(fromLiteral)
                    .orderBy('id')
                    .transformDoc('doc', {
                        "path": transformDocWithTwoParams, kind: "mjs",
                        params: {patch1: op.col('id'), patch2: op.col('val')}
                    })
                    .write({uri: 'uri', doc: 'doc'});
                const options = serverConfiguration.serverVersion <= 11.1 ? null:{ update:true,structure: 'object'};
                db.rows.query(plan, options, {bindings: rows}).then(res => {
                    const row = res.rows[0];
                    row.uri.value.should.containEql("/optic/update/write11.json");
                    row.doc.value.should.deepEqual({
                        hello: 'world',
                        Patch1: 1,
                        Patch2: 'patch1',
                        theDoc: {doc: 1}
                    });
                    done();
                }).catch(e => done(e));
            } catch (e) {
                done(e);
            }
        });

    });
});