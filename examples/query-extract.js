/*
* Copyright © 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
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
