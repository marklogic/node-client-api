xquery version "1.0-ml";

module namespace to-xml = "http://marklogic.com/rest-api/transform/to-xml";

import module namespace json = "http://marklogic.com/xdmp/json" at "/MarkLogic/json/json.xqy";

declare option xdmp:mapping "false";

declare function to-xml:transform(
    $context as map:map,
    $params as map:map,
    $content as document-node()
) as document-node()
{
    map:put($context,"output-type", "application/xml"),

    if (fn:string(xdmp:type($content)) eq "element") then
        $content
    else
        let $arrayMapped as xs:string? := map:get($params, 'arrayNames')
        let $arrayNames := fn:tokenize($arrayMapped, ',')

        let $custom :=
            let $config := json:config("custom")
            return (
                map:put($config, "array-element-names", $arrayNames),
                map:put($config, "text-value", "value"),
                map:put($config, "whitespace", "ignore"),
                $config
            )

        return
            document { json:transform-from-json($content, $custom) }
};