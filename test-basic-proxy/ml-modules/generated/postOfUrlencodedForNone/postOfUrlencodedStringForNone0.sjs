'use strict';
// declareUpdate(); // Note: uncomment if changing the database state

var param1; // instanceof xs.string
const inspector = require('/dbf/test/testInspector.sjs');
const errorList = [];
const funcdef   = {
  "functionName" : "postOfUrlencodedStringForNone0",
  "params" : [ {
    "name" : "param1",
    "datatype" : "string",
    "multiple" : false,
    "nullable" : false
  } ]
};
let fields = {};
fields = inspector.addField(
  '/dbf/test/postOfUrlencodedForNone/postOfUrlencodedStringForNone0', fields, 'param1', param1
  );

fields = inspector.getFields(funcdef, fields, errorList);
inspector.makeResult('/dbf/test/postOfUrlencodedForNone/postOfUrlencodedStringForNone0', funcdef, fields, errorList);
