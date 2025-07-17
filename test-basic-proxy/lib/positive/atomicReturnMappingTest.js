/*
* Copyright © 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
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
