'use strict';
 // Note: uncomment if changing the database state
 
declareUpdate();
 
function RetrieveFromSession(uri) {

var n = new NodeBuilder();
var node = n.addText(str).toNode();
var oldDoc = cts.doc(uri);

xdmp.nodeReplace(oldDoc.xpath("/root"), node);
xdmp.commit();

console.log("From RetrieveFromSession");
var ret = cts.doc(uri);
console.log(ret);

return ret;
}

var str = xdmp.getSessionField("api_session");
 
 var docid = xdmp.getRequestField("docid");
 var newDoc = RetrieveFromSession(docid);
 newDoc;

