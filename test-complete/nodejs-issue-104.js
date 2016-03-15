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

describe('when executing write to default graph', function() {

  before('add triples to default graph', function(done) {
    done();
  });

  it('should add triples to default graph', function(done) {
    var triples = [
      '@prefix foaf: <http://xmlns.com/foaf/0.1/> .',
      '@prefix ppl: <http://people.org/> .',
      'ppl:person1 foaf:knows ppl:person2 .',
      'ppl:person1 foaf:knows ppl:person3 .',
      'ppl:person2 foaf:knows ppl:person3 .',
      'ppl:person1 a ppl:Person ;',
      ' foaf:name "Person 1" .',
      'ppl:person2 a ppl:Person ;',
      ' foaf:name "Person 2" .',
      'ppl:person3 a ppl:Person ;',
      ' foaf:name "Person 3" .',
    ];
     
    db.graphs.write({contentType: 'text/turtle', data: triples.join('\n')}).result(
      function(response) { 
        //console.log(response);
        // response.length.should.equal(docCount);
        response.should.have.properties('defaultGraph', 'graph');
        response.defaultGraph.should.equal(true);

       done();
      }, 
      function(error) {
        console.log(JSON.stringify(error, null, 2));

        done(error);
      }, 
      done);
  });

  it('should remove all triples', function(done) {
      dbAdmin.documents.removeAll({all: true}).
      result(function(response) {
        done();
      }, done);
  }); 
	  
});
