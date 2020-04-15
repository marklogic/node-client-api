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

const BadIO = require("./badIO.js");

describe('IO negatives service', function() {
  const service = BadIO.on(testutil.makeClient());
  describe('bad argument endpoint', function() {
    it('with missing argument for non-nullable parameter', function(done) {
      try {
        service.badArg()
            .then(output => {
              expect.fail('expected exception instead of success response');
              done();
            })
            .catch(err => {
              expect.fail('expected exception instead of error response');
              done();
            });
        expect.fail('expected exception instead of call');
      } catch(err) {
        expect(err.toString()).to.have.string('null value not allowed for parameter');
        done();
      }
    });
    it('with null argument for non-nullable parameter', function(done) {
      try {
        service.badArg(null)
            .then(output => {
              expect.fail('expected exception instead of success response');
              done();
            })
            .catch(err => {
              expect.fail('expected exception instead of error response');
              done();
            });
        expect.fail('expected exception instead of call');
      } catch(err) {
        expect(err.toString()).to.have.string('null value not allowed for parameter');
        done();
      }
    });
    it('with multiple arguments for singular parameter', function(done) {
      try {
        service.badArg([1, 2, 3])
            .then(output => {
              expect.fail('expected exception instead of success response');
              done();
            })
            .catch(err => {
              expect.fail('expected exception instead of error response');
              done();
            });
        expect.fail('expected exception instead of call');
      } catch(err) {
        expect(err.toString()).to.have.string('multiples values not allowed for parameter');
        done();
      }
    });
    it('with string argument for integer parameter', function(done) {
      try {
        service.badArg('not a number')
            .then(output => {
              expect.fail('expected error response instead of success response');
              done();
            })
            .catch(err => {
              expect(err).to.have.property('body');
              expect(err.body).to.have.property('errorResponse');
              expect(err.body.errorResponse).to.have.property('messageCode', 'XDMP-LEXVAL');
              done();
            });
      } catch(err) {
        expect.fail('expected error response instead of exception');
        done();
      }
    });
    it('with argument for extra parameter', function(done) {
      try {
        service.badArg(1, 'alpha')
            .then(output => {
              expect.fail('expected exception instead of success response');
              done();
            })
            .catch(err => {
              expect.fail('expected exception instead of error response');
              done();
            });
        expect.fail('expected exception instead of call');
      } catch(err) {
        expect(err.toString()).to.have.string('call with more arguments than parameters');
        done();
      }
    });
  });
  describe('bad return value endpoints', function() {
    it('with undefined for non-nullable return value', function(done) {
      try {
        service.badUndefinedReturn(1)
            .then(output => {
              expect.fail('expected error response instead of success response');
              done();
            })
            .catch(err => {
              expect(err).to.have.property('message');
              expect(err.message).to.have.string('invalid null response');
              done();
            });
      } catch(err) {
        expect.fail('expected error response instead of exception');
        done();
      }
    });
    it('with null for non-nullable return value', function(done) {
      try {
        service.badNullReturn(1)
            .then(output => {
              expect.fail('expected error response instead of success response');
              done();
            })
            .catch(err => {
              expect(err).to.have.property('message');
              expect(err.message).to.have.string('invalid null response');
              done();
            });
      } catch(err) {
        expect.fail('expected error response instead of exception');
        done();
      }
    });
    it('with multiple values for singular return value', function(done) {
      try {
        service.badMultipleReturn(1)
            .then(output => {
              expect.fail('expected error response instead of success response');
              done();
            })
            .catch(err => {
              expect(err).to.have.property('message');
              expect(err.message).to.have.string('invalid multiple response');
              done();
            });
      } catch(err) {
        expect.fail('expected error response instead of exception');
        done();
      }
    });
    it('with string value for integer return value', function(done) {
      try {
        service.badDatatypeReturn(1)
            .then(output => {
              expect.fail('expected error response instead of success response');
              done();
            })
            .catch(err => {
              expect(err).to.have.property('message');
              expect(err.message).to.have.string('response not numeric');
              done();
            });
      } catch(err) {
        expect.fail('expected error response instead of exception');
        done();
      }
    });
// console.log(JSON.stringify(err));
  });
});
