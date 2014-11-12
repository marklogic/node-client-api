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

var testconfig = require('../etc/test-config.js');

var marklogic = require('../');
var q = marklogic.queryBuilder;

var db = marklogic.createDatabaseClient(testconfig.restReaderConnection);
var dbWriter = marklogic.createDatabaseClient(testconfig.restWriterConnection);
var dbAdmin = marklogic.createDatabaseClient(testconfig.restAdminConnection);

describe('Document geo query test', function(){
  before(function(done){
    this.timeout(3000);
    dbWriter.documents.write({
      uri: '/test/query/geo/doc1.json',
      collections: ['geoCollection'],
      contentType: 'application/json',
      content: {
        title: 'karl_kara',
        gElemPoint: '12,5',
        gElemChildParent: {
          gElemChildPoint: '12,5'
        },
        gElemPair: {
          latitude: 12,
          longitude: 5
        }
      } 
    }).
    result(function(response){done();}, done);
  });

  it('should do geo query', function(done){
    dbWriter.documents.query(
      q.where(
        q.geoElementPair('gElemPair', 'latitude', 'longitude', q.latlon(12, 5))
      )
    ).
    result(function(response) {
      console.log(JSON.stringify(response, null, 2));
      //response.length.should.equal(2);
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

});
