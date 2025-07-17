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

describe('Transform test with xquery', function () {
    before(function (done) {
        this.timeout(10000);
        dbWriter.documents.write({
            uri: '/test/transform/xquerytransform.json',
            contentType: 'application/json',
            content: { title: 'transform test with xquery' }
        }).
            result(function (response) {
                done();
            }, done);
    });

    var transformName = 'flagParam';
    var transformPath = __dirname + '/data/flagTransform.xqy';

    it('should write the transform', function (done) {
        this.timeout(10000);
        fs.createReadStream(transformPath).
            pipe(concatStream({ encoding: 'string' }, function (source) {
                dbAdmin.config.transforms.write(transformName, 'xquery', source).
                    result(function (response) {
                        done();
                    }, done);
            }));
    });

    it('should read the transform', function (done) {
        dbAdmin.config.transforms.read(transformName).
            result(function (source) {
                (!valcheck.isNullOrUndefined(source)).should.equal(true);
                done();
            }, done);
    });

    it('should list the transform', function (done) {
        dbAdmin.config.transforms.list().
            result(function (response) {
                response.should.have.property('transforms');
                done();
            }, done);
    });

    var uri = '/test/transform/xquerytransform.json';

    it('should modify during read', function (done) {
        db.documents.read({
            uris: uri,
            transform: [transformName, { flag: 'hello' }]
        }).
            result(function (response) {
                //console.log(JSON.stringify(response, null, 4));
                response[0].content.flagParam.should.equal('hello');
                done();
            }, done);
    });

    it('should modify during query', function (done) {
        this.timeout(10000);
        db.documents.query(
            q.where(
                q.term('title', 'xquery')
            ).
                slice(0, 10, q.transform(transformName, { flag: 'world' }))
        ).
            result(function (response) {
                //console.log(JSON.stringify(response, null, 4));
                response[0].content.flagParam.should.equal('world');
                done();
            }, done);
    });

    it('should modify during write', function (done) {
        dbWriter.documents.write({
            uri: '/test/transform/write/xquerytransform.json',
            contentType: 'application/json',
            content: { readKey: 'after write' },
            transform: [transformName, { flag: 'sunshine' }]
        }).
            result(function (response) {
                db.documents.read('/test/transform/write/xquerytransform.json').
                    result(function (documents) {
                        //console.log(JSON.stringify(documents, null, 4));
                        documents[0].content.flagParam.should.equal('sunshine');
                        done();
                    }, done);
            }, done);
    });

    it('should remove the documents', function (done) {
        dbAdmin.documents.removeAll({
            directory: '/test/transform/'
        }).
            result(function (response) {
                response.should.be.ok;
                done();
            }, done);
    });

});
