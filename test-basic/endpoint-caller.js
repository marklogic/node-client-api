/*
 * Copyright (c) 2021 MarkLogic Corporation
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

var marklogic = require('../');
var fs = require('fs');
var testconfig = require('../etc/test-config.js');
var expect = require('chai').expect;
var dbWriter = marklogic.createDatabaseClient(testconfig.restWriterConnection);

describe('Endpoint caller', function() {

    it('moduleInitSjs endpoint', function(done) {
        const serviceDeclaration = JSON.parse(fs.readFileSync('test-basic-proxy/ml-modules/generated/moduleInitSjs/service.json', {encoding: 'utf8'}));
        const endpointDeclaration = JSON.parse(fs.readFileSync('test-basic-proxy/ml-modules/generated/moduleInitSjs/initializer.api', {encoding: 'utf8'}));
        endpointDeclaration.endpoint = serviceDeclaration.endpointDirectory+'initializer'+'.sjs';
        const endpointCaller = dbWriter.endpointCaller(endpointDeclaration);
        const params = {param1:true, param2: '1.2', param3: [1.2, 3.4], param4:[5, 6] };

        endpointCaller.call(params)
            .then(output => {
                expect(output).to.eql(true);
                done();
            })
            .catch(err => {
                expect.fail(err.toString());
                done();
            });
    });

    it('moduleInitXqy endpoint', function(done) {
        const serviceDeclaration = JSON.parse(fs.readFileSync('test-basic-proxy/ml-modules/generated/moduleInitXqy/service.json', {encoding: 'utf8'}));
        const endpointDeclaration = JSON.parse(fs.readFileSync('test-basic-proxy/ml-modules/generated/moduleInitXqy/initializer.api', {encoding: 'utf8'}));
        endpointDeclaration.endpoint = serviceDeclaration.endpointDirectory+'initializer'+'.xqy';
        const endpointCaller = dbWriter.endpointCaller(endpointDeclaration);
        const params = {param1:true, param2: '1.2', param3: [1.2, 3.4], param4:[5, 6] };

        endpointCaller.call(params)
            .then(output => {
                expect(output).to.eql(true);
                done();
            })
            .catch(err => {
                expect.fail(err.toString());
                done();
            });
    });

    it('postOfMultipartForDocumentArray1 endpoint', function(done) {
        const serviceDeclaration = JSON.parse(fs.readFileSync('test-basic-proxy/ml-modules/generated/postOfMultipartForDocument/service.json',
            {encoding: 'utf8'}));
        const endpointDeclaration = JSON.parse(fs.readFileSync('test-basic-proxy/ml-modules/generated/postOfMultipartForDocument/postOfMultipartForDocumentArray1.api',
            {encoding: 'utf8'}));
        endpointDeclaration.endpoint = serviceDeclaration.endpointDirectory+'postOfMultipartForDocumentArray1'+'.sjs';
        const endpointCaller = dbWriter.endpointCaller(endpointDeclaration);
        const params = {param1:[{"root":{"child":"text1"}}, {"root":{"child":"text2"}}]};

        endpointCaller.call(params)
            .then(output => {
                expect(output).to.eql(["text1", 1]);
                done();
            })
            .catch(err => {
                expect.fail(err.toString());
                done();
            });
    });

    it('postOfUrlencodedForDocumentArray1 endpoint', function(done) {
        const serviceDeclaration = JSON.parse(fs.readFileSync('test-basic-proxy/ml-modules/generated/postOfUrlencodedForDocument/service.json',
            {encoding: 'utf8'}));
        const endpointDeclaration = JSON.parse(fs.readFileSync('test-basic-proxy/ml-modules/generated/postOfUrlencodedForDocument/postOfUrlencodedForDocumentArray1.api',
            {encoding: 'utf8'}));
        endpointDeclaration.endpoint = serviceDeclaration.endpointDirectory+'postOfUrlencodedForDocumentArray1'+'.mjs';
        const endpointCaller = dbWriter.endpointCaller(endpointDeclaration);
        const params = {param1:[1.2, 3.4]};

        endpointCaller.call(params)
            .then(output => {
                expect(output).to.eql(["text1", 1]);
                done();
            })
            .catch(err => {
                expect.fail(err.toString());
                done();
            });
    });
});
