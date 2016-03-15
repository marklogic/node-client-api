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
