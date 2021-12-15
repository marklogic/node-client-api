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
const Stream = require('stream');
const streamToArray = require('stream-to-array');
let uriStream = new Stream.Readable();
let urisList = [];
let result = new Set();
let summaryValue = null;

describe('data movement readAll', function() {
    before(function (done) {
        let readable = new Stream.Readable({objectMode: true});
        for(let i=0; i<10000; i++) {
            const temp = {
                uri: '/test/dataMovement/requests/readAll/'+i+'.json',
                contentType: 'application/json',
                content: {['key '+i]:'value '+i}
            };
            readable.push(temp);
            urisList.push(temp.uri);
        }
        readable.push(null);
        readable.pipe(dbWriter.documents.writeAll());
        setTimeout(()=>{done();}, 3000);
    });

    beforeEach(function(done){
        uriStream = new Stream.PassThrough({objectMode: true});
        urisList.forEach(uri => uriStream.push(uri));
        setTimeout(()=>{uriStream.push(null);done();}, 3000);
    });

    after((function(done){
        dbWriter.documents.remove(urisList)
            .result(function(){
                done();
            })
            .catch(err=> done(err))
            .catch(done);
    }));

    it('should readAll documents with empty options', function(done){

        streamToArray(uriStream.pipe(dbWriter.documents.readAll()),
            function(err, arr ) {
                if(err){
                    done(err);
                }
                arr.forEach(item=> result.add(item.uri)
                );
                checkResult(done);
            });
    });

    it('should readAll documents with onCompletion option', function(done){

        streamToArray(uriStream.pipe(dbWriter.documents.readAll({
                onCompletion: ((summary) => summaryValue = summary)
        })),
            function(err, arr ) {
                if(err){
                    done(err);
                }
                arr.forEach(item=> result.add(item.uri));
                checkSummary(summaryValue, done);
            });
    });

    it('should throw error with invalid inputKind option', function(done){
        try{
            dbWriter.documents.readAll({inputKind:10});
        } catch(err){
            err.toString().should.equal('Error: Invalid value for inputKind. Value must be array or string.');
            done();
        }
    });

    it('should readAll documents with inputKind option as string', function(done){
        streamToArray(uriStream.pipe(dbWriter.documents.readAll({
                inputKind: 'String'
            })),
            function(err, arr ) {
                if(err){
                    done(err);
                }
                arr.forEach(item=> result.add(item.uri)
                );
                checkResult(done);
            });
    });

    it('should readAll documents with inputKind option as array', function(done){
        uriStream = new Stream.Readable({objectMode: true});
        for(let i=0; i+1000<=urisList.length; i=i+1000){
            uriStream.push(urisList.slice(i,i+1000));
        }
        uriStream.push(null);

        streamToArray(uriStream.pipe(dbWriter.documents.readAll({
                inputKind: 'Array'
            })),
            function(err, arr ) {
                if(err){
                    done(err);
                }
                arr.forEach(item=> result.add(item.uri)
                );
                checkResult(done);
            });
    });

    it('should throw error with invalid outputStreamType option', function(done){
        try{
            dbWriter.documents.readAll({outputStreamType:10});
        } catch(err){
            err.toString().should.equal('Error: Invalid value for outputStreamType. Value must be chunked or object.');
            done();
        }
    });

    it('should readAll documents with outputStreamType option as object', function(done){
        streamToArray(uriStream.pipe(dbWriter.documents.readAll({
                outputStreamType: 'Object'
            })),
            function(err, arr ) {
                if(err){
                    done(err);
                }
                arr.forEach(item=> result.add(item.uri)
                );
                checkResult(done);
            });
    });

    it('should readAll documents with outputStreamType option as chunked', function(done){
        streamToArray(uriStream.pipe(dbWriter.documents.readAll({
                outputStreamType: 'chunked'
            })),
            function(err, arr ) {
                if(err){
                    done(err);
                }
                arr.forEach(item=> result.add(JSON.parse(item).uri));
                checkResult(done);
            });
       /* uriStream.pipe(dbWriter.documents.readAll({
            outputStreamType: 'chunked'
        })).pipe(fs.createWriteStream('file.txt'));
       */
    });

    it('should throw error with invalid batchSize option', function(done){
        try{
            dbWriter.documents.readAll({batchSize:-1});
        } catch(err){
            err.toString().should.equal('Error: Invalid batchSize. batchSize cannot be less than or equal to 0.');
            done();
        }
    });

    it('should readAll documents with batchSize option', function(done){
        streamToArray(uriStream.pipe(dbWriter.documents.readAll({
                batchSize: 100
            })),
            function(err, arr ) {
                if(err){
                    done(err);
                }
                arr.forEach(item=> result.add(item.uri)
                );
                checkResult(done);
            });
    });

    it('should throw error with invalid batchSize and inputKind as array option', function(done){
        try{
            dbWriter.documents.readAll({batchSize:10, inputKind:'array'});
        } catch(err){
            err.toString().should.equal('Error: batchSize not expected when inputKind is array.');
            done();
        }
    });

    it('should throw error with invalid concurrentRequests option', function(done){
        try{
            dbWriter.documents.readAll({concurrentRequests: {multipleOf: 'invalid', multiplier: 4}});
        } catch(err){
            err.toString().should.equal('Error: Invalid value for multipleOf. Value must be forests or hosts.');
            done();
        }
    });

    it('should readAll documents with concurrentRequests option', function(done){
        streamToArray(uriStream.pipe(dbWriter.documents.readAll({
                concurrentRequests: {multipleOf: 'hosts', multiplier: 4}
            })),
            function(err, arr ) {
                if(err){
                    done(err);
                }
                arr.forEach(item=> result.add(item.uri)
                );
                checkResult(done);
            });
    });
});

function checkResult(done){
    result.size.should.equal(10000);
    for(let i=0; i<urisList.length; i++){
        result.has(urisList[i]).should.equal(true);
    }
    setTimeout(()=>{result.clear();done();}, 4000);
}

function checkSummary(summary, done) {
    summary.docsReadSuccessfully.should.be.equal(10000);
    summary.docsFailedToBeRead.should.be.equal(0);
    summary.timeElapsed.should.be.greaterThanOrEqual(0);
    checkResult(done);
}
