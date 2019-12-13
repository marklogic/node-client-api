'use strict';
// declareUpdate(); // Note: uncomment if changing the database state

var param1; // instanceof DocumentNode+
const inspector = require('/dbf/test/testInspector.sjs');
const errorList = [];
const funcdef   = {
  "functionName" : "postOfMultipartForDocumentBinaryDocument1",
  "params" : [ {
    "name" : "param1",
    "datatype" : "jsonDocument",
    "multiple" : true,
    "nullable" : false
  } ],
  "return" : {
    "datatype" : "binaryDocument",
    "multiple" : false,
    "nullable" : true
  }
};
let fields = {};
fields = inspector.addField(
  '/dbf/test/postOfMultipartForDocument/postOfMultipartForDocumentBinaryDocument1', fields, 'param1', param1
  );

fields = inspector.getFields(funcdef, fields, errorList);
inspector.makeResult('/dbf/test/postOfMultipartForDocument/postOfMultipartForDocumentBinaryDocument1', funcdef, fields, errorList);
