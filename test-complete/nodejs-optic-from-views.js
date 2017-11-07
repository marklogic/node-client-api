/*
 * Copyright 2014-2015 MarkLogic Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an AS IS BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

const expect = require('chai').expect;

const marklogic = require('../');

const connectdef = require('../config-optic/connectdef.js');

const db = marklogic.createDatabaseClient(connectdef.plan);
const op = marklogic.planBuilder;

describe('Optic from views test', function(){

  it('TEST 1 - join inner with keymatch - object structure, columnType rows', function(done){
    const plan1 =
      op.fromView('opticFunctionalTest', 'detail')
        .orderBy(op.schemaCol('opticFunctionalTest', 'detail', 'id'));
    const plan2 =
      op.fromView('opticFunctionalTest', 'master')
        .orderBy(op.schemaCol('opticFunctionalTest', 'master' , 'id'));
    const output =
      plan1.joinInner(plan2)
      .where(
        op.eq(
          op.schemaCol('opticFunctionalTest', 'master' , 'id'),
          op.schemaCol('opticFunctionalTest', 'detail', 'masterId')
        )
      )
      .orderBy(op.asc(op.schemaCol('opticFunctionalTest', 'detail', 'id')))

    db.rows.query(output, { format: 'json', structure: 'object', columnTypes: 'rows' }) 
    .then(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.columns[0].name).to.equal('opticFunctionalTest.detail.id');
      expect(output.columns[0].type).to.not.exist;
      expect(output.rows.length).to.equal(6);
      expect(output.rows[0]['opticFunctionalTest.detail.id'].type).to.equal('xs:integer');
      expect(output.rows[0]['opticFunctionalTest.detail.id'].value).to.equal(1);
      expect(output.rows[0]['opticFunctionalTest.master.id'].value).to.equal(1);
      expect(output.rows[0]['opticFunctionalTest.detail.masterId'].value).to.equal(1);
      expect(output.rows[0]['opticFunctionalTest.detail.name'].value).to.equal('Detail 1');
      expect(output.rows[0]['opticFunctionalTest.detail.name'].type).to.equal('xs:string');
      expect(output.rows[5]['opticFunctionalTest.detail.id'].value).to.equal(6);
      expect(output.rows[5]['opticFunctionalTest.master.id'].value).to.equal(2);
      expect(output.rows[5]['opticFunctionalTest.detail.masterId'].value).to.equal(2);
      expect(output.rows[5]['opticFunctionalTest.detail.name'].value).to.equal('Detail 6');
      done();
    }, done);
  });

  it('TEST 2 - join inner with keymatch and select - array structure', function(done){
    const plan1 =
      op.fromView('opticFunctionalTest', 'detail')
        .orderBy(op.schemaCol('opticFunctionalTest', 'detail', 'id'));
    const plan2 =
      op.fromView('opticFunctionalTest', 'master')
        .orderBy(op.schemaCol('opticFunctionalTest', 'master' , 'id'));
    const output =
      plan1.joinInner(plan2)
      .where(
        op.eq(
          op.schemaCol('opticFunctionalTest', 'master' , 'id'), 
          op.schemaCol('opticFunctionalTest', 'detail', 'masterId')
        )
      )
      .select([
        op.as('MasterName', op.schemaCol('opticFunctionalTest', 'master', 'name')),
        op.schemaCol('opticFunctionalTest', 'master', 'date'),
        op.as('DetailName', op.schemaCol('opticFunctionalTest', 'detail', 'name')),
        op.schemaCol('opticFunctionalTest', 'detail', 'amount'),
        op.schemaCol('opticFunctionalTest', 'detail', 'color')
      ])
      .orderBy(op.desc(op.col('DetailName')))

    db.rows.query(output, { format: 'json', structure: 'array', columnTypes: 'rows' }) 
    .then(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(7);
      expect(output[0].length).to.equal(5);
      expect(output[1].length).to.equal(5);
      expect(output[0][0].name).to.equal('MasterName');
      expect(output[1][0].value).to.equal('Master 2');
      expect(output[1][2].value).to.equal('Detail 6');
      expect(output[1][3].value).to.equal(60.06);
      expect(output[6][0].value).to.equal('Master 1');
      expect(output[6][2].value).to.equal('Detail 1');
      expect(output[6][4].value).to.equal('blue');
      done();
    }, done);
  });

  it('TEST 3 - group by - columnTypes header', function(done){
    const plan1 =
      op.fromView('opticFunctionalTest', 'detail')
        .orderBy(op.schemaCol('opticFunctionalTest', 'detail', 'id'));
    const plan2 =
      op.fromView('opticFunctionalTest', 'master')
        .orderBy(op.schemaCol('opticFunctionalTest', 'master' , 'id'));
    const output =
      plan1.joinInner(plan2)
      .where(
        op.eq(
          op.schemaCol('opticFunctionalTest', 'master' , 'id'), 
          op.schemaCol('opticFunctionalTest', 'detail', 'masterId')
        )
      )
      .groupBy(op.schemaCol('opticFunctionalTest', 'master', 'name'), op.sum('DetailSum', op.schemaCol('opticFunctionalTest', 'detail', 'amount')))
      .orderBy(op.desc(op.col('DetailSum')))
    db.rows.query(output, { format: 'json', structure: 'object', columnTypes: 'header' }) 
    .then(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.columns[0].name).to.equal('opticFunctionalTest.master.name');
      expect(output.columns[0].type).to.equal('xs:string');
      expect(output.rows.length).to.equal(2);
      expect(output.rows[0]['opticFunctionalTest.master.name']).to.equal('Master 2');
      expect(output.rows[0].DetailSum).to.equal(120.12);
      expect(output.rows[0].type).to.not.exist;
      expect(output.rows[1]['opticFunctionalTest.master.name']).to.equal('Master 1');
      expect(output.rows[1].DetailSum).to.equal(90.09);
      done();
    }, done);
  });

  it('TEST 4 - join inner with qualifier - format xml, columnTypes rows', function(done){
    const plan1 =
      op.fromView('opticFunctionalTest', 'detail', 'myDetail')
        .orderBy(op.viewCol('myDetail', 'id'));
    const plan2 =
      op.fromView('opticFunctionalTest', 'master', 'myMaster')
        .orderBy(op.viewCol('myMaster' , 'id'));
    const output =
      plan1.joinInner(plan2)
      .where(
        op.eq(
          op.viewCol('myMaster' , 'id'),           
          op.viewCol('myDetail', 'masterId')
        )
      )
      .orderBy(op.viewCol('myDetail', 'id'))
    db.rows.query(output, { format: 'xml', structure: 'object', columnTypes: 'rows' }) 
    .then(function(output) {
      //console.log(output);
      expect(output).to.contain('<t:cell name=\"myDetail.id\" type=\"xs:integer\">1</t:cell>');
      expect(output).to.contain('<t:column name=\"myDetail.id\"/>');
      done();
    }, done);
  });

  it('TEST 5 - join left outer with select - format xml columnTypes header', function(done){
    const plan1 =
      op.fromView('opticFunctionalTest', 'detail')
        .orderBy(op.schemaCol('opticFunctionalTest', 'detail', 'id'));
    const plan2 =
      op.fromView('opticFunctionalTest', 'master')
        .orderBy(op.schemaCol('opticFunctionalTest', 'master' , 'id'));
    const output =
      plan1.joinLeftOuter(plan2)
      .select([
        op.as('MasterName', op.schemaCol('opticFunctionalTest', 'master', 'name')),
        op.schemaCol('opticFunctionalTest', 'master', 'date'),
        op.as('DetailName', op.schemaCol('opticFunctionalTest', 'detail', 'name')),  
        op.schemaCol('opticFunctionalTest', 'detail', 'amount'),
        op.schemaCol('opticFunctionalTest', 'detail', 'color')
      ])
      .orderBy([op.desc(op.col('DetailName')), op.desc(op.col('MasterName'))])
    db.rows.query(output, { format: 'xml', structure: 'object', columnTypes: 'header' }) 
    .then(function(output) {
      //console.log(output);
      expect(output).to.contain('<t:column name=\"opticFunctionalTest.master.date\" type=\"xs:date"\/>');
      expect(output).to.contain('<t:cell name=\"DetailName\">Detail 6</t:cell>');
      done();
    }, done);
  });

  it('TEST 6 - union with select', function(done){
    var src =
      `const op = require('/MarkLogic/optic');
      const plan1 =
        op.fromView('opticFunctionalTest', 'detail')
          .orderBy(op.schemaCol('opticFunctionalTest', 'detail', 'id'));
      const plan2 =
        op.fromView('opticFunctionalTest', 'master')
          .orderBy(op.schemaCol('opticFunctionalTest', 'master' , 'id'));
      const output =
        plan1.union(plan2)
        .select([
          op.as('MasterName', op.schemaCol('opticFunctionalTest', 'master', 'name')),
          op.schemaCol('opticFunctionalTest', 'master', 'date'),
          op.as('DetailName', op.schemaCol('opticFunctionalTest', 'detail', 'name')),
          op.schemaCol('opticFunctionalTest', 'detail', 'amount'),
          op.schemaCol('opticFunctionalTest', 'detail', 'color')
        ])
        .orderBy(op.desc(op.col('DetailName')))
        .result();
      output;`  
    db.eval(src)
    .result(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(8);
      expect(output[0].value.MasterName).to.equal(null);
      expect(output[0].value['opticFunctionalTest.master.date']).to.equal(null);
      expect(output[0].value.DetailName).to.equal('Detail 6');
      expect(output[7].value.MasterName).to.equal('Master 2');
      expect(output[7].value['opticFunctionalTest.master.date']).to.equal('2015-12-02');
      expect(output[7].value.DetailName).to.equal(null);
      expect(output[7].value['opticFunctionalTest.detail.color']).to.equal(null);
      done();
    }, done);
  });

  it('TEST 7 - join cross product', function(done){
    var src =
      `const op = require('/MarkLogic/optic');
      const plan1 =
        op.fromView('opticFunctionalTest', 'detail')
          .orderBy(op.schemaCol('opticFunctionalTest', 'detail', 'id'));
      const plan2 =
        op.fromView('opticFunctionalTest', 'master')
          .orderBy(op.schemaCol('opticFunctionalTest', 'master' , 'id'));
      const output =
        plan1.joinCrossProduct(plan2)
        .select([
          op.as('MasterName', op.schemaCol('opticFunctionalTest', 'master', 'name')),
          op.schemaCol('opticFunctionalTest', 'master', 'date'),
          op.as('DetailName', op.schemaCol('opticFunctionalTest', 'detail', 'name')),
          op.schemaCol('opticFunctionalTest', 'detail', 'amount'),
          op.schemaCol('opticFunctionalTest', 'detail', 'color')
        ])
        .orderBy(op.desc(op.col('DetailName')))
        .orderBy(op.asc(op.col('MasterName')))
        .result();
      output;`  
    db.eval(src)
    .result(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(12);
      expect(output[0].value.MasterName).to.equal('Master 1');
      expect(output[0].value.DetailName).to.equal('Detail 6');
      expect(output[1].value.MasterName).to.equal('Master 1');
      expect(output[1].value.DetailName).to.equal('Detail 5');
      expect(output[11].value.MasterName).to.equal('Master 2');
      expect(output[11].value.DetailName).to.equal('Detail 1');
      expect(output[11].value['opticFunctionalTest.detail.color']).to.equal('blue');
      done();
    }, done);
  });

  it('TEST 8 - accessor plan', function(done){
    var src =
      `const op = require('/MarkLogic/optic');
      const plan1 =
        op.fromView('opticFunctionalTest', 'detail', 'myDetail');
            
      const idCol = plan1.col('id');
      const nameCol = plan1.col('name');
      const output =
        op.fromView('opticFunctionalTest', 'detail', 'myDetail')
        .where(op.gt(idCol, 3))
        .select([idCol, nameCol])
        .orderBy(op.desc(nameCol))
        .result();
      output;`
  
    db.eval(src)
    .result(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(3);
      expect(output[0].value['myDetail.id']).to.equal(6);
      expect(output[0].value['myDetail.name']).to.equal('Detail 6');
      expect(output[2].value['myDetail.id']).to.equal(4);
      expect(output[2].value['myDetail.name']).to.equal('Detail 4');
      done();
    }, done);
  });

  it('TEST 9 - inner join with accessor plan', function(done){
    var src =
      `const op = require('/MarkLogic/optic');
      const plan1 =
        op.fromView('opticFunctionalTest', 'detail', 'myDetail');
      const plan2 =
        op.fromView('opticFunctionalTest', 'master', 'myMaster');
      const masterIdCol1 = plan1.col('masterId');
      const masterIdCol2 = plan2.col('id');
      const detailIdCol = plan1.col('id');
      const detailNameCol = plan1.col('name');
      const masterNameCol = plan2.col('name');
      const output =
        plan1.joinInner(plan2)
        .where(op.eq(masterIdCol1, masterIdCol2))
        .select([masterIdCol2, masterNameCol, detailIdCol, detailNameCol])
        .orderBy(op.desc(detailNameCol))
        .offsetLimit(1, 3)
        .result();
      output;` 
    db.eval(src)
    .result(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(3);
      expect(output[0].value['myMaster.id']).to.equal(1);
      expect(output[0].value['myMaster.name']).to.equal('Master 1');
      expect(output[0].value['myDetail.id']).to.equal(5);
      expect(output[0].value['myDetail.name']).to.equal('Detail 5');
      expect(output[2].value['myDetail.id']).to.equal(3);
      expect(output[2].value['myDetail.name']).to.equal('Detail 3');
      done();
    }, done);
  });

  it('TEST 10 - inner join with accessor plan and on', function(done){
    var src =
      `const op = require('/MarkLogic/optic');
      const plan1 =
        op.fromView('opticFunctionalTest', 'detail', 'myDetail');
      const plan2 =
        op.fromView('opticFunctionalTest', 'master', 'myMaster');
      const masterIdCol1 = plan1.col('masterId');
      const masterIdCol2 = plan2.col('id');
      const detailIdCol = plan1.col('id');
      const detailNameCol = plan1.col('name');
      const masterNameCol = plan2.col('name');
      const output =
        plan1.joinInner(plan2, op.on(masterIdCol1, masterIdCol2), op.ge(detailIdCol, 3))
        .select([masterIdCol2, masterNameCol, detailIdCol, detailNameCol])
        .orderBy(op.desc(detailNameCol))
        .offsetLimit(1, 100)
        .result();
      output;` 
    db.eval(src)
    .result(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(3);
      expect(output[0].value['myMaster.id']).to.equal(1);
      expect(output[0].value['myMaster.name']).to.equal('Master 1');
      expect(output[0].value['myDetail.id']).to.equal(5);
      expect(output[0].value['myDetail.name']).to.equal('Detail 5');
      expect(output[2].value['myDetail.id']).to.equal(3);
      expect(output[2].value['myDetail.name']).to.equal('Detail 3');
      done();
    }, done);
  });

  it('TEST 11 - join inner with null schema', function(done){
    var src =  
      `const op = require('/MarkLogic/optic');
      const plan1 =
        op.fromView(null, 'detail3');
      const plan2 =
        op.fromView(null, 'master3');
      const output =
        plan1.joinInner(plan2)
        .where(
          op.eq(
            op.schemaCol(null, 'master3' , 'id'),
            op.schemaCol(null, 'detail3', 'masterId')
          )
        )
        .orderBy(op.asc(op.schemaCol(null, 'detail3', 'id')))
        .result();
      output;`;
    db.eval(src)
    .result(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(3);
      expect(output[0].value['opticFunctionalTest3.detail3.id']).to.equal(7);
      expect(output[0].value['opticFunctionalTest3.master3.id']).to.equal(3);
      expect(output[0].value['opticFunctionalTest3.detail3.masterId']).to.equal(3);
      expect(output[0].value['opticFunctionalTest3.detail3.name']).to.equal('Detail 7');
      expect(output[2].value['opticFunctionalTest3.detail3.id']).to.equal(11);
      expect(output[2].value['opticFunctionalTest3.master3.id']).to.equal(3);
      expect(output[2].value['opticFunctionalTest3.detail3.masterId']).to.equal(3);
      expect(output[2].value['opticFunctionalTest3.detail3.name']).to.equal('Detail 11');
      done();
    }, done);
  });

  it('TEST 12 - join inner with where disctinct', function(done){
    var src =  
      `const op = require('/MarkLogic/optic');
      const plan1 =
        op.fromView('opticFunctionalTest', 'detail')
          .orderBy(op.schemaCol('opticFunctionalTest', 'detail', 'id'));
      const plan2 =
        op.fromView('opticFunctionalTest', 'master')
          .orderBy(op.schemaCol('opticFunctionalTest', 'master' , 'id'));
      const output =
        plan1.joinInner(plan2)
        .where(
          op.eq(
            op.schemaCol('opticFunctionalTest', 'master' , 'id'),
            op.schemaCol('opticFunctionalTest', 'detail', 'masterId')
          )
        )
        .orderBy(op.asc(op.schemaCol('opticFunctionalTest', 'detail', 'id')))
        .select(op.schemaCol('opticFunctionalTest', 'detail', 'color'))
        .whereDistinct()
        .orderBy(op.desc(op.schemaCol('opticFunctionalTest', 'detail', 'color')))
        .result();
      output;`
    db.eval(src)
    .result(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(2);
      expect(output[0].value['opticFunctionalTest.detail.color']).to.equal('green');
      expect(output[1].value['opticFunctionalTest.detail.color']).to.equal('blue');
      done();
    }, done);
  });

  it('TEST 13 - join inner with multiple group by and different column identifiers', function(done){
    var src =  
      `const op = require('/MarkLogic/optic');
      const plan1 =
        op.fromView('opticFunctionalTest', 'detail');
      const plan2 =
        op.fromView('opticFunctionalTest', 'master');
      const amountCol = plan1.col('amount');
      const sep = ' and ';
      const output =
        plan1.joinInner(plan2)
        .where(
          op.eq(
            op.schemaCol('opticFunctionalTest', 'master' , 'id'),
            op.schemaCol('opticFunctionalTest', 'detail', 'masterId')
          )
        )
        .orderBy(op.asc(op.schemaCol('opticFunctionalTest', 'detail', 'id')))
        .groupBy(
          op.as('colorStat', op.schemaCol('opticFunctionalTest', 'detail', 'color')), [
            op.max('maxColor', op.viewCol('detail', 'amount')),
            op.min('minColor', op.schemaCol('opticFunctionalTest', 'detail', 'amount')),
            op.avg('avgColor', op.col('amount')),
            op.sample('sampleColor', amountCol),
            op.sum('sumColor', amountCol),
            op.groupConcat('groupConcatColor', amountCol, {separator: sep}),
            op.count('masterCount', op.schemaCol('opticFunctionalTest', 'master', 'id'))
          ]
        )
        .orderBy(op.desc(op.col('colorStat')))
        .result();
      output;`
    db.eval(src)
    .result(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(2);
      expect(output[0].value.colorStat).to.equal('green');
      expect(output[0].value.maxColor).to.equal(60.06);
      expect(output[0].value.minColor).to.equal(40.04);
      expect(output[0].value.avgColor).to.equal(50.05);
      expect(output[0].value.sumColor).to.equal(150.15);
      expect(output[0].value.masterCount).to.equal(3);
      expect(output[0].value.sampleColor).to.not.equal(null);
      expect(output[0].value.groupConcatColor).to.equal('40.04 and 50.05 and 60.06');
      expect(output[1].value.colorStat).to.equal('blue');
      expect(output[1].value.maxColor).to.equal(30.03);
      expect(output[1].value.minColor).to.equal(10.01);
      expect(output[1].value.avgColor).to.equal(20.02);
      expect(output[1].value.sumColor).to.equal(60.06);
      expect(output[1].value.masterCount).to.equal(3);
      expect(output[1].value.groupConcatColor).to.equal('10.01 and 20.02 and 30.03');
      done();
    }, done);
  });

  it('TEST 14 - select with qualifier', function(done){
    var src =  
      `const op = require('/MarkLogic/optic');
      const plan1 =
        op.fromView('opticFunctionalTest', 'detail');
      const plan2 =
        op.fromView('opticFunctionalTest', 'master');
      const amountCol = plan1.col('amount');
      const output =
        plan1.joinInner(plan2)
        .where(
          op.eq(
            op.schemaCol('opticFunctionalTest', 'master' , 'id'),
            op.schemaCol('opticFunctionalTest', 'detail', 'masterId')
          )
        )
        .select([op.schemaCol('opticFunctionalTest', 'detail', 'id'), 
                 op.schemaCol('opticFunctionalTest', 'detail', 'color'),
                 op.schemaCol('opticFunctionalTest', 'master', 'name')], 
          'newRow')
        .orderBy('id')
        .result();
      output;`
    db.eval(src)
    .result(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(6);
      expect(output[0].value['newRow.id']).to.equal(1);
      expect(output[0].value['newRow.color']).to.equal('blue');
      expect(output[0].value['newRow.name']).to.equal('Master 1');
      expect(output[5].value['newRow.id']).to.equal(6);
      expect(output[5].value['newRow.color']).to.equal('green');
      expect(output[5].value['newRow.name']).to.equal('Master 2');
      done();
    }, done);
  });

  it('TEST 15 - select with empty string qualifier and as', function(done){
    var src =  
      `const op = require('/MarkLogic/optic');
      const plan1 =
        op.fromView('opticFunctionalTest', 'detail');
      const plan2 =
        op.fromView('opticFunctionalTest', 'master');
      const amountCol = plan1.col('amount');
      const output =
        plan1.joinInner(plan2)
        .where(
          op.eq(
            op.schemaCol('opticFunctionalTest', 'master' , 'id'),
            op.schemaCol('opticFunctionalTest', 'detail', 'masterId')
          )
        )
        .select([op.schemaCol('opticFunctionalTest', 'detail', 'id'), 
                 op.schemaCol('opticFunctionalTest', 'detail', 'color'),
                 op.as('masterName', op.schemaCol('opticFunctionalTest', 'master', 'name'))], 
          '')
        .orderBy('id')
        .result();
      output;`
    db.eval(src)
    .result(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(6);
      expect(output[0].value.id).to.equal(1);
      expect(output[0].value.color).to.equal('blue');
      expect(output[0].value.masterName).to.equal('Master 1');
      expect(output[5].value.id).to.equal(6);
      expect(output[5].value.color).to.equal('green');
      expect(output[5].value.masterName).to.equal('Master 2');
      done();
    }, done);
  });

  it('TEST 16 - inner join with multiple on', function(done){
    var src =
      `const op = require('/MarkLogic/optic');
      const plan1 =
        op.fromView('opticFunctionalTest', 'detail', 'myDetail');
      const plan2 =
        op.fromView('opticFunctionalTest', 'master', 'myMaster');
      const masterIdCol1 = plan1.col('masterId');
      const masterIdCol2 = plan2.col('id');
      const idCol1 = plan2.col('id');
      const idCol2 = plan1.col('id');
      const detailNameCol = plan1.col('name');
      const masterNameCol = plan2.col('name');
      const output =
        plan1.joinInner(plan2, [op.on(masterIdCol1, masterIdCol2), op.on(idCol1, idCol2)])
        .orderBy(op.desc(detailNameCol))
        .offsetLimit(1, 100)
        .result();
      output;` 
    db.eval(src)
    .result(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(1);
      expect(output[0].value['myMaster.id']).to.equal(1);
      expect(output[0].value['myMaster.name']).to.equal('Master 1');
      expect(output[0].value['myDetail.id']).to.equal(1);
      expect(output[0].value['myDetail.name']).to.equal('Detail 1');
      expect(output[0].value['myDetail.masterId']).to.equal(1);
      done();
    }, done);
  });

  it('TEST 17 - omit result', function(done){
    var src =
      `const op = require('/MarkLogic/optic');
      const plan1 =
        op.fromView('opticFunctionalTest', 'detail');
      const plan2 =
        op.fromView('opticFunctionalTest', 'master');
      const output =
        plan1.joinInner(plan2);
      output;` 
    db.eval(src)
    .result(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(1);
      done();
    }, done);
  });

  it('TEST 18 - export and import plan', function(done){
    var src =
      `const op = require('/MarkLogic/optic');
      const plan1 =
        op.fromView('opticFunctionalTest', 'detail', 'myDetail');
      const plan2 =
        op.fromView('opticFunctionalTest', 'master', 'myMaster');
      const masterIdCol1 = plan1.col('masterId');
      const masterIdCol2 = plan2.col('id');
      const idCol1 = plan2.col('id');
      const idCol2 = plan1.col('id');
      const detailNameCol = plan1.col('name');
      const masterNameCol = plan2.col('name');
      const exportedPlan =
        plan1.joinInner(plan2, [op.on(masterIdCol1, masterIdCol2), op.on(idCol1, idCol2)])
        .orderBy(op.desc(detailNameCol))
        .offsetLimit(1, 100)
        .export();
      const importedPlan = op.import(exportedPlan);
      const output = importedPlan.result();
      output;` 
    db.eval(src)
    .result(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(1);
      expect(output[0].value['myMaster.id']).to.equal(1);
      expect(output[0].value['myMaster.name']).to.equal('Master 1');
      expect(output[0].value['myDetail.id']).to.equal(1);
      expect(output[0].value['myDetail.name']).to.equal('Detail 1');
      expect(output[0].value['myDetail.masterId']).to.equal(1);
      done();
    }, done);
  });

  it('TEST 19 - join left outer with array of on', function(done){
    var src =
      `const op = require('/MarkLogic/optic');
      const plan1 =
        op.fromView('opticFunctionalTest', 'detail')
          .orderBy(op.schemaCol('opticFunctionalTest', 'detail', 'id'));
      const plan2 =
        op.fromView('opticFunctionalTest', 'master')
          .orderBy(op.schemaCol('opticFunctionalTest', 'master' , 'id'));
      const output =
        plan1.joinLeftOuter(plan2, [op.on(op.viewCol('master', 'id'), op.viewCol('detail', 'masterId')), op.on(op.viewCol('detail', 'name'), op.viewCol('master', 'name'))])
        .select([
          op.as('MasterName', op.schemaCol('opticFunctionalTest', 'master', 'name')),
          op.schemaCol('opticFunctionalTest', 'master', 'date'),
          op.as('DetailName', op.schemaCol('opticFunctionalTest', 'detail', 'name')),
          op.schemaCol('opticFunctionalTest', 'detail', 'amount'),
          op.schemaCol('opticFunctionalTest', 'detail', 'color')
        ])
        .orderBy(op.desc(op.col('DetailName')))
        .result();
      output;`  
    db.eval(src)
    .result(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(6);
      expect(output[0].value.MasterName).to.equal(null);
      expect(output[0].value.DetailName).to.equal('Detail 6');
      expect(output[5].value.MasterName).to.equal(null);
      expect(output[5].value.DetailName).to.equal('Detail 1');
      done();
    }, done);
  });

  it('TEST 20 - arithmetic operations', function(done){
    var src =  
      `const op = require('/MarkLogic/optic');
      const plan1 =
        op.fromView('opticFunctionalTest', 'detail')
          .orderBy(op.schemaCol('opticFunctionalTest', 'detail', 'id'));
      const plan2 =
        op.fromView('opticFunctionalTest', 'master')
          .orderBy(op.schemaCol('opticFunctionalTest', 'master' , 'id'));
      const output =
        plan1.joinInner(plan2)
        .where(
          op.eq(
            op.schemaCol('opticFunctionalTest', 'master' , 'id'),
            op.schemaCol('opticFunctionalTest', 'detail', 'masterId')
          )
        )
        .select([
          op.as('added', op.add(op.col('amount'), op.viewCol('detail', 'masterId'))),
          op.as('substracted', op.subtract(op.col('amount'), op.viewCol('master', 'id'))),
          op.as('modulo', op.modulo(op.col('amount'), op.viewCol('master', 'id'))),
          op.as('invSubstract', op.subtract(op.col('amount'), op.viewCol('master', 'date'))),
          op.as('divided', op.divide(op.col('amount'), op.multiply(op.col('amount'), op.viewCol('detail', 'id'))))
        ])
        .orderBy(op.asc('substracted'))
        .result();
      output;`
    db.eval(src)
    .result(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(6);
      expect(output[0].value.added).to.equal(11.01);
      expect(output[0].value.substracted).to.equal(9.01);
      expect(output[0].value.modulo).to.equal(0.00999999999999979);
      expect(output[0].value.invSubstract).to.equal(null);
      expect(output[0].value.divided).to.equal(1);
      expect(output[5].value.added).to.equal(62.06);
      expect(output[5].value.substracted).to.equal(58.06);
      expect(output[5].value.modulo).to.equal(0.0600000000000023);
      expect(output[5].value.invSubstract).to.equal(null);
      expect(output[5].value.divided).to.equal(0.166666666666667);
      done();
    }, done);
  });

  it('TEST 21 - with value processing function on where', function(done){
    var src =  
      `const op = require('/MarkLogic/optic');
      const plan1 =
        op.fromView('opticFunctionalTest', 'detail')
          .orderBy(op.schemaCol('opticFunctionalTest', 'detail', 'id'));
      const plan2 =
        op.fromView('opticFunctionalTest', 'master')
          .orderBy(op.schemaCol('opticFunctionalTest', 'master' , 'id'));
      const numbers = [10, 40, 50, 30, 60, 0, 100];
      const output =
        plan1.joinInner(plan2)
        .where(
          op.gt(
            op.schemaCol('opticFunctionalTest', 'detail', 'amount'), op.math.median(numbers)
          )
        )
        .select(op.as('myAmount', op.viewCol('detail', 'amount')))
        .whereDistinct()
        .orderBy(op.asc('myAmount'))
        .result();
      output;`
    db.eval(src)
    .result(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(3);
      expect(output[0].value.myAmount).to.equal(40.04);
      expect(output[2].value.myAmount).to.equal(60.06);
      done();
    }, done);
  });

  it('TEST 22 - limit with positive value', function(done){
    var src =
      `const op = require('/MarkLogic/optic');
      const plan1 =
        op.fromView('opticFunctionalTest', 'detail', 'myDetail');
      const plan2 =
        op.fromView('opticFunctionalTest', 'master', 'myMaster');
      const masterIdCol1 = plan1.col('masterId');
      const masterIdCol2 = plan2.col('id');
      const detailIdCol = plan1.col('id');
      const detailNameCol = plan1.col('name');
      const masterNameCol = plan2.col('name');
      const output =
        plan1.joinInner(plan2)
        .where(op.eq(masterIdCol1, masterIdCol2))
        .select([masterIdCol2, masterNameCol, detailIdCol, detailNameCol])
        .orderBy(op.desc(detailNameCol))
        .limit(3)
        .result();
      output;` 
    db.eval(src)
    .result(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(3);
      expect(output[0].value['myMaster.id']).to.equal(2);
      expect(output[0].value['myMaster.name']).to.equal('Master 2');
      expect(output[0].value['myDetail.id']).to.equal(6);
      expect(output[0].value['myDetail.name']).to.equal('Detail 6');
      expect(output[2].value['myDetail.id']).to.equal(4);
      expect(output[2].value['myDetail.name']).to.equal('Detail 4');
      done();
    }, done);
  });

  it('TEST 23 - limit with large value', function(done){
    var src =
      `const op = require('/MarkLogic/optic');
      const plan1 =
        op.fromView('opticFunctionalTest', 'detail', 'myDetail');
      const plan2 =
        op.fromView('opticFunctionalTest', 'master', 'myMaster');
      const masterIdCol1 = plan1.col('masterId');
      const masterIdCol2 = plan2.col('id');
      const detailIdCol = plan1.col('id');
      const detailNameCol = plan1.col('name');
      const masterNameCol = plan2.col('name');
      const output =
        plan1.joinInner(plan2)
        .where(op.eq(masterIdCol1, masterIdCol2))
        .select([masterIdCol2, masterNameCol, detailIdCol, detailNameCol])
        .orderBy(op.desc(detailNameCol))
        .limit(10000)
        .result();
      output;` 
    db.eval(src)
    .result(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(6);
      done();
    }, done);
  });

  it('TEST 24 - offset with positive value', function(done){
    var src =
      `const op = require('/MarkLogic/optic');
      const plan1 =
        op.fromView('opticFunctionalTest', 'detail', 'myDetail');
      const plan2 =
        op.fromView('opticFunctionalTest', 'master', 'myMaster');
      const masterIdCol1 = plan1.col('masterId');
      const masterIdCol2 = plan2.col('id');
      const detailIdCol = plan1.col('id');
      const detailNameCol = plan1.col('name');
      const masterNameCol = plan2.col('name');
      const output =
        plan1.joinInner(plan2)
        .where(op.eq(masterIdCol1, masterIdCol2))
        .select([masterIdCol2, masterNameCol, detailIdCol, detailNameCol])
        .orderBy(op.desc(detailNameCol))
        .offset(3)
        .result();
      output;` 
    db.eval(src)
    .result(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(3);
      expect(output[0].value['myMaster.id']).to.equal(1);
      expect(output[0].value['myMaster.name']).to.equal('Master 1');
      expect(output[0].value['myDetail.id']).to.equal(3);
      expect(output[0].value['myDetail.name']).to.equal('Detail 3');
      expect(output[2].value['myDetail.id']).to.equal(1);
      expect(output[2].value['myDetail.name']).to.equal('Detail 1');
      done();
    }, done);
  });

  it('TEST 25 - offset with zero value', function(done){
    var src =
      `const op = require('/MarkLogic/optic');
      const plan1 =
        op.fromView('opticFunctionalTest', 'detail', 'myDetail');
      const plan2 =
        op.fromView('opticFunctionalTest', 'master', 'myMaster');
      const masterIdCol1 = plan1.col('masterId');
      const masterIdCol2 = plan2.col('id');
      const detailIdCol = plan1.col('id');
      const detailNameCol = plan1.col('name');
      const masterNameCol = plan2.col('name');
      const output =
        plan1.joinInner(plan2)
        .where(op.eq(masterIdCol1, masterIdCol2))
        .select([masterIdCol2, masterNameCol, detailIdCol, detailNameCol])
        .orderBy(op.desc(detailNameCol))
        .offset(0)
        .result();
      output;` 
    db.eval(src)
    .result(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(6);
      done();
    }, done);
  });

  it('TEST 26 - offset with out of bound value', function(done){
    var src =
      `const op = require('/MarkLogic/optic');
      const plan1 =
        op.fromView('opticFunctionalTest', 'detail', 'myDetail');
      const plan2 =
        op.fromView('opticFunctionalTest', 'master', 'myMaster');
      const masterIdCol1 = plan1.col('masterId');
      const masterIdCol2 = plan2.col('id');
      const detailIdCol = plan1.col('id');
      const detailNameCol = plan1.col('name');
      const masterNameCol = plan2.col('name');
      const output =
        plan1.joinInner(plan2)
        .where(op.eq(masterIdCol1, masterIdCol2))
        .select([masterIdCol2, masterNameCol, detailIdCol, detailNameCol])
        .orderBy(op.desc(detailNameCol))
        .offset(10)
        .result();
      output;` 
    db.eval(src)
    .result(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(0);
      done();
    }, done);
  });

  it('TEST 27 - offset and limit', function(done){
    var src =
      `const op = require('/MarkLogic/optic');
      const plan1 =
        op.fromView('opticFunctionalTest', 'detail', 'myDetail');
      const plan2 =
        op.fromView('opticFunctionalTest', 'master', 'myMaster');
      const masterIdCol1 = plan1.col('masterId');
      const masterIdCol2 = plan2.col('id');
      const detailIdCol = plan1.col('id');
      const detailNameCol = plan1.col('name');
      const masterNameCol = plan2.col('name');
      const output =
        plan1.joinInner(plan2)
        .where(op.eq(masterIdCol1, masterIdCol2))
        .select([masterIdCol2, masterNameCol, detailIdCol, detailNameCol])
        .orderBy(op.desc(detailNameCol))
        .offset(1)
        .limit(3)
        .result();
      output;` 
    db.eval(src)
    .result(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(3);
      expect(output[0].value['myMaster.id']).to.equal(1);
      expect(output[0].value['myMaster.name']).to.equal('Master 1');
      expect(output[0].value['myDetail.id']).to.equal(5);
      expect(output[0].value['myDetail.name']).to.equal('Detail 5');
      expect(output[2].value['myDetail.id']).to.equal(3);
      expect(output[2].value['myDetail.name']).to.equal('Detail 3');
      done();
    }, done);
  });

  it('TEST 28 - union with arrayAggregate', function(done){
    var src =
      `const op = require('/MarkLogic/optic');
      const plan1 =
        op.fromView('opticFunctionalTest', 'detail')
          .orderBy(op.schemaCol('opticFunctionalTest', 'detail', 'id'));
      const plan2 =
        op.fromView('opticFunctionalTest', 'master')
          .orderBy(op.schemaCol('opticFunctionalTest', 'master' , 'id'));
      const output =
        plan1.union(plan2)
        .select([
          op.as('MasterName', op.schemaCol('opticFunctionalTest', 'master', 'name')),
          op.schemaCol('opticFunctionalTest', 'master', 'date'),
          op.as('DetailName', op.schemaCol('opticFunctionalTest', 'detail', 'name')),
          op.schemaCol('opticFunctionalTest', 'detail', 'amount'),
          op.schemaCol('opticFunctionalTest', 'detail', 'color')
        ])
        .groupBy('MasterName', op.arrayAggregate('arrayDetail', 'DetailName'))
        .orderBy(op.desc(op.col('MasterName')))
        .result();
      output;`  
    db.eval(src)
    .result(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(3);
      expect(output[0].value.MasterName).to.equal('Master 2');
      expect(output[0].value.arrayDetail.length).to.equal(0);
      expect(output[1].value.MasterName).to.equal('Master 1');
      expect(output[1].value.arrayDetail.length).to.equal(0);
      expect(output[2].value.MasterName).to.equal(null);
      expect(output[2].value.arrayDetail.length).to.equal(6);
      expect(output[2].value.arrayDetail[0]).to.equal('Detail 1');
      done();
    }, done);
  });

  /*it('TEST 29 - group by with uda', function(done){
    var src =  
      `const op = require('/MarkLogic/optic');
      const plan1 =
        op.fromView('opticFunctionalTest', 'detail')
          .orderBy(op.schemaCol('opticFunctionalTest', 'detail', 'id'));
      const plan2 =
        op.fromView('opticFunctionalTest', 'master')
          .orderBy(op.schemaCol('opticFunctionalTest', 'master' , 'id'));
      const output =
        plan1.joinInner(plan2)
        .where(
          op.eq(
            op.schemaCol('opticFunctionalTest', 'master' , 'id'), 
            op.schemaCol('opticFunctionalTest', 'detail', 'masterId')
          )
        )
        .groupBy(op.schemaCol('opticFunctionalTest', 'master', 'name'), op.uda('DetailSum', op.schemaCol('opticFunctionalTest', 'detail', 'amount'), 'sampleplugin/sampleplugin', 'sum'))
        .orderBy(op.desc(op.col('DetailSum')))
        .result();
      output;`;
    db.eval(src)
    .result(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(2);
      expect(output[0].value['opticFunctionalTest.master.name']).to.equal('Master 2');
      expect(output[0].value.DetailSum).to.equal(120.12);
      expect(output[1].value['opticFunctionalTest.master.name']).to.equal('Master 1');
      expect(output[1].value.DetailSum).to.equal(90.09);
      done();
    }, done);
  });*/

  it('TEST 30 - join inner from different views', function(done){
    var src =  
      `const op = require('/MarkLogic/optic');
      const plan1 =
        op.fromView('opticFunctionalTest2', 'detail')
          .orderBy(op.schemaCol('opticFunctionalTest2', 'detail', 'id'));
      const plan2 =
        op.fromView('opticFunctionalTest', 'master')
          .orderBy(op.schemaCol('opticFunctionalTest', 'master' , 'id'));
      const output =
        plan1.joinInner(plan2)
        .where(
          op.eq(
            op.schemaCol('opticFunctionalTest', 'master' , 'id'),
            op.schemaCol('opticFunctionalTest2', 'detail', 'masterId')
          )
        )
        .orderBy(op.asc(op.schemaCol('opticFunctionalTest2', 'detail', 'id')))
        .result();
      output;`
    db.eval(src)
    .result(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(3);
      expect(output[0].value['opticFunctionalTest2.detail.id']).to.equal(9);
      expect(output[0].value['opticFunctionalTest.master.id']).to.equal(1);
      expect(output[1].value['opticFunctionalTest2.detail.id']).to.equal(10);
      expect(output[1].value['opticFunctionalTest.master.id']).to.equal(2);
      expect(output[2].value['opticFunctionalTest2.detail.id']).to.equal(12);
      expect(output[2].value['opticFunctionalTest.master.id']).to.equal(1);
      done();
    }, done);
  });

  it('TEST 31 - groupBy from different views', function(done){
    var src =  
      `const op = require('/MarkLogic/optic');
      const plan1 =
        op.fromView('opticFunctionalTest2', 'detail')
          .orderBy(op.schemaCol('opticFunctionalTest2', 'detail', 'id'));
      const plan2 =
        op.fromView('opticFunctionalTest', 'master')
          .orderBy(op.schemaCol('opticFunctionalTest', 'master' , 'id'));
      const output =
        plan1.joinInner(plan2)
        .where(
          op.eq(
            op.schemaCol('opticFunctionalTest', 'master' , 'id'),
            op.schemaCol('opticFunctionalTest2', 'detail', 'masterId')
          )
        )
        .groupBy(op.schemaCol('opticFunctionalTest', 'master', 'name'), op.avg('AvgCol', op.schemaCol('opticFunctionalTest2', 'detail', 'amount')))
        .groupBy(null, op.avg('totalAvgCol', 'AvgCol'))
        .result();
      output;`
    db.eval(src)
    .result(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(1);
      expect(output[0].value.totalAvgCol).to.equal(39.82);
      done();
    }, done);
  });

  it('TEST 32 - simple intersect on same schema', function(done){
    var src =  
      `const op = require('/MarkLogic/optic');
      const plan1 =
        op.fromView('opticFunctionalTest', 'master')
          .orderBy(op.schemaCol('opticFunctionalTest', 'master' , 'id'));
      const plan2 =
        op.fromView('opticFunctionalTest', 'detail')
          .orderBy(op.schemaCol('opticFunctionalTest', 'detail', 'id'));
      const output =
        plan1
        .select(op.col('id'), '')
        .intersect(
          plan2
          .select(op.col('id'), '')
        )
        .orderBy(op.asc(op.col('id')))
        .result();
      output;`
    db.eval(src)
    .result(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(2);
      expect(output[0].value.id).to.equal(1);
      expect(output[1].value.id).to.equal(2);
      done();
    }, done);
  });

  it('TEST 33 - intersect on different schemas', function(done){
    var src = 
      `const op = require('/MarkLogic/optic');
      const plan1 =
        op.fromView('opticFunctionalTest', 'master');
      const plan2 =
        op.fromView('opticFunctionalTest2', 'master');
      const plan3 =
        op.fromView('opticFunctionalTest', 'detail');
      const output =
        plan1.select(op.as('unionId', op.schemaCol('opticFunctionalTest', 'master', 'id')))
        .union(plan2.select(op.as('unionId', op.schemaCol('opticFunctionalTest2', 'master', 'id'))))
        .intersect(
          plan3
          .select(op.as('unionId', op.schemaCol('opticFunctionalTest', 'detail', 'id')))
        )
        .orderBy('unionId')
        .result();
      output;` 
    db.eval(src)
    .result(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(4);
      expect(output[0].value.unionId).to.equal(1);
      expect(output[1].value.unionId).to.equal(2);
      expect(output[2].value.unionId).to.equal(3);
      expect(output[3].value.unionId).to.equal(4);
      done();
    }, done);
  });

  it('TEST 34 - except on different schemas', function(done){
    var src = 
      `const op = require('/MarkLogic/optic');
      const plan1 =
        op.fromView('opticFunctionalTest', 'master');
      const plan2 =
        op.fromView('opticFunctionalTest2', 'master');
      const plan3 =
        op.fromView('opticFunctionalTest2', 'detail');
      const output =
        plan3
        .select(op.as('unionId', op.schemaCol('opticFunctionalTest2', 'detail', 'id')))
        .except(
          plan1.select(op.as('unionId', op.schemaCol('opticFunctionalTest', 'master', 'id')))
          .union(plan2.select(op.as('unionId', op.schemaCol('opticFunctionalTest2', 'master', 'id'))))
        )
        .orderBy('unionId')
        .result();
      output;`
    db.eval(src)
    .result(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(6);
      expect(output[0].value.unionId).to.equal(7);
      expect(output[1].value.unionId).to.equal(8);
      expect(output[2].value.unionId).to.equal(9);
      expect(output[3].value.unionId).to.equal(10);
      expect(output[5].value.unionId).to.equal(12);
      done();
    }, done);
  });

  it('TEST 35 - complex except on different schemas', function(done){
    var src = 
      `const op = require('/MarkLogic/optic');
      const plan1 =
        op.fromView('opticFunctionalTest', 'master');
      const plan2 =
        op.fromView('opticFunctionalTest2', 'master');
      const plan3 =
        op.fromView('opticFunctionalTest2', 'detail');
      const plan4 =
        op.fromView('opticFunctionalTest', 'detail');
      const output =
        plan3.select(op.as('unionId', op.schemaCol('opticFunctionalTest2', 'detail', 'id')))
        .union(plan4.select(op.as('unionId', op.schemaCol('opticFunctionalTest', 'detail', 'id'))))
        .except(
          plan1.select(op.as('unionId', op.schemaCol('opticFunctionalTest', 'master', 'id')))
          .union(plan2.select(op.as('unionId', op.schemaCol('opticFunctionalTest2', 'master', 'id'))))
        )
        .orderBy('unionId')
        .result();
      output;`
    db.eval(src)
    .result(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(8);
      expect(output[0].value.unionId).to.equal(5);
      expect(output[1].value.unionId).to.equal(6);
      expect(output[2].value.unionId).to.equal(7);
      expect(output[3].value.unionId).to.equal(8);
      expect(output[7].value.unionId).to.equal(12);
      done();
    }, done);
  });

  it('TEST 36 - with new implementation of backquote ', function(done){
    var src = 
      `const op = require('/MarkLogic/optic');
      const plan1 =
        op.fromView('opticFunctionalTest', 'detail')
          .orderBy(op.schemaCol('opticFunctionalTest', 'detail', 'id'));
      const plan2 =
        op.fromView('opticFunctionalTest', 'master')
          .orderBy(op.schemaCol('opticFunctionalTest', 'master' , 'id'));
      const output =
        plan1.joinInner(plan2)
        .where(
          op.eq(
            op.schemaCol('opticFunctionalTest', 'master' , 'id'),
            op.schemaCol('opticFunctionalTest', 'detail', 'masterId')
          )
        )
        .orderBy(op.asc(op.schemaCol('opticFunctionalTest', 'detail', 'id')))
        .result();
      output;`
 
    db.eval(src)
    .result(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(6);
      expect(output[0].value['opticFunctionalTest.detail.id']).to.equal(1);
      expect(output[0].value['opticFunctionalTest.master.id']).to.equal(1);
      expect(output[0].value['opticFunctionalTest.detail.masterId']).to.equal(1);
      expect(output[0].value['opticFunctionalTest.detail.name']).to.equal('Detail 1');
      expect(output[5].value['opticFunctionalTest.detail.id']).to.equal(6);
      expect(output[5].value['opticFunctionalTest.master.id']).to.equal(2);
      expect(output[5].value['opticFunctionalTest.detail.masterId']).to.equal(2);
      expect(output[5].value['opticFunctionalTest.detail.name']).to.equal('Detail 6');
      done();
    }, done);
  });

  it('TEST 37 - using fragment id', function(done){
    var src =
      `const op = require('/MarkLogic/optic');
      const fIdCol2 = op.fragmentIdCol('fragIdCol2');
      const plan1 =
        op.fromView('opticFunctionalTest', 'detail', null, op.fragmentIdCol('fragIdCol1'))
          .orderBy(op.schemaCol('opticFunctionalTest', 'detail', 'id'));
      const plan2 =
        op.fromView('opticFunctionalTest', 'master', null, fIdCol2)
          .orderBy(op.schemaCol('opticFunctionalTest', 'master' , 'id'));
      const output =
        plan1.joinInner(plan2)
        .where(
          op.eq(
            op.schemaCol('opticFunctionalTest', 'master' , 'id'), 
            op.schemaCol('opticFunctionalTest', 'detail', 'masterId')
          )
        )
        .select([
          op.as('MasterName', op.schemaCol('opticFunctionalTest', 'master', 'name')),
          op.schemaCol('opticFunctionalTest', 'master', 'date'),
          op.as('DetailName', op.schemaCol('opticFunctionalTest', 'detail', 'name')),
          op.schemaCol('opticFunctionalTest', 'detail', 'amount'),
          op.schemaCol('opticFunctionalTest', 'detail', 'color'),
          'fragIdCol1',
          fIdCol2
        ])
        .orderBy(op.desc(op.col('DetailName')))
        .result();
      output;`  
    db.eval(src)
    .result(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(6);
      expect(output[0].value.MasterName).to.equal('Master 2');
      expect(output[0].value.DetailName).to.equal('Detail 6');
      expect(output[0].value['opticFunctionalTest.detail.amount']).to.equal(60.06);
      expect(output[0].value['opticFunctionalTest.detail.fragIdCol1']).to.not.exist;
      expect(output[5].value.MasterName).to.equal('Master 1');
      expect(output[5].value.DetailName).to.equal('Detail 1');
      expect(output[5].value['opticFunctionalTest.detail.color']).to.equal('blue');
      expect(output[5].value['opticFunctionalTest.master.fragIdCol2']).to.not.exist;
      done();
    }, done);
  });

  it('TEST 38 - using explain', function(done){
    var src =
      `const op = require('/MarkLogic/optic');
      const fIdCol2 = op.fragmentIdCol('fragIdCol2');
      const plan1 =
        op.fromView('opticFunctionalTest', 'detail', null, op.fragmentIdCol('fragIdCol1'))
          .orderBy(op.schemaCol('opticFunctionalTest', 'detail', 'id'));
      const plan2 =
        op.fromView('opticFunctionalTest', 'master', null, fIdCol2)
          .orderBy(op.schemaCol('opticFunctionalTest', 'master' , 'id'));
      const output =
        plan1.joinInner(plan2)
        .where(
          op.eq(
            op.schemaCol('opticFunctionalTest', 'master' , 'id'), 
            op.schemaCol('opticFunctionalTest', 'detail', 'masterId')
          )
        )
        .select([
          op.as('MasterName', op.schemaCol('opticFunctionalTest', 'master', 'name')),
          op.schemaCol('opticFunctionalTest', 'master', 'date'),
          op.as('DetailName', op.schemaCol('opticFunctionalTest', 'detail', 'name')),
          op.schemaCol('opticFunctionalTest', 'detail', 'amount'),
          op.schemaCol('opticFunctionalTest', 'detail', 'color'),
          'fragIdCol1',
          fIdCol2
        ])
        .orderBy(op.desc(op.col('DetailName')))
        .explain();
      output;`  
    db.eval(src)
    .result(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(1);
      expect(output[0].format).to.equal('xml');
      expect(output[0].datatype).to.equal('node()');
      expect(output[0].value).to.contain('<plan:plan xmlns:plan=\"http://marklogic.com/plan\">');
      expect(output[0].value).to.contain('<plan:column name=\"opticFunctionalTest.detail.color\" column-index=\"4\" static-type=\"STRING\"/>');
      done();
    }, done);
  });

  it('TEST 39 - contains in where', function(done){
    var src =
      `const op = require('/MarkLogic/optic');
      const plan1 =
        op.fromView('opticFunctionalTest', 'detail', 'myDetail');
            
      const idCol = plan1.col('id');
      const nameCol = plan1.col('name');
      const output =
        op.fromView('opticFunctionalTest', 'detail', 'myDetail')
        .where(op.fn.contains(nameCol, op.xs.string('Detail 6')))
        .select([idCol, nameCol])
        .orderBy(op.desc(nameCol))
        .result();
      output;`
  
    db.eval(src)
    .result(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(1);
      expect(output[0].value['myDetail.id']).to.equal(6);
      expect(output[0].value['myDetail.name']).to.equal('Detail 6');
      done();
    }, done);
  });

  it('TEST 40 - where not with equal', function(done){
    var src =
      `const op = require('/MarkLogic/optic');
      const plan1 =
        op.fromView('opticFunctionalTest', 'detail', 'myDetail');
      const plan2 =
        op.fromView('opticFunctionalTest', 'master', 'myMaster');
      const masterIdCol1 = plan1.col('masterId');
      const masterIdCol2 = plan2.col('id');
      const detailIdCol = plan1.col('id');
      const detailNameCol = plan1.col('name');
      const masterNameCol = plan2.col('name');
      const output =
        plan1.joinInner(plan2)
        .where(op.not(op.eq(masterIdCol1, masterIdCol2)))
        .select([masterIdCol1, masterIdCol2, masterNameCol, detailIdCol, detailNameCol])
        .orderBy(op.desc(detailNameCol))
        .offsetLimit(1, 3)
        .result();
      output;` 
    db.eval(src)
    .result(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(3);
      expect(output[0].value['myDetail.masterId']).to.equal(1);
      expect(output[0].value['myMaster.id']).to.equal(2);
      expect(output[2].value['myDetail.masterId']).to.equal(1);
      expect(output[2].value['myMaster.id']).to.equal(2);
      done();
    }, done);
  });

  it('TEST 41 - select with empty qualifier', function(done){
    var src =
      `const op = require('/MarkLogic/optic');
      const plan1 =
        op.fromView('opticFunctionalTest', 'detail', 'myDetail');
      const plan2 =
        op.fromView('opticFunctionalTest', 'master', 'myMaster');
      const masterIdCol1 = plan1.col('masterId');
      const masterIdCol2 = plan2.col('id');
      const detailIdCol = plan1.col('id');
      const detailNameCol = plan1.col('name');
      const masterNameCol = plan2.col('name');
      const output =
        plan1.joinInner(plan2)
        .where(op.eq(masterIdCol1, masterIdCol2))
        .select([masterIdCol2, detailNameCol], '')
        .orderBy(op.desc('name'))
        .offsetLimit(1, 3)
        .result();
      output;` 
    db.eval(src)
    .result(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(3);
      expect(output[0].value.id).to.equal(1);
      expect(output[0].value.name).to.equal('Detail 5');
      expect(output[2].value.id).to.equal(1);
      expect(output[2].value.name).to.equal('Detail 3');
      done();
    }, done);
  });

  it('TEST 42 - select with new qualifier', function(done){
    var src =
      `const op = require('/MarkLogic/optic');
      const plan1 =
        op.fromView('opticFunctionalTest', 'detail', 'myDetail');
      const plan2 =
        op.fromView('opticFunctionalTest', 'master', 'myMaster');
      const masterIdCol1 = plan1.col('masterId');
      const masterIdCol2 = plan2.col('id');
      const detailIdCol = plan1.col('id');
      const detailNameCol = plan1.col('name');
      const masterNameCol = plan2.col('name');
      const output =
        plan1.joinInner(plan2)
        .where(op.eq(masterIdCol1, masterIdCol2))
        .select([masterIdCol2, detailNameCol], 'newAlias')
        .orderBy(op.desc('name'))
        .offsetLimit(1, 3)
        .result();
      output;` 
    db.eval(src)
    .result(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(3);
      expect(output[0].value['newAlias.id']).to.equal(1);
      expect(output[0].value['newAlias.name']).to.equal('Detail 5');
      expect(output[2].value['newAlias.id']).to.equal(1);
      expect(output[2].value['newAlias.name']).to.equal('Detail 3');
      done();
    }, done);
  });

  it('TEST 43 - date sort', function(done){
    var src =
      `const op = require('/MarkLogic/optic');
      const plan1 =
        op.fromView('opticFunctionalTest', 'detail')
          .orderBy(op.schemaCol('opticFunctionalTest', 'detail', 'id'));
      const plan2 =
        op.fromView('opticFunctionalTest', 'master')
          .orderBy(op.schemaCol('opticFunctionalTest', 'master' , 'id'));
      const output =
        plan1.joinInner(plan2)
        .where(
          op.eq(
            op.schemaCol('opticFunctionalTest', 'master' , 'id'), 
            op.schemaCol('opticFunctionalTest', 'detail', 'masterId')
          )
        )
        .select([
          op.as('MasterName', op.schemaCol('opticFunctionalTest', 'master', 'name')),
          op.schemaCol('opticFunctionalTest', 'master', 'date'),
          op.as('DetailName', op.schemaCol('opticFunctionalTest', 'detail', 'name')),
          op.schemaCol('opticFunctionalTest', 'detail', 'amount'),
          op.schemaCol('opticFunctionalTest', 'detail', 'color')
        ])
        .orderBy([op.desc(op.col('date')), op.desc(op.col('DetailName'))])
        .result();
      output;`  
    db.eval(src)
    .result(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(6);
      expect(output[0].value.MasterName).to.equal('Master 2');
      expect(output[0].value.DetailName).to.equal('Detail 6');
      expect(output[0].value['opticFunctionalTest.master.date']).to.equal('2015-12-02');
      expect(output[5].value.MasterName).to.equal('Master 1');
      expect(output[5].value.DetailName).to.equal('Detail 1');
      expect(output[5].value['opticFunctionalTest.master.date']).to.equal('2015-12-01');
      done();
    }, done);
  });

  it('TEST 44 - import from doc plan', function(done){
    var src =
      `const op = require('/MarkLogic/optic');
      const importedPlan = op.import(cts.doc('/optic/plan/test/planViews.json'));
      const output = importedPlan.result();
      output;` 
    db.eval(src)
    .result(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(1);
      expect(output[0].value['myMaster.id']).to.equal(1);
      expect(output[0].value['myMaster.name']).to.equal('Master 1');
      expect(output[0].value['myDetail.id']).to.equal(1);
      expect(output[0].value['myDetail.name']).to.equal('Detail 1');
      expect(output[0].value['myDetail.masterId']).to.equal(1);
      done();
    }, done);
  });

  it('TEST 45 - get internal plan', function(done){
    var src =  
      `const op = require('/MarkLogic/optic');
      op.collectPlanInternal(true);
      const plan1 =
        op.fromView('opticFunctionalTest', 'detail');
      const plan2 =
        op.fromView('opticFunctionalTest', 'master');
      const output =
        plan1.joinInner(plan2)
        .where(
          op.eq(
            op.schemaCol('opticFunctionalTest', 'master' , 'id'),
            op.schemaCol('opticFunctionalTest', 'detail', 'masterId')
          )
        )
        .orderBy(op.asc(op.schemaCol('opticFunctionalTest', 'detail', 'id')))
        .toPlanInternal();
      output;`
    db.eval(src)
    .result(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(1);
      expect(output[0].value).to.equal('const p0 = plan.view(\"opticFunctionalTest\", \"detail\");\nconst p1_0 = plan.view(\"opticFunctionalTest\", \"master\");\nconst p1 = plan.join(p0, p1_0, null);\nconst p2 = plan.where(p1, \"(¿\\\"opticFunctionalTest\\\".\\\"master\\\".\\\"id\\\" = ¿\\\"opticFunctionalTest\\\".\\\"detail\\\".\\\"masterId\\\")\", null);\nconst p3 = plan.orderBy(p2, [plan.column(\"opticFunctionalTest\", \"detail\", \"id\")]);\nconst p4 = plan.select(p3, null);\nplan.execute(p4);');
      done();
    }, done);
  });

  it('TEST 46 - execute internal plan', function(done){
    var src =  
      `const op = require('/MarkLogic/optic');
      op.collectPlanInternal(true);
      const plan1 =
        op.fromView('opticFunctionalTest', 'detail');
      const plan2 =
        op.fromView('opticFunctionalTest', 'master');
      const output =
        plan1.joinInner(plan2)
        .where(
          op.eq(
            op.schemaCol('opticFunctionalTest', 'master' , 'id'),
            op.schemaCol('opticFunctionalTest', 'detail', 'masterId')
          )
        )
        .orderBy(op.asc(op.schemaCol('opticFunctionalTest', 'detail', 'id')))
        .toPlanInternal();
      xdmp.eval(output);`
    db.eval(src)
    .result(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(6);
      expect(output[0].value['opticFunctionalTest.detail.id']).to.equal(1);
      expect(output[0].value['opticFunctionalTest.master.id']).to.equal(1);
      expect(output[0].value['opticFunctionalTest.detail.masterId']).to.equal(1);
      expect(output[0].value['opticFunctionalTest.detail.name']).to.equal('Detail 1');
      expect(output[5].value['opticFunctionalTest.detail.id']).to.equal(6);
      expect(output[5].value['opticFunctionalTest.master.id']).to.equal(2);
      expect(output[5].value['opticFunctionalTest.detail.masterId']).to.equal(2);
      expect(output[5].value['opticFunctionalTest.detail.name']).to.equal('Detail 6');
      done();
    }, done);
  });

  it('TEST 48 - using explain with xml', function(done){
    var src =
      `const op = require('/MarkLogic/optic');
      const fIdCol2 = op.fragmentIdCol('fragIdCol2');
      const plan1 =
        op.fromView('opticFunctionalTest', 'detail', null, op.fragmentIdCol('fragIdCol1'))
          .orderBy(op.schemaCol('opticFunctionalTest', 'detail', 'id'));
      const plan2 =
        op.fromView('opticFunctionalTest', 'master', null, fIdCol2)
          .orderBy(op.schemaCol('opticFunctionalTest', 'master' , 'id'));
      const output =
        plan1.joinInner(plan2)
        .where(
          op.eq(
            op.schemaCol('opticFunctionalTest', 'master' , 'id'), 
            op.schemaCol('opticFunctionalTest', 'detail', 'masterId')
          )
        )
        .select([
          op.as('MasterName', op.schemaCol('opticFunctionalTest', 'master', 'name')),
          op.schemaCol('opticFunctionalTest', 'master', 'date'),
          op.as('DetailName', op.schemaCol('opticFunctionalTest', 'detail', 'name')),
          op.schemaCol('opticFunctionalTest', 'detail', 'amount'),
          op.schemaCol('opticFunctionalTest', 'detail', 'color'),
          'fragIdCol1',
          fIdCol2
        ])
        .orderBy(op.desc(op.col('DetailName')))
        .explain('xml');
      output;`  
    db.eval(src)
    .result(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(1);
      expect(output[0].format).to.equal('xml');
      expect(output[0].datatype).to.equal('node()');
      expect(output[0].value).to.contain('<plan:plan xmlns:plan=\"http://marklogic.com/plan\">');
      expect(output[0].value).to.contain('<plan:column name=\"opticFunctionalTest.master.date\" column-index=\"1\" static-type=\"UNKNOWN\"/>');
      done();
    }, done);
  });

  it('TEST 49 - using explain with json', function(done){
    var src =
      `const op = require('/MarkLogic/optic');
      const fIdCol2 = op.fragmentIdCol('fragIdCol2');
      const plan1 =
        op.fromView('opticFunctionalTest', 'detail', null, op.fragmentIdCol('fragIdCol1'))
          .orderBy(op.schemaCol('opticFunctionalTest', 'detail', 'id'));
      const plan2 =
        op.fromView('opticFunctionalTest', 'master', null, fIdCol2)
          .orderBy(op.schemaCol('opticFunctionalTest', 'master' , 'id'));
      const output =
        plan1.joinInner(plan2)
        .where(
          op.eq(
            op.schemaCol('opticFunctionalTest', 'master' , 'id'), 
            op.schemaCol('opticFunctionalTest', 'detail', 'masterId')
          )
        )
        .select([
          op.as('MasterName', op.schemaCol('opticFunctionalTest', 'master', 'name')),
          op.schemaCol('opticFunctionalTest', 'master', 'date'),
          op.as('DetailName', op.schemaCol('opticFunctionalTest', 'detail', 'name')),
          op.schemaCol('opticFunctionalTest', 'detail', 'amount'),
          op.schemaCol('opticFunctionalTest', 'detail', 'color'),
          'fragIdCol1',
          fIdCol2
        ])
        .orderBy(op.desc(op.col('DetailName')))
        .explain('json');
      output;`  
    db.eval(src)
    .result(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(1);
      expect(output[0].format).to.equal('json');
      expect(output[0].datatype).to.equal('node()');
      done();
    }, done);
  });

  it('TEST 50 - join doc on json plan', function(done){
    var src =  
      `const op = require('/MarkLogic/optic');
      const fIdCol1 = op.fragmentIdCol('fragIdCol1');
      const fIdCol2 = op.fragmentIdCol('fragIdCol2');
      const plan1 =
        op.fromView('opticFunctionalTest2', 'detail', null, fIdCol2)
          .orderBy(op.schemaCol('opticFunctionalTest2', 'detail', 'id'));
      const plan2 =
        op.fromView('opticFunctionalTest', 'master', null, fIdCol1)
          .orderBy(op.schemaCol('opticFunctionalTest', 'master' , 'id'));
      const output =
        plan1.joinInner(plan2)
        .where(
          op.eq(
            op.schemaCol('opticFunctionalTest', 'master' , 'id'),
            op.schemaCol('opticFunctionalTest2', 'detail', 'masterId')
          )
        )
        .joinDoc(op.col('doc'), fIdCol2)
        .orderBy(op.asc(op.schemaCol('opticFunctionalTest2', 'detail', 'id')))
        .result();
      output;`
    db.eval(src)
    .result(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(3);
      expect(output[0].value['opticFunctionalTest2.detail.id']).to.equal(9);
      expect(output[0].value['opticFunctionalTest.master.id']).to.equal(1);
      expect(output[0].value.doc.sets2.masterSet.master[0].name).to.equal('Master 3');
      expect(output[1].value['opticFunctionalTest2.detail.id']).to.equal(10);
      expect(output[1].value['opticFunctionalTest.master.id']).to.equal(2);
      expect(output[1].value.doc.sets2.detailSet.detail[0].name).to.equal('Detail 7');
      expect(output[2].value['opticFunctionalTest2.detail.id']).to.equal(12);
      expect(output[2].value['opticFunctionalTest.master.id']).to.equal(1);
      expect(output[1].value.doc.sets2.detailSet.detail[5].color).to.equal('red');
      done();
    }, done);
  });

  it('TEST 51 - join doc on xml plan', function(done){
    var src =  
      `const op = require('/MarkLogic/optic');
      const fIdCol1 = op.fragmentIdCol('fragIdCol1');
      const fIdCol2 = op.fragmentIdCol('fragIdCol2');
      const plan1 =
        op.fromView('opticFunctionalTest2', 'detail', null, fIdCol2)
          .orderBy(op.schemaCol('opticFunctionalTest2', 'detail', 'id'));
      const plan2 =
        op.fromView('opticFunctionalTest', 'master', null, fIdCol1)
          .orderBy(op.schemaCol('opticFunctionalTest', 'master' , 'id'));
      const output =
        plan1.joinInner(plan2)
        .where(
          op.eq(
            op.schemaCol('opticFunctionalTest', 'master' , 'id'),
            op.schemaCol('opticFunctionalTest2', 'detail', 'masterId')
          )
        )
        .joinDoc(op.col('doc'), fIdCol1)
        .orderBy(op.asc(op.schemaCol('opticFunctionalTest2', 'detail', 'id')))
        .result();
      output;`
    db.eval(src)
    .result(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(3);
      expect(output[0].value['opticFunctionalTest2.detail.id']).to.equal(9);
      expect(output[0].value['opticFunctionalTest.master.id']).to.equal(1);
      expect(output[0].value.doc).to.contain('<name>Master 1</name>');
      expect(output[1].value['opticFunctionalTest2.detail.id']).to.equal(10);
      expect(output[1].value['opticFunctionalTest.master.id']).to.equal(2);
      expect(output[1].value.doc).to.contain('<name>Detail 4</name>');
      expect(output[2].value['opticFunctionalTest2.detail.id']).to.equal(12);
      expect(output[2].value['opticFunctionalTest.master.id']).to.equal(1);
      expect(output[2].value.doc).to.contain('<name>Detail 6</name>');
      done();
    }, done);
  });

  it('TEST 52 - as with conditional on null', function(done){
    var src =
      `const op = require('/MarkLogic/optic');
      const plan1 =
        op.fromView('opticFunctionalTest', 'detail')
          .orderBy(op.schemaCol('opticFunctionalTest', 'detail', 'id'));
      const plan2 =
        op.fromView('opticFunctionalTest', 'master')
          .orderBy(op.schemaCol('opticFunctionalTest', 'master' , 'id'));
      const output =
        plan1.joinInner(plan2)
        .where(
          op.eq(
            op.schemaCol('opticFunctionalTest', 'master' , 'id'), 
            op.schemaCol('opticFunctionalTest', 'detail', 'masterId')
          )
        )
        .select([
          op.as('MasterName', op.schemaCol('opticFunctionalTest', 'master', 'name')),
          op.schemaCol('opticFunctionalTest', 'master', 'date'),
          op.as('DetailName', op.schemaCol('opticFunctionalTest', 'detail', 'name')),
          op.as('MyAmount', op.sem.if(op.gt(op.schemaCol('opticFunctionalTest', 'detail', 'amount'), 40), 'Y', null)),
          op.schemaCol('opticFunctionalTest', 'detail', 'color')
        ])
        .orderBy(op.desc(op.col('DetailName')))
        .result();
      output;`  
    db.eval(src)
    .result(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(6);
      expect(output[0].value.MasterName).to.equal('Master 2');
      expect(output[0].value.DetailName).to.equal('Detail 6');
      expect(output[0].value.MyAmount).to.equal('Y');
      expect(output[5].value.MasterName).to.equal('Master 1');
      expect(output[5].value.DetailName).to.equal('Detail 1');
      expect(output[5].value.MyAmount).to.equal(null);
      expect(output[5].value['opticFunctionalTest.detail.color']).to.equal('blue');
      done();
    }, done);
  });

  it('TEST 53 - join left outer with order by on null column', function(done){
    var src =
      `const op = require('/MarkLogic/optic');
      const plan1 =
        op.fromView('opticFunctionalTest', 'detail')
          .orderBy(op.schemaCol('opticFunctionalTest', 'detail', 'id'));
      const plan2 =
        op.fromView('opticFunctionalTest', 'master')
          .orderBy(op.schemaCol('opticFunctionalTest', 'master' , 'id'));
      const output =
        plan1.joinLeftOuter(plan2)
        .select([
          op.as('MasterName', op.schemaCol('opticFunctionalTest', 'master', 'name')),
          op.schemaCol('opticFunctionalTest', 'master', 'date'),
          op.as('DetailName', op.schemaCol('opticFunctionalTest', 'detail', 'name')),
          op.as('MyAmount', op.sem.if(op.gt(op.schemaCol('opticFunctionalTest', 'detail', 'amount'), 40), 'Y', null)),
          op.schemaCol('opticFunctionalTest', 'detail', 'color')
        ])
        .orderBy([op.desc(op.col('MyAmount')), op.asc(op.col('DetailName')), op.asc(op.col('MasterName'))])
        .result();
      output;`  
    db.eval(src)
    .result(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(12);
      expect(output[0].value.MasterName).to.equal('Master 1');
      expect(output[0].value.DetailName).to.equal('Detail 4');
      expect(output[0].value.MyAmount).to.equal('Y');
      expect(output[11].value.MasterName).to.equal('Master 2');
      expect(output[11].value.DetailName).to.equal('Detail 3');
      expect(output[11].value.MyAmount).to.equal(null);
      expect(output[11].value['opticFunctionalTest.detail.color']).to.equal('blue');
      done();
    }, done);
  });

  it('TEST 54 - with sql condition', function(done){
    var src =
      `const op = require('/MarkLogic/optic');
      const plan1 =
        op.fromView('opticFunctionalTest', 'detail')
          .orderBy(op.schemaCol('opticFunctionalTest', 'detail', 'id'));
      const plan2 =
        op.fromView('opticFunctionalTest', 'master')
          .orderBy(op.schemaCol('opticFunctionalTest', 'master' , 'id'));
      const output =
        plan1.joinInner(plan2)
        .where(
          op.sqlCondition('opticFunctionalTest.master.id = opticFunctionalTest.detail.masterId')
        )
        .select([
          op.as('MasterName', op.schemaCol('opticFunctionalTest', 'master', 'name')),
          op.schemaCol('opticFunctionalTest', 'master', 'date'),
          op.as('DetailName', op.schemaCol('opticFunctionalTest', 'detail', 'name')),
          op.schemaCol('opticFunctionalTest', 'detail', 'amount'),
          op.schemaCol('opticFunctionalTest', 'detail', 'color')
        ])
        .orderBy(op.desc(op.col('DetailName')))
        .result();
      output;`  
    db.eval(src)
    .result(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(6);
      expect(output[0].value.MasterName).to.equal('Master 2');
      expect(output[0].value.DetailName).to.equal('Detail 6');
      expect(output[0].value['opticFunctionalTest.detail.amount']).to.equal(60.06);
      expect(output[5].value.MasterName).to.equal('Master 1');
      expect(output[5].value.DetailName).to.equal('Detail 1');
      expect(output[5].value['opticFunctionalTest.detail.color']).to.equal('blue');
      done();
    }, done);
  });

  it('TEST 55 - sql condition on qualifiers', function(done){
    var src =  
      `const op = require('/MarkLogic/optic');
      const plan1 =
        op.fromView('opticFunctionalTest', 'detail', 'myDetail')
          .orderBy(op.viewCol('myDetail', 'id'));
      const plan2 =
        op.fromView('opticFunctionalTest', 'master', 'myMaster')
          .orderBy(op.viewCol('myMaster' , 'id'));
      const output =
        plan1.joinInner(plan2)
        .where(
          op.sqlCondition('myMaster.id = myDetail.masterId')
        )
        .orderBy(op.viewCol('myDetail', 'id'))
        .result();
      output;`;
    db.eval(src)
    .result(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(6);
      expect(output[0].value['myDetail.id']).to.equal(1);
      expect(output[0].value['myMaster.id']).to.equal(1);
      expect(output[0].value['myDetail.masterId']).to.equal(1);
      expect(output[0].value['myDetail.name']).to.equal('Detail 1');
      expect(output[5].value['myDetail.id']).to.equal(6);
      expect(output[5].value['myMaster.id']).to.equal(2);
      expect(output[5].value['myDetail.masterId']).to.equal(2);
      expect(output[5].value['myDetail.name']).to.equal('Detail 6');
      done();
    }, done);
  });

  it('TEST 56 - sql condition with greater operator', function(done){
    var src =
      `const op = require('/MarkLogic/optic');
      const plan1 =
        op.fromView('opticFunctionalTest', 'detail', 'myDetail');
            
      const idCol = plan1.col('id');
      const nameCol = plan1.col('name');
      const output =
        op.fromView('opticFunctionalTest', 'detail', 'myDetail')
        .where(op.sqlCondition('myDetail.id > 3'))
        .select([idCol, nameCol])
        .orderBy(op.desc(nameCol))
        .result();
      output;`
  
    db.eval(src)
    .result(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(3);
      expect(output[0].value['myDetail.id']).to.equal(6);
      expect(output[0].value['myDetail.name']).to.equal('Detail 6');
      expect(output[2].value['myDetail.id']).to.equal(4);
      expect(output[2].value['myDetail.name']).to.equal('Detail 4');
      done();
    }, done);
  });

  it('TEST 57 - sql condition with AND operator', function(done){
    var src =
      `const op = require('/MarkLogic/optic');
      const plan1 =
        op.fromView('opticFunctionalTest', 'detail', 'myDetail');
            
      const idCol = plan1.col('id');
      const nameCol = plan1.col('name');
      const output =
        op.fromView('opticFunctionalTest', 'detail', 'myDetail')
        .where(op.sqlCondition("myDetail.id <> 3 AND myDetail.name != 'Detail 4'"))
        .select([idCol, nameCol])
        .orderBy(op.desc(nameCol))
        .result();
      output;`
  
    db.eval(src)
    .result(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(4);
      expect(output[0].value['myDetail.id']).to.equal(6);
      expect(output[0].value['myDetail.name']).to.equal('Detail 6');
      expect(output[2].value['myDetail.id']).to.equal(2);
      expect(output[2].value['myDetail.name']).to.equal('Detail 2');
      done();
    }, done);
  });

});
