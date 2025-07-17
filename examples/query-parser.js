/*
* Copyright © 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/
var exutil = require('./example-util.js');

//a real application would require without the 'exutil.' namespace
var marklogic = exutil.require('marklogic');

var qb = marklogic.queryBuilder;

var db = marklogic.createDatabaseClient(exutil.restReaderConnection);

console.log('Query documents with the Query Parser');

db.documents.query(
  qb.where(
    qb.parsedFrom('location:Africa about:France',
      qb.parseBindings(
        qb.value('region',    qb.bind('location')),
        qb.word('background', qb.bind('about'))
        ))
    ))
  // or use stream() as in query-builder.js
  .result(function(documents) {
    documents.forEach(function(document) {
      console.log(
        document.content.name+' at '+document.uri
        );
      });
    console.log('done');

    exutil.succeeded();
    })
  .catch(function(error) {
      console.log(JSON.stringify(error));

      exutil.failed();
    });
