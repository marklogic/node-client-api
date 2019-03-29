/*
 * Copyright 2014-2019 MarkLogic Corporation
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
      valcheck = require('core-util-is')
      eol      = require('os').EOL;

const testconfig = require('../etc/test-config.js');

const marklogic = require('../');

const planPath = './test-basic/data/literals.json';
const planPathBindings = './test-basic/data/literalsBindings.json';
const planPathAttachments = './test-basic/data/literalsAttachments.json';
const planPathBinaryAttachments = './test-basic/data/literalsBinaryAttachments.json';

const db = marklogic.createDatabaseClient(testconfig.restWriterConnection);
//db.setLogger('debug');

const p = marklogic.planBuilder;

describe('rows', function(){

  const planFromJSON = fs.readFileSync(planPath, 'utf8');
  const planFromJSONBindings = fs.readFileSync(planPathBindings, 'utf8');
  const planFromJSONAttachments = fs.readFileSync(planPathAttachments, 'utf8');
  const planFromJSONBinaryAttachments = fs.readFileSync(planPathBinaryAttachments, 'utf8');
  const planFromBuilder = p.fromLiterals([
            {"id": 1,"name": "Master 1","date": "2015-12-01"},
            {"id": 2,"name": "Master 2","date": "2015-12-02"},
            {"id": 3,"name": "Master 3","date": "2015-12-03"},
          ])
        .where(p.gt(p.col('id'), 1));

  describe('read as a promise', function(){

    it('as a JSON object using plan builder object', function(){
      return db.rows.query(planFromBuilder)
        .then(function (response) {
          //console.log(response);
          valcheck.isObject(response).should.equal(true);
          valcheck.isArray(response).should.equal(false);
          response.should.have.property('columns');
        });
    });

    it('as a JSON object using JSON plan', function(){
      return db.rows.query(planFromJSON)
        .then(function(response) {
          //console.log(JSON.stringify(response, null, 2));
          valcheck.isObject(response).should.equal(true);
          valcheck.isArray(response).should.equal(false);
        });
    });

    it('as a JSON array', function(){
      return db.rows.query(planFromJSON, {format: 'json', structure: 'array'})
        .then(function(response) {
          //console.log(JSON.stringify(response, null, 2));
          valcheck.isArray(response).should.equal(true);
        });
    });

    it('as a JSON object with header column types', function(){
      return db.rows.query(planFromJSON, {format: 'json', columnTypes: 'header'})
        .then(function(response) {
          //console.log(JSON.stringify(response, null, 2));
          valcheck.isObject(response).should.equal(true);
          valcheck.isArray(response).should.equal(false);
          response.should.have.property('columns');
          const cols = response['columns'];
          valcheck.isArray(cols).should.equal(true);;
          cols[0].should.have.property('name');
          cols[0].should.have.property('type');
        });
    });

    it('as a JSON object with bindings', function(){
      return db.rows.query(planFromJSONBindings, {
        format: 'json',
        bindings: {
          'limit': {value: 2, type: 'integer'},
          'foo': {value: 'bar', lang: 'en'}
        }
      })
        .then(function(response) {
          //console.log(response);
          valcheck.isObject(response).should.equal(true);
          valcheck.isArray(response).should.equal(false);
          response.should.have.property('columns');
          response.should.have.property('rows');
          response['rows'].length.should.equal(1);
        });
    });

    it('as an XML string', function(){
      return db.rows.query(planFromJSON, {format: 'xml', columnsTypes: 'rows'})
        .then(function(response) {
          //console.log(response);
          valcheck.isString(response).should.equal(true);
          response.should.startWith('<t:table');
        });
    });

    it('as CSV', function(){
      return db.rows.query(planFromJSON, {format: 'csv'})
        .then(function(response) {
          //console.log(response);
          valcheck.isString(response).should.equal(true);
        });
    });

    it('should fail with no plan argument', function(done){
      try {
        return db.rows.query()
          .then(function (response) {
            should.fail('expected error not thrown')
          });
      }
      catch (error) {
       // Error thrown, test succeeded
       done();
      }
    });

    it('should support alternate database defined in client', function(){
      // 'rest-evaluator' user can evaluate against an alternate db:
      // http://docs.marklogic.com/guide/rest-dev/intro#id_72318
      const otherDbConfig = {
          host:     testconfig.testHost,
          port:     8000,
          user:     testconfig.restEvaluatorConnection.user,
          password: testconfig.restEvaluatorConnection.password,
          authType: testconfig.restEvaluatorConnection.authType,
          database: testconfig.testServerName
      };
      const otherDb = marklogic.createDatabaseClient(otherDbConfig);
      return otherDb.rows.query(planFromJSON)
        .then(function(response) {
          //console.log(JSON.stringify(response, null, 2));
          valcheck.isObject(response).should.equal(true);
          valcheck.isArray(response).should.equal(false);
        });
    });

  });

  describe('from a TDE view', function(){
    // View defined in etc/data/employees.tdej
    const planFromBuilderTemplate = p.fromView('company', 'employees', '')
        .select(['EmployeeID', 'FirstName', 'LastName'])
        .orderBy('LastName');
    before(function(done){
      db.documents.write([{
        uri: '/employee1.json',
        contentType: 'application/json',
        content: {
          "Employee": {
            "ID": 1,
            "FirstName": "John",
            "LastName": "Widget"
          }
        }
      },{
        uri: '/employee2.json',
        contentType: 'application/json',
        content: {
          "Employee": {
            "ID": 2,
            "FirstName": "Jane",
            "LastName": "Lead"
          }
        }
      },{
        uri: '/employee3.json',
        contentType: 'application/json',
        content: {
          "Employee": {
            "ID": 3,
            "FirstName": "Steve",
            "LastName": "Manager"
          }
        }
      }]).result(function(response){
        done();
      })
      .catch(done);
    });
    after(function(done){
      db.documents.remove({
        uris: [
          '/employee1.json', '/employee2.json', '/employee3.json'
        ]
      }).result(function(response){
        done();
      })
      .catch(done);
    });
    it('should return rows corresponding to template', function(){
      return db.rows.query(planFromBuilderTemplate)
        .then(function (response) {
          valcheck.isObject(response).should.equal(true);
          valcheck.isArray(response).should.equal(false);
          response.should.have.property('columns');
          response.columns.length.should.equal(3);
          response.should.have.property('rows');
          response.rows[0].LastName.value.should.equal('Lead');
        });
    });

  });

  describe('read as a stream', function(){

    it('of chunked JSON', function(done){
      let chunks = 0,
          length = 0;
      db.rows.queryAsStream(planFromJSON, 'chunked', {format: 'json'})
      .on('data', function(chunk){
        // console.log(chunk);
        // console.log(JSON.parse(chunk));
        // console.log(chunk.length);
        valcheck.isBuffer(chunk).should.equal(true);
        chunks++;
        length += chunk.length;
      })
      .on('end', function(){
        //console.log('read '+ chunks + ' chunks of ' + length + ' length');
        chunks.should.be.greaterThan(0);
        done();
      }, done);
    });

    it('of JSON objects', function(done){
      var count = 0;
      db.rows.queryAsStream(planFromJSON, 'object', {format: 'json'})
      .on('data', function(obj){
        //console.log(obj);
        valcheck.isObject(obj).should.equal(true);
        count++;
      })
      .on('end', function(){
        //console.log('objects: ' + count);
        count.should.be.greaterThan(0);
        done();
      }, done);
    });

    it('of JSON objects with attachments inline', function(done){
      var count = 0;
      db.rows.queryAsStream(planFromJSONAttachments, 'object', {
        format: 'json',
        nodeColumns: 'inline'
      })
      .on('data', function(obj){
        // console.log(obj);
        valcheck.isObject(obj).should.equal(true);
        count++;
      })
      .on('end', function(){
        // console.log('objects: ' + count);
        count.should.be.greaterThan(0);
        done();
      }, done);
    });

    it('of JSON objects with attachments reference', function(done){
      var count = 0;
      db.rows.queryAsStream(planFromJSONAttachments, 'object', {
        format: 'json',
        complexValues: 'reference'
      })
      .on('data', function(obj){
        //console.log(JSON.stringify(obj, null, 2));
        valcheck.isObject(obj).should.equal(true);
        count++;
      })
      .on('end', function(){
        //console.log('objects: ' + count);
        count.should.be.greaterThan(0);
        done();
      }, done);
    });

    it('of JSON objects with binary attachments reference', function(done){
      var count = 0;
      db.rows.queryAsStream(planFromJSONBinaryAttachments, 'object', {
        format: 'json',
        complexValues: 'reference'
      })
      .on('data', function(obj){
        //console.log(obj);
        valcheck.isObject(obj).should.equal(true);
        count++;
      })
      .on('end', function(){
        //console.log('objects: ' + count);
        count.should.be.greaterThan(0);
        done();
      }, done);
    });

    it('of JSON text sequence', function(done){
      var count = 0;
      db.rows.queryAsStream(planFromJSON, 'sequence', {format: 'json'})
      .on('data', function(chunk){
        valcheck.isBuffer(chunk).should.equal(true);
        // check for record separator
        let firstChar = chunk.toString()[0];
        firstChar.should.equal('\x1e')
        // substr(1) removes initial record separator
        let object = JSON.parse(chunk.toString().substr(1));
        valcheck.isObject(object).should.equal(true);
        count++;
      })
      .on('end', function(){
        //console.log('objects: ' + count);
        count.should.be.greaterThan(0);
        done();
      }, done);
    });

    it('of chunked XML', function(done){
      let chunks = 0,
          length = 0;
      db.rows.queryAsStream(planFromJSON, 'chunked', {format: 'xml'})
      .on('data', function(chunk){
        // console.log(chunk.toString());
        // console.log(chunk.length);
        valcheck.isBuffer(chunk).should.equal(true);
        chunks++;
        length += chunk.length;
      })
      .on('end', function(){
        // console.log('read '+ chunks + ' chunks of ' + length + ' length');
        chunks.should.be.greaterThan(0);
        done();
      }, done);
    });

    it('of chunked CSV', function(done){
      let chunks = 0,
          length = 0;
      db.rows.queryAsStream(planFromJSON, 'chunked', {format: 'csv'})
      .on('data', function(chunk){
        // console.log(chunk.toString());
        // console.log(chunk.length);
        valcheck.isBuffer(chunk).should.equal(true);
        chunks++;
        length += chunk.length;
      })
      .on('end', function(){
        // console.log('read '+ chunks + ' chunks of ' + length + ' length');
        chunks.should.be.greaterThan(0);
        done();
      }, done);
    });

    it('should pass with no stream type argument', function(done){
      db.rows.queryAsStream(planFromJSON, {format: 'json'})
      .on('data', function(chunk){
        valcheck.isBuffer(chunk).should.equal(true);
      })
      .on('end', function(){
        done();
      }, done);
    });

  });

  describe('explain', function(){

    it('a plan as JSON', function(){
      return db.rows.explain(planFromJSON, 'json')
        .then(function(response) {
          //console.log(JSON.stringify(response, null, 2));
          valcheck.isObject(response).should.equal(true);
          valcheck.isArray(response).should.equal(false);
          response.should.have.property('node');
          response.should.have.property('expr');
          })
    });

    it('a plan as XML', function(){
      return db.rows.explain(planFromJSON, 'xml')
        .then(function(response) {
          //console.log(JSON.stringify(response, null, 2));
          valcheck.isString(response).should.equal(true);
          response.should.startWith('<plan:plan');
          })
    });

  });

});
