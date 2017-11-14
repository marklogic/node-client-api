/*
 * Copyright 2014-2017 MarkLogic Corporation
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

//const planPath = '../config-optic/qa-data/planLexicons.json';

//const planFromJSON = fs.readFileSync(planPath, 'utf8');

describe('Node.js Optic from lexicons test', function(){

  it('TEST 1 - access with where orderby select - columnTypes header and data types', function(done){
    const popCol = op.col('popularity');
    const dateCol = op.col('date');
    const plan1 =
      op.fromLexicons(
        {
          uri: op.cts.uriReference(),
          city: op.cts.jsonPropertyReference('city'),
          popularity: op.cts.jsonPropertyReference('popularity'),
          date: op.cts.jsonPropertyReference('date'),
          distance: op.cts.jsonPropertyReference('distance'),
          point: op.cts.jsonPropertyReference('latLonPoint')
        }, 'myCity'
      );
    const output =
      plan1
      .where(op.gt(popCol, 2))
      .orderBy(op.asc('date'))
      .select(['city', 'popularity', 'date', 'distance', 'point'])

    db.rows.query(output, { format: 'json', structure: 'object', columnTypes: 'header' }) 
    .then(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.columns[2].name).to.equal('myCity.date');
      expect(output.columns[2].type).to.equal('xs:date');
      expect(output.columns[4].name).to.equal('myCity.point');
      expect(output.columns[4].type).to.equal('http://marklogic.com/cts#point');
      expect(output.rows.length).to.equal(4);
      expect(output.rows[0]['myCity.popularity']).to.equal(5);
      expect(output.rows[0]['myCity.date']).to.equal('1981-11-09');
      expect(output.rows[3]['myCity.popularity']).to.equal(5);
      expect(output.rows[3]['myCity.date']).to.equal('2007-01-01');
      done();
    }, done);
  });

  it('TEST 2 - join inner doc', function(done){
    const plan1 = 
      op.fromLexicons(
        {
          uri: op.cts.uriReference(),
          city: op.cts.jsonPropertyReference('city'),
          popularity: op.cts.jsonPropertyReference('popularity'),
          date: op.cts.jsonPropertyReference('date'),
          distance: op.cts.jsonPropertyReference('distance'),
          point: op.cts.jsonPropertyReference('latLonPoint')
        }, 'myCity'
      );
    const output =
      plan1
      .joinDoc(op.col('doc'), op.col('uri'))
      .orderBy(op.asc('uri'))
      .select(['uri', 'city', 'popularity', 'date', 'distance', 'point', op.as('nodes', op.xpath('doc', '//latLonPair/lat'))])
      .where(op.isDefined(op.col('nodes')))
    db.rows.query(output, { format: 'json', structure: 'object', columnTypes: 'header' }) 
    .then(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.columns[6].name).to.equal('nodes');
      expect(output.columns[6].type).to.equal('array');
      expect(output.rows.length).to.equal(5);
      expect(output.rows[0]['myCity.uri']).to.equal('/optic/lexicon/test/doc1.json');
      expect(output.rows[0]['myCity.popularity']).to.equal(5);
      expect(output.rows[0].nodes).to.equal(51.5);
      expect(output.rows[1]['myCity.uri']).to.equal('/optic/lexicon/test/doc2.json');
      expect(output.rows[1]['myCity.popularity']).to.equal(5);
      expect(output.rows[1].nodes).to.equal(40.71);
      expect(output.rows[4]['myCity.uri']).to.equal('/optic/lexicon/test/doc5.xml');
      expect(output.rows[4]['myCity.popularity']).to.equal(3);
      expect(output.rows[4].nodes).to.equal('<lat>-33.91</lat>');
      done();
    }, done);
  });

  it('TEST 3 - join inner with keymatch, viewCol, and date sort - structure array, columnTypes rows', function(done){
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
      plan1.joinInner(plan2)
      .where(op.eq(op.viewCol('myCity', 'city'), op.col('cityName')))
      .orderBy(op.asc(op.col('date')))
    db.rows.query(output, { format: 'json', structure: 'array', columnTypes: 'rows' }) 
    .then(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(6);
      expect(output[1][1].value).to.equal('new jersey');
      expect(output[1][3].value).to.equal('1971-12-23');
      expect(output[1][5].type).to.equal('http://marklogic.com/cts#point');
      expect(output[1][5].value).to.equal('40.720001,-74.07');
      expect(output[1][7].value).to.equal('new jersey');
      expect(output[1][8].value).to.equal('nets');
      expect(output[5][1].value).to.equal('london');
      expect(output[5][3].value).to.equal('2007-01-01');
      done();
    }, done);
  });

  it('TEST 4 - using element reference and null viewname', function(done){
    const plan1 = 
      op.fromLexicons(
        {
          uri1: op.cts.uriReference(),
          city: op.cts.elementReference(op.fn.QName(null, 'city')),
          popularity: op.cts.jsonPropertyReference('popularity'),
          date: op.cts.elementReference(op.fn.QName(null, 'date')),
          distance: op.cts.elementReference(op.fn.QName(null, 'distance')),
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
      plan1.joinInner(plan2, op.on(op.viewCol(null, 'city'), op.viewCol(null, 'cityName')))
      .joinDoc(op.col('doc'), op.col('uri1'))
      .select(['uri1', 'city', 'popularity', 'date', 'distance', 'point', op.as('nodes', op.xpath('doc', '//city')), 'uri2', 'cityName', 'cityTeam'])
      .where(op.isDefined(op.col('nodes')))
      .orderBy(op.desc('uri2'))
    db.rows.query(output, { format: 'json', structure: 'object', columnTypes: 'header' }) 
    .then(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.rows.length).to.equal(5);
      expect(output.rows[0]['myCity.city']).to.equal('cape town');
      expect(output.rows[0]['myCity.uri1']).to.equal('/optic/lexicon/test/doc5.xml');
      expect(output.rows[0]['myTeam.uri2']).to.equal('/optic/lexicon/test/city5.json');
      expect(output.rows[0].nodes).to.equal('<city>cape town</city>');
      expect(output.rows[4]['myCity.city']).to.equal('london');
      expect(output.rows[4]['myCity.uri1']).to.equal('/optic/lexicon/test/doc1.json');
      expect(output.rows[4]['myTeam.uri2']).to.equal('/optic/lexicon/test/city1.json');
      expect(output.rows[4].nodes).to.equal('london');
      done();
    }, done);
  });

  it('TEST 5 - access without uri reference - with format xml', function(done){
    const popCol = op.col('popularity');
    const dateCol = op.col('date');
    const plan1 =
      op.fromLexicons(
        {
          city: op.cts.jsonPropertyReference('city'),
          popularity: op.cts.jsonPropertyReference('popularity'),
          date: op.cts.jsonPropertyReference('date'),
          distance: op.cts.jsonPropertyReference('distance'),
          point: op.cts.jsonPropertyReference('latLonPoint')
        }, 'myCity'
      );
    const output =
      plan1
      .where(op.gt(popCol, 2))
      .orderBy(op.asc('popularity'))
      .select(['city', 'popularity', 'date', 'distance', 'point'])
    db.rows.query(output, { format: 'xml', structure: 'object', columnTypes: 'header' }) 
    .then(function(output) {
      //console.log(output);
      const outputStr = output.toString().trim().replace(/[\n\r]/g, '');
      //console.log(outputStr);
      expect(outputStr).to.equal('<t:table xmlns:t="http://marklogic.com/table"><t:columns><t:column name="myCity.city" type="xs:string"/><t:column name="myCity.popularity" type="xs:integer"/><t:column name="myCity.date" type="xs:date"/><t:column name="myCity.distance" type="xs:double"/><t:column name="myCity.point" type="http://marklogic.com/cts#point"/></t:columns><t:rows><t:row><t:cell name="myCity.city">cape town</t:cell><t:cell name="myCity.popularity">3</t:cell><t:cell name="myCity.date">1999-04-22</t:cell><t:cell name="myCity.distance">377.9</t:cell><t:cell name="myCity.point">-33.91,18.42</t:cell></t:row><t:row><t:cell name="myCity.city">beijing</t:cell><t:cell name="myCity.popularity">5</t:cell><t:cell name="myCity.date">1981-11-09</t:cell><t:cell name="myCity.distance">134.5</t:cell><t:cell name="myCity.point">39.900002,116.4</t:cell></t:row><t:row><t:cell name="myCity.city">london</t:cell><t:cell name="myCity.popularity">5</t:cell><t:cell name="myCity.date">2007-01-01</t:cell><t:cell name="myCity.distance">50.4</t:cell><t:cell name="myCity.point">51.5,-0.12</t:cell></t:row><t:row><t:cell name="myCity.city">new york</t:cell><t:cell name="myCity.popularity">5</t:cell><t:cell name="myCity.date">2006-06-23</t:cell><t:cell name="myCity.distance">23.3</t:cell><t:cell name="myCity.point">40.709999,-74.009995</t:cell></t:row></t:rows></t:table>');
      done();
    }, done);
  });

  it('TEST 6 - join inner with plan accessor column identifier', function(done){
    const plan1 = 
      op.fromLexicons(
        {
          uri1: op.cts.uriReference(),
          city: op.cts.elementReference(op.fn.QName('', 'city')),
          popularity: op.cts.jsonPropertyReference('popularity'),
          date: op.cts.elementReference(op.fn.QName('', 'date')),
          distance: op.cts.elementReference(op.fn.QName('', 'distance')),
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
    const cityCol = plan1.col('city');
    const cityNameCol = plan2.col('cityName');
    const output =
      plan1.joinInner(plan2, op.on(cityCol, cityNameCol))
      .joinDoc(op.col('doc'), op.col('uri1'))
      .select(['uri1', 'city', 'popularity', 'date', 'distance', 'point', op.as('nodes', op.xpath('doc', '//city')), 'uri2', 'cityName', 'cityTeam'])
      .where(op.isDefined(op.col('nodes')))
      .orderBy(op.desc('uri2'))
    db.rows.query(output, { format: 'json', structure: 'object', columnTypes: 'header' }) 
    .then(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.rows.length).to.equal(5);
      expect(output.rows[0]['myCity.city']).to.equal('cape town');
      expect(output.rows[0]['myCity.uri1']).to.equal('/optic/lexicon/test/doc5.xml');
      expect(output.rows[0]['myTeam.uri2']).to.equal('/optic/lexicon/test/city5.json');
      expect(output.rows[0].nodes).to.equal('<city>cape town</city>');
      expect(output.rows[4]['myCity.city']).to.equal('london');
      expect(output.rows[4]['myCity.uri1']).to.equal('/optic/lexicon/test/doc1.json');
      expect(output.rows[4]['myTeam.uri2']).to.equal('/optic/lexicon/test/city1.json');
      expect(output.rows[4].nodes).to.equal('london');
      done();
    }, done);
  });

  it('TEST 7 - use result on prepared plan and multiple order by', function(done){
    const popCol = op.col('popularity');
    const dateCol = op.col('date');
    const plan1 =
      op.fromLexicons(
        {
          uri: op.cts.uriReference(),
          city: op.cts.jsonPropertyReference('city'),
          popularity: op.cts.jsonPropertyReference('popularity'),
          date: op.cts.jsonPropertyReference('date'),
          distance: op.cts.jsonPropertyReference('distance'),
          point: op.cts.jsonPropertyReference('latLonPoint')
        }, 'myCity'
      );
    const preparedPlan =
      plan1
      .where(op.gt(popCol, 2))
      .orderBy([op.asc('popularity'), op.desc('date')])
      .select(['city', 'popularity', 'date', 'distance', 'point'])
      .prepare(0);
    //console.log(JSON.stringify(preparedPlan));
    db.rows.query(preparedPlan, { format: 'json', structure: 'object', columnTypes: 'header' }) 
    .then(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.rows.length).to.equal(4);
      /*expect(output[0].value['myCity.city']).to.equal('cape town');
      expect(output[0].value['myCity.popularity']).to.equal(3);
      expect(output[1].value['myCity.popularity']).to.equal(5);
      expect(output[1].value['myCity.date']).to.equal('2007-01-01');
      expect(output[3].value['myCity.popularity']).to.equal(5);
      expect(output[3].value['myCity.date']).to.equal('1981-11-09');*/
      done();
    }, done);
  });

  it('TEST 8 - join inner doc without xpath - with format csv', function(done){
    const plan1 = 
      op.fromLexicons(
        {
          uri: op.cts.uriReference(),
          city: op.cts.jsonPropertyReference('city'),
          popularity: op.cts.jsonPropertyReference('popularity'),
          date: op.cts.jsonPropertyReference('date'),
          distance: op.cts.jsonPropertyReference('distance'),
          point: op.cts.jsonPropertyReference('latLonPoint')
        }, 'myCity'
      );
    const output =
      plan1
      .joinDoc(op.col('doc'), op.col('uri'))
      .orderBy(op.asc('uri'))
    db.rows.query(output, { format: 'csv', structure: 'object', columnTypes: 'header' }) 
    .then(function(output) {
      //console.log(output);
      expect(output).to.contain('myCity.uri,myCity.city,myCity.popularity,myCity.date,myCity.distance,myCity.point,doc');
      expect(output).to.contain('/optic/lexicon/test/doc1.json,london,5,2007-01-01,50.4,"51.5,-0.12","{""city"":""london"", ""distance"":50.4, ""date"":""2007-01-01"", ""metro"":true, ""description"":""Two recent discoveries indicate probable very early settlements near the Thames"", ""popularity"":5, ""location"":{""latLonPoint"":""51.50, -0.12"", ""latLonPair"":{""lat"":51.5, ""long"":-0.12}, ""latLonParent"":{""latLonChild"":""51.50, -0.12""}}}"');
      done();
    }, done);
  });

  it('TEST 9 - export plan and execute the plan', function(done){
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
    const exportedPlan =
      plan1.joinInner(plan2)
      .where(op.eq(op.viewCol('myCity', 'city'), op.col('cityName')))
      .orderBy(op.asc(op.col('date')))
      .export();
    //console.log(JSON.stringify(exportedPlan).trim().replace(/[\n\r]/g, ''));
    const exportedPlanStr = JSON.stringify(exportedPlan).trim().replace(/[\n\r]/g, '');
    expect(exportedPlanStr).to.equal('{"$optic":{"ns":"op","fn":"operators","args":[{"ns":"op","fn":"from-lexicons","args":[{"uri1":{"ns":"cts","fn":"uri-reference","args":[]},"city":{"ns":"cts","fn":"json-property-reference","args":["city"]},"popularity":{"ns":"cts","fn":"json-property-reference","args":["popularity"]},"date":{"ns":"cts","fn":"json-property-reference","args":["date"]},"distance":{"ns":"cts","fn":"json-property-reference","args":["distance"]},"point":{"ns":"cts","fn":"json-property-reference","args":["latLonPoint"]}},"myCity",{"ns":"op","fn":"fragment-id-col","args":["fragId1"]}]},{"ns":"op","fn":"join-inner","args":[{"ns":"op","fn":"operators","args":[{"ns":"op","fn":"from-lexicons","args":[{"uri2":{"ns":"cts","fn":"uri-reference","args":[]},"cityName":{"ns":"cts","fn":"json-property-reference","args":["cityName"]},"cityTeam":{"ns":"cts","fn":"json-property-reference","args":["cityTeam"]}},"myTeam",{"ns":"op","fn":"fragment-id-col","args":["fragId2"]}]}]}]},{"ns":"op","fn":"where","args":[{"ns":"op","fn":"eq","args":[{"ns":"op","fn":"view-col","args":["myCity","city"]},{"ns":"op","fn":"col","args":["cityName"]}]}]},{"ns":"op","fn":"order-by","args":[{"ns":"op","fn":"asc","args":[{"ns":"op","fn":"col","args":["date"]}]}]}]}}');
    db.rows.query(exportedPlan, { format: 'json', structure: 'object', columnTypes: 'header' }) 
    .then(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.rows.length).to.equal(5);
      expect(output.rows[0]['myCity.city']).to.equal('new jersey');
      expect(output.rows[0]['myCity.date']).to.equal('1971-12-23');
      expect(output.rows[0]['myTeam.cityName']).to.equal('new jersey');
      expect(output.rows[0]['myTeam.cityTeam']).to.equal('nets');
      expect(output.rows[4]['myCity.city']).to.equal('london');
      expect(output.rows[4]['myCity.date']).to.equal('2007-01-01');
      expect(output.rows[4]['myTeam.cityName']).to.equal('london');
      expect(output.rows[4]['myTeam.cityTeam']).to.equal('arsenal');
      expect(output.rows[4]['myTeam.uri2']).to.equal('/optic/lexicon/test/city1.json');
      expect(output.rows[4]['myCity.__docid']).to.not.exist;
      expect(output.rows[4]['myTeam.__docid']).to.not.exist;
      done();
    }, done);
  });

  it('TEST 10 - join inner with joinInnerDoc - with queryAsStream', function(done){
    let count = 0;
    let str = '';
    const chunks = [];
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
      plan1.joinInner(plan2)
      .where(op.eq(op.viewCol('myCity', 'city'), op.col('cityName')))
      .joinDoc(op.col('doc'), op.col('uri2'))
      .orderBy(op.asc(op.col('date')))
    db.rows.queryAsStream(output, 'object', { format: 'json', structure: 'object', columnTypes: 'header', complexValues: 'reference' }) 
    .on('data', function(chunk) {
      chunks.push(chunk.kind.toString());
      count++;
    }).
    on('end', function() {
      //console.log(count);
      //console.log(chunks.join(''));
      expect(chunks.join(' ')).to.equal('columns row row row row row');
      expect(count).to.equal(6);
      done();
    }, done);
  });

  it('TEST 11 - join inner with joinInnerDoc and xpath - with queryAsStream sequence', function(done){
    var count = 0;
    var str = '';
    const chunks = [];
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
      plan1.joinInner(plan2)
      .where(op.eq(op.viewCol('myCity', 'city'), op.col('cityName')))
      .joinDoc(op.col('doc'), op.col('uri2'))
      .select(['uri1', 'city', 'popularity', 'date', 'distance', 'point', op.viewCol('myCity', '__docId'), 'uri2', 'cityName', 'cityTeam', op.viewCol('myTeam', '__docId'), op.as('nodes', op.xpath('doc', '/cityTeam'))])
      .where(op.isDefined(op.col('nodes')))
      .orderBy(op.asc(op.col('date')))
    db.rows.queryAsStream(output, 'sequence', { format: 'json', structure: 'object', columnTypes: 'header' }) 
    .on('data', function(chunk) {
      //console.log(chunk.toString());
      str = str + chunk.toString().trim().replace(/[\n\r]/g, ' ');
      count++;
    }).
    on('end', function() {
      //console.log(str);
      //console.log(count);
      expect(str).to.equal('\u001e{"columns":[{"name":"myCity.uri1","type":"xs:string"},{"name":"myCity.city","type":"xs:string"},{"name":"myCity.popularity","type":"xs:integer"},{"name":"myCity.date","type":"xs:date"},{"name":"myCity.distance","type":"xs:double"},{"name":"myCity.point","type":"http://marklogic.com/cts#point"},{"name":"myTeam.uri2","type":"xs:string"},{"name":"myTeam.cityName","type":"xs:string"},{"name":"myTeam.cityTeam","type":"xs:string"},{"name":"nodes","type":"array"}]}\u001e{"myCity.uri1":"/optic/lexicon/test/doc3.json","myCity.city":"new jersey","myCity.popularity":2,"myCity.date":"1971-12-23","myCity.distance":12.9,"myCity.point":"40.720001,-74.07","myTeam.uri2":"/optic/lexicon/test/city3.json","myTeam.cityName":"new jersey","myTeam.cityTeam":"nets","nodes":"nets"}\u001e{"myCity.uri1":"/optic/lexicon/test/doc4.xml","myCity.city":"beijing","myCity.popularity":5,"myCity.date":"1981-11-09","myCity.distance":134.5,"myCity.point":"39.900002,116.4","myTeam.uri2":"/optic/lexicon/test/city4.json","myTeam.cityName":"beijing","myTeam.cityTeam":"ducks","nodes":"ducks"}\u001e{"myCity.uri1":"/optic/lexicon/test/doc5.xml","myCity.city":"cape town","myCity.popularity":3,"myCity.date":"1999-04-22","myCity.distance":377.9,"myCity.point":"-33.91,18.42","myTeam.uri2":"/optic/lexicon/test/city5.json","myTeam.cityName":"cape town","myTeam.cityTeam":"pirates","nodes":"pirates"}\u001e{"myCity.uri1":"/optic/lexicon/test/doc2.json","myCity.city":"new york","myCity.popularity":5,"myCity.date":"2006-06-23","myCity.distance":23.3,"myCity.point":"40.709999,-74.009995","myTeam.uri2":"/optic/lexicon/test/city2.json","myTeam.cityName":"new york","myTeam.cityTeam":"yankee","nodes":"yankee"}\u001e{"myCity.uri1":"/optic/lexicon/test/doc1.json","myCity.city":"london","myCity.popularity":5,"myCity.date":"2007-01-01","myCity.distance":50.4,"myCity.point":"51.5,-0.12","myTeam.uri2":"/optic/lexicon/test/city1.json","myTeam.cityName":"london","myTeam.cityTeam":"arsenal","nodes":"arsenal"}');
      expect(count).to.equal(6);
      done();
    }, done);
  });

  it('TEST 12 - join inner with joinInnerDoc and xpath - with queryAsStream chunked', function(done){
    var count = 0;
    var str = '';
    const chunks = [];
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
      plan1.joinInner(plan2)
      .where(op.eq(op.viewCol('myCity', 'city'), op.col('cityName')))
      .joinDoc(op.col('doc'), op.col('uri2'))
      .select(['uri1', 'city', 'popularity', 'date', 'distance', 'point', op.viewCol('myCity', '__docId'), 'uri2', 'cityName', 'cityTeam', op.viewCol('myTeam', '__docId'), op.as('nodes', op.xpath('doc', '/cityTeam'))])
      .where(op.isDefined(op.col('nodes')))
      .orderBy(op.asc(op.col('date')))
    db.rows.queryAsStream(output, 'chunked', { format: 'json', structure: 'array', columnTypes: 'rows' }) 
    .on('data', function(chunk) {
      //console.log(chunk.toString());
      str = str + chunk.toString().trim().replace(/[\n\r]/g, ' ');
      count++;
    }).
    on('end', function() {
      //console.log(str);
      //console.log(count);
      expect(str).to.equal('[ [{"name":"myCity.uri1"},{"name":"myCity.city"},{"name":"myCity.popularity"},{"name":"myCity.date"},{"name":"myCity.distance"},{"name":"myCity.point"},{"name":"myTeam.uri2"},{"name":"myTeam.cityName"},{"name":"myTeam.cityTeam"},{"name":"nodes"}], [{"type":"xs:string","value":"/optic/lexicon/test/doc3.json"},{"type":"xs:string","value":"new jersey"},{"type":"xs:integer","value":2},{"type":"xs:date","value":"1971-12-23"},{"type":"xs:double","value":12.9},{"type":"http://marklogic.com/cts#point","value":"40.720001,-74.07"},{"type":"xs:string","value":"/optic/lexicon/test/city3.json"},{"type":"xs:string","value":"new jersey"},{"type":"xs:string","value":"nets"},{"type":"text","value":"nets"}], [{"type":"xs:string","value":"/optic/lexicon/test/doc4.xml"},{"type":"xs:string","value":"beijing"},{"type":"xs:integer","value":5},{"type":"xs:date","value":"1981-11-09"},{"type":"xs:double","value":134.5},{"type":"http://marklogic.com/cts#point","value":"39.900002,116.4"},{"type":"xs:string","value":"/optic/lexicon/test/city4.json"},{"type":"xs:string","value":"beijing"},{"type":"xs:string","value":"ducks"},{"type":"text","value":"ducks"}], [{"type":"xs:string","value":"/optic/lexicon/test/doc5.xml"},{"type":"xs:string","value":"cape town"},{"type":"xs:integer","value":3},{"type":"xs:date","value":"1999-04-22"},{"type":"xs:double","value":377.9},{"type":"http://marklogic.com/cts#point","value":"-33.91,18.42"},{"type":"xs:string","value":"/optic/lexicon/test/city5.json"},{"type":"xs:string","value":"cape town"},{"type":"xs:string","value":"pirates"},{"type":"text","value":"pirates"}], [{"type":"xs:string","value":"/optic/lexicon/test/doc2.json"},{"type":"xs:string","value":"new york"},{"type":"xs:integer","value":5},{"type":"xs:date","value":"2006-06-23"},{"type":"xs:double","value":23.3},{"type":"http://marklogic.com/cts#point","value":"40.709999,-74.009995"},{"type":"xs:string","value":"/optic/lexicon/test/city2.json"},{"type":"xs:string","value":"new york"},{"type":"xs:string","value":"yankee"},{"type":"text","value":"yankee"}], [{"type":"xs:string","value":"/optic/lexicon/test/doc1.json"},{"type":"xs:string","value":"london"},{"type":"xs:integer","value":5},{"type":"xs:date","value":"2007-01-01"},{"type":"xs:double","value":50.4},{"type":"http://marklogic.com/cts#point","value":"51.5,-0.12"},{"type":"xs:string","value":"/optic/lexicon/test/city1.json"},{"type":"xs:string","value":"london"},{"type":"xs:string","value":"arsenal"},{"type":"text","value":"arsenal"}] ]');
      expect(count).to.equal(1);
      done();
    }, done);
  });

  /*it('TEST 21 - joinInner with default offsetLimit', function(done){
    var src =  
      `const op = require('/MarkLogic/optic');
      const popCol = op.col('popularity');
      const dateCol = op.col('date');
      const arr = [];
      const len = 150;
      for (var i = 1; i <= len; i++) {
        arr.push({
          rowId: i,
          popularity: 5,
          desc: 'item'
        });
      }
      const plan1 =
        op.fromLexicons(
          {
            uri: cts.uriReference(),
            city: cts.jsonPropertyReference('city'),
            popularity: cts.jsonPropertyReference('popularity'),
            date: cts.jsonPropertyReference('date'),
            distance: cts.jsonPropertyReference('distance'),
            point: cts.jsonPropertyReference('latLonPoint')
          }, 'myCity'
        );
      const plan2 = op.fromLiterals(arr);
      const output =
        plan1
        .joinInner(plan2)
        .result();
      output;`

    db.eval(src)
    .result(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(750);
      expect(output[0].value.rowId).to.exist;
      done();
    }, done);
  });

  it('TEST 22 - joinInner with non-default offsetLimit', function(done){
    var src =  
      `const op = require('/MarkLogic/optic');
      const popCol = op.col('popularity');
      const dateCol = op.col('date');
      const arr = [];
      const len = 150;
      for (var i = 1; i <= len; i++) {
        arr.push({
          rowId: i,
          popularity: 5,
          desc: 'item'
        });
      }
      const plan1 =
        op.fromLexicons(
          {
            uri: cts.uriReference(),
            city: cts.jsonPropertyReference('city'),
            popularity: cts.jsonPropertyReference('popularity'),
            date: cts.jsonPropertyReference('date'),
            distance: cts.jsonPropertyReference('distance'),
            point: cts.jsonPropertyReference('latLonPoint')
          }, 'myCity'
        );
      const plan2 = op.fromLiterals(arr);
      const output =
        plan1
        .joinInner(plan2)
        .offsetLimit(0, 150)
        .result();
      output;`

    db.eval(src)
    .result(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(150);
      expect(output[0].value.rowId).to.exist;
      done();
    }, done);
  });

  it('TEST 23 - joinInner then joinInnerDoc with default offsetLimit', function(done){
    var src =  
      `const op = require('/MarkLogic/optic');
      const popCol = op.col('popularity');
      const dateCol = op.col('date');
      const arr = [];
      const len = 150;
      for (var i = 1; i <= len; i++) {
        arr.push({
          rowId: i,
          popularity: 5,
          desc: 'item'
        });
      }
      const plan1 =
        op.fromLexicons(
          {
            uri: cts.uriReference(),
            city: cts.jsonPropertyReference('city'),
            popularity: cts.jsonPropertyReference('popularity'),
            date: cts.jsonPropertyReference('date'),
            distance: cts.jsonPropertyReference('distance'),
            point: cts.jsonPropertyReference('latLonPoint')
          }, 'myCity'
        );
      const plan2 = op.fromLiterals(arr);
      const output =
        plan1
        .joinInner(plan2)
        .joinDoc(op.col('doc'), op.col('uri'))
        .result();
      output;`

    db.eval(src)
    .result(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(750);
      expect(output[0].value.rowId).to.exist;
      expect(output[0].value.doc).to.exist;
      done();
    }, done);
  });

  it('TEST 24 - joinInner then joinInnerDoc with non-default offsetLimit', function(done){
    var src =  
      `const op = require('/MarkLogic/optic');
      const popCol = op.col('popularity');
      const dateCol = op.col('date');
      const arr = [];
      const len = 150;
      for (var i = 1; i <= len; i++) {
        arr.push({
          rowId: i,
          popularity: 5,
          desc: 'item'
        });
      }
      const plan1 =
        op.fromLexicons(
          {
            uri: cts.uriReference(),
            city: cts.jsonPropertyReference('city'),
            popularity: cts.jsonPropertyReference('popularity'),
            date: cts.jsonPropertyReference('date'),
            distance: cts.jsonPropertyReference('distance'),
            point: cts.jsonPropertyReference('latLonPoint')
          }, 'myCity'
        );
      const plan2 = op.fromLiterals(arr);
      const output =
        plan1
        .joinInner(plan2)
        .offsetLimit(0, 150)
        .joinDoc(op.col('doc'), op.col('uri'))
        .result();
      output;`

    db.eval(src)
    .result(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(150);
      expect(output[0].value.rowId).to.exist;
      expect(output[0].value.doc).to.exist;
      done();
    }, done);
  });

  it('TEST 25 - joinInner with joinInnerDoc bug39366', function(done){
    var src =  
      `const op = require('/MarkLogic/optic');
      const popCol = op.col('popularity');
      const dateCol = op.col('date');
      const arr = [];
      const len = 150;
      for (var i = 1; i <= len; i++) {
        arr.push({
          rowId: i,
          popularity: 5,
          desc: 'item'
        });
      }
      const plan1 =
        op.fromLexicons(
          {
            uri: cts.uriReference(),
            city: cts.jsonPropertyReference('city'),
            popularity: cts.jsonPropertyReference('popularity'),
            date: cts.jsonPropertyReference('date'),
            distance: cts.jsonPropertyReference('distance'),
            point: cts.jsonPropertyReference('latLonPoint')
          }, 'myCity'
        );
      const plan2 = op.fromLiterals(arr);
      const output =
        plan1
        .joinInner(plan2)
        .joinDoc(op.col('doc'), op.col('uri'))
        .select(['city', 'uri', 'rowId', 'doc'])
        .orderBy(['rowId', 'city'])
        .offsetLimit(0, 25)
        .result();
      output;`

    db.eval(src)
    .result(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(25);
      expect(output[0].value.doc).to.exist;
      expect(output[24].value.doc).to.exist;
      done();
    }, done);
  });

  it('TEST 26 - join inner with groupBy', function(done){
    var src =  
      `const op = require('/MarkLogic/optic');
      const plan1 = 
        op.fromLexicons(
          {
            uri1: cts.uriReference(),
            city: cts.jsonPropertyReference('city'),
            popularity: cts.jsonPropertyReference('popularity'),
            date: cts.jsonPropertyReference('date'),
            distance: cts.jsonPropertyReference('distance'),
            point: cts.jsonPropertyReference('latLonPoint')
          }, 'myCity'
        );
      const plan2 = 
        op.fromLexicons(
          {
            uri2: cts.uriReference(),
            cityName: cts.jsonPropertyReference('cityName'),
            cityTeam: cts.jsonPropertyReference('cityTeam')
          }, 'myTeam'
        );
      const output =
        plan1.joinInner(plan2)
        .where(op.eq(op.viewCol('myCity', 'city'), op.col('cityName')))
        .groupBy(op.viewCol('myCity', 'popularity'), op.sum('DistanceSum', op.viewCol('myCity', 'distance')))
        .orderBy(op.asc(op.col('DistanceSum')))
        .result();
      output;`
    db.eval(src)
    .result(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(3);
      expect(output[0].value['myCity.popularity']).to.equal(2);
      expect(output[0].value.DistanceSum).to.equal(12.9);
      expect(output[2].value['myCity.popularity']).to.equal(3);
      expect(output[2].value.DistanceSum).to.equal(377.9);
      done();
    }, done);
  });

  it('TEST 27 - import from doc plan', function(done){
    var src =  
      `const op = require('/MarkLogic/optic');
      const importedPlan = op.import(cts.doc('/optic/plan/test/planLexicons.json').root);
      const output = importedPlan.result();
      output;`
    db.eval(src)
    .result(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(5);
      expect(output[0].value['myCity.city']).to.equal('new jersey');
      expect(output[0].value['myCity.date']).to.equal('1971-12-23');
      expect(output[0].value['myTeam.cityName']).to.equal('new jersey');
      expect(output[0].value['myTeam.cityTeam']).to.equal('nets');
      expect(output[0].value['myTeam.uri2']).to.equal('/optic/lexicon/test/city3.json');
      expect(output[0].value['myCity.__docid']).to.not.exist;
      expect(output[0].value['myTeam.__docid']).to.not.exist;
      expect(output[0].value['myCity.fragId1']).to.not.exist;
      expect(output[0].value['myTeam.fragId2']).to.not.exist;
      expect(output[4].value['myCity.city']).to.equal('london');
      expect(output[4].value['myCity.date']).to.equal('2007-01-01');
      expect(output[4].value['myTeam.cityName']).to.equal('london');
      expect(output[4].value['myTeam.cityTeam']).to.equal('arsenal');
      expect(output[4].value['myTeam.uri2']).to.equal('/optic/lexicon/test/city1.json');
      expect(output[4].value['myCity.__docid']).to.not.exist;
      expect(output[4].value['myTeam.__docid']).to.not.exist;
      done();
    }, done);
  });

  it('TEST 28 - join doc uri with fragment id', function(done){
    var src =  
      `const op = require('/MarkLogic/optic');
      const plan1 = 
        op.fromLexicons(
          {
            uri1: cts.uriReference(),
            city: cts.jsonPropertyReference('city'),
            popularity: cts.jsonPropertyReference('popularity'),
            date: cts.jsonPropertyReference('date'),
            distance: cts.jsonPropertyReference('distance'),
            point: cts.jsonPropertyReference('latLonPoint')
          }, 'myCity', op.fragmentIdCol('fragId1')
        );
      const plan2 = 
        op.fromLexicons(
          {
            uri2: cts.uriReference(),
            cityName: cts.jsonPropertyReference('cityName'),
            cityTeam: cts.jsonPropertyReference('cityTeam')
          }, 'myTeam', op.fragmentIdCol('fragId2')
        );
      const output =
        plan1.joinInner(plan2)
        .where(op.eq(op.viewCol('myCity', 'city'), op.col('cityName')))
        .joinDocUri(op.col('doc'), op.fragmentIdCol('fragId1'))
        .orderBy(op.asc(op.col('date')))
        .result();
      output;`
    db.eval(src)
    .result(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(5);
      expect(output[0].value['myCity.city']).to.equal('new jersey');
      expect(output[0].value['myCity.date']).to.equal('1971-12-23');
      expect(output[0].value['myTeam.cityName']).to.equal('new jersey');
      expect(output[0].value['myTeam.cityTeam']).to.equal('nets');
      expect(output[0].value['myTeam.uri2']).to.equal('/optic/lexicon/test/city3.json');
      expect(output[0].value['myCity.__docid']).to.not.exist;
      expect(output[0].value['myTeam.__docid']).to.not.exist;
      expect(output[0].value['myCity.fragId1']).to.not.exist;
      expect(output[0].value['myTeam.fragId2']).to.not.exist;
      expect(output[0].value['__fragId1_MLDOC_ID']).to.not.exist;
      expect(output[4].value['myCity.city']).to.equal('london');
      expect(output[4].value['myCity.date']).to.equal('2007-01-01');
      expect(output[4].value['myTeam.cityName']).to.equal('london');
      expect(output[4].value['myTeam.cityTeam']).to.equal('arsenal');
      expect(output[4].value['myTeam.uri2']).to.equal('/optic/lexicon/test/city1.json');
      expect(output[4].value['myCity.__docid']).to.not.exist;
      expect(output[4].value['myTeam.__docid']).to.not.exist;
      done();
    }, done);
  });

  it('TEST 29 - join doc with fragment id1', function(done){
    var src =  
      `const op = require('/MarkLogic/optic');
      const plan1 = 
        op.fromLexicons(
          {
            uri1: cts.uriReference(),
            city: cts.jsonPropertyReference('city'),
            popularity: cts.jsonPropertyReference('popularity'),
            date: cts.jsonPropertyReference('date'),
            distance: cts.jsonPropertyReference('distance'),
            point: cts.jsonPropertyReference('latLonPoint')
          }, 'myCity', op.fragmentIdCol('fragId1')
        );
      const plan2 = 
        op.fromLexicons(
          {
            uri2: cts.uriReference(),
            cityName: cts.jsonPropertyReference('cityName'),
            cityTeam: cts.jsonPropertyReference('cityTeam')
          }, 'myTeam', op.fragmentIdCol('fragId2')
        );
      const output =
        plan1.joinInner(plan2)
        .where(op.eq(op.viewCol('myCity', 'city'), op.col('cityName')))
        .joinDoc(op.col('doc'), op.fragmentIdCol('fragId1'))
        .orderBy(op.asc(op.col('date')))
        .result();
      output;`
    db.eval(src)
    .result(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(5);
      expect(output[0].value['myCity.city']).to.equal('new jersey');
      expect(output[0].value['myCity.date']).to.equal('1971-12-23');
      expect(output[0].value['myTeam.cityName']).to.equal('new jersey');
      expect(output[0].value['myTeam.cityTeam']).to.equal('nets');
      expect(output[0].value['myTeam.uri2']).to.equal('/optic/lexicon/test/city3.json');
      expect(output[0].value['myCity.__docid']).to.not.exist;
      expect(output[0].value['myTeam.__docid']).to.not.exist;
      expect(output[0].value['myCity.fragId1']).to.not.exist;
      expect(output[0].value['myTeam.fragId2']).to.not.exist;
      expect(output[0].value.doc.city).to.equal('new jersey');
      expect(output[0].value.doc.distance).to.equal(12.9);
      expect(output[0].value.doc.location.latLonPair.lat).to.equal(40.72);
      expect(output[4].value['myCity.city']).to.equal('london');
      expect(output[4].value['myCity.date']).to.equal('2007-01-01');
      expect(output[4].value['myTeam.cityName']).to.equal('london');
      expect(output[4].value['myTeam.cityTeam']).to.equal('arsenal');
      expect(output[4].value['myTeam.uri2']).to.equal('/optic/lexicon/test/city1.json');
      expect(output[4].value['myCity.__docid']).to.not.exist;
      expect(output[4].value['myTeam.__docid']).to.not.exist;
      expect(output[4].value.doc.city).to.equal('london');
      expect(output[4].value.doc.distance).to.equal(50.4);
      expect(output[4].value.doc.location.latLonPair.lat).to.equal(51.5);
      done();
    }, done);
  });

  it('TEST 30 - join doc with fragment id2', function(done){
    var src =  
      `const op = require('/MarkLogic/optic');
      const plan1 = 
        op.fromLexicons(
          {
            uri1: cts.uriReference(),
            city: cts.jsonPropertyReference('city'),
            popularity: cts.jsonPropertyReference('popularity'),
            date: cts.jsonPropertyReference('date'),
            distance: cts.jsonPropertyReference('distance'),
            point: cts.jsonPropertyReference('latLonPoint')
          }, 'myCity', op.fragmentIdCol('fragId1')
        );
      const plan2 = 
        op.fromLexicons(
          {
            uri2: cts.uriReference(),
            cityName: cts.jsonPropertyReference('cityName'),
            cityTeam: cts.jsonPropertyReference('cityTeam')
          }, 'myTeam', op.fragmentIdCol('fragId2')
        );
      const output =
        plan1.joinInner(plan2)
        .where(op.eq(op.viewCol('myCity', 'city'), op.col('cityName')))
        .joinDoc(op.col('doc'), op.fragmentIdCol('fragId2'))
        .orderBy(op.asc(op.col('date')))
        .result();
      output;`
    db.eval(src)
    .result(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(5);
      expect(output[0].value['myCity.city']).to.equal('new jersey');
      expect(output[0].value['myCity.date']).to.equal('1971-12-23');
      expect(output[0].value['myTeam.cityName']).to.equal('new jersey');
      expect(output[0].value['myTeam.cityTeam']).to.equal('nets');
      expect(output[0].value['myTeam.uri2']).to.equal('/optic/lexicon/test/city3.json');
      expect(output[0].value['myCity.__docid']).to.not.exist;
      expect(output[0].value['myTeam.__docid']).to.not.exist;
      expect(output[0].value['myCity.fragId1']).to.not.exist;
      expect(output[0].value['myTeam.fragId2']).to.not.exist;
      expect(output[0].value.doc.cityName).to.equal('new jersey');
      expect(output[0].value.doc.cityTeam).to.equal('nets');
      expect(output[4].value['myCity.city']).to.equal('london');
      expect(output[4].value['myCity.date']).to.equal('2007-01-01');
      expect(output[4].value['myTeam.cityName']).to.equal('london');
      expect(output[4].value['myTeam.cityTeam']).to.equal('arsenal');
      expect(output[4].value['myTeam.uri2']).to.equal('/optic/lexicon/test/city1.json');
      expect(output[4].value['myCity.__docid']).to.not.exist;
      expect(output[4].value['myTeam.__docid']).to.not.exist;
      expect(output[4].value.doc.cityName).to.equal('london');
      expect(output[4].value.doc.cityTeam).to.equal('arsenal');
      done();
    }, done);
  });

  it('TEST 31 - conditional from join doc', function(done){
    var src =  
      `const op = require('/MarkLogic/optic');
      const plan1 = 
        op.fromLexicons(
          {
            uri1: cts.uriReference(),
            city: cts.jsonPropertyReference('city'),
            popularity: cts.jsonPropertyReference('popularity'),
            date: cts.jsonPropertyReference('date'),
            distance: cts.jsonPropertyReference('distance'),
            point: cts.jsonPropertyReference('latLonPoint')
          }, 'myCity', op.fragmentIdCol('fragId1')
        );
      const plan2 = 
        op.fromLexicons(
          {
            uri2: cts.uriReference(),
            cityName: cts.jsonPropertyReference('cityName'),
            cityTeam: cts.jsonPropertyReference('cityTeam')
          }, 'myTeam', op.fragmentIdCol('fragId2')
        );
      const output =
        plan1.joinInner(plan2)
        .joinDoc(op.col('doc'), op.fragmentIdCol('fragId2'))
        .select(['uri1', 'city', 'popularity', 'date', 'distance', 'point', op.as('nodes', op.xpath('doc', '//cityName')), 'uri2', 'cityName', 'cityTeam'])
        .where(op.eq(op.viewCol('myCity', 'city'), op.sql.collatedString(op.col('nodes'), 'http://marklogic.com/collation/')))
        .orderBy(op.col('uri1'))
        .result();
      output;`
    db.eval(src)
    .result(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(5);
      expect(output[0].value['myCity.city']).to.equal('london');
      expect(output[0].value['myTeam.cityName']).to.equal('london');
      expect(output[0].value['myTeam.cityTeam']).to.equal('arsenal');
      expect(output[0].value.nodes).to.equal('london');
      expect(output[4].value['myCity.city']).to.equal('cape town');
      expect(output[4].value['myTeam.cityName']).to.equal('cape town');
      expect(output[4].value['myTeam.cityTeam']).to.equal('pirates');
      expect(output[4].value.nodes).to.equal('cape town');
      done();
    }, done);
  });

  it('TEST 32 - sql condition', function(done){
    var src =  
      `const op = require('/MarkLogic/optic');
      const plan1 = 
        op.fromLexicons(
          {
            uri1: cts.uriReference(),
            city: cts.jsonPropertyReference('city'),
            popularity: cts.jsonPropertyReference('popularity'),
            date: cts.jsonPropertyReference('date'),
            distance: cts.jsonPropertyReference('distance'),
            point: cts.jsonPropertyReference('latLonPoint')
          }, 'myCity'
        );
      const plan2 = 
        op.fromLexicons(
          {
            uri2: cts.uriReference(),
            cityName: cts.jsonPropertyReference('cityName'),
            cityTeam: cts.jsonPropertyReference('cityTeam')
          }, 'myTeam'
        );
      const output =
        plan1.joinInner(plan2)
        .where(op.sqlCondition('myCity.city = cityName'))
        .orderBy(op.asc(op.col('date')))
        .result();
      output;`
    db.eval(src)
    .result(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(5);
      expect(output[0].value['myCity.city']).to.equal('new jersey');
      expect(output[0].value['myCity.date']).to.equal('1971-12-23');
      expect(output[0].value['myTeam.cityName']).to.equal('new jersey');
      expect(output[0].value['myTeam.cityTeam']).to.equal('nets');
      expect(output[0].value['myTeam.uri2']).to.equal('/optic/lexicon/test/city3.json');
      expect(output[0].value['myCity.__docid']).to.not.exist;
      expect(output[0].value['myTeam.__docid']).to.not.exist;
      expect(output[4].value['myCity.city']).to.equal('london');
      expect(output[4].value['myCity.date']).to.equal('2007-01-01');
      expect(output[4].value['myTeam.cityName']).to.equal('london');
      expect(output[4].value['myTeam.cityTeam']).to.equal('arsenal');
      expect(output[4].value['myTeam.uri2']).to.equal('/optic/lexicon/test/city1.json');
      expect(output[4].value['myCity.__docid']).to.not.exist;
      expect(output[4].value['myTeam.__docid']).to.not.exist;
      done();
    }, done);
  });

  it('TEST 32 - sql condition with between and AND operator', function(done){
    var src =  
      `const op = require('/MarkLogic/optic');
      const plan1 = 
        op.fromLexicons(
          {
            uri1: cts.uriReference(),
            city: cts.jsonPropertyReference('city'),
            popularity: cts.jsonPropertyReference('popularity'),
            date: cts.jsonPropertyReference('date'),
            distance: cts.jsonPropertyReference('distance'),
            point: cts.jsonPropertyReference('latLonPoint')
          }, 'myCity'
        );
      const plan2 = 
        op.fromLexicons(
          {
            uri2: cts.uriReference(),
            cityName: cts.jsonPropertyReference('cityName'),
            cityTeam: cts.jsonPropertyReference('cityTeam')
          }, 'myTeam'
        );
      const output =
        plan1.joinInner(plan2)
        .where(op.sqlCondition('(myCity.popularity BETWEEN 2 AND 4) AND (city = cityName)'))
        .orderBy(op.asc(op.col('date')))
        .result();
      output;`
    db.eval(src)
    .result(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(2);
      expect(output[0].value['myCity.city']).to.equal('new jersey');
      expect(output[0].value['myCity.popularity']).to.equal(2);
      expect(output[1].value['myCity.city']).to.equal('cape town');
      expect(output[1].value['myCity.popularity']).to.equal(3);
      done();
    }, done);
  });

  it('TEST 33 - sql condition with in and multiple where', function(done){
    var src =  
      `const op = require('/MarkLogic/optic');
      const plan1 = 
        op.fromLexicons(
          {
            uri1: cts.uriReference(),
            city: cts.jsonPropertyReference('city'),
            popularity: cts.jsonPropertyReference('popularity'),
            date: cts.jsonPropertyReference('date'),
            distance: cts.jsonPropertyReference('distance'),
            point: cts.jsonPropertyReference('latLonPoint')
          }, 'myCity'
        );
      const plan2 = 
        op.fromLexicons(
          {
            uri2: cts.uriReference(),
            cityName: cts.jsonPropertyReference('cityName'),
            cityTeam: cts.jsonPropertyReference('cityTeam')
          }, 'myTeam'
        );
      const output =
        plan1.joinInner(plan2)
        .where(op.sqlCondition('city = cityName'))
        .where(op.sqlCondition("popularity IN (2, 3)"))
        .orderBy(op.asc(op.col('date')))
        .result();
      output;`
    db.eval(src)
    .result(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(2);
      expect(output[0].value['myCity.city']).to.equal('new jersey');
      expect(output[0].value['myCity.popularity']).to.equal(2);
      expect(output[1].value['myCity.city']).to.equal('cape town');
      expect(output[1].value['myCity.popularity']).to.equal(3);
      done();
    }, done);
  });

  it('TEST 34 - restricted xpath with unanamed nodes', function(done){
    var src =  
      `const op = require('/MarkLogic/optic');
      const plan1 = 
        op.fromLexicons(
          {
            uri1: cts.uriReference(),
            city: cts.jsonPropertyReference('city'),
            popularity: cts.jsonPropertyReference('popularity'),
            date: cts.jsonPropertyReference('date'),
            distance: cts.jsonPropertyReference('distance'),
            point: cts.jsonPropertyReference('latLonPoint')
          }, 'myCity'
        );
      const plan2 = 
        op.fromLexicons(
          {
            uri2: cts.uriReference(),
            cityName: cts.jsonPropertyReference('cityName'),
            cityTeam: cts.jsonPropertyReference('cityTeam')
          }, 'myTeam'
        );
      const output =
        plan1.joinInner(plan2, 
          op.on(op.viewCol('myCity', 'city'), op.viewCol('myTeam', 'cityName')),
          op.ne(op.col('popularity'), 3)
        )
        .joinDoc(op.col('doc'), op.col('uri1'))
        .select(['uri1', 'city', 'popularity', 'date', 'distance', 'point', op.as('nodes', op.fn.number(op.xpath('doc', "/node('location')/object-node('latLonPair')/number-node()[1]"))), 'uri2', 'cityName', 'cityTeam'])
        .where(op.ge(op.col('nodes'), 0))
        .orderBy(op.desc(op.col('distance')))
        .result();
      output;`
    db.eval(src)
    .result(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(3);
      expect(output[0].value['myCity.city']).to.equal('london');
      expect(output[0].value.nodes).to.equal(51.5);
      expect(output[2].value['myCity.city']).to.equal('new jersey');
      expect(output[2].value.nodes).to.equal(40.72);
      done();
    }, done);
  });

  it('TEST 35 - restricted xpath with predicate fn:matches', function(done){
    var src =  
      `const op = require('/MarkLogic/optic');
      const plan1 = 
        op.fromLexicons(
          {
            uri1: cts.uriReference(),
            city: cts.jsonPropertyReference('city'),
            popularity: cts.jsonPropertyReference('popularity'),
            date: cts.jsonPropertyReference('date'),
            distance: cts.jsonPropertyReference('distance'),
            point: cts.jsonPropertyReference('latLonPoint')
          }, 'myCity'
        );
      const plan2 = 
        op.fromLexicons(
          {
            uri2: cts.uriReference(),
            cityName: cts.jsonPropertyReference('cityName'),
            cityTeam: cts.jsonPropertyReference('cityTeam')
          }, 'myTeam'
        );
      const output =
        plan1.joinInner(plan2, 
          op.on(op.viewCol('myCity', 'city'), op.viewCol('myTeam', 'cityName')),
          op.ne(op.col('popularity'), 3)
        )
        .joinDoc(op.col('doc'), op.col('uri1'))
        .select(['uri1', 'city', 'popularity', 'date', 'distance', 'point', op.as('nodes', op.xpath('doc', "/description[fn:matches(., 'disc*')]")), 'uri2', 'cityName', 'cityTeam'])
        .where(op.isDefined(op.col('nodes')))
        .orderBy(op.desc(op.col('distance')))
        .result();
      output;`
    db.eval(src)
    .result(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(1);
      expect(output[0].value['myCity.city']).to.equal('london');
      expect(output[0].value.nodes).to.equal('Two recent discoveries indicate probable very early settlements near the Thames');
      done();
    }, done);
  });

  it('TEST 36 - restricted xpath with predicate fn:starts-with', function(done){
    var src =  
      `const op = require('/MarkLogic/optic');
      const plan1 = 
        op.fromLexicons(
          {
            uri1: cts.uriReference(),
            city: cts.jsonPropertyReference('city'),
            popularity: cts.jsonPropertyReference('popularity'),
            date: cts.jsonPropertyReference('date'),
            distance: cts.jsonPropertyReference('distance'),
            point: cts.jsonPropertyReference('latLonPoint')
          }, 'myCity'
        );
      const plan2 = 
        op.fromLexicons(
          {
            uri2: cts.uriReference(),
            cityName: cts.jsonPropertyReference('cityName'),
            cityTeam: cts.jsonPropertyReference('cityTeam')
          }, 'myTeam'
        );
      const output =
        plan1.joinInner(plan2, 
          op.on(op.viewCol('myCity', 'city'), op.viewCol('myTeam', 'cityName')),
          op.ne(op.col('popularity'), 3)
        )
        .joinDoc(op.col('doc'), op.col('uri1'))
        .select(['uri1', 'city', 'popularity', 'date', 'distance', 'point', op.as('nodes', op.xpath('doc', "/city[fn:starts-with(., 'new')]")), 'uri2', 'cityName', 'cityTeam'])
        .where(op.isDefined(op.col('nodes')))
        .orderBy(op.desc(op.col('distance')))
        .result();
      output;`
    db.eval(src)
    .result(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(2);
      expect(output[0].value['myCity.city']).to.equal('new york');
      expect(output[1].value['myCity.city']).to.equal('new jersey');
      done();
    }, done);
  });

  it('TEST 37 - restricted xpath with predicate fn:exists', function(done){
    var src =  
      `const op = require('/MarkLogic/optic');
      const plan1 = 
        op.fromLexicons(
          {
            uri1: cts.uriReference(),
            city: cts.jsonPropertyReference('city'),
            popularity: cts.jsonPropertyReference('popularity'),
            date: cts.jsonPropertyReference('date'),
            distance: cts.jsonPropertyReference('distance'),
            point: cts.jsonPropertyReference('latLonPoint')
          }, 'myCity'
        );
      const plan2 = 
        op.fromLexicons(
          {
            uri2: cts.uriReference(),
            cityName: cts.jsonPropertyReference('cityName'),
            cityTeam: cts.jsonPropertyReference('cityTeam')
          }, 'myTeam'
        );
      const output =
        plan1.joinInner(plan2, 
          op.on(op.viewCol('myCity', 'city'), op.viewCol('myTeam', 'cityName')),
          op.ne(op.col('popularity'), 3)
        )
        .joinDoc(op.col('doc'), op.col('uri1'))
        .select(['uri1', 'city', 'popularity', 'date', 'distance', 'point', op.as('nodes', op.xpath('doc', "//latLonPair[fn:exists(./lat)]")), 'uri2', 'cityName', 'cityTeam'])
        .where(op.isDefined(op.col('nodes')))
        .orderBy(op.asc(op.col('distance')))
        .result();
      output;`
    db.eval(src)
    .result(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(4);
      expect(output[0].value.nodes.lat).to.equal(40.72);
      expect(output[1].value.nodes.long).to.equal(-74.01);
      done();
    }, done);
  });

  it('TEST 38 - restricted xpath with predicate fn:not, false', function(done){
    var src =  
      `const op = require('/MarkLogic/optic');
      const plan1 = 
        op.fromLexicons(
          {
            uri1: cts.uriReference(),
            city: cts.jsonPropertyReference('city'),
            popularity: cts.jsonPropertyReference('popularity'),
            date: cts.jsonPropertyReference('date'),
            distance: cts.jsonPropertyReference('distance'),
            point: cts.jsonPropertyReference('latLonPoint')
          }, 'myCity'
        );
      const plan2 = 
        op.fromLexicons(
          {
            uri2: cts.uriReference(),
            cityName: cts.jsonPropertyReference('cityName'),
            cityTeam: cts.jsonPropertyReference('cityTeam')
          }, 'myTeam'
        );
      const output =
        plan1.joinInner(plan2, 
          op.on(op.viewCol('myCity', 'city'), op.viewCol('myTeam', 'cityName')),
          op.ne(op.col('popularity'), 3)
        )
        .joinDoc(op.col('doc'), op.col('uri1'))
        .select(['uri1', 'city', 'popularity', 'date', 'distance', 'point', op.as('nodes', op.xpath('doc', "/popularity[fn:not(fn:false())]")), 'uri2', 'cityName', 'cityTeam'])
        .where(op.isDefined(op.col('nodes')))
        .orderBy(op.desc(op.col('distance')))
        .result();
      output;`
    db.eval(src)
    .result(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(3);
      done();
    }, done);
  });

  it('TEST 39 - restricted xpath with predicate fn:round', function(done){
    var src =  
      `const op = require('/MarkLogic/optic');
      const plan1 = 
        op.fromLexicons(
          {
            uri1: cts.uriReference(),
            city: cts.jsonPropertyReference('city'),
            popularity: cts.jsonPropertyReference('popularity'),
            date: cts.jsonPropertyReference('date'),
            distance: cts.jsonPropertyReference('distance'),
            point: cts.jsonPropertyReference('latLonPoint')
          }, 'myCity'
        );
      const plan2 = 
        op.fromLexicons(
          {
            uri2: cts.uriReference(),
            cityName: cts.jsonPropertyReference('cityName'),
            cityTeam: cts.jsonPropertyReference('cityTeam')
          }, 'myTeam'
        );
      const output =
        plan1.joinInner(plan2, 
          op.on(op.viewCol('myCity', 'city'), op.viewCol('myTeam', 'cityName')),
          op.ne(op.col('popularity'), 3)
        )
        .joinDoc(op.col('doc'), op.col('uri1'))
        .select(['uri1', 'city', 'popularity', 'date', 'distance', 'point', op.as('nodes', op.xpath('doc', "/distance[fn:round(.) eq 50]")), 'uri2', 'cityName', 'cityTeam'])
        .where(op.isDefined(op.col('nodes')))
        .orderBy(op.desc(op.col('distance')))
        .result();
      output;`
    db.eval(src)
    .result(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(1);
      expect(output[0].value['myCity.distance']).to.equal(50.4);
      done();
    }, done);
  });

  it('TEST 40 - restricted xpath with predicate math:pow', function(done){
    var src =  
      `const op = require('/MarkLogic/optic');
      const plan1 = 
        op.fromLexicons(
          {
            uri1: cts.uriReference(),
            city: cts.jsonPropertyReference('city'),
            popularity: cts.jsonPropertyReference('popularity'),
            date: cts.jsonPropertyReference('date'),
            distance: cts.jsonPropertyReference('distance'),
            point: cts.jsonPropertyReference('latLonPoint')
          }, 'myCity'
        );
      const plan2 = 
        op.fromLexicons(
          {
            uri2: cts.uriReference(),
            cityName: cts.jsonPropertyReference('cityName'),
            cityTeam: cts.jsonPropertyReference('cityTeam')
          }, 'myTeam'
        );
      const output =
        plan1.joinInner(plan2, 
          op.on(op.viewCol('myCity', 'city'), op.viewCol('myTeam', 'cityName')),
          op.ne(op.col('popularity'), 3)
        )
        .joinDoc(op.col('doc'), op.col('uri1'))
        .select(['uri1', 'city', 'popularity', 'date', 'distance', 'point', op.as('nodes', op.xpath('doc', "/popularity[math:pow(., 2) eq 4]")), 'uri2', 'cityName', 'cityTeam'])
        .where(op.isDefined(op.col('nodes')))
        .orderBy(op.desc(op.col('distance')))
        .result();
      output;`
    db.eval(src)
    .result(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(1);
      expect(output[0].value['myCity.city']).to.equal('new jersey');
      done();
    }, done);
  });

  it('TEST 41 - restricted xpath with predicate sql:day', function(done){
    var src =  
      `const op = require('/MarkLogic/optic');
      const plan1 = 
        op.fromLexicons(
          {
            uri1: cts.uriReference(),
            city: cts.jsonPropertyReference('city'),
            popularity: cts.jsonPropertyReference('popularity'),
            date: cts.jsonPropertyReference('date'),
            distance: cts.jsonPropertyReference('distance'),
            point: cts.jsonPropertyReference('latLonPoint')
          }, 'myCity'
        );
      const plan2 = 
        op.fromLexicons(
          {
            uri2: cts.uriReference(),
            cityName: cts.jsonPropertyReference('cityName'),
            cityTeam: cts.jsonPropertyReference('cityTeam')
          }, 'myTeam'
        );
      const output =
        plan1.joinInner(plan2, 
          op.on(op.viewCol('myCity', 'city'), op.viewCol('myTeam', 'cityName')),
          op.ne(op.col('popularity'), 3)
        )
        .joinDoc(op.col('doc'), op.col('uri1'))
        .select(['uri1', 'city', 'popularity', 'date', 'distance', 'point', op.as('nodes', op.xpath('doc', "/date[sql:day(.) lt 23]")), 'uri2', 'cityName', 'cityTeam'])
        .where(op.isDefined(op.col('nodes')))
        .orderBy(op.desc(op.col('distance')))
        .result();
      output;`
    db.eval(src)
    .result(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(1);
      expect(output[0].value['myCity.city']).to.equal('london');
      expect(output[0].value['myCity.date']).to.equal('2007-01-01');
      done();
    }, done);
  });

  it('TEST 41 - restricted xpath with predicate math:trunc', function(done){
    var src =  
      `const op = require('/MarkLogic/optic');
      const plan1 = 
        op.fromLexicons(
          {
            uri1: cts.uriReference(),
            city: cts.jsonPropertyReference('city'),
            popularity: cts.jsonPropertyReference('popularity'),
            date: cts.jsonPropertyReference('date'),
            distance: cts.jsonPropertyReference('distance'),
            point: cts.jsonPropertyReference('latLonPoint')
          }, 'myCity'
        );
      const plan2 = 
        op.fromLexicons(
          {
            uri2: cts.uriReference(),
            cityName: cts.jsonPropertyReference('cityName'),
            cityTeam: cts.jsonPropertyReference('cityTeam')
          }, 'myTeam'
        );
      const output =
        plan1.joinInner(plan2, 
          op.on(op.viewCol('myCity', 'city'), op.viewCol('myTeam', 'cityName')),
          op.ne(op.col('popularity'), 3)
        )
        .joinDoc(op.col('doc'), op.col('uri1'))
        .select(['uri1', 'city', 'popularity', 'date', 'distance', 'point', op.as('nodes', op.xpath('doc', "/location[math:trunc(./latLonPair/lat, 0) eq 51]")), 'uri2', 'cityName', 'cityTeam'])
        .where(op.isDefined(op.col('nodes')))
        .orderBy(op.desc(op.col('distance')))
        .result();
      output;`
    db.eval(src)
    .result(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(1);
      expect(output[0].value['myCity.city']).to.equal('london');
      expect(output[0].value.nodes.latLonPair.lat).to.equal(51.5);
      done();
    }, done);
  });

  it('TEST 42 - restricted xpath with predicate fn:sum', function(done){
    var src =  
      `const op = require('/MarkLogic/optic');
      const plan1 = 
        op.fromLexicons(
          {
            uri1: cts.uriReference(),
            city: cts.jsonPropertyReference('city'),
            popularity: cts.jsonPropertyReference('popularity'),
            date: cts.jsonPropertyReference('date'),
            distance: cts.jsonPropertyReference('distance'),
            point: cts.jsonPropertyReference('latLonPoint')
          }, 'myCity'
        );
      const plan2 = 
        op.fromLexicons(
          {
            uri2: cts.uriReference(),
            cityName: cts.jsonPropertyReference('cityName'),
            cityTeam: cts.jsonPropertyReference('cityTeam')
          }, 'myTeam'
        );
      const output =
        plan1.joinInner(plan2, 
          op.on(op.viewCol('myCity', 'city'), op.viewCol('myTeam', 'cityName')),
          op.ne(op.col('popularity'), 3)
        )
        .joinDoc(op.col('doc'), op.col('uri1'))
        .select(['uri1', 'city', 'popularity', 'date', 'distance', 'point', op.as('nodes', op.xpath('doc', "/location[fn:round(fn:sum((./latLonPair/lat, ./latLonPair/long))) eq 51]")), 'uri2', 'cityName', 'cityTeam'])
        .where(op.isDefined(op.col('nodes')))
        .orderBy(op.desc(op.col('distance')))
        .result();
      output;`
    db.eval(src)
    .result(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(1);
      expect(output[0].value['myCity.city']).to.equal('london');
      expect(output[0].value.nodes.latLonPair.lat).to.equal(51.5);
      done();
    }, done);
  });

  it('TEST 43 - restricted xpath with predicate fn:max', function(done){
    var src =  
      `const op = require('/MarkLogic/optic');
      const plan1 = 
        op.fromLexicons(
          {
            uri1: cts.uriReference(),
            city: cts.jsonPropertyReference('city'),
            popularity: cts.jsonPropertyReference('popularity'),
            date: cts.jsonPropertyReference('date'),
            distance: cts.jsonPropertyReference('distance'),
            point: cts.jsonPropertyReference('latLonPoint')
          }, 'myCity'
        );
      const plan2 = 
        op.fromLexicons(
          {
            uri2: cts.uriReference(),
            cityName: cts.jsonPropertyReference('cityName'),
            cityTeam: cts.jsonPropertyReference('cityTeam')
          }, 'myTeam'
        );
      const output =
        plan1.joinInner(plan2, 
          op.on(op.viewCol('myCity', 'city'), op.viewCol('myTeam', 'cityName')),
          op.ne(op.col('popularity'), 3)
        )
        .joinDoc(op.col('doc'), op.col('uri1'))
        .select(['uri1', 'city', 'popularity', 'date', 'distance', 'point', op.as('nodes', op.xpath('doc', "/location[fn:max((./latLonPair/lat, ./latLonPair/long)) eq 51.5]")), 'uri2', 'cityName', 'cityTeam'])
        .where(op.isDefined(op.col('nodes')))
        .orderBy(op.desc(op.col('distance')))
        .result();
      output;`
    db.eval(src)
    .result(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(1);
      expect(output[0].value['myCity.city']).to.equal('london');
      expect(output[0].value.nodes.latLonPair.lat).to.equal(51.5);
      done();
    }, done);
  });*/
});
