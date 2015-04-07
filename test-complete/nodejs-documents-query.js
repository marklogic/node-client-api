/*
 * Copyright 2014-2015 MarkLogic Corporation
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

var testconfig = require('../etc/test-config-qa.js');

var marklogic = require('../');
var q = marklogic.queryBuilder;

var db = marklogic.createDatabaseClient(testconfig.restReaderConnection);
var dbWriter = marklogic.createDatabaseClient(testconfig.restWriterConnection);
var dbAdmin = marklogic.createDatabaseClient(testconfig.restAdminConnection);

describe('Document query test', function(){
  before(function(done){
    this.timeout(10000);
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
        p: 'Vannevar Bush wrote an article for The Atlantic Monthly'
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
          p: 'The Memex, unfortunately, had no automated search feature policy'
          }
        }).
    result(function(response){done();}, done);
  });

   it('should do word query', function(done){
    db.documents.query(
      q.where(
        q.word('title', 'bush')
      )).result(function(response) {
        response.length.should.equal(2);
        response[0].content.id.should.equal('0011');
        response[1].content.id.should.equal('0012');
        done();
      }, done);
  });
  it('should do word query with slice and withOptions , BUG : 31452', function(done){
    db.documents.query(
      q.where(
        q.word('title', 'bush')		
      ).
		slice(1, 1, q.snippet()).
		withOptions({categories: 'none'})
	).
	  result(function(response) {
		//console.log(JSON.stringify(response, null, 4));
        response.length.should.equal(1);
		response[0].results[0].matches[0]['match-text'].length.should.equal(2);
		//response[0].results[0].matches[0]['match-text'][1].should.containEql('{ highlight: \'Bush\' }');
        done();
      }, done);
  }); 
  
   it('should do word query withOptions Unfiltered', function(done){
    db.documents.query(
      q.where(
        q.word('p', 'The')		
      ).
		withOptions({search:['unfiltered']},{categories: ['content']})
	).
	  result(function(response) {
		//console.log(JSON.stringify(response, null, 4));
        response.length.should.equal(3);
		done();
      }, done);
  });
     it('should do word query withOptions default and must be unfiltered', function(done){
    db.documents.query(
      q.where(
        q.word('p', 'The')		
      ).
		withOptions({categories: ['content']})
	).
	  result(function(response) {
		//console.log(JSON.stringify(response, null, 4));
       response.length.should.equal(3);
		done();
      }, done);
  });
   it('should do word query witgh slice and withOptions fileterd', function(done){
    db.documents.query(
      q.where(
        q.word('p', 'The')		
      ).
		withOptions({search:['filtered']},{categories: ['content']})
	).
	  result(function(response) {
	  //console.log(JSON.stringify(response, null, 4));
        response.length.should.equal(3);
		done();
      }, done);
  });
  
  it('should do term query', function(done){
    db.documents.query(
      q.where(
        q.or(
          q.term('memex'),
          q.word('id', '0026')
        )
      )).result(function(response) {
        response.length.should.equal(2);
        //console.log(JSON.stringify(response, null, 4));
        response[0].content.id.should.equal('0026');
        response[1].content.id.should.equal('0012');
        done();
      }, done);
  });

  it('should do value query with wildcards', function(done){
    db.documents.query(
      q.where(
        q.or(
          q.value('id', '0??6', q.termOptions('wildcarded')), 
          q.word('id', '00*2', q.termOptions('wildcarded'))
        )
      ).withOptions({search:['filtered']},{categories: ['content']})
     ).result(function(response) {
       // console.log(JSON.stringify(response, null, 4));
       response.length.should.equal(2);
       response[0].content.id.should.equal('0026');
       response[1].content.id.should.equal('0012');
       done();
     }, done);
  });

  it('should do value query with google style grammar', function(done){
    db.documents.query(
      q.where(
        q.or(
          q.value('title', 'The memex'), 
          q.and(
            q.value('id', '0013'),
            q.value('date', '2007-03-03')
          )
        )
      )).result(function(response) {
        var document = response[0];
        response.length.should.equal(2);
        //console.log(JSON.stringify(response, null, 4));
        response[0].content.id.should.equal('0013');
        response[1].content.id.should.equal('0026');
        done();
      }, done);
  });

  it('should do term queries with AND', function(done){
    db.documents.query(
      q.where(
        q.and(
          q.term('Atlantic'), 
          q.term('Monthly'),
          q.term('Bush')
          )
        )
      ).result(function(response) {
        var document = response[0];
        response.length.should.equal(1);
        //console.log(JSON.stringify(response, null, 4));
        response[0].content.id.should.equal('0011');
        done();
      }, done);
  });

  it('should do near query', function(done){
    db.documents.query(
      q.where(
        q.near(
          q.term('Bush'),
          q.term('Atlantic'),
          6,
          q.weight(1)
        )
      )).result(function(response) {
        var document = response[0];
        response.length.should.equal(1);
        //console.log(JSON.stringify(response, null, 4));
        response[0].content.id.should.equal('0011');
        done();
      }, done);
  });

  it('should do scope query', function(done){
    db.documents.query(
      q.where(
        q.scope(
          'title',
          q.term('Bush')
        )
      )).result(function(response) {
        var document = response[0];
        response.length.should.equal(2);
        //console.log(JSON.stringify(response, null, 4));
        response[0].content.id.should.equal('0011');
        response[1].content.id.should.equal('0012');
        done();
      }, done);
  });

  it('should do not-in query', function(done){
    db.documents.query(
      q.where(
        q.notIn(
          q.term('Bush'),
          q.term('Vannevar Bush')
        )
      ).withOptions({search:['filtered']},{categories: ['content']})
    ).result(function(response) {
      //console.log(JSON.stringify(response, null, 4));
      var document = response[0];
      response.length.should.equal(1);
      response[0].content.id.should.equal('0012');
      done();
    }, done);
  });

  it('should do document query', function(done){
    db.documents.query(
      q.where(
        q.document(
          '/test/query/matchList/doc5.json'
        )
      )).result(function(response) {
        var document = response[0];
        response.length.should.equal(1);
        //console.log(JSON.stringify(response, null, 4));
        response[0].content.id.should.equal('0026');
        done();
      }, done);
  });

  it('should do queries with snippet', function(done){
    db.documents.query(
      q.where(
        q.and(
          q.term('Atlantic'), 
          q.term('Monthly'),
          q.term('Bush')
          )
        ).slice(1, 100, q.snippet())
      ).result(function(response) {
        //console.log(JSON.stringify(response, null, 4));
        response[0].results[0].matches[0]['match-text'][1].highlight.should.equal('Bush');
        response[0].results[0].matches[1]['match-text'][1].highlight.should.equal('Bush');
        response[0].results[0].matches[1]['match-text'][3].highlight.should.equal('Atlantic');
        response[0].results[0].matches[1]['match-text'][4].highlight.should.equal('Monthly');
        response[1].content.id.should.equal('0011');
        done();
      }, done);
  });

  it('should do query with no where clause', function(done){
    db.documents.query(
      q.document(
          '/test/query/matchList/doc5.json'
      )
    ).result(function(response) {
        var document = response[0];
        response.length.should.equal(5);
        //console.log(JSON.stringify(response, null, 4));
        done();
      }, done);
  });

it('should delete all documents', function(done){
    dbAdmin.documents.removeAll({
      all: true
    }).
    result(function(response) {
      done();
    }, done);
  }); 
});
