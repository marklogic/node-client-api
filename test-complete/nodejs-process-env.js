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

process.env.NODE_ENV = 'development'; 

var should = require('should');

var testconfig = require('../etc/test-config-qa.js');

var marklogic = require('../');

var db = marklogic.createDatabaseClient(testconfig.restWriterConnection);

describe('Process Env Test', function() {
 
  before(function(done) {
    this.timeout(10000);
    db.documents.write({
      uri: '/process/env/test.json',
      content: {name:'development'}
    }).result(function(response){done();}, done);
  });

  var selectOneDocument = function() {
    var uri = '/some/uri/test.json'; //replace with VALID URI
    return db.documents.read(uri).result();
  };
  var resolve = function(document) {
    console.log(document);
  };
  var reject = function(error) {
    console.log(error);
  }
  selectOneDocument().then(resolve, reject);

  it('should delete the document', function(done) {
    db.documents.remove('/process/env/test.json').result(function(document) {
      document.removed.should.eql(true);
      done();
    }, done);
  });

process.env.NODE_ENV = undefined;
 
});
