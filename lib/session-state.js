/*
* Copyright © 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/
'use strict';

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
    // TODO: use BigInt?
    this._sessionId = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
  }

  /**
   * Provides the identifier used for the server state (for instance, for use in logging).
   * @returns {number} the session identifier
   */
  sessionId() {
    return this._sessionId;
  }
}

module.exports = SessionState;