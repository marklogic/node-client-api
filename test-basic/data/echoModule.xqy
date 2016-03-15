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

declare default function namespace "http://www.w3.org/2005/xpath-functions";
declare option xdmp:mapping "false";

declare variable $test as json:array? external := ();
declare variable $extra               external := ();

let $cases :=
    if (exists($test))
    then json:array-values($test)
    else 0
return (
    if (not($cases =  1)) then () else xdmp:unquote('{"k":"v"}'),
    if (not($cases =  2)) then () else <a>element</a>,
    if (not($cases =  3)) then () else binary{xdmp:integer-to-hex(255)},
    if (not($cases =  4)) then () else text{"text value"},
    if (not($cases =  5)) then () else "string value",
    if (not($cases =  6)) then () else true(),
    if (not($cases =  7)) then () else 3,
    if (not($cases =  8)) then () else 4.4,
    if (not($cases =  9)) then () else xs:dateTime("2010-10-08T10:17:15.125Z"),
    if (not($cases = 10)) then () else (1 to 10),
    if (not($cases = 11)) then () else attribute att {"attribute value"},
    
    if (exists($extra))
    then $extra
    else if (not($cases = 0)) then ()
    else "nothing to do"
    )