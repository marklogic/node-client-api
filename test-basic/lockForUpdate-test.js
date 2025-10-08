/*
* Copyright © 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/
const marklogic = require('../');
const testconfig = require('../etc/test-config.js');
const db = marklogic.createDatabaseClient(testconfig.restWriterConnection);
const op = marklogic.planBuilder;
const should = require('should');
const testlib = require("../etc/test-lib");
let serverConfiguration = {};
describe('optic-update lockForUpdate tests', function() {
    this.timeout(6000);
    before(function (done) {
        try {
            testlib.findServerConfiguration(serverConfiguration);
            setTimeout(()=>{done();}, 3000);
        } catch(error){
            done(error);
        }
    });

    describe('test lockForUpdate', function () {
        before(function(done){
            if(serverConfiguration.serverVersion < 11){
                this.skip();
            }
            done();
        });

        it('basic test', function (done) {
            const uri = '/test/lockForUpdate/data.json';
            const options = serverConfiguration.serverVersion <= 11.1? null : {'update' : true};
            db.rows.query(op.fromDocDescriptors({uri, doc: {hello: "world"}}).write(), options)
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
                        db.rows.query(plan, options).then((res) => {
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

    });
});
