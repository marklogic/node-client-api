/*
* Copyright © 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/
var should = require('should');

var testconfig = require('../etc/test-config-qa.js');
var fs = require('fs');

var marklogic = require('../');

var db = marklogic.createDatabaseClient(testconfig.restReaderConnection);
var dbWriter = marklogic.createDatabaseClient(testconfig.restWriterConnection);
var dbEval = marklogic.createDatabaseClient(testconfig.restEvaluatorConnection);
var dbAdmin = marklogic.createDatabaseClient(testconfig.restAdminConnection);

describe('Javascript invoke test', function () {

    var fsPath = __dirname + '/data/sourceSimple.js';
    var invokePath = '/ext/invokeTest/sourceSimple.sjs';

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

    it('should do simple javascript invoke', function (done) {
        dbEval.invoke(invokePath).result(function (values) {
            //console.log(values);
            values[0].value.should.equal('helloworld');
            done();
        }, done);
    });

});
