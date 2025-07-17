/*
* Copyright © 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
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
