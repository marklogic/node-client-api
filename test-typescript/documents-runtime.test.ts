/*
* Copyright (c) 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/

/// <reference path="../marklogic.d.ts" />

/**
 * Runtime validation tests for Documents API.
 *
 * These tests make actual calls to MarkLogic to verify:
 * - Type definitions match runtime behavior
 * - ResultProvider pattern works correctly
 * - Methods return expected data structures
 *
 * Run with: npm run test:compile && npx mocha test-typescript/*.js
 */

import should = require('should');
import type { DatabaseClient } from 'marklogic';

const testConfig = require('../etc/test-config.js');
const marklogic = require('../lib/marklogic.js');

describe('Documents API runtime validation', function() {
  let client: DatabaseClient;
  const testUri = '/test-typescript/documents-runtime-test.json';
  const testContent = { message: 'TypeScript test document', timestamp: Date.now() };

  before(function() {
    client = marklogic.createDatabaseClient(testConfig.restWriterConnection);
  });

  after(function() {
    client.release();
  });

  it('write() returns ResultProvider with WriteResult', async function() {
    const resultProvider = client.documents.write({
      uri: testUri,
      content: testContent,
      contentType: 'application/json'
    });

    // Verify ResultProvider has result() method
    resultProvider.should.have.property('result');
    resultProvider.result.should.be.a.Function();

    const writeResult = await resultProvider.result();

    // Verify return type is WriteResult with documents array
    writeResult.should.be.an.Object();
    writeResult.should.have.property('documents');
    writeResult.documents.should.be.an.Array();
    writeResult.documents.should.have.length(1);
    writeResult.documents[0].should.have.property('uri');
    writeResult.documents[0].uri.should.equal(testUri);
  });

  it('probe() returns ResultProvider with ProbeResult', async function() {
    const resultProvider = client.documents.probe(testUri);

    // Verify ResultProvider has result() method
    resultProvider.should.have.property('result');
    resultProvider.result.should.be.a.Function();

    const probeResult = await resultProvider.result();

    // Verify ProbeResult structure
    probeResult.should.have.property('uri', testUri);
    probeResult.should.have.property('exists', true);
    probeResult.should.have.property('contentType');
    probeResult.should.have.property('contentLength');
  });

  it('read() returns ResultProvider with DocumentDescriptor array', async function() {
    const resultProvider = client.documents.read(testUri);

    // Verify ResultProvider has result() method
    resultProvider.should.have.property('result');
    resultProvider.result.should.be.a.Function();

    const docs = await resultProvider.result();

    // Verify return type is DocumentDescriptor array
    docs.should.be.an.Array();
    docs.should.have.length(1);

    const doc = docs[0];
    doc.should.have.property('uri', testUri);
    doc.should.have.property('content');
    doc.content.should.have.property('message', testContent.message);
  });

  it('remove() returns ResultProvider with RemoveResult', async function() {
    const resultProvider = client.documents.remove(testUri);

    // Verify ResultProvider has result() method
    resultProvider.should.have.property('result');
    resultProvider.result.should.be.a.Function();

    const result = await resultProvider.result();

    // Verify RemoveResult structure
    result.should.have.property('uris');
    result.should.have.property('removed', true);
    result.uris.should.be.an.Array();
    result.uris.should.have.length(1);
    result.uris[0].should.equal(testUri);

    // Verify document was actually removed
    const probeResult = await client.documents.probe(testUri).result();
    probeResult.exists.should.equal(false);
  });
});
