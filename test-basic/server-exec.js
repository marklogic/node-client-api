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

var fs       = require('fs');
var valcheck = require('core-util-is');

var testconfig = require('../etc/test-config.js');
var testutil   = require('./test-util.js');

var marklogic = require('../');

var db = marklogic.createDatabaseClient(testconfig.restEvaluatorConnection);
var restAdminDB = marklogic.createDatabaseClient(testconfig.restAdminConnection);

describe('server-side call', function() {
  describe('to eval JavaScript', function() {
    it('should generate a JSON node', function(done) {
      db.eval('xdmp.toJSON({k:"v"});').result(function(values) {
        values.length.should.equal(1);
        checkValue(values[0], 'json', 'node()');
        values[0].value.should.have.property('k');
        values[0].value.k.should.equal('v');
        done();
        })
      .catch(done);
    });
    it('should generate an XML node', function(done) {
      db.eval('xdmp.unquote("<a>element</a>");').result(function(values) {
        values.length.should.equal(1);
        checkValue(values[0], 'xml', 'node()');
        /\<a\>element\<\/a\>/.test(values[0].value).should.equal(true);
        done();
        })
      .catch(done);
    });
    it('should generate a binary node', function(done) {
      db.eval('xdmp.xqueryEval("binary{xdmp:integer-to-hex(255)}");')
      .result(function(values) {
        values.length.should.equal(1);
        checkValue(values[0], 'binary', 'node()');
        valcheck.isBuffer(values[0].value).should.equal(true);
        done();
        })
      .catch(done);
    });
    it('should generate a text node', function(done) {
      db.eval('xdmp.xqueryEval("text{'+"'text value'"+'}");').result(function(values) {
        values.length.should.equal(1);
        checkValue(values[0], 'text', 'node()');
        values[0].value.should.equal('text value');
        done();
        })
      .catch(done);
    });
    it('should generate a string value', function(done) {
      db.eval('"string value";').result(function(values) {
        values.length.should.equal(1);
        checkValue(values[0], 'text', 'string');
        values[0].value.should.equal('string value');
        done();
        })
      .catch(done);
    });
    it('should generate a boolean value', function(done) {
      db.eval('true;').result(function(values) {
        values.length.should.equal(1);
        checkValue(values[0], 'text', 'boolean');
        values[0].value.should.equal(true);
        done();
        })
      .catch(done);
    });
    it('should generate an integer value', function(done) {
      db.eval('3;').result(function(values) {
        values.length.should.equal(1);
        checkValue(values[0], 'text', 'integer');
        values[0].value.should.equal(3);
        done();
        })
      .catch(done);
    });
    it('should generate a decimal value', function(done) {
      db.eval('4.4;').result(function(values) {
        values.length.should.equal(1);
        checkValue(values[0], 'text', 'decimal');
        values[0].value.should.equal(4.4);
        done();
        })
      .catch(done);
    });
    it('should generate a date value', function(done) {
      db.eval('new Date("2010-10-08T10:17:15.125Z");').result(function(values) {
        values.length.should.equal(1);
        checkValue(values[0], 'text', 'dateTime');
        values[0].value.should.eql(new Date('2010-10-08T10:17:15.125Z'));
        done();
        })
      .catch(done);
    });
    it('should generate a list of values', function(done) {
      db.eval('xdmp.arrayValues([1, "two", {i:3}, [4,"four"], xdmp.unquote("<i>5</i>")]);')
      .result(function(values) {
        values.length.should.equal(5);
        checkValue(values[0], 'text', 'integer');
        values[0].value.should.equal(1);
        checkValue(values[1], 'text', 'string');
        values[1].value.should.equal('two');
        checkValue(values[2], 'json', 'node()');
        values[2].value.should.have.property('i');
        values[2].value.i.should.equal(3);
        checkValue(values[3], 'json', 'node()');
        values[3].value.should.have.property('length');
        values[3].value.length.should.equal(2);
        values[3].value[0].should.equal(4);
        values[3].value[1].should.equal('four');
        checkValue(values[4], 'xml', 'node()');
        /\<i\>5\<\/i\>/.test(values[4].value).should.equal(true);
        done();
        })
      .catch(done);
    });
  });
  describe('to pass variables to JavaScript', function() {
    it('should interpolate a Script variable', function(done) {
      db.eval('var you;"hello, "+you;', {you:'world'})
      .result(function(values) {
        values.length.should.equal(1);
        checkValue(values[0], 'text', 'string');
        values[0].value.should.equal('hello, world');
        done();
        })
      .catch(done);
    });
  });
  describe('to eval XQuery', function() {
    it('should generate nodes of different formats', function(done) {
      var src = '('+
        'xdmp:unquote('+"'"+'{"k":"v"}'+"'"+'), '+
        '<a>element</a>, '+
        'binary{xdmp:integer-to-hex(255)}, '+
        'text{"text value"}'+
        ')';
      db.xqueryEval(src).result(function(values) {
        values.length.should.equal(4);
        checkValue(values[0], 'json', 'node()');
        values[0].value.should.have.property('k');
        values[0].value.k.should.equal('v');
        checkValue(values[1], 'xml', 'node()');
        values[1].value.should.equal('<a>element</a>');
        checkValue(values[2], 'binary', 'node()');
        valcheck.isBuffer(values[2].value).should.equal(true);
        checkValue(values[3], 'text', 'node()');
        values[3].value.should.equal('text value');
        done();
        })
      .catch(done);
    });
    it('should generate values of different types', function(done) {
      db.xqueryEval('("string value", fn:true(), 3, 4.4, xs:dateTime("2010-10-08T10:17:15.125Z"))')
      .result(function(values) {
        values.length.should.equal(5);
        checkValue(values[0], 'text', 'string');
        values[0].value.should.equal('string value');
        checkValue(values[1], 'text', 'boolean');
        values[1].value.should.equal(true);
        checkValue(values[2], 'text', 'integer');
        values[2].value.should.equal(3);
        checkValue(values[3], 'text', 'decimal');
        values[3].value.should.equal(4.4);
        checkValue(values[4], 'text', 'dateTime');
        valcheck.isDate(values[4].value).should.equal(true);
        values[4].value.should.eql(new Date('2010-10-08T10:17:15.125Z'));
        done();
        })
      .catch(done);
    });
    it('should generate a list of integer values', function(done) {
      var max = 10;
      db.xqueryEval('(1 to '+max+')').result(function(values) {
        values.length.should.equal(max);
        for (var i=0; i < max; i++) {
          checkValue(values[i], 'text', 'integer');
          values[i].value.should.equal(i + 1);
        }
        done();
        })
      .catch(done);
    });
    it('should generate a miscellaneous value', function(done) {
      db.xqueryEval('(attribute att {"attribute value"})')
      .result(function(values) {
        values.length.should.equal(1);
        checkValue(values[0], 'text', 'attribute()');
        values[0].value.should.equal('attribute value');
        done();
        })
      .catch(done);
    });
/* TODO:
    negative tests for error response
        - insufficient permissions
        - invalid payload

    empty response
    boundary conditions on numbers
 */
  });
  describe('to pass variables to XQuery', function() {
    it('should interpolate a simple XQuery variable', function(done) {
      db.xqueryEval(
          'declare variable $you external;fn:concat("hello, ",$you)',
          {'you':'world'}
          )
      .result(function(values) {
        values.length.should.equal(1);
        checkValue(values[0], 'text', 'string');
        values[0].value.should.equal('hello, world');
        done();
        })
      .catch(done);
    });
    it('should interpolate a namespaced XQuery variable', function(done) {
      db.xqueryEval(
          'declare namespace a = "/ns/a";declare variable $a:you external;fn:concat("hello, ",$a:you)',
          {'{/ns/a}you':'world'}
          )
      .result(function(values) {
        values.length.should.equal(1);
        checkValue(values[0], 'text', 'string');
        values[0].value.should.equal('hello, world');
        done();
        })
      .catch(done);
    });
  });
  describe('to invoke JavaScript', function() {
    var fsPath     = './test-basic/data/echoModule.js';
    var invokePath = '/ext/invokeTest/echoModule.sjs';
    before(function(done){
      this.timeout(3000);
      restAdminDB.config.extlibs.write({
        path:invokePath, contentType:'application/javascript', source:fs.createReadStream(fsPath)
        })
      .result(function(response){done();})
      .catch(done);
    });
    after(function(done) {
      restAdminDB.config.extlibs.remove(invokePath)
      .result(function(response){done();})
      .catch(done);
    });
    it('should return a JSON node', function(done) {
      db.invoke(invokePath, {test:1}).result(function(values) {
        values.length.should.equal(1);
        checkValue(values[0], 'json', 'node()');
        values[0].value.should.have.property('k');
        values[0].value.k.should.equal('v');
        done();
        })
      .catch(done);
    });
    it('should return an XML node', function(done) {
      db.invoke(invokePath, {test:2}).result(function(values) {
        values.length.should.equal(1);
        checkValue(values[0], 'xml', 'node()');
        /\<a\>element\<\/a\>/.test(values[0].value).should.equal(true);
        done();
        })
      .catch(done);
    });
    it('should return a binary node', function(done) {
      db.invoke(invokePath, {test:3}).result(function(values) {
        values.length.should.equal(1);
        checkValue(values[0], 'binary', 'node()');
        valcheck.isBuffer(values[0].value).should.equal(true);
        done();
        })
      .catch(done);
    });
    it('should return a text node', function(done) {
      db.invoke(invokePath, {test:4}).result(function(values) {
        values.length.should.equal(1);
        checkValue(values[0], 'text', 'node()');
        values[0].value.should.equal('text value');
        done();
        })
      .catch(done);
    });
    it('should return a string value', function(done) {
      db.invoke(invokePath, {test:5}).result(function(values) {
        values.length.should.equal(1);
        checkValue(values[0], 'text', 'string');
        values[0].value.should.equal('string value');
        done();
        })
      .catch(done);
    });
    it('should return a boolean value', function(done) {
      db.invoke(invokePath, {test:6}).result(function(values) {
        values.length.should.equal(1);
        checkValue(values[0], 'text', 'boolean');
        values[0].value.should.equal(true);
        done();
        })
      .catch(done);
    });
    it('should return an integer value', function(done) {
      db.invoke(invokePath, {test:7}).result(function(values) {
        values.length.should.equal(1);
        checkValue(values[0], 'text', 'integer');
        values[0].value.should.equal(3);
        done();
        })
      .catch(done);
    });
    it('should return a decimal value', function(done) {
      db.invoke(invokePath, {test:8}).result(function(values) {
        values.length.should.equal(1);
        checkValue(values[0], 'text', 'decimal');
        values[0].value.should.equal(4.4);
        done();
        })
      .catch(done);
    });
    it('should return a date value', function(done) {
      db.invoke(invokePath, {test:9}).result(function(values) {
        values.length.should.equal(1);
        checkValue(values[0], 'text', 'dateTime');
        values[0].value.should.eql(new Date('2010-10-08T10:17:15.125Z'));
        done();
        })
      .catch(done);
    });
    it('should return a list of values', function(done) {
      db.invoke(invokePath, {test:10}).result(function(values) {
        values.length.should.equal(5);
        checkValue(values[0], 'text', 'integer');
        values[0].value.should.equal(1);
        checkValue(values[1], 'text', 'string');
        values[1].value.should.equal('two');
        checkValue(values[2], 'json', 'node()');
        values[2].value.should.have.property('i');
        values[2].value.i.should.equal(3);
        checkValue(values[3], 'json', 'node()');
        values[3].value.should.have.property('length');
        values[3].value.length.should.equal(2);
        values[3].value[0].should.equal(4);
        values[3].value[1].should.equal('four');
        checkValue(values[4], 'xml', 'node()');
        /\<i\>5\<\/i\>/.test(values[4].value).should.equal(true);
        done();
        })
      .catch(done);
    });
  });
  describe('to invoke XQuery', function() {
    var fsPath     = './test-basic/data/echoModule.xqy';
    var dbPath     = '/invokeTest/echoModule.xqy';
    var invokePath = '/ext'+dbPath;
    before(function(done){
      this.timeout(3000);
      restAdminDB.config.extlibs.write({
        path:dbPath, contentType:'application/xquery', source:fs.createReadStream(fsPath)
      })
      .result(function(response){done();})
      .catch(done);
    });
    after(function(done) {
      restAdminDB.config.extlibs.remove(dbPath)
      .result(function(response){done();})
      .catch(done);
    });
    it('should return nodes of different formats', function(done) {
      db.invoke(invokePath, {test:[1,2,3,4]}).result(function(values) {
        values.length.should.equal(4);
        checkValue(values[0], 'json', 'node()');
        values[0].value.should.have.property('k');
        values[0].value.k.should.equal('v');
        checkValue(values[1], 'xml', 'node()');
        values[1].value.should.equal('<a>element</a>');
        checkValue(values[2], 'binary', 'node()');
        valcheck.isBuffer(values[2].value).should.equal(true);
        checkValue(values[3], 'text', 'node()');
        values[3].value.should.equal('text value');
        done();
        })
      .catch(done);
    });
    it('should return values of different types', function(done) {
      db.invoke(invokePath, {test:[5,6,7,8,9]}).result(function(values) {
        values.length.should.equal(5);
        checkValue(values[0], 'text', 'string');
        values[0].value.should.equal('string value');
        checkValue(values[1], 'text', 'boolean');
        values[1].value.should.equal(true);
        checkValue(values[2], 'text', 'integer');
        values[2].value.should.equal(3);
        checkValue(values[3], 'text', 'decimal');
        values[3].value.should.equal(4.4);
        checkValue(values[4], 'text', 'dateTime');
        valcheck.isDate(values[4].value).should.equal(true);
        values[4].value.should.eql(new Date('2010-10-08T10:17:15.125Z'));
        done();
        })
      .catch(done);
    });
    it('should return a list of integer values', function(done) {
      db.invoke(invokePath, {test:[10]}).result(function(values) {
        values.length.should.equal(10);
        for (var i=0; i < 10; i++) {
          checkValue(values[i], 'text', 'integer');
          values[i].value.should.equal(i + 1);
        }
        done();
        })
      .catch(done);
    });
    it('should return a miscellaneous value', function(done) {
      db.invoke(invokePath, {test:[11]}).result(function(values) {
        values.length.should.equal(1);
        checkValue(values[0], 'text', 'attribute()');
        values[0].value.should.equal('attribute value');
        done();
        })
      .catch(done);
    });
  });
});

function checkValue(object, format, datatype) {
  object.should.have.property('format');
  object.format.should.equal(format);
  object.should.have.property('datatype');
  object.datatype.should.equal(datatype);
  object.should.have.property('value');
}
