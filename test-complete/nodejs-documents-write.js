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

var fs = require('fs');
var concatStream = require('concat-stream');
var valcheck = require('core-util-is');

var testconfig = require('../etc/test-config.js');

var marklogic = require('../');

var db = marklogic.createDatabaseClient(testconfig.restWriterConnection);
var dbReader = marklogic.createDatabaseClient(testconfig.restReaderConnection);

describe('document content', function(){
  describe('write', function(){
    // write and read formats
    describe('a JSON string', function(){
      before(function(done){
        db.documents.write(
          {
            uri: '/test/write/string1.json',
            contentType: 'application/json',
            collections: ['/imaginary/countries', '/vacation/destination'],
            quality: 10,
            permissions: [
              {'role-name':'app-user', capabilities:['read']},
              {'role-name':'app-builder', capabilities:['read', 'update']}
              ],
            properties: {prop1:'foo', prop2:25},
            content: {name:'El Dorado', description:'City of Gold'}
          }
         ).
        result(function(response){done();}, done);
      });
      it('should read back the value', function(done){
        db.documents.read({uris:'/test/write/string1.json', categories:['metadata', 'content']}).
          result(function(documents) {
            valcheck.isUndefined(documents).should.equal(false);
            documents.length.should.equal(1);
            var document = documents[0];
            valcheck.isUndefined(document).should.equal(false);
            valcheck.isUndefined(document.content).should.equal(false);
            valcheck.isUndefined(document.content.name).should.equal(false);
            document.content.name.should.equal('El Dorado');
            document.collections.length.should.equal(2);
            document.collections[0].should.equal('/imaginary/countries');
            document.quality.should.equal(10);
            document.permissions[1].capabilities[0].should.equal('update');
            document.properties.prop1.should.equal('foo');
            done();
            }, done);
      });
    });
  });
});

