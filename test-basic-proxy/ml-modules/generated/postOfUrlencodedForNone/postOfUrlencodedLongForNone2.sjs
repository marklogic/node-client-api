'use strict';
// declareUpdate(); // Note: uncomment if changing the database state

var param1; // instanceof xs.long+
const inspector = require('/dbf/test/testInspector.sjs');
const errorList = [];
const funcdef   = {
  "functionName" : "postOfUrlencodedLongForNone2",
  "params" : [ {
    "name" : "param1",
    "datatype" : "long",
    "multiple" : true,
    "nullable" : false
  } ]
};
let fields = {};
fields = inspector.addField(
  '/dbf/test/postOfUrlencodedForNone/postOfUrlencodedLongForNone2', fields, 'param1', param1
  );

fields = inspector.getFields(funcdef, fields, errorList);
inspector.makeResult('/dbf/test/postOfUrlencodedForNone/postOfUrlencodedLongForNone2', funcdef, fields, errorList);
