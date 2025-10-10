/*
* Copyright (c) 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
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
                assert(err.toString().includes('path: invalid/v1/documents'));
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
                assert(err.toString().includes('path: /invalid/v1/documents'));
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
                assert(err.toString().includes('path: invalid/v1/documents'));
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
                assert(err.toString().includes('path: /invalid/v1/documents'));
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
                    assert(err.toString().includes('path: //invalid//v1/documents'));
                    done();
                } catch(err){
                    done(err);
                }
            });
    });
});
