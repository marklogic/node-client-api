xquery version "1.0-ml";

declare option xdmp:mapping "false";

declare variable $param1 as document-node()? external := ();
declare variable $param2 as xs:float external;
declare variable $param3 as xs:int external;
let $errorList := json:array()
let $funcdef   := xdmp:from-json-string('{
  "functionName" : "postOfMultipartBinaryDocumentForNone3",
  "params" : [ {
    "name" : "param1",
    "datatype" : "binaryDocument",
    "multiple" : false,
    "nullable" : true
  }, {
    "name" : "param2",
    "datatype" : "float"
  }, {
    "name" : "param3",
    "datatype" : "int"
  } ]
}')
let $fields   := map:map()
let $fields   := xdmp:apply(xdmp:function(xs:QName("addField"), "/dbf/test/testInspector.sjs"),
    "/dbf/test/postOfMultipartForNone/postOfMultipartBinaryDocumentForNone3", $fields, "param1", $param1
    )
let $fields   := xdmp:apply(xdmp:function(xs:QName("addField"), "/dbf/test/testInspector.sjs"),
    "/dbf/test/postOfMultipartForNone/postOfMultipartBinaryDocumentForNone3", $fields, "param2", $param2
    )
let $fields   := xdmp:apply(xdmp:function(xs:QName("addField"), "/dbf/test/testInspector.sjs"),
    "/dbf/test/postOfMultipartForNone/postOfMultipartBinaryDocumentForNone3", $fields, "param3", $param3
    )

let $fields   := xdmp:apply(xdmp:function(xs:QName("getFields"), "/dbf/test/testInspector.sjs"),
    $funcdef, $fields, $errorList
    )
return xdmp:apply(xdmp:function(xs:QName("makeResult"), "/dbf/test/testInspector.sjs"),
    "/dbf/test/postOfMultipartForNone/postOfMultipartBinaryDocumentForNone3", $funcdef, $fields, $errorList
    )
