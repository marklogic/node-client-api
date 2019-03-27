/*
 * Copyright 2016-2019 MarkLogic Corporation
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

describe('literals', function() {
  const runnerMod = '/ext/optic/querytester.sjs';
  describe('accessor', function() {
    it('as objects', function(done) {
      execPlan(
        p.fromLiterals([
                {orderId: 1, orderExtra: 'First extra'},
                {orderId: 2, orderExtra: 'Second extra'}
            ],
            'lit')
        )
      .then(function(response) {
        const output = getResults(response);
        should(output[0]['lit.orderId'].value).equal(1);
        should(output[0]['lit.orderExtra'].value).equal('First extra');
        should(output[1]['lit.orderId'].value).equal(2);
        should(output[1]['lit.orderExtra'].value).equal('Second extra');
        done();
      })
    .catch(done);
    });
    it('as arrays', function(done) {
      execPlan(
        p.fromLiterals({
            columnNames: ['orderId', 'orderExtra'],
            rowValues:   [
                [1, 'First extra'],
                [2, 'Second extra']
                ]
            })
        )
      .then(function(response) {
        const output = getResults(response);
        should(output.length).equal(2);
        should(output[0].orderId.value).equal(1);
        should(output[0].orderExtra.value).equal('First extra');
        should(output[1].orderId.value).equal(2);
        should(output[1].orderExtra.value).equal('Second extra');
        done();
      })
    .catch(done);
    });
    it('having col method', function(done) {
      const accessor = p.fromLiterals([
            {orderId: 1, orderExtra: 'First extra'}
            ],
            'lit');
      const colPlan = accessor.select(accessor.col('orderId'));
      const value = colPlan.export();
      should(value.$optic.args.length).equal(2);
      should(value.$optic.args[1].args.length).equal(1);
      should(value.$optic.args[1].args[0]).deepEqual(
        {ns:'op', fn:'view-col', args:['lit', 'orderId']}
      );
      execPlan(
        colPlan
      )
        .then(function(response) {
          const output = getResults(response);
          should(output.length).equal(1);
          should(output[0]['lit.orderId'].value).equal(1);
          done();
        })
        .catch(done);
    });
  });
  // see other unit tests for other operations on literals
});
