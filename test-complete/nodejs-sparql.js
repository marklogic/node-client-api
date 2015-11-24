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
var dbAdmin = marklogic.createDatabaseClient(testconfig.restAdminConnection);

describe('sparql query tests', function () {

    var graphPath = './node-client-api/test-complete/data/people.ttl';
    var graphPath1 = './node-client-api/test-complete/data/inferenceData.nt';
    var ttlfile = './node-client-api/test-complete/data/tigers.ttl';
    var defGraphUri = 'http://marklogic.com/semantics#default-graph';

    it('should write the default graph', function (done) {
        this.timeout(10000);
        db.graphs.write('text/turtle', fs.createReadStream(graphPath)).
            result(function (response) {
                //console.log(JSON.stringify(response, null, 2));
                response.defaultGraph.should.equal(true);
                done();
            }, done);
    });

    it('should read the default graph', function (done) {
        this.timeout(10000);
        db.graphs.read('text/turtle').
            result(function (response) {
                response.should.containEql('@prefix foaf:');
                done();
            }, done);
    });


    it('should run SPARQL select query ', function (done) {
        this.timeout(10000);

        var myQuery = "PREFIX foaf: <http://xmlns.com/foaf/0.1/>" +
            "PREFIX ppl:  <http://people.org/>" +
            "SELECT ?o " +
            "WHERE { ?s foaf:knows ?o }";
        db.graphs.sparql({
            contentType: 'application/json',
            query: myQuery
        }).
            result(function (response) {
                response.results.bindings.length.should.equal(22);
                response.results.bindings[0].o.value.should.equal('http://people.org/person2');
                done();
            }, done);
    });

    it('should run SPARQL select query with begin and end', function (done) {
        this.timeout(10000);

        var myQuery = "PREFIX foaf: <http://xmlns.com/foaf/0.1/>" +
            "PREFIX ppl:  <http://people.org/>" +
            "SELECT ?o " +
            "WHERE { ?s foaf:knows ?o }";
        db.graphs.sparql({
            contentType: 'application/xml',
            query: myQuery,
            begin: 2,
            end: 3,
            limit: 5
        }).
            result(function (response) {
                var document = response;
                document.should.containEql('http://people.org/person5');
                done();
            }, done);
    });

    it('should run SPARQL select query without begin and only end ', function (done) {
        this.timeout(10000);

        var myQuery = "PREFIX foaf: <http://xmlns.com/foaf/0.1/>" +
            "PREFIX ppl:  <http://people.org/>" +
            "SELECT ?o " +
            "WHERE { ?s foaf:knows ?o }";
        db.graphs.sparql({
            contentType: 'application/json',
            query: myQuery,
            end: 3,
            limit: 5
        }).
            result(function (response) {
                response.results.bindings.length.should.equal(3);
                response.results.bindings[0].o.value.should.equal('http://people.org/person2');
                response.results.bindings[2].o.value.should.equal('http://people.org/person5');
                done();
            }, done);
    });

    it('should run SPARQL select query with begin and end -ve scenario', function (done) {
        this.timeout(50000);

        var myQuery = "PREFIX foaf: <http://xmlns.com/foaf/0.1/>" +
            "PREFIX ppl:  <http://people.org/>" +
            "SELECT ?o " +
            "WHERE { ?s foaf:knows ?o }";
        db.graphs.sparql({
            contentType: 'application/json',
            query: myQuery,
            begin: 3,
            end: 3
        }).
            result(function (response) {
                response.results.bindings.length.should.equal(0);
                done();
            }, done);
    });


//TODO: Update after issue  #215 is fixed

    it('should run SPARQL ASK query', function (done) {
        this.timeout(10000);
        var myQuery = "PREFIX foaf: <http://xmlns.com/foaf/0.1/>" +
            "PREFIX ppl:  <http://people.org/>" +
            "ASK WHERE { ?s foaf:knows ppl:person3 }";
        db.graphs.sparql({
            contentType: 'application/json',
            query: myQuery,
            defaultGraphs: 'http://marklogic.com/semantics#default-graph'
        }).
            result(function (response) {
                //console.log(response);
                response.boolean.should.equal(true);
                done();
            });
    });

    it('should run SPARQL ASK query return false', function (done) {
        this.timeout(10000);
        var myQuery = "PREFIX foaf: <http://xmlns.com/foaf/0.1/>" +
            "PREFIX ppl:  <http://people.org/>" +
            "ASK WHERE { ?s foaf:knows ppl:person30010 }";
        db.graphs.sparql({
            contentType: 'application/json',
            query: myQuery
        }).
            result(function (response) {
                response.boolean.should.equal(false);
                done();
            });
    });


    it('should run SPARQL DESCRIBE query  ', function (done) {
        this.timeout(10000);
        var myQuery = "PREFIX foaf: <http://xmlns.com/foaf/0.1/>" +
            "PREFIX ppl:  <http://people.org/>" +
            "describe <http://people.org/person11>";
        db.graphs.sparql({
            contentType: 'application/rdf+json',
            query: myQuery
        }).
            result(function (response) {
                response.should.have.property('http://people.org/person11');
                response['http://people.org/person11']['http://www.w3.org/1999/02/22-rdf-syntax-ns#type'][0].should.have.property('value');
                response['http://people.org/person11']['http://www.w3.org/1999/02/22-rdf-syntax-ns#type'][0].value.should.equal('http://people.org/Person');
                response['http://people.org/person11']['http://www.w3.org/1999/02/22-rdf-syntax-ns#type'][0].type.should.equal('uri');
                response['http://people.org/person11']['http://xmlns.com/foaf/0.1/name'][0].value.should.equal('Person 11');
                done();
            }, done);
    });

    it('should run SPARQL DESCRIBE query return empty', function (done) {
        this.timeout(10000);
        var myQuery = "describe <http://people.org/person1133423>";
        db.graphs.sparql({
            contentType: 'application/json',
            query: myQuery
        }).
            result(function (response) {
                //console.log(response);
                response.results.bindings.length.should.equal(0);
                done();
            });
    });


    it('should write named graph ', function (done) {
        this.timeout(10000);
        db.graphs.write('http://marklogic.com/Graph1', 'text/turtle', fs.createReadStream(ttlfile)).
            result(function (response) {
                //console.log(JSON.stringify(response, null, 2));
                //console.log(response);
                response.defaultGraph.should.equal(false);
                response.graph.should.equal('http://marklogic.com/Graph1');
                response.graphType.should.equal('named');
                done();
            }, done);
    });

    it('should run SPARQL CONSTRUCT query  ', function (done) {
        this.timeout(10000);
        var myQuery = "PREFIX  bb: <http://marklogic.com/baseball/players#> CONSTRUCT { ?ID ?p \"coach\" .}" +
            " WHERE { ?ID ?p \"coach\" . ?ID bb:firstname ?firstname . Values ?firstname {\"Gene\"}}";
        db.graphs.sparql({
            contentType: 'application/rdf+json',
            query: myQuery
        }).
            result(function (response) {
                //console.log(response);
                response.should.have.property('http://marklogic.com/baseball/players#158');
                response['http://marklogic.com/baseball/players#158'].should.have.property('http://marklogic.com/baseball/players#position');
                response['http://marklogic.com/baseball/players#158']['http://marklogic.com/baseball/players#position'][0].should.have.property('value');
                response['http://marklogic.com/baseball/players#158']['http://marklogic.com/baseball/players#position'].length.should.equal(1);
                response['http://marklogic.com/baseball/players#158']['http://marklogic.com/baseball/players#position'][0].value.should.equal('coach');
                response['http://marklogic.com/baseball/players#158']['http://marklogic.com/baseball/players#position'][0].type.should.equal('literal');
                done();
            }, done);
    });

    it('should run SPARQL CONSTRUCT query with binding ', function (done) {
        this.timeout(10000);
        var myQuery = "PREFIX  bb: <http://marklogic.com/baseball/players#> CONSTRUCT{ ?ID bb:position ?o .}  " +
            " WHERE {GRAPH ?g { ?ID bb:position ?o .?ID bb:firstname ?firstname .}} order by $ID  ?o";
        db.graphs.sparql({
            namedGraphs: 'http://marklogic.com/Graph1',
            contentType: 'application/rdf+json',
            query: myQuery,
            bindings: {firstname: {value: 'Bryan', type: 'string'}}
        }).
            result(function (response) {
                //console.log(response);
                response.should.have.property('http://marklogic.com/baseball/players#121');
                response['http://marklogic.com/baseball/players#121'].should.have.property('http://marklogic.com/baseball/players#position');
                response['http://marklogic.com/baseball/players#121']['http://marklogic.com/baseball/players#position'][0].should.have.property('value');
                response['http://marklogic.com/baseball/players#121']['http://marklogic.com/baseball/players#position'].length.should.equal(1);
                response['http://marklogic.com/baseball/players#121']['http://marklogic.com/baseball/players#position'][0].value.should.equal('catcher');
                response['http://marklogic.com/baseball/players#121']['http://marklogic.com/baseball/players#position'][0].type.should.equal('literal');
                done();
            }, done);
    });


    it('should run SPARQL SELECT Query With BASE URI and OptimizeLevel ', function (done) {
        this.timeout(10000);
        var myQuery = " SELECT ?o WHERE  { <#107> <#lastname> ?o }";
        db.graphs.sparql({
            base: 'http://marklogic.com/baseball/players',
            contentType: 'application/rdf+json',
            optimizeLevel: 2,
            query: myQuery
        }).
            result(function (response) {
                //console.log(response);
                response.head.should.have.property('vars');
                response.head.vars.length.should.equal(1);
                response.head.vars[0].should.equal('o');
                response.results.bindings.length.should.equal(1);
                response.results.bindings[0].should.have.property('o');
                response.results.bindings[0].o.value.should.equal('Nathan');
                response.results.bindings[0].o.type.should.equal('literal');
                done();
            }, done);
    });

//TODO: need to catch exception and pass the test
    /*
     it('should run SPARQL query with begin = -1', function(done) {
     var myQuery = "PREFIX foaf: <http://xmlns.com/foaf/0.1/>" +
     "PREFIX ppl:  <http://people.org/>" +
     "SELECT *" +
     "WHERE { ?s foaf:knows ppl:person3 }";
     db.graphs.sparql({
     contentType: 'application/json',
     query: myQuery,
     begin: -2,
     end: 2
     }).
     result(function(response) {
     done();
     },
     function(error) {
     //   console.log(error);
     done();
     });
     });

     */
    it('should delete the graph', function (done) {
        this.timeout(10000);
        db.graphs.remove().
            result(function (response) {
                //console.log(response);
                done();
            }, done);
    });


    it('should write the graph', function (done) {
        this.timeout(10000);
        var graphURI = "http://marklogic.com/dirgraph1";
        db.graphs.write({
            uri: graphURI,
            repair: false,
            contentType: 'application/n-triples',
            data: fs.createReadStream(graphPath1)
        }).
            result(function (response) {
                //console.log(JSON.stringify(response));
                response.should.have.property('graph');
                response.graph.should.equal(graphURI);
                done();
            }, done);
    });

    it('should run SPARQL SELECT Query With Ruleset equivalentClass.rules ', function (done) {
        this.timeout(10000);
        var myQuery = " SELECT  (count (?s)  as ?totalcount) WHERE {GRAPH ?g { ?s ?p ?o .}}";
        db.graphs.sparql({
            contentType: 'application/json',
            rulesets: 'equivalentClass.rules',
            defaultRulesets: 'include',
            namedGraphs: 'http://marklogic.com/dirgraph1',
            query: myQuery
        }).
            result(function (response) {
                //console.log(JSON.stringify(response));
                response.results.bindings[0].should.have.property('totalcount');
                response.results.bindings[0].totalcount.value.should.equal('15');
                done();
            }, done);
    });

    it('should run SPARQL SELECT Query With Ruleset equivalentProperty.rules ', function (done) {
        this.timeout(10000);
        var myQuery = " SELECT  (count (?s)  as ?totalcount) WHERE {GRAPH ?g { ?s ?p ?o .}}";
        db.graphs.sparql({
            contentType: 'application/json',
            rulesets: 'equivalentProperty.rules',
            defaultRulesets: 'include',
            namedGraphs: 'http://marklogic.com/dirgraph1',
            query: myQuery
        }).
            result(function (response) {
                //console.log(JSON.stringify(response));
                response.results.bindings[0].should.have.property('totalcount');
                response.results.bindings[0].totalcount.value.should.equal('23');
                done();
            }, done);
    });

    /*
     // githubIssue #214 : null not supported in array

     it('should run SPARQL SELECT Query With DefaultRuleset include and one of rulesets set to null ', function(done){
     this.timeout(10000);
     var myQuery = " SELECT  (count (?s)  as ?totalcount) WHERE {GRAPH ?g { ?s ?p ?o .}}";
     db.graphs.sparql({
     contentType: 'application/json',
     rulesets:['equivalentClass.rules', null],
     defaultRulesets: 'include',
     namedGraphs: 'http://marklogic.com/dirgraph1',
     query: myQuery
     }).
     result(function(response){
     console.log(JSON.stringify(response));
     response.results.bindings[0].should.have.property('totalcount');
     response.results.bindings[0].totalcount.value.should.equal('15');
     done();
     }, done);
     });

     */
    it('should run SPARQL SELECT Query With DefaultRuleset include and null', function (done) {
        this.timeout(10000);
        var myQuery = " SELECT  (count (?s)  as ?totalcount) WHERE {GRAPH ?g { ?s ?p ?o .}}";
        db.graphs.sparql({
            contentType: 'application/json',
            rulesets: null,
            defaultRulesets: 'include',
            namedGraphs: 'http://marklogic.com/dirgraph1',
            query: myQuery
        }).
            result(function (response) {
                //console.log(JSON.stringify(response));
                response.results.bindings[0].should.have.property('totalcount');
                response.results.bindings[0].totalcount.value.should.equal('13');
                done();
            }, done);
    });

    it('should run SPARQL SELECT Query With multiple rulesets', function (done) {
        this.timeout(10000);
        var myQuery = " SELECT  (count (?s)  as ?totalcount) WHERE {GRAPH ?g { ?s ?p ?o .}}";
        db.graphs.sparql({
            contentType: 'application/json',
            rulesets: ['equivalentClass.rules', 'equivalentProperty.rules'],
            defaultRulesets: 'include',
            namedGraphs: 'http://marklogic.com/dirgraph1',
            query: myQuery
        }).
            result(function (response) {
                //console.log(JSON.stringify(response));
                response.results.bindings[0].should.have.property('totalcount');
                response.results.bindings[0].totalcount.value.should.equal('25');
                done();
            }, done);
    });


    it('should run SPARQL SELECT Query With defaultrulesets set to null', function (done) {
        this.timeout(10000);
        var myQuery = " SELECT  (count (?s)  as ?totalcount) WHERE {GRAPH ?g { ?s ?p ?o .}}";
        db.graphs.sparql({
            contentType: 'application/json',
            rulesets: ['equivalentClass.rules', 'equivalentProperty.rules'],
            defaultRulesets: null,
            namedGraphs: 'http://marklogic.com/dirgraph1',
            query: myQuery
        }).
            result(function (response) {
                //console.log(JSON.stringify(response));
                response.results.bindings[0].should.have.property('totalcount');
                response.results.bindings[0].totalcount.value.should.equal('25');
                done();
            }, done);
    });

});


