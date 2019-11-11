'use strict';
// declareUpdate(); // Note: uncomment if changing the database state


const inspector = require('/dbf/test/testInspector.sjs');
const errorList = [];
const funcdef   = {
  "functionName" : "postOfNoneForMultipartTextDocument1ReturnNull",
  "return" : {
    "datatype" : "textDocument",
    "multiple" : true,
    "nullable" : true
  }
};
let fields = {};

fields = inspector.getFields(funcdef, fields, errorList);
inspector.makeResult('/dbf/test/postOfNoneForMultipart/postOfNoneForMultipartTextDocument1ReturnNull', funcdef, fields, errorList);
