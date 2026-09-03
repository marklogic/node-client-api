/*
* Copyright (c) 2015-2026 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/
'use strict';

const assert = require('assert');
const SessionState = require('../lib/session-state.js');

describe('SessionState', function () {
  it('sessionId() returns a non-empty string', function () {
    const session = new SessionState();
    const id = session.sessionId();
    assert.strictEqual(typeof id, 'string');
    assert.ok(id.length > 0, 'sessionId should not be empty');
  });

  it('sessionId() returns a 16-character hex string (8 random bytes)', function () {
    const session = new SessionState();
    const id = session.sessionId();
    assert.match(id, /^[0-9a-f]{16}$/, 'sessionId should be a 16-character lowercase hex string');
  });

  it('sessionId() returns the same value on repeated calls to the same instance', function () {
    const session = new SessionState();
    const id1 = session.sessionId();
    const id2 = session.sessionId();
    const id3 = session.sessionId();
    assert.strictEqual(id1, id2, 'sessionId should be stable across calls');
    assert.strictEqual(id2, id3, 'sessionId should be stable across calls');
  });

  it('two instances created in rapid succession produce different session IDs', function () {
    const session1 = new SessionState();
    const session2 = new SessionState();
    assert.notStrictEqual(session1.sessionId(), session2.sessionId(),
      'session IDs from two distinct instances should not be equal');
  });
});
