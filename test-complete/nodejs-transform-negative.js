/*
* Copyright © 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/
var should = require('should');
var fs = require('fs');
var concatStream = require('concat-stream');
var valcheck = require('core-util-is');

var testconfig = require('../etc/test-config-qa.js');

var marklogic = require('../');
var q = marklogic.queryBuilder;

var db = marklogic.createDatabaseClient(testconfig.restReaderConnection);
var dbWriter = marklogic.createDatabaseClient(testconfig.restWriterConnection);
var dbAdmin = marklogic.createDatabaseClient(testconfig.restAdminConnection);

describe('Extension library test', function () {
    before(function (done) {
        this.timeout(10000);
        dbWriter.documents.write({
            uri: '/test/transform/employee.xml',
            collections: ['employee'],
            contentType: 'application/xml',
            content: '<Company><Employee><name>John</name></Employee></Company>'
        }).
            result(function (response) {
                done();
            }, done);
    });

    it('should fail to read uninstalled transform', function (done) {
        dbAdmin.config.transforms.read('uninstalledTransform').
            result(function (response) {
                //response.should.equal('SHOULD HAVE FAILED');
                var strData = JSON.stringify(response);
                strData.should.be.equal('[]');
                done();
            }, function (error) {
                //console.log(error);
                done();
            });
    });

    var uri = '/test/transform/employee.xml';

    it('should modify during read -- negative with unistalled tranform', function (done) {
        db.read({
            uris: uri,
            transform: ['uninstalledTransform']
        }).
            result(function (response) {
                response.should.equal('SHOULD HAVE FAILED');
                done();
            }, function (error) {
                //console.log(error);
                error.statusCode.should.equal(400);
                error.body.errorResponse.messageCode.should.equal('RESTAPI-INVALIDREQ');
                done();
            });
    });

});
