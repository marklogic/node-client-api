/*
* Copyright (c) 2015-2026 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/
'use strict';

const should = require('should');

const marklogic = require('../');
const p = marklogic.planBuilder;

const pbb = require('./plan-builder-base');
const assert = require('assert');
const testlib = require('../etc/test-lib');
const { restWriterConnection } = require('../etc/test-config');
let serverConfiguration = {};
const tcGraph       = p.graphCol('http://test.optic.tc#');
const tcLabel       = p.sem.iri('http://test.optic.tc#label');
const person        = p.col('person');
const parent        = p.col('parent');
const ancestor      = p.col('ancestor');
const parentProp    = p.sem.iri('http://marklogic.com/transitiveClosure/parent');
const execPlan = pbb.execPlan;

describe('tests for server-side transitive-closure method.', function () {
    before(function (done) {
        this.timeout(6000);
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

    it('with simple pattern full transitive closure', function (done) {
        execPlan(
            p.fromTriples([
                p.pattern(person, parentProp, ancestor, tcGraph)
            ]
            ).transitiveClosure(person, ancestor)
            .orderBy([ancestor, person])
        )
        .then(function (response) {
            const rows = response.rows;
            rows.length.should.equal(21);
            rows[0].should.have.property('person');
            rows[0].should.have.property('ancestor');
            done();
        })
        .catch(done);
    });

    it('with simple pattern minLength=2, transitive closure grandparents and up', function (done) {
        execPlan(
            p.fromTriples([
                p.pattern(person, parentProp, ancestor, tcGraph)
            ]
            ).transitiveClosure(person, ancestor, {'min-length': 2})
        )
        .then(function (response) {
            const rows = response.rows;
            // 2 steps or more excludes direct parent-child relationships
            rows.length.should.equal(12);
            rows[0].should.have.property('person');
            rows[0].should.have.property('ancestor');
            done();
        })
        .catch(done);
    });

    it('with simple pattern minLength=2, maxLength=2, transitive closure grandparents only', function (done) {
        execPlan(
            p.fromTriples([
                p.pattern(person, parentProp, ancestor, tcGraph)
            ]
            ).transitiveClosure(person, ancestor, {minLength: 2, maxLength: 2})
        )
        .then(function (response) {
            const rows = response.rows;
            // 2 steps only is grandparent relationships only
            rows.length.should.equal(6);
            rows[0].should.have.property('person');
            rows[0].should.have.property('ancestor');
            done();
        })
        .catch(done);
    });

    it('with simple pattern transitive closure with parent column as ancestor', function (done) {
        execPlan(
            p.fromTriples([
                p.pattern(person, parentProp, parent, tcGraph)
            ]
            ).transitiveClosure(person, p.as("ancestor", parent))
        )
        .then(function (response) {
            const rows = response.rows;
            rows.length.should.equal(21);
            rows[0].should.have.property('person');
            rows[0].should.have.property('ancestor');
            done();
        })
        .catch(done);
    });

    it('with simple pattern transitive closure join to get labels', function (done) {
        this.timeout(5000);
        execPlan(
            p.fromTriples([
                p.pattern(person, parentProp, ancestor, tcGraph)
            ])
            .transitiveClosure(person, ancestor)
            .joinLeftOuter(
                p.fromTriples([
                    p.pattern(person, tcLabel, p.col('person_name'))
                ])
            )
            .joinLeftOuter(
                p.fromTriples([
                    p.pattern(ancestor, tcLabel, p.col('ancestor_name'))
                ])
            )
        )
        .then(function (response) {
            const rows = response.rows;
            rows.length.should.equal(21);
            rows[0].should.have.property('person');
            rows[0].should.have.property('ancestor');
            rows[0].should.have.property('person_name');
            rows[0].should.have.property('ancestor_name');
            done();
        })
        .catch(done);
    });

});
