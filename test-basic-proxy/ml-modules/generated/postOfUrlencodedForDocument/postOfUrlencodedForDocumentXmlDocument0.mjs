'use strict';
// declareUpdate(); // Note: uncomment if changing the database state

const param1 = external.param1; // instanceof xs.float+
const inspector = require('/dbf/test/testInspector.sjs');
const errorList = [];
const funcdef   = {
  "functionName" : "postOfUrlencodedForDocumentXmlDocument0",
  "params" : [ {
    "name" : "param1",
    "datatype" : "float",
    "multiple" : true,
    "nullable" : false
  } ],
  "return" : {
    "datatype" : "xmlDocument",
    "multiple" : false,
    "nullable" : false
  }
};
let fields = {};
fields = inspector.addField(
  '/dbf/test/postOfUrlencodedForDocument/postOfUrlencodedForDocumentXmlDocument0', fields, 'param1', param1
  );

fields = inspector.getFields(funcdef, fields, errorList);
inspector.makeResult('/dbf/test/postOfUrlencodedForDocument/postOfUrlencodedForDocumentXmlDocument0', funcdef, fields, errorList);
