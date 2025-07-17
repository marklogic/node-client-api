/*
* Copyright © 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/
var exutil = require('./example-util.js');

// a real application would require without the 'exutil.' namespace
var marklogic = exutil.require('marklogic');

var db = marklogic.createDatabaseClient(exutil.restReaderConnection);

console.log('Read document content and metadata');

db.documents.read({
    uris:['/countries/ml.json', '/countries/uv.json'],
    categories:['content', 'metadata']
    })
  .result(function(documents) {
    console.log('read:\n'+
      documents.
      map(function(document){
        return '    '+document.content.name+': '+(
          document.permissions.
          map(function(permission) {
            return permission['role-name'];
            }).
          join(', ')
          );
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
