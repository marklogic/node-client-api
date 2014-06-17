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

var testutil = require('./test-util.js');

var marklogic = require('../');

var db = marklogic.createDatabaseClient(testutil.restWriterConnection);

describe('document patch', function(){
  var uri1 = '/test/patch/doc1.json';
  before(function(done){
    db.documents.write({
      uri: uri1,
      collections: ['patchCollection1'],
      contentType: 'application/json',
      content: {
        id:              'patchDoc1',
        arrayParentKey:  ['existing value'],
        objectParentKey: {replacementKey: 'replaceable value'},
        deletableKey:    'deletable value'
        }
      }).
    result(function(response){done();}, done);
  });
  describe('with an insert, replace, and delete', function() {
    it('should modify the document', function(done){
      var p = marklogic.patchBuilder;
/* TODO: switch after XPath supported for JSON on the server
          p.insert('/arrayParentKey', 'last-child', 'appended value'),
          p.replace('/objectParentKey/replacementKey', 'replacement value'),
          p.del('/deletableKey')
 */
      db.documents.patch(uri1,
          p.insert('$.arrayParentKey', 'last-child', 'appended value'),
          p.replace('$.objectParentKey.replacementKey', 'replacement value'),
          p.del('$.deletableKey')
          ).
      result(function(response){
        db.read(uri1).
        result(function(documents) {
          var document = documents[0];
          document.should.be.ok;
          document.content.should.be.ok;
          document.content.arrayParentKey.should.be.ok;
          document.content.arrayParentKey.length.should.equal(2);
          document.content.arrayParentKey[1].should.equal('appended value');
          document.content.objectParentKey.should.be.ok;
          document.content.objectParentKey.replacementKey.should.be.ok;
          document.content.objectParentKey.replacementKey.should.equal('replacement value');
          ('deletableKey' in document).should.equal(false);
          done();}, done);
        }, done);
    });    
  });
  // TODO: metadata patch
});
