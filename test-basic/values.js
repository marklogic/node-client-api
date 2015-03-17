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
var should   = require('should');

var fs = require('fs');
var valcheck = require('core-util-is');

var testconfig = require('../etc/test-config.js');

var marklogic = require('../');
var t = marklogic.valuesBuilder;

var db = marklogic.createDatabaseClient(testconfig.restReaderConnection);
var dbWriter = marklogic.createDatabaseClient(testconfig.restWriterConnection);
var dbAdmin = marklogic.createDatabaseClient(testconfig.restAdminConnection);

describe('values query', function(){
  before(function(done){
    this.timeout(3000);
    // NOTE: must create a string range index on rangeKey1 and rangeKey2
    dbWriter.documents.write({
        uri: '/test/values/doc1.json',
        collections: ['valuesCollection1'],
        contentType: 'application/json',
        content: {
          id:        'valuesList1',
          values:    [
            {rangeKey3: 31},
            {rangeKey3: 32},
            {rangeKey4: 41},
            {rangeKey4: 42}
            ]
          }
      }, {
        uri: '/test/values/doc2.json',
        collections: ['valuesCollection1'],
        contentType: 'application/json',
        content: {
          id:        'valuesList2',
          values:    [
            {rangeKey3: 31},
            {rangeKey3: 32},
            {rangeKey4: 41}
            ]
          }
      }, {
        uri: '/test/values/doc3.json',
        collections: ['valuesCollection1'],
        contentType: 'application/json',
        content: {
          id:        'valuesList3',
          values:    [
            {rangeKey3: 31},
            {rangeKey4: 41},
            {rangeKey4: 42}
            ]
          }
      }, {
        uri: '/test/values/doc4.json',
        collections: ['valuesCollection1'],
        contentType: 'application/json',
        content: {
          id:        'valuesList4',
          values:    [
            {rangeKey3: 33},
            {rangeKey4: 43}
            ]
          }
        })
    .result(function(response){done();})
    .catch(done);
  });
  describe('for a from indexes clause for values', function() {
    it('should return all values', function(done){
      db.values.read(
        t.fromIndexes(
          t.range('rangeKey3', 'xs:int')
          ).
        where(
          t.collection('valuesCollection1')
          )
        )
      .result(function(values) {
        values.should.have.property('values-response');
        values['values-response'].should.have.property('tuple');
        values['values-response'].tuple.length.should.equal(3);
        values['values-response'].tuple[0].should.have.property('frequency');
        values['values-response'].tuple[0].frequency.should.equal(3);
        values['values-response'].tuple[1].should.have.property('frequency');
        values['values-response'].tuple[1].frequency.should.equal(2);
        values['values-response'].tuple[2].should.have.property('frequency');
        values['values-response'].tuple[2].frequency.should.equal(1);
        done();
        })
      .catch(done);
    });
    it('should return values for a string query', function(done){
      db.values.read(
        t.fromIndexes(
          t.range('rangeKey3', 'xs:int')
          ).
        where(
          t.parsedFrom('id:valuesList2 OR id:valuesList3',
              t.parseBindings(
                  t.value('id', t.bind('id'))
                  )),
          t.collection('valuesCollection1')
          )
        )
      .result(function(values) {
        values.should.have.property('values-response');
        values['values-response'].should.have.property('tuple');
        values['values-response'].tuple.length.should.equal(2);
        values['values-response'].tuple[0].should.have.property('frequency');
        values['values-response'].tuple[0].frequency.should.equal(2);
        values['values-response'].tuple[1].should.have.property('frequency');
        values['values-response'].tuple[1].frequency.should.equal(1);
        done();
        })
      .catch(done);
    });
  });
  describe('for a from indexes clause for tuples', function() {
    it('should return all tuples', function(done){
      db.values.read(
        t.fromIndexes(
          t.range('rangeKey3'),
          t.range(t.property('rangeKey4'))
          ).
        where(
          t.collection('valuesCollection1')
          )
        )
      .result(function(values) {
        values.should.have.property('values-response');
        values['values-response'].should.have.property('tuple');
        values['values-response'].tuple.length.should.equal(5);
        values['values-response'].tuple[0].should.have.property('frequency');
        values['values-response'].tuple[0].frequency.should.equal(3);
        values['values-response'].tuple[1].should.have.property('frequency');
        values['values-response'].tuple[1].frequency.should.equal(2);
        values['values-response'].tuple[2].should.have.property('frequency');
        values['values-response'].tuple[2].frequency.should.equal(2);
        values['values-response'].tuple[3].should.have.property('frequency');
        values['values-response'].tuple[3].frequency.should.equal(1);
        values['values-response'].tuple[4].should.have.property('frequency');
        values['values-response'].tuple[4].frequency.should.equal(1);
        done();
        })
      .catch(done);
    });
    it('should return tuples for a string query', function(done){
      db.values.read(
        t.fromIndexes(
          t.range('rangeKey3'),
          t.range(t.property('rangeKey4'))
          ).
        where(
          t.parsedFrom('id:valuesList2 OR id:valuesList3',
              t.parseBindings(
                  t.value('id', t.bind('id'))
                  )),
          t.collection('valuesCollection1')
          )
        )
      .result(function(values) {
        values.should.have.property('values-response');
        values['values-response'].should.have.property('tuple');
        values['values-response'].tuple.length.should.equal(3);
        values['values-response'].tuple[0].should.have.property('frequency');
        values['values-response'].tuple[0].frequency.should.equal(2);
        values['values-response'].tuple[1].should.have.property('frequency');
        values['values-response'].tuple[1].frequency.should.equal(1);
        values['values-response'].tuple[2].should.have.property('frequency');
        values['values-response'].tuple[2].frequency.should.equal(1);
        done();
        })
      .catch(done);
    });
    it('should return a slice of tuples', function(done){
      db.values.read(
        t.fromIndexes(
            t.range('rangeKey3', 'xs:int'),
            t.range(t.property('rangeKey4'), t.datatype('int'))
          ).
        where(
          t.collection('valuesCollection1')
          ).
        slice(2, 3)
        )
      .result(function(values) {
        values.should.have.property('values-response');
        values['values-response'].should.have.property('tuple');
        values['values-response'].tuple.length.should.equal(3);
        values['values-response'].tuple[0].should.have.property('frequency');
        values['values-response'].tuple[0].frequency.should.equal(2);
        values['values-response'].tuple[1].should.have.property('frequency');
        values['values-response'].tuple[1].frequency.should.equal(2);
        values['values-response'].tuple[2].should.have.property('frequency');
        values['values-response'].tuple[2].frequency.should.equal(1);
        done();
        })
      .catch(done);
    });
    it('should return aggregates over tuples', function(done){
      db.values.read(
        t.fromIndexes(
            t.range('rangeKey3', 'xs:int'),
            t.range(t.property('rangeKey4'), t.datatype('int'))
          ).
        where(
          t.collection('valuesCollection1')
          ).
        slice(0).
        aggregates('correlation', 'covariance')
        )
      .result(function(values) {
        values.should.have.property('values-response');
        values['values-response'].should.have.property('aggregate-result');
        values['values-response']['aggregate-result'].length.should.equal(2);
        values['values-response']['aggregate-result'][0].should.have.property('name');
        values['values-response']['aggregate-result'][0].name.should.equal('correlation');
        values['values-response']['aggregate-result'][1].should.have.property('name');
        values['values-response']['aggregate-result'][1].name.should.equal('covariance');
        done();
        })
      .catch(done);
    });
    it('should return tuples with options', function(done){
      db.values.read(
        t.fromIndexes(
            t.range('rangeKey3', 'xs:int'),
            t.range(t.property('rangeKey4'), t.datatype('int'))
          ).
        where(
          t.collection('valuesCollection1')
          ).
        slice(2, 3).
        withOptions({values:['descending']})
        )
      .result(function(values) {
        values.should.have.property('values-response');
        values['values-response'].should.have.property('tuple');
        values['values-response'].tuple.length.should.equal(3);
        values['values-response'].tuple[0].should.have.property('frequency');
        values['values-response'].tuple[0].frequency.should.equal(1);
        values['values-response'].tuple[1].should.have.property('frequency');
        values['values-response'].tuple[1].frequency.should.equal(2);
        values['values-response'].tuple[2].should.have.property('frequency');
        values['values-response'].tuple[2].frequency.should.equal(2);
        done();
        })
      .catch(done);
    });
  });
  describe('with a transform', function() {
    var transformName = 'flagParam';
    var transformPath = './test-basic/data/flagTransform.xqy';
    before(function(done){
      this.timeout(3000);
      dbAdmin.config.transforms.write(transformName, 'xquery', fs.createReadStream(transformPath))
      .result(function(response){
        done();
        })
      .catch(done);
    });
    it('should transform values', function(done){
      db.values.read(
          t.fromIndexes(
            t.range('rangeKey3', 'xs:int')
            ).
          where(
            t.collection('valuesCollection1')
            ).
          slice(1, 1000,
            t.transform(transformName, {flag:'valuesTest'})
            )
          )
        .result(function(response) {
          response.flagParam.should.equal('valuesTest');
          response.should.have.property('content');
          response.content.should.have.property('values-response');
          done();
          })
        .catch(done);
    });
    it('should transform tuples', function(done){
      db.values.read(
          t.fromIndexes(
            t.range('rangeKey3', 'xs:int'),
            t.range(t.property('rangeKey4'), t.datatype('int'))
            ).
          where(
            t.collection('valuesCollection1')
            ).
          slice(1, 1000,
            t.transform(transformName, {flag:'valuesTest'})
            )
          )
        .result(function(response) {
          response.flagParam.should.equal('valuesTest');
          response.should.have.property('content');
          response.content.should.have.property('values-response');
          done();
          })
        .catch(done);
    });
  });
});
