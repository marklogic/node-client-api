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

    var dbPath = '/marklogic/snippet/custom/extractFirst.xqy';
    var fsPath = __dirname + '/data/extractFirst.xqy';

    it('should write the extension library', function (done) {
        this.timeout(10000);
        dbAdmin.config.extlibs.write(
            dbPath,
            { 'role-name': 'app-user', capabilities: ['execute'] },
            'application/xquery',
            fs.createReadStream(fsPath)).
            result(function (response) {
                done();
            }, done);
    });

    it('should read the extension library', function (done) {
        dbAdmin.config.extlibs.read(dbPath).
            result(function (source) {
                (!valcheck.isNullOrUndefined(source)).should.equal(true);
                done();
            }, done);
    });

    it('should list the extension libraries', function (done) {
        dbAdmin.config.extlibs.list().
            result(function (response) {
                response.should.have.property('assets');
                response.assets.length.should.be.greaterThan(0);
                done();
            }, done);
    });

    it('should remove the extension libraries', function (done) {
        dbAdmin.config.extlibs.remove(dbPath).
            result(function (response) {
                done();
            }, done);
    });

    it('should list 0 extension libraries', function (done) {
        dbAdmin.config.extlibs.list().
            result(function (response) {
                //console.log(response);
                //response.should.have.property('assets');
                response.assets.length.should.be.empty;
                done();
            }, done);
    });

});
