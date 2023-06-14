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
const marklogic = require('../');
const testconfig = require('../etc/test-config.js');
const db = marklogic.createDatabaseClient(testconfig.restWriterConnection);
const op = marklogic.planBuilder;
const should = require('should');
const testlib = require("../etc/test-lib");
let serverVersionGreaterThanEqual11 = false;
describe('optic-update lockForUpdate tests', function() {
    before(function (done) {
        testlib.findServerConfiguration().result(function (response) {
            serverVersionGreaterThanEqual11 = (parseInt(response.data['local-cluster-default'].version) >= 11);
            done();
        }).catch(error => done(error));
    });

    describe('test lockForUpdate', function () {
        this.timeout(6000);
        before(function(done){
            if(!serverVersionGreaterThanEqual11){
                this.skip();
            }
            done();
        });

        it('basic test', function (done) {
            const uri = '/test/lockForUpdate/data.json';
            db.rows.query(op.fromDocDescriptors({uri, doc: {hello: "world"}}).write())
                .then((res) => {
                    const row = res.rows[0];
                    try {
                        row.uri.value.should.containEql("/test/lockForUpdate/data.json");
                        row.doc.value.should.deepEqual({hello: "world"});

                        const plan = op.fromDocDescriptors({uri, collections: ['optic']}).lockForUpdate().write();

                        db.eval(`
                        declareUpdate();
                        xdmp.lockForUpdate("/test/lockForUpdate/data.json");
                        xdmp.sleep(2000);
                        xdmp.documentSetCollections("/test/lockForUpdate/data.json", ['eval1']);
                    `);

                        const start = Date.now();
                        db.rows.query(plan).then((res) => {
                            const duration = Date.now() - start;
                            try {
                                (duration > 1500).should.equal(true);
                                db.documents.read({uris: [uri], categories: ['metadata']})
                                    .result(function (documents) {
                                        try {
                                            documents.length.should.equal(1);
                                            documents[0].collections.should.deepEqual(['optic']);
                                            done();
                                        } catch (e) {
                                            done(e);
                                        }
                                    });
                            } catch (e) {
                                done(e);
                            }
                        });
                    } catch (e) {
                        done(e);
                    }
                })
                .catch(e => done(e));

        });

        it('test with uri column specified', function (done) {
            db.rows.query(op.fromDocUris('/optic/test/musician1.json').lockForUpdate(op.col('uri'))).then((res) => {
                try {
                    res.rows.length.should.equal(1);
                    done();
                } catch (e) {
                    done(e);
                }
            }).catch(e => done(e));
        });

        it('test with fromParam with custom uri', function (done) {
            const rows = [{myUri: '/optic/test/musician1.json'}];
            const outputCols = [{"column": "myUri", "type": "string", "nullable": false}];

            db.rows.query(op.fromParam('bindingParam', null, outputCols).lockForUpdate(op.col('myUri')), null, {bindingParam: rows}).then((res) => {
                try {
                    res.rows.length.should.equal(1);
                    done();
                } catch (e) {
                    done(e);
                }
            }).catch(e => done(e));
        });

        it('test with fromParam with qualified uri column', function (done) {
            const rows = [{myUri: '/optic/test/musician1.json'}];
            const outputCols = [{"column": "myUri", "type": "string", "nullable": false}];

            db.rows.query(op.fromParam('bindingParam', "myQualifier", outputCols).lockForUpdate(op.viewCol('myQualifier', 'myUri')), null, {bindingParam: rows}).then((res) => {
                try {
                    res.rows.length.should.equal(1);
                    done();
                } catch (e) {
                    done(e);
                }
            }).catch(e => done(e));
        });


    });
});
