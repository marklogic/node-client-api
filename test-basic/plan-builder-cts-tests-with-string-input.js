/*
* Copyright (c) 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
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

describe('plan builder tests for cts.point and cts.polygon with String input', function () {
    this.timeout(10000);
    before(function (done) {
        try {
            testlib.findServerConfiguration(serverConfiguration);
            setTimeout(() => {
                if (serverConfiguration.serverVersion < 11.1) {
                    this.skip();
                }
                done();
            }, 3000);
        } catch (error) {
            done(error);
        }
    });

    it('cts.point should accept string argument#1', function (done) {
        testPlan([p.cts.point('1,2'), p.xs.double(1.2), p.xs.double(1.2)],
            p.geo.destination(p.col("1"), p.col("2"), p.col("3")))
            .then(function (response) {
                should(getResult(response).value).eql("1.0063286,2.0161717");
                done();
            }).catch(error => done(error));
    });

    it('cts.point should accept string argument#2', function (done) {
        testPlan([p.cts.point('POINT(5 6)'), p.xs.double(1.2), p.xs.double(1.2)],
            p.geo.destination(p.col("1"), p.col("2"), p.col("3")))
            .then(function (response) {
                should(getResult(response).value).eql("6.0063281,5.0162578");
                done();
            }).catch(error => done(error));
    });

    it('should write document with string input to cts.point', function (done) {
        const uri = '/test/write/ctsPointString1.txt';

        db.documents.write({
            uri: uri,
            contentType: 'application/text',
            content: p.cts.point('POINT(5 6)')
        }).result(() => {
            db.documents.read(uri)
                .result(async function (documents) {
                    const document = documents[0];
                    document.should.have.property('content');
                    assert(document.content.toString().includes('POINT(5 6)'));
                    await db.documents.remove(uri);
                    done();
                })
                .catch(error => done(error));
        });
    });

    it('should write document with string input to cts.polygon#1', function (done) {

        const uri = '/test/write/ctsPolygonString1.txt';
        db.documents.write({
            uri: uri,
            contentType: 'application/text',
            content: p.cts.polygon('POLYGON(2 1, 4 3, 6 5, 2 1)')
        }).result(() => {
            db.documents.read(uri)
                .result(async function (documents) {
                    const document = documents[0];
                    document.should.have.property('content');
                    assert(document.content.toString().includes('POLYGON(2 1, 4 3, 6 5, 2 1)'));
                    await db.documents.remove(uri);
                    done();
                })
                .catch(error => done(error));
        });
    });

    it('should write document with string input to cts.polygon#2', function (done) {
        const uri = '/test/write/ctsPolygonString2.txt';
        db.documents.write({
            uri: uri,
            contentType: 'application/text',
            content: p.cts.polygon('1,2 3,4 5,6 1,2')
        }).result(() => {
            db.documents.read(uri)
                .result(async function (documents) {
                    const document = documents[0];
                    document.should.have.property('content');
                    assert(document.content.toString().includes('1,2 3,4 5,6 1,2'));
                    await db.documents.remove(uri);
                    done();
                })
                .catch(error => done(error));
        });
    });
});