/*
* Copyright (c) 2015-2026 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/
'use strict';

const assert = require('assert');
const crypto = require('crypto');
const http = require('http');
const {Readable} = require('stream');
const marklogic = require('../');
const Operation = require('../lib/operation');
const mlutil = require('../lib/mlutil');
const requester = require('../lib/requester');
const createAuthInitializer = require('../lib/www-authenticate-patched/www-authenticate');

describe('Digest stale nonce retry (MLE-32359 / MLE-29778)', function() {
  let server, client, requests, handle;

  function challenge(nonce, stale) {
    return 'Digest realm="test-realm", nonce="' + nonce + '", qop="auth"' +
      (stale === undefined ? '' : ', stale=' + stale);
  }

  function reject(response, header) {
    response.writeHead(401, {'WWW-Authenticate': header, 'Content-Type': 'text/plain'});
    response.end('authentication denied');
  }

  function ok(response, status = 200) {
    response.writeHead(status);
    response.end();
  }

  function digestFields(header) {
    return Object.fromEntries([...header.matchAll(/(\w+)=(?:"([^"]*)"|([^,\s]+))/g)]
      .map(match => [match[1], match[2] === undefined ? match[3] : match[2]]));
  }

  function verifyDigest(request, nonce, user = 'testuser') {
    const fields = digestFields(request.authorization);
    const md5 = value => crypto.createHash('md5').update(value).digest('hex');
    assert.strictEqual(fields.username, user);
    assert.strictEqual(fields.nonce, nonce);
    assert.strictEqual(fields.response, md5([
      md5(user + ':test-realm:testpassword'), nonce, fields.nc, fields.cnonce,
      'auth', md5(request.method + ':' + request.path)
    ].join(':')));
  }

  function isAuthError(error) {
    return error.statusCode === 401 && error.body === 'authentication denied';
  }

  beforeEach(async function() {
    requests = [];
    handle = (request, response) => request.authorization ? ok(response) : reject(response, challenge('old'));
    server = http.createServer((request, response) => {
      const chunks = [];
      request.on('data', chunk => chunks.push(chunk));
      request.on('end', () => {
        const recorded = {
          authorization: request.headers.authorization,
          method: request.method,
          path: request.url,
          body: Buffer.concat(chunks).toString()
        };
        requests.push(recorded);
        handle(recorded, response);
      });
    });
    await new Promise((resolve, rejectListen) => {
      server.once('error', rejectListen);
      server.listen(0, '127.0.0.1', resolve);
    });
    client = marklogic.createDatabaseClient({
      host: '127.0.0.1', port: server.address().port,
      user: 'testuser', password: 'testpassword', authType: 'DIGEST'
    });
  });

  afterEach(async function() {
    client.release();
    await new Promise((resolve, rejectClose) => server.close(error => error ? rejectClose(error) : resolve()));
  });

  // Performs the initial handshake so the client caches the 'old' nonce.
  async function prime() {
    assert.strictEqual((await client.documents.probe('/test.json').result()).exists, true);
    assert.strictEqual(requests.length, 2);
    assert.strictEqual(requests[0].authorization, undefined);
    verifyDigest(requests[1], 'old');
    requests.length = 0;
  }

  function staleOnce(status = 200) {
    return (request, response) => digestFields(request.authorization).nonce === 'old' ?
      reject(response, challenge('new', 'true')) : ok(response, status);
  }

  describe('challenge parsing', function() {
    for (const [value, expected] of [
      ['true', true], ['TRUE', true], ['"True"', true],
      ['false', false], ['FALSE', false], ['nottrue', false], [undefined, false]
    ]) {
      it('parses stale=' + value + ' as ' + expected, function() {
        const authenticator = createAuthInitializer('u', 'p', {expectedScheme: 'digest'})(challenge('n', value));
        assert.strictEqual(authenticator.err, undefined);
        assert.strictEqual(authenticator.stale, expected);
      });
    }
  });

  it('refreshes a stale nonce, retries once, and reuses the new nonce', async function() {
    await prime();
    handle = staleOnce();
    assert.strictEqual((await client.documents.probe('/test.json').result()).exists, true);
    assert.strictEqual((await client.documents.probe('/test.json').result()).exists, true);
    assert.strictEqual(requests.length, 3);
    verifyDigest(requests[0], 'old');
    verifyDigest(requests[1], 'new');
    verifyDigest(requests[2], 'new');
    assert.strictEqual(digestFields(requests[1].authorization).nc, '00000001');
  });

  it('replays a buffered write with an identical body', async function() {
    await prime();
    handle = staleOnce(204);
    await client.documents.write({uri: '/test.json', content: {hello: 'world'}}).result();
    assert.strictEqual(requests.length, 2);
    assert.strictEqual(requests[0].body, '{"hello":"world"}');
    assert.strictEqual(requests[1].body, requests[0].body);
    verifyDigest(requests[1], 'new');
  });

  it('replays an eval and returns the decoded result', async function() {
    await prime();
    handle = (request, response) => {
      if (digestFields(request.authorization).nonce === 'old') {
        reject(response, challenge('new', 'TRUE'));
      } else {
        response.writeHead(200, {'Content-Type': 'multipart/mixed; boundary=test-boundary'});
        response.end('--test-boundary\r\nContent-Type: text/plain\r\n' +
          'X-Primitive: string\r\n\r\nnonce-test\r\n--test-boundary--\r\n');
      }
    };
    const result = await client.eval('"nonce-test"').result();
    assert.deepStrictEqual(result, [{format: 'text', datatype: 'string', value: 'nonce-test'}]);
    assert.strictEqual(requests.length, 2);
    assert.strictEqual(requests[1].body, requests[0].body);
    verifyDigest(requests[1], 'new');
  });

  it('replays buffered multipart writes with identical bodies', async function() {
    await prime();
    handle = staleOnce(204);
    await client.documents.write([
      {uri: '/one.txt', content: 'one'},
      {uri: '/two.txt', content: 'two'}
    ]).result();
    assert.strictEqual(requests.length, 2);
    assert.strictEqual(requests[1].body, requests[0].body);
    verifyDigest(requests[1], 'new');
  });

  for (const stale of [undefined, 'false', 'FALSE']) {
    it('surfaces a 401 with stale=' + stale + ' without retrying', async function() {
      await prime();
      handle = (request, response) => reject(response, challenge('new', stale));
      await assert.rejects(client.documents.write({uri: '/test.json', content: 'body'}).result(), isAuthError);
      assert.strictEqual(requests.length, 1);
      assert.strictEqual(client.authenticator.testuser.parms.nonce, 'old');
    });
  }

  it('retries only once when the server keeps reporting a stale nonce', async function() {
    await prime();
    handle = (request, response) => reject(response, challenge('new' + requests.length, 'true'));
    await assert.rejects(client.documents.write({uri: '/test.json', content: 'body'}).result(), isAuthError);
    assert.strictEqual(requests.length, 2);
    verifyDigest(requests[1], 'new1');
  });

  it('does not retry unsupported, malformed, or non-Digest stale challenges', async function() {
    await prime();
    for (const header of [
      'Basic realm="r", stale=true',
      'Digest realm="test-realm", stale=true',
      challenge('new', 'true') + ', algorithm=SHA-256',
      challenge('new', 'true') + ', broken='
    ]) {
      requests.length = 0;
      handle = (request, response) => reject(response, header);
      await assert.rejects(client.documents.write({uri: '/test.json', content: 'body'}).result(), isAuthError);
      assert.strictEqual(requests.length, 1);
      assert.strictEqual(client.authenticator.testuser.parms.nonce, 'old');
    }
  });

  it('keeps the initial handshake unchanged and does not retry invalid credentials', async function() {
    handle = (request, response) => reject(response, challenge('old'));
    await assert.rejects(client.documents.write({uri: '/test.json', content: 'body'}).result(), isAuthError);
    assert.strictEqual(requests.length, 2);
    assert.strictEqual(requests[0].method, 'HEAD');
    assert.strictEqual(requests[0].authorization, undefined);
    verifyDigest(requests[1], 'old');
  });

  it('refreshes only the user whose nonce expired', async function() {
    function probeAs(user) {
      const options = mlutil.newRequestOptions(client.getConnectionParams(), '/v1/ping', 'HEAD');
      options.user = user;
      return requester.startRequest(new Operation('user probe', client, options, 'empty', 'empty')).result();
    }
    await probeAs('testuser');
    await probeAs('otheruser');
    const otherAuthenticator = client.authenticator.otheruser;
    requests.length = 0;
    handle = (request, response) => {
      const fields = digestFields(request.authorization);
      return (fields.username === 'testuser' && fields.nonce === 'old') ?
        reject(response, challenge('new', 'true')) : ok(response);
    };
    await probeAs('testuser');
    await probeAs('otheruser');
    assert.strictEqual(requests.length, 3);
    verifyDigest(requests[1], 'new');
    verifyDigest(requests[2], 'old', 'otheruser');
    assert.strictEqual(client.authenticator.otheruser, otherAuthenticator);
  });

  for (const properties of [undefined, {test: 'value'}]) {
    it('does not resend a streamed write' + (properties ? ' with metadata' : ''), async function() {
      await prime();
      handle = (request, response) => reject(response, challenge('new', 'true'));
      const stream = client.documents.createWriteStream({uri: '/stream.txt', properties});
      const result = stream.result();
      stream.end('stream body');
      await assert.rejects(result, isAuthError);
      assert.strictEqual(requests.length, 1);
      assert.match(requests[0].body, /stream body/);
    });
  }

  it('does not resend a readable-stream document body', async function() {
    await prime();
    handle = (request, response) => reject(response, challenge('new', 'true'));
    await assert.rejects(client.documents.write({
      uri: '/stream.txt', content: Readable.from(['stream body'])
    }).result(), isAuthError);
    assert.strictEqual(requests.length, 1);
    assert.strictEqual(requests[0].body, 'stream body');
  });

  it('does not resend multipart writes containing a readable stream', async function() {
    await prime();
    handle = (request, response) => reject(response, challenge('new', 'true'));
    await assert.rejects(client.documents.write([
      {uri: '/one.txt', content: Readable.from(['stream body'])},
      {uri: '/two.txt', content: 'two'}
    ]).result(), isAuthError);
    assert.strictEqual(requests.length, 1);
  });

  for (const [authType, expected] of [
    ['BASIC', 'Basic ' + Buffer.from('testuser:testpassword').toString('base64')],
    ['SAML', 'SAML token=test-token'],
    ['OAUTH', 'Bearer test-token'],
    ['CLOUD', 'bearer test-token'],
    ['KERBEROS', 'Negotiate test-token'],
    ['CERTIFICATE', undefined]
  ]) {
    it('does not retry stale challenges for ' + authType + ' authentication', async function() {
      handle = (request, response) => reject(response, challenge('new', 'true'));
      const options = mlutil.newRequestOptions(client.getConnectionParams(), '/v1/ping', 'POST');
      options.authType = authType;
      if (authType === 'BASIC') {
        options.auth = 'testuser:testpassword';
      } else if (authType === 'SAML') {
        options.auth = 'SAML token=test-token';
      }
      options.oauthToken = 'test-token';
      const operation = new Operation('auth test', client, options, 'single', 'empty');
      operation.requestBody = 'body';
      operation.accessToken = 'test-token';
      if (authType === 'KERBEROS') {
        client.authenticatorKerberos = {credentials: 'test-token'};
      }
      await assert.rejects(requester.startRequest(operation).result(), isAuthError);
      assert.strictEqual(requests.length, 1);
      assert.strictEqual(requests[0].authorization, expected);
    });
  }
});
