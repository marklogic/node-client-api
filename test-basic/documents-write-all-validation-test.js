/*
* Copyright (c) 2015-2026 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/
'use strict';

const assert = require('assert');
const http = require('http');
const {Readable} = require('stream');
const marklogic = require('../');

describe('documents.writeAll validation errors', function() {
  let server;
  let db;
  let writtenUris;
  let rejectWrites;

  beforeEach(async function() {
    writtenUris = [];
    rejectWrites = false;
    server = http.createServer(function(request, response) {
      let body = '';
      request.setEncoding('utf8');
      request.on('data', chunk => { body += chunk; });
      request.on('end', function() {
        response.setHeader('Content-Type', 'application/json');
        if (request.url === '/v1/internal/forestinfo') {
          response.end(JSON.stringify([{host: 'localhost'}]));
        } else if (rejectWrites) {
          response.writeHead(400);
          response.end(JSON.stringify({errorResponse: {message: 'Rejected test batch'}}));
        } else {
          const uri = new URL(request.url, 'http://localhost').searchParams.get('uri');
          const uris = uri === null ?
            Array.from(body.matchAll(/filename="([^"]+)"/g), match => match[1]) : [uri];
          writtenUris.push(...uris);
          response.end(JSON.stringify({documents: uris.map(uri => ({uri}))}));
        }
      });
    });
    await new Promise(function(resolve, reject) {
      server.once('error', reject);
      server.listen(0, '127.0.0.1', resolve);
    });
    db = marklogic.createDatabaseClient({
      host: '127.0.0.1',
      port: server.address().port,
      user: 'u',
      password: 'p',
      authType: 'basic'
    });
  });

  afterEach(async function() {
    db.release();
    await new Promise(function(resolve, reject) {
      server.close(error => error ? reject(error) : resolve());
    });
  });

  function runWriteAll(onBatchError, {
    documentCount = 6,
    invalidIndex = 3,
    invalidDocument = {uri: '/poc/bad"q.json'}
  } = {}) {
    const documents = Array.from({length: documentCount}, (_, i) => ({
      uri: '/poc/ok' + i + '.json',
      content: {i}
    }));
    if (invalidDocument !== null) {
      Object.assign(documents[invalidIndex], invalidDocument);
    }
    const errors = [];
    const successfulUris = [];
    return new Promise(function(resolve) {
      db.documents.writeAll(Readable.from(documents), {
        batchSize: 2,
        onBatchError,
        onBatchSuccess: function(progress, batch) {
          successfulUris.push(...batch.map(document => document.uri));
        },
        onCompletion: function(summary) {
          resolve({summary, errors, successfulUris});
        }
      }).on('error', error => errors.push(error));
    });
  }

  it('reports the entire rejected batch and completes when the handler skips it', async function() {
    const failures = [];
    const result = await runWriteAll(function(progress, documents, error) {
      failures.push({progress, documents, error});
      return null;
    });
    assert.strictEqual(failures.length, 1);
    assert.strictEqual(failures[0].progress.docsFailedToBeWritten, 2);
    assert.deepStrictEqual(failures[0].documents.map(document => document.uri).sort(),
      ['/poc/bad"q.json', '/poc/ok2.json']);
    assert.match(failures[0].error.message, /Content-Disposition values must not contain/);
    assert.strictEqual(result.summary.docsWrittenSuccessfully, 4);
    assert.strictEqual(result.summary.error, undefined);
    assert.deepStrictEqual(result.errors, []);
    assert.deepStrictEqual(writtenUris.sort(),
      ['/poc/ok0.json', '/poc/ok1.json', '/poc/ok4.json', '/poc/ok5.json']);
    assert.deepStrictEqual(result.successfulUris.sort(), writtenUris);
  });

  it('retries a corrected batch and completes without losing its valid document', async function() {
    let failures = 0;
    const result = await runWriteAll(function(progress, documents) {
      failures++;
      return documents.map(document => ({
        ...document,
        uri: document.uri.replace('"', '')
      }));
    });
    assert.strictEqual(failures, 1);
    assert.strictEqual(result.summary.docsWrittenSuccessfully, 6);
    assert.strictEqual(result.summary.docsFailedToBeWritten, 0);
    assert.strictEqual(result.summary.error, undefined);
    assert.deepStrictEqual(result.errors, []);
    assert.deepStrictEqual(writtenUris.sort(),
      ['/poc/badq.json', '/poc/ok0.json', '/poc/ok1.json',
        '/poc/ok2.json', '/poc/ok4.json', '/poc/ok5.json']);
    assert.deepStrictEqual(result.successfulUris.sort(), writtenUris);
  });

  it('emits the handler error and completes when the handler aborts', async function() {
    const abortError = new Error('Stop this write job');
    let failures = 0;
    const result = await runWriteAll(function() {
      failures++;
      throw abortError;
    });
    assert.strictEqual(failures, 1);
    assert.deepStrictEqual(result.errors, [abortError]);
    assert.strictEqual(result.summary.docsFailedToBeWritten, 2);
    assert.strictEqual(result.summary.error, abortError.toString());
  });

  it('emits the validation error and completes when no batch-error handler is supplied', async function() {
    const result = await runWriteAll();
    assert.strictEqual(result.errors.length, 1);
    assert.match(result.errors[0].message, /Content-Disposition values must not contain/);
    assert.strictEqual(result.summary.docsFailedToBeWritten, 2);
    assert.strictEqual(result.summary.error, result.errors[0].toString());
  });

  it('limits retries when the replacement batch still fails validation', async function() {
    let failures = 0;
    const result = await runWriteAll(function(progress, documents) {
      failures++;
      return documents;
    });
    assert.strictEqual(failures, 3);
    assert.strictEqual(result.errors.length, 1);
    assert.strictEqual(result.summary.docsFailedToBeWritten, 2);
    assert.strictEqual(result.summary.error, result.errors[0].toString());
  });

  it('preserves batch-error handling for asynchronous server rejections', async function() {
    rejectWrites = true;
    const failures = [];
    const result = await runWriteAll(function(progress, documents, error) {
      failures.push(error);
      return null;
    }, {invalidDocument: null});
    assert.strictEqual(failures.length, 3);
    assert(failures.every(error => error instanceof Error));
    assert.strictEqual(result.summary.docsWrittenSuccessfully, 0);
    assert.strictEqual(result.summary.error, undefined);
    assert.deepStrictEqual(result.errors, []);
    assert.deepStrictEqual(writtenUris, []);
  });

  for (const [field, invalidDocument, expectedError] of [
    ['temporalDocument', {temporalDocument: '/poc/bad"q.json'}, /Content-Disposition values must not contain/],
    ['contentType', {contentType: 'application/json\r\nX-Injected: yes'}, /must not contain CR, LF, or NUL/],
    ['extension', {uri: undefined, extension: 'json; category=metadata'}, /must not contain semicolons/],
    ['directory', {uri: undefined, extension: 'json', directory: '/poc/; category=metadata'}, /must not contain semicolons/],
    ['versionId', {versionId: '1; category=metadata'}, /must not contain semicolons/],
    ['repair', {format: 'xml', repair: 'invalid'}, /repair must be/]
  ]) {
    it('routes synchronous ' + field + ' validation through onBatchError', async function() {
      const failures = [];
      const result = await runWriteAll(function(progress, documents, error) {
        failures.push(error);
        return null;
      }, {invalidDocument});
      assert.strictEqual(failures.length, 1);
      assert.match(failures[0].message, expectedError);
      assert.strictEqual(result.summary.docsWrittenSuccessfully, 4);
      assert.strictEqual(result.summary.error, undefined);
      assert.deepStrictEqual(result.errors, []);
      assert.deepStrictEqual(writtenUris.sort(),
        ['/poc/ok0.json', '/poc/ok1.json', '/poc/ok4.json', '/poc/ok5.json']);
    });
  }

  for (const [documentCount, invalidIndex] of [[2, 0], [3, 0], [14, 8], [14, 13]]) {
    it('completes a corrected batch at index ' + invalidIndex + ' of ' + documentCount + ' documents',
      async function() {
        let failures = 0;
        const result = await runWriteAll(function(progress, documents) {
          failures++;
          return documents.map(document => ({
            ...document,
            uri: document.uri.replace('"', '')
          }));
        }, {documentCount, invalidIndex});
        const expectedUris = Array.from({length: documentCount}, (_, i) =>
          i === invalidIndex ? '/poc/badq.json' : '/poc/ok' + i + '.json').sort();
        assert.strictEqual(failures, 1);
        assert.strictEqual(result.summary.docsWrittenSuccessfully, documentCount);
        assert.strictEqual(result.summary.docsFailedToBeWritten, 0);
        assert.strictEqual(result.summary.error, undefined);
        assert.deepStrictEqual(result.errors, []);
        assert.deepStrictEqual(writtenUris.sort(), expectedUris);
        assert.deepStrictEqual(result.successfulUris.sort(), expectedUris);
      });
  }

  it('preserves successful jobs when workers consume multiple batches', async function() {
    const result = await runWriteAll(undefined, {documentCount: 14, invalidDocument: null});
    assert.strictEqual(result.summary.docsWrittenSuccessfully, 14);
    assert.strictEqual(result.summary.docsFailedToBeWritten, 0);
    assert.strictEqual(result.summary.error, undefined);
    assert.deepStrictEqual(result.errors, []);
    assert.deepStrictEqual(writtenUris.sort(),
      Array.from({length: 14}, (_, i) => '/poc/ok' + i + '.json').sort());
    assert.deepStrictEqual(result.successfulUris.sort(), writtenUris);
  });
});