describe('write document with embedded triple and run docQuery', function () {
    before(function (done) {
        this.timeout(10000);
        var writeStream = db.documents.createWriteStream({
            uri: '/test/docquery/query.xml',
            contentType: 'application/xml'
        });
        writeStream.result(function (response) {
            done();
        }, done);
        writeStream.write("<xml>" +
            "<test2>testValue</test2>" +
            "<sem:triples xmlns:sem='http://marklogic.com/semantics'>" +
            "<sem:triple>" +
            "<sem:subject>http://example.org/s2</sem:subject>" +
            "<sem:predicate>http://example.org/p2</sem:predicate>" +
            "<sem:object datatype='http://www.w3.org/2001/XMLSchema#string'>" +
            "test2</sem:object>" +
            "</sem:triple>" +
            "</sem:triples>" +
            "</xml>", 'utf8');
        writeStream.end();
    });

    it('should read back the value', function (done) {
        db.documents.query(q.where(q.term('testValue'))).
            result(function (documents) {
                //console.log(documents);
                documents.length.should.equal(1);
                done();
            }, done);
    });

    it('should run SPARQL query with docQuery', function (done) {
        this.timeout(10000);
        var myQuery = "SELECT ?o WHERE {?s ?p ?o .}";
        var docQuery = q.where(q.term('testValue'));
        db.graphs.sparql({
            contentType: 'application/json',
            query: myQuery,
            docQuery: docQuery
        }).
            result(function (response) {
                //console.log(JSON.stringify(response));
                response.results.bindings[0].should.have.property('o');
                response.results.bindings[0].o.value.should.equal('test2');
                done();
            }, done);
    });

    it('should run SPARQL query with docQuery', function (done) {
        this.timeout(10000);
        var myQuery = "ASK WHERE {?s ?p ?o .}";
        var docQuery = q.where(q.term('testValue'));
        db.graphs.sparql({
            contentType: 'application/json',
            query: myQuery,
            docQuery: docQuery
        }).
            result(function (response) {
                //console.log(response);
                response.boolean.should.equal(true);
                done();
            }, done);
    });

  it('should delete all documents', function(done){
    dbAdmin.documents.removeAll({
      all: true
    }).
    result(function(response) {
      done();
    }, done);
  });

  it('should drop all graphs', function(done){
    var myData = "DROP ALL ;"
    db.graphs.sparqlUpdate({
      data: myData
    }).
    result(function(response){
      //console.log(JSON.stringify(response, null, 2));
      done();
    }, done);
  });

});
