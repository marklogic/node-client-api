xquery version "1.0-ml";

module namespace flagParam = "http://marklogic.com/rest-api/transform/flagParam";

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
    document{xdmp:unquote(concat(
        "{",
          '"flagParam": "', map:get($params,"flag"), '", ',
          '"content": ',    xdmp:quote($content),    "}"
        ))}
};
