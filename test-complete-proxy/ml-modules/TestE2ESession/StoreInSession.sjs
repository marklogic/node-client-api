'use strict';
declareUpdate(); // Note: uncomment if changing the database state
function StoreInSession(docid, repl) {

console.log("Doc Id is: " + docid);
console.log("Value to be in session is: " + repl);

// Open session and store uri value. Other SJS module will read it bac

// api_session is a ML server key/value pair's key name. See SJS API docs for this Fn.
xdmp.setSessionField("api_session", repl);

return cts.doc(docid);
}

var ret = StoreInSession(xdmp.getRequestField("docid"), xdmp.getRequestField("replaceValue"));
ret;