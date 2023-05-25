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
let requestOptions;
let clientObject;

    function intialize(client){
        clientObject = client;
        requestOptions = mlutil.copyProperties(clientObject.getConnectionParams());
        return this;
    }

    function sendRequest(userOptions, optionalName,  requestType='single', responseType='single', validStatusCodes = [200, 201, 204, 404]){
        if(!userOptions.path){
            throw new Error('Path is needed to send request.');
        }
        mlutil.copyProperties(userOptions,requestOptions);
        let operation = new Operation(
            optionalName?optionalName:'', clientObject, requestOptions, requestType, responseType
        );
        operation.validStatusCodes = validStatusCodes;
        return requester.startRequest(operation);
    }

     function newRequestOptions(path){
        let userOptions = {};
        userOptions.path = mlutil.databaseParam(clientObject.getConnectionParams(), path, '?');
        return userOptions;
    }

module.exports = {
    intialize: intialize,
    sendRequest: sendRequest,
    newRequestOptions: newRequestOptions
};