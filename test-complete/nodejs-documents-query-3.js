/*
* Copyright © 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/

var should = require('should');

var testconfig = require('../etc/test-config-qa.js');

var marklogic = require('../');
var q = marklogic.queryBuilder;

var db = marklogic.createDatabaseClient(testconfig.restReaderConnection);
var dbWriter = marklogic.createDatabaseClient(testconfig.restWriterConnection);
var dbAdmin = marklogic.createDatabaseClient(testconfig.restAdminConnection);
var dbConfigAdmin = marklogic.createDatabaseClient(testconfig.configAdminConnection);

describe('Document query test', function () {
    before(function (done) {
        this.timeout(10000);
        dbWriter.documents.write({
            uri: '/test/query/matchDir/doc1.json',
            collections: ['matchCollection1'],
            contentType: 'application/json',
            content: {
                title: 'Vannevar Bush',
                popularity: 5,
                id: '0011',
                date: '2005-01-01',
                price: {
                    amt: 0.1
                },
                p: 'Vannevar Bush wrote an article for The Atlantic Monthly'
            }
        }, {
            uri: '/test/query/matchDir/doc2.json',
            collections: ['matchCollection1', 'matchCollection2'],
            contentType: 'application/json',
            content: {
                title: 'The Bush article',
                popularity: 4,
                id: '0012',
                date: '2006-02-02',
                price: {
                    amt: 0.12
                },
                p: 'The Bush Atlantic article described a device called a Memex'
            }
        }, {
            uri: '/test/query/matchDir/doc3.json',
            collections: ['matchCollection2'],
            contentType: 'application/json',
            content: {
                title: 'For 1945',
                popularity: 3,
                id: '0013',
                date: '2007-03-03',
                price: {
                    amt: 1.23
                },
                p: 'For 1945, the thoughts expressed Bush in the Atlantic Monthly were groundbreaking'
            }
        }, {
            uri: '/test/query/matchDir/doc4.json',
            collections: [],
            contentType: 'application/json',
            content: {
                title: 'Vannevar served',
                popularity: 5,
                id: '0024',
                date: '2008-04-04',
                price: {
                    amt: 12.34
                },
                p: 'Vannevar served as a prominent policymaker and public intellectual'
            }
        }, {
            uri: '/test/query/matchList/doc5.json',
            collections: ['matchList'],
            contentType: 'application/json',
            content: {
                title: 'The memex',
                popularity: 5,
                id: '0026',
                date: '2009-05-05',
                price: {
                    amt: 123.45
                },
                p: 'The Memex, unfortunately, had no automated search feature policy'
            }
        }).
            result(function (response) {
                done();
            }, done);
    });

    after('should delete all documents', function (done) {
        dbAdmin.documents.removeAll({
            all: true
        }).
            result(function (response) {
                done();
            }, done);
    });

    it('should do near query', function (done) {
        db.documents.query(
            q.where(
                q.near(
                    q.term('Bush'),
                    q.term('Atlantic'),
                    1,
                    q.weight(1)
                )
            ).withOptions({ search: ['filtered'] })
        ).result(function (response) {
            var document = response[0];
            response.length.should.equal(1);
            response[0].content.id.should.equal('0012');
            done();
        }, done);
    });

    it('should do minimum distance near query', function (done) {
        db.documents.query(
            q.where(
                q.near(
                    q.term('Bush'),
                    q.term('Atlantic'),
                    3,
                    q.weight(1),
                    q.ordered(true),
                    q.minDistance(2)
                )
            ).withOptions({ search: ['filtered'] })
        ).result(function (response) {
            var document = response[0];
            response.length.should.equal(1);
            response[0].content.id.should.equal('0013');
            done();
        }, done);
    });
});
