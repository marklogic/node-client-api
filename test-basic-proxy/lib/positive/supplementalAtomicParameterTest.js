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
