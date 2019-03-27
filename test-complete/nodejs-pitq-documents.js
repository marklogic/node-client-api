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

var db = marklogic.createDatabaseClient(testconfig.restWriterConnection);
var dbReader = marklogic.createDatabaseClient(testconfig.restReaderConnection);

describe('Document PITQ Test', function() {

  var docuri1 = '/pitq/test/doc1.json';
  var docuri2 = '/pitq/test/doc2.json';
  var oldTimestamp = db.createTimestamp('123');
  var zeroTimestamp = db.createTimestamp('0');
  var negativeTimestamp = db.createTimestamp('-1');

  before(function(done) {
    this.timeout(10000);
    db.documents.write({
      uri: docuri1,
      collections: ['coll0', 'coll1'],
      contentType: 'application/json',
      quality: 10,
      permissions: [
        {'role-name':'app-user', capabilities:['read', 'node-update']},
        {'role-name':'app-builder', capabilities:['read', 'update']}
      ],
      properties: {prop1:'foo', prop2:25},
      content: {id:12, name:'Jason'}
    }, {
      uri: docuri2,
      collections: ['coll0', 'coll1'],
      contentType: 'application/json',
      quality: 10,
      permissions: [
        {'role-name':'app-user', capabilities:['read', 'node-update']},
        {'role-name':'app-builder', capabilities:['read', 'update']}
      ],
      properties: {prop1:'bar', prop2:33},
      content: {id:245, name:'Paul'}
    }).result(function(response){done();}, done);
  });

  it('read document with different timestamp scenarios', function(done) {
    var timestamp = db.createTimestamp();
    // read with correct timestamp
    db.documents.read({
      uris: docuri1,
      categories:['content'],
      timestamp: timestamp
    })
    .result(function(response) {
      var document = response[0];
      //console.log(JSON.stringify(document, null, 2));
      document.content.name.should.equal('Jason');

      // read with negative timestamp
      return db.documents.read({
        uris: docuri1,
        timestamp: negativeTimestamp
      }).result();
    })
    .then(function(response) {
      response.should.equal('SHOULD HAVE FAILED');
      done();
    }, function(error) {
      //console.log(JSON.stringify(error, null, 2));
      error.body.errorResponse.message.should.equal('XDMP-RWINVAL: $0 -1 set-transaction-timestamp');

      // read with zero timestamp
      return db.documents.read({
        uris: docuri1,
        timestamp: zeroTimestamp
      }).result();
    })
    .then(function(response) {
      response.should.equal('SHOULD HAVE FAILED');
      done();
    }, function(error) {
      //console.log(JSON.stringify(error, null, 2));
      error.body.errorResponse.message.should.equal('XDMP-RWINVAL0: The value of expression \'$0\'  is required to be non-zero in rule: set-transaction-timestamp');

      // read with old timestamp
      return db.documents.read({
        uris: docuri1,
        timestamp: oldTimestamp
      }).result();
    })
    .then(function(response) {
      response.should.equal('SHOULD HAVE FAILED');
      done();
    }, function(error) {
      //console.log(JSON.stringify(error, null, 2));
      error.body.errorResponse.message.should.containEql('Timestamp too old');

      // read with correct timestamp again
      return db.documents.read({
        uris: docuri1,
        timestamp: timestamp
      }).result();
    })
    .then(function(response) {
      done();
      //console.log(JSON.stringify(document, null, 2));
      var document = response[0];
      document.content.name.should.equal('Jason');
    }, done);
  });

  it('query document with different timestamp scenarios', function(done) {
    var timestamp = db.createTimestamp();
    // query with correct timestamp
    db.documents.query(
      q.where(
        q.word('name', 'Jason')
      ),
      timestamp
    )
    .result(function(response) {
      var document = response[0];
      //console.log(JSON.stringify(document, null, 2));
      document.content.name.should.equal('Jason');

      // query with negative timestamp
      return db.documents.query(
        q.where(
          q.word('name', 'Jason')
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

      // query with zero timestamp
      return db.documents.query(
        q.where(
          q.word('name', 'Jason')
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

      // query with old timestamp
      return db.documents.query(
        q.where(
          q.word('name', 'Jason')
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

      // query with correct timestamp again
      return db.documents.query(
        q.where(
          q.word('name', 'Jason')
        ),
        timestamp
      ).result();
    })
    .then(function(response) {
      done();
      //console.log(JSON.stringify(document, null, 2));
      var document = response[0];
      document.content.name.should.equal('Jason');
    }, done);
  });

  it('should delete the document', function(done) {
    db.documents.remove(docuri1).result(function(document) {
      document.removed.should.eql(true);
      done();
    }, done);
  });

  it('should delete the document', function(done) {
    db.documents.remove(docuri2).result(function(document) {
      document.removed.should.eql(true);
      done();
    }, done);
  });

});
