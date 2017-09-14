/*
 * Copyright 2017 MarkLogic Corporation
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

// TODO: remove temporary hack
const PlanBuilder = require('../lib/plan-builder');
const planBuilder = PlanBuilder.builder;

// TODO: remove temporary hack
const testlib = require('../etc/test-lib');
const rowMgrOld = testlib.createManager(dbReader);

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
// TODO: delete temporary hack
function execPlanOld(query, bindings, output, accept) {
  const rowOutput = (output === void 0 || output === null) ? 'object' : output;
  const baseEndpoint = '/v1/rows?output='+rowOutput;
  const endpoint  = (bindings === void 0 || bindings === null) ? baseEndpoint :
    baseEndpoint+Object.keys(bindings).map(key => {
      const binding   = bindings[key];
      const isSimple  = (typeof binding !== 'object' || (binding instanceof String) ||
        (binding instanceof Number) || (binding instanceof Boolean) || binding === null);
      const bindValue = isSimple ? binding : binding.value;
      if (bindValue === void 0) {
        throw new Error(`binding for ${key} without value: ${binding}`);
      }
      const type      = isSimple ? (void 0) : binding.type;
      const lang      = isSimple ? (void 0) : binding.lang;
      if (type !== void 0 && lang !== void 0) {
        throw new Error(`binding for ${key} with type and lang: ${binding}`);
      }
      const name      = encodeURIComponent(key);
      const bindName  =
        (type !== void 0) ? name+':'+type :
          (lang !== void 0) ? name+'@'+lang :
            name;
      return `&bind:${bindName}=${encodeURIComponent(bindValue)}`;
    }).join('');
// console.log(JSON.stringify(query.export(),null,2));
// console.log(endpoint);
  return rowMgrOld.post({
    endpoint: endpoint,
    headers: {
      'content-type': 'application/json',
      accept:         (accept === void 0 || accept === null) ? 'application/json' : accept
      },
    body:     query.export()
  });
}
function execPlan(query, bindings, output) {
  const plan = JSON.stringify(query.export());
// console.log(JSON.stringify(plan,null,2));
  const rowOutput = (output === void 0 || output === null) ? 'object' : output;
  if (bindings === void 0 || bindings === null) {
    return rowMgr.query(plan, {format: 'json', output: rowOutput});
  }
  return rowMgr.query(plan, {format: 'json', output: rowOutput, bindings:bindings});
}
function explainPlan(query, format) {
  const plan = JSON.stringify(query.export());
  return rowMgr.explain(plan, {
    format: (format === void 0 || format === null) ? 'json' : format
    });
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
/*
  const rows = response.rows;
  if (rows === void 0) {
    return response;
  }
  return rows;
 */
  return response;
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
    execPlanOld:      execPlanOld, // TODO: delete temporary hack
    explainPlan:      explainPlan,
    getResult:        getResult,
    getResults:       getResults,
    makeInput:        makeInput,
    makeSelectCall:   makeSelectCall,
    makeSelectExport: makeSelectExport,
    makeTest:         makeTest,
    testPlan:         testPlan
};
