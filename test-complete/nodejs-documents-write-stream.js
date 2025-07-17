/*
* Copyright © 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/

var should = require('should');

var testconfig = require('../etc/test-config-qa.js');
var fs = require('fs');
var concatStream = require('concat-stream');

var marklogic = require('../');

var db = marklogic.createDatabaseClient(testconfig.restWriterConnection);
var dbReader = marklogic.createDatabaseClient(testconfig.restReaderConnection);
var dbAdmin = marklogic.createDatabaseClient(testconfig.restAdminConnection);

describe('Write Document Stream Test', function () {
    describe('write json stream', function () {
        before(function (done) {
            this.timeout(10000);
            var writeStream = db.documents.createWriteStream({
                uri: '/test/writestream/writeable1.json',
                contentType: 'application/json'
            });
            writeStream.result(function (response) {
                done();
            }, done);
            writeStream.write('{"title":"hello"}', 'utf8');
            writeStream.end();
        });
        it('should read back the value', function (done) {
            db.documents.read('/test/writestream/writeable1.json').
                result(function (documents) {
                    documents.length.should.equal(1);
                    done();
                }, done);
        });
    });

    describe('write json stream in chunk', function () {
        before(function (done) {
            this.timeout(10000);
            var writeStream = db.documents.createWriteStream({
                uri: '/test/writestream/writeable2.json',
                contentType: 'application/json'
            });
            writeStream.result(function (response) {
                done();
            }, done);
            writeStream.write('{"title":"El Dorado", ', 'utf8');
            writeStream.write('"count":5}', 'utf8');
            writeStream.end();
        });
        it('should read back the value', function (done) {
            db.documents.read('/test/writestream/writeable2.json').
                result(function (documents) {
                    documents.length.should.equal(1);
                    done();
                }, done);
        });
    });

    describe('write xml stream in chunk', function () {
        before(function (done) {
            this.timeout(10000);
            var writeStream = db.documents.createWriteStream({
                uri: '/test/writestream/writeable1.xml',
                contentType: 'application/xml'
            });
            writeStream.result(function (response) {
                done();
            }, done);
            writeStream.write('<a><b>hello', 'utf8');
            writeStream.write('</b></a>', 'utf8');
            writeStream.end();
        });
        it('should read back the value', function (done) {
            db.documents.read('/test/writestream/writeable1.xml').
                result(function (documents) {
                    documents.length.should.equal(1);
                    done();
                }, done);
        });
    });

    describe('write transform for a test', function () {
        before(function (done) {
            this.timeout(10000);
            var transformName = 'employeeStylesheet';
            var transformPath = __dirname + '/data/employeeStylesheet.xslt';
            fs.createReadStream(transformPath).
                pipe(concatStream({ encoding: 'string' }, function (source) {
                    dbAdmin.config.transforms.write(transformName, 'xslt', source).
                        result(function (response) {
                            done();
                        }, done);
                }));
        });
        it('should do nothing', function (done) {
            done();
        });
    });

    describe('write stream with transform', function () {
        before(function (done) {
            this.timeout(10000);
            var transformName = 'employeeStylesheet';
            var writeStream = db.documents.createWriteStream({
                uri: '/test/writestream/writestreamtransform.xml',
                contentType: 'application/xml',
                transform: [transformName]
            });
            writeStream.result(function (response) {
                done();
            }, done);
            writeStream.write('<Company><Employee><name>John', 'utf8');
            writeStream.write('</name></Employee></Company>', 'utf8');
            writeStream.end();
        });
        it('should read back the value', function (done) {
            db.documents.read('/test/writestream/writestreamtransform.xml').
                result(function (documents) {
                    documents.length.should.equal(1);
                    done();
                }, done);
        });
    });

    describe('delete a transform for cleanup', function () {
        before(function (done) {
            this.timeout(10000);
            var transformName = 'employeeStylesheet';
            dbAdmin.config.transforms.remove(transformName).
                result(function (response) {
                    done();
                }, done);
        });
        it('should do nothing', function (done) {
            done();
        });
    });

    describe('delete docs for cleanup', function () {
        before(function (done) {
            this.timeout(10000);
            dbAdmin.documents.removeAll({ directory: '/test/writestream' }).
                result(function (response) {
                    done();
                }, done);
        });
        it('should do nothing', function (done) {
            done();
        });
    });
});
