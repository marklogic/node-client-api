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

describe('Nodejs Optic from sql test', function(){

  it('TEST 1 - join inner with keymatch - with format json, structure object, columnTypes header', function(done){
    const plan1 =
      op.fromSQL("SELECT * from opticFunctionalTest.detail");
    const plan2 =
      op.fromSQL("SELECT * from opticFunctionalTest.master");
    const output =
      plan1.joinInner(plan2)
      .where(
        op.eq(
          op.schemaCol('opticFunctionalTest', 'master' , 'id'),
          op.schemaCol('opticFunctionalTest', 'detail', 'masterId')
        )
      )
      .orderBy(op.asc(op.schemaCol('opticFunctionalTest', 'detail', 'id')))
    db.rows.query(output, { format: 'json', structure: 'object', columnTypes: 'header' })
    .then(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.columns[5].type).to.equal('xs:date');
      expect(output.rows.length).to.equal(6);
      expect(output.rows[0]['opticFunctionalTest.detail.id']).to.equal(1);
      expect(output.rows[0]['opticFunctionalTest.master.id']).to.equal(1);
      expect(output.rows[0]['opticFunctionalTest.detail.masterId']).to.equal(1);
      expect(output.rows[0]['opticFunctionalTest.detail.name']).to.equal('Detail 1');
      expect(output.rows[5]['opticFunctionalTest.detail.id']).to.equal(6);
      expect(output.rows[5]['opticFunctionalTest.master.id']).to.equal(2);
      expect(output.rows[5]['opticFunctionalTest.detail.masterId']).to.equal(2);
      expect(output.rows[5]['opticFunctionalTest.detail.name']).to.equal('Detail 6');
      done();
    }, done);
  });

  it('TEST 2 - join inner with keymatch and select - with format json, structure object, columnTypes rows', function(done){
    const output =
      op.fromSQL("SELECT opticFunctionalTest.master.name AS MasterName, opticFunctionalTest.master.date, opticFunctionalTest.detail.name AS DetailName, opticFunctionalTest.detail.amount,  opticFunctionalTest.detail.color" +
        " FROM opticFunctionalTest.detail" +
        " INNER JOIN opticFunctionalTest.master ON opticFunctionalTest.master.id = opticFunctionalTest.detail.masterId" +
        " ORDER BY DetailName DESC")
    db.rows.query(output, { format: 'json', structure: 'object', columnTypes: 'rows' })
    .then(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.rows.length).to.equal(6);
      expect(output.rows[0].MasterName.value).to.equal('Master 2');
      expect(output.rows[0].DetailName.value).to.equal('Detail 6');
      expect(output.rows[0]['opticFunctionalTest.detail.amount'].value).to.equal(60.06);
      expect(output.rows[0]['opticFunctionalTest.detail.amount'].type).to.equal('xs:double');
      expect(output.rows[5].MasterName.value).to.equal('Master 1');
      expect(output.rows[5].DetailName.value).to.equal('Detail 1');
      expect(output.rows[5]['opticFunctionalTest.detail.color'].value).to.equal('blue');
      expect(output.rows[5]['opticFunctionalTest.detail.color'].type).to.equal('xs:string');
      done();
    }, done);
  });

  it('TEST 3 - group by - with structure array', function(done){
    const plan1 =
      op.fromSQL("SELECT * from opticFunctionalTest.detail");
    const plan2 =
      op.fromSQL("SELECT * from opticFunctionalTest.master");
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
    db.rows.query(output, { format: 'json', structure: 'array', columnTypes: 'header' })
    .then(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(3);
      expect(output[1][0]).to.equal('Master 2');
      expect(output[1][1]).to.equal(120.12);
      expect(output[2][0]).to.equal('Master 1');
      expect(output[2][1]).to.equal(90.09);
      done();
    }, done);
  });

  it('TEST 4 - sql group by - format xml', function(done){
    const output =
      op.fromSQL("SELECT opticFunctionalTest.master.name, opticFunctionalTest.detail.name AS DetailName, opticFunctionalTest.detail.color, SUM(amount) AS DetailSum \
        FROM opticFunctionalTest.detail \
        INNER JOIN opticFunctionalTest.master ON opticFunctionalTest.master.id = opticFunctionalTest.detail.masterId \
        GROUP BY opticFunctionalTest.master.name")
      .orderBy(op.desc(op.col('DetailSum')))
    db.rows.query(output, { format: 'xml', structure: 'array', columnTypes: 'header' })
    .then(function(output) {
      //console.log(output);
      const outputStr = output.toString().trim().replace(/[\n\r]/g, '');
      //console.log(outputStr);
      expect(outputStr).to.contain('<t:cell name="DetailSum">90.09</t:cell>');
      expect(outputStr).to.contain('<t:cell name="DetailSum">120.12</t:cell>');
      done();
    }, done);
  });

  it('TEST 5 - join left outer with select - format csv', function(done){
    const output =
      op.fromSQL("SELECT * FROM opticFunctionalTest.detail LEFT JOIN opticFunctionalTest.master")
      .select([
          op.as('MasterName', op.schemaCol('opticFunctionalTest', 'master', 'name')),
          op.schemaCol('opticFunctionalTest', 'master', 'date'),
          op.as('DetailName', op.schemaCol('opticFunctionalTest', 'detail', 'name')),
          op.schemaCol('opticFunctionalTest', 'detail', 'amount'),
          op.schemaCol('opticFunctionalTest', 'detail', 'color')
        ])
      .orderBy([op.desc(op.col('DetailName')), op.desc(op.col('MasterName'))])
    db.rows.query(output, { format: 'csv', structure: 'array', columnTypes: 'rows' })
    .then(function(output) {
      //console.log(output);
      expect(output).to.contain('["MasterName", "opticFunctionalTest.master.date", "DetailName", "opticFunctionalTest.detail.amount", "opticFunctionalTest.detail.color"]');
      expect(output).to.contain('["Master 2", "2015-12-02", "Detail 6", 60.06, "green"]');
      expect(output).to.contain('["Master 1", "2015-12-01", "Detail 1", 10.01, "blue"]');
      done();
    }, done);
  });

  it('TEST 6 - union with select - queryAsStream object', function(done){
    let count = 0;
    let str = '';
    const chunks = [];
    const output =
      op.fromSQL("SELECT opticFunctionalTest.detail.id, opticFunctionalTest.detail.name FROM opticFunctionalTest.detail ORDER BY name \
        UNION \
        SELECT opticFunctionalTest.master.id, opticFunctionalTest.master.name FROM opticFunctionalTest.master ORDER BY name")
      .orderBy('id')
    db.rows.queryAsStream(output, 'object', { format: 'json', structure: 'object', columnTypes: 'header', complexValues: 'reference' })
    .on('data', function(chunk) {
      chunks.push(chunk.kind.toString());
      count++;
    }).
    on('end', function() {
      //console.log(count);
      //console.log(chunks.join(''));
      expect(chunks.join(' ')).to.equal('columns row row row row row row row row');
      expect(count).to.equal(9);
      done();
    }, done);
  });

  it('TEST 7 - join cross product - queryAsStream sequence', function(done){
    var count = 0;
    var str = '';
    const chunks = [];
    const output =
      op.fromSQL("SELECT opticFunctionalTest.master.name, opticFunctionalTest.master.date, opticFunctionalTest.detail.name, opticFunctionalTest.detail.amount, opticFunctionalTest.detail.color FROM opticFunctionalTest.detail \
        CROSS JOIN opticFunctionalTest.master \
        ORDER BY opticFunctionalTest.detail.name DESC, opticFunctionalTest.master.name ASC")
      .select([
        op.as('MasterName', op.schemaCol('opticFunctionalTest', 'master', 'name')),
        op.schemaCol('opticFunctionalTest', 'master', 'date'),
        op.as('DetailName', op.schemaCol('opticFunctionalTest', 'detail', 'name')),
        op.schemaCol('opticFunctionalTest', 'detail', 'amount'),
        op.schemaCol('opticFunctionalTest', 'detail', 'color')
      ])
    db.rows.queryAsStream(output, 'sequence', { format: 'json', structure: 'object', columnTypes: 'header' })
    .on('data', function(chunk) {
      //console.log(chunk.toString());
      str = str + chunk.toString().trim().replace(/[\n\r]/g, ' ');
      count++;
    }).
    on('end', function() {
      //console.log(str);
      //console.log(count);
      expect(str).to.equal('\u001e{"columns":[{"name":"MasterName","type":"xs:string"},{"name":"opticFunctionalTest.master.date","type":"xs:date"},{"name":"DetailName","type":"xs:string"},{"name":"opticFunctionalTest.detail.amount","type":"xs:double"},{"name":"opticFunctionalTest.detail.color","type":"xs:string"}]}\u001e{"MasterName":"Master 1","opticFunctionalTest.master.date":"2015-12-01","DetailName":"Detail 6","opticFunctionalTest.detail.amount":60.06,"opticFunctionalTest.detail.color":"green"}\u001e{"MasterName":"Master 2","opticFunctionalTest.master.date":"2015-12-02","DetailName":"Detail 6","opticFunctionalTest.detail.amount":60.06,"opticFunctionalTest.detail.color":"green"}\u001e{"MasterName":"Master 1","opticFunctionalTest.master.date":"2015-12-01","DetailName":"Detail 5","opticFunctionalTest.detail.amount":50.05,"opticFunctionalTest.detail.color":"green"}\u001e{"MasterName":"Master 2","opticFunctionalTest.master.date":"2015-12-02","DetailName":"Detail 5","opticFunctionalTest.detail.amount":50.05,"opticFunctionalTest.detail.color":"green"}\u001e{"MasterName":"Master 1","opticFunctionalTest.master.date":"2015-12-01","DetailName":"Detail 4","opticFunctionalTest.detail.amount":40.04,"opticFunctionalTest.detail.color":"green"}\u001e{"MasterName":"Master 2","opticFunctionalTest.master.date":"2015-12-02","DetailName":"Detail 4","opticFunctionalTest.detail.amount":40.04,"opticFunctionalTest.detail.color":"green"}\u001e{"MasterName":"Master 1","opticFunctionalTest.master.date":"2015-12-01","DetailName":"Detail 3","opticFunctionalTest.detail.amount":30.03,"opticFunctionalTest.detail.color":"blue"}\u001e{"MasterName":"Master 2","opticFunctionalTest.master.date":"2015-12-02","DetailName":"Detail 3","opticFunctionalTest.detail.amount":30.03,"opticFunctionalTest.detail.color":"blue"}\u001e{"MasterName":"Master 1","opticFunctionalTest.master.date":"2015-12-01","DetailName":"Detail 2","opticFunctionalTest.detail.amount":20.02,"opticFunctionalTest.detail.color":"blue"}\u001e{"MasterName":"Master 2","opticFunctionalTest.master.date":"2015-12-02","DetailName":"Detail 2","opticFunctionalTest.detail.amount":20.02,"opticFunctionalTest.detail.color":"blue"}\u001e{"MasterName":"Master 1","opticFunctionalTest.master.date":"2015-12-01","DetailName":"Detail 1","opticFunctionalTest.detail.amount":10.01,"opticFunctionalTest.detail.color":"blue"}\u001e{"MasterName":"Master 2","opticFunctionalTest.master.date":"2015-12-02","DetailName":"Detail 1","opticFunctionalTest.detail.amount":10.01,"opticFunctionalTest.detail.color":"blue"}');
      expect(count).to.equal(13);
      done();
    }, done);
  });

  it('TEST 8 - select with empty string qualifier and as - with queryAsStream chunked', function(done){
    var count = 0;
    var str = '';
    const chunks = [];
    const output =
      op.fromSQL("SELECT * FROM opticFunctionalTest.detail INNER JOIN opticFunctionalTest.master WHERE opticFunctionalTest.detail.masterId = opticFunctionalTest.master.id")
      .select([op.schemaCol('opticFunctionalTest', 'detail', 'id'),
               op.schemaCol('opticFunctionalTest', 'detail', 'color'),
               op.as('masterName', op.schemaCol('opticFunctionalTest', 'master', 'name'))],
               '')
      .orderBy('id')
    db.rows.queryAsStream(output, 'chunked', { format: 'json', structure: 'object', columnTypes: 'header' })
    .on('data', function(chunk) {
      //console.log(chunk.toString());
      str = str + chunk.toString().trim().replace(/[\n\r]/g, ' ');
      count++;
    }).
    on('end', function() {
      //console.log(str);
      //console.log(count);
      expect(str).to.equal('{ "columns": [{"name":"id","type":"xs:integer"},{"name":"color","type":"xs:string"},{"name":"masterName","type":"xs:string"}], "rows":[ {"id":1,"color":"blue","masterName":"Master 1"}, {"id":2,"color":"blue","masterName":"Master 2"}, {"id":3,"color":"blue","masterName":"Master 1"}, {"id":4,"color":"green","masterName":"Master 2"}, {"id":5,"color":"green","masterName":"Master 1"}, {"id":6,"color":"green","masterName":"Master 2"}] }');
      expect(count).to.equal(1);
      done();
    }, done);
  });

  it('TEST 9 - inner join with multiple on', function(done){
    const output =
      op.fromSQL("SELECT * FROM opticFunctionalTest.detail INNER JOIN opticFunctionalTest.master WHERE (opticFunctionalTest.detail.masterId = opticFunctionalTest.master.id AND opticFunctionalTest.master.id = opticFunctionalTest.detail.id)")
      .orderBy(op.desc(op.viewCol('detail', 'name')))
      .offsetLimit(1, 100)
      .export();
    const outputStr = JSON.stringify(output).trim().replace(/[\n\r]/g, '');
    //console.log(outputStr);
    expect(outputStr).to.equal('{"$optic":{"ns":"op","fn":"operators","args":[{"ns":"op","fn":"from-sql","args":["SELECT * FROM opticFunctionalTest.detail INNER JOIN opticFunctionalTest.master WHERE (opticFunctionalTest.detail.masterId = opticFunctionalTest.master.id AND opticFunctionalTest.master.id = opticFunctionalTest.detail.id)"]},{"ns":"op","fn":"order-by","args":[{"ns":"op","fn":"desc","args":[{"ns":"op","fn":"view-col","args":["detail","name"]}]}]},{"ns":"op","fn":"offset-limit","args":[1,100]}]}}');
    db.rows.query(output, { format: 'json', structure: 'object', columnTypes: 'header' })
    .then(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.rows.length).to.equal(1);
      expect(output.rows[0]['opticFunctionalTest.master.id']).to.equal(1);
      expect(output.rows[0]['opticFunctionalTest.master.name']).to.equal('Master 1');
      expect(output.rows[0]['opticFunctionalTest.detail.id']).to.equal(1);
      expect(output.rows[0]['opticFunctionalTest.detail.name']).to.equal('Detail 1');
      expect(output.rows[0]['opticFunctionalTest.detail.masterId']).to.equal(1);
      done();
    }, done);
  });

  it('TEST 10 - arithmetic operations with sql condition', function(done){
    const output =
      op.fromSQL("SELECT (opticFunctionalTest.detail.amount + opticFunctionalTest.detail.masterId) AS added, \
        (opticFunctionalTest.detail.amount - opticFunctionalTest.master.id) AS substracted, \
        (opticFunctionalTest.detail.amount % opticFunctionalTest.master.id) AS modulo, \
        (opticFunctionalTest.detail.amount / (opticFunctionalTest.detail.amount * opticFunctionalTest.detail.id)) AS divided \
        FROM opticFunctionalTest.detail INNER JOIN opticFunctionalTest.master WHERE opticFunctionalTest.detail.masterId = opticFunctionalTest.master.id")
      .where(op.sqlCondition("divided >= 0.3"))
      .orderBy(op.asc('substracted'))
    db.rows.query(output, { format: 'json', structure: 'object', columnTypes: 'header' })
    .then(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.rows.length).to.equal(3);
      expect(output.rows[0].divided).to.equal(1);
      expect(output.rows[2].divided).to.equal(0.333333333333333);
      done();
    }, done);
  });

  it('TEST 11 - sql like', function(done){
    const output =
      op.fromSQL("SELECT * FROM opticFunctionalTest.detail \
                 INNER JOIN opticFunctionalTest.master \
                 WHERE (opticFunctionalTest.detail.masterId = opticFunctionalTest.master.id AND opticFunctionalTest.detail.color LIKE 'b%')")
      .select([op.schemaCol('opticFunctionalTest', 'detail', 'id'),
               op.schemaCol('opticFunctionalTest', 'detail', 'color'),
               op.as('masterName', op.schemaCol('opticFunctionalTest', 'master', 'name'))],
        '')
      .orderBy('id')
    db.rows.query(output, { format: 'json', structure: 'object', columnTypes: 'header' })
    .then(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.rows.length).to.equal(3);
      expect(output.rows[0].color).to.equal('blue');
      expect(output.rows[1].color).to.equal('blue');
      expect(output.rows[2].color).to.equal('blue');
      done();
    }, done);
  });

  it('TEST 12 - with named params', function(done){
    const output =
      op.fromSQL({select: "SELECT (opticFunctionalTest.detail.amount + opticFunctionalTest.detail.masterId) AS added, \
        (opticFunctionalTest.detail.amount - opticFunctionalTest.master.id) AS substracted, \
        (opticFunctionalTest.detail.amount % opticFunctionalTest.master.id) AS modulo, \
        (opticFunctionalTest.detail.amount / (opticFunctionalTest.detail.amount * opticFunctionalTest.detail.id)) AS divided \
        FROM opticFunctionalTest.detail INNER JOIN opticFunctionalTest.master WHERE opticFunctionalTest.detail.masterId = opticFunctionalTest.master.id", qualifierName: 'mySQL'})
      .where({condition: op.sqlCondition({expression: "divided >= 0.3"})})
      .orderBy({keys: op.asc({column: 'substracted'})})
    db.rows.query(output, { format: 'json', structure: 'object', columnTypes: 'header' })
    .then(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.rows.length).to.equal(3);
      expect(output.rows[0]['mySQL.divided']).to.equal(1);
      expect(output.rows[2]['mySQL.divided']).to.equal(0.333333333333333);
      done();
    }, done);
  });

});
