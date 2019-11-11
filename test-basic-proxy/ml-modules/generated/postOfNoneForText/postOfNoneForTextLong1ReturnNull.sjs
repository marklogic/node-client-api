'use strict';
// declareUpdate(); // Note: uncomment if changing the database state


const inspector = require('/dbf/test/testInspector.sjs');
const errorList = [];
const funcdef   = {
  "functionName" : "postOfNoneForTextLong1ReturnNull",
  "return" : {
    "datatype" : "long",
    "nullable" : true
  }
};
let fields = {};

fields = inspector.getFields(funcdef, fields, errorList);
inspector.makeResult('/dbf/test/postOfNoneForText/postOfNoneForTextLong1ReturnNull', funcdef, fields, errorList);
