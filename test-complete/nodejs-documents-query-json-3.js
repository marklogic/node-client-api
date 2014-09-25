/*
 * Copyright 2014 MarkLogic Corporation
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
var should = require('should');

var testconfig = require('../etc/test-config.js');

var marklogic = require('../');
var q = marklogic.queryBuilder;

var db = marklogic.createDatabaseClient(testconfig.restReaderConnection);
var dbWriter = marklogic.createDatabaseClient(testconfig.restWriterConnection);

describe('Document query test', function(){
  before(function(done){
    this.timeout(3000);
    dbWriter.documents.write({
      uri: '/test/query/matchDir/doc1.json',
      collections: ['matchCollection1'],
      contentType: 'application/json',
      content: {
        title: 'Vannevar Bush',
        popularity: 5,
        id: '0011',
        date: '2005-01-01',
        price: {
             amt: 0.1
           },
        p: 'Vannevar Bush wrote an article for The Atlantic Monthly about memex'
        }
      }, { 
      uri: '/test/query/matchDir/doc2.json',
      collections: ['matchCollection1', 'matchCollection2'],
      contentType: 'application/json',
      content: {
        title: 'The Bush article',
        popularity: 4,
        id: '0012',
        date: '2006-02-02',
        price: {
             amt: 0.12
           },
        p: 'The Bush article described a device called a Memex'
        }
      }, { 
      uri: '/test/query/matchDir/doc3.json',
      collections: ['matchCollection2'],
      contentType: 'application/json',
      content: {
        title: 'For 1945',
        popularity: 3,
        id: '0013',
        date: '2007-03-03',
        price: {
             amt: 1.23
           },
        p: 'For 1945, the thoughts expressed in the Atlantic Monthly were groundbreaking'
        }
      }, { 
      uri: '/test/query/matchDir/doc4.json',
      collections: [],
      contentType: 'application/json',
      content: {
        title: 'Vannevar served',
        popularity: 5,
        id: '0024',
        date: '2008-04-04',
        price: {
             amt: 12.34
           },
        p: 'Vannevar served as a prominent policymaker and public intellectual'
        }
      }, { 
        uri: '/test/query/matchList/doc5.json',
        collections: ['matchList'],
        contentType: 'application/json',
        content: {
          title: 'The memex',
          popularity: 5,
          id: '0026',
          date: '2009-05-05',
          price: {
               amt: 123.45
             },
          p: 'The Memex, unfortunately, had no automated search feature'
          }
        }).
    result(function(response){done();}, done);
  });

   it('should do term queries with and-not', function(done){
    db.documents.query(
      q.where(
        q.andNot(
          q.term('Bush'), 
          q.term('groundbreaking')
          )
        )
      ).result(function(response) {
        var document = response[0];
        response.length.should.equal(2);
        //console.log(JSON.stringify(response, null, 4));
        done();
      }, done);
  }); 	
it('should do term query with andNot and orderby id',function(done){
 db.documents.query(
	q.where(
		q.orderBy('id'),
        q.andNot(
          q.term('Bush','Vannevar'), 
          q.term('groundbreaking')
          )
        )
	
      ).result(function(response) {
        var document = response[0];
        response.length.should.equal(3);
		response[0].content.id.should.equal('0011');
		response[1].content.id.should.equal('0012');
		response[2].content.id.should.equal('0024');
        //console.log(JSON.stringify(response, null, 4));
        done();
      }, done);
	});
	
 it('should do collection query and term query with or', function(done){
    db.documents.query(
      q.where(
		q.and(
			q.collection('matchCollection1'),
			q.or(
			  q.term('Atlantic'),
			  q.term('Bush')
			  )
			)
		)
	  ).result(function(response) {
        response.length.should.equal(2);
        //console.log(JSON.stringify(response, null, 4));
        done();
      }, done);
  });

 it('should do term query with directory', function(done){
    db.documents.query(
      q.where(
	    q.directory('/test/query/matchDir/'),
        q.term('memex')
        )
      ).result(function(response) {
        response.length.should.equal(2);
        console.log(JSON.stringify(response, null, 4));
        done();
      }, done);
  });

  it('should do term query with or and not', function(done){
    db.documents.query(
      q.where(
		q.and(
			q.not(q.value('id', '0011')),
			q.or(
			  q.term('Atlantic'),
			  q.term('Bush')
			  )
			)
		)
	  ).result(function(response) {
        response.length.should.equal(2);
        //console.log(JSON.stringify(response, null, 4));
        done();
      }, done);
  });

 it('should slice results from middle', function(done){
    db.documents.query(
      q.where(
        q.term('memex')
        ).
        slice(2, 3)
      ).result(function(response) {
        response.length.should.equal(2);
        //console.log(JSON.stringify(response, null, 4));
        done();
      }, done);
  }); 
it('should slice results from end', function(done){
    db.documents.query(
      q.where(
        q.term('memex')
        ).
        slice(3)
      ).result(function(response) {
        response.length.should.equal(1);
        //console.log(JSON.stringify(response, null, 4));
        done();
      }, done);
  });  

it('should slice results with a snippet', function(done){
    db.query(
      q.where(
        q.term('memex')
        ).
		slice(1, 1, q.snippet('extractFirst'))
		).result(function(response) {
        response.length.should.equal(2);
		response[0].results[0].snippet.should.have.property.first;
        //console.log(JSON.stringify(response, null, 4));
        done();
      }, done);
  });    
  
});
