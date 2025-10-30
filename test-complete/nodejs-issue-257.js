/*
* Copyright (c) 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/
var should = require('should');

var fs = require('fs');
var valcheck = require('core-util-is');

var testconfig = require('../etc/test-config-qa.js');

var marklogic = require('../');
var q = marklogic.queryBuilder;

var db = marklogic.createDatabaseClient(testconfig.restWriterConnection);
var restAdminDB = marklogic.createDatabaseClient(testconfig.restAdminConnection);
var serviceName = 'issue-257';
var servicePath = __dirname + '/data/issue-257.sjs';

describe('Issue 257', function () {

    before('should write the extension service', function (done) {
        restAdminDB.config.resources.write(serviceName, 'javascript', fs.createReadStream(servicePath)).
            result(function (response) {
                done();
            }, done);
    });

    it('should post without document property', function (done) {
        db.resources.post({
            name: serviceName
        }).result(function (response) {
            //console.log(JSON.stringify(response, null, 2));
            response.should.equal('POST worked');
            done();
        }, done);
    });

    after('should delete the extension service', function (done) {
        restAdminDB.config.resources.remove(serviceName).
            result(function (response) {
                done();
            }, done);
    });

});
