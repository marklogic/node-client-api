/*
 * Copyright 2014 MarkLogic Corporation
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

var host     = 'localhost';
var port     = '8015';
var authType = 'DIGEST';

var restAdminUser     = 'rest-admin';
var restAdminPassword = 'x';

var restReaderUser     = 'rest-reader';
var restReaderPassword = 'x';

var restWriterUser     = 'rest-writer';
var restWriterPassword = 'x';

// For SSL without client cert, use rejectUnauthorized: false
module.exports = {
    restHost:     host,
    restPort:     port,
    restAuthType: authType,
    restAdminConnection:  {
        host:     host,
        port:     port,
        user:     restAdminUser,
        password: restAdminPassword,
        authType: authType
    },
    restReaderConnection: {
        host:     host,
        port:     port,
        user:     restReaderUser,
        password: restReaderPassword,
        authType: authType
    },
    restWriterConnection: {
        host:     host,
        port:     port,
        user:     restWriterUser,
        password: restWriterPassword,
        authType: authType
    }
};
