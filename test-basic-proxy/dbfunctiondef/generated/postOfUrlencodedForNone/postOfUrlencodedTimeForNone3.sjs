'use strict';
// declareUpdate(); // Note: uncomment if changing the database state

var param1; // instanceof xs.time*
const inspector = require('/dbf/test/testInspector.sjs');
const errorList = [];
const funcdef   = {
  "functionName" : "postOfUrlencodedTimeForNone3",
  "params" : [ {
    "name" : "param1",
    "datatype" : "time",
    "multiple" : true,
    "nullable" : true
  } ]
};
let fields = {};
fields = inspector.addField(
  '/dbf/test/postOfUrlencodedForNone/postOfUrlencodedTimeForNone3', fields, 'param1', param1
  );

fields = inspector.getFields(funcdef, fields, errorList);
inspector.makeResult('/dbf/test/postOfUrlencodedForNone/postOfUrlencodedTimeForNone3', funcdef, fields, errorList);
