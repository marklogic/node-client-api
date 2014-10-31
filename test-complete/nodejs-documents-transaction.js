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

var db = marklogic.createDatabaseClient(testconfig.restWriterConnection);
var dbReader = marklogic.createDatabaseClient(testconfig.restReaderConnection);

describe('Document transaction test', function() {
  
  it('should commit the write document', function(done) {
    var tid = null;
    db.transactions.open().result().
    then(function(response) {
      tid = response.txid;
      return db.documents.write({
        txid: tid,
        uri: '/test/transaction/doc1.json',
        contentType: 'application/json',
        content: {firstname: "John", lastname: "Doe", txKey: tid}
      }).result();
    }).
    then(function(response) {
      return db.transactions.commit(tid).
      result(function(response) {done();}, done);
    });  
  });

  it('should read the commited document', function(done) {
      db.documents.read({uris:'/test/transaction/doc1.json'}).result().
      then(function(documents) {
        var document = documents[0];
        console.log(document.content.txKey);
        var tid = document.content.txKey;
        return db.documents.read({uris:'/test/transaction/doc1.json', txid:tid}).result();
      }).
      then(function(documents) {
        var document = documents[0];
        console.log(document.content.txKey);
        done();
      }, done);

  });

});
