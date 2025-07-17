/*
* Copyright © 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/

'use strict';

const fs = require('fs');

const expect = require('chai').expect;

const testutil = require('../testutil');

const Streamer = require("./streamer.js");

describe('streamer service', function() {
  const service = Streamer.on(testutil.makeClient());
  it('itemizer endpoint', function(done) {
    const start  = 201;
    const length = 200;
    const expected = new Array(length).fill(start).map((v, i) => {
      return {
        start:  start,
        length: length,
        value:  v + i
      };
    });
    let actual = new Array();
    service.itemizer(start, length)
        .on('data', function (data) {
          actual.push(data);
          })
        .on('error', done)
        .on('end', function () {
          expect(actual).to.eql(expected);
          done();
        });
  });
});
