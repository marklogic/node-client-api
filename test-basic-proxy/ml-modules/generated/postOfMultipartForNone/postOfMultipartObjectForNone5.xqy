xquery version "1.0-ml";

declare option xdmp:mapping "false";

declare variable $param1 as object-node() external;
declare variable $param2 as xs:double external;
declare variable $param3 as xs:float external;
let $errorList := json:array()
let $funcdef   := xdmp:from-json-string('{
  "functionName" : "postOfMultipartObjectForNone5",
  "params" : [ {
    "name" : "param1",
    "datatype" : "object",
    "multiple" : false,
    "nullable" : false
  }, {
    "name" : "param2",
    "datatype" : "double"
  }, {
    "name" : "param3",
    "datatype" : "float"
  } ]
}')
let $fields   := map:map()
let $fields   := xdmp:apply(xdmp:function(xs:QName("addField"), "/dbf/test/testInspector.sjs"),
    "/dbf/test/postOfMultipartForNone/postOfMultipartObjectForNone5", $fields, "param1", $param1
    )
let $fields   := xdmp:apply(xdmp:function(xs:QName("addField"), "/dbf/test/testInspector.sjs"),
    "/dbf/test/postOfMultipartForNone/postOfMultipartObjectForNone5", $fields, "param2", $param2
    )
let $fields   := xdmp:apply(xdmp:function(xs:QName("addField"), "/dbf/test/testInspector.sjs"),
    "/dbf/test/postOfMultipartForNone/postOfMultipartObjectForNone5", $fields, "param3", $param3
    )

let $fields   := xdmp:apply(xdmp:function(xs:QName("getFields"), "/dbf/test/testInspector.sjs"),
    $funcdef, $fields, $errorList
    )
return xdmp:apply(xdmp:function(xs:QName("makeResult"), "/dbf/test/testInspector.sjs"),
    "/dbf/test/postOfMultipartForNone/postOfMultipartObjectForNone5", $funcdef, $fields, $errorList
    )
