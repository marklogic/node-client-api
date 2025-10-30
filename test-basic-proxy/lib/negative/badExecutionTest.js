/*
* Copyright (c) 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
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