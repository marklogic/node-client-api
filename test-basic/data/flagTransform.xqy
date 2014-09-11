xquery version "1.0-ml";

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
