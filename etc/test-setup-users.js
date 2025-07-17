/*
* Copyright © 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
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
        role: [],
        privilege: []
      }
      }).result();
  }).
  then(function(response) {
    return manager.get({
      endpoint: '/manage/v2/roles/'+encodeURIComponent('tde-User')
    }).result();
  }).
  then(function(response) {
    if (response.statusCode < 400) {
      return this;
    }
    return manager.post({
      endpoint: '/manage/v2/roles',
      body: {
        'role-name': 'tde-User',
        description: 'test user to write tde to modules database',
        role: ['tde-view', 'tde-admin','rest-writer'],
        privilege: [{
          'privilege-name': 'xdmp-eval-in',
          action: 'http://marklogic.com/xdmp/privileges/xdmp-eval-in',
          kind: 'execute'
        }]
      }
    }).result();
  }).
  then(function(response) {
    return manager.get({
      endpoint: '/manage/v2/roles/'+encodeURIComponent('eval')
    }).result();
  }).
  then(function(response) {
    if (response.statusCode < 400) {
      return this;
    }
    return manager.post({
      endpoint: '/manage/v2/roles',
      body: {
        'role-name': 'eval',
        description: 'eval role',
        role: [],
        privilege: [
            {
          'privilege-name': 'xdbc-eval',
          action: 'http://marklogic.com/xdmp/privileges/xdbc-eval',
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
            'privilege-name': 'xdmp-invoke-in',
            action: 'http://marklogic.com/xdmp/privileges/xdmp-invoke-in',
            kind: 'execute'
          },
          {
            'privilege-name': 'xdmp-spawn',
            action: 'http://marklogic.com/xdmp/privileges/xdmp-spawn',
            kind: 'execute'
          },
          {
            'privilege-name': 'xdmp-spawn-in',
            action: 'http://marklogic.com/xdmp/privileges/xdmp-spawn-in',
            kind: 'execute'
          }
        ]
      }
    }).result();
  }).
  then(function(response) {
    return manager.get({
      endpoint: '/manage/v2/roles/'+encodeURIComponent('qbvuser-role')
    }).result();
  }).
  then(function(response) {
    if (response.statusCode < 400) {
      return this;
    }
    return manager.post({
      endpoint: '/manage/v2/roles',
      body: {
        'role-name': 'qbvuser-role',
        description: 'qbvuser role for test-complete tests',
        role: ['tde-view', 'query-view-admin','app-user','eval','harmonized-reader','rest-extension-user','rest-reader','rest-writer','rest-admin','tde-admin','manage-user','sparql-update-user'],
        privilege: [
            {
            'privilege-name': 'any-uri',
            action: 'http://marklogic.com/xdmp/privileges/any-uri',
            kind: 'execute'
          },
          {
            'privilege-name': 'xdmp-eval',
            action: 'http://marklogic.com/xdmp/privileges/xdmp-eval',
            kind: 'execute'
          },
          {
            'privilege-name': 'xdmp-eval-in',
            action: 'http://marklogic.com/xdmp/privileges/xdmp-eval-in',
            kind: 'execute'
          },
          {
            'privilege-name': 'sem-sparql',
            action: 'http://marklogic.com/xdmp/privileges/sem-sparql',
            kind: 'execute'
          },
          {
            'privilege-name': 'xdbc-eval',
            action: 'http://marklogic.com/xdmp/privileges/xdbc-eval',
            kind: 'execute'
          },
          {
            'privilege-name': 'xdbc-invoke',
            action: 'http://marklogic.com/xdmp/privileges/xdbc-invoke',
            kind: 'execute'
          },
          {
            'privilege-name': 'xdmp-sql',
            action: 'http://marklogic.com/xdmp/privileges/xdmp-sql',
            kind: 'execute'
          },
          {
            'privilege-name': 'xdmp-http-get',
            action: 'http://marklogic.com/xdmp/privileges/xdmp-http-get',
            kind: 'execute'
          },
          {
            'privilege-name': 'xdmp-http-post',
            action: 'http://marklogic.com/xdmp/privileges/xdmp-http-post',
            kind: 'execute'
          },
          {
            'privilege-name': 'xdbc-invoke-in',
            action: 'http://marklogic.com/xdmp/privileges/xdbc-invoke-in',
            kind: 'execute'
          },
          {
            'privilege-name': 'xdbc-eval-in',
            action: 'http://marklogic.com/xdmp/privileges/xdbc-eval-in',
            kind: 'execute'
          }
        ]
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
      role:        ['rest-writer','rest-evaluator'],
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
    userName = testconfig.tdeConnection.user;
    requiredUsers[userName]  = {
      role: 'tde-User',
      'user-name': userName,
      description: 'test user to write tde to modules database',
      password:    testconfig.tdeConnection.password
    };
    userName = 'qbvuser';
    requiredUsers[userName]  = {
      role: 'qbvuser-role',
      'user-name': userName,
      description: 'qbvuser for test complete tests.',
      password:    'qbvuser'
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
  console.log(userdef)
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
