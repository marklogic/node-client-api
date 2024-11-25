/*
 * Copyright © 2024 MarkLogic Corporation. All Rights Reserved.
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

    it('happy path', function (done) {
        execPlan(p
            .fromView('vectors', 'persons', '')
            .annTopK(10, p.col('embedding'), p.vec.vector([1.1, 2.2, 3.3]), p.col('distance'), 0.5)
            .orderBy(p.col('name'))
        )
            .then(function (response) {
                const rows = response.rows;
                assert(rows.length === 2, 'Expecting both rows in the view to be returned.');
                assert(rows[0].name.value === 'Alice');
                assert(rows[0].distance.type === 'xs:float', 'Verifying that the distance column was populated.');
                assert(rows[1].name.value === 'Bob');
                assert(rows[1].distance.type === 'xs:float',  'Verifying that the distance column was populated.');
                done();
            })
            .catch(done);
    });

});