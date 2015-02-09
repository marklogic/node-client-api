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

console.log('Extract fragments from queried documents');

db.documents.query(
  qb.where(
    qb.collection('/countries'),
    qb.value('region', 'Africa'),
    qb.word('exportPartners', 'Niger')
    )
  .slice(1, 10,
    qb.extract({
      selected:'include-with-ancestors',
      paths:[
        '/node("name")',
        '//node("total")[node("unit") eq "years"]'
        ]
      })
    ))
  .result(function (documents){
    documents.forEach(function(document) {
      console.log(
        JSON.stringify(document.content)
        );
      });
    console.log('done');

    exutil.succeeded();
    })
  .catch(function(error) {
    console.log(JSON.stringify(error));

    exutil.failed();
    });
