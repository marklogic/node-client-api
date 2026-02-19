/*
* Copyright (c) 2015-2026 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
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

const should = require('should');
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

  it('removeAll() returns ResultProvider with RemoveAllResult', async function() {
    const testCollection = 'typescript-test-collection';
    const testUri1 = '/test-typescript/removeAll-test-1.json';
    const testUri2 = '/test-typescript/removeAll-test-2.json';

    // Write documents to a collection
    await client.documents.write([
      {
        uri: testUri1,
        content: { test: 'doc1' },
        contentType: 'application/json',
        collections: [testCollection]
      },
      {
        uri: testUri2,
        content: { test: 'doc2' },
        contentType: 'application/json',
        collections: [testCollection]
      }
    ]).result();

    // Remove all documents in the collection
    const resultProvider = client.documents.removeAll({
      collection: testCollection
    });

    // Verify ResultProvider has result() method
    resultProvider.should.have.property('result');
    resultProvider.result.should.be.a.Function();

    const result = await resultProvider.result();

    // Verify RemoveAllResult structure
    result.should.have.property('exists', false);
    result.should.have.property('collection', testCollection);

    // Verify documents were actually removed
    const probe1 = await client.documents.probe(testUri1).result();
    const probe2 = await client.documents.probe(testUri2).result();
    probe1.exists.should.equal(false);
    probe2.exists.should.equal(false);
  });

  it('patch() returns ResultProvider with PatchResult', async function() {
    const testUri = '/test-typescript/patch-test.json';

    // Write a document first
    await client.documents.write({
      uri: testUri,
      content: { name: 'Original', count: 1 },
      contentType: 'application/json'
    }).result();

    // Patch the document using patchBuilder
    const p = marklogic.patchBuilder;
    const resultProvider = client.documents.patch(
      testUri,
      p.replace('/name', 'Updated'),
      p.replace('/count', 2)
    );

    // Verify ResultProvider has result() method
    resultProvider.should.have.property('result');
    resultProvider.result.should.be.a.Function();

    const result = await resultProvider.result();

    // Verify PatchResult structure
    result.should.have.property('uri', testUri);

    // Verify document was actually patched
    const docs = await client.documents.read(testUri).result();
    docs[0].content.should.have.property('name', 'Updated');
    docs[0].content.should.have.property('count', 2);

    // Clean up
    await client.documents.remove(testUri).result();
  });

  it('protect() returns ResultProvider with ProtectResult', async function() {
    // Note: Requires temporal document to exist and may need temporal-admin role
    this.skip();

    const testUri = '/test-typescript/temporal-doc.json';
    const temporalCollection = 'temporalCollection';

    const resultProvider = client.documents.protect({
      uri: testUri,
      temporalCollection: temporalCollection,
      duration: 'P30D',
      level: 'noDelete'
    });

    resultProvider.should.have.property('result');
    resultProvider.result.should.be.a.Function();

    const result = await resultProvider.result();

    // Verify ProtectResult structure
    result.should.have.property('uri', testUri);
    result.should.have.property('temporalCollection', temporalCollection);
    result.should.have.property('level', 'noDelete');
  });

  it('wipe() returns ResultProvider with WipeResult', async function() {
    // Note: Requires admin privileges and temporal document to exist
    this.skip();

    const testUri = '/test-typescript/temporal-wipe-doc.json';
    const temporalCollection = 'temporalCollection';

    const resultProvider = client.documents.wipe({
      uri: testUri,
      temporalCollection: temporalCollection
    });

    resultProvider.should.have.property('result');
    resultProvider.result.should.be.a.Function();

    const result = await resultProvider.result();

    // Verify WipeResult structure
    result.should.have.property('uri', testUri);
    result.should.have.property('temporalCollection', temporalCollection);
    result.should.have.property('wiped', true);
  });

  it('advanceLsqt() returns ResultProvider with AdvanceLsqtResult', async function() {
    // Note: Requires temporal-admin or admin role
    this.skip();

    const temporalCollection = 'temporalCollection';

    const resultProvider = client.documents.advanceLsqt({
      temporalCollection: temporalCollection,
      lag: 10
    });

    resultProvider.should.have.property('result');
    resultProvider.result.should.be.a.Function();

    const result = await resultProvider.result();

    // Verify AdvanceLsqtResult structure
    result.should.have.property('lsqt');
    result.lsqt.should.be.a.String();
  });

  it('should write with createWriteStream and verify types', async function() {
    const fs = require('fs');
    const path = require('path');
    const uri = '/test/typescript-stream.png';
    
    // Use a small PNG from test data
    const binaryPath = path.join(__dirname, '../test-basic/data/mlfavicon.png');
    
    // Create write stream
    const ws = client.documents.createWriteStream({
      uri: uri,
      contentType: 'image/png',
      collections: ['typescript-test']
    });
    
    // Verify it's a writable stream
    ws.should.have.property('write');
    ws.should.have.property('end');
    ws.should.have.property('result');
    
    // Write the file through the stream
    const writePromise = new Promise<void>((resolve, reject) => {
      ws.result((response: any) => {
        response.should.have.property('documents');
        response.documents.length.should.equal(1);
        response.documents[0].uri.should.equal(uri);
        resolve();
      }).catch(reject);
      
      fs.createReadStream(binaryPath).pipe(ws);
    });
    
    await writePromise;
    
    // Verify document was written
    const readResult = await client.documents.probe(uri).result();
    readResult.exists.should.equal(true);
  });
});
