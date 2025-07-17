/*
* Copyright © 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/
var fs = require('fs');

var exutil = require('./example-util.js');

// a real application would require without the 'exutil.' namespace
var marklogic = exutil.require('marklogic');

var db = marklogic.createDatabaseClient(exutil.restWriterConnection);

console.log('Write a document from a stream');

var writableStream = db.documents.createWriteStream({
  uri:         '/countries/uv_flag_2004.gif',
  contentType: 'image/gif',
  collections: ['/countries', '/facts/geographic']
  });
writableStream.result(function(response) {
    console.log('wrote '+response.documents[0].uri);
    console.log('done');

    exutil.succeeded();
  }, function(error) {
    console.log(JSON.stringify(error));

    exutil.failed();
  });

fs.createReadStream(exutil.pathToData()+'uv_flag_2004.gif').pipe(writableStream);
