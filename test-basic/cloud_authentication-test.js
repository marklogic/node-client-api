/*
 * Copyright (c) 2023 MarkLogic Corporation
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

const marklogic = require('../');
let assert = require('assert');
const testconfig = require("../etc/test-config");
const mlutil = require("../lib/mlutil");
const expect = require('chai').expect;

describe('cloud-authentication tests', function() {
    it('should throw error without apiKey.', function(done){
        try{
            marklogic.createDatabaseClient({
                host:     'invalid',
                authType: 'cloud'
            });
        } catch(error) {
            assert(error.toString().includes('apiKey needed for MarkLogic cloud authentication.'));
            done();
        }
    });

    it('basePath and database should be included in the endpoint', function(done){
        testconfig.restWriterConnectionWithBasePath.basePath = '//invalid//';
        testconfig.restWriterConnectionWithBasePath.database = 'test-database';
        testconfig.restWriterConnectionWithBasePath.authType = 'cloud';
        testconfig.restWriterConnectionWithBasePath.apiKey = 'apiKey';
        const returnValue = mlutil.newRequestOptions(testconfig.restWriterConnectionWithBasePath, 'test-endpoint').path;
        try {
            assert(returnValue.toString() === '//invalid/test-endpoint?database=test-database');
            done();
        } catch(error){
            done(error);
        }
    });

    it('should throw error with invalid apiKey.', function (done) {
        let db = marklogic.createDatabaseClient({
            host: 'support.beta.marklogic.cloud',
            authType: 'cloud',
            apiKey: 'invalid'
        });
        let writeObject = {uri: '/test.json', content: '{"key":"value"}'};

        try {
            // Also verified that it throws 'Error: User's API Key is expired.' when API key has expired a few seconds ago.
            expect(()=>db.documents.write(writeObject).throws(Error('API Key is not valid.')));
            done();
        } catch (error) {
            done(error);
        }
    });
});
