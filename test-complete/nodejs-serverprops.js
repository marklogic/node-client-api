/*
* Copyright (c) 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/
var should = require('should');

var testconfig = require('../etc/test-config-qa.js');
var fs = require('fs');

var marklogic = require('../');

var db = marklogic.createDatabaseClient(testconfig.restReaderConnection);
var dbWriter = marklogic.createDatabaseClient(testconfig.restWriterConnection);
var dbEval = marklogic.createDatabaseClient(testconfig.restEvaluatorConnection);
var dbAdmin = marklogic.createDatabaseClient(testconfig.restAdminConnection);

describe('Server props test', function () {

    it('should read server props', function (done) {
        dbAdmin.config.serverprops.read().result(function (values) {
            //console.log(values);
            values.debug.should.equal(false);
            done();
        }, done);
    });

    it('should write server props', function (done) {
        dbAdmin.config.serverprops.write({ debug: true }).
            result(function (values) {
                done();
            }, done);
    });

    it('should read server props after changing it', function (done) {
        dbAdmin.config.serverprops.read().result(function (values) {
            //console.log(values);
            values.debug.should.equal(true);
            done();
        }, done);
    });

    it('should change back the server props', function (done) {
        dbAdmin.config.serverprops.write({ debug: false }).
            result(function (values) {
                done();
            }, done);
    });

});
