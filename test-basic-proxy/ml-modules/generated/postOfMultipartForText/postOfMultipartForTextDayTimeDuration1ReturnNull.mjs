'use strict';
// declareUpdate(); // Note: uncomment if changing the database state

const param1 = external.param1; // instanceof DocumentNode+
const inspector = require('/dbf/test/testInspector.sjs');
const errorList = [];
const funcdef   = {
  "functionName" : "postOfMultipartForTextDayTimeDuration1ReturnNull",
  "params" : [ {
    "name" : "param1",
    "datatype" : "binaryDocument",
    "multiple" : true,
    "nullable" : false
  } ],
  "return" : {
    "datatype" : "dayTimeDuration",
    "nullable" : true
  }
};
let fields = {};
fields = inspector.addField(
  '/dbf/test/postOfMultipartForText/postOfMultipartForTextDayTimeDuration1ReturnNull', fields, 'param1', param1
  );

fields = inspector.getFields(funcdef, fields, errorList);
inspector.makeResult('/dbf/test/postOfMultipartForText/postOfMultipartForTextDayTimeDuration1ReturnNull', funcdef, fields, errorList);
