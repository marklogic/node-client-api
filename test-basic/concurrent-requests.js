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

var testconfig = require('../etc/test-config.js');

var marklogic = require('../');

var dbWriter = marklogic.createDatabaseClient(testconfig.restWriterConnection);

describe('concurrent-requests test', function(){


    it('should write 1000 documents concurrently', function(done){
        for(var i=0; i<3; i++) {
            writeBatch(i,0);
        }

        done();
    });
});


function writeBatch(writerId, nextDocument) {
    if(nextDocument>=1000) {
        console.log(writerId + ' is done');
        return;
    }
    var documentDescriptors = createDocumentDescriptors();
    console.log('writerId is '+writerId);
    console.log('writing batch '+nextDocument+' to '+(nextDocument+10));
    var batch = documentDescriptors.slice(nextDocument, nextDocument +10);
    nextDocument = nextDocument+10;

    dbWriter.documents.write(batch).result(writeBatch(writerId, nextDocument)).catch();

}

function createDocumentDescriptors() {
    var documentDescriptors = [];

    for(var i=0; i<1000; i++) {
        var temp = {
            uri: '/test/concurrent/requests'+i+'.json',
            contentType: 'application/json',
            content: new Buffer('{"key"'+i+':"value'+i+' 1"}')
        };
        documentDescriptors.push(temp);
    }
    return documentDescriptors;
}

