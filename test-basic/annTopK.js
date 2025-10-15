/*
* Copyright (c) 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
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
    this.timeout(5000);
    before(async function () {
        await testlib.findServerConfigurationPromise(serverConfiguration);
        
        if (serverConfiguration.serverVersion < 12) {
            this.skip();
        }
    });

    it('annTopK without PlanAnnTopKOptions', async function () {
        const response = await execPlan(p
            .fromView('vectors', 'persons', '')
            .annTopK(10, p.col('embedding'), p.vec.vector([1.1, 2.2, 3.3]), p.col('distance'))
            .orderBy(p.col('name'))
        );
        verifyResults(response.rows);
    });

    it('annTopK with PlanAnnTopKOptions as a single string', async function () {
        const response = await execPlan(p
            .fromView('vectors', 'persons', '')
            .annTopK(10, p.col('embedding'), p.vec.vector([1.1, 2.2, 3.3]), p.col('distance'), 'onlyIndex')
            .orderBy(p.col('name'))
        );
        verifyResults(response.rows);
    });

    it('annTopK with PlanAnnTopKOptions as an array of string', async function () {
        const response = await execPlan(p
            .fromView('vectors', 'persons', '')
            .annTopK(10, p.col('embedding'), p.vec.vector([1.1, 2.2, 3.3]), p.col('distance'),
                ['onlyIndex', "maxDistance=0.15", "searchFactor=1.0"])
            .orderBy(p.col('name'))
        );
        verifyResults(response.rows);
    });

    it('annTopK with PlanAnnTopKOptions as a map', async function () {
        const planAnnTopKOptionsMap = new Map();
        planAnnTopKOptionsMap.set("maxDistance", 0.158454656600952);
        planAnnTopKOptionsMap.set("searchFactor", 10.0);
        const response = await execPlan(p
            .fromView('vectors', 'persons', '')
            .annTopK(10, p.col('embedding'), p.vec.vector([1.1, 2.2, 3.3]), p.col('distance'),
                planAnnTopKOptionsMap)
            .orderBy(p.col('name'))
        );
        verifyResults(response.rows);
    });

    it('annTopK with invalid PlanAnnTopKOptions', async function () {
        const planAnnTopKOptionsMap = new Map();
        planAnnTopKOptionsMap.set('invalid', 10.0);
        
        await assert.rejects(
            async () => {
                await execPlan(p
                    .fromView('vectors', 'persons', '')
                    .annTopK(10, p.col('embedding'), p.vec.vector([1.1, 2.2, 3.3]), p.col('distance'),
                        planAnnTopKOptionsMap)
                    .orderBy(p.col('name'))
                );
            },
            (error) => {
                return error.message.toString().includes('options argument at 4 of PlanModifyPlan.annTopK() has invalid key- invalid');
            }
        );
    });

    function verifyResults(rows) {

        assert(Array.isArray(rows), 'Expected rows to be an array');
        assert(rows.length === 2, 'Expecting both rows in the view to be returned.');
        assert(rows[0].name.value === 'Alice');
        assert(rows[0].distance.type === 'xs:float', 'Verifying that the distance column was populated.');
        assert(rows[1].name.value === 'Bob');
        assert(rows[1].distance.type === 'xs:float',  'Verifying that the distance column was populated.');
        
        // Verify each row has the expected structure
        rows.forEach((row, index) => {
            assert(row.name && row.name.value, `Row ${index} should have a name with a value`);
            assert(row.distance && row.distance.type === 'xs:float', 
                `Row ${index} should have a distance column of type xs:float`);
        });
    }
});