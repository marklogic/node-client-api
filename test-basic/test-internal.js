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

const testconfig = require("../etc/test-config");
const marklogic = require("../lib/marklogic");
const should = require('should');
let dbWriter = marklogic.createDatabaseClient(testconfig.restWriterConnection);

describe('internal tests', function() {

    after((function(done){
        marklogic.releaseClient(dbWriter);
        done();
    }));

    it('test internal object exists', function(done){

        try {
            should.exist(dbWriter.internal);
            done();
        } catch(error){
            done(error);
        }
    });

    it('test newRequestOptions creation', function(done){
        const requestOptions = dbWriter.internal.newRequestOptions('/v1/ping');
        requestOptions.method = 'POST';
        requestOptions.headers = {
            'Accept':       'application/json',
            'Content-Type': 'application/json'
        };
        try {
            should.deepEqual(requestOptions.path, '/v1/ping');
            should.deepEqual(requestOptions.headers.Accept, 'application/json');
            should.deepEqual(requestOptions.headers['Content-Type'], 'application/json');
            done();
        } catch(error){
            done(error);
        }
    });

    it('test internal sendRequest', function(done){
        const requestOptions = dbWriter.internal.newRequestOptions('/v1/internal/forestinfo');
        requestOptions.method = 'GET';
        requestOptions.headers = {
            'Accept':       'application/json'
        };
        try {
            should.deepEqual(requestOptions.path, '/v1/internal/forestinfo');
            should.deepEqual(requestOptions.method, 'GET');
            should.deepEqual(requestOptions.headers.Accept, 'application/json');
            dbWriter.internal.sendRequest(requestOptions, 'read forestInfo','single', 'empty')
                .result(function(response){
                    for(let i=0; i<response.length; i++){
                        should.exist(response[i].host);
                        should.exist(response[i].name);
                        should.exist(response[i].id);
                    }
                }).then(() => done())
                .catch(e=>done(e));
        } catch(error){
            done(error);
        }
    });

    it('test newRequestOptions creation with optional database and basePath', function(done){
        testconfig.restWriterConnection.basePath = '/test-basePath';
        testconfig.restWriterConnection.database = 'test-database';
        dbWriter = marklogic.createDatabaseClient(testconfig.restWriterConnection);
        const requestOptions = dbWriter.internal.newRequestOptions('/v1/ping');
        requestOptions.method = 'POST';
        requestOptions.headers = {
            'Accept':       'application/json',
            'Content-Type': 'application/json'
        };
        try {
            should.deepEqual(requestOptions.path, '/test-basePath/v1/ping?database=test-database');
            done();
        } catch(error){
            done(error);
        }
    });
});
