/*
* Copyright © 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
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
const { expect } = require('chai');

var transformuris = [];
var batchuris = [];

var db = marklogic.createDatabaseClient(testconfig.dmsdkrestReaderConnection);
var dbWriter = marklogic.createDatabaseClient(testconfig.dmsdkrestWriterConnection);
var dbAdmin = marklogic.createDatabaseClient(testconfig.dmsdkrestAdminConnection);
describe('DMSDK writeAll-tests', function () {
    var transformName = 'dmsdk-timestamp';
    before(function (done) {
        this.timeout(10000);
        var transformPath = __dirname + '/data/dmsdk/transform/write-transform.sjs';

        dbAdmin.config.transforms.write({
            name: transformName, format: 'javascript', source: fs.createReadStream(transformPath)
        }).result(function (response) {
            db.config.transforms.list().result(function (response) {
                var installedTransforms = JSON.stringify(response, null, 2);
                expect(installedTransforms).to.have.string(transformName);
            }, function (error) {
                done(error);
            }); done();
        }, done);
    }); // end of before

    // write docs of different formats
    it('writeAll different formats', function (done) {
        this.timeout(10000);
        const selectFiles = [];

        var multiDocreadable = new stream.Readable({ objectMode: true });
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
            if (!fileStat) {
                selectFiles.push(file);
            }
        });
        for (var file of selectFiles) {
            var fileTobeRead = dirPath + file;
            var data = fs.readFileSync(fileTobeRead, { encoding: 'utf8' });
            var findCType = path.extname(fileTobeRead);
            var jsonFN1 = {
                uri: file,
                contentType: findCType === '.json' ? 'application/json' : findCType === '.xml' ? 'application/xml' : 'application/text',
                collections: ['qatestsText'],
                content: data
            };
            multiDocreadable.push(jsonFN1);
        }
        multiDocreadable.push(null);

        dbWriter.documents.writeAll(multiDocreadable, {
            onBatchSuccess: ((progressSoFar, documents) => {
                try {
                    progressSoFar.docsWrittenSuccessfully.should.be.greaterThanOrEqual(1);
                    progressSoFar.docsFailedToBeWritten.should.be.equal(0);
                    progressSoFar.timeElapsed.should.be.greaterThanOrEqual(0);
                    documents.length.should.equal(5);
                } catch (err) {
                    done(err);
                }
            }),
            onCompletion: ((summary) => {
                summary.docsWrittenSuccessfully.should.be.equal(5);
                summary.docsFailedToBeWritten.should.be.equal(0);
                summary.timeElapsed.should.be.greaterThanOrEqual(0);
            })
        }); // End of pipe to writeAll
        setTimeout(() => {
            done();
        }, 3000);
    }); // End of test case

    // write binary doc
    it('writeAll binary format', function (done) {
        this.timeout(10000);
        var multiDocreadable = new stream.Readable({ objectMode: true });
        var filename = __dirname + '/data/121-GIF-Image-GIF-gif_sample1.gif';
        var fileContents = '';

        var data = fs.readFileSync(filename);

        const jsonFN1 = {
            uri: '/data/121-GIF-Image-GIF-gif_sample1.gif',
            contentType: 'image/gif',
            collections: ['qatestsBinary'],
            directory: '/dmsdktest/',
            content: data
        };
        multiDocreadable.push(jsonFN1);
        multiDocreadable.push(null);
        dbWriter.documents.writeAll(multiDocreadable, {
            onBatchSuccess: ((progressSoFar, documents) => {
                try {
                    progressSoFar.docsWrittenSuccessfully.should.be.greaterThanOrEqual(1);
                    progressSoFar.docsFailedToBeWritten.should.be.equal(0);
                    progressSoFar.timeElapsed.should.be.greaterThanOrEqual(0);
                } catch (err) {
                    done(err);
                }
            }),
            onCompletion: ((summary) => {
                summary.docsWrittenSuccessfully.should.be.equal(1);
                summary.docsFailedToBeWritten.should.be.equal(0);
                summary.timeElapsed.should.be.greaterThanOrEqual(0);
            })

        });
        setTimeout(() => {
            done();
        }, 3000);
    });

    // write docs with SJS transforms
    it('writeAll with sjs transform', function (done) {
        this.timeout(10000);
        var multiDocreadable = new stream.Readable({ objectMode: true });

        for (let i = 0; i < 10; i++) {
            const temp = {
                uri: '/qa/test/dmsdk/transforms/' + i + '.json',
                contentType: 'application/json',
                collections: ['qatestsTransform'],
                content: { ['key ' + i]: 'value ' + i }
            };
            multiDocreadable.push(temp);
            transformuris.push(temp.uri);
        }
        multiDocreadable.push(null);

        dbWriter.documents.writeAll(multiDocreadable, {
            transform: [transformName, { title: 'new title', myInt: 2, myBool: true }],
            onBatchSuccess: ((progressSoFar, documents) => {
                try {
                    progressSoFar.docsWrittenSuccessfully.should.be.greaterThanOrEqual(1);
                    progressSoFar.docsFailedToBeWritten.should.be.equal(0);
                    progressSoFar.timeElapsed.should.be.greaterThanOrEqual(0);
                    documents.length.should.equal(10);
                } catch (err) {
                    done(err);
                }
            }),
            onCompletion: ((summary) => {
                summary.docsWrittenSuccessfully.should.be.equal(10);
                summary.docsFailedToBeWritten.should.be.equal(0);
                summary.timeElapsed.should.be.greaterThanOrEqual(0);
            })
        }); // End of pipe to writeAll transform
        setTimeout(() => {
            done();
        }, 3000);
    }); // End of test case

    it('Return transformed content during read', function (done) {
        this.timeout(10000);
        // Read back one document to make sure transform ran fine
        db.documents.read({
            uris: [transformuris[5]],
            categories: ['content', 'metadata']
        }).
            result(function (response) {
                var res1 = response[0].content['key 5'];
                var res2 = response[0].content['title'];
                var res3 = response[0].content['myBool'];
                var res4 = response[0].content['myInt'];
                res1.should.equal('value 5');
                res2.should.equal('new title');
                res3.should.equal('true');
                res4.should.equal('2');
                done();
            }, done);
    });

    // Verify batch size during ingestion
    it('writeAll with batch size', function (done) {
        this.timeout(10000);
        var multiDocreadable = new stream.Readable({ objectMode: true });

        for (let i = 0; i < 10; i++) {
            const temp = {
                uri: '/qa/test/dmsdk/batchsize/' + i + '.json',
                contentType: 'application/json',
                collections: ['qatestsBatchsize'],
                content: { ['key ' + i]: 'value ' + i }
            };
            multiDocreadable.push(temp);
            batchuris.push(temp.uri);
        }
        multiDocreadable.push(null);
        dbWriter.documents.writeAll(multiDocreadable, {

            batchSize: 3,
            onBatchSuccess: ((progressSoFar, documents) => {
                try {
                    progressSoFar.docsWrittenSuccessfully.should.be.greaterThanOrEqual(1);
                    progressSoFar.docsFailedToBeWritten.should.be.equal(0);
                    progressSoFar.timeElapsed.should.be.greaterThanOrEqual(0);
                } catch (err) {
                    done(err);
                }
            }),
            onCompletion: ((summary) => {
                summary.docsWrittenSuccessfully.should.be.equal(10);
                summary.docsFailedToBeWritten.should.be.equal(0);
                summary.timeElapsed.should.be.greaterThanOrEqual(0);
            })
        }); // End of pipe to writeAll transform
        setTimeout(() => {
            done();
        }, 3000);
    }); // End of test case

    it('Return batch size content during read', function (done) {
        this.timeout(10000);
        // Read back one document to make sure batch sizes ran fine
        db.documents.read({
            uris: [batchuris[3]],
            categories: ['content', 'metadata']
        }).
            result(function (response) {
                var res = response[0].content['key 3'];
                res.should.equal('value 3');

                done();
            }, done);
    });

    // Cleanup database contents for writeALL tests based on collections
    it('should remove the collection', function (done) {
        this.timeout(10000);
        dbWriter.documents.removeAll({ collection: 'qatestsBinary' }).
            result(function (result) {
                return db.documents.probe('/data/121-GIF-Image-GIF-gif_sample1.gif').result();
            }, done).
            then(function (document) {
                document.exists.should.eql(false);
                done();
            }, done);
    });

    // Cleanup database contents for writeALL tests based on collections
    // removeAll({all: true}) will not work due to temporal docs present.
    it('Binary collection delete', function (done) {
        this.timeout(10000);
        dbWriter.documents.removeAll({ collection: 'qatestsBinary' }).
            result(function (result) {
                return db.documents.probe('/data/121-GIF-Image-GIF-gif_sample1.gif').result();
            }, done).
            then(function (document) {
                document.exists.should.eql(false);
                done();
            }, done);
    });

    it('Batch size collection removal', function (done) {
        this.timeout(10000);
        dbWriter.documents.removeAll({ collection: 'qatestsBatchsize' }).
            result(function (result) {
                return db.documents.probe('/qa/test/dmsdk/batchsize/4.json').result();
            }, done).
            then(function (document) {
                document.exists.should.eql(false);
                done();
            }, done);
    });

    it('Collection removal - text', function (done) {
        this.timeout(10000);
        dbWriter.documents.removeAll({ collection: 'qatestsText' }).
            result(function (result) {
                return db.documents.probe('bbq1.xml').result();
            }, done).
            then(function (document) {
                document.exists.should.eql(false);
                done();
            }, done);
    });

    it('Transform docs deleted', function (done) {
        this.timeout(10000);
        dbWriter.documents.removeAll({ collection: 'qatestsTransform' }).
            result(function (result) {
                return db.documents.probe('/qa/test/dmsdk/transforms/9.json').result();
            }, done).
            then(function (document) {
                document.exists.should.eql(false);
                done();
            }, done);
    });
});
