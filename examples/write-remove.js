/*
* Copyright (c) 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/
var exutil = require('./example-util.js');

//a real application would require without the 'exutil.' namespace
var marklogic = exutil.require('marklogic');

var db = marklogic.createDatabaseClient(exutil.restWriterConnection);

console.log('Write two documents');

db.documents.write([
    { uri: '/tmp/eldorado.json',
      category: 'content',
      contentType: 'application/json',
      collections: ['/imaginary/countries', '/vacation/destinations'],
      content: {name:'El Dorado', description:'City of gold'}
      },
    { uri: '/tmp/shangrila.json',
      category: 'content',
      contentType: 'application/json',
      collections: ['/imaginary/countries', '/vacation/destinations'],
      content: {name:'Shangri-La', description:'Valley of harmony'}
      }
    ])
  .result(function(response) {
    console.log('wrote:\n    '+
      response.documents.
      map(function(document) {
        return document.uri;
        }).
      join(', ')
      );
    console.log('done\n');

    var removedByUri        = null;
    var removedByCollection = null;

    console.log('Remove a document by uri');
    db.documents.remove('/tmp/eldorado.json')
    .result(function(response) {
      console.log('Removed the document with uri: '+response.uri);
      removedByUri = isFinishing(removedByCollection);
    })
    .catch(function(error) {
      console.log(JSON.stringify(error));

      exutil.failed();
    });

    console.log('Remove the documents in a collection\n');
    db.documents.removeAll({collection:'/imaginary/countries'}).
    result(function(response) {
      console.log('Removed all documents in the collection: '+response.collection);
      removedByCollection = isFinishing(removedByUri);
    }, function(error) {
      console.log(JSON.stringify(error));

      exutil.failed();
    });
  })
  .catch(function(error) {
    console.log(JSON.stringify(error));

    exutil.failed();
  });

function isFinishing(isDone) {
  if (isDone) {
    console.log('done');

    exutil.succeeded();
  } else {
    return true;
  }
}
