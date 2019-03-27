/*
 * Copyright 2014-2019 MarkLogic Corporation
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
var t = marklogic.valuesBuilder;

var db = marklogic.createDatabaseClient(testconfig.restWriterConnection);
var dbReader = marklogic.createDatabaseClient(testconfig.restReaderConnection);
var dbAdmin = marklogic.createDatabaseClient(testconfig.restAdminConnection);

describe('Values PITQ Test', function() {

  var oldTimestamp = db.createTimestamp('123');
  var zeroTimestamp = db.createTimestamp('0');
  var negativeTimestamp = db.createTimestamp('-1');

  before(function(done) {
    this.timeout(10000);
    db.documents.write({
      uri: '/pitq/query/matchDir/doc1.json',
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
        values: [{score: 56.7}, {rate: 3}],
        p: 'Vannevar Bush wrote an article for The Atlantic Monthly'
        }
      }, {
      uri: '/pitq/query/matchDir/doc2.json',
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
        values: [{score: 92.45}, {rate: 5}],
        p: 'The Bush article described a device called a Memex'
        }
      }, {
      uri: '/pitq/query/matchDir/doc3.json',
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
        values: [{score: 33.56}, {rate: 1}],
        p: 'For 1945, the thoughts expressed in the Atlantic Monthly were groundbreaking'
        }
      }, {
      uri: '/pitq/query/matchDir/doc4.json',
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
        values: [{score: 12.34}, {rate: 3}],
        p: 'Vannevar served as a prominent policymaker and public intellectual'
        }
      }, {
        uri: '/pitq/query/matchList/doc5.json',
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
          values: [{score: 77.678}, {rate: 2}],
          p: 'The Memex, unfortunately, had no automated search feature'
          }
        },{
         uri: '/pitq/query/matchList/doc6.xml',
         collections: ['matchList'],
         contentType: 'application/xml',
         content: '<Employee><name>John</name></Employee>'
      }, {
         uri: '/pitq/query/matchList/doc7.xml',
         collections: ['matchList'],
         contentType: 'application/xml',
         content: '<Employee xmlns="http://aaa.com" ><firstname>John</firstname><id>0081</id></Employee>'
    }).result(function(response){done();}, done);
  });

  it('query document with different timestamp scenarios', function(done) {
    var timestamp = db.createTimestamp();
    // values read with correct timestamp
    db.values.read(
      t.fromIndexes(
        t.range('score', 'xs:double')
      ).
      where(
        t.word('title', 'bush')
      ),
      timestamp
    )
    .result(function(response) {
      //console.log(JSON.stringify(document, null, 2));
      var strData = JSON.stringify(response);
      strData.should.containEql('"frequency":1,"distinct-value":["56.7"]');
      strData.should.containEql('"frequency":1,"distinct-value":["92.45"]');

      // values read with negative timestamp
      return db.values.read(
        t.fromIndexes(
          t.range('score', 'xs:double')
        ).
        where(
          t.word('title', 'bush')
        ),
        negativeTimestamp
      ).result();
    })
    .then(function(response) {
      response.should.equal('SHOULD HAVE FAILED');
      done();
    }, function(error) {
      //console.log(JSON.stringify(error, null, 2));
      error.body.errorResponse.message.should.equal('XDMP-RWINVAL: $0 -1 set-transaction-timestamp');

      // values read with zero timestamp
      return db.values.read(
        t.fromIndexes(
          t.range('score', 'xs:double')
        ).
        where(
          t.word('title', 'bush')
        ),
        zeroTimestamp
      ).result();
    })
    .then(function(response) {
      response.should.equal('SHOULD HAVE FAILED');
      done();
    }, function(error) {
      //console.log(JSON.stringify(error, null, 2));
      error.body.errorResponse.message.should.equal('XDMP-RWINVAL0: The value of expression \'$0\'  is required to be non-zero in rule: set-transaction-timestamp');

      // values read with old timestamp
      return db.values.read(
        t.fromIndexes(
          t.range('score', 'xs:double')
        ).
        where(
          t.word('title', 'bush')
        ),
        oldTimestamp
      ).result();
    })
    .then(function(response) {
      response.should.equal('SHOULD HAVE FAILED');
      done();
    }, function(error) {
      //console.log(JSON.stringify(error, null, 2));
      error.body.errorResponse.message.should.containEql('Timestamp too old');

      // values read with correct timestamp again
      return db.values.read(
        t.fromIndexes(
          t.range('score', 'xs:double')
        ).
        where(
          t.word('title', 'bush')
        ),
        timestamp
      ).result();
    })
    .then(function(response) {
      done();
      //console.log(JSON.stringify(response, null, 2));
      var strData = JSON.stringify(response);
      strData.should.containEql('"frequency":1,"distinct-value":["56.7"]');
      strData.should.containEql('"frequency":1,"distinct-value":["92.45"]');
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
