'use strict';
// declareUpdate(); // Note: uncomment if changing the database state

var param1; // instanceof xs.decimal?
const inspector = require('/dbf/test/testInspector.sjs');
const errorList = [];
const funcdef   = {
  "functionName" : "postOfUrlencodedDecimalForNone1",
  "params" : [ {
    "name" : "param1",
    "datatype" : "decimal",
    "multiple" : false,
    "nullable" : true
  } ]
};
let fields = {};
fields = inspector.addField(
  '/dbf/test/postOfUrlencodedForNone/postOfUrlencodedDecimalForNone1', fields, 'param1', param1
  );

fields = inspector.getFields(funcdef, fields, errorList);
inspector.makeResult('/dbf/test/postOfUrlencodedForNone/postOfUrlencodedDecimalForNone1', funcdef, fields, errorList);
