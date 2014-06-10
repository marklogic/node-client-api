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
var db = require('../').createDatabaseClient({
  host:     'localhost',
  port:     '8004',
  user:     'rest-writer',
  password: 'x',
  authType: 'DIGEST'
});

console.log('WRITE STREAM in two chunks');

// shortcut for db.documents.createWriteStream(...)
var writableStream = db.createWriteStream({
    uri:         '/tmp/stream1.json',
    contentType: 'application/json'
    });
writableStream.result(function(response) {
    console.log('\nWRITTEN');
    console.log(response);
    });

writableStream.write('{"key1"', 'utf8');
writableStream.write(       ':"value 1"}', 'utf8');
writableStream.end();
