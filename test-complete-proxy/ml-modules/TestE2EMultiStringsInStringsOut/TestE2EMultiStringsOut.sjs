function TestE2EMultiStringsOut(searchItem_in) {

var searchItem; // instance of xs.string+
searchItem = searchItem_in;
var results =  [];
var modRet; 

var query = `for (const hit of cts.search(cts.wordQuery(searchItem))) {
					results.push(fn.documentUri(hit));
				} 
				results;
				`;
modRet = xdmp.eval(query, {searchItem: searchItem, results: results}, {database: xdmp.database('node-client-api-rest-server')});

return modRet;
}

var t = TestE2EMultiStringsOut(xdmp.getRequestField("searchItem"));
t;