/*
 * Copyright (c) 2020 MarkLogic Corporation
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
