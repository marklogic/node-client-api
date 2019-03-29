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

describe('modifier', function() {
  describe('for literals', function() {
    it('with where', function(done) {
      execPlan(
          p.fromLiterals([
              {id:1, name:'Master 1', date:'2015-12-01'},
              {id:2, name:'Master 2', date:'2015-12-02'}
              ])
            .where(p.eq(p.col('id'),1))
          )
        .then(function(response) {
          const output = getResults(response);
          should(output.length).equal(1);
          should(output[0].id.value).equal(1);
          should(output[0].name.value).equal('Master 1');
          should(output[0].date.value).equal('2015-12-01');
          done();
        }).catch(done);
    });
    it('with column where', function(done) {
      execPlan(
          p.fromLiterals([
            {id:1, condition:true},
            {id:2, condition:false}
            ])
            .where(p.col('condition'))
          )
        .then(function(response) {
          const output = getResults(response);
          should(output.length).equal(1);
          should(output[0].id.value).equal(1);
          should(output[0].condition.value).equal(true);
          done();
        })
      .catch(done);
    });
    it('with SQL condition where', function(done) {
      execPlan(
        p.fromLiterals([
            {id:1, name:'Master 1', date:'2015-12-01'},
            {id:2, name:'Master 2', date:'2015-12-02'}
            ])
          .where(p.sqlCondition('id BETWEEN 0.5 AND 1.5'))
        )
      .then(function(response) {
        const output = getResults(response);
        should(output.length).equal(1);
        should(output[0].id.value).equal(1);
        should(output[0].name.value).equal('Master 1');
        should(output[0].date.value).equal('2015-12-01');
        done();
      })
        .catch(done);
    });
    it('with whereDistinct', function(done) {
      execPlan(
          p.fromLiterals([
            {id:1, name:'Detail 1', masterId:1, amount:10.01, color:'blue'},
            {id:2, name:'Detail 2', masterId:2, amount:20.02, color:'blue'},
            {id:3, name:'Detail 3', masterId:1, amount:30.03, color:'blue'},
            {id:4, name:'Detail 4', masterId:2, amount:40.04, color:'green'},
            {id:5, name:'Detail 5', masterId:1, amount:50.05, color:'green'},
            {id:6, name:'Detail 6', masterId:2, amount:60.06, color:'green'}
            ])
            .select('color')
            .whereDistinct()
            .orderBy('color')
          )
        .then(function(response) {
          const output = getResults(response);
          should(output.length).equal(2);
          should(output[0].color.value).equal('blue');
          should(output[1].color.value).equal('green');
          done();
        })
      .catch(done);
    });
    it('with select', function(done) {
      execPlan(
          p.fromLiterals([
            {id:1, name:'Master 1', date:'2015-12-01'},
            {id:2, name:'Master 2', date:'2015-12-02'}
            ])
            .select(['id', 'name'])
          )
        .then(function(response) {
          const output = getResults(response);
          should(output.length).equal(2);
          should(output[0].id.value).equal(1);
          should(output[0].name.value).equal('Master 1');
          should(output[0].date).equal(void 0);
          should(output[1].id.value).equal(2);
          should(output[1].name.value).equal('Master 2');
          should(output[1].date).equal(void 0);
          done();
        })
      .catch(done);
    });
    it('with qualified select', function(done) {
      execPlan(
          p.fromLiterals([
            {id:1, name:'Master 1', date:'2015-12-01'},
            {id:2, name:'Master 2', date:'2015-12-02'}
            ])
            .select(['id', 'name'], 'selqual')
          )
        .then(function(response) {
          const output = getResults(response);
          should(output.length).equal(2);
          should(output[0]['selqual.id'].value).equal(1);
          should(output[0]['selqual.name'].value).equal('Master 1');
          should(output[0]['selqual.date']).equal(void 0);
          should(output[1]['selqual.id'].value).equal(2);
          should(output[1]['selqual.name'].value).equal('Master 2');
          should(output[1]['selqual.date']).equal(void 0);
          done();
        })
      .catch(done);
    });
    it('with orderBy', function(done) {
      execPlan(
          p.fromLiterals([
            {id:1, name:'Detail 1', masterId:1, amount:10.01, color:'blue'},
            {id:2, name:'Detail 2', masterId:2, amount:20.02, color:'blue'},
            {id:3, name:'Detail 3', masterId:1, amount:30.03, color:'blue'},
            {id:4, name:'Detail 4', masterId:2, amount:40.04, color:'green'},
            {id:5, name:'Detail 5', masterId:1, amount:50.05, color:'green'},
            {id:6, name:'Detail 6', masterId:2, amount:60.06, color:'green'}
            ])
            .orderBy(['masterId', 'id'])
          )
        .then(function(response) {
          const output = getResults(response);
          should(output.length).equal(6);
          should(output[0].id.value).equal(1);
          should(output[0].masterId.value).equal(1);
          should(output[1].id.value).equal(3);
          should(output[1].masterId.value).equal(1);
          should(output[2].id.value).equal(5);
          should(output[2].masterId.value).equal(1);
          should(output[3].id.value).equal(2);
          should(output[3].masterId.value).equal(2);
          should(output[4].id.value).equal(4);
          should(output[4].masterId.value).equal(2);
          should(output[5].id.value).equal(6);
          should(output[5].masterId.value).equal(2);
          done();
        })
      .catch(done);
    });
    it('with groupBy on key', function(done) {
      execPlan(
          p.fromLiterals([
            {id:1, name:'Detail 1', masterId:1, amount:10.01, color:'blue'},
            {id:2, name:'Detail 2', masterId:2, amount:20.02, color:'blue'},
            {id:3, name:'Detail 3', masterId:1, amount:30.03, color:'blue'},
            {id:4, name:'Detail 4', masterId:2, amount:40.04, color:'green'},
            {id:5, name:'Detail 5', masterId:1, amount:50.05, color:'green'},
            {id:6, name:'Detail 6', masterId:2, amount:60.06, color:'green'}
            ])
            .groupBy('masterId', [p.count('detailCount', 'id'), p.sum('detailSum', 'id')])
            .orderBy(['masterId'])
          )
        .then(function(response) {
          const output = getResults(response);
          should(output.length).equal(2);
          should(output[0].masterId.value).equal(1);
          should(output[0].detailCount.value).equal(3);
          should(output[0].detailSum.value).equal(9);
          should(output[1].masterId.value).equal(2);
          should(output[1].detailCount.value).equal(3);
          should(output[1].detailSum.value).equal(12);
          done();
        })
      .catch(done);
    });
    it('with groupBy over all', function(done) {
      execPlan(
          p.fromLiterals([
            {id:1, name:'Detail 1', masterId:1, amount:10.01, color:'blue'},
            {id:2, name:'Detail 2', masterId:2, amount:20.02, color:'blue'},
            {id:3, name:'Detail 3', masterId:1, amount:30.03, color:'blue'},
            {id:4, name:'Detail 4', masterId:2, amount:40.04, color:'green'},
            {id:5, name:'Detail 5', masterId:1, amount:50.05, color:'green'},
            {id:6, name:'Detail 6', masterId:2, amount:60.06, color:'green'}
            ])
            .groupBy(null, [p.count('detailCount', 'id'), p.sum('detailSum', 'id')])
          )
        .then(function(response) {
          const output = getResults(response);
          should(output.length).equal(1);
          should(output[0].detailCount.value).equal(6);
          should(output[0].detailSum.value).equal(21);
          done();
        })
      .catch(done);
    });
    it('with offsetLimit', function(done) {
      execPlan(
          p.fromLiterals([
            {id:1, name:'Detail 1', masterId:1, amount:10.01, color:'blue'},
            {id:2, name:'Detail 2', masterId:2, amount:20.02, color:'blue'},
            {id:3, name:'Detail 3', masterId:1, amount:30.03, color:'blue'},
            {id:4, name:'Detail 4', masterId:2, amount:40.04, color:'green'},
            ])
            .orderBy('id')
            .offsetLimit(1, 2)
          )
        .then(function(response) {
          const output = getResults(response);
          should(output.length).equal(2);
          should(output[0].id.value).equal(2);
          should(output[0].masterId.value).equal(2);
          should(output[1].id.value).equal(3);
          should(output[1].masterId.value).equal(1);
          done();
        })
      .catch(done);
    });
    it('with offset', function(done) {
      execPlan(
          p.fromLiterals([
            {id:1, name:'Detail 1', masterId:1, amount:10.01, color:'blue'},
            {id:2, name:'Detail 2', masterId:2, amount:20.02, color:'blue'},
            {id:3, name:'Detail 3', masterId:1, amount:30.03, color:'blue'},
            ])
            .orderBy('id')
            .offset(1)
          )
        .then(function(response) {
          const output = getResults(response);
          should(output.length).equal(2);
          should(output[0].id.value).equal(2);
          should(output[0].masterId.value).equal(2);
          should(output[1].id.value).equal(3);
          should(output[1].masterId.value).equal(1);
          done();
        })
      .catch(done);
    });
    it('with limit', function(done) {
      execPlan(
          p.fromLiterals([
            {id:2, name:'Detail 2', masterId:2, amount:20.02, color:'blue'},
            {id:3, name:'Detail 3', masterId:1, amount:30.03, color:'blue'},
            {id:4, name:'Detail 4', masterId:2, amount:40.04, color:'green'},
            ])
            .orderBy('id')
            .limit(2)
          )
        .then(function(response) {
          const output = getResults(response);
          should(output.length).equal(2);
          should(output[0].id.value).equal(2);
          should(output[0].masterId.value).equal(2);
          should(output[1].id.value).equal(3);
          should(output[1].masterId.value).equal(1);
          done();
        })
      .catch(done);
    });
    it('with named parameters', function(done) {
      execPlan(
          p.fromLiterals({rows:[
            {id:1, name:'Detail 1', masterId:1, amount:10.01, color:'blue'},
            {id:2, name:'Detail 2', masterId:2, amount:20.02, color:'blue'},
            {id:3, name:'Detail 3', masterId:1, amount:30.03, color:'blue'},
            {id:4, name:'Detail 4', masterId:2, amount:40.04, color:'green'},
            {id:5, name:'Detail 5', masterId:1, amount:50.05, color:'green'},
            {id:6, name:'Detail 6', masterId:2, amount:60.06, color:'green'}
            ]})
            .where({condition:p.not(p.eq(p.col('id'),0))})
            .groupBy({keys:'masterId', aggregates:[
              p.count('detailCount', 'id'), p.sum('detailSum', 'id')
              ]})
            .orderBy({keys:['masterId']})
            .select({columns:['masterId', 'detailCount']})
            .offsetLimit(1, 1)
          )
        .then(function(response) {
          const output = getResults(response);
          should(output.length).equal(1);
          should(output[0].masterId.value).equal(2);
          should(output[0].detailCount.value).equal(3);
          done();
        })
      .catch(done);
    });
  });
  describe('with as expression binding', function() {
    it('for select', function(done) {
      execPlan(
          p.fromLiterals([
              {row:1, val:8},
              {row:2, val:6},
              {row:3, val:4}
              ])
            .select(p.as('added', p.add(p.col('row'), p.col('val'))))
          )
        .then(function(response) {
          const output = getResults(response);
          should(output.length).equal(3);
          should(output[0].added.value).equal(9);
          should(output[1].added.value).equal(8);
          should(output[2].added.value).equal(7);
          done();
        })
      .catch(done);
    });
    it('for orderBy', function(done) {
      execPlan(
          p.fromLiterals([
              {row:1, val:8},
              {row:2, val:6},
              {row:3, val:4}
              ])
            .orderBy(p.as('added', p.add(p.col('row'), p.col('val'))))
          )
        .then(function(response) {
          const output = getResults(response);
          should(output.length).equal(3);
          should(output[0].added.value).equal(7);
          should(output[0].row.value).equal(3);
          should(output[0].val.value).equal(4);
          should(output[1].added.value).equal(8);
          should(output[1].row.value).equal(2);
          should(output[1].val.value).equal(6);
          should(output[2].added.value).equal(9);
          should(output[2].row.value).equal(1);
          should(output[2].val.value).equal(8);
          done();
        })
      .catch(done);
    });
    it('for groupBy key', function(done) {
      execPlan(
          p.fromLiterals([
              {partA:1, partB:4},
              {partA:2, partB:3},
              {partA:1, partB:6},
              {partA:2, partB:5},
              {partA:3, partB:4}
              ])
            .groupBy(p.as('added', p.add(p.col('partA'), p.col('partB'))), p.count('partCount', 'partB'))
            .orderBy('added')
          )
        .then(function(response) {
          const output = getResults(response);
          should(output.length).equal(2);
          should(output[0].added.value).equal(5);
          should(output[0].partCount.value).equal(2);
          should(output[1].added.value).equal(7);
          should(output[1].partCount.value).equal(3);
          done();
        })
      .catch(done);
    });
    it('for groupBy aggregate', function(done) {
      execPlan(
          p.fromLiterals([
              {group:1, partA:1, partB:4},
              {group:1, partA:2, partB:3},
              {group:2, partA:1, partB:6},
              {group:2, partA:2, partB:5},
              {group:2, partA:3, partB:4}
              ])
            .orderBy('group')
            .groupBy('group', p.sum('partSum', p.as('added', p.add(p.col('partA'), p.col('partB')))))
          )
        .then(function(response) {
          const output = getResults(response);
          should(output.length).equal(2);
          should(output[0].group.value).equal(1);
          should(output[0].partSum.value).equal(10);
          should(output[1].group.value).equal(2);
          should(output[1].partSum.value).equal(21);
          done();
        })
      .catch(done);
    });
  });
  it('for groupBy with implicit sample aggregate', function(done) {
    execPlan(
        p.fromLiterals([
            {group:1, groupVal:'A', detail:11},
            {group:1, groupVal:'A', detail:12},
            {group:2, groupVal:'B', detail:21},
            {group:2, groupVal:'B', detail:22},
            {group:2, groupVal:'B', detail:23}
            ])
          .groupBy('group', ['groupVal', 'detail'])
          .orderBy('group')
        )
      .then(function(response) {
        const output = getResults(response);
        should(output.length).equal(2);
        should(output[0].group.value).equal(1);
        should(output[0].groupVal.value).equal('A');
        should(output[0].detail.value).within(11,12);
        should(output[1].group.value).equal(2);
        should(output[1].groupVal.value).equal('B');
        should(output[1].detail.value).within(21,23);
        done();
      })
    .catch(done);
  });
  it('for ascending and descending orderBy', function(done) {
    execPlan(
        p.fromLiterals([
            {row:1, keyA:8, keyB:3},
            {row:2, keyA:4, keyB:3},
            {row:3, keyA:8, keyB:7},
            {row:4, keyA:4, keyB:7}
            ])
          .orderBy([p.asc('keyA'), p.desc('keyB')])
        )
      .then(function(response) {
        const output = getResults(response);
        should(output.length).equal(4);
        should(output[0].row.value).equal(4);
        should(output[0].keyA.value).equal(4);
        should(output[0].keyB.value).equal(7);
        should(output[1].row.value).equal(2);
        should(output[1].keyA.value).equal(4);
        should(output[1].keyB.value).equal(3);
        should(output[2].row.value).equal(3);
        should(output[2].keyA.value).equal(8);
        should(output[2].keyB.value).equal(7);
        should(output[3].row.value).equal(1);
        should(output[3].keyA.value).equal(8);
        should(output[3].keyB.value).equal(3);
        done();
      })
    .catch(done);
  });
});
