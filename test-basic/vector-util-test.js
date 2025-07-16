/*
* Copyright © 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/

'use strict';

const assert = require('assert');
const testlib = require('../etc/test-lib');
let serverConfiguration = {};
const vectorUtil = require('../lib/vector-util');
const pbb = require("./plan-builder-base");
const marklogic = require("../lib/marklogic");
const testconfig = require("../etc/test-config");
const vector = [3.14, 1.59, 2.65];
const delta = 0.0001;
const p = marklogic.planBuilder;
const testPlan = pbb.testPlan;
const dbWriter = marklogic.createDatabaseClient(testconfig.restWriterConnection);

describe('tests for vector-util', function () {
    this.timeout(5000);
    before(function (done) {
        try {
            testlib.findServerConfiguration(serverConfiguration);
            setTimeout(() => {
                if (serverConfiguration.serverVersion < 12) {
                    this.skip();
                }
                done();
            }, 3000);
        } catch (error) {
            done(error);
        }
    });

    it('should encode the vector correctly using client side', function (done) {
        const encoded = vectorUtil.base64Encode(vector);
        try{
            assert.strictEqual(encoded, 'AAAAAAMAAADD9UhAH4XLP5qZKUA=');
            done();
        } catch(error){
            done(error);
        }
    });

    it('should decode the vector correctly using client side without delta', function (done) {
        const input = 'AAAAAAMAAADD9UhAH4XLP5qZKUA=';
        const decoded = vectorUtil.base64Decode(input);
        try {
            assert(Array.isArray(decoded));
            assert.strictEqual(decoded[0], 3.140000104904175);
            assert.strictEqual(decoded[1], 1.590000033378601);
            assert.strictEqual(decoded[2], 2.6500000953674316);
            for (let i = 0; i < vector.length; i++) {
                assert(Math.abs(decoded[i] - vector[i]) < delta, `Value mismatch at index ${i}`);
            }
            done();
        } catch(error){
            done(error);
        }
    });

    it('should encode using server-side vector function and decode using client side', function (done) {
        const vec1 = [0.002];
        testPlan([""],p.vec.base64Encode(p.vec.subvector(p.vec.vector(vec1),0)))
            .then(function(response) {
                const input = response.rows[0].t.value;
                const decoded = vectorUtil.base64Decode(input);
                assert.strictEqual(input, 'AAAAAAEAAABvEgM7');
                assert(Array.isArray(decoded));
                assert.strictEqual(decoded[0], 0.0020000000949949026);
                assert(Math.abs(decoded[0] - vec1[0]) < delta, `Value mismatch`);
                done();
            }).catch(error => done(error));
    });

    it('should encode using client-side vector function and decode using server side',  done => {

        const input = vectorUtil.base64Encode(vector);
        const vectorString = '[ '+vector[0].toString()+', '+vector[1].toString()+', '+vector[2].toString()+' ]';
        dbWriter.eval(`vec.base64Decode('${input}')`).result(res=>{
            assert.strictEqual(res[0].value, vectorString);
            done();
        }).catch(error=> done(error))
    });
});