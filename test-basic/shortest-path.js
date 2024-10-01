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
const assert = require('assert');
const testlib = require('../etc/test-lib');
let serverConfiguration = {};
const datastore     = p.col('datastore');
const titleCol      = p.col('title');
const datastoreType = p.sem.iri('http://purl.org/dc/dcmitype/Dataset');
const dc            = p.prefixer('http://purl.org/dc/terms/');
const typeProp      = dc('type');
const titleProp     = dc('title');
const execPlan = pbb.execPlan;

describe('tests for server-side shortest-path method.', function () {
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

    it('with bare patterns', function (done) {
        execPlan(
            p.fromTriples([
                p.pattern(datastore, typeProp,  datastoreType),
                p.pattern(datastore, titleProp, titleCol)
            ],
            'tripview').shortestPath(p.col('datastore'), p.col('title'), p.col('path'), p.col('length'))
        )
            .then(function (response) {
                const rows = response.rows;
                assert(rows[0].datastore.value === '/datastore/id#A', 'datastore value for A not as expected');
                assert(rows[0].title.value === 'The A datastore', 'title for A not as expected');
                should.exist(rows[0].length);
                should.exist(rows[0].path);
                assert(rows[1].datastore.value === '/datastore/id#B', 'datastore value for B not as expected');
                assert(rows[1].title.value === 'The B datastore', 'title for B not as expected');
                should.exist(rows[1].length);
                should.exist(rows[1].path);
                done();
            })
            .catch(done);
    });

    it('with multiple literals', function (done) {
        execPlan(
            p.fromTriples(
                p.pattern(
                    p.col('identified'),
                    p.col('title'),
                    [1, 2]
                )).shortestPath(p.col('identified'), p.col('title'), p.col('path'), p.col('length'))
        )
            .then(function (response) {
                const rows = response.rows;
                for (let i = 0; i < rows.length; i++) {
                    should.exist(rows[i].identified);
                    should.exist(rows[i].title);
                    should.exist(rows[i].length);
                    should.exist(rows[i].path);
                }
                done();
            })
            .catch(done);
    });
});