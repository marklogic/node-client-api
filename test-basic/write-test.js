/*
* Copyright © 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/
'use strict';
const should = require('should');
const testconfig = require('../etc/test-config.js');
const marklogic = require('../');
const db = marklogic.createDatabaseClient(testconfig.restAdminConnection);
const op = marklogic.planBuilder;
const dbWriter = marklogic.createDatabaseClient(testconfig.restWriterConnection);
let assert = require('assert');
const testlib = require("../etc/test-lib");
let serverConfiguration = {};
describe('optic-update write tests', function() {
    this.timeout(20000);
    before(function (done) {
        try {
            testlib.findServerConfiguration(serverConfiguration);
            setTimeout(()=>{done();}, 3000);
        } catch(error){
            done(error);
        }
    });

    describe('optic write function', function () {
        before(function(done){
            if(serverConfiguration.serverVersion < 11){
                this.skip();
            }
            done();
        });

        beforeEach(function (done) {
            let usedUris = ['/test/fromDocDescriptors/data1.json', '/test/fromDocDescriptors/data2.json',
                '/test/fromDocDescriptors/data3.json', '/test/fromDocDescriptors/data1.xml', '/test/fromDocDescriptors/data2.xml',
                '/test/fromDocDescriptors/data3.xml', '/test/fromParam/doc1.xml', '/test/fromParam/doc2.xml',
                '/test/fromParam/doc1.txt', '/test/fromParam/doc2.txt', '/test/fromParam/doc1.json', '/test/fromParam/doc2.json'];
            dbWriter.documents.remove(usedUris)
                .result(function () {
                    done();
                })
                .catch(err => done(err));
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
            const options = serverConfiguration.serverVersion <= 11.1? null :
                {'update' : true};

            try {
                db.rows.execute(op.fromDocDescriptors(docsDescriptor).write(),options);
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
            const options = serverConfiguration.serverVersion <= 11.1? null :
                {'update' : true};
            try {
                db.rows.execute(op.fromDocDescriptors(docsDescriptor).write(), options);
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

        it('test with multiple objects and non-existing columns to write', function (done) {
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
            const options = serverConfiguration.serverVersion <= 11.1? null :
                {'update' : true};
            try {
                db.rows.execute(op.fromDocDescriptors(docsDescriptor).write(
                    {
                        uri: 'uri',
                        doc: 'doc',
                        collections: 'collections1',
                        metadata: 'metadata1',
                        permissions: 'permissions1',
                        quality: 'quality1'
                    }
                ), options);
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
            const options = serverConfiguration.serverVersion <= 11.1? null :
                {'update' : true};
            try {
                db.rows.execute(op.fromDocDescriptors(docsDescriptor).write({
                    uri: 'doc',
                    doc: 'doc',
                    collections: 'collections1',
                    metadata: 'metadata1',
                    permissions: 'permissions1',
                    quality: 'quality1'
                }),options);
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
            const options = serverConfiguration.serverVersion <= 11.1? null : {'update' : true};
            try {
                db.rows.execute(op.fromDocDescriptors(docsDescriptor).write({
                    uri: 'uri',
                    doc: 'doc',
                    collections: 'collections',
                    metadata: 'metadata1',
                    permissions: 'permissions1',
                    quality: 'quality1',
                    describe: "this is a test"
                }), options);

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
            const options = serverConfiguration.serverVersion <= 11.1? null :{'update' : true};
            try {
                db.rows.execute(op.fromDocDescriptors(docsDescriptor).write(op.docCols()), options);
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
            const options = serverConfiguration.serverVersion <= 11.1? null : {'update' : true};
            try {
                db.rows.execute(op.fromDocDescriptors(docsDescriptor).write({
                    uri: 'uri',
                    doc: 'doc',
                    collections: 'collections',
                    metadata: 'metadata',
                    permissions: 'permissions',
                    quality: 'quality'
                }), options);
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
            const options = serverConfiguration.serverVersion <= 11.1? null : {'update' : true};
            try {
                db.rows.execute(op.fromDocDescriptors(docsDescriptor, 'view').write(op.docCols('view')), options);
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

        it('test with all identifiers and query rows', function (done) {
            const docsDescriptor = [{
                uri: '/test/fromDocDescriptors/data1.json',
                doc: {"desc": "doc1"},
                collections: ['fromDocDescriptors'],
                permissions: [{'role-name': 'app-user', capabilities: ['read', 'update']}, {
                    'role-name': 'rest-reader',
                    capabilities: ['read', 'update']
                }, {'role-name': 'rest-writer', capabilities: ['read', 'update']}],
                metadata: {'meta': 'value1'},
                quality: 1,
            }];
            const options = serverConfiguration.serverVersion <= 11.1? null : {'update' : true};
            const plan = op.fromDocDescriptors(docsDescriptor).write(op.docCols());
            db.rows.query(plan, options).then(res => {
                setTimeout(() => {
                    readDocs(['/test/fromDocDescriptors/data1.json'], done).then(resReader => {
                        try {
                            const firstDoc = resReader[0];
                            firstDoc.collections.length.should.equal(1);
                            firstDoc.collections[0].should.equal('fromDocDescriptors');
                            firstDoc.uri.should.equal('/test/fromDocDescriptors/data1.json');
                            firstDoc.content.desc.should.equal("doc1");
                            firstDoc.metadataValues.meta.should.equal("value1");
                            firstDoc.permissions.length.should.equal(3);
                            firstDoc.permissions[0]['role-name'].should.equal('app-user');
                            firstDoc.permissions[1]['role-name'].should.equal('rest-writer');
                            firstDoc.permissions[2]['role-name'].should.equal('rest-reader');
                            firstDoc.permissions[0].capabilities.length.should.equal(2);
                            firstDoc.permissions[1].capabilities.length.should.equal(2);
                            firstDoc.permissions[0].capabilities.should.deepEqual(['update', 'read']);
                            firstDoc.permissions[1].capabilities.should.deepEqual(['update', 'read']);
                            firstDoc.permissions[2].capabilities.should.deepEqual(['update', 'read']);
                            done();
                        } catch (e) {
                            done(e);
                        }
                    });
                }, 2000);

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
            const options = serverConfiguration.serverVersion <= 11.1? null : {'update' : true};
            try {
                db.rows.execute(op.fromDocDescriptors(docsDescriptor, 'view').write(op.docCols('view')), options);
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

        it('test fromParam adding 1 json file', function (done) {
            const bindingParam = "bindings";

            const rows = [{
                id: 1,
                doc: {"desc": "doc1"},
                uri: '/test/bindFromParam/data1.json',
                collections: ['newCol', 'test']
            }];
            const outputCols = [{"column": "id", "type": "integer", "nullable": false}, {
                "column": "doc",
                "type": "none",
                "nullable": false
            }, {"column": "uri", "type": "string", "nullable": false}, {
                "column": "collections",
                "type": "none",
                "nullable": true
            }];

            const planBuilderTemplate = op.fromParam(bindingParam, null, outputCols).write({
                uri: op.col('uri'),
                collections: op.col('collections'),
                doc: op.col('doc')
            });
            const bindParam = {[bindingParam]: rows};
            const options = serverConfiguration.serverVersion <= 11.1? null : {'update' : true};
            try {
                db.rows.execute(planBuilderTemplate, options, bindParam);
                setTimeout(() => {
                    readDocs(['/test/bindFromParam/data1.json'], done).then(res => {
                        try {
                            const firstDoc = res[0];
                            firstDoc.collections.length.should.equal(2);
                            firstDoc.collections[0].should.equal("newCol");
                            firstDoc.collections[1].should.equal("test");
                            firstDoc.uri.should.equal("/test/bindFromParam/data1.json");
                            firstDoc.content.should.deepEqual({desc: 'doc1'});
                            done();
                        } catch (e) {
                            done(e);
                        }
                    });
                }, 2000);
            } catch (e) {

            }
        });

        it('test fromParam adding 2 json files', function (done) {
            const bindingParam = "bindings";

            const rows = [{
                id: 2,
                doc: {"desc": "doc2"},
                uri: '/test/bindFromParam/data2.json',
                collections: ['newCol', 'test']
            },
                {
                    id: 3,
                    doc: {"desc": "doc3"},
                    uri: '/test/bindFromParam/data3.json',
                    collections: ['newCol', "doc3"],
                    quality: 3
                }];
            const outputCols = [{"column": "id", "type": "integer", "nullable": false}, {
                "column": "doc",
                "type": "none",
                "nullable": false
            }, {"column": "uri", "type": "string", "nullable": false},
                {"column": "collections", "type": "none", "nullable": true},
                {"column": "quality", "type": "integer", "nullable": true}];

            const planBuilderTemplate = op.fromParam(bindingParam, null, outputCols).write({
                uri: op.col('uri'),
                collections: op.col('collections'),
                doc: op.col('doc'),
                quality: op.col('quality')
            });
            const bindParam = {[bindingParam]: rows};
            const options = serverConfiguration.serverVersion <= 11.1? null : {'update' : true};
            try {
                db.rows.execute(planBuilderTemplate, options, bindParam);
                setTimeout(() => {
                    readDocs(['/test/bindFromParam/data2.json', '/test/bindFromParam/data3.json'], done).then(res => {
                        try {
                            const firstDoc = res[0];
                            firstDoc.collections.length.should.equal(2);
                            firstDoc.collections[0].should.equal("newCol");
                            firstDoc.collections[1].should.equal("test");
                            firstDoc.uri.should.equal("/test/bindFromParam/data2.json");
                            firstDoc.content.should.deepEqual({desc: 'doc2'});
                            const secondDoc = res[1];
                            secondDoc.collections.length.should.equal(2);
                            secondDoc.collections[0].should.equal("newCol");
                            secondDoc.collections[1].should.equal("doc3");
                            secondDoc.uri.should.equal("/test/bindFromParam/data3.json");
                            secondDoc.content.should.deepEqual({desc: 'doc3'});
                            secondDoc.quality.should.equal(3);
                            done();
                        } catch (e) {
                            done(e);
                        }
                    });
                }, 2000);
            } catch (e) {

            }
        });

        it('test fromParam changing 1 json file', function (done) {
            const bindingParam = "bindings";

            const rows = [{
                id: 1,
                doc: {"desc": "test"},
                uri: '/test/bindFromParam/data1.json',
                collections: ['updated', 'test'],
                quality: 6
            }];
            const outputCols = [{"column": "id", "type": "integer", "nullable": false}, {
                "column": "doc",
                "type": "none",
                "nullable": false
            }, {"column": "uri", "type": "string", "nullable": false},
                {"column": "collections", "type": "none", "nullable": true},
                {"column": "quality", "type": "integer", "nullable": true}];

            const planBuilderTemplate = op.fromParam(bindingParam, null, outputCols).write({
                uri: op.col('uri'),
                collections: op.col('collections'),
                doc: op.col('doc'),
                quality: op.col('quality')
            });
            const bindParam = {[bindingParam]: rows};
            const options = serverConfiguration.serverVersion <= 11.1? null : {'update' : true};
            try {
                db.rows.execute(planBuilderTemplate, options, bindParam);
                setTimeout(() => {
                    readDocs(['/test/bindFromParam/data1.json'], done).then(res => {
                        try {
                            const firstDoc = res[0];
                            firstDoc.collections.length.should.equal(2);
                            firstDoc.collections[0].should.equal("updated");
                            firstDoc.collections[1].should.equal("test");
                            firstDoc.uri.should.equal("/test/bindFromParam/data1.json");
                            firstDoc.content.should.deepEqual({desc: 'test'});
                            firstDoc.quality.should.equal(6);
                            done();
                        } catch (e) {
                            done(e);
                        }
                    });
                }, 2000);
            } catch (e) {

            }
        });

        it('test fromParam changing 2 json files', function (done) {
            const bindingParam = "bindings";

            const rows = [{
                id: 2,
                doc: {"desc": "changed2"},
                uri: '/test/bindFromParam/data2.json',
                collections: ['updated', 'test'],
                permissions: [{'roleName': 'rest-writer', capability: 'update'}, {
                    'roleName': 'rest-writer',
                    capability: 'read'
                }]
            },
                {
                    id: 3,
                    doc: {"desc": "doc3"},
                    uri: '/test/bindFromParam/data3.json',
                    collections: ['newCol', "updated"],
                    quality: 3
                }];
            const outputCols = [{"column": "id", "type": "integer", "nullable": false}, {
                "column": "doc",
                "type": "none",
                "nullable": false
            }, {"column": "uri", "type": "string", "nullable": false},
                {"column": "collections", "type": "none", "nullable": true},
                {"column": "quality", "type": "integer", "nullable": true},
                {"column": "permissions", "type": "none", "nullable": true}];

            const planBuilderTemplate = op.fromParam(bindingParam, null, outputCols).write({
                uri: op.col('uri'),
                collections: op.col('collections'),
                doc: op.col('doc'),
                quality: op.col('quality'),
                permissions: op.col('permissions')
            });
            const bindParam = {[bindingParam]: rows};
            const options = serverConfiguration.serverVersion <= 11.1? null : {'update' : true};
            try {
                db.rows.execute(planBuilderTemplate, options, bindParam);
                setTimeout(() => {
                    readDocs(['/test/bindFromParam/data2.json', '/test/bindFromParam/data3.json'], done).then(res => {
                        try {
                            const firstDoc = res[0];
                            firstDoc.collections.length.should.equal(2);
                            firstDoc.collections[0].should.equal("updated");
                            firstDoc.collections[1].should.equal("test");
                            firstDoc.uri.should.equal("/test/bindFromParam/data2.json");
                            firstDoc.content.should.deepEqual({desc: 'changed2'});
                            const secondDoc = res[1];
                            secondDoc.collections.length.should.equal(2);
                            secondDoc.collections[0].should.equal("newCol");
                            secondDoc.collections[1].should.equal("updated");
                            secondDoc.uri.should.equal("/test/bindFromParam/data3.json");
                            secondDoc.content.should.deepEqual({desc: 'doc3'});
                            secondDoc.quality.should.equal(3);
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

        it('test fromParam changing 2 json file with no write params', function (done) {
            const bindingParam = "bindings";

            const rows = [{
                id: 2,
                doc: {"desc": "changed2"},
                uri: '/test/bindFromParam/data2.json',
                collections: ['updated', 'test'],
                permissions: [{'roleName': 'rest-writer', capability: 'update'}, {
                    'roleName': 'rest-writer',
                    capability: 'read'
                }]
            },
                {
                    id: 3,
                    doc: {"desc": "doc3"},
                    uri: '/test/bindFromParam/data3.json',
                    collections: ['newCol', "updated"],
                    quality: 3
                }];
            const outputCols = [{"column": "id", "type": "integer", "nullable": false}, {
                "column": "doc",
                "type": "none",
                "nullable": false
            }, {"column": "uri", "type": "string", "nullable": false},
                {"column": "collections", "type": "none", "nullable": true},
                {"column": "quality", "type": "integer", "nullable": true},
                {"column": "permissions", "type": "none", "nullable": true}];

            const planBuilderTemplate = op.fromParam(bindingParam, null, outputCols).write();
            const bindParam = {[bindingParam]: rows};
            const options = serverConfiguration.serverVersion <= 11.1? null : {'update' : true};
            try {
                db.rows.execute(planBuilderTemplate, options, bindParam);
                setTimeout(() => {
                    readDocs(['/test/bindFromParam/data2.json', '/test/bindFromParam/data3.json'], done).then(res => {
                        try {
                            const firstDoc = res[0];
                            firstDoc.collections.length.should.equal(2);
                            firstDoc.collections[0].should.equal("updated");
                            firstDoc.collections[1].should.equal("test");
                            firstDoc.uri.should.equal("/test/bindFromParam/data2.json");
                            firstDoc.content.should.deepEqual({desc: 'changed2'});
                            const secondDoc = res[1];
                            secondDoc.collections.length.should.equal(2);
                            secondDoc.collections[0].should.equal("newCol");
                            secondDoc.collections[1].should.equal("updated");
                            secondDoc.uri.should.equal("/test/bindFromParam/data3.json");
                            secondDoc.content.should.deepEqual({desc: 'doc3'});
                            secondDoc.quality.should.equal(3);
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

        it('test fromParam with query and other identifiers name', function (done) {
            const bindingParam = "bindings";

            const rows = [{
                id: 1,
                myDoc: {"desc": "doc5"},
                myUri: '/test/bindFromParam/data5.json',
                collect: ['fromParam']
            }];
            const outputCols = [{"column": "id", "type": "integer", "nullable": false}, {
                "column": "myDoc",
                "type": "none",
                "nullable": false
            }, {"column": "myUri", "type": "string", "nullable": false},
                {"column": "collect", "type": "none", "nullable": true}];

            const planBuilderTemplate = op.fromParam(bindingParam, null, outputCols).write({
                doc: op.col('myDoc'),
                uri: op.col('myUri'),
                collections: op.col('collect')
            });
            const bindParam = {[bindingParam]: rows};
            const options = serverConfiguration.serverVersion <= 11.1? null : {'update' : true};
            try {
                db.rows.query(planBuilderTemplate, options, bindParam).then(res => {
                    setTimeout(() => {
                        readDocs(['/test/bindFromParam/data5.json',], done).then(resReader => {
                            try {
                                const firstDoc = resReader[0];
                                firstDoc.collections.length.should.equal(1);
                                firstDoc.collections[0].should.equal("fromParam");
                                firstDoc.uri.should.equal("/test/bindFromParam/data5.json");
                                firstDoc.content.should.deepEqual({desc: 'doc5'});
                                done();
                            } catch (e) {
                                done(e);
                            }
                        });
                    }, 2000);
                }).catch(e => {
                    done(e);
                });
            } catch (e) {
                done(e);
            }
        });

        it('test write with xml attachments', function (done) {
            const bindingParam = "bindingXmlFiles";

            const rows = [{rowId: 1, doc: 'doc1.xml', uri: '/test/fromParam/doc1.xml'}, {
                rowId: 2,
                doc: 'doc2.xml',
                uri: '/test/fromParam/doc2.xml'
            }];
            const attachments = [{"doc1.xml": "<doc>1</doc>"}, {"doc2.xml": "<doc>2</doc>"}];
            const metadata = {"attachments": {"docs": [{"rowsField": bindingParam, "column": "doc"}]}};
            const outputCols = [{"column": "rowId", "type": "integer", "nullable": false}, {
                "column": "doc",
                "type": "none",
                "nullable": true
            }, {
                "column": "uri",
                "type": "string",
                "nullable": true
            }];

            const planBuilderTemplate = op.fromParam(bindingParam, null, outputCols).write();
            const bindParam = {[bindingParam]: rows, attachments: attachments, metadata};
            const options = serverConfiguration.serverVersion <= 11.1? null :
                {'update' : true, structure:'object'};
            db.rows.query(planBuilderTemplate, options, bindParam).then(res => {
                try {
                    const rows = res.rows;
                    rows[0].rowId.value.should.equal(1);
                    rows[1].rowId.value.should.equal(2);
                    rows[0].doc.value.should.equal('<doc>1</doc>');
                    rows[1].doc.value.should.equal('<doc>2</doc>');
                    done();
                } catch (e) {
                    done(e);
                }
            }).catch(e => {
                done(e);
            });
        });

        it('test write with txt attachments', function (done) {
            const bindingParam = "bindingTxtFiles";

            const rows = [{rowId: 1, doc: 'doc1.txt', uri: '/test/fromParam/doc1.txt'}, {
                rowId: 2,
                doc: 'doc2.txt',
                uri: '/test/fromParam/doc2.txt'
            }];
            const attachments = [{"doc1.txt": "doc1"}, {"doc2.txt": "doc2"}];
            const metadata = {"attachments": {"docs": [{"rowsField": bindingParam, "column": "doc"}]}};
            const outputCols = [{"column": "rowId", "type": "integer", "nullable": false}, {
                "column": "doc",
                "type": "none",
                "nullable": true
            }, {
                "column": "uri",
                "type": "string",
                "nullable": true
            }];

            const planBuilderTemplate = op.fromParam(bindingParam, null, outputCols).write();
            const bindParam = {[bindingParam]: rows, attachments: attachments, metadata};
            const options = serverConfiguration.serverVersion <= 11.1? null :
                {'update' : true, structure:'object'};
            db.rows.query(planBuilderTemplate, options, bindParam).then(res => {
                try {
                    const rows = res.rows;
                    rows[0].rowId.value.should.equal(1);
                    rows[1].rowId.value.should.equal(2);
                    rows[0].doc.value.should.equal('doc1');
                    rows[1].doc.value.should.equal('doc2');
                    done();
                } catch (e) {
                    done(e);
                }
            }).catch(e => {
                done(e);
            });
        });

        it('test write with json attachments', function (done) {
            const bindingParam = "bindingJSONFiles";
            let fs = require('fs');
            const rows = [{
                rowId: 1,
                doc: JSON.parse(fs.readFileSync('./test-basic/data/doc1.json', 'utf8')),
                uri: '/test/fromParam/doc1.json'
            },
                {
                    rowId: 1,
                    doc: JSON.parse(fs.readFileSync('./test-basic/data/doc2.json', 'utf8')),
                    uri: '/test/fromParam/doc2.json'
                }];
            const outputCols = [{"column": "rowId", "type": "integer", "nullable": false}, {
                "column": "doc",
                "type": "none",
                "nullable": true
            }, {
                "column": "uri",
                "type": "string",
                "nullable": true
            }];

            const planBuilderTemplate = op.fromParam(bindingParam, null, outputCols).write();
            const bindParam = {[bindingParam]: rows};
            const options = serverConfiguration.serverVersion <= 11.1? null :
                {'update' : true, structure:'object'};
            db.rows.query(planBuilderTemplate, options, bindParam).then(res => {
                try {
                    const rows = res.rows;
                    rows[0].rowId.value.should.equal(1);
                    assert(JSON.stringify(rows[0].doc.value).includes('desc1'));
                    rows[0].uri.value.should.equal('/test/fromParam/doc1.json');
                    assert(JSON.stringify(rows[1].doc.value).includes('desc2'));
                    rows[1].uri.value.should.equal('/test/fromParam/doc2.json');
                    done();
                } catch (e) {
                    done(e);
                }
            }).catch(e => {
                done(e);
            });
        });
    });
});

function readDocs(uris, done) {
    return db.documents.read({uris, categories: ['metadata', 'content']})
        .result(function (documents) {
            return documents;
        })
        .catch(done)
        .catch(err => done(err));
}
