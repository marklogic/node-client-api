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
const testlib = require("../etc/test-lib");
const db = marklogic.createDatabaseClient(testconfig.restWriterConnection);
const op = marklogic.planBuilder;
let serverConfiguration = {};

describe('optic-update docColTypes tests', function() {
    this.timeout(6000);
    before(function (done) {
        try {
            testlib.findServerConfiguration(serverConfiguration);
            setTimeout(()=>{done();}, 3000);
        } catch(error){
            done(error);
        }
    });

    describe('optic docColTypes test ', function () {
        before(function(done){
            if(serverConfiguration.serverVersion < 11){
                this.skip();
            }
            done();
        });

        it('test with fromParam', function (done) {
            const rows = [{uri: '/test/docColTypes/0.json'}];
            const plan = op.fromParam('bindingParam', null, op.docColTypes());
            const temp = {bindingParam: rows};
            db.rows.query(plan, null, temp).then(res => {
                const row = res.rows[0];
                row.uri.value.should.equal('/test/docColTypes/0.json');
                done();
            }).catch(e => done(e));
        });

        it('test with fromParam and 1 argument', function (done) {
            const rows = [{uri: '/test/docColTypes/0.json'}];
            try {
                const plan = op.fromParam('bindingParam', null, op.docColTypes(op.col('uri')));
                const temp = {bindingParam: rows};
                db.rows.query(plan, null, temp);
            } catch (e) {
                e.toString().includes('Error: PlanBuilder.docColTypes takes a maximum of 0 arguments but received: 1');
                done();
            }
        });

        it('test with fromParam and xml files and no metadata', function (done) {
            const bindingParam = "bindingXmlFiles";

            const rows = [{doc: 'doc1.xml'}, {doc: 'doc2.xml'}];
            const attachments = [{"doc1.xml": "<doc>1</doc>"}, {"doc2.xml": "<doc>2</doc>"}];

            const planBuilderTemplate = op.fromParam(bindingParam, null, op.docColTypes());
            const bindParam = {[bindingParam]: rows, attachments: attachments};

            db.rows.query(planBuilderTemplate, null, bindParam).then(res => {
                try {
                    const rows = res.rows;
                    rows[0].doc.value.should.equal('doc1.xml');
                    rows[1].doc.value.should.equal('doc2.xml');
                    done();
                } catch (e) {
                    done(e);
                }
            }).catch(e => {
                done(e);
            });
        });

        it('test with fromParam and xml files with metadata', function (done) {
            const bindingParam = "bindingAttachments";

            const rows = [{doc: 'doc.xml'}];
            const attachments = [{"doc.xml": "<doc>doc1</doc>"}];
            const metadata = {
                "attachments": {
                    "docs": [
                        {"rowsField": bindingParam, "column": "doc"},
                    ]
                }
            };

            const planBuilderTemplate = op.fromParam(bindingParam, null, op.docColTypes());
            const bindParam = {[bindingParam]: rows, attachments: attachments, metadata: metadata};

            db.rows.query(planBuilderTemplate, null, bindParam).then(res => {
                try {
                    const rows = res.rows;
                    rows[0].doc.value.should.equal('<doc>doc1</doc>');
                    done();
                } catch (e) {
                    done(e);
                }
            }).catch(e => {
                done(e);
            });
        });

        it('test with optic fromDocDescriptors and write should throw error', function (done) {
            const docsDescriptor = {
                uri: '/test/docColTypes/data1.json',
                doc: {"desc": "doc2"},
                collections: ['fromDocDescriptors'],
                permissions: [{'role-name': 'app-user', capabilities: ['read']}],
                metadata: {'meta': 'value1'},
                quality: 1,
            };

            try {
                db.rows.query(op.fromDocDescriptors(docsDescriptor).write(op.docColTypes()));
            } catch (e) {
                e.toString().includes('Error: doc-cols argument at 0 of PlanModifyPlan.write() must have type PlanDocColsIdentifier');
                done();
            }
        });

        it('test with fromParam and all arguments', function (done) {
            const rows = [{
                uri: '/test/docColTypes/data1.json',
                doc: {"desc": "doc2"},
                collections: ['docColTypes'],
                permissions: [{'role-name': 'app-user', capabilities: ['read']}],
                metadata: {'meta': 'value1'},
                quality: 1
            }];
            try {
                const plan = op.fromParam('bindingParam', null, op.docColTypes());
                const temp = {bindingParam: rows};
                db.rows.query(plan, null, temp).then(res => {
                    const row = res.rows[0];
                    row.uri.value.should.equal('/test/docColTypes/data1.json');
                    row.doc.value.should.deepEqual({"desc": "doc2"});
                    row.collections.value.should.deepEqual(['docColTypes']);
                    row.permissions.value.should.deepEqual([{"role-name": "app-user", "capabilities": ["read"]}]);
                    row.metadata.value.should.deepEqual({'meta': 'value1'});
                    row.quality.value.should.equal(1);
                    done();
                }).catch(e => done(e));
            } catch (e) {
                done(e);
            }
        });
    });
});