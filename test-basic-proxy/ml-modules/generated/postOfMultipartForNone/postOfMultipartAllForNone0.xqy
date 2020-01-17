xquery version "1.0-ml";

declare option xdmp:mapping "false";

declare variable $param1 as array-node()* external := ();
declare variable $param2 as object-node() external;
declare variable $param3 as document-node()? external := ();
declare variable $param4 as document-node()+ external;
declare variable $param5 as document-node()? external := ();
declare variable $param6 as document-node() external;
let $errorList := json:array()
let $funcdef   := xdmp:from-json-string('{
  "functionName" : "postOfMultipartAllForNone0",
  "params" : [ {
    "name" : "param1",
    "datatype" : "array",
    "multiple" : true,
    "nullable" : true
  }, {
    "name" : "param2",
    "datatype" : "object",
    "multiple" : false,
    "nullable" : false
  }, {
    "name" : "param3",
    "datatype" : "binaryDocument",
    "multiple" : false,
    "nullable" : true
  }, {
    "name" : "param4",
    "datatype" : "jsonDocument",
    "multiple" : true,
    "nullable" : false
  }, {
    "name" : "param5",
    "datatype" : "textDocument",
    "multiple" : false,
    "nullable" : true
  }, {
    "name" : "param6",
    "datatype" : "xmlDocument",
    "multiple" : false,
    "nullable" : false
  } ]
}')
let $fields   := map:map()
let $fields   := xdmp:apply(xdmp:function(xs:QName("addField"), "/dbf/test/testInspector.sjs"),
    "/dbf/test/postOfMultipartForNone/postOfMultipartAllForNone0", $fields, "param1", $param1
    )
let $fields   := xdmp:apply(xdmp:function(xs:QName("addField"), "/dbf/test/testInspector.sjs"),
    "/dbf/test/postOfMultipartForNone/postOfMultipartAllForNone0", $fields, "param2", $param2
    )
let $fields   := xdmp:apply(xdmp:function(xs:QName("addField"), "/dbf/test/testInspector.sjs"),
    "/dbf/test/postOfMultipartForNone/postOfMultipartAllForNone0", $fields, "param3", $param3
    )
let $fields   := xdmp:apply(xdmp:function(xs:QName("addField"), "/dbf/test/testInspector.sjs"),
    "/dbf/test/postOfMultipartForNone/postOfMultipartAllForNone0", $fields, "param4", $param4
    )
let $fields   := xdmp:apply(xdmp:function(xs:QName("addField"), "/dbf/test/testInspector.sjs"),
    "/dbf/test/postOfMultipartForNone/postOfMultipartAllForNone0", $fields, "param5", $param5
    )
let $fields   := xdmp:apply(xdmp:function(xs:QName("addField"), "/dbf/test/testInspector.sjs"),
    "/dbf/test/postOfMultipartForNone/postOfMultipartAllForNone0", $fields, "param6", $param6
    )

let $fields   := xdmp:apply(xdmp:function(xs:QName("getFields"), "/dbf/test/testInspector.sjs"),
    $funcdef, $fields, $errorList
    )
return xdmp:apply(xdmp:function(xs:QName("makeResult"), "/dbf/test/testInspector.sjs"),
    "/dbf/test/postOfMultipartForNone/postOfMultipartAllForNone0", $funcdef, $fields, $errorList
    )
