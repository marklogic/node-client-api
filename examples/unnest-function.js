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

const exutil = require('./example-util.js');
const marklogic = require('../');
const dbReader = marklogic.createDatabaseClient(exutil.restReaderConnection);

console.log('This example is a demonstration of unnest functions');

const op = marklogic.planBuilder;

// This schema and view should be in the database before running.
const fromView = op.fromView("unnestSchema", "unnestView");

// This is a binding template for the tokenize function, which splits a comma-separated string into an array.
const binding = op.as("teamMemberNameArray", op.fn.tokenize(
    op.col("teamMembers"),
    op.xs.string(",")
));

// This specifies the column to order the results by.
const orderByCol = op.col("teamMemberName");

// This creates a query plan that selects rows from the view, splits the teamMembers column into an array,
// unnests the array into individual rows, and orders the results by teamMemberName.
const planFromBuilderTemplate = fromView
    .bind(binding)
    .unnestInner("teamMemberNameArray", "teamMemberName")
    .orderBy(orderByCol);

// This executes the query plan and logs the results to the console.
dbReader.rows.query(planFromBuilderTemplate)
    .then(r => console.log(r))
    .catch(e => console.log(e));
