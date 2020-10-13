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
const expect = require('chai').expect;

const testutil = require('../testutil');

const BadExecution = require("./badExecution.js");

describe('bad execution', function() {
  const service = BadExecution.on(testutil.makeClient());

  function runTest(expecteds, i, done) {
    const expected = expecteds[i];

    const statusCode = expected[0];
    const sentCode   = expected[1];
    const mappedMsg  = (expected[2] === null) ? 'Internal Server Error' : expected[2];
    const sentMsg    = (expected.length < 4)  ? null                    : expected[3];
    const mappedCode = (expected[2] === null) ? 'INTERNAL ERROR'        : sentCode;

    service.errorMapping(sentCode, sentMsg)
        .then(output => {
          expect.fail('should not succeed');
          done();
        })
        .catch(err => {
          const errorResponse = err.body.errorResponse;
          // console.log(errorResponse);
          expect(errorResponse.statusCode).to.eql(statusCode);
          expect(errorResponse.status).to.eql(mappedMsg);
          expect(errorResponse.messageCode).to.eql(mappedCode);
          if (sentMsg !== null) {
            const inlineMsg = ': fn.error(null, errCode, errMsg); --  ';
            const msgOffset = errorResponse.message.indexOf(inlineMsg) + inlineMsg.length;
            expect(errorResponse.message.substring(msgOffset, msgOffset + sentMsg.length)).to.eql(sentMsg);
          }
          i++;
          if (i < expecteds.length) {
            runTest(expecteds, i, done);
          } else {
            done();
          }
        });
  }

  it('error conditions', function (done) {
    const expecteds = [
      [406, 'Unacceptable1', "Unacceptable in every way"],
      [406, 'Unacceptable2', "Unacceptable, that's how you'll stay", "Unacceptable, that's how you'll stay"],
      [406, 'Unacceptable2', "Unacceptable, that's how you'll stay", null],
      [406, 'Unacceptable2', "Unacceptable, that's how you'll stay", "Unacceptable no matter how near or far"],
      [410, 'Absent1',       "You may search this wide world over"],
      [500, 'Unknown1',      null,                                   "Are the stars out tonight?"]
    ];
    runTest(expecteds, 0, done);
  });
});