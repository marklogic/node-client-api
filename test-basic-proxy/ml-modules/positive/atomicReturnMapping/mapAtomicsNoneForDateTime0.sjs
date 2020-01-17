'use strict';
// declareUpdate(); // Note: uncomment if changing the database state


const inspector = require('/dbf/test/testInspector.sjs');
const errorList = [];
const funcdef   = {
  "functionName" : "mapAtomicsNoneForDateTime0",
  "return" : {
    "datatype" : "dateTime",
    "multiple" : false,
    "nullable" : false,
    "$jsType"  : "Date"
  }
};
let fields = {};

fields = inspector.getFields(funcdef, fields, errorList);
inspector.makeResult('/dbf/test/atomicReturnMapping/mapAtomicsNoneForDateTime0', funcdef, fields, errorList);
