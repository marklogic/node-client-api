/*
 * Copyright (c) 2020 MarkLogic Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var should = require('should');

var testconfig = require('../etc/test-config-qa.js');

var marklogic = require('../');
var q = marklogic.queryBuilder;
var p = marklogic.patchBuilder;

var db = marklogic.createDatabaseClient(testconfig.restReaderConnection);
var dbWriter = marklogic.createDatabaseClient(testconfig.restWriterConnection);
var dbAdmin = marklogic.createDatabaseClient(testconfig.restAdminConnection);

describe('document patch test 2', function () {
    before(function (done) {
        this.timeout(30000);
        // NOTE: must create a string range index on rangeKey1 and rangeKey2
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
                p: 'The Bush article described a device called a Memex'
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
                p: 'For 1945, the thoughts expressed in the Atlantic Monthly were groundbreaking'
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
                p: 'The Memex, unfortunately, had no automated search feature'
            }
        }).
            result(function (response) {
                done();
            }, done);
    });

    it('should apply patch', function (done) {
        dbWriter.documents.patch('/test/query/matchList/doc5.json',
            p.pathLanguage('jsonpath'),
            //p.insert('$', 'last-child', {foo:'bar'}),
            p.insert('$.title', 'after', { newKey: 'newChild' }),
            p.insert('$.price.amt', 'after', { numberKey: 1234.456 }),
            p.replace('$.popularity', 1),
            p.remove('$.p'),
            p.replaceInsert('$.date1', '$.popularity', 'before', { relativeReplaceInsert: '2014-08-26' }),
            p.replaceInsert('$.date', '$.popularity', 'before', { absoluteReplaceInsert: '2014-08-27' })
        ).result(function (response) {
        //console.log(response);
            response.uri.should.equal('/test/query/matchList/doc5.json');
            done();
        }, done);
    });

    it('should read the patch', function (done) {
        db.documents.read('/test/query/matchList/doc5.json').
            result(function (response) {
                var document = response[0];
                //console.log(JSON.stringify(response, null, 4));
                document.content.relativeReplaceInsert.should.equal('2014-08-26');
                document.content.date.absoluteReplaceInsert.should.equal('2014-08-27');
                done();
            }, done);
    });

    it('should write document for test', function (done) {
        dbWriter.documents.write({
            uri: '/test/query/patch/cardinality1.xml',
            contentType: 'application/xml',
            content: '<root><foo>one</foo></root>'
        }).
            result(function (response) {
                done();
            }, done);
    });

    it('should apply patch with one cardinality', function (done) {
        dbWriter.documents.patch(
            '/test/query/patch/cardinality1.xml',
            '<rapi:patch xmlns:rapi="http://marklogic.com/rest-api">' +
      '  <rapi:insert context="/root/foo" position="after" cardinality=".">' +
      '    <bar>added</bar>' +
      '  </rapi:insert>' +
      '</rapi:patch>'
        ).result(function (response) {
        //console.log(JSON.stringify(response, null, 2));
            response.uri.should.equal('/test/query/patch/cardinality1.xml');
            done();
        }, done);
    });

    it('should read the document patch', function (done) {
        db.documents.read({
            uris: '/test/query/patch/cardinality1.xml',
        }
        ).
            result(function (response) {
                //console.log(response);
                var document = response[0];
                var strDoc = JSON.stringify(document);
                strDoc.should.containEql('<foo>one</foo>    <bar>added</bar>');
                done();
            }, done);
    });

    it('should write document for test', function (done) {
        dbWriter.documents.write({
            uri: '/test/query/patch/cardinality2.xml',
            contentType: 'application/xml',
            content: '<root><foo>one</foo><foo>two</foo><foo>three</foo></root>'
        }).
            result(function (response) {
                done();
            }, done);
    });

    it('should apply patch with one or more cardinality', function (done) {
        dbWriter.documents.patch(
            '/test/query/patch/cardinality2.xml',
            '<rapi:patch xmlns:rapi="http://marklogic.com/rest-api">' +
      '  <rapi:insert context="/root/foo" position="after" cardinality="+">' +
      '    <bar>added</bar>' +
      '  </rapi:insert>' +
      '</rapi:patch>'
        ).result(function (response) {
        //console.log(JSON.stringify(response, null, 2));
            response.uri.should.equal('/test/query/patch/cardinality2.xml');
            done();
        }, done);
    });

    it('should read the document patch', function (done) {
        db.documents.read({
            uris: '/test/query/patch/cardinality2.xml',
        }
        ).
            result(function (response) {
                //console.log(response);
                var document = response[0];
                var strDoc = JSON.stringify(document);
                strDoc.should.containEql('<foo>two</foo>    <bar>added</bar>');
                done();
            }, done);
    });

    it('should write document for test', function (done) {
        dbWriter.documents.write({
            uri: '/test/query/patch/cardinality3.xml',
            contentType: 'application/xml',
            content: '<root><foo>one</foo></root>'
        }).
            result(function (response) {
                done();
            }, done);
    });

    it('should apply patch with zero or one cardinality', function (done) {
        dbWriter.documents.patch(
            '/test/query/patch/cardinality3.xml',
            '<rapi:patch xmlns:rapi="http://marklogic.com/rest-api">' +
      '  <rapi:insert context="/root/foo" position="after" cardinality="?">' +
      '    <bar>added</bar>' +
      '  </rapi:insert>' +
      '</rapi:patch>'
        ).result(function (response) {
        //console.log(JSON.stringify(response, null, 2));
            response.uri.should.equal('/test/query/patch/cardinality3.xml');
            done();
        }, done);
    });

    it('should read the document patch', function (done) {
        db.documents.read({
            uris: '/test/query/patch/cardinality3.xml',
        }
        ).
            result(function (response) {
                //console.log(response);
                var document = response[0];
                var strDoc = JSON.stringify(document);
                strDoc.should.containEql('<foo>one</foo>    <bar>added</bar>');
                done();
            }, done);
    });

    it('should write document for test', function (done) {
        dbWriter.documents.write({
            uri: '/test/query/patch/cardinality4.xml',
            contentType: 'application/xml',
            content: '<root><baz>one</baz></root>'
        }).
            result(function (response) {
                done();
            }, done);
    });

    it('should apply patch with zero or one cardinality -- with zero', function (done) {
        dbWriter.documents.patch(
            '/test/query/patch/cardinality4.xml',
            '<rapi:patch xmlns:rapi="http://marklogic.com/rest-api">' +
      '  <rapi:insert context="/root/foo" position="after" cardinality="?">' +
      '    <bar>added</bar>' +
      '  </rapi:insert>' +
      '</rapi:patch>'
        ).result(function (response) {
        //console.log(JSON.stringify(response, null, 2));
            response.uri.should.equal('/test/query/patch/cardinality4.xml');
            done();
        }, done);
    });

    it('should read the document patch', function (done) {
        db.documents.read({
            uris: '/test/query/patch/cardinality4.xml',
        }
        ).
            result(function (response) {
                //console.log(response);
                var document = response[0];
                var strDoc = JSON.stringify(document);
                strDoc.should.not.containEql('<bar>added</bar>');
                done();
            }, done);
    });

    it('should remove the documents', function (done) {
        dbAdmin.documents.removeAll({
            all: true
        }).
            result(function (response) {
                response.should.be.ok;
                done();
            }, done);
    });

});
