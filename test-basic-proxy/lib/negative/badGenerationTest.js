/*
* Copyright (c) 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
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
  it('with endpoint failing to match schema', function(done) {
    [
      '{"functionName":1}',
      '{"functionName":"numericParams", "params":1}',
      '{"functionName":"numericParamsItem", "params":[1]}',
      '{"functionName":"missingParamsName", "params":[{"datatype":"int"}]}',
      '{"functionName":"numericParamsName", "params":[{"name":1, "datatype":"int"}]}',
      '{"functionName":"missingParamsDataType", "params":[{"name":"p1"}]}',
      '{"functionName":"incorrectParamsDataType", "params":[{"name":"p1", "datatype":"notAType"}]}',
      '{"functionName":"stringParamsMultiple", "params":[{"name":"p1", "datatype":"int", "multiple":"true"}]}',
      '{"functionName":"stringParamsNullable", "params":[{"name":"p1", "datatype":"int", "nullable":"true"}]}',
      '{"functionName":"numericReturn", "return":1}',
      '{"functionName":"missingReturnDataType", "return":{"multiple":true}}',
      '{"functionName":"incorrectReturnDataType", "return":{"datatype":"notAType"}}',
      '{"functionName":"stringReturnMultiple", "return":{"datatype":"int", "multiple":"true"}}',
      '{"functionName":"stringReturnNullable", "return":{"datatype":"int", "nullable":"true"}}'
    ].forEach((badApi, i) => {
      const validationResult = proxy.validate(JSON.parse(badApi));
      expect(validationResult.isValid).to.eql(false);
    });
    done();
  });
});
