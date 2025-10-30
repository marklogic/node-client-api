/*
* Copyright (c) 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/
var should = require('should');

var testconfig = require('../etc/test-config-qa.js');

var marklogic = require('../');

var db1 = marklogic.createDatabaseClient(testconfig.restWriterConnection);
var db2 = marklogic.createDatabaseClient(testconfig.restWriterConnection);
var dbReader = marklogic.createDatabaseClient(testconfig.restReaderConnection);
var dbAdmin = marklogic.createDatabaseClient(testconfig.restAdminConnection);

describe('Database Concurrency Test', function () {

    it('should write the document using db1 conn and overwrite using db2 conn', function (done) {
        db1.documents.write({
            uri: '/test/dbconn/test1.json',
            contentType: 'application/json',
            content: {
                title: 'first conn'
            }
        }).
            result(function (response) {
                db2.documents.write({
                    uri: '/test/dbconn/test1.json',
                    contentType: 'application/json',
                    content: {
                        title: 'second conn'
                    }
                }).
                    result(function (response) {
                        done();
                    }, done);
            });
    });

    it('should read the document using db1 conn and probe using db2 conn', function (done) {
        db1.documents.read({
            uris: '/test/dbconn/test1.json'
        }).
            result(function (response) {
                //console.log(response);
                response[0].content.title.should.equal('second conn');
                db2.documents.probe({
                    uri: '/test/dbconn/test1.json'
                }).
                    result(function (response) {
                        //console.log(response);
                        response.exists.should.equal(true);
                        done();
                    }, done);
            });
    });

    it('should delete the document', function (done) {
        dbAdmin.documents.removeAll({
            directory: '/test/dbconn/'
        }).
            result(function (response) {
                done();
            }, done);
    });
});
