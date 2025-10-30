/*
* Copyright (c) 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
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
