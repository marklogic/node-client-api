xquery version "1.0-ml";

module namespace timeService = "http://marklogic.com/rest-api/resource/timeService";

declare default function namespace "http://www.w3.org/2005/xpath-functions";
declare option xdmp:mapping "false";

(:
  curl -i --anyauth --user rest-admin:x -X PUT -H "content-type: application/xquery" -d"@../tmp/timeService.xqy" "http://localhost:8015/v1/config/resources/timeService"
 :)
declare function timeService:get(
    $context as map:map,
    $params  as map:map
) as document-node()*
{
    map:put($context,"output-types","application/json"),

    document{xdmp:unquote(concat('{',
          '"currentTime": "', string(current-dateTime()), '"',
          '}'))}
};
