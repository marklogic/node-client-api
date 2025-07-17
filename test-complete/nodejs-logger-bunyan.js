/*
* Copyright © 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/

var testconfig = require('../etc/test-config-qa.js');
var marklogic = require('../');
var dbAdmin = marklogic.createDatabaseClient(testconfig.restAdminConnection);

describe('Bunyan logger test', function () {

    it('should read the bunyan logger', function (done) {
        dbAdmin.config.serverprops.read().result(function (response) {
            done();
        }, done);
    });

});
