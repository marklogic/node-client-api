/*
* Copyright (c) 2015-2026 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/
'use strict';

const crypto = require('crypto');

/**
 * Identifies a server state for sharing across multiple calls to server endpoints.
 *
 * Internally, the identifier is sent to the server as a session cookie.
 * The session cookie can be used for load balancing.
 */
class SessionState {
  /**
   * Constructs an identifier for session state on the server.
   */
  constructor() {
    this._sessionId = crypto.randomBytes(8).toString('hex');
  }

  /**
   * Provides the identifier used for the server state (for instance, for use in logging).
   * @returns {string} the session identifier
   */
  sessionId() {
    return this._sessionId;
  }
}

module.exports = SessionState;