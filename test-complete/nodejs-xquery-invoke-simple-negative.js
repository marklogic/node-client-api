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

describe('Xquery invoke simple negative test', function () {

    var fsPath = __dirname + '/data/sourceSimpleNegative.xqy';
    var invokePath = '/ext/invokeTest/sourceSimpleNegative.xqy';

    before(function (done) {
        this.timeout(10000);
        dbAdmin.config.extlibs.write({
            path: invokePath, contentType: 'application/xquery', source: fs.createReadStream(fsPath)
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

    it('should do simple xquery invoke', function (done) {
        dbEval.invoke(invokePath).result(function (values) {
            //console.log(values);
            values.should.equal('SHOULD HAVE FAILED');
            done();
        }, function (error) {
            //console.log(error);
            error.statusCode.should.equal(500);
            error.body.errorResponse.messageCode.should.equal('XDMP-UNDVAR');
            done();
        });
    });

});
