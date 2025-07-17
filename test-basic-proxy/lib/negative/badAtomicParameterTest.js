/*
* Copyright © 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/

'use strict';
const expect = require('chai').expect;

const testutil = require('../testutil');

const PostOfUrlencodedForNone = require("../generated/postOfUrlencodedForNone.js");

describe('bad mappings for atomic parameters', function() {
  const service = PostOfUrlencodedForNone.on(testutil.makeClient());

  it('boolean as invalid string', function (done) {
    service.postOfUrlencodedBooleanForNone0('invalid')
        .then(output => {
          expect.fail('should not succeed');
          done();
        })
        .catch(err => {
          const errorResponse = err.body.errorResponse;
          expect(errorResponse.statusCode).to.eql(400);
          expect(errorResponse.messageCode).to.eql('XDMP-LEXVAL');
          expect(errorResponse.message).to.contain('xs:boolean("invalid")');
          expect(errorResponse.message).to.contain('Invalid lexical value');
          done();
        });
  });
  it('boolean as number', function (done) {
    service.postOfUrlencodedBooleanForNone0(5)
        .then(output => {
          expect.fail('should not succeed');
          done();
        })
        .catch(err => {
          const errorResponse = err.body.errorResponse;
          expect(errorResponse.statusCode).to.eql(400);
          expect(errorResponse.messageCode).to.eql('XDMP-LEXVAL');
          expect(errorResponse.message).to.contain('xs:boolean("5")');
          expect(errorResponse.message).to.contain('Invalid lexical value');
          done();
        });
  });
  it('dateTime as invalid string', function(done) {
    service.postOfUrlencodedDateTimeForNone0(new Date('2018-01-02T10:09:08+07:00').toDateString())
        .then(output => {
          expect.fail('should not succeed');
          done();
        })
        .catch(err => {
          const errorResponse = err.body.errorResponse;
          expect(errorResponse.statusCode).to.eql(400);
          expect(errorResponse.messageCode).to.eql('XDMP-LEXVAL');
          expect(errorResponse.message).to.contain('xs:dateTime("Mon Jan 01 2018")');
          expect(errorResponse.message).to.contain('Invalid lexical value');
          done();
        });
  });
  it('dateTime as number', function(done) {
    service.postOfUrlencodedDateTimeForNone0(new Date('2018-01-02T10:09:08+07:00').valueOf())
        .then(output => {
          expect.fail('should not succeed');
          done();
        })
        .catch(err => {
          const errorResponse = err.body.errorResponse;
          expect(errorResponse.statusCode).to.eql(400);
          expect(errorResponse.messageCode).to.eql('XDMP-LEXVAL');
          expect(errorResponse.message).to.contain('xs:dateTime("1514862548000")');
          expect(errorResponse.message).to.contain('Invalid lexical value');
          done();
        });
  });
  it('double as boolean', function(done) {
    service.postOfUrlencodedDoubleForNone0(true)
        .then(output => {
          expect.fail('should not succeed');
          done();
        })
        .catch(err => {
          const errorResponse = err.body.errorResponse;
          expect(errorResponse.statusCode).to.eql(400);
          expect(errorResponse.messageCode).to.eql('XDMP-LEXVAL');
          expect(errorResponse.message).to.contain('xs:double("true")');
          expect(errorResponse.message).to.contain('Invalid lexical value');
          done();
        });
  });
  it('int as invalid string', function(done) {
    service.postOfUrlencodedIntForNone0('2147483648')
        .then(output => {
          expect.fail('should not succeed');
          done();
        })
        .catch(err => {
          const errorResponse = err.body.errorResponse;
          expect(errorResponse.statusCode).to.eql(400);
          expect(errorResponse.messageCode).to.eql('XDMP-LEXVAL');
          expect(errorResponse.message).to.contain('xs:int("2147483648")');
          expect(errorResponse.message).to.contain('Invalid lexical value');
          done();
        });
  });
});