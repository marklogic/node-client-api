/*
* Copyright © 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/

'use strict';
const should = require('should');
const testconfig = require('../etc/test-config.js');
const marklogic = require('../');
const testlib = require("../etc/test-lib");
const db = marklogic.createDatabaseClient(testconfig.restAdminConnection);
const op = marklogic.planBuilder;
let serverConfiguration = {};
describe('optic-update fromDocDescriptors tests', function() {
    this.timeout(10000);
    before(function (done) {
        try {
            testlib.findServerConfiguration(serverConfiguration);
            setTimeout(()=>{done();}, 3000);
        } catch(error){
            done(error);
        }
    });

    describe('fromDocDescriptors ', function () {
        before(function(done){
            if(serverConfiguration.serverVersion < 11){
                this.skip();
            }
            done();
        });

        it('test with array of objects', function (done) {
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
            db.rows.query(op.fromDocDescriptors(docsDescriptor)).then(res => {
                try {
                    const rows = res.rows;
                    (rows[0].collections.value === null).should.be.true;
                    rows[0].doc.value.desc.should.equal("doc1");
                    (rows[0].metadata.value === null).should.be.true;
                    rows[0].uri.value.should.equal("/test/fromDocDescriptors/data1.json");
                    rows[1].collections.value.should.equal("write");
                    rows[1].doc.value.desc.should.equal("doc2");
                    (rows[1].metadata.value === null).should.be.true;
                    rows[1].uri.value.should.equal("/test/fromDocDescriptors/data2.json");
                    rows[2].collections.type.should.equal("array");
                    rows[2].collections.value[0].should.equal("write");
                    rows[2].collections.value[1].should.equal("doc3");
                    rows[2].doc.value.desc.should.equal("doc3");
                    rows[2].metadata.value.operation.should.equal("doc3");
                    rows[2].uri.value.should.equal("/test/fromDocDescriptors/data3.json");
                    done();
                } catch (e) {
                    done(e);
                }
            }).catch(e => {
                done(e);
            });

        });

        it('test with qualifier', function (done) {
            const docsDescriptor = [
                {uri: '/test/fromDocDescriptors/data1.json', doc: {"desc": "doc1"}},
                {uri: '/test/fromDocDescriptors/data2.json', doc: {"desc": "doc2"}}];
            db.rows.query(op.fromDocDescriptors(docsDescriptor, 'qualifier')).then(res => {
                try {
                    const rows = res.rows;
                    rows[0]["qualifier.doc"].value.desc.should.equal("doc1");
                    rows[0]["qualifier.uri"].value.should.equal("/test/fromDocDescriptors/data1.json");
                    rows[1]["qualifier.doc"].value.desc.should.equal("doc2");
                    rows[1]["qualifier.uri"].value.should.equal("/test/fromDocDescriptors/data2.json");
                    done();
                } catch (e) {
                    done(e);
                }
            }).catch(e => {
                done(e);
            });

        });

        it('test with uri key with another type instead of string', function (done) {
            const docsDescriptor = [{uri: 3, doc: {"desc": "test0"}}];
            try {
                db.rows.query(op.fromDocDescriptors(docsDescriptor));
            } catch (e) {
                e.toString().includes('Error: doc-descriptor argument at 0 of PlanBuilder.fromDocDescriptors() - uri key has type number instead of \'string\'');
                done();
            }
        });

        it('test with no argument, should throw arguments error', function (done) {
            try {
                db.rows.query(op.fromDocDescriptors());
            } catch (e) {
                e.toString().includes('Error: PlanBuilder.fromDocDescriptors takes a minimum of 1 arguments but received: 0');
                done();
            }

        });

        it('test with empty array as parameter, should throw arguments error', function (done) {
            try {
                db.rows.query(op.fromDocDescriptors([]));
            } catch (e) {
                e.toString().includes('Error: doc-descriptor argument at 0 of PlanBuilder.fromDocDescriptors() array must have at least one PlanDocDescriptor value');
                done();
            }

        });

        it('test with empty object as parameter', function (done) {
            try {
                db.rows.query(op.fromDocDescriptors({}));
            } catch (e) {
                e.toString().includes('Error: doc-descriptor argument at 0 of PlanBuilder.fromDocDescriptors() - called with objects without document column keys such as "uri" for {}');
                done();
            }

        });

        it('test with wrong type of argument', function (done) {
            try {
                db.rows.query(op.fromDocDescriptors('asd'))
            } catch (e) {
                e.toString().includes('Error: doc-descriptor argument at 0 of PlanBuilder.fromDocDescriptors() must be a PlanDocDescriptor value');
                done();
            }
        });

        it('test with one doc descriptor', function (done) {
            const docsDescriptor = {uri: '/test/fromDocDescriptors/data1.json', doc: {"desc": "doc1"}};
            try {
                db.rows.query(op.fromDocDescriptors(docsDescriptor)).then(res => {
                    try {
                        const rows = res.rows;
                        rows[0].doc.value.desc.should.equal("doc1");
                        rows[0].uri.value.should.equal("/test/fromDocDescriptors/data1.json");
                        done();
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

        it('test with wrong type of uri parameter', function (done) {
            const docsDescriptor = {uri: 3, doc: {"desc": "doc1"}};
            try {
                db.rows.query(op.fromDocDescriptors(docsDescriptor))
            } catch (e) {
                e.toString().includes('Error: doc-descriptor argument at 0 of PlanBuilder.fromDocDescriptors() - uri key has type number instead of \'string\'');
                done();
            }
        });

        it('test with wrong type of collections parameter', function (done) {
            const docsDescriptor = {uri: '/test/fromDocDescriptors/data1.json', doc: {"desc": "doc1"}, collections: 3};
            try {
                db.rows.query(op.fromDocDescriptors(docsDescriptor));
            } catch (e) {
                e.toString().includes('Error: doc-descriptor argument at 0 of PlanBuilder.fromDocDescriptors() - collections key must be array');
                done();
            }
        });

        it('test with wrong type of permissions parameter', function (done) {
            const docsDescriptor = {
                uri: '/test/fromDocDescriptors/data1.json',
                doc: {"desc": "doc2"},
                collections: ['fromDocDescriptors'],
                permissions: 'asd'
            };

            try {
                db.rows.query(op.fromDocDescriptors(docsDescriptor));
            } catch (e) {
                e.toString().includes('Error: doc-descriptor argument at 0 of PlanBuilder.fromDocDescriptors() - permissions key must be array');
                done();
            }
        });

        it('test with wrong type of metadata parameter', function (done) {
            const docsDescriptor = {
                uri: '/test/fromDocDescriptors/data1.json',
                doc: {"desc": "doc2"},
                collections: ['fromDocDescriptors'],
                permissions: [{'role-name': 'app-user', capabilities: ['read']}],
                metadata: true
            };
            try {
                db.rows.query(op.fromDocDescriptors(docsDescriptor));
            } catch (e) {
                e.toString().includes('Error: doc-descriptor argument at 0 of PlanBuilder.fromDocDescriptors() - metadata key must be array or json object');
                done();
            }
        });

        it('test with wrong type of quality parameter', function (done) {
            const docsDescriptor = {
                uri: '/test/fromDocDescriptors/data1.json',
                doc: {"desc": "doc2"},
                collections: ['fromDocDescriptors'],
                permissions: [{'role-name': 'app-user', capabilities: ['read']}],
                metadata: {'meta': 'value1'},
                quality: '1'
            };

            try {
                db.rows.query(op.fromDocDescriptors(docsDescriptor));
            } catch (e) {
                e.toString().includes('Error: doc-descriptor argument at 0 of PlanBuilder.fromDocDescriptors() - quality key must be type of number');
                done();
            }
        });

        it('test with wrong type of temporalCollections parameter', function (done) {
            const docsDescriptor = {
                uri: '/test/fromDocDescriptors/data1.json',
                doc: {"desc": "doc2"},
                collections: ['fromDocDescriptors'],
                permissions: [{'role-name': 'app-user', capabilities: ['read']}],
                metadata: {'meta': 'value1'},
                quality: 1,
                temporalCollection: {}
            };

            try {
                db.rows.query(op.fromDocDescriptors(docsDescriptor));
            } catch (e) {
                e.toString().includes('Error: doc-descriptor argument at 0 of PlanBuilder.fromDocDescriptors() - temporalCollection key has type object instead of \'string\'');
                done();
            }
        });

        it('test with doc ', function (done) {
            const docsDescriptor = {doc: {"key": "doc1"}};
            db.rows.query(op.fromDocDescriptors(docsDescriptor)).then(res => {
                try {
                    const rows = res.rows;
                    rows[0].doc.value.key.should.equal("doc1");
                    done();
                } catch (e) {
                    done(e);
                }

            }).catch(error => done(error));

        });

        it('test with all identifiers', function (done) {
            const docsDescriptor = {
                uri: '/test/fromDocDescriptors/data1.json',
                doc: {"desc": "doc2"},
                collections: ['fromDocDescriptors'],
                permissions: [{'role-name': 'app-user', capabilities: ['read']}],
                metadata: {'meta': 'value1'},
                quality: 1,
            };
            db.rows.query(op.fromDocDescriptors(docsDescriptor)).then(res => {
                try {
                    const rows = res.rows;
                    rows[0].collections.value.should.equal("fromDocDescriptors");
                    rows[0].doc.value.desc.should.equal("doc2");
                    rows[0].metadata.value.meta.should.equal("value1");
                    rows[0].permissions.value.roleName.should.equal("app-user");
                    rows[0].permissions.value.capability.should.equal("read");
                    rows[0].quality.value.should.equal(1);
                    rows[0].uri.value.should.equal("/test/fromDocDescriptors/data1.json");
                    done();
                } catch (e) {
                    done(e);
                }
            }).catch(error => done(error));

        });

        it('test with non-existing doc descriptor identifiers', function (done) {
            const docsDescriptor = {
                uri: '/test/fromDocDescriptors/data1.json',
                doc: {"desc": "doc2"},
                collections: ['fromDocDescriptors'],
                permissions: [{'role-name': 'app-user', capabilities: ['read']}],
                metadata: {'meta': 'value1'},
                quality: 1,
                temporalCollection: 'update',
                none: false
            };
            try {
                db.rows.query(op.fromDocDescriptors(docsDescriptor));
            } catch (e) {
                e.toString().includes('Error: doc-descriptor argument at 0 of PlanBuilder.fromDocDescriptors() - no typechecking info available for: none');
                done();
            }
        });

        it('test with integer as qualifier, expect an exception', function (done) {
            const docsDescriptor = {
                uri: '/test/fromDocDescriptors/data1.json',
                doc: {"desc": "doc2"},
            };
            try {
                db.rows.query(op.fromDocDescriptors(docsDescriptor, 1));
            } catch (e) {
                e.toString().includes('Error: qualifier argument at 1 of PlanBuilder.fromDocDescriptors() must be a XsString value');
                done();
            }
        });

        it('test with a join of op.fromDocDescriptors and op.fromLiterals', function (done) {
            const docsDescriptor = [
                {uri: '/test/fromDocDescriptors/data1.json', doc: {"desc": "doc1"}},
                {uri: '/test/fromDocDescriptors/data2.json', doc: {"desc": "doc2"}},
                {uri: '/test/fromDocDescriptors/data3.json', doc: {"desc": "doc3"}}];
            const fromLiterals = [
                {uri: '/test/fromDocDescriptors/data1.json', val: 0},
                {uri: '/test/fromDocDescriptors/data3.json', val: 5}
            ];

            try {

                const fromDocDescriptors = op.fromDocDescriptors(docsDescriptor, 'left');
                const fromLiteral = op.fromLiterals(fromLiterals, 'right');

                const plan = fromDocDescriptors
                    .joinInner(fromLiteral)
                    .where(
                        op.eq(
                            op.viewCol('left', 'uri'),
                            fromLiteral.col('uri')
                        )
                    )
                    .orderBy(op.viewCol('left', 'uri'));
                db.rows.query(plan).then(res => {
                    try {
                        const rows = res.rows;
                        rows.length.should.equal(2);
                        rows[0]["left.doc"].value.desc.should.equal("doc1");
                        rows[0]["right.val"].value.should.equal(0);
                        rows[0]["left.uri"].value.should.equal("/test/fromDocDescriptors/data1.json");
                        rows[0]["right.uri"].value.should.equal("/test/fromDocDescriptors/data1.json");
                        rows[1]["left.doc"].value.desc.should.equal("doc3");
                        rows[1]["right.val"].value.should.equal(5);
                        rows[1]["left.uri"].value.should.equal("/test/fromDocDescriptors/data3.json");
                        rows[1]["right.uri"].value.should.equal("/test/fromDocDescriptors/data3.json");
                        done();
                    } catch (e) {
                        done(e);
                    }
                }).catch(error => done(error));
            } catch (e) {
                done(e);
            }
        });

    });
});