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

describe('default graph test', function(){
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

  it('should read the default graph', function(done){
    this.timeout(10000);
    db.graphs.read('application/json').
    result(function(response){
      //console.log(JSON.stringify(response, null, 2))
      var strResponse = JSON.stringify(response);
      strResponse.should.containEql('http://people.org/person15');
      done();
    }, done);
  });

  it('should check the default graph', function(done){
    this.timeout(10000);
    db.graphs.probe().
    result(function(response){
      //console.log(JSON.stringify(response, null, 2))
      response.should.have.property('graph');
      response.should.have.property('exists');
      response.exists.should.equal(true);
      response.defaultGraph.should.equal(true);
      done();
    }, done);
  });

  it('should list the graph', function(done){
    this.timeout(10000);
    db.graphs.list(). 
    result(function(collections){
      collections.some(function(collection){
        return collection === defGraphUri;
        }).should.equal(true);
      done();
    }, done);
  });

  it('should run a SPARQL query against the default graph', function(done){
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
      done();
    }, done);
  });

  it('should run another SPARQL query against the default graph', function(done){
    this.timeout(10000);
    var myQuery = "PREFIX foaf: <http://xmlns.com/foaf/0.1/>" +
                  "PREFIX ppl:  <http://people.org/>" +
                  "SELECT *" +
                  "WHERE { ?s foaf:knows ppl:person8 }" 
    db.graphs.sparql({
      contentType: 'application/sparql-results+json', 
      //query: fs.createReadStream(sparqlPath2)
      query: myQuery
    }).
    result(function(response){
      //console.log(JSON.stringify(response, null, 2));
      response.results.bindings[0].s.value.should.equal('http://people.org/person6');
      done();
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
