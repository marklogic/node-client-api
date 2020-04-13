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

const fs = require('fs');

const expect = require('chai').expect;

const testutil = require('../testutil');

const Mimetype = require("./mimetype.js");

describe('mimetype service', function() {
  const service = Mimetype.on(testutil.makeAdminClient());

  it('apiReader endpoint', function(done) {
    const sourceAPI = './test-basic-proxy/ml-modules/positive/mimetype/apiReader.api';
    fs.readFile(sourceAPI, 'utf8', (err, data) => {
      if (err) {
        expect.fail(err.toString());
        done();
      } else {
        const testData = JSON.parse(data);
        service.apiReader('/dbf/test/mimetype/','apiReader')
            .then(output => {
              expect(output).to.eql(testData);
              done();
              })
            .catch(err => {
              expect.fail(err.toString());
              done();
              });
      }
    });
  });
});
