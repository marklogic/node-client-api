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

var db = require('../').createDatabaseClient(exutil.restWriterConnection);

console.log('WRITE of two documents');

// shortcut for db.documents.write(...)
db.write([
    { uri: '/tmp/doc1.json',
      category: 'content',
      contentType: 'application/json',
      content: {'key1': 'value 1'}
      },
    { uri: '/tmp/doc2.xml',
      category: 'content',
      contentType: 'application/xml',
      content: '<doc>content 2</doc>'
      }
    ]).
  result(function(response) {
    console.log('\nWROTE:\n    '+
        response.documents.
        map(function(document){
          return document.uri;
          }).
        join(', ')
        );
    });
