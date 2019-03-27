/*
 * Copyright 2014-2019 MarkLogic Corporation
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
const exutil = require('./example-util.js');

// a real application would require without the 'exutil.' namespace
const marklogic = exutil.require('marklogic');
const p = marklogic.planBuilder;

const db = marklogic.createDatabaseClient(exutil.restReaderConnection);

console.log('Read document content as rows from view');

// View defined here: examples/data/countries.tdej
const plan = p.fromView('facts', 'countries', '')
    .select(['name', 'region', 'area'])
    .where(p.eq(p.col('region'), 'North America'))
    .orderBy(p.desc('area'))
    .limit(4);

db.rows.query(plan, {
  format: 'json',
  structure: 'object',
  columnTypes: 'header'
})
  .then(function (response) {
    console.log('Columns:');
    console.log(
      // Comma-separated list of column names
      response.columns.map(function (col) {
        return col.name;
      }).join(', ')
    );
    console.log('Rows:');
    response.rows.forEach(function (row) {
      console.log(
        // Comma-separated list of values in each row
        Object.keys(row).map(function (key) {
          return row[key];
        }).join(', ')
      );
    })
    console.log('done');

    exutil.succeeded();
  })
  .catch(function(error) {
    console.log(JSON.stringify(error));
    exutil.failed();
    });
