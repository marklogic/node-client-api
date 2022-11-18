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
var should = require('should');

var fs     = require('fs');
const readline = require('readline');
const path = require('path');
const os = require('os');
const fsPromises = require('fs').promise;

var marklogic = require('../');
const q = marklogic.queryBuilder;
const ctsqb = marklogic.ctsQueryBuilder;

var testconfig = require('../etc/test-config-qa.js');

const stream = require('stream');
const {expect} = require("chai");

var dbWriter = marklogic.createDatabaseClient(testconfig.dmsdkrestWriterConnection);
var dbAdmin = marklogic.createDatabaseClient(testconfig.dmsdkrestAdminConnection);
describe('queryAll-tests-1', function() {
    before(function (done) {
        this.timeout(10000);
        const selectFiles = [];

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
        //console.log(selectFiles);
        for (var file of selectFiles) {
            var fileTobeRead = dirPath + file;
            var data = fs.readFileSync(fileTobeRead, {encoding:'utf8'});
            var findCType = path.extname(fileTobeRead);
            var jsonFN1 = {
                uri: file,
                contentType: findCType === '.json' ? 'application/json': findCType === '.xml' ? 'application/xml' : 'application/text',
                collections: ['qatestsReadText'],
                content: data
            };
            //console.log('Contents ' + jsonFN1.content);
            multiDocreadable.push(jsonFN1);
        }
        multiDocreadable.push(null);
        multiDocreadable.pipe(dbWriter.documents.writeAll({
            onCompletion: ((summary) => {
                summary.docsWrittenSuccessfully.should.be.greaterThanOrEqual(6);
            })
        })); // End of pipe to writeAll - single byte
        setTimeout(()=>{done();}, 1000);
    });

    after(function (done) {
        this.timeout(10000);
        const fileName1 = path.join(__dirname, '/data/dmsdk/queryAllColl.txt');
        const fileName2 = path.join(__dirname, '/data/dmsdk/queryAllOneResult.txt');
        fs.unlink(fileName1, function (err) {
            if (err) {
                console.log(err.toString());
            }
        });
        fs.unlink(fileName2, function (err) {
            if (err) {
                console.log(err.toString());
            }
        });
        done();
    });

    it('queryAll in collection', function (done) {
        this.timeout(10000);
        const fileNamequeryAllColl = path.join(__dirname, '/data/dmsdk/queryAllColl.txt');
        const query = q.where(ctsqb.cts.collectionQuery('qatestsReadText'));
        var resqueryAllCollFile = fs.createWriteStream(fileNamequeryAllColl, {flag: 'a'});
        try {
            dbWriter.documents.queryAll(query, {
                consistentSnapshot: false,
                onCompletion: ((summary) => {
                    var soFar =  summary.urisReadSoFar;
                    var failedToRead = summary.urisFailedToBeRead;
                    var timeElapsed = summary.timeElapsed;
                    var snapshot = summary.consistentSnapshotTimestamp;

                    resqueryAllCollFile.write('soFar : ');
                    resqueryAllCollFile.write(soFar.toString());
                    resqueryAllCollFile.write('\n');

                    resqueryAllCollFile.write('failedToRead : ');
                    resqueryAllCollFile.write(failedToRead.toString());
                    resqueryAllCollFile.write('\n');

                    resqueryAllCollFile.write('snapshot : ');
                    resqueryAllCollFile.write(snapshot.toString());
                    resqueryAllCollFile.write('\n');

                    resqueryAllCollFile.end();
                })
            });
            done();
        } catch (err) {
            console.log('Error ' + err);
            //err.toString().should.equal('Error: Query needs to be a cts query.');
            done();
        }
    });

    it('verify queryAll summary report in collection',function (done) {
        this.timeout(10000);
        var arr = new Array('soFar : 5', 'failedToRead : 0', 'snapshot : ' );
        var lnCnt = 0;
        const fileName = path.join(__dirname, '/data/dmsdk/queryAllColl.txt');

        verifyqueryAllCollFileContent(fileName);
        done();
        async function verifyqueryAllCollFileContent(fileName) {
            const fileStream = fs.createReadStream(fileName);

            const rl = readline.createInterface({
                input: fileStream,
                crlfDelay: Infinity
            });
            for await (const line of rl) {
                // Each line in input txt will be successively available here as `line`.
                expect(line).to.equal(arr[lnCnt]);
                //console.log(`Line from file: ${line}`);
                lnCnt++;
            }
        }
    });

    it('queryAll with one result', function (done) {
        this.timeout(10000);
        const query = q.where(ctsqb.cts.wordQuery('Vannevar'));
        const fileName = path.join(__dirname, '/data/dmsdk/queryAllOneResult.txt');
        var resqueryAllCollFile = fs.createWriteStream(fileName, {flag: 'a'});
        //resqueryAllCollFile
        try {
            dbWriter.documents.queryAll(query, {
                consistentSnapshot: false,
                batchSize: 1,
                onCompletion: ((summary) => {
                })
            }).pipe(resqueryAllCollFile);

            done();
        } catch (err) {
            console.log('Error ' + err);
            done();
        }
    });

    it('verify queryAll one output',function (done) {
        this.timeout(10000);
        var arr = new Array('constraint1.json' );
        var lnCnt = 0;
        const fileName = path.join(__dirname, '/data/dmsdk/queryAllOneResult.txt');

        verifyqueryAllOneFileContent(fileName);
        done();
        async function verifyqueryAllOneFileContent(fileName) {
            const fileStream = fs.createReadStream(fileName);

            const rl = readline.createInterface({
                input: fileStream,
                crlfDelay: Infinity
            });
            for await (const line of rl) {
                // Each line in input txt will be successively available here as `line`.
                expect(line).to.equal(arr[lnCnt]);
                //console.log(`Line from file: ${line}`);
                lnCnt++;
            }
        }
    });

}); // End of queryAll tests 1

