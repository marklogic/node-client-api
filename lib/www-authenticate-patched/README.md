# www-authenticate-patched

HTTP Digest Authentication module for MarkLogic Node.js Client.

## Security Notice: MD5 Usage

This module uses MD5 hashing as **required by RFC 2617** (HTTP Digest Authentication).

### Why MD5 Cannot Be Replaced

1. **Protocol Mandate**: RFC 2617 Section 3.2.2 specifies MD5 for HA1/HA2 calculation
2. **Interoperability**: Changing the algorithm breaks auth with all RFC 2617 servers
3. **Not Password Storage**: This is challenge-response auth, not password hashing

### Security Scanners

Security tools (SAST, DAST) may flag MD5 usage as CWE-327 or CWE-916. This is a
**false positive** in the context of HTTP Digest Authentication. The finding should
be triaged as "Won't Fix - Protocol Required" with reference to:

- RFC 2617: https://datatracker.ietf.org/doc/html/rfc2617
- RFC 7616: https://datatracker.ietf.org/doc/html/rfc7616

### Files

- `md5.js` - MD5 helper (RFC 2617 compliant)
- `user-credentials.js` - Digest auth credential handling
- `www-authenticate.js` - WWW-Authenticate header parsing
- `parsers.js` - Auth header parsers
