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
var fs = require('fs');
var concatStream = require('concat-stream');
var valcheck = require('core-util-is');

var testconfig = require('../etc/test-config.js');

var marklogic = require('../');
var q = marklogic.queryBuilder;

var db = marklogic.createDatabaseClient(testconfig.restReaderConnection);
var dbWriter = marklogic.createDatabaseClient(testconfig.restWriterConnection);
var dbAdmin = marklogic.createDatabaseClient(testconfig.restAdminConnection);

describe('Extension library test', function(){
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
        }).
    result(function(response){done();}, done);
  });

  var dbPath = '/marklogic/snippet/custom/extractFirst.xqy';
  var fsPath = './data/extractFirst.xqy';

  it('should write the extension library', function(done){
    this.timeout(3000);
    fs.createReadStream(fsPath).
    pipe(concatStream({encoding: 'string'}, function(source) {
      dbAdmin.config.extlibs.write(dbPath, 'application/xquery', source).
      result(function(response){done();}, done);
    }));
  });

  it('should read the extension library', function(done){
    dbAdmin.config.extlibs.read(dbPath).
    result(function(source){
      (!valcheck.isNullOrUndefined(source)).should.equal(true);
      done();
    }, done);
  });
    
  it('should list the extension libraries', function(done){
    dbAdmin.config.extlibs.list().
    result(function(response){
      response.should.have.property('assets');
      response.assets.length.should.be.greaterThan(0);
      done();
    }, done);
  });

  it('should do word query', function(done){
    db.query(
      q.where(
        q.term('memex')
      ).
      slice(1, 100, q.snippet('extractFirst'))
    ).result(function(response) {
        console.log(JSON.stringify(response, null, 4))
        response[0].results[0].snippet.should.have.property.first;
        //response.length.should.equal(2);
        //response[0].content.id.should.equal('0011');
        //response[1].content.id.should.equal('0012');
        done();
      }, done);
  });

});
