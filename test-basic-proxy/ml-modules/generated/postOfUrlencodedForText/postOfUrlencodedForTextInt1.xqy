xquery version "1.0-ml";

declare option xdmp:mapping "false";

declare variable $param1 as xs:double+ external;
let $errorList := json:array()
let $funcdef   := xdmp:from-json-string('{
  "functionName" : "postOfUrlencodedForTextInt1",
  "params" : [ {
    "name" : "param1",
    "datatype" : "double",
    "multiple" : true,
    "nullable" : false
  } ],
  "return" : {
    "datatype" : "int",
    "nullable" : true
  }
}')
let $fields   := map:map()
let $fields   := xdmp:apply(xdmp:function(xs:QName("addField"), "/dbf/test/testInspector.sjs"),
    "/dbf/test/postOfUrlencodedForText/postOfUrlencodedForTextInt1", $fields, "param1", $param1
    )

let $fields   := xdmp:apply(xdmp:function(xs:QName("getFields"), "/dbf/test/testInspector.sjs"),
    $funcdef, $fields, $errorList
    )
return xdmp:apply(xdmp:function(xs:QName("makeResult"), "/dbf/test/testInspector.sjs"),
    "/dbf/test/postOfUrlencodedForText/postOfUrlencodedForTextInt1", $funcdef, $fields, $errorList
    )
