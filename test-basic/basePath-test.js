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

const testconfig = require('../etc/test-config.js');
const marklogic = require('../');
let assert = require('assert');
let writeObject = {
    uri: '/write/string1.json',
    contentType: 'application/json',
    content: '{"key1":"value 1"}'
};

describe('basePath tests', function() {

    it('basePath without slash(s)', function(done){
        testconfig.restWriterConnectionWithBasePath.basePath = 'invalid';
        const dbWriter = marklogic.createDatabaseClient(testconfig.restWriterConnectionWithBasePath);
        dbWriter.documents.write(writeObject)
            .result(function(response){})
            .catch(err=>
            {
                assert(err.toString().includes('basePath invalid/v1/documents'));
                done();
            });
    });

    it('basePath with slash', function(done){
        testconfig.restWriterConnectionWithBasePath.basePath = '/invalid';
        const dbWriter = marklogic.createDatabaseClient(testconfig.restWriterConnectionWithBasePath);
        dbWriter.documents.write(writeObject)
            .result(function(response){})
            .catch(err=>
            {
                assert(err.toString().includes('basePath invalid/v1/documents'));
                done();
            });
    });

    it('basePath with trailing slash', function(done){
        testconfig.restWriterConnectionWithBasePath.basePath = 'invalid/';
        const dbWriter = marklogic.createDatabaseClient(testconfig.restWriterConnectionWithBasePath);
        dbWriter.documents.write(writeObject)
            .result(function(response){})
            .catch(err=>
            {
                assert(err.toString().includes('basePath invalid/v1/documents'));
                done();
            });
    });

    it('basePath with starting and trailing slashes', function(done){
        testconfig.restWriterConnectionWithBasePath.basePath = '/invalid/';
        const dbWriter = marklogic.createDatabaseClient(testconfig.restWriterConnectionWithBasePath);
        dbWriter.documents.write(writeObject)
            .result(function(response){})
            .catch(err=>
            {
                assert(err.toString().includes('basePath invalid/v1/documents'));
                done();
            });
    });

    it('basePath with multiple starting and trailing slashes', function(done){
        testconfig.restWriterConnectionWithBasePath.basePath = '//invalid//';
        const dbWriter = marklogic.createDatabaseClient(testconfig.restWriterConnectionWithBasePath);
        dbWriter.documents.write(writeObject)
            .result(function(response){})
            .catch(err=>
            {
                try{
                    assert(err.toString().includes('basePath /invalid//v1/documents'));
                    done();
                } catch(err){
                    done(err);
                }
            });
    });
});
