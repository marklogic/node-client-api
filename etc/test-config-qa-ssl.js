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

// Do NOT use rejectUnauthorized: false in production.
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
    restSslConnection: {
        host:     testHost,
        port:     restPort,
        user:     restAdminUser,
        password: restAdminPassword,
        authType: 'BASIC',
        ssl:      true,
        ca:       SSL_CA
    }
};
