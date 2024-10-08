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
var fs = require('fs');

var marklogic = require('../');

var db = marklogic.createDatabaseClient(testconfig.restReaderConnection);
var dbWriter = marklogic.createDatabaseClient(testconfig.restWriterConnection);
var dbEval = marklogic.createDatabaseClient(testconfig.restEvaluatorConnection);
var dbAdmin = marklogic.createDatabaseClient(testconfig.restAdminConnection);

describe('Xquery invoke test', function () {

    var fsPath = __dirname + '/data/sourceSimple.xqy';
    var invokePath = '/ext/invokeTest/sourceSimple.xqy';

    before(function (done) {
        this.timeout(10000);
        dbAdmin.config.extlibs.write({
            path: invokePath, contentType: 'application/xquery', source: fs.createReadStream(fsPath)
        }).
            result(function (response) {
                done();
            }, done);
    });

    after(function (done) {
        dbAdmin.config.extlibs.remove(invokePath).
            result(function (response) {
                done();
            }, done);
    });

    it('should do simple xquery invoke', function (done) {
        dbEval.invoke(invokePath).result(function (values) {
            //console.log(values);
            values[0].value.should.equal('hello world');
            done();
        }, done);
    });

});
