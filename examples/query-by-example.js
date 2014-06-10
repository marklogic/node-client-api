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
var util = require('./util.js');

var marklogic = require('../');
var q = marklogic.queryBuilder;

var db = marklogic.createDatabaseClient({
  host:     'localhost',
  port:     '8004',
  user:     'rest-reader',
  password: 'x',
  authType: 'DIGEST'
});

/* alternative with promise
db.searchBuilder(
    {'$query': {
      'key1': 'value 1'
      },
    '$response': {
      '$snippet': {'$none': {}},
      '$extract': {'key1':  {}}
      }}).
  result(function(response) {
    console.log('matched results:');
    util.logObject(response);
    });
*/

console.log('Query By Example');

db.query(
  q.where(
    q.byExample({
      region:     'Africa',
      background: {$word: 'France'}
      })
    )
  ).result(function(response) {
    response.forEach(function(document) {
      console.log(
        document.content.name+' at '+document.uri
        );
      });
    });
