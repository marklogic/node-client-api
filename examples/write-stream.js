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
var fs = require('fs');

var exutil = require('./example-util.js');

// a real application would require without the 'exutil.' namespace
var marklogic = exutil.require('marklogic');

var db = marklogic.createDatabaseClient(exutil.restWriterConnection);

console.log('Write a document from a stream');

var writableStream = db.documents.createWriteStream({
  uri:         '/countries/uv_flag_2004.gif',
  contentType: 'image/gif',
  collections: ['/countries', '/facts/geographic']
  });
writableStream.result(function(response) {
    console.log('wrote '+response.documents[0].uri);
    console.log('done');

    exutil.succeeded();
  }, function(error) {
    console.log(JSON.stringify(error));

    exutil.failed();
  });

fs.createReadStream(exutil.pathToData()+'uv_flag_2004.gif').pipe(writableStream);
