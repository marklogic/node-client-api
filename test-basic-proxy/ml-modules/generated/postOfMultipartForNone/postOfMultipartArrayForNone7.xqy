xquery version "1.0-ml";

declare option xdmp:mapping "false";

declare variable $param1 as array-node()* external := ();
declare variable $param2 as xs:boolean external;
declare variable $param3 as xs:double external;
let $errorList := json:array()
let $funcdef   := xdmp:from-json-string('{
  "functionName" : "postOfMultipartArrayForNone7",
  "params" : [ {
    "name" : "param1",
    "datatype" : "array",
    "multiple" : true,
    "nullable" : true
  }, {
    "name" : "param2",
    "datatype" : "boolean"
  }, {
    "name" : "param3",
    "datatype" : "double"
  } ]
}')
let $fields   := map:map()
let $fields   := xdmp:apply(xdmp:function(xs:QName("addField"), "/dbf/test/testInspector.sjs"),
    "/dbf/test/postOfMultipartForNone/postOfMultipartArrayForNone7", $fields, "param1", $param1
    )
let $fields   := xdmp:apply(xdmp:function(xs:QName("addField"), "/dbf/test/testInspector.sjs"),
    "/dbf/test/postOfMultipartForNone/postOfMultipartArrayForNone7", $fields, "param2", $param2
    )
let $fields   := xdmp:apply(xdmp:function(xs:QName("addField"), "/dbf/test/testInspector.sjs"),
    "/dbf/test/postOfMultipartForNone/postOfMultipartArrayForNone7", $fields, "param3", $param3
    )

let $fields   := xdmp:apply(xdmp:function(xs:QName("getFields"), "/dbf/test/testInspector.sjs"),
    $funcdef, $fields, $errorList
    )
return xdmp:apply(xdmp:function(xs:QName("makeResult"), "/dbf/test/testInspector.sjs"),
    "/dbf/test/postOfMultipartForNone/postOfMultipartArrayForNone7", $funcdef, $fields, $errorList
    )
