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
var should   = require('should'),
    fs       = require('fs'),
    valcheck = require('core-util-is');

var testconfig = require('../etc/test-config.js');

var marklogic = require('../');

var planPath = '../test-basic/data/literals.json';
var planPathBindings = '../test-basic/data/literalsBindings.json';

var db = marklogic.createDatabaseClient(testconfig.restWriterConnection);
//db.setLogger('debug');

describe('rows', function(){

  var plan = fs.readFileSync(planPath);
  var planBindings = fs.readFileSync(planPathBindings);

  describe('read as a promise', function(){

    it('a single JSON object', function(done){
      db.rows.query(plan, {format: 'json', output: 'object'})
        .result(function(response) {
          //console.log(JSON.stringify(response, null, 2));
          valcheck.isObject(response).should.equal(true);
          response.should.have.property('columns');
          valcheck.isArray(response.columns).should.equal(true);
          response.columns.length.should.equal(3);
          response.columns[0].should.have.property('name');
          response.should.have.property('rows');
          valcheck.isArray(response.rows).should.equal(true);
          response.rows.length.should.equal(2);
          done();
          })
        .catch(done);
    });

    it('a single JSON object with column header types', function(done){
      db.rows.query(plan, {format: 'json', output: 'object', columnTypes: 'header'})
        .result(function(response) {
          //console.log(JSON.stringify(response, null, 2));
          valcheck.isObject(response).should.equal(true);
          response.should.have.property('columns');
          valcheck.isArray(response.columns).should.equal(true);
          response.columns.length.should.equal(3);
          response.should.have.property('rows');
          var row1 = response.rows[0];
          row1.should.have.property('date');
          valcheck.isString(row1.date).should.equal(true);
          done();
          })
        .catch(done);
    });

    it('a single JSON object with bindings', function(done){
      db.rows.query(planBindings, {
        format: 'json',
        output: 'object',
        bindings: {
          'limit': {value: 2, type: 'integer'},
          'foo': {value: 'bar', lang: 'en'}
        }
      })
        .result(function(response) {
          //console.log(JSON.stringify(response, null, 2));
          valcheck.isObject(response).should.equal(true);
          response.should.have.property('columns');
          valcheck.isArray(response.columns).should.equal(true);
          response.columns.length.should.equal(3);
          response.should.have.property('rows');
          valcheck.isArray(response.rows).should.equal(true);
          response.rows.length.should.equal(1);
          done();
          })
        .catch(done);
    });

    it('a single JSON array', function(done){
      db.rows.query(plan, {format: 'json', output: 'array'})
        .result(function(response) {
          //console.log(JSON.stringify(response, null, 2));
          valcheck.isArray(response).should.equal(true);
          response.length.should.equal(3);
          var cols = response[0];
          valcheck.isArray(cols).should.equal(true);
          cols.length.should.equal(3);
          cols[0].should.have.property('name');
          var row1 = response[1];
          valcheck.isArray(row1).should.equal(true);
          row1.length.should.equal(3);
          row1[0].should.have.property('type');
          row1[0].should.have.property('value');
          done();
          })
        .catch(done);
    });

    it('a single XML element', function(done){
      db.rows.query(plan, {format: 'xml'})
        .result(function(response) {
          //console.log(JSON.stringify(response, null, 2));
          valcheck.isString(response).should.equal(true);
          response.should.startWith('<t:table');
          // TODO parse and check XML string? Discuss with QA
          done();
          })
        .catch(done);
    });

    it('line-delimited JSON objects', function(done){
      db.rows.query(plan, {format: 'json-seq', output: 'object'})
        .result(function(response) {
          //console.log(JSON.stringify(response, null, 2));
          valcheck.isBuffer(response).should.equal(true);
          // json-seq items preceded by record separators: '\036'
          var items = response.toString().split('\036');
          //console.log(items);
          items.length.should.equal(4);
          var parsed = JSON.parse(items[1]);
          valcheck.isObject(parsed).should.equal(true);
          valcheck.isArray(parsed).should.equal(false);
          done();
          })
        .catch(done);
    });

    it('line-delimited JSON arrays', function(done){
      db.rows.query(plan, {format: 'json-seq', output: 'array'})
        .result(function(response) {
          valcheck.isBuffer(response).should.equal(true);
          // json-seq items preceded by record separators: '\036'
          var items = response.toString().split('\036');
          //console.log(items);
          items.length.should.equal(4);
          var parsed = JSON.parse(items[1]);
          valcheck.isArray(parsed).should.equal(true);
          done();
          })
        .catch(done);
    });

    it('comma-separated text (CSV)', function(done){
      db.rows.query(plan, {format: 'csv', output: 'object'})
        .result(function(response) {
          //console.log(response);
          valcheck.isString(response).should.equal(true);
          var items = response.toString().split('\n');
          //console.log(items);
          items.length.should.equal(3);
          var cols = items[0].split(',');
          cols.length.should.equal(3);
          cols[0].should.equal('date');
          var row1 = items[1].split(',');
          row1[0].should.equal('2015-12-02');
          done();
          })
        .catch(done);
    });

    it('comma-separated arrays', function(done){
      db.rows.query(plan, {format: 'csv', output: 'array'})
        .result(function(response) {
          //console.log(response);
          valcheck.isString(response).should.equal(true);
          var items = response.toString().split('\n');
          //console.log(items);
          items.length.should.equal(4);
          var cols = JSON.parse(items[1]);
          cols.length.should.equal(3);
          cols[0].should.equal('date');
          var row1 = JSON.parse(items[2]);
          row1[0].should.equal('2015-12-02');
          done();
          })
        .catch(done);
    });

    it('multipart with rows as JSON objects', function(done){
      db.rows.query(plan, {format: 'multipart', output: 'object', rowFormat: 'json'})
        .result(function(response) {
          //console.log(JSON.stringify(response, null, 2));
          valcheck.isArray(response).should.equal(true);
          response.length.should.equal(3);
          var item1 = response[0];
          valcheck.isObject(item1).should.equal(true);
          valcheck.isArray(item1).should.equal(false);
          item1.should.have.property('content');
          item1.content.should.have.property('columns');
          valcheck.isArray(item1.content.columns).should.equal(true);
          item1.content.columns.length.should.equal(3);
          var item2 = response[1];
          valcheck.isObject(item2).should.equal(true);
          valcheck.isArray(item2).should.equal(false);
          item2.should.have.property('content');
          item2.content.should.have.property('id');
          valcheck.isObject(item2.content.id).should.equal(true);
          item2.content.id.should.have.property('type');
          done();
          })
        .catch(done);
    });

    it('multipart with rows as JSON arrays', function(done){
      db.rows.query(plan, {format: 'multipart', output: 'array', rowFormat: 'json'})
        .result(function(response) {
          //console.log(JSON.stringify(response, null, 2));
          valcheck.isArray(response).should.equal(true);
          response.length.should.equal(3);
          var item1 = response[0];
          valcheck.isObject(item1).should.equal(true);
          valcheck.isArray(item1).should.equal(false);
          item1.should.have.property('content');
          valcheck.isArray(item1.content).should.equal(true);
          item1.content.length.should.equal(3);
          item1.content[0].should.have.property('name');
          var item2 = response[1];
          valcheck.isObject(item2).should.equal(true);
          valcheck.isArray(item2).should.equal(false);
          item2.should.have.property('content');
          valcheck.isArray(item2.content).should.equal(true);
          item2.content.length.should.equal(3);
          item2.content[0].should.have.property('value');
          done();
          })
        .catch(done);
    });

    it('multipart with rows as XML elements', function(done){
      db.rows.query(plan, {format: 'multipart', rowFormat: 'xml'})
        .result(function(response) {
          //console.log(JSON.stringify(response, null, 2));
          valcheck.isArray(response).should.equal(true);
          response.length.should.equal(3);
          var item1 = response[0];
          valcheck.isObject(item1).should.equal(true);
          valcheck.isArray(item1).should.equal(false);
          item1.should.have.property('content');
          valcheck.isString(item1.content).should.equal(true);
          item1.content.should.startWith('<t:columns');
          var item2 = response[1];
          valcheck.isObject(item2).should.equal(true);
          valcheck.isArray(item2).should.equal(false);
          item2.should.have.property('content');
          valcheck.isString(item2.content).should.equal(true);
          item2.content.should.startWith('<t:row');
          done();
          })
        .catch(done);
    });

  });

  describe('read as a stream', function(){

    it('a single JSON object', function(done){

      var chunks = 0,
          length = 0;

      db.rows.query(plan, {format: 'json', output: 'object'})
        .stream('chunked').
      on('data', function(chunk){
        console.log(chunk);
        console.log(chunk.toString());
        console.log(chunk.length);
        chunks++;
        length += chunk.length;
      }).
      on('end', function(){
        console.log('read '+ chunks + ' chunks of ' + length + ' length');
        chunks.should.be.greaterThan(0);
        done();
      }, done);

    });


    it('multipart with rows as JSON objects', function(done){

      var chunks = 0,
          length = 0;

      db.rows.query(plan, {format: 'multipart', output: 'object'})
        .stream('object').
      on('data', function(obj){
        console.log(JSON.stringify(obj, null, 2));
        console.log('-----------');
        length++;
      }).
      on('end', function(obj){
        console.log(JSON.stringify(obj, null, 2));
        console.log('done: ' + length);
        done();
      }, done);
      // TODO Possible bug in responder handling multipart-to-object streams

    });

  });

  describe('explain', function(){

    it('a plan as JSON', function(done){
      db.rows.explain(plan, {format: 'json'})
        .result(function(response) {
          //console.log(JSON.stringify(response, null, 2));
          valcheck.isObject(response).should.equal(true);
          valcheck.isArray(response).should.equal(false);
          response.should.have.property('node');
          response.should.have.property('expr');
          // TODO what else?
          done();
          })
        .catch(done);
    });

    it('a plan as XML', function(done){
      db.rows.explain(plan, {format: 'xml'})
        .result(function(response) {
          //console.log(JSON.stringify(response, null, 2));
          valcheck.isString(response).should.equal(true);
          response.should.startWith('<plan:plan');
          // TODO what else?
          done();
          })
        .catch(done);
    });

  });

});
