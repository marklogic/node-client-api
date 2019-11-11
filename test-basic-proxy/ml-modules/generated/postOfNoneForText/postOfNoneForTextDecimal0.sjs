'use strict';
// declareUpdate(); // Note: uncomment if changing the database state


const inspector = require('/dbf/test/testInspector.sjs');
const errorList = [];
const funcdef   = {
  "functionName" : "postOfNoneForTextDecimal0",
  "return" : {
    "datatype" : "decimal",
    "nullable" : false
  }
};
let fields = {};

fields = inspector.getFields(funcdef, fields, errorList);
inspector.makeResult('/dbf/test/postOfNoneForText/postOfNoneForTextDecimal0', funcdef, fields, errorList);
