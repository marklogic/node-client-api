/*
* Copyright © 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/

var should = require('should');

var testconfig = require('../etc/test-config.js');

var marklogic = require('../');

var dbReader = marklogic.createDatabaseClient(testconfig.restReaderConnection);

describe('error generated from a server call', function() {

  it('should have a stack trace', function(done){
    // Writing as a reader fails with a 403 error
    dbReader.documents.write({
      uri: '/test/negative/writeAsReader1.txt',
      content: 'the text'
      }).
    result(function(response){
      response.should.equal('SHOULD HAVE FAILED');
      done();
    }, function(error){
      try {
        error.statusCode.should.equal(403);
        // verify client-side stack
        error.should.have.property('stack');
        const errorResponse = error.body.errorResponse;
        errorResponse.statusCode.should.equal(403);
        errorResponse.status.should.equal('Forbidden');
        errorResponse.messageCode.should.equal('SEC-PRIV');
        errorResponse.message.should.equal('You do not have permission to this method and URL.');
        done();
      } catch(error){
        done(error);
      }
      });
  });

});
