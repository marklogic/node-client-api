/*
 * Copyright (c) 2020 MarkLogic Corporation
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

const should = require('should');
const testconfig = require('../etc/test-config.js');
const marklogic = require('../');
const dbWriter = marklogic.createDatabaseClient(testconfig.restWriterConnection);
const restAdminDB = marklogic.createDatabaseClient(testconfig.restAdminConnection);
const Stream = require('stream');
const streamToArray = require('stream-to-array');
const fs = require('fs');
const expect = require('chai').expect;

let uriStream = new Stream.PassThrough({objectMode: true});
let urisList = [];
let result = new Set();
let summaryValue = null;
let categoriesUrisList = [];
let xqyTransformName = 'flagParam';
let xqyTransformPath = './test-basic/data/flagTransform.xqy';
let readable = new Stream.Readable({objectMode: true});
let transformStream = new Stream.PassThrough({objectMode: true});
let uris = [];

describe('data movement transformAll', function() {

    before(function (done) {
        restAdminDB.config.transforms.write(xqyTransformName, 'xquery', fs.createReadStream(xqyTransformPath))
            .result(function(response){})
            .then(function(documents){
                uris = [];
                for(let i=0; i<100; i++) {
                    const temp = {
                        uri: '/test/dataMovement/requests/transformAll/'+i+'.json',
                        contentType: 'application/json',
                        content: {['key '+i]:'value '+i}
                    };
                    readable.push(temp);
                    transformStream.push(temp.uri);
                    uris.push(temp.uri);
                }
                readable.push(null);
                transformStream.push(null);

                readable.pipe(dbWriter.documents.writeAll());
            })
            .then(function(documents){
                done();
            });
    });

    after((function (done) {
        dbWriter.documents.remove(uris)
            .result(function (response) {
                done();
            })
            .catch(err => done(err))
            .catch(done);
    }));

    it('should transformAll  documents ', done => {
        transformStream.pipe(dbWriter.documents.transformAll({
            transform: [xqyTransformName, {flag:'tested1'}],
            onCompletion: ((summary) => {
                console.log(summary)
                done();
            })
        }));

    });
});
