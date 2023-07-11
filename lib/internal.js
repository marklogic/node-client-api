/*
 * Copyright (c) 2023 MarkLogic Corporation
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

const Operation = require("./operation");
const requester = require("./requester.js");
const mlutil = require("./mlutil");
class InternalClass {
    constructor(clientObject) {
        this.clientObject = clientObject;
    }
    sendRequest(path, requestOptionsCallback, operationCallback){
        if(!path){
            throw new Error('Path is needed to send request.');
        }
        let requestOptions = mlutil.newRequestOptions(this.clientObject.getConnectionParams(), path, '?');
        if (requestOptionsCallback) {
            requestOptionsCallback(requestOptions);
        }
        const operation = new Operation("", this.clientObject, requestOptions, "single", "single");
        if (operationCallback) {
            operationCallback(operation);
        }
        if (!operation.validStatusCodes) {
            operation.validStatusCodes = [200, 201, 204, 404];
        }
        
        return requester.startRequest(operation);
    }
}

module.exports = {
    InternalClass: InternalClass
};