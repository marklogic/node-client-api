/*
* Copyright © 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/

var marklogic = require('../');

var testconfig = require('../etc/test-config-qa.js');

const stream = require('stream');
const { expect } = require('chai');

var memStore = { };

var uriStream = new stream.Readable();
var dbWriter = marklogic.createDatabaseClient(testconfig.dmsdkrestWriterConnection);
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
        // Filter what we need and push. We will verify only 900.json piped from ReadAll
        if (chunk.uri === this.docId) {
            //Push transformed content onto the stream with changed key names such as Matched ID and Matched Name
            var currId = chunk.content.id;
            var currName = chunk.content.name;
            var retStr = 'Matched ID:' + currId + ', Matched Name:' + currName;
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

describe('Update doc and readAll with Snapshot', function () {
    before(function (done) {
        this.timeout(50000);
        var jsonDocreadable = new stream.Readable({ objectMode: true });

        for (let i = 0; i < 1000; i++) {
            const tempJson = {
                uri: '/data/dmsdk/Snap-update-then-readall/' + i + '.json',
                contentType: 'application/json',
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
                summary.docsWrittenSuccessfully.should.be.greaterThanOrEqual(1000);
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

        dbWriter.documents.remove(inputJsonUris)
            .result(function (response) {
                done();
            })
            .catch(err => done(err))
            .catch(done);
    }));

    // This test updates an existing doc and then performs readAll
    it('update a doc and readAll with snapshot', function (done) {
        this.timeout(30000);
        // Used in test that updates doc and then does readAll
        const UpdBeforeReadAllUriName = '/data/dmsdk/Snap-update-then-readall/900.json';

        const filteredSnapshot = new MLQASnapshotTransform(UpdBeforeReadAllUriName, { objectMode: true });

        setTimeout(() => {
            var i = 0; i++;
        }, 3000);
        // Initiate a document change on doc id 900.
        dbWriter.documents.write({
            uri: UpdBeforeReadAllUriName,
            collections: ['coll5', 'coll6'],
            contentType: 'application/json',
            quality: 250,
            properties: { prop1: 'bar', prop2: 1981 },
            content: { id: 88, name: 'David' }
        });
        // Expected result
        var exptdResult = 'Matched ID:88, Matched Name:David';
        var mlqawstream = new MLQAWritableStream('before');
        // Have listeners before calling pipe.
        setTimeout(() => {
            var i = 0; i++;
        }, 3000);
        mlqawstream.on('finish', function () {
            expect(memStore.before.toString()).to.equal(exptdResult);
        });
        dbWriter.documents.readAll(uriStream, {
            inputkind: 'Array',
            consistentSnapshot: true,
            batch: 50
        }).pipe(filteredSnapshot).pipe(mlqawstream);/* Add.pipe(process.stdout) to debug */
        done();
    });
});
