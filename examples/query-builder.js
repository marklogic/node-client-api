/*
* Copyright © 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
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
