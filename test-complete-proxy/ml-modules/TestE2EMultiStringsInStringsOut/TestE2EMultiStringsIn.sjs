

 //declareUpdate();
function TestE2EMultiStringsIn(inputFiles_in, uris_in) {

var inputFiles; // instance of DocumentNode+
var uris; // instance of xs.string+

 var content;
 var uri;
 var doc;

inputFiles = inputFiles_in;
uris = uris_in;

for(let i=0; i<inputFiles.length; i++){
  
  content = {value: inputFiles[i]};
  uri = '/' + uris[i] + '.json';
  
  doc = "declareUpdate(); xdmp.documentInsert(uri, content); xdmp.commit();";
  
  xdmp.eval(doc, {content: content, uri: uri}, {database: xdmp.database('node-client-api-rest-server')});
  console.log("INSERT -> uri value is : %s", uri);
  console.log("INSERT -> content value is : %s", content.value);
}

}

var t = TestE2EMultiStringsIn(xdmp.getRequestField("inputFiles"), xdmp.getRequestField("uris"));