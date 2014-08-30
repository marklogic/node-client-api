# MarkLogic Client API for node.js

The MarkLogic Client API for node.js provides access to the MarkLogic database
from node.js.

## Status

This branch provides the work in progress for the Early Access Release 3 of the  MarkLogic node.js API.

### Checked in for EA3

* values and tuples requests
* server-side transforms on query response summary and result documents in withOptions
* snippets including custom snippets in slice()
* projection from result documents (extract) -- except for namespaces
* resource service CRUD and invocation for XQuery -- except JavaScript
* graph CRUD and SPARQL query -- except streaming IO

### Candidate features for EA3

* aggregates on facets
* server-side eval
* specifying the database when creating a database client
* pluggable XML conversion

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

### Capabilities of the node.js Client API in Early Access 2

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

### Limitations in Early Access 2

The MarkLogic node.js Client API has not yet undergone performance or
stress testing.  The API should not be used in production in EA2.
