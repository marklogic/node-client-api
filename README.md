# MarkLogic Client API for Node.js

The MarkLogic Client API for Node.js provides access to the MarkLogic database
from Node.js.

## Status

This branch provides the work in progress for the Early Access Release 3 of the MarkLogic Node.js API.

## Getting started

Please register at the MarkLogic Early Access website and then follow the tutorial instructions:

http://ea.marklogic.com/features/node-js-client-api/

The instructions describe:

* installing the MarkLogic database and setting up an admin user
* cloning this repository to set up the API
* working through some initial examples to get familiar with the API

For more detail about the API, use the documentation login from the Early Access to view
the reference documentation:

http://docs-ea.marklogic.com/jsdoc/index.html

After installing the dependencies including gulp, you can also build the documentation locally
from the root directory of the marklogic package:

    gulp doc

The documentation should be produced in the doc subdirectory.

### Example setup

To set up the REST users for the examples, execute the following
command in the root directory for the marklogic package:

    node etc/users-setup.js

Then, load the sample data:

    node examples/before-load.js

You can then execute any of the examples in the examples
subdirectory from the root directory for the marklogic package.

### Test setup and teardown

To set up the test database and REST server, execute the following
command in the root directory for the marklogic package:

    node etc/test-setup.js

To tear down the test database and REST server, execute

    node etc/test-teardown.js

### Capabilities added to the Node.js Client API in Early Access 3

* quick path for simple CRUD and query on the database client
* values and tuples requests
* server-side transforms on query response summary and result documents in slice() clause
* snippets including custom snippets in slice() clause
* extract from result documents (projection)
* resource service CRUD and invocation
* graph CRUD and SPARQL query
* bitemporal document CRUD and query
* specifying the database when creating a database client
* server-side eval and invoke
* search suggest

### Capabilities of the Node.js Client API in Early Access 2

* createDatabaseClient() including HTTPS
* documents.query()
    * queryBuilder.where() including structured query builder
    * queryBuilder.byExample() for QBE (Query By Example)
    * queryBuilder.parsedFrom() for string query
    * queryBuilder.orderBy()
    * queryBuilder.calculate()
    * queryBuilder.slice()
    * queryBuilder.withOptions()
    * queryBuilder.parsedFrom()
    * queryBuilder.copyFrom()
* documents.check()
* documents.remove()
* documents.read()
* documents.createReadStream()
* documents.write()
* documents.createWriteStream()
* documents.removeAll()
* documents.patch()
* transactions.open()
* transactions.read()
* transactions.commit()
* transactions.rollback()
* config.transforms.list()
* config.transforms.read()
* config.transforms.remove()
* config.transforms.write()
* config.properties.read()
* config.properties.write()
* config.extlibs.list()
* config.extlibs.read()
* config.extlibs.remove()
* config.extlibs.write()
* optimistic locking

### Limitations in Early Access 3

The MarkLogic Node.js Client API has not yet undergone performance or
stress testing.  The API should not be used in production in EA3.  The
interface may change before the initial release.

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
For more information or to sign up for support, visit [help.marklogic.com](help.marklogic.com).
