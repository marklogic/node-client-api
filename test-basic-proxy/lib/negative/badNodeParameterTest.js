'use strict';
const expect = require('chai').expect;

const testutil    = require('../testutil');

const PostOfMultipartForNone = require("../generated/postOfMultipartForNone.js");

describe('bad mappings for node parameters', function() {
  const service = PostOfMultipartForNone.on(testutil.makeClient());

  it('array as invalid string', function (done) {
    service.postOfMultipartArrayForNone0(`["text1", 1}`)
        .then(output => {
          expect.fail(err.toString());
          done();
        })
        .catch(err => {
          const errorResponse = err.body.errorResponse;
          expect(errorResponse.statusCode).to.eql(400);
          expect(errorResponse.messageCode).to.eql('XDMP-JSONCHAR');
          expect(errorResponse.message).to.contain(`Unexpected character '}' in JSON`);
          done();
        });
  });
  it('jsonDocument as invalid string', function(done) {
    service.postOfMultipartJsonDocumentForNone0(`{"root":{"child":"text1"}]`)
        .then(output => {
          expect.fail(err.toString());
          done();
        })
        .catch(err => {
          const errorResponse = err.body.errorResponse;
          expect(errorResponse.statusCode).to.eql(400);
          expect(errorResponse.messageCode).to.eql('XDMP-JSONCHAR');
          expect(errorResponse.message).to.contain(`Unexpected character ']' in JSON`);
          done();
        });
  });
  it('xmlDocument as invalid string', function(done) {
    service.postOfMultipartXmlDocumentForNone0('<root>text1</child>\n')
        .then(output => {
          expect.fail(err.toString());
          done();
        })
        .catch(err => {
          const errorResponse = err.body.errorResponse;
          expect(errorResponse.statusCode).to.eql(400);
          expect(errorResponse.messageCode).to.eql('XDMP-DOCUNENDTAG');
          expect(errorResponse.message).to.contain(`Unexpected end tag </child>`);
          done();
        });
  });
});