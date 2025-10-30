/*
* Copyright (c) 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/
var marklogic = require('../');
var testconfig = require('../etc/test-config-qa.js');
const q = marklogic.queryBuilder;
const ctsqb = marklogic.ctsQueryBuilder;

const stream = require('stream');
const streamToArray = require('stream-to-array');

const fs = require('fs');
const path = require('path');
const { Readable } = require('stream');
const { expect } = require('chai');

var memStore = {};

var uriStream = new stream.Readable();
var dbWriter = marklogic.createDatabaseClient(testconfig.dmsdkrestWriterConnection);
var dbWriterUpd = marklogic.createDatabaseClient(testconfig.dmsdkrestWriterConnection);
let inputJsonUris = [];
let inputContents = [];

/*
 Based on example from
 https://strongloop.com/strongblog/practical-examples-of-the-new-node-js-streams-api/
 */
class MLQASnapshotTransform extends stream.Transform {
    constructor(docId, options) {
        options = options || {};
        super(options);
        this.docId = docId;
    }
    _transform(chunk, encoding, callback) {
        if (Buffer.isBuffer(chunk)) {
            chunk = chunk.toString('utf8');
        }
        /* Take care of partial and last line. Don’t want a chunk of data to get cut off in the middle
        In order to avoid that, we splice out the last line we find so it does not push to the consumer.
        When a new chunk comes in we prepend the line data to the front and continue.
        This way we can safeguard against half lines being pushed out.
        */

        if (this._lastLineData) {
            chunk = this._lastLineData + chunk;
        }
        // Filter what we need and push. We will verify only 300.json piped from ReadAll
        if (chunk.uri === this.docId) {
            // Access the value (which should be the same as when Snapshot was set and ReadAll started
            var currValue = chunk.content.key300;
            // Change the key values here in transform stream so that we can be sure that snaphot ON and ReadAll works as expected
            var retStr = 'Modified Key In Transform:' + '300' + ', Modified Value In Transform:' + currValue;
            this.push(retStr);
        }
        return setImmediate(callback);
    }
    _flush(callback) {
        if (this._lastLineData) {
            this.push(this._lastLineData);
            this._lastLineData = null;
        }
        return setImmediate(callback);
    }
}

class MLQAWritableStream extends stream.Writable {
    constructor(key, options) {
        options = options || {};
        super(options);
        this.key = key;
        // Have a 0 byte buffer for now.
        memStore[key] = Buffer.alloc(0);
    }

    _write(chunk, encoding, callback) {
        var buffer = (Buffer.isBuffer(chunk)) ?
            chunk :  // already is Buffer use it
            new Buffer(chunk, encoding);
        memStore[this.key] = Buffer.concat([memStore[this.key], buffer]);
        return setImmediate(callback);
    }
}

