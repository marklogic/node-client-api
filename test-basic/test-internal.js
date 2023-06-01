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

    it('test internal sendRequest GET', function(done){
        try {
            dbWriter.internal.sendRequest(
                "/v1/internal/forestinfo",
                requestOptions => {
                    requestOptions.method = "GET";
                    requestOptions.headers = {"Accept": "application/json"}
                }
            )
            .result(function(response){
                for(let i=0; i<response.length; i++){
                    should.exist(response[i].host);
                    should.exist(response[i].name);
                    should.exist(response[i].id);
                }
            }).then(() => done())
            .catch(error=>done(error));
        } catch(error){
            done(error);
        }
    });

    it('test internal sendRequest POST', function(done){
        try {
            dbWriter.internal.sendRequest(
                "/v1/search",
                requestOptions => {
                    requestOptions.method = "POST";
                    requestOptions.headers = {"Accept": "application/json", "Content-type": "application/json"};
                },
                null
            )
            .result(function(response){
                should.exist(response.total);
                should.exist(response.start);
                should.exist(response['page-length']);
                for(let i=0; i<response.length; i++){
                    should.exist(response.results[i]);
                }
            })
            .then(() => done())
            .catch(error=>done(error));
        } catch(error){
            done(error);
        }
    });

    it('test internal sendRequest without path', function(done){
        try {
            dbWriter.internal.sendRequest(
                null,
                requestOptions => {
                    requestOptions.method = "GET";
                    requestOptions.headers = {"Accept": "application/json"}
                }
            )
        } catch(error){
            should.equal(error.message, 'Path is needed to send request.');
            done();
        }
    });

    it('test internal sendRequest without optional callbacks', function(done){
        try {
            dbWriter.internal.sendRequest(
                "/v1/search"
            )
            .result(function(response){
                should.exist(response.total);
                should.exist(response.start);
                should.exist(response['page-length']);
                for(let i=0; i<response.length; i++){
                    should.exist(response.results[i]);
                }
            })
            .then(() => done())
            .catch(error=>done(error));
        } catch(error){
            done(error);
        }
    });
});
