/*
* Copyright (c) 2015-2026 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/
const http = require('http');
const should = require('should');
const marklogic = require('../');

describe('documents.remove URL parameters', function() {
  it('encodes temporal parameters so they cannot add query parameters', function(done) {
    let assertionError;
    const server = http.createServer(function(request, response) {
      try {
        request.url.should.containEql('temporal-collection=tc%26uri%3D%2Fx');
        request.url.should.containEql('system-time=2020-01-01T00%3A00%3A00Z%26uri%3D%2Fy');
        request.url.should.containEql('txid=tx%26uri%3D%2Fz');
        request.url.match(/(?:\?|&)uri=/g).should.have.length(1);
      } catch (error) {
        assertionError = error;
      }
      response.writeHead(204);
      response.end();
    });

    server.listen(0, '127.0.0.1', function() {
      const db = marklogic.createDatabaseClient({
        host: '127.0.0.1',
        port: server.address().port,
        user: 'u',
        password: 'p',
        authType: 'basic'
      });

      db.documents.remove({
        uris: '/mine.json',
        txid: 'tx&uri=/z',
        temporalCollection: 'tc&uri=/x',
        systemTime: '2020-01-01T00:00:00Z&uri=/y'
      }).result().then(function() {
        server.close(function() {
          done(assertionError);
        });
      }, function(error) {
        server.close(function() {
          done(assertionError || error);
        });
      });
    });
  });
});