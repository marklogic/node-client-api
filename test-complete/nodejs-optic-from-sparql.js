/*
 * Copyright 2014-2019 MarkLogic Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an AS IS BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

const expect = require('chai').expect;
const fs     = require('fs');

const marklogic = require('../');

const connectdef = require('../config-optic/connectdef.js');

const db = marklogic.createDatabaseClient(connectdef.plan);
const op = marklogic.planBuilder;

describe('Nodejs Optic from sparql test', function(){

  it('TEST 1 - simple sparql select with offsetLimit - format json, structure object, columnTypes header', function(done){
    const output =
      op.fromSPARQL("PREFIX foaf: <http://xmlns.com/foaf/0.1/> \
        PREFIX ppl:  <http://people.org/> \
        SELECT ?s ?o \
        WHERE { ?s foaf:knows ?o }")
      .offsetLimit(11, 15)
    db.rows.query(output, { format: 'json', structure: 'object', columnTypes: 'header' })
    .then(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.rows.length).to.equal(11);
      expect(output.columns[0].name).to.equal('s');
      expect(output.columns[0].type).to.equal('sem:iri');
      expect(output.rows[0].s).to.equal('http://people.org/person16');
      expect(output.rows[0].o).to.equal('http://people.org/person18');
      expect(output.rows[10].s).to.equal('http://people.org/person9');
      expect(output.rows[10].o).to.equal('http://people.org/person12');
      done();
    }, done);
  });

  it('TEST 2 - sparql select with multiple triple patterns - columnTypes rows', function(done){
    const output =
      op.fromSPARQL("PREFIX foaf: <http://xmlns.com/foaf/0.1/> \
        PREFIX ppl:  <http://people.org/> \
        SELECT * \
        WHERE { \
          ?person foaf:name ?name . \
          ?person <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> ?type . \
        }")
      .limit(5)
    db.rows.query(output, { format: 'json', structure: 'object', columnTypes: 'rows' })
    .then(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.rows.length).to.equal(5);
      expect(output.rows[0].person.value).to.equal('http://people.org/person1');
      expect(output.rows[0].person.type).to.equal('sem:iri');
      expect(output.rows[0].name.value).to.equal('Person 1');
      expect(output.rows[0].type.value).to.equal('http://people.org/Person');
      expect(output.rows[0].type.type).to.equal('sem:iri');
      done();
    }, done);
  });

  it('TEST 3 - sparql select with multiple triple patterns with condition - structure array', function(done){
    const output =
      op.fromSPARQL("PREFIX foaf: <http://xmlns.com/foaf/0.1/> \
        PREFIX ppl:  <http://people.org/> \
        SELECT ?personA ?personB \
        WHERE { \
          ?personB foaf:name 'Person 7' . \
          ?personA foaf:knows ?personB \
        }")
    db.rows.query(output, { format: 'json', structure: 'array', columnTypes: 'header' })
    .then(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.length).to.equal(2);
      expect(output[1][0]).to.equal('http://people.org/person1');
      expect(output[1][1]).to.equal('http://people.org/person7');
      done();
    }, done);
  });

  it('TEST 4 - sparql select with order by - format xml', function(done){
    const output =
      op.fromSPARQL("PREFIX foaf: <http://xmlns.com/foaf/0.1/> \
        PREFIX ppl:  <http://people.org/> \
        SELECT * \
        WHERE { \
          ?person foaf:name ?name . \
          ?person <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> ?type . \
        } \
        ORDER BY ?name")
      .limit(15)
      .offset(11)
    db.rows.query(output, { format: 'xml', structure: 'object', columnTypes: 'header' })
    .then(function(output) {
      //console.log(output);
      const outputStr = output.toString().trim().replace(/[\n\r]/g, '');
      //console.log(outputStr);
      expect(outputStr).to.equal('<t:table xmlns:t="http://marklogic.com/table"><t:columns><t:column name="person" type="sem:iri"/><t:column name="name" type="xs:string"/><t:column name="type" type="sem:iri"/></t:columns><t:rows><t:row><t:cell name="person">http://people.org/person2</t:cell><t:cell name="name">Person 2</t:cell><t:cell name="type">http://people.org/Person</t:cell></t:row><t:row><t:cell name="person">http://people.org/person20</t:cell><t:cell name="name">Person 20</t:cell><t:cell name="type">http://people.org/Person</t:cell></t:row><t:row><t:cell name="person">http://people.org/person3</t:cell><t:cell name="name">Person 3</t:cell><t:cell name="type">http://people.org/Person</t:cell></t:row><t:row><t:cell name="person">http://people.org/person4</t:cell><t:cell name="name">Person 4</t:cell><t:cell name="type">http://people.org/Person</t:cell></t:row></t:rows></t:table>');
      done();
    }, done);
  });

  it('TEST 5 - sparql aggregate on count - format csv, structure array', function(done){
    const output =
      op.fromSPARQL("PREFIX demov: <http://demo/verb#> \
        PREFIX vcard: <http://www.w3.org/2006/vcard/ns#> \
        SELECT (COUNT(?industry) AS ?total) \
        FROM </optic/sparql/test/companies.ttl> \
        WHERE { \
          ?company a vcard:Organization . \
          ?company demov:industry ?industry . \
          ?company demov:industry 'Industrial Goods' \
        }")
    db.rows.query(output, { format: 'csv', structure: 'array', columnTypes: 'header' })
    .then(function(output) {
      //console.log(output);
      expect(output).to.contain('["total"]');
      expect(output).to.contain('[15]');
      done();
    }, done);
  });

  it('TEST 6 - sparql aggregate on count distinct - queryAsStream object', function(done){
    let count = 0;
    let str = '';
    const chunks = [];
    const output =
      op.fromSPARQL("PREFIX demov: <http://demo/verb#> \
        PREFIX vcard: <http://www.w3.org/2006/vcard/ns#> \
        SELECT (COUNT( DISTINCT ?industry) AS ?total_industries) \
        FROM </optic/sparql/test/companies.ttl> \
        WHERE { \
          ?company demov:industry ?industry . \
        }")
    db.rows.queryAsStream(output, 'object', { format: 'json', structure: 'object', columnTypes: 'header', complexValues: 'reference' })
    .on('data', function(chunk) {
      chunks.push(chunk.kind.toString());
      count++;
    }).
    on('end', function() {
      //console.log(count);
      //console.log(chunks.join(''));
      expect(chunks.join(' ')).to.equal('columns row');
      expect(count).to.equal(2);
      done();
    }, done);
  });

  it('TEST 7 - sparql aggregate on sum - queryAsStream sequence, structure array, columnTypes rows', function(done){
    let count = 0;
    let str = '';
    const chunks = [];
    const output =
      op.fromSPARQL("PREFIX demov: <http://demo/verb#> \
        PREFIX vcard: <http://www.w3.org/2006/vcard/ns#> \
        SELECT ( SUM (?sales) AS ?sum_sales ) \
        FROM </optic/sparql/test/companies.ttl> \
        WHERE { \
	  ?company a vcard:Organization . \
	  ?company demov:sales ?sales \
        }")
    db.rows.queryAsStream(output, 'sequence', { format: 'json', structure: 'array', columnTypes: 'rows' })
    .on('data', function(chunk) {
      //console.log(chunk.toString());
      str = str + chunk.toString().trim().replace(/[\n\r]/g, ' ');
      count++;
    }).
    on('end', function() {
      //console.log(str);
      //console.log(count);
      expect(str).to.equal('\u001e[{"name":"sum_sales"}]\u001e[{"type":"xs:integer","value":19318588272}]');
      expect(count).to.equal(2);
      done();
    }, done);
  });

  it('TEST 8 - sparql aggregate on sum with bind - queryAsStream chunked, format xml', function(done){
    let count = 0;
    let str = '';
    const chunks = [];
    const output =
      op.fromSPARQL("PREFIX demov: <http://demo/verb#> \
        PREFIX vcard: <http://www.w3.org/2006/vcard/ns#> \
        SELECT DISTINCT ?industry (SUM(?sales) as ?total_sales) ?country \
        FROM </optic/sparql/test/companies.ttl> \
        WHERE { \
	  ?company a vcard:Organization . \
	  ?company demov:sales ?sales . \
	  ?company demov:industry 'Other' . \
	  ?company vcard:hasAddress/vcard:country-name 'USA' . \
	  BIND (vcard:hasAddress/vcard:country-name as ?country) \
	  BIND (demov:industry as ?industry) \
        }")
    db.rows.queryAsStream(output, 'chunked', { format: 'xml', structure: 'object', columnTypes: 'header' })
    .on('data', function(chunk) {
      //console.log(chunk.toString());
      str = str + chunk.toString().trim().replace(/[\n\r]/g, ' ');
      count++;
    }).
    on('end', function() {
      //console.log(str);
      //console.log(count);
      expect(str).to.equal('<t:table xmlns:t="http://marklogic.com/table"> <t:columns> <t:column name="industry" type="sem:iri"/> <t:column name="total_sales" type="xs:integer"/> <t:column name="country" type="null"/> </t:columns> <t:rows> <t:row> <t:cell name="industry">http://demo/verb#industry</t:cell> <t:cell name="total_sales">1647852766</t:cell> <t:cell name="country"></t:cell> </t:row> </t:rows> </t:table>');
      expect(count).to.equal(1);
      done();
    }, done);
  });

  it('TEST 9 - sparql group by', function(done){
    const output =
      op.fromSPARQL("PREFIX demov: <http://demo/verb#> \
        PREFIX vcard: <http://www.w3.org/2006/vcard/ns#> \
        SELECT ?industry (SUM (?sales) AS ?sum_sales ) \
        FROM </optic/sparql/test/companies.ttl> \
        WHERE { \
	  ?company a vcard:Organization . \
	  ?company demov:sales ?sales . \
	  ?company demov:industry ?industry \
        } \
        GROUP BY ?industry \
        ORDER BY ?sum_sales")
    db.rows.query(output, { format: 'json', structure: 'object', columnTypes: 'header' })
    .then(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.rows.length).to.equal(6);
      expect(output.rows[0].industry).to.equal('Retail/Wholesale');
      expect(output.rows[0].sum_sales).to.equal(1255159206);
      expect(output.rows[5].industry).to.equal('Healthcare/Life Sciences');
      expect(output.rows[5].sum_sales).to.equal(6141852782);
      done();
    }, done);
  });

  it('TEST 10 - sparql group by with min - export and execute plan', function(done){
    const output =
      op.fromSPARQL("PREFIX demov: <http://demo/verb#> \
        PREFIX vcard: <http://www.w3.org/2006/vcard/ns#> \
        SELECT ?country (MIN (?sales) AS ?min_sales ) \
        FROM </optic/sparql/test/companies.ttl> \
        WHERE { \
          ?company a vcard:Organization . \
          ?company demov:sales ?sales . \
          ?company vcard:hasAddress [ vcard:country-name ?country ] \
        } \
        GROUP BY ?country \
        ORDER BY ASC( ?min_sales ) ?country")
      .export();
    //console.log(JSON.stringify(output).trim().replace(/[\n\r]/g, ''));
    const outputStr = JSON.stringify(output).trim().replace(/[\n\r]/g, '');
    //console.log(outputStr);
    expect(outputStr).to.equal('{"$optic":{"ns":"op","fn":"operators","args":[{"ns":"op","fn":"from-sparql","args":["PREFIX demov: <http://demo/verb#>         PREFIX vcard: <http://www.w3.org/2006/vcard/ns#>         SELECT ?country (MIN (?sales) AS ?min_sales )         FROM </optic/sparql/test/companies.ttl>         WHERE {           ?company a vcard:Organization .           ?company demov:sales ?sales .           ?company vcard:hasAddress [ vcard:country-name ?country ]         }         GROUP BY ?country         ORDER BY ASC( ?min_sales ) ?country"]}]}}');
    db.rows.query(output, { format: 'json', structure: 'object', columnTypes: 'header' })
    .then(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.rows.length).to.equal(8);
      expect(output.rows[0].country).to.equal('China');
      expect(output.rows[0].min_sales).to.equal(8);
      expect(output.rows[7].country).to.equal('USA');
      expect(output.rows[7].min_sales).to.equal(10000000);
      done();
    }, done);
  });

  it('TEST 11 - sparql group by with qualifier', function(done){
    const output =
      op.fromSPARQL("PREFIX demov: <http://demo/verb#> \
        PREFIX vcard: <http://www.w3.org/2006/vcard/ns#> \
        SELECT ?industry (SUM (?sales) AS ?sum_sales ) \
        FROM </optic/sparql/test/companies.ttl> \
        WHERE { \
	  ?company a vcard:Organization . \
	  ?company demov:sales ?sales . \
	  ?company demov:industry ?industry \
        } \
        GROUP BY ?industry \
        ORDER BY ?sum_sales", 'MySPARQL')
    db.rows.query(output, { format: 'json', structure: 'object', columnTypes: 'header' })
    .then(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.rows.length).to.equal(6);
      expect(output.rows[0]['MySPARQL.industry']).to.equal('Retail/Wholesale');
      expect(output.rows[0]['MySPARQL.sum_sales']).to.equal(1255159206);
      expect(output.rows[5]['MySPARQL.industry']).to.equal('Healthcare/Life Sciences');
      expect(output.rows[5]['MySPARQL.sum_sales']).to.equal(6141852782);
      done();
    }, done);
  });

  it('TEST 15 - with explain', function(done){
    const output =
      op.fromSPARQL("PREFIX demov: <http://demo/verb#> \
        PREFIX vcard: <http://www.w3.org/2006/vcard/ns#> \
        SELECT ?industry (SUM (?sales) AS ?sum_sales ) \
        FROM </optic/sparql/test/companies.ttl> \
        WHERE { \
	  ?company a vcard:Organization . \
	  ?company demov:sales ?sales . \
	  ?company demov:industry ?industry \
        } \
        GROUP BY ?industry \
        ORDER BY ?sum_sales", 'MySPARQL')
    db.rows.explain(output, 'json')
    .then(function(output) {
      //console.log(JSON.stringify(output, null, 2));
      expect(output.node).to.equal('plan');
      expect(output.expr.from['default-graph'][0].value).to.equal('/optic/sparql/test/companies.ttl');
      done();
    }, done);
  });

  it('TEST 16 - negative case', function(done){
    const output =
      op.fromSPARQL("PREFIX foaf: <http://xmlns.com/foaf/0.1/> \
        PREFIX ppl:  <http://people.org/> \
        SELECT * \
        WHERE { \
          ?person foaf:name ?name . \
          ?person <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> ?type . \
        } \
        ORDER BY ?name")
      .limit(-1)
      .offset(11)
    db.rows.query(output, { format: 'xml', structure: 'object', columnTypes: 'header' })
    .then(function(output) {
      //console.log(output);
      expect(output).to.equal('SHOULD HAVE FAILED');
      done();
    }, function(error) {
      //console.log(JSON.stringify(error, null, 2));
      expect(error.body.errorResponse.message).to.contain('limit must be a positive number');
      done();
    });
  });

});
