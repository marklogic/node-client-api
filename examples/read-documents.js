/*
* Copyright © 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/

var exutil = require('./example-util.js');

//a real application would require without the 'exutil.' namespace
var marklogic = exutil.require('marklogic');

var db = marklogic.createDatabaseClient(exutil.restReaderConnection);

console.log('Read documents');

db.documents.read('/countries/ml.json', '/countries/uv.json')
  // or use stream() as in query-builder.js
  .result(function(documents) {
    console.log('read:\n'+
      documents.
      map(function(document){
        return '    '+document.content.name+' at '+document.uri;
        }).
      join('\n')
      );
    console.log('done');

    exutil.succeeded();
    })
  .catch(function(error) {
      console.log(JSON.stringify(error));

      exutil.failed();
    });
