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
var should = require('should');
var bigInt = require('big-integer');
var valcheck     = require('core-util-is');
var fs = require('fs');

var testconfig = require('../etc/test-config.js');

var marklogic = require('../');
var q = marklogic.queryBuilder;
var t = marklogic.valuesBuilder;
var p = marklogic.planBuilder;

var db = marklogic.createDatabaseClient(testconfig.restWriterConnection);
//db.setLogger('debug');
describe('point-in-time with timestamp', function(){

  describe('documents', function(){
    before(function(done){
      db.documents.write({
        uri: '/documents/point-in-time.json',
        contentType: 'application/json',
        content: {key1: 'value 1'},
        collections: ['point-in-time']
        })
        .result(function(response){done();})
        .catch(done);
    });
    after(function(done){
      db.documents.remove({
        uris: '/documents/point-in-time.json'
      }).result(function(response){
        done();
      }).catch(done);
    });
    describe('read', function(){
      it('should set and use timestamp', function(done){
        let timestamp = db.createTimestamp();
        valcheck.isNull(timestamp.value).should.equal(true);
        // Read with timestamp set to null
        db.documents.read({
          uris: '/documents/point-in-time.json',
          timestamp: timestamp
        })
        .result(function(response) {
          valcheck.isString(timestamp.value).should.equal(true);
          response.length.should.equal(1);
          // Read with timestamp set to current time
          return db.documents.read({
            uris: '/documents/point-in-time.json',
            timestamp: timestamp
          }).result();
          })
        .then(function(response) {
          valcheck.isString(timestamp.value).should.equal(true);
          response.length.should.equal(1);
          timestamp.value = bigInt(timestamp.value).minus(99999).toString();
          // Read with timestamp set to decremented time
          return db.documents.read({
            uris: '/documents/point-in-time.json',
            timestamp: timestamp
          }).result()
          })
        .then(function(response) {
          valcheck.isString(timestamp.value).should.equal(true);
          response.length.should.equal(0);
          done();
          })
        .catch(done);
      });
    });
    describe('query', function(){
      it('should set and use timestamp', function(done){
        let timestamp = db.createTimestamp();
        valcheck.isNull(timestamp.value).should.equal(true);
        // Query with timestamp set to null
        db.documents.query(
          q.where(
            q.collection('point-in-time')
            ),
          timestamp
          )
        .result(function(response) {
          valcheck.isString(timestamp.value).should.equal(true);
          response.length.should.equal(1);
          // Query with timestamp set to current time
          return db.documents.query(
            q.where(
              q.collection('point-in-time')
              ),
            timestamp
            ).result();
          })
        .then(function(response) {
          valcheck.isString(timestamp.value).should.equal(true);
          response.length.should.equal(1);
          timestamp.value = bigInt(timestamp.value).minus(99999).toString();
          // Read with timestamp set to decremented time
          return db.documents.query(
            q.where(
              q.collection('point-in-time')
              ),
            timestamp
            ).result();
          })
        .then(function(response) {
          valcheck.isString(timestamp.value).should.equal(true);
          response.length.should.equal(0);
          done();
          })
        .catch(done);
      });
    });
  });

  describe('graphs', function(){
    var graphUri   = 'marklogic.com/point-in-time';
    var graphPath  = './test-basic/data/people.ttl';
    var sparqlPath = './test-basic/data/people.rq';
    before(function(done){
      this.timeout(5000);
      // Write default graph
      db.graphs.write('text/turtle', fs.createReadStream(graphPath))
      .result(function(response){
        // Write named graph
        return db.graphs.write(graphUri, 'text/turtle', fs.createReadStream(graphPath))
          .result();
        })
      .then(function(response){
        done();
      })
      .catch(done);
    });
    after(function(done){
      // Remove default graph
      db.graphs.remove()
      .result(function(response){
        // Remove named graph
        return db.graphs.remove(graphUri).result();
        })
      .then(function(response){
        done();
      })
      .catch(done);
    });
    describe('read default graph', function(){
      it('should set and use timestamp', function(done){
        var timestamp = db.createTimestamp();
        valcheck.isNull(timestamp.value).should.equal(true);
        // Query with timestamp set to null
        db.graphs.read({
          contentType: 'application/rdf+json',
          timestamp: timestamp
        })
        .result(function(response){
          valcheck.isString(timestamp.value).should.equal(true);
          response.should.not.be.empty();
          // Query with timestamp set to current time
          return db.graphs.read({
            contentType: 'application/rdf+json',
            timestamp: timestamp
          }).result();
        })
        .then(function(response){
          valcheck.isString(timestamp.value).should.equal(true);
          response.should.not.be.empty();
          timestamp.value = bigInt(timestamp.value).minus(99999).toString();
          // Query with timestamp set to decremented time
          return db.graphs.read({
            contentType: 'application/rdf+json',
            timestamp: timestamp
          }).result();
        })
        .then(function(response) {
          valcheck.isString(timestamp.value).should.equal(true);
          response.should.be.empty();
          done();
          })
        .catch(done);
      });
    });
    describe('list named graph', function(){
      it('should set and use timestamp', function(done){
        var timestamp = db.createTimestamp();
        valcheck.isNull(timestamp.value).should.equal(true);
        // Query with timestamp set to null
        db.graphs.list(timestamp)
        .result(function(response){
          valcheck.isString(timestamp.value).should.equal(true);
          response.some(function(collection){
            return collection === 'marklogic.com/point-in-time';
          }).should.equal(true);
          // Query with timestamp set to current time
          return db.graphs.list(timestamp).result();
        })
        .then(function(response){
          valcheck.isString(timestamp.value).should.equal(true);
          response.some(function(collection){
            return collection === 'marklogic.com/point-in-time';
          }).should.equal(true);
          timestamp.value = bigInt(timestamp.value).minus(99999).toString();
          // Query with timestamp set to decremented time
          return db.graphs.list(timestamp).result();
        })
        .then(function(response) {
          valcheck.isString(timestamp.value).should.equal(true);
          response.some(function(collection){
            return collection === 'marklogic.com/point-in-time';
          }).should.equal(false);
          done();
          })
        .catch(done);
      });
    });
    describe('sparql query', function(){
      it('should set and use timestamp', function(done){
        var timestamp = db.createTimestamp();
        valcheck.isNull(timestamp.value).should.equal(true);
        // Query with timestamp set to null
        db.graphs.sparql({
          contentType: 'application/sparql-results+json',
          query: fs.createReadStream(sparqlPath),
          timestamp: timestamp
        })
        .result(function(response) {
          valcheck.isString(timestamp.value).should.equal(true);
          response.results.bindings.length.should.be.above(0);
          // Query with timestamp set to current time
          return db.graphs.sparql({
            contentType: 'application/sparql-results+json',
            query: fs.createReadStream(sparqlPath),
            timestamp: timestamp
          }).result();
        })
        .then(function(response) {
          valcheck.isString(timestamp.value).should.equal(true);
          response.results.bindings.length.should.be.above(0);
          timestamp.value = bigInt(timestamp.value).minus(99999).toString();
          // Query with timestamp set to decremented time
          return db.graphs.sparql({
            contentType: 'application/sparql-results+json',
            query: fs.createReadStream(sparqlPath),
            timestamp: timestamp
          }).result();
          })
        .then(function(response) {
          valcheck.isString(timestamp.value).should.equal(true);
          response.results.bindings.length.should.equal(0);
          done();
          })
        .catch(done);
      });
    });
  });

  describe('values', function(){
    before(function(done){
      this.timeout(3000);
      // NOTE: must create a string range index on rangeKey5
      db.documents.write({
          uri: '/values/point-in-time1.json',
          collections: ['valuesCollection1'],
          contentType: 'application/json',
          content: {
            id:        'valuesList1',
            values:    [
              {rangeKey5: 31},
              {rangeKey5: 32}
              ]
            }
        }, {
          uri: '/values/point-in-time2.json',
          collections: ['valuesCollection1'],
          contentType: 'application/json',
          content: {
            id:        'valuesList2',
            values:    [
              {rangeKey5: 31},
              {rangeKey5: 32}
              ]
            }
        }, {
          uri: '/values/point-in-time3.json',
          collections: ['valuesCollection1'],
          contentType: 'application/json',
          content: {
            id:        'valuesList3',
            values:    [
              {rangeKey5: 31}
              ]
            }
        }, {
          uri: '/values/point-in-time4.json',
          collections: ['valuesCollection1'],
          contentType: 'application/json',
          content: {
            id:        'valuesList4',
            values:    [
              {rangeKey5: 33}
              ]
            }
          })
      .result(function(response){done();})
      .catch(done);
    });
    after(function(done){
      db.documents.remove({
        uris: ['/values/point-in-time1.json',
               '/values/point-in-time2.json',
               '/values/point-in-time3.json',
               '/values/point-in-time4.json']
      }).result(function(response){
        done();
      }).catch(done);
    });
    describe('values query', function(){
      it('should set and use timestamp', function(done){
        var timestamp = db.createTimestamp();
        valcheck.isNull(timestamp.value).should.equal(true);
        db.values.read(t.fromIndexes(t.range('rangeKey5')), timestamp)
        .result(function(values) {
          valcheck.isString(timestamp.value).should.equal(true);
          values['values-response'].tuple.length.should.be.above(0);
          return db.values.read(
            t.fromIndexes(t.range('rangeKey5')), timestamp
          ).result();
          })
        .then(function(values) {
          valcheck.isString(timestamp.value).should.equal(true);
          values['values-response'].tuple.length.should.be.above(0);
          timestamp.value = bigInt(timestamp.value).minus(99999).toString();
          return db.values.read(
            t.fromIndexes(t.range('rangeKey5')), timestamp
          ).result();
        })
        .then(function(values) {
          values['values-response'].should.not.have.property('tuple');
          done();
        })
        .catch(done);
      });
    });
  });

  describe('rows', function(){
    const planFromBuilder = p.fromLiterals([
        {"id": 1,"name": "Master 1","date": "2015-12-01"},
        {"id": 2,"name": "Master 2","date": "2015-12-02"},
        {"id": 3,"name": "Master 3","date": "2015-12-03"},
      ])
    .where(p.gt(p.col('id'), 1));
    describe('rows query', function(){
      it('should set and use timestamp', function(){
        var timestamp = db.createTimestamp();
        valcheck.isNull(timestamp.value).should.equal(true);
        return db.rows.query(planFromBuilder, {timestamp: timestamp})
          .then(function (response) {
            valcheck.isNull(timestamp.value).should.equal(false);
          })
      });
    });
  });

});
