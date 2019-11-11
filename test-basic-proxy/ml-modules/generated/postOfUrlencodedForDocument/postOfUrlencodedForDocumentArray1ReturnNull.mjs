'use strict';
// declareUpdate(); // Note: uncomment if changing the database state

const param1 = external.param1; // instanceof xs.float+
const inspector = require('/dbf/test/testInspector.sjs');
const errorList = [];
const funcdef   = {
  "functionName" : "postOfUrlencodedForDocumentArray1ReturnNull",
  "params" : [ {
    "name" : "param1",
    "datatype" : "float",
    "multiple" : true,
    "nullable" : false
  } ],
  "return" : {
    "datatype" : "array",
    "multiple" : false,
    "nullable" : true
  }
};
let fields = {};
fields = inspector.addField(
  '/dbf/test/postOfUrlencodedForDocument/postOfUrlencodedForDocumentArray1ReturnNull', fields, 'param1', param1
  );

fields = inspector.getFields(funcdef, fields, errorList);
inspector.makeResult('/dbf/test/postOfUrlencodedForDocument/postOfUrlencodedForDocumentArray1ReturnNull', funcdef, fields, errorList);
