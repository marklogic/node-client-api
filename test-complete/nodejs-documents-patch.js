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

var testconfig = require('../etc/test-config-qa.js');

var marklogic = require('../');
var q = marklogic.queryBuilder;
var p = marklogic.patchBuilder;

var db = marklogic.createDatabaseClient(testconfig.restReaderConnection);
var dbWriter = marklogic.createDatabaseClient(testconfig.restWriterConnection);
var dbAdmin = marklogic.createDatabaseClient(testconfig.restAdminConnection);

describe('document patch test', function(){
  before(function(done){
    this.timeout(6000);
// NOTE: must create a string range index on rangeKey1 and rangeKey2
    dbWriter.documents.write({
      uri: '/test/patch/doc1.json',
      collections: ['matchCollection1'],
      contentType: 'application/json',
      content: {
        title: 'Vannevar Bush',
        popularity: 5,
        id: '0011',
        date: '2005-01-01',
        price: {
             amt: 0.1
           },
        p: 'Vannevar Bush wrote an article for The Atlantic Monthly'
        }
      }, { 
      uri: '/test/patch/doc2.json',
      collections: ['matchCollection1', 'matchCollection2'],
      contentType: 'application/json',
      content: {
        title: 'The Bush article',
        popularity: 4,
        id: '0012',
        date: '2006-02-02',
        price: {
             amt: 0.12
           },
        p: 'The Bush article described a device called a Memex'
        }
      }, { 
      uri: '/test/patch/doc3.json',
      collections: ['matchCollection2'],
      contentType: 'application/json',
      content: {
        title: 'For 1945',
        popularity: 3,
        id: '0013',
        date: '2007-03-03',
        price: {
             amt: 1.23
           },
        p: 'For 1945, the thoughts expressed in the Atlantic Monthly were groundbreaking'
        }
      }, { 
      uri: '/test/patch/doc4.json',
      collections: [],
      contentType: 'application/json',
      content: {
        title: 'Vannevar served',
        popularity: 5,
        id: '0024',
        date: '2008-04-04',
        price: {
             amt: 12.34
           },
        p: 'Vannevar served as a prominent policymaker and public intellectual'
        }
      }, { 
        uri: '/test/patch/doc5.json',
        collections: ['matchList'],
        contentType: 'application/json',
        content: {
          title: 'The memex',
          popularity: 5,
          id: '0026',
          date: '2009-05-05',
          price: {
               amt: 123.45
             },
          p: 'The Memex, unfortunately, had no automated search feature'
          }
        }).
    result(function(response){done();}, done);
  });

  var uri1 = '/test/patch/doc5.json';
  var uri2 = '/test/patch/doc4.json';

  it('should apply the patch', function(done){
  
    dbWriter.documents.patch('/test/patch/doc5.json',
      p.pathLanguage('jsonpath'),
      p.insert('$.title', 'after', {newKey:'newChild'}),
      p.insert('$.price.amt', 'before', {numberKey:1234.456}),
      p.replace('$.popularity', 1),
      p.remove('$.p')
    ).result(function(response) {
        //console.log(JSON.stringify(response, null, 4));
        response.uri.should.equal(uri1);
        done();
    }, done);
  });
 // Possibly unhandled ReferenceError: txid is not defined (Need to work on this error)
 /*  it('should apply the patchwith transaction', function(done){
	var tid = null;
	  dbWriter.transactions.open().result().
	  then(function(response) {
	  console.log('Tranc Open');
	  console.log(JSON.stringify(response, null, 4));
	  tid = response.txid;
	  return dbWriter.documents.patch('/test/patch/doc5.json',
      p.pathLanguage('jsonpath'),
      p.insert('$.title', 'after', {newKey:'newChild'}),
      p.insert('$.price.amt', 'before', {numberKey:1234.456}),
      p.replace('$.popularity', 1),
      p.remove('$.p'),
	  txid('tid')
    ).result(function(response) {
        console.log(JSON.stringify(response, null, 4));
        response.uri.should.equal(uri1);
        return dbWriter.transactions.commit(tid).result();
	 }).then(function(response) {
        console.log(JSON.stringify(response, null, 4));
		response.should.be.ok;
        done();
        }, done);
	});
  }); */

  it('should read the patch', function(done){
    db.documents.read('/test/patch/doc5.json').
    result(function(response) {
      var document = response[0];
      //console.log(JSON.stringify(response, null, 4));
      document.content.newKey.should.equal('newChild');
      document.content.popularity.should.equal(1);
      document.should.not.have.property('p');
      done();
    }, done);
  });

  it('should apply the patch on metadata', function(done){
    dbWriter.documents.patch({
      uri: '/test/patch/doc4.json',
      categories: ['metadata'],
      operations: [
        p.insert('array-node("collections")', 'last-child', 'addedCollection'),
        p.insert('properties', 'last-child', {newPropKey: 'newPropValue'}),
        p.replace('quality', 24),
        p.insert('array-node("permissions")', 'last-child', {'role-name': 'app-builder', capabilities: ['read', 'update']}) 
      ]
    }).result(function(response) {
        //console.log(JSON.stringify(response, null, 4));
        response.uri.should.equal(uri2);
        done();
    }, done);
  });

  it('should read the metadata patch', function(done){
    db.documents.read({uris: '/test/patch/doc4.json', categories: ['metadata']}).
    result(function(response) {
      var document = response[0];
      //console.log(JSON.stringify(response, null, 4));
      document.collections[0].should.equal('addedCollection');
      document.quality.should.equal(24);
      document.properties.newPropKey.should.equal('newPropValue');
      var foundAppBuilder = false;
      document.permissions.forEach(function(permission) {
        switch(permission['role-name']) {
          case 'app-builder':
            foundAppBuilder = true;
            break;
        }
      });
      foundAppBuilder.should.equal(true);
      done();
    }, done);
  });
      
  it('should modify the patch on metadata', function(done){
    dbWriter.documents.patch({
      uri: '/test/patch/doc4.json',
      categories: ['metadata'],
      operations: [
        p.replace('collections[. eq "addedCollection"]', 'modifiedCollection'),
        p.insert('properties/newPropKey', 'after', {anotherPropKey: 'anotherPropValue'}),
        p.replace('quality', 42),
        p.remove('permissions[role-name eq "app-builder"]') 
      ]
    }).result(function(response) {
        //console.log(JSON.stringify(response, null, 4));
        response.uri.should.equal(uri2);
        done();
    }, done);
  });

  it('should read the metadata patch after modified', function(done){
    db.documents.read({uris: '/test/patch/doc4.json', categories: ['metadata']}).
    result(function(response) {
      var document = response[0];
      //console.log(JSON.stringify(response, null, 4));
      document.collections[0].should.equal('modifiedCollection');
      document.quality.should.equal(42);
      document.properties.anotherPropKey.should.equal('anotherPropValue');
      var foundAppBuilder = false;
      document.permissions.forEach(function(permission) {
        switch(permission['role-name']) {
          case 'app-builder':
            foundAppBuilder = true;
            break;
        }
      });
      foundAppBuilder.should.equal(false);
      done();
    }, done);
  });

  it('should write xml doc for test', function(done){
    dbWriter.documents.write({
      uri: '/test/patch/xmlDoc1.xml',
      contentType: 'application/xml',
      content: '<parent><firstname>John</firstname><lastname>Doe</lastname><id>5</id></parent>'
    }).result(function(response) {
        //console.log(JSON.stringify(response, null, 4));
        done();
    }, done);
  });

  it('should apply patch on xml doc', function(done){
    dbWriter.documents.patch(
      '/test/patch/xmlDoc1.xml',
      '<rapi:patch xmlns:rapi="http://marklogic.com/rest-api">' +
      '  <rapi:insert context="/parent" position="last-child">' +
      '    <job>engineer</job>' +
      '  </rapi:insert>' +
      '</rapi:patch>'
    ).result(function(response) {
        //console.log(JSON.stringify(response, null, 2));
        response.uri.should.equal('/test/patch/xmlDoc1.xml');
        done();
    }, done);
  });

  it('should read the patch from xml doc', function(done){
    db.documents.read('/test/patch/xmlDoc1.xml').
    result(function(response) {
      var document = response[0];
      strResult = JSON.stringify(document, null, 2);
      strResult.should.containEql('<job>engineer</job>');
      done();
    }, done);
  });

  it('should remove the documents', function(done){
    dbAdmin.documents.removeAll({
      directory: '/test/patch/'
    }).
    result(function(response) {
      response.should.be.ok;
      done();
    }, done);
  });

});
