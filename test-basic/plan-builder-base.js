/*
* Copyright © 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
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
function generateViewPlan(query, schema, view, queryType) {
    const plan = JSON.stringify(query.export());
    return rowMgr.generateView(plan, schema, view, queryType);
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
    testPlan:         testPlan,
    generateViewPlan: generateViewPlan
};
