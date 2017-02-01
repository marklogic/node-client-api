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

var fs = require('fs');
var valcheck = require('core-util-is');

var testconfig = require('../etc/test-config-qa.js');

var marklogic = require('../');
var q = marklogic.queryBuilder;

var db = marklogic.createDatabaseClient(testconfig.restWriterConnection);
var restAdminDB = marklogic.createDatabaseClient(testconfig.restAdminConnection);

describe('when executing resource services', function(){
  describe('using XQuery', function() {
    var xqyServiceName = 'wrapperService';
    var xqyServicePath = './node-client-api/test-basic/data/wrapperService.xqy';
    before(function(done){
      this.timeout(10000);
      restAdminDB.config.resources.write(xqyServiceName, 'xquery', fs.createReadStream(xqyServicePath)).
      result(function(response){
        done();
      }, done);
    });
 it('should get one document', function(done){
      db.resources.get({name:xqyServiceName, params:{value:'foo'}}).
      result(function(response){
        valcheck.isArray(response).should.equal(true);
        response.length.should.equal(1);
        response[0].should.have.property('content');
        response[0].content.should.have.property('readDoc');
        response[0].content.readDoc.should.have.property('param');
        response[0].content.readDoc.param.should.equal('foo');
        done();
      }, done);
    });
 it('should get one document with transaction', function(done){
		this.timeout(10000);
		var tid = null;
		//console.log('Started');
		db.transactions.open().result().
		then(function(response) {
		//console.log('Tranc Open');
		//console.log(JSON.stringify(response, null, 4));
		tid = response.txid;
		//console.log(tid, null, 4);
		return db.resources.get({name:xqyServiceName, params:{value:'foo'}}).
      result(function(response){
		//console.log('Responce of Get');
		//console.log(JSON.stringify(response, null, 4));
        valcheck.isArray(response).should.equal(true);
        response.length.should.equal(1);
        response[0].should.have.property('content');
        response[0].content.should.have.property('readDoc');
        response[0].content.readDoc.should.have.property('param');
        response[0].content.readDoc.param.should.equal('foo');
		return db.transactions.commit(tid).result();
		//console.log('Transaction Closed');
        });
    }).	then(function(response) {
		//console.log(JSON.stringify(response, null, 4));
        response.should.be.ok;
        done();
        }, done);
      });
	  
	  it('should get two documents', function(done){
      db.resources.get({
        name:xqyServiceName, params:{value:'foo', multipart:'true'}
        }).
      result(function(response){
        valcheck.isArray(response).should.equal(true);
        response.length.should.equal(2);
        response[0].should.have.property('content');
        response[0].content.should.have.property('readDoc');
        response[0].content.readDoc.should.have.property('param');
        response[0].content.readDoc.param.should.equal('foo');
        response[1].should.have.property('content');
        response[1].content.should.have.property('readMultiDoc');
        response[1].content.readMultiDoc.should.have.property('multiParam');
        response[1].content.readMultiDoc.multiParam.should.equal('foo');
        done();
      }, done);
    });
	it('should get two documents with transaction', function(done){
      var tid = null;
	  db.transactions.open().result().
		then(function(response) {
		//console.log('Tranc Open');
		//console.log(JSON.stringify(response, null, 4));
		tid = response.txid;
		//console.log(tid, null, 4);
		return db.resources.get({
        name:xqyServiceName, params:{value:'foo', multipart:'true'}
        }).
      result(function(response){
        valcheck.isArray(response).should.equal(true);
        response.length.should.equal(2);
        response[0].should.have.property('content');
        response[0].content.should.have.property('readDoc');
        response[0].content.readDoc.should.have.property('param');
        response[0].content.readDoc.param.should.equal('foo');
        response[1].should.have.property('content');
        response[1].content.should.have.property('readMultiDoc');
        response[1].content.readMultiDoc.should.have.property('multiParam');
        response[1].content.readMultiDoc.multiParam.should.equal('foo');
        return db.transactions.commit(tid).result();
		 }).
		then(function(response) {
			//console.log(JSON.stringify(response, null, 4));
			response.should.be.ok;
        done();
        }, done);
		});
    });
	it('should put one typed document', function(done){
      db.resources.put({
        name:xqyServiceName, params:{value:'foo'}, documents:[
          {contentType:'application/json', content:{one:'typed document'}}
        ]}).
      result(function(response){
        response.should.have.property('wroteDoc');
        response.wroteDoc.should.have.property('param');
        response.wroteDoc.param.should.equal('foo');
        response.wroteDoc.should.have.property('inputDoc');
        response.wroteDoc.inputDoc.should.have.property('one');
        response.wroteDoc.inputDoc.one.should.equal('typed document');
        done();
      }, done);
    });
	 it('should put one typed document with transaction', function(done){
	  var tid = null;
	  db.transactions.open().result().
		then(function(response) {
		//console.log('Tranc Open');
		//console.log(JSON.stringify(response, null, 4));
		tid = response.txid;
		//console.log(tid, null, 4);
		return db.resources.put({
        name:xqyServiceName, params:{value:'foo'}, documents:[
          {contentType:'application/json', content:{one:'typed document'}}
        ]}).
      result(function(response){
	  //console.log(JSON.stringify(response, null, 4));
        response.should.have.property('wroteDoc');
        response.wroteDoc.should.have.property('param');
        response.wroteDoc.param.should.equal('foo');
        response.wroteDoc.should.have.property('inputDoc');
        response.wroteDoc.inputDoc.should.have.property('one');
        response.wroteDoc.inputDoc.one.should.equal('typed document');
		return db.transactions.commit(tid).result();
		 }).
		then(function(response) {
			//console.log(JSON.stringify(response, null, 4));
			response.should.be.ok;
        done();
        }, done);
    });
	
	
	  }); 
it('should put one untyped document', function(done){
      db.resources.put({
        name:xqyServiceName, params:{value:'foo'}, documents:[
          {one:'untyped document'}
        ]}).
      result(function(response){
        response.should.have.property('wroteDoc');
        response.wroteDoc.should.have.property('param');
        response.wroteDoc.param.should.equal('foo');
        response.wroteDoc.should.have.property('inputDoc');
        response.wroteDoc.inputDoc.should.have.property('one');
        response.wroteDoc.inputDoc.one.should.equal('untyped document');
        done();
      }, done);
    });
    it('should put one untyped document with transaction', function(done){
      var tid = null;
	  db.transactions.open().result().
		then(function(response) {
		//console.log('Tranc Open');
		//console.log(JSON.stringify(response, null, 4));
		tid = response.txid;
		//console.log(tid, null, 4);
		return db.resources.put({
        name:xqyServiceName, params:{value:'foo'}, documents:[
          {one:'untyped document'}
        ]}).
      result(function(response){
		//console.log(JSON.stringify(response, null, 4));
        response.should.have.property('wroteDoc');
        response.wroteDoc.should.have.property('param');
        response.wroteDoc.param.should.equal('foo');
        response.wroteDoc.should.have.property('inputDoc');
        response.wroteDoc.inputDoc.should.have.property('one');
        response.wroteDoc.inputDoc.one.should.equal('untyped document');
		return db.transactions.commit(tid).result();
	 }).
	then(function(response) {
		//console.log(JSON.stringify(response, null, 4));
		response.should.be.ok;
        done();
        }, done);
    });
  });
  it('should put two typed documents', function(done){
      db.resources.put({
        name:xqyServiceName, params:{value:'foo'}, documents:[
          {contentType:'application/json', content:{one:'typed document'}},
          {contentType:'application/json', content:{two:'typed document'}}
        ]}).
      result(function(response){
        response.should.have.property('wroteDoc');
        response.wroteDoc.should.have.property('param');
        response.wroteDoc.param.should.equal('foo');
        response.wroteDoc.should.have.property('inputDoc');
        response.wroteDoc.inputDoc.should.have.property('one');
        response.wroteDoc.inputDoc.one.should.equal('typed document');
        response.wroteDoc.should.have.property('multiInputDoc');
        response.wroteDoc.multiInputDoc.should.have.property('two');
        response.wroteDoc.multiInputDoc.two.should.equal('typed document');
        done();
      }, done);
    });
  it('should put two typed documents with transaction', function(done){
      var tid = null;
		db.transactions.open().result().
		then(function(response) {
		//console.log('Tranc Open');
		//console.log(JSON.stringify(response, null, 4));
		tid = response.txid;
		//console.log(tid, null, 4);
		return db.resources.put({
        name:xqyServiceName, params:{value:'foo'}, documents:[
          {contentType:'application/json', content:{one:'typed document'}},
          {contentType:'application/json', content:{two:'typed document'}}
        ]}).
      result(function(response){
		//console.log(JSON.stringify(response, null, 4));
        response.should.have.property('wroteDoc');
        response.wroteDoc.should.have.property('param');
        response.wroteDoc.param.should.equal('foo');
        response.wroteDoc.should.have.property('inputDoc');
        response.wroteDoc.inputDoc.should.have.property('one');
        response.wroteDoc.inputDoc.one.should.equal('typed document');
        response.wroteDoc.should.have.property('multiInputDoc');
        response.wroteDoc.multiInputDoc.should.have.property('two');
        response.wroteDoc.multiInputDoc.two.should.equal('typed document');
         return db.transactions.commit(tid).result();
		}).
		then(function(response) {
        //console.log(JSON.stringify(response, null, 4));
		response.should.be.ok;
        done();
        }, done);
		});
    });
	it('should post two typed documents', function(done){
      db.resources.post({
        name:xqyServiceName, params:{value:'foo', multipart:'true'}, documents:[
          {contentType:'application/json', content:{one:'typed document'}},
          {contentType:'application/json', content:{two:'typed document'}}
        ]}).
      result(function(response){
        valcheck.isArray(response).should.equal(true);
        response.length.should.equal(2);
        response[0].should.have.property('content');
        response[0].content.should.have.property('appliedDoc');
        response[0].content.appliedDoc.should.have.property('param');
        response[0].content.appliedDoc.param.should.equal('foo');
        response[0].content.appliedDoc.should.have.property('inputDoc');
        response[0].content.appliedDoc.inputDoc.should.have.property('one');
        response[0].content.appliedDoc.inputDoc.one.should.equal('typed document');
        response[0].content.appliedDoc.should.have.property('multiInputDoc');
        response[0].content.appliedDoc.multiInputDoc.should.have.property('two');
        response[0].content.appliedDoc.multiInputDoc.two.should.equal('typed document');
        response[1].should.have.property('content');
        response[1].content.should.have.property('appliedMultiDoc');
        response[1].content.appliedMultiDoc.should.have.property('multiParam');
        response[1].content.appliedMultiDoc.multiParam.should.equal('foo');
        done();
      }, done);
    });
    it('should post two typed documents with transaction', function(done){
	    var tid = null;
		db.transactions.open().result().
		then(function(response) {
		//console.log('Tranc Open');
		//console.log(JSON.stringify(response, null, 4));
		tid = response.txid;
		//console.log(tid, null, 4);
		return db.resources.post({
        name:xqyServiceName, params:{value:'foo', multipart:'true'}, documents:[
          {contentType:'application/json', content:{one:'typed document'}},
          {contentType:'application/json', content:{two:'typed document'}}
        ]}).
      result(function(response){
		//console.log(JSON.stringify(response, null, 4));
        valcheck.isArray(response).should.equal(true);
        response.length.should.equal(2);
        response[0].should.have.property('content');
        response[0].content.should.have.property('appliedDoc');
        response[0].content.appliedDoc.should.have.property('param');
        response[0].content.appliedDoc.param.should.equal('foo');
        response[0].content.appliedDoc.should.have.property('inputDoc');
        response[0].content.appliedDoc.inputDoc.should.have.property('one');
        response[0].content.appliedDoc.inputDoc.one.should.equal('typed document');
        response[0].content.appliedDoc.should.have.property('multiInputDoc');
        response[0].content.appliedDoc.multiInputDoc.should.have.property('two');
        response[0].content.appliedDoc.multiInputDoc.two.should.equal('typed document');
        response[1].should.have.property('content');
        response[1].content.should.have.property('appliedMultiDoc');
        response[1].content.appliedMultiDoc.should.have.property('multiParam');
        response[1].content.appliedMultiDoc.multiParam.should.equal('foo');
		return db.transactions.commit(tid).result();
	 }).	then(function(response) {
        //console.log(JSON.stringify(response, null, 4));
		response.should.be.ok;
        done();
        }, done);
    });
	});
    it('should remove one document with transaction', function(done){
      
	  var tid = null;
		db.transactions.open().result().
		then(function(response) {
		//console.log('Tranc Open');
		//console.log(JSON.stringify(response, null, 4));
		tid = response.txid;
		//console.log(tid, null, 4);
		return db.resources.remove({name:xqyServiceName, params:{value:'foo'}}).
      result(function(response){
		//console.log(JSON.stringify(response, null, 4));
        response.should.have.property('deletedDoc');
        response.deletedDoc.should.have.property('param');
        response.deletedDoc.param.should.equal('foo');
		return db.transactions.commit(tid).result();
	   }).
	   then(function(response) {
        //console.log(JSON.stringify(response, null, 4));
		response.should.be.ok;
        done();
        }, done);
    });
	});
   });
});
