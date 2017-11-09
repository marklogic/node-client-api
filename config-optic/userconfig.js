'use strict';

function addRestEvalRole(manager) {
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
            'privilege-name': 'admin-module-read',
            action: 'http://marklogic.com/xdmp/privileges/admin-module-read',
            kind: 'execute'
          },
          {
            'privilege-name': 'admin-module-write',
            action: 'http://marklogic.com/xdmp/privileges/admin-module-write',
            kind: 'execute'
          },
          {
            'privilege-name': 'unprotected-collections',
            action: 'http://marklogic.com/xdmp/privileges/unprotected-collections',
            kind: 'execute'
          }
        ]
      }
    });
}

function addRestEvalUser(manager) {
  return manager.post({
    endpoint: '/manage/v2/users',
      body: {
        'user-name': 'rest-evaluator',
        password: 'x',
        description: 'rest-evaluator user',
        role: [
          'rest-evaluator'
        ]
      }
  });
}

function addRestReaderUser(manager) {
  return manager.post({
    endpoint: '/manage/v2/users',
      body: {
        'user-name': 'rest-reader-optic',
        password: 'x',
        description: 'rest-reader user',
        role: [
          'rest-reader'
        ]
      }
  });
}

module.exports = {
  addRestEvalRole: addRestEvalRole,
  addRestEvalUser: addRestEvalUser,
  addRestReaderUser: addRestReaderUser
};
