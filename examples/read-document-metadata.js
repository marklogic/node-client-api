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

var db = require('../').createDatabaseClient(exutil.restReaderConnection);

db.read({uris:'/countries/uv.json', categories:['content', 'metadata']}).
  result(function(documents) {
    var document = documents[0];
    console.log(
      document.content.name+': '+(
        document.permissions.map(function(permission) {
          return permission['role-name'];
          }).
        join(', ')
        )
      );
    });
