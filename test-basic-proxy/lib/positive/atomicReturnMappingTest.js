/*
 * Copyright 2019 MarkLogic Corporation
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

const AtomicReturnMapping = require("./atomicReturnMapping.js");

describe('atomic return mapping service', function() {
  const service = AtomicReturnMapping.on(testutil.makeClient());
  it('mapAtomicsNoneForBoolean0 endpoint', function(done) {
    service.mapAtomicsNoneForBoolean0()
        .then(output => {
          expect(typeof output).to.eql('string');
          expect(output).to.eql('true');
          done();
        })
        .catch(err => {
          expect.fail(err.toString());
          done();
        });
  });
  it('mapAtomicsNoneForDateTime0 endpoint', function(done) {
    service.mapAtomicsNoneForDateTime0()
        .then(output => {
          expect((output instanceof Date)).to.eql(true);
          expect(output).to.eql(new Date('2018-01-02T10:09:08+07:00'));
          done();
        })
        .catch(err => {
          expect.fail(err.toString());
          done();
        });
  });
  it('mapAtomicsNoneForFloat0 endpoint', function(done) {
    service.mapAtomicsNoneForFloat0()
        .then(output => {
          expect(typeof output).to.eql('string');
          expect(output).to.eql('1.2');
          done();
        })
        .catch(err => {
          expect.fail(err.toString());
          done();
        });
  });
  it('mapAtomicsNoneForInt0 endpoint', function(done) {
    service.mapAtomicsNoneForInt0()
        .then(output => {
          expect(typeof output).to.eql('string');
          expect(output).to.eql('5');
          done();
        })
        .catch(err => {
          expect.fail(err.toString());
          done();
        });
  });
  it('mapAtomicsNoneForUnsignedInt0 endpoint', function(done) {
    service.mapAtomicsNoneForUnsignedInt0()
        .then(output => {
          expect(typeof output).to.eql('string');
          expect(output).to.eql('5');
          done();
        })
        .catch(err => {
          expect.fail(err.toString());
          done();
        });
  });
});
