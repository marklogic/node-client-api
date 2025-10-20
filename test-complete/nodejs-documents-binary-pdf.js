/*
* Copyright (c) 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/
const should = require('should');

const fs     = require('fs');
const stream = require('stream');
const util   = require('util');

const concatStream = require('concat-stream');
const valcheck     = require('core-util-is');
const testconfig = require('../etc/test-config-qa.js');

const marklogic = require('../');
const q = marklogic.queryBuilder;

const dbReader = marklogic.createDatabaseClient(testconfig.restReaderConnection);
const dbWriter = marklogic.createDatabaseClient(testconfig.restWriterConnection);
const dbAdmin = marklogic.createDatabaseClient(testconfig.restAdminConnection);

const uri = '/test/write/somePdfFile.pdf';

describe('Binary documents test', function () {
    const binaryPath = __dirname + '/data/somePdfFile.pdf';
    let binaryValue = null;

    before(async function () {
        binaryValue = await new Promise((resolve, reject) => {
            fs.createReadStream(binaryPath)
                .pipe(concatStream({ encoding: 'buffer' }, function (value) {
                    resolve(value);
                }))
                .on('error', reject);
        });
    });

    it('should write, read, read metadata, verify and delete the binary pdf content', async function () {

        const readableBinary = new ValueStream(binaryValue);
        try {
            const writeResponse = await dbWriter.documents.write({
                uri: uri,
                contentType: 'application/pdf',
                quality: 25,
                properties: { prop1: 'foo' },
                content: readableBinary
            }).result();
            writeResponse.should.have.property('documents');

            const docReadResp = await dbReader.documents.read(uri).result();
            docReadResp[0].contentType.should.equal('application/pdf');
            docReadResp[0].content.length.should.equal(binaryValue.length);
            Buffer.compare(binaryValue, docReadResp[0].content).should.equal(0);

            const docReadRespMeta = await dbReader.documents.read(
                { uris: uri, categories: ['metadata'] }
            ).result();
            docReadRespMeta[0].quality.should.equal(25);
            docReadRespMeta[0].properties.prop1.should.equal('foo');

            // original test deleted all documents. This one just deletes the one we wrote.
            await dbAdmin.documents.remove(uri).result();

        } catch (error) {
            console.error(error);
            throw error;
        }
    });
});

function ValueStream(value) {
    stream.Readable.call(this);
    this.value    = value;
}
util.inherits(ValueStream, stream.Readable);
ValueStream.prototype._read = function () {
    this.push(this.value);
    this.push(null);
};
