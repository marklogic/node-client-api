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

const marklogic = require('../');
const p = marklogic.planBuilder;
const pbb = require('./plan-builder-base');
const testlib = require("../etc/test-lib");
const testconfig = require("../etc/test-config");
const testPlan = pbb.testPlan;
const getResult = pbb.getResult;
let assert = require('assert');
let serverConfiguration = {};
var db = marklogic.createDatabaseClient(testconfig.restWriterConnection);

describe('plan builder tests for cts.point and cts.polygon with String input', function() {
    this.timeout(10000);
    before(function (done) {
        try {
            testlib.findServerConfiguration(serverConfiguration);
            setTimeout(()=>{
                if(serverConfiguration.serverVersion < 11.1){
                    this.skip();
                }
                done();
                }, 3000);
        } catch(error){
            done(error);
        }
    });

    it('cts.point should accept string argument#1', function(done) {
        testPlan([p.cts.point('1,2'), p.xs.double(1.2), p.xs.double(1.2)],
            p.geo.destination(p.col("1"), p.col("2"), p.col("3")))
            .then(function(response) {
                should(getResult(response).value).eql("1.0063286,2.0161717");
                done();
            }).catch(error => done(error));
    });

    it('cts.point should accept string argument#2', function(done) {
        testPlan([p.cts.point('POINT(5 6)'), p.xs.double(1.2), p.xs.double(1.2)],
            p.geo.destination(p.col("1"), p.col("2"), p.col("3")))
            .then(function(response) {
                should(getResult(response).value).eql("6.0063281,5.0162578");
                done();
            }).catch(error => done(error));
    });

    it('should write document with string input to cts.point', function(done) {
        const uri = '/test/write/ctsPointString1.txt';

        db.documents.write({
            uri: uri,
            contentType: 'application/text',
            content: p.cts.point('POINT(5 6)')
        }).result(()=>{
            db.documents.read(uri)
                .result(function(documents) {
                    const document = documents[0];
                    document.should.have.property('content');
                    assert(document.content.toString().includes('POINT(5 6)'));
                })
                .then(db.documents.remove(uri)
                    .result(()=>{
                        done();
                    }))
                .catch(error => done(error));
        });
    });

    it('should write document with string input to cts.polygon#1', function(done) {

        const uri = '/test/write/ctsPolygonString2.txt';
            db.documents.write({
                uri: uri,
                contentType: 'application/text',
                content: p.cts.polygon('POLYGON(2 1, 4 3, 6 5, 2 1)')
            }).result(()=>{
                db.documents.read(uri)
                    .result(function(documents) {
                        const document = documents[0];
                        document.should.have.property('content');
                        assert(document.content.toString().includes('POLYGON(2 1, 4 3, 6 5, 2 1)'));
                    })
                    .then(db.documents.remove(uri)
                        .result(()=>{
                            done();
                        }))
                    .catch(error => done(error));
            });
    });

    it('should write document with string input to cts.polygon#2', function(done) {
        const uri = '/test/write/ctsPolygonString2.txt';
        db.documents.write({
            uri: uri,
            contentType: 'application/text',
            content: p.cts.polygon('1,2 3,4 5,6 1,2')
        }).result(()=>{
            db.documents.read(uri)
                .result(function(documents) {
                    const document = documents[0];
                    document.should.have.property('content');
                    assert(document.content.toString().includes('1,2 3,4 5,6 1,2'));
                })
                .then(db.documents.remove(uri)
                    .result(()=>{
                        done();
                    }))
                .catch(error => done(error));
        });
    });
});