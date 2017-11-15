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

describe('Node.js Optic from triples test', function(){

  /*it('sleep for 10 seconds', function(done) {
    setTimeout(function() {
      done();
    }, 10000);
  });*/

  it('TEST 1 - access with desc orderBy - format json, structure object, columnTypes header', function(done){
    const bb = op.prefixer('http://marklogic.com/baseball/players/');
    const ageCol = op.col('age');
    const idCol = op.col('id');
    const nameCol = op.col('name');
    const teamCol = op.col('team');
    const output =
      op.fromTriples([
        op.pattern(idCol, bb('age'), ageCol),
        op.pattern(idCol, bb('name'), nameCol),
        op.pattern(idCol, bb('team'), teamCol)
      ], null, null)
      .orderBy(op.desc(ageCol))
    db.rows.query(output, { format: 'json', structure: 'object', columnTypes: 'header' }) 
    .then(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.columns[0].name).to.equal('id');
      expect(output.columns[0].type).to.equal('sem:iri');
      expect(output.columns[3].name).to.equal('team');
      expect(output.columns[3].type).to.equal('sem:iri');
      expect(output.rows.length).to.equal(8);
      expect(output.rows[0].id).to.equal('http://marklogic.com/baseball/id#006');
      expect(output.rows[0].age).to.equal(34);
      expect(output.rows[0].name).to.equal('Aoki Yamada');
      expect(output.rows[0].team).to.equal('http://marklogic.com/mlb/team/id/003');
      expect(output.rows[7].id).to.equal('http://marklogic.com/baseball/id#005');
      expect(output.rows[7].age).to.equal(19);
      expect(output.rows[7].name).to.equal('Pedro Barrozo');
      expect(output.rows[7].team).to.equal('http://marklogic.com/mlb/team/id/002');
      done();
    }, done);
  });

  it('TEST 2 - join inner - format json, structure object, columnTypes rows', function(done){
    const bb = op.prefixer('http://marklogic.com/baseball/players/');
    const tm = op.prefixer('http://marklogic.com/mlb/team/');
    const playerAgeCol = op.col('player_age');
    const playerIdCol = op.col('player_id');
    const playerNameCol = op.col('player_name');
    const playerTeamCol = op.col('player_team');
    const teamIdCol = op.col('player_team');
    const teamNameCol = op.col('team_name');
    const teamCityCol = op.col('team_city');
    const player_plan =
      op.fromTriples([
        op.pattern(playerIdCol, bb('age'), playerAgeCol),
        op.pattern(playerIdCol, bb('name'), playerNameCol),
        op.pattern(playerIdCol, bb('team'), playerTeamCol)
      ]);

    const team_plan =
      op.fromTriples([
        op.pattern(teamIdCol, tm('name'), teamNameCol),
        op.pattern(teamIdCol, tm('city'), teamCityCol)
      ]);
    const output =
      player_plan.joinInner(team_plan)
      .where(op.eq(teamNameCol, 'Giants'))
      .orderBy(op.asc(playerAgeCol))
      .select([
        op.as('PlayerName', playerNameCol),
        op.as('PlayerAge', playerAgeCol),
        op.as('TeamName', op.fn.concat(teamCityCol, ' ', teamNameCol))
      ])
    db.rows.query(output, { format: 'json', structure: 'object', columnTypes: 'rows' }) 
    .then(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.rows.length).to.equal(3);
      expect(output.rows[0].PlayerName.value).to.equal('Juan Leone');
      expect(output.rows[0].TeamName.value).to.equal('San Francisco Giants');
      expect(output.rows[0].TeamName.type).to.equal('xs:string');
      expect(output.rows[2].TeamName.value).to.equal('San Francisco Giants');
      done();
    }, done);
  });

  it('TEST 3 - join inner with condition - format xml, structure array', function(done){
    const bb = op.prefixer('http://marklogic.com/baseball/players/');
    const tm = op.prefixer('http://marklogic.com/mlb/team/');
    const playerAgeCol = op.col('player_age');
    const playerIdCol = op.col('player_id');
    const playerNameCol = op.col('player_name');
    const playerTeamCol = op.col('player_team');
    const teamIdCol = op.col('team_id');
    const teamNameCol = op.col('team_name');
    const teamCityCol = op.col('team_city');
    const player_plan =
      op.fromTriples([
        op.pattern(playerIdCol, bb('age'), playerAgeCol),
        op.pattern(playerIdCol, bb('name'), playerNameCol),
        op.pattern(playerIdCol, bb('team'), playerTeamCol)
      ], null, null);

   const team_plan =
     op.fromTriples([
       op.pattern(teamIdCol, tm('name'), teamNameCol),
       op.pattern(teamIdCol, tm('city'), teamCityCol)
     ], null, null);

   const output =
     player_plan.joinInner(
       team_plan,
       op.on(playerTeamCol, teamIdCol),
       op.and(op.gt(playerAgeCol, 27), op.eq(teamNameCol, 'Giants'))
     )
     .orderBy(op.asc(playerAgeCol))
     .select([
       op.as('PlayerName', playerNameCol),
       op.as('PlayerAge', playerAgeCol),
       op.as('TeamName', op.fn.concat(teamCityCol, ' ', teamNameCol))
     ])

    db.rows.query(output, { format: 'xml', structure: 'array', columnTypes: 'header' }) 
    .then(function(output) {
      //console.log(output);
      const outputStr = output.toString().trim().replace(/[\n\r]/g, '');
      //console.log(outputStr);
      expect(outputStr).to.equal('<t:table xmlns:t="http://marklogic.com/table"><t:columns><t:column name="PlayerName" type="xs:string"/><t:column name="PlayerAge" type="xs:integer"/><t:column name="TeamName" type="xs:string"/></t:columns><t:rows><t:row><t:cell name="PlayerName">Josh Ream</t:cell><t:cell name="PlayerAge">29</t:cell><t:cell name="TeamName">San Francisco Giants</t:cell></t:row><t:row><t:cell name="PlayerName">John Doe</t:cell><t:cell name="PlayerAge">31</t:cell><t:cell name="TeamName">San Francisco Giants</t:cell></t:row></t:rows></t:table>');
      done();
    }, done);
  });

  it('TEST 4 - union with where distinct - format csv', function(done){
    const bb = op.prefixer('http://marklogic.com/baseball/players/');
    const tm = op.prefixer('http://marklogic.com/mlb/team/');
    const playerAgeCol = op.col('player_age');
    const playerIdCol = op.col('player_id');
    const playerNameCol = op.col('player_name');
    const playerTeamCol = op.col('player_team');
    const teamIdCol = op.col('player_team');
    const teamNameCol = op.col('team_name');
    const teamCityCol = op.col('team_city');
    const player_plan =
      op.fromTriples([
        op.pattern(playerIdCol, bb('age'), playerAgeCol),
        op.pattern(playerIdCol, bb('name'), playerNameCol),
        op.pattern(playerIdCol, bb('team'), playerTeamCol)
      ]);

    const team_plan =
      op.fromTriples([
        op.pattern(teamIdCol, tm('name'), teamNameCol),
        op.pattern(teamIdCol, tm('city'), teamCityCol)
      ]);

    const output =
      player_plan.union(team_plan)
      .whereDistinct()
    db.rows.query(output, { format: 'csv', structure: 'object', columnTypes: 'header' }) 
    .then(function(output) {
      //console.log(output);
      expect(output).to.contain('player_id,player_age,player_name,player_team,team_name,team_city');
      expect(output).to.contain(',,,http://marklogic.com/mlb/team/id/001,Giants,San Francisco');
      expect(output).to.contain('http://marklogic.com/baseball/id#001,31,John Doe,http://marklogic.com/mlb/team/id/001,,');
      expect(output).to.contain('http://marklogic.com/baseball/id#008,27,Juan Leone,http://marklogic.com/mlb/team/id/001,,');
      done();
    }, done);
  });

  it('TEST 5 - group by avg - queryAsStream sequence', function(done){
    var count = 0;
    var str = '';
    const chunks = [];
    const bb = op.prefixer('http://marklogic.com/baseball/players/');
    const tm = op.prefixer('http://marklogic.com/mlb/team/');
    const playerAgeCol = op.col('player_age');
    const playerIdCol = op.col('player_id');
    const playerNameCol = op.col('player_name');
    const playerTeamCol = op.col('player_team');
    const teamIdCol = op.col('player_team');
    const teamNameCol = op.col('team_name');
    const teamCityCol = op.col('team_city');
    const player_plan =
      op.fromTriples([
        op.pattern(playerIdCol, bb('age'), playerAgeCol),
        op.pattern(playerIdCol, bb('name'), playerNameCol),
        op.pattern(playerIdCol, bb('team'), playerTeamCol)
      ]);

    const team_plan =
      op.fromTriples([
        op.pattern(teamIdCol, tm('name'), teamNameCol),
        op.pattern(teamIdCol, tm('city'), teamCityCol)
      ]);

    const output =
      player_plan.joinInner(team_plan)
      .groupBy(teamNameCol, op.avg('AverageAge', playerAgeCol))
      .orderBy(op.asc(op.col('AverageAge')))
    db.rows.queryAsStream(output, 'sequence', { format: 'json', structure: 'object', columnTypes: 'header' }) 
    .on('data', function(chunk) {
      //console.log(chunk.toString());
      str = str + chunk.toString().trim().replace(/[\n\r]/g, ' ');
      count++;
    }).
    on('end', function() {
      //console.log(str);
      //console.log(count);
      expect(str).to.equal('\u001e{"columns":[{"name":"team_name","type":"xs:string"},{"name":"AverageAge","type":"xs:decimal"}]}\u001e{"team_name":"Athletics","AverageAge":19}\u001e{"team_name":"Mariners","AverageAge":27}\u001e{"team_name":"Padres","AverageAge":28.5}\u001e{"team_name":"Giants","AverageAge":29}');
      expect(count).to.equal(5);
      done();
    }, done);
  });

  it('TEST 6 - group by sum on all - queryAsStream chunked', function(done){
    var count = 0;
    var str = '';
    const chunks = [];
    const bb = op.prefixer('http://marklogic.com/baseball/players/');
    const tm = op.prefixer('http://marklogic.com/mlb/team/');
    const playerAgeCol = op.col('player_age');
    const playerIdCol = op.col('player_id');
    const playerNameCol = op.col('player_name');
    const playerEffCol = op.col('player_eff');
    const playerTeamCol = op.col('player_team');
    const teamIdCol = op.col('player_team');
    const teamNameCol = op.col('team_name');
    const teamCityCol = op.col('team_city');
    const player_plan =
      op.fromTriples([
        op.pattern(playerIdCol, bb('age'), playerAgeCol),
        op.pattern(playerIdCol, bb('name'), playerNameCol),
        op.pattern(playerIdCol, bb('team'), playerTeamCol),
        op.pattern(playerIdCol, bb('eff'), playerEffCol)
      ]);

    const team_plan =
      op.fromTriples([
        op.pattern(teamIdCol, tm('name'), teamNameCol),
        op.pattern(teamIdCol, tm('city'), teamCityCol)
      ]);

    const output =
      player_plan.joinInner(team_plan)
      .groupBy(null, op.sum('SumAll', playerEffCol))
      .orderBy(op.desc(op.col('SumAll')))
    db.rows.queryAsStream(output, 'chunked', { format: 'xml', structure: 'array', columnTypes: 'rows' }) 
    .on('data', function(chunk) {
      //console.log(chunk.toString());
      str = str + chunk.toString().trim().replace(/[\n\r]/g, ' ');
      count++;
    }).
    on('end', function() {
      //console.log(str);
      //console.log(count);
      expect(str).to.equal('<t:table xmlns:t="http://marklogic.com/table"> <t:columns> <t:column name="SumAll"/> </t:columns> <t:rows> <t:row> <t:cell name="SumAll" type="xs:decimal">350.4</t:cell> </t:row> </t:rows> </t:table>');
      expect(count).to.equal(1);
      done();
    }, done);
  });

  it('TEST 7 - join inner with graph iri', function(done){
    const bb = op.prefixer('http://marklogic.com/baseball/players/');
    const tm = op.prefixer('http://marklogic.com/mlb/team/');
    const playerAgeCol = op.col('player_age');
    const playerIdCol = op.col('player_id');
    const playerNameCol = op.col('player_name');
    const playerTeamCol = op.col('player_team');
    const graphCol = op.col('graphUri');
    const teamIdCol = op.col('player_team');
    const teamNameCol = op.col('team_name');
    const teamCityCol = op.col('team_city');
    const player_plan =
      op.fromTriples([
          op.pattern(playerIdCol, bb('age'), playerAgeCol, op.graphCol('graphUri')),
          op.pattern(playerIdCol, bb('name'), playerNameCol),
          op.pattern(playerIdCol, bb('team'), playerTeamCol)
        ],
        null, '/optic/player/triple/test'
      );

    const team_plan =
      op.fromTriples([
        op.pattern(teamIdCol, tm('name'), teamNameCol),
        op.pattern(teamIdCol, tm('city'), teamCityCol)
      ], null, null);

    const output =
      player_plan.joinInner(team_plan)
      .where(op.eq(teamNameCol, 'Giants'))
      .orderBy(op.asc(playerAgeCol))
      .select([
        op.as('PlayerName', playerNameCol),
        op.as('PlayerAge', playerAgeCol),
        op.as('TeamName', op.fn.concat(teamCityCol, ' ', teamNameCol)),
        op.as('GraphName', graphCol)
      ])

    db.rows.query(output, { format: 'json', structure: 'object', columnTypes: 'header' }) 
    .then(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.rows.length).to.equal(3);
      expect(output.rows[0].PlayerName).to.equal('Juan Leone');
      expect(output.rows[0].TeamName).to.equal('San Francisco Giants');
      expect(output.rows[0].GraphName).to.equal('/optic/player/triple/test');
      expect(output.rows[2].TeamName).to.equal('San Francisco Giants');
      done();
    }, done);
  });

  it('TEST 8 - join inner with non matching graph iri', function(done){
    const bb = op.prefixer('http://marklogic.com/baseball/players/');
    const tm = op.prefixer('http://marklogic.com/mlb/team/');
    const playerAgeCol = op.col('player_age');
    const playerIdCol = op.col('player_id');
    const playerNameCol = op.col('player_name');
    const playerTeamCol = op.col('player_team');
    const graphCol = op.col('graphUri');
    const teamIdCol = op.col('player_team');
    const teamNameCol = op.col('team_name');
    const teamCityCol = op.col('team_city');
    const player_plan =
      op.fromTriples([
          op.pattern(playerIdCol, bb('age'), playerAgeCol, op.graphCol('graphUri')),
          op.pattern(playerIdCol, bb('name'), playerNameCol),
          op.pattern(playerIdCol, bb('team'), playerTeamCol)
        ], null, '/optic/team/triple/test'
      );

    const team_plan =
      op.fromTriples([
        op.pattern(teamIdCol, tm('name'), teamNameCol),
        op.pattern(teamIdCol, tm('city'), teamCityCol)
      ], null, null);

    const output =
      player_plan.joinInner(team_plan)
      .where(op.eq(teamNameCol, 'Giants'))
      .orderBy(op.asc(playerAgeCol))
      .select([
        op.as('PlayerName', playerNameCol),
        op.as('PlayerAge', playerAgeCol),
        op.as('TeamName', op.fn.concat(teamCityCol, ' ', teamNameCol))
      ])

    db.rows.query(output, { format: 'json', structure: 'object', columnTypes: 'header' }) 
    .then(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output).to.be.undefined;
      done();
    }, done);
  });

  it('TEST 9 - join inner with array of graph iris', function(done){
    const bb = op.prefixer('http://marklogic.com/baseball/players/');
    const tm = op.prefixer('http://marklogic.com/mlb/team/');
    const playerAgeCol = op.col('player_age');
    const playerIdCol = op.col('player_id');
    const playerNameCol = op.col('player_name');
    const playerTeamCol = op.col('player_team');
    const playerGraphCol = op.col('graphUri1');
    const teamIdCol = op.col('player_team');
    const teamNameCol = op.col('team_name');
    const teamCityCol = op.col('team_city');
    const player_plan =
      op.fromTriples([
          op.pattern(playerIdCol, bb('age'), playerAgeCol, op.graphCol('graphUri1')),
          op.pattern(playerIdCol, bb('name'), playerNameCol),
          op.pattern(playerIdCol, bb('team'), playerTeamCol)
        ], null, ['/optic/player/triple/test', '/optic/team/triple/test']
      );

    const team_plan =
      op.fromTriples([
          op.pattern(teamIdCol, tm('name'), teamNameCol),
          op.pattern(teamIdCol, tm('city'), teamCityCol)
         ], null, null
      );

    const output =
      player_plan.joinInner(team_plan)
      .where(op.eq(teamNameCol, 'Giants'))
      .orderBy(op.asc(playerAgeCol))
      .select([
        op.as('PlayerName', playerNameCol),
        op.as('PlayerAge', playerAgeCol),
        op.as('TeamName', op.fn.concat(teamCityCol, ' ', teamNameCol)),
        op.as('PlayerGraph', playerGraphCol),
      ])

    db.rows.query(output, { format: 'json', structure: 'object', columnTypes: 'header' }) 
    .then(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.rows.length).to.equal(3);
      expect(output.rows[0].PlayerName).to.equal('Juan Leone');
      expect(output.rows[0].TeamName).to.equal('San Francisco Giants');
      expect(output.rows[0].PlayerGraph).to.equal('/optic/player/triple/test');
      expect(output.rows[2].TeamName).to.equal('San Francisco Giants');
      done();
    }, done);
  });

  it('TEST 10 - access with qualifier and no subject', function(done){
    const bb = op.prefixer('http://marklogic.com/baseball/players/');
    const ageCol = op.col('age');
    const idCol = op.col('id');
    const nameCol = op.col('name');
    const teamCol = op.col('team');
    const output =
      op.fromTriples([
        op.pattern(null, bb('age'), ageCol)
      ], 'myPlayer', null)
      .orderBy(op.desc(op.viewCol('myPlayer', 'age')))

    db.rows.query(output, { format: 'json', structure: 'object', columnTypes: 'header' }) 
    .then(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.rows.length).to.equal(7);
      expect(output.rows[0]['myPlayer.age']).to.equal(34);
      expect(output.rows[6]['myPlayer.age']).to.equal(19);
      done();
    }, done);
  });

  it('TEST 11 - access with iri predicate', function(done){
    const bb = op.prefixer('http://marklogic.com/baseball/players/');
    const ageCol = op.col('age');
    const idCol = op.col('id');
    const nameCol = op.col('name');
    const teamCol = op.col('team');
    const output =
      op.fromTriples([
        op.pattern(idCol, op.sem.iri('http://marklogic.com/baseball/players/age'), ageCol)
      ], 'myPlayer', null)
      .orderBy(op.asc(op.viewCol('myPlayer', 'id')))

    db.rows.query(output, { format: 'json', structure: 'object', columnTypes: 'header' }) 
    .then(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.rows.length).to.equal(8);
      expect(output.rows[0]['myPlayer.id']).to.equal('http://marklogic.com/baseball/id#001');
      expect(output.rows[0]['myPlayer.age']).to.equal(31);
      expect(output.rows[7]['myPlayer.id']).to.equal('http://marklogic.com/baseball/id#008');
      expect(output.rows[7]['myPlayer.age']).to.equal(27);
      done();
    }, done);
  });

  it('TEST 34 - join inner with mapper', function(done){
      function ageMapper(row) {
        const result = row;
        if(result.player_age < 21)
          result.player_age = 'rookie';
        else if(result.player_age > 21 && result.player_age < 30)
          result.player_age = 'premium';
        else
          result.player_age = 'veteran';
        return result;
      }
      const bb = op.prefixer('http://marklogic.com/baseball/players/');
      const tm = op.prefixer('http://marklogic.com/mlb/team/');
      const playerAgeCol = op.col('player_age');
      const playerIdCol = op.col('player_id');
      const playerNameCol = op.col('player_name');
      const playerTeamCol = op.col('player_team');
      const teamIdCol = op.col('player_team');
      const teamNameCol = op.col('team_name');
      const teamCityCol = op.col('team_city');
      const player_plan =
        op.fromTriples([
          op.pattern(playerIdCol, bb('age'), playerAgeCol),
          op.pattern(playerIdCol, bb('name'), playerNameCol),
          op.pattern(playerIdCol, bb('team'), playerTeamCol)
        ], null, null);

      const team_plan =
        op.fromTriples([
          op.pattern(teamIdCol, tm('name'), teamNameCol),
          op.pattern(teamIdCol, tm('city'), teamCityCol)
        ]);
      const output =
        player_plan.joinInner(team_plan)
        .where(op.ne(teamNameCol, 'Giants'))
        .orderBy(op.asc(playerNameCol))
        .select([
          playerAgeCol,
          op.as('PlayerName', playerNameCol)
        ])
        .map(ageMapper)
      
      /*var arr = [];
      for (var elem of output) {
        arr.push(elem);
      }
      arr;`*/

    db.rows.query(output, { format: 'json', structure: 'object', columnTypes: 'header' }) 
    .then(function(output) {
      console.log(JSON.stringify(output, null, 2));
      expect(arr[0].value.length).to.equal(5);
      expect(arr[0].value[0].player_age).to.equal('veteran');
      expect(arr[0].value[0].PlayerName).to.equal('Aoki Yamada');
      expect(arr[0].value[4].player_age).to.equal('rookie');
      expect(arr[0].value[4].PlayerName).to.equal('Pedro Barrozo');
      done();
    }, done);
  });

  it('TEST 35 - with whereDistinct', function(done){
    var src =
      `const op = require('/MarkLogic/optic');
      const bb = op.prefixer('http://marklogic.com/baseball/players/');
      const tm = op.prefixer('http://marklogic.com/mlb/team/');
      const playerAgeCol = op.col('player_age');
      const playerIdCol = op.col('player_id');
      const playerNameCol = op.col('player_name');
      const playerTeamCol = op.col('player_team');
      const teamIdCol = op.col('player_team');
      const teamNameCol = op.col('team_name');
      const teamCityCol = op.col('team_city');
      const player_plan =
        op.fromTriples([
          op.pattern(playerIdCol, bb('age'), playerAgeCol),
          op.pattern(playerIdCol, bb('name'), playerNameCol),
          op.pattern(playerIdCol, bb('team'), playerTeamCol)
        ]);

      const team_plan =
        op.fromTriples([
          op.pattern(teamIdCol, tm('name'), teamNameCol),
          op.pattern(teamIdCol, tm('city'), teamCityCol)
        ]);
      const output =
        player_plan.joinInner(team_plan)
        .whereDistinct()
        .orderBy(op.asc(playerAgeCol))
        .select([
          op.as('PlayerName', playerNameCol),
          op.as('PlayerAge', playerAgeCol),
          op.as('TeamName', op.fn.concat(teamCityCol, ' ', teamNameCol))
        ])
        .offsetLimit()
        .result();
      output;`

    db.eval(src)
    .result(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(8);
      done();
    }, done);
  });

  it('TEST 36 - arithmetic operations', function(done){
    var src =
      `const op = require('/MarkLogic/optic');
      const bb = op.prefixer('http://marklogic.com/baseball/players/');
      const tm = op.prefixer('http://marklogic.com/mlb/team/');
      const playerAgeCol = op.col('player_age');
      const playerIdCol = op.col('player_id');
      const playerNameCol = op.col('player_name');
      const playerTeamCol = op.col('player_team');
      const playerEffCol = op.col('player_eff');
      const teamIdCol = op.col('player_team');
      const teamNameCol = op.col('team_name');
      const teamCityCol = op.col('team_city');
      const player_plan =
        op.fromTriples([
          op.pattern(playerIdCol, bb('age'), playerAgeCol),
          op.pattern(playerIdCol, bb('name'), playerNameCol),
          op.pattern(playerIdCol, bb('team'), playerTeamCol),
          op.pattern(playerIdCol, bb('eff'), playerEffCol)
        ]);

      const team_plan =
        op.fromTriples([
          op.pattern(teamIdCol, tm('name'), teamNameCol),
          op.pattern(teamIdCol, tm('city'), teamCityCol)
        ]);
      const output =
        player_plan.joinInner(team_plan)
        .whereDistinct()
        .select([
          op.as('PlayerName', playerNameCol),
          op.as('added', op.add(playerEffCol, 100)),
          op.as('defined', op.isDefined(playerEffCol))
        ])
        .orderBy('added')
        .result();
      output;`

    db.eval(src)
    .result(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(8);
      expect(output[0].value.PlayerName).to.equal('John Doe');
      expect(output[0].value.added).to.equal(125.45);
      expect(output[0].value.defined).to.equal(true);
      expect(output[7].value.PlayerName).to.equal('Bob Brian');
      expect(output[7].value.added).to.equal(178.45);
      expect(output[7].value.defined).to.equal(true);
      done();
    }, done);
  });

  it('TEST 37 - value processing functions', function(done){
    var src =
      `const op = require('/MarkLogic/optic');
      const bb = op.prefixer('http://marklogic.com/baseball/players/');
      const tm = op.prefixer('http://marklogic.com/mlb/team/');
      const playerAgeCol = op.col('player_age');
      const playerIdCol = op.col('player_id');
      const playerNameCol = op.col('player_name');
      const playerTeamCol = op.col('player_team');
      const playerEffCol = op.col('player_eff');
      const playerDobCol = op.col('player_dob');
      const teamIdCol = op.col('player_team');
      const teamNameCol = op.col('team_name');
      const teamCityCol = op.col('team_city');
      const player_plan =
        op.fromTriples([
          op.pattern(playerIdCol, bb('age'), playerAgeCol),
          op.pattern(playerIdCol, bb('name'), playerNameCol),
          op.pattern(playerIdCol, bb('team'), playerTeamCol),
          op.pattern(playerIdCol, bb('dob'), playerDobCol),
          op.pattern(playerIdCol, bb('eff'), playerEffCol)
        ]);

      const team_plan =
        op.fromTriples([
          op.pattern(teamIdCol, tm('name'), teamNameCol),
          op.pattern(teamIdCol, tm('city'), teamCityCol)
        ]);
      const output =
        player_plan.joinInner(team_plan)
        .whereDistinct()
        .select([
          op.as('name', op.fn.lowerCase(playerNameCol)),
          op.as('nameLength', op.fn.stringLength(playerNameCol)),
          op.as('firstname', op.fn.substringBefore(playerNameCol, ' ')),
          op.as('lastname', op.fn.substringAfter(playerNameCol, ' ')),
          op.as('year', op.fn.yearFromDate(playerDobCol)),
          op.as('month', op.fn.monthFromDate(playerDobCol)),
          op.as('day', op.fn.dayFromDate(playerDobCol)),
          op.as('log', op.math.log(playerEffCol))
        ])
        .orderBy('lastname')
        .result();
      output;`

    db.eval(src)
    .result(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(8);
      expect(output[0].value.name).to.equal('pedro barrozo');
      expect(output[0].value.nameLength).to.equal(13);
      expect(output[0].value.firstname).to.equal('Pedro');
      expect(output[0].value.year).to.equal(1991);
      expect(output[0].value.month).to.equal(12);
      expect(output[0].value.day).to.equal(9);
      expect(output[0].value.log).to.equal(3.72930136861285);
      expect(output[7].value.name).to.equal('aoki yamada');
      expect(output[7].value.nameLength).to.equal(11);
      expect(output[7].value.lastname).to.equal('Yamada');
      expect(output[7].value.year).to.equal(1987);
      expect(output[7].value.month).to.equal(3);
      expect(output[7].value.day).to.equal(15);
      expect(output[7].value.log).to.equal(4.01096295328305);
      done();
    }, done);
  });

  it('TEST 38 - groupBy with value processing functions', function(done){
    var src =
      `const op = require('/MarkLogic/optic');
      const bb = op.prefixer('http://marklogic.com/baseball/players/');
      const tm = op.prefixer('http://marklogic.com/mlb/team/');
      const playerAgeCol = op.col('player_age');
      const playerIdCol = op.col('player_id');
      const playerNameCol = op.col('player_name');
      const playerTeamCol = op.col('player_team');
      const playerEffCol = op.col('player_eff');
      const playerDobCol = op.col('player_dob');
      const teamIdCol = op.col('player_team');
      const teamNameCol = op.col('team_name');
      const teamCityCol = op.col('team_city');
      const player_plan =
        op.fromTriples([
          op.pattern(playerIdCol, bb('age'), playerAgeCol),
          op.pattern(playerIdCol, bb('name'), playerNameCol),
          op.pattern(playerIdCol, bb('team'), playerTeamCol),
          op.pattern(playerIdCol, bb('dob'), playerDobCol),
          op.pattern(playerIdCol, bb('eff'), playerEffCol)
        ]);

      const team_plan =
        op.fromTriples([
          op.pattern(teamIdCol, tm('name'), teamNameCol),
          op.pattern(teamIdCol, tm('city'), teamCityCol)
        ]);
      const output =
        player_plan.joinInner(team_plan)
        .whereDistinct()
        .groupBy(op.as('month', op.fn.monthFromDate(playerDobCol)))
        .orderBy('month')
        .result();
      output;`

    db.eval(src)
    .result(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(7);
      done();
    }, done);
  });

  it('TEST 39 - group by count without column', function(done){
    var src =
      `const op = require('/MarkLogic/optic');
      const bb = op.prefixer('http://marklogic.com/baseball/players/');
      const tm = op.prefixer('http://marklogic.com/mlb/team/');
      const playerAgeCol = op.col('player_age');
      const playerIdCol = op.col('player_id');
      const playerNameCol = op.col('player_name');
      const playerEffCol = op.col('player_eff');
      const playerTeamCol = op.col('player_team');
      const teamIdCol = op.col('player_team');
      const teamNameCol = op.col('team_name');
      const teamCityCol = op.col('team_city');
      const player_plan =
        op.fromTriples([
          op.pattern(playerIdCol, bb('age'), playerAgeCol),
          op.pattern(playerIdCol, bb('name'), playerNameCol),
          op.pattern(playerIdCol, bb('team'), playerTeamCol),
          op.pattern(playerIdCol, bb('eff'), playerEffCol)
        ], null, null, {dedup: 'on'});

      const team_plan =
        op.fromTriples([
          op.pattern(teamIdCol, tm('name'), teamNameCol),
          op.pattern(teamIdCol, tm('city'), teamCityCol)
        ], null, null, {dedup: 'on'});

      const output =
        player_plan.joinInner(team_plan)
        .groupBy(teamNameCol, op.count('CountPlayer'))
        .orderBy(op.desc(op.col('CountPlayer')))
        .result();
      output;`
    db.eval(src)
    .result(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(4);
      expect(output[0].value.team_name).to.equal('Giants');
      expect(output[0].value.CountPlayer).to.equal(3);
      expect(output[3].value.team_name).to.equal('Athletics');
      expect(output[3].value.CountPlayer).to.equal(1);
      done();
    }, done);
  });

  it('TEST 40 - access with where clause with parameter', function(done){
    var src =
      `const op = require('/MarkLogic/optic');
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
            op.le(ageCol, op.param('ageVal')),
            op.eq(posCol, op.param('posVal'))
          )
        )
        .orderBy(op.desc(ageCol))
        .select([
          op.as('PlayerName', nameCol),
          op.as('PlayerPosition', posCol),
          op.as('PlayerAge', ageCol)
        ])
        .result(null, {ageVal: 25, posVal: 'Catcher'});
      output;`

    db.eval(src)
    .result(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(1);
      expect(output[0].value.PlayerName).to.equal('Pat Crenshaw');
      done();
    }, done);
  });

  it('TEST 41 - repeated param', function(done){
    var src =
      `const op = require('/MarkLogic/optic');
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
            op.le(ageCol, op.param('ageVal')),
            op.eq(posCol, op.param('posVal'))
          )
        )
        .orderBy(op.desc(ageCol))
        .select([
          op.as('PlayerName', nameCol),
          op.as('PlayerPosition', posCol),
          op.as('PlayerAge', ageCol)
        ])
        .result(null, {ageVal: 25, posVal: 'Catcher', posVal: 'Foo'});
      output;`

    db.eval(src)
    .result(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(0);
      done();
    }, done);
  });

  it('TEST 42 - ignored param', function(done){
    var src =
      `const op = require('/MarkLogic/optic');
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
            op.le(ageCol, op.param('ageVal')),
            op.eq(posCol, op.param('posVal'))
          )
        )
        .orderBy(op.desc(ageCol))
        .select([
          op.as('PlayerName', nameCol),
          op.as('PlayerPosition', posCol),
          op.as('PlayerAge', ageCol)
        ])
        .result(null, {ageVal: 25, posVal: 'Catcher', fooVal: 'Foo'});
      output;`

    db.eval(src)
    .result(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(1);
      expect(output[0].value.PlayerName).to.equal('Pat Crenshaw');
      done();
    }, done);
  });

  it('TEST 43 - value processing functions with call', function(done){
    var src =
      `const op = require('/MarkLogic/optic');
      const bb = op.prefixer('http://marklogic.com/baseball/players/');
      const tm = op.prefixer('http://marklogic.com/mlb/team/');
      const playerAgeCol = op.col('player_age');
      const playerIdCol = op.col('player_id');
      const playerNameCol = op.col('player_name');
      const playerTeamCol = op.col('player_team');
      const playerEffCol = op.col('player_eff');
      const playerDobCol = op.col('player_dob');
      const teamIdCol = op.col('player_team');
      const teamNameCol = op.col('team_name');
      const teamCityCol = op.col('team_city');
      const player_plan =
        op.fromTriples([
          op.pattern(playerIdCol, bb('age'), playerAgeCol),
          op.pattern(playerIdCol, bb('name'), playerNameCol),
          op.pattern(playerIdCol, bb('team'), playerTeamCol),
          op.pattern(playerIdCol, bb('dob'), playerDobCol),
          op.pattern(playerIdCol, bb('eff'), playerEffCol)
        ]);

      const team_plan =
        op.fromTriples([
          op.pattern(teamIdCol, tm('name'), teamNameCol),
          op.pattern(teamIdCol, tm('city'), teamCityCol)
        ]);
      const output =
        player_plan.joinInner(team_plan)
        .whereDistinct()
        .select([
          op.as('name', op.call('http://www.w3.org/2005/xpath-functions', 'lower-case', [playerNameCol])),
          op.as('nameLength', op.call('http://www.w3.org/2005/xpath-functions', 'string-length', [playerNameCol])),
          op.as('firstname', op.call('http://www.w3.org/2005/xpath-functions', 'substring-before', [playerNameCol, ' '])),
          op.as('lastname', op.call('http://www.w3.org/2005/xpath-functions', 'substring-after', [playerNameCol, ' '])),
          op.as('year', op.call('http://www.w3.org/2005/xpath-functions', 'year-from-date', [playerDobCol])),
          op.as('month', op.call('http://www.w3.org/2005/xpath-functions', 'month-from-date', [playerDobCol])),
          op.as('day', op.call('http://www.w3.org/2005/xpath-functions', 'day-from-date', [playerDobCol])),
          op.as('log', op.call('http://marklogic.com/xdmp/math', 'log', [playerEffCol])),
          op.as('random', op.call('http://marklogic.com/semantics', 'random'))
        ])
        .orderBy('lastname')
        .result();
      output;`

    db.eval(src)
    .result(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(8);
      expect(output[0].value.name).to.equal('pedro barrozo');
      expect(output[0].value.nameLength).to.equal(13);
      expect(output[0].value.firstname).to.equal('Pedro');
      expect(output[0].value.year).to.equal(1991);
      expect(output[0].value.month).to.equal(12);
      expect(output[0].value.day).to.equal(9);
      expect(output[0].value.log).to.equal(3.72930136861285);
      expect(output[0].value.random).to.be.within(0, 1);
      expect(output[7].value.name).to.equal('aoki yamada');
      expect(output[7].value.nameLength).to.equal(11);
      expect(output[7].value.lastname).to.equal('Yamada');
      expect(output[7].value.year).to.equal(1987);
      expect(output[7].value.month).to.equal(3);
      expect(output[7].value.day).to.equal(15);
      expect(output[7].value.log).to.equal(4.01096295328305);
      done();
    }, done);
  });

  it('TEST 44 - conditional sem.iri', function(done){
    var src =
      `const op = require('/MarkLogic/optic.sjs');
      const bb = op.prefixer('http://marklogic.com/baseball/players/');
      const id = op.col('id');
      const pos = op.col('position');
      const name = op.col('name');
      const desc = op.col('description');
      const output = op.fromTriples([
        op.pattern(id, bb('name'), name),
        op.pattern(id, bb('description'), desc),
        op.pattern(id, bb('position'), pos)
      ])
      .where(op.eq(id, sem.iri('http://marklogic.com/baseball/id#006')))
      .result();
      output;`
    db.eval(src)
    .result(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(1);
      expect(output[0].value.id).to.equal('http://marklogic.com/baseball/id#006');
      expect(output[0].value.name).to.equal('Aoki Yamada');
      done();
    }, done);
  });

  it('TEST 45 - where not on equal', function(done){
    var src =
      `const op = require('/MarkLogic/optic');
      const bb = op.prefixer('http://marklogic.com/baseball/players/');
      const tm = op.prefixer('http://marklogic.com/mlb/team/');
      const playerAgeCol = op.col('player_age');
      const playerIdCol = op.col('player_id');
      const playerNameCol = op.col('player_name');
      const playerTeamCol = op.col('player_team');
      const teamIdCol = op.col('player_team');
      const teamNameCol = op.col('team_name');
      const teamCityCol = op.col('team_city');
      const player_plan =
        op.fromTriples([
          op.pattern(playerIdCol, bb('age'), playerAgeCol),
          op.pattern(playerIdCol, bb('name'), playerNameCol),
          op.pattern(playerIdCol, bb('team'), playerTeamCol)
        ]);

      const team_plan =
        op.fromTriples([
          op.pattern(teamIdCol, tm('name'), teamNameCol),
          op.pattern(teamIdCol, tm('city'), teamCityCol)
        ]);
      const output =
        player_plan.joinInner(team_plan)
        .where(op.not(op.eq(teamNameCol, 'Giants')))
        .orderBy(op.asc(playerAgeCol))
        .select([
          op.as('PlayerName', playerNameCol),
          op.as('PlayerAge', playerAgeCol),
          op.as('TeamName', op.fn.concat(teamCityCol, ' ', teamNameCol))
        ])
        .result();
      output;`

    db.eval(src)
    .result(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(5);
      expect(output[0].value.TeamName).to.equal('Oakland Athletics');
      expect(output[1].value.TeamName).to.equal('San Diego Padres');
      expect(output[2].value.TeamName).to.equal('Seattle Mariners');
      expect(output[3].value.TeamName).to.equal('Seattle Mariners');
      expect(output[4].value.TeamName).to.equal('San Diego Padres');
      done();
    }, done);
  });

  it('TEST 46 - join doc on triples', function(done){
    var src =
      `const op = require('/MarkLogic/optic');
      const bb = op.prefixer('http://marklogic.com/baseball/players/');
      const ageCol = op.col('age');
      const idCol = op.col('id');
      const nameCol = op.col('name');
      const teamCol = op.col('team');
      const output =
        op.fromTriples([
          op.pattern(idCol, bb('age'), ageCol, op.fragmentIdCol('fragId')),
          op.pattern(idCol, bb('name'), nameCol),
          op.pattern(idCol, bb('team'), teamCol)
        ], 'myPlayer', null, {dedup: 'on'})
        .where(op.le(op.viewCol('myPlayer', 'age'), 25))
        .joinDoc(op.col('doc'), op.fragmentIdCol('fragId'))
        .orderBy(op.desc(op.viewCol('myPlayer', 'name')))
        .result();
      output;`

    db.eval(src)
    .result(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(3);
      expect(output[0].value['myPlayer.age']).to.equal(19);
      expect(output[0].value['myPlayer.name']).to.equal('Pedro Barrozo');
      expect(output[0].value['myPlayer.fragId']).to.not.exist;
      expect(output[0].value.doc).to.contain('<sem:object datatype=\"http://www.w3.org/2001/XMLSchema#string\">John Doe</sem:object>');
      expect(output[2].value['myPlayer.age']).to.equal(23);
      expect(output[2].value['myPlayer.name']).to.equal('Bob Brian');
      expect(output[2].value['myPlayer.fragId']).to.not.exist;
      done();
    }, done);
  });

});
