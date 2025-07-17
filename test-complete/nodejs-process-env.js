/*
* Copyright © 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/


process.env.NODE_ENV = 'development';

var should = require('should');

var testconfig = require('../etc/test-config-qa.js');

var marklogic = require('../');

var db = marklogic.createDatabaseClient(testconfig.restWriterConnection);

describe('Process Env Test', function () {

    before(function (done) {
        this.timeout(10000);
        db.documents.write({
            uri: '/process/env/test.json',
            content: { name: 'development' }
        }).result(function (response) {
            done();
        }, done);
    });

    var selectOneDocument = function () {
        var uri = '/some/uri/test.json'; //replace with VALID URI
        return db.documents.read(uri).result();
    };
    var resolve = function (document) {
    //console.log(document);
        document.should.be.empty;
    };
    var reject = function (error) {
        console.log(error);
    };
    selectOneDocument().then(resolve, reject);

    it('should delete the document', function (done) {
        db.documents.remove('/process/env/test.json').result(function (document) {
            document.removed.should.eql(true);
            done();
        }, done);
    });

    process.env.NODE_ENV = undefined;

});
