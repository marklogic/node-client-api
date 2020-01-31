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

const should = require('should');

const testconfig = require('../etc/test-config.js');

const marklogic = require('../');
const proxy = require('../lib/endpoint-proxy.js');

const db = marklogic.createDatabaseClient(testconfig.restWriterConnection);
const modDb = marklogic.createDatabaseClient({
    host:     testconfig.restEvaluatorConnection.host,
    port:     testconfig.restEvaluatorConnection.port,
    user:     testconfig.restEvaluatorConnection.user,
    password: testconfig.restEvaluatorConnection.password,
    authType: testconfig.restEvaluatorConnection.authType,
    database: 'unittest-nodeapi-modules'
});

describe('call an endpoint proxy', function(){
    const serviceDecl = {"endpointDirectory": "/ds/test/nodejs/basic/"};
    const basicPerms = [
        {'role-name':'rest-reader', capabilities:['read']},
        {'role-name':'rest-writer', capabilities:['read', 'update']}
    ];
    const execPerms = [
        {'role-name':'rest-reader', capabilities:['execute', 'read']},
        {'role-name':'rest-writer', capabilities:['execute', 'read', 'update']}
    ];
    const multiNodeInputMultiOutputDecl = {
        "functionName": "multiNodeInputMultiOutput",
        "params": [ {
            "name":     "input",
            "datatype": "jsonDocument",
            "multiple": true,
            "nullable": true
        } ],
        "return": {
            "datatype": "jsonDocument",
            "multiple": true,
            "nullable": true
        }
    };
    const multiAtomicInputMultiOutputDecl = {
        "functionName": "multiAtomicInputMultiOutput",
        "params": [ {
            "name":     "input",
            "datatype": "string",
            "multiple": true,
            "nullable": true
        } ],
        "return": {
            "datatype": "string",
            "multiple": true,
            "nullable": true
        }
    };
    const singleNodeInputSingleOutputDecl = {
        "functionName": "singleNodeInputSingleOutput",
        "params": [ {
            "name":     "input",
            "datatype": "jsonDocument",
            "multiple": false,
            "nullable": true
        } ],
        "return": {
            "datatype": "jsonDocument",
            "multiple": false,
            "nullable": true
        }
    };
    const singleAtomicInputSingleOutputDecl = {
        "functionName": "singleAtomicInputSingleOutput",
        "params": [ {
            "name":     "input",
            "datatype": "int",
            "multiple": false,
            "nullable": true
        } ],
        "return": {
            "datatype": "int",
            "multiple": false,
            "nullable": true
        }
    };
    const emptyInputEmptyOutputDecl = {
        "functionName": "emptyAtomicInputEmptyOutput"
    };
    const multiNodeInputMultiOutputAPIUri     = serviceDecl.endpointDirectory+multiNodeInputMultiOutputDecl.functionName+'.api';
    const multiAtomicInputMultiOutputAPIUri   = serviceDecl.endpointDirectory+multiAtomicInputMultiOutputDecl.functionName+'.api';
    const singleNodeInputSingleOutputAPIUri   = serviceDecl.endpointDirectory+singleNodeInputSingleOutputDecl.functionName+'.api';
    const singleAtomicInputSingleOutputAPIUri = serviceDecl.endpointDirectory+singleAtomicInputSingleOutputDecl.functionName+'.api';
    const emptyInputEmptyOutputAPIUri         = serviceDecl.endpointDirectory+emptyInputEmptyOutputDecl.functionName+'.api';
    before(function(done){
        this.timeout(3000);
        modDb.documents.write([{
            uri: multiNodeInputMultiOutputAPIUri,
            contentType: 'application/json',
            collections: ['/ds/test/nodejs/basic'],
            permissions: basicPerms,
            content: multiNodeInputMultiOutputDecl
        },{
            uri: multiAtomicInputMultiOutputAPIUri,
            contentType: 'application/json',
            collections: ['/ds/test/nodejs/basic'],
            permissions: basicPerms,
            content: multiAtomicInputMultiOutputDecl
        },{
            uri: singleNodeInputSingleOutputAPIUri,
            contentType: 'application/json',
            collections: ['/ds/test/nodejs/basic'],
            permissions: basicPerms,
            content: singleNodeInputSingleOutputDecl
        },{
            uri: singleAtomicInputSingleOutputAPIUri,
            contentType: 'application/json',
            collections: ['/ds/test/nodejs/basic'],
            permissions: basicPerms,
            content: singleAtomicInputSingleOutputDecl
        },{
            uri: emptyInputEmptyOutputAPIUri,
            contentType: 'application/json',
            collections: ['/ds/test/nodejs/basic'],
            permissions: basicPerms,
            content: emptyInputEmptyOutputDecl
        }])
            .result(response => done())
            .catch(done);
    });
    after(function(done) {
        modDb.documents.removeAll({directory:serviceDecl.endpointDirectory})
            .result(response => done())
            .catch(done);
    });
    describe('implemented in SJS', function(){
        const multiNodeInputMultiOutputSJSUri     = serviceDecl.endpointDirectory+multiNodeInputMultiOutputDecl.functionName+'.sjs';
        const multiAtomicInputMultiOutputSJSUri   = serviceDecl.endpointDirectory+multiAtomicInputMultiOutputDecl.functionName+'.sjs';
        const singleNodeInputSingleOutputSJSUri   = serviceDecl.endpointDirectory+singleNodeInputSingleOutputDecl.functionName+'.sjs';
        const singleAtomicInputSingleOutputSJSUri = serviceDecl.endpointDirectory+singleAtomicInputSingleOutputDecl.functionName+'.sjs';
        const emptyInputEmptyOutputSJSUri         = serviceDecl.endpointDirectory+emptyInputEmptyOutputDecl.functionName+'.sjs';
        const multiNodeInputMultiOutputSJS = `'use strict';
var input; // jsonDocument*
// workaround for bug 53438
const inputs = (input instanceof Document) ? Sequence.from(input) : input;
inputs;`;
        const multiAtomicInputMultiOutputSJS = `'use strict';
var input; // xs.string*
// workaround for bug 53438
const inputs = (input instanceof xs.string) ? Sequence.from(input) : input;
inputs;`;
        const singleNodeInputSingleOutputSJS = `'use strict';
var input; // jsonDocument?
input;`;
        const singleAtomicInputSingleOutputSJS = `'use strict';
var input; // xs.int?
input;`;
        const emptyInputEmptyOutputSJS = `'use strict';
void 0;`;
        before(function(done){
            this.timeout(3000);
            modDb.documents.write([{
                uri: multiNodeInputMultiOutputSJSUri,
                contentType: 'application/vnd.marklogic-javascript',
                collections: ['/ds/test/nodejs/basic'],
                permissions: execPerms,
                content: multiNodeInputMultiOutputSJS
            },{
                uri: multiAtomicInputMultiOutputSJSUri,
                contentType: 'application/vnd.marklogic-javascript',
                collections: ['/ds/test/nodejs/basic'],
                permissions: execPerms,
                content: multiAtomicInputMultiOutputSJS
            },{
                uri: singleNodeInputSingleOutputSJSUri,
                contentType: 'application/vnd.marklogic-javascript',
                collections: ['/ds/test/nodejs/basic'],
                permissions: execPerms,
                content: singleNodeInputSingleOutputSJS
            },{
                uri: singleAtomicInputSingleOutputSJSUri,
                contentType: 'application/vnd.marklogic-javascript',
                collections: ['/ds/test/nodejs/basic'],
                permissions: execPerms,
                content: singleAtomicInputSingleOutputSJS
            },{
                uri: emptyInputEmptyOutputSJSUri,
                contentType: 'application/vnd.marklogic-javascript',
                collections: ['/ds/test/nodejs/basic'],
                permissions: execPerms,
                content: emptyInputEmptyOutputSJS
            }])
                .result(response => done())
                .catch(done);
        });
        after(function(done) {
            modDb.documents.remove([
                  multiNodeInputMultiOutputSJSUri,
                  multiAtomicInputMultiOutputSJSUri,
                  singleNodeInputSingleOutputSJSUri,
                  singleAtomicInputSingleOutputSJSUri,
                  emptyInputEmptyOutputSJSUri
                  ])
                .result(response => done())
                .catch(done);
        });
        it('for multiple nodes in SJS', function(done){
            multiNodeInputMultiOutputDecl.params[0].dataKind = 'node';
            multiNodeInputMultiOutputDecl.params[0].mimeType = 'application/json';
            multiNodeInputMultiOutputDecl.return.dataKind = 'node';
            multiNodeInputMultiOutputDecl.return.mimeType = 'application/json';
            multiNodeInputMultiOutputDecl.maxArgs = 1;
            multiNodeInputMultiOutputDecl.paramsKind = 'multiNode';
            multiNodeInputMultiOutputDecl.sessionParam = null;
            multiNodeInputMultiOutputDecl.returnKind = 'multipart';
            multiNodeInputMultiOutputDecl.$jsOutputMode = 'promise';
            const input = [{first:1}, {second:2}, {third:3}];
            const proxyCaller = proxy
                .init(db, serviceDecl)
                .withFunction(multiNodeInputMultiOutputDecl, '.sjs');
            proxyCaller
                .execute(multiNodeInputMultiOutputDecl.functionName, {input:input})
                .then(function(output) {
                    (output === void 0).should.equal(false);
                    input.length.should.equal(output.length);
                    for (let i=0; i < input.length; i++) {
                        const expected = input[i];
                        const actual = output[i];
                        const expectedKeys = Object.keys(expected);
                        expectedKeys.length.should.equal(Object.keys(actual).length);
                        for (const key of expectedKeys) {
                            actual.should.have.property(key);
                            expected[key].should.equal(actual[key]);
                        }
                    }
                  done();
                  })
                .catch(done);
        });
        it('for multiple atomics in SJS', function(done){
            multiAtomicInputMultiOutputDecl.params[0].dataKind = 'atomic';
            multiAtomicInputMultiOutputDecl.params[0].mimeType = 'text/plain';
            multiAtomicInputMultiOutputDecl.return.dataKind = 'atomic';
            multiAtomicInputMultiOutputDecl.return.mimeType = 'text/plain';
            multiAtomicInputMultiOutputDecl.return.$jsType = 'string';
            multiAtomicInputMultiOutputDecl.maxArgs = 1;
            multiAtomicInputMultiOutputDecl.paramsKind = 'multiAtomic';
            multiAtomicInputMultiOutputDecl.sessionParam = null;
            multiAtomicInputMultiOutputDecl.returnKind = 'multipart';
            multiAtomicInputMultiOutputDecl.$jsOutputMode = 'promise';
            const input = ['first', 'second', 'third'];
            const proxyCaller = proxy
                .init(db, serviceDecl)
                .withFunction(multiAtomicInputMultiOutputDecl, '.sjs');
            proxyCaller
                .execute(multiAtomicInputMultiOutputDecl.functionName, {input:input})
                .then(function(output) {
                    (output === void 0).should.equal(false);
                    input.length.should.equal(output.length);
                    for (let i=0; i < input.length; i++) {
                        input[i].should.equal(output[i]);
                    }
                    done();
                })
                .catch(done);
        });
        it('for single node in SJS', function(done){
            singleNodeInputSingleOutputDecl.params[0].dataKind = 'node';
            singleNodeInputSingleOutputDecl.params[0].mimeType = 'application/json';
            singleNodeInputSingleOutputDecl.return.dataKind = 'node';
            singleNodeInputSingleOutputDecl.return.mimeType = 'application/json';
            singleNodeInputSingleOutputDecl.maxArgs = 1;
            singleNodeInputSingleOutputDecl.paramsKind = 'multiNode';
            singleNodeInputSingleOutputDecl.sessionParam = null;
            singleNodeInputSingleOutputDecl.returnKind = 'single';
            singleNodeInputSingleOutputDecl.$jsOutputMode = 'promise';
            const input = {first:1};
            const proxyCaller = proxy
                .init(db, serviceDecl)
                .withFunction(singleNodeInputSingleOutputDecl, '.sjs');
            proxyCaller
                .execute(singleNodeInputSingleOutputDecl.functionName, {input:input})
                .then(function(output) {
                  (output === void 0).should.equal(false);
                  const expectedKeys = Object.keys(input);
                  expectedKeys.length.should.equal(Object.keys(output).length);
                  for (const key of expectedKeys) {
                      output.should.have.property(key);
                      input[key].should.equal(output[key]);
                  }
                  done();
                  })
                .catch(done);
        });
        it('for single atomic in SJS', function(done){
            singleAtomicInputSingleOutputDecl.params[0].dataKind = 'atomic';
            singleAtomicInputSingleOutputDecl.params[0].mimeType = 'text/plain';
            singleAtomicInputSingleOutputDecl.return.dataKind = 'atomic';
            singleAtomicInputSingleOutputDecl.return.mimeType = 'text/plain';
            singleAtomicInputSingleOutputDecl.return.$jsType = 'number';
            singleAtomicInputSingleOutputDecl.maxArgs = 1;
            singleAtomicInputSingleOutputDecl.paramsKind = 'multiAtomic';
            singleAtomicInputSingleOutputDecl.sessionParam = null;
            singleAtomicInputSingleOutputDecl.returnKind = 'single';
            singleAtomicInputSingleOutputDecl.$jsOutputMode = 'promise';
            const input = 5;
            const proxyCaller = proxy
                .init(db, serviceDecl)
                .withFunction(singleAtomicInputSingleOutputDecl, '.sjs');
            proxyCaller
                .execute(singleAtomicInputSingleOutputDecl.functionName, {input:input})
                .then(function(output) {
                    (output === void 0).should.equal(false);
                    input.should.equal(output);
                    done();
                })
                .catch(done);
        });
        it('for empty in SJS', function(done){
            emptyInputEmptyOutputDecl.params = null;
            emptyInputEmptyOutputDecl.return = null;
            emptyInputEmptyOutputDecl.maxArgs = 0;
            emptyInputEmptyOutputDecl.paramsKind = 'empty';
            emptyInputEmptyOutputDecl.sessionParam = null;
            emptyInputEmptyOutputDecl.returnKind = 'empty';
            emptyInputEmptyOutputDecl.$jsOutputMode = 'promise';
            const proxyCaller = proxy
                .init(db, serviceDecl)
                .withFunction(emptyInputEmptyOutputDecl, '.sjs');
            proxyCaller
                .execute(emptyInputEmptyOutputDecl.functionName)
                .then(function(output) {
                    (output === void 0).should.equal(true);
                    done();
                })
                .catch(done);
        });
    });
});
