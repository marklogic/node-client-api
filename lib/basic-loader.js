/*
 * Copyright 2019 MarkLogic Corporation
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
'use strict';

const fs = require('fs');
const path = require('path');

const {Writable} = require('stream');

const Vinyl = require('./optional.js').library('vinyl');

function getDatabaseClient(loader, options) {
  if (options === void 0 || options == null) {
    throw new Error(`${loader} requires options`);
  }

  const databaseClient = options.databaseClient;
  if (databaseClient === void 0 || databaseClient == null) {
    throw new Error(`${loader} requires databaseClient option`);
  }

  return databaseClient;
}

function loadFile(callback, options) {
  const databaseClient = getDatabaseClient('loadFile', options);

  const filePath = options.filePath;
  if (filePath === void 0 || filePath == null) {
    throw new Error('loadFile requires the filePath for the source file');
  }

  const documentDescriptor = options.documentDescriptor;
  if (documentDescriptor === void 0 || documentDescriptor == null) {
    throw new Error(`loadFile requires fileDescriptor option`);
  }

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      callback(err);
      return;
    }
    documentDescriptor.content = data;
    databaseClient.documents.write(documentDescriptor)
      .result(output => callback(), callback);
  });
}

function loadFileStream(options) {
  const databaseClient = getDatabaseClient('loadFileStream', options);

  const documentMetadata = options.documentMetadata;
  if (documentMetadata === void 0 || documentMetadata == null) {
    throw new Error(`loadFileStream requires documentMetadata option`);
  }

  let uriPrefix = options.uriPrefix;
  if (uriPrefix === void 0 || uriPrefix == null) {
    uriPrefix = '/';
  } else if (!uriPrefix.endsWith('/')) {
    uriPrefix += '/';
  }

  let uriStartDepth = options.uriStartDepth;
  if (uriStartDepth === void 0 || uriStartDepth == null) {
    uriStartDepth = 2;
  }
  uriStartDepth += path.resolve().split(path.sep).length - 1;

  const bufferMax = 100;
  const batchSeed = [documentMetadata];
  const fileBuffer = new Array(bufferMax);
  let bufferNext = 0;
  return new Writable({
    objectMode: true,
    write(file, encoding, callback) {
      if (!Vinyl.isVinyl(file) || file.isDirectory() || file.path === void 0 || !(file.path.length > 0)) {
        console.trace('not Vinyl file: '+file);
        callback();
        return;
      }
      fileBuffer[bufferNext++] = {
        uri:     uriPrefix + file.path.split(path.sep).slice(uriStartDepth).join('/'),
        content: file.contents
      };
      if (bufferNext < bufferMax) {
        callback();
        return;
      }
      databaseClient.documents.write(batchSeed.concat(fileBuffer))
        .result(output => callback(), callback);
      bufferNext = 0;
    },
    final(callback) {
      if (bufferNext > 0) {
        databaseClient.documents.write(batchSeed.concat(fileBuffer.slice(0, bufferNext)))
            .result(output => callback(), callback);
        bufferNext = 0;
      } else {
        callback();
      }
    }
  });
}

module.exports = {
  loadFile:       loadFile,
  loadFileStream: loadFileStream
};