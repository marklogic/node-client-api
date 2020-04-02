'use strict';
const expect = require('chai').expect;

const testutil = require('../testutil');

const BadExecution = require("./badExecution.js");

describe('bad execution', function() {
  const service = BadExecution.on(testutil.makeClient());

  it('error mapping', function (done) {
    service.errorMapping()
        .then(output => {
          expect.fail('should not succeed');
          done();
        })
        .catch(err => {
          const errorResponse = err.body.errorResponse;
          expect(errorResponse.statusCode).to.eql(418);
          expect(errorResponse.status).to.eql("Status Message For 418");
          expect(errorResponse.messageCode).to.eql('ERROR_MAPPING');
          expect(errorResponse.message).to.contain('Test of error mapping');
          done();
        });
  });
});