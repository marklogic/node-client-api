'use strict';
// Unit test for zero-dep digest-auth implementation
const should = require('should');
const createDigestAuth = require('../lib/digest-auth');

describe('digest-auth utility', function () {
    it('generates a valid Digest Authorization header (MD5, qop=auth)', function () {
        const user = 'user';
        const pass = 'password';
        const challenge = 'Digest realm="testrealm@host.com", qop="auth", nonce="dcd98b7102dd2f0e8b11d0f600bfb0c093", opaque="5ccc069c403ebaf9f0171e9517f40e41"';

        const auth = createDigestAuth(user, pass, challenge);
        const header = auth.authorize('GET', '/dir/index.html');

        header.should.startWith('Digest ');
        header.should.match(/username="user"/);
        header.should.match(/realm="testrealm@host.com"/);
        header.should.match(/uri="\/dir\/index.html"/);
        header.should.match(/response="[a-f0-9]{32}"/);
    });

    it('handles algorithm="MD5-sess"', function () {
        const challenge = 'Digest realm="edge", algorithm="MD5-sess", qop="auth", nonce="abc123"';
        const auth = createDigestAuth('alice', 'secret', challenge);
        const header = auth.authorize('GET', '/path');

        header.should.match(/algorithm=MD5-sess/);
        header.should.match(/response="[a-f0-9]{32}"/);
    });

    it('handles qop="auth-int" and body hash', function () {
        const body = 'HELLO';
        const challenge = 'Digest realm="edge", qop="auth-int", nonce="def456"';
        const auth = createDigestAuth('bob', 'password', challenge);
        const header = auth.authorize('POST', '/submit', body);

        header.should.match(/qop=auth-int/);
        header.should.match(/nc=00000001/);
        header.should.match(/response="[a-f0-9]{32}"/);
    });

    it('increments nonce-count (nc) on successive calls', function () {
        const challenge = 'Digest realm="edge", qop="auth", nonce="ghi789"';
        const auth = createDigestAuth('carol', 'hunter2', challenge);
        const h1 = auth.authorize('GET', '/a');
        const h2 = auth.authorize('GET', '/b');

        h1.should.match(/nc=00000001/);
        h2.should.match(/nc=00000002/);
    });

    // RFC 2069 legacy support (no qop)
    it('handles RFC 2069 challenges without qop parameter', function () {
        const challenge = 'Digest realm="legacy", nonce="xyz789"';
        const auth = createDigestAuth('olduser', 'oldpass', challenge);
        const header = auth.authorize('GET', '/legacy');

        header.should.startWith('Digest ');
        header.should.match(/username="olduser"/);
        header.should.match(/realm="legacy"/);
        header.should.match(/nonce="xyz789"/);
        header.should.match(/response="[a-f0-9]{32}"/);
        // Should NOT contain qop, nc, or cnonce for RFC 2069
        header.should.not.match(/qop=/);
        header.should.not.match(/nc=/);
        header.should.not.match(/cnonce=/);
    });

    // Multiple qop values
    it('handles multiple qop values and selects auth over auth-int', function () {
        const challenge = 'Digest realm="multi", qop="auth-int,auth", nonce="multi123"';
        const auth = createDigestAuth('multiuser', 'multipass', challenge);
        const header = auth.authorize('POST', '/multi', 'body');

        header.should.match(/qop=auth/);
        header.should.not.match(/qop=auth-int/);
    });

    it('prefers auth-int when auth is not available', function () {
        const challenge = 'Digest realm="authint", qop="auth-int", nonce="authint123"';
        const auth = createDigestAuth('intuser', 'intpass', challenge);
        const header = auth.authorize('POST', '/authint', 'testbody');

        header.should.match(/qop=auth-int/);
    });

    // Edge cases and error handling
    it('handles challenges with opaque parameter', function () {
        const challenge = 'Digest realm="opaque-test", qop="auth", nonce="opaque123", opaque="abc123def456"';
        const auth = createDigestAuth('opaqueuser', 'opaquepass', challenge);
        const header = auth.authorize('GET', '/opaque');

        header.should.match(/opaque="abc123def456"/);
    });

    it('handles challenges with algorithm parameter explicitly set to MD5', function () {
        const challenge = 'Digest realm="explicit", algorithm="MD5", qop="auth", nonce="explicit123"';
        const auth = createDigestAuth('explicituser', 'explicitpass', challenge);
        const header = auth.authorize('GET', '/explicit');

        header.should.match(/algorithm=MD5/);
    });

    it('handles empty or missing realm gracefully', function () {
        const challenge = 'Digest qop="auth", nonce="norealm123"';
        const auth = createDigestAuth('noreamluser', 'norealmpass', challenge);
        const header = auth.authorize('GET', '/norealm');

        header.should.match(/realm=""/);
        header.should.match(/response="[a-f0-9]{32}"/);
    });

    it('handles quoted values with embedded commas', function () {
        const challenge = 'Digest realm="test,realm", qop="auth", nonce="comma,test"';
        const auth = createDigestAuth('commauser', 'commapass', challenge);
        const header = auth.authorize('GET', '/comma');

        header.should.match(/realm="test,realm"/);
        header.should.match(/nonce="comma,test"/);
    });

    // MarkLogic-specific scenarios
    it('works with typical MarkLogic server challenge', function () {
        // Simulate a typical MarkLogic digest challenge
        const challenge = 'Digest realm="public", qop="auth", nonce="1234567890abcdef", opaque="5ccc069c403ebaf9f0171e9517f40e41"';
        const auth = createDigestAuth('mluser', 'mlpassword', challenge);
        const header = auth.authorize('GET', '/v1/documents');

        header.should.startWith('Digest ');
        header.should.match(/username="mluser"/);
        header.should.match(/realm="public"/);
        header.should.match(/uri="\/v1\/documents"/);
        header.should.match(/qop=auth/);
        header.should.match(/nc=00000001/);
        header.should.match(/cnonce="[a-f0-9]{16}"/);
        header.should.match(/response="[a-f0-9]{32}"/);
        header.should.match(/opaque="5ccc069c403ebaf9f0171e9517f40e41"/);
    });

    it('handles POST requests with body content for MarkLogic document insertion', function () {
        const challenge = 'Digest realm="public", qop="auth-int", nonce="mlnonce123"';
        const auth = createDigestAuth('mluser', 'mlpass', challenge);
        const jsonBody = '{"test": "document"}';
        const header = auth.authorize('POST', '/v1/documents', jsonBody);

        header.should.match(/qop=auth-int/);
        header.should.match(/uri="\/v1\/documents"/);
        header.should.match(/response="[a-f0-9]{32}"/);
    });
});

