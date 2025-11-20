/*
* Copyright (c) 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/

/// <reference path="../marklogic.d.ts" />

/**
 * TypeScript type checking tests for documents interface.
 *
 * This file validates:
 * - probe() method
 * - read() method
 * - write() method
 * - remove() method
 * - DocumentDescriptor interface
 *
 * These tests are compiled but NOT executed - they verify type correctness only.
 * Run with: npm run test:types
 */

import type { DatabaseClient, DocumentDescriptor, ProbeResult, WriteResult } from 'marklogic';

// Test probe() method
async function testProbe(client: DatabaseClient) {
  // Should accept a URI string
  const resultProvider = client.documents.probe('/documents/test.json');
  const result = await resultProvider.result();

  // Result should have correct shape
  const uri: string = result.uri;

  if (result.exists) {
    const contentType: string | undefined = result.contentType;
    const contentLength: number | undefined = result.contentLength;
    console.log(`Found document: ${uri} (${contentType}, ${contentLength} bytes)`);
  }

  return result;
}

// Test read() method with single URI
async function testReadSingle(client: DatabaseClient) {
  // Should accept a single URI string
  const resultProvider = client.documents.read('/documents/test.json');
  const docs = await resultProvider.result();

  // Should return array of DocumentDescriptor
  for (const doc of docs) {
    const uri: string = doc.uri;
    const content = doc.content;
    console.log(`Read document: ${uri}`, content);
  }

  return docs;
}

// Test read() method with multiple URIs
async function testReadMultiple(client: DatabaseClient) {
  // Should accept array of URI strings
  const uris = ['/doc1.json', '/doc2.json', '/doc3.xml'];
  const resultProvider = client.documents.read(uris);
  const docs = await resultProvider.result();

  return docs;
}

// Test write() method with single document
async function testWriteSingle(client: DatabaseClient) {
  // Should accept a single DocumentDescriptor
  const document: DocumentDescriptor = {
    uri: '/documents/new-doc.json',
    content: { title: 'Test Document', value: 42 },
    contentType: 'application/json',
    collections: ['test-collection'],
    permissions: [
      { 'role-name': 'rest-reader', capabilities: ['read'] },
      { 'role-name': 'rest-writer', capabilities: ['read', 'update'] }
    ],
    quality: 10
  };

  const resultProvider = client.documents.write(document);
  const writeResult = await resultProvider.result();

  // Should return WriteResult with documents array
  const firstDoc = writeResult.documents[0];
  const firstUri: string = firstDoc.uri;
  console.log(`Wrote document: ${firstUri}`);

  return writeResult;
}

// Test write() method with multiple documents
async function testWriteMultiple(client: DatabaseClient) {
  // Should accept array of DocumentDescriptor
  const documents: DocumentDescriptor[] = [
    {
      uri: '/doc1.json',
      content: { name: 'Document 1' },
      collections: 'my-collection' // Can be single string
    },
    {
      uri: '/doc2.json',
      content: { name: 'Document 2' },
      collections: ['col1', 'col2'] // Or array of strings
    },
    {
      uri: '/doc3.xml',
      content: '<root><item>value</item></root>',
      contentType: 'application/xml',
      properties: {
        customProp: 'value',
        timestamp: new Date().toISOString()
      }
    }
  ];

  const resultProvider = client.documents.write(documents);
  const writeResult = await resultProvider.result();

  // WriteResult contains documents array with uri property
  const firstUri: string = writeResult.documents[0].uri;
  console.log(`Wrote ${writeResult.documents.length} documents, first: ${firstUri}`);

  return writeResult;
}

// Test remove() method with single URI
async function testRemoveSingle(client: DatabaseClient) {
  // Should accept a single URI string
  const resultProvider = client.documents.remove('/documents/to-delete.json');
  const uris = await resultProvider.result();

  // Should return array of removed URIs
  return uris;
}

// Test remove() method with multiple URIs
async function testRemoveMultiple(client: DatabaseClient) {
  // Should accept array of URI strings
  const toRemove = ['/doc1.json', '/doc2.json', '/doc3.xml'];
  const resultProvider = client.documents.remove(toRemove);
  const uris = await resultProvider.result();

  return uris;
}

// Test complete workflow
async function testDocumentWorkflow(client: DatabaseClient) {
  const uri = '/test/workflow-doc.json';

  // Check if exists
  const probeResult = await client.documents.probe(uri).result();
  if (probeResult.exists) {
    console.log('Document already exists');
  }

  // Write document
  await client.documents.write({
    uri,
    content: { workflow: 'test', step: 1 },
    collections: ['workflow-tests']
  }).result();

  // Read it back
  const docs = await client.documents.read(uri).result();
  console.log('Read document:', docs[0].content);

  // Remove it
  await client.documents.remove(uri).result();
  console.log('Document removed');
}

// =============================================================================
// ERROR EXAMPLES - Uncomment to see TypeScript catch mistakes!
// =============================================================================

// ❌ Error: probe() requires string URI
// async function badProbe(client: DatabaseClient) {
//   await client.documents.probe(123).result(); // Error: number not assignable to string
// }

// ❌ Error: write() requires uri property
// async function badWrite(client: DatabaseClient) {
//   await client.documents.write({
//     content: { data: 'test' }
//     // Missing required 'uri' property!
//   }).result();
// }

// ❌ Error: remove() requires string or string array
// async function badRemove(client: DatabaseClient) {
//   await client.documents.remove(123).result(); // Error: number not valid
// }

console.log('✅ Documents API type validation complete!');

// Export to prevent unused warnings
export {
  testProbe,
  testReadSingle,
  testReadMultiple,
  testWriteSingle,
  testWriteMultiple,
  testRemoveSingle,
  testRemoveMultiple,
  testDocumentWorkflow
};
