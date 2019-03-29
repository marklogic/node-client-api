/*
 * Copyright 2017-2019 MarkLogic Corporation
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

const marklogic = require('../');

const testconfig = require('../etc/test-config');

const dbWriter = marklogic.createDatabaseClient(testconfig.restWriterConnection);
const dbReader = marklogic.createDatabaseClient(testconfig.restReaderConnection);

const planBuilder = marklogic.planBuilder;

const rowMgr = dbReader.rows;

const lit = planBuilder.fromLiterals({rowId:1});

function makeInput(values) {
    if (values === void 0) {
        return lit;
    }
    return lit.select(values.map((value, i) => planBuilder.as(String(i + 1), value)));
}
function makeTest(input, expression) {
    return input.select(planBuilder.as('t', expression));
}
function execPlan(query, bindings, output) {
  const plan = JSON.stringify(query.export());
// console.log(plan);
  const rowOutput = (output === void 0 || output === null) ? 'object' : output;
  if (bindings === void 0 || bindings === null) {
    return rowMgr.query(plan, {format: 'json', structure: rowOutput});
  }
  return rowMgr.query(plan, {format: 'json', structure: rowOutput, bindings:bindings});
}
function explainPlan(query, format) {
  const plan = JSON.stringify(query.export());
  return rowMgr.explain(plan, (format === void 0 || format === null) ? 'json' : format);
}
function testPlan(values, expression) {
    return execPlan(makeTest(makeInput(values), expression));
}
function getResults(response) {
  if (response.statusCode >= 500) {
    const err = new Error(response.statusCode);
    err.response = response;
    throw err;
  }
  if (Array.isArray(response) && response.length > 0 && Array.isArray(response[0].columns)) {
    return response.slice(1);
  }
  const rows = response.rows;
  if (rows === void 0) {
    return response;
  }
  return rows;
}
function getResult(response) {
  return getResults(response)[0].t;
}

function makeSelectCall(list) {
  return lit.select(list);
}
function makeSelectExport(list) {
  return {$optic:{ns:'op', fn:'operators', args:[
    {ns:'op', fn:'from-literals', args:[[{rowId:1}]]},
    {ns:'op', fn:'select', args: Array.isArray(list) ? list : [list] }
  ]}};
}

module.exports = {
    dbReader:         dbReader,
    dbWriter:         dbWriter,
    planBuilder:      planBuilder,
    execPlan:         execPlan,
    explainPlan:      explainPlan,
    getResult:        getResult,
    getResults:       getResults,
    makeInput:        makeInput,
    makeSelectCall:   makeSelectCall,
    makeSelectExport: makeSelectExport,
    makeTest:         makeTest,
    testPlan:         testPlan
};
