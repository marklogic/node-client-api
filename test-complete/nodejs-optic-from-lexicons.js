/*
* Copyright (c) 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/
'use strict';

const expect = require('chai').expect;
const fs = require('fs');

const marklogic = require('../');

const connectdef = require('../config-optic/connectdef.js');
const testlib = require('../etc/test-lib');

const db = marklogic.createDatabaseClient(connectdef.plan);
const op = marklogic.planBuilder;
let serverConfiguration = {};

describe('Nodejs Optic from lexicons test', function () {
    this.timeout(6000);
    before(function (done) {
        try {
            testlib.findServerConfiguration(serverConfiguration);
            setTimeout(() => {
                done();
            }, 3000);
        } catch (error) {
            done(error);
        }
    });
    it('TEST 1 - access with where orderby select - columnTypes header and data types', function (done) {
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
          .select(['city', 'popularity', 'date', 'distance', 'point']);

        db.rows.query(output, { format: 'json', structure: 'object', columnTypes: 'header' })
            .then(function (output) {
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

    it('TEST 2 - join inner doc', function (done) {
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
          .select(['uri', 'city', 'popularity', 'date', 'distance', 'point', op.as('nodes', op.fn.number(op.xpath('doc', '//latLonPair/lat')))])
          .where(op.isDefined(op.col('nodes')));
        db.rows.query(output, { format: 'json', structure: 'object', columnTypes: 'header' })
            .then(function (output) {
                expect(output.columns[6].name).to.equal('nodes');
                expect(output.columns[6].type).to.equal('xs:double');
                expect(output.rows.length).to.equal(5);
                expect(output.rows[0]['myCity.uri']).to.equal('/optic/lexicon/test/doc1.json');
                expect(output.rows[0]['myCity.popularity']).to.equal(5);
                expect(output.rows[0].nodes).to.equal(51.5);
                expect(output.rows[1]['myCity.uri']).to.equal('/optic/lexicon/test/doc2.json');
                expect(output.rows[1]['myCity.popularity']).to.equal(5);
                expect(output.rows[1].nodes).to.equal(40.71);
                expect(output.rows[4]['myCity.uri']).to.equal('/optic/lexicon/test/doc5.xml');
                expect(output.rows[4]['myCity.popularity']).to.equal(3);
                expect(output.rows[4].nodes).to.equal(-33.91);
                done();
            }, done);
    });

    it('TEST 3 - join inner with keymatch, viewCol, and date sort - structure array, columnTypes rows', function (done) {
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
          .orderBy(op.asc(op.col('date')));
        db.rows.query(output, { format: 'json', structure: 'array', columnTypes: 'rows' })
            .then(function (output) {
                expect(output.length).to.equal(6);
                expect(output[1][1].value).to.equal('new jersey');
                expect(output[1][3].value).to.equal('1971-12-23');
                expect(output[1][5].type).to.equal('http://marklogic.com/cts#point');
                const outputValue = (serverConfiguration.serverVersion >= 11) ? 'POINT(-74.07 40.720001)' : '40.720001,-74.07';
                expect(output[1][5].value).to.equal(outputValue);
                expect(output[1][7].value).to.equal('new jersey');
                expect(output[1][8].value).to.equal('nets');
                expect(output[5][1].value).to.equal('london');
                expect(output[5][3].value).to.equal('2007-01-01');
                done();
            }, done)
            .catch(error => done(error));
    });

    it('TEST 4 - using element reference and null viewname', function (done) {
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
          .orderBy(op.desc('uri2'));
        db.rows.query(output, { format: 'json', structure: 'object', columnTypes: 'header' })
            .then(function (output) {
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

    it('TEST 5 - access without uri reference - with format xml', function (done) {
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
          .orderBy([op.asc('popularity'), op.asc('city')])
          .select(['city', 'popularity', 'date', 'distance', 'point']);
        db.rows.query(output, { format: 'xml', structure: 'object', columnTypes: 'header' })
            .then(function (output) {
                const outputStr = output.toString().trim().replace(/[\n\r]/g, '');
                const outputValue = (serverConfiguration.serverVersion >= 11) ?
                    '<t:table xmlns:t="http://marklogic.com/table"><t:columns><t:column name="myCity.city" type="xs:string"/><t:column name="myCity.popularity" type="xs:integer"/><t:column name="myCity.date" type="xs:date"/><t:column name="myCity.distance" type="xs:double"/><t:column name="myCity.point" type="http://marklogic.com/cts#point"/></t:columns><t:rows><t:row><t:cell name="myCity.city">cape town</t:cell><t:cell name="myCity.popularity">3</t:cell><t:cell name="myCity.date">1999-04-22</t:cell><t:cell name="myCity.distance">377.9</t:cell><t:cell name="myCity.point">POINT(18.42 -33.91)</t:cell></t:row><t:row><t:cell name="myCity.city">beijing</t:cell><t:cell name="myCity.popularity">5</t:cell><t:cell name="myCity.date">1981-11-09</t:cell><t:cell name="myCity.distance">134.5</t:cell><t:cell name="myCity.point">POINT(116.4 39.900002)</t:cell></t:row><t:row><t:cell name="myCity.city">london</t:cell><t:cell name="myCity.popularity">5</t:cell><t:cell name="myCity.date">2007-01-01</t:cell><t:cell name="myCity.distance">50.4</t:cell><t:cell name="myCity.point">POINT(-0.12 51.5)</t:cell></t:row><t:row><t:cell name="myCity.city">new york</t:cell><t:cell name="myCity.popularity">5</t:cell><t:cell name="myCity.date">2006-06-23</t:cell><t:cell name="myCity.distance">23.3</t:cell><t:cell name="myCity.point">POINT(-74.009995 40.709999)</t:cell></t:row></t:rows></t:table>'
                    : '<t:table xmlns:t="http://marklogic.com/table"><t:columns><t:column name="myCity.city" type="xs:string"/><t:column name="myCity.popularity" type="xs:integer"/><t:column name="myCity.date" type="xs:date"/><t:column name="myCity.distance" type="xs:double"/><t:column name="myCity.point" type="http://marklogic.com/cts#point"/></t:columns><t:rows><t:row><t:cell name="myCity.city">cape town</t:cell><t:cell name="myCity.popularity">3</t:cell><t:cell name="myCity.date">1999-04-22</t:cell><t:cell name="myCity.distance">377.9</t:cell><t:cell name="myCity.point">-33.91,18.42</t:cell></t:row><t:row><t:cell name="myCity.city">beijing</t:cell><t:cell name="myCity.popularity">5</t:cell><t:cell name="myCity.date">1981-11-09</t:cell><t:cell name="myCity.distance">134.5</t:cell><t:cell name="myCity.point">39.900002,116.4</t:cell></t:row><t:row><t:cell name="myCity.city">london</t:cell><t:cell name="myCity.popularity">5</t:cell><t:cell name="myCity.date">2007-01-01</t:cell><t:cell name="myCity.distance">50.4</t:cell><t:cell name="myCity.point">51.5,-0.12</t:cell></t:row><t:row><t:cell name="myCity.city">new york</t:cell><t:cell name="myCity.popularity">5</t:cell><t:cell name="myCity.date">2006-06-23</t:cell><t:cell name="myCity.distance">23.3</t:cell><t:cell name="myCity.point">40.709999,-74.009995</t:cell></t:row></t:rows></t:table>';
                expect(outputStr).to.equal(outputValue);
                done();
            }, done)
            .catch(error => done(error));
    });

    it('TEST 6 - join inner with plan accessor column identifier', function (done) {
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
          .orderBy(op.desc('uri2'));
        db.rows.query(output, { format: 'json', structure: 'object', columnTypes: 'header' })
            .then(function (output) {
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

    it('TEST 7 - use result on prepared plan and multiple order by', function (done) {
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
        db.rows.query(preparedPlan, { format: 'json', structure: 'object', columnTypes: 'header' })
            .then(function (output) {
                expect(output.rows.length).to.equal(4);
                done();
            }, done);
    });

    it('TEST 8 - join inner doc without xpath - with format csv', function (done) {
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
          .orderBy(op.asc('uri'));
        db.rows.query(output, { format: 'csv', structure: 'object', columnTypes: 'header' })
            .then(function (output) {
                expect(output).to.contain('myCity.uri,myCity.city,myCity.popularity,myCity.date,myCity.distance,myCity.point,doc');
                const outputValue = (serverConfiguration.serverVersion >= 11) ?
                    '/optic/lexicon/test/doc1.json,london,5,2007-01-01,50.4,POINT(-0.12 51.5),"{""city"":""london"", ""distance"":50.4, ""date"":""2007-01-01"", ""metro"":true, ""description"":""Two recent discoveries indicate probable very early settlements near the Thames"", ""popularity"":5, ""location"":{""latLonPoint"":""51.50, -0.12"", ""latLonPair"":{""lat"":51.5, ""long"":-0.12}, ""latLonParent"":{""latLonChild"":""51.50, -0.12""}}}"' :
                    '/optic/lexicon/test/doc1.json,london,5,2007-01-01,50.4,"51.5,-0.12","{""city"":""london"", ""distance"":50.4, ""date"":""2007-01-01"", ""metro"":true, ""description"":""Two recent discoveries indicate probable very early settlements near the Thames"", ""popularity"":5, ""location"":{""latLonPoint"":""51.50, -0.12"", ""latLonPair"":{""lat"":51.5, ""long"":-0.12}, ""latLonParent"":{""latLonChild"":""51.50, -0.12""}}}"';

                expect(output).to.contain(outputValue);
                done();
            }, done)
            .catch(error => done(error));
    });

    it('TEST 9 - export plan and execute the plan', function (done) {
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
        const exportedPlanStr = JSON.stringify(exportedPlan).trim().replace(/[\n\r]/g, '');
        expect(exportedPlanStr).to.equal('{"$optic":{"ns":"op","fn":"operators","args":[{"ns":"op","fn":"from-lexicons","args":[{"uri1":{"ns":"cts","fn":"uri-reference","args":[]},"city":{"ns":"cts","fn":"json-property-reference","args":["city"]},"popularity":{"ns":"cts","fn":"json-property-reference","args":["popularity"]},"date":{"ns":"cts","fn":"json-property-reference","args":["date"]},"distance":{"ns":"cts","fn":"json-property-reference","args":["distance"]},"point":{"ns":"cts","fn":"json-property-reference","args":["latLonPoint"]}},"myCity",{"ns":"op","fn":"fragment-id-col","args":["fragId1"]}]},{"ns":"op","fn":"join-inner","args":[{"ns":"op","fn":"operators","args":[{"ns":"op","fn":"from-lexicons","args":[{"uri2":{"ns":"cts","fn":"uri-reference","args":[]},"cityName":{"ns":"cts","fn":"json-property-reference","args":["cityName"]},"cityTeam":{"ns":"cts","fn":"json-property-reference","args":["cityTeam"]}},"myTeam",{"ns":"op","fn":"fragment-id-col","args":["fragId2"]}]}]}]},{"ns":"op","fn":"where","args":[{"ns":"op","fn":"eq","args":[{"ns":"op","fn":"view-col","args":["myCity","city"]},{"ns":"op","fn":"col","args":["cityName"]}]}]},{"ns":"op","fn":"order-by","args":[{"ns":"op","fn":"asc","args":[{"ns":"op","fn":"col","args":["date"]}]}]}]}}');
        db.rows.query(exportedPlan, { format: 'json', structure: 'object', columnTypes: 'header' })
            .then(function (output) {
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

    it('TEST 10 - join inner with joinInnerDoc - with queryAsStream', function (done) {
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
          .orderBy(op.asc(op.col('date')));
        db.rows.queryAsStream(output, 'object', { format: 'json', structure: 'object', columnTypes: 'header', complexValues: 'reference' })
            .on('data', function (chunk) {
                chunks.push(chunk.kind.toString());
                count++;
            }).
            on('end', function () {
                expect(chunks.join(' ')).to.equal('columns row row row row row');
                expect(count).to.equal(6);
                done();
            }, done);
    });

    it('TEST 11 - join inner with joinInnerDoc and xpath - with queryAsStream sequence', function (done) {
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
          .where(op.eq(op.col('city'), 'london'))
          .orderBy(op.asc(op.col('date')));
        let isFirstChunk = true;
        db.rows.queryAsStream(output, 'sequence', { format: 'json', structure: 'object', columnTypes: 'header' })
            .on('data', function (chunk) {
                if (isFirstChunk) {
                    isFirstChunk = false;
                } else {
                    str = str + chunk.toString().trim().replace(/[\n\r]/g, ' ');
                }
                count++;
            }).
            on('end', function () {
                // Struggling to convert this to a JSON object for some reason
                // Verify only one object
                expect(str.lastIndexOf('}')).to.equal(str.length - 1);
                // that it is the one we want
                expect(str).to.contain('london');
                // and that it has columns from both views
                expect(str).to.contain('"myCity.city"');
                expect(str).to.contain('"myTeam.cityName"');
                done();
            }, function (error) {
                done(error);
            })
            .on('error', function (error) {
                done(error);
            });
    });

    it('TEST 12 - join inner with joinInnerDoc and xpath - with queryAsStream chunked', function (done) {
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
          .where(op.eq(op.col('city'), 'london'))
          .orderBy(op.asc(op.col('date')));
        db.rows.queryAsStream(output, 'chunked', { format: 'json', structure: 'array', columnTypes: 'rows' })
            .on('data', function (chunk) {
                str = str + chunk.toString().trim().replace(/[\n\r]/g, ' ');
                count++;
            }).
            on('end', function () {
                // Struggling to convert this to a JSON object for some reason
                // that it is the one we want
                expect(str).to.contain('london');
                // and that it has columns from both views
                expect(str).to.contain('"myCity.city"');
                expect(str).to.contain('"myTeam.cityName"');
                done();
            }, done);
    });

    it('TEST 13 - restricted xpath with predicate fn:max', function (done) {
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
          .select(['uri1', 'city', 'popularity', 'date', 'distance', 'point', op.as('nodes', op.xpath('doc', '/location[fn:max((./latLonPair/lat, ./latLonPair/long)) eq 51.5]')), 'uri2', 'cityName', 'cityTeam'])
          .where(op.isDefined(op.col('nodes')))
          .orderBy(op.desc(op.col('distance')));
        db.rows.query(output, { format: 'json', structure: 'object', columnTypes: 'header' })
            .then(function (output) {
                expect(output.rows.length).to.equal(1);
                expect(output.rows[0]['myCity.city']).to.equal('london');
                expect(output.rows[0].nodes.latLonPair.lat).to.equal(51.5);
                done();
            }, done);
    });

    it('TEST 14 - restricted xpath with predicate math:trunc', function (done) {
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
          .select(['uri1', 'city', 'popularity', 'date', 'distance', 'point', op.as('nodes', op.xpath('doc', '/location[math:trunc(./latLonPair/lat, 0) eq 51]')), 'uri2', 'cityName', 'cityTeam'])
          .where(op.isDefined(op.col('nodes')))
          .orderBy(op.desc(op.col('distance')));
        db.rows.query(output)
            .then(function (output) {
                expect(output.rows.length).to.equal(1);
                expect(output.rows[0]['myCity.city'].value).to.equal('london');
                expect(output.rows[0].nodes.value.latLonPair.lat).to.equal(51.5);
                done();
            }, done);
    });

    it('TEST 15 - restricted xpath with predicate sql:day', function (done) {
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
          .select(['uri1', 'city', 'popularity', 'date', 'distance', 'point', op.as('nodes', op.xpath('doc', '/date[sql:day(.) lt 23]')), 'uri2', 'cityName', 'cityTeam'])
          .where(op.isDefined(op.col('nodes')))
          .orderBy(op.desc(op.col('distance')));
        db.rows.query(output, { columnTypes: 'header' })
            .then(function (output) {
                expect(output.rows.length).to.equal(1);
                expect(output.rows[0]['myCity.city']).to.equal('london');
                expect(output.rows[0]['myCity.date']).to.equal('2007-01-01');
                done();
            }, done)
            .catch(error => done(error));
    });

    it('TEST 16 - sql condition with between and AND operator', function (done) {
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
          .where(op.sqlCondition('(myCity.popularity BETWEEN 2 AND 4) AND (city = cityName)'))
          .orderBy(op.asc(op.col('date')));
        db.rows.query(output, { columnTypes: 'header' })
            .then(function (output) {
                expect(output.rows.length).to.equal(2);
                expect(output.rows[0]['myCity.city']).to.equal('new jersey');
                expect(output.rows[0]['myCity.popularity']).to.equal(2);
                expect(output.rows[1]['myCity.city']).to.equal('cape town');
                expect(output.rows[1]['myCity.popularity']).to.equal(3);
                done();
            }, done);
    });

    it('TEST 17 - with named parameters', function (done) {
        const plan1 =
      op.fromLexicons({
          indexes:
        {
            uri1: op.cts.uriReference(),
            city: op.cts.jsonPropertyReference('city'),
            popularity: op.cts.jsonPropertyReference('popularity'),
            date: op.cts.jsonPropertyReference('date'),
            distance: op.cts.jsonPropertyReference('distance'),
            point: op.cts.jsonPropertyReference('latLonPoint')
        }, qualifierName: 'myCity'
      });
        const plan2 =
      op.fromLexicons(
          {
              uri2: op.cts.uriReference(),
              cityName: op.cts.jsonPropertyReference('cityName'),
              cityTeam: op.cts.jsonPropertyReference('cityTeam')
          }, 'myTeam'
      );
        const output =
      plan1.joinInner({
          right: plan2,
          keys: [op.on({ left: op.viewCol('myCity', 'city'), right: op.viewCol({ view: 'myTeam', column: 'cityName' }) })],
          condition: op.ne(op.col('popularity'), 3)
      })
          .joinDoc({ docCol: op.col('doc'), sourceCol: op.col('uri1') })
          .select({ columns: ['uri1', 'city', 'popularity', 'date', 'distance', 'point', op.as('nodes', op.xpath({ column: 'doc', path: '/date[sql:day(.) lt 23]' })), 'uri2', 'cityName', 'cityTeam'] })
          .where(op.isDefined(op.col('nodes')))
          .orderBy(op.desc(op.col('distance')));
        db.rows.query(output, { columnTypes: 'header' })
            .then(function (output) {
                expect(output.rows.length).to.equal(1);
                expect(output.rows[0]['myCity.city']).to.equal('london');
                expect(output.rows[0]['myCity.date']).to.equal('2007-01-01');
                done();
            }, done);
    });
});
