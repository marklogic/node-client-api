'use strict';
// declareUpdate(); // Note: uncomment if changing the database state


const inspector = require('/dbf/test/testInspector.sjs');
const errorList = [];
const funcdef   = {
  "functionName" : "mapAtomicsNoneForBoolean0",
  "return" : {
    "datatype" : "boolean",
    "multiple" : false,
    "nullable" : false,
    "$jsType"  : "string"
  }
};
let fields = {};

fields = inspector.getFields(funcdef, fields, errorList);
inspector.makeResult('/dbf/test/atomicReturnMapping/mapAtomicsNoneForBoolean0', funcdef, fields, errorList);
