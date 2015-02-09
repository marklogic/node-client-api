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
        defaultWordKey: 'aSuggestA defaultOther',
        taggedWordKey:  'bSuggestA taggedOther'
        }
    },{
      uri: '/test/suggest/doc2.json',
      collections: 'suggestCollection',
      contentType: 'application/json',
      content: {
        id:             'suggestDoc2',
        defaultWordKey: 'aSuggestB defaultOther',
        taggedWordKey:  'bSuggestB taggedOther'
        }
    },{
      uri: '/test/suggest/doc3.json',
      collections: 'suggestCollection',
      contentType: 'application/json',
      content: {
        id:             'suggestDoc3',
        defaultWordKey: 'aSuggestC defaultOther',
        taggedWordKey:  'bSuggestC taggedOther'
        }
      })
    .result(function(response){done();})
    .catch(done);
  });
  it('should handle default criteria', function(done) {
    db.documents.suggest(
        'aSuggest',
        q.where(
          q.parsedFrom('',
            q.parseBindings(
              q.word('defaultWordKey', q.bindDefault())
              )
            )
          )
        )
    .result(function(list) {
      list.length.should.equal(3);
      list[0].should.equal('aSuggestA');
      list[1].should.equal('aSuggestB');
      list[2].should.equal('aSuggestC');
      done();
      })
    .catch(done);
  });
  it('should handle tagged criteria', function(done) {
    db.documents.suggest(
        'tag:bSuggest',
        q.where(
          q.parsedFrom('',
            q.parseBindings(
              q.word('taggedWordKey', q.bind('tag'))
              )
            )
          )
        )
    .result(function(list) {
      list.length.should.equal(3);
      list[0].should.equal('tag:bSuggestA');
      list[1].should.equal('tag:bSuggestB');
      list[2].should.equal('tag:bSuggestC');
      done();
      })
    .catch(done);
  });
  it('should override default criteria', function(done) {
    db.documents.suggest(
        'aSuggest',
        q.where(
          q.parsedFrom('',
            q.parseBindings(
              q.word('otherWordKey', q.bindDefault())
              )
            )
          ),
        q.suggestBindings(
          q.word('defaultWordKey', q.bindDefault())
          )
        )
    .result(function(list) {
      list.length.should.equal(3);
      list[0].should.equal('aSuggestA');
      list[1].should.equal('aSuggestB');
      list[2].should.equal('aSuggestC');
      done();
      })
    .catch(done);
  });
  it('should override tagged criteria', function(done) {
    db.documents.suggest(
        'tag:bSuggest',
        q.where(
          q.parsedFrom('',
            q.parseBindings(
              q.word('otherWordKey', q.bind('tag'))
              )
            )
          ),
        q.suggestBindings(
          q.word('taggedWordKey', q.bind('tag'))
          )
        )
    .result(function(list) {
      list.length.should.equal(3);
      list[0].should.equal('tag:bSuggestA');
      list[1].should.equal('tag:bSuggestB');
      list[2].should.equal('tag:bSuggestC');
      done();
      })
    .catch(done);
  });
  it('should apply a limit', function(done) {
    db.documents.suggest({
      partial:  'tag:bSuggest',
      query:    q.where(
          q.parsedFrom('',
            q.parseBindings(
              q.word('otherWordKey', q.bind('tag'))
              )
            )
          ),
      bindings: q.suggestBindings(
          q.word('taggedWordKey', q.bind('tag'))
          ),
      limit:    2
      })
    .result(function(list) {
      list.length.should.equal(2);
      list[0].should.equal('tag:bSuggestA');
      list[1].should.equal('tag:bSuggestB');
      done();
      })
    .catch(done);
  });
});
