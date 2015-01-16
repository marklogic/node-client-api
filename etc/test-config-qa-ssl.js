/*
 * Copyright 2014-2015 MarkLogic Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
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

// For SSL without client cert, use rejectUnauthorized: false
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
        rejectUnauthorized: false,
        ssl:      true
    }
};
