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
var q = marklogic.queryBuilder;

var db = marklogic.createDatabaseClient(exutil.restReaderConnection);

console.log('SEARCH Query Builder');

db.query(
  q.where(
    q.or(
      q.value('key1', 'value 1'),
      q.value(q.element('doc'), 'content 1')
      )
    )
  ).
  stream().
  on('summary', function(summary) {
    console.log('matched results summary:');
    exutil.logObject(summary);
    }).
  on('result', function(document) {
    console.log('matched document content for '+document.uri+':');
    exutil.logObject(document.content);
    }).
  on('end', function() {
    console.log('\nFOUND');
    });
