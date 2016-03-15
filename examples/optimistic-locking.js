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

var pb = marklogic.patchBuilder;

var dbAdmin = marklogic.createDatabaseClient(exutil.restAdminConnection);

var db = marklogic.createDatabaseClient(exutil.restWriterConnection);

var timestamp = (new Date()).toISOString();

var uri        = '/countries/uv.json';
var operations = [
    pb.pathLanguage('jsonpath'),
    pb.replaceInsert('$.timestamp', '$.name', 'after', timestamp)
    ];

console.log('configure the server to enforce optimistic locking');
// a one-time administrative action
dbAdmin.config.serverprops.write({
    'update-policy': 'version-required'
    })
  .result(function(response) {
    console.log(
        'try to update a value in the content to '+
        timestamp+'\n    without passing the document version id');
    db.documents.patch({
      uri:        uri,
      operations: operations
      // versionId not specified
      })
    .result(function(success) {
        console.log('should never execute');
        })
    .catch(function(failure) {
        console.log('expected failure for the update without the version id');

        console.log('get the current version id for the document');
        db.documents.probe(uri)
          .result(function(document){
            console.log(
                'try to update the document passing the version id '+document.versionId);
            return db.documents.patch({
              uri:        uri,
              operations: operations,
              versionId:  document.versionId
              }).result();
            })
          .then(function(response){
            console.log('update succeeded with the version id');

            console.log('get the new version id for the updated document');
            return db.documents.read(uri).result();
            })
          .then(function(documents) {
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
            })
          .then(function(response) {
            console.log('done');

            exutil.succeeded();
            })
          .catch(function(error) {
            console.log(JSON.stringify(error));

            exutil.failed();
            });
        });
    })
  .catch(function(error) {
    console.log(JSON.stringify(error));

    exutil.failed();
    });
