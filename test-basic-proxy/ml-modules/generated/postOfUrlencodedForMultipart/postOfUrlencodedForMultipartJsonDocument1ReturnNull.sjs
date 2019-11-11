'use strict';
// declareUpdate(); // Note: uncomment if changing the database state

var param1; // instanceof xs.int+
const inspector = require('/dbf/test/testInspector.sjs');
const errorList = [];
const funcdef   = {
  "functionName" : "postOfUrlencodedForMultipartJsonDocument1ReturnNull",
  "params" : [ {
    "name" : "param1",
    "datatype" : "int",
    "multiple" : true,
    "nullable" : false
  } ],
  "return" : {
    "datatype" : "jsonDocument",
    "multiple" : true,
    "nullable" : true
  }
};
let fields = {};
fields = inspector.addField(
  '/dbf/test/postOfUrlencodedForMultipart/postOfUrlencodedForMultipartJsonDocument1ReturnNull', fields, 'param1', param1
  );

fields = inspector.getFields(funcdef, fields, errorList);
inspector.makeResult('/dbf/test/postOfUrlencodedForMultipart/postOfUrlencodedForMultipartJsonDocument1ReturnNull', funcdef, fields, errorList);
