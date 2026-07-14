/*
* Copyright (c) 2015-2026 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/
const fs = require('fs');
const path = require('path');
const strictTlsVerification = process.env.ML_TEST_SSL_STRICT === 'true';

var testHost = 'localhost';

var restPort     = '8016';
var restAuthType = 'DIGEST';

var managePort     = '8002';
var manageAuthType = 'DIGEST';

var restAdminUser     = 'rest-admin';
var restAdminPassword = 'x';

var restReaderUser     = 'rest-reader';
var restReaderPassword = 'x';

var restWriterUser     = 'rest-writer';
var restWriterPassword = 'x';

var restEvaluatorUser     = 'rest-evaluator';
var restEvaluatorPassword = 'x';

var testServerName = 'node-client-api-ssl-server';

// Do NOT disable TLS certificate validation in production.
// Prefer providing ca with a trusted certificate instead (CWE-295).
module.exports = {
    testServerName: testServerName,
    testHost:       testHost,
    restPort:       restPort,
    restAdminConnection: {
        host:     testHost,
        port:     restPort,
        user:     restAdminUser,
        password: restAdminPassword,
        authType: restAuthType
    },
    restReaderConnection: {
        host:     testHost,
        port:     restPort,
        user:     restReaderUser,
        password: restReaderPassword,
        authType: restAuthType
    },
    restWriterConnection: {
        host:     testHost,
        port:     restPort,
        user:     restWriterUser,
        password: restWriterPassword,
        authType: restAuthType
    },
    restEvaluatorConnection: {
      host:     testHost,
      port:     restPort,
      user:     restEvaluatorUser,
      password: restEvaluatorPassword,
      authType: restAuthType
    },
    manageAdminConnection: {
        host:     testHost,
        port:     managePort,
        user:     restAdminUser,
        password: restAdminPassword,
        authType: manageAuthType
    },
    // Do NOT disable TLS certificate validation in production.
    // Prefer providing ca with a trusted certificate instead (CWE-295).
    restSslConnection: {
        host:     testHost,
        port:     restPort,
        user:     restAdminUser,
        password: restAdminPassword,
        authType: 'BASIC',
        ssl:      true,
        rejectUnauthorized: strictTlsVerification,
        ca:       fs.readFileSync(path.join(__dirname, '../test-app/src/main/ml-config/self-signed-ca.pem'))
    }
};
