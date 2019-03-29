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

describe('Nodejs Optic from literals test', function(){

  it('TEST 1 - join inner and check types', function(done){
    const plan1 =
      op.fromLiterals([
        {rowId: 1, colorId: 1, desc: 'ball', date: op.xs.date('2013-08-15'), duration: op.xs.yearMonthDuration('P3Y3M')},
        {rowId: 2, colorId: 2, desc: 'square', date: op.xs.date('2013-08-15'), duration: op.xs.yearMonthDuration('P3Y3M')},
        {rowId: 3, colorId: 1, desc: 'box', date: op.xs.date('2013-08-15'), duration: op.xs.yearMonthDuration('P3Y3M')},
        {rowId: 4, colorId: 1, desc: 'hoop', date: op.xs.date('2013-08-15'), duration: op.xs.yearMonthDuration('P3Y3M')},
        {rowId: 5, colorId: 5, desc: 'circle', date: op.xs.date('2013-08-15'), duration: op.xs.yearMonthDuration('P3Y3M')}
      ]);
    const plan2 =
      op.fromLiterals([
        {colorId: 1, colorDesc: 'red', dateTime: op.xs.dateTime('2000-01-11T12:01:00.000Z')},
        {colorId: 2, colorDesc: 'blue', dateTime: op.xs.dateTime('2001-01-11T12:01:00.000Z')},
        {colorId: 3, colorDesc: 'black', dateTime: op.xs.dateTime('2002-01-11T12:01:00.000Z')},
        {colorId: 4, colorDesc: 'yellow', dateTime: op.xs.dateTime('2003-01-11T12:01:00.000Z')}
      ]);
    const output =
      plan1.joinInner(plan2)
    db.rows.query(output, { format: 'json', structure: 'object', columnTypes: 'header' })
    .then(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.columns[3].name).to.equal('date');
      expect(output.columns[3].type).to.equal('xs:date');
      expect(output.columns[4].name).to.equal('dateTime');
      expect(output.columns[4].type).to.equal('xs:dateTime');
      expect(output.columns[5].name).to.equal('duration');
      expect(output.columns[5].type).to.equal('xs:yearMonthDuration');
      expect(output.rows.length).to.equal(4);
      expect(output.rows[0].rowId).to.equal(1);
      expect(output.rows[0].desc).to.equal('ball');
      expect(output.rows[0].colorDesc).to.equal('red');
      expect(output.rows[3].rowId).to.equal(4);
      expect(output.rows[3].desc).to.equal('hoop');
      expect(output.rows[3].colorDesc).to.equal('red');
      done();
    }, done);
  });

  it('TEST 2 - join inner doc on json and xml documents', function(done){
    const output =
      op.fromLiterals([
        {id:1, val: 2, uri:'/optic/lexicon/test/doc1.json'},
        {id:2, val: 4, uri:'/optic/test/not/a/real/doc.nada'},
        {id:3, val: 6, uri:'/optic/lexicon/test/doc3.json'},
        {id:4, val: 8, uri:'/optic/lexicon/test/doc4.xml'}
      ])
      .joinDoc(op.col('doc'), op.col('uri'))
      .orderBy(op.asc('id'))
    db.rows.query(output, { format: 'json', structure: 'object', columnTypes: 'header' })
    .then(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.rows.length).to.equal(3);
      expect(output.rows[0].id).to.equal(1);
      expect(output.rows[0].doc.city).to.equal('london');
      expect(output.rows[1].id).to.equal(3);
      expect(output.rows[1].doc.city).to.equal('new jersey');
      expect(output.rows[2].id).to.equal(4);
      expect(output.rows[2].doc).to.contain('beijing');
      done();
    }, done);
  });

  it('TEST 3 - where limit and select', function(done){
    const plan1 =
      op.fromLiterals([
        {rowId: 1, colorId: 1, desc: 'ball'},
        {rowId: 2, colorId: 2, desc: 'square'},
        {rowId: 3, colorId: 1, desc: 'box'},
        {rowId: 4, colorId: 1, desc: 'hoop'},
        {rowId: 5, colorId: 5, desc: 'circle'}
      ]);
    const plan2 =
      op.fromLiterals([
        {colorId: 1, colorDesc: 'red'},
        {colorId: 2, colorDesc: 'blue'},
        {colorId: 3, colorDesc: 'black'},
        {colorId: 4, colorDesc: 'yellow'}
      ]);
    const output =
      plan1.joinInner(plan2)
      .where(op.eq(op.col('colorId'), 1))
      .offsetLimit(1, 3)
    db.rows.query(output, { format: 'json', structure: 'array', columnTypes: 'header' })
    .then(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(3);
      expect(output[1][3]).to.equal(3);
      expect(output[1][0]).to.equal('box');
      expect(output[2][3]).to.equal(4);
      expect(output[2][0]).to.equal('hoop');
      done();
    }, done);
  });

  it('TEST 4 - join inner doc with xpath accessing attribute on xml', function(done){
    let count = 0;
    let str = '';
    const chunks = [];
    const output =
      op.fromLiterals([
        {id:1, val: 2, uri:'/optic/lexicon/test/doc1.json'},
        {id:2, val: 4, uri:'/optic/test/not/a/real/doc.nada'},
        {id:3, val: 6, uri:'/optic/lexicon/test/doc3.json'},
        {id:4, val: 8, uri:'/optic/lexicon/test/doc4.xml'}
      ])
      .orderBy(op.asc('id'))
      .joinDoc(op.col('doc'), op.col('uri'))
      .select(['id', 'val', 'uri', op.as('nodes', op.xpath('doc', '/doc/distance/@direction'))])
      .where(op.isDefined(op.col('nodes')))
    db.rows.queryAsStream(output)
    .on('data', function(chunk) {
      //console.log(chunk.toString());
      str = str + chunk.toString().trim().replace(/[\n\r]/g, ' ');
      count++;
    }).
    on('end', function() {
      //console.log(str);
      //console.log(count);
      expect(str).to.equal('{ "columns": [{"name":"id"},{"name":"val"},{"name":"uri"},{"name":"nodes"}], "rows":[ {"id":{"type":"xs:integer","value":4},"val":{"type":"xs:integer","value":8},"uri":{"type":"xs:string","value":"/optic/lexicon/test/doc4.xml"},"nodes":{"type":"attribute","value":"east"}}] }');
      expect(count).to.equal(1);
      done();
    }, done);
  });

  it('TEST 5 - multple inner joins', function(done){
    let count = 0;
    let str = '';
    const chunks = [];
    const plan1 =
      op.fromLiterals([
        {rowId: 1, colorId: 1, desc: 'ball'},
        {rowId: 2, colorId: 2, desc: 'square'},
        {rowId: 3, colorId: 1, desc: 'box'},
        {rowId: 4, colorId: 1, desc: 'hoop'},
        {rowId: 5, colorId: 5, desc: 'circle'}
      ], 'myItem');
    const plan2 =
      op.fromLiterals([
        {colorId: 1, colorDesc: 'red'},
        {colorId: 2, colorDesc: 'blue'},
        {colorId: 3, colorDesc: 'black'},
        {colorId: 4, colorDesc: 'yellow'}
      ], 'myColor');
    const plan3 =
      op.fromLiterals([
        {color: 'red', ref: 'rose'},
        {color: 'blue', ref: 'water'},
        {color: 'black', ref: 'bag'},
        {color: 'yellow', ref: 'moon'}
      ], 'myRef');
    const descCol = plan1.col('desc');
    const itemColorIdCol = plan1.col('colorId');
    const colorIdCol = plan2.col('colorId');
    const colorDescCol = plan2.col('colorDesc');
    const refColorCol = plan3.col('color');
    const refCol = plan3.col('ref');
    const output =
      plan1.joinInner(plan2, [op.on(itemColorIdCol, colorIdCol)])
      .joinInner(plan3, op.on(colorDescCol, refColorCol))
      .select([descCol, colorIdCol, refCol])
      .orderBy([colorIdCol, descCol])
    db.rows.queryAsStream(output, 'sequence', { format: 'json', structure: 'object', columnTypes: 'header' })
    .on('data', function(chunk) {
      //console.log(chunk.toString());
      str = str + chunk.toString().trim().replace(/[\n\r]/g, ' ');
      count++;
    }).
    on('end', function() {
      //console.log(str);
      //console.log(count);
      expect(str).to.equal('\u001e{"columns":[{"name":"myItem.desc","type":"xs:string"},{"name":"myColor.colorId","type":"xs:integer"},{"name":"myRef.ref","type":"xs:string"}]}\u001e{"myItem.desc":"ball","myColor.colorId":1,"myRef.ref":"rose"}\u001e{"myItem.desc":"box","myColor.colorId":1,"myRef.ref":"rose"}\u001e{"myItem.desc":"hoop","myColor.colorId":1,"myRef.ref":"rose"}\u001e{"myItem.desc":"square","myColor.colorId":2,"myRef.ref":"water"}');
      expect(count).to.equal(5);
      done();
    }, done);
  });

  it('TEST 6 - sql condition with in and AND', function(done){
    let count = 0;
    let str = '';
    const chunks = [];
    const plan1 =
      op.fromLiterals([
        {rowId: 1, colorId: 1, desc: 'ball'},
        {rowId: 2, colorId: 2, desc: 'square'},
        {rowId: 3, colorId: 1, desc: 'box'},
        {rowId: 4, colorId: 1, desc: 'hoop'},
        {rowId: 5, colorId: 5, desc: 'circle'}
      ], 'table1');
    const plan2 =
      op.fromLiterals([
        {colorId: 1, colorDesc: 'red'},
        {colorId: 2, colorDesc: 'blue'},
        {colorId: 3, colorDesc: 'black'},
        {colorId: 4, colorDesc: 'yellow'}
      ], 'table2');
    const output =
      plan1.joinInner(plan2)
      .where(op.sqlCondition("(table1.colorId = table2.colorId) AND table1.desc IN ('ball', 'box')"))
      .orderBy(op.desc(op.viewCol('table1', 'rowId')))
    db.rows.queryAsStream(output, 'chunked', { format: 'csv', columnTypes: 'header' })
    .on('data', function(chunk) {
      //console.log(chunk.toString());
      str = str + chunk.toString().trim().replace(/[\n\r]/g, ' ');
      count++;
    }).
    on('end', function() {
      //console.log(str);
      //console.log(count);
      expect(str).to.equal('table1.desc,table2.colorId,table1.colorId,table2.colorDesc,table1.rowId  box,1,1,red,3  ball,1,1,red,1');
      expect(count).to.equal(1);
      done();
    }, done);
  });

  it('TEST 7 - with mapper', function(done){
    const plan1 =
      op.fromLiterals([
        {rowId: 1, colorId_shape: 1, desc: 'ball'},
        {rowId: 2, colorId_shape: 2, desc: 'square'},
        {rowId: 3, colorId_shape: 1, desc: 'box'},
        {rowId: 4, colorId_shape: 1, desc: 'hoop'},
        {rowId: 5, colorId_shape: 5, desc: 'circle'}
      ]);

    const plan2 =
      op.fromLiterals([
        {colorId: 1, colorDesc: 'red'},
        {colorId: 2, colorDesc: 'blue'},
        {colorId: 3, colorDesc: 'black'},
        {colorId: 4, colorDesc: 'yellow'}
      ]);
    const output =
      plan1.joinInner(
        plan2, op.on(op.col('colorId_shape'), op.col('colorId'))
      )
      .select([
        'rowId',
        op.as('description', op.col('desc')),
        op.as('myColorId', op.col('colorId')),
        'colorDesc'
      ])
      .orderBy(op.asc('rowId'))
      .map(op.resolveFunction('colorIdMapper', '/optic/test/mapperReducer.sjs'))
    db.rows.query(output, { format: 'json', structure: 'object', columnTypes: 'header' })
    .then(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.rows.length).to.equal(4);
      expect(output.rows[0].rowId).to.equal(1);
      expect(output.rows[0].myColorId).to.equal('RED');
      expect(output.rows[1].rowId).to.equal(2);
      expect(output.rows[1].myColorId).to.equal('BLUE');
      done();
    }, done);
  });

  it('TEST 8 - with reducer', function(done){
      const plan1 =
        op.fromLiterals([
          {rowId: 1, colorId_shape: 1, desc: 'ball'},
          {rowId: 2, colorId_shape: 2, desc: 'square'},
          {rowId: 3, colorId_shape: 1, desc: 'box'},
          {rowId: 4, colorId_shape: 1, desc: 'hoop'},
          {rowId: 5, colorId_shape: 5, desc: 'circle'}
        ]);

      const plan2 =
        op.fromLiterals([
          {colorId: 1, colorDesc: 'red'},
          {colorId: 2, colorDesc: 'blue'},
          {colorId: 3, colorDesc: 'black'},
          {colorId: 4, colorDesc: 'yellow'}
        ]);
      const output =
        plan1.joinInner(
          plan2, op.on(op.col('colorId_shape'), op.col('colorId'))
        )
        .select([
          op.as('myRowId', op.col('rowId'))
        ])
        .orderBy(op.asc('myRowId'))
      .reduce(op.resolveFunction('fibReducer', '/optic/test/mapperReducer.sjs'))
    db.rows.query(output, { format: 'json', structure: 'object', columnTypes: 'header' })
    .then(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.rows.length).to.equal(4);
      expect(output.rows[0].myRowId).to.equal(1);
      expect(output.rows[0].i).to.equal(0);
      expect(output.rows[0].fib).to.equal(0);
      expect(output.rows[3].myRowId).to.equal(4);
      expect(output.rows[3].i).to.equal(3);
      expect(output.rows[3].fib).to.equal(2);
      done();
    }, done);
  });
});
