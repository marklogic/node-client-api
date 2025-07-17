/*
* Copyright © 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/

let testconfig = require('../etc/test-config.js');
let should = require('should');
let marklogic = require('../');
const { exec } = require('child_process');
const testlib = require("../etc/test-lib");
let db = marklogic.createDatabaseClient(testconfig.restConnectionForTls);
let serverConfiguration = {};
let host  = testconfig.testHost;

describe('document write and read using min tls', function () {
    this.timeout(10000);
    before(function (done) {
        testlib.findServerConfiguration(serverConfiguration);
        setTimeout(() => {
            if (serverConfiguration.serverVersion < 12) {
                this.skip();
            }
            done();
        }, 3000);
    });

    it('should write document with minimum TLS versions 1.3', function (done) {
        updateTlsVersion('TLSv1.3').then((result) => {
            db.documents.write({
                uri: '/test/write_tlsV1.3.json',
                contentType: 'application/json',
                content: '{"key1":"With TLS 1.3"}'
            }).result(function (response) {
                db.documents.read('/test/write_tlsV1.3.json')
                    .result(function (documents) {
                        documents[0].content.should.have.property('key1');
                        documents[0].content.key1.should.equal('With TLS 1.3');

                    }).then(() => done())
                    .catch(error => done(error));
            }).catch(error=> done(error));
        }).catch(error=> done(error));
    });

    it('should write document with minimum TLS versions 1.2', function (done) {
        updateTlsVersion('TLSv1.2').then((result) => {
            db.documents.write({
                uri: '/test/write_tlsV1.2.json',
                contentType: 'application/json',
                content: '{"key1":"With TLS 1.2"}'
            }).result(function (response) {
                db.documents.read('/test/write_tlsV1.2.json')
                    .result(function (documents) {
                        documents[0].content.should.have.property('key1');
                        documents[0].content.key1.should.equal('With TLS 1.2');

                    }).then(() => done())
                    .catch(error => done(error));
            }).catch(error=> done(error));
        }).catch(error=> done(error));
    });

    it('should throw error when user strictly sets 1.2 and server needs min TLS version as 1.3', function (done) {
        testconfig.restConnectionForTls.minVersion = 'TLSv1.2';
        testconfig.restConnectionForTls.maxVersion = 'TLSv1.2';
        db = marklogic.createDatabaseClient(testconfig.restConnectionForTls);
        updateTlsVersion('TLSv1.3').then(() => {
            db.documents.write({
                uri: '/test/write_tlsV1.2.json',
                contentType: 'application/json',
                content: '{"key1":"Test"}'
            }).result(()=> done(new Error('Document write should fail when user uses 1.2 and server needs min TLS version as 1.3'))
            ).catch(error=> {
                // TLS handshake error.
                error.message.should.containEql("SSL routines")
                done();
            })
        }).catch(error=> done(error));
    });

    it('should write document with minVersion and maxVersion', function (done) {
        testconfig.restConnectionForTls.minVersion = 'TLSv1.2';
        testconfig.restConnectionForTls.maxVersion = 'TLSv1.3';
        db = marklogic.createDatabaseClient(testconfig.restConnectionForTls);
        updateTlsVersion('TLSv1.3').then(() => {
            db.documents.write({
                uri: '/test/write_with_min_and_max_versions.json',
                contentType: 'application/json',
                content: '{"key1":"With min and max TLS versions."}'
            }).result(() => done()).catch(error => {
                db.documents.read('/test/write_with_min_and_max_versions.json')
                    .result(function (documents) {
                        documents[0].content.should.have.property('key1');
                        documents[0].content.key1.should.equal('With min and max TLS versions.');

                    }).then(() => done())
                    .catch(error => done(error));
            }).catch(error=> done(error));
        }).catch(error=> done(error));
    });

    it('should write document with only minVersion', function (done) {
        testconfig.restConnectionForTls.minVersion = 'TLSv1.2';
        db = marklogic.createDatabaseClient(testconfig.restConnectionForTls);
        updateTlsVersion('TLSv1.3').then(() => {
            db.documents.write({
                uri: '/test/write_with_only_min_version.json',
                contentType: 'application/json',
                content: '{"key1":"With only min TLS version."}'
            }).result(() => done()).catch(error => {
                db.documents.read('/test/write_with_only_min_version.json')
                    .result(function (documents) {
                        documents[0].content.should.have.property('key1');
                        documents[0].content.key1.should.equal('With only min TLS version.');

                    }).then(() => done())
                    .catch(error => done(error));
            }).catch(error=> done(error));
        }).catch(error=> done(error));
    });

    it('should write document with only maxVersion', function (done) {
        testconfig.restConnectionForTls.maxVersion = 'TLSv1.3';
        db = marklogic.createDatabaseClient(testconfig.restConnectionForTls);
        updateTlsVersion('TLSv1.3').then(() => {
            db.documents.write({
                uri: '/test/write_with_only_max_version.json',
                contentType: 'application/json',
                content: '{"key1":"With only max TLS version."}'
            }).result(() => done()).catch(error => {
                db.documents.read('/test/write_with_only_max_version.json')
                    .result(function (documents) {
                        documents[0].content.should.have.property('key1');
                        documents[0].content.key1.should.equal('With only max TLS version.');

                    }).then(() => done())
                    .catch(error => done(error));
            }).catch(error=> done(error));
        }).catch(error=> done(error));
    });
})

function updateTlsVersion(tlsVersion) {
    return new Promise((resolve, reject) => {
        const curlCommand = `
            curl --anyauth --user admin:admin -X PUT -H "Content-Type: application/json" \
-d '{"ssl-min-allow-tls": "${tlsVersion}"}' \
'http://${host}:8002/manage/v2/servers/unittest-nodeapi-ssl/properties?group-id=Default'
    `;
        exec(curlCommand, (error, stdout, stderr) => {
            if (error) {
                throw new Error(`Error executing curl: ${stderr}`);
            }
            resolve();
        });
    });
}

