/*
 * Copyright 2014-2017 MarkLogic Corporation
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

var testconfig = require('../etc/test-config.js');

var marklogic = require('../');

var db = marklogic.createDatabaseClient(testconfig.restWriterConnection);

describe('document patch', function(){
  var uri1 = '/test/patch/doc1.json';
  var uri2 = '/test/patch/doc2.json';
  describe('with JSONPath', function() {
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
        })
      .result(function(response){done();})
      .catch(done);
    });
    it('should insert, replace, and delete', function(done){
      var p = marklogic.patchBuilder;
      db.documents.patch(uri1,
          p.pathLanguage('jsonpath'),
          p.insert('$["arrayParentKey"]', 'last-child', 'appended value'),
          p.replace('$.objectParentKey.replacementKey', 'replacement value'),
          p.remove('$.deletableKey')
          )
      .result(function(response){
        return db.documents.read(uri1).result();
        })
      .then(function(documents) {
          documents.length.should.equal(1);
          var document = documents[0];
          document.should.have.property('content');
          document.content.should.have.property('arrayParentKey');
          document.content.arrayParentKey.length.should.equal(2);
          document.content.arrayParentKey[1].should.equal('appended value');
          document.content.should.have.property('objectParentKey');
          document.content.objectParentKey.should.have.property('replacementKey');
          document.content.objectParentKey.replacementKey.should.equal('replacement value');
          document.should.not.have.property('deletableKey');
          done();
        })
      .catch(done);
    });
  });
  describe('with XPath', function() {
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
        })
      .result(function(response){done();})
      .catch(done);
    });
    it('should insert, replace, and delete', function(done) {
      var p = marklogic.patchBuilder;
      db.documents.patch(uri1,
          p.insert('/node("arrayParentKey")', 'last-child', 'appended value'),
          p.replace('/objectParentKey/replacementKey',
              'replacement value'),
          p.remove('/deletableKey')
          )
      .result(function(response){
        return db.documents.read(uri1).result();
        })
      .then(function(documents) {
          documents.length.should.equal(1);
          var document = documents[0];
          document.should.have.property('content');
          document.content.should.have.property('arrayParentKey');
          document.content.arrayParentKey.length.should.equal(2);
          document.content.arrayParentKey[1].should.equal('appended value');
          document.content.should.have.property('objectParentKey');
          document.content.objectParentKey.should.have.property('replacementKey');
          document.content.objectParentKey.replacementKey.should.equal('replacement value');
          document.should.not.have.property('deletableKey');
          done();
        })
      .catch(done);
    });
  });
  describe('for metadata', function() {
    before(function(done){
      db.documents.write({
        uri: uri1,
        contentType: 'application/json',
        collections: ['collection1/0', 'collection1/1'],
        permissions: [
          {'role-name':'app-builder',  capabilities:['read']},
          {'role-name':'manage-admin', capabilities:['read']},
          {'role-name':'manage-user',  capabilities:['read']}
          ],
        properties: {
          property0: 'property value 0',
          property1: 'property value 1',
          property2: 'property value 2'
          },
        quality: 1,
        metadataValues: {
          meta0: 'metadata value 0',
          meta1: 'metadata value 1',
          meta2: 'metadata value 2'
          },
        content: {key1: 'value 1'}
        },{
        uri: uri2,
        contentType: 'application/json',
        collections: ['collection2/0', 'collection2/1'],
        permissions: [
          {'role-name':'app-builder',  capabilities:['read']},
          {'role-name':'manage-admin', capabilities:['read']},
          {'role-name':'manage-user',  capabilities:['read']}
          ],
        properties: {
          property0: 'property value 0',
          property1: 'property value 1',
          property2: 'property value 2'
          },
        quality: 1,
        metadataValues: {
          meta0: 'metadata value 0',
          meta1: 'metadata value 1',
          meta2: 'metadata value 2'
          },
        content: {key1: 'value 1'}
        })
      .result(function(response){done();})
      .catch(done);
    });
    it('should insert, replace, and delete with raw operations', function(done) {
      var p = marklogic.patchBuilder;
      db.documents.patch({uri:uri1, categories:['metadata'], operations:[
          p.insert('/collections[. eq "collection1/1"]', 'before',
              'collection1/INSERTED_BEFORE'),
          p.insert('/array-node("collections")', 'last-child',
              'collection1/INSERTED_LAST'),
          p.remove('/collections[. eq "collection1/0"]'),
          p.insert('/array-node("permissions")', 'last-child',
              {'role-name':'app-user', capabilities:['read']}
              ),
          p.replace('/permissions[role-name eq "app-builder"]',
              {'role-name':'app-builder', capabilities:['read', 'update']}
              ),
          p.remove('/permissions[role-name eq "manage-user"]'),
          p.insert('/properties/property2', 'before',
              {propertyINSERTED_BEFORE2: 'property value INSERTED_BEFORE'}),
          p.insert('/node("properties")', 'last-child',
              {propertyINSERTED_LAST: 'property value INSERTED_LAST'}),
          p.replace('/properties/property1', 'property value MODIFIED'),
          p.remove('/properties/property0'),
          p.replace('/quality', 2),
          p.insert('/metadataValues/meta2', 'before',
              {metaINSERTED_BEFORE2: 'metadata value INSERTED_BEFORE'}),
          p.insert('/node("metadataValues")', 'last-child',
              {metaINSERTED_LAST: 'metadata value INSERTED_LAST'}),
          p.replace('/metadataValues/meta1', 'metadata value MODIFIED'),
          p.remove('/metadataValues/meta0'),
          ]})
      .result(function(response){
        return db.documents.read({uris:uri1, categories:['metadata']}).result();
        })
      .then(function(documents) {
          documents.length.should.equal(1);
          var document = documents[0];
          document.collections.length.should.equal(3);
          document.collections[0].should.equal('collection1/INSERTED_BEFORE');
          document.collections[1].should.equal('collection1/1');
          document.collections[2].should.equal('collection1/INSERTED_LAST');
          document.collections[document.collections.length - 1].should.equal('collection1/INSERTED_LAST');
          document.should.have.property('permissions');
          var foundAppUser     = false;
          var foundAppBuilder  = false;
          var foundManageUser  = false;
          var foundManageAdmin = false;
          document.permissions.forEach(function(permission){
            switch (permission['role-name']) {
            case 'app-user':
              foundAppUser = true;
              break;
            case 'app-builder':
              foundAppBuilder = true;
              permission.capabilities.length.should.equal(2);
              break;
            case 'manage-admin':
              foundManageAdmin = true;
              break;
            case 'manage-user':
              foundManageUser = true;
              break;
            }
          });
          foundAppUser.should.equal(true);
          foundAppBuilder.should.equal(true);
          foundManageUser.should.equal(false);
          foundManageAdmin.should.equal(true);
          document.should.have.property('properties');
          Object.keys(document.properties).length.should.equal(4);
          document.properties.should.have.property('propertyINSERTED_BEFORE2');
          document.properties.propertyINSERTED_BEFORE2.should.
            equal('property value INSERTED_BEFORE');
          document.properties.should.have.property('property1');
          document.properties.property1.should.equal('property value MODIFIED');
          document.properties.should.have.property('property2');
          document.properties.property2.should.equal('property value 2');
          document.properties.should.have.property('propertyINSERTED_LAST');
          document.properties.propertyINSERTED_LAST.should.
            equal('property value INSERTED_LAST');
          document.should.have.property('quality');
          document.quality.should.equal(2);
          document.should.have.property('metadataValues');
          Object.keys(document.metadataValues).length.should.equal(4);
          document.metadataValues.should.have.property('metaINSERTED_BEFORE2');
          document.metadataValues.metaINSERTED_BEFORE2.should.
            equal('metadata value INSERTED_BEFORE');
          document.metadataValues.should.have.property('meta1');
          document.metadataValues.meta1.should.equal('metadata value MODIFIED');
          document.metadataValues.should.have.property('meta2');
          document.metadataValues.meta2.should.equal('metadata value 2');
          document.metadataValues.should.have.property('metaINSERTED_LAST');
          document.metadataValues.metaINSERTED_LAST.should.
            equal('metadata value INSERTED_LAST');
          done();
        })
      .catch(done);
    });
    it('should insert, replace, and delete with built operations', function(done) {
      var p = marklogic.patchBuilder;
      db.documents.patch({uri:uri2, categories:['metadata'], operations:[
          p.collections.add('collection2/ADDED'),
          p.collections.remove('collection2/0'),
          p.permissions.add('app-user', 'read'),
          p.permissions.replace('app-builder', ['read', 'update']),
          p.permissions.remove('manage-user'),
          p.properties.add('propertyADDED', 'property value ADDED'),
          p.properties.replace('property1', 'property value MODIFIED'),
          p.properties.remove('property0'),
          p.quality.set(2),
          p.metadataValues.add('metaADDED', 'metadata value ADDED'),
          p.metadataValues.replace('meta1', 'metadata value MODIFIED'),
          p.metadataValues.remove('meta0')
          ]})
      .result(function(response){
        return db.documents.read({uris:uri2, categories:['metadata']}).result();
        })
      .then(function(documents) {
          documents.length.should.equal(1);
          var document = documents[0];
          document.collections.length.should.equal(2);
          document.collections[0].should.equal('collection2/1');
          document.collections[1].should.equal('collection2/ADDED');
          document.collections[document.collections.length - 1].should.equal('collection2/ADDED');
          document.should.have.property('permissions');
          var foundAppUser     = false;
          var foundAppBuilder  = false;
          var foundManageAdmin = false;
          var foundManageUser  = false;
          document.permissions.forEach(function(permission){
            switch (permission['role-name']) {
            case 'app-user':
              foundAppUser = true;
              permission.capabilities.length.should.equal(1);
              break;
            case 'app-builder':
              foundAppBuilder = true;
              permission.capabilities.length.should.equal(2);
              break;
            case 'manage-admin':
              foundManageAdmin = true;
              break;
            case 'manage-user':
              foundManageUser = true;
              break;
            }
          });
          foundAppUser.should.equal(true);
          foundAppBuilder.should.equal(true);
          foundManageUser.should.equal(false);
          foundManageAdmin.should.equal(true);
          document.should.have.property('properties');
          Object.keys(document.properties).length.should.equal(3);
          document.properties.should.have.property('property1');
          document.properties.property1.should.equal('property value MODIFIED');
          document.properties.should.have.property('property2');
          document.properties.property2.should.equal('property value 2');
          document.properties.should.have.property('propertyADDED');
          document.properties.propertyADDED.should.equal('property value ADDED');
          document.should.have.property('quality');
          document.quality.should.equal(2);
          Object.keys(document.metadataValues).length.should.equal(3);
          document.metadataValues.should.have.property('meta1');
          document.metadataValues.meta1.should.equal('metadata value MODIFIED');
          document.metadataValues.should.have.property('meta2');
          document.metadataValues.meta2.should.equal('metadata value 2');
          document.metadataValues.should.have.property('metaADDED');
          document.metadataValues.metaADDED.should.equal('metadata value ADDED');
          done();
        })
      .catch(done);
    });
  });
  describe('as raw positional params', function() {
    var jsonUri = '/test/patch/raw1.json';
    var xmlUri  = '/test/patch/raw1.xml';
    before(function(done){
      db.documents.write({
          uri: jsonUri,
          contentType: 'application/json',
          content: {
            id:              'patchDoc1',
            arrayParentKey:  ['existing value'],
            objectParentKey: {replacementKey: 'replaceable value'},
            deletableKey:    'deletable value'
            }
        },{
          uri: xmlUri,
          contentType: 'application/xml',
          content:     '<doc><appendable/><replaceable/><removable/></doc>'
          })
      .result(function(response){done();})
      .catch(done);
    });
    it('for positional JSON', function(done) {
      db.documents.patch(jsonUri,
          {pathlang:'jsonpath',
           patch:[
             {insert:{
               context:  '$["arrayParentKey"]',
               position: 'last-child',
               content:  'appended value'
               }},
             {replace:{
               select:   '$.objectParentKey.replacementKey',
               content:  'replacement value'
               }},
             {'delete':{
               select:   '$.deletableKey'
               }}
             ]}
          )
      .result(function(response) {
        return db.documents.read(jsonUri).result();
        })
      .then(function(documents) {
          documents.length.should.equal(1);
          var document = documents[0];
          document.should.have.property('content');
          document.content.should.have.property('arrayParentKey');
          document.content.arrayParentKey.length.should.equal(2);
          document.content.arrayParentKey[1].should.equal('appended value');
          document.content.should.have.property('objectParentKey');
          document.content.objectParentKey.should.have.property('replacementKey');
          document.content.objectParentKey.replacementKey.should.equal('replacement value');
          document.should.not.have.property('deletableKey');
          done();
        })
      .catch(done);
    });
    it('for positional XML', function(done) {
      db.documents.patch(xmlUri,
          '<rapi:patch xmlns:rapi="http://marklogic.com/rest-api">'+
          '<rapi:insert context="/doc/appendable" position="last-child"><appended/></rapi:insert>'+
          '<rapi:replace select="/doc/replaceable"><replaced/></rapi:replace>'+
          '<rapi:delete select="/doc/removable"/>'+
          '</rapi:patch>'
        )
      .result(function(response) {
        return db.documents.read(xmlUri).result();
        })
      .then(function(documents) {
          documents.length.should.equal(1);
          var document = documents[0];
          document.should.have.property('content');
          var content = document.content.trim();
          var startPos = content.indexOf('<doc>');
          startPos.should.not.equal(-1);
          content.substring(startPos).should.equal(
              '<doc><appendable><appended/></appendable><replaced/></doc>'
              );
          done();
      })
    .catch(done);
    });
  });
  describe('as raw named params', function() {
    var jsonUri = '/test/patch/raw2.json';
    var xmlUri  = '/test/patch/raw2.xml';
    before(function(done){
      db.documents.write({
          uri: jsonUri,
          contentType: 'application/json',
          content: {
            id:              'patchDoc2',
            arrayParentKey:  ['existing value'],
            objectParentKey: {replacementKey: 'replaceable value'},
            deletableKey:    'deletable value'
            }
        },{
          uri: xmlUri,
          contentType: 'application/xml',
          content:     '<doc><appendable/><replaceable/><removable/></doc>'
          })
      .result(function(response){done();})
      .catch(done);
    });
    it('for named JSON', function(done) {
      db.documents.patch({uri:jsonUri,
          format:'json',
          operations:{pathlang:'jsonpath',
           patch:[
             {insert:{
               context:  '$["arrayParentKey"]',
               position: 'last-child',
               content:  'appended value'
               }},
             {replace:{
               select:   '$.objectParentKey.replacementKey',
               content:  'replacement value'
               }},
             {'delete':{
               select:   '$.deletableKey'
               }}
             ]}
        })
      .result(function(response) {
        return db.documents.read(jsonUri).result();
        })
      .then(function(documents) {
          documents.length.should.equal(1);
          var document = documents[0];
          document.should.have.property('content');
          document.content.should.have.property('arrayParentKey');
          document.content.arrayParentKey.length.should.equal(2);
          document.content.arrayParentKey[1].should.equal('appended value');
          document.content.should.have.property('objectParentKey');
          document.content.objectParentKey.should.have.property('replacementKey');
          document.content.objectParentKey.replacementKey.should.equal('replacement value');
          document.should.not.have.property('deletableKey');
          done();
        })
      .catch(done);
    });
    it('for named XML', function(done) {
      db.documents.patch({uri:xmlUri,
        format:'xml',
        operations:
          '<rapi:patch xmlns:rapi="http://marklogic.com/rest-api">'+
          '<rapi:insert context="/doc/appendable" position="last-child"><appended/></rapi:insert>'+
          '<rapi:replace select="/doc/replaceable"><replaced/></rapi:replace>'+
          '<rapi:delete select="/doc/removable"/>'+
          '</rapi:patch>'
        })
      .result(function(response){
        return db.documents.read(xmlUri).result();
        })
      .then(function(documents) {
          documents.length.should.equal(1);
          var document = documents[0];
          document.should.have.property('content');
          var content = document.content.trim();
          var startPos = content.indexOf('<doc>');
          startPos.should.not.equal(-1);
          content.substring(startPos).should.equal(
              '<doc><appendable><appended/></appendable><replaced/></doc>'
              );
          done();
        })
      .catch(done);
    });
  });
  // NOTE: patch library tested in extlibs.js
});
