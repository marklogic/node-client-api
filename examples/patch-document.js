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

var pb = marklogic.patchBuilder;

var db = marklogic.createDatabaseClient(exutil.restWriterConnection);

var timestamp = (new Date()).toISOString();

console.log('Update a document with a patch');

db.documents.patch('/countries/uv.json',
    pb.pathLanguage('jsonpath'),
    pb.replace('$.timestamp', timestamp)
    )
  .result(function(response) {
    var uri = response.uri;
    console.log('updated: '+uri);
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
