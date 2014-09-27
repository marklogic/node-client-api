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
var assert = require('assert');
var should = require('should');

var testconfig = require('../etc/test-config.js');

var marklogic = require('../');
var q = marklogic.queryBuilder;

var db = marklogic.createDatabaseClient(testconfig.restWriterConnection);

var otherConnection = {
  database: 'unittest-nodeapi',
  port:     '8000'
  };
Object.keys(testconfig.restWriterConnection).forEach(function(key){
  if (key !== 'port') {
    otherConnection[key] = testconfig.restWriterConnection[key];
  }
});
var otherDb = marklogic.createDatabaseClient(otherConnection);

describe('database clients', function() {
  it('should write in a default db and read in a specified db', function() {
    db.documents.write({
      uri: '/test/database/doc1.json',
      contentType: 'application/json',
      content: {
        id:    'database1',
        value: 'Database One'
        }
      }).result(function(document) {
        return otherDb.documents.probe('/test/database/doc1.json').result();
      }).
    then(function(document) {
      document.exists.should.equal(true);
    });
  });
  it('should write in a specified db and read in a default db', function() {
    otherDb.documents.write({
      uri: '/test/database/doc2.json',
      contentType: 'application/json',
      content: {
        id:    'database2',
        value: 'Database Two'
        }
      }).result(function(document) {
        return db.documents.probe('/test/database/doc2.json').result();
      }).
    then(function(document) {
      document.exists.should.equal(true);
    });
  });
});