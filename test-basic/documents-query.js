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

var fs = require('fs');

var testconfig = require('../etc/test-config.js');

var marklogic = require('../');
var q = marklogic.queryBuilder;

var db = marklogic.createDatabaseClient(testconfig.restReaderConnection);
var dbWriter = marklogic.createDatabaseClient(testconfig.restWriterConnection);
var restAdminDB = marklogic.createDatabaseClient(testconfig.restAdminConnection);

describe('document query', function(){
  before(function(done){
    this.timeout(5000);
    // NOTE: must create a string range index on rangeKey1 and rangeKey2
    dbWriter.documents.write({
      uri: '/test/query/matchDir/doc1.json',
      collections: ['matchCollection1'],
      contentType: 'application/json',
      content: {
        id:       'matchDoc1',
        valueKey: 'match value',
        wordKey:  'matchWord1 unmatchWord2',
        a1:{
          skip:'skippedChild1',
          a2:{
            skip:'skippedChild2',
            extractMatch:'extractedValue'
            }
          }
        }
      }, {
        uri: '/test/query/unmatchDir/doc2.json',
        collections: ['queryCollection0', 'queryCollection1'],
        contentType: 'application/json',
        content: {
          id:       'unmatchDoc2',
          valueKey: 'unmatch value',
          wordKey:  'unmatchWord3'
          }
      }, {
        uri: '/test/query/matchList/doc1.json',
        collections: ['matchList'],
        contentType: 'application/json',
        content: {
          id:        'matchList1',
          rangeKey1: 'aa',
          rangeKey2: 'ba',
          scoreKey:  'unselectedWord unselectedWord unselectedWord unselectedWord'
          }
      }, {
        uri: '/test/query/matchList/doc2.json',
        collections: ['matchList'],
        contentType: 'application/json',
        content: {
          id:        'matchList2',
          rangeKey1: 'ab',
          rangeKey2: 'ba',
          scoreKey:  'matchList unselectedWord unselectedWord unselectedWord'
          }
      }, {
        uri: '/test/query/matchList/doc3.json',
        collections: ['matchList'],
        contentType: 'application/json',
        content: {
          id:        'matchList3',
          rangeKey1: 'aa',
          rangeKey2: 'bb',
          scoreKey:  'matchList matchList unselectedWord unselectedWord'
          }
      }, {
        uri: '/test/query/matchList/doc4.json',
        collections: ['matchList'],
        contentType: 'application/json',
        content: {
          id:        'matchList4',
          rangeKey1: 'ab',
          rangeKey2: 'bb',
          scoreKey:  'matchList matchList matchList unselectedWord'
          }
      }, {
        uri: '/test/query/matchList/doc5.json',
        collections: ['matchList'],
        contentType: 'application/json',
        content: {
          id:        'matchList5',
          rangeKey1: 'ac',
          rangeKey2: 'bc',
          scoreKey:  'matchList matchList matchList matchList matchList'
          }
        }).result().
    then(function(response) {
      var dbModule = 'extractFirst.xqy';
      var fsPath   = './test-basic/data/extractFirst.xqy';
      restAdminDB.config.query.snippet.write(dbModule, fs.createReadStream(fsPath))
      .result(function(response){done();})
      .catch(done);
    });
  });
  describe('for a built where clause', function() {
    it('should match a directory query', function(done){
      db.documents.query(
        q.where(
          q.directory('/test/query/matchDir/')
          )
        )
      .result(function(response) {
        response.length.should.equal(1);
        var document = response[0];
        document.should.be.ok;
        document.uri.should.equal('/test/query/matchDir/doc1.json');
        document.should.have.property('content');
        document.content.id.should.equal('matchDoc1');
        done();
        })
      .catch(done);
    });
    it('should match a collection query', function(done){
      db.documents.query(
        q.where(
          q.collection('matchCollection1')
          )
        )
      .result(function(response) {
        response.length.should.equal(1);
        var document = response[0];
        document.should.be.ok;
        document.uri.should.equal('/test/query/matchDir/doc1.json');
        document.should.have.property('content');
        document.content.id.should.equal('matchDoc1');
        done();
        })
      .catch(done);
    });
    it('should match a value query', function(done){
      db.documents.query(
        q.where(
          q.value('valueKey', 'match value')
          )
        )
      .result(function(response) {
        response.length.should.equal(1);
        var document = response[0];
        document.should.be.ok;
        document.uri.should.equal('/test/query/matchDir/doc1.json');
        document.should.have.property('content');
        document.content.id.should.equal('matchDoc1');
        done();
        })
      .catch(done);
    });
    it('should match a word query', function(done){
      db.documents.query(
        q.where(
          q.word('wordKey', 'matchWord1')
          )
        )
      .result(function(response) {
        response.length.should.equal(1);
        var document = response[0];
        document.should.be.ok;
        document.uri.should.equal('/test/query/matchDir/doc1.json');
        document.should.have.property('content');
        document.content.id.should.equal('matchDoc1');
        done();
        })
      .catch(done);
    });
    it('should support an empty result set', function(done){
      db.documents.query(
        q.where(
          q.word('wordKey', 'ThisCriteriaShouldNeverMatch')
          )
        )
      .result(function(response) {
          response.length.should.equal(0);
          done();
        })
      .catch(done);
    });
    it('should calculate key1 and key2 facets without results', function(done){
      db.documents.query(
        q.where(
            q.collection('matchList')
          ).
        calculate(
            q.facet('rangeKey1'),
            q.facet('rangeKey2')).
        slice(0)
        )
      .result(function(response) {
        response.length.should.equal(1);
        response[0].should.have.property('facets');
        response[0].facets.should.have.property('rangeKey1');
        response[0].facets.rangeKey1.should.have.property('facetValues');
        response[0].facets.rangeKey1.facetValues.length.should.equal(3);
        response[0].facets.should.have.property('rangeKey2');
        response[0].facets.rangeKey2.should.have.property('facetValues');
        response[0].facets.rangeKey2.facetValues.length.should.equal(3);
        done();
        })
      .catch(done);
    });
    it('should calculate key1 and key2 facets with ordered results', function(done){
      db.documents.query(
        q.where(
            q.collection('matchList')
          ).
        calculate(
            q.facet('rangeKey1'),
            q.facet('rangeKey2')).
        orderBy('rangeKey1', 'rangeKey2')
        )
      .result(function(response) {
        response.length.should.equal(6);
        var order = [1, 3, 2, 4, 5];
        for (var i=0; i <= order.length; i++) {
          var document = response[i];
          document.should.be.ok;
          if (i === 0) {
            document.should.have.property('facets');
            document.facets.should.have.property('rangeKey1');
            document.facets.rangeKey1.should.have.property('facetValues');
            document.facets.rangeKey1.facetValues.length.should.equal(3);
            document.facets.should.have.property('rangeKey2');
            document.facets.rangeKey2.should.have.property('facetValues');
            document.facets.rangeKey2.facetValues.length.should.equal(3);
          } else {
            document.should.have.property('content');
            document.content.should.have.property('id');
            document.content.id.should.equal('matchList'+order[i - 1]);
          }
        }
        done();
        })
      .catch(done);
    });
    it('should order by key1 and key2', function(done){
      db.documents.query(
        q.where(
            q.collection('matchList')
          ).
        orderBy('rangeKey1', 'rangeKey2')
        )
      .result(function(response) {
        response.length.should.equal(5);
        var order = [1, 3, 2, 4, 5];
        for (var i=0; i < order.length; i++) {
          var document = response[i];
          document.should.be.ok;
          document.should.have.property('content');
          document.content.should.have.property('id');
          document.content.id.should.equal('matchList'+order[i]);
        }
        done();
        })
      .catch(done);
    });
    it('should order by key2 and key1 descending', function(done){
      db.documents.query(
        q.where(
            q.collection('matchList')
          ).
        orderBy('rangeKey2', q.sort('rangeKey1', 'descending'))
        )
      .result(function(response) {
        response.length.should.equal(5);
        var order = [2, 1, 4, 3, 5];
        for (var i=0; i < order.length; i++) {
          var document = response[i];
          document.should.be.ok;
          document.should.have.property('content');
          document.content.should.have.property('id');
          document.content.id.should.equal('matchList'+order[i]);
        }
        done();
        })
      .catch(done);
    });
    it('should order by key1 and score', function(done){
      db.documents.query(
        q.where(
            q.or(
                q.collection('matchList'),
                q.word('scoreKey', 'matchList')
                )
          ).
        orderBy('rangeKey1', q.sort(q.score(), 'descending'))
        )
      .result(function(response) {
        response.length.should.equal(5);
        var order = [3, 1, 4, 2, 5];
        for (var i=0; i < order.length; i++) {
          var document = response[i];
          document.should.be.ok;
          document.should.have.property('content');
          document.content.should.have.property('id');
          document.content.id.should.equal('matchList'+order[i]);
        }
        done();
        })
      .catch(done);
    });
    it('should take a slice from the middle', function(done){
      db.documents.query(
        q.where(
            q.word('scoreKey', 'matchList')
          ).
        slice(2, 3)
        )
      .result(function(response) {
        response.length.should.equal(3);
        for (var i=0; i < 3; i++) {
          var document = response[i];
          document.should.be.ok;
          document.should.have.property('content');
          document.content.should.have.property('id');
          document.content.id.should.equal('matchList'+(4 - i));
        }
        done();
        })
      .catch(done);
    });
    it('should take a slice from the end', function(done){
      db.documents.query(
        q.where(
            q.word('scoreKey', 'matchList')
          ).
        slice(3)
        )
      .result(function(response) {
        response.length.should.equal(2);
        for (var i=0; i < 2; i++) {
          var document = response[i];
          document.should.be.ok;
          document.should.have.property('content');
          document.content.should.have.property('id');
          document.content.id.should.equal('matchList'+(3 - i));
        }
        done();
        })
      .catch(done);
    });
    it('should take a slice with extract', function(done){
      db.documents.query(
        q.where(
            q.word('wordKey', 'matchWord1')
          ).
        slice(1, 1, q.extract({
          selected:'include-with-ancestors',
          paths:'/node("a1")/node("a2")/node("extractMatch")'
          }))
        )
      .result(function(response) {
        response.length.should.equal(1);
        var document = response[0];
        document.should.have.property('content');
        document.content.should.have.property('a1');
        document.content.a1.should.have.property('a2');
        document.content.a1.should.not.have.property('skippedChild1');
        document.content.a1.a2.should.have.property('extractMatch');
        document.content.a1.a2.should.not.have.property('skippedChild2');
        done();
        })
      .catch(done);
    });
    it('should take a slice with a standard snippet', function(done){
      db.documents.query(
        q.where(
            q.word('wordKey', 'matchWord1')
          ).
        slice(1, 1, q.snippet()).
        withOptions({categories: 'none'})
        )
      .result(function(response) {
        response.length.should.equal(1);
        response[0].results.length.should.equal(1);
        response[0].results[0].should.have.property('matches');
        response[0].results[0].matches.length.should.equal(1);
        response[0].results[0].matches[0].should.have.property('match-text');
        response[0].results[0].matches[0]['match-text'].length.should.equal(2);
        response[0].results[0].matches[0]['match-text'][0].should.have.property('highlight');
        response[0].results[0].matches[0]['match-text'][0].highlight.should.equal('matchWord1');
        done();
        })
      .catch(done);
    });
    it('should take a slice with a snippet', function(done){
      db.documents.query(
        q.where(
            q.word('wordKey', 'matchWord1')
          ).
        slice(1, 1, q.snippet('extractFirst.xqy'))
        )
      .result(function(response) {
        response.length.should.equal(2);
        response[0].results.length.should.equal(1);
        response[0].results[0].matches.should.have.property('first');
        done();
        })
      .catch(done);
    });
    it('should get the query plan and permissions', function(done){
      db.documents.query(
        q.where(
            q.collection('matchList')
          ).
        withOptions({queryPlan:true, categories:'permissions'})
        )
      .result(function(response) {
        response.length.should.equal(6);
        // TODO: separate the diagnostics from the facets
        for (var i=0; i < 6; i++) {
          switch(i) {
          case 0:
            var summary = response[i];
            summary.should.be.ok;
            summary.should.have.property('plan');
            break;
          default:
            var document = response[i];
            document.should.be.ok;
            document.should.have.property('permissions');
            document.should.not.have.property('content');
          }
        }
        done();
        })
      .catch(done);
    });
  });
  describe('for a where clause with a parsed query', function() {
    it('should match a value query', function(done){
      db.documents.query(
        q.where(
          q.parsedFrom('matchConstraint:matchWord1',
            q.parseBindings(
              q.word('wordKey', q.bind('matchConstraint'))
              ))
          )
        )
      .result(function(response) {
        response.length.should.equal(1);
        var document = response[0];
        document.should.be.ok;
        document.uri.should.equal('/test/query/matchDir/doc1.json');
        document.should.have.property('content');
        document.content.id.should.equal('matchDoc1');
        done();
        })
      .catch(done);
    });
    it('should match an empty query', function(done){
      db.documents.query(
        q.where(
          q.parsedFrom('',
            q.parseBindings(
              q.bindEmptyAs('no-results')
              ))
          )
        )
      .result(function(response) {
        response.length.should.equal(0);
        done();
        })
      .catch(done);
    });
  });
  describe('for a QBE where clause', function() {
    it('should match a value query', function(done){
      db.documents.query(
        q.where(
            q.byExample({
              valueKey: 'match value'
              })
          )
        )
      .result(function(response) {
        response.length.should.equal(1);
        var document = response[0];
        document.should.be.ok;
        document.uri.should.equal('/test/query/matchDir/doc1.json');
        document.should.have.property('content');
        document.content.id.should.equal('matchDoc1');
        done();
        })
      .catch(done);
    });
    it('should match a word query', function(done){
      db.documents.query(
        q.where(
            q.byExample({
              wordKey: {$word:'matchWord1'}
              })
          )
        )
      .result(function(response) {
        response.length.should.equal(1);
        var document = response[0];
        document.should.be.ok;
        document.uri.should.equal('/test/query/matchDir/doc1.json');
        document.should.have.property('content');
        document.content.id.should.equal('matchDoc1');
        done();
        })
      .catch(done);
    });
    it('should work with calculate and orderBy clauses', function(done){
      db.documents.query(
        q.where(
            q.byExample({$or:[
              {rangeKey1: {$eq:'aa'}},
              {rangeKey1: {$eq:'ab'}},
              {rangeKey1: {$eq:'ac'}}
              ]})
        ).
        calculate(
            q.facet('rangeKey1'),
            q.facet('rangeKey2')).
        orderBy('rangeKey1', 'rangeKey2')
        )
      .result(function(response) {
        response.length.should.equal(6);
        var order = [1, 3, 2, 4, 5];
        for (var i=0; i <= order.length; i++) {
          var document = response[i];
          document.should.be.ok;
          if (i === 0) {
            document.should.have.property('facets');
            document.facets.should.have.property('rangeKey1');
            document.facets.rangeKey1.should.have.property('facetValues');
            document.facets.rangeKey1.facetValues.length.should.equal(3);
            document.facets.should.have.property('rangeKey2');
            document.facets.rangeKey2.should.have.property('facetValues');
            document.facets.rangeKey2.facetValues.length.should.equal(3);
          } else {
            document.should.have.property('content');
            document.content.should.have.property('id');
            document.content.id.should.equal('matchList'+order[i - 1]);
          }
        }
        done();
        })
      .catch(done);
    });
  });
  describe('for a structured query', function() {
    it('should work with a simple structured search', function(done) {
      db.documents.query({
        search: {
          query: {
            queries: [
              {'directory-query':{uri:['/test/query/matchDir/']}}
              ]}
          }
        })
      .result(function(response) {
        response.length.should.equal(1);
        var document = response[0];
        document.should.be.ok;
        document.uri.should.equal('/test/query/matchDir/doc1.json');
        document.should.have.property('content');
        document.content.id.should.equal('matchDoc1');
        done();
        })
      .catch(done);
    });
    it('should work with combined search', function(done){
      db.documents.query({
        search: {
          query: {
            queries: [
              {'or-query':{queries:[
                {'range-query': {
                  'json-property':  'rangeKey1',
                  type:             'xs:string',
                  collation:        'http://marklogic.com/collation/',
                  value:            'aa',
                  'range-operator': 'EQ'
                  }},
                {'range-query': {
                  'json-property':  'rangeKey1',
                  type:             'xs:string',
                  collation:        'http://marklogic.com/collation/',
                  value:            'ab',
                  'range-operator': 'EQ'
                  }},
                {'range-query': {
                  'json-property':  'rangeKey1',
                  type:             'xs:string',
                  collation:        'http://marklogic.com/collation/',
                  value:            'ac',
                  'range-operator': 'EQ'
                  }}
                ]}}
              ]},
          options: {
            constraint: [
              {name: 'rangeKey1',
                range: {
                  'json-property': 'rangeKey1',
                  type:            'xs:string',
                  collation:       'http://marklogic.com/collation/',
                  facet:           true
                  }
                },
              {name: 'rangeKey2',
                range: {
                  'json-property': 'rangeKey2',
                  type:            'xs:string',
                  collation:       'http://marklogic.com/collation/',
                  facet:           true
                  }
                }
              ],
            'sort-order': [
              {direction:        'ascending',
                'json-property': 'rangeKey1',
                type:            'xs:string',
                collation:       'http://marklogic.com/collation/'
                },
              {direction:        'ascending',
                'json-property': 'rangeKey2',
                type:            'xs:string',
                collation:       'http://marklogic.com/collation/'
                }],
            'return-facets':     true
            }
          }
        })
      .result(function(response) {
        response.length.should.equal(6);
        var order = [1, 3, 2, 4, 5];
        for (var i=0; i <= order.length; i++) {
          var document = response[i];
          document.should.be.ok;
          if (i === 0) {
            document.should.have.property('facets');
            document.facets.should.have.property('rangeKey1');
            document.facets.rangeKey1.should.have.property('facetValues');
            document.facets.rangeKey1.facetValues.length.should.equal(3);
            document.facets.should.have.property('rangeKey2');
            document.facets.rangeKey2.should.have.property('facetValues');
            document.facets.rangeKey2.facetValues.length.should.equal(3);
          } else {
            document.should.have.property('content');
            document.content.should.have.property('id');
            document.content.id.should.equal('matchList'+order[i - 1]);
          }
        }
        done();
        })
      .catch(done);
    });
  });
});
