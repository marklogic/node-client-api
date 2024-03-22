/*
 * Copyright (c) 2021 MarkLogic Corporation
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

const dbName = connectdef.name;

// Client to query generated views
const db = marklogic.createDatabaseClient(
    {
        database: dbName,
        host: connectdef.host,
        port: connectdef.port,
        user: 'admin',
        password: 'admin',
        authType: connectdef.authType
    }
);

// Client to query schema database to verify view is stored
// Make sure you have qbvuser user created. See XQuery script nodejs-optic-setup.xml of internal repo (SVN).
var dbModClient = marklogic.createDatabaseClient({
    database: dbName + 'Modules',
    host: connectdef.host,
    port: connectdef.port,
    user: 'qbvuser',
    password: 'qbvuser',
    authType: connectdef.authType
});

// Client to generate views
const dbClient = marklogic.createDatabaseClient(
    {
        database: dbName,
        host: connectdef.host,
        port: connectdef.port,
        user: 'qbvuser',
        password: 'qbvuser',
        authType: connectdef.authType
    }
);

const pb = marklogic.planBuilder;

function waitForViewCreate(wTime) {
    return it('View creation delay', done => {
        setTimeout(() => done(), wTime);

    }).timeout(wTime + 120);
}

describe('Nodejs Optic generate views test', function () {
    it('TEST 1 - join left outer with array of on', function (done) {

        const plan1 =
        pb.fromView('opticFunctionalTest', 'detail')
            .orderBy(pb.schemaCol('opticFunctionalTest', 'detail', 'id'));
        const plan2 =
        pb.fromView('opticFunctionalTest', 'master')
            .orderBy(pb.schemaCol('opticFunctionalTest', 'master', 'id'));
        const output =
        plan1.joinLeftOuter(plan2, [pb.on(pb.viewCol('master', 'id'), pb.viewCol('detail', 'masterId')), pb.on(pb.viewCol('detail', 'name'), pb.viewCol('master', 'name'))])
            .select([
                pb.as('MasterName', pb.schemaCol('opticFunctionalTest', 'master', 'name')),
                pb.schemaCol('opticFunctionalTest', 'master', 'date'),
                pb.as('DetailName', pb.schemaCol('opticFunctionalTest', 'detail', 'name')),
                pb.schemaCol('opticFunctionalTest', 'detail', 'amount'),
                pb.schemaCol('opticFunctionalTest', 'detail', 'color')
            ])
            .orderBy(pb.desc(pb.col('DetailName')));

        const plan = JSON.stringify(output.export());
        dbClient.rows.generateView(plan, 'InnerJoin', 'keymatch')
            .then(function (res) {
                //console.log(JSON.stringify(res, null, 2));
                dbModClient.documents.write({
                    uri: '/qbv-InnerJoin-keymatch.xml',
                    collections: 'http://marklogic.com/xdmp/qbv',
                    contentType: 'application/xml',
                    content: res
                }).
                    result(function (response) {
                        //	console.log(JSON.stringify(response, null, 4));
                    });
                done();
            }, done);
    });

    waitForViewCreate(10000);

    it('TEST 1a - Verify InnerJoin keymatch view', function (done) {
        const qv = pb.fromView('InnerJoin', 'keymatch');

        db.rows.query(qv, { format: 'json', structure: 'object', columnTypes: 'rows' })
            .then(function (output) {
                //console.log(JSON.stringify(output, null, 2));
                expect(output.rows.length).to.equal(6);
	  var row0 = output.rows[0];
	  var row3 = output.rows[3];
	  var row5 = output.rows[5];

                expect(row0['InnerJoin.keymatch.amount'].value).to.equal(60.06);
                expect(row0['InnerJoin.keymatch.color'].value).to.equal('green');

                expect(row3['InnerJoin.keymatch.DetailName'].value).to.equal('Detail 3');
                expect(row5['InnerJoin.keymatch.amount'].value).to.equal(10.01);
                done();
            }, function (error) {
                console.log(JSON.stringify(error, null, 2));
                done();
            });
    });

    //Refer to TEST 3 of optic-query-by-views.js
    it('TEST 2 - sparql group by with min', function (done) {
        const output =
        pb.fromSPARQL('PREFIX demov: <http://demo/verb#> \
          PREFIX vcard: <http://www.w3.org/2006/vcard/ns#> \
          SELECT ?country (MIN (?sales) AS ?min_sales ) \
          FROM </optic/sparql/test/companies.ttl> \
          WHERE { \
            ?company a vcard:Organization . \
            ?company demov:sales ?sales . \
            ?company vcard:hasAddress [ vcard:country-name ?country ] \
          } \
          GROUP BY ?country \
          ORDER BY ASC( ?min_sales ) ?country');

        const plan = JSON.stringify(output.export());
        dbClient.rows.generateView(plan, 'sparql', 'groupmin')
            .then(function (res) {
                //console.log(JSON.stringify(res, null, 2));
                dbModClient.documents.write({
                    uri: '/qbv-sparql-groupmin.xml',
                    collections: 'http://marklogic.com/xdmp/qbv',
                    contentType: 'application/xml',
                    content: res
                }).
                    result(function (response) {
                        //	console.log(JSON.stringify(response, null, 4));
                    });
                done();
            }, done);
    });

    waitForViewCreate(10000);

    it('TEST 2a - Verify sparql groupmin view', function (done) {
        const qv = pb.fromView('sparql', 'groupmin');

        db.rows.query(qv, { format: 'json', structure: 'object', columnTypes: 'rows' })
            .then(function (output) {
                //console.log(JSON.stringify(output, null, 2));
                expect(output.rows.length).to.equal(8);
	  var row0 = output.rows[0];
	  var row7 = output.rows[7];

                expect(row0['sparql.groupmin.country'].value).to.equal('China');
                expect(row0['sparql.groupmin.min_sales'].value).to.equal(8);
                expect(row7['sparql.groupmin.country'].value).to.equal('USA');
                expect(row7['sparql.groupmin.min_sales'].value).to.equal(10000000);
                done();
            }, function (error) {
                console.log(JSON.stringify(error, null, 2));
                done();
            });
    });

    //Refer to TEST 6 of optic-query-by-views.js
    it('TEST 3 - sparql group by with min', function (done) {
        const popCol = pb.col('popularity');
        const dateCol = pb.col('date');
        const plan1 =
        pb.fromLexicons(
            {
                uri: pb.cts.uriReference(),
                city: pb.cts.jsonPropertyReference('city'),
                popularity: pb.cts.jsonPropertyReference('popularity'),
                date: pb.cts.jsonPropertyReference('date'),
                distance: pb.cts.jsonPropertyReference('distance'),
                point: pb.cts.jsonPropertyReference('latLonPoint')
            }, 'myCity'
        );
        const output = plan1
            .where(pb.gt(popCol, 2))
            .orderBy(pb.asc('date'))
            .select(['city', 'popularity', 'date', 'distance', 'point']);

        const plan = JSON.stringify(output.export());
        dbClient.rows.generateView(plan, 'lexicons', 'orderbyselect')
            .then(function (res) {
                //console.log(JSON.stringify(res, null, 2));
                dbModClient.documents.write({
                    uri: '/qbv-lexicons-orderby-select.xml',
                    collections: 'http://marklogic.com/xdmp/qbv',
                    contentType: 'application/xml',
                    content: res
                }).
                    result(function (response) {
                        //	console.log(JSON.stringify(response, null, 4));
                    });
                done();
            }, done);
    });

    waitForViewCreate(10000);

    it('TEST 3a - Verify sparql groupmin view', function (done) {
        const qv = pb.fromView('lexicons', 'orderbyselect');

        db.rows.query(qv, { format: 'json', structure: 'object', columnTypes: 'rows' })
            .then(function (output) {
                //console.log(JSON.stringify(output, null, 2));
                expect(output.rows.length).to.equal(4);
	  var row0 = output.rows[0];
	  var row3 = output.rows[3];

                expect(row0['lexicons.orderbyselect.popularity'].value).to.equal(5);
                expect(row0['lexicons.orderbyselect.date'].value).to.equal('1981-11-09');
                expect(row3['lexicons.orderbyselect.popularity'].value).to.equal(5);
                expect(row3['lexicons.orderbyselect.date'].value).to.equal('2007-01-01');
                done();
            }, function (error) {
                console.log(JSON.stringify(error, null, 2));
                done();
            });
    });
});
