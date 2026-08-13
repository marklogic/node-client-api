/*
 * www-authenticate
 * https://github.com/randymized/www-authenticate
 *
 * Copyright (c) 2013 Randy McLaughlin
 * Licensed under the MIT license.
 */

/*
* Copyright (c) 2015-2026 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/

/*
 * ⚠️  SECURITY NOTICE: MD5 Usage in HTTP Digest Authentication
 * 
 * This module provides MD5 hashing EXCLUSIVELY for HTTP Digest Authentication
 * as mandated by RFC 2617 and RFC 7616. MD5 cannot be replaced without breaking
 * interoperability with all HTTP Digest Authentication implementations.
 * 
 * RFC 2617 Section 3.2.2 explicitly requires:
 *   HA1 = MD5(username:realm:password)
 *   HA2 = MD5(method:digestURI)
 *   response = MD5(HA1:nonce:HA2)
 * 
 * ⚠️  WARNING: DO NOT USE THIS MODULE FOR:
 *   - Password storage or hashing
 *   - Security token generation
 *   - Digital signatures
 *   - Data integrity verification
 *   - Any security purpose outside HTTP Digest Auth (RFC 2617/7616)
 * 
 * For password hashing, use: bcrypt, scrypt, or Argon2id
 * For general hashing, use: SHA-256, SHA-3, or BLAKE2
 * 
 * This module is restricted to www-authenticate-patched/ directory only.
 * Imports from outside this directory indicate potential security misuse.
 * 
 * Security Finding Triage:
 *   - CodeQL Alert #20 (CWE-327): Triaged - Protocol-Required
 *   - CodeQL Alert #4 (CWE-916): Triaged - Protocol-Required
 *   - Risk: ACCEPTED (mitigated by HTTPS/TLS in production)
 * 
 * References:
 *   - RFC 2617: HTTP Authentication: Basic and Digest Access Authentication
 *   - RFC 7616: HTTP Digest Access Authentication (obsoletes RFC 2617)
 *   - OWASP: https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html
 */

const crypto= require('crypto');

/**
 * MD5 hash function for RFC 2617/7616 HTTP Digest Authentication ONLY.
 * 
 * ⚠️  SECURITY: This function is ONLY for protocol-mandated digest auth.
 * DO NOT use for password storage, tokens, or general security purposes.
 * 
 * @param {string} s - String to hash (typically "username:realm:password" per RFC 2617)
 * @returns {string} MD5 hash in hexadecimal format
 * @internal
 */
function md5(s) {
  return crypto.createHash('md5').update(s).digest('hex');
}

module.exports= md5;