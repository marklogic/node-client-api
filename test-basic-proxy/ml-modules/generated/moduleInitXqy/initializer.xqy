(:
 : Copyright (c) 2020 MarkLogic Corporation
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
xquery version "1.0-ml";

declare option xdmp:mapping "false";

declare variable $param1 as xs:boolean external;
declare variable $param2 as xs:double? external := ();
declare variable $param3 as xs:float+ external;
declare variable $param4 as xs:int* external := ();

(: TODO:  produce the xs:boolean output from the input variables :)


fn:true()
