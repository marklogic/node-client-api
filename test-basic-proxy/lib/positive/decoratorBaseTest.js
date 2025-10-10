/*
* Copyright (c) 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/
'use strict';

const expect = require('chai').expect;

const testutil = require('../testutil');

const DecoratorBase = require("./decoratorBase.js");

describe('decoratorBase service', function() {
  const service = DecoratorBase.on(testutil.makeClient());

  it('docify endpoint', function(done) {
    const input = 'value1';
    service.docify(input)
        .then(output => {
          expect(output.value).to.equal(input);
          done();
          })
        .catch(err => {
          expect.fail(err.toString());
          done();
        });
  });
});
