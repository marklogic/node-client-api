/*
* Copyright (c) 2015-2026 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/
const fs = require('fs');
const path = require('path');
const strictTlsVerification = process.env.ML_TEST_SSL_STRICT === 'true';

let testHost = 'localhost';

let restPort     = '8015';
let restSslPort     = '8017';
let restAuthType = 'DIGEST';

let managePort     = '8002';
let manageAuthType = 'DIGEST';

let restAdminUser     = 'rest-admin';
let restAdminPassword = 'x';

let restReaderUser     = 'rest-reader';
var restReaderPassword = 'x';

let restWriterUser     = 'rest-writer';
let restWriterPassword = 'x';

let restEvaluatorUser     = 'rest-evaluator';
let restEvaluatorPassword = 'x';

let restTemporalUser     = 'rest-temporal-writer';
let restTemporalPassword = 'x';

let testServerName = 'unittest-nodeapi';

let testUser = 'test-user';
let testPassword = 'x';

let tdeUser = 'tde-user';
let tdePassword = 'x';

// Do NOT disable TLS certificate verification in production.
// Prefer providing ca with a trusted certificate instead (CWE-295).
module.exports = {
    testServerName: testServerName,
    testHost:       testHost,
    restPort:       restPort,
    authType:       restAuthType,
    restAdminConnection: {
        host:     testHost,
        port:     restPort,
        user:     restAdminUser,
        password: restAdminPassword,
        authType: restAuthType,
        enableGzippedResponses: true
    },
    restReaderConnection: {
        host:     testHost,
        port:     restPort,
        user:     restReaderUser,
        password: restReaderPassword,
        authType: restAuthType,
        enableGzippedResponses: true
    },
    restWriterConnection: {
        host:     testHost,
        port:     restPort,
        user:     restWriterUser,
        password: restWriterPassword,
        authType: restAuthType,
        enableGzippedResponses: true
    },
    restEvaluatorConnection: {
      host:     testHost,
      port:     restPort,
      user:     restEvaluatorUser,
      password: restEvaluatorPassword,
      authType: restAuthType,
      enableGzippedResponses: true
    },
    restTemporalConnection: {
      host:     testHost,
      port:     restPort,
      user:     restTemporalUser,
      password: restTemporalPassword,
      authType: restAuthType,
      enableGzippedResponses: true
    },
    manageAdminConnection: {
        host:     testHost,
        port:     managePort,
        user:     restAdminUser,
        password: restAdminPassword,
        authType: manageAuthType,
        enableGzippedResponses: true
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
        ca:       fs.readFileSync(path.join(__dirname, '../test-app/src/main/ml-config/self-signed-ca.pem')),
        enableGzippedResponses: true
    },
    testConnection: {
        host:     testHost,
        port:     restPort,
        user:     testUser,
        password: testPassword,
        authType: restAuthType,
        enableGzippedResponses: true
    },
    tdeConnection: {
        host:     testHost,
        port:     restPort,
        user:     tdeUser,
        password: tdePassword,
        authType: restAuthType,
        enableGzippedResponses: true
    },
    restWriterConnectionWithBasePath: {
        host:     testHost,
        port:     restPort,
        user:     restWriterUser,
        password: restWriterPassword,
        authType: restAuthType,
        basePath: '',
        enableGzippedResponses: true
    },
    restWriterConnectionWithSsl: {
        host:     testHost,
        port:     restPort,
        user:     restWriterUser,
        password: restWriterPassword,
        authType: restAuthType,
        enableGzippedResponses: true,
        ssl: true
    },
    restConnectionForOauth: {
        host:     testHost,
        port:     restPort,
        authType: 'oauth'
    },
    // Do NOT disable TLS certificate validation in production.
    // Prefer providing ca with a trusted certificate instead (CWE-295).
    restConnectionForTls: {
        host:     testHost,
        port:     restSslPort,
        user:     restWriterUser,
        password: restWriterPassword,
        authType: restAuthType,
        ssl: true,
        rejectUnauthorized: strictTlsVerification,
        ca:       fs.readFileSync(path.join(__dirname, '../test-app/src/main/ml-config/self-signed-ca.pem'))
    }
};
