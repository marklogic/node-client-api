/*
* Copyright (c) 2015-2026 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/

/// <reference path="../marklogic.d.ts" />

/**
 * Runtime validation tests for DatabaseClient convenience methods.
 *
 * These tests verify that the simplified convenience methods on DatabaseClient
 * have correct TypeScript types and work as expected.
 *
 * Run with: npm run test:compile && npx mocha test-typescript/*.js
 */

const should = require('should');
import type { DatabaseClient } from 'marklogic';

const testConfig = require('../etc/test-config.js');
const marklogic = require('../lib/marklogic.js');

describe('DatabaseClient convenience methods runtime validation', function() {
  let client: DatabaseClient;
  const testUri = '/test-typescript/convenience-test.json';
  const testContent = { message: 'Convenience method test', timestamp: Date.now() };

  before(function() {
    client = marklogic.createDatabaseClient(testConfig.restWriterConnection);
  });

  after(function() {
    client.release();
  });

  it('should create collection with createCollection()', async function() {
    const uris = await client.createCollection('typescript-convenience-test', testContent).result();

    uris.should.be.an.Array();
    uris.length.should.equal(1);
    uris[0].should.be.a.String();
  });

  it('should probe document with probe()', async function() {
    // Write a test document first
    await client.documents.write({
      uri: testUri,
      content: testContent,
      collections: ['typescript-convenience-test']
    }).result();

    const exists = await client.probe(testUri).result();

    exists.should.be.a.Boolean();
    exists.should.equal(true);
  });

  it('should read document with read()', async function() {
    const contents = await client.read(testUri).result();

    contents.should.be.an.Array();
    contents.length.should.equal(1);
    contents[0].should.have.property('message');
  });

  it('should query collection with queryCollection()', async function() {
    const results = await client.queryCollection('typescript-convenience-test').result();

    results.should.be.an.Array();
    results.length.should.be.greaterThan(0);
  });

  it('should write collection with writeCollection()', async function() {
    const uriMap = {
      '/test-typescript/conv-1.json': { id: 1, name: 'Test 1' },
      '/test-typescript/conv-2.json': { id: 2, name: 'Test 2' }
    };

    const uris = await client.writeCollection('typescript-convenience-test', uriMap).result();

    uris.should.be.an.Array();
    uris.length.should.equal(2);
  });

  it('should remove document with remove()', async function() {
    const uris = await client.remove('/test-typescript/conv-1.json', '/test-typescript/conv-2.json').result();

    uris.should.be.an.Array();
    uris.length.should.equal(2);
  });

  it('should remove collection with removeCollection()', async function() {
    const result = await client.removeCollection('typescript-convenience-test').result();

    result.should.be.a.String();
    result.should.equal('typescript-convenience-test');
  });

  it('should create timestamp with createTimestamp()', function() {
    const ts1 = client.createTimestamp();
    ts1.should.have.property('value');

    const ts2 = client.createTimestamp('2025-11-25T12:00:00Z');
    ts2.should.have.property('value');
    if (ts2.value !== null) {
      ts2.value.should.equal('2025-11-25T12:00:00Z');
    }
  });

  it('should evaluate JavaScript with eval()', async function() {
    const results = await client.eval('xdmp.toJSON({message: "Hello from eval"})').result();

    results.should.be.an.Array();
    results.length.should.equal(1);
    results[0].should.have.property('format');
    results[0].should.have.property('datatype');
    results[0].should.have.property('value');
    results[0].format.should.equal('json');
    results[0].value.should.have.property('message');
    results[0].value.message.should.equal('Hello from eval');
  });

  it('should evaluate JavaScript with variables', async function() {
    const results = await client.eval(
      'var x; xdmp.toJSON({result: x * 2})',
      { x: 21 }
    ).result();

    results.should.be.an.Array();
    results[0].value.result.should.equal(42);
  });

  it('should evaluate XQuery with xqueryEval()', async function() {
    const results = await client.xqueryEval('"Hello from XQuery"').result();

    results.should.be.an.Array();
    results.length.should.equal(1);
    results[0].format.should.equal('text');
    results[0].datatype.should.equal('string');
    results[0].value.should.equal('Hello from XQuery');
  });

  it('should evaluate XQuery with variables', async function() {
    const results = await client.xqueryEval(
      'declare variable $x as xs:integer external; $x * 3',
      { x: 14 }
    ).result();

    results.should.be.an.Array();
    results[0].value.should.equal(42);
  });

  it('should invoke a module with invoke()', async function() {
    const results = await client.invoke('/hello.xqy').result();

    results.should.be.an.Array();
    results.length.should.equal(1);
    results[0].should.have.property('format');
    results[0].should.have.property('value');
    results[0].value.should.be.a.String();
  });



  it('should use setLogger with a level string', async function() {
    // Set logger to 'info' level
    client.setLogger('info');

    // Write a test document
    await client.documents.write({
      uri: '/test-typescript/setlogger-test.json',
      content: { test: 'setLogger' }
    }).result();

    // Verify client is still functional after setting logger
    const exists = await client.probe('/test-typescript/setlogger-test.json').result();
    exists.should.be.a.Boolean();
    exists.should.equal(true);
  });

  it('should use setLogger with a logger object', async function() {
    // Create a simple logger object
    const testLogger = {
      debug: (msg: string) => console.log('DEBUG:', msg),
      info: (msg: string) => console.log('INFO:', msg),
      warn: (msg: string) => console.log('WARN:', msg),
      error: (msg: string) => console.log('ERROR:', msg)
    };

    // Set logger with object
    client.setLogger(testLogger, false);

    // Write a test document
    await client.documents.write({
      uri: '/test-typescript/setlogger-test2.json',
      content: { test: 'setLogger with object' }
    }).result();

    // Verify client is still functional after setting logger
    const exists = await client.probe('/test-typescript/setlogger-test2.json').result();
    exists.should.be.a.Boolean();
    exists.should.equal(true);
  });

});
