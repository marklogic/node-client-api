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

var db = marklogic.createDatabaseClient(testconfig.restReaderConnection);
var dbWriter = marklogic.createDatabaseClient(testconfig.restWriterConnection);

describe('suggest', function() {
  before(function(done){
    this.timeout(5000);
    dbWriter.documents.write({
      uri: '/test/suggest/doc1.json',
      collections: 'suggestCollection',
      contentType: 'application/json',
      content: {
        id:             'suggestDoc1',
        defaultWordKey: 'aSuggestOne defaultOther',
        taggedWordKey:  'bSuggestOne taggedOther'
        }
      },{
        uri: '/test/suggest/doc2.json',
        collections: 'suggestCollection',
        contentType: 'application/json',
        content: {
          id:             'suggestDoc2',
          defaultWordKey: 'aSuggestTwo defaultOther',
          taggedWordKey:  'bSuggestTwo taggedOther'
          }
        }).
      result(function(response){
        done();}, done);
  });
  it('should handle default criteria', function(){
    db.documents.suggest('aSuggest', q.parseBindings(q.word('defaultWordKey', q.bindDefault()))).
    result(function(list) {
      list.length.should.equal(2);
      list[0].should.equal('aSuggestOne');
      list[0].should.equal('aSuggestTwo');
    });
  });
  it('should handle tagged criteria', function(){
    db.documents.suggest('tag:bSuggest', q.parseBindings(q.word('taggedWordKey', q.bind('tag')))).
    result(function(list) {
      list.length.should.equal(2);
      list[0].should.equal('bSuggestOne');
      list[0].should.equal('bSuggestTwo');
    });
  });
});
