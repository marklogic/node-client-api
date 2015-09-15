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
var valcheck = require('core-util-is');

var testconfig = require('../etc/test-config-qa.js');

var marklogic = require('../');
var q = marklogic.queryBuilder;

var db = marklogic.createDatabaseClient(testconfig.restWriterConnection);

describe('sparql test', function(){
  var graphUri   = 'marklogic.com/defafult/people';
  var graphPath  = './node-client-api/test-complete/data/people.ttl';
  var sparqlPath = './node-client-api/test-complete/data/people.rq';
  var sparqlPath2 = './node-client-api/test-complete/data/people2.rq';
  var defGraphUri = 'http://marklogic.com/semantics#default-graph';

  it('should write the default graph', function(done){
    this.timeout(10000);
    db.graphs.write('text/turtle', fs.createReadStream(graphPath)).
    result(function(response){
      //console.log(JSON.stringify(response, null, 2));
      response.defaultGraph.should.equal(true);
      done();
    }, done);
  });

  it('should run SPARQL query with begin = 1', function(done){
    this.timeout(10000);
    var myQuery = "PREFIX foaf: <http://xmlns.com/foaf/0.1/>" +
                  "PREFIX ppl:  <http://people.org/>" +
                  "SELECT *" +
                  "WHERE { ?s foaf:knows ppl:person3 }" 
    db.graphs.sparql({
      contentType: 'application/sparql-results+json', 
      query: myQuery,
      begin: 1
    }).
    result(function(response){
      //console.log(JSON.stringify(response, null, 2));
      response.results.bindings[0].s.value.should.equal('http://people.org/person2');
      response.results.bindings.length.should.equal(1);
      done();
    }, done);
  });

  it('should run SPARQL query with end = 1', function(done){
    this.timeout(10000);
    var myQuery = "PREFIX foaf: <http://xmlns.com/foaf/0.1/>" +
                  "PREFIX ppl:  <http://people.org/>" +
                  "SELECT *" +
                  "WHERE { ?s foaf:knows ppl:person3 }" 
    db.graphs.sparql({
      contentType: 'application/sparql-results+json', 
      query: myQuery,
      begin: 0,
      end: 1
    }).
    result(function(response){
      //console.log(JSON.stringify(response, null, 2));
      response.results.bindings[0].s.value.should.equal('http://people.org/person1');
      response.results.bindings.length.should.equal(1);
      done();
    }, done);
  });

  it('should run SPARQL query with begin = -1', function(done){
    this.timeout(10000);
    var myQuery = "PREFIX foaf: <http://xmlns.com/foaf/0.1/>" +
                  "PREFIX ppl:  <http://people.org/>" +
                  "SELECT *" +
                  "WHERE { ?s foaf:knows ppl:person3 }" 
    db.graphs.sparql({
      contentType: 'application/sparql-results+json', 
      query: myQuery,
      begin: -1,
      end: 10
    }).
    result(function(response){
      //console.log(JSON.stringify(response, null, 2));
      response.should.equal('SHOULD HAVE FAILED');
      done();
    }, function(error) {
      console.log(error); 
      done();
    });
  });

  /*it('should run SPARQL query with docQuery', function(done){
    this.timeout(10000);
    var myQuery = "PREFIX foaf: <http://xmlns.com/foaf/0.1/>" +
                  "PREFIX ppl:  <http://people.org/>" +
                  "SELECT *" +
                  "WHERE { ?s foaf:knows ppl:person4 }" 
    db.graphs.sparql({
      contentType: 'application/sparql-results+json', 
      query: myQuery,
      begin: 0,
      end: 10
      //docQuery: q.where(q.term('Person 1'))
    }).
    result(function(response){
      console.log(JSON.stringify(response, null, 2));
      //response.results.bindings[0].s.value.should.equal('http://people.org/person1');
      //response.results.bindings.length.should.equal(1);
      done();
    }, done);
  });*/

  it('should delete the graph', function(done){
    this.timeout(10000);
    db.graphs.remove().
    result(function(response){
      done();
    }, done);
  });
});
