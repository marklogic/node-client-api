'use strict';
//declareUpdate(); // Note: uncomment if changing the database state
function CheckOnSession() {

// Read from session the URI value

var retSeq = xdmp.getSessionField("api_session");
console.log("Session field value is :", retSeq);
var uriArray = Sequence.from(retSeq).toArray();
return cts.doc(uriArray[0]);
}

var con = CheckOnSession();
console.log("content read is :", con);
con;