/*
* Copyright (c) 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/

import * as marklogic from 'marklogic';

const testConfig = require('../etc/test-config.js');
const client = marklogic.createDatabaseClient(testConfig.restWriterConnection);

async function run() {
  try {
    const result = await client.checkConnection().result();

    if (result.connected) {
      console.log('✅ Connected successfully!');

      const uri = '/optic/test/albums1.json';

      const probeResult = await client.documents.probe(uri).result();
      console.log('Probe result', probeResult);

      const readResult = await client.documents.read(uri).result();
      console.log('Read result', readResult);

      // Try out some temporal functions.

      const temporalUri = '/test/temporal.json';
      const temporalCollection = 'temporalCollection';

      const temporalDoc = {
        "hello": "world",
        systemStartTime: '1111-11-11T11:11:11Z',
        systemEndTime:   '9999-12-31T23:59:59Z',
        validStartTime:  '1111-11-11T11:11:11Z',
        validEndTime:    '9999-12-31T23:59:59Z'
      };

      const writeResult = await client.documents.write({
        documents: [
          {
            uri: temporalUri, content:temporalDoc, collections: ['other'],
            permissions: [{"role-name": 'rest-reader', capabilities: ['read', 'update']}]
          }
        ],
        temporalCollection: temporalCollection
      }).result();
      console.log('write', writeResult);

      const protectResult = await client.documents.protect({
        uri: temporalUri,
        temporalCollection: temporalCollection,
        duration: 'P0D',
        level: 'noWipe'
      }).result();
      console.log('protectResult', protectResult);

      const wipeResult = await client.documents.wipe({uri: temporalUri, temporalCollection: temporalCollection}).result();
      console.log('wipe', wipeResult);
    } else {
      console.error(`❌ Connection failed: ${result.httpStatusCode} - ${result.httpStatusMessage}`);
      process.exit(1);
    }
  } finally {
    client.release();
  }
}

run().catch((error) => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});
