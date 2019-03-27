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
const explainPlan = pbb.explainPlan;
const getResults = pbb.getResults;

describe('processor', function() {
  describe('prepare', function() {
    it('optimize level', function(done) {
      execPlan(
        p.fromLiterals([
          {id:1, val: 2},
          {id:2, val: 4}
          ])
        .orderBy('id')
        .prepare(2)
        )
      .then(function(response) {
        const output = getResults(response);
        should(output.length).equal(2);
        should(output[0].id.value).equal(1);
        should(output[0].val.value).equal(2);
        should(output[1].id.value).equal(2);
        should(output[1].val.value).equal(4);
        done();
        })
      .catch(done);
    });
  });
  describe('result', function() {
    it('as implicit object sequence', function(done) {
      execPlan(
        p.fromLiterals([
            {id:1, val: 2},
            {id:2, val: 4}
            ])
          .orderBy('id')
        )
      .then(function(response) {
        const output = getResults(response);
        should(output.length).equal(2);
        should(output[0].id.value).equal(1);
        should(output[0].val.value).equal(2);
        should(output[1].id.value).equal(2);
        should(output[1].val.value).equal(4);
        done();
        })
      .catch(done);
    });
    it('as explicit object sequence', function(done) {
      execPlan(
        p.fromLiterals([
            {id:1, val: 2},
            {id:2, val: 4}
            ])
          .orderBy('id'),
        null,
        'object'
        )
      .then(function(response) {
        const output = getResults(response);
        should(output.length).equal(2);
        should(output[0].id.value).equal(1);
        should(output[0].val.value).equal(2);
        should(output[1].id.value).equal(2);
        should(output[1].val.value).equal(4);
        done();
        })
      .catch(done);
    });
    it('as array sequence', function(done) {
      execPlan(
        p.fromLiterals([
          {id:1, val: 2},
          {id:2, val: 4}
          ])
        .orderBy('id'),
        null,
        'array'
        )
      .then(function(response) {
        const output = getResults(response);
        should(output.length).equal(3);
        should(output[0].length).equal(2);
        let idPos  = 0;
        let valPos = 0;
        for (let i=0; i < 2; i++) {
          switch(output[0][i].name) {
          case "id":
            idPos = i;
            break;
          case "val":
            valPos = i;
            break;
          default:
            should(output[0][i]).equal('SHOULD NOT EXIST');
            break;
          }
        }
        should(idPos).be.greaterThanOrEqual(0);
        should(valPos).be.greaterThanOrEqual(0);
        should(output[1][idPos].value).equal(1);
        should(output[1][valPos].value).equal(2);
        should(output[2][idPos].value).equal(2);
        should(output[2][valPos].value).equal(4);
        done();
        })
      .catch(done);
    });
    it('with placeholder parameter', function(done) {
      execPlan(
        p.fromLiterals([
          {id:1, val: 2},
          {id:2, val: 4},
          {id:3, val: 6},
          {id:4, val: 8}
          ])
        .offsetLimit(p.param('start'), p.param('length'))
        .where(p.gt(p.col('val'), p.param('floor')))
        .select(['id', p.as('incremented', p.add(p.col('val'), p.param('increment')))]),
        {
          start:1, length:2, floor:4, increment:1
          }
        )
      .then(function(response) {
        const output = getResults(response);
        should(output.length).equal(1);
        should(output[0].id.value).equal(3);
        should(output[0].incremented.value).equal(7);
        done();
        })
      .catch(done);
    });
  });
  describe('function', function() {
    it('as array mapper', function(done) {
      execPlan(
        p.fromLiterals([
          {id:1, val: 2},
          {id:2, val: 4}
          ])
        .orderBy('id')
        .map(p.resolveFunction('arrayMapper', '/etc/optic/rowPostProcessors.sjs')),
        null,
        'array'
        )
      .then(function(response) {
        const output = getResults(response);
        should(output.length).equal(3);
        should(output[0].length).equal(3);
        let idPos  = -1;
        let valPos = -1;
        let secondsPos = -1;
        for (let i=0; i < 3; i++) {
          switch(output[0][i].name) {
          case "id":
            idPos = i;
            break;
          case "val":
            valPos = i;
            break;
          case "seconds":
            secondsPos = i;
            break;
          default:
            should(output[0][i]).equal('SHOULD NOT EXIST');
            break;
          }
        }
        should(idPos).be.greaterThanOrEqual(0);
        should(valPos).be.greaterThanOrEqual(0);
        should(secondsPos).be.greaterThanOrEqual(0);
        should(output[1][idPos].value).equal(1);
        should(output[1][valPos].value).equal(2);
        should(output[1][secondsPos].value).be.greaterThanOrEqual(0);
        should(output[1][secondsPos].value).be.lessThanOrEqual(59);
        should(output[2][idPos].value).equal(2);
        should(output[2][valPos].value).equal(4);
        should(output[2][secondsPos].value).be.greaterThanOrEqual(0);
        should(output[2][secondsPos].value).be.lessThanOrEqual(59);
        done();
        })
      .catch(done);
    });
    it('as object mapper', function(done) {
      execPlan(
        p.fromLiterals([
          {id:1, val: 2},
          {id:2, val: 4}
          ])
        .orderBy('id')
        .map(p.resolveFunction('secondsMapper', '/etc/optic/rowPostProcessors.sjs'))
        )
      .then(function(response) {
        const output = getResults(response);
        should(output.length).equal(2);
        should(output[0].id.value).equal(1);
        should(output[0].val.value).equal(2);
        should(output[0].seconds.value).be.greaterThanOrEqual(0);
        should(output[0].seconds.value).be.lessThanOrEqual(59);
        should(output[1].id.value).equal(2);
        should(output[1].val.value).equal(4);
        should(output[1].seconds.value).be.greaterThanOrEqual(0);
        should(output[1].seconds.value).be.lessThanOrEqual(59);
        done();
        })
      .catch(done);
    });
    it('as array reducer', function(done) {
      execPlan(
        p.fromLiterals([
          {val:  2},
          {val:  4},
          {val:  6},
          {val:  8}
          ])
        .orderBy('val')
        .reduce(p.resolveFunction('arrayReducer', '/etc/optic/rowPostProcessors.sjs')),
        null,
        'array'
        )
      .then(function(response) {
        const output = getResults(response);
        should(output).equal(20);
        done();
        })
      .catch(done);
    });
    it('as object reducer', function(done) {
      execPlan(
        p.fromLiterals([
          {val:  2},
          {val:  4},
          {val:  6},
          {val:  8},
          {val: 10},
          {val: 12}
          ])
        .orderBy('val')
        .reduce(p.resolveFunction('fibReducer', '/etc/optic/rowPostProcessors.sjs'))
        )
      .then(function(response) {
        const output = getResults(response);
        should(output.length).equal(6);
        should(output[0].i.value).equal(0);
        should(output[0].val.value).equal(2);
        should(output[0].fib.value).equal(0);
        should(output[1].i.value).equal(1);
        should(output[1].val.value).equal(4);
        should(output[1].fib.value).equal(1);
        should(output[2].i.value).equal(2);
        should(output[2].val.value).equal(6);
        should(output[2].fib.value).equal(1);
        should(output[3].i.value).equal(3);
        should(output[3].val.value).equal(8);
        should(output[3].fib.value).equal(2);
        should(output[4].i.value).equal(4);
        should(output[4].val.value).equal(10);
        should(output[4].fib.value).equal(3);
        should(output[5].i.value).equal(5);
        should(output[5].val.value).equal(12);
        should(output[5].fib.value).equal(5);
        done();
        })
      .catch(done);
    });
  });
  it('explain default', function(done) {
    explainPlan(
      p.fromLiterals([
            {id:1, val: 2},
            {id:2, val: 4}
            ])
      )
    .then(function(output) {
      should(output.node).equal('plan');
      should.exist(output.expr);
      done();
      })
    .catch(done);
  });
  it('explain xml', function(done) {
    explainPlan(
      p.fromLiterals([
            {id:1, val: 2},
            {id:2, val: 4}
            ]),
      'xml'
      )
    .then(function(output) {
      should.exist(output);
      done();
      })
    .catch(done);
  });
});
