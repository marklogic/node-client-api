/*
 * Copyright 2014-2015 MarkLogic Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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