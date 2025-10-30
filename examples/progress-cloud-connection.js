/*
* Copyright (c) 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/

/* This file provides an example for the users to help them connect to Progress cloud using the apiKey and host
and writes a document in database - Documents */

const marklogic = require('../');

const db = marklogic.createDatabaseClient({
    // The below key-value pairs are required
    apiKey:     'changeme',
    host:     'example.beta.progress.com',
    authType: 'cloud',
    // basePath is optional.
    basePath: '/progress/marklogic/test',
    // accessTokenDuration (in seconds) is optional and can be used to customize the expiration of the access token.
    accessTokenDuration: 10
});

const writeObject = {
    uri: '/write/string1.json',
    contentType: 'application/json',
    content: '{"key1":"value 1"}'
};
db.documents.write(writeObject)
    .result(function(){})
    .then(function() {
        marklogic.releaseClient(db);
    })
    .catch(err => {throw new Error(err);});
