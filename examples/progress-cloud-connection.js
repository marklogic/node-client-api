/*
 * Copyright (c) 2023 MarkLogic Corporation
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

/* This file provides an example for the users to help them connect to Progress cloud using the apiKey and host
and writes a document in database - Documents */

const marklogic = require('../');

const db = marklogic.createDatabaseClient({
    // The below key-value pairs are required
    apiKey:     'changeme',
    host:     'example.beta.progress.com',
    authType: 'cloud',
    // basePath is optional.
    basePath: '/progress/marklogic/test',
    // accessTokenDuration (in seconds) is optional and can be used to customize the expiration of the access token.
    accessTokenDuration: 10
});

const writeObject = {
    uri: '/write/string1.json',
    contentType: 'application/json',
    content: '{"key1":"value 1"}'
};
db.documents.write(writeObject)
    .result(function(){})
    .then(function() {
        marklogic.releaseClient(db);
    })
    .catch(err => {throw new Error(err);});
