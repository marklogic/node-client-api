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
var exutil = require('./example-util.js');

//a real application would require without the 'exutil.' namespace
var marklogic = exutil.require('marklogic');

var db = marklogic.createDatabaseClient(exutil.restWriterConnection);

var timestamp = (new Date()).toISOString();

console.log('Transform a document on the client');

db.documents.read('/countries/uv.json')
  .result(function(documents) {
    var documentBefore = documents[0];
    console.log('before: '+
        documentBefore.content.name+' on '+
        documentBefore.content.timestamp
        );
    documentBefore.content.timestamp = timestamp;
    return db.documents.write(documentBefore).result();
    })
  .then(function(response) {
    var uri = response.documents[0].uri;
    console.log('modified: '+uri);
    return db.documents.read(uri).result();
    })
  .then(function(documents) {
    var documentAfter = documents[0];
    console.log('after: '+
      documentAfter.content.name+' on '+
      documentAfter.content.timestamp
      );
    console.log('done');

    exutil.succeeded();
    })
  .catch(function(error) {
    console.log(JSON.stringify(error));

    exutil.failed();
    });
