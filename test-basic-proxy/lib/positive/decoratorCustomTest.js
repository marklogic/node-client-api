/*
* Copyright © 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/
'use strict';

const expect = require('chai').expect;

const testutil = require('../testutil');

const DecoratorBase   = require("./decoratorBase.js");
const DecoratorCustom = require("./decoratorCustom.js");

describe('decoratorCustom service', function() {
  const customServiceDeclaration = {
    endpointDirectory:     '/dbf/test/decoratorCustom/',
    baseEndpointDirectory: '/dbf/test/decoratorBase/',
    endpointExtension:     'xqy'
  };
  const client = testutil.makeClient();
  const baseService   = DecoratorBase.on(client, customServiceDeclaration);
  const customService = DecoratorCustom.on(client);

  it('docify endpoint', function(done) {
    const input    = ['value0', 'value1'];
    const datatype = 'string';
    baseService.docify(input[0])
        .then(output => {
          expect(output.value).to.equal(input[0]);
          expect(output.type).to.equal(datatype);
          return customService.docify(input[1]);
          })
        .then(output => {
          expect(output.value).to.equal(input[1]);
          expect(output.type).to.equal(datatype);
          done();
          })
        .catch(err => {
          expect.fail(err.toString());
          done();
        });
  });
});
