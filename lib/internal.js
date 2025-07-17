/*
* Copyright © 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
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
        let requestOptions = mlutil.newRequestOptions(this.clientObject.getConnectionParams(), path);
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