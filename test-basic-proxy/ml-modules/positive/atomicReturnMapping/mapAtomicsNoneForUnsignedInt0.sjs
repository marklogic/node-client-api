'use strict';
// declareUpdate(); // Note: uncomment if changing the database state


const inspector = require('/dbf/test/testInspector.sjs');
const errorList = [];
const funcdef   = {
  "functionName" : "mapAtomicsNoneForUnsignedInt0",
  "return" : {
    "datatype" : "unsignedInt",
    "multiple" : false,
    "nullable" : false,
    "$jsType"  : "string"
  }
};
let fields = {};

fields = inspector.getFields(funcdef, fields, errorList);
inspector.makeResult('/dbf/test/atomicReturnMapping/mapAtomicsNoneForUnsignedInt0', funcdef, fields, errorList);
