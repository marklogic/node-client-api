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

db.query(
  q.where(
    q.directory('/countries/'),
    q.value('region', 'Africa'),
    q.or(
        q.word('background', 'France'),
        q.word('Legal system', 'French')
        )
    )
  ).result(function(response) {
    console.log(
      response.
      map(function(document) {
        return document.content.name;
        }).
      join(', ')
      );
    });
