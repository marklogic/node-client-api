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

describe('Config query negative test', function () {

    var dbDir = '/marklogic/query/invalid/custom/';
    var dbModule = 'directoryConstraintInvalid.xqy';
    var dbPath = dbDir + dbModule;
    var fsPath = __dirname + '/data/directoryConstraintInvalid.xqy';

    it('should fail to write the custom query with reader user', function (done) {
        this.timeout(10000);
        db.config.query.custom.write(
            'directoryConstraint.xqy',
            [{ 'role-name': 'app-user', capabilities: ['execute'] }],
            fs.createReadStream(__dirname + '/data/directoryConstraint.xqy')).
            result(function (response) {
                response.should.equal('SHOULD HAVE FAILED');
                done();
            }, function (error) {
                //console.log(error);
                error.statusCode.should.equal(403);
                done();
            });
    });

    it('should fail to read the invalid custom query', function (done) {
        dbAdmin.config.query.custom.read(dbModule).
            result(function (source) {
                response.should.equal('SHOULD HAVE FAILED');
                done();
            }, function (error) {
                //console.log(error);
                error.statusCode.should.equal(404);
                done();
            });
    });

    it('should fail to remove the invalid custom query', function (done) {
        dbAdmin.config.query.custom.remove(dbModule).
            result(function (response) {
                //response.should.equal('SHOULD HAVE FAILED');
                done();
            }, function (error) {
                console.log(error);
                done();
            });
    });

    it('should fail to use invalid custom query in a query', function (done) {
        dbWriter.documents.query(
            q.where(
                q.parsedFrom('dirs:/test/custom/query/',
                    q.parseBindings(
                        q.parseFunction('directoryConstraintInvalid.xqy', q.bind('dirs'))
                    )
                )
            )
        ).
            result(function (response) {
                response.should.equal('SHOULD HAVE FAILED');
                done();
            }, function (error) {
                //console.log(error);
                error.statusCode.should.equal(400);
                done();
            });
    });

    it('should remove the custom query', function (done) {
        dbAdmin.config.query.custom.remove('directoryConstraint.xqy').
            result(function (response) {
                done();
            }, function (error) {
                console.log(error);
                done();
            });
    });

});
