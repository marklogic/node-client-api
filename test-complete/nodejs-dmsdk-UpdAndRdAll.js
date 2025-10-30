/*
* Copyright (c) 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/

const marklogic = require('../');

const testconfig = require('../etc/test-config-qa.js');

const stream = require('stream');
const { expect } = require('chai');
const { pipeline } = require('stream/promises');

const memStore = { };
const dbWriter = marklogic.createDatabaseClient(testconfig.dmsdkrestWriterConnection);
const inputJsonUris = [];
const inputContents = [];

let uriStream = new stream.Readable();

const TOTAL_DOCS = 1000;

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
            let currId = chunk.content.id;
            let currName = chunk.content.name;
            let retStr = 'Matched ID:' + currId + ', Matched Name:' + currName;
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
        let buffer = (Buffer.isBuffer(chunk)) ?
            chunk :  // already is Buffer use it
            Buffer.from(chunk, encoding);
        memStore[this.key] = Buffer.concat([memStore[this.key], buffer]);
        return setImmediate(callback);
    }
}

describe('Update doc and readAll with Snapshot', function () {

    before(async function () {

        const jsonDocreadable = new stream.Readable({ objectMode: true });

        for (let i = 0; i < TOTAL_DOCS; i++) {
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

        let summaryPromiseResolve;
        
        // The following pattern uses Promise.all to coordinate the completion of the writeAll operation and its onCompletion callback.
        // The first promise initiates the writeAll process, while the second promise is resolved by the onCompletion callback with the summary object.
        // This ensures that both the write operation and its completion summary are available before proceeding.
        const [result, summary] = await Promise.all([
            dbWriter.documents.writeAll(jsonDocreadable, {
                onCompletion: (summary) => {
                    summaryPromiseResolve(summary);
                }
            }),
            new Promise(resolve => {
                summaryPromiseResolve = resolve;
            })
        ]);        
        expect(summary.docsWrittenSuccessfully).to.be.greaterThanOrEqual(1000);

        uriStream = new stream.PassThrough({ objectMode: true });
        inputJsonUris.forEach(uri => uriStream.push(uri));
        uriStream.push(null);
    });

    after(async function () {
        await dbWriter.documents.remove(inputJsonUris).result();
    });

    // This test updates an existing doc and then performs readAll
    it('update a doc and readAll with snapshot', async function () {

        // Used in test that updates doc and then does readAll
        const UpdBeforeReadAllUriName = '/data/dmsdk/Snap-update-then-readall/900.json';

        const filteredSnapshot = new MLQASnapshotTransform(UpdBeforeReadAllUriName, { objectMode: true });

        // Initiate a document change on doc id 900.
        const writeResponse = await dbWriter.documents.write({
            uri: UpdBeforeReadAllUriName,
            collections: ['coll5', 'coll6'],
            contentType: 'application/json',
            quality: 250,
            properties: { prop1: 'bar', prop2: 1981 },
            content: { id: 88, name: 'David' },
        }).result();

        // Updated doc should be in db now.
        var exptdResult = 'Matched ID:88, Matched Name:David';
        var mlqawstream = new MLQAWritableStream('before');

        // Use pipeline with await to read and confirm, much cleaner and understandable.
        await pipeline(
            dbWriter.documents.readAll(uriStream, {
                inputkind: 'Array',
                consistentSnapshot: true,
                batch: 50
            }),
            filteredSnapshot,
            mlqawstream
        );

        // confirm we wrote correct stream to memStore in mlqawstream
        expect(memStore.before.toString()).to.equal(exptdResult);
    });
});
