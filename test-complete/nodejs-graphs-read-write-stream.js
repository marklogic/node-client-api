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

var fs = require('fs');
var valcheck = require('core-util-is');
var concatStream = require('concat-stream');

var testconfig = require('../etc/test-config-qa.js');

var marklogic = require('../');
var q = marklogic.queryBuilder;

var db = marklogic.createDatabaseClient(testconfig.restWriterConnection);

describe('stream graph test', function(){
  var graphUri   = 'marklogic.com/stream/people';
  var graphPath  = './node-client-api/test-complete/data/people.ttl';
  var sparqlPath = './node-client-api/test-complete/data/people.rq';

  it('should write a new graph with stream', function(done){
    this.timeout(10000);
    var ws = db.graphs.createWriteStream(graphUri, 'text/turtle');
    ws.result(function(response) {
      //console.log(JSON.stringify(response, null, 4));
      response.should.have.property('graph');
      response.graph.should.equal(graphUri);
      done();
    }, done);
    fs.createReadStream(graphPath).pipe(ws);
  });

  it('should read graph as a stream', function(done){
    this.timeout(10000);
    db.graphs.read(graphUri, 'text/n3').stream('chunked').
    on('data', function(data) {
      //console.log(data.toString());
      var strData = data.toString();
      strData.should.containEql('p0:person1      a               p0:Person ;');
      strData.should.containEql('                foaf:knows      p0:person2 ;');
      (!valcheck.isNullOrUndefined(data)).should.equal(true);
      }).
    on('end', function() {
      done();
    }, done);
  });

  it('should list the graph', function(done){
    this.timeout(10000);
    db.graphs.list(). 
    result(function(collections){
      //console.log(collections);
      collections.some(function(collection){
        return collection === graphUri;
        }).should.equal(true);
      done();
    }, done);
  });

  it('should check the graph', function(done){
    this.timeout(10000);
    db.graphs.probe(graphUri).
    result(function(response){
      response.should.have.property('graph');
      response.graph.should.equal(graphUri);
      response.should.have.property('exists');
      response.exists.should.equal(true);
      done();
    }, done);
  });

  it('should run a SPARQL query against the graph', function(done){
    this.timeout(10000);
    db.graphs.sparql('application/sparql-results+json', fs.createReadStream(sparqlPath)).
    result(function(response){
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
      /*response.results.bindings[0].should.have.property('personName1');
      response.results.bindings[0].personName1.should.have.property('value');
      response.results.bindings[0].personName1.value.should.equal('Person 1');
      response.results.bindings[0].should.have.property('personName2');
      response.results.bindings[0].personName2.should.have.property('value');
      response.results.bindings[0].personName2.value.should.equal('Person 2');*/
      //console.log(JSON.stringify(response, null, 4))
      done();
    }, done);
  });

  it('should remove the graph', function(done){
    this.timeout(10000);
    db.graphs.remove(graphUri).
    result(function(response){
      done();
    }, done);
  });
});
