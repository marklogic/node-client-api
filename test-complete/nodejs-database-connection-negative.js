/*
* Copyright (c) 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/
var should = require('should');

var testconfig = require('../etc/test-config-qa.js');

var marklogic = require('../');
var q = marklogic.queryBuilder;

var db = marklogic.createDatabaseClient(testconfig.restReaderConnection);
var dbWriter = marklogic.createDatabaseClient(testconfig.restWriterConnection);

describe('Database connection negative test', function () {

    it('should fail to create db connection with invalid host', function (done) {
        try {
            marklogic.createDatabaseClient({
                host: 'invalid',
                port: '8015',
                user: 'admin',
                password: 'admin',
                authType: 'DIGEST'
            }).should.equal('SHOULD HAVE FAILED');
            done();
        } catch (error) {
            //console.log(error);
            error.should.be.ok;
            done();
        }
    });

    it('should fail to create db connection with occupied port', function (done) {
        try {
            marklogic.createDatabaseClient({
                host: 'localhost',
                port: '8000',
                user: 'admin',
                password: 'admin',
                authType: 'DIGEST'
            }).should.equal('SHOULD HAVE FAILED');
            done();
        } catch (error) {
            //console.log(error);
            error.should.be.ok;
            done();
        }
    });

    it('should fail to create db connection with invalid db', function (done) {
        try {
            marklogic.createDatabaseClient({
                host: 'localhost',
                port: '8015',
                database: 'invalid',
                user: 'admin',
                password: 'admin',
                authType: 'DIGEST'
            }).should.equal('SHOULD HAVE FAILED');
            done();
        } catch (error) {
            //console.log(error);
            error.should.be.ok;
            done();
        }
    });

    it('should fail to create db connection with invalid user and password', function (done) {
        try {
            marklogic.createDatabaseClient({
                host: 'localhost',
                port: '8015',
                user: 'foo',
                password: 'foo',
                authType: 'DIGEST'
            }).should.equal('SHOULD HAVE FAILED');
            done();
        } catch (error) {
            //console.log(error);
            error.should.be.ok;
            done();
        }
    });

    it('should fail to create db connection with invalid auth type', function (done) {
        try {
            marklogic.createDatabaseClient({
                host: 'localhost',
                port: '8015',
                user: 'admin',
                password: 'admin',
                authType: 'DIGEST'
            }).should.equal('SHOULD HAVE FAILED');
            done();
        } catch (error) {
            //console.log(error);
            error.should.be.ok;
            done();
        }
    });

    it('Verify release client error message', function (done) {
        try {

            var db = marklogic.createDatabaseClient({
                host: 'localhost',
                port: '8015',
                user: 'admin',
                password: 'admin',
                authType: 'DIGEST'
            });
	  // Force connection to be released
	  db.connectionParams = null;
	  db.documents.query(
                q.where(
                    q.term('describe', q.termOptions('stemmed'))
                )).result(function (response) {
                done();
            }, function (err) {
	  console.log(JSON.stringify(response, null, 4));
	  done();
	  });
            done();
        } catch (error) {

            //console.log('### ' + error.message);
	  error.message.should.equal('Connection has been closed.');
            error.should.be.ok;
            done();
        }
    });

});
