/*
 * Copyright (c) 2020 MarkLogic Corporation
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
  host:     connectdef.host,
  port:     connectdef.port,
  user:     'admin',
  password: 'admin',
  authType: connectdef.authType
}
);

// Client to query schema database to verify view is stored
// Make sure you have qbvuser user created. See XQuery script nodejs-optic-setup.xml of internal repo (SVN).
var dbModClient = marklogic.createDatabaseClient({
  database: dbName+'Modules',
  host:     connectdef.host,
  port:     connectdef.port,
  user:     'qbvuser',
  password: 'qbvuser',
  authType: connectdef.authType
});

// Client to generate views
const dbClient = marklogic.createDatabaseClient(
{
  database: dbName,
  host:     connectdef.host,
  port:     connectdef.port,
  user:     'qbvuser',
  password: 'qbvuser',
  authType: connectdef.authType
}
);

const op = marklogic.planBuilder;

function waitForViewCreate(wTime) 
{
   return it('View creation delay', done => 
   {
      setTimeout(() => done(), wTime)

   }).timeout(wTime + 120)
}

describe('Nodejs Optic generate views test', function(){
	it('TEST 1 - join left outer with array of on', function(done){
	  
      const plan1 =
        op.fromLiterals([
          {rowId: 1, colorId: 1, desc: 'ball'},
          {rowId: 2, colorId: 2, desc: 'square'},
          {rowId: 3, colorId: 1, desc: 'box'}, 
          {rowId: 4, colorId: 1, desc: 'hoops'},
          {rowId: 5, colorId: 5, desc: 'circle'},
          {rowId: 6, colorId: 3, desc: 'hOops'},
          {rowId: 7, colorId: 2, desc: 'hooP'},
          {rowId: 8, colorId: 4, desc: 'MainFrame'},
          {rowId: 9, colorId: 5, desc: 'JavaScript'}
        ]);
      const plan2 =
        op.fromLiterals([
          {colorId: 1, colorDesc: 'red'},
          {colorId: 2, colorDesc: 'blue'},
          {colorId: 3, colorDesc: 'black'},
          {colorId: 4, colorDesc: 'yellow'}
        ]);
      const qredact =
        plan1.joinInner(plan2).orderBy(op.col('rowId'))
		.bind(op.rdt.redactRegex(op.col('desc'), {pattern:'h([a-z])op', replacement:'=$1='}))
		.bind(op.rdt.redactRegex(op.col('desc'), {pattern:'(Main)([A-Z])(rame)', replacement:'$3Obsolate$2$1'}))
		.bind(op.rdt.redactRegex(op.col('colorDesc'), {pattern:'bl(ac)k', replacement:'AC'}))
		.bind(op.rdt.redactRegex(op.col('colorDesc'), {pattern:'red', replacement:'RED'}));
				
		db.rows.query(qredact)
        .then(function (res) {
			var output = res.rows;
			//console.log(JSON.stringify(output, null, 2));
            expect(output.length).to.equal(7);
			expect(output[0].rowId.value).to.equal(1);
			expect(output[0].desc.value).to.equal('ball');
			expect(output[0].colorDesc.value).to.equal('RED');
			expect(output[3].rowId.value).to.equal(4);
			expect(output[3].desc.value).to.equal('=o=s');
			expect(output[3].colorDesc.value).to.equal('RED');
			expect(output[4].colorDesc.value).to.equal('AC');
			expect(output[4].desc.value).to.equal('hOops');
			expect(output[5].desc.value).to.equal('hooP');
			expect(output[6].desc.value).to.equal('rameObsolateFMain');
			
            done();
            })
            .catch(err => {
                done(err);
        });
  });
  
  it('TEST 2 - Test redactDatetime fn', function(done){

    const qredact =
        op.fromLiterals([
          {id:1, name:'Master 1', date:op.xs.dateTime('2021-12-31T23:59:59')},
          {id:2, name:'Master 2', date:op.xs.dateTime('2020-02-29T00:00:59')} ])
        .orderBy(op.asc(op.col('id')))
		.bind(op.rdt.redactDatetime(op.col('date'), {level:'parsed', format:'Month=[M01] Day=[D01]/xx [H01]:[m01]:[s01]'}));
     
    db.rows.query(qredact)
    .then(function(res) {
	var output = res.rows;
	//console.log(JSON.stringify(output, null, 2));
    expect(output.length).to.equal(2);
    expect(output[0].date.value).to.equal('Month=12 Day=31/xx 23:59:59');
    expect(output[1].date.value).to.equal('Month=02 Day=29/xx 00:00:59');
    done();
    }, function(error) {
      console.log(JSON.stringify(error, null, 2));     
	done();});
  });
  
  it('TEST 3 - Test maskDeterministic fn with col name in orderBy clause', function(done){
 
      const plan1 =
        op.fromView('opticFunctionalTest', 'detail')
          .orderBy(op.schemaCol('opticFunctionalTest', 'detail', 'id'));
      const plan2 =
        op.fromView('opticFunctionalTest', 'master')
          .orderBy(op.schemaCol('opticFunctionalTest', 'master' , 'id'));
      const qredact =
        plan1.joinInner(plan2)
        .where(
          op.eq(
            op.schemaCol('opticFunctionalTest', 'master' , 'id'), 
            op.schemaCol('opticFunctionalTest', 'detail', 'masterId')
          )
        )
        .select([
          op.as('MasterName', op.schemaCol('opticFunctionalTest', 'master', 'name')),
          op.schemaCol('opticFunctionalTest', 'master', 'date'),
          op.as('DetailName', op.schemaCol('opticFunctionalTest', 'detail', 'name')),
          op.schemaCol('opticFunctionalTest', 'detail', 'amount'),
          op.schemaCol('opticFunctionalTest', 'detail', 'color')
        ])
        .orderBy(op.desc(op.col('DetailName')))
		.bind(op.rdt.maskDeterministic(op.col('DetailName'), {maxLength:10, character:'lowerCase'}))
		.bind(op.rdt.maskDeterministic(op.col('MasterName'), {maxLength:33, character:'mixedCaseNumeric'}));
        
    db.rows.query(qredact)
    .then(function(res) {
	  var output0 = res.rows[0];
      //console.log(JSON.stringify(output0, null, 2));
	  
      expect(res.rows.length).to.equal(6);
	  expect(output0.MasterName.value.length).to.equal(33);
      expect(output0.MasterName.value).to.match(/^[A-Za-z0-9]+$/);
      expect(output0.DetailName.value.length).to.equal(10);  
	  expect(output0.DetailName.value).to.match(/^[a-z]+$/);  
      expect(output0["opticFunctionalTest.detail.amount"].value).to.equal(60.06);
	  
	  var output5 = res.rows[5];
      //console.log(JSON.stringify(output5, null, 2));
	  expect(output5.MasterName.value.length).to.equal(33);
      expect(output5.MasterName.value).to.match(/^[A-Za-z0-9]+$/);
      expect(output5.DetailName.value.length).to.equal(10);
	  expect(output5.DetailName.value).to.match(/^[a-z]+$/);
      expect(output5["opticFunctionalTest.detail.color"].value).to.equal('blue');
      done();
    }, function(error) {
      console.log(JSON.stringify(error, null, 2));     
	done();});
  });
  
  it('TEST 4 - Test maskRandom fn with multiple triple patterns with condition', function(done){
    
    const qredact =
        op.fromSPARQL("PREFIX foaf: <http://xmlns.com/foaf/0.1/> \
          PREFIX ppl:  <http://people.org/> \
          SELECT ?personA ?personB \
          WHERE { \
            ?personB foaf:name 'Person 7' . \
            ?personA foaf:knows ?personB \
          }")
		  .bind([
				op.rdt.maskRandom(op.col('personA'), {character:'mixedCase'}),
				op.rdt.maskRandom(op.col('personB'), {character:'mixedCaseNumeric'})
		  ]);
    db.rows.query(qredact)
    .then(function(res) {
	  
      //console.log(JSON.stringify(res, null, 2));
      expect(res.rows.length).to.equal(1);
      expect(res.rows[0].personA.value.length).to.equal(26);
      expect(res.rows[0].personA.value).to.match(/^[A-Za-z]+$/);
	  
      expect(res.rows[0].personB.value.length).to.equal(26);
      expect(res.rows[0].personB.value).to.match(/^[A-Za-z0-9]+$/);
      done();
    }, function(error) {
      console.log(JSON.stringify(error, null, 2));     
      done();
  });
  });
  
  it('TEST 5 - Test redactNumber fn on number col with where condition', function(done){
      
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
        ], null, null, {dedup: 'on'});

      const team_plan =
        op.fromTriples([
          op.pattern(teamIdCol, tm('name'), teamNameCol),
          op.pattern(teamIdCol, tm('city'), teamCityCol)
        ], null, null, {dedup: 'on'});
      const qredact =
        player_plan.joinInner(team_plan)
        .where(op.eq(teamNameCol, 'Giants'))
        .orderBy(op.asc(playerAgeCol))
        .select([
          op.as('PlayerName', playerNameCol),
          op.as('PlayerAge', playerAgeCol),
          op.as('TeamName', op.fn.concat(teamCityCol, ' ', teamNameCol))
        
		  ])
		  .bind([
				op.rdt.redactNumber(op.col('PlayerAge'), {type:'integer', min:1000, max:10000, format:'000,000'})
		  ]);
      
	  db.rows.query(qredact)
      .then(function(res) {
	  
      //console.log(JSON.stringify(res, null, 2));
      expect(res.rows.length).to.equal(3);
	  
	  expect(res.rows[0].PlayerAge.value).to.match(/^0[\d,]+$/);
	  expect(res.rows[0].PlayerName.value).to.equal('Juan Leone');
      expect(res.rows[0].TeamName.value).to.equal('San Francisco Giants');
      
      expect(res.rows[1].PlayerAge.value).to.match(/^0[\d,]+$/);
	  expect(res.rows[1].PlayerName.value).to.equal('Josh Ream');
      expect(res.rows[1].TeamName.value).to.equal('San Francisco Giants');
	  
      expect(res.rows[2].PlayerName.value).to.equal('John Doe');
	  expect(res.rows[2].TeamName.value).to.equal('San Francisco Giants');
      expect(res.rows[2].PlayerAge.value).to.match(/^0[\d,]+$/);
      done();
    }, function(error) {
      console.log(JSON.stringify(error, null, 2));     
      done();
  });
  });
  
  it('TEST 6 - Test redactEmail fn on emails', function(done){
    
      const plan1 =
        op.fromLiterals([
          {rowId: 1, colorId: 2147483647, desc: 'ball', largeInt: 2147483648, BusinessEmail:'abc@googel.com', PersonalEmail:'abc@personal-inc.net'},
          {rowId: 2, colorId: 9007199254740991, desc: 'square', largeInt: 90071992547409921, BusinessEmail:'Mathhews-Doe@googel.org', PersonalEmail:'Mathhews-Doe@personal-inc.gov'},
          {rowId: 3, colorId: 9007199254740991, desc: 'box', largeInt: 9007199254740990, BusinessEmail:'Jo_DoGood@googel.es.net', PersonalEmail:'Jo_DoGood@personal-inc.es.com'}, 
          {rowId: 4, colorId: 2147483647, desc: 'hoop', largeInt: 4147483649, BusinessEmail:'mail2Martin@googel.gov', PersonalEmail:'mail2Martin@personal-inc.rs.org'},
          {rowId: 5, colorId: 9007199254740992, desc: 'circle', largeInt: 3147483648, BusinessEmail:'g-olsen@googel-inc.com', PersonalEmail:'g-olsen@personal-inc.'}
        ]);
      const plan2 =	
        op.fromLiterals([
          {colorId: 2147483647, colorDesc: 'red'},
          {colorId: 9007199254740991, colorDesc: 'blue'},
          {colorId: 3, colorDesc: 'black'},
          {colorId: 9007199254740992, colorDesc: 'yellow'}
        ]);
      const qredact =
        plan1.joinInner(plan2).orderBy(op.asc(op.col('rowId')))
		.bind([
				op.rdt.redactEmail(op.col('BusinessEmail'), {level:'name'}),
				op.rdt.redactEmail(op.col('PersonalEmail'), {level:'domain'})
		  ]);
	  db.rows.query(qredact)
      .then(function(res) {
	  //console.log(JSON.stringify(res, null, 2));
      expect(res.rows.length).to.equal(5);
	  
      expect(res.rows[0].rowId.value).to.equal(1);
      expect(res.rows[0].desc.value).to.equal('ball');
      expect(res.rows[0].colorDesc.value).to.equal('red');
	  expect(res.rows[0].BusinessEmail.value).to.equal('NAME@googel.com');
	  expect(res.rows[0].PersonalEmail.value).to.equal('abc@DOMAIN');
      expect(res.rows[0].colorId.value).to.equal(2147483647);
      
	  expect(res.rows[1].BusinessEmail.value).to.equal('NAME@googel.org');
	  expect(res.rows[1].PersonalEmail.value).to.equal('Mathhews-Doe@DOMAIN');
	  
	  expect(res.rows[2].rowId.value).to.equal(3);
      expect(res.rows[2].desc.value).to.equal('box');
      expect(res.rows[2].colorDesc.value).to.equal('blue');
      expect(res.rows[2].colorId.value).to.equal(9007199254740991);
	  expect(res.rows[2].BusinessEmail.value).to.equal('NAME@googel.es.net');
	  expect(res.rows[2].PersonalEmail.value).to.equal('Jo_DoGood@DOMAIN');
	  
	  expect(res.rows[3].BusinessEmail.value).to.equal('NAME@googel.gov');
	  expect(res.rows[3].PersonalEmail.value).to.equal('mail2Martin@DOMAIN');
	  
      expect(res.rows[4].rowId.value).to.equal(5);
      expect(res.rows[4].desc.value).to.equal('circle');
      expect(res.rows[4].colorDesc.value).to.equal('yellow');
      expect(res.rows[4].colorId.value).to.equal(9.00719925474099e15);
	  expect(res.rows[4].BusinessEmail.value).to.equal('NAME@googel-inc.com');
	  expect(res.rows[4].PersonalEmail.value).to.equal('g-olsen@DOMAIN');
	  
      done()
    }, function(error) {
      console.log(JSON.stringify(error, null, 2));     
      done();
  });
  });
  
  it('TEST 7 - Test redaction on zero rows no result search', function(done){

      const plan1 =
        op.fromView('opticFunctionalTest4', 'detail4', null, null);
      
      const plan2 =
        op.fromView('opticFunctionalTest4', 'master4', null, null);          
      const qredact =
        plan1
        .where(op.cts.jsonPropertyValueQuery('id', '700'))
        .joinInner(
          plan2.where(op.cts.wordQuery('Master 100')), 
          op.on(op.schemaCol('opticFunctionalTest4', 'detail4', 'masterId'), op.schemaCol('opticFunctionalTest4', 'master4', 'id'))
        )
        .orderBy(op.schemaCol('opticFunctionalTest4', 'detail4', 'id'))
		.bind([
				op.rdt.maskRandom(op.col('opticFunctionalTest4.master4.name'), {character:'mixedCase'})
		  ]);
 
    db.rows.query(qredact)
      .then(function(res) {
	  //console.log(JSON.stringify(res, null, 2));
      expect(typeof res === "undefined").to.be.true;
      done();
    }, done);
  });
  
  it('TEST 8 - Negative tests with multiple redacts on group by', function(done){
    
      const plan1 =
        op.fromSQL("SELECT * from opticFunctionalTest.detail");
      const plan2 =
        op.fromSQL("SELECT * from opticFunctionalTest.master");
      const qredact =
        plan1.joinInner(plan2)
        .where(
          op.eq(
            op.schemaCol('opticFunctionalTest', 'master' , 'id'),
            op.schemaCol('opticFunctionalTest', 'detail', 'masterId')
          )
        )
        .groupBy(op.schemaCol('opticFunctionalTest', 'master', 'name'), op.sum('DetailSum', op.schemaCol('opticFunctionalTest', 'detail', 'amount')))
        .orderBy(op.desc(op.col('DetailSum')))
		.bind([
		op.rdt.redactNumber(op.col('DetailSum'), {type:'integer', min:1000, max:10000, format:'000,000'})
		, op.rdt.redactNumber(op.col('DetailSum'), {type:'integer',  min:2, max:4})
		]);
    db.rows.query(qredact)
      .then(function(res) {
	  //console.log(JSON.stringify(res, null, 2));
		assert.fail("Expecting an error response. No valid output should be in the response.");
		done();
	}, function(error) {
		//console.log(JSON.stringify(error, null, 2)); 
		expect(error.body.errorResponse.message).to.contain("Invalid arguments: duplicate column definition for op.as(): DetailSum");	     
		done();});
    });
	
	it('TEST 10 - Test existsJoin with redactRegex fn on same col ', function(done){
    
      const plan1 =
        op.fromLiterals([
		  {rowId: 3, colorId: 1, desc: 'box'},
          {rowId: 2, colorId: 2, desc: 'square'},
          {rowId: 3, colorId: 1, desc: 'ball'}, 
          {rowId: 4, colorId: 1, desc: 'hoops'},
          {rowId: 5, colorId: 5, desc: 'circle'},
          {rowId: 6, colorId: 3, desc: 'hOops'},
          {rowId: 7, colorId: 2, desc: 'hooP'},
          {rowId: 8, colorId: 4, desc: 'MainFrame'},
          {rowId: 9, colorId: 5, desc: 'JavaScript'}
        ]);
      const plan2 =
        op.fromLiterals([
          {colorId: 1, colorDesc: 'red', desc: 'ball'},
          {colorId: 2, colorDesc: 'blue', desc: 'Ball'},
          {colorId: 3, colorDesc: 'black', desc: 'BALL'},
          {colorId: 4, colorDesc: 'yellow', desc: 'ballpark'},
		  {colorId: 2, colorDesc: 'blue', desc: 'bike'}
        ]);
      const qredact =
        plan2.existsJoin(plan1, op.on(op.col('desc'), op.col('desc')))
		.orderBy(op.col('rowId'))
		.bind(op.rdt.redactRegex(op.col('colorDesc'), {pattern:'red', replacement:'RED'}))
		.bind(op.rdt.redactRegex(op.col('desc'), {pattern:'ball', replacement:'Football'}))
		.bind(op.rdt.redactRegex(op.col('desc'), {pattern:'bike', replacement:'Scooter'}));

    db.rows.query(qredact)
      .then(function(res) {
	  console.log(JSON.stringify(res, null, 2));
      /*expect(output.length).to.equal(1);
      expect(output[0].value.colorId).to.equal(1);
      expect(output[0].value.desc).to.equal('Football');
      expect(output[0].value.colorDesc).to.equal('RED');*/
      done();
    }, function(error) {
		//console.log(JSON.stringify(error, null, 2)); 
		//expect(error.body.errorResponse.message).to.contain("Invalid arguments: duplicate column definition for op.as(): DetailSum");	     
		done();});
  });
  
  
});
