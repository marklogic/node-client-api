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

var fs = require('fs');
var bigInt = require('big-integer');
var valcheck = require('core-util-is');
var concatStream = require('concat-stream');

var testconfig = require('../etc/test-config-qa.js');

var marklogic = require('../');
var q = marklogic.queryBuilder;
var t = marklogic.valuesBuilder;

var db = marklogic.createDatabaseClient(testconfig.restWriterConnection);
var dbReader = marklogic.createDatabaseClient(testconfig.restReaderConnection);
var dbAdmin = marklogic.createDatabaseClient(testconfig.restAdminConnection);

describe('Graphs PITQ Test', function() {

  var graphUri   = 'marklogic.com/stream/people';
  var graphPath  = __dirname + '/data/people.ttl';
  var sparqlPath = __dirname + '/data/people.rq';
  var defGraphUri = 'http://marklogic.com/semantics#default-graph';

  var oldTimestamp = db.createTimestamp('123');
  var zeroTimestamp = db.createTimestamp('0');
  var negativeTimestamp = db.createTimestamp('-1');

  it('should write the default graph', function(done){
    this.timeout(10000);
    db.graphs.write('text/turtle', fs.createReadStream(graphPath)).
    result(function(response){
      //console.log(JSON.stringify(response, null, 2));
      response.defaultGraph.should.equal(true);
      done();
    }, done);
  });

  it('read graphs with different timestamp scenarios', function(done) {
    this.timeout(30000);
    var timestamp = db.createTimestamp();
    // graphs read with correct timestamp
    db.graphs.read({
      contentType: 'application/json',
      timestamp: timestamp
    })
    .result(function(response) {
      //console.log(JSON.stringify(response, null, 2));
      var strResponse = JSON.stringify(response);
      strResponse.should.containEql('http://people.org/person15');

      // graphs read with negative timestamp
      return db.graphs.read({
        contentType: 'application/json',
        timestamp: negativeTimestamp
      }).result();
    })
    .then(function(response) {
      response.should.equal('SHOULD HAVE FAILED');
      done();
    }, function(error) {
      //console.log(JSON.stringify(error, null, 2));
      error.body.errorResponse.message.should.equal('XDMP-RWINVAL: $0 -1 set-transaction-timestamp');

      // graphs read with zero timestamp
      return db.graphs.read({
        contentType: 'application/json',
        timestamp: zeroTimestamp
      }).result();
    })
    .then(function(response) {
      response.should.equal('SHOULD HAVE FAILED');
      done();
    }, function(error) {
      //console.log(JSON.stringify(error, null, 2));
      error.body.errorResponse.message.should.equal('XDMP-RWINVAL0: The value of expression \'$0\'  is required to be non-zero in rule: set-transaction-timestamp');

      // graphs read with old timestamp
      return db.graphs.read({
        contentType: 'application/json',
        timestamp: oldTimestamp
      }).result();
    })
    .then(function(response) {
      //console.log(JSON.stringify(response, null, 2));
      response.should.equal('SHOULD HAVE FAILED');
      done();
    }, function(error) {
      //console.log(JSON.stringify(error, null, 2));
      error.body.errorResponse.message.should.containEql('Timestamp too old');

      // graphs read with correct timestamp again
      return db.graphs.read({
        contentType: 'application/json',
        timestamp: timestamp
      }).result();
    })
    .then(function(response) {
      done();
      //console.log(JSON.stringify(response, null, 2));
      var strResponse = JSON.stringify(response);
      strResponse.should.containEql('http://people.org/person15');
    }, done);
  });

  it('list graphs with different timestamp scenarios', function(done) {
    this.timeout(10000);
    var timestamp = db.createTimestamp();
    // graphs list with correct timestamp
    db.graphs.list(timestamp)
    .result(function(collections) {
      //console.log(JSON.stringify(collections, null, 2));
      collections.some(function(collection){
        return collection === defGraphUri;
      }).should.equal(true);

      // graphs list with negative timestamp
      return db.graphs.list(negativeTimestamp)
      .result();
    })
    .then(function(response) {
      response.should.equal('SHOULD HAVE FAILED');
      done();
    }, function(error) {
      //console.log(JSON.stringify(error, null, 2));
      error.body.errorResponse.message.should.equal('XDMP-RWINVAL: $0 -1 set-transaction-timestamp');

      // graphs list with zero timestamp
      return db.graphs.list(zeroTimestamp).result();
    })
    .then(function(response) {
      response.should.equal('SHOULD HAVE FAILED');
      done();
    }, function(error) {
      //console.log(JSON.stringify(error, null, 2));
      error.body.errorResponse.message.should.equal('XDMP-RWINVAL0: The value of expression \'$0\'  is required to be non-zero in rule: set-transaction-timestamp');

      // graphs list with old timestamp
      return db.graphs.list(oldTimestamp).result();
    })
    .then(function(response) {
      //console.log(JSON.stringify(response, null, 2));
      response.should.equal('SHOULD HAVE FAILED');
      done();
    }, function(error) {
      //console.log(JSON.stringify(error, null, 2));
      error.body.errorResponse.message.should.containEql('Timestamp too old');

      // graphs list with correct timestamp again
      return db.graphs.list(timestamp).result();
    })
    .then(function(collections) {
      done();
      //console.log(JSON.stringify(collections, null, 2));
      collections.some(function(collection){
        return collection === defGraphUri;
      }).should.equal(true);
    }, done);
  });

  it('sparql graphs with different timestamp scenarios', function(done) {
    this.timeout(10000);
    var timestamp = db.createTimestamp();
    // graphs read with correct timestamp
    db.graphs.sparql({
      contentType: 'application/sparql-results+json',
      query: fs.createReadStream(sparqlPath),
      timestamp: timestamp
    })
    .result(function(response) {
      //console.log(JSON.stringify(response, null, 2));
      response.should.have.property('head');
      response.head.should.have.property('vars');
      response.head.vars.length.should.equal(2);
      response.head.vars[0].should.equal('personName1');
      response.head.vars[1].should.equal('personName2');
      response.should.have.property('results');
      response.results.should.have.property('bindings');
      var strResponse = JSON.stringify(response);
      //console.log(strResponse);
      strResponse.should.containEql('Person 1');
      strResponse.should.containEql('Person 2');

      // graphs sparql with negative timestamp
      return db.graphs.sparql({
        contentType: 'application/sparql-results+json',
        query: fs.createReadStream(sparqlPath),
        timestamp: negativeTimestamp
      }).result();
    })
    .then(function(response) {
      response.should.equal('SHOULD HAVE FAILED');
      done();
    }, function(error) {
      //console.log(JSON.stringify(error, null, 2));
      error.body.errorResponse.message.should.equal('XDMP-RWINVAL: $0 -1 set-transaction-timestamp');

      // graphs sparql with zero timestamp
      return db.graphs.sparql({
        contentType: 'application/sparql-results+json',
        query: fs.createReadStream(sparqlPath),
        timestamp: zeroTimestamp
      }).result();
    })
    .then(function(response) {
      response.should.equal('SHOULD HAVE FAILED');
      done();
    }, function(error) {
      //console.log(JSON.stringify(error, null, 2));
      error.body.errorResponse.message.should.equal('XDMP-RWINVAL0: The value of expression \'$0\'  is required to be non-zero in rule: set-transaction-timestamp');

      // graphs sparql with old timestamp
      return db.graphs.sparql({
        contentType: 'application/sparql-results+json',
        query: fs.createReadStream(sparqlPath),
        timestamp: oldTimestamp
      }).result();
    })
    .then(function(response) {
      //console.log(JSON.stringify(response, null, 2));
      response.should.equal('SHOULD HAVE FAILED');
      done();
    }, function(error) {
      //console.log(JSON.stringify(error, null, 2));
      error.body.errorResponse.message.should.containEql('Timestamp too old');

      // graphs sparql with correct timestamp again
      return db.graphs.sparql({
        contentType: 'application/sparql-results+json',
        query: fs.createReadStream(sparqlPath),
        timestamp: timestamp
      }).result();
    })
    .then(function(response) {
      done();
      //console.log(JSON.stringify(response, null, 2));
      response.should.have.property('head');
      response.head.should.have.property('vars');
      response.head.vars.length.should.equal(2);
      response.head.vars[0].should.equal('personName1');
      response.head.vars[1].should.equal('personName2');
      response.should.have.property('results');
      response.results.should.have.property('bindings');
      var strResponse = JSON.stringify(response);
      //console.log(strResponse);
      strResponse.should.containEql('Person 1');
      strResponse.should.containEql('Person 2');
    }, done);
  });

  it('should delete the graph', function(done){
    this.timeout(10000);
    db.graphs.remove().
    result(function(response){
      done();
    }, done);
  });

});
