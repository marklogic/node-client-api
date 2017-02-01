/*
 * Copyright 2014-2017 MarkLogic Corporation
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

describe('Document qbe test', function(){
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
          p: 'The Memex, unfortunately, had no automated search feature'
          }
        },{
         uri: '/test/query/matchList/doc6.xml',
         collections: ['matchList'],
         contentType: 'application/xml',
         content: '<Employee><name>John</name></Employee>'
      }, {
         uri: '/test/query/matchList/doc7.xml',
         collections: ['matchList'],
         contentType: 'application/xml',
         content: '<Employee><firstname>John</firstname><id>0081</id></Employee>'
      },{
        uri: '/test/query/matchList/doc8.json',
        id: '33f028a3-351e-485a-928a-a45885a964b3',
        type: 'person',
        subtype: ['customer'],
        schema: [
            'person_1.0',
            'customer_1.2'
        ],
        content: {
        name: 'Josh Bowers',
        gender: 'male',
        customerSince: '2003-03-03Z',
        reviewerRank: 33333,
        vipCustomer: null,
        topSpends: 300000,
        lastVisits: '2013-03-03',
        favoriteFoods: 'steak PIZZA-PIE tacos cake cookies yum8me',
        popularity1: 'Awesome',
        nicknames: [
            'Joshua',
            'JaJa',
            'Math Wizard',
            'Taco'
        ]}}).
    result(function(response){done();}, done);
  });

  it('should do key value query', function(done){
    db.documents.query(
      q.where(
        q.byExample({title: 'The memex'})
      )).result(function(response) {
        //console.log(response, null, 4);
        response.length.should.equal(1);
        response[0].content.id.should.equal('0026');
        done();
      }, done);
  });

  it('should do word query', function(done){
    db.documents.query(
      q.where(
        q.byExample({
          title: {
            $word: 'bush'
          }
        })
      )).result(function(response) {
        //console.log(response, null, 4);
        response.length.should.equal(2);
        response[0].content.id.should.equal('0011');
        response[1].content.id.should.equal('0012');
        done();
      }, done);
  });
  it('should do query on firstname xml', function(done){
    db.documents.query(
      q.where(
        q.byExample({
          $query:{
            firstname: 'John'
			},
			$format: 'xml'
         })
      )).result(function(response) {
        //console.log(response);
		response.length.should.equal(1);
        done();
      }, done);
	  });
	    it('should do query on title', function(done){
    db.documents.query(
      q.where(
        q.byExample({
          $query:{
            title: 'The memex'
			},
			$format: 'json'
         })
      )).result(function(response) {
        //console.log(response);
        response.length.should.equal(1);
        response[0].content.id.should.equal('0026');
        done();
      }, done);
	  });
  it('should do query on title string', function(done){
    db.documents.query(
      q.where(
        q.byExample(      
		'<q:qbe xmlns:q="http://marklogic.com/appservices/querybyexample">' +
		'  <q:format>json</q:format>' +
		'  <q:query>' +
		'    <title>The memex</title>' +
		'  </q:query>' +
		'</q:qbe>'
)
      )).result(function(response) {
        //console.log(response);
        response.length.should.equal(1);
        response[0].content.id.should.equal('0026');
        done();
      }, done);
	  });
  it('should do query on Popularity lt', function(done){
    db.documents.query(
      q.where(
        q.byExample({
          $query:{
            popularity: {
            $lt: 4
          }
			},
			$format: 'json'
         })
      )).result(function(response) {
        //console.log(response);
        response.length.should.equal(1);
        response[0].content.id.should.equal('0013');
        done();
      }, done);
	  });
	    it('should report wrong Query by Validate', function(done){
    db.documents.query(
      q.where(
        q.byExample({
          $query:{
            hello: {
            $lt: 4
          }
			},
			$format: 'json',
			$validate: true
         })
      )).result(function(response) {
        //console.log(response);
		response.should.have.property('invalid-query');
		response['invalid-query'].should.have.property('query-parse-errors');
         done();
      }, done);
	  });
	  it('should do query on Popularity lt diff format', function(done){
    db.documents.query(
      q.where(
        q.byExample('<q:qbe xmlns:q="http://marklogic.com/appservices/querybyexample">' +
		'  <q:format>json</q:format>' +
		'  <q:query>' +
		'    <popularity><q:lt>4</q:lt></popularity>' +
		'  </q:query>' +
		'</q:qbe>')
      )).result(function(response) {
        //console.log(response);
        response.length.should.equal(1);
        response[0].content.id.should.equal('0013');
        done();
      }, done);
	  });
  it('should do range query', function(done){
    db.documents.query(
      q.where(
        q.byExample({
          popularity: {
            $lt: 4
          }
        })
      )).result(function(response) {
        //console.log(response);
        response.length.should.equal(1);
        response[0].content.id.should.equal('0013');
        done();
      }, done);
  });

  it('should do range query on attribute', function(done){
    db.documents.query(
      q.where(
        q.byExample({
          price: {
            amt: {
              $gt: 100.00
            }
          }
        })
      )).result(function(response) {
        //console.log(response, null, 4);
        response.length.should.equal(1);
        response[0].content.id.should.equal('0026');
        done();
      }, done);
  });

  it('should do composed query', function(done){
    db.documents.query(
      q.where(
        q.byExample({
          $and: [
            { title: {
                $word: 'bush'
                }
            },
            { popularity: {
                $gt: 4
                }
            }
          ]
        })
      )).result(function(response) {
        //console.log(response, null, 4);
        response.length.should.equal(1);
        response[0].content.id.should.equal('0011');
        done();
      }, done);
  });

  it('should do value query with exact is true', function(done){
    db.documents.query(
      q.where(
        q.byExample({
          title: {
            $exact: true,
            $value: 'the memex'
          }
        })
      )).result(function(response) {
        //console.log(response, null, 4);
        response.length.should.equal(0);
        done();
      }, done);
  });

  it('should do value query with exact is false', function(done){
    db.documents.query(
      q.where(
        q.byExample({
          title: {
            $exact: false,
            $value: 'the memex'
          }
        })
      )).result(function(response) {
        //console.log(response, null, 4);
        response.length.should.equal(1);
        response[0].content.id.should.equal('0026');
        done();
      }, done);
  });

  /*it('should do word query with case sensitive', function(done){
    db.documents.query(
      q.where(
        q.byExample({
          p: {
            $caseSensitive: true,
            $word: 'memex'
          }
        })
      )).result(function(response) {
        console.log(response, null, 4);
        //response.length.should.equal(1);
        //response[0].content.id.should.equal('0026');
        done();
      }, done);
  });*/

  /*it('should do near query', function(done){
    db.documents.query(
      q.where(
        q.byExample({
          $near: [
            { p: {
                $word: 'Bush'
                }
            },
            { p: {
                $word: 'Memex'
                }
            }
          ],
          $distance: 2
        })
      )).result(function(response) {
        console.log(response, null, 4);
        //response.length.should.equal(1);
        //response[0].content.id.should.equal('0011');
        done();
      }, done);
  });*/

  it('should do container query', function(done){
    db.documents.query(
      q.where(
        q.byExample({
          price: {
            amt: 0.1
          }
        })
      )).result(function(response) {
        //console.log(response);
        response.length.should.equal(1);
        response[0].content.id.should.equal('0011');
        done();
      }, done);
  });
it('should do qbe bug38619', function(done){
    db.documents.query(
	  q.where(
		q.byExample({
			$word: 'awesome',
			$stemmed: false
		})
	 )
	).result(function(response) {
	//  console.log(response);
        response.length.should.equal(1);
        response[0].content.popularity1.should.equal('Awesome');
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
