/*
* Copyright © 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/
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

// For SSL without client cert, use rejectUnauthorized: false
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
        rejectUnauthorized: false,
        ssl:      true,
        enableGzippedResponses: true
    },
    testConnection: {
        host:     testHost,
        port:     restPort,
        user:     testUser,
        password: testPassword,
        authType: restAuthType,
        rejectUnauthorized: false,
        enableGzippedResponses: true
    },
    tdeConnection: {
        host:     testHost,
        port:     restPort,
        user:     tdeUser,
        password: tdePassword,
        authType: restAuthType,
        rejectUnauthorized: false,
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
        ssl: true,
        rejectUnauthorized: false
    }
};
