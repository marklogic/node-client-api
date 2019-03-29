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
const q = marklogic.queryBuilder;

describe('Nodejs Optic cts queries test', function(){

  it('TEST 1 - jsonPropertyWordQuery on fromLexicons', function(done){
    const plan1 =
      op.fromLexicons(
        {
          uri1: op.cts.uriReference(),
          city: op.cts.jsonPropertyReference('city'),
          popularity: op.cts.jsonPropertyReference('popularity'),
          date: op.cts.jsonPropertyReference('date'),
          distance: op.cts.jsonPropertyReference('distance'),
          point: op.cts.jsonPropertyReference('latLonPoint')
        }, 'myCity', op.fragmentIdCol('fragId1')
      );
    const plan2 =
      op.fromLexicons(
        {
          uri2: op.cts.uriReference(),
          cityName: op.cts.jsonPropertyReference('cityName'),
          cityTeam: op.cts.jsonPropertyReference('cityTeam')
        }, 'myTeam', op.fragmentIdCol('fragId2')
      );
    const output =
      plan1
      .where(op.cts.jsonPropertyWordQuery('city', 'new'))
      .joinInner(plan2)
      .where(op.eq(op.viewCol('myCity', 'city'), op.col('cityName')))
      .orderBy(op.asc(op.col('date')))
    db.rows.query(output, { format: 'json', structure: 'object', columnTypes: 'rows' })
    .then(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.rows.length).to.equal(2);
      expect(output.rows[0]['myCity.city'].value).to.equal('new jersey');
      expect(output.rows[1]['myCity.city'].value).to.equal('new york');
      done();
    }, done);
  });

  it('TEST 2 - jsonPropertyValueQuery on fromLexicons', function(done){
    const plan1 =
      op.fromLexicons(
        {
          uri1: op.cts.uriReference(),
          city: op.cts.jsonPropertyReference('city'),
          popularity: op.cts.jsonPropertyReference('popularity'),
          date: op.cts.jsonPropertyReference('date'),
          distance: op.cts.jsonPropertyReference('distance'),
          point: op.cts.jsonPropertyReference('latLonPoint')
        }, 'myCity', op.fragmentIdCol('fragId1')
      );
    const plan2 =
      op.fromLexicons(
        {
          uri2: op.cts.uriReference(),
          cityName: op.cts.jsonPropertyReference('cityName'),
          cityTeam: op.cts.jsonPropertyReference('cityTeam')
        }, 'myTeam', op.fragmentIdCol('fragId2')
      );
    const output =
      plan1.where(op.cts.jsonPropertyWordQuery('city', 'new'))
      .joinInner(plan2.where(op.cts.jsonPropertyValueQuery('cityTeam', 'yankee')))
      .where(op.eq(op.viewCol('myCity', 'city'), op.col('cityName')))
      .orderBy(op.asc(op.col('date')))
    db.rows.query(output, { format: 'json', structure: 'object', columnTypes: 'rows' })
    .then(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.rows.length).to.equal(1);
      expect(output.rows[0]['myCity.city'].value).to.equal('new york');
      done();
    }, done);
  });

  it('TEST 3 - jsonPropertyGeospatialQuery with box on fromLexicons', function(done){
    const plan1 =
      op.fromLexicons(
        {
          uri1: op.cts.uriReference(),
          city: op.cts.jsonPropertyReference('city'),
          popularity: op.cts.jsonPropertyReference('popularity'),
          date: op.cts.jsonPropertyReference('date'),
          distance: op.cts.jsonPropertyReference('distance'),
          point: op.cts.jsonPropertyReference('latLonPoint')
        }, 'myCity', op.fragmentIdCol('fragId1')
      );
    const plan2 =
      op.fromLexicons(
        {
          uri2: op.cts.uriReference(),
          cityName: op.cts.jsonPropertyReference('cityName'),
          cityTeam: op.cts.jsonPropertyReference('cityTeam')
        }, 'myTeam', op.fragmentIdCol('fragId2')
      );
    const output =
      plan1
      .where(op.cts.jsonPropertyGeospatialQuery('latLonPoint', op.cts.box(49.16, -13.41, 60.85, 1.76)))
      .joinInner(plan2)
      .where(op.eq(op.viewCol('myCity', 'city'), op.col('cityName')))
      .orderBy(op.asc(op.col('date')))
    db.rows.query(output, { format: 'json', structure: 'object', columnTypes: 'header' })
    .then(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.rows.length).to.equal(1);
      expect(output.rows[0]['myCity.city']).to.equal('london');
      done();
    }, done);
  });

  it('TEST 4 - collectionQuery and elementValueQuery on fromLexicons', function(done){
    const plan1 =
      op.fromLexicons(
        {
          uri1: op.cts.uriReference(),
          city: op.cts.jsonPropertyReference('city'),
          popularity: op.cts.jsonPropertyReference('popularity'),
          date: op.cts.jsonPropertyReference('date'),
          distance: op.cts.jsonPropertyReference('distance'),
          point: op.cts.jsonPropertyReference('latLonPoint')
        }, 'myCity', op.fragmentIdCol('fragId1')
      );
    const plan2 =
      op.fromLexicons(
        {
          uri2: op.cts.uriReference(),
          cityName: op.cts.jsonPropertyReference('cityName'),
          cityTeam: op.cts.jsonPropertyReference('cityTeam')
        }, 'myTeam', op.fragmentIdCol('fragId2')
      );
    const output =
      plan1
      .where(op.cts.orQuery([op.cts.collectionQuery('/other/coll1'), op.cts.elementValueQuery(op.xs.QName('metro'), 'true')]))
      .joinInner(plan2)
      .where(op.eq(op.viewCol('myCity', 'city'), op.col('cityName')))
      .orderBy(op.asc(op.col('date')))
    db.rows.query(output, { format: 'json', structure: 'object', columnTypes: 'header' })
    .then(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.rows.length).to.equal(3);
      expect(output.rows[0]['myCity.city']).to.equal('beijing');
      expect(output.rows[1]['myCity.city']).to.equal('cape town');
      expect(output.rows[2]['myCity.city']).to.equal('london');
      done();
    }, done);
  });

  it('TEST 5 - setup for tripleRangeQuery on fromTriples', function(done){
    var src =
     `declareUpdate();
     var sem = require("/MarkLogic/semantics.xqy");

     var a = sem.rdfInsert(
       sem.triple(sem.iri("http://example.com/ns/directory#m"),
                  sem.iri("http://example.com/ns/person#firstName"),
                  "Mark"),
       "override-graph=opticRdfTest");
     var b = sem.rdfInsert(
       sem.triple(sem.iri("http://example.com/Mark"),
             sem.iri("http://example.com/ns/person#age"),
             37),
       "override-graph=opticRdfTest");
     var c = sem.rdfInsert(
       sem.triple(sem.iri("http://example.com/ns/directory#m"),
             sem.iri("http://example.com/ns/person#firstName"),
             "John"),
       "override-graph=opticRdfTest");
     var d = sem.rdfInsert(
       sem.triple(sem.iri("http://example.com/John"),
             sem.iri("http://example.com/ns/person#age"),
             30),
      "override-graph=opticRdfTest");
     var e = sem.rdfInsert(
       sem.triple(sem.iri("http://example.com/ns/directory#m"),
             sem.iri("http://example.com/ns/person#firstName"),
             "Mark"),
       "override-graph=opticRdfTest");
     var f = sem.rdfInsert(
       sem.triple(sem.iri("http://example.com/Mark"),
             sem.iri("http://example.com/ns/person#age"),
             65),
       "override-graph=opticRdfTest");

     var res = new Array();
     res.push(a);
     res.push(b);
     res.push(c);
     res.push(d);
     res.push(e);
     res.push(f);
     res;`

    db.eval(src)
    .result(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      done();
    }, done);
  });

  it('TEST 6 - tripleRangeQuery on fromTriples', function(done){
   const pp = op.prefixer('http://example.com/ns/person#');
   const nameCol = op.col('name');
   const ageCol = op.col('age');

   const name_plan =
     op.fromTriples([
       op.pattern(nameCol, pp('age'), ageCol)
     ], null, null);

   const output =
     name_plan
     .where(op.cts.tripleRangeQuery(op.sem.iri("http://example.com/Mark"), op.sem.iri("http://example.com/ns/person#age"), 50, "<"))
    db.rows.query(output, { format: 'json', structure: 'object', columnTypes: 'header' })
    .then(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.rows.length).to.equal(1);
      expect(output.rows[0].name).to.equal('http://example.com/Mark');
      expect(output.rows[0].age).to.equal(37);
      done();
    }, done);
  });

  it('TEST 7 - cleanup for tripleRangeQuery on fromTriples', function(done){
    var src =
     `declareUpdate();
      var sem = require("/MarkLogic/semantics.xqy");
      sem.graphDelete(sem.iri("opticRdfTest"))`
    db.eval(src)
    .result(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      done();
    }, done);
  });

  it('TEST 8 - jsonPropertyWordQuery on fromViews', function(done){
    const plan1 =
      op.fromView('opticFunctionalTest4', 'detail4', null, null)

    const plan2 =
      op.fromView('opticFunctionalTest4', 'master4')

    const output =
      plan1
      .where(op.cts.jsonPropertyWordQuery('name', 'Detail 100'))
      .joinInner(plan2, op.on(op.schemaCol('opticFunctionalTest4', 'detail4', 'masterId'), op.schemaCol('opticFunctionalTest4', 'master4', 'id')))
      .orderBy(op.schemaCol('opticFunctionalTest4', 'detail4', 'id'))
    db.rows.query(output, { format: 'json', structure: 'object', columnTypes: 'header' })
    .then(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.rows.length).to.equal(3);
      expect(output.rows[0]['opticFunctionalTest4.detail4.id']).to.equal(100);
      expect(output.rows[0]['opticFunctionalTest4.master4.name']).to.equal('Master 100');
      expect(output.rows[2]['opticFunctionalTest4.detail4.id']).to.equal(300);
      expect(output.rows[2]['opticFunctionalTest4.master4.name']).to.equal('Master 200');
      done();
    }, done);
  });

  it('TEST 9 - wordQuery and jsonPropertyValueQuery on fromViews', function(done){
    const plan1 =
      op.fromView('opticFunctionalTest4', 'detail4', null, null);

    const plan2 =
      op.fromView('opticFunctionalTest4', 'master4', null, null);
    const output =
      plan1
      .where(op.cts.jsonPropertyValueQuery('id', '600'))
      .joinInner(
        plan2.where(op.cts.wordQuery('Master 100')),
        op.on(op.schemaCol('opticFunctionalTest4', 'detail4', 'masterId'), op.schemaCol('opticFunctionalTest4', 'master4', 'id'))
      )
      .orderBy(op.schemaCol('opticFunctionalTest4', 'detail4', 'id'))
    db.rows.query(output, { format: 'json', structure: 'object', columnTypes: 'header' })
    .then(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.rows.length).to.equal(3);
      expect(output.rows[0]['opticFunctionalTest4.detail4.id']).to.equal(400);
      expect(output.rows[0]['opticFunctionalTest4.master4.name']).to.equal('Master 200');
      expect(output.rows[2]['opticFunctionalTest4.detail4.id']).to.equal(600);
      expect(output.rows[2]['opticFunctionalTest4.master4.name']).to.equal('Master 100');
      done();
    }, done);
  });

  it('TEST 11 - jsonPropertyRangeQuery on fromViews', function(done){
    const plan1 =
      op.fromView('opticFunctionalTest4', 'detail4', null, null);

    const plan2 =
      op.fromView('opticFunctionalTest4', 'master4');

    const output =
      plan1
      .where(op.cts.jsonPropertyRangeQuery('id', '>', 300))
      .joinInner(plan2, op.on(op.schemaCol('opticFunctionalTest4', 'detail4', 'masterId'), op.schemaCol('opticFunctionalTest4', 'master4', 'id')))
      .orderBy(op.schemaCol('opticFunctionalTest4', 'detail4', 'id'))
    db.rows.query(output, { format: 'json', structure: 'object', columnTypes: 'header' })
    .then(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.rows.length).to.equal(3);
      expect(output.rows[0]['opticFunctionalTest4.detail4.id']).to.equal(400);
      expect(output.rows[0]['opticFunctionalTest4.master4.name']).to.equal('Master 200');
      expect(output.rows[2]['opticFunctionalTest4.detail4.id']).to.equal(600);
      expect(output.rows[2]['opticFunctionalTest4.master4.name']).to.equal('Master 100');
      done();
    }, done);
  });

  it('TEST 12 - nearQuery on fromLexicons', function(done){
    const plan1 =
      op.fromLexicons(
        {
          uri1: op.cts.uriReference(),
          city: op.cts.jsonPropertyReference('city'),
          popularity: op.cts.jsonPropertyReference('popularity'),
          date: op.cts.jsonPropertyReference('date'),
          distance: op.cts.jsonPropertyReference('distance'),
          point: op.cts.jsonPropertyReference('latLonPoint')
        }, 'myCity', op.fragmentIdCol('fragId1')
      );
    const plan2 =
      op.fromLexicons(
        {
          uri2: op.cts.uriReference(),
          cityName: op.cts.jsonPropertyReference('cityName'),
          cityTeam: op.cts.jsonPropertyReference('cityTeam')
        }, 'myTeam', op.fragmentIdCol('fragId2')
      );
    const output =
      plan1
      .where(op.cts.nearQuery([op.cts.wordQuery('near'), op.cts.wordQuery('Thames')], 3))
      .joinInner(plan2)
      .where(op.eq(op.viewCol('myCity', 'city'), op.col('cityName')))
      .orderBy(op.asc(op.col('date')))
    db.rows.query(output, { format: 'json', structure: 'object', columnTypes: 'header' })
    .then(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.rows.length).to.equal(1);
      expect(output.rows[0]['myCity.city']).to.equal('london');
      done();
    }, done);
  });

  it('TEST 13 - cts queries with options on fromLexicons', function(done){
    const plan1 =
      op.fromLexicons(
        {
          uri1: op.cts.uriReference(),
          city: op.cts.jsonPropertyReference('city'),
          popularity: op.cts.jsonPropertyReference('popularity'),
          date: op.cts.jsonPropertyReference('date'),
          distance: op.cts.jsonPropertyReference('distance'),
          point: op.cts.jsonPropertyReference('latLonPoint')
        }, 'myCity', op.fragmentIdCol('fragId1')
      );
    const plan2 =
      op.fromLexicons(
        {
          uri2: op.cts.uriReference(),
          cityName: op.cts.jsonPropertyReference('cityName'),
          cityTeam: op.cts.jsonPropertyReference('cityTeam')
        }, 'myTeam', op.fragmentIdCol('fragId2')
      );
    const output =
      plan1
      .where(op.cts.jsonPropertyWordQuery('city', '*k', ['wildcarded', 'case-sensitive']))
      .joinInner(plan2)
      .where(op.eq(op.viewCol('myCity', 'city'), op.col('cityName')))
      .orderBy(op.asc(op.col('date')))
    db.rows.query(output, { format: 'json', structure: 'object', columnTypes: 'header' })
    .then(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.rows.length).to.equal(1);
      expect(output.rows[0]['myCity.city']).to.equal('new york');
      done();
    }, done);
  });

});
