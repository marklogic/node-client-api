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

const uri = '/test/binary/somePdfFile.pdf';

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

    it('should write, read using stream, verify and delete the binary content', async function () {

        let readableBinary = new ValueStream(binaryValue);
        try {
            const response = await dbWriter.documents.write({
                uri: uri,
                contentType: 'application/pdf',
                quality: 25,
                properties: { prop1: 'foo' },
                content: readableBinary
            }).result();

            response.should.have.property('documents');

        const streamData = await new Promise((resolve, reject) => {
            const chunks = [];
            const readStream = dbReader.documents.read(uri).stream('chunked');
            
            readStream.on('data', function (data) {
                chunks.push(data);
            });
            
            readStream.on('end', function () {
                resolve(Buffer.concat(chunks));
            });
            
            readStream.on('error', function (error) {
                reject(error);
            });
        });

        Buffer.compare(binaryValue, streamData).should.equal(0);
        
        // Verify the binary content has a string near the end of the file
        const strData = streamData.toString();
        strData.should.containEql('CVISION Technologies');

        // original test deleted all documents. This one just deletes the one we wrote.
        await dbAdmin.documents.remove(uri).result();

        } catch (error) {
            console.error("Error writing document: ", error);
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
