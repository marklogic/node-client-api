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
const should   = require('should'),
      fs       = require('fs'),
      valcheck = require('core-util-is');

const testconfig = require('../etc/test-config.js');

const marklogic = require('../');

const planPath = './test-basic/data/literals.json';
const planPathBindings = './test-basic/data/literalsBindings.json';

const db = marklogic.createDatabaseClient(testconfig.restWriterConnection);
//db.setLogger('debug');

const p = marklogic.planBuilder;

describe('rows', function(){

  const planFromJSON = fs.readFileSync(planPath, 'utf8');
  const planFromJSONBindings = fs.readFileSync(planPathBindings, 'utf8');
  const planFromBuilder = p.fromLiterals([
            {"id": 1,"name": "Master 1","date": "2015-12-01"},
            {"id": 2,"name": "Master 2","date": "2015-12-02"},
            {"id": 3,"name": "Master 3","date": "2015-12-03"},
          ])
        .where(p.gt(p.col('id'), 1));

  describe('read as a promise', function(){

    it('as an array of JSON objects using plan builder object', function(done){
      db.rows.query(planFromBuilder, {format: 'json'})
        .result(function(response) {
          //console.log(JSON.stringify(response, null, 2));
          valcheck.isArray(response).should.equal(true);
          response.length.should.equal(3);
          const obj1 = response[0];
          valcheck.isObject(obj1).should.equal(true);
          valcheck.isArray(obj1).should.equal(false);
          obj1.should.have.property('columns');
          valcheck.isArray(obj1['columns']).should.equal(true);
          obj1['columns'][0].should.have.property('name');
          obj1['columns'][0].should.not.have.property('type');
          const obj2 = response[1];
          valcheck.isObject(obj2).should.equal(true);
          valcheck.isArray(obj2).should.equal(false);
          obj2.should.have.property('date');
          obj2['date'].should.have.property('type');
          obj2['date'].should.have.property('value');
          done();
          })
        .catch(done);
    });

    it('as an array of JSON objects using JSON plan', function(done){
      db.rows.query(planFromJSON, {format: 'json'})
        .result(function(response) {
          //console.log(JSON.stringify(response, null, 2));
          valcheck.isArray(response).should.equal(true);
          response.length.should.equal(3);
          const obj1 = response[0];
          valcheck.isObject(obj1).should.equal(true);
          valcheck.isArray(obj1).should.equal(false);
          obj1.should.have.property('columns');
          valcheck.isArray(obj1['columns']).should.equal(true);
          obj1['columns'][0].should.have.property('name');
          obj1['columns'][0].should.not.have.property('type');
          const obj2 = response[1];
          valcheck.isObject(obj2).should.equal(true);
          valcheck.isArray(obj2).should.equal(false);
          obj2.should.have.property('date');
          obj2['date'].should.have.property('type');
          obj2['date'].should.have.property('value');
          done();
          })
        .catch(done);
    });

    it('as an array of JSON objects with header column types', function(done){
      db.rows.query(planFromJSON, {format: 'json', columnTypes: 'header'})
        .result(function(response) {
          //console.log(JSON.stringify(response, null, 2));
          valcheck.isArray(response).should.equal(true);
          response.length.should.equal(3);
          const obj1 = response[0];
          valcheck.isObject(obj1).should.equal(true);
          valcheck.isArray(obj1).should.equal(false);
          obj1.should.have.property('columns');
          valcheck.isArray(obj1['columns']).should.equal(true);
          obj1['columns'][0].should.have.property('name');
          obj1['columns'][0].should.have.property('type');
          done();
          })
        .catch(done);
    });

    it('as an array of JSON objects with bindings', function(done){
      db.rows.query(planFromJSONBindings, {
        format: 'json',
        bindings: {
          'limit': {value: 2, type: 'integer'},
          'foo': {value: 'bar', lang: 'en'}
        }
      })
        .result(function(response) {
          //console.log(JSON.stringify(response, null, 2));
          valcheck.isArray(response).should.equal(true);
          response.length.should.equal(2);
          done();
          })
        .catch(done);
    });

    // it('as an array of XML elements', function(done){
    //   db.rows.query(planFromJSON, {format: 'xml'})
    //     .result(function(response) {
    //       console.log(JSON.stringify(response, null, 2));
    //       valcheck.isArray(response).should.equal(true);
    //       response.length.should.equal(3);
    //       const str1 = response[0];
    //       valcheck.isString(str1).should.equal(true);
    //       str1.should.startWith('<t:columns');
    //       const str2 = response[1];
    //       valcheck.isString(str2).should.equal(true);
    //       str2.should.startWith('<t:row');
    //       done();
    //       })
    //     .catch(done);
    // });

  });

  describe('read as a stream', function(){

    it('of chunked JSON', function(done){

      let chunks = 0,
          length = 0;

      db.rows.query(planFromJSON, {format: 'json'})
        .stream('chunked').
      on('data', function(chunk){
        // console.log(JSON.parse(chunk));
        // console.log(chunk.length);
        valcheck.isBuffer(chunk).should.equal(true);
        chunks++;
        length += chunk.length;
      }).
      on('end', function(){
        //console.log('read '+ chunks + ' chunks of ' + length + ' length');
        chunks.should.be.greaterThan(0);
        done();
      }, done);

    });


    it('of JSON objects', function(done){

      var objects = 0;

      db.rows.query(planFromJSON, {format: 'json'})
        .stream('object').
      on('data', function(obj){
        //console.log(obj);
        valcheck.isObject(obj).should.equal(true);
        objects++;
      }).
      on('end', function(){
        //console.log('objects: ' + objects);
        objects.should.be.greaterThan(0);
        done();
      }, done);
      // TODO Possible bug in responder handling multipart-to-object streams

    });

  });

  describe('explain', function(){

    it('a plan as JSON', function(done){
      db.rows.explain(planFromJSON, {format: 'json'})
        .result(function(response) {
          //console.log(JSON.stringify(response, null, 2));
          valcheck.isObject(response).should.equal(true);
          valcheck.isArray(response).should.equal(false);
          response.should.have.property('node');
          response.should.have.property('expr');
          done();
          })
        .catch(done);
    });

    it('a plan as XML', function(done){
      db.rows.explain(planFromJSON, {format: 'xml'})
        .result(function(response) {
          //console.log(JSON.stringify(response, null, 2));
          valcheck.isString(response).should.equal(true);
          response.should.startWith('<plan:plan');
          done();
          })
        .catch(done);
    });

  });

});
