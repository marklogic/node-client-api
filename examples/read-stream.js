/*
* Copyright © 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/
var exutil = require('./example-util.js');

//a real application would require without the 'exutil.' namespace
var marklogic = exutil.require('marklogic');

var db = marklogic.createDatabaseClient(exutil.restReaderConnection);

console.log('Read a chunked stream for a binary document');

var chunks = 0;
var length = 0;
db.documents.read('/countries/uv_flag_2004.gif').stream('chunked').
  on('data', function(chunk) {
    chunks++;
    length += chunk.length;
    }).
  on('error', function(error) {
    console.log(JSON.stringify(error));

    exutil.failed();
    }).
  on('end', function() {
    console.log('read '+chunks+' chunks of '+length+' length');
    console.log('done');

    exutil.succeeded();
    });
