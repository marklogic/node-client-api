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

var db = marklogic.createDatabaseClient(testconfig.restWriterConnection);

describe('when configuring resource services', function(){
  var graphUri   = 'marklogic.com/people';
  var graphPath  = './test-basic/data/people.ttl';
  var sparqlPath = './test-basic/data/people.rq';
  it('should write the graph', function(done){
    this.timeout(3000);
    fs.createReadStream(graphPath).
    pipe(concatStream({encoding: 'string'}, function(data) {
      db.graphs.write(graphUri, 'text/turtle', data).
      result(function(response){
        response.should.have.property('graph');
        response.graph.should.equal(graphUri);
        done();
      }, done);
    }));
  });
/* TODO:
get output as application/rdf+json to verify, test merge, streaming write and read
  it('should write the graph as a stream', function(done){
    this.timeout(3000);
    var writer = db.graphs.createWriteStream(graphUri, 'text/turtle');
    writer.result(function(response){
      response.should.have.property('graph');
      response.graph.should.equal(graphUri);
      done();
    }, done);
    fs.createReadStream(graphPath).pipe(writer);
  });
 */
  it('should read the graph', function(done){
    db.graphs.read('text/n3', graphUri).
    result(function(data){
      (!valcheck.isNullOrUndefined(data)).should.equal(true);
      done();
    }, done);
  });
  it('should check the graph', function(done){
    db.graphs.probe(graphUri).
    result(function(response){
      response.should.have.property('graph');
      response.graph.should.equal(graphUri);
      response.should.have.property('exists');
      response.exists.should.equal(true);
      done();
    }, done);
  });
  it('should list the graph', function(done){
    db.graphs.list(). 
    result(function(collections){
      collections.some(function(collection){
        return collection === graphUri;
        }).should.equal(true);
      done();
    }, done);
  });
  it('should run a SPARQL query against the graph', function(done){
    this.timeout(3000);
    fs.createReadStream(sparqlPath).
    pipe(concatStream({encoding: 'string'}, function(query) {
      db.graphs.sparql('application/sparql-results+json', query).
      result(function(response){
        response.should.have.property('head');
        response.head.should.have.property('vars');
        response.head.vars.length.should.equal(2);
        response.head.vars[0].should.equal('personName1');
        response.head.vars[1].should.equal('personName2');
        response.should.have.property('results');
        response.results.should.have.property('bindings');
        response.results.bindings[0].should.have.property('personName1');
        response.results.bindings[0].personName1.should.have.property('value');
        response.results.bindings[0].should.have.property('personName2');
        response.results.bindings[0].personName2.should.have.property('value');
        done();
      }, done);
    }));
  });
  it('should delete the graph', function(done){
    db.graphs.remove(graphUri).
    result(function(response){
      done();
    }, done);
  });
});
