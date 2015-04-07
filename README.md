# MarkLogic Client API for Node.js

The MarkLogic Client API for Node.js provides access to the MarkLogic database
from Node.js applications.

## Features

*  Writing, reading, patching, and deleting documents in JSON, XML, text, or binary formats
*  Querying over documents including parsing string queries, extracting properties, and calculating facets
*  Projecting tuples (like table rows) out of documents
*  Single transactions and multi-statement transactions for database changes
*  Writing, reading, and deleting graphs and executing SPARQL queries over graphs
*  Extending the built-in services or evaluating or invoking your own JavaScript or XQuery on the server

## Status

Release 1.0.2 of the MarkLogic Node.js API

## Sample

First, install the MarkLogic into your local modules using [npm](https://www.npmjs.com/package/marklogic).

```
npm install marklogic --save
```

The following example creates two documents in a collection using the built-in
REST server for the Documents database:

```javascript
var marklogic = require('marklogic');

var db = marklogic.createDatabaseClient({
  host:     'localhost',
  port:     '8000',
  user:     'admin',
  password: 'admin',
  authType: 'DIGEST'
});

db.createCollection(
  '/books',
  {author: 'Beryl Markham', ...},
  {author: 'WG Sebald',     ...}
  )
.result(function(response) {
    console.log(JSON.stringify(response,null,2));
  }, function (error) {
    console.log(JSON.stringify(error,null,2));
  });
```

Other calls can create additional documents for the same collection.

## Getting started

Here are some resources that walk you through working with MarkLogic using the Node.js API:

* http://developer.marklogic.com/features/node-client-api
* http://docs.marklogic.com/guide/node-dev/intro#id_68052

The instructions describe:

* installing the MarkLogic database and setting up an admin user
* installing the Node.js API using npm
* working through some initial examples to get familiar with the API

### Example setup

The Node.js API also distributes with some additional examples to supplement
the examples from the Getting Started introduction.

Follow the instructions in the example distribution:

    examples/1readme.txt

### Documentation setup

After installing the dependencies including gulp, you can also build the reference
documentation locally from the root directory of the marklogic package:

    gulp doc

The documentation should be produced in the doc subdirectory.

### Test setup and teardown

To set up the test database and REST server, execute the following
command in the root directory for the marklogic package:

    node etc/test-setup.js

To tear down the test database and REST server, execute

    node etc/test-teardown.js

## Support

The MarkLogic Node.js Client API is maintained by MarkLogic Engineering.
It is designed for use in production applications with MarkLogic Server.
Everyone is encouraged to file bug reports, feature requests, and pull
requests through GitHub. This input is critical and will be carefully
considered, but we can’t promise a specific resolution or timeframe for
any request. In addition, MarkLogic provides technical support
for [release tags](https://github.com/marklogic/node-client-api/releases)
of the Node Client API to licensed customers under the terms outlined
in the [Support Handbook](http://www.marklogic.com/files/Mark_Logic_Support_Handbook.pdf).
For more information or to sign up for support,
visit [help.marklogic.com](http://help.marklogic.com).
