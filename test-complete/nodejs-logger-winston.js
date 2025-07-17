/*
* Copyright © 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/
var should = require('should');
var winston = require('winston');

var testconfig = require('../etc/test-config-qa.js');
var fs = require('fs');

var marklogic = require('../');

var db = marklogic.createDatabaseClient(testconfig.restReaderConnection);
var dbWriter = marklogic.createDatabaseClient(testconfig.restWriterConnection);
var dbEval = marklogic.createDatabaseClient(testconfig.restEvaluatorConnection);
var dbAdmin = marklogic.createDatabaseClient(testconfig.restAdminConnection);

describe('Winston logger test', function () {

    winston.level = 'debug';
    dbAdmin.setLogger(winston);

    it('should read the bunyan logger', function (done) {
        dbAdmin.config.serverprops.read().result(function (response) {
            //var log = JSON.stringify(response);
            //console.log(log);
            //log.should.containEql('testlog');
            done();
        }, done);
    });

});
