(:
 : Copyright (c) 2020 MarkLogic Corporation
 :
 : Licensed under the Apache License, Version 2.0 (the "License");
 : you may not use this file except in compliance with the License.
 : You may obtain a copy of the License at
 :
 :    http://www.apache.org/licenses/LICENSE-2.0
 :
 : Unless required by applicable law or agreed to in writing, software
 : distributed under the License is distributed on an "AS IS" BASIS,
 : WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 : See the License for the specific language governing permissions and
 : limitations under the License.
 :)
xquery version "1.0-ml";

declare option xdmp:mapping "false";


let $errorList := json:array()
let $funcdef   := xdmp:from-json-string('{
  "functionName" : "postOfNoneForDocumentBinaryDocument1",
  "return" : {
    "datatype" : "binaryDocument",
    "multiple" : false,
    "nullable" : true
  }
}')
let $fields   := map:map()

let $fields   := xdmp:apply(xdmp:function(xs:QName("getFields"), "/dbf/test/testInspector.sjs"),
    $funcdef, $fields, $errorList
    )
return xdmp:apply(xdmp:function(xs:QName("makeResult"), "/dbf/test/testInspector.sjs"),
    "/dbf/test/postOfNoneForDocument/postOfNoneForDocumentBinaryDocument1", $funcdef, $fields, $errorList
    )
