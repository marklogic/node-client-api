'use strict';
// declareUpdate(); // Note: uncomment if changing the database state


const inspector = require('/dbf/test/testInspector.sjs');
const errorList = [];
const funcdef   = {
  "functionName" : "mapAtomicsNoneForInt0",
  "return" : {
    "datatype" : "int",
    "multiple" : false,
    "nullable" : false,
    "$jsType"  : "string"
  }
};
let fields = {};

fields = inspector.getFields(funcdef, fields, errorList);
inspector.makeResult('/dbf/test/atomicReturnMapping/mapAtomicsNoneForInt0', funcdef, fields, errorList);
