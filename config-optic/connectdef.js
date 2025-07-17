/*
* Copyright © 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/
'use strict';

var name = 'nodeOpticFunctionalTest';

var plan = {
  host:     'localhost',
  port:     8079,
  user:     'admin',
  password: 'admin',
  authType: 'DIGEST'
};

module.exports = {
    name: name,
    plan: plan
};
