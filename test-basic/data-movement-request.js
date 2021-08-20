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
'use strict';
const testconfig = require('../etc/test-config.js');
const marklogic = require('../');
const dbWriter = marklogic.createDatabaseClient(testconfig.restWriterConnection);

const Stream = require('stream');
const readable = new Stream.Readable({objectMode: true});
const batchSize = 10;
let requesterCount = 0;

describe('data-movement-requests test', function(){

    it('should write 1000 documents',  function (done){

        createInput();
        for(var i=0; i<3; i++) {
            requesterCount++;
            writeDocs(i, done);
        }
    });
});

function createInput() {

    for(let i=0; i<1000; i++) {
        const temp = {
            uri: '/test/dataMovement/requests/'+i+'.json',
            contentType: 'application/json',
            content: {[ 'key'+i]: 'value'+i}
        };
        readable.push(temp);
    }
    readable.push(null);

}

function writeDocs(writerId, done) {

    const writeBatchArray = [];
    a:
    for(let i=0; i<batchSize; i++) {
        const record = readable.read();
        if(record === null) {
            switch(writeBatchArray.length) {
                case 0: { finishWriter(writerId, done); break a;}
                case batchSize: {dbWriter.documents.write(writeBatchArray,writeDocs(writerId, done));break a;}
                default: {dbWriter.documents.write(writeBatchArray) .result((out) => finishWriter(writerId, done)) .catch((err) => done(err));break a;}
            }
        }
        writeBatchArray.push(record);
    }

    if(writeBatchArray.length !== 0) {
        dbWriter.documents.write(writeBatchArray).result((output) => writeDocs(writerId, done))
            .catch((err) => console.log(err));
    }
}

function finishWriter(writerId, done) {
    requesterCount--;
    if(requesterCount<1) {
        done();
    }
}

