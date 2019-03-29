/*
 * Copyright 2017-2019 MarkLogic Corporation
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

describe('aggregates', function() {
  it('avg', function(done) {
    execPlan(
        p.fromLiterals([
            {group:1, val:2},
            {group:1, val:4},
            {group:2, val:3},
            {group:2, val:5},
            {group:2, val:7}
            ])
          .groupBy('group', p.avg('valAvg', 'val'))
          .orderBy('group')
        )
      .then(function(response) {
        const output = getResults(response);
        should(output.length).equal(2);
        should(output[0].group.value).equal(1);
        should(output[0].valAvg.value).equal(3);
        should(output[1].group.value).equal(2);
        should(output[1].valAvg.value).equal(5);
        done();
      })
    .catch(done);
  });
  it('count on a column', function(done) {
    execPlan(
        p.fromLiterals([
            {group:1, val:2},
            {group:1, val:4},
            {group:2, val:3},
            {group:2},
            {group:2, val:7}
            ])
          .groupBy('group', p.count('valCount', 'val'))
          .orderBy('group')
        )
      .then(function(response) {
        const output = getResults(response);
        should(output.length).equal(2);
        should(output[0].group.value).equal(1);
        should(output[0].valCount.value).equal(2);
        should(output[1].group.value).equal(2);
        should(output[1].valCount.value).equal(2);
        done();
      })
    .catch(done);
  });
  it('count over rows', function(done) {
    execPlan(
        p.fromLiterals([
            {group:1, val:2},
            {group:1, val:4},
            {group:2, val:3},
            {group:2},
            {group:2, val:7}
            ])
          .groupBy('group', p.count('valCount'))
          .orderBy('group')
        )
      .then(function(response) {
        const output = getResults(response);
        should(output.length).equal(2);
        should(output[0].group.value).equal(1);
        should(output[0].valCount.value).equal(2);
        should(output[1].group.value).equal(2);
        should(output[1].valCount.value).equal(3);
        done();
      })
    .catch(done);
  });
  it('arrayAggregate', function(done) {
    execPlan(
        p.fromLiterals([
            {group:1, val:2},
            {group:1, val:4},
            {group:2, val:3},
            {group:2, val:5},
            {group:2, val:7}
            ])
          .groupBy('group', p.arrayAggregate('valArray', 'val'))
          .orderBy('group')
        )
      .then(function(response) {
        const output = getResults(response);
        should(output.length).equal(2);
        should(output[0].group.value).equal(1);
        should(output[0].valArray.value.length).equal(2);
        should(output[0].valArray.value[0]).equal(2);
        should(output[0].valArray.value[1]).equal(4);
        should(output[1].group.value).equal(2);
        should(output[1].valArray.value.length).equal(3);
        should(output[1].valArray.value[0]).equal(3);
        should(output[1].valArray.value[1]).equal(5);
        should(output[1].valArray.value[2]).equal(7);
        done();
      })
    .catch(done);
  });
  it('groupConcat', function(done) {
    execPlan(
        p.fromLiterals([
            {group:1, val:2},
            {group:1, val:4},
            {group:2, val:3},
            {group:2, val:5},
            {group:2, val:7, extra:'a'},
            {group:2, val:7, extra:'b'}
            ])
          .groupBy('group', p.groupConcat('valGroupConcat', 'val', {separator:'-', values:'distinct'}))
          .orderBy('group')
        )
      .then(function(response) {
        const output = getResults(response);
        should(output.length).equal(2);
        should(output[0].group.value).equal(1);
        should(output[0].valGroupConcat.value).equal('2-4');
        should(output[1].group.value).equal(2);
        should(output[1].valGroupConcat.value).equal('3-5-7');
        done();
      })
    .catch(done);
  });
  it('sequenceAggregate', function(done) {
    execPlan(
        p.fromLiterals([
            {group:1, val:2},
            {group:1, val:4},
            {group:2, val:3},
            {group:2, val:5},
            {group:2, val:7}
            ])
          .groupBy('group', p.sequenceAggregate('valSequence', 'val'))
          .orderBy('group')
        )
      .then(function(response) {
        const output = getResults(response);
        should(output.length).equal(2);
        should(output[0].group.value).equal(1);
        should(output[0].valSequence.value.length).equal(2);
        should(output[0].valSequence.value[0]).equal(2);
        should(output[0].valSequence.value[1]).equal(4);
        should(output[1].group.value).equal(2);
        should(output[1].valSequence.value.length).equal(3);
        should(output[1].valSequence.value[0]).equal(3);
        should(output[1].valSequence.value[1]).equal(5);
        should(output[1].valSequence.value[2]).equal(7);
        done();
      })
    .catch(done);
  });
  it('max', function(done) {
    execPlan(
        p.fromLiterals([
            {group:1, val:2},
            {group:1, val:4},
            {group:2, val:3},
            {group:2, val:5},
            {group:2, val:7}
            ])
          .groupBy('group', p.max('valMax', 'val'))
          .orderBy('group')
        )
      .then(function(response) {
        const output = getResults(response);
        should(output.length).equal(2);
        should(output[0].group.value).equal(1);
        should(output[0].valMax.value).equal(4);
        should(output[1].group.value).equal(2);
        should(output[1].valMax.value).equal(7);
        done();
      })
    .catch(done);
  });
  it('min', function(done) {
    execPlan(
        p.fromLiterals([
            {group:1, val:2},
            {group:1, val:4},
            {group:2, val:3},
            {group:2, val:5},
            {group:2, val:7}
            ])
          .groupBy('group', p.min('valMin', 'val'))
          .orderBy('group')
        )
      .then(function(response) {
        const output = getResults(response);
        should(output.length).equal(2);
        should(output[0].group.value).equal(1);
        should(output[0].valMin.value).equal(2);
        should(output[1].group.value).equal(2);
        should(output[1].valMin.value).equal(3);
        done();
      })
    .catch(done);
  });
  it('sample', function(done) {
    execPlan(
        p.fromLiterals([
            {group:1, check:'A', val:2},
            {group:1, check:'A', val:4},
            {group:2, check:'B', val:3},
            {group:2, check:'B', val:5},
            {group:2, check:'B', val:7}
            ])
          .groupBy('group', [p.sample('checkSample', 'check'), p.avg('valAvg', 'val')])
          .orderBy('group')
        )
      .then(function(response) {
        const output = getResults(response);
        should(output.length).equal(2);
        should(output[0].group.value).equal(1);
        should(output[0].checkSample.value).equal('A');
        should(output[0].valAvg.value).equal(3);
        should(output[1].group.value).equal(2);
        should(output[1].checkSample.value).equal('B');
        should(output[1].valAvg.value).equal(5);
        done();
      })
    .catch(done);
  });
  it('sum', function(done) {
    execPlan(
        p.fromLiterals([
            {group:1, val:2},
            {group:1, val:4},
            {group:2, val:3},
            {group:2, val:5},
            {group:2, val:7}
            ])
          .groupBy('group', p.sum('valSum', 'val'))
          .orderBy('group')
        )
      .then(function(response) {
        const output = getResults(response);
        should(output.length).equal(2);
        should(output[0].group.value).equal(1);
        should(output[0].valSum.value).equal(6);
        should(output[1].group.value).equal(2);
        should(output[1].valSum.value).equal(15);
        done();
      })
    .catch(done);
  });
  it('with duplicate values', function(done) {
    execPlan(
        p.fromLiterals([
            {row:1, group:1, val:2},
            {row:2, group:1, val:4},
            {row:3, group:1, val:2},
            {row:4, group:2, val:3},
            {row:5, group:2, val:5},
            {row:6, group:2, val:7},
            {row:7, group:2, val:5}
            ])
          .groupBy('group', p.count('valCount', 'val'))
          .orderBy('group')
        )
      .then(function(response) {
        const output = getResults(response);
        should(output.length).equal(2);
        should(output[0].group.value).equal(1);
        should(output[0].valCount.value).equal(3);
        should(output[1].group.value).equal(2);
        should(output[1].valCount.value).equal(4);
        done();
      })
    .catch(done);
  });
  it('with distinct values', function(done) {
    execPlan(
        p.fromLiterals([
            {row:1, group:1, val:2},
            {row:2, group:1, val:4},
            {row:3, group:1, val:2},
            {row:4, group:2, val:3},
            {row:5, group:2, val:5},
            {row:6, group:2, val:7},
            {row:7, group:2, val:5}
            ])
          .groupBy('group', p.count('valCount', 'val', {values:'distinct'}))
          .orderBy('group')
        )
      .then(function(response) {
        const output = getResults(response);
        should(output.length).equal(2);
        should(output[0].group.value).equal(1);
        should(output[0].valCount.value).equal(2);
        should(output[1].group.value).equal(2);
        should(output[1].valCount.value).equal(3);
        done();
      })
    .catch(done);
  });
});
