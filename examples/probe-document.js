/*
* Copyright © 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/

var exutil = require('./example-util.js');

//a real application would require without the 'exutil.' namespace
var marklogic = exutil.require('marklogic');

var db = marklogic.createDatabaseClient(exutil.restReaderConnection);

console.log('Probe for whether documents exist');

var files = ['/countries/uv.json', '/does/not/exist.json'];

var finished = 0;
files.forEach(function(uri){
    db.documents.probe(uri)
    .result(function(document) {
        console.log('document at '+uri+' exists: '+document.exists);

        if ((++finished) === files.length) {
          console.log('done');

          exutil.succeeded();
        }
      })
    .catch(function(error) {
        console.log(JSON.stringify(error));

        exutil.failed();
      });
    });
