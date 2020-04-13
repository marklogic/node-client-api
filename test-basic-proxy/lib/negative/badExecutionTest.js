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

const BadExecution = require("./badExecution.js");

describe('bad execution', function() {
  const service = BadExecution.on(testutil.makeClient());

  it('error mapping', function (done) {
    service.errorMapping()
        .then(output => {
          expect.fail('should not succeed');
          done();
        })
        .catch(err => {
          const errorResponse = err.body.errorResponse;
          expect(errorResponse.statusCode).to.eql(418);
          expect(errorResponse.status).to.eql("Status Message For 418");
          expect(errorResponse.messageCode).to.eql('ERROR_MAPPING');
          expect(errorResponse.message).to.contain('Test of error mapping');
          done();
        });
  });
});