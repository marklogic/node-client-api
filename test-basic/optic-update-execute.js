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
const db = marklogic.createDatabaseClient(testconfig.restWriterConnection);
const Stream = require('stream');
const testlib = require("../etc/test-lib");
const op = marklogic.planBuilder;

let removeStream = new Stream.PassThrough({objectMode: true});
let uris = [];
let serverVersionGreaterThanEqual11 = false;
describe('optic-update execute tests', function() {
    before(function (done) {
        testlib.findServerConfiguration().result(function (response) {
            serverVersionGreaterThanEqual11 = (parseInt(response.data['local-cluster-default'].version) >= 11);
            done();
        }).catch(error => done(error));
    });

    describe('execute ', function () {
        this.timeout(30000);
        before(function(done){
            if(!serverVersionGreaterThanEqual11){
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
            try {
                db.rows.execute(op.fromDocUris(op.cts.directoryQuery('/test/fromDocUris/')).remove());
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
            try {
                db.rows.execute(op.fromDocUris(op.cts.directoryQuery('/test/fromDocUris/')).remove(), {trace: "fromDocUris"});
                setTimeout(function () {
                    verifyDocs(done);
                }, 3000);
            } catch (e) {
                done(e);
            }
        });

        it('test with fromDocUris using query function -> remove', function (done) {
            try {
                db.rows.query(op.fromDocUris(op.cts.directoryQuery('/test/fromDocUris/')).remove())
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
