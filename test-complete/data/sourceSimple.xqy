xquery version "1.0-ml";

let $a := "hello"
let $b := "world"
return fn:concat($a, " ", $b)
