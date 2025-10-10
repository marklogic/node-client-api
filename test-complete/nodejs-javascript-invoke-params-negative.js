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

describe('Javascript invoke params negative test', function () {

    var fsPath = __dirname + '/data/sourceParamsNegative.js';
    var invokePath = '/ext/invokeTest/sourceParamsNegative.sjs';

    before(function (done) {
        this.timeout(10000);
        dbAdmin.config.extlibs.write({
            path: invokePath, contentType: 'application/javascript', source: fs.createReadStream(fsPath)
        }).
            result(function (response) {
                done();
            }, done);
    });

    after(function (done) {
        dbAdmin.config.extlibs.remove(invokePath).
            result(function (response) {
                done();
            }, done);
    });

    it('should fail to do javascript invoke with params', function (done) {
        dbEval.invoke(invokePath, { num1: 2, num2: 3 }).result(function (values) {
            //console.log(values);
            //values[0].value.should.equal(5);
            values.should.equal('SHOULD HAVE FAILED');
            done();
        }, function (error) {
            //console.log(error);
            error.statusCode.should.equal(500);
            error.body.errorResponse.messageCode.should.equal('JS-JAVASCRIPT');
            done();
        });
    });

});
