'use strict';
// declareUpdate(); // Note: uncomment if changing the database state

var param1; // instanceof xs.double?
const inspector = require('/dbf/test/testInspector.sjs');
const errorList = [];
const funcdef   = {
  "functionName" : "postOfUrlencodedDoubleForNone1",
  "params" : [ {
    "name" : "param1",
    "datatype" : "double",
    "multiple" : false,
    "nullable" : true
  } ]
};
let fields = {};
fields = inspector.addField(
  '/dbf/test/postOfUrlencodedForNone/postOfUrlencodedDoubleForNone1', fields, 'param1', param1
  );

fields = inspector.getFields(funcdef, fields, errorList);
inspector.makeResult('/dbf/test/postOfUrlencodedForNone/postOfUrlencodedDoubleForNone1', funcdef, fields, errorList);
