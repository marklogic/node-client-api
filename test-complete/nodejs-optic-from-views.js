/*
 * Copyright 2014-2019 MarkLogic Corporation
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
const fs     = require('fs');

const marklogic = require('../');

const connectdef = require('../config-optic/connectdef.js');

const db = marklogic.createDatabaseClient(connectdef.plan);
const op = marklogic.planBuilder;

describe('Nodejs Optic from views test', function(){
  var oldTimestamp = db.createTimestamp('123');

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

  it('TEST 6 - union with select - format csv', function(done){
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
    db.rows.query(output, { format: 'csv', structure: 'object', columnTypes: 'header' })
    .then(function(output) {
      //console.log(output);
      expect(output).to.contain('MasterName,opticFunctionalTest.master.date,DetailName,opticFunctionalTest.detail.amount,opticFunctionalTest.detail.color');
      expect(output).to.contain(',,Detail 2,20.02,blue');
      expect(output).to.contain('Master 2,2015-12-02,,,');
      done();
    }, done);
  });

  it('TEST 7 - join cross product - format csv, structure array', function(done){
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
    db.rows.query(output, { format: 'csv', structure: 'array', columnTypes: 'header' })
    .then(function(output) {
      //console.log(output);
      expect(output).to.contain('["MasterName", "opticFunctionalTest.master.date", "DetailName", "opticFunctionalTest.detail.amount", "opticFunctionalTest.detail.color"]');
      expect(output).to.contain('["Master 1", "2015-12-01", "Detail 2", 20.02, "blue"]');
      expect(output).to.contain('["Master 2", "2015-12-02", "Detail 1", 10.01, "blue"]');
      done();
    }, done);
  });

  it('TEST 8 - accessor plan - complexValues reference', function(done){
    var count = 0;
    var str = '';
    const chunks = [];
    const plan1 =
      op.fromView('opticFunctionalTest', 'detail', 'myDetail');

    const idCol = plan1.col('id');
    const nameCol = plan1.col('name');
    const output =
      op.fromView('opticFunctionalTest', 'detail', 'myDetail')
      .where(op.gt(idCol, 3))
      .select([idCol, nameCol])
      .orderBy(op.desc(nameCol))

    db.rows.queryAsStream(output, 'object', { format: 'json', structure: 'object', columnTypes: 'header', complexValues: 'reference' })
    .on('data', function(chunk) {
      chunks.push(chunk.kind.toString());
      count++;
    }).
    on('end', function() {
      //console.log(count);
      //console.log(chunks.join(''));
      expect(chunks.join(' ')).to.equal('columns row row row');
      expect(count).to.equal(4);
      done();
    }, done);
  });

  it('TEST 9 - accessor plan - stream sequence, structure array, columnTypes header, complexValues inline', function(done){
    var count = 0;
    var str = '';
    const chunks = [];
    const plan1 =
      op.fromView('opticFunctionalTest', 'detail', 'myDetail');

    const idCol = plan1.col('id');
    const nameCol = plan1.col('name');
    const output =
      op.fromView('opticFunctionalTest', 'detail', 'myDetail')
      .where(op.gt(idCol, 3))
      .select([idCol, nameCol])
      .orderBy(op.desc(nameCol))

    db.rows.queryAsStream(output, 'sequence', { format: 'json', structure: 'array', columnTypes: 'header', complexValues: 'inline' })
    .on('data', function(chunk) {
      //console.log(chunk.toString());
      str = str + chunk.toString().trim().replace(/[\n\r]/g, ' ');
      count++;
    }).
    on('end', function() {
      //console.log(str);
      expect(str).to.equal('\u001e[{"name":"myDetail.id","type":"xs:integer"},{"name":"myDetail.name","type":"xs:string"}]\u001e[6,"Detail 6"]\u001e[5,"Detail 5"]\u001e[4,"Detail 4"]');
      done();
    }, done);
  });

  it('TEST 10 - accessor plan - stream chunked, structure array, columnTypes header, complexValues inline', function(done){
    var count = 0;
    var str = '';
    const chunks = [];
    const plan1 =
      op.fromView('opticFunctionalTest', 'detail', 'myDetail');

    const idCol = plan1.col('id');
    const nameCol = plan1.col('name');
    const output =
      op.fromView('opticFunctionalTest', 'detail', 'myDetail')
      .where(op.gt(idCol, 3))
      .select([idCol, nameCol])
      .orderBy(op.desc(nameCol))

    db.rows.queryAsStream(output, 'chunked', { format: 'json', structure: 'object', columnTypes: 'rows', complexValues: 'inline' })
    .on('data', function(chunk) {
      //console.log(chunk.toString());
      str = str + chunk.toString().trim().replace(/[\n\r]/g, ' ');
      count++;
    }).
    on('end', function() {
      //console.log(str);
      expect(str).to.equal('{ "columns": [{"name":"myDetail.id"},{"name":"myDetail.name"}], "rows":[ {"myDetail.id":{"type":"xs:integer","value":6},"myDetail.name":{"type":"xs:string","value":"Detail 6"}}, {"myDetail.id":{"type":"xs:integer","value":5},"myDetail.name":{"type":"xs:string","value":"Detail 5"}}, {"myDetail.id":{"type":"xs:integer","value":4},"myDetail.name":{"type":"xs:string","value":"Detail 4"}}] }');
      done();
    }, done);
  });

  /*it('TEST 11 - inner join with accessor plan and on', function(done){
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
    db.rows.query(output, { format: 'json', structure: 'object', columnTypes: 'header' })
    .then(function(output) {
      console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(3);
      expect(output[0].value['myMaster.id']).to.equal(1);
      expect(output[0].value['myMaster.name']).to.equal('Master 1');
      expect(output[0].value['myDetail.id']).to.equal(5);
      expect(output[0].value['myDetail.name']).to.equal('Detail 5');
      expect(output[2].value['myDetail.id']).to.equal(3);
      expect(output[2].value['myDetail.name']).to.equal('Detail 3');
      done();
    }, function(error) {console.log(error); done(); });
  });*/

  it('TEST 12 - join inner with null schema', function(done){
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
    db.rows.query(output, { format: 'json', structure: 'object', columnTypes: 'header' })
    .then(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.columns.length).to.equal(8);
      expect(output.rows.length).to.equal(3);
      expect(output.rows[0]['opticFunctionalTest3.detail3.id']).to.equal(7);
      expect(output.rows[0]['opticFunctionalTest3.master3.id']).to.equal(3);
      expect(output.rows[0]['opticFunctionalTest3.detail3.masterId']).to.equal(3);
      expect(output.rows[0]['opticFunctionalTest3.detail3.name']).to.equal('Detail 7');
      expect(output.rows[2]['opticFunctionalTest3.detail3.id']).to.equal(11);
      expect(output.rows[2]['opticFunctionalTest3.master3.id']).to.equal(3);
      expect(output.rows[2]['opticFunctionalTest3.detail3.masterId']).to.equal(3);
      expect(output.rows[2]['opticFunctionalTest3.detail3.name']).to.equal('Detail 11');
      done();
    }, done);
  });

  it('TEST 13 - join inner with where disctinct', function(done){
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
    db.rows.query(output, { format: 'json', structure: 'object', columnTypes: 'header' })
    .then(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.rows.length).to.equal(2);
      expect(output.rows[0]['opticFunctionalTest.detail.color']).to.equal('green');
      expect(output.rows[1]['opticFunctionalTest.detail.color']).to.equal('blue');
      done();
    }, done);
  });

  it('TEST 14 - join inner with multiple group by and different column identifiers - type checking', function(done){
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
    db.rows.query(output, { format: 'json', structure: 'object', columnTypes: 'header' })
    .then(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.columns[1].type).to.equal('xs:double');
      expect(output.columns[6].type).to.equal('xs:string');
      expect(output.columns[7].type).to.equal('xs:integer');
      expect(output.rows.length).to.equal(2);
      expect(output.rows[0].colorStat).to.equal('green');
      expect(output.rows[0].maxColor).to.equal(60.06);
      expect(output.rows[0].minColor).to.equal(40.04);
      expect(output.rows[0].avgColor).to.equal(50.05);
      expect(output.rows[0].sumColor).to.equal(150.15);
      expect(output.rows[0].masterCount).to.equal(3);
      expect(output.rows[0].sampleColor).to.not.equal(null);
      expect(output.rows[0].groupConcatColor).to.equal('40.04 and 50.05 and 60.06');
      expect(output.rows[1].colorStat).to.equal('blue');
      expect(output.rows[1].maxColor).to.equal(30.03);
      expect(output.rows[1].minColor).to.equal(10.01);
      expect(output.rows[1].avgColor).to.equal(20.02);
      expect(output.rows[1].sumColor).to.equal(60.06);
      expect(output.rows[1].masterCount).to.equal(3);
      expect(output.rows[1].groupConcatColor).to.equal('10.01 and 20.02 and 30.03');
      done();
    }, done);
  });

  it('TEST 15 - select with qualifier', function(done){
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
    db.rows.query(output, { format: 'json', structure: 'object', columnTypes: 'header' })
    .then(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.columns[0].name).to.equal('newRow.id');
      expect(output.rows.length).to.equal(6);
      expect(output.rows[0]['newRow.id']).to.equal(1);
      expect(output.rows[0]['newRow.color']).to.equal('blue');
      expect(output.rows[0]['newRow.name']).to.equal('Master 1');
      expect(output.rows[5]['newRow.id']).to.equal(6);
      expect(output.rows[5]['newRow.color']).to.equal('green');
      expect(output.rows[5]['newRow.name']).to.equal('Master 2');
      done();
    }, done);
  });

  it('TEST 16 - arithmetic operations', function(done){
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
    db.rows.query(output, { format: 'json', structure: 'object', columnTypes: 'header' })
    .then(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.columns[3].type).to.equal('null');
      expect(output.rows.length).to.equal(6);
      expect(output.rows[0].added).to.equal(11.01);
      expect(output.rows[0].substracted).to.equal(9.01);
      expect(output.rows[0].modulo).to.equal(0.00999999999999979);
      expect(output.rows[0].invSubstract).to.equal(null);
      expect(output.rows[0].divided).to.equal(1);
      expect(output.rows[5].added).to.equal(62.06);
      expect(output.rows[5].substracted).to.equal(58.06);
      expect(output.rows[5].modulo).to.equal(0.0600000000000023);
      expect(output.rows[5].invSubstract).to.equal(null);
      expect(output.rows[5].divided).to.equal(0.166666666666667);
      done();
    }, done);
  });

  it('TEST 17 - with value processing function on where', function(done){
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
    db.rows.query(output, { format: 'xml', structure: 'array', columnTypes: 'rows', complexValues: 'reference' })
    .then(function(output) {
      const outputStr = output.toString().trim().replace(/[\n\r]/g, '');
      expect(outputStr).to.equal('<t:table xmlns:t=\"http:\/\/marklogic.com\/table\"><t:columns><t:column name=\"myAmount\"/><\/t:columns><t:rows><t:row><t:cell name=\"myAmount\" type=\"xs:double\">40.04<\/t:cell><\/t:row><t:row><t:cell name=\"myAmount\" type=\"xs:double\">50.05<\/t:cell><\/t:row><t:row><t:cell name=\"myAmount\" type=\"xs:double\">60.06<\/t:cell><\/t:row></t:rows><\/t:table>');
      done();
    }, done);
  });

  it('TEST 18 - union with arrayAggregate - without row options', function(done){
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
    db.rows.query(output)
    .then(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.rows.length).to.equal(3);
      expect(output.rows[0].MasterName.value).to.equal('Master 2');
      expect(output.rows[0].MasterName.type).to.equal('xs:string');
      expect(output.rows[0].arrayDetail.value.length).to.equal(0);
      expect(output.rows[1].MasterName.value).to.equal('Master 1');
      expect(output.rows[1].arrayDetail.value.length).to.equal(0);
      expect(output.rows[2].MasterName.value).to.equal(null);
      expect(output.rows[2].arrayDetail.value.length).to.equal(6);
      expect(output.rows[2].arrayDetail.value[0]).to.equal('Detail 1');
      done();
    }, done);
  });

  it('TEST 19 - intersect on different schemas', function(done){
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
    db.rows.query(output, { format: 'json', structure: 'object', columnTypes: 'header', complexValues: 'inline' })
    .then(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.rows.length).to.equal(4);
      expect(output.rows[0].unionId).to.equal(1);
      expect(output.rows[1].unionId).to.equal(2);
      expect(output.rows[2].unionId).to.equal(3);
      expect(output.rows[3].unionId).to.equal(4);
      done();
    }, done);
  });

  it('TEST 20 - except on different schemas', function(done){
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
    db.rows.query(output, { format: 'json', structure: 'object', columnTypes: 'header', complexValues: 'inline' })
    .then(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.rows.length).to.equal(6);
      expect(output.rows[0].unionId).to.equal(7);
      expect(output.rows[1].unionId).to.equal(8);
      expect(output.rows[2].unionId).to.equal(9);
      expect(output.rows[3].unionId).to.equal(10);
      expect(output.rows[5].unionId).to.equal(12);
      done();
    }, done);
  });

  it('TEST 21 - using explain - format json', function(done){
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
    db.rows.explain(output, 'json')
    .then(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.node).to.equal('plan');
      expect(output.expr.expr.columns[0].name).to.equal('MasterName');
      done();
    }, done);
  });

  it('TEST 22 - using explain - format xml', function(done){
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
    db.rows.explain(output, 'xml')
    .then(function(output) {
      //console.log(output);
      expect(output).to.contain('<plan:plan xmlns:plan=\"http:\/\/marklogic.com\/plan\">');
      expect(output).to.contain('<plan:graph-node type=\"column-def\" name=\"opticFunctionalTest.detail.color\" schema=\"opticFunctionalTest\" column=\"color\" view=\"detail\" column-number=\"4\" column-index=\"4\" static-type=\"STRING\"\/>');
      done();
    }, done);
  });

  it('TEST 23 - date sort', function(done){
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
    db.rows.query(output, { format: 'json', structure: 'object', columnTypes: 'header', complexValues: 'inline' })
    .then(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.rows.length).to.equal(6);
      expect(output.rows[0].MasterName).to.equal('Master 2');
      expect(output.rows[0].DetailName).to.equal('Detail 6');
      expect(output.rows[0]['opticFunctionalTest.master.date']).to.equal('2015-12-02');
      expect(output.rows[5].MasterName).to.equal('Master 1');
      expect(output.rows[5].DetailName).to.equal('Detail 1');
      expect(output.rows[5]['opticFunctionalTest.master.date']).to.equal('2015-12-01');
      done();
    }, done);
  });

  it('TEST 24 - join doc on json plan', function(done){
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
    db.rows.query(output, { format: 'json', structure: 'object', columnTypes: 'header', complexValues: 'inline' })
    .then(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.rows.length).to.equal(3);
      expect(output.columns[2].name).to.equal('doc');
      expect(output.columns[2].type).to.equal('object');
      expect(output.rows[0]['opticFunctionalTest2.detail.id']).to.equal(9);
      expect(output.rows[0]['opticFunctionalTest.master.id']).to.equal(1);
      expect(output.rows[0].doc.sets2.masterSet.master[0].name).to.equal('Master 3');
      expect(output.rows[1]['opticFunctionalTest2.detail.id']).to.equal(10);
      expect(output.rows[1]['opticFunctionalTest.master.id']).to.equal(2);
      expect(output.rows[1].doc.sets2.detailSet.detail[0].name).to.equal('Detail 7');
      expect(output.rows[2]['opticFunctionalTest2.detail.id']).to.equal(12);
      expect(output.rows[2]['opticFunctionalTest.master.id']).to.equal(1);
      expect(output.rows[1].doc.sets2.detailSet.detail[5].color).to.equal('red');
      done();
    }, done);
  });

  it('TEST 25 - join doc on xml plan', function(done){
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
    db.rows.query(output, { format: 'json', structure: 'object', columnTypes: 'header', complexValues: 'inline' })
    .then(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.rows.length).to.equal(3);
      expect(output.columns[2].name).to.equal('doc');
      expect(output.columns[2].type).to.equal('element');
      expect(output.rows[0]['opticFunctionalTest2.detail.id']).to.equal(9);
      expect(output.rows[0]['opticFunctionalTest.master.id']).to.equal(1);
      expect(output.rows[0].doc).to.contain('<name>Master 1</name>');
      expect(output.rows[1]['opticFunctionalTest2.detail.id']).to.equal(10);
      expect(output.rows[1]['opticFunctionalTest.master.id']).to.equal(2);
      expect(output.rows[1].doc).to.contain('<name>Detail 4</name>');
      expect(output.rows[2]['opticFunctionalTest2.detail.id']).to.equal(12);
      expect(output.rows[2]['opticFunctionalTest.master.id']).to.equal(1);
      expect(output.rows[2].doc).to.contain('<name>Detail 6</name>');
      done();
    }, done);
  });

  it('TEST 26 - as with conditional on null', function(done){
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
    db.rows.query(output, { format: 'json', structure: 'object', columnTypes: 'header', complexValues: 'inline' })
    .then(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.rows.length).to.equal(6);
      expect(output.rows[0].MasterName).to.equal('Master 2');
      expect(output.rows[0].DetailName).to.equal('Detail 6');
      expect(output.rows[0].MyAmount).to.equal('Y');
      expect(output.rows[5].MasterName).to.equal('Master 1');
      expect(output.rows[5].DetailName).to.equal('Detail 1');
      expect(output.rows[5].MyAmount).to.equal(null);
      expect(output.rows[5]['opticFunctionalTest.detail.color']).to.equal('blue');
      done();
    }, done);
  });

  it('TEST 27 - with sql condition', function(done){
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
    db.rows.query(output, { format: 'json', structure: 'object', columnTypes: 'header', complexValues: 'inline' })
    .then(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.rows.length).to.equal(6);
      expect(output.rows[0].MasterName).to.equal('Master 2');
      expect(output.rows[0].DetailName).to.equal('Detail 6');
      expect(output.rows[0]['opticFunctionalTest.detail.amount']).to.equal(60.06);
      expect(output.rows[5].MasterName).to.equal('Master 1');
      expect(output.rows[5].DetailName).to.equal('Detail 1');
      expect(output.rows[5]['opticFunctionalTest.detail.color']).to.equal('blue');
      done();
    }, done);
  });

  it('TEST 28 - sql condition on qualifiers', function(done){
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
    db.rows.query(output, { format: 'json', structure: 'object', columnTypes: 'header', complexValues: 'inline' })
    .then(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.rows.length).to.equal(6);
      expect(output.rows[0]['myDetail.id']).to.equal(1);
      expect(output.rows[0]['myMaster.id']).to.equal(1);
      expect(output.rows[0]['myDetail.masterId']).to.equal(1);
      expect(output.rows[0]['myDetail.name']).to.equal('Detail 1');
      expect(output.rows[5]['myDetail.id']).to.equal(6);
      expect(output.rows[5]['myMaster.id']).to.equal(2);
      expect(output.rows[5]['myDetail.masterId']).to.equal(2);
      expect(output.rows[5]['myDetail.name']).to.equal('Detail 6');
      done();
    }, done);
  });

  it('TEST 29 - sql condition with AND operator', function(done){
    const plan1 =
      op.fromView('opticFunctionalTest', 'detail', 'myDetail');

    const idCol = plan1.col('id');
    const nameCol = plan1.col('name');
    const output =
      op.fromView('opticFunctionalTest', 'detail', 'myDetail')
      .where(op.sqlCondition("myDetail.id <> 3 AND myDetail.name != 'Detail 4'"))
      .select([idCol, nameCol])
      .orderBy(op.desc(nameCol))

    db.rows.query(output, { format: 'json', structure: 'object', columnTypes: 'header', complexValues: 'inline' })
    .then(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.rows.length).to.equal(4);
      expect(output.rows[0]['myDetail.id']).to.equal(6);
      expect(output.rows[0]['myDetail.name']).to.equal('Detail 6');
      expect(output.rows[2]['myDetail.id']).to.equal(2);
      expect(output.rows[2]['myDetail.name']).to.equal('Detail 2');
      done();
    }, done);
  });

  it('TEST 32 - offsetLimit, params and bindings', function(done){
    const plan1 =
      op.fromView('opticFunctionalTest', 'detail', 'myDetail');
    const plan2 =
      op.fromView('opticFunctionalTest', 'master', 'myMaster');
    const output =
      plan1.joinInner(plan2, op.on(op.viewCol('myDetail', 'masterId'), op.viewCol('myMaster', 'id')), op.ge(op.viewCol('myDetail', 'id'), op.param({name: 'detailIdVal'})))
      .select([op.viewCol('myMaster', 'id'), op.viewCol('myMaster', 'name'), op.viewCol('myDetail', 'id'), op.viewCol('myDetail', 'name')])
      .orderBy(op.desc(op.viewCol('myDetail', 'name')))
      .offsetLimit(op.param({name: 'start'}), op.param({name: 'length'}))
    db.rows.query(output, {
      format: 'json',
      structure: 'object',
      columnTypes: 'header',
      complexValues: 'inline',
      bindings: {
        'detailIdVal': {value: 3, type: 'integer'},
        'start': {value: 1, type: 'integer'},
        'length': {value: 100, type: 'integer'}
      }
    })
    .then(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.rows.length).to.equal(3);
      expect(output.rows[0]['myMaster.id']).to.equal(1);
      expect(output.rows[0]['myMaster.name']).to.equal('Master 1');
      expect(output.rows[0]['myDetail.id']).to.equal(5);
      expect(output.rows[0]['myDetail.name']).to.equal('Detail 5');
      expect(output.rows[2]['myDetail.id']).to.equal(3);
      expect(output.rows[2]['myDetail.name']).to.equal('Detail 3');
      done();
    }, done);
  });

  it('TEST 33 - inner join with accessor plan', function(done){
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
    db.rows.query(output, { format: 'json', structure: 'object', columnTypes: 'header'})
    .then(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.rows.length).to.equal(3);
      expect(output.rows[0]['myMaster.id']).to.equal(1);
      expect(output.rows[0]['myMaster.name']).to.equal('Master 1');
      expect(output.rows[0]['myDetail.id']).to.equal(5);
      expect(output.rows[0]['myDetail.name']).to.equal('Detail 5');
      expect(output.rows[2]['myDetail.id']).to.equal(3);
      expect(output.rows[2]['myDetail.name']).to.equal('Detail 3');
      done();
    }, done);
  });

  it('TEST 34 - negative case', function(done){
    var count = 0;
    var str = '';
    const chunks = [];
    const plan1 =
      op.fromView('opticFunctionalTest', 'detail', 'myDetail');

    const idCol = plan1.col('id');
    const nameCol = plan1.col('name');
    const output =
      op.fromView('opticFunctionalTest', 'invalidFoo', 'myDetail')
      .where(op.gt(idCol, 3))
      .select([idCol, nameCol])
      .orderBy(op.desc(nameCol))

    db.rows.queryAsStream(output, 'object', { format: 'json', structure: 'object', columnTypes: 'header', complexValues: 'reference' })
    .on('data', function(chunk) {
      chunks.push(chunk.kind.toString());
      count++;
    }).
    on('error', function(error) {
      //console.log(JSON.stringify(error, null, 2));
      expect(error.body.errorResponse.message).to.contain('Unknown table: Table \'opticFunctionalTest.invalidFoo\' not found');
    }).
    on('end', function() {
      expect(chunks).to.be.empty;
      done();
    }, done);
  });

  it('TEST 35 - with named parameters', function(done){
    const plan1 =
      op.fromView({schema: 'opticFunctionalTest', view: 'detail'})
        .orderBy({keys: op.schemaCol({schema: 'opticFunctionalTest', view: 'detail', column: 'id'})});
    const plan2 =
      op.fromView('opticFunctionalTest', 'master')
        .orderBy(op.schemaCol('opticFunctionalTest', 'master' , 'id'));
    const output =
      plan1.joinInner({right: plan2})
      .where({condition:
        op.eq({
          left: op.schemaCol({schema: 'opticFunctionalTest', view: 'master' , column: 'id'}),
          right: op.schemaCol('opticFunctionalTest', 'detail', 'masterId')
        })
      })
      .select({columns: [
        op.as({column: 'MasterName', expression: op.schemaCol({schema: 'opticFunctionalTest', view: 'master', column: 'name'})}),
        op.schemaCol('opticFunctionalTest', 'master', 'date'),
        op.as('DetailName', op.schemaCol('opticFunctionalTest', 'detail', 'name')),
        op.schemaCol({schema: 'opticFunctionalTest', view: 'detail', column: 'amount'}),
        op.schemaCol('opticFunctionalTest', 'detail', 'color')
      ]})
      .orderBy({keys: [op.desc({column: op.col({column: 'DetailName'})})]})
    db.rows.query(output, { format: 'json', structure: 'object', columnTypes: 'header' })
    .then(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.columns[1].type).to.equal('xs:date');
      expect(output.rows.length).to.equal(6);
      expect(output.rows[0].MasterName).to.equal('Master 2');
      expect(output.rows[0].DetailName).to.equal('Detail 6');
      expect(output.rows[5].MasterName).to.equal('Master 1');
      expect(output.rows[5].DetailName).to.equal('Detail 1');
      done();
    }, done);
  });

  it('TEST 36 - with named parameters multiple on', function(done){
    const plan1 =
      op.fromView('opticFunctionalTest', 'detail', 'myDetail');
    const plan2 =
      op.fromView('opticFunctionalTest', 'master', 'myMaster');
    const masterIdCol1 = plan1.col({column: 'masterId'});
    const masterIdCol2 = plan2.col('id');
    const idCol1 = plan2.col('id');
    const idCol2 = plan1.col({column: 'id'});
    const detailNameCol = plan1.col({column: 'name'});
    const masterNameCol = plan2.col('name');
    const output =
      plan1.joinInner({
        right: plan2,
        keys: [op.on(masterIdCol1, masterIdCol2), op.on(idCol1, idCol2)]
      })
      .orderBy({keys: [op.desc({column: detailNameCol})]})
      .offsetLimit({start: 1, length: 100})
    db.rows.query(output, { format: 'json', structure: 'object', columnTypes: 'header' })
    .then(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.rows.length).to.equal(1);
      expect(output.rows[0]['myMaster.id']).to.equal(1);
      expect(output.rows[0]['myMaster.name']).to.equal('Master 1');
      expect(output.rows[0]['myDetail.id']).to.equal(1);
      expect(output.rows[0]['myDetail.name']).to.equal('Detail 1');
      expect(output.rows[0]['myDetail.masterId']).to.equal(1);
      done();
    }, done);
  });

  it('TEST 37 - with timestamp', function(done){
    const timestamp = db.createTimestamp();
    const plan1 =
      op.fromView('opticFunctionalTest', 'detail', 'myDetail');
    const plan2 =
      op.fromView('opticFunctionalTest', 'master', 'myMaster');
    const masterIdCol1 = plan1.col({column: 'masterId'});
    const masterIdCol2 = plan2.col('id');
    const idCol1 = plan2.col('id');
    const idCol2 = plan1.col({column: 'id'});
    const detailNameCol = plan1.col({column: 'name'});
    const masterNameCol = plan2.col('name');
    const output =
      plan1.joinInner({
        right: plan2,
        keys: [op.on(masterIdCol1, masterIdCol2), op.on(idCol1, idCol2)]
      })
      .orderBy({keys: [op.desc({column: detailNameCol})]})
      .offsetLimit({start: 1, length: 100})
    db.rows.query(output, { format: 'json', structure: 'object', columnTypes: 'header', timestamp: timestamp })
    .then(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.rows.length).to.equal(1);
      expect(output.rows[0]['myMaster.id']).to.equal(1);
      expect(output.rows[0]['myMaster.name']).to.equal('Master 1');
      expect(output.rows[0]['myDetail.id']).to.equal(1);
      expect(output.rows[0]['myDetail.name']).to.equal('Detail 1');
      expect(output.rows[0]['myDetail.masterId']).to.equal(1);
      done();
    }, done);
  });

  it('TEST 38 - with old timestamp', function(done){
    const timestamp = db.createTimestamp();
    const plan1 =
      op.fromView('opticFunctionalTest', 'detail', 'myDetail');
    const plan2 =
      op.fromView('opticFunctionalTest', 'master', 'myMaster');
    const masterIdCol1 = plan1.col({column: 'masterId'});
    const masterIdCol2 = plan2.col('id');
    const idCol1 = plan2.col('id');
    const idCol2 = plan1.col({column: 'id'});
    const detailNameCol = plan1.col({column: 'name'});
    const masterNameCol = plan2.col('name');
    const output =
      plan1.joinInner({
        right: plan2,
        keys: [op.on(masterIdCol1, masterIdCol2), op.on(idCol1, idCol2)]
      })
      .orderBy({keys: [op.desc({column: detailNameCol})]})
      .offsetLimit({start: 1, length: 100})
    db.rows.query(output, { format: 'json', structure: 'object', columnTypes: 'header', timestamp: oldTimestamp })
    .then(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output).to.be.undefined;
      done();
    }, function(error) {
      //console.log(error);
      expect(error.body.errorResponse.message).to.contain('XDMP-OLDSTAMP: Timestamp too old');
      done();
    });
  });
});
