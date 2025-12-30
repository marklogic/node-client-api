/*
* Copyright (c) 2015-2026 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/
'use strict';

const should = require('should');

const marklogic = require('../');
const op = marklogic.planBuilder;

const pbb = require('./plan-builder-base');
const execPlan = pbb.execPlan;
const getResults = pbb.getResults;
const assert = require('assert');
const testlib = require("../etc/test-lib");
let serverConfiguration = {};
const testPlan = pbb.testPlan;

describe('tests for new vector functions.', function() {
    before(function (done) {
        this.timeout(6000);
        try {
            testlib.findServerConfiguration(serverConfiguration);
            setTimeout(()=>{
                if(serverConfiguration.serverVersion < 12) {
                this.skip();
            }
             done();
           }, 3000);
        } catch(error){
            done(error);
        }

    });

    it('vec.add', function(done) {
        const vec1 = op.vec.vector([1]);
        const vec2 = op.vec.vector([2]);
        testPlan([""],op.vec.add(vec1, vec2))
            .then(function(response) {
               // add([1], [2]) = [3] (element-wise addition)
               assert(response.rows[0].t.value[0] == 3, 'vec.add did not return expected value: [1] + [2] should be [3]');
                done();
            }).catch(error => done(error));
    });

    it('vec.subtract', function(done) {
        const vec1 = op.vec.vector([2]);
        const vec2 = op.vec.vector([1]);
        testPlan([""],op.vec.subtract(vec1, vec2))
            .then(function(response) {
                // vec.subtract([2], [1]) = [1] (element-wise subtraction)
                assert(response.rows[0].t.value[0] == 1, 'vec.subtract did not return expected value: [2] - [1] should be [1]');
                done();
            }).catch(error => done(error));
    });

    it('vec.base64Decode', function(done) {
        const vec1 = op.vec.vector([0.002]);
        testPlan([""],op.vec.subvector(op.vec.base64Decode(op.vec.base64Encode(op.vec.subvector(vec1,0))),0))
            .then(function(response) {
                // Round-trip encode/decode returns [0.002]
                assert(response.rows[0].t.value[0] == 0.002, 'vec.base64Decode did not return expected value for vector [0.002] after round-trip encode/decode');
                done();
            }).catch(error => done(error));
    });

    it('vec.base64Encode', function(done) {
        testPlan([""],op.vec.base64Encode(op.vec.vector([0.002])))
            .then(function(response) {
                // qconsole shows that encoding vector vec.base64Encode([0.002]) returns 'AAAAAAEAAABvEgM7'
                assert(response.rows[0].t.value =='AAAAAAEAAABvEgM7', 'vec.base64Encode did not return expected value for vector [0.002] which should be "AAAAAAEAAABvEgM7"');
                done();
            }).catch(error => done(error));
    });

    it('vec.cosine', function(done) {
        // orthogonal vectors should have cosine similarity of 0, round down to 0 to be sure (floats)
        const vec1 = op.vec.vector([1, 1])
        const vec2 = op.vec.vector([-1, 1])

        testPlan([""],op.math.floor(op.vec.cosine(vec1, vec2)))
            .then(function(response) {
                assert(response.rows[0].t.value == 0, 'Cosine similarity between orthogonal vectors should be 0');
            }).catch(error => done(error));

        // cosine similarity between subvectors [1,2,3] and [5,6,7] should be approximately 0.968329 (to 6 decimal places)
        testPlan([""],op.math.trunc(op.vec.cosine(op.vec.vector([1,2,3]),op.vec.vector([5,6,7])), 6))
            .then(function(response) {
                assert(response.rows[0].t.value == '0.968329', 'Cosine (directional similarity) between vectors [1,2,3] and [5,6,7] should be approximately 0.968329');
            }).catch(error => done(error));

        // cosine similarity between subvectors [1,2,3] and [5,6,7] should be approximately 0.96832
        // and cosine distance should be approximately 0.03167 which is 1 - cosine similarity.
        testPlan([""],op.vec.vector([
                op.math.trunc(op.vec.cosine(op.vec.vector([1,2,3]),op.vec.vector([5,6,7])), 5),
                op.math.trunc(op.vec.cosineDistance(op.vec.vector([1,2,3]),op.vec.vector([5,6,7])), 5),
            ]))
            .then(function(response) {
                assert(response.rows[0].t.value[0] == '0.96832', 'Cosine (directional similarity) between subvectors [1,2,3] and [5,6,7] should be approximately 0.96833.');
                assert(response.rows[0].t.value[1] == '0.03167', 'Cosine distance between subvectors [1,2,3] and [5,6,7] should be approximately 0.03167, or 1 - cosine similarity.');
                done();
            }).catch(error => done(error));


    });

    it('vec.dimension', function(done) {
        testPlan([""],op.vec.dimension(op.vec.vector([1, 2, 3])))
            .then(function(response) {
                assert(response.rows[0].t.value == 3, 'Dimension of vector [1,2,3] should be 3');
                done();
            }).catch(error => done(error));
    });

    it('vec.dotProduct', function(done) {
        const vec1 = op.vec.vector([1, 2, 3])
        const vec2 = op.vec.vector([4, 5, 6, 7])

        // Dot product between subvectors [1,2,3] and [5,6,7] is (1*5) + (2*6) + (3*7) = 5 + 12 + 21 = 38
        testPlan([""],op.vec.dotProduct(
                op.vec.subvector(vec1,0),
                op.vec.subvector(vec2,1,3))
            )
            .then(function(response) {
                assert(response.rows[0].t.value == 38, 'Dot product between subvectors [1,2,3] and [5,6,7] should be 38');
                done();
            }).catch(error => done(error));
    });

    it('vec.euclideanDistance', function(done) {
        const vec1 = op.vec.vector([1, 2, 3])
        const vec2 = op.vec.vector([4, 5, 6,7])

        // Euclidean distance between subvectors [1,2] and [5,6] is 
        // sqrt((1-5)^2 + (2-6)^2) = sqrt(16 + 16) = sqrt(32)
        // This is approx 5.65685
        testPlan([""], op.math.trunc(
                op.vec.euclideanDistance(
                    op.vec.vector([1,2]),
                    op.vec.vector([5,6]))
                , 5))
            .then(function(response) {
                assert(response.rows[0].t.value == '5.65685', 'Euclidean distance between subvectors [1,2] and [5,6] should be approximately 5.65685, trunc() to 5 decimal places');
                done();
            }).catch(error => done(error));
    });

    it('vec.get', function(done) {
        testPlan([""],op.vec.get(op.vec.vector([1, 2, 3]),1))
            .then(function(response) {
                assert(response.rows[0].t.value == 2, 'Element at index 1 of vector [1,2,3] should be 2');
                done();
            }).catch(error => done(error));
    });

    it('vec.magnitude', function(done) {
        testPlan([""],op.math.trunc(op.vec.magnitude(op.vec.vector([1, 2, 3])), 5))
            .then(function(response) {
                // sqrt(1^2 + 2^2 + 3^2) = sqrt(14) ~= 3.74165 to 5 decimal places
                assert(response.rows[0].t.value == '3.74165', 'Magnitude of [1,2,3] should be sqrt(1 + 4 + 9) ~= 3.74165 (trunc to 5 decimal places)');
                done();
            }).catch(error => done(error));
    });

    it('vec.normalize', function(done) {
        testPlan([""],(op.vec.normalize(op.vec.vector([1,2]))))
            .then(function(response) {
                // normalize([1,2]) = [1/sqrt(5), 2/sqrt(5)]
                // value[0] = 1/sqrt(5) ~= 0.447214
                // value[1] = 2/sqrt(5) ~= 0.894427
                assert(response.rows[0].t.value[0] == 0.447214, 'Normalized first element of vector [1,2] should be approximately 0.447214');
                assert(response.rows[0].t.value[1] == 0.894427, 'Normalized second element of vector [1,2] should be approximately 0.894427');
                done();
            }).catch(error => done(error));
    });

    it('vec.vectorScore', function(done) {
        testPlan([""],(op.vec.vectorScore(24684,0.1,0.1)))
            .then(function(response) {
                assert(response.rows[0].t.value == 113124, 'vectorScore(24684,0.1,0.1) should be 113124');
                done();
            }).catch(error => done(error));
    });

    it('vec.cosineDistance', function(done) {
        // return a vector with two cosine distance calculations: one between identical direction vectors, 
        // one between opposite direction vectors
        testPlan([""],(op.vec.vector([
                op.vec.cosineDistance(op.vec.vector([2, 2]), op.vec.vector([1, 1])),
                op.vec.cosineDistance(op.vec.vector([2, 2]), op.vec.vector([-3, -3]))
            ])))
            .then(function(response) {
                assert(response.rows[0].t.value[0] == 0, 'Cosine distance should be 0 between identical direction vectors [2,2] and [1,1]');
                assert(response.rows[0].t.value[1] == 2, 'Cosine distance should be 2 between opposite direction vectors [2,2] and [-3,-3]');
                done();
            }).catch(error => done(error));
    });

    it('vec.precision', function(done) {
        // return a vector with the values of pi, e, and sqrt(2) by truncation; we expect to see [3, 2, 1]
        testPlan([""],op.vec.precision(op.vec.vector([3.14159265, 2.71828182, 1.41421356]), 10))
            .then(function(response) {
                assert(response.rows[0].t.value != null);
                assert(response.rows[0].t.value[0] == 3);
                assert(response.rows[0].t.value[1] == 2);
                assert(response.rows[0].t.value[2] == 1);
                done();
            }).catch(error => done(error));
    });

    it('vec.trunc', function(done) {
        // return a vector with the values of 1.123456789, 2.123456789, 3.123456789 truncated to 1 decimal place; 
        // we expect to see [1.1, 2.1, 3.1]
        testPlan([""],(op.vec.trunc(op.vec.vector([1.123456789, 2.123456789, 3.123456789]), 1)))
            .then(function(response) {
                assert(response.rows[0].t.value[0] == 1.1);
                assert(response.rows[0].t.value[1] == 2.1);
                assert(response.rows[0].t.value[2] == 3.1);
                done();
            }).catch(error => done(error));
    });
});