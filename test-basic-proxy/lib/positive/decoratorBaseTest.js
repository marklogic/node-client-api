/*
 * Copyright 2019-2020 MarkLogic Corporation
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
