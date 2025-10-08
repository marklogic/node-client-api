/*
* Copyright © 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
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
let options = {};

describe('optic-update validateDoc tests', function () {

    before(function (done) {
        try {
            testlib.findServerConfigurationPromise(serverConfiguration)
                .then(() => {
                    if (serverConfiguration.serverVersion >= 11.2) {
                        options = { "update": true };
                    }
                });
            setTimeout(() => { done(); }, 3000);
        } catch (error) {
            done(error);
        }
    });

    describe('optic validateDoc test', function () {

        before(function (done) {
            if (serverConfiguration.serverVersion < 11) {
                this.skip();
            }
            let readable = new Stream.Readable({ objectMode: true });

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

            const jsonContent = [{ "count": 1, "items": [1] }, { "count": -2, "items": ["2"] }, {
                "count": 3,
                "items": {}
            }, { "count": 4, "items": ["4"] }];
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
            if (serverConfiguration.serverVersion < 11) {
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

        it('test validateDoc with no arguments, expect an exception', function (done) {
            try {
                const plan = op.fromDocDescriptors([{ uri: '/test/optic/validateDoc/toValidate4.xml' }])
                    .joinDocCols(null, op.col('uri'))
                    .validateDoc();
                db.rows.query(plan, options).then(() => {
                }).catch(e => {
                    e.toString().includes("Error: PlanModifyPlan.validateDoc takes a minimum of 2 arguments but received: 0");
                    done();
                });
            } catch (e) {
                e.toString().includes("Error: PlanModifyPlan.validateDoc takes a minimum of 2 arguments but received: 0");
                done();
            }
        });

        it('test validateDoc with 1 argument, expect an exception', function (done) {
            try {
                const plan = op.fromDocDescriptors([{ uri: '/test/optic/validateDoc/toValidate4.xml' }])
                    .joinDocCols(null, op.col('uri'))
                    .validateDoc('doc');
                db.rows.query(plan, options);
            } catch (e) {
                e.toString().includes("Error: PlanModifyPlan.validateDoc takes a minimum of 2 arguments but received: 1");
                done();
            }
        });

        it('test happy path, validateDoc with 1 valid doc, schemaDef mode should be optional', function (done) {
            try {
                const plan = op.fromDocDescriptors([{ uri: '/test/optic/validateDoc/toValidate4.xml' }])
                    .joinDocCols(null, op.col('uri'))
                    .validateDoc('doc', { kind: 'xmlSchema' });
                db.rows.query(plan, options).then(res => {
                    try {
                        res['columns'].length.should.equal(6);
                        res['rows'].length.should.equal(1);
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

        it('test validateDoc with 1 invalid doc and no "onError" defined, should throw an exception', function (done) {
            try {
                const plan = op.fromDocDescriptors([{ uri: '/test/optic/validateDoc/toValidate1.xml' }])
                    .joinDocCols(null, op.col('uri'))
                    .validateDoc('doc', { kind: 'xmlSchema' });
                db.rows.query(plan, options).then(res => {
                    // This shouldn't happen for invalid docs in 11.2+
                    done(new Error('Expected query to fail but it succeeded'));
                }).catch(e => {
                    try {
                        e.message.should.equal('query rows: response with invalid 500 status with path: /v1/rows/update');
                        done();
                    } catch (assertionError) {
                        done(assertionError);
                    }
                });
            } catch (e) {
                done(e);
            }
        });

        // Skip this test until the 'onError' function is available in plan-builder.js
        it.skip('test validateDoc returns error objects for each invalid document', function (done) {
            try {
                const plan = op
                    .fromDocDescriptors([
                        { uri: "/test/optic/validateDoc/toValidate1.xml" },
                        { uri: "/test/optic/validateDoc/toValidate2.xml" },
                        { uri: "/test/optic/validateDoc/toValidate3.xml" },
                        { uri: "/test/optic/validateDoc/toValidate4.xml" }
                    ], 'view')
                    .joinDocCols(op.docCols('view'), op.viewCol('view', 'uri'))
                    .orderBy('uri')
                    .validateDoc(op.viewCol('view', 'doc'), { kind: 'xmlSchema', mode: 'strict' })
                    .onError("continue", op.col("myError"))
                    .result();
                db.rows.query(plan, options).then(res => {
                    try {
                        if (serverConfiguration.serverVersion >= 11.2) {
                            res['columns'].length.should.equal(6);
                            res['rows'].length.should.equal(1);
                        } else {
                            (res === undefined).should.equal(true);
                        }
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
                const plan = op.fromDocDescriptors([{ uri: '/test/optic/validateDoc/validate1.json' },
                { uri: "/test/optic/validateDoc/validate2.json" },
                { uri: "/test/optic/validateDoc/validate3.json" },
                { uri: "/test/optic/validateDoc/validate4.json" }])
                    .joinDocCols(null, op.col('uri'))
                    .orderBy('uri')
                    .validateDoc('doc', { kind: 'jsonSchema' });
                db.rows.query(plan, options).catch(e => {
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
                const plan = op.fromDocDescriptors([{ uri: "/test/optic/validateDoc/toValidate4.json" }])
                    .joinDocCols(null, op.col('uri'))
                    .orderBy('uri')
                    .validateDoc('doc', { kind: 'jsonSchema', schemaUri: '/validation/validateDoc-test.json' });
                db.rows.query(plan, options).then((res) => {
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
                const plan = op.fromDocDescriptors([{ uri: "/test/optic/validateDoc/NoExisting.json" }])
                    .joinDocCols(null, op.col('uri'))
                    .orderBy('uri')
                    .validateDoc('doc', { kind: 'jsonSchema', schemaUri: '/validateDoc-test.json' });
                db.rows.query(plan, options).then((res) => {
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
                const plan = op.fromDocDescriptors([{ uri: "/test/optic/validateDoc/NoExisting.json" }])
                    .joinDocCols(null, op.col('uri'))
                    .orderBy('uri')
                    .validateDoc('doc', { kind: 'jsonSchema', schemaUri: '/noExisting-test.json' });
                db.rows.query(plan, options).then((res) => {
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

    });
});
