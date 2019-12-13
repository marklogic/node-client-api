'use strict';
// declareUpdate(); // Note: uncomment if changing the database state


const inspector = require('/dbf/test/testInspector.sjs');
const errorList = [];
const funcdef   = {
  "functionName" : "postOfNoneForMultipartXmlDocument1ReturnNull",
  "return" : {
    "datatype" : "xmlDocument",
    "multiple" : true,
    "nullable" : true
  }
};
let fields = {};

fields = inspector.getFields(funcdef, fields, errorList);
inspector.makeResult('/dbf/test/postOfNoneForMultipart/postOfNoneForMultipartXmlDocument1ReturnNull', funcdef, fields, errorList);
