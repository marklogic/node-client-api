/*
* Copyright © 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
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
    this.timeout(10000);
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
    .catch(done)
    .catch(err => {
          done(err);
      });
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
