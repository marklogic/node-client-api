/*
 * Copyright 2014-2019 MarkLogic Corporation
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
var PromisePlus  = require('../lib/bluebird-plus.js');

var marklogic = require('../');

var exutil = require('./example-util.js');

var testconfig = require('../etc/test-config.js');

var db = marklogic.createDatabaseClient(exutil.restWriterConnection);

var fsdir = 'examples/data/';
var dbdir = '/countries/';

var batchSize = 100;
var files = [];

var collections = ['/countries', '/facts/geographic'];

function readFile(filenames, i, buffer, isLast) {
  var filename = filenames[i];

  files.push(new PromisePlus((resolve, reject) => {
    fs.readFile(fsdir+filename, function (err, content) {
      if (err) {
        throw err;
      }
      var document = ({
        uri:         dbdir+filename,
        category:    'content',
        contentType: 'application/json',
        collections: collections,
        content:     content.toString()
        });
      resolve(document);
    })
  }));

  if (isLast) {
    PromisePlus.all(files).then(function(documents) {
      console.log('loading batch from '+documents[0].uri+' to '+filename);
      db.documents.write(documents).result(function(response) {
        console.log(
            'done loading:\n'+
            response.documents.map(function(document) {
              return document.uri;
              }).join(', ')+'\n'
            );
        writeBatch(filenames, i + 1);
      });
    });
    files = [];
  }

};

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

// Write TDE template to Schemas database
console.log('copy TDE template');
const schemaDb = marklogic.createDatabaseClient({
  database: 'Schemas',
  host:     testconfig.manageAdminConnection.host,
  port:     testconfig.manageAdminConnection.port,
  user:     testconfig.manageAdminConnection.user,
  password: testconfig.manageAdminConnection.password,
  authType: testconfig.manageAdminConnection.authType
  });
schemaDb.documents.write({
    uri:'/examples/data/countries.tdej',
    contentType:'application/json',
    collections:['http://marklogic.com/xdmp/tde'],
    permissions: [
      {'role-name':testconfig.restAdminConnection.user,
       capabilities:['read', 'execute', 'update']}
    ],
    content:fs.createReadStream(fsdir+'countries.tdej')
  })
  .result(function(response) {
    console.log('template written');
  })
  .catch(function (error) {
    console.log(error);
  });
