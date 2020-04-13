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

const PostOfUrlencodedForNone = require("../generated/postOfUrlencodedForNone.js");

describe('supplemental mappings for atomic parameters', function() {
  const service = PostOfUrlencodedForNone.on(testutil.makeClient());

  it('boolean as string', function(done) {
    service.postOfUrlencodedBooleanForNone0('true')
       .then(output => {
          expect(output).to.be.undefined;
          done();
          })
        .catch(err => {
          expect.fail(err.toString());
          done();
        });
  });
  it('dateTime as string', function(done) {
    service.postOfUrlencodedDateTimeForNone0('2018-01-02T10:09:08+07:00')
       .then(output => {
          expect(output).to.be.undefined;
          done();
          })
        .catch(err => {
          expect.fail(err.toString());
          done();
        });
  });
  it('decimal as number', function(done) {
    service.postOfUrlencodedDecimalForNone0(1.2)
       .then(output => {
          expect(output).to.be.undefined;
          done();
          })
        .catch(err => {
          expect.fail(err.toString());
          done();
        });
  });
  it('double as number', function(done) {
    service.postOfUrlencodedDoubleForNone0(1.2)
       .then(output => {
          expect(output).to.be.undefined;
          done();
          })
        .catch(err => {
          expect.fail(err.toString());
          done();
        });
  });
  it('float as string', function(done) {
    service.postOfUrlencodedFloatForNone0('1.2')
       .then(output => {
          expect(output).to.be.undefined;
          done();
          })
        .catch(err => {
          expect.fail(err.toString());
          done();
        });
  });
  it('int as string', function(done) {
    service.postOfUrlencodedIntForNone0('5')
       .then(output => {
          expect(output).to.be.undefined;
          done();
          })
        .catch(err => {
          expect.fail(err.toString());
          done();
        });
  });
  it('long as number', function(done) {
    service.postOfUrlencodedLongForNone0(5)
       .then(output => {
          expect(output).to.be.undefined;
          done();
          })
        .catch(err => {
          expect.fail(err.toString());
          done();
        });
  });
  it('unsignedInt as string', function(done) {
    service.postOfUrlencodedUnsignedIntForNone0('5')
       .then(output => {
          expect(output).to.be.undefined;
          done();
          })
        .catch(err => {
          expect.fail(err.toString());
          done();
        });
  });
  it('unsigned long as number', function(done) {
    service.postOfUrlencodedUnsignedLongForNone0(5)
       .then(output => {
          expect(output).to.be.undefined;
          done();
          })
        .catch(err => {
          expect.fail(err.toString());
          done();
        });
  });
});
