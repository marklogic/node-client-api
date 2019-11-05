'use strict';
// declareUpdate(); // Note: uncomment if changing the database state

var param1; // instanceof xs.boolean
const inspector = require('/dbf/test/testInspector.sjs');
const errorList = [];
const funcdef   = {
  "functionName" : "postOfUrlencodedBooleanForNone0",
  "params" : [ {
    "name" : "param1",
    "datatype" : "boolean",
    "multiple" : false,
    "nullable" : false
  } ]
};
let fields = {};
fields = inspector.addField(
  '/dbf/test/postOfUrlencodedForNone/postOfUrlencodedBooleanForNone0', fields, 'param1', param1
  );

fields = inspector.getFields(funcdef, fields, errorList);
inspector.makeResult('/dbf/test/postOfUrlencodedForNone/postOfUrlencodedBooleanForNone0', funcdef, fields, errorList);
