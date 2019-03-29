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

function getValue(row, col) {
  const prefix = 'opticUnitTest.';
  return row[prefix+col].value;
}
function testValue(row, col, val) {
  should(getValue(row, col)).equal(val);
}

describe('view', function() {
  const exportedView =
    {$optic:{ns:'op', fn:'operators', args:[
      {ns:'op', fn:'from-view', args:['opticUnitTest', 'master']},
      {ns:'op', fn:'order-by',  args:['id']}
      ]}};
  const exportedQueryView =
    {$optic:{ns:'op', fn:'operators', args:[
      {ns:'op', fn:'from-view', args:['opticUnitTest', 'musician']},
      {ns:'op', fn:'where',     args:[{ns:'cts', fn:'json-property-word-query', args:['instrument', 'trumpet']}]},
      {ns:'op', fn:'order-by',  args:['lastName']}
      ]}};
  const exportedFromSQL =
    {$optic:{ns:'op', fn:'operators', args:[
      {ns:'op', fn:'from-sql', args:[
        'SELECT id, name, date FROM master WHERE id = 1'
      ]}
    ]}};
  describe('accessors', function() {
    it('basic', function(done) {
      execPlan(
        p.fromView('opticUnitTest', 'master')
              .orderBy(p.schemaCol('opticUnitTest', 'master', 'id'))
        )
      .then(function(response) {
        const output = getResults(response);
        should(output.length).equal(2);
        testValue(output[0], 'master.id',   1);
        testValue(output[0], 'master.name', 'Master 1');
        testValue(output[0], 'master.date', '2015-12-01');
        should.not.exist(output[0]['opticUnitTest.master.rowid']);
        should.not.exist(output[0]['opticUnitTest.master.__docid']);
        testValue(output[1], 'master.id',   2);
        testValue(output[1], 'master.name', 'Master 2');
        testValue(output[1], 'master.date', '2015-12-02');
        should.not.exist(output[1]['opticUnitTest.master.rowid']);
        should.not.exist(output[1]['opticUnitTest.master.__docid']);
        done();
        })
      .catch(done);
    });
    it('alias', function(done) {
      execPlan(
        p.fromView('opticUnitTest', 'master', 'optimast')
              .orderBy(p.viewCol('optimast', 'id'))
        )
      .then(function(response) {
        const output = getResults(response);
        should(output.length).equal(2);
        should(output[0]['optimast.id'].value).equal(1);
        should(output[0]['optimast.name'].value).equal('Master 1');
        should(output[0]['optimast.date'].value).equal('2015-12-01');
        should(output[1]['optimast.id'].value).equal(2);
        should(output[1]['optimast.name'].value).equal('Master 2');
        should(output[1]['optimast.date'].value).equal('2015-12-02');
        done();
        })
      .catch(done);
    });
    it('having col method', function(done) {
      const accessor  = p.fromView('opticUnitTest', 'master');
      const colPlan = accessor.select(accessor.col('id'));
      const value = colPlan.export();
      should(value.$optic.args.length).equal(2);
      should(value.$optic.args[1].args.length).equal(1);
      should(value.$optic.args[1].args[0]).deepEqual(
        {ns:'op', fn:'schema-col', args:['opticUnitTest', 'master', 'id']}
        );
      execPlan(
        colPlan
          .orderBy(accessor.col('id'))
          .limit(2)
      )
        .then(function(response) {
          const output = getResults(response);
          should(output.length).equal(2);
          should(output[0]['opticUnitTest.master.id'].value).equal(1);
          should.not.exist(output[0]['opticUnitTest.master.name']);
          should(output[1]['opticUnitTest.master.id'].value).equal(2);
          should.not.exist(output[1]['opticUnitTest.master.name']);
          done();
        })
        .catch(done);
    });
    it('having qualified col method', function(done) {
      const accessor  = p.fromView('opticUnitTest', 'master', 'idview');
      const colPlan = accessor.select(accessor.col('id'));
      const value = colPlan.export();
      should(value.$optic.args.length).equal(2);
      should(value.$optic.args[1].args.length).equal(1);
      should(value.$optic.args[1].args[0]).deepEqual(
        {ns:'op', fn:'view-col', args:['idview', 'id']}
      );
      execPlan(
        colPlan
          .orderBy(accessor.col('id'))
          .limit(2)
      )
        .then(function(response) {
          const output = getResults(response);
          should(output.length).equal(2);
          should(output[0]['idview.id'].value).equal(1);
          should.not.exist(output[0]['idview.name']);
          should(output[1]['idview.id'].value).equal(2);
          should.not.exist(output[1]['idview.name']);
          done();
        })
        .catch(done);
    });
    it('query', function(done) {
      execPlan(
        p.fromView('opticUnitTest', 'musician')
              .where(p.cts.jsonPropertyWordQuery('instrument', 'trumpet'))
              .orderBy('lastName')
        )
      .then(function(response) {
        const output = getResults(response);
        should(output.length).equal(2);
        testValue(output[0], 'musician.lastName',  'Armstrong');
        testValue(output[0], 'musician.firstName', 'Louis');
        testValue(output[0], 'musician.dob',       '1901-08-04');
        testValue(output[1], 'musician.lastName',  'Davis');
        testValue(output[1], 'musician.firstName', 'Miles');
        testValue(output[1], 'musician.dob',       '1926-05-26');
        done();
        })
      .catch(done);
    });
    it('with fragment id column', function(done) {
      execPlan(
        p.fromView('opticUnitTest', 'master', null, p.fragmentIdCol('sourceDocId'))
            .where(p.eq(p.col('id'), 1))
            .select(['id','name','sourceDocId',
                p.as('sourceDocCheck',p.isDefined(p.col('sourceDocId')))],
                '')
        )
      .then(function(response) {
        const output = getResults(response);
        should(output.length).equal(1);
        should(output[0].id.value).equal(1);
        should(output[0].name.value).equal('Master 1');
        should(output[0].sourceDocCheck.value).equal(true);
        should.not.exist(output[0].sourceDocId);
        done();
        })
      .catch(done);
    });
  });
  describe('modifiers', function() {
    it('with where', function(done) {
      execPlan(
        p.fromView('opticUnitTest', 'master')
            .where(p.eq(p.schemaCol('opticUnitTest', 'master', 'id'), 1))
        )
      .then(function(response) {
        const output = getResults(response);
        should(output.length).equal(1);
        testValue(output[0], 'master.id', 1);
        testValue(output[0], 'master.name', 'Master 1');
        testValue(output[0], 'master.date', '2015-12-01');
        done();
        })
      .catch(done);
    });
    it('with whereDistinct', function(done) {
      execPlan(
        p.fromView('opticUnitTest', 'detail')
            .select(p.schemaCol('opticUnitTest', 'detail', 'color'))
            .whereDistinct()
            .orderBy(p.schemaCol('opticUnitTest', 'detail', 'color'))
        )
      .then(function(response) {
        const output = getResults(response);
        should(output.length).equal(2);
        testValue(output[0], 'detail.color', 'blue');
        testValue(output[1], 'detail.color', 'green');
        done();
        })
      .catch(done);
    });
    it('with select', function(done) {
      execPlan(
        p.fromView('opticUnitTest', 'master')
            .select([p.schemaCol('opticUnitTest', 'master', 'id'),
                p.schemaCol('opticUnitTest', 'master', 'name')])
            .orderBy(p.schemaCol('opticUnitTest', 'master', 'id'))
        )
      .then(function(response) {
        const output = getResults(response);
        should(output.length).equal(2);
        testValue(output[0], 'master.id', 1);
        testValue(output[0], 'master.name', 'Master 1');
        should.not.exist(output[0]['opticUnitTest.master.date']);
        testValue(output[1], 'master.id', 2);
        testValue(output[1], 'master.name', 'Master 2');
        should.not.exist(output[1]['opticUnitTest.master.date']);
        done();
        })
      .catch(done);
    });
    it('without system columns', function(done) {
      execPlan(
        p.fromView('opticUnitTest', 'master')
              .select(null, '')
              .orderBy('id')
        )
      .then(function(response) {
        const output = getResults(response);
        should(output.length).equal(2);
        should(output[0].id.value).equal(1);
        should(output[0].name.value).equal('Master 1');
        should(output[0].date.value).equal('2015-12-01');
        should.not.exist(output[0]['master.rowid']);
        should.not.exist(output[0]['master.__docid']);
        should(output[1].id.value).equal(2);
        should(output[1].name.value).equal('Master 2');
        should(output[1].date.value).equal('2015-12-02');
        should.not.exist(output[1]['master.rowid']);
        should.not.exist(output[1]['master.__docid']);
        done();
        })
      .catch(done);
    });
    it('with orderBy', function(done) {
      execPlan(
        p.fromView('opticUnitTest', 'detail')
            .orderBy([p.schemaCol('opticUnitTest', 'detail', 'masterId'),
                p.schemaCol('opticUnitTest', 'detail', 'id')])
        )
      .then(function(response) {
        const output = getResults(response);
        should(output.length).equal(6);
        testValue(output[0], 'detail.id', 1);
        testValue(output[0], 'detail.masterId', 1);
        testValue(output[1], 'detail.id', 3);
        testValue(output[1], 'detail.masterId', 1);
        testValue(output[2], 'detail.id', 5);
        testValue(output[2], 'detail.masterId', 1);
        testValue(output[3], 'detail.id', 2);
        testValue(output[3], 'detail.masterId', 2);
        testValue(output[4], 'detail.id', 4);
        testValue(output[4], 'detail.masterId', 2);
        testValue(output[5], 'detail.id', 6);
        testValue(output[5], 'detail.masterId', 2);
        done();
        })
      .catch(done);
    });
    it('with groupBy', function(done) {
      execPlan(
        p.fromView('opticUnitTest', 'detail')
            .groupBy(p.schemaCol('opticUnitTest', 'detail', 'masterId'),
                p.count('detailCount', p.schemaCol('opticUnitTest', 'detail', 'id')))
            .orderBy([p.schemaCol('opticUnitTest', 'detail', 'masterId')])
        )
      .then(function(response) {
        const output = getResults(response);
        should(output.length).equal(2);
        testValue(output[0], 'detail.masterId', 1);
        should(output[0].detailCount.value).equal(3);
        testValue(output[1], 'detail.masterId', 2);
        should(output[1].detailCount.value).equal(3);
        done();
        })
      .catch(done);
    });
    it('with offsetLimit', function(done) {
      execPlan(
        p.fromView('opticUnitTest', 'detail')
            .orderBy(p.schemaCol('opticUnitTest', 'detail', 'id'))
            .offsetLimit(1, 2)
        )
      .then(function(response) {
        const output = getResults(response);
        should(output.length).equal(2);
        testValue(output[0], 'detail.id', 2);
        testValue(output[0], 'detail.masterId', 2);
        testValue(output[1], 'detail.id', 3);
        testValue(output[1], 'detail.masterId', 1);
        done();
        })
      .catch(done);
    });
  });
  describe('composers', function() {
    it('with inner join', function(done) {
      execPlan(
        p.fromView('opticUnitTest', 'master')
            .joinInner(
                p.fromView('opticUnitTest', 'detail'),
                p.on(p.schemaCol('opticUnitTest', 'master', 'id'),
                    p.schemaCol('opticUnitTest', 'detail', 'masterId'))
                )
            .orderBy([p.schemaCol('opticUnitTest', 'master', 'id'),
                p.schemaCol('opticUnitTest', 'detail', 'id')])
        )
      .then(function(response) {
        const output = getResults(response);
        should(output.length).equal(6);
        testValue(output[0], 'master.id', 1);
        testValue(output[0], 'master.name', 'Master 1');
        testValue(output[0], 'master.date', '2015-12-01');
        testValue(output[0], 'detail.id', 1);
        testValue(output[0], 'detail.name', 'Detail 1');
        testValue(output[0], 'detail.amount', 10.01);
        testValue(output[0], 'detail.color', 'blue');
        testValue(output[1], 'master.id', 1);
        testValue(output[1], 'master.date', '2015-12-01');
        testValue(output[1], 'detail.id', 3);
        testValue(output[1], 'detail.name', 'Detail 3');
        testValue(output[1], 'detail.amount', 30.03);
        testValue(output[1], 'detail.color', 'blue');
        testValue(output[2], 'master.id', 1);
        testValue(output[2], 'master.date', '2015-12-01');
        testValue(output[2], 'detail.id', 5);
        testValue(output[2], 'detail.name', 'Detail 5');
        testValue(output[2], 'detail.amount', 50.05);
        testValue(output[2], 'detail.color', 'green');
        testValue(output[3], 'master.id', 2);
        testValue(output[3], 'master.name', 'Master 2');
        testValue(output[3], 'master.date', '2015-12-02');
        testValue(output[3], 'detail.id', 2);
        testValue(output[3], 'detail.name', 'Detail 2');
        testValue(output[3], 'detail.amount', 20.02);
        testValue(output[3], 'detail.color', 'blue');
        testValue(output[4], 'master.id', 2);
        testValue(output[4], 'master.name', 'Master 2');
        testValue(output[4], 'master.date', '2015-12-02');
        testValue(output[4], 'detail.id', 4);
        testValue(output[4], 'detail.name', 'Detail 4');
        testValue(output[4], 'detail.amount', 40.04);
        testValue(output[4], 'detail.color', 'green');
        testValue(output[5], 'master.id', 2);
        testValue(output[5], 'master.name', 'Master 2');
        testValue(output[5], 'master.date', '2015-12-02');
        testValue(output[5], 'detail.id', 6);
        testValue(output[5], 'detail.name', 'Detail 6');
        testValue(output[5], 'detail.amount', 60.06);
        testValue(output[5], 'detail.color', 'green');
        done();
        })
      .catch(done);
    });
    it('with union', function(done) {
      execPlan(
        p.fromView('opticUnitTest', 'master')
            .select([p.as('unionName', p.schemaCol('opticUnitTest', 'master', 'name')),
                p.as('unionId', p.schemaCol('opticUnitTest', 'master', 'id'))])
            .union(
                p.fromView('opticUnitTest', 'detail')
                  .select([p.as('unionName', p.schemaCol('opticUnitTest', 'detail', 'name')),
                      p.as('unionId', p.schemaCol('opticUnitTest', 'detail', 'id'))])
                )
            .orderBy(['unionName', 'unionId'])
        )
      .then(function(response) {
        const output = getResults(response);
        should(output.length).equal(8);
        should(output[0].unionId.value).equal(1);
        should(output[0].unionName.value).equal('Detail 1');
        should(output[1].unionId.value).equal(2);
        should(output[1].unionName.value).equal('Detail 2');
        should(output[2].unionId.value).equal(3);
        should(output[2].unionName.value).equal('Detail 3');
        should(output[3].unionId.value).equal(4);
        should(output[3].unionName.value).equal('Detail 4');
        should(output[4].unionId.value).equal(5);
        should(output[4].unionName.value).equal('Detail 5');
        should(output[5].unionId.value).equal(6);
        should(output[5].unionName.value).equal('Detail 6');
        should(output[6].unionId.value).equal(1);
        should(output[6].unionName.value).equal('Master 1');
        should(output[7].unionId.value).equal(2);
        should(output[7].unionName.value).equal('Master 2');
        done();
        })
      .catch(done);
    });
    it('with intersect', function(done) {
      execPlan(
        p.fromView('opticUnitTest', 'master')
            .select([p.as('unionId', p.schemaCol('opticUnitTest', 'master', 'id'))])
            .intersect(
                p.fromView('opticUnitTest', 'detail')
                  .select([p.as('unionId', p.schemaCol('opticUnitTest', 'detail', 'id'))])
                )
            .orderBy('unionId')
        )
      .then(function(response) {
        const output = getResults(response);
        should(output.length).equal(2);
        should(output[0].unionId.value).equal(1);
        should(output[1].unionId.value).equal(2);
        done();
        })
      .catch(done);
    });
    it('with except', function(done) {
      execPlan(
        p.fromView('opticUnitTest', 'detail')
            .select([p.as('unionId', p.schemaCol('opticUnitTest', 'detail', 'id'))])
            .except(
                p.fromView('opticUnitTest', 'master')
                  .select([p.as('unionId', p.schemaCol('opticUnitTest', 'master', 'id'))])
                )
            .orderBy('unionId')
        )
      .then(function(response) {
        const output = getResults(response);
        should(output.length).equal(4);
        should(output[0].unionId.value).equal(3);
        should(output[1].unionId.value).equal(4);
        should(output[2].unionId.value).equal(5);
        should(output[3].unionId.value).equal(6);
        done();
        })
      .catch(done);
    });
  });
  describe('for view and triples', function() {
    it('with inner join', function(done) {
      const datastore     = p.col('datastore');
      const master        = p.col('master');
      const masterId      = p.col('masterId');
      const datastoreType = p.sem.iri('http://purl.org/dc/dcmitype/Dataset');
      const dc            = p.prefixer('http://purl.org/dc/terms/');
      const typeProp      = dc('type');
      const titleProp     = dc('title');
      const sourceProp    = dc('source');
      const idProp        = dc('identifier');
      const descProp      = dc('description');
      execPlan(
        p.fromView('opticUnitTest', 'master')
            .joinInner(
                p.fromTriples([
                        p.pattern(datastore, typeProp,   datastoreType),
                        p.pattern(datastore, titleProp,  p.col('datastoreTitle')),
                        p.pattern(master,    sourceProp, p.col('datastore')),
                        p.pattern(master,    idProp,     masterId),
                        p.pattern(datastore, descProp,   p.col('masterDesc'))
                    ],
                    null),
                p.on(p.schemaCol('opticUnitTest', 'master', 'id'), masterId)
                )
            .orderBy(masterId)
        )
      .then(function(response) {
        const output = getResults(response);
        should(output.length).equal(2);
        testValue(output[0], 'master.id', 1);
        testValue(output[0], 'master.name', 'Master 1');
        testValue(output[0], 'master.date', '2015-12-01');
        should(output[0].datastore.value).equal('/datastore/id#A');
        should(output[0].datastoreTitle.value).equal('The A datastore');
        should(output[0].masterDesc.value).equal('Describing A');
        testValue(output[1], 'master.id', 2);
        testValue(output[1], 'master.name', 'Master 2');
        testValue(output[1], 'master.date', '2015-12-02');
        should(output[1].datastore.value).equal('/datastore/id#B');
        should(output[1].datastoreTitle.value).equal('The B datastore');
        should(output[1].masterDesc.value).equal('Describing B');
        done();
        })
      .catch(done);
    });
  });
  describe('from SQL', function() {
    it('basic', function(done) {
      execPlan(
        p.fromSQL('SELECT id, name, date FROM master WHERE id = 1')
        )
      .then(function(response) {
        const output = getResults(response);
        should(output.length).equal(1);
        testValue(output[0], 'master.id', 1);
        testValue(output[0], 'master.name', 'Master 1');
        testValue(output[0], 'master.date', '2015-12-01');
        done();
      })
        .catch(done);
    });
    it('with qualifier', function(done) {
      execPlan(
        p.fromSQL('SELECT id, name, date FROM master WHERE id = 1', 'sqlsel')
        )
      .then(function(response) {
        const output = getResults(response);
        should(output.length).equal(1);
        should(output[0]['sqlsel.id'].value).equal(1);
        should(output[0]['sqlsel.name'].value).equal('Master 1');
        should(output[0]['sqlsel.date'].value).equal('2015-12-01');
        done();
      })
        .catch(done);
    });
  });
  describe('serialize', function() {
    it('export', function(done) {
      const value =
        p.fromView('opticUnitTest', 'master')
            .orderBy('id')
          .export();
      should(value).deepEqual(exportedView);
      done();
    });
    it('export query', function(done) {
      const value =
        p.fromView('opticUnitTest', 'musician')
            .where(p.cts.jsonPropertyWordQuery('instrument', 'trumpet'))
            .orderBy('lastName')
          .export();
      should(value).deepEqual(exportedQueryView);
      done();
    });
    it('export from SQL', function(done) {
      const value =
        p.fromSQL('SELECT id, name, date FROM master WHERE id = 1')
         .export();
      should(value).deepEqual(exportedFromSQL);
      done();
    });
  });
/* TODO:
   * schema collection for view
   * export for view with query
   */
});
