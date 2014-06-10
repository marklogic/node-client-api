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

var marklogic = require('../');
var q = marklogic.queryBuilder;

var connection = {
    host:     'localhost',
    port:     '8004',         // TODO: 8013 from common utility module
    user:     'rest-writer',
    password: 'x',
    authType: 'DIGEST'
};
var db = marklogic.createDatabaseClient(connection);

describe('document content', function(){
  describe('write', function(){
    describe('a JSON string', function(){
      before(function(done){
        db.documents.write({
          uri: '/test/write/string1.json',
          contentType: 'application/json',
          content: '{"key1":"value 1"}'
          }).
        result(function(response){done();}, done);
      });
      it('should read back the value', function(done){
        db.read('/test/write/string1.json').
          result(function(document) {
            document.should.be.ok;
            document.content.should.be.ok;
            document.content.key1.should.equal('value 1');
            done();
            }, done);
      });
    });
    describe('a JSON object', function(){
      before(function(done){
        db.documents.write({
          uri: '/test/write/object1.json',
          contentType: 'application/json',
          content: {key1: "value 1"}
          }).
        result(function(response){done();}, done);
      });
      it('should read back the value', function(done){
        db.read('/test/write/object1.json').
          result(function(document) {
            document.should.be.ok;
            document.content.should.be.ok;
            document.content.key1.should.equal('value 1');
            done();
            }, done);
      });
    });
    describe('an XML string', function(){
      before(function(done){
        db.documents.write({
          uri: '/test/write/string1.xml',
          contentType: 'application/xml',
          content: '<doc>content 1</doc>'
          }).
        result(function(response){done();}, done);
      });
      it('should read back the content', function(done){
        db.read('/test/write/string1.xml').
          result(function(document) {
            document.should.be.ok;
            document.content.should.be.ok;
            document.content.should.containEql('<doc>content 1</doc>');
            done();
            }, done);
      });
    });
    describe('a text string', function(){
      before(function(done){
        db.documents.write({
          uri: '/test/write/string1.txt',
          contentType: 'text/plain',
          content: 'text 1'
          }).
        result(function(response){done();}, done);
      });
      it('should read back the content', function(done){
        db.read('/test/write/string1.txt').
          result(function(document) {
            document.should.be.ok;
            document.content.should.be.ok;
            document.content.should.equal('text 1');
            done();
            }, done);
      });
    });
    describe('two JSON documents', function(){
      before(function(done){
        db.documents.write([{
          uri: '/test/write/arrayString1.json',
          contentType: 'application/json',
          content: '{"key1":"value 1"}'
          }, {
          uri: '/test/write/arrayObject2.json',
          contentType: 'application/json',
          content: {key1: 'value 1'}
          }]).
        result(function(response){done();}, done);
      });
      it('should read back both values', function(done){
        db.query(
            q.where(
                q.document(
                    '/test/write/arrayString1.json',
                    '/test/write/arrayObject2.json'
                    )
                )
            ).
          result(function(response) {
            response.length.should.equal(2);
            for (var i=0; i < 2; i++) {
              var document = response[i];
              document.should.be.ok;
              document.content.should.be.ok;
              document.content.key1.should.equal('value 1');
            }
            done();
            }, done);
      });
    });
    describe('a JSON document in two chunks', function(){
      before(function(done){
        var writableStream = db.documents.createWriteStream({
            uri: '/test/write/writable1.json',
            contentType: 'application/json'
            });
        writableStream.result(function(response){done();}, done);

        writableStream.write('{"key1"', 'utf8');
        writableStream.write(       ':"value 1"}', 'utf8');
        writableStream.end();
      });
      it('should read back the value', function(done){
        db.read('/test/write/writable1.json').
          result(function(document) {
            document.should.be.ok;
            document.content.should.be.ok;
            document.content.key1.should.equal('value 1');
            done();
            }, done);
      });
    });

    describe('remove', function(){
      describe('a document', function(){
        before(function(done){
          db.documents.write({
            uri: '/test/remove/doc1.json',
            contentType: 'application/json',
            content: {key1: 'value 1'}
            }).
          result(function(response){done();}, done);
        });
        it('should not exist', function(done){
          db.remove('/test/remove/doc1.json').
            result(function(result) {
              return db.check('/test/remove/doc1.json').result();
              }, done).
            then(function(exists) {
              exists.should.eql(false);
              done();
              }, done);
        });
      });
    });
    describe('check', function(){
      describe('a document', function(){
        before(function(done){
          db.documents.write({
            uri: '/test/check/doc1.json',
            contentType: 'application/json',
            content: {key1: 'value 1'}
            }).
            result(function(response){done();}, done);
        });
        it('should exist', function(done){
          db.check('/test/check/doc1.json').
            result(function(exists) {
              exists.should.eql(true);
              done();
              }, done);
        });
      });
    });
  });
});

