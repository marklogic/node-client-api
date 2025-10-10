/*
* Copyright (c) 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/
var exutil = require('./example-util.js');

//a real application would require without the 'exutil.' namespace
var marklogic = exutil.require('marklogic');

var pb = marklogic.patchBuilder;

var db = marklogic.createDatabaseClient(exutil.restWriterConnection);

var timestamp = (new Date()).toISOString();

console.log('Update a document with a patch');

db.documents.patch('/countries/uv.json',
    pb.pathLanguage('jsonpath'),
    pb.replace('$.timestamp', timestamp)
    )
  .result(function(response) {
    var uri = response.uri;
    console.log('updated: '+uri);
    return db.documents.read(uri).result();
    })
  .then(function(documents) {
    var documentAfter = documents[0];
    console.log('after: '+
      documentAfter.content.name+' on '+
      documentAfter.content.timestamp
      );
    console.log('done');

    exutil.succeeded();
    })
  .catch(function(error) {
    console.log(JSON.stringify(error));

    exutil.failed();
    });
