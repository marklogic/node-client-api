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
const writable = new Stream.Writable({objectMode: true});

describe('data-movement-requests test', function(){

    it('should write 1000 documents', function(done){

        writable._write = (object, encoding, done) => {
            done();
        };

        readable.pipe(writable);
        createDocumentDescriptors();
        readable.on('readable', function() {
            writeDocs(readable.read(), done);
        });
        done();
    });
});

function createDocumentDescriptors() {

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

function writeDocs(record, done) {
    if(record === null) {
        return done();
    }

    dbWriter.documents.write(record).result((output) => writeDocs(readable.read(), done))
        .catch((err) => console.log(err));

}

