/*
 * Copyright 2014 MarkLogic Corporation
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

var marklogic = require('../');

var db = marklogic.createDatabaseClient(exutil.restWriterConnection);

console.log('Write two documents');

db.write([
    { uri: '/tmp/eldorado.json',
      category: 'content',
      contentType: 'application/json',
      collections: ['/imaginary/countries', '/vacation/destinations'],
      content: {name:'El Dorado', description:'City of gold'}
      },
    { uri: '/tmp/shangrila.xml',
      category: 'content',
      contentType: 'application/json',
      collections: ['/imaginary/countries', '/vacation/destinations'],
      content: {name:'Shangri-La', description:'Valley of harmony'}
      }
    ]).
  result(function(response) {
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
    db.remove('/tmp/eldorado.json').
    result(function(response) {
      console.log('Removed the document with uri: '+response.uri);
      removedByUri = isFinishing(removedByCollection);
    }, function(error) {
      exutil.failed(error);
    });

    console.log('Remove the documents in a collection\n');
    db.removeAll({collections:'/imaginary/countries'}).
    result(function(response) {
      console.log('Removed all documents in the collection: '+response.collections);
      removedByCollection = isFinishing(removedByUri);
    }, function(error) {
      exutil.failed(error);
    });
  }, function(error) {
    exutil.failed(error);
  });

function isFinishing(isDone) {
  if (isDone) {
    exutil.succeeded();
  } else {
    return true;
  }
}