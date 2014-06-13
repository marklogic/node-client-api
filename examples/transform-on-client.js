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
var exutil = require('./example-util.js');

var marklogic = require('../');

var db = marklogic.createDatabaseClient(exutil.restWriterConnection);

var timestamp = (new Date()).toISOString();

db.read('/countries/uv.json').
  result(function(documentBefore) {
    documentBefore.content.timestamp = timestamp;
    return db.write(documentBefore).result();
    }).
  then(function(response) {
    var uri = response.documents[0].uri;
    return db.read(uri).result();
  }).
  then(function(documentAfter) {
    console.log(
      documentAfter.content.name+' on '+
      documentAfter.content.timestamp
      );
    }).
  then(null, function(error) {
    console.log(error.toString());
    });
