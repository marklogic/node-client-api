xquery version "1.0-ml";
module namespace wrapperService = "http://marklogic.com/rest-api/resource/wrapperService";

import module namespace plugin = "http://marklogic.com/extension/plugin"
    at "/MarkLogic/plugin/plugin.xqy";

declare default function namespace "http://www.w3.org/2005/xpath-functions";
declare option xdmp:mapping "false";

declare function wrapperService:get(
    $context as map:map,
    $params  as map:map
) as document-node()*
{
    xdmp:unquote(concat(
        '{"readDoc":{
            "param":"',head((map:get($params,"value"),"UNDEFINED")),'"
            }}')),
    if (not(map:get($params,"multipart") = "true"))
    then map:put($context,"output-types","application/json")
    else (
        xdmp:unquote(concat(
            '{"readMultiDoc":{
                "multiParam":"',head((map:get($params,"value"),"UNDEFINED")),'"
                }}')),
        map:put($context, "output-types", ("application/json","application/json"))
        )
};

declare function wrapperService:put(
    $context as map:map,
    $params  as map:map,
    $input   as document-node()*
) as document-node()?
{
    map:put($context,"output-types","application/json"),
    let $doc := concat(
        '{"wroteDoc":{
            "param":"',head((map:get($params,"value"),"UNDEFINED")),'",
            "inputDoc":',head((head($input)/xdmp:quote(.),'"UNDEFINED"')),
            if (count($input) lt 2) then ()
            else concat(',
                "multiInputDoc":',head((head(tail($input))/xdmp:quote(.),'"UNDEFINED"'))
                ),'
            }}')
    return xdmp:unquote($doc)
};

declare function wrapperService:post(
    $context as map:map,
    $params  as map:map,
    $input   as document-node()*
) as document-node()*
{
    let $doc := concat(
        '{"appliedDoc":{
            "param":"',head((map:get($params,"value"),"UNDEFINED")),'",
            "inputDoc":',head((head($input)/xdmp:quote(.),'"UNDEFINED"')),
            if (count($input) lt 2) then ()
            else concat(',
                "multiInputDoc":',head((head(tail($input))/xdmp:quote(.),'"UNDEFINED"'))
                ),'
            }}')
    return xdmp:unquote($doc),
    if (not(map:get($params,"multipart") = "true"))
    then map:put($context,"output-types","application/json")
    else (
        xdmp:unquote(concat(
            '{"appliedMultiDoc":{
                "multiParam":"',head((map:get($params,"value"),"UNDEFINED")),'"
                }}')),
        map:put($context, "output-types", ("application/json","application/json"))
        )
};

declare function wrapperService:delete(
    $context as map:map,
    $params  as map:map
) as document-node()?
{
    map:put($context,"output-types","application/json"),
    xdmp:unquote(concat(
        '{"deletedDoc":{
            "param":"',head((map:get($params,"value"),"UNDEFINED")),'"
            }}'))
};
