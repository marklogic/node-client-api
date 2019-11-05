'use strict';
// declareUpdate(); // Note: uncomment if changing the database state

var param1; // instanceof xs.boolean*
var param2; // instanceof xs.double
var param3; // instanceof xs.float?
var param4; // instanceof xs.int+
var param5; // instanceof xs.long?
var param6; // instanceof xs.unsignedInt
var param7; // instanceof xs.unsignedLong*
var param8; // instanceof xs.date
var param9; // instanceof xs.dateTime?
var param10; // instanceof xs.dayTimeDuration+
var param11; // instanceof xs.decimal?
var param12; // instanceof xs.string
var param13; // instanceof xs.time*
const inspector = require('/dbf/test/testInspector.sjs');
const errorList = [];
const funcdef   = {
  "functionName" : "postOfUrlencodedAllForNone0",
  "params" : [ {
    "name" : "param1",
    "datatype" : "boolean",
    "multiple" : true,
    "nullable" : true
  }, {
    "name" : "param2",
    "datatype" : "double",
    "multiple" : false,
    "nullable" : false
  }, {
    "name" : "param3",
    "datatype" : "float",
    "multiple" : false,
    "nullable" : true
  }, {
    "name" : "param4",
    "datatype" : "int",
    "multiple" : true,
    "nullable" : false
  }, {
    "name" : "param5",
    "datatype" : "long",
    "multiple" : false,
    "nullable" : true
  }, {
    "name" : "param6",
    "datatype" : "unsignedInt",
    "multiple" : false,
    "nullable" : false
  }, {
    "name" : "param7",
    "datatype" : "unsignedLong",
    "multiple" : true,
    "nullable" : true
  }, {
    "name" : "param8",
    "datatype" : "date",
    "multiple" : false,
    "nullable" : false
  }, {
    "name" : "param9",
    "datatype" : "dateTime",
    "multiple" : false,
    "nullable" : true
  }, {
    "name" : "param10",
    "datatype" : "dayTimeDuration",
    "multiple" : true,
    "nullable" : false
  }, {
    "name" : "param11",
    "datatype" : "decimal",
    "multiple" : false,
    "nullable" : true
  }, {
    "name" : "param12",
    "datatype" : "string",
    "multiple" : false,
    "nullable" : false
  }, {
    "name" : "param13",
    "datatype" : "time",
    "multiple" : true,
    "nullable" : true
  } ]
};
let fields = {};
fields = inspector.addField(
  '/dbf/test/postOfUrlencodedForNone/postOfUrlencodedAllForNone0', fields, 'param1', param1
  );
fields = inspector.addField(
  '/dbf/test/postOfUrlencodedForNone/postOfUrlencodedAllForNone0', fields, 'param2', param2
  );
fields = inspector.addField(
  '/dbf/test/postOfUrlencodedForNone/postOfUrlencodedAllForNone0', fields, 'param3', param3
  );
fields = inspector.addField(
  '/dbf/test/postOfUrlencodedForNone/postOfUrlencodedAllForNone0', fields, 'param4', param4
  );
fields = inspector.addField(
  '/dbf/test/postOfUrlencodedForNone/postOfUrlencodedAllForNone0', fields, 'param5', param5
  );
fields = inspector.addField(
  '/dbf/test/postOfUrlencodedForNone/postOfUrlencodedAllForNone0', fields, 'param6', param6
  );
fields = inspector.addField(
  '/dbf/test/postOfUrlencodedForNone/postOfUrlencodedAllForNone0', fields, 'param7', param7
  );
fields = inspector.addField(
  '/dbf/test/postOfUrlencodedForNone/postOfUrlencodedAllForNone0', fields, 'param8', param8
  );
fields = inspector.addField(
  '/dbf/test/postOfUrlencodedForNone/postOfUrlencodedAllForNone0', fields, 'param9', param9
  );
fields = inspector.addField(
  '/dbf/test/postOfUrlencodedForNone/postOfUrlencodedAllForNone0', fields, 'param10', param10
  );
fields = inspector.addField(
  '/dbf/test/postOfUrlencodedForNone/postOfUrlencodedAllForNone0', fields, 'param11', param11
  );
fields = inspector.addField(
  '/dbf/test/postOfUrlencodedForNone/postOfUrlencodedAllForNone0', fields, 'param12', param12
  );
fields = inspector.addField(
  '/dbf/test/postOfUrlencodedForNone/postOfUrlencodedAllForNone0', fields, 'param13', param13
  );

fields = inspector.getFields(funcdef, fields, errorList);
inspector.makeResult('/dbf/test/postOfUrlencodedForNone/postOfUrlencodedAllForNone0', funcdef, fields, errorList);
