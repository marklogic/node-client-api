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

describe('Binary documents test', function(){
  var fsPath = './node-client-api/test-complete/data/121-GIF-Image-GIF-gif_sample1.gif';
  var uri = '/test/binary/stream/121-GIF-Image-GIF-gif_sample1.gif';
  var binaryValue = null;

  it('should write the binary with Readable stream', function(done){
    this.timeout(10000);
    dbWriter.documents.write({
      uri: uri,
      contentType: 'image/gif',
      collections: ['imageColl'],
      content: fs.createReadStream(fsPath)
    }).
    result(function(response){
      //console.log(response);
      response.documents[0].uri.should.equal(uri);
      done();
    }, done);   
  });

  it('should read the binary with Readable stream', function(done){
    this.timeout(10000);
    dbReader.documents.read(uri).
    result(function(documents) {
      documents[0].content.should.not.equal(null);
      //console.log(documents);
      done();
    }, done);   
  });
  
  it('should remove the document', function(done){
    this.timeout(10000);
    dbWriter.documents.remove(uri).
    result(function(response) {
      response.should.be.ok;
      done();
    }, done);   
  });
  

});

