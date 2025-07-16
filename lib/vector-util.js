/*
* Copyright © 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/

'use strict';
const { Buffer } = require('buffer');

const base64Encode = (vector) => {
    const dimensions = vector.length;
    const buffer = Buffer.alloc(8 + 4 * dimensions);

    buffer.writeInt32LE(0, 0);
    buffer.writeInt32LE(dimensions, 4);

    vector.forEach((value, i) => {
        buffer.writeFloatLE(value, 8 + i * 4);
    });

    return buffer.toString('base64');
};

const base64Decode = (encodedVector) => {

    const buffer = Buffer.from(encodedVector, 'base64');
    const version = buffer.readInt32LE(0);

    if (version !== 0) {
        throw new Error(`Unsupported vector version: ${version}`);
    }

    const dimensions = buffer.readInt32LE(4);
    const vector = [];

    for (let i = 0; i < dimensions; i++) {
        vector.push(buffer.readFloatLE(8 + i * 4));
    }

    return vector;
};

module.exports = {
    base64Encode : base64Encode,
    base64Decode: base64Decode
};