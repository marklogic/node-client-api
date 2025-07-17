/*
* Copyright © 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
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
    it('with bind', function(done) {
      execPlan(
          p.fromLiterals([
             {row:1, low:4, high:8},
             {row:2, low:3, high:6},
             {row:3, low:2, high:4}
             ])
           .bind([
             p.as(p.col('added'), p.add(p.col('low'), p.col('high'))),
             p.as('subtracted',   p.subtract(p.col('high'), p.col('low'))),
             p.as('compared',     p.eq(p.col('low'), 3)),
             p.as('concatted',    p.fn.concat(p.col('low'), p.col('high')))
             ])
      ).then(function(response) {
            const output = getResults(response);
            should(output.length).equal(3);
            should(output[0].low.value).equal(4);
            should(output[0].high.value).equal(8);
            should(output[0].added.value).equal(12);
            should(output[0].subtracted.value).equal(4);
            should(output[0].compared.value).equal(false);
            should(output[0].concatted.value).equal('48');
            should(output[1].low.value).equal(3);
            should(output[1].high.value).equal(6);
            should(output[1].added.value).equal(9);
            should(output[1].subtracted.value).equal(3);
            should(output[1].compared.value).equal(true);
            should(output[1].concatted.value).equal('36');
            should(output[2].low.value).equal(2);
            should(output[2].high.value).equal(4);
            should(output[2].added.value).equal(6);
            should(output[2].subtracted.value).equal(2);
            should(output[2].compared.value).equal(false);
            should(output[2].concatted.value).equal('24');
            done();
          }).catch(done);
    });
    it('with bindAs', function(done) {
      execPlan(
          p.fromLiterals([
             {row:1, low:4, high:8},
             {row:2, low:3, high:6},
             {row:3, low:2, high:4}
             ])
           .bindAs(p.col('added'), p.add(p.col('low'), p.col('high')))
           .bindAs('subtracted',    p.subtract(p.col('high'), p.col('low')))
           .bindAs('compared',      p.eq(p.col('low'), 3))
           .bindAs('concatted',     p.fn.concat(p.col('low'), p.col('high')))
      )
          .then(function(response) {
            const output = getResults(response);
            should(output.length).equal(3);
            should(output[0].low.value).equal(4);
            should(output[0].high.value).equal(8);
            should(output[0].added.value).equal(12);
            should(output[0].subtracted.value).equal(4);
            should(output[0].compared.value).equal(false);
            should(output[0].concatted.value).equal('48');
            should(output[1].low.value).equal(3);
            should(output[1].high.value).equal(6);
            should(output[1].added.value).equal(9);
            should(output[1].subtracted.value).equal(3);
            should(output[1].compared.value).equal(true);
            should(output[1].concatted.value).equal('36');
            should(output[2].low.value).equal(2);
            should(output[2].high.value).equal(4);
            should(output[2].added.value).equal(6);
            should(output[2].subtracted.value).equal(2);
            should(output[2].compared.value).equal(false);
            should(output[2].concatted.value).equal('24');
            done();
          }).catch(done);
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
    it('with group for groupByUnion', function(done) {
      execPlan(
          p.fromLiterals([
            {c1:11, c2:21, v:2},
            {c1:12, c2:21, v:2},
            {c1:12, c2:22, v:2}
          ])
              .groupByUnion([p.group(), p.group(['c1', p.col('c2')])], [
                p.hasGroupKey('c1Flag', 'c1'), p.hasGroupKey(p.col('c2Flag'), p.col('c2')),
                p.count('count'), p.sum('sum', 'v')
              ])
              .orderBy(['c1Flag', 'c2Flag', 'c1', 'c2'])
      )
          .then(function(response) {
            const output = getResults(response);
            should(output.length).equal(4);
            should(output[0].c1Flag.value).equal(0);
            should(output[0].c2Flag.value).equal(0);
            should(output[0].c1.value).equal(11);
            should(output[0].c2.value).equal(21);
            should(output[0].count.value).equal(1);
            should(output[0].sum.value).equal(2);
            should(output[1].c1Flag.value).equal(0);
            should(output[1].c2Flag.value).equal(0);
            should(output[1].c1.value).equal(12);
            should(output[1].c2.value).equal(21);
            should(output[1].count.value).equal(1);
            should(output[1].sum.value).equal(2);
            should(output[2].c1Flag.value).equal(0);
            should(output[2].c2Flag.value).equal(0);
            should(output[2].c1.value).equal(12);
            should(output[2].c2.value).equal(22);
            should(output[2].count.value).equal(1);
            should(output[2].sum.value).equal(2);
            should(output[3].c1Flag.value).equal(1);
            should(output[3].c2Flag.value).equal(1);
            should(output[3].count.value).equal(3);
            should(output[3].sum.value).equal(6);
            done();
          }).catch(done);
    });
    it('with rollup for groupByUnion', function(done) {
      execPlan(
          p.fromLiterals([
            {c1:11, c2:21, v:2},
            {c1:12, c2:21, v:2},
            {c1:12, c2:22, v:2}
          ])
              .groupByUnion(p.rollup(['c1', p.col('c2')]), [
                p.hasGroupKey('c1Flag', 'c1'), p.hasGroupKey(p.col('c2Flag'), p.col('c2')),
                p.count('count'), p.sum('sum', 'v')
              ])
              .orderBy(['c1Flag', 'c2Flag', 'c1', 'c2'])
      )
          .then(function(response) {
            const output = getResults(response);
            should(output.length).equal(6);
            should(output[0].c1Flag.value).equal(0);
            should(output[0].c2Flag.value).equal(0);
            should(output[0].c1.value).equal(11);
            should(output[0].c2.value).equal(21);
            should(output[0].count.value).equal(1);
            should(output[0].sum.value).equal(2);
            should(output[1].c1Flag.value).equal(0);
            should(output[1].c2Flag.value).equal(0);
            should(output[1].c1.value).equal(12);
            should(output[1].c2.value).equal(21);
            should(output[1].count.value).equal(1);
            should(output[1].sum.value).equal(2);
            should(output[2].c1Flag.value).equal(0);
            should(output[2].c2Flag.value).equal(0);
            should(output[2].c1.value).equal(12);
            should(output[2].c2.value).equal(22);
            should(output[2].count.value).equal(1);
            should(output[2].sum.value).equal(2);
            should(output[3].c1Flag.value).equal(0);
            should(output[3].c2Flag.value).equal(1);
            should(output[3].c1.value).equal(11);
            should(output[3].count.value).equal(1);
            should(output[3].sum.value).equal(2);
            should(output[4].c1Flag.value).equal(0);
            should(output[4].c2Flag.value).equal(1);
            should(output[4].c1.value).equal(12);
            should(output[4].count.value).equal(2);
            should(output[4].sum.value).equal(4);
            should(output[5].c1Flag.value).equal(1);
            should(output[5].c2Flag.value).equal(1);
            should(output[5].count.value).equal(3);
            should(output[5].sum.value).equal(6);
            done();
          }).catch(done);
    });
    it('with cube for groupByUnion', function(done) {
      execPlan(
          p.fromLiterals([
            {c1:11, c2:21, v:2},
            {c1:12, c2:21, v:2},
            {c1:12, c2:22, v:2}
          ])
              .groupByUnion(p.cube(['c1', p.col('c2')]), [
                p.hasGroupKey('c1Flag', 'c1'), p.hasGroupKey(p.col('c2Flag'), p.col('c2')),
                p.count('count'), p.sum('sum', 'v')
              ])
              .orderBy(['c1Flag', 'c2Flag', 'c1', 'c2'])
      )
          .then(function(response) {
            const output = getResults(response);
            should(output.length).equal(8);
            should(output[0].c1Flag.value).equal(0);
            should(output[0].c2Flag.value).equal(0);
            should(output[0].c1.value).equal(11);
            should(output[0].c2.value).equal(21);
            should(output[0].count.value).equal(1);
            should(output[0].sum.value).equal(2);
            should(output[1].c1Flag.value).equal(0);
            should(output[1].c2Flag.value).equal(0);
            should(output[1].c1.value).equal(12);
            should(output[1].c2.value).equal(21);
            should(output[1].count.value).equal(1);
            should(output[1].sum.value).equal(2);
            should(output[2].c1Flag.value).equal(0);
            should(output[2].c2Flag.value).equal(0);
            should(output[2].c1.value).equal(12);
            should(output[2].c2.value).equal(22);
            should(output[2].count.value).equal(1);
            should(output[2].sum.value).equal(2);
            should(output[3].c1Flag.value).equal(0);
            should(output[3].c2Flag.value).equal(1);
            should(output[3].c1.value).equal(11);
            should(output[3].count.value).equal(1);
            should(output[3].sum.value).equal(2);
            should(output[4].c1Flag.value).equal(0);
            should(output[4].c2Flag.value).equal(1);
            should(output[4].c1.value).equal(12);
            should(output[4].count.value).equal(2);
            should(output[4].sum.value).equal(4);
            should(output[5].c1Flag.value).equal(1);
            should(output[5].c2Flag.value).equal(0);
            should(output[5].c2.value).equal(21);
            should(output[5].count.value).equal(2);
            should(output[5].sum.value).equal(4);
            should(output[6].c1Flag.value).equal(1);
            should(output[6].c2Flag.value).equal(0);
            should(output[6].c2.value).equal(22);
            should(output[6].count.value).equal(1);
            should(output[6].sum.value).equal(2);
            should(output[7].c1Flag.value).equal(1);
            should(output[7].c2Flag.value).equal(1);
            should(output[7].count.value).equal(3);
            should(output[7].sum.value).equal(6);
            done();
          }).catch(done);
    });
    it('for groupToArrays', function(done) {
      execPlan(
          p.fromLiterals([
            {c1:11, c2:21, v:2},
            {c1:12, c2:21, v:2},
            {c1:12, c2:22, v:2}
          ])
              .groupToArrays([
                p.namedGroup('empty'), p.col('c1'), p.group('c2'), p.namedGroup('all', ['c1', p.col('c2')])
              ], [
                p.count('count'), p.sum('sum', 'v')
              ])
      )
          .then(function(response) {
            const output = getResults(response);
            should(output.length).equal(1);
            const row = output[0];
            should(row.empty.value.length).equal(1);
            should(row.empty.value[0].count).equal(3);
            should(row.empty.value[0].sum).equal(6);
            should(row.group1.value.length).equal(2);
            should(row.group1.value[0].c1).equal(11);
            should(row.group1.value[0].count).equal(1);
            should(row.group1.value[0].sum).equal(2);
            should(row.group1.value[1].c1).equal(12);
            should(row.group1.value[1].count).equal(2);
            should(row.group1.value[1].sum).equal(4);
            should(row.group2.value.length).equal(2);
            should(row.group2.value[0].c2).equal(21);
            should(row.group2.value[0].count).equal(2);
            should(row.group2.value[0].sum).equal(4);
            should(row.group2.value[1].c2).equal(22);
            should(row.group2.value[1].count).equal(1);
            should(row.group2.value[1].sum).equal(2);
            should(row.all.value.length).equal(3);
            should(row.all.value[0].c1).equal(11);
            should(row.all.value[0].c2).equal(21);
            should(row.all.value[0].count).equal(1);
            should(row.all.value[0].sum).equal(2);
            should(row.all.value[1].c1).equal(12);
            should(row.all.value[1].c2).equal(21);
            should(row.all.value[1].count).equal(1);
            should(row.all.value[1].sum).equal(2);
            should(row.all.value[2].c1).equal(12);
            should(row.all.value[2].c2).equal(22);
            should(row.all.value[2].count).equal(1);
            should(row.all.value[2].sum).equal(2);
            done();
          }).catch(done);
    });
    it('for facetBy', function(done) {
      execPlan(
          p.fromLiterals([
            {c1:11, c2:21, v:2},
            {c1:12, c2:21, v:2},
            {c1:12, c2:22, v:2}
          ])
              .facetBy(['c1', p.col('c2')])
      )
          .then(function(response) {
            const output = getResults(response);
            should(output.length).equal(1);
            const row = output[0];
            should(row.group0.value.length).equal(2);
            should(row.group0.value[0].c1).equal(11);
            should(row.group0.value[0].count).equal(1);
            should(row.group0.value[1].c1).equal(12);
            should(row.group0.value[1].count).equal(2);
            should(row.group1.value.length).equal(2);
            should(row.group1.value[0].c2).equal(21);
            should(row.group1.value[0].count).equal(2);
            should(row.group1.value[1].c2).equal(22);
            should(row.group1.value[1].count).equal(1);
            done();
          }).catch(done);
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
