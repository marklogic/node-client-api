/*
 * Copyright 2019 MarkLogic Corporation
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
'use strict';

const expect = require('chai').expect;

const proxy = require('../../../lib/proxy-generator.js');

describe('negative generation', function() {
  it('without module name', function(done) {
    try {
      const serviceDecl = {"endpointDirectory" : "/directory/"};
      const endpoints = [{moduleExtension: ".sjs", declaration:{"functionName" : "funcname"}}];
      const proxySrc = proxy.generateSource(null, serviceDecl, endpoints);
      expect.fail('expected exception instead of generated proxy source');
    } catch(err) {
      expect(err.toString()).to.have.string('missing module name');
      done();
    }
  });
  it('without service declaration', function(done) {
    try {
      const endpoints = [{moduleExtension: ".sjs", declaration:{"functionName" : "funcname"}}];
      const proxySrc = proxy.generateSource('module.js', null, endpoints);
      expect.fail('expected exception instead of generated proxy source');
    } catch(err) {
      expect(err.toString()).to.have.string('missing service.json declaration');
      done();
    }
  });
  it('with service declaration lacking endpointDirectory', function(done) {
    try {
      const serviceDecl = {"incorrectProperty" : "/directory/"};
      const endpoints = [{moduleExtension: ".sjs", declaration:{"functionName" : "funcname"}}];
      const proxySrc = proxy.generateSource('module.js', serviceDecl, endpoints);
      expect.fail('expected exception instead of generated proxy source');
    } catch(err) {
      expect(err.toString()).to.have.string('service.json declaration without endpointDirectory property');
      done();
    }
  });
  it('without endpoints', function(done) {
    try {
      const serviceDecl = {"endpointDirectory" : "/directory/"};
      const proxySrc = proxy.generateSource('module.js', serviceDecl, null);
      expect.fail('expected exception instead of generated proxy source');
    } catch(err) {
      expect(err.toString()).to.have.string('no endpoint pairs of *.api declaration and main module');
      done();
    }
  });
  it('with empty endpoints', function(done) {
    try {
      const serviceDecl = {"endpointDirectory" : "/directory/"};
      const proxySrc = proxy.generateSource('module.js', serviceDecl, []);
      expect.fail('expected exception instead of generated proxy source');
    } catch(err) {
      expect(err.toString()).to.have.string('no endpoint pairs of *.api declaration and main module');
      done();
    }
  });
  it('with endpoint lacking moduleExtension', function(done) {
    try {
      const serviceDecl = {"endpointDirectory" : "/directory/"};
      const endpoints = [{incorrectProperty: ".sjs", declaration:{"functionName" : "funcname"}}];
      const proxySrc = proxy.generateSource('module.js', serviceDecl, endpoints);
      expect.fail('expected exception instead of generated proxy source');
    } catch(err) {
      expect(err.toString()).to.have.string('endpoint without moduleExtension property');
      done();
    }
  });
  it('with endpoint lacking function declaration', function(done) {
    try {
      const serviceDecl = {"endpointDirectory" : "/directory/"};
      const endpoints = [{moduleExtension: ".sjs", incorrectProperty:{"functionName" : "funcname"}}];
      const proxySrc = proxy.generateSource('module.js', serviceDecl, endpoints);
      expect.fail('expected exception instead of generated proxy source');
    } catch(err) {
      expect(err.toString()).to.have.string('endpoint without declaration');
      done();
    }
  });
  it('with endpoint lacking function name declaration', function(done) {
    try {
      const serviceDecl = {"endpointDirectory" : "/directory/"};
      const endpoints = [{moduleExtension: ".sjs", declaration:{"incorrectProperty" : "funcname"}}];
      const proxySrc = proxy.generateSource('module.js', serviceDecl, endpoints);
      expect.fail('expected exception instead of generated proxy source');
    } catch(err) {
      expect(err.toString()).to.have.string('endpoint declaration without functionName property');
      done();
    }
  });
  it('with endpoint mapping boolean return value to number', function(done) {
    try {
      const serviceDecl = {"endpointDirectory" : "/directory/"};
      const endpoints = [{moduleExtension: ".sjs", declaration:{
          "functionName" : "funcname",
          "return" : {"datatype" : "boolean", "$jsType" : "number"}
        }}];
      const proxySrc = proxy.generateSource('module.js', serviceDecl, endpoints);
      expect.fail('expected exception instead of generated proxy source');
    } catch(err) {
      expect(err.toString()).to.have.string('optional $jsType number can only be "boolean" or "string" for datatype boolean return value');
      done();
    }
  });
  it('with endpoint mapping float return value to boolean', function(done) {
    try {
      const serviceDecl = {"endpointDirectory" : "/directory/"};
      const endpoints = [{moduleExtension: ".sjs", declaration:{
          "functionName" : "funcname",
          "return" : {"datatype" : "float", "$jsType" : "boolean"}
        }}];
      const proxySrc = proxy.generateSource('module.js', serviceDecl, endpoints);
      expect.fail('expected exception instead of generated proxy source');
    } catch(err) {
      expect(err.toString()).to.have.string('optional $jsType boolean can only be "number" or "string" for datatype float return value');
      done();
    }
  });
  it('with endpoint mapping int return value to boolean', function(done) {
    try {
      const serviceDecl = {"endpointDirectory" : "/directory/"};
      const endpoints = [{moduleExtension: ".sjs", declaration:{
          "functionName" : "funcname",
          "return" : {"datatype" : "int", "$jsType" : "Date"}
        }}];
      const proxySrc = proxy.generateSource('module.js', serviceDecl, endpoints);
      expect.fail('expected exception instead of generated proxy source');
    } catch(err) {
      expect(err.toString()).to.have.string('optional $jsType Date can only be "number" or "string" for datatype int return value');
      done();
    }
  });
  it('with endpoint mapping long return value to number', function(done) {
    try {
      const serviceDecl = {"endpointDirectory" : "/directory/"};
      const endpoints = [{moduleExtension: ".sjs", declaration:{
          "functionName" : "funcname",
          "return" : {"datatype" : "long", "$jsType" : "number"}
        }}];
      const proxySrc = proxy.generateSource('module.js', serviceDecl, endpoints);
      expect.fail('expected exception instead of generated proxy source');
    } catch(err) {
      expect(err.toString()).to.have.string('optional $jsType number can only be "string" for datatype long return value');
      done();
    }
  });
  it('with endpoint mapping time return value to invalid data type', function(done) {
    try {
      const serviceDecl = {"endpointDirectory" : "/directory/"};
      const endpoints = [{moduleExtension: ".sjs", declaration:{
          "functionName" : "funcname",
          "return" : {"datatype" : "time", "$jsType" : "invalid"}
        }}];
      const proxySrc = proxy.generateSource('module.js', serviceDecl, endpoints);
      expect.fail('expected exception instead of generated proxy source');
    } catch(err) {
      expect(err.toString()).to.have.string('optional $jsType invalid can only be "string" for datatype time return value');
      done();
    }
  });
});
