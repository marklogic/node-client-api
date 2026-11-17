/*
* Copyright (c) 2015-2026 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/
const http = require('http');
const assert = require('assert');
const should = require('should');
const marklogic = require('../');

describe('documents.write multipart headers', function() {
  const db = marklogic.createDatabaseClient({
    host: 'localhost',
    port: 1,
    user: 'u',
    password: 'p',
    authType: 'basic'
  });

  it('rejects CR, LF, NUL, and double quotes in uri and temporalDocument', function() {
    const invalidSuffixes = ['\r', '\n', '\0', '"', '"; filename="y.json'];
    for (const suffix of invalidSuffixes) {
      for (const field of ['uri', 'temporalDocument']) {
        for (const index of [0, 1]) {
          const documents = [{
            uri: '/poc/first.json',
            contentType: 'application/json',
            content: {a: 1}
          }, {
            uri: '/poc/second.json',
            contentType: 'application/json',
            content: {b: 2}
          }];
          documents[index][field] = '/poc/x.json' + suffix;
          assert.throws(function() {
            db.documents.write(documents);
          }, /Content-Disposition values must not contain/);
        }
      }
    }
  });

  it('rejects CR, LF, and NUL in any multipart part header value', function() {
    for (const invalidCharacter of ['\r', '\n', '\0']) {
      const injected = invalidCharacter + 'X-Injected: yes';
      const cases = [
        {uri: '/poc/file.json', contentType: 'application/json' + injected, content: {a: 1}},
        {extension: 'json' + injected, contentType: 'application/json', content: {a: 1}},
        {extension: 'json', directory: '/poc/' + injected, contentType: 'application/json', content: {a: 1}},
        {uri: '/poc/file.json', versionId: '1' + injected, contentType: 'application/json', content: {a: 1}}
      ];
      for (const document of cases) {
        assert.throws(function() {
          db.documents.write([document, {
            uri: '/poc/second.json',
            contentType: 'application/json',
            content: {b: 2}
          }]);
        }, /must not contain CR, LF, or NUL/);
      }

      for (const method of ['post', 'put']) {
        assert.throws(function() {
          db.resources[method]({
            name: 'example',
            documents: [{contentType: 'application/json' + injected, content: {a: 1}}]
          });
        }, /must not contain CR, LF, or NUL/);
      }
    }
  });

  it('preserves backslashes and ordinary URI paths unchanged', function(done) {
    const uri = '/poc/file\\name.json';
    const temporalDocument = '/poc/temporal\\name.json';
    let body = '';
    let assertionError;

    const server = http.createServer(function(request, response) {
      request.setEncoding('utf8');
      request.on('data', function(chunk) {
        body += chunk;
      });
      request.on('end', function() {
        try {
          body.should.containEql('filename="/poc/file\\name.json"');
          body.should.containEql('temporal-document="/poc/temporal\\name.json"');
          body.should.containEql('filename="/poc/second; filename=ordinary.json"');
          body.should.not.containEql('%2Fpoc');
        } catch (error) {
          assertionError = error;
        }
        response.writeHead(204);
        response.end();
      });
    });

    server.listen(0, '127.0.0.1', function() {
      const db = marklogic.createDatabaseClient({
        host: '127.0.0.1',
        port: server.address().port,
        user: 'u',
        password: 'p',
        authType: 'basic'
      });

      db.documents.write([{
        uri,
        temporalDocument,
        contentType: 'application/json',
        content: {a: 1}
      }, {
        uri: '/poc/second; filename=ordinary.json',
        contentType: 'application/json',
        content: {b: 2}
      }]).result().then(function() {
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
