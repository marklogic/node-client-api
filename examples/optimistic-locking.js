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

var p = marklogic.patchBuilder;

var dbAdmin = marklogic.createDatabaseClient(exutil.restAdminConnection);

var db = marklogic.createDatabaseClient(exutil.restWriterConnection);

var timestamp = (new Date()).toISOString();

var uri        = '/countries/uv.json';
var operations = [
    p.pathLanguage('jsonpath'),
    p.replaceInsert('$.timestamp', '$.name', 'after', {timestamp: timestamp})
    ];

console.log('configure the server to enforce optimistic locking');
// a one-time administrative action
dbAdmin.config.serverprops.write({
    'update-policy': 'version-required'
  }).
  result(function(response) {
    console.log(
        'try to update a value in the content to '+
        timestamp+'\n    without passing the document version id');
    // suppress the error for this demo
    db.setLogger({console:false});
    db.patch({
      uri:        uri,
      operations: operations
      // versionId not specified
      }).result(
        function(success) {
          console.log('should never execute');
        },
        function(failure) {
          console.log('expected failure for the update without the version id');
          db.setLogger({console:true});

          console.log('get the current version id for the document');
          db.check(uri).result().
          then(function(document){
            console.log(
                'try to update the document passing the version id '+document.versionId);
            return db.patch({
              uri:        uri,
              operations: operations,
              versionId:  document.versionId
              }).result();
            }).
          then(function(response){
            console.log('update succeeded with the version id');

            console.log('get the new version id for the updated document');
            return db.read(uri).result();
            }).
          then(function(documents) {
            var document = documents[0];
            console.log(
                'the document has the new version id '+document.versionId+
                '\n    and the content has an updated value of '+
                document.content.timestamp
              );

            // reconfigure the server to turn off optimistic locking
            return dbAdmin.config.serverprops.write({
              'update-policy': 'merge-metadata'
                }).result();
            }).
          then(function(response){
            exutil.succeeded();
          }, function(error) {
            exutil.failed(error);
            });
        });
  }, function(error) {
    exutil.failed(error);
  });
