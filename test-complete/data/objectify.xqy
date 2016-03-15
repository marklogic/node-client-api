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
 
module namespace objectify = "http://marklogic.com/patch/apply/objectify";

declare default function namespace "http://www.w3.org/2005/xpath-functions";
declare option xdmp:mapping "false";

declare function objectify:value(
    $node    as node()?,
    $content as item()*
) as node()*
{
    let $object :=
        if (exists($content))
        then $content
        else json:object()
    return (
        if (empty($node)) then ()
        else map:put($object, "value", $node),

        xdmp:to-json($object)/object-node()
        )
};
