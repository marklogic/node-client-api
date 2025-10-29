# MarkLogic Node.js Client API

The MarkLogic Node.js Client API provides access to the MarkLogic database
from Node.js applications.

## Features

* Writing, reading, patching, and deleting documents in JSON, XML, text, or binary formats
* Querying over documents including parsing string queries, extracting properties, and calculating facets
* Projecting tuples (like table rows) out of documents
* Single transactions and multi-statement transactions for database changes
* Writing, reading, and deleting graphs and executing SPARQL queries over graphs
* Extending the built-in services or evaluating or invoking your own JavaScript or XQuery on the server
* Basic, digest, certificate, Kerberos, and SAML authentication
* Import libraries as JavaScript mjs modules
* Data Services First - MarkLogic's support for microservices
* Optic query DSL, document matching, relevance, multiple groups
* Generate query based views, redaction on rows
* Data Movement SDK - move large amounts of data into, out of, or within a MarkLogic cluster

## Getting Started

You can install the marklogic package as a dependency for your Node.js project
using [npm](https://www.npmjs.com/package/marklogic):

```
npm install marklogic --save
```

For Windows OS please use the below for Node Client 2.9.1:
```
npm install marklogic --save --ignore-scripts
```

With the marklogic package installed, the following inserts two documents in a
collection into the Documents database using MarkLogic's built-in REST server
at port 8000:

```javascript
const marklogic = require('marklogic');

const db = marklogic.createDatabaseClient({
  host:     'localhost',
  port:     '8000',
  database: 'Documents',
  user:     'admin',
  password: 'admin',
  authType: 'DIGEST',
  // enableGzippedResponses is optional and can be set to true in order to request MarkLogic to compress the response for better performance,
    // the client will automatically decompress the response before it returns a value.
  enableGzippedResponses: true
});

// For MarkLogic Cloud
const db = marklogic.createDatabaseClient({
    apiKey:   'changeme',
    host:     'example.beta.marklogic.com',
    authType: 'cloud',
    // basePath is optional.
    basePath: '/marklogic/test',
    // accessTokenDuration (in seconds) is optional and can be used to customize the expiration of the access token.
    accessTokenDuration: 10,
    // enableGzippedResponses is optional and can be set to true in order to request MarkLogic to compress the response for better performance,
    // the client will automatically decompress the response before it returns a value.
    enableGzippedResponses: true
});

// For OAUTH
const db = marklogic.createDatabaseClient({
    host:     'localhost',
    port:     '8000',
    authType: 'oauth',
    oauthToken: '<OAUTH Token>'
});

db.createCollection(
  '/books',
  {author: 'Beryl Markham', ...},
  {author: 'WG Sebald',     ...}
  )
.result(function(response) {
    console.log(JSON.stringify(response, null, 2));
  }, function (error) {
    console.log(JSON.stringify(error, null, 2));
  });
```

### Resources

* [Node.js Client API Documentation](https://docs.marklogic.com/jsdoc/index.html)
* [Node.js Application Developer's Guide](https://docs.progress.com/bundle/marklogic-server-develop-with-node-js-11/page/topics/intro.html)
* [MarkLogic Overview](https://www.progress.com/marklogic)

### Code Examples

The Node.js Client API ships with code examples to supplement the examples
in the online resources. To run the examples, follow the instructions here:

    examples/1readme.txt

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
