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

describe('Document parse binding test', function(){
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
        p: 'Vannevar served as a prominent policymaker and public intellectual',
        booleanVal: false,
        nullVal: 'not null'
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
          p: 'The Memex, unfortunately, had no automated search feature',
          booleanVal: true,
          nullVal: null
          }
        }).
    result(function(response){done();}, done);
  });

  it('should do simple parse', function(done){
    db.documents.query(
      q.where(
        q.parsedFrom('intitle:"The memex"',
          q.parseBindings(
            q.value('title', q.bind('intitle'))
          )
        )
      )
    ).
    result(function(response) {
      response.length.should.equal(1);
      response[0].content.id.should.equal('0026');
      //console.log(JSON.stringify(response, null, 4));
      done();
    }, done);
  });

  it('should do value query on int type', function(done){
    db.documents.query(
      q.where(
        q.parsedFrom('myAmt:123.45',
          q.parseBindings(
            q.value('amt', q.jsontype('number'), q.bind('myAmt'))
          )
        )
      )
    ).
    result(function(response) {
      response.length.should.equal(1);
      response[0].content.id.should.equal('0026');
      //console.log(JSON.stringify(response, null, 4));
      done();
    }, done);
  });

  it('should do value query on double type', function(done){
    db.documents.query(
      q.where(
        q.parsedFrom('pop:5',
          q.parseBindings(
            q.value('popularity', q.jsontype('number'), q.bind('pop'))
          )
        )
      )
    ).
    result(function(response) {
      response.length.should.equal(3);
      //response[0].content.id.should.equal('0026');
      //console.log(JSON.stringify(response, null, 4));
      done();
    }, done);
  });

  it('should do value query on int type without mentioning json type', function(done){
    db.documents.query(
      q.where(
        q.parsedFrom('pop:5',
          q.parseBindings(
            q.value('popularity', q.bind('pop'))
          )
        )
      )
    ).
    result(function(response) {
      response.length.should.equal(0);
      //console.log(JSON.stringify(response, null, 4));
      done();
    }, done);
  });

  it('should do value query on boolean type', function(done){
    db.documents.query(
      q.where(
        q.parsedFrom('bool:true',
          q.parseBindings(
            q.value('booleanVal', q.jsontype('boolean'), q.bind('bool'))
          )
        )
      )
    ).
    result(function(response) {
      response.length.should.equal(1);
      response[0].content.id.should.equal('0026');
      //console.log(JSON.stringify(response, null, 4));
      done();
    }, done);
  });

  it('should do value query on null type', function(done){
    db.documents.query(
      q.where(
        q.parsedFrom('myNull:null',
          q.parseBindings(
            q.value('nullVal', q.jsontype('null'), q.bind('myNull'))
          )
        )
      )
    ).
    result(function(response) {
      response.length.should.equal(1);
      response[0].content.id.should.equal('0026');
      //console.log(JSON.stringify(response, null, 4));
      done();
    }, done);
  });
  
  it('should do complex parse', function(done){
    db.documents.query(
      q.where(
        q.parsedFrom('"Vannevar" AND theId:0024 OR (pop LT 4)',
          q.parseBindings(
            q.word('title', q.bindDefault()),
            q.value('id', q.bind('theId')),
            q.range('popularity', q.datatype('int'), q.bind('pop'))
          )
        )
      )
    ).
    result(function(response) {
      response.length.should.equal(2);
      response[0].content.id.should.equal('0024');
      response[1].content.id.should.equal('0013');
      //console.log(JSON.stringify(response, null, 4));
      done();
    }, done);
  });

  it('should do parse on range', function(done){
    db.documents.query(
      q.where(
        q.parsedFrom('amount1 GE 10 AND amount2 LE 100',
          q.parseBindings(
            q.range('amt', q.datatype('double'), q.bind('amount1')),
            q.range('amt', q.datatype('double'), q.bind('amount2'))
          )
        )
      )
    ).
    result(function(response) {
      response.length.should.equal(1);
      response[0].content.id.should.equal('0024');
      //console.log(JSON.stringify(response, null, 4));
      done();
    }, done);
  });

  it('should return no result on empty string parse', function(done){
    db.documents.query(
      q.where(
        q.parsedFrom('',
          q.parseBindings(
            q.value('title', q.bind('intitle')),
            q.bindEmptyAs('no-results')
          )
        )
      )
    ).
    result(function(response) {
      response.length.should.equal(0);
      //console.log(JSON.stringify(response, null, 4));
      done();
    }, done);
  });

  it('should return all results on empty string parse', function(done){
    db.documents.query(
      q.where(
        q.parsedFrom('',
          q.parseBindings(
            q.value('title', q.bind('intitle')),
            q.bindEmptyAs('all-results')
          )
        )
      )
    ).
    result(function(response) {
      response.length.should.not.equal(0);
      //console.log(JSON.stringify(response, null, 4));
      done();
    }, done);
  });

  it('should do simple parse combined with structured query', function(done){
    db.documents.query(
      q.where(
        q.parsedFrom('intitle:"The memex"',
          q.parseBindings(
            q.value('title', q.bind('intitle'))
          )
        ),
        q.term('automated')
      )
    ).
    result(function(response) {
      response.length.should.equal(1);
      response[0].content.id.should.equal('0026');
      //console.log(JSON.stringify(response, null, 4));
      done();
    }, done);
  });

  it('should do range constraint parse with different facet -- issue #145', function(done){
    db.documents.query(
      q.where(
        q.parsedFrom('amount1 GE 10 AND amount2 LE 100',
          q.parseBindings(
            q.range('amt', q.datatype('double'), q.bind('amount1')),
            q.range('amt', q.datatype('double'), q.bind('amount2'))
          )
        )
      ).
      calculate(
        q.facet('popularity', q.facetOptions('frequency-order', 'descending', 'limit=10'))
      ).
      withOptions({
        queryPlan: true,
        metrics: false,
        debug: true
      })
    ).
    result(function(response) {
      //console.log(JSON.stringify(response, null, 2));
      response[0].facets.should.not.have.property('amt');
      response[0].facets.should.have.property('popularity');
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
