/*
* Copyright © 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/

var should = require('should');

var fs     = require('fs');
var stream = require('stream');
var util   = require('util');

var concatStream = require('concat-stream');
var valcheck     = require('core-util-is');
var testconfig = require('../etc/test-config-qa.js');

var marklogic = require('../');
var q = marklogic.queryBuilder;

var dbReader = marklogic.createDatabaseClient(testconfig.restReaderConnection);
var dbWriter = marklogic.createDatabaseClient(testconfig.restWriterConnection);
var dbAdmin = marklogic.createDatabaseClient(testconfig.restAdminConnection);

describe('Binary documents test', function () {
    var binaryPath = __dirname + '/data/mediaCQ.mp3';
    var uri = '/test/binary/someMp3File.mp3';
    var binaryValue = null;
    before(function (done) {
        this.timeout(10000);
        fs.createReadStream(binaryPath).
            pipe(concatStream({ encoding: 'buffer' }, function (value) {
                binaryValue = value;
                done();
            }));
    });

    it('should write the binary with Readable stream', function (done) {
        this.timeout(10000);
        var uri = '/test/write/someMp3File.mp3';
        var readableBinary = new ValueStream(binaryValue);
        //readableBinary.pause();
        dbWriter.documents.write({
            uri: uri,
            contentType: 'audio/mpeg',
            content: readableBinary
        }).
            result(function (response) {
                response.should.have.property('documents');
                done();
            }, done);
    });

    it('should read the binary with Readable stream', function (done) {
        this.timeout(10000);
        var uri = '/test/write/someMp3File.mp3';
        dbReader.documents.read(uri).
            result(function (documents) {
                JSON.stringify(binaryValue).should.equal(
                    JSON.stringify(documents[0].content));
                done();
            }, done);
    });

    it('should delete mp3 file', function (done) {
        dbAdmin.documents.removeAll({
            all: true
        }).
            result(function (response) {
                done();
            }, done);
    });

});

function ValueStream(value) {
    stream.Readable.call(this);
    this.value    = value;
}
util.inherits(ValueStream, stream.Readable);
ValueStream.prototype._read = function () {
    this.push(this.value);
    this.push(null);
};
