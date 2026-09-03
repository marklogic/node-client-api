/*
* Copyright (c) 2015-2026 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/
const fs = require('fs');
const path = require('path');

// self-signed-ca.pem is written by the Gradle extractSslCertificate task after mlDeploy.
// It is not committed to the repository. SSL test connections fail gracefully
// (cert verification error) if mlDeploy has not been run yet.
const CA_PATH = path.join(__dirname, '../test-app/src/main/ml-config/self-signed-ca.pem');
const SSL_CA  = fs.existsSync(CA_PATH) ? fs.readFileSync(CA_PATH) : undefined;

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

// Do NOT use rejectUnauthorized: false in production.
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
    restSslConnection: {
        host:     testHost,
        port:     restPort,
        user:     restAdminUser,
        password: restAdminPassword,
        authType: 'BASIC',
        ssl:      true,
        ca:       SSL_CA,
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
    restConnectionForTls: {
        host:     testHost,
        port:     restSslPort,
        user:     restWriterUser,
        password: restWriterPassword,
        authType: restAuthType,
        ssl:      true,
        ca:       SSL_CA
    }
};
