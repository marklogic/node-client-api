/*
* Copyright (c) 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
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
