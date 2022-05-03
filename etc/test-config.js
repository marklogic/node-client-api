/*
 * Copyright (c) 2020 MarkLogic Corporation
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
let testHost = 'localhost';

let restPort     = '8015';
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
    restSslConnection: {
        host:     testHost,
        port:     restPort,
        user:     restAdminUser,
        password: restAdminPassword,
        authType: 'BASIC',
        rejectUnauthorized: false,
        ssl:      true
    },
    testConnection: {
        host:     testHost,
        port:     restPort,
        user:     testUser,
        password: testPassword,
        authType: restAuthType,
        rejectUnauthorized: false
    },
    tdeConnection: {
        host:     testHost,
        port:     restPort,
        user:     tdeUser,
        password: tdePassword,
        authType: restAuthType,
        rejectUnauthorized: false
    }
};
