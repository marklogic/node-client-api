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