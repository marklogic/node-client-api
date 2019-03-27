/*
 * Copyright 2014-2019 MarkLogic Corporation
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

const expect = require('chai').expect;


const fs     = require('fs');

const marklogic = require('../');

const connectdef = require('../config-optic/connectdef.js');

const db = marklogic.createDatabaseClient(connectdef.plan);
const op = marklogic.planBuilder;

describe('Nodejs Optic nodes json constructor test', function(){

  it('TEST 1 - construct json from literals', function(done){
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

    const output =
      plan1.joinInner(plan2, op.on(op.viewCol('myItem', 'colorId'), op.viewCol('myColor', 'colorId')))
      .select([
        'rowId',
        op.as('myJSON', op.jsonDocument(op.jsonObject([
          op.prop('str', op.jsonString(op.col('desc'))),
          op.prop('strFunc', op.jsonString(op.fn.stringToCodepoints(op.col('desc')))),
          op.prop('mathFunc', op.jsonNumber(op.math.sqrt(op.col('rowId')))),
          op.prop('upper', op.jsonString(op.fn.upperCase(op.viewCol('myItem', 'desc')))),
          op.prop('num', op.jsonNumber(op.col('rowId'))),
          op.prop('bool', op.jsonBoolean(op.isDefined(op.col('rowId')))),
          op.prop('null', op.jsonNull()),
          op.prop('array', op.jsonArray([op.jsonString(op.col('desc')), op.jsonNumber(op.col('rowId'))]))
        ]))),
        op.as('node', op.jsonString(op.col('desc'))),
        op.as('kind', op.xdmp.nodeKind(op.col('node'))),
        op.as('xml',
          op.xmlDocument(
            op.xmlElement(
              'root',
              op.xmlAttribute('attrA', op.col('rowId')),
              [
                op.xmlElement('elemA', null, op.viewCol('myColor', 'colorDesc')),
                op.xmlComment(op.fn.concat('this is a comment for ', op.col('desc'))),
                op.xmlElement('elemB', null, op.col('desc'))
              ]
            )
          )
        )
      ])
      .orderBy('rowId')
    db.rows.query(output, { format: 'json', structure: 'object', columnTypes: 'header' })
    .then(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.columns[1].name).to.equal('myJSON');
      expect(output.columns[1].type).to.equal('object');
      expect(output.columns[2].name).to.equal('node');
      expect(output.columns[2].type).to.equal('text');
      expect(output.columns[4].name).to.equal('xml');
      expect(output.columns[4].type).to.equal('element');
      expect(output.rows.length).to.equal(4);
      expect(output.rows[0]['myItem.rowId']).to.equal(1);
      expect(output.rows[0].myJSON.str).to.equal('ball');
      expect(output.rows[0].myJSON.upper).to.equal('BALL');
      expect(output.rows[0].myJSON.num).to.equal(1);
      expect(output.rows[0].myJSON.bool).to.equal(true);
      expect(output.rows[0].myJSON.null).to.equal(null);
      expect(output.rows[0].myJSON.array.length).to.equal(2);
      expect(output.rows[0].myJSON.array[0]).to.equal('ball');
      expect(output.rows[0].kind).to.equal('text');
      expect(output.rows[1].myJSON.strFunc).to.equal('115 113 117 97 114 101');
      expect(output.rows[1].myJSON.mathFunc).to.equal(1.4142135623731);
      expect(output.rows[0].xml).to.equal('<root attrA="1"><elemA>red</elemA><!--this is a comment for ball--><elemB>ball</elemB></root>');
      expect(output.rows[3]['myItem.rowId']).to.equal(4);
      expect(output.rows[3].xml).to.equal('<root attrA="4"><elemA>red</elemA><!--this is a comment for hoop--><elemB>hoop</elemB></root>');
      done();
    }, done);
  });

  it('TEST 2 - construct json from views', function(done){
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
      .select([
        op.as('myJSON',
          op.jsonDocument(
            op.jsonObject([
              op.prop('object1',
                op.jsonObject([
                  op.prop('object2', op.jsonString(op.schemaCol('opticFunctionalTest2', 'detail', 'masterId'))),
                  op.prop('object3', op.jsonNumber(op.schemaCol('opticFunctionalTest', 'master', 'id')))
                ])
              ),
              op.prop('object4',
                op.jsonObject(
                  op.prop('object5',
                    op.jsonObject([
                      op.prop('object6', op.jsonNumber(op.schemaCol('opticFunctionalTest2', 'detail', 'id'))),
                      op.prop('array1', op.jsonArray([
                        op.jsonString(op.schemaCol('opticFunctionalTest2', 'detail', 'name')),
                        op.jsonString(op.schemaCol('opticFunctionalTest', 'master', 'date')),
                        op.jsonNumber(op.schemaCol('opticFunctionalTest2', 'detail', 'amount')),
                        op.jsonBoolean(op.isDefined(op.schemaCol('opticFunctionalTest2', 'detail', 'amount'))),
                        op.jsonObject(op.prop('object7', op.jsonObject(op.prop('object8', op.jsonString(op.schemaCol('opticFunctionalTest2', 'detail', 'color'))))))
                      ]))
                    ])
                  )
                )
              )
            ])
          )
        )
      ])
    db.rows.query(output, { format: 'json', structure: 'object', columnTypes: 'rows' })
    .then(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.rows.length).to.equal(3);
      expect(output.rows[0].myJSON.value.object1.object2).to.equal('1');
      expect(output.rows[0].myJSON.type).to.equal('object');
      expect(output.rows[0].myJSON.value.object1.object3).to.equal(1);
      expect(output.rows[0].myJSON.value.object4.object5.object6).to.equal(9);
      expect(output.rows[0].myJSON.value.object4.object5.array1[2]).to.equal(72.9);
      expect(output.rows[0].myJSON.value.object4.object5.array1[4].object7.object8).to.equal('yellow');
      done();
    }, done);
  });

  it('TEST 3 - construct xml from Triples', function(done){
    const bb = op.prefixer('http://marklogic.com/baseball/players/');
    const ageCol = op.col('age');
    const idCol = op.col('id');
    const nameCol = op.col('name');
    const posCol = op.col('position');
    const output =
      op.fromTriples([
        op.pattern(idCol, bb('age'), ageCol),
        op.pattern(idCol, bb('name'), nameCol),
        op.pattern(idCol, bb('position'), posCol)
      ])
      .where(
        op.and(
          op.le(ageCol, 25),
          op.eq(posCol, 'Catcher')
        )
      )
      .orderBy(op.desc(ageCol))
      .select([
        op.as('PlayerName', nameCol),
        op.as('PlayerPosition', posCol),
        op.as('PlayerAge', ageCol)
      ])
      .select([
        'PlayerName',
        'PlayerPosition',
        'PlayerAge',
        op.as('xml',
          op.xmlDocument(
            op.xmlElement(
              'root',
              op.xmlAttribute('attrA', op.col('PlayerName')),
              [
                op.xmlElement('elemA', null, op.col('PlayerPosition')),
      	        op.xmlElement('elemACodePoints', null, op.fn.stringToCodepoints(op.col('PlayerPosition'))),
	        op.xmlElement('elemB', null, op.col('PlayerAge')),
	        op.xmlElement('elemC', null, op.math.sqrt(op.col('PlayerAge')))
              ]
            )
          )
        )
      ])
    db.rows.query(output, { format: 'xml', structure: 'object', columnTypes: 'rows' })
    .then(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      //console.log(output);
      const outputStr = output.toString().trim().replace(/[\n\r]/g, '');
      //console.log(outputStr);
      expect(outputStr).to.equal('<t:table xmlns:t="http://marklogic.com/table"><t:columns><t:column name="PlayerName"/><t:column name="PlayerPosition"/><t:column name="PlayerAge"/><t:column name="xml"/></t:columns><t:rows><t:row><t:cell name="PlayerName" type="xs:string">Pat Crenshaw</t:cell><t:cell name="PlayerPosition" type="xs:string">Catcher</t:cell><t:cell name="PlayerAge" type="xs:integer">25</t:cell><t:cell name="xml" type="element"><root attrA="Pat Crenshaw"><elemA>Catcher</elemA><elemACodePoints>67 97 116 99 104 101 114</elemACodePoints><elemB>25</elemB><elemC>5</elemC></root></t:cell></t:row></t:rows></t:table>');
      done();
    }, done);
  });

  it('TEST 4 - construct json from lexicons', function(done){
    const plan1 =
      op.fromLexicons(
        {
          uri1: op.cts.uriReference(),
          city: op.cts.jsonPropertyReference('city'),
          popularity: op.cts.jsonPropertyReference('popularity'),
          date: op.cts.jsonPropertyReference('date'),
          distance: op.cts.jsonPropertyReference('distance'),
          point: op.cts.jsonPropertyReference('latLonPoint')
        }, 'myCity'
      );
    const plan2 =
      op.fromLexicons(
        {
          uri2: op.cts.uriReference(),
          cityName: op.cts.jsonPropertyReference('cityName'),
          cityTeam: op.cts.jsonPropertyReference('cityTeam')
        }, 'myTeam'
      );
    const output =
      plan1.joinInner(plan2,
        op.on(op.viewCol('myCity', 'city'), op.viewCol('myTeam', 'cityName')),
        op.ne(op.col('popularity'), 3)
      )
      .joinDoc(op.col('doc'), op.col('uri1'))
      .orderBy('uri1')
      .select([
        op.as('myJSON1', op.jsonDocument(op.jsonObject(op.prop('object1', op.viewCol('myCity', 'uri1'))))),
        op.as('myJSON2', op.jsonDocument(op.jsonObject([
          op.prop('object2', op.viewCol('myTeam', 'cityTeam')),
          op.prop('object3', op.col('cityName'))
        ]))),
        op.as('myJSON3', op.jsonDocument(op.jsonObject(op.prop('object4', op.jsonNumber(op.fn.number(op.xpath('doc', '//latLonPair/lat'))))))),
        op.as('myJSON4', op.jsonDocument(op.jsonObject(op.prop('array1', op.jsonArray([
          op.jsonString(op.col('uri2')), op.col('popularity'), op.jsonArray([op.col('date'), op.jsonNumber(op.col('distance'))])
        ])))))
      ])
    db.rows.query(output, { format: 'json', structure: 'object', columnTypes: 'header' })
    .then(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.rows.length).to.equal(4);
      expect(output.rows[0].myJSON1.object1).to.equal('/optic/lexicon/test/doc1.json');
      expect(output.rows[0].myJSON2.object2).to.equal('arsenal');
      expect(output.rows[0].myJSON2.object3).to.equal('london');
      expect(output.rows[0].myJSON3.object4).to.equal(51.5);
      expect(output.rows[0].myJSON4.array1[2][0]).to.equal('2007-01-01');
      done();
    }, done);
  });

  it('TEST 5 - construct json from aggregates - xml format', function(done){
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
      .select([
        op.as('myJSON1', op.jsonDocument(op.jsonObject(op.prop('object1', op.col('maxColor'))))),
        op.as('myJSON2', op.jsonDocument(op.jsonObject(op.prop('array1', op.jsonArray([
          op.col('minColor'),
          op.jsonString(op.col('avgColor')),
          op.col('sumColor')
        ]))))),
        op.as('myJSON3', op.jsonDocument(op.jsonObject(op.prop('object2', op.jsonObject(op.prop('object3', op.jsonNumber(op.col('masterCount')))))))),
        op.as('myJSON4', op.jsonDocument(op.jsonObject(op.prop('array2', op.jsonArray([
          op.jsonObject(op.prop('object4', op.jsonString(op.col('groupConcatColor')))),
          op.jsonObject(op.prop('object5', op.col('minColor')))
        ])))))
      ])
    db.rows.query(output, { format: 'xml', structure: 'array', columnTypes: 'header' })
    .then(function(output) {
      //console.log(output);
      const outputStr = output.toString().trim().replace(/[\n\r]/g, '');
      //console.log(outputStr);
      expect(outputStr).to.equal('<t:table xmlns:t="http://marklogic.com/table"><t:columns><t:column name="myJSON1" type="object"/><t:column name="myJSON2" type="object"/><t:column name="myJSON3" type="object"/><t:column name="myJSON4" type="object"/></t:columns><t:rows><t:row><t:cell name="myJSON1">{"object1":60.06}</t:cell><t:cell name="myJSON2">{"array1":[40.04, "50.05", 150.15]}</t:cell><t:cell name="myJSON3">{"object2":{"object3":3}}</t:cell><t:cell name="myJSON4">{"array2":[{"object4":"40.04 and 50.05 and 60.06"}, {"object5":40.04}]}</t:cell></t:row><t:row><t:cell name="myJSON1">{"object1":30.03}</t:cell><t:cell name="myJSON2">{"array1":[10.01, "20.02", 60.06]}</t:cell><t:cell name="myJSON3">{"object2":{"object3":3}}</t:cell><t:cell name="myJSON4">{"array2":[{"object4":"10.01 and 20.02 and 30.03"}, {"object5":10.01}]}</t:cell></t:row></t:rows></t:table>');
      done();
    }, done);
  });

  it('TEST 6 - construct json from aggregates - csv format', function(done){
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
      .select([
        op.as('myJSON1', op.jsonDocument(op.jsonObject(op.prop('object1', op.col('maxColor'))))),
        op.as('myJSON2', op.jsonDocument(op.jsonObject(op.prop('array1', op.jsonArray([
          op.col('minColor'),
          op.jsonString(op.col('avgColor')),
          op.col('sumColor')
        ]))))),
        op.as('myJSON3', op.jsonDocument(op.jsonObject(op.prop('object2', op.jsonObject(op.prop('object3', op.jsonNumber(op.col('masterCount')))))))),
        op.as('myJSON4', op.jsonDocument(op.jsonObject(op.prop('array2', op.jsonArray([
          op.jsonObject(op.prop('object4', op.jsonString(op.col('groupConcatColor')))),
          op.jsonObject(op.prop('object5', op.col('minColor')))
        ])))))
      ])
    db.rows.query(output, { format: 'csv', structure: 'array', columnTypes: 'header' })
    .then(function(output) {
      //console.log(output);
      expect(output).to.contain('["myJSON1", "myJSON2", "myJSON3", "myJSON4"]');
      expect(output).to.contain('[{"object1":60.06}, {"array1":[40.04, "50.05", 150.15]}, {"object2":{"object3":3}}, {"array2":[{"object4":"40.04 and 50.05 and 60.06"}, {"object5":40.04}]}]');
      expect(output).to.contain('[{"object1":30.03}, {"array1":[10.01, "20.02", 60.06]}, {"object2":{"object3":3}}, {"array2":[{"object4":"10.01 and 20.02 and 30.03"}, {"object5":10.01}]}]');
      done();
    }, done);
  });

  it('TEST 7 - queryAsStream chunked', function(done){
    var count = 0;
    var str = '';
    const chunks = [];
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
      .select([
        op.as('myJSON1', op.jsonDocument(op.jsonObject(op.prop('object1', op.col('maxColor'))))),
        op.as('myJSON2', op.jsonDocument(op.jsonObject(op.prop('array1', op.jsonArray([
          op.col('minColor'),
          op.jsonString(op.col('avgColor')),
          op.col('sumColor')
        ]))))),
        op.as('myJSON3', op.jsonDocument(op.jsonObject(op.prop('object2', op.jsonObject(op.prop('object3', op.jsonNumber(op.col('masterCount')))))))),
        op.as('myJSON4', op.jsonDocument(op.jsonObject(op.prop('array2', op.jsonArray([
          op.jsonObject(op.prop('object4', op.jsonString(op.col('groupConcatColor')))),
          op.jsonObject(op.prop('object5', op.col('minColor')))
        ])))))
      ])
    db.rows.queryAsStream(output, 'chunked', { format: 'json', structure: 'object', columnTypes: 'header' })
    .on('data', function(chunk) {
      //console.log(chunk.toString());
      str = str + chunk.toString().trim().replace(/[\n\r]/g, ' ');
      count++;
    }).
    on('end', function() {
      //console.log(str);
      //console.log(count);
      expect(str).to.equal('{ "columns": [{"name":"myJSON1","type":"object"},{"name":"myJSON2","type":"object"},{"name":"myJSON3","type":"object"},{"name":"myJSON4","type":"object"}], "rows":[ {"myJSON1":{"object1":60.06},"myJSON2":{"array1":[40.04, "50.05", 150.15]},"myJSON3":{"object2":{"object3":3}},"myJSON4":{"array2":[{"object4":"40.04 and 50.05 and 60.06"}, {"object5":40.04}]}}, {"myJSON1":{"object1":30.03},"myJSON2":{"array1":[10.01, "20.02", 60.06]},"myJSON3":{"object2":{"object3":3}},"myJSON4":{"array2":[{"object4":"10.01 and 20.02 and 30.03"}, {"object5":10.01}]}}] }');
      expect(count).to.equal(1);
      done();
    }, done);
  });

  it('TEST 8 - construct complex node with queryAsStream and complexValues reference', function(done){
    var count = 0;
    var str = '';
    const chunks = [];
    const bb = op.prefixer('http://marklogic.com/baseball/players/');
    const ageCol = op.col('age');
    const idCol = op.col('id');
    const nameCol = op.col('name');
    const posCol = op.col('position');
    const output =
      op.fromTriples([
        op.pattern(idCol, bb('age'), ageCol),
        op.pattern(idCol, bb('name'), nameCol),
        op.pattern(idCol, bb('position'), posCol)
      ])
      .where(
        op.and(
          op.le(ageCol, 25),
          op.eq(posCol, 'Catcher')
        )
      )
      .orderBy(op.desc(ageCol))
      .select([
        op.as('PlayerName', nameCol),
        op.as('PlayerPosition', posCol),
        op.as('PlayerAge', ageCol)
      ])
      .select([
        'PlayerName',
        'PlayerPosition',
        'PlayerAge',
        op.as('xml',
          op.xmlDocument(
            op.xmlElement(
              'root',
              op.xmlAttribute('attrA', op.col('PlayerName')),
              [
                op.xmlElement('elemA', null, op.col('PlayerPosition')),
      	        op.xmlElement('elemACodePoints', null, op.fn.stringToCodepoints(op.col('PlayerPosition'))),
	        op.xmlElement('elemB', null, op.col('PlayerAge')),
	        op.xmlElement('elemC', null, op.math.sqrt(op.col('PlayerAge')))
              ]
            )
          )
        )
      ])
    db.rows.queryAsStream(output, 'object', { format: 'json', structure: 'object', columnTypes: 'header', complexValues: 'reference' })
    .on('data', function(chunk) {
      chunks.push(chunk.content.xml);
      count++;
    }).
    on('end', function() {
      //console.log(count);
      //console.log(JSON.stringify(chunks, null, 2));
      expect(count).to.equal(2);
      expect(chunks[0]).to.be.undefined;
      expect(chunks[1].contentType).to.equal('application/xml');
      expect(chunks[1].format).to.equal('xml');
      expect(chunks[1].content).to.equal('<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<root attrA=\"Pat Crenshaw\"><elemA>Catcher</elemA><elemACodePoints>67 97 116 99 104 101 114</elemACodePoints><elemB>25</elemB><elemC>5</elemC></root>');
      done();
    }, done);
  });

  it('TEST 9 - construct complex JSON and xml node with queryAsStream and complexValues reference', function(done){
    var count = 0;
    var str = '';
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

    const output =
      plan1.joinInner(plan2, op.on(op.viewCol('myItem', 'colorId'), op.viewCol('myColor', 'colorId')))
      .select([
        'rowId',
        op.as('myJSON', op.jsonDocument(op.jsonObject([
          op.prop('str', op.jsonString(op.col('desc'))),
          op.prop('strFunc', op.jsonString(op.fn.stringToCodepoints(op.col('desc')))),
          op.prop('mathFunc', op.jsonNumber(op.math.sqrt(op.col('rowId')))),
          op.prop('upper', op.jsonString(op.fn.upperCase(op.viewCol('myItem', 'desc')))),
          op.prop('num', op.jsonNumber(op.col('rowId'))),
          op.prop('bool', op.jsonBoolean(op.isDefined(op.col('rowId')))),
          op.prop('null', op.jsonNull()),
          op.prop('array', op.jsonArray([op.jsonString(op.col('desc')), op.jsonNumber(op.col('rowId'))]))
        ]))),
        op.as('node', op.jsonString(op.col('desc'))),
        op.as('kind', op.xdmp.nodeKind(op.col('node'))),
        op.as('xml',
          op.xmlDocument(
            op.xmlElement(
              'root',
              op.xmlAttribute('attrA', op.col('rowId')),
              [
                op.xmlElement('elemA', null, op.viewCol('myColor', 'colorDesc')),
                op.xmlComment(op.fn.concat('this is a comment for ', op.col('desc'))),
                op.xmlElement('elemB', null, op.col('desc'))
              ]
            )
          )
        )
      ])
      .orderBy('rowId')
    db.rows.queryAsStream(output, 'object', { format: 'json', structure: 'object', columnTypes: 'header', complexValues: 'reference' })
    .on('data', function(chunk) {
      chunks.push(chunk.content);
      count++;
    }).
    on('end', function() {
      //console.log(count);
      //console.log(JSON.stringify(chunks, null, 2));
      expect(count).to.equal(5);
      expect(chunks[0].columns[1].name).to.equal('myJSON');
      expect(chunks[0].columns[1].type).to.equal('cid');
      expect(chunks[0].columns[2].name).to.equal('node');
      expect(chunks[0].columns[2].type).to.equal('cid');
      expect(chunks[0].columns[4].name).to.equal('xml');
      expect(chunks[0].columns[4].type).to.equal('cid');
      expect(chunks[1].myJSON.contentType).to.equal('application/json');
      expect(chunks[1].myJSON.format).to.equal('json');
      expect(chunks[1].myJSON.content.str).to.equal('ball');
      expect(chunks[1].node.contentType).to.equal('text/plain');
      expect(chunks[1].node.format).to.equal('text');
      expect(chunks[1].node.content).to.equal('ball');
      expect(chunks[1].kind).to.equal('text');
      expect(chunks[1].xml.contentType).to.equal('application/xml');
      expect(chunks[1].xml.format).to.equal('xml');
      expect(chunks[1].xml.content).to.equal('<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<root attrA=\"1\"><elemA>red</elemA><!--this is a comment for ball--><elemB>ball</elemB></root>');
      done();
    }, done);
  });

});
