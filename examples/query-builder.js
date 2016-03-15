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

var qb = marklogic.queryBuilder;

var db = marklogic.createDatabaseClient(exutil.restReaderConnection);

console.log('Query documents with the Query Builder');

db.documents.query(
  qb.where(
    qb.collection('/countries'),
    qb.value('region', 'Africa'),
    qb.or(
      qb.word('background',   'France'),
      qb.word('Legal system', 'French')
      )
    )
  ).
  // or use result() as in query-by-example.js
  stream().
  on('data', function(document) {
    console.log(document.content.name+' at '+document.uri);
    }).
  on('error', function(error) {
    console.log(JSON.stringify(error));

    exutil.failed();
    }).
  on('end', function() {
    console.log('done');

    exutil.succeeded();
    });
