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
const ctsQb = marklogic.ctsQueryBuilder;
const dbWriter = marklogic.createDatabaseClient(testconfig.restWriterConnection);
const q = marklogic.queryBuilder;
const Stream = require('stream');
const streamToArray = require('stream-to-array');

let readable = new Stream.Readable({objectMode: true});
let uris = [];
let result = new Set();
const query = q.where(ctsQb.cts.directoryQuery('/test/dataMovement/requests/queryAll/'));

describe('data-movement-requests-queryAll test', function() {
    beforeEach(function (done) {
        readable = new Stream.Readable({objectMode: true});
        uris = [];
        for(let i=0; i<10000; i++) {
            const temp = {
                uri: '/test/dataMovement/requests/queryAll/'+i+'.json',
                contentType: 'application/json',
                content: {['key '+i]:'value '+i}
            };
            readable.push(temp);
            uris.push(temp.uri);
        }
        readable.push(null);
        readable.pipe(dbWriter.documents.writeAll());
        setTimeout(()=>{done();}, 3000);
    });

    afterEach((function(done){
        dbWriter.documents.remove(uris)
            .result(function(response){
                done();
            })
            .catch(err=> done(err))
            .catch(done);
    }));

    it('queryAll should throw error if queryType is not cts', function(done){
        try{
            const query = q.directory('/test/dataMovement/requests/queryAll/');
            dbWriter.documents.queryAll(query);
        } catch(err){
            err.toString().should.equal('Error: Query needs to be a cts query.');
            done();
        }
    });

    it('should queryAll documents with empty options', function(done){

        streamToArray(dbWriter.documents.queryAll(query),
            function(err, arr ) {
                arr.forEach(item=> result.add((item)));
                checkResult(done);
        });
    });

    it('should queryAll documents with onCompletion option',  function (done){

        streamToArray(dbWriter.documents.queryAll(query, {
                onCompletion: ((summary) => {
                    summary.urisReadSoFar.should.be.equal(10000);
                    summary.urisFailedToBeRead.should.be.equal(0);
                    summary.timeElapsed.should.be.greaterThanOrEqual(0);
                })
            }),
            function(err, arr ) {
                arr.forEach(item=> result.add((item)));
                checkResult(done);
            });
    });
});

function checkResult(done){
    result.size.should.equal(10000);
    for(let i=0; i<uris.length; i++){
        result.has(uris[i]).should.equal(true);
    }
    setTimeout(()=>{done();}, 3000);
}
