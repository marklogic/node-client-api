'use strict';
declareUpdate(); // Note: uncomment if changing the database state
function EnableSession(uri_in, content_in) {

console.log("uri_in" + uri_in);
console.log("content " + content_in);

// Open session and store uri value. Other SJS module will read it bac

// uri_in_session is a ML server key/value pair's key name. See SJS API docs for this Fn.
xdmp.setSessionField("api_session", uri_in);
//xdmp.sleep(15000);

xdmp.documentInsert(
            uri_in,
            {content_in},
            {permissions:[
                xdmp.permission('rest-reader', 'read'),
                xdmp.permission('rest-writer', 'update')
                ]});
}
console.log("==============");
var s = xdmp.getSessionField("api_session");
console.log(s);
console.log("**************");
EnableSession(xdmp.getRequestField("uri"), xdmp.getRequestField("content"));