describe('queryAll-tests-2', function() {
    before(function (done) {
        this.timeout(10000);
        const selectFiles = [];

        var multiDocreadable = new stream.Readable({objectMode: true});
        // Handle only .json, .xml and .txt files
        var allowedFiles = ['.json', '.xml', '.txt'];

        const dirPath = path.join(__dirname, '/data/dmsdk/queryall/');

        function includeFile(fName) {
            var fileExt = path.extname(fName);
            return allowedFiles.includes(fileExt);
        }

        var files = fs.readdirSync(dirPath).filter(includeFile);
        files.forEach(file => {
            let fileStat = fs.statSync(dirPath + '/' + file).isDirectory();
            if (!fileStat) {
                selectFiles.push(file);
            }
        });
        for (var file of selectFiles) {
            var fileTobeRead = dirPath + file;
            var data = fs.readFileSync(fileTobeRead, {encoding: 'utf8'});
            var findCType = path.extname(fileTobeRead);
            var jsonFN1 = {
                uri: file,
                contentType: findCType === '.json' ? 'application/json' : findCType === '.xml' ? 'application/xml' : 'application/text',
                collections: ['multibyte'],
                content: data
            };
            //console.log('Contents ' + jsonFN1.content);
            multiDocreadable.push(jsonFN1);
        }
        multiDocreadable.push(null);
        multiDocreadable.pipe(dbWriter.documents.writeAll({
            onCompletion: ((summary) => {
                summary.docsWrittenSuccessfully.should.be.greaterThanOrEqual(6);
            })
        })); // End of pipe to writeAll - single byte
        setTimeout(() => {
            done();
        }, 1000);
    });

    after(function (done) {
        this.timeout(10000);
        const fileNameMB = path.join(__dirname, '/data/dmsdk/queryAllMBResult.txt');
        fs.unlinkSync(fileNameMB);
        done();
    });

    it('Multibyte queryAll with one result', function (done) {
        this.timeout(10000);
        try {
        const query = q.where(ctsqb.cts.collectionQuery('multibyte'));
        const fileName = path.join(__dirname, '/data/dmsdk/queryAllMBResult.txt');

        var resFile = fs.createWriteStream(fileName, {flag: 'a'});

        dbWriter.documents.queryAll(query, {
                consistentSnapshot: false,
                batchSize: 1,
                onCompletion: ((summary) => {
                })
            }).pipe(resFile);
            setTimeout(() => {
                const i = 0;
                done();
            }, 5000);
        } catch (err) {
            console.log('Error ' + err);
            done();
        }
    });

    it('verify queryAll output report for one doc',function (done) {
        this.timeout(10000);
        const fileName = path.join(__dirname, '/data/dmsdk/queryAllMBResult.txt');
        const data = fs.readFileSync(fileName, {encoding:'utf8', flag:'r'});
        var uriName = data.replace(/\s/g, "");
        expect(uriName).to.equal('multibyte1.xml');
        done();
    });
}); // End of queryAll tests 2
