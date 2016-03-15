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

describe('Document extract test', function(){
  before(function(done){
    this.timeout(10000);
    dbWriter.documents.write({
      uri: '/test/query/matchDir/doc1.json',
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
        contentType: 'application/json',
        content: {
          title: 'The memex',
          popularity: 5,
          id: '0026',
          date: '2009-05-05',
          price: {
               amt: 123.45
             },
          p: 'The Memex, unfortunately, had no automated search feature',
          category: ['history', 'america', 'president']
          }
        }).
    result(function(response){done();}, done);
  });

  it('should do extract with include-with-ancestors', function(done){
    db.documents.query(
      q.where(
        q.word('title', 'bush')
      ).
      slice(1, 10,
        q.extract({
          selected:'include-with-ancestors',
          paths:[
            '/node("id")'
          ]
        })
      )
    ).result(function(response) {
      response.length.should.equal(2);
      response[0].content.id.should.equal('0011');
      response[1].content.id.should.equal('0012');
      response[0].content.should.not.have.property('popularity');
      //console.log(JSON.stringify(response, null, 4));
      done();
    }, done);
  });

  it('should do extract with exclude', function(done){
    db.documents.query(
      q.where(
        q.word('title', 'bush')
      ).
      slice(1, 10,
        q.extract({
          selected:'exclude',
          paths:[
            '/node("id")'
          ]
        })
      )
    ).result(function(response) {
      response.length.should.equal(2);
      response[0].content.popularity.should.equal(5);
      response[1].content.popularity.should.equal(4);
      response[0].content.should.not.have.property('id');
      response[1].content.should.not.have.property('name');
      //console.log(JSON.stringify(response, null, 4));
      done();
    }, done);
  });

  it('should do extract with include', function(done){
    db.documents.query(
      q.where(
        q.word('id', '**26', q.termOptions('wildcarded'))
      ).withOptions({search:['filtered']})
      .slice(1, 10,
        q.extract({
          selected:'include',
          paths:[
            '/node("id")'
          ]
        })
      )
    ).result(function(response) {
      response.length.should.equal(1);
      response[0].content.should.have.property('context');
      response[0].content.should.have.property('extracted');
      response[0].content.should.not.have.property('popularity');
      response[0].content.extracted[0].id.should.equal('0026');
      //console.log(JSON.stringify(response, null, 4));
      done();
    }, done);
  });

  it('should do extract with //', function(done){
    db.documents.query(
      q.where(
        q.word('title', 'The memex')
      ).
      slice(1, 10,
        q.extract({
          selected:'include-with-ancestors',
          paths:[
            '//node("amt")'
          ]
        })
      )
    ).result(function(response) {
      response.length.should.equal(1);
      response[0].content.price.should.have.property('amt');
      response[0].content.should.not.have.property('id');
      //console.log(JSON.stringify(response, null, 4));
      done();
    }, done);
  });

  it('should do extract with deeper level', function(done){
    db.documents.query(
      q.where(
        q.word('title', 'The memex')
      ).
      slice(1, 10,
        q.extract({
          selected:'include-with-ancestors',
          paths:[
            '/node("price")/node("amt")'
          ]
        })
      )
    ).result(function(response) {
      response.length.should.equal(1);
      response[0].content.price.should.have.property('amt');
      response[0].content.should.not.have.property('id');
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
  /*it('should do extract with back level up', function(done){
    db.documents.query(
      q.where(
        q.word('title', 'The memex')
      ).
      slice(1, 10,
        q.extract({
          selected:'include-with-ancestors',
          paths:[
            //'/node("price")/node("amt")/node(..)/node(..)/node("popularity")'
            '/node("price")/node("amt")/../../node("popularity")'
          ]
        })
      )
    ).result(function(response) {
      //response.length.should.equal(1);
      //response[0].content.should.have.property('popularity');
      //response[0].content.should.not.have.property('price');
      console.log(JSON.stringify(response, null, 4));
      done();
    }, done);
  });

  it('should do extract on array value', function(done){
    db.documents.query(
      q.where(
        q.word('title', 'The memex')
      ).
      slice(1, 10,
        q.extract({
          selected:'include-with-ancestors',
          paths:[
            '/node("category")/node()[2]'
          ]
        })
      )
    ).result(function(response) {
      //response.length.should.equal(1);
      //response[0].content.should.have.property('category');
      //response[0].content.should.not.have.property('price');
      //response[0].content.category[0].should.equal('america');
      console.log(JSON.stringify(response, null, 4));
      done();
    }, done);
  });*/

});
