/*
 * Copyright (c) 2022 MarkLogic Corporation
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
var fs     = require('fs');
const path = require('path');

var marklogic = require('../');
var testconfig = require('../etc/test-config-qa.js');

const stream = require('stream');
const {expect} = require("chai");
const streamToArray = require("stream-to-array");

let resultUris = [];
let resulContents = [];
const selectFiles = [];
var uriStream = new stream.Readable();
var dbWriter = marklogic.createDatabaseClient(testconfig.dmsdkrestWriterConnection);

let inputJsonUris = [];
let inputContents = [];
function verifyArrays(arr1, arr2) {
    var isEqual = false;
    //console.log('arr length are ' + arr1.length + '     ' + arr2.length);
    if (arr1.length !== arr2.length) {
        return false;
    }
    for(var i=0; i<arr1.length; i++){
        //console.log('arr1 is ' + arr1[i]);
        for(const e of arr2) {
            //console.log('arr2 e is ' + e);
            if (e === arr1[i]) {
                isEqual = true;
                break;
            }
        }
    }
    return isEqual;
}

function verifyCurrentContents(currResContent) {
    var isContentEqual = false;
    var currResValue = Object.values(currResContent).valueOf()[0];
    // For each object in resultsContents array
    for (var i = 0; i<inputContents.length; i++) {
        var c = inputContents[i];
        var cInputValue = Object.values(c).valueOf()[0];
        if (cInputValue === currResValue) {
            isContentEqual = true;
            break;
        }
    }
    return isContentEqual;
}

describe('readAll-tests-one', function() {
    before(function (done) {
        this.timeout(20000);
        //const selectFiles = [];
        var jsonDocreadable = new stream.Readable({objectMode: true});
        var multiDocreadable = new stream.Readable({objectMode: true});
        // Handle only .json, .xml and .txt files
        var allowedFiles = ['.json', '.xml', '.txt'];

        const dirPath = path.join(__dirname, '/data/dmsdk/writeall/');

        function includeFile(fName) {
            var fileExt = path.extname(fName);
            return allowedFiles.includes(fileExt);
        }

        var files = fs.readdirSync(dirPath).filter(includeFile);
        files.forEach(file => {
            let fileStat = fs.statSync(dirPath + '/' + file).isDirectory();
            if(!fileStat) {
                selectFiles.push(file);
            }
        });

        for (var file of selectFiles) {
            var fileTobeRead = dirPath + file;
            var data = fs.readFileSync(fileTobeRead, {encoding:'utf8'});
            var findCType = path.extname(fileTobeRead);
            var jsonFN1 = {
                uri: file,
                contentType: findCType === '.json' ? 'application/json': findCType === '.xml' ? 'application/xml' : 'application/text',
                collections: ['qatestsReadAll'],
                content: data
            };
            multiDocreadable.push(jsonFN1);
        }
        multiDocreadable.push(null);
        dbWriter.documents.writeAll(multiDocreadable,{
            onCompletion: ((summary) => {
                summary.docsWrittenSuccessfully.should.be.greaterThanOrEqual(6);
            })
        }); // End of pipe to writeAll - single byte

        for (let i=0; i<10; i++) {
            const tempJson = {
                uri: '/data/dmsdk/readAll-tests-one/'+i+'.json',
                contentType: 'application/json',
                content: {['key '+i]:'value '+i}
            };
            jsonDocreadable.push(tempJson);
            // To validate / use later in tests.
            inputJsonUris.push(tempJson.uri);
            inputContents.push(tempJson.content);
        }
        jsonDocreadable.push(null);
        setTimeout(()=>{var i = 0; i++;}, 5000);
        dbWriter.documents.writeAll(jsonDocreadable,{
            onCompletion: ((summary) => {
                //console.log('OnCompleteion summary ' + summary.docsWrittenSuccessfully);
                setTimeout(()=>{var i = 0; i++;}, 1000);
                summary.docsWrittenSuccessfully.should.be.greaterThanOrEqual(10);
            })
        }); // End of pipe to writeAll
        // Use uriStream as the input to readAll()
        uriStream = new stream.PassThrough({objectMode: true});
        inputJsonUris.forEach(uri => uriStream.push(uri));
        uriStream.push(null);
        setTimeout(()=>{done();}, 5000);
    });

    after((function(done){
        this.timeout(5000);
        dbWriter.documents.remove(inputJsonUris)
            .result(function(response){
                done();
            })
            .catch(err=> done(err))
            .catch(done);
    }));

    it('readAll multple documents with batch options', function(done){
        streamToArray(dbWriter.documents.readAll(uriStream, {
                inputkind: 'Array',
                batch: 5
            }),
            function(err, arr ) {
                if (err) {
                    console.log('Error is ' + err.toString());
                }
                arr.forEach(item => {
                    //console.log('URI pushed into resultUris ' + item.uri);
                    setTimeout(()=>{var i = 0; i++;}, 3000);
                    resultUris.push(item.uri);
                    resulContents.push(item.content);
                });
                setTimeout(()=>{var i = 0; i++;}, 3000);
                expect(verifyArrays(resultUris, inputJsonUris)).to.be.true;
                for (var c of resulContents) {
                    expect(verifyCurrentContents(c)).to.be.true;
                }
            });
        done();
    });

    it('readAll one document with batch options', function(done){
        uriStream = new stream.PassThrough({objectMode: true});
        uriStream.push('dmsdk.txt');
        uriStream.push(null);
        streamToArray(dbWriter.documents.readAll(uriStream,{
                inputkind: 'Array',
                batch: 5
            }),
            function(err, arr ) {
                if (err) {
                    console.log('Error is ' + err.toString());
                }
                arr.forEach(item => {
                    //console.log('URI pushed into resultUris ' + item.uri);
                    setTimeout(()=>{var i = 0; i++;}, 3000);
                    expect(item.uri).to.equal('dmsdk.txt');
                });
            });
        done();
    });

    //Verify no errors when readAll has no Uris to read
    it('readAll no document Uris', function(done){
        uriStream = new stream.PassThrough({objectMode: true});
        uriStream.push(null);
        var f = function noURIS() {
            dbWriter.documents.readAll(uriStream,{
                inputkind: 'Array',
                batch: 5
            });
        };
    expect(f).to.not.throw();
    done();
    });
}); // End of readAll tests