describe('document metadata', function(){
  describe('write', function(){
    describe('with content', function(){
      before(function(done){
        db.documents.write({
          uri: '/test/write/metaContent1.json',
          contentType: 'application/json',
          collections: ['collection1/0', 'collection1/1'],
          permissions: [
            {'role-name':'app-user',    capabilities:['read']},
            {'role-name':'app-builder', capabilities:['read', 'update']}
            ],
          quality: 1,
          content: {key1: 'value 1'}
          }).
        result(function(response){done();}, done);
      });
      it('should read back the metadata and content', function(done){
        db.read({uri:'/test/write/metaContent1.json', categories:['metadata', 'content']}).
          result(function(document) {
            document.collections.length.should.equal(2);
            for (var i=0; i < 2; i++) {
              document.collections[i].should.equal('collection1/'+i);
            }
            var permissionsFound = 0;
            document.permissions.forEach(function(permission){
              switch (permission['role-name']) {
              case 'app-user':
                permissionsFound++;
                permission.capabilities.length.should.equal(1);
                permission.capabilities[0].should.equal('read');
                break;
              case 'app-builder':
                permissionsFound++;
                permission.capabilities.length.should.equal(2);
                permission.capabilities.should.containEql('read');
                permission.capabilities.should.containEql('update');
                break;
              }
            });
            permissionsFound.should.equal(2);
            document.quality.should.equal(1);
            document.content.key1.should.equal('value 1');
            done();
            }, done);
      });
    });
    describe('without content', function(){
      before(function(done){
        db.documents.write({
          uri: '/test/write/metaContent1.json',
          collections: ['collection2/0', 'collection2/1'],
          permissions: [
            {'role-name':'app-user',    capabilities:['read', 'update']},
            {'role-name':'app-builder', capabilities:['execute']}
            ],
          quality: 2
          }).
        result(function(response){done();}, done);
      });
      it('should read back the metadata', function(done){
        db.read({uri:'/test/write/metaContent1.json', categories:'metadata'}).
          result(function(document) {
            document.collections.length.should.equal(2);
            for (var i=0; i < 2; i++) {
              document.collections[i].should.equal('collection2/'+i);
            }
            var permissionsFound = 0;
            document.permissions.forEach(function(permission){
              switch (permission['role-name']) {
              case 'app-user':
                permissionsFound++;
                permission.capabilities.length.should.equal(2);
                permission.capabilities.should.containEql('read');
                permission.capabilities.should.containEql('update');
                break;
              case 'app-builder':
                permissionsFound++;
                permission.capabilities.length.should.equal(1);
                permission.capabilities[0].should.equal('execute');
                break;
              }
            });
            permissionsFound.should.equal(2);
            document.quality.should.equal(2);
            ('content' in document).should.equal(false);
            done();
            }, done);
      });
    });
  });
});

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
        db.read(uri1).result(function(document) {
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

describe('document query', function(){
  before(function(done){
// NOTE: must create a string range index on rangeKey1 and rangeKey2
    db.documents.write({
      uri: '/test/query/matchDir/doc1.json',
      collections: ['matchCollection1'],
      contentType: 'application/json',
      content: {
        id:       'matchDoc1',
        valueKey: 'match value',
        wordKey:  'matchWord1 unmatchWord2'
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
        }).
    result(function(response){done();}, done);
  });
  describe('for a built where clause', function() {
    it('should match a directory query', function(done){
      db.query(
        q.where(
          q.directory('/test/query/matchDir/')
          )
        ).
      result(function(response) {
        response.length.should.equal(1);
        var document = response[0];
        document.should.be.ok;
        document.uri.should.equal('/test/query/matchDir/doc1.json');
        document.content.should.be.ok;
        document.content.id.should.equal('matchDoc1');
        done();
      }, done);
    });
    it('should match a collection query', function(done){
      db.query(
        q.where(
          q.collection('matchCollection1')
          )
        ).
      result(function(response) {
        response.length.should.equal(1);
        var document = response[0];
        document.should.be.ok;
        document.uri.should.equal('/test/query/matchDir/doc1.json');
        document.content.should.be.ok;
        document.content.id.should.equal('matchDoc1');
        done();
      }, done);
    });
    it('should match a value query', function(done){
      db.query(
        q.where(
          q.value('valueKey', 'match value')
          )
        ).
      result(function(response) {
        response.length.should.equal(1);
        var document = response[0];
        document.should.be.ok;
        document.uri.should.equal('/test/query/matchDir/doc1.json');
        document.content.should.be.ok;
        document.content.id.should.equal('matchDoc1');
        done();
      }, done);
    });
    it('should match a word query', function(done){
      db.query(
        q.where(
          q.word('wordKey', 'matchWord1')
          )
        ).
      result(function(response) {
        response.length.should.equal(1);
        var document = response[0];
        document.should.be.ok;
        document.uri.should.equal('/test/query/matchDir/doc1.json');
        document.content.should.be.ok;
        document.content.id.should.equal('matchDoc1');
        done();
      }, done);
    });
    it('should calculate key1 and key2 facets without results', function(done){
      db.query(
        q.where(
            q.collection('matchList')
          ).
        calculate(
            q.facet('rangeKey1'),
            q.facet('rangeKey2')).
        slice(0)
        ).
      result(function(response) {
        response.facets.should.be.ok;
        response.facets.rangeKey1.should.be.ok;
        response.facets.rangeKey1.facetValues.should.be.ok;
        response.facets.rangeKey1.facetValues.length.should.equal(3);
        response.facets.rangeKey2.should.be.ok;
        response.facets.rangeKey2.facetValues.should.be.ok;
        response.facets.rangeKey2.facetValues.length.should.equal(3);
        done();
      }, done);
    });
    it('should calculate key1 and key2 facets with ordered results', function(done){
      db.query(
        q.where(
            q.collection('matchList')
          ).
        calculate(
            q.facet('rangeKey1'),
            q.facet('rangeKey2')).
        orderBy('rangeKey1', 'rangeKey2')
        ).
      result(function(response) {
        response.length.should.equal(6);
        var order = [1, 3, 2, 4, 5];
        for (var i=0; i <= order.length; i++) {
          var document = response[i];
          document.should.be.ok;
          if (i === 0) {
            document.facets.should.be.ok;
            document.facets.rangeKey1.should.be.ok;
            document.facets.rangeKey1.facetValues.should.be.ok;
            document.facets.rangeKey1.facetValues.length.should.equal(3);
            document.facets.rangeKey2.should.be.ok;
            document.facets.rangeKey2.facetValues.should.be.ok;
            document.facets.rangeKey2.facetValues.length.should.equal(3);
          } else {
            document.content.should.be.ok;
            document.content.id.should.be.ok;
            document.content.id.should.equal('matchList'+order[i - 1]);
          }
        }
        done();
      }, done);
    });
    it('should order by key1 and key2', function(done){
      db.query(
        q.where(
            q.collection('matchList')
          ).
        orderBy('rangeKey1', 'rangeKey2')
        ).
      result(function(response) {
        response.length.should.equal(5);
        var order = [1, 3, 2, 4, 5];
        for (var i=0; i < order.length; i++) {
          var document = response[i];
          document.should.be.ok;
          document.content.should.be.ok;
          document.content.id.should.be.ok;
          document.content.id.should.equal('matchList'+order[i]);
        }
        done();
      }, done);
    });
    it('should order by key2 and key1 descending', function(done){
      db.query(
        q.where(
            q.collection('matchList')
          ).
        orderBy('rangeKey2', q.sort('rangeKey1', 'descending'))
        ).
      result(function(response) {
        response.length.should.equal(5);
        var order = [2, 1, 4, 3, 5];
        for (var i=0; i < order.length; i++) {
          var document = response[i];
          document.should.be.ok;
          document.content.should.be.ok;
          document.content.id.should.be.ok;
          document.content.id.should.equal('matchList'+order[i]);
        }
        done();
      }, done);
    });
    it('should order by key1 and score', function(done){
      db.query(
        q.where(
            q.or(
                q.collection('matchList'),
                q.word('scoreKey', 'matchList')
                )
          ).
        orderBy('rangeKey1', q.score())
        ).
      result(function(response) {
        response.length.should.equal(5);
        var order = [3, 1, 4, 2, 5];
        for (var i=0; i < order.length; i++) {
          var document = response[i];
          document.should.be.ok;
          document.content.should.be.ok;
          document.content.id.should.be.ok;
          document.content.id.should.equal('matchList'+order[i]);
        }
        done();
      }, done);
    });
    it('should take a slice from the middle', function(done){
      db.query(
        q.where(
            q.word('scoreKey', 'matchList')
          ).
        slice(2, 3)
        ).
      result(function(response) {
        response.length.should.equal(3);
        for (var i=0; i < 3; i++) {
          var document = response[i];
          document.should.be.ok;
          document.content.should.be.ok;
          document.content.id.should.be.ok;
          document.content.id.should.equal('matchList'+(4 - i));
        }
        done();
      }, done);
    });
    it('should take a slice from the end', function(done){
      db.query(
        q.where(
            q.word('scoreKey', 'matchList')
          ).
        slice(3)
        ).
      result(function(response) {
        response.length.should.equal(2);
        for (var i=0; i < 2; i++) {
          var document = response[i];
          document.should.be.ok;
          document.content.should.be.ok;
          document.content.id.should.be.ok;
          document.content.id.should.equal('matchList'+(3 - i));
        }
        done();
      }, done);
    });
    it('should get the plan and permissions', function(done){
      db.query(
        q.where(
            q.collection('matchList')
          ).
        withOptions({queryPlan:true, category:'permissions'})
        ).
      result(function(response) {
        response.length.should.equal(6);
        // TODO: separate the diagnostics from the facets
        for (var i=0; i < 6; i++) {
          switch(i) {
          case 0:
            var summary = response[i];
            summary.should.be.ok;
            summary.plan.should.be.ok;
            break;
          default:
            var document = response[i];
            document.should.be.ok;
            document.permissions.should.be.ok;
            ('content' in document).should.equal(false);
          }
        }
        done();
      }, done);
    });
  });
  describe('for a where clause with a parsed query', function() {
    it('should match a value query', function(done){
      db.query(
        q.where(
          q.parsedFrom('matchConstraint:matchWord1',
            q.parseBindings(
              q.word('wordKey', q.bind('matchConstraint'))
              ))
          )
        ).
      result(function(response) {
        response.length.should.equal(1);
        var document = response[0];
        document.should.be.ok;
        document.uri.should.equal('/test/query/matchDir/doc1.json');
        document.content.should.be.ok;
        document.content.id.should.equal('matchDoc1');
        done();
      }, done);
    });
  });
  describe('for a QBE where clause', function() {
    it('should match a value query', function(done){
      db.query(
        q.where(
            q.byExample({
              valueKey: 'match value'
              })
          )
        ).
      result(function(response) {
        response.length.should.equal(1);
        var document = response[0];
        document.should.be.ok;
        document.uri.should.equal('/test/query/matchDir/doc1.json');
        document.content.should.be.ok;
        document.content.id.should.equal('matchDoc1');
        done();
      }, done);
    });
    it('should match a word query', function(done){
      db.query(
        q.where(
            q.byExample({
              wordKey: {$word:'matchWord1'}
              })
          )
        ).
      result(function(response) {
        response.length.should.equal(1);
        var document = response[0];
        document.should.be.ok;
        document.uri.should.equal('/test/query/matchDir/doc1.json');
        document.content.should.be.ok;
        document.content.id.should.equal('matchDoc1');
        done();
      }, done);
    });
  });
});
