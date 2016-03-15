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

module namespace directoryConstraint = "http://marklogic.com/query/custom/directoryConstraint";

declare namespace search = "http://marklogic.com/appservices/search";

declare default function namespace "http://www.w3.org/2005/xpath-functions";

(:
   Simple directory query example -- not suitable for a large database.
 :)
declare function directoryConstraint:parse(
  $query-elem as element(),
  $options    as element(search:options))
as cts:query
{
    let $qtext := $query-elem/search:text/string(.)
    return cts:directory-query(
        cts:uri(
            if (ends-with($qtext,"/")) then $qtext else concat($qtext, "/")
            ),
        "infinity"
        )
};

declare function directoryConstraint:start-facet(
  $constraint     as element(search:constraint), 
  $query          as cts:query?, 
  $facet-options  as xs:string*, 
  $quality-weight as xs:double?, 
  $forests        as xs:unsignedLong*) 
as item()*
{
    cts:uris((),("item-order","ascending","concurrent"),(),(),$forests)
};

declare function directoryConstraint:finish-facet(
  $start          as item()*,
  $constraint     as element(search:constraint), 
  $query          as cts:query?,
  $facet-options  as xs:string*,
  $quality-weight as xs:double?, 
  $forests        as xs:unsignedLong*)
as element(search:facet)
{
    <search:facet>{
        $constraint/@name,

        for $directory in 
            let $dir-array := json:array()
            return (
                json:array-push($dir-array,"/"),

                let $last-dir := "/"
                for $uri in $start
                let $test-dir := replace($uri, "^(.*/)[^/]*$", "$1")
                return
                    if ($test-dir eq $last-dir or not(ends-with($test-dir,"/"))) then ()
                    else (
                        json:array-push($dir-array,$test-dir),
                        xdmp:set($last-dir,$test-dir)
                        ),

                json:array-values($dir-array)
                )
        return
            <search:facet-value>{
                attribute name {$directory},
                attribute count { 
                   xdmp:estimate(cts:search(collection(),cts:and-query(
                       ($query, cts:directory-query($directory,"infinity"))
                       )))},
                $directory
            }</search:facet-value>
    }</search:facet>
};
