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
