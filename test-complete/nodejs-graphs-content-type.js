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

describe('content type graph test', function(){
  var graphUri   = 'http://marklogic.com/graphs/content#type';
  var graphPath  = './node-client-api/test-complete/data/mlgraph.ttl';

  before('should write the graph', function(done){
    this.timeout(10000);
    db.graphs.write({uri: graphUri, contentType: 'text/turtle', data: fs.createReadStream(graphPath)}).
    result(function(response){
      //console.log(JSON.stringify(response, null, 4));
      done();
    }, done);
  });

  it('should read the graph on application/rdf+json', function(done){
    this.timeout(10000);
    db.graphs.read({contentType: 'application/rdf+json', uri: graphUri}).
    result(function(response){
      //console.log(JSON.stringify(response, null, 2));
      response['http://marklogicsparql.com/id#1111']['http://marklogicsparql.com/addressbook#lastName'][0].value.should.equal('Snelson');
      done();
    }, done);
  });

  it('should read the graph on text/turtle', function(done){
    this.timeout(10000);
    db.graphs.read({contentType: 'text/turtle', uri: graphUri}).
    result(function(response){
      //console.log(JSON.stringify(response, null, 2));
      response.should.containEql('@prefix p0: <http://marklogicsparql.com/addressbook#>');
      done();
    }, done);
  });

  it('should read the graph on application/rdf+xml', function(done){
    this.timeout(10000);
    db.graphs.read({contentType: 'application/rdf+xml', uri: graphUri}).
    result(function(response){
      //console.log(JSON.stringify(response, null, 2));
      response.should.containEql('<rdf:Description rdf:about=\"http://marklogicsparql.com/LeadEngineer\">');
      done();
    }, done);
  });

  it('should read the graph on text/n3', function(done){
    this.timeout(10000);
    db.graphs.read({contentType: 'text/n3', uri: graphUri}).
    result(function(response){
      //console.log(JSON.stringify(response, null, 2))
      response.should.containEql('@prefix p0: <http://marklogicsparql.com/addressbook#>');
      done();
    }, done);
  });

  it('should read the graph on application/n-quads', function(done){
    this.timeout(10000);
    db.graphs.read({contentType: 'application/n-quads', uri: graphUri}).
    result(function(response){
      //console.log(JSON.stringify(response, null, 2));
      response.should.containEql('<http://marklogicsparql.com/id#1111> <http://marklogicsparql.com/addressbook#firstName> \"John\" ');
      done();
    }, done);
  });

  it('should read the graph on application/n-triples', function(done){
    this.timeout(10000);
    db.graphs.read({contentType: 'application/n-triples', uri: graphUri}).
    result(function(response){
      //console.log(JSON.stringify(response, null, 2));
      response.should.containEql('<http://marklogicsparql.com/id#1111> <http://marklogicsparql.com/addressbook#firstName> \"John\" .');
      done();
    }, done);
  });

  /*it('should read the graph on trig', function(done){
    this.timeout(10000);
    db.graphs.read({contentType: 'application/trig', uri: graphUri}).
    result(function(response){
      console.log(JSON.stringify(response, null, 2))
      //response.should.containEql('<http://marklogicsparql.com/id#1111> <http://marklogicsparql.com/addressbook#firstName> \"John\" .');
      done();
    }, done);
  });*/

  it('should run SPARQL query with application/sparql-results+xml content type', function(done){
    this.timeout(10000);
    var myQuery = "PREFIX ad: <http://marklogicsparql.com/addressbook#>" +
                  "SELECT *\n" +
                  "FROM <http://marklogic.com/graphs/content#type>\n" +
                  "WHERE {?s ad:firstName 'John'}"
    db.graphs.sparql({
      contentType: 'application/sparql-results+xml', 
      query: myQuery
    }).
    result(function(response){
      //console.log(JSON.stringify(response, null, 2));
      response.should.containEql('<binding name=\"s\"><uri>http://marklogicsparql.com/id#1111</uri></binding>');
      done();
    }, done);
  });

  it('should run SPARQL query with text/csv content type', function(done){
    this.timeout(10000);
    var myQuery = "PREFIX ad: <http://marklogicsparql.com/addressbook#>" +
                  "SELECT *\n" +
                  "FROM <http://marklogic.com/graphs/content#type>\n" +
                  "WHERE {?s ad:firstName 'John'}"
    db.graphs.sparql({
      contentType: 'text/csv', 
      query: myQuery
    }).
    result(function(response){
      //console.log(JSON.stringify(response, null, 2));
      response.should.containEql('s\r\nhttp://marklogicsparql.com/id#1111');
      done();
    }, done);
  });

  it('should run SPARQL query with text/html content type', function(done){
    this.timeout(10000);
    var myQuery = "PREFIX ad: <http://marklogicsparql.com/addressbook#>" +
                  "SELECT *\n" +
                  "FROM <http://marklogic.com/graphs/content#type>\n" +
                  "WHERE {?s ad:firstName 'John'}"
    db.graphs.sparql({
      contentType: 'text/html', 
      query: myQuery
    }).
    result(function(response){
      //console.log(JSON.stringify(response, null, 2));
      response.should.containEql('<title>SPARQL results</title>');
      response.should.containEql('<a href=\"/v1/graphs/things?iri=http%3a//marklogicsparql.com/id%231111\">http://marklogicsparql.com/id#1111</a>');
      done();
    }, done);
  });

  it('should run SPARQL query with n-triples content type', function(done){
    this.timeout(10000);
    var myQuery = "DESCRIBE <http://marklogicsparql.com/id#1111>"
    db.graphs.sparql({
      contentType: 'application/n-triples', 
      query: myQuery
    }).
    result(function(response){
      //console.log(JSON.stringify(response, null, 2));
      response.should.containEql('<http://marklogicsparql.com/id#1111> <http://marklogicsparql.com/worksOn> <http://marklogicsparql.com/Inference> .');
      done();
    }, done);
  });

  it('should run SPARQL query with n-quads content type', function(done){
    this.timeout(10000);
    var myQuery = "DESCRIBE <http://marklogicsparql.com/id#1111>"
    db.graphs.sparql({
      contentType: 'application/n-quads', 
      query: myQuery
    }).
    result(function(response){
      //console.log(JSON.stringify(response, null, 2));
      response.should.containEql('<http://marklogicsparql.com/id#1111> <http://marklogicsparql.com/worksOn> <http://marklogicsparql.com/Inference> ');
      done();
    }, done);
  });

  it('should run SPARQL query with sparql-results+json content type', function(done){
    this.timeout(10000);
    var myQuery = "DESCRIBE <http://marklogicsparql.com/id#1111>"
    db.graphs.sparql({
      contentType: 'application/sparql-results+json', 
      query: myQuery
    }).
    result(function(response){
      //console.log(JSON.stringify(response, null, 2));
      response.should.containEql('sem:triple(sem:iri(\"http://marklogicsparql.com/id#1111\"), sem:iri(\"http://marklogicsparql.com/worksOn\"), sem:iri(\"http://marklogicsparql.com/Inference\")),sem:triple(sem:iri(\"http://marklogicsparql.com/id#1111\"), sem:iri(\"http://www.w3.org/1999/02/22-rdf-syntax-ns#type\"), sem:iri(\"http://marklogicsparql.com/LeadEngineer\"))');
      done();
    }, done);
  });

  it('should run SPARQL query with rdf+xml content type', function(done){
    this.timeout(10000);
    var myQuery = "DESCRIBE <http://marklogicsparql.com/id#1111>"
    db.graphs.sparql({
      contentType: 'application/rdf+xml', 
      query: myQuery
    }).
    result(function(response){
      //console.log(JSON.stringify(response, null, 2));
      response.should.containEql('<LeadEngineer rdf:about=\"http://marklogicsparql.com/id#1111\" xmlns=\"http://marklogicsparql.com/\"><worksOn rdf:resource=\"http://marklogicsparql.com/Inference\"/>');
      done();
    }, done);
  });

  it('should delete the graph', function(done){
    this.timeout(10000);
    db.graphs.remove(graphUri).
    result(function(response){
      done();
    }, done);
  });
});
