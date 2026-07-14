/*
* Copyright (c) 2015-2026 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/
const fs = require('fs');
const path = require('path');
const strictTlsVerification = process.env.ML_TEST_SSL_STRICT === 'true';

var testHost = 'localhost';

var restPort     = '8024';
var dmsdkrestPort     = '8025';
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

var restTemporalUser     = 'rest-temporal-writer';
var restTemporalPassword = 'x';

var configAdminUser     = 'admin';
var configAdminPassword = 'admin';

var testServerName = 'node-client-api-rest-server';
var dmsdktestServerName = 'dmsdk-api-rest-server';

// Do NOT disable TLS certificate validation in production.
// Prefer providing ca with a trusted certificate instead (CWE-295).
module.exports = {
    testServerName: testServerName,
    testHost:       testHost,
    restPort:       restPort,
    dmsdktestServerName: dmsdktestServerName,
    dmsdkrestPort:  dmsdkrestPort,
    restAdminConnection: {
        host:     testHost,
        port:     restPort,
        user:     restAdminUser,
        password: restAdminPassword,
        authType: restAuthType
    },
    dmsdkrestAdminConnection: {
        host:     testHost,
        port:     dmsdkrestPort,
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
    dmsdkrestReaderConnection: {
        host:     testHost,
        port:     dmsdkrestPort,
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
    dmsdkrestWriterConnection: {
        host:     testHost,
        port:     dmsdkrestPort,
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
    restTemporalConnection: {
      host:     testHost,
      port:     restPort,
      user:     restTemporalUser,
      password: restTemporalPassword,
      authType: restAuthType
    },
    manageAdminConnection: {
        host:     testHost,
        port:     managePort,
        user:     restAdminUser,
        password: restAdminPassword,
        authType: manageAuthType
    },
    configAdminConnection: {
        host:     testHost,
        port:     restPort,
        user:     configAdminUser,
        password: configAdminPassword,
        authType: restAuthType
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
