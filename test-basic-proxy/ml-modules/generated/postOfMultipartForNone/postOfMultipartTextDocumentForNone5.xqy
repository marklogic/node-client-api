xquery version "1.0-ml";

declare option xdmp:mapping "false";

declare variable $param1 as document-node()+ external;
declare variable $param2 as xs:long external;
declare variable $param3 as xs:unsignedInt external;
let $errorList := json:array()
let $funcdef   := xdmp:from-json-string('{
  "functionName" : "postOfMultipartTextDocumentForNone5",
  "params" : [ {
    "name" : "param1",
    "datatype" : "textDocument",
    "multiple" : true,
    "nullable" : false
  }, {
    "name" : "param2",
    "datatype" : "long"
  }, {
    "name" : "param3",
    "datatype" : "unsignedInt"
  } ]
}')
let $fields   := map:map()
let $fields   := xdmp:apply(xdmp:function(xs:QName("addField"), "/dbf/test/testInspector.sjs"),
    "/dbf/test/postOfMultipartForNone/postOfMultipartTextDocumentForNone5", $fields, "param1", $param1
    )
let $fields   := xdmp:apply(xdmp:function(xs:QName("addField"), "/dbf/test/testInspector.sjs"),
    "/dbf/test/postOfMultipartForNone/postOfMultipartTextDocumentForNone5", $fields, "param2", $param2
    )
let $fields   := xdmp:apply(xdmp:function(xs:QName("addField"), "/dbf/test/testInspector.sjs"),
    "/dbf/test/postOfMultipartForNone/postOfMultipartTextDocumentForNone5", $fields, "param3", $param3
    )

let $fields   := xdmp:apply(xdmp:function(xs:QName("getFields"), "/dbf/test/testInspector.sjs"),
    $funcdef, $fields, $errorList
    )
return xdmp:apply(xdmp:function(xs:QName("makeResult"), "/dbf/test/testInspector.sjs"),
    "/dbf/test/postOfMultipartForNone/postOfMultipartTextDocumentForNone5", $funcdef, $fields, $errorList
    )
