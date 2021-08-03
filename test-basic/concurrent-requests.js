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

const testconfig = require('../etc/test-config.js');

const marklogic = require('../');

const dbWriter = marklogic.createDatabaseClient(testconfig.restWriterConnection);

describe('concurrent-requests test', function(){


    it('should write 1000 documents concurrently', function(done){
        for(var i=0; i<3; i++) {
            writeBatch(i,done);
        }

    });
});

const documentDescriptors = createDocumentDescriptors();
let nextDocument = 0;
function writeBatch(writerId, done) {
    if(nextDocument>=1000) {
        console.log(writerId + ' is done');
        return done();
    }
    console.log('writerId is '+writerId);
    console.log('writing batch '+nextDocument+' to '+(nextDocument+10));
    const batch = documentDescriptors.slice(nextDocument, nextDocument +10);
    nextDocument = nextDocument+10;

    dbWriter.documents.write(batch).result((output) => writeBatch(writerId, done))
        .catch((err) => console.log(err));

}

function createDocumentDescriptors() {
    const documentDescriptors = [];

    for(var i=0; i<1000; i++) {
        const temp = {
            uri: '/test/concurrent/requests/'+i+'.json',
            contentType: 'application/json',
            content: {[ 'key'+i]: 'value'+i+' 1'}
        };
        documentDescriptors.push(temp);
    }
    return documentDescriptors;
}

