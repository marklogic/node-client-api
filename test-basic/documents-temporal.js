/*
 * Copyright 2014 MarkLogic Corporation
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

var util   = require('util');

var valcheck     = require('core-util-is');

var testconfig = require('../etc/test-config.js');
var testutil   = require('./test-util.js');

var marklogic = require('../');
var q = marklogic.queryBuilder;

var db = marklogic.createDatabaseClient(testconfig.restWriterConnection);

describe('temporal document', function() {
  var stamp = Math.random().toString();

  var startNow = Date.now();

  var uri1 = '/test/temporal/doc1.json';
  var uri2 = '/test/temporal/doc2.json';

  var validStart = new Date(startNow);
  validStart.setFullYear(validStart.getFullYear() - 3);

  var validEnd = new Date(startNow);
  validEnd.setFullYear(validEnd.getFullYear() - 2);

  var rangeStart = new Date(validStart.getTime());
  rangeStart.setFullYear(validStart.getFullYear() - 1);

  var rangeEnd = new Date(validEnd.getTime());
  rangeEnd.setFullYear(validEnd.getFullYear() + 1);

  it('should write and read temporal documents', function(done) {
    db.documents.write({
      temporalCollection: 'temporalCollection',
      documents:[{
          uri:         uri1,
          contentType: 'application/json',
          content: {
            property1:       'belief 1',
            stamp:           stamp,
            systemStartTime: '1111-11-11T11:11:11Z',
            systemEndTime:   '9999-12-31T23:59:59Z',
            validStartTime:  validStart,
            validEndTime:    validEnd
          }
        },{
          uri:         uri2,
          contentType: 'application/json',
          content: {
            property1:       'belief 2',
            stamp:           stamp,
            systemStartTime: '1111-11-11T11:11:11Z',
            systemEndTime:   '9999-12-31T23:59:59Z',
            validStartTime:  validStart,
            validEndTime:    validEnd
            }
        }]}).
    result(function(response){
      var documents = response.documents;
      documents.should.have.property('length');
      documents.length.should.equal(2);
      var uris = documents.map(function(document){return document.uri;});
      return db.documents.read(uris).result();
      }, done).
    then(function(documents){
      documents.should.have.property('length');
      documents.length.should.equal(2);
      var latestNow = Date.now();      
      for (var i=0; i < 2; i++) {
        var document = documents[i];
        document.should.have.property('content');
        document.content.should.have.property('systemStartTime');
        var documentStart = new Date(document.content.systemStartTime).getTime();
        latestNow.should.be.greaterThan(documentStart);
      }
      done();}, done);
  });
/*
  it('should query current temporal documents', function(done) {
    db.documents.query(q.where(
        q.value('stamp', stamp),
        q.currentTime('temporalCollection')
      )).
    result(function(documents) {
      documents.should.have.property('length');
      documents.length.should.equal(2);
      var checked = documents.filter(function(document){
        return document.uri === uri1 || document.uri === uri2;
        });
      checked.should.have.property('length');
      checked.length.should.equal(2);
      done();
    }, done);
  });
 */
  it('should query a range of temporal documents', function(done) {
    db.documents.query(q.where(
      q.value('stamp', stamp),
      q.periodRange('validTime', 'aln_contained_by', q.period(rangeStart, rangeEnd))
      )).
    result(function(documents) {
      documents.should.have.property('length');
      documents.length.should.equal(2);
      var checked = documents.filter(function(document){
        return document.uri === uri1 || document.uri === uri2;
        });
      checked.should.have.property('length');
      checked.length.should.equal(2);
      done();
    }, done);
  });
  it('should remove temporal documents', function(done) {
    var delUri1 = '/test/temporal/deletableDoc1.json';
    db.documents.write({
      temporalCollection: 'temporalCollection',
      documents:[{
          uri: delUri1,
          contentType: 'application/json',
          content: {
            property1:       'deletable belief',
            stamp:           stamp,
            systemStartTime: '1111-11-11T11:11:11Z',
            systemEndTime:   '9999-12-31T23:59:59Z',
            validStartTime:  validStart,
            validEndTime:    validEnd
          }
        }]}).result().
    then(function(response) {
      return db.documents.remove({
        temporalCollection: 'temporalCollection',
        uri: delUri1
        }).result();
      }, done).
    then(function(response) {
      return db.documents.query(q.where(
          q.document(delUri1),
          q.value('stamp', stamp),
          q.periodRange('validTime', 'aln_contained_by', q.period(rangeStart, rangeEnd))
        )).result();
      }, done).
    then(function(documents) {
      documents.should.have.property('length');
      documents.length.should.equal(1);
      var latestNow = Date.now();      
      var document = documents[0];
      document.should.have.property('content');
      document.content.should.have.property('systemEndTime');
      var documentEnd = new Date(document.content.systemEndTime).getTime();
      latestNow.should.be.greaterThan(documentEnd);
      done();
      }, done);
  });
});
