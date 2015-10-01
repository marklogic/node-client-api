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
var fs = require('fs');

var testconfig = require('../etc/test-config-qa.js');

var marklogic = require('../');
var q = marklogic.queryBuilder;
var db = marklogic.createDatabaseClient(testconfig.restWriterConnection);

describe('Graphs transaction remove test', function() {
  var graphUri   = 'marklogic.com/tx/peoplerem';
  var graphPath  = './node-client-api/test-complete/data/people3.ttl';
  var graphPath2 = './node-client-api/test-complete/data/people4.ttl';
  
  var tid = 0;
  var tid2 = 0;

  it('should do graph transaction remove combo', function(done) {
    db.transactions.open({transactionName: 'sparqlTx', timeLimit: 30})
    .result(function(response) {
      //console.log('Opening transaction 1');
      //console.log(JSON.stringify(response, null, 2));
      tid = response.txid;
      return db.graphs.write({
        txid: tid,
        uri: graphUri,
        contentType: 'text/turtle',
        data: fs.createReadStream(graphPath),
        permissions: [
          {'role-name':'app-user',    capabilities:['read']},
          {'role-name':'app-builder', capabilities:['read', 'update']}
        ]
      }).result();
    })
    .then(function(response) {
      //console.log('Write graph with transaction 1');
      //console.log(JSON.stringify(response, null, 2));
      response.graph.should.equal('marklogic.com/tx/peoplerem');
      return db.graphs.read({
        uri: graphUri, 
        contentType: 'application/json', 
        txid: tid,
        category: 'content'
      }).result();
    })
    .then(function(response) {
      //console.log('Read graph content transaction 1');
      //console.log(JSON.stringify(response, null, 2));
      response.should.have.property('http://people.org/person1');
      return db.graphs.read({
        uri: graphUri, 
        contentType: 'application/json', 
        txid: tid,
        category: 'metadata'
      }).result();
    })
    .then(function(response) {
      //console.log('Read graph metadata transaction 1');
      //console.log(JSON.stringify(response, null, 2));
      var permissionsFound = 0;
      response.permissions.forEach(function(permission){
        switch (permission['role-name']) {
          case 'app-user':
            permissionsFound++;
            permission.capabilities.length.should.equal(1);
            permission.capabilities[0].should.equal('read');
            break;
          case 'app-builder':
            permissionsFound++;
            permission.capabilities.length.should.equal(2);
            permission.capabilities.should.containEql('read');
            permission.capabilities.should.containEql('update');
            break;
        }
      });
      permissionsFound.should.equal(2);
      return db.graphs.probe({uri: graphUri, txid: tid}).result();
    })
    .then(function(response) {
      //console.log('Probe graph transaction 1');
      //console.log(JSON.stringify(response, null, 2));
      response.exists.should.equal(true);
      response.graph.should.equal('marklogic.com/tx/peoplerem');
      return db.graphs.list({txid: tid}).result();
    })
    .then(function(response) {
      //console.log('List graph transaction 1');
      //console.log(JSON.stringify(response, null, 2));
      response.should.containEql('marklogic.com/tx/peoplerem');
      return db.graphs.merge({
        txid: tid,
        uri: graphUri,
        contentType: 'text/turtle',
        data: fs.createReadStream(graphPath2),
        permissions: [
          {'role-name':'app-user',    capabilities:['read']},
          {'role-name':'app-builder', capabilities:['read', 'update']}
        ]
      }).result();
    })
    .then(function(response) {
      //console.log('Merge graph transaction 1');
      //console.log(JSON.stringify(response, null, 2));
      response.graph.should.equal('marklogic.com/tx/peoplerem');
      return db.graphs.read({uri: graphUri, contentType: 'application/json', txid: tid}).result();
    })
    .then(function(response) {
      //console.log('Read merged graph transaction 1');
      //console.log(JSON.stringify(response, null, 2));
      response.should.have.property('http://people.org/person9');
      response.should.have.property('http://people.org/person12');
      return db.transactions.rollback(tid).result();
    })
    .then(function(response) {
      //console.log('Rollback transaction 1');
      //console.log(JSON.stringify(response, null, 2));
      response.finished.should.equal('rollback');
      return db.transactions.open({transactionName: 'sparqlTx2', timeLimit: 60}).result();
    })
    .then(function(response) {
      //console.log('Opening transaction 2');
      //console.log(JSON.stringify(response, null, 2));
      tid2 = response.txid;
      return db.graphs.write({
        txid: tid2,
        uri: graphUri,
        contentType: 'text/turtle',
        data: fs.createReadStream(graphPath),
        permissions: [
          {'role-name':'app-user',    capabilities:['read']},
          {'role-name':'app-builder', capabilities:['read', 'update']}
        ]
      }).result();
    })
    .then(function(response) {
      //console.log('Write graph transaction 2');
      //console.log(JSON.stringify(response, null, 2));
      response.graph.should.equal('marklogic.com/tx/peoplerem');
      return db.graphs.read({uri: graphUri, contentType: 'application/json', txid: tid2}).result(); 
    })
    .then(function(response) {
      //console.log('Read graph content transaction 2');
      //console.log(JSON.stringify(response, null, 2));
      response.should.have.property('http://people.org/person1');
      response.should.have.property('http://people.org/person2');
      return db.graphs.read({uri: graphUri, contentType: 'application/json', txid: tid2, category: 'permissions'}).result(); 
    })
    .then(function(response) {
      //console.log('Read graph permissions transaction 2');
      //console.log(JSON.stringify(response, null, 2));
      var permissionsFound = 0;
      response.permissions.forEach(function(permission){
        switch (permission['role-name']) {
          case 'app-user':
            permissionsFound++;
            permission.capabilities.length.should.equal(1);
            permission.capabilities[0].should.equal('read');
            break;
          case 'app-builder':
            permissionsFound++;
            permission.capabilities.length.should.equal(2);
            permission.capabilities.should.containEql('read');
            permission.capabilities.should.containEql('update');
            break;
        }
      });
      permissionsFound.should.equal(2);
      return db.graphs.remove({uri: graphUri, txid: tid2}).result();
    })
    .then(function(response) {
      //console.log('Remove graph transaction 2');
      //console.log(JSON.stringify(response, null, 2));
      response.graph.should.equal('marklogic.com/tx/peoplerem');
      return db.graphs.probe({uri: graphUri, txid: tid2}).result(); 
    })
    .then(function(response) {
      //console.log('Probe removed graph');
      //console.log(JSON.stringify(response, null, 2));
      response.exists.should.equal(false);
      return db.transactions.commit(tid2).result(); 
    })
    .then(function(response) {
      //console.log('Commit transaction 2');
      //console.log(JSON.stringify(response, null, 2));
      response.finished.should.equal('commit');
      return db.graphs.probe(graphUri).result(); 
    })
    .then(function(response) {
      //console.log('Probe removed committed graph');
      //console.log(JSON.stringify(response, null, 2));
      response.exists.should.equal(false);
      done();
    }, done);
    /*.catch(function(error) {
      console.log(error);
      done();
    }, done);*/
  });
});

