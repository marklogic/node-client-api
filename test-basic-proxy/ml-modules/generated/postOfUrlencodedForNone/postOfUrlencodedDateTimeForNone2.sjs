'use strict';
// declareUpdate(); // Note: uncomment if changing the database state

var param1; // instanceof xs.dateTime+
const inspector = require('/dbf/test/testInspector.sjs');
const errorList = [];
const funcdef   = {
  "functionName" : "postOfUrlencodedDateTimeForNone2",
  "params" : [ {
    "name" : "param1",
    "datatype" : "dateTime",
    "multiple" : true,
    "nullable" : false
  } ]
};
let fields = {};
fields = inspector.addField(
  '/dbf/test/postOfUrlencodedForNone/postOfUrlencodedDateTimeForNone2', fields, 'param1', param1
  );

fields = inspector.getFields(funcdef, fields, errorList);
inspector.makeResult('/dbf/test/postOfUrlencodedForNone/postOfUrlencodedDateTimeForNone2', funcdef, fields, errorList);
