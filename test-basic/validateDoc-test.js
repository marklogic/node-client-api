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
const Stream = require('stream');
const testlib = require("../etc/test-lib");
const op = marklogic.planBuilder;
let uris = [];
let serverConfiguration = {};
describe('optic-update validateDoc tests', function() {
    this.timeout(6000);
    before(function (done) {
        try {
            testlib.findServerConfiguration(serverConfiguration);
            setTimeout(()=>{done();}, 3000);
        } catch(error){
            done(error);
        }
    });

    describe('optic validateDoc test', function () {

        before(function (done) {
            if(serverConfiguration.serverVersion < 11){
                this.skip();
            }
            let readable = new Stream.Readable({objectMode: true});

            const xmlContent = [
                `<?xml version="1.0" encoding="UTF-8"?>
            <gr:event xmlns:gr="http://marklogic.com/xdmp/group">
              <gr:event-id>id</gr:event-id>
              <gr:level>99</gr:level>
              <gr:count>wrong</gr:count>
              <gr:skip>0</gr:skip>
            </gr:event>`,
                `<?xml version="1.0" encoding="UTF-8"?>
            <gr:event xmlns:gr="http://marklogic.com/xdmp/group">
              <gr:event-id>id</gr:event-id>
              <gr:level>98</gr:level>
              <gr:count>wrong</gr:count>
              <gr:skip>abc</gr:skip>
            </gr:event>`,
                `<?xml version="1.0" encoding="UTF-8"?>
            <gr:event xmlns:gr="http://marklogic.com/xdmp/group">
              <gr:event-id>id</gr:event-id>
              <gr:level>97</gr:level>
              <gr:count>wrong</gr:count>
              <gr:skip>abc</gr:skip>
              <gr:queue-size>abc</gr:queue-size>
            </gr:event>`,
                `<?xml version="1.0" encoding="UTF-8"?>
            <gr:event xmlns:gr="http://marklogic.com/xdmp/group">
              <gr:event-id>id</gr:event-id>
              <gr:level>1</gr:level>
              <gr:count>1</gr:count>
              <gr:skip>0</gr:skip>
            </gr:event>`
            ];
            for (let i = 0; i < xmlContent.length; i++) {
                const temp = {
                    uri: `/test/optic/validateDoc/toValidate${i + 1}.xml`,
                    contentType: 'application/xml',
                    content: xmlContent[i]
                };
                readable.push(temp);
                uris.push(temp.uri);
            }

            const jsonContent = [{"count": 1, "items": [1]}, {"count": -2, "items": ["2"]}, {
                "count": 3,
                "items": {}
            }, {"count": 4, "items": ["4"]}];
            for (let i = 0; i < jsonContent.length; i++) {
                const temp = {
                    uri: `/test/optic/validateDoc/toValidate${i + 1}.json`,
                    contentType: 'application/json',
                    content: jsonContent[i]
                };
                readable.push(temp);
                uris.push(temp.uri);
            }

            const schemaTronContent = [
                `<?xml version="1.0" encoding="UTF-8"?>
<user id="001"><name>Alan</name><gender>Male</gender><age>11</age><score total="10"><test-1>50</test-1><test-2>40</test-2></score><result>fail</result></user>`,
                `<?xml version="1.0" encoding="UTF-8"?>
<user id="002"><name>John</name><gender>Female</gender><age>12</age><score total="20"><test-1>50</test-1><test-2>40</test-2></score><result>pass</result></user>`,
                `<?xml version="1.0" encoding="UTF-8"?>
<user id="003"><name>Aaron</name><gender>any</gender><age>13</age><score total="30"><test-1>50</test-1><test-2>40</test-2></score><result>pass</result></user>`,
                `<?xml version="1.0" encoding="UTF-8"?>
<user id="004"><name>Jos</name><gender>Male</gender><age>14</age><score total="90"><test-1>50</test-1><test-2>40</test-2></score><result>pass</result></user>`
            ];
            for (let i = 0; i < schemaTronContent.length; i++) {
                const temp = {
                    uri: `/test/optic/validateDoc/toValidateSchematron${i + 1}.xml`,
                    contentType: 'application/xml',
                    content: schemaTronContent[i]
                };
                readable.push(temp);
                uris.push(temp.uri);
            }

            readable.push(null);
            db.documents.writeAll(readable, {
                onCompletion: (() => {
                    done();
                })
            });
        });

        after(function (done) {
            if(serverConfiguration.serverVersion < 11){
                done();
            } else {
                db.documents.remove(uris)
                    .result(function () {
                        done();
                    })
                    .catch(err => done(err))
                    .catch(done);
            }
        });

        it('test validateDoc with 0 arg, exception', function (done) {
            try {
                const plan = op.fromDocDescriptors([{uri: '/test/optic/validateDoc/toValidate1.xml'},
                    {uri: "/test/optic/validateDoc/toValidate2.xml"},
                    {uri: "/test/optic/validateDoc/toValidate3.xml"}])
                    .joinDocCols(null, op.col('uri'))
                    .validateDoc();
                db.rows.query(plan).then(() => {
                }).catch(e => {
                    e.toString().includes("Error: PlanModifyPlan.validateDoc takes a minimum of 2 arguments but received: 0");
                    done();
                });
            } catch (e) {
                e.toString().includes("Error: PlanModifyPlan.validateDoc takes a minimum of 2 arguments but received: 0");
                done();
            }
        });

        it('test validateDoc with 1 arg, exception', function (done) {
            try {
                const plan = op.fromDocDescriptors([{uri: '/optic/validateDoc/toValidate1.xml'},
                    {uri: "/test/optic/validateDoc/toValidate2.xml"},
                    {uri: "/test/optic/validateDoc/toValidate3.xml"}])
                    .joinDocCols(null, op.col('uri'))
                    .validateDoc('doc');
                db.rows.query(plan);
            } catch (e) {
                e.toString().includes("Error: PlanModifyPlan.validateDoc takes a minimum of 2 arguments but received: 1");
                done();
            }
        });

        it('test validateDoc schemaDef mode should be optional', function (done) {
            try {
                const plan = op.fromDocDescriptors([{uri: '/test/optic/validateDoc/toValidate1.xml'},
                    {uri: "/test/optic/validateDoc/toValidate2.xml"},
                    {uri: "/test/optic/validateDoc/toValidate3.xml"}])
                    .joinDocCols(null, op.col('uri'))
                    .validateDoc('doc', {kind: 'xmlSchema'});
                db.rows.query(plan).then(res => {
                    try {
                        (res === undefined).should.equal(true);
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

        it('test validateDoc filters out invalid docs, should return 0 doc', function (done) {
            try {
                const plan = op.fromDocDescriptors([{uri: '/test/optic/validateDoc/toValidate1.xml'},
                    {uri: "/test/optic/validateDoc/toValidate2.xml"},
                    {uri: "/test/optic/validateDoc/toValidate3.xml"}], 'view')
                    .joinDocCols(op.docCols('view'), op.viewCol('view', 'uri'))
                    .orderBy('uri')
                    .validateDoc(op.viewCol('view', 'doc'), {kind: 'xmlSchema', mode: 'strict'});
                db.rows.query(plan).then(res => {
                    try {
                        (res === undefined).should.equal(true);
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

        it('test validateDoc 3 invalid doc and 1 valid doc, should return 1 doc', function (done) {
            try {
                const plan = op.fromDocDescriptors([
                    {uri: '/test/optic/validateDoc/toValidate1.xml'},
                    {uri: "/test/optic/validateDoc/toValidate2.xml"},
                    {uri: "/test/optic/validateDoc/toValidate3.xml"},
                    {uri: "/test/optic/validateDoc/toValidate4.xml"}], 'view')
                    .joinDocCols(op.docCols('view'), op.viewCol('view', 'uri'))
                    .orderBy('uri')
                    .validateDoc(op.viewCol('view', 'doc'), {kind: 'xmlSchema', mode: 'lax'});
                db.rows.query(plan).then(res => {
                    try {
                        res.rows.length.should.equal(1);
                        res.rows[0]['view.uri'].value.should.equal('/test/optic/validateDoc/toValidate4.xml');
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

        it('test validateDoc with jsonSchema, schemaUri is required, exception', function (done) {
            try {
                const plan = op.fromDocDescriptors([{uri: '/test/optic/validateDoc/validate1.json'},
                    {uri: "/test/optic/validateDoc/validate2.json"},
                    {uri: "/test/optic/validateDoc/validate3.json"},
                    {uri: "/test/optic/validateDoc/validate4.json"}])
                    .joinDocCols(null, op.col('uri'))
                    .orderBy('uri')
                    .validateDoc('doc', {kind: 'jsonSchema'});
                db.rows.query(plan).catch(e => {
                    try {
                        e.body.errorResponse.message.includes('OPTIC-INVALARGS: fn.error(null, \'OPTIC-INVALARGS\', \'validateDoc() - JSON schema URI is not provided. Add property schemaUri.\'); -- Invalid arguments: validateDoc() - JSON schema URI is not provided. Add property schemaUri.');
                        done();
                    } catch (e) {
                        done(e);
                    }

                });
            } catch (e) {
                done(e);
            }
        });

        it('test validateDoc validate a valid doc', function (done) {
            try {
                const plan = op.fromDocDescriptors([{uri: "/test/optic/validateDoc/toValidate4.json"}])
                    .joinDocCols(null, op.col('uri'))
                    .orderBy('uri')
                    .validateDoc('doc', {kind: 'jsonSchema', schemaUri: '/validation/validateDoc-test.json'});
                db.rows.query(plan).then((res) => {
                    try {
                        res.rows.length.should.equal(1);
                        res.rows[0].uri.value.should.equal('/test/optic/validateDoc/toValidate4.json');
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

        it('test validateDoc with a non existing file', function (done) {
            try {
                const plan = op.fromDocDescriptors([{uri: "/test/optic/validateDoc/NoExisting.json"}])
                    .joinDocCols(null, op.col('uri'))
                    .orderBy('uri')
                    .validateDoc('doc', {kind: 'jsonSchema', schemaUri: '/validateDoc-test.json'});
                db.rows.query(plan).then((res) => {
                    try {
                        (res === undefined).should.equal(true);
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

        it('test validateDoc with a non existing schemaUri', function (done) {
            try {
                const plan = op.fromDocDescriptors([{uri: "/test/optic/validateDoc/NoExisting.json"}])
                    .joinDocCols(null, op.col('uri'))
                    .orderBy('uri')
                    .validateDoc('doc', {kind: 'jsonSchema', schemaUri: '/noExisting-test.json'});
                db.rows.query(plan).then((res) => {
                    try {
                        (res === undefined).should.equal(true);
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

        it('test validateDoc 4 docs, filters out 1, mode strict', function (done) {
            try {
                const plan = op.fromDocDescriptors([{uri: "/test/optic/validateDoc/toValidate1.json"},
                    {uri: "/test/optic/validateDoc/toValidate2.json"},
                    {uri: "/test/optic/validateDoc/toValidate3.json"},
                    {uri: "/test/optic/validateDoc/toValidate4.json"}])
                    .joinDocCols(null, op.col('uri'))
                    .orderBy('uri')
                    .validateDoc('doc', {kind: 'jsonSchema', schemaUri: '/validation/validateDoc-test.json', mode: 'strict'});
                db.rows.query(plan).then((res) => {
                    try {
                        res.rows.length.should.equal(1);
                        res.rows[0].uri.value.should.equal('/test/optic/validateDoc/toValidate4.json');
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

        it('test validateDoc 4 JSON nodes, filters out 1', function (done) {
            try {
                const docsDescriptor = [
                    {uri: '/test/optic/validateDoc/toValidate1.json', doc: {"count": 1, "items": [1]}},
                    {uri: '/test/optic/validateDoc/toValidate2.json', doc: {"count": -2, "items": ["2"]}},
                    {uri: '/test/optic/validateDoc/toValidate3.json', doc: {"count": 3, "items": {}}},
                    {uri: '/test/optic/validateDoc/toValidate4.json', doc: {"count": 4, "items": ["4"]}},
                ];
                const plan = op.fromDocDescriptors(docsDescriptor)
                    .joinDocCols(null, op.col('uri'))
                    .orderBy('uri')
                    .validateDoc('doc', {kind: 'jsonSchema', schemaUri: "/validation/validateDoc-test.json", mode: "full"});
                db.rows.query(plan).then((res) => {
                    try {
                        res.rows.length.should.equal(1);
                        res.rows[0].uri.value.should.equal('/test/optic/validateDoc/toValidate4.json');
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

        it('test  validateDoc 3 invalid doc and 1 valid doc, should return 1 doc', function (done) {
            try {
                const plan = op.fromDocDescriptors([{uri: '/test/optic/validateDoc/toValidateSchematron1.xml'},
                    {uri: "/test/optic/validateDoc/toValidateSchematron2.xml"},
                    {uri: "/test/optic/validateDoc/toValidateSchematron3.xml"},
                    {uri: "/test/optic/validateDoc/toValidateSchematron4.xml"}], 'view')
                    .joinDocCols(op.docCols('view'), op.viewCol('view', 'uri'))
                    .orderBy(op.viewCol('view', 'uri'))
                    .validateDoc(op.viewCol('view', 'doc'), {kind: 'schematron', schemaUri: "/validateDoc-test.sch"});

                db.rows.query(plan).then((res) => {
                    try {
                        res.rows.length.should.equal(1);
                        res.rows[0]['view.uri'].value.should.equal('/test/optic/validateDoc/toValidateSchematron4.xml');
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

    });
});
