/*
* Copyright (c) 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
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

describe('Transform test', function () {
    before(function (done) {
        this.timeout(10000);
        dbWriter.documents.write({
            uri: '/test/transform/employee.xml',
            collections: ['employee'],
            contentType: 'application/xml',
            content: '<Company><Employee><name>John</name></Employee></Company>'
        }).
            result(function (response) {
                done();
            }, done);
    });

    var transformName = 'employeeStylesheet';
    var transformPath = __dirname + '/data/employeeStylesheet.xslt';

    it('should write the transform', function (done) {
        this.timeout(10000);
        fs.createReadStream(transformPath).
            pipe(concatStream({ encoding: 'string' }, function (source) {
                dbAdmin.config.transforms.write(transformName, 'xslt', source).
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

    var uri = '/test/transform/employee.xml';

    it('should modify during read', function (done) {
        db.documents.read({
            uris: uri,
            transform: [transformName]
        }).
            result(function (response) {
                var strData = JSON.stringify(response);
                strData.should.containEql('<firstname>');
                done();
            }, done);
    });

    it('should modify during query', function (done) {
        this.timeout(10000);
        db.documents.query(
            q.where(
                q.collection('employee')
            ).
                slice(0, 10, q.transform(transformName))
        ).
            result(function (response) {
                //console.log(response);
                var strData = JSON.stringify(response);
                strData.should.containEql('<firstname>');
                done();
            }, done);
    });

    it('should modify during write', function (done) {
        dbWriter.documents.write({
            uri: '/test/transform/write/xslttransform.xml',
            contentType: 'application/xml',
            collections: ['employee'],
            content: '<Company><Employee><name>John</name></Employee></Company>',
            transform: transformName
        }).
            result(function (response) {
                db.documents.read('/test/transform/write/xslttransform.xml').
                    result(function (documents) {
                        //console.log(JSON.stringify(documents, null, 4));
                        var strData = JSON.stringify(documents);
                        strData.should.containEql('<firstname>');
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

    it('should remove the transform', function (done) {
        dbAdmin.config.transforms.remove(transformName).
            result(function (response) {
                response.should.be.ok;
                done();
            }, done);
    });

    /*it('should not be able to read the removed transform', function(done){
    dbAdmin.config.transforms.read(transformName).
    result(function(source){
      source.should;
      done();
    }, done);
  });*/

});
