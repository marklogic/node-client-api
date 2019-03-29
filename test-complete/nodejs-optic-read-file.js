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

const planViewsPath = __dirname + '/../config-optic/qa-data/planViews.json';
const planLexiconsPath = __dirname + '/../config-optic/qa-data/planLexicons.json';
const planTriplesPath = __dirname + '/../config-optic/qa-data/planTriples.json';
const planSQLPath = __dirname + '/../config-optic/qa-data/planSQL.json';
const planSPARQLPath = __dirname + '/../config-optic/qa-data/planSPARQL.json';

const planFromViews = fs.readFileSync(planViewsPath, 'utf8');
const planFromLexicons = fs.readFileSync(planLexiconsPath, 'utf8');
const planFromTriples = fs.readFileSync(planTriplesPath, 'utf8');
const planFromSQL = fs.readFileSync(planSQLPath, 'utf8');
const planFromSPARQL = fs.readFileSync(planSPARQLPath, 'utf8');

describe('Nodejs Optic read from file test', function(){

  it('TEST 1 - read plan views from file', function(done){
    db.rows.query(planFromViews, { format: 'json', structure: 'object', columnTypes: 'header', complexValues: 'inline' })
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

  it('TEST 2 - read plan views from file with queryAsStream', function(done){
    let count = 0;
    let str = '';
    const chunks = [];
    db.rows.queryAsStream(planFromViews, 'chunked', { format: 'json', structure: 'object', columnTypes: 'rows', complexValues: 'inline' })
    .on('data', function(chunk) {
      //console.log(chunk.toString());
      str = str + chunk.toString().trim().replace(/[\n\r]/g, ' ');
      count++;
    }).
    on('end', function() {
      //console.log(str);
      expect(str).to.equal('{ "columns": [{"name":"myDetail.id"},{"name":"myMaster.id"},{"name":"myDetail.name"},{"name":"myMaster.name"},{"name":"myDetail.masterId"},{"name":"myMaster.date"},{"name":"myDetail.amount"},{"name":"myDetail.color"}], "rows":[ {"myDetail.id":{"type":"xs:integer","value":1},"myMaster.id":{"type":"xs:integer","value":1},"myDetail.name":{"type":"xs:string","value":"Detail 1"},"myMaster.name":{"type":"xs:string","value":"Master 1"},"myDetail.masterId":{"type":"xs:integer","value":1},"myMaster.date":{"type":"xs:date","value":"2015-12-01"},"myDetail.amount":{"type":"xs:double","value":10.01},"myDetail.color":{"type":"xs:string","value":"blue"}}] }');
      done();
    }, done);
  });

  it('TEST 3 - read plan lexicons from file', function(done){
    db.rows.query(planFromLexicons, { format: 'json', structure: 'object', columnTypes: 'header', complexValues: 'inline' })
    .then(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.rows.length).to.equal(5);
      expect(output.rows[0]['myCity.city']).to.equal('new jersey');
      expect(output.rows[0]['myTeam.cityTeam']).to.equal('nets');
      expect(output.rows[4]['myCity.city']).to.equal('london');
      expect(output.rows[4]['myTeam.cityTeam']).to.equal('arsenal');
      done();
    }, done);
  });

  it('TEST 4 - read plan triples from file', function(done){
    db.rows.query(planFromTriples, { format: 'xml', structure: 'array', columnTypes: 'header', complexValues: 'inline' })
    .then(function(output) {
      //console.log(output);
      const outputStr = output.toString().trim().replace(/[\n\r]/g, '');
      //console.log(outputStr);
      expect(outputStr).to.equal('<t:table xmlns:t="http://marklogic.com/table"><t:columns><t:column name="myPlayer.player_id" type="sem:iri"/><t:column name="myTeam.team_id" type="sem:iri"/><t:column name="myPlayer.player_age" type="xs:integer"/><t:column name="myPlayer.player_name" type="xs:string"/><t:column name="myPlayer.player_team" type="sem:iri"/><t:column name="myTeam.team_name" type="xs:string"/><t:column name="myTeam.team_city" type="xs:string"/></t:columns><t:rows><t:row><t:cell name="myPlayer.player_id">http://marklogic.com/other/bball/id#101</t:cell><t:cell name="myTeam.team_id">http://marklogic.com/mlb/team/id/003</t:cell><t:cell name="myPlayer.player_age">26</t:cell><t:cell name="myPlayer.player_name">Phil Green</t:cell><t:cell name="myPlayer.player_team">http://marklogic.com/mlb/team/id/003</t:cell><t:cell name="myTeam.team_name">Padres</t:cell><t:cell name="myTeam.team_city">San Diego</t:cell></t:row></t:rows></t:table>');
      done();
    }, done);
  });

  it('TEST 5 - read plan sql from file with queryAsStream', function(done){
    let count = 0;
    let str = '';
    const chunks = [];
    db.rows.queryAsStream(planFromSQL, 'chunked', { format: 'csv', structure: 'object', columnTypes: 'rows', complexValues: 'inline' })
    .on('data', function(chunk) {
      //console.log(chunk.toString());
      str = str + chunk.toString().trim().replace(/[\n\r]/g, ' ');
      count++;
    }).
    on('end', function() {
      //console.log(str);
      expect(str).to.equal('opticFunctionalTest.detail.id,opticFunctionalTest.master.id,opticFunctionalTest.detail.name,opticFunctionalTest.master.name,opticFunctionalTest.detail.masterId,opticFunctionalTest.master.date,opticFunctionalTest.detail.amount,opticFunctionalTest.detail.color  1,1,Detail 1,Master 1,1,2015-12-01,10.01,blue');
      expect(count).to.equal(1);
      done();
    }, done);
  });

  it('TEST 6 - read plan sparql from file', function(done){
    db.rows.query(planFromSPARQL, { format: 'json', structure: 'array', columnTypes: 'rows'})
    .then(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(7);
      expect(output[0][0].name).to.equal('MySPARQL.industry');
      expect(output[1][0].value).to.equal('Retail/Wholesale');
      expect(output[1][0].type).to.equal('xs:string');
      //expect(output[6][2].value).to.equal(614185278.2);
      expect(output[6][2].type).to.equal('xs:decimal');
      done();
    }, done);
  });
});
