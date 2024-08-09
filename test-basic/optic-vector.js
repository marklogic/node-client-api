/*
 * Copyright (c) 2024 MarkLogic Corporation
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
const execPlan = pbb.execPlan;
const getResults = pbb.getResults;
const assert = require('assert');
const testlib = require("../etc/test-lib");
let serverConfiguration = {};
const testPlan = pbb.testPlan;

describe('tests for new vector fucntions.', function() {
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
        const vec1 = p.vec.vector([0.000000000001]);
        const vec2 = p.vec.vector([0.000000000001, 0.000000000002]);
        testPlan([""],p.vec.add(p.vec.subvector(vec1,0),p.vec.subvector(vec2,1)))
            .then(function(response) {
               assert(response.rows[0].t.value[0][0] =='1e-12')
               assert(response.rows[0].t.value[1][0]=='2e-12')
                done();
            }).catch(error => done(error));
    });

    it('vec.subtract', function(done) {
        const vec1 = p.vec.vector([0.000000000002]);
        const vec2 = p.vec.vector([0.000000000001]);
        testPlan([""],p.vec.subtract(p.vec.subvector(vec1,0),p.vec.subvector(vec2,0)))
            .then(function(response) {
                assert(response.rows[0].t.value[0][0] =='2e-12')
                assert(response.rows[0].t.value[1][0]=='1e-12')
                done();
            }).catch(error => done(error));
    });

    it('vec.base64decode', function(done) {

        const vec1 = p.vec.vector([0.002]);
        testPlan([""],p.vec.subvector(p.vec.base64Decode(p.vec.base64Encode(p.vec.subvector(vec1,0))),0))
            .then(function(response) {
                assert(response.rows[0].t.value[0][0] =='0.002')
                done();
            }).catch(error => done(error));
    });

    it('vec.base64Encode', function(done) {
        const vec1 = p.vec.vector([0.002]);
        testPlan([""],p.vec.base64Encode(p.vec.subvector(vec1,0)))
            .then(function(response) {
                assert(response.rows[0].t.value =='FYT6NiFJhGw=AQAAAA==AAAAAA==bxIDOw==')
                done();
            }).catch(error => done(error));
    });

    it('vec.cosineSimilarity', function(done) {
        const vec1 = p.vec.vector([1, 2, 3])
        const vec2 = p.vec.vector([4, 5, 6,7])

        testPlan([""],p.vec.cosineSimilarity(p.vec.subvector(vec1,0),p.vec.subvector(vec2,1)))
            .then(function(response) {
                assert(response.rows[0].t.value != null);
                done();
            }).catch(error => done(error));
    });

    it('vec.dimension', function(done) {

        testPlan([""],p.vec.dimension(p.vec.vector([1, 2, 3])))
            .then(function(response) {
                assert(response.rows[0].t.value == 3);
                done();
            }).catch(error => done(error));
    });

    it('vec.dotproduct', function(done) {
        const vec1 = p.vec.vector([1, 2, 3])
        const vec2 = p.vec.vector([4, 5, 6,7])

        testPlan([""],p.vec.cosineSimilarity(p.vec.subvector(vec1,0),p.vec.subvector(vec2,1)))
            .then(function(response) {
                assert(response.rows[0].t.value == '0.968329608440399');
                done();
            }).catch(error => done(error));
    });

    it('vec.euclideanDistance', function(done) {
        const vec1 = p.vec.vector([1, 2, 3])
        const vec2 = p.vec.vector([4, 5, 6,7])

        testPlan([""],p.vec.euclideanDistance(p.vec.subvector(vec1,0,2),p.vec.subvector(vec2,1,2)))
            .then(function(response) {
                assert(response.rows[0].t.value == '5.65685415267944');
                done();
            }).catch(error => done(error));
    });

    it('vec.get', function(done) {

        testPlan([""],p.vec.get(p.vec.vector([1, 2, 3]),1))
            .then(function(response) {
                assert(response.rows[0].t.value == 2);
                done();
            }).catch(error => done(error));
    });

    it('vec.magnitude', function(done) {

        testPlan([""],p.vec.magnitude(p.vec.vector([1, 2, 3])))
            .then(function(response) {
                assert(response.rows[0].t.value == '3.74165749549866');
                done();
            }).catch(error => done(error));
    });

    it('vec.normalize', function(done) {

        testPlan([""],(p.vec.normalize(p.vec.subvector(p.vec.vector([1,2]),1))))
            .then(function(response) {
                assert(response.rows[0].t.value == 2);
                done();
            }).catch(error => done(error));
    });

    it('vec.vectorScore', function(done) {
        const vec1 = p.vec.vector([1, 2, 3])
        testPlan([""],(p.vec.vectorScore(24684,0.1,0.1)))
            .then(function(response) {
                assert(response.rows[0].t.value == 24687);
                done();
            }).catch(error => done(error));
    });
});