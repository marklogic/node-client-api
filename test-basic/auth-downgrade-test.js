/*
* Copyright (c) 2015-2026 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
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
        // An array sends one WWW-Authenticate header per element.
        response.writeHead(401, [].concat(challenge).map(value => ['WWW-Authenticate', value]).flat());
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

  it('rejects a Basic challenge in any case without sending credentials or caching it', async function() {
    for (const basicChallenge of ['Basic realm="test-realm"', 'bAsIc realm="test-realm"']) {
      challenge = basicChallenge;
      requests = [];
      for (let attempt = 0; attempt < 2; attempt++) {
        await assert.rejects(client.documents.probe('/test.json').result(),
          /Server requested BASIC authentication, but the client is configured for DIGEST/);
      }
      assert.strictEqual(requests.length, 2);
      assert(requests.every(request => request.authorization === undefined));
    }
  });

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

  for (const [invalidChallenge, expectedError] of [
    ['Digest', /Realm not found/],
    ['Digest realm', /Unexpected end of www-authenticate value/],
    ['Digest realm="test-realm"', /Nonce not found/],
    ['Digest nonce="test-nonce"', /Realm not found/],
    ['Digest realm="test-realm", nonce="test-nonce", qop="auth-int"',
      /does not accept any supported quality of protection/],
    ['Digest realm="test-realm", nonce="test-nonce"', /did not offer a quality of protection \(qop\)/],
    ['Digest realm="test-realm", nonce="test-nonce", qop="auth", algorithm=SHA-256',
      /Unsupported Digest algorithm: SHA-256/],
    ['Digest realm="test-realm", nonce="test-nonce", qop="auth", algorithm="MD5-unknown"',
      /Unsupported Digest algorithm: MD5-unknown/],
    ['Bearer realm="test-realm"', /Server requested BEARER authentication, but the client is configured for DIGEST/]
  ]) {
    it('rejects an invalid or unsupported challenge: ' + invalidChallenge, async function() {
      challenge = invalidChallenge;
      await assert.rejects(client.documents.probe('/test.json').result(), expectedError);
      assert.strictEqual(requests.length, 1);
      assert.strictEqual(requests[0].authorization, undefined);
    });
  }

  it('selects the Digest challenge when the server also offers Basic in separate headers', async function() {
    challenge = ['Basic realm="test-realm"', 'Digest realm="test-realm", nonce="test-nonce", qop="auth"'];
    assert.strictEqual((await client.documents.probe('/test.json').result()).exists, true);
    assert.strictEqual(requests.length, 2);
    assert.match(requests[1].authorization, /^Digest username="testuser", realm="test-realm", nonce="test-nonce",/);
  });

  it('selects the Digest challenge from a single combined header value', async function() {
    challenge = 'Basic realm="a, b", Digest realm="test-realm", nonce="test-nonce", qop="auth-int, auth"';
    assert.strictEqual((await client.documents.probe('/test.json').result()).exists, true);
    assert.match(requests[1].authorization, /^Digest username="testuser", realm="test-realm",/);
    assert.match(requests[1].authorization, / qop=auth,/);
  });

  it('reports the scheme for token68 challenges when the expected scheme differs', function() {
    for (const [token68Challenge, scheme] of [
      ['Bearer abc123', 'BEARER'],
      ['Negotiate YWJj==', 'NEGOTIATE']
    ]) {
      const authenticator = createAuthInitializer('testuser', 'testpassword', {
        expectedScheme: 'digest'
      })(token68Challenge);
      assert.strictEqual(authenticator.err,
        'Server requested ' + scheme + ' authentication, but the client is configured for DIGEST');
    }
  });

  it('splits combined challenges when no expected scheme is configured', function() {
    const initialize = createAuthInitializer('testuser', 'testpassword');
    const authenticator = initialize(
      'Negotiate YWJj==, Digest realm="test-realm", nonce="test-nonce", qop="auth"'
    );
    assert.strictEqual(authenticator.err, undefined);
    assert.match(authenticator.authorize('GET', '/test.json'), /^Digest username="testuser",/);
  });

  it('selects the Digest challenge when followed by a bare-scheme challenge', async function() {
    challenge = 'Digest realm="test-realm", nonce="test-nonce", qop="auth", Negotiate, Basic realm="r"';
    assert.strictEqual((await client.documents.probe('/test.json').result()).exists, true);
    assert.match(requests[1].authorization, /^Digest username="testuser", realm="test-realm", nonce="test-nonce",/);
  });

  it('splits combined challenges only at scheme boundaries', function() {
    const split = createAuthInitializer.parsers.split_challenges;
    assert.deepStrictEqual(
      split('Digest realm="r", nonce="n", qop="auth", Negotiate, Basic realm="r"'),
      ['Digest realm="r", nonce="n", qop="auth"', 'Negotiate', 'Basic realm="r"']);
    assert.deepStrictEqual(
      split('Negotiate YWJj==, Digest realm="r", algorithm=MD5, nonce = "n"'),
      ['Negotiate YWJj==', 'Digest realm="r", algorithm=MD5, nonce = "n"']);
    assert.deepStrictEqual(
      split('Basic realm="a, Digest b", Digest realm="r"'),
      ['Basic realm="a, Digest b"', 'Digest realm="r"']);
  });

  for (const challenges of [
    ['Digest realm="test-realm", nonce="sha-nonce", qop="auth", algorithm=SHA-256',
      'Digest realm="test-realm", nonce="md5-nonce", qop="auth", algorithm=MD5'],
    'Digest realm="test-realm", nonce="sha-nonce", qop="auth", algorithm=SHA-256, ' +
      'Digest realm="test-realm", nonce="md5-nonce", qop="auth", algorithm=MD5'
  ]) {
    it('skips an unsupported Digest challenge when a supported one is offered: ' + [].concat(challenges).join(' | '),
      async function() {
        challenge = challenges;
        assert.strictEqual((await client.documents.probe('/test.json').result()).exists, true);
        assert.strictEqual(requests.length, 2);
        assert.match(requests[1].authorization, /^Digest .* nonce="md5-nonce", algorithm="MD5",/);
      });
  }

  it('rejects when no Digest challenge is supported, without falling back to Basic', async function() {
    challenge = ['Digest realm="test-realm", nonce="n", qop="auth", algorithm=SHA-256',
      'Digest realm="test-realm", nonce="n", qop="auth-int"', 'Basic realm="test-realm"'];
    await assert.rejects(client.documents.probe('/test.json').result(), /Unsupported Digest algorithm: SHA-256/);
    assert.strictEqual(requests.length, 1);
    assert.strictEqual(requests[0].authorization, undefined);
  });

  it('lists every offered scheme when none matches', async function() {
    challenge = ['Basic realm="test-realm"', 'Bearer realm="test-realm"'];
    await assert.rejects(client.documents.probe('/test.json').result(),
      /Server requested BASIC, BEARER authentication, but the client is configured for DIGEST/);
    assert.strictEqual(requests.length, 1);
  });

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

  it('continues to authenticate with a valid Digest challenge in any case', async function() {
    for (const scheme of ['Digest', 'dIgEsT']) {
      client.release();
      client = marklogic.createDatabaseClient({
        host: '127.0.0.1',
        port: server.address().port,
        user: 'testuser',
        password: 'testpassword',
        authType: 'digest'
      });
      challenge = scheme + ' realm="test-realm", nonce="test-nonce", qop="auth"';
      requests = [];
      const result = await client.documents.probe('/test.json').result();
      assert.strictEqual(result.exists, true);
      assert.strictEqual(requests.length, 2);
      assert.strictEqual(requests[0].authorization, undefined);
      assert.match(requests[1].authorization, /^Digest /);
      assert(!requests[1].authorization.includes('testpassword'));
    }
  });

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
    const authenticator = initialize('Basic realm="test-realm"');
    assert.match(authenticator.err, /Server requested BASIC authentication, but the client is configured for DIGEST/);
    assert.strictEqual(authenticator.authorize, undefined);
  });

  it('reports a scheme mismatch as an error from the deprecated higher-level API', function() {
    const higherLevel = createAuthInitializer.authenticator('testuser', 'testpassword', {expectedScheme: 'digest'});
    const error = higherLevel.get_challenge({
      statusCode: 401, headers: {'www-authenticate': 'Basic realm="test-realm"'}
    });
    assert.match(error, /Server requested BASIC authentication/);
  });

  it('reports a malformed header as an error instead of throwing', function() {
    for (const header of ['', '   ', '"quoted"', undefined]) {
      const authenticator = createAuthInitializer('testuser', 'testpassword', {})(header);
      assert.strictEqual(authenticator.err, 'Invalid www-authenticate header.');
    }
  });

  it('supports MD5-sess regardless of algorithm case', function() {
    const options = {expectedScheme: 'digest', cnonce: '0a4f113b'};
    const challengeText = 'Digest realm="r", nonce="n", qop="auth", algorithm=';
    const upper = createAuthInitializer('u', 'p', options)(challengeText + 'MD5-sess').authorize('GET', '/');
    const lower = createAuthInitializer('u', 'p', options)(challengeText + 'md5-sess').authorize('GET', '/');
    const plain = createAuthInitializer('u', 'p', options)(challengeText + 'MD5').authorize('GET', '/');
    const responseOf = header => header.match(/response="([0-9a-f]+)"/)[1];
    assert.strictEqual(responseOf(upper), responseOf(lower));
    assert.notStrictEqual(responseOf(upper), responseOf(plain));
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
