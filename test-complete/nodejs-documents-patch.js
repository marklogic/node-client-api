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

describe('document query', function(){
  before(function(done){
    this.timeout(3000);
// NOTE: must create a string range index on rangeKey1 and rangeKey2
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
  it('should read, query, and remove the doc', function(done){
    db.read('/test/query/matchList/doc5.json').
      result(function(documents) {
        var document = documents[0];
        //console.log(JSON.stringify(document, null, 4));
        var p = marklogic.patchBuilder;
        return dbWriter.documents.patch('/test/query/matchList/doc5.json',
            p.pathLanguage('jsonpath'),
            p.insert('$', 'last-child', {foo:'bar'}),
            p.insert('$.title', 'after', {newKey:'newChild'}),
            p.insert('$.price.amt', 'before', {numberKey:1234.456}),
            p.replace('$.popularity', 1),
            p.remove('$.p')
          ).result();
      }).
    then(function(response){
      //console.log('Patch result: ');
      return db.read('/test/query/matchList/doc5.json').result();
      }).
    then(function(documents){	      
        var document = documents[0];
        //console.log(JSON.stringify(document, null, 4));
        document.content.newKey.should.equal('newChild');
        document.content.foo.should.equal('bar');
        document.content.popularity.should.equal(1);
        document.should.not.have.property('p');
        return dbWriter.remove('/test/query/matchList/doc5.json').result();
      }).
    then(function(document) {
      document.exists.should.eql(false);
      }).
    then(function(documents){
      done();
      }, done);
  });
});
