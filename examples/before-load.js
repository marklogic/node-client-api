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
var fs = require('fs');

var marklogic = require('../');

var exutil = require('./example-util.js');

var db = marklogic.createDatabaseClient(exutil.restWriterConnection);

var fsdir = 'examples/data/';
var dbdir = '/countries/';

var batchSize = 100;

var collections = ['/countries', '/facts/geographic'];

function readFile(filenames, i, buffer, isLast) {
  var filename = filenames[i];
  fs.readFile(fsdir+filename, function (err, content) {
    if (err) {
      throw err;
    }

    buffer.push({
      uri:         dbdir+filename,
      category:    'content',
      contentType: 'application/json',
      collections: collections,
      content:     content.toString()
      });

    if (isLast) {
      console.log('loading batch from '+buffer[0].uri+' to '+filename);
      db.documents.write(buffer).result(function(response) {
        console.log(
            'done loading:\n'+
            response.documents.map(function(document) {
              return document.uri;
              }).join(', ')+'\n'
            );
        writeBatch(filenames, i + 1);
      });
    }
  });
}

function writeBatch(filenames, batchFirst) {
  if (batchFirst >= filenames.length) {
    console.log('done loading example data to '+exutil.restWriterConnection.port);
    return;
  }

  var batchLast = Math.min(batchFirst + batchSize, filenames.length) - 1;

  var buffer = [];
  for (var i=batchFirst; i <= batchLast; i++) {
    readFile(filenames, i, buffer, (i === batchLast));
  }
}

console.log('loading example data to '+exutil.restWriterConnection.port+'\n');

fs.readdir(fsdir, function(err, filenames) {
  if (err) {
    throw err;
  }

  var jsonFilenames = filenames.filter(function(filename) {
    return filename.match(/\.json$/);
  });

  writeBatch(jsonFilenames, 0);
});

var imageFile = 'uv_flag_2004.gif';
var ws = db.documents.write({
  uri:         dbdir+imageFile,
  contentType: 'image/gif',
  collections: collections,
  content:     fs.createReadStream(fsdir+imageFile)
  }).
result(function(response) {
  console.log('wrote '+imageFile);
  });
