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

var fs     = require('fs');
var stream = require('stream');
var util   = require('util');

var concatStream = require('concat-stream');
var valcheck     = require('core-util-is');
var testconfig = require('../etc/test-config.js');

var marklogic = require('../');
var q = marklogic.queryBuilder;

var dbReader = marklogic.createDatabaseClient(testconfig.restReaderConnection);
var dbWriter = marklogic.createDatabaseClient(testconfig.restWriterConnection);

describe('Binary documents test', function(){
  var binaryPath = './test-complete/data/somePdfFile.pdf';
  var uri = '/test/binary/somePdfFile.pdf';
  var binaryValue = null;
  before(function(done){
    this.timeout(3000);
    fs.createReadStream(binaryPath).
      pipe(concatStream({encoding: 'buffer'}, function(value){
        binaryValue = value;
        done();
      }));    
  });

  it('should write the binary with Readable stream', function(done){
    this.timeout(3000);
    var uri = '/test/write/somePdfFile.pdf';
    var readableBinary = new ValueStream(binaryValue);
    readableBinary.pause();
    dbWriter.documents.write({
      uri: uri,
      contentType: 'application/pdf',
      quality: 25,
      properties: {prop1: 'foo'},
      content: readableBinary
    }).
    result(function(response){
      response.should.have.property('documents');
      done();
    }, done);   
  });

  it('should read the binary with Readable stream', function(done){
    this.timeout(3000);
    var uri = '/test/write/somePdfFile.pdf';
    dbReader.documents.read(uri).
    result(function(documents){
      JSON.stringify(binaryValue).should.equal(
        JSON.stringify(documents[0].content));
      done();
    }, done);   
  });

  it('should read the binary document metadata', function(done) {
    this.timeout(3000);
    var uri = '/test/write/somePdfFile.pdf';
    dbReader.documents.read({uris: uri, categories:['metadata']})
    .result(function(documents) {
      var document = documents[0];
      document.quality.should.equal(25);
      document.properties.prop1.should.equal('foo');
      done();
    }, done);
  });

});

function ValueStream(value) {
  stream.Readable.call(this);
  this.value    = value;
}
util.inherits(ValueStream, stream.Readable);
ValueStream.prototype._read = function() {
  this.push(this.value);
  this.push(null);
};
