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
var should = require('should');

var fs     = require('fs');
var stream = require('stream');
var util   = require('util');

var concatStream = require('concat-stream');
var valcheck     = require('core-util-is');
var testconfig = require('../etc/test-config-qa.js');

var marklogic = require('../');
var q = marklogic.queryBuilder;

var dbReader = marklogic.createDatabaseClient(testconfig.restReaderConnection);
var dbWriter = marklogic.createDatabaseClient(testconfig.restWriterConnection);
var dbAdmin = marklogic.createDatabaseClient(testconfig.restAdminConnection);

describe('Large document write test', function(){
  var binaryPath = './node-client-api/test-complete/data/shaks200all.xml';
  var uri = '/test/binary/shaks200all.xml';
  var binaryValue = null;
  before(function(done){
    this.timeout(10000);
    fs.createReadStream(binaryPath).
      pipe(concatStream({encoding: 'buffer'}, function(value){
        binaryValue = value;
        done();
      }));    
  });

  it('should write the large document with Readable stream', function(done){
    this.timeout(30000);
    var uri = '/test/write/shaks200all.xml';
    var readableBinary = new ValueStream(binaryValue);
    //readableBinary.pause();
    dbWriter.documents.write({
      uri: uri,
      contentType: 'application/xml',
      quality: 25,
      properties: {prop1: 'large file'},
      content: readableBinary
    }).
    result(function(response){
      response.should.have.property('documents');
      done();
    }, done);   
  });

  /*it('should read the large document with Readable stream', function(done){
    this.timeout(30000);
    var uri = '/test/write/shaks200all.xml';
    dbReader.documents.read(uri).
    result(function(documents){
      var count = (JSON.stringify(documents).match(/TITLE/g) || []).length;
      //console.log(count);
      count.should.equal(2064);
      //console.log(JSON.stringify(documents, null, 2));
      done();
    }, done);   
  });*/

  it('should read the large document with Readable stream', function(done){
    this.timeout(30000);
    var uri = '/test/write/shaks200all.xml';
    var chunks = 0;
    var length = 0;
    dbReader.documents.read(uri).stream('chunked').
    on('data', function(chunk){
      //console.log(chunk);
      //console.log(chunk.length);
      chunks++;
      length += chunk.length;
    }).
    on('end', function(){
      //console.log('read '+ chunks + ' chunks of ' + length + ' length');
      chunks.should.be.greaterThan(1);
      length.should.equal(7648280);
      done();
    }, done);   
  });

  it('should read the large document metadata', function(done) {
    this.timeout(10000);
    var uri = '/test/write/shaks200all.xml';
    dbReader.documents.read({uris: uri, categories:['metadata']})
    .result(function(documents) {
      var document = documents[0];
      document.quality.should.equal(25);
      document.properties.prop1.should.equal('large file');
      done();
    }, done);
  });
  
    it('should delete the xml file file', function(done){
    dbAdmin.documents.removeAll({
      all: true
    }).
    result(function(response) {
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
