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
var restAdminConnection = {
    host:     'localhost',
    port:     '8015',
    user:     'rest-admin',
    password: 'x',
    authType: 'DIGEST'
};
var restReaderConnection = {
    host:     'localhost',
    port:     '8015',
    user:     'rest-reader',
    password: 'x',
    authType: 'DIGEST'
};
var restWriterConnection = {
    host:     'localhost',
    port:     '8015',
    user:     'rest-writer',
    password: 'x',
    authType: 'DIGEST'
};

function logObject(object) {
  if (!object)
    return;

  if (object.data) {
    var data = object.data;
    console.log(data);
/*
    if (object.format === 'json' ||
        object.contentType.match(/^(application|text)\/([^+]+\+)?json$/)) {
      console.log(JSON.parse(data));
    } else {
      console.log(data);
    }
*/
  } else {
    console.log(object);
  } 
};

module.exports = {
    restAdminConnection:  restAdminConnection,
    restReaderConnection: restReaderConnection,
    restWriterConnection: restWriterConnection,
    logObject:            logObject
};
