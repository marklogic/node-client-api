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
var valcheck = require('core-util-is');

var testlib    = require('./test-lib.js');
var testconfig = require('./test-config.js');

function setupUsers(manager, done) {
  console.log('checking for REST users');
  manager.get({
    endpoint: '/manage/v2/users'
    }).
  result(function(response) {
    var userName = null;

    var requiredUsers = {};
    userName = testconfig.restAdminConnection.user;
    requiredUsers[userName]  = {
      role:        'rest-admin',
      name:        userName,
      description: 'rest-admin user',
      password:    testconfig.restAdminConnection.password
      };
    userName = testconfig.restReaderConnection.user;
    requiredUsers[userName]  = {
      role:        'rest-reader',
      name:        userName,
      description: 'rest-reader user',
      password:    testconfig.restReaderConnection.password
      };
    userName = testconfig.restWriterConnection.user;
    requiredUsers[userName]  = {
      role:        'rest-writer',
      name:        userName,
      description: 'rest-writer user',
      password:    testconfig.restWriterConnection.password
      };

    response.data['user-default-list']['list-items']['list-item'].
    forEach(function(user) {
      userName = user.nameref;
      if (!valcheck.isUndefined(requiredUsers[userName])) {
        requiredUsers[userName] = undefined;
      }
    });

    var missingUsers = Object.keys(requiredUsers).map(function(key) {
      var user = requiredUsers[key];
      if (!valcheck.isUndefined(user)) {
        return user;
      }
    }).
    filter(function(user) {
      return !valcheck.isUndefined(user);
    });

    addUser(manager, missingUsers, 0, done);
  });
}

function addUser(manager, users, next, done) {
  if (next >= users.length) {
    if (next > 0) {
      console.log('finished adding REST users');
    } else {
      console.log('REST users already exist');
    }

    if (!valcheck.isUndefined(done)) {
      done(manager);
    }

    return;
  } else if (next === 0) {
    console.log('adding REST users');
  }

  var userdef = users[next];
  manager.post({
    endpoint: '/manage/v2/users',
    body: {
      name:        userdef.name,
      password:    userdef.password,
      description: userdef.description,
      role:        [
        userdef.role
        ]
      }
    }).
  result(function(response) {
    if (response.statusCode < 400) {
      addUser(manager, users, next + 1, done);
    } else {
      console.log('REST user setup failed with HTTP status: '+response.statusCode);
      console.log(response.data);        
      process.exit();
    }
  });
}

module.exports = setupUsers;
