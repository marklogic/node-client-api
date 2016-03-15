xquery version "1.0-ml";
(:
 : Copyright 2014-2015 MarkLogic Corporation
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

module namespace flagParam = "http://marklogic.com/rest-api/transform/flagParam";

import module namespace json="http://marklogic.com/xdmp/json"
    at "/MarkLogic/json/json.xqy";

import module namespace sut = "http://marklogic.com/rest-api/lib/search-util"
    at "/MarkLogic/rest-api/lib/search-util.xqy";

declare namespace search= "http://marklogic.com/appservices/search";

declare default function namespace "http://www.w3.org/2005/xpath-functions";
declare option xdmp:mapping "false";

(:
  curl -i --anyauth --user rest-admin:x -X PUT -H "content-type: application/xquery" -d"@../tmp/flagTransform.xqy" "http://localhost:8015/v1/config/transforms/flagParam"
 :)
declare function flagParam:transform(
    $context as map:map,
    $params as map:map,
    $content as document-node()
) as document-node()
{
    let $wrapper := json:object()
    let $root    := $content/node()
    return (
        map:put($wrapper, "flagParam", map:get($params,"flag")),
        map:put($wrapper, "content",   xdmp:from-json(
            typeswitch($root)
            case element(search:values-response)
                return json:transform-to-json(
                    $root, sut:build-val-results-config()
                    )
            default
                return $content
            )),

        xdmp:to-json($wrapper)
        )
};
