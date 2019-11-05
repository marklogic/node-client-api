'use strict';
// declareUpdate(); // Note: uncomment if changing the database state


const inspector = require('/dbf/test/testInspector.sjs');
const errorList = [];
const funcdef   = {
  "functionName" : "postOfNoneForTextUnsignedLong1",
  "return" : {
    "datatype" : "unsignedLong",
    "nullable" : true
  }
};
let fields = {};

fields = inspector.getFields(funcdef, fields, errorList);
inspector.makeResult('/dbf/test/postOfNoneForText/postOfNoneForTextUnsignedLong1', funcdef, fields, errorList);
