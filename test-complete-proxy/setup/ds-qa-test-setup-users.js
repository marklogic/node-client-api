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
var valcheck = require('core-util-is');

var testlib    = require('./test-lib.js');
var testconfig = require('./test-config.js');

function setupUsers(manager, done) {
  console.log('checking for REST users');
  manager.get({
    endpoint: '/manage/v2/roles/'+encodeURIComponent('rest-evaluator')
    }).result().
  then(function(response) {
    if (response.statusCode < 400) {
      return this;
    }
    return manager.post({
      endpoint: '/manage/v2/roles',
      body: {
        'role-name': 'rest-evaluator',
        description: 'REST writer who can eval, invoke, or set a dynamic databases',
        role: [
          'rest-writer'
        ],
        privilege: [
          {
            'privilege-name': 'xdmp-eval',
            action: 'http://marklogic.com/xdmp/privileges/xdmp-eval',
            kind: 'execute'
          },
		  {
            'privilege-name': 'xdmp-value',
            action: 'http://marklogic.com/xdmp/privileges/xdmp-value',
            kind: 'execute'
          },
          {
            'privilege-name': 'xdmp-eval-in',
            action: 'http://marklogic.com/xdmp/privileges/xdmp-eval-in',
            kind: 'execute'
          },
          {
            'privilege-name': 'xdmp-invoke',
            action: 'http://marklogic.com/xdmp/privileges/xdmp-invoke',
            kind: 'execute'
          },
          {
            'privilege-name': 'xdbc-eval',
            action: 'http://marklogic.com/xdmp/privileges/xdbc-eval',
            kind: 'execute'
          },
          {
            'privilege-name': 'xdbc-eval-in',
            action: 'http://marklogic.com/xdmp/privileges/xdbc-eval-in',
            kind: 'execute'
          },
          {
            'privilege-name': 'xdbc-invoke',
            action: 'http://marklogic.com/xdmp/privileges/xdbc-invoke',
            kind: 'execute'
          },
          {
            'privilege-name': 'any-uri',
            action: 'http://marklogic.com/xdmp/privileges/any-uri',
            kind: 'execute'
          },
		  {
            'privilege-name': 'xdmp-set-session-field',
            action: 'http://marklogic.com/xdmp/privileges/xdmp-set-session-field',
            kind: 'execute'
          },
		  {
            'privilege-name': 'xdmp-get-session-field',
            action: 'http://marklogic.com/xdmp/privileges/xdmp-get-session-field',
            kind: 'execute'
          }
        ]
      }
      }).result();
  }).
  then(function(response) {
    return manager.get({
      endpoint: '/manage/v2/roles/'+encodeURIComponent('rest-temporal-writer')
      }).result();
  }).
  then(function(response) {
    if (response.statusCode < 400) {
      return this;
    }
    return manager.post({
      endpoint: '/manage/v2/roles',
      body: {
        'role-name': 'rest-temporal-writer',
        description: 'REST writer with temporal privileges',
        role: [
          'rest-writer'
        ],
        privilege: [
          {
            'privilege-name': 'temporal-statement-set-system-time',
            action: 'http://marklogic.com/xdmp/privileges/temporal-statement-set-system-time',
            kind: 'execute'
          },
          {
            'privilege-name': 'temporal-document-protect',
            action: 'http://marklogic.com/xdmp/privileges/temporal-document-protect',
            kind: 'execute'
          },
          {
            'privilege-name': 'temporal-document-wipe',
            action: 'http://marklogic.com/xdmp/privileges/temporal-document-wipe',
            kind: 'execute'
          }
        ]
      }
      }).result();
  }).
  then(function(response) {
    return manager.get({
      endpoint: '/manage/v2/roles/'+encodeURIComponent('test-User')
      }).result();
  }).
  then(function(response) {
    if (response.statusCode < 400) {
      return this;
    }
    return manager.post({
      endpoint: '/manage/v2/roles',
      body: {
        'role-name': 'test-User',
        description: 'test user to check the connection',
        role: [
          'test-User'
        ],
        privilege: []
      }
      }).result();
  }).
  then(function(response) {
    return manager.get({
      endpoint: '/manage/v2/users'
      }).result();
  }).
  then(function(response) {
    var userName = null;

    var requiredUsers = {};
    userName = testconfig.restAdminConnection.user;
    requiredUsers[userName]  = {
      role:        'rest-admin',
      'user-name': userName,
      description: 'rest-admin user',
      password:    testconfig.restAdminConnection.password
      };
    userName = testconfig.restReaderConnection.user;
    requiredUsers[userName]  = {
      role:        'rest-reader',
      'user-name': userName,
      description: 'rest-reader user',
      password:    testconfig.restReaderConnection.password
      };
    userName = testconfig.restWriterConnection.user;
    requiredUsers[userName]  = {
      role:        'rest-writer',
      'user-name': userName,
      description: 'rest-writer user',
      password:    testconfig.restWriterConnection.password
      };
    userName = testconfig.restEvaluatorConnection.user;
    requiredUsers[userName]  = {
      role:        'rest-evaluator',
      'user-name': userName,
      description: 'rest-writer user with evaluate privileges',
      password:    testconfig.restEvaluatorConnection.password
      };
    userName = testconfig.restTemporalConnection.user;
    requiredUsers[userName]  = {
      role:        'rest-temporal-writer',
      'user-name': userName,
      description: 'rest-writer user with temporal privileges',
      password:    testconfig.restTemporalConnection.password
      };
      userName = testconfig.testConnection.user;
    requiredUsers[userName]  = {
     role: 'test-User',
      'user-name': userName,
      description: 'test user to check the connection',
      password:    testconfig.testConnection.password
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
      'user-name': userdef['user-name'],
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
