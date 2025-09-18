'use strict';

// Zero-dependency HTTP Digest Access Authentication helper.
// Covers RFC 7616 MD5 and MD5-sess algorithms with qop="auth" (default).
// Falls back to the legacy RFC 2069 variant if the server omits qop.
//
// Usage:
//   const createDigestAuth = require('./digest-auth');
//   const auth = createDigestAuth(user, pass, challengeHeader);
//   request.setHeader('Authorization', auth.authorize(method, path, bodyOptional));

const crypto = require('crypto');

/**
* Creates a hex-encoded MD5 hash of the supplied string.
* @param {string} data
* @returns {string}
*/
function md5(data) {
    return crypto.createHash('md5').update(data).digest('hex');
}

/**
* Trim surrounding quotes from a header value.
* @param {string} value
* @returns {string}
*/
function unquote(value) {
    if (value === null || value === undefined) return '';
    const first = value[0];
    const last  = value[value.length - 1];
    if ((first === '"' && last === '"') || (first === '\'' && last === '\'')) {
        return value.slice(1, -1);
    }
    return value;
}

/**
* Parse a WWW-Authenticate challenge header into an object.
* Handles quoted values and embedded commas in quotes.
* @param {string} header
* @returns {Object.<string,string>}
*/
function parseChallenge(header) {
    // Remove scheme (e.g., "Digest ") prefix if present
    header = header.replace(/^\s*Digest\s+/i, '');
    const params = {};
    // Use global regex to capture key=value pairs robustly
    const pairRE = /(\w+)=\s*(?:"([^"]*)"|([\w.-]+))/g;
    let match;
    while ((match = pairRE.exec(header)) !== null) {
        const key = match[1];
        const val = match[2] !== undefined ? match[2] : match[3];
        params[key] = val;
    }
    return params;
}

/**
* Creates a Digest authenticator compatible with the interface expected by requester.js
* @param {string} user
* @param {string} password
* @param {string} challengeHeader – The raw WWW-Authenticate header value
* @returns {{authorize:(method:string, uri:string, entityBody?:string)=>string}}
*/
function createDigestAuth(user, password, challengeHeader) {
    const challenge = parseChallenge(challengeHeader);
    const {
        realm = '',
        nonce = '',
        qop: qopRaw,
        algorithm = 'MD5',
        opaque
    } = challenge;

    // qop may contain a list: "auth,auth-int"
    const qopList = (qopRaw || '').split(/,\s*/);
    const qop = qopList.includes('auth') ? 'auth' : (qopList.includes('auth-int') ? 'auth-int' : undefined);

    // Pre-calculate HA1 for MD5; MD5-sess handled per request as it needs cnonce.
    const ha1Base = `${user}:${realm}:${password}`;
    const ha1Static = md5(ha1Base);

    let nonceCount = 0;

    function authorize(method, uri, entityBody = '') {
        nonceCount += 1;
        const nc = nonceCount.toString(16).padStart(8, '0');
        const cnonce = crypto.randomBytes(8).toString('hex');

        let ha1 = ha1Static;
        if (/md5-sess/i.test(algorithm)) {
            ha1 = md5(`${ha1Static}:${nonce}:${cnonce}`);
        }

        let ha2;
        if (qop === 'auth-int') {
            const bodyHash = md5(entityBody);
            ha2 = md5(`${method}:${uri}:${bodyHash}`);
        } else {
            ha2 = md5(`${method}:${uri}`);
        }

        let response;
        if (qop) {
            response = md5(`${ha1}:${nonce}:${nc}:${cnonce}:${qop}:${ha2}`);
        } else {
            // RFC 2069 – no qop, nc, cnonce
            response = md5(`${ha1}:${nonce}:${ha2}`);
        }

        const parts = [
            `username="${user}"`,
            `realm="${realm}"`,
            `nonce="${nonce}"`,
            `uri="${uri}"`,
        ];
        if (opaque) {
            parts.push(`opaque="${opaque}"`);
        }
        if (qop) {
            parts.push(`qop=${qop}`, `nc=${nc}`, `cnonce="${cnonce}"`);
        }
        parts.push(`response="${response}"`);
        if (algorithm) {
            parts.push(`algorithm=${algorithm}`);
        }

        return `Digest ${parts.join(', ')}`;
    }

    return { authorize };
}

module.exports = createDigestAuth;
