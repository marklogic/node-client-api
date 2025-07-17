/*
* Copyright © 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/
'use strict';

const marklogic = require('../');
const p = marklogic.planBuilder;

const pbb = require('./plan-builder-base');
const assert = require('assert');
const testlib = require('../etc/test-lib');
let serverConfiguration = {};
const execPlan = pbb.execPlan;

describe('tests for annTopK', function () {
    this.timeout(5000)
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

    it('annTopK without PlanAnnTopKOptions', function (done) {
        execPlan(p
            .fromView('vectors', 'persons', '')
            .annTopK(10, p.col('embedding'), p.vec.vector([1.1, 2.2, 3.3]), p.col('distance'))
            .orderBy(p.col('name'))
        )
            .then(function (response) {
                verifyResults(response.rows, done);
            })
            .catch(error => done(error));
    });

    it('annTopK with PlanAnnTopKOptions as a single string', function (done) {
        execPlan(p
            .fromView('vectors', 'persons', '')
            .annTopK(10, p.col('embedding'), p.vec.vector([1.1, 2.2, 3.3]), p.col('distance'), 'onlyIndex')
            .orderBy(p.col('name'))
        )
            .then(function (response) {
                verifyResults(response.rows, done);
            })
            .catch(error => done(error));
    });

    it('annTopK with PlanAnnTopKOptions as an array of string', function (done) {
        execPlan(p
            .fromView('vectors', 'persons', '')
            .annTopK(10, p.col('embedding'), p.vec.vector([1.1, 2.2, 3.3]), p.col('distance'),
                ['onlyIndex', "maxDistance=0.15", "searchFactor=1.0"])
            .orderBy(p.col('name'))
        ).then(function (response) {
                verifyResults(response.rows, done);
        }).catch(error => done(error));
    });

    it('annTopK with PlanAnnTopKOptions as a map', function (done) {
        const planAnnTopKOptionsMap = new Map();
        planAnnTopKOptionsMap.set("maxDistance", 0.158454656600952);
        planAnnTopKOptionsMap.set("searchFactor", 10.0);
        execPlan(p
            .fromView('vectors', 'persons', '')
            .annTopK(10, p.col('embedding'), p.vec.vector([1.1, 2.2, 3.3]), p.col('distance'),
                planAnnTopKOptionsMap)
            .orderBy(p.col('name'))
        )
            .then(function (response) {
                verifyResults(response.rows, done);
            })
            .catch(error => done(error));
    });

    it('annTopK with invalid PlanAnnTopKOptions', function (done) {
        const planAnnTopKOptionsMap = new Map();
        planAnnTopKOptionsMap.set('invalid', 10.0);
        try{
            execPlan(p
                .fromView('vectors', 'persons', '')
                .annTopK(10, p.col('embedding'), p.vec.vector([1.1, 2.2, 3.3]), p.col('distance'),
                    planAnnTopKOptionsMap)
                .orderBy(p.col('name'))
            );
        } catch(error){
            assert(error.message.toString().includes('options argument at 4 of PlanModifyPlan.annTopK() has invalid key- invalid'))
            done();
        }
    });

    function  verifyResults(rows, done){
        try {
            assert(rows.length === 2, 'Expecting both rows in the view to be returned.');
            assert(rows[0].name.value === 'Alice');
            assert(rows[0].distance.type === 'xs:float', 'Verifying that the distance column was populated.');
            assert(rows[1].name.value === 'Bob');
            assert(rows[1].distance.type === 'xs:float',  'Verifying that the distance column was populated.');
            done();
        } catch (error){
            done(error)
        }
    }
});