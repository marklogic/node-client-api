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

var testconfig = require('../etc/test-config.js');

var marklogic = require('../');

var dbReader = marklogic.createDatabaseClient(testconfig.restReaderConnection);

describe('error generated from a server call', function() {

  it('should have a stack trace', function(done){
    // Writing as a reader fails with a 403 error
    dbReader.documents.write({
      uri: '/test/negative/writeAsReader1.txt',
      content: 'the text'
      }).
    result(function(response){
      response.should.equal('SHOULD HAVE FAILED');
      done();
    }, function(error){
      error.statusCode.should.equal(403);
      // verify client-side stack
      error.should.have.property('stack');
      const errorResponse = error.body.errorResponse;
      errorResponse.statusCode.should.equal(403);
      errorResponse.status.should.equal('Forbidden');
      errorResponse.messageCode.should.equal('SEC-PRIV');
      errorResponse.message.should.equal('You do not have permission to this method and URL.');
      done();
      });
  });

});
