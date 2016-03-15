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

module namespace extractFirst = "http://marklogic.com/snippet/custom/extractFirst";

import module namespace json="http://marklogic.com/xdmp/json"
   at "/MarkLogic/json/json.xqy";
 
declare namespace search    = "http://marklogic.com/appservices/search";
declare namespace jsonbasic = "http://marklogic.com/xdmp/json/basic";

declare default function namespace "http://www.w3.org/2005/xpath-functions";
declare option xdmp:mapping "false";

declare function extractFirst:snippet(
    $result    as node(),
    $ctsquery  as schema-element(cts:query), 
    $transform as element(search:transform-results))
as element(search:snippet) {
    <search:snippet>
    <jsonbasic:json type="object">
    <jsonbasic:first type="string">{($result//text())[1]}</jsonbasic:first>
    </jsonbasic:json>
    </search:snippet>
};
