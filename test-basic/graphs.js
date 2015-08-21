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

var concatStream = require('concat-stream');
var valcheck     = require('core-util-is');

var testconfig = require('../etc/test-config.js');

var marklogic = require('../');
var q = marklogic.queryBuilder;

var db = marklogic.createDatabaseClient(testconfig.restWriterConnection);

describe('graph operations', function(){
  var graphUri   = 'marklogic.com/people';
  var graph2Uri  = 'marklogic.com/graph2';
  var graph3Uri  = 'marklogic.com/graph3';
  var graphPath  = './test-basic/data/people.ttl';
  var sparqlPath = './test-basic/data/people.rq';
  it('should write the default graph', function(done){
    this.timeout(3000);
    db.graphs.write('text/turtle', fs.createReadStream(graphPath))
    .result(function(response){
      response.should.have.property('defaultGraph');
      response.defaultGraph.should.equal(true);
      done();
      })
    .catch(done);
  });
  it('should read the default graph as JSON', function(done){
    db.graphs.read('application/rdf+json')
    .result(function(data){
      (!valcheck.isNullOrUndefined(data)).should.equal(true);
      var personIds = Object.keys(data);
      personIds.length.should.equal(20);
      done();
      })
    .catch(done);
  });
  it('should read the default graph as n3', function(done){
    db.graphs.read('text/n3')
    .result(function(data){
      (!valcheck.isNullOrUndefined(data)).should.equal(true);
      done();
      })
    .catch(done);
  });
  it('should list the default graph', function(done){
    db.graphs.list()
    .result(function(collections){
      collections.some(function(collection){
        return collection === 'http://marklogic.com/semantics#default-graph';
        }).should.equal(true);
      done();
      })
    .catch(done);
  });
  it('should delete the default graph', function(done){
    db.graphs.remove()
    .result(function(response){
      done();
      })
    .catch(done);
  });
/* TODO:
   get output as application/rdf+json to verify, test merge
 */
  it('should write a named graph as a stream', function(done){
    this.timeout(3000);
    var writer = db.graphs.createWriteStream({
      uri:         graphUri,
      contentType: 'text/turtle',
      permissions: [
          {'role-name':'app-user',    capabilities:['read']},
          {'role-name':'app-builder', capabilities:['read', 'update']}]
      });
    writer.result(function(response){
      response.should.have.property('graph');
      response.graph.should.equal(graphUri);
      return db.graphs.read({
        uri:         graphUri,
        category:    'permissions',
        contentType: 'application/json'
        }).result();
      })
      .then(function(response){
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
        done();
      })
      .catch(done);
    fs.createReadStream(graphPath).pipe(writer);
  });
  it('should read the named graph as a stream', function(done){
    var graphReadStream  = db.graphs.read(graphUri, 'text/n3').stream('chunked');
    var graphAccumulator = concatStream({encoding: 'string'}, function(data) {
      (!valcheck.isNullOrUndefined(data)).should.equal(true);
      done();
    });
    graphReadStream.on('error', done);
    graphAccumulator.on('error', done);
    graphReadStream.pipe(graphAccumulator);
  });
  it('should check the named graph', function(done){
    db.graphs.probe(graphUri)
    .result(function(response){
      response.should.have.property('graph');
      response.graph.should.equal(graphUri);
      response.should.have.property('exists');
      response.exists.should.equal(true);
      done();
      })
    .catch(done);
  });
  it('should list the named graph', function(done){
    db.graphs.list()
    .result(function(collections){
      collections.some(function(collection){
        return collection === graphUri;
        }).should.equal(true);
      done();
      })
    .catch(done);
  });
  it('should run a SPARQL query', function(done){
    this.timeout(3000);
    db.graphs.sparql('application/sparql-results+json', fs.createReadStream(sparqlPath))
    .result(function(response){
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
      })
    .catch(done);
  });
  it('should delete the named graph', function(done){
    db.graphs.remove(graphUri)
    .result(function(response){
      done();
      })
    .catch(done);
  });
  it('should run a SPARQL update', function(done){
    this.timeout(3000);
    db.graphs.sparqlUpdate({
        usingNamedGraphs: true,
        permissions:      [
          {'role-name':'app-user',    capabilities:['read']},
          {'role-name':'app-builder', capabilities:['read', 'update']}],
        data:
          'INSERT DATA { GRAPH <'+graph2Uri+'> { <marklogic.com/r1> <marklogic.com/p1> "literal1" } }'
      })
    .result(function(response){
      return db.graphs.read({
        uri:         graph2Uri,
        category:    'permissions',
        contentType: 'application/json'
        }).result();
      })
    .then(function(response){
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
      return db.graphs.read(graph2Uri, 'application/rdf+json').result();
      })
    .then(function(response){
      response.should.have.property('marklogic.com/r1');
      response['marklogic.com/r1'].should.have.property('marklogic.com/p1');
      response['marklogic.com/r1']['marklogic.com/p1'].length.should.equal(1);
      response['marklogic.com/r1']['marklogic.com/p1'][0].should.have.property('value');
      response['marklogic.com/r1']['marklogic.com/p1'][0].value.should.equal('literal1');
      done();
      })
    .catch(done);
  });
  it('should run a bound SPARQL update', function(done) {
    this.timeout(3000);
    db.graphs.sparqlUpdate({
        usingNamedGraphs: true,
        data:
          'CREATE GRAPH <'+graph3Uri+'> ; '+
          'INSERT { GRAPH <'+graph3Uri+'> { ?s ?p "literal2" } } '+
          'WHERE  { GRAPH <'+graph2Uri+'> {?s ?p ?o. filter (?p = ?b1) } }',
        bindings: {
          b1: 'marklogic.com/p1',
          b2: {value:'a value', type:'string'}
          }
      })
    .result(function(response) {
      return db.graphs.read(graph3Uri, 'application/rdf+json').result();
      })
    .then(function(response) {
      response.should.have.property('marklogic.com/r1');
      response['marklogic.com/r1'].should.have.property('marklogic.com/p1');
      response['marklogic.com/r1']['marklogic.com/p1'].length.should.equal(1);
      response['marklogic.com/r1']['marklogic.com/p1'][0].should.have.property('value');
      response['marklogic.com/r1']['marklogic.com/p1'][0].value.should.equal('literal2');
      done();
      })
    .catch(done);
  });
  it('should delete the SPARQL update graph', function(done){
    db.graphs.remove(graph2Uri)
    .result(function(response){
      return db.graphs.remove(graph3Uri).result();
      })
    .then(function(response) {
      done();
      })
    .catch(done);
  });
});
