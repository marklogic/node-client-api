/*
* Copyright © 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/

const testconfig = require("../etc/test-config");
const marklogic = require("../lib/marklogic");
const should = require('should');
let dbWriter = marklogic.createDatabaseClient(testconfig.restWriterConnection);
let assert = require('assert');

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
                let stringResponse = response.toString();
                assert(stringResponse.includes("total"));
                assert(stringResponse.includes("start"));
                assert(stringResponse.includes("page-length"));
            })
            .then(() => done())
            .catch(error=>done(error));
        } catch(error){
            done(error);
        }
    });

    it('requestOptions and clientObject should not be cached.', function (done) {
        testconfig.restWriterConnection.port = 5678;
        let dbWriter2 = marklogic.createDatabaseClient(testconfig.restWriterConnection);
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
});
