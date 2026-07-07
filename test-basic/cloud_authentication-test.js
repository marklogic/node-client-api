/*
* Copyright (c) 2015-2026 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
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
            done(new Error('Expecting an error to be thrown due to missing apiKey'));
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

    // skip for now, support.beta.marklogic.cloud is not working for me. Not sure if this should be in test suite anyway.
    it.skip('should throw error with invalid apiKey.', function (done) {
        this.timeout(10000);
        let db = marklogic.createDatabaseClient({
            host: 'support.beta.marklogic.cloud',
            authType: 'cloud',
            apiKey: 'invalid'
        });
        let writeObject = {uri: '/test.json', content: '{"key":"value"}'};

        try {
            // Also verified that it throws 'Error: User's API Key is expired.' when API key has expired a few seconds ago.
            expect(()=>db.documents.write(writeObject).throws(Error('API Key is not valid.')));
        } catch (error) {
            done(error);
        }
    });

    it('should URL-encode accessTokenDuration when building the token request path', function() {
        const requester = require('../lib/requester');
        const https = require('https');

        const operation = {
            client: {
                connectionParams: {
                    host: 'example.marklogic.cloud',
                    apiKey: 'test-key',
                    accessTokenDuration: '100&extra=injected'
                }
            }
        };

        let capturedPath;
        const originalRequest = https.request;
        https.request = (options) => {
          capturedPath = options.path;
          throw new Error('stop');
        };

        try {
          requester.getAccessToken(operation);
        } catch (e) {
          // ignore stubbed error
        } finally {
          https.request = originalRequest;
        }
          assert.strictEqual(capturedPath, '/token?duration=100%26extra%3Dinjected');
    });

    it('should throw an error when accessTokenDuration is not a positive integer', function() {
        try {
            marklogic.createDatabaseClient({
                host: 'example.marklogic.cloud',
                authType: 'cloud',
                apiKey: 'test-key',
                accessTokenDuration: '100&extra=injected'
            });
            throw new Error('Expected validation error was not thrown');
        } catch (error) {
            assert(error.message.includes('accessTokenDuration must be a positive integer'),
                'Error message should mention accessTokenDuration validation');
        }
    });
});
