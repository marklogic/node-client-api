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

describe('Binary documents test', function () {
    var fsPath = __dirname + '/data/121-GIF-Image-GIF-gif_sample1.gif';
    var uri = '/test/binary/stream/121-GIF-Image-GIF-gif_sample1.gif';
    var binaryValue = null;

    it('should write the binary with Readable stream', function (done) {
        this.timeout(10000);
        dbWriter.documents.write({
            uri: uri,
            contentType: 'image/gif',
            collections: ['imageColl'],
            content: fs.createReadStream(fsPath)
        }).
            result(function (response) {
                //console.log(response);
                response.documents[0].uri.should.equal(uri);
                done();
            }, done);
    });

    it('should read the binary with Readable stream', function (done) {
        this.timeout(10000);
        dbReader.documents.read(uri).
            result(function (documents) {
                documents[0].content.should.not.equal(null);
                //console.log(documents);
                done();
            }, done);
    });

    it('should remove the document', function (done) {
        this.timeout(10000);
        dbWriter.documents.remove(uri).
            result(function (response) {
                response.should.be.ok;
                done();
            }, done);
    });


});

