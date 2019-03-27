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
const makeSelectCall   = pbb.makeSelectCall;
const makeSelectExport = pbb.makeSelectExport;

describe('expressions', function() {
  it('col() identifier', function(done) {
    const value =
      makeSelectCall(p.col('val')).export();
    should(value).deepEqual(
      makeSelectExport(
        {ns:'op', fn:'col', args:['val']}
        ));
    done();
  });
  it('viewCol() identifier', function(done) {
    const value =
      makeSelectCall(p.viewCol('docview', 'val')).export();
    should(value).deepEqual(
      makeSelectExport(
        {ns:'op', fn:'view-col', args:['docview', 'val']}
        ));
    done();
  });
  it('schemaCol() identifier', function(done) {
    const value =
      makeSelectCall(p.schemaCol('docschema', 'docview', 'val')).export();
    should(value).deepEqual(
      makeSelectExport(
        {ns:'op', fn:'schema-col', args:['docschema', 'docview', 'val']}
        ));
    done();
  });
  it('positional eq with or', function(done) {
    execPlan(
        p.fromLiterals([
            {row:1, num:1, str:'one'},
            {row:2, num:2, str:'two'},
            {row:3, num:3, str:'three'}
            ])
          .where(p.or(p.eq(p.col('str'), 'two'), p.eq(p.col('num'), 1)))
          .orderBy('row')
        )
      .then(function(response) {
        const output = getResults(response);
        should(output.length).equal(2);
        should(output[0].row.value).equal(1);
        should(output[0].num.value).equal(1);
        should(output[0].str.value).equal('one');
        should(output[1].row.value).equal(2);
        should(output[1].num.value).equal(2);
        should(output[1].str.value).equal('two');
        done();
      })
    .catch(done);
  });
  it('named eq with or', function(done) {
    execPlan(
        p.fromLiterals([
            {row:1, num:1, str:'one'},
            {row:2, num:2, str:'two'},
            {row:3, num:3, str:'three'}
            ])
          .where(p.or({
            left:  p.eq({left:p.col('str'), right:'two'}),
            right: p.eq({left:p.col('num'), right:1    })
            }))
          .orderBy('row')
        )
      .then(function(response) {
        const output = getResults(response);
        should(output.length).equal(2);
        should(output[0].row.value).equal(1);
        should(output[0].num.value).equal(1);
        should(output[0].str.value).equal('one');
        should(output[1].row.value).equal(2);
        should(output[1].num.value).equal(2);
        should(output[1].str.value).equal('two');
        done();
      })
    .catch(done);
  });
  it('ne with and', function(done) {
    execPlan(
        p.fromLiterals([
            {row:1, num:1, str:'one'},
            {row:2, num:2, str:'two'},
            {row:3, num:3, str:'three'}
            ])
          .where(p.and(p.ne(p.col('str'), 'two'), p.ne(p.col('num'), 1)))
        )
      .then(function(response) {
        const output = getResults(response);
        should(output.length).equal(1);
        should(output[0].row.value).equal(3);
        should(output[0].num.value).equal(3);
        should(output[0].str.value).equal('three');
        done();
      })
    .catch(done);
  });
  it('gt or lt', function(done) {
    execPlan(
        p.fromLiterals([
            {row:1, num:1, str:'one'},
            {row:2, num:2, str:'two'},
            {row:3, num:3, str:'three'}
            ])
          .where(p.or(p.gt(p.col('num'), 2), p.lt(p.col('num'), 2)))
          .orderBy('row')
        )
      .then(function(response) {
        const output = getResults(response);
        should(output.length).equal(2);
        should(output[0].row.value).equal(1);
        should(output[0].num.value).equal(1);
        should(output[0].str.value).equal('one');
        should(output[1].row.value).equal(3);
        should(output[1].num.value).equal(3);
        should(output[1].str.value).equal('three');
        done();
      })
    .catch(done);
  });
  it('ge and le', function(done) {
    execPlan(
        p.fromLiterals([
            {row:1, num:1, str:'one'},
            {row:2, num:2, str:'two'},
            {row:3, num:3, str:'three'}
            ])
          .where(p.and(p.ge(p.col('num'), 2), p.le(p.col('num'), 2)))
        )
      .then(function(response) {
        const output = getResults(response);
        should(output.length).equal(1);
        should(output[0].row.value).equal(2);
        should(output[0].num.value).equal(2);
        should(output[0].str.value).equal('two');
        done();
      })
    .catch(done);
  });
  it('not', function(done) {
    execPlan(
        p.fromLiterals([
            {row:1, num:1, str:'one'},
            {row:2, num:2, str:'two'},
            {row:3, num:3, str:'three'}
            ])
          .where(p.not(p.eq(p.col('num'), 1)))
          .orderBy('row')
        )
      .then(function(response) {
        const output = getResults(response);
        should(output.length).equal(2);
        should(output[0].row.value).equal(2);
        should(output[0].num.value).equal(2);
        should(output[0].str.value).equal('two');
        should(output[1].row.value).equal(3);
        should(output[1].num.value).equal(3);
        should(output[1].str.value).equal('three');
        done();
      })
    .catch(done);
  });
  it('nested', function(done) {
    execPlan(
        p.fromLiterals([
            {row:1, num:1, str:'one'},
            {row:2, num:2, str:'two'},
            {row:3, num:3, str:'three'}
            ])
          .where(
            p.or(
              p.and(
                p.or(
                  p.and(p.ge(p.col('num'), 2), p.le(p.col('num'), 2)),
                  p.lt(p.col('num'), 1)
                  ),
                p.or(
                  p.and(p.gt(p.col('num'), 1), p.lt(p.col('num'), 3)),
                  p.gt(p.col('num'), 3)
                  )
                ),
              p.and(p.gt(p.col('num'), 2), p.lt(p.col('num'), 2))
              )
            )
        )
      .then(function(response) {
        const output = getResults(response);
        should(output.length).equal(1);
        should(output[0].row.value).equal(2);
        should(output[0].num.value).equal(2);
        should(output[0].str.value).equal('two');
        done();
      })
    .catch(done);
  });
  it('concat', function(done) {
    execPlan(
        p.fromLiterals([
            {row:1, num:1, str:'one'},
            {row:2, num:2, str:'two'}
            ])
          .where(p.eq(p.fn.concat(p.col('num'), 1), '11'))
        )
      .then(function(response) {
        const output = getResults(response);
        should(output.length).equal(1);
        should(output[0].row.value).equal(1);
        should(output[0].num.value).equal(1);
        should(output[0].str.value).equal('one');
        done();
      })
    .catch(done);
  });
  it('add or subtract', function(done) {
    execPlan(
        p.fromLiterals([
            {row:1, num:1, str:'one'},
            {row:2, num:2, str:'two'},
            {row:3, num:3, str:'three'}
            ])
          .where(p.or(p.eq(p.add(p.col('num'), 1), 2), p.eq(p.subtract(3, p.col('num')), 2)))
        )
      .then(function(response) {
        const output = getResults(response);
        should(output.length).equal(1);
        should(output[0].row.value).equal(1);
        should(output[0].num.value).equal(1);
        should(output[0].str.value).equal('one');
        done();
      })
    .catch(done);
  });
  it('multiply or divide', function(done) {
    execPlan(
        p.fromLiterals([
            {row:1, num:1, str:'one'},
            {row:2, num:2, str:'two'},
            {row:3, num:3, str:'three'}
            ])
          .where(p.and(p.eq(p.multiply(p.col('num'), 1), 2), p.eq(p.divide(4, p.col('num')), 2)))
        )
      .then(function(response) {
        const output = getResults(response);
        should(output.length).equal(1);
        should(output[0].row.value).equal(2);
        should(output[0].num.value).equal(2);
        should(output[0].str.value).equal('two');
        done();
      })
    .catch(done);
  });
  it('modulo', function(done) {
    execPlan(
        p.fromLiterals([
            {row:1, num:1, str:'one'},
            {row:2, num:2, str:'two'},
            {row:3, num:3, str:'three'}
            ])
          .where(p.eq(p.modulo(4, p.col('num')), 1))
        )
      .then(function(response) {
        const output = getResults(response);
        should(output.length).equal(1);
        should(output[0].row.value).equal(3);
        should(output[0].num.value).equal(3);
        should(output[0].str.value).equal('three');
        done();
      })
    .catch(done);
  });
  it('with as', function(done) {
    execPlan(
        p.fromLiterals([
            {row:1, low:4, high:8},
            {row:2, low:3, high:6},
            {row:3, low:2, high:4}
            ])
          .select([
              p.as(p.col('added'), p.add(p.col('low'), p.col('high'))),
              p.as('subtracted',    p.subtract(p.col('high'), p.col('low'))),
              p.as('compared',      p.eq(p.col('low'), 3)),
              p.as('concatted',     p.fn.concat(p.col('low'), p.col('high')))
              ])
        )
      .then(function(response) {
        const output = getResults(response);
        should(output.length).equal(3);
        should(output[0].added.value).equal(12);
        should(output[0].subtracted.value).equal(4);
        should(output[0].compared.value).equal(false);
        should(output[0].concatted.value).equal('48');
        should(output[1].added.value).equal(9);
        should(output[1].subtracted.value).equal(3);
        should(output[1].compared.value).equal(true);
        should(output[1].concatted.value).equal('36');
        should(output[2].added.value).equal(6);
        should(output[2].subtracted.value).equal(2);
        should(output[2].compared.value).equal(false);
        should(output[2].concatted.value).equal('24');
        done();
      })
    .catch(done);
  });
  it('with if', function(done) {
    execPlan(
        p.fromLiterals([
            {row:1, val:8},
            {row:2, val:6},
            {row:3, val:4}
            ])
          .select(['row',
              p.as('iffed', p.sem.if(p.eq(p.col('row'), 2), 'even', 'odd'))
              ])
        )
      .then(function(response) {
        const output = getResults(response);
        should(output.length).equal(3);
        should(output[0].row.value).equal(1);
        should(output[0].iffed.value).equal('odd');
        should(output[1].row.value).equal(2);
        should(output[1].iffed.value).equal('even');
        should(output[2].row.value).equal(3);
        should(output[2].iffed.value).equal('odd');
        done();
      })
    .catch(done);
  });
  it('with case', function(done) {
    execPlan(
        p.fromLiterals([
            {row:1, val:8},
            {row:2, val:6},
            {row:3, val:4}
            ])
          .select(['row', p.as('cased', p.case(
              [p.when(p.eq(p.col('row'), 2), 'second'),
               p.when(p.eq(p.col('row'), 3), 'third')],
              'otherwise'
              ))])
        )
      .then(function(response) {
        const output = getResults(response);
        should(output.length).equal(3);
        should(output[0].row.value).equal(1);
        should(output[0].cased.value).equal('otherwise');
        should(output[1].row.value).equal(2);
        should(output[1].cased.value).equal('second');
        should(output[2].row.value).equal(3);
        should(output[2].cased.value).equal('third');
        done();
      })
    .catch(done);
  });
  it('with isDefined', function(done) {
    execPlan(
        p.fromLiterals([
            {row:1, sparse:6},
            {row:2},
            {row:3, sparse:4}
            ])
          .select(['row', 'sparse',
              p.as('defcheck', p.sem.if(p.isDefined(p.col('sparse')), 'present', 'absent'))
              ])
        )
      .then(function(response) {
        const output = getResults(response);
        should(output.length).equal(3);
        should(output[0].row.value).equal(1);
        should(output[0].sparse.value).equal(6);
        should(output[0].defcheck.value).equal('present');
        should(output[1].row.value).equal(2);
        should(output[1].sparse.value).equal(null);
        should(output[1].defcheck.value).equal('absent');
        should(output[2].row.value).equal(3);
        should(output[2].sparse.value).equal(4);
        should(output[2].defcheck.value).equal('present');
        done();
      })
    .catch(done);
  });
  it('positional builtin function with array', function(done) {
    execPlan(
        p.fromLiterals([
            {row:1, one:'a', two:'b', three:'c'},
            {row:2, one:'b', two:'c', three:'a'},
            {row:3, one:'c', two:'a', three:'b'}
            ])
          .select(['row', p.as('pos', p.fn.indexOf([p.col('one'), p.col('two'), p.col('three')], 'b'))])
          .orderBy('row')
        )
      .then(function(response) {
        const output = getResults(response);
        should(output.length).equal(3);
        should(output[0].row.value).equal(1);
        should(output[0].pos.value).equal(2);
        should(output[1].row.value).equal(2);
        should(output[1].pos.value).equal(1);
        should(output[2].row.value).equal(3);
        should(output[2].pos.value).equal(3);
        done();
      })
    .catch(done);
  });
  it('named builtin function with array', function(done) {
    execPlan(
        p.fromLiterals([
            {row:1, one:'a', two:'b', three:'c'},
            {row:2, one:'b', two:'c', three:'a'},
            {row:3, one:'c', two:'a', three:'b'}
            ])
          .select(['row', p.as('pos', p.fn.indexOf({
              seqParam:  [p.col('one'), p.col('two'), p.col('three')],
              srchParam: 'b'
              }))])
          .orderBy('row')
        )
      .then(function(response) {
        const output = getResults(response);
        should(output.length).equal(3);
        should(output[0].row.value).equal(1);
        should(output[0].pos.value).equal(2);
        should(output[1].row.value).equal(2);
        should(output[1].pos.value).equal(1);
        should(output[2].row.value).equal(3);
        should(output[2].pos.value).equal(3);
        done();
      })
    .catch(done);
  });
});
