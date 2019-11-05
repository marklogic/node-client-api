xquery version "1.0-ml";

declare option xdmp:mapping "false";

declare variable $param1 as document-node()? external := ();
declare variable $param2 as xs:unsignedInt external;
declare variable $param3 as xs:unsignedLong external;
let $errorList := json:array()
let $funcdef   := xdmp:from-json-string('{
  "functionName" : "postOfMultipartXmlDocumentForNone3",
  "params" : [ {
    "name" : "param1",
    "datatype" : "xmlDocument",
    "multiple" : false,
    "nullable" : true
  }, {
    "name" : "param2",
    "datatype" : "unsignedInt"
  }, {
    "name" : "param3",
    "datatype" : "unsignedLong"
  } ]
}')
let $fields   := map:map()
let $fields   := xdmp:apply(xdmp:function(xs:QName("addField"), "/dbf/test/testInspector.sjs"),
    "/dbf/test/postOfMultipartForNone/postOfMultipartXmlDocumentForNone3", $fields, "param1", $param1
    )
let $fields   := xdmp:apply(xdmp:function(xs:QName("addField"), "/dbf/test/testInspector.sjs"),
    "/dbf/test/postOfMultipartForNone/postOfMultipartXmlDocumentForNone3", $fields, "param2", $param2
    )
let $fields   := xdmp:apply(xdmp:function(xs:QName("addField"), "/dbf/test/testInspector.sjs"),
    "/dbf/test/postOfMultipartForNone/postOfMultipartXmlDocumentForNone3", $fields, "param3", $param3
    )

let $fields   := xdmp:apply(xdmp:function(xs:QName("getFields"), "/dbf/test/testInspector.sjs"),
    $funcdef, $fields, $errorList
    )
return xdmp:apply(xdmp:function(xs:QName("makeResult"), "/dbf/test/testInspector.sjs"),
    "/dbf/test/postOfMultipartForNone/postOfMultipartXmlDocumentForNone3", $funcdef, $fields, $errorList
    )
