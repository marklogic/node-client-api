/*
* Copyright (c) 2026 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/
'use strict';

const assert = require('assert');
const http = require('http');
const marklogic = require('../');
const createAuthInitializer = require('../lib/www-authenticate-patched/www-authenticate');

describe('Authentication downgrade prevention (MLE-33480)', function() {
  let server;
  let client;
  let challenge;
  let requests;

  beforeEach(async function() {
    challenge = 'Basic realm="test-realm"';
    requests = [];
    server = http.createServer(function(request, response) {
      requests.push({authorization: request.headers.authorization, method: request.method});
      request.resume();
      if (!request.headers.authorization) {
        response.writeHead(401, {'WWW-Authenticate': challenge});
      } else {
        response.writeHead(200);
      }
      response.end();
    });
    await new Promise(function(resolve, reject) {
      server.once('error', reject);
      server.listen(0, '127.0.0.1', resolve);
    });
    client = marklogic.createDatabaseClient({
      host: '127.0.0.1',
      port: server.address().port,
      user: 'testuser',
      password: 'testpassword',
      authType: 'digest'
    });
  });

  afterEach(async function() {
    if (client) {
      client.release();
    }
    if (server) {
      await new Promise(function(resolve, reject) {
        server.close(function(error) {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      });
    }
  });

  for (const basicChallenge of ['Basic realm="test-realm"', 'bAsIc realm="test-realm"']) {
    it('rejects ' + basicChallenge + ' without sending credentials or caching it', async function() {
      challenge = basicChallenge;
      for (let attempt = 0; attempt < 2; attempt++) {
        await assert.rejects(client.documents.probe('/test.json').result(),
          /Server requested BASIC authentication, but the client is configured for DIGEST/);
      }
      assert.strictEqual(requests.length, 2);
      assert(requests.every(request => request.authorization === undefined));
    });
  }

  it('rejects a downgrade through the callback API', function(done) {
    client.documents.probe('/test.json').result(function() {
      done(new Error('Expected authentication rejection'));
    }, function(error) {
      try {
        assert.match(error.message, /Server requested BASIC authentication/);
        assert.strictEqual(requests.length, 1);
        assert.strictEqual(requests[0].authorization, undefined);
        done();
      } catch (assertionError) {
        done(assertionError);
      }
    });
  });

  it('does not send a write after a Basic challenge to the authentication probe', async function() {
    await assert.rejects(client.documents.write({
      uri: '/test.json', content: {test: true}
    }).result(), /Server requested BASIC authentication/);
    assert.deepStrictEqual(requests, [{authorization: undefined, method: 'HEAD'}]);
  });

  for (const invalidChallenge of [
    'Digest realm',
    'Digest realm="test-realm"',
    'Digest nonce="test-nonce"',
    'Digest realm="test-realm", nonce="test-nonce", qop="auth-int"',
    'Bearer realm="test-realm"'
  ]) {
    it('rejects an invalid or unsupported challenge: ' + invalidChallenge, async function() {
      challenge = invalidChallenge;
      await assert.rejects(client.documents.probe('/test.json').result());
      assert.strictEqual(requests.length, 1);
      assert.strictEqual(requests[0].authorization, undefined);
    });
  }

  it('can authenticate after a rejected downgrade and reuse only the valid authenticator', async function() {
    await assert.rejects(client.documents.probe('/test.json').result(),
      /Server requested BASIC authentication/);
    challenge = 'Digest realm="test-realm", nonce="test-nonce", qop="auth"';
    assert.strictEqual((await client.documents.probe('/test.json').result()).exists, true);
    assert.strictEqual((await client.documents.probe('/test.json').result()).exists, true);
    assert.strictEqual(requests.length, 4);
    assert.strictEqual(requests[0].authorization, undefined);
    assert.strictEqual(requests[1].authorization, undefined);
    assert.match(requests[2].authorization, /^Digest /);
    assert.match(requests[3].authorization, /^Digest /);
  });

  for (const scheme of ['Digest', 'dIgEsT']) {
    it('continues to authenticate with a valid ' + scheme + ' challenge', async function() {
      challenge = scheme + ' realm="test-realm", nonce="test-nonce", qop="auth"';
      const result = await client.documents.probe('/test.json').result();
      assert.strictEqual(result.exists, true);
      assert.strictEqual(requests.length, 2);
      assert.strictEqual(requests[0].authorization, undefined);
      assert.match(requests[1].authorization, /^Digest /);
      assert(!requests[1].authorization.includes('testpassword'));
    });
  }

  it('preserves explicitly configured Basic authentication', async function() {
    client.release();
    client = marklogic.createDatabaseClient({
      host: '127.0.0.1',
      port: server.address().port,
      user: 'testuser',
      password: 'testpassword',
      authType: 'basic'
    });
    const result = await client.documents.probe('/test.json').result();
    assert.strictEqual(result.exists, true);
    assert.strictEqual(requests.length, 1);
    assert.strictEqual(requests[0].authorization,
      'Basic ' + Buffer.from('testuser:testpassword').toString('base64'));
  });

  it('enforces the expected scheme in the authenticator itself', function() {
    const initialize = createAuthInitializer('testuser', 'testpassword', {expectedScheme: 'digest'});
    assert.throws(function() {
      initialize('Basic realm="test-realm"');
    }, /Server requested BASIC authentication, but the client is configured for DIGEST/);
  });

  it('preserves the RFC Digest response calculation', function() {
    const initialize = createAuthInitializer('Mufasa', 'Circle Of Life', {
      expectedScheme: 'digest', cnonce: '0a4f113b'
    });
    const authenticator = initialize('Digest realm="testrealm@host.com", ' +
      'nonce="dcd98b7102dd2f0e8b11d0f600bfb0c093", qop="auth", ' +
      'opaque="5ccc069c403ebaf9f0171e9517f40e41"');
    assert.match(authenticator.authorize('GET', '/dir/index.html'),
      /response="6629fae49393a05397450978507c4ef1"/);
  });
});
