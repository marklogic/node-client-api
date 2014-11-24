xquery version "1.0-ml";

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