describe('ReadAll with Snapshot and Update doc during read', function () {
    const uriCount = 500;
    const targetFilePath = path.join(__dirname, '/data/dmsdk/queryToReadAll.txt');

    before(function (done) {
        this.timeout(50000);
        var jsonDocreadable = new stream.Readable({ objectMode: true });

        for (let i = 0; i < uriCount; i++) {
            const tempJson = {
                uri: '/data/dmsdk/upd-readall/' + i + '.json',
                contentType: 'application/json',
                collections: ['during-read'],
                content: { ['key' + i]: 'value ' + i }
            };
            jsonDocreadable.push(tempJson);
            // To validate / use later in tests.
            inputJsonUris.push(tempJson.uri);
            inputContents.push(tempJson.content);
        }
        jsonDocreadable.push(null);
        dbWriter.documents.writeAll(jsonDocreadable, {
            onCompletion: ((summary) => {
                setTimeout(() => {
                    var i = 0; i++;
                }, 1000);
                summary.docsWrittenSuccessfully.should.be.greaterThanOrEqual(100);
            })
        }); // End of pipe to writeAll
        // Use uriStream as the input to readAll()
        uriStream = new stream.PassThrough({ objectMode: true });
        inputJsonUris.forEach(uri => uriStream.push(uri));
        uriStream.push(null);

        // wait for DB to finish writing
        setTimeout(() => {
            done();
        }, 10000);
    });

    after((function (done) {
        this.timeout(10000);
        fs.unlink(targetFilePath, function (err) {
            if (err) {
                // do nothing logging messes up test report file.
            }
        });
        dbWriter.documents.remove(inputJsonUris)
            .result(function (response) {
                done();
            })
            .catch((err) => {
                done(err);
            })
            .catch((error) => {
                done(error);
            });
    }));

    /*This test performs readAll and then updates an existing doc.
    Perform a readAll and as soon as the Duplex stream of readAll to return first chunks
    do a doc update on duplex's readable stream's data event.
     */
    it('Update a doc during ReadAll', function (done) {
        this.timeout(30000);
        var isUpdateDone = false;

        // Used in test that does readAll and updates doc during
        const UpdAfterReadAllUriName = '/data/dmsdk/upd-readall/300.json';

        const filteredSnapshot = new MLQASnapshotTransform(UpdAfterReadAllUriName, { objectMode: true });
        // Expected result
        var exptdResult = 'Modified Key In Transform:300, Modified Value In Transform:value 300';
        var mlqawstreamAft = new MLQAWritableStream('after');
        // Time to initalize results writestream
        setTimeout(() => {
            var i = 0; i++;
        }, 3000);
        // Have listeners before calling pipe.
        mlqawstreamAft.on('finish', function () {
            expect(memStore.after.toString()).to.equal(exptdResult);
        });
        var readFn = dbWriter.documents.readAll(uriStream, {
            inputkind: 'Array',
            consistentSnapshot: true,
            batch: 10
        });
        readFn.on('data', (data) => {
            if (!isUpdateDone) {
                // Initiate a document change on doc id 800 in this "data" event after readAll is called.
                var tid = null;
                dbWriterUpd.transactions.open().result().then(function (response) {
                    tid = response.txid;
                    return dbWriterUpd.documents.write({
                        txid: tid,
                        uri: UpdAfterReadAllUriName,
                        collections: ['coll5', 'coll6'],
                        contentType: 'application/json',
                        quality: 250,
                        properties: { prop1: 'bar', prop2: 1981 },
                        content: { id: 88, name: 'David' }
                    }).result();
                }).then(function (response) {
                    return dbWriterUpd.transactions.commit(tid).result(function (response) {
                        var i = 0;
                        i++;
                    });
                });
                isUpdateDone = true;
            }
        });
        readFn.pipe(filteredSnapshot).pipe(mlqawstreamAft); /*Add.pipe(process.stdout) to debug */
        done();
    });

    it('readAll documents with queryAll onInitialTimestamp and readAll consistentSnapshot', function (done) {
        const ctsQb = marklogic.ctsQueryBuilder;
        const q = marklogic.queryBuilder;
        const query = q.where(ctsQb.cts.directoryQuery('/data/dmsdk/upd-readall/'));
        let timestampValue = null;
        dbWriter.documents.queryAll(query, {
            consistentSnapshot: true,
            onInitialTimestamp: ((timestamp) => {
                timestampValue = timestamp;
            }),
            onCompletion: ((summary) => {
                expect(summary.urisReadSoFar).to.equal(uriCount);

                dbWriter.documents.write({
                    uri: '/data/dmsdk/upd-readall/1.json',
                    contentType: 'application/json',
                    content: { 'a': 'b' }
                })
                    .result(function (response) {
                        return dbWriterUpd.documents.read(response.documents[0].uri).result();
                    })
                    .then(function (documents) {
                        for (let key in documents[0].content) {
                            key.valueOf().should.be.equal('a');
                        }
                    })
                    .then(function (documents) {
                        let inputStream = new stream.PassThrough({ objectMode: true });
                        inputStream.push('/data/dmsdk/upd-readall/1.json');
                        inputStream.push(null);
                        streamToArray(dbWriter.documents.readAll(inputStream, {
                            batchSize: 10,
                            consistentSnapshot: timestampValue,
                        }),
                        function (err, arr) {
                            if (err) {
                                done(err);
                            }
                            arr.forEach(item => {
                                for (let key in item.content) {
                                    key.valueOf().should.be.equal('key1');
                                }
                            });
                            done();
                        });
                    });
            })
        });
    });

    // queryToReadAll tests
    it('queryToReadAll using a readable', function (done) {
        //it('verify queryToReadAll documents with word query', function(done) {
        this.timeout(20000);
        const query = q.where(ctsqb.cts.wordQuery('value 1'));
        setTimeout(() => {
            var i = 0;
            i++;
        }, 5000);
        // Use case where we wrap a Readable.
        const readable = Readable.from(
            dbWriter.documents.queryToReadAll(query, {
                onCompletion: ((summary) => {
                })
            }));
        readable.on('data', (chunk) => {
            expect(chunk.content.key1.valueOf()).to.equal('value 1');
            expect(chunk.uri.valueOf()).to.equal('/data/dmsdk/upd-readall/1.json');
            expect(chunk.format.valueOf()).to.equal('json');
            expect(chunk.category[0]).to.equal('content');
        });

        setTimeout(() => {
            var i = 0;
            i++;
        }, 5000);
        done();
    });

    it('queryToReadAll to writable and readable', function (done) {
        //it('verify queryToReadAll documents with word query', function(done) {
        this.timeout(20000);
        const query = q.where(ctsqb.cts.wordQuery('value 1'));
        var writable = fs.createWriteStream(targetFilePath, { flag: 'a' });

        const queryToReadAllStream = dbWriter.documents.queryToReadAll(query, {
            onCompletion: ((summary) => {
                summary.docsReadSuccessfully.should.be.equal(100);
                summary.docsFailedToBeRead.should.be.equal(0);
            })
        });

        queryToReadAllStream.on('error', function (err) {
            throw new Error(err);
        });
        queryToReadAllStream.on('data', function (chunk) {
            expect(chunk.content.key1.valueOf()).to.equal('value 1');
            expect(chunk.uri.valueOf()).to.equal('/data/dmsdk/upd-readall/1.json');
            expect(chunk.format.valueOf()).to.equal('json');
            expect(chunk.category[0]).to.equal('content');

            writable.write('uri is ' + chunk.uri + '\n');
            writable.write('content is ' + chunk.content.key1 + '\n');
            writable.write('category is ' + chunk.category[0] + '\n');
        });
        queryToReadAllStream.on('end', function (end) {
            writable.close();
            done();
        });
    });
});
