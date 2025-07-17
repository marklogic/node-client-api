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
let uris = [];
let serverConfiguration = {};
describe('optic-update execute tests', function() {
    this.timeout(30000);
    before(function (done) {
        try {
            testlib.findServerConfiguration(serverConfiguration);
            setTimeout(()=>{done();}, 3000);
        } catch(error){
            done(error);
        }
    });

    describe('execute ', function () {
        before(function(done){
            if(serverConfiguration.serverVersion < 11){
                this.skip();
            }
            done();
        });
        beforeEach(function (done) {
            let readable = new Stream.Readable({objectMode: true});
            removeStream = new Stream.PassThrough({objectMode: true});
            uris = [];
            for (let i = 0; i < 100; i++) {
                const temp = {
                    uri: '/test/fromDocUris/' + i + '.json',
                    contentType: 'application/json',
                    content: {['key']: 'initialValue'}
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

        afterEach(function (done) {
            db.documents.remove(uris)
                .result(function (response) {
                    done();
                })
                .catch(err => done(err))
                .catch(done);
        });

        it('test with fromDocUris -> remove', function (done) {
            const options = serverConfiguration.serverVersion <= 11.1? null : {'update' : true};
            try {
                db.rows.execute(op.fromDocUris(op.cts.directoryQuery('/test/fromDocUris/')).remove(), options);
                setTimeout(function () {
                    verifyDocs(done);
                }, 3000);
            } catch (e) {
                done(e);
            }
        });

        it('test with no optic plan', function (done) {
            try {
                db.rows.execute();
            } catch (e) {
                e.toString().includes('Error: built plan required');
                done();
            }
        });

        it('test with fromDocUris and trace option -> remove', function (done) {
            const options = serverConfiguration.serverVersion <= 11.1? {trace: "fromDocUris"} : {trace: "fromDocUris",'update' : true};
            try {
                db.rows.execute(op.fromDocUris(op.cts.directoryQuery('/test/fromDocUris/')).remove(), options);
                setTimeout(function () {
                    verifyDocs(done);
                }, 3000);
            } catch (e) {
                done(e);
            }
        });

        it('test with fromDocUris using query function -> remove', function (done) {
            const options = serverConfiguration.serverVersion <= 11.1? null : {'update' : true};
            try {
                db.rows.query(op.fromDocUris(op.cts.directoryQuery('/test/fromDocUris/')).remove(), options)
                    .then(res => {
                        const arrayOfUris = res.rows.map(item => item.uri.value).sort();
                        arrayOfUris.should.deepEqual(uris.sort());
                        done();
                    }).catch(e => {
                    done(e);
                });
            } catch (e) {
                done(e);
            }
        });
    });
});

function verifyDocs(done){
    db.documents.read(uris)
        .result(function (documents) {
            documents.length.should.equal(0);
        })
        .then(()=> done())
        .catch(err=> done(err));
}
