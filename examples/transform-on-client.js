/*
* Copyright (c) 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/
var exutil = require('./example-util.js');

//a real application would require without the 'exutil.' namespace
var marklogic = exutil.require('marklogic');

var db = marklogic.createDatabaseClient(exutil.restWriterConnection);

var timestamp = (new Date()).toISOString();

console.log('Transform a document on the client');

db.documents.read('/countries/uv.json')
  .result(function(documents) {
    var documentBefore = documents[0];
    console.log('before: '+
        documentBefore.content.name+' on '+
        documentBefore.content.timestamp
        );
    documentBefore.content.timestamp = timestamp;
    return db.documents.write(documentBefore).result();
    })
  .then(function(response) {
    var uri = response.documents[0].uri;
    console.log('modified: '+uri);
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
