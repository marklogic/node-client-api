'use strict';

var util = require('util');

var fs = require('fs');

var marklogic = require('marklogic');
var testlib   = require('./testlib.js');

var clientConnectdef = require('./connectdef.js');
var testName         = clientConnectdef.name;
var planServerdef    = clientConnectdef.plan;

var testLoad = require('./loaddata.js');
var testUser = require('./userconfig.js'); 

var db = marklogic.createDatabaseClient({
  host:     planServerdef.host,
  port:     planServerdef.port,
  user:     'admin',
  password: 'admin',
  authType: planServerdef.authType
});

testLoad.writeDocuments(db);
