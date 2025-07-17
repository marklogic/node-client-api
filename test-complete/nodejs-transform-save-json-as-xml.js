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

describe('Transform save json as xml', function () {
    before(function (done) {
        this.timeout(10000);
        dbWriter.documents.write({
            uri: '/test/transform/savejsonasxmltransform',
            contentType: 'application/json',
            content: { name: 'bob' }
        }).
            result(function (response) {
                done();
            }, done);
    });

    var transformName = 'to-xml';
    var transformPath = __dirname + '/data/to-xml.xqy';

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

    var uri = '/test/transform/savejsonasxmltransform';

    it('should modify during read', function (done) {
        db.documents.read({
            uris: uri,
            transform: [transformName]
        }).
            result(function (response) {
                //console.log(JSON.stringify(response, null, 4));
                response[0].content.should.containEql('<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<name>bob</name>\n');
                response[0].format.should.equal('xml');
                done();
            }, done)
            .catch(error => done(error));
    });

    it('should modify during query', function (done) {
        this.timeout(10000);

        db.documents.query(
            q.where(
                q.and(
                    q.directory('/test/transform/'),
                    q.term('name', 'bob')
                )
            ) .slice(0, q.transform(transformName))
        ).
            result(function (response) {
                response[0].content.should.containEql('<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<name>bob</name>');
                response[0].format.should.equal('xml');
                done();
            })
            .catch(error => done(error));
    });

    it('should modify during write', function (done) {
        dbWriter.documents.write({
            uri: '/test/transform/write/savejsonasxmltransform.xml',
            contentType: 'application/json',
            content: { name: 'bob' },
            transform: [transformName]
        }).
            result(function (response) {
                db.documents.read('/test/transform/write/savejsonasxmltransform.xml').
                    result(function (response) {
                        //console.log(JSON.stringify(documents, null, 4));
                        response[0].content.should.containEql('<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<name>bob</name>\n');
                        response[0].format.should.equal('xml');
                        done();
                    }, done);
            }).catch(error => done(error));
    });

    after(function (done) {
        dbAdmin.documents.removeAll({
            directory: '/test/transform/'
        }).
            result(function (response) {
                response.should.be.ok;
                done();
            }).catch(error => done(error));
    });
});
