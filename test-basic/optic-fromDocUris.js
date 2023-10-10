'use strict';

const should = require('should');

const marklogic = require('../');
const p = marklogic.planBuilder;

const pbb = require('./plan-builder-base');
var testconfig = require('../etc/test-config.js');
const execPlan = pbb.execPlan;
const getResults = pbb.getResults;
var db = marklogic.createDatabaseClient(testconfig.restWriterConnection);
const Stream = require('stream');
const testlib = require("../etc/test-lib");
let result = new Set();
let uris = [];
let serverConfiguration = {};
describe('optic-update fromDocUris tests', function() {
    this.timeout(15000);
    before(function (done) {
        try {
            testlib.findServerConfiguration(serverConfiguration);
            setTimeout(()=>{done();}, 3000);
        } catch(error){
            done(error);
        }
    });

    describe('fromDocUris', function () {

        before(function (done) {
            if(serverConfiguration.serverVersion < 11){
                this.skip();
            }
            let readable = new Stream.Readable({objectMode: true});
            for (let i = 0; i < 100; i++) {
                const temp = {
                    uri: '/test/optic-update/' + i + '.json',
                    contentType: 'application/json',
                    content: {['key ' + i]: 'value ' + i}
                };
                readable.push(temp);
                uris.push(temp.uri);
            }
            readable.push(null);
            db.documents.writeAll(readable, {
                onCompletion: ((summary) => {
                    done();

                })
            });
        });

        after(function (done) {
            if(serverConfiguration.serverVersion < 11){
                db.documents.remove(uris)
                    .result(function (response) {
                        done();
                    })
                    .catch(err => done(err))
                    .catch(done);
            } else {
                done();
            }
        });

        it('basic', function (done) {
            execPlan(
                p.fromDocUris(p.cts.directoryQuery('/test/optic-update/'))
            ).then(function (response) {
                const output = getResults(response);
                output.forEach(item => result.add(item.uri.value));
                checkResult(done);
            }).catch(done);
        });
        it('with query', function (done) {
            db.rows.query(p.fromDocUris(p.cts.directoryQuery('/test/optic-update/')))
                .then(function (response) {
                    const rows = response.rows;
                    rows.forEach(item => result.add(item.uri.value));
                    checkResult(done);
                })
                .catch(err => done(err));
        });

        it('with query-2', function (done) {
            db.rows.query(
                `op.fromDocUris(cts.directoryQuery('/test/optic-update/'));
                `, {queryType: 'dsl'}
            )
                .then(function (response) {
                    const rows = response.rows;
                    rows.forEach(item => result.add(item.uri.value));
                    checkResult(done);
                }).catch(err => done(err));
        });

        it('with wordQuery', function (done) {
            execPlan(
                p.fromDocUris(p.cts.wordQuery("trumpet"), "")
            ).then(function (response) {
                const rows = response.rows;
                rows.forEach(item => result.add(item.uri.value));
                result.should.containEql('/optic/test/musician1.json');
                result.should.containEql('/optic/test/musician4.json');
                result.clear();
                done();
            }).catch(done);
        });
    });
});

function checkResult(done) {
    result.size.should.equal(100);
    for(let i=0; i<100; i++){
        result.should.containEql(`/test/optic-update/${i}.json`);
    }
    result.clear();
    done();
}
