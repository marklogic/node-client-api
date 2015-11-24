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

describe('sparql update test', function(){
  var graphUri   = 'http://marklogic.com/sparqlupdate/people';
  var mlGraphUri   = 'http://marklogic.com/sparqlupdate/mladd';
  var mlGraphPath  = './node-client-api/test-complete/data/mlgraph.ttl';
  var inferGraphPath  = './node-client-api/test-complete/data/inferenceData.nt';

  before('should drop all graphs', function(done){
    var myData = "DROP ALL ;"
    db.graphs.sparqlUpdate({
      data: myData
    }).
    result(function(response){
      //console.log(JSON.stringify(response, null, 2));
      done();
    }, done);
  });

  it('should do sparql update on default graph', function(done){
    var myData = "PREFIX bb: <http://marklogic.com/baseball/players#>\n" +
                 "PREFIX bn: <http://marklogic.com/baseball/name#>\n" +
                 "PREFIX id: <http://marklogic.com/baseball/id#>\n" +
                 "INSERT DATA\n" +
                 "{\n" +
                 "  id:5 bb:playername bn:Sean .\n" +
                 "}"
    db.graphs.sparqlUpdate({
      data: myData,
      permissions: [
        {'role-name': 'app-user', capabilities:['read']},
        {'role-name': 'app-builder', capabilities:['read', 'update']}
      ],
      usingDefaultGraphs: true
    }).
    result(function(response){
      //console.log(JSON.stringify(response, null, 2));
      response.defaultGraph.should.equal(true);
      (response.graph === null).should.be.true;
      response.graphType.should.equal('default');
      done();
    }, done);
  });

  it('should read the default graph', function(done){
    db.graphs.read('application/json').
    result(function(response){
      //console.log(JSON.stringify(response, null, 2))
      response['http://marklogic.com/baseball/id#5']['http://marklogic.com/baseball/players#playername'][0].value.should.equal('http://marklogic.com/baseball/name#Sean')
      done();
    }, done);
  });

  it('should create the graph', function(done){
    var myData = "CREATE GRAPH <http://marklogic.com/sparqlupdate/people> ;"
    db.graphs.sparqlUpdate({
      data: myData,
      permissions: [
        {'role-name': 'app-user', capabilities:['read']},
        {'role-name': 'app-builder', capabilities:['read', 'update']}
      ],
      usingNamedGraph: true
    }).
    result(function(response){
      //console.log(JSON.stringify(response, null, 2));
      response.defaultGraph.should.equal(false);
      (response.graph === null).should.be.true;
      response.graphType.should.equal('inline');
      done();
    }, done);
  });

  it('should read the graph permissions', function(done){
    db.graphs.read({
      uri: graphUri,
      contentType: 'application/json',
      category: 'permissions'
    }).
    result(function(response){
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
      done();
    }, done);
  });

  it('should fail to create existing graph', function(done){
    var myData = "CREATE GRAPH <http://marklogic.com/sparqlupdate/people> ;"
    db.graphs.sparqlUpdate({
      data: myData,
      permissions: [
        {'role-name': 'app-user', capabilities:['read']},
        {'role-name': 'app-builder', capabilities:['read', 'update']}
      ],
      usingNamedGraph: true
    }).
    result(function(response){
      //console.log(JSON.stringify(response, null, 2));
      response.should.equal('SHOULD HAVE FAILED');
      done();
    }, function(error) {
      //console.log(error); 
      error.body.errorResponse.message.should.containEql('XDMP-SPQLGRAPHEXIST');
      done();
    });
  });

  it('should write to the existing graph', function(done){
    db.graphs.write({
      uri: 'http://marklogic.com/sparqlupdate/people', 
      contentType: 'text/turtle', 
      data: fs.createReadStream(mlGraphPath)
    }).
    result(function(response){
      //console.log(JSON.stringify(response, null, 4));
      done();
    }, done);
  });

  it('should run SPARQL query', function(done){
    var myQuery = "PREFIX ad: <http://marklogicsparql.com/addressbook#>\n" +
                  "PREFIX d:  <http://marklogicsparql.com/id#>\n" +
                  "SELECT DISTINCT ?person\n" +
                  "FROM <http://marklogic.com/sparqlupdate/people>\n" +
                  "WHERE\n" +
                  "{\n" +
                  "  ?person ad:firstName 'John' ;\n" +
                  "          ad:lastName  'Snelson' ;\n" +
                  "          ?p ?o .\n" +
                  "}"
    db.graphs.sparql({
      contentType: 'application/sparql-results+json', 
      query: myQuery
    }).
    result(function(response){
      //console.log(JSON.stringify(response, null, 2));
      response.results.bindings[0].person.value.should.equal('http://marklogicsparql.com/id#1111');
      response.results.bindings.length.should.equal(1);
      done();
    }, done);
  });

  it('should run SPARQL update with bindings', function(done){
    var myData = "PREFIX bb: <http://marklogic.com/baseball/players#>\n" +
                 "INSERT\n" +
                 "{\n" +
                 "  GRAPH <http://marklogic.com/sparqlupdate/baseball>\n" +
                 "  {\n" +
                 "    ?playertoken bb:id ?id .\n" +
                 "    ?playertoken bb:lastname ?lastname .\n" +
                 "    ?playertoken bb:firstname ?firstname .\n" +
                 "    ?playertoken bb:position ?position .\n" +
                 "    ?playertoken bb:number ?number .\n" +
                 "    ?playertoken bb:team ?team .\n" +
                 "  }\n" +
                 "}\n" +
                 "WHERE {}"
    db.graphs.sparqlUpdate({
      data: myData,
      bindings: {
        'playertoken': 'http://marklogic.com/baseball/players#417',
        'id': 417,
        'lastname': {value: 'Doolittle', type:'string'},
        'firstname' : 'Sean',
        'position': 'pitcher',
        'number': {value: 62, type:'integer'},
        'team': 'Giants'
      }
    }).
    result(function(response){
      //console.log(JSON.stringify(response, null, 2));
      done();
    }, done);
  });

  it('should run SPARQL query on bound data', function(done){
    var myQuery = "SELECT *\n" +
                  "FROM <http://marklogic.com/sparqlupdate/baseball>\n" +
                  "WHERE {?s ?p ?o}"
    db.graphs.sparql({
      contentType: 'application/sparql-results+json', 
      query: myQuery
    }).
    result(function(response){
      //console.log(JSON.stringify(response, null, 2));
      response.results.bindings.length.should.equal(6);
      done();
    }, done);
  });

  it('should not run SPARQL update without data', function(done){
    var myData = "PREFIX bb: <http://marklogic.com/baseball/players#>\n" +
                 "PREFIX bn: <http://marklogic.com/baseball/name#>\n" +
                 "PREFIX id: <http://marklogic.com/baseball/id#>\n" +
                 "INSERT DATA\n" +
                 "{\n" +
                 "  GRAPH <http://marklogic.com/sparqlupdate/baseball>\n" +
                 "  {\n" +
                 "    id:5 bb:playerid ?playerid .\n" +
                 "    ?playerid bn:playername ?playername .\n" +
                 "  }\n" +
                 "}"
    db.graphs.sparqlUpdate({
      bindings: {
        'playerid': '5',
        'playername': {value: 'Greg', type:'string'}
      }
    }).
    result(function(response){
      //console.log(JSON.stringify(response, null, 2));
      response.should.equal('SHOULD HAVE FAILED');
      done();
    }, function(error) {
      //console.log(error); 
      error.body.errorResponse.message.should.containEql('Invalid content: No query to execute');
      done();
    });
  });

  it('should do sparql update on with optimize', function(done){
    var myData = "PREFIX bb: <http://marklogic.com/baseball/players#>\n" +
                 "INSERT DATA\n" +
                 "{\n" +
                 "  GRAPH <http://marklogic.com/sparqlupdate/baseball>" +
                 "  {\n" +
                 "    bb:345 bb:id 345 .\n" +
                 "  }\n" +
                 "}"
    db.graphs.sparqlUpdate({
      data: myData,
      usingNamedGraphs: true,
      optimizeLevel: 0
    }).
    result(function(response){
      //console.log(JSON.stringify(response, null, 2));
      response.defaultGraph.should.equal(false);
      response.graphType.should.equal('named');
      done();
    }, done);
  });

  it('should not do sparql update on with invalid optimize value', function(done){
    var myData = "PREFIX bb: <http://marklogic.com/baseball/players#>\n" +
                 "INSERT DATA\n" +
                 "{\n" +
                 "  GRAPH <http://marklogic.com/sparqlupdate/baseball>" +
                 "  {\n" +
                 "    bb:345 bb:id 345 .\n" +
                 "  }\n" +
                 "}"
    db.graphs.sparqlUpdate({
      data: myData,
      optimizeLevel: -10
    }).
    result(function(response){
      //console.log(JSON.stringify(response, null, 2));
      response.should.equal('SHOULD HAVE FAILED');
      done();
    }, function(error) {
      //console.log(JSON.stringify(error, null, 2));
      error.body.errorResponse.message.should.containEql('Invalid type in optimize: -10 is not a value of type unsignedInt');
      done();
    });
  });

  /*TO BE VERIFIED it('should not do sparql update on with optimize value greater than 2', function(done){
    var myData = "PREFIX bb: <http://marklogic.com/baseball/players#>\n" +
                 "INSERT DATA\n" +
                 "{\n" +
                 "  GRAPH <http://marklogic.com/sparqlupdate/baseball>" +
                 "  {\n" +
                 "    bb:345 bb:id 345 .\n" +
                 "  }\n" +
                 "}"
    db.graphs.sparqlUpdate({
      data: myData,
      optimizeLevel: 3
    }).
    result(function(response){
      //console.log(JSON.stringify(response, null, 2));
      response.should.equal('SHOULD HAVE FAILED');
      done();
    }, function(error) {
      console.log(JSON.stringify(error, null, 2));
      //error.body.errorResponse.message.should.containEql('Invalid type in optimize: -10 is not a value of type unsignedInt');
      done();
    });
  });*/

  it('should do sparql update on with default ruleset graph', function(done){
    var myData = "PREFIX bb: <http://marklogic.com/baseball/players#>\n" +
                 "INSERT DATA\n" +
                 "{\n" +
                 "  GRAPH <http://marklogic.com/sparqlupdate/baseball>" +
                 "  {\n" +
                 "    bb:501 bb:id 501 .\n" +
                 "  }\n" +
                 "}"
    db.graphs.sparqlUpdate({
      data: myData,
      usingDefaultGraphs: false,
      usingNamedGraphs: true,
      defaultRulesets: 'exclude'
    }).
    result(function(response){
      //console.log(JSON.stringify(response, null, 2));
      response.defaultGraph.should.equal(false);
      response.graphType.should.equal('named');
      done();
    }, done);
  });

  var tid = 0;
  it('should do sparql update on with transaction', function(done){
    db.transactions.open({transactionName: 'sparqlUpdateTransaction', timeLimit: 30})
    .result(function(response) {
      tid = response.txid;  
      var myData = "PREFIX bb: <http://marklogic.com/baseball/players#>\n" +
                   "INSERT DATA\n" +
                   "{\n" +
                   "  GRAPH <http://marklogic.com/sparqlupdate/baseball>" +
                   "  {\n" +
                   "    bb:987 bb:id 987 .\n" +
                   "  }\n" +
                   "}"
     
      return db.graphs.sparqlUpdate({
        data: myData,
        txid: tid 
      }).result();
    })
    .then(function(response){
      //console.log(JSON.stringify(response, null, 2));
      var myQuery = "PREFIX bb: <http://marklogic.com/baseball/players#>\n" +
                    "SELECT *\n" +
                    "FROM <http://marklogic.com/sparqlupdate/baseball>\n" +
                    "WHERE {?s bb:id 987}"
      return db.graphs.sparql({
        contentType: 'application/sparql-results+json',
        query: myQuery,
        txid: tid
      }).result();
    })
    .then(function(response){
      //console.log(JSON.stringify(response, null, 2));
      response.results.bindings[0].s.value.should.equal('http://marklogic.com/baseball/players#987');
      return db.transactions.commit(tid).result();
    })
    .then(function(response) {
      //console.log(JSON.stringify(response, null, 2));i
      response.finished.should.equal('commit');
      done();
    }, done);
  });

  it('should run SPARQL query on committed data', function(done){
    var myQuery = "PREFIX bb: <http://marklogic.com/baseball/players#>\n" +
                  "SELECT *\n" +
                  "FROM <http://marklogic.com/sparqlupdate/baseball>\n" +
                  "WHERE {?s bb:id 987}"
    db.graphs.sparql({
      contentType: 'application/sparql-results+json', 
      query: myQuery
    }).
    result(function(response){
      //console.log(JSON.stringify(response, null, 2));
      response.results.bindings[0].s.value.should.equal('http://marklogic.com/baseball/players#987');
      done();
    }, done);
  });

  it('should do sparql update with base', function(done){
    var myData = "PREFIX bb: <http://marklogic.com/baseball/players#>\n" +
                 "INSERT DATA\n" +
                 "{\n" +
                 "  GRAPH <http://marklogic.com/sparqlupdate/baseball>" +
                 "  {\n" +
                 "    <#7878> bb:id 7878 .\n" +
                 "  }\n" +
                 "}"
    db.graphs.sparqlUpdate({
      data: myData,
      base: 'http://marklogic.com/baseball/players'
    }).
    result(function(response){
      //console.log(JSON.stringify(response, null, 2));
      done();
    }, done);
  });

  it('should run SPARQL query on inserted data with base', function(done){
    var myQuery = "PREFIX bb: <http://marklogic.com/baseball/players#>\n" +
                  "SELECT *\n" +
                  "FROM <http://marklogic.com/sparqlupdate/baseball>\n" +
                  "WHERE {?s bb:id 7878}"
    db.graphs.sparql({
      contentType: 'application/sparql-results+json', 
      query: myQuery
    }).
    result(function(response){
      //console.log(JSON.stringify(response, null, 2));
      response.results.bindings[0].s.value.should.equal('http://marklogic.com/baseball/players#7878');
      done();
    }, done);
  });

  it('should write graph for inference', function(done){
    db.graphs.write({
      uri: 'http://marklogic.com/sparqlupdate/infer', 
      contentType: 'application/n-triples', 
      data: fs.createReadStream(inferGraphPath)
    }).
    result(function(response){
      //console.log(JSON.stringify(response, null, 4));
      done();
    }, done);
  });

  it('should run SPARQL update with ruleset', function(done){
    var myData = "INSERT DATA\n" +
                 "{\n" +
                 "  GRAPH <http://marklogic.com/sparqlupdate/infer>" +
                 "  {\n" +
                 "    <http://marklogicsparql.com/id#3333> <http://marklogicsparql.com/addressbook#firstName> 'Mark' .\n" +
                 "  }\n" +
                 "}"
    db.graphs.sparqlUpdate({
      data: myData,
      usingNamedGraphs: true,
      rulesets: 'equivalentClass.rules',
      defaultRulesets: 'include'
    }).
    result(function(response){
      //console.log(JSON.stringify(response, null, 2));
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
