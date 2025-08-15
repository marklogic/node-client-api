/*
* Copyright © 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/

'use strict';
const { Buffer } = require('buffer');

/**
 * Provides functions to encode and decode vectors.
 * MarkLogic 12 or higher needed.
 * @namespace vectorUtil
 */

/**
 * Converts an array of vector float values into an encoded string.
 * Encoding vectors before writing them to documents in MarkLogic 12
 * helps reduce the amount of disk space and memory consumed by vectors.
 * @method vectorUtil#base64Encode
 * @since 3.7.0
 * @param {float[]}  vector - an array of float values
 * @returns {string}  an encoded string value.
 */
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

/**
 * Converts an encoded string value to an array of vectors.
 * @method vectorUtil#base64Decode
 * @since 3.7.0
 * @param {string}  encodedVector - an encoded string value.
 * @returns {float[]}  an array of float values.
 */
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