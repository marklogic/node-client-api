'use strict';
// declareUpdate(); // Note: uncomment if changing the database state

var param1; // instanceof xs.date*
const inspector = require('/dbf/test/testInspector.sjs');
const errorList = [];
const funcdef   = {
  "functionName" : "postOfUrlencodedDateForNone3",
  "params" : [ {
    "name" : "param1",
    "datatype" : "date",
    "multiple" : true,
    "nullable" : true
  } ]
};
let fields = {};
fields = inspector.addField(
  '/dbf/test/postOfUrlencodedForNone/postOfUrlencodedDateForNone3', fields, 'param1', param1
  );

fields = inspector.getFields(funcdef, fields, errorList);
inspector.makeResult('/dbf/test/postOfUrlencodedForNone/postOfUrlencodedDateForNone3', funcdef, fields, errorList);
