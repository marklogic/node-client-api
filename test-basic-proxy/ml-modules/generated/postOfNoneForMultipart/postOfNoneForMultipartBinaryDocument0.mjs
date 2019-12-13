'use strict';
// declareUpdate(); // Note: uncomment if changing the database state


const inspector = require('/dbf/test/testInspector.sjs');
const errorList = [];
const funcdef   = {
  "functionName" : "postOfNoneForMultipartBinaryDocument0",
  "return" : {
    "datatype" : "binaryDocument",
    "multiple" : true,
    "nullable" : false
  }
};
let fields = {};

fields = inspector.getFields(funcdef, fields, errorList);
inspector.makeResult('/dbf/test/postOfNoneForMultipart/postOfNoneForMultipartBinaryDocument0', funcdef, fields, errorList);
