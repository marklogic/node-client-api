'use strict';
// declareUpdate(); // Note: uncomment if changing the database state

var param1; // instanceof xs.double*
const inspector = require('/dbf/test/testInspector.sjs');
const errorList = [];
const funcdef   = {
  "functionName" : "postOfUrlencodedDoubleForNone3",
  "params" : [ {
    "name" : "param1",
    "datatype" : "double",
    "multiple" : true,
    "nullable" : true
  } ]
};
let fields = {};
fields = inspector.addField(
  '/dbf/test/postOfUrlencodedForNone/postOfUrlencodedDoubleForNone3', fields, 'param1', param1
  );

fields = inspector.getFields(funcdef, fields, errorList);
inspector.makeResult('/dbf/test/postOfUrlencodedForNone/postOfUrlencodedDoubleForNone3', funcdef, fields, errorList);
