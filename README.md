# MarkLogic Node.js Client API

The MarkLogic Node.js Client API provides access to the MarkLogic database
from Node.js applications.

## Features

*  Writing, reading, patching, and deleting documents in JSON, XML, text, or binary formats
*  Querying over documents including parsing string queries, extracting properties, and calculating facets
*  Projecting tuples (like table rows) out of documents
*  Single transactions and multi-statement transactions for database changes
*  Writing, reading, and deleting graphs and executing SPARQL queries over graphs
*  Extending the built-in services or evaluating or invoking your own JavaScript or XQuery on the server
*  Basic, digest, certificate, and Kerberos authentication

## Status

Release 2.0.1 of the MarkLogic Node.js Client API

## New Features in Release 2.0.1

- Certificate authentication
- Kerberos authentication
- Geospatial region search
- Double precision values for geospatial queries
- Temporal operations, including protect and wipe
- Metadata values
- Specifying a minimum distance for near queries
- Bug fixes and documentation enhancements

## Getting Started

You can install the marklogic package as a dependency for your Node.js project
using [npm](https://www.npmjs.com/package/marklogic):

```
npm install marklogic --save
```

With the marklogic package installed, the following inserts two documents in a
collection into the Documents database using MarkLogic's built-in REST server
at port 8000:

```javascript
var marklogic = require('marklogic');

var db = marklogic.createDatabaseClient({
  host:     'localhost',
  port:     '8000',
  database: 'Documents',
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

### Resources

Here are some online resources that walk you through working with MarkLogic
using the Node.js Client API:

* [MarkLogic Node.js Client API](http://developer.marklogic.com/features/node-client-api)
* [Introduction to the Node.js Client API - Getting Started](http://docs.marklogic.com/guide/node-dev/intro#id_68052)

The instructions describe:

* installing the MarkLogic database and setting up an admin user
* installing the Node.js Client API using npm
* working through some initial examples to get familiar with the API

### Code Examples

The Node.js Client API ships with code examples to supplement the examples
in the online resources. To run the examples, follow the instructions here:

    examples/1readme.txt

### Generating Documentation

After installing the project dependencies (including the gulp build system),
you can build the reference documentation locally from the root directory of the
marklogic package:

    gulp doc

The documentation is generated in a doc subdirectory.

### Running Tests

To set up the database and REST server for tests, execute the following
command from the root directory for the marklogic package:

    node etc/test-setup.js

After setup, you can run tests for the Node.js Client API with the following
command:

    gulp test

To tear down the test database and REST server, execute the following:

    node etc/test-teardown.js

## Support

The MarkLogic Node.js Client API is maintained by MarkLogic Engineering.
It is designed for use in production applications with MarkLogic Server.
Everyone is encouraged to file bug reports, feature requests, and pull
requests through GitHub. This input is critical and will be carefully
considered, but we can’t promise a specific resolution or timeframe for
any request. In addition, MarkLogic provides technical support
for [release tags](https://github.com/marklogic/node-client-api/releases)
of the Node.js Client API to licensed customers under the terms outlined
in the [Support Handbook](http://www.marklogic.com/files/Mark_Logic_Support_Handbook.pdf).
For more information or to sign up for support,
visit [help.marklogic.com](http://help.marklogic.com).
