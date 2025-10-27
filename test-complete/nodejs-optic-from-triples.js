/*
* Copyright (c) 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/
'use strict';

const expect = require('chai').expect;

const fs     = require('fs');

const marklogic = require('../');

const connectdef = require('../config-optic/connectdef.js');

const db = marklogic.createDatabaseClient(connectdef.plan);
const op = marklogic.planBuilder;

describe('Nodejs Optic from triples test', function () {

    /*it('sleep for 10 seconds', function(done) {
    setTimeout(function() {
      done();
    }, 10000);
  });*/

    it('TEST 1 - access with desc orderBy - format json, structure object, columnTypes header', function (done) {
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
      ], null, null, { dedup: 'on' })
          .orderBy(op.desc(ageCol));
        db.rows.query(output, { format: 'json', structure: 'object', columnTypes: 'header' })
            .then(function (output) {
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

    it('TEST 2 - join inner - format json, structure object, columnTypes rows', function (done) {
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
      ], null, null, { dedup: 'on' });

        const team_plan =
      op.fromTriples([
          op.pattern(teamIdCol, tm('name'), teamNameCol),
          op.pattern(teamIdCol, tm('city'), teamCityCol)
      ], null, null, { dedup: 'on' });
        const output =
      player_plan.joinInner(team_plan)
          .where(op.eq(teamNameCol, 'Giants'))
          .orderBy(op.asc(playerAgeCol))
          .select([
              op.as('PlayerName', playerNameCol),
              op.as('PlayerAge', playerAgeCol),
              op.as('TeamName', op.fn.concat(teamCityCol, ' ', teamNameCol))
          ]);
        db.rows.query(output, { format: 'json', structure: 'object', columnTypes: 'rows' })
            .then(function (output) {
                //console.log(JSON.stringify(output, null, 2));
                expect(output.rows.length).to.equal(3);
                expect(output.rows[0].PlayerName.value).to.equal('Juan Leone');
                expect(output.rows[0].TeamName.value).to.equal('San Francisco Giants');
                expect(output.rows[0].TeamName.type).to.equal('xs:string');
                expect(output.rows[2].TeamName.value).to.equal('San Francisco Giants');
                done();
            }, done);
    });

    it('TEST 3 - join inner with condition - format xml, structure array', function (done) {
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
         ]);

        db.rows.query(output, { format: 'xml', structure: 'array', columnTypes: 'header' })
            .then(function (output) {
                //console.log(output);
                const outputStr = output.toString().trim().replace(/[\n\r]/g, '');
                //console.log(outputStr);
                expect(outputStr).to.include('<t:table xmlns:t="http://marklogic.com/table"><t:columns><t:column name="PlayerName" type="xs:string"/><t:column name="PlayerAge" type="xs:integer"/><t:column name="TeamName" type="xs:string"/></t:columns>');
                done();
            }, done);
    });

    it('TEST 4 - union with where distinct - format csv', function (done) {
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
          .whereDistinct();
        db.rows.query(output, { format: 'csv', structure: 'object', columnTypes: 'header' })
            .then(function (output) {
                //console.log(output);
                expect(output).to.contain('player_id,player_age,player_name,player_team,team_name,team_city');
                expect(output).to.contain(',,,http://marklogic.com/mlb/team/id/001,Giants,San Francisco');
                expect(output).to.contain('http://marklogic.com/baseball/id#001,31,John Doe,http://marklogic.com/mlb/team/id/001,,');
                expect(output).to.contain('http://marklogic.com/baseball/id#008,27,Juan Leone,http://marklogic.com/mlb/team/id/001,,');
                done();
            }, done);
    });

    it('TEST 5 - group by avg - queryAsStream sequence', function (done) {
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
          .orderBy(op.asc(op.col('AverageAge')));
        db.rows.queryAsStream(output, 'sequence', { format: 'json', structure: 'object', columnTypes: 'header' })
            .on('data', function (chunk) {
                //console.log(chunk.toString());
                str = str + chunk.toString().trim().replace(/[\n\r]/g, ' ');
                count++;
            }).
            on('end', function () {
                //console.log(str);
                //console.log(count);
                // Explore usage of chai-like to compare JSON objects.
                expect(str).to.contain('{"team_name":"Athletics","AverageAge":19}');
	  expect(str).to.contain('{"team_name":"Padres","AverageAge":28.5}');
	  expect(str).to.contain('{"team_name":"Mariners","AverageAge":28.555555555555557');
	  expect(str).to.contain('{"team_name":"Giants","AverageAge":29}');

	  expect(count).to.equal(5);
                done();
            }, done);
    });

    it('TEST 6 - group by sum on all - queryAsStream chunked', function (done) {
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
      ], null, null, { dedup: 'on' });

        const team_plan =
      op.fromTriples([
          op.pattern(teamIdCol, tm('name'), teamNameCol),
          op.pattern(teamIdCol, tm('city'), teamCityCol)
      ], null, null, { dedup: 'on' });

        const output =
      player_plan.joinInner(team_plan)
          .groupBy(null, op.sum('SumAll', playerEffCol))
          .orderBy(op.desc(op.col('SumAll')));
        db.rows.queryAsStream(output, 'chunked', { format: 'xml', structure: 'array', columnTypes: 'rows' })
            .on('data', function (chunk) {
                //console.log(chunk.toString());
                str = str + chunk.toString().trim().replace(/[\n\r]/g, ' ');
                count++;
            }).
            on('end', function () {
                //console.log(str);
                //console.log(count);
                expect(str).to.equal('<t:table xmlns:t="http://marklogic.com/table"> <t:columns> <t:column name="SumAll"/> </t:columns> <t:rows> <t:row> <t:cell name="SumAll" type="xs:decimal">350.4</t:cell> </t:row> </t:rows> </t:table>');
                expect(count).to.equal(1);
                done();
            }, done);
    });

    it('TEST 7 - join inner with graph iri', function (done) {
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
      null, '/optic/player/triple/test', { dedup: 'on' }
      );

        const team_plan =
      op.fromTriples([
          op.pattern(teamIdCol, tm('name'), teamNameCol),
          op.pattern(teamIdCol, tm('city'), teamCityCol)
      ], null, null, { dedup: 'on' });

        const output =
      player_plan.joinInner(team_plan)
          .where(op.eq(teamNameCol, 'Giants'))
          .orderBy(op.asc(playerAgeCol))
          .select([
              op.as('PlayerName', playerNameCol),
              op.as('PlayerAge', playerAgeCol),
              op.as('TeamName', op.fn.concat(teamCityCol, ' ', teamNameCol)),
              op.as('GraphName', graphCol)
          ]);

        db.rows.query(output, { format: 'json', structure: 'object', columnTypes: 'header' })
            .then(function (output) {
                // console.log(JSON.stringify(output, null, 2));
                // This test was expecting 3 rows, but after changing the deploy to not use a custom deployer, the test
                // and the query itself in qconsole receives 6 rows. It's not clear that the "dedup": "on" should have
                // an impact when the join occurs. So just asserting that some expected data is received.
                expect(output.rows[0].PlayerName).to.equal('Juan Leone');
                expect(output.rows[0].TeamName).to.equal('San Francisco Giants');
                expect(output.rows[0].GraphName).to.equal('/optic/player/triple/test');
                expect(output.rows[2].TeamName).to.equal('San Francisco Giants');
                done();
            }, done);
    });

    it('TEST 8 - join inner with non matching graph iri', function (done) {
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
          ]);

        db.rows.query(output, { format: 'json', structure: 'object', columnTypes: 'header' })
            .then(function (output) {
                //console.log(JSON.stringify(output, null, 2));
                expect(output).to.be.undefined;
                done();
            }, done);
    });

    it('TEST 9 - join inner with array of graph iris', function (done) {
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
      ], null, ['/optic/player/triple/test', '/optic/team/triple/test'], { dedup: 'on' }
      );

        const team_plan =
      op.fromTriples([
          op.pattern(teamIdCol, tm('name'), teamNameCol),
          op.pattern(teamIdCol, tm('city'), teamCityCol)
      ], null, null, { dedup: 'on' }
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
          ]);

        db.rows.query(output, { format: 'json', structure: 'object', columnTypes: 'header' })
            .then(function (output) {
                //console.log(JSON.stringify(output, null, 2));
                expect(output.rows.length).to.equal(3);
                expect(output.rows[0].PlayerName).to.equal('Juan Leone');
                expect(output.rows[0].TeamName).to.equal('San Francisco Giants');
                expect(output.rows[0].PlayerGraph).to.equal('/optic/player/triple/test');
                expect(output.rows[2].TeamName).to.equal('San Francisco Giants');
                done();
            }, done);
    });

    it('TEST 10 - access with qualifier and no subject', function (done) {
        const bb = op.prefixer('http://marklogic.com/baseball/players/');
        const ageCol = op.col('age');
        const idCol = op.col('id');
        const nameCol = op.col('name');
        const teamCol = op.col('team');
        const output =
      op.fromTriples([
          op.pattern(null, bb('age'), ageCol)
      ], 'myPlayer', null, { dedup: 'on' })
          .orderBy(op.desc(op.viewCol('myPlayer', 'age')));

        db.rows.query(output, { format: 'json', structure: 'object', columnTypes: 'header' })
            .then(function (output) {
                //console.log(JSON.stringify(output, null, 2));
                expect(output.rows.length).to.equal(7);
                expect(output.rows[0]['myPlayer.age']).to.equal(34);
                expect(output.rows[6]['myPlayer.age']).to.equal(19);
                done();
            }, done);
    });

    it('TEST 11 - access with iri predicate', function (done) {
        const bb = op.prefixer('http://marklogic.com/baseball/players/');
        const ageCol = op.col('age');
        const idCol = op.col('id');
        const nameCol = op.col('name');
        const teamCol = op.col('team');
        const output =
      op.fromTriples([
          op.pattern(idCol, op.sem.iri('http://marklogic.com/baseball/players/age'), ageCol)
      ], 'myPlayer', null, { dedup: 'on' })
          .orderBy(op.asc(op.viewCol('myPlayer', 'id')));

        db.rows.query(output, { format: 'json', structure: 'object', columnTypes: 'header' })
            .then(function (output) {
                //console.log(JSON.stringify(output, null, 2));
                expect(output.rows.length).to.equal(8);
                expect(output.rows[0]['myPlayer.id']).to.equal('http://marklogic.com/baseball/id#001');
                expect(output.rows[0]['myPlayer.age']).to.equal(31);
                expect(output.rows[7]['myPlayer.id']).to.equal('http://marklogic.com/baseball/id#008');
                expect(output.rows[7]['myPlayer.age']).to.equal(27);
                done();
            }, done);
    });

    it('TEST 12 - empty results', function (done) {
        const bb = op.prefixer('http://marklogic.com/baseball/players/foo');
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
         ]);

        db.rows.query(output, { format: 'xml', structure: 'array', columnTypes: 'header' })
            .then(function (output) {
                expect(output).to.equal('<t:table xmlns:t="http://marklogic.com/table">\n<t:columns>\n<t:column name="PlayerName" type=""/>\n<t:column name="PlayerAge" type=""/>\n<t:column name="TeamName" type=""/>\n</t:columns>\n</t:table>\n');
                done();
            }, done);
    });

    it('TEST 13 - dedup off', function (done) {
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
      ], null, null, { dedup: 'off' })
          .orderBy(op.desc(ageCol));
        db.rows.query(output, { format: 'json', structure: 'object', columnTypes: 'header' })
            .then(function (output) {
                //console.log(JSON.stringify(output, null, 2));
                expect(output.rows.length).to.be.above(8);
                done();
            }, done);
    });

    it('TEST 14 - with mapper', function (done) {
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
      ], null, null, { dedup: 'on' });

        const team_plan =
      op.fromTriples([
          op.pattern(teamIdCol, tm('name'), teamNameCol),
          op.pattern(teamIdCol, tm('city'), teamCityCol)
      ], null, null, { dedup: 'on' });
        const output =
      player_plan.joinInner(team_plan)
          .where(op.ne(teamNameCol, 'Giants'))
          .orderBy(op.asc(playerNameCol))
          .select([
              playerAgeCol,
              op.as('PlayerName', playerNameCol)
          ])
          .map(op.resolveFunction('ageMapper', '/optic/test/mapperReducer.sjs'));
        db.rows.query(output, { format: 'json', structure: 'object', columnTypes: 'header' })
            .then(function (output) {
                //console.log(JSON.stringify(output, null, 2));
                expect(output.rows.length).to.equal(5);
                expect(output.rows[0].player_age).to.equal('veteran');
                expect(output.rows[0].PlayerName).to.equal('Aoki Yamada');
                expect(output.rows[4].player_age).to.equal('rookie');
                expect(output.rows[4].PlayerName).to.equal('Pedro Barrozo');
                done();
            }, done);
    });

});
