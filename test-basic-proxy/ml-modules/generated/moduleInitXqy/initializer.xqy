xquery version "1.0-ml";

declare option xdmp:mapping "false";

declare variable $param1 as xs:boolean external;
declare variable $param2 as xs:double? external := ();
declare variable $param3 as xs:float+ external;
declare variable $param4 as xs:int* external := ();

(: TODO:  produce the xs:boolean output from the input variables :)


fn:true()
